import faqRaw from '../content/faq.md?raw';
import reviewsData from '../content/reviews.json';
import galleryMeta from '../assets/gallery/gallery.json';
import type { ImageMetadata } from 'astro';

/* FAQ: "Q: ..." / "A: ..." pairs from src/content/faq.md */
export interface Faq { q: string; a: string }
export const faqs: Faq[] = (() => {
  const out: Faq[] = [];
  const body = faqRaw.replace(/^---[\s\S]*?\n---\n/, '');
  for (const line of body.split(/\r?\n/)) {
    const q = line.match(/^Q:\s*(.+)$/);
    const a = line.match(/^A:\s*(.+)$/);
    if (q) out.push({ q: q[1].trim(), a: '' });
    else if (a && out.length) out[out.length - 1].a = a[1].trim();
  }
  return out.filter((f) => f.q && f.a);
})();

/* Reviews: only real entries count. The template row from the kit (and anything like it) is ignored. */
export interface Review { name: string; rating: number; date: string; text: string; source?: string }
const isReal = (r: Review) =>
  !!r.text && !/PASTE/i.test(r.text) && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && !/^First L\.?$/i.test(r.name);
export const reviews = {
  rating: reviewsData.rating as number | null,
  count: reviewsData.count as number | null,
  items: (reviewsData.reviews as Review[]).filter(isReal),
};

/* Gallery: every image in src/assets/gallery/, ordered and captioned by gallery.json. */
export interface GalleryImage { file: string; image: ImageMetadata; alt: string; caption: string; detail: string }
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const fromName = (file: string) => {
  const [room, n] = file.replace(/\.\w+$/, '').split('-');
  const label = room.charAt(0).toUpperCase() + room.slice(1);
  return `${label} stone surfaces by Graebridge Stone, project photo ${Number(n) || ''}`.trim();
};
export const gallery: GalleryImage[] = (() => {
  const byFile = new Map<string, ImageMetadata>();
  for (const [path, mod] of Object.entries(files)) byFile.set(path.split('/').pop()!, mod.default);
  const meta = galleryMeta.images as { file: string; alt?: string; caption?: string; detail?: string }[];
  const out: GalleryImage[] = [];
  for (const m of meta) {
    const image = byFile.get(m.file);
    if (!image) continue;
    out.push({ file: m.file, image, alt: m.alt || fromName(m.file), caption: m.caption ?? '', detail: m.detail ?? '' });
    byFile.delete(m.file);
  }
  for (const [file, image] of [...byFile].sort(([x], [y]) => x.localeCompare(y))) {
    out.push({ file, image, alt: fromName(file), caption: '', detail: '' });
  }
  return out.slice(0, 12);
})();
