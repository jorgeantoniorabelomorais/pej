const THEME_ALIASES = Object.freeze({
  'Areia Solar':'AreiaSolar',
  'AreiaSolar':'AreiaSolar',
  'Abismo Solar':'AbismoSolar',
  'AbismoSolar':'AbismoSolar',
  'Roxo Total':'RoxoTotal',
  'RoxoTotal':'RoxoTotal',
  'Campo Azul':'CampoAzul',
  'CampoAzul':'CampoAzul',
  'Chama Roxa':'ChamaRoxa',
  'ChamaRoxa':'ChamaRoxa',
  'Gelo Noturno':'GeloNoturno',
  'GeloNoturno':'GeloNoturno',
  'Oito Bits':'OitoBits',
  'OitoBits':'OitoBits',
  'Papel Cinza':'PapelCinza',
  'PapelCinza':'PapelCinza',
  'Retro Claro':'RetroClaro',
  'RetroClaro':'RetroClaro',
  'Terminal Verde':'TerminalVerde',
  'TerminalVerde':'TerminalVerde',
  'Big Pinguim':'BigPinguim',
  'BigPinguim':'BigPinguim',
  'Malha Livre':'MalhaLivre',
  'MalhaLivre':'MalhaLivre',
  'Muralha Rubra':'MuralhaRubra',
  'MuralhaRubra':'MuralhaRubra',
  'AllPurple':'RoxoTotal',
  'Grayscale':'Cinza',
  'SolarizedLight':'AreiaSolar',
  'SolarizedDark':'AbismoSolar',
  'Daemon':'Beastie',
  'Atlântico':'Atlantico',
  'Atlântico':'Atlantico',
  'Atlântico':'Atlantico'
});

function compactThemeName(theme){
  return String(theme || '').trim().replace(/\s+/g, '');
}

function normalizeThemeName(theme){
  const raw = String(theme || '').trim();
  const compact = compactThemeName(raw);
  return THEME_ALIASES[raw] || THEME_ALIASES[compact] || compact;
}

function canonicalThemeList(){
  const state = window.BaseMainState || {};
  const rawThemes = Array.isArray(state.themes) ? state.themes : [];
  const unique = [];

  rawThemes.forEach(theme => {
    const normalized = normalizeThemeName(theme);
    if(normalized && !/\s/.test(normalized) && !unique.includes(normalized)) unique.push(normalized);
  });

  if(!unique.includes('Ciano')) unique.unshift('Ciano');
  state.themes = unique;
  window.BaseMainState = state;
  return unique;
}

function validTheme(theme){
  const themes = canonicalThemeList();
  const normalized = normalizeThemeName(theme);
  return themes.includes(normalized) ? normalized : 'Ciano';
}

function themeLabel(theme){
  return validTheme(theme).replace(/\s+/g, '');
}

function getPreferredTheme(){
  const {storage} = window.BaseMainState;
  const saved = localStorage.getItem(storage.theme);
  const safeTheme = validTheme(saved || document.documentElement.dataset.theme || 'Ciano');

  if(saved !== safeTheme) localStorage.setItem(storage.theme, safeTheme);
  return safeTheme;
}

function orderedThemes(currentTheme){
  const themes = canonicalThemeList();
  const safeCurrent = validTheme(currentTheme);
  return [safeCurrent, ...themes.filter(theme => theme !== safeCurrent)];
}

function closeThemeList(){
  const trigger = document.getElementById('themeTrigger');
  const list = document.getElementById('themeList');
  if(!trigger || !list) return;
  list.hidden = true;
  trigger.setAttribute('aria-expanded','false');
}

function openThemeList(){
  const trigger = document.getElementById('themeTrigger');
  const list = document.getElementById('themeList');
  if(!trigger || !list) return;
  renderThemeOptions(getPreferredTheme());
  list.hidden = false;
  trigger.setAttribute('aria-expanded','true');
  list.scrollTop = 0;
  const first = list.querySelector('.theme-option');
  first?.focus({preventScroll:true});
}

function focusThemeOption(direction = 1){
  const list = document.getElementById('themeList');
  if(!list || list.hidden) return;
  const options = [...list.querySelectorAll('.theme-option')];
  if(!options.length) return;
  const activeIndex = options.indexOf(document.activeElement);
  const baseIndex = activeIndex >= 0 ? activeIndex : 0;
  const nextIndex = (baseIndex + direction + options.length) % options.length;
  options.forEach((option, index) => option.tabIndex = index === nextIndex ? 0 : -1);
  options[nextIndex].focus({preventScroll:true});
}

