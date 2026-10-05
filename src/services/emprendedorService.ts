/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE TRÁMITE PARA EMPRENDEDORES (SRS v2.1)
 * Gestión de solicitudes para elevar rol de Ciudadano a Emprendedor Local
 * ============================================================================
 */

import { dbClient } from './dbClient';

export interface SolicitudEmprendedor {
  id: string;
  usuarioId?: string; // Vínculo inequívoco con el usuario
  cedula: string; // Inmutable, read-only
  nombreCompleto: string;
  correoPersonal: string;
  correoComercial: string; // Nuevo correo comercial
  nombreEmprendimiento: string;
  categoriaComercial: string;
  canton: string;
  provincia?: string;
  justificacion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaSolicitud: string;
  fechaResolucion?: string;
  resolucionNotas?: string;
}

const API_SOLICITUDES_URL = '/api/solicitudes_emprendedor';

/**
 * Envía una nueva solicitud de cuenta de Emprendedor / Comercio Local.
 * Persiste inmediatamente en /api/solicitudes_emprendedor (db.json) y localStorage.
 */
export async function enviarSolicitudEmprendedorApi(datos: {
  usuarioId?: string;
  cedula: string;
  nombreCompleto: string;
  correoPersonal: string;
  correoComercial: string;
  nombreEmprendimiento: string;
  categoriaComercial: string;
  canton: string;
  provincia?: string;
  justificacion: string;
}): Promise<{ success: boolean; data?: SolicitudEmprendedor; message: string }> {
  try {
    const nuevaSolicitud: SolicitudEmprendedor = {
      id: `SOL-EMP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      usuarioId: datos.usuarioId,
      cedula: String(datos.cedula).trim(),
      nombreCompleto: String(datos.nombreCompleto).trim(),
      correoPersonal: String(datos.correoPersonal).toLowerCase().trim(),
      correoComercial: String(datos.correoComercial).toLowerCase().trim(),
      nombreEmprendimiento: String(datos.nombreEmprendimiento).trim(),
      categoriaComercial: datos.categoriaComercial || 'Comercio Local',
      canton: datos.canton || 'San José',
      provincia: datos.provincia || 'San José',
      justificacion: String(datos.justificacion).trim(),
      estado: 'pendiente',
      fechaSolicitud: new Date().toISOString()
    };

    // 1. Guardar en json-server puerto 3001 si está disponible
    try {
      await fetch('http://localhost:3001/solicitudes_emprendedor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaSolicitud)
      });
      await fetch('http://localhost:3001/solicitudesComercio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: nuevaSolicitud.id,
          usuarioId: nuevaSolicitud.usuarioId,
          cedulaJuridica: nuevaSolicitud.cedula,
          cedula: nuevaSolicitud.cedula,
          nombreComercio: nuevaSolicitud.nombreEmprendimiento,
          nombreNegocio: nuevaSolicitud.nombreEmprendimiento,
          nombreSolicitante: nuevaSolicitud.nombreCompleto,
          actividadHacienda: nuevaSolicitud.justificacion,
          actividadEconomicaHacienda: nuevaSolicitud.justificacion,
          canton: nuevaSolicitud.canton,
          provincia: nuevaSolicitud.provincia || 'San José',
          fechaSolicitud: nuevaSolicitud.fechaSolicitud,
          estado: 'PENDIENTE',
          justificacion: nuevaSolicitud.justificacion,
          notas: `Nuevo correo comercial: ${nuevaSolicitud.correoComercial}`,
          verificadoHacienda: true
        })
      });
    } catch (_jsErr) {}

    // 2. Guardar en localStorage vía dbClient para resiliencia instantánea
    try {
      dbClient.insert('solicitudes_emprendedor' as any, nuevaSolicitud as any);
      // Sincronizar también con solicitudesComercio para visibilidad en panel de control
      dbClient.insert('solicitudesComercio', {
        id: nuevaSolicitud.id,
        usuarioId: nuevaSolicitud.usuarioId,
        cedulaJuridica: nuevaSolicitud.cedula,
        cedula: nuevaSolicitud.cedula,
        nombreComercio: nuevaSolicitud.nombreEmprendimiento,
        nombreNegocio: nuevaSolicitud.nombreEmprendimiento,
        nombreSolicitante: nuevaSolicitud.nombreCompleto,
        actividadHacienda: nuevaSolicitud.justificacion,
        actividadEconomicaHacienda: nuevaSolicitud.justificacion,
        canton: nuevaSolicitud.canton,
        provincia: nuevaSolicitud.provincia || 'San José',
        fechaSolicitud: nuevaSolicitud.fechaSolicitud,
        estado: 'PENDIENTE',
        justificacion: nuevaSolicitud.justificacion,
        notas: `Nuevo correo comercial: ${nuevaSolicitud.correoComercial}`,
        verificadoHacienda: true
      });
    } catch (_e) {
      console.warn('[emprendedorService] dbClient fallback:', _e);
    }

    // 3. Enviar petición HTTP al servidor de desarrollo Vite (db.json)
    try {
      const res = await fetch(API_SOLICITUDES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(nuevaSolicitud)
      });

      if (res.ok) {
        const body = await res.json();
        return {
          success: true,
          data: body.data || nuevaSolicitud,
          message: 'Solicitud enviada correctamente al Gobierno Local. Se encuentra pendiente de revisión administrativa.'
        };
      }
    } catch (_httpErr) {
      console.warn('[emprendedorService] Servidor HTTP offline, almacenado localmente:', _httpErr);
    }

    return {
      success: true,
      data: nuevaSolicitud,
      message: 'Solicitud registrada exitosamente en estado pendiente.'
    };
  } catch (error: any) {
    console.error('[emprendedorService] Error al enviar solicitud:', error);
    return {
      success: false,
      message: error?.message || 'Error al procesar la solicitud de emprendedor.'
    };
  }
}

/**
 * Consulta las solicitudes pertenecientes estrictamente al usuario en sesión.
 */
export async function consultarSolicitudCiudadano(
  identificador: string | { id?: string; cedula?: string; correo?: string; email?: string }
): Promise<SolicitudEmprendedor | null> {
  const userObj = typeof identificador === 'object' && identificador !== null 
    ? identificador 
    : { cedula: identificador };

  const userId = userObj.id;
  const userCorreo = (userObj.correo || (userObj as any).email || '').toLowerCase().trim();

  let lista: SolicitudEmprendedor[] = [];

  // 1. Intentar por json-server
  try {
    const res = await fetch('http://localhost:3001/solicitudes_emprendedor');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) lista = data;
    }
  } catch (_e) {}

  // 2. Intentar por API Vite
  if (lista.length === 0) {
    try {
      const res = await fetch(API_SOLICITUDES_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) lista = data;
        else if (Array.isArray(data?.data)) lista = data.data;
      }
    } catch (_e) {}
  }

  // 3. Fallback a dbClient (localStorage)
  try {
    const local = dbClient.getCollection<SolicitudEmprendedor>('solicitudes_emprendedor' as any);
    if (Array.isArray(local)) {
      for (const item of local) {
        if (!lista.some((s) => s.id === item.id)) {
          lista.push(item);
        }
      }
    }
  } catch (_e) {}

  // Filtrar estrictamente las solicitudes que pertenezcan al usuario autenticado:
  const miSolicitud = lista.find((s) => {
    const coincideId = Boolean(s.usuarioId && userId && s.usuarioId === userId);
    const coincideCorreo = Boolean(
      s.correoPersonal && userCorreo && s.correoPersonal.toLowerCase().trim() === userCorreo
    );

    return coincideId || coincideCorreo;
  });

  return miSolicitud || null;
}
