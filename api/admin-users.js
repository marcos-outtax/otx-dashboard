// ============================================================
// api/admin-users.js — Gerenciamento de usuários (somente admin)
// FASE 3: Hash de senhas + CSRF em operações de escrita
// ============================================================
import { aplicarCORS, exigirAdmin, carregarUsuarios, exigirCSRF, hashSenha, gerarSalt } from './_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, POST, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminUser = exigirAdmin(req, res);
  if (!adminUser) return;

  const usuarios = carregarUsuarios();

  // ── GET: lista usuários SEM senhas ─────────────────────────
  if (req.method === 'GET') {
    const lista = usuarios.map(u => ({
      usuario: u.usuario,
      nome: u.nome || u.usuario,
      admin: u.admin === true,
      // Indica se já migrou para hash (informativo para o admin)
      hashAtivo: !!(u.hash && u.salt),
    }));
    return res.status(200).json({ usuarios: lista });
  }

  // ── Operações de escrita exigem CSRF ───────────────────────
  if (!exigirCSRF(req, res)) return;

  // ── PATCH: redefine senha (agora com hash) ─────────────────
  if (req.method === 'PATCH') {
    const { usuario, novaSenha } = req.body || {};
    if (typeof usuario !== 'string' || typeof novaSenha !== 'string') {
      return res.status(400).json({ erro: 'Usuário e nova senha devem ser texto.' });
    }
    if (!usuario.trim() || novaSenha.trim().length < 4) {
      return res.status(400).json({ erro: 'Senha precisa ter ao menos 4 caracteres.' });
    }
    if (novaSenha.length > 200) return res.status(400).json({ erro: 'Senha muito longa.' });

    const idx = usuarios.findIndex(u => u.usuario === usuario.trim());
    if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    // FASE 3: Salva com hash em vez de texto puro
    const salt = gerarSalt();
    const hash = hashSenha(novaSenha.trim(), salt);

    const novosUsuarios = [...usuarios];
    novosUsuarios[idx] = {
      ...novosUsuarios[idx],
      hash,
      salt,
      senha: undefined, // Remove senha texto puro se existia
    };
    // Limpa a chave "senha" do objeto
    delete novosUsuarios[idx].senha;

    const ok = await atualizarVariavel(novosUsuarios);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Senha atualizada com hash seguro.' });
  }

  // ── POST: adiciona usuário (com hash) ──────────────────────
  if (req.method === 'POST') {
    const { usuario, senha, nome, admin } = req.body || {};
    if (typeof usuario !== 'string' || typeof senha !== 'string') {
      return res.status(400).json({ erro: 'Usuário e senha devem ser texto.' });
    }
    if (!usuario.trim() || senha.trim().length < 4) {
      return res.status(400).json({ erro: 'Usuário e senha (mín. 4 caracteres) obrigatórios.' });
    }
    if (usuario.length > 50 || senha.length > 200) {
      return res.status(400).json({ erro: 'Tamanho excedido.' });
    }
    if (usuarios.find(u => u.usuario === usuario.trim())) {
      return res.status(400).json({ erro: 'Usuário já existe.' });
    }

    // FASE 3: Senha com hash
    const salt = gerarSalt();
    const hash = hashSenha(senha.trim(), salt);

    const novosUsuarios = [...usuarios, {
      usuario: usuario.trim(),
      hash,
      salt,
      nome: typeof nome === 'string' && nome.trim() ? nome.trim() : usuario.trim(),
      admin: admin === true,
    }];

    const ok = await atualizarVariavel(novosUsuarios);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar. Verifique VERCEL_TOKEN e VERCEL_PROJECT_ID.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário adicionado com senha segura.' });
  }

  // ── DELETE: remove usuário ─────────────────────────────────
  if (req.method === 'DELETE') {
    const { usuario } = req.body || {};
    if (typeof usuario !== 'string' || !usuario.trim()) {
      return res.status(400).json({ erro: 'Usuário obrigatório.' });
    }
    if (usuario.trim() === adminUser.usuario) {
      return res.status(400).json({ erro: 'Você não pode remover seu próprio usuário.' });
    }

    const novosUsuarios = usuarios.filter(u => u.usuario !== usuario.trim());
    if (novosUsuarios.length === usuarios.length) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    if (!novosUsuarios.some(u => u.admin === true)) {
      return res.status(400).json({ erro: 'Não é possível remover o último administrador.' });
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

  if (!token || !projectId) return false;

  const valor = JSON.stringify(usuarios);
  const url = `https://api.vercel.com/v10/projects/${projectId}/env${teamId ? `?teamId=${teamId}` : ''}`;

  try {
    const rGet = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const dataGet = await rGet.json();
    const envs = dataGet.envs || [];
    const existente = envs.find(e => e.key === 'DASHBOARD_USERS');

    if (existente) {
      const r = await fetch(
        `https://api.vercel.com/v10/projects/${projectId}/env/${existente.id}${teamId ? `?teamId=${teamId}` : ''}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: valor, target: ['production', 'preview', 'development'] }),
        }
      );
      return r.ok;
    } else {
      const r = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'DASHBOARD_USERS',
          value: valor,
          type: 'encrypted',
          target: ['production', 'preview', 'development'],
        }),
      });
      return r.ok;
    }
  } catch (e) {
    console.error('Erro ao atualizar variável Vercel:', e.message);
    return false;
  }
}
