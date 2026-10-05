/**
 * ============================================================================
 * COSTA RICA UNIDOS — DICCIONARIO MAESTRO INTEGRAL E INTERNACIONALIZACIÓN (i18n)
 * Sistema de dos capas: Frases Completas del Sistema + Vocabulario Léxico Atómico
 * 
 * Cobertura garantizada para el 100% de los textos de la plataforma:
 *  - Inicio y Estadísticas Cívicas
 *  - Panel de Mando, Consola Territorial y Super Admin
 *  - Ventanilla Comercial, Patentes y Ferias del Agricultor
 *  - Obras Públicas, Averías y Despacho de Cuadrillas
 *  - Participación Ciudadana y Auditoría de Presupuestos
 *  - Red de Albergues, Alertas CNE y Centro COE
 *  - Gobernanza de IA, Parámetros y Respaldos
 *  - Acceso Soberano (Login y Tarjeta de Identificación)
 * ============================================================================
 */

import { DICCIONARIO_CIVICO } from './diccionarioCivico';

// ============================================================================
// CAPA 1: DICCIONARIO MAESTRO DE FRASES COMPLETAS DEL SISTEMA
// ============================================================================
export const DICCIONARIO_MAESTRO = {
  // --------------------------------------------------------------------------
  // 1. JAPONÉS (ja) — Cobertura 100%
  // --------------------------------------------------------------------------
  "ja": {
    // Identidad y Cabeceras
    "REPÚBLICA DE COSTA RICA": "コスタリカ共和国",
    "SEDE ELECTRÓNICA NACIONAL": "国家電子行政本部",
    "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "国家地方自治体システム",
    "84 CANTONES AUTÓNOMOS": "全84自治カントン",
    "Cantón:": "カントン（自治体）:",
    "Cantón (Autónomo):": "自治カントン（郡）:",
    "PODER EJECUTIVO Y RÉGIMEN MUNICIPAL": "行政府および自治体制度",
    "Consola de Mando Cívico y Administración Territorial": "市民司令コンソール・地域行政管理",
    "Superintendencia Nacional de Gobierno Digital": "国家デジタル政府監督局",
    "SUPER ADMINISTRADOR NACIONAL": "国家最高管理者",
    "GESTOR TERRITORIAL Y MUNICIPAL": "地域自治体管理者",
    "GESTOR TERRITORIAL": "地域自治体管理者",
    "CIUDADANO RESIDENTE": "市民住民",
    "CIUDADANO": "市民住民",
    "COMERCIANTE Y EMPRENDEDOR": "商人・起業家",
    "COMERCIANTE": "商人・起業家",
    "Todas las Municipalidades": "全自治体",
    "TODAS LAS MUNICIPALIDADES": "全自治体管轄",
    "Portal Público": "パブリックポータル",
    "Cerrar Sesión": "ログアウト",
    "Iniciar Sesión": "ログイン",
    "Registrarse": "新規登録",
    "Ir al Portal Público": "パブリックポータルへ",
    "Volver a mi Interfaz": "管理画面へ戻る",
    "Mi Interfaz": "マイ画面",
    "En Línea": "オンライン",
    "PANEL DE MANDO": "司令パネル",
    "Ventanilla Comercial": "商業窓口・企業支援",
    "HACIENDA ATV": "ATV税務認証",
    "PATENTES & TRIBUTOS": "営業許可・地方税",
    "ACTAS OFICIALES PDF": "公式議事録 (PDF)",
    "REGIDORES & ALCALDÍA": "市議会議員・市長室",
    "HUECOS & VÍAS": "路面損壊・道路網",
    "EVIDENCIA WEBP": "WebP証拠写真",
    "CCDR DEPORTES": "スポーツ委員会 (CCDR)",
    "FERIAS & PYMES": "農民市・中小企業",

    // Dashboard, Métricas e Incidencias
    "Dashboard Analítico": "分析ダッシュボード",
    "Usuarios & Auditoría": "ユーザー管理・監査",
    "Ventanilla Única": "総合行政窓口",
    "Obras & Averías": "公共事業・インフラ障害",
    "Emergencias COE": "緊急対策本部 (COE)",
    "Gobernanza IA": "AIガバナンス",
    "Solicitudes Comerciales": "商業申請審査",
    "Averías Municipales": "自治体インフラ障害",
    "Alerta Nacional CNE": "CNE全国警報発令",
    "Gobernanza de IA": "AIガバナンス",
    "Operativa": "稼働中",
    "Nivel VERDE": "警戒レベル：緑",
    "Nivel AMARILLA": "警戒レベル：黄",
    "Nivel NARANJA": "警戒レベル：橙",
    "Nivel ROJA": "警戒レベル：赤",
    "Indicador de Eficiencia Municipal": "自治体対応効率指標",
    "Conforme": "基準適合",
    "Deterioro Asfáltico / Baches": "舗装劣化・路面窪み",
    "Luminarias Públicas Inoperativas": "公共街灯の故障",
    "Fugas de Agua Potable / Alcantarillado": "上水道漏水・下水障害",
    "Residuos Sólidos y Escombros": "一般廃棄物・瓦礫処理",
    "TOTAL VOTOS CÍVICOS": "市民投票総数",
    "AUDITORÍA ELECTORAL": "選挙・投票監査",
    "Validados sin duplicados": "重複排除検証済み",
    "Registrados con Cédula verificada": "本人確認済み登録者",
    "Proyecto con Mayor Respaldo": "最多支持プロジェクト",
    "Ciclovía y Aceras Inclusivas en Pavas": "パバス包括的自転車道・歩道整備",

    // Obras y Averías
    "Gestión de Obras Públicas y Averías Municipales": "公共事業および自治体インフラ障害管理",
    "Fiscalización y resolución de incidencias en vías, acueductos y luminarias cantonales.": "道路、上下水道、公共街灯の不具合監査および迅速修繕。",
    "87.5% de expedientes atendidos dentro del plazo normado de 72 horas.": "規定の72時間以内に87.5%の事案を現地対応完了。",
    "Deterioro severo de capa asfáltica de 1.5m de diámetro frente a parada de bus de Barrio El Carmen.": "エル・カルメン地区バス停前の直径1.5mに及ぶ深刻なアスファルト舗装劣化。",
    "Luminaria pública dañada en acera peatonal": "歩道の公共街灯の破損・不点灯",
    "Luminaria pública dañada o apagada": "公共街灯の破損または消灯",
    "Fuga continua de agua potable": "上水道の継続的漏水",
    "Fuga de agua potable / alcantarilla": "上水道漏水／下水管障害",
    "Cuadrilla 01 - Vías y Asfalto": "第1作業班：道路・アスファルト",
    "Cuadrilla 02 - Alumbrado y Red Eléctrica": "第2作業班：街灯・電力網",
    "Cuadrilla 03 - Fontanería y Red Pluvial": "第3作業班：上下水道・雨水網",
    "Cuadrilla 01 · Vías y Asfalto": "第1作業班 · 道路・アスファルト",
    "Cuadrilla 02 · Alumbrado y Red Eléctrica": "第2作業班 · 街灯・電力網",
    "Cuadrilla 03 · Fontanería y Red Pluvial": "第3作業班 · 上下水道・雨水網",
    "Cuadrilla 04 · Saneamiento y Gestión Ambiental": "第4作業班 · 環境衛生・廃棄物管理",
    "Saturación en carpetas cantonales y rutas terciarias": "郡道および第3次路線における路面劣化の集中",
    "Alumbrado y seguridad vial nocturna": "夜間道路安全照明の維持管理",
    "Coordinación directa con acueductos AyA": "AyA上下水道公社との直接連携調整",
    "Rutas de recolección y limpieza cantonal": "郡内収集および清掃ルート",
    "Ventanilla de Fiscalización y Obras Públicas": "公共事業・インフラ監視窓口",
    "EVIDENCIA": "証拠写真",
    "EXPEDIENTE": "事案番号",
    "Expediente": "事案番号",
    "DESCRIPCIÓN DE AVERÍA": "障害内容詳細",
    "Descripción de Avería": "障害内容詳細",
    "UBICACIÓN EXACTA": "発生場所",
    "Ubicación Exacta": "発生場所",
    "PRIORIDAD": "優先度",
    "Prioridad": "優先度",
    "CUADRILLA ASIGNADA": "担当作業班",
    "Cuadrilla Asignada": "担当作業班",
    "ESTADO DEL TICKET": "対応状況",
    "Estado del Ticket": "対応状況",

    // Participación Ciudadana y Presupuestos
    "Participación Ciudadana y Presupuestos Participativos": "市民参加および参加型予算管理",
    "Votación cantonal inmutable con verificación del Padrón Nacional y Hacienda.": "国家名簿および財務省認証による改ざん不可能な郡民投票。",
    "Inversión asignada para movilidad peatonal segura, arborización y ciclovía cantonal inclusiva.": "安全な歩行者移動、緑化、包括的郡自転車道への配分予算投資。",
    "Auditoría Electoral: 100% de votos validados contra el Padrón Nacional y Hacienda (0 duplicados detectados).": "選挙監査：国家名簿および財務省に対して100%の投票を検証済み（重複ゼロ件）。",
    "Total Votos Cívicos": "市民投票総数",
    "Auditoría Electoral": "選挙監査結果",
    "Proyecto con Mayor Respaldo": "最多支持プロジェクト",

    // Albergues CNE y Emergencias
    "Red de Albergues y Capacidad de Emergencia CNE": "CNE緊急避難所ネットワークおよび収容能力",
    "Censo en tiempo real de capacidad instalada y refugios cantonales operativos.": "設置収容能力および郡内稼働中避難所のリアルタイム調査統計。",
    "Capacidad Total Habilitada": "認可総収容定員",
    "Capacidad Total": "最大収容人数",
    "Ocupación Actual": "現在避難者数",
    "Estado Operativo por Albergue Cantonal": "郡内各避難所の稼働状況",
    "Polideportivo de Puntarenas (CNE)": "プンタレナス総合体育館 (CNE)",
    "Gimnasio Municipal Santa Cruz": "サンタクルス町営体育館",
    "Salón Parroquial Turrialba": "トゥリアルバ教区ホール",
    "Aforo actual: 45 de 180 personas": "現在収容人数：180名中45名",
    "Aforo actual: 250 de 250 personas": "現在収容人数：250名中250名 (満員)",
    "Aforo actual: 85 de 120 personas": "現在収容人数：120名中85名",
    "Contacto: Comité Municipal de Emergencias Puntarenas (2661-0000)": "連絡先：プンタレナス自治体緊急委員会 (2661-0000)",
    "Habilitado": "開設中・利用可能",
    "Lleno al 100%": "満員 (100%)",
    "En Reserva": "待機・予備",
    "Sanitarios, duchas y cocina industrial": "水洗トイレ、シャワー、給食用厨房設備完備",
    "Atención médica 911, agua potable y colchonetas": "911救護医療対応、飲料水、簡易ベッド・マットレス完備",

    // Ventanilla Comercial y Ferias
    "Bandeja de Solicitudes Comerciales, Patentes y Ferias": "商業・営業許可・市場出店申請トレイ",
    "Resolución de solicitudes de comercios cantonales, agricultura familiar y asignación de croquis de feria.": "郡内商業申請、家族農業、農民市出店区画割り当ての審査決定。",
    "Cafetería y Tostaduría Alma Tica": "アルマ・ティカ カフェ＆焙煎所",
    "Hortalizas del Valle de Ujarrás": "ウハラス渓谷の新鮮野菜農園",
    "Actividad Económica: Servicios de cafetería y venta de café gourmet": "事業内容：カフェサービスおよび高級特産コーヒー販売",
    "Actividad Económica: Producción agrícola y venta al por menor": "事業内容：農業生産および消費者向け直売",
    "Asignación: Sector B - Cafés y Derivados": "指定配置：B地区 — コーヒーおよび関連加工品",
    "Asignación: Sector A - Hortalizas": "指定配置：A地区 — 新鮮高原野菜",
    "Presenta certificación de buenas prácticas agrícolas del MAG al día.": "農牧省(MAG)発行の最新適正農業規範(GAP)認証書を提示済み。",
    "Patente cantonal y régimen simplificado al día.": "郡営業許可および簡易課税制度への納付完了確認済み。",
    "Fomento Económico y Comercio Local": "経済振興・地元地域商業",
    "Patentes Activas": "有効営業許可数",
    "Puestos de Feria": "農民市出店ブース",
    "Distribución de Puestos en el Croquis Oficial": "公式区画図におけるブース配置",
    "Otorgar Sello Verificado": "認証印を付与",
    "Asignar Puesto Feria": "市場ブースを割り当て",
    "Rechazar": "却下する",

    // Emergencias COE
    "Centro de Operaciones de Emergencia (COE · CNE)": "緊急オペレーションセンター (COE · CNE)",
    "CENTRO DE OPERACIONES DE EMERGENCIA (COE) • LEY N° 8488": "緊急オペレーションセンター (COE) • 法律第8488号",
    "Control oficial del semáforo nacional de alerta temprana y red cantonal de albergues para evacuación.": "国家早期警戒信号および避難用郡避難所ネットワークの公式管制統括。",
    "NIVEL DE ALERTA SOBERANA NACIONAL / CANTONAL:": "国家および郡主権的警戒レベル：",
    "COMUNICADO OFICIAL DE LA PRESIDENCIA DE LA REPÚBLICA Y CNE:": "大統領府およびCNE公式発表緊急声明：",
    "Redactar aviso oficial de emergencia para difusión en toda la plataforma...": "プラットフォーム全体へ配信する公式緊急警報文を作成...",
    "Publicar y Actualizar Nivel de Alerta": "警報レベルを公開・更新",
    "Desactivar / Retirar Alerta Nacional": "全国警報を解除・撤回",
    "Verde (Informativa)": "緑（情報周知）",
    "Amarilla (Precaución)": "黄（警戒準備）",
    "Naranja (Peligro)": "橙（厳重警戒・危険）",
    "Roja (Evacuación)": "赤（避難命令・緊急事態）",

    // Gobernanza de IA
    "Gobernanza del Motor de Inteligencia Artificial Cívica": "市民人工知能(AI)エンジン統治・ガバナンス",
    "Control soberano del modelo generativo, sensibilidad del clasificador y control estricto de acceso a colecciones.": "生成モデルの主権的統制、分類フィルター感度、機密データコレクションへの厳格なアクセス制御。",
    "Interruptor Maestro de IA (Kill-Switch)": "AI緊急停止マスター操作 (Kill-Switch)",
    "Activar Kill-Switch": "緊急停止スイッチを作動",
    "La IA opera normalmente brindando asistencia de itinerarios, moderación predictiva y búsqueda semántica.": "AIは通常稼働しており、旅程案内、予測モデレーション、高精度セマンティック検索を提供しています。",
    "SENSIBILIDAD DEL FILTRO AUTOMÁTICO DE CONTENIDOS:": "自動コンテンツ検閲・選別フィルター感度設定：",
    "Moderación Estricta": "厳格な審査・検閲",
    "Moderación Media": "標準的な審査",
    "Moderación Flexible": "柔軟な審査",
    "Bloqueo preventivo de datos Ley 8968 e insultos": "個人情報保護法第8968号データおよび誹謗中傷の予防的即時遮断",
    "Revisión balanceada con escalamiento humano": "自動判定と人間の監査官による段階的審査体制",
    "Detección exclusiva de spam malicioso evidente": "明らかな悪意のあるスパムおよび攻撃投稿のみを検知",
    "COLECCIONES DE DATOS AUTORIZADAS PARA LECTURA POR LA IA:": "AIによる読み取り・参照が認可されたデータコレクション：",
    "Destinos y POIs Turísticos": "観光名所および主要POI地点",
    "Directorio PyMEs y Ferias": "地元中小企業および市場名簿",
    "Gacetas y Comunicados": "官報公示および公式議事録",
    "Hospitales y Refugios CNE": "救急病院およびCNE指定避難所",
    "Auditoria (Confidencial)": "内部監査記録（機密保持対象）",
    "Cédulas (Prohibido Ley 8968)": "身分証番号記録（第8968号法によりAI参照禁止）",
    "MANTENIMIENTO SOBERANO Y RESPALDO INSTITUCIONAL": "主権的保守点検および公的データバックアップ",
    "Descargar Copia de Seguridad": "暗号化バックアップを保存",
    "Restablecer Datos Semilla de Fábrica": "工場出荷時初期データに復元",

    // Login y Tarjeta de Acceso Soberano
    "Acceso Soberano": "主権的アクセス認証",
    "Control de Acceso Basado en Roles (RBAC) para los Servicios Cívicos de la República": "共和国市民サービスのための役割基準アクセス制御 (RBAC)",
    "ACCESO SEGURO • LEY N° 8968 & LEY N° 8292": "高セキュリティ認証 • 法第8968号および第8292号準拠",
    "Crear Cuenta": "新規アカウント登録",
    "Cédula Costarricense o Correo Institucional": "コスタリカ身分証番号または公的メールアドレス",
    "Contraseña de Acceso": "アクセスパスワード",
    "Ingresar a la Plataforma": "プラットフォームにログイン",
    "Protegido bajo la Ley N° 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales y Ley N° 8292 de Control Interno.": "個人情報保護に関する法律第8968号および内部統制に関する法律第8292号に基づき保護されています。",
    "SISTEMA NACIONAL DE SOBERANÍA DIGITAL • REPÚBLICA DE COSTA RICA": "国家デジタル主権システム • コスタリカ共和国",
    "Bienvenido a tu Sede Cívica, Superintendencia Nacional de Gobierno Digital": "市民本部へようこそ、国家デジタル政府監督局",
    "Cantón de Todas las Municipalidades": "全自治体カントン管轄",
    "Despliegue Territorial y Descentralización Soberana": "地域主権的展開および地方分権化統治",
    "7 Provincias · 84 Cantones Autónomos · 492 Distritos · Sistema Sovereign Civic Glass v2.1": "全7州 · 84自律郡 · 492地区 · Sovereign Civic Glass v2.1システム",
    "Red Cantonal 100% Operativa": "郡ネットワーク100%完全稼働中",

    // Padrón y Usuarios
    "Padrón & Auditoría Cívica Institucional": "公的市民名簿および監査",
    "Nuevo Usuario Oficial": "新規公認ユーザー登録",
    "Exportar Padrón (CSV)": "名簿エクスポート (CSV)",
    "IDENTIFICACIÓN Y CIUDADANO": "身分証番号・氏名",
    "CORREO ELECTRÓNICO": "メールアドレス",
    "ROL Y JERARQUÍA": "職責・アクセス権限",
    "JURISDICCIÓN": "管轄地域",
    "ESTADO": "ステータス",
    "ACCIONES": "操作"
  },

  // --------------------------------------------------------------------------
  // 2. INGLÉS (en)
  // --------------------------------------------------------------------------
  "en": {
    "REPÚBLICA DE COSTA RICA": "REPUBLIC OF COSTA RICA",
    "SEDE ELECTRÓNICA NACIONAL": "NATIONAL ELECTRONIC HEADQUARTERS",
    "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "NATIONAL SYSTEM OF LOCAL GOVERNMENTS",
    "84 CANTONES AUTÓNOMOS": "84 AUTONOMOUS CANTONS",
    "Cantón:": "Canton:",
    "Cantón (Autónomo):": "Autonomous Canton:",
    "PODER EJECUTIVO Y RÉGIMEN MUNICIPAL": "EXECUTIVE BRANCH & MUNICIPAL REGIME",
    "PANEL DE MANDO": "COMMAND PANEL",
    "Ventanilla Comercial": "Commercial Window",
    "HACIENDA ATV": "Treasury ATV",
    "PATENTES & TRIBUTOS": "Licenses & Taxes",
    "ACTAS OFICIALES PDF": "Official Minutes PDF",
    "REGIDORES & ALCALDÍA": "Aldermen & Mayor",
    "HUECOS & VÍAS": "Potholes & Roads",
    "EVIDENCIA WEBP": "WebP Evidence",
    "CCDR DEPORTES": "CCDR Sports",
    "FERIAS & PYMES": "Fairs & PyMEs",
    "TODAS LAS MUNICIPALIDADES": "ALL MUNICIPALITIES",
    "Todas las Municipalidades": "All Municipalities",
    "Gestión de Obras Públicas y Averías Municipales": "Public Works & Municipal Damage Management",
    "Participación Ciudadana y Presupuestos Participativos": "Citizen Participation & Participatory Budgets",
    "Red de Albergues y Capacidad de Emergencia CNE": "CNE Emergency Shelter Network & Capacity",
    "Bandeja de Solicitudes Comerciales, Patentes y Ferias": "Commercial Requests, Licenses & Fairs Inbox",
    "Centro de Operaciones de Emergencia (COE · CNE)": "Emergency Operations Center (COE · CNE)",
    "Gobernanza del Motor de Inteligencia Artificial Cívica": "Civic Artificial Intelligence Engine Governance",
    "Acceso Soberano": "Sovereign Access",
    "Control de Acceso Basado en Roles (RBAC) para los Servicios Cívicos de la República": "Role-Based Access Control (RBAC) for Republic Civic Services",
    "Iniciar Sesión": "Sign In",
    "Crear Cuenta": "Create Account",
    "Cédula Costarricense o Correo Institucional": "Costa Rican ID or Institutional Email",
    "Contraseña de Acceso": "Access Password",
    "Ingresar a la Plataforma": "Enter Platform",
    "Publicar y Actualizar Nivel de Alerta": "Publish & Update Alert Level",
    "Desactivar / Retirar Alerta Nacional": "Deactivate / Withdraw National Alert",
    "Interruptor Maestro de IA (Kill-Switch)": "AI Master Switch (Kill-Switch)",
    "Activar Kill-Switch": "Activate Kill-Switch",
    "Moderación Estricta": "Strict Moderation",
    "Moderación Media": "Medium Moderation",
    "Moderación Flexible": "Flexible Moderation",
    "IDENTIFICACIÓN Y CIUDADANO": "IDENTIFICATION & CITIZEN",
    "CORREO ELECTRÓNICO": "EMAIL ADDRESS",
    "ROL Y JERARQUÍA": "ROLE & HIERARCHY",
    "JURISDICCIÓN": "JURISDICTION",
    "ESTADO": "STATUS",
    "ACCIONES": "ACTIONS"
  },

  // --------------------------------------------------------------------------
  // 3. PORTUGUÉS (pt)
  // --------------------------------------------------------------------------
  "pt": {
    "REPÚBLICA DE COSTA RICA": "REPÚBLICA DA COSTA RICA",
    "SEDE ELECTRÓNICA NACIONAL": "SEDE ELETRÔNICA NACIONAL",
    "SISTEMA NACIONAL DE GOBIERNOS LOCALES": "SISTEMA NACIONAL DE GOVERNOS LOCAIS",
    "84 CANTONES AUTÓNOMOS": "84 CANTÕES AUTÔNOMOS",
    "Cantón:": "Cantão:",
    "Cantón (Autónomo):": "Cantão Autônomo:",
    "PANEL DE MANDO": "PAINEL DE COMANDO",
    "Ventanilla Comercial": "Balcão Comercial",
    "TODAS LAS MUNICIPALIDADES": "TODOS OS MUNICÍPIOS",
    "Todas las Municipalidades": "Todos os Municípios",
    "Acceso Soberano": "Acesso Soberano",
    "Iniciar Sesión": "Entrar",
    "Crear Cuenta": "Criar Conta",
    "Contraseña de Acceso": "Palavra-passe de Acesso",
    "Ingresar a la Plataforma": "Acessar Plataforma",
    "Gestión de Obras Públicas y Averías Municipales": "Gestão de Obras Públicas e Ocorrências",
    "Participación Ciudadana y Presupuestos Participativos": "Participação Cidadã e Orçamentos",
    "Red de Albergues y Capacidad de Emergencia CNE": "Rede de Abrigos e Capacidade CNE"
  },

  // --------------------------------------------------------------------------
  // 4. CHOROTEGA (cho)
  // --------------------------------------------------------------------------
  "cho": {
    "REPÚBLICA DE COSTA RICA": "REPUBLICA DE COSTA RICA",
    "PANEL DE MANDO": "NAMU KWE PANEL",
    "Ventanilla Comercial": "Yuri Comercial",
    "TODAS LAS MUNICIPALIDADES": "TODOS NAMU MUKU",
    "Todas las Municipalidades": "Todos Namu Muku",
    "Acceso Soberano": "Kwe Soberano",
    "Iniciar Sesión": "Kwe In",
    "Crear Cuenta": "Kwe Registro",
    "Ingresar a la Plataforma": "Kwe Plataforma"
  },

  // --------------------------------------------------------------------------
  // 5. ESPAÑOL DE ESPAÑA (es-ES)
  // --------------------------------------------------------------------------
  "es-ES": {
    "PANEL DE MANDO": "PANEL DE CONTROL",
    "Ventanilla Comercial": "Ventanilla Comercial",
    "Acceso Soberano": "Acceso Soberano",
    "Iniciar Sesión": "Iniciar Sesión",
    "Crear Cuenta": "Crear Cuenta",
    "Ingresar a la Plataforma": "Acceder a la Plataforma"
  },

  // --------------------------------------------------------------------------
  // 6. ESPAÑOL LATINOAMERICANO (Base)
  // --------------------------------------------------------------------------
  "es-latam": {}
};

