<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Outtax — Dashboard</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
:root{
  --azul-escuro:#152c6b;
  --azul-medio:#285199;
  --laranja:#FF8E2A;
  --laranja-claro:#FFF0E0;
  --azul-claro:#E8EEF8;
  --azul-pale:#f0f4fb;
  --branco:#ffffff;
  --bg:#f0f4fb;
  --border:#d6e0f0;
  --text:#152c6b;
  --text-muted:#5a6e99;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;}
.login-screen{position:fixed;inset:0;background:linear-gradient(135deg,var(--azul-escuro) 0%,var(--azul-medio) 100%);display:flex;align-items:center;justify-content:center;z-index:9999;}
.login-screen.hidden{display:none;}
.login-box{background:#fff;border-radius:16px;padding:36px 32px;width:100%;max-width:380px;margin:16px;box-shadow:0 20px 60px rgba(21,44,107,.3);}
.login-logo{text-align:center;margin-bottom:24px;}
.login-logo img{width:160px;height:auto;}
.login-title{font-size:16px;font-weight:700;color:var(--azul-escuro);margin-bottom:6px;text-align:center;}
.login-sub{font-size:12px;color:var(--text-muted);text-align:center;margin-bottom:24px;}
.login-field{margin-bottom:14px;}
.login-field label{display:block;font-size:11px;color:var(--text-muted);margin-bottom:5px;font-weight:600;}
.login-field input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--text);background:#fff;}
.login-field input:focus{outline:none;border-color:var(--azul-medio);}
.login-btn{width:100%;padding:11px;background:var(--azul-escuro);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;margin-top:6px;}
.login-btn:hover{background:var(--azul-medio);}
.login-err{display:none;font-size:12px;color:#791F1F;background:#FCEBEB;border-radius:8px;padding:8px 12px;margin-top:12px;text-align:center;}
.login-err.show{display:block;}
.sidebar{width:220px;min-height:100vh;background:linear-gradient(180deg,var(--azul-escuro) 0%,var(--azul-medio) 100%);display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100;box-shadow:3px 0 16px rgba(21,44,107,.25);transition:transform .3s}
.sidebar-logo{padding:20px 16px 16px;border-bottom:1px solid rgba(255,255,255,.12);text-align:center}
.sidebar-logo img{width:160px;max-width:100%;height:auto;object-fit:contain;display:block;margin:0 auto}
.sidebar-date{padding:8px 16px;font-size:11px;color:rgba(255,255,255,.6);border-bottom:1px solid rgba(255,255,255,.08);text-align:center}
.sidebar-nav{flex:1;padding:12px 0;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:12px 20px;font-size:13px;font-weight:500;color:rgba(255,255,255,.65);cursor:pointer;transition:all .2s;border-left:3px solid transparent}
.nav-item:hover{color:#fff;background:rgba(255,255,255,.08);border-left-color:rgba(255,255,255,.3)}
.nav-item.active{color:#fff;background:rgba(255,255,255,.12);border-left-color:var(--laranja)}
.nav-item .nav-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.nav-item .nav-label{flex:1}
.sidebar-footer{padding:16px;border-top:1px solid rgba(255,255,255,.12)}
.btn-cfg{display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:8px;color:#fff;font-size:12px;font-weight:500;cursor:pointer;width:100%;transition:all .2s}
.btn-cfg:hover{background:rgba(255,255,255,.18)}
.main-content{margin-left:220px;flex:1;min-height:100vh;display:flex;flex-direction:column}
.banner{background:#FFF0E0;border-bottom:2px solid var(--laranja);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--azul-escuro)}
.banner.hidden{display:none}
.page{display:none;padding:24px 16px;max-width:960px;margin:0 auto;width:100%}
.page.active{display:block}
.mobile-topbar{display:none;background:linear-gradient(135deg,var(--azul-escuro),var(--azul-medio));padding:0 16px;height:52px;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 2px 8px rgba(21,44,107,.3)}
.mobile-topbar img{height:30px;width:auto}
.mobile-menu-btn{background:none;border:none;color:#fff;font-size:24px;cursor:pointer;line-height:1}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99}
@media(max-width:768px){
  body{display:block}
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .sidebar-overlay.open{display:block}
  .main-content{margin-left:0}
  .mobile-topbar{display:flex}
  .two-col,.three-col{grid-template-columns:1fr}
  .stats{grid-template-columns:repeat(2,1fr)}
  .filtros{flex-direction:column;align-items:stretch}
  .fa{margin-left:0}
}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.stat{background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:14px 16px;border-top:3px solid var(--azul-medio)}
.stat .num{font-size:24px;font-weight:700;margin-bottom:2px;color:var(--azul-escuro)}
.stat .lbl{font-size:11px;color:var(--text-muted)}
.stat-clickable{cursor:pointer;transition:all .18s;position:relative;}
.stat-clickable:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(21,44,107,.13);border-color:var(--azul-medio);}
.stat-clickable::after{content:'▼';position:absolute;bottom:8px;right:10px;font-size:9px;color:var(--text-muted);opacity:.6;}
.stat-clickable:hover::after{opacity:1;}
.filtros{background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:16px;display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}
.fg{display:flex;flex-direction:column;gap:4px}
.fg label{font-size:11px;color:var(--text-muted);font-weight:500}
.fg input[type="date"],.fg select{padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;background:var(--branco);color:var(--text);cursor:pointer;min-width:140px}
.fg input[type="date"]:focus,.fg select:focus{outline:none;border-color:var(--azul-medio)}
.fa{display:flex;gap:8px;align-items:flex-end;margin-left:auto}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.cards{display:flex;flex-direction:column;gap:10px}
.card{background:var(--branco);border:1px solid var(--border);border-radius:12px;overflow:hidden}
.card.marketing{border-left:4px solid var(--azul-medio)}
.card.direto{border-left:4px solid var(--laranja)}
.card.urgente{border-left:4px solid #E24B4A}
.card.atencao{border-left:4px solid var(--laranja)}
.card.ok{border-left:4px solid #1D9E75}
.card.atendimento{border-left:4px solid var(--azul-escuro)}
.card.sem-contato{border-left:4px solid #9e9e9e}
.card.follow-up{border-left:4px solid var(--border);background:#fafbfd}
.card.reuniao{border-left:4px solid var(--laranja)}
.card.proposta{border-left:4px solid var(--azul-medio)}
.card.oportunidade{border-left:4px solid var(--azul-escuro)}
.card-head{display:flex;align-items:center;gap:10px;padding:13px 16px;cursor:pointer;user-select:none}
.card-head:hover{background:var(--azul-pale)}
.av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.av-marketing{background:var(--azul-claro);color:var(--azul-escuro)}
.av-direto{background:var(--laranja-claro);color:#a85000}
.av-urgente{background:#FCEBEB;color:#791F1F}
.av-atencao{background:var(--laranja-claro);color:#a85000}
.av-ok{background:#EAF3DE;color:#27500A}
.av-atendimento{background:var(--azul-claro);color:var(--azul-escuro)}
.av-sem-contato{background:#f0f0f0;color:#6b6b6b}
.av-follow-up{background:var(--azul-pale);color:var(--text-muted)}
.av-reuniao{background:var(--laranja-claro);color:#a85000}
.av-proposta{background:var(--azul-claro);color:var(--azul-medio)}
.av-oportunidade{background:var(--azul-claro);color:var(--azul-escuro)}
.card-info{flex:1;min-width:0}
.card-name{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--azul-escuro)}
.card-sub{font-size:11px;color:var(--text-muted);margin-top:1px}
.badge{display:inline-block;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:600;margin-left:4px}
.badge-green{background:#EAF3DE;color:#27500A}
.badge-red{background:#FCEBEB;color:#791F1F}
.badge-amber{background:var(--laranja-claro);color:#a85000}
.dias-pill{font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0}
.dp-urgente{background:#FCEBEB;color:#791F1F}
.dp-atencao{background:var(--laranja-claro);color:#a85000}
.dp-ok{background:#EAF3DE;color:#27500A}
.chev{font-size:10px;color:var(--text-muted);transition:transform .2s;flex-shrink:0}
.card-body{display:none;border-top:1px solid var(--border)}
.card-body.open{display:block}
.cbi{padding:16px}
.orig-bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--azul-pale);border-radius:8px;margin-bottom:14px;font-size:12px}
.orig-dot{width:7px;height:7px;border-radius:50%}
.orig-dot.marketing{background:var(--azul-medio)}
.orig-dot.direto{background:var(--laranja)}
.tabs{display:flex;border-bottom:2px solid var(--border);margin-bottom:14px}
.tab{padding:8px 14px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px}
.tab.active{color:var(--azul-escuro);border-bottom-color:var(--azul-medio)}
.tp{display:none}
.tp.active{display:block}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px}
.ib{background:var(--azul-pale);border-radius:8px;padding:9px 11px}
.ib .l{font-size:10px;color:var(--text-muted);margin-bottom:3px;font-weight:500}
.ib .v{font-size:12px;font-weight:600;word-break:break-word;color:var(--azul-escuro)}
.ir{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px;gap:8px}
.ir:last-child{border-bottom:none}
.ir .k{color:var(--text-muted);flex-shrink:0}
.ir .v{font-weight:600;text-align:right;font-size:11px;color:var(--azul-escuro)}
.cnae-row{font-size:11px;padding:4px 0;border-bottom:1px solid var(--border)}
.cnae-row:last-child{border-bottom:none}
.cnae-code{font-family:monospace;font-size:10px;color:var(--text-muted);margin-right:6px}
.nb{background:var(--azul-pale);border-radius:8px;padding:10px 12px;font-size:12px;line-height:1.65}
.divl{height:1px;background:var(--border);margin:14px 0}
.act-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.btn{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;font-size:12px;font-weight:500;border-radius:8px;cursor:pointer;border:1px solid var(--border);background:var(--branco);color:var(--azul-escuro);text-decoration:none;transition:all .15s}
.btn:hover{background:var(--azul-pale);border-color:var(--azul-medio)}
.btn-p{background:var(--azul-escuro);color:#fff;border-color:var(--azul-escuro)}
.btn-p:hover{background:var(--azul-medio);border-color:var(--azul-medio)}
.btn-s{background:var(--laranja);color:#fff;border:none}
.btn-s:hover{opacity:.88}
.btn-sm{padding:5px 12px;font-size:11px;font-weight:500;border-radius:6px;border:1px solid var(--laranja);background:transparent;color:var(--laranja);cursor:pointer}
.cnpj-row{display:flex;gap:6px;margin-bottom:10px}
.cnpj-row input{flex:1;padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;background:var(--branco);color:var(--text)}
.loading{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);padding:10px 0}
.dot{width:5px;height:5px;border-radius:50%;background:var(--azul-medio);animation:pulse 1.2s infinite}
.dot:nth-child(2){animation-delay:.2s}
.dot:nth-child(3){animation-delay:.4s}
@keyframes pulse{0%,80%,100%{opacity:.3}40%{opacity:1}}
.empty{text-align:center;padding:3rem 1rem;color:var(--text-muted);font-size:13px}
.prazo-bar{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;margin-bottom:14px;font-size:12px}
.prazo-bar.urgente{background:#FCEBEB}
.prazo-bar.atencao{background:var(--laranja-claro)}
.prazo-bar.ok{background:#EAF3DE}
.prazo-num{font-size:24px;font-weight:700;line-height:1;color:var(--azul-escuro)}
.prazo-lbl{font-size:11px;color:var(--text-muted);margin-top:2px}
.funil-tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:20px;background:var(--azul-claro);color:var(--azul-escuro);font-weight:600;margin-left:6px;vertical-align:middle}
.tarefa-card{background:var(--branco);border:1px solid var(--border);border-radius:10px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px}
.tarefa-card.atrasada{border-left:4px solid #E24B4A}
.tarefa-card.hoje{border-left:4px solid var(--laranja)}
.tarefa-card.futura{border-left:4px solid var(--azul-medio)}
.tarefa-check{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;margin-top:1px}
.tarefa-info{flex:1;min-width:0}
.tarefa-lead{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--azul-escuro)}
.tarefa-assunto{font-size:11px;color:var(--text-muted);margin-top:2px}
.tarefa-data{font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0}
.tarefa-data.atrasada{color:#791F1F}
.tarefa-data.hoje{color:#a85000}
.tarefa-data.futura{color:var(--azul-medio)}
.modal-ov{display:none;position:fixed;inset:0;background:rgba(21,44,107,.45);z-index:200;align-items:center;justify-content:center}
.modal-ov.open{display:flex}
.modal{background:var(--branco);border-radius:16px;padding:28px;width:100%;max-width:460px;margin:16px;box-shadow:0 20px 60px rgba(21,44,107,.2)}
.modal h3{font-size:16px;font-weight:700;margin-bottom:6px;color:var(--azul-escuro)}
.modal p{font-size:12px;color:var(--text-muted);margin-bottom:20px;line-height:1.6}
.modal-ft{display:flex;gap:8px;justify-content:flex-end;margin-top:20px}
.btn-cancel{padding:8px 16px;font-size:13px;border-radius:8px;border:1px solid var(--border);background:var(--branco);cursor:pointer;color:var(--text-muted)}
.modal-ai{position:fixed;inset:0;background:rgba(21,44,107,.55);z-index:9999;display:flex;align-items:center;justify-content:center;}
.modal-ai-box{background:var(--branco);border-radius:16px;padding:24px;width:620px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(21,44,107,.3);}
.modal-ai-titulo{font-size:15px;font-weight:700;color:var(--azul-escuro);margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;}
.llm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
.llm-btn{border:2px solid var(--border);border-radius:10px;padding:12px 8px;text-align:center;cursor:pointer;font-size:12px;font-weight:600;transition:all .2s;background:var(--branco);color:var(--text-muted);}
.llm-btn:hover{border-color:var(--azul-medio);background:var(--azul-pale);}
.llm-btn.ativo{border-color:var(--azul-medio);background:var(--azul-claro);color:var(--azul-escuro);}
.prompt-box{background:var(--azul-pale);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:11px;font-family:monospace;line-height:1.5;max-height:200px;overflow-y:auto;margin-bottom:12px;white-space:pre-wrap;color:var(--text);}
.btn-ai-acao{width:100%;padding:11px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px;transition:all .2s;}
.btn-copiar{background:var(--azul-escuro);color:#fff;}
.btn-abrir{background:var(--azul-medio);color:#fff;}
.btn-importar{background:var(--laranja);color:#fff;}
.importar-area{border:2px dashed var(--border);border-radius:8px;padding:20px;text-align:center;font-size:12px;color:var(--text-muted);margin-bottom:12px;cursor:pointer;transition:all .2s;}
.copiado-badge{display:inline-block;background:var(--laranja);color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;margin-left:8px;opacity:0;transition:opacity .3s;}
.tela-importacao{display:none;position:fixed;inset:0;background:var(--branco);z-index:9998;flex-direction:column;}
.tela-importacao.aberta{display:flex;}
.tela-imp-header{background:linear-gradient(135deg,var(--azul-escuro) 0%,var(--azul-medio) 100%);color:#fff;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:14px;}
.tela-imp-body{flex:1;overflow-y:auto;padding:24px;max-width:900px;margin:0 auto;width:100%;}
.tela-imp-label{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;}
.tela-imp-secao{background:var(--azul-pale);border-radius:8px;padding:14px;font-size:12px;line-height:1.8;}
.tela-imp-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:10px;background:var(--branco);}
.fb-saldo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
.fb-saldo-card{background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:14px 16px;position:relative;overflow:hidden;}
.fb-saldo-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
.fb-saldo-card.inicial::before{background:#285199;}
.fb-saldo-card.investido::before{background:var(--laranja);}
.fb-saldo-card.final-pos::before{background:#1D9E75;}
.fb-saldo-card.final-neg::before{background:#E24B4A;}
.fb-saldo-lbl{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;font-weight:600;}
.fb-saldo-val{font-size:22px;font-weight:700;color:var(--azul-escuro);}
.fb-saldo-val.verde{color:#1D9E75;}
.fb-saldo-val.vermelho{color:#E24B4A;}
.fb-saldo-sub{font-size:10px;color:var(--text-muted);margin-top:4px;}
.fb-saldo-fonte{font-size:10px;color:#1D9E75;margin-top:2px;display:flex;align-items:center;gap:3px;}
.fb-progress-wrap{background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:16px;}
.fb-progress-header{display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:8px;}
.fb-progress-track{height:8px;background:var(--azul-pale);border-radius:99px;overflow:hidden;}
.fb-progress-fill{height:100%;border-radius:99px;transition:width .6s ease;}
/* ── ACCORDION SEÇÕES ── */
.sec-accordion{border:1px solid var(--border);border-radius:12px;margin-bottom:10px;overflow:hidden;background:var(--branco);}
.sec-accordion-hdr{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;cursor:pointer;user-select:none;background:var(--branco);transition:background .15s;}
.sec-accordion-hdr:hover{background:var(--azul-pale);}
.sec-accordion-hdr.open{background:var(--azul-pale);border-bottom:1px solid var(--border);}
.sec-accordion-title{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:700;color:var(--azul-escuro);}
.sec-accordion-title span.sec-icon{font-size:16px;}
.sec-accordion-meta{font-size:11px;color:var(--text-muted);font-weight:400;margin-left:4px;}
.sec-accordion-chev{font-size:11px;color:var(--text-muted);transition:transform .22s;}
.sec-accordion-body{display:none;padding:16px 18px;}
.sec-accordion-body.open{display:block;}
@media(max-width:600px){.two-col,.three-col{grid-template-columns:1fr}.stats{grid-template-columns:repeat(3,1fr)}.filtros{flex-direction:column;align-items:stretch}.fa{margin-left:0}.fb-saldo-grid{grid-template-columns:1fr}}
.modal-rd-ov{display:none;position:fixed;inset:0;background:rgba(21,44,107,.55);z-index:3000;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto;}
.modal-rd-ov.open{display:flex;}
.modal-rd-box{background:var(--branco);border-radius:16px;width:100%;max-width:560px;box-shadow:0 24px 64px rgba(21,44,107,.28);overflow:hidden;}
.modal-rd-header{padding:18px 24px;background:linear-gradient(135deg,var(--azul-escuro),var(--azul-medio));color:#fff;display:flex;justify-content:space-between;align-items:center;}
.modal-rd-header h3{font-size:14px;font-weight:700;margin:0;}
.modal-rd-header p{font-size:11px;opacity:.75;margin:3px 0 0;}
.modal-rd-close{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1;}
.modal-rd-body{padding:20px 24px;}
.modal-rd-section{margin-bottom:16px;}
.modal-rd-section-title{font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px;}
.modal-rd-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--azul-pale);}
.modal-rd-row:last-child{border-bottom:none;}
.modal-rd-label{font-size:11px;color:var(--text-muted);width:120px;flex-shrink:0;}
.modal-rd-value{font-size:12px;font-weight:600;color:var(--azul-escuro);flex:1;word-break:break-all;}
.modal-rd-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:#fafbfd;}
.modal-rd-status{font-size:11px;color:var(--text-muted);}
.modal-rd-status.ok{color:#1D9E75;font-weight:600;}
.modal-rd-status.erro{color:#E24B4A;font-weight:600;}
.modal-leads-ov{display:none;position:fixed;inset:0;background:rgba(21,44,107,.55);z-index:3000;align-items:flex-start;justify-content:center;padding:32px 16px;overflow-y:auto;}
.modal-leads-ov.open{display:flex;}
.modal-leads-box{background:var(--branco);border-radius:16px;width:100%;max-width:680px;box-shadow:0 24px 64px rgba(21,44,107,.28);display:flex;flex-direction:column;max-height:85vh;}
.modal-leads-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.modal-leads-title{font-size:15px;font-weight:700;color:var(--azul-escuro);}
.modal-leads-subtitle{font-size:11px;color:var(--text-muted);margin-top:2px;}
.modal-leads-close{background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-muted);line-height:1;padding:0 4px;}
.modal-leads-close:hover{color:var(--azul-escuro);}
.modal-leads-summary{padding:12px 24px;background:var(--azul-pale);border-bottom:1px solid var(--border);display:flex;gap:16px;flex-shrink:0;flex-wrap:wrap;}
.modal-leads-summary-item{font-size:11px;color:var(--text-muted);}
.modal-leads-summary-item strong{color:var(--azul-escuro);font-size:13px;display:block;}
.modal-leads-body{overflow-y:auto;padding:16px 24px;flex:1;}
.lead-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px;background:var(--branco);transition:all .15s;}
.lead-row:hover{background:var(--azul-pale);border-color:var(--azul-medio);}
.lead-row-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.lead-row-info{flex:1;min-width:0;}
.lead-row-name{font-size:13px;font-weight:600;color:var(--azul-escuro);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lead-row-meta{font-size:11px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lead-row-val{font-size:13px;font-weight:700;white-space:nowrap;flex-shrink:0;}
.lead-row-actions{display:flex;gap:6px;flex-shrink:0;}
.lead-row-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;font-size:11px;font-weight:600;border-radius:7px;cursor:pointer;text-decoration:none;transition:all .15s;border:1px solid var(--azul-medio);color:var(--azul-medio);background:transparent;}
.lead-row-btn:hover{background:var(--azul-medio);color:#fff;}
.modal-leads-empty{text-align:center;padding:40px 20px;color:var(--text-muted);font-size:13px;}
.modal-leads-footer{padding:14px 24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;background:#fafbfd;}
.modal-leads-total{font-size:12px;color:var(--text-muted);}
.modal-leads-total strong{color:var(--azul-escuro);}
.tipo-badge-vendido{background:#EAF3DE;color:#1D9E75;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:700;}
.tipo-badge-perdido{background:#FCEBEB;color:#E24B4A;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:700;}
.tipo-badge-aberto{background:#FFF0E0;color:#FF8E2A;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:700;}
</style>
</head>
<body>

<div id="login-screen" class="login-screen">
  <div class="login-box">
    <div class="login-logo"><img src="/logo-outtax.png" alt="Outtax"></div>
    <div class="login-title">Acesso ao Dashboard</div>
    <div class="login-sub">Digite suas credenciais para continuar</div>
    <div class="login-field">
      <label>Usuário</label>
      <input type="text" id="login-usuario" placeholder="usuário" autocomplete="username">
    </div>
    <div class="login-field">
      <label>Senha</label>
      <input type="password" id="login-senha" placeholder="••••••••" autocomplete="current-password">
    </div>
    <button class="login-btn" onclick="fazerLogin()">Entrar</button>
    <div id="login-err" class="login-err">Usuário ou senha incorretos.</div>
  </div>
</div>

<div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
<div class="mobile-topbar">
  <button class="mobile-menu-btn" onclick="toggleSidebar()">☰</button>
  <img src="/logo-outtax.png" alt="Outtax">
  <div style="width:32px"></div>
</div>

<div class="sidebar" id="sidebar">
  <div class="sidebar-logo"><img src="/logo-outtax.png" alt="Outtax"></div>
  <div class="sidebar-date" id="td"></div>
  <div id="sidebar-user" style="padding:6px 16px 10px;font-size:11px;color:rgba(255,255,255,.85);text-align:center;border-bottom:1px solid rgba(255,255,255,.08);display:none;">
    <span style="background:rgba(255,255,255,.12);padding:4px 12px;border-radius:20px;font-weight:500;">👤 <span id="sidebar-user-nome"></span></span>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-item active" id="nav-reunioes" onclick="showPage('reunioes',this)">
      <span class="nav-icon">📅</span><span class="nav-label">Reuniões</span>
    </div>
    <div class="nav-item" id="nav-propostas" onclick="showPage('propostas',this)">
      <span class="nav-icon">📋</span><span class="nav-label">Propostas</span>
    </div>
    <div class="nav-item" id="nav-tarefas" onclick="showPage('tarefas',this)">
      <span class="nav-icon">✅</span><span class="nav-label">Tarefas</span>
    </div>
    <div class="nav-item" id="nav-fbmkt" onclick="showPage('fbmkt',this)">
      <span class="nav-icon">📊</span><span class="nav-label">Facebook Ads & Marketing</span>
    </div>
    <div class="nav-item" id="nav-cnpj" onclick="showPage('cnpj',this)">
      <span class="nav-icon">🏢</span><span class="nav-label">Consulta CNPJ</span>
    </div>
    <div class="nav-item" id="nav-transcricoes" onclick="showPage('transcricoes',this)">
      <span class="nav-icon">🎙️</span><span class="nav-label">Transcrições</span>
    </div>
    <div class="nav-item" id="nav-plugin" onclick="showPage('plugin',this)">
      <span class="nav-icon">🧩</span><span class="nav-label">Plugin Reuniões</span>
    </div>
  </nav>
  <div class="sidebar-footer">
    <button class="btn-cfg" onclick="abrirCfg()">⚙ Configurações</button>
    <button id="btn-admin-usuarios" class="btn-cfg" style="margin-top:8px;display:none;" onclick="abrirGerenciarUsuarios()">👥 Usuários</button>
    <button class="btn-cfg" style="margin-top:8px;background:rgba(255,100,100,.15);border-color:rgba(255,100,100,.3)" onclick="fazerLogout()">🚪 Sair</button>
  </div>
</div>

<div class="main-content">
  <div class="banner hidden" id="banner">
    ⚠ Conecte o Google Agenda para carregar suas reuniões.
    <button class="btn-sm" onclick="abrirCfg()">Conectar agora</button>
  </div>

  <!-- REUNIÕES -->
  <div class="page active" id="page-reunioes">
    <div class="sec-hdr" style="margin-bottom:16px">
      <div><div style="font-size:18px;font-weight:700;color:var(--azul-escuro)">📅 Reuniões</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Agenda Google integrada</div></div>
    </div>
    <div class="filtros">
      <div class="fg"><label>De</label><input type="date" id="r-de"></div>
      <div class="fg"><label>Até</label><input type="date" id="r-ate"></div>
      <div class="fa">
        <button class="btn btn-p" onclick="carregarReunioes()">🔍 Buscar</button>
        <button class="btn" onclick="limparFiltrosReunioes()">✕ Limpar</button>
      </div>
    </div>
    <div id="cards-r"><div class="empty">Selecione o período e clique em Buscar.</div></div>
  </div>

  <!-- PROPOSTAS -->
  <div class="page" id="page-propostas">
    <div class="sec-hdr" style="margin-bottom:16px">
      <div><div style="font-size:18px;font-weight:700;color:var(--azul-escuro)">📋 Propostas</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Negociações do RD CRM</div></div>
    </div>
    <div class="filtros">
      <div class="fg"><label>Funil</label><select id="f-funil"><option value="all">Carregando funis...</option></select></div>
      <div class="fg"><label>Status</label>
        <select id="f-st">
          <option value="aberta">Em andamento</option>
          <option value="ganha">Ganhas</option>
          <option value="perdida">Perdidas</option>
          <option value="all">Todas</option>
        </select>
      </div>
      <div class="fg"><label>Estágio</label><select id="f-estagio"><option value="all">Todos os estágios</option></select></div>
      <div class="fg"><label>Responsável</label><select id="f-resp"><option value="all">Todos</option></select></div>
      <div class="fg"><label>Tipo de data</label>
        <select id="f-tipo-data">
          <option value="criacao">Criação</option>
          <option value="atualizacao">Atualização</option>
          <option value="ambos">Ambos</option>
        </select>
      </div>
      <div class="fg"><label>De</label><input type="date" id="f-ini"></div>
      <div class="fg"><label>Até</label><input type="date" id="f-fim"></div>
      <div class="fa">
        <button class="btn btn-p" onclick="carregarPropostas()">🔍 Buscar</button>
        <button class="btn" onclick="limparFiltros()">✕ Limpar</button>
      </div>
    </div>
    <div style="margin-bottom:12px">
      <span style="font-size:13px;font-weight:600;color:var(--azul-escuro)" id="prop-titulo">Propostas</span>
      <span style="font-size:11px;color:var(--text-muted);margin-left:8px" id="label-funil"></span>
    </div>
    <div class="stats" style="margin-bottom:12px">
      <div class="stat"><div class="num" id="sp-t">0</div><div class="lbl">Total</div></div>
      <div class="stat" style="border-top-color:#E24B4A"><div class="num" id="sp-u" style="color:#E24B4A">0</div><div class="lbl">Urgentes +7d</div></div>
      <div class="stat" style="border-top-color:var(--laranja)"><div class="num" id="sp-a" style="color:var(--laranja)">0</div><div class="lbl">Atenção 3-7d</div></div>
    </div>
    <div id="bloco-estagios" style="display:none;background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">
        Distribuição por estágio <span style="font-size:10px;font-weight:400">(clique para filtrar)</span>
        <span style="font-size:11px;font-weight:700;color:var(--azul-escuro);float:right" id="bp"></span>
      </div>
      <div id="barras-estagios"></div>
    </div>
    <div id="cards-p"><div class="empty">Selecione os filtros e clique em Buscar.</div></div>
  </div>

  <!-- TAREFAS -->
  <div class="page" id="page-tarefas">
    <div class="sec-hdr" style="margin-bottom:16px">
      <div><div style="font-size:18px;font-weight:700;color:var(--azul-escuro)">✅ Tarefas</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Tarefas do RD CRM</div></div>
    </div>
    <div class="filtros">
      <div class="fg"><label>De</label><input type="date" id="ft-de"></div>
      <div class="fg"><label>Até</label><input type="date" id="ft-ate"></div>
      <div class="fg"><label>Tipo</label>
        <select id="ft-tipo">
          <option value="all">Todos</option>
          <option value="reuniao">Reunião</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="proposta">Proposta</option>
          <option value="reagendamento">Reagendamento</option>
          <option value="tentativa">Tentativa</option>
        </select>
      </div>
      <div class="fg"><label>Status</label>
        <select id="ft-status">
          <option value="open">Abertas</option>
          <option value="done">Concluídas</option>
          <option value="all">Todas</option>
        </select>
      </div>
      <div class="fa">
        <button class="btn btn-p" onclick="carregarTarefas()">🔍 Buscar</button>
        <button class="btn" onclick="limparFiltrosTarefas()">✕ Limpar</button>
      </div>
    </div>
    <div class="stats" style="margin-bottom:12px">
      <div class="stat" style="border-top-color:#E24B4A"><div class="num" id="st-at" style="color:#E24B4A">0</div><div class="lbl">Atrasadas</div></div>
      <div class="stat" style="border-top-color:var(--laranja)"><div class="num" id="st-hj" style="color:var(--laranja)">0</div><div class="lbl">Para hoje</div></div>
      <div class="stat"><div class="num" id="st-fu">0</div><div class="lbl">Futuras</div></div>
    </div>
    <div id="cards-t"><div class="empty">Selecione os filtros e clique em Buscar.</div></div>
  </div>

  <!-- ══════════════════════════════════════════════════════
       FACEBOOK ADS & MARKETING (ABA UNIFICADA)
       ══════════════════════════════════════════════════════ -->
  <div class="page" id="page-fbmkt">
    <div class="sec-hdr" style="margin-bottom:16px">
      <div>
        <div style="font-size:18px;font-weight:700;color:var(--azul-escuro)">📊 Facebook Ads & Marketing</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Campanhas · Métricas · Análise RD CRM</div>
      </div>
    </div>

    <!-- FILTROS UNIFICADOS -->
    <div class="filtros">
      <div class="fg"><label>Período rápido</label>
        <select id="fb-periodo" onchange="aplicarPeriodoFB(this.value)">
          <option value="7">Últimos 7 dias</option>
          <option value="15">Últimos 15 dias</option>
          <option value="30" selected>Últimos 30 dias</option>
          <option value="60">Últimos 60 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>
      <div class="fg" style="display:flex;gap:8px;">
        <div class="fg"><label>De</label><input type="date" id="fb-de"></div>
        <div class="fg"><label>Até</label><input type="date" id="fb-ate"></div>
      </div>
      <div class="fg"><label>Status campanha</label>
        <select id="fb-filtro-status">
          <option value="todas">Todas</option>
          <option value="ativas">Só ativas</option>
          <option value="pausadas">Só pausadas</option>
        </select>
      </div>
      <div class="fg"><label>Campanha (análise)</label>
        <select id="mk-campanha"><option value="all">Todas as campanhas</option></select>
      </div>
      <div class="fa">
        <button class="btn btn-p" onclick="carregarFBMkt()">🔍 Buscar</button>
        <button class="btn" onclick="limparFiltrosFBMkt()">✕ Limpar</button>
        <button class="btn" onclick="exportarPDFFacebook()">📄 PDF</button>
        <button class="btn" onclick="exportarTXTFacebook()">📝 TXT</button>
        <button class="btn" onclick="exportarXLSFacebook()">📊 XLS</button>
      </div>
    </div>

    <div id="fb-aviso-config" style="display:none;background:#FFF0E0;border:1px solid var(--laranja);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:12px;color:#a85000;"></div>

    <!-- ── ACCORDION 1: SALDO DA CONTA ── -->
    <div class="sec-accordion" id="acc-saldo">
      <div class="sec-accordion-hdr" onclick="toggleAcc('acc-saldo')">
        <div class="sec-accordion-title"><span class="sec-icon">💰</span> Saldo da conta Facebook Ads <span class="sec-accordion-meta" id="acc-saldo-meta"></span></div>
        <span class="sec-accordion-chev">▼</span>
      </div>
      <div class="sec-accordion-body">
        <div id="fb-saldo-wrap">
          <div class="fb-saldo-grid">
            <div class="fb-saldo-card inicial"><div class="fb-saldo-lbl">Saldo inicial do período</div><div class="fb-saldo-val" id="fb-saldo-inicial">—</div><div class="fb-saldo-fonte">● balance + amount_spent via API</div></div>
            <div class="fb-saldo-card investido"><div class="fb-saldo-lbl">Total investido no período</div><div class="fb-saldo-val" id="fb-saldo-investido">—</div><div class="fb-saldo-sub">soma de todas as campanhas</div></div>
            <div class="fb-saldo-card" id="fb-saldo-final-card"><div class="fb-saldo-lbl">Saldo final</div><div class="fb-saldo-val" id="fb-saldo-final">—</div><div class="fb-saldo-sub">saldo inicial − total investido</div></div>
          </div>
          <div class="fb-progress-wrap">
            <div class="fb-progress-header"><span>Consumo do orçamento da conta</span><span id="fb-saldo-pct" style="font-weight:600;color:var(--azul-escuro);">—</span></div>
            <div class="fb-progress-track"><div class="fb-progress-fill" id="fb-progress-bar" style="width:0%"></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── ACCORDION 2: MÉTRICAS FACEBOOK ADS ── -->
    <div class="sec-accordion" id="acc-metricas">
      <div class="sec-accordion-hdr" onclick="toggleAcc('acc-metricas')">
        <div class="sec-accordion-title"><span class="sec-icon">📣</span> Métricas Facebook Ads <span class="sec-accordion-meta" id="acc-metricas-meta"></span></div>
        <span class="sec-accordion-chev">▼</span>
      </div>
      <div class="sec-accordion-body">
        <div class="stats" style="grid-template-columns:repeat(3,1fr);margin-bottom:8px">
          <div class="stat"><div class="num" id="fb-investimento">—</div><div class="lbl">Investimento</div></div>
          <div class="stat"><div class="num" id="fb-leads">—</div><div class="lbl">Leads gerados</div></div>
          <div class="stat"><div class="num" id="fb-cpl">—</div><div class="lbl">CPL médio</div></div>
        </div>
        <div class="stats" style="grid-template-columns:repeat(3,1fr);margin-bottom:8px">
          <div class="stat"><div class="num" id="fb-alcance">—</div><div class="lbl">Alcance</div></div>
          <div class="stat"><div class="num" id="fb-impressoes">—</div><div class="lbl">Impressões</div></div>
          <div class="stat"><div class="num" id="fb-ctr">—</div><div class="lbl">CTR</div></div>
        </div>
        <div class="stats" style="grid-template-columns:repeat(3,1fr)">
          <div class="stat"><div class="num" id="fb-cpc">—</div><div class="lbl">CPC médio</div></div>
          <div class="stat"><div class="num" id="fb-taxa-conv">—</div><div class="lbl">Taxa conversão</div></div>
          <div class="stat"><div class="num" id="fb-media-diaria">—</div><div class="lbl">Média diária</div></div>
        </div>
      </div>
    </div>

    <!-- ── ACCORDION 3: CAMPANHAS ── -->
    <div class="sec-accordion" id="acc-campanhas">
      <div class="sec-accordion-hdr" onclick="toggleAcc('acc-campanhas')">
        <div class="sec-accordion-title"><span class="sec-icon">📋</span> Campanhas <span class="sec-accordion-meta" id="acc-campanhas-meta"></span></div>
        <span class="sec-accordion-chev">▼</span>
      </div>
      <div class="sec-accordion-body">
        <div id="cards-fb"><div class="empty">Selecione o período e clique em Buscar.</div></div>
      </div>
    </div>

    <!-- ── ACCORDION 4: ANÁLISE MARKETING ── -->
    <div class="sec-accordion" id="acc-analise">
      <div class="sec-accordion-hdr" onclick="toggleAcc('acc-analise')">
        <div class="sec-accordion-title"><span class="sec-icon">📊</span> Análise Marketing — Facebook Ads × RD CRM <span class="sec-accordion-meta" id="acc-analise-meta"></span></div>
        <span class="sec-accordion-chev">▼</span>
      </div>
      <div class="sec-accordion-body">
        <div id="mk-loading" style="display:none"></div>
        <div id="mk-empty" style="display:none" class="empty">Clique em Buscar para carregar a análise.</div>
        <div id="mk-stats" style="display:none;margin-bottom:16px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px;">
            <div class="stat"><div class="num" id="mk-investimento">—</div><div class="lbl">Investimento FB</div></div>
            <div class="stat"><div class="num" id="mk-leads-fb">—</div><div class="lbl">Leads FB</div></div>
            <div class="stat"><div class="num" id="mk-cpl">—</div><div class="lbl">CPL</div></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">
            <div class="stat" style="border-top-color:#7C3AED"><div class="num" id="mk-cpm" style="color:#7C3AED">—</div><div class="lbl">CPM</div></div>
            <div class="stat" style="border-top-color:#1D9E75"><div class="num" id="mk-roas" style="color:#1D9E75">—</div><div class="lbl">ROAS</div></div>
            <div class="stat stat-clickable" id="card-mk-vendido" style="border-top-color:#1D9E75;cursor:pointer;" onclick="abrirModalLeads('vendido')"><div class="num" id="mk-valor-vendido" style="color:#1D9E75">—</div><div class="lbl">Valor Vendido RD</div></div>
            <div class="stat stat-clickable" id="card-mk-perdido" style="border-top-color:#E24B4A;cursor:pointer;" onclick="abrirModalLeads('perdido')"><div class="num" id="mk-valor-perdido" style="color:#E24B4A">—</div><div class="lbl">Valor Perdido RD</div></div>
            <div class="stat stat-clickable" id="card-mk-aberto" style="border-top-color:var(--laranja);cursor:pointer;" onclick="abrirModalLeads('aberto')"><div class="num" id="mk-valor-aberto" style="color:var(--laranja)">—</div><div class="lbl">Valor em Aberto RD</div></div>
          </div>
        </div>
        <div id="mk-tabela" style="display:none;margin-bottom:16px;">
          <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Campanhas × Pipeline</div>
          <div id="mk-table-body"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- CONSULTA CNPJ -->
  <div class="page" id="page-cnpj">
    <div class="sec-hdr" style="margin-bottom:16px">
      <div><div style="font-size:18px;font-weight:700;color:var(--azul-escuro)">🏢 Consulta CNPJ</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Dados da Receita Federal</div></div>
    </div>
    <div class="cnpj-row">
      <input type="text" id="cnpj-input" placeholder="00.000.000/0000-00" maxlength="18" oninput="this.value=fc(this.value)" onkeydown="if(event.key==='Enter')buscarCNPJ()">
      <button class="btn btn-p" onclick="buscarCNPJ()">🔍 Consultar</button>
    </div>
    <div id="cnpj-result"></div>
  </div>

  <!-- TRANSCRIÇÕES -->
  <div class="page" id="page-transcricoes">
    <div class="sec-hdr" style="margin-bottom:16px">
      <div>
        <div style="font-size:18px;font-weight:700;color:var(--azul-escuro)">🎙️ Transcrições de Reuniões</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Resumos salvos no Google Drive</div>
      </div>
      <button class="btn btn-p" onclick="abrirModalNovaTranscricao()">➕ Nova Transcrição</button>
    </div>
    <div class="filtros">
      <div class="fg"><label>De</label><input type="date" id="tr-de"></div>
      <div class="fg"><label>Até</label><input type="date" id="tr-ate"></div>
      <div class="fa">
        <button class="btn btn-p" onclick="carregarTranscricoes()">🔍 Buscar</button>
        <button class="btn" onclick="limparFiltrosTR()">✕ Limpar</button>
      </div>
    </div>
    <div style="font-size:13px;font-weight:600;color:var(--azul-escuro);margin-bottom:10px;">📁 Minhas Transcrições</div>
    <div id="cards-tr"><div class="empty">Selecione o período e clique em Buscar.</div></div>
    <div id="tr-admin-wrap" style="display:none;margin-top:28px;">
      <div style="font-size:13px;font-weight:600;color:var(--azul-escuro);margin-bottom:10px;padding-top:16px;border-top:2px solid var(--border);">
        👥 Visão Administrador — Todas as Transcrições
      </div>
      <div id="cards-tr-admin"><div class="empty">Clique em Buscar para carregar.</div></div>
    </div>
  </div>

  <!-- PLUGIN REUNIÕES -->
  <div class="page" id="page-plugin">
    <div style="margin-bottom:20px;">
      <div style="font-size:18px;font-weight:700;color:var(--azul-escuro);">🧩 Plugin de Captura de Reuniões</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Instale a extensão para capturar reuniões automaticamente no Google Meet</div>
    </div>
    <div style="background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:16px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">📦</div>
      <div style="font-size:15px;font-weight:700;color:var(--azul-escuro);margin-bottom:4px;">Outtax Plugin Chrome</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Versão atual — extensão para Google Meet</div>
      <a href="/plugin/outtax-plugin.zip" download="outtax-plugin.zip"
         style="display:inline-flex;align-items:center;gap:8px;background:var(--azul-escuro);color:#fff;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;cursor:pointer;transition:background .2s;"
         onmouseover="this.style.background='var(--azul-medio)'" onmouseout="this.style.background='var(--azul-escuro)'">
        ⬇️ Baixar Plugin (.zip)
      </a>
      <div style="font-size:11px;color:var(--text-muted);margin-top:10px;">Após baixar, siga as instruções abaixo para instalar</div>
    </div>
    <div style="background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:20px;">
      <div style="font-size:14px;font-weight:700;color:var(--azul-escuro);margin-bottom:16px;">📋 Passo a passo de instalação</div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div style="min-width:32px;height:32px;border-radius:50%;background:var(--azul-escuro);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">1</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">Baixar e descompactar</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Clique no botão acima para baixar o arquivo <strong>.zip</strong>. Crie uma pasta no seu computador chamada <strong>Outtax Plugin Chrome</strong> e extraia o conteúdo do .zip dentro dela.</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div style="min-width:32px;height:32px;border-radius:50%;background:var(--azul-escuro);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">2</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">Abrir extensões do Chrome</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">No Chrome, clique nos <strong>três pontinhos</strong> (⋮) → <strong>Extensões</strong> → <strong>Gerenciar extensões</strong>. Ou acesse: <code style="background:var(--azul-pale);padding:2px 6px;border-radius:4px;font-size:11px;">chrome://extensions</code></div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div style="min-width:32px;height:32px;border-radius:50%;background:var(--azul-escuro);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">3</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">Ativar Modo Desenvolvedor</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">No canto <strong>superior direito</strong> da tela de extensões, ative o botão <strong>Modo do desenvolvedor</strong>.</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div style="min-width:32px;height:32px;border-radius:50%;background:var(--azul-escuro);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">4</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">Instalar o plugin</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Clique em <strong>Carregar sem compactação</strong> e selecione a pasta <strong>Outtax Plugin Chrome</strong> criada no passo 1.</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div style="min-width:32px;height:32px;border-radius:50%;background:var(--azul-escuro);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">5</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">Fixar a extensão</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Clique no ícone de <strong>extensões</strong> (🧩) na barra do Chrome e clique no <strong>alfinete</strong> ao lado do plugin da Outtax para deixá-lo visível.</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div style="min-width:32px;height:32px;border-radius:50%;background:var(--azul-escuro);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">6</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">Configurar acesso</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Clique no ícone do plugin → <strong>Abrir dashboard</strong> → faça login com seu usuário e senha → conecte sua conta Google.</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <div style="min-width:32px;height:32px;border-radius:50%;background:#1D9E75;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">✓</div>
        <div><div style="font-size:13px;font-weight:600;color:#1D9E75;">Pronto para usar!</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Ao entrar em uma reunião no Google Meet, o plugin captura automaticamente. <strong>Importante:</strong> mantenha as <strong>legendas ativadas</strong>.</div></div>
      </div>
    </div>
    <div style="background:var(--branco);border:1px solid var(--border);border-radius:12px;padding:16px;margin-top:16px;">
      <div style="font-size:13px;font-weight:600;color:var(--azul-escuro);margin-bottom:8px;">🗑️ Como desinstalar</div>
      <div style="font-size:12px;color:var(--text-muted);">Acesse <code style="background:var(--azul-pale);padding:2px 6px;border-radius:4px;font-size:11px;">chrome://extensions</code>, encontre o plugin da Outtax e clique em <strong>Remover</strong>. Depois delete a pasta <strong>Outtax Plugin Chrome</strong> do seu computador.</div>
    </div>
  </div>

</div><!-- /main-content -->

<!-- MODAL CONFIGURAÇÕES -->
<div class="modal-ov" id="mcfg">
  <div class="modal">
    <h3>⚙ Configurações</h3>
    <p>Conecte o Google Agenda para carregar suas reuniões.</p>
    <div id="google-status" style="padding:10px 12px;border-radius:8px;font-size:12px;margin-bottom:16px;background:#f8f7f4;color:#6b6b6b;">Não conectado</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button id="btn-google" class="btn btn-p" onclick="conectarGoogle()">🔗 Conectar Google Agenda</button>
      <button id="btn-google-desconectar" class="btn" style="display:none;border-color:#E24B4A;color:#E24B4A;" onclick="desconectarGoogle()">✕ Desconectar</button>
    </div>
    <div class="modal-ft"><button class="btn-cancel" onclick="fecharCfg()">Fechar</button></div>
  </div>
</div>

<!-- MODAL NOVA TRANSCRIÇÃO -->
<div class="modal-ov" id="m-nova-tr" onclick="fecharModalNovaTranscricao(event)">
  <div class="modal" style="max-width:560px;" onclick="event.stopPropagation()">
    <h3>🎙️ Nova Transcrição</h3>
    <p>Cole o resumo gerado pela IA e preencha os dados da reunião.</p>
    <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Gerar resumo com IA</div>
    <div class="llm-grid" style="margin-bottom:14px;">
      <div class="llm-btn ativo" id="tr-llm-chatgpt" onclick="selecionarLLMTR('chatgpt',this)"><div style="font-size:20px;margin-bottom:4px;">🤖</div>ChatGPT</div>
      <div class="llm-btn" id="tr-llm-gemini" onclick="selecionarLLMTR('gemini',this)"><div style="font-size:20px;margin-bottom:4px;">✨</div>Gemini</div>
      <div class="llm-btn" id="tr-llm-claude" onclick="selecionarLLMTR('claude',this)"><div style="font-size:20px;margin-bottom:4px;">🧠</div>Claude</div>
    </div>
    <button class="btn btn-p" style="width:100%;justify-content:center;margin-bottom:16px;" onclick="copiarPromptTR()">
      📋 Copiar prompt e abrir IA
      <span id="tr-badge-copiado" class="copiado-badge">✓ Copiado!</span>
    </button>
    <div style="border-top:1px solid var(--border);padding-top:14px;margin-bottom:12px;">
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Dados da reunião</div>
      <div class="fg" style="margin-bottom:10px;"><label>Título da reunião *</label><input type="text" id="tr-titulo" placeholder="Ex: Reunião Cliente ABC — Proposta" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;width:100%;color:var(--text);"></div>
      <div class="fg" style="margin-bottom:10px;"><label>Participantes</label><input type="text" id="tr-participantes" placeholder="Ex: Marcos, João, Maria" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;width:100%;color:var(--text);"></div>
      <div class="fg" style="margin-bottom:10px;"><label>Resumo gerado pela IA *</label><textarea id="tr-conteudo" placeholder="Cole aqui o resumo gerado pela IA..." style="width:100%;height:160px;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:12px;resize:vertical;color:var(--text);font-family:inherit;"></textarea></div>
    </div>
    <div id="tr-erro" style="display:none;font-size:12px;color:#791F1F;background:#FCEBEB;padding:8px 12px;border-radius:8px;margin-bottom:10px;"></div>
    <div class="modal-ft">
      <button class="btn-cancel" onclick="fecharModalNovaTranscricao()">Cancelar</button>
      <button class="btn btn-p" onclick="salvarTranscricao(this)">💾 Salvar no Drive</button>
    </div>
  </div>
</div>

<!-- MODAL VISUALIZAR TRANSCRIÇÃO -->
<div class="modal-ov" id="m-ver-tr" onclick="fecharModalVerTR(event)">
  <div class="modal" style="max-width:680px;max-height:85vh;overflow-y:auto;" onclick="event.stopPropagation()">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
      <div><h3 id="ver-tr-titulo" style="margin-bottom:4px;">Transcrição</h3><div id="ver-tr-meta" style="font-size:11px;color:var(--text-muted);"></div></div>
      <button onclick="fecharModalVerTR()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);line-height:1;padding:0 4px;">✕</button>
    </div>
    <div id="ver-tr-loading" style="display:none;" class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span style="margin-left:6px;">Carregando...</span></div>
    <div id="ver-tr-conteudo" style="background:var(--azul-pale);border-radius:8px;padding:14px;font-size:12px;line-height:1.8;white-space:pre-wrap;font-family:monospace;max-height:500px;overflow-y:auto;"></div>
    <div class="modal-ft" style="margin-top:14px;flex-wrap:wrap;gap:8px;">
      <button class="btn-cancel" onclick="fecharModalVerTR()">Fechar</button>
      <button class="btn" onclick="copiarTranscricao()" style="font-size:12px;">📋 Copiar</button>
      <button class="btn btn-p" onclick="baixarTranscricao()">⬇️ Baixar .txt</button>
      <button class="btn btn-p" onclick="abrirResumoIATranscricao()" style="background:var(--azul-medio);">🤖 Resumo com IA</button>
    </div>
    <div id="ver-tr-llm" style="display:none;border-top:1px solid var(--border);margin-top:14px;padding-top:14px;">
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Escolha a IA para gerar o resumo executivo:</div>
      <div class="llm-grid">
        <div class="llm-btn ativo" onclick="selecionarLLMTRVer('chatgpt',this)"><div style="font-size:20px;margin-bottom:4px;">🤖</div>ChatGPT</div>
        <div class="llm-btn" onclick="selecionarLLMTRVer('gemini',this)"><div style="font-size:20px;margin-bottom:4px;">✨</div>Gemini</div>
        <div class="llm-btn" onclick="selecionarLLMTRVer('claude',this)"><div style="font-size:20px;margin-bottom:4px;">🧠</div>Claude</div>
      </div>
      <div style="background:var(--azul-pale);border-radius:8px;padding:12px;font-size:11px;color:var(--text-muted);margin-top:10px;line-height:1.6;">
        <strong style="color:var(--azul-escuro);">Como usar:</strong><br>1. Clique em <strong>📋 Copiar</strong> para copiar a transcrição<br>2. Clique em <strong>🚀 Abrir IA</strong> para abrir a IA escolhida<br>3. Cole o texto e peça o resumo executivo
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-p" onclick="copiarEAbrirIATR()" style="flex:1;">📋 Copiar + 🚀 Abrir IA</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL ANÁLISE IA -->
<div id="modal-ai" class="modal-ai" style="display:none;">
  <div class="modal-ai-box">
    <div class="modal-ai-titulo">🤖 Análise Tributária com IA<button onclick="fecharModalAI()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">✕</button></div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">Escolha a IA para gerar a análise:</div>
    <div class="llm-grid">
      <div class="llm-btn ativo" onclick="selecionarLLM('chatgpt',this)"><div style="font-size:20px;margin-bottom:4px;">🤖</div>ChatGPT</div>
      <div class="llm-btn" onclick="selecionarLLM('gemini',this)"><div style="font-size:20px;margin-bottom:4px;">✨</div>Gemini</div>
      <div class="llm-btn" onclick="selecionarLLM('claude',this)"><div style="font-size:20px;margin-bottom:4px;">🧠</div>Claude</div>
    </div>
    <div id="prompt-section" style="display:none;">
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Prompt gerado <span id="badge-copiado" class="copiado-badge">✓ Copiado!</span></div>
      <div id="prompt-preview" class="prompt-box"></div>
      <button class="btn-ai-acao btn-copiar" onclick="copiarPromptAI()">📋 Copiar prompt</button>
      <button class="btn-ai-acao btn-abrir" onclick="abrirLLM()">🚀 Abrir IA em nova aba</button>
      <div style="border-top:1px solid #e5e5e5;margin:12px 0;"></div>
      <div style="font-size:11px;font-weight:600;color:#6b6b6b;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">Importar resultado da IA</div>
      <div style="font-size:12px;color:#6b6b6b;margin-bottom:10px;">Após gerar na IA, salve como .txt e importe aqui, ou cole o texto diretamente:</div>
      <div class="importar-area" onclick="document.getElementById('input-import-ai').click()">📁 Clique para importar arquivo .txt<input type="file" id="input-import-ai" accept=".txt,.md" style="display:none" onchange="importarArquivoAI(this)"></div>
      <textarea id="txt-colar-ai" placeholder="Ou cole o texto da análise aqui..." style="width:100%;height:100px;border:1px solid #e5e5e5;border-radius:8px;padding:10px;font-size:12px;resize:vertical;box-sizing:border-box;margin-bottom:8px;"></textarea>
      <button class="btn-ai-acao btn-importar" onclick="processarAnaliseImportada()">✅ Visualizar e gravar no RD Station</button>
    </div>
  </div>
</div>

<!-- TELA DE IMPORTAÇÃO -->
<div id="tela-importacao" class="tela-importacao">
  <div class="tela-imp-header"><span>📋 Revisão da Análise — <span id="ti-nome"></span></span><button onclick="fecharTelaImportacao()" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">✕</button></div>
  <div class="tela-imp-body">
    <div class="tela-imp-label">Dados da Reunião</div>
    <div class="tela-imp-secao" id="ti-dados"></div>
    <div class="tela-imp-label" style="margin-top:16px;">Análise Gerada pela IA</div>
    <div class="tela-imp-secao" id="ti-analise" style="white-space:pre-wrap;font-family:monospace;font-size:12px;"></div>
  </div>
  <div class="tela-imp-footer">
    <button onclick="fecharTelaImportacao()" style="padding:10px 20px;border-radius:8px;border:1px solid #e5e5e5;background:#fff;cursor:pointer;font-size:13px;">Cancelar</button>
    <button onclick="gravarNoRD(this)" style="padding:10px 24px;border-radius:8px;border:none;background:#1D9E75;color:#fff;font-weight:600;cursor:pointer;font-size:13px;">💾 Gravar no RD Station</button>
  </div>
</div>

<!-- MODAL LEADS RD -->
<div class="modal-leads-ov" id="modal-leads-ov" onclick="fecharModalLeads(event)">
  <div class="modal-leads-box" onclick="event.stopPropagation()">
    <div class="modal-leads-header">
      <div><div class="modal-leads-title" id="modal-leads-title">Leads</div><div class="modal-leads-subtitle" id="modal-leads-subtitle"></div></div>
      <button class="modal-leads-close" onclick="fecharModalLeads()">✕</button>
    </div>
    <div class="modal-leads-summary" id="modal-leads-summary"></div>
    <div class="modal-leads-body" id="modal-leads-body"><div class="modal-leads-empty">Carregando...</div></div>
    <div class="modal-leads-footer"><span class="modal-leads-total" id="modal-leads-total"></span><button class="btn" onclick="fecharModalLeads()">Fechar</button></div>
  </div>
</div>

<!-- MODAL GERENCIAR USUÁRIOS -->
<div class="modal-ov" id="m-usuarios">
  <div class="modal" style="max-width:520px;">
    <h3>👥 Gerenciar Usuários</h3>
    <p>Adicione ou remova usuários com acesso ao dashboard.</p>
    <div id="lista-usuarios" style="margin-bottom:16px;"></div>
    <div style="border-top:1px solid var(--border);padding-top:16px;">
      <div style="font-size:12px;font-weight:600;color:var(--azul-escuro);margin-bottom:10px;">+ Adicionar usuário</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <div class="fg"><label>Usuário (login)</label><input type="text" id="nu-usuario" placeholder="ex: joao" style="padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;width:100%;"></div>
        <div class="fg"><label>Nome completo</label><input type="text" id="nu-nome" placeholder="ex: João Silva" style="padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;width:100%;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <div class="fg"><label>Senha</label><input type="password" id="nu-senha" placeholder="••••••••" style="padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;width:100%;"></div>
        <div class="fg"><label>Perfil</label><select id="nu-admin" style="padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;width:100%;"><option value="false">Usuário comum</option><option value="true">Administrador</option></select></div>
      </div>
      <div id="nu-erro" style="display:none;font-size:12px;color:#791F1F;background:#FCEBEB;padding:8px 12px;border-radius:8px;margin-bottom:8px;"></div>
      <button class="btn btn-p" style="width:100%;" onclick="adicionarUsuario()">✅ Adicionar usuário</button>
      <button class="btn" style="width:100%;margin-top:8px;background:#FFF0E0;color:#8B5E00;border:1px solid #E8C97A;font-size:11px;padding:8px;border-radius:8px;cursor:pointer;" onclick="migrarSenhasParaHash()">🔒 Migrar senhas para hash seguro</button>
    </div>
    <div class="modal-ft"><button class="btn-cancel" onclick="fecharGerenciarUsuarios()">Fechar</button></div>
  </div>
</div>

<!-- MODAL PREENCHER RD STATION -->
<div class="modal-rd-ov" id="modal-rd-ov" onclick="fecharModalRD(event)">
  <div class="modal-rd-box" onclick="event.stopPropagation()">
    <div class="modal-rd-header">
      <div><h3>🏢 Criar Empresa no RD Station</h3><p id="modal-rd-subtitulo">Revise os dados e confirme</p></div>
      <button class="modal-rd-close" onclick="fecharModalRD()">✕</button>
    </div>
    <div class="modal-rd-body">
      <div id="modal-rd-status-box" style="display:none;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;line-height:1.7;"></div>
      <div class="modal-rd-section">
        <div class="modal-rd-section-title">📋 Dados que serão cadastrados</div>
        <div id="modal-rd-dados-empresa"></div>
      </div>
    </div>
    <div class="modal-rd-footer">
      <button class="btn" onclick="fecharModalRD()">Cancelar</button>
      <div style="display:flex;gap:8px;align-items:center;">
        <a id="modal-rd-link-deal" href="#" target="_blank" class="btn" style="font-size:11px;display:none;">🔗 Ver Deal ↗</a>
        <a id="modal-rd-link-org" href="#" target="_blank" class="btn btn-p" style="font-size:11px;display:none;">🏢 Ver Empresa criada ↗</a>
        <button id="modal-rd-btn-criar" class="btn btn-s" style="font-size:12px;" onclick="executarCriarEmpresaRD()">✅ Criar Empresa e Vincular ao Deal</button>
      </div>
    </div>
  </div>
</div>

<script>
// ── SESSÃO ───────────────────────────────────────────────
const K='otx_cfg';
const getCfg=()=>{try{return JSON.parse(localStorage.getItem(K))||{};}catch{return{};}};
function getSessionToken(){return getCfg().sessionToken||'';}
function getCSRFToken(){return getCfg().csrfToken||'';}
async function validarSessaoNoServidor(){
  const t=getSessionToken();
  if(!t){mostrarLogin();return false;}
  try{
    const r=await fetch('/api/auth/me',{headers:{'X-Session-Token':t}});
    if(r.ok){const d=await r.json();const c=getCfg();c.nomeUsuario=d.nome||d.usuario;c.isAdmin=d.admin===true;if(d.csrfToken)c.csrfToken=d.csrfToken;localStorage.setItem(K,JSON.stringify(c));return true;}
    fazerLogout();return false;
  }catch(e){console.warn('Validação de sessão falhou:',e.message);return true;}
}
function mostrarLogin(){document.getElementById('login-screen').classList.remove('hidden');}
function ocultarLogin(){document.getElementById('login-screen').classList.add('hidden');}
async function fazerLogin(){
  const usuario=document.getElementById('login-usuario').value.trim();const senha=document.getElementById('login-senha').value.trim();const errEl=document.getElementById('login-err');errEl.classList.remove('show');
  if(!usuario||!senha){errEl.textContent='Preencha usuário e senha.';errEl.classList.add('show');return;}
  try{
    const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({usuario,senha})});const data=await r.json();
    if(r.status===429){errEl.textContent=data.erro||'Muitas tentativas. Aguarde alguns minutos.';errEl.classList.add('show');return;}
    if(!r.ok||!data.sessionToken){errEl.textContent=data.erro||'Usuário ou senha incorretos.';errEl.classList.add('show');return;}
    const c=getCfg();c.sessionToken=data.sessionToken;c.nomeUsuario=data.nome||usuario;c.isAdmin=data.admin===true;if(data.csrfToken)c.csrfToken=data.csrfToken;localStorage.setItem(K,JSON.stringify(c));ocultarLogin();inicializar();
  }catch(e){errEl.textContent='Erro ao conectar. Tente novamente.';errEl.classList.add('show');}
}
function fazerLogout(){const c=getCfg();delete c.sessionToken;delete c.csrfToken;localStorage.setItem(K,JSON.stringify(c));mostrarLogin();}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('login-senha').addEventListener('keydown',e=>{if(e.key==='Enter')fazerLogin();});
  document.getElementById('login-usuario').addEventListener('keydown',e=>{if(e.key==='Enter')fazerLogin();});
});

// ── CONFIG / GOOGLE ───────────────────────────────────────
function checkCfg(){document.getElementById('banner').classList.toggle('hidden',!!getCfg().googleEmail);atualizarStatusGoogle();}
function abrirCfg(){atualizarStatusGoogle();document.getElementById('mcfg').classList.add('open');}
function fecharCfg(){document.getElementById('mcfg').classList.remove('open');}
function conectarGoogle(){fecharCfg();const s=getSessionToken();window.location.href='/api/google-auth?session='+encodeURIComponent(s);}
function desconectarGoogle(){const c=getCfg();delete c.googleToken;delete c.googleRefreshToken;delete c.googleEmail;delete c.googleName;localStorage.setItem(K,JSON.stringify(c));atualizarStatusGoogle();alert('Google Agenda desconectado.');}
function atualizarStatusGoogle(){
  const c=getCfg();const statusEl=document.getElementById('google-status');const btnC=document.getElementById('btn-google');const btnD=document.getElementById('btn-google-desconectar');
  if(!statusEl)return;
  if(c.googleEmail){statusEl.style.background='#EAF3DE';statusEl.style.color='#27500A';statusEl.innerHTML='✅ Conectado como <strong>'+c.googleEmail+'</strong>';if(btnC)btnC.style.display='none';if(btnD)btnD.style.display='inline-flex';}
  else{statusEl.style.background='#f8f7f4';statusEl.style.color='#6b6b6b';statusEl.textContent='Não conectado';if(btnC)btnC.style.display='inline-flex';if(btnD)btnD.style.display='none';}
}
function capturarTokenGoogle(){
  const params=new URLSearchParams(window.location.search);const token=params.get('google_access_token');const refresh=params.get('google_refresh_token');const email=params.get('google_email');const name=params.get('google_name');const erro=params.get('google_error');const sessionViaUrl=params.get('session_token');
  if(erro){alert('Erro ao conectar Google Agenda: '+erro);window.history.replaceState({},'','/');return;}
  if(token){const c=getCfg();const sessionFinal=sessionViaUrl||c.sessionToken||'';const novoEstado={...c,sessionToken:sessionFinal,googleToken:token,googleEmail:email||'',googleName:name||''};if(refresh)novoEstado.googleRefreshToken=refresh;localStorage.setItem(K,JSON.stringify(novoEstado));window.history.replaceState({},'','/');if(!sessionFinal){mostrarLogin();return;}checkCfg();alert('✅ Google conectado!');}
}

// ── NAV ──────────────────────────────────────────────────
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sidebar-overlay').classList.toggle('open');}
function showPage(n,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+n).classList.add('active');
  const navEl=document.getElementById('nav-'+n)||el;if(navEl)navEl.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('open');
}

// ── UTILS ─────────────────────────────────────────────────
const ini=n=>(n||'?').split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();
const diasAtras=d=>d?Math.floor((Date.now()-new Date(d))/864e5):0;
const load=msg=>`<div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span style="margin-left:4px;">${msg}</span></div>`;
function fc(v){v=v.replace(/\D/g,'').slice(0,14);if(v.length<=2)return v;if(v.length<=5)return v.slice(0,2)+'.'+v.slice(2);if(v.length<=8)return v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5);if(v.length<=12)return v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5,8)+'/'+v.slice(8);return v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5,8)+'/'+v.slice(8,12)+'-'+v.slice(12,14);}
function toggle(h){const b=h.nextElementSibling;if(!b)return;const c=h.querySelector('.chev');const o=b.classList.contains('open');b.classList.toggle('open',!o);if(c)c.style.transform=o?'':'rotate(180deg)';}
function dataHoje(){return new Date().toISOString().split('T')[0];}
const fmtBRL=v=>v!=null&&v>0?'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2}):'-';

// ── API RD CRM ────────────────────────────────────────────
async function crmFetch(path,params={},method='GET',body=null){
  const qs=Object.keys(params).length?'&'+new URLSearchParams(params):'';const url=`/api/rdcrm?path=${encodeURIComponent(path)}${qs}`;
  const opts={method,headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken()}};if(body)opts.body=JSON.stringify(body);
  const r=await fetch(url,opts);const data=await r.json();if(data.erro)throw new Error(data.erro);return data;
}
const rdFetch=crmFetch;

// ── FUNIS DINÂMICOS ───────────────────────────────────────
let _funisCacheados=null;
async function carregarFunis(){
  if(_funisCacheados)return _funisCacheados;
  try{
    const data=await crmFetch('deal_pipelines');const funis=Array.isArray(data)?data:(data.deal_pipelines||[]);_funisCacheados=funis;
    const sel=document.getElementById('f-funil');
    if(sel){sel.innerHTML='<option value="all">Todos os funis</option>';funis.forEach(f=>{const opt=document.createElement('option');opt.value=f._id||f.id;opt.textContent=f.name;sel.appendChild(opt);});}
    return funis;
  }catch(e){console.error('Erro ao carregar funis:',e.message);return[];}
}

// ════════════════════════════════════════════════════════════
// ── ACCORDION SEÇÕES ─────────────────────────────────────
function toggleAcc(id){
  const acc=document.getElementById(id);if(!acc)return;
  const hdr=acc.querySelector('.sec-accordion-hdr');
  const body=acc.querySelector('.sec-accordion-body');
  const chev=acc.querySelector('.sec-accordion-chev');
  const isOpen=body.classList.contains('open');
  body.classList.toggle('open',!isOpen);
  hdr.classList.toggle('open',!isOpen);
  chev.style.transform=isOpen?'':'rotate(180deg)';
}
function abrirAcc(id){
  const acc=document.getElementById(id);if(!acc)return;
  acc.querySelector('.sec-accordion-body').classList.add('open');
  acc.querySelector('.sec-accordion-hdr').classList.add('open');
  acc.querySelector('.sec-accordion-chev').style.transform='rotate(180deg)';
}

// FACEBOOK ADS & MARKETING — ABA UNIFICADA
// ════════════════════════════════════════════════════════════
let _fbDadosAtual=null;
let _mkDeals=[];
let _mkDealsVendidos=[];
let _mkDealsPerdidos=[];
let _mkDealsAbertos=[];
let _mkPeriodoLabel='';

function aplicarPeriodoFB(dias){
  if(!dias)return;
  if(dias==='custom')return;
  const hoje=new Date();const de=new Date();
  de.setDate(hoje.getDate()-parseInt(dias));
  document.getElementById('fb-de').value=de.toISOString().split('T')[0];
  document.getElementById('fb-ate').value=hoje.toISOString().split('T')[0];
}

function limparFiltrosFBMkt(){
  document.getElementById('fb-periodo').value='30';aplicarPeriodoFB('30');
  document.getElementById('fb-filtro-status').value='todas';
  document.getElementById('mk-campanha').value='all';
}

// Função principal unificada — busca FB + análise RD em uma única chamada
async function carregarFBMkt(){
  document.getElementById('fb-aviso-config').style.display='none';

  let de=document.getElementById('fb-de').value;let ate=document.getElementById('fb-ate').value;
  if(!de||!ate){aplicarPeriodoFB('30');de=document.getElementById('fb-de').value;ate=document.getElementById('fb-ate').value;}
  const filtroStatus=document.getElementById('fb-filtro-status')?.value||'todas';
  _mkPeriodoLabel=`${new Date(de+'T12:00:00').toLocaleDateString('pt-BR')} → ${new Date(ate+'T12:00:00').toLocaleDateString('pt-BR')}`;

  // Reset displays
  document.getElementById('cards-fb').innerHTML=load('Buscando campanhas do Facebook Ads...');
  ['fb-investimento','fb-leads','fb-cpl','fb-alcance','fb-impressoes','fb-ctr','fb-cpc','fb-taxa-conv','fb-media-diaria'].forEach(id=>{document.getElementById(id).textContent='...';});
  ['mk-stats','mk-tabela'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
  const mkLoading=document.getElementById('mk-loading');const mkEmpty=document.getElementById('mk-empty');
  mkEmpty.style.display='none';mkLoading.style.display='block';mkLoading.innerHTML=load('Analisando Facebook Ads × RD CRM...');
  _mkDealsVendidos=[];_mkDealsPerdidos=[];_mkDealsAbertos=[];

  try{
    const ini2=new Date(de+'T00:00:00');const fim=new Date(ate+'T23:59:59');
    _funisCacheados=null;
    const[funis,fbRes]=await Promise.all([carregarFunis(),fetch(`/api/meta-ads?dateStart=${de}&dateEnd=${ate}`,{headers:{'X-Session-Token':getSessionToken()}})]);
    const fbData=await fbRes.json();if(!fbRes.ok)throw new Error(fbData.erro||'Erro no Facebook Ads');

    const ativas=fbData.ativas||[];const pausadas=fbData.pausadas||[];const totais=fbData.totais||{};
    _fbDadosAtual={ativas,pausadas,totais,periodo:fbData.periodo,conta:fbData.conta};

    // ── SALDO ──
    if(fbData.conta){
      const c=fbData.conta;const neg=c.saldoFinal<0;
      const pct=c.saldoInicial>0?Math.min(Math.round((c.investidoPeriodo/c.saldoInicial)*100),100):0;
      const barColor=pct>=90?'#E24B4A':pct>=70?'#FF8E2A':'#1D9E75';
      document.getElementById('fb-saldo-inicial').textContent=fmtBRL(c.saldoInicial);
      document.getElementById('fb-saldo-investido').textContent=fmtBRL(c.investidoPeriodo);
      document.getElementById('fb-saldo-final').textContent=fmtBRL(c.saldoFinal);
      document.getElementById('fb-saldo-final').className='fb-saldo-val '+(neg?'vermelho':'verde');
      document.getElementById('fb-saldo-final-card').className='fb-saldo-card '+(neg?'final-neg':'final-pos');
      document.getElementById('fb-saldo-pct').textContent=pct+'% consumido';
      const bar=document.getElementById('fb-progress-bar');bar.style.width=pct+'%';bar.style.background=barColor;
      const metaSaldo=document.getElementById('acc-saldo-meta');if(metaSaldo)metaSaldo.textContent='· Saldo: '+fmtBRL(c.saldoFinal)+' · '+pct+'% consumido';
      abrirAcc('acc-saldo');
    }

    // ── MÉTRICAS FB ──
    const fmtNum=v=>v?Number(v).toLocaleString('pt-BR'):'-';
    document.getElementById('fb-investimento').textContent=fmtBRL(totais.investimento);
    document.getElementById('fb-leads').textContent=fmtNum(totais.leads);
    document.getElementById('fb-cpl').textContent=totais.cpl?fmtBRL(totais.cpl):'-';
    document.getElementById('fb-alcance').textContent=fmtNum(totais.alcance);
    document.getElementById('fb-impressoes').textContent=fmtNum(totais.impressoes);
    document.getElementById('fb-ctr').textContent=totais.ctr?Number(totais.ctr).toFixed(2)+'%':'-';
    document.getElementById('fb-cpc').textContent=totais.cliques&&totais.investimento?fmtBRL(totais.investimento/totais.cliques):'-';
    document.getElementById('fb-taxa-conv').textContent=totais.taxaConversao?totais.taxaConversao+'%':'-';
    document.getElementById('fb-media-diaria').textContent=totais.mediaDiaria?fmtBRL(totais.mediaDiaria)+'/dia':'-';
    const metaMet=document.getElementById('acc-metricas-meta');if(metaMet)metaMet.textContent='· '+fmtBRL(totais.investimento)+' · '+(totais.leads||0)+' leads · CPL '+( totais.cpl?fmtBRL(totais.cpl):'-');
    abrirAcc('acc-metricas');

    // ── CAMPANHAS ──
    let html='';
    const mostrarAtivas=filtroStatus==='todas'||filtroStatus==='ativas';
    const mostrarPausadas=filtroStatus==='todas'||filtroStatus==='pausadas';
    if(mostrarAtivas){html+=`<div style="font-size:11px;font-weight:700;color:#1D9E75;text-transform:uppercase;letter-spacing:.06em;margin:4px 0 10px;display:flex;align-items:center;gap:8px;"><span style="width:8px;height:8px;border-radius:50%;background:#1D9E75;display:inline-block;"></span>Campanhas ativas — ${ativas.length}</div>`;html+=ativas.length?ativas.map(c=>cardFacebook(c,de,ate)).join(''):`<div class="empty" style="padding:1rem;">Nenhuma campanha ativa.</div>`;}
    if(mostrarPausadas){html+=`<div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin:${mostrarAtivas?'20px':'4px'} 0 10px;display:flex;align-items:center;gap:8px;"><span style="width:8px;height:8px;border-radius:50%;background:#9e9e9e;display:inline-block;"></span>Campanhas pausadas — ${pausadas.length}</div>`;html+=pausadas.length?pausadas.map(c=>cardFacebook(c,de,ate)).join(''):`<div class="empty" style="padding:1rem;">Nenhuma campanha pausada.</div>`;}
    document.getElementById('cards-fb').innerHTML=html||'<div class="empty">Nenhuma campanha encontrada.</div>';
    const metaCamp=document.getElementById('acc-campanhas-meta');if(metaCamp)metaCamp.textContent='· '+ativas.length+' ativas · '+pausadas.length+' pausadas';
    abrirAcc('acc-campanhas');

    // ── ANÁLISE MARKETING (FB × RD) ──
    const todasCampanhas=[...ativas,...pausadas].filter(c=>c.investimento>0);

    // Popula select de campanhas
    const selCamp=document.getElementById('mk-campanha');const campAtual=selCamp.value;
    selCamp.innerHTML='<option value="all">Todas as campanhas</option>';
    todasCampanhas.forEach(c=>{const opt=document.createElement('option');opt.value=c.nome;opt.textContent=c.nome;selCamp.appendChild(opt);});
    if([...selCamp.options].some(o=>o.value===campAtual))selCamp.value=campAtual;

    if(!funis||funis.length===0){mkLoading.style.display='none';mkEmpty.style.display='block';mkEmpty.innerHTML='<div style="color:var(--text-muted);">RD CRM não disponível para análise de funis.</div>';return;}

    // Busca todos os deals dos funis
    const todosDealsRaw=[];
    const todasRespostas=await Promise.all(funis.map(f=>crmFetch('deals',{deal_pipeline_id:f._id||f.id}).catch(()=>({deals:[]}))));
    funis.forEach((f,fi)=>{(todasRespostas[fi]?.deals||[]).forEach(d=>{d._pipeline_id=f._id||f.id;d._pipeline_name=f.name;todosDealsRaw.push(d);});});

    const nomesCampsFB=todasCampanhas.map(c=>c.nome.toLowerCase());
    function dealVeioDoFacebook(d){const campDeal=(d.campaign?.name||'').toLowerCase().trim();if(!campDeal||campDeal==='sem campanha')return false;return nomesCampsFB.some(nomeFB=>{const palavrasFB=nomeFB.replace(/\[.*?\]/g,'').trim().split(/\s+/).filter(p=>p.length>3);return palavrasFB.some(p=>campDeal.includes(p));});}
    function prioridadeFunil(d){return funis.findIndex(f=>(f._id||f.id)===d._pipeline_id);}

    const dealsFBPeriodo=todosDealsRaw.filter(d=>{if(!dealVeioDoFacebook(d))return false;const criado=new Date(d.created_at);return criado>=ini2&&criado<=fim;});
    const emailDedupFB=new Map();
    dealsFBPeriodo.forEach(d=>{const email=(d.contacts||[]).find(c=>c.emails?.length)?.emails?.[0]?.email||('id:'+(d._id||d.id));const existing=emailDedupFB.get(email);if(!existing||prioridadeFunil(d)<prioridadeFunil(existing)){emailDedupFB.set(email,d);}});
    const dealsFB=[...emailDedupFB.values()];_mkDeals=dealsFB;

    const campFiltro=selCamp.value;let fbInvest=totais.investimento||0,fbLeads=totais.leads||0;
    if(campFiltro!=='all'){const fbC=todasCampanhas.find(c=>c.nome===campFiltro);if(fbC){fbInvest=fbC.investimento;fbLeads=fbC.leads;}}

    const cpl=fbLeads>0?fbInvest/fbLeads:null;
    const cpmTotal=totais.impressoes>0?(totais.investimento/totais.impressoes*1000):null;

    const todosDealsRDPer=todosDealsRaw.filter(d=>{const cr=new Date(d.created_at);return cr>=ini2&&cr<=fim;});
    _mkDealsVendidos=todosDealsRDPer.filter(d=>d.win===true);
    _mkDealsPerdidos=todosDealsRDPer.filter(d=>((d.deal_stage&&d.deal_stage.name)||'').toLowerCase().includes('perdid'));
    _mkDealsAbertos=todosDealsRDPer.filter(d=>!d.win&&!((d.deal_stage&&d.deal_stage.name)||'').toLowerCase().includes('perdid'));

    const valVendido=_mkDealsVendidos.reduce((s,d)=>s+Number(d.amount_montly||0),0);
    const valAberto=_mkDealsAbertos.reduce((s,d)=>s+Number(d.amount_montly||0),0);
    const valPerdido=_mkDealsPerdidos.reduce((s,d)=>s+Number(d.amount_montly||0),0);
    const roas=fbInvest>0&&valVendido>0?(valVendido/fbInvest):null;

    document.getElementById('mk-investimento').textContent=fmtBRL(fbInvest);
    document.getElementById('mk-leads-fb').textContent=fbLeads||'0';
    document.getElementById('mk-cpl').textContent=fmtBRL(cpl);
    document.getElementById('mk-cpm').textContent=cpmTotal?fmtBRL(cpmTotal):'-';
    document.getElementById('mk-roas').textContent=roas?roas.toFixed(2)+'x':'-';
    document.getElementById('mk-valor-vendido').textContent=valVendido>0?fmtBRL(valVendido):'R$ 0,00';
    document.getElementById('mk-valor-perdido').textContent=valPerdido>0?fmtBRL(valPerdido):'R$ 0,00';
    document.getElementById('mk-valor-aberto').textContent=valAberto>0?fmtBRL(valAberto):'R$ 0,00';
    document.getElementById('mk-stats').style.display='block';
    abrirAcc('acc-analise');
    const metaAn=document.getElementById('acc-analise-meta');if(metaAn)metaAn.textContent='· ROAS '+(roas?roas.toFixed(2)+'x':'-')+' · Vendido '+fmtBRL(valVendido);

    // ── TABELA CAMPANHAS × PIPELINE ──
    function corEstagio(e){const n=e.toLowerCase();if(n.includes('perdid'))return'#E24B4A';if(n.includes('proposta fechada'))return'#1D9E75';if(n.includes('follow')||n.includes('prov.')||n.includes('[t]')||n.includes('[c]')||n.includes('[m]'))return'#94A3B8';if(n.includes('reuni')||n.includes('enviar proposta')||n.includes('proposta enviada')||n.includes('apresentaç'))return'#EF9F27';if(n.includes('proposta'))return'#7C3AED';if(n.includes('em atend')||n.includes('interesse'))return'#92400E';if(n.includes('contato feito')||n.includes('contactad'))return'#378ADD';if(n.includes('reagend')||n.includes('tentativa'))return'#D97706';return'#9e9e9e';}
    function matchDealCampanha(d,campNome){const campDeal=(d.campaign?.name||'').toLowerCase().trim();if(!campDeal||campDeal==='sem campanha')return false;const palavras=campNome.toLowerCase().replace(/\[.*?\]/g,'').trim().split(/\s+/).filter(p=>p.length>3);return palavras.some(p=>campDeal.includes(p));}
    const ordemFunis=funis.map(f=>f._id||f.id);
    let _eidx=Date.now()%100000;
    const tbBody=document.getElementById('mk-table-body');
    const campFiltroVal=selCamp.value;
    let campanhasParaTabela=todasCampanhas;
    if(campFiltroVal!=='all'){campanhasParaTabela=todasCampanhas.filter(c=>c.nome===campFiltroVal);}

    if(campanhasParaTabela.length>0){
      tbBody.innerHTML=campanhasParaTabela.map(c=>{
        const cpmC=c.impressoes>0?(c.investimento/c.impressoes*1000):null;
        const campId='mkcamp-'+(++_eidx);
        const dealsDaCampanha=dealsFB.filter(d=>matchDealCampanha(d,c.nome));
        const totalLeadsRD=dealsDaCampanha.length;
        const porFunilCamp={};
        dealsDaCampanha.forEach(d=>{const fid=d._pipeline_id||'outros';const fnome=d._pipeline_name||d.deal_pipeline?.name||'Outros';const est=d.deal_stage?.name||'Sem estágio';if(!porFunilCamp[fid])porFunilCamp[fid]={nome:fnome,estagios:{}};if(!porFunilCamp[fid].estagios[est])porFunilCamp[fid].estagios[est]=[];porFunilCamp[fid].estagios[est].push(d);});
        const funisOrdenados=Object.keys(porFunilCamp).sort((a,b)=>{const ia=ordemFunis.indexOf(a)===-1?99:ordemFunis.indexOf(a);const ib=ordemFunis.indexOf(b)===-1?99:ordemFunis.indexOf(b);return ia-ib;});
        let pipelineHtml='';
        if(funisOrdenados.length>0){
          pipelineHtml=funisOrdenados.map(fid=>{
            const funil=porFunilCamp[fid];const totalF=Object.values(funil.estagios).flat().length;const fidBody='mkfb-'+(++_eidx);
            const estagiosOrdenados=Object.keys(funil.estagios).sort((a,b)=>(a.toLowerCase().includes('perdid')?1:0)-(b.toLowerCase().includes('perdid')?1:0));
            const estagiosHtml=estagiosOrdenados.map(est=>{
              const leads=funil.estagios[est];const cor=corEstagio(est);const eid='mke-'+(++_eidx);
              const cards=leads.map(d=>{const di=diasAtras(d.updated_at||d.created_at);const urg=di>7?'urgente':di>=3?'atencao':'ok';return cardP({...d,di,urg},++_eidx);}).join('');
              return '<div style="border:1px solid var(--border);border-radius:8px;margin-bottom:6px;overflow:hidden;">'
                +'<div onclick="(function(el){var b=document.getElementById(\''+eid+'\');var op=b.style.display!==\'none\';b.style.display=op?\'none\':\'block\';el.querySelector(\'.mchv\').style.transform=op?\'\':\'rotate(180deg)\'})(this)" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;background:var(--branco);" onmouseover="this.style.background=\'var(--azul-pale)\'" onmouseout="this.style.background=\'var(--branco)\'">'
                +'<div style="width:9px;height:9px;border-radius:50%;background:'+cor+';flex-shrink:0;"></div>'
                +'<span style="font-size:12px;font-weight:600;color:var(--text);flex:1;">'+est+'</span>'
                +'<span style="font-size:11px;font-weight:700;color:'+cor+';background:'+cor+'18;padding:2px 10px;border-radius:20px;">'+leads.length+'</span>'
                +'<span class="mchv" style="font-size:10px;color:var(--text-muted);transition:transform .2s;">▼</span>'
                +'</div><div id="'+eid+'" style="display:none;border-top:1px solid var(--border);padding:10px;">'+cards+'</div></div>';
            }).join('');
            return '<div style="margin-bottom:8px;">'
              +'<div onclick="(function(el){var b=document.getElementById(\''+fidBody+'\');var op=b.style.display!==\'none\';b.style.display=op?\'none\':\'block\';el.querySelector(\'.mchv\').style.transform=op?\'\':\'rotate(180deg)\'})(this)" style="padding:10px 14px;background:var(--azul-claro);border-radius:8px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;">'
              +'<span style="font-size:12px;font-weight:600;color:var(--azul-escuro);">'+funil.nome+'</span>'
              +'<div style="display:flex;gap:8px;align-items:center;">'
              +'<span style="font-size:11px;font-weight:600;color:var(--azul-medio);background:var(--branco);padding:2px 10px;border-radius:20px;">'+totalF+' lead'+(totalF!==1?'s':'')+'</span>'
              +'<span class="mchv" style="font-size:10px;color:var(--text-muted);transition:transform .2s;">▼</span>'
              +'</div></div>'
              +'<div id="'+fidBody+'" style="display:none;padding:10px;">'+estagiosHtml+'</div></div>';
          }).join('');
        }else{pipelineHtml='<div style="padding:12px;text-align:center;font-size:12px;color:var(--text-muted);">Nenhum lead encontrado no RD para esta campanha.</div>';}
        return '<div style="background:var(--branco);border:1px solid var(--border);border-radius:12px;margin-bottom:10px;overflow:hidden;">'
          +'<div onclick="(function(el){var b=document.getElementById(\''+campId+'\');var op=b.style.display!==\'none\';b.style.display=op?\'none\':\'block\';el.querySelector(\'.mchv\').style.transform=op?\'\':\'rotate(180deg)\'})(this)" style="display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;transition:background .15s;" onmouseover="this.style.background=\'var(--azul-pale)\'" onmouseout="this.style.background=\'var(--branco)\'">'
          +'<span style="width:10px;height:10px;border-radius:50%;background:'+(c.status==='ACTIVE'?'#1D9E75':'#9e9e9e')+';flex-shrink:0;"></span>'
          +'<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+c.nome+'</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px;">'+(c.status==='ACTIVE'?'Ativa':'Pausada')+(c.inicio?' · '+c.inicio:'')+'</div></div>'
          +'<div style="display:flex;gap:12px;align-items:center;flex-shrink:0;">'
          +'<div style="text-align:right;"><div style="font-size:13px;font-weight:700;color:var(--azul-escuro);">'+fmtBRL(c.investimento)+'</div><div style="font-size:9px;color:var(--text-muted);">investido</div></div>'
          +'<div style="text-align:right;"><div style="font-size:13px;font-weight:700;color:'+(c.leads>0?'#1D9E75':'var(--text-muted)')+';">'+(c.leads||0)+'</div><div style="font-size:9px;color:var(--text-muted);">leads FB</div></div>'
          +'<div style="text-align:right;"><div style="font-size:13px;font-weight:700;color:var(--azul-escuro);">'+(c.cpl?fmtBRL(c.cpl):'-')+'</div><div style="font-size:9px;color:var(--text-muted);">CPL</div></div>'
          +'<div style="text-align:right;"><div style="font-size:13px;font-weight:700;color:#7C3AED;">'+(cpmC?fmtBRL(cpmC):'-')+'</div><div style="font-size:9px;color:var(--text-muted);">CPM</div></div>'
          +(totalLeadsRD>0?'<span style="font-size:10px;font-weight:700;color:var(--azul-medio);background:var(--azul-claro);padding:3px 10px;border-radius:20px;">'+totalLeadsRD+' no RD</span>':'')
          +'<span class="mchv" style="font-size:10px;color:var(--text-muted);transition:transform .2s;">▼</span>'
          +'</div></div>'
          +'<div id="'+campId+'" style="display:none;border-top:1px solid var(--border);padding:14px;">'+pipelineHtml+'</div></div>';
      }).join('');
    }else{tbBody.innerHTML='<div style="padding:16px;text-align:center;font-size:12px;color:var(--text-muted);">Nenhuma campanha com investimento no período.</div>';}
    document.getElementById('mk-tabela').style.display='block';
    mkLoading.style.display='none';
  }catch(e){
    document.getElementById('cards-fb').innerHTML=`<div class="empty" style="color:#791F1F;">Erro: ${e.message}</div>`;
    ['fb-investimento','fb-leads','fb-cpl','fb-alcance','fb-impressoes','fb-ctr','fb-cpc','fb-taxa-conv','fb-media-diaria'].forEach(id=>{document.getElementById(id).textContent='—';});
    document.getElementById('mk-loading').style.display='none';document.getElementById('mk-empty').style.display='block';document.getElementById('mk-empty').innerHTML=`<div style="color:#791F1F;">Erro: ${e.message}</div>`;
  }
}

// Mantém alias para exportações e funções legadas
function carregarFacebook(){carregarFBMkt();}
function carregarAnaliseMarketing(){carregarFBMkt();}
function limparFiltrosFB(){limparFiltrosFBMkt();}
function limparFiltrosMK(){limparFiltrosFBMkt();}

function cardAd(ad){
  const fmtNum=v=>v?Number(v).toLocaleString('pt-BR'):'-';
  const isAtivo=ad.status==='ACTIVE';
  const statusStyle=isAtivo?'background:#EAF3DE;color:#27500A;':'background:#f0f0f0;color:#6b6b6b;';
  const statusLabel=isAtivo?'✅ Ativo':'⏸ Pausado';
  const thumb=ad.criativo?.thumbnail?`<img src="${ad.criativo.thumbnail}" style="width:52px;height:52px;object-fit:cover;border-radius:6px;flex-shrink:0;border:1px solid var(--border);" onerror="this.style.display='none'">`:'<div style="width:52px;height:52px;border-radius:6px;background:var(--azul-pale);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🖼️</div>';
  const titulo=ad.criativo?.titulo||ad.nome||'Anúncio';
  const corpo=ad.criativo?.corpo?`<div style="font-size:10px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px;">${ad.criativo.corpo}</div>`:'';
  return `<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;background:var(--branco);">
  ${thumb}
  <div style="flex:1;min-width:0;">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
      <span style="font-size:11px;font-weight:600;color:var(--azul-escuro);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${titulo}</span>
      <span style="font-size:10px;padding:1px 7px;border-radius:20px;font-weight:600;flex-shrink:0;${statusStyle}">${statusLabel}</span>
    </div>
    ${corpo}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px;">
      <div style="background:var(--azul-pale);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">Investimento</div><div style="font-size:12px;font-weight:700;color:var(--azul-escuro);">${fmtBRL(ad.investimento)}</div></div>
      <div style="background:var(--azul-pale);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">Leads</div><div style="font-size:12px;font-weight:700;color:${ad.leads>0?'#1D9E75':'var(--azul-escuro)'};">${ad.leads||'0'}</div></div>
      <div style="background:var(--azul-pale);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">CPL</div><div style="font-size:12px;font-weight:700;color:var(--azul-escuro);">${ad.cpl?fmtBRL(ad.cpl):'-'}</div></div>
      <div style="background:var(--azul-pale);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">CTR</div><div style="font-size:12px;font-weight:700;color:var(--azul-escuro);">${ad.ctr?ad.ctr+'%':'-'}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px;">
      <div style="background:var(--azul-pale);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">Alcance</div><div style="font-size:11px;font-weight:600;color:var(--azul-escuro);">${fmtNum(ad.alcance)}</div></div>
      <div style="background:var(--azul-pale);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">Impressões</div><div style="font-size:11px;font-weight:600;color:var(--azul-escuro);">${fmtNum(ad.impressoes)}</div></div>
      <div style="background:var(--azul-pale);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">CPC</div><div style="font-size:11px;font-weight:600;color:var(--azul-escuro);">${ad.cpc?fmtBRL(ad.cpc):'-'}</div></div>
    </div>
  </div>
</div>`;
}

function secaoCreativos(ads){
  if(!ads)return'';
  const ativas=ads.ativas||[];const pausadas=ads.pausadas||[];
  if(!ativas.length&&!pausadas.length)return'';
  const totalAds=ativas.length+pausadas.length;
  const bodyId='ads-body-'+Math.random().toString(36).slice(2,8);
  let html='';
  if(ativas.length){
    html+=`<div style="font-size:10px;font-weight:700;color:#1D9E75;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px;display:flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#1D9E75;display:inline-block;"></span>Criativos ativos — ${ativas.length}</div>`;
    html+=ativas.map(a=>cardAd(a)).join('');
  }
  if(pausadas.length){
    html+=`<div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin:${ativas.length?'14px':'0'} 0 8px;display:flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#9e9e9e;display:inline-block;"></span>Criativos pausados — ${pausadas.length}</div>`;
    html+=pausadas.map(a=>cardAd(a)).join('');
  }
  return `<div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;">
  <div onclick="(function(el){var b=document.getElementById('${bodyId}');var op=b.style.display!=='none';b.style.display=op?'none':'block';el.querySelector('.ad-chev').style.transform=op?'':'rotate(180deg)'})(this)"
       style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;margin-bottom:8px;padding:8px 10px;background:var(--azul-pale);border-radius:8px;"
       onmouseover="this.style.background='var(--azul-claro)'" onmouseout="this.style.background='var(--azul-pale)'">
    <span style="font-size:12px;font-weight:700;color:var(--azul-escuro);">🎨 Criativos <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(${totalAds} anúncio${totalAds!==1?'s':''})</span></span>
    <span class="ad-chev" style="font-size:10px;color:var(--text-muted);transition:transform .2s;">▼</span>
  </div>
  <div id="${bodyId}" style="display:none;">${html}</div>
</div>`;
}

function cardFacebook(c,de,ate){
  const fmtNum=v=>v?Number(v).toLocaleString('pt-BR'):'-';
  const isAtiva=c.status==='ACTIVE';
  const statusStyle=isAtiva?'background:#EAF3DE;color:#27500A;':'background:#f0f0f0;color:#6b6b6b;';
  const statusLabel=isAtiva?'✅ Ativa':'⏸ Pausada';
  const cardBorder=isAtiva?'var(--azul-medio)':'#9e9e9e';
  const semDados=c.semDadosNoPeriodo?`<div style="font-size:11px;color:var(--text-muted);background:var(--azul-pale);padding:8px 10px;border-radius:6px;margin-bottom:10px;">Sem dados de veiculação no período.</div>`:'';
  const diasPeriodo=de&&ate?Math.max(1,Math.round((new Date(ate)-new Date(de))/864e5)+1):30;
  let orcamentoLabel='-';
  if(c.orcamento){orcamentoLabel=`R$ ${Number(c.orcamento.valor).toLocaleString('pt-BR',{minimumFractionDigits:2})}/${c.orcamento.tipo}`;if(c.orcamento.viaAdSet)orcamentoLabel+=` <span style="font-size:9px;color:var(--text-muted);">(via Ad Set)</span>`;}
  const periodo=c.inicio?`${c.inicio}${c.fim?' → '+c.fim:' → em andamento'}`:'—';
  const totalAds=((c.ads?.ativas||[]).length+(c.ads?.pausadas||[]).length);
  return `<div class="card" style="border-left:4px solid ${cardBorder};margin-bottom:8px;">
  <div class="card-head" onclick="toggle(this)">
    <div class="card-info">
      <div class="card-name" style="font-size:13px;">${c.nome}</div>
      <div class="card-sub" style="margin-top:3px;display:flex;gap:8px;flex-wrap:wrap;">
        <span style="font-size:10px;padding:2px 8px;border-radius:20px;font-weight:600;${statusStyle}">${statusLabel}</span>
        ${c.investimento>0?`<span style="font-size:11px;font-weight:600;color:var(--azul-escuro);">${fmtBRL(c.investimento)}</span>`:''}
        ${c.leads>0?`<span style="font-size:11px;color:#27500A;font-weight:600;">${c.leads} leads</span>`:''}
        ${totalAds>0?`<span style="font-size:10px;color:var(--text-muted);">🎨 ${totalAds} criativo${totalAds!==1?'s':''}</span>`:''}
      </div>
    </div>
    <span class="chev">▼</span>
  </div>
  <div class="card-body"><div class="cbi">
    ${semDados}
    <div class="three-col">
      <div class="ib"><div class="l">Investimento</div><div class="v">${fmtBRL(c.investimento)}</div></div>
      <div class="ib"><div class="l">Leads gerados</div><div class="v">${c.leads||'0'}</div></div>
      <div class="ib"><div class="l">CPL</div><div class="v">${fmtBRL(c.cpl)}</div></div>
    </div>
    <div class="three-col">
      <div class="ib"><div class="l">Alcance</div><div class="v">${fmtNum(c.alcance)}</div></div>
      <div class="ib"><div class="l">Impressões</div><div class="v">${fmtNum(c.impressoes)}</div></div>
      <div class="ib"><div class="l">Cliques</div><div class="v">${fmtNum(c.cliques)}</div></div>
    </div>
    <div class="three-col">
      <div class="ib"><div class="l">CTR</div><div class="v">${c.ctr?c.ctr+'%':'-'}</div></div>
      <div class="ib"><div class="l">CPC médio</div><div class="v">${fmtBRL(c.cpc)}</div></div>
      <div class="ib"><div class="l">Taxa de conversão</div><div class="v">${c.taxaConversao?c.taxaConversao+'%':'-'}</div></div>
    </div>
    <div class="two-col">
      <div class="ib"><div class="l">Orçamento</div><div class="v">${orcamentoLabel}</div></div>
      <div class="ib"><div class="l">Período da campanha</div><div class="v">${periodo}</div></div>
    </div>
    <div class="ib" style="margin-bottom:8px;"><div class="l">Média diária real</div><div class="v">${c.investimento&&diasPeriodo>0?fmtBRL(c.investimento/diasPeriodo)+'/dia':'-'}</div></div>
    ${secaoCreativos(c.ads)}
  </div></div>
</div>`;}

function abrirModalLeads(tipo){
  let deals=[],titulo='',corValor='';
  if(tipo==='vendido'){deals=_mkDealsVendidos;titulo='✅ Valor Vendido RD';corValor='#1D9E75';}
  else if(tipo==='perdido'){deals=_mkDealsPerdidos;titulo='❌ Valor Perdido RD';corValor='#E24B4A';}
  else{deals=_mkDealsAbertos;titulo='🔄 Valor em Aberto RD';corValor='var(--laranja)';}
  if(!deals||deals.length===0){document.getElementById('modal-leads-title').textContent=titulo;document.getElementById('modal-leads-subtitle').textContent=_mkPeriodoLabel||'';document.getElementById('modal-leads-summary').innerHTML='';document.getElementById('modal-leads-body').innerHTML='<div class="modal-leads-empty">Nenhum lead encontrado para este período.</div>';document.getElementById('modal-leads-total').innerHTML='<strong>0</strong> leads';document.getElementById('modal-leads-ov').classList.add('open');return;}
  const totalValor=deals.reduce((s,d)=>s+Number(d.amount_montly||0),0);
  document.getElementById('modal-leads-title').textContent=titulo;document.getElementById('modal-leads-subtitle').textContent=_mkPeriodoLabel||'';
  document.getElementById('modal-leads-summary').innerHTML=`<div class="modal-leads-summary-item"><strong style="color:${corValor};">${deals.length}</strong>Lead${deals.length!==1?'s':''}</div><div class="modal-leads-summary-item"><strong style="color:${corValor};">${totalValor>0?fmtBRL(totalValor):'R$ 0,00'}</strong>Valor total</div>`;
  const sorted=[...deals].sort((a,b)=>Number(b.amount_montly||0)-Number(a.amount_montly||0));
  document.getElementById('modal-leads-body').innerHTML=sorted.map(d=>{
    const dealId=d._id||d.id||'';const nm=d.name||'Negociação';const emp=(d.contacts||[])[0]?.organization_name||'';const val=Number(d.amount_montly||0);
    let avBg,avColor;
    if(tipo==='vendido'){avBg='#EAF3DE';avColor='#1D9E75';}else if(tipo==='perdido'){avBg='#FCEBEB';avColor='#E24B4A';}else{avBg='#FFF0E0';avColor='#a85000';}
    return `<div class="lead-row"><div class="lead-row-av" style="background:${avBg};color:${avColor};">${ini(nm)}</div><div class="lead-row-info"><div class="lead-row-name">${nm}</div><div class="lead-row-meta">${emp}</div></div><div class="lead-row-val" style="color:${corValor};">${val>0?fmtBRL(val):'<span style="color:var(--text-muted);font-size:11px;font-weight:400;">Sem valor</span>'}</div><div class="lead-row-actions">${dealId?`<a href="https://crm.rdstation.com/app/deals/${dealId}" target="_blank" class="lead-row-btn">Abrir no RD ↗</a>`:''}</div></div>`;
  }).join('');
  document.getElementById('modal-leads-total').innerHTML=`<strong>${deals.length}</strong> lead${deals.length!==1?'s':''} · Total: <strong style="color:${corValor};">${totalValor>0?fmtBRL(totalValor):'R$ 0,00'}</strong>`;
  document.getElementById('modal-leads-ov').classList.add('open');
}
function fecharModalLeads(e){if(e&&e.target!==document.getElementById('modal-leads-ov'))return;document.getElementById('modal-leads-ov').classList.remove('open');}

// ── EXPORTAÇÕES ───────────────────────────────────────────
function exportarPDFFacebook(){
  if(!_fbDadosAtual){alert('Busque os dados primeiro.');return;}
  const d=_fbDadosAtual;
  const fmtNum=v=>v!=null?Number(v).toLocaleString('pt-BR'):'-';
  const de=document.getElementById('fb-de')?.value||'';const ate=document.getElementById('fb-ate')?.value||'';
  const periodo=de&&ate?`${new Date(de+'T12:00:00').toLocaleDateString('pt-BR')} a ${new Date(ate+'T12:00:00').toLocaleDateString('pt-BR')}`:'—';
  const agora=new Date().toLocaleString('pt-BR');
  const totais=d.totais||{};const conta=d.conta||{};const ativas=d.ativas||[];const pausadas=d.pausadas||[];
  const pct=conta.saldoInicial>0?Math.min(Math.round((conta.investidoPeriodo/conta.saldoInicial)*100),100):0;
  const barColor=pct>=90?'#E24B4A':pct>=70?'#FF8E2A':'#1D9E75';const negSaldo=(conta.saldoFinal||0)<0;
  const css=`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#1a1a2e;background:#fff;padding:0;}.page{width:210mm;min-height:297mm;padding:16mm 18mm;background:#fff;}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #152c6b;padding-bottom:12px;margin-bottom:20px;}.logo-area h1{font-size:22px;font-weight:800;color:#152c6b;letter-spacing:.04em;line-height:1;}.logo-area p{font-size:10px;color:#5a6e99;margin-top:3px;}.header-right{text-align:right;font-size:10px;color:#5a6e99;}.header-right strong{display:block;font-size:13px;color:#152c6b;margin-bottom:2px;}.section-title{font-size:10px;font-weight:700;color:#5a6e99;text-transform:uppercase;letter-spacing:.08em;margin:18px 0 8px;padding-bottom:4px;border-bottom:1px solid #d6e0f0;}.cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px;}.card{background:#f0f4fb;border-radius:8px;padding:10px 12px;border-top:3px solid #285199;}.card.verde{border-top-color:#1D9E75;}.card.laranja{border-top-color:#FF8E2A;}.card .lbl{font-size:9px;color:#5a6e99;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}.card .val{font-size:18px;font-weight:700;color:#152c6b;}.saldo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px;}.saldo-card{border-radius:8px;padding:10px 12px;border-top:3px solid #285199;}.saldo-card.ini{background:#e8eef8;border-top-color:#285199;}.saldo-card.inv{background:#fff0e0;border-top-color:#FF8E2A;}.saldo-card.fin{background:#eaf3de;border-top-color:#1D9E75;}.saldo-card.fin-neg{background:#fcebeb;border-top-color:#E24B4A;}.saldo-card .lbl{font-size:9px;color:#5a6e99;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}.saldo-card .val{font-size:17px;font-weight:700;color:#152c6b;}.saldo-card .sub{font-size:9px;color:#5a6e99;margin-top:2px;}.progress-wrap{background:#f0f4fb;border-radius:8px;padding:10px 14px;margin-bottom:16px;}.progress-label{display:flex;justify-content:space-between;font-size:10px;color:#5a6e99;margin-bottom:6px;}.progress-track{height:8px;background:#d6e0f0;border-radius:99px;overflow:hidden;}.progress-fill{height:100%;border-radius:99px;}table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:10px;}thead tr{background:#152c6b;color:#fff;}thead th{padding:7px 10px;text-align:left;font-weight:600;font-size:9px;text-transform:uppercase;letter-spacing:.05em;}thead th:not(:first-child){text-align:right;}tbody tr{border-bottom:1px solid #e8eef8;}tbody tr:nth-child(even){background:#f8fafc;}tbody td{padding:7px 10px;color:#152c6b;}tbody td:not(:first-child){text-align:right;}.badge-ativa{display:inline-block;background:#eaf3de;color:#27500A;border-radius:20px;padding:1px 7px;font-size:9px;font-weight:700;}.badge-pausada{display:inline-block;background:#f0f0f0;color:#6b6b6b;border-radius:20px;padding:1px 7px;font-size:9px;font-weight:700;}.footer{margin-top:24px;padding-top:10px;border-top:1px solid #d6e0f0;display:flex;justify-content:space-between;font-size:9px;color:#5a6e99;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}`;
  const ativasRows=ativas.map(c=>`<tr><td><strong>${c.nome}</strong> <span class="badge-ativa">Ativa</span></td><td>${fmtBRL(c.investimento)}</td><td>${c.leads||0}</td><td>${c.cpl?fmtBRL(c.cpl):'-'}</td><td>${c.ctr?c.ctr+'%':'-'}</td><td>${c.cpc?fmtBRL(c.cpc):'-'}</td><td>${c.taxaConversao?c.taxaConversao+'%':'-'}</td></tr>`).join('');
  const pausadasRows=pausadas.filter(c=>c.investimento>0).map(c=>`<tr><td><strong>${c.nome}</strong> <span class="badge-pausada">Pausada</span></td><td>${fmtBRL(c.investimento)}</td><td>${c.leads||0}</td><td>${c.cpl?fmtBRL(c.cpl):'-'}</td><td>${c.ctr?c.ctr+'%':'-'}</td><td>${c.cpc?fmtBRL(c.cpc):'-'}</td><td>${c.taxaConversao?c.taxaConversao+'%':'-'}</td></tr>`).join('');
  const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório Facebook Ads — Outtax</title><style>${css}</style></head><body><div class="page"><div class="header"><div class="logo-area"><h1>OUTTAX</h1><p>Dashboard de Marketing</p></div><div class="header-right"><strong>Relatório — Facebook Ads & Marketing</strong><span>Período: ${periodo}</span><br><span>Gerado em: ${agora}</span></div></div><div class="section-title">Saldo da conta Facebook Ads</div><div class="saldo-grid"><div class="saldo-card ini"><div class="lbl">Saldo inicial</div><div class="val">${fmtBRL(conta.saldoInicial)}</div></div><div class="saldo-card inv"><div class="lbl">Total investido</div><div class="val">${fmtBRL(conta.investidoPeriodo)}</div></div><div class="saldo-card ${negSaldo?'fin-neg':'fin'}"><div class="lbl">Saldo final</div><div class="val">${fmtBRL(conta.saldoFinal)}</div></div></div><div class="progress-wrap"><div class="progress-label"><span>Consumo do orçamento</span><span style="font-weight:700;color:${barColor}">${pct}% consumido</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${barColor}"></div></div></div><div class="section-title">Métricas do período</div><div class="cards-grid"><div class="card"><div class="lbl">Investimento</div><div class="val">${fmtBRL(totais.investimento)}</div></div><div class="card verde"><div class="lbl">Leads gerados</div><div class="val">${fmtNum(totais.leads)}</div></div><div class="card"><div class="lbl">CPL médio</div><div class="val">${totais.cpl?fmtBRL(totais.cpl):'-'}</div></div></div><div class="cards-grid"><div class="card"><div class="lbl">Alcance</div><div class="val">${fmtNum(totais.alcance)}</div></div><div class="card"><div class="lbl">Impressões</div><div class="val">${fmtNum(totais.impressoes)}</div></div><div class="card"><div class="lbl">CTR</div><div class="val">${totais.ctr?Number(totais.ctr).toFixed(2)+'%':'-'}</div></div></div><div class="cards-grid"><div class="card laranja"><div class="lbl">CPC médio</div><div class="val">${totais.cliques&&totais.investimento?fmtBRL(totais.investimento/totais.cliques):'-'}</div></div><div class="card laranja"><div class="lbl">Taxa de conversão</div><div class="val">${totais.taxaConversao?totais.taxaConversao+'%':'-'}</div></div><div class="card"><div class="lbl">Média diária</div><div class="val">${totais.mediaDiaria?fmtBRL(totais.mediaDiaria)+'/dia':'-'}</div></div></div>${ativas.length?`<div class="section-title">Campanhas ativas (${ativas.length})</div><table><thead><tr><th>Campanha</th><th>Investimento</th><th>Leads</th><th>CPL</th><th>CTR</th><th>CPC</th><th>Conv.</th></tr></thead><tbody>${ativasRows}</tbody></table>`:''}${pausadasRows?`<div class="section-title">Campanhas pausadas com gasto</div><table><thead><tr><th>Campanha</th><th>Investimento</th><th>Leads</th><th>CPL</th><th>CTR</th><th>CPC</th><th>Conv.</th></tr></thead><tbody>${pausadasRows}</tbody></table>`:''}<div class="footer"><span>Outtax Dashboard</span><span>Fonte: API Graph Facebook Ads v19.0</span><span>${agora}</span></div></div></body></html>`;
  const win=window.open('','_blank','width=900,height=700');win.document.write(html);win.document.close();win.focus();setTimeout(()=>{win.print();},600);
}

function exportarTXTFacebook(){
  if(!_fbDadosAtual){alert('Busque os dados primeiro.');return;}
  const d=_fbDadosAtual;const fmtNum=v=>v!=null?Number(v).toLocaleString('pt-BR'):'-';
  const de=document.getElementById('fb-de')?.value||'';const ate=document.getElementById('fb-ate')?.value||'';
  const periodo=de&&ate?`${new Date(de+'T12:00:00').toLocaleDateString('pt-BR')} a ${new Date(ate+'T12:00:00').toLocaleDateString('pt-BR')}`:'—';
  const totais=d.totais||{};const conta=d.conta||{};const ativas=d.ativas||[];const pausadas=d.pausadas||[];
  const pct=conta.saldoInicial>0?Math.min(Math.round((conta.investidoPeriodo/conta.saldoInicial)*100),100):0;
  const linha='='.repeat(62);const sublinha='-'.repeat(62);
  let t='';t+=linha+'\n';t+='  OUTTAX — RELATÓRIO FACEBOOK ADS & MARKETING\n';t+=`  Período: ${periodo}\n`;t+=`  Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;t+=linha+'\n\n';
  t+='SALDO DA CONTA\n'+sublinha+'\n';t+=`Saldo inicial : ${fmtBRL(conta.saldoInicial)}\n`;t+=`Total investido: ${fmtBRL(conta.investidoPeriodo)}\n`;t+=`Saldo final   : ${fmtBRL(conta.saldoFinal)}\n`;t+=`Consumo       : ${pct}%\n\n`;
  t+='MÉTRICAS\n'+sublinha+'\n';t+=`Investimento  : ${fmtBRL(totais.investimento)}\n`;t+=`Leads         : ${fmtNum(totais.leads)}\n`;t+=`CPL médio     : ${totais.cpl?fmtBRL(totais.cpl):'-'}\n`;t+=`Alcance       : ${fmtNum(totais.alcance)}\n`;t+=`Impressões    : ${fmtNum(totais.impressoes)}\n`;t+=`CTR           : ${totais.ctr?Number(totais.ctr).toFixed(2)+'%':'-'}\n`;t+=`CPC médio     : ${totais.cliques&&totais.investimento?fmtBRL(totais.investimento/totais.cliques):'-'}\n`;t+=`Média diária  : ${totais.mediaDiaria?fmtBRL(totais.mediaDiaria)+'/dia':'-'}\n\n`;
  if(ativas.length){t+=`CAMPANHAS ATIVAS (${ativas.length})\n`+sublinha+'\n';ativas.forEach((c,i)=>{t+=`${i+1}. ${c.nome}\n   Investimento: ${fmtBRL(c.investimento)} | Leads: ${c.leads||0} | CPL: ${c.cpl?fmtBRL(c.cpl):'-'}\n\n`;});}
  const pausadasComGasto=pausadas.filter(c=>c.investimento>0);
  if(pausadasComGasto.length){t+=`CAMPANHAS PAUSADAS COM GASTO (${pausadasComGasto.length})\n`+sublinha+'\n';pausadasComGasto.forEach((c,i)=>{t+=`${i+1}. ${c.nome}\n   Investimento: ${fmtBRL(c.investimento)} | Leads: ${c.leads||0}\n\n`;});}
  t+=linha+'\n';t+=`Fonte: API Graph Facebook Ads v19.0\n`;t+=linha+'\n';
  const blob=new Blob([t],{type:'text/plain;charset=utf-8'});
  const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`outtax_facebook_ads_${de||'relatorio'}.txt`});a.click();URL.revokeObjectURL(a.href);
}

function exportarXLSFacebook(){
  if(!_fbDadosAtual){alert('Busque os dados primeiro.');return;}
  if(typeof XLSX==='undefined'){alert('Biblioteca XLSX não carregada.');return;}
  const d=_fbDadosAtual;const de=document.getElementById('fb-de')?.value||'';const ate=document.getElementById('fb-ate')?.value||'';
  const totais=d.totais||{};const conta=d.conta||{};const ativas=d.ativas||[];const pausadas=d.pausadas||[];
  const pct=conta.saldoInicial>0?Math.min(Math.round((conta.investidoPeriodo/conta.saldoInicial)*100),100):0;
  const periodo=de&&ate?`${new Date(de+'T12:00:00').toLocaleDateString('pt-BR')} a ${new Date(ate+'T12:00:00').toLocaleDateString('pt-BR')}`:'';
  const wb=XLSX.utils.book_new();
  const wsResumo=XLSX.utils.aoa_to_sheet([['OUTTAX — Relatório Facebook Ads & Marketing'],['Período:',periodo],['Gerado em:',new Date().toLocaleString('pt-BR')],[],['SALDO DA CONTA'],['Campo','Valor'],['Saldo inicial (R$)',conta.saldoInicial||0],['Total investido (R$)',conta.investidoPeriodo||0],['Saldo final (R$)',conta.saldoFinal||0],['Consumo (%)',pct],[],['MÉTRICAS'],['Campo','Valor'],['Investimento total (R$)',totais.investimento||0],['Leads gerados',totais.leads||0],['CPL médio (R$)',totais.cpl||0],['Alcance',totais.alcance||0],['Impressões',totais.impressoes||0],['CTR (%)',totais.ctr?Number(totais.ctr):0],['CPC médio (R$)',totais.cliques&&totais.investimento?(totais.investimento/totais.cliques):0],['Taxa de conversão (%)',totais.taxaConversao||0],['Média diária (R$)',totais.mediaDiaria||0]]);
  wsResumo['!cols']=[{wch:36},{wch:22}];XLSX.utils.book_append_sheet(wb,wsResumo,'Resumo');
  const headerCamps=['Campanha','Status','Investimento (R$)','Leads','CPL (R$)','CTR (%)','CPC (R$)','Conv. (%)','Alcance','Impressões'];
  const rowsAtivas=ativas.map(c=>[c.nome,'Ativa',c.investimento||0,c.leads||0,c.cpl||0,c.ctr?Number(c.ctr):0,c.cpc?Number(c.cpc):0,c.taxaConversao||0,c.alcance||0,c.impressoes||0]);
  const rowsPausadas=pausadas.map(c=>[c.nome,'Pausada',c.investimento||0,c.leads||0,c.cpl||0,c.ctr?Number(c.ctr):0,c.cpc?Number(c.cpc):0,c.taxaConversao||0,c.alcance||0,c.impressoes||0]);
  const wsCamps=XLSX.utils.aoa_to_sheet([headerCamps,...rowsAtivas,...rowsPausadas]);
  wsCamps['!cols']=[{wch:46},{wch:10},{wch:18},{wch:8},{wch:12},{wch:8},{wch:10},{wch:10},{wch:12},{wch:12}];
  XLSX.utils.book_append_sheet(wb,wsCamps,'Campanhas');
  XLSX.writeFile(wb,`outtax_facebook_ads_${de||'relatorio'}.xlsx`);
}

// ── TRANSCRIÇÕES ──────────────────────────────────────────
let _trLLMAtiva='chatgpt';
const _trLLMUrls={chatgpt:'https://chat.openai.com/',gemini:'https://gemini.google.com/',claude:'https://claude.ai/'};
let _trConteudoAtual='';let _trTituloAtual='';
function limparFiltrosTR(){document.getElementById('tr-de').value='';document.getElementById('tr-ate').value='';}
async function carregarTranscricoes(){
  const cfg=getCfg();const de=document.getElementById('tr-de').value;const ate=document.getElementById('tr-ate').value;const cards=document.getElementById('cards-tr');
  if(!cfg.googleToken){cards.innerHTML='<div class="empty">Conecte o Google Agenda nas configurações.</div>';return;}
  cards.innerHTML=load('Buscando transcrições...');
  try{
    const qs=new URLSearchParams();if(de)qs.set('de',de);if(ate)qs.set('ate',ate);
    const r=await fetch('/api/transcricoes?'+qs.toString(),{headers:{'X-Session-Token':getSessionToken(),'X-Google-Token':cfg.googleToken||'','X-Google-Refresh-Token':cfg.googleRefreshToken||''}});
    const data=await r.json();
    if(data.newAccessToken){const c=getCfg();c.googleToken=data.newAccessToken;localStorage.setItem('otx_cfg',JSON.stringify(c));}
    if(!r.ok)throw new Error(data.erro||'Erro ao buscar transcrições');
    const arquivos=data.arquivos||[];
    cards.innerHTML=arquivos.length?arquivos.map(a=>cardTranscricao(a)).join(''):'<div class="empty">Nenhuma transcrição encontrada no período.</div>';
    const adminWrap=document.getElementById('tr-admin-wrap');
    if(getCfg().isAdmin){adminWrap.style.display='block';await carregarTranscricoesAdmin(de,ate);}else{adminWrap.style.display='none';}
  }catch(e){cards.innerHTML=`<div class="empty" style="color:#791F1F;">Erro: ${e.message}</div>`;}
}
async function carregarTranscricoesAdmin(de,ate){
  const cfg=getCfg();const adminCards=document.getElementById('cards-tr-admin');adminCards.innerHTML=load('Carregando todas as transcrições...');
  try{
    const qs=new URLSearchParams({admin:'1'});if(de)qs.set('de',de);if(ate)qs.set('ate',ate);
    const r=await fetch('/api/transcricoes?'+qs.toString(),{headers:{'X-Session-Token':getSessionToken(),'X-Google-Token':cfg.googleToken||'','X-Google-Refresh-Token':cfg.googleRefreshToken||''}});
    const data=await r.json();
    if(data.newAccessToken){const c=getCfg();c.googleToken=data.newAccessToken;localStorage.setItem('otx_cfg',JSON.stringify(c));}
    if(!r.ok)throw new Error(data.erro||'Erro na visão admin');
    const usuarios=data.usuarios||[];
    if(!usuarios.length){adminCards.innerHTML='<div class="empty">Nenhum usuário encontrado.</div>';return;}
    adminCards.innerHTML=usuarios.map((u,idx)=>{
      const bodyId='tr-admin-u-'+idx;const total=u.total||0;const rows=(u.arquivos||[]).map(a=>cardTranscricao(a,true)).join('');
      return `<div style="background:var(--branco);border:1px solid var(--border);border-radius:12px;margin-bottom:10px;overflow:hidden;"><div onclick="(function(el){var b=document.getElementById('${bodyId}');var op=b.style.display!=='none';b.style.display=op?'none':'block';el.querySelector('.tr-chev').style.transform=op?'':'rotate(180deg)'})(this)" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;cursor:pointer;background:var(--azul-pale);" onmouseover="this.style.background='var(--azul-claro)'" onmouseout="this.style.background='var(--azul-pale)'"><div style="display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;border-radius:50%;background:var(--azul-medio);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${(u.usuario||'?').slice(0,2).toUpperCase()}</div><div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">${u.usuario}</div><div style="font-size:11px;color:var(--text-muted);">${total} transcrição${total!==1?'ões':''}</div></div></div><span class="tr-chev" style="font-size:10px;color:var(--text-muted);transition:transform .2s;">▼</span></div><div id="${bodyId}" style="display:none;padding:12px;">${rows||'<div class="empty" style="padding:1rem;">Nenhuma transcrição no período.</div>'}</div></div>`;
    }).join('');
  }catch(e){document.getElementById('cards-tr-admin').innerHTML=`<div class="empty" style="color:#791F1F;">Erro: ${e.message}</div>`;}
}
function cardTranscricao(a,isAdmin=false){
  return `<div class="card" style="margin-bottom:8px;border-left:4px solid var(--azul-medio);"><div style="display:flex;align-items:center;gap:12px;padding:13px 16px;"><div style="width:36px;height:36px;border-radius:50%;background:var(--azul-claro);color:var(--azul-escuro);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">🎙️</div><div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.titulo||a.nome}</div><div style="font-size:11px;color:var(--text-muted);margin-top:2px;">📅 ${a.data}${isAdmin&&a.usuario?' · 👤 '+a.usuario:''}</div>${a.participantes?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">👥 '+a.participantes+'</div>':''}</div><div style="display:flex;gap:6px;flex-shrink:0;"><button class="btn" style="padding:5px 12px;font-size:11px;" onclick="verTranscricao('${a.id}','${(a.titulo||a.nome).replace(/'/g,"\\'")}','${a.data}')">👁 Ver</button><button class="btn" style="padding:5px 10px;font-size:11px;border-color:#E24B4A;color:#E24B4A;" onclick="excluirTranscricao('${a.id}',this)">🗑</button></div></div></div>`;
}
async function verTranscricao(fileId,titulo,data){
  const cfg=getCfg();_trTituloAtual=titulo;
  document.getElementById('ver-tr-titulo').textContent=titulo;document.getElementById('ver-tr-meta').textContent='📅 '+data;document.getElementById('ver-tr-conteudo').textContent='';document.getElementById('ver-tr-loading').style.display='flex';document.getElementById('m-ver-tr').classList.add('open');
  try{
    const r=await fetch('/api/transcricoes?id='+fileId,{headers:{'X-Session-Token':getSessionToken(),'X-Google-Token':cfg.googleToken||'','X-Google-Refresh-Token':cfg.googleRefreshToken||''}});
    const data2=await r.json();if(!r.ok)throw new Error(data2.erro||'Erro ao carregar');
    _trConteudoAtual=data2.conteudo||'';document.getElementById('ver-tr-conteudo').textContent=_trConteudoAtual;
  }catch(e){document.getElementById('ver-tr-conteudo').textContent='Erro: '+e.message;}
  finally{document.getElementById('ver-tr-loading').style.display='none';}
}
function fecharModalVerTR(e){if(e&&e.target!==document.getElementById('m-ver-tr'))return;document.getElementById('m-ver-tr').classList.remove('open');}
function baixarTranscricao(){if(!_trConteudoAtual)return;const blob=new Blob([_trConteudoAtual],{type:'text/plain;charset=utf-8'});const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:(_trTituloAtual||'transcricao').replace(/[^a-z0-9]/gi,'-').toLowerCase()+'.txt'});a.click();URL.revokeObjectURL(a.href);}
function copiarTranscricao(){
  if(!_trConteudoAtual){alert('Nenhuma transcrição carregada.');return;}
  navigator.clipboard.writeText(_trConteudoAtual).then(()=>{const btn=document.querySelector('#m-ver-tr .btn[onclick="copiarTranscricao()"]');if(btn){const orig=btn.textContent;btn.textContent='✓ Copiado!';btn.style.color='#1D9E75';setTimeout(()=>{btn.textContent=orig;btn.style.color='';},2000);}}).catch(()=>{const ta=document.createElement('textarea');ta.value=_trConteudoAtual;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);alert('Texto copiado!');});
}
function abrirResumoIATranscricao(){const painel=document.getElementById('ver-tr-llm');painel.style.display=painel.style.display==='none'?'block':'none';}
function selecionarLLMTR(llm,el){_trLLMAtiva=llm;document.querySelectorAll('#m-nova-tr .llm-btn').forEach(b=>b.classList.remove('ativo'));el.classList.add('ativo');}
function selecionarLLMTRVer(llm,el){_trLLMAtiva=llm;document.querySelectorAll('#ver-tr-llm .llm-btn').forEach(b=>b.classList.remove('ativo'));el.classList.add('ativo');}
function copiarPromptTR(){
  const prompt=`Você é um assistente especialista em reuniões corporativas.\nGere um resumo executivo completo e estruturado da transcrição abaixo em português brasileiro.\n\nFormate com estas seções:\n## Resumo Executivo\n**Reunião:** [título]\n**Data:** [data de hoje]\n**Participantes:** [liste os participantes]\n\n### 📋 Pontos Discutidos\n[liste os principais temas]\n\n### ✅ Decisões Tomadas\n[liste as decisões]\n\n### 🎯 Próximas Ações\n[liste as tarefas e responsáveis]\n\n### 📌 Observações Importantes\n[outras informações relevantes]\n\n---\nTRANSCRIÇÃO DA REUNIÃO:\n[Cole aqui a transcrição]`;
  navigator.clipboard.writeText(prompt).then(()=>{const badge=document.getElementById('tr-badge-copiado');badge.style.opacity='1';setTimeout(()=>badge.style.opacity='0',2500);setTimeout(()=>window.open(_trLLMUrls[_trLLMAtiva]||'https://chat.openai.com/','_blank'),300);});
}
function copiarEAbrirIATR(){
  if(!_trConteudoAtual){alert('Nenhuma transcrição carregada.');return;}
  const prompt='Gere um resumo executivo detalhado da seguinte transcrição de reunião:\n\n'+_trConteudoAtual;
  navigator.clipboard.writeText(prompt).then(()=>{window.open(_trLLMUrls[_trLLMAtiva]||'https://chat.openai.com/','_blank');}).catch(()=>{window.open(_trLLMUrls[_trLLMAtiva]||'https://chat.openai.com/','_blank');});
}
async function excluirTranscricao(fileId,btn){
  if(!confirm('Excluir esta transcrição? Esta ação não pode ser desfeita.'))return;
  const cfg=getCfg();btn.textContent='⏳';btn.disabled=true;
  try{const r=await fetch('/api/transcricoes?id='+fileId,{method:'DELETE',headers:{'X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken(),'X-Google-Token':cfg.googleToken||'','X-Google-Refresh-Token':cfg.googleRefreshToken||''}});const data=await r.json();if(!r.ok)throw new Error(data.erro||'Erro ao excluir');btn.closest('.card')?.remove();}
  catch(e){alert('Erro ao excluir: '+e.message);btn.textContent='🗑';btn.disabled=false;}
}
function abrirModalNovaTranscricao(){
  const cfg=getCfg();if(!cfg.googleToken){alert('Conecte o Google Agenda nas configurações antes de salvar transcrições.');return;}
  document.getElementById('tr-titulo').value='';document.getElementById('tr-participantes').value='';document.getElementById('tr-conteudo').value='';document.getElementById('tr-erro').style.display='none';document.getElementById('m-nova-tr').classList.add('open');
}
function fecharModalNovaTranscricao(e){if(e&&e.target!==document.getElementById('m-nova-tr'))return;document.getElementById('m-nova-tr').classList.remove('open');}
async function salvarTranscricao(btn){
  const cfg=getCfg();const titulo=document.getElementById('tr-titulo').value.trim();const participantes=document.getElementById('tr-participantes').value.trim();const conteudo=document.getElementById('tr-conteudo').value.trim();const erroEl=document.getElementById('tr-erro');erroEl.style.display='none';
  if(!titulo){erroEl.textContent='Informe o título da reunião.';erroEl.style.display='block';return;}
  if(!conteudo){erroEl.textContent='Cole o resumo gerado pela IA.';erroEl.style.display='block';return;}
  btn.textContent='⏳ Salvando...';btn.disabled=true;
  try{
    const r=await fetch('/api/transcricoes',{method:'POST',headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken(),'X-Google-Token':cfg.googleToken||'','X-Google-Refresh-Token':cfg.googleRefreshToken||''},body:JSON.stringify({titulo,participantes,conteudo})});
    const data=await r.json();if(!r.ok)throw new Error(data.erro||'Erro ao salvar');fecharModalNovaTranscricao();alert('✅ Transcrição salva com sucesso no Google Drive!');await carregarTranscricoes();
  }catch(e){erroEl.textContent='Erro: '+e.message;erroEl.style.display='block';}
  finally{btn.textContent='💾 Salvar no Drive';btn.disabled=false;}
}

// ── REUNIÕES ──────────────────────────────────────────────
function limparFiltrosReunioes(){document.getElementById('r-de').value='';document.getElementById('r-ate').value='';}
async function carregarReunioes(){
  const cfg=getCfg();if(!cfg.googleToken){document.getElementById('cards-r').innerHTML='<div class="empty">Conecte o Google Agenda nas configurações.</div>';return;}
  const de=document.getElementById('r-de').value;const ate=document.getElementById('r-ate').value;if(!de||!ate){alert('Selecione o período.');return;}
  document.getElementById('cards-r').innerHTML=load('Buscando reuniões...');
  try{
    const timeMin=new Date(de+'T00:00:00').toISOString();const timeMax=new Date(ate+'T23:59:59').toISOString();
    const r=await fetch(`/api/google-calendar?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`,{headers:{'X-Session-Token':getSessionToken(),'X-Google-Token':cfg.googleToken,'X-Google-Refresh-Token':cfg.googleRefreshToken||''}});
    const data=await r.json();if(!r.ok)throw new Error(data.erro||'Erro ao buscar agenda');
    if(data.newAccessToken){const c=getCfg();c.googleToken=data.newAccessToken;localStorage.setItem(K,JSON.stringify(c));}
    const eventos=data.eventos||[];
    if(!eventos.length){document.getElementById('cards-r').innerHTML='<div class="empty">Nenhuma reunião encontrada no período.</div>';return;}
    document.getElementById('cards-r').innerHTML=eventos.map((ev,i)=>cardReuniao(ev,i)).join('');
  }catch(e){document.getElementById('cards-r').innerHTML=`<div class="empty" style="color:#791F1F;">Erro: ${e.message}</div>`;}
}
function cardReuniao(ev,i){
  const nm=ev.nome||ev.summary||'Reunião';const hora=ev.hora||'';const dataEvt=ev._data||'';
  const dtFmt=dataEvt?new Date(dataEvt+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'}):'';
  const email=ev.email||'';const origem=ev.origem||'marketing';const meet=ev._link||ev.hangoutLink||ev.location||'';const dur=ev.dur||'1h';
  const orgClass=origem==='marketing'?'av-marketing':'av-direto';const cardClass=origem==='marketing'?'marketing':'direto';const idCard='ev-'+i;
  return `<div class="card ${cardClass}" style="margin-bottom:8px;"><div class="card-head" onclick="toggle(this)"><div class="av ${orgClass}">${ini(nm)}</div><div class="card-info"><div class="card-name">${nm}</div><div class="card-sub">${dtFmt} ${hora} · ${dur}${email?' · '+email:''}</div></div><span class="chev">▼</span></div><div class="card-body"><div class="cbi"><div class="three-col"><div class="ib"><div class="l">Data</div><div class="v">${dtFmt}</div></div><div class="ib"><div class="l">Horário</div><div class="v">${hora}</div></div><div class="ib"><div class="l">Duração</div><div class="v">${dur}</div></div></div><div class="two-col"><div class="ib"><div class="l">Email do cliente</div><div class="v">${email||'—'}</div></div><div class="ib"><div class="l">Organizador</div><div class="v">${ev.org||'—'}</div></div></div><div class="orig-bar"><div class="orig-dot ${origem}"></div><span>${origem==='marketing'?'Lead de Marketing':'Indicação / Direto'}</span></div>${meet?`<div class="act-row" style="margin-bottom:12px;"><a href="${meet}" target="_blank" class="btn btn-p">🎥 Entrar na reunião ↗</a></div>`:''}${email?`<div style="border-top:1px solid var(--border);padding-top:12px;margin-top:4px;"><div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Negociação no RD CRM</div><div id="rd-result-${idCard}"><button class="btn btn-p" style="font-size:11px;" onclick="buscarLeadPorEmail('${email}','${idCard}',this)">🔍 Buscar lead no RD</button></div></div>`:''}</div></div></div>`;
}
async function buscarLeadPorEmail(email,idCard,btn){
  const container=document.getElementById('rd-result-'+idCard);container.innerHTML=load('Buscando no RD CRM...');
  try{
    const dominiosInternos=['outtax.com.br','outtax.com'];const emailLow=(email||'').toLowerCase();const isInterno=email&&dominiosInternos.some(d=>emailLow.endsWith('@'+d)||emailLow.endsWith('.'+d));
    let deal=null;
    if(email&&!isInterno){const cd=await crmFetch('contacts',{email:email});const contato=(cd.contacts||[])[0];if(contato){const dealRef=(contato.deals||[])[0];if(dealRef){const dealId=dealRef._id||dealRef.id||'';const dd=await crmFetch('deals/'+dealId,{});deal=dd||null;}}}
    if(!deal){container.innerHTML=`<div style="font-size:12px;color:var(--text-muted);background:var(--azul-pale);padding:10px 12px;border-radius:8px;">Lead não encontrada no RD.</div>`;return;}
    const dealId=deal._id||deal.id||'';const dealNome=deal.name||'Negociação';const funil=deal.deal_pipeline?.name||deal._pipeline_name||'—';const estagio=deal.deal_stage?.name||'—';const empresa=(deal.contacts||[])[0]?.organization_name||'—';const di=diasAtras(deal.updated_at||deal.created_at);
    window['_dealReuniao_'+idCard]=deal;
    container.innerHTML=`<div style="background:var(--azul-pale);border-radius:8px;padding:12px 14px;margin-bottom:10px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div><div style="font-size:13px;font-weight:600;color:var(--azul-escuro);">${dealNome}</div><div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${empresa}</div></div><a href="https://crm.rdstation.com/app/deals/${dealId}" target="_blank" class="btn btn-p" style="font-size:11px;padding:5px 12px;flex-shrink:0;">Abrir no RD ↗</a></div><div class="two-col" style="margin-bottom:8px;"><div class="ib"><div class="l">Funil</div><div class="v">${funil}</div></div><div class="ib"><div class="l">Estágio</div><div class="v">${estagio}</div></div></div><div class="two-col" style="margin-bottom:10px;"><div class="ib"><div class="l">Última atualização</div><div class="v">${di===0?'Hoje':di===1?'1 dia':di+' dias atrás'}</div></div><div class="ib"><div class="l">Responsável</div><div class="v">${deal.user?.name||'—'}</div></div></div><div style="border-top:1px solid var(--border);padding-top:10px;"><div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Consulta CNPJ + Análise Tributária</div><div style="display:flex;gap:8px;margin-bottom:8px;"><input type="text" id="cnpj-reuniao-${idCard}" placeholder="00.000.000/0000-00" maxlength="18" oninput="this.value=fc(this.value)" onkeydown="if(event.key==='Enter')consultarCnpjReuniao('${idCard}','${dealId}','${dealNome}','${funil}','${estagio}')" style="flex:1;padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;"><button class="btn btn-p" style="font-size:11px;" onclick="consultarCnpjReuniao('${idCard}','${dealId}','${dealNome}','${funil}','${estagio}')">🔍 Consultar CNPJ</button></div><div id="cnpj-reuniao-result-${idCard}"></div></div></div>`;
  }catch(e){container.innerHTML=`<div style="font-size:12px;color:#791F1F;background:#FCEBEB;padding:10px 12px;border-radius:8px;">Erro: ${e.message}</div>`;}
}
async function consultarCnpjReuniao(idCard,dealId,dealNome,funil,estagio){
  const raw=document.getElementById('cnpj-reuniao-'+idCard)?.value.replace(/\D/g,'')||'';if(raw.length!==14){alert('CNPJ inválido.');return;}
  const resultEl=document.getElementById('cnpj-reuniao-result-'+idCard);resultEl.innerHTML=load('Consultando Receita Federal...');
  try{
    const r=await fetch(`/api/cnpj?cnpj=${raw}`,{headers:{'X-Session-Token':getSessionToken()}});const d=await r.json();if(!r.ok)throw new Error(d.erro||'Erro ao consultar CNPJ');
    resultEl.innerHTML=load('Enriquecendo dados de endereço...');const n=await normalizarCNPJAsync(d);
    const sit=n.situacao_cadastral;const sitCor=sit.toLowerCase().includes('ativa')?'#1D9E75':'#E24B4A';
    const dadosCnpj={...n,funil,estagio,nome:dealNome,dealId};window['_cnpjDados_'+idCard]=dadosCnpj;
    const cnaes=n.cnaes_secundarios.slice(0,8);const simplesLabel=n.simples===true?'✅ Sim':n.simples===false?'Não':'Não informado';const meiLabel=n.mei===true?'✅ Sim':n.mei===false?'Não':'Não informado';
    const wrap=document.createElement('div');wrap.style.cssText='background:var(--branco);border:1px solid var(--border);border-radius:8px;padding:12px;margin-top:4px;';
    wrap.innerHTML=`<div class="two-col"><div class="ib"><div class="l">Razão Social</div><div class="v">${n.razao_social||'-'}</div></div><div class="ib"><div class="l">Nome Fantasia</div><div class="v">${n.nome_fantasia||'-'}</div></div></div><div class="three-col"><div class="ib"><div class="l">CNPJ</div><div class="v">${n.cnpj||'-'}</div></div><div class="ib"><div class="l">Situação</div><div class="v" style="color:${sitCor};font-weight:700;">${sit||'-'}</div></div><div class="ib"><div class="l">Porte</div><div class="v">${n.porte||'-'}</div></div></div><div class="two-col"><div class="ib"><div class="l">Simples Nacional</div><div class="v">${simplesLabel}</div></div><div class="ib"><div class="l">MEI</div><div class="v">${meiLabel}</div></div></div><div class="ib" style="margin-bottom:8px;"><div class="l">CNAE Principal</div><div class="v">${n.cnae_cod?`<span class="cnae-code">${n.cnae_cod}</span>${n.cnae_desc||''}`:'-'}</div></div>${cnaes.length?`<div class="ib" style="margin-bottom:8px;"><div class="l">CNAEs Secundários</div><div class="v">${cnaes.map(c=>`<div class="cnae-row"><span class="cnae-code">${c.codigo}</span>${c.descricao}</div>`).join('')}</div></div>`:''}<div class="act-row" style="margin-top:8px;"></div>`;
    const btn=document.createElement('button');btn.className='btn btn-p';btn.style.fontSize='11px';btn.textContent='🤖 Análise Tributária com IA';btn.addEventListener('click',function(){abrirAnaliseIAReuniao(idCard,dealId,window['_cnpjDados_'+idCard]);});wrap.querySelector('.act-row').appendChild(btn);
    const btnRD=document.createElement('button');btnRD.className='btn btn-s';btnRD.style.fontSize='11px';btnRD.innerHTML='📋 Preencher no RD Station';btnRD.addEventListener('click',function(){abrirModalPreencherRD(idCard,dealId,window['_cnpjDados_'+idCard]);});wrap.querySelector('.act-row').appendChild(btnRD);
    resultEl.innerHTML='';resultEl.appendChild(wrap);
  }catch(e){resultEl.innerHTML=`<div style="font-size:12px;color:#791F1F;background:#FCEBEB;padding:10px 12px;border-radius:8px;">Erro: ${e.message}</div>`;}
}
function abrirAnaliseIAReuniao(idCard,dealId,dados){_dadosReuniaoAtual={...dados,dealId};_llmAtiva='chatgpt';document.querySelectorAll('#modal-ai .llm-btn').forEach(b=>b.classList.remove('ativo'));document.querySelectorAll('#modal-ai .llm-btn')[0]?.classList.add('ativo');gerarPromptAI(_dadosReuniaoAtual);document.getElementById('modal-ai').style.display='flex';document.getElementById('prompt-section').style.display='block';}

// ── PROPOSTAS ────────────────────────────────────────────
let _dealsCarregados=[];let _estagioAtivo=null;
function limparFiltros(){document.getElementById('f-ini').value='';document.getElementById('f-fim').value='';document.getElementById('f-st').value='aberta';document.getElementById('f-resp').value='all';}
function filtrarPorEstagio(nome){
  if(_estagioAtivo===nome){_estagioAtivo=null;document.querySelectorAll('#barras-estagios > div').forEach(el=>el.style.opacity='1');document.getElementById('cards-p').innerHTML=_dealsCarregados.map((d,i)=>cardP(d,i)).join('');}
  else{_estagioAtivo=nome;document.querySelectorAll('#barras-estagios > div').forEach(el=>{el.style.opacity=el.querySelector('span')?.textContent?.includes(nome)?'1':'.35';});const filt=_dealsCarregados.filter(d=>(d.deal_stage?.name||'')===nome);document.getElementById('cards-p').innerHTML=filt.map((d,i)=>cardP(d,i)).join('');}
}
async function carregarPropostas(){
  const dataIni=document.getElementById('f-ini').value;const dataFim=document.getElementById('f-fim').value;const status=document.getElementById('f-st').value;const respFiltro=document.getElementById('f-resp')?.value||'all';const funilId=document.getElementById('f-funil')?.value||'all';const params={};
  if(status==='ganha')params.win='true';if(funilId!=='all')params.deal_pipeline_id=funilId;
  const titulos={ganha:'✅ Propostas ganhas',perdida:'❌ Propostas perdidas',aberta:'🔄 Propostas em andamento',all:'📋 Todas as negociações'};
  document.getElementById('prop-titulo').textContent=titulos[status]||'Propostas';document.getElementById('cards-p').innerHTML=load('Buscando propostas...');
  try{
    const data=await crmFetch('deals',params);let deals=data.deals||[];
    const tipoData=document.getElementById('f-tipo-data')?.value||'criacao';
    if(dataIni||dataFim){const dIni=dataIni?new Date(dataIni+'T00:00:00'):null;const dFim=dataFim?new Date(dataFim+'T23:59:59'):null;deals=deals.filter(d=>{const criado=new Date(d.created_at);const atualizado=new Date(d.updated_at||d.created_at);if(tipoData==='criacao')return(!dIni||criado>=dIni)&&(!dFim||criado<=dFim);if(tipoData==='atualizacao')return(!dIni||atualizado>=dIni)&&(!dFim||atualizado<=dFim);return((!dIni||criado>=dIni)&&(!dFim||criado<=dFim))||((!dIni||atualizado>=dIni)&&(!dFim||atualizado<=dFim));});}
    const com=deals.map(d=>{const di=diasAtras(d.updated_at||d.created_at);const urg=di>7?'urgente':di>=3?'atencao':'ok';return{...d,di,urg};}).sort((a,b)=>b.di-a.di);
    let filtradosSt=com;
    if(status==='aberta'){filtradosSt=com.filter(d=>{const e=(d.deal_stage?.name||'').toLowerCase();return!e.includes('perdid')&&d.win!==true;});}
    else if(status==='perdida'){filtradosSt=com.filter(d=>{const e=(d.deal_stage?.name||'').toLowerCase();return e.includes('perdid')||d.lost===true;});}
    const filtradosResp=respFiltro==='all'?filtradosSt:filtradosSt.filter(d=>d.user?.id===respFiltro||d.user?._id===respFiltro);
    const estagioFiltro=document.getElementById('f-estagio')?.value||'all';const filtradosEst=estagioFiltro==='all'?filtradosResp:filtradosResp.filter(d=>(d.deal_stage?.name||'')===estagioFiltro);
    const contEst={};filtradosSt.forEach(d=>{const e=d.deal_stage?.name||'Sem estágio';contEst[e]=(contEst[e]||0)+1;});const totEst=filtradosSt.length;
    const flbl=document.getElementById('label-funil');if(flbl){const funilSel=_funisCacheados?.find(f=>(f._id||f.id)===funilId);flbl.textContent=funilId!=='all'?(funilSel?.name||''):'Todos os funis';}
    document.getElementById('bloco-estagios').style.display=totEst>0?'block':'none';
    document.getElementById('barras-estagios').innerHTML=Object.entries(contEst).sort((a,b)=>b[1]-a[1]).map(([nome,qtd])=>{const pct=Math.round(qtd/totEst*100);const n=nome.toLowerCase();let cor;if(n.includes('perdid'))cor='#E24B4A';else if(n.includes('fechad'))cor='#1D9E75';else if(n.includes('follow')||n.includes('prov.')||n.includes('[t]')||n.includes('[c]')||n.includes('[m]'))cor='#94A3B8';else if(n.includes('reuni'))cor='#EF9F27';else if(n.includes('proposta')||n.includes('negociaç')||n.includes('enviar')||n.includes('enviada')||n.includes('apresentaç'))cor='#7C3AED';else if(n.includes('em atend')||n.includes('interesse')||n.includes('identificaç'))cor='#92400E';else if(n.includes('contato feito')||n.includes('contactad'))cor='#378ADD';else if(n.includes('sem contato')||n.includes('novos'))cor='#9e9e9e';else if(n.includes('reagend')||n.includes('tentativa'))cor='#D97706';else if(n.includes('dias'))cor='#0EA5E9';else cor='#9e9e9e';return `<div style="margin-bottom:8px;cursor:pointer;" onclick="filtrarPorEstagio('${nome.replace(/'/g,"\\'")}')"><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;"><span style="font-weight:500;color:${cor}">${nome}</span><span style="color:#6b6b6b;">${qtd} (${pct}%)</span></div><div style="background:#f0f0f0;border-radius:4px;height:6px;"><div style="background:${cor};width:${pct}%;height:6px;border-radius:4px;transition:width .4s;"></div></div></div>`;}).join('');
    const filtrados=filtradosEst;
    if(!filtrados.length){document.getElementById('cards-p').innerHTML='<div class="empty">Nenhuma proposta encontrada.</div>';['sp-t','sp-u','sp-a'].forEach(id=>document.getElementById(id).textContent='0');document.getElementById('bp').textContent='0';return;}
    const urg=filtrados.filter(x=>x.urg==='urgente').length;const atc=filtrados.filter(x=>x.urg==='atencao').length;
    document.getElementById('sp-t').textContent=filtrados.length;document.getElementById('sp-u').textContent=urg;document.getElementById('sp-a').textContent=atc;document.getElementById('bp').textContent=urg>0?urg+' urgentes':filtrados.length;
    _dealsCarregados=filtrados;_estagioAtivo=null;document.querySelectorAll('#barras-estagios > div').forEach(el=>el.style.opacity='1');
    const estagiosReais=[...new Set(filtrados.map(d=>d.deal_stage?.name).filter(Boolean))].sort();const selEst=document.getElementById('f-estagio');if(selEst){selEst.innerHTML='<option value="all">Todos os estágios</option>'+estagiosReais.map(e=>`<option value="${e}">${e}</option>`).join('');}
    const respMap={};filtrados.forEach(d=>{if(d.user?.name){respMap[d.user._id||d.user.id]=d.user.name;}});const selResp=document.getElementById('f-resp');if(selResp){selResp.innerHTML='<option value="all">Todos</option>'+Object.entries(respMap).map(([id,nome])=>`<option value="${id}">${nome}</option>`).join('');}
    document.getElementById('cards-p').innerHTML=filtrados.map((d,i)=>cardP(d,i)).join('');
  }catch(e){document.getElementById('cards-p').innerHTML=`<div class="empty" style="color:#791F1F;">Erro: ${e.message}</div>`;}
}
function cardP(d,i){
  const nm=d.name||'Negociação';const emp=d.contacts?.[0]?.organization_name||'-';const val=d.amount_montly?'R$ '+Number(d.amount_montly).toLocaleString('pt-BR'):'-';
  const estagio=d.deal_stage?.name||'-';const pipeline=d.deal_pipeline?.name||d._pipeline_name||d.campaign?.name||'';const resp=d.user?.name||'-';
  const dl=d.di===0?'Hoje':d.di===1?'1 dia':`${d.di} dias`;const en=estagio.toLowerCase();const isGanha=d.win===true;
  let cardClass,ac;
  if(en.includes('perdid')){cardClass='urgente';ac='av-urgente';}else if(isGanha||en.includes('fechad')){cardClass='ok';ac='av-ok';}else if(en.includes('follow')||en.includes('prov.')||en.includes('[t]')||en.includes('[c]')||en.includes('[m]')){cardClass='follow-up';ac='av-follow-up';}else if(en.includes('reuni')){cardClass='reuniao';ac='av-reuniao';}else if(en.includes('proposta')||en.includes('negociaç')||en.includes('enviar')||en.includes('enviada')||en.includes('apresentaç')){cardClass='proposta';ac='av-proposta';}else if(en.includes('em atend')||en.includes('interesse')||en.includes('identificaç')){cardClass='atendimento';ac='av-atendimento';}else if(en.includes('contato feito')||en.includes('contactad')){cardClass='marketing';ac='av-marketing';}else if(en.includes('reagend')||en.includes('tentativa')){cardClass='atencao';ac='av-atencao';}else if(en.includes('dias')){cardClass='oportunidade';ac='av-oportunidade';}else{cardClass='sem-contato';ac='av-sem-contato';}
  const dc=en.includes('perdid')?'dp-urgente':d.urg==='urgente'?'dp-urgente':d.urg==='atencao'?'dp-atencao':'dp-ok';
  const atualizado=d.updated_at?new Date(d.updated_at).toLocaleDateString('pt-BR'):'-';const statusBadge=d.win?'badge-green':d.lost?'badge-red':'badge-amber';const statusLabel=d.win?'✅ Ganha':d.lost?'❌ Perdida':'🔄 Em andamento';const dealId=d._id||d.id||'';const contactId=d.contacts?.[0]?._id||d.contacts?.[0]?.id||'';
  return `<div class="card ${cardClass}"><div class="card-head" onclick="toggle(this)"><div class="av ${ac}">${ini(nm)}</div><div class="card-info"><div class="card-name">${nm}${pipeline?`<span class="funil-tag">${pipeline}</span>`:''}</div><div class="card-sub">${emp} · ${estagio}</div></div><div style="display:flex;align-items:center;gap:6px;flex-shrink:0"><span class="dias-pill ${dc}">${dl} sem atualização</span><span class="chev">▼</span></div></div><div class="card-body"><div class="cbi"><div class="prazo-bar ${d.urg}"><div><div class="prazo-num">${d.di}</div><div class="prazo-lbl">dias sem atualização</div></div><div style="flex:1;margin-left:16px;font-size:12px;">${d.urg==='urgente'?'⚠ Mais de 7 dias sem movimentação.':d.urg==='atencao'?'Considere fazer um follow-up.':'Proposta recente.'}<div style="margin-top:4px;color:#9e9e9e;font-size:11px;">Última atualização: ${atualizado}</div></div></div><div class="three-col"><div class="ib"><div class="l">Funil de vendas</div><div class="v" style="color:#185FA5;font-weight:600;">${pipeline||'-'}</div></div><div class="ib"><div class="l">Estágio</div><div class="v">${estagio}</div></div><div class="ib"><div class="l">Status</div><div class="v"><span class="badge ${statusBadge}">${statusLabel}</span></div></div></div><div class="two-col"><div class="ib"><div class="l">Empresa</div><div class="v">${emp}</div></div><div class="ib"><div class="l">Valor</div><div class="v">${val}</div></div><div class="ib"><div class="l">Responsável</div><div class="v">${resp}</div></div><div class="ib"><div class="l">Última atualização</div><div class="v">${atualizado}</div></div></div><div class="act-row">${dealId?`<a href="https://crm.rdstation.com/app/deals/${dealId}" target="_blank" class="btn btn-p">Abrir negociação ↗</a>`:''}${contactId?`<a href="https://crm.rdstation.com/contacts/${contactId}" target="_blank" class="btn">Ver contato ↗</a>`:''}</div></div></div></div>`;
}

// ── TAREFAS ──────────────────────────────────────────────
function limparFiltrosTarefas(){document.getElementById('ft-de').value='';document.getElementById('ft-ate').value='';document.getElementById('ft-tipo').value='all';document.getElementById('ft-status').value='open';}
async function carregarTarefas(){
  const dtDe=document.getElementById('ft-de').value;const dtAte=document.getElementById('ft-ate').value;const tipo=document.getElementById('ft-tipo').value;const status=document.getElementById('ft-status').value;
  document.getElementById('cards-t').innerHTML=load('Buscando tarefas...');
  try{
    let tasks=[];const ids=new Set();const dedup=arr=>arr.filter(t=>{if(ids.has(t._id||t.id))return false;ids.add(t._id||t.id);return true;});
    if(status==='open'){const data=await crmFetch('tasks',{done:'false',limit:'200'});tasks=dedup(data.tasks||[]);}
    else if(status==='done'){const data=await crmFetch('tasks',{done:'true',limit:'200'});tasks=dedup(data.tasks||[]);}
    else{const[ab,co]=await Promise.all([crmFetch('tasks',{done:'false',limit:'200'}),crmFetch('tasks',{done:'true',limit:'200'})]);tasks=dedup([...(ab.tasks||[]),...(co.tasks||[])]);}
    const hoje=new Date();hoje.setHours(0,0,0,0);
    if(dtDe||dtAte){const ini2=dtDe?new Date(dtDe+'T00:00:00'):null;const fim=dtAte?new Date(dtAte+'T23:59:59'):null;tasks=tasks.filter(t=>{const venc=new Date(t.date);const cria=new Date(t.created_at);return((!ini2||venc>=ini2)&&(!fim||venc<=fim))||((!ini2||cria>=ini2)&&(!fim||cria<=fim));});}
    if(tipo!=='all'){const mapTipo={proposta:['proposta'],reuniao:['reuni'],whatsapp:['whatsapp','whats','retono','retornar'],reagendamento:['reagend'],tentativa:['tentativa']};const palavras=mapTipo[tipo]||[];tasks=tasks.filter(t=>palavras.some(p=>(t.subject||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(p.normalize('NFD').replace(/[̀-ͯ]/g,''))));}
    const com=tasks.map(t=>{const dt=new Date(t.date);dt.setHours(0,0,0,0);const diff=Math.floor((dt-hoje)/864e5);const urg=diff<0?'atrasada':diff===0?'hoje':'futura';return{...t,diff,urg};}).sort((a,b)=>a.diff-b.diff);
    document.getElementById('st-at').textContent=com.filter(t=>t.urg==='atrasada').length;document.getElementById('st-hj').textContent=com.filter(t=>t.urg==='hoje').length;document.getElementById('st-fu').textContent=com.filter(t=>t.urg==='futura').length;
    if(!com.length){document.getElementById('cards-t').innerHTML='<div class="empty">Nenhuma tarefa encontrada.</div>';return;}
    document.getElementById('cards-t').innerHTML=com.map(t=>{const dtFmt=new Date(t.date).toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'});const assunto=t.subject||'Tarefa';const lead=t.deal?.name||t.contact?.name||'';const dealId=t.deal?._id||t.deal?.id||'';return `<div class="tarefa-card ${t.urg}"><div class="tarefa-check"></div><div class="tarefa-info"><div class="tarefa-lead">${lead||assunto}</div><div class="tarefa-assunto">${lead?assunto:''}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0"><div class="tarefa-data ${t.urg}">${dtFmt}</div>${dealId?`<a href="https://crm.rdstation.com/app/deals/${dealId}" target="_blank" class="btn" style="padding:3px 10px;font-size:10px;">Abrir ↗</a>`:''}</div></div>`;}).join('');
  }catch(e){document.getElementById('cards-t').innerHTML=`<div class="empty" style="color:#791F1F;">Erro: ${e.message}</div>`;}
}

// ── CNPJ ─────────────────────────────────────────────────
async function buscarEnderecoBrasilAPI(cnpjRaw){try{const r=await fetch('https://brasilapi.com.br/api/cnpj/v1/'+cnpjRaw,{headers:{Accept:'application/json'}});if(!r.ok)return null;return await r.json();}catch(e){return null;}}
function normalizarCNPJ(d){
  if(!d)return{};
  const logradouro=d.logradouro||d.endereco||d.street||'';const numero=d.numero||d.number||d.num||'';const complemento=d.complemento||d.complement||'';const bairro=d.bairro||d.district||d.neighborhood||'';const cep=(d.cep||d.zip||d.zipcode||'').toString().replace(/\D/g,'');const cepFmt=cep.length===8?cep.slice(0,5)+'-'+cep.slice(5):cep;const municipio=d.municipio||d.cidade||d.city||d.municipality||d.municipio_nome||'';const uf=d.uf||d.estado||d.state||d.uf_municipio||'';const tel1=d.ddd_telefone_1||d.telefone||d.phone||'';const telefone=tel1?tel1.toString().trim():'';const email=d.email||d.correio_eletronico||'';const razao_social=d.razao_social||d.nome||d.company||d.name||'';const nome_fantasia=d.nome_fantasia||d.fantasia||d.trade_name||'';const cnpjRaw2=(d.cnpj||d.cnpj_raiz||'').toString().replace(/\D/g,'');const cnpjFmt=cnpjRaw2.length===14?cnpjRaw2.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,'$1.$2.$3/$4-$5'):cnpjRaw2;const situacao_cadastral=d.descricao_situacao_cadastral||d.situacao_cadastral||d.status||d.situacao||'';let cnae_cod=d.cnae_fiscal||d.cnae||'';let cnae_desc=d.cnae_fiscal_descricao||d.cnae_descricao||'';if(!cnae_cod&&d.atividade_principal&&d.atividade_principal[0]){cnae_cod=d.atividade_principal[0].code||d.atividade_principal[0].codigo||'';cnae_desc=d.atividade_principal[0].text||d.atividade_principal[0].descricao||'';}
  let cnaes_secundarios=[];if(Array.isArray(d.cnaes_secundarios)&&d.cnaes_secundarios.length){cnaes_secundarios=d.cnaes_secundarios.map(c=>({codigo:c.codigo||c.code||'',descricao:c.descricao||c.text||c.description||''})).filter(c=>c.codigo);}else if(Array.isArray(d.atividades_secundarias)&&d.atividades_secundarias.length){cnaes_secundarios=d.atividades_secundarias.map(c=>({codigo:c.code||c.codigo||'',descricao:c.text||c.descricao||''})).filter(c=>c.codigo);}
  let capitalRaw=d.capital_social||d.capital||d.capitalSocial||0;let capital=0;if(typeof capitalRaw==='string'){const limpo=capitalRaw.replace(/[R$\s]/g,'').replace(/\./g,'').replace(',','.');capital=parseFloat(limpo)||0;}else{capital=Number(capitalRaw)||0;}
  if(capital>=10000&&Number.isInteger(capital)){const porteLow=(d.porte||d.size||'').toLowerCase();const isMePeq=porteLow.includes('micro')||porteLow.includes('pequen')||porteLow.includes('me')||porteLow.includes('epp');if(isMePeq&&capital>=500000){capital=capital/100;}else if(!isMePeq&&capital>=100000000){capital=capital/100;}}
  const simples=d.opcao_pelo_simples!=null?d.opcao_pelo_simples:d.simples!=null?d.simples:null;const mei=d.opcao_pelo_mei!=null?d.opcao_pelo_mei:d.mei!=null?d.mei:null;const porte=d.porte||d.size||'';const natureza_juridica=d.natureza_juridica||d.legal_nature||'';const data_abertura=d.data_inicio_atividade||d.abertura||d.data_abertura||d.founded||'';
  return{razao_social,nome_fantasia,cnpj:cnpjFmt,cnpjRaw:cnpjRaw2,situacao_cadastral,cnae_cod:cnae_cod.toString(),cnae_desc,cnaes_secundarios,porte,natureza_juridica,data_abertura,capital,simples,mei,municipio,uf,cep:cepFmt,logradouro,numero,complemento,bairro,telefone,email};
}
async function normalizarCNPJAsync(d){
  const n=normalizarCNPJ(d);if(!n.cnpjRaw||n.cnpjRaw.length!==14)return n;
  const b=await buscarEnderecoBrasilAPI(n.cnpjRaw);if(!b)return n;
  const tipoLog=(b.descricao_tipo_de_logradouro||b.tipo_logradouro||'').trim();const nomeLog=(b.logradouro||'').trim();const logFull=tipoLog&&nomeLog?(tipoLog+' '+nomeLog):nomeLog||tipoLog;
  if(logFull)n.logradouro=logFull;if(b.numero)n.numero=(b.numero||'').toString().trim();if(b.complemento)n.complemento=(b.complemento||'').trim();if(b.bairro)n.bairro=(b.bairro||'').trim();
  if(b.cep){const c=b.cep.toString().replace(/\D/g,'');n.cep=c.length===8?c.slice(0,5)+'-'+c.slice(5):c;}
  if(b.municipio)n.municipio=b.municipio;if(b.uf)n.uf=b.uf;if(!n.telefone&&b.ddd_telefone_1)n.telefone=(b.ddd_telefone_1||'').toString().trim();if(!n.email&&b.email)n.email=b.email;
  if(b.capital_social!=null){let capB=b.capital_social;if(typeof capB==='string'){capB=parseFloat(capB.replace(/[R$\s]/g,'').replace(/\./g,'').replace(',','.'))||0;}else{capB=Number(capB)||0;}if(capB>0){if(capB>=10000&&Number.isInteger(capB)){if(n.capital>0&&capB>n.capital*50){capB=capB/100;}else if(n.capital===0){const porteLow=(n.porte||'').toLowerCase();if((porteLow.includes('micro')||porteLow.includes('pequen')||porteLow.includes('me')||porteLow.includes('epp'))&&capB>=500000){capB=capB/100;}}}n.capital=capB;}}
  if(b.porte&&b.porte.descricao)n.porte=b.porte.descricao;else if(typeof b.porte==='string'&&b.porte)n.porte=b.porte;
  if(b.opcao_pelo_simples!=null)n.simples=b.opcao_pelo_simples===true||b.opcao_pelo_simples==='S'||b.opcao_pelo_simples==='SIM';if(b.opcao_pelo_mei!=null)n.mei=b.opcao_pelo_mei===true||b.opcao_pelo_mei==='S'||b.opcao_pelo_mei==='SIM';
  if(b.data_opcao_pelo_simples)n.data_opcao_simples=b.data_opcao_pelo_simples;if(b.data_opcao_pelo_mei)n.data_opcao_mei=b.data_opcao_pelo_mei;
  return n;
}
async function buscarCNPJ(){
  const raw=document.getElementById('cnpj-input').value.replace(/\D/g,'');if(raw.length!==14){alert('CNPJ inválido.');return;}
  document.getElementById('cnpj-result').innerHTML=load('Consultando Receita Federal...');
  try{
    const r=await fetch(`/api/cnpj?cnpj=${raw}`,{headers:{'X-Session-Token':getSessionToken()}});const d=await r.json();if(!r.ok)throw new Error(d.erro||'Erro ao consultar CNPJ');
    document.getElementById('cnpj-result').innerHTML=load('Enriquecendo dados de endereço...');const n=await normalizarCNPJAsync(d);
    const sit=n.situacao_cadastral;const sitCor=sit.toLowerCase().includes('ativa')?'#1D9E75':'#E24B4A';const cnaes=n.cnaes_secundarios.slice(0,8);
    document.getElementById('cnpj-result').innerHTML=`<div class="card" style="margin-top:8px;"><div class="cbi"><div class="two-col"><div class="ib"><div class="l">Razão Social</div><div class="v">${n.razao_social||'-'}</div></div><div class="ib"><div class="l">Nome Fantasia</div><div class="v">${n.nome_fantasia||'-'}</div></div></div><div class="three-col"><div class="ib"><div class="l">CNPJ</div><div class="v">${n.cnpj||'-'}</div></div><div class="ib"><div class="l">Situação</div><div class="v" style="color:${sitCor};font-weight:700;">${sit||'-'}</div></div><div class="ib"><div class="l">Porte</div><div class="v">${n.porte||'-'}</div></div></div><div class="ib" style="margin-bottom:8px;"><div class="l">CNAE Principal</div><div class="v">${n.cnae_cod?`<span class="cnae-code">${n.cnae_cod}</span>${n.cnae_desc||''}`:'-'}</div></div>${cnaes.length?`<div class="ib" style="margin-bottom:8px;"><div class="l">CNAEs Secundários (${n.cnaes_secundarios.length})</div><div class="v">${cnaes.map(c=>`<div class="cnae-row"><span class="cnae-code">${c.codigo}</span>${c.descricao}</div>`).join('')}</div></div>`:''}<div class="two-col"><div class="ib"><div class="l">Simples Nacional</div><div class="v">${n.simples===true?'✅ Sim':n.simples===false?'Não':'Não informado'}</div></div><div class="ib"><div class="l">MEI</div><div class="v">${n.mei===true?'✅ Sim':n.mei===false?'Não':'Não informado'}</div></div></div><div class="act-row" style="margin-top:12px;"><button class="btn btn-p" onclick="abrirAnaliseIA(window._cnpjBuscado)">🤖 Análise Tributária com IA</button></div></div></div>`;
    window._cnpjBuscado=n;
  }catch(e){document.getElementById('cnpj-result').innerHTML=`<div class="empty" style="color:#791F1F;">Erro: ${e.message}</div>`;}
}

// ── ANÁLISE IA ────────────────────────────────────────────
let _dadosReuniaoAtual=null;let _llmAtiva='chatgpt';
const _llmUrls={chatgpt:'https://chat.openai.com/',gemini:'https://gemini.google.com/',claude:'https://claude.ai/'};
function abrirAnaliseIA(dados){_dadosReuniaoAtual=dados;_llmAtiva='chatgpt';document.querySelectorAll('#modal-ai .llm-btn').forEach(b=>b.classList.remove('ativo'));document.querySelectorAll('#modal-ai .llm-btn')[0]?.classList.add('ativo');gerarPromptAI(dados);document.getElementById('modal-ai').style.display='flex';document.getElementById('prompt-section').style.display='block';}
function fecharModalAI(){document.getElementById('modal-ai').style.display='none';document.getElementById('txt-colar-ai').value='';}
function selecionarLLM(llm,el){_llmAtiva=llm;document.querySelectorAll('#modal-ai .llm-btn').forEach(b=>b.classList.remove('ativo'));el.classList.add('ativo');}
function gerarPromptAI(dados){
  const d=dados||_dadosReuniaoAtual||{};const nomeArquivo='analise-'+(d.razao_social||'cliente').replace(/\s+/g,'-').toLowerCase()+'-'+new Date().toISOString().split('T')[0];
  const endParts=[d.logradouro,d.numero,d.complemento,d.bairro].filter(Boolean);const endCompleto=endParts.length?(endParts.join(', ')+(d.cep?' - CEP: '+d.cep:'')+(d.municipio?' - '+d.municipio+'/'+( d.uf||''):'')):(d.municipio?d.municipio+(d.uf?'/'+d.uf:''):'-');
  const capitalFmt=d.capital?'R$ '+Number(d.capital).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}):'-';const simplesStr=d.simples===true?'SIM (optante)':d.simples===false?'NAO (nao optante)':'NAO INFORMADO — verificar no portal do Simples Nacional';const meiStr=d.mei===true?'SIM':d.mei===false?'NAO':'NAO INFORMADO';
  let regimeAtualFrase;if(d.simples===true){regimeAtualFrase='A '+(d.razao_social||'-')+' E optante pelo Simples Nacional'+(d.data_opcao_simples?' desde '+d.data_opcao_simples:'')+(d.mei===true?' e esta enquadrada como MEI.':' (nao e MEI).');}else if(d.simples===false){regimeAtualFrase='A '+(d.razao_social||'-')+' NAO e optante pelo Simples Nacional e '+(d.mei===true?'E MEI':'NAO e MEI')+'.';}else{regimeAtualFrase='A situacao da '+(d.razao_social||'-')+' quanto ao Simples Nacional nao foi confirmada. IMPORTANTE: consulte https://www8.receita.fazenda.gov.br/SimplesNacional/ antes de concluir.';}
  const cnaesSecStr=(d.cnaes_secundarios||[]).length?(d.cnaes_secundarios).map(function(c,i){return '  '+(i+1)+'. '+(c.codigo||'')+' - '+(c.descricao||'');}).join('\n'):'Nao informado';const cnaesSecCods=(d.cnaes_secundarios||[]).slice(0,3).map(function(c){return c.codigo;}).join(', ');const sep='='.repeat(44);
  const linhas=['Voce e um especialista tributario brasileiro. Complete a analise abaixo usando APENAS','os dados reais do cliente informados. NAO invente dados. NAO use dados genericos.','Cada secao ja começa com os dados do cliente — continue a partir deles.','',sep,'FICHA DO CLIENTE',sep,'Razao Social   : '+(d.razao_social||'-'),'Nome Fantasia  : '+(d.nome_fantasia||'-'),'CNPJ           : '+(d.cnpj||'-'),'Situacao       : '+(d.situacao_cadastral||'-'),'Porte          : '+(d.porte||'-'),'Natureza Jur.  : '+(d.natureza_juridica||'-'),'Abertura       : '+(d.data_abertura||'-'),'Capital Social : '+capitalFmt,'Endereco       : '+endCompleto,(d.telefone?'Telefone       : '+d.telefone:''),(d.email?'Email          : '+d.email:''),'Simples Nac.   : '+simplesStr,'MEI            : '+meiStr,'CNAE Principal : '+(d.cnae_cod||'-')+' - '+(d.cnae_desc||'-'),'CNAEs Secund.  :',cnaesSecStr,'Funil CRM      : '+(d.funil||'-'),'Estagio CRM    : '+(d.estagio||'-'),'',sep,'ANALISE TRIBUTARIA — COMPLETE CADA SECAO ABAIXO',sep,'','## 1. IDENTIFICACAO E PERFIL TRIBUTARIO ATUAL','A empresa '+(d.razao_social||'-')+', inscrita no CNPJ '+(d.cnpj||'-')+',','com sede na '+(endCompleto||'-')+', foi constituida em '+(d.data_abertura||'-')+'.','Classificada como '+(d.porte||'-')+' com capital social de '+capitalFmt+',','apresenta o seguinte perfil tributario: [COMPLETE]','','## 2. ANALISE DO REGIME TRIBUTARIO ATUAL',regimeAtualFrase,'Portanto, opera sob regime de: [COMPLETE]','','## 3. SIMULACAO DE REGIMES TRIBUTARIOS','Para uma empresa do setor '+(d.cnae_desc||'-')+' com o perfil da '+(d.razao_social||'-')+':','[COMPLETE — simule Simples Nacional, Lucro Presumido e Lucro Real com aliquotas]','','## 4. OPORTUNIDADES DE ECONOMIA FISCAL','Para a '+(d.razao_social||'-')+', sediada em '+(d.municipio||'-')+'/'+( d.uf||'-')+':','[COMPLETE — liste minimo 5 oportunidades concretas para o CNAE '+(d.cnae_cod||'')+']','','## 5. RISCOS FISCAIS E PONTOS DE ATENCAO','[COMPLETE — liste minimo 4 riscos especificos para o setor e perfil da empresa]','','## 6. PERGUNTAS ESTRATEGICAS PARA A REUNIAO','[COMPLETE — exatamente 5 perguntas numeradas, especificas para o perfil da empresa]','','## 7. RESUMO EXECUTIVO','[COMPLETE — resumo executivo de no minimo 150 palavras]','',sep,'INSTRUCOES: Substitua todos os [COMPLETE] pelo conteudo real. Minimo 1000 palavras. Salve como: '+nomeArquivo+'.txt'].filter(l=>l!==undefined&&l!==null);
  document.getElementById('prompt-preview').textContent=linhas.join('\n');
}
function copiarPromptAI(){const prompt=document.getElementById('prompt-preview').textContent;navigator.clipboard.writeText(prompt).then(()=>{const badge=document.getElementById('badge-copiado');badge.style.opacity='1';setTimeout(()=>badge.style.opacity='0',2500);});}
function abrirLLM(){window.open(_llmUrls[_llmAtiva]||'https://chat.openai.com/','_blank');}
function importarArquivoAI(input){const file=input.files[0];if(!file)return;const reader=new FileReader();reader.onload=e=>{document.getElementById('txt-colar-ai').value=e.target.result;};reader.readAsText(file,'UTF-8');}
function processarAnaliseImportada(){const texto=document.getElementById('txt-colar-ai').value.trim();if(!texto){alert('Cole ou importe o texto da análise primeiro.');return;}const dados=_dadosReuniaoAtual||{};document.getElementById('ti-nome').textContent=dados.nome||dados.razao_social||'-';document.getElementById('ti-dados').innerHTML=`<strong>Razão Social:</strong> ${dados.razao_social||'-'}<br><strong>CNPJ:</strong> ${dados.cnpj||'-'}<br><strong>Funil:</strong> ${dados.funil||'-'} | <strong>Estágio:</strong> ${dados.estagio||'-'}`;document.getElementById('ti-analise').textContent=texto;fecharModalAI();document.getElementById('tela-importacao').classList.add('aberta');}
function fecharTelaImportacao(){document.getElementById('tela-importacao').classList.remove('aberta');}
async function gravarNoRD(btnEl){
  const dados=_dadosReuniaoAtual||{};const analise=document.getElementById('ti-analise').textContent;const dealId=dados.dealId||'';const btn=btnEl;
  if(!dealId){alert('Deal ID não encontrado.');return;}
  const nota='📊 ANÁLISE TRIBUTÁRIA — '+new Date().toLocaleDateString('pt-BR')+'\n\n'+analise+'\n\n—\nGerado pelo Outtax Dashboard';
  if(btn){btn.textContent='⏳ Gravando...';btn.disabled=true;}
  try{
    const r=await fetch('/api/rdcrm',{method:'POST',headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken()},body:JSON.stringify({path:'activities',deal_id:dealId,text:nota})});const data=await r.json();
    if(r.ok&&!data.erro){if(btn){btn.textContent='✅ Gravado!';btn.style.background='#1D9E75';}setTimeout(()=>fecharTelaImportacao(),2000);}
    else{throw new Error(data.erro||'Erro ao gravar');}
  }catch(e){alert('Erro ao gravar no RD: '+e.message);if(btn){btn.textContent='💾 Gravar no RD Station';btn.disabled=false;btn.style.background='';}}
}

// ── USUÁRIOS ──────────────────────────────────────────────
function abrirGerenciarUsuarios(){carregarListaUsuarios();document.getElementById('m-usuarios').classList.add('open');}
function fecharGerenciarUsuarios(){document.getElementById('m-usuarios').classList.remove('open');}
async function migrarSenhasParaHash(){if(!confirm('Converter todas as senhas para hash seguro?\n\nTodos precisarão fazer login novamente após ~30s.\n\nContinuar?'))return;try{const r=await fetch('/api/admin-migrate-senhas',{method:'POST',headers:{'X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken()}});const d=await r.json();if(!r.ok)throw new Error(d.erro||'Erro');alert(d.mensagem||'Migração concluída!');carregarListaUsuarios();}catch(e){alert('Erro: '+e.message);}}
async function carregarListaUsuarios(){
  const el=document.getElementById('lista-usuarios');el.innerHTML=load('Carregando usuários...');
  try{
    const r=await fetch('/api/admin-users',{headers:{'X-Session-Token':getSessionToken()}});const d=await r.json();if(!r.ok)throw new Error(d.erro||'Erro ao carregar');const usuarios=d.usuarios||[];window._listaUsuarios=usuarios;
    el.innerHTML=`<div style="background:var(--azul-pale);border-radius:8px;overflow:hidden;margin-bottom:4px;"><div style="display:grid;grid-template-columns:1.2fr 1.2fr 80px 1fr;padding:8px 12px;font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);"><span>Usuário</span><span>Nome</span><span>Perfil</span><span>Ações</span></div>${usuarios.map(u=>`<div style="display:grid;grid-template-columns:1.2fr 1.2fr 80px 1fr;padding:10px 12px;border-top:1px solid var(--border);background:var(--branco);align-items:center;gap:4px;"><div style="font-size:12px;font-weight:600;color:var(--azul-escuro);">${u.usuario} ${u.hashAtivo?'<span style="background:#EAF3DE;color:#27500A;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:500;">🔒 seguro</span>':'<span style="background:#FFF0E0;color:#8B5E00;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:500;">⚠️ migrar</span>'}</div><div style="font-size:12px;color:var(--text-muted);">${u.nome||''}</div><div style="font-size:11px;">${u.admin?'<span style="background:var(--azul-claro);color:var(--azul-escuro);padding:2px 8px;border-radius:20px;font-weight:600;">Admin</span>':'<span style="background:#f0f0f0;color:#6b6b6b;padding:2px 8px;border-radius:20px;">Usuário</span>'}</div><div style="display:flex;gap:4px;"><button onclick="editarSenha('${u.usuario}')" style="background:none;border:1px solid var(--azul-medio);color:var(--azul-medio);border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">🔑 Redefinir</button><button onclick="removerUsuario('${u.usuario}')" style="background:none;border:1px solid #E24B4A;color:#E24B4A;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">🗑</button></div></div>`).join('')}</div>`;
  }catch(e){el.innerHTML=`<div style="font-size:12px;color:#791F1F;background:#FCEBEB;padding:10px 12px;border-radius:8px;">${e.message}</div>`;}
}
async function adicionarUsuario(){
  const usuario=document.getElementById('nu-usuario').value.trim();const nome=document.getElementById('nu-nome').value.trim();const senha=document.getElementById('nu-senha').value.trim();const admin=document.getElementById('nu-admin').value==='true';const erroEl=document.getElementById('nu-erro');erroEl.style.display='none';
  if(!usuario||!senha){erroEl.textContent='Usuário e senha obrigatórios.';erroEl.style.display='block';return;}
  try{const r=await fetch('/api/admin-users',{method:'POST',headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken()},body:JSON.stringify({usuario,senha,nome:nome||usuario,admin})});const d=await r.json();if(!r.ok)throw new Error(d.erro||'Erro ao adicionar');document.getElementById('nu-usuario').value='';document.getElementById('nu-nome').value='';document.getElementById('nu-senha').value='';carregarListaUsuarios();alert('✅ Usuário adicionado!');}
  catch(e){document.getElementById('nu-erro').textContent=e.message;document.getElementById('nu-erro').style.display='block';}
}
async function removerUsuario(usuario){if(!confirm(`Remover "${usuario}"?`))return;try{const r=await fetch('/api/admin-users',{method:'DELETE',headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken()},body:JSON.stringify({usuario})});const d=await r.json();if(!r.ok)throw new Error(d.erro||'Erro');carregarListaUsuarios();alert('✅ Usuário removido!');}catch(e){alert('Erro: '+e.message);}}
async function editarSenha(usuario){const novaSenha=prompt(`Nova senha para "${usuario}":`);if(!novaSenha||!novaSenha.trim())return;if(novaSenha.trim().length<4){alert('Senha muito curta (mínimo 4 caracteres).');return;}try{const r=await fetch('/api/admin-users',{method:'PATCH',headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken()},body:JSON.stringify({usuario,novaSenha:novaSenha.trim()})});const d=await r.json();if(!r.ok)throw new Error(d.erro||'Erro');carregarListaUsuarios();alert('✅ Senha alterada com sucesso!');}catch(e){alert('Erro: '+e.message);}}

// ── RD STATION EMPRESA ────────────────────────────────────
let _rdFillDados=null;let _rdFillDealId=null;
function fecharModalRD(e){if(e&&e.target!==document.getElementById('modal-rd-ov'))return;document.getElementById('modal-rd-ov').classList.remove('open');}
function abrirModalPreencherRD(idCard,dealId,cnpjDados){
  if(!cnpjDados){alert('Consulte o CNPJ primeiro.');return;}
  _rdFillDados=cnpjDados;_rdFillDealId=dealId;const n=cnpjDados;
  const endParts=[n.logradouro,n.numero,n.complemento,n.bairro].filter(Boolean);const endStr=endParts.length?(endParts.join(', ')+(n.cep?' — CEP '+n.cep:'')+(n.municipio?', '+n.municipio+(n.uf?'/'+n.uf:''):'')):( n.municipio?(n.municipio+(n.uf?'/'+n.uf:'')):'');
  document.getElementById('modal-rd-status-box').style.display='none';document.getElementById('modal-rd-link-org').style.display='none';document.getElementById('modal-rd-btn-criar').textContent='✅ Criar Empresa e Vincular ao Deal';document.getElementById('modal-rd-btn-criar').disabled=false;document.getElementById('modal-rd-subtitulo').textContent=(n.razao_social||'Empresa')+' — '+(n.cnpj||'');
  const linkDeal=document.getElementById('modal-rd-link-deal');if(dealId){linkDeal.href='https://crm.rdstation.com/app/deals/'+dealId;linkDeal.style.display='inline-flex';}else{linkDeal.style.display='none';}
  const preview=[{label:'Razão Social',valor:n.razao_social||''},{label:'CNPJ',valor:n.cnpj||''},{label:'Telefone',valor:n.telefone||''},{label:'Endereço',valor:endStr},{label:'Cidade',valor:n.municipio||''},{label:'Estado',valor:n.uf||''}].filter(c=>c.valor);
  document.getElementById('modal-rd-dados-empresa').innerHTML=preview.map(c=>`<div class="modal-rd-row"><span class="modal-rd-label">${c.label}</span><span class="modal-rd-value">${c.valor}</span></div>`).join('');
  document.getElementById('modal-rd-ov').classList.add('open');
}
async function executarCriarEmpresaRD(){
  const n=_rdFillDados;const dealId=_rdFillDealId;if(!n){alert('Dados do CNPJ não encontrados.');return;}
  const btn=document.getElementById('modal-rd-btn-criar');const statusBox=document.getElementById('modal-rd-status-box');btn.disabled=true;btn.textContent='⏳ Criando...';statusBox.style.display='none';
  const endParts=[n.logradouro,n.numero,n.complemento,n.bairro].filter(Boolean);const endStr=endParts.join(', ');
  try{
    const orgBody={organization:{name:n.razao_social||n.cnpj||'Empresa'}};if(n.cnpj)orgBody.organization.cnpj=n.cnpj.replace(/\D/g,'');if(n.telefone)orgBody.organization.phone=n.telefone;if(endStr)orgBody.organization.address=endStr;if(n.municipio)orgBody.organization.city=n.municipio;if(n.uf)orgBody.organization.state=n.uf;if(n.cep)orgBody.organization.zip_code=n.cep;
    const r=await fetch('/api/rdcrm',{method:'POST',headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken(),'X-CSRF-Token':getCSRFToken()},body:JSON.stringify({path:'organizations',...orgBody})});const data=await r.json();
    if(!r.ok||data.erro)throw new Error(data.erro||data.message||'Erro ao criar empresa');
    const orgId=data._id||data.id||'';const orgUrl=orgId?('https://crm.rdstation.com/app/organizations/'+orgId):'';
    if(dealId&&orgId){await fetch('/api/rdcrm',{method:'PUT',headers:{'Content-Type':'application/json','X-Session-Token':getSessionToken()},body:JSON.stringify({path:'deals/'+dealId,deal:{organization_id:orgId}})});}
    statusBox.style.background='#EAF3DE';statusBox.style.color='#1D9E75';statusBox.innerHTML='✅ Empresa criada e vinculada com sucesso!';statusBox.style.display='block';
    if(orgUrl){const linkOrg=document.getElementById('modal-rd-link-org');linkOrg.href=orgUrl;linkOrg.style.display='inline-flex';}
    btn.textContent='✅ Concluído';
  }catch(e){statusBox.style.background='#FCEBEB';statusBox.style.color='#791F1F';statusBox.innerHTML='❌ Erro: '+e.message;statusBox.style.display='block';btn.disabled=false;btn.textContent='🔄 Tentar novamente';}
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────
async function inicializar(){
  document.getElementById('td').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'});
  const _cfg=getCfg();
  if(_cfg.nomeUsuario){document.getElementById('sidebar-user-nome').textContent=_cfg.nomeUsuario;document.getElementById('sidebar-user').style.display='block';}
  const btnAdmin=document.getElementById('btn-admin-usuarios');if(btnAdmin)btnAdmin.style.display=getCfg().isAdmin?'flex':'none';
  const params=new URLSearchParams(window.location.search);const temRetornoGoogle=params.get('google_access_token')||params.get('google_error');
  if(temRetornoGoogle)capturarTokenGoogle();
  checkCfg();
  const hoje=dataHoje();
  document.getElementById('r-de').value=hoje;document.getElementById('r-ate').value=hoje;
  document.getElementById('f-st').value='aberta';
  aplicarPeriodoFB('30');
  await carregarFunis();
}
(async function(){
  const params=new URLSearchParams(window.location.search);const temRetornoGoogle=params.get('google_access_token')||params.get('google_error');
  if(temRetornoGoogle){
    const token=params.get('google_access_token');const refresh=params.get('google_refresh_token');const email=params.get('google_email');const name=params.get('google_name');const sessionViaUrl=params.get('session_token');const erro=params.get('google_error');
    if(erro){alert('Erro ao conectar Google Agenda: '+erro);window.history.replaceState({},'','/');return;}
    if(token){const c=getCfg();const sessionFinal=sessionViaUrl||c.sessionToken||'';const novoEstado={...c,sessionToken:sessionFinal,googleToken:token,googleEmail:email||'',googleName:name||''};if(refresh)novoEstado.googleRefreshToken=refresh;localStorage.setItem(K,JSON.stringify(novoEstado));window.history.replaceState({},'','/');if(!sessionFinal){mostrarLogin();return;}inicializar();return;}
  }
  if(!getSessionToken()){mostrarLogin();return;}
  const sessaoOk=await validarSessaoNoServidor();if(!sessaoOk)return;
  ocultarLogin();inicializar();
})();
</script>
</body>
</html>
