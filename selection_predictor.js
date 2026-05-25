const TYPE_CHART = {
  "ノーマル": {"いわ":0.5,"ゴースト":0,"はがね":0.5},
  "ほのお": {"ほのお":0.5,"みず":0.5,"くさ":2,"こおり":2,"むし":2,"いわ":0.5,"ドラゴン":0.5,"はがね":2},
  "みず": {"ほのお":2,"みず":0.5,"くさ":0.5,"じめん":2,"いわ":2,"ドラゴン":0.5},
  "でんき": {"みず":2,"でんき":0.5,"くさ":0.5,"じめん":0,"ひこう":2,"ドラゴン":0.5},
  "くさ": {"ほのお":0.5,"みず":2,"くさ":0.5,"どく":0.5,"じめん":2,"ひこう":0.5,"むし":0.5,"いわ":2,"ドラゴン":0.5,"はがね":0.5},
  "こおり": {"ほのお":0.5,"みず":0.5,"くさ":2,"こおり":0.5,"じめん":2,"ひこう":2,"ドラゴン":2,"はがね":0.5},
  "かくとう": {"ノーマル":2,"こおり":2,"どく":0.5,"ひこう":0.5,"エスパー":0.5,"むし":0.5,"いわ":2,"ゴースト":0,"あく":2,"はがね":2,"フェアリー":0.5},
  "どく": {"くさ":2,"どく":0.5,"じめん":0.5,"いわ":0.5,"ゴースト":0.5,"はがね":0,"フェアリー":2},
  "じめん": {"ほのお":2,"でんき":2,"くさ":0.5,"どく":2,"ひこう":0,"むし":0.5,"いわ":2,"はがね":2},
  "ひこう": {"でんき":0.5,"くさ":2,"かくとう":2,"むし":2,"いわ":0.5,"はがね":0.5},
  "エスパー": {"かくとう":2,"どく":2,"エスパー":0.5,"あく":0,"はがね":0.5},
  "むし": {"ほのお":0.5,"くさ":2,"かくとう":0.5,"どく":0.5,"ひこう":0.5,"エスパー":2,"ゴースト":0.5,"あく":2,"はがね":0.5,"フェアリー":0.5},
  "いわ": {"ほのお":2,"こおり":2,"かくとう":0.5,"じめん":0.5,"ひこう":2,"むし":2,"はがね":0.5},
  "ゴースト": {"ノーマル":0,"エスパー":2,"ゴースト":2,"あく":0.5},
  "ドラゴン": {"ドラゴン":2,"はがね":0.5,"フェアリー":0},
  "あく": {"かくとう":0.5,"エスパー":2,"ゴースト":2,"あく":0.5,"フェアリー":0.5},
  "はがね": {"ほのお":0.5,"みず":0.5,"でんき":0.5,"こおり":2,"いわ":2,"はがね":0.5,"フェアリー":2},
  "フェアリー": {"ほのお":0.5,"かくとう":2,"どく":0.5,"ドラゴン":2,"あく":2,"はがね":0.5}
};

const ROLE_MOVES = {
  trickRoom: ["トリックルーム"],
  weather: ["にほんばれ","あまごい","すなあらし","ゆきげしき"],
  hazards: ["ステルスロック","まきびし","どくびし"],
  setup: ["つるぎのまい","わるだくみ","りゅうのまい","めいそう","ビルドアップ","からをやぶる"],
  pivot: ["とんぼがえり","ボルトチェンジ","クイックターン"],
  speedControl: ["こごえるかぜ","がんせきふうじ","でんじは","おいかぜ","トリックルーム"],
  support: ["あくび","おにび","ちょうはつ","アンコール","リフレクター","ひかりのかべ","このゆびとまれ"]
};

const NATURES = {
  "がんばりや":{atk:1,def:1,spa:1,spd:1,spe:1}, "すなお":{atk:1,def:1,spa:1,spd:1,spe:1}, "てれや":{atk:1,def:1,spa:1,spd:1,spe:1}, "きまぐれ":{atk:1,def:1,spa:1,spd:1,spe:1}, "まじめ":{atk:1,def:1,spa:1,spd:1,spe:1},
  "さみしがり":{atk:1.1,def:.9,spa:1,spd:1,spe:1}, "いじっぱり":{atk:1.1,def:1,spa:.9,spd:1,spe:1}, "やんちゃ":{atk:1.1,def:1,spa:1,spd:.9,spe:1}, "ゆうかん":{atk:1.1,def:1,spa:1,spd:1,spe:.9},
  "ずぶとい":{atk:.9,def:1.1,spa:1,spd:1,spe:1}, "わんぱく":{atk:1,def:1.1,spa:.9,spd:1,spe:1}, "のうてんき":{atk:1,def:1.1,spa:1,spd:.9,spe:1}, "のんき":{atk:1,def:1.1,spa:1,spd:1,spe:.9},
  "ひかえめ":{atk:.9,def:1,spa:1.1,spd:1,spe:1}, "おっとり":{atk:1,def:.9,spa:1.1,spd:1,spe:1}, "うっかりや":{atk:1,def:1,spa:1.1,spd:.9,spe:1}, "れいせい":{atk:1,def:1,spa:1.1,spd:1,spe:.9},
  "おだやか":{atk:.9,def:1,spa:1,spd:1.1,spe:1}, "おとなしい":{atk:1,def:1,spa:.9,spd:1.1,spe:1}, "しんちょう":{atk:1,def:1,spa:.9,spd:1.1,spe:1}, "なまいき":{atk:1,def:1,spa:1,spd:1.1,spe:.9},
  "おくびょう":{atk:1,def:1,spa:1,spd:.9,spe:1.1}, "せっかち":{atk:1,def:.9,spa:1,spd:1,spe:1.1}, "ようき":{atk:1,def:1,spa:.9,spd:1,spe:1.1}, "むじゃき":{atk:1,def:1,spa:1,spd:.9,spe:1.1}
};

const $ = (id) => document.getElementById(id);
const PARTY_DRAFT_KEY = "pokeedge_party_draft_v1";
const PARTY_LIST_KEY = "pokeedge_parties";
const state = {
  pokemon: [],
  moves: [],
  byName: new Map(),
  moveByName: new Map(),
  megaByBase: new Map(),
  baseByMega: new Map(),
  ranking: new Map(),
  rankingSeason: "",
  rankingSource: "",
  rankingUpdatedAt: "",
  rankingError: "",
  partySamples: [],
  savedParties: [],
  player: Array(6).fill(null),
  opponent: Array(6).fill(null),
  activeSide: "player",
  leadName: "",
  secondName: "",
  manualPlayer: [],
  manualOpponent: [],
  predictions: null
};

init();

