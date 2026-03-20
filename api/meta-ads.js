export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Meta-Token, X-Meta-Account');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Prioridade: variáveis de ambiente do Vercel → headers do frontend
  const token = process.env.META_ADS_TOKEN || req.headers['x-meta-token'];
  const accountId = process.env.META_ADS_ACCOUNT || req.headers['x-meta-account'];

  if (!token) return res.status(400).json({ erro: 'Token do Meta não configurado. Adicione META_ADS_TOKEN nas variáveis de ambiente do Vercel.' });
  if (!accountId) return res.status(400).json({ erro: 'ID da conta não configurado. Adicione META_ADS_ACCOUNT nas variáveis de ambiente do Vercel.' });

  const { dateStart, dateEnd } = req.query;

  // Aceita com ou sem "act_"
  const actId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;

  // Datas padrão: últimos 30 dias
  const hoje = new Date();
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(hoje.getDate() - 30);
  const since = dateStart || trintaDiasAtras.toISOString().split('T')[0];
  const until = dateEnd || hoje.toISOString().split('T')[0];

  const timeRange = JSON.stringify({ since, until });
  const fields = 'campaign_name,impressions,clicks,spend,reach,cpc,ctr,cost_per_action_type,actions';

  try {
    const url = `https://graph.facebook.com/v19.0/${actId}/insights?fields=${encodeURIComponent(fields)}&time_range=${encodeURIComponent(timeRange)}&level=campaign&access_token=${token}`;

    const r = await fetch(url);
    const data = await r.json();

    if (data.error) {
      return res.status(400).json({
        erro: data.error.message || 'Erro na API do Meta',
        codigo: data.error.code,
        tipo: data.error.type
      });
    }

    // Processa os dados
    const campanhas = (data.data || []).map(c => {
      const actions = c.actions || [];
      const leads = actions.find(a => a.action_type === 'lead')?.value || '0';
      const conversoes = actions.find(a => a.action_type === 'offsite_conversion.fb_pixel_lead')?.value || '0';
      const totalLeads = Math.max(parseInt(leads), parseInt(conversoes));
      const spend = parseFloat(c.spend || 0);
      const leadsNum = totalLeads || 0;
      const cpl = leadsNum > 0 ? (spend / leadsNum).toFixed(2) : null;

      return {
        nome: c.campaign_name || '-',
        investimento: spend,
        alcance: parseInt(c.reach || 0),
        impressoes: parseInt(c.impressions || 0),
        cliques: parseInt(c.clicks || 0),
        ctr: parseFloat(c.ctr || 0).toFixed(2),
        cpc: parseFloat(c.cpc || 0).toFixed(2),
        leads: leadsNum,
        cpl: cpl ? parseFloat(cpl) : null
      };
    });

    // Totais
    const totais = campanhas.reduce((acc, c) => ({
      investimento: acc.investimento + c.investimento,
      alcance: acc.alcance + c.alcance,
      impressoes: acc.impressoes + c.impressoes,
      cliques: acc.cliques + c.cliques,
      leads: acc.leads + c.leads
    }), { investimento: 0, alcance: 0, impressoes: 0, cliques: 0, leads: 0 });

    totais.cpl = totais.leads > 0 ? (totais.investimento / totais.leads).toFixed(2) : null;
    totais.ctr = totais.impressoes > 0 ? ((totais.cliques / totais.impressoes) * 100).toFixed(2) : '0';

    return res.status(200).json({ campanhas, totais, periodo: { since, until } });

  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao conectar com a API do Meta: ' + e.message });
  }
}