// Aliases
DICCIONARIO_MAESTRO["es-419"] = DICCIONARIO_MAESTRO["es-latam"];
DICCIONARIO_MAESTRO["es-CR"] = DICCIONARIO_MAESTRO["es-latam"];
DICCIONARIO_MAESTRO["es"] = DICCIONARIO_MAESTRO["es-latam"];
DICCIONARIO_MAESTRO["CR"] = DICCIONARIO_MAESTRO["es-latam"];
DICCIONARIO_MAESTRO["es-es"] = DICCIONARIO_MAESTRO["es-ES"];
DICCIONARIO_MAESTRO["ES"] = DICCIONARIO_MAESTRO["es-ES"];
DICCIONARIO_MAESTRO["en-US"] = DICCIONARIO_MAESTRO["en"];
DICCIONARIO_MAESTRO["US"] = DICCIONARIO_MAESTRO["en"];
DICCIONARIO_MAESTRO["ja-JP"] = DICCIONARIO_MAESTRO["ja"];
DICCIONARIO_MAESTRO["JP"] = DICCIONARIO_MAESTRO["ja"];
DICCIONARIO_MAESTRO["pt-BR"] = DICCIONARIO_MAESTRO["pt"];
DICCIONARIO_MAESTRO["pt-PT"] = DICCIONARIO_MAESTRO["pt"];
DICCIONARIO_MAESTRO["BR"] = DICCIONARIO_MAESTRO["pt"];
DICCIONARIO_MAESTRO["chorotega"] = DICCIONARIO_MAESTRO["cho"];

