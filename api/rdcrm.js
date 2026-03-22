export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const clientId = process.env.ID_DO_CLIENTE_RDCRM;
  const clientSecret = process.env.RDCRM_CLIENT_SECRET;
  let accessToken = process.env.RDCRM_ACCESS_TOKEN;
  const refreshToken = process.env.RDCRM_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return res.status(401).json({
      erro: 'Credenciais OAuth não configuradas no Vercel'
    });
  }

  // 🔄 Função para renovar token
  async function refreshAccessToken() {
    const response = await fetch('https://crm.rdstation.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao renovar token');
    }

    return data.access_token;
  }

  // Monta endpoint
  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : req.query.path;

  const pathStr = queryPath || 'deals';

  const queryParams = { ...req.query };
  delete queryParams.path;

  const qs = new URLSearchParams(queryParams).toString();

  const url = `https://crm.rdstation.com/api/v2/${pathStr}${qs ? '?' + qs : ''}`;

  async function fetchComToken(token) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    let response = await fetchComToken(accessToken);

    // 🔁 Se token expirou, renova automaticamente
    if (response.status === 401) {
      accessToken = await refreshAccessToken();
      response = await fetchComToken(accessToken);
    }

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (e) {
    return res.status(500).json({
      erro: 'Erro interno',
      detalhe: e.message
    });
  }
}
