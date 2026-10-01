/**
 * COSTA RICA UNIDOS — Service Worker de Resiliencia Offline PWA
 * Módulo de Seguridad Ciudadana y Modo Sin Conexión
 */

const CACHE_NAME = 'cr-unidos-pwa-v2.1';
const OFFLINE_URL = '/index.html';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

// 1. Instalación: Precaché de activos indispensables
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Precaché inicial completado parcialmente:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activación: Limpieza de versiones obsoletas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Intercepción Fetch: Navegación SPA con fallback a index.html y caché segura
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Solo interceptar peticiones GET
  if (request.method !== 'GET') {
    return;
  }

  // Peticiones de Navegación SPA (React Router: /, /seguridad-emergencias, /mapa-gis, etc.)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html').then((cached) => {
          return cached || caches.match('/');
        });
      })
    );
    return;
  }

  // No interceptar endpoints dinámicos de API ni peticiones de desarrollo Vite
  if (
    request.url.includes('/api/') ||
    request.url.includes('/usuarios') ||
    request.url.includes('/foro_posts') ||
    request.url.includes('/@vite/') ||
    request.url.includes('/src/') ||
    request.url.includes('?t=') ||
    request.url.includes('/@fs/') ||
    request.url.includes('/node_modules/')
  ) {
    return;
  }

  // Recursos estáticos y activos
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        // Almacenar en caché respuestas válidas de nuestro mismo origen
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic' &&
          request.url.startsWith(self.location.origin)
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Retornar fallback seguro o vacío si la red falla en recursos estáticos
        return caches.match(request);
      });
    })
  );
});
