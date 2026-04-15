// ============================================================
// api/transcricoes.js — Transcrições de Reuniões
// CORREÇÕES:
//  - CLIENT_ID/CLIENT_SECRET via env (era hardcoded!)
//  - TRANSCRICOES_SECRET obrigatório (não tem mais fallback fraco)
//  - Reusa helper compartilhado de validação de sessão
//  - CORS restrito por allowlist
// ============================================================
import crypto from 'crypto';
import { aplicarCORS, validarSessao } from './_lib/auth.js';

const PASTA_RAIZ = 'Transcrições OTX';

// ── Carrega config dos envs (sem fallback) ──────────────────
function getConfig() {
  return {
    CLIENT_ID:     (process.env.GOOGLE_CLIENT_ID     || '').trim(),
    CLIENT_SECRET: (process.env.GOOGLE_CLIENT_SECRET || '').trim(),
    SECRET_KEY:    (process.env.TRANSCRICOES_SECRET  || '').trim(),
  };
}

// ── Criptografia AES-256-CBC ───────────────────────────────
function criptografar(texto, secretKey) {
  const iv  = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(secretKey).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const enc = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + enc.toString('hex');
}

function descriptografar(dados, secretKey) {
  const [ivHex, encHex] = dados.split(':');
  const iv  = Buffer.from(ivHex, 'hex');
  const key = crypto.createHash('sha256').update(secretKey).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const dec = Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]);
  return dec.toString('utf8');
}

async function refreshAccessToken(refreshToken, cfg) {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     cfg.CLIENT_ID,
      client_secret: cfg.CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type:    'refresh_token',
    }),
  });
  const data = await r.json();
  if (!r.ok || data.error) throw new Error('Erro ao renovar token Google: ' + (data.error || ''));
  return data.access_token;
}

async function buscarOuCriarPasta(token, nome, paiId = null) {
  const q = paiId
    ? `name='${nome}' and mimeType='application/vnd.google-apps.folder' and '${paiId}' in parents and trashed=false`
    : `name='${nome}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

  const busca = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const bd = await busca.json();
  if (bd.files && bd.files.length > 0) return bd.files[0].id;

  const meta = { name: nome, mimeType: 'application/vnd.google-apps.folder' };
  if (paiId) meta.parents = [paiId];
  const criacao = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(meta),
  });
  const cd = await criacao.json();
  if (!criacao.ok) throw new Error('Erro ao criar pasta no Drive: ' + (cd.error?.message || ''));
  return cd.id;
}

async function listarArquivos(token, pastaId, de, ate) {
  let q = `'${pastaId}' in parents and trashed=false and name contains '.enc'`;
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,createdTime,description)&orderBy=createdTime desc&pageSize=200`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await r.json();
  let arquivos = data.files || [];

  if (de || ate) {
    arquivos = arquivos.filter(f => {
      const dt = new Date(f.createdTime);
      const dDe  = de  ? new Date(de  + 'T00:00:00') : null;
      const dAte = ate ? new Date(ate + 'T23:59:59') : null;
      return (!dDe || dt >= dDe) && (!dAte || dt <= dAte);
    });
  }

  return arquivos.map(f => ({
    id:        f.id,
    nome:      f.name.replace('.enc', ''),
    titulo:    (f.description || '').split('||')[0] || f.name.replace('.enc', ''),
    dataHora:  (f.description || '').split('||')[1] || null,
    data:      (f.description || '').split('||')[1] || new Date(f.createdTime).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    participantes: (f.description || '').split('||')[2] || '',
    dataISO:   f.createdTime,
  }));
}

async function lerArquivo(token, fileId) {
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error('Erro ao ler arquivo do Drive');
  return await r.text();
}

async function salvarArquivo(token, pastaId, nomeArquivo, titulo, conteudo, dataHora, participantes, secretKey) {
  const conteudoCriptografado = criptografar(conteudo, secretKey);

  const meta = {
    name:        nomeArquivo + '.enc',
    description: titulo + "||" + (dataHora || new Date().toLocaleString("pt-BR")) + "||" + (participantes || ""),
    parents:     [pastaId],
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  form.append('file',     new Blob([conteudoCriptografado], { type: 'text/plain' }));

  const r = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',
    { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }
  );
  const data = await r.json();
  if (!r.ok) throw new Error('Erro ao salvar no Drive: ' + (data.error?.message || ''));
  return data;
}

