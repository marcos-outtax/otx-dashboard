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

function verificarSenha(senha, hash, salt) {
  if (!senha || !hash || !salt) return false;
  const candidato = hashSenha(senha, salt);
  try {
    return timingSafeEqual(Buffer.from(candidato), Buffer.from(hash));
  } catch { return false; }
}

function autenticarUsuario(usuario, senhaInput) {
  const usuarios = carregarUsuarios();
  for (const u of usuarios) {
    if (typeof u.usuario !== 'string') continue;
    if (u.usuario.trim() !== usuario.trim()) continue;
    if (u.hash && u.salt) {
      if (verificarSenha(senhaInput, u.hash, u.salt)) return u;
      continue;
    }
    if (typeof u.senha === 'string' && u.senha.trim() === senhaInput.trim()) return u;
  }
  return null;
}

function gerarSessionToken(usuario) {
  const timestamp = Date.now();
  const payload = `${usuario}:${timestamp}`;
  const hmac = createHash('sha256').update(SESSION_SECRET + ':' + payload).digest('hex').substring(0, 32);
  return `otx3-${hmac}-${timestamp.toString(36)}`;
}

function gerarCSRFToken(sessionToken) {
  return createHash('sha256').update('csrf:' + SESSION_SECRET + ':' + sessionToken).digest('hex').substring(0, 24);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  const { usuario, senha } = req.body || {};
  if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha obrigatórios.' });

  const usuarios = carregarUsuarios();
  if (!usuarios.length) return res.status(500).json({ erro: 'Nenhum usuário configurado.' });

  const user = autenticarUsuario(usuario, senha);
  if (!user) return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });

  const sessionToken = gerarSessionToken(user.usuario);
  const csrfToken = gerarCSRFToken(sessionToken);

  return res.status(200).json({
    ok: true,
    sessionToken,
    csrfToken,
    nome: user.nome || user.usuario,
    admin: user.admin === true,
  });
}
