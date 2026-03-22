export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();

  if (!token) {
    return res.status(401).json({
      erro: 'Token RDCRM não configurado no Vercel'
    });
  }

  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : req.query.path;

  const pathStr = queryPath || 'deals';

  const queryParams = { ...req.query };
  delete queryParams.path;

  const qs = new URLSearchParams(queryParams).toString();

  const url = `https://crm.rdstation.com/api/v1/${pathStr}${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        erro: 'Erro na API RD',
        detalhe: data
      });
    }

    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({
      erro: 'Erro interno',
      detalhe: e.message
    });
  }
}
