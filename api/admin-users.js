import { createHmac } from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token, X-CSRF-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

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

  const sessionToken = req.headers['x-session-token'] || '';
  const secret = (process.env.SESSION_SECRET || 'otx-secret-2024').trim();

  const adminUser = usuarios.find(u => {
    if (u.admin !== true) return false;
    const token = 'otx-' + createHmac('sha256', secret).update(u.usuario).digest('hex').substring(0, 32);
    return token === sessionToken;
  });

  if (!adminUser) return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });

  if (req.method === 'GET') {
    return res.status(200).json({ usuarios: usuarios.map(u => ({ usuario: u.usuario, nome: u.nome || u.usuario, senha: u.senha, admin: u.admin === true })) });
  }

  if (req.method === 'POST') {
    const { usuario, senha, nome, admin } = req.body || {};
    if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha obrigatórios.' });
    if (usuarios.find(u => u.usuario === usuario.trim())) return res.status(400).json({ erro: 'Usuário já existe.' });
    const novos = [...usuarios, { usuario: usuario.trim(), senha: senha.trim(), nome: (nome || usuario).trim(), admin: admin === true }];
    const ok = await atualizarVariavel(novos);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar. Verifique VERCEL_TOKEN e VERCEL_PROJECT_ID.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário adicionado.' });
  }

  if (req.method === 'PATCH') {
    const { usuario, novaSenha } = req.body || {};
    if (!usuario || !novaSenha) return res.status(400).json({ erro: 'Usuário e nova senha obrigatórios.' });
    const idx = usuarios.findIndex(u => u.usuario === usuario.trim());
    if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    const novos = [...usuarios];
    novos[idx] = { ...novos[idx], senha: novaSenha.trim() };
    const ok = await atualizarVariavel(novos);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Senha atualizada com sucesso.' });
  }

  if (req.method === 'DELETE') {
    const { usuario } = req.body || {};
    if (!usuario) return res.status(400).json({ erro: 'Usuário obrigatório.' });
    if (usuario === adminUser.usuario) return res.status(400).json({ erro: 'Você não pode remover seu próprio usuário.' });
    const novos = usuarios.filter(u => u.usuario !== usuario);
    if (novos.length === usuarios.length) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    const ok = await atualizarVariavel(novos);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário removido.' });
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}

async function atualizarVariavel(usuarios) {
  const token = (process.env.VERCEL_TOKEN || '').trim();
  const projectId = (process.env.VERCEL_PROJECT_ID || '').trim();
  const teamId = (process.env.VERCEL_TEAM_ID || '').trim();
  if (!token || !projectId) return false;
  const valor = JSON.stringify(usuarios);
  const qs = teamId ? `?teamId=${teamId}` : '';
  try {
    const rGet = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const dataGet = await rGet.json();
    const existente = (dataGet.envs || []).find(e => e.key === 'DASHBOARD_USERS');
    if (existente) {
      const r = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env/${existente.id}${qs}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: valor, target: ['production', 'preview', 'development'] })
      });
      return r.ok;
    } else {
      const r = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env${qs}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'DASHBOARD_USERS', value: valor, type: 'encrypted', target: ['production', 'preview', 'development'] })
      });
      return r.ok;
    }
  } catch (e) { return false; }
}
