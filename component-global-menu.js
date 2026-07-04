function openGlobalMenu(){
  const menu = document.getElementById('globalMenu');
  const toggle = document.getElementById('globalMenuToggle');
  if(!menu || !toggle) return;
  menu.hidden = false;
  toggle.setAttribute('aria-expanded','true');
  emitBaseEvent('menuopen');
}

function closeGlobalMenu(){
  const menu = document.getElementById('globalMenu');
  const toggle = document.getElementById('globalMenuToggle');
  if(!menu || !toggle) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded','false');
  emitBaseEvent('menuclose');
}

function toggleGlobalMenu(){
  const menu = document.getElementById('globalMenu');
  if(!menu) return;
  menu.hidden ? openGlobalMenu() : closeGlobalMenu();
}

function bindMenu(){
  const toggle = document.getElementById('globalMenuToggle');
  const menu = document.getElementById('globalMenu');
  if(!toggle || !menu) return;

  toggle.addEventListener('click', toggleGlobalMenu);

  document.addEventListener('click', event => {
    if(menu.hidden) return;
    if(menu.contains(event.target) || toggle.contains(event.target)) return;
    closeGlobalMenu();
  });

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape') closeGlobalMenu();
  });
}

function addMenuAction({id, label, onClick, before = false} = {}){
  const slot = document.getElementById('dynamicMenuActions');
  if(!slot || !label || typeof onClick !== 'function') return null;
  if(!slot.querySelector('.menu-title')){
    const title = document.createElement('p');
    title.className = 'menu-title';
    title.textContent = 'Dinâmico';
    slot.appendChild(title);
  }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'menu-action';
  btn.textContent = label;
  btn.dataset.contextClick = '';
  if(id) btn.id = id;
  btn.addEventListener('click', event => onClick(event, btn));
  before ? slot.prepend(btn) : slot.appendChild(btn);
  return btn;
}
