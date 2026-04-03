// api/transcricoes.js
import crypto from 'crypto';

const CLIENT_ID      = '1027473122132-bb82qm1hh54qtrc11uuffcbe0d9ltmu4.apps.googleusercontent.com';
const CLIENT_SECRET  = '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';
const SECRET_KEY     = process.env.TRANSCRICOES_SECRET || 'outtax-transcricoes-secret-32chr!';
const PASTA_RAIZ     = 'Transcricoes OTX';

// ── Criptografia ──────────────────────────────────────────
function criptografar(texto) {
  const iv  = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
  const c   = crypto.createCipheriv('aes-256-cbc', key, iv);
  const enc = Buffer.concat([c.update(texto, 'utf8'), c.final()]);
  return iv.toString('hex') + ':' + enc.toString('hex');
}

function descriptografar(dados) {
  const [ivHex, encHex] = dados.split(':');
  const iv  = Buffer.from(ivHex, 'hex');
  const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
  const d   = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([d.update(Buffer.from(encHex, 'hex')), d.final()]).toString('utf8');
}

// ── Valida sessao — mesmo algoritmo do auth.js ────────────
function verificarSessao(req) {
  const token = (req.headers['x-session-token'] || '').trim();
  if (!token) return null;

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

  for (const user of usuarios) {
    const esperado = 'otx-' + Buffer.from(user.usuario + user.senha)
      .toString('hex').substring(0, 32);
    if (token === esperado) {
      return { usuario: user.usuario, nome: user.nome || user.usuario, admin: user.admin === true };
    }
  }
  return null;
}

// ── Renova access token usando refresh token ──────────────
async function renovarToken(refreshToken) {
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
  const d = await r.json();
  if (!r.ok || d.error) throw new Error('Token Google expirado. Reconecte o Google no Dashboard.');
  return d.access_token;
}

// ── Obtém token Google válido ─────────────────────────────
async function obterTokenGoogle(req) {
  let token   = (req.headers['x-google-token']          || '').trim();
  const refresh = (req.headers['x-google-refresh-token'] || '').trim();

  // Se tem refresh token, renova automaticamente
  if (refresh) {
    try { token = await renovarToken(refresh); } catch (_) {}
  }

  // Se ainda não tem token, erro
  if (!token) {
    throw new Error('Token Google nao encontrado. Conecte o Google Agenda no Dashboard.');
  }
  return token;
}

