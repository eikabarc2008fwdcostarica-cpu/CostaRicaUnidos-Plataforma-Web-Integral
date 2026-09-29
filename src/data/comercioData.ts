/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 08: DIRECTORIO COMERCIAL PYMES Y FERIA DEL AGRICULTOR
 * Incluye validación de Hacienda, CTAs WhatsApp/Waze y coordenadas POI para Eiker
 * ============================================================================
 */

export interface ComercioPymePOI {
  id: string;
  nombreComercial: string;
  razonSocial: string;
  cedulaJuridicaOFisica: string;
  patenteMunicipal: string;
  actividadCiiu: string;
  categoria: 'Alimentos y Gastronomía' | 'Artesanías y Textiles' | 'Tecnología y Servicios' | 'Salud y Bienestar' | 'Comercio General';
  distrito: string;
  direccionExacta: string;
  telefono: string;
  whatsappNumero: string;
  whatsappMensajePrellenado: string;
  horario: string;
  descripcion: string;
  regimenTributarioHacienda: 'Régimen Simplificado' | 'Régimen Tradicional' | 'No Registrado';
  esVerificadoHacienda: boolean;
  estadoPatente: 'Vigente' | 'En Trámite de Renovación' | 'Suspendida';
  aceptaSinpeMovil: boolean;
  lat: number;
  lng: number;
  imagenUrl: string;
}

export interface PuestoFeriaSector {
  id: string;
  numeroPuesto: string;
  productorNombre: string;
  cedulaProductor: string;
  carneCacNumero: string;
  fincaOrigen: string;
  cantonOrigen: string;
  sector: 'Frutas Tropicales' | 'Verduras y Hortalizas' | 'Lácteos y Quesos' | 'Carnes y Embutidos' | 'Plantas y Flores' | 'Sodas y Comidas';
  sectorCodigo: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  productosPrincipales: string[];
  esOrganicoCertificado: boolean;
  enteCertificador?: string;
  verificadoHacienda: boolean;
  regimenTributario: string;
  coordenadaCroquis: { x: number; y: number }; // Posición relativa en el croquis (0 a 100%)
}

export interface TemporadaCosecha {
  mes: string;
  productosTemporadaAlta: string[];
  productosEscasos: string[];
  consejoConsumidor: string;
}

export interface PrecioCnpSime {
  id: string;
  producto: string;
  variedad: string;
  categoria: 'Hortalizas' | 'Frutas' | 'Tubérculos y Raíces' | 'Lácteos y Huevos' | 'Granos y Musáceas';
  unidadMedida: string;
  precioMayoristaCenada: number; // ₡ por unidad de medida en CENADA/PIMA
  precioSugeridoFeria: number; // ₡ precio de referencia para Ferias del Agricultor
  precioSupermercadoPromedio: number; // ₡ precio promedio en cadenas comerciales
  ahorroPorcentaje: number; // % estimado de ahorro en feria
  tendenciaSemanal: 'estable' | 'baja' | 'alza';
  fechaMonitoreo: string;
  observacionCnp: string;
}

