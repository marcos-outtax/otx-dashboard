// ============================================================
// api/admin-migrate-senhas.js — Migra senhas texto puro → hash
// FASE 3: Endpoint de uso único para migrar as senhas existentes
//
// COMO USAR:
// 1. Faz login no dashboard normalmente
// 2. Abre o Console do Chrome (F12)
// 3. Cola e roda:
//    fetch('/api/admin-migrate-senhas',{method:'POST',headers:{'X-Session-Token':getSessionToken(),'X-CSRF-Token':getCfg().csrfToken}}).then(r=>r.json()).then(d=>console.log(d))
// 4. Se retornar { ok: true, migrados: N } — N senhas foram migradas
// 5. TODOS os usuários precisarão fazer login novamente
// 6. Após confirmar que funciona, pode DELETAR este arquivo do GitHub
// ============================================================
import { aplicarCORS, exigirAdmin, carregarUsuarios, hashSenha, gerarSalt, exigirCSRF } from './_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  const adminUser = exigirAdmin(req, res);
  if (!adminUser) return;

  if (!exigirCSRF(req, res)) return;

  const usuarios = carregarUsuarios();
  let migrados = 0;

  const novosUsuarios = usuarios.map(u => {
    // Já tem hash: pula
    if (u.hash && u.salt) return u;

    // Tem senha em texto puro: migra
    if (typeof u.senha === 'string' && u.senha.trim()) {
      const salt = gerarSalt();
      const hash = hashSenha(u.senha.trim(), salt);
      migrados++;
      const { senha, ...rest } = u; // Remove senha texto puro
      return { ...rest, hash, salt };
    }

    return u;
  });

  if (migrados === 0) {
    return res.status(200).json({ ok: true, migrados: 0, mensagem: 'Todas as senhas já estão com hash.' });
  }

  // Salva no Vercel
  const token = (process.env.VERCEL_TOKEN || '').trim();
  const projectId = (process.env.VERCEL_PROJECT_ID || '').trim();
  const teamId = (process.env.VERCEL_TEAM_ID || '').trim();

  if (!token || !projectId) {
    return res.status(500).json({ erro: 'VERCEL_TOKEN ou VERCEL_PROJECT_ID não configurados.' });
  }

  const valor = JSON.stringify(novosUsuarios);
  const url = `https://api.vercel.com/v10/projects/${projectId}/env${teamId ? `?teamId=${teamId}` : ''}`;

  try {
    const rGet = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const dataGet = await rGet.json();
    const existente = (dataGet.envs || []).find(e => e.key === 'DASHBOARD_USERS');

    if (existente) {
      const r = await fetch(
        `https://api.vercel.com/v10/projects/${projectId}/env/${existente.id}${teamId ? `?teamId=${teamId}` : ''}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: valor, target: ['production', 'preview', 'development'] }),
        }
      );
      if (!r.ok) return res.status(500).json({ erro: 'Erro ao salvar no Vercel.' });
    }

    return res.status(200).json({
      ok: true,
      migrados,
      mensagem: `${migrados} senha(s) migrada(s) para hash seguro. Todos os usuários precisarão fazer login novamente após o redeploy (~30s).`,
    });
  } catch (e) {
    return res.status(500).json({ erro: 'Erro: ' + e.message });
  }
}
