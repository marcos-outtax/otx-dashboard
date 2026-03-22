export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ✅ Token direto do CRM (sem OAuth)
  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();

  if (!token) {
    return res.status(401).json({
      erro: 'RDCRM_TOKEN_SOCIO não configurado no Vercel'
    });
  }

  // Montagem do endpoint dinâmico
  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : req.query.path;

  const pathStr = queryPath || 'deals';

  const queryParams = { ...req.query };
  delete queryParams.path;

  const qs = new URLSearchParams(queryParams).toString();

  // ✅ Endpoint correto do CRM
  const url = `https://crm.rdstation.com/api/v1/${pathStr}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(url, {
      method: req.method,
      headers: {
        'X-Auth-Token': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...(req.method === 'POST' && req.body
        ? { body: JSON.stringify(req.body) }
        : {}),
    });

    const text = await r.text();

    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).json({
        erro: `Resposta não JSON (status ${r.status})`,
        detalhe: text.substring(0, 300)
      });
    }

  } catch (e) {
    return res.status(500).json({
      erro: 'Erro interno',
      detalhe: e.message
    });
  }
}
