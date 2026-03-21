export default async function handler(req, res) {
  // Tenta os dois nomes possíveis da variável
  const clientId = process.env.ID_DO_CLIENTE_RDMKT || process.env.RDMKT_CLIENT_ID;
  const callbackUrl = 'https://otx-dashborad.vercel.app/api/rdmkt-callback';

  if (!clientId) {
    return res.status(500).json({ 
      erro: 'Client ID não encontrado.',
      dica: 'Verifique se ID_DO_CLIENTE_RDMKT está salvo no Vercel em Environment Variables.'
    });
  }

  const authUrl = `https://api.rd.services/auth/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}`;
  
  return res.redirect(302, authUrl);
}
