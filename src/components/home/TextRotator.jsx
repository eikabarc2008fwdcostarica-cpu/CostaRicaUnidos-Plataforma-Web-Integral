import React from 'react';

/**
 * TextRotator — Rotador de texto vertical con ciclo de 10s con pausas,
 * curva cubic-bezier(.7,0,.2,1), palabra en amarillo y primera palabra repetida al final.
 * Palabras: [ciudadanos / transparentes / digitales / para todos]
 */
export default function TextRotator() {
  const palabras = [
    'ciudadanos',
    'transparentes',
    'digitales',
    'para todos',
    'ciudadanos' // Primera repetida al final para ciclo fluido infinito
  ];

  return (
    <span
      className="text-rotator-container"
      style={{
        display: 'inline-block',
        height: '1.25em',
        lineHeight: '1.25em',
        verticalAlign: 'top',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <span className="text-rotator-track">
        {palabras.map((palabra, index) => (
          <span
            key={index}
            className="text-rotator-word"
            style={{
              display: 'block',
              height: '1.25em',
              lineHeight: '1.25em',
              color: 'var(--sun, #FFCA26)',
              fontWeight: 900,
              textDecoration: 'underline',
              textDecorationColor: 'var(--sun, #FFCA26)',
              textUnderlineOffset: '6px'
            }}
          >
            {palabra}
          </span>
        ))}
      </span>

      <style>{`
        .text-rotator-track {
          display: block;
          animation: textRotatorCycle 10s cubic-bezier(0.7, 0, 0.2, 1) infinite;
        }

        @keyframes textRotatorCycle {
          0%, 18% {
            transform: translateY(0%);
          }
          25%, 43% {
            transform: translateY(-20%);
          }
          50%, 68% {
            transform: translateY(-40%);
          }
          75%, 93% {
            transform: translateY(-60%);
          }
          100% {
            transform: translateY(-80%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .text-rotator-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </span>
  );
}
