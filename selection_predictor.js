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

const $ = (id) => document.getElementById(id);
const state = {
  pokemon: [],
  byName: new Map(),
  ranking: new Map(),
  partySamples: [],
  player: Array(6).fill(null),
  opponent: Array(6).fill(null),
  activeSide: "player",
  leadName: "",
  predictions: null
};

init();

async function init(){
  const [pokemon, ranking, partyList] = await Promise.all([
    fetchJson("pokemon.json", []),
    fetchJson("season_ranking_single.json", {rows: []}),
    fetchJson("party_list.json", {parties: []})
  ]);
  state.pokemon = pokemon.filter(p => p && p.name).map(p => ({...p, types: [p.type1, p.type2].filter(Boolean)}));
  state.pokemon.forEach(p => state.byName.set(p.name, p));
  (ranking.rows || []).forEach(r => state.ranking.set(displayName(r.name || r.siteName), r));
  state.partySamples = partyList.parties || [];
  bind();
  renderAll();
  $("status").textContent = `読込完了: ${state.pokemon.length}匹 / ランキング${state.ranking.size}件`;
}

function bind(){
  $("playerSearch").addEventListener("input", () => renderSuggest("player"));
  $("opponentSearch").addEventListener("input", () => renderSuggest("opponent"));
  $("playerClear").addEventListener("click", () => { state.player = Array(6).fill(null); renderAll(); });
  $("opponentClear").addEventListener("click", () => { state.opponent = Array(6).fill(null); state.leadName = ""; state.predictions = null; renderAll(); });
  $("runPredict").addEventListener("click", runPredict);
  $("loadSample").addEventListener("click", loadSample);
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

async function fetchJson(path, fallback){
  try{
    const res = await fetch(path, {cache: "no-store"});
    if(!res.ok) return fallback;
    return await res.json();
  }catch(e){
    $("status").textContent = "JSONを読めません。ローカルサーバー上で開いてください。";
    return fallback;
  }
}

function renderAll(){
  renderSlots("player");
  renderSlots("opponent");
  renderSuggest("player");
  renderSuggest("opponent");
  renderLeadPicker();
  renderResults();
}

function renderSlots(side){
  const box = $(side === "player" ? "playerSlots" : "opponentSlots");
  const party = state[side];
  box.innerHTML = party.map((p, i) => `
    <div class="slot ${p ? "filled" : ""}" data-side="${side}" data-index="${i}">
      ${p ? monHtml(p) : `<div class="slot-name">${i + 1}枠</div><div class="slot-meta">未設定</div>`}
    </div>
  `).join("");
  box.querySelectorAll(".slot").forEach(el => {
    el.addEventListener("click", () => {
      const s = el.dataset.side;
      const i = Number(el.dataset.index);
      if(state[s][i]){
        state[s][i] = null;
        if(s === "opponent") state.leadName = "";
        renderAll();
      }
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
  `).join("");
  box.querySelectorAll(".lead-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.leadName = btn.dataset.name;
      if(!state.predictions) runPredict();
      renderLeadPicker();
      renderAfterLead();
    });
  });
}

function renderResults(){
  renderComboList("opponentPredictions", state.predictions?.opponentCombos || [], "相手選出候補");
  renderComboList("playerRecommendations", state.predictions?.playerCombos || [], "自分の候補");
  renderAfterLead();
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
  const rest = opponent.filter(p => p.name !== state.leadName);
  const rows = comboIndexes(rest.length, 2).map(idxs => scoreBackTwo(idxs.map(i => rest[i]), lead, rest, player)).sort((a,b)=>b.score-a.score);
  box.innerHTML = rows.slice(0, 8).map((row, i) => `
    <article class="result ${i === 0 ? "top" : ""}">
      <div class="result-head"><strong>裏候補 ${i + 1}</strong><span class="score">${row.score}</span></div>
      <div class="mons">${row.mons.map(m => `<span class="chip">${escapeHtml(m.name)}</span>`).join("")}</div>
      <div class="note">${row.notes.map(escapeHtml).join("<br>")}</div>
    </article>
  `).join("");
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
function displayName(name){ return String(name || "").trim(); }
function speciesKey(name){ return displayName(name).replace(/^メガ/,"").replace(/[XYZ]$/,""); }
function normalize(text){ return String(text || "").trim().toLowerCase(); }
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
