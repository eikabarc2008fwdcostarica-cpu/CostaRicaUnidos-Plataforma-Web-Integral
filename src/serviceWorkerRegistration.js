/**
 * COSTA RICA UNIDOS — Registro del Service Worker PWA
 * Activa la resiliencia offline para emergencias y SOS
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registrado exitosamente con alcance:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] No se pudo registrar el Service Worker:', error);
        });
    });
  }
}
