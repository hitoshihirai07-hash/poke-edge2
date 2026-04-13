// ===== PokeEdge Supabase 同期モジュール =====
const SUPABASE_URL = 'https://wxfnpzmvtzgrbwkpkgst.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Zm5wem12dHpncmJ3a3BrZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzAyNjcsImV4cCI6MjA5MDAwNjI2N30.l64CD1MfTRU-2su06nQJlRX06iQi7KWVv-yaqFw8WGE';

// supabase-jsはCDNから読み込み済み前提
let _sb = null;
function getSB() {
  if(!_sb) _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return _sb;
}

// ===== 認証状態 =====
let _currentUser = null;

async function initAuth() {
  const sb = getSB();
  const { data: { session } } = await sb.auth.getSession();
  _currentUser = session?.user || null;
  sb.auth.onAuthStateChange((_event, session) => {
    _currentUser = session?.user || null;
    renderAuthUI();
  });
  renderAuthUI();
  return _currentUser;
}

function getCurrentUser() { return _currentUser; }
function isLoggedIn()     { return !!_currentUser; }

async function signOut() {
  await getSB().auth.signOut();
  _currentUser = null;
  renderAuthUI();
}

// ===== ヘッダーに認証UIを描画 =====
function renderAuthUI() {
  const container = document.getElementById('auth-ui');
  if(!container) return;
  if(_currentUser) {
    const email = _currentUser.email || '';
    const short = email.length > 16 ? email.substring(0,14)+'...' : email;
    container.innerHTML = `
      <span style="font-size:10px;color:var(--text2);margin-right:6px;">${short}</span>
      <button onclick="signOut()" style="background:transparent;border:1px solid var(--border);color:var(--text2);padding:3px 10px;font-size:10px;font-family:'Noto Sans JP',sans-serif;cursor:pointer;transition:all 0.18s;"
        onmouseover="this.style.borderColor='var(--accent2)';this.style.color='var(--accent2)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">ログアウト</button>`;
  } else {
    container.innerHTML = `
      <a href="auth.html?redirect=${encodeURIComponent(location.pathname.split('/').pop())}"
        style="background:linear-gradient(135deg,var(--accent),#007a99);color:#000;padding:4px 14px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:2px;text-decoration:none;display:inline-block;">ログイン</a>`;
  }
}

// ===== ポケモン登録データ =====
const LS_KEY = 'pokeedge_pokemon_v1';

// ローカルから読む
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)||'[]'); } catch(e) { return []; }
}
// ローカルに保存
function saveLocal(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// クラウドから取得
async function loadCloud() {
  if(!isLoggedIn()) return null;
  const { data, error } = await getSB()
    .from('pokemon_registrations')
    .select('data')
    .eq('user_id', _currentUser.id)
    .single();
  if(error || !data) return null;
  return data.data;
}

// クラウドに保存（upsert）
async function saveCloud(pokemons) {
  if(!isLoggedIn()) return false;
  const { error } = await getSB()
    .from('pokemon_registrations')
    .upsert({
      user_id: _currentUser.id,
      data: pokemons,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  return !error;
}

// 初期化：クラウドとローカルをマージ
async function initPokemonData() {
  const local = loadLocal();
  if(!isLoggedIn()) return local;

  const cloud = await loadCloud();
  if(!cloud) {
    // クラウドが空→ローカルをクラウドに同期
    if(local.length > 0) await saveCloud(local);
    return local;
  }

  // クラウドのデータを優先（最新）
  saveLocal(cloud);
  return cloud;
}

// 保存（ローカル＋クラウド同時）
async function savePokemonData(pokemons) {
  saveLocal(pokemons);
  if(isLoggedIn()) {
    const ok = await saveCloud(pokemons);
    return ok;
  }
  return true;
}

// ===== パーティデータ =====
const LS_PARTY_KEY = 'pokeedge_parties';

async function loadParties() {
  if(!isLoggedIn()) {
    try { return JSON.parse(localStorage.getItem(LS_PARTY_KEY)||'[]'); } catch(e) { return []; }
  }
  const { data, error } = await getSB()
    .from('parties')
    .select('*')
    .eq('user_id', _currentUser.id)
    .order('created_at', { ascending: false });
  return (!error && data) ? data : [];
}

async function saveParty(name, partyData) {
  if(!isLoggedIn()) {
    const saved = JSON.parse(localStorage.getItem(LS_PARTY_KEY)||'[]');
    saved.unshift({ id: Date.now().toString(), name, data: partyData, created_at: new Date().toISOString() });
    if(saved.length > 20) saved.pop();
    localStorage.setItem(LS_PARTY_KEY, JSON.stringify(saved));
    return true;
  }
  const { error } = await getSB().from('parties').insert({
    user_id: _currentUser.id,
    name,
    data: partyData,
  });
  return !error;
}

async function deleteParty(id) {
  if(!isLoggedIn()) {
    const saved = JSON.parse(localStorage.getItem(LS_PARTY_KEY)||'[]').filter(p=>p.id!=id);
    localStorage.setItem(LS_PARTY_KEY, JSON.stringify(saved));
    return true;
  }
  const { error } = await getSB().from('parties').delete().eq('id', id).eq('user_id', _currentUser.id);
  return !error;
}

// ===== 対戦記録 =====
const LS_BATTLE_KEY = 'pokeedge_battles_v1';

async function saveBattleRecord(record) {
  if(!isLoggedIn()) {
    const records = JSON.parse(localStorage.getItem(LS_BATTLE_KEY)||'[]');
    records.unshift(record);
    if(records.length > 200) records.pop();
    localStorage.setItem(LS_BATTLE_KEY, JSON.stringify(records));
    return true;
  }
  const { error } = await getSB().from('battle_records').insert({
    user_id: _currentUser.id,
    data: record,
  });
  return !error;
}

async function loadBattleRecords(limit=100) {
  if(!isLoggedIn()) {
    try { return JSON.parse(localStorage.getItem(LS_BATTLE_KEY)||'[]'); } catch(e) { return []; }
  }
  const { data, error } = await getSB()
    .from('battle_records')
    .select('id, data, created_at')
    .eq('user_id', _currentUser.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (!error && data) ? data.map(r=>({...r.data, _id:r.id, date:r.created_at?.split('T')[0]})) : [];
}

async function deleteBattleRecord(id) {
  if(!isLoggedIn()) {
    const records = JSON.parse(localStorage.getItem(LS_BATTLE_KEY)||'[]').filter((_,i)=>i!=id);
    localStorage.setItem(LS_BATTLE_KEY, JSON.stringify(records));
    return true;
  }
  const { error } = await getSB().from('battle_records').delete().eq('id', id).eq('user_id', _currentUser.id);
  return !error;
}
