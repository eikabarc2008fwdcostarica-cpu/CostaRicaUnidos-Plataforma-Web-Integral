/**
 * COSTA RICA UNIDOS — Datos y Diccionario Multilingüe de Accesibilidad Universal (RNF-05, RNF-05.1, RNF-05.2, RNF-08)
 * Soporte para 8 idiomas oficiales y narración asistida por voz.
 */

export const IDIOMAS_SOPORTADOS = [
  {
    codigo: 'es-419',
    bcp47: 'es-419',
    nombre: 'Español (Latinoamérica)',
    nativo: 'Español (América)',
    bandera: 'CR',
    synthLang: 'es-CR',
    synthFallback: 'es-419'
  },
  {
    codigo: 'es-ES',
    bcp47: 'es-ES',
    nombre: 'Español (España)',
    nativo: 'Español (España)',
    bandera: 'ES',
    synthLang: 'es-ES',
    synthFallback: 'es'
  },
  {
    codigo: 'en-US',
    bcp47: 'en-US',
    nombre: 'English (US)',
    nativo: 'English',
    bandera: 'US',
    synthLang: 'en-US',
    synthFallback: 'en'
  },
  {
    codigo: 'zh-CN',
    bcp47: 'zh-CN',
    nombre: 'Chino Mandarín',
    nativo: '中文 (普通话)',
    bandera: 'CN',
    synthLang: 'zh-CN',
    synthFallback: 'zh'
  },
  {
    codigo: 'pt-BR',
    bcp47: 'pt-BR',
    nombre: 'Português (Brasil)',
    nativo: 'Português',
    bandera: 'BR',
    synthLang: 'pt-BR',
    synthFallback: 'pt'
  },
  {
    codigo: 'fr-FR',
    bcp47: 'fr-FR',
    nombre: 'Français',
    nativo: 'Français',
    bandera: 'FR',
    synthLang: 'fr-FR',
    synthFallback: 'fr'
  },
  {
    codigo: 'ru-RU',
    bcp47: 'ru-RU',
    nombre: 'Ruso',
    nativo: 'Русский',
    bandera: 'RU',
    synthLang: 'ru-RU',
    synthFallback: 'ru'
  },
  {
    codigo: 'ja-JP',
    bcp47: 'ja-JP',
    nombre: 'Japonés',
    nativo: '日本語',
    bandera: 'JP',
    synthLang: 'ja-JP',
    synthFallback: 'ja'
  }
];

export const FASES_TIPOGRAFICAS = [
  {
    fase: 1,
    escala: 1,
    porcentaje: '100%',
    etiqueta: 'Estándar',
    descripcion: 'Tamaño de texto base equilibrado (16px).'
  },
  {
    fase: 2,
    escala: 1.25,
    porcentaje: '125%',
    etiqueta: 'Cómoda',
    descripcion: 'Mayor legibilidad y confort para lectura prolongada.'
  },
  {
    fase: 3,
    escala: 1.5,
    porcentaje: '150%',
    etiqueta: 'Grande',
    descripcion: 'Diseñado para adultos mayores o visión reducida leve.'
  },
  {
    fase: 4,
    escala: 2,
    porcentaje: '200%',
    etiqueta: 'Máxima',
    descripcion: 'Accesibilidad visual máxima: botones crecen a un mínimo de 64px de alto (RNF-05.1).'
  }
];

