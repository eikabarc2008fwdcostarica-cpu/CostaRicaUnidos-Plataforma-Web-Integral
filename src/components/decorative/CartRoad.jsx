import React from 'react';

/**
 * MandalaWheelSymbol — Símbolo SVG de la Rueda de Carreta Típica Costarricense
 * Conservado para uso en FaqAccordion y referencias institucionales.
 */
export function MandalaWheelSymbol() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <g id="mandala-carreta-wheel">
          {/* Llanta exterior de madera/hierro */}
          <circle cx="0" cy="0" r="48" fill="#6B3E1F" stroke="#131313" strokeWidth="2.5" />
          {/* Anillo exterior Rojo Nacional */}
          <circle cx="0" cy="0" r="43" fill="#C22727" stroke="#FFFFFF" strokeWidth="2" />
          {/* Anillo intermedio Azul Institucional */}
          <circle cx="0" cy="0" r="34" fill="#0053AF" stroke="#FFCA26" strokeWidth="2" />
          {/* Anillo interior Blanco Cívico */}
          <circle cx="0" cy="0" r="23" fill="#FDFDFF" stroke="#C22727" strokeWidth="1.5" />
          
          {/* 8 Radios decorados estilo Sarchí */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle})`}>
              <line x1="0" y1="0" x2="0" y2="-43" stroke="#FFCA26" strokeWidth="3" strokeLinecap="round" />
              {/* Puntos verdes tradicionales decorativos */}
              <circle cx="0" cy="-28" r="2.8" fill="#19532B" />
              <circle cx="0" cy="-38" r="2.2" fill="#FDFDFF" />
              {/* Puntas triangulares de mandala */}
              <polygon points="-4,-20 4,-20 0,-14" fill="#C22727" />
            </g>
          ))}

          {/* Centro/Maza amarillo sol */}
          <circle cx="0" cy="0" r="14" fill="#FFCA26" stroke="#C22727" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="6" fill="#131313" />
        </g>
      </defs>
    </svg>
  );
}

/**
 * CartRoad — Franja del Camino Tradicional Costarricense
 * Tradición del Boyeo y la Carreta Típica de Costa Rica (Obra Maestra del Patrimonio Oral e Intangible de la UNESCO).
 * Composición ilustrada integral: Yunta de bueyes al frente unida por el yugo tradicional,
 * carreta de madera decorada con los colores típicos y ruedas con patrón de mandala,
 * con base firme sobre el camino de tierra y pasto, avanzando con un suave vaivén natural.
 */
export default function CartRoad() {
  return (
    <section
      aria-label="Franja del camino tradicional: Boyeo y Carreta Típica"
      className="cart-road-strip"
      style={{
        position: 'relative',
        width: '100%',
        height: '135px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        margin: '2rem 0 3.5rem'
      }}
    >
      <MandalaWheelSymbol />

      {/* Franja superior de pasto verde tropical */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '24px',
          backgroundColor: '#19532B',
          backgroundImage: 'linear-gradient(180deg, #19532B 0%, #206E39 100%)',
          borderBottom: '3px solid #9ABC04'
        }}
      />

      {/* Camino de tierra y toba volcánica tradicional */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          bottom: '24px',
          left: 0,
          right: 0,
          backgroundColor: '#F3E8CC',
          backgroundImage: 'radial-gradient(#E8D5AA 16%, transparent 17%)',
          backgroundSize: '24px 24px',
          borderTop: '2px dashed rgba(107, 62, 31, 0.25)',
          borderBottom: '2px dashed rgba(107, 62, 31, 0.25)'
        }}
      />

      {/* Franja inferior de pasto */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '24px',
          backgroundColor: '#19532B',
          borderTop: '3px solid #9ABC04'
        }}
      />

      {/* Composición Ilustrada Completa: Boyeo y Carreta con Bueyes */}
      <div
        className="animate-oxcart-cross"
        style={{
          position: 'absolute',
          bottom: '12px',
          left: 0,
          width: '350px',
          height: '102px',
          pointerEvents: 'none'
        }}
      >
        <div className="animate-oxcart-sway" style={{ width: '100%', height: '100%' }}>
          <svg
            viewBox="0 0 350 102"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            aria-label="Carreta típica costarricense guiada por yunta de bueyes"
          >
            {/* ==========================================================
                1. BUEY TRASERO / SEGUNDO BUEY (Ligeramente en perspectiva)
                ========================================================== */}
            <g opacity="0.92">
              {/* Patas lejanas del segundo buey */}
              <line x1="242" y1="68" x2="240" y2="92" stroke="#8D5B28" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="258" y1="68" x2="256" y2="92" stroke="#8D5B28" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="292" y1="68" x2="290" y2="92" stroke="#8D5B28" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="308" y1="68" x2="310" y2="92" stroke="#8D5B28" strokeWidth="5.5" strokeLinecap="round" />

              {/* Lomo y cuerpo del segundo buey (Marrón caramelo con mancha crema) */}
              <ellipse cx="274" cy="58" rx="34" ry="18" fill="#9A5B27" />
              {/* Cuello y cabeza */}
              <path d="M298 52L320 44L324 58L304 68Z" fill="#9A5B27" />
              {/* Cuernos del segundo buey */}
              <path d="M316 42C318 34 314 26 310 24" fill="none" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
              <path d="M322 42C326 34 330 26 332 25" fill="none" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* ==========================================================
                2. BUEY PRINCIPAL DELANTERO (Primer plano)
                ========================================================== */}
            <g>
              {/* Cola con borla */}
              <path d="M232 54C226 62 228 74 227 82" fill="none" stroke="#A76832" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="227" cy="83" rx="3" ry="4" fill="#3E2723" />

              {/* Patas firmes sobre el camino (Y = 92) */}
              <line x1="238" y1="68" x2="236" y2="92" stroke="#A76832" strokeWidth="6" strokeLinecap="round" />
              <path d="M233 90L239 90L238 93L232 93Z" fill="#2E1C0C" />

              <line x1="254" y1="68" x2="252" y2="92" stroke="#A76832" strokeWidth="6" strokeLinecap="round" />
              <path d="M249 90L255 90L254 93L248 93Z" fill="#2E1C0C" />

              <line x1="288" y1="68" x2="286" y2="92" stroke="#A76832" strokeWidth="6" strokeLinecap="round" />
              <path d="M283 90L289 90L288 93L282 93Z" fill="#2E1C0C" />

              <line x1="304" y1="68" x2="306" y2="92" stroke="#A76832" strokeWidth="6" strokeLinecap="round" />
              <path d="M303 90L309 90L308 93L302 93Z" fill="#2E1C0C" />

              {/* Cuerpo / Lomo musculoso con giba típica */}
              <ellipse cx="270" cy="62" rx="36" ry="19" fill="#B87333" />
              {/* Giba prominente en la espalda */}
              <path d="M286 48C289 42 299 44 300 50Z" fill="#B87333" />

              {/* Mancha blanca tradicional en el costado */}
              <ellipse cx="266" cy="63" rx="14" ry="9" fill="#FEF3C7" opacity="0.9" />

              {/* Pecho y cuello */}
              <path d="M294 56L316 48L320 64L298 72Z" fill="#B87333" />

              {/* Cabeza del buey */}
              <circle cx="316" cy="54" r="10" fill="#B87333" />
              {/* Hocico crema con ollares */}
              <path d="M322 52C327 53 328 60 323 62Z" fill="#FEF3C7" />
              <circle cx="324" cy="56" r="1" fill="#3E2723" />

              {/* Ojo sereno */}
              <circle cx="314" cy="51" r="2" fill="#2E1C0C" />
              <circle cx="314.5" cy="50.5" r="0.7" fill="#FFFFFF" />

              {/* Oreja caída natural */}
              <path d="M309 52C304 54 304 60 308 58Z" fill="#8D5524" />

              {/* Cuernos curvados hacia arriba */}
              <path d="M312 46C314 36 309 28 304 25" fill="none" stroke="#FEF3C7" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M306 27L304 25" stroke="#3E2723" strokeWidth="3.6" strokeLinecap="round" />

              <path d="M318 46C323 37 329 28 333 26" fill="none" stroke="#FEF3C7" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M331 28L333 26" stroke="#3E2723" strokeWidth="3.6" strokeLinecap="round" />
            </g>

            {/* ==========================================================
                3. EL YUGO TRADICIONAL Y TIMÓN / LANZA
                ========================================================== */}
            <g>
              {/* Lanza / Timón de madera maciza conectada al eje de la carreta */}
              <line x1="120" y1="72" x2="280" y2="46" stroke="#5D3A1A" strokeWidth="6" strokeLinecap="round" />
              <line x1="120" y1="71" x2="280" y2="45" stroke="#7D4F27" strokeWidth="3" strokeLinecap="round" />

              {/* El Yugo de madera labrada sobre el cuello de los bueyes */}
              <path
                d="M265 42C278 40 292 48 306 44C318 41 326 44 330 45"
                fill="none"
                stroke="#6B3E1F"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M265 41C278 39 292 47 306 43C318 40 326 43 330 44"
                fill="none"
                stroke="#B45309"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Coyundas y correajes tradicionales de cuero */}
              <path d="M280 43L282 54" stroke="#D97706" strokeWidth="2.5" />
              <path d="M312 44L314 55" stroke="#D97706" strokeWidth="2.5" />
              {/* Clavija central dorada */}
              <circle cx="295" cy="45" r="3" fill="#FFCA26" stroke="#131313" strokeWidth="1" />
            </g>

            {/* ==========================================================
                4. LA CARRETA TÍPICA COSTARRICENSE (Pintada estilo Sarchí)
                ========================================================== */}
            <g>
              {/* Chasis base y piso de madera */}
              <rect x="18" y="52" width="124" height="20" rx="3" fill="#5D3A1A" stroke="#131313" strokeWidth="1.2" />

              {/* Barandas superiores con estacas torneadas */}
              <line x1="16" y1="36" x2="144" y2="36" stroke="#FFCA26" strokeWidth="3" strokeLinecap="round" />
              {[22, 42, 62, 82, 102, 122, 140].map((bx) => (
                <line key={bx} x1={bx} y1="36" x2={bx} y2="52" stroke="#6B3E1F" strokeWidth="2.8" />
              ))}

              {/* Panel frontal pintado con motivos geométricos patrios */}
              <rect x="20" y="44" width="120" height="24" rx="2" fill="#C22727" stroke="#131313" strokeWidth="1" />
              
              {/* Secciones decorativas: Rojo, Azul Soberano, Amarillo Sol */}
              <rect x="24" y="46" width="34" height="20" fill="#C22727" rx="1" />
              <rect x="63" y="46" width="34" height="20" fill="#0053AF" rx="1" />
              <rect x="102" y="46" width="34" height="20" fill="#FFCA26" rx="1" />

              {/* Diseños de mandala y diamantes en los paneles */}
              {/* Panel izquierdo */}
              <polygon points="41,47 48,56 34,56" fill="#FFCA26" />
              <polygon points="41,65 48,56 34,56" fill="#FFFFFF" />

              {/* Panel central */}
              <circle cx="80" cy="56" r="6" fill="#C22727" stroke="#FFFFFF" strokeWidth="1.2" />
              <circle cx="80" cy="56" r="2.8" fill="#FFCA26" />

              {/* Panel derecho */}
              <polygon points="119,47 126,56 112,56" fill="#0053AF" />
              <polygon points="119,65 126,56 112,56" fill="#C22727" />

              {/* ==========================================================
                  5. RUEDAS DE MANDALA FIRMEMENTE ENSAMBLADAS SOBRE EL CAMINO
                  (Diámetro: 48px, Radio: 24px, Base en Y = 92px)
                  ========================================================== */}
              {/* RUEDA TRASERA (Centro X=48, Y=68 -> Base en Y=92) */}
              <g transform="translate(48, 68)">
                {/* Llanta de hierro */}
                <circle cx="0" cy="0" r="24" fill="#6B3E1F" stroke="#131313" strokeWidth="1.5" />
                {/* Aro Rojo */}
                <circle cx="0" cy="0" r="21.5" fill="#C22727" stroke="#FFFFFF" strokeWidth="1" />
                {/* Aro Azul */}
                <circle cx="0" cy="0" r="16.5" fill="#0053AF" stroke="#FFCA26" strokeWidth="1" />
                {/* Aro Blanco */}
                <circle cx="0" cy="0" r="11" fill="#FDFDFF" stroke="#C22727" strokeWidth="0.8" />
                {/* 8 Radios decorados */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                  <g key={i} transform={`rotate(${ang})`}>
                    <line x1="0" y1="0" x2="0" y2="-21.5" stroke="#FFCA26" strokeWidth="1.6" />
                    <circle cx="0" cy="-14" r="1.4" fill="#19532B" />
                    <polygon points="-2,-9 2,-9 0,-6" fill="#C22727" />
                  </g>
                ))}
                {/* Maza central */}
                <circle cx="0" cy="0" r="6.5" fill="#FFCA26" stroke="#C22727" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2.8" fill="#131313" />
              </g>

              {/* RUEDA DELANTERA (Centro X=108, Y=68 -> Base en Y=92) */}
              <g transform="translate(108, 68)">
                {/* Llanta de hierro */}
                <circle cx="0" cy="0" r="24" fill="#6B3E1F" stroke="#131313" strokeWidth="1.5" />
                {/* Aro Rojo */}
                <circle cx="0" cy="0" r="21.5" fill="#C22727" stroke="#FFFFFF" strokeWidth="1" />
                {/* Aro Azul */}
                <circle cx="0" cy="0" r="16.5" fill="#0053AF" stroke="#FFCA26" strokeWidth="1" />
                {/* Aro Blanco */}
                <circle cx="0" cy="0" r="11" fill="#FDFDFF" stroke="#C22727" strokeWidth="0.8" />
                {/* 8 Radios decorados */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                  <g key={i} transform={`rotate(${ang})`}>
                    <line x1="0" y1="0" x2="0" y2="-21.5" stroke="#FFCA26" strokeWidth="1.6" />
                    <circle cx="0" cy="-14" r="1.4" fill="#19532B" />
                    <polygon points="-2,-9 2,-9 0,-6" fill="#C22727" />
                  </g>
                ))}
                {/* Maza central */}
                <circle cx="0" cy="0" r="6.5" fill="#FFCA26" stroke="#C22727" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2.8" fill="#131313" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
