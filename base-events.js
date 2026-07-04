function emitBaseEvent(name, detail = {}){
  document.dispatchEvent(new CustomEvent(`basemain:${name}`, {detail}));
}