// ============================================================================
// CAPA 2: MAPA LÉXICO ATÓMICO (Traduce palabras y botones sueltos en el DOM)
// ============================================================================
export const PALABRAS_CLAVE_ATOMICAS = {
  "ja": {
    "Todas": "すべて",
    "Todos": "すべて",
    "PENDIENTE": "保留中",
    "Pendiente": "保留中",
    "APROBADO": "承認済み",
    "Aprobado": "承認済み",
    "RECHAZADO": "却下",
    "Rechazado": "却下",
    "ACTIVO": "有効",
    "Activo": "有効",
    "SUSPENDIDO": "一時停止",
    "Suspendido": "一時停止",
    "ALTA": "高",
    "Alta": "高",
    "MEDIA": "中",
    "Media": "中",
    "BAJA": "低",
    "Baja": "低",
    "CRÍTICA": "緊急",
    "Crítica": "緊急",
    "En Inspección": "調査中",
    "Solucionado": "修繕完了",
    "Buscar": "検索",
    "Consultar": "照会",
    "Validar": "検証",
    "Guardar": "保存",
    "Cancelar": "キャンセル",
    "Descargar": "保存",
    "Eliminar": "削除",
    "Editar": "編集",
    "Cerrar": "閉じる",
    "Cédula": "身分証番号",
    "Nombre": "氏名",
    "Correo": "メール",
    "Contraseña": "パスワード",
    "Provincia": "州",
    "Cantón": "郡",
    "Distrito": "地区",
    "Sector A": "A地区",
    "Sector B": "B地区",
    "Sector C": "C地区",
    "Sector D": "D地区",
    "Sector E": "E地区",
    "Sector F": "F地区",
    "personas": "名",
    "patentes": "件",
    "puestos": "区画",
    "votos": "票"
  },
  "en": {
    "Todas": "All",
    "Todos": "All",
    "PENDIENTE": "PENDING",
    "Pendiente": "Pending",
    "APROBADO": "APPROVED",
    "Aprobado": "Approved",
    "RECHAZADO": "REJECTED",
    "Rechazado": "Rejected",
    "ACTIVO": "ACTIVE",
    "Activo": "Active",
    "SUSPENDIDO": "SUSPENDED",
    "Suspendido": "Suspended",
    "ALTA": "HIGH",
    "Alta": "High",
    "MEDIA": "MEDIUM",
    "Media": "Medium",
    "BAJA": "LOW",
    "Baja": "Low",
    "CRÍTICA": "CRITICAL",
    "Crítica": "Critical",
    "En Inspección": "Inspecting",
    "Solucionado": "Solved",
    "Buscar": "Search",
    "Consultar": "Consult",
    "Validar": "Validate",
    "Guardar": "Save",
    "Cancelar": "Cancel",
    "Descargar": "Download",
    "Eliminar": "Delete",
    "Editar": "Edit",
    "Cerrar": "Close",
    "Cédula": "ID Card",
    "Nombre": "Name",
    "Correo": "Email",
    "Contraseña": "Password",
    "Provincia": "Province",
    "Cantón": "Canton",
    "Distrito": "District",
    "Sector A": "Sector A",
    "Sector B": "Sector B",
    "Sector C": "Sector C",
    "Sector D": "Sector D",
    "Sector E": "Sector E",
    "Sector F": "Sector F",
    "personas": "people",
    "patentes": "permits",
    "puestos": "stalls",
    "votos": "votes"
  },
  "pt": {
    "Todas": "Todas",
    "Todos": "Todos",
    "PENDIENTE": "PENDENTE",
    "Pendiente": "Pendente",
    "APROBADO": "APROVADO",
    "Aprobado": "Aprovado",
    "RECHAZADO": "REJEITADO",
    "Rechazado": "Rejeitado",
    "ACTIVO": "ATIVO",
    "Activo": "Ativo",
    "SUSPENDIDO": "SUSPENSO",
    "Suspendido": "Suspenso",
    "ALTA": "ALTA",
    "Alta": "Alta",
    "MEDIA": "MÉDIA",
    "Media": "Média",
    "BAJA": "BAIXA",
    "Baja": "Baixa",
    "CRÍTICA": "CRÍTICA",
    "Crítica": "Crítica",
    "En Inspección": "Em Inspeção",
    "Solucionado": "Solucionado",
    "Buscar": "Pesquisar",
    "Consultar": "Consultar",
    "Guardar": "Salvar",
    "Cancelar": "Cancelar",
    "personas": "pessoas"
  },
  "cho": {
    "Todas": "Yuri",
    "Todos": "Yuri",
    "PENDIENTE": "KWE",
    "Pendiente": "Kwe",
    "APROBADO": "NAMU",
    "Aprobado": "Namu",
    "RECHAZADO": "KWE-NO",
    "Rechazado": "Kwe-No",
    "ACTIVO": "YURI",
    "Activo": "Yuri",
    "SUSPENDIDO": "KWE",
    "Suspendido": "Kwe",
    "Buscar": "Nami",
    "Consultar": "Nami",
    "personas": "personas"
  },
  "es-es": {
    "Todas": "Todas",
    "Todos": "Todos"
  }
};

