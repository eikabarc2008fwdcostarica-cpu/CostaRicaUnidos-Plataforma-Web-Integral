/**
 * COSTA RICA UNIDOS — Servicio de Integración con Gemini 3.6 Flash / 2.0 Flash (AI Engineer GovTech)
 * 
 * Orquesta la inteligencia artificial conversacional para:
 * 1. Narraciones adaptativas y enriquecidas del Recorrido Asistido por Voz (Spotlight Tour).
 * 2. Respuestas cívicas en tiempo real a preguntas del usuario sobre el componente enfocado.
 * 3. Base de conocimiento cívico de respaldo multi-idioma (8 idiomas oficiales) con entonación natural.
 */

import { enmascararDatosPersonales } from '../config/promptsIA.js';

// Modelos soportados vigentes (prioriza VITE_GEMINI_MODEL si está definido en .env)
const ENV_MODEL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL) || null;
export const GEMINI_MODELS = [
  ...(ENV_MODEL && ENV_MODEL.trim() ? [ENV_MODEL.trim()] : []),
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro'
];
export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Obtiene la API Key de Gemini configurada en el entorno o en localStorage
 * Prioridad: import.meta.env.VITE_GEMINI_API_KEY > window.ENV.VITE_GEMINI_API_KEY > localStorage
 */
export function getGeminiApiKey() {
  try {
    // 1. Variable de entorno Vite o inyección en runtime (window.ENV)
    const envKey =
      (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY)) ||
      (typeof window !== 'undefined' && (window.ENV?.VITE_GEMINI_API_KEY || window.ENV?.GEMINI_API_KEY));
    if (envKey && typeof envKey === 'string' && envKey.trim()) {
      return envKey.trim();
    }

    // 2. Almacenamiento local (localStorage)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key') || localStorage.getItem('VITE_GEMINI_API_KEY');
      if (stored && stored.trim()) return stored.trim();
    }
  } catch (e) {
    console.warn('[GeminiService] Error al leer API Key:', e);
  }
  return null;
}

/**
 * Guarda o actualiza la API Key de Gemini en localStorage
 */
export function setGeminiApiKey(key) {
  try {
    if (!key || !key.trim()) {
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('VITE_GEMINI_API_KEY');
    } else {
      localStorage.setItem('gemini_api_key', key.trim());
    }
  } catch (e) {
    console.warn('[GeminiService] Error al guardar API Key:', e);
  }
}

/**
 * BASE DE CONOCIMIENTO NARRATIVA OFICIAL (8 IDIOMAS)
 * Cuidadosamente redactada para locución fluida, concisa y accesible bajo Ley 7600
 */
