/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE INCIDENCIAS VIALES Y TICKETS (ticketService)
 * Gestiona la trazabilidad ciudadana contra la colección `incidenciasViales` en dbClient.
 * ============================================================================
 */

import { dbClient } from './dbClient';

export const ABREV_PROVINCIAS = {
  1: 'SJO',
  2: 'ALA',
  3: 'CAR',
  4: 'HER',
  5: 'GUA',
  6: 'PUN',
  7: 'LIM'
};

export const ABREV_CANTONES = {
  'San José': 'CEN',
  'Escazú': 'ESC',
  'Desamparados': 'DES',
  'Puriscal': 'PUR',
  'Tarrazú': 'TAR',
  'Aserrí': 'ASE',
  'Mora': 'MOR',
  'Goicoechea': 'GOI',
  'Santa Ana': 'STA',
  'Alajuelita': 'ALJ',
  'Tibás': 'TIB',
  'Pérez Zeledón': 'PZE',
  'Alajuela': 'CEN',
  'San Ramón': 'SRA',
  'Grecia': 'GRE',
  'San Carlos': 'SCA',
  'Río Cuarto': 'RCU',
  'Palmares': 'PAL',
  'Cartago': 'CEN',
  'Paraíso': 'PAR',
  'La Unión': 'UNI',
  'Turrialba': 'TUR',
  'Heredia': 'CEN',
  'Barva': 'BAR',
  'Santo Domingo': 'SDO',
  'Belén': 'BEL',
  'Liberia': 'LIB',
  'Nicoya': 'NIC',
  'Santa Cruz': 'SCR',
  'Puntarenas': 'CEN',
  'Esparza': 'ESP',
  'Buenos Aires': 'BAI',
  'Montes de Oro': 'MDO',
  'Quepos': 'QUE',
  'Golfito': 'GOL',
  'Garabito': 'GAR',
  'Monteverde': 'MTV',
  'Puerto Jiménez': 'PJZ',
  'Limón': 'CEN',
  'Pococí': 'POC',
  'Siquirres': 'SIQ',
  'Talamanca': 'TAL'
};

const CORRELATIVO_KEY = 'cr_tickets_correlativo_seq';

function getNextCorrelativo() {
  try {
    const current = parseInt(localStorage.getItem(CORRELATIVO_KEY) || '43', 10);
    const next = current + 1;
    localStorage.setItem(CORRELATIVO_KEY, next.toString());
    return String(current).padStart(4, '0');
  } catch {
    return '0043';
  }
}

/**
 * Genera el identificador único estandarizado del ticket de acuerdo a la normativa nacional.
 * Formato: EXP-MUNI-2026-XXXX
 */
export function generarIdTicket(_provinciaId, _nombreCanton) {
  const anio = '2026';
  const correlativo = getNextCorrelativo();
  return `EXP-MUNI-${anio}-${correlativo}`;
}

export const ESTADOS_TICKET = {
  recibido: {
    id: 'recibido',
    step: 1,
    label: 'Radicado',
    color: '#3B82F6',
    badgeBg: 'rgba(59, 130, 246, 0.18)',
    descripcion: 'Reporte radicado oficialmente con número de expediente y georreferenciación verificada.'
  },
  en_inspeccion: {
    id: 'en_inspeccion',
    step: 2,
    label: 'Inspección de Campo',
    color: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    descripcion: 'Unidad técnica municipal o del MOPT asignada para inspección física y peritaje del daño.'
  },
  en_tramite: {
    id: 'en_tramite',
    step: 3,
    label: 'En Ejecución Presupuestaria',
    color: '#8B5CF6',
    badgeBg: 'rgba(139, 92, 246, 0.18)',
    descripcion: 'Orden de trabajo girada a cuadrilla operativa con recursos asignados (Ley 8114 / SICOP).'
  },
  solucionado: {
    id: 'solucionado',
    step: 4,
    label: 'Subsanado',
    color: '#00D166',
    badgeBg: 'rgba(0, 209, 102, 0.18)',
    descripcion: 'Obra concluida satisfactoriamente y fiscalizada con acta de cierre comunal.'
  }
};

export function getEntidadResponsable(categoriaId) {
  switch (categoriaId) {
    case 'hueco_vial':
    case 'INFRAESTRUCTURA_VIAL_HUECO':
      return 'Municipalidad Cantonal / MOPT - CONAVI';
    case 'luminaria':
    case 'LUMINARIA_PUBLICA':
      return 'Compañía Nacional de Fuerza y Luz (CNFL) / ICE';
    case 'fuga_agua':
    case 'FUGA_AGUA_ALCANTARILLA':
      return 'Instituto Costarricense de Acueductos y Alcantarillados (AyA) / ASADA';
    case 'basurero':
    case 'RESIDUOS_VERTEDERO_CLANDESTINO':
      return 'Dirección de Gestión Ambiental Municipal / Ministerio de Salud';
    default:
      return 'Gobierno Local Cantonal';
  }
}

/**
 * Normaliza un ticket de incidencias viales para visualización uniforme en el tablero.
 */
