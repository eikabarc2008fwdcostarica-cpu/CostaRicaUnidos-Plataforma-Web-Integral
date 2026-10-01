/**
 * COSTA RICA UNIDOS — Motor de IA Contextual & Búsqueda Semántica Geoespacial
 * Rol: Eiker (AI Engineer & Geospatial NLP Specialist)
 *
 * Procesa lenguaje natural costarricense sin necesidad de activar filtros manuales.
 * Extrae:
 *  1. Entidad Geográfica (Cantón, Distrito, Provincia)
 *  2. Entidad Temática (Capas: Salud/Ebais, Educación/CTP, Albergues CNE, Recreación/CCDR, Transporte)
 *  3. Genera telemetría de cámara 3D (fly-to con inclinación 45°-60°), filtro de capas y feedback sonoro/visual.
 */

import { GIS_POI_DATA, GIS_LAYERS_CONFIG } from '../components/gis/gisLayersData.js';
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../data/costaRicaTerritorialData.js';

// 1. Diccionario de Coordenadas Geográficas de Cantones y Distritos Clave
const DICCIONARIO_GEOGRAFICO = {
  // Cantones representativos y capitales
  'san carlos': {
    nombre: 'San Carlos',
    tipo: 'canton',
    provincia: 'Alajuela',
    lat: 10.3340,
    lng: -84.4380,
    zoom: 12.8,
    tilt: 55,
    heading: 45,
    descripcion: 'Polo agropecuario de la Zona Norte y cuenca del Río San Carlos.'
  },
  'puntarenas': {
    nombre: 'Puntarenas',
    tipo: 'canton',
    provincia: 'Puntarenas',
    lat: 9.9760,
    lng: -84.8320,
    zoom: 13.2,
    tilt: 55,
    heading: 270,
    descripcion: 'Península y puerto histórico del Pacífico Central.'
  },
  'puntarenas centro': {
    nombre: 'Puntarenas Centro',
    tipo: 'distrito',
    provincia: 'Puntarenas',
    lat: 9.9760,
    lng: -84.8320,
    zoom: 13.5,
    tilt: 55,
    heading: 270,
    descripcion: 'Casco central porteño, Barrio El Carmen y Paseo de los Turistas.'
  },
  'alajuela': {
    nombre: 'Alajuela',
    tipo: 'canton',
    provincia: 'Alajuela',
    lat: 10.0160,
    lng: -84.2140,
    zoom: 13.5,
    tilt: 50,
    heading: 0,
    descripcion: 'Ciudad de los Mangos, eje logístico y pórtico aéreo internacional.'
  },
  'limon': {
    nombre: 'Limón',
    tipo: 'canton',
    provincia: 'Limón',
    lat: 9.9930,
    lng: -83.0330,
    zoom: 13.0,
    tilt: 50,
    heading: 315,
    descripcion: 'Puerto Caribeño, terminales portuarias y riqueza multicultural.'
  },
  'puerto limon': {
    nombre: 'Puerto Limón',
    tipo: 'distrito',
    provincia: 'Limón',
    lat: 9.9930,
    lng: -83.0330,
    zoom: 13.2,
    tilt: 50,
    heading: 315,
    descripcion: 'Bahía portuaria, malecón caribeño y parque Vargas.'
  },
  'san jose': {
    nombre: 'San José',
    tipo: 'canton',
    provincia: 'San José',
    lat: 9.9333,
    lng: -84.0833,
    zoom: 13.2,
    tilt: 55,
    heading: 45,
    descripcion: 'Capital Soberana, sede de los Supremos Poderes de la República.'
  },
  'cartago': {
    nombre: 'Cartago',
    tipo: 'canton',
    provincia: 'Cartago',
    lat: 9.8644,
    lng: -83.9194,
    zoom: 13.2,
    tilt: 50,
    heading: 0,
    descripcion: 'La Vieja Metrópoli, valle de El Guarco y cordillera central.'
  },
  'heredia': {
    nombre: 'Heredia',
    tipo: 'canton',
    provincia: 'Heredia',
    lat: 9.9983,
    lng: -84.1167,
    zoom: 13.5,
    tilt: 50,
    heading: 0,
    descripcion: 'Ciudad de las Flores y polo tecnológico del Valle Central.'
  },
  'liberia': {
    nombre: 'Liberia',
    tipo: 'canton',
    provincia: 'Guanacaste',
    lat: 10.6300,
    lng: -85.4380,
    zoom: 13.0,
    tilt: 50,
    heading: 0,
    descripcion: 'Ciudad Blanca de las pampas guanacastecas y eje de energía renovable.'
  },
  'santa ana': {
    nombre: 'Santa Ana',
    tipo: 'canton',
    provincia: 'San José',
    lat: 9.9324,
    lng: -84.1825,
    zoom: 13.5,
    tilt: 50,
    heading: 0,
    descripcion: 'Valle del sol, centro de servicios y microclima templado.'
  },
  'desamparados': {
    nombre: 'Desamparados',
    tipo: 'canton',
    provincia: 'San José',
    lat: 9.8967,
    lng: -84.0678,
    zoom: 13.5,
    tilt: 50,
    heading: 0,
    descripcion: 'Segundo cantón más poblado del país, sur metropolitano.'
  },
  'turrialba': {
    nombre: 'Turrialba',
    tipo: 'canton',
    provincia: 'Cartago',
    lat: 9.9040,
    lng: -83.6830,
    zoom: 13.0,
    tilt: 55,
    heading: 45,
    descripcion: 'Cuenca del río Reventazón, monumento nacional Guayabo y volcán activo.'
  },
  'matina': {
    nombre: 'Matina',
    tipo: 'canton',
    provincia: 'Limón',
    lat: 10.0820,
    lng: -83.2840,
    zoom: 12.8,
    tilt: 45,
    heading: 0,
    descripcion: 'Llanuras aluviales del Atlántico, área de contingencia hidrometeorológica.'
  },
  'santa cruz': {
    nombre: 'Santa Cruz',
    tipo: 'canton',
    provincia: 'Guanacaste',
    lat: 10.2620,
    lng: -85.5860,
    zoom: 12.8,
    tilt: 50,
    heading: 0,
    descripcion: 'Ciudad folclórica nacional, pampas y llanuras costeras.'
  },
  'ciudad quesada': {
    nombre: 'Ciudad Quesada',
    tipo: 'distrito',
    provincia: 'Alajuela',
    lat: 10.3238,
    lng: -84.4294,
    zoom: 13.5,
    tilt: 55,
    heading: 45,
    descripcion: 'Cabecera cantonal de San Carlos al pie de la Cordillera de Tilarán.'
  }
};