async function init(){
  const [pokemon, rankingBundle, partyList, moves, megaData] = await Promise.all([
    fetchJson("pokemon.json", []),
    loadLatestRankingData(),
    fetchJson("party_list.json", {parties: []}),
    fetchJson("moves.json", []),
    fetchJson("mega.json", {rows: [], baseToForms: {}, formToBase: {}})
  ]);
  const ranking = rankingBundle.data || {rows: []};
  state.pokemon = pokemon.filter(p => p && p.name).map(p => ({...p, types: [p.type1, p.type2].filter(Boolean)}));
  state.moves = moves.filter(m => m && m.name);
  state.pokemon.forEach(p => state.byName.set(p.name, p));
  state.moves.forEach(m => state.moveByName.set(m.name, m));
  (ranking.rows || []).forEach(r => state.ranking.set(displayName(r.name || r.siteName), r));
  state.rankingSeason = rankingBundle.season || "";
  state.rankingSource = rankingBundle.source || "";
  state.rankingUpdatedAt = (ranking.rows || []).find(row => row?.updatedAt)?.updatedAt || "";
  state.rankingError = rankingBundle.error || "";
  buildMegaMaps(megaData);
  state.partySamples = partyList.parties || [];
  state.savedParties = buildSavedPartyOptions(partyList);
  bind();
  renderAll();
  renderSavedPartySelect();
  renderRankingInfo();
  $("status").textContent = `読込完了: ${state.pokemon.length}匹 / ランキング${state.rankingSeason || "-"} ${state.ranking.size}件 / パーティ${state.savedParties.length}件`;
}

function bind(){
  document.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  $("playerSearch").addEventListener("input", () => renderSuggest("player"));
  $("opponentSearch").addEventListener("input", () => renderSuggest("opponent"));
  $("playerClear").addEventListener("click", () => { state.player = Array(6).fill(null); state.manualPlayer = []; renderAll(); });
  $("opponentClear").addEventListener("click", () => { state.opponent = Array(6).fill(null); state.manualOpponent = []; state.leadName = ""; state.secondName = ""; state.predictions = null; renderAll(); });
  $("runPredict").addEventListener("click", runPredict);
  $("loadSample").addEventListener("click", loadSample);
  $("loadSavedParty").addEventListener("click", loadSelectedSavedParty);
  $("loadPartyDraft").addEventListener("click", loadPartyDraft);
  $("runDamage").addEventListener("click", renderDamageResults);
  $("damagePlayerSelect").addEventListener("change", renderDamageResults);
  $("damageOpponentSelect").addEventListener("change", renderDamageResults);
  $("applyTopManual").addEventListener("click", applyTopPredictionToManual);
  $("clearManual").addEventListener("click", () => {
    state.manualPlayer = [];
    state.manualOpponent = [];
    renderManualTab();
  });
  $("savePlayer").addEventListener("click", () => {
    localStorage.setItem("selection_predictor_player", JSON.stringify(state.player.map(p => p?.name || "")));
    $("status").textContent = "自分6匹を保存しました";
  });
  $("loadPlayer").addEventListener("click", () => {
    const names = JSON.parse(localStorage.getItem("selection_predictor_player") || "[]");
    state.player = Array(6).fill(null).map((_, i) => state.byName.get(names[i]) || null);
    renderAll();
  });
}

function switchTab(tab){
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
  $("predictTab").classList.toggle("active", tab === "predict");
  $("manualTab").classList.toggle("active", tab === "manual");
  $("damageTab").classList.toggle("active", tab === "damage");
  if(tab === "manual") {
    renderManualTab();
  }
  if(tab === "damage") {
    renderDamageSelectors();
    renderDamageResults();
  }
}

async function fetchJson(path, fallback){
  try{
    const res = await fetch(cacheBust(path), {cache: "no-store"});
    if(!res.ok) return fallback;
    return await res.json();
  }catch(e){
    $("status").textContent = "データを読み込めません。ページを更新してください。";
    return fallback;
  }
}

async function fetchJsonOptional(path){
  try{
    const res = await fetch(cacheBust(path), {cache: "no-store"});
    if(!res.ok) return null;
    return await res.json();
  }catch(_e){
    return null;
  }
}

function cacheBust(path){
  const sep = String(path).includes("?") ? "&" : "?";
  return `${path}${sep}_=${Date.now()}`;
}

function renderRankingInfo(){
  const box = $("rankingInfo");
  if(!box) return;
  const detail = state.rankingError
    ? `<br><span class="rank-error">${escapeHtml(state.rankingError)}</span>`
    : "";
  box.innerHTML = `使用中ランキング: <strong>${escapeHtml(state.rankingSeason || "-")}</strong>${state.rankingUpdatedAt ? ` / 更新日 ${escapeHtml(state.rankingUpdatedAt)}` : ""}${detail}`;
}

async function loadLatestRankingData(){
  const seasonData = await fetchJson("season.json", {seasons: ["S1"]});
  const candidates = sortSeasonLabels(seasonData.seasons || ["S1"], true);
  const latest = candidates[0] || "S1";
  for(const season of candidates){
    const source = rankingFileName("season_ranking_single", season);
    const data = await fetchJsonOptional(source);
    if(data && Array.isArray(data.rows) && data.rows.length){
      return {data, season, source};
    }
  }
  return {
    data: {rows: []},
    season: latest,
    source: rankingFileName("season_ranking_single", latest),
    error: `${latest}のランキングデータを読み込めません。最新データが公開されているか確認してください。`
  };
}

function sortSeasonLabels(labels, desc = false){
  return [...new Set((labels || []).filter(Boolean).map(label => String(label).trim()))].sort((a,b) => {
    const av = seasonNumber(a);
    const bv = seasonNumber(b);
    if(av !== bv) return desc ? bv - av : av - bv;
    return desc ? String(b).localeCompare(String(a), "ja") : String(a).localeCompare(String(b), "ja");
  });
}

