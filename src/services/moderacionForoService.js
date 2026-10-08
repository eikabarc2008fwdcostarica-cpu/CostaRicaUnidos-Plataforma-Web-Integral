/**
 * ============================================================================
 * COSTA RICA UNIDOS — SUPERVISOR IA DEL FORO TICO (M04)
 * Orquestador de Moderación Soberana en Dos Capas (Local + Gemini)
 * ============================================================================
 * 
 * Capa 1: Filtro local determinista (sin red, desofuscación, lista blanca cívica).
 * Capa 2: Gemini 2.0 / 1.5 Flash con contexto cívico, defensa contra inyección de
 *         prompt, respuesta en JSON estricto, tolerancia a fallos y respeto
 *         irrestricto a la privacidad (Ley N° 8968: nunca se envía PII a la IA).
 */

import { getGeminiApiKey, GEMINI_MODELS, GEMINI_API_BASE } from './geminiService.js';
import { analizarTextoLocal } from '../config/lexicoModeracion.js';
import {
  calcularSancion,
  GRAVEDAD,
  TIPO_SANCION,
  haAceptadoReglas
} from '../config/reglasForo.js';
import { PROMPT_SISTEMA_MODERACION, construirPromptUsuarioModeracion } from '../config/promptsModeracion.js';
import { obtenerMotivoAmableRegla, REGLAS_COMUNIDAD } from '../config/reglasComunidad.js';

/**
 * Obtiene la configuración de gobernanza de IA desde storage o defaults cívicos
 */
function obtenerConfiguracionIA() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('cr_config_ia') || localStorage.getItem('configuracionIA');
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return { killSwitchActivo: false, sensibilidadModeracion: 'MODERADA' };
}

// Timeouts y presupuestos para Capa 2
const TIMEOUT_POR_MODELO_MS = 8000;
const PRESUPUESTO_TOTAL_MS = 15000;

/**
 * Normaliza y valida estrictamente una respuesta JSON devuelta por Gemini
 */
function parsearRespuestaGeminiDefensiva(textoRespuesta, modelName = 'gemini-2.5-flash') {
  if (!textoRespuesta || typeof textoRespuesta !== 'string') {
    throw new Error('Respuesta de Gemini vacía');
  }

  // Quitar delimitadores de código markdown si los hay
  let limpio = textoRespuesta.trim();
  if (limpio.startsWith('```json')) {
    limpio = limpio.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  } else if (limpio.startsWith('```')) {
    limpio = limpio.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  }

  // Buscar el primer '{' y el último '}'
  const primerBrace = limpio.indexOf('{');
  const ultimoBrace = limpio.lastIndexOf('}');
  if (primerBrace !== -1 && ultimoBrace !== -1 && ultimoBrace > primerBrace) {
    limpio = limpio.substring(primerBrace, ultimoBrace + 1);
  }

  const parseado = JSON.parse(limpio);

  const veredictoNorm = ['permitido', 'revisar', 'infractor'].includes(String(parseado.veredicto).toLowerCase())
    ? String(parseado.veredicto).toLowerCase()
    : (parseado.infraccion ? 'infractor' : 'permitido');

  const reglasInfringidas = Array.isArray(parseado.reglasInfringidas)
    ? parseado.reglasInfringidas.map(Number).filter((n) => !isNaN(n) && n >= 1 && n <= 6)
    : [];

  const severidadNorm = ['NINGUNA', 'BAJA', 'MEDIA', 'ALTA'].includes(String(parseado.severidad || parseado.gravedad).toUpperCase())
    ? String(parseado.severidad || parseado.gravedad).toUpperCase()
    : (veredictoNorm === 'infractor' ? 'MEDIA' : 'NINGUNA');

  const gravedadMapeada = {
    'NINGUNA': GRAVEDAD.NINGUNA,
    'BAJA': GRAVEDAD.LEVE,
    'MEDIA': GRAVEDAD.MEDIA,
    'ALTA': GRAVEDAD.GRAVE
  }[severidadNorm] || (veredictoNorm === 'infractor' ? GRAVEDAD.MEDIA : GRAVEDAD.NINGUNA);

  const infraccion = veredictoNorm === 'infractor' || (veredictoNorm === 'revisar' && severidadNorm !== 'NINGUNA');

  const palabrasOFrases = Array.isArray(parseado.palabrasOFrasesDetectadas)
    ? parseado.palabrasOFrasesDetectadas
    : (Array.isArray(parseado.palabrasDetectadas) ? parseado.palabrasDetectadas : []);

  const categoria = String(parseado.categoria || (infraccion ? 'infraccion' : 'ninguna')).toLowerCase();
  const motivo = String(parseado.motivo || parseado.razon || (infraccion ? 'Contenido no conforme a las reglas del foro' : 'Publicación cívica admisible')).trim();
  const confianza = typeof parseado.confianza === 'number' ? Math.max(0, Math.min(1, parseado.confianza)) : 0.9;

  return {
    veredicto: veredictoNorm,
    infraccion,
    gravedad: gravedadMapeada,
    severidad: severidadNorm,
    reglasInfringidas,
    categoria,
    categorias: [categoria],
    palabrasDetectadas: palabrasOFrases,
    palabrasOFrasesDetectadas: palabrasOFrases,
    scoreToxicidad: Math.round(confianza * 100),
    confianza,
    motivo,
    razon: motivo,
    textoSugerido: parseado.textoSugerido || null,
    modeloUsado: modelName
  };
}

