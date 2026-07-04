window.BaseMain = {
  get version(){ return window.BaseMainState.version; },
  get themes(){ return [...window.BaseMainState.themes]; },
  globalLoading,
  createStaticSunflowerMosaic,
  refreshStaticSunflowerMosaic,
  setGlobalTitle,
  setTheme: applyTheme,
  setHand: applyHand,
  addMenuAction,
  openGlobalMenu,
  closeGlobalMenu,
  anchorWorkflowBottom
};
