/**
 * ============================================================================
 * COSTA RICA UNIDOS — DICCIONARIO CÍVICO SOBERANO E INTERNACIONALIZACIÓN (i18n)
 * Sistema de traducción 100% síncrono, puramente en memoria, con cero latencia.
 * 
 * Cobertura oficial para los 6 idiomas:
 *  1. es-latam: Español (Latinoamérica / Costa Rica / Base Soberana)
 *  2. es-ES:    Español (España)
 *  3. en:       English (Global)
 *  4. ja:       日本語 (Japonés)
 *  5. pt:       Português (Brasil / Portugal)
 *  6. cho:      Chorotega (Lengua Originaria Territorial de Guanacaste)
 * ============================================================================
 */

import { LOCALES } from './locales';

// Glosario y frases literales para Chorotega (Patrimonio Cultural Territorial de Costa Rica)
const GLOSARIO_CHOROTEGA_LITERAL = {
  "Inicio": "Tee",
  "Gestión & Trámites": "Yuri Muku",
  "Gobierno & Concejo": "Namu Kwe",
  "Territorio & Obras": "Kwe & Obras",
  "Comunidad & CCDR": "Komun",
  "Iniciar Sesión": "Kwe In",
  "Cerrar Sesión": "Kwe Out",
  "Volver a mi Interfaz": "Tee Kwe Interfaz",
  "Mi Interfaz": "Kwe Interfaz",
  "Portal Público": "Tee Público",
  "GOBIERNO LOCAL Y SERVICIOS CIUDADANOS": "NAMU KWE & YURI MUKU",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica.": "Yuri Muku Soberana de Fiscalización y Gestión para los 84 Cantones de Costa Rica.",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica": "Yuri Muku Soberana de Fiscalización y Gestión para los 84 Cantones de Costa Rica",
  "Buscar trámite municipal, acta de concejo, cantón o reporte vial...": "Tsuuri yuri muku, acta namu o reporte...",
  "Consultar": "Nami",
  "Trámites y Sede Electrónica": "Yuri Muku Electrónica",
  "Gobernanza y Actas del Concejo": "Gobernanza & Actas Namu",
  "Territorio 3D & Cartografía GIS": "Territorio 3D & Cartografía GIS",
  "Emergencias 911 y Albergues CNE": "Emergencias 911 & Albergues CNE",
  "REPÚBLICA DE COSTA RICA": "REPÚBLICA DE COSTA RICA",
  "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "SISTEMA NAMU DE GOBIERNOS LOCALES",
  "84 CANTONES AUTÓNOMOS": "84 CANTONES AUTÓNOMOS",
  "Cantón:": "Cantón:",
  "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "Nami acta namu concejo, cédula Hacienda, patentes y reporte vial tiempo real con Código Municipal y Ley N° 8968.",
  "REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL": "REPÚBLICA DE COSTA RICA · YURI MUKU NACIONAL",
  "Idiomas Oficiales": "Idiomas Oficiales",
  "Accesibilidad (Ley N° 7600)": "Accesibilidad Universal",
  "Escala de Tipografía": "Escala de Tipografía",
  "Adaptación de Daltonismo": "Adaptación Visual",
  "Ver Concejo": "Nami Concejo",
  "Municipalidad de": "Namu de",
  "Gobierno Local activo en consulta:": "Namu activo en consulta:",
  "Acceder a Ventanilla": "Nami Yuri Muku",
  "Consultar Actas y Concejo": "Nami Actas",
  "Reportar Avería Vial": "Reporte Kwe Obras",
  "Explorar CCDR y Ferias": "Nami Komun",
  "Provincias Soberanas": "Provincias Soberanas",
  "Gobiernos Locales Autónomos": "Gobiernos Locales Autónomos",
  "Distritos Fiscalizados": "Distritos Conectados"
};

