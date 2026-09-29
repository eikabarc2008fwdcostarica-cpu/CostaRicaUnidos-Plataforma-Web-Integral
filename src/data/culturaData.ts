/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 03: IDENTIDAD CULTURAL, TRADICIONES E HIMNOS
 * Base de datos representativa de himnos sincronizados, partituras y patrimonio
 * ============================================================================
 */

export interface HitoHistorico {
  id: string;
  anno: string;
  fechaExacta?: string;
  decretoRespaldo?: string;
  epoca: 'Precolombina' | 'Colonial' | 'Fundacional' | 'Siglo XX' | 'Contemporánea';
  titulo: string;
  descripcion: string;
  impacto: string;
  impactoDistrital?: string;
  icono?: string;
}

export interface SimboloHistorico {
  id: string;
  tipo: 'escudo' | 'bandera';
  epoca: string;
  nombre: string;
  descripcion: string;
  significadoColores: { elemento: string; color: string; significado: string }[];
  fechaAdopcion: string;
  svgIcon: string;
}

export interface EstrofaHimno {
  id: number;
  tipo: 'coro' | 'estrofa';
  inicioSegundos: number;
  finSegundos: number;
  versos: string[];
}

export interface PartituraDetalle {
  tonalidad: string;
  compas: string;
  tempo: string;
  instrumentacion: string;
  transcripcionOficial: string;
}

export interface HimnoOficial {
  cantonId: number;
  cantonNombre: string;
  titulo: string;
  autorLetra: string;
  autorMusica: string;
  annoDeclaratoria: string;
  audioUrl: string;
  partituraUrl: string;
  partituraDetalle?: PartituraDetalle;
  estrofas: EstrofaHimno[];
}

export interface ResennaFundacional {
  cantonNombre: string;
  cantonId: number;
  leyCreacion: string;
  fechaFundacion: string;
  tituloCiudadFecha: string;
  presidenteAdministracion: string;
  cabecera: string;
  superficieKm2: number;
  poblacionHabitantes: string;
  distritosOficiales: string[];
  lemaOficial: string;
  escudoDescripcionBlason: string;
  banderaDescripcion: string;
  banderaColores: { nombre: string; hex: string; significado: string }[];
}

export interface ElementoPatrimonio {
  id: string;
  nombre: string;
  categoria: 'Tradición Oral & Leyendas' | 'Celebraciones y Fiestas' | 'Gastronomía Tradicional' | 'Música y Danzas' | 'Artesanías';
  canton: string;
  provincia: string;
  descripcion: string;
  origenHistorico: string;
  importanciaCultural: string;
  portadoresTradicion: string;
  imagenUrl: string;
  iconoCategoria: string;
}

