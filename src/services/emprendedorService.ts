/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE TRÁMITE PARA EMPRENDEDORES (SRS v2.1)
 * Gestión de solicitudes para elevar rol de Ciudadano a Emprendedor Local
 * ============================================================================
 */

import { dbClient } from './dbClient';

export interface SolicitudEmprendedor {
  id: string;
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

    // 1. Guardar en localStorage vía dbClient para resiliencia instantánea
    try {
      dbClient.insert('solicitudes_emprendedor' as any, nuevaSolicitud as any);
      // Sincronizar también con solicitudesComercio para visibilidad en panel de control
      dbClient.insert('solicitudesComercio', {
        id: nuevaSolicitud.id,
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

    // 2. Enviar petición HTTP al servidor de desarrollo Vite (db.json)
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
          message: 'Solicitud enviada correctamente. Se encuentra pendiente de revisión administrativa.'
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
 * Consulta las solicitudes de un usuario por su número de cédula.
 */
export async function consultarSolicitudCiudadano(cedula: string): Promise<SolicitudEmprendedor | null> {
  const cleanCed = String(cedula).replace(/[^0-9]/g, '');

  // 1. Intentar por API
  try {
    const res = await fetch(`${API_SOLICITUDES_URL}?cedula=${encodeURIComponent(cedula)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
    }
  } catch (_e) {
    // Continuar con localStorage
  }

  // 2. Buscar en dbClient / localStorage
  try {
    const lista = dbClient.getCollection<SolicitudEmprendedor>('solicitudes_emprendedor' as any);
    const match = lista.find(
      (s) =>
        s.cedula === cedula ||
        s.cedula.replace(/[^0-9]/g, '') === cleanCed
    );
    if (match) return match;
  } catch (_e) {}

  return null;
}