export const TOUR_STEPS_KNOWLEDGE = {
  'es-CR': [
    {
      id: 'nav-institucional',
      title: 'Navegación Superior y Categorías Cívicas',
      selector: '[data-tour="nav-institucional"]',
      badge: 'Paso 1 de 6',
      narracion: 'Bienvenido a Costa Rica Unidos. En la barra superior encontrará el acceso directo a los cuatro grandes pilares municipales: Trámites y Hacienda, Gobierno y Concejo, Territorio y Obras, y Comunidad. Puede desplegar cada sección para realizar gestiones sin filas.',
      resumen: 'Acceso a trámites, actas de concejo, obras comunales y servicios ciudadanos.',
      tips: ['Hover sobre una categoría para ver sus trámites directos.', 'Use el botón SOS 911 en caso de emergencia cantonal.']
    },
    {
      id: 'selector-canton',
      title: 'Selector de Gobierno Local y Cantón',
      selector: '[data-tour="selector-canton"]',
      badge: 'Paso 2 de 6',
      narracion: 'En este indicador institucional puede consultar y cambiar el cantón activo entre los 84 cantones del país. Al seleccionar su municipalidad, toda la información de tasas, actas y reportes comunales se adapta automáticamente a su localidad.',
      resumen: 'Personalice la plataforma eligiendo su provincia y cantón de residencia.',
      tips: ['Haga clic para abrir el listado de los 84 cantones con buscador rápido.', 'Los trámites se sincronizan con las tasas del cantón elegido.']
    },
    {
      id: 'buscador-civico',
      title: 'Buscador Cívico Universal',
      selector: '[data-tour="buscador-civico"]',
      badge: 'Paso 3 de 6',
      narracion: 'Este es el Buscador Cívico Universal. Escriba el nombre de un trámite como validación de cédula, patente comercial, o reporte de avería en carretera. El sistema le sugerirá rutas oficiales y documentos del Concejo al instante.',
      resumen: 'Consulte trámites, actas, reporte de huecos y tasas municipales al instante.',
      tips: ['Escriba palabras como "cédula", "hueco", "acta" o el nombre de su cantón.', 'Presione Enter o Consultar para abrir el resultado directo.']
    },
    {
      id: 'ejes-municipales',
      title: 'Ejes Rectores de la Gestión Municipal',
      selector: '[data-tour="ejes-municipales"]',
      badge: 'Paso 4 de 6',
      narracion: 'Aquí se presentan los cuatro ejes de la gestión municipal: Ventanilla Única con Hacienda, Gobernanza y Concejo con actas en PDF, Fiscalización de Obras para reportar bacheo vial, y Desarrollo Comunitario con deportes y ferias locales.',
      resumen: 'Acceda a los 4 servicios esenciales de su gobierno local.',
      tips: ['En Obras Públicas puede reportar huecos viales y adjuntar fotos.', 'En Concejo Municipal puede fiscalizar las votaciones de los regidores.']
    },
    {
      id: 'panel-civico-btn',
      title: 'Panel Lateral de Accesibilidad y Configuración',
      selector: '[data-tour="panel-civico-btn"]',
      badge: 'Paso 5 de 6',
      narracion: 'Al presionar el botón de Panel Cívico se despliega el centro de utilidades. Desde allí puede ajustar el tamaño del texto para baja visión bajo la Ley 7600, cambiar entre modo oscuro y claro, o alternar entre los 8 idiomas oficiales.',
      resumen: 'Ajuste el contraste, tamaño de texto Ley 7600 e idioma del sistema.',
      tips: ['Incluye 8 idiomas oficiales con traducción en tiempo real.', 'Permite escuchar la pantalla actual con el motor de voz.']
    },
    {
      id: 'registro-login-btn',
      title: 'Identificación y Registro Ciudadano con Cédula',
      selector: '[data-tour="registro-login-btn"]',
      badge: 'Paso 6 de 6',
      narracion: 'Para finalizar, en esta sección puede registrarse o iniciar sesión de manera segura con su número de cédula física o jurídica. Esto le permitirá dar seguimiento a sus trámites, denuncias comunales y votaciones participativas.',
      resumen: 'Cree su cuenta o inicie sesión para gestionar su expediente cívico personal.',
      tips: ['Validación automática de nombre ante el padrón oficial.', 'Tus datos se resguardan bajo la Ley de Protección de Datos N° 8968.']
    }
  ],
  'es-ES': [
    {
      id: 'nav-institucional',
      title: 'Navegación Superior y Categorías Cívicas',
      selector: '[data-tour="nav-institucional"]',
      badge: 'Paso 1 de 6',
      narracion: 'Bienvenido a Costa Rica Unidos. En la barra superior dispone de acceso directo a los cuatro grandes pilares municipales: Trámites y Hacienda, Gobierno y Concejo, Territorio y Obras, y Comunidad.',
      resumen: 'Acceso a trámites, actas de concejo, obras comunales y servicios ciudadanos.',
      tips: ['Pase el cursor sobre una categoría para ver sus opciones.']
    },
    {
      id: 'selector-canton',
      title: 'Selector de Gobierno Local y Municipio',
      selector: '[data-tour="selector-canton"]',
      badge: 'Paso 2 de 6',
      narracion: 'En este indicador puede consultar y cambiar el municipio activo entre los 84 cantones del país. Al elegir su localidad, la información se adapta automáticamente.',
      resumen: 'Personalice la plataforma seleccionando su cantón o municipio.',
      tips: ['Permite alternar rápidamente entre municipalidades.']
    },
    {
      id: 'buscador-civico',
      title: 'Buscador Cívico Universal',
      selector: '[data-tour="buscador-civico"]',
      badge: 'Paso 3 de 6',
      narracion: 'Este es el Buscador Cívico Universal. Escriba el nombre de cualquier trámite, licencia comercial o acta del pleno para obtener respuestas directas.',
      resumen: 'Consulte trámites, actas oficiales e incidencias con rapidez.',
      tips: ['Sugerencias predictivas en tiempo real.']
    },
    {
      id: 'ejes-municipales',
      title: 'Ejes Rectores de la Gestión Municipal',
      selector: '[data-tour="ejes-municipales"]',
      badge: 'Paso 4 de 6',
      narracion: 'Aquí se presentan los cuatro ejes rectores: Ventanilla Única, Gobernanza municipal con actas en PDF, Fiscalización de Obras e incidencias viales, y Desarrollo Comunitario.',
      resumen: 'Módulos directos de gestión pública cantonal.',
      tips: ['Reporte incidencias con geolocalización y fotos.']
    },
    {
      id: 'panel-civico-btn',
      title: 'Panel Lateral de Accesibilidad y Ajustes',
      selector: '[data-tour="panel-civico-btn"]',
      badge: 'Paso 5 de 6',
      narracion: 'El botón de Panel Cívico abre el centro de utilidades. Desde aquí puede adaptar el tamaño de letra, el tema de color o elegir entre los 8 idiomas oficiales.',
      resumen: 'Configuración visual, accesibilidad e idiomas oficiales.',
      tips: ['Cumple con directrices internacionales de accesibilidad.']
    },
    {
      id: 'registro-login-btn',
      title: 'Identificación y Registro Ciudadano',
      selector: '[data-tour="registro-login-btn"]',
      badge: 'Paso 6 de 6',
      narracion: 'En esta sección puede registrarse o iniciar sesión mediante su documento de identidad para dar seguimiento a trámites y peticiones.',
      resumen: 'Acceso seguro y seguimiento de su expediente.',
      tips: ['Seguridad reforzada con protección de datos personales.']
    }
  ],
  'en-US': [
    {
      id: 'nav-institucional',
      title: 'Top Navigation & Civic Categories',
      selector: '[data-tour="nav-institucional"]',
      badge: 'Step 1 of 6',
      narracion: 'Welcome to Costa Rica Unidos. The top navigation bar provides immediate access to the four municipal pillars: Procedures & Taxes, City Council Governance, Public Works, and Community Services.',
      resumen: 'Direct access to permits, council minutes, public works, and civic tools.',
      tips: ['Hover over any category to view direct service links.', 'Use the SOS 911 button for emergency assistance.']
    },
    {
      id: 'selector-canton',
      title: 'Local Government & Canton Selector',
      selector: '[data-tour="selector-canton"]',
      badge: 'Step 2 of 6',
      narracion: 'This institutional indicator lets you view and switch the active municipality among the 84 cantons of Costa Rica. All permits and council data will update to reflect your chosen location.',
      resumen: 'Customize the portal by choosing your province and municipality.',
      tips: ['Click to open the interactive directory of all 84 cantons.', 'Taxes and council records sync with the chosen canton.']
    },
    {
      id: 'buscador-civico',
      title: 'Universal Civic Search Bar',
      selector: '[data-tour="buscador-civico"]',
      badge: 'Step 3 of 6',
      narracion: 'This is the Universal Civic Search. Search for any municipal service, ID verification, business license, or road pothole report. The engine will instantly suggest official procedures.',
      resumen: 'Search for civic records, permits, and road incident reporting.',
      tips: ['Type keywords like "id", "permit", "pothole" or city names.', 'Press Enter or Consult to jump to results.']
    },
    {
      id: 'ejes-municipales',
      title: 'Core Municipal Pillars & Services',
      selector: '[data-tour="ejes-municipales"]',
      badge: 'Step 4 of 6',
      narracion: 'Here are the four pillars of municipal governance: Single Window for tax & ID checks, Council Governance with official PDF minutes, Public Works reporting, and Sports & Farmers Market development.',
      resumen: 'Access the 4 fundamental modules of local municipal governance.',
      tips: ['Attach photos to report road hazards and potholes.', 'Inspect voting records of your local council members.']
    },
    {
      id: 'panel-civico-btn',
      title: 'Civic Drawer & Accessibility Panel',
      selector: '[data-tour="panel-civico-btn"]',
      badge: 'Step 5 of 6',
      narracion: 'Clicking the Civic Panel button opens the utility center. Here you can adjust font size for visual accessibility, toggle between dark and light themes, and choose among 8 official languages.',
      resumen: 'Adjust typography, dark mode, and switch between 8 official languages.',
      tips: ['Includes full text-to-speech page reader.', 'Complies with universal accessibility standards.']
    },
    {
      id: 'registro-login-btn',
      title: 'Citizen ID Registration & Sign In',
      selector: '[data-tour="registro-login-btn"]',
      badge: 'Step 6 of 6',
      narracion: 'Finally, use this area to create your civic account or sign in securely using your national identity card. This enables real-time tracking of all your municipal applications.',
      resumen: 'Register or sign in with your ID to track all your local municipal filings.',
      tips: ['Automatic registry verification.', 'Complies with Personal Data Protection Law 8968.']
    }
  ],
  'zh-CN': [
    {
      id: 'nav-institucional',
      title: '机构顶部导航与公民分类',
      selector: '[data-tour="nav-institucional"]',
      badge: '第 1 步，共 6 步',
      narracion: '欢迎使用哥斯达黎加联合数字化政务平台。顶部导航栏提供市政四大支柱的快速入口：税务与手续、市议会与治理、市政公共工程以及社区服务。',
      resumen: '快速访问办事手续、市议会纪要、市政工程和便民服务。',
      tips: ['悬停在分类上可查看直达服务。', '紧急情况可使用 SOS 911 按钮。']
    },
    {
      id: 'selector-canton',
      title: '地方政府与县区选择器',
      selector: '[data-tour="selector-canton"]',
      badge: '第 2 步，共 6 步',
      narracion: '在此指示器中，您可以在全国 84 个自治县区之间查看并切换活跃城市。选择您所在的县区后，所有税费和官方纪要将自动同步更新。',
      resumen: '选择您所在的省份与县区，个性化定制市政平台。',
      tips: ['点击可打开涵盖全国 84 县的快速检索目录。']
    },
    {
      id: 'buscador-civico',
      title: '全民政务智能搜索引擎',
      selector: '[data-tour="buscador-civico"]',
      badge: '第 3 步，共 6 步',
      narracion: '这是全民政务通用搜索引擎。输入身份证验证、商业许可或许可证或道路坑洼申报等关键词，系统将即时推荐官方办事通道。',
      resumen: '即时检索市政办事、议会纪要和道路故障申报。',
      tips: ['输入“身份证”、“坑洼”或县区名称快速匹配。']
    },
    {
      id: 'ejes-municipales',
      title: '市政管理四大核心支柱',
      selector: '[data-tour="ejes-municipales"]',
      badge: '第 4 步，共 6 步',
      narracion: '这里展示市政治理的四大支柱：税务一网通办、市议会官方 PDF 纪要查阅、道路公共工程故障申报以及社区体育与农贸集市发展。',
      resumen: '一站式访问地方自治政府的四项核心公共服务。',
      tips: ['在公共工程中可上传照片申报道路损坏。']
    },
    {
      id: 'panel-civico-btn',
      title: '无障碍控制与便民设置抽屉',
      selector: '[data-tour="panel-civico-btn"]',
      badge: '第 5 步，共 6 步',
      narracion: '点击公民面板按钮即可打开实用工具中心。您可以根据残障辅助标准调整字体大小、切换深色和浅色模式，并在 8 种官方语言之间自由切换。',
      resumen: '调整字号、视觉对比度并切换 8 种多语言环境。',
      tips: ['配备完整的页面语音朗读助手。']
    },
    {
      id: 'registro-login-btn',
      title: '公民身份证登记与安全登录',
      selector: '[data-tour="registro-login-btn"]',
      badge: '第 6 步，共 6 步',
      narracion: '最后，您可以在此通过实体或法人身份证安全注册或登录账户，以便随时追踪您的行政办理进度与社区民意提案。',
      resumen: '创建公民档案或使用身份证登录，实时追踪办事进度。',
      tips: ['严格遵循第 8968 号个人信息保护法保护您的隐私。']
    }
  ],
  'pt-BR': [
    {
      id: 'nav-institucional',
      title: 'Navegação Superior e Categorias Cívicas',
      selector: '[data-tour="nav-institucional"]',
      badge: 'Passo 1 de 6',
      narracion: 'Bem-vindo ao Costa Rica Unidos. Na barra superior você encontrará acesso direto aos quatro pilares municipais: Trâmites e Fazenda, Governo e Conselho, Obras e Comunidade.',
      resumen: 'Acesso a procedimentos, atas do conselho, obras e serviços municipais.',
      tips: ['Passe o mouse sobre as categorias para ver links rápidos.']
    },
    {
      id: 'selector-canton',
      title: 'Seletor de Governo Local e Cantão',
      selector: '[data-tour="selector-canton"]',
      badge: 'Passo 2 de 6',
      narracion: 'Neste indicador você pode consultar e selecionar o município ativo entre os 84 cantões do país. Toda a informação se adapta ao seu local de residência.',
      resumen: 'Personalize a plataforma escolhendo sua província e cantão.',
      tips: ['Alterne facilmente entre diferentes prefeituras.']
    },
    {
      id: 'buscador-civico',
      title: 'Buscador Cívico Universal',
      selector: '[data-tour="buscador-civico"]',
      badge: 'Passo 3 de 6',
      narracion: 'Este é o Buscador Cívico Universal. Digite o que precisa: validação de identidade, alvarás comerciais ou relato de buracos nas vias.',
      resumen: 'Pesquise trâmites, atas oficiais e ocorrências viárias.',
      tips: ['Sugestões inteligentes em tempo real.']
    },
    {
      id: 'ejes-municipales',
      title: 'Pilares Fundamentais da Gestão Municipal',
      selector: '[data-tour="ejes-municipales"]',
      badge: 'Passo 4 de 6',
      narracion: 'Aqui estão os quatro pilares municipais: Balcão Único com a Fazenda, Governança com atas em PDF, Fiscalização de Obras públicas e Desenvolvimento local.',
      resumen: 'Módulos essenciais de atendimento ao cidadão.',
      tips: ['Envie fotos para relatar problemas nas ruas.']
    },
    {
      id: 'panel-civico-btn',
      title: 'Painel Lateral de Acessibilidade e Ajustes',
      selector: '[data-tour="panel-civico-btn"]',
      badge: 'Passo 5 de 6',
      narracion: 'O botão Painel Cívico abre o centro de configurações. Ajuste o tamanho da fonte para acessibilidade, mude o tema visual ou selecione entre 8 idiomas oficiais.',
      resumen: 'Configurações de acessibilidade, contraste e idiomas.',
      tips: ['Leitor de tela integrado disponível.']
    },
    {
      id: 'registro-login-btn',
      title: 'Identificação e Registro do Cidadão',
      selector: '[data-tour="registro-login-btn"]',
      badge: 'Passo 6 de 6',
      narracion: 'Por fim, crie sua conta ou entre com segurança usando seu documento de identificação para acompanhar todas as suas solicitações.',
      resumen: 'Cadastro seguro e acompanhamento de processos municipais.',
      tips: ['Proteção de dados garantida pela legislação vigente.']
    }
  ],
  'fr-FR': [
    {
      id: 'nav-institucional',
      title: 'Navigation Supérieure et Catégories Civiques',
      selector: '[data-tour="nav-institucional"]',
      badge: 'Étape 1 sur 6',
      narracion: 'Bienvenue sur Costa Rica Unidos. La barre supérieure vous donne un accès direct aux quatre piliers municipaux : Démarches, Conseil municipal, Travaux publics et Communauté.',
      resumen: 'Accès rapide aux démarches, procès-verbaux et travaux locaux.',
      tips: ['Survolez les menus pour voir les services disponibles.']
    },
    {
      id: 'selector-canton',
      title: 'Sélecteur de Gouvernement Local et Canton',
      selector: '[data-tour="selector-canton"]',
      badge: 'Étape 2 sur 6',
      narracion: 'Cet indicateur vous permet de choisir votre municipalité parmi les 84 cantons du Costa Rica. Les informations s\'adaptent automatiquement.',
      resumen: 'Personnalisez la plateforme selon votre commune.',
      tips: ['Sélectionnez votre canton pour voir les actualités locales.']
    },
    {
      id: 'buscador-civico',
      title: 'Moteur de Recherche Civique Universel',
      selector: '[data-tour="buscador-civico"]',
      badge: 'Étape 3 sur 6',
      narracion: 'Recherchez facilement une démarche, une taxe locale, un acte du conseil ou signalez un nid-de-poule sur la voie publique.',
      resumen: 'Recherche immédiate de démarches et signalement d\'incidents.',
      tips: ['Suggestions automatiques en temps réel.']
    },
    {
      id: 'ejes-municipales',
      title: 'Piliers Principaux de la Gestion Municipale',
      selector: '[data-tour="ejes-municipales"]',
      badge: 'Étape 4 sur 6',
      narracion: 'Retrouvez les 4 piliers essentiels : Guichet unique fiscal, Gouvernance avec actes PDF, Signalement des travaux publics et Vie associative.',
      resumen: 'Services publics clés de votre mairie.',
      tips: ['Ajoutez des photos pour signaler une dégradation.']
    },
    {
      id: 'panel-civico-btn',
      title: 'Panneau Latéral d\'Accessibilité et Réglages',
      selector: '[data-tour="panel-civico-btn"]',
      badge: 'Étape 5 sur 6',
      narracion: 'Le Panneau Civique vous permet de modifier la taille du texte pour l\'accessibilité, d\'activer le mode sombre ou de changer de langue parmi les 8 disponibles.',
      resumen: 'Accessibilité universelle, thème et sélection de la langue.',
      tips: ['Lecture audio intégrée de l\'écran.']
    },
    {
      id: 'registro-login-btn',
      title: 'Identification Citoyenne et Inscription',
      selector: '[data-tour="registro-login-btn"]',
      badge: 'Étape 6 sur 6',
      narracion: 'Inscrivez-vous ou connectez-vous avec votre pièce d\'identité pour suivre l\'avancement de vos demandes et dossiers communaux.',
      resumen: 'Espace citoyen sécurisé et suivi des démarches.',
      tips: ['Protection stricte des données personnelles.']
    }
  ],
  'ru-RU': [
    {
      id: 'nav-institucional',
      title: 'Главное Меню и Муниципальные Разделы',
      selector: '[data-tour="nav-institucional"]',
      badge: 'Шаг 1 из 6',
      narracion: 'Добро пожаловать в Costa Rica Unidos. В верхней панели расположен доступ к 4 ключевым направлениям: Услуги и Налоги, Городской Совет, Дорожные Работы и Сообщество.',
      resumen: 'Прямой доступ к государственным услугам и протоколам.',
      tips: ['Наведите курсор для быстрого выбора нужного раздела.']
    },
    {
      id: 'selector-canton',
      title: 'Выбор Муниципалитета и Кантона',
      selector: '[data-tour="selector-canton"]',
      badge: 'Шаг 2 из 6',
      narracion: 'Здесь вы можете выбрать один из 84 кантонов Коста-Рики. Все данные портала автоматически настроятся под выбранный регион.',
      resumen: 'Персонализация портала по кантонам и провинциям.',
      tips: ['Быстрый поиск вашего города или округа.']
    },
    {
      id: 'buscador-civico',
      title: 'Универсальный Гражданский Поиск',
      selector: '[data-tour="buscador-civico"]',
      badge: 'Шаг 3 из 6',
      narracion: 'Быстрый поиск любых муниципальных процедур, налогов, решений совета или подача заявки о дорожных повреждениях.',
      resumen: 'Мгновенный поиск официальных документов и услуг.',
      tips: ['Интеллектуальные подсказки при вводе.']
    },
    {
      id: 'ejes-municipales',
      title: 'Основные Направления Муниципалитета',
      selector: '[data-tour="ejes-municipales"]',
      badge: 'Шаг 4 из 6',
      narracion: 'Четыре ключевых сервиса: Единое окно услуг, Протоколы заседаний в PDF, Сообщения о дорожных дефектах и Спортивно-культурное развитие.',
      resumen: 'Ключевые электронные сервисы местных органов власти.',
      tips: ['Прикрепляйте фото для оперативного устранения ям на дорогах.']
    },
    {
      id: 'panel-civico-btn',
      title: 'Панель Доступности и Настроек',
      selector: '[data-tour="panel-civico-btn"]',
      badge: 'Шаг 5 из 6',
      narracion: 'Настройте размер шрифта для удобства чтения, переключите темную или светлую тему и выберите один из 8 официальных языков.',
      resumen: 'Универсальная доступность, темы оформления и языки.',
      tips: ['Встроенный голосовой помощник для чтения экрана.']
    },
    {
      id: 'registro-login-btn',
      title: 'Идентификация и Вход по Удостоверению',
      selector: '[data-tour="registro-login-btn"]',
      badge: 'Шаг 6 из 6',
      narracion: 'Зарегистрируйтесь или войдите с номером удостоверения личности для мониторинга ваших обращений и статуса документов.',
      resumen: 'Безопасный личный кабинет гражданина.',
      tips: ['Надежная защита персональных данных по закону № 8968.']
    }
  ],
  'ja-JP': [
    {
      id: 'nav-institucional',
      title: '上部ナビゲーションと行政カテゴリー',
      selector: '[data-tour="nav-institucional"]',
      badge: 'ステップ 1 / 6',
      narracion: 'コスタリカ・ウニドスへようこそ。上部ナビゲーションバーから、手続き・税務、市議会、公共事業、地域社会の4大主要分野へ直接アクセスできます。',
      resumen: '各種行政手続き、議事録、公共工事、市民サービスへの直接アクセス。',
      tips: ['カテゴリーにカーソルを合わせると詳細メニューが表示されます。']
    },
    {
      id: 'selector-canton',
      title: '地方自治体・郡（カントン）選択',
      selector: '[data-tour="selector-canton"]',
      badge: 'ステップ 2 / 6',
      narracion: 'このインジケーターから全国84のカントン（自治体）を検索・選択できます。お住まいの地域を選ぶと、税率や議事録が自動的に最適化されます。',
      resumen: 'お住まいの州やカントンを選んで表示内容をカスタマイズ。',
      tips: ['全国84自治体から素早く切り替え可能。']
    },
    {
      id: 'buscador-civico',
      title: '統合市民検索エンジン',
      selector: '[data-tour="buscador-civico"]',
      badge: 'ステップ 3 / 6',
      narracion: '身分証明書確認、商業ライセンス、道路の陥没修繕報告など、必要な手続きをすばやく検索できます。',
      resumen: '行政手続き、公式議事録、道路破損の即時検索。',
      tips: ['キーワード入力ですぐに候補が表示されます。']
    },
    {
      id: 'ejes-municipales',
      title: '自治体運営の4大主要事業',
      selector: '[data-tour="ejes-municipales"]',
      badge: 'ステップ 4 / 6',
      narracion: 'ワンストップ窓口、市議会公式PDF議事録、道路工事・インフラ通報、地域スポーツ・朝市振興の4大柱です。',
      resumen: '地方自治体が提供する中核的な公共サービス。',
      tips: ['道路の穴や破損箇所の写真を添付して通報できます。']
    },
    {
      id: 'panel-civico-btn',
      title: 'アクセシビリティ＆各種設定パネル',
      selector: '[data-tour="panel-civico-btn"]',
      badge: 'ステップ 5 / 6',
      narracion: '文字サイズの拡大、ダークモード切替、8つの公用語への切り替えなど、すべての人が使いやすい設定が揃っています。',
      resumen: '文字サイズ調整、コントラスト設定、8言語対応。',
      tips: ['画面の音声読み上げ機能も搭載されています。']
    },
    {
      id: 'registro-login-btn',
      title: '市民ID登録・セキュアログイン',
      selector: '[data-tour="registro-login-btn"]',
      badge: 'ステップ 6 / 6',
      narracion: '身分証明書番号を使ってアカウント登録またはログインし、申請した手続きの進捗や地域提案の状況を追跡できます。',
      resumen: '市民IDによる安全なログインと申請手続きの追跡。',
      tips: ['個人情報保護法第8968号に基づき厳重に管理されます。']
    }
  ]
};

