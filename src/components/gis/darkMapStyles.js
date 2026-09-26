/**
 * COSTA RICA UNIDOS — Estilo Visual Oscuro "Obsidiana Cartográfica"
 * Sistema de Diseño Sovereign Civic Glass v2.1
 * Diseñado con fondo Obsidiana #00040D, aguas Azul Soberano y alto contraste WCAG.
 */

export const OBSIDIANA_CARTOGRAFICA_STYLES = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#000714' }]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#00040D' }, { weight: 3 }]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#E2E8F0' }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#002B7F' }, { weight: 1.5 }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#79a6ff' }, { weight: 2 }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#CE1126' }, { weight: 1.8 }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94A3B8' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#001D10' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00D166' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#0A1733' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#00081C' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94A3B8' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#002B7F' }, { weight: 1.2 }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#001440' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#CBD5E1' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#79a6ff' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#00122E' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5588DD' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#00040D' }]
  }
];

/**
 * Coordenadas de Geofencing Soberano Estricto de Costa Rica
 * Incluye todo el territorio continental, zona económica exclusiva marítima y la Isla del Coco.
 */
export const GEOFENCING_COSTA_RICA = {
  north: 11.25,  // Frontera norte Peñas Blancas / Río San Juan
  south: 5.45,   // Aguas territoriales al sur de la Isla del Coco (5.53° N)
  west: -87.15,  // Al oeste de la Isla del Coco (-87.05° W)
  east: -82.50   // Frontera este Sixola / Caribe Sur
};

/**
 * Centro geográfico inicial de Costa Rica
 */
export const CENTRO_COSTA_RICA = {
  lat: 9.7489,
  lng: -83.7534
};