export const PYMES_CANTONALES_DATA: ComercioPymePOI[] = [
  {
    id: 'pyme-1',
    nombreComercial: 'Cafetería & Tostaduría Alma Tica',
    razonSocial: 'Cafés de Especialidad Valle del Sol S.A.',
    cedulaJuridicaOFisica: '3101894521',
    patenteMunicipal: 'PAT-MUNI-SJ-2024-8841',
    actividadCiiu: '5610 - Actividades de restaurantes y expendio de café',
    categoria: 'Alimentos y Gastronomía',
    distrito: 'Carmen',
    direccionExacta: 'Barrio Amón, Avenida 9, Calle 3, San José Centro',
    telefono: '(506) 2221-8840',
    whatsappNumero: '50688442211',
    whatsappMensajePrellenado: '¡Hola! Vi su comercio en la plataforma Costa Rica Unidos y deseo consultar el menú de café de especialidad con patente municipal.',
    horario: 'Lunes a Sábado: 07:30 - 19:30 hrs',
    descripcion: 'Café de altura de microbeneficios de Tarrazú y Dota, repostería artesanal sin preservantes y ambiente colonial con certificación municipal.',
    regimenTributarioHacienda: 'Régimen Simplificado',
    esVerificadoHacienda: true,
    estadoPatente: 'Vigente',
    aceptaSinpeMovil: true,
    lat: 9.9381,
    lng: -84.0762,
    imagenUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pyme-2',
    nombreComercial: 'Taller Artesanal El Yigüirro de Madera',
    razonSocial: 'Artesanías y Diseños de Costa Rica E.I.R.L.',
    cedulaJuridicaOFisica: '3105748291',
    patenteMunicipal: 'PAT-MUNI-SJ-2023-4120',
    actividadCiiu: '1629 - Fabricación de productos de madera y corcho',
    categoria: 'Artesanías y Textiles',
    distrito: 'Catedral',
    direccionExacta: 'Mercado Nacional de Artesanías, local 24',
    telefono: '(506) 2258-3319',
    whatsappNumero: '50689901122',
    whatsappMensajePrellenado: 'Hola, me interesa conocer los precios de las carretas y souvenirs de madera tallada certificados por la Municipalidad.',
    horario: 'Todos los días: 08:30 - 18:00 hrs',
    descripcion: 'Juguetes tradicionales, réplicas de carretas certificadas y joyería en semillas naturales sustentables con sello de patente cantonal.',
    regimenTributarioHacienda: 'Régimen Simplificado',
    esVerificadoHacienda: true,
    estadoPatente: 'Vigente',
    aceptaSinpeMovil: true,
    lat: 9.9329,
    lng: -84.0725,
    imagenUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pyme-3',
    nombreComercial: 'Soluciones Biotecnológicas Verdes del Trópico',
    razonSocial: 'BioVerde Soluciones Agroecológicas Limitada',
    cedulaJuridicaOFisica: '3102456789',
    patenteMunicipal: 'PAT-MUNI-SJ-2022-1904',
    actividadCiiu: '7210 - Investigaciones y desarrollo experimental en ciencias naturales',
    categoria: 'Tecnología y Servicios',
    distrito: 'Mata Redonda',
    direccionExacta: 'Sabana Sur, Oficentro La Sabana, Torre 2, Piso 4',
    telefono: '(506) 2290-7766',
    whatsappNumero: '50671123344',
    whatsappMensajePrellenado: 'Estimados, vi su perfil patentado en Costa Rica Unidos y solicito cotización de biofertilizantes.',
    horario: 'Lunes a Viernes: 08:00 - 17:00 hrs',
    descripcion: 'Insumos agroecológicos para huertas urbanas e hidroponía residencial con huella de carbono neutral y registro ante el MAG.',
    regimenTributarioHacienda: 'Régimen Tradicional',
    esVerificadoHacienda: true,
    estadoPatente: 'Vigente',
    aceptaSinpeMovil: false,
    lat: 9.9298,
    lng: -84.1034,
    imagenUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pyme-4',
    nombreComercial: 'Farmacia y Botica Botánica La Merced',
    razonSocial: 'Distribuidora Farmacéutica del Valle Central S.A.',
    cedulaJuridicaOFisica: '3101112233',
    patenteMunicipal: 'PAT-MUNI-SJ-2021-0852',
    actividadCiiu: '4772 - Comercio al por menor de productos farmacéuticos y medicinales',
    categoria: 'Salud y Bienestar',
    distrito: 'Merced',
    direccionExacta: 'Paseo Colón, frente a la Iglesia de La Merced',
    telefono: '(506) 2223-1450',
    whatsappNumero: '50687765544',
    whatsappMensajePrellenado: 'Buen día, vi su comercio verificado en la ventanilla cantonal y deseo consultar disponibilidad de medicamentos.',
    horario: 'Lunes a Domingo: 07:00 - 21:00 hrs',
    descripcion: 'Medicamentos genéricos, fitoterapia costarricense registrada ante el Ministerio de Salud y atención farmacéutica con Ley 7600.',
    regimenTributarioHacienda: 'Régimen Tradicional',
    esVerificadoHacienda: true,
    estadoPatente: 'Vigente',
    aceptaSinpeMovil: true,
    lat: 9.9345,
    lng: -84.0845,
    imagenUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pyme-5',
    nombreComercial: 'Panadería y Dulcería El Trigo de Oro',
    razonSocial: 'Panificadora de la Meseta Central E.I.R.L.',
    cedulaJuridicaOFisica: '1048209310',
    patenteMunicipal: 'PAT-MUNI-SJ-2024-9912',
    actividadCiiu: '1071 - Elaboración de productos de panadería y repostería',
    categoria: 'Alimentos y Gastronomía',
    distrito: 'Zapote',
    direccionExacta: '200 metros norte del Parque de Zapote',
    telefono: '(506) 2283-9900',
    whatsappNumero: '50683321100',
    whatsappMensajePrellenado: 'Hola, vi su panadería patentada en la plataforma cantonal y quiero ordenar pan casero y quesadillas.',
    horario: 'Lunes a Sábado: 06:00 - 19:00 hrs',
    descripcion: 'Panadería tradicional con hornos de piedra, panes de masa madre natural y repostería criolla libre de colorantes artificiales.',
    regimenTributarioHacienda: 'Régimen Simplificado',
    esVerificadoHacienda: true,
    estadoPatente: 'Vigente',
    aceptaSinpeMovil: true,
    lat: 9.9212,
    lng: -84.0588,
    imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pyme-6',
    nombreComercial: 'Librería y Papelería Cívica El Saber',
    razonSocial: 'Ediciones y Suministros Escolares San José Ltda.',
    cedulaJuridicaOFisica: '3104889922',
    patenteMunicipal: 'PAT-MUNI-SJ-2023-7721',
    actividadCiiu: '4761 - Comercio al por menor de libros, periódicos y artículos de papelería',
    categoria: 'Comercio General',
    distrito: 'San Francisco de Dos Ríos',
    direccionExacta: 'Costado oeste de la Escuela República Dominicana',
    telefono: '(506) 2226-4433',
    whatsappNumero: '50684456677',
    whatsappMensajePrellenado: 'Hola, vi su librería en la plataforma Costa Rica Unidos. ¿Tienen libros de texto y materiales escolares?',
    horario: 'Lunes a Viernes: 07:30 - 18:00 hrs',
    descripcion: 'Librería comunitaria, textos cívicos de autores costarricenses, copiado digital y material didáctico para escuelas públicas.',
    regimenTributarioHacienda: 'Régimen Simplificado',
    esVerificadoHacienda: true,
    estadoPatente: 'Vigente',
    aceptaSinpeMovil: true,
    lat: 9.9142,
    lng: -84.0512,
    imagenUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80'
  }
];

