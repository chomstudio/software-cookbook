import { compare } from './markdown.js';

export const normalize = text => text.normalize('NFKC').toLowerCase();
export const queryTerms = text => normalize(text).trim().split(/\s+/u).filter(Boolean);

/** 各語の最良フィールドの点数を合計するAND検索。 */
export function search(records, documents, query, filters = {}) {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  const docs = new Map(documents.map(doc => [doc.path, doc]));
  return records.flatMap(record => {
    const doc = docs.get(record.path);
    if (!doc || (filters.genre && doc.genre !== filters.genre) || (filters.app && doc.path !== filters.app)) return [];
    const fields = [record.title, record.parents.join(' '), `${doc.app} ${doc.path.split('/').at(-1).replace(/\.md$/i, '')}`, doc.genre, record.body].map(normalize);
    const points = terms.map(term => {
      const index = fields.findIndex(field => field.includes(term));
      return index < 0 ? 0 : 5 - index;
    });
    if (points.includes(0)) return [];
    return [{ ...record, doc, score: points.reduce((sum, n) => sum + n, 0) }];
  }).sort((a, b) => b.score - a.score || compare(a.path, b.path) || a.order - b.order);
}

/** NFKCで一文字が複数文字になる場合も、強調範囲を元の文字列へ戻す。 */
export function matchRanges(text, terms) {
  let normalized = '';
  const map = [];
  const segments = new Intl.Segmenter('ja', { granularity: 'grapheme' }).segment(text);
  for (const { segment, index } of segments) {
    const value = normalize(segment);
    normalized += value;
    for (let i = 0; i < value.length; i++) map.push([index, index + segment.length]);
  }
  const ranges = [];
  for (const term of terms) {
    if (!term) continue;
    let position = normalized.indexOf(term);
    while (position >= 0) {
      ranges.push([map[position][0], map[position + term.length - 1][1]]);
      position = normalized.indexOf(term, position + term.length);
    }
  }
  const merged = [];
  for (const range of ranges.sort((a, b) => a[0] - b[0])) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  return merged;
}

export function excerpt(text, terms) {
  const compact = text.replace(/\s+/gu, ' ').trim();
  const first = matchRanges(compact, terms)[0]?.[0] ?? 0;
  const start = Math.max(0, first - 25);
  return `${start ? '…' : ''}${compact.slice(start, start + 120)}${compact.length > start + 120 ? '…' : ''}`;
}
