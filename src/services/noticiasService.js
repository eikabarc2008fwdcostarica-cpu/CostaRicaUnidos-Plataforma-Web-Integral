import { obtenerNombrePublico } from '../utils/privacyUtils';

/**
 * Servicio API para "Noticias y Comunicados Municipales" (Módulo 01)
 * Control de Acceso Basado en Roles (RBAC) y persistencia en tiempo real en db.json
 */

const API_BASE_URL = '/api/noticias';

let _noticiasCache = null;
const listeners = new Set();

export function suscribirCambiosNoticias(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notificarCambios(noticias) {
  _noticiasCache = noticias;
  listeners.forEach((cb) => {
    try {
      cb(noticias);
    } catch (e) {
      console.error('[noticiasService] Error en listener:', e);
    }
  });
}

/**
 * Validador helper para rol de Editor Municipal (RBAC)
 */
export function esEditorMunicipal(user) {
  if (!user) return false;
  const rol = String(user.rol || user.role || '').toLowerCase().trim();
  return (
    rol.includes('editor municipal') ||
    rol === 'editor_muni' ||
    rol === 'editormunicipal' ||
    rol.includes('super administrador') ||
    rol.includes('administrador provincial') ||
    (user.nivelAcceso >= 3 && rol.includes('editor'))
  );
}

/**
 * Obtener lista de noticias con filtros opcionales y paginación
 * @param {Object} filtros - { canton, provincia, categoria, id, busqueda, q, _page, _limit }
 */
export async function obtenerNoticias(filtros = {}) {
  try {
    const params = new URLSearchParams();
    if (filtros.canton && filtros.canton !== 'todos' && filtros.canton !== 'TODOS') {
      params.append('canton', filtros.canton);
    }
    if (filtros.provincia && filtros.provincia !== 'todas' && filtros.provincia !== 'TODAS') {
      params.append('provincia', filtros.provincia);
    }
    if (filtros.categoria && filtros.categoria !== 'todas' && filtros.categoria !== 'TODAS') {
      params.append('categoria', filtros.categoria);
    }
    if (filtros.busqueda || filtros.q) {
      params.append('q', filtros.busqueda || filtros.q);
    }
    if (filtros._page) {
      params.append('_page', String(filtros._page));
    }
    if (filtros._limit) {
      params.append('_limit', String(filtros._limit));
    }
    if (filtros.id) {
      params.append('id', filtros.id);
    }

    const query = params.toString();
    const url = query ? `${API_BASE_URL}?${query}` : API_BASE_URL;

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const totalHeader = res.headers.get('X-Total-Count');
    const data = await res.json();
    if (Array.isArray(data)) {
      if (!filtros._page || filtros._page === 1) {
        _noticiasCache = data;
      }
      const resultArr = [...data];
      resultArr.total = totalHeader ? parseInt(totalHeader, 10) : data.length;
      return resultArr;
    }
    const empty = [];
    empty.total = 0;
    return empty;
  } catch (err) {
    console.warn('[noticiasService] Fallo al consultar API, usando caché:', err);
    if (_noticiasCache) {
      const cached = [..._noticiasCache];
      cached.total = _noticiasCache.length;
      return cached;
    }
    const fallbackEmpty = [];
    fallbackEmpty.total = 0;
    return fallbackEmpty;
  }
}

/**
 * Helper explícito para paginación continua en el feed social
 */
export async function obtenerNoticiasPaginadas(filtros = {}) {
  const result = await obtenerNoticias(filtros);
  return {
    data: result,
    total: result.total !== undefined ? result.total : result.length,
    hasMore: (filtros._page || 1) * (filtros._limit || 5) < (result.total || result.length)
  };
}

/**
 * Obtener una noticia específica por ID
 */
export async function obtenerNoticiaPorId(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[noticiasService] Error al obtener noticia:', err);
    return null;
  }
}

/**
 * Crear un comunicado oficial (Exclusivo Editor Municipal)
 */
export async function crearNoticia(noticiaData, user) {
  if (!esEditorMunicipal(user)) {
    throw new Error('Acceso Denegado (RBAC): Se requiere rol de "Editor Municipal" para publicar comunicados.');
  }

  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-User-Role': user.rol || 'Editor Municipal',
        'X-User-Cedula': user.cedula || ''
      },
      body: JSON.stringify({
        ...noticiaData,
        autorNombre: user.nombre || noticiaData.autorNombre || 'Editor Municipal',
        autorRol: 'Editor Municipal',
        autorCedula: user.cedula || noticiaData.autorCedula || ''
      })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Error al crear comunicado (${res.status})`);
    }

    const created = await res.json();
    obtenerNoticias({}).then(notificarCambios).catch(() => {});
    return created;
  } catch (err) {
    console.error('[noticiasService] Error creando noticia:', err);
    throw err;
  }
}

/**
 * Modificar un comunicado existente (Exclusivo Editor Municipal)
 */
export async function actualizarNoticia(id, noticiaData, user) {
  if (!esEditorMunicipal(user)) {
    throw new Error('Acceso Denegado (RBAC): Se requiere rol de "Editor Municipal" para modificar comunicados.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-User-Role': user.rol || 'Editor Municipal',
        'X-User-Cedula': user.cedula || ''
      },
      body: JSON.stringify({
        ...noticiaData,
        solicitanteRol: user.rol || 'Editor Municipal'
      })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Error al actualizar comunicado (${res.status})`);
    }

    const updated = await res.json();
    obtenerNoticias({}).then(notificarCambios).catch(() => {});
    return updated;
  } catch (err) {
    console.error('[noticiasService] Error actualizando noticia:', err);
    throw err;
  }
}

/**
 * Eliminar / dar de baja un comunicado (Exclusivo Editor Municipal)
 */
export async function eliminarNoticia(id, user) {
  if (!esEditorMunicipal(user)) {
    throw new Error('Acceso Denegado (RBAC): Se requiere rol de "Editor Municipal" para eliminar comunicados.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'X-User-Role': user.rol || 'Editor Municipal'
      }
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Error al eliminar comunicado (${res.status})`);
    }

    const result = await res.json();
    obtenerNoticias({}).then(notificarCambios).catch(() => {});
    return result;
  } catch (err) {
    console.error('[noticiasService] Error eliminando noticia:', err);
    throw err;
  }
}

/**
 * Reaccionar a un comunicado (apoyo, interesante, alerta) — Ciudadano autenticado
 */
export async function reaccionarNoticia(id, tipoReaccion, user) {
  if (!user) {
    throw new Error('AUTENTICACION_REQUERIDA');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        action: 'reaccionar',
        tipoReaccion, // 'apoyo' | 'interesante' | 'alerta'
        cedula: user.cedula || ''
      })
    });

    if (!res.ok) {
      throw new Error(`Error al emitir reacción (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.error('[noticiasService] Error al reaccionar:', err);
    throw err;
  }
}

/**
 * Agregar un comentario ciudadano a un comunicado — Ciudadano autenticado
 */
export async function agregarComentarioNoticia(id, comentarioData, user) {
  if (!user) {
    throw new Error('AUTENTICACION_REQUERIDA');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        action: 'comentar',
        comentario: {
          autorNombre: user.nombre || comentarioData.autorNombre || 'Ciudadano',
          autorCedula: user.cedula || comentarioData.autorCedula || '',
          contenido: comentarioData.contenido
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Error al publicar comentario (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.error('[noticiasService] Error comentando en noticia:', err);
    throw err;
  }
}
