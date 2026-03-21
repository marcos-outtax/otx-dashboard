export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;">
        <h2>❌ Erro na autorização: ${error}</h2>
        <a href="https://otx-dashborad.vercel.app">Voltar ao Dashboard</a>
      </body></html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;">
        <h2>❌ Code não recebido</h2>
        <p>URL recebida: ${req.url}</p>
        <a href="https://otx-dashborad.vercel.app">Voltar</a>
      </body></html>
    `);
  }

  const clientId     = process.env.ID_DO_CLIENTE_RDMKT || process.env.RDMKT_CLIENT_ID;
  const clientSecret = process.env.RDMKT_CLIENT_SECRET;
  const callbackUrl  = 'https://otx-dashborad.vercel.app/api/rdmkt-callback';

  if (!clientId || !clientSecret) {
    return res.status(500).json({ erro: 'Credenciais OAuth não configuradas no Vercel.' });
  }

  try {
    const r = await fetch('https://api.rd.services/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        code:          code,
        redirect_uri:  callbackUrl,
      })
    });

    const data = await r.json();

    if (!r.ok || !data.access_token) {
      return res.status(r.status).send(`
        <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;">
          <h2>❌ Erro ao obter token (status ${r.status})</h2>
          <pre style="background:#f0f4fb;padding:16px;border-radius:8px;">${JSON.stringify(data, null, 2)}</pre>
          <a href="https://otx-dashborad.vercel.app">Voltar</a>
        </body></html>
      `);
    }

    // Sucesso — exibe tokens para salvar no Vercel
    return res.status(200).send(`
      <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;max-width:700px;">
        <h2>✅ Autorização concluída com sucesso!</h2>
        <p>Salve os valores abaixo no Vercel em <strong>Settings → Environment Variables</strong> e depois faça <strong>Redeploy</strong>:</p>

        <div style="background:#f0f4fb;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #152c6b;">
          <p style="margin:0 0 8px;font-weight:600;">RDMKT_ACCESS_TOKEN</p>
          <textarea onclick="this.select()" style="width:100%;height:70px;font-size:11px;font-family:monospace;border:1px solid #d6e0f0;border-radius:4px;padding:8px;" readonly>${data.access_token}</textarea>
        </div>

        ${data.refresh_token ? `
        <div style="background:#f0f4fb;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #285199;">
          <p style="margin:0 0 8px;font-weight:600;">RDMKT_REFRESH_TOKEN</p>
          <textarea onclick="this.select()" style="width:100%;height:70px;font-size:11px;font-family:monospace;border:1px solid #d6e0f0;border-radius:4px;padding:8px;" readonly>${data.refresh_token}</textarea>
        </div>
        ` : ''}

        <p style="color:#5a6e99;font-size:12px;margin-top:24px;">
          ⚠️ Clique em cada campo para selecionar e copiar. Após salvar no Vercel, faça Redeploy.
        </p>

        <a href="https://vercel.com" target="_blank" style="background:#152c6b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:8px;">
          Abrir Vercel →
        </a>
      </body></html>
    `);

  } catch (e) {
    return res.status(500).send(`
      <html><body style="font-family:sans-serif;padding:40px;">
        <h2>❌ Erro interno: ${e.message}</h2>
      </body></html>
    `);
  }
}