function seasonNumber(label){
  const match = String(label || "").match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function rankingFileName(baseName, season){
  const n = seasonNumber(season);
  if(!n || n === 1) return `${baseName}.json`;
  return `${baseName}_s${n}.json`;
}

function buildMegaMaps(megaData){
  state.megaByBase = new Map();
  state.baseByMega = new Map();

  Object.entries(megaData.baseToForms || {}).forEach(([baseName, forms]) => {
    const list = (Array.isArray(forms) ? forms : []).filter(name => state.byName.has(name));
    if(list.length) state.megaByBase.set(baseName, list);
  });

  Object.entries(megaData.formToBase || {}).forEach(([formName, baseName]) => {
    if(state.byName.has(formName)) state.baseByMega.set(formName, baseName);
  });

  (megaData.rows || []).forEach(row => {
    if(!row?.name || !row?.baseName || !state.byName.has(row.name)) return;
    const list = state.megaByBase.get(row.baseName) || [];
    if(!list.includes(row.name)) list.push(row.name);
    state.megaByBase.set(row.baseName, list);
    state.baseByMega.set(row.name, row.baseName);
  });
}

function renderAll(){
  renderSlots("player");
  renderSlots("opponent");
  renderSuggest("player");
  renderSuggest("opponent");
  renderLeadPicker();
  renderResults();
  renderDamageSelectors();
  renderManualTab();
}

function buildSavedPartyOptions(partyList){
  const local = safeJson(localStorage.getItem(PARTY_LIST_KEY), []);
  const draft = safeJson(localStorage.getItem(PARTY_DRAFT_KEY), null);
  const draftRecord = draft && Array.isArray(draft.members) && draft.members.length ? [{
    id: "party-html-draft",
    name: draft.saveName ? `編集中: ${draft.saveName}` : "編集中のパーティ",
    data: {members: draft.members},
    draft: true
  }] : [];
  const presets = (partyList.parties || []).map((party, index) => ({
    id: `preset-${party.id || party.no || index}`,
    name: party.name || `サンプルパーティ ${party.no || index + 1}`,
    data: {
      members: (party.members || []).map(member => ({
        pokeName: member.pokemon || member.pokeName || member.name || "",
        nature: member.nature || "がんばりや",
        item: member.item || "",
        ability: member.ability || "",
        ev: member.ev || {},
        moves: (member.moves || []).map(move => typeof move === "string" ? {name: move} : move),
        lv: member.lv || 50,
        iv: member.iv || 31,
        gameMode: member.gameMode || "champions"
      })).filter(member => member.pokeName)
    },
    preset: true
  }));
  return [...draftRecord, ...normalizePartyRecords(local), ...presets].filter(record => partyMembers(record).length);
}

function normalizePartyRecords(records){
  return (Array.isArray(records) ? records : []).map((record, index) => {
    const data = record?.data || record || {};
    return {
      id: record?.id || `local-${index}`,
      name: record?.name || data.name || `保存パーティ ${index + 1}`,
      data
    };
  });
}

function partyMembers(record){
  const data = record?.data || record || {};
  return Array.isArray(data.members) ? data.members : [];
}

function renderSavedPartySelect(){
  const select = $("savedPartySelect");
  if(!select) return;
  select.innerHTML = `<option value="">保存パーティを選択</option>` + state.savedParties.map((record, index) => {
    const names = partyMembers(record).map(memberName).filter(Boolean).slice(0,6).join(" / ");
    return `<option value="${index}">${escapeHtml(record.name)}｜${escapeHtml(names)}</option>`;
  }).join("");
}

function loadSelectedSavedParty(){
  const index = Number($("savedPartySelect").value);
  const record = state.savedParties[index];
  if(!record){
    $("status").textContent = "読み込むパーティを選んでください";
    return;
  }
  const members = partyMembers(record).map(memberToPokemon).filter(Boolean).slice(0,6);
  if(members.length !== 6){
    $("status").textContent = "このパーティは6匹読み込めません";
    return;
  }
  state.player = members;
  state.predictions = null;
  renderAll();
  $("status").textContent = `「${record.name}」を自分側に読み込みました`;
}

function loadPartyDraft(){
  const draft = safeJson(localStorage.getItem(PARTY_DRAFT_KEY), null);
  if(!draft || !Array.isArray(draft.members) || !draft.members.length){
    $("status").textContent = "パーティー管理の編集中パーティが見つかりません。パーティー管理で一度編集または保存してください。";
    return;
  }
  const members = draft.members.map(memberToPokemon).filter(Boolean).slice(0,6);
  if(members.length !== 6){
    $("status").textContent = `パーティー管理の編集中パーティを${members.length}匹だけ読み込みました。6匹揃っていません。`;
  } else {
    $("status").textContent = `パーティー管理で編集中の「${draft.saveName || "パーティ"}」を読み込みました`;
  }
  state.player = Array(6).fill(null).map((_, i) => members[i] || null);
  state.predictions = null;
  renderAll();
}

function memberToPokemon(member){
  const name = memberName(member);
  const base = state.byName.get(name);
  if(!base) return null;
  const build = {
    nature: member.nature || "がんばりや",
    item: member.item || "",
    ability: member.ability || "",
    ev: member.ev || {},
    moves: (member.moves || []).map(move => typeof move === "string" ? move : move?.name).filter(Boolean).slice(0,4),
    lv: member.lv || 50,
    iv: member.iv || 31,
    gameMode: member.gameMode || "champions",
    originalName: base.name
  };
  const maybeMega = megaFormFromItem(base.name, build.item);
  const target = maybeMega ? state.byName.get(maybeMega) || base : base;
  return {
    ...target,
    types: [target.type1, target.type2].filter(Boolean),
    build
  };
}

function megaFormFromItem(baseName, itemName){
  const item = String(itemName || "");
  if(!item || !item.includes("ナイト")) return "";
  const forms = state.megaByBase.get(baseName) || [];
  if(!forms.length) return "";
  if(forms.length === 1) return forms[0];
  const normalizedItem = item.replace(/ナイト/g, "");
  return forms.find(form => form.includes("X") && item.includes("X"))
    || forms.find(form => form.includes("Y") && item.includes("Y"))
    || forms.find(form => form.includes("Z") && item.includes("Z"))
    || forms.find(form => form.replace(/^メガ/,"").includes(normalizedItem))
    || forms[0];
}

function memberName(member){
  return displayName(member?.pokeName || member?.pokemon || member?.name || "");
}

function usageProfileHtml(pokemon, itemPrediction){
  const row = rankingRow(pokemon.name);
  if(!row) {
    return `<div class="usage-profile"><div class="usage-line">型候補: ランキングデータなし</div></div>`;
  }
  const lines = [];
  if(itemPrediction?.item){
    lines.push(`<div class="usage-line predicted-item"><strong>持ち物予測</strong> ${escapeHtml(itemPrediction.item)}${itemPrediction.percent ? ` ${escapeHtml(itemPrediction.percentText)}` : ""}</div>`);
  }
  lines.push(...[
    ["技", row.moves, 3],
    ["持ち物", row.items, 2],
    ["特性", row.abilities, 2],
    ["性格", row.natures, 1]
  ].map(([label, values, count]) => usageLine(label, values, count)).filter(Boolean));
  return lines.length ? `<div class="usage-profile">${lines.join("")}</div>` : "";
}

function usageLine(label, values, count){
  const list = (Array.isArray(values) ? values : []).slice(0, count).map(shortUsageText).filter(Boolean);
  if(!list.length) return "";
  return `<div class="usage-line"><strong>${escapeHtml(label)}</strong> ${list.map(escapeHtml).join(" / ")}</div>`;
}

function shortUsageText(text){
  return String(text || "").replace(/\s+/g, " ").trim();
}

function opponentItemPredictionMap(){
  const opponent = compact(state.opponent);
  if(opponent.length !== 6) return new Map();
  const candidateRows = opponent.map((mon, index) => ({
    mon,
    index,
    candidates: itemCandidates(mon).slice(0, 8)
  }));
  const ordered = [...candidateRows].sort((a,b) => {
    const ac = a.candidates.length || 99;
    const bc = b.candidates.length || 99;
    return ac - bc || usageRank(a.mon.name) - usageRank(b.mon.name);
  });
  const best = {
    score: -Infinity,
    picks: Array(opponent.length).fill(null)
  };

  function walk(pos, used, picks, score){
    if(pos >= ordered.length){
      if(score > best.score){
        best.score = score;
        best.picks = [...picks];
      }
      return;
    }
    const row = ordered[pos];
    const candidates = row.candidates.length ? row.candidates : [{item:"", percent:0, percentText:"", score:-100}];
    candidates.forEach(candidate => {
      if(candidate.item && used.has(candidate.item)) return;
      if(candidate.item) used.add(candidate.item);
      picks[row.index] = candidate.item ? candidate : null;
      walk(pos + 1, used, picks, score + candidate.score);
      picks[row.index] = null;
      if(candidate.item) used.delete(candidate.item);
    });
  }

  walk(0, new Set(), Array(opponent.length).fill(null), 0);
  const out = new Map();
  opponent.forEach((mon, index) => {
    if(best.picks[index]) out.set(mon.name, best.picks[index]);
  });
  return out;
}

function itemCandidates(pokemon){
  const row = rankingRow(pokemon.name);
  return (row?.items || []).map((text, index) => {
    const parsed = parseUsageEntry(text);
    return {
      ...parsed,
      rank: index + 1,
      score: parsed.percent + Math.max(0, 8 - index) * 0.01
    };
  }).filter(candidate => candidate.item);
}

function parseUsageEntry(text){
  const raw = String(text || "").trim();
  const match = raw.match(/^(.*?)\s*\(([\d.]+)%\)\s*$/);
  const item = parseUsageName(match ? match[1] : raw);
  const percent = match ? Number(match[2]) || 0 : 0;
  return {
    item,
    percent,
    percentText: match ? `(${match[2]}%)` : ""
  };
}

function renderSlots(side){
  const box = $(side === "player" ? "playerSlots" : "opponentSlots");
  const party = state[side];
  const itemPredictions = side === "opponent" ? opponentItemPredictionMap() : new Map();
  box.innerHTML = party.map((p, i) => `
    <div class="slot ${p ? "filled" : ""}" data-side="${side}" data-index="${i}">
      ${p ? monHtml(p) : `<div class="slot-name">${i + 1}枠</div><div class="slot-meta">未設定</div>`}
      ${p && side === "opponent" ? usageProfileHtml(p, itemPredictions.get(p.name)) : ""}
      ${p ? megaControlsHtml(p, side, i) : ""}
    </div>
  `).join("");
  box.querySelectorAll(".slot").forEach(el => {
    el.addEventListener("click", (event) => {
      if(event.target.closest("button")) return;
      const s = el.dataset.side;
      const i = Number(el.dataset.index);
      if(state[s][i]){
        removeManualName(s, state[s][i].name);
        state[s][i] = null;
        if(s === "opponent") state.leadName = "";
        renderAll();
      }
    });
  });
  box.querySelectorAll("button[data-mega-form]").forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const side = btn.dataset.side;
      const index = Number(btn.dataset.index);
      switchMega(side, index, btn.dataset.megaForm);
    });
  });
}

