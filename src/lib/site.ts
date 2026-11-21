import { site } from '../site.config';

export { site };

/** A config value counts as set once the TODO / XXXX placeholder has been replaced. */
export const isSet = (v?: string | null): v is string =>
  !!v && v.trim() !== '' && !/^TODO/i.test(v.trim()) && !/X{4,}/.test(v);

export const isStaging = import.meta.env.PUBLIC_ENV === 'staging';

export const telHref = `tel:${site.phoneE164}`;
export const smsHref = `sms:${site.smsNumber}`;
export const mailHref = `mailto:${site.email}`;

const a = site.address;
export const addressLine1 = a.street;
export const addressLine2 = `${a.city}, ${a.region} ${a.postal}`;
export const addressFull = `${a.street}, ${a.city}, ${a.region} ${a.postal}`;

const q = encodeURIComponent(addressFull);

/** Get Directions: the Business Profile share link once it is in config, otherwise a directions link built from the address. */
export const directionsUrl = isSet(site.gbpMapsUrl)
  ? site.gbpMapsUrl
  : `https://www.google.com/maps/dir/?api=1&destination=${q}`;

/** "Find us on Google": the Business Profile link, otherwise a Maps search for the business at its address. */
export const googleProfileUrl = isSet(site.gbpMapsUrl)
  ? site.gbpMapsUrl
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${addressFull}`)}`;

/** Map iframe: the embed URL from config, otherwise a keyless embed of the address. */
export const mapsEmbedSrc = isSet(site.mapsEmbedSrc)
  ? site.mapsEmbedSrc
  : `https://www.google.com/maps?q=${q}&output=embed`;

export const reviewUrl = isSet(site.gbpReviewUrl) ? site.gbpReviewUrl : googleProfileUrl;

export const canonical = (path: string) => new URL(path, site.domain).href;

/** Turns a home-section anchor (#contact) into a link that works from any page. */
export const href = (target: string, onHome = false) =>
  target.startsWith('#') && !onHome ? `/${target}` : target;
