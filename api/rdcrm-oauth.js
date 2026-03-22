export default async function handler(req, res) {
  const clientId     = process.env.ID_DO_CLIENTE_RDCRM;
  const clientSecret = process.env.RDCRM_CLIENT_SECRET;
  const redirectUri  = 'https://otx-dashborad.vercel.app/api/rdcrm-oauth';

  if (req.query.error) {
    return res.status(400).send('<html><body style="font-family:sans-serif;padding:40px"><h2 style="color:red">Erro: ' + req.query.error + '</h2><a href="/">Voltar</a></body></html>');
  }

  if (req.query.code) {
    try {
      const r = await fetch('https://api.rdstation.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: req.query.code,
          redirect_uri: redirectUri
        }),
      });
      const data = await r.json();
      if (!r.ok || !data.access_token) throw new Error(data.error_description || data.error || 'Erro token');
      return res.status(200).send('<html><head><meta charset="UTF-8"><title>Tokens RD CRM v2</title></head><body style="font-family:sans-serif;padding:40px;background:#f0f4fb;color:#152c6b"><h2>RD CRM v2 Autorizado!</h2><p style="background:#FEF3C7;padding:14px;border-radius:8px"><strong>Salve os tokens no Vercel e faca Redeploy.</strong></p><p><strong>RDCRM_ACCESS_TOKEN:</strong><br><code style="word-break:break-all;background:#fff;padding:8px;display:block;margin-top:6px">' + data.access_token + '</code></p><p><strong>RDCRM_REFRESH_TOKEN:</strong><br><code style="word-break:break-all;background:#fff;padding:8px;display:block;margin-top:6px">' + (data.refresh_token || 'nao retornado') + '</code></p><a href="/" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#152c6b;color:#fff;border-radius:8px;text-decoration:none">Voltar ao dashboard</a></body></html>');
    } catch (e) {
      return res.status(500).send('<html><body style="font-family:sans-serif;padding:40px"><h2 style="color:red">Erro: ' + e.message + '</h2><a href="/">Voltar</a></body></html>');
    }
  }

  if (!clientId) {
    return res.status(500).json({ erro: 'ID_DO_CLIENTE_RDCRM nao configurado.' });
  }

  // Usa meta refresh em vez de res.redirect() para evitar bug do Node.js 24
  const authUrl = 'https://api.rdstation.com/auth/dialog?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(redirectUri);
  return res.status(200).send('<html><head><meta http-equiv="refresh" content="0;url=' + authUrl + '"></head><body>Redirecionando para o RD Station... <a href="' + authUrl + '">Clique aqui se nao for redirecionado.</a></body></html>');
}
