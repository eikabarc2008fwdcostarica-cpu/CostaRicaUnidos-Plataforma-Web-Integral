import React from 'react';

/**
 * MandalaWheelSymbol — Símbolo SVG Maestro de la Rueda de Carreta Típica Costarricense
 * Diseño exacto tradicional de Sarchí:
 * - Doble aro concéntrico blanco sobre fondo rojo.
 * - 36 rayos en abanico (pinwheel) en azul, verde, naranja, amarillo, rosa y morado.
 * - Motivos florales, espirales caligráficas y centro de roseta multicolor.
 * - Centro en (0, 0), radio 155 (viewBox -155 -155 310 310).
 */
export function MandalaWheelSymbol() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <g id="mandala-carreta-wheel">
          <circle r="155" fill="#B80F0A" />
          <circle r="149" fill="none" stroke="#fff" strokeWidth="2.4" />
          <circle r="143" fill="none" stroke="#fff" strokeWidth="1.6" />
          <circle r="139" fill="#4B1A7A" />
          <circle r="64" fill="#fff" />
          {/* Rayos exteriores en abanico (36 rayos en 6 colores alternados) */}
          <g>
            <polygon transform="rotate(0)" fill="#1F4E9E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(10)" fill="#3F7F2B" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(20)" fill="#F29A38" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(30)" fill="#F7C52E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(40)" fill="#EE72D3" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(50)" fill="#5B1C8C" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(60)" fill="#1F4E9E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(70)" fill="#3F7F2B" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(80)" fill="#F29A38" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(90)" fill="#F7C52E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(100)" fill="#EE72D3" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(110)" fill="#5B1C8C" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(120)" fill="#1F4E9E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(130)" fill="#3F7F2B" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(140)" fill="#F29A38" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(150)" fill="#F7C52E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(160)" fill="#EE72D3" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(170)" fill="#5B1C8C" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(180)" fill="#1F4E9E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(190)" fill="#3F7F2B" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(200)" fill="#F29A38" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(210)" fill="#F7C52E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(220)" fill="#EE72D3" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(230)" fill="#5B1C8C" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(240)" fill="#1F4E9E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(250)" fill="#3F7F2B" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(260)" fill="#F29A38" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(270)" fill="#F7C52E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(280)" fill="#EE72D3" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(290)" fill="#5B1C8C" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(300)" fill="#1F4E9E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(310)" fill="#3F7F2B" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(320)" fill="#F29A38" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(330)" fill="#F7C52E" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(340)" fill="#EE72D3" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
            <polygon transform="rotate(350)" fill="#5B1C8C" points="-10.5,-60 10.5,-60 26.5,-137 5.5,-137" />
          </g>
          {/* Rayos intermedios */}
          <g>
            <polygon transform="rotate(5)" fill="#F7C52E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(15)" fill="#EE72D3" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(25)" fill="#5B1C8C" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(35)" fill="#1F4E9E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(45)" fill="#3F7F2B" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(55)" fill="#F29A38" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(65)" fill="#F7C52E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(75)" fill="#EE72D3" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(85)" fill="#5B1C8C" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(95)" fill="#1F4E9E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(105)" fill="#3F7F2B" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(115)" fill="#F29A38" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(125)" fill="#F7C52E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(135)" fill="#EE72D3" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(145)" fill="#5B1C8C" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(155)" fill="#1F4E9E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(165)" fill="#3F7F2B" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(175)" fill="#F29A38" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(185)" fill="#F7C52E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(195)" fill="#EE72D3" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(205)" fill="#5B1C8C" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(215)" fill="#1F4E9E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(225)" fill="#3F7F2B" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(235)" fill="#F29A38" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(245)" fill="#F7C52E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(255)" fill="#EE72D3" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(265)" fill="#5B1C8C" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(275)" fill="#1F4E9E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(285)" fill="#3F7F2B" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(295)" fill="#F29A38" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(305)" fill="#F7C52E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(315)" fill="#EE72D3" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(325)" fill="#5B1C8C" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(335)" fill="#1F4E9E" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(345)" fill="#3F7F2B" points="-5,-62 5,-62 12,-100 2,-100" />
            <polygon transform="rotate(355)" fill="#F29A38" points="-5,-62 5,-62 12,-100 2,-100" />
          </g>
          {/* Filigranas circulares punteadas blancas */}
          <g>
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350].map((deg) => (
              <circle
                key={deg}
                transform={`rotate(${deg})`}
                cx="4.5"
                cy="-112"
                r="2.8"
                fill="none"
                stroke="#fff"
                strokeWidth="0.8"
                strokeDasharray="11 3"
                opacity="0.9"
              />
            ))}
          </g>
          {/* Aros de transición interior */}
          <circle r="66" fill="#5B1C8C" />
          <circle r="61" fill="#fff" />
          <circle r="59" fill="#B80F0A" />
          {/* Espirales y arabescos tradicionales en 8 sectores */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
            <g key={rot} transform={`rotate(${rot})`}>
              <path d="M-9,-47 C-17,-47 -17,-57 -9,-57 C-3,-57 -1,-51 -5,-49" fill="none" stroke="#0E2A4D" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M9,-47 C17,-47 17,-57 9,-57 C3,-57 1,-51 5,-49" fill="none" stroke="#0E2A4D" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="0" cy="-43" r="3.4" fill="#EE72D3" />
              <circle cx="-4" cy="-45" r="2.2" fill="#EE72D3" />
              <circle cx="4" cy="-45" r="2.2" fill="#EE72D3" />
              <circle cx="0" cy="-52" r="2.6" fill="#3F7F2B" />
              <circle cx="0" cy="-59" r="2" fill="#fff" />
            </g>
          ))}
          {/* Rosetas intermedias en 8 sectores desfasados */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((rot) => (
            <g key={rot} transform={`rotate(${rot})`}>
              <circle cx="0" cy="-51" r="4.6" fill="#3F7F2B" />
              <circle cx="-2.6" cy="-50" r="2.8" fill="#EE72D3" />
              <circle cx="2.6" cy="-50" r="2.8" fill="#EE72D3" />
              <circle cx="0" cy="-53.2" r="2.8" fill="#EE72D3" />
              <circle cx="0" cy="-51" r="1.4" fill="#F29A38" />
            </g>
          ))}
          {/* Anillos interiores y maza central */}
          <circle r="33" fill="#5B1C8C" />
          <circle r="31" fill="#fff" />
          <circle r="29.5" fill="#B80F0A" />
          {/* Pétalos florales exteriores de la maza (16 pétalos) */}
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
            <circle key={deg} transform={`rotate(${deg})`} cx="0" cy="-23" r="5" fill="#F29A38" />
          ))}
          <circle r="23" fill="#F29A38" />
          {/* Pétalos amarillos en lágrima (12 pétalos) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse key={deg} transform={`rotate(${deg})`} cx="0" cy="-15" rx="3" ry="5" fill="#F7C52E" />
          ))}
          {/* Núcleo de roseta central */}
          <circle r="11" fill="#B80F0A" />
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
            <circle key={deg} transform={`rotate(${deg})`} cx="0" cy="-9.5" r="1.6" fill="#B80F0A" />
          ))}
          <circle r="7" fill="#1F4E9E" />
          <circle r="4.2" fill="#F29A38" />
          <circle r="2.2" fill="#111" />
        </g>
      </defs>
    </svg>
  );
}

