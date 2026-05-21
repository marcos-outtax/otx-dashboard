import { aplicarCORS, validarSessao, gerarCSRFToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido.' });

  const usuario = validarSessao(req);
  if (!usuario) {
    return res.status(401).json({ ok: false, erro: 'Sessão inválida.' });
  }

  const sessionToken = (req.headers['x-session-token'] || '').trim();
  const csrfToken = gerarCSRFToken(sessionToken);

  return res.status(200).json({
    ok: true,
    usuario: usuario.usuario,
    nome: usuario.nome,
    admin: usuario.admin,
    csrfToken,
  });
}
