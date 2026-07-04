function initBaseMain(){
  populateThemes();
  applyTheme(getPreferredTheme());
  applyHand(localStorage.getItem(window.BaseMainState.storage.hand) || 'Destro');
  bindActions();
  bindMenu();
  bindContextAndHold();
  bindArrowNavigation();
  anchorWorkflowBottom();
}

document.addEventListener('DOMContentLoaded', initBaseMain);
