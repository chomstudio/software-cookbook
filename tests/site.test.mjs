import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildSite } from '../scripts/build-site.mjs';
import { parseDocument, resolveReference, documentURL } from '../web/lib/markdown.js';
import { search, matchRanges, excerpt } from '../web/lib/search.js';

test('目次と日付を除外し、コード・階層・重複ID・修正履歴を扱う', () => {
  const doc = parseDocument('# Demo 逆引きマニュアル\n\n最終更新日: 2026-10-12\n\n- [分類](#分類)\n  - [項目](#項目)\n\n## 分類\n説明\n\n### 項目\n本文\n\n```cmd\n# 見出しではない\n&amp;\n```\n\n#### 補足\n詳細\n\n### 項目\n別の本文\n\n## 修正履歴\n古い手順\n');
  assert.equal(doc.app, 'Demo');
  assert.equal(doc.updated, '2026-10-12');
  assert.deepEqual(doc.headings.map(h => h.id), ['demo-逆引きマニュアル', '分類', '項目', '補足', '項目-1', '修正履歴']);
  assert.equal(doc.sections[0].id, '分類');
  assert(!doc.sections[0].body.includes('詳細'));
  assert(doc.sections.find(s => s.id === '項目').body.includes('# 見出しではない\n&amp;'));
  assert.deepEqual(doc.sections.find(s => s.id === '補足').parents, ['分類', '項目']);
  assert(doc.sections.find(s => s.id === '修正履歴').body.includes('古い手順'));
  assert(!doc.sections.some(s => s.body.includes('最終更新日')));
});

test('GFMの表・引用・参照リンクを検索本文として抽出する', () => {
  const doc = parseDocument('# App 逆引きマニュアル\n\n概要\n\n## 手順\n\n| key | value |\n| --- | --- |\n| foo | bar |\n\n> 引用文\n\n[別文書][other]\n\n[other]: ../genre/next.md#手順\n');
  assert.equal(doc.sections[0].body.trim(), '概要');
  assert(doc.sections[1].body.includes('foo bar'));
  assert(doc.sections[1].body.includes('引用文'));
  assert(doc.references.some(r => r.href === '../genre/next.md#手順'));
});

test('フィールド横断のAND検索・正規化・絞り込み・点数を検証する', () => {
  const docs = [{ path: 'dtm/fl-studio.md', app: 'FL Studio', genre: 'dtm' }];
  const records = [
    { path: docs[0].path, id: 'a', title: 'ステップ録音', parents: ['入力'], body: '音符を入力', order: 0 },
    { path: docs[0].path, id: 'b', title: '別項目', parents: [], body: 'ステップ録音の説明', order: 1 },
  ];
  assert.deepEqual(search(records, docs, 'ＦＬ　studio ステップ').map(r => r.id), ['a', 'b']);
  assert.equal(search(records, docs, '入力 音符').length, 1);
  assert.equal(search(records, docs, 'dtm').length, 2);
  assert.equal(search(records, docs, 'fl-studio').length, 2);
  assert.equal(search(records, docs, 'ステップ', { genre: 'movie' }).length, 0);
  assert.equal(search(records, docs, 'ステップ', { app: docs[0].path }).length, 2);
  assert.equal(search(records, docs, '不存在').length, 0);
  assert.equal(search(records, docs, '   ').length, 0);
});

test('合字・結合文字・全角文字の強調範囲と本文抜粋', () => {
  assert.deepEqual(matchRanges('ＦＬ ﬁ ガ', ['fl', 'fi', 'ガ']), [[0, 2], [3, 4], [5, 6]]);
  assert.deepEqual(matchRanges('か\u3099', ['が']), [[0, 2]]);
  assert(excerpt(`${'前'.repeat(160)}検索語${'後'.repeat(160)}`, ['検索語']).includes('検索語'));
});

