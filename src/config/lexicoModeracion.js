/**
 * ============================================================================
 * COSTA RICA UNIDOS — LÉXICO Y FILTRO DETERMINISTA LOCAL (CAPA 1)
 * ============================================================================
 * 
 * Motor de normalización profunda, des-leetspeak, desofuscación, lista blanca cívica
 * y detección determinista de infracciones y datos personales (Ley N.º 8968).
 * Opera sin consumo de cuota ni peticiones de red.
 */

import { GRAVEDAD } from './reglasForo.js';
import { REGLAS_COMUNIDAD } from './reglasComunidad.js';

/**
 * LISTA BLANCA CÍVICA Y VOCABULARIO NACIONAL LEGÍTIMO
 * Palabras que contienen subcadenas que podrían generar falsos positivos con filtros ingenuos.
 * Garantiza 0 falsos positivos en el "Efecto Scunthorpe".
 */
export const LISTA_BLANCA_CIVICA = new Set([
  'computadora',
  'computadoras',
  'computacion',
  'computacional',
  'puntarenas',
  'puntarenense',
  'disputa',
  'disputas',
  'disputar',
  'disputado',
  'diputado',
  'diputados',
  'diputada',
  'diputadas',
  'diputacion',
  'reputacion',
  'amputar',
  'amputacion',
  'amputado',
  'escupitajo',
  'escupir',
  'escupajo',
  'caput',
  'hueco',
  'huecos',
  'hueco vial',
  'bacheo',
  'alcantarilla',
  'alcantarillado',
  'negligente',
  'negligencia',
  'incompetente',
  'incompetencia',
  'burocracia',
  'burocrata',
  'despilfarro',
  'presupuesto',
  'asamblea',
  'canton',
  'cantonal',
  'municipalidad',
  'alcaldia',
  'alcalde',
  'alcaldesa',
  'regidor',
  'regidores',
  'concejo',
  'concejal',
  'participacion',
  'comunidad',
  'comunal',
  'vecinos',
  'asociacion',
  'recapeo',
  'semaforizacion',
  'alumbrado',
  'parque',
  // Jerga cotidiana inocua costarricense
  'mae',
  'maes',
  'pura vida',
  'tuanis',
  'diay',
  'idiay',
  'juepucha',
  'hijole',
  'chiva',
  'que pereza',
  'desmadre',
  'vacilon',
  'mejenga'
]);

/**
 * BLOQUEO DIRECTO (CAPA 1)
 * Términos y fórmulas inequívocamente soeces, degradantes, amenazantes o filtraciones.
 */
