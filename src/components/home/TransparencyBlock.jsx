import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * TransparencyBlock — Bloque Institucional de Transparencia y Protección de Datos
 * Respaldo normativo conforme a la Ley N° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales)
 * y Ley N° 7600 (Igualdad de Oportunidades para las Personas con Discapacidad).
 */
export default function TransparencyBlock() {
  return (
    <section
      aria-label="Bloque de Transparencia y Accesibilidad Universal"
      className="reveal-on-scroll"
      style={{
        maxWidth: '1240px',
        margin: '0 auto 4rem',
        padding: '0 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--red, #C22727)',
          borderRadius: 'var(--radius-card, 24px)',
          padding: '2rem 2.5rem',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 12px 34px rgba(194, 39, 39, 0.28)'
        }}
      >
        {/* Lado Izquierdo: Titular Normativo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={22} color="#FFFFFF" />
          </div>
          <h3
            style={{
              fontSize: 'clamp(1.25rem, 2.2vw, 1.55rem)',
              fontWeight: 900,
              margin: 0,
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-main, "Poppins", sans-serif)'
            }}
          >
            Transparencia · Ley N° 8968
          </h3>
        </div>

        {/* Lado Derecho: Descripción de Accesibilidad y Privacidad */}
        <div style={{ maxWidth: '580px' }}>
          <p
            style={{
              fontSize: '0.94rem',
              lineHeight: 1.55,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.94)',
              fontWeight: 500
            }}
          >
            Protección estricta de datos personales y accesibilidad universal conforme a la Ley N° 7600.
          </p>
        </div>
      </div>
    </section>
  );
}
