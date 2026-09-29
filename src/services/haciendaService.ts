/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO TRIBUTARIO Y DE IDENTIFICACIÓN
 * Integración Oficial: Ministerio de Hacienda de la República de Costa Rica
 * Endpoint AE: https://api.hacienda.go.cr/fe/ae
 * ============================================================================
 * 
 * Normativa:
 * - Ley N° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales)
 * - RNF-09: TypeScript strict: true
 * - RNF-10: Caché local y deduplicación para prevenir sobrecarga de la API de Hacienda
 */

export type TipoIdentificacion = 'FISICA' | 'JURIDICA' | 'DIMEX' | 'NITE' | 'DESCONOCIDO';

export interface ActividadTributaria {
  codigo: string;
  descripcion: string;
  estado: string; // 'A' = Activa, 'I' = Inactiva
}

export interface RegimenTributario {
  codigo?: number | string;
  descripcion: string;
}

export interface SituacionTributaria {
  moroso: 'SI' | 'NO' | string;
  omiso: 'SI' | 'NO' | string;
  estado: string; // Ej: 'INSCRITO', 'DESINSCRITO', 'ACTIVO'
  administracionTributaria?: string;
}

export interface HaciendaApiResponse {
  nombre?: string;
  tipoIdentificacion?: string; // '01' = Física, '02' = Jurídica, '03' = DIMEX, '04' = NITE
  regimen?: RegimenTributario;
  situacion?: SituacionTributaria;
  actividades?: ActividadTributaria[];
}

export interface CedulaValidationResult {
  isValid: boolean;
  cedulaLimpia: string;
  tipo: TipoIdentificacion;
  nombreOficial: string;
  formatoValido: boolean;
  existeEnHacienda: boolean;
  dataOriginal?: HaciendaApiResponse;
  mensajeError?: string;
}

export interface TaxStatusResult {
  cedula: string;
  nombreLegal: string;
  isActivo: boolean;
  isRegimenSimplificado: boolean;
  isMoroso: boolean;
  isOmiso: boolean;
  selloVerificadoHacienda: boolean;
  administracionTributaria: string;
  actividadesPrincipales: ActividadTributaria[];
  selloDescripcion: string;
}

const HACIENDA_AE_BASE_URL = 'https://api.hacienda.go.cr/fe/ae';

