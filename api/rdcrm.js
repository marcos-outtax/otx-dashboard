export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let token = process.env.RDCRM_ACCESS_TOKEN;
  if (!token) {
    return res.status(401).json({ erro: 'RDCRM_ACCESS_TOKEN nao configurado. Acesse /api/rdcrm-auth para autorizar.' });
  }

  const queryPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
  const pathStr = queryPath || 'deals';

  const queryParams = { ...req.query };
  delete queryParams.path;
  const qs = new URLSearchParams(queryParams).toString();
  const url = `https://crm.rdstation.com/api/v2/${pathStr}${qs ? '?' + qs : ''}`;

  try {
    let r = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...(req.method === 'POST' && req.body ? { body: JSON.stringify(req.body) } : {}),
    });

    // Token expirado — tenta renovar
    if (r.status === 401) {
      try {
        const refresh = await fetch('https://api.rdstation.com/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id:     process.env.ID_DO_CLIENTE_RDCRM,
            client_secret: process.env.RDCRM_CLIENT_SECRET,
            refresh_token: process.env.RDCRM_REFRESH_TOKEN,
          }),
        });
        const refreshData = await refresh.json();
        if (!refresh.ok || !refreshData.access_token) throw new Error('Falha ao renovar');
        token = refreshData.access_token;
        res.setHeader('X-New-Access-Token', token);
        r = await fetch(url, {
          method: req.method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
      } catch (refreshErr) {
        return res.status(401).json({ erro: 'Token expirado: ' + refreshErr.message, reauth: true });
      }
    }

    const text = await r.text();
    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).json({ erro: `Status ${r.status}`, detalhe: text.substring(0, 300) });
    }
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
