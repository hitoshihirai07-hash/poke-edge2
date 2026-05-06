(function(){
  var UPDATE_VERSION = '2026.05.06';
  var ITEMS = [
    {date:'2026.05.06', title:'ポケモン登録・パーティ登録・ダメージ計算・バトルアナライザー・PRO関連の更新を行いました', href:'articles/update-summary-register-calc-analyzer-pro-20260506.html'},
    {date:'2026.05.03', title:'ダメージ計算・パーティ登録・バトルアナライザーの更新を行いました', href:'articles/update-summary-calc-party-analyzer-fixes.html'},
    {date:'2026.05.01', title:'ランキング更新・登録おすすめ表示・更新履歴アイコン追加を行いました', href:'articles/update-summary-ranking-register-updates-icon.html'},
    {date:'2026.04.26', title:'スマホ表示・検索機能・ダメージ計算の修正を行いました', href:'articles/update-summary-mobile-search-damage-fix.html'},
    {date:'2026.04.19', title:'耐久調整ツール追加・ダメージ計算強化・アナライザー整理など', href:'articles/update-summary-endure-history-analyzer.html'}
  ];
  function basePrefix(){
    var p = location.pathname || '';
    var h = location.href || '';
    return (/\/articles\//.test(p) || /\/articles\//.test(h)) ? '../' : '';
  }
  function resolvedHref(href){
    if(/^https?:/i.test(href)) return href;
    return basePrefix() + href;
  }
  function renderItems(){
    return ITEMS.map(function(item){
      return '<a class="updates-item" href="'+ resolvedHref(item.href) +'">'
        + '<div class="updates-date">更新 ' + item.date + '</div>'
        + '<div class="updates-item-title">' + item.title + '</div>'
        + '</a>';
    }).join('');
  }
  function closeModal(){
    var backdrop = document.getElementById('updates-backdrop');
    if(backdrop) backdrop.classList.remove('open');
    document.body.classList.remove('updates-open');
  }
  function markSeen(){
    try{ localStorage.setItem('pokeedge_updates_seen', UPDATE_VERSION); }catch(e){}
    var btn = document.getElementById('updates-btn');
    if(btn) btn.classList.add('updates-seen');
  }
  function openModal(){
    var backdrop = document.getElementById('updates-backdrop');
    if(backdrop) backdrop.classList.add('open');
    document.body.classList.add('updates-open');
    markSeen();
  }
  function initWidget(){
    var themeBtn = document.getElementById('theme-btn');
    if(!themeBtn || document.getElementById('updates-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'updates-btn';
    btn.className = 'updates-btn';
    btn.title = '更新履歴を確認';
    btn.setAttribute('aria-label','更新履歴を確認');
    btn.innerHTML = '<span class="updates-icon">🔔</span><span class="updates-label">更新</span><span class="updates-dot" aria-hidden="true"></span>';
    btn.addEventListener('click', openModal);
    themeBtn.parentNode.insertBefore(btn, themeBtn);

    var backdrop = document.createElement('div');
    backdrop.id = 'updates-backdrop';
    backdrop.className = 'updates-backdrop';
    backdrop.innerHTML = '<div class="updates-modal" role="dialog" aria-modal="true" aria-labelledby="updates-title">'
      + '<div class="updates-head">'
      + '<div><div id="updates-title" class="updates-title">更新履歴</div><div class="updates-sub">必要なときだけ確認できる形にしています。最新の更新だけ軽く見たいときに使ってください。</div></div>'
      + '<button type="button" class="updates-close" aria-label="閉じる">×</button>'
      + '</div>'
      + '<div class="updates-list">' + renderItems() + '</div>'
      + '<div class="updates-foot"><div class="updates-more">直近の更新を表示中</div><a class="updates-more-link" href="' + resolvedHref('blog.html') + '">記事一覧へ</a></div>'
      + '</div>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function(e){ if(e.target === backdrop) closeModal(); });
    var closeBtn = backdrop.querySelector('.updates-close');
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
    try{
      if(localStorage.getItem('pokeedge_updates_seen') === UPDATE_VERSION){ btn.classList.add('updates-seen'); }
    }catch(e){}
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initWidget);
  else initWidget();
})();
