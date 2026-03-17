export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-AI-Key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  const apiKey = req.headers['x-ai-key'];
  if (!apiKey) return res.status(400).json({ erro: 'Chave API não fornecida no header X-AI-Key.' });

  const { prompt, max_tokens } = req.body;
  if (!prompt) return res.status(400).json({ erro: 'Campo prompt obrigatório.' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: max_tokens || 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        erro: data.error?.message || 'Erro na API Anthropic',
        detalhe: data
      });
    }

    const text = data.content?.find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ texto: text });

  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
