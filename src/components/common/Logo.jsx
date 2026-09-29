import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logotipo Oficial de Costa Rica Unidos
 * Dimensiones estrictas, compactas y proporcionales (altura máxima 40px)
 */
export default function Logo({ size = '40px', showText = true }) {
  const pixelHeight = typeof size === 'number' ? `${size}px` : (typeof size === 'string' && (size.endsWith('px') || size.endsWith('rem')) ? size : '40px');

  return (
    <Link
      to="/"
      className="flex items-center gap-3 no-underline group"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        flexShrink: 0
      }}
    >
      {/* Isotipo Oficial (Corazón y Manos) */}
      <img
        src="/logo.png"
        alt="Costa Rica Unidos"
        style={{
          height: pixelHeight,
          maxHeight: pixelHeight,
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
        }}
        className="h-10 w-auto object-contain transition-transform duration-200 hover:scale-105"
      />
      {showText && (
        <div
          className="flex flex-col leading-tight"
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
            userSelect: 'none'
          }}
        >
          <span
            className="text-white font-black text-lg md:text-xl tracking-wider"
            style={{
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.15rem',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-main, system-ui, sans-serif)'
            }}
          >
            COSTA RICA
          </span>
          <span
            className="text-sky-400 font-bold text-xs tracking-widest"
            style={{
              color: '#38BDF8',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.24em',
              marginTop: '1px',
              fontFamily: 'var(--font-main, system-ui, sans-serif)'
            }}
          >
            UNIDOS
          </span>
        </div>
      )}
    </Link>
  );
}

export function Isotipo({ size = '40px', className = '' }) {
  const pixelHeight = typeof size === 'number' ? `${size}px` : (typeof size === 'string' && (size.endsWith('px') || size.endsWith('rem')) ? size : '40px');
  return (
    <img
      src="/logo.png"
      alt="Isotipo Costa Rica Unidos"
      style={{
        height: pixelHeight,
        maxHeight: pixelHeight,
        width: 'auto',
        objectFit: 'contain',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
      }}
      className={`h-10 w-auto object-contain transition-transform duration-200 hover:scale-105 ${className}`}
    />
  );
}
