function applyHand(hand){
  const safeHand = hand === 'Canhoto' ? 'Canhoto' : 'Destro';
  document.documentElement.dataset.hand = safeHand;
  localStorage.setItem(window.BaseMainState.storage.hand, safeHand);
  document.querySelectorAll('[data-hand-option]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.handOption === safeHand));
  });
  emitBaseEvent('handchange', {hand:safeHand});
}
