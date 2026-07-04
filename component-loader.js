function globalLoading(ms = 700){
  document.body.classList.add('loading');
  const el = document.getElementById('sf-pop');
  if(el){
    el.classList.add('global');
    el.classList.remove('on');
    void el.offsetWidth;
    el.classList.add('on');
  }
  clearTimeout(globalLoading._t);
  globalLoading._t = setTimeout(() => {
    document.body.classList.remove('loading');
    if(el) el.classList.remove('on');
  }, ms);
}

function createStaticSunflowerMosaic(){
  // 
}

function refreshStaticSunflowerMosaic(){
  // 
}
