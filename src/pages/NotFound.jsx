import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, FileText, Vote, MapPin, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/common/Logo';
import { useTheme } from '../context/ThemeContext';

/**
 * PANTALLA OFICIAL ERROR 404 — RECURSO NO ENCONTRADO
 * Arquitectura Sovereign Civic Glass • República de Costa Rica
 * Adaptación total a Modo Claro (Sede Electrónica) y Modo Oscuro (Obsidiana)
 * Optimizado para dispositivos móviles (360px - 480px)
 */
export default function NotFound() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Catálogo cívico indexado para recuperación rápida
  const catalogoCivico = [
    { titulo: 'Trámites y Sede Electrónica', ruta: '/portal-ciudadano', icon: FileText, tag: 'Servicios' },
    { titulo: 'Gobernanza y Actas del Concejo', ruta: '/gobernanza', icon: Vote, tag: 'Gaceta' },
    { titulo: 'Territorio 3D & Cartografía GIS', ruta: '/mapa-gis', icon: MapPin, tag: 'Cartografía' },
    { titulo: 'Emergencias 911 y Albergues CNE', ruta: '/seguridad-emergencias', icon: PhoneCall, tag: 'Seguridad' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/portal-ciudadano?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/portal-ciudadano');
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-bg, #00040D)',
        color: 'var(--theme-text-primary, #FFFFFF)',
        fontFamily: 'var(--font-main, system-ui, sans-serif)',
        overflowX: 'hidden'
      }}
    >
      <Navbar />

      <main
        className="civic-container"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="civic-glass-card"
          style={{
            maxWidth: '680px',
            width: '100%',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.75rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            backgroundColor: isLight ? '#FFFFFF' : 'rgba(0, 10, 28, 0.88)',
            border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: isLight
              ? '0 12px 40px rgba(0, 20, 137, 0.08), 0 2px 8px rgba(0,0,0,0.04)'
              : '0 25px 60px rgba(0, 4, 13, 0.85), 0 0 40px rgba(0, 20, 137, 0.3)'
          }}
        >
          {/* Sub-cinta sutil tricolor institucional superior */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #001489 0%, #001489 20%, #FFFFFF 20%, #FFFFFF 30%, #DA291C 30%, #DA291C 70%, #FFFFFF 70%, #FFFFFF 80%, #001489 80%, #001489 100%)'
            }}
          />

          {/* Logotipo Oficial */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo showText={true} />
          </div>

          {/* Insignia de Telemetría Oficial */}
          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span
              className="telemetry-badge"
              style={{
                backgroundColor: isLight ? 'rgba(0, 43, 127, 0.08)' : 'rgba(0, 16, 102, 0.55)',
                color: isLight ? '#002B7F' : '#79A6FF',
                borderColor: isLight ? 'rgba(0, 43, 127, 0.25)' : 'rgba(121, 166, 255, 0.35)',
                fontWeight: 700,
                fontSize: '0.74rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              CÓDIGO DE RESPUESTA HTTP 404 &bull; TERRITORIO NACIONAL
            </span>
          </div>

          {/* Número arquitectónico grande "404" con resplandor sutil */}
          <div
            style={{
              fontSize: 'clamp(4.5rem, 14vw, 7.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)',
              color: isLight ? '#002B7F' : '#FFFFFF',
              textShadow: isLight
                ? '0 4px 20px rgba(0, 43, 127, 0.2)'
                : '0 0 35px rgba(121, 166, 255, 0.45), 0 0 70px rgba(0, 43, 127, 0.35)',
              marginBottom: '0.75rem',
              userSelect: 'none'
            }}
          >
            404
          </div>

          {/* Titular Formal */}
          <h1
            style={{
              fontSize: 'clamp(1.35rem, 3.6vw, 1.85rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: 'var(--theme-text-primary, #FFFFFF)',
              marginBottom: '0.85rem',
              letterSpacing: '-0.01em'
            }}
          >
            Expediente o Página No Encontrada
          </h1>

          {/* Mensaje Cívico Institucional */}
          <p
            style={{
              color: 'var(--theme-text-secondary, #94A3B8)',
              fontSize: '0.98rem',
              lineHeight: 1.65,
              maxWidth: '520px',
              margin: '0 auto 2rem auto'
            }}
          >
            La sección, trámite o acta que intenta consultar no existe o ha sido reubicada conforme a la División Territorial Administrativa.
          </p>

          {/* Buscador Desplegable en Catálogo Cívico */}
          {showSearch && (
            <form
              onSubmit={handleSearchSubmit}
              style={{
                marginBottom: '1.75rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                animation: 'civicModalFadeIn 0.25s ease-out'
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escriba el trámite, acta, cantón o servicio que busca..."
                aria-label="Buscar en el catálogo cívico nacional"
                autoFocus
                style={{
                  flex: '1 1 240px',
                  minHeight: '44px',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(121, 166, 255, 0.4)',
                  backgroundColor: isLight ? '#F8FAFC' : 'rgba(0, 8, 25, 0.85)',
                  color: isLight ? '#0F172A' : '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn-sovereign-blue"
                style={{
                  minHeight: '44px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  flexShrink: 0
                }}
              >
                <Search className="w-4 h-4 mr-1.5" />
                <span>Explorar</span>
              </button>
            </form>
          )}

          {/* Botones de Acción Oficiales */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Botón 1: Regresar al Portal Nacional */}
            <Link
              to="/"
              className="btn-sovereign-blue"
              style={{
                minHeight: '48px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                flex: '1 1 220px',
                maxWidth: '280px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Regresar al Portal Nacional</span>
            </Link>

            {/* Botón 2: Buscar en el Catálogo Cívico */}
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className="btn-glass-secondary"
              aria-expanded={showSearch}
              style={{
                minHeight: '48px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                flex: '1 1 220px',
                maxWidth: '280px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isLight ? '#0F172A' : '#FFFFFF',
                backgroundColor: isLight ? 'rgba(0, 20, 137, 0.06)' : 'rgba(255, 255, 255, 0.08)',
                borderColor: isLight ? 'rgba(0, 20, 137, 0.2)' : 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <Search className="w-4 h-4 mr-2" />
              <span>Buscar en el Catálogo Cívico</span>
            </button>
          </div>

          {/* Accesos Rápidos de Recuperación Cívica */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.75rem',
              borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'left'
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isLight ? '#64748B' : '#94A3B8',
                display: 'block',
                marginBottom: '0.85rem',
                textAlign: 'center'
              }}
            >
              Rutas y Trámites Frecuentes
            </span>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '0.65rem'
              }}
            >
              {catalogoCivico.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.ruta}
                    to={item.ruta}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.95rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      backgroundColor: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.04)',
                      border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isLight ? '#0F172A' : '#FFFFFF',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      minHeight: '44px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isLight ? 'rgba(0, 20, 137, 0.08)' : 'rgba(0, 20, 137, 0.35)';
                      e.currentTarget.style.borderColor = '#79A6FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ItemIcon size={16} color={isLight ? '#002B7F' : '#79A6FF'} />
                      <span>{item.titulo}</span>
                    </div>
                    <ArrowRight size={14} color={isLight ? '#64748B' : '#94A3B8'} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
