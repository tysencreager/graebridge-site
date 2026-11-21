import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const fileId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

// The eight hidden SEO pages. Frontmatter `slug` is the public URL; the file name is the route param.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages', generateId: fileId }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    short_title: z.string(),
    section: z.enum(['Materials', 'Services', 'Service Areas']),
    meta_description: z.string(),
    h1: z.string(),
    primary_keyword: z.string().optional(),
    secondary_keywords: z.string().optional(),
    schema: z.string().optional(),
    hidden: z.boolean().optional(),
  }),
});

// Seven migrated posts. A post is left out of the build while its body is still the paste placeholder.
const blog = defineCollection({
  loader: glob({ pattern: ['*.md', '!README.md'], base: './src/content/blog', generateId: fileId }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Graebridge Stone'),
    source_url: z.string().optional(),
    status: z.string().optional(),
    description: z.string().default(''),
  }),
});

export const collections = { pages, blog };