// 2. Vocabulario Léxico Costarricense por Capas Temáticas
const VOCABULARIO_TEMATICO = {
  salud: [
    'clinica', 'clinicas', 'ebais', 'hospital', 'hospitales', 'salud',
    'medico', 'medicos', 'cais', 'urgencias', 'doctor', 'doctores',
    'farmacia', 'sanitario', 'centro de salud', 'centros de salud',
    'atencion medica', 'primeros auxilios', 'ccss', 'caja'
  ],
  educacion: [
    'colegio tecnico', 'colegios tecnicos', 'colegio', 'colegios',
    'ctp', 'ctps', 'escuela', 'escuelas', 'educacion', 'educativa',
    'mep', 'liceo', 'liceos', 'instituto', 'institutos', 'vocacional',
    'tecnico profesional', 'kinder', 'universidad', 'artes y oficios'
  ],
  albergues: [
    'albergue', 'albergues', 'refugio', 'refugios', 'inunda', 'inundacion',
    'inundaciones', 'inundado', 'inundada', 'cne', 'emergencia', 'emergencias',
    'evacuacion', 'desastre', 'temporal', 'damnificados', 'resguardo',
    'comision de emergencias', 'crecida', 'cabezas de agua', 'desbordamiento',
    'temporal caribeno', 'huracan', 'tormenta'
  ],
  recreativa: [
    'comite de deportes', 'comites de deportes', 'cancha', 'canchas',
    'polideportivo', 'polideportivos', 'deporte', 'deportes', 'estadio',
    'estadios', 'piscina', 'piscinas', 'futbol', 'atletismo', 'recreacion',
    'recreativa', 'parque', 'parques', 'icoder', 'ccdr', 'plazas de deportes',
    'velodromo', 'calistenia', 'gimnasio'
  ],
  transporte: [
    'bus', 'buses', 'terminal', 'terminales', 'parada', 'paradas',
    'transporte', 'tuasa', 'estacion', 'movilidad', 'viaje', 'colectivo',
    'parada municipal', 'transporte publico'
  ]
};

