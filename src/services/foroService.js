/**
 * Servicio API para "Foro Tico" (Participación Ciudadana - M04)
 * Conexión y persistencia en tiempo real contra db.json vía Vite JSON DB Server
 */

const API_BASE_URL = '/api/foro_posts';

// Fallback en memoria en caso de fallo de red puntual
let _postsCache = null;

// Lista de oyentes para sincronización en tiempo real en la pestaña
const listeners = new Set();

export function suscribirCambiosForo(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notificarCambios(posts) {
  _postsCache = posts;
  listeners.forEach((cb) => {
    try {
      cb(posts);
    } catch (e) {
      console.error('[foroService] Error en listener:', e);
    }
  });
}

/**
 * Obtener publicaciones.
 * @param {string} provinciaId - 'nacional' para todo el país, o el ID de la provincia ('san-jose', 'alajuela', 'cartago', etc.)
 */
export async function obtenerPosts(provinciaId = 'nacional') {
  try {
    let url = API_BASE_URL;
    if (provinciaId && provinciaId !== 'todas' && provinciaId !== 'all') {
      url += `?provinciaId=${encodeURIComponent(provinciaId)}`;
    }

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      _postsCache = data;
      return data;
    }
    return [];
  } catch (err) {
    console.warn('[foroService] Fallo al consultar API, usando caché:', err);
    if (_postsCache) {
      if (provinciaId && provinciaId !== 'todas' && provinciaId !== 'all') {
        return _postsCache.filter(
          (p) => String(p.provinciaId || '').toLowerCase() === provinciaId.toLowerCase()
        );
      }
      return _postsCache;
    }
    return [];
  }
}

/**
 * Obtener una publicación específica por su ID
 */
export async function obtenerPostPorId(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[foroService] Error obteniendo post:', err);
    return null;
  }
}

/**
 * Crear una nueva publicación en el foro
 */
export async function crearPost(postData, user = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (user) {
      if (user.rol) headers['X-User-Role'] = user.rol;
      if (user.canton) headers['X-User-Canton'] = user.canton;
      if (user.cedula) headers['X-User-Cedula'] = user.cedula;
    }

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(postData)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear publicación (${res.status})`);
    }

    const createdPost = await res.json();
    // Refrescar y notificar
    obtenerPosts('nacional').then(notificarCambios).catch(() => {});
    return createdPost;
  } catch (err) {
    console.error('[foroService] Error creando post:', err);
    throw err;
  }
}

/**
 * Emitir voto (like / dislike) con prevención de votos duplicados por cédula
 */
export async function votarPost(postId, tipoVoto, usuarioCedula) {
  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(postId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        action: 'votar',
        tipoVoto, // 'like' | 'dislike'
        cedula: usuarioCedula
      })
    });

    if (!res.ok) {
      throw new Error(`Error al emitir voto (${res.status})`);
    }

    const updatedPost = await res.json();
    return updatedPost;
  } catch (err) {
    console.error('[foroService] Error votando post:', err);
    throw err;
  }
}

/**
 * Emitir reacción (apoyo, urgente, idea)
 */
export async function reaccionarPost(postId, tipoReaccion, usuarioCedula) {
  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(postId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        action: 'reaccionar',
        tipoReaccion, // 'apoyo' | 'urgente' | 'idea'
        cedula: usuarioCedula
      })
    });

    if (!res.ok) {
      throw new Error(`Error al reaccionar (${res.status})`);
    }

    const updatedPost = await res.json();
    return updatedPost;
  } catch (err) {
    console.error('[foroService] Error reaccionando:', err);
    throw err;
  }
}

/**
 * Agregar un comentario a una publicación
 */
export async function agregarComentario(postId, comentarioData, user = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (user) {
      if (user.rol) headers['X-User-Role'] = user.rol;
      if (user.canton) headers['X-User-Canton'] = user.canton;
      if (user.cedula) headers['X-User-Cedula'] = user.cedula;
    }

    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(postId)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        action: 'comentar',
        comentario: comentarioData // { autorNombre, autorCedula, contenido }
      })
    });

    if (!res.ok) {
      throw new Error(`Error al agregar comentario (${res.status})`);
    }

    const updatedPost = await res.json();
    return updatedPost;
  } catch (err) {
    console.error('[foroService] Error comentando:', err);
    throw err;
  }
}

/**
 * Actualizar una publicación del foro (editar, ocultar, archivar)
 */
export async function actualizarPost(postId, postData, user = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (user) {
      if (user.rol) headers['X-User-Role'] = user.rol;
      if (user.canton) headers['X-User-Canton'] = user.canton;
      if (user.cedula) headers['X-User-Cedula'] = user.cedula;
    }

    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(postId)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        action: 'editar',
        ...postData
      })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Error actualizando publicación (${res.status})`);
    }

    const updated = await res.json();
    obtenerPosts('nacional').then(notificarCambios).catch(() => {});
    return updated;
  } catch (err) {
    console.error('[foroService] Error actualizando post:', err);
    throw err;
  }
}

/**
 * Eliminar una publicación (para autor, encargado municipal de su cantón o administradores)
 */
export async function eliminarPost(postId, user = null) {
  try {
    const headers = { Accept: 'application/json' };
    if (user) {
      if (user.rol) headers['X-User-Role'] = user.rol;
      if (user.canton) headers['X-User-Canton'] = user.canton;
      if (user.cedula) headers['X-User-Cedula'] = user.cedula;
    }

    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(postId)}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `HTTP ${res.status}`);
    }
    const result = await res.json();
    obtenerPosts('nacional').then(notificarCambios).catch(() => {});
    return result;
  } catch (err) {
    console.error('[foroService] Error eliminando post:', err);
    throw err;
  }
}