function renderSuggest(side){
  const input = $(side === "player" ? "playerSearch" : "opponentSearch");
  const box = $(side === "player" ? "playerSuggest" : "opponentSuggest");
  if(!input || !box) return;
  const q = normalize(input.value);
  const party = state[side];
  const used = new Set(party.filter(Boolean).map(p => speciesKey(p.name)));
  const candidates = state.pokemon
    .filter(p => !used.has(speciesKey(p.name)))
    .filter(p => !q || normalize(p.name).includes(q) || String(p.no).includes(q))
    .sort((a,b) => usageRank(a.name) - usageRank(b.name) || a.name.localeCompare(b.name, "ja"))
    .slice(0, 36);
  box.innerHTML = candidates.map(p => `
    <button type="button" data-name="${escapeAttr(p.name)}">
      <span>${escapeHtml(p.name)}</span>
      <span class="slot-meta">${typeText(p)} / #${usageRank(p.name) < 9999 ? usageRank(p.name) : "-"}</span>
    </button>
  `).join("") || `<div class="empty">候補なし</div>`;
  box.querySelectorAll("button[data-name]").forEach(btn => {
    btn.addEventListener("click", () => {
      addPokemon(side, btn.dataset.name);
      input.value = "";
      renderAll();
    });
  });
}

function addPokemon(side, name){
  const p = state.byName.get(name);
  if(!p) return;
  const idx = state[side].findIndex(x => !x);
  if(idx < 0){
    $("status").textContent = `${side === "player" ? "自分" : "相手"}は6匹埋まっています`;
    return;
  }
  state[side][idx] = p;
}

function megaControlsHtml(pokemon, side, index){
  const baseName = state.baseByMega.get(pokemon.name) || pokemon.name;
  const forms = state.megaByBase.get(baseName) || [];
  if(!forms.length) return "";
  const options = [baseName, ...forms].filter(name => state.byName.has(name));
  return `<div class="types">${options.map(name => `
    <button class="btn" style="padding:3px 6px;font-size:10px;${name === pokemon.name ? "border-color:var(--accent3);color:var(--accent3)" : ""}" data-side="${side}" data-index="${index}" data-mega-form="${escapeAttr(name)}">${escapeHtml(name === baseName ? "通常" : name.replace(/^メガ/,"M"))}</button>
  `).join("")}</div>`;
}

function switchMega(side, index, targetName){
  const current = state[side]?.[index];
  const target = state.byName.get(targetName);
  if(!current || !target) return;
  state[side][index] = {
    ...target,
    types: [target.type1, target.type2].filter(Boolean),
    build: current.build ? {
      ...current.build,
      megaBaseName: state.baseByMega.get(target.name) || target.name,
      originalName: current.build.originalName || state.baseByMega.get(current.name) || current.name
    } : undefined
  };
  if(side === "opponent"){
    if(state.leadName === current.name) state.leadName = target.name;
    if(state.secondName === current.name) state.secondName = target.name;
  }
  replaceManualName(side, current.name, target.name);
  state.predictions = null;
  renderAll();
  $("status").textContent = `${current.name} → ${target.name} に切り替えました`;
}

