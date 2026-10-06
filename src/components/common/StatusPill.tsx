import React, { forwardRef, HTMLAttributes } from 'react';

export type StatusPillType =
  | 'open'
  | 'abierto'
  | 'disponible'
  | 'maintenance'
  | 'mantenimiento'
  | 'occupied'
  | 'alquiler'
  | 'ocupado'
  | 'reservado_escuelas'
  | 'reservado';

export type StatusPillSize = 'sm' | 'md' | 'lg';

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  status: StatusPillType;
  label?: string;
  size?: StatusPillSize;
  showPulse?: boolean;
}

interface StatusVisualConfig {
  defaultLabel: string;
  bg: string;
  border: string;
  text: string;
  dotColor: string;
  glow: string;
}

/**
 * StatusPill — Semáforo Dinámico Cantonal (Sovereign Civic Glass v2.1)
 * 
 * Utilizado ampliamente en el Ecosistema Deportivo CCDR, instalaciones y ferias:
 * - Verde: Abierto al Público
 * - Amarillo: Mantenimiento Programado
 * - Azul: Reservado para Escuelas Formativas y Selecciones
 * - Rojo: Alquiler / Ocupado
 * - Radio normado: 9999px (--radius-pill)
 * - Cumplimiento WCAG 2.1 AA con contraste riguroso y marcado semántico accesible
 */
export const StatusPill = forwardRef<HTMLSpanElement, StatusPillProps>(
  (
    {
      status,
      label,
      size = 'md',
      showPulse = true,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Normalizar estado
    const normalizedStatus = status.toLowerCase();

    let config: StatusVisualConfig;

    if (
      normalizedStatus === 'open' ||
      normalizedStatus === 'abierto' ||
      normalizedStatus === 'disponible'
    ) {
      config = {
        defaultLabel: 'Abierto al Público',
        bg: 'var(--cru-accent-green-bg)',
        border: 'var(--cru-accent-green-border)',
        text: 'var(--cru-accent-green)',
        dotColor: 'var(--cru-accent-green)',
        glow: '0 0 10px var(--cru-accent-green-bg)'
      };
    } else if (
      normalizedStatus === 'maintenance' ||
      normalizedStatus === 'mantenimiento'
    ) {
      config = {
        defaultLabel: 'Mantenimiento Programado',
        bg: 'var(--cru-accent-amber-bg)',
        border: 'var(--cru-accent-amber-border)',
        text: 'var(--cru-accent-amber)',
        dotColor: 'var(--cru-accent-amber)',
        glow: '0 0 10px var(--cru-accent-amber-bg)'
      };
    } else if (
      normalizedStatus === 'reservado_escuelas' ||
      normalizedStatus === 'reservado'
    ) {
      config = {
        defaultLabel: 'Reservado para Escuelas Formativas',
        bg: 'var(--cru-accent-sky-bg)',
        border: 'var(--cru-accent-sky-border)',
        text: 'var(--cru-accent-sky)',
        dotColor: 'var(--cru-accent-sky)',
        glow: '0 0 10px var(--cru-accent-sky-bg)'
      };
    } else {
      // occupied / alquiler / ocupado
      config = {
        defaultLabel: 'Uso Reglamentado',
        bg: 'var(--cru-accent-red-bg)',
        border: 'var(--cru-accent-red-border)',
        text: 'var(--cru-accent-red)',
        dotColor: 'var(--cru-accent-red)',
        glow: '0 0 10px var(--cru-accent-red-bg)'
      };
    }

    const displayLabel = label || config.defaultLabel;

    // Dimensiones
    const sizeConfig: Record<StatusPillSize, { font: string; padding: string; dot: string; gap: string }> = {
      sm: {
        font: '0.7rem',
        padding: '0.2rem 0.6rem',
        dot: '6px',
        gap: '0.35rem'
      },
      md: {
        font: '0.78rem',
        padding: '0.3rem 0.85rem',
        dot: '8px',
        gap: '0.5rem'
      },
      lg: {
        font: '0.875rem',
        padding: '0.45rem 1.05rem',
        dot: '10px',
        gap: '0.6rem'
      }
    };

    const currentSize = sizeConfig[size];

    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={`Estado: ${displayLabel}`}
        className={`status-pill status-pill-${normalizedStatus} ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: currentSize.gap,
          borderRadius: 'var(--radius-pill, 9999px)',
          background: config.bg,
          border: `1px solid ${config.border}`,
          color: config.text,
          boxShadow: config.glow,
          fontSize: currentSize.font,
          padding: currentSize.padding,
          fontFamily: "var(--font-telemetry, 'JetBrains Mono', monospace)",
          fontWeight: 600,
          letterSpacing: '0.02em',
          lineHeight: 1,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          ...style
        }}
        {...rest}
      >
        <span
          className="status-pill-dot-container"
          aria-hidden="true"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: currentSize.dot,
            height: currentSize.dot
          }}
        >
          {showPulse && (
            <span
              style={{
                position: 'absolute',
                inset: '-2px',
                borderRadius: '50%',
                backgroundColor: config.dotColor,
                opacity: 0.75,
                animation: 'civicPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
          )}
          <span
            style={{
              position: 'relative',
              width: currentSize.dot,
              height: currentSize.dot,
              borderRadius: '50%',
              backgroundColor: config.dotColor
            }}
          />
        </span>
        <span>{displayLabel}</span>
      </span>
    );
  }
);

StatusPill.displayName = 'StatusPill';

export default StatusPill;
