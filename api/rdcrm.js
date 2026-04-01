export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();
  if (!token) return res.status(401).json({ erro: 'RDCRM_TOKEN_SOCIO não configurado' });

  // ── POST ──────────────────────────────────────────────────
  // Usado para gravar atividades/anotações no RD CRM
  // Body: { path: 'activities', deal_id: '...', text: '...' }
  if (req.method === 'POST') {
    const body = { ...req.body } || {};
    const finalPath = body.path || 'activities';
    delete body.path;

    const url = `https://crm.rdstation.com/api/v1/${finalPath}?token=${token}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0, 300) }); }
    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // ── PUT ───────────────────────────────────────────────────
  // Usado para atualizar organizations e contacts com dados do CNPJ
  // Body: { path: 'organizations/ID', organization: { name: '...', ... } }
  //    ou { path: 'contacts/ID', contact: { name: '...', ... } }
  if (req.method === 'PUT') {
    const body = { ...req.body } || {};
    const finalPath = body.path;
    if (!finalPath) return res.status(400).json({ erro: 'Campo path obrigatório no body' });
    delete body.path;

    const url = `https://crm.rdstation.com/api/v1/${finalPath}?token=${token}`;
    try {
      const r = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0, 300) }); }
    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno PUT', detalhe: e.message });
    }
  }

  // ── PATCH ─────────────────────────────────────────────────
  // Alternativa ao PUT para atualizações parciais
  if (req.method === 'PATCH') {
    const body = { ...req.body } || {};
    const finalPath = body.path;
    if (!finalPath) return res.status(400).json({ erro: 'Campo path obrigatório no body' });
    delete body.path;

    const url = `https://crm.rdstation.com/api/v1/${finalPath}?token=${token}`;
    try {
      const r = await fetch(url, {
        method: 'PUT', // RD CRM usa PUT mesmo para atualizações parciais
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0, 300) }); }
    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno PATCH', detalhe: e.message });
    }
  }

  // ── GET ───────────────────────────────────────────────────
  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : (req.query.path || 'deals');

  const queryParams = { ...req.query };
  delete queryParams.path;

  // Helper: GET simples sem paginação
  async function getSimples(path, params) {
    const qs = new URLSearchParams({ token, ...params }).toString();
    const r = await fetch(`https://crm.rdstation.com/api/v1/${path}?${qs}`, {
      headers: { 'Accept': 'application/json' }
    });
    const text = await r.text();
    try { return { status: r.status, data: JSON.parse(text) }; }
    catch { return { status: r.status, data: { erro: 'Resposta não JSON', detalhe: text.substring(0, 300) } }; }
  }

  // Helper: GET com paginação automática para deals
  async function getDealsComPaginacao(params) {
    const limit = 200;
    let page = 1;
    let todosDeals = [];
    let continuar = true;
    while (continuar) {
      const qs = new URLSearchParams({ token, ...params, limit: String(limit), page: String(page) }).toString();
      const r = await fetch(`https://crm.rdstation.com/api/v1/deals?${qs}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!r.ok) {
        const t = await r.text();
        try { return { erro: true, status: r.status, data: JSON.parse(t) }; }
        catch { return { erro: true, status: r.status, data: { erro: t.substring(0, 300) } }; }
      }
      const data = await r.json();
      const deals = data.deals || [];
      todosDeals = todosDeals.concat(deals);
      if (deals.length < limit) continuar = false;
      else { page++; if (page > 15) continuar = false; }
    }
    return { erro: false, data: { deals: todosDeals, total: todosDeals.length } };
  }

  try {
    // ── CASO 1: deal_pipelines ─────────────────────────────
    if (queryPath === 'deal_pipelines') {
      const { status, data } = await getSimples('deal_pipelines', queryParams);
      if (Array.isArray(data)) return res.status(status).json({ deal_pipelines: data });
      return res.status(status).json(data);
    }

    // ── CASO 2: contacts ───────────────────────────────────
    if (queryPath === 'contacts') {
      const { status, data } = await getSimples('contacts', queryParams);
      return res.status(status).json(data);
    }

    // ── CASO 3: tasks ──────────────────────────────────────
    if (queryPath === 'tasks') {
      const { status, data } = await getSimples('tasks', queryParams);
      return res.status(status).json(data);
    }

    // ── CASO 4: organizations (busca por nome ou id) ───────
    if (queryPath === 'organizations' || queryPath.startsWith('organizations/')) {
      const { status, data } = await getSimples(queryPath, queryParams);
      return res.status(status).json(data);
    }

    // ── CASO 5: deals com contact_id ───────────────────────
    if (queryPath === 'deals' && queryParams.contact_id) {
      const { status, data } = await getSimples('deals', { ...queryParams, limit: '50' });
      return res.status(status).json(data);
    }

    // ── CASO 6: deals com deal_pipeline_id ─────────────────
    if (queryPath === 'deals' && queryParams.deal_pipeline_id) {
      const result = await getDealsComPaginacao(queryParams);
      if (result.erro) return res.status(result.status).json(result.data);
      return res.status(200).json(result.data);
    }

    // ── CASO 7: deals geral ────────────────────────────────
    if (queryPath === 'deals') {
      const result = await getDealsComPaginacao(queryParams);
      if (result.erro) return res.status(result.status).json(result.data);
      return res.status(200).json(result.data);
    }

    // ── CASO 8: qualquer outro endpoint ────────────────────
    const { status, data } = await getSimples(queryPath, queryParams);
    return res.status(status).json(data);

  } catch (e) {
    return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
  }
}
