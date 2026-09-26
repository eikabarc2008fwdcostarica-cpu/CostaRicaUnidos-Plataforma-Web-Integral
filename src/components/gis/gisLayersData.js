/**
 * COSTA RICA UNIDOS — Datos Geográficos Multicapa y Vuelos 3D
 * Módulo 05: Sistema de Información Geográfica y Visor Cartográfico
 */

export const GIS_LAYERS_CONFIG = [
  {
    id: 'salud',
    nombre: 'Salud (EBAIS y Clínicas)',
    icono: '🏥',
    color: '#00D166', // Verde Salud
    descripcion: 'Red de Ebais, clínicas mayores y hospitales de la CCSS en los 84 cantones.'
  },
  {
    id: 'educacion',
    nombre: 'Educación (Escuelas y CTPs)',
    icono: '🎓',
    color: '#3B82F6', // Azul Educación
    descripcion: 'Colegios Técnicos Profesionales, escuelas públicas e institutos del MEP.'
  },
  {
    id: 'transporte',
    nombre: 'Transporte (Terminales y Buses)',
    icono: '🚌',
    color: '#F59E0B', // Ámbar Transporte
    descripcion: 'Terminales de autobuses intercantonales y paradas de alta afluencia.'
  },
  {
    id: 'recreativa',
    nombre: 'Recreativa (Polideportivos CCDR)',
    icono: '⚽',
    color: '#EC4899', // Magenta Recreativo
    descripcion: 'Centros deportivos, pistas de atletismo y plazas cantonales del ICODER / CCDR.'
  },
  {
    id: 'albergues',
    nombre: 'Albergues de Emergencia CNE (M10)',
    icono: '🚨',
    color: '#EF4444', // Rojo Alerta CNE
    descripcion: 'Puntos habilitados por la Comisión Nacional de Emergencias para evacuación.'
  }
];

