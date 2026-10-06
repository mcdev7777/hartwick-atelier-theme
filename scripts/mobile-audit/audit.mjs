// node scripts/mobile-audit/audit.mjs  (BASE=http://127.0.0.1:9292, OUT, SHOTS)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:9292';
const OUT = process.env.OUT || '/tmp/hartwick-mobile-audit.json';
const SHOTS = process.env.SHOTS || '';
const WIDTHS = (process.env.WIDTHS || '375,320').split(',').map(Number);
const PAGES = JSON.parse(fs.readFileSync(new URL('../type-audit/pages.json', import.meta.url), 'utf8')).filter(p => p !== 'PREDICTIVE');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=9334', '--no-first-run', '--user-data-dir=/tmp/hartwick-mobile-audit-chrome', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) { await sleep(300); try { wsUrl = (await (await fetch('http://127.0.0.1:9334/json')).json()).find(x => x.type === 'page')?.webSocketDebuggerUrl; } catch {} }
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else if (d.method) events.push(d); };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
async function go(url) { events.length = 0; await send('Page.navigate', { url }); for (let i = 0; i < 100; i++) { await sleep(200); if (events.some(e => e.method === 'Page.loadEventFired')) break; } await sleep(1200); }
const evalJs = async e => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const AUDIT = fs.readFileSync(new URL('./audit-page.js', import.meta.url), 'utf8');
const results = [];
for (const w of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 812, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  for (const p of PAGES) {
    if (p === '/cart') await evalJs(`(async()=>{const v=(await (await fetch('/products/amman-shirt-handspun-silk-and-linen.js')).json()).variants.find(x=>x.available)||{};await fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[{id:v.id,quantity:1}]})});})()`);
    await go(BASE + p);
    await evalJs(`document.getElementById('shopify-pc__banner')?.remove()`);
    await evalJs(`(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)})()`);
    await sleep(400);
    const r = await evalJs(AUDIT);
    results.push({ page: p, w, ...r });
    if (SHOTS && w === 375) {
      const h = await evalJs('document.documentElement.scrollHeight');
      const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 55, captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: Math.min(h, 14000), scale: 0.5 } });
      fs.writeFileSync(`${SHOTS}/${p.replace(/[^a-z0-9]+/gi, '_')}.jpg`, Buffer.from(s.result.data, 'base64'));
    }
    process.stderr.write(`${w} ${p} doc ${r?.docScroll}/${r?.W} over ${r?.overflow?.length} scr ${r?.scrollers?.length} clip ${r?.clippedText?.length}\n`);
  }
}
fs.writeFileSync(OUT, JSON.stringify(results, null, 1)); ws.close(); chrome.kill();
