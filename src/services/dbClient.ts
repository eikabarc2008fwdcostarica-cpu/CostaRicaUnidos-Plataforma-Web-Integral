/**
 * ============================================================================
 * COSTA RICA UNIDOS — MOTOR CLIENTE DE PERSISTENCIA Y OPERACIONES CRUD (dbClient)
 * Única fuente de verdad: src/data/db.json sincronizado con localStorage.
 * Todas las operaciones de lectura, inserción, actualización y borrado de la
 * plataforma se gestionan a través de este cliente desacoplado.
 * ============================================================================
 */

import masterSeedData from '../data/db.json';
import {
  MasterDbSchema,
  Usuario,
  SolicitudComercio,
  IncidenciaVial,
  AlbergueCNE,
  ProyectoPresupuesto,
  VotoEmitido,
  BitacoraAuditoria,
  ConfiguracionIA,
  AlertasCNE,
  DB_STORAGE_KEY,
  DB_UPDATE_EVENT,
  ADMIN_UPDATE_EVENT
} from './crudService';

export type CollectionName =
  | 'usuarios'
  | 'solicitudesComercio'
  | 'incidenciasViales'
  | 'alberguesCNE'
  | 'proyectosPresupuesto'
  | 'votosEmitidos'
  | 'bitacoraAuditoria'
  | 'sesionesActivas'
  | 'bitacoraAccesos'
  | 'moderacionContenido'
  | 'ticketsAverias';

export type ConfigName = 'configuracionIA' | 'alertasCNE';

/**
 * Normaliza y garantiza que todas las colecciones maestras existan como arrays u objetos válidos.
 */
function sanitizeDatabase(data: any): MasterDbSchema {
  const seed = masterSeedData as unknown as MasterDbSchema;
  const result: any = { ...seed, ...(data || {}) };

  result.usuarios = Array.isArray(data?.usuarios) ? data.usuarios : [...seed.usuarios];
  result.solicitudesComercio = Array.isArray(data?.solicitudesComercio) ? data.solicitudesComercio : [...seed.solicitudesComercio];
  const seedIncidenciasMap = new Map((seed.incidenciasViales || []).map((t: any) => [t.id, t]));
  result.incidenciasViales = (Array.isArray(data?.incidenciasViales) ? data.incidenciasViales : [...seed.incidenciasViales]).map((item: any) => {
    const seedItem = seedIncidenciasMap.get(item.id);
    if (seedItem) {
      return {
        ...item,
        fotoUrl: seedItem.fotoUrl,
        imagenUrl: seedItem.imagenUrl
      };
    }
    return item;
  });
  result.alberguesCNE = Array.isArray(data?.alberguesCNE) ? data.alberguesCNE : [...seed.alberguesCNE];
  result.proyectosPresupuesto = Array.isArray(data?.proyectosPresupuesto) ? data.proyectosPresupuesto : [...seed.proyectosPresupuesto];
  result.votosEmitidos = Array.isArray(data?.votosEmitidos) ? data.votosEmitidos : [];
  result.bitacoraAuditoria = Array.isArray(data?.bitacoraAuditoria) ? data.bitacoraAuditoria : [...seed.bitacoraAuditoria];
  result.configuracionIA = data?.configuracionIA ? { ...seed.configuracionIA, ...data.configuracionIA } : { ...seed.configuracionIA };
  result.alertasCNE = data?.alertasCNE ? { ...seed.alertasCNE, ...data.alertasCNE } : { ...seed.alertasCNE };

  // Compatibilidad cruzada con ticketsAverias y alertasCNE.albergues
  result.ticketsAverias = [...result.incidenciasViales];

  return result as MasterDbSchema;
}

/**
 * Lee la base de datos completa de localStorage. Si no existe o está corrupta, inicializa con db.json.
 */
export function getDb(): MasterDbSchema {
  const seed = masterSeedData as unknown as MasterDbSchema;

  if (typeof window === 'undefined') {
    return sanitizeDatabase(seed);
  }

  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      const sanitized = sanitizeDatabase(seed);
      saveDb(sanitized);
      return sanitized;
    }
    const parsed = JSON.parse(raw);
    return sanitizeDatabase(parsed);
  } catch (error) {
    console.error('[dbClient] Error leyendo base de datos en localStorage, restaurando a seed:', error);
    const sanitized = sanitizeDatabase(seed);
    saveDb(sanitized);
    return sanitized;
  }
}

