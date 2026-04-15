// ============================================================
// api/rdcrm.js — Proxy para o RD Station CRM
// CORREÇÕES CRÍTICAS:
//  - EXIGE sessão válida (era aberto: vazava 1.329 contatos)
//  - WHITELIST de paths permitidos (era proxy aberto)
//  - CORS restrito por allowlist
//  - Validação de tipo nos params
// ============================================================
import { aplicarCORS, exigirSessao } from './_lib/auth.js';

// ── Whitelist: apenas paths que o frontend realmente usa ────
// Inclui paths exatos e prefixos (com /) para IDs específicos
const PATHS_PERMITIDOS_EXATOS = new Set([
  'deals',
  'contacts',
  'organizations',
  'tasks',
  'deal_pipelines',
  'activities',
]);

const PATHS_PERMITIDOS_PREFIX = [
  'deals/',          // deals/:id
  'contacts/',       // contacts/:id
  'organizations/',  // organizations/:id
];

function pathPermitido(path) {
  if (typeof path !== 'string' || !path) return false;
  // Bloqueia tentativas de path traversal e queries estranhas
  if (path.includes('..') || path.includes('//') || path.includes('?') || path.includes('#')) return false;
  // Bloqueia explicitamente endpoints sensíveis (ex: 'users' que vazava equipe interna)
  if (path === 'users' || path.startsWith('users/')) return false;
  if (PATHS_PERMITIDOS_EXATOS.has(path)) return true;
  return PATHS_PERMITIDOS_PREFIX.some(p => path.startsWith(p));
}

// ── Sanitiza query params (evita injection no token URL) ────
function sanitizarParams(params) {
  const limpo = {};
  for (const [k, v] of Object.entries(params || {})) {
    if (typeof k !== 'string' || k.length > 50) continue;
    if (typeof v !== 'string') continue;
    if (v.length > 500) continue;
    limpo[k] = v;
  }
  return limpo;
}

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, POST, PUT, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── 🔒 EXIGE SESSÃO VÁLIDA ────────────────────────────────
  const usuario = exigirSessao(req, res);
  if (!usuario) return; // exigirSessao já enviou 401

  const token = (process.env.RDCRM_TOKEN_SOCIO || '').trim();
  if (!token) return res.status(500).json({ erro: 'RDCRM_TOKEN_SOCIO não configurado' });

  // ── Resolve o path (vem do body em POST/PUT, da query em GET) ──
  let queryPath;
  if (req.method === 'GET') {
    queryPath = Array.isArray(req.query.path)
      ? req.query.path.join('/')
      : (req.query.path || 'deals');
  } else {
    const body = req.body || {};
    queryPath = body.path || (req.method === 'POST' ? 'activities' : null);
  }

  // ── Valida path contra whitelist ─────────────────────────
  if (!pathPermitido(queryPath)) {
    return res.status(403).json({ erro: 'Path não permitido.' });
  }

  // ── POST ──────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = { ...(req.body || {}) };
    delete body.path;
    const url = `https://crm.rdstation.com/api/v1/${queryPath}?token=${token}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0, 300) }); }
    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
    }
  }

  // ── PUT / PATCH (RD usa PUT mesmo para parcial) ──────────
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const body = { ...(req.body || {}) };
    delete body.path;
    const url = `https://crm.rdstation.com/api/v1/${queryPath}?token=${token}`;
    try {
      const r = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).json({ erro: 'Resposta não JSON', detalhe: text.substring(0, 300) }); }
    } catch (e) {
      return res.status(500).json({ erro: 'Erro interno PUT', detalhe: e.message });
    }
  }

  // ── GET ───────────────────────────────────────────────────
  const queryParams = { ...req.query };
  delete queryParams.path;
  const params = sanitizarParams(queryParams);

  async function getSimples(path, p) {
    const qs = new URLSearchParams({ token, ...p }).toString();
    const r = await fetch(`https://crm.rdstation.com/api/v1/${path}?${qs}`, {
      headers: { 'Accept': 'application/json' },
    });
    const text = await r.text();
    try { return { status: r.status, data: JSON.parse(text) }; }
    catch { return { status: r.status, data: { erro: 'Resposta não JSON', detalhe: text.substring(0, 300) } }; }
  }

  async function getDealsComPaginacao(p) {
    const limit = 200;
    let page = 1;
    let todosDeals = [];
    let continuar = true;
    while (continuar) {
      const qs = new URLSearchParams({ token, ...p, limit: String(limit), page: String(page) }).toString();
      const r = await fetch(`https://crm.rdstation.com/api/v1/deals?${qs}`, {
        headers: { 'Accept': 'application/json' },
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
    if (queryPath === 'deal_pipelines') {
      const { status, data } = await getSimples('deal_pipelines', params);
      if (Array.isArray(data)) return res.status(status).json({ deal_pipelines: data });
      return res.status(status).json(data);
    }

    if (queryPath === 'contacts') {
      const { status, data } = await getSimples('contacts', params);
      return res.status(status).json(data);
    }

    if (queryPath === 'tasks') {
      const { status, data } = await getSimples('tasks', params);
      return res.status(status).json(data);
    }

    if (queryPath === 'organizations' || queryPath.startsWith('organizations/')) {
      const { status, data } = await getSimples(queryPath, params);
      return res.status(status).json(data);
    }

    if (queryPath === 'deals' && params.contact_id) {
      const { status, data } = await getSimples('deals', { ...params, limit: '50' });
      return res.status(status).json(data);
    }

    if (queryPath === 'deals' && params.deal_pipeline_id) {
      const result = await getDealsComPaginacao(params);
      if (result.erro) return res.status(result.status).json(result.data);
      return res.status(200).json(result.data);
    }

    if (queryPath === 'deals') {
      const result = await getDealsComPaginacao(params);
      if (result.erro) return res.status(result.status).json(result.data);
      return res.status(200).json(result.data);
    }

    // contacts/:id, deals/:id, etc
    const { status, data } = await getSimples(queryPath, params);
    return res.status(status).json(data);

  } catch (e) {
    return res.status(500).json({ erro: 'Erro interno', detalhe: e.message });
  }
}
