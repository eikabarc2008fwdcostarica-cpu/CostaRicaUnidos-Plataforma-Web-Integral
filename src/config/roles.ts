/**
 * ============================================================================
 * COSTA RICA UNIDOS — MATRIZ OFICIAL DE ROLES DEL SISTEMA (4 ROLES RBAC)
 * Jerarquía y Control de Acceso Basado en Roles (RBAC)
 * ============================================================================
 */

export const ROLES_SISTEMA = {
  SUPER_ADMIN_NACIONAL: 'SUPER_ADMIN_NACIONAL',
  GESTOR_TERRITORIAL: 'GESTOR_TERRITORIAL',
  COMERCIANTE: 'COMERCIANTE',
  CIUDADANO: 'CIUDADANO'
} as const;

export type RolSistemaKey = keyof typeof ROLES_SISTEMA;
export type RolSistemaValue = typeof ROLES_SISTEMA[RolSistemaKey];

export interface RolConfigItem {
  id: RolSistemaValue;
  nivel: number;
  nombre: string;
  badge: string;
  descripcion: string;
}

export const ROLES_CONFIG: Record<RolSistemaValue, RolConfigItem> = {
  SUPER_ADMIN_NACIONAL: {
    id: 'SUPER_ADMIN_NACIONAL',
    nivel: 5,
    nombre: 'Super Administrador Nacional',
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
  COMERCIANTE: {
    id: 'COMERCIANTE',
    nivel: 3,
    nombre: 'Comerciante y Emprendedor',
    badge: '[NIVEL 3] COMERCIANTE Y EMPRENDEDOR | COSTA RICA UNIDOS',
    descripcion: 'Portal cívico con acreditación comercial, gestión de patentes, ferias y vitrina pyme'
  },
  CIUDADANO: {
    id: 'CIUDADANO',
    nivel: 2,
    nombre: 'Ciudadano Residente',
    badge: '[CIVIC] CIUDADANO VERIFICADO',
    descripcion: 'Portal cívico, consulta de gacetas, trámites y reportes ciudadanos'
  }
};

export function normalizarRolOficial(rawRole?: string | null): RolSistemaValue {
  if (!rawRole) return ROLES_SISTEMA.CIUDADANO;
  const r = String(rawRole).toUpperCase().trim();

  if (
    r === 'SUPER_ADMIN_NACIONAL' ||
    r === 'SUPERADMIN_NACIONAL' ||
    r.includes('SUPERADMIN') ||
    r.includes('SUPER_ADMIN') ||
    r.includes('SUPER')
  ) {
    return ROLES_SISTEMA.SUPER_ADMIN_NACIONAL;
  }

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

  if (
    r === 'COMERCIANTE' ||
    r.includes('COMERCIANTE') ||
    r.includes('EMPRENDEDOR') ||
    r === '3'
  ) {
    return ROLES_SISTEMA.COMERCIANTE;
  }

  return ROLES_SISTEMA.CIUDADANO;
}

export default ROLES_SISTEMA;
