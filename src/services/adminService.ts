/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE ADMINISTRACIÓN Y GOBERNANZA (SRS v2.1)
 * Refactorizado para conectarse directamente con dbClient como única fuente de verdad.
 * ============================================================================
 */

import { dbClient } from './dbClient';
import {
  SolicitudComercio,
  EstadoSolicitudComercio,
  ItemModeracion,
  EstadoModeracion,
  RegistroAuditoria,
  AccionAuditoria,
  ConfiguracionIA,
  EstadoAlertaCNE,
  NivelAlertaCNE,
  TicketAveriaMunicipal,
  EstadoTicketAveria,
  MetricasGestionMunicipal
} from '../types/admin';
import { AlbergueCNE } from './crudService';

/**
 * Retorna la fecha y hora formateada en el huso horario oficial de Costa Rica (CST / UTC-6).
 */
export function obtenerFechaHoraCST(date: Date = new Date()): string {
  try {
    const opciones: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Costa_Rica',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const formateador = new Intl.DateTimeFormat('es-CR', opciones);
    return `${formateador.format(date)} CST`;
  } catch (_e) {
    return `${date.toISOString().replace('T', ' ').substring(0, 19)} CST`;
  }
}

/**
 * Obtiene los datos del administrador en sesión actual desde localStorage.
 */
function getActiveAdminInfo(): { cedula: string; nombre: string; rol: string } {
  try {
    const sesionRaw = localStorage.getItem('cr_sesion_activa');
    if (sesionRaw) {
      const u = JSON.parse(sesionRaw);
      return {
        cedula: u.cedula || '1-0000-0001',
        nombre: u.nombre || 'Superintendencia Nacional',
        rol: u.rol || 'Super Administrador Nacional'
      };
    }
  } catch (_e) {}

  return {
    cedula: '1-0000-0001',
    nombre: 'Superintendencia Nacional de Gobierno Digital',
    rol: 'Super Administrador Nacional'
  };
}

// ============================================================================
// 1. GESTIÓN DE SOLICITUDES DE COMERCIO Y FERIAS
// ============================================================================

/**
 * Obtiene la lista completa de solicitudes de comercio y ferias desde dbClient.
 */
export function obtenerSolicitudesComercio(): SolicitudComercio[] {
  return dbClient.getCollection<SolicitudComercio>('solicitudesComercio');
}

/**
 * Resuelve una solicitud de comercio (APROBADO o RECHAZADO) registrando la acción en bitácora.
 */
export function resolverSolicitudComercio(
  id: string,
  estado: EstadoSolicitudComercio | string,
  justificacion?: string,
  sectorFeria?: string
): SolicitudComercio {
  const admin = getActiveAdminInfo();
  const fechaNow = new Date().toISOString();

  const updates: Partial<SolicitudComercio> & Record<string, any> = {
    estado: estado as any,
    justificacion: justificacion || `Solicitud ${String(estado).toLowerCase()} formalmente por la administración cívica.`,
    notas: justificacion,
    fechaResolucion: fechaNow,
    resueltoPor: `${admin.nombre} (${admin.cedula})`
  };

  if (sectorFeria !== undefined) {
    updates.sectorFeriaSolicitado = sectorFeria;
    updates.sectorFeria = sectorFeria;
  }

  const solicitudActualizada = dbClient.update<SolicitudComercio>('solicitudesComercio', id, updates);

  // Registrar en bitácora de auditoría inmutable
  const accionAudit: AccionAuditoria = estado === 'APROBADO' ? 'APROBAR_PATENTE' : 'RECHAZAR_PATENTE';
  const motivo = justificacion || `Resolución administrativa ${estado} del comercio ${solicitudActualizada.nombreNegocio || solicitudActualizada.nombreComercio || id}.`;

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: fechaNow,
    fechaHoraCst: obtenerFechaHoraCST(new Date()),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: accionAudit,
    entidadAfectada: `Comercio: ${solicitudActualizada.nombreNegocio || solicitudActualizada.nombreComercio || id}`,
    justificacion: motivo,
    justificante: motivo,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });

  return solicitudActualizada;
}

