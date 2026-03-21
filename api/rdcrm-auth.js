export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const clientId = process.env.ID_DO_CLIENTE_RDCRM;
  if (!clientId) {
    return res.status(500).json({ erro: 'ID_DO_CLIENTE_RDCRM nao configurado no Vercel.' });
  }
  const redirectUri = 'https://otx-dashborad.vercel.app/api/rdcrm-callback';
  const url = `https://api.rdstation.com/auth/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(url);
}