// Frases literales para Inglés
const GLOSARIO_EN_LITERAL = {
  "Inicio": "Home",
  "Gestión & Trámites": "Procedures & Civic Services",
  "Gobierno & Concejo": "Government & City Council",
  "Territorio & Obras": "Territory & Public Works",
  "Comunidad & CCDR": "Community & Sports",
  "Iniciar Sesión": "Log In",
  "Cerrar Sesión": "Log Out",
  "Volver a mi Interfaz": "Back to My Dashboard",
  "Mi Interfaz": "My Dashboard",
  "Portal Público": "Public Portal",
  "GOBIERNO LOCAL Y SERVICIOS CIUDADANOS": "LOCAL GOVERNMENT & CITIZEN SERVICES",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica.": "Sovereign Citizen Portal for Oversight, Procedures, and Community Management for the 84 Cantons of Costa Rica.",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica": "Sovereign Citizen Portal for Oversight, Procedures, and Community Management for the 84 Cantons of Costa Rica",
  "Buscar trámite municipal, acta de concejo, cantón o reporte vial...": "Search municipal procedure, council minutes, canton or road report...",
  "Consultar": "Search",
  "Trámites y Sede Electrónica": "Procedures & Electronic Headquarters",
  "Gobernanza y Actas del Concejo": "Governance & Council Minutes",
  "Territorio 3D & Cartografía GIS": "3D Territory & GIS Cartography",
  "Emergencias 911 y Albergues CNE": "911 Emergencies & CNE Shelters",
  "REPÚBLICA DE COSTA RICA": "REPUBLIC OF COSTA RICA",
  "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "NATIONAL SYSTEM OF LOCAL GOVERNMENTS",
  "84 CANTONES AUTÓNOMOS": "84 AUTONOMOUS CANTONS",
  "Cantón:": "Canton:",
  "REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL": "REPUBLIC OF COSTA RICA · NATIONAL ELECTRONIC HEADQUARTERS",
  "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "Review official City Council minutes, validate citizen ID with the Treasury, process commercial permits, and report road incidents in real time with legal traceability under the Municipal Code and Law No. 8968.",
  "Idiomas Oficiales": "Official Languages",
  "Accesibilidad (Ley N° 7600)": "Accessibility (Law 7600)",
  "Escala de Tipografía": "Typography Scale",
  "Adaptación de Daltonismo": "Color Blindness Support",
  "Ver Concejo": "View Council",
  "Municipalidad de": "Municipality of",
  "Gobierno Local activo en consulta:": "Active Local Government:",
  "Acceder a Ventanilla": "Access Single Window",
  "Consultar Actas y Concejo": "Review Minutes & Council",
  "Reportar Avería Vial": "Report Road Incident",
  "Explorar CCDR y Ferias": "Explore Sports & Fairs",
  "Provincias Soberanas": "Sovereign Provinces",
  "Gobiernos Locales Autónomos": "Autonomous Local Governments",
  "Distritos Fiscalizados": "Connected Districts"
};

// Frases literales para Japonés
const GLOSARIO_JA_LITERAL = {
  "Inicio": "ホーム",
  "Gestión & Trámites": "行政手続き・管理",
  "Gobierno & Concejo": "地方行政・市議会",
  "Territorio & Obras": "地域・公共工事",
  "Comunidad & CCDR": "地域コミュニティ・体育",
  "Iniciar Sesión": "ログイン",
  "Cerrar Sesión": "ログアウト",
  "Volver a mi Interfaz": "管理画面へ戻る",
  "Mi Interfaz": "マイ画面",
  "Portal Público": "市民ポータル",
  "GOBIERNO LOCAL Y SERVICIOS CIUDADANOS": "地方自治体および市民サービス",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica.": "コスタリカ全84郡のための主権市民監査・手続き・地域管理総合ポータル。",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica": "コスタリカ全84郡のための主権市民監査・手続き・地域管理総合ポータル",
  "Buscar trámite municipal, acta de concejo, cantón o reporte vial...": "行政手続き、市議会議事録、郡または道路報告を検索...",
  "Consultar": "検索",
  "Trámites y Sede Electrónica": "電子行政・諸手続き",
  "Gobernanza y Actas del Concejo": "ガバナンス・市議会議事録",
  "Territorio 3D & Cartografía GIS": "3D地形・GIS地理情報",
  "Emergencias 911 y Albergues CNE": "911緊急通報および避難所",
  "REPÚBLICA DE COSTA RICA": "コスタリカ共和国",
  "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "全国地方自治体システム",
  "84 CANTONES AUTÓNOMOS": "84の自治郡",
  "Cantón:": "郡:",
  "REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL": "コスタリカ共和国・国家電子ポータル",
  "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "市議会の公式議事録の確認、財務省データベースでの身分照会、商業許可の申請、リアルタイムの道路インシデント報告を法的なトレーサビリティのもとで実行できます。",
  "Idiomas Oficiales": "公式言語",
  "Accesibilidad (Ley N° 7600)": "ユニバーサルアクセシビリティ",
  "Escala de Tipografía": "文字サイズ設定",
  "Adaptación de Daltonismo": "色覚補正",
  "Ver Concejo": "議会を見る",
  "Municipalidad de": "市庁・役場:",
  "Gobierno Local activo en consulta:": "現在照会中の地方自治体:",
  "Acceder a Ventanilla": "窓口へ進む",
  "Consultar Actas y Concejo": "議事録と議会を確認",
  "Reportar Avería Vial": "道路損壊を報告",
  "Explorar CCDR y Ferias": "CCDRと市場を見る",
  "Provincias Soberanas": "主権州",
  "Gobiernos Locales Autónomos": "自治カントン",
  "Distritos Fiscalizados": "接続地区"
};