/**
 * Consulta a Gemini mediante fallback dinámico entre modelos vigentes
 * @param {string} textoAnalizar - Solo el texto del usuario desprovisto de PII
 * @returns {Promise<object>} Veredicto en JSON
 */
async function consultarGeminiContextual(textoAnalizar) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('API Key de Gemini no disponible');
  }

  const promptUsuario = construirPromptUsuarioModeracion(textoAnalizar);

  const envModel = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL) || null;
  const modelosCandidatos = [
    ...(envModel && envModel.trim() ? [envModel.trim()] : []),
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro'
  ].filter((v, i, a) => a.indexOf(v) === i);

  const inicioMs = Date.now();
  let ultimoError = null;

  for (const model of modelosCandidatos) {
    const tiempoRestante = PRESUPUESTO_TOTAL_MS - (Date.now() - inicioMs);
    if (tiempoRestante <= 1000) break;

    const timeoutMs = Math.min(TIMEOUT_POR_MODELO_MS, tiempoRestante);

    // Permitir 1 reintento por modelo si hay error de formato JSON
    for (let intento = 0; intento < 2; intento++) {
      const tiempoRestanteIntento = PRESUPUESTO_TOTAL_MS - (Date.now() - inicioMs);
      if (tiempoRestanteIntento <= 1000) break;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Math.min(timeoutMs, tiempoRestanteIntento));

      try {
        const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;
        const thinkingConfig = model.includes('2.5') ? { thinkingBudget: 0 } : undefined;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: PROMPT_SISTEMA_MODERACION }]
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: promptUsuario }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
              maxOutputTokens: 2048,
              ...(thinkingConfig ? { thinkingConfig } : {})
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errDetalle = '';
          try {
            const errJson = await response.json();
            errDetalle = errJson?.error?.message || response.statusText;
          } catch {
            errDetalle = response.statusText;
          }
          throw new Error(`HTTP ${response.status} (${errDetalle}) en modelo ${model}`);
        }

        const data = await response.json();

        // Si los filtros de seguridad de Google bloquearon la respuesta, tratar como infracción grave (Regla 5)
        const promptFeedback = data?.promptFeedback;
        if (promptFeedback?.blockReason) {
          return {
            veredicto: 'infractor',
            infraccion: true,
            gravedad: GRAVEDAD.GRAVE,
            severidad: 'ALTA',
            reglasInfringidas: [5],
            categoria: 'amenaza',
            categorias: ['amenaza'],
            palabrasDetectadas: ['[BLOQUEADO_POR_FILTRO_SEGURIDAD]'],
            palabrasOFrasesDetectadas: ['[BLOQUEADO_POR_FILTRO_SEGURIDAD]'],
            scoreToxicidad: 100,
            confianza: 1.0,
            motivo: 'Contenido clasificado como extremadamente violento o peligroso por filtros de seguridad.',
            razon: 'Contenido clasificado como extremadamente violento o peligroso por filtros de seguridad.',
            textoSugerido: null,
            modeloUsado: model
          };
        }

        const candidate = data?.candidates?.[0];
        if (candidate?.finishReason === 'SAFETY') {
          return {
            veredicto: 'infractor',
            infraccion: true,
            gravedad: GRAVEDAD.GRAVE,
            severidad: 'ALTA',
            reglasInfringidas: [5],
            categoria: 'amenaza',
            categorias: ['amenaza'],
            palabrasDetectadas: ['[BLOQUEADO_POR_FILTRO_SEGURIDAD]'],
            palabrasOFrasesDetectadas: ['[BLOQUEADO_POR_FILTRO_SEGURIDAD]'],
            scoreToxicidad: 100,
            confianza: 1.0,
            motivo: 'Contenido catalogado como peligroso o violento.',
            razon: 'Contenido catalogado como peligroso o violento.',
            textoSugerido: null,
            modeloUsado: model
          };
        }

        const rawText = candidate?.content?.parts?.[0]?.text;
        if (!rawText || !rawText.trim()) {
          const finishReason = candidate?.finishReason || 'SIN_TEXTO';
          throw new Error(`Respuesta vacía de ${model} (finishReason: ${finishReason})`);
        }

        return parsearRespuestaGeminiDefensiva(rawText, model);
      } catch (err) {
        clearTimeout(timeoutId);
        const esAbort = err.name === 'AbortError' || err.message?.includes('aborted');
        ultimoError = esAbort
          ? new Error(`Timeout de ${timeoutMs}ms agotado al consultar ${model}`)
          : err;

        // Si es 404 de modelo obsoleto, no perder tiempo con reintentos en este modelo
        if (err.message && err.message.includes('404')) {
          break;
        }
      }
    }
  }

  throw ultimoError || new Error('Fallo al consultar modelos Gemini');
}

