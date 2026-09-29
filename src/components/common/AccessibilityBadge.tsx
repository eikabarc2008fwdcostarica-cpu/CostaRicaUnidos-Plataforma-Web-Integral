import React, { forwardRef, HTMLAttributes } from 'react';

export type AccessibilityBadgeType = 'ley-7600' | 'acceso-4x4' | 'pet-friendly';

export type AccessibilityBadgeSize = 'sm' | 'md' | 'lg';

export interface AccessibilityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type: AccessibilityBadgeType;
  size?: AccessibilityBadgeSize;
  showLabel?: boolean;
  customLabel?: string;
}

interface BadgeSpec {
  label: string;
  ariaDescription: string;
  bg: string;
  border: string;
  text: string;
  icon: (size: number) => React.ReactNode;
}

/**
 * AccessibilityBadge — Badges Estandarizados de Accesibilidad y Logística
 * 
 * Implementa identificadores universales normados para turismo y servicios cantonales:
 * - Ley 7600: Accesibilidad universal garantizada (rampas, señalética, baños adaptados).
 * - Acceso 4x4: Exigencia logística de tracción 4x4 en terreno montañoso o rural.
 * - Pet-friendly: Espacio apto para animales de compañía o asistencia.
 * - Radio normado: 9999px (--radius-pill)
 * - Cumplimiento estricto WCAG 2.1 AA.
 */
export const AccessibilityBadge = forwardRef<HTMLSpanElement, AccessibilityBadgeProps>(
  (
    {
      type,
      size = 'md',
      showLabel = true,
      customLabel,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const specs: Record<AccessibilityBadgeType, BadgeSpec> = {
      'ley-7600': {
        label: 'Ley 7600 Accesible',
        ariaDescription: 'Espacio certificado con accesibilidad universal según Ley N° 7600',
        bg: 'rgba(14, 165, 233, 0.18)',
        border: 'rgba(56, 189, 248, 0.45)',
        text: '#E0F2FE',
        icon: (iconSize) => (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Símbolo universal de accesibilidad en silla de ruedas */}
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6v6l4 2" />
            <path d="M9 13a5 5 0 1 0 5 5" />
            <path d="M16 19l3 2" />
          </svg>
        )
      },
      'acceso-4x4': {
        label: 'Requiere 4x4',
        ariaDescription: 'Ruta o destino que requiere vehículo con tracción en las cuatro ruedas',
        bg: 'rgba(245, 158, 11, 0.18)',
        border: 'rgba(251, 191, 36, 0.5)',
        text: '#FEF3C7',
        icon: (iconSize) => (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Ícono de todoterreno / montaña / 4x4 */}
            <path d="M3 17h2m14 0h2" />
            <circle cx="7" cy="17" r="3" />
            <circle cx="17" cy="17" r="3" />
            <path d="M5 14l3-6h8l3 6" />
            <path d="M10 8V5h4v3" />
          </svg>
        )
      },
      'pet-friendly': {
        label: 'Pet-Friendly',
        ariaDescription: 'Lugar apto para mascotas y animales de asistencia',
        bg: 'rgba(16, 185, 129, 0.18)',
        border: 'rgba(52, 211, 153, 0.5)',
        text: '#D1FAE5',
        icon: (iconSize) => (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Huella de mascota */}
            <path d="M11 19.5c-2 0-3.5-1.5-3.5-3.5 0-2.5 2.5-4 4.5-4s4.5 1.5 4.5 4c0 2-1.5 3.5-3.5 3.5h-2z" />
            <circle cx="6" cy="11" r="2" />
            <circle cx="10" cy="7" r="2" />
            <circle cx="14" cy="7" r="2" />
            <circle cx="18" cy="11" r="2" />
          </svg>
        )
      }
    };

    const currentSpec = specs[type];
    const displayLabel = customLabel || currentSpec.label;

    const sizeConfig: Record<
      AccessibilityBadgeSize,
      { font: string; padding: string; iconSize: number; gap: string }
    > = {
      sm: {
        font: '0.7rem',
        padding: '0.2rem 0.55rem',
        iconSize: 14,
        gap: '0.35rem'
      },
      md: {
        font: '0.78rem',
        padding: '0.3rem 0.8rem',
        iconSize: 16,
        gap: '0.45rem'
      },
      lg: {
        font: '0.875rem',
        padding: '0.45rem 1rem',
        iconSize: 18,
        gap: '0.55rem'
      }
    };

    const currentSize = sizeConfig[size];

    return (
      <span
        ref={ref}
        role="status"
        aria-label={currentSpec.ariaDescription}
        title={currentSpec.ariaDescription}
        className={`accessibility-badge accessibility-badge-${type} ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: currentSize.gap,
          borderRadius: 'var(--radius-pill, 9999px)',
          background: currentSpec.bg,
          border: `1px solid ${currentSpec.border}`,
          color: currentSpec.text,
          fontSize: currentSize.font,
          padding: currentSize.padding,
          fontFamily: "var(--font-telemetry, 'JetBrains Mono', monospace)",
          fontWeight: 600,
          lineHeight: 1,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          boxShadow: '0 2px 8px rgba(0, 4, 13, 0.25)',
          ...style
        }}
        {...rest}
      >
        <span
          className="accessibility-badge-icon"
          aria-hidden="true"
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          {currentSpec.icon(currentSize.iconSize)}
        </span>
        {showLabel && <span>{displayLabel}</span>}
      </span>
    );
  }
);

AccessibilityBadge.displayName = 'AccessibilityBadge';

export default AccessibilityBadge;
