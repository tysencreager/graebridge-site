import { getCollection, type CollectionEntry } from 'astro:content';

export const PASTE_PLACEHOLDER = '(Paste article body here.)';

/** Posts whose body is still the paste placeholder (or that are marked draft) stay out of the build. */
export async function livePosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', (p) => !(p.body ?? '').includes(PASTE_PLACEHOLDER) && (p.body ?? '').trim() !== '' && p.data.status !== 'draft');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postPath = (p: CollectionEntry<'blog'>) => `/blog/${p.id}/`;
export const formatDate = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