export const ONBOARDING_STEPS_MULTILINGUE = {
  'es-419': [
    {
      id: 1,
      titulo: 'Bienvenida y Soberanía Cívica',
      subtitulo: 'Costa Rica Unidos — Sistema Sovereign Civic Glass v2.1',
      icono: 'soberania',
      narracion:
        'Bienvenido a Costa Rica Unidos. Esta es la plataforma cívica digital soberana que conecta las siete provincias y los ochenta y cuatro cantones de nuestra patria. Puede navegar con total inclusión y ajustar la escala visual en cualquier momento.',
      subtitulos:
        'Bienvenido a Costa Rica Unidos. Plataforma cívica soberana de las 7 provincias y 84 cantones. Inclusión universal activa.',
      destacados: ['Identidad territorial por escudos', 'Paleta Obsidiana y Tricolor', 'Accesibilidad Ley 7600']
    },
    {
      id: 2,
      titulo: 'Exploración 3D del Territorio',
      subtitulo: 'Visor Cartográfico y Búsqueda Semántica con IA',
      icono: 'mapa',
      narracion:
        'Explore el mapa tridimensional con geofencing nacional estricto, incluyendo la Isla del Coco. Ahora puede consultar en lenguaje natural costarricense mediante texto o dictado por voz para activar capas de salud, educación y albergues.',
      subtitulos:
        'Mapa 3D con relieve, geofencing soberano estricto y búsqueda en lenguaje natural costarricense con dictado por voz.',
      destacados: ['Inclinación de relieve 45° a 60°', 'Búsqueda por voz en es-CR', 'Capas cívicas CCSS, MEP y CNE']
    },
    {
      id: 3,
      titulo: 'Reportes Ciudadanos y Emergencias',
      subtitulo: 'Trazabilidad de Averías y Resiliencia Offline',
      icono: 'emergencias',
      narracion:
        'Reporte incidencias viales en cuatro pasos bajo la Ley 8968. En caso de crisis o desconexión, el centro de resiliencia le garantiza acceso inmediato a la botonera SOS del 911 y albergues temporales sin conexión celular.',
      subtitulos:
        'Asistente de reportes con compresión WebP y centro de emergencias SOS offline con Service Worker Cache-First.',
      destacados: ['Marcado telefónico directo 911', 'Refugios temporales CNE', 'Modo offline PWA']
    }
  ],
  'es-ES': [
    {
      id: 1,
      titulo: 'Bienvenida y Soberanía Cívica',
      subtitulo: 'Costa Rica Unidos — Sistema Sovereign Civic Glass v2.1',
      icono: 'soberania',
      narracion:
        'Bienvenido a Costa Rica Unidos. Esta es la plataforma cívica soberana que conecta las siete provincias y los ochenta y cuatro cantones de la nación con accesibilidad universal.',
      subtitulos:
        'Bienvenido a Costa Rica Unidos. Plataforma cívica soberana de las 7 provincias y 84 cantones.',
      destacados: ['Identidad territorial', 'Estética Obsidian Glass', 'Accesibilidad WCAG 2.1']
    },
    {
      id: 2,
      titulo: 'Exploración 3D del Territorio',
      subtitulo: 'Visor Cartográfico y Búsqueda Semántica con IA',
      icono: 'mapa',
      narracion:
        'Explore el mapa en tres dimensiones con límites soberanos estrictos y consulte en lenguaje natural mediante voz o teclado.',
      subtitulos:
        'Mapa 3D con relieve y geofencing estricto nacional.',
      destacados: ['Cámara 3D con inclinación', 'Búsqueda semántica por IA', 'Capas institucionales']
    },
    {
      id: 3,
      titulo: 'Reportes Ciudadanos y Emergencias',
      subtitulo: 'Trazabilidad y Resiliencia Offline',
      icono: 'emergencias',
      narracion:
        'Envíe incidencias ciudadanas y acceda a la botonera de emergencias 911 incluso en ausencia de conexión a internet.',
      subtitulos:
        'Reportes de averías y botonera SOS offline PWA.',
      destacados: ['Marcación rápida 911', 'Refugios CNE', 'Modo sin conexión']
    }
  ],
  'en-US': [
    {
      id: 1,
      titulo: 'Welcome & Civic Sovereignty',
      subtitulo: 'Costa Rica Unidos — Sovereign Civic Glass System v2.1',
      icono: 'soberania',
      narracion:
        'Welcome to Costa Rica Unidos. This is the sovereign digital civic platform unifying all seven provinces and eighty-four cantons. Experience complete accessibility with customizable text scale and voice assistance.',
      subtitulos:
        'Welcome to Costa Rica Unidos. Sovereign civic platform for 7 provinces and 84 cantons. Universal accessibility active.',
      destacados: ['Territorial Identity by Shields', 'Obsidian & Tricolor Palette', 'Universal Accessibility']
    },
    {
      id: 2,
      titulo: '3D Territorial Exploration',
      subtitulo: 'Cartographic 3D Viewer & Natural Language AI Search',
      icono: 'mapa',
      narracion:
        'Explore the 3D map with strict national geofencing, including Cocos Island. You can search using natural language or voice dictation to automatically activate health, education, and shelter layers.',
      subtitulos:
        '3D terrain map with strict sovereign boundaries and natural language voice search.',
      destacados: ['3D Tilt 45° to 60°', 'Voice Search Dictation', 'Public Health & Education Layers']
    },
    {
      id: 3,
      titulo: 'Citizen Reports & Emergency Center',
      subtitulo: 'Incident Traceability & Offline Resilience PWA',
      icono: 'emergencias',
      narracion:
        'File public infrastructure reports in 4 steps with privacy protection. During crises or network outages, the offline resilience center guarantees immediate access to 911 SOS dials and emergency shelters.',
      subtitulos:
        'Guided report wizard and offline SOS emergency keypad with Cache-First Service Worker.',
      destacados: ['Direct 911 Emergency Dial', 'Official Shelters Catalog', 'Offline PWA Mode']
    }
  ],
  'zh-CN': [
    {
      id: 1,
      titulo: '欢迎体验公民数字主权',
      subtitulo: '哥斯达黎加联合平台 — 主权玻璃拟态系统 v2.1',
      icono: 'soberania',
      narracion:
        '欢迎来到哥斯达黎加联合平台。这是连接全国七个省份和八十四个市县的主权数字公民平台，具备全面的无障碍辅助功能。',
      subtitulos: '欢迎来到哥斯达黎加联合数字公民平台，连接7个省与84个市县。',
      destacados: ['领土盾徽标识', '黑曜石与三色视觉', '通用无障碍标准']
    },
    {
      id: 2,
      titulo: '三维国土立体探索',
      subtitulo: '三维地图观察器与自然语言人工智能搜索',
      icono: 'mapa',
      narracion:
        '探索具备严格主权地理围栏的三维地图。您可以使用自然语言或语音听写，自动开启医疗、教育和应急避难所图层。',
      subtitulos: '具备地形起伏的三维地图，支持自然语言与语音搜索。',
      destacados: ['45°至60°地形倾斜', '语音听写检索', '公共服务图层']
    },
    {
      id: 3,
      titulo: '公民事件汇报与应急中心',
      subtitulo: '事件溯源与离线渐进式网络应用',
      icono: 'emergencias',
      narracion:
        '依法提交公共设施报修。在网络中断或突发危机时，离线中心确保立即拨打911求救电话并查询避难所。',
      subtitulos: '四步报修向导与离线求救应急键盘。',
      destacados: ['911直拨求救', '官方应急避难所', '全离线运作模式']
    }
  ],
  'pt-BR': [
    {
      id: 1,
      titulo: 'Boas-vindas e Soberania Cívica',
      subtitulo: 'Costa Rica Unidos — Sistema Sovereign Civic Glass v2.1',
      icono: 'soberania',
      narracion:
        'Bem-vindo ao Costa Rica Unidos. Esta é a plataforma cívica digital soberana que conecta as sete províncias e os oitenta e quatro cantões com acessibilidade universal.',
      subtitulos: 'Bem-vindo ao Costa Rica Unidos. Plataforma soberana das 7 províncias e 84 cantões.',
      destacados: ['Identidade territorial', 'Paleta Obsidiana e Tricolor', 'Acessibilidade WCAG 2.1']
    },
    {
      id: 2,
      titulo: 'Exploração Territorial em 3D',
      subtitulo: 'Visor Cartográfico 3D e Busca Semântica com IA',
      icono: 'mapa',
      narracion:
        'Explore o mapa 3D com delimitação soberana estrita e faça consultas em linguagem natural por voz ou texto.',
      subtitulos: 'Mapa 3D com relevo topográfico e busca por voz em linguagem natural.',
      destacados: ['Inclinação de relevo 45° a 60°', 'Busca por voz', 'Camadas públicas integradas']
    },
    {
      id: 3,
      titulo: 'Relatos de Incidentes e Emergências',
      subtitulo: 'Rastreabilidade e Resiliência Offline PWA',
      icono: 'emergencias',
      narracion:
        'Envie relatórios de infraestrutura e acesse o teclado de emergência SOS 911 mesmo sem qualquer conexão celular.',
      subtitulos: 'Assistente de relatórios e teclado SOS 911 com modo offline PWA.',
      destacados: ['Ligação direta ao 911', 'Abrigos temporários', 'Resiliência offline']
    }
  ],
  'fr-FR': [
    {
      id: 1,
      titulo: 'Bienvenue et Souveraineté Civique',
      subtitulo: 'Costa Rica Unidos — Système Sovereign Civic Glass v2.1',
      icono: 'soberania',
      narracion:
        'Bienvenue sur Costa Rica Unidos. Il s’agit de la plateforme civique souveraine connectant les sept provinces et quatre-vingt-quatre cantons avec une accessibilité universelle.',
      subtitulos: 'Bienvenue sur Costa Rica Unidos. Plateforme civique des 7 provinces et 84 cantons.',
      destacados: ['Identité territoriale', 'Palette Obsidienne', 'Accessibilité universelle']
    },
    {
      id: 2,
      titulo: 'Exploration Territoriale 3D',
      subtitulo: 'Visualiseur Cartographique 3D et Recherche IA',
      icono: 'mapa',
      narracion:
        'Explorez la carte 3D avec délimitation stricte et effectuez des recherches en langage naturel par commande vocale.',
      subtitulos: 'Carte 3D avec relief et recherche vocale intelligente.',
      destacados: ['Inclinaison 3D 45° à 60°', 'Recherche vocale', 'Couches de santé et éducation']
    },
    {
      id: 3,
      titulo: 'Signalements et Urgences SOS',
      subtitulo: 'Traçabilité et Résilience Hors-Ligne PWA',
      icono: 'emergencias',
      narracion:
        'Signalez des anomalies et accédez au clavier d’urgence 911 même en cas de coupure totale d’Internet.',
      subtitulos: 'Signalement citoyen et clavier d’urgence SOS opérationnel hors-ligne.',
      destacados: ['Appel direct 911', 'Abris officiels', 'Mode hors-ligne PWA']
    }
  ],
  'ru-RU': [
    {
      id: 1,
      titulo: 'Добро пожаловать и Гражданский Суверенитет',
      subtitulo: 'Costa Rica Unidos — Система Sovereign Civic Glass v2.1',
      icono: 'soberania',
      narracion:
        'Добро пожаловать в Costa Rica Unidos. Это суверенная цифровая платформа, объединяющая семь провинций и восемьдесят четыре кантона с универсальной доступностью.',
      subtitulos: 'Добро пожаловать в Costa Rica Unidos — цифровую платформу 7 провинций и 84 кантонов.',
      destacados: ['Территориальная идентичность', 'Палитра Обсидиан', 'Универсальная доступность']
    },
    {
      id: 2,
      titulo: '3D Исследование Территории',
      subtitulo: '3D Карта и Семантический Поиск с ИИ',
      icono: 'mapa',
      narracion:
        'Исследуйте 3D карту со строгими государственными границами и голосовым поиском на естественном языке.',
      subtitulos: '3D рельефная карта со строгими границами и голосовым управлением.',
      destacados: ['Наклон рельефа 45°-60°', 'Голосовой ввод', 'Слои здравоохранения и убежищ']
    },
    {
      id: 3,
      titulo: 'Обращения Граждан и Экстренная Помощь',
      subtitulo: 'Прослеживаемость и Автономный Режим PWA',
      icono: 'emergencias',
      narracion:
        'Отправляйте отчеты об инфраструктуре и используйте кнопки вызова 911 даже при полном отсутствии сети.',
      subtitulos: 'Мастер отчетов и панель SOS 911, работающая полностью офлайн.',
      destacados: ['Прямой вызов 911', 'Временные убежища', 'Офлайн режим PWA']
    }
  ],
  'ja-JP': [
    {
      id: 1,
      titulo: 'ようこそ 主権ある市民プラットフォームへ',
      subtitulo: 'コスタリカ連合 — ソブリン・シビック・グラス v2.1',
      icono: 'soberania',
      narracion:
        'コスタリカ連合へようこそ。これは7つの州と84のカントンを結ぶ主権デジタル市民プラットフォームです。包括的なアクセシビリティを備えています。',
      subtitulos: 'コスタリカ連合へようこそ。7州と84自治体を結ぶ市民プラットフォームです。',
      destacados: ['地域アイデンティティ', 'オブシディアン配色', 'アクセシビリティ対応']
    },
    {
      id: 2,
      titulo: '3D国土ナビゲーション',
      subtitulo: '3D地図ビューアとAI自然言語検索',
      icono: 'mapa',
      narracion:
        '厳格な主権ジオフェンシングを備えた3D立体地図を探索できます。音声またはテキスト入力で自然言語検索が可能です。',
      subtitulos: '地形レリーフを備えた3D地図と音声による自然言語検索。',
      destacados: ['3D傾斜 45°〜60°', '音声ディクテーション', '医療・避難所レイヤー']
    },
    {
      id: 3,
      titulo: '市民レポートと緊急支援センター',
      subtitulo: 'トレーサビリティとオフライン回復力 PWA',
      icono: 'emergencias',
      narracion:
        'インフラの異常を報告できます。ネットワーク遮断時でも911への直接緊急発信と避難所情報に即時アクセス可能です。',
      subtitulos: '報告ウィザードとオフライン対応の911 SOS緊急発信ボタン。',
      destacados: ['911直通発信', '公式避難所リスト', 'PWAオフライン機能']
    }
  ]
};
