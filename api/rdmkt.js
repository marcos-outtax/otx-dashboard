export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.RDMKT_ACCESS_TOKEN;
  if (!apiKey) return res.status(500).json({ erro: 'RDMKT_ACCESS_TOKEN não configurado no Vercel.' });

  const { path, ...params } = req.query;

  if (!path) return res.status(400).json({ erro: 'Parâmetro path obrigatório.' });

  // A API do RD Marketing usa:
  // GET /platform/contacts/email:EMAIL  → busca contato por email
  // GET /platform/contacts/uuid:UUID    → busca contato por uuid
  // Authorization: Bearer API_KEY
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  const url = `https://api.rd.services/platform/${path}${qs}`;

  try {
    const r = await fetch(url, {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      ...(req.method === 'POST' && req.body ? { body: JSON.stringify(req.body) } : {})
    });

    const text = await r.text();
    try {
      const data = JSON.parse(text);
      return res.status(r.status).json(data);
    } catch {
      return res.status(r.status).json({
        erro: `RD Marketing retornou status ${r.status}`,
        detalhe: text.substring(0, 500)
      });
    }
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
