export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  const { usuario, senha } = req.body || {};
  if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha obrigatórios.' });

  const usuarioCorreto = (process.env.DASHBOARD_USER || '').trim();
  const senhaCorreta   = (process.env.DASHBOARD_PASSWORD || '').trim();

  if (usuario.trim() !== usuarioCorreto || senha.trim() !== senhaCorreta) {
    return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
  }

  // Token fixo gerado a partir de um hash simples — sem base64 de caracteres especiais
  const sessionToken = Buffer.from(usuarioCorreto + '|' + senhaCorreta + '|otx2026')
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, 'x');

  return res.status(200).json({ ok: true, sessionToken });
}
