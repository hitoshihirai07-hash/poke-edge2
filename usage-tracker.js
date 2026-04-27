// ===== PokeEdge 管理者向け利用状況記録 =====
// 個人情報や検索語句は保存せず、ページ名・イベント名・匿名キーだけを記録します。
(function(){
  'use strict';
  const TABLE = 'site_analytics_events';
  const SESSION_KEY = 'pokeedge_usage_session_v2';
  const SENT_LOGIN_KEY = 'pokeedge_usage_login_seen_v2';
  const QUEUE_KEY = 'pokeedge_usage_queue_v2';
  const DEBOUNCE = new Map();

  function safePage(){
    let last = (location.pathname.split('/').pop() || 'index').split('?')[0].split('#')[0].trim();
    const aliases = {
      index:'index.html', calc:'calc.html', endure:'endure.html', move:'move.html', party:'party.html', pokemon:'pokemon.html', items:'items.html', scope:'scope.html', season:'season.html', speed:'speed.html', stats:'stats.html', blog:'blog.html', policy:'policy.html', admin:'admin.html', auth:'auth.html'
    };
    if(!last || last === '/') return 'index.html';
    if(aliases[last]) return aliases[last];
    return last || 'index.html';
  }
  function getSessionKey(){
    try{
      let key = localStorage.getItem(SESSION_KEY);
      if(!key){
        key = 'anon_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,12);
        localStorage.setItem(SESSION_KEY, key);
      }
      return key;
    }catch(e){ return 'anon_unavailable'; }
  }
  async function sha256(text){
    try{
      if(!window.crypto || !crypto.subtle) return String(text || '').slice(0,120);
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(text||'')));
      return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    }catch(e){ return String(text || '').slice(0,120); }
  }
  async function getLoginInfo(){
    try{
      const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
      if(!user || !user.id) return { logged_in:false, user_key:'' };
      return { logged_in:true, user_key: await sha256('pokeedge_user_' + user.id) };
    }catch(e){ return { logged_in:false, user_key:'' }; }
  }
  function getClient(){
    try{ if(typeof getSB === 'function') return getSB(); }catch(e){}
    return null;
  }
  function getConfig(){
    let url = '';
    let key = '';
    try{ if(typeof SUPABASE_URL !== 'undefined') url = SUPABASE_URL; }catch(e){}
    try{ if(typeof SUPABASE_KEY !== 'undefined') key = SUPABASE_KEY; }catch(e){}
    try{ if(window.SUPABASE_URL) url = window.SUPABASE_URL; }catch(e){}
    try{ if(window.SUPABASE_KEY) key = window.SUPABASE_KEY; }catch(e){}
    return {url, key};
  }
  function getQueue(){
    try{ const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); return Array.isArray(q) ? q : []; }catch(e){ return []; }
  }
  function setQueue(q){
    try{ localStorage.setItem(QUEUE_KEY, JSON.stringify((q || []).slice(-50))); }catch(e){}
  }
  function queuePayload(payload){
    const q = getQueue();
    q.push(payload);
    setQueue(q);
  }
  async function insertWithSupabase(payload){
    const sb = getClient();
    if(!sb) return { ok:false, reason:'no_supabase_client' };
    const { error } = await sb.from(TABLE).insert(payload);
    if(error) return { ok:false, reason:error.message || String(error) };
    return { ok:true };
  }
  async function insertWithRest(payload){
    const cfg = getConfig();
    if(!cfg.url || !cfg.key) return { ok:false, reason:'no_supabase_config' };
    try{
      const res = await fetch(cfg.url.replace(/\/$/,'') + '/rest/v1/' + TABLE, {
        method:'POST',
        headers:{
          'apikey': cfg.key,
          'Authorization': 'Bearer ' + cfg.key,
          'Content-Type':'application/json',
          'Prefer':'return=minimal'
        },
        body: JSON.stringify(payload),
        keepalive: true
      });
      if(!res.ok){
        let text = '';
        try{ text = await res.text(); }catch(e){}
        return { ok:false, reason:'REST ' + res.status + ' ' + text.slice(0,160) };
      }
      return { ok:true };
    }catch(e){ return { ok:false, reason:e.message || String(e) }; }
  }
  async function insertPayload(payload){
    let res = await insertWithSupabase(payload);
    if(res.ok) return true;
    const firstReason = res.reason;
    res = await insertWithRest(payload);
    if(res.ok) return true;
    if(!sessionStorage.getItem('pokeedge_usage_table_notice')){
      console.warn('[PokeEdge usage] 保存できませんでした。site_analytics_events のinsert権限、RLS、またはネットワークを確認してください。', firstReason, res.reason);
      sessionStorage.setItem('pokeedge_usage_table_notice','1');
    }
    return false;
  }
  async function flushQueue(){
    const q = getQueue();
    if(!q.length) return;
    const rest = [];
    for(const payload of q.slice(0,20)){
      const ok = await insertPayload(payload);
      if(!ok) rest.push(payload);
    }
    setQueue(rest.concat(q.slice(20)));
  }
  async function buildPayload(eventName, extra){
    const login = await getLoginInfo();
    return {
      page: safePage(),
      event_name: String(eventName || 'event').slice(0,80),
      session_key: await sha256(getSessionKey()),
      user_key: login.user_key || null,
      logged_in: !!login.logged_in,
      meta: extra && typeof extra === 'object' ? extra : {}
    };
  }
  async function track(eventName, extra){
    try{
      const payload = await buildPayload(eventName, extra);
      const ok = await insertPayload(payload);
      if(!ok) queuePayload(payload);
      return ok;
    }catch(e){
      console.warn('[PokeEdge usage] event skipped', e);
      return false;
    }
  }
  function debounceTrack(key, eventName, ms){
    clearTimeout(DEBOUNCE.get(key));
    DEBOUNCE.set(key, setTimeout(()=>track(eventName), ms || 900));
  }
  function wrapFunction(name, eventName, filter){
    let tries = 0;
    const timer = setInterval(()=>{
      tries++;
      const fn = window[name];
      if(typeof fn === 'function' && !fn.__pokeedgeUsageWrapped){
        const wrapped = function(){
          try{ if(!filter || filter.apply(this, arguments) !== false) track(eventName); }catch(e){}
          return fn.apply(this, arguments);
        };
        wrapped.__pokeedgeUsageWrapped = true;
        window[name] = wrapped;
        clearInterval(timer);
      }
      if(tries > 60) clearInterval(timer);
    }, 100);
  }
  function installClickFallbacks(){
    document.addEventListener('click', function(ev){
      const el = ev.target && ev.target.closest ? ev.target.closest('button,a,input,select') : null;
      if(!el) return;
      const page = safePage();
      const text = String((el.textContent || el.value || el.getAttribute('aria-label') || '')).trim();
      const onclick = String(el.getAttribute('onclick') || '');
      if(page === 'calc.html' && (/計算/.test(text) || /calcDamage|calculate/.test(onclick))) track('calc_run_click');
      if(page === 'season.html' && /showDetail|openDetail/.test(onclick)) track('season_detail_open');
      if(page === 'move.html' && (/判定|計算/.test(text) || /renderResults|updateResults|calcAll/.test(onclick))) track('move_check_click');
      if(page === 'scope.html' && (/記録/.test(text) || /recordScopeBattle/.test(onclick))) track('scope_record_click');
      if(page === 'party.html' && (/保存/.test(text) || /saveParty/.test(onclick))) track('party_save_click');
      if(page === 'pokemon.html' && (/保存|登録/.test(text) || /savePokemon/.test(onclick))) track('pokemon_save_click');
      if(page === 'endure.html' && (/計算|実行|チェック/.test(text) || /Endure|calculate/.test(onclick))) track('endure_run_click');
    }, true);
  }
  function installPageHooks(){
    const page = safePage();
    installClickFallbacks();
    if(page === 'calc.html'){
      wrapFunction('calcDamage','calc_run', function(options){ return !(options && options.silent); });
      wrapFunction('calcAddDamage','calc_add_run');
      wrapFunction('saveCurrentCalcRecord','calc_record_save');
    }
    if(page === 'endure.html'){
      wrapFunction('calculateMatchup','endure_run');
      wrapFunction('runEndureScan','endure_run');
      wrapFunction('scanEndure','endure_run');
    }
    if(page === 'move.html'){
      wrapFunction('renderResults','move_check');
      wrapFunction('updateResults','move_check');
      wrapFunction('calcAll','move_check');
    }
    if(page === 'scope.html'){
      wrapFunction('goToBattle','scope_select_decide');
      wrapFunction('recordScopeBattle','scope_record');
      wrapFunction('showPhase','scope_tab', function(n){ if(String(n)==='3') track('scope_damage_tab'); return false; });
    }
    if(page === 'party.html'){
      wrapFunction('savePartyLocal','party_save');
      wrapFunction('saveParty','party_save');
      wrapFunction('loadPartyToEditor','party_load');
    }
    if(page === 'pokemon.html'){
      wrapFunction('savePokemon','pokemon_save');
      wrapFunction('savePokemonData','pokemon_save');
    }
    if(page === 'season.html'){
      const searchIds = ['name-search','season-search','search-input'];
      searchIds.forEach(id=>{
        const search = document.getElementById(id);
        if(search){ search.addEventListener('input', ()=>debounceTrack('season_search','season_search',1000)); }
      });
      const typeIds = ['type-filter','season-type-filter'];
      typeIds.forEach(id=>{
        const type = document.getElementById(id);
        if(type){ type.addEventListener('change', ()=>track('season_type_filter')); }
      });
      wrapFunction('showDetail','season_detail_open');
      wrapFunction('openDetail','season_detail_open');
    }
  }
  async function recordLoginSeen(){
    const login = await getLoginInfo();
    if(!login.logged_in || !login.user_key) return;
    const today = new Date().toISOString().slice(0,10);
    const key = today + ':' + login.user_key.slice(0,16);
    try{
      if(localStorage.getItem(SENT_LOGIN_KEY) === key) return;
      localStorage.setItem(SENT_LOGIN_KEY, key);
    }catch(e){}
    track('login_seen');
  }
  function init(){
    if(safePage() === 'admin.html') return;
    installPageHooks();
    setTimeout(flushQueue, 300);
    setTimeout(()=>track('page_view'), 800);
    setTimeout(recordLoginSeen, 1500);
    setTimeout(recordLoginSeen, 3000);
  }
  window.PokeEdgeUsage = { track, recordLoginSeen, flushQueue };
  window.PokeEdgeAnalytics = window.PokeEdgeUsage;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
