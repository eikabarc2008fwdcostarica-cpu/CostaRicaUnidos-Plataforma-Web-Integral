/**
 * ============================================================================
 * COSTA RICA UNIDOS — MOTOR MAESTRO DE OPERACIONES CRUD (JSON PERSISTENCE ENGINE)
 * Única fuente de verdad: src/data/db.json sincronizado con localStorage
 * Sincronización reactiva síncrona ante todo evento de creación, edición o borrado.
 * ============================================================================
 */

import masterSeedData from '../data/seedData';

export const DB_STORAGE_KEY = 'cru_mock_db_v2';
export const DB_UPDATE_EVENT = 'cru_db_updated';
export const ADMIN_UPDATE_EVENT = 'cru_admin_updated';

// ----------------------------------------------------------------------------
// INTERFACES DEL MODELO DE DATOS MAESTRO
// ----------------------------------------------------------------------------

export interface Usuario {
  id: string;
  cedula: string;
  nombre: string;
  correo: string;
  password?: string;
  rol: string;
  nivelAcceso: number;
  provincia: string;
  canton: string;
  distrito?: string;
  fechaRegistro: string;
  verificadoHacienda: boolean;
}

export interface SolicitudComercio {
  id: string;
  cedulaJuridica: string;
  cedula?: string;
  nombreComercio: string;
  nombreNegocio?: string;
  nombreSolicitante?: string;
  actividadHacienda: string;
  actividadEconomicaHacienda?: string;
  canton: string;
  distrito?: string;
  provincia?: string;
  sectorFeriaSolicitado: string;
  sectorFeria?: string;
  fechaSolicitud: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | string;
  justificacion: string;
  notas?: string;
  verificadoHacienda?: boolean;
}

export interface IncidenciaVial {
  id: string;
  categoria: string;
  descripcion: string;
  titulo?: string;
  coordenadas: [number, number];
  provincia: string;
  canton: string;
  distrito: string;
  direccionExacta?: string;
  estado: 'EN_INSPECCION' | 'EN_PROCESO' | 'RESUELTO' | 'REPORTADO' | string;
  fechaRadicado: string;
  fechaReporte?: string;
  cuadrillaAsignada?: string;
  prioridad?: 'ALTA' | 'MEDIA' | 'BAJA' | string;
  reportadoPor?: string;
}

export interface AlbergueCNE {
  id: string;
  nombre: string;
  provincia: string;
  canton: string;
  capacidadMaxima: number;
  capacidadTotal?: number;
  ocupacionActual: number;
  estado: 'Habilitado' | 'Lleno al 100%' | 'Ocupación Alta' | 'En Reserva' | string;
  dotacionSanitaria: string;
  servicios?: string[];
  responsableContacto?: string;
}

export interface ProyectoPresupuesto {
  id: string;
  titulo: string;
  canton: string;
  distrito: string;
  montoEstimado: number;
  votosAcumulados: number;
  estado: 'EN_VOTACION' | 'APROBADO' | 'FINALIZADO' | string;
}

export interface VotoEmitido {
  id: string;
  proyectoId: string;
  usuarioCedula: string;
  fechaVoto: string;
  hashFirma?: string;
}

export interface BitacoraAuditoria {
  id: string;
  fecha: string;
  fechaHoraCst?: string;
  adminId: string;
  adminCedula?: string;
  adminNombre?: string;
  adminRol?: string;
  accion: string;
  entidadAfectada: string;
  justificacion: string;
  justificante?: string;
  ipOrigen?: string;
}

export interface ConfiguracionIA {
  killSwitch: boolean;
  killSwitchActivo?: boolean;
  sensibilidadModeracion: 'ESTRICTA' | 'MEDIA' | 'PERMISIVA' | string;
  coleccionesAutorizadas: string[];
  modeloActivo?: string;
  temperatura?: number;
  ultimaModificacion?: string;
  modificadoPor?: string;
}

export interface AlertasCNE {
  alertaNacionalActiva: 'VERDE' | 'AMARILLA' | 'NARANJA' | 'ROJA' | string;
  comunicadoOficial: string;
  fechaActualizacion: string;
  fuenteOficial?: string;
  albergues?: AlbergueCNE[];
}