/**
 * Normaliza el código de idioma a la clave de conocimiento
 */
function normalizeLangKey(lang) {
  if (!lang) return 'es-CR';
  const clean = lang.trim();
  if (TOUR_STEPS_KNOWLEDGE[clean]) return clean;

  const lower = clean.toLowerCase();
  if (lower.startsWith('es-es') || lower === 'es') return 'es-ES';
  if (lower.startsWith('es')) return 'es-CR';
  if (lower.startsWith('en')) return 'en-US';
  if (lower.startsWith('zh')) return 'zh-CN';
  if (lower.startsWith('pt')) return 'pt-BR';
  if (lower.startsWith('fr')) return 'fr-FR';
  if (lower.startsWith('ru')) return 'ru-RU';
  if (lower.startsWith('ja')) return 'ja-JP';

  return 'es-CR';
}

/**
 * Obtiene la lista completa de pasos para un idioma dado
 */
export function getTourStepsForLanguage(lang = 'es-CR') {
  const key = normalizeLangKey(lang);
  return TOUR_STEPS_KNOWLEDGE[key] || TOUR_STEPS_KNOWLEDGE['es-CR'];
}

/**
 * Obtiene un paso específico por ID e idioma
 */
export function getTourStepById(stepId, lang = 'es-CR') {
  const steps = getTourStepsForLanguage(lang);
  return steps.find((s) => s.id === stepId) || steps[0];
}

