// Writes real HTML for every public route into dist/, so a crawler that never
// presses the entry button still reads the page. The app is rendered once per
// route in headless Chrome (with ?prerender=1, which skips the entry gate and
// the analytics beacon) and the result is inserted under the entry screen.
// React replaces it on mount, so visitors see no difference.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://mdmosfikurrahman.github.io';

const NAME = 'Md. Mosfikur Rahman';
const ROUTES = [
  {
    route: '/',
    title: `${NAME} (Mosfik) | Backend Engineer and Researcher, Dhaka`,
    description: `${NAME} (Mosfik) is a backend engineer and team lead in Dhaka, and an applied machine learning researcher with ten peer-reviewed papers.`,
  },
  {
    route: '/work/',
    title: `Work | ${NAME}`,
    description: `Backend systems built and led by ${NAME}, including a multi-tenant travel booking platform.`,
  },
  {
    route: '/work/travilo/',
    title: `Travilo travel platform | ${NAME}`,
    description: `Case study of Travilo, a multi-tenant travel booking platform architected and led by ${NAME}.`,
  },
  {
    route: '/experience/',
    title: `Experience | ${NAME}`,
    description: `Career of ${NAME}: backend engineering at BJIT Group, REVE Systems and Akij iBOS.`,
  },
  {
    route: '/publications/',
    title: `Publications and research | ${NAME}`,
    description: `Ten peer-reviewed papers, an IEEE Best Paper Award and journal peer review by ${NAME}, in applied machine learning.`,
  },
  {
    route: '/about/',
    title: `About | ${NAME}`,
    description: `About ${NAME} (Mosfik): backend engineer and applied machine learning researcher based in Dhaka, Bangladesh.`,
  },
  {
    route: '/hire/',
    title: `Work with me | ${NAME}`,
    description: `Work with ${NAME}: backend architecture and engineering for travel and distributed systems.`,
  },
];

const CHROME = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && fs.existsSync(p));

if (!CHROME) {
  console.error('prerender: no Chrome or Edge found. Set CHROME_PATH to a browser binary.');
  process.exit(1);
}

const TAG = (name) => new RegExp(`<(/?)${name}\\b(?:"[^"]*"|'[^']*'|[^>"'])*>`, 'g');

// Returns [innerStart, innerEnd) of the first <div id="root"> in html.
function rootRange(html) {
  const opening = html.match(/<div id="root"[^>]*>/);
  if (!opening) throw new Error('prerender: no <div id="root">');
  const innerStart = opening.index + opening[0].length;
  const re = TAG('div');
  re.lastIndex = innerStart;
  let depth = 1;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].endsWith('/>')) continue;
    depth += m[1] ? -1 : 1;
    if (depth === 0) return [innerStart, m.index];
  }
  throw new Error('prerender: unbalanced <div id="root">');
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp',
};

function serve(dir) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let file = path.join(dir, decodeURIComponent(url.pathname));
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(dir, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function withMeta(html, { route, title, description }) {
  const url = SITE + route;
  const set = (re, to) => {
    if (!re.test(html)) throw new Error(`prerender: template lacks ${re}`);
    html = html.replace(re, () => to);
  };
  set(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  set(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`);
  set(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  set(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${url}"/>`);
  set(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${esc(title)}"/>`);
  set(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${esc(description)}"/>`);
  set(/<meta name="twitter:url" content="[^"]*"\/>/, `<meta name="twitter:url" content="${url}"/>`);
  set(/<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${esc(title)}"/>`);
  set(/<meta name="twitter:description" content="[^"]*"\/>/, `<meta name="twitter:description" content="${esc(description)}"/>`);
  return html;
}

// Minimal Chrome DevTools Protocol client over Node's built-in WebSocket.
function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const handlers = [];
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { ok, fail } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? fail(new Error(msg.error.message)) : ok(msg.result);
      } else if (msg.method) {
        handlers.forEach((h) => h(msg));
      }
    };
    ws.onerror = reject;
    ws.onopen = () =>
      resolve({
        send: (method, params = {}) =>
          new Promise((ok, fail) => {
            const n = ++id;
            pending.set(n, { ok, fail });
            ws.send(JSON.stringify({ id: n, method, params }));
          }),
        on: (h) => handlers.push(h),
        close: () => ws.close(),
      });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launchChrome(profileDir) {
  const proc = spawn(
    CHROME,
    ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1280,900', '--remote-debugging-port=0',
      `--user-data-dir=${profileDir}`, '--no-first-run', '--disable-background-networking', 'about:blank'],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  const port = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('prerender: Chrome did not start')), 30000);
    let buf = '';
    proc.stderr.on('data', (d) => {
      buf += d;
      const m = buf.match(/ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    proc.on('exit', () => reject(new Error('prerender: Chrome exited early')));
  });
  return { proc, port };
}

async function renderRoute(chromePort, siteOrigin, route) {
  const created = await fetch(`http://127.0.0.1:${chromePort}/json/new?about:blank`, { method: 'PUT' }).then((r) => r.json());
  const page = await connect(created.webSocketDebuggerUrl);
  try {
    // Only the local server may answer: no analytics write, no remote settings, no fonts.
    page.on((msg) => {
      if (msg.method !== 'Fetch.requestPaused') return;
      const { requestId, request } = msg.params;
      const local = request.url.startsWith(siteOrigin) || request.url.startsWith('data:');
      page.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId } : { requestId, errorReason: 'BlockedByClient' });
    });
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    await page.send('Page.navigate', { url: `${siteOrigin}${route}?prerender=1` });

    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      const { result } = await page.send('Runtime.evaluate', {
        expression: "(() => { const r = document.getElementById('root'); return r && r.querySelector('h1') ? r.innerHTML.length : 0; })()",
        returnByValue: true,
      });
      if (result.value > 4000) break;
      await sleep(400);
    }
    await sleep(1500);
    const { result } = await page.send('Runtime.evaluate', {
      expression: "document.getElementById('root').innerHTML",
      returnByValue: true,
    });
    return result.value;
  } finally {
    page.close();
    await fetch(`http://127.0.0.1:${chromePort}/json/close/${created.id}`).catch(() => {});
  }
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prerender-'));
const server = await serve(DIST);
const siteOrigin = `http://127.0.0.1:${server.address().port}`;
const chrome = await launchChrome(profileDir);

try {
  for (const entry of ROUTES) {
    const app = await renderRoute(chrome.port, siteOrigin, entry.route);
    if (!app.includes('<h1') || app.length < 4000) {
      throw new Error(`prerender: ${entry.route} rendered ${app.length} bytes without an <h1>`);
    }

    let page = withMeta(template, entry);
    const [, end] = rootRange(page);
    page = page.slice(0, end) + `<div id="prerendered">${app}</div>` + page.slice(end);

    const out = entry.route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, entry.route, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, page);
    console.log(`prerendered ${entry.route.padEnd(18)} ${(app.length / 1024).toFixed(0)} KB of markup`);
  }
} finally {
  server.close();
  chrome.proc.kill();
  await sleep(500);
  fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}

const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.map(({ route }) => `  <url><loc>${SITE}${route}</loc><lastmod>${today}</lastmod></url>`).join('\n');
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log('wrote sitemap.xml');