export interface MasterDbSchema {
  usuarios: Usuario[];
  solicitudesComercio: SolicitudComercio[];
  incidenciasViales: IncidenciaVial[];
  alberguesCNE: AlbergueCNE[];
  proyectosPresupuesto: ProyectoPresupuesto[];
  votosEmitidos: VotoEmitido[];
  bitacoraAuditoria: BitacoraAuditoria[];
  configuracionIA: ConfiguracionIA;
  alertasCNE: AlertasCNE;
  sesionesActivas?: any[];
  bitacoraAccesos?: any[];
  moderacionContenido?: any[];
  ticketsAverias?: any[];
}

// ----------------------------------------------------------------------------
// MOTOR DE ACCESO Y PERSISTENCIA ATÓMICA
// ----------------------------------------------------------------------------

/**
 * Normaliza y garantiza la integridad de todas las colecciones maestras.
 */
function sanitizeMasterDb(parsed: any): MasterDbSchema {
  const seed = masterSeedData as unknown as MasterDbSchema;
  const result = { ...seed, ...parsed };

  result.usuarios = Array.isArray(parsed?.usuarios) ? parsed.usuarios : [...seed.usuarios];
  result.solicitudesComercio = Array.isArray(parsed?.solicitudesComercio) ? parsed.solicitudesComercio : [...seed.solicitudesComercio];
  result.incidenciasViales = Array.isArray(parsed?.incidenciasViales) ? parsed.incidenciasViales : [...seed.incidenciasViales];
  result.alberguesCNE = Array.isArray(parsed?.alberguesCNE) ? parsed.alberguesCNE : [...seed.alberguesCNE];
  result.proyectosPresupuesto = Array.isArray(parsed?.proyectosPresupuesto) ? parsed.proyectosPresupuesto : [...seed.proyectosPresupuesto];
  result.votosEmitidos = Array.isArray(parsed?.votosEmitidos) ? parsed.votosEmitidos : [];
  result.bitacoraAuditoria = Array.isArray(parsed?.bitacoraAuditoria) ? parsed.bitacoraAuditoria : [...seed.bitacoraAuditoria];
  result.configuracionIA = parsed?.configuracionIA ? { ...seed.configuracionIA, ...parsed.configuracionIA } : { ...seed.configuracionIA };
  result.alertasCNE = parsed?.alertasCNE ? { ...seed.alertasCNE, ...parsed.alertasCNE } : { ...seed.alertasCNE };

  // Colecciones de soporte para compatibilidad con módulos existentes
  result.sesionesActivas = Array.isArray(parsed?.sesionesActivas) ? parsed.sesionesActivas : [];
  result.bitacoraAccesos = Array.isArray(parsed?.bitacoraAccesos) ? parsed.bitacoraAccesos : [];
  result.moderacionContenido = Array.isArray(parsed?.moderacionContenido) ? parsed.moderacionContenido : [];
  result.ticketsAverias = Array.isArray(parsed?.ticketsAverias) ? parsed.ticketsAverias : (result.incidenciasViales as any[]);

  return result;
}

/**
 * Obtiene la base de datos completa de localStorage. Si no existe, inicializa con db.json.
 */
export function getMasterDb(): MasterDbSchema {
  const seed = masterSeedData as unknown as MasterDbSchema;

  if (typeof window === 'undefined') {
    return sanitizeMasterDb(seed);
  }

  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      const sanitized = sanitizeMasterDb(seed);
      saveMasterDb(sanitized);
      return sanitized;
    }

    const parsed = JSON.parse(raw);
    return sanitizeMasterDb(parsed);
  } catch (err) {
    console.error('[crudService] Error al leer base de datos de localStorage, restaurando a seed:', err);
    const sanitized = sanitizeMasterDb(seed);
    saveMasterDb(sanitized);
    return sanitized;
  }
}

/**
 * Guarda el estado en localStorage y emite eventos globales reactivos.
 */
export function saveMasterDb(db: MasterDbSchema): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: db }));
    window.dispatchEvent(new CustomEvent(ADMIN_UPDATE_EVENT, { detail: db }));
  } catch (err) {
    console.error('[crudService] Error crítico guardando en localStorage:', err);
  }
}

/**
 * Restaura toda la base de datos a los valores iniciales de src/data/db.json.
 */
export function resetDbToMasterSeed(): MasterDbSchema {
  const seed = masterSeedData as unknown as MasterDbSchema;
  const sanitized = sanitizeMasterDb(seed);
  saveMasterDb(sanitized);
  return sanitized;
}

// ----------------------------------------------------------------------------
// OPERACIONES CRUD GENÉRICAS ATÓMICAS
// ----------------------------------------------------------------------------

