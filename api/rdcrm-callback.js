// /api/rdcrm-callback.js
// Recebe o code OAuth e troca pelo access_token + refresh_token
export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#f0f4fb;">
        <h2 style="color:#E24B4A;">❌ Erro na autorização</h2>
        <p>${error}</p>
        <a href="/">← Voltar ao dashboard</a>
      </body></html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#f0f4fb;">
        <h2 style="color:#E24B4A;">❌ Código de autorização não recebido</h2>
        <a href="/">← Voltar ao dashboard</a>
      </body></html>
    `);
  }

  const clientId     = process.env.ID_DO_CLIENTE_RDCRM;
  const clientSecret = process.env.RDCRM_CLIENT_SECRET;
  const redirectUri  = 'https://otx-dashborad.vercel.app/api/rdcrm-callback';

  try {
    const r = await fetch('https://api.rdstation.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        code,
        redirect_uri:  redirectUri,
      }),
    });

    const data = await r.json();

    if (!r.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'Erro ao obter token');
    }

    // Exibe os tokens para o usuário salvar no Vercel
    return res.status(200).send(`
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>RD CRM v2 — Tokens gerados</title>
        <style>
          body{font-family:sans-serif;padding:40px;background:#f0f4fb;color:#152c6b;}
          h2{color:#152c6b;}
          .box{background:#fff;border:1px solid #d6e0f0;border-radius:12px;padding:20px;margin:16px 0;}
          .label{font-size:12px;font-weight:600;color:#5a6e99;margin-bottom:6px;}
          .token{font-family:monospace;font-size:12px;word-break:break-all;background:#f0f4fb;padding:10px;border-radius:6px;}
          .step{background:#EAF3DE;border:1px solid #1D9E75;border-radius:8px;padding:14px;margin:12px 0;font-size:13px;}
          .warn{background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:14px;margin:12px 0;font-size:13px;}
        </style>
      </head>
      <body>
        <h2>✅ RD Station CRM v2 — Autorizado com sucesso!</h2>

        <div class="warn">
          ⚠️ <strong>Copie os tokens abaixo e salve no Vercel</strong> como variáveis de ambiente.<br>
          Depois clique em <strong>Redeploy</strong> no Vercel para ativar.
        </div>

        <div class="box">
          <div class="label">RDCRM_ACCESS_TOKEN — cole no Vercel</div>
          <div class="token">${data.access_token}</div>
        </div>

        <div class="box">
          <div class="label">RDCRM_REFRESH_TOKEN — cole no Vercel</div>
          <div class="token">${data.refresh_token || '(não retornado)'}</div>
        </div>

        <div class="step">
          <strong>Passos:</strong><br>
          1. Acesse <a href="https://vercel.com/dashboard" target="_blank">vercel.com/dashboard</a><br>
          2. Projeto → Settings → Environment Variables<br>
          3. Adicione <code>RDCRM_ACCESS_TOKEN</code> e <code>RDCRM_REFRESH_TOKEN</code><br>
          4. Clique em Redeploy<br>
          5. Volte ao dashboard e teste a Análise de Marketing
        </div>

        <a href="/" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#152c6b;color:#fff;border-radius:8px;text-decoration:none;">
          ← Voltar ao dashboard
        </a>
      </body>
      </html>
    `);

  } catch (e) {
    return res.status(500).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#f0f4fb;">
        <h2 style="color:#E24B4A;">❌ Erro ao trocar token</h2>
        <p>${e.message}</p>
        <a href="/">← Voltar ao dashboard</a>
      </body></html>
    `);
  }
}
