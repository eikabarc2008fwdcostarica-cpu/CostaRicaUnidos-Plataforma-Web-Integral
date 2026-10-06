import React from 'react';
import { Link } from 'react-router-dom';
import TextRotator from './TextRotator';
import HeroScene from './HeroScene';
import useParallax from '../../hooks/useParallax';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/heroAnimations.css';

/**
 * ============================================================================
 * HeroMunicipal — Escena Ilustrada Natural Costarricense de Alto Impacto
 * Paisaje detallado: Volcán Arenal con fumarola activa continua, Lago Arenal,
 * Heliconias de fuego en primer plano, Tucán pico iris, Lapa roja y nubes.
 *
 * Incluye motor dinámico Día (Modo Claro) / Noche (Modo Oscuro) con transición suave de 0.8s.
 * ============================================================================
 */
export default function HeroMunicipal() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme, isDark } = useTheme();
  const isNight = theme === 'dark' || isDark;

  return (
    <section
      aria-label="Escena de Bienvenida Institucional Costa Rica Unidos"
      className="hero-municipal-container surface-brand"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '640px',
        backgroundColor: '#020617',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '3rem',
        boxSizing: 'border-box'
      }}
    >
      {/* ====================================================================
          1. CAPA DÍA (ESCENA ILUSTRADA SOL, VOLCÁN, LAGO, FAUNA Y FLORA)
          ==================================================================== */}
      <div
        aria-hidden="true"
        className={`hero-crossfade-layer hero-crossfade-day ${isNight ? 'is-hidden' : 'is-active'}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: isNight ? 0 : 1,
          transition: 'opacity 400ms ease-in-out',
          background: 'linear-gradient(180deg, #0B4BB8 0%, #1668CC 40%, #2D8DF0 75%, #64B5F6 100%)'
        }}
      >
        <HeroScene isNight={false} />
        {/* Filtro de contraste suave sobre capa día */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '65%',
            height: '100%',
            background: 'radial-gradient(ellipse at 20% 45%, rgba(6, 36, 95, 0.42) 0%, rgba(6, 36, 95, 0) 75%)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      </div>

      {/* ====================================================================
          2. CAPA NOCHE (ESCENA ILUSTRADA LUNA, ESTRELLAS, VOLCÁN Y LAGO NOCTURNO)
          ==================================================================== */}
      <div
        aria-hidden="true"
        className={`hero-crossfade-layer hero-crossfade-night ${isNight ? 'is-active' : 'is-hidden'}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: isNight ? 1 : 0,
          transition: 'opacity 400ms ease-in-out',
          background: 'linear-gradient(180deg, #020617 0%, #061536 45%, #0B2252 100%)'
        }}
      >
        <HeroScene isNight={true} />
        {/* Filtro de contraste suave sobre capa noche */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '65%',
            height: '100%',
            background: 'radial-gradient(ellipse at 20% 45%, rgba(2, 6, 23, 0.65) 0%, rgba(2, 6, 23, 0) 75%)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      </div>

      {/* ====================================================================
          3. CONTENIDO TEXTUAL HERO (MUNICIPAL, CÁLIDO E INSTITUCIONAL)
          ==================================================================== */}
      <div
        className="hero-content-wrapper"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '2rem 1.5rem 5.5rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          {/* Pill Badge: SEDE ELECTRÓNICA NACIONAL */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--sun, #FFCA26)',
                color: 'var(--ink, #131313)',
                padding: '0.4rem 1.15rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 18px rgba(255, 202, 38, 0.4)'
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--red, #C22727)'
                }}
              />
              SEDE ELECTRÓNICA NACIONAL
            </span>

            {user && (
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}
              >
                Hola, {user.nombre || 'Ciudadano'}
              </span>
            )}
          </div>

          {/* H1 Principal con TextRotator */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.3rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              margin: '0 0 1.25rem',
              fontFamily: 'var(--font-main, "Poppins", sans-serif)',
              textShadow: '0 2px 14px rgba(0, 16, 60, 0.6), 0 1px 3px rgba(0, 0, 0, 0.8)'
            }}
          >
            Gobierno local y servicios{' '}
            <TextRotator />
          </h1>

          {/* Subtítulo Institucional */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
              color: '#FFFFFF',
              lineHeight: 1.5,
              maxWidth: '690px',
              margin: '0 0 2.25rem',
              fontWeight: 400,
              textShadow: '0 2px 10px rgba(0, 16, 60, 0.55), 0 1px 2px rgba(0, 0, 0, 0.7)'
            }}
          >
            Consulte actas del Concejo, valide su cédula, tramite patentes y reporte incidencias viales en los 84 cantones de Costa Rica.
          </p>

          {/* Botones de Acción Primaria */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem'
            }}
          >
            {/* Botón Amarillo: Ingresar al servicio */}
            <Link
              to={user ? "/portal-ciudadano" : "/login"}
              style={{
                textDecoration: 'none',
                backgroundColor: 'var(--sun, #FFCA26)',
                color: 'var(--ink, #131313)',
                padding: '0.85rem 1.95rem',
                borderRadius: '999px',
                fontSize: '0.98rem',
                fontWeight: 800,
                letterSpacing: '0.01em',
                boxShadow: '0 8px 24px rgba(255, 202, 38, 0.45)',
                transition: 'all 0.22s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 202, 38, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 202, 38, 0.45)';
              }}
            >
              Ingresar al servicio
            </Link>

            {/* Botón Rojo: Ver trámites */}
            <a
              href="#tramites-servicios"
              style={{
                textDecoration: 'none',
                backgroundColor: 'var(--red, #C22727)',
                color: '#FFFFFF',
                padding: '0.85rem 1.95rem',
                borderRadius: '999px',
                fontSize: '0.98rem',
                fontWeight: 800,
                letterSpacing: '0.01em',
                boxShadow: '0 8px 24px rgba(194, 39, 39, 0.4)',
                transition: 'all 0.22s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(194, 39, 39, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(194, 39, 39, 0.4)';
              }}
            >
              Ver trámites
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroScene };
