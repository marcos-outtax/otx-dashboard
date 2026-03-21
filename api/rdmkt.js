// /api/rdmkt.js
// Proxy seguro para o RD Station Marketing API
// Usa access_token OAuth2 salvo no Vercel

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const accessToken = process.env.RDMKT_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ erro: 'RDMKT_ACCESS_TOKEN não configurado. Complete o fluxo OAuth.' });
  }

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ erro: 'Parâmetro path obrigatório.' });

  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  const url = `https://api.rd.services/platform/${path}${qs}`;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    // Se token expirou, retorna erro claro para o usuário renovar
    if (r.status === 401) {
      return res.status(401).json({
        erro: 'Token expirado. Acesse /api/rdmkt-auth para renovar.',
        renovar: '/api/rdmkt-auth'
      });
    }

    const text = await r.text();
    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).json({
        erro: `RD Marketing retornou status ${r.status}`,
        detalhe: text.substring(0, 500)
      });
    }
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