export const RESENNAS_FUNDACIONALES: Record<string, ResennaFundacional> = {
  'San José': {
    cantonNombre: 'San José',
    cantonId: 1,
    leyCreacion: 'Ley N° 30 de Ordenanzas Municipales (7 de diciembre de 1848)',
    fechaFundacion: '21 de mayo de 1737 (Erección Ermita de La Boca del Monte)',
    tituloCiudadFecha: '16 de octubre de 1813 (Cortes de Cádiz) / Ratificado el 8 de junio de 1820',
    presidenteAdministracion: 'Dr. José María Castro Madriz (Fundador de la República)',
    cabecera: 'Distrito El Carmen (Sede del Palacio Municipal)',
    superficieKm2: 44.62,
    poblacionHabitantes: '352,366 hab.',
    distritosOficiales: [
      'Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote',
      'San Francisco de Dos Ríos', 'Uruca', 'Mata Redonda', 'Pavas', 'Hatillo', 'San Sebastián'
    ],
    lemaOficial: 'Capital Soberana, Democrática y Faro de la Educación Republicana',
    escudoDescripcionBlason: 'Escudo español cuartelado con bordura de oro. En el primer cuartel, la rueda dentada sobre fondo azul que simboliza el trabajo industrial y comercial; en el segundo, cinco estrellas de plata en representación de la unión centroamericana de 1821; en el tercero, ramas de café en flor, motor económico fundacional; y en el cuarto, la antorcha encendida de la libertad cívica y la paz republicana.',
    banderaDescripcion: 'Pabellón cantonal conformado por dos franjas horizontales de igual dimensión: superior en azul cobalto soberano e inferior en blanco cívico, timbrado al centro por el escudo oficial cantonal.',
    banderaColores: [
      { nombre: 'Azul Soberano', hex: '#002B7F', significado: 'El cielo límpido del Valle Central y la lealtad inquebrantable a las instituciones democráticas.' },
      { nombre: 'Blanco Cívico', hex: '#FFFFFF', significado: 'La paz permanente sin ejército, la concordia civil y la transparencia en el ejercicio del gobierno local.' }
    ]
  },
  'Alajuela': {
    cantonNombre: 'Alajuela',
    cantonId: 2,
    leyCreacion: 'Ley N° 30 de Ordenanzas Municipales (7 de diciembre de 1848)',
    fechaFundacion: '12 de octubre de 1782 (Oratorio de La Lajuela)',
    tituloCiudadFecha: '23 de noviembre de 1824 (Congreso Constituyente)',
    presidenteAdministracion: 'Dr. José María Castro Madriz',
    cabecera: 'Alajuela Centro',
    superficieKm2: 388.43,
    poblacionHabitantes: '312,500 hab.',
    distritosOficiales: [
      'Alajuela', 'San José', 'Carrizal', 'San Antonio', 'Guácima',
      'San Isidro', 'Sabanilla', 'San Rafael', 'Río Segundo', 'Desamparados', 'Turrúcares', 'Tambor', 'Garita', 'Sarapiquí'
    ],
    lemaOficial: 'Cuna de Juan Santamaría y Baluarte de la Libertad Nacional',
    escudoDescripcionBlason: 'Blasón en esmalte rojo gules con la tea fulgurante de Juan Santamaría en el corazón, orlada por ramas de laurel y la inscripción solemne de la gesta heroica del 11 de abril de 1856.',
    banderaDescripcion: 'Bicolor rojo y negro con disposición horizontal, cargada al cantón con la antorcha cívica de la soberanía.',
    banderaColores: [
      { nombre: 'Rojo Heroico', hex: '#D31424', significado: 'El sacrificio y la valentía del pueblo alajuelense en defensa de la soberanía centroamericana.' },
      { nombre: 'Negro Soberano', hex: '#111827', significado: 'La firmeza de sus convicciones cívicas y la constancia de sus agricultores.' }
    ]
  },
  'Cartago': {
    cantonNombre: 'Cartago',
    cantonId: 3,
    leyCreacion: 'Ley N° 30 de Ordenanzas Municipales (7 de diciembre de 1848)',
    fechaFundacion: 'Marzo de 1563 (Por el Conquistador Juan Vázquez de Coronado)',
    tituloCiudadFecha: '1565 (Por Cédula Real de Felipe II como "Muy Noble y Muy Leal Ciudad")',
    presidenteAdministracion: 'Dr. José María Castro Madriz',
    cabecera: 'Cartago (Oriental / Occidental)',
    superficieKm2: 287.77,
    poblacionHabitantes: '163,800 hab.',
    distritosOficiales: [
      'Oriental', 'Occidental', 'Carmen', 'San Nicolás', 'Aguacaliente',
      'Guadalupe', 'Corralillo', 'Tierra Blanca', 'Dulce Nombre', 'Llano Grande', 'Quebradilla'
    ],
    lemaOficial: 'Cuna de la Patria, Custodia de las Tradiciones y la Fe Republicana',
    escudoDescripcionBlason: 'Escudo histórico otorgado por el Rey Felipe II en 1565 con cruz paté en gules, dos leones rampantes en oro y corona real sobre campo azur.',
    banderaDescripcion: 'Paño azul y rojo con cruz central que simboliza la herencia de la Vieja Metrópoli y el arraigo cultural del Valle de El Guarco.',
    banderaColores: [
      { nombre: 'Azul Colonial', hex: '#0A3282', significado: 'La devoción cívica, la serenidad del Irazú y las aguas del río Reventazón.' },
      { nombre: 'Rojo Patriótico', hex: '#CE1126', significado: 'El fervor de los primeros cabildos abiertos y la independencia de 1821.' }
    ]
  }
};

