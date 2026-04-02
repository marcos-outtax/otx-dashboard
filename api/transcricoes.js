// ============================================================
// api/transcricoes.js — Transcrições de Reuniões
// Salva/lê resumos criptografados no Google Drive do usuário
// ============================================================
import crypto from 'crypto';

const CLIENT_ID     = '1027473122132-bb82qm1hh54qtrc11uuffcbe0d9ltmu4.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const SECRET_KEY    = process.env.TRANSCRICOES_SECRET || 'outtax-transcricoes-secret-32chr!';
const PASTA_RAIZ    = 'Transcrições OTX';

// ── Criptografia AES-256-CBC ─────────────────────────────────
function criptografar(texto) {
  const iv     = crypto.randomBytes(16);
  const key    = crypto.createHash('sha256').update(SECRET_KEY).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const enc    = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + enc.toString('hex');
}

function descriptografar(dados) {
  const [ivHex, encHex] = dados.split(':');
  const iv      = Buffer.from(ivHex, 'hex');
  const key     = crypto.createHash('sha256').update(SECRET_KEY).digest();
  const decipher= crypto.createDecipheriv('aes-256-cbc', key, iv);
  const dec     = Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]);
  return dec.toString('utf8');
}

// ── Refresh do access token Google ───────────────────────────
async function refreshAccessToken(refreshToken) {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type:    'refresh_token',
    }),
  });
  const data = await r.json();
  if (!r.ok || data.error) throw new Error('Token Google expirado. Reconecte o Google Agenda.');
  return data.access_token;
}

// ── Verifica sessão — mesmo algoritmo do auth.js ─────────────
function verificarSessao(req) {
  const tokenRecebido = (req.headers['x-session-token'] || '').trim();
  if (!tokenRecebido) return null;

  // Carrega usuários — mesma lógica do auth.js
  let usuarios = [];
  try {
    const raw = (process.env.DASHBOARD_USERS || '').trim();
    if (raw) {
      usuarios = JSON.parse(raw);
    } else {
      const u = (process.env.DASHBOARD_USER     || '').trim();
      const s = (process.env.DASHBOARD_PASSWORD || '').trim();
      if (u && s) usuarios = [{ usuario: u, senha: s, nome: u, admin: true }];
    }
  } catch (_) { return null; }

  // Recalcula o token de cada usuário e compara
  for (const user of usuarios) {
    const tokenEsperado = 'otx-' + Buffer.from(user.usuario + user.senha)
      .toString('hex')
      .substring(0, 32);
    if (tokenRecebido === tokenEsperado) {
      return {
        usuario: user.usuario,
        nome:    user.nome || user.usuario,
        admin:   user.admin === true,
      };
    }
  }
  return null;
}

// ── Drive: busca ou cria pasta ────────────────────────────────
async function buscarOuCriarPasta(token, nome, paiId = null) {
  const q = paiId
    ? `name='${nome}' and mimeType='application/vnd.google-apps.folder' and '${paiId}' in parents and trashed=false`
    : `name='${nome}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const d = await r.json();
  if (d.files?.length) return d.files[0].id;

  // Cria a pasta
  const meta = { name: nome, mimeType: 'application/vnd.google-apps.folder' };
  if (paiId) meta.parents = [paiId];
  const rc = await fetch('https://www.googleapis.com/drive/v3/files', {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(meta),
  });
  const dc = await rc.json();
  if (!rc.ok) throw new Error('Erro ao criar pasta no Drive: ' + (dc.error?.message || ''));
  return dc.id;
}

// ── Drive: lista arquivos ─────────────────────────────────────
async function listarArquivos(token, pastaId, de, ate) {
  const q = `'${pastaId}' in parents and trashed=false`;
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,createdTime,description)&orderBy=createdTime desc&pageSize=200`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await r.json();
  let arquivos = data.files || [];

  if (de || ate) {
    arquivos = arquivos.filter(f => {
      const dt   = new Date(f.createdTime);
      const dDe  = de  ? new Date(de  + 'T00:00:00') : null;
      const dAte = ate ? new Date(ate + 'T23:59:59') : null;
      return (!dDe || dt >= dDe) && (!dAte || dt <= dAte);
    });
  }

  return arquivos.map(f => ({
    id:      f.id,
    nome:    f.name.replace('.enc', ''),
    titulo:  f.description || f.name.replace('.enc', ''),
    data:    new Date(f.createdTime).toLocaleDateString('pt-BR'),
    dataISO: f.createdTime,
  }));
}

// ── Drive: lê conteúdo de um arquivo ─────────────────────────
async function lerArquivo(token, fileId) {
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error('Erro ao ler arquivo do Drive');
  return await r.text();
}