/**
 * Orquestador Principal de Moderación del Foro Tico
 * Ejecuta Capa 1 y Capa 2 respetando sensibilidad, roles y privacidad.
 * 
 * @param {object} params
 * @param {string} params.titulo - Título opcional de la publicación
 * @param {string} params.contenido - Contenido de la publicación o comentario
 * @param {object} params.autor - Objeto de usuario autenticado
 * @param {string} params.tipo - 'publicacion' | 'comentario'
 * @returns {Promise<object>} Resultado de moderación y sanción si aplica
 */
export async function inspeccionarContenidoForo({
  titulo = '',
  contenido = '',
  autor = null,
  tipo = 'publicacion'
}) {
  const textoCompleto = `${titulo ? titulo + '\n' : ''}${contenido}`.trim();

  if (!textoCompleto) {
    return {
      bloqueado: false,
      resultadoModeracion: {
        infraccion: false,
        gravedad: GRAVEDAD.NINGUNA,
        categorias: [],
        palabrasDetectadas: [],
        scoreToxicidad: 0,
        razon: 'Texto vacío'
      },
      capaEjecutada: 'NINGUNA'
    };
  }

  // 1. CAPA 1: FILTRO LOCAL DETERMINISTA (SIN RED)
  const veredictoLocal = analizarTextoLocal(textoCompleto);

  // Leer configuración de Gobernanza de IA
  let configIA = null;
  try {
    configIA = obtenerConfiguracionIA();
  } catch (_e) {
    configIA = { killSwitchActivo: false, sensibilidadModeracion: 'MODERADA' };
  }

  const killSwitchActivo = Boolean(configIA?.killSwitchActivo);
  const sensibilidad = String(configIA?.sensibilidadModeracion || 'MODERADA').toUpperCase();

  let veredictoFinal = { ...veredictoLocal };
  let capaFinal = 'LOCAL_CAPA_1';
  let modeloFinal = 'Filtro Determinista Capa 1';
  let errorIAFinal = null;

  // Si la Capa 1 detecta una infracción GRAVE o MEDIA con certeza evidente,
  // bloquea directamente sin consumir cuota de red.
  const bloqueoDeterministaCierto =
    veredictoLocal.infraccion &&
    (veredictoLocal.gravedad === GRAVEDAD.GRAVE || veredictoLocal.gravedad === GRAVEDAD.MEDIA);

  // 2. CAPA 2: GEMINI CON CONTEXTO
  // Solo se invoca si Capa 1 no bloquea con certeza y el Kill-Switch no está activo
  if (!bloqueoDeterministaCierto && !killSwitchActivo) {
    try {
      // Para respetar la Ley N.º 8968, se envía el texto con datos personales ya enmascarados si los hubiera
      const textoParaIA = veredictoLocal.textoEnmascarado || textoCompleto;
      const veredictoGemini = await consultarGeminiContextual(textoParaIA);
      veredictoFinal = veredictoGemini;
      capaFinal = 'GEMINI_CAPA_2';
      modeloFinal = veredictoGemini.modeloUsado || 'Gemini 2.5 Flash';

      // Si Capa 1 detectó palabras o datos adicionales, fusionar hallazgos
      if (veredictoLocal.palabrasDetectadas?.length > 0) {
        const combinadas = Array.from(
          new Set([...veredictoFinal.palabrasDetectadas, ...veredictoLocal.palabrasDetectadas])
        );
        veredictoFinal.palabrasDetectadas = combinadas;
      }
    } catch (geminiErr) {
      // Tolerancia a fallos: Si Gemini falla, no hay clave o da timeout,
      // se utiliza solo la Capa 1 y el contenido NO se bloquea por el fallo de la API.
      console.warn('[ModeracionForo] Capa 2 no disponible o timeout, fallback a Capa 1:', geminiErr.message);
      veredictoFinal = veredictoLocal;
      capaFinal = 'FALLBACK_CAPA_1';
      modeloFinal = 'Ninguno (Fallo Capa 2)';
      errorIAFinal = geminiErr.message;
    }
  }

  // Unificar reglas infringidas detectadas por ambas capas
  const reglasCombinadas = Array.from(
    new Set([
      ...(Array.isArray(veredictoFinal.reglasInfringidas) ? veredictoFinal.reglasInfringidas : []),
      ...(Array.isArray(veredictoLocal.reglasInfringidas) ? veredictoLocal.reglasInfringidas : [])
    ])
  );
  veredictoFinal.reglasInfringidas = reglasCombinadas;

  // 3. APLICACIÓN DE LA SENSIBILIDAD CONFIGURADA
  if (veredictoFinal.infraccion) {
    if (sensibilidad === 'FLEXIBLE') {
      // En modo FLEXIBLE solo se sancionan infracciones GRAVES o medias con toxicidad alta (>= 75)
      if (veredictoFinal.gravedad === GRAVEDAD.LEVE || (veredictoFinal.gravedad === GRAVEDAD.MEDIA && (veredictoFinal.scoreToxicidad || 0) < 75)) {
        veredictoFinal.infraccion = false;
        veredictoFinal.gravedad = GRAVEDAD.NINGUNA;
        veredictoFinal.razon = 'Infracción leve tolerada bajo sensibilidad flexible.';
      }
    } else if (sensibilidad === 'MODERADA') {
      // En modo MODERADA: leve es advertencia formativa, media/grave es sanción temporal
    } else if (sensibilidad === 'ESTRICTA') {
      // En modo ESTRICTA: sanciona desde nivel leve
    }
  }

  // Generar motivo pedagógico y amable según la regla infringida sin repetir insultos ni datos
  if (veredictoFinal.infraccion && reglasCombinadas.length > 0) {
    veredictoFinal.razon = obtenerMotivoAmableRegla(reglasCombinadas);
  }

  // Si no hay infracción, permitir publicación inmediata
  if (!veredictoFinal.infraccion || veredictoFinal.gravedad === GRAVEDAD.NINGUNA) {
    return {
      bloqueado: false,
      resultadoModeracion: veredictoFinal,
      capaEjecutada: capaFinal,
      modeloIA: modeloFinal,
      errorIA: errorIAFinal
    };
  }

  // 4. SISTEMA DE SANCIONES Y EVALUACIÓN DE ROL
  // Solo se banean Ciudadano y Comerciante. Super Admin y Gestor Territorial
  // no se banean automáticamente: sus infracciones solo generan registro para revisión.
  const rolStr = String(autor?.rol || autor?.rolOficial || '').toLowerCase();
  const nivelAcceso = Number(autor?.nivelAcceso || 2);
  const esPersonalExento =
    nivelAcceso >= 4 ||
    rolStr.includes('super admin') ||
    rolStr.includes('superadministrador') ||
    rolStr.includes('gestor') ||
    rolStr.includes('auditor');

  // Obtener strikes previos del usuario
  const historialStrikes = autor?.sancion?.strikes || 0;
  const sancionCalculada = calcularSancion(historialStrikes, veredictoFinal.gravedad);

  const incidente = {
    id: `MOD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    tipoContenido: tipo === 'comentario' ? 'COMENTARIO' : 'PUBLICACION_FORO',
    motivo: veredictoFinal.categorias[0] || 'LENGUAJE_INAPROPIADO',
    textoOriginal: textoCompleto,
    autorId: autor?.id || 'USR-ANON',
    autorCedula: autor?.cedula ? '[CÉDULA PROTEGIDA / LEY 8968]' : 'No especificada',
    autorNombre: autor?.nombre || 'Ciudadano',
    autorRol: autor?.rol || 'Ciudadano',
    moduloOrigen: 'M04_FORO_TICO',
    fechaReporte: new Date().toISOString(),
    scoreToxicidadIA: veredictoFinal.scoreToxicidad,
    categorias: veredictoFinal.categorias,
    gravedad: veredictoFinal.gravedad,
    reglasInfringidas: reglasCombinadas,
    palabrasDetectadas: veredictoFinal.palabrasDetectadas,
    razonIA: veredictoFinal.razon,
    capaEjecutada: capaFinal,
    modeloIA: modeloFinal,
    errorIA: errorIAFinal,
    sancionAplicada: esPersonalExento ? 'REGISTRO_SUPERVISION' : sancionCalculada.tipoSancion,
    sancionFin: esPersonalExento ? null : sancionCalculada.finIso,
    estado: 'PENDIENTE_REVISION',
    esPersonalExento
  };

  // 5. REGISTRAR INCIDENTE EN COLA Y ACTUALIZAR SANCIONES
  await registrarIncidenteCola(incidente, autor, sancionCalculada, esPersonalExento);

  return {
    bloqueado: true,
    resultadoModeracion: veredictoFinal,
    sancion: sancionCalculada,
    esPersonalExento,
    incidenteId: incidente.id,
    capaEjecutada: capaFinal,
    modeloIA: modeloFinal,
    errorIA: errorIAFinal
  };
}

/**
 * Registra el incidente en db.json y localStorage para el Super Admin
 */
async function registrarIncidenteCola(incidente, autor, sancionCalculada, esPersonalExento) {
  try {
    // 1. Guardar en cola de moderación local (moderacionContenido)
    if (typeof localStorage !== 'undefined') {
      const colaLocal = (() => {
        try {
          const raw = localStorage.getItem('cr_db_moderacion') || localStorage.getItem('moderacionContenido');
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })();

      colaLocal.unshift(incidente);
      localStorage.setItem('moderacionContenido', JSON.stringify(colaLocal));
      localStorage.setItem('cr_db_moderacion', JSON.stringify(colaLocal));
    }

    // 2. Si no es personal exento y no es simple advertencia, registrar sanción en el usuario
    if (!esPersonalExento && autor) {
      const esBaneo = sancionCalculada.tipoSancion !== TIPO_SANCION.ADVERTENCIA;
      const nuevoStrike = (autor?.sancion?.strikes || 0) + 1;

      const nuevaSancionUsuario = {
        activa: esBaneo,
        nivel: sancionCalculada.tipoSancion,
        motivo: incidente.razonIA,
        inicio: sancionCalculada.inicioIso,
        fin: sancionCalculada.finIso,
        strikes: nuevoStrike,
        indefinida: sancionCalculada.indefinida
      };

      // Actualizar sesión actual
      if (typeof localStorage !== 'undefined') {
        try {
          const s1 = localStorage.getItem('cru_user_session');
          if (s1) {
            const u = JSON.parse(s1);
            if (u.id === autor.id || u.cedula === autor.cedula) {
              u.sancion = nuevaSancionUsuario;
              localStorage.setItem('cru_user_session', JSON.stringify(u));
            }
          }
          const s2 = localStorage.getItem('cr_sesion_activa');
          if (s2) {
            const u = JSON.parse(s2);
            if (u.id === autor.id || u.cedula === autor.cedula) {
              u.sancion = nuevaSancionUsuario;
              localStorage.setItem('cr_sesion_activa', JSON.stringify(u));
            }
          }
          // Base de usuarios local
          const rawUsers = localStorage.getItem('cr_db_usuarios');
          if (rawUsers) {
            const arr = JSON.parse(rawUsers);
            if (Array.isArray(arr)) {
              const idx = arr.findIndex((x) => x.id === autor.id || x.cedula === autor.cedula);
              if (idx !== -1) {
                arr[idx].sancion = nuevaSancionUsuario;
                localStorage.setItem('cr_db_usuarios', JSON.stringify(arr));
              }
            }
          }
        } catch (err) {
          console.warn('[ModeracionForo] Error actualizando sanción en storage local:', err);
        }
      }

      // Persistir sanción en API de usuarios si existe
      if (autor.id && typeof fetch !== 'undefined') {
        fetch(`/api/usuarios/${encodeURIComponent(autor.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sancion: nuevaSancionUsuario })
        }).catch(() => {});
      }
    }

    // 3. Registrar en historial de sanciones_foro (con cédula protegida bajo Ley N.º 8968)
    if (typeof localStorage !== 'undefined') {
      try {
        const regHistorial = {
          id: `SANC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          usuarioId: autor?.id,
          cedula: autor?.cedula ? '[CÉDULA PROTEGIDA / LEY 8968]' : 'No especificada',
          nombre: autor?.nombre,
          incidenteId: incidente.id,
          tipoSancion: sancionCalculada.tipoSancion,
          gravedad: incidente.gravedad,
          motivo: incidente.razonIA,
          capaEjecutada: incidente.capaEjecutada,
          fecha: new Date().toISOString(),
          fin: sancionCalculada.finIso
        };

        const rawSanciones = localStorage.getItem('cr_sanciones_foro');
        const listaSanciones = rawSanciones ? JSON.parse(rawSanciones) : [];
        listaSanciones.unshift(regHistorial);
        localStorage.setItem('cr_sanciones_foro', JSON.stringify(listaSanciones));
      } catch (_e) {}
    }
  } catch (err) {
    console.error('[ModeracionForo] Error registrando incidente de moderación:', err);
  }
}

/**
 * Permite al usuario solicitar una revisión humana ante el Super Administrador Nacional
 * @param {string} incidenteId
 * @param {string} justificacion
 */
export async function solicitarRevisionIncidente(incidenteId, justificacion) {
  try {
    const raw = localStorage.getItem('moderacionContenido');
    if (raw) {
      const items = JSON.parse(raw);
      const item = items.find((i) => i.id === incidenteId);
      if (item) {
        item.estado = 'PENDIENTE_REVISION';
        item.solicitudRevisionCiudadano = {
          fecha: new Date().toISOString(),
          justificacion: String(justificacion || '').trim()
        };
        localStorage.setItem('moderacionContenido', JSON.stringify(items));
        localStorage.setItem('cr_db_moderacion', JSON.stringify(items));
        return { success: true };
      }
    }
  } catch (err) {
    console.error('Error al solicitar revisión de incidente:', err);
  }
  return { success: false };
}
