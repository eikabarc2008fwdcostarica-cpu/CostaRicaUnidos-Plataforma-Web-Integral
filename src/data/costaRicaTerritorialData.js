/**
 * COSTA RICA UNIDOS — Base de Datos Territorial Oficial
 * Cobertura DTA (División Territorial Administrativa - INEC / TSE)
 * 7 Provincias | 84 Cantones Oficiales | Temas Emblemáticos Provinciales
 */

export const PROVINCIAS_DATA = [
  {
    id: 1,
    codigo: 'SJ',
    nombre: 'San José',
    cabecera: 'San José (Distrito Carmen)',
    lema: 'Capital Soberana y Corazón Institucional',
    color: '#601438', // Saprissa Morado Emblemático
    colorSecundario: '#FFFFFF',
    colorAcento: '#C99700',
    textColor: '#FFFFFF',
    club: 'Deportivo Saprissa',
    apodo: 'Monstruo Morado / Josefinos',
    cantonesCount: 20,
    distritosCount: 123,
    poblacion: '1,653,000 hab.',
    superficie: '4,965.9 km²',
    obrasActivas: 42,
    presupuestoAsignado: '₡ 148,250 M',
    descripcion: 'Sede de los tres poderes de la República, centro financiero y neurálgico de la administración cívica de Costa Rica.'
  },
  {
    id: 2,
    codigo: 'AL',
    nombre: 'Alajuela',
    cabecera: 'Alajuela',
    lema: 'Tierra de Juan Santamaría y Eje Agroindustrial',
    color: '#D31424', // LDA Rojo Rojinegro
    colorSecundario: '#000000',
    colorAcento: '#FFFFFF',
    textColor: '#FFFFFF',
    club: 'Liga Deportiva Alajuelense',
    apodo: 'León Manudo / Erizos',
    cantonesCount: 16,
    distritosCount: 116,
    poblacion: '1,035,000 hab.',
    superficie: '9,757.5 km²',
    obrasActivas: 38,
    presupuestoAsignado: '₡ 112,400 M',
    descripcion: 'Pórtico aéreo internacional, potencia agropecuaria norteña y hogar del recién fundado cantón de Río Cuarto.'
  },
  {
    id: 3,
    codigo: 'CA',
    nombre: 'Cartago',
    cabecera: 'Cartago (Oriental/Occidental)',
    lema: 'Cuna de la Historia Patria y Tradición Cívica',
    color: '#0A3282', // Club Sport Cartaginés Azul
    colorSecundario: '#FFFFFF',
    colorAcento: '#001844',
    textColor: '#FFFFFF',
    club: 'C.S. Cartaginés',
    apodo: 'Brumosos / La Vieja Metrópoli',
    cantonesCount: 8,
    distritosCount: 51,
    poblacion: '545,000 hab.',
    superficie: '3,124.7 km²',
    obrasActivas: 21,
    presupuestoAsignado: '₡ 64,800 M',
    descripcion: 'Antigua capital colonial, guardiana del acta de independencia, valle hortícola y polo biotecnológico nacional.'
  },
  {
    id: 4,
    codigo: 'HE',
    nombre: 'Heredia',
    cabecera: 'Heredia',
    lema: 'Ciudad de las Flores y Vértice Tecnológico',
    color: '#FFC700', // CSH Amarillo Rojiamarillo
    colorSecundario: '#D31424',
    colorAcento: '#940A15',
    textColor: '#0B0D17', // Alto contraste WCAG AA sobre amarillo
    club: 'C.S. Herediano',
    apodo: 'El Team Florense / Rojiamarillos',
    cantonesCount: 10,
    distritosCount: 47,
    poblacion: '520,000 hab.',
    superficie: '2,657.0 km²',
    obrasActivas: 29,
    presupuestoAsignado: '₡ 78,300 M',
    descripcion: 'Epicentro de parques tecnológicos globales, zonas francas de vanguardia y rica tradición cafetalera de altura.'
  },
  {
    id: 5,
    codigo: 'GU',
    nombre: 'Guanacaste',
    cabecera: 'Liberia',
    lema: 'Savia de la Anexión, Sol y Energía Renovable',
    color: '#05853B', // ADG Guanacasteca Verde
    colorSecundario: '#CE1126',
    colorAcento: '#FFD100',
    textColor: '#FFFFFF',
    club: 'A.D. Guanacasteca',
    apodo: 'La Furia Pampera / Nicoyanos',
    cantonesCount: 11,
    distritosCount: 61,
    poblacion: '400,000 hab.',
    superficie: '10,140.7 km²',
    obrasActivas: 26,
    presupuestoAsignado: '₡ 59,100 M',
    descripcion: '200 años de la Anexión del Partido de Nicoya. Bastión geotérmico, eólico y destino de turismo sustentable.'
  },
  {
    id: 6,
    codigo: 'PU',
    nombre: 'Puntarenas',
    cabecera: 'Puntarenas',
    lema: 'La Perla del Pacífico, Puertos y Biodiversidad Osa',
    color: '#F36717', // PFC Puntarenas FC Naranja
    colorSecundario: '#002B7F',
    colorAcento: '#FFFFFF',
    textColor: '#0B0D17', // Alto contraste WCAG AA sobre naranja vivo
    club: 'Puntarenas F.C.',
    apodo: 'Tiburones Chuchequeros / Porteños',
    cantonesCount: 13,
    distritosCount: 60,
    poblacion: '500,000 hab.',
    superficie: '11,266.0 km²',
    obrasActivas: 34,
    presupuestoAsignado: '₡ 71,900 M',
    descripcion: 'Mayor extensión costera del país, santuario biológico mundial en Corcovado e incluye los cantones de Monteverde y Puerto Jiménez.'
  },
  {
    id: 7,
    codigo: 'LI',
    nombre: 'Limón',
    cabecera: 'Limón (Puerto Limón)',
    lema: 'Pórtico Caribeño, Riqueza Pluricultural y Portuaria',
    color: '#349E35', // Limón FC Verde Caribe
    colorSecundario: '#FFD700',
    colorAcento: '#002B7F',
    textColor: '#FFFFFF',
    club: 'Limón F.C. / Caribe',
    apodo: 'La Tromba del Caribe / Limonenses',
    cantonesCount: 6,
    distritosCount: 30,
    poblacion: '450,000 hab.',
    superficie: '9,188.5 km²',
    obrasActivas: 25,
    presupuestoAsignado: '₡ 82,600 M',
    descripcion: 'Principal salida marítima para las exportaciones nacionales (APM Terminals / JAPDEVA), herencia afrocostarricense y reservas indígenas.'
  }
];

