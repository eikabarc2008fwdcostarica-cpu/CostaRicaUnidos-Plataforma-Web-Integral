import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Guardián de Rutas Privadas
 * Evalúa el estado de autenticación cívica del ciudadano.
 * Devuelve <Outlet /> si está autenticado, o redirige a /login si no lo está.
 */
export default function PrivateRoutes() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