// Frases literales para Portugués
const GLOSARIO_PT_LITERAL = {
  "Inicio": "Início",
  "Gestión & Trámites": "Gestão e Trâmites",
  "Gobierno & Concejo": "Governo e Conselho",
  "Territorio & Obras": "Território e Obras",
  "Comunidad & CCDR": "Comunidade e Esporte",
  "Iniciar Sesión": "Iniciar Sessão",
  "Cerrar Sesión": "Encerrar Sessão",
  "Volver a mi Interfaz": "Voltar ao Meu Painel",
  "Mi Interfaz": "Meu Painel",
  "Portal Público": "Portal Público",
  "GOBIERNO LOCAL Y SERVICIOS CIUDADANOS": "GOVERNO LOCAL E SERVIÇOS AO CIDADÃO",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica.": "Portal Soberano de Fiscalização, Trâmites e Gestão Comunitária para os 84 Cantões da Costa Rica.",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica": "Portal Soberano de Fiscalização, Trâmites e Gestão Comunitária para os 84 Cantões da Costa Rica",
  "Buscar trámite municipal, acta de concejo, cantón o reporte vial...": "Pesquisar trâmite municipal, ata do conselho, cantão ou relatório viário...",
  "Consultar": "Consultar",
  "Trámites y Sede Electrónica": "Trâmites e Sede Eletrônica",
  "Gobernanza y Actas del Concejo": "Governança e Atas do Conselho",
  "Territorio 3D & Cartografía GIS": "Território 3D e Cartografia GIS",
  "Emergencias 911 y Albergues CNE": "Emergências 911 e Abrigos CNE",
  "REPÚBLICA DE COSTA RICA": "REPÚBLICA DA COSTA RICA",
  "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "SISTEMA NACIONAL DE GOVERNOS LOCAIS",
  "84 CANTONES AUTÓNOMOS": "84 CANTÕES AUTÔNOMOS",
  "Cantón:": "Cantão:",
  "REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL": "REPÚBLICA DA COSTA RICA · SEDE ELETRÔNICA NACIONAL",
  "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "Consulte atas oficiais do Conselho Municipal, valide identidades na Receita, tramite alvarás e reporte ocorrências viárias em tempo real com rastreabilidade legal.",
  "Idiomas Oficiales": "Idiomas Oficiais",
  "Accesibilidad (Ley N° 7600)": "Acessibilidade Universal",
  "Escala de Tipografía": "Escala de Tipografia",
  "Adaptación de Daltonismo": "Apoio a Daltonismo",
  "Ver Concejo": "Ver Câmara",
  "Municipalidad de": "Município de",
  "Gobierno Local activo en consulta:": "Governo Local ativo em consulta:",
  "Acceder a Ventanilla": "Acessar Balcão",
  "Consultar Actas y Concejo": "Consultar Atas e Conselho",
  "Reportar Avería Vial": "Relatar Ocorrência Viária",
  "Explorar CCDR y Ferias": "Explorar Esportes e Feiras",
  "Provincias Soberanas": "Províncias Soberanas",
  "Gobiernos Locales Autónomos": "Governos Locais Autônomos",
  "Distritos Fiscalizados": "Distritos Conectados"
};