export const TEMA_NACIONAL = {
  id: 0,
  codigo: 'CR',
  nombre: 'Costa Rica Soberana',
  cabecera: 'Nación Entera',
  lema: 'Soberanía, Democracia y Paz Republicana',
  color: '#002B7F',
  colorSecundario: '#CE1126',
  colorAcento: '#F8FAFC',
  textColor: '#FFFFFF',
  club: 'Selección Nacional Tricolor',
  apodo: 'La Sele / Los Ticos',
  cantonesCount: 84,
  distritosCount: 492,
  poblacion: '5,200,000 hab.',
  superficie: '51,100 km²',
  obrasActivas: 215,
  presupuestoAsignado: '₡ 617,450 M',
  descripcion: 'Visión unificada y soberana de las 7 provincias, 84 cantones y 492 distritos bajo el sistema Sovereign Civic Glass v2.1.'
};

/**
 * Catálogo completo de los 84 Cantones Oficiales de Costa Rica
 * Incluye los cantones de reciente creación: Río Cuarto (216), Monteverde (612) y Puerto Jiménez (613).
 */
export const CANTONES_OFICIALES = [
  // 1. San José (20)
  { id: 1, provinciaId: 1, nombre: 'San José', codigoDta: '101', cabecera: 'Carmen' },
  { id: 2, provinciaId: 1, nombre: 'Escazú', codigoDta: '102', cabecera: 'Escazú' },
  { id: 3, provinciaId: 1, nombre: 'Desamparados', codigoDta: '103', cabecera: 'Desamparados' },
  { id: 4, provinciaId: 1, nombre: 'Puriscal', codigoDta: '104', cabecera: 'Santiago' },
  { id: 5, provinciaId: 1, nombre: 'Tarrazú', codigoDta: '105', cabecera: 'San Marcos' },
  { id: 6, provinciaId: 1, nombre: 'Aserrí', codigoDta: '106', cabecera: 'Aserrí' },
  { id: 7, provinciaId: 1, nombre: 'Mora', codigoDta: '107', cabecera: 'Ciudad Colón' },
  { id: 8, provinciaId: 1, nombre: 'Goicoechea', codigoDta: '108', cabecera: 'Guadalupe' },
  { id: 9, provinciaId: 1, nombre: 'Santa Ana', codigoDta: '109', cabecera: 'Santa Ana' },
  { id: 10, provinciaId: 1, nombre: 'Alajuelita', codigoDta: '110', cabecera: 'Alajuelita' },
  { id: 11, provinciaId: 1, nombre: 'Vásquez de Coronado', codigoDta: '111', cabecera: 'San Isidro' },
  { id: 12, provinciaId: 1, nombre: 'Acosta', codigoDta: '112', cabecera: 'San Ignacio' },
  { id: 13, provinciaId: 1, nombre: 'Tibás', codigoDta: '113', cabecera: 'San Juan' },
  { id: 14, provinciaId: 1, nombre: 'Moravia', codigoDta: '114', cabecera: 'San Vicente' },
  { id: 15, provinciaId: 1, nombre: 'Montes de Oca', codigoDta: '115', cabecera: 'San Pedro' },
  { id: 16, provinciaId: 1, nombre: 'Turrubares', codigoDta: '116', cabecera: 'San Pablo' },
  { id: 17, provinciaId: 1, nombre: 'Dota', codigoDta: '117', cabecera: 'Santa María' },
  { id: 18, provinciaId: 1, nombre: 'Curridabat', codigoDta: '118', cabecera: 'Curridabat' },
  { id: 19, provinciaId: 1, nombre: 'Pérez Zeledón', codigoDta: '119', cabecera: 'San Isidro de El General' },
  { id: 20, provinciaId: 1, nombre: 'León Cortés Castro', codigoDta: '120', cabecera: 'San Pablo' },

  // 2. Alajuela (16)
  { id: 1, provinciaId: 2, nombre: 'Alajuela', codigoDta: '201', cabecera: 'Alajuela' },
  { id: 2, provinciaId: 2, nombre: 'San Ramón', codigoDta: '202', cabecera: 'San Ramón' },
  { id: 3, provinciaId: 2, nombre: 'Grecia', codigoDta: '203', cabecera: 'Grecia' },
  { id: 4, provinciaId: 2, nombre: 'San Mateo', codigoDta: '204', cabecera: 'San Mateo' },
  { id: 5, provinciaId: 2, nombre: 'Atenas', codigoDta: '205', cabecera: 'Atenas' },
  { id: 6, provinciaId: 2, nombre: 'Naranjo', codigoDta: '206', cabecera: 'Naranjo' },
  { id: 7, provinciaId: 2, nombre: 'Palmares', codigoDta: '207', cabecera: 'Palmares' },
  { id: 8, provinciaId: 2, nombre: 'Poás', codigoDta: '208', cabecera: 'San Pedro' },
  { id: 9, provinciaId: 2, nombre: 'Orotina', codigoDta: '209', cabecera: 'Orotina' },
  { id: 10, provinciaId: 2, nombre: 'San Carlos', codigoDta: '210', cabecera: 'Ciudad Quesada' },
  { id: 11, provinciaId: 2, nombre: 'Zarcero', codigoDta: '211', cabecera: 'Zarcero' },
  { id: 12, provinciaId: 2, nombre: 'Sarchí', codigoDta: '212', cabecera: 'Sarchí Norte' },
  { id: 13, provinciaId: 2, nombre: 'Upala', codigoDta: '213', cabecera: 'Upala' },
  { id: 14, provinciaId: 2, nombre: 'Los Chiles', codigoDta: '214', cabecera: 'Los Chiles' },
  { id: 15, provinciaId: 2, nombre: 'Guatuso', codigoDta: '215', cabecera: 'San Rafael' },
  { id: 16, provinciaId: 2, nombre: 'Río Cuarto', codigoDta: '216', cabecera: 'Río Cuarto' },

  // 3. Cartago (8)
  { id: 1, provinciaId: 3, nombre: 'Cartago', codigoDta: '301', cabecera: 'Oriental' },
  { id: 2, provinciaId: 3, nombre: 'Paraíso', codigoDta: '302', cabecera: 'Paraíso' },
  { id: 3, provinciaId: 3, nombre: 'La Unión', codigoDta: '303', cabecera: 'Tres Ríos' },
  { id: 4, provinciaId: 3, nombre: 'Jiménez', codigoDta: '304', cabecera: 'Juan Viñas' },
  { id: 5, provinciaId: 3, nombre: 'Turrialba', codigoDta: '305', cabecera: 'Turrialba' },
  { id: 6, provinciaId: 3, nombre: 'Alvarado', codigoDta: '306', cabecera: 'Pacayas' },
  { id: 7, provinciaId: 3, nombre: 'Oreamuno', codigoDta: '307', cabecera: 'San Rafael' },
  { id: 8, provinciaId: 3, nombre: 'El Guarco', codigoDta: '308', cabecera: 'El Tejar' },

  // 4. Heredia (10)
  { id: 1, provinciaId: 4, nombre: 'Heredia', codigoDta: '401', cabecera: 'Heredia' },
  { id: 2, provinciaId: 4, nombre: 'Barva', codigoDta: '402', cabecera: 'Barva' },
  { id: 3, provinciaId: 4, nombre: 'Santo Domingo', codigoDta: '403', cabecera: 'Santo Domingo' },
  { id: 4, provinciaId: 4, nombre: 'Santa Bárbara', codigoDta: '404', cabecera: 'Santa Bárbara' },
  { id: 5, provinciaId: 4, nombre: 'San Rafael', codigoDta: '405', cabecera: 'San Rafael' },
  { id: 6, provinciaId: 4, nombre: 'San Isidro', codigoDta: '406', cabecera: 'San Isidro' },
  { id: 7, provinciaId: 4, nombre: 'Belén', codigoDta: '407', cabecera: 'San Antonio' },
  { id: 8, provinciaId: 4, nombre: 'Flores', codigoDta: '408', cabecera: 'San Joaquín' },
  { id: 9, provinciaId: 4, nombre: 'San Pablo', codigoDta: '409', cabecera: 'San Pablo' },
  { id: 10, provinciaId: 4, nombre: 'Sarapiquí', codigoDta: '410', cabecera: 'Puerto Viejo' },

  // 5. Guanacaste (11)
  { id: 1, provinciaId: 5, nombre: 'Liberia', codigoDta: '501', cabecera: 'Liberia' },
  { id: 2, provinciaId: 5, nombre: 'Nicoya', codigoDta: '502', cabecera: 'Nicoya' },
  { id: 3, provinciaId: 5, nombre: 'Santa Cruz', codigoDta: '503', cabecera: 'Santa Cruz' },
  { id: 4, provinciaId: 5, nombre: 'Bagaces', codigoDta: '504', cabecera: 'Bagaces' },
  { id: 5, provinciaId: 5, nombre: 'Carrillo', codigoDta: '505', cabecera: 'Filadelfia' },
  { id: 6, provinciaId: 5, nombre: 'Cañas', codigoDta: '506', cabecera: 'Cañas' },
  { id: 7, provinciaId: 5, nombre: 'Abangares', codigoDta: '507', cabecera: 'Las Juntas' },
  { id: 8, provinciaId: 5, nombre: 'Tilarán', codigoDta: '508', cabecera: 'Tilarán' },
  { id: 9, provinciaId: 5, nombre: 'Nandayure', codigoDta: '509', cabecera: 'Carmona' },
  { id: 10, provinciaId: 5, nombre: 'La Cruz', codigoDta: '510', cabecera: 'La Cruz' },
  { id: 11, provinciaId: 5, nombre: 'Hojancha', codigoDta: '511', cabecera: 'Hojancha' },

  // 6. Puntarenas (13)
  { id: 1, provinciaId: 6, nombre: 'Puntarenas', codigoDta: '601', cabecera: 'Puntarenas' },
  { id: 2, provinciaId: 6, nombre: 'Esparza', codigoDta: '602', cabecera: 'Espíritu Santo' },
  { id: 3, provinciaId: 6, nombre: 'Buenos Aires', codigoDta: '603', cabecera: 'Buenos Aires' },
  { id: 4, provinciaId: 6, nombre: 'Montes de Oro', codigoDta: '604', cabecera: 'Miramar' },
  { id: 5, provinciaId: 6, nombre: 'Osa', codigoDta: '605', cabecera: 'Puerto Cortés' },
  { id: 6, provinciaId: 6, nombre: 'Quepos', codigoDta: '606', cabecera: 'Quepos' },
  { id: 7, provinciaId: 6, nombre: 'Golfito', codigoDta: '607', cabecera: 'Golfito' },
  { id: 8, provinciaId: 6, nombre: 'Coto Brus', codigoDta: '608', cabecera: 'San Vito' },
  { id: 9, provinciaId: 6, nombre: 'Parrita', codigoDta: '609', cabecera: 'Parrita' },
  { id: 10, provinciaId: 6, nombre: 'Corredores', codigoDta: '610', cabecera: 'Ciudad Neily' },
  { id: 11, provinciaId: 6, nombre: 'Garabito', codigoDta: '611', cabecera: 'Jacó' },
  { id: 12, provinciaId: 6, nombre: 'Monteverde', codigoDta: '612', cabecera: 'Santa Elena' },
  { id: 13, provinciaId: 6, nombre: 'Puerto Jiménez', codigoDta: '613', cabecera: 'Puerto Jiménez' },

  // 7. Limón (6)
  { id: 1, provinciaId: 7, nombre: 'Limón', codigoDta: '701', cabecera: 'Limón' },
  { id: 2, provinciaId: 7, nombre: 'Pococí', codigoDta: '702', cabecera: 'Guápiles' },
  { id: 3, provinciaId: 7, nombre: 'Siquirres', codigoDta: '703', cabecera: 'Siquirres' },
  { id: 4, provinciaId: 7, nombre: 'Talamanca', codigoDta: '704', cabecera: 'Bribri' },
  { id: 5, provinciaId: 7, nombre: 'Matina', codigoDta: '705', cabecera: 'Matina' },
  { id: 6, provinciaId: 7, nombre: 'Guácimo', codigoDta: '706', cabecera: 'Guácimo' }
];