// 3. Normalizador de Cadenas de Texto (sin tildes, minúsculas, caracteres limpios)
export function normalizarTexto(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 4. Pipeline NLP en Cliente: analiza la consulta ciudadana en lenguaje natural
 * @param {string} consultaRaw - Texto ingresado por voz o teclado
 * @returns {Object} Resultado estructurado para el Visor GIS y feedback
 */
export function procesarConsultaSemantica(consultaRaw = '') {
  const queryLimpia = normalizarTexto(consultaRaw);

  if (!queryLimpia || queryLimpia.length < 3) {
    return {
      exito: false,
      mensaje: 'Por favor ingrese una consulta para buscar (ej. "clínicas cerca de colegios técnicos en San Carlos").',
      sugerencias: obtenerSugerenciasPopulares()
    };
  }

  // --- PASO A: Extracción de Entidad Geográfica ---
  let entidadGeografica = null;

  // 1. Búsqueda exacta en diccionario geográfico curado
  const clavesGeograficas = Object.keys(DICCIONARIO_GEOGRAFICO).sort((a, b) => b.length - a.length);
  for (const clave of clavesGeograficas) {
    if (queryLimpia.includes(clave)) {
      entidadGeografica = DICCIONARIO_GEOGRAFICO[clave];
      break;
    }
  }

  // 2. Si no se encontró en diccionario curado, buscar en los 84 Cantones Oficiales
  if (!entidadGeografica) {
    for (const canton of CANTONES_OFICIALES) {
      const nomNorm = normalizarTexto(canton.nombre);
      if (queryLimpia.includes(nomNorm)) {
        const prov = PROVINCIAS_DATA.find((p) => p.id === canton.provinciaId);
        entidadGeografica = {
          nombre: canton.nombre,
          tipo: 'canton',
          provincia: prov ? prov.nombre : 'Costa Rica',
          lat: 9.9333, // Default de aproximación nacional
          lng: -84.0833,
          zoom: 12.5,
          tilt: 50,
          heading: 0,
          descripcion: `Cantón oficial de ${canton.nombre}, Provincia de ${prov ? prov.nombre : ''}.`
        };
        break;
      }
    }
  }

  // 3. Si no, buscar en las 7 Provincias
  if (!entidadGeografica) {
    for (const prov of PROVINCIAS_DATA) {
      const nomNorm = normalizarTexto(prov.nombre);
      if (queryLimpia.includes(nomNorm)) {
        entidadGeografica = {
          nombre: prov.nombre,
          tipo: 'provincia',
          provincia: prov.nombre,
          lat: prov.id === 5 ? 10.6300 : prov.id === 6 ? 9.9760 : prov.id === 7 ? 9.9930 : 9.9333,
          lng: prov.id === 5 ? -85.4380 : prov.id === 6 ? -84.8320 : prov.id === 7 ? -83.0330 : -84.0833,
          zoom: 10.5,
          tilt: 45,
          heading: 0,
          descripcion: `Provincia de ${prov.nombre}.`
        };
        break;
      }
    }
  }

  // --- PASO B: Extracción de Entidades Temáticas (Capas) ---
  const capasDetectadas = [];

  for (const [layerId, terminos] of Object.entries(VOCABULARIO_TEMATICO)) {
    const coincide = terminos.some((termino) => {
      // Búsqueda de frase o palabra con límites de palabra para evitar falsos positivos (ej. "bus" en "buscar")
      if (termino.includes(' ')) {
        return queryLimpia.includes(termino);
      }
      const regex = new RegExp(`\\b${termino}\\b`, 'i');
      return regex.test(queryLimpia);
    });

    if (coincide) {
      capasDetectadas.push(layerId);
    }
  }

  // Si no se detectó ninguna capa explícita, pero sí una zona, encender capas esenciales de auxilio y servicios
  const capasFinales = capasDetectadas.length > 0
    ? capasDetectadas
    : ['salud', 'albergues', 'educacion'];

  // Crear objeto mapa de capas booleanas para React state
  const activeLayersState = {
    salud: capasFinales.includes('salud'),
    educacion: capasFinales.includes('educacion'),
    transporte: capasFinales.includes('transporte'),
    recreativa: capasFinales.includes('recreativa'),
    albergues: capasFinales.includes('albergues')
  };

  // --- PASO C: Filtrado y Puntos de Interés Encontrados (POIs) ---
  const poisResultantes = GIS_POI_DATA.filter((poi) => {
    // Debe coincidir con alguna de las capas activadas
    const capaCoincide = capasFinales.includes(poi.layer);
    if (!capaCoincide) return false;

    // Si hay entidad geográfica, filtrar por cantón, distrito o provincia
    if (entidadGeografica) {
      const geoNomNorm = normalizarTexto(entidadGeografica.nombre);
      const poiCantonNorm = normalizarTexto(poi.canton);
      const poiProvNorm = normalizarTexto(poi.provincia);
      const poiDistNorm = normalizarTexto(poi.distrito);

      const coincideGeo =
        poiCantonNorm.includes(geoNomNorm) ||
        geoNomNorm.includes(poiCantonNorm) ||
        poiProvNorm.includes(geoNomNorm) ||
        geoNomNorm.includes(poiProvNorm) ||
        poiDistNorm.includes(geoNomNorm) ||
        (entidadGeografica.provincia && poiProvNorm === normalizarTexto(entidadGeografica.provincia));

      return coincideGeo;
    }

    return true;
  });

  // Si no se hallaron POIs específicos en esa zona, pero sí hay POIs en esas capas, usar una selección para no dejar el mapa vacío
  const poisParaResaltar = poisResultantes.length > 0
    ? poisResultantes
    : GIS_POI_DATA.filter((p) => capasFinales.includes(p.layer)).slice(0, 4);

  // --- PASO D: Composición del Resumen en Lenguaje Natural ---
  const nombresCapas = capasFinales
    .map((c) => {
      const config = GIS_LAYERS_CONFIG.find((l) => l.id === c);
      return config ? config.nombre.split(' (')[0] : c;
    })
    .join(' y ');

  const zonaNombre = entidadGeografica ? entidadGeografica.nombre : 'territorio nacional';

  // Desglose de tipos de puntos
  const conteoDetallado = [];
  const saludCount = poisResultantes.filter((p) => p.layer === 'salud').length;
  const eduCount = poisResultantes.filter((p) => p.layer === 'educacion').length;
  const albCount = poisResultantes.filter((p) => p.layer === 'albergues').length;
  const recCount = poisResultantes.filter((p) => p.layer === 'recreativa').length;
  const traCount = poisResultantes.filter((p) => p.layer === 'transporte').length;

  if (saludCount > 0) conteoDetallado.push(`${saludCount} centro(s) de Salud / Ebais`);
  if (eduCount > 0) conteoDetallado.push(`${eduCount} CTP / Escuela(s)`);
  if (albCount > 0) conteoDetallado.push(`${albCount} Albergue(s) CNE habilitados`);
  if (recCount > 0) conteoDetallado.push(`${recCount} Complejo(s) CCDR y canchas`);
  if (traCount > 0) conteoDetallado.push(`${traCount} Terminal(es) de Transporte`);

  const detalleTexto = conteoDetallado.length > 0
    ? `Mostrando ${conteoDetallado.join(' y ')} encontrados en ${zonaNombre}.`
    : `Se localizaron ${poisParaResaltar.length} puntos estratégicos en la zona de ${zonaNombre}.`;

  const resumenAccion = `Se activaron las capas de ${nombresCapas}. ${detalleTexto}`;

  // Si la consulta fue ininteligible o sin relación (sin entidad ni capas detectadas y sin POIs)
  const esCoincidenciaValida = entidadGeografica !== null || capasDetectadas.length > 0;

  if (!esCoincidenciaValida) {
    return {
      exito: false,
      mensaje: `No se identificó una entidad geográfica o temática clara para: "${consultaRaw}". Intente con alguna de las sugerencias del sistema.`,
      sugerencias: obtenerSugerenciasPopulares()
    };
  }

  // Coordenadas para el vuelo de cámara (Fly-To)
  const targetCamera = entidadGeografica
    ? {
        lat: entidadGeografica.lat,
        lng: entidadGeografica.lng,
        zoom: entidadGeografica.zoom || 13,
        tilt: entidadGeografica.tilt || 55,
        heading: entidadGeografica.heading || 0
      }
    : poisParaResaltar.length > 0
    ? {
        lat: poisParaResaltar[0].lat,
        lng: poisParaResaltar[0].lng,
        zoom: 13,
        tilt: 50,
        heading: 0
      }
    : {
        lat: 9.9333,
        lng: -84.0833,
        zoom: 10,
        tilt: 45,
        heading: 0
      };

  return {
    exito: true,
    consultaOriginal: consultaRaw,
    entidadGeografica,
    capasDetectadas: capasFinales,
    activeLayersState,
    poisEncontrados: poisResultantes.length > 0 ? poisResultantes : poisParaResaltar,
    targetCamera,
    resumenAccion,
    telemetria: {
      lat: targetCamera.lat.toFixed(4),
      lng: targetCamera.lng.toFixed(4),
      tilt: `${targetCamera.tilt}°`,
      zoom: targetCamera.zoom
    }
  };
}

/**
 * 5. Sugerencias Populares Costarricenses
 */
export function obtenerSugerenciasPopulares() {
  return [
    'Clínicas cerca de colegios técnicos en San Carlos',
    '¿Dónde hay albergues habilitados si se inunda Puntarenas centro?',
    'Ver comités de deportes y canchas en Alajuela',
    'Buscar centros de salud en Limón',
    'Terminales de transporte y escuelas en San José'
  ];
}

/**
 * 6. Reconocimiento de Voz Inteligente (Web Speech API)
 * Permite dictado de la consulta ciudadana en español costarricense
 */
export class SpeechRecognitionService {
  constructor({ onResult, onError, onStart, onEnd }) {
    this.onResult = onResult;
    this.onError = onError;
    this.onStart = onStart;
    this.onEnd = onEnd;
    this.recognition = null;
    this.isListening = false;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-CR'; // Español de Costa Rica

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStart) this.onStart();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.onResult) this.onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (this.onError) this.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onEnd) this.onEnd();
      };
    }
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  start() {
    if (!this.recognition) return false;
    try {
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  stop() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // Ignorar si ya estaba detenida
    }
  }
}
