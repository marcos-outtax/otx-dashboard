import { createHash, timingSafeEqual, randomBytes } from 'crypto';

const SESSION_SECRET = (process.env.SESSION_SECRET || process.env.TRANSCRICOES_SECRET || 'otx-default-secret-change-me').trim();
const SESSION_DURACAO_HORAS = 12;

function carregarUsuarios() {
  try {
    const raw = (process.env.DASHBOARD_USERS || '').trim();
    if (raw) return JSON.parse(raw);
    const u = (process.env.DASHBOARD_USER || '').trim();
    const s = (process.env.DASHBOARD_PASSWORD || '').trim();
    if (u && s) return [{ usuario: u, senha: s, nome: u, admin: true }];
    return [];
  } catch (_) { return []; }
}

function hashSenha(senha, salt) {
  return createHash('sha256').update(salt + ':' + senha).digest('hex');
}

function gerarSalt() {
  return randomBytes(16).toString('hex');
}

function decodificarToken(token) {
  if (typeof token !== 'string') return null;
  const partes = token.split('-');
  if (partes.length !== 3 || partes[0] !== 'otx3') return null;
  const hmacRecebido = partes[1];
  const timestamp = parseInt(partes[2], 36);
  if (isNaN(timestamp)) return null;
  const agora = Date.now();
  const maxIdade = SESSION_DURACAO_HORAS * 60 * 60 * 1000;
  if (agora - timestamp > maxIdade) return null;
  const usuarios = carregarUsuarios();
  for (const u of usuarios) {
    if (typeof u.usuario !== 'string') continue;
    const payload = `${u.usuario.trim()}:${timestamp}`;
    const hmacEsperado = createHash('sha256').update(SESSION_SECRET + ':' + payload).digest('hex').substring(0, 32);
    try {
      if (timingSafeEqual(Buffer.from(hmacRecebido), Buffer.from(hmacEsperado))) {
        return { usuario: u.usuario.trim(), timestamp };
      }
    } catch { continue; }
  }
  return null;
}

function validarSessao(req) {
  const token = (req.headers['x-session-token'] || '').trim();
  if (!token) return null;
  if (token.startsWith('otx3-')) {
    const decoded = decodificarToken(token);
    if (!decoded) return null;
    const usuarios = carregarUsuarios();
    const user = usuarios.find(u => u.usuario && u.usuario.trim() === decoded.usuario);
    if (!user) return null;
    return { usuario: user.usuario, nome: user.nome || user.usuario, admin: user.admin === true };
  }
  // Fallback legado otx-
  if (token.startsWith('otx-')) {
    const usuarios = carregarUsuarios();
    for (const user of usuarios) {
      if (typeof user.usuario !== 'string') continue;
      const u = String(user.usuario || '');
      const s = String(user.senha || '');
      const esperado = 'otx-' + Buffer.from(u + s).toString('hex').substring(0, 32);
      try {
        if (timingSafeEqual(Buffer.from(token), Buffer.from(esperado))) {
          return { usuario: user.usuario, nome: user.nome || user.usuario, admin: user.admin === true };
        }
      } catch { continue; }
    }
  }
  return null;
}

function gerarCSRFToken(sessionToken) {
  return createHash('sha256').update('csrf:' + SESSION_SECRET + ':' + sessionToken).digest('hex').substring(0, 24);
}

function validarCSRF(req) {
  const sessionToken = (req.headers['x-session-token'] || '').trim();
  const csrfRecebido = (req.headers['x-csrf-token'] || '').trim();
  if (!sessionToken || !csrfRecebido) return false;
  const csrfEsperado = gerarCSRFToken(sessionToken);
  try {
    return timingSafeEqual(Buffer.from(csrfRecebido), Buffer.from(csrfEsperado));
  } catch { return false; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token, X-CSRF-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminUser = validarSessao(req);
  if (!adminUser) return res.status(401).json({ erro: 'Sessão inválida.' });
  if (!adminUser.admin) return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });

  const usuarios = carregarUsuarios();

  if (req.method === 'GET') {
    return res.status(200).json({
      usuarios: usuarios.map(u => ({
        usuario: u.usuario,
        nome: u.nome || u.usuario,
        admin: u.admin === true,
        hashAtivo: !!(u.hash && u.salt),
      }))
    });
  }

  // Operações de escrita exigem CSRF
  if (!validarCSRF(req)) return res.status(403).json({ erro: 'CSRF token inválido. Recarregue a página.' });

  if (req.method === 'PATCH') {
    const { usuario, novaSenha } = req.body || {};
    if (!usuario || !novaSenha || novaSenha.trim().length < 4) return res.status(400).json({ erro: 'Usuário e nova senha (mín. 4 caracteres) obrigatórios.' });
    const idx = usuarios.findIndex(u => u.usuario === usuario.trim());
    if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    const salt = gerarSalt();
    const hash = hashSenha(novaSenha.trim(), salt);
    const novos = [...usuarios];
    novos[idx] = { ...novos[idx], hash, salt };
    delete novos[idx].senha;
    const ok = await atualizarVariavel(novos);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Senha atualizada com sucesso.' });
  }

  if (req.method === 'POST') {
    const { usuario, senha, nome, admin } = req.body || {};
    if (!usuario || !senha || senha.trim().length < 4) return res.status(400).json({ erro: 'Usuário e senha (mín. 4 caracteres) obrigatórios.' });
    if (usuarios.find(u => u.usuario === usuario.trim())) return res.status(400).json({ erro: 'Usuário já existe.' });
    const salt = gerarSalt();
    const hash = hashSenha(senha.trim(), salt);
    const novos = [...usuarios, { usuario: usuario.trim(), hash, salt, nome: (nome || usuario).trim(), admin: admin === true }];
    const ok = await atualizarVariavel(novos);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário adicionado.' });
  }

  if (req.method === 'DELETE') {
    const { usuario } = req.body || {};
    if (!usuario) return res.status(400).json({ erro: 'Usuário obrigatório.' });
    if (usuario === adminUser.usuario) return res.status(400).json({ erro: 'Você não pode remover seu próprio usuário.' });
    const novos = usuarios.filter(u => u.usuario !== usuario);
    if (novos.length === usuarios.length) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    if (!novos.some(u => u.admin === true)) return res.status(400).json({ erro: 'Não é possível remover o último administrador.' });
    const ok = await atualizarVariavel(novos);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário removido.' });
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}

async function atualizarVariavel(usuarios) {
  const token = (process.env.VERCEL_TOKEN || '').trim();
  const projectId = (process.env.VERCEL_PROJECT_ID || '').trim();
  const teamId = (process.env.VERCEL_TEAM_ID || '').trim();
  if (!token || !projectId) return false;
  const valor = JSON.stringify(usuarios);
  const qs = teamId ? `?teamId=${teamId}` : '';
  try {
    const rGet = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const dataGet = await rGet.json();
    const existente = (dataGet.envs || []).find(e => e.key === 'DASHBOARD_USERS');
    if (existente) {
      const r = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env/${existente.id}${qs}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: valor, target: ['production', 'preview', 'development'] })
      });
      return r.ok;
    } else {
      const r = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env${qs}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'DASHBOARD_USERS', value: valor, type: 'encrypted', target: ['production', 'preview', 'development'] })
      });
      return r.ok;
    }
  } catch (e) { return false; }
}