// ── Drive helpers ─────────────────────────────────────────
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

  const meta = { name: nome, mimeType: 'application/vnd.google-apps.folder' };
  if (paiId) meta.parents = [paiId];
  const rc = await fetch('https://www.googleapis.com/drive/v3/files', {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(meta),
  });
  const dc = await rc.json();
  if (!rc.ok) throw new Error('Erro ao criar pasta: ' + (dc.error?.message || ''));
  return dc.id;
}

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
      const dt  = new Date(f.createdTime);
      const dDe = de  ? new Date(de  + 'T00:00:00') : null;
      const dAt = ate ? new Date(ate + 'T23:59:59') : null;
      return (!dDe || dt >= dDe) && (!dAt || dt <= dAt);
    });
  }
  return arquivos.map(f => ({
    id:     f.id,
    nome:   f.name.replace('.enc', ''),
    titulo: f.description || f.name.replace('.enc', ''),
    data:   new Date(f.createdTime).toLocaleDateString('pt-BR'),
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

async function salvarArquivo(token, pastaId, nome, titulo, conteudo) {
  const enc  = criptografar(conteudo);
  const meta = { name: nome + '.enc', description: titulo, parents: [pastaId] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  form.append('file',     new Blob([enc], { type: 'text/plain' }));
  const r = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',
    { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }
  );
  const d = await r.json();
  if (!r.ok) throw new Error('Erro ao salvar: ' + (d.error?.message || ''));
  return d;
}

// ════════════════════════════════════════════════════════
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token, X-Google-Token, X-Google-Refresh-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Valida sessao
  const usuario = verificarSessao(req);
  if (!usuario) return res.status(401).json({ erro: 'Sessao invalida. Faca login novamente.' });

  const login   = usuario.usuario;
  const isAdmin = usuario.admin;

  try {
    // Obtem token Google (renova automaticamente se tiver refresh)
    const googleToken = await obterTokenGoogle(req);

    // ── GET ?id=xxx — le e descriptografa ──────────────
    if (req.method === 'GET' && req.query.id) {
      const enc = await lerArquivo(googleToken, req.query.id);
      return res.json({ ok: true, conteudo: descriptografar(enc) });
    }

    // ── GET ?admin=1 — visao admin ─────────────────────
    if (req.method === 'GET' && req.query.admin === '1') {
      if (!isAdmin) return res.status(403).json({ erro: 'Acesso restrito ao administrador.' });
      const { de, ate } = req.query;

      let todos = [];
      try {
        const raw = (process.env.DASHBOARD_USERS || '').trim();
        todos = raw ? JSON.parse(raw).map(u => u.usuario) : [(process.env.DASHBOARD_USER || '')];
      } catch (_) {}

      const raiz = await buscarOuCriarPasta(googleToken, PASTA_RAIZ);
      const resultado = [];
      for (const u of todos.filter(Boolean)) {
        try {
          const pid = await buscarOuCriarPasta(googleToken, u, raiz);
          const arq = await listarArquivos(googleToken, pid, de, ate);
          resultado.push({ usuario: u, total: arq.length, arquivos: arq });
        } catch (e) {
          resultado.push({ usuario: u, total: 0, arquivos: [], erro: e.message });
        }
      }
      return res.json({ ok: true, usuarios: resultado });
    }

    // ── GET — lista do usuario ─────────────────────────
    if (req.method === 'GET') {
      const { de, ate } = req.query;
      const raiz = await buscarOuCriarPasta(googleToken, PASTA_RAIZ);
      const pid  = await buscarOuCriarPasta(googleToken, login, raiz);
      const arq  = await listarArquivos(googleToken, pid, de, ate);
      return res.json({ ok: true, arquivos: arq, usuario: login });
    }

    // ── POST — salva nova transcricao ──────────────────
    if (req.method === 'POST') {
      const { titulo, conteudo, participantes } = req.body || {};
      if (!titulo || !conteudo) return res.status(400).json({ erro: 'Titulo e conteudo obrigatorios.' });

      const raiz = await buscarOuCriarPasta(googleToken, PASTA_RAIZ);
      const pid  = await buscarOuCriarPasta(googleToken, login, raiz);

      const agora = new Date();
      const slug  = titulo.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      const nome  = agora.toISOString().split('T')[0] + '_' + slug;

      const corpo = [
        'TITULO: ' + titulo,
        'DATA: '   + agora.toLocaleString('pt-BR'),
        'USUARIO: '+ login,
        participantes ? 'PARTICIPANTES: ' + participantes : '',
        '',
        '='.repeat(60),
        '',
        conteudo,
      ].filter(l => l !== null && l !== undefined).join('\n');

      const arquivo = await salvarArquivo(googleToken, pid, nome, titulo, corpo);
      return res.json({ ok: true, arquivo, mensagem: 'Transcricao salva com sucesso!' });
    }

    // ── DELETE ?id=xxx ─────────────────────────────────
    if (req.method === 'DELETE' && req.query.id) {
      await fetch(`https://www.googleapis.com/drive/v3/files/${req.query.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${googleToken}` },
      });
      return res.json({ ok: true });
    }

    return res.status(405).json({ erro: 'Metodo nao permitido.' });

  } catch (e) {
    console.error('[transcricoes]', e.message);
    if (e.message?.includes('Token Google')) {
      return res.status(401).json({ erro: e.message });
    }
    return res.status(500).json({ erro: e.message });
  }
}
