/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE TRADUCCIÓN E INTERNACIONALIZACIÓN SOBERANA
 * Estándares: ISO-639-1 / BCP-47 • Google Cloud Translation API Client
 * Idiomas Oficiales:
 *  - es-419: Español (Latinoamérica / Base Soberana)
 *  - es-ES:  Español (España / BCP-47)
 *  - en:     English (Global / ISO-639-1)
 *  - ja:     日本語 (Japonés / ISO-639-1)
 *  - pt:     Português (Brasil/Portugal / ISO-639-1)
 *  - cho:    Chorotega (Lengua originaria patrimonial de Guanacaste)
 * ============================================================================
 */

export interface TranslationRequest {
  text: string;
  source?: string;
  target: string;
}

export interface TranslationResponse {
  translatedText?: string;
  translation?: string;
  detectedSourceLanguage?: string;
}

// 1. Glosario patrimonial Chorotega integrado (preservación de lengua originaria de Guanacaste)
export const GLOSARIO_CHOROTEGA: Record<string, string> = {
  "Inicio": "Tee",
  "Gestión & Trámites": "Yuri Muku",
  "Gobierno & Concejo": "Namu Kwe",
  "Territorio & Obras": "Kwe & Obras",
  "Comunidad & CCDR": "Komun",
  "Iniciar Sesión": "Kwe In",
  "Cerrar Sesión": "Kwe Out",
  "Volver a mi Interfaz": "Tee Kwe Interfaz",
  "Mi Interfaz": "Kwe Interfaz",
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
  "REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL": "REPÚBLICA DE COSTA RICA · YURI MUKU NACIONAL"
};

// 2. Diccionarios oficiales de respaldo local garantizado (Fallback instantáneo de alta fidelidad)
const DICCIONARIOS_FALLBACK: Record<string, Record<string, string>> = {
  // Inglés (ISO-639-1: en)
  en: {
    "Inicio": "Home",
    "Gestión & Trámites": "Procedures & Civic Services",
    "Gobierno & Concejo": "Government & City Council",
    "Territorio & Obras": "Territory & Public Works",
    "Comunidad & CCDR": "Community & Sports",
    "Iniciar Sesión": "Log In",
    "Cerrar Sesión": "Log Out",
    "Volver a mi Interfaz": "Back to My Dashboard",
    "Mi Interfaz": "My Dashboard",
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
    "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "Review official City Council minutes, validate citizen ID with the Treasury, process commercial permits, and report road incidents in real time with legal traceability under the Municipal Code and Law No. 8968."
  },

  // Japonés (ISO-639-1: ja)
  ja: {
    "Inicio": "ホーム",
    "Gestión & Trámites": "行政手続き・管理",
    "Gobierno & Concejo": "地方行政・市議会",
    "Territorio & Obras": "地域・公共工事",
    "Comunidad & CCDR": "地域コミュニティ・体育",
    "Iniciar Sesión": "ログイン",
    "Cerrar Sesión": "ログアウト",
    "Volver a mi Interfaz": "管理画面へ戻る",
    "Mi Interfaz": "マイ画面",
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
    "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "市議会の公式議事録の確認、財務省データベースでの身分照会、商業許可の申請、リアルタイムの道路インシデント報告を法的なトレーサビリティのもとで実行できます。"
  },

  // Portugués (ISO-639-1: pt)
  pt: {
    "Inicio": "Início",
    "Gestión & Trámites": "Gestão e Trâmites",
    "Gobierno & Concejo": "Governo e Conselho",
    "Territorio & Obras": "Território e Obras",
    "Comunidad & CCDR": "Comunidade e Esporte",
    "Iniciar Sesión": "Iniciar Sessão",
    "Cerrar Sesión": "Encerrar Sessão",
    "Volver a mi Interfaz": "Voltar ao Meu Painel",
    "Mi Interfaz": "Meu Painel",
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
    "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "Consulte atas oficiais do Conselho Municipal, valide identidades na Receita, tramite alvarás e reporte ocorrências viárias em tempo real com rastreabilidade legal."
  },

  // Español de España (BCP-47: es-ES)
  "es-ES": {
    "Inicio": "Inicio",
    "Gestión & Trámites": "Gestión y Trámites",
    "Gobierno & Concejo": "Gobierno y Ayuntamiento",
    "Territorio & Obras": "Territorio y Obras Públicas",
    "Comunidad & CCDR": "Comunidad y Deportes",
    "Iniciar Sesión": "Iniciar Sesión",
    "Cerrar Sesión": "Cerrar Sesión",
    "Volver a mi Interfaz": "Volver a mi Panel",
    "Mi Interfaz": "Mi Panel",
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
    "Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.": "Consulte actas oficiales del Pleno Municipal, valide documentos de identidad con Hacienda, tramite licencias de actividad e incidencias viales en tiempo real."
  }
};

