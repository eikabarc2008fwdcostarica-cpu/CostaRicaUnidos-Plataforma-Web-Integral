const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = path.join(os.tmpdir(), 'chrome_cdp_audit_' + Date.now());
const BASE_URL = process.env.VITE_URL || 'http://localhost:5173';

const VIEWPORTS = [
  { name: '320x568 (iPhone SE)', width: 320, height: 568, isMobile: true },
  { name: '360x640 (Android)', width: 360, height: 640, isMobile: true },
  { name: '390x844 (iPhone 12/13)', width: 390, height: 844, isMobile: true },
  { name: '844x390 (iPhone Landscape)', width: 844, height: 390, isMobile: true },
  { name: '430x932 (iPhone Pro Max)', width: 430, height: 932, isMobile: true },
  { name: '768x1024 (Tablet)', width: 768, height: 1024, isMobile: false },
  { name: '1280x800 (Desktop)', width: 1280, height: 800, isMobile: false }
];

const MOCK_USERS = {
  CIUDADANO: {
    id: "USR-CIUD-001",
    cedula: "1-1823-0456",
    nombre: "Eiker Manuel Abarca Murillo",
    correo: "eiker.abarca@gmail.com",
    email: "eiker.abarca@gmail.com",
    rol: "Ciudadano Residente",
    rolOficial: "CIUDADANO",
    nivelAcceso: 2,
    provincia: "San José",
    provinciaId: "1",
    provinciaNombre: "San José",
    canton: "San José",
    token: "test-token-ciudadano"
  },
  COMERCIANTE: {
    id: "USR-COM-001",
    cedula: "1-1456-0789",
    nombre: "Carlos Hernandez Rojas",
    correo: "comercio.sanjose@crviva.cr",
    email: "comercio.sanjose@crviva.cr",
    rol: "Comerciante y Emprendedor",
    rolOficial: "COMERCIANTE",
    nivelAcceso: 3,
    isComerciante: true,
    estadoComercio: "aprobado",
    provincia: "San José",
    provinciaId: "1",
    provinciaNombre: "San José",
    canton: "San José",
    token: "test-token-comerciante"
  },
  ENCARGADO_MUNICIPAL: {
    id: "USR-MUNI-001",
    cedula: "1-1155-0892",
    nombre: "Encargado Municipal de Heredia",
    correo: "encargado.heredia@heredia.go.cr",
    email: "encargado.heredia@heredia.go.cr",
    rol: "Encargado Municipal",
    rolOficial: "ENCARGADO_MUNICIPAL",
    nivelAcceso: 3,
    isEncargadoMunicipal: true,
    provincia: "Heredia",
    provinciaId: "4",
    provinciaNombre: "Heredia",
    canton: "Heredia",
    municipalidadId: "muni-heredia",
    token: "test-token-encargado"
  },
  GESTOR_TERRITORIAL: {
    id: "USR-TER-006",
    cedula: "6-0123-0456",
    nombre: "Coordinación Territorial Puntarenas",
    correo: "gobierno.territorial@gob.cr",
    email: "gobierno.territorial@gob.cr",
    rol: "Gestor Territorial y Municipal",
    rolOficial: "GESTOR_TERRITORIAL",
    nivelAcceso: 4,
    provincia: "Puntarenas",
    provinciaId: "6",
    provinciaNombre: "Puntarenas",
    canton: "Puntarenas",
    token: "test-token-gestor"
  },
  SUPER_ADMIN_NACIONAL: {
    id: "USR-NAC-001",
    cedula: "1-0000-0001",
    nombre: "Superintendencia Nacional de Gobierno Digital",
    correo: "admin.nacional@gob.cr",
    email: "admin.nacional@gob.cr",
    rol: "Super Administrador Nacional",
    rolOficial: "SUPER_ADMIN_NACIONAL",
    nivelAcceso: 5,
    provincia: "Nacional",
    provinciaId: "1",
    provinciaNombre: "Nacional",
    canton: "Todas las Municipalidades",
    token: "test-token-super"
  }
};