export const GIS_POI_DATA = [
  // --- CAPA SALUD ---
  {
    id: 'sal-01',
    layer: 'salud',
    nombre: 'EBAIS Santa Ana Centro',
    categoria: 'EBAIS Tipo 2 • CCSS',
    provincia: 'San José',
    canton: 'Santa Ana',
    distrito: 'Santa Ana',
    lat: 9.9324,
    lng: -84.1825,
    foto: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Jueves: 07:00 - 16:00 | Viernes: 07:00 - 15:00',
    telefono: '+506 2582-7000',
    descripcion: 'Atención primaria, medicina general, odontología comunitaria y farmacia para el sector oeste del Valle Central.'
  },
  {
    id: 'sal-02',
    layer: 'salud',
    nombre: 'Hospital San Juan de Dios',
    categoria: 'Hospital Nacional Clase A',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Hospital',
    lat: 9.9333,
    lng: -84.0833,
    foto: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
    horario: 'Emergencias 24 Horas / Consulta Externa: 06:00 - 18:00',
    telefono: '+506 2547-8000',
    descripcion: 'Hospital benemérito nacional con atención de alta complejidad quirúrgica y traumatológica.'
  },
  {
    id: 'sal-03',
    layer: 'salud',
    nombre: 'Clínica Marcial Fallas Díaz',
    categoria: 'Centro de Atención Integral en Salud (CAIS)',
    provincia: 'San José',
    canton: 'Desamparados',
    distrito: 'Desamparados',
    lat: 9.8967,
    lng: -84.0678,
    foto: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    horario: 'Servicio Continuo 24 Horas',
    telefono: '+506 2259-8100',
    descripcion: 'Soporte vital y urgencias para la población de Desamparados, Aserrí y Acosta.'
  },
  {
    id: 'sal-04',
    layer: 'salud',
    nombre: 'Hospital San Carlos',
    categoria: 'Hospital Regional Norte',
    provincia: 'Alajuela',
    canton: 'San Carlos',
    distrito: 'Quesada',
    lat: 10.3238,
    lng: -84.4294,
    foto: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80',
    horario: 'Atención 24 Horas',
    telefono: '+506 2460-1000',
    descripcion: 'Principal centro de referencia médica de la Zona Norte y cantón de Río Cuarto.'
  },
  {
    id: 'sal-05',
    layer: 'salud',
    nombre: 'EBAIS Liberia Sur',
    categoria: 'EBAIS Periférico',
    provincia: 'Guanacaste',
    canton: 'Liberia',
    distrito: 'Liberia',
    lat: 10.6300,
    lng: -85.4380,
    foto: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Viernes: 07:00 - 16:00',
    telefono: '+506 2666-4100',
    descripcion: 'Control materno-infantil, vacunación y programa preventivo de hipertensión en Liberia.'
  },

  // --- CAPA EDUCACIÓN ---
  {
    id: 'edu-01',
    layer: 'educacion',
    nombre: 'CTP San Carlos',
    categoria: 'Colegio Técnico Profesional • MEP',
    provincia: 'Alajuela',
    canton: 'San Carlos',
    distrito: 'Quesada',
    lat: 10.3340,
    lng: -84.4380,
    foto: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Viernes: 07:00 - 17:30',
    telefono: '+506 2460-0125',
    descripcion: 'Especialidades técnicas en Agroindustria, Informática Empresarial, Electrotecnia y Turismo.'
  },
  {
    id: 'edu-02',
    layer: 'educacion',
    nombre: 'Colegio Vocacional de Artes y Oficios (COVAO)',
    categoria: 'Instituto Técnico Fundacional',
    provincia: 'Cartago',
    canton: 'Cartago',
    distrito: 'Oriental',
    lat: 9.8550,
    lng: -83.9210,
    foto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Viernes: 07:00 - 18:00',
    telefono: '+506 2552-0010',
    descripcion: 'Formación técnica superior en mecánica de precisión, mecatrónica y electrónica industrial.'
  },
  {
    id: 'edu-03',
    layer: 'educacion',
    nombre: 'CTP de Puriscal',
    categoria: 'Colegio Técnico Profesional',
    provincia: 'San José',
    canton: 'Puriscal',
    distrito: 'Santiago',
    lat: 9.8450,
    lng: -84.3120,
    foto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Viernes: 07:00 - 16:30',
    telefono: '+506 2416-8020',
    descripcion: 'Pilar formativo técnico para jóvenes de la cordillera del suroeste josefino.'
  },
  {
    id: 'edu-04',
    layer: 'educacion',
    nombre: 'Escuela República de Chile',
    categoria: 'Escuela Urbana de Excelencia',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Catedral',
    lat: 9.9280,
    lng: -84.0750,
    foto: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Viernes: 07:00 - 17:00',
    telefono: '+506 2222-1405',
    descripcion: 'Institución primaria centenaria con programas bilingües y aulas de innovación STEAM.'
  },

  // --- CAPA TRANSPORTE ---
  {
    id: 'tra-01',
    layer: 'transporte',
    nombre: 'Terminal de Buses del Caribe',
    categoria: 'Terminal de Pasajeros Interprovincial',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Merced',
    lat: 9.9385,
    lng: -84.0815,
    foto: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Domingo: 04:30 - 22:30',
    telefono: '+506 2222-0610',
    descripcion: 'Punto neurálgico de salida hacia Limón, Guápiles, Siquirres, Puerto Viejo y Talamanca.'
  },
  {
    id: 'tra-02',
    layer: 'transporte',
    nombre: 'Terminal TUASA Alajuela',
    categoria: 'Terminal Radial Metropolitana',
    provincia: 'Alajuela',
    canton: 'Alajuela',
    distrito: 'Alajuela',
    lat: 10.0160,
    lng: -84.2140,
    foto: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    horario: 'Servicio 24 Horas cada 10 minutos',
    telefono: '+506 2442-6900',
    descripcion: 'Conexión expresa directa entre el Parque Central de Alajuela y San José por General Cañas.'
  },
  {
    id: 'tra-03',
    layer: 'transporte',
    nombre: 'Parada Municipal Puntarenas Centro',
    categoria: 'Hub de Transporte Costero',
    provincia: 'Puntarenas',
    canton: 'Puntarenas',
    distrito: 'Puntarenas',
    lat: 9.9760,
    lng: -84.8320,
    foto: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Domingo: 05:00 - 21:00',
    telefono: '+506 2661-0000',
    descripcion: 'Conexión con el Ferry de Paquera, Monteverde, Esparza y rutas del Pacífico Central.'
  },

  // --- CAPA RECREATIVA (CCDR) ---
  {
    id: 'rec-01',
    layer: 'recreativa',
    nombre: 'Polideportivo Monserrat CCDR Alajuela',
    categoria: 'Complejo Deportivo Cantonal',
    provincia: 'Alajuela',
    canton: 'Alajuela',
    distrito: 'Alajuela',
    lat: 10.0050,
    lng: -84.2190,
    foto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    horario: 'Martes a Domingo: 05:00 - 21:00',
    telefono: '+506 2441-6100',
    descripcion: 'Piscina olímpica temperada, pista sintética de atletismo, canchas de tenis y gimnasio polifuncional.'
  },
  {
    id: 'rec-02',
    layer: 'recreativa',
    nombre: 'Parque de la Paz y Velódromo Nacional',
    categoria: 'Parque Metropolitano Soberano',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'San Sebastián',
    lat: 9.9140,
    lng: -84.0720,
    foto: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=600&q=80',
    horario: 'Abierto todos los días: 05:00 - 18:30',
    telefono: '+506 2226-0030',
    descripcion: 'Extenso pulmón verde, lagos artificiales, velódromo nacional para ciclismo y pistas de trote.'
  },
  {
    id: 'rec-03',
    layer: 'recreativa',
    nombre: 'Polideportivo de Cartago',
    categoria: 'Centro Recreativo Cantonal',
    provincia: 'Cartago',
    canton: 'Cartago',
    distrito: 'Occidental',
    lat: 9.8700,
    lng: -83.9350,
    foto: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    horario: 'Lunes a Domingo: 06:00 - 20:00',
    telefono: '+506 2551-4020',
    descripcion: 'Canchas sintéticas de fútbol 8, módulos de calistenia y áreas de esparcimiento familiar.'
  },

  // --- CAPA ALBERGUES DE EMERGENCIA CNE (M10) ---
  {
    id: 'alb-01',
    layer: 'albergues',
    nombre: 'Albergue CNE Gimnasio Municipal de Turrialba',
    categoria: 'Albergue Cantonal Oficial Nivel 1',
    provincia: 'Cartago',
    canton: 'Turrialba',
    distrito: 'Turrialba',
    lat: 9.9040,
    lng: -83.6830,
    foto: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    horario: 'Activación Inmediata 24/7 ante Alerta CNE',
    telefono: '+506 2556-0230 (Línea CNE)',
    capacidad: '250 personas / Kits de auxilio y cocina comunal',
    descripcion: 'Punto de concentración humanitaria para evacuaciones por crecidas del Río Reventazón y Turrialba.'
  },
  {
    id: 'alb-02',
    layer: 'albergues',
    nombre: 'Albergue CNE Salón Comunal de Matina',
    categoria: 'Refugio de Emergencia por Inundaciones',
    provincia: 'Limón',
    canton: 'Matina',
    distrito: 'Matina',
    lat: 10.0820,
    lng: -83.2840,
    foto: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80',
    horario: 'Operativo en Alerta Amarilla / Roja',
    telefono: '+506 2710-1122',
    capacidad: '180 personas / Dotación de agua potable y generador solar',
    descripcion: 'Atención comunitaria prioritaria para familias de las llanuras de Matina ante eventos hidrometeorológicos.'
  },
  {
    id: 'alb-03',
    layer: 'albergues',
    nombre: 'Albergue CNE Gimnasio de Santa Cruz',
    categoria: 'Refugio Territorial Temporal',
    provincia: 'Guanacaste',
    canton: 'Santa Cruz',
    distrito: 'Santa Cruz',
    lat: 10.2620,
    lng: -85.5860,
    foto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    horario: 'Activación bajo Protocolo de Emergencia',
    telefono: '+506 2680-0450',
    capacidad: '300 personas / Puesto médico avanzado',
    descripcion: 'Instalación equipada con suministros de emergencia, catres y zona de triaje de la Cruz Roja Costarricense.'
  }
];

