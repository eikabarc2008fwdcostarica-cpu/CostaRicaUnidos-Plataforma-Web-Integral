/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE USUARIOS Y PERSISTENCIA HTTP (API)
 * Manejo de peticiones HTTP hacia el endpoint /api/usuarios para db.json
 * ============================================================================
 */

import { RegisterUserData, Usuario, DbUser } from '../types/auth';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  user?: DbUser | Usuario;
  message: string;
}

const API_USUARIOS_URL = '/api/usuarios';

/**
 * Realiza una petición POST HTTP real para registrar un nuevo usuario en db.json.
 */
export async function registrarUsuarioApi(
  datos: RegisterUserData
): Promise<{ success: boolean; user?: Usuario; message: string }> {
  try {
    const payload = {
      cedula: datos.cedula.trim(),
      nombre: [datos.nombre, datos.primerApellido, datos.segundoApellido]
        .filter(Boolean)
        .join(' ')
        .trim() || datos.nombre.trim(),
      correo: datos.correo.toLowerCase().trim(),
      password: datos.password,
      rol: datos.rol || 'Ciudadano/Turista',
      provincia: datos.provincia || 'San José',
      canton: datos.canton || 'San José',
      distrito: datos.distrito || 'Carmen',
      verificadoHacienda: datos.verificadoHacienda ?? true
    };

    const response = await fetch(API_USUARIOS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error del servidor (${response.status}) al registrar el usuario.`
      };
    }

    return {
      success: true,
      user: data.user,
      message: data.message || 'Usuario registrado exitosamente.'
    };
  } catch (error) {
    console.error('[userService] Error de conexión con el endpoint /api/usuarios:', error);
    return {
      success: false,
      message: 'No fue posible conectar con el servicio de autenticación. Verifique la conexión de red.'
    };
  }
}

/**
 * Obtiene la lista actual de usuarios almacenados en db.json a través de HTTP GET.
 */
export async function obtenerUsuariosApi(): Promise<Usuario[]> {
  try {
    const response = await fetch(API_USUARIOS_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.usuarios || [];
  } catch (error) {
    console.warn('[userService] No se pudo obtener usuarios vía API:', error);
    return [];
  }
}