test('相対リンクと範囲外参照を区別する', () => {
  assert.deepEqual(resolveReference('movie/a.md', '../dtm/b.md#見出し'), { type: 'local', path: 'dtm/b.md', hash: '#%E8%A6%8B%E5%87%BA%E3%81%97' });
  assert.equal(resolveReference('movie/a.md', '../../AGENTS.md').type, 'unsafe');
  assert.equal(resolveReference('movie/a.md', '../AGENTS.md').type, 'unsafe');
  assert.equal(resolveReference('movie/a.md', 'javascript:alert(1)').type, 'unsafe');
  assert.equal(resolveReference('movie/a.md', '%2e%2e/%2e%2e/private.txt').type, 'unsafe');
  assert.equal(resolveReference('movie/a.md', 'https://example.com').type, 'external');
  assert.equal(resolveReference('movie/a.md', '#目次').type, 'fragment');
  assert(documentURL('movie/a.md', '見出し').includes('doc=movie%2Fa.md'));
});

test('新規ジャンルの検出、原稿保存、参照資産収集、更新・削除・ゼロ件を検証する', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cookbook-test-'));
  try {
    const put = async (relative, content) => {
      await mkdir(path.dirname(path.join(root, relative)), { recursive: true });
      await writeFile(path.join(root, relative), content);
    };
    await put('index.html', '<html lang="ja"></html>');
    await put('web/styles.css', 'body{}');
    await put('cookbooks/new-genre/a.md', '# New App 逆引きマニュアル\n\n## 手順\n初期本文\n\n![画像](pic.png)\n');
    await put('cookbooks/new-genre/pic.png', Buffer.from([1, 2, 3]));
    await put('cookbooks/new-genre/AGENTS.md', '# Secret 逆引きマニュアル');
    await put('cookbooks/new-genre/.private/a.md', '# Secret 逆引きマニュアル');
    await put('cookbooks/root.md', '# Secret 逆引きマニュアル');
    await put('codexdocs/secret.md', '# Secret 逆引きマニュアル');
    await put('cookbooks/new-genre/notes.md', '# 通常メモ');
    let result = await buildSite({ root, bundle: false });
    assert.equal(result.catalog.documents.length, 1);
    assert.equal(result.catalog.documents[0].genre, 'new-genre');
    const original = await readFile(path.join(root, 'cookbooks/new-genre/a.md'));
    assert.deepEqual(await readFile(path.join(root, '_site', result.catalog.documents[0].file)), original);
    assert.equal(Object.keys(result.catalog.assets).length, 1);
    assert(!JSON.stringify(result).includes('Secret'));
    const firstFile = result.catalog.documents[0].file;
    await put('cookbooks/new-genre/a.md', '# New App 逆引きマニュアル\n\n## 手順\n更新本文\n');
    result = await buildSite({ root, bundle: false });
    assert(search(result.index.records, result.catalog.documents, '更新本文').length);
    assert.equal(search(result.index.records, result.catalog.documents, '初期本文').length, 0);
    assert(!(await readdir(path.join(root, '_site/documents'))).includes(path.basename(firstFile)));
    await put('cookbooks/second/b.md', '# Second 逆引きマニュアル\n\n## 追加\n本文');
    await rm(path.join(root, 'cookbooks/new-genre/a.md'));
    result = await buildSite({ root, bundle: false });
    assert.deepEqual(result.catalog.documents.map(d => d.path), ['second/b.md']);
    await put('cookbooks/second/b.md', '# Second 逆引きマニュアル\n\n## 追加\n![不足](missing.png)');
    await assert.rejects(buildSite({ root, bundle: false }), /参照資産/);
    await rm(path.join(root, 'cookbooks/second/b.md'));
    await assert.rejects(buildSite({ root, bundle: false }), /ゼロ件/);
  } finally {
    // このテストが作成した一時ディレクトリだけを消す。
    assert(path.basename(root).startsWith('cookbook-test-'));
    await rm(root, { recursive: true, force: true });
  }
});
