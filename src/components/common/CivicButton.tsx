import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

export type CivicButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'provincial'
  | 'accent'
  | 'success'
  | 'warning';

export type CivicButtonSize = 'sm' | 'md' | 'lg';

export interface CivicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CivicButtonVariant;
  size?: CivicButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

/**
 * CivicButton — Componente Atómico de Botón Soberano
 * 
 * Cumple estrictamente con el sistema Sovereign Civic Glass v2.1:
 * - Radio de curvatura normado: 8px (--radius-control)
 * - Efecto glassmorphism sutil con realce en hover/focus
 * - Accesibilidad WCAG 2.1 AA: soporte completo de teclado, outline de enfoque, ARIA busy/disabled
 */
export const CivicButton = forwardRef<HTMLButtonElement, CivicButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      children,
      className = '',
      style,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // Dimensiones y paddings según tamaño
    const sizeStyles: Record<CivicButtonSize, React.CSSProperties> = {
      sm: {
        fontSize: '0.8125rem',
        padding: '0.45rem 0.85rem',
        minHeight: '36px',
        gap: '0.45rem'
      },
      md: {
        fontSize: '0.9375rem',
        padding: '0.625rem 1.25rem',
        minHeight: '44px', // Tamaño táctil mínimo recomendado WCAG
        gap: '0.6rem'
      },
      lg: {
        fontSize: '1.0625rem',
        padding: '0.8rem 1.6rem',
        minHeight: '52px',
        gap: '0.75rem'
      }
    };

    // Estilos por variante visual
    const variantStyles: Record<CivicButtonVariant, React.CSSProperties> = {
      primary: {
        background: 'linear-gradient(135deg, rgba(0, 43, 127, 0.95) 0%, rgba(0, 20, 137, 1) 100%)',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 4px 14px rgba(0, 43, 127, 0.4)'
      },
      secondary: {
        background: 'var(--cru-surface-muted)',
        color: 'var(--cru-text)',
        border: '1px solid var(--cru-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--cru-card-shadow, 0 4px 12px rgba(0, 4, 13, 0.2))'
      },
      outline: {
        background: 'transparent',
        color: 'var(--cru-text)',
        border: '1.5px solid var(--cru-border-strong, var(--cru-border))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      },
      ghost: {
        background: 'transparent',
        color: 'var(--cru-text)',
        border: '1px solid transparent'
      },
      danger: {
        background: 'linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)',
        color: '#FFFFFF',
        border: '1px solid var(--cru-accent-red-border, rgba(185, 28, 28, 0.35))',
        boxShadow: '0 4px 16px rgba(185, 28, 28, 0.35)'
      },
      provincial: {
        background: 'var(--color-provincial-primary, #002B7F)',
        color: 'var(--color-provincial-text, #FFFFFF)',
        border: '1px solid var(--color-provincial-border, rgba(255, 255, 255, 0.3))',
        boxShadow: 'var(--glow-provincial, 0 4px 16px rgba(0, 43, 127, 0.4))'
      },
      accent: {
        background: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
        color: '#FFFFFF',
        border: '1px solid var(--cru-accent-green-border, rgba(4, 120, 87, 0.35))',
        boxShadow: '0 4px 18px rgba(4, 120, 87, 0.35)'
      },
      success: {
        background: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
        color: '#FFFFFF',
        border: '1px solid var(--cru-accent-green-border, rgba(4, 120, 87, 0.35))',
        boxShadow: '0 4px 18px rgba(4, 120, 87, 0.35)'
      },
      warning: {
        background: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
        color: '#FFFFFF',
        border: '1px solid var(--cru-accent-amber-border, rgba(180, 83, 9, 0.35))',
        boxShadow: '0 4px 18px rgba(180, 83, 9, 0.35)'
      }
    };

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "var(--font-body, 'Paloseco', 'Plus Jakarta Sans', sans-serif)",
      fontWeight: 600,
      lineHeight: 1.2,
      borderRadius: 'var(--radius-control, 8px)',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.65 : 1,
      width: fullWidth ? '100%' : 'auto',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden',
      textDecoration: 'none',
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={`civic-btn civic-btn-${variant} civic-btn-${size} ${className}`}
        style={baseStyle}
        {...rest}
      >
        {isLoading && (
          <span
            className="civic-btn-spinner"
            aria-hidden="true"
            style={{
              width: '1em',
              height: '1em',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'civicSpin 0.75s linear infinite',
              display: 'inline-block'
            }}
          />
        )}
        {!isLoading && leftIcon && (
          <span className="civic-btn-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && (
          <span className="civic-btn-icon-right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

CivicButton.displayName = 'CivicButton';

export default CivicButton;
