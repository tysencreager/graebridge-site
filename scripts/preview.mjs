// Local preview of dist/ that behaves like the SiteGround Apache host:
// the 301 rules from public/.htaccess, trailing-slash 301s for directories, and the custom 404 page.
// (`astro preview` serves a static build but cannot answer with real 301s.)
// Usage: npm run preview [-- --port 4321]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const portArg = process.argv.indexOf('--port');
const port = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 4321);
if (!fs.existsSync(root)) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(1);
}

const rules = fs
  .readFileSync(path.join(root, '.htaccess'), 'utf8')
  .split(/\r?\n/)
  .map((l) => l.match(/^RedirectMatch 301 (\(\?i\))?(\S+) (\S+)$/))
  .filter(Boolean)
  .map(([, ci, pattern, to]) => ({ re: new RegExp(pattern, ci ? 'i' : ''), to }));

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

const send = (res, status, file) => {
  const ext = path.extname(file);
  const immutable = /[\\/](_astro|fonts)[\\/]/.test(file);
  res.writeHead(status, {
    'Content-Type': types[ext] ?? 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
  });
  fs.createReadStream(file).pipe(res);
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { pathname = url.pathname; }

    const rule = rules.find((r) => r.re.test(pathname));
    if (rule) {
      res.writeHead(301, { Location: rule.to });
      return res.end();
    }

    const file = path.join(root, pathname);
    if (!file.startsWith(root) || path.basename(file).startsWith('.ht')) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    const stat = fs.existsSync(file) ? fs.statSync(file) : null;
    if (stat?.isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: `${pathname}/${url.search}` }); // Apache DirectorySlash
        return res.end();
      }
      const index = path.join(file, 'index.html');
      if (fs.existsSync(index)) return send(res, 200, index);
    } else if (stat?.isFile()) {
      return send(res, 200, file);
    }
    const notFound = path.join(root, '404.html');
    if (fs.existsSync(notFound)) return send(res, 404, notFound);
    res.writeHead(404);
    res.end('Not found');
  })
  .listen(port, () => console.log(`Preview with Apache-style redirects: http://localhost:${port}/`));
