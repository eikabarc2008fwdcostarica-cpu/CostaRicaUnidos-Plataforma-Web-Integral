/**
 * ============================================================================
 * COSTA RICA UNIDOS — CONFIGURACIÓN CENTRALIZADA DE NAVEGACIÓN POR ROL (RBAC)
 * Control de Acceso por Principio de Menor Privilegio (3 Roles Únicos)
 * ============================================================================
 * 
 * - GESTOR_TERRITORIAL: Rol unificado territorial y municipal (Nivel 4, 6 módulos).
 * - SUPER_ADMIN_NACIONAL: Módulos de infraestructura, auditoría global y kill-switch de IA.
 * - CIUDADANO: Portal cívico y participación soberana.
 */

export const NAVIGATION_BY_ROLE = {
  GESTOR_TERRITORIAL: [
    { id: 'concejos', label: 'Gobiernos Locales y Concejos', icon: 'ayuntamiento' },
    { id: 'gaceta', label: 'Gaceta de Actas y Acuerdos', icon: 'documento', badge: 6 },
    { id: 'organigrama', label: 'Organigrama de Dependencias', icon: 'organigrama' },
    { id: 'audiencia', label: 'Solicitudes de Audiencia Formal', icon: 'calendario' },
    { id: 'obras', label: 'Obras & Averías Viales (M07)', icon: 'obras' },
    { id: 'cne', label: 'Emergencias CNE (M10)', icon: 'alerta' }
  ],
  SUPER_ADMIN_NACIONAL: [
    { id: 'dashboard_global', label: 'Dashboard Analítico Global', icon: 'dashboard' },
    { id: 'usuarios', label: 'Usuarios & Auditoría Inmutable', icon: 'usuarios' },
    { id: 'ventanilla', label: 'Ventanilla Comercial Nacional', icon: 'tienda' },
    { id: 'ia_governance', label: 'Gobernanza de IA (Kill-Switch)', icon: 'cpu' }
  ],
  CIUDADANO: []
};

// Aliases para garantizar interoperabilidad con cualquier llamada previa
NAVIGATION_BY_ROLE.ADMIN_PROVINCIAL = NAVIGATION_BY_ROLE.GESTOR_TERRITORIAL;
NAVIGATION_BY_ROLE.EDITOR_MUNICIPAL = NAVIGATION_BY_ROLE.GESTOR_TERRITORIAL;
NAVIGATION_BY_ROLE.OPERADOR_CANTONAL = NAVIGATION_BY_ROLE.GESTOR_TERRITORIAL;
NAVIGATION_BY_ROLE.SUPER_ADMIN = NAVIGATION_BY_ROLE.SUPER_ADMIN_NACIONAL;
NAVIGATION_BY_ROLE.SUPERADMIN_NACIONAL = NAVIGATION_BY_ROLE.SUPER_ADMIN_NACIONAL;

/**
 * Obtiene la lista de navegación autorizada de forma estricta según el rol del usuario
 * @param {string} role 
 * @returns {Array<{id: string, label: string, icon: string, badge?: number}>}
 */
export function getNavigationForRole(role) {
  if (!role) return NAVIGATION_BY_ROLE.GESTOR_TERRITORIAL;
  const roleNorm = String(role).toUpperCase().trim();
  
  if (
    roleNorm === 'SUPER_ADMIN_NACIONAL' ||
    roleNorm === 'SUPER_ADMIN' ||
    roleNorm === 'SUPERADMIN_NACIONAL' ||
    roleNorm.includes('SUPER')
  ) {
    return NAVIGATION_BY_ROLE.SUPER_ADMIN_NACIONAL;
  }
  
  if (
    roleNorm === 'GESTOR_TERRITORIAL' ||
    roleNorm.includes('TERRITORIAL') ||
    roleNorm === 'ADMIN_PROVINCIAL' ||
    roleNorm.includes('PROVINCIAL') ||
    roleNorm === 'EDITOR_MUNICIPAL' ||
    roleNorm.includes('MUNICIPAL') ||
    roleNorm.includes('OPERADOR')
  ) {
    return NAVIGATION_BY_ROLE.GESTOR_TERRITORIAL;
  }
  
  return NAVIGATION_BY_ROLE[roleNorm] || NAVIGATION_BY_ROLE.GESTOR_TERRITORIAL;
}

export default NAVIGATION_BY_ROLE;
