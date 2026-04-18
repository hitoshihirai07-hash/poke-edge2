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

  if(_currentUser) {
    await migrateLocalPartiesToCloud();
  }

  sb.auth.onAuthStateChange(async (_event, session) => {
    _currentUser = session?.user || null;
    if(_currentUser) {
      await migrateLocalPartiesToCloud();
    }
    renderAuthUI();
    if(typeof renderSavedPartyList === 'function') {
      try { await renderSavedPartyList(); } catch(e) { console.warn('renderSavedPartyList error', e); }
    }
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

function loadLocalPartiesRaw() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_PARTY_KEY)||'[]');
    return Array.isArray(data) ? data : [];
  } catch(e) {
    return [];
  }
}

function saveLocalPartiesRaw(parties) {
  localStorage.setItem(LS_PARTY_KEY, JSON.stringify(Array.isArray(parties) ? parties : []));
}

function normalizePartyRecord(record) {
  const base = record && record.data ? record.data : (record || {});
  return {
    id: record && record.id ? record.id : Date.now().toString(36) + Math.random().toString(36).slice(2,8),
    name: record && record.name ? record.name : (base.name || 'パーティ'),
    data: base,
    created_at: record && record.created_at ? record.created_at : new Date().toISOString()
  };
}

function partyComparableKey(record) {
  const normalized = normalizePartyRecord(record);
  const data = normalized.data || {};
  const members = Array.isArray(data.members) ? data.members : [];
  const memberKey = members.map(m => {
    const ev = m && m.ev ? m.ev : {};
    const moves = Array.isArray(m && m.moves) ? m.moves.map(x => x && x.name ? x.name : '').join('/') : '';
    return [
      m && m.pokeName || '',
      m && m.lv || '',
      m && m.nature || '',
      m && m.ability || '',
      m && m.item || '',
      m && m.gameMode || '',
      ev.hp || 0, ev.atk || 0, ev.def || 0, ev.spa || 0, ev.spd || 0, ev.spe || 0,
      moves
    ].join('|');
  }).join('||');
  return JSON.stringify([normalized.name || '', memberKey]);
}

function dedupePartyRecords(records) {
  const map = new Map();
  (records || []).forEach(record => {
    const normalized = normalizePartyRecord(record);
    const key = partyComparableKey(normalized);
    const current = map.get(key);
    if(!current) {
      map.set(key, normalized);
      return;
    }
    const currentTime = new Date(current.created_at || 0).getTime() || 0;
    const nextTime = new Date(normalized.created_at || 0).getTime() || 0;
    if(nextTime >= currentTime) {
      map.set(key, normalized);
    }
  });
  return Array.from(map.values()).sort((a,b) => {
    const ta = new Date(a.created_at || 0).getTime() || 0;
    const tb = new Date(b.created_at || 0).getTime() || 0;
    return tb - ta;
  });
}

async function loadCloudPartiesRaw() {
  if(!isLoggedIn()) return [];
  const { data, error } = await getSB()
    .from('parties')
    .select('*')
    .eq('user_id', _currentUser.id)
    .order('created_at', { ascending: false });
  return (!error && Array.isArray(data)) ? data : [];
}

async function migrateLocalPartiesToCloud() {
  if(!isLoggedIn()) return false;

  const localParties = loadLocalPartiesRaw().map(normalizePartyRecord);
  if(!localParties.length) return true;

  const cloudParties = (await loadCloudPartiesRaw()).map(normalizePartyRecord);
  const cloudKeys = new Set(cloudParties.map(partyComparableKey));
  const inserts = localParties
    .filter(record => !cloudKeys.has(partyComparableKey(record)))
    .map(record => ({
      user_id: _currentUser.id,
      name: record.name,
      data: record.data,
      created_at: record.created_at
    }));

  if(!inserts.length) return true;

  const { error } = await getSB().from('parties').insert(inserts);
  return !error;
}

async function loadParties() {
  const local = loadLocalPartiesRaw().map(normalizePartyRecord);

  if(!isLoggedIn()) {
    return dedupePartyRecords(local);
  }

  const cloud = (await loadCloudPartiesRaw()).map(normalizePartyRecord);
  return dedupePartyRecords([].concat(cloud, local));
}

async function saveParty(name, partyData) {
  const record = normalizePartyRecord({
    id: Date.now().toString(),
    name,
    data: partyData,
    created_at: new Date().toISOString()
  });

  if(!isLoggedIn()) {
    const saved = loadLocalPartiesRaw().map(normalizePartyRecord);
    saved.unshift(record);
    saveLocalPartiesRaw(dedupePartyRecords(saved).slice(0, 20));
    return true;
  }

  const { error } = await getSB().from('parties').insert({
    user_id: _currentUser.id,
    name: record.name,
    data: record.data,
    created_at: record.created_at
  });
  return !error;
}

async function deleteParty(id) {
  const local = loadLocalPartiesRaw().map(normalizePartyRecord);
  const nextLocal = local.filter(p => String(p.id) !== String(id));
  if(nextLocal.length !== local.length) {
    saveLocalPartiesRaw(nextLocal);
  }

  if(!isLoggedIn()) {
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
