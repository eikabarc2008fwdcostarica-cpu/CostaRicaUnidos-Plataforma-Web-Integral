/**
 * ============================================================================
 * COSTA RICA UNIDOS — COMPONENTE DE CONFIRMACIÓN CÍVICO (CONFIRM DIALOG)
 * Sistema de Diseño Sovereign Civic Glass • Accesibilidad WCAG 2.1 AA
 * ============================================================================
 * 
 * Cumple con los requerimientos de la plataforma:
 * - role="alertdialog", aria-modal="true", aria-labelledby, aria-describedby
 * - Renderizado en Portal al final de document.body
 * - Focus Trap accesible dentro del modal (Tab / Shift+Tab)
 * - Retorno de foco al elemento previo que abrió el diálogo
 * - Enfoque inicial seguro: en diálogos 'danger', enfoca "Cancelar" por defecto
 * - Cierre accesible con tecla Escape y clic en backdrop (equivale a Cancelar)
 * - Bloqueo de scroll en document.body mientras está abierto
 * - Soporte de tema claro / oscuro mediante variables CSS institucionales (--cru-*)
 * - Micro-animación suave (fade + scale, ~180ms) respetando prefers-reduced-motion
 * - Estado de carga asíncrono con spinner para prevenir doble clic
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, Info, CheckCircle2, X, Loader2 } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = '¿Está seguro de continuar?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning' | 'info' | 'success'
  isLoading = false,
  onConfirm,
  onCancel
}) {
  const [mounted, setMounted] = useState(false);
  const cancelBtnRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const dialogCardRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Asegurar que document está disponible en SSR/Vite
  useEffect(() => {
    setMounted(true);
  }, []);

  // Manejo de foco, accesibilidad y bloqueo de scroll
  useEffect(() => {
    if (!isOpen) return;

    // 1. Guardar el elemento previamente enfocado para restaurarlo al cerrar
    previousFocusRef.current = document.activeElement;

    // 2. Bloquear scroll del body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 3. Enfocar según variante:
    // Si es destructivo ('danger'), enfocar el botón de "Cancelar" para evitar borrado accidental
    // Si es otra variante, enfocar el botón de confirmación
    const focusTimer = setTimeout(() => {
      if (variant === 'danger' && cancelBtnRef.current) {
        cancelBtnRef.current.focus();
      } else if (confirmBtnRef.current) {
        confirmBtnRef.current.focus();
      }
    }, 40);

    // 4. Focus Trap & Escape handler
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading && onCancel) {
          onCancel();
        }
        return;
      }

      if (e.key === 'Tab' && dialogCardRef.current) {
        const focusableElements = dialogCardRef.current.querySelectorAll(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Restaurar foco al elemento que abrió el modal
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        try {
          previousFocusRef.current.focus();
        } catch (_) {}
      }
    };
  }, [isOpen, variant, isLoading, onCancel]);

  if (!mounted || !isOpen) return null;

  // Renderizar icono y colores según la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-red-500" strokeWidth={2} />,
          iconBg: 'bg-red-500/10 border-red-500/25',
          btnConfirmClass:
            'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-600/30 border-red-600 focus-visible:ring-red-500',
          accentBorder: 'rgba(239, 68, 68, 0.4)'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" strokeWidth={2} />,
          iconBg: 'bg-amber-500/10 border-amber-500/25',
          btnConfirmClass:
            'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-lg shadow-amber-600/30 border-amber-600 focus-visible:ring-amber-500',
          accentBorder: 'rgba(245, 158, 11, 0.4)'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={2} />,
          iconBg: 'bg-emerald-500/10 border-emerald-500/25',
          btnConfirmClass:
            'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 border-emerald-600 focus-visible:ring-emerald-500',
          accentBorder: 'rgba(16, 185, 129, 0.4)'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 text-sky-400" strokeWidth={2} />,
          iconBg: 'bg-sky-500/10 border-sky-500/25',
          btnConfirmClass:
            'bg-[#002B7F] hover:bg-[#001489] active:bg-[#00085A] text-white shadow-lg shadow-blue-900/30 border-[#002B7F] focus-visible:ring-sky-400',
          accentBorder: 'rgba(56, 189, 248, 0.4)'
        };
    }
  };

  const variantStyle = getVariantStyles();

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 select-none"
      style={{
        backgroundColor: 'rgba(0, 4, 13, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={(e) => {
        // Clic en el backdrop equivale a cancelar
        if (e.target === e.currentTarget && !isLoading && onCancel) {
          onCancel();
        }
      }}
    >
      <div
        ref={dialogCardRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative w-full max-w-[460px] p-6 sm:p-7 rounded-3xl transition-all"
        style={{
          backgroundColor: 'var(--cru-surface-card, #0D1527)',
          color: 'var(--cru-text, #FFFFFF)',
          border: `1.5px solid var(--cru-border, ${variantStyle.accentBorder})`,
          boxShadow: 'var(--cru-card-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.75))',
          animation: 'confirmModalEnter 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Acento tricolor costarricense sutil en el borde superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '24px',
            right: '24px',
            height: '3px',
            borderRadius: '0 0 4px 4px',
            background: 'linear-gradient(90deg, #001489 0%, #FFFFFF 33.3%, #DA291C 66.6%, #001489 100%)',
            opacity: 0.85
          }}
        />

        {/* Botón cerrar en la esquina superior derecha */}
        <button
          type="button"
          onClick={() => !isLoading && onCancel && onCancel()}
          disabled={isLoading}
          aria-label="Cerrar diálogo y cancelar"
          className="absolute top-5 right-5 p-1.5 rounded-full text-cru-text-secondary hover:text-cru-text hover:bg-cru-surface-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-40"
          style={{ color: 'var(--cru-text-soft, #94A3B8)' }}
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Encabezado con Icono circular institucional */}
        <div className="flex items-start gap-4 mb-4 mt-1">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${variantStyle.iconBg}`}
          >
            {variantStyle.icon}
          </div>

          <div className="pr-6">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-extrabold tracking-tight"
              style={{ color: 'var(--cru-text, #FFFFFF)', lineHeight: 1.3 }}
            >
              {title}
            </h3>
            <p
              id="confirm-dialog-desc"
              className="text-sm mt-1.5 leading-relaxed font-normal"
              style={{ color: 'var(--cru-text-secondary, #94A3B8)' }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Botonera de Acción Responsive */}
        <div
          className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-6 pt-4"
          style={{ borderTop: '1px solid var(--cru-border, rgba(255, 255, 255, 0.1))' }}
        >
          {/* Botón Cancelar */}
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={() => !isLoading && onCancel && onCancel()}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--cru-surface-muted, rgba(255, 255, 255, 0.06))',
              color: 'var(--cru-text, #FFFFFF)',
              border: '1px solid var(--cru-border, rgba(255, 255, 255, 0.15))'
            }}
          >
            {cancelText}
          </button>

          {/* Botón Confirmar Acción */}
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => !isLoading && onConfirm && onConfirm()}
            disabled={isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyle.btnConfirmClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>

      {/* Estilos para animación de entrada corta e inmunidad a prefers-reduced-motion */}
      <style>{`
        @keyframes confirmModalEnter {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes confirmModalEnter {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