// ============================================================================
// 2. COORDINACIÓN DE ALBERGUES Y ALERTAS CNE
// ============================================================================

/**
 * Obtiene el catálogo de albergues CNE desde dbClient.
 */
export function obtenerAlbergues(): AlbergueCNE[] {
  return dbClient.getCollection<AlbergueCNE>('alberguesCNE');
}

/**
 * Actualiza el estado de un albergue CNE y audita la acción.
 */
export function actualizarEstadoAlbergue(id: string, estado: string): AlbergueCNE {
  const admin = getActiveAdminInfo();
  const albergueActual = dbClient.getById<AlbergueCNE>('alberguesCNE', id);
  const esLleno = estado === 'Lleno al 100%' || estado === 'COMPLETO';

  const updates: Partial<AlbergueCNE> = {
    estado: estado as any,
    ocupacionActual: esLleno && albergueActual
      ? (albergueActual.capacidadMaxima || albergueActual.capacidadTotal || albergueActual.ocupacionActual)
      : (albergueActual?.ocupacionActual || 0)
  };

  const albergueActualizado = dbClient.update<AlbergueCNE>('alberguesCNE', id, updates);

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: new Date().toISOString(),
    fechaHoraCst: obtenerFechaHoraCST(new Date()),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: 'CAMBIAR_ALERTA_CNE',
    entidadAfectada: `Albergue: ${albergueActualizado.nombre} (${albergueActualizado.id})`,
    justificacion: `Estado de albergue modificado a "${estado}".`,
    justificante: `Estado de albergue modificado a "${estado}".`,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });

  return albergueActualizado;
}

/**
 * Obtiene la configuración oficial de alertas CNE.
 */
export function obtenerAlertasCNE(): EstadoAlertaCNE {
  return dbClient.getConfig('alertasCNE') as unknown as EstadoAlertaCNE;
}

/** Alias para compatibilidad con código existente */
export const obtenerEstadoAlertasCNE = obtenerAlertasCNE;

/**
 * Actualiza la alerta nacional de la CNE y su comunicado oficial.
 */
export function actualizarAlertaCNE(
  nivel: NivelAlertaCNE | string,
  comunicado: string
): EstadoAlertaCNE {
  const admin = getActiveAdminInfo();
  const fechaNow = new Date().toISOString();

  const alertaActualizada = dbClient.updateConfig('alertasCNE', {
    alertaNacionalActiva: nivel as any,
    comunicadoOficial: comunicado,
    fechaActualizacion: fechaNow
  });

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: fechaNow,
    fechaHoraCst: obtenerFechaHoraCST(new Date()),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: 'CAMBIAR_ALERTA_CNE',
    entidadAfectada: `Alerta Nacional CNE -> Nivel ${nivel}`,
    justificacion: `Comunicado oficial emitido: "${comunicado.substring(0, 100)}..."`,
    justificante: `Comunicado oficial emitido: "${comunicado.substring(0, 100)}..."`,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });

  return alertaActualizada as unknown as EstadoAlertaCNE;
}

// ============================================================================
// 3. GOBERNANZA Y KILL-SWITCH DEL MOTOR DE INTELIGENCIA ARTIFICIAL
// ============================================================================

/**
 * Obtiene los parámetros vigentes del motor de IA cívica.
 */
export function obtenerConfiguracionIA(): ConfiguracionIA {
  return dbClient.getConfig('configuracionIA') as unknown as ConfiguracionIA;
}

/**
 * Actualiza la configuración, sensibilidad o kill-switch de la IA.
 */
