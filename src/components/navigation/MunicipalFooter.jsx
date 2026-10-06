import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MunicipalFooter — Pie de página institucional soberano y natural
 * Azul noche (#01004E) con silueta de pinos en el borde superior,
 * 4 columnas de navegación, franja tricolor inferior y leyenda © 2026.
 */
export default function MunicipalFooter() {
  return (
    <footer
      aria-label="Pie de página institucional Costa Rica Unidos"
      style={{
        backgroundColor: 'var(--night, #01004E)',
        color: '#FFFFFF',
        position: 'relative',
        paddingTop: '3.5rem',
        overflow: 'hidden'
      }}
    >
      {/* SILUETA DE PINOS EN EL BORDE SUPERIOR (Picos triangulares estilizados) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '28px',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <svg
          viewBox="0 0 1200 28"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Silueta de picos de pinos en blanco/azul */}
          <path
            d="
              M0,28
              L15,0 L30,28 L45,0 L60,28 L75,0 L90,28 L105,0 L120,28 L135,0 L150,28
              L165,0 L180,28 L195,0 L210,28 L225,0 L240,28 L255,0 L270,28 L285,0 L300,28
              L315,0 L330,28 L345,0 L360,28 L375,0 L390,28 L405,0 L420,28 L435,0 L450,28
              L465,0 L480,28 L495,0 L510,28 L525,0 L540,28 L555,0 L570,28 L585,0 L600,28
              L615,0 L630,28 L645,0 L660,28 L675,0 L690,28 L705,0 L720,28 L735,0 L750,28
              L765,0 L780,28 L795,0 L810,28 L825,0 L840,28 L855,0 L870,28 L885,0 L900,28
              L915,0 L930,28 L945,0 L960,28 L975,0 L990,28 L1005,0 L1020,28 L1035,0 L1050,28
              L1065,0 L1080,28 L1095,0 L1110,28 L1125,0 L1140,28 L1155,0 L1170,28 L1185,0 L1200,28
              Z
            "
            fill="#FFFFFF"
          />
        </svg>
      </div>

      <div
        className="reveal-on-scroll"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 3.5rem',
          boxSizing: 'border-box'
        }}
      >
        {/* 4 COLUMNAS DE NAVEGACIÓN */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}
        >
          {/* Columna 1: Identidad con Logotipo Oficial */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src="/logo.png"
                alt="Costa Rica Unidos"
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '0.02em',
                  fontFamily: 'var(--font-main, "Poppins", sans-serif)'
                }}
              >
                Costa Rica Unidos
              </span>
            </div>
            <p
              style={{
                fontSize: '0.86rem',
                color: 'rgba(253, 253, 255, 0.75)',
                lineHeight: 1.6,
                margin: '0 0 1rem',
                maxWidth: '280px'
              }}
            >
              Ventanilla Única y portal soberano de servicios ciudadanos y gobiernos locales para los 84 cantones.
            </p>
          </div>

          {/* Columna 2: La Muni */}
          <div>
            <h4
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                marginBottom: '1.15rem',
                textTransform: 'uppercase'
              }}
            >
              La Muni
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/gobernanza" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Alcaldía
                </Link>
              </li>
              <li>
                <Link to="/gobernanza" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Concejo Municipal
                </Link>
              </li>
              <li>
                <Link to="/participacion" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Políticas y Cabildos
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Trámites */}
          <div>
            <h4
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                marginBottom: '1.15rem',
                textTransform: 'uppercase'
              }}
            >
              Trámites
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/portal-ciudadano" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Generales
                </Link>
              </li>
              <li>
                <Link to="/portal-ciudadano" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Hacienda (ATV)
                </Link>
              </li>
              <li>
                <Link to="/reportar-incidencia" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Gestión urbana & averías
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Marco Legal */}
          <div>
            <h4
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                marginBottom: '1.15rem',
                textTransform: 'uppercase'
              }}
            >
              Marco legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="#ley-7600" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Ley N° 7600 (Accesibilidad)
                </a>
              </li>
              <li>
                <a href="#ley-8968" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Ley N° 8968 (Datos Personales)
                </a>
              </li>
              <li>
                <Link to="/gobernanza" style={{ color: 'rgba(253, 253, 255, 0.8)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Datos abiertos & Gaceta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* LÍNEA DE CRÉDITO Y AÑO */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'rgba(253, 253, 255, 0.7)'
          }}
        >
          <span>© 2026 República de Costa Rica. Sistema Nacional de Gobiernos Locales.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>7 Provincias</span>
            <span>•</span>
            <span style={{ color: 'var(--sun, #FFCA26)' }}>84 Cantones</span>
            <span>•</span>
            <span>492 Distritos</span>
          </div>
        </div>
      </div>

      {/* LÍNEA TRICOLOR INFERIOR DECORATIVA */}
      <div
        aria-hidden="true"
        style={{
          height: '6px',
          width: '100%',
          display: 'flex'
        }}
      >
        <div style={{ flex: 1, backgroundColor: 'var(--blue, #0053AF)' }} />
        <div style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
        <div style={{ flex: 2, backgroundColor: 'var(--red, #C22727)' }} />
        <div style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
        <div style={{ flex: 1, backgroundColor: 'var(--blue, #0053AF)' }} />
      </div>
    </footer>
  );
}
