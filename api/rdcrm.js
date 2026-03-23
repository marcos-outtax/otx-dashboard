export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();
  if (!token) {
    return res.status(401).json({ erro: 'RDCRM_TOKEN_SOCIO não configurado no Vercel' });
  }

  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : req.query.path;
  const pathStr = queryPath || 'deals';

  const queryParams = { ...req.query };
  delete queryParams.path;

  // Passa token como query param — igual ao rd.js que funcionava
  const qs = new URLSearchParams({ token, ...queryParams }).toString();
  const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;

  try {
    const opts = {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    };

    if (req.method === 'POST' && req.body) {
      opts.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, opts);
    const text = await response.text();

    try {
      const data = JSON.parse(text);

      // Normaliza deal_pipelines — API retorna array direto
      if (pathStr === 'deal_pipelines' && Array.isArray(data)) {
        return res.status(response.status).json({ deal_pipelines: data });
      }

      return res.status(response.status).json(data);
    } catch {
      return res.status(response.status).json({
        erro: 'Resposta não JSON',
        detalhe: text.substring(0, 300)
      });
    }
  } catch (e) {
    return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
  }
}
