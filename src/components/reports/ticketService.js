/**
 * COSTA RICA UNIDOS — Servicio de Tickets y Trazabilidad Cívica
 * Formato oficial: REP-[PROV]-[CAN]-[AÑO]-[CORRELATIVO]
 * Ejemplo: REP-PUN-ESP-2026-0042
 */

const STORAGE_KEY = 'cr_tickets_incidencias_v1';
const CORRELATIVO_KEY = 'cr_tickets_correlativo_seq';

// Mapa de abreviaturas estandarizadas de 3 letras para Provincias
export const ABREV_PROVINCIAS = {
  1: 'SJO', // San José
  2: 'ALA', // Alajuela
  3: 'CAR', // Cartago
  4: 'HER', // Heredia
  5: 'GUA', // Guanacaste
  6: 'PUN', // Puntarenas
  7: 'LIM'  // Limón
};

// Mapa de abreviaturas estandarizadas para Cantones principales
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

/**
 * Obtiene el siguiente correlativo secuencial
 */
function getNextCorrelativo() {
  try {
    const current = parseInt(localStorage.getItem(CORRELATIVO_KEY) || '42', 10);
    const next = current + 1;
    localStorage.setItem(CORRELATIVO_KEY, next.toString());
    return String(current).padStart(4, '0');
  } catch {
    return '0042';
  }
}

/**
 * Genera el identificador único estandarizado del ticket
 * Formato: REP-[PROV]-[CAN]-[AÑO]-[CORRELATIVO]
 */
export function generarIdTicket(provinciaId, nombreCanton) {
  const provCode = ABREV_PROVINCIAS[provinciaId] || 'SJO';
  const rawCanton = (nombreCanton || 'Central').trim();
  const cantonCode = ABREV_CANTONES[rawCanton] || rawCanton.substring(0, 3).toUpperCase();
  const anio = '2026';
  const correlativo = getNextCorrelativo();

  return `REP-${provCode}-${cantonCode}-${anio}-${correlativo}`;
}

/**
 * Mapeo de estados del flujo de trazabilidad
 */
export const ESTADOS_TICKET = {
  recibido: {
    id: 'recibido',
    step: 1,
    label: 'Recibido',
    color: '#3B82F6', // Azul Cívico
    badgeBg: 'rgba(59, 130, 246, 0.18)',
    descripcion: 'Reporte ingresado al sistema con georreferenciación y evidencia verificada.'
  },
  en_inspeccion: {
    id: 'en_inspeccion',
    step: 2,
    label: 'En Inspección',
    color: '#F59E0B', // Ámbar Alerta
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    descripcion: 'Unidad técnica municipal o del MOPT asignada para verificación física de la avería.'
  },
  en_tramite: {
    id: 'en_tramite',
    step: 3,
    label: 'En Trámite',
    color: '#8B5CF6', // Violeta Soberano
    badgeBg: 'rgba(139, 92, 246, 0.18)',
    descripcion: 'Orden de trabajo girada a cuadrilla operativa con partida presupuestaria aprobada.'
  },
  solucionado: {
    id: 'solucionado',
    step: 4,
    label: 'Solucionado',
    color: '#00D166', // Verde Éxito
    badgeBg: 'rgba(0, 209, 102, 0.18)',
    descripcion: 'Obra concluida satisfactoriamente y fiscalizada con sello de transparencia cívica.'
  }
};

/**
 * Entidades responsables por tipología de daño
 */
export function getEntidadResponsable(categoriaId) {
  switch (categoriaId) {
    case 'hueco_vial':
      return 'Municipalidad Cantonal / MOPT - CONAVI';
    case 'luminaria':
      return 'Compañía Nacional de Fuerza y Luz (CNFL) / ICE';
    case 'fuga_agua':
      return 'Instituto Costarricense de Acueductos y Alcantarillados (AyA) / ASADA';
    case 'basurero':
      return 'Dirección de Gestión Ambiental Municipal / Ministerio de Salud';
    default:
      return 'Gobierno Local Cantonal';
  }
}

/**
 * Tickets de demostración precargados para visualización inicial del Tablero de Trazabilidad
 */
