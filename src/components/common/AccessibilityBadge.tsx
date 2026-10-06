import React, { forwardRef, HTMLAttributes } from 'react';
import { Accessibility, Car, Navigation, Footprints, Heart, SquareParking } from 'lucide-react';

export type AccessibilityBadgeType =
  | 'ley-7600'
  | 'automovil-bajo'
  | 'acceso-4x4'
  | 'senderismo'
  | 'pet-friendly'
  | 'parqueo-disponible';

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
 * - Ley 7600: Accesibilidad universal garantizada (Icono Accessibility, borde verde esmeralda).
 * - Automóvil Bajo: Apto para vehículos livianos/urbanos (Icono Car).
 * - Acceso 4x4: Exigencia logística de tracción 4x4 (Icono Navigation).
 * - Senderismo: Acceso peatonal natural (Icono Footprints).
 * - Pet-Friendly: Espacio pet-friendly para animales de compañía/asistencia (Icono Heart).
 * - Parqueo Disponible: Estacionamiento seguro disponible (Icono SquareParking).
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
        label: 'Accesibilidad Total Ley 7600',
        ariaDescription: 'Espacio certificado con accesibilidad universal según Ley N° 7600',
        bg: 'var(--cru-accent-green-bg)',
        border: 'var(--cru-accent-green-border)',
        text: 'var(--cru-accent-green)',
        icon: (iconSize) => <Accessibility size={iconSize} className="shrink-0" style={{ color: 'var(--cru-accent-green)' }} />
      },
      'automovil-bajo': {
        label: 'Automóvil Bajo',
        ariaDescription: 'Destino con acceso apto para automóviles bajos y vehículos urbanos',
        bg: 'var(--cru-accent-sky-bg)',
        border: 'var(--cru-accent-sky-border)',
        text: 'var(--cru-accent-sky)',
        icon: (iconSize) => <Car size={iconSize} className="shrink-0" style={{ color: 'var(--cru-accent-sky)' }} />
      },
      'acceso-4x4': {
        label: 'Tracción 4x4 Requerida',
        ariaDescription: 'Ruta o destino que requiere vehículo con tracción en las cuatro ruedas',
        bg: 'var(--cru-accent-amber-bg)',
        border: 'var(--cru-accent-amber-border)',
        text: 'var(--cru-accent-amber)',
        icon: (iconSize) => <Navigation size={iconSize} className="shrink-0" style={{ color: 'var(--cru-accent-amber)' }} />
      },
      'senderismo': {
        label: 'Senderismo',
        ariaDescription: 'Acceso por sendero natural pedestre o caminata de montaña',
        bg: 'var(--cru-accent-green-bg)',
        border: 'var(--cru-accent-green-border)',
        text: 'var(--cru-accent-green)',
        icon: (iconSize) => <Footprints size={iconSize} className="shrink-0" style={{ color: 'var(--cru-accent-green)' }} />
      },
      'pet-friendly': {
        label: 'Pet-Friendly',
        ariaDescription: 'Lugar apto para mascotas y animales de asistencia',
        bg: 'var(--cru-accent-red-bg)',
        border: 'var(--cru-accent-red-border)',
        text: 'var(--cru-accent-red)',
        icon: (iconSize) => <Heart size={iconSize} className="shrink-0" style={{ color: 'var(--cru-accent-red)' }} />
      },
      'parqueo-disponible': {
        label: 'Parqueo Disponible',
        ariaDescription: 'Estacionamiento vehicular regulado y seguro disponible en el destino',
        bg: 'var(--cru-accent-blue-bg)',
        border: 'var(--cru-accent-blue-border)',
        text: 'var(--cru-accent-blue)',
        icon: (iconSize) => <SquareParking size={iconSize} className="shrink-0" style={{ color: 'var(--cru-accent-blue)' }} />
      }
    };

    const currentSpec = specs[type] || specs['ley-7600'];
    const displayLabel = customLabel || currentSpec.label;

    const sizeConfig: Record<
      AccessibilityBadgeSize,
      { font: string; padding: string; iconSize: number; gap: string }
    > = {
      sm: {
        font: '0.7rem',
        padding: '0.2rem 0.6rem',
        iconSize: 13,
        gap: '0.35rem'
      },
      md: {
        font: '0.78rem',
        padding: '0.3rem 0.8rem',
        iconSize: 15,
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
          border: `1.5px solid ${currentSpec.border}`,
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
          boxShadow: 'var(--cru-card-shadow, 0 2px 8px rgba(0, 4, 13, 0.25))',
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
