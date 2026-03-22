export default async function handler(req, res) {
  const clientId = (process.env.ID_DO_CLIENTE_RDCRM || '').trim();
  const clientSecret = (process.env.RDCRM_CLIENT_SECRET || '').trim();
  const redirectUri = 'https://otx-dashborad.vercel.app/api/rdcrm-callback';

  if (req.query.error) {
    return res.status(400).send(`
      <h2 style="color:red">Erro retornado pelo RD</h2>
      <pre>${JSON.stringify(req.query, null, 2)}</pre>
      <a href="/">Voltar</a>
    `);
  }

  if (!req.query.code) {
    return res.status(400).send(`
      <h2 style="color:red">Código não recebido</h2>
      <p>Verifique o redirect URI no RD</p>
    `);
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

    // 🔥 AQUI ESTÁ O DEBUG IMPORTANTE
    if (!r.ok) {
      return res.status(500).send(`
        <h2 style="color:red">Erro ao gerar token</h2>
        <p><strong>Status HTTP:</strong> ${r.status}</p>
        <p><strong>Resposta da API:</strong></p>
        <pre>${JSON.stringify(data, null, 2)}</pre>

        <p><strong>Debug:</strong></p>
        <pre>
client_id: ${clientId}
client_secret: ${clientSecret ? 'OK (preenchido)' : 'VAZIO'}
redirect_uri: ${redirectUri}
code: ${req.query.code}
        </pre>

        <a href="/">Voltar</a>
      `);
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
      <h2 style="color:red">Erro inesperado</h2>
      <p>${e.message}</p>
    `);
  }
}