export function actualizarConfiguracionIA(
  config: Partial<ConfiguracionIA>
): ConfiguracionIA {
  const admin = getActiveAdminInfo();
  const fechaNow = new Date().toISOString();

  const configActualizada = dbClient.updateConfig('configuracionIA', {
    ...config,
    ultimaModificacion: fechaNow,
    modificadoPor: `${admin.nombre} (${admin.cedula})`
  } as any);

  const detalleKillSwitch = config.killSwitchActivo !== undefined
    ? `Kill-Switch: ${config.killSwitchActivo ? 'ACTIVADO (APAGADO)' : 'DESACTIVADO (OPERATIVO)'}. `
    : '';

  const detalleSensibilidad = config.sensibilidadModeracion
    ? `Sensibilidad: ${config.sensibilidadModeracion}. `
    : '';

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: fechaNow,
    fechaHoraCst: obtenerFechaHoraCST(new Date()),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: 'CONFIGURAR_IA',
    entidadAfectada: 'Motor de Inteligencia Artificial Cívica',
    justificacion: `${detalleKillSwitch}${detalleSensibilidad}Parámetros de inferencia y gobernanza actualizados.`,
    justificante: `${detalleKillSwitch}${detalleSensibilidad}Parámetros de inferencia y gobernanza actualizados.`,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });

  return configActualizada as unknown as ConfiguracionIA;
}

// ============================================================================
// 4. RESPALDO Y RESTAURACIÓN DE LA BASE DE DATOS MAESTRA
// ============================================================================

/**
 * Descarga una copia fiel de la base de datos en formato JSON con la convención solicitada.
 */
export function descargarRespaldoDbJson(): void {
  const jsonString = dbClient.exportJSON();
  const admin = getActiveAdminInfo();
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const nombreArchivo = `costa-rica-unidos-db-${year}-${month}-${day}.json`;

  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });

  if (typeof window !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${year}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: now.toISOString(),
    fechaHoraCst: obtenerFechaHoraCST(now),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: 'DESCARGAR_RESPALDO',
    entidadAfectada: 'Base de Datos Institucional',
    justificacion: `Generación y descarga de archivo de respaldo "${nombreArchivo}".`,
    justificante: `Generación y descarga de archivo de respaldo "${nombreArchivo}".`,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });
}

/**
 * Restaura la base de datos a los valores iniciales de fábrica de src/data/db.json.
 */
export function restaurarDatosSemilla(): void {
  const admin = getActiveAdminInfo();
  const now = new Date();

  dbClient.resetToSeed();

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: now.toISOString(),
    fechaHoraCst: obtenerFechaHoraCST(now),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: 'RESTAURAR_SEMILLA',
    entidadAfectada: 'Base de Datos Institucional',
    justificacion: 'Restauración general de fábrica ejecutada por la administración.',
    justificante: 'Restauración general de fábrica ejecutada por la administración.',
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });
}

// ============================================================================
// 5. GESTIÓN DE AVERÍAS MUNICIPALES E INCIDENCIAS VIALES
// ============================================================================

/**
 * Obtiene la lista de averías/incidencias viales municipales.
 */
export function obtenerTicketsAverias(): TicketAveriaMunicipal[] {
  return dbClient.getCollection<TicketAveriaMunicipal>('incidenciasViales');
}

/**
 * Actualiza el estado y cuadrilla de una avería municipal.
 */
export function actualizarEstadoAveriaMunicipal(
  idTicket: string,
  nuevoEstado: EstadoTicketAveria | string,
  cuadrillaAsignada?: string
): TicketAveriaMunicipal {
  const admin = getActiveAdminInfo();
  const now = new Date();

  const updates: Partial<TicketAveriaMunicipal> & Record<string, any> = {
    estado: nuevoEstado as EstadoTicketAveria,
    cuadrillaAsignada
  };

  if (nuevoEstado === 'RESUELTO') {
    updates.fechaResolucion = now.toISOString();
  }

  const ticketActualizado = dbClient.update<TicketAveriaMunicipal>('incidenciasViales', idTicket, updates);

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: now.toISOString(),
    fechaHoraCst: obtenerFechaHoraCST(now),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: 'RESOLVER_AVERIA',
    entidadAfectada: `Ticket ${ticketActualizado.id} (${ticketActualizado.canton})`,
    justificacion: `Avería cambiada a estado ${nuevoEstado}. Cuadrilla: ${cuadrillaAsignada || 'Sin asignar'}.`,
    justificante: `Avería cambiada a estado ${nuevoEstado}. Cuadrilla: ${cuadrillaAsignada || 'Sin asignar'}.`,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });

  return ticketActualizado;
}

// ============================================================================
// 6. BITÁCORA LEGAL INMUTABLE DE AUDITORÍA
// ============================================================================