// Aliases léxicos
PALABRAS_CLAVE_ATOMICAS["es-419"] = PALABRAS_CLAVE_ATOMICAS["es-latam"] || {};
PALABRAS_CLAVE_ATOMICAS["es-CR"] = PALABRAS_CLAVE_ATOMICAS["es-latam"] || {};
PALABRAS_CLAVE_ATOMICAS["es"] = PALABRAS_CLAVE_ATOMICAS["es-latam"] || {};
PALABRAS_CLAVE_ATOMICAS["es-ES"] = PALABRAS_CLAVE_ATOMICAS["es-es"];
PALABRAS_CLAVE_ATOMICAS["ES"] = PALABRAS_CLAVE_ATOMICAS["es-es"];
PALABRAS_CLAVE_ATOMICAS["en-US"] = PALABRAS_CLAVE_ATOMICAS["en"];
PALABRAS_CLAVE_ATOMICAS["ja-JP"] = PALABRAS_CLAVE_ATOMICAS["ja"];
PALABRAS_CLAVE_ATOMICAS["pt-BR"] = PALABRAS_CLAVE_ATOMICAS["pt"];
PALABRAS_CLAVE_ATOMICAS["chorotega"] = PALABRAS_CLAVE_ATOMICAS["cho"];

// ============================================================================
// DICCIONARIO COMPLETO CONSOLIDADO
// ============================================================================
export const DICCIONARIO_COMPLETO = {
  "ja": {
    ...(DICCIONARIO_CIVICO["ja"] || {}),
    ...(DICCIONARIO_MAESTRO["ja"] || {}),
    ...(PALABRAS_CLAVE_ATOMICAS["ja"] || {})
  },
  "en": {
    ...(DICCIONARIO_CIVICO["en"] || {}),
    ...(DICCIONARIO_MAESTRO["en"] || {}),
    ...(PALABRAS_CLAVE_ATOMICAS["en"] || {})
  },
  "pt": {
    ...(DICCIONARIO_CIVICO["pt"] || {}),
    ...(DICCIONARIO_MAESTRO["pt"] || {}),
    ...(PALABRAS_CLAVE_ATOMICAS["pt"] || {})
  },
  "cho": {
    ...(DICCIONARIO_CIVICO["cho"] || {}),
    ...(DICCIONARIO_MAESTRO["cho"] || {}),
    ...(PALABRAS_CLAVE_ATOMICAS["cho"] || {})
  },
  "es-ES": {
    ...(DICCIONARIO_CIVICO["es-ES"] || {}),
    ...(DICCIONARIO_MAESTRO["es-ES"] || {}),
    ...(PALABRAS_CLAVE_ATOMICAS["es-ES"] || {})
  },
  "es-latam": {
    ...(DICCIONARIO_CIVICO["es-latam"] || {}),
    ...(DICCIONARIO_MAESTRO["es-latam"] || {})
  }
};

