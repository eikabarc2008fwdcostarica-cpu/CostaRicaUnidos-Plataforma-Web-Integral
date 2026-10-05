/**
 * ============================================================================
 * COSTA RICA UNIDOS — GUARDIÁN DE RUTAS PRIVADAS Y CONTROL RBAC UNIVERSAL
 * Validador de Autenticación de Estado y Control de Acceso Basado en Roles
 * Manejo Estricto de Excepciones HTTP: 403 Forbidden vs 401 Unauthorized
 * ============================================================================
 */
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "../pages/AccessDenied";

/**
 * Determina si un rol corresponde a la esfera ciudadana o comercial
 */
export function esRolCiudadano(rol) {
  if (!rol) return false;
  const r = String(rol).toLowerCase().trim();
  return (
    r.includes("ciudadan") ||
    r.includes("turista") ||
    r.includes("cr ciudadano") ||
    r.includes("residente") ||
    r.includes("vecin") ||
    r.includes("comerciante") ||
    r.includes("emprendedor") ||
    r.includes("comercio") ||
    r === "nivel_1" ||
    r === "nivel_2" ||
    r === "nivel_3"
  );
}

/**
 * Guardián de Rutas Privadas y Control de Acceso Basado en Roles (RBAC)
 */
export function PrivateRoutes({ allowedRoles, children }) {
  const { user, isAuthenticated, usuarioActual } = useAuth();
  const location = useLocation();

  const activeUser = user || usuarioActual;
  const isAuthed = isAuthenticated || !!activeUser;
  const esRutaAdmin = location.pathname.startsWith("/admin");

  // 1. Caso: Usuario NO autenticado
  if (!isAuthed || !activeUser) {
    // Si intenta acceder directamente a una ruta administrativa sin credenciales -> Error 403
    if (esRutaAdmin) {
      return (
        <AccessDenied 
          requiredRoles={allowedRoles || ["ADMINISTRADOR"]} 
          userRole="Visitante No Autenticado (Sin Sesión)" 
        />
      );
    }
    // Para rutas ciudadanas normales, dirigir a login con memoria de ruta
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Normalización de roles para validación RBAC
  const rolUsuario = (activeUser.rol || "").toUpperCase();
  const nivelUsuario = Number(activeUser.nivelAcceso || 0);

  // 3. Caso: Usuario autenticado pero SIN el rol requerido
  if (allowedRoles && allowedRoles.length > 0) {
    const tienePermiso = allowedRoles.some((r) => {
      const rolPermitido = String(r).toUpperCase().trim();

      // Coincidencia exacta de texto
      if (rolPermitido === rolUsuario) return true;

      // Validación jerárquica por nivel de acceso
      if (rolPermitido.includes("SUPER") && (nivelUsuario === 5 || rolUsuario.includes("SUPER"))) return true;
      if (rolPermitido.includes("TERRITORIAL") && (nivelUsuario === 4 || rolUsuario.includes("TERRITORIAL"))) return true;
      if (rolPermitido.includes("COMERCIANTE") && (nivelUsuario === 3 || rolUsuario.includes("COMERCIANTE") || rolUsuario.includes("EMPRENDEDOR"))) return true;
      if (rolPermitido.includes("CIUDADANO") && nivelUsuario >= 2) return true;

      return false;
    });

    // Si NO tiene el rol ni el nivel requerido -> RENDERIZAR ERROR 403 (Cero rebotes silenciosos)
    if (!tienePermiso) {
      return (
        <AccessDenied 
          requiredRoles={allowedRoles} 
          userRole={activeUser.rol || `Nivel ${nivelUsuario}`} 
        />
      );
    }
  }

  // 4. Acceso plenamente autorizado
  return children ? children : <Outlet />;
}

/**
 * Componente Guardián de Rutas por Rol y Nivel Mínimo de Acceso (RBAC)
 */
export function RoleRoute({ minLevel = 1, rolesPermitidos = [], allowedRoles = [] }) {
  const location = useLocation();
  const { user, isAuthenticated, usuarioActual, cargando, isLoading } = useAuth();

  const loading = cargando ?? isLoading ?? false;
  if (loading) {
    return null;
  }

  const activeUser = user || usuarioActual;
  const isAuthed = isAuthenticated || !!activeUser;
  const esRutaAdmin = location.pathname.startsWith("/admin");
  const rolesToCheck = allowedRoles.length > 0 ? allowedRoles : rolesPermitidos;

  if (!isAuthed || !activeUser) {
    if (esRutaAdmin) {
      return (
        <AccessDenied 
          requiredRoles={rolesToCheck.length > 0 ? rolesToCheck : ["ADMINISTRADOR"]} 
          userRole="Visitante No Autenticado (Sin Sesión)" 
        />
      );
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const rolUsuario = (activeUser.rol || "").toUpperCase();
  const nivelUsuario = Number(activeUser.nivelAcceso || 0);

  if (rolesToCheck.length > 0) {
    const tienePermiso = rolesToCheck.some((r) => {
      const rolPermitido = String(r).toUpperCase().trim();
      if (rolPermitido === rolUsuario) return true;
      if (rolPermitido.includes("SUPER") && (nivelUsuario === 5 || rolUsuario.includes("SUPER"))) return true;
      if (rolPermitido.includes("TERRITORIAL") && (nivelUsuario === 4 || rolUsuario.includes("TERRITORIAL"))) return true;
      if (rolPermitido.includes("COMERCIANTE") && (nivelUsuario === 3 || rolUsuario.includes("COMERCIANTE") || rolUsuario.includes("EMPRENDEDOR"))) return true;
      if (rolPermitido.includes("CIUDADANO") && nivelUsuario >= 2) return true;
      return false;
    });

    if (!tienePermiso) {
      return <AccessDenied requiredRoles={rolesToCheck} userRole={activeUser.rol || `Nivel ${nivelUsuario}`} />;
    }
  }

  if (nivelUsuario < minLevel) {
    return (
      <AccessDenied 
        requiredRoles={rolesToCheck.length > 0 ? rolesToCheck : [`Nivel ${minLevel}+`]} 
        userRole={activeUser.rol || `Nivel ${nivelUsuario}`} 
      />
    );
  }

  return <Outlet />;
}

export const ProtectedRoute = RoleRoute;

export function AdminRoutes() {
  return <PrivateRoutes allowedRoles={["SUPER_ADMIN_NACIONAL", "GESTOR_TERRITORIAL"]} />;
}

export function ProvincialAdminRoutes() {
  return <PrivateRoutes allowedRoles={["SUPER_ADMIN_NACIONAL", "GESTOR_TERRITORIAL"]} />;
}

export default PrivateRoutes;
