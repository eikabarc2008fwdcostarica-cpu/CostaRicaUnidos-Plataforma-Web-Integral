/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 06: DIRECTORIO DE INFRAESTRUCTURA EDUCATIVA Y CTPS
 * Incluye coordenadas geográficas POI para capas GIS de Eiker
 * ============================================================================
 */

export type NivelEducativo = 'Preescolar' | 'Primaria' | 'Secundaria' | 'CTP' | 'Universidad';

export interface EspecialidadTecnicaCTP {
  id: string;
  nombre: string;
  rama: 'Tecnología' | 'Comercio y Servicios' | 'Industrial' | 'Agropecuaria';
  duracion: string;
  colorTema: string;
  descripcion: string;
}

export interface CentroEducativoPOI {
  id: string;
  codigoMep: string;
  nombre: string;
  nivel: NivelEducativo;
  circuito: string;
  distrito: string;
  canton: string;
  provincia: string;
  direccion: string;
  telefono: string;
  correo: string;
  director: string;
  matriculaAproximada: number;
  esAccesibleLey7600: boolean;
  comedorEstudiantil: boolean;
  laboratorioInformatica: boolean;
  especialidadesCTP?: EspecialidadTecnicaCTP[];
  // Coordenadas oficiales para Leaflet / GeoJSON de Eiker
  lat: number;
  lng: number;
}

export const ESPECIALIDADES_CTP_CATALOGO: Record<string, EspecialidadTecnicaCTP> = {
  software: {
    id: 'esp-software',
    nombre: 'Desarrollo de Software & Web',
    rama: 'Tecnología',
    duracion: '3 años (10° a 12°)',
    colorTema: '#818CF8', // Indigo
    descripcion: 'Programación frontend, bases de datos, APIs y metodologías ágiles de ingeniería de software.'
  },
  ciberseguridad: {
    id: 'esp-ciberseguridad',
    nombre: 'Ciberseguridad y Redes CISCO',
    rama: 'Tecnología',
    duracion: '3 años (10° a 12°)',
    colorTema: '#38BDF8', // Sky blue
    descripcion: 'Infraestructura de telecomunicaciones, servidores cloud y seguridad perimetral de datos.'
  },
  contabilidad: {
    id: 'esp-contabilidad',
    nombre: 'Contabilidad y Finanzas Tributarias',
    rama: 'Comercio y Servicios',
    duracion: '3 años (10° a 12°)',
    colorTema: '#34D399', // Emerald
    descripcion: 'Facturación electrónica Hacienda, auditoría contable, nóminas y costos empresariales.'
  },
  electromecanica: {
    id: 'esp-electromecanica',
    nombre: 'Electromecánica y Robótica Industrial',
    rama: 'Industrial',
    duracion: '3 años (10° a 12°)',
    colorTema: '#FBBF24', // Amber
    descripcion: 'Automatización PLC, circuitos de potencia, mantenimiento electromecánico y neumática.'
  },
  turismo: {
    id: 'esp-turismo',
    nombre: 'Turismo en Sostenibilidad y Hotelería',
    rama: 'Comercio y Servicios',
    duracion: '3 años (10° a 12°)',
    colorTema: '#F472B6', // Pink
    descripcion: 'Guianza eco-turística, dominio del idioma inglés, servicio hotelero y patrimonio cultural.'
  },
  secretariado: {
    id: 'esp-secretariado',
    nombre: 'Secretariado Ejecutivo Bilingüe',
    rama: 'Comercio y Servicios',
    duracion: '3 años (10° a 12°)',
    colorTema: '#A78BFA', // Purple
    descripcion: 'Gestión documental bilingüe, protocolo empresarial, comunicación gerencial y ofimática avanzada.'
  }
};