/**
 * Consulta la API de Gemini 3.6 Flash / 2.0 Flash para responder a una duda del usuario
 * sobre la sección enfocada en el recorrido guiado.
 */
export async function askGeminiAboutSection({
  question,
  step,
  lang = 'es-CR',
  canton = 'San José'
}) {
  if (!question || !question.trim()) {
    return {
      success: false,
      text: 'Por favor ingrese una pregunta válida sobre esta sección.'
    };
  }

  const apiKey = getGeminiApiKey();

  // Si no hay API Key configurada o falla la red, recurrimos al motor de síntesis contextual soberana
  if (!apiKey) {
    return generateLocalContextualAnswer(question, step, lang, canton);
  }

  const promptSystem = `Eres el Asistente Cívico Inteligente y Accesible de la República de Costa Rica (Plataforma Costa Rica Unidos).
Estás en un recorrido guiado en vivo por la interfaz web de gobierno local.
Sección actual enfocada: "${step.title}" (${step.resumen}).
Cantón activo del usuario: Municipalidad de ${canton}.
Idioma del usuario: ${lang}.

Instrucciones:
1. Responde en el idioma "${lang}" de forma cordial, concisa, precisa y accesible para personas de todas las edades (máximo 2 a 3 frases claras).
2. Explica exactamente cómo esa sección ayuda al ciudadano en el cantón de ${canton}, citando trámites reales si aplica (Hacienda ATV, actas de Concejo en PDF, reportes viales de huecos, o Ley 7600).
3. No uses formato markdown complejo ni tablas, ya que tu respuesta será leída en voz alta por el sintetizador de voz (TTS).`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: promptSystem },
          { text: `Pregunta del ciudadano: "${question}"` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 250,
      topP: 0.85
    }
  };

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(`${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.warn(`[Gemini API] Falló modelo ${model} con status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText && generatedText.trim()) {
        return {
          success: true,
          text: generatedText.trim(),
          modelUsed: model,
          isAiLive: true
        };
      }
    } catch (err) {
      console.warn(`[Gemini API] Error al consultar modelo ${model}:`, err);
    }
  }

  // Si fallaron los modelos en línea, usar la base de respuesta contextual
  return generateLocalContextualAnswer(question, step, lang, canton);
}

