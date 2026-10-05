/**
 * ============================================================================
 * COSTA RICA UNIDOS — LÉXICO Y FILTRO DETERMINISTA LOCAL (CAPA 1)
 * Motor de normalización profunda, des-leetspeak, desofuscación y lista blanca cívica.
 * No genera peticiones de red ni latencia.
 * ============================================================================
 */

import { GRAVEDAD } from './reglasForo.js';

/**
 * Lista blanca de términos cívicos, institucionales y del vocabulario costarricense
 * que contienen subcadenas que podrían generar falsos positivos con filtros ingenuos.
 */
export const LISTA_BLANCA_CIVICA = new Set([
  'computadora',
  'computadoras',
  'computacion',
  'puntarenas',
  'disputa',
  'disputas',
  'disputar',
  'diputado',
  'diputados',
  'diputada',
  'diputadas',
  'reputacion',
  'amputar',
  'amputacion',
  'escupitajo',
  'escupir',
  'caput',
  'hueco',
  'huecos',
  'hueco vial',
  'bacheo',
  'alcantarilla',
  'negligente',
  'negligencia',
  'incompetente',
  'incompetencia',
  'burocracia',
  'despilfarro',
  'presupuesto',
  'asamblea',
  'canton',
  'cantonal',
  'municipalidad',
  'alcaldia',
  'concejo'
]);

/**
 * Diccionario de términos y patrones infractores con categorías y gravedad.
 */
export const DICCIONARIO_INFRACTOR = [
  // ==========================================
  // AMENAZAS Y VIOLENCIA (GRAVE)
  // ==========================================
  {
    raiz: 'matar',
    patron: /\b(?:(?:te|lo|la|los|las|nos)?\s*voy\s+a\s+matar|vamos\s+a\s+matar|hay\s+que\s+matar(?:los?|las?)?|matarlo|matarla|matarlos|matarte|asesinar(?:lo|la|los|te)?)\b/i,
    categoria: 'amenaza',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Amenaza explícita de daño físico o muerte.'
  },
  {
    raiz: 'plomo',
    patron: /\b(meter(?:le|te|les)?\s+plomo|dar(?:le|te|les)?\s+plomo|balazos?|tirotear|linchar)\b/i,
    categoria: 'amenaza',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Amenaza de agresión armada o violencia colectiva.'
  },
  {
    raiz: 'golpear',
    patron: /\b(partir(?:le|te)?\s+la\s+madre|romper(?:le|te)?\s+el\s+hocico|agarrar(?:le|te)?\s+a\s+golpes|voy\s+a\s+golpear)\b/i,
    categoria: 'amenaza',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Amenaza directa de agresión corporal.'
  },

  // ==========================================
  // INSULTOS Y VULGARIDAD DIRIGIDA (MEDIA / GRAVE)
  // ==========================================
  {
    raiz: 'carepicha',
    patron: /\bcare\s*picha[s]?\b/i,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto soez degradante.'
  },
  {
    raiz: 'careverga',
    patron: /\bcare\s*verga[s]?\b/i,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto soez dirigido.'
  },
  {
    raiz: 'hijueputa',
    patron: /\b(?:hdp|h\.d\.p|hijueputa[s]?|jueputa[s]?|hijo\s+de\s+puta[s]?)\b/i,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto vulgar hostil.'
  },
  {
    raiz: 'malparido',
    patron: /\bmalparid[oae]s?\b/i,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto agresivo dirigido.'
  },
  {
    raiz: 'idiota',
    patron: /\b(?:idiota[s]?|imbecil(?:es)?|estupido[as]?)\b/i,
    categoria: 'insulto',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Descalificación personal irrespetuosa.'
  },
  {
    raiz: 'granputa',
    patron: /\bgran\s*puta[s]?\b/i,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Expresión soez degradante.'
  },

  // ==========================================
  // VULGARIDAD Y OBSCENIDAD GENERAL (LEVE / MEDIA)
  // ==========================================
  {
    raiz: 'picha',
    patron: /\bpicha[s]?\b/i,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Término soez y obsceno.'
  },
  {
    raiz: 'mierda',
    patron: /\b(?:mierda[s]?|comamierda|come\s*mierda)\b/i,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Lenguaje soez y despectivo.'
  },
  {
    raiz: 'puta',
    patron: /\bputa[s]?\b/i,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Expresión soez vulgar.'
  },
  {
    raiz: 'verga',
    patron: /\bverga[s]?\b/i,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Término soez de connotación sexual explícita.'
  },
  {
    raiz: 'culo',
    patron: /\b(?:culo[s]?|culazo[s]?)\b/i,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Vocabulario vulgar inadecuado en foro cívico.'
  },
  {
    raiz: 'mamon',
    patron: /\bmamon(?:es)?|mamona[s]?\b/i,
    categoria: 'insulto',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Término despectivo vulgar.'
  },

  // ==========================================
  // DISCURSO DE ODIO Y DISCRIMINACIÓN (GRAVE)
  // ==========================================
  {
    raiz: 'odio_homofobico',
    patron: /\b(?:playo\s+de\s+mierda|maricon(?:es)?|marica[s]?|tortillera[s]?)\b/i,
    categoria: 'odio',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Discurso de odio o acoso discriminatorio por orientación sexual.'
  },
  {
    raiz: 'odio_xenofobo',
    patron: /\b(?:nicas?\s+(?:de\s+mierda|asquerosos?|plagas?)|fuera\s+nicas|limpieza\s+social)\b/i,
    categoria: 'odio',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Discurso de odio, xenofobia o discriminación por nacionalidad.'
  },
  {
    raiz: 'odio_racista',
    patron: /\b(?:negro\s+de\s+mierda|raza\s+inferior)\b/i,
    categoria: 'odio',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Discurso de odio racial estrictamente prohibido.'
  },

  // ==========================================
  // FILTRACIÓN DE DATOS PERSONALES (GRAVE - LEY N° 8968)
  // ==========================================
  {
    raiz: 'datos_personales_telefono',
    patron: /\b(?:llamen(?:lo|la)?\s+al|su\s+(?:tel|celular|numero)\s+es)\s*(?:\+?506\s*)?[2678]\d{3}[-\s]?\d{4}\b/i,
    categoria: 'datos_personales',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Intento de difusión no autorizada de números de contacto personal (Ley N° 8968).'
  },
  {
    raiz: 'datos_personales_cedula_doxxing',
    patron: /\b(?:cedula|identificacion)\s+(?:de\s+este\s+mae|para\s+joder(?:lo)?)\s*:\s*\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}\b/i,
    categoria: 'datos_personales',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Filtración maliciosa de datos privados de terceros (Doxxing).'
  }
];