export const PUESTOS_FERIA_MOCK: PuestoFeriaSector[] = [
  {
    id: 'puesto-01',
    numeroPuesto: 'P-12',
    productorNombre: 'Don José Joaquín Mora Zúñiga',
    cedulaProductor: '1-0482-0931',
    carneCacNumero: 'CAC-DOTA-2024-088',
    fincaOrigen: 'Finca La Laja',
    cantonOrigen: 'Santa María de Dota (San José)',
    sector: 'Frutas Tropicales',
    sectorCodigo: 'A',
    productosPrincipales: ['Aguacate Hass Extra', 'Mora Silvestre', 'Granadilla Criolla', 'Tomate de Árbol'],
    esOrganicoCertificado: true,
    enteCertificador: 'Eco-LÓGICA Costa Rica (MAG N° 042)',
    verificadoHacienda: true,
    regimenTributario: 'Régimen Simplificado Agropecuario',
    coordenadaCroquis: { x: 22, y: 35 }
  },
  {
    id: 'puesto-02',
    numeroPuesto: 'P-18',
    productorNombre: 'Doña Miriam Fallas Castro',
    cedulaProductor: '1-0692-0145',
    carneCacNumero: 'CAC-ZARC-2023-142',
    fincaOrigen: 'Huerta Los Cipreses',
    cantonOrigen: 'Zarcero (Alajuela)',
    sector: 'Verduras y Hortalizas',
    sectorCodigo: 'B',
    productosPrincipales: ['Zanahoria Baby', 'Lechuga Romana Hidropónica', 'Brócoli de Altura', 'Espinaca Tierna'],
    esOrganicoCertificado: true,
    enteCertificador: 'Certificación Participativa MAG',
    verificadoHacienda: true,
    regimenTributario: 'Régimen Simplificado Agropecuario',
    coordenadaCroquis: { x: 45, y: 35 }
  },
  {
    id: 'puesto-03',
    numeroPuesto: 'P-29',
    productorNombre: 'CoopeLácteos del Volcán R.L.',
    cedulaProductor: '3-004-123456',
    carneCacNumero: 'CAC-TURR-2022-019',
    fincaOrigen: 'Pastizales de Santa Cruz',
    cantonOrigen: 'Turrialba (Cartago)',
    sector: 'Lácteos y Quesos',
    sectorCodigo: 'D',
    productosPrincipales: ['Queso Turrialba con Denominación de Origen', 'Natilla Casera Pasteurizada', 'Queso Palmito Artesanal'],
    esOrganicoCertificado: false,
    enteCertificador: 'Inspección Sanitaria SENASA N° CS-411',
    verificadoHacienda: true,
    regimenTributario: 'Régimen Tradicional Cooperativo',
    coordenadaCroquis: { x: 75, y: 40 }
  },
  {
    id: 'puesto-04',
    numeroPuesto: 'P-33',
    productorNombre: 'Asociación Agrícola Raíces del Valle',
    cedulaProductor: '3-002-881920',
    carneCacNumero: 'CAC-CART-2024-301',
    fincaOrigen: 'Tierras Altas de Cot',
    cantonOrigen: 'Oreamuno (Cartago)',
    sector: 'Verduras y Hortalizas',
    sectorCodigo: 'C',
    productosPrincipales: ['Papa Blanca de Primera', 'Papa Amarilla Especial', 'Cebolla Morada Seca', 'Remolacha'],
    esOrganicoCertificado: false,
    enteCertificador: 'Buenas Prácticas Agrícolas (BPA-MAG)',
    verificadoHacienda: true,
    regimenTributario: 'Régimen Simplificado Agropecuario',
    coordenadaCroquis: { x: 35, y: 70 }
  },
  {
    id: 'puesto-05',
    numeroPuesto: 'P-44',
    productorNombre: 'Soda La Tradición Campesina',
    cedulaProductor: '1-0998-0412',
    carneCacNumero: 'CAC-SJ-2024-512',
    fincaOrigen: 'Cocina Comunal de San Antonio',
    cantonOrigen: 'Desamparados (San José)',
    sector: 'Sodas y Comidas',
    sectorCodigo: 'F',
    productosPrincipales: ['Chorreadas con Natilla Fresca', 'Empanadas de Chiverre', 'Agua de Sapo con Jengibre', 'Pozol Criollo'],
    esOrganicoCertificado: false,
    enteCertificador: 'Permiso Sanitario de Funcionamiento Ministerio de Salud',
    verificadoHacienda: true,
    regimenTributario: 'Régimen Simplificado',
    coordenadaCroquis: { x: 80, y: 80 }
  },
  {
    id: 'puesto-06',
    numeroPuesto: 'P-50',
    productorNombre: 'Vivero y Orquídeas del Guarco',
    cedulaProductor: '1-0811-0932',
    carneCacNumero: 'CAC-GUAR-2023-094',
    fincaOrigen: 'Vivero El Manantial',
    cantonOrigen: 'El Guarco (Cartago)',
    sector: 'Plantas y Flores',
    sectorCodigo: 'E',
    productosPrincipales: ['Guaria Morada (Flor Nacional)', 'Plantas Medicinales', 'Suculentas', 'Abono Orgánico Compostado'],
    esOrganicoCertificado: true,
    enteCertificador: 'Vivero Registrado ante el SINAC-MINAE',
    verificadoHacienda: true,
    regimenTributario: 'Régimen Simplificado',
    coordenadaCroquis: { x: 20, y: 80 }
  }
];

