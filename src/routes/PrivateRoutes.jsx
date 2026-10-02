import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Pantalla institucional mientras se validan credenciales de Estado
 */
function VerificandoCredenciales() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#00040D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#79a6ff'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 43, 127, 0.4)',
            border: '1px solid rgba(121, 166, 255, 0.4)',
            marginBottom: '1rem'
          }}
        >
          <ShieldCheck size={28} color="#79a6ff" strokeWidth={1.75} />
        </div>
        <div style={{ fontSize: '0.88rem', letterSpacing: '0.06em', color: '#CBD5E1', fontWeight: 600 }}>
          Verificando credenciales de Estado...
        </div>
      </div>
    </div>
  );
}

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
    r.includes('emprendedor') ||
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
  // SEGREGACIÓN ESTRICTA RBAC: Un usuario con rol CIUDADANO/TURISTA nunca debe acceder a la consola administrativa.
  // Si intenta acceder a /admin o /dashboard, es redirigido automáticamente al portal ciudadano (/portal-ciudadano).
  if (esRolCiudadano(userRole) || userLevel < 3) {
    return <Navigate to="/portal-ciudadano" replace />;
  }

  const nivelValido = userLevel >= minLevel;
  const rolValido =
    rolesPermitidos.length === 0 ||
    rolesPermitidos.some((r) => String(r).toLowerCase() === String(userRole).toLowerCase());

  if (nivelValido && rolValido) {
    return <Outlet />;
  }

  // Redirigir a /portal-ciudadano si no cumple con la jerarquía administrativa
  return <Navigate to="/portal-ciudadano" replace />;
}

/**
 * Guardián de Rutas Protegidas Estándar (ProtectedRoute)
 * Alias institucional para compatibilidad de enrutamiento
 */
export const ProtectedRoute = RoleRoute;

/**
 * Guardián de Rutas Administrativas (Nivel >= 3)
 * Admite Editor Municipal (N3), Administrador Provincial (N4) y Super Admin (N5).
 */
export function AdminRoutes() {
  return <RoleRoute minLevel={3} />;
}

/**
 * Guardián de Rutas Provinciales y Nacionales (Nivel >= 4)
 */
export function ProvincialAdminRoutes() {
  return <RoleRoute minLevel={4} />;
}

/**
 * Guardián de Rutas Privadas Generales (Nivel >= 1 o Ciudadano Autenticado)
 */
export default function PrivateRoutes() {
  return <RoleRoute minLevel={1} />;
}