export const BLOQUEO_DIRECTO = [
  // ==========================================
  // 1. AMENAZAS E INTIMIDACIÓN VIOLENTA (REGLA 5 - GRAVE)
  // ==========================================
  {
    raiz: 'matar',
    patron: /\b(?:(?:te|lo|la|los|las|nos)?\s*voy\s+a\s+matar|vamos\s+a\s+matar|hay\s+que\s+matar(?:los?|las?)?|matarlo|matarla|matarlos|matarte|asesinar(?:lo|la|los|te)?)\b/i,
    regla: 5,
    categoria: 'amenaza',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Amenaza explícita de daño físico o muerte (Regla 5).'
  },
  {
    raiz: 'meter_plomo',
    patron: /\b(?:meter(?:le|te|les)?\s+plomo|dar(?:le|te|les)?\s+plomo|plomazos?|tirotear(?:lo|la|los|te)?|linchar(?:lo|la|los|te)?)\b/i,
    regla: 5,
    categoria: 'amenaza',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Amenaza de agresión armada o violencia colectiva (Regla 5).'
  },
  {
    raiz: 'agresion_fisica',
    patron: /\b(?:partir(?:le|te)?\s+la\s+madre|romper(?:le|te)?\s+el\s+hocico|reventar(?:le|te)?\s+la\s+jeta|agarrar(?:le|te)?\s+a\s+golpes|te\s+voy\s+a\s+despedazar|quebrar(?:le|te)?\s+la\s+jupa|volar(?:le|te)?\s+pichazos?|reventar(?:le|te)?\s+el\s+hocico)\b/i,
    regla: 5,
    categoria: 'amenaza',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Amenaza directa de agresión corporal (Regla 5).'
  },
  {
    raiz: 'amenaza_velada',
    patron: /\b(?:ya\s+s[eé].{0,40}d[oó]nde\s+vive|sabemos.{0,30}d[oó]nde\s+vive|cu[ií]dese\s+la\s+espalda|mejor\s+que\s+se\s+cuide|se\s+va\s+a\s+arrepentir|nos\s+vamos\s+a\s+encontrar|at[eé]ngase\s+a\s+las\s+consecuencias|le\s+va\s+a\s+pesar\s+mucho)\b/i,
    regla: 5,
    categoria: 'amenaza',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Amenaza velada o fórmula de intimidación personal (Regla 5).'
  },

  // ==========================================
  // 2. DISCURSO DE ODIO Y DISCRIMINACIÓN (REGLA 5 - GRAVE)
  // ==========================================
  {
    raiz: 'odio_homofobico',
    patron: /\b(?:playo[s]?|maric[oó]n(?:es)?|marica[s]?|tortillera[s]?|maripos[oó]n)\b/i,
    regla: 5,
    categoria: 'odio',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Discurso de odio y acoso discriminatorio por orientación sexual (Regla 5).'
  },
  {
    raiz: 'odio_xenofobo',
    patron: /\b(?:nicas?\s+(?:de\s+mierda|asquerosos?|plagas?|ratas?)|fuera\s+nicas?|limpieza\s+social|venecos?\s+de\s+mierda)\b/i,
    regla: 5,
    categoria: 'odio',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Discurso de odio, xenofobia o discriminación por nacionalidad (Regla 5).'
  },
  {
    raiz: 'odio_racista',
    patron: /\b(?:negro[s]?\s+de\s+mierda|cholo[s]?\s+de\s+mierda|indio[s]?\s+asquerosos?|raza\s+inferior|a\s+esos\s+indios)\b/i,
    regla: 5,
    categoria: 'odio',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Discurso de odio racista estrictamente prohibido (Regla 5).'
  },
  {
    raiz: 'odio_capacitista',
    patron: /\b(?:retrasad[oa]s?\s+mental(?:es)?|retardad[oae]s?|mongol(?:o|as?|itos?)|anormales?|minusv[aá]lidos?\s+de\s+mierda|discapacitado\s+retardado)\b/i,
    regla: 5,
    categoria: 'odio',
    gravedad: GRAVEDAD.GRAVE,
    razon: 'Insulto discriminatorio capacitista hacia personas con discapacidad (Regla 5).'
  },

  // ==========================================
  // 3. INSULTOS PERSONALES Y ACOSO (REGLA 4 - MEDIA / GRAVE)
  // ==========================================
  {
    raiz: 'carepicha',
    patron: /\b(?:care\s*picha[s]?|carepicha[s]?|care'picha[s]?)\b/i,
    regla: 4,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto soez denigrante de la jerga costarricense (Regla 4).'
  },
  {
    raiz: 'careverga',
    patron: /\b(?:care\s*verga[s]?|careverga[s]?)\b/i,
    regla: 4,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto soez dirigido (Regla 4).'
  },
  {
    raiz: 'hijueputa',
    patron: /\b(?:hdp|h\.d\.p|hijueputa[s]?|jueputa[s]?|hijo[s]?\s+de\s+puta[s]?|hijaputa[s]?)\b/i,
    regla: 4,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto vulgar agresivo (Regla 4).'
  },
  {
    raiz: 'malparido',
    patron: /\b(?:malparid[oae]s?|mal\s*parid[oae]s?|malnacid[oae]s?)\b/i,
    regla: 4,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto agraviante (Regla 4).'
  },
  {
    raiz: 'mamapichas',
    patron: /\b(?:mama\s*picha[s]?|chupa\s*picha[s]?|chupamedias\s+de\s+mierda)\b/i,
    regla: 4,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Insulto soez hostil (Regla 4).'
  },
  {
    raiz: 'insultos_descalificadores',
    patron: /\b(?:idiota[s]?|imb[eé]cil(?:es)?|est[uú]pido[as]?|in[uú]til(?:es)?|estupidez\s+humana|tarad[oae]s?|cretin[oae]s?)\b/i,
    regla: 4,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Ataque o descalificación personal directa (Regla 4).'
  },
  {
    raiz: 'granputa',
    patron: /\b(?:gran\s*puta[s]?|grandisima\s*puta)\b/i,
    regla: 4,
    categoria: 'insulto',
    gravedad: GRAVEDAD.MEDIA,
    razon: 'Expresión soez denigrante (Regla 4).'
  },

  // ==========================================
  // 4. VULGARIDAD Y OBSCENIDAD AL AIRE (REGLA 3 - LEVE / MEDIA)
  // ==========================================
  {
    raiz: 'picha_vulgar',
    patron: /\b(?:picha[s]?|pichazo[s]?|despiche[s]?|que\s+picha)\b/i,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Lenguaje soez y obsceno costarricense (Regla 3).'
  },
  {
    raiz: 'mierda_vulgar',
    patron: /\b(?:mierda[s]?|comamierda|come\s*mierda|mierdero)\b/i,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Lenguaje soez y escatológico (Regla 3).'
  },
  {
    raiz: 'cago_vulgar',
    patron: /\b(?:me\s+cago\s+en|cagar(?:se)?\s+en|cagada[s]?)\b/i,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Expresión soez y escatológica (Regla 3).'
  },
  {
    raiz: 'puta_vulgar',
    patron: /\b(?:puta[s]?|putero[s]?|putamadre|puuta+)\b/i,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Expresión soez vulgar (Regla 3).'
  },
  {
    raiz: 'verga_vulgar',
    patron: /\b(?:verga[s]?|vergazo[s]?|a\s+la\s+verga)\b/i,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Término soez de índole sexual (Regla 3).'
  },
  {
    raiz: 'culo_vulgar',
    patron: /\b(?:culo[s]?|culazo[s]?)\b/i,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Vocabulario vulgar inadecuado para espacio cívico (Regla 3).'
  },
  {
    raiz: 'mamon_vulgar',
    patron: /\b(?:mam[oó]n(?:es)?|mamona[s]?)\b/i,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Término soez vulgar (Regla 3).'
  },
  {
    raiz: 'emojis_obscenos',
    patron: /(?:🖕|🖕🏻|🖕🏼|🖕🏽|🖕🏾|🖕🏿)/u,
    regla: 3,
    categoria: 'vulgaridad',
    gravedad: GRAVEDAD.LEVE,
    razon: 'Gesto gráfico obsceno ofensivo (Regla 3).'
  }
];

/**
 * TÉRMINOS CONTEXTUALES (CAPA 2 - GEMINI)
 * Palabras polisémicas que requieren evaluación de intención y contexto.
 */
export const TERMINOS_CONTEXTUALES = [
  { palabra: 'carebarro', regla: 4, nota: 'Peyorativo en debates; a veces tono coloquial entre conocidos.' },
  { palabra: 'baboso', regla: 4, nota: 'Descalificación leve o broma.' },
  { palabra: 'chapa', regla: 4, nota: 'Puede aludir a incompetencia o lámina de metal.' },
  { palabra: 'animal', regla: 4, nota: 'Insulto si se dirige a una persona, o referencia biológica.' },
  { palabra: 'perro', regla: 4, nota: 'Insulto o mascota.' },
  { palabra: 'bestia', regla: 4, nota: 'Insulto o expresión hiperbólica.' },
  { palabra: 'polo', regla: 4, nota: 'Término clasista/despectivo costarricense o prenda de vestir.' },
  { palabra: 'joder', regla: 3, nota: 'Molestar o vulgaridad leve.' }
];

/**
 * EXPRESIONES REGULARES DE DATOS PERSONALES (REGLA 6 - LEY N.° 8968)
 */
export const REGEX_DATOS_PERSONALES = {
  // Teléfono Costa Rica (8 dígitos: móvil 5,6,7,8; fijo 2; con o sin +506)
  telefonoCR: /(?:\+?506[\s-]?)?\b[25678]\d{3}[-\s]?\d{4}\b/g,

  // Cédula nacional costarricense (9 dígitos: 1-9 seguido de 4 y 4)
  cedulaCR: /\b[1-9][-\s]?\d{4}[-\s]?\d{4}\b/g,

  // Cédula 9 dígitos continua
  cedulaContinuaCR: /\b[1-9]\d{8}\b/g,

  // DIMEX (11 o 12 dígitos)
  dimex: /\b\d{4}[-\s]?\d{4}[-\s]?\d{3,4}\b/g,

  // Correos electrónicos
  correo: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,

  // Direcciones residenciales privadas exactas (Doxxing)
  direccionResidencial: /\b(?:\d+\s*metros?\s+(?:al\s+|del\s+|hacia\s+el\s+)?(?:norte|sur|este|oeste)?\s*(?:de\s+la|de|del)?|frente\s+(?:a|al|del)|contiguo\s+(?:a|al))\s+(?:la\s+)?casa\s+de\s+[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,35}\b/gi
};

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
  '+': 't',
  '(': 'c',
  'v': 'u'
};

