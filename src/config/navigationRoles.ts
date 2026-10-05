/**
 * ============================================================================
 * COSTA RICA UNIDOS — CONFIGURACIÓN CENTRALIZADA DE NAVEGACIÓN Y PERMISOS RBAC
 * Control de Acceso Estricto por Principio de Menor Privilegio (3 Roles Únicos)
 * ============================================================================
 */

export interface ModuloInfo {
  id: string;
  label: string;
  icon: string;
  badge?: number | null;
  exclusivoSuperAdmin?: boolean;
}

export const MODULOS_POR_ROL = {
  SUPER_ADMIN_NACIONAL: [
    { id: "dashboard", label: "Dashboard Analítico Nacional", icon: "dashboard" },
    { id: "usuarios", label: "Usuarios & Auditoría Inmutable", icon: "usuarios", exclusivoSuperAdmin: true }, // EXCLUSIVO NIVEL 5
    { id: "ventanilla", label: "Ventanilla Comercial Nacional", icon: "tienda" },
    { id: "obras_nacional", label: "Obras & Averías Nacional", icon: "obras" },
    { id: "emergencias_coe", label: "Emergencias COE Nacional", icon: "alerta" },
    { id: "ia_governance", label: "Gobernanza de IA (Kill-Switch)", icon: "cpu", exclusivoSuperAdmin: true }
  ],
  GESTOR_TERRITORIAL: [
    { id: "concejos", label: "Gobiernos Locales y Concejos", icon: "ayuntamiento" }, // VISTA PRINCIPAL
    { id: "gaceta", label: "Gaceta de Actas y Acuerdos", icon: "documento", badge: 6 },
    { id: "organigrama", label: "Organigrama de Dependencias", icon: "organigrama" },
    { id: "audiencias", label: "Solicitudes de Audiencia Formal", icon: "calendario" },
    { id: "obras", label: "Obras & Averías Viales (M07)", icon: "obras" },
    { id: "cne", label: "Emergencias CNE (M10)", icon: "alerta" }
    // PROHIBIDO: Ningún módulo de usuarios, padrón ni gobernanza de IA aquí.
  ],
  CIUDADANO: [
    { id: "portal", label: "Portal Cívico", icon: "home" },
    { id: "mis_tramites", label: "Mis Trámites", icon: "documento" },
    { id: "reportes", label: "Reportes Viales (M07)", icon: "obras" }
  ]
} as const;

export const NAVIGATION_BY_ROLE = MODULOS_POR_ROL;

/**
 * Obtiene los módulos autorizados para un rol específico
 */
export function getModulosPorRol(rol: string | null | undefined): readonly ModuloInfo[] {
  if (!rol) return MODULOS_POR_ROL.CIUDADANO;
  const r = String(rol).toUpperCase().trim();

  if (r.includes('SUPER') || r.includes('NACIONAL') || r === 'SUPER_ADMIN_NACIONAL' || r === '5') {
    return MODULOS_POR_ROL.SUPER_ADMIN_NACIONAL;
  }
  if (r.includes('GESTOR') || r.includes('TERRITORIAL') || r.includes('MUNICIPAL') || r === 'GESTOR_TERRITORIAL' || r === '4') {
    return MODULOS_POR_ROL.GESTOR_TERRITORIAL;
  }
  return MODULOS_POR_ROL.CIUDADANO;
}

/**
 * Verifica si un rol tiene autorización para un módulo dado
 */
export function tienePermisoModulo(rol: string | null | undefined, moduloId: string): boolean {
  // El módulo de usuarios y auditoría es EXCLUSIVO para Super Administrador Nacional (Nivel 5)
  if (moduloId === 'usuarios' || moduloId === 'ia_governance' || moduloId === 'ia') {
    const r = String(rol || '').toUpperCase().trim();
    return r.includes('SUPER') || r === 'SUPER_ADMIN_NACIONAL' || r === '5';
  }

  const modulos = getModulosPorRol(rol);
  return modulos.some((m) => m.id === moduloId);
}

export default MODULOS_POR_ROL;
