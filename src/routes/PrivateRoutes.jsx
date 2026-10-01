import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Guardián de Rutas Privadas
 * Evalúa el estado de autenticación cívica del ciudadano.
 * Devuelve <Outlet /> si está autenticado, o redirige a /login si no lo está.
 */
export default function PrivateRoutes() {
  const { estaAutenticado, isAuthenticated, cargando } = useAuth();

  if (cargando) {
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
          <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🇨🇷</div>
          <div style={{ fontSize: '0.85rem', letterSpacing: '0.05em', color: '#94A3B8' }}>
            Verificando credenciales soberanas...
          </div>
        </div>
      </div>
    );
  }

  const authed = estaAutenticado ?? isAuthenticated ?? false;

  return authed ? <Outlet /> : <Navigate to="/login" replace />;
}
