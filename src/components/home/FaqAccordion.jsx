import React, { useState } from 'react';
import { MandalaWheelSymbol } from '../decorative/CartRoad';

/**
 * FaqAccordion — Preguntas Frecuentes Institucionales
 * Acordeón limpio con rueda de carreta típica tradicional grande, tenue y giratoria en el fondo (30s).
 */
export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: '¿Dónde consulto las actas del Concejo Municipal?',
      a: 'Puede acceder al módulo "Concejo Municipal & Actas" o visitar la sección de Gobernanza. Allí encontrará las actas oficiales de sesiones ordinarias y extraordinarias en formato PDF con firma digital verificable de cada uno de los 84 cantones.'
    },
    {
      q: '¿Cómo reporto un hueco o avería vial?',
      a: 'Utilice el botón "Reporte de averías viales" o la opción "Consulta o queja". Podrá adjuntar coordenadas geográficas, fotografía de evidencia y descripción del incidente para que la cuadrilla de obras municipales atienda el bacheo prioritario con número de seguimiento único.'
    },
    {
      q: '¿Cómo valido mi cédula y tramito una patente?',
      a: 'En la "Ventanilla Única & Cédula", ingrese su número de cédula física o jurídica. El sistema consulta en tiempo real el registro del Ministerio de Hacienda (ATV) para validar su situación tributaria y permitir la solicitud y pago de patentes comerciales cantonales.'
    },
    {
      q: '¿Cómo participo en los presupuestos comunales y comités CCDR?',
      a: 'A través de la sección de Participación Ciudadana y Deportes (CCDR), los ciudadanos registrados pueden postular iniciativas vecinales, votar en los presupuestos participativos de su distrito y consultar el calendario de actividades recreativas cantonales.'
    }
  ];

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="preguntas-frecuentes"
      aria-label="Preguntas frecuentes"
      style={{
        maxWidth: '1240px',
        margin: '0 auto 4rem',
        padding: '0 1.5rem',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      <MandalaWheelSymbol />

      {/* RUEDA DE CARRETA GRANDE, TENUE Y GIRATORIA EN EL FONDO (GIRA EN 30s) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-65px',
          right: '1%',
          width: '380px',
          height: '380px',
          pointerEvents: 'none',
          opacity: 0.13,
          zIndex: 1
        }}
      >
        <div className="animate-wheel-slow" style={{ width: '100%', height: '100%' }}>
          <svg viewBox="-155 -155 310 310" style={{ width: '100%', height: '100%' }}>
            <use href="#mandala-carreta-wheel" />
          </svg>
        </div>
      </div>

      {/* Cabecera: Título con subrayado animado */}
      <div className="reveal-on-scroll" style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
        <h2
          className="title-underline-draw"
          style={{
            fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
            fontWeight: 900,
            color: 'var(--cru-text)',
            margin: 0,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-main, "Poppins", sans-serif)'
          }}
        >
          Preguntas frecuentes
        </h2>
      </div>

      {/* Lista del Acordeón */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          zIndex: 2
        }}
      >
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="reveal-on-scroll"
              style={{
                backgroundColor: 'var(--cru-card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--cru-border)',
                boxShadow: 'var(--cru-card-shadow, 0 4px 16px rgba(6, 42, 119, 0.05))',
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '1rem',
                  color: 'var(--cru-text)',
                  fontFamily: 'inherit'
                }}
              >
                <span
                  style={{
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    color: 'var(--cru-text)',
                    lineHeight: 1.4
                  }}
                >
                  {faq.q}
                </span>

                {/* Ícono de cruz (+) roja */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.25s ease',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--cru-accent-red, #C22727)',
                      lineHeight: 1
                    }}
                  >
                    +
                  </span>
                </div>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: '0 1.6rem 1.4rem',
                    color: 'var(--cru-text-soft)',
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    borderTop: '1px solid var(--cru-border)',
                    paddingTop: '1rem'
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