/**
 * Tabla de reemplazos de homóglifos Unicode (caracteres cirílicos o griegos que emulan latinos)
 */
const MAPA_HOMOGLIFOS = {
  'а': 'a', // cirílico a
  'е': 'e', // cirílico e
  'о': 'o', // cirílico o
  'р': 'p', // cirílico er
  'с': 'c', // cirílico es
  'у': 'y', // cirílico u
  'і': 'i', // cirílico i
  'ї': 'i'
};

/**
 * Normaliza un texto para inspección determinista:
 * 1. Pasa a minúsculas y elimina diacríticos/tildes.
 * 2. Reemplaza homóglifos Unicode y sustituciones numéricas/símbolos (Leetspeak).
 * 3. Colapsa letras repetidas innecesarias (ej. "puuuutaaaa" -> "puta").
 * 4. Remueve separadores intercalados intencionales (ej. "p.u.t.a", "p-u-t-a", "p u t a" -> "puta").
 * 
 * @param {string} texto
 * @returns {{ textoOriginal: string, textoNormalizado: string, textoDesofuscado: string }}
 */
export function normalizarTextoModeracion(texto) {
  if (!texto || typeof texto !== 'string') {
    return { textoOriginal: '', textoNormalizado: '', textoDesofuscado: '' };
  }

  const textoOriginal = texto.trim();

  // 1. Minúsculas y normalización de tildes
  let norm = textoOriginal
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 2. Homóglifos Unicode
  let sinHomoglifos = norm.split('').map(ch => MAPA_HOMOGLIFOS[ch] || ch).join('');

  // 3. Traducción Leetspeak
  let leet = sinHomoglifos.split('').map(ch => MAPA_LEETSPEAK[ch] || ch).join('');

  // 4. Colapso de letras repetidas más de 2 veces (ej. "puuuuutaaa" -> "puutaa")
  let colapsado = leet.replace(/([a-z])\1{2,}/g, '$1$1');
  // Colapso adicional para casos agresivos ("puuuuuta" -> "puta")
  let colapsadoSimple = leet.replace(/([a-z])\1+/g, '$1');

  // 5. Palabras con separadores entre letras (ej. "p.u.t.a", "p u t a", "m a l p a r i d o", "p-u-t-a", "p_u_t_a")
  let sinSeparadores = colapsado.replace(/(^|[^a-z])((?:[a-z][.\-_/ ]){2,}[a-z])([^a-z]|$)/gi, (_m, antes, seq, despues) => {
    return (antes || '') + ' ' + seq.replace(/[.\-_/ ]+/g, '') + ' ' + (despues || '');
  });

  return {
    textoOriginal,
    textoNormalizado: norm,
    textoDesofuscado: `${colapsado} ${colapsadoSimple} ${sinSeparadores}`
  };
}

