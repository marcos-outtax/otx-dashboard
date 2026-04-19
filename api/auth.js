// ============================================================
// api/auth.js — Login do dashboard
// FASE 3: Tokens aleatórios com expiração + CSRF token
// ============================================================
import { aplicarCORS, autenticarUsuario, gerarSessionToken, gerarCSRFToken } from './_lib/auth.js';
import { checarRateLimit, resetRateLimit, getClientIP } from './_lib/ratelimit.js';

const MAX_TENTATIVAS = 5;
const JANELA_SEGUNDOS = 900; // 15 minutos

export default async function handler(req, res) {
  aplicarCORS(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  // ── VALIDAÇÃO DE TIPO ──────────────────────────────────────
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ erro: 'Payload inválido.' });
  }

  const { usuario, senha } = body;
  if (typeof usuario !== 'string' || typeof senha !== 'string') {
    return res.status(400).json({ erro: 'Usuário e senha devem ser texto.' });
  }
  if (usuario.length > 200 || senha.length > 200) {
    return res.status(400).json({ erro: 'Credenciais com tamanho inválido.' });
  }

  const usuarioLimpo = usuario.trim();
  const senhaLimpa = senha.trim();
  if (!usuarioLimpo || !senhaLimpa) {
    return res.status(400).json({ erro: 'Usuário e senha obrigatórios.' });
  }

  // ── RATE-LIMIT POR IP ──────────────────────────────────────
  const ip = getClientIP(req);
  const chaveRL = `auth:ip:${ip}`;
  const rl = await checarRateLimit(chaveRL, MAX_TENTATIVAS, JANELA_SEGUNDOS);

  if (!rl.permitido) {
    const minutos = Math.ceil(rl.retryApos / 60);
    res.setHeader('Retry-After', String(rl.retryApos));
    return res.status(429).json({
      erro: `Muitas tentativas de login. Tente novamente em ${minutos} minuto${minutos !== 1 ? 's' : ''}.`,
      retryApos: rl.retryApos,
    });
  }

  // ── VALIDA CREDENCIAIS ─────────────────────────────────────
  const userEncontrado = autenticarUsuario(usuarioLimpo, senhaLimpa);

  if (!userEncontrado) {
    // Delay aleatório anti-timing
    await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
    return res.status(401).json({
      erro: 'Usuário ou senha incorretos.',
      tentativasRestantes: rl.restante,
    });
  }

  // ── LOGIN OK ───────────────────────────────────────────────
  await resetRateLimit(chaveRL);

  // FASE 3: Token aleatório com expiração (12h)
  const sessionToken = gerarSessionToken(userEncontrado.usuario);
  const csrfToken = gerarCSRFToken(sessionToken);

  return res.status(200).json({
    ok: true,
    sessionToken,
    csrfToken,
    nome: userEncontrado.nome || userEncontrado.usuario,
    admin: userEncontrado.admin === true,
  });
}