// ════════════════════════════════════════════════════════════
// HANDLER
// ════════════════════════════════════════════════════════════
export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const cfg = getConfig();
  if (!cfg.CLIENT_ID || !cfg.CLIENT_SECRET) {
    return res.status(500).json({ erro: 'Credenciais do Google não configuradas no servidor.' });
  }
  if (!cfg.SECRET_KEY || cfg.SECRET_KEY.length < 16) {
    return res.status(500).json({ erro: 'TRANSCRICOES_SECRET não configurada (mínimo 16 caracteres).' });
  }

  const usuario = validarSessao(req);
  if (!usuario) return res.status(401).json({ erro: 'Sessão inválida.' });

  let googleToken    = req.headers['x-google-token']         || '';
  const refreshToken = req.headers['x-google-refresh-token'] || '';

  if (!googleToken && refreshToken) {
    try { googleToken = await refreshAccessToken(refreshToken, cfg); }
    catch (e) { return res.status(401).json({ erro: 'Token Google expirado. Reconecte o Google.' }); }
  }

  async function comRenovacao(fn) {
    try { return await fn(googleToken); }
    catch (e) {
      if ((e.message?.includes('401') || e.message?.includes('invalid')) && refreshToken) {
        try {
          googleToken = await refreshAccessToken(refreshToken, cfg);
          return await fn(googleToken);
        } catch (e2) {
          throw new Error('Token Google expirado. Reconecte o Google no Dashboard.');
        }
      }
      throw e;
    }
  }

  if (!googleToken) {
    if (req.method === 'GET') return res.status(200).json({ ok: true, arquivos: [], usuario: usuario.usuario });
    return res.status(401).json({ erro: 'Token Google não encontrado. Reconecte o Google no Dashboard.' });
  }

  const loginUsuario = usuario.usuario || 'usuario';
  const isAdmin      = usuario.admin === true;

  try {
    if (req.method === 'GET' && !req.query.id && !req.query.admin) {
      const { de, ate } = req.query;
      const pastaRaizId    = await comRenovacao(t => buscarOuCriarPasta(t, PASTA_RAIZ));
      const pastaUsuarioId = await comRenovacao(t => buscarOuCriarPasta(t, loginUsuario, pastaRaizId));
      const arquivos = await comRenovacao(t => listarArquivos(t, pastaUsuarioId, de, ate));
      const resp = { ok: true, arquivos, usuario: loginUsuario };
      if (googleToken !== (req.headers['x-google-token'] || '')) resp.newAccessToken = googleToken;
      return res.status(200).json(resp);
    }

    if (req.method === 'GET' && req.query.admin === '1') {
      if (!isAdmin) return res.status(403).json({ erro: 'Acesso restrito ao administrador.' });

      const { de, ate } = req.query;
      let todosUsuarios = [];
      try {
        const raw = (process.env.DASHBOARD_USERS || '').trim();
        if (raw) todosUsuarios = JSON.parse(raw).map(u => u.usuario);
        else {
          const u = (process.env.DASHBOARD_USER || '').trim();
          if (u) todosUsuarios = [u];
        }
      } catch (_) { todosUsuarios = []; }

      const pastaRaizId = await buscarOuCriarPasta(googleToken, PASTA_RAIZ);
      const resultado = [];

      for (const login of todosUsuarios) {
        try {
          const pastaId  = await buscarOuCriarPasta(googleToken, login, pastaRaizId);
          const arquivos = await listarArquivos(googleToken, pastaId, de, ate);
          resultado.push({ usuario: login, total: arquivos.length, arquivos });
        } catch (e) {
          resultado.push({ usuario: login, total: 0, arquivos: [], erro: e.message });
        }
      }
      return res.status(200).json({ ok: true, usuarios: resultado });
    }

    if (req.method === 'GET' && req.query.id) {
      const fileId      = req.query.id;
      const conteudoEnc = await lerArquivo(googleToken, fileId);
      const conteudo    = descriptografar(conteudoEnc, cfg.SECRET_KEY);
      return res.status(200).json({ ok: true, conteudo });
    }

    if (req.method === 'POST') {
      const { titulo, conteudo, participantes, dataHoraCliente } = req.body || {};
      if (typeof titulo !== 'string' || typeof conteudo !== 'string') {
        return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios.' });
      }
      if (titulo.length > 200 || conteudo.length > 500000) {
        return res.status(400).json({ erro: 'Tamanho excedido.' });
      }

      const pastaRaizId    = await comRenovacao(t => buscarOuCriarPasta(t, PASTA_RAIZ));
      const pastaUsuarioId = await comRenovacao(t => buscarOuCriarPasta(t, loginUsuario, pastaRaizId));

      const agora       = new Date();
      const dataStr     = agora.toISOString().split('T')[0];
      const slugTitulo  = titulo.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      const nomeArquivo = `${dataStr}_${slugTitulo}`;

      const conteudoCompleto = [
        `TÍTULO: ${titulo}`,
        `DATA: ${dataHoraCliente || agora.toLocaleString('pt-BR')}`,
        `USUÁRIO: ${loginUsuario}`,
        participantes ? `PARTICIPANTES: ${participantes}` : '',
        '',
        '='.repeat(60),
        '',
        conteudo,
      ].filter(l => l !== null && l !== undefined).join('\n');

      const arquivo = await salvarArquivo(googleToken, pastaUsuarioId, nomeArquivo, titulo, conteudoCompleto, dataHoraCliente, participantes, cfg.SECRET_KEY);
      return res.status(200).json({ ok: true, arquivo, mensagem: 'Transcrição salva com sucesso!' });
    }

    if (req.method === 'DELETE' && req.query.id) {
      const fileId = req.query.id;
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${googleToken}` },
      });
      return res.status(200).json({ ok: true, mensagem: 'Transcrição removida.' });
    }

    return res.status(405).json({ erro: 'Método não permitido.' });

  } catch (e) {
    console.error('[transcricoes]', e.message);
    if (e.message?.includes('401') || e.message?.includes('invalid_grant')) {
      return res.status(401).json({ erro: 'Token Google expirado. Reconecte o Google Agenda.' });
    }
    return res.status(500).json({ erro: e.message });
  }
}