// Frases literales para Español de España
const GLOSARIO_ES_ES_LITERAL = {
  "Inicio": "Inicio",
  "Gestión & Trámites": "Gestión y Trámites",
  "Gobierno & Concejo": "Gobierno y Ayuntamiento",
  "Territorio & Obras": "Territorio y Obras Públicas",
  "Comunidad & CCDR": "Comunidad y Deportes",
  "Iniciar Sesión": "Iniciar Sesión",
  "Cerrar Sesión": "Cerrar Sesión",
  "Volver a mi Interfaz": "Volver a mi Panel",
  "Mi Interfaz": "Mi Panel",
  "Portal Público": "Portal Público",
  "GOBIERNO LOCAL Y SERVICIOS CIUDADANOS": "GOBIERNO LOCAL Y SERVICIOS AL CIUDADANO",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica.": "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica.",
  "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica": "Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica",
  "Buscar trámite municipal, acta de concejo, cantón o reporte vial...": "Buscar trámite municipal, acta del pleno, cantón o informe vial...",
  "Consultar": "Consultar",
  "Trámites y Sede Electrónica": "Trámites y Sede Electrónica",
  "Gobernanza y Actas del Concejo": "Gobernanza y Actas del Pleno",
  "Territorio 3D & Cartografía GIS": "Territorio 3D y Cartografía GIS",
  "Emergencias 911 y Albergues CNE": "Emergencias 911 y Albergues CNE",
  "REPÚBLICA DE COSTA RICA": "REPÚBLICA DE COSTA RICA",
  "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "SISTEMA NACIONAL DE GOBIERNOS LOCALES",
  "84 CANTONES AUTÓNOMOS": "84 MUNICIPIOS AUTÓNOMOS",
  "Cantón:": "Municipio:",
  "REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL": "REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL",
  "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "Consulte actas oficiales del Pleno Municipal, valide documentos de identidad con Hacienda, tramite licencias de actividad e incidencias viales en tiempo real.",
  "Idiomas Oficiales": "Idiomas Oficiales",
  "Accesibilidad (Ley N° 7600)": "Accesibilidad (Ley N° 7600)",
  "Escala de Tipografía": "Escala de Tipografía",
  "Adaptación de Daltonismo": "Adaptación de Daltonismo",
  "Ver Concejo": "Ver Pleno",
  "Municipalidad de": "Ayuntamiento de",
  "Gobierno Local activo en consulta:": "Gobierno Local activo en consulta:",
  "Acceder a Ventanilla": "Acceder a Ventanilla",
  "Consultar Actas y Concejo": "Consultar Actas y Pleno",
  "Reportar Avería Vial": "Informar Avería Vial",
  "Explorar CCDR y Ferias": "Explorar Deportes y Ferias",
  "Provincias Soberanas": "Provincias Soberanas",
  "Gobiernos Locales Autónomos": "Municipios Autónomos",
  "Distritos Fiscalizados": "Distritos Conectados"
};

// DICCIONARIOS BASE CONSOLIDADOS
const dictEsCR = LOCALES['es-CR'] || {};
const dictEsES = LOCALES['es-ES'] || {};
const dictEn = LOCALES['en'] || {};
const dictJa = LOCALES['ja'] || {};
const dictPt = LOCALES['pt'] || {};

// Diccionario para Chorotega (combinando claves tradicionales y glosario literal)
const dictCho = {
  ...dictEsCR,
  republicaCostaRica: 'REPÚBLICA DE COSTA RICA',
  sedeElectronica: 'YURI MUKU NACIONAL',
  sistemaGobiernosLocales: 'SISTEMA NAMU DE GOBIERNOS LOCALES',
  cantonLabel: 'Cantón:',
  cantonesAutonomos: '84 CANTONES AUTÓNOMOS',
  navTramites: 'Yuri Muku',
  navGobierno: 'Namu Kwe',
  navTerritorio: 'Kwe & Obras',
  navComunidad: 'Komun & CCDR',
  navSos: 'SOS 911',
  navPanelCivico: 'Kwe Interfaz',
  navRegistrarse: 'Kwe In',
  navCerrarSesion: 'Kwe Out',
  navIniciarSesion: 'Kwe In',
  heroBadge: 'REPÚBLICA DE COSTA RICA · YURI MUKU NACIONAL',
  heroTitle: 'NAMU KWE & YURI MUKU',
  heroSubtitle: 'Yuri Muku Soberana de Fiscalización y Gestión para los 84 Cantones de Costa Rica',
  heroDesc: 'Nami acta namu concejo, cédula Hacienda, patentes y reporte vial tiempo real con Código Municipal y Ley N° 8968.',
  buscarPlaceholder: 'Tsuuri yuri muku, acta namu o reporte...',
  botonBuscar: 'Nami',
  gobiernoActivo: 'Namu activo en consulta:',
  municipalidadDe: 'Namu de',
  verConcejo: 'Nami Concejo',
  sugTramites: 'Yuri Muku & Hacienda',
  sugGobierno: 'Namu Kwe & Actas',
  sugInfra: 'Kwe Obras & Nami',
  sugCultura: 'Komun & CCDR',
  sugItem1: 'Yuri Muku Única y Certificaciones',
  sugItem2: 'Patentes Comerciales y PyME',
  sugItem3: 'Validación de Cédula ante Hacienda',
  sugItem4: 'Actas Ordinarias del Namu Concejo',
  sugItem5: 'Presupuesto Komun Participativo',
  sugItem6: 'Reporte de Averías Viales e Infraestructura',
  sugItem7: 'Visor Cartográfico GIS 3D y Relieve',
  sugItem8: 'Centro de Auxilio CNE y SOS 911',
  sugItem9: 'Instalaciones Deportivas del CCDR',
  sugItem10: 'Agenda Cultural y Tradiciones',
  ejesRectoresTag: 'ADMINISTRACIÓN PÚBLICA CANTONAL · CÓDIGO MUNICIPAL',
  ejesRectoresTitle: 'Los 4 Ejes Rectores de la Gestión Municipal',
  ejesRectoresDesc: 'Servicios cívicos soberanos organizados para garantizar la transparencia institucional y el desarrollo territorial.',
  eje1Titulo: 'Yuri Muku Única & Trámites',
  eje1Desc: 'Gestión tributaria, patentes comerciales y validación sincronizada ante Hacienda.',
  eje2Titulo: 'Gobernanza & Namu Concejo',
  eje2Desc: 'Fiscalización de actas ordinarias y extraordinarias, acuerdos vinculantes y presupuesto.',
  eje3Titulo: 'Kwe Obras & Infraestructura',
  eje3Desc: 'Reporte georreferenciado de averías viales, fallas de alumbrado público y fiscalización comunal.',
  eje4Titulo: 'Komun, Cultura & CCDR',
  eje4Desc: 'Comités Cantonales de Deportes, ferias comunitarias y directorio cívico.',
  abrirModulo: 'Nami Módulo',
  panelCivico: 'Kwe Interfaz',
  provinciasTexto: 'Provincias Soberanas',
  cantonesTexto: 'Cantones Autónomos',
  distritosTexto: 'Distritos Conectados',
  accesoCivico: 'Kwe In',
  registro: 'Kwe In',
  idiomasTitulo: 'IDIOMAS OFICIALES',
  a11yTitulo: 'ACCESIBILIDAD UNIVERSAL',
  guiaVoz: 'Guía Asistida por Voz',
  detener: 'Detener',
  repSoberania: 'República de Costa Rica • Soberanía e Inclusión Digital',
  ...GLOSARIO_CHOROTEGA_LITERAL
};

