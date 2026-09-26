/**
 * COSTA RICA UNIDOS — Servicio de Sincronización y Cola de Resiliencia Offline
 * Módulo 10: Seguridad Ciudadana y Gestión del Riesgo
 * Permite almacenar reportes e incidencias creados sin conexión celular y transmitirlos
 * automáticamente al restablecerse la red.
 */

const OFFLINE_QUEUE_KEY = 'cr_offline_emergency_queue';

/**
 * Guarda un reporte en la cola offline local
 */
export function enqueueOfflineReport(reportData) {
  try {
    const queue = getOfflineQueue();
    const item = {
      ...reportData,
      queuedAt: new Date().toISOString(),
      offlinePending: true
    };
    const updated = [item, ...queue];
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
    return item;
  } catch (e) {
    console.warn('[OfflineSync] Error al encolar reporte offline:', e);
    return null;
  }
}

/**
 * Obtiene todos los reportes pendientes en la cola offline
 */
export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[OfflineSync] Error al leer cola offline:', e);
    return [];
  }
}

/**
 * Elimina un reporte de la cola tras sincronizarse con éxito
 */
export function dequeueOfflineReport(reportId) {
  try {
    const queue = getOfflineQueue();
    const filtered = queue.filter((item) => item.reportId !== reportId);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('[OfflineSync] Error al desencolar reporte:', e);
  }
}

/**
 * Sincroniza todos los reportes encolados al recuperar conectividad
 */
export async function syncOfflineQueue(onReportSynced) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { count: 0 };

  console.log(`[OfflineSync] Iniciando sincronización de ${queue.length} reporte(s) encolado(s)...`);

  let syncedCount = 0;
  for (const item of queue) {
    try {
      // Simulación de transmisión segura hacia la API central de Costa Rica Unidos
      await new Promise((resolve) => setTimeout(resolve, 400));
      dequeueOfflineReport(item.reportId);
      syncedCount++;
      if (onReportSynced) onReportSynced(item);
    } catch (err) {
      console.warn(`[OfflineSync] Falló sincronización de ${item.reportId}:`, err);
    }
  }

  return { count: syncedCount };
}

/**
 * Suscriptor a eventos de red (online / offline)
 */
export function subscribeNetworkStatus(onStatusChange) {
  const handleOnline = () => onStatusChange(true);
  const handleOffline = () => onStatusChange(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Estado inicial
  onStatusChange(navigator.onLine);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
