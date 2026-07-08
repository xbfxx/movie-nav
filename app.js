// ====== 状态 ======
const state = {
  cat: 'all',      // 当前选中的内容类型
  res: 'all',      // 当前选中的分辨率
  kw: ''           // 搜索关键词（片名）；为空=浏览模式
};

const RES_RANK = { '1080p': 1, '2k': 2, '4k': 3 };

// 平台是否通过当前分类/分辨率筛选
function passFilter(p) {
  if (state.cat !== 'all' && !p.cats.includes(state.cat)) return false;
  if (state.res !== 'all' && RES_RANK[p.res] < RES_RANK[state.res]) return false;
  return true;
}

// ====== 初始化筛选器 + 示例 ======
function buildFilters() {
  const catChips = document.getElementById('catChips');
  const resChips = document.getElementById('resChips');

  const catAll = chip('全部', 'all', 'cat');
  catChips.appendChild(catAll);
  Object.entries(CATS).forEach(([key, v]) => {
    catChips.appendChild(chip(`${v.icon} ${v.label}`, key, 'cat'));
  });

  const resAll = chip('全部', 'all', 'res');
  resChips.appendChild(resAll);
  ['1080p', '2k', '4k'].forEach(r => {
    resChips.appendChild(chip(RES_LABEL[r], r, 'res'));
  });

  catAll.classList.add('active');
  resAll.classList.add('active');

  // 示例片名（点击即搜）
  const exBox = document.getElementById('examples');
  EXAMPLES.forEach(name => {
    const b = document.createElement('button');
    b.className = 'example-chip';
    b.textContent = name;
    b.addEventListener('click', () => {
      document.getElementById('search').value = name;
      state.kw = name;
      render();
      window.scrollTo({ top: document.querySelector('.filters').offsetTop - 10, behavior: 'smooth' });
    });
    exBox.appendChild(b);
  });
}

function chip(label, value, group) {
  const el = document.createElement('div');
  el.className = 'chip';
  el.textContent = label;
  el.dataset.value = value;
  el.dataset.group = group;
  el.addEventListener('click', () => onChipClick(group, value, el));
  return el;
}

function onChipClick(group, value, el) {
  state[group] = value;
  el.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  render();
}

// 生成平台「按片名搜索」的直达链接
function searchUrl(p, kw) {
  if (!p.searchTpl) return null;
  return p.searchTpl.replace('{q}', encodeURIComponent(kw));
}

// ====== 渲染 ======
function render() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const stats = document.getElementById('stats');

  grid.innerHTML = '';

  if (state.kw) {
    renderSearch(grid, stats, empty);
  } else {
    renderBrowse(grid, stats, empty);
  }
}

// 浏览模式：列出通过筛选的平台
function renderBrowse(grid, stats, empty) {
  const list = PLATFORMS.filter(passFilter);
  empty.hidden = list.length > 0;
  stats.textContent = `共 ${list.length} 个免费正版平台` +
    (state.cat !== 'all' ? ` · ${CATS[state.cat].label}` : '') +
    (state.res !== 'all' ? ` · 支持${RES_LABEL[state.res]}及以上` : '');

  list.forEach(p => grid.appendChild(platformCard(p)));
}

// 搜索模式：列出各平台「看这部片」的直达入口
function renderSearch(grid, stats, empty) {
  const kw = state.kw;
  const list = PLATFORMS.filter(passFilter);
  const withSearch = list.filter(p => p.searchTpl);

  stats.innerHTML = `🔎 为你找到《<b>${escapeHtml(kw)}</b>》的 <b>${withSearch.length}</b> 个免费观看入口 —— 点一下直达该平台这部片的搜索结果，无需去主页再搜`;
  empty.hidden = withSearch.length > 0;
  if (!withSearch.length) return;

  withSearch.forEach(p => grid.appendChild(titleCard(p, kw)));
}

function platformCard(p) {
  const el = document.createElement('article');
  el.className = 'card';
  const catTags = p.cats.map(c => `<span class="tag">${CATS[c].icon} ${CATS[c].label}</span>`).join('');
  el.innerHTML = `
    <div class="card-head">
      <div class="card-emoji">${p.emoji}</div>
      <div class="card-title">${p.name}</div>
    </div>
    <div class="card-desc">${p.desc}</div>
    <div class="tags">${catTags}<span class="tag res">⬆ 最高 ${RES_LABEL[p.res]}</span></div>
    <div class="card-note">💡 ${p.note}</div>
    <div class="card-foot">
      <span class="tag">免费 · 正版</span>
      <a class="go-btn" href="${p.searchTpl ? searchUrl(p, p.name) : '#'}" target="_blank" rel="noopener noreferrer">浏览平台 <span>↗</span></a>
    </div>`;
  return el;
}

// 搜索结果卡片：直接去「该平台看《片名》」
function titleCard(p, kw) {
  const el = document.createElement('article');
  el.className = 'card card-search';
  const catTags = p.cats.map(c => `<span class="tag">${CATS[c].icon} ${CATS[c].label}</span>`).join('');
  el.innerHTML = `
    <div class="card-head">
      <div class="card-emoji">${p.emoji}</div>
      <div class="card-title">${p.name}</div>
    </div>
    <div class="card-desc">在 <b>${p.name}</b> 看《${escapeHtml(kw)}》的免费资源（含免费专区/广告版）</div>
    <div class="tags">${catTags}<span class="tag res">⬆ 最高 ${RES_LABEL[p.res]}</span></div>
    <div class="card-foot">
      <span class="tag">一步直达</span>
      <a class="go-btn go-btn-strong" href="${searchUrl(p, kw)}" target="_blank" rel="noopener noreferrer">去${p.name}看《${escapeHtml(kw)}》 <span>↗</span></a>
    </div>`;
  return el;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ====== 搜索交互 ======
document.getElementById('search').addEventListener('input', e => {
  state.kw = e.target.value.trim();
  render();
});

// ====== 启动 ======
buildFilters();
render();