export const PRECIOS_CNP_SIME_DATA: PrecioCnpSime[] = [
  {
    id: 'cnp-01',
    producto: 'Tomate',
    variedad: 'Tomate de Primera (Manzano/Mundo)',
    categoria: 'Hortalizas',
    unidadMedida: 'Kilogramo (kg)',
    precioMayoristaCenada: 520,
    precioSugeridoFeria: 750,
    precioSupermercadoPromedio: 1350,
    ahorroPorcentaje: 44,
    tendenciaSemanal: 'baja',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Abundante oferta de fincas de San Ramón y Cartago favorece precio bajo al consumidor.'
  },
  {
    id: 'cnp-02',
    producto: 'Papa Blanca',
    variedad: 'Variedad Floresta / Única de Primera',
    categoria: 'Tubérculos y Raíces',
    unidadMedida: 'Kilogramo (kg)',
    precioMayoristaCenada: 580,
    precioSugeridoFeria: 800,
    precioSupermercadoPromedio: 1450,
    ahorroPorcentaje: 45,
    tendenciaSemanal: 'estable',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Cosecha estable en las faldas del Volcán Irazú y Prusia con excelente calibre.'
  },
  {
    id: 'cnp-03',
    producto: 'Aguacate Hass',
    variedad: 'Hass Nacional de Los Santos',
    categoria: 'Frutas',
    unidadMedida: 'Kilogramo (kg)',
    precioMayoristaCenada: 1350,
    precioSugeridoFeria: 1850,
    precioSupermercadoPromedio: 2950,
    ahorroPorcentaje: 37,
    tendenciaSemanal: 'baja',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Pico de producción en Dota y Tarrazú con óptimo porcentaje de materia seca.'
  },
  {
    id: 'cnp-04',
    producto: 'Cebolla Seca',
    variedad: 'Cebolla Amarilla / Morada Especial',
    categoria: 'Hortalizas',
    unidadMedida: 'Kilogramo (kg)',
    precioMayoristaCenada: 620,
    precioSugeridoFeria: 900,
    precioSupermercadoPromedio: 1600,
    ahorroPorcentaje: 44,
    tendenciaSemanal: 'estable',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Inventario nacional suficiente con curado óptimo para larga conservación.'
  },
  {
    id: 'cnp-05',
    producto: 'Queso Turrialba D.O.',
    variedad: 'Queso Tierno Tipo Turrialba con Denominación',
    categoria: 'Lácteos y Huevos',
    unidadMedida: 'Kilogramo (kg)',
    precioMayoristaCenada: 3400,
    precioSugeridoFeria: 4200,
    precioSupermercadoPromedio: 6300,
    ahorroPorcentaje: 33,
    tendenciaSemanal: 'estable',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Elaborado con leche de pastoreo de Santa Cruz de Turrialba bajo estricto control SENASA.'
  },
  {
    id: 'cnp-06',
    producto: 'Huevos de Pastoreo',
    variedad: 'Huevo Blanco y Rojo de Finca Libre',
    categoria: 'Lácteos y Huevos',
    unidadMedida: 'Cartón de 30 unidades',
    precioMayoristaCenada: 2800,
    precioSugeridoFeria: 3400,
    precioSupermercadoPromedio: 4900,
    ahorroPorcentaje: 31,
    tendenciaSemanal: 'estable',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Aporte nutricional comprobado, gallinas libres de jaula en granjas de Atenas.'
  },
  {
    id: 'cnp-07',
    producto: 'Plátano Verde / Maduro',
    variedad: 'Curré de Primera de la Región Brunca',
    categoria: 'Granos y Musáceas',
    unidadMedida: 'Unidad (u)',
    precioMayoristaCenada: 120,
    precioSugeridoFeria: 180,
    precioSupermercadoPromedio: 360,
    ahorroPorcentaje: 50,
    tendenciaSemanal: 'baja',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Gran afluencia de musáceas de Pérez Zeledón y Parrita con máxima frescura.'
  },
  {
    id: 'cnp-08',
    producto: 'Zanahoria Criolla',
    variedad: 'Zanahoria Lavada Especial',
    categoria: 'Tubérculos y Raíces',
    unidadMedida: 'Kilogramo (kg)',
    precioMayoristaCenada: 410,
    precioSugeridoFeria: 600,
    precioSupermercadoPromedio: 1100,
    ahorroPorcentaje: 45,
    tendenciaSemanal: 'alza',
    fechaMonitoreo: 'Semana 39 - Septiembre 2026',
    observacionCnp: 'Leve reducción de oferta por lluvias en la zona norte, calidad de primera garantizada.'
  }
];