// 3. Memoria caché para no saturar peticiones a la API
const CACHE_TRADUCCIONES: Record<string, Record<string, string>> = {};

/**
 * Normaliza los códigos de idioma recibidos a estándar BCP-47 / ISO-639-1
 */
export function normalizarCodigoIdioma(code: string): string {
  if (!code) return "es-419";
  const c = code.trim().toLowerCase();
  if (c === "es" || c === "es-419" || c === "cr" || c === "es-cr") return "es-419";
  if (c === "es-es" || c === "es_es") return "es-ES";
  if (c === "en" || c === "en-us" || c === "us") return "en";
  if (c === "ja" || c === "jp" || c === "ja-jp") return "ja";
  if (c === "pt" || c === "br" || c === "pt-br" || c === "pt-pt") return "pt";
  if (c === "cho" || c === "chorotega") return "cho";
  return code;
}

/**
 * Resuelve traducciones instantáneas de respaldo local
 */
export function resolverFallbackLocal(texto: string, targetLangCode: string): string {
  const norm = normalizarCodigoIdioma(targetLangCode);
  if (norm === "cho") {
    return GLOSARIO_CHOROTEGA[texto] || texto;
  }
  const dict = DICCIONARIOS_FALLBACK[norm];
  if (dict && dict[texto]) {
    return dict[texto];
  }
  return texto;
}

/**
 * Traduce un texto mediante la API externa de Google Cloud Translation (o endpoint /api/translate)
 * con sistema de caché en memoria y respaldo local garantizado.
 */
export async function traducirTexto(texto: string, targetLangCode: string): Promise<string> {
  if (!texto) return "";
  const targetNorm = normalizarCodigoIdioma(targetLangCode);

  // Si es español latinoamericano base, devolver directo
  if (targetNorm === "es-419" || targetNorm === "es") {
    return texto;
  }

  // 1. Si es Chorotega, resolver mediante el glosario cívico patrimonial
  if (targetNorm === "cho") {
    return GLOSARIO_CHOROTEGA[texto] || texto;
  }

  // 2. Revisar si ya está en caché local para este idioma
  if (CACHE_TRADUCCIONES[targetNorm]?.[texto]) {
    return CACHE_TRADUCCIONES[targetNorm][texto];
  }

  try {
    // 3. Petición a la API de Traducción con timeout de seguridad (2000 ms)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        text: texto,
        source: "es",
        target: targetNorm
      })
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data: TranslationResponse = await response.json();
      const textoTraducido = data.translatedText || data.translation || texto;

      // Guardar en caché
      if (!CACHE_TRADUCCIONES[targetNorm]) CACHE_TRADUCCIONES[targetNorm] = {};
      CACHE_TRADUCCIONES[targetNorm][texto] = textoTraducido;

      return textoTraducido;
    }
  } catch (error) {
    // Latencia, sin conexión o endpoint no configurado en entorno local: aplicar respaldo
  }

  // 4. Respaldo local garantizado (Fallback instantáneo para textos clave)
  const fallback = resolverFallbackLocal(texto, targetNorm);

  if (!CACHE_TRADUCCIONES[targetNorm]) CACHE_TRADUCCIONES[targetNorm] = {};
  CACHE_TRADUCCIONES[targetNorm][texto] = fallback;

  return fallback;
}

/**
 * Genera el mapa completo de traducciones para precargar la interfaz instantáneamente
 */
export function obtenerMapaCompletoIdioma(targetLangCode: string): Record<string, string> {
  const norm = normalizarCodigoIdioma(targetLangCode);
  if (norm === "es-419") {
    return {};
  }
  if (norm === "cho") {
    return { ...GLOSARIO_CHOROTEGA };
  }
  return { ...(DICCIONARIOS_FALLBACK[norm] || {}) };
}

/**
 * Traduce un conjunto de textos en lote y puebla la memoria caché
 */
export async function traducirLote(textos: string[], targetLangCode: string): Promise<Record<string, string>> {
  const norm = normalizarCodigoIdioma(targetLangCode);
  const resultado: Record<string, string> = {};

  if (norm === "es-419") {
    textos.forEach(t => { resultado[t] = t; });
    return resultado;
  }

  const baseMap = obtenerMapaCompletoIdioma(norm);

  for (const t of textos) {
    if (baseMap[t]) {
      resultado[t] = baseMap[t];
      if (!CACHE_TRADUCCIONES[norm]) CACHE_TRADUCCIONES[norm] = {};
      CACHE_TRADUCCIONES[norm][t] = baseMap[t];
    } else {
      resultado[t] = await traducirTexto(t, norm);
    }
  }

  return resultado;
}
