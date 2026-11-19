# Graebridge Stone website build brief

For Claude Code. Read this whole file before writing code. Everything you need that is not in this file is in the `content/`, `data/`, and `schema/` folders beside it, plus the design reference `reference/version1.html` that Tysen will drop in.

## 1. What we are building

A one-page luxury website for Graebridge Stone, a family-owned countertop fabricator in Lindon, Utah, plus eight hidden SEO pages and a migrated blog. The site replaces a 126-URL Hibu site that goes dark on **Saturday, November 28, 2026**. The new site must be live on `https://www.graebridgestonelindon.com` by **Wednesday, November 25**. A reviewable first draft of the home page is due **Thursday, November 19**.

The design direction is **Version 1, "Classic Elegance"** from Tysen's mockup (`reference/version1.html`). That file is the single source of truth for typography, color, spacing, button style, and section rhythm. Lift the fonts, palette, and component styling from it exactly; do not invent a new look. Where this brief and the mockup disagree on **content** (copy, facts, section list), this brief wins, because the mockup used placeholder facts.

## 2. Stack and deploy

- **Astro** (latest), static output (`output: 'static'`). Plain `.astro` components, scoped CSS, no UI framework, no Tailwind unless the mockup already uses it. Keep client-side JS to three things: the mobile nav, the FAQ accordion, and the gallery lightbox. No jQuery.
- Content: Markdown in `src/content/` using Astro content collections for `pages` (the 8 SEO pages) and `blog` (7 posts). Home page copy lives in `src/content/home.md` and is rendered by `src/pages/index.astro`; do not hard-code copy in components.
- Config: `src/site.config.ts` built from `site.config.example.ts`. Every phone number, address, hour, social link, and third-party ID on the site reads from this file. The phone number will change before launch (CallRail), so it must exist in exactly one place.
- Forms: Formspree (endpoint in config), with a honeypot field, `enctype="multipart/form-data"` for the photo upload, and an inline success message (no redirect).
- Hosting: SiteGround shared hosting (Apache). Deploy = upload `dist/` to `public_html/`. Ship a `public/.htaccess` built from `data/htaccess-redirects.txt` plus the standard Astro trailing-slash and caching rules.
- Staging for the Thursday draft: `npm run build` and deploy `dist/` to a Cloudflare Pages project (Tysen already uses Cloudflare) or any static host, with `<meta name="robots" content="noindex">` injected when `PUBLIC_ENV=staging`. Production builds must not carry noindex.
- Git: initialize a repo, commit as you go, and leave a `README.md` with the build, preview, and deploy steps in five lines or fewer each.

## 3. Pages and URLs

| URL | Type | Source |
| --- | --- | --- |
| `/` | One-page home | `content/home.md` |
| `/quartz-countertops/` | Hidden SEO page | `content/pages/quartz-countertops.md` |
| `/granite-countertops/` | Hidden SEO page | `content/pages/granite-countertops.md` |
| `/quartzite-marble-countertops/` | Hidden SEO page | `content/pages/quartzite-marble-countertops.md` |
| `/kitchen-countertops/` | Hidden SEO page | `content/pages/kitchen-countertops.md` |
| `/bathroom-countertops-vanities/` | Hidden SEO page | `content/pages/bathroom-countertops-vanities.md` |
| `/countertops-utah-county/` | Hidden SEO page | `content/pages/countertops-utah-county.md` |
| `/countertops-salt-lake-city/` | Hidden SEO page | `content/pages/countertops-salt-lake-city.md` |
| `/countertops-park-city-heber/` | Hidden SEO page | `content/pages/countertops-park-city-heber.md` |
| `/blog/` | Blog index (hidden from nav) | collection |
| `/blog/<slug>/` | 7 posts, original slugs | `content/blog/*.md` |
| `/privacy-policy/` | Simple page | write a standard small-business privacy policy naming Graebridge Stone, LLC, Formspree, Google Analytics, and CallRail call recording |
| `/interim/` | Interim landing page | see section 9 |
| `/404` | Custom 404 | phone, address, links to the three area pages |

"Hidden" means: not in the header nav, but present in the footer, in the sitemap, linked from the relevant home-page cards, and fully indexable. Every page uses trailing slashes (`trailingSlash: 'always'`).

Section anchors on the home page must be exactly: `#hero #trust #about #materials #services #kitchens #bathrooms #specialty #porcelain #process #gallery #reviews #instagram #faq #service-area #contact`. The 301 map in `data/redirects.csv` points old Hibu URLs at these anchors.

## 4. Home page

Build the sections in the order given in `content/home.md`, using the copy there verbatim. The file uses `Title | body` on card lines. Notes per section:

- **Header:** sticky; transparent over the hero, solid (mockup background color) after 40px of scroll. Logo wordmark on the left, six nav links, phone number with `tel:` link, and a "Request a Quote" button in the mockup's primary button style. Mobile: hamburger, full-screen menu, phone and quote button at the bottom of it.
- **Hero:** full-bleed client photo (`src/assets/hero.jpg`, provided by Nash; use a dark-stone placeholder gradient until it arrives), kicker, H1, subhead, two buttons, text link to call. The H1 is the only `<h1>` on the page.
- **Trust bar:** five short items in a single row (wraps to two rows on mobile), thin rules above and below in the mockup's rule color.
- **About:** split layout, image left, copy right, three stats in the mockup's stat style, three feature items, associations line in muted small type.
- **Materials:** six cards in a 3x2 grid (2x3 on tablet, 1 column on mobile). Each card: material name, two-line description, "Learn more" link where the card has a URL.
- **Services:** three cards matching the mockup's services section, each with an image, title, copy, and outlined button. Give the three cards the ids `kitchens`, `bathrooms`, `specialty`.
- **Porcelain callout:** full-width band in the mockup's accent treatment (tinted background or dark band), kicker, H2, copy, one button.
- **Process:** four numbered steps in a row (2x2 on mobile), number in display type, short copy.
- **Gallery:** responsive grid of 9 to 12 images from `src/assets/gallery/`, each with alt text from the filename or a `gallery.json` caption file, opening in a lightweight lightbox. If fewer than 6 images exist at build time, render what exists; never pad with stock photos.
- **Reviews:** read `content/reviews.json`. If `reviews` has fewer than 3 real entries, do not render the section at all. Otherwise: rating line, 3-up cards (one column on mobile), reviewer name, stars, date, text, and a "Read all reviews on Google" button.
- **Instagram:** render the embed string from config inside a lazy-loaded container; if the string is empty, hide the section.
- **FAQ:** accordion from `content/faq.md`; one open at a time; `<details>/<summary>` with styled markers is acceptable. Inject `schema/faq.jsonld`.
- **Service area:** copy, three area links styled as cards or pills, lazy-loaded Google Maps iframe from config.
- **Contact:** two columns (details left, form right), stacking on mobile. Form fields and success copy are in `home.md`. Phone and text links use `tel:` and `sms:`.
- **Footer:** four columns per `home.md`, bottom line with copyright and privacy link.
- **Sticky mobile bar:** Call, Text, Get a Quote. Visible below 768px only, `position: fixed; bottom: 0`, with safe-area padding.

## 5. Hidden SEO page template

One `[slug].astro` template renders all eight pages from the `pages` collection. Layout:

1. Compact header (same as home) and a slim hero: kicker ("Materials" or "Service Areas"), H1 from frontmatter, one-sentence intro pulled from the first paragraph.
2. Body: the Markdown, with `##`/`###` styled in the mockup's display type, lists styled, links in the accent color.
3. A "Related" strip linking to the other seven pages plus the home sections `#gallery` and `#contact`.
4. The contact CTA band (phone, text, "Request a free estimate" button) above the footer.
5. `<head>`: title and meta description from frontmatter, canonical, Open Graph, and the two JSON-LD blocks from `schema/hidden-page-templates.jsonld` with the placeholders filled from frontmatter.

Breadcrumbs appear visually (Home / Page) and in BreadcrumbList schema. No sidebar.

## 6. Blog

`/blog/` lists the seven posts newest first (title, date, description, "Read more"). `/blog/<slug>/` renders the Markdown with a simple article layout, author "Graebridge Stone", publish date, the contact CTA band, and three "More from the blog" links. Posts whose body still says "(Paste article body here.)" must be excluded from the build (`draft: true` behavior keyed on that string or a `status` field), so the site can launch before Nash finishes pasting.

## 7. Head, tracking, and schema

- Global `<head>`: charset, viewport, title pattern `{page title} | Graebridge Stone` (home: `Custom Countertops in Lindon, Utah | Graebridge Stone`), meta description, canonical (`https://www.graebridgestonelindon.com` + path), Open Graph and Twitter cards with a default `og-graebridge-stone.jpg`, favicon set, theme-color from the mockup palette.
- Home page JSON-LD: `schema/localbusiness.jsonld` with `PHONE_E164`, `LAT_FROM_GBP`, `LNG_FROM_GBP`, and the `sameAs` placeholders filled from config, plus `schema/faq.jsonld`.
- Google Tag Manager snippet from config in `<head>` and `<body>`; the GA4 property is configured inside GTM, not in code. Fire `data-event` attributes on: phone links (`call_click`), sms links (`text_click`), form submit success (`quote_request`), directions link (`directions_click`). Use a small inline script that pushes `{event, label}` to `dataLayer`.
- CallRail dynamic number insertion: load `callrailSwapSrc` from config at the end of `<body>` when it is non-empty. Render the phone number as plain text matching `phoneDisplay` everywhere (header, hero link, contact, footer, sticky bar) so CallRail's swap.js can find it.
- `public/robots.txt` allowing everything and pointing to `/sitemap-index.xml`; use `@astrojs/sitemap`.

## 8. Redirects