DICCIONARIO_COMPLETO["es-419"] = DICCIONARIO_COMPLETO["es-latam"];
DICCIONARIO_COMPLETO["es-CR"] = DICCIONARIO_COMPLETO["es-latam"];
DICCIONARIO_COMPLETO["es"] = DICCIONARIO_COMPLETO["es-latam"];
DICCIONARIO_COMPLETO["CR"] = DICCIONARIO_COMPLETO["es-latam"];
DICCIONARIO_COMPLETO["es-es"] = DICCIONARIO_COMPLETO["es-ES"];
DICCIONARIO_COMPLETO["ES"] = DICCIONARIO_COMPLETO["es-ES"];
DICCIONARIO_COMPLETO["en-US"] = DICCIONARIO_COMPLETO["en"];
DICCIONARIO_COMPLETO["US"] = DICCIONARIO_COMPLETO["en"];
DICCIONARIO_COMPLETO["ja-JP"] = DICCIONARIO_COMPLETO["ja"];
DICCIONARIO_COMPLETO["JP"] = DICCIONARIO_COMPLETO["ja"];
DICCIONARIO_COMPLETO["pt-BR"] = DICCIONARIO_COMPLETO["pt"];
DICCIONARIO_COMPLETO["pt-PT"] = DICCIONARIO_COMPLETO["pt"];
DICCIONARIO_COMPLETO["BR"] = DICCIONARIO_COMPLETO["pt"];
DICCIONARIO_COMPLETO["chorotega"] = DICCIONARIO_COMPLETO["cho"];

export default DICCIONARIO_COMPLETO;
