export default async function handler(req, res) {
  const clientId = process.env.ID_DO_CLIENTE_RDCRM;
  const clientSecret = process.env.RDCRM_CLIENT_SECRET;
  const redirectUri = 'https://otx-dashborad.vercel.app/api/rdcrm-callback';

  if (req.query.error) {
    return res.status(400).send(`
      <h2 style="color:red">Erro: ${req.query.error}</h2>
      <a href="/">Voltar</a>
    `);
  }

  if (!req.query.code) {
    return res.status(400).send('Código não recebido');
  }

  try {
    const r = await fetch('https://api.rd.services/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code,
        redirect_uri: redirectUri
      })
    });

    const data = await r.json();

    if (!r.ok) {
      throw new Error(data.error_description || data.error);
    }

    return res.send(`
      <h2>✅ RD CRM conectado com sucesso</h2>

      <p><strong>Copie e salve no Vercel:</strong></p>

      <p><strong>RDCRM_ACCESS_TOKEN:</strong></p>
      <pre>${data.access_token}</pre>

      <p><strong>RDCRM_REFRESH_TOKEN:</strong></p>
      <pre>${data.refresh_token || 'não retornado'}</pre>

      <a href="/">Voltar</a>
    `);

  } catch (e) {
    return res.status(500).send(`
      <h2 style="color:red">Erro ao gerar token</h2>
      <p>${e.message}</p>
    `);
  }
}
