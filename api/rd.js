export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Valida sessão
  const sessionToken = req.headers['x-session-token'];
  const expectedToken = Buffer.from(
    (process.env.DASHBOARD_USER || '') + ':' + (process.env.DASHBOARD_PASSWORD || '')
  ).toString('base64');
  if (!sessionToken || sessionToken !== expectedToken) {
    return res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
  }

  // Token do CRM vem da Vercel
  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();
  if (!token) {
    return res.status(500).json({ erro: 'Token RDCRM não configurado na Vercel.' });
  }

  // Aceita path via query ou body
  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : req.query.path;
  const bodyPath = req.body?.path;
  const pathStr = queryPath || bodyPath || 'contacts';

  const rdMethod = req.body?.method || req.method;
  const rdBody   = req.body?.body || undefined;

  // Remove path dos query params
  const queryParams = { ...req.query };
  delete queryParams.path;

  const qs = new URLSearchParams({ token, ...queryParams }).toString();
  const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;

  try {
    const opts = {
      method: rdMethod,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    if (rdMethod === 'POST' && rdBody) {
      opts.body = JSON.stringify(rdBody);
    }

    const r = await fetch(url, opts);
    const text = await r.text();

    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).json({
        erro: `RD Station retornou status ${r.status}`,
        detalhe: text.substring(0, 300)
      });
    }

  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
