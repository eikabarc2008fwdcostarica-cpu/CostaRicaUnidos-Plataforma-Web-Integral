/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE GESTIÓN COMERCIAL Y PATENTES (API REST)
 * Conexión física con json-server (db.json en puerto 3001)
 * ============================================================================
 */

import { dbClient } from './dbClient';

export interface SolicitudComercioItem {
  id: string;
  cedula?: string;
  cedulaJuridica?: string;
  nombreComercio?: string;
  nombreNegocio?: string;
  nombreSolicitante?: string;
  actividadHacienda?: string;
  actividadEconomicaHacienda?: string;
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
}

/**
 * Actualiza físicamente en db.json mediante HTTP PATCH a json-server (:3001)
 * el estado de una solicitud comercial o de emprendedor.
 */
export const actualizarEstadoSolicitudApi = async (
  idSolicitud: string,
  nuevoEstado: 'aprobado' | 'rechazado',
  motivo?: string
): Promise<boolean> => {
  try {
    const COLECCION = 'solicitudesComercio';
    const endpoint = `http://localhost:3001/${COLECCION}/${idSolicitud}`;

    const fechaNow = new Date().toISOString();
    const payload: Record<string, any> = {
      estado: nuevoEstado,
      motivoRechazo: motivo || null,
      justificacion: motivo || (nuevoEstado === 'aprobado' ? 'Patente y Sello Verificado aprobados formalmente.' : 'Rechazada por la administración.'),
      notas: motivo || (nuevoEstado === 'aprobado' ? 'Patente y Sello Verificado otorgados.' : 'Rechazada.'),
      fechaResolucion: fechaNow
    };

    if (nuevoEstado === 'aprobado') {
      payload.verificado = true;
      payload.verificadoHacienda = true;
    } else {
      payload.verificado = false;
    }

    // 1. Petición PATCH física a la colección principal de comercios en json-server
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[comercioService] Fallo PATCH en json-server (${response.status}):`, await response.text());
      return false;
    }

    // 2. Sincronizar simultáneamente en la colección de solicitudes_emprendedor si existe en db.json
    try {
      await fetch(`http://localhost:3001/solicitudes_emprendedor/${idSolicitud}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: nuevoEstado,
          motivoRechazo: motivo || null,
          fechaResolucion: fechaNow
        })
      });
    } catch (_syncErr) {
      // Ignorar si la solicitud no pertenecía a la colección secundaria de emprendedor
    }

    // 3. Sincronizar en dbClient / localStorage para coherencia reactiva
    try {
      dbClient.update('solicitudesComercio', idSolicitud, payload);
    } catch (_) {}

    return true;
  } catch (error) {
    console.error('[comercioService] Error de red al conectar con json-server:', error);
    return false;
  }
};
