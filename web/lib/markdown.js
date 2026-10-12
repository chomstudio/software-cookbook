import { Marked } from 'marked';
import GithubSlugger from 'github-slugger';
import { decodeHTML } from 'entities';

export const markdown = new Marked({ gfm: true });
export const excludedNames = new Set(['agents.md', 'agents-draft.md', 'readme.md', 'requests.md', 'prompt.md']);
export const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** 表示文字列を抽出する。コードやリンクラベルを保持し、URLや装飾記号は検索本文に混ぜない。 */
export function plain(token) {
  if (!token) return '';
  if (Array.isArray(token)) return token.map(plain).join('');
  if (token.type === 'code' || token.type === 'codespan') return token.text;
  if (token.type === 'table') return [...token.header, ...token.rows.flat()].map(plain).join(' ');
  if (token.type === 'list') return token.items.map(plain).join('\n');
  if (token.tokens) return plain(token.tokens);
  if (token.type === 'br') return '\n';
  return decodeHTML(token.text ?? '');
}

function isTOC(token) {
  if (token.type !== 'list') return false;
  let links = 0;
  let valid = true;
  const inspect = node => {
    if (node.type === 'link') {
      links++;
      if (!node.href.startsWith('#')) valid = false;
      return;
    }
    if (node.type === 'list') node.items.forEach(inspect);
    else if (node.tokens) node.tokens.forEach(inspect);
    else if (node.type !== 'space' && node.type !== 'br' && plain(node).trim()) valid = false;
  };
  inspect(token);
  return valid && links > 0;
}

/** 生成時と閲覧時で同じトークン・IDを使用し、コード中の見出し風文字列を除外する。 */
export function parseDocument(source) {
  const tokens = markdown.lexer(source);
  const slugger = new GithubSlugger();
  const headings = [];
  const references = [];
  markdown.walkTokens(tokens, token => {
    if (token.type === 'heading') {
      token.headingId = slugger.slug(plain(token));
      headings.push({ id: token.headingId, title: plain(token), depth: token.depth });
    }
    if (token.type === 'link' || token.type === 'image') references.push({ href: token.href, image: token.type === 'image' });
  });
  const title = headings.find(h => h.depth === 1)?.title ?? '';
  const app = title.endsWith('逆引きマニュアル') ? title.slice(0, -'逆引きマニュアル'.length).trim() : '';
  const sections = [];
  const parents = [];
  let current = { id: '', title, parents: [], body: '' };
  let inIntro = true;
  let updated = '';
  for (const token of tokens) {
    if (token.type === 'heading') {
      if (token.depth === 1) continue;
      if (inIntro) {
        if (current.body.trim()) sections.push(current);
        inIntro = false;
      } else sections.push(current);
      while (parents.length && parents.at(-1).depth >= token.depth) parents.pop();
      current = { id: token.headingId, title: plain(token), parents: parents.map(h => h.title), body: '' };
      parents.push({ title: current.title, depth: token.depth });
    } else {
      const text = plain(token);
      if (inIntro && /^最終更新日\s*[:：]/u.test(text.trim())) {
        updated = text.trim().replace(/^最終更新日\s*[:：]\s*/u, '');
      } else if (!(inIntro && isTOC(token))) current.body += `${text}\n`;
    }
  }
  if (inIntro || current.id) sections.push(current);
  return { tokens, title, app, updated, headings, sections, references };
}

/** 文書を基準に相対参照を解決し、cookbooks外への移動や危険なスキームを拒否する。 */
export function resolveReference(docPath, href) {
  if (href.startsWith('#')) return { type: 'fragment', hash: href };
  if (/^(https?:|mailto:)/i.test(href) || href.startsWith('//')) return { type: 'external', href };
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.includes('\\')) return { type: 'unsafe' };
  try {
    const url = new URL(href, `https://cookbooks.invalid/cookbooks/${docPath}`);
    const decoded = decodeURIComponent(url.pathname);
    if (!decoded.startsWith('/cookbooks/')) return { type: 'unsafe' };
    const path = decoded.slice('/cookbooks/'.length);
    if (!path || path.split('/').some(part => !part || part === '.' || part === '..' || part.startsWith('.'))) return { type: 'unsafe' };
    if (excludedNames.has(path.split('/').at(-1).toLowerCase())) return { type: 'unsafe' };
    return { type: 'local', path, hash: url.hash };
  } catch { return { type: 'unsafe' }; }
}

export function documentURL(path, id = '', state = {}) {
  const params = new URLSearchParams();
  for (const key of ['q', 'genre', 'app']) if (state[key]) params.set(key, state[key]);
  if (path) params.set('doc', path);
  return `./index.html${params.size ? `?${params}` : ''}${id ? `#${encodeURIComponent(id)}` : ''}`;
}
