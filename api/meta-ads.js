// ============================================================
// api/meta-ads.js — Proxy para a Graph API do Meta (Facebook Ads)
// ============================================================
import { aplicarCORS, exigirSessao } from './_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const usuario = exigirSessao(req, res);
  if (!usuario) return;

  const token = (process.env.META_ADS_TOKEN || '').trim();
  const accountId = (process.env.META_ADS_ACCOUNT || '').trim();

  if (!token) return res.status(500).json({ erro: 'META_ADS_TOKEN não configurado.' });
  if (!accountId) return res.status(500).json({ erro: 'META_ADS_ACCOUNT não configurado.' });

  const { dateStart, dateEnd } = req.query;

  const dataValida = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  if (dateStart && !dataValida(dateStart)) return res.status(400).json({ erro: 'dateStart inválido.' });
  if (dateEnd && !dataValida(dateEnd)) return res.status(400).json({ erro: 'dateEnd inválido.' });

  const actId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;

  const hoje = new Date();
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(hoje.getDate() - 30);
  const since = dateStart || trintaDiasAtras.toISOString().split('T')[0];
  const until = dateEnd || hoje.toISOString().split('T')[0];
  const timeRange = JSON.stringify({ since, until });

  const diasPeriodo = Math.max(1, Math.round((new Date(until) - new Date(since)) / (864e5)) + 1);

  try {
    // 0. Saldo atual da conta
    const contaRes = await fetch(
      `https://graph.facebook.com/v19.0/${actId}?fields=balance,currency&access_token=${token}`
    );
    const contaData = await contaRes.json();
    if (contaData.error) return res.status(400).json({ erro: contaData.error.message, codigo: contaData.error.code });

    const balance = parseFloat(contaData.balance || 0) / 100;

    // 1. Campanhas com status
    const campsUrl = `https://graph.facebook.com/v19.0/${actId}/campaigns?fields=id,name,status,effective_status,start_time,stop_time&limit=200&access_token=${token}`;
    const campsRes = await fetch(campsUrl);
    const campsData = await campsRes.json();
    if (campsData.error) return res.status(400).json({ erro: campsData.error.message, codigo: campsData.error.code });

    const campanhasPorId = {};
    (campsData.data || []).forEach(c => {
      campanhasPorId[c.id] = {
        id: c.id, nome: c.name,
        status: c.effective_status || c.status,
        inicio: c.start_time ? c.start_time.split('T')[0] : null,
        fim: c.stop_time ? c.stop_time.split('T')[0] : null,
      };
    });

    // 2. Insights do período — nível campanha
    const insightsFields = 'campaign_id,campaign_name,impressions,clicks,spend,reach,cpc,ctr,actions,action_values';
    let insightsUrl = `https://graph.facebook.com/v19.0/${actId}/insights?fields=${encodeURIComponent(insightsFields)}&time_range=${encodeURIComponent(timeRange)}&level=campaign&limit=100&access_token=${token}`;
    let todosInsights = [];
    let paginas = 0;
    while (insightsUrl && paginas < 10) {
      const r = await fetch(insightsUrl);
      const d = await r.json();
      if (d.error) return res.status(400).json({ erro: d.error.message, codigo: d.error.code });
      todosInsights = [...todosInsights, ...(d.data || [])];
      insightsUrl = d.paging?.next || null;
      paginas++;
    }

    // 3. Ads (criativos) — busca com timeout para não travar
    let adsPorCampanha = {};
    try {
      const adsController = new AbortController();
      const adsTimeout = setTimeout(() => adsController.abort(), 8000);
      const adsUrl = `https://graph.facebook.com/v19.0/${actId}/ads?fields=id,name,status,effective_status,campaign_id,creative{id,name,title,body,image_url,thumbnail_url,object_story_spec}&limit=500&access_token=${token}`;
      const adsRes = await fetch(adsUrl, { signal: adsController.signal });
      clearTimeout(adsTimeout);
      const adsData = await adsRes.json();
      if (!adsData.error) {
        (adsData.data || []).forEach(ad => {
          const cid = ad.campaign_id;
          if (!adsPorCampanha[cid]) adsPorCampanha[cid] = [];
          const cr = ad.creative || {};
          const imageUrl =
            cr.image_url ||
            cr.object_story_spec?.link_data?.image_url ||
            cr.object_story_spec?.video_data?.image_url ||
            cr.thumbnail_url || '';
          adsPorCampanha[cid].push({
            id: ad.id, nome: ad.name,
            status: ad.effective_status || ad.status,
            criativo: {
              titulo: cr.title || cr.object_story_spec?.link_data?.name || cr.name || '',
              corpo: cr.body || cr.object_story_spec?.link_data?.message || '',
              thumbnail: imageUrl,
            },
            investimento: 0, leads: 0, impressoes: 0, alcance: 0,
            cliques: 0, ctr: '0', cpc: '0', cpl: null, taxaConversao: null,
          });
        });
      }
    } catch (adsErr) {
      console.warn('Ads fetch timeout ou erro:', adsErr.message);
      // Continua sem criativos — não quebra o resto
    }

    // 4. Insights nível ad — com timeout
    const adInsightsFields = 'ad_id,campaign_id,impressions,clicks,spend,reach,cpc,ctr,actions';
    let adInsightsUrl = `https://graph.facebook.com/v19.0/${actId}/insights?fields=${encodeURIComponent(adInsightsFields)}&time_range=${encodeURIComponent(timeRange)}&level=ad&limit=200&access_token=${token}`;
    let todosAdInsights = [];
    let pgAd = 0;
    try {
      while (adInsightsUrl && pgAd < 10) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 8000);
        const r = await fetch(adInsightsUrl, { signal: ctrl.signal });
        clearTimeout(t);
        const d = await r.json();
        if (d.error) break;
        todosAdInsights = [...todosAdInsights, ...(d.data || [])];
        adInsightsUrl = d.paging?.next || null;
        pgAd++;
      }
    } catch (e) {
      console.warn('Ad insights timeout:', e.message);
    }

    // Mapeia insights por ad_id
    const adInsightsPorId = {};
    todosAdInsights.forEach(ai => { adInsightsPorId[ai.ad_id] = ai; });

    // Aplica métricas nos ads
    Object.values(adsPorCampanha).forEach(ads => {
      ads.forEach(ad => {
        const ai = adInsightsPorId[ad.id];
        if (!ai) return;
        const actions = ai.actions || [];
        const leadsForm = parseInt(actions.find(a => a.action_type === 'leadgen_grouped')?.value || '0');
        const leadsFallback = parseInt(actions.find(a => a.action_type === 'lead')?.value || '0');
        const totalLeads = leadsForm || leadsFallback;
        const spend = parseFloat(ai.spend || 0);
        const cliques = parseInt(ai.clicks || 0);
        ad.investimento = spend;
        ad.leads = totalLeads;
        ad.impressoes = parseInt(ai.impressions || 0);
        ad.alcance = parseInt(ai.reach || 0);
        ad.cliques = cliques;
        ad.ctr = parseFloat(ai.ctr || 0).toFixed(2);
        ad.cpc = parseFloat(ai.cpc || 0).toFixed(2);
        ad.cpl = totalLeads > 0 ? parseFloat((spend / totalLeads).toFixed(2)) : null;
        ad.taxaConversao = cliques > 0 ? parseFloat((totalLeads / cliques * 100).toFixed(2)) : null;
      });
    });

    // 5. Processa campanhas
    const idsComInsights = new Set();
    const campanhas = todosInsights.map(c => {
      const info = campanhasPorId[c.campaign_id] || {};
      idsComInsights.add(c.campaign_id);

      const actions = c.actions || [];
      const leadsFormulario = parseInt(actions.find(a => a.action_type === 'leadgen_grouped')?.value || '0');
      const leadsFallback = parseInt(actions.find(a => a.action_type === 'lead')?.value || '0');
      const totalLeads = leadsFormulario || leadsFallback;

      const spend = parseFloat(c.spend || 0);
      const cliques = parseInt(c.clicks || 0);
      const impressoes = parseInt(c.impressions || 0);
      const alcance = parseInt(c.reach || 0);
      const ctr = parseFloat(c.ctr || 0);
      const cpc = parseFloat(c.cpc || 0);
      const cpl = totalLeads > 0 ? spend / totalLeads : null;
      const taxaConversao = cliques > 0 ? (totalLeads / cliques * 100) : null;
      const mediaDiaria = spend > 0 ? spend / diasPeriodo : null;
      const cpm = impressoes > 0 ? (spend / impressoes * 1000) : null;

      const ads = adsPorCampanha[c.campaign_id] || [];
      const adsAtivos = ads.filter(a => a.status === 'ACTIVE').sort((a, b) => b.investimento - a.investimento);
      const adsPausados = ads.filter(a => a.status !== 'ACTIVE').sort((a, b) => b.investimento - a.investimento);

      return {
        id: c.campaign_id,
        nome: info.nome || c.campaign_name || c.campaign_id,
        status: info.status || 'UNKNOWN',
        investimento: spend,
        mediaDiaria: mediaDiaria ? parseFloat(mediaDiaria.toFixed(2)) : null,
        alcance, impressoes, cliques,
        ctr: ctr.toFixed(2),
        cpc: cpc.toFixed(2),
        cpm: cpm ? parseFloat(cpm.toFixed(2)) : null,
        leads: totalLeads,
        cpl: cpl ? parseFloat(cpl.toFixed(2)) : null,
        taxaConversao: taxaConversao ? parseFloat(taxaConversao.toFixed(2)) : null,
        inicio: info.inicio,
        fim: info.fim,
        ads: { ativas: adsAtivos, pausadas: adsPausados },
      };
    });

    // Campanhas sem dados no período
    Object.values(campanhasPorId).forEach(info => {
      if (!idsComInsights.has(info.id)) {
        const ads = adsPorCampanha[info.id] || [];
        campanhas.push({
          id: info.id, nome: info.nome, status: info.status,
          investimento: 0, mediaDiaria: null,
          alcance: 0, impressoes: 0, cliques: 0,
          ctr: '0', cpc: '0', cpm: null, leads: 0, cpl: null, taxaConversao: null,
          inicio: info.inicio, fim: info.fim,
          semDadosNoPeriodo: true,
          ads: {
            ativas: ads.filter(a => a.status === 'ACTIVE').sort((a, b) => b.investimento - a.investimento),
            pausadas: ads.filter(a => a.status !== 'ACTIVE').sort((a, b) => b.investimento - a.investimento),
          },
        });
      }
    });

    // 6. Separa e ordena
    const ativas = campanhas.filter(c => c.status === 'ACTIVE').sort((a, b) => b.investimento - a.investimento);
    const pausadas = campanhas.filter(c => c.status !== 'ACTIVE').sort((a, b) => b.investimento - a.investimento);

    // 7. Totais
    const comDados = campanhas.filter(c => !c.semDadosNoPeriodo);
    const totais = comDados.reduce((acc, c) => ({
      investimento: acc.investimento + c.investimento,
      alcance: acc.alcance + c.alcance,
      impressoes: acc.impressoes + c.impressoes,
      cliques: acc.cliques + c.cliques,
      leads: acc.leads + c.leads,
    }), { investimento: 0, alcance: 0, impressoes: 0, cliques: 0, leads: 0 });

    totais.cpl = totais.leads > 0 ? parseFloat((totais.investimento / totais.leads).toFixed(2)) : null;
    totais.ctr = totais.impressoes > 0 ? ((totais.cliques / totais.impressoes) * 100).toFixed(2) : '0';
    totais.cpm = totais.impressoes > 0 ? parseFloat((totais.investimento / totais.impressoes * 1000).toFixed(2)) : null;
    totais.taxaConversao = totais.cliques > 0 ? parseFloat((totais.leads / totais.cliques * 100).toFixed(2)) : null;
    totais.mediaDiaria = totais.investimento > 0 ? parseFloat((totais.investimento / diasPeriodo).toFixed(2)) : null;

    // 8. Saldo
    const spendPeriodo = parseFloat(totais.investimento.toFixed(2));
    const saldoInicial = parseFloat((balance + spendPeriodo).toFixed(2));
    const saldoFinal = parseFloat(balance.toFixed(2));

    return res.status(200).json({
      ativas,
      pausadas,
      totais,
      periodo: { since, until, diasPeriodo },
      conta: {
        saldoInicial,
        saldoFinal,
        investidoPeriodo: spendPeriodo,
        currency: contaData.currency || 'BRL',
      },
    });

  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao conectar com a API do Meta: ' + e.message });
  }
}