export const CULTURA_MOCK_DATA: {
  hitos: Record<number, HitoHistorico[]>;
  simbolos: Record<number, SimboloHistorico[]>;
  himnos: Record<number, HimnoOficial>;
  patrimonio: ElementoPatrimonio[];
} = {
  hitos: {
    1: [ // San José
      {
        id: 'hito-1',
        anno: '1561',
        epoca: 'Precolombina',
        titulo: 'Valle de los Huetares y Cacique Garabito',
        descripcion: 'Territorio ancestral bajo dominio de los caciques Garabito y Pacaca, caracterizado por senderos de intercambio y respeto ecológico.',
        impacto: 'Herencia toponímica y base pluricultural originaria del Valle Central.'
      },
      {
        id: 'hito-2',
        anno: '1737',
        epoca: 'Colonial',
        titulo: 'Erección de la Ermita de La Boca del Monte',
        descripcion: 'Por orden del cabildo eclesiástico se congrega a los pobladores dispersos de Aserrí y Barva en La Boca del Monte, origen de la actual capital.',
        impacto: 'Nacimiento formal de la aldea que daría pie a la ciudad de San José.'
      },
      {
        id: 'hito-3',
        anno: '1823',
        epoca: 'Fundacional',
        titulo: 'Batalla de Ochomogo y Capitalidad Soberana',
        descripcion: 'Tras la independencia, las fuerzas republicanas josefinas vencen a las monárquicas, trasladando permanentemente la capital de Cartago a San José.',
        impacto: 'Establecimiento de San José como capital republicana y sede democrática de Costa Rica.'
      },
      {
        id: 'hito-4',
        anno: '1884',
        epoca: 'Siglo XX',
        titulo: 'Pionera Mundial en Electrificación Pública',
        descripcion: 'San José se convierte en la tercera ciudad del planeta (después de Nueva York y París) en iluminar sus calles con energía hidroeléctrica limpia.',
        impacto: 'Impulso modernizador, seguridad cívica nocturna y vanguardia energética nacional.'
      },
      {
        id: 'hito-5',
        anno: '1897',
        epoca: 'Siglo XX',
        titulo: 'Inauguración del Teatro Nacional de Costa Rica',
        descripcion: 'Construido por los propios ciudadanos financiado con un impuesto voluntario a la exportación de café, joya renacentista del continente.',
        impacto: 'Santuario de las artes, la ópera y la diplomacia cultural soberana.'
      },
      {
        id: 'hito-6',
        anno: '2026',
        epoca: 'Contemporánea',
        titulo: 'Integración en Costa Rica Unidos',
        descripcion: 'Unificación de los 11 distritos josefinos en la plataforma cívica sovereign glass para trámites directos, actas en tiempo real e itinerarios 3D.',
        impacto: 'Eliminación de la fragmentación digital ciudadana e inclusión plena con Ley 7600.'
      }
    ]
  },

  simbolos: {
    1: [
      {
        id: 'simb-escudo-oficial',
        tipo: 'escudo',
        epoca: 'Oficial Vigente (Siglo XX - XXI)',
        nombre: 'Escudo Heráldico de San José',
        descripcion: 'Emblema institucional que honra la estrella de la capitalidad, la rueda de la industria y la antorcha de la libertad cívica.',
        fechaAdopcion: 'Acuerdo Municipal de 1904',
        significadoColores: [
          { elemento: 'Fondo Azul Soberano', color: '#002B7F', significado: 'Lealtad cívica, cielo patrio y serenidad republicana.' },
          { elemento: 'Borde Oro', color: '#FFC700', significado: 'Nobleza de las instituciones y riqueza cultural de su gente.' },
          { elemento: 'Cinco Estrellas Plateadas', color: '#FFFFFF', significado: 'Las cinco naciones centroamericanas de la gesta de 1821.' },
          { elemento: 'Rueda Alada', color: '#E2E8F0', significado: 'Progreso urbano, comercio y modernización continua.' }
        ],
        svgIcon: 'escudo-moderno'
      },
      {
        id: 'simb-escudo-historico',
        tipo: 'escudo',
        epoca: 'Escudo Fundacional de San José (1848)',
        nombre: 'Escudo de Armas Colonial y Primera República',
        descripcion: 'Diseño original con el monograma de San José Obrero y las ramas de café en flor, motor económico pionero.',
        fechaAdopcion: 'Decreto Soberano del Dr. José María Castro Madriz',
        significadoColores: [
          { elemento: 'Verde Cafetal', color: '#05853B', significado: 'El grano de oro que financió la educación y el Teatro Nacional.' },
          { elemento: 'Banda Roja', color: '#D31424', significado: 'La sangre derramada en defensa de la soberanía patria.' }
        ],
        svgIcon: 'escudo-antiguo'
      },
      {
        id: 'simb-bandera-oficial',
        tipo: 'bandera',
        epoca: 'Pabellón Cantonal Oficial',
        nombre: 'Bandera del Cantón Central de San José',
        descripcion: 'Compuesta por dos franjas horizontales iguales: azul cobalto en la parte superior y blanco en la inferior, con el escudo en su corazón.',
        fechaAdopcion: '1904 (Ratificada en 1998)',
        significadoColores: [
          { elemento: 'Franja Azul', color: '#002B7F', significado: 'El cielo diáfano de la meseta central y la vocación democrática.' },
          { elemento: 'Franja Blanca', color: '#FFFFFF', significado: 'La paz permanente y la pureza de los procesos electorales locales.' }
        ],
        svgIcon: 'bandera-canton'
      }
    ]
  },

  himnos: {
    1: {
      cantonId: 1,
      cantonNombre: 'San José',
      titulo: 'Himno a San José',
      autorLetra: 'Carlos Luis Sáenz Elizondo',
      autorMusica: 'César Nieto',
      annoDeclaratoria: '1954',
      audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3', // Audio cívico instrumental accesible
      partituraUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1200&q=80',
      estrofas: [
        {
          id: 1,
          tipo: 'coro',
          inicioSegundos: 0,
          finSegundos: 16,
          versos: [
            '¡Salve, cuna de nobles anhelos,',
            'San José, de la patria honor!',
            'Bajo el límpido azul de tus cielos,',
            'arde viva la llama del amor.'
          ]
        },
        {
          id: 2,
          tipo: 'estrofa',
          inicioSegundos: 17,
          finSegundos: 35,
          versos: [
            'Fuiste aldea de fe y labranza,',
            'en La Boca del Monte de ayer,',
            'y hoy levantas con fiera pujanza',
            'el santuario del arte y saber.'
          ]
        },
        {
          id: 3,
          tipo: 'estrofa',
          inicioSegundos: 36,
          finSegundos: 54,
          versos: [
            'Tus campanas cantaron victoria',
            'cuando el pueblo su senda trazó,',
            'y en el libro inmortal de la historia',
            'tu civismo por siempre brilló.'
          ]
        },
        {
          id: 4,
          tipo: 'coro',
          inicioSegundos: 55,
          finSegundos: 75,
          versos: [
            '¡Salve, cuna de nobles anhelos,',
            'San José, de la patria honor!',
            'Bajo el límpido azul de tus cielos,',
            'arde viva la llama del amor.'
          ]
        }
      ]
    }
  },

  patrimonio: [
    {
      id: 'patrimonio-1',
      nombre: 'La Mascarada Tradicional y el Baile de los Gigantes',
      categoria: 'Celebraciones y Fiestas',
      canton: 'San José (Aserri, Escazú y Barva)',
      provincia: 'San José / Heredia',
      descripcion: 'Danza popular festiva con figuras gigantes de papel maché y barro (el Diablo, la Calavera, la Giganta) al compás de la cimarrona costarricense.',
      origenHistorico: 'Tradición mestiza originada en el siglo XIX que fusiona el arte teatral colonial con el folclor indígena y campesino.',
      importanciaCultural: 'Declarado Símbolo Nacional de Costa Rica en 2022 y manifestación central del 31 de octubre (Día Nacional de la Mascarada).',
      portadoresTradicion: 'Familias artesanas mascareras de Escazú, Desamparados y Cartago.',
      imagenUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      iconoCategoria: 'celebracion'
    },
    {
      id: 'patrimonio-2',
      nombre: 'Leyenda de la Bruja Zárate y el Cerro de las Tres Cruces',
      categoria: 'Tradición Oral & Leyendas',
      canton: 'Escazú / San José',
      provincia: 'San José',
      descripcion: 'Relato mítico de una curandera mágica con saberes botánicos ancestrales que habitaba en las cavernas de los Cerros de Escazú protegiendo a los campesinos.',
      origenHistorico: 'Tradición oral del siglo XVIII que dio a Escazú su apodo mundial de "La Ciudad de las Brujas".',
      importanciaCultural: 'Preserva la memoria herbolaria indígena huetar y la resistencia comunitaria frente a imposiciones coloniales.',
      portadoresTradicion: 'Abuelos cuentacuentos y centros de cultura comunitaria de San Antonio de Escazú.',
      imagenUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
      iconoCategoria: 'oral'
    },
    {
      id: 'patrimonio-3',
      nombre: 'El Chifrijo Josefino de Barrio Escalante',
      categoria: 'Gastronomía Tradicional',
      canton: 'San José (Carmen y Montes de Oca)',
      provincia: 'San José',
      descripcion: 'Platillo icónico creado en las cantinas josefinas: chicharrón de cerdo crujiente, frijoles tiernos, arroz, pico de gallo y aguacate con chips de plátano.',
      origenHistorico: 'Surgido en la década de 1970 en el bar Cordero de Tibás, hoy extendido a toda la identidad culinaria costarricense.',
      importanciaCultural: 'Patrimonio de la gastronomía urbana costarricense y atractivo turístico gastronómico central de San José.',
      portadoresTradicion: 'Cocineros populares y fondas del Mercado Central de San José.',
      imagenUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      iconoCategoria: 'gastronomia'
    },
    {
      id: 'patrimonio-4',
      nombre: 'Tradición del Boyeo y la Carreta Típica Pintada',
      categoria: 'Artesanías',
      canton: 'San José / Sarchí / Escazú',
      provincia: 'Valle Central',
      descripcion: 'Arte de conducir yuntas de bueyes decorando las carretas con elaborados arabescos geométricos y colores florales vivos.',
      origenHistorico: 'Medio de transporte pionero del café hacia los puertos de Puntarenas y Limón durante el siglo XIX.',
      importanciaCultural: 'Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad declarada por la UNESCO.',
      portadoresTradicion: 'Boyeros tradicionales y artesanos pintores de carretas.',
      imagenUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      iconoCategoria: 'artesania'
    }
  ]
};

