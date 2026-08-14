// ============================================================
// api/google-calendar.js — Lista eventos do Google Calendar
// CORREÇÕES:
//  - CLIENT_SECRET via env (era hardcoded!)
//  - EXIGE sessão válida do dashboard (defesa em profundidade)
//  - CORS restrito por allowlist
//  - Lista de emails internos via env (era hardcoded no HTML)
// ============================================================
import { aplicarCORS, exigirSessao } from './_lib/auth.js';

async function refreshAccessToken(refreshToken) {
  const CLIENT_ID     = (process.env.GOOGLE_CLIENT_ID     || '').trim();
  const CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type:    'refresh_token',
    }),
  });
  return res.json();
}

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── 🔒 EXIGE SESSÃO VÁLIDA ────────────────────────────────
  const usuario = exigirSessao(req, res);
  if (!usuario) return;

  let accessToken = req.headers['x-google-token'];
  const refreshToken = req.headers['x-google-refresh-token'];

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(401).json({ erro: 'Token do Google não fornecido.' });
  }

  const { timeMin, timeMax } = req.query;
  if (typeof timeMin !== 'string' || typeof timeMax !== 'string') {
    return res.status(400).json({ erro: 'Parâmetros timeMin e timeMax obrigatórios.' });
  }

  async function buscarEventos(token) {
    const params = new URLSearchParams({
      timeMin, timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '500',
    });
    return fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  try {
    let calRes = await buscarEventos(accessToken);

    if (calRes.status === 401 && refreshToken) {
      const newTokenData = await refreshAccessToken(refreshToken);
      if (newTokenData.access_token) {
        accessToken = newTokenData.access_token;
        calRes = await buscarEventos(accessToken);
        res.setHeader('X-New-Access-Token', accessToken);
      } else {
        return res.status(401).json({ erro: 'Token expirado. Reconecte o Google Agenda.', reauth: true });
      }
    }

    const data = await calRes.json();
    if (!calRes.ok) {
      return res.status(calRes.status).json({ erro: data.error?.message || 'Erro ao buscar agenda.' });
    }

    // Lista de emails internos via env (era hardcoded no frontend)
    // Formato no Vercel: EMAILS_INTERNOS=email1@x.com,email2@y.com,outtax.com.br
    const emailsInternos = (process.env.EMAILS_INTERNOS || 'outtax.com.br')
      .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    const eventos = (data.items || []).map(ev => {
      const start = ev.start?.dateTime || ev.start?.date || '';
      const end = ev.end?.dateTime || ev.end?.date || '';
      const data_evento = start.split('T')[0];
      const hora = start.includes('T') ? start.split('T')[1].substring(0, 5) : '00:00';

      let dur = '1h';
      if (ev.start?.dateTime && ev.end?.dateTime) {
        const diffMs = new Date(end) - new Date(start);
        const diffMin = Math.round(diffMs / 60000);
        if (diffMin < 60) dur = diffMin + 'min';
        else if (diffMin % 60 === 0) dur = (diffMin / 60) + 'h';
        else dur = Math.floor(diffMin / 60) + 'h' + (diffMin % 60) + 'min';
      }

      const organizer = ev.organizer?.email || '';
      const origem = organizer.includes('midias') || organizer.includes('marketing') ? 'marketing' : 'direto';

      const attendees = ev.attendees || [];
      const convidadoCliente = attendees.find(a =>
        !a.self &&
        !emailsInternos.some(ei => (a.email || '').toLowerCase().includes(ei))
      );
      const convidado = convidadoCliente || attendees.find(a => !a.self);
      const email = convidado?.email || '';

      return {
        nome: ev.summary || 'Sem título',
        hora, dur, origem, email,
        org: organizer,
        dest: '',
        _data: data_evento,
        _googleId: ev.id,
        _link: ev.hangoutLink || ev.location || '',
      };
    });

    return res.status(200).json({ eventos });
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
