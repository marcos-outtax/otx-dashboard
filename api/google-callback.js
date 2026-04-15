// ============================================================
// api/google-callback.js — Callback OAuth do Google
// CORREÇÕES:
//  - CLIENT_SECRET via env (era hardcoded no código!)
//  - CLIENT_ID via env
//  - REDIRECT_URI corrigido (typo)
// ============================================================

export default async function handler(req, res) {
  const CLIENT_ID     = (process.env.GOOGLE_CLIENT_ID     || '').trim();
  const CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const REDIRECT_URI  = (process.env.GOOGLE_REDIRECT_URI  ||
    'https://otx-dashboard.vercel.app/api/google-callback').trim();

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).send('Credenciais do Google não configuradas no servidor.');
  }

  const { code, error, state } = req.query;

  if (error) {
    return res.redirect('/?google_error=' + encodeURIComponent(String(error).substring(0, 200)));
  }
  if (!code || typeof code !== 'string') {
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

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    const email = userData.email || userData.sub || '';
    const name  = userData.name  || userData.given_name || '';

    const params = new URLSearchParams({
      google_access_token:  tokenData.access_token,
      google_refresh_token: tokenData.refresh_token || '',
      google_email:         email,
      google_name:          name,
      session_token:        typeof state === 'string' ? state : '',
    });

    return res.redirect(`/?${params.toString()}`);

  } catch (e) {
    return res.redirect('/?google_error=' + encodeURIComponent(e.message));
  }
}