export function getAll<T>(collectionKey: keyof MasterDbSchema): T[] {
  const db = getMasterDb();
  const coll = db[collectionKey];
  return Array.isArray(coll) ? ([...coll] as unknown as T[]) : [];
}

export function getById<T extends { id: string }>(
  collectionKey: keyof MasterDbSchema,
  id: string
): T | undefined {
  const list = getAll<T>(collectionKey);
  return list.find((item) => item.id === id);
}

export function createItem<T extends { id: string }>(
  collectionKey: keyof MasterDbSchema,
  item: T
): T {
  const db = getMasterDb();
  const coll = db[collectionKey] as any[];

  if (!Array.isArray(coll)) {
    throw new Error(`La clave "${String(collectionKey)}" no es una colección iterable.`);
  }

  // Prevenir duplicados de ID
  const existingIdx = coll.findIndex((x) => x.id === item.id);
  if (existingIdx >= 0) {
    coll[existingIdx] = { ...coll[existingIdx], ...item };
  } else {
    coll.unshift(item);
  }

  saveMasterDb(db);
  return item;
}

export function updateItem<T extends { id: string }>(
  collectionKey: keyof MasterDbSchema,
  id: string,
  changes: Partial<T>
): T | null {
  const db = getMasterDb();
  const coll = db[collectionKey] as any[];

  if (!Array.isArray(coll)) return null;

  const idx = coll.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const updated = { ...coll[idx], ...changes };
  coll[idx] = updated;

  saveMasterDb(db);
  return updated as T;
}

export function deleteItem(collectionKey: keyof MasterDbSchema, id: string): boolean {
  const db = getMasterDb();
  const coll = db[collectionKey] as any[];

  if (!Array.isArray(coll)) return false;

  const prevLen = coll.length;
  (db as any)[collectionKey] = coll.filter((item) => item.id !== id);

  if ((db as any)[collectionKey].length !== prevLen) {
    saveMasterDb(db);
    return true;
  }
  return false;
}

export function queryItems<T>(
  collectionKey: keyof MasterDbSchema,
  predicate: (item: T) => boolean
): T[] {
  const items = getAll<T>(collectionKey);
  return items.filter(predicate);
}

// ----------------------------------------------------------------------------
// MÉTODOS DE NEGOCIO Y DOMINIO PARA CADA COLECCIÓN CÍVICA
// ----------------------------------------------------------------------------

// 1. USUARIOS
export function getUsuarios(): Usuario[] {
  return getAll<Usuario>('usuarios');
}

export function getUsuarioById(id: string): Usuario | undefined {
  return getById<Usuario>('usuarios', id);
}

export function getUsuarioByCedula(cedula: string): Usuario | undefined {
  const clean = (cedula || '').replace(/[^0-9]/g, '');
  return getUsuarios().find((u) => u.cedula.replace(/[^0-9]/g, '') === clean);
}

export function createUsuario(data: Partial<Usuario>): Usuario {
  const newId = data.id || `USR-CIUD-${Math.floor(100 + Math.random() * 900)}`;
  const usuario: Usuario = {
    id: newId,
    cedula: data.cedula || '1-0000-0000',
    nombre: data.nombre || 'Ciudadano Registrado',
    correo: data.correo || 'ciudadano@correo.cr',
    password: data.password || 'Ciudadano2026*',
    rol: data.rol || 'Ciudadano/Turista',
    nivelAcceso: data.nivelAcceso || 2,
    provincia: data.provincia || 'San José',
    canton: data.canton || 'San José',
    distrito: data.distrito || 'Carmen',
    fechaRegistro: data.fechaRegistro || new Date().toISOString(),
    verificadoHacienda: data.verificadoHacienda ?? true
  };
  return createItem<Usuario>('usuarios', usuario);
}

export function updateUsuario(id: string, changes: Partial<Usuario>): Usuario | null {
  return updateItem<Usuario>('usuarios', id, changes);
}

export function deleteUsuario(id: string): boolean {
  return deleteItem('usuarios', id);
}

// 2. SOLICITUDES DE COMERCIO Y FERIAS
export function getSolicitudesComercio(): SolicitudComercio[] {
  return getAll<SolicitudComercio>('solicitudesComercio');
}

