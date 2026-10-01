/**
 * ============================================================================
 * COSTA RICA UNIDOS — DICCIONARIO COMPLETO DE INTERNACIONALIZACIÓN (i18n)
 * Cobertura oficial para los 8 idiomas del sistema
 * ============================================================================
 */

export interface LocaleTranslations {
  // Cintillo Superior & Navbar
  republicaCostaRica: string;
  sedeElectronica: string;
  sistemaGobiernosLocales: string;
  cantonLabel: string;
  cantonesAutonomos: string;
  navTramites: string;
  navGobierno: string;
  navTerritorio: string;
  navComunidad: string;
  navSos: string;
  navPanelCivico: string;
  navRegistrarse: string;
  navCerrarSesion: string;
  navIniciarSesion: string;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  buscarPlaceholder: string;
  botonBuscar: string;
  gobiernoActivo: string;
  municipalidadDe: string;
  verConcejo: string;

  // Sugerencias de Búsqueda
  sugTramites: string;
  sugGobierno: string;
  sugInfra: string;
  sugCultura: string;
  sugItem1: string;
  sugItem2: string;
  sugItem3: string;
  sugItem4: string;
  sugItem5: string;
  sugItem6: string;
  sugItem7: string;
  sugItem8: string;
  sugItem9: string;
  sugItem10: string;

  // Los 4 Ejes Rectores
  ejesRectoresTag: string;
  ejesRectoresTitle: string;
  ejesRectoresDesc: string;
  eje1Titulo: string;
  eje1Desc: string;
  eje2Titulo: string;
  eje2Desc: string;
  eje3Titulo: string;
  eje3Desc: string;
  eje4Titulo: string;
  eje4Desc: string;
  abrirModulo: string;

  // Panel Lateral (CivicDrawer)
  panelCivico: string;
  navegacion: string;
  gobiernoLocalActivo: string;
  cantonesCount: string;
  cantonSeleccionado: string;
  buscarCantonPlaceholder: string;
  todasProvincias: string;
  noCantonesEncontrados: string;
  modoVisual: string;
  temaOscuro: string;
  temaClaro: string;
  modoClaroBtn: string;
  modoOscuroBtn: string;
  escalaTipografica: string;
  fase: string;
  deCuatro: string;
  faseBase: string;
  faseMedia: string;
  faseAlta: string;
  faseMaxima: string;
  idiomasOficiales: string;
  ochoIdiomas: string;
  asistenciaVoz: string;
  reproduciendo: string;
  detenerLectura: string;
  leerPantalla: string;
  guiaBtn: string;
  modulosNacionales: string;
  sosEmergencias: string;
  pieRepublica: string;
  pieLey: string;

  // Claves heredadas para retrocompatibilidad
  portal: string;
  territorio: string;
  reportes: string;
  seguridad: string;
  gobernanza: string;
  cultura: string;
  deportes: string;
  educacion: string;
  comercio: string;
  turismo: string;
  participacion: string;
  modulosTitulo: string;
  identidadTitulo: string;
  tituloHero: string;
  subtituloHero: string;
  descHero: string;
  botonExplorar: string;
  menuBoton: string;
  cerrarBoton: string;
  leerVozAlta: string;
  provinciasNum: string;
  provinciasTexto: string;
  cantonesNum: string;
  cantonesTexto: string;
  distritosNum: string;
  distritosTexto: string;
  accesoCivico: string;
  registro: string;
  idiomasTitulo: string;
  a11yTitulo: string;
  guiaVoz: string;
  detener: string;
  repSoberania: string;
}

