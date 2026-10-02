/**
 * ============================================================================
 * COSTA RICA UNIDOS — GUARDIÁN DE RUTAS PRIVADAS Y CONTROL RBAC (3 ROLES ÚNICOS)
 * Validador de Autenticación de Estado y Control de Acceso Basado en Roles
 * ============================================================================
 * 
 * Jerarquía Oficial de Permisos:
 * 1. SUPER_ADMIN_NACIONAL (Nivel 5): Acceso a /admin/super, /admin/territorial, /dashboard y portales públicos.
 * 2. GESTOR_TERRITORIAL (Nivel 4): Acceso a /admin/territorial y /dashboard. Intento a /admin/super -> Pantalla 403.
 * 3. CIUDADANO (Nivel 2): Acceso a /dashboard y /. Intento a /admin/territorial o /admin/super -> Pantalla 403.
 * 4. No Autenticado (Sin sesión): Redirección inmediata a /login.
 */
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "../pages/AccessDenied";
import { ROLES_SISTEMA, normalizarRolOficial } from "../config/roles";

function PrivateRoutes({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();

  // 1. Si no está autenticado -> Redirigir a Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta exige roles específicos y el usuario NO lo tiene -> Mostrar Error 403 (Sin rebotes silenciosos)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoleNorm = normalizarRolOficial(user.rol);
    const hasRole = allowedRoles.some((role) => {
      return role === user.rol || normalizarRolOficial(role) === userRoleNorm;
    });

    if (!hasRole) {
      return <AccessDenied requiredRoles={allowedRoles} userRole={user.rol} />;
    }
  }

  // 3. Acceso autorizado
  return children ? children : <Outlet />;
}

/**
 * Guardián de compatibilidad para rutas basadas en nivel numérico o roles permitidos
 */
export function RoleRoute({ minLevel = 2, rolesPermitidos = [], allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const rolesToCheck = allowedRoles.length > 0 ? allowedRoles : rolesPermitidos;
  if (rolesToCheck.length > 0) {
    const userRoleNorm = normalizarRolOficial(user?.rol);
    const isSuperAdmin = userRoleNorm === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL;
    const isAllowed = isSuperAdmin || rolesToCheck.some((r) => normalizarRolOficial(r) === userRoleNorm || r === user?.rol);
    if (!isAllowed) {
      return <AccessDenied requiredRoles={rolesToCheck} userRole={user?.rol} />;
    }
  }

  const userLevel = user?.nivelAcceso ?? 2;
  if (userLevel < minLevel) {
    return <AccessDenied requiredRoles={rolesToCheck} userRole={user?.rol} />;
  }

  return <Outlet />;
}

/**
 * Guardián de Rutas Administrativas
 */
export function AdminRoutes() {
  return <PrivateRoutes allowedRoles={[ROLES_SISTEMA.SUPER_ADMIN_NACIONAL, ROLES_SISTEMA.GESTOR_TERRITORIAL]} />;
}

/**
 * Guardián de Rutas Territoriales (Nivel 4)
 */
export function ProvincialAdminRoutes() {
  return <PrivateRoutes allowedRoles={[ROLES_SISTEMA.SUPER_ADMIN_NACIONAL, ROLES_SISTEMA.GESTOR_TERRITORIAL]} />;
}

export default PrivateRoutes;