`data/redirects.csv` maps all 130 known Hibu URLs (126 from the sitemap plus four found by crawl) to a new destination. Generate `public/.htaccess` from `data/htaccess-redirects.txt` and also add the non-anchor entries to `astro.config.mjs` `redirects` so `npm run preview` behaves. Two city slugs contain a capital letter (`salt-lake-City-ut`, `west-valley-City-ut`); the `.htaccess` rules handle them case-insensitively. Add a script, `npm run check:redirects`, that reads the CSV and requests each old URL against a base URL argument, failing on anything other than a 301 to the expected target.

## 9. Interim landing page

Build `/interim/` as a standalone page in the same design: logo, one line about the new site coming, phone (click-to-call), text link, address with directions, hours, the quote form, and a "Find us on Google" button. If the domain transfer slips, this page is what goes live at the root on November 25 instead of the home page, so it must work with the same config and the same form endpoint.

## 10. Performance, accessibility, and quality bar

- Lighthouse mobile: Performance, Accessibility, Best Practices, SEO all 90 or higher on the home page and one hidden page.
- Images: `astro:assets` with `format="avif"` and WebP fallback, explicit width/height, `loading="lazy"` below the hero, hero image `fetchpriority="high"`. Gallery sources no wider than 1600px.
- Fonts: self-host the mockup's typefaces in `public/fonts/` with `font-display: swap` and preload the display face. If the mockup loads Google Fonts, download the files; no runtime Google Fonts request.
- Color contrast 4.5:1 for body text; visible focus states; skip link; every image has meaningful alt text; form inputs have labels; accordion is keyboard operable.
- No layout shift from the sticky bar, the Instagram embed, or the map (reserve height).
- Zero console errors. No `lorem`, no "Est. 1995", no "The Harrison Family", no Unsplash URLs in the final build; those were mockup placeholders.

## 10b. Things the crawl told us

- The old site ships no structured data at all, so the LocalBusiness and FAQ schema here is net new; validate it with Google's Rich Results test before launch.
- Only 37 image files were served by the old pages; the client photo set lives in `src/assets/` once Nash runs the download script. Expect 40 to 70 gallery photos named `graebridge-stone-kitchen-gallery (n)`, `graebridge-stone-bathroom-gallery (n)`, and `graebridge-stone-basement-renovation-gallery (n)`; rename on import to `kitchen-01.jpg` style names and write alt text from the room and material, never leave the Hibu filename as alt.
- Every old page linked to Hibu's own privacy/terms/accessibility pages on budurl.com and b.link. Do not carry any of those links over.
- Old `/gallery` had 810 internal inlinks, the most of any page; make sure `#gallery` on the home page is a real, substantial section, not a strip.

## 11. Facts you must not change

- Business: Graebridge Stone, LLC. Founded 2020. The team has 30+ years of stone experience (say "30+ years of craftsmanship", never "established 1995" or "in business 30 years").
- Family-owned and woman-led. Licensed and insured. Certified in large-format porcelain installation.
- Address: 15 S 1400 W, Lindon, UT 84042. Hours: Monday to Thursday 9:00 am to 5:00 pm; closed Friday to Sunday.
- Email: graebridgestone@gmail.com. Phone: from config only.
- Materials: granite, quartz, quartzite, marble, porcelain, soapstone. Brands: Cambria, Caesarstone, Cosentino, Della Terra, MSI, Pental, Stratus.
- Memberships: Utah Valley Home Builders Association, Lindon Chamber of Commerce.
- Payment: cash, check, Visa, MasterCard, American Express, Discover.
- Service area: Utah County, Salt Lake County, Park City and the Heber Valley.

## 12. Definition of done for the Thursday draft

1. Home page complete at desktop and mobile widths with the copy from `content/home.md`, the mockup's typography and palette, and whatever client images exist in `src/assets/` (placeholders clearly marked with a subtle "image coming" tile, not stock).
2. All eight hidden pages render from their Markdown with correct titles, descriptions, canonicals, breadcrumbs, and schema.
3. Blog index and any pasted posts render; unpasted posts are excluded.
4. Form submits to the Formspree endpoint and shows the success message; honeypot works.
5. Anchors, nav, sticky bar, accordion, lightbox, and mobile menu all work without console errors.
6. `npm run build` passes; `npm run check:redirects` passes against the preview URL for the non-anchor rules.
7. Lighthouse mobile scores recorded in `README.md`.
8. Deployed to the staging URL with noindex, and the URL posted back to Tysen.

## 13. Order of work

1. Scaffold Astro, config, layouts, fonts and palette from `reference/version1.html`.
2. Home page sections top to bottom; deploy to staging after the hero, about, materials, and services are in so Tysen can react early.
3. Hidden page template and the eight pages; blog; privacy; interim; 404.
4. Schema, GTM, CallRail hook, sitemap, robots, `.htaccess`, redirect checker.
5. Images and performance pass; Lighthouse; README.
