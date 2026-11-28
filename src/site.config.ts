// Single source of truth for every business fact on the site. Nothing below is hard-coded anywhere else.
//
// LAUNCH NOTE (2026-11-27): the site launched on the fallback domain graebridgestone.com while
// graebridgestonelindon.com transfers away from Hibu. When the real domain is on SiteGround:
//   1. domain -> "https://www.graebridgestonelindon.com"
//   2. public/robots.txt sitemap line -> the real domain
//   3. data/htaccess-redirects.txt: uncomment the two fallback-301 lines
//   4. npm run build, upload dist/, run check:redirects against the real domain
export const site = {
  name: "Graebridge Stone",
  legalName: "Graebridge Stone, LLC",
  domain: "https://www.graebridgestone.com",
  phoneDisplay: "(801) 615-6140",     // real office line; the CallRail snippet swaps this string to the website tracking number (801-469-5567) for visitors
  phoneE164: "+18016156140",
  smsNumber: "+18016156140",
  email: "graebridgestone@gmail.com",
  address: { street: "15 S 1400 W", city: "Lindon", region: "UT", postal: "84042" },
  hours: "Monday to Thursday, 9:00 am to 5:00 pm",
  hoursClosed: "Friday to Sunday closed",
  founded: 2020,
  yearsExperience: "30+",
  social: { instagram: "https://www.instagram.com/graebridge_stone_", facebook: "https://www.facebook.com/112532857113102", yelp: "https://www.yelp.com/biz/graebridge-stone-lindon" },
  gbpMapsUrl: "https://maps.google.com/?cid=4290657505989072653", // Business Profile (Maps CID)
  geo: { lat: 40.33703, lng: -111.74638 }, // from the old site's Get Directions link; verify against the Business Profile pin
  gbpReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJFaeHT-OFTYcRDZdX0UR6izs",
  mapsEmbedSrc: "TODO (Google Maps embed URL for 15 S 1400 W, Lindon, UT 84042)", // falls back to a keyless embed of the address
  gtmId: "GTM-NQZSD6VN",          // Google Tag Manager, container "www.graebridgestonelindon.com" (GA4 G-M5TK7ZFGTJ is wired inside GTM)
  callrailSwapSrc: "//cdn.callrail.com/companies/624397011/4c740d141e8f865af2f5/12/swap.js", // CallRail DNI, company Graebridge Stone
  formspreeEndpoint: "https://formspree.io/f/xbgopwly", // Formspree form "Graebridge Quote Request"
  instagramEmbed: "",             // TODO: paste Behold/SnapWidget embed; empty hides the section
  feedbucketKey: "K45juGgIvcvUwjgPifMP", // Feedbucket project key. The feedback widget loads on staging builds only, never in production.
};
