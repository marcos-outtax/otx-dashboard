// /api/rdcrm.js
// Proxy para RD Station CRM API v2
// Suporta filtro por data nativo (RDQL) e retorna deal_pipeline sempre preenchido

const BASE = 'https://crm.rdstation.com/api/v2';

async function fetchComToken(path, params, accessToken) {
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';
  const r = await fetch(`${BASE}/${path}${qs}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return r;
}

async function refreshAccessToken() {
  const clientId     = process.env.ID_DO_CLIENTE_RDCRM;
  const clientSecret = process.env.RDCRM_CLIENT_SECRET;
  const refreshToken = process.env.RDCRM_REFRESH_TOKEN;

  if (!refreshToken) throw new Error('RDCRM_REFRESH_TOKEN não configurado');

  const r = await fetch('https://api.rdstation.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  const data = await r.json();
  if (!r.ok || !data.access_token) {
    throw new Error(data.error_description || 'Erro ao renovar token');
  }
  return data.access_token;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const accessToken = process.env.RDCRM_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(401).json({
      erro: 'RDCRM_ACCESS_TOKEN não configurado. Acesse /api/rdcrm-auth para autorizar.'
    });
  }

  // Extrai path e params da query
  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ erro: 'path é obrigatório' });

  try {
    let r = await fetchComToken(path, params, accessToken);

    // Token expirado — tenta renovar automaticamente
    if (r.status === 401) {
      try {
        const novoToken = await refreshAccessToken();
        r = await fetchComToken(path, params, novoToken);
        // Avisa o cliente para salvar o novo token
        res.setHeader('X-New-Access-Token', novoToken);
      } catch (refreshErr) {
        return res.status(401).json({
          erro: 'Token expirado e não foi possível renovar: ' + refreshErr.message,
          reauth: true
        });
      }
    }

    const data = await r.json();
    return res.status(r.status).json(data);

  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
