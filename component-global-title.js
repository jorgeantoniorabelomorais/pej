function setGlobalTitle(title, kicker = 'Base'){
  const titleEl = document.getElementById('globalTitle');
  const kickerEl = document.getElementById('globalKicker');
  const safeTitle = title || 'Nome do Projeto';
  const safeKicker = kicker || 'Base';
  if(titleEl) titleEl.textContent = safeTitle;
  if(kickerEl) kickerEl.textContent = safeKicker;
  emitBaseEvent('titlechange', {title:safeTitle, kicker:safeKicker});
}