export function getResennaFundacional(cantonNombre: string = 'San José'): ResennaFundacional {
  if (RESENNAS_FUNDACIONALES[cantonNombre]) {
    return RESENNAS_FUNDACIONALES[cantonNombre];
  }
  // Fallback con datos institucionales adaptados al cantón consultado
  return {
    cantonNombre,
    cantonId: 1,
    leyCreacion: 'Ley N° 30 de Ordenanzas Municipales (7 de diciembre de 1848)',
    fechaFundacion: 'Erección Municipal Histórica del Cantón',
    tituloCiudadFecha: 'Declaratoria Oficial por el Congreso Constitucional',
    presidenteAdministracion: 'Dr. José María Castro Madriz',
    cabecera: `${cantonNombre} Centro`,
    superficieKm2: 85.5,
    poblacionHabitantes: '82,400 hab.',
    distritosOficiales: [`${cantonNombre} Centro`, 'Distrito 2', 'Distrito 3', 'Distrito 4'],
    lemaOficial: `Honor, Democracia y Trabajo en el Cantón de ${cantonNombre}`,
    escudoDescripcionBlason: `Blasón oficial del cantón de ${cantonNombre} con bordura en oro, cuarteles de honor patrio y la antorcha cívica de la libertad democrática costarricense.`,
    banderaDescripcion: `Pabellón cantonal de dos franjas emblemáticas que representan el civismo y la paz del gobierno local de ${cantonNombre}.`,
    banderaColores: [
      { nombre: 'Azul Institucional', hex: '#002B7F', significado: 'La lealtad inquebrantable a las leyes de la República y la democracia local.' },
      { nombre: 'Blanco Cívico', hex: '#FFFFFF', significado: 'La paz, la concordia civil y la transparencia activa.' }
    ]
  };
}

export function getHitosCanton(cantonId: number = 1): HitoHistorico[] {
  return CULTURA_MOCK_DATA.hitos[cantonId] || CULTURA_MOCK_DATA.hitos[1];
}

export function getSimbolosCanton(cantonId: number = 1): SimboloHistorico[] {
  return CULTURA_MOCK_DATA.simbolos[cantonId] || CULTURA_MOCK_DATA.simbolos[1];
}

export function getHimnoCanton(cantonId: number = 1): HimnoOficial {
  return CULTURA_MOCK_DATA.himnos[cantonId] || CULTURA_MOCK_DATA.himnos[1];
}

export function getPatrimonioInmaterial(): ElementoPatrimonio[] {
  return CULTURA_MOCK_DATA.patrimonio;
}
