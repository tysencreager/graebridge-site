// After a normal build, puts the interim landing page at the site root (used only if the domain transfer slips).
import fs from 'node:fs';
const from = 'dist/interim/index.html';
if (!fs.existsSync(from)) throw new Error('dist/interim/index.html not found. Run "npm run build" first.');
fs.copyFileSync('dist/index.html', 'dist/home-full.html.bak');
fs.copyFileSync(from, 'dist/index.html');
console.log('interim: dist/index.html is now the interim page (the full home page is saved as dist/home-full.html.bak; do not upload it).');
