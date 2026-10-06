import React from 'react';

/**
 * StatsBar — Franja de Cifras Nacionales
 * 7 Provincias, 84 Cantones y 492 Distritos sobre fondo crema (#F3E8CC)
 * con plantas/hojas ilustradas en las esquinas.
 */
export default function StatsBar() {
  return (
    <section
      aria-label="Cifras de Cobertura Territorial Nacional"
      className="reveal-on-scroll"
      style={{
        maxWidth: '1240px',
        margin: '0 auto 5rem',
        padding: '0 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--cream, #F3E8CC)',
          borderRadius: 'var(--radius-card, 24px)',
          padding: '3rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(6, 42, 119, 0.06)',
          border: '1px solid rgba(107, 62, 31, 0.12)'
        }}
      >
        {/* Planta ilustrada en esquina izquierda */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '15px',
            width: '90px',
            height: '90px',
            pointerEvents: 'none',
            opacity: 0.85
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            {/* Tallo */}
            <path d="M10,95 Q30,60 65,30" fill="none" stroke="#19532B" strokeWidth="3" strokeLinecap="round" />
            {/* Hoja 1 grande verde kiwi */}
            <path d="M65,30 C75,10 95,15 90,40 C80,50 65,45 65,30 Z" fill="#9ABC04" stroke="#19532B" strokeWidth="1" />
            <line x1="68" y1="36" x2="84" y2="24" stroke="#19532B" strokeWidth="1.2" />
            {/* Hoja 2 lateral verde bosque */}
            <path d="M35,62 C30,42 45,35 55,50 C58,62 45,68 35,62 Z" fill="#19532B" />
          </svg>
        </div>

        {/* Planta ilustrada en esquina derecha */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '15px',
            width: '90px',
            height: '90px',
            pointerEvents: 'none',
            opacity: 0.85,
            transform: 'scaleX(-1)'
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <path d="M10,95 Q30,60 65,30" fill="none" stroke="#19532B" strokeWidth="3" strokeLinecap="round" />
            <path d="M65,30 C75,10 95,15 90,40 C80,50 65,45 65,30 Z" fill="#9ABC04" stroke="#19532B" strokeWidth="1" />
            <line x1="68" y1="36" x2="84" y2="24" stroke="#19532B" strokeWidth="1.2" />
            <path d="M35,62 C30,42 45,35 55,50 C58,62 45,68 35,62 Z" fill="#19532B" />
          </svg>
        </div>

        {/* 3 Columnas con grandes números rojos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Cifra 1: Provincias */}
          <div>
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(3.4rem, 6vw, 4.8rem)',
                fontWeight: 900,
                color: 'var(--red, #C22727)',
                lineHeight: 1,
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-main, "Poppins", sans-serif)'
              }}
            >
              7
            </span>
            <p
              style={{
                fontSize: '0.98rem',
                fontWeight: 600,
                color: 'var(--ink, #131313)',
                margin: 0,
                lineHeight: 1.4
              }}
            >
              Provincias en un solo estándar digital
            </p>
          </div>

          {/* Cifra 2: Cantones */}
          <div>
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(3.4rem, 6vw, 4.8rem)',
                fontWeight: 900,
                color: 'var(--red, #C22727)',
                lineHeight: 1,
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-main, "Poppins", sans-serif)'
              }}
            >
              84
            </span>
            <p
              style={{
                fontSize: '0.98rem',
                fontWeight: 600,
                color: 'var(--ink, #131313)',
                margin: 0,
                lineHeight: 1.4
              }}
            >
              Cantones con autonomía municipal
            </p>
          </div>

          {/* Cifra 3: Distritos */}
          <div>
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(3.4rem, 6vw, 4.8rem)',
                fontWeight: 900,
                color: 'var(--red, #C22727)',
                lineHeight: 1,
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-main, "Poppins", sans-serif)'
              }}
            >
              492
            </span>
            <p
              style={{
                fontSize: '0.98rem',
                fontWeight: 600,
                color: 'var(--ink, #131313)',
                margin: 0,
                lineHeight: 1.4
              }}
            >
              Distritos de costa a costa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
