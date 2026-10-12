import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// ブラウザ向けサニタイザーを実際のDOMで検証する。テスト用DOMは外部資源を取得しない。
const dom = new JSDOM('', { url: 'https://example.com/software-cookbook/index.html' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
const { renderDocument } = await import('../web/lib/render.js');

const doc = { path: 'movie/a.md' };
const catalog = { documents: [doc, { path: 'dtm/b.md' }], assets: { 'movie/pic.png': 'assets/hash.png' } };
const render = source => {
  const container = document.createElement('div');
  container.append(renderDocument(source, doc, catalog, {}));
  return container;
};

test('生HTMLを実行可能な要素にせず、危険なリンクを除去する', () => {
  const output = render('# App 逆引きマニュアル\n\n## 手順\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(2)>\n\n[危険](javascript:alert%281%29)\n\n[秘密](../../AGENTS.md)\n');
  assert.equal(output.querySelectorAll('script,[onerror],img').length, 0);
  assert(output.textContent.includes('<script>alert(1)</script>'));
  for (const label of ['危険', '秘密']) assert(![...output.querySelectorAll('a')].find(a => a.textContent === label).hasAttribute('href'));
});

test('見出し・相対文書・画像・GFM表・コード・タスクを表示する', () => {
  const output = render('# App 逆引きマニュアル\n\n- [手順](#手順)\n\n## 手順\n\n[別文書](../dtm/b.md#項目)\n\n![画像](pic.png)\n\n| 見出し | 値 |\n| --- | --- |\n| A | B |\n\n- [x] 完了\n\n```unknown\n<入力> &amp;\n```\n\n## 手順\n重複\n\n## location\n本文');
  assert.equal(output.querySelectorAll('#手順').length, 1);
  assert.equal(output.querySelectorAll('#手順-1').length, 1);
  assert.equal(output.querySelectorAll('#location').length, 1);
  const link = [...output.querySelectorAll('a')].find(a => a.textContent === '別文書');
  assert(link.getAttribute('href').includes('doc=dtm%2Fb.md'));
  assert(link.getAttribute('href').includes('#%E9%A0%85%E7%9B%AE'));
  assert.equal(output.querySelector('img').getAttribute('src'), './assets/hash.png');
  assert.equal(output.querySelectorAll('.table-scroll table').length, 1);
  assert.equal(output.querySelector('pre').textContent.trim(), '<入力> &amp;');
  assert(output.querySelector('input[type=checkbox]').checked);
});