export const LOCALES: Record<string, LocaleTranslations> = {
  // 1. ESPAÑOL (COSTA RICA / LATINOAMÉRICA)
  'es-CR': {
    republicaCostaRica: 'REPÚBLICA DE COSTA RICA',
    sedeElectronica: 'SEDE ELECTRÓNICA NACIONAL',
    sistemaGobiernosLocales: 'SISTEMA NACIONAL DE GOBIERNOS LOCALES',
    cantonLabel: 'Cantón:',
    cantonesAutonomos: '84 CANTONES AUTÓNOMOS',
    navTramites: 'Gestión & Trámites',
    navGobierno: 'Gobierno & Concejo',
    navTerritorio: 'Territorio & Obras',
    navComunidad: 'Comunidad & CCDR',
    navSos: 'SOS 911',
    navPanelCivico: 'Panel Cívico',
    navRegistrarse: 'Registrarse',
    navCerrarSesion: 'Cerrar Sesión',
    navIniciarSesion: 'Iniciar Sesión',

    heroBadge: 'REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL',
    heroTitle: 'GOBIERNO LOCAL Y SERVICIOS CIUDADANOS',
    heroSubtitle: 'Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica',
    heroDesc: 'Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.',
    buscarPlaceholder: 'Buscar trámite municipal, acta de concejo, cantón o reporte vial...',
    botonBuscar: 'Consultar',
    gobiernoActivo: 'Gobierno Local activo en consulta:',
    municipalidadDe: 'Municipalidad de',
    verConcejo: 'Ver Concejo',

    sugTramites: 'Trámites & Hacienda',
    sugGobierno: 'Gobernanza & Concejo',
    sugInfra: 'Infraestructura & Reportes',
    sugCultura: 'Cultura & Deportes',
    sugItem1: 'Ventanilla Única y Certificaciones',
    sugItem2: 'Patentes Comerciales y Régimen PyME',
    sugItem3: 'Validación de Cédula ante Hacienda',
    sugItem4: 'Actas Ordinarias del Concejo Municipal',
    sugItem5: 'Presupuesto Participativo Cantonal',
    sugItem6: 'Reporte de Averías Viales e Infraestructura',
    sugItem7: 'Visor Cartográfico GIS 3D y Relieve',
    sugItem8: 'Centro de Auxilio CNE y Emergencias 911',
    sugItem9: 'Instalaciones Deportivas del CCDR',
    sugItem10: 'Agenda Cultural y Tradiciones Cantonales',

    ejesRectoresTag: 'ADMINISTRACIÓN PÚBLICA CANTONAL · CÓDIGO MUNICIPAL',
    ejesRectoresTitle: 'Los 4 Ejes Rectores de la Gestión Municipal',
    ejesRectoresDesc: 'Servicios cívicos soberanos organizados para garantizar la transparencia institucional, la resolución comunal de averías y el desarrollo participativo en cada uno de los 84 cantones.',
    eje1Titulo: 'Ventanilla Única & Trámites',
    eje1Desc: 'Gestión tributaria, patentes comerciales, licencias municipales y estado tributario ante Hacienda.',
    eje2Titulo: 'Gobernanza y Concejo Municipal',
    eje2Desc: 'Acceso a actas ordinarias y extraordinarias, sesiones del Concejo y proyectos cantonales.',
    eje3Titulo: 'Infraestructura y Obras Cantonales',
    eje3Desc: 'Fiscalización en mapa 3D de obras públicas, reportes de averías viales y seguimiento municipal.',
    eje4Titulo: 'Comunidad, Cultura y CCDR',
    eje4Desc: 'Comités Cantonales de Deportes, agenda cultural, presupuestos participativos y ferias agrícolas.',
    abrirModulo: 'Abrir Módulo',

    panelCivico: 'Panel Cívico',
    navegacion: 'Navegación',
    gobiernoLocalActivo: 'Gobierno Local Activo',
    cantonesCount: '84 Cantones',
    cantonSeleccionado: 'Cantón Seleccionado:',
    buscarCantonPlaceholder: 'Buscar cantón o provincia...',
    todasProvincias: 'Todas',
    noCantonesEncontrados: 'No se encontraron cantones con',
    modoVisual: 'Modo Visual',
    temaOscuro: 'Tema Oscuro Obsidiana',
    temaClaro: 'Tema Claro Institucional',
    modoClaroBtn: 'Modo Claro',
    modoOscuroBtn: 'Modo Oscuro',
    escalaTipografica: 'Escala Tipográfica (Ley 7600)',
    fase: 'Fase',
    deCuatro: 'de 4',
    faseBase: 'Base',
    faseMedia: 'Media',
    faseAlta: 'Alta',
    faseMaxima: 'Máxima',
    idiomasOficiales: 'Idiomas Oficiales',
    ochoIdiomas: '8 Idiomas',
    asistenciaVoz: 'Asistencia por Voz (TTS)',
    reproduciendo: 'Reproduciendo...',
    detenerLectura: 'Detener Lectura',
    leerPantalla: 'Leer Pantalla Actual',
    guiaBtn: 'Guía',
    modulosNacionales: 'Módulos del Sistema Nacional',
    sosEmergencias: 'Centro de Auxilio & SOS 911',
    pieRepublica: 'República de Costa Rica',
    pieLey: 'Ley N° 8968',

    portal: 'Portal Nacional',
    territorio: 'Territorio 3D & Cartografía',
    reportes: 'Reportes de Infraestructura',
    seguridad: 'Seguridad y Emergencias 911',
    gobernanza: 'Gobernanza y Transparencia',
    cultura: 'Cultura y Patrimonio',
    deportes: 'Deportes y Recreación',
    educacion: 'Educación y Juventud',
    comercio: 'Comercio y PyMEs',
    turismo: 'Turismo y Naturaleza',
    participacion: 'Participación Ciudadana',
    modulosTitulo: 'Módulos del Sistema Nacional',
    identidadTitulo: 'Identidad y Trámites',
    tituloHero: 'GOBIERNO LOCAL Y SERVICIOS CIUDADANOS',
    subtituloHero: 'Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica',
    descHero: 'Conectando las 7 provincias, 84 cantones y comunidades de nuestra nación en un espacio cívico digital transparente, inclusivo y accesible para todos.',
    botonExplorar: 'Consultar',
    menuBoton: 'MENÚ',
    cerrarBoton: 'CERRAR',
    leerVozAlta: 'Leer en Voz Alta',
    provinciasNum: '07',
    provinciasTexto: 'Provincias Soberanas',
    cantonesNum: '84',
    cantonesTexto: 'Cantones y Gobiernos Locales',
    distritosNum: '492',
    distritosTexto: 'Distritos Conectados',
    accesoCivico: 'Acceso Cívico',
    registro: 'Registro',
    idiomasTitulo: 'IDIOMAS OFICIALES (8 IDIOMAS)',
    a11yTitulo: 'ACCESIBILIDAD UNIVERSAL (LEY 7600)',
    guiaVoz: 'Guía Asistida por Voz',
    detener: 'Detener',
    repSoberania: 'República de Costa Rica • Soberanía e Inclusión Digital'
  },

  // 2. ESPAÑOL (ESPAÑA)
  'es-ES': {
    republicaCostaRica: 'REPÚBLICA DE COSTA RICA',
    sedeElectronica: 'SEDE ELECTRÓNICA NACIONAL',
    sistemaGobiernosLocales: 'SISTEMA NACIONAL DE GOBIERNOS LOCALES',
    cantonLabel: 'Municipio:',
    cantonesAutonomos: '84 MUNICIPIOS AUTÓNOMOS',
    navTramites: 'Gestión y Trámites',
    navGobierno: 'Gobierno y Pleno',
    navTerritorio: 'Territorio y Obras',
    navComunidad: 'Comunidad y Deportes',
    navSos: 'SOS 911',
    navPanelCivico: 'Panel Ciudadano',
    navRegistrarse: 'Registrarse',
    navCerrarSesion: 'Cerrar Sesión',
    navIniciarSesion: 'Iniciar Sesión',

    heroBadge: 'REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL',
    heroTitle: 'GOBIERNO LOCAL Y SERVICIOS CIUDADANOS',
    heroSubtitle: 'Ventanilla Soberana de Fiscalización, Trámites y Gestión Municipal para los 84 Cantones de Costa Rica',
    heroDesc: 'Consulte actas oficiales del Pleno Municipal, valide identidades con Hacienda, tramite licencias y reporte incidencias viales en tiempo real con trazabilidad según el Código Municipal y la Ley N° 8968.',
    buscarPlaceholder: 'Buscar trámite municipal, acta de pleno, cantón o reporte vial...',
    botonBuscar: 'Consultar',
    gobiernoActivo: 'Gobierno Local activo en consulta:',
    municipalidadDe: 'Ayuntamiento de',
    verConcejo: 'Ver Pleno',

    sugTramites: 'Trámites y Hacienda',
    sugGobierno: 'Gobernanza y Pleno',
    sugInfra: 'Infraestructura y Reportes',
    sugCultura: 'Cultura y Deportes',
    sugItem1: 'Ventanilla Única y Certificados',
    sugItem2: 'Licencias Comerciales y Régimen Pymes',
    sugItem3: 'Validación de Documento ante Hacienda',
    sugItem4: 'Actas Ordinarias del Pleno Municipal',
    sugItem5: 'Presupuesto Participativo Municipal',
    sugItem6: 'Reporte de Averías Viales e Infraestructura',
    sugItem7: 'Visor Cartográfico GIS 3D y Relieve',
    sugItem8: 'Centro de Auxilio y Emergencias 911',
    sugItem9: 'Instalaciones Deportivas Municipales',
    sugItem10: 'Agenda Cultural y Tradiciones',

    ejesRectoresTag: 'ADMINISTRACIÓN PÚBLICA MUNICIPAL · CÓDIGO MUNICIPAL',
    ejesRectoresTitle: 'Los 4 Ejes Rectores de la Gestión Municipal',
    ejesRectoresDesc: 'Servicios cívicos soberanos organizados para garantizar la transparencia institucional, la resolución de averías y el desarrollo participativo en cada uno de los 84 cantones.',
    eje1Titulo: 'Ventanilla Única y Trámites',
    eje1Desc: 'Gestión tributaria, licencias de actividad, tasas municipales y estado tributario ante Hacienda.',
    eje2Titulo: 'Gobernanza y Pleno Municipal',
    eje2Desc: 'Acceso a actas ordinarias y extraordinarias, sesiones del Pleno y proyectos cantonales.',
    eje3Titulo: 'Infraestructura y Obras Municipales',
    eje3Desc: 'Fiscalización en mapa 3D de obras públicas, reportes de averías viales y seguimiento municipal.',
    eje4Titulo: 'Comunidad, Cultura y Deportes',
    eje4Desc: 'Patronatos deportivos cantonales, agenda cultural, presupuestos participativos y mercados locales.',
    abrirModulo: 'Abrir Módulo',

    panelCivico: 'Panel Ciudadano',
    navegacion: 'Navegación',
    gobiernoLocalActivo: 'Gobierno Local Activo',
    cantonesCount: '84 Cantones',
    cantonSeleccionado: 'Cantón Seleccionado:',
    buscarCantonPlaceholder: 'Buscar cantón o provincia...',
    todasProvincias: 'Todas',
    noCantonesEncontrados: 'No se encontraron cantones con',
    modoVisual: 'Modo Visual',
    temaOscuro: 'Tema Oscuro Obsidiana',
    temaClaro: 'Tema Claro Institucional',
    modoClaroBtn: 'Modo Claro',
    modoOscuroBtn: 'Modo Oscuro',
    escalaTipografica: 'Escala Tipográfica (Ley 7600)',
    fase: 'Fase',
    deCuatro: 'de 4',
    faseBase: 'Base',
    faseMedia: 'Media',
    faseAlta: 'Alta',
    faseMaxima: 'Máxima',
    idiomasOficiales: 'Idiomas Oficiales',
    ochoIdiomas: '8 Idiomas',
    asistenciaVoz: 'Asistencia por Voz (TTS)',
    reproduciendo: 'Reproduciendo...',
    detenerLectura: 'Detener Lectura',
    leerPantalla: 'Leer Pantalla Actual',
    guiaBtn: 'Guía',
    modulosNacionales: 'Módulos del Sistema Nacional',
    sosEmergencias: 'Centro de Emergencias 911',
    pieRepublica: 'República de Costa Rica',
    pieLey: 'Ley N° 8968',

    portal: 'Portal Nacional',
    territorio: 'Territorio 3D y Cartografía',
    reportes: 'Reportes de Infraestructura',
    seguridad: 'Seguridad y Emergencias 911',
    gobernanza: 'Gobernanza y Transparencia',
    cultura: 'Cultura y Patrimonio',
    deportes: 'Deportes y Recreación',
    educacion: 'Educación y Juventud',
    comercio: 'Comercio y Pymes',
    turismo: 'Turismo y Naturaleza',
    participacion: 'Participación Ciudadana',
    modulosTitulo: 'Módulos del Sistema Nacional',
    identidadTitulo: 'Identidad y Trámites',
    tituloHero: 'GOBIERNO LOCAL Y SERVICIOS CIUDADANOS',
    subtituloHero: 'Ventanilla Soberana de Fiscalización, Trámites y Gestión Municipal para los 84 Cantones de Costa Rica',
    descHero: 'Conectando las 7 provincias, 84 municipios y comunidades en un espacio cívico digital transparente e inclusivo.',
    botonExplorar: 'Consultar',
    menuBoton: 'MENÚ',
    cerrarBoton: 'CERRAR',
    leerVozAlta: 'Lectura en Voz Alta',
    provinciasNum: '07',
    provinciasTexto: 'Provincias Soberanas',
    cantonesNum: '84',
    cantonesTexto: 'Municipios y Gobiernos Locales',
    distritosNum: '492',
    distritosTexto: 'Distritos Conectados',
    accesoCivico: 'Acceso Ciudadano',
    registro: 'Registro',
    idiomasTitulo: 'IDIOMAS OFICIALES (8 IDIOMAS)',
    a11yTitulo: 'ACCESIBILIDAD UNIVERSAL',
    guiaVoz: 'Guía Asistida por Voz',
    detener: 'Detener',
    repSoberania: 'República de Costa Rica • Soberanía e Inclusión Digital'
  },

  // 3. ENGLISH (US)
  en: {
    republicaCostaRica: 'REPUBLIC OF COSTA RICA',
    sedeElectronica: 'NATIONAL ELECTRONIC HEADQUARTERS',
    sistemaGobiernosLocales: 'NATIONAL SYSTEM OF LOCAL GOVERNMENTS',
    cantonLabel: 'Canton:',
    cantonesAutonomos: '84 AUTONOMOUS CANTONS',
    navTramites: 'Management & Procedures',
    navGobierno: 'Government & Council',
    navTerritorio: 'Territory & Works',
    navComunidad: 'Community & Sports',
    navSos: 'SOS 911',
    navPanelCivico: 'Civic Panel',
    navRegistrarse: 'Register',
    navCerrarSesion: 'Sign Out',
    navIniciarSesion: 'Sign In',

    heroBadge: 'REPUBLIC OF COSTA RICA · NATIONAL ELECTRONIC HEADQUARTERS',
    heroTitle: 'LOCAL GOVERNMENT AND CITIZEN SERVICES',
    heroSubtitle: 'Sovereign Single Window for Oversight, Civic Procedures and Community Management for the 84 Cantons of Costa Rica',
    heroDesc: 'Consult official Municipal Council minutes, validate citizen IDs with Ministry of Finance, apply for business permits, and report road incidents in real time with legal traceability under the Municipal Code and Law No. 8968.',
    buscarPlaceholder: 'Search municipal procedure, council minutes, canton or road report...',
    botonBuscar: 'Search',
    gobiernoActivo: 'Active Local Government in query:',
    municipalidadDe: 'Municipality of',
    verConcejo: 'View Council',

    sugTramites: 'Procedures & Tax Ministry',
    sugGobierno: 'Governance & Council',
    sugInfra: 'Infrastructure & Reports',
    sugCultura: 'Culture & Sports',
    sugItem1: 'Single Window and Certifications',
    sugItem2: 'Business Permits and SME Registry',
    sugItem3: 'Citizen ID Validation with Finance Ministry',
    sugItem4: 'Official Municipal Council Minutes',
    sugItem5: 'Cantonal Participatory Budgeting',
    sugItem6: 'Road Incident and Infrastructure Reports',
    sugItem7: '3D GIS Cartographic Relief Viewer',
    sugItem8: 'CNE Relief Center and 911 Emergencies',
    sugItem9: 'CCDR Municipal Sports Facilities',
    sugItem10: 'Cultural Agenda and Cantonal Traditions',

    ejesRectoresTag: 'CANTONAL PUBLIC ADMINISTRATION · MUNICIPAL CODE',
    ejesRectoresTitle: 'The 4 Core Pillars of Municipal Governance',
    ejesRectoresDesc: 'Sovereign civic services organized to guarantee institutional transparency, communal incident resolution, and participatory development across all 84 cantons.',
    eje1Titulo: 'Single Window & Procedures',
    eje1Desc: 'Tax management, business permits, municipal licenses, and tax compliance status with the Ministry of Finance.',
    eje2Titulo: 'Governance & Municipal Council',
    eje2Desc: 'Access to regular and extraordinary minutes, Council sessions, and local cantonal projects.',
    eje3Titulo: 'Infrastructure & Cantonal Works',
    eje3Desc: '3D map oversight of public works, road breakdown reports, and municipal resolution tracking.',
    eje4Titulo: 'Community, Culture & Sports',
    eje4Desc: 'Cantonal Sports Committees, cultural agenda, participatory budgeting, and farmers\' markets.',
    abrirModulo: 'Open Module',

    panelCivico: 'Civic Panel',
    navegacion: 'Navigation',
    gobiernoLocalActivo: 'Active Local Government',
    cantonesCount: '84 Cantons',
    cantonSeleccionado: 'Selected Canton:',
    buscarCantonPlaceholder: 'Search canton or province...',
    todasProvincias: 'All',
    noCantonesEncontrados: 'No cantons found matching',
    modoVisual: 'Visual Mode',
    temaOscuro: 'Obsidian Dark Theme',
    temaClaro: 'Institutional Light Theme',
    modoClaroBtn: 'Light Mode',
    modoOscuroBtn: 'Dark Mode',
    escalaTipografica: 'Typography Scale (Law 7600)',
    fase: 'Phase',
    deCuatro: 'of 4',
    faseBase: 'Base',
    faseMedia: 'Medium',
    faseAlta: 'High',
    faseMaxima: 'Maximum',
    idiomasOficiales: 'Official Languages',
    ochoIdiomas: '8 Languages',
    asistenciaVoz: 'Voice Assistance (TTS)',
    reproduciendo: 'Playing...',
    detenerLectura: 'Stop Reading',
    leerPantalla: 'Read Current Screen',
    guiaBtn: 'Tour Guide',
    modulosNacionales: 'National System Modules',
    sosEmergencias: 'Emergency Assistance & SOS 911',
    pieRepublica: 'Republic of Costa Rica',
    pieLey: 'Law No. 8968',

    portal: 'National Portal',
    territorio: '3D Territory & Maps',
    reportes: 'Infrastructure Reports',
    seguridad: 'Security & 911 Emergencies',
    gobernanza: 'Governance & Transparency',
    cultura: 'Culture & Heritage',
    deportes: 'Sports & Recreation',
    educacion: 'Education & Youth',
    comercio: 'Commerce & SMEs',
    turismo: 'Tourism & Nature',
    participacion: 'Citizen Participation',
    modulosTitulo: 'National System Modules',
    identidadTitulo: 'Identity & Procedures',
    tituloHero: 'LOCAL GOVERNMENT AND CITIZEN SERVICES',
    subtituloHero: 'Sovereign Single Window for Oversight, Civic Procedures and Community Management for the 84 Cantons of Costa Rica',
    descHero: 'Connecting all 7 provinces, 84 cantons and communities across our nation in a transparent, inclusive and accessible civic digital space.',
    botonExplorar: 'Search',
    menuBoton: 'MENU',
    cerrarBoton: 'CLOSE',
    leerVozAlta: 'Read Aloud',
    provinciasNum: '07',
    provinciasTexto: 'Sovereign Provinces',
    cantonesNum: '84',
    cantonesTexto: 'Cantons & Local Governments',
    distritosNum: '492',
    distritosTexto: 'Connected Districts',
    accesoCivico: 'Civic Login',
    registro: 'Register',
    idiomasTitulo: 'OFFICIAL LANGUAGES (8 LANGUAGES)',
    a11yTitulo: 'UNIVERSAL ACCESSIBILITY (LAW 7600)',
    guiaVoz: 'Voice Assisted Tour',
    detener: 'Stop',
    repSoberania: 'Republic of Costa Rica • Digital Sovereignty & Inclusion'
  },

  // 4. CHINO MANDARÍN
  zh: {
    republicaCostaRica: '哥斯达黎加共和国',
    sedeElectronica: '国家电子政务总部',
    sistemaGobiernosLocales: '国家地方政府系统',
    cantonLabel: '州 (县):',
    cantonesAutonomos: '84个自治州',
    navTramites: '政务与办事',
    navGobierno: '地方政府与议会',
    navTerritorio: '领土与市政工程',
    navComunidad: '社区与体育委员会',
    navSos: 'SOS 911',
    navPanelCivico: '公民面板',
    navRegistrarse: '注册',
    navCerrarSesion: '退出登录',
    navIniciarSesion: '登录',

    heroBadge: '哥斯达黎加共和国 · 国家电子政务总部',
    heroTitle: '地方政府与公民服务',
    heroSubtitle: '哥斯达黎加84个州主权政务监察、社区治理与综合办事窗口',
    heroDesc: '查阅市议会官方会议记录，通过财政部验证公民身份，申请营业执照，并依照市政法和第8968号法律实时报告具有全程可追溯性的道路事件。',
    buscarPlaceholder: '搜索市政手续、议会记录、州或道路报告...',
    botonBuscar: '查询',
    gobiernoActivo: '当前查询的地方政府:',
    municipalidadDe: '市政府 -',
    verConcejo: '查看市议会',

    sugTramites: '政务与税务',
    sugGobierno: '治理与议会',
    sugInfra: '基础设施与报告',
    sugCultura: '文化与体育',
    sugItem1: '综合窗口与官方证明',
    sugItem2: '商业许可与中小企业名录',
    sugItem3: '财政部公民身份核验',
    sugItem4: '市政议会正式会议记录',
    sugItem5: '州参与式预算投票',
    sugItem6: '道路损坏与设施故障报告',
    sugItem7: '3D GIS地理地形视窗',
    sugItem8: '国家应急救援中心911',
    sugItem9: '州体育设施与运动场馆',
    sugItem10: '文化日程与各州传统',

    ejesRectoresTag: '州行政管理 · 市政法典',
    ejesRectoresTitle: '市政治理四大核心支柱',
    ejesRectoresDesc: '主权公民服务体系，保障全国84个州的机构透明度、社区故障解决及参与式发展。',
    eje1Titulo: '综合办事窗口与手续',
    eje1Desc: '税务管理、商业许可、市政执照及财政部税务合规状态查询。',
    eje2Titulo: '治理与市政议会',
    eje2Desc: '查阅例行与特别会议记录、市议会会议全程及本地发展项目。',
    eje3Titulo: '基础设施与市政工程',
    eje3Desc: '在3D地图上监察公共工程、道路故障上报与市政进度追踪。',
    eje4Titulo: '社区、文化与体育委员会',
    eje4Desc: '州体育委员会、文化日程、参与式预算与农贸集市。',
    abrirModulo: '进入模块',

    panelCivico: '公民面板',
    navegacion: '导航目录',
    gobiernoLocalActivo: '当前活跃地方政府',
    cantonesCount: '84个州',
    cantonSeleccionado: '已选州:',
    buscarCantonPlaceholder: '搜索州或省份...',
    todasProvincias: '全部省份',
    noCantonesEncontrados: '未找到匹配的州',
    modoVisual: '视觉模式',
    temaOscuro: '黑曜石暗黑主题',
    temaClaro: '官方明亮主题',
    modoClaroBtn: '明亮模式',
    modoOscuroBtn: '暗黑模式',
    escalaTipografica: '字体缩放 (第7600号法律)',
    fase: '阶段',
    deCuatro: '/ 4',
    faseBase: '基础',
    faseMedia: '中等',
    faseAlta: '较大',
    faseMaxima: '最大',
    idiomasOficiales: '官方语言',
    ochoIdiomas: '8种语言',
    asistenciaVoz: '语音协助 (TTS)',
    reproduciendo: '正在朗读...',
    detenerLectura: '停止朗读',
    leerPantalla: '朗读当前屏幕',
    guiaBtn: '引导',
    modulosNacionales: '国家系统模块',
    sosEmergencias: '应急援助中心与SOS 911',
    pieRepublica: '哥斯达黎加共和国',
    pieLey: '第8968号数据保护法',

    portal: '国家门户',
    territorio: '3D领土与地图',
    reportes: '基础设施报告',
    seguridad: '安全与911紧急求助',
    gobernanza: '治理与透明度',
    cultura: '文化与遗产',
    deportes: '体育与娱乐',
    educacion: '教育与青年',
    comercio: '商业与中小企业',
    turismo: '旅游与自然生态',
    participacion: '公众参与',
    modulosTitulo: '国家系统模块',
    identidadTitulo: '身份与政务',
    tituloHero: '地方政府与公民服务',
    subtituloHero: '哥斯达黎加84个州主权政务监察、社区治理与综合办事窗口',
    descHero: '连接我国7个省份、84个州及所有社区，打造透明、包容且人人可用的数字公民空间。',
    botonExplorar: '查询',
    menuBoton: '菜单',
    cerrarBoton: '关闭',
    leerVozAlta: '朗读屏幕',
    provinciasNum: '07',
    provinciasTexto: '主权省份',
    cantonesNum: '84',
    cantonesTexto: '州与地方政府',
    distritosNum: '492',
    distritosTexto: '连接区',
    accesoCivico: '公民登录',
    registro: '注册',
    idiomasTitulo: '官方语言 (8种语言)',
    a11yTitulo: '无障碍通用设计',
    guiaVoz: '语音向导',
    detener: '停止',
    repSoberania: '哥斯达黎加共和国 • 主权与数字包容'
  },

  // 5. PORTUGUÊS (BRASIL)
  pt: {
    republicaCostaRica: 'REPÚBLICA DA COSTA RICA',
    sedeElectronica: 'SEDE ELETRÔNICA NACIONAL',
    sistemaGobiernosLocales: 'SISTEMA NACIONAL DE GOVERNOS LOCAIS',
    cantonLabel: 'Cantão (Município):',
    cantonesAutonomos: '84 CANTÕES AUTÔNOMOS',
    navTramites: 'Gestão e Trâmites',
    navGobierno: 'Governo e Conselho',
    navTerritorio: 'Território e Obras',
    navComunidad: 'Comunidade e Esportes',
    navSos: 'SOS 911',
    navPanelCivico: 'Painel Cívico',
    navRegistrarse: 'Cadastrar-se',
    navCerrarSesion: 'Sair',
    navIniciarSesion: 'Entrar',

    heroBadge: 'REPÚBLICA DA COSTA RICA · SEDE ELETRÔNICA NACIONAL',
    heroTitle: 'GOVERNO LOCAL E SERVIÇOS AO CIDADÃO',
    heroSubtitle: 'Balcão Único Soberano de Fiscalização, Trâmites e Gestão Comunitária para os 84 Cantões da Costa Rica',
    heroDesc: 'Consulte atas oficiais da Câmara Municipal, valide identidades na Fazenda, emita alvarás e relate ocorrências viárias em tempo real com rastreabilidade sob o Código Municipal e a Lei Nº 8968.',
    buscarPlaceholder: 'Buscar trâmite municipal, ata da câmara, cantão ou ocorrência viária...',
    botonBuscar: 'Consultar',
    gobiernoActivo: 'Governo Local ativo em consulta:',
    municipalidadDe: 'Município de',
    verConcejo: 'Ver Câmara',

    sugTramites: 'Trâmites e Fazenda',
    sugGobierno: 'Governança e Conselho',
    sugInfra: 'Infraestrutura e Relatórios',
    sugCultura: 'Cultura e Esportes',
    sugItem1: 'Balcão Único e Certidões',
    sugItem2: 'Alvarás Comerciais e Registro PME',
    sugItem3: 'Validação de Identidade na Fazenda',
    sugItem4: 'Atas Oficiais da Câmara Municipal',
    sugItem5: 'Orçamento Participativo Municipal',
    sugItem6: 'Relatório de Danos Viários e Infraestrutura',
    sugItem7: 'Visualizador Cartográfico GIS 3D',
    sugItem8: 'Centro de Auxílio CNE e Emergências 911',
    sugItem9: 'Instalações Esportivas Municipais',
    sugItem10: 'Agenda Cultural e Tradições Cantonais',

    ejesRectoresTag: 'ADMINISTRAÇÃO PÚBLICA MUNICIPAL · CÓDIGO MUNICIPAL',
    ejesRectoresTitle: 'Os 4 Eixos Centrais da Gestão Municipal',
    ejesRectoresDesc: 'Serviços cívicos soberanos organizados para garantir a transparência institucional, a resolução comunitária de ocorrências e o desenvolvimento participativo nos 84 cantões.',
    eje1Titulo: 'Balcão Único & Trâmites',
    eje1Desc: 'Gestão tributária, alvarás comerciais, licenças municipais e situação cadastral perante a Fazenda.',
    eje2Titulo: 'Governança e Câmara Municipal',
    eje2Desc: 'Acesso a atas ordinárias e extraordinárias, sessões da Câmara e projetos locais.',
    eje3Titulo: 'Infraestrutura e Obras Municipais',
    eje3Desc: 'Fiscalização em mapa 3D de obras públicas, relatórios de danos viários e acompanhamento municipal.',
    eje4Titulo: 'Comunidade, Cultura e Esportes',
    eje4Desc: 'Comitês Cantonais de Esportes, agenda cultural, orçamentos participativos e feiras de produtores.',
    abrirModulo: 'Abrir Módulo',

    panelCivico: 'Painel Cívico',
    navegacion: 'Navegação',
    gobiernoLocalActivo: 'Governo Local Ativo',
    cantonesCount: '84 Cantões',
    cantonSeleccionado: 'Cantão Seleccionado:',
    buscarCantonPlaceholder: 'Buscar cantão ou província...',
    todasProvincias: 'Todas',
    noCantonesEncontrados: 'Nenhum cantão encontrado com',
    modoVisual: 'Modo Visual',
    temaOscuro: 'Tema Escuro Obsidiana',
    temaClaro: 'Tema Claro Institucional',
    modoClaroBtn: 'Modo Claro',
    modoOscuroBtn: 'Modo Escuro',
    escalaTipografica: 'Escala Tipográfica (Lei 7600)',
    fase: 'Fase',
    deCuatro: 'de 4',
    faseBase: 'Base',
    faseMedia: 'Média',
    faseAlta: 'Alta',
    faseMaxima: 'Máxima',
    idiomasOficiales: 'Idiomas Oficiais',
    ochoIdiomas: '8 Idiomas',
    asistenciaVoz: 'Assistência por Voz (TTS)',
    reproduciendo: 'Reproduzindo...',
    detenerLectura: 'Parar Leitura',
    leerPantalla: 'Ler Tela Atual',
    guiaBtn: 'Guia',
    modulosNacionales: 'Módulos do Sistema Nacional',
    sosEmergencias: 'Centro de Auxílio & SOS 911',
    pieRepublica: 'República da Costa Rica',
    pieLey: 'Lei Nº 8968',

    portal: 'Portal Nacional',
    territorio: 'Território 3D e Cartografia',
    reportes: 'Relatórios de Infraestrutura',
    seguridad: 'Segurança e Emergências 911',
    gobernanza: 'Governança e Transparência',
    cultura: 'Cultura e Patrimônio',
    deportes: 'Esportes e Lazer',
    educacion: 'Educação e Juventude',
    comercio: 'Comércio e PMEs',
    turismo: 'Turismo e Natureza',
    participacion: 'Participação Cidadã',
    modulosTitulo: 'Módulos do Sistema Nacional',
    identidadTitulo: 'Identidade e Trâmites',
    tituloHero: 'GOVERNO LOCAL E SERVIÇOS AO CIDADÃO',
    subtituloHero: 'Balcão Único Soberano de Fiscalização, Trâmites e Gestão Comunitária para os 84 Cantões da Costa Rica',
    descHero: 'Conectando as 7 províncias, 84 cantões e comunidades em um espaço digital transparente e acessível.',
    botonExplorar: 'Consultar',
    menuBoton: 'MENU',
    cerrarBoton: 'FECHAR',
    leerVozAlta: 'Ler em Voz Alta',
    provinciasNum: '07',
    provinciasTexto: 'Províncias Soberanas',
    cantonesNum: '84',
    cantonesTexto: 'Cantões e Governos Locais',
    distritosNum: '492',
    distritosTexto: 'Distritos Conectados',
    accesoCivico: 'Acesso Cívico',
    registro: 'Cadastro',
    idiomasTitulo: 'IDIOMAS OFICIAIS (8 IDIOMAS)',
    a11yTitulo: 'ACESSIBILIDADE UNIVERSAL',
    guiaVoz: 'Guia por Voz',
    detener: 'Parar',
    repSoberania: 'República da Costa Rica • Soberania e Inclusão Digital'
  },

  // 6. FRANÇAIS
  fr: {
    republicaCostaRica: 'RÉPUBLIQUE DU COSTA RICA',
    sedeElectronica: 'SIÈGE ÉLECTRONIQUE NATIONAL',
    sistemaGobiernosLocales: 'SYSTÈME NATIONAL DES GOUVERNEMENTS LOCAUX',
    cantonLabel: 'Canton (Mairie):',
    cantonesAutonomos: '84 CANTONS AUTONOMES',
    navTramites: 'Gestion & Démarches',
    navGobierno: 'Gouvernement & Conseil',
    navTerritorio: 'Territoire & Travaux',
    navComunidad: 'Communauté & Sports',
    navSos: 'SOS 911',
    navPanelCivico: 'Panneau Civique',
    navRegistrarse: 'S\'inscrire',
    navCerrarSesion: 'Se déconnecter',
    navIniciarSesion: 'Se connecter',

    heroBadge: 'RÉPUBLIQUE DU COSTA RICA · SIÈGE ÉLECTRONIQUE NATIONAL',
    heroTitle: 'GOUVERNEMENT LOCAL ET SERVICES AUX CITOYENS',
    heroSubtitle: 'Guichet Unique Souverain de Contrôle, Démarches et Gestion Communale pour les 84 Cantons du Costa Rica',
    heroDesc: 'Consultez les procès-verbaux officiels du Conseil Municipal, validez les identités auprès du Ministère des Finances, demandez des licences et signalez les incidents routiers en temps réel sous le Code Municipal et la Loi N° 8968.',
    buscarPlaceholder: 'Rechercher une démarche municipale, un procès-verbal, un canton...',
    botonBuscar: 'Consulter',
    gobiernoActivo: 'Gouvernement Local actif en consultation:',
    municipalidadDe: 'Mairie de',
    verConcejo: 'Voir Conseil',

    sugTramites: 'Démarches & Finances',
    sugGobierno: 'Gouvernance & Conseil',
    sugInfra: 'Infrastructure & Alertes',
    sugCultura: 'Culture & Sports',
    sugItem1: 'Guichet Unique et Certificats',
    sugItem2: 'Patentes Commerciales et Registre PME',
    sugItem3: 'Vérification d\'Identité aux Finances',
    sugItem4: 'Procès-Verbaux du Conseil Municipal',
    sugItem5: 'Budget Participatif Cantonal',
    sugItem6: 'Signalement d\'Avaries et Voirie',
    sugItem7: 'Visionneuse Cartographique GIS 3D',
    sugItem8: 'Centre de Secours CNE et Urgences 911',
    sugItem9: 'Équipements Sportifs du CCDR',
    sugItem10: 'Agenda Culturel et Coutumes',

    ejesRectoresTag: 'ADMINISTRATION PUBLIQUE CANTONALE · CODE MUNICIPAL',
    ejesRectoresTitle: 'Les 4 Piliers Directeurs de la Gestion Municipale',
    ejesRectoresDesc: 'Services civiques souverains organisés pour garantir la transparence institutionnelle, la résolution communale des pannes et le développement participatif dans chacun des 84 cantons.',
    eje1Titulo: 'Guichet Unique & Démarches',
    eje1Desc: 'Gestion fiscale, licences commerciales, permis municipaux et conformité fiscale auprès du Ministère des Finances.',
    eje2Titulo: 'Gouvernance et Conseil Municipal',
    eje2Desc: 'Accès aux délibérations ordinaires et extraordinaires, sessions du Conseil et projets communaux.',
    eje3Titulo: 'Infrastructures et Travaux Publics',
    eje3Desc: 'Surveillance sur carte 3D des travaux publics, signalement des avaries routières et suivi municipal.',
    eje4Titulo: 'Communauté, Culture et Sports',
    eje4Desc: 'Comités cantonaux des sports, programmation culturelle, budgets participatifs et marchés locaux.',
    abrirModulo: 'Ouvrir Module',

    panelCivico: 'Panneau Civique',
    navegacion: 'Navigation',
    gobiernoLocalActivo: 'Gouvernement Local Actif',
    cantonesCount: '84 Cantons',
    cantonSeleccionado: 'Canton Sélectionné:',
    buscarCantonPlaceholder: 'Rechercher un canton ou une province...',
    todasProvincias: 'Toutes',
    noCantonesEncontrados: 'Aucun canton trouvé avec',
    modoVisual: 'Mode Visuel',
    temaOscuro: 'Thème Sombre Obsidienne',
    temaClaro: 'Thème Clair Institutionnel',
    modoClaroBtn: 'Mode Clair',
    modoOscuroBtn: 'Mode Sombre',
    escalaTipografica: 'Échelle Typographique (Loi 7600)',
    fase: 'Phase',
    deCuatro: 'sur 4',
    faseBase: 'Base',
    faseMedia: 'Moyenne',
    faseAlta: 'Grande',
    faseMaxima: 'Maximale',
    idiomasOficiales: 'Langues Officielles',
    ochoIdiomas: '8 Langues',
    asistenciaVoz: 'Assistance Vocale (TTS)',
    reproduciendo: 'Lecture en cours...',
    detenerLectura: 'Arrêter la Lecture',
    leerPantalla: 'Lire l\'Écran Actuel',
    guiaBtn: 'Guide',
    modulosNacionales: 'Modules du Système National',
    sosEmergencias: 'Centre d\'Urgence & SOS 911',
    pieRepublica: 'République du Costa Rica',
    pieLey: 'Loi N° 8968',

    portal: 'Portail National',
    territorio: 'Territoire 3D et Cartographie',
    reportes: 'Signalements d\'Infrastructure',
    seguridad: 'Sécurité et Urgences 911',
    gobernanza: 'Gouvernance et Transparence',
    cultura: 'Culture et Patrimoine',
    deportes: 'Sports et Loisirs',
    educacion: 'Éducation et Jeunesse',
    comercio: 'Commerce et PME',
    turismo: 'Tourisme et Nature',
    participacion: 'Participation Citoyenne',
    modulosTitulo: 'Modules du Système National',
    identidadTitulo: 'Identité et Démarches',
    tituloHero: 'GOUVERNEMENT LOCAL ET SERVICES AUX CITOYENS',
    subtituloHero: 'Guichet Unique Souverain de Contrôle, Démarches et Gestion Communale pour les 84 Cantons du Costa Rica',
    descHero: 'Connecter les 7 provinces, 84 cantons et communautés dans un espace civique transparent et accessible.',
    botonExplorar: 'Consulter',
    menuBoton: 'MENU',
    cerrarBoton: 'FERMER',
    leerVozAlta: 'Lecture Vocale',
    provinciasNum: '07',
    provinciasTexto: 'Provinces Souveraines',
    cantonesNum: '84',
    cantonesTexto: 'Cantons et Mairies',
    distritosNum: '492',
    distritosTexto: 'Districts Connectés',
    accesoCivico: 'Connexion',
    registro: 'S\'inscrire',
    idiomasTitulo: 'LANGUES OFFICIELLES (8 LANGUES)',
    a11yTitulo: 'ACCESSIBILITÉ UNIVERSELLE',
    guiaVoz: 'Visite Guidée Vocale',
    detener: 'Arrêter',
    repSoberania: 'République du Costa Rica • Souveraineté et Inclusion Numérique'
  },

  // 7. RUSO
  ru: {
    republicaCostaRica: 'РЕСПУБЛИКА КОСТА-РИКА',
    sedeElectronica: 'ГОСУДАРСТВЕННЫЙ ЭЛЕКТРОННЫЙ ПОРТАЛ',
    sistemaGobiernosLocales: 'НАЦИОНАЛЬНАЯ СИСТЕМА МЕСТНОГО САМОУПРАВЛЕНИЯ',
    cantonLabel: 'Кантон (Мэрия):',
    cantonesAutonomos: '84 АВТОНОМНЫХ КАНТОНА',
    navTramites: 'Управление и процедуры',
    navGobierno: 'Правительство и совет',
    navTerritorio: 'Территория и работы',
    navComunidad: 'Сообщество и спорт',
    navSos: 'SOS 911',
    navPanelCivico: 'Гражданская панель',
    navRegistrarse: 'Регистрация',
    navCerrarSesion: 'Выйти',
    navIniciarSesion: 'Войти',

    heroBadge: 'РЕСПУБЛИКА КОСТА-РИКА · ГОСУДАРСТВЕННЫЙ ЭЛЕКТРОННЫЙ ПОРТАЛ',
    heroTitle: 'МЕСТНОЕ САМОУПРАВЛЕНИЕ И УСЛУГИ ДЛЯ ГРАЖДАН',
    heroSubtitle: 'Суверенное единое окно контроля, административных процедур и муниципального управления для 84 кантонов Коста-Рики',
    heroDesc: 'Просматривайте официальные протоколы Муниципального совета, проверяйте удостоверения личности в Минфине, оформляйте патенты и сообщайте о дорожных инцидентах в реальном времени в соответствии с Муниципальным кодексом и Законом № 8968.',
    buscarPlaceholder: 'Поиск муниципальных процедур, протоколов совета, кантона или отчетов...',
    botonBuscar: 'Найти',
    gobiernoActivo: 'Активный муниципалитет в запросе:',
    municipalidadDe: 'Мэрия -',
    verConcejo: 'Совет',

    sugTramites: 'Процедуры и Минфин',
    sugGobierno: 'Управление и совет',
    sugInfra: 'Инфраструктура и отчеты',
    sugCultura: 'Культура и спорт',
    sugItem1: 'Единое окно и справки',
    sugItem2: 'Коммерческие патенты и реестр МСП',
    sugItem3: 'Проверка личности в Минфине',
    sugItem4: 'Официальные протоколы заседаний Совета',
    sugItem5: 'Кантональный партисипаторный бюджет',
    sugItem6: 'Отчеты о повреждениях дорог и инфраструктуры',
    sugItem7: '3D ГИС-просмотрщик рельефа',
    sugItem8: 'Центр помощи CNE и служба 911',
    sugItem9: 'Муниципальные спортивные объекты',
    sugItem10: 'Культурная программа и традиции',

    ejesRectoresTag: 'МУНИЦИПАЛЬНОЕ УПРАВЛЕНИЕ · МУНИЦИПАЛЬНЫЙ КОДЕКС',
    ejesRectoresTitle: '4 руководящих направления муниципального управления',
    ejesRectoresDesc: 'Суверенные гражданские услуги, организованные для обеспечения институциональной прозрачности, устранения аварий и совместного развития в каждом из 84 кантонов.',
    eje1Titulo: 'Единое окно и процедуры',
    eje1Desc: 'Налоговое управление, коммерческие патенты, муниципальные лицензии и проверка налогового статуса в Минфине.',
    eje2Titulo: 'Управление и Муниципальный совет',
    eje2Desc: 'Доступ к протоколам заседаний Совета, регулярным сессиям и кантональным проектам.',
    eje3Titulo: 'Инфраструктура и общественные работы',
    eje3Desc: 'Контроль на 3D-карте общественных работ, отчеты о дорожных повреждениях и муниципальный мониторинг.',
    eje4Titulo: 'Сообщество, культура и спорт',
    eje4Desc: 'Кантональные спортивные комитеты, культурная программа, общественные бюджеты и фермерские ярмарки.',
    abrirModulo: 'Открыть модуль',

    panelCivico: 'Гражданская панель',
    navegacion: 'Навигация',
    gobiernoLocalActivo: 'Активное местное самоуправление',
    cantonesCount: '84 кантона',
    cantonSeleccionado: 'Выбранный кантон:',
    buscarCantonPlaceholder: 'Поиск кантона или провинции...',
    todasProvincias: 'Все',
    noCantonesEncontrados: 'Кантоны не найдены по запросу',
    modoVisual: 'Визуальный режим',
    temaOscuro: 'Темная обсидиановая тема',
    temaClaro: 'Светлая официальная тема',
    modoClaroBtn: 'Светлый режим',
    modoOscuroBtn: 'Темный режим',
    escalaTipografica: 'Масштаб шрифта (Закон 7600)',
    fase: 'Фаза',
    deCuatro: 'из 4',
    faseBase: 'Базовый',
    faseMedia: 'Средний',
    faseAlta: 'Крупный',
    faseMaxima: 'Максимальный',
    idiomasOficiales: 'Официальные языки',
    ochoIdiomas: '8 языков',
    asistenciaVoz: 'Голосовой помощник (TTS)',
    reproduciendo: 'Воспроизведение...',
    detenerLectura: 'Остановить чтение',
    leerPantalla: 'Озвучить текущий экран',
    guiaBtn: 'Гид',
    modulosNacionales: 'Модули национальной системы',
    sosEmergencias: 'Центр помощи и служба 911',
    pieRepublica: 'Республика Коста-Рика',
    pieLey: 'Закон № 8968',

    portal: 'Национальный портал',
    territorio: '3D-территория и карты',
    reportes: 'Отчеты об инфраструктуре',
    seguridad: 'Безопасность и служба 911',
    gobernanza: 'Управление и прозрачность',
    cultura: 'Культура и наследие',
    deportes: 'Спорт и отдых',
    educacion: 'Образование и молодежь',
    comercio: 'Торговля и малый бизнес',
    turismo: 'Туризм и природа',
    participacion: 'Участие граждан',
    modulosTitulo: 'Модули национальной системы',
    identidadTitulo: 'Личность и процедуры',
    tituloHero: 'МЕСТНОЕ САМОУПРАВЛЕНИЕ И УСЛУГИ ДЛЯ ГРАЖДАН',
    subtituloHero: 'Суверенное единое окно контроля, административных процедур и муниципального управления для 84 кантонов Коста-Рики',
    descHero: 'Объединение 7 провинций, 84 кантонов и сообществ в прозрачном и доступном цифровом пространстве.',
    botonExplorar: 'Найти',
    menuBoton: 'МЕНЮ',
    cerrarBoton: 'ЗАКРЫТЬ',
    leerVozAlta: 'Озвучить текст',
    provinciasNum: '07',
    provinciasTexto: 'Суверенных провинций',
    cantonesNum: '84',
    cantonesTexto: 'Кантонов и мэрий',
    distritosNum: '492',
    distritosTexto: 'Связанных дистриктов',
    accesoCivico: 'Вход',
    registro: 'Регистрация',
    idiomasTitulo: 'ОФИЦИАЛЬНЫЕ ЯЗЫКИ (8 ЯЗЫКОВ)',
    a11yTitulo: 'ДОСТУПНОСТЬ ДЛЯ ВСЕХ',
    guiaVoz: 'Голосовой гид',
    detener: 'Стоп',
    repSoberania: 'Республика Коста-Рика • Суверенитет и цифровая доступность'
  },

  // 8. JAPONÉS
  ja: {
    republicaCostaRica: 'コスタリカ共和国',
    sedeElectronica: '国家電子行政本部',
    sistemaGobiernosLocales: '国家地方自治体システム',
    cantonLabel: 'カントン (自治体):',
    cantonesAutonomos: '全84自治カントン',
    navTramites: '行政と手続き',
    navGobierno: '自治体政府と議会',
    navTerritorio: '領土と公共事業',
    navComunidad: '地域社会とスポーツ',
    navSos: 'SOS 911',
    navPanelCivico: '市民パネル',
    navRegistrarse: '新規登録',
    navCerrarSesion: 'ログアウト',
    navIniciarSesion: 'ログイン',

    heroBadge: 'コスタリカ共和国 · 国家電子行政本部',
    heroTitle: '地方自治体および市民サービス',
    heroSubtitle: 'コスタリカ全84カントンのための主権的監査・行政手続き・地域管理ワンストップ窓口',
    heroDesc: '市議会の公式議事録の閲覧、財務省での身元確認、事業許可の申請、自治体規約および法第8968号に基づく追跡可能なリアルタイム道路異常報告を行えます。',
    buscarPlaceholder: '自治体手続き、議事録、カントン、道路報告を検索...',
    botonBuscar: '検索',
    gobiernoActivo: '現在照会中の地方自治体:',
    municipalidadDe: '市庁・役場:',
    verConcejo: '議会を見る',

    sugTramites: '手続きと財務省',
    sugGobierno: '統治と市議会',
    sugInfra: 'インフラと報告',
    sugCultura: '文化とスポーツ',
    sugItem1: 'ワンストップ窓口と公的証明書',
    sugItem2: '商業許可と中小企業台帳',
    sugItem3: '財務省での身元確認',
    sugItem4: '市議会定例公式議事録',
    sugItem5: 'カントン参加型予算投票',
    sugItem6: '道路損壊およびインフラ異常報告',
    sugItem7: '3D GIS地理地形ビューア',
    sugItem8: 'CNE救護センターおよび911緊急通報',
    sugItem9: 'CCDR自治体スポーツ施設',
    sugItem10: '文化イベント日程と伝統',

    ejesRectoresTag: 'カントン行政管理 · 自治体規約',
    ejesRectoresTitle: '自治体運営の4つの基本方針',
    ejesRectoresDesc: '全84カントンにおける制度的透明性、地域の故障解決、市民参加型の発展を確保するために組織された主権的市民サービス。',
    eje1Titulo: 'ワンストップ窓口・各種手続き',
    eje1Desc: '税務管理、商業許可、自治体認可証、財務省の納税確認。',
    eje2Titulo: '自治体統治と市議会',
    eje2Desc: '定例・臨時議事録、市議会セッション、地域プロジェクトの閲覧。',
    eje3Titulo: 'インフラと公共事業',
    eje3Desc: '公共事業の3Dマップ監査、道路異常の報告、自治体の進捗追跡。',
    eje4Titulo: '地域コミュニティ・文化・スポーツ',
    eje4Desc: 'カントンスポーツ委員会、文化イベント、参加型予算、農業市。',
    abrirModulo: 'モジュールを開く',

    panelCivico: '市民パネル',
    navegacion: 'ナビゲーション',
    gobiernoLocalActivo: 'アクティブ地方自治体',
    cantonesCount: '84カントン',
    cantonSeleccionado: '選択中のカントン:',
    buscarCantonPlaceholder: 'カントンまたは州を検索...',
    todasProvincias: 'すべて',
    noCantonesEncontrados: '一致するカントンが見つかりません:',
    modoVisual: '表示モード',
    temaOscuro: 'オブシディアンダークテーマ',
    temaClaro: '公式ライトテーマ',
    modoClaroBtn: 'ライトモード',
    modoOscuroBtn: 'ダークモード',
    escalaTipografica: '文字サイズ設定 (法7600)',
    fase: '段階',
    deCuatro: '/ 4',
    faseBase: '標準',
    faseMedia: '中',
    faseAlta: '大',
    faseMaxima: '最大',
    idiomasOficiales: '公式言語',
    ochoIdiomas: '8言語',
    asistenciaVoz: '音声アシスト (TTS)',
    reproduciendo: '再生中...',
    detenerLectura: '読み上げ停止',
    leerPantalla: '現在の画面を読み上げ',
    guiaBtn: 'ガイド',
    modulosNacionales: '国家システムモジュール',
    sosEmergencias: '緊急支援センター & SOS 911',
    pieRepublica: 'コスタリカ共和国',
    pieLey: 'データ保護法 第8968号',

    portal: '全国ポータル',
    territorio: '3D領土と地図',
    reportes: 'インフラ報告',
    seguridad: '安全と緊急通報911',
    gobernanza: '統治と透明性',
    cultura: '文化と遺産',
    deportes: 'スポーツとレクリエーション',
    educacion: '教育と青少年',
    comercio: '商業と中小企業',
    turismo: '観光と自然',
    participacion: '市民参加',
    modulosTitulo: '国家システムモジュール',
    identidadTitulo: '身元と手続き',
    tituloHero: '地方自治体および市民サービス',
    subtituloHero: 'コスタリカ全84カントンのための主権的監査・行政手続き・地域管理ワンストップ窓口',
    descHero: '透明で包括的かつ誰もが利用できる市民デジタル空間で、国内7州84カントンとコミュニティを結びます。',
    botonExplorar: '検索',
    menuBoton: 'メニュー',
    cerrarBoton: '閉じる',
    leerVozAlta: '音声読み上げ',
    provinciasNum: '07',
    provinciasTexto: '主権州',
    cantonesNum: '84',
    cantonesTexto: 'カントンと地方自治体',
    distritosNum: '492',
    distritosTexto: '接続地区',
    accesoCivico: 'ログイン',
    registro: '新規登録',
    idiomasTitulo: '公式言語 (8言語)',
    a11yTitulo: 'ユニバーサルアクセシビリティ',
    guiaVoz: '音声ガイドツアー',
    detener: '停止',
    repSoberania: 'コスタリカ共和国 • 主権とデジタル包摂'
  }
};

// Aliases para máxima compatibilidad con códigos de bandera (CR, ES, US, CN, BR, FR, RU, JP)
LOCALES['CR'] = LOCALES['es-CR'];
LOCALES['ES'] = LOCALES['es-ES'];
LOCALES['US'] = LOCALES['en'];
LOCALES['CN'] = LOCALES['zh'];
LOCALES['BR'] = LOCALES['pt'];
LOCALES['FR'] = LOCALES['fr'];
LOCALES['RU'] = LOCALES['ru'];
LOCALES['JP'] = LOCALES['ja'];

// Aliases para códigos BCP-47
LOCALES['es-419'] = LOCALES['es-CR'];
LOCALES['en-US'] = LOCALES['en'];
LOCALES['zh-CN'] = LOCALES['zh'];
LOCALES['pt-BR'] = LOCALES['pt'];
LOCALES['fr-FR'] = LOCALES['fr'];
LOCALES['ru-RU'] = LOCALES['ru'];
LOCALES['ja-JP'] = LOCALES['ja'];
