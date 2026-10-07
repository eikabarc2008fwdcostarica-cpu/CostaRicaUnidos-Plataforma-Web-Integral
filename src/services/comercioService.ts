/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE GESTIÓN COMERCIAL, PUBLICACIONES Y PATENTES
 * Conexión física directa con middleware Vite / jsonDbServerPlugin
 * ============================================================================
 */

import { dbClient } from './dbClient';

export interface SolicitudComercioItem {
  id: string;
  usuarioId?: string;
  cedula?: string;
  cedulaJuridica?: string;
  nombreComercio?: string;
  nombreNegocio?: string;
  nombreSolicitante?: string;
  correoPersonal?: string;
  correoComercial?: string;
  actividadHacienda?: string;
  actividadEconomicaHacienda?: string;
  patenteCantonal?: string;
  categoria?: string;
  descripcion?: string;
  contacto?: string;
  canton?: string;
  distrito?: string;
  provincia?: string;
  sectorFeria?: string;
  sectorFeriaSolicitado?: string;
  fechaSolicitud?: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'pendiente' | 'aprobado' | 'rechazado';
  justificacion?: string;
  motivoRechazo?: string;
  notas?: string;
  verificadoHacienda?: boolean;
  verificado?: boolean;
  fechaResolucion?: string;
  asignacion?: string;
  detalleAsignacion?: string;
}

export interface PublicacionComercioItem {
  id: string;
  comercioId: string;
  usuarioId?: string;
  nombreComercio: string;
  nombreSolicitante?: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenUrl?: string;
  precio?: string;
  contacto?: string;
  canton?: string;
  provincia?: string;
  fechaPublicacion: string;
  fechaModificacion?: string;
  metricas: {
    vistas: number;
    likes: number;
    comentarios: number;
    contactos: number;
  };
}

export interface MetricasComercioResponse {
  publicacionesPorMes: Array<{
    clave: string;
    mesNombre: string;
    anio: number;
    cantidad: number;
    interacciones: number;
  }>;
  interaccionesPorPublicacion: Array<{
    id: string;
    titulo: string;
    vistas: number;
    likes: number;
    comentarios: number;
    contactos: number;
    totalInteracciones: number;
  }>;
  crecimiento: {
    periodo: '30d' | '6m' | '12m';
    publicaciones: {
      actual: number;
      anterior: number;
      variacion: number;
      tendencia: 'up' | 'down' | 'neutral';
      sinDatosPrevios: boolean;
    };
    interacciones: {
      actual: number;
      anterior: number;
      variacion: number;
      tendencia: 'up' | 'down' | 'neutral';
      sinDatosPrevios: boolean;
    };
    contactos: {
      actual: number;
      anterior: number;
      variacion: number;
      tendencia: 'up' | 'down' | 'neutral';
      sinDatosPrevios: boolean;
    };
    textoResumen: string;
  };
}

/**
 * Autenticación oficial para comerciantes aprobados con Nombre + Cédula (Ley N° 8968)
 */
