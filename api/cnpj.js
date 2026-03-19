export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const cnpj = (req.query.cnpj || '').replace(/\D/g, '');
  if (cnpj.length !== 14) {
    return res.status(400).json({ erro: 'CNPJ inválido. Informe 14 dígitos.' });
  }

  try {
    const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: { 'Accept': 'application/json' }
    });

    const text = await r.text();
    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).json({
        erro: `BrasilAPI retornou status ${r.status}`,
        detalhe: text.substring(0, 300)
      });
    }
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
