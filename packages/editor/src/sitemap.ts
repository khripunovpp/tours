/**
 * Page suggestions for the step page editor, read from the site's own
 * `sitemap.xml`.
 *
 * Authors know their pages by name, not by URL glob, and typing one by hand is
 * both tedious and easy to get subtly wrong. The sitemap is the one list of
 * pages a site already publishes about itself, so it costs nothing to ask.
 *
 * Everything here degrades quietly: no sitemap, a redirect to HTML, malformed
 * XML or a cross-origin block all just mean "no suggestions", never an error in
 * the author's face. Manual entry always remains the primary path — which is
 * also how a URL on someone else's site gets in.
 */

/** Where sites conventionally publish it. Tried in order, first hit wins. */
const CANDIDATES = ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml', '/sitemap-index.xml'];

/** Follow at most this many nested sitemaps from an index. */
const MAX_NESTED = 5;
/** Stop collecting past this; suggestion lists beyond it are unusable anyway. */
const MAX_URLS = 2000;

let cache: Promise<string[]> | null = null;

/** Pull `<loc>` values out of a sitemap document. */
function locations(xml: string): string[] {
  const out: string[] = [];
  // Deliberately a regex rather than DOMParser: the document may be huge, we
  // want one field, and a malformed feed should yield partial results rather
  // than nothing.
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) out.push(m[1]!);
  return out;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) return null;
    const text = await res.text();
    // A missing sitemap often 200s with the site's HTML 404 page.
    return text.includes('<loc>') ? text : null;
  } catch {
    return null;
  }
}

/**
 * All page URLs the site advertises. Resolved once per page load and reused —
 * the list does not change while an author is editing, and re-fetching on every
 * keystroke would be absurd.
 */
export function sitePages(): Promise<string[]> {
  cache ??= (async () => {
    for (const path of CANDIDATES) {
      const xml = await fetchText(new URL(path, window.location.origin).href);
      if (!xml) continue;

      const locs = locations(xml);
      const isIndex = /<sitemapindex/i.test(xml);
      if (!isIndex) return locs.slice(0, MAX_URLS);

      // A sitemap index points at more sitemaps; walk a bounded number of them.
      const pages: string[] = [];
      for (const child of locs.slice(0, MAX_NESTED)) {
        const childXml = await fetchText(child);
        if (childXml) pages.push(...locations(childXml));
        if (pages.length >= MAX_URLS) break;
      }
      return pages.slice(0, MAX_URLS);
    }
    return [];
  })();
  return cache;
}

/**
 * Rank pages against what the author has typed.
 *
 * Matched on the whole URL, so both `ex` (the host) and `recipes` (the path)
 * find the same page — the author should not have to know which part they are
 * remembering. Shorter URLs sort first: they are the section pages someone is
 * most likely to be after.
 */
export function matchPages(pages: readonly string[], query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...pages].sort((a, b) => a.length - b.length).slice(0, limit);
  return pages
    .filter((p) => p.toLowerCase().includes(q))
    .sort((a, b) => a.length - b.length)
    .slice(0, limit);
}

/**
 * A URL turned into a glob that also matches its query string and hash, which
 * is what a step almost always wants — `/recipes` should still match
 * `/recipes?page=2`.
 */
export function toPageGlob(url: string): string {
  const trimmed = url.trim().replace(/[*\s]+$/, '');
  return trimmed ? `${trimmed}*` : '';
}
