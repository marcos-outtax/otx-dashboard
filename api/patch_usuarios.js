async function carregarListaUsuarios(){
  const el=document.getElementById('lista-usuarios');el.innerHTML=load('Carregando usuarios...');
  try{
    const r=await fetch('/api/admin-users',{headers:{'X-Session-Token':getSessionToken()}});const d=await r.json();
    if(!r.ok)throw new Error(d.erro||'Erro ao carregar');
    const usuarios=d.usuarios||[];window._listaUsuarios=usuarios;
    el.innerHTML=`<div style="background:var(--azul-pale);border-radius:8px;overflow:hidden;">
<div style="display:grid;grid-template-columns:1fr 1fr 1fr 80px 150px;padding:8px 12px;font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;border-bottom:1px solid var(--border);">
<span>Usuario</span><span>Nome</span><span>Senha</span><span>Perfil</span><span>Acoes</span></div>
${usuarios.map(u=>`<div style="display:grid;grid-template-columns:1fr 1fr 1fr 80px 150px;padding:10px 12px;border-top:1px solid var(--border);background:var(--branco);align-items:center;gap:4px;">
<div style="font-size:12px;font-weight:600;color:var(--azul-escuro);">${u.usuario}</div>
<div style="font-size:12px;color:var(--text-muted);">${u.nome||''}</div>
<div style="display:flex;align-items:center;gap:4px;"><span id="senha-txt-${u.usuario}" style="font-size:11px;color:var(--text-muted);font-family:monospace;">........</span><button onclick="toggleSenha('${u.usuario}','${u.senha}')" style="background:none;border:none;cursor:pointer;font-size:12px;" title="Ver senha">&#128065;</button></div>
<div style="font-size:11px;">${u.admin?'<span style="background:var(--azul-claro);color:var(--azul-escuro);padding:2px 8px;border-radius:20px;font-weight:600;">Admin</span>':'<span style="background:#f0f0f0;color:#6b6b6b;padding:2px 8px;border-radius:20px;">Usuario</span>'}</div>
<div style="display:flex;gap:4px;">
<button onclick="editarSenha('${u.usuario}')" style="background:none;border:1px solid var(--azul-medio);color:var(--azul-medio);border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">Editar senha</button>
<button onclick="removerUsuario('${u.usuario}')" style="background:none;border:1px solid #E24B4A;color:#E24B4A;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">Remover</button>
</div></div>`).join('')}</div>`;
  }catch(e){el.innerHTML=`<div style="font-size:12px;color:#791F1F;background:#FCEBEB;padding:10px 12px;border-radius:8px;">${e.message}</div>`;}
}
