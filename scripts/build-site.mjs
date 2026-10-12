import { readdir, readFile, writeFile, mkdir, copyFile, rm, lstat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
import { parseDocument, resolveReference, excludedNames, compare } from '../web/lib/markdown.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 16);
const allowedAsset = /\.(png|jpe?g|gif|webp|avif|svg|ico|pdf|txt|mp3|wav|ogg|mp4|webm)$/i;

async function scan(root, prefix = '') {
  const files = [];
  for (const entry of (await readdir(path.join(root, prefix), { withFileTypes: true })).sort((a, b) => compare(a.name, b.name))) {
    if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await scan(root, relative));
    else if (entry.isFile() && prefix && /\.md$/i.test(entry.name) && !excludedNames.has(entry.name.toLowerCase())) files.push(relative);
  }
  return files.sort(compare);
}

/** 参照パスを実体でも検査し、シンボリックリンクを経由した範囲外の収集を防ぐ。 */
async function readAsset(root, relative) {
  const segments = relative.split('/');
  let current = root;
  for (const segment of segments) {
    current = path.join(current, segment);
    if ((await lstat(current)).isSymbolicLink()) throw new Error(`シンボリックリンクは公開できません: ${relative}`);
  }
  const resolved = await realpath(current);
  const inside = path.relative(await realpath(root), resolved);
  if (inside.startsWith('..') || path.isAbsolute(inside)) throw new Error(`cookbooks外の資産: ${relative}`);
  return readFile(resolved);
}

/** 文書、検索データ、表示用コードを同じ入力から作り直す。原稿には書き込まない。 */
export async function buildSite({ root = projectRoot, out = path.join(root, '_site'), bundle = true } = {}) {
  root = path.resolve(root);
  out = path.resolve(out);
  if (out !== path.join(root, '_site')) throw new Error('出力先はプロジェクト内の_siteに限定します。');
  const cookbookRoot = path.join(root, 'cookbooks');
  if ((await lstat(cookbookRoot)).isSymbolicLink()) throw new Error('cookbooksをシンボリックリンクにはできません。');
  const documents = [];
  const records = [];
  const parsed = new Map();
  const files = await scan(cookbookRoot);
  for (const relative of files) {
    const bytes = await readAsset(cookbookRoot, relative);
    const source = bytes.toString('utf8');
    const doc = parseDocument(source);
    if (!doc.app) { console.warn(`対象外タイトル: ${relative}`); continue; }
    const file = `documents/${hash(bytes)}.md`;
    documents.push({ path: relative, genre: relative.split('/')[0], app: doc.app, title: doc.title, updated: doc.updated, headings: doc.headings, file });
    parsed.set(relative, { ...doc, bytes });
    doc.sections.forEach((section, order) => records.push({ path: relative, ...section, body: section.body.trim(), order }));
  }
  if (!documents.length) throw new Error('対象文書がゼロ件のため公開を中止しました。');
  const assets = {};
  const assetBytes = new Map();
  for (const [relative, doc] of parsed) {
    const ids = new Set(doc.headings.map(h => h.id));
    for (const reference of doc.references) {
      const ref = resolveReference(relative, reference.href);
      if (ref.type === 'fragment') {
        let id;
        try { id = decodeURIComponent(ref.hash.slice(1)); } catch { id = ref.hash.slice(1); }
        if (id && !ids.has(id)) console.warn(`見出し参照切れ: ${relative}: ${reference.href}`);
      } else if (ref.type === 'local') {
        if (/\.md$/i.test(ref.path)) {
          if (!parsed.has(ref.path)) console.warn(`対象外Markdownリンク: ${relative}: ${reference.href}`);
          else if (ref.hash) {
            let id;
            try { id = decodeURIComponent(ref.hash.slice(1)); } catch { id = ref.hash.slice(1); }
            if (!parsed.get(ref.path).headings.some(h => h.id === id)) console.warn(`見出し参照切れ: ${relative}: ${reference.href}`);
          }
        } else {
          if (!allowedAsset.test(ref.path)) throw new Error(`公開できない資産形式: ${relative}: ${reference.href}`);
          if (!assets[ref.path]) {
            const bytes = await readAsset(cookbookRoot, ref.path).catch(error => { throw new Error(`参照資産を取得できません: ${relative}: ${reference.href}`, { cause: error }); });
            const file = `assets/${hash(bytes)}${path.extname(ref.path).toLowerCase()}`;
            assets[ref.path] = file;
            assetBytes.set(file, bytes);
          }
        }
      } else if (ref.type === 'unsafe') console.warn(`公開対象外の参照: ${relative}: ${reference.href}`);
    }
  }
  // 検証完了後に、確認済みのプロジェクト内生成先だけを作り直す。
  await rm(out, { recursive: true, force: true });
  for (const directory of ['data', 'documents', 'assets', 'web']) await mkdir(path.join(out, directory), { recursive: true });
  let commit = process.env.GITHUB_SHA;
  if (!commit) {
    try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
    catch { commit = 'local'; }
  }
  const index = { version: 1, commit, records };
  const indexBytes = JSON.stringify(index);
  const indexFile = `data/search-index.${hash(indexBytes)}.json`;
  const catalog = { version: 1, commit, documents, assets, indexFile };
  await writeFile(path.join(out, indexFile), indexBytes);
  await writeFile(path.join(out, 'data/catalog.json'), JSON.stringify(catalog));
  for (const doc of documents) await writeFile(path.join(out, doc.file), parsed.get(doc.path).bytes);
  for (const [file, bytes] of assetBytes) await writeFile(path.join(out, file), bytes);
  await copyFile(path.join(root, 'index.html'), path.join(out, 'index.html'));
  await copyFile(path.join(root, 'web/styles.css'), path.join(out, 'web/styles.css'));
  if (bundle) {
    await build({ entryPoints: [path.join(root, 'web/app.js')], outfile: path.join(out, 'web/app.js'), bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true, legalComments: 'eof' });
    const notices = [];
    for (const name of ['marked', 'github-slugger', 'dompurify', 'entities']) {
      const directory = path.join(root, 'node_modules', name);
      const licenses = (await readdir(directory)).filter(file => /^licen[cs]e/i.test(file)).sort(compare);
      if (!licenses.length) throw new Error(`ライセンス文書が見つかりません: ${name}`);
      for (const license of licenses) notices.push(`${name}\n${await readFile(path.join(directory, license), 'utf8')}`);
    }
    await writeFile(path.join(out, 'THIRD-PARTY-LICENSES.txt'), notices.join('\n\n--------------------\n\n'));
  }
  console.log(`${documents.length}文書 / ${records.length}項目を生成: ${out}`);
  return { catalog, index };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildSite().catch(error => { console.error(error); process.exitCode = 1; });
}
