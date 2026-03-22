export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Valida sessão
  const sessionToken = req.headers['x-session-token'];
  const expectedToken = Buffer.from(
    (process.env.DASHBOARD_USER || '') + ':' + (process.env.DASHBOARD_PASSWORD || '')
  ).toString('base64');
  if (!sessionToken || sessionToken !== expectedToken) {
    return res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
  }

  // Token do CRM vem da Vercel — nunca exposto ao frontend
  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();
  if (!token) {
    return res.status(500).json({ erro: 'Token RDCRM não configurado na Vercel.' });
  }

  // Monta o path
  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : req.query.path;
  const pathStr = queryPath || 'deals';

  // Remove path dos query params
  const queryParams = { ...req.query };
  delete queryParams.path;

  // ── PAGINAÇÃO AUTOMÁTICA para deals ──────────────────────
  // Busca todas as páginas sem número fixo — nenhum lead é perdido
  if (req.method === 'GET' && pathStr === 'deals') {
    try {
      const allDeals = [];
      const ids = new Set();
      let page = 1;
      const limit = 200; // máximo da API

      while (true) {
        const qs = new URLSearchParams({
          token,
          ...queryParams,
          page: String(page),
          limit: String(limit)
        }).toString();

        const url = `https://crm.rdstation.com/api/v1/deals?${qs}`;
        const response = await fetch(url, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          return res.status(response.status).json({
            erro: 'Erro na API RD CRM',
            detalhe: err
          });
        }

        const data = await response.json();
        const deals = data.deals || [];

        // Deduplicação por ID
        deals.forEach(d => {
          if (!ids.has(d._id)) {
            ids.add(d._id);
            allDeals.push(d);
          }
        });

        // Para quando vier menos que o limite — última página
        if (deals.length < limit) break;
        page++;
      }

      return res.status(200).json({ deals: allDeals, total: allDeals.length });

    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // ── DEMAIS ENDPOINTS (deal_pipelines, deal_stages, tasks, activities) ──
  try {
    const method = req.method;
    const qs = new URLSearchParams({ token, ...queryParams }).toString();
    const url = `https://crm.rdstation.com/api/v1/${pathStr}?${qs}`;

    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    // Para POST (ex: gravar atividade no deal)
    if (method === 'POST' && req.body) {
      opts.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, opts);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch {
      return res.status(response.status).json({
        erro: `RD CRM retornou status ${response.status}`,
        detalhe: text.substring(0, 300)
      });
    }

  } catch (e) {
    return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
  }
}
