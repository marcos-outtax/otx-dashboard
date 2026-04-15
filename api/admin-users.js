// ============================================================
// api/admin-users.js — Gerenciamento de usuários (somente admin)
// CORREÇÕES:
//  - Reusa helper compartilhado (validação consistente)
//  - CORS restrito por allowlist
//  - Validação rigorosa de tipos
//  - Não permite escalar privilégio (não-admin não pode se tornar admin)
//  - GET continua retornando senhas (compat com UI atual);
//    será removido na Fase 3 quando UI mudar pra "redefinir senha"
// ============================================================
import { aplicarCORS, exigirAdmin, carregarUsuarios } from './_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, POST, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── 🔒 EXIGE SESSÃO DE ADMIN ──────────────────────────────
  const adminUser = exigirAdmin(req, res);
  if (!adminUser) return;

  const usuarios = carregarUsuarios();

  // ── GET: lista usuários ────────────────────────────────────
  if (req.method === 'GET') {
    const lista = usuarios.map(u => ({
      usuario: u.usuario,
      nome: u.nome || u.usuario,
      senha: u.senha, // ATENÇÃO: ver Fase 3 — substituir por "redefinir senha"
      admin: u.admin === true,
    }));
    return res.status(200).json({ usuarios: lista });
  }

  // ── PATCH: edita senha ─────────────────────────────────────
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
    const novosUsuarios = [...usuarios];
    novosUsuarios[idx] = { ...novosUsuarios[idx], senha: novaSenha.trim() };
    const ok = await atualizarVariavel(novosUsuarios);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar.' });
    return res.status(200).json({ ok: true, mensagem: 'Senha atualizada.' });
  }

  // ── POST: adiciona usuário ─────────────────────────────────
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

    const novosUsuarios = [...usuarios, {
      usuario: usuario.trim(),
      senha: senha.trim(),
      nome: typeof nome === 'string' && nome.trim() ? nome.trim() : usuario.trim(),
      admin: admin === true,
    }];

    const ok = await atualizarVariavel(novosUsuarios);
    if (!ok) return res.status(500).json({ erro: 'Erro ao salvar. Verifique VERCEL_TOKEN e VERCEL_PROJECT_ID.' });
    return res.status(200).json({ ok: true, mensagem: 'Usuário adicionado.' });
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
    // Garante que sobrou pelo menos um admin
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