/**
 * Evalúa si un texto contiene datos personales de terceros protegidos por la Ley N.º 8968 (Regla 6).
 * @param {string} texto
 * @returns {{ detectados: boolean, hallazgos: object, textoEnmascarado: string }}
 */
export function detectarDatosPersonales(texto) {
  if (!texto || typeof texto !== 'string') {
    return { detectados: false, hallazgos: { cedulas: 0, telefonos: 0, correos: 0, direcciones: 0 }, textoEnmascarado: '' };
  }

  let textoEnmascarado = texto;
  let countTelefonos = 0;
  let countCedulas = 0;
  let countCorreos = 0;
  let countDirecciones = 0;

  // 1. Correos
  textoEnmascarado = textoEnmascarado.replace(REGEX_DATOS_PERSONALES.correo, () => {
    countCorreos++;
    return '[CORREO OCULTO]';
  });

  // 2. Cédulas con guiones/espacios
  textoEnmascarado = textoEnmascarado.replace(REGEX_DATOS_PERSONALES.cedulaCR, () => {
    countCedulas++;
    return '[CÉDULA OCULTA]';
  });

  // Cédulas continuas
  textoEnmascarado = textoEnmascarado.replace(REGEX_DATOS_PERSONALES.cedulaContinuaCR, () => {
    countCedulas++;
    return '[CÉDULA OCULTA]';
  });

  // DIMEX
  textoEnmascarado = textoEnmascarado.replace(REGEX_DATOS_PERSONALES.dimex, () => {
    countCedulas++;
    return '[DIMEX OCULTO]';
  });

  // 3. Teléfonos
  textoEnmascarado = textoEnmascarado.replace(REGEX_DATOS_PERSONALES.telefonoCR, () => {
    countTelefonos++;
    return '[TELÉFONO OCULTO]';
  });

  // 4. Direcciones exactas residenciales
  textoEnmascarado = textoEnmascarado.replace(REGEX_DATOS_PERSONALES.direccionResidencial, () => {
    countDirecciones++;
    return '[DIRECCIÓN PRIVADA OCULTA]';
  });

  const total = countTelefonos + countCedulas + countCorreos + countDirecciones;

  return {
    detectados: total > 0,
    hallazgos: {
      cedulas: countCedulas,
      telefonos: countTelefonos,
      correos: countCorreos,
      direcciones: countDirecciones,
      total
    },
    textoEnmascarado
  };
}