function runPredict(){
  const player = compact(state.player);
  const opponent = compact(state.opponent);
  if(player.length !== 6 || opponent.length !== 6){
    $("status").textContent = "自分と相手を6匹ずつ入れてください";
    return;
  }
  const opponentCombos = comboIndexes(6,3).map(idxs => scoreOpponentCombo(idxs, opponent, player)).sort((a,b) => b.score - a.score);
  const topOpp = opponentCombos.slice(0, 5);
  const playerCombos = comboIndexes(6,3).map(idxs => scorePlayerCombo(idxs, player, topOpp.map(x => x.mons))).sort((a,b) => b.score - a.score);
  state.predictions = { opponentCombos, playerCombos };
  $("status").textContent = "選出予測を更新しました";
  renderLeadPicker();
  renderResults();
}

function scoreOpponentCombo(idxs, opponent, player){
  const mons = idxs.map(i => opponent[i]);
  let score = 0;
  const notes = [];
  mons.forEach(m => {
    const pressure = average(player.map(t => matchupScore(m, t)));
    const defensive = average(player.map(t => defensiveScore(m, t)));
    const usage = usageScore(m.name);
    const role = roleScore(m);
    score += pressure * 1.1 + defensive * 0.85 + usage + role;
  });
  score += coverageDiversity(mons) * 10;
  score += roleSynergy(mons) * 12;
  score -= typeDupPenalty(mons) * 6;
  const topThreat = mons.map(m => ({m, v: max(player.map(t => matchupScore(m,t)))})).sort((a,b)=>b.v-a.v)[0];
  if(topThreat) notes.push(`${topThreat.m.name}がこちらに圧力をかけやすい`);
  const roles = comboRoles(mons);
  if(roles.length) notes.push(`${roles.join("・")}の勝ち筋を持てる`);
  notes.push(`使用率・相性・役割補完から評価`);
  return {idxs, mons, score: Math.round(score), notes};
}

function scorePlayerCombo(idxs, player, opponentComboMons){
  const mons = idxs.map(i => player[i]);
  let score = 0;
  const notes = [];
  opponentComboMons.forEach(oppMons => {
    mons.forEach(m => {
      score += average(oppMons.map(t => matchupScore(m,t))) * 1.05;
      score += average(oppMons.map(t => defensiveScore(m,t))) * 0.95;
    });
  });
  score += coverageDiversity(mons) * 8 + roleSynergy(mons) * 8 - typeDupPenalty(mons) * 5;
  const answer = mons.map(m => ({m, v: max(opponentComboMons.flat().map(t => matchupScore(m,t) + defensiveScore(m,t)))})).sort((a,b)=>b.v-a.v)[0];
  if(answer) notes.push(`${answer.m.name}が予想相手への回答になりやすい`);
  notes.push(`相手上位予想への平均対応力で評価`);
  return {idxs, mons, score: Math.round(score / Math.max(1, opponentComboMons.length)), notes};
}

function renderLeadPicker(){
  const box = $("leadPicker");
  const opponent = compact(state.opponent);
  if(opponent.length !== 6){
    box.innerHTML = `<div class="empty wide">相手6匹を入れると初手を選べます。</div>`;
    return;
  }
  box.innerHTML = opponent.map(p => `
    <button class="lead-btn ${state.leadName === p.name ? "active" : ""}" data-name="${escapeAttr(p.name)}">
      <div class="mini-label">初手</div>
      ${monHtml(p)}
    </button>
  `).join("") + (state.leadName ? opponent.filter(p => p.name !== state.leadName).map(p => `
    <button class="lead-btn ${state.secondName === p.name ? "active" : ""}" data-second="${escapeAttr(p.name)}">
      <div class="mini-label">2匹目</div>
      ${monHtml(p)}
    </button>
  `).join("") : "");
  box.querySelectorAll(".lead-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if(btn.dataset.name){
        state.leadName = btn.dataset.name;
        state.secondName = "";
      }
      if(btn.dataset.second){
        state.secondName = btn.dataset.second;
      }
      if(!state.predictions) runPredict();
      renderLeadPicker();
      renderAfterLead();
      renderDamageSelectors();
      renderDamageResults();
    });
  });
}

function renderResults(){
  renderComboList("opponentPredictions", state.predictions?.opponentCombos || [], "相手選出候補");
  renderComboList("playerRecommendations", state.predictions?.playerCombos || [], "自分の候補");
  renderAfterLead();
  renderDamageSelectors();
}

function renderDamageSelectors(){
  const playerSelect = $("damagePlayerSelect");
  const opponentSelect = $("damageOpponentSelect");
  if(!playerSelect || !opponentSelect) return;
  const playerRows = state.predictions?.playerCombos || [];
  const opponentRows = damageOpponentRows();
  playerSelect.innerHTML = playerRows.length
    ? playerRows.slice(0,8).map((row,i)=>`<option value="${i}">自分候補${i+1}: ${row.mons.map(m=>m.name).join(" / ")}</option>`).join("")
    : `<option value="">自分推奨選出なし</option>`;
  opponentSelect.innerHTML = opponentRows.length
    ? opponentRows.slice(0,8).map((row,i)=>`<option value="${i}">相手候補${i+1}: ${row.mons.map(m=>m.name).join(" / ")}</option>`).join("")
    : `<option value="">相手予想なし</option>`;
}

function damageOpponentRows(){
  const opponent = compact(state.opponent);
  const lead = opponent.find(p => p.name === state.leadName);
  const second = opponent.find(p => p.name === state.secondName);
  if(lead && second){
    const rest = opponent.filter(p => p.name !== lead.name && p.name !== second.name);
    return rest.map(p => ({mons:[lead, second, p], score: scoreLastOne(p, lead, second, rest, compact(state.player)).score})).sort((a,b)=>b.score-a.score);
  }
  if(lead){
    const rest = opponent.filter(p => p.name !== lead.name);
    return comboIndexes(rest.length,2).map(idxs => ({mons:[lead, ...idxs.map(i=>rest[i])], score: scoreBackTwo(idxs.map(i=>rest[i]), lead, rest, compact(state.player)).score})).sort((a,b)=>b.score-a.score);
  }
  return state.predictions?.opponentCombos || [];
}

function renderDamageResults(){
  const box = $("damageResults");
  if(!box) return;
  const playerRows = state.predictions?.playerCombos || [];
  const opponentRows = damageOpponentRows();
  const playerRow = playerRows[Number($("damagePlayerSelect")?.value) || 0];
  const opponentRow = opponentRows[Number($("damageOpponentSelect")?.value) || 0];
  if(!playerRow || !opponentRow){
    box.innerHTML = `<div class="empty">先に6匹ずつ入力して「選出予測する」を押してください。</div>`;
    return;
  }
  box.innerHTML = playerRow.mons.map(attacker => opponentRow.mons.map(defender => damageCard(attacker, defender)).join("")).join("");
}

function renderManualTab(){
  if(!$("manualPlayerPick") || !$("manualOpponentPick")) return;
  pruneManualSelections();
  renderManualPickGroup("player");
  renderManualPickGroup("opponent");
  renderManualSummary();
  renderManualDamageResults();
}

