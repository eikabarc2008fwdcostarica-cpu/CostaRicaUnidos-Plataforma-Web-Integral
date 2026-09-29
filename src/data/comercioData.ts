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
  fincaOrigen: string;
  cantonOrigen: string;
  sector: 'Frutas Tropicales' | 'Verduras y Hortalizas' | 'Lácteos y Quesos' | 'Carnes y Embutidos' | 'Plantas y Flores' | 'Sodas y Comidas';
  productosPrincipales: string[];
  esOrganicoCertificado: boolean;
  verificadoHacienda: boolean;
  coordenadaCroquis: { x: number; y: number }; // Posición relativa en el croquis (0 a 100%)
}

export interface TemporadaCosecha {
  mes: string;
  productosTemporadaAlta: string[];
  productosEscasos: string[];
  consejoConsumidor: string;
}

export const PYMES_CANTONALES_DATA: ComercioPymePOI[] = [
  {
    id: 'pyme-1',
    nombreComercial: 'Cafetería & Tostaduría Alma Tica',
    razonSocial: 'Cafés de Especialidad Valle del Sol S.A.',
    cedulaJuridicaOFisica: '3101894521',
    categoria: 'Alimentos y Gastronomía',
    distrito: 'Carmen',
    direccionExacta: 'Barrio Amón, Avenida 9, Calle 3, San José Centro',
    telefono: '(506) 2221-8840',
    whatsappNumero: '50688442211',
    whatsappMensajePrellenado: '¡Hola! Vi su comercio en la plataforma Costa Rica Unidos y deseo consultar el menú de café de especialidad.',
    horario: 'Lunes a Sábado: 07:30 - 19:30 hrs',
    descripcion: 'Café de altura de microbeneficios de Tarrazú y Dota, repostería artesanal sin preservantes y ambiente colonial.',
    regimenTributarioHacienda: 'Régimen Simplificado',
    esVerificadoHacienda: true,
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
    categoria: 'Artesanías y Textiles',
    distrito: 'Catedral',
    direccionExacta: 'Mercado Nacional de Artesanías, local 24',
    telefono: '(506) 2258-3319',
    whatsappNumero: '50689901122',
    whatsappMensajePrellenado: 'Hola, me interesa conocer los precios de las carretas y souvenirs de madera tallada en Costa Rica Unidos.',
    horario: 'Todos los días: 08:30 - 18:00 hrs',
    descripcion: 'Juguetes tradicionales, réplicas de carretas certificadas y joyería en semillas naturales sustentables.',
    regimenTributarioHacienda: 'Régimen Simplificado',
    esVerificadoHacienda: true,
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
    categoria: 'Tecnología y Servicios',
    distrito: 'Mata Redonda',
    direccionExacta: 'Sabana Sur, Oficentro La Sabana, Torre 2, Piso 4',
    telefono: '(506) 2290-7766',
    whatsappNumero: '50671123344',
    whatsappMensajePrellenado: 'Estimados, vi su perfil certificado en Costa Rica Unidos y solicito cotización de biofertilizantes.',
    horario: 'Lunes a Viernes: 08:00 - 17:00 hrs',
    descripcion: 'Insumos agroecológicos para huertas urbanas e hidroponía residencial con huella de carbono neutral.',
    regimenTributarioHacienda: 'Régimen Tradicional',
    esVerificadoHacienda: true,
    aceptaSinpeMovil: false,
    lat: 9.9298,
    lng: -84.1034,
    imagenUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
  }
];

export const PUESTOS_FERIA_MOCK: PuestoFeriaSector[] = [
  {
    id: 'puesto-01',
    numeroPuesto: 'P-12',
    productorNombre: 'Don José Joaquín Mora Zúñiga',
    cedulaProductor: '104820931',
    fincaOrigen: 'Finca La Laja',
    cantonOrigen: 'Santa María de Dota',
    sector: 'Frutas Tropicales',
    productosPrincipales: ['Aguacate Hass Extra', 'Mora Silvestre', 'Granadilla', 'Tomate de Árbol'],
    esOrganicoCertificado: true,
    verificadoHacienda: true,
    coordenadaCroquis: { x: 22, y: 35 }
  },
  {
    id: 'puesto-02',
    numeroPuesto: 'P-18',
    productorNombre: 'Doña Miriam Fallas Castro',
    cedulaProductor: '106920145',
    fincaOrigen: 'Huerta Los Cipreses',
    cantonOrigen: 'Zarcero (Alajuela)',
    sector: 'Verduras y Hortalizas',
    productosPrincipales: ['Zanahoria Baby', 'Lechuga Romana', 'Brócoli', 'Espinaca Tierna'],
    esOrganicoCertificado: true,
    verificadoHacienda: true,
    coordenadaCroquis: { x: 45, y: 35 }
  },
  {
    id: 'puesto-03',
    numeroPuesto: 'P-29',
    productorNombre: 'CoopeLácteos del Volcán R.L.',
    cedulaProductor: '3004123456',
    fincaOrigen: 'Pastizales de Turrialba',
    cantonOrigen: 'Turrialba (Cartago)',
    sector: 'Lácteos y Quesos',
    productosPrincipales: ['Queso Turrialba con Denominación de Origen', 'Natilla Casera', 'Queso Palmito'],
    esOrganicoCertificado: false,
    verificadoHacienda: true,
    coordenadaCroquis: { x: 75, y: 40 }
  },
  {
    id: 'puesto-04',
    numeroPuesto: 'P-44',
    productorNombre: 'Soda La Tradición Campesina',
    cedulaProductor: '109980412',
    fincaOrigen: 'Cocina Comunal',
    cantonOrigen: 'San José',
    sector: 'Sodas y Comidas',
    productosPrincipales: ['Chorreadas con Natilla', 'Empanadas de Chiverre', 'Agua de Sapo', 'Pozol Criollo'],
    esOrganicoCertificado: false,
    verificadoHacienda: true,
    coordenadaCroquis: { x: 80, y: 80 }
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
        esVerificadoHacienda: pyme.esVerificadoHacienda,
        whatsapp: pyme.whatsappNumero,
        telefono: pyme.telefono
      }
    }))
  };
}
