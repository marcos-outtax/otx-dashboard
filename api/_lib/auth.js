import { createHash, randomBytes, timingSafeEqual } from 'crypto';

const ORIGENS_PERMITIDAS = [
  'https://otx-dashboard.vercel.app',
  'https://otx-dashborad.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

export function aplicarCORS(req, res, methods = 'GET, OPTIONS') {
  const origin = req.headers.origin || '';
  if (ORIGENS_PERMITIDAS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token, X-CSRF-Token');
  res.setHeader('Access-Control-Max-Age', '600');
}

export function carregarUsuarios() {
  try {
    const raw = (process.env.DASHBOARD_USERS || '').trim();
    if (raw) return JSON.parse(raw);
    const u = (process.env.DASHBOARD_USER || '').trim();
    const s = (process.env.DASHBOARD_PASSWORD || '').trim();
    if (u && s) return [{ usuario: u, senha: s, nome: u, admin: true }];
    return [];
  } catch (_) { return []; }
}

export function hashSenha(senha, salt) {
  return createHash('sha256').update(salt + ':' + senha).digest('hex');
}

export function gerarSalt() {
  return randomBytes(16).toString('hex');
}

export function verificarSenha(senha, hash, salt) {
  if (!senha || !hash || !salt) return false;
  const candidato = hashSenha(senha, salt);
  try {
    return timingSafeEqual(Buffer.from(candidato), Buffer.from(hash));
  } catch { return false; }
}

export function autenticarUsuario(usuario, senhaInput) {
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

const SESSION_SECRET = (process.env.SESSION_SECRET || process.env.TRANSCRICOES_SECRET || 'otx-default-secret-change-me').trim();
const SESSION_DURACAO_HORAS = 12;

export function gerarSessionToken(usuario) {
  const timestamp = Date.now();
  const payload = `${usuario}:${timestamp}`;
  const hmac = createHash('sha256').update(SESSION_SECRET + ':' + payload).digest('hex').substring(0, 32);
  return `otx3-${hmac}-${timestamp.toString(36)}`;
}

export function decodificarToken(token) {
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

export function validarSessao(req) {
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

export function exigirSessao(req, res) {
  const usuario = validarSessao(req);
  if (!usuario) {
    res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' });
    return null;
  }
  return usuario;
}

export function exigirAdmin(req, res) {
  const usuario = validarSessao(req);
  if (!usuario) {
    res.status(401).json({ erro: 'Sessão inválida.' });
    return null;
  }
  if (!usuario.admin) {
    res.status(403).json({ erro: 'Acesso restrito ao administrador.' });
    return null;
  }
  return usuario;
}

export function gerarCSRFToken(sessionToken) {
  return createHash('sha256').update('csrf:' + SESSION_SECRET + ':' + sessionToken).digest('hex').substring(0, 24);
}

export function validarCSRF(req, sessionToken) {
  const csrfRecebido = req.headers['x-csrf-token'];
  if (typeof csrfRecebido !== 'string' || !csrfRecebido.trim()) return false;
  const csrfEsperado = gerarCSRFToken(sessionToken);
  try {
    return timingSafeEqual(Buffer.from(csrfRecebido.trim()), Buffer.from(csrfEsperado));
  } catch { return false; }
}

export function exigirCSRF(req, res) {
  const sessionToken = (req.headers['x-session-token'] || '').trim();
  if (!sessionToken) {
    res.status(403).json({ erro: 'CSRF: sessão ausente.' });
    return false;
  }
  if (!validarCSRF(req, sessionToken)) {
    res.status(403).json({ erro: 'CSRF token inválido. Recarregue a página.' });
    return false;
  }
  return true;
}
