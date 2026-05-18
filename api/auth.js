import { createHmac } from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  const { usuario, senha } = req.body || {};
  if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha obrigatórios.' });

  let usuarios = [];
  try {
    const raw = (process.env.DASHBOARD_USERS || '').trim();
    if (raw) {
      usuarios = JSON.parse(raw);
    } else {
      const u = (process.env.DASHBOARD_USER || '').trim();
      const s = (process.env.DASHBOARD_PASSWORD || '').trim();
      if (u && s) usuarios = [{ usuario: u, senha: s, nome: u, admin: true }];
    }
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao carregar usuários.' });
  }

  if (!usuarios.length) return res.status(500).json({ erro: 'Nenhum usuário configurado.' });

  const user = usuarios.find(u => u.usuario.trim() === usuario.trim() && u.senha.trim() === senha.trim());
  if (!user) return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });

  // Token baseado em SECRET + usuario — não muda quando senha muda
  const secret = (process.env.SESSION_SECRET || 'otx-secret-2024').trim();
  const sessionToken = 'otx-' + createHmac('sha256', secret).update(user.usuario).digest('hex').substring(0, 32);

  return res.status(200).json({ ok: true, sessionToken, nome: user.nome || user.usuario, admin: user.admin === true });
}