function renderManualPickGroup(side){
  const box = $(side === "player" ? "manualPlayerPick" : "manualOpponentPick");
  const party = compact(state[side]);
  const selected = state[manualKey(side)];
  if(!party.length){
    box.innerHTML = `<div class="empty wide">${side === "player" ? "自分" : "相手"}の6匹を先に入力してください。</div>`;
    return;
  }
  box.innerHTML = party.map(p => `
    <button type="button" class="pick-card ${selected.includes(p.name) ? "active" : ""}" data-side="${side}" data-name="${escapeAttr(p.name)}">
      <div class="mini-label">${selected.includes(p.name) ? "選出中" : "候補"}</div>
      ${monHtml(p)}
    </button>
  `).join("");
  box.querySelectorAll("button[data-name]").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleManualPick(btn.dataset.side, btn.dataset.name);
      renderManualTab();
    });
  });
}

function toggleManualPick(side, name){
  const key = manualKey(side);
  const list = state[key];
  if(list.includes(name)){
    state[key] = list.filter(x => x !== name);
    return;
  }
  if(list.length >= 3){
    $("status").textContent = `${side === "player" ? "自分" : "相手"}の手動選出は3匹までです`;
    return;
  }
  state[key] = [...list, name];
}

function renderManualSummary(){
  const box = $("manualSummary");
  if(!box) return;
  const player = manualMons("player");
  const opponent = manualMons("opponent");
  box.innerHTML = `
    <div class="empty">
      <strong>自分:</strong><br>
      ${player.length ? player.map(m => escapeHtml(m.name)).join(" / ") : "未選択"}
    </div>
    <div class="empty">
      <strong>相手:</strong><br>
      ${opponent.length ? opponent.map(m => escapeHtml(m.name)).join(" / ") : "未選択"}
    </div>
  `;
}

function renderManualDamageResults(){
  const box = $("manualDamageResults");
  if(!box) return;
  const player = manualMons("player");
  const opponent = manualMons("opponent");
  if(player.length !== 3 || opponent.length !== 3){
    box.innerHTML = `<div class="empty">自分3匹・相手3匹を選ぶとダメージを表示します。</div>`;
    return;
  }
  box.innerHTML = player.map(attacker => opponent.map(defender => damageCard(attacker, defender)).join("")).join("");
}

function applyTopPredictionToManual(){
  if(!state.predictions && compact(state.player).length === 6 && compact(state.opponent).length === 6){
    runPredict();
  }
  const playerRow = state.predictions?.playerCombos?.[0];
  const opponentRow = damageOpponentRows()[0] || state.predictions?.opponentCombos?.[0];
  if(!playerRow || !opponentRow){
    $("status").textContent = "先に6匹ずつ入力して予測してください";
    return;
  }
  state.manualPlayer = playerRow.mons.map(m => m.name).slice(0,3);
  state.manualOpponent = opponentRow.mons.map(m => m.name).slice(0,3);
  renderManualTab();
  $("status").textContent = "予測1位を手動選出にセットしました";
}

function manualMons(side){
  const party = compact(state[side]);
  return state[manualKey(side)].map(name => party.find(p => p.name === name)).filter(Boolean);
}

function manualKey(side){
  return side === "player" ? "manualPlayer" : "manualOpponent";
}

function pruneManualSelections(){
  ["player","opponent"].forEach(side => {
    const names = new Set(compact(state[side]).map(p => p.name));
    state[manualKey(side)] = state[manualKey(side)].filter(name => names.has(name));
  });
}

function removeManualName(side, name){
  const key = manualKey(side);
  state[key] = state[key].filter(x => x !== name);
}

function replaceManualName(side, fromName, toName){
  const key = manualKey(side);
  state[key] = state[key].map(name => name === fromName ? toName : name);
}

function damageCard(attacker, defender){
  const moves = getFourMoves(attacker);
  return `<article class="damage-card">
    <div class="damage-title"><span>${escapeHtml(attacker.name)} → ${escapeHtml(defender.name)}</span><span>S ${attacker.spe}/${defender.spe}</span></div>
    ${moves.map(move => {
      const result = calcSimpleDamage(attacker, defender, move);
      return `<div class="damage-row"><strong>${escapeHtml(move.name)}</strong> ${escapeHtml(move.type || "-")} / ${escapeHtml(move.category || "-")} / 威力 ${move.power || "-"}<br>${result.text} (${result.percentText}) 相性 x${result.eff}</div>`;
    }).join("") || `<div class="damage-row">技候補がありません。</div>`}
  </article>`;
}

function getFourMoves(pokemon){
  const buildMoves = (pokemon.build?.moves || []).map(name => state.moveByName.get(name)).filter(Boolean);
  const rankingMoves = (rankingRow(pokemon.name)?.moves || []).map(parseUsageName).map(name => state.moveByName.get(name)).filter(Boolean);
  return uniqByName([...buildMoves, ...rankingMoves]).filter(move => move.category !== "変化").slice(0,4);
}

function calcSimpleDamage(attacker, defender, move){
  if(!move || move.category === "変化" || !Number(move.power)){
    return {min:0,max:0,eff:1,text:"変化技",percentText:"-"};
  }
  const lv = 50;
  const atkStats = calcStats(attacker);
  const defStats = calcStats(defender);
  const category = move.category === "物理" ? "物理" : "特殊";
  const atk = category === "物理" ? atkStats.atk : atkStats.spa;
  const def = category === "物理" ? defStats.def : defStats.spd;
  const eff = effectiveness(move.type, defender);
  if(eff === 0) return {min:0,max:0,eff:0,text:"無効",percentText:"0%"};
  const stab = getTypes(attacker).includes(move.type) ? 1.5 : 1;
  const base = Math.floor(Math.floor(Math.floor((lv * 2 / 5 + 2) * Number(move.power) * atk / Math.max(1, def)) / 50 + 2) * stab * eff);
  const min = Math.max(1, Math.floor(base * 0.85));
  const maxD = Math.max(min, base);
  const hp = Math.max(1, defStats.hp);
  return {
    min,
    max: maxD,
    eff,
    text: `${min}〜${maxD}`,
    percentText: `${Math.floor(min / hp * 100)}〜${Math.floor(maxD / hp * 100)}%`
  };
}

function calcStats(pokemon){
  const build = pokemon.build || {};
  const ev = build.ev || {};
  const nature = NATURES[build.nature || "がんばりや"] || NATURES["がんばりや"];
  const iv = Number(build.iv || 31);
  const lv = Number(build.lv || 50);
  return {
    hp: calcHP(Number(pokemon.hp||0), iv, Number(ev.hp||0), lv, true),
    atk: calcStat(Number(pokemon.atk||0), iv, Number(ev.atk||0), lv, nature.atk, true),
    def: calcStat(Number(pokemon.def||0), iv, Number(ev.def||0), lv, nature.def, true),
    spa: calcStat(Number(pokemon.spa||0), iv, Number(ev.spa||0), lv, nature.spa, true),
    spd: calcStat(Number(pokemon.spd||0), iv, Number(ev.spd||0), lv, nature.spd, true),
    spe: calcStat(Number(pokemon.spe||0), iv, Number(ev.spe||0), lv, nature.spe, true)
  };
}

