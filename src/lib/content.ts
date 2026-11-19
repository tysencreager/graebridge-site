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
  /** The "Read all reviews" link, when reviews.json carries one. */
  readAllUrl: (reviewsData as { read_all_url?: string }).read_all_url ?? '',
  /** Dates taken from Maps' "8 months ago" wording are not shown. */
  datesApproximate: (reviewsData as { dates_approximate?: boolean }).dates_approximate === true,
  items: (reviewsData.reviews as Review[]).filter(isReal),
};

/* Site photos: src/assets/gallery/gallery.json lists all of them with a role, alt text, and (for the gallery) captions. */
interface ImageMeta { file: string; role?: 'hero' | 'about' | 'service' | 'gallery'; alt?: string; caption?: string; detail?: string }
const imageMeta = galleryMeta.images as ImageMeta[];

/** Alt text for a named photo (hero.jpg, about.jpg, service-kitchen.jpg, ...). */
export const altFor = (file: string, fallback = ''): string => imageMeta.find((m) => m.file === file)?.alt ?? fallback;

/* Gallery: the role "gallery" entries in listed order, then any other image found in src/assets/gallery/. */
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
  const out: GalleryImage[] = [];
  for (const m of imageMeta.filter((x) => (x.role ?? 'gallery') === 'gallery')) {
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
