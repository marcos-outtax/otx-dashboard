// /api/rdmkt-auth.js
// Inicia o fluxo OAuth do RD Marketing
// Redireciona o usuário para a página de autorização do RD

export default async function handler(req, res) {
  const clientId    = process.env.ID_DO_CLIENTE_RDMKT;
  const callbackUrl = 'https://otx-dashborad.vercel.app/api/rdmkt-callback';

  if (!clientId) {
    return res.status(500).json({ erro: 'ID_DO_CLIENTE_RDMKT não configurado no Vercel.' });
  }

  const authUrl = `https://api.rd.services/auth/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}`;

  return res.redirect(302, authUrl);
}
