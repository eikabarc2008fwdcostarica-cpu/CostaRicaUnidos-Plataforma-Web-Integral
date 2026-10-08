import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logotipo Oficial de Costa Rica Unidos
 * 100% Estático (sin rotación) y con navegación directa a la pantalla principal (/)
 */
export default function Logo({ size = '40px', showText = true, variant = 'auto', spin = false }) {
  const pixelHeight = typeof size === 'number' ? `${size}px` : (typeof size === 'string' && (size.endsWith('px') || size.endsWith('rem')) ? size : '40px');

  // Variantes cromáticas explícitas de marca (sin filtros distorsionantes):
  // Modo Claro: Azul Soberano (#062A77) + Rojo Patrio (#C22727)
  // Modo Oscuro: Blanco Cívico (#FFFFFF) + Celeste Cielo (#38BDF8)
  const primaryClass = variant === 'dark'
    ? 'text-white'
    : (variant === 'light' ? 'text-[#062A77]' : 'text-[#062A77] dark:text-white');

  const secondaryClass = variant === 'dark'
    ? 'text-[#38BDF8]'
    : (variant === 'light' ? 'text-[#C22727]' : 'text-[#C22727] dark:text-[#38BDF8]');

  return (
    <Link
      to="/"
      className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group no-underline"
      aria-label="Ir a la página principal de Costa Rica Unidos"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        flexShrink: 0
      }}
    >
      {/* Isotipo Oficial (100% Estático - Sin alteración cromática) */}
      <img
        src="/logo.png"
        alt="Logo Costa Rica Unidos"
        style={{
          height: pixelHeight,
          maxHeight: pixelHeight,
          width: 'auto',
          objectFit: 'contain'
        }}
        className="h-9 w-9 sm:h-10 sm:w-10 object-contain shrink-0"
      />
      {showText && (
        <div
          className="hidden min-[380px]:flex flex-col select-none"
          style={{
            flexDirection: 'column',
            lineHeight: 1.1,
            userSelect: 'none'
          }}
        >
          <span
            className={`font-extrabold text-lg tracking-tight leading-none ${primaryClass}`}
            style={{
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-main, "Poppins", sans-serif)'
            }}
          >
            COSTA RICA
          </span>
          <span
            className={`font-bold text-xs tracking-widest leading-tight mt-0.5 ${secondaryClass}`}
            style={{
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
        objectFit: 'contain'
      }}
      className={`h-10 w-10 object-contain ${className}`}
    />
  );
}
