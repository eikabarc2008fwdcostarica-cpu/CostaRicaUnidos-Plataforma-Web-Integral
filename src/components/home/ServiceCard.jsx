import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NationalSymbolIcon from './NationalSymbolIcon';

/**
 * ServiceCard — Tarjeta de Trámite o Servicio Municipal
 * Cuadrícula de tarjetas de colores muy redondeadas (radius-card: 24px),
 * título, subtítulo, botón circular con flecha y Símbolo Patrio único en la esquina superior derecha.
 * Hover: elevación, microinteracción en el símbolo patrio (escala y rotación suave).
 */
export default function ServiceCard({
  id,
  symbolId,
  bg,
  textColor = '#FFFFFF',
  subTextColor = 'rgba(255, 255, 255, 0.82)',
  title,
  subtitle,
  path,
  arrowBg = '#FFFFFF',
  arrowColor = '#062A77'
}) {
  const activeSymbol = symbolId || id || 'ventanilla';

  return (
    <Link
      to={path}
      className="service-card-clean reveal-on-scroll"
      style={{
        textDecoration: 'none',
        backgroundColor: bg,
        borderRadius: 'var(--radius-card, 24px)',
        padding: '1.75rem 1.6rem 1.6rem',
        minHeight: '165px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Símbolo Patrio Costarricense en la esquina superior derecha */}
      <div
        className="national-symbol-corner"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '14px',
          right: '16px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          transition: 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.16))'
        }}
      >
        <NationalSymbolIcon symbolId={activeSymbol} size={34} />
      </div>

      {/* Contenido textual */}
      <div style={{ maxWidth: '85%', zIndex: 2 }}>
        <h3
          style={{
            fontSize: '1.18rem',
            fontWeight: 800,
            color: textColor,
            margin: '0 0 0.45rem',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-main, "Poppins", sans-serif)'
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '0.82rem',
            color: subTextColor,
            margin: 0,
            lineHeight: 1.45,
            fontWeight: 500
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Botón circular con flecha en la esquina inferior derecha */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1.5rem',
          zIndex: 2
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: arrowBg,
            color: arrowColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            transition: 'transform 0.2s ease'
          }}
        >
          <ArrowRight size={17} strokeWidth={2.4} />
        </div>
      </div>
    </Link>
  );
}
