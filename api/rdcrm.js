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

  // POST — sem paginação
  if (req.method === 'POST') {
    const qs = new URLSearchParams({ token, ...queryParams }).toString();
    const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(req.body)
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0,300) }); }
    } catch(e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // GET com paginação automática para endpoints de lista
  const ENDPOINTS_PAGINADOS = ['deals', 'contacts', 'tasks', 'activities'];
  const precisaPaginar = ENDPOINTS_PAGINADOS.some(ep => pathStr === ep || pathStr.startsWith(ep + '/') === false && pathStr === ep);

  // deal_pipelines e outros endpoints simples — sem paginação
  if (!precisaPaginar || pathStr !== 'deals') {
    const qs = new URLSearchParams({ token, ...queryParams }).toString();
    const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;
    try {
      const r = await fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      const text = await r.text();
      try {
        const data = JSON.parse(text);
        // Normaliza deal_pipelines — API retorna array direto
        if (pathStr === 'deal_pipelines' && Array.isArray(data)) {
          return res.status(r.status).json({ deal_pipelines: data });
        }
        return res.status(r.status).json(data);
      } catch {
        return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0,300) });
      }
    } catch(e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // GET /deals — paginação automática completa
  try {
    const limit = 200;
    let page = 1;
    let todosDeals = [];
    let continuar = true;

    while (continuar) {
      const params = { token, ...queryParams, limit: String(limit), page: String(page) };
      const qs = new URLSearchParams(params).toString();
      const url = `https://crm.rdstation.com/api/v1/deals?${qs}`;

      const r = await fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });

      if (!r.ok) {
        const text = await r.text();
        try { return res.status(r.status).json(JSON.parse(text)); }
        catch { return res.status(r.status).json({ erro: 'Erro na API RD', detalhe: text.substring(0,300) }); }
      }

      const data = await r.json();
      const deals = data.deals || [];
      todosDeals = todosDeals.concat(deals);

      // Para quando vier menos que o limite — última página
      if (deals.length < limit) {
        continuar = false;
      } else {
        page++;
        // Segurança: máximo 15 páginas (3000 deals)
        if (page > 15) continuar = false;
      }
    }

    return res.status(200).json({ deals: todosDeals, total: todosDeals.length });

  } catch(e) {
    return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
  }
}