const SCREENS = [
  // 1. Públicas
  { name: 'Inicio (Home)', path: '/', role: null },
  { name: 'Login (Pestaña Ingreso)', path: '/login', role: null },
  { name: 'Noticias y Comunicados', path: '/noticias', role: null },
  { name: 'Foro Cívico Tico', path: '/foro', role: null },
  { name: 'Comercios y PyMES', path: '/comercio', role: null },
  { name: 'Mapa GIS Territorial', path: '/mapa-gis', role: null },
  { name: 'Reportar Incidencia', path: '/reportar-incidencia', role: null },
  { name: 'Seguridad y Emergencias SOS', path: '/seguridad-emergencias', role: null },
  { name: 'Gobernanza y Concejos', path: '/gobernanza', role: null },
  { name: 'Cultura y Tradición', path: '/cultura', role: null },
  { name: 'Deportes y Recreación', path: '/deportes', role: null },
  { name: 'Educación Cívica', path: '/educacion', role: null },
  { name: 'Feria del Agricultor', path: '/feria-agricultor', role: null },
  { name: 'Turismo Sostenible', path: '/turismo', role: null },
  { name: 'Participación Ciudadana', path: '/participacion', role: null },
  { name: 'Itinerario Turístico IA', path: '/itinerario-ia', role: null },
  { name: 'Acceso Denegado (403)', path: '/acceso-denegado', role: null },
  { name: 'Página No Encontrada (404)', path: '/404-no-existe', role: null },

  // 2. Por Rol
  { name: 'Portal Ciudadano', path: '/portal-ciudadano', role: 'CIUDADANO' },
  { name: 'Perfil de Usuario', path: '/perfil', role: 'CIUDADANO' },
  { name: 'Perfil Comercial PyME', path: '/perfil-comercial', role: 'COMERCIANTE' },
  { name: 'Mi Municipalidad', path: '/mi-municipalidad', role: 'ENCARGADO_MUNICIPAL' },
  { name: 'Consola Gestor Territorial', path: '/admin/territorial', role: 'GESTOR_TERRITORIAL' },
  { name: 'Consola Super Admin', path: '/admin/super', role: 'SUPER_ADMIN_NACIONAL' }
];

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

