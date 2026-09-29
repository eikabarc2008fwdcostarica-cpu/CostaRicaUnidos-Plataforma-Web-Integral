import React, { useEffect, useRef, useCallback, ReactNode, FC } from 'react';
import { X } from 'lucide-react';

export type CivicModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface CivicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: string;
  size?: CivicModalSize;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  id?: string;
  className?: string;
}

/**
 * CivicModal — Modal Cívico Soberano y Accesible (WCAG 2.1 AA)
 * 
 * Implementa:
 * - Radio normado de curvatura: 24px (--radius-modal)
 * - Trampeo de foco accesible (Focus Trap con soporte Tab / Shift+Tab)
 * - Retorno de foco al elemento desencadenador previo
 * - Cierre accesible mediante tecla Escape y click en sustrato backdrop
 * - Bloqueo de scroll del body mientras el diálogo permanece abierto
 * - Semántica ARIA completa: role="dialog", aria-modal="true", aria-labelledby, aria-describedby
 */
export const CivicModal: FC<CivicModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  id = 'civic-modal',
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  // Anchos máximos según el tamaño
  const sizeWidthMap: Record<CivicModalSize, string> = {
    sm: '420px',
    md: '600px',
    lg: '820px',
    xl: '1040px',
    full: '95vw'
  };

  // Manejo de trampeo de foco accesible
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

      // Bloquear scroll de la página principal
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Añadir oyente de teclado
      window.addEventListener('keydown', handleKeyDown);

      // Enfocar el primer elemento interactivo o el modal
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="civic-modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 4, 13, 0.85)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'civicModalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div
        ref={modalRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={`civic-modal-window ${className}`}
        style={{
          width: '100%',
          maxWidth: sizeWidthMap[size],
          maxHeight: size === 'full' ? '92vh' : '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(5, 12, 28, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-modal, 24px)',
          boxShadow: '0 25px 60px -15px rgba(0, 4, 13, 0.95), 0 0 40px rgba(0, 43, 127, 0.3)',
          overflow: 'hidden',
          outline: 'none',
          animation: 'civicModalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Cabecera del modal */}
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div>
            <h2
              id={titleId}
              style={{
                fontFamily: "var(--font-headline, 'Mistical Spring', serif)",
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              {title}
            </h2>
            {description && (
              <p
                id={descId}
                style={{
                  fontFamily: "var(--font-body, 'Paloseco', sans-serif)",
                  fontSize: '0.875rem',
                  color: '#94A3B8',
                  marginTop: '0.35rem',
                  marginBotom: 0
                }}
              >
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana modal"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                marginLeft: '1rem'
              }}
              className="civic-modal-close-btn"
            >
              <X size={20} />
            </button>
          )}
        </header>

        {/* Cuerpo del modal */}
        <div
          className="civic-modal-body"
          style={{
            padding: '1.75rem',
            overflowY: 'auto',
            flex: '1 1 auto',
            color: '#F8FAFC',
            fontFamily: "var(--font-body, 'Paloseco', sans-serif)",
            lineHeight: 1.6
          }}
        >
          {children}
        </div>

        {/* Pie del modal opcional */}
        {footer && (
          <footer
            style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default CivicModal;
