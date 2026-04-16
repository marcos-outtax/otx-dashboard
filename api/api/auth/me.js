// ============================================================
// api/auth/me.js — Valida a sessão atual do usuário no servidor
// FASE 2: Fim do bypass visual da tela de login (#5 do relatório)
// ============================================================
// O frontend chama este endpoint no carregamento da página.
// Se retornar 401, mostra a tela de login.
// Se retornar 200, mostra a UI normalmente.
// ============================================================
import { aplicarCORS, validarSessao } from '../_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido.' });

  const usuario = validarSessao(req);
  if (!usuario) {
    return res.status(401).json({ ok: false, erro: 'Sessão inválida.' });
  }

  // Não retorna informação sensível — só o que o frontend precisa
  return res.status(200).json({
    ok: true,
    usuario: usuario.usuario,
    nome: usuario.nome,
    admin: usuario.admin,
  });
}