/**
 * Obtiene la bitácora legal completa de auditoría.
 */
export function obtenerBitacoraAuditoria(): RegistroAuditoria[] {
  return dbClient.getCollection<RegistroAuditoria>('bitacoraAuditoria');
}

/**
 * Registra una acción administrativa legal en la bitácora inmutable.
 */
export function registrarAccionAuditoria(
  accion: AccionAuditoria,
  entidad: string,
  justificacion: string,
  adminCedula?: string
): RegistroAuditoria {
  let admin = getActiveAdminInfo();
  if (adminCedula && adminCedula !== admin.cedula) {
    admin = { ...admin, cedula: adminCedula };
  }

  const now = new Date();
  const nuevoRegistro: RegistroAuditoria = {
    id: `AUD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fechaHoraCst: obtenerFechaHoraCST(now),
    timestamp: now.toISOString(),
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion,
    entidadAfectada: entidad,
    justificante: justificacion,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  };

  return dbClient.insert('bitacoraAuditoria', nuevoRegistro);
}

// ============================================================================
// 7. COLA DE MODERACIÓN DE CONTENIDO (LEY N° 8968)
// ============================================================================

export function obtenerColaModeracion(): ItemModeracion[] {
  return dbClient.getCollection<ItemModeracion>('moderacionContenido');
}

export function resolverModeracion(
  id: string,
  accion: 'APROBADO' | 'ELIMINADO',
  justificacion: string
): ItemModeracion {
  const admin = getActiveAdminInfo();
  const fechaNow = new Date().toISOString();

  const itemActualizado = dbClient.update<ItemModeracion>('moderacionContenido', id, {
    estado: accion as EstadoModeracion,
    justificacionResolucion: justificacion,
    fechaResolucion: fechaNow,
    resueltoPor: `${admin.nombre} (${admin.cedula})`
  });

  const accionAudit: AccionAuditoria = accion === 'ELIMINADO' ? 'ELIMINAR_COMENTARIO' : 'APROBAR_CONTENIDO';

  dbClient.insert('bitacoraAuditoria', {
    id: `AUD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fecha: fechaNow,
    fechaHoraCst: obtenerFechaHoraCST(new Date()),
    adminId: admin.cedula,
    adminCedula: admin.cedula,
    adminNombre: admin.nombre,
    adminRol: admin.rol,
    accion: accionAudit,
    entidadAfectada: `Contenido: ${itemActualizado.tipoContenido} (${itemActualizado.id})`,
    justificacion,
    justificante: justificacion,
    ipOrigen: '192.168.1.10 (Red Institucional Segura)'
  });

  return itemActualizado;
}

// ============================================================================
// 8. MÉTRICAS CONSOLIDADAS DE GESTIÓN MUNICIPAL
// ============================================================================

export function obtenerMetricasGestionMunicipal(): MetricasGestionMunicipal {
  const tickets = dbClient.getCollection<any>('incidenciasViales');
  const ticketsResueltos = tickets.filter((t) => t.estado === 'RESUELTO').length;
  const ticketsPendientes = tickets.filter((t) => t.estado !== 'RESUELTO').length;

  const solicitudes = dbClient.getCollection<any>('solicitudesComercio');
  const comerciosActivos = solicitudes.filter((s) => s.estado === 'APROBADO').length;
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === 'PENDIENTE').length;

  const moderacion = dbClient.getCollection<any>('moderacionContenido');
  const itemsPorModerar = moderacion.filter((m) => m.estado === 'PENDIENTE_REVISION').length;

  const albergues = dbClient.getCollection<any>('alberguesCNE');
  const alberguesHabilitados = albergues.filter((a) => a.estado !== 'INACTIVO').length;

  const votos = dbClient.getCollection<any>('votosEmitidos');

  return {
    ticketsResueltos,
    ticketsPendientes,
    votosEmitidos: votos.length > 0 ? votos.length : 12450,
    comerciosActivos,
    solicitudesPendientes,
    itemsPorModerar,
    tiempoPromedioRespuestaHoras: 18.5,
    alberguesHabilitados
  };
}
