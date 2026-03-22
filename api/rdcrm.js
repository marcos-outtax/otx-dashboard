export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Token com proteção contra espaços/quebra de linha
  let token = (process.env.RDCRM_ACCESS_TOKEN || '').trim();

  if (!token) {
    return res.status(401).json({
      erro: 'RDCRM_ACCESS_TOKEN nao configurado. Acesse /api/rdcrm-auth para autorizar.'
    });
  }

  // Montagem do endpoint dinâmico
  const queryPath = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : req.query.path;

  const pathStr = queryPath || 'deals';

  const queryParams = { ...req.query };
  delete queryParams.path;

  const qs = new URLSearchParams(queryParams).toString();

  // ✅ Endpoint correto do RD CRM (OAuth v2)
  const url = `https://crm.rdstation.com/api/v1/${pathStr}${qs ? '?' + qs : ''}`;

  try {
    let r = await fetch(url, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...(req.method === 'POST' && req.body
        ? { body: JSON.stringify(req.body) }
        : {}),
    });

    // 🔄 Se token expirar, tenta renovar automaticamente
    if (r.status === 401) {
      try {
        const refresh = await fetch('https://api.rd.services/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: (process.env.ID_DO_CLIENTE_RDCRM || '').trim(),
            client_secret: (process.env.RDCRM_CLIENT_SECRET || '').trim(),
            refresh_token: (process.env.RDCRM_REFRESH_TOKEN || '').trim(),
          }),
        });

        const refreshData = await refresh.json();

        if (!refresh.ok || !refreshData.access_token) {
          throw new Error(JSON.stringify(refreshData));
        }

        // Novo token
        token = refreshData.access_token;

        // Retorna no header (debug/monitoramento)
        res.setHeader('X-New-Access-Token', token);

        // Reexecuta a chamada com novo token
        r = await fetch(url, {
          method: req.method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

      } catch (refreshErr) {
        return res.status(401).json({
          erro: 'Token expirado e falha ao renovar',
          detalhe: refreshErr.message,
          reauth: true
        });
      }
    }

    // Tratamento da resposta
    const text = await r.text();

    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).json({
        erro: `Resposta não JSON (status ${r.status})`,
        detalhe: text.substring(0, 300)
      });
    }

  } catch (e) {
    return res.status(500).json({
      erro: 'Erro interno',
      detalhe: e.message
    });
  }
}
