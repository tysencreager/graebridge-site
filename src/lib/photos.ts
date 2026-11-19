// One lookup for every client photo, by file name, with its alt text.
import type { ImageMetadata } from 'astro';
import galleryMeta from '../assets/gallery/gallery.json';
import workMeta from '../assets/work/work.json';
import materialMeta from '../assets/materials/materials.json';
import pageImages from '../content/page-images.json';

const files = import.meta.glob<{ default: ImageMetadata }>(
  ['../assets/*.{jpg,jpeg,png,webp}', '../assets/gallery/*.{jpg,jpeg,png,webp}', '../assets/services/*.{jpg,jpeg,png,webp}', '../assets/work/*.{jpg,jpeg,png,webp}'],
  { eager: true }
);
const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) byName.set(path.split('/').pop()!, mod.default);

const alts = new Map<string, string>();
for (const m of [...galleryMeta.images, ...workMeta.images] as { file: string; alt?: string }[]) if (m.alt) alts.set(m.file, m.alt);

export interface Photo { file: string; image: ImageMetadata; alt: string }

/** A photo by file name, or undefined when the file is not in src/assets. */
export function photo(file?: string): Photo | undefined {
  if (!file) return undefined;
  const image = byName.get(file);
  return image ? { file, image, alt: alts.get(file) ?? 'Stone surfaces by Graebridge Stone' } : undefined;
}

/** Header photo and work strip for an inner page, from src/content/page-images.json. */
export function pagePhotos(kind: 'pages' | 'blog', id: string): { hero?: Photo; work: Photo[] } {
  const entry = (pageImages[kind] as Record<string, { hero?: string; work?: string[] }>)[id];
  return { hero: photo(entry?.hero), work: (entry?.work ?? []).map(photo).filter((p): p is Photo => !!p) };
}

/* Material card textures: src/assets/materials/<card-slug>.jpg */
const textureFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/materials/*.{jpg,jpeg,png,webp}', { eager: true });
const textureAlts = materialMeta.textures as Record<string, { alt?: string }>;
export const cardSlug = (title: string) => title.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function texture(title: string): Photo | undefined {
  const slug = cardSlug(title);
  const hit = Object.entries(textureFiles).find(([p]) => p.split('/').pop()!.replace(/\.\w+$/, '') === slug);
  return hit ? { file: hit[0].split('/').pop()!, image: hit[1].default, alt: textureAlts[slug]?.alt ?? `${title} surface, close up` } : undefined;
}