/**
 * Generador de respuesta cívica contextual local sin latencia (Fallback robusto de IA soberana)
 */
function generateLocalContextualAnswer(question, step, lang = 'es-CR', canton = 'San José') {
  const q = question.toLowerCase();
  let answer = '';

  if (step.id === 'nav-institucional') {
    if (q.includes('tramit') || q.includes('pago') || q.includes('patente')) {
      answer = `En la sección de Trámites y Hacienda puede consultar y pagar sus patentes municipales de ${canton}, así como verificar su situación tributaria.`;
    } else if (q.includes('acta') || q.includes('concejo') || q.includes('alcalde')) {
      answer = `En la pestaña de Gobierno y Concejo tiene acceso directo a todas las actas ordinarias y extraordinarias firmadas por las autoridades de ${canton}.`;
    } else {
      answer = `La barra superior le permite navegar entre trámites, gobierno, obras viales y servicios comunales para el cantón de ${canton}.`;
    }
  } else if (step.id === 'selector-canton') {
    answer = `Al seleccionar su cantón, toda la plataforma se personaliza para la Municipalidad de ${canton}, mostrando sus trámites específicos, proyectos viales y actas locales.`;
  } else if (step.id === 'buscador-civico') {
    answer = `Puede escribir el nombre de cualquier trámite, calle o reporte. Por ejemplo, escriba "hueco", "cédula" o "patente" y el buscador le mostrará el enlace oficial al instante.`;
  } else if (step.id === 'ejes-municipales') {
    if (q.includes('hueco') || q.includes('calle') || q.includes('averia') || q.includes('luz')) {
      answer = `En el eje de Obras Públicas puede registrar un reporte georreferenciado de avería vial en ${canton} con foto WebP para que la cuadrilla municipal lo repare.`;
    } else {
      answer = `Los 4 ejes reúnen los servicios esenciales: trámites con Hacienda, actas del Concejo, reportes de obras viales y comités cantonales de deportes.`;
    }
  } else if (step.id === 'panel-civico-btn') {
    answer = `En el Panel Cívico puede aumentar la letra para facilitar la lectura bajo la Ley 7600, cambiar a modo claro u oscuro, y alternar entre los 8 idiomas oficiales.`;
  } else if (step.id === 'registro-login-btn') {
    answer = `Al ingresar con su cédula, el sistema valida su identidad ante el padrón y le crea un expediente cívico personal para dar seguimiento en tiempo real a sus solicitudes.`;
  } else {
    answer = `Esta sección está diseñada para brindarle transparencia y acceso inmediato a los servicios municipales de ${canton}.`;
  }

  return {
    success: true,
    text: answer,
    modelUsed: 'Gemini-CivicKnowledge-Engine',
    isAiLive: false
  };
}

