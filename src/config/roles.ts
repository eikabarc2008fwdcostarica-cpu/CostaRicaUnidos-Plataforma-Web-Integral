/**
 * ============================================================================
 * COSTA RICA UNIDOS — MATRIZ OFICIAL DE ROLES DEL SISTEMA (4 ROLES RBAC)
 * Jerarquía y Control de Acceso Basado en Roles (RBAC)
 * ============================================================================
 */

export const ROLES_SISTEMA = {
  SUPER_ADMIN_NACIONAL: 'SUPER_ADMIN_NACIONAL',
  GESTOR_TERRITORIAL: 'GESTOR_TERRITORIAL',
  ENCARGADO_MUNICIPAL: 'ENCARGADO_MUNICIPAL',
  COMERCIANTE: 'COMERCIANTE',
  CIUDADANO: 'CIUDADANO'
} as const;

export type RolSistemaKey = keyof typeof ROLES_SISTEMA;
export type RolSistemaValue = typeof ROLES_SISTEMA[RolSistemaKey];

export const PERMISOS_ROL = {
  SUPER_ADMIN_NACIONAL: [
    'noticias.publicar',
    'noticias.gestionarTodas',
    'comunicados.publicar',
    'foro.publicar',
    'publicaciones.gestionarTodas',
    'usuarios.gestionar',
    'comercio.aprobar',
    'sanciones.gestionar',
    'ia.gobernanza',
    'auditoria.ver'
  ],
  GESTOR_TERRITORIAL: [
    'noticias.publicar',
    'comunicados.publicar',
    'foro.publicar',
    'obras.gestionar',
    'emergencias.gestionar'
  ],
  ENCARGADO_MUNICIPAL: [
    'noticias.publicar',
    'comunicados.publicar',
    'foro.publicar',
    'publicaciones.gestionarPropias'
  ],
  COMERCIANTE: [
    'foro.publicar',
    'comercio.publicarPropio'
  ],
  CIUDADANO: [
    'foro.publicar',
    'tramites.solicitar',
    'reportes.crear'
  ]
} as const;

export interface RolConfigItem {
  id: RolSistemaValue;
  nivel: number;
  nombre: string;
  badge: string;
  descripcion: string;
  permisos: readonly string[];
}

export const ROLES_CONFIG: Record<RolSistemaValue, RolConfigItem> = {
  SUPER_ADMIN_NACIONAL: {
    id: 'SUPER_ADMIN_NACIONAL',
    nivel: 5,
    nombre: 'Super Administrador Nacional',
    badge: '[SYS] SUPER-ADMIN',
    descripcion: 'Gobernanza de IA, auditoría inmutable, configuración global',
    permisos: PERMISOS_ROL.SUPER_ADMIN_NACIONAL
  },
  GESTOR_TERRITORIAL: {
    id: 'GESTOR_TERRITORIAL',
    nivel: 4,
    nombre: 'Gestor Territorial y Municipal',
    badge: '[NIVEL 4] GESTOR TERRITORIAL Y MUNICIPAL | COSTA RICA UNIDOS',
    descripcion: 'Supervisión provincial de concejos, obras M07 y emergencias M10',
    permisos: PERMISOS_ROL.GESTOR_TERRITORIAL
  },
  ENCARGADO_MUNICIPAL: {
    id: 'ENCARGADO_MUNICIPAL',
    nivel: 3,
    nombre: 'Encargado Municipal',
    badge: '[OFICIAL] ENCARGADO MUNICIPAL | COSTA RICA UNIDOS',
    descripcion: 'Gestión oficial de noticias, comunicados y participación comunal de su cantón',
    permisos: PERMISOS_ROL.ENCARGADO_MUNICIPAL
  },
  COMERCIANTE: {
    id: 'COMERCIANTE',
    nivel: 3,
    nombre: 'Comerciante y Emprendedor',
    badge: '[NIVEL 3] COMERCIANTE Y EMPRENDEDOR | COSTA RICA UNIDOS',
    descripcion: 'Portal cívico con acreditación comercial, gestión de patentes, ferias y vitrina pyme',
    permisos: PERMISOS_ROL.COMERCIANTE
  },
  CIUDADANO: {
    id: 'CIUDADANO',
    nivel: 2,
    nombre: 'Ciudadano Residente',
    badge: '[CIVIC] CIUDADANO VERIFICADO',
    descripcion: 'Portal cívico, consulta de gacetas, trámites y reportes ciudadanos',
    permisos: PERMISOS_ROL.CIUDADANO
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
    r === 'ENCARGADO_MUNICIPAL' ||
    r === 'ENCARGADOMUNICIPAL' ||
    r.includes('ENCARGADO') ||
    (r.includes('MUNICIPAL') && !r.includes('TERRITORIAL'))
  ) {
    return ROLES_SISTEMA.ENCARGADO_MUNICIPAL;
  }

  if (
    r === 'GESTOR_TERRITORIAL' ||
    r.includes('TERRITORIAL') ||
    r === 'ADMIN_PROVINCIAL' ||
    r.includes('PROVINCIAL')
  ) {
    return ROLES_SISTEMA.GESTOR_TERRITORIAL;
  }

  if (
    r === 'COMERCIANTE' ||
    r.includes('COMERCIANTE') ||
    r.includes('EMPRENDEDOR')
  ) {
    return ROLES_SISTEMA.COMERCIANTE;
  }

  return ROLES_SISTEMA.CIUDADANO;
}

export function usuarioTienePermiso(user: any, permiso: string): boolean {
  if (!user) return false;
  const rolNorm = normalizarRolOficial(user.rol || user.role);
  const permisos = PERMISOS_ROL[rolNorm] || [];
  return (permisos as readonly string[]).includes(permiso);
}

export default ROLES_SISTEMA;
