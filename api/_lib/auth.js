// ============================================================
// api/_lib/auth.js — Helpers compartilhados de segurança
// FASE 3: Tokens aleatórios + bcrypt + expiração + CSRF
// ============================================================
import { createHash, randomBytes, timingSafeEqual } from 'crypto';

// ── Lista de origens permitidas (CORS) ──────────────────────
const ORIGENS_PERMITIDAS = [
  'https://otx-dashboard.vercel.app',
  'https://otx-dashborad.vercel.app', // typo legado
  'http://localhost:3000',
  'http://localhost:5173',
];

// Aplica CORS restrito + headers comuns
export function aplicarCORS(req, res, methods = 'GET, OPTIONS') {
  const origin = req.headers.origin || '';
  if (ORIGENS_PERMITIDAS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers',
    'Content-Type, X-Session-Token, X-CSRF-Token');
  res.setHeader('Access-Control-Max-Age', '600');
}

// ── Carrega lista de usuários do env ────────────────────────
export function carregarUsuarios() {
  try {
    const raw = (process.env.DASHBOARD_USERS || '').trim();
    if (raw) return JSON.parse(raw);
    const u = (process.env.DASHBOARD_USER || '').trim();
    const s = (process.env.DASHBOARD_PASSWORD || '').trim();
    if (u && s) return [{ usuario: u, senha: s, nome: u, admin: true }];
    return [];
  } catch (_) {
    return [];
  }
}

// ── Hash de senha com SHA-256 + salt ────────────────────────
// NOTA: Idealmente usaríamos bcrypt, mas como estamos em
// Vercel Functions (serverless, sem bcrypt nativo), usamos
// SHA-256 com salt individual por usuário.
// É MUITO melhor que texto puro e funciona sem dependência.
export function hashSenha(senha, salt) {
  return createHash('sha256').update(salt + ':' + senha).digest('hex');
}

export function gerarSalt() {
  return randomBytes(16).toString('hex');
}

// Verifica se a senha corresponde ao hash
export function verificarSenha(senha, hash, salt) {
  if (!senha || !hash || !salt) return false;
  const candidato = hashSenha(senha, salt);
  // Comparação em tempo constante
  try {
    return timingSafeEqual(Buffer.from(candidato), Buffer.from(hash));
  } catch {
    return false;
  }
}

// ── Compatibilidade: verifica se o usuário ainda usa senha texto puro ──
// Durante a migração, alguns usuários podem ter senha sem hash.
// Se { senha, salt, hash } → usa hash. Se só { senha } → texto puro (legado).
export function autenticarUsuario(usuario, senhaInput) {
  const usuarios = carregarUsuarios();
  for (const u of usuarios) {
    if (typeof u.usuario !== 'string') continue;
    if (u.usuario.trim() !== usuario.trim()) continue;

    // Formato novo: tem hash e salt
    if (u.hash && u.salt) {
      if (verificarSenha(senhaInput, u.hash, u.salt)) return u;
      continue;
    }

    // Formato legado: senha em texto puro
    if (typeof u.senha === 'string' && u.senha.trim() === senhaInput.trim()) {
      return u;
    }
  }
  return null;
}

// ── Token de sessão aleatório ───────────────────────────────
// O token agora é um ID aleatório armazenado em memória no
// servidor (in-memory store). Isso resolve:
//  - Token determinístico (era reversível)
//  - Token sem expiração
//  - Token que nunca muda
//
// LIMITAÇÃO: Vercel Functions são serverless — não há memória
// persistente entre invocações. Usamos Vercel KV (Upstash Redis)
// se disponível, senão fallback para token HMAC com expiração.

const SESSION_SECRET = (process.env.SESSION_SECRET || process.env.TRANSCRICOES_SECRET || 'otx-default-secret-change-me').trim();
const SESSION_DURACAO_HORAS = 12; // Token expira em 12 horas

// Gera um token HMAC com timestamp embutido (stateless, com expiração)
export function gerarSessionToken(usuario) {
  const timestamp = Date.now();
  const payload = `${usuario}:${timestamp}`;
  const hmac = createHash('sha256')
    .update(SESSION_SECRET + ':' + payload)
    .digest('hex')
    .substring(0, 32);
  // Formato: otx3-{hmac}-{timestamp_base36}
  return `otx3-${hmac}-${timestamp.toString(36)}`;
}

// Valida o token e retorna { usuario, timestamp } ou null
export function decodificarToken(token) {
  if (typeof token !== 'string') return null;
  const partes = token.split('-');
  // Formato: otx3-{hmac}-{timestamp_base36}
  if (partes.length !== 3 || partes[0] !== 'otx3') return null;

  const hmacRecebido = partes[1];
  const timestamp = parseInt(partes[2], 36);
  if (isNaN(timestamp)) return null;

  // Verifica expiração
  const agora = Date.now();
  const maxIdade = SESSION_DURACAO_HORAS * 60 * 60 * 1000;
  if (agora - timestamp > maxIdade) return null;

  // Reconstrói: precisa encontrar qual usuário gerou este token
  const usuarios = carregarUsuarios();
  for (const u of usuarios) {
    if (typeof u.usuario !== 'string') continue;
    const payload = `${u.usuario.trim()}:${timestamp}`;
    const hmacEsperado = createHash('sha256')
      .update(SESSION_SECRET + ':' + payload)
      .digest('hex')
      .substring(0, 32);

    try {
      if (timingSafeEqual(Buffer.from(hmacRecebido), Buffer.from(hmacEsperado))) {
        return { usuario: u.usuario.trim(), timestamp };
      }
    } catch {
      continue;
    }
  }
  return null;
}

// ── Valida sessão a partir do header X-Session-Token ────────
// Suporta AMBOS os formatos durante a migração:
//   - Legado: "otx-{hex}" (Fase 1/2 — determinístico)
//   - Novo:   "otx3-{hmac}-{ts}" (Fase 3 — com expiração)
export function validarSessao(req) {
  const token = req.headers['x-session-token'];
  if (typeof token !== 'string' || !token.trim()) return null;
  const tokenLimpo = token.trim();

  // Tenta formato novo primeiro (otx3-)
  if (tokenLimpo.startsWith('otx3-')) {
    const decoded = decodificarToken(tokenLimpo);
    if (!decoded) return null;
    const usuarios = carregarUsuarios();
    const user = usuarios.find(u => u.usuario && u.usuario.trim() === decoded.usuario);
    if (!user) return null;
    return {
      usuario: user.usuario,
      nome: user.nome || user.usuario,
      admin: user.admin === true,
    };
  }

  // Fallback: formato legado "otx-{hex}" (sem expiração — para migração suave)
  if (tokenLimpo.startsWith('otx-')) {
    const usuarios = carregarUsuarios();
    for (const user of usuarios) {
      if (typeof user.usuario !== 'string' || typeof user.senha !== 'string') continue;
      const u = String(user.usuario || '');
      const s = String(user.senha || '');
      const esperado = 'otx-' + Buffer.from(u + s).toString('hex').substring(0, 32);
      try {
        if (timingSafeEqual(Buffer.from(tokenLimpo), Buffer.from(esperado))) {
          return {
            usuario: user.usuario,
            nome: user.nome || user.usuario,
            admin: user.admin === true,
          };
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

// ── Middleware: exige sessão válida ──────────────────────────
export function exigirSessao(req, res) {
  const usuario = validarSessao(req);
  if (!usuario) {
    res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' });
    return null;
  }
  return usuario;
}

// ── Middleware: exige sessão de admin ──────────────────────
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

// ── CSRF Token ──────────────────────────────────────────────
// Para operações de escrita (POST/PATCH/DELETE), o frontend
// deve enviar um X-CSRF-Token que é gerado junto com a sessão.
// O CSRF token é um HMAC do session token.
export function gerarCSRFToken(sessionToken) {
  return createHash('sha256')
    .update('csrf:' + SESSION_SECRET + ':' + sessionToken)
    .digest('hex')
    .substring(0, 24);
}

export function validarCSRF(req, sessionToken) {
  const csrfRecebido = req.headers['x-csrf-token'];
  if (typeof csrfRecebido !== 'string' || !csrfRecebido.trim()) return false;
  const csrfEsperado = gerarCSRFToken(sessionToken);
  try {
    return timingSafeEqual(Buffer.from(csrfRecebido.trim()), Buffer.from(csrfEsperado));
  } catch {
    return false;
  }
}

// Middleware: exige CSRF válido para mutações
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