/**
 * Servicios Cívicos e Institucionales para la barra de búsqueda predictiva
 */
export const SERVICIOS_CIVICOS = [
  {
    id: 's1',
    tipo: 'servicio',
    titulo: 'Auditoría y Fiscalización de Obra Pública (SICOP / MOPT)',
    descripcion: 'Seguimiento financiero, avance físico y contratos viales cantonales.',
    ruta: '/gobernanza',
    badge: 'Fiscalización'
  },
  {
    id: 's2',
    tipo: 'servicio',
    titulo: 'Verificación Tributaria Ministerio de Hacienda (ATV)',
    descripcion: 'Consulta pública de situación fiscal por cédula física o jurídica.',
    ruta: '/portal-ciudadano',
    badge: 'Hacienda'
  },
  {
    id: 's3',
    tipo: 'servicio',
    titulo: 'Visor Cartográfico GIS y Relieve 3D de Cuencas',
    descripcion: 'Análisis topográfico, curvas de nivel y prevención de riesgos de inundación.',
    ruta: '/mapa-gis',
    badge: 'Geotecnología'
  },
  {
    id: 's4',
    tipo: 'servicio',
    titulo: 'Directorio Territorial DTA y Municipalidades',
    descripcion: 'Catálogo oficial de los 84 gobiernos locales y concejos distritales.',
    ruta: '/gobernanza',
    badge: 'Territorio'
  },
  {
    id: 's5',
    tipo: 'servicio',
    titulo: 'Rutas de Abastecimiento: Feria del Agricultor',
    descripcion: 'Mercados comunitarios cantonales, precios de referencia y productores locales.',
    ruta: '/feria',
    badge: 'Comercio'
  },
  {
    id: 's6',
    tipo: 'servicio',
    titulo: 'Reportes Ciudadanos e Incidencias Distritales',
    descripcion: 'Canal de alerta comunitaria para vialidad, alumbrado y servicios públicos.',
    ruta: '/reportar-incidencia',
    badge: 'Comunidad'
  }
];

