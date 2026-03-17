export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RD-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers['x-rd-token'];
  if (!token) return res.status(400).json({ erro: 'Token nao fornecido no header X-RD-Token.' });

  const { path, ...params } = req.query;
  const pathStr = Array.isArray(path) ? path.join('/') : (path || 'contacts');
  Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });

  const qs = new URLSearchParams({ token, ...params }).toString();
  const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;

  try {
    const opts = {
      method: req.method,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    };
    if (req.method === 'POST') opts.body = JSON.stringify(req.body);

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
