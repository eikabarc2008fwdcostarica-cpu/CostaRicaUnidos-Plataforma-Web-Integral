/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 09: GUÍA DE TURISMO CANTONAL Y AVENTURA SOSTENIBLE
 * Incluye destinos costarricenses auténticos en alta resolución, accesibilidad
 * Ley 7600, tracción requerida (Automóvil bajo / 4x4 / Senderismo), pet-friendly,
 * parqueo y POIs GIS.
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
    id: 'tur-manuel-antonio',
    nombre: 'Parque Nacional Manuel Antonio',
    categoria: 'Naturaleza y Parques',
    distrito: 'Manuel Antonio',
    canton: 'Quepos',
    provincia: 'Puntarenas',
    descripcion: 'Reconocido mundialmente por la exuberante convergencia entre selva tropical costera y paradisíacas playas de arena blanca del Pacífico. Dispone de pasarelas elevadas de madera 100% accesibles según Ley 7600 hacia Playa Espadilla Sur, con avistamiento de perezosos, monos cariblancos y tucanes.',
    tarifaEntrada: '₡ 1,808 nacionales / $18.08 extranjeros (Reserva SINAC)',
    horario: 'Miércoles a Lunes: 07:00 - 15:00 hrs (Martes cerrado)',
    badgesAccesibilidad: ['ley-7600', 'automovil-bajo', 'parqueo-disponible'],
    tiempoVisitaRecomendado: '4 a 6 horas',
    elevacionMsnm: 15,
    requiere4x4: false,
    imagenes: [
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    lat: 9.3892,
    lng: -84.1419
  },
  {
    id: 'tur-volcan-poas-irazu',
    nombre: 'Volcán Poás / Mirador del Cráter Principal',
    categoria: 'Miradores y Paisajismo',
    distrito: 'Sabana Redonda',
    canton: 'Poás',
    provincia: 'Alajuela',
    descripcion: 'Estratovolcán activo imponente con uno de los cráteres más anchos del planeta y una laguna ácida hipertermal color turquesa. Sendero pavimentado universal de 600 metros con pendientes inferiores al 5%, barandas de seguridad, centro de visitantes con auditorio y servicios sanitarios certificados Ley 7600.',
    tarifaEntrada: '₡ 1,130 nacionales / $15 extranjeros (Vía SINAC)',
    horario: 'Lunes a Domingo: 08:00 - 15:30 hrs',
    badgesAccesibilidad: ['ley-7600', 'automovil-bajo', 'parqueo-disponible'],
    tiempoVisitaRecomendado: '2 a 3 horas',
    elevacionMsnm: 2708,
    requiere4x4: false,
    imagenes: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    lat: 10.1981,
    lng: -84.2308
  },
  {
    id: 'tur-bosque-monteverde',
    nombre: 'Bosque Nuboso de Monteverde & Puentes Colgantes',
    categoria: 'Aventura y Senderismo',
    distrito: 'Santa Elena',
    canton: 'Monteverde',
    provincia: 'Puntarenas',
    descripcion: 'Santuario de biodiversidad global en la Cordillera de Tilarán. Red de senderos inmersivos y puentes colgantes suspendidos sobre el dosel de la neblina perpetua. Hogar del resplandeciente quetzal, epífitas y orquídeas autóctonas. Acceso por caminos de montaña donde se recomienda vehículo alto o tracción 4x4.',
    tarifaEntrada: '₡ 4,500 nacionales / $26 extranjeros',
    horario: 'Lunes a Domingo: 07:00 - 16:00 hrs',
    badgesAccesibilidad: ['acceso-4x4', 'senderismo', 'pet-friendly'],
    tiempoVisitaRecomendado: 'Día completo',
    elevacionMsnm: 1440,
    requiere4x4: true,
    imagenes: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    lat: 10.3023,
    lng: -84.7963
  },
  {
    id: 'tur-parque-cahuita',
    nombre: 'Parque Nacional Cahuita & Arrecife Coralino',
    categoria: 'Naturaleza y Parques',
    distrito: 'Cahuita',
    canton: 'Talamanca',
    provincia: 'Limón',
    descripcion: 'Joyel caribeño de aguas cálidas cristalinas y arrecife coralino vivo protegido. Cuenta con una extensa pasarela de madera elevada y senderos litorales planos sombreados por cocoteros y almendros, ideales para caminatas familiares, avistamiento de monos congos, perezosos y convivencia comunitaria caribeña.',
    tarifaEntrada: 'Aporte voluntario (Sector Playa Blanca) / $5.65 (Sector Puerto Vargas)',
    horario: 'Lunes a Domingo: 08:00 - 16:00 hrs',
    badgesAccesibilidad: ['ley-7600', 'automovil-bajo', 'senderismo', 'pet-friendly'],
    tiempoVisitaRecomendado: '4 a 5 horas',
    elevacionMsnm: 5,
    requiere4x4: false,
    imagenes: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80'
    ],
    lat: 9.7369,
    lng: -82.8427
  },
  {
    id: 'tur-catarata-la-fortuna',
    nombre: 'Catarata La Fortuna & Bosque Lluvioso',
    categoria: 'Aventura y Senderismo',
    distrito: 'La Fortuna',
    canton: 'San Carlos',
    provincia: 'Alajuela',
    descripcion: 'Majestuosa caída de agua cristalina de 70 metros alimentada por el Río Fortuna al pie del Cerro Chato. Mirador panorámico superior 100% accesible en silla de ruedas según Ley 7600 y sendero rústico de 530 escalones con barandas continuas hacia la poza natural para senderistas.',
    tarifaEntrada: '₡ 4,950 nacionales / $18 extranjeros (ADIFORT)',
    horario: 'Lunes a Domingo: 07:00 - 17:00 hrs',
    badgesAccesibilidad: ['automovil-bajo', 'senderismo', 'parqueo-disponible'],
    tiempoVisitaRecomendado: '3 a 4 horas',
    elevacionMsnm: 520,
    requiere4x4: false,
    imagenes: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    lat: 10.4552,
    lng: -84.6749
  },
  {
    id: 'tur-parque-la-sabana',
    nombre: 'Parque Metropolitano La Sabana & Museo de Arte',
    categoria: 'Cultura e Historia',
    distrito: 'Mata Redonda',
    canton: 'San José',
    provincia: 'San José',
    descripcion: 'El pulmón de la capital. 72 hectáreas de áreas verdes protegidas, lago artificial, ciclo-vías continuas y el emblemático edificio neoclásico del antiguo aeropuerto internacional convertido en Museo de Arte Costarricense con rampas de acceso universales.',
    tarifaEntrada: 'Entrada Gratuita Universal',
    horario: 'Lunes a Domingo: 05:00 - 22:00 hrs',
    badgesAccesibilidad: ['ley-7600', 'automovil-bajo', 'pet-friendly', 'parqueo-disponible'],
    tiempoVisitaRecomendado: '2 a 3 horas',
    elevacionMsnm: 1140,
    requiere4x4: false,
    imagenes: [
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80'
    ],
    lat: 9.9348,
    lng: -84.1017
  }
];

export const RUTAS_PRECONFIGURADAS_DATA: RutaPreconfigurada[] = [
  {
    id: 'ruta-1dia-urbana',
    titulo: 'Ruta 1 Día: Tesoros Patrimoniales, Café de Altura y Parques (Ley 7600)',
    duracion: '1 Día',
    dificultad: 'Baja (Universal Ley 7600)',
    descripcion: 'Diseñada 100% con aceras anchas, rampas certificadas y transporte público adaptado para descubrir la arquitectura y cultura central.',
    elevacionMaxima: '1,160 msnm (Pendiente media 3%)',
    imagenPortada: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80',
    paradas: [
      {
        horaSugerida: '08:30 AM',
        titulo: 'Desayuno Típico en el Mercado Central',
        lugar: 'Soda Tala, Mercado Central',
        descripcion: 'Gallo pinto tradicional con natilla casera, café chorreado y tortilla palmeada.',
        tipo: 'desayuno',
        badges: ['ley-7600', 'automovil-bajo'],
        lat: 9.9341,
        lng: -84.0812
      },
      {
        horaSugerida: '10:30 AM',
        titulo: 'Visita al Teatro Nacional de Costa Rica',
        lugar: 'Avenida Segunda, Plaza Juan Mora Fernández',
        descripcion: 'Visita guiada accesible por el foyer de mármol de Carrara y el plafón de la Alegoría del Café.',
        tipo: 'cultural',
        badges: ['ley-7600', 'automovil-bajo'],
        lat: 9.9331,
        lng: -84.0772
      },
      {
        horaSugerida: '02:00 PM',
        titulo: 'Museo de Arte Costarricense y Paseo La Sabana',
        lugar: 'Parque La Sabana',
        descripcion: 'Salón Dorado con relieve escultórico de la historia patria y senderos planos.',
        tipo: 'actividad',
        badges: ['ley-7600', 'pet-friendly', 'parqueo-disponible'],
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
    descripcion: 'Ascenso desafiante por los cerros que rodean la cordillera, cruzando caminos de lastre y disfrutando de vistas a ambos mares.',
    elevacionMaxima: '2,150 msnm (Pendiente máxima 24%)',
    imagenPortada: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    paradas: [
      {
        horaSugerida: 'Día 1 - 07:00 AM',
        titulo: 'Inicio de Travesía 4x4 hacia Tarbaca y Cerros de Escazú',
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
        badges: ['acceso-4x4', 'pet-friendly', 'parqueo-disponible'],
        lat: 9.8512,
        lng: -84.0924
      },
      {
        horaSugerida: 'Día 2 - 08:30 AM',
        titulo: 'Senderismo de Bosque Nuboso y Cascadas',
        lugar: 'Reserva Monteverde / Cerros del Sur',
        descripcion: 'Caminata entre robles centenarios, orquídeas silvestres y quebradas de montaña.',
        tipo: 'actividad',
        badges: ['acceso-4x4', 'senderismo', 'pet-friendly'],
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
        canton: dest.canton,
        distrito: dest.distrito,
        elevacionMsnm: dest.elevacionMsnm,
        requiere4x4: dest.requiere4x4,
        badges: dest.badgesAccesibilidad
      }
    }))
  };
}