/**
 * Persiste el estado completo en localStorage y despacha eventos de reactividad global.
 */
export function saveDb(db: MasterDbSchema): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: db }));
    window.dispatchEvent(new CustomEvent(ADMIN_UPDATE_EVENT, { detail: db }));
  } catch (error) {
    console.error('[dbClient] Error crítico guardando en localStorage:', error);
  }
}

/**
 * Genera un identificador representativo para nuevas entidades creadas dinámicamente.
 */
function generarIdEntidad(collectionName: string): string {
  const anio = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  switch (collectionName) {
    case 'incidenciasViales':
    case 'ticketsAverias':
      return `EXP-MUNI-${anio}-${rand}`;
    case 'solicitudesComercio':
      return `SOL-COM-${rand}`;
    case 'alberguesCNE':
      return `ALB-${rand}`;
    case 'proyectosPresupuesto':
      return `PROY-${rand}`;
    case 'votosEmitidos':
      return `VOT-${anio}-${rand}`;
    case 'bitacoraAuditoria':
      return `AUD-${anio}-${rand}`;
    default:
      return `CRU-${Date.now()}-${rand}`;
  }
}

// ============================================================================
// OPERACIONES DEL CLIENTE CRUD (dbClient)
// ============================================================================

/**
 * Obtiene la lista completa de elementos de una colección.
 * Retorna una copia defensiva para evitar mutaciones externas no controladas.
 */
export function getCollection<T = any>(collectionName: CollectionName): T[] {
  const db = getDb();
  const collection = (db as any)[collectionName];
  if (!Array.isArray(collection)) {
    return [];
  }
  return JSON.parse(JSON.stringify(collection)) as T[];
}

/**
 * Inserta un nuevo elemento en la colección especificada.
 * Si no incluye 'id', genera automáticamente un identificador formal.
 */
export function insert<T = any>(collectionName: CollectionName, item: Partial<T> & Record<string, any>): T {
  const db = getDb();
  let collection = (db as any)[collectionName];

  if (!Array.isArray(collection)) {
    collection = [];
    (db as any)[collectionName] = collection;
  }

  const nuevoId = item.id || item.reportId || generarIdEntidad(collectionName);
  const nuevoElemento: any = {
    ...item,
    id: nuevoId
  };

  // Si es incidencia vial o ticket, asegurar compatibilidad con reportId
  if (collectionName === 'incidenciasViales' || collectionName === 'ticketsAverias') {
    if (!nuevoElemento.reportId) {
      nuevoElemento.reportId = nuevoId;
    }
  }

  // Las bitácoras se insertan al inicio; el resto se inserta al final
  if (collectionName === 'bitacoraAuditoria') {
    collection.unshift(nuevoElemento);
  } else {
    collection.push(nuevoElemento);
  }

  // Sincronizar colecciones espejo (incidenciasViales <-> ticketsAverias)
  if (collectionName === 'incidenciasViales') {
    db.ticketsAverias = [...db.incidenciasViales];
  } else if (collectionName === 'ticketsAverias') {
    db.incidenciasViales = [...(db.ticketsAverias as any[])];
  }

  saveDb(db);
  return nuevoElemento as T;
}

/**
 * Actualiza un elemento existente por su identificador.
 */
