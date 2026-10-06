import React, { forwardRef, HTMLAttributes, ReactNode, ElementType } from 'react';
import { GLASSMORPHISM_TOKENS } from '../../styles/themeEngine';

export type CivicCardLevel = 1 | 2 | 3;

export interface CivicCardProps extends HTMLAttributes<HTMLDivElement> {
  level?: CivicCardLevel;
  interactive?: boolean;
  provincialGlow?: boolean;
  as?: ElementType;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * CivicCard — Componente Atómico de Tarjeta Sovereign Civic Glass v2.1
 * 
 * Implementa:
 * - Radio normado de 16px (--radius-card)
 * - Niveles de Glassmorphism 1 (superficie sutil), 2 (tarjeta estándar) y 3 (elevado)
 * - Bordes translúcidos reflectivos y micro-interacciones suaves
 * - Soporte para resplandor provincial dinámico
 */
export const CivicCard = forwardRef<HTMLDivElement, CivicCardProps>(
  (
    {
      level = 2,
      interactive = false,
      provincialGlow = false,
      as: Component = 'div',
      header,
      footer,
      children,
      className = '',
      style,
      tabIndex,
      ...rest
    },
    ref
  ) => {
    const glassConfig = GLASSMORPHISM_TOKENS[`level${level}` as const] || GLASSMORPHISM_TOKENS.level2;

    const baseStyle: React.CSSProperties = {
      background: `var(--glass-level-${level}-bg, var(--cru-card-bg, ${glassConfig.background}))`,
      backdropFilter: `blur(${glassConfig.backdropBlur})`,
      WebkitBackdropFilter: `blur(${glassConfig.backdropBlur})`,
      border: `1px solid var(--glass-level-${level}-border, var(--cru-border, ${glassConfig.border}))`,
      borderRadius: 'var(--radius-card, 16px)',
      boxShadow: provincialGlow ? 'var(--glow-provincial, ' + glassConfig.boxShadow + ')' : 'var(--cru-card-shadow, ' + glassConfig.boxShadow + ')',
      color: 'var(--cru-text, #FFFFFF)',
      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style
    };

    return (
      <Component
        ref={ref}
        tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
        className={`civic-card civic-card-level-${level} ${interactive ? 'civic-card-interactive' : ''} ${
          provincialGlow ? 'provincial-glow-card' : ''
        } ${className}`}
        style={baseStyle}
        {...rest}
      >
        {header && (
          <header
            className="civic-card-header"
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--cru-border, rgba(255, 255, 255, 0.1))',
              background: 'var(--cru-surface-muted, rgba(255, 255, 255, 0.02))'
            }}
          >
            {header}
          </header>
        )}

        <div
          className="civic-card-body"
          style={{
            padding: '1.5rem',
            flex: '1 1 auto'
          }}
        >
          {children}
        </div>

        {footer && (
          <footer
            className="civic-card-footer"
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--cru-border, rgba(255, 255, 255, 0.08))',
              background: 'var(--cru-surface-muted, rgba(0, 0, 0, 0.18))'
            }}
          >
            {footer}
          </footer>
        )}
      </Component>
    );
  }
);

CivicCard.displayName = 'CivicCard';

export default CivicCard;
