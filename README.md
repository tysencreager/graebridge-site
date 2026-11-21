# Graebridge Stone website

One-page site for Graebridge Stone (Lindon, Utah) with eight hidden SEO pages, a blog, a privacy policy, an interim landing page, and a 404. Astro, static output, no UI framework. The full brief is in `CLAUDE_CODE_BRIEF.md`; the design reference is `reference/version1.html`.

## Build

```bash
npm install
npm run build            # production: writes dist/, regenerates public/.htaccess and public/_redirects first
npm run build:staging    # same, with <meta name="robots" content="noindex"> on every page
```

Needs Node 22.23.4 or newer (`.nvmrc`).

## Preview

```bash
npm run dev              # live reload at http://localhost:4321
npm run build && npm run preview   # serves dist/ the way SiteGround will, including the 301s and the 404 page
```

`npm run preview` is a small Node server (`scripts/preview.mjs`) that reads the rules from `dist/.htaccess`, because `astro preview` cannot answer a static build with real 301s.

## Check the redirects

```bash
npm run check:redirects -- http://localhost:4321                 # all 129 rules, anchors included
npm run check:redirects -- http://localhost:4321 --skip-anchors  # page-to-page rules only
npm run check:redirects -- https://claude-graebridge-stone-buil.graebridge-site.pages.dev --allow-308   # Cloudflare answers slash-only rules with 308
```

Fails on anything other than a 301 to the target in `data/redirects.csv`. 5xx answers and network errors are retried twice; add `--concurrency 2` if a host throttles parallel requests.

## Deploy to staging (Cloudflare Pages)

Staging URL for the pull request branch: https://claude-graebridge-stone-buil.graebridge-site.pages.dev (noindex). Setup, for reference:

1. Cloudflare dashboard: Workers & Pages, Create, Pages, Connect to Git, pick this repository.
2. Production branch: the branch that holds the site. Until the pull request is merged that is `claude/graebridge-stone-build-9g29tm`, not `main` (`main` has no `package.json` yet, so building it fails with "Could not read package.json").
3. Build command `npm run build`, output directory `dist`.
4. Environment variables, for both Production and Preview: `PUBLIC_ENV=staging` and `NODE_VERSION=22.23.5`.
5. Save and deploy. Every push to the branch redeploys. `public/_redirects` gives staging the same 301 map.

## Deploy to production (SiteGround)

1. Replace every `TODO` in `src/site.config.ts` (see the list below).
2. `npm run build` (not `build:staging`; production must not carry noindex).
3. Upload the contents of `dist/` to `public_html/`, including the hidden `.htaccess` file.
4. `npm run check:redirects -- https://www.graebridgestonelindon.com`
5. Validate the home page in Google's Rich Results test (the old site had no structured data at all).

## Interim launch (only if the domain transfer slips)

```bash
npm run build:interim    # normal build, then the interim page replaces dist/index.html
```

Upload `dist/` as usual, minus `home-full.html.bak`. The interim page uses the same config and the same Formspree endpoint. It can be previewed any time at `/interim/`.

## Where things live

| What | Where |
| --- | --- |
| Phone, address, hours, social links, GTM, CallRail, Formspree, maps | `src/site.config.ts` (the only place the phone number exists) |
| Home page copy | `src/content/home.md`, parsed by `src/lib/home.ts` |
| FAQ | `src/content/faq.md` and `schema/faq.jsonld` (the build fails if the questions drift apart) |
| Reviews | `src/content/reviews.json` (the section stays hidden until it holds 3 real reviews) |
| Hidden SEO pages | `src/content/pages/*.md` |
| Blog posts | `src/content/blog/*.md` (a post whose body is `(Paste article body here.)` is left out of the build) |
| Gallery photos; alt text and captions for every photo | `src/assets/gallery/` and `src/assets/gallery/gallery.json` |
| Hero photo | `src/assets/hero.jpg` (if the file is missing the hero falls back to a dark stone gradient) |
| About photos (owners portrait and shop team) | `src/assets/about.jpg`, `src/assets/team.jpg` |
| Service card photos | `src/assets/services/service-{kitchen,bath,specialty}.jpg` |
| Material card textures | `src/assets/materials/<card>.jpg` and `materials.json` (free-license stock, with credits and sources; porcelain and soapstone are stand-ins) |
| Header photo and work strip on each inner page and blog post | `src/content/page-images.json`, drawing on `src/assets/gallery`, `services`, and `work` |
| 301 map | `data/redirects.csv` and `data/htaccess-redirects.txt` (source for the generated `.htaccess` and `_redirects`) |
| Design tokens | `src/styles/global.css` |

## Before launch: config values still marked TODO

| Key in `src/site.config.ts` | Until it is set |
| --- | --- |
| `phoneDisplay`, `phoneE164`, `smsNumber` | shows the shop number; swap for the CallRail number |
| `formspreeEndpoint` | the form shows its "did not send" fallback |
| `gtmId` | no Tag Manager snippet is rendered |
| `callrailSwapSrc` | no CallRail script is loaded |
| `gbpMapsUrl` | directions and "Find us on Google" use links built from the address; left out of schema `sameAs` |
| `gbpReviewUrl` | the reviews button falls back to the Google Maps listing |
| `mapsEmbedSrc` | the map is a keyless embed of the address |
| `instagramEmbed` | the Instagram section is hidden |
| `feedbucketKey` | set; the Feedbucket feedback widget loads on staging builds only (`PUBLIC_ENV=staging`) and never in production |

Formspree file uploads need a paid Formspree plan; on the free plan the photo field is dropped.

## Lighthouse (mobile)

Run on 2026-11-19 with Lighthouse's default mobile throttling. No GTM, CallRail, or Instagram embed was present, so re-run once those are in. The localhost rows include the hero photo, the header photos, and the work strips.

| Page | Where | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- | --- |
| `/` | localhost, production build | 96 (LCP 2.7 s) | 100 | 100 | 100 |
| `/granite-countertops/` | localhost, production build | 99 | 100 | 100 | 100 |
| `/blog/` | localhost, production build | 99 | 100 | 100 | 100 |
| `/blog/what-makes-soapstone-countertops-a-favorite-for-timeless-kitchen-designs/` | localhost, production build | 99 | 100 | 100 | 100 |
| `/interim/` | localhost, production build | 100 | 100 | 100 | 100 |
| `/` | staging, before the photos were added | 99 to 100 (three runs) | 100 | 100 | 69 |
| `/quartz-countertops/` | staging, before the photos were added | 100 | 100 | 100 | 66 |

The SEO score on staging is low for one reason only: Lighthouse's "page is blocked from indexing" audit, which is the staging noindex doing its job. The production build has no noindex and scores 100. One staging run of `/` scored 82 on performance from a main-thread spike on the test machine; three repeat runs scored 100, 99, and 100.
