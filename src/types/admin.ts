/**
 * ============================================================================
 * COSTA RICA UNIDOS — TIPOS DE ADMINISTRACIÓN CÍVICA Y GOBERNANZA (SRS v2.1)
 * Modelos de datos para moderación, auditoría, solicitudes de comercio,
 * control de IA y gestión de alertas CNE.
 * ============================================================================
 */

export type EstadoSolicitudComercio = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export type TipoCedula = 'FISICA' | 'JURIDICA' | 'DIMEX';

export interface SolicitudComercio {
  id: string;
  cedula: string;
  tipoCedula: TipoCedula;
  nombreSolicitante: string;
  nombreNegocio: string;
  actividadEconomicaHacienda: string;
  codigoActividad: string;
  canton: string;
  distrito: string;
  provincia: string;
  fechaSolicitud: string;
  estado: EstadoSolicitudComercio;
  sectorFeria?: string;
  notas?: string;
  verificadoHacienda: boolean;
  telefono?: string;
  correo?: string;
  fechaResolucion?: string;
  resueltoPor?: string;
}

export type MotivoModeracion =
  | 'LENGUAJE_INAPROPIADO'
  | 'SPAM'
  | 'DATOS_SENSIBLES_LEY_8968'
  | 'DESINFORMACION_CIVICA';

export type EstadoModeracion = 'PENDIENTE_REVISION' | 'APROBADO' | 'ELIMINADO';

export interface ItemModeracion {
  id: string;
  tipoContenido: 'COMENTARIO' | 'PUBLICACION_FORO' | 'REPORTE_INCIDENCIA' | 'PROPUESTA_PRESUPUESTO';
  motivo: MotivoModeracion;
  textoOriginal: string;
  autorCedula: string;
  autorNombre: string;
  moduloOrigen: string;
  fechaReporte: string;
  scoreToxicidadIA?: number;
  estado: EstadoModeracion;
  justificacionResolucion?: string;
  fechaResolucion?: string;
  resueltoPor?: string;
}

export type AccionAuditoria =
  | 'ELIMINAR_COMENTARIO'
  | 'APROBAR_PATENTE'
  | 'RECHAZAR_PATENTE'
  | 'CAMBIAR_ALERTA_CNE'
  | 'RESOLVER_AVERIA'
  | 'CONFIGURAR_IA'
  | 'DESCARGAR_RESPALDO'
  | 'RESTAURAR_SEMILLA'
  | string;

export interface RegistroAuditoria {
  id: string;
  fechaHoraCst: string;
  timestamp: string;
  adminCedula: string;
  adminNombre: string;
  adminRol: string;
  accion: AccionAuditoria;
  entidadAfectada: string;
  justificante: string;
  ipOrigen: string;
}

export type SensibilidadModeracion = 'ESTRICTA' | 'MODERADA' | 'FLEXIBLE';

export interface ConfiguracionIA {
  killSwitchActivo: boolean;
  sensibilidadModeracion: SensibilidadModeracion;
  coleccionesAutorizadas: string[];
  modeloActivo: string;
  temperatura: number;
  ultimaModificacion: string;
  modificadoPor: string;
}

export type NivelAlertaCNE = 'VERDE' | 'AMARILLA' | 'NARANJA' | 'ROJA';

export type EstadoAlbergue = 'DISPONIBLE' | 'OCUPACION_ALTA' | 'COMPLETO' | 'INACTIVO';

export interface AlbergueCNE {
  id: string;
  nombre: string;
  canton: string;
  provincia: string;
  capacidadTotal: number;
  ocupacionActual: number;
  estado: EstadoAlbergue;
  servicios: string[];
  responsableContacto: string;
}

export interface EstadoAlertaCNE {
  alertaNacionalActiva: NivelAlertaCNE;
  comunicadoOficial: string;
  fechaActualizacion: string;
  fuenteOficial: string;
  albergues: AlbergueCNE[];
}

export type EstadoTicketAveria = 'REPORTADO' | 'EN_PROCESO' | 'RESUELTO' | 'DESCARTADO';

export interface TicketAveriaMunicipal {
  id: string;
  titulo: string;
  categoria: 'VIAL' | 'AGUA_POTABLE' | 'ALUMBRADO' | 'PARQUES_Y_ORNATO' | 'OTRO';
  canton: string;
  distrito: string;
  direccionExacta: string;
  estado: EstadoTicketAveria;
  cuadrillaAsignada?: string;
  fechaReporte: string;
  fechaResolucion?: string;
  reportadoPor: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
}

export interface MetricasGestionMunicipal {
  ticketsResueltos: number;
  ticketsPendientes: number;
  votosEmitidos: number;
  comerciosActivos: number;
  solicitudesPendientes: number;
  itemsPorModerar: number;
  tiempoPromedioRespuestaHoras: number;
  alberguesHabilitados: number;
}

export interface AdminDbSchema {
  solicitudesComercio: SolicitudComercio[];
  moderacionContenido: ItemModeracion[];
  bitacoraAuditoria: RegistroAuditoria[];
  configuracionIA: ConfiguracionIA;
  alertasCNE: EstadoAlertaCNE;
  ticketsAverias?: TicketAveriaMunicipal[];
}
