<<<<<<< HEAD
=======
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
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
 * Componente Guardián de Rutas por Rol y Nivel de Acceso (RBAC)
 * - Lee la sesión persistida en el contexto o en localStorage ('cr_sesion_activa').
 * - Si el usuario no está autenticado, redirige amigablemente a /login preservando state: { from: location }.
 * - Para rutas ciudadanas y trámites (minLevel <= 2), CUALQUIER ciudadano autenticado con cédula
 *   y contraseña tiene acceso total e inmediato sin firmas digitales ni validaciones biométricas excluyentes.
 * - Para consolas administrativas institucionales (minLevel >= 3), valida la jerarquía oficial.
 */
export function RoleRoute({ minLevel = 1, rolesPermitidos = [] }) {
  const location = useLocation();
  const { usuarioActual, user, estaAutenticado, isAuthenticated, cargando, isLoading } = useAuth();

  const loading = cargando ?? isLoading ?? false;
  if (loading) return <VerificandoCredenciales />;

  // Leer sesión activa con soporte resiliente de localStorage
  let activeUser = usuarioActual || user;
  if (!activeUser) {
    try {
      const saved = localStorage.getItem('cr_sesion_activa');
      if (saved) {
        activeUser = JSON.parse(saved);
      }
    } catch {
      activeUser = null;
    }
  }

  const authed = (estaAutenticado ?? isAuthenticated ?? false) || !!activeUser;

  // 1. Redirección amigable al Login si no hay sesión activa (con memoria de retorno)
  if (!authed || !activeUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userLevel = Number(activeUser.nivelAcceso ?? 2);
  const userRole = activeUser.rol || '';

  // 2. Módulos Ciudadanos y Comunitarios (Nivel <= 2)
  // Cualquier ciudadano autenticado con su número de cédula y contraseña tiene acceso irrestricto.
  // La Firma Digital Gaudi es puramente complementaria u opcional, nunca un requisito excluyente.
  if (minLevel <= 2) {
    if (rolesPermitidos.length > 0) {
      const rolPermitido = rolesPermitidos.some((r) => {
        const rNorm = String(r).toLowerCase().trim();
        const userNorm = String(userRole).toLowerCase().trim();
        return (
          userNorm.includes(rNorm) ||
          rNorm.includes(userNorm) ||
          (esRolCiudadano(r) && esRolCiudadano(userRole))
        );
      });
      if (!rolPermitido && userLevel < 3) {
        return <Navigate to="/403" state={{ from: location }} replace />;
      }
    }
    return <Outlet />;
  }

  // 3. Módulos Administrativos Oficiales (Nivel >= 3: Editor Municipal, Admin Provincial, Super Admin)
  const nivelValido = userLevel >= minLevel;
  const rolValido =
    rolesPermitidos.length === 0 ||
    rolesPermitidos.some((r) => String(r).toLowerCase() === String(userRole).toLowerCase());

  if (nivelValido && rolValido) {
    return <Outlet />;
  }

  // Redirigir a 403 únicamente si un usuario de menor jerarquía intenta entrar a consolas administrativas
  return <Navigate to="/403" state={{ from: location }} replace />;
}

/**
 * Guardián de Rutas Protegidas Estándar (ProtectedRoute)
 * Alias institucional para compatibilidad de enrutamiento
 */
export const ProtectedRoute = RoleRoute;

/**
 * Guardián de Rutas Administrativas (Nivel >= 3)
 * Admite Editor Municipal (N3), Administrador Provincial (N4) y Super Admin (N5).
>>>>>>> origin/main
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

<<<<<<< HEAD
export default PrivateRoutes;
=======
/**
 * Guardián de Rutas Privadas Generales (Nivel >= 1 o Ciudadano Autenticado)
 */
export default function PrivateRoutes() {
  return <RoleRoute minLevel={1} />;
}

>>>>>>> origin/main
