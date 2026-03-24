export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();
  if (!token) return res.status(401).json({ erro: 'RDCRM_TOKEN_SOCIO não configurado' });

  if (req.method === 'POST') {
    const body = { ...req.body } || {};
    const finalPath = body.path || 'activities';
    delete body.path;

    const qs = new URLSearchParams({ token }).toString();
    const url = `https://crm.rdstation.com/api/v1/${finalPath}?${qs}`;

    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0,300) }); }
    } catch(e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // GET
  const queryPath = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path || 'deals');
  const queryParams = { ...req.query };
  delete queryParams.path;

  if (queryPath === 'deals') {
    try {
      const limit = 200; let page = 1; let todosDeals = []; let continuar = true;
      while (continuar) {
        const qs = new URLSearchParams({ token, ...queryParams, limit: String(limit), page: String(page) }).toString();
        const r = await fetch(`https://crm.rdstation.com/api/v1/deals?${qs}`, { headers: { 'Accept': 'application/json' } });
        if (!r.ok) { const t = await r.text(); try { return res.status(r.status).json(JSON.parse(t)); } catch { return res.status(r.status).json({ erro: t.substring(0,300) }); } }
        const data = await r.json();
        const deals = data.deals || [];
        todosDeals = todosDeals.concat(deals);
        if (deals.length < limit) continuar = false;
        else { page++; if (page > 15) continuar = false; }
      }
      return res.status(200).json({ deals: todosDeals, total: todosDeals.length });
    } catch(e) { return res.status(500).json({ erro: e.message }); }
  }

  try {
    const qs = new URLSearchParams({ token, ...queryParams }).toString();
    const r = await fetch(`https://crm.rdstation.com/api/v1/${queryPath}?${qs}`, { headers: { 'Accept': 'application/json' } });
    const text = await r.text();
    try {
      const data = JSON.parse(text);
      if (queryPath === 'deal_pipelines' && Array.isArray(data)) return res.status(r.status).json({ deal_pipelines: data });
      return res.status(r.status).json(data);
    } catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0,300) }); }
  } catch(e) { return res.status(500).json({ erro: e.message }); }
}