export const CENTROS_EDUCATIVOS_DATA: CentroEducativoPOI[] = [
  {
    id: 'edu-ctp-1',
    codigoMep: 'MEP-0101-CTP',
    nombre: 'Colegio Técnico Profesional de San Sebastián (CTP San Sebastián)',
    nivel: 'CTP',
    circuito: 'Circuito 02 - DRE San José Central',
    distrito: 'San Sebastián',
    canton: 'San José',
    provincia: 'San José',
    direccion: 'Costado norte de la Iglesia Católica de San Sebastián',
    telefono: '(506) 2227-8899',
    correo: 'ctp.sansebastian@mep.go.cr',
    director: 'MSc. Jorge Méndez Fallas',
    matriculaAproximada: 1250,
    esAccesibleLey7600: true,
    comedorEstudiantil: true,
    laboratorioInformatica: true,
    especialidadesCTP: [
      ESPECIALIDADES_CTP_CATALOGO.software,
      ESPECIALIDADES_CTP_CATALOGO.ciberseguridad,
      ESPECIALIDADES_CTP_CATALOGO.contabilidad
    ],
    lat: 9.9078,
    lng: -84.0831
  },
  {
    id: 'edu-ctp-2',
    codigoMep: 'MEP-0102-CTP',
    nombre: 'Colegio Técnico Profesional de Pavas (CTP Pavas)',
    nivel: 'CTP',
    circuito: 'Circuito 04 - DRE San José Oeste',
    distrito: 'Pavas',
    canton: 'San José',
    provincia: 'San José',
    direccion: 'De la Embajada Americana 800 metros oeste',
    telefono: '(506) 2232-1144',
    correo: 'ctp.pavas@mep.go.cr',
    director: 'Licda. Xinia Castillo Mora',
    matriculaAproximada: 980,
    esAccesibleLey7600: true,
    comedorEstudiantil: true,
    laboratorioInformatica: true,
    especialidadesCTP: [
      ESPECIALIDADES_CTP_CATALOGO.software,
      ESPECIALIDADES_CTP_CATALOGO.electromecanica,
      ESPECIALIDADES_CTP_CATALOGO.secretariado
    ],
    lat: 9.9512,
    lng: -84.1402
  },
  {
    id: 'edu-lic-1',
    codigoMep: 'MEP-0103-LIC',
    nombre: 'Liceo de Costa Rica (Benemérito de la Patria)',
    nivel: 'Secundaria',
    circuito: 'Circuito 01 - DRE San José Central',
    distrito: 'Catedral',
    canton: 'San José',
    provincia: 'San José',
    direccion: 'Avenida 18, Calle 9, frente a Plaza González Víquez',
    telefono: '(506) 2222-2417',
    correo: 'liceodecostarica@mep.go.cr',
    director: 'MSc. Walter Morales Solano',
    matriculaAproximada: 1400,
    esAccesibleLey7600: true,
    comedorEstudiantil: true,
    laboratorioInformatica: true,
    lat: 9.9258,
    lng: -84.0754
  },
  {
    id: 'edu-esc-1',
    codigoMep: 'MEP-0104-ESC',
    nombre: 'Escuela Buenaventura Corrales Bermúdez (Edificio Metálico)',
    nivel: 'Primaria',
    circuito: 'Circuito 01 - DRE San José Central',
    distrito: 'Carmen',
    canton: 'San José',
    provincia: 'San José',
    direccion: 'Frente al Parque Morazán, San José Centro',
    telefono: '(506) 2221-5085',
    correo: 'esc.buenaventuracorrales@mep.go.cr',
    director: 'Licda. Marcela Vargas Araya',
    matriculaAproximada: 850,
    esAccesibleLey7600: true,
    comedorEstudiantil: true,
    laboratorioInformatica: true,
    lat: 9.9366,
    lng: -84.0751
  },
  {
    id: 'edu-knd-1',
    codigoMep: 'MEP-0105-KND',
    nombre: 'Jardín de Niños República de Francia',
    nivel: 'Preescolar',
    circuito: 'Circuito 03 - DRE San José Central',
    distrito: 'San Francisco de Dos Ríos',
    canton: 'San José',
    provincia: 'San José',
    direccion: '200 metros este del Parque Central de San Francisco',
    telefono: '(506) 2226-1022',
    correo: 'kinder.francia@mep.go.cr',
    director: 'MSc. Nuria Chaves Brenes',
    matriculaAproximada: 320,
    esAccesibleLey7600: true,
    comedorEstudiantil: true,
    laboratorioInformatica: false,
    lat: 9.9142,
    lng: -84.0521
  },
  {
    id: 'edu-uni-1',
    codigoMep: 'CONESUP-UCR',
    nombre: 'Universidad de Costa Rica (Sede Central Rodrigo Facio)',
    nivel: 'Universidad',
    circuito: 'Educación Superior Pública',
    distrito: 'San Pedro (Límite Cantonal)',
    canton: 'Montes de Oca / San José',
    provincia: 'San José',
    direccion: 'San Pedro de Montes de Oca',
    telefono: '(506) 2511-0000',
    correo: 'contacto@ucr.ac.cr',
    director: 'Dr. Gustavo Gutiérrez Espeleta (Rector)',
    matriculaAproximada: 42000,
    esAccesibleLey7600: true,
    comedorEstudiantil: true,
    laboratorioInformatica: true,
    lat: 9.9372,
    lng: -84.0505
  }
];

/**
 * Exportador de dataset geoespacial POI para que Eiker lo consuma directamente en Leaflet/MapLibre
 */
export function getGeoJsonEscuelasPOI() {
  return {
    type: 'FeatureCollection',
    features: CENTROS_EDUCATIVOS_DATA.map((centro) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [centro.lng, centro.lat]
      },
      properties: {
        id: centro.id,
        nombre: centro.nombre,
        nivel: centro.nivel,
        distrito: centro.distrito,
        telefono: centro.telefono,
        esAccesibleLey7600: centro.esAccesibleLey7600,
        especialidades: centro.especialidadesCTP?.map((e) => e.nombre) || []
      }
    }))
  };
}
