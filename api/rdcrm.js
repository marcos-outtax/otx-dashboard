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

  // POST — atividades e outros endpoints de escrita
  if (req.method === 'POST') {
    const body = req.body || {};
    // Se path=activities no body (formato antigo), converte para deals/{id}/activities
    let finalPath = pathStr;
    if (pathStr === 'activities' && body.deal_id) {
      finalPath = `deals/${body.deal_id}/activities`;
    }

    const qs = new URLSearchParams({ token }).toString();
    const url = `https://crm.rdstation.com/api/v1/${finalPath}?${qs}`;

    // Monta o body para a API do RD
    const rdBody = {};
    if (body.text) rdBody.text = body.text;
    if (body.deal_id && finalPath.includes('activities')) rdBody.deal_id = body.deal_id;

    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(rdBody)
      });
      const text = await r.text();
      try {
        return res.status(r.status).json(JSON.parse(text));
      } catch {
        return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0, 300) });
      }
    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // GET com paginação automática para deals
  const queryParams = { ...req.query };
  delete queryParams.path;

  if (pathStr === 'deals') {
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
          catch { return res.status(r.status).json({ erro: 'Erro na API RD', detalhe: text.substring(0, 300) }); }
        }
        const data = await r.json();
        const deals = data.deals || [];
        todosDeals = todosDeals.concat(deals);
        if (deals.length < limit) continuar = false;
        else { page++; if (page > 15) continuar = false; }
      }
      return res.status(200).json({ deals: todosDeals, total: todosDeals.length });
    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // GET simples para outros endpoints (contacts, deal_pipelines, tasks, etc.)
  try {
    const qs = new URLSearchParams({ token, ...queryParams }).toString();
    const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;
    const r = await fetch(url, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    const text = await r.text();
    try {
      const data = JSON.parse(text);
      if (pathStr === 'deal_pipelines' && Array.isArray(data)) {
        return res.status(r.status).json({ deal_pipelines: data });
      }
      return res.status(r.status).json(data);
    } catch {
      return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0, 300) });
    }
  } catch (e) {
    return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
  }
}
