import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
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
 * Componente Guardián de Rutas por Rol y Nivel de Acceso (RBAC)
 * Valida autenticación activa, nivel de acceso mínimo y roles específicos normados.
 * En caso de credenciales insuficientes, redirige formalmente a /403 (Acceso Denegado).
 */
export function RoleRoute({ minLevel = 2, rolesPermitidos = [] }) {
  const { usuarioActual, user, estaAutenticado, isAuthenticated, cargando, isLoading } = useAuth();

  const loading = cargando ?? isLoading ?? false;
  const authed = estaAutenticado ?? isAuthenticated ?? false;
  const activeUser = usuarioActual || user;

  if (loading) return <VerificandoCredenciales />;
  if (!authed) return <Navigate to="/login" replace />;

  const nivelValido = activeUser && (activeUser.nivelAcceso ?? 0) >= minLevel;
  const rolValido =
    rolesPermitidos.length === 0 ||
    (activeUser && rolesPermitidos.includes(activeUser.rol));

  // Si no cumple el nivel o el rol, redirige a la pantalla 403 (Acceso Denegado)
  return nivelValido && rolValido ? <Outlet /> : <Navigate to="/403" replace />;
}

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
 * Guardián de Rutas Privadas Generales (Nivel >= 2)
 */
export default function PrivateRoutes() {
  return <RoleRoute minLevel={2} />;
}
