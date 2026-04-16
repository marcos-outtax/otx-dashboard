// ============================================================
// api/auth.js — Login do dashboard
// FASE 1: Validação de tipo + CORS restrito + helper compartilhado
// FASE 2: Rate-limit (5 tentativas / 15 min por IP) — bloqueia brute-force
// ============================================================
import { aplicarCORS, gerarSessionToken, carregarUsuarios } from './_lib/auth.js';
import { checarRateLimit, resetRateLimit, getClientIP } from './_lib/ratelimit.js';

// Configuração do rate-limit
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

  // ── CARREGA USUÁRIOS ───────────────────────────────────────
  const usuarios = carregarUsuarios();
  if (!usuarios.length) {
    return res.status(500).json({ erro: 'Nenhum usuário configurado.' });
  }

  // ── VALIDA CREDENCIAIS ─────────────────────────────────────
  let userEncontrado = null;
  for (const u of usuarios) {
    if (typeof u.usuario !== 'string' || typeof u.senha !== 'string') continue;
    if (u.usuario.trim() === usuarioLimpo && u.senha.trim() === senhaLimpa) {
      userEncontrado = u;
    }
  }

  if (!userEncontrado) {
    await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
    return res.status(401).json({
      erro: 'Usuário ou senha incorretos.',
      tentativasRestantes: rl.restante,
    });
  }

  // ── LOGIN OK: reseta o contador para esse IP ───────────────
  await resetRateLimit(chaveRL);

  const sessionToken = gerarSessionToken(userEncontrado.usuario, userEncontrado.senha);

  return res.status(200).json({
    ok: true,
    sessionToken,
    nome: userEncontrado.nome || userEncontrado.usuario,
    admin: userEncontrado.admin === true,
  });
}
