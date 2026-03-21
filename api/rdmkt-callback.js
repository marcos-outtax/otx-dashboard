// /api/rdmkt-callback.js
// Recebe o ?code= do RD Marketing após autorização OAuth
// Troca o code pelo access_token e refresh_token
// Salva no KV do Vercel (ou retorna para o usuário salvar manualmente)

export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;">
        <h2>❌ Erro na autorização</h2>
        <p>${error}</p>
        <a href="https://otx-dashborad.vercel.app">Voltar ao Dashboard</a>
      </body></html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;">
        <h2>❌ Code não recebido</h2>
        <a href="https://otx-dashborad.vercel.app">Voltar ao Dashboard</a>
      </body></html>
    `);
  }

  const clientId     = process.env.ID_DO_CLIENTE_RDMKT;
  const clientSecret = process.env.RDMKT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ erro: 'Credenciais OAuth não configuradas no Vercel.' });
  }

  try {
    // Troca o code pelo access_token
    const r = await fetch('https://api.rd.services/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        code:          code,
      })
    });

    const data = await r.json();

    if (!r.ok || !data.access_token) {
      return res.status(r.status).send(`
        <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;">
          <h2>❌ Erro ao obter token</h2>
          <pre>${JSON.stringify(data, null, 2)}</pre>
          <a href="https://otx-dashborad.vercel.app">Voltar ao Dashboard</a>
        </body></html>
      `);
    }

    // Exibe os tokens para o usuário salvar no Vercel
    return res.status(200).send(`
      <html><body style="font-family:sans-serif;padding:40px;color:#152c6b;max-width:700px;">
        <h2>✅ Autorização concluída!</h2>
        <p>Copie os tokens abaixo e salve no Vercel em <strong>Settings → Environment Variables</strong>:</p>

        <div style="background:#f0f4fb;border-radius:8px;padding:20px;margin:20px 0;">
          <p><strong>RDMKT_ACCESS_TOKEN</strong></p>
          <textarea style="width:100%;height:80px;font-size:11px;font-family:monospace;" readonly>${data.access_token}</textarea>
        </div>

        <div style="background:#f0f4fb;border-radius:8px;padding:20px;margin:20px 0;">
          <p><strong>RDMKT_REFRESH_TOKEN</strong></p>
          <textarea style="width:100%;height:80px;font-size:11px;font-family:monospace;" readonly>${data.refresh_token || '(não retornado)'}</textarea>
        </div>

        <p style="color:#5a6e99;font-size:13px;">
          ⚠️ Após salvar no Vercel, faça Redeploy para ativar o novo token.
        </p>

        <a href="https://otx-dashborad.vercel.app" style="background:#152c6b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">
          Voltar ao Dashboard
        </a>
      </body></html>
    `);

  } catch (e) {
    return res.status(500).send(`
      <html><body style="font-family:sans-serif;padding:40px;">
        <h2>❌ Erro interno</h2>
        <p>${e.message}</p>
      </body></html>
    `);
  }
}
