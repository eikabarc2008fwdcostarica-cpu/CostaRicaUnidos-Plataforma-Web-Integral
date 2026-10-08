const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = path.join(os.tmpdir(), 'chrome_cdp_audit_' + Date.now());

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 0;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  fs.mkdirSync(TEMP_PROFILE, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${TEMP_PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank'
  ], { detached: true, stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://localhost:9222/json/version');
      if (res.ok) break;
    } catch (e) {}
  }

  // Obtener la página inicial de about:blank
  const listRes = await fetch('http://localhost:9222/json/list');
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page');

  const client = new CDPClient(page.webSocketDebuggerUrl);
  await client.connect();
  console.log('WebSocket CDP conectado!');

  await client.send('Page.enable');
  await client.send('DOM.enable');

  // Redimensionar a 320x568
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log('Navegando a http://localhost:5173...');
  await client.send('Page.navigate', { url: 'http://localhost:5173' });

  // Esperar a que la página cargue
  await new Promise(r => setTimeout(r, 2000));

  const evalRes = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const scrollWidth = document.scrollingElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const hasHorizontalScroll = scrollWidth > innerWidth;
      
      // Buscar elementos que se desborden a la derecha
      const overflowingElements = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > innerWidth + 1 && rect.width > 0 && rect.height > 0) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      });

      return {
        innerWidth,
        scrollWidth,
        hasHorizontalScroll,
        overflowCount: overflowingElements.length,
        overflowingElements: overflowingElements.slice(0, 10)
      };
    })()`,
    returnByValue: true
  });

  console.log('Diagnóstico 320x568 en Home:', JSON.stringify(evalRes.result.value, null, 2));

  client.close();
  chromeProc.kill();
}

run().catch(console.error);