function calcHP(base, iv, ev, lv, champions){
  return champions ? Math.floor((Math.floor((base * 2 + iv) * lv / 100) + 10 + lv)) + ev : Math.floor((Math.floor((base * 2 + iv + Math.floor(ev / 4)) * lv / 100) + 10 + lv));
}

function calcStat(base, iv, ev, lv, nature, champions){
  return champions ? Math.floor((Math.floor((base * 2 + iv) * lv / 100) + 5) * nature) + Math.floor(ev * nature) : Math.floor((Math.floor((base * 2 + iv + Math.floor(ev / 4)) * lv / 100) + 5) * nature);
}

function renderComboList(id, rows, label){
  const box = $(id);
  if(!rows.length){
    box.innerHTML = `<div class="empty">6匹ずつ入力して「選出予測する」を押してください。</div>`;
    return;
  }
  box.innerHTML = rows.slice(0, 8).map((row, i) => `
    <article class="result ${i === 0 ? "top" : ""}">
      <div class="result-head"><strong>${label} ${i + 1}</strong><span class="score">${row.score}</span></div>
      <div class="mons">${row.mons.map(m => `<span class="chip">${escapeHtml(m.name)}</span>`).join("")}</div>
      <div class="note">${row.notes.map(escapeHtml).join("<br>")}</div>
    </article>
  `).join("");
}

function renderAfterLead(){
  const box = $("afterLeadPredictions");
  const player = compact(state.player);
  const opponent = compact(state.opponent);
  if(!state.leadName || opponent.length !== 6 || player.length !== 6){
    box.innerHTML = `<div class="empty">相手初手を選ぶと、残り2匹の予想を出します。</div>`;
    return;
  }
  const lead = opponent.find(p => p.name === state.leadName);
  const second = opponent.find(p => p.name === state.secondName);
  const rest = opponent.filter(p => p.name !== state.leadName && p.name !== state.secondName);
  const rows = second
    ? rest.map(p => scoreLastOne(p, lead, second, rest, player)).sort((a,b)=>b.score-a.score)
    : comboIndexes(rest.length, 2).map(idxs => scoreBackTwo(idxs.map(i => rest[i]), lead, rest, player)).sort((a,b)=>b.score-a.score);
  box.innerHTML = rows.slice(0, 8).map((row, i) => `
    <article class="result ${i === 0 ? "top" : ""}">
      <div class="result-head"><strong>${second ? "3匹目候補" : "裏候補"} ${i + 1}</strong><span class="score">${row.score}</span></div>
      <div class="mons">${row.mons.map(m => `<span class="chip">${escapeHtml(m.name)}</span>`).join("")}</div>
      <div class="note">${row.notes.map(escapeHtml).join("<br>")}</div>
    </article>
  `).join("");
}

function scoreLastOne(mon, lead, second, rest, player){
  const picked = [lead, second, mon];
  const need = necessityScore(mon, lead, rest, player);
  const secondNeed = necessityScore(mon, second, rest, player);
  const score = need.score * 1.05 + secondNeed.score + coverageDiversity(picked) * 8 + usageScore(mon.name) - typeDupPenalty(picked) * 6;
  return {
    mons: [mon],
    score: Math.round(score),
    notes: [
      `${lead.name}・${second.name}で見にくい相手への補完を評価`,
      `${mon.name}: ${need.reason}`,
      `${second.name}との補完: ${secondNeed.reason}`
    ]
  };
}

function scoreBackTwo(backMons, lead, rest, player){
  const mons = [lead, ...backMons];
  let score = 0;
  const notes = [];
  backMons.forEach(m => {
    const need = necessityScore(m, lead, rest, player);
    const synergy = pairSynergy(lead, m) + roleSynergy([lead, m]);
    score += need.score * 1.25 + synergy * 8 + usageScore(m.name);
    notes.push(`${m.name}: ${need.reason}`);
  });
  score += coverageDiversity(mons) * 8 - typeDupPenalty(mons) * 5;
  return {mons: backMons, score: Math.round(score), notes};
}

function necessityScore(mon, lead, rest, player){
  const ourThreats = player.map(p => ({
    p,
    dangerToLead: matchupScore(p, lead),
    hardForLead: Math.max(0, matchupScore(p, lead) - defensiveScore(lead, p))
  })).sort((a,b)=>b.hardForLead-a.hardForLead).slice(0,3);
  const answers = ourThreats.map(t => ({
    target: t.p,
    value: matchupScore(mon, t.p) + defensiveScore(mon, t.p)
  }));
  const best = answers.sort((a,b)=>b.value-a.value)[0];
  const unique = uniqueAnswerBonus(mon, rest, player);
  const score = (best?.value || 0) * 2 + unique;
  const reason = best && best.value > 17
    ? `${best.target.name}への回答になりやすい。${unique > 8 ? "他の控えより役割が独自。" : "初手の弱点補完として自然。"}`
    : unique > 8
      ? `この枠でしか見にくい相手がいるため、裏に置く価値が高い。`
      : `初手との補完・使用率込みで候補。`;
  return {score, reason};
}

function uniqueAnswerBonus(mon, rest, player){
  let bonus = 0;
  player.forEach(target => {
    const mine = matchupScore(mon, target) + defensiveScore(mon, target);
    const others = rest.filter(p => p.name !== mon.name).map(p => matchupScore(p,target) + defensiveScore(p,target));
    if(mine > max(others) + 4) bonus += 5;
  });
  return bonus;
}

function matchupScore(attacker, defender){
  const atkTypes = getAttackTypes(attacker);
  const bestEff = max(atkTypes.map(t => effectiveness(t, defender)));
  const stat = Math.max(Number(attacker.atk||0), Number(attacker.spa||0)) / 20;
  const speed = Number(attacker.spe||0) > Number(defender.spe||0) ? 3 : 0;
  return bestEff * 10 + stat + speed;
}

function defensiveScore(defender, attacker){
  const atkTypes = getAttackTypes(attacker);
  const danger = max(atkTypes.map(t => effectiveness(t, defender)));
  const bulk = (Number(defender.hp||0) + Number(defender.def||0) + Number(defender.spd||0)) / 35;
  return (2.4 - Math.min(2.4, danger)) * 8 + bulk;
}

function getAttackTypes(p){
  const row = rankingRow(p.name);
  const fromMoves = (row?.moves || []).map(parseUsageName).map(moveNameToType).filter(Boolean);
  return uniq([...fromMoves.slice(0,4), ...p.types]).slice(0,5);
}

