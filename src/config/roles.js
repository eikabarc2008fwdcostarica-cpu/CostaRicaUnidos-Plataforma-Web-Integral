/**
 * ============================================================================
 * COSTA RICA UNIDOS — MATRIZ OFICIAL DE ROLES DEL SISTEMA (3 ROLES ÚNICOS)
 * Jerarquía y Control de Acceso Basado en Roles (RBAC)
 * ============================================================================
 * 
 * 1. SUPER_ADMIN_NACIONAL (Nivel 5):
 *    Gobernanza de IA (Kill-Switch), auditoría inmutable, configuración global del sistema.
 * 
 * 2. GESTOR_TERRITORIAL (Nivel 4) [Rol Unificado Municipal y Provincial]:
 *    Gestión integral de contenidos municipales, supervisión provincial de concejos,
 *    triaje de obras y averías viales (M07) y centro de mando CNE (M10).
 * 
 * 3. CIUDADANO (Nivel 2):
 *    Portal cívico, consulta de gacetas, trámites, votos soberanos y reportes ciudadanos.
 */

export const ROLES_SISTEMA = {
  SUPER_ADMIN_NACIONAL: 'SUPER_ADMIN_NACIONAL',
  GESTOR_TERRITORIAL: 'GESTOR_TERRITORIAL',
  CIUDADANO: 'CIUDADANO'
};

export const ROLES_CONFIG = {
  SUPER_ADMIN_NACIONAL: {
    id: 'SUPER_ADMIN_NACIONAL',
    nivel: 5,
    nombre: 'Super Admin Nacional',
    badge: '[SYS] SUPER-ADMIN',
    descripcion: 'Gobernanza de IA, auditoría inmutable, configuración global'
  },
  GESTOR_TERRITORIAL: {
    id: 'GESTOR_TERRITORIAL',
    nivel: 4,
    nombre: 'Gestor Territorial y Municipal',
    badge: '[NIVEL 4] GESTOR TERRITORIAL Y MUNICIPAL | COSTA RICA UNIDOS',
    descripcion: 'Gestión de contenidos municipales + supervisión provincial de concejos, obras M07 y emergencias M10'
  },
  CIUDADANO: {
    id: 'CIUDADANO',
    nivel: 2,
    nombre: 'Ciudadano Residente',
    badge: '[CIVIC] CIUDADANO VERIFICADO',
    descripcion: 'Portal cívico, consulta de gacetas, trámites y reportes ciudadanos'
  }
};

/**
 * Normaliza cualquier rol legacy al nuevo esquema de 3 roles únicos
 * @param {string} rawRole 
 * @returns {'SUPER_ADMIN_NACIONAL' | 'GESTOR_TERRITORIAL' | 'CIUDADANO'}
 */
export function normalizarRolOficial(rawRole) {
  if (!rawRole) return ROLES_SISTEMA.CIUDADANO;
  const r = String(rawRole).toUpperCase().trim();

  // 1. Super Admin
  if (
    r === 'SUPER_ADMIN_NACIONAL' ||
    r === 'SUPERADMIN_NACIONAL' ||
    r.includes('SUPERADMIN') ||
    r.includes('SUPER_ADMIN') ||
    r.includes('SUPER')
  ) {
    return ROLES_SISTEMA.SUPER_ADMIN_NACIONAL;
  }

  // 2. Gestor Territorial (Fusión de Administrador Provincial + Editor Municipal)
  if (
    r === 'GESTOR_TERRITORIAL' ||
    r.includes('TERRITORIAL') ||
    r === 'ADMIN_PROVINCIAL' ||
    r.includes('PROVINCIAL') ||
    r === 'EDITOR_MUNICIPAL' ||
    r.includes('MUNICIPAL') ||
    r.includes('OPERADOR') ||
    r.includes('CANTONAL')
  ) {
    return ROLES_SISTEMA.GESTOR_TERRITORIAL;
  }

  // 3. Ciudadano por defecto
  return ROLES_SISTEMA.CIUDADANO;
}

export default ROLES_SISTEMA;