/**
 * Polígonos vectoriales SVG optimizados y balanceados para el mapa interactivo de Costa Rica.
 * Diseñados sobre un viewBox unificado de 800 x 580 píxeles.
 */
export const MAPA_PROVINCIAS_SVG = [
  {
    provinciaId: 5, // Guanacaste (Noroeste y Península de Nicoya)
    nombre: 'Guanacaste',
    path: 'M 110,75 L 175,70 L 220,110 L 210,175 L 180,215 L 140,240 L 115,310 L 95,300 L 75,245 L 85,190 L 50,165 L 55,125 L 85,115 Z',
    centro: { x: 135, y: 185 },
    labelPos: { x: 135, y: 175 }
  },
  {
    provinciaId: 2, // Alajuela (Norte Central hasta frontera y Valle)
    nombre: 'Alajuela',
    path: 'M 220,110 L 285,60 L 350,75 L 360,140 L 330,195 L 300,230 L 255,240 L 210,175 Z',
    centro: { x: 285, y: 155 },
    labelPos: { x: 280, y: 150 }
  },
  {
    provinciaId: 4, // Heredia (Corredor estrecho hacia el norte y Valle Central)
    nombre: 'Heredia',
    path: 'M 350,75 L 390,80 L 405,145 L 370,210 L 350,235 L 330,195 L 360,140 Z',
    centro: { x: 370, y: 150 },
    labelPos: { x: 368, y: 145 }
  },
  {
    provinciaId: 7, // Limón (Vertiente Atlántica / Caribe Norte y Sur)
    nombre: 'Limón',
    path: 'M 390,80 L 450,110 L 510,185 L 585,280 L 650,370 L 610,400 L 550,335 L 480,260 L 440,215 L 405,145 Z',
    centro: { x: 505, y: 235 },
    labelPos: { x: 505, y: 230 }
  },
  {
    provinciaId: 1, // San José (Valle Central hacia el sur)
    nombre: 'San José',
    path: 'M 255,240 L 300,230 L 350,235 L 370,265 L 360,315 L 325,355 L 295,335 L 280,290 Z',
    centro: { x: 315, y: 285 },
    labelPos: { x: 315, y: 285 }
  },
  {
    provinciaId: 3, // Cartago (Valle del Guarco y zona montañosa)
    nombre: 'Cartago',
    path: 'M 350,235 L 415,225 L 440,260 L 415,310 L 360,315 L 370,265 Z',
    centro: { x: 390, y: 270 },
    labelPos: { x: 390, y: 270 }
  },
  {
    provinciaId: 6, // Puntarenas (Costa Pacífica, Península de Osa y Golfo Dulce)
    path: 'M 180,215 L 255,240 L 280,290 L 295,335 L 325,355 L 360,375 L 430,410 L 500,470 L 565,510 L 540,545 L 475,515 L 420,445 L 340,390 L 260,330 L 205,275 Z',
    nombre: 'Puntarenas',
    centro: { x: 375, y: 410 },
    labelPos: { x: 370, y: 405 }
  }
];

