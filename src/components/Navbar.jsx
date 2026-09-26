import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TypographicScaleSelector, useAccessibility } from './accessibility';

export default function Navbar() {
  const location = useLocation();
  const { openOnboarding } = useAccessibility();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(0, 4, 13, 0.75)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
    }}>
      <div className="civic-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.85rem 1.5rem'
      }}>
        {/* Marca / Identidad Institucional */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: '#FFFFFF'
        }}>
          {/* Isotipo Cívico Tricolor */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #001489 0%, #FFFFFF 50%, #DA291C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 20, 137, 0.5)',
            padding: '2px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              backgroundColor: '#00040D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#FFFFFF'
            }}>
              CR
            </div>
          </div>

          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              Costa Rica Unidos
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: '#79a6ff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-telemetry)'
            }}>
              Soberanía Cívica Digital
            </div>
          </div>
        </Link>

        {/* Controles de Navegación y Accesibilidad Universal */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}>
          {/* 1. Selector de Escala Tipográfica en 4 Fases (RNF-05.1 / Ley 7600) */}
          <TypographicScaleSelector />

          {/* 2. Botón de Lanzamiento de Onboarding Narrado por Voz */}
          <button
            type="button"
            onClick={openOnboarding}
            aria-label="Abrir recorrido interactivo asistido por voz"
            title="Recorrido guiado con narración asistida"
            style={{
              backgroundColor: 'rgba(0, 20, 137, 0.45)',
              border: '1px solid rgba(121, 166, 255, 0.35)',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              transition: 'var(--transition-smooth)'
            }}
          >
            <span>✨</span>
            <span>Guía de Voz</span>
          </button>

          {/* Enlaces de Navegación con Link */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.45rem'
          }}>
          <Link
            to="/"
            style={{
              color: isActive('/') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: isActive('/') ? 'rgba(0, 20, 137, 0.45)' : 'transparent',
              border: isActive('/') ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            Inicio
          </Link>

          <Link
            to="/mapa-gis"
            style={{
              color: isActive('/mapa-gis') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: isActive('/mapa-gis') ? 'rgba(0, 43, 127, 0.55)' : 'transparent',
              border: isActive('/mapa-gis') ? '1px solid #79a6ff' : '1px solid transparent',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            🗺️ Visor 3D GIS
          </Link>

          <Link
            to="/reportar-incidencia"
            style={{
              color: isActive('/reportar-incidencia') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: isActive('/reportar-incidencia') ? 'rgba(218, 41, 28, 0.4)' : 'transparent',
              border: isActive('/reportar-incidencia') ? '1px solid #DA291C' : '1px solid transparent',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            ⚠️ Reportar Avería
          </Link>

          <Link
            to="/seguridad-emergencias"
            style={{
              color: '#FFFFFF',
              backgroundColor: (isActive('/seguridad-emergencias') || isActive('/emergencias') || isActive('/sos'))
                ? '#DC2626'
                : 'rgba(220, 38, 38, 0.25)',
              border: (isActive('/seguridad-emergencias') || isActive('/emergencias') || isActive('/sos'))
                ? '1px solid #EF4444'
                : '1px solid rgba(220, 38, 38, 0.5)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: (isActive('/seguridad-emergencias') || isActive('/emergencias') || isActive('/sos'))
                ? '0 0 15px rgba(239, 68, 68, 0.6)'
                : '0 0 8px rgba(220, 38, 38, 0.25)',
              transition: 'var(--transition-smooth)'
            }}
            aria-label="Centro de Emergencias y Botonera SOS 911"
          >
            <span style={{ fontSize: '1rem' }}>🚨</span>
            <span>SOS 9-1-1</span>
          </Link>

          <Link
            to="/login"
            style={{
              color: isActive('/login') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: isActive('/login') ? 'rgba(0, 20, 137, 0.45)' : 'transparent',
              border: isActive('/login') ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            Acceso Cívico
          </Link>

          <Link
            to="/dashboard"
            style={{
              color: '#FFFFFF',
              backgroundColor: isActive('/dashboard') ? '#f03224' : 'var(--color-national-red)',
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginLeft: '0.5rem',
              boxShadow: '0 2px 10px rgba(218, 41, 28, 0.35)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Panel Cívico
          </Link>
        </nav>
        </div>
      </div>
    </header>
  );
}
