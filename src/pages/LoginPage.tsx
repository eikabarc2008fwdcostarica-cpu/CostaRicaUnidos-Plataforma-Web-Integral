/**
 * ============================================================================
 * COSTA RICA UNIDOS — PÁGINA PRINCIPAL DE AUTENTICACIÓN CÍVICA (LOGIN)
 * Sustrato Obsidiana Soberana (#00040D), Sovereign Civic Glass v2.1
 * ============================================================================
 */

import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/auth/LoginForm';

interface LoginPageProps {
  initialMode?: 'LOGIN' | 'REGISTER';
}

export default function LoginPage({ initialMode = 'LOGIN' }: LoginPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#00040D',
        backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(0, 43, 127, 0.25) 0%, rgba(0, 4, 13, 0.98) 75%)',
        color: '#FFFFFF'
      }}
    >
      <Navbar />

      <main
        className="civic-container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem'
        }}
      >
        <LoginForm initialMode={initialMode} />

        {/* Garantías Legales y Técnicas */}
        <div
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.55)',
            maxWidth: '520px',
            lineHeight: 1.5
          }}
        >
          <span>
            🔒 <strong>Autodeterminación Informativa:</strong> La consulta de identificación se rige por la <em>Ley N° 8968</em>. No se almacenan datos privados ni contraseñas en servidores externos sin consentimiento expreso.
          </span>
          <div style={{ marginTop: '0.4rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)' }}>
            MINISTERIO DE HACIENDA • TSE • CONEXIÓN ENCRIPTADA TLS 1.3
          </div>
        </div>
      </main>
    </div>
  );
}
