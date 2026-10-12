import { documentURL, compare } from './lib/markdown.js';
import { search, queryTerms, matchRanges, excerpt } from './lib/search.js';
import { renderDocument } from './lib/render.js';

const $ = id => document.getElementById(id);
let catalog;
let indexPromise;
let revision = 0;
let shown = 50;
let composing = false;
let timer;
const sourceCache = new Map();

function state() {
  const params = new URLSearchParams(location.search);
  return Object.fromEntries(['q', 'genre', 'app', 'doc'].map(key => [key, params.get(key) ?? '']));
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function highlight(node, text, terms) {
  let end = 0;
  for (const [start, stop] of matchRanges(text, terms)) {
    node.append(document.createTextNode(text.slice(end, start)), element('mark', text.slice(start, stop)));
    end = stop;
  }
  node.append(document.createTextNode(text.slice(end)));
}

async function fetchData(file, type = 'json', fresh = false) {
  const response = await fetch(new URL(file, new URL('./', location.href)), { cache: fresh ? 'no-cache' : 'default' });
  if (!response.ok) throw new Error(`取得失敗 (${response.status})`);
  return type === 'json' ? response.json() : response.text();
}

function setStatus(text) { $('status').textContent = text; }
function error(text) { setStatus(text); $('retry').hidden = false; }

function populateFilters(current) {
  const genres = [...new Set(catalog.documents.map(doc => doc.genre))].sort(compare);
  $('genre').replaceChildren(new Option('すべてのジャンル', ''), ...genres.map(genre => new Option(genre, genre)));
  $('genre').value = genres.includes(current.genre) ? current.genre : '';
  const docs = catalog.documents.filter(doc => !$('genre').value || doc.genre === $('genre').value);
  $('app').replaceChildren(new Option('すべてのアプリ', ''), ...docs.map(doc => new Option(doc.app, doc.path)));
  $('app').value = docs.some(doc => doc.path === current.app) ? current.app : '';
}

function navigate(url, replace = false) {
  history[replace ? 'replaceState' : 'pushState'](null, '', url);
  void route();
}

function updateSearch(replace = false) {
  if (composing || !catalog) return;
  shown = 50;
  navigate(documentURL('', '', { q: $('query').value, genre: $('genre').value, app: $('app').value }), replace);
}

function listDocuments(current) {
  const filtered = catalog.documents.filter(doc => (!current.genre || doc.genre === current.genre) && (!current.app || doc.path === current.app));
  setStatus(`${filtered.length}件の文書 · ジャンルやアプリからも探せます`);
  for (const genre of [...new Set(filtered.map(doc => doc.genre))]) {
    const group = element('section', undefined, 'genre-group');
    const docs = filtered.filter(doc => doc.genre === genre);
    const heading = element('h2', genre, 'group-heading');
    heading.append(element('span', `${docs.length}文書`));
    const grid = element('div', undefined, 'doc-grid');
    for (const doc of docs) {
      const link = element('a', undefined, 'doc-card');
      link.href = documentURL(doc.path, '', current);
      link.append(element('h3', doc.app), element('p', `${doc.headings.filter(h => h.depth > 1).length}見出し`));
      if (doc.updated) link.append(element('p', `最終更新日: ${doc.updated}`));
      grid.append(link);
    }
    group.append(heading, grid);
    $('listing').append(group);
  }
}

async function getIndex() {
  if (!indexPromise) {
    indexPromise = fetchData(catalog.indexFile).then(index => {
      if (index.version !== catalog.version || index.commit !== catalog.commit || !Array.isArray(index.records)) throw new Error('データの版が一致しません。');
      return index;
    }).catch(err => { indexPromise = undefined; throw err; });
  }
  return indexPromise;
}

async function listResults(current, token) {
  setStatus('検索しています…');
  const index = await getIndex();
  if (token !== revision) return;
  const results = search(index.records, catalog.documents, current.q, current);
  const terms = queryTerms(current.q);
  setStatus(results.length ? `${results.length}件の項目が見つかりました（${Math.min(shown, results.length)}件を表示）` : '該当する項目はありません。語を短くするか、絞り込みを解除してください。');
  for (const item of results.slice(0, shown)) {
    const card = element('section', undefined, 'result');
    const meta = element('p', undefined, 'meta');
    highlight(meta, `${item.doc.genre} / ${item.doc.app}${item.parents.length ? ` / ${item.parents.join(' / ')}` : ''}`, terms);
    const title = element('h2');
    const link = element('a');
    link.href = documentURL(item.path, item.id, current);
    highlight(link, item.title, terms);
    title.append(link);
    const snippet = element('p');
    highlight(snippet, excerpt(item.body, terms), terms);
    card.append(meta, title, snippet);
    $('listing').append(card);
  }
  $('more').hidden = results.length <= shown;
}

async function showDocument(current, token) {
  const doc = catalog.documents.find(item => item.path === current.doc);
  $('reader').hidden = false;
  $('back').href = documentURL('', '', current);
  if (!doc) {
    setStatus('この文書は見つかりません。移動または削除された可能性があります。');
    $('source').hidden = true;
    $('article').append(element('p', '「一覧・検索結果へ」から文書を探し直してください。'));
    return;
  }
  setStatus('文書を読み込んでいます…');
  if (!sourceCache.has(doc.file)) sourceCache.set(doc.file, fetchData(doc.file, 'text').catch(err => { sourceCache.delete(doc.file); throw err; }));
  const source = await sourceCache.get(doc.file);
  if (token !== revision) return;
  $('breadcrumb').textContent = `${doc.genre} / ${doc.app}`;
  $('source').href = `./${doc.file}`;
  $('source').hidden = false;
  $('article').replaceChildren(renderDocument(source, doc, catalog, current));
  document.title = `${doc.app} — Software Cookbook`;
  for (const heading of doc.headings.filter(h => h.depth === 2 || h.depth === 3)) {
    const link = element('a', heading.title, `depth-${heading.depth}`);
    link.href = documentURL(doc.path, heading.id, current);
    $('toc').append(link);
  }
  $('toc').prepend(element('p', 'この文書の目次', 'eyebrow'));
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = location.hash.slice(1); }
  const heading = [...$('article').querySelectorAll('[id]')].find(node => node.id === id);
  setStatus(id && !heading ? '指定された見出しは見つかりません。文書の先頭を表示します。' : `${doc.app}${doc.updated ? ` · 最終更新日: ${doc.updated}` : ''}`);
  requestAnimationFrame(() => {
    if (token !== revision) return;
    const target = heading ?? $('reader');
    target.scrollIntoView({ block: 'start' });
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  });
}

