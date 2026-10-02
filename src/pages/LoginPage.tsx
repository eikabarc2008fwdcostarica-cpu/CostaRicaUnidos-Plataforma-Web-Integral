/**
 * ============================================================================
 * COSTA RICA UNIDOS — PÁGINA PRINCIPAL DE AUTENTICACIÓN CÍVICA (LOGIN)
 * Sustrato Obsidiana Soberana (#00040D), Sovereign Civic Glass v2.1
 * Redirección y compatibilidad unificada hacia Login.jsx
 * ============================================================================
 */

import React from 'react';
import Login from './Login';

interface LoginPageProps {
  initialMode?: 'LOGIN' | 'REGISTER';
}

export default function LoginPage({ initialMode = 'LOGIN' }: LoginPageProps) {
  return <Login />;
}