async function runAudit() {
  console.log('================================================================');
  console.log('SUITE DE AUDITORÍA RESPONSIVE Y MOBILE-FIRST (7 TAMAÑOS)');
  console.log('Costa Rica Unidos — Plataforma Cívica Soberana');
  console.log('================================================================\n');

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

  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://localhost:9222/json/version');
      if (res.ok) break;
    } catch (e) {}
  }

  const listRes = await fetch('http://localhost:9222/json/list');
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page');

  const client = new CDPClient(page.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');

  const auditReport = [];

  for (const screen of SCREENS) {
    console.log(`\n----------------------------------------------------------------`);
    console.log(`PANTALLA: ${screen.name} (${screen.path}) [Rol: ${screen.role || 'Público'}]`);
    console.log(`----------------------------------------------------------------`);

    const screenResult = {
      name: screen.name,
      path: screen.path,
      role: screen.role,
      sizes: {}
    };

    // Navegar primero a la base para inyectar sesión si es requerida
    await client.send('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise(r => setTimeout(r, 600));

    if (screen.role) {
      const userObj = MOCK_USERS[screen.role];
      const script = `
        localStorage.setItem("cru_user_session", ${JSON.stringify(JSON.stringify(userObj))});
        localStorage.setItem("cr_sesion_activa", ${JSON.stringify(JSON.stringify(userObj))});
        localStorage.removeItem("cr_sesion_cerrada");
      `;
      await client.send('Runtime.evaluate', { expression: script });
    } else {
      const script = `
        localStorage.removeItem("cru_user_session");
        localStorage.removeItem("cr_sesion_activa");
      `;
      await client.send('Runtime.evaluate', { expression: script });
    }

    // Probar cada viewport
    for (const vp of VIEWPORTS) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.isMobile
      });

      // Navegar a la ruta
      await client.send('Page.navigate', { url: `${BASE_URL}${screen.path}` });
      await new Promise(r => setTimeout(r, 1200));

      const evalMetrics = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const scrollWidth = document.scrollingElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const overflowDiff = scrollWidth - innerWidth;
          const hasHorizontalScroll = overflowDiff > 1;

          // Buscar elementos que desbordan sin estar contenidos legítimamente
          const overflowingElements = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > innerWidth + 1.5 && rect.width > 0 && rect.height > 0) {
              // Si el elemento está dentro de un ancestro que clipa o tiene scroll interno (ej. tablas, código, gráficos, carruseles), está contenido
              let isContained = false;
              let curr = el.parentElement;
              while (curr && curr !== document.documentElement && curr !== document.body) {
                const cs = window.getComputedStyle(curr);
                if (cs.overflowX === 'hidden' || cs.overflowX === 'clip' || cs.overflowX === 'auto' || cs.overflowX === 'scroll' ||
                    cs.overflow === 'hidden' || cs.overflow === 'clip' || cs.overflow === 'auto' || cs.overflow === 'scroll') {
                  isContained = true;
                  break;
                }
                curr = curr.parentElement;
              }
              if (!isContained) {
                overflowingElements.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id || '',
                  cls: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join(' ') : '',
                  right: Math.round(rect.right),
                  width: Math.round(rect.width)
                });
              }
            }
          });

          // Tap targets < 44x44
          let smallTapTargets = 0;
          const sampleSmallTargets = [];
          if (${vp.isMobile}) {
            document.querySelectorAll('button, a, [role="button"]').forEach(btn => {
              const r = btn.getBoundingClientRect();
              if (r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40)) {
                smallTapTargets++;
                if (sampleSmallTargets.length < 5) {
                  sampleSmallTargets.push({
                    tag: btn.tagName.toLowerCase(),
                    text: (btn.innerText || '').slice(0, 20).trim(),
                    w: Math.round(r.width),
                    h: Math.round(r.height),
                    cls: (btn.className && typeof btn.className === 'string') ? btn.className.split(' ').slice(0, 2).join(' ') : ''
                  });
                }
              }
            });
          }

          // Inputs font < 16px en móvil
          let inputsWithSmallFont = 0;
          if (${vp.isMobile}) {
            document.querySelectorAll('input, select, textarea').forEach(inp => {
              const fs = window.getComputedStyle(inp).fontSize;
              const px = parseFloat(fs);
              if (px < 15.5) {
                inputsWithSmallFont++;
              }
            });
          }

          return {
            scrollWidth,
            innerWidth,
            overflowDiff,
            hasHorizontalScroll,
            overflowingElements: overflowingElements.slice(0, 5),
            smallTapTargets,
            sampleSmallTargets,
            inputsWithSmallFont
          };
        })()`,
        returnByValue: true
      });

      const metrics = evalMetrics.result.value;
      const status = (!metrics.hasHorizontalScroll && metrics.inputsWithSmallFont === 0) ? '✅ PASS' : '❌ FAIL';

      screenResult.sizes[vp.name] = {
        status,
        ...metrics
      };

      const icon = status === '✅ PASS' ? '✅' : '❌';
      console.log(`  [${icon}] ${vp.name.padEnd(28)}: ScrollWidth: ${metrics.scrollWidth}px (Diff: ${metrics.overflowDiff}px) | SmallInputs: ${metrics.inputsWithSmallFont} | TapTargets<40px: ${metrics.smallTapTargets}`);
      if (metrics.overflowingElements && metrics.overflowingElements.length > 0) {
        console.log(`      Desbordes detectados:`, JSON.stringify(metrics.overflowingElements));
      }
      if (metrics.sampleSmallTargets && metrics.sampleSmallTargets.length > 0) {
        console.log(`      Ejemplos botones pequeños:`, JSON.stringify(metrics.sampleSmallTargets));
      }
    }

    auditReport.push(screenResult);
  }

  client.close();
  chromeProc.kill();

  fs.writeFileSync('scripts/audit-report.json', JSON.stringify(auditReport, null, 2));
  console.log('\n================================================================');
  console.log('AUDITORÍA COMPLETA FINALIZADA. Reporte guardado en scripts/audit-report.json');
  console.log('================================================================');
}

runAudit().catch(console.error);