/**
 * Analizador determinista local sin red (Capa 1).
 * Detecta infracciones evidentes (Reglas 3, 4, 5 y 6) con protección ante el efecto Scunthorpe.
 * 
 * @param {string} texto
 * @returns {object} Resultado del análisis
 */
export function analizarTextoLocal(texto) {
  if (!texto || !texto.trim()) {
    return {
      infraccion: false,
      reglasInfringidas: [],
      gravedad: GRAVEDAD.NINGUNA,
      categorias: [],
      palabrasDetectadas: [],
      razon: 'Texto vacío.',
      scoreToxicidad: 0,
      seguroBloquear: false,
      datosPersonales: { detectados: false, hallazgos: {} },
      textoEnmascarado: ''
    };
  }

  // 1. Inspección de datos personales (Regla 6)
  const resDatosPersonales = detectarDatosPersonales(texto);

  const { textoOriginal, textoNormalizado, textoDesofuscado } = normalizarTextoModeracion(texto);

  // Desglose de tokens para verificar lista blanca y prevenir falsos positivos
  const tokensTexto = textoNormalizado
    .replace(/[^a-z0-9áéíóúñü]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const categoriasEncontradas = new Set();
  const palabrasEncontradas = new Set();
  const reglasEncontradas = new Set();
  let maxGravedad = GRAVEDAD.NINGUNA;
  let razonDeterminada = '';
  let scoreEstimado = 0;

  // Si hubo datos personales, registrar de una vez Regla 6
  if (resDatosPersonales.detectados) {
    categoriasEncontradas.add('datos_personales');
    reglasEncontradas.add(6);
    maxGravedad = GRAVEDAD.GRAVE;
    scoreEstimado = Math.max(scoreEstimado, 85);
    razonDeterminada = 'Publicación de datos personales privados de terceros sin autorización (Regla 6 - Ley N.º 8968).';
  }

  // 2. Inspección del diccionario de bloqueo directo
  for (const item of BLOQUEO_DIRECTO) {
    const matchNorm = textoNormalizado.match(item.patron);
    const matchDesof = textoDesofuscado.match(item.patron);
    const matchOrig = textoOriginal.match(item.patron);

    const match = matchNorm || matchDesof || matchOrig;
    if (match) {
      const terminoDetectado = match[0].trim().toLowerCase();

      // Verificar si el término coincide o forma parte legítima de la lista blanca
      const esFalsoPositivo = tokensTexto.some(tok => {
        if (LISTA_BLANCA_CIVICA.has(tok)) {
          return tok.includes(terminoDetectado);
        }
        return false;
      });

      if (!esFalsoPositivo) {
        categoriasEncontradas.add(item.categoria);
        palabrasEncontradas.add(terminoDetectado);
        reglasEncontradas.add(item.regla);

        if (!razonDeterminada) {
          razonDeterminada = item.razon;
        }

        // Asignación de severidad máxima
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
    reglasInfringidas: Array.from(reglasEncontradas),
    gravedad: maxGravedad,
    categorias: Array.from(categoriasEncontradas),
    palabrasDetectadas: Array.from(palabrasEncontradas),
    razon: razonDeterminada || (tieneInfraccion ? 'Contenido contrario a las reglas cívicas del foro.' : 'Contenido apto para publicación.'),
    scoreToxicidad: scoreEstimado,
    seguroBloquear: tieneInfraccion && (maxGravedad === GRAVEDAD.GRAVE || maxGravedad === GRAVEDAD.MEDIA || maxGravedad === GRAVEDAD.LEVE),
    datosPersonales: resDatosPersonales,
    textoEnmascarado: resDatosPersonales.textoEnmascarado
  };
}
