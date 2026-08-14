// ============================================================
// api/google-auth.js — Inicia o fluxo OAuth do Google
// CORREÇÕES:
//  - CLIENT_ID/REDIRECT_URI via env vars (era hardcoded)
//  - Domínio corrigido (typo "otx-dashborad" → "otx-dashboard")
//  - Validação do session token recebido via query
// ============================================================

const SCOPES = [
  // calendar.events permite ler E criar/editar eventos (necessário para
  // duplicar/transferir reuniões). Substitui o antigo calendar.readonly.
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

export default function handler(req, res) {
  const CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const REDIRECT_URI = (process.env.GOOGLE_REDIRECT_URI ||
    'https://otx-dashboard.vercel.app/api/google-callback').trim();

  if (!CLIENT_ID) {
    return res.status(500).send('GOOGLE_CLIENT_ID não configurado.');
  }

  // Aceita session token via query (mantém compatibilidade)
  // ATENÇÃO: numa versão futura, mover para cookie HttpOnly
  // (atualmente vai pra logs do Vercel — vulnerabilidade #9 do relatório)
  const sessionToken = typeof req.query.session === 'string'
    ? req.query.session.substring(0, 100)
    : '';

  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: 'code',
    scope:         SCOPES,
    access_type:   'offline',
    prompt:        'consent',
    state:         sessionToken,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(authUrl);
}
