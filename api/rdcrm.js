// /api/rdcrm.js — Proxy RD Station CRM API v2
const BASE = 'https://crm.rdstation.com/api/v2';

async function fetchV2(path, params, token) {
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';
  return fetch(`${BASE}/${path}${qs}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
}

async function renovarToken() {
  const r = await fetch('https://api.rdstation.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.ID_DO_CLIENTE_RDCRM,
      client_secret: process.env.RDCRM_CLIENT_SECRET,
      refresh_token: process.env.RDCRM_REFRESH_TOKEN,
    }),
  });
  const data = await r.json();
  if (!r.ok || !data.access_token) throw new Error(data.error_description || 'Erro ao renovar token');
  return data.access_token;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.RDCRM_ACCESS_TOKEN;
  if (!token) {
    return res.status(401).json({ erro: 'RDCRM_ACCESS_TOKEN não configurado. Acesse /api/rdcrm-auth para autorizar.' });
  }

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ erro: 'path é obrigatório' });

  try {
    let r = await fetchV2(path, params, token);

    if (r.status === 401) {
      try {
        const novoToken = await renovarToken();
        r = await fetchV2(path, params, novoToken);
        res.setHeader('X-New-Access-Token', novoToken);
      } catch (err) {
        return res.status(401).json({ erro: 'Token expirado: ' + err.message, reauth: true });
      }
    }

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
};
