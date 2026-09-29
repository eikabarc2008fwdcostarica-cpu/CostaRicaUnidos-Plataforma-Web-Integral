import React, { useState, useRef, useEffect } from 'react';
import { Type, X } from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';
import { FASES_TIPOGRAFICAS } from './accessibilityData';

/**
 * Selector de Escala Tipográfica en 4 Fases (RNF-05.1 / Ley 7600)
 * Permite conmutar entre 100%, 125%, 150% y 200% sin generar desbordamientos horizontales en pantallas móviles de 360px.
 */
export default function TypographicScaleSelector({ variant = 'navbar' }) {
  const { textPhase, setTextPhase, currentScaleConfig } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectPhase = (phase) => {
    setTextPhase(phase);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      role="region"
      aria-label="Control de Accesibilidad Visual y Escala Tipográfica"
    >
      {/* Botón Disparador en el Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Escala tipográfica actual: Fase ${textPhase} (${currentScaleConfig.porcentaje}). Presione para cambiar el tamaño de texto.`}
        title="Escala tipográfica (100%, 125%, 150%, 200%)"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: textPhase > 1 ? 'rgba(0, 43, 127, 0.65)' : 'rgba(255, 255, 255, 0.08)',
          border: textPhase > 1 ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '0.45rem 0.75rem',
          color: '#FFFFFF',
          fontSize: '0.88rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: textPhase > 1 ? '0 0 12px rgba(121, 166, 255, 0.4)' : 'none',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ fontSize: '1rem', letterSpacing: '-0.05em' }}>aA</span>
        <span
          style={{
            backgroundColor: textPhase === 4 ? '#DA291C' : '#001489',
            padding: '0.1rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-telemetry, monospace)'
          }}
        >
          {currentScaleConfig.porcentaje}
        </span>
      </button>

      {/* Menú Desplegable Accesible */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Opciones de escala tipográfica"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '290px',
            backgroundColor: 'rgba(0, 8, 30, 0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(121, 166, 255, 0.35)',
            borderRadius: '14px',
            padding: '1rem',
            boxShadow: '0 16px 40px rgba(0, 4, 13, 0.9), 0 0 20px rgba(0, 43, 127, 0.35)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#79a6ff', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Type size={15} />
              <span>Escala Tipográfica (Ley 7600)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar selector de escala"
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '0.76rem', color: '#CBD5E1', lineHeight: 1.4 }}>
            Ajusta el tamaño proporcional de textos y botones sin romper el diseño en móviles:
          </p>

          <div
            role="radiogroup"
            aria-label="Nivel de fase tipográfica"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
          >
            {FASES_TIPOGRAFICAS.map((item) => {
              const isSelected = textPhase === item.fase;
              return (
                <button
                  key={item.fase}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectPhase(item.fase)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(0, 43, 127, 0.6)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? '#79a6ff' : '#FFFFFF' }}>
                        Fase {item.fase}: {item.etiqueta}
                      </span>
                      {item.fase === 4 && (
                        <span
                          style={{
                            fontSize: '0.64rem',
                            backgroundColor: '#DA291C',
                            color: '#FFFFFF',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            fontWeight: 800
                          }}
                        >
                          64px TÁCTIL
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
                      {item.descripcion}
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-telemetry, monospace)',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      color: isSelected ? '#00D166' : '#94A3B8'
                    }}
                  >
                    {item.porcentaje}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
