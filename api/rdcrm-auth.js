// /api/rdcrm-auth.js
module.exports = function handler(req, res) {
  const clientId = process.env.ID_DO_CLIENTE_RDCRM;
  if (!clientId) {
    return res.status(500).json({ erro: 'ID_DO_CLIENTE_RDCRM não configurado no Vercel.' });
  }
  const redirectUri = 'https://otx-dashborad.vercel.app/api/rdcrm-callback';
  const url = `https://api.rdstation.com/auth/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(url);
};
