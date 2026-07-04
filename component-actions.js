function bindActions(){
  document.querySelectorAll('[data-action="demo-loading"]').forEach(btn => {
    btn.addEventListener('click', () => globalLoading(900));
  });

  document.querySelectorAll('[data-action="sample-title"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const now = new Date();
      setGlobalTitle(`Projeto · ${now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`, 'Dinâmico');
      closeGlobalMenu();
    });
  });

  document.querySelectorAll('[data-action="focus-app"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const app = document.getElementById('app');
      if(app) app.focus({preventScroll:false});
      closeGlobalMenu();
    });
  });

  document.querySelectorAll('[data-action="open-settings"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById('settingsPanel');
      if(panel) panel.open = true;
    });
  });

  document.querySelectorAll('[data-hand-option]').forEach(btn => {
    btn.addEventListener('click', () => applyHand(btn.dataset.handOption));
  });
}

function bindContextAndHold(){
  document.addEventListener('contextmenu', event => {
    const action = event.target.closest('[data-context-click]');
    if(!action || action.disabled) return;
    event.preventDefault();
    action.click();
  });

  document.querySelectorAll('[data-hold]').forEach(el => {
    let timer = 0;
    let holdTriggered = false;
    const clear = () => window.clearTimeout(timer);

    el.addEventListener('click', event => {
      if(!holdTriggered) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      holdTriggered = false;
    }, true);

    el.addEventListener('pointerdown', event => {
      if(event.pointerType === 'mouse' && event.button !== 0) return;
      clear();
      holdTriggered = false;
      timer = window.setTimeout(() => {
        holdTriggered = true;
        if(el.id === 'globalMenuToggle') openGlobalMenu();
      }, 520);
    });
    el.addEventListener('pointerup', clear);
    el.addEventListener('pointerleave', clear);
    el.addEventListener('pointercancel', clear);
  });
}