export async function loginComercianteApi(nombreSolicitante: string, cedula: string): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  comercio?: any;
  message?: string;
  estado?: string;
  motivoRechazo?: string;
  bloqueado?: boolean;
  intentosRestantes?: number;
  segundosRestantes?: number;
}> {
  try {
    const res = await fetch('/api/comercio/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreSolicitante, cedula })
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('[comercioService] Error en loginComercianteApi:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor municipal. Verifique su red.'
    };
  }
}

/**
 * Obtener solicitudes comerciales para el panel de administración
 */
export async function obtenerSolicitudesComercioApi(): Promise<SolicitudComercioItem[]> {
  try {
    const res = await fetch('/api/solicitudesComercio');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (_e) {}

  // Fallback a json-server si estuviese en 3001
  try {
    const res = await fetch('http://localhost:3001/solicitudesComercio');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (_e) {}

  // Fallback a dbClient local
  return dbClient.getCollection<SolicitudComercioItem>('solicitudesComercio' as any) || [];
}

/**
 * Actualiza físicamente en db.json el estado de una solicitud comercial o de emprendedor.
 */
export const actualizarEstadoSolicitudApi = async (
  idSolicitud: string,
  nuevoEstado: 'aprobado' | 'rechazado',
  motivo?: string
): Promise<boolean> => {
  try {
    const fechaNow = new Date().toISOString();
    const payload: Record<string, any> = {
      id: idSolicitud,
      estado: nuevoEstado,
      motivoRechazo: motivo || null,
      justificacion: motivo || (nuevoEstado === 'aprobado' ? 'Patente y Sello Verificado aprobados formalmente.' : 'Rechazada por la administración.'),
      notas: motivo || (nuevoEstado === 'aprobado' ? 'Patente y Sello Verificado otorgados.' : 'Rechazada.'),
      fechaResolucion: fechaNow,
      verificado: nuevoEstado === 'aprobado',
      verificadoHacienda: true
    };

    // 1. Petición física al middleware central de Vite
    let respondio = false;
    try {
      const res = await fetch(`/api/solicitudesComercio/${idSolicitud}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) respondio = true;
    } catch (_e) {}

    // 2. Si no, intentar con json-server (puerto 3001)
    if (!respondio) {
      try {
        const res = await fetch(`http://localhost:3001/solicitudesComercio/${idSolicitud}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) respondio = true;
      } catch (_e) {}
    }

    // 3. Sincronizar en dbClient / localStorage
    try {
      dbClient.update('solicitudesComercio', idSolicitud, payload);
    } catch (_) {}

    return true;
  } catch (error) {
    console.error('[comercioService] Error al actualizar estado de solicitud:', error);
    return false;
  }
};

/**
 * Obtener publicaciones de comercio (propias o feed de otros)
 */
export async function obtenerPublicacionesComercioApi(params?: {
  misPublicaciones?: boolean;
  comercioId?: string;
  excluirComercioId?: string;
}): Promise<PublicacionComercioItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.misPublicaciones) query.set('misPublicaciones', 'true');
    if (params?.comercioId) query.set('comercioId', params.comercioId);
    if (params?.excluirComercioId) query.set('excluirComercioId', params.excluirComercioId);

    const res = await fetch(`/api/comercio/publicaciones?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (_e) {}

  // Fallback local
  try {
    const raw = localStorage.getItem('cr_publicaciones_comercio');
    if (raw) {
      let list = JSON.parse(raw);
      if (Array.isArray(list)) {
        if (params?.misPublicaciones && params?.comercioId) {
          list = list.filter((p: any) => p.comercioId === params.comercioId || p.usuarioId === params.comercioId);
        } else if (params?.excluirComercioId) {
          list = list.filter((p: any) => p.comercioId !== params.excluirComercioId && p.usuarioId !== params.excluirComercioId);
        }
        return list;
      }
    }
  } catch (_e) {}

  return [];
}

/**
 * Crear nueva publicación comercial
 */
export async function crearPublicacionComercioApi(publicacion: Partial<PublicacionComercioItem>): Promise<PublicacionComercioItem | null> {
  try {
    const res = await fetch('/api/comercio/publicaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicacion)
    });

    if (res.ok) {
      const resp = await res.json();
      return resp.data || resp;
    }
  } catch (_e) {}

  // Fallback local
  try {
    const nueva: PublicacionComercioItem = {
      id: `PUB-LOCAL-${Date.now()}`,
      comercioId: publicacion.comercioId || 'SOL-COM-003',
      nombreComercio: publicacion.nombreComercio || 'Cafetería y Tostaduría Alma Tica',
      titulo: publicacion.titulo || 'Nueva Publicación',
      descripcion: publicacion.descripcion || '',
      categoria: publicacion.categoria || 'General',
      imagenUrl: publicacion.imagenUrl || '',
      precio: publicacion.precio || '',
      contacto: publicacion.contacto || '',
      canton: publicacion.canton || 'San José',
      provincia: publicacion.provincia || 'San José',
      fechaPublicacion: new Date().toISOString(),
      metricas: { vistas: 1, likes: 0, comentarios: 0, contactos: 0 }
    };
    const raw = localStorage.getItem('cr_publicaciones_comercio') || '[]';
    const list = JSON.parse(raw);
    list.unshift(nueva);
    localStorage.setItem('cr_publicaciones_comercio', JSON.stringify(list));
    return nueva;
  } catch (_e) {
    return null;
  }
}

/**
 * Editar publicación comercial existente
 */
export async function actualizarPublicacionComercioApi(
  id: string,
  cambios: Partial<PublicacionComercioItem>
): Promise<PublicacionComercioItem | null> {
  try {
    const res = await fetch(`/api/comercio/publicaciones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios)
    });

    if (res.ok) {
      const resp = await res.json();
      return resp.data || resp;
    }
  } catch (_e) {}

  return null;
}

/**
 * Eliminar publicación comercial
 */
export async function eliminarPublicacionComercioApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/comercio/publicaciones/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) return true;
  } catch (_e) {}

  try {
    const raw = localStorage.getItem('cr_publicaciones_comercio');
    if (raw) {
      const list = JSON.parse(raw);
      const filtered = list.filter((p: any) => p.id !== id);
      localStorage.setItem('cr_publicaciones_comercio', JSON.stringify(filtered));
      return true;
    }
  } catch (_e) {}

  return false;
}

/**
 * Obtener métricas y gráficos de actividad comercial
 */
export async function obtenerMetricasActividadApi(
  comercioId: string = 'SOL-COM-003',
  periodo: '30d' | '6m' | '12m' = '30d'
): Promise<MetricasComercioResponse | null> {
  try {
    const res = await fetch(`/api/comercio/metricas?comercioId=${comercioId}&periodo=${periodo}`);
    if (res.ok) {
      const resp = await res.json();
      return resp.data || null;
    }
  } catch (_e) {}

  return null;
}

/**
 * Obtener perfil comercial detallado
 */
export async function obtenerPerfilComercialApi(comercioId: string = 'SOL-COM-003'): Promise<any> {
  try {
    const res = await fetch(`/api/comercio/perfil?comercioId=${comercioId}`);
    if (res.ok) {
      const resp = await res.json();
      return resp.data || null;
    }
  } catch (_e) {}

  return null;
}

/**
 * Actualizar perfil comercial
 */
export async function actualizarPerfilComercialApi(datos: any): Promise<any> {
  try {
    const res = await fetch('/api/comercio/perfil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      const resp = await res.json();
      return resp.data || null;
    }
  } catch (_e) {}

  return null;
}