/** 非同期取得中に別の検索や文書へ移動した場合、古い結果を描画しない。 */
async function route() {
  const token = ++revision;
  const leavingReader = !$('reader').hidden && !state().doc;
  $('listing').replaceChildren();
  $('article').replaceChildren();
  $('toc').replaceChildren();
  $('breadcrumb').textContent = '';
  $('more').hidden = true;
  $('retry').hidden = true;
  $('reader').hidden = true;
  document.title = 'Software Cookbook — 逆引きマニュアル';
  if (!catalog) return;
  const current = state();
  $('query').value = current.q;
  populateFilters(current);
  try {
    if (current.doc) await showDocument(current, token);
    else if (queryTerms(current.q).length) await listResults(current, token);
    else listDocuments(current);
    if (leavingReader && token === revision) {
      $('listing').scrollIntoView({ block: 'start' });
      $('listing').tabIndex = -1;
      $('listing').focus({ preventScroll: true });
    }
  } catch {
    if (token === revision) error('データを取得できませんでした。接続を確認し、再試行してください。');
  }
}

async function init() {
  $('retry').hidden = true;
  try {
    const result = await fetchData('data/catalog.json', 'json', true);
    if (result.version !== 1 || !Array.isArray(result.documents) || !result.assets || !result.indexFile) throw new Error('カタログの形式が異なります。');
    catalog = result;
    await route();
  } catch { error('文書一覧を取得できませんでした。接続を確認し、再試行してください。'); }
}

$('search-form').addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); updateSearch(); });
$('query').addEventListener('compositionstart', () => { composing = true; clearTimeout(timer); });
$('query').addEventListener('compositionend', () => { composing = false; clearTimeout(timer); timer = setTimeout(() => updateSearch(true), 200); });
$('query').addEventListener('input', () => { clearTimeout(timer); if (!composing) timer = setTimeout(() => updateSearch(true), 200); });
$('genre').addEventListener('change', () => { const current = { genre: $('genre').value, app: '' }; populateFilters(current); updateSearch(); });
$('app').addEventListener('change', () => updateSearch());
$('clear').addEventListener('click', () => { $('query').value = ''; $('genre').value = ''; $('app').value = ''; clearTimeout(timer); updateSearch(); });
$('more').addEventListener('click', () => { shown += 50; void route(); });
$('retry').addEventListener('click', () => {
  // 公開更新で古いハッシュのファイルがなくなった場合も、新しいカタログから取得し直す。
  catalog = undefined;
  indexPromise = undefined;
  sourceCache.clear();
  void init();
});
window.addEventListener('popstate', () => { clearTimeout(timer); shown = 50; void route(); });
window.addEventListener('hashchange', () => { if (location.hash !== '#main') void route(); });
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href]');
  if (!anchor || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute('download')) return;
  if (anchor.classList.contains('skip')) return;
  const url = new URL(anchor.href);
  const base = new URL('./index.html', location.href);
  if (url.origin !== base.origin || url.pathname !== base.pathname) return;
  event.preventDefault();
  clearTimeout(timer);
  navigate(url);
});
void init();
