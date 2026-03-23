export default async function handler(req, res) {
  // CORS (permite acesso do frontend)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = (process.env.RDCRM_ACCESS_TOKEN || '').trim();

  if (!token) {
    return res.status(401).json({
      erro: 'RDCRM_ACCESS_TOKEN não configurado no Vercel'
    });
  }

  // endpoint dinâmico
  const path = req.query.path || 'deals';

  const url = `https://api.rd.services/crm/v1/${path}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch {
      return res.status(response.status).json({
        erro: 'Resposta não JSON',
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
