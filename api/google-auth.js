const CLIENT_ID = '1027473122132-bb82qm1hh54qtrc11uuffcbe0d9ltmu4.apps.googleusercontent.com';
const REDIRECT_URI = 'https://otx-dashborad.vercel.app/api/google-callback';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export default function handler(req, res) {
  const sessionToken = req.query.session || '';
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state: sessionToken,
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(authUrl);
}