// Control de rate limiting en el cliente (1 petición cada 2 s)
let ultimoUsoTimestamp = 0;
const LIMITE_INTERVALO_MS = 2000;
const MAX_CARACTERES_MENSAJE = 3000;

/**
 * Capa de servicio unificada para invocar Gemini (Foro Tico y Guía por Voz)
 * Devuelve: { texto, modelo, latenciaMs }
 *
 * @param {object} params
 * @param {string} params.sistema - Instrucción de sistema (systemInstruction)
 * @param {Array} [params.historial] - Historial previo [{ role: 'user'|'model', text: string }]
 * @param {string} params.mensaje - Mensaje o consulta actual del usuario
 * @param {object} [params.opciones] - Opciones de generación (temperature, maxOutputTokens, topP)
 * @returns {Promise<{ texto: string, modelo: string, latenciaMs: number }>}
 */
export async function generarRespuestaIA({
  sistema = '',
  historial = [],
  mensaje = '',
  opciones = {}
}) {
  const ahora = Date.now();
  if (ahora - ultimoUsoTimestamp < LIMITE_INTERVALO_MS) {
    const esperaMs = LIMITE_INTERVALO_MS - (ahora - ultimoUsoTimestamp);
    await new Promise((resolve) => setTimeout(resolve, esperaMs));
  }
  ultimoUsoTimestamp = Date.now();

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    const errorNoKey = new Error('La clave de API de Gemini no está configurada.');
    errorNoKey.code = 'API_KEY_MISSING';
    throw errorNoKey;
  }

  const mensajeSanitizado = enmascararDatosPersonales(String(mensaje || '').trim());
  if (!mensajeSanitizado) {
    throw new Error('El mensaje enviado a la IA está vacío.');
  }

  if (mensajeSanitizado.length > MAX_CARACTERES_MENSAJE) {
    throw new Error(`El mensaje excede el límite máximo de ${MAX_CARACTERES_MENSAJE} caracteres.`);
  }

  // Sanitizar y estructurar historial si se suministra
  const contents = [];
  if (Array.isArray(historial) && historial.length > 0) {
    for (const item of historial) {
      if (item && item.text) {
        contents.push({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: enmascararDatosPersonales(item.text) }]
        });
      }
    }
  }

  // Agregar mensaje actual del usuario
  contents.push({
    role: 'user',
    parts: [{ text: mensajeSanitizado }]
  });

  const tiempoInicioTotal = Date.now();
  const PRESUPUESTO_TOTAL_MS = 20000;
  const TIMEOUT_MODELO_MS = 12000;

  let ultimoError = null;

  for (const model of GEMINI_MODELS) {
    const tiempoTranscurrido = Date.now() - tiempoInicioTotal;
    const tiempoRestante = PRESUPUESTO_TOTAL_MS - tiempoTranscurrido;
    if (tiempoRestante <= 1000) {
      break;
    }

    const timeoutThisModel = Math.min(TIMEOUT_MODELO_MS, tiempoRestante);
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeoutThisModel);
    const tInicioModelo = Date.now();

    try {
      const isGemini25 = model.toLowerCase().includes('gemini-2.5');
      const generationConfig = {
        temperature: opciones.temperature ?? 0.6,
        maxOutputTokens: opciones.maxOutputTokens ?? 2048,
        topP: opciones.topP ?? 0.9,
        ...(isGemini25 ? { thinkingConfig: { thinkingBudget: 0 } } : {})
      };

      const requestPayload = {
        ...(sistema ? { systemInstruction: { parts: [{ text: sistema }] } } : {}),
        contents,
        generationConfig
      };

      const url = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timerId);

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status} en modelo ${model}`;
        try {
          const errData = await response.json();
          if (errData?.error?.message) {
            errorMsg = `HTTP ${response.status}: ${errData.error.message}`;
          }
        } catch {}
        console.error(`[GeminiService] Error respuesta de API:`, errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // Verificar si hubo bloqueo de seguridad del prompt
      if (data?.promptFeedback?.blockReason) {
        console.warn('[GeminiService] Prompt bloqueado por filtros de seguridad:', data.promptFeedback.blockReason);
        return {
          texto: 'La consulta no pudo ser procesada debido a las políticas de seguridad de contenido. Por favor intenta con otra redacción cívica.',
          modelo: model,
          latenciaMs: Date.now() - tInicioModelo
        };
      }

      const candidate = data?.candidates?.[0];
      const textoGenerado = candidate?.content?.parts?.[0]?.text;

      if (!textoGenerado || !textoGenerado.trim()) {
        const finishReason = candidate?.finishReason || 'SIN_TEXTO';
        const errFinish = new Error(`Respuesta vacía recibida de la IA (finishReason: ${finishReason})`);
        console.error('[GeminiService]', errFinish);
        throw errFinish;
      }

      return {
        texto: textoGenerado.trim(),
        modelo: model,
        latenciaMs: Date.now() - tInicioModelo
      };
    } catch (err) {
      clearTimeout(timerId);
      console.error(`[GeminiService] Fallo al consultar modelo ${model}:`, err.message);
      ultimoError = err;
    }
  }

  // Si se agotaron los modelos sin éxito
  const errorFinal = new Error('La IA no está disponible en este momento. Por favor inténtalo de nuevo.');
  errorFinal.causaTecnica = ultimoError?.message;
  throw errorFinal;
}