export function createSolicitudComercio(data: Omit<SolicitudComercio, 'id'>): SolicitudComercio {
  const newId = `SOL-COM-${Math.floor(100 + Math.random() * 900)}`;
  const solicitud: SolicitudComercio = {
    ...data,
    id: newId,
    cedula: data.cedulaJuridica || (data as any).cedula || '3-101-000000',
    nombreNegocio: data.nombreComercio || (data as any).nombreNegocio,
    actividadEconomicaHacienda: data.actividadHacienda,
    sectorFeria: data.sectorFeriaSolicitado,
    fechaSolicitud: data.fechaSolicitud || new Date().toISOString(),
    estado: data.estado || 'PENDIENTE',
    justificacion: data.justificacion || ''
  };
  return createItem<SolicitudComercio>('solicitudesComercio', solicitud);
}

export function resolverSolicitudComercio(
  id: string,
  estado: 'APROBADO' | 'RECHAZADO',
  justificacion: string,
  sectorFeria?: string
): SolicitudComercio | null {
  const updates: Partial<SolicitudComercio> = {
    estado,
    justificacion,
    notas: justificacion
  };
  if (sectorFeria) {
    updates.sectorFeriaSolicitado = sectorFeria;
    updates.sectorFeria = sectorFeria;
  }
  return updateItem<SolicitudComercio>('solicitudesComercio', id, updates);
}

export function deleteSolicitudComercio(id: string): boolean {
  return deleteItem('solicitudesComercio', id);
}

// 3. INCIDENCIAS VIALES / AVERÍAS MUNICIPALES
export function getIncidenciasViales(): IncidenciaVial[] {
  return getAll<IncidenciaVial>('incidenciasViales');
}

