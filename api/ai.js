export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-AI-Key, X-AI-Provider');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  const apiKey   = req.headers['x-ai-key'];
  const provider = (req.headers['x-ai-provider'] || 'gemini').toLowerCase();
  const { prompt, max_tokens } = req.body;

  if (!apiKey)  return res.status(400).json({ erro: 'Chave API não fornecida.' });
  if (!prompt)  return res.status(400).json({ erro: 'Campo prompt obrigatório.' });

  try {
    let texto = '';

    if (provider === 'anthropic') {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: max_tokens||1000, messages: [{ role: 'user', content: prompt }] })
      });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ erro: d.error?.message||'Erro Anthropic', detalhe: d });
      texto = d.content?.find(b=>b.type==='text')?.text || '';

    } else if (provider === 'gemini') {
      // gemini-2.5-flash é o modelo gratuito atual (gemini-2.0-flash depreciado em março 2026)
      const model = 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: max_tokens||1000 }
        })
      });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ erro: d.error?.message||'Erro Gemini', detalhe: d });
      texto = d.candidates?.[0]?.content?.parts?.[0]?.text || '';

    } else if (provider === 'openai') {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: max_tokens||1000, messages: [{ role: 'user', content: prompt }] })
      });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ erro: d.error?.message||'Erro OpenAI', detalhe: d });
      texto = d.choices?.[0]?.message?.content || '';

    } else {
      return res.status(400).json({ erro: `Provedor desconhecido: ${provider}. Use anthropic, gemini ou openai.` });
    }

    return res.status(200).json({ texto });
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