function chooseTheme(theme){
  applyTheme(theme);
  closeThemeList();
  document.getElementById('themeTrigger')?.focus({preventScroll:true});
  globalLoading?.(320);
}

function syncThemeCompatInput(currentTheme){
  let compat = document.getElementById('themeSelect');

  if(compat && compat.tagName === 'SELECT'){
    const replacement = document.createElement('input');
    replacement.type = 'hidden';
    replacement.id = 'themeSelect';
    replacement.name = compat.name || 'theme';
    compat.replaceWith(replacement);
    compat = replacement;
  }

  if(compat) compat.value = validTheme(currentTheme);
}

function renderCustomThemeOptions(currentTheme){
  const trigger = document.getElementById('themeTrigger');
  const list = document.getElementById('themeList');
  if(!trigger || !list) return;

  const safeTheme = validTheme(currentTheme);
  const ordered = orderedThemes(safeTheme);
  trigger.textContent = `Tema:${themeLabel(safeTheme)}`;
  trigger.dataset.currentTheme = safeTheme;

  const buttons = ordered.map((theme, index) => {
    const safeOption = validTheme(theme);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-option';
    button.id = `themeOption-${index}-${safeOption}`;
    button.setAttribute('role','option');
    button.textContent = themeLabel(safeOption);
    button.dataset.themeOption = safeOption;
    button.setAttribute('aria-selected', safeOption === safeTheme ? 'true' : 'false');
    button.tabIndex = index === 0 ? 0 : -1;
    button.addEventListener('click', () => chooseTheme(safeOption));
    return button;
  });

  list.replaceChildren(...buttons);
  trigger.setAttribute('aria-activedescendant', buttons[0]?.id || '');
}

function renderThemeOptions(currentTheme){
  const safeTheme = validTheme(currentTheme);
  syncThemeCompatInput(safeTheme);
  renderCustomThemeOptions(safeTheme);
}

function applyTheme(theme){
  const {storage} = window.BaseMainState;
  const safeTheme = validTheme(theme);
  document.documentElement.dataset.theme = safeTheme;
  localStorage.setItem(storage.theme, safeTheme);
  renderThemeOptions(safeTheme);
  emitBaseEvent('themechange', {theme:safeTheme});
}

function bindCustomThemePicker(){
  const trigger = document.getElementById('themeTrigger');
  const list = document.getElementById('themeList');
  if(!trigger || !list || trigger.dataset.themeBound === 'true') return;
  trigger.dataset.themeBound = 'true';

  trigger.addEventListener('click', () => {
    list.hidden ? openThemeList() : closeThemeList();
  });

  trigger.addEventListener('keydown', event => {
    if(['ArrowUp','ArrowDown','Enter',' '].includes(event.key)){
      event.preventDefault();
      openThemeList();
    }
  });

  list.addEventListener('keydown', event => {
    if(event.key === 'Escape'){
      event.preventDefault();
      closeThemeList();
      trigger.focus({preventScroll:true});
      return;
    }
    if(event.key === 'ArrowDown'){
      event.preventDefault();
      focusThemeOption(1);
      return;
    }
    if(event.key === 'ArrowUp'){
      event.preventDefault();
      focusThemeOption(-1);
      return;
    }
    if(event.key === 'Home'){
      event.preventDefault();
      const options = [...list.querySelectorAll('.theme-option')];
      options.forEach((option, index) => option.tabIndex = index === 0 ? 0 : -1);
      options[0]?.focus({preventScroll:true});
      return;
    }
    if(event.key === 'End'){
      event.preventDefault();
      const options = [...list.querySelectorAll('.theme-option')];
      const last = options.length - 1;
      options.forEach((option, index) => option.tabIndex = index === last ? 0 : -1);
      options[last]?.focus({preventScroll:true});
      return;
    }
    if(['Enter',' '].includes(event.key)){
      const option = document.activeElement?.closest?.('.theme-option');
      if(option){
        event.preventDefault();
        chooseTheme(option.dataset.themeOption);
      }
    }
  });

  document.addEventListener('click', event => {
    if(list.hidden) return;
    if(trigger.contains(event.target) || list.contains(event.target)) return;
    closeThemeList();
  });
}

function populateThemes(){
  syncThemeCompatInput(getPreferredTheme());
  const current = getPreferredTheme();
  renderThemeOptions(current);
  bindCustomThemePicker();
}
