const CLIENT_ID = '1027473122132-bb82qm1hh54qtrc11uuffcbe0d9ltmu4.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://otx-dashborad.vercel.app/api/google-callback';

export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect('/?google_error=' + encodeURIComponent(error));
  }

  if (!code) {
    return res.status(400).json({ erro: 'Código de autorização não encontrado.' });
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      return res.redirect('/?google_error=' + encodeURIComponent(tokenData.error || 'token_error'));
    }

    // Busca informações do usuário
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    // Redireciona para o dashboard com os tokens na URL (serão salvos no localStorage)
    const params = new URLSearchParams({
      google_access_token: tokenData.access_token,
      google_refresh_token: tokenData.refresh_token || '',
      google_email: userData.email || '',
      google_name: userData.name || '',
    });

    return res.redirect(`/?${params.toString()}`);
  } catch (e) {
    return res.redirect('/?google_error=' + encodeURIComponent(e.message));
  }
}
