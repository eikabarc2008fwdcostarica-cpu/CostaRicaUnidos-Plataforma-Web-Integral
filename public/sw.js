/**
 * COSTA RICA UNIDOS — Service Worker de Resiliencia Offline PWA
 * Módulo 10: Seguridad Ciudadana, Gestión del Riesgo y Modo Emergencias
 * Estrategias de Caché:
 * - Cache-First para recursos estáticos indispensables (CSS, Fuentes, Iconografía SOS)
 * - Network-First con Fallback Inmediato a Caché para App Shell y Páginas
 * - Cola de sincronización en segundo plano para reportes offline
 */

const CACHE_NAME = 'cr-unidos-pwa-v1.1';
const OFFLINE_URL = '/';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/src/index.css',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/pages/SeguridadEmergencias.jsx',
  '/src/pages/Inicio.jsx'
];

// 1. Instalación: Precaché de activos vitales de emergencia
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precargando activos críticos de resiliencia');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Fallo parcial en precaché inicial:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Eliminando caché obsoleta:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Intercepción Fetch: Cache-First para estáticos y Network-First con fallback para páginas
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Excluir llamadas a Google Maps API u orígenes externos complejos de la caché estricta
  if (url.origin.includes('google') || url.origin.includes('gstatic') && !url.pathname.includes('fonts')) {
    return;
  }

  // A. Peticiones de Fuentes o Estilos (Cache-First)
  if (
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback silencioso si no hay red para imágenes
          return new Response('', { status: 408, statusText: 'Offline' });
        });
      })
    );
    return;
  }

  // B. Peticiones de Navegación HTML / App Shell (Network-First con Fallback Inmediato a Caché)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(async () => {
        // En caso de corte total de conexión celular o Wi-Fi, retornar la página precargada
        const cached = await caches.match(request);
        if (cached) return cached;
        const offlineAppShell = await caches.match(OFFLINE_URL);
        if (offlineAppShell) return offlineAppShell;
        return new Response('Modo Resiliencia Offline Activo - Costa Rica Unidos', {
          headers: { 'Content-Type': 'text/html' }
        });
      })
    );
    return;
  }

  // C. Resto de peticiones (Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Red no disponible
      });

      return cachedResponse || fetchPromise;
    })
  );
});
