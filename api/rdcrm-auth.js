export default function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    clientId: process.env.ID_DO_CLIENTE_RDCRM || 'undefined'
  });
}