// ── Drive: salva arquivo criptografado ────────────────────────
async function salvarArquivo(token, pastaId, nomeArquivo, titulo, conteudo) {
  const enc  = criptografar(conteudo);
  const meta = { name: nomeArquivo + '.enc', description: titulo, parents: [pastaId] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  form.append('file',     new Blob([enc], { type: 'text/plain' }));
  const r = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',
    { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }
  );
  const d = await r.json();
  if (!r.ok) throw new Error('Erro ao salvar no Drive: ' + (d.error?.message || ''));
  return d;
}

// ════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ════════════════════════════════════════════════════════════
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token, X-Google-Token, X-Google-Refresh-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Valida sessão ────────────────────────────────────────
  const usuario = verificarSessao(req);
  if (!usuario) return res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });

  // ── Obtém token Google ───────────────────────────────────
  let googleToken         = (req.headers['x-google-token']          || '').trim();
  const googleRefresh     = (req.headers['x-google-refresh-token']  || '').trim();

  if (!googleToken && googleRefresh) {
    try { googleToken = await refreshAccessToken(googleRefresh); }
    catch (e) { return res.status(401).json({ erro: e.message }); }
  }
  if (!googleToken) {
    return res.status(401).json({ erro: 'Token Google não encontrado. Conecte o Google Agenda nas configurações.' });
  }

  const loginUsuario = usuario.usuario;
  const isAdmin      = usuario.admin;

  try {

    // ── GET ?id=xxx — lê e descriptografa um arquivo ─────
    if (req.method === 'GET' && req.query.id) {
      const conteudoEnc = await lerArquivo(googleToken, req.query.id);
      const conteudo    = descriptografar(conteudoEnc);
      return res.status(200).json({ ok: true, conteudo });
    }

    // ── GET ?admin=1 — visão admin (todos os usuários) ───
    if (req.method === 'GET' && req.query.admin === '1') {
      if (!isAdmin) return res.status(403).json({ erro: 'Acesso restrito ao administrador.' });

      const { de, ate } = req.query;
      let todosUsuarios = [];
      try {
        const raw = (process.env.DASHBOARD_USERS || '').trim();
        if (raw) {
          todosUsuarios = JSON.parse(raw).map(u => u.usuario);
        } else {
          const u = (process.env.DASHBOARD_USER || '').trim();
          if (u) todosUsuarios = [u];
        }
      } catch (_) {}

      const pastaRaizId = await buscarOuCriarPasta(googleToken, PASTA_RAIZ);
      const resultado   = [];

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

    // ── GET — lista transcrições do usuário logado ───────
    if (req.method === 'GET') {
      const { de, ate } = req.query;
      const pastaRaizId    = await buscarOuCriarPasta(googleToken, PASTA_RAIZ);
      const pastaUsuarioId = await buscarOuCriarPasta(googleToken, loginUsuario, pastaRaizId);
      const arquivos       = await listarArquivos(googleToken, pastaUsuarioId, de, ate);
      return res.status(200).json({ ok: true, arquivos, usuario: loginUsuario });
    }

    // ── POST — salva nova transcrição ────────────────────
    if (req.method === 'POST') {
      const { titulo, conteudo, participantes } = req.body || {};
      if (!titulo || !conteudo) {
        return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios.' });
      }

      const pastaRaizId    = await buscarOuCriarPasta(googleToken, PASTA_RAIZ);
      const pastaUsuarioId = await buscarOuCriarPasta(googleToken, loginUsuario, pastaRaizId);

      const agora      = new Date();
      const dataStr    = agora.toISOString().split('T')[0];
      const slug       = titulo.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      const nomeArq    = `${dataStr}_${slug}`;

      const conteudoCompleto = [
        `TÍTULO: ${titulo}`,
        `DATA: ${agora.toLocaleString('pt-BR')}`,
        `USUÁRIO: ${loginUsuario}`,
        participantes ? `PARTICIPANTES: ${participantes}` : '',
        '',
        '='.repeat(60),
        '',
        conteudo,
      ].filter(l => l !== null && l !== undefined).join('\n');

      const arquivo = await salvarArquivo(googleToken, pastaUsuarioId, nomeArq, titulo, conteudoCompleto);
      return res.status(200).json({ ok: true, arquivo, mensagem: 'Transcrição salva com sucesso!' });
    }

    // ── DELETE ?id=xxx — remove arquivo ─────────────────
    if (req.method === 'DELETE' && req.query.id) {
      await fetch(`https://www.googleapis.com/drive/v3/files/${req.query.id}`, {
        method:  'DELETE',
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
