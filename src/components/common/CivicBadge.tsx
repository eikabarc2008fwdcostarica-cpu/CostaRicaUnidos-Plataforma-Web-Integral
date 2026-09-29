import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

export type CivicBadgeVariant =
  | 'default'
  | 'provincial'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ctp'
  | 'outline';

export type CivicBadgeSize = 'sm' | 'md' | 'lg';

export interface CivicBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: CivicBadgeVariant;
  size?: CivicBadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  dotColor?: string;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * CivicBadge — Componente Atómico de Badge Tipo Píldora
 * 
 * Implementa:
 * - Radio normado de curvatura máxima: 9999px (--radius-pill)
 * - Variantes funcionales para etiquetas institucionales, especialidades CTP y estados
 * - Cumplimiento WCAG 2.1 AA con ratios de contraste superiores a 4.5:1
 */
export const CivicBadge = forwardRef<HTMLSpanElement, CivicBadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      dot = false,
      dotColor,
      ariaLabel,
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Dimensiones según tamaño
    const sizeStyles: Record<CivicBadgeSize, React.CSSProperties> = {
      sm: {
        fontSize: '0.7rem',
        padding: '0.2rem 0.6rem',
        gap: '0.35rem'
      },
      md: {
        fontSize: '0.78rem',
        padding: '0.3rem 0.85rem',
        gap: '0.45rem'
      },
      lg: {
        fontSize: '0.875rem',
        padding: '0.45rem 1.05rem',
        gap: '0.55rem'
      }
    };

    // Estilos visuales por variante
    const variantStyles: Record<CivicBadgeVariant, React.CSSProperties> = {
      default: {
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#F8FAFC',
        border: '1px solid rgba(255, 255, 255, 0.16)'
      },
      provincial: {
        background: 'var(--color-provincial-surface, rgba(0, 43, 127, 0.25))',
        color: '#FFFFFF',
        border: '1px solid var(--color-provincial-border, rgba(0, 43, 127, 0.45))',
        boxShadow: '0 0 10px rgba(0, 43, 127, 0.3)'
      },
      info: {
        background: 'rgba(14, 165, 233, 0.18)',
        color: '#7DD3FC',
        border: '1px solid rgba(56, 189, 248, 0.35)'
      },
      success: {
        background: 'rgba(16, 185, 129, 0.18)',
        color: '#6EE7B7',
        border: '1px solid rgba(52, 211, 153, 0.38)'
      },
      warning: {
        background: 'rgba(245, 158, 11, 0.18)',
        color: '#FDE68A',
        border: '1px solid rgba(251, 191, 36, 0.42)'
      },
      danger: {
        background: 'rgba(239, 68, 68, 0.18)',
        color: '#FCA5A5',
        border: '1px solid rgba(248, 113, 113, 0.4)'
      },
      ctp: {
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
        color: '#C7D2FE',
        border: '1px solid rgba(167, 139, 250, 0.42)',
        boxShadow: '0 0 12px rgba(124, 58, 237, 0.25)'
      },
      outline: {
        background: 'transparent',
        color: '#E2E8F0',
        border: '1px solid rgba(255, 255, 255, 0.28)'
      }
    };

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-pill, 9999px)',
      fontFamily: "var(--font-telemetry, 'JetBrains Mono', monospace)",
      fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      userSelect: 'none',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      transition: 'all 0.2s ease',
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style
    };

    return (
      <span
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={`civic-badge civic-badge-${variant} civic-badge-${size} ${className}`}
        style={baseStyle}
        {...rest}
      >
        {dot && (
          <span
            className="civic-badge-dot"
            aria-hidden="true"
            style={{
              width: size === 'sm' ? '6px' : '8px',
              height: size === 'sm' ? '6px' : '8px',
              borderRadius: '50%',
              backgroundColor: dotColor || 'currentColor',
              display: 'inline-block',
              flexShrink: 0
            }}
          />
        )}
        {icon && (
          <span className="civic-badge-icon" aria-hidden="true" style={{ display: 'inline-flex' }}>
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    );
  }
);

CivicBadge.displayName = 'CivicBadge';

export default CivicBadge;