const TICKETS_SEMILLA = [
  {
    reportId: 'REP-PUN-ESP-2026-0042',
    categoria: 'hueco_vial',
    categoriaTitulo: 'Hueco vial / bache en asfalto',
    categoriaIcono: '🕳️',
    provincia: 'Puntarenas',
    provinciaId: 6,
    canton: 'Esparza',
    distrito: 'Espíritu Santo',
    direccionExacta: 'Ruta 131, 200m oeste de la Estación de Bomberos de Esparza, carril derecho.',
    coordenadas: { lat: 9.9942, lng: -84.6685 },
    imagen: {
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      pesoOriginal: '3.4 MB',
      pesoComprimido: '420 KB',
      dimensiones: '1920x1080',
      formato: 'image/webp'
    },
    consentimientoLey8968: true,
    fechaRegistro: '2026-09-24T10:15:00-06:00',
    estado: 'en_tramite',
    entidadResponsable: 'Municipalidad de Esparza / MOPT',
    diasEstimados: '3 días restantes',
    historial: [
      { estado: 'recibido', fecha: '2026-09-24 10:15 CST', nota: 'Reporte ingresado por ciudadano con georreferenciación GPS verificada.' },
      { estado: 'en_inspeccion', fecha: '2026-09-24 14:30 CST', nota: 'Inspector vial constató deformación de carpeta asfáltica de 1.2m de diámetro.' },
      { estado: 'en_tramite', fecha: '2026-09-25 08:00 CST', nota: 'Cuadrilla de bacheo asignada con asfalto en caliente para ejecución diurna.' }
    ]
  },
  {
    reportId: 'REP-SJO-ESC-2026-0038',
    categoria: 'luminaria',
    categoriaTitulo: 'Luminaria pública dañada o apagada',
    categoriaIcono: '💡',
    provincia: 'San José',
    provinciaId: 1,
    canton: 'Escazú',
    distrito: 'San Rafael',
    direccionExacta: 'Avenida 2, Calle 134, frente al Parque Los Laureles, poste número CNFL-8841.',
    coordenadas: { lat: 9.9385, lng: -84.1378 },
    imagen: {
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
      pesoOriginal: '2.8 MB',
      pesoComprimido: '310 KB',
      dimensiones: '1920x1080',
      formato: 'image/webp'
    },
    consentimientoLey8968: true,
    fechaRegistro: '2026-09-23T18:40:00-06:00',
    estado: 'solucionado',
    entidadResponsable: 'Compañía Nacional de Fuerza y Luz (CNFL)',
    diasEstimados: 'Concluido',
    historial: [
      { estado: 'recibido', fecha: '2026-09-23 18:40 CST', nota: 'Reporte registrado por falta de iluminación nocturna en acera peatonal.' },
      { estado: 'en_inspeccion', fecha: '2026-09-24 09:10 CST', nota: 'Técnico de CNFL verificó fotocelda sulfatada y balastro defectuoso.' },
      { estado: 'en_tramite', fecha: '2026-09-24 14:00 CST', nota: 'Sustitución programada con luminaria LED de alta eficiencia 120W.' },
      { estado: 'solucionado', fecha: '2026-09-25 11:20 CST', nota: 'Instalación concluida. Sector plenamente iluminado y verificado.' }
    ]
  },
  {
    reportId: 'REP-ALA-SCA-2026-0051',
    categoria: 'fuga_agua',
    categoriaTitulo: 'Fuga de agua potable / alcantarilla colapsada',
    categoriaIcono: '🚰',
    provincia: 'Alajuela',
    provinciaId: 2,
    canton: 'San Carlos',
    distrito: 'Quesada',
    lat: 10.3235,
    lng: -84.4285,
    direccionExacta: 'Costado norte del Mercado Municipal de Ciudad Quesada, salida de tubería principal.',
    coordenadas: { lat: 10.3235, lng: -84.4285 },
    imagen: {
      url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
      pesoOriginal: '4.1 MB',
      pesoComprimido: '480 KB',
      dimensiones: '1920x1080',
      formato: 'image/webp'
    },
    consentimientoLey8968: true,
    fechaRegistro: '2026-09-25T07:15:00-06:00',
    estado: 'en_inspeccion',
    entidadResponsable: 'AyA - Región Huetar Norte',
    diasEstimados: '2 días restantes',
    historial: [
      { estado: 'recibido', fecha: '2026-09-25 07:15 CST', nota: 'Alerta ciudadana de desperdicio de agua potable sobre vía pública.' },
      { estado: 'en_inspeccion', fecha: '2026-09-25 11:45 CST', nota: 'Técnicos del AyA evaluando presión y punto de corte de válvula.' }
    ]
  }
];

/**
 * Obtiene la lista completa de tickets almacenados localmente
 */
export function getTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(TICKETS_SEMILLA));
      return TICKETS_SEMILLA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : TICKETS_SEMILLA;
  } catch (e) {
    console.warn('[TicketService] Error leyendo localStorage, usando semillas:', e);
    return TICKETS_SEMILLA;
  }
}

/**
 * Guarda un nuevo ticket en localStorage
 */
export function guardarTicket(nuevoTicket) {
  const tickets = getTickets();
  const actualizados = [nuevoTicket, ...tickets];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  } catch (e) {
    console.warn('[TicketService] No se pudo guardar ticket en localStorage:', e);
  }
  return nuevoTicket;
}

/**
 * Busca un ticket por su identificador estandarizado
 */
export function buscarTicketPorId(reportId) {
  if (!reportId) return null;
  const cleanId = reportId.trim().toUpperCase();
  const tickets = getTickets();
  return tickets.find((t) => t.reportId.toUpperCase() === cleanId) || null;
}
