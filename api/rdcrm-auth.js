export default async function handler(req, res) {
  const clientId = process.env.ID_DO_CLIENTE_RDCRM;
  const redirectUri = 'https://otx-dashborad.vercel.app/api/rdcrm-callback';

  if (!clientId) {
    return res.status(500).json({
      erro: 'Client ID RDCRM não encontrado no Vercel'
    });
  }

  const authUrl = `https://api.rd.services/auth/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return res.redirect(302, authUrl);
}
