/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 11: PARTICIPACIÓN CIUDADANA Y PRESUPUESTO PARTICIPATIVO
 * Sistema de votación con blindaje antifraude y buzón de audiencias
 * ============================================================================
 */

export interface ProyectoVecinal {
  id: string;
  titulo: string;
  distrito: string;
  categoria: 'Infraestructura & Aceras' | 'Espacios Verdes y Parques' | 'Seguridad y Movilidad' | 'Cultura y Juventud';
  descripcion: string;
  presupuestoEstimadoColones: number;
  presupuestoFormateado: string;
  votosAcumulados: number;
  estadoVotacion: 'Votación Abierta' | 'En Ejecución' | 'Aprobado';
  proponenteComunal: string;
  beneficiariosEstimados: string;
  fechaCierre: string;
}

export interface SolicitudAudienciaConcejo {
  id: string;
  cedulaCiudadano: string;
  nombreCompleto: string;
  distrito: string;
  motivoAudiencia: string;
  tipoAsunto: 'Obra Pública' | 'Seguridad Comunal' | 'Patentes y Comercio' | 'Medio Ambiente';
  documentosAdjuntosCount: number;
  fechaSolicitud: string;
  estado: 'Pendiente de Revisión' | 'En Agenda del Concejo' | 'Audiencia Concedida';
}

export const PROYECTOS_VECINALES_DATA: ProyectoVecinal[] = [
  {
    id: 'proj-1',
    titulo: 'Red de Aceras y Rampas Universales Ley 7600 en Barrio Luján',
    distrito: 'Catedral',
    categoria: 'Infraestructura & Aceras',
    descripcion: 'Construcción y nivelación de 2.4 kilómetros de aceras continuas con baldosas podotáctiles y rebajes de cordón accesibles para personas mayores y en silla de ruedas.',
    presupuestoEstimadoColones: 85000000,
    presupuestoFormateado: '₡ 85,000,000',
    votosAcumulados: 482,
    estadoVotacion: 'Votación Abierta',
    proponenteComunal: 'Asociación de Desarrollo Integral de Barrio Luján',
    beneficiariosEstimados: '14,500 vecinos',
    fechaCierre: '15 de Noviembre, 2026'
  },
  {
    id: 'proj-2',
    titulo: 'Parque Canino y Sendero Recreativo Iluminado en Hatillo 4',
    distrito: 'Hatillo',
    categoria: 'Espacios Verdes y Parques',
    descripcion: 'Transformación de un lote baldío en un parque recreativo con iluminación solar LED nocturna, juegos de agilidad para mascotas y bebederos para fauna urbana.',
    presupuestoEstimadoColones: 42000000,
    presupuestoFormateado: '₡ 42,000,000',
    votosAcumulados: 395,
    estadoVotacion: 'Votación Abierta',
    proponenteComunal: 'Colectivo Juvenil Hatillo Sostenible',
    beneficiariosEstimados: '8,200 vecinos',
    fechaCierre: '15 de Noviembre, 2026'
  },
  {
    id: 'proj-3',
    titulo: 'Cámaras de Vigilancia Comunitaria Conectadas al 911 en Pavas',
    distrito: 'Pavas',
    categoria: 'Seguridad y Movilidad',
    descripcion: 'Instalación de 16 domos de videovigilancia de alta definición con enlace de fibra óptica a la Central de Monitoreo de la Policía Municipal y Fuerza Pública.',
    presupuestoEstimadoColones: 120000000,
    presupuestoFormateado: '₡ 120,000,000',
    votosAcumulados: 614,
    estadoVotacion: 'Votación Abierta',
    proponenteComunal: 'Comité de Seguridad Vecinal Pavas Centro',
    beneficiariosEstimados: '25,000 residentes',
    fechaCierre: '15 de Noviembre, 2026'
  },
  {
    id: 'proj-4',
    titulo: 'Centro Comunitario de Robótica y Empleabilidad Juvenil',
    distrito: 'San Sebastián',
    categoria: 'Cultura y Juventud',
    descripcion: 'Equipamiento de un laboratorio con impresoras 3D, kits de robótica educativa y cursos de certificación en programación en alianza con los CTP del cantón.',
    presupuestoEstimadoColones: 60000000,
    presupuestoFormateado: '₡ 60,000,000',
    votosAcumulados: 310,
    estadoVotacion: 'Votación Abierta',
    proponenteComunal: 'Comité Cantonal de la Persona Joven (CCPJ)',
    beneficiariosEstimados: '3,800 jóvenes',
    fechaCierre: '15 de Noviembre, 2026'
  }
];

// Registro en memoria de cédulas que ya votaron (Blindaje Antifraude estricto)
export const VOTOS_REGISTRADOS_CEDULAS = new Set<string>([
  '101110222',
  '102220333'
]);
