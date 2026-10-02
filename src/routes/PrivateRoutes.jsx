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
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from '../pages/AccessDenied';
import { ROLES_SISTEMA, normalizarRolOficial } from '../config/roles';

/**
 * Determina de forma flexible si un rol corresponde a la esfera ciudadana
 */
export function esRolCiudadano(rol) {
  if (!rol) return false;
  const r = String(rol).toLowerCase().trim();
  return (
    r.includes('ciudadan') ||
    r.includes('turista') ||
    r.includes('cr ciudadano') ||
    r.includes('residente') ||
    r.includes('vecin') ||
    r === 'nivel_1' ||
    r === 'nivel_2'
  );
}

/**
 * Componente Guardián de Rutas Privadas y Control RBAC
 */
export function PrivateRoutes({ allowedRoles, children }) {
  const location = useLocation();
  const { user, isAuthenticated, usuarioActual, estaAutenticado } = useAuth();

  const activeUser = user || usuarioActual;
  const authed = isAuthenticated || estaAutenticado || !!activeUser;

  // 1. Si no está autenticado -> Redirigir a Login con memoria de retorno
  if (!authed || !activeUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si la ruta exige roles específicos y el usuario NO lo tiene -> Mostrar Error 403
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoleNorm = normalizarRolOficial(activeUser.rol);
    const hasRole = allowedRoles.some((role) => {
      return role === activeUser.rol || normalizarRolOficial(role) === userRoleNorm;
    });

    if (!hasRole) {
      return <AccessDenied requiredRoles={allowedRoles} userRole={activeUser.rol} />;
    }
  }

  // 3. Acceso autorizado
  return children ? children : <Outlet />;
}

/**
 * Componente Guardián de Rutas por Rol y Nivel de Acceso (RBAC)
 */
export function RoleRoute({ minLevel = 1, rolesPermitidos = [], allowedRoles = [] }) {
  const location = useLocation();
  const { user, isAuthenticated, usuarioActual, estaAutenticado, cargando, isLoading } = useAuth();

  const loading = cargando ?? isLoading ?? false;
  if (loading) {
    return null;
  }

  let activeUser = user || usuarioActual;
  if (!activeUser) {
    try {
      const saved = localStorage.getItem('cr_sesion_activa') || localStorage.getItem('cru_user_session');
      if (saved) {
        activeUser = JSON.parse(saved);
      }
    } catch {
      activeUser = null;
    }
  }

  const authed = (isAuthenticated ?? estaAutenticado ?? false) || !!activeUser;

  if (!authed || !activeUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const rolesToCheck = allowedRoles.length > 0 ? allowedRoles : rolesPermitidos;
  if (rolesToCheck.length > 0) {
    const userRoleNorm = normalizarRolOficial(activeUser.rol);
    const isSuperAdmin = userRoleNorm === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL;
    const isAllowed = isSuperAdmin || rolesToCheck.some((r) => normalizarRolOficial(r) === userRoleNorm || r === activeUser.rol);
    if (!isAllowed) {
      return <AccessDenied requiredRoles={rolesToCheck} userRole={activeUser.rol} />;
    }
  }

  const userLevel = Number(activeUser.nivelAcceso ?? 2);
  if (userLevel < minLevel) {
    return <AccessDenied requiredRoles={rolesToCheck} userRole={activeUser.rol} />;
  }

  return <Outlet />;
}

export const ProtectedRoute = RoleRoute;

export function AdminRoutes() {
  return <PrivateRoutes allowedRoles={[ROLES_SISTEMA.SUPER_ADMIN_NACIONAL, ROLES_SISTEMA.GESTOR_TERRITORIAL]} />;
}

export function ProvincialAdminRoutes() {
  return <PrivateRoutes allowedRoles={[ROLES_SISTEMA.SUPER_ADMIN_NACIONAL, ROLES_SISTEMA.GESTOR_TERRITORIAL]} />;
}

export default PrivateRoutes;