/**
 * Destinos preconfigurados para vuelos 3D suaves (Fly-To)
 * Permite inclinación 45°-60° para visualización de relieve, volcanes y valles.
 */
export const VUELOS_3D_DESTINOS = [
  {
    id: 'valle-central',
    nombre: 'Valle Central (Capital San José)',
    tipo: 'Valle Urbano',
    lat: 9.9333,
    lng: -84.0833,
    zoom: 13,
    tilt: 55,
    heading: 45,
    descripcion: 'Visualización 3D de la cuenca central y cerros de Escazú.'
  },
  {
    id: 'volcan-arenal',
    nombre: 'Volcán Arenal y La Fortuna',
    tipo: 'Cono Volcánico & Relieve',
    lat: 10.4633,
    lng: -84.7032,
    zoom: 14,
    tilt: 60,
    heading: 90,
    descripcion: 'Topografía cónica volcánica, Lago Arenal y cordillera de Tilarán.'
  },
  {
    id: 'volcan-poas',
    nombre: 'Cráter del Volcán Poás',
    tipo: 'Macizo Volcánico',
    lat: 10.1980,
    lng: -84.2300,
    zoom: 14,
    tilt: 50,
    heading: 180,
    descripcion: 'Cráter principal activo y caldera lacustre a 2,700 msnm.'
  },
  {
    id: 'golfo-nicoya',
    nombre: 'Golfo de Nicoya y Puntarenas',
    tipo: 'Costa Pacífica & Bahías',
    lat: 9.9760,
    lng: -84.8320,
    zoom: 13,
    tilt: 55,
    heading: 270,
    descripcion: 'Península arenosa de Puntarenas y estuarios del Golfo.'
  },
  {
    id: 'puerto-limon',
    nombre: 'Puerto Limón y Costa Caribe',
    tipo: 'Pórtico Atlántico',
    lat: 9.9930,
    lng: -83.0330,
    zoom: 13,
    tilt: 45,
    heading: 315,
    descripcion: 'Bahía portuaria, arrecifes caribeños y desembocaduras fluviales.'
  },
  {
    id: 'isla-del-coco',
    nombre: 'Parque Nacional Isla del Coco',
    tipo: 'Soberanía Oceánica Exclusiva',
    lat: 5.5310,
    lng: -87.0580,
    zoom: 12,
    tilt: 50,
    heading: 0,
    descripcion: 'Patrimonio de la Humanidad, aguas oceánicas del Pacífico a 532 km de tierra firme.'
  }
];

/**
 * Generadores de enlaces para Deep Linking directo a Waze y Google Maps
 */
export function generarEnlaceWaze(lat, lng) {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

export function generarEnlaceGoogleMaps(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
