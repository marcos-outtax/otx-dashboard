const CLIENT_ID = '1027473122132-bb82qm1hh54qtrc11uuffcbe0d9ltmu4.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

async function refreshAccessToken(refreshToken) {
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Google-Token, X-Google-Refresh-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let accessToken = req.headers['x-google-token'];
  const refreshToken = req.headers['x-google-refresh-token'];

  if (!accessToken) {
    return res.status(401).json({ erro: 'Token do Google não fornecido.' });
  }

  const { timeMin, timeMax } = req.query;

  if (!timeMin || !timeMax) {
    return res.status(400).json({ erro: 'Parâmetros timeMin e timeMax são obrigatórios.' });
  }

  async function buscarEventos(token) {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
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

    // Se token expirou, tenta renovar
    if (calRes.status === 401 && refreshToken) {
      const newTokenData = await refreshAccessToken(refreshToken);
      if (newTokenData.access_token) {
        accessToken = newTokenData.access_token;
        calRes = await buscarEventos(accessToken);
        // Retorna novo token para o frontend salvar
        res.setHeader('X-New-Access-Token', accessToken);
      } else {
        return res.status(401).json({ erro: 'Token expirado. Reconecte o Google Agenda.', reauth: true });
      }
    }

    const data = await calRes.json();

    if (!calRes.ok) {
      return res.status(calRes.status).json({ erro: data.error?.message || 'Erro ao buscar agenda.' });
    }

    // Filtra apenas eventos com videoconferência ou que tenham "reunião" no título
    const eventos = (data.items || []).map(ev => {
      const start = ev.start?.dateTime || ev.start?.date || '';
      const end = ev.end?.dateTime || ev.end?.date || '';
      const data_evento = start.split('T')[0];
      const hora = start.includes('T') ? start.split('T')[1].substring(0, 5) : '00:00';

      // Calcula duração
      let dur = '1h';
      if (ev.start?.dateTime && ev.end?.dateTime) {
        const diffMs = new Date(end) - new Date(start);
        const diffMin = Math.round(diffMs / 60000);
        if (diffMin < 60) dur = diffMin + 'min';
        else if (diffMin % 60 === 0) dur = (diffMin / 60) + 'h';
        else dur = Math.floor(diffMin / 60) + 'h' + (diffMin % 60) + 'min';
      }

      // Detecta origem pelo calendário ou organizador
      const organizer = ev.organizer?.email || '';
      const origem = organizer.includes('midias') || organizer.includes('marketing') ? 'marketing' : 'direto';

      // Extrai email do convidado principal (que não seja o próprio usuário)
      const attendees = ev.attendees || [];
      const convidado = attendees.find(a => !a.self);
      const email = convidado?.email || '';

      return {
        nome: ev.summary || 'Sem título',
        hora,
        dur,
        origem,
        email,
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
