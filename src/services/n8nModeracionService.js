/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE INTEGRACIÓN N8N (MODERACIÓN CÍVICA Y PRIVACIDAD)
 * Capa complementaria de blindaje de privacidad (Ley N.º 8968) y auditoría n8n
 * ============================================================================
 */

const N8N_WEBHOOK_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_MODERACION_WEBHOOK_URL) || null;

const N8N_WEBHOOK_SECRET =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_WEBHOOK_SECRET) || null;

// Timeout prudente para no degradar la experiencia de usuario
const N8N_TIMEOUT_MS = 6000;

/**
 * Envía una publicación o comentario al flujo de n8n de forma asíncrona y no bloqueante.
 * 
 * @param {Object} params
 * @param {'post' | 'comentario'} params.tipo - Tipo de contenido
 * @param {string} params.id - ID del post o comentario
 * @param {string} [params.postId] - ID del post padre si es un comentario
 * @param {string} params.texto - Contenido a inspeccionar
 * @param {string} params.autorId - Identificador interno del usuario (NUNCA cédula)
 * @param {string} [params.rolAutor] - Rol del autor para evaluar exención de sanción
 * @param {'nacional' | 'provincial'} [params.ambito] - Ámbito territorial
 * @param {string} [params.provincia] - Provincia asociada
 * @param {string} [params.canton] - Cantón asociado
 * @param {'pre' | 'post'} [params.momento] - Momento del ciclo de vida
 * @returns {Promise<{ ok: boolean, estado: 'activo' | 'revision' | 'oculto', textoFinal?: string, avisoPrivacidad?: boolean, omitido?: boolean }>}
 */
export async function enviarAModeracionN8n({
  tipo = 'post',
  id,
  postId,
  texto,
  autorId,
  rolAutor = 'Ciudadano',
  ambito = 'nacional',
  provincia = 'San José',
  canton = 'San José',
  momento = 'post'
}) {
  // Si la variable de entorno no está configurada, el servicio no hace nada y la app continúa normalmente
  if (!N8N_WEBHOOK_URL || !N8N_WEBHOOK_URL.trim()) {
    return {
      ok: true,
      estado: 'activo',
      omitido: true
    };
  }

  // Sanitización de seguridad: Verificar que nunca se envíe cédula como autorId
  const idSeguro = String(autorId || 'USR-ANON');
  const esFormatoCedula = /^\d{1,2}[-\s]?\d{4}[-\s]?\d{4}$/.test(idSeguro);
  const autorIdBlindado = esFormatoCedula ? 'USR-ID-INTERNO' : idSeguro;

  const payload = {
    tipo,
    id: String(id),
    postId: postId ? String(postId) : undefined,
    texto: String(texto || '').trim().slice(0, 5000),
    autorId: autorIdBlindado,
    rolAutor: String(rolAutor || 'Ciudadano'),
    ambito,
    provincia,
    canton,
    momento
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (N8N_WEBHOOK_SECRET && N8N_WEBHOOK_SECRET.trim()) {
      headers['x-webhook-secret'] = N8N_WEBHOOK_SECRET.trim();
    }

    const response = await fetch(N8N_WEBHOOK_URL.trim(), {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[n8nModeracionService] Webhook respondió con código HTTP ${response.status}`);
      return {
        ok: true,
        estado: 'activo',
        textoFinal: texto,
        avisoPrivacidad: false,
        errorHttp: response.status
      };
    }

    const data = await response.json();
    return {
      ok: Boolean(data.ok),
      estado: data.estado || 'activo',
      textoFinal: data.textoFinal || texto,
      avisoPrivacidad: Boolean(data.avisoPrivacidad)
    };
  } catch (err) {
    clearTimeout(timeoutId);
    // Errores a consola sin romper la UI ni bloquear al ciudadano
    console.error('[n8nModeracionService] Error de comunicación con n8n:', err.message);
    return {
      ok: true,
      estado: 'activo',
      textoFinal: texto,
      avisoPrivacidad: false,
      errorConexion: true
    };
  }
}
