// ============================================================
// api/google-calendar-create.js — Cria um novo evento no Google
// Calendar. Usado para "duplicar/transferir" uma reunião já
// existente sem alterar o evento original (ex: agendar um
// "Retorno de Proposta" a partir de uma reunião anterior).
// ============================================================
import { aplicarCORS, exigirSessao, exigirCSRF } from './_lib/auth.js';

async function refreshAccessToken(refreshToken) {
  const CLIENT_ID     = (process.env.GOOGLE_CLIENT_ID     || '').trim();
  const CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  return res.json();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMEZONE = 'America/Sao_Paulo';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  // ── 🔒 Sessão + CSRF (operação de escrita) ─────────────────
  const usuario = exigirSessao(req, res);
  if (!usuario) return;
  if (!exigirCSRF(req, res)) return;

  let accessToken = req.headers['x-google-token'];
  const refreshToken = req.headers['x-google-refresh-token'];
  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(401).json({ erro: 'Token do Google não fornecido. Reconecte o Google Agenda.' });
  }

  const { titulo, data, horaInicio, horaFim, emailCliente, descricao, criarMeet, notificarConvidados } = req.body || {};

  // ── Validações ──────────────────────────────────────────
  if (typeof titulo !== 'string' || !titulo.trim()) {
    return res.status(400).json({ erro: 'Título da reunião é obrigatório.' });
  }
  if (titulo.trim().length > 200) return res.status(400).json({ erro: 'Título muito longo (máx. 200 caracteres).' });

  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return res.status(400).json({ erro: 'Data inválida.' });
  }
  if (typeof horaInicio !== 'string' || !/^\d{2}:\d{2}$/.test(horaInicio)) {
    return res.status(400).json({ erro: 'Horário de início inválido.' });
  }

  let fim = (typeof horaFim === 'string' && /^\d{2}:\d{2}$/.test(horaFim)) ? horaFim : null;
  if (!fim) {
    const [h, m] = horaInicio.split(':').map(Number);
    const d = new Date(2000, 0, 1, h, m + 30);
    fim = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  const startDT = `${data}T${horaInicio}:00`;
  const endDT = `${data}T${fim}:00`;
  if (new Date(startDT) >= new Date(endDT)) {
    return res.status(400).json({ erro: 'O horário de término deve ser depois do horário de início.' });
  }

  let emailLimpo = '';
  if (typeof emailCliente === 'string' && emailCliente.trim()) {
    emailLimpo = emailCliente.trim();
    if (!EMAIL_RE.test(emailLimpo)) return res.status(400).json({ erro: 'E-mail do cliente inválido.' });
  }

  const descricaoLimpa = typeof descricao === 'string' ? descricao.slice(0, 5000) : '';

  // ── Monta o evento ──────────────────────────────────────
  const eventBody = {
    summary: titulo.trim(),
    start: { dateTime: startDT, timeZone: TIMEZONE },
    end: { dateTime: endDT, timeZone: TIMEZONE },
  };
  if (descricaoLimpa) eventBody.description = descricaoLimpa;
  if (emailLimpo) eventBody.attendees = [{ email: emailLimpo }];
  if (criarMeet === true) {
    eventBody.conferenceData = {
      createRequest: { requestId: 'otx-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) },
    };
  }

  const sendUpdates = notificarConvidados === false ? 'none' : 'all';

  async function criarEvento(token) {
    const params = new URLSearchParams({ sendUpdates });
    if (criarMeet === true) params.set('conferenceDataVersion', '1');
    return fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventBody),
    });
  }

  try {
    let evRes = await criarEvento(accessToken);

    if (evRes.status === 401 && refreshToken) {
      const newTokenData = await refreshAccessToken(refreshToken);
      if (newTokenData.access_token) {
        accessToken = newTokenData.access_token;
        evRes = await criarEvento(accessToken);
      } else {
        return res.status(401).json({ erro: 'Token expirado. Reconecte o Google Agenda.', reauth: true });
      }
    }

    const ev = await evRes.json();
    if (!evRes.ok) {
      return res.status(evRes.status >= 400 && evRes.status < 500 ? evRes.status : 502)
        .json({ erro: ev.error?.message || 'Erro ao criar evento na agenda.' });
    }

    const resp = {
      ok: true,
      evento: {
        id: ev.id,
        nome: ev.summary || titulo.trim(),
        _data: data,
        hora: horaInicio,
        _link: ev.hangoutLink || '',
        htmlLink: ev.htmlLink || '',
      },
    };
    if (accessToken !== req.headers['x-google-token']) resp.newAccessToken = accessToken;
    return res.status(200).json(resp);

  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao conectar com o Google Agenda: ' + e.message });
  }
}