// DICCIONARIO CÍVICO CONSOLIDADO (En memoria, 0ms de respuesta, 100% Síncrono)
export const DICCIONARIO_CIVICO = {
  // 1. Español Latinoamericano (Costa Rica / Base)
  'es-latam': {
    ...dictEsCR
  },

  // 2. Español de España
  'es-ES': {
    ...dictEsES,
    ...GLOSARIO_ES_ES_LITERAL
  },

  // 3. Inglés
  'en': {
    ...dictEn,
    ...GLOSARIO_EN_LITERAL
  },

  // 4. Japonés
  'ja': {
    ...dictJa,
    ...GLOSARIO_JA_LITERAL
  },

  // 5. Portugués
  'pt': {
    ...dictPt,
    ...GLOSARIO_PT_LITERAL
  },

  // 6. Chorotega (Guanacaste Territorial)
  'cho': dictCho
};

// Aliases para compatibilidad con estándares BCP-47 e ISO
DICCIONARIO_CIVICO['es-419'] = DICCIONARIO_CIVICO['es-latam'];
DICCIONARIO_CIVICO['es-CR'] = DICCIONARIO_CIVICO['es-latam'];
DICCIONARIO_CIVICO['es'] = DICCIONARIO_CIVICO['es-latam'];
DICCIONARIO_CIVICO['CR'] = DICCIONARIO_CIVICO['es-latam'];

DICCIONARIO_CIVICO['ES'] = DICCIONARIO_CIVICO['es-ES'];
DICCIONARIO_CIVICO['es_es'] = DICCIONARIO_CIVICO['es-ES'];

DICCIONARIO_CIVICO['en-US'] = DICCIONARIO_CIVICO['en'];
DICCIONARIO_CIVICO['US'] = DICCIONARIO_CIVICO['en'];

DICCIONARIO_CIVICO['ja-JP'] = DICCIONARIO_CIVICO['ja'];
DICCIONARIO_CIVICO['JP'] = DICCIONARIO_CIVICO['ja'];

DICCIONARIO_CIVICO['pt-BR'] = DICCIONARIO_CIVICO['pt'];
DICCIONARIO_CIVICO['pt-PT'] = DICCIONARIO_CIVICO['pt'];
DICCIONARIO_CIVICO['BR'] = DICCIONARIO_CIVICO['pt'];

DICCIONARIO_CIVICO['chorotega'] = DICCIONARIO_CIVICO['cho'];

export default DICCIONARIO_CIVICO;
