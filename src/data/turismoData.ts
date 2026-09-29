/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 09: GUÍA DE TURISMO CANTONAL Y AVENTURA SOSTENIBLE
 * Incluye destinos accesibles (Ley 7600), rutas 4x4, pet-friendly y POIs GIS para Eiker
 * ============================================================================
 */

import { AccessibilityBadgeType } from '../components/common/AccessibilityBadge';

export interface DestinoTuristicoPOI {
  id: string;
  nombre: string;
  categoria: 'Naturaleza y Parques' | 'Cultura e Historia' | 'Aventura y Senderismo' | 'Miradores y Paisajismo';
  distrito: string;
  canton: string;
  provincia: string;
  descripcion: string;
  tarifaEntrada: string;
  horario: string;
  badgesAccesibilidad: AccessibilityBadgeType[];
  tiempoVisitaRecomendado: string;
  elevacionMsnm: number;
  requiere4x4: boolean;
  imagenes: string[];
  lat: number;
  lng: number;
}

export interface ParadaItinerario {
  horaSugerida: string;
  titulo: string;
  lugar: string;
  descripcion: string;
  tipo: 'desayuno' | 'actividad' | 'almuerzo' | 'cultural' | 'mirador' | 'cena';
  badges: AccessibilityBadgeType[];
  lat: number;
  lng: number;
}

export interface RutaPreconfigurada {
  id: string;
  titulo: string;
  duracion: '1 Día' | '2 Días';
  dificultad: 'Baja (Universal Ley 7600)' | 'Media (Vehículo 4x2)' | 'Alta (Exige 4x4)';
  descripcion: string;
  elevacionMaxima: string;
  paradas: ParadaItinerario[];
  imagenPortada: string;
}

