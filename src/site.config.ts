// Single source of truth for every business fact on the site. Nothing below is hard-coded anywhere else.
export const site = {
  name: "Graebridge Stone",
  legalName: "Graebridge Stone, LLC",
  domain: "https://www.graebridgestonelindon.com",
  phoneDisplay: "(385) 835-3880",      // TODO: swap to the CallRail number before launch; CallRail DNI swaps this string
  phoneE164: "+13858353880",
  smsNumber: "+13858353880",
  email: "graebridgestone@gmail.com",
  address: { street: "15 S 1400 W", city: "Lindon", region: "UT", postal: "84042" },
  hours: "Monday to Thursday, 9:00 am to 5:00 pm",
  hoursClosed: "Friday to Sunday closed",
  founded: 2020,
  yearsExperience: "30+",
  social: { instagram: "https://www.instagram.com/graebridge_stone_", facebook: "https://www.facebook.com/112532857113102", yelp: "https://www.yelp.com/biz/graebridge-stone-lindon" },
  gbpMapsUrl: "TODO (share link from the Business Profile)",
  geo: { lat: 40.33703, lng: -111.74638 }, // from the old site's Get Directions link; verify against the Business Profile pin
  gbpReviewUrl: "TODO",
  mapsEmbedSrc: "TODO (Google Maps embed URL for 15 S 1400 W, Lindon, UT 84042)",
  gtmId: "GTM-XXXXXXX",          // TODO
  callrailSwapSrc: "",            // TODO: //cdn.callrail.com/companies/XXXX/XXXX/12/swap.js
  formspreeEndpoint: "https://formspree.io/f/XXXXXXXX", // TODO
  instagramEmbed: "",             // TODO: paste Behold/SnapWidget embed; empty hides the section
};
