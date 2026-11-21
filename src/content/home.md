---
# Home page copy for Graebridge Stone (one-page site, "Classic Elegance")
# Facts below come from the client's current site and contract. Do not invent stats, reviews, or project names.
# Card lines use ' | ' to separate the card title from its body text.
# Section ids are the anchors the nav, footer, hidden pages, and the 301 redirect map rely on. Keep them exactly.
# This file is parsed by src/lib/home.ts and rendered by src/pages/index.astro. Keep the 'Key: value' and '- item' line shapes.
# *Asterisks* in an H1 or H2 mark the words set in the mockup's italic accent style; they are markup, not copy.
---

# NAV
Logo: Graebridge Stone (wordmark; logo file from client if available)
Links: About (#about) · Materials (#materials) · Services (#services) · Gallery (#gallery) · FAQ (#faq) · Contact (#contact)
Right side: phone (click-to-call) · button "Request a Quote" (#contact)

# HERO (id: hero)
Kicker: Family-owned · Lindon, Utah · 30+ years of craftsmanship
H1: The Art of *Precision* Stone.
Subhead: Custom countertops and large-format porcelain surfaces for Utah homes, templated, fabricated, and installed by a family that has worked stone for more than thirty years.
Primary CTA: View Our Work (#gallery)
Secondary CTA: Request a Consult (#contact)
Tertiary (text link): Call (PHONE)

# TRUST BAR (id: trust)
Licensed & Insured · Porcelain Certified · Free Estimates · Responses Within 24 Hours · Family-Owned & Woman-Led

# ABOUT (id: about)
Kicker: Our Story
H2: Not just contractors. *We are artisans.*
P1: At Graebridge Stone, we believe stone is the soul of a room. Our family has worked natural and engineered stone for more than three decades, and since 2020 we have served Utah County, the Salt Lake Valley, and the Park City and Heber communities from our shop in Lindon, bringing an uncompromising standard to every template, cut, and polish.
P2: We are fully licensed and insured and hold specialized certification in large-format porcelain installation, a rarity in the industry. We do not just install countertops; we curate surfaces that last a lifetime.
Stats (three):
- 30+ | Years of stone craftsmanship
- 2020 | Graebridge Stone founded in Lindon
- 100% | Family-owned and operated
Feature list (three):
- Decades of Expertise | Experience you can see in every seam, edge, and polish.
- Family-Minded Service | The job is not done until you are happy. We treat your home like our own.
- Certified Porcelain Specialists | Access to higher-performance surfaces: durable, beautiful, and versatile.
Associations line (small, muted): Member, Utah Valley Home Builders Association · Lindon Chamber of Commerce
Image: team at work / shop (client photo)

# MATERIALS (id: materials)
Kicker: The Collection
H2: Stone for every room, chosen for how you live.
Intro: We carry granite, quartz, quartzite, marble, porcelain, and soapstone from makers including Cambria, Caesarstone, Cosentino, Della Terra, MSI, Pental, and Stratus, and we will walk you through the trade-offs in person, slab by slab.
Cards (six; each links where a page exists):
- Quartz | Non-porous, consistent, and nearly maintenance-free. The most popular choice for busy kitchens. → /quartz-countertops/
- Granite | Natural, one-of-a-kind, and built for heat and daily use. → /granite-countertops/
- Quartzite & Marble | Natural stone with the look of marble and, in quartzite's case, the hardness of granite. → /quartzite-marble-countertops/
- Porcelain | Large-format slabs that resist heat, scratches, and UV. We are certified to fabricate and install them. → #porcelain
- Soapstone | Soft, warm, and heat-proof, with a patina that deepens over time. → /quartzite-marble-countertops/
- Edge Profiles & Finishes | Eased, bevel, bullnose, ogee, mitered waterfall; polished, honed, or leathered. → #process

# SERVICES (id: services)
Kicker: Our Expertise
H2: Curated Stone Services
Cards (three):
- Kitchen Surfaces (id: kitchens) | From waterfall islands to seamless full-height backsplashes. We work in granite, quartz, marble, and quartzite to create the heart of your home. → Explore Kitchens (/kitchen-countertops/)
- Luxury Bath (id: bathrooms) | Custom vanity tops, shower walls, and tub decks crafted to resist moisture and look effortless. → Explore Baths (/bathroom-countertops-vanities/)
- Specialty & Porcelain (id: specialty) | Outdoor kitchens and BBQ stations, wet bars, fireplace surrounds, furniture and table tops, and large-format porcelain installations. Certified expertise for complex, high-end materials. → Start a Specialty Project (#contact)
Also offered (one line under the cards): Countertop replacement and retrofit · Old countertop removal included with installation · Tile and backsplash · Stone sealing and care guidance

# PORCELAIN CALLOUT (id: porcelain)
Kicker: Certified Porcelain Installers
H2: The surface most shops will not touch.
Copy: Large-format porcelain is thin, light, and nearly indestructible, which also makes it unforgiving to cut and install. Graebridge Stone holds specialized certification in porcelain fabrication and installation, so you get the heat resistance, stain resistance, and clean modern look without the risk.
CTA: Ask About Porcelain (#contact)

# PROCESS (id: process)
Kicker: How It Works
H2: From the first conversation to the final polish.
Steps (four):
1. Consult | Visit the Lindon shop or send us photos and measurements. We help you choose the material, edge, and finish, and we give you a free estimate.
2. Template | We measure your space precisely, including sink, cooktop, and seam placement, so every piece fits the first time.
3. Fabricate | Your slabs are cut, edged, and polished in-house by our own team, not a subcontractor.
4. Install | Most installations finish in a single day. We remove the old tops, set the new ones, and leave your kitchen ready to use.

# GALLERY (id: gallery)
Kicker: Recent Work
H2: Selected Projects
Grid of 9 to 12 curated client photos (from /content/images/gallery, provided by Nash). Captions use material + room only (for example "Calacatta-look quartz, waterfall island") unless the client supplies a project name. No stock photography in the final build.
CTA: Follow Our Work on Instagram (IG URL)

# REVIEWS (id: reviews)
Kicker: Client Stories
H2: What Utah homeowners say
Content: real Google reviews from /content/reviews.json (reviewer first name + last initial, star rating, date, text). Show 3 at a time with a simple slider or a 3-up grid. Rating summary line above: "★ X.X on Google · N reviews" (values from the JSON).
CTA: Read All Reviews on Google (GBP review URL)
Do not ship placeholder or invented testimonials. If reviews.json is empty at build time, hide the section.

# INSTAGRAM (id: instagram)
Kicker: @graebridge_stone_
H2: Fresh from the shop
Embed: Instagram feed widget (Behold.so free tier or SnapWidget), 6 to 8 most recent posts, lazy-loaded below the fold. Placeholder container with data-ig-feed until the client's embed code is pasted into config.

# FAQ (id: faq)
Kicker: Good to Know
H2: Questions we hear every week
Content: the 10 questions in /content/faq.md as an accordion. Mark up with FAQPage schema.

# SERVICE AREA (id: service-area)
Kicker: Where We Work
H2: Based in Lindon. Installing across the Wasatch Front and Back.
Copy: Our shop is at 15 S 1400 W in Lindon, ten minutes from Orem, Provo, American Fork, and Lehi. We template and install across Utah County, the Salt Lake Valley, and Park City and Heber, and we travel farther for the right project.
Three area links: Utah County (/countertops-utah-county/) · Salt Lake City & County (/countertops-salt-lake-city/) · Park City & Heber Valley (/countertops-park-city-heber/)
Map: Google Maps embed of the Lindon address (lazy-loaded).

# CONTACT (id: contact)
Kicker: Contact Us
H2: Start Your Project
Copy: Reach out for a complimentary consultation. Whether you are building custom or remodeling, let us bring thirty years of craftsmanship to your home. We respond within one business day.
Details:
- Phone: PHONE (click-to-call)
- Text: PHONE (sms: link)
- Email: graebridgestone@gmail.com
- Shop: 15 S 1400 W, Lindon, UT 84042 (Get Directions link)
- Hours: Monday to Thursday, 9:00 am to 5:00 pm · Friday to Sunday closed
Form (Formspree): Name* · Phone* · Email · Service Interest (Kitchen Countertops / Bathroom Vanities / Outdoor or Specialty / Porcelain / Other) · Message · Upload a photo of your space (optional) · honeypot field. Button: Send Request. Success message: "Thank you. We will be in touch within one business day."

# FOOTER
Column 1: Graebridge Stone wordmark · one line: Custom countertops, fabricated and installed in Lindon, Utah since 2020. · social icons: Facebook, Instagram, Yelp
Column 2 (Materials): Quartz · Granite · Quartzite & Marble · Kitchen Countertops · Bathroom Countertops & Vanities
Column 3 (Service Areas): Utah County · Salt Lake City & County · Park City & Heber Valley · Blog
Column 4 (Visit): address, phone, email, hours
Bottom line: © 2026 Graebridge Stone, LLC. All rights reserved. · Privacy Policy · Site by Elevate Growth Solutions (small, muted link to elevategrowth.solutions)

# STICKY MOBILE BAR
Call · Text · Get a Quote (three equal buttons, fixed bottom, hidden on desktop)