export const DESTINOS_TURISTICOS_DATA: DestinoTuristicoPOI[] = [
  {
    id: 'tur-1',
    nombre: 'Parque Metropolitano La Sabana & Museo de Arte Costarricense',
    categoria: 'Naturaleza y Parques',
    distrito: 'Mata Redonda',
    canton: 'San José',
    provincia: 'San José',
    descripcion: 'El pulmón de la capital. 72 hectáreas de áreas verdes, lago artificial, pistas para trote y el histórico edificio del antiguo aeropuerto hoy transformado en Museo de Arte.',
    tarifaEntrada: 'Entrada Gratuita Universal',
    horario: 'Todos los días: 05:00 - 22:00 hrs',
    badgesAccesibilidad: ['ley-7600', 'pet-friendly'],
    tiempoVisitaRecomendado: '3 a 4 horas',
    elevacionMsnm: 1140,
    requiere4x4: false,
    imagenes: [
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    lat: 9.9348,
    lng: -84.1017
  },
  {
    id: 'tur-2',
    nombre: 'Mirador de los Cerros del Sur y Bosque Nuboso',
    categoria: 'Aventura y Senderismo',
    distrito: 'San Antonio / Tarbaca',
    canton: 'San José / Aserrí',
    provincia: 'San José',
    descripcion: 'Punto panorámico sobre el Valle Central a más de 1,800 msnm con senderos montañosos, avistamiento de aves y restaurantes típicos de comida campesina a la leña.',
    tarifaEntrada: '₡ 2,500 nacionales / $8 extranjeros',
    horario: 'Jueves a Domingo: 07:00 - 18:30 hrs',
    badgesAccesibilidad: ['acceso-4x4', 'pet-friendly'],
    tiempoVisitaRecomendado: 'Medio día',
    elevacionMsnm: 1850,
    requiere4x4: true,
    imagenes: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    lat: 9.8512,
    lng: -84.0924
  },
  {
    id: 'tur-3',
    nombre: 'Barrio Amón y Casco Histórico Cafetalero',
    categoria: 'Cultura e Historia',
    distrito: 'Carmen',
    canton: 'San José',
    provincia: 'San José',
    descripcion: 'Recorrido arquitectónico entre mansiones señoriales victorianas y neoclásicas construidas por los barones del café a finales del siglo XIX, con galerías de arte y cafés de especialidad.',
    tarifaEntrada: 'Recorrido peatonal libre',
    horario: 'Todo el día (Mejor de 09:00 a 19:00)',
    badgesAccesibilidad: ['ley-7600', 'pet-friendly'],
    tiempoVisitaRecomendado: '2 a 3 horas',
    elevacionMsnm: 1160,
    requiere4x4: false,
    imagenes: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    lat: 9.9385,
    lng: -84.0758
  }
];

export const RUTAS_PRECONFIGURADAS_DATA: RutaPreconfigurada[] = [
  {
    id: 'ruta-1dia-urbana',
    titulo: 'Ruta 1 Día: Tesoros Capitalinos, Café y Patrimonio (Ley 7600)',
    duracion: '1 Día',
    dificultad: 'Baja (Universal Ley 7600)',
    descripcion: 'Diseñada 100% con aceras anchas, rampas certificadas y transporte público adaptado para descubrir la arquitectura y cultura central.',
    elevacionMaxima: '1,160 msnm (Pendiente media 3%)',
    imagenPortada: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    paradas: [
      {
        horaSugerida: '08:30 AM',
        titulo: 'Desayuno Típico en el Mercado Central',
        lugar: 'Soda Tala, Mercado Central',
        descripcion: 'Gallo pinto tradicional con natilla casera, café chorreado y tortilla palmeada.',
        tipo: 'desayuno',
        badges: ['ley-7600'],
        lat: 9.9341,
        lng: -84.0812
      },
      {
        horaSugerida: '10:30 AM',
        titulo: 'Visita al Teatro Nacional de Costa Rica',
        lugar: 'Avenida Segunda, Plaza Juan Mora Fernández',
        descripcion: 'Visita guiada accesible por el foyer de mármol de Carrara y el plafón de la Alegoría del Café.',
        tipo: 'cultural',
        badges: ['ley-7600'],
        lat: 9.9331,
        lng: -84.0772
      },
      {
        horaSugerida: '02:00 PM',
        titulo: 'Museo de Arte Costarricense y Paseo La Sabana',
        lugar: 'Parque La Sabana',
        descripcion: 'Salón Dorado con relieve escultórico de la historia patria y senderos planos.',
        tipo: 'actividad',
        badges: ['ley-7600', 'pet-friendly'],
        lat: 9.9348,
        lng: -84.1017
      }
    ]
  },
  {
    id: 'ruta-2dias-aventura',
    titulo: 'Ruta 2 Días: Alta Montaña, Bosque Nuboso y Miradores 4x4',
    duracion: '2 Días',
    dificultad: 'Alta (Exige 4x4)',
    descripcion: 'Ascenso desafiante por los cerros que rodean la cuenca sur, cruzando caminos de lastre y disfrutando de vistas a ambos mares.',
    elevacionMaxima: '2,150 msnm (Pendiente máxima 24%)',
    imagenPortada: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    paradas: [
      {
        horaSugerida: 'Día 1 - 07:00 AM',
        titulo: 'Inicio de Travesía 4x4 hacia Tarbaca',
        lugar: 'Salida de Desamparados hacia las montañas',
        descripcion: 'Verificación de tracción en las cuatro ruedas antes del ascenso pronunciado.',
        tipo: 'actividad',
        badges: ['acceso-4x4'],
        lat: 9.8821,
        lng: -84.0612
      },
      {
        horaSugerida: 'Día 1 - 12:30 PM',
        titulo: 'Almuerzo Campesino con Vista Panorámica',
        lugar: 'Mirador Ram Luna',
        descripcion: 'Olla de carne servida en vajilla de barro artesanal con vista a los tres volcanes.',
        tipo: 'almuerzo',
        badges: ['acceso-4x4', 'pet-friendly'],
        lat: 9.8512,
        lng: -84.0924
      },
      {
        horaSugerida: 'Día 2 - 08:30 AM',
        titulo: 'Senderismo de Bosque Nuboso y Cascadas',
        lugar: 'Zona Protectora Cerros de Escazú',
        descripcion: 'Caminata entre robles centenarios, orquídeas silvestres y quebradas de montaña.',
        tipo: 'actividad',
        badges: ['acceso-4x4', 'pet-friendly'],
        lat: 9.8712,
        lng: -84.1421
      }
    ]
  }
];

export function getGeoJsonTurismoPOI() {
  return {
    type: 'FeatureCollection',
    features: DESTINOS_TURISTICOS_DATA.map((dest) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [dest.lng, dest.lat]
      },
      properties: {
        id: dest.id,
        nombre: dest.nombre,
        categoria: dest.categoria,
        distrito: dest.distrito,
        elevacionMsnm: dest.elevacionMsnm,
        requiere4x4: dest.requiere4x4,
        badges: dest.badgesAccesibilidad
      }
    }))
  };
}
