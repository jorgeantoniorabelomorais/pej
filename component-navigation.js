function getFocusableElements(){
  return [...document.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null && !el.closest('[hidden]'));
}

function bindArrowNavigation(){
  document.addEventListener('keydown', event => {
    if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(event.key)) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if(['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
    const items = getFocusableElements();
    if(!items.length) return;
    const currentIndex = items.indexOf(document.activeElement);
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + (forward ? 1 : -1) + items.length) % items.length;
    event.preventDefault();
    items[nextIndex].focus();
  });
}

function anchorWorkflowBottom(){
  const app = document.getElementById('app');
  if(!app) return;
  requestAnimationFrame(() => {
    app.scrollTop = 0;
  });
}
