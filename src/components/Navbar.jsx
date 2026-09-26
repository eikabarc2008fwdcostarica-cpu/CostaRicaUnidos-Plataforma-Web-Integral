import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

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

        {/* Enlaces de Navegación con Link */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
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
    </header>
  );
}
