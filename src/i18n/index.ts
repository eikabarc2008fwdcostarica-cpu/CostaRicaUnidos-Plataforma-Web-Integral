/**
 * ============================================================================
 * COSTA RICA UNIDOS — MOTOR DE INTERNACIONALIZACIÓN (i18n)
 * Cobertura oficial para 8 idiomas (RNF-02 / Soberanía e Inclusión Digital)
 * ============================================================================
 */

import { SupportedLanguage } from './costaRicaGlossary';

export * from './costaRicaGlossary';

export interface LanguageMetadata {
  code: SupportedLanguage;
  localeCode: string; // ej: es-CR
  nativeName: string;
  englishName: string;
  flagEmoji: string;
  flagCode: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMetadata> = {
  'es-CR': {
    code: 'es-CR',
    localeCode: 'es-CR',
    nativeName: 'Español (Costa Rica)',
    englishName: 'Spanish (Latin America / Costa Rica)',
    flagEmoji: 'CR',
    flagCode: 'CR',
    direction: 'ltr'
  },
  'es-ES': {
    code: 'es-ES',
    localeCode: 'es-ES',
    nativeName: 'Español (España)',
    englishName: 'Spanish (Spain)',
    flagEmoji: 'ES',
    flagCode: 'ES',
    direction: 'ltr'
  },
  en: {
    code: 'en',
    localeCode: 'en-US',
    nativeName: 'English (US)',
    englishName: 'English',
    flagEmoji: 'US',
    flagCode: 'US',
    direction: 'ltr'
  },
  zh: {
    code: 'zh',
    localeCode: 'zh-CN',
    nativeName: '中文 (简体)',
    englishName: 'Chinese (Mandarin)',
    flagEmoji: 'CN',
    flagCode: 'CN',
    direction: 'ltr'
  },
  pt: {
    code: 'pt',
    localeCode: 'pt-BR',
    nativeName: 'Português',
    englishName: 'Portuguese',
    flagEmoji: 'BR',
    flagCode: 'BR',
    direction: 'ltr'
  },
  fr: {
    code: 'fr',
    localeCode: 'fr-FR',
    nativeName: 'Français',
    englishName: 'French',
    flagEmoji: 'FR',
    flagCode: 'FR',
    direction: 'ltr'
  },
  ru: {
    code: 'ru',
    localeCode: 'ru-RU',
    nativeName: 'Русский',
    englishName: 'Russian',
    flagEmoji: 'RU',
    flagCode: 'RU',
    direction: 'ltr'
  },
  ja: {
    code: 'ja',
    localeCode: 'ja-JP',
    nativeName: '日本語',
    englishName: 'Japanese',
    flagEmoji: 'JP',
    flagCode: 'JP',
    direction: 'ltr'
  }
};

/**
 * Normaliza el código de idioma recibido (soporta códigos cortos de 2 letras y etiquetas BCP-47)
 */
export function normalizeLanguageCode(langCode: string): SupportedLanguage {
  const clean = langCode.trim().toLowerCase();

  if (clean === 'cr' || clean === 'es-cr' || clean === 'es') return 'es-CR';
  if (clean === 'es-es') return 'es-ES';
  if (clean === 'us' || clean === 'en' || clean === 'en-us' || clean === 'en-gb') return 'en';
  if (clean === 'cn' || clean === 'zh' || clean === 'zh-cn' || clean === 'zh-tw') return 'zh';
  if (clean === 'br' || clean === 'pt' || clean === 'pt-br' || clean === 'pt-pt') return 'pt';
  if (clean === 'fr' || clean === 'fr-fr') return 'fr';
  if (clean === 'ru' || clean === 'ru-ru') return 'ru';
  if (clean === 'jp' || clean === 'ja' || clean === 'ja-jp') return 'ja';

  return 'es-CR';
}

/**
 * Diccionario de traducciones complementarias para los módulos funcionales de Alanie
 */
export const MODULE_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  'es-CR': {
    gobernanzaTitulo: 'Espacio Administrativo Cantonal y Actas',
    organigramaMunicipal: 'Organigrama del Gobierno Local',
    visorActas: 'Visor de Actas Municipales',
    descargarPdf: 'Descargar Documento Oficial en PDF',
    culturaTitulo: 'Identidad Cultural, Tradiciones e Himnos',
    reproductorHimno: 'Reproductor Oficial de Himnos Cantonales',
    verPartitura: 'Ver Partitura Oficial',
    deportesTitulo: 'Ecosistema Deportivo Cantonal (CCDR)',
    estadoInstalacion: 'Disponibilidad de Instalaciones',
    abierto: 'Abierto / Disponible',
    mantenimiento: 'En Mantenimiento',
    alquiler: 'Alquiler / Ocupado',
    educacionTitulo: 'Directorio de Infraestructura Educativa y CTPs',
    comercioTitulo: 'Directorio Comercial PYMES y Feria del Agricultor',
    selloHacienda: 'Comercio Verificado por Hacienda • Régimen Simplificado',
    turismoTitulo: 'Guía de Turismo Cantonal y Aventura Sostenible',
    participacionTitulo: 'Participación Ciudadana y Presupuesto Participativo',
    unVotoPorCedula: 'Blindaje Antifraude: 1 voto por cédula legal activa',
    itinerarioIaTitulo: "Planificador 'Itinerario Pura Vida' con Relieve 3D",
    validandoHacienda: 'Validando identidad ante el Ministerio de Hacienda...',
    cedulaValida: 'Cédula verificada con éxito',
    cedulaInvalida: 'Identificación no registrada ante Hacienda'
  },
  'es-ES': {
    gobernanzaTitulo: 'Espacio Administrativo Municipal y Actas',
    organigramaMunicipal: 'Organigrama del Ayuntamiento',
    visorActas: 'Visor de Actas del Pleno Municipal',
    descargarPdf: 'Descargar Documento Oficial en PDF',
    culturaTitulo: 'Identidad Cultural, Tradiciones e Himnos',
    reproductorHimno: 'Reproductor de Himnos Municipales',
    verPartitura: 'Ver Partitura Oficial',
    deportesTitulo: 'Deportes y Patronato Municipal',
    estadoInstalacion: 'Disponibilidad de Instalaciones',
    abierto: 'Abierto / Disponible',
    mantenimiento: 'En Mantenimiento',
    alquiler: 'Alquiler / Ocupado',
    educacionTitulo: 'Directorio de Centros Educativos y FP',
    comercioTitulo: 'Directorio Comercial de Pymes y Mercados',
    selloHacienda: 'Comercio Verificado por Hacienda • Régimen Simplificado',
    turismoTitulo: 'Guía de Turismo y Rutas Sostenibles',
    participacionTitulo: 'Participación Ciudadana y Votación',
    unVotoPorCedula: 'Blindaje Antifraude: 1 voto por documento de identidad activo',
    itinerarioIaTitulo: "Planificador de Itinerarios Inteligente con Relieve 3D",
    validandoHacienda: 'Validando identidad con el Ministerio de Hacienda...',
    cedulaValida: 'Documento verificado con éxito',
    cedulaInvalida: 'Documento no registrado ante Hacienda'
  },
  en: {
    gobernanzaTitulo: 'Cantonal Administrative Space & Official Minutes',
    organigramaMunicipal: 'Local Government Organizational Chart',
    visorActas: 'Municipal Council Minutes Viewer',
    descargarPdf: 'Download Official PDF Document',
    culturaTitulo: 'Cultural Heritage, Traditions & Cantonal Anthems',
    reproductorHimno: 'Official Cantonal Anthem Player',
    verPartitura: 'View Sheet Music',
    deportesTitulo: 'Cantonal Sports Ecosystem (CCDR)',
    estadoInstalacion: 'Sports Facilities Availability',
    abierto: 'Open / Available',
    mantenimiento: 'Under Maintenance',
    alquiler: 'Reserved / Rental',
    educacionTitulo: 'Educational Infrastructure & Technical Schools (CTP)',
    comercioTitulo: 'Local SMEs Directory & Farmers’ Market',
    selloHacienda: 'Ministry of Finance Verified Merchant • Simplified Tax Regime',
    turismoTitulo: 'Cantonal Tourism Guide & Sustainable Adventure',
    participacionTitulo: 'Citizen Participation & Budget Voting',
    unVotoPorCedula: 'Anti-fraud Shield: Exactly 1 vote per active national ID',
    itinerarioIaTitulo: "'Pura Vida Itinerary' Generative AI Planner with 3D Relief",
    validandoHacienda: 'Validating identity with Ministry of Finance...',
    cedulaValida: 'Identity verified successfully',
    cedulaInvalida: 'ID number not registered with Ministry of Finance'
  },
  zh: {
    gobernanzaTitulo: '州行政空间与市政会议记录',
    organigramaMunicipal: '地方政府组织架构',
    visorActas: '市政官方会议记录阅读器',
    descargarPdf: '下载官方PDF文件',
    culturaTitulo: '文化传统与州颂赞歌',
    reproductorHimno: '官方州歌播放器与歌词同步',
    verPartitura: '查看官方五线谱',
    deportesTitulo: '州体育生态系统 (CCDR)',
    estadoInstalacion: '体育设施开放状态',
    abierto: '开放 / 可预约',
    mantenimiento: '维护保养中',
    alquiler: '已被租用 / 占用',
    educacionTitulo: '教育基础设施与职业技术学校 (CTP)',
    comercioTitulo: '本地中小企业名录与农夫市集',
    selloHacienda: '财政部认证合规商户 • 简化税制',
    turismoTitulo: '生态旅游指南与可持续探险',
    participacionTitulo: '公民参与与社区预算投票',
    unVotoPorCedula: '反欺诈验证：每个合法有效身份证件仅限一票',
    itinerarioIaTitulo: "AI智能规划：纯正生活3D地形定制路线",
    validandoHacienda: '正在连接哥斯达黎加财政部验证身份...',
    cedulaValida: '身份证件验证成功',
    cedulaInvalida: '该身份证件未在财政部登记'
  },
  pt: {
    gobernanzaTitulo: 'Espaço Administrativo Municipal e Atas Oficiais',
    organigramaMunicipal: 'Organograma do Governo Municipal',
    visorActas: 'Visualizador de Atas da Câmara',
    descargarPdf: 'Baixar Documento Oficial em PDF',
    culturaTitulo: 'Identidade Cultural, Tradições e Hinos',
    reproductorHimno: 'Reprodutor de Hinos Municipais',
    verPartitura: 'Ver Partitura Oficial',
    deportesTitulo: 'Ecossistema Esportivo Municipal (CCDR)',
    estadoInstalacion: 'Disponibilidade de Instalações',
    abierto: 'Aberto / Disponível',
    mantenimiento: 'Em Manutenção',
    alquiler: 'Alugado / Ocupado',
    educacionTitulo: 'Diretório de Escolas e Colégios Técnicos (CTP)',
    comercioTitulo: 'Diretório de PMEs e Feira do Produtor',
    selloHacienda: 'Comércio Verificado pela Fazenda • Regime Simplificado',
    turismoTitulo: 'Guia de Turismo e Aventura Sustentável',
    participacionTitulo: 'Participação Cidadã e Orçamento Participativo',
    unVotoPorCedula: 'Proteção Antifraude: 1 voto por CPF/documento ativo',
    itinerarioIaTitulo: "Planejador Inteligente 'Itinerário Pura Vida' 3D",
    validandoHacienda: 'Validando identidade junto ao Ministério da Fazenda...',
    cedulaValida: 'Identificação verificada com sucesso',
    cedulaInvalida: 'Identificação não encontrada na Fazenda'
  },
  fr: {
    gobernanzaTitulo: 'Espace Administratif Cantonal et Procès-Verbaux',
    organigramaMunicipal: 'Organigramme de la Mairie',
    visorActas: 'Lecteur des Délibérations Municipales',
    descargarPdf: 'Télécharger le Document Officiel PDF',
    culturaTitulo: 'Patrimoine Culturel, Traditions et Hymnes',
    reproductorHimno: 'Lecteur Officiel des Hymnes Cantonaux',
    verPartitura: 'Afficher la Partition',
    deportesTitulo: 'Écosystème Sportif Cantonal (CCDR)',
    estadoInstalacion: 'Disponibilité des Équipements',
    abierto: 'Ouvert / Disponible',
    mantenimiento: 'En Maintenance',
    alquiler: 'Réservé / Loué',
    educacionTitulo: 'Infrastructures Éducatives et Lycées Techniques (CTP)',
    comercioTitulo: 'Annuaire des PME et Marché des Producteurs',
    selloHacienda: 'Commerce Vérifié par le Fisc • Régime Simplifié',
    turismoTitulo: 'Guide de Tourisme et Aventure Durable',
    participacionTitulo: 'Participation Citoyenne et Budget Participatif',
    unVotoPorCedula: 'Bouclier Antifraude : 1 seul vote par numéro d’identité actif',
    itinerarioIaTitulo: "Planificateur d’Itinéraire IA 'Pura Vida' avec Relief 3D",
    validandoHacienda: 'Vérification en cours auprès du Ministère des Finances...',
    cedulaValida: 'Identité vérifiée avec succès',
    cedulaInvalida: 'Numéro d’identité non répertorié au Ministère'
  },
  ru: {
    gobernanzaTitulo: 'Муниципальный административный сектор и протоколы',
    organigramaMunicipal: 'Структура органов местного самоуправления',
    visorActas: 'Просмотр официальных протоколов заседаний',
    descargarPdf: 'Скачать официальный PDF-документ',
    culturaTitulo: 'Культурное наследие, традиции и гимны',
    reproductorHimno: 'Проигрыватель официальных гимнов кантонов',
    verPartitura: 'Посмотреть ноты',
    deportesTitulo: 'Муниципальный спортивный сектор (CCDR)',
    estadoInstalacion: 'Доступность спортивных объектов',
    abierto: 'Открыто / Свободно',
    mantenimiento: 'Техническое обслуживание',
    alquiler: 'Арендовано / Занято',
    educacionTitulo: 'Каталог учебных заведений и колледжей (CTP)',
    comercioTitulo: 'Каталог малого бизнеса и фермерских ярмарок',
    selloHacienda: 'Проверено налоговой службой • Упрощенный режим',
    turismoTitulo: 'Гид по экологическому туризму и приключениям',
    participacionTitulo: 'Гражданское участие и голосование по проектам',
    unVotoPorCedula: 'Защита от мошенничества: 1 голос на 1 активный паспорт',
    itinerarioIaTitulo: "ИИ-планировщик маршрутов 'Пура Вида' с 3D-рельефом",
    validandoHacienda: 'Проверка личности в Министерстве финансов...',
    cedulaValida: 'Удостоверение успешно подтверждено',
    cedulaInvalida: 'Удостоверение не зарегистрировано в налоговой'
  },
  ja: {
    gobernanzaTitulo: 'カントン行政空間および公会議事録',
    organigramaMunicipal: '地方自治体組織図',
    visorActas: '市議会公式議事録ビューアー',
    descargarPdf: '公式PDF文書をダウンロード',
    culturaTitulo: '文化遺産・伝統およびカントン讃歌',
    reproductorHimno: '公式カントン歌プレイヤー (楽譜・歌詞同期)',
    verPartitura: '公式楽譜を表示',
    deportesTitulo: 'カントンスポーツ統括エコシステム (CCDR)',
    estadoInstalacion: 'スポーツ施設空き状況',
    abierto: '開館中 / 利用可能',
    mantenimiento: 'メンテナンス中',
    alquiler: '貸出中 / 占有',
    educacionTitulo: '教育施設および専門技術高校 (CTP) 名簿',
    comercioTitulo: '地域中小企業名簿および農民朝市',
    selloHacienda: '財務省公式認証事業者 • 簡易課税制度',
    turismoTitulo: 'カントン観光ガイドおよび持続可能アドベンチャー',
    participacionTitulo: '市民参加型予算および住民投票',
    unVotoPorCedula: '不正防止認証：有効な身分証明番号1件につき1票厳守',
    itinerarioIaTitulo: "生成AI『プラ・ビダ旅程プランナー』3D地形連携",
    validandoHacienda: '財務省データベースで身元を確認中...',
    cedulaValida: '身元認証が完了しました',
    cedulaInvalida: '該当の身分証明書番号は登録されていません'
  }
};

/**
 * Traduce una clave específica al idioma deseado con fallback automático
 */
export function translateModuleKey(key: string, lang: SupportedLanguage = 'es-CR'): string {
  const dictionary = MODULE_TRANSLATIONS[lang] || MODULE_TRANSLATIONS['es-CR'];
  return dictionary[key] || MODULE_TRANSLATIONS['es-CR'][key] || key;
}
