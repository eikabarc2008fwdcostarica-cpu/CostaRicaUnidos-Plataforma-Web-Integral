import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Componente Guardián de Rutas Privadas
 * Evalúa el estado de autenticación cívica del ciudadano.
 * Devuelve <Outlet /> si está autenticado, o redirige a /login si no lo está.
 */
export default function PrivateRoutes() {
  // Estado base de autenticación cívica para la demostración
  const isAuthenticated = true;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