export const CALENDARIO_COSECHAS: TemporadaCosecha[] = [
  {
    mes: 'Enero - Marzo (Época Seca / Verano)',
    productosTemporadaAlta: ['Mango Tomy y Criollo', 'Melón', 'Sandía', 'Caimito', 'Cebolla Seca', 'Chiverre'],
    productosEscasos: ['Mora de Altura', 'Hongos Silvestres'],
    consejoConsumidor: 'Mejor época para adquirir frutas dulces tropicales a precio accesible para conservas y jaleas.'
  },
  {
    mes: 'Abril - Junio (Transición y Primeras Lluvias)',
    productosTemporadaAlta: ['Aguacate criollo', 'Piña Dorada', 'Yuca tierna', 'Zapote', 'Mamón Chino (Rambután primer corte)'],
    productosEscasos: ['Cítricos dulces'],
    consejoConsumidor: 'Las hortalizas de hoja verde alcanzan su mayor tamaño gracias a las primeras lluvias estacionales.'
  },
  {
    mes: 'Julio - Septiembre (Temporada de Oro)',
    productosTemporadaAlta: ['Mamón Chino', 'Guanábana', 'Maracuyá', 'Palmito Fresco', 'Maíz dulce para chorreadas'],
    productosEscasos: ['Tomate de campo abierto'],
    consejoConsumidor: 'Época del tradicional festival del mamón chino y el maíz tierno en las ferias cantonales.'
  },
  {
    mes: 'Octubre - Diciembre (Cosecha Nacional y Café)',
    productosTemporadaAlta: ['Café maduro de altura', 'Manzana de agua', 'Camote', 'Ayote sazón para tamal', 'Naranja Victoria'],
    productosEscasos: ['Melón de exportación'],
    consejoConsumidor: 'Meses óptimos para abastecerse de verduras de olla para el tradicional tamal navideño costarricense.'
  }
];

export function getGeoJsonComerciosPOI() {
  return {
    type: 'FeatureCollection',
    features: PYMES_CANTONALES_DATA.map((pyme) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [pyme.lng, pyme.lat]
      },
      properties: {
        id: pyme.id,
        nombre: pyme.nombreComercial,
        categoria: pyme.categoria,
        distrito: pyme.distrito,
        patenteMunicipal: pyme.patenteMunicipal,
        esVerificadoHacienda: pyme.esVerificadoHacienda,
        whatsapp: pyme.whatsappNumero,
        telefono: pyme.telefono
      }
    }))
  };
}