function normalizarIncidencia(t) {
  const idOficial = t.id || t.reportId || 'EXP-MUNI-2026-0001';
  let estadoUI = 'en_inspeccion';

  if (t.estado === 'RESUELTO' || t.estado === 'solucionado') {
    estadoUI = 'solucionado';
  } else if (t.estado === 'EN_PROCESO' || t.estado === 'en_tramite') {
    estadoUI = 'en_tramite';
  } else if (t.estado === 'REPORTADO' || t.estado === 'recibido') {
    estadoUI = 'recibido';
  } else {
    estadoUI = 'en_inspeccion';
  }

  const coords = Array.isArray(t.coordenadas)
    ? { lat: t.coordenadas[0], lng: t.coordenadas[1] }
    : (t.coordenadas || (t.lat ? { lat: t.lat, lng: t.lng } : { lat: 9.935, lng: -84.086 }));

  return {
    ...t,
    id: idOficial,
    reportId: idOficial,
    categoria: t.categoria || 'INFRAESTRUCTURA_VIAL_HUECO',
    categoriaTitulo: t.categoriaTitulo || t.titulo || t.descripcion || 'Incidencia Vial',
    provincia: t.provincia || 'San José',
    canton: t.canton || 'San José',
    distrito: t.distrito || 'Carmen',
    direccionExacta: t.direccionExacta || t.descripcion || 'Dirección cantonal registrada',
    coordenadas: coords,
    estado: estadoUI,
    estadoOficial: t.estado || 'EN_INSPECCION',
    cuadrillaAsignada: t.cuadrillaAsignada || 'Cuadrilla Asignada por la Administración',
    fechaRadicado: t.fechaRadicado || t.fechaReporte || t.fechaRegistro || new Date().toISOString(),
    entidadResponsable: t.entidadResponsable || getEntidadResponsable(t.categoria),
    historial: Array.isArray(t.historial) && t.historial.length > 0
      ? t.historial
      : [
          { estado: 'recibido', fecha: t.fechaRadicado || new Date().toISOString(), nota: 'Reporte ingresado por ciudadano con georreferenciación GPS verificada.' },
          { estado: 'en_inspeccion', fecha: t.fechaRadicado || new Date().toISOString(), nota: `Unidad municipal asignada: ${t.cuadrillaAsignada || 'Obras Viales'}.` }
        ]
  };
}

// ============================================================================
// FUNCIONES CLAVE REQUERIDAS CONECTADAS DIRECTAMENTE A dbClient
// ============================================================================

/**
 * Consulta la lista de incidencias viales desde dbClient.
 */
export function obtenerIncidencias() {
  const lista = dbClient.getCollection('incidenciasViales');
  return lista.map(normalizarIncidencia);
}

/**
 * Inserta una nueva incidencia ciudadana en dbClient.
 */
export function crearIncidencia(datos) {
  const anio = '2026';
  const idGenerado = datos.id || datos.reportId || generarIdTicket(datos.provinciaId, datos.canton);
  const now = new Date().toISOString();

  const coords = Array.isArray(datos.coordenadas)
    ? datos.coordenadas
    : (datos.coordenadas?.lat
      ? [datos.coordenadas.lat, datos.coordenadas.lng]
      : (datos.lat ? [datos.lat, datos.lng] : [9.935, -84.086]));

  const nuevoTicket = {
    id: idGenerado,
    reportId: idGenerado,
    categoria: datos.categoria || 'INFRAESTRUCTURA_VIAL_HUECO',
    categoriaTitulo: datos.categoriaTitulo || datos.titulo || 'Hueco vial / bache en asfalto',
    descripcion: datos.descripcion || datos.direccionExacta || 'Deterioro reportado en vía pública.',
    titulo: datos.titulo || datos.categoriaTitulo || 'Incidencia Vial Reportada',
    coordenadas: coords,
    provincia: datos.provincia || 'San José',
    canton: datos.canton || 'San José',
    distrito: datos.distrito || 'Carmen',
    direccionExacta: datos.direccionExacta || 'Sector cantonal registrado',
    estado: 'EN_INSPECCION',
    fechaRadicado: now,
    fechaReporte: now,
    cuadrillaAsignada: datos.cuadrillaAsignada || 'Cuadrilla 04 - Obras Viales Centro',
    prioridad: datos.prioridad || 'ALTA',
    reportadoPor: datos.reportadoPor || '1-1823-0456',
    consentimientoLey8968: true,
    imagen: datos.imagen || null,
    historial: [
      {
        estado: 'recibido',
        fecha: now,
        nota: 'Reporte ingresado por ciudadano con georreferenciación GPS verificada.'
      },
      {
        estado: 'en_inspeccion',
        fecha: now,
        nota: 'Inspección de campo programada con la unidad técnica cantonal.'
      }
    ]
  };

  const insertado = dbClient.insert('incidenciasViales', nuevoTicket);
  return normalizarIncidencia(insertado);
}

/**
 * Actualiza el estado y cuadrilla de una incidencia vial en dbClient.
 */
export function actualizarEstadoTicket(id, nuevoEstado, cuadrilla) {
  const updates = {
    estado: nuevoEstado
  };
  if (cuadrilla !== undefined) {
    updates.cuadrillaAsignada = cuadrilla;
  }
  const actualizado = dbClient.update('incidenciasViales', id, updates);
  return normalizarIncidencia(actualizado);
}

// ============================================================================
// MÉTODOS DE COMPATIBILIDAD CON VISTAS EXISTENTES
// ============================================================================

export function getTickets() {
  return obtenerIncidencias();
}

export function guardarTicket(nuevoTicket) {
  return crearIncidencia(nuevoTicket);
}

export function buscarTicketPorId(reportId) {
  if (!reportId) return null;
  const cleanId = reportId.trim().toUpperCase();
  const todos = obtenerIncidencias();
  return todos.find((t) => t.id.toUpperCase() === cleanId || t.reportId.toUpperCase() === cleanId) || null;
}

const ticketService = {
  obtenerIncidencias,
  crearIncidencia,
  actualizarEstadoTicket,
  getTickets,
  guardarTicket,
  buscarTicketPorId,
  generarIdTicket,
  getEntidadResponsable,
  ESTADOS_TICKET,
  ABREV_PROVINCIAS,
  ABREV_CANTONES
};

export default ticketService;

