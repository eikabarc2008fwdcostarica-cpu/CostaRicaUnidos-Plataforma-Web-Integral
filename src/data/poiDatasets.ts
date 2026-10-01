/**
 * ============================================================================
 * COSTA RICA UNIDOS — CONSOLIDACIÓN DE DATASETS POI
 * Puntos de Interés Unificados: Educación, Comercio, Turismo y Deportes
 * ============================================================================
 * 
 * Este módulo unifica las coordenadas geográficas y metadatos de los puntos de interés
 * desarrollados por Alanie para su inyección directa en las capas vectoriales y ráster
 * de Leaflet / MapLibre / Deck.gl a cargo de Eiker.
 */

import { CENTROS_EDUCATIVOS_DATA } from './educacionData';
import { PYMES_CANTONALES_DATA } from './comercioData';
import { DESTINOS_TURISTICOS_DATA } from './turismoData';
import { INSTALACIONES_DEPORTIVAS_DATA } from './deportesData';

export type POICategory =
  | 'Educación'
  | 'Comercio y PyMEs'
  | 'Turismo y Aventura'
  | 'Deportes y Recreación';

export interface POIDetails {
  distrito: string;
  canton: string;
  provincia?: string;
  direccion?: string;
  telefono?: string;
  descripcion?: string;
  horario?: string;
  esAccesibleLey7600?: boolean;
  requiere4x4?: boolean;
  verificadoHacienda?: boolean;
  subcategoria?: string;
  metadataExtra?: Record<string, any>;
}

export interface CantonalPOI {
  id: string;
  name: string;
  category: POICategory;
  lat: number;
  lng: number;
  details: POIDetails;
}

// 1. POIs de Educación e Infraestructura CTP
export const POIS_EDUCACION: CantonalPOI[] = CENTROS_EDUCATIVOS_DATA.map((col) => ({
  id: col.id,
  name: col.nombre,
  category: 'Educación',
  lat: col.lat,
  lng: col.lng,
  details: {
    distrito: col.distrito,
    canton: col.canton,
    provincia: col.provincia,
    direccion: col.direccion,
    telefono: col.telefono,
    descripcion: `Código MEP: ${col.codigoMep} • Nivel: ${col.nivel} • Matrícula estimada: ${col.matriculaAproximada}`,
    esAccesibleLey7600: col.esAccesibleLey7600,
    subcategoria: col.nivel,
    metadataExtra: {
      codigoMep: col.codigoMep,
      director: col.director,
      comedorEstudiantil: col.comedorEstudiantil,
      laboratorioInformatica: col.laboratorioInformatica,
      especialidadesCount: col.especialidadesCTP ? col.especialidadesCTP.length : 0
    }
  }
}));

// 2. POIs de Comercio, Emprendimientos y PyMEs
export const POIS_COMERCIO: CantonalPOI[] = PYMES_CANTONALES_DATA.map((com) => ({
  id: com.id,
  name: com.nombreComercial,
  category: 'Comercio y PyMEs',
  lat: com.lat,
  lng: com.lng,
  details: {
    distrito: com.distrito,
    canton: 'San José',
    direccion: com.direccionExacta,
    telefono: com.telefono,
    descripcion: com.descripcion,
    horario: com.horario,
    verificadoHacienda: com.esVerificadoHacienda,
    subcategoria: com.categoria,
    metadataExtra: {
      razonSocial: com.razonSocial,
      cedula: com.cedulaJuridicaOFisica,
      regimenHacienda: com.regimenTributarioHacienda,
      aceptaSinpe: com.aceptaSinpeMovil,
      whatsapp: com.whatsappNumero
    }
  }
}));

// 3. POIs de Turismo y Aventura Sostenible
export const POIS_TURISMO: CantonalPOI[] = DESTINOS_TURISTICOS_DATA.map((tur) => ({
  id: tur.id,
  name: tur.nombre,
  category: 'Turismo y Aventura',
  lat: tur.lat,
  lng: tur.lng,
  details: {
    distrito: tur.distrito,
    canton: tur.canton,
    provincia: tur.provincia,
    descripcion: tur.descripcion,
    horario: tur.horario,
    esAccesibleLey7600: tur.badgesAccesibilidad.includes('ley-7600'),
    requiere4x4: tur.requiere4x4,
    subcategoria: tur.categoria,
    metadataExtra: {
      tarifa: tur.tarifaEntrada,
      tiempoRecomendado: tur.tiempoVisitaRecomendado,
      elevacionMsnm: tur.elevacionMsnm,
      badges: tur.badgesAccesibilidad
    }
  }
}));

// 4. POIs de Deportes y Recreación CCDR
export const POIS_DEPORTES: CantonalPOI[] = INSTALACIONES_DEPORTIVAS_DATA.map((dep) => ({
  id: dep.id,
  name: dep.nombre,
  category: 'Deportes y Recreación',
  lat: dep.coordenadas.lat,
  lng: dep.coordenadas.lng,
  details: {
    distrito: dep.distrito,
    canton: 'San José',
    direccion: dep.direccionReferencia,
    descripcion: dep.descripcion,
    horario: dep.horarioAtencion,
    esAccesibleLey7600: dep.accesibilidadLey7600,
    subcategoria: dep.tipoInstalacion,
    metadataExtra: {
      estadoOperativo: dep.estadoOperativo,
      aforoMaximo: dep.aforoMaximo,
      tarifaHoraColones: dep.tarifaHoraColones
    }
  }
}));

// Consolidación de todos los puntos cantonales
export const ALL_CANTONAL_POIS: CantonalPOI[] = [
  ...POIS_EDUCACION,
  ...POIS_COMERCIO,
  ...POIS_TURISMO,
  ...POIS_DEPORTES
];

/**
 * Obtiene POIs filtrados por categoría para capas individuales de Leaflet/MapLibre
 */
export function getPOIsByCategory(category: POICategory): CantonalPOI[] {
  return ALL_CANTONAL_POIS.filter((poi) => poi.category === category);
}

/**
 * Obtiene POIs filtrados por distrito cantonal
 */
export function getPOIsByDistrito(distrito: string): CantonalPOI[] {
  const norm = distrito.trim().toLowerCase();
  return ALL_CANTONAL_POIS.filter(
    (poi) => poi.details.distrito.toLowerCase() === norm
  );
}

/**
 * Exportador estándar a GeoJSON FeatureCollection para el visor GIS de Eiker
 */
export function toGeoJSONFeatureCollection(pois: CantonalPOI[] = ALL_CANTONAL_POIS) {
  return {
    type: 'FeatureCollection',
    metadata: {
      generatedBy: 'Costa Rica Unidos - Alanie Modules',
      count: pois.length,
      timestamp: new Date().toISOString()
    },
    features: pois.map((poi) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [poi.lng, poi.lat]
      },
      properties: {
        id: poi.id,
        name: poi.name,
        category: poi.category,
        ...poi.details
      }
    }))
  };
}
