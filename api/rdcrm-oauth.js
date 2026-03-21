export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const clientId     = process.env.ID_DO_CLIENTE_RDCRM;
  const clientSecret = process.env.RDCRM_CLIENT_SECRET;
  const redirectUri  = 'https://otx-dashborad.vercel.app/api/rdcrm-oauth';

  // ── CALLBACK — chegou com ?code= ──────────────────────────
  if (req.query.code) {
    const { code } = req.query;
    try {
      const r = await fetch('https://api.rdstation.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
      });
      const data = await r.json();
      if (!r.ok || !data.access_token) throw new Error(data.error_description || data.error || 'Erro ao obter token');

      return res.status(200).send(`
        <html><head><meta charset="UTF-8"/><title>RD CRM v2 Tokens</title>
        <style>
          body{font-family:sans-serif;padding:40px;background:#f0f4fb;color:#152c6b;}
          .box{background:#fff;border:1px solid #d6e0f0;border-radius:12px;padding:20px;margin:16px 0;}
          .label{font-size:12px;font-weight:600;color:#5a6e99;margin-bottom:6px;}
          .token{font-family:monospace;font-size:12px;word-break:break-all;background:#f0f4fb;padding:10px;border-radius:6px;}
          .warn{background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:14px;margin:12px 0;font-size:13px;}
          .step{background:#EAF3DE;border:1px solid #1D9E75;border-radius:8px;padding:14px;margin:12px 0;font-size:13px;}
        </style></head><body>
        <h2>RD Station CRM v2 Autorizado!</h2>
        <div class="warn"><strong>Copie os tokens abaixo e salve no Vercel como variaveis de ambiente.</strong></div>
        <div class="box">
          <div class="label">RDCRM_ACCESS_TOKEN</div>
          <div class="token">${data.access_token}</div>
        </div>
        <div class="box">
          <div class="label">RDCRM_REFRESH_TOKEN</div>
          <div class="token">${data.refresh_token || 'nao retornado'}</div>
        </div>
        <div class="step"><strong>Passos:</strong><br>
          1. Acesse vercel.com/dashboard<br>
          2. Projeto > Settings > Environment Variables<br>
          3. Adicione RDCRM_ACCESS_TOKEN e RDCRM_REFRESH_TOKEN<br>
          4. Redeploy > volte ao dashboard e teste
        </div>
        <a href="/" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#152c6b;color:#fff;border-radius:8px;text-decoration:none;">Voltar ao dashboard</a>
        </body></html>`);
    } catch (e) {
      return res.status(500).send(`<html><body style="font-family:sans-serif;padding:40px;background:#f0f4fb;">
        <h2 style="color:#E24B4A;">Erro: ${e.message}</h2>
        <a href="/">Voltar ao dashboard</a></body></html>`);
    }
  }

  // ── ERRO retornado pelo RD ────────────────────────────────
  if (req.query.error) {
    return res.status(400).send(`<html><body style="font-family:sans-serif;padding:40px;background:#f0f4fb;">
      <h2 style="color:#E24B4A;">Erro na autorizacao: ${req.query.error}</h2>
      <a href="/">Voltar ao dashboard</a></body></html>`);
  }

  // ── INICIO — redireciona para o RD Station ────────────────
  if (!clientId) {
    return res.status(500).json({ erro: 'ID_DO_CLIENTE_RDCRM nao configurado no Vercel.' });
  }
  const url = `https://api.rdstation.com/auth/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.setHeader('Location', url);
  return res.status(302).end();
}
