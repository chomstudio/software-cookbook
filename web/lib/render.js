import DOMPurify from 'dompurify';
import { Marked } from 'marked';
import { parseDocument, documentURL, escapeHTML, resolveReference } from './markdown.js';

/** 生HTMLを文字列化してからサニタイズする。リンクはカタログの公開対象だけに解決する。 */
export function renderDocument(source, doc, catalog, state) {
  const parsed = parseDocument(source);
  const parser = new Marked({ gfm: true, renderer: {
    heading(token) {
      const url = documentURL(doc.path, token.headingId, state);
      return `<h${token.depth} id="${escapeHTML(token.headingId)}"><a class="heading-link" href="${escapeHTML(url)}" aria-label="${escapeHTML(token.text)}のリンク">${this.parser.parseInline(token.tokens)}</a></h${token.depth}>`;
    },
    html(token) { return escapeHTML(token.text); },
  } });
  const fragment = document.createElement('template');
  fragment.innerHTML = DOMPurify.sanitize(parser.parser(parsed.tokens), { USE_PROFILES: { html: true }, ADD_ATTR: ['id', 'class'], FORBID_TAGS: ['style', 'form'], FORBID_ATTR: ['style'] });
  // サニタイザーがDOM名と重なるIDを除去しても、共通解析で作った見出しIDは復元する。
  [...fragment.content.querySelectorAll('h1,h2,h3,h4,h5,h6')].forEach((heading, index) => {
    heading.id = parsed.headings[index].id;
  });
  for (const element of fragment.content.querySelectorAll('a[href], img[src]')) {
    // 自分で生成した見出しリンクは既に閲覧URLなので、原稿の相対参照として解釈しない。
    if (element.classList.contains('heading-link')) continue;
    const attribute = element.tagName === 'IMG' ? 'src' : 'href';
    const ref = resolveReference(doc.path, element.getAttribute(attribute));
    if (ref.type === 'fragment') {
      let id;
      try { id = decodeURIComponent(ref.hash.slice(1)); } catch { id = ref.hash.slice(1); }
      element.setAttribute(attribute, documentURL(doc.path, id, state));
    } else if (ref.type === 'local') {
      let url;
      if (/\.md$/i.test(ref.path) && catalog.documents.some(item => item.path === ref.path)) {
        let id;
        try { id = decodeURIComponent(ref.hash.slice(1)); } catch { id = ref.hash.slice(1); }
        url = documentURL(ref.path, id, state);
      } else if (catalog.assets[ref.path]) url = `./${catalog.assets[ref.path]}${ref.hash}`;
      if (url) element.setAttribute(attribute, url);
      else { element.removeAttribute(attribute); element.title = 'この参照先は公開対象に含まれていません。'; }
    } else if (ref.type === 'unsafe') element.removeAttribute(attribute);
    if (element.tagName === 'IMG') { element.loading = 'lazy'; element.decoding = 'async'; }
  }
  for (const table of fragment.content.querySelectorAll('table')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', '表（横にスクロールできます）');
    table.replaceWith(wrapper);
    wrapper.append(table);
  }
  return fragment.content;
}
