import { aplicarCORS, exigirSessao } from './_lib/auth.js';

export default async function handler(req, res) {
  aplicarCORS(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const usuario = exigirSessao(req, res);
  if (!usuario) return;

  const { cnpj } = req.query;
  if (typeof cnpj !== 'string') return res.status(400).json({ erro: 'CNPJ inválido' });

  const raw = cnpj.replace(/\D/g, '');
  if (raw.length !== 14) return res.status(400).json({ erro: 'CNPJ inválido' });

  // Tenta ReceitaWS primeiro
  try {
    const r = await fetch(`https://www.receitaws.com.br/v1/cnpj/${raw}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    });
    if (r.ok) {
      const data = await r.json();
      if (data.status !== 'ERROR') {
        // ReceitaWS pode retornar simples em data.simples.optante_simples_nacional
        // ou simplesmente não retornar o campo — verificamos ambos
        const simplesOptante = data.simples?.optante_simples_nacional === 'Sim'
          || data.simples?.optante === true
          || data.simples === 'Sim';

        return res.status(200).json({
          razao_social: data.nome,
          nome_fantasia: data.fantasia,
          cnpj: raw,
          descricao_situacao_cadastral: data.situacao,
          natureza_juridica: data.natureza_juridica,
          porte: data.porte,
          capital_social: parseFloat((data.capital_social || '0').replace(/\./g, '').replace(',', '.')),
          municipio: data.municipio,
          uf: data.uf,
          data_inicio_atividade: data.abertura,
          cnae_fiscal: data.atividade_principal?.[0]?.code?.replace(/\D/g, ''),
          cnae_fiscal_descricao: data.atividade_principal?.[0]?.text,
          cnaes_secundarios: (data.atividades_secundarias || []).map(a => ({
            codigo: a.code?.replace(/\D/g, ''),
            descricao: a.text,
          })),
          opcao_pelo_simples: simplesOptante,
          opcao_pelo_mei: data.porte === 'MEI' || data.simei?.optante === true,
          // Campo debug para identificar origem dos dados
          _fonte: 'receitaws',
          _simples_raw: data.simples,
        });
      }
    }
  } catch (_) { /* fallback abaixo */ }

  // Fallback: CNPJ.ws
  try {
    const r2 = await fetch(`https://publica.cnpj.ws/cnpj/${raw}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    });
    if (r2.ok) {
      const data = await r2.json();
      const atividadePrincipal = data.estabelecimento?.atividade_principal;
      const atividadesSecundarias = data.estabelecimento?.atividades_secundarias || [];
      return res.status(200).json({
        razao_social: data.razao_social,
        nome_fantasia: data.estabelecimento?.nome_fantasia,
        cnpj: raw,
        descricao_situacao_cadastral: data.estabelecimento?.situacao_cadastral,
        natureza_juridica: data.natureza_juridica?.descricao,
        porte: data.porte?.descricao,
        capital_social: data.capital_social,
        municipio: data.estabelecimento?.cidade?.nome,
        uf: data.estabelecimento?.estado?.sigla,
        data_inicio_atividade: data.estabelecimento?.data_inicio_atividade,
        cnae_fiscal: atividadePrincipal?.id,
        cnae_fiscal_descricao: atividadePrincipal?.descricao,
        cnaes_secundarios: atividadesSecundarias.map(a => ({
          codigo: a.id,
          descricao: a.descricao,
        })),
        opcao_pelo_simples: data.simples?.optante === true,
        opcao_pelo_mei: data.simei?.optante === true,
        _fonte: 'cnpjws',
        _simples_raw: data.simples,
      });
    }
  } catch (_) { /* falha geral abaixo */ }

  return res.status(404).json({ erro: 'CNPJ não encontrado. Tente novamente em instantes.' });
}
