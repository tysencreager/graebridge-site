// Post-processing for rendered Markdown (hidden SEO pages and blog posts).
import { site, telHref } from './site';

const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').trim();

/**
 * 1. Drops the leading heading when it repeats the page H1 (the template prints the H1 itself).
 * 2. Swaps the literal token PHONE for a click-to-call link showing the config phone number.
 */
export function proseHtml(html: string, heading?: string): string {
  let out = html.trim();
  const first = out.match(/^<h([12])[^>]*>([\s\S]*?)<\/h\1>\s*/);
  if (first && heading && strip(first[2]) === heading.trim()) out = out.slice(first[0].length);
  const call = `<a href="${telHref}" data-event="call_click" data-label="body">${site.phoneDisplay}</a>`;
  // Inside an existing link the token becomes plain text; elsewhere it becomes the call link.
  out = out.replace(/(<a\b[^>]*>)([^<]*)\bPHONE\b([^<]*)(<\/a>)/g, (_m, a, pre, post, z) => `${a}${pre}${site.phoneDisplay}${post}${z}`);
  return out.replace(/\bPHONE\b/g, call);
}

/** First sentence of the first paragraph of a Markdown body, as plain text. */
export function firstSentence(markdown: string): string {
  const para = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|[-*] |\d+\. |>|\()/.test(b));
  if (!para) return '';
  const text = para
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\bPHONE\b/g, site.phoneDisplay)
    .replace(/\s+/g, ' ');
  return text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
}