export function createIncidenciaVial(data: Omit<IncidenciaVial, 'id'>): IncidenciaVial {
  const newId = `EXP-MUNI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const incidencia: IncidenciaVial = {
    ...data,
    id: newId,
    titulo: data.descripcion || (data as any).titulo,
    fechaRadicado: data.fechaRadicado || new Date().toISOString(),
    fechaReporte: data.fechaRadicado || new Date().toISOString(),
    estado: data.estado || 'EN_INSPECCION'
  };
  return createItem<IncidenciaVial>('incidenciasViales', incidencia);
}

export function updateIncidenciaVial(
  id: string,
  changes: Partial<IncidenciaVial>
): IncidenciaVial | null {
  return updateItem<IncidenciaVial>('incidenciasViales', id, changes);
}

export function deleteIncidenciaVial(id: string): boolean {
  return deleteItem('incidenciasViales', id);
}

// 4. ALBERGUES CNE
export function getAlberguesCNE(): AlbergueCNE[] {
  return getAll<AlbergueCNE>('alberguesCNE');
}

export function createAlbergueCNE(data: Omit<AlbergueCNE, 'id'>): AlbergueCNE {
  const newId = `ALB-${Math.floor(100 + Math.random() * 900)}`;
  const albergue: AlbergueCNE = {
    ...data,
    id: newId,
    capacidadTotal: data.capacidadMaxima,
    estado: data.estado || 'Habilitado'
  };
  return createItem<AlbergueCNE>('alberguesCNE', albergue);
}

export function updateAlbergueCNE(id: string, changes: Partial<AlbergueCNE>): AlbergueCNE | null {
  return updateItem<AlbergueCNE>('alberguesCNE', id, changes);
}

export function deleteAlbergueCNE(id: string): boolean {
  return deleteItem('alberguesCNE', id);
}

// 5. PROYECTOS DE PRESUPUESTO PARTICIPATIVO Y VOTACIÓN ANTIFRAUDE
export function getProyectosPresupuesto(): ProyectoPresupuesto[] {
  return getAll<ProyectoPresupuesto>('proyectosPresupuesto');
}

export function createProyectoPresupuesto(
  data: Omit<ProyectoPresupuesto, 'id'>
): ProyectoPresupuesto {
  const newId = `PROY-${Math.floor(100 + Math.random() * 900)}`;
  const proyecto: ProyectoPresupuesto = {
    ...data,
    id: newId,
    votosAcumulados: data.votosAcumulados || 0,
    estado: data.estado || 'EN_VOTACION'
  };
  return createItem<ProyectoPresupuesto>('proyectosPresupuesto', proyecto);
}

export function updateProyectoPresupuesto(
  id: string,
  changes: Partial<ProyectoPresupuesto>
): ProyectoPresupuesto | null {
  return updateItem<ProyectoPresupuesto>('proyectosPresupuesto', id, changes);
}

export function deleteProyectoPresupuesto(id: string): boolean {
  return deleteItem('proyectosPresupuesto', id);
}

export function getVotosEmitidos(): VotoEmitido[] {
  return getAll<VotoEmitido>('votosEmitidos');
}

export function votarProyectoPresupuesto(
  proyectoId: string,
  usuarioCedula: string
): { success: boolean; message: string; proyecto?: ProyectoPresupuesto; comprobante?: string } {
  const db = getMasterDb();
  const cleanCedula = (usuarioCedula || '').trim();

  // Validar si el ciudadano ya votó en este proyecto
  const yaVoto = db.votosEmitidos.some(
    (v) => v.proyectoId === proyectoId && v.usuarioCedula === cleanCedula
  );

  if (yaVoto) {
    return {
      success: false,
      message: 'Usted ya ha ejercido su voto soberano en este proyecto participativo.'
    };
  }

  // Buscar proyecto
  const proy = db.proyectosPresupuesto.find((p) => p.id === proyectoId);
  if (!proy) {
    return { success: false, message: 'El proyecto indicado no existe en el sistema.' };
  }

  // Incrementar votos
  proy.votosAcumulados = (proy.votosAcumulados || 0) + 1;

  // Registrar voto con hash criptográfico simulado
  const comprobante = `CERT-VOTO-2026-${Date.now().toString(36).toUpperCase()}`;
  const nuevoVoto: VotoEmitido = {
    id: `VOT-${Date.now().toString(36)}`,
    proyectoId,
    usuarioCedula: cleanCedula,
    fechaVoto: new Date().toISOString(),
    hashFirma: comprobante
  };

  db.votosEmitidos.push(nuevoVoto);
  saveMasterDb(db);

  return {
    success: true,
    message: `¡Voto registrado formalmente para el proyecto "${proy.titulo}"!`,
    proyecto: proy,
    comprobante
  };
}

// 6. BITÁCORA DE AUDITORÍA
export function getBitacoraAuditoria(): BitacoraAuditoria[] {
  return getAll<BitacoraAuditoria>('bitacoraAuditoria');
}

export function registrarAuditoria(
  accion: string,
  entidad: string,
  justificacion: string,
  adminId: string = 'USR-NAC-001'
): BitacoraAuditoria {
  const now = new Date();
  const fechaIso = now.toISOString();
  const fechaCst = now.toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }) + ' CST';

  const entry: BitacoraAuditoria = {
    id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
    fecha: fechaIso,
    fechaHoraCst: fechaCst,
    adminId,
    adminCedula: '1-0000-0001',
    adminNombre: 'Superintendencia Nacional de Gobierno Digital',
    adminRol: 'Super Administrador Nacional',
    accion,
    entidadAfectada: entidad,
    justificacion,
    justificante: justificacion,
    ipOrigen: '192.168.1.10 (Red Presidencial)'
  };

  return createItem<BitacoraAuditoria>('bitacoraAuditoria', entry);
}

// 7. GOBERNANZA DE IA
export function getConfiguracionIA(): ConfiguracionIA {
  const db = getMasterDb();
  return { ...db.configuracionIA };
}

export function updateConfiguracionIA(changes: Partial<ConfiguracionIA>): ConfiguracionIA {
  const db = getMasterDb();
  const updated: ConfiguracionIA = {
    ...db.configuracionIA,
    ...changes,
    ultimaModificacion: new Date().toISOString()
  };
  if (changes.killSwitch !== undefined) {
    updated.killSwitchActivo = changes.killSwitch;
  }
  db.configuracionIA = updated;
  saveMasterDb(db);
  return updated;
}

export function toggleKillSwitchIA(activar?: boolean): ConfiguracionIA {
  const current = getConfiguracionIA();
  const nextVal = activar !== undefined ? activar : !current.killSwitch;
  return updateConfiguracionIA({ killSwitch: nextVal, killSwitchActivo: nextVal });
}

// 8. COORDINACIÓN DE ALERTAS CNE
export function getAlertasCNE(): AlertasCNE {
  const db = getMasterDb();
  return { ...db.alertasCNE };
}

export function updateAlertaCNE(nivel: string, comunicado: string): AlertasCNE {
  const db = getMasterDb();
  const updated: AlertasCNE = {
    ...db.alertasCNE,
    alertaNacionalActiva: nivel as any,
    comunicadoOficial: comunicado,
    fechaActualizacion: new Date().toISOString()
  };
  db.alertasCNE = updated;
  saveMasterDb(db);
  return updated;
}

// 9. EXPORTACIÓN TOTAL
export function exportarBaseDatosJSON(): string {
  const db = getMasterDb();
  return JSON.stringify(db, null, 2);
}
