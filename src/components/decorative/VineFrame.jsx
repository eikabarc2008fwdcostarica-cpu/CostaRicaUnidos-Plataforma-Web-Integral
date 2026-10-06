import React from 'react';

/**
 * VineFrame — Marco de Flora Tropical Costarricense
 * Lianas colgantes orgánicas y curvadas con ramificaciones continuas,
 * hojas tropicales detalladas con nervaduras en verde bosque (#19532B),
 * verde kiwi (#9ABC04) y amarillo sol (#FFCA26),
 * entrelazadas con Guarias Moradas (Guarianthe skinneri).
 * 
 * Totalmente inaccesible a clics (pointer-events: none) y oculto en móviles (< 480px).
 */
export default function VineFrame() {
  return (
    <div
      aria-hidden="true"
      className="vine-frame-container"
      style={{
        position: 'absolute',
        top: '660px',
        bottom: '80px',
        left: 0,
        right: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 4
      }}
    >
      {/* SÍMBOLOS SVG REUTILIZABLES: Hojas detalladas con nervaduras y Guarias Moradas */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {/* 1. Hoja tropical detallada con nervaduras */}
          <g id="leaf-tropical-veined">
            {/* Limbo foliar */}
            <path
              d="M0 0C-10 -16 -6 -32 0 -42C6 -32 10 -16 0 0Z"
              className="leaf-blade"
            />
            {/* Nervadura central */}
            <path d="M0 0L0 -39" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
            {/* Nervaduras laterales secundarias */}
            <path d="M0 -10L-4.5 -16 M0 -10L4.5 -16" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
            <path d="M0 -20L-5 -27 M0 -20L5 -27" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
            <path d="M0 -30L-3.5 -35 M0 -30L3.5 -35" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
          </g>

          {/* 2. Zarcillo / Ramificación en espiral */}
          <g id="vine-tendril">
            <path
              d="M0 0C8 -4 14 -12 12 -18C10 -22 4 -22 3 -18C2 -14 8 -11 10 -12"
              fill="none"
              stroke="#19532B"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>

          {/* 3. Guaria Morada detallada (Guarianthe skinneri) */}
          <g id="guaria-detailed">
            {/* 3 Pétalos superiores y sépalos lilas */}
            <path d="M0 -22C-9 -16 -10 -6 0 0C10 -6 9 -16 0 -22Z" fill="#9B59D0" stroke="#7B1FA2" strokeWidth="0.8" />
            <path d="M-22 -8C-20 4 -10 6 0 0C-10 -6 -14 -16 -22 -8Z" fill="#AB47BC" stroke="#8E24AA" strokeWidth="0.8" />
            <path d="M22 -8C14 -16 10 -6 0 0C10 6 20 4 22 -8Z" fill="#AB47BC" stroke="#8E24AA" strokeWidth="0.8" />
            
            {/* 2 Pétalos inferiores */}
            <path d="M-15 19C-19 9 -8 4 0 0C-8 -4 -4 13 -15 19Z" fill="#8E24AA" stroke="#6A1B9A" strokeWidth="0.8" />
            <path d="M15 19C4 13 8 -4 0 0C8 4 19 9 15 19Z" fill="#8E24AA" stroke="#6A1B9A" strokeWidth="0.8" />
            
            {/* Labelo tubular morado oscuro aterciopelado */}
            <ellipse cx="0" cy="5.5" rx="7.5" ry="9.5" fill="#581C87" stroke="#3B0764" strokeWidth="0.8" />
            
            {/* Garganta interior amarillo oro con reflejo */}
            <ellipse cx="0" cy="3.5" rx="3.5" ry="4.2" fill="#FFCA26" />
            <circle cx="0" cy="2.2" r="1.6" fill="#FEF08A" />
          </g>
        </defs>
      </svg>

      {/* ====================================================================
          LIANA IZQUIERDA: Curvatura orgánica ondulante y ramificaciones continuas
          ==================================================================== */}
      <div
        className="vine-strand-left animate-vine-left"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '74px',
          height: '100%',
          overflow: 'visible'
        }}
      >
        {/* Renderizado en tramos modulares orgánicos de 600px repetidos */}
        {[0, 600, 1200, 1800, 2400, 3000].map((offsetY, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: `${offsetY}px`,
              left: 0,
              width: '74px',
              height: '600px'
            }}
          >
            <svg
              viewBox="0 0 74 600"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {/* Tallo principal sinuoso y curvado continuo */}
              <path
                d="M12 0 C28 80 4 160 26 240 C44 320 8 400 24 480 C36 540 16 580 14 600"
                fill="none"
                stroke="#19532B"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
              {/* Veta secundaria más clara sobre el tallo */}
              <path
                d="M12 0 C28 80 4 160 26 240 C44 320 8 400 24 480 C36 540 16 580 14 600"
                fill="none"
                stroke="#22C55E"
                strokeWidth="1.2"
                strokeDasharray="18 14"
                opacity="0.4"
              />

              {/* Ramitas y zarcillos curvados */}
              <path d="M26 240 C38 230 46 234 52 226" fill="none" stroke="#19532B" strokeWidth="2" strokeLinecap="round" />
              <use href="#vine-tendril" x="52" y="226" transform="scale(0.85)" />

              <path d="M16 380 C8 370 2 374 -4 366" fill="none" stroke="#19532B" strokeWidth="2" strokeLinecap="round" />
              <use href="#vine-tendril" x="-4" y="366" transform="scale(-0.85 0.85)" />

              {/* Hojas tropicales con nervaduras en verde bosque, kiwi y amarillo sol */}
              {/* Nodo 1 */}
              <use href="#leaf-tropical-veined" x="19" y="50" fill="#19532B" transform="rotate(-38 19 50) scale(0.95)" />
              <use href="#leaf-tropical-veined" x="25" y="90" fill="#9ABC04" transform="rotate(48 25 90) scale(0.85)" />

              {/* Nodo 2 */}
              <use href="#leaf-tropical-veined" x="10" y="150" fill="#9ABC04" transform="rotate(-45 10 150) scale(1.1)" />
              <use href="#leaf-tropical-veined" x="18" y="190" fill="#FFCA26" transform="rotate(35 18 190) scale(0.8)" />

              {/* Nodo 3 (Junto a la ramita) */}
              <use href="#leaf-tropical-veined" x="32" y="255" fill="#19532B" transform="rotate(52 32 255) scale(1.15)" />
              <use href="#leaf-tropical-veined" x="22" y="295" fill="#9ABC04" transform="rotate(-32 22 295) scale(0.9)" />

              {/* Nodo 4 */}
              <use href="#leaf-tropical-veined" x="12" y="360" fill="#FFCA26" transform="rotate(-50 12 360) scale(0.85)" />
              <use href="#leaf-tropical-veined" x="20" y="420" fill="#19532B" transform="rotate(42 20 420) scale(1.05)" />

              {/* Nodo 5 */}
              <use href="#leaf-tropical-veined" x="27" y="500" fill="#9ABC04" transform="rotate(40 27 500) scale(0.95)" />
              <use href="#leaf-tropical-veined" x="18" y="550" fill="#19532B" transform="rotate(-36 18 550) scale(1.0)" />

              {/* Flor Nacional: Guaria Morada en el recorrido */}
              {idx % 2 === 0 ? (
                <g transform="translate(30, 225) scale(0.78)" className="animate-guaria-1">
                  <use href="#guaria-detailed" />
                </g>
              ) : (
                <g transform="translate(16, 440) scale(0.74)" className="animate-guaria-3">
                  <use href="#guaria-detailed" />
                </g>
              )}
            </svg>
          </div>
        ))}
      </div>

      {/* ====================================================================
          LIANA DERECHA: Espejo orgánico con variaciones naturales
          ==================================================================== */}
      <div
        className="vine-strand-right animate-vine-right"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '74px',
          height: '100%',
          overflow: 'visible',
          transform: 'scaleX(-1)'
        }}
      >
        {[0, 600, 1200, 1800, 2400, 3000].map((offsetY, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: `${offsetY}px`,
              left: 0,
              width: '74px',
              height: '600px'
            }}
          >
            <svg
              viewBox="0 0 74 600"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {/* Tallo principal curvado */}
              <path
                d="M16 0 C30 90 6 170 24 250 C42 330 10 410 26 490 C34 550 14 585 16 600"
                fill="none"
                stroke="#19532B"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
              <path
                d="M16 0 C30 90 6 170 24 250 C42 330 10 410 26 490 C34 550 14 585 16 600"
                fill="none"
                stroke="#22C55E"
                strokeWidth="1.2"
                strokeDasharray="18 14"
                opacity="0.4"
              />

              {/* Ramificaciones y zarcillos */}
              <path d="M24 250 C36 240 44 244 50 236" fill="none" stroke="#19532B" strokeWidth="2" strokeLinecap="round" />
              <use href="#vine-tendril" x="50" y="236" transform="scale(0.85)" />

              {/* Hojas con nervaduras en variedad de verdes y amarillo */}
              <use href="#leaf-tropical-veined" x="22" y="60" fill="#9ABC04" transform="rotate(-35 22 60) scale(0.9)" />
              <use href="#leaf-tropical-veined" x="26" y="105" fill="#19532B" transform="rotate(45 26 105) scale(1.05)" />

              <use href="#leaf-tropical-veined" x="12" y="170" fill="#FFCA26" transform="rotate(-42 12 170) scale(0.85)" />
              <use href="#leaf-tropical-veined" x="20" y="210" fill="#9ABC04" transform="rotate(38 20 210) scale(1.0)" />

              <use href="#leaf-tropical-veined" x="30" y="270" fill="#19532B" transform="rotate(50 30 270) scale(1.15)" />
              <use href="#leaf-tropical-veined" x="19" y="320" fill="#FFCA26" transform="rotate(-30 19 320) scale(0.85)" />

              <use href="#leaf-tropical-veined" x="14" y="385" fill="#9ABC04" transform="rotate(-48 14 385) scale(1.05)" />
              <use href="#leaf-tropical-veined" x="22" y="440" fill="#19532B" transform="rotate(44 22 440) scale(0.95)" />

              <use href="#leaf-tropical-veined" x="28" y="520" fill="#19532B" transform="rotate(38 28 520) scale(1.0)" />
              <use href="#leaf-tropical-veined" x="18" y="565" fill="#9ABC04" transform="rotate(-40 18 565) scale(0.9)" />

              {/* Guaria Morada detallada en el lado derecho */}
              {idx % 2 === 1 ? (
                <g transform="translate(28, 235) scale(0.78)" className="animate-guaria-2">
                  <use href="#guaria-detailed" />
                </g>
              ) : (
                <g transform="translate(18, 470) scale(0.74)" className="animate-guaria-4">
                  <use href="#guaria-detailed" />
                </g>
              )}
            </svg>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .vine-frame-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
