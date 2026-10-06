import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logotipo Oficial de Costa Rica Unidos
 * 100% Estático (sin rotación) y con navegación directa a la pantalla principal (/)
 */
export default function Logo({ size = '40px', showText = true, variant = 'auto', spin = false }) {
  const pixelHeight = typeof size === 'number' ? `${size}px` : (typeof size === 'string' && (size.endsWith('px') || size.endsWith('rem')) ? size : '40px');

  const primaryTextColor = variant === 'dark'
    ? '#FFFFFF'
    : (variant === 'light' ? '#062A77' : 'var(--cru-text, #062A77)');
  const secondaryTextColor = variant === 'dark'
    ? '#38BDF8'
    : (variant === 'light' ? '#C22727' : 'var(--cru-accent-sky, #38BDF8)');

  return (
    <Link
      to="/"
      className="flex items-center gap-3 cursor-pointer select-none group no-underline"
      aria-label="Ir a la página principal de Costa Rica Unidos"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        flexShrink: 0
      }}
    >
      {/* Isotipo Oficial (100% Estático - Sin animación de rotación) */}
      <img
        src="/logo.png"
        alt="Logo Costa Rica Unidos"
        style={{
          height: pixelHeight,
          maxHeight: pixelHeight,
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))'
        }}
        className="h-10 w-10 object-contain"
      />
      {showText && (
        <div
          className="flex flex-col select-none"
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
            userSelect: 'none'
          }}
        >
          <span
            className={`font-extrabold text-lg tracking-tight leading-none ${variant === 'dark' ? 'text-white' : 'text-[#062A77]'}`}
            style={{
              color: primaryTextColor,
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-main, "Poppins", sans-serif)'
            }}
          >
            COSTA RICA
          </span>
          <span
            className={`font-bold text-xs tracking-widest leading-tight mt-0.5 ${variant === 'dark' ? 'text-[#38BDF8]' : 'text-[#C22727]'}`}
            style={{
              color: secondaryTextColor,
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.24em',
              fontFamily: 'var(--font-main, "Poppins", sans-serif)'
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
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))'
      }}
      className={`h-10 w-10 object-contain ${className}`}
    />
  );
}
