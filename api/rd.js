export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RD-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers['x-rd-token'];
  if (!token) return res.status(400).json({ erro: 'Token nao fornecido no header X-RD-Token.' });

  // Aceita path e method tanto via query quanto via body (para chamadas POST do frontend)
  const queryPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
  const bodyPath  = req.body?.path;
  const pathStr   = queryPath || bodyPath || 'contacts';

  const rdMethod  = req.body?.method || req.method;
  const rdBody    = req.body?.body || undefined;

  // Remove path e method do body para não enviar para o RD
  const queryParams = { ...req.query };
  delete queryParams.path;

  const qs = new URLSearchParams({ token, ...queryParams }).toString();
  const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;

  try {
    const opts = {
      method: rdMethod,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    };
    if (rdMethod === 'POST' && rdBody) opts.body = JSON.stringify(rdBody);

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
