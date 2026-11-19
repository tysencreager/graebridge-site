// Parses src/content/home.md into structured sections so no home page copy lives in components.
// Line shapes: "# SECTION (id: x)", "Key: value", "Key (note):" followed by "- Title | body → link" items.
import raw from '../content/home.md?raw';
import { site } from '../site.config';

export interface Link { label: string; href: string; note?: string }
export interface Item { n?: string; title: string; body: string; id?: string; link?: Link }
export interface Section {
  name: string;
  id?: string;
  fields: Record<string, string>;
  notes: Record<string, string>;
  lists: Record<string, Item[]>;
  /** Lines that are neither a field nor a list item (single-line sections, build notes). */
  lines: string[];
}

const fill = (s: string) => s.replace(/\bPHONE\b/g, site.phoneDisplay);

/** "Label (/path/)" or "Label (#anchor)" or "Label (some note)" */
export function parseLink(str: string): Link {
  const m = str.trim().match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  if (!m) return { label: str.trim(), href: '' };
  const target = m[2].trim();
  return /^[/#]/.test(target)
    ? { label: m[1].trim(), href: target }
    : { label: m[1].trim(), href: '', note: target };
}

function parseItem(text: string, n?: string): Item {
  const [main, linkStr] = text.split(/\s+→\s+/);
  const [rawTitle, ...rest] = main.split(' | ');
  const idMatch = rawTitle.match(/\(id:\s*([a-z0-9-]+)\)/);
  const item: Item = {
    n,
    title: rawTitle.replace(/\s*\(id:[^)]*\)/, '').trim(),
    body: rest.join(' | ').trim(),
    id: idMatch?.[1],
  };
  if (linkStr) {
    const l = linkStr.trim();
    item.link = /^[/#]\S*$/.test(l) ? { label: '', href: l } : parseLink(l);
  }
  return item;
}

function parse(source: string): Record<string, Section> {
  const body = source.replace(/^---[\s\S]*?\n---\n/, '');
  const sections: Record<string, Section> = {};
  let current: Section | undefined;
  let openList: string | undefined;

  for (const rawLine of body.split(/\r?\n/)) {
    const line = fill(rawLine.trim());
    if (!line) continue;

    const head = line.match(/^#\s+(.+?)(?:\s*\(id:\s*([a-z0-9-]+)\))?\s*$/);
    if (head) {
      current = { name: head[1].trim(), id: head[2], fields: {}, notes: {}, lists: {}, lines: [] };
      sections[current.name.toLowerCase()] = current;
      openList = undefined;
      continue;
    }
    if (!current) continue;

    const item = line.match(/^(?:-|(\d+)\.)\s+(.*)$/);
    if (item && openList) {
      current.lists[openList].push(parseItem(item[2], item[1]));
      continue;
    }

    const field = line.match(/^([A-Z][\w &]*?)(?:\s*\(([^)]*)\))?:\s*(.*)$/);
    if (field) {
      const key = field[1].trim().toLowerCase();
      if (field[2]) current.notes[key] = field[2].trim();
      if (field[3]) {
        current.fields[key] = field[3].trim();
        openList = undefined;
      } else {
        current.lists[key] = [];
        openList = key;
      }
      continue;
    }
    openList = undefined;
    current.lines.push(line);
  }
  return sections;
}

const sections = parse(raw);

export function section(name: string): Section {
  const s = sections[name.toLowerCase()];
  if (!s) throw new Error(`home.md: missing section "# ${name}"`);
  return s;
}

export function field(s: Section, key: string): string {
  const v = s.fields[key.toLowerCase()];
  if (!v) throw new Error(`home.md: section "${s.name}" is missing "${key}:"`);
  return v;
}

export function list(s: Section, key: string): Item[] {
  const v = s.lists[key.toLowerCase()];
  if (!v?.length) throw new Error(`home.md: section "${s.name}" is missing the "${key}" list`);
  return v;
}

export const split = (v: string) => v.split(/\s+·\s+/).map((x) => x.trim()).filter(Boolean);
export const links = (v: string) => split(v).map(parseLink);

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** HTML for a heading: *marked* words become <em> (the mockup's italic accent). */
export const emph = (s: string) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
export const plain = (s: string) => s.replace(/\*/g, '');

/** Where the site's standing links point. Labels come from home.md; a label with no entry fails the build. */
const HREFS: Record<string, string> = {
  Quartz: '/quartz-countertops/',
  Granite: '/granite-countertops/',
  'Quartzite & Marble': '/quartzite-marble-countertops/',
  'Kitchen Countertops': '/kitchen-countertops/',
  'Bathroom Countertops & Vanities': '/bathroom-countertops-vanities/',
  'Utah County': '/countertops-utah-county/',
  'Salt Lake City & County': '/countertops-salt-lake-city/',
  'Park City & Heber Valley': '/countertops-park-city-heber/',
  Blog: '/blog/',
  'Privacy Policy': '/privacy-policy/',
};

export function hrefFor(label: string): string {
  const h = HREFS[label];
  if (!h) throw new Error(`home.md: no URL is mapped for the link label "${label}" (see HREFS in src/lib/home.ts)`);
  return h;
}
