// ============================================================
// api/_lib/auth.js — Helpers compartilhados de segurança
// ============================================================

// ── Lista de origens permitidas (CORS) ──────────────────────
const ORIGENS_PERMITIDAS = [
  'https://otx-dashboard.vercel.app',
  'https://otx-dashborad.vercel.app', // typo legado, manter até confirmar que ninguem usa
  'http://localhost:3000',
  'http://localhost:5173',
];

// Aplica CORS restrito (em vez de "*") + headers comuns
export function aplicarCORS(req, res, methods = 'GET, OPTIONS') {
  const origin = req.headers.origin || '';
  if (ORIGENS_PERMITIDAS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers',
    'Content-Type, X-Session-Token, X-Google-Token, X-Google-Refresh-Token');
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

// ── Gera o session token determinístico (mesmo do auth.js) ──
// IMPORTANTE: este algoritmo é fraco (determinístico, reversível).
// Será trocado na Fase 3 por token aleatório + bcrypt nas senhas.
// Por ora, mantemos para compatibilidade com sessões existentes.
export function gerarSessionToken(usuario, senha) {
  const u = String(usuario || '');
  const s = String(senha || '');
  return 'otx-' + Buffer.from(u + s).toString('hex').substring(0, 32);
}

// ── Comparação de strings em tempo constante (anti-timing) ──
function compararConstante(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ── Valida sessão a partir do header X-Session-Token ────────
// Retorna o usuário (objeto) ou null se inválido
export function validarSessao(req) {
  const token = req.headers['x-session-token'];
  if (typeof token !== 'string' || !token.trim()) return null;

  const tokenLimpo = token.trim();
  const usuarios = carregarUsuarios();
  if (!usuarios.length) return null;

  for (const user of usuarios) {
    if (typeof user.usuario !== 'string' || typeof user.senha !== 'string') continue;
    const esperado = gerarSessionToken(user.usuario, user.senha);
    if (compararConstante(tokenLimpo, esperado)) {
      return {
        usuario: user.usuario,
        nome: user.nome || user.usuario,
        admin: user.admin === true,
      };
    }
  }
  return null;
}

// ── Middleware: exige sessão válida; envia 401 se não tiver ──
// Retorna o objeto usuario, ou null (caller deve return)
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
