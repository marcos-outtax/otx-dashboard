export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token, X-CSRF-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Carrega usuários ───────────────────────────────────────
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

  // ── Valida sessão admin ────────────────────────────────────
  const sessionToken = req.headers['x-session-token'] || '';
  const adminUser = usuarios.find(u => {
    const token = 'otx-' + Buffer.from(u.usuario + u.senha).toString('hex').substring(0, 32);
    return token === sessionToken && u.admin === true;
  });

  if (!adminUser) {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }

  // ── GET: lista usuários com senha ──────────────────────────
  if (req.method === 'GET') {
    const lista = usuarios.map(u => ({
      usuario: u.usuario,
      nome: u.nome || u.usuario,
      senha: u.senha,
      admin: u.admin === true
    }));
    return res.status(200).json({ usuarios: lista });
  }

  // ── POST: adiciona usuário ─────────────────────────────────
  if (req.method === 'POST') {
    const { usuario, senha, nome, admin } = req.body || {};
    if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha obrigatórios.' });
    if (usuarios.find(u => u.usuario === usuario.trim())) {
      return res.status(400).json({ erro: 'Usuário já existe.' });
    }
    const novosUsuarios = [...usuarios, {
      usuario: usuario.trim(),
      senha: senha.trim(),
      nome: (nome || usuario).trim(),
      admin: admin === true
    }];
    const ok = await atualizarVariavel(novosUsuarios);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar. Verifique VERCEL_TOKEN e VERCEL_PROJECT_ID.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário adicionado.' });
  }

  // ── PATCH: edita senha ─────────────────────────────────────
  if (req.method === 'PATCH') {
    const { usuario, novaSenha } = req.body || {};
    if (!usuario || !novaSenha) {
      return res.status(400).json({ erro: 'Usuário e nova senha obrigatórios.' });
    }
    const idx = usuarios.findIndex(u => u.usuario === usuario.trim());
    if (idx === -1) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    const novosUsuarios = [...usuarios];
    novosUsuarios[idx] = { ...novosUsuarios[idx], senha: novaSenha.trim() };
    const ok = await atualizarVariavel(novosUsuarios);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar. Verifique VERCEL_TOKEN e VERCEL_PROJECT_ID.' });
    return res.status(200).json({ ok: true, mensagem: 'Senha atualizada com sucesso.' });
  }

  // ── DELETE: remove usuário ─────────────────────────────────
  if (req.method === 'DELETE') {
    const { usuario } = req.body || {};
    if (!usuario) return res.status(400).json({ erro: 'Usuário obrigatório.' });
    if (usuario === adminUser.usuario) {
      return res.status(400).json({ erro: 'Você não pode remover seu próprio usuário.' });
    }
    const novosUsuarios = usuarios.filter(u => u.usuario !== usuario);
    if (novosUsuarios.length === usuarios.length) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    const ok = await atualizarVariavel(novosUsuarios);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário removido.' });
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}

// ── Atualiza DASHBOARD_USERS no Vercel ────────────────────────
async function atualizarVariavel(usuarios) {
  const token = (process.env.VERCEL_TOKEN || '').trim();
  const projectId = (process.env.VERCEL_PROJECT_ID || '').trim();
  const teamId = (process.env.VERCEL_TEAM_ID || '').trim();

  if (!token || !projectId) {
    console.error('VERCEL_TOKEN ou VERCEL_PROJECT_ID não configurados');
    return false;
  }

  const valor = JSON.stringify(usuarios);
  const qs = teamId ? `?teamId=${teamId}` : '';

  try {
    // Busca variáveis existentes
    const rGet = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env${qs}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dataGet = await rGet.json();
    const envs = dataGet.envs || [];
    const existente = envs.find(e => e.key === 'DASHBOARD_USERS');

    if (existente) {
      // Atualiza variável existente
      const r = await fetch(
        `https://api.vercel.com/v10/projects/${projectId}/env/${existente.id}${qs}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: valor, target: ['production', 'preview', 'development'] })
        }
      );
      if (!r.ok) {
        const err = await r.text();
        console.error('Erro ao atualizar variável:', err);
        return false;
      }
      return true;
    } else {
      // Cria nova variável
      const r = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env${qs}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'DASHBOARD_USERS',
          value: valor,
          type: 'encrypted',
          target: ['production', 'preview', 'development']
        })
      });
      if (!r.ok) {
        const err = await r.text();
        console.error('Erro ao criar variável:', err);
        return false;
      }
      return true;
    }
  } catch (e) {
    console.error('Erro na API do Vercel:', e.message);
    return false;
  }
}
