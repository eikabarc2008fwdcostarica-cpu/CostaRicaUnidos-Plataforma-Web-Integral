import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FullScreenMenu from './FullScreenMenu';
import Logo from './common/Logo';
import { useLanguage } from '../context/LanguageContext';

/**
 * Navbar Minimalista Editorial con Navegación a Pantalla Completa (Full Screen Navigation - Estilo LPAS)
 * Swiss Design • 11 Módulos del Sistema • Selector de 8 Idiomas • Accesibilidad Ley 7600
 */
export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Cabecera Fija Minimalista y Transparente */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: 'rgba(0, 4, 13, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0.85rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Logotipo Oficial Costa Rica Unidos */}
          <Logo showText={true} />

          {/* Acciones Rápidas: Botón SOS 911 y Botón MENÚ + */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Botón Rojo Discreto SOS 911 */}
            <Link
              to="/seguridad-emergencias"
              style={{
                textDecoration: 'none',
                color: '#FF6B6B',
                backgroundColor: 'rgba(218, 41, 28, 0.12)',
                border: '1px solid rgba(218, 41, 28, 0.35)',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(218, 41, 28, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(218, 41, 28, 0.35)';
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#DA291C',
                  display: 'inline-block'
                }}
              />
              <span>SOS 911</span>
            </Link>

            {/* Botón Minimalista MENÚ + */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-label="Abrir menú de navegación a pantalla completa"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <span>{t('menuBoton') || 'MENÚ'}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 300, color: '#79a6ff' }}>+</span>
            </button>
          </div>
        </div>
      </header>

      {/* Menú a Pantalla Completa (Full Screen Navigation Overlay - Estilo LPAS) */}
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