/**
 * Tabla de reemplazos de caracteres ofuscados (Leetspeak y sustituciones visuales)
 */
const MAPA_LEETSPEAK = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '|': 'i',
  '+': 't'
};

/**
 * Normaliza un texto para inspección determinista:
 * 1. Pasa a minúsculas y elimina diacríticos/tildes.
 * 2. Reemplaza sustituciones numéricas y de símbolos (Leetspeak).
 * 3. Colapsa letras repetidas innecesarias (ej. "puuuutaaaa" -> "puta").
 * 4. Remueve separadores intercalados intencionales (ej. "p.u.t.a" -> "puta").
 * 
 * @param {string} texto
 * @returns {{ textoOriginal: string, textoNormalizado: string, textoDesofuscado: string }}
 */
export function normalizarTextoModeracion(texto) {
  if (!texto || typeof texto !== 'string') {
    return { textoOriginal: '', textoNormalizado: '', textoDesofuscado: '' };
  }

  const textoOriginal = texto.trim();

  // 1. Minúsculas y despojo de acentos
  let norm = textoOriginal
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 2. Traducción Leetspeak básica
  let leet = norm.split('').map(ch => MAPA_LEETSPEAK[ch] || ch).join('');

  // 3. Colapso de letras repetidas más de 2 veces (ej. "hijooolas" -> "hijoolas", "puuuutaa" -> "puutaa")
  let colapsado = leet.replace(/([a-z])\1{2,}/g, '$1$1');

  // 4. Detección de palabras con separadores entre letras (ej. "p.u.t.a", "p u t a", "p-u-t-a", "p_u_t_a")
  // Detecta secuencias de letras únicas separadas por puntos/guiones/espacios
  let sinSeparadores = colapsado.replace(/\b([a-z])[.\-_ ]+([a-z])[.\-_ ]+([a-z])[.\-_ ]+([a-z]+)\b/gi, '$1$2$3$4');

  return {
    textoOriginal,
    textoNormalizado: norm,
    textoDesofuscado: `${colapsado} ${sinSeparadores}`
  };
}

