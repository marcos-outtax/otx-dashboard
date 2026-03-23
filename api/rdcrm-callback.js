export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      erro: 'Code não recebido'
    });
  }

  try {
    const response = await fetch('https://crm.rdstation.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.ID_DO_CLIENTE_RDCRM,
        client_secret: process.env.RDCRM_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://otx-dashborad.vercel.app/api/rdcrm-callback'
      })
    });

    const data = await response.json();

    return res.status(200).json({
      sucesso: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      resposta_completa: data
    });

  } catch (e) {
    return res.status(500).json({
      erro: 'Erro ao gerar token',
      detalhe: e.message
    });
  }
}