/**
 * CartRoad — Franja del Camino Tradicional Costarricense
 * Tradición del Boyeo y la Carreta Típica de Costa Rica (UNESCO).
 * Recreación fiel de la ilustración vectorial de referencia:
 * - Yunta de dos bueyes pardos al frente (pezuñas blancas, cuernos curvos, arnés de cuero).
 * - Carreta roja con laterales almenados, franja azul claro y gran rueda de mandala protagonista.
 * - Campesino con sombrero claro y cinta roja, camisa gris, pantalón oscuro que alza la picana.
 * - Círculo azul marino decorativo detrás de la carreta.
 * - Marcha continua hacia la derecha con suave vaivén vertical, alternancia de patas y rotación concéntrica sincronizada.
 */
export default function CartRoad() {
  return (
    <section
      aria-label="Franja del camino tradicional: Boyeo y Carreta Típica"
      className="cart-road-strip"
      style={{
        position: 'relative',
        width: '100%',
        height: '160px',
        overflow: 'hidden',
        backgroundColor: 'var(--cru-cartroad-bg, #FFFFFF)',
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

      {/* Camino de tierra y toba volcánica tradicional con puntos */}
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

      {/* Composición Ilustrada Completa: Boyeo y Carreta Tradicional */}
      <div
        className="animate-oxcart-cross"
        style={{
          position: 'absolute',
          bottom: '10px',
          left: 0,
          width: '540px',
          height: '165px',
          pointerEvents: 'none'
        }}
      >
        <div className="animate-oxcart-sway" style={{ width: '100%', height: '100%' }}>
          <svg
            viewBox="0 0 540 180"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            aria-label="Carreta típica costarricense guiada por yunta de bueyes y boyero tradicional"
          >
            {/* ==========================================================
                1. SOMBRA SUAVE EN EL CAMINO DE TIERRA
                ========================================================== */}
            <g id="sombra-suelo">
              <ellipse cx="270" cy="162" rx="230" ry="7" fill="rgba(60, 40, 20, 0.22)" />
            </g>

            {/* ==========================================================
                2. CÍRCULO AZUL MARINO DECORATIVO DE FONDO
                ========================================================== */}
            <g id="circulo-decorativo">
              <circle cx="195" cy="98" r="68" fill="#0B2D5B" />
            </g>

            {/* ==========================================================
                3. EL CAMPESINO / BOYERO CON SOMBRERO Y PICANA
                ========================================================== */}
            <g id="campesino">
              {/* Zapatos oscuros sobre el camino */}
              <rect x="80" y="156" width="16" height="5" rx="2" fill="#111827" />
              <rect x="95" y="156" width="16" height="5" rx="2" fill="#0B0F19" />

              {/* Pantalón oscuro */}
              <rect x="82" y="124" width="12" height="34" rx="2" fill="#1F2937" />
              <rect x="97" y="124" width="12" height="34" rx="2" fill="#111827" />
              <rect x="80" y="120" width="31" height="8" fill="#1F2937" />

              {/* Torso y camisa gris clara */}
              <path d="M 80 78 L 108 78 L 112 122 L 78 122 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />

              {/* Brazo izquierdo extendido hacia la carreta */}
              <path d="M 104 82 L 122 96 L 118 102 L 100 88 Z" fill="#CBD5E1" />
              <circle cx="122" cy="99" r="4.5" fill="#795548" />

              {/* Cuello y cabeza con tez morena */}
              <rect x="89" y="70" width="10" height="10" fill="#795548" />
              <circle cx="94" cy="62" r="11" fill="#795548" />
              {/* Boca tradicional abierta dirigiendo la yunta */}
              <path d="M 102 61 Q 105 64 102 67 Z" fill="#2B1D17" />
              {/* Ojo sereno */}
              <circle cx="97" cy="58" r="1.5" fill="#1F1612" />

              {/* Sombrero blanco/crema con cinta roja */}
              <rect x="76" y="48" width="36" height="4.5" rx="2" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="0.8" />
              <rect x="82" y="44" width="24" height="4" fill="#D32F2F" />
              <path d="M 82 44 L 85 32 L 103 32 L 106 44 Z" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="0.8" />

              {/* Brazo derecho levantado empuñando la picana */}
              <path d="M 84 82 L 70 70 L 66 74 L 80 88 Z" fill="#CBD5E1" />
              <circle cx="68" cy="72" r="4.5" fill="#795548" />

              {/* Vara / Picana tradicional alzada con leve vaivén */}
              <g id="vara" className="animate-picana" style={{ transformOrigin: '68px 72px' }}>
                <line x1="68" y1="72" x2="38" y2="12" stroke="#4A2E18" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="68" y1="72" x2="38" y2="12" stroke="#6B3E1F" strokeWidth="1.6" strokeLinecap="round" />
              </g>
            </g>

            {/* ==========================================================
                4. LA CARRETA TÍPICA ROJA CON LATERALES ALMENADOS
                ========================================================== */}
            <g id="cuerpoCarreta">
              {/* Chasis base y piso de madera */}
              <rect x="120" y="124" width="145" height="8" rx="2" fill="#4A2E18" stroke="#1B120C" strokeWidth="1" />

              {/* Silueta roja principal inclinada hacia adelante */}
              <polygon points="122,86 265,86 250,126 130,126" fill="#D32F2F" />
              {/* Sombra angular interior en la caja */}
              <polygon points="130,126 250,126 244,118 136,118" fill="#B71C1C" />

              {/* Franja azul clara tradicional debajo de las almenas */}
              <rect x="122" y="74" width="143" height="12" fill="#7EB8DA" stroke="#FFFFFF" strokeWidth="1.2" />

              {/* Almenas rectangulares prominentes con borde blanco */}
              {[124, 154, 184, 214, 244].map((ax) => (
                <rect
                  key={ax}
                  x={ax}
                  y="54"
                  width="18"
                  height="20"
                  fill="#D32F2F"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                />
              ))}

              {/* Lanza / Timón de madera uniendo el eje de la carreta al yugo */}
              <line x1="195" y1="114" x2="385" y2="78" stroke="#4A2E18" strokeWidth="6" strokeLinecap="round" />
              <line x1="195" y1="113" x2="385" y2="77" stroke="#6B3E1F" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* ==========================================================
                5. GRAN RUEDA DE MANDALA (ELEMENTO PROTAGONISTA)
                (Centro X=195, Y=114, Radio=46 -> Base firme en Y=160)
                ========================================================== */}
            <g id="rueda" transform="translate(195, 114)">
              <g className="animate-oxcart-wheel" style={{ transformOrigin: '0px 0px' }}>
                <g transform="scale(0.297)">
                  <use href="#mandala-carreta-wheel" />
                </g>
              </g>
              {/* Maza y clavija central de sujeción */}
              <circle cx="0" cy="0" r="5" fill="#1B120C" stroke="#D97706" strokeWidth="1.6" />
            </g>

            {/* ==========================================================
                6. YUNTA DE DOS BUEYES PARDOS AL FRENTE (MARCHA A LA DERECHA)
                ========================================================== */}
            <g id="bueyes">
              {/* --------------------------------------------------------
                  BUEY 2 (FONDO / SEGUNDO PLANO - PARDO GRISÁCEO OSCURO)
                  -------------------------------------------------------- */}
              <g id="buey-fondo" opacity="0.94">
                {/* Patas con alternancia de marcha y pezuñas blancas */}
                <g className="animate-ox-leg-back" style={{ transformOrigin: '348px 108px' }}>
                  <line x1="348" y1="108" x2="346" y2="138" stroke="#6B5C55" strokeWidth="7" strokeLinecap="round" />
                  <line x1="346" y1="138" x2="345" y2="152" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
                  <rect x="341" y="152" width="8" height="4" fill="#2B1D17" />
                </g>
                <g className="animate-ox-leg-front" style={{ transformOrigin: '412px 108px' }}>
                  <line x1="412" y1="108" x2="414" y2="138" stroke="#6B5C55" strokeWidth="7" strokeLinecap="round" />
                  <line x1="414" y1="138" x2="415" y2="152" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
                  <rect x="411" y="152" width="8" height="4" fill="#2B1D17" />
                </g>

                {/* Cuerpo y lomo */}
                <ellipse cx="380" cy="94" rx="42" ry="24" fill="#6B5C55" />
                {/* Giba prominente */}
                <ellipse cx="400" cy="74" rx="14" ry="10" fill="#6B5C55" />
                {/* Cuello y cabeza */}
                <circle cx="434" cy="80" r="16" fill="#6B5C55" />
                <ellipse cx="444" cy="86" rx="9" ry="6" fill="#5A4D47" />

                {/* Cuernos curvados hacia adentro */}
                <path d="M 430 68 C 426 52 414 44 406 46" fill="none" stroke="#2B1D17" strokeWidth="4.2" strokeLinecap="round" />
                <path d="M 440 68 C 444 52 456 44 464 46" fill="none" stroke="#2B1D17" strokeWidth="4.2" strokeLinecap="round" />
                {/* Orejas caídas */}
                <ellipse cx="418" cy="80" rx="7" ry="4.5" fill="#5A4D47" />
              </g>

              {/* --------------------------------------------------------
                  BUEY 1 (PRIMER PLANO - PARDO GRISÁCEO CLARO)
                  -------------------------------------------------------- */}
              <g id="buey-frente">
                {/* Cola con borla */}
                <path d="M 312 92 C 304 100 306 114 304 126" fill="none" stroke="#87756D" strokeWidth="2.8" strokeLinecap="round" />
                <ellipse cx="304" cy="128" rx="3.5" ry="5" fill="#3E2723" />

                {/* Patas con alternancia de marcha (pezuñas blancas / calcetines) */}
                {/* Pata trasera izquierda */}
                <g className="animate-ox-leg-front" style={{ transformOrigin: '328px 116px' }}>
                  <line x1="328" y1="116" x2="326" y2="142" stroke="#9E8B82" strokeWidth="7.5" strokeLinecap="round" />
                  <line x1="326" y1="142" x2="325" y2="156" stroke="#FFFFFF" strokeWidth="7.5" strokeLinecap="round" />
                  <rect x="321" y="156" width="8.5" height="4.5" rx="1" fill="#2B1D17" />
                </g>
                {/* Pata trasera derecha */}
                <g className="animate-ox-leg-back" style={{ transformOrigin: '346px 116px' }}>
                  <line x1="346" y1="116" x2="344" y2="142" stroke="#87756D" strokeWidth="7.5" strokeLinecap="round" />
                  <line x1="344" y1="142" x2="343" y2="156" stroke="#FFFFFF" strokeWidth="7.5" strokeLinecap="round" />
                  <rect x="339" y="156" width="8.5" height="4.5" rx="1" fill="#2B1D17" />
                </g>
                {/* Pata delantera izquierda */}
                <g className="animate-ox-leg-front" style={{ transformOrigin: '382px 116px' }}>
                  <line x1="382" y1="116" x2="384" y2="142" stroke="#9E8B82" strokeWidth="7.5" strokeLinecap="round" />
                  <line x1="384" y1="142" x2="385" y2="156" stroke="#FFFFFF" strokeWidth="7.5" strokeLinecap="round" />
                  <rect x="381" y="156" width="8.5" height="4.5" rx="1" fill="#2B1D17" />
                </g>
                {/* Pata delantera derecha */}
                <g className="animate-ox-leg-back" style={{ transformOrigin: '400px 116px' }}>
                  <line x1="400" y1="116" x2="402" y2="142" stroke="#87756D" strokeWidth="7.5" strokeLinecap="round" />
                  <line x1="402" y1="142" x2="403" y2="156" stroke="#FFFFFF" strokeWidth="7.5" strokeLinecap="round" />
                  <rect x="399" y="156" width="8.5" height="4.5" rx="1" fill="#2B1D17" />
                </g>

                {/* Cuerpo musculoso */}
                <ellipse cx="355" cy="102" rx="46" ry="26" fill="#9E8B82" />
                {/* Giba prominente */}
                <ellipse cx="376" cy="80" rx="16" ry="12" fill="#9E8B82" />

                {/* Pecho y cuello */}
                <path d="M 380 92 L 416 84 L 418 116 L 376 122 Z" fill="#9E8B82" />

                {/* Cabeza del buey (forma ovalada plana característica) */}
                <ellipse cx="418" cy="88" rx="18" ry="16" fill="#9E8B82" />

                {/* Hocico con dos ollares */}
                <ellipse cx="430" cy="94" rx="10" ry="7" fill="#87756D" />
                <circle cx="428" cy="94" r="1.6" fill="#2B1D17" />
                <circle cx="433" cy="94" r="1.6" fill="#2B1D17" />

                {/* Ojo sereno */}
                <circle cx="414" cy="84" r="2.4" fill="#1F1612" />
                <circle cx="415" cy="83.2" r="0.8" fill="#FFFFFF" />

                {/* Orejas caídas */}
                <ellipse cx="398" cy="88" rx="8" ry="5" fill="#87756D" />

                {/* Cuernos curvados hacia adentro */}
                <path d="M 412 76 C 408 60 394 50 384 52" fill="none" stroke="#F3E8CC" strokeWidth="4.6" strokeLinecap="round" />
                <path d="M 390 52 L 384 52" stroke="#2B1D17" strokeWidth="4.6" strokeLinecap="round" />

                <path d="M 424 76 C 428 60 442 50 452 52" fill="none" stroke="#F3E8CC" strokeWidth="4.6" strokeLinecap="round" />
                <path d="M 446 52 L 452 52" stroke="#2B1D17" strokeWidth="4.6" strokeLinecap="round" />
              </g>

              {/* --------------------------------------------------------
                  EL YUGO DE MADERA OSCURA Y COYUNDAS DE CUERO
                  -------------------------------------------------------- */}
              <g id="yugo">
                <path
                  d="M 368 76 C 382 72 400 80 416 75"
                  fill="none"
                  stroke="#2B1810"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 368 75 C 382 71 400 79 416 74"
                  fill="none"
                  stroke="#3E2723"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Coyundas y correajes */}
                <path d="M 382 76 L 384 88" stroke="#78350F" strokeWidth="3" />
                <path d="M 406 76 L 408 88" stroke="#78350F" strokeWidth="3" />
                {/* Clavija central dorada */}
                <circle cx="394" cy="76" r="3.2" fill="#FFCA26" stroke="#131313" strokeWidth="1" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
