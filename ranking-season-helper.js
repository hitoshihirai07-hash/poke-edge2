(function(){
  const STORAGE_KEY = 'pokeedge_active_season_label';
  function uniq(arr){ return Array.from(new Set((arr||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))); }
  function num(label){ const m=String(label||'').match(/(\d+)/); return m ? parseInt(m[1],10) : 0; }
  function sortLabels(arr, desc){
    return uniq(arr).sort((a,b)=>{
      const av=num(a), bv=num(b);
      if(av !== bv) return desc ? bv-av : av-bv;
      return desc ? String(b).localeCompare(String(a),'ja') : String(a).localeCompare(String(b),'ja');
    });
  }
  function suffix(label){
    const n = num(label);
    if(!label || n === 1) return '';
    if(n) return `_s${n}`;
    const raw = String(label||'').trim();
    return raw ? ('_' + raw.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')) : '';
  }
  function file(baseName, label){
    const base = String(baseName||'').replace(/\.json$/,'');
    return `${base}${suffix(label)}.json`;
  }
  function getStored(){
    try{ return localStorage.getItem(STORAGE_KEY) || ''; }catch(_){ return ''; }
  }
  function setStored(label){
    const safe = String(label||'').trim();
    try{ if(safe) localStorage.setItem(STORAGE_KEY, safe); }catch(_){}
    try{ window.dispatchEvent(new CustomEvent('pokeedge:season-change',{detail:{season:safe}})); }catch(_){}
    return safe;
  }
  function resolve(labels, preferred){
    const list = sortLabels(labels, true);
    const want = String(preferred || getStored() || '').trim();
    if(want && list.includes(want)) return want;
    return list[0] || 'S1';
  }
  async function fetchSeasonData(){
    try{
      const r = await fetch('season.json', {cache:'no-cache'});
      if(!r.ok) throw new Error('season.json');
      const data = await r.json();
      return data && typeof data === 'object' ? data : {seasons:[]};
    }catch(_){
      return {seasons:[]};
    }
  }
  async function fetchJson(path, fallback){
    try{
      const r = await fetch(path, {cache:'no-cache'});
      if(!r.ok) throw new Error(path);
      return await r.json();
    }catch(_){
      return fallback;
    }
  }
  function syncSelect(select, labels, current){
    if(!select) return current;
    const list = sortLabels(labels, true);
    const active = resolve(list, current);
    select.innerHTML = list.map(label => `<option value="${String(label).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}">${String(label).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}</option>`).join('');
    select.value = active;
    return active;
  }
  window.pokeEdgeRankingSeason = {
    STORAGE_KEY,
    num,
    uniq,
    sortLabels,
    suffix,
    file,
    getStored,
    setStored,
    resolve,
    fetchSeasonData,
    fetchJson,
    syncSelect
  };
})();