function moveNameToType(moveName){
  const hit = TYPE_MOVE_HINTS.find(x => x.names.some(n => moveName.includes(n)));
  return hit?.type || "";
}

const TYPE_MOVE_HINTS = [
  {type:"じめん", names:["じしん","だいちのちから","じならし"]},
  {type:"ドラゴン", names:["げきりん","ドラゴン","りゅうせいぐん"]},
  {type:"ほのお", names:["かえん","フレア","オーバーヒート","ふんか","ねっぷう"]},
  {type:"みず", names:["ハイドロ","なみのり","アクア","ウェーブ","ねっとう"]},
  {type:"でんき", names:["１０まん","ボルト","かみなり","ほうでん"]},
  {type:"くさ", names:["リーフ","エナジーボール","ギガドレイン","くさむすび"]},
  {type:"こおり", names:["れいとう","こおり","ふぶき"]},
  {type:"かくとう", names:["インファイト","ボディプレス","ドレインパンチ","はどうだん"]},
  {type:"どく", names:["ヘドロ","どくづき","アシッド"]},
  {type:"ひこう", names:["ぼうふう","ブレイブバード","エアスラッシュ"]},
  {type:"エスパー", names:["サイコ","しねんのずつき"]},
  {type:"むし", names:["とんぼがえり","メガホーン","むし"]},
  {type:"いわ", names:["いわなだれ","ストーンエッジ","がんせき"]},
  {type:"ゴースト", names:["シャドー","ゴースト"]},
  {type:"あく", names:["あくのはどう","ふいうち","かみくだく","はたき"]},
  {type:"はがね", names:["アイアン","ラスターカノン","ヘビーボンバー"]},
  {type:"フェアリー", names:["ムーンフォース","じゃれつく","マジカルシャイン"]}
];

function roleScore(p){
  const moves = (rankingRow(p.name)?.moves || []).map(parseUsageName);
  let score = 0;
  Object.values(ROLE_MOVES).forEach(list => {
    if(moves.some(m => list.some(key => m.includes(key)))) score += 2.5;
  });
  if(Number(p.spe||0) >= 100) score += 2;
  if(Number(p.hp||0) + Number(p.def||0) + Number(p.spd||0) >= 260) score += 2;
  return score;
}

function comboRoles(mons){
  const moves = mons.flatMap(p => (rankingRow(p.name)?.moves || []).map(parseUsageName));
  const out = [];
  if(moves.some(m => m.includes("トリックルーム"))) out.push("トリル");
  if(moves.some(m => ["にほんばれ","あまごい","すなあらし","ゆきげしき"].some(x=>m.includes(x)))) out.push("天候");
  if(moves.some(m => ["ステルスロック","まきびし"].some(x=>m.includes(x)))) out.push("展開");
  if(moves.some(m => ["つるぎのまい","わるだくみ","りゅうのまい"].some(x=>m.includes(x)))) out.push("積み");
  return out;
}

function roleSynergy(mons){
  let score = 0;
  const roles = comboRoles(mons);
  score += roles.length;
  mons.forEach(a => mons.forEach(b => {
    if(a === b) return;
    score += pairSynergy(a,b);
  }));
  return score / Math.max(1, mons.length);
}

function pairSynergy(a,b){
  const pairs = [["ブリムオン","コータス"],["コータス","ブリムオン"],["ペリッパー","キングドラ"],["バンギラス","ドリュウズ"],["コータス","フシギバナ"]];
  if(pairs.some(([x,y]) => a.name.includes(x) && b.name.includes(y))) return 3;
  let s = 0;
  getTypes(a).forEach(t => {
    const weak = typesThatHit(t,2);
    weak.forEach(w => {
      if(effectiveness(w,b) < 1) s += 0.6;
    });
  });
  return s;
}

function coverageDiversity(mons){
  return new Set(mons.flatMap(getAttackTypes)).size;
}

function typeDupPenalty(mons){
  const counts = {};
  mons.flatMap(getTypes).forEach(t => counts[t] = (counts[t] || 0) + 1);
  return Object.values(counts).reduce((s,v)=>s + Math.max(0, v - 1), 0);
}

function effectiveness(attackType, defender){
  return getTypes(defender).reduce((eff, t) => eff * (TYPE_CHART[attackType]?.[t] ?? 1), 1);
}

function typesThatHit(type, value){
  return Object.keys(TYPE_CHART).filter(atk => (TYPE_CHART[atk]?.[type] ?? 1) === value);
}

function getTypes(p){ return [p.type1, p.type2].filter(Boolean); }
function usageRank(name){ return Number(rankingRow(name)?.rank || 9999); }
function usageScore(name){ const r = usageRank(name); return r < 9999 ? Math.max(0, 18 - Math.log2(r + 1) * 2.5) : 1; }
function rankingRow(name){ return state.ranking.get(displayName(name)) || state.ranking.get(name) || null; }
function parseUsageName(text){ return String(text || "").replace(/\s*\([^)]+\)\s*$/,"").trim(); }
function comboIndexes(n,k,start=0,prefix=[],out=[]){ if(prefix.length===k){out.push([...prefix]);return out;} for(let i=start;i<n;i++){prefix.push(i);comboIndexes(n,k,i+1,prefix,out);prefix.pop();} return out; }
function compact(arr){ return arr.filter(Boolean); }
function average(arr){ return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function max(arr){ return arr.length ? Math.max(...arr) : 0; }
function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }
function uniqByName(arr){
  const seen = new Set();
  return arr.filter(item => {
    const name = item?.name;
    if(!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}
function displayName(name){ return String(name || "").trim(); }
function speciesKey(name){ return displayName(name).replace(/^メガ/,"").replace(/[XYZ]$/,""); }
function normalize(text){ return String(text || "").trim().toLowerCase(); }
function safeJson(text, fallback){ try{ const value = JSON.parse(text || ""); return value ?? fallback; }catch(_e){ return fallback; } }
function typeText(p){ return getTypes(p).join("/") || "-"; }
function monHtml(p){
  return `<div class="slot-name">${escapeHtml(p.name)}</div><div class="types">${getTypes(p).map(t=>`<span class="type">${escapeHtml(t)}</span>`).join("")}</div><div class="slot-meta">H${p.hp} A${p.atk} B${p.def} C${p.spa} D${p.spd} S${p.spe}</div>`;
}
function escapeHtml(s){ return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
function escapeAttr(s){ return escapeHtml(s); }

function loadSample(){
  ["ゲッコウガ","スターミー","ブリジュラス","カビゴン","ガブリアス","ゾロアーク"].forEach((n,i)=>state.player[i]=state.byName.get(n)||null);
  ["ブリムオン","ヘラクロス","ハラバリー","ゲンガー","ゾロアークH","コータス"].forEach((n,i)=>state.opponent[i]=state.byName.get(n)||null);
  state.leadName = "";
  renderAll();
  runPredict();
}
