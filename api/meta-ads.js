export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Meta-Token, X-Meta-Account');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.META_ADS_TOKEN || req.headers['x-meta-token'];
  const accountId = process.env.META_ADS_ACCOUNT || req.headers['x-meta-account'];

  if (!token) return res.status(400).json({ erro: 'Token do Meta não configurado. Adicione META_ADS_TOKEN nas variáveis de ambiente do Vercel.' });
  if (!accountId) return res.status(400).json({ erro: 'ID da conta não configurado. Adicione META_ADS_ACCOUNT nas variáveis de ambiente do Vercel.' });

  const { dateStart, dateEnd } = req.query;
  const actId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;

  const hoje = new Date();
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(hoje.getDate() - 30);
  const since = dateStart || trintaDiasAtras.toISOString().split('T')[0];
  const until = dateEnd || hoje.toISOString().split('T')[0];
  const timeRange = JSON.stringify({ since, until });

  try {
    // 1. Busca todas as campanhas com status e nome — usando campaign_id como chave
    const campsUrl = `https://graph.facebook.com/v19.0/${actId}/campaigns?fields=id,name,status,effective_status,daily_budget,lifetime_budget,start_time,stop_time&limit=200&access_token=${token}`;
    const campsRes = await fetch(campsUrl);
    const campsData = await campsRes.json();

    if (campsData.error) {
      return res.status(400).json({ erro: campsData.error.message || 'Erro na API do Meta', codigo: campsData.error.code });
    }

    // Mapa por ID (mais confiável que por nome)
    const campanhasPorId = {};
    const campanhasPorNome = {};
    (campsData.data || []).forEach(c => {
      const info = {
        id: c.id,
        nome: c.name,
        status: c.effective_status || c.status,
        orcamentoDiario: c.daily_budget ? parseFloat(c.daily_budget) / 100 : null,
        orcamentoTotal: c.lifetime_budget ? parseFloat(c.lifetime_budget) / 100 : null,
        inicio: c.start_time ? c.start_time.split('T')[0] : null,
        fim: c.stop_time ? c.stop_time.split('T')[0] : null,
      };
      campanhasPorId[c.id] = info;
      campanhasPorNome[c.name] = info;
    });

    // 2. Busca insights com paginação completa
    const insightsFields = 'campaign_id,campaign_name,impressions,clicks,spend,reach,cpc,ctr,actions';
    let insightsUrl = `https://graph.facebook.com/v19.0/${actId}/insights?fields=${encodeURIComponent(insightsFields)}&time_range=${encodeURIComponent(timeRange)}&level=campaign&limit=100&access_token=${token}`;

    let todosInsights = [];
    let paginas = 0;
    while(insightsUrl && paginas < 10) {
      const insightsRes = await fetch(insightsUrl);
      const insightsData = await insightsRes.json();
      if (insightsData.error) {
        return res.status(400).json({ erro: insightsData.error.message || 'Erro ao buscar métricas', codigo: insightsData.error.code });
      }
      todosInsights = [...todosInsights, ...(insightsData.data || [])];
      insightsUrl = insightsData.paging?.next || null;
      paginas++;
    }

    // 3. Processa insights cruzando por campaign_id
    const idsComInsights = new Set();
    const campanhas = (todosInsights).map(c => {
      const infoStatus = campanhasPorId[c.campaign_id] || campanhasPorNome[c.campaign_name] || {};
      idsComInsights.add(c.campaign_id);

      const actions = c.actions || [];
      const leads = parseInt(actions.find(a => a.action_type === 'lead')?.value || '0');
      const leadsPixel = parseInt(actions.find(a => a.action_type === 'offsite_conversion.fb_pixel_lead')?.value || '0');
      const totalLeads = Math.max(leads, leadsPixel);

      const spend = parseFloat(c.spend || 0);
      const cliques = parseInt(c.clicks || 0);
      const impressoes = parseInt(c.impressions || 0);
      const alcance = parseInt(c.reach || 0);
      const ctr = parseFloat(c.ctr || 0);
      const cpc = parseFloat(c.cpc || 0);
      const cpl = totalLeads > 0 ? spend / totalLeads : null;
      const taxaConversao = cliques > 0 ? (totalLeads / cliques * 100) : null;

      return {
        id: c.campaign_id,
        nome: infoStatus.nome || c.campaign_name || c.campaign_id,
        status: infoStatus.status || 'UNKNOWN',
        investimento: spend,
        alcance,
        impressoes,
        cliques,
        ctr: ctr.toFixed(2),
        cpc: cpc.toFixed(2),
        leads: totalLeads,
        cpl: cpl ? parseFloat(cpl.toFixed(2)) : null,
        taxaConversao: taxaConversao ? parseFloat(taxaConversao.toFixed(2)) : null,
        orcamentoDiario: infoStatus.orcamentoDiario,
        orcamentoTotal: infoStatus.orcamentoTotal,
        inicio: infoStatus.inicio,
        fim: infoStatus.fim,
      };
    });

    // 4. Adiciona campanhas que existem mas sem dados no período
    Object.values(campanhasPorId).forEach(info => {
      if (!idsComInsights.has(info.id)) {
        campanhas.push({
          id: info.id,
          nome: info.nome,
          status: info.status,
          investimento: 0, alcance: 0, impressoes: 0, cliques: 0,
          ctr: '0', cpc: '0', leads: 0, cpl: null, taxaConversao: null,
          orcamentoDiario: info.orcamentoDiario,
          orcamentoTotal: info.orcamentoTotal,
          inicio: info.inicio,
          fim: info.fim,
          semDadosNoPeriodo: true
        });
      }
    });

    // 5. Separa ativas e pausadas ordenadas por investimento
    const ativas = campanhas.filter(c => c.status === 'ACTIVE').sort((a, b) => b.investimento - a.investimento);
    const pausadas = campanhas.filter(c => c.status !== 'ACTIVE').sort((a, b) => b.investimento - a.investimento);

    // 6. Totais apenas de campanhas com dados reais
    const comDados = campanhas.filter(c => !c.semDadosNoPeriodo);
    const totais = comDados.reduce((acc, c) => ({
      investimento: acc.investimento + c.investimento,
      alcance: acc.alcance + c.alcance,
      impressoes: acc.impressoes + c.impressoes,
      cliques: acc.cliques + c.cliques,
      leads: acc.leads + c.leads
    }), { investimento: 0, alcance: 0, impressoes: 0, cliques: 0, leads: 0 });

    totais.cpl = totais.leads > 0 ? parseFloat((totais.investimento / totais.leads).toFixed(2)) : null;
    totais.ctr = totais.impressoes > 0 ? ((totais.cliques / totais.impressoes) * 100).toFixed(2) : '0';
    totais.taxaConversao = totais.cliques > 0 ? parseFloat((totais.leads / totais.cliques * 100).toFixed(2)) : null;

    return res.status(200).json({ ativas, pausadas, totais, periodo: { since, until } });

  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao conectar com a API do Meta: ' + e.message });
  }
}



