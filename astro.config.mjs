import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import { site } from './src/site.config.ts';

// Non-anchor 301s from the Hibu map so `astro dev` behaves. Production 301s come from
// public/.htaccess (SiteGround) and public/_redirects (Cloudflare Pages staging).
function hibuRedirects() {
  const rows = fs.readFileSync('./data/redirects.csv', 'utf8').trim().split(/\r?\n/).slice(1);
  const out = {};
  for (const row of rows) {
    const [from, to] = row.split(',');
    if (!from || !to || to.includes('#')) continue;
    if (from.replace(/\/$/, '') === to.replace(/\/$/, '')) continue; // slash-only: the server handles it
    out[from] = { status: 301, destination: to };
  }
  return out;
}

// The blog index stays out of the sitemap until at least one post body has been pasted.
const blogDir = './src/content/blog';
const livePosts = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .filter((f) => !fs.readFileSync(`${blogDir}/${f}`, 'utf8').includes('(Paste article body here.)'));

export default defineConfig({
  site: site.domain,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: hibuRedirects(),
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (path.startsWith('/interim/') || path.startsWith('/404')) return false;
        if (path === '/blog/' && livePosts.length === 0) return false;
        return true;
      },
    }),
  ],
});