// Caché en memoria para evitar consultas repetitivas de cédulas en una misma sesión
const cacheHacienda = new Map<string, { data: HaciendaApiResponse; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutos

/**
 * Limpia y normaliza un número de cédula retirando guiones, espacios y caracteres especiales
 */
export function sanitizeCedula(cedula: string): string {
  if (!cedula) return '';
  return cedula.replace(/[^0-9]/g, '').trim();
}

/**
 * Determina el tipo de identificación costarricense a partir del formato numérico:
 * - Cédula Física: 9 o 10 dígitos (1 a 9 provincias, ej: 101230456 o 1-0123-0456)
 * - Cédula Jurídica: 10 dígitos (inicia con 3, ej: 3-101-123456)
 * - DIMEX: 11 o 12 dígitos (Documento de Identidad Migratorio para Extranjeros)
 * - NITE: 10 dígitos (inicia usualmente con 4)
 */
export function detectTipoIdentificacion(cedulaLimpia: string): { tipo: TipoIdentificacion; formatoValido: boolean } {
  const len = cedulaLimpia.length;

  if (len === 9) {
    // Cédula física estándar de 9 dígitos (1 a 7 provincia)
    const primerDigito = parseInt(cedulaLimpia[0], 10);
    if (primerDigito >= 1 && primerDigito <= 9) {
      return { tipo: 'FISICA', formatoValido: true };
    }
  }

  if (len === 10) {
    if (cedulaLimpia.startsWith('3')) {
      return { tipo: 'JURIDICA', formatoValido: true };
    }
    if (cedulaLimpia.startsWith('4')) {
      return { tipo: 'NITE', formatoValido: true };
    }
    if (cedulaLimpia.startsWith('0')) {
      return { tipo: 'FISICA', formatoValido: true };
    }
    // Cédula física con padding de cero
    return { tipo: 'FISICA', formatoValido: true };
  }

  if (len === 11 || len === 12) {
    return { tipo: 'DIMEX', formatoValido: true };
  }

  return { tipo: 'DESCONOCIDO', formatoValido: false };
}

/**
 * Valida un número de cédula contra el endpoint oficial del Ministerio de Hacienda.
 * Retorna el nombre legal oficial para autocompletado obligatorio sin digitación manual.
 */
export async function validateCedula(cedulaInput: string): Promise<CedulaValidationResult> {
  const cedulaLimpia = sanitizeCedula(cedulaInput);
  const { tipo, formatoValido } = detectTipoIdentificacion(cedulaLimpia);

  if (!formatoValido || !cedulaLimpia) {
    return {
      isValid: false,
      cedulaLimpia,
      tipo,
      nombreOficial: '',
      formatoValido: false,
      existeEnHacienda: false,
      mensajeError: 'Formato de identificación inválido. Ingrese una cédula física (9-10 dígitos), jurídica (10) o DIMEX (11-12).'
    };
  }

  // Verificar en caché local en memoria
  const cached = cacheHacienda.get(cedulaLimpia);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    const data = cached.data;
    const nombre = data.nombre || '';
    return {
      isValid: !!nombre,
      cedulaLimpia,
      tipo,
      nombreOficial: nombre,
      formatoValido: true,
      existeEnHacienda: !!nombre,
      dataOriginal: data
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const url = `${HACIENDA_AE_BASE_URL}?identificacion=${encodeURIComponent(cedulaLimpia)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return {
        isValid: false,
        cedulaLimpia,
        tipo,
        nombreOficial: '',
        formatoValido: true,
        existeEnHacienda: false,
        mensajeError: 'La cédula no se encuentra registrada ante la administración tributaria de Hacienda.'
      };
    }

    if (!response.ok) {
      throw new Error(`Error en el servidor de Hacienda (HTTP ${response.status})`);
    }

    const data: HaciendaApiResponse = await response.json();
    const nombreOficial = (data.nombre || '').trim();

    // Guardar en caché
    cacheHacienda.set(cedulaLimpia, { data, timestamp: Date.now() });

    return {
      isValid: !!nombreOficial,
      cedulaLimpia,
      tipo,
      nombreOficial,
      formatoValido: true,
      existeEnHacienda: !!nombreOficial,
      dataOriginal: data
    };
  } catch (error: unknown) {
    // Si la API pública de Hacienda falla por red o CORS en desarrollo, proveer fallback controlado
    const isAbort = error instanceof Error && error.name === 'AbortError';
    const errorMsg = isAbort
      ? 'Tiempo de espera agotado al consultar la API de Hacienda.'
      : 'No se pudo conectar en tiempo real con la API del Ministerio de Hacienda.';

    return {
      isValid: false,
      cedulaLimpia,
      tipo,
      nombreOficial: '',
      formatoValido: true,
      existeEnHacienda: false,
      mensajeError: errorMsg
    };
  }
}

/**
 * Consulta y certifica la situación tributaria de un comercio, PYME o productor de feria
 * para otorgar el sello oficial "Comercio Verificado por Hacienda / Régimen Simplificado".
 */
export async function checkTaxStatus(cedulaInput: string): Promise<TaxStatusResult> {
  const validation = await validateCedula(cedulaInput);

  if (!validation.isValid || !validation.dataOriginal) {
    return {
      cedula: validation.cedulaLimpia,
      nombreLegal: validation.nombreOficial,
      isActivo: false,
      isRegimenSimplificado: false,
      isMoroso: false,
      isOmiso: false,
      selloVerificadoHacienda: false,
      administracionTributaria: 'No Disponible',
      actividadesPrincipales: [],
      selloDescripcion: validation.mensajeError || 'Identificación no verificada ante Hacienda'
    };
  }

  const raw = validation.dataOriginal;
  const situacion = raw.situacion;
  const regimen = raw.regimen;
  const actividades = (raw.actividades || []).filter((a) => a.estado === 'A');

  const estadoStr = (situacion?.estado || '').toUpperCase();
  const isActivo = estadoStr.includes('INSCRITO') || estadoStr.includes('ACTIVO');
  const isMoroso = (situacion?.moroso || '').toUpperCase() === 'SI';
  const isOmiso = (situacion?.omiso || '').toUpperCase() === 'SI';

  const regimenDesc = (regimen?.descripcion || '').toLowerCase();
  const isRegimenSimplificado =
    regimenDesc.includes('simplificado') || regimen?.codigo === 2 || regimen?.codigo === '2';

  // Sello oficial si está activo y no es moroso
  const selloVerificadoHacienda = isActivo && !isMoroso;

  let selloDescripcion = 'Comercio No Verificado';
  if (selloVerificadoHacienda) {
    if (isRegimenSimplificado) {
      selloDescripcion = 'Comercio Verificado por Hacienda • Régimen Simplificado';
    } else {
      selloDescripcion = 'Comercio Verificado por Hacienda • Contribuyente Activo';
    }
  } else if (isMoroso) {
    selloDescripcion = 'Situación Tributaria Irregular • Pendiente con Hacienda';
  } else if (!isActivo) {
    selloDescripcion = 'Contribuyente en estado Inactivo / Desinscrito';
  }

  return {
    cedula: validation.cedulaLimpia,
    nombreLegal: validation.nombreOficial,
    isActivo,
    isRegimenSimplificado,
    isMoroso,
    isOmiso,
    selloVerificadoHacienda,
    administracionTributaria: situacion?.administracionTributaria || 'Nacional',
    actividadesPrincipales: actividades,
    selloDescripcion
  };
}
