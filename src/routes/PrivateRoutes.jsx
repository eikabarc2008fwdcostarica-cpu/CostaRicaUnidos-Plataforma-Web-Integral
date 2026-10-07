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

/**
 * Guardián exclusivo para "Mi Perfil Comercial" y gestión de comercio:
 * Valida que el usuario tenga rol de Comerciante (o nivel 3+) Y que su estado sea "aprobado".
 * Si está pendiente o rechazado, muestra un mensaje claro con su estado exacto.
 */
export function ComercianteRoute() {
  const { user, isAuthenticated, usuarioActual } = useAuth();
  const location = useLocation();

  const activeUser = user || usuarioActual;
  const isAuthed = isAuthenticated || Boolean(activeUser);

  if (!isAuthed || !activeUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Comprobar solicitudes comerciales activas en almacenamiento o sesión
  let estadoSolicitud = activeUser.estadoComercio || null;
  let motivoRechazo = null;

  try {
    const rawLocal = localStorage.getItem('cr_solicitudes_comercio');
    if (rawLocal) {
      const list = JSON.parse(rawLocal);
      const cleanUserCed = String(activeUser.cedula || '').replace(/[^0-9]/g, '');
      const sol = list.find((s) => {
        const sCed = String(s.cedula || s.cedulaJuridica || '').replace(/[^0-9]/g, '');
        return (cleanUserCed && sCed === cleanUserCed) || (s.usuarioId && s.usuarioId === activeUser.id);
      });
      if (sol) {
        estadoSolicitud = String(sol.estado || '').toLowerCase();
        motivoRechazo = sol.motivoRechazo || null;
      }
    }
  } catch (_e) {}

  const nivel = Number(activeUser.nivelAcceso || 0);
  const rol = String(activeUser.rol || '').toUpperCase();
  const esAdmin = nivel >= 4 || rol.includes('SUPER') || rol.includes('TERRITORIAL');
  const esAprobado = estadoSolicitud === 'aprobado' || activeUser.isComerciante || nivel === 3;

  // 1. Admins o Comerciantes Aprobados tienen pase libre
  if (esAdmin || (esAprobado && estadoSolicitud !== 'pendiente' && estadoSolicitud !== 'rechazado')) {
    return <Outlet />;
  }

  // 2. Si está PENDIENTE: Pantalla institucional con estado de revisión
  if (estadoSolicitud === 'pendiente') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: 'var(--cru-surface, #FFFFFF)',
            border: '1.5px solid #FDE68A',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 45px rgba(217, 119, 6, 0.1)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>⏳</span>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              border: '1px solid #FDE68A'
            }}
          >
            ESTADO: SOLICITUD PENDIENTE DE REVISIÓN
          </span>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cru-text, #062A77)', margin: '1rem 0 0.5rem' }}>
            Acreditación Comercial en Proceso
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--cru-text-soft, #64748B)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Estimado(a) ciudadano(a), tu solicitud para operar y publicar como comercio en el cantón está siendo revisada por los inspectores de la administración municipal.
            No podrás acceder a tu perfil comercial ni publicar productos hasta que tu acreditación sea <strong>aprobada</strong>.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/portal-ciudadano"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                backgroundColor: 'var(--cru-surface-muted, #F1F5F9)',
                color: 'var(--cru-text, #062A77)',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.88rem'
              }}
            >
              Volver al Portal Ciudadano
            </a>
            <a
              href="/perfil"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.88rem'
              }}
            >
              Consultar Mi Expediente
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Si está RECHAZADO: Pantalla con motivo legal y opción de subsanación
  if (estadoSolicitud === 'rechazado') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: 'var(--cru-surface, #FFFFFF)',
            border: '1.5px solid #FECACA',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 45px rgba(239, 68, 68, 0.1)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>❌</span>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              border: '1px solid #FECACA'
            }}
          >
            ESTADO: SOLICITUD RECHAZADA
          </span>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cru-text, #062A77)', margin: '1rem 0 0.5rem' }}>
            Acreditación Comercial No Aprobada
          </h2>

          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              margin: '1rem 0 1.5rem',
              fontSize: '0.85rem',
              color: '#991B1B',
              textAlign: 'left'
            }}
          >
            <strong>Motivo indicado por la municipalidad:</strong>
            <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>
              "{motivoRechazo || 'Incumplimiento de requisitos reglamentarios cantonales o patente tributaria no inscrita.'}"
            </p>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--cru-text-soft, #64748B)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Puedes subsanar los requisitos solicitados y presentar un nuevo trámite desde tu perfil ciudadano.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/portal-ciudadano"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                backgroundColor: 'var(--cru-surface-muted, #F1F5F9)',
                color: 'var(--cru-text, #062A77)',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.88rem'
              }}
            >
              Volver al Portal Ciudadano
            </a>
            <a
              href="/perfil"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                backgroundColor: '#0053AF',
                color: '#FFFFFF',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.88rem'
              }}
            >
              Iniciar Nueva Solicitud
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 4. Ciudadano sin solicitud previa
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: 'var(--cru-surface, #FFFFFF)',
          border: '1px solid var(--cru-border, #E2E8F0)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--cru-card-shadow, 0 10px 30px rgba(6, 42, 119, 0.08))'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#EFF6FF',
            color: '#0053AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <span style={{ fontSize: '2rem' }}>🏪</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cru-text, #062A77)', margin: '0 0 0.5rem' }}>
          Acreditación Comercial Requerida
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--cru-text-soft, #64748B)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          El módulo de <strong>Perfil Comercial</strong> está reservado para comerciantes y emprendedores acreditados por la municipalidad.
          Puedes registrar tu emprendimiento o solicitar tu patente desde tu perfil cívico.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/portal-ciudadano"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.4rem',
              borderRadius: '12px',
              backgroundColor: 'var(--cru-surface-muted, #F1F5F9)',
              color: 'var(--cru-text, #062A77)',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.88rem'
            }}
          >
            Portal Ciudadano
          </a>
          <a
            href="/perfil"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.4rem',
              borderRadius: '12px',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.88rem'
            }}
          >
            Solicitar Acreditación
          </a>
        </div>
      </div>
    </div>
  );
}

export const ProtectedRoute = RoleRoute;

export function AdminRoutes() {
  return <PrivateRoutes allowedRoles={["SUPER_ADMIN_NACIONAL", "GESTOR_TERRITORIAL"]} />;
}

export function ProvincialAdminRoutes() {
  return <PrivateRoutes allowedRoles={["SUPER_ADMIN_NACIONAL", "GESTOR_TERRITORIAL"]} />;
}

export default PrivateRoutes;