/**
 * Analizador determinista local sin red (Capa 1).
 * Detecta infracciones evidentes y previene falsos positivos con lista blanca.
 * 
 * @param {string} texto
 * @returns {object} Resultado del análisis
 */
export function analizarTextoLocal(texto) {
  if (!texto || !texto.trim()) {
    return {
      infraccion: false,
      gravedad: GRAVEDAD.NINGUNA,
      categorias: [],
      palabrasDetectadas: [],
      razon: 'Texto vacío.',
      scoreToxicidad: 0,
      seguroBloquear: false
    };
  }

  const { textoOriginal, textoNormalizado, textoDesofuscado } = normalizarTextoModeracion(texto);

  // Palabras del texto desglosadas para verificación de lista blanca
  const tokensTexto = textoNormalizado
    .replace(/[^a-z0-9áéíóúñü]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const categoriasEncontradas = new Set();
  const palabrasEncontradas = new Set();
  let maxGravedad = GRAVEDAD.NINGUNA;
  let razonDeterminada = '';
  let scoreEstimado = 0;

  for (const item of DICCIONARIO_INFRACTOR) {
    // Comprobamos tanto en texto normalizado como en texto desofuscado
    const matchNorm = textoNormalizado.match(item.patron);
    const matchDesof = textoDesofuscado.match(item.patron);

    const match = matchNorm || matchDesof;
    if (match) {
      const terminoDetectado = match[0].trim().toLowerCase();

      // Verificar si el término coincide o forma parte legítima de la lista blanca
      const esFalsoPositivo = tokensTexto.some(tok => {
        if (LISTA_BLANCA_CIVICA.has(tok)) {
          // Si el token es de lista blanca (ej. "puntarenas", "computadora", "disputa")
          // y el match está contenido dentro de ese token, se ignora
          return tok.includes(terminoDetectado);
        }
        return false;
      });

      if (!esFalsoPositivo) {
        categoriasEncontradas.add(item.categoria);
        palabrasEncontradas.add(terminoDetectado);
        if (!razonDeterminada) {
          razonDeterminada = item.razon;
        }

        // Actualizar severidad máxima
        if (item.gravedad === GRAVEDAD.GRAVE) {
          maxGravedad = GRAVEDAD.GRAVE;
          scoreEstimado = Math.max(scoreEstimado, 95);
        } else if (item.gravedad === GRAVEDAD.MEDIA && maxGravedad !== GRAVEDAD.GRAVE) {
          maxGravedad = GRAVEDAD.MEDIA;
          scoreEstimado = Math.max(scoreEstimado, 70);
        } else if (item.gravedad === GRAVEDAD.LEVE && maxGravedad === GRAVEDAD.NINGUNA) {
          maxGravedad = GRAVEDAD.LEVE;
          scoreEstimado = Math.max(scoreEstimado, 40);
        }
      }
    }
  }

  const tieneInfraccion = categoriasEncontradas.size > 0;

  return {
    infraccion: tieneInfraccion,
    gravedad: maxGravedad,
    categorias: Array.from(categoriasEncontradas),
    palabrasDetectadas: Array.from(palabrasEncontradas),
    razon: razonDeterminada || (tieneInfraccion ? 'Contenido contrario a las reglas cívicas del foro.' : 'Contenido apto para publicación.'),
    scoreToxicidad: scoreEstimado,
    seguroBloquear: tieneInfraccion && (maxGravedad === GRAVEDAD.GRAVE || maxGravedad === GRAVEDAD.MEDIA)
  };
}
