/*
  pej-bridge.js
  Integra index.
*/
(function(){
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  const byId = id => document.getElementById(id);
  const fireChange = el => el && el.dispatchEvent(new Event('change', {bubbles:true}));
  const fireInput = el => el && el.dispatchEvent(new Event('input', {bubbles:true}));

  function closeBaseMenu(){
    if(window.BaseMain && typeof window.BaseMain.closeGlobalMenu === 'function') window.BaseMain.closeGlobalMenu();
  }

  function focusSearch(){
    const el = byId('srch');
    if(el){
      el.focus({preventScroll:true});
      // A busca mora no dock fixo. Não precisa puxar a página inteira junto.
    }
    closeBaseMenu();
  }

  function focusList(){
    const grid = byId('grid');
    if(grid){
      grid.focus?.({preventScroll:true});
      grid.scrollTop = 0;
    }
    closeBaseMenu();
  }

  function openMap(){
    if(typeof window.openOVM === 'function') window.openOVM();
    closeBaseMenu();
  }

  function openBackup(){
    if(typeof window.openBK === 'function') window.openBK();
    if(typeof window.doBackup === 'function') window.setTimeout(window.doBackup, 80);
    closeBaseMenu();
  }

  function resetFilters(){
    const search = byId('srch');
    if(search){ search.value=''; fireInput(search); }
    const sort = byId('srt');
    if(sort){ sort.value='name'; fireChange(sort); }
    const list = byId('listFilter');
    if(list){ list.value='all'; fireChange(list); }
    document.querySelectorAll('#typeFilters input[type="checkbox"]').forEach(cb=>{
      if(!cb.checked){ cb.checked = true; fireChange(cb); }
    });
    const all = document.querySelector('#qfBar [data-qf="all"]');
    if(all) all.click();
    closeBaseMenu();
  }

  function setListFilter(value){
    const list = byId('listFilter');
    if(list){ list.value=value; fireChange(list); }
    const grid = byId('grid');
    if(grid) grid.scrollTop = 0;
    closeBaseMenu();
  }

  function setSort(value){
    const sort = byId('srt');
    if(sort){ sort.value=value; fireChange(sort); }
    closeBaseMenu();
  }

  function clickQuickFilter(value){
    const safe = String(value).replace(/\\/g,'\\\\').replace(/"/g,'\\"');
    const btn = document.querySelector(`#qfBar [data-qf="${safe}"]`);
    if(btn) btn.click();
    closeBaseMenu();
  }

  function buildMenuControls(){
    const menu = byId('globalMenu');
    if(!menu || byId('pejFilterMenuBlock')) return;

    const block = document.createElement('div');
    block.className = 'menu-block';
    block.id = 'pejFilterMenuBlock';
    block.innerHTML = '<p class="menu-title">Filtros e ordenação</p>';

    const sort = byId('srt');
    const list = byId('listFilter');
    const typeFilters = byId('typeFilters');

    if(sort){
      const wrap = document.createElement('div');
      wrap.className = 'pej-menu-control';
      wrap.innerHTML = '<label for="srt">Ordenar</label>';
      wrap.appendChild(sort);
      block.appendChild(wrap);
    }
    if(list){
      const wrap = document.createElement('div');
      wrap.className = 'pej-menu-control';
      wrap.innerHTML = '<label for="listFilter">Listas</label>';
      wrap.appendChild(list);
      block.appendChild(wrap);
    }
    if(typeFilters){
      const wrap = document.createElement('details');
      wrap.className = 'settings-subblock';
      wrap.open = false;
      const summary = document.createElement('summary');
      summary.textContent = 'Tipos de lugar';
      const note = document.createElement('p');
      note.className = 'pej-menu-note';
      note.textContent = 'Marque/desmarque categorias sem ocupar a tela principal.';
      wrap.appendChild(summary);
      wrap.appendChild(note);
      wrap.appendChild(typeFilters);
      block.appendChild(wrap);
    }

    const themeBlock = byId('themePicker')?.closest('.menu-block');
    menu.insertBefore(block, themeBlock || menu.firstElementChild?.nextSibling || null);
  }


  function buildOperationalDock(){
    const app = byId('app');
    if(!app) return;

    let dock = byId('pejOperationalDock');
    if(!dock){
      dock = document.createElement('section');
      dock.id = 'pejOperationalDock';
      dock.className = 'pej-dock';
      dock.setAttribute('aria-label', 'Busca, contadores e filtros rápidos');
    }

    let core = byId('pejDockCore');
    if(!core){
      core = document.createElement('div');
      core.id = 'pejDockCore';
      core.className = 'pej-dock-core';
      dock.appendChild(core);
    }

    let filters = byId('pejDockFilters');
    if(!filters){
      filters = document.createElement('div');
      filters.id = 'pejDockFilters';
      filters.className = 'pej-dock-filters';
      dock.appendChild(filters);
    }

    const resbar = byId('resbar');
    const hdr = document.querySelector('.hdr');
    const ctrl = document.querySelector('.ctrl');
    const qf = byId('qfBar');
    const rp = document.querySelector('.rp');

    // Núcleo sempre visível: resultado, contadores e busca.
    [resbar, hdr, ctrl].forEach(el=>{ if(el && el.parentNode !== core) core.appendChild(el); });

    // Filtros rápidos ficam ancorados junto da busca.
    [qf, rp].forEach(el=>{ if(el && el.parentNode !== filters) filters.appendChild(el); });

    if(dock.parentNode !== app) app.appendChild(dock);
  }

  function ensureMenuActions(){
    const menu = byId('globalMenu');
    if(!menu) return;

    const oldFocusApp = menu.querySelector('[data-action="focus-app"]');
    if(oldFocusApp){
      oldFocusApp.textContent = 'Ir para lista';
      oldFocusApp.addEventListener('click', focusList);
    }

    const dataActions = {
      'focus-search': focusSearch,
      'open-map': openMap,
      'open-backup': openBackup,
      'reset-filters': resetFilters
    };
    Object.entries(dataActions).forEach(([action,fn])=>{
      menu.querySelectorAll(`[data-action="${action}"]`).forEach(btn=>{
        btn.addEventListener('click', fn);
      });
    });
  }

  function addDynamicActions(){
    if(!window.BaseMain || typeof window.BaseMain.addMenuAction !== 'function') return;
    const actions = [
      {id:'pej-menu-fav', label:'🌻 Meus favoritos', onClick:()=>setListFilter('pFav')},
      {id:'pej-menu-want', label:'♡ Quero visitar', onClick:()=>setListFilter('pWant')},
      {id:'pej-menu-bothwant', label:'♡ Ambos querem visitar', onClick:()=>setListFilter('bothWant')},
      {id:'pej-menu-az', label:'A–Z', onClick:()=>setSort('name')},
      {id:'pej-menu-region-all', label:'Todos os lugares', onClick:()=>clickQuickFilter('all')},
      {id:'pej-menu-top', label:'Voltar ao topo', onClick:()=>{ window.scrollTo({top:0, behavior:'smooth'}); closeBaseMenu(); }}
    ];
    actions.forEach(action=>window.BaseMain.addMenuAction(action));
  }

  function setAppBottomAnchor(){
    // o app inteiro não deve rolar. A lista rola sozinha e o dock operacional
    // fica fixo abaixo do primeiro item, acima da barra global.
    const grid = byId('grid');
    if(!grid) return;
    requestAnimationFrame(()=>{ grid.scrollTop = 0; });
  }

  function paintStyledGlobalTitle(total, bits){
    const titleEl = byId('globalTitle');
    const kickerEl = byId('globalKicker');
    const safeTotal = total && total !== '–' ? total : '716';
    const kickerText = bits.length ? bits.join(' · ') : `${safeTotal} lugares`;

    if(kickerEl){
      kickerEl.textContent = kickerText;
      kickerEl.setAttribute('title', kickerText);
    }

    if(titleEl){
      titleEl.innerHTML = [
        '<span class="pej-global-title-main">Pontos de Interesse</span>',
        '<span class="pej-global-title-sub">de <span class="pej-global-title-names">Paloma &amp; Georgee</span></span>'
      ].join('');
      titleEl.setAttribute('aria-label', `Pontos de Interesse de Paloma e Georgee, ${kickerText}`);
      titleEl.setAttribute('title', 'Pontos de Interesse de Paloma & Georgee');
    }
  }

  function updateGlobalTitle(){
    const total = byId('st-total')?.textContent?.trim();
    const pw = byId('st-pw')?.textContent?.trim();
    const pv = byId('st-pv')?.textContent?.trim();
    const safeTotal = total && total !== '–' ? total : '716';
    const bits = [];
    if(pw && pw !== '–') bits.push(`quero ir: ${pw}`);
    if(pv && pv !== '–') bits.push(`fui: ${pv}`);

    if(window.BaseMain && typeof window.BaseMain.setGlobalTitle === 'function'){
      // Chama a API para manter o evento basemain:titlechange e depois repinta com HTML.
      window.BaseMain.setGlobalTitle(
        `Pontos de Interesse de Paloma & Georgee`,
        bits.length ? bits.join(' · ') : `${safeTotal} lugares`
      );
    }

    paintStyledGlobalTitle(safeTotal, bits);
    document.title = `Pontos de Interesse de Paloma & Georgee · ${safeTotal} lugares`;
  }

  function syncViewportVars(){
    const vv = window.visualViewport;
    if(!vv) return;
    document.documentElement.style.setProperty('--vvw', `${vv.width}px`);
    document.documentElement.style.setProperty('--vvh', `${vv.height}px`);
  }

  function hardenDialogs(){
    ['mbg','ovmbg','bkbg'].forEach(id=>{
      const el = byId(id);
      if(!el) return;
      el.addEventListener('transitionend', ()=>{ el.scrollLeft = 0; }, {passive:true});
      el.addEventListener('click', ()=>{ el.scrollLeft = 0; }, {passive:true});
    });
  }

  function protectLocalStorageKeys(){
    // Só registra um lembrete técnico. Não intercepta nem reescreve dados.
    const expected = ['pj3_pv','pj3_pw','pj3_pf','pj3_pr','pj3_ph','pj3_pu'];
    document.documentElement.dataset.pejStorageKeys = expected.join(',');
  }

  ready(()=>{
    syncViewportVars();
    window.visualViewport?.addEventListener('resize', syncViewportVars, {passive:true});
    window.addEventListener('orientationchange', syncViewportVars, {passive:true});

    buildMenuControls();
    buildOperationalDock();
    ensureMenuActions();
    addDynamicActions();
    hardenDialogs();
    protectLocalStorageKeys();
    updateGlobalTitle();
    setAppBottomAnchor();
    window.setTimeout(()=>{ updateGlobalTitle(); setAppBottomAnchor(); }, 300);
    window.setTimeout(setAppBottomAnchor, 900);

    if('MutationObserver' in window){
      const mo = new MutationObserver(updateGlobalTitle);
      ['st-total','st-pw','st-pv'].forEach(id=>{ const el = byId(id); if(el) mo.observe(el, {childList:true, characterData:true, subtree:true}); });
      const grid = byId('grid');
      if(grid) mo.observe(grid, {childList:true, subtree:false});
    }
  });
})();