/**
 * Variantes de color de texto provincial para garantizar contraste WCAG 2.1 AA (>= 4.5:1)
 * sobre fondos claros (--cru-card-bg #FFFFFF, --cru-page-bg #F8FAFC, --cru-surface-muted #F1F5F9).
 */
export const PROVINCIAL_LIGHT_TEXT = {
  1: '#601438', // San José (11.59:1 - 12.69:1)
  2: '#991B1B', // Alajuela (7.59:1 - 8.31:1)
  3: '#0A3282', // Cartago (10.70:1 - 11.72:1)
  4: '#92400E', // Heredia (6.47:1 - 7.09:1)
  5: '#065F46', // Guanacaste (7.01:1 - 7.68:1)
  6: '#9A3412', // Puntarenas (6.67:1 - 7.31:1)
  7: '#065F46'  // Limón (7.01:1 - 7.68:1)
};

/**
 * Variantes de color de texto provincial para garantizar contraste WCAG 2.1 AA (>= 4.5:1)
 * sobre fondos oscuros (--cru-card-bg #0D1527, --cru-page-bg #00040D, --cru-surface-muted rgba(255,255,255,0.05)).
 */
export const PROVINCIAL_DARK_TEXT = {
  1: '#F472B6', // San José (6.08:1 - 7.75:1)
  2: '#FF6B6B', // Alajuela (5.80:1 - 7.40:1)
  3: '#60A5FA', // Cartago (6.33:1 - 8.07:1)
  4: '#FFC700', // Heredia (10.29:1 - 13.12:1)
  5: '#34D399', // Guanacaste (8.37:1 - 10.68:1)
  6: '#FB923C', // Puntarenas (7.11:1 - 9.07:1)
  7: '#4ADE80'  // Limón (9.24:1 - 11.78:1)
};

export function getProvincialTextColor(prov, isLight = false) {
  if (!prov) return 'var(--cru-text)';
  const id = prov.id || prov.codigo;
  if (isLight) {
    return PROVINCIAL_LIGHT_TEXT[id] || PROVINCIAL_LIGHT_TEXT[prov.id] || prov.color;
  }
  return PROVINCIAL_DARK_TEXT[id] || PROVINCIAL_DARK_TEXT[prov.id] || prov.color;
}
