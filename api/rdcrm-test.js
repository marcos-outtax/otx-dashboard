export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.rd.services/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.ID_DO_CLIENTE_RDCRM,
        client_secret: process.env.RDCRM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: 'teste',
        redirect_uri: 'https://otx-dashborad.vercel.app/api/rdcrm-callback'
      })
    });

    const data = await response.json();

    return res.status(200).json({
      teste: 'RDCRM usando endpoint do Marketing',
      resposta: data
    });

  } catch (e) {
    return res.status(500).json({
      erro: 'Falha na requisição',
      detalhe: e.message
    });
  }
}
