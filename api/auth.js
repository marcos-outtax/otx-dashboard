// ============================================================
// api/auth.js — Login do dashboard
// CORREÇÕES:
//  - Validação de tipo (typeof string) antes de tudo: corrige
//    crash 500 com {"usuario":{"$gt":""}} (NoSQL injection probe)
//  - CORS restrito por allowlist (era "*")
//  - Reusa helper compartilhado de geração de token
// ============================================================
import { aplicarCORS, gerarSessionToken, carregarUsuarios } from './_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  // ── VALIDAÇÃO DE TIPO (crítica — corrige crash) ───────────
  // O body precisa ser objeto e os campos precisam ser strings.
  // Sem isso, payloads como {"usuario":{"$gt":""}} crashavam o trim().
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ erro: 'Payload inválido.' });
  }

  const { usuario, senha } = body;
  if (typeof usuario !== 'string' || typeof senha !== 'string') {
    return res.status(400).json({ erro: 'Usuário e senha devem ser texto.' });
  }

  // Sanitiza tamanho (evita ataques de DoS por payload gigante)
  if (usuario.length > 200 || senha.length > 200) {
    return res.status(400).json({ erro: 'Credenciais com tamanho inválido.' });
  }

  const usuarioLimpo = usuario.trim();
  const senhaLimpa = senha.trim();

  if (!usuarioLimpo || !senhaLimpa) {
    return res.status(400).json({ erro: 'Usuário e senha obrigatórios.' });
  }

  // ── Carrega usuários ──────────────────────────────────────
  const usuarios = carregarUsuarios();
  if (!usuarios.length) {
    return res.status(500).json({ erro: 'Nenhum usuário configurado.' });
  }

  // ── Valida credenciais ────────────────────────────────────
  // Percorre TODA a lista mesmo após match (evita timing attack
  // de enumeração de usuários)
  let userEncontrado = null;
  for (const u of usuarios) {
    if (typeof u.usuario !== 'string' || typeof u.senha !== 'string') continue;
    if (u.usuario.trim() === usuarioLimpo && u.senha.trim() === senhaLimpa) {
      userEncontrado = u;
      // não dá break — varre tudo pra timing constante
    }
  }

  if (!userEncontrado) {
    // Pequeno delay aleatório para dificultar timing attacks
    await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
    return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
  }

  const sessionToken = gerarSessionToken(userEncontrado.usuario, userEncontrado.senha);

  return res.status(200).json({
    ok: true,
    sessionToken,
    nome: userEncontrado.nome || userEncontrado.usuario,
    admin: userEncontrado.admin === true,
  });
}