export function update<T = any>(
  collectionName: CollectionName,
  id: string,
  updates: Partial<T> & Record<string, any>
): T {
  const db = getDb();
  const collection = (db as any)[collectionName];

  if (!Array.isArray(collection)) {
    throw new Error(`[dbClient] La colección "${collectionName}" no es válida.`);
  }

  const index = collection.findIndex(
    (item: any) =>
      item.id === id ||
      item.reportId === id ||
      item.adminId === id ||
      item.cedula === id ||
      item.cedulaJuridica === id
  );

  if (index === -1) {
    throw new Error(`[dbClient] Elemento con ID "${id}" no encontrado en colección "${collectionName}".`);
  }

  const elementoActualizado = {
    ...collection[index],
    ...updates
  };

  collection[index] = elementoActualizado;

  // Sincronizaciones bidireccionales automáticas
  if (collectionName === 'alberguesCNE' && db.alertasCNE && Array.isArray(db.alertasCNE.albergues)) {
    const albIndex = db.alertasCNE.albergues.findIndex((a: any) => a.id === id);
    if (albIndex !== -1) {
      db.alertasCNE.albergues[albIndex] = {
        ...db.alertasCNE.albergues[albIndex],
        ...updates
      };
    }
  }

  if (collectionName === 'incidenciasViales') {
    db.ticketsAverias = [...db.incidenciasViales];
  } else if (collectionName === 'ticketsAverias') {
    db.incidenciasViales = [...(db.ticketsAverias as any[])];
  }

  saveDb(db);
  return elementoActualizado as T;
}

/**
 * Elimina un elemento de una colección por su identificador.
 */
export function deleteItem(collectionName: CollectionName, id: string): boolean {
  const db = getDb();
  const collection = (db as any)[collectionName];

  if (!Array.isArray(collection)) {
    return false;
  }

  const longitudInicial = collection.length;
  const filtrados = collection.filter(
    (item: any) =>
      item.id !== id &&
      item.reportId !== id &&
      item.adminId !== id &&
      item.cedula !== id
  );

  if (filtrados.length === longitudInicial) {
    return false;
  }

  (db as any)[collectionName] = filtrados;

  if (collectionName === 'incidenciasViales') {
    db.ticketsAverias = [...filtrados];
  }

  saveDb(db);
  return true;
}

/**
 * Obtiene un elemento por su identificador.
 */
export function getById<T = any>(collectionName: CollectionName, id: string): T | undefined {
  const collection = getCollection<any>(collectionName);
  return collection.find(
    (item: any) =>
      item.id === id ||
      item.reportId === id ||
      item.adminId === id ||
      item.cedula === id ||
      item.cedulaJuridica === id
  ) as T | undefined;
}

/**
 * Obtiene un bloque de configuración del sistema (configuracionIA o alertasCNE).
 */
export function getConfig<K extends ConfigName>(configName: K): MasterDbSchema[K] {
  const db = getDb();
  return JSON.parse(JSON.stringify(db[configName]));
}

/**
 * Actualiza un bloque de configuración del sistema (configuracionIA o alertasCNE).
 */
export function updateConfig<K extends ConfigName>(
  configName: K,
  updates: Partial<MasterDbSchema[K]>
): MasterDbSchema[K] {
  const db = getDb();
  const configActual = db[configName] || {};
  const configActualizada: any = {
    ...configActual,
    ...updates,
    fechaActualizacion: (updates as any).fechaActualizacion || new Date().toISOString()
  };

  db[configName] = configActualizada;
  saveDb(db);
  return JSON.parse(JSON.stringify(configActualizada));
}

/**
 * Exporta toda la base de datos como una cadena JSON formateada para respaldo.
 */
export function exportJSON(): string {
  const db = getDb();
  return JSON.stringify(db, null, 2);
}

/**
 * Restaura toda la base de datos a los valores semilla de src/data/db.json.
 */
export function resetToSeed(): MasterDbSchema {
  const seed = masterSeedData as unknown as MasterDbSchema;
  const sanitized = sanitizeDatabase(seed);
  saveDb(sanitized);
  return sanitized;
}

/**
 * Suscribe un callback a cambios reactivos de la base de datos.
 * Retorna la función de limpieza (unsubscribe).
 */
export function subscribe(callback: (db: MasterDbSchema) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (e: Event) => {
    const custom = e as CustomEvent<MasterDbSchema>;
    callback(custom.detail || getDb());
  };

  window.addEventListener(DB_UPDATE_EVENT, handler);
  window.addEventListener(ADMIN_UPDATE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(DB_UPDATE_EVENT, handler);
    window.removeEventListener(ADMIN_UPDATE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

// Objeto singleton maestro dbClient
export const dbClient = {
  getDb,
  saveDb,
  getCollection,
  insert,
  update,
  delete: deleteItem,
  getById,
  getConfig,
  updateConfig,
  exportJSON,
  resetToSeed,
  subscribe
};

export default dbClient;
