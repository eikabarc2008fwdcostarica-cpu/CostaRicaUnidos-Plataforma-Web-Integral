import React from 'react';
import '../../styles/heroAnimations.css';

/**
 * ============================================================================
 * HeroScene — Escena Ilustrada Natural Costarricense
 * Recreación fiel y detallada de la escena de referencia del Volcán Arenal:
 *   - Volcán cónico con crestas rocosas detalladas y sombras de relieve (100% ESTÁTICO, SIN HUMO)
 *   - Lago Arenal reflectante con reflejos sutiles (ESTÁTICO)
 *   - Sol radiante con dos anillos concéntricos translúcidos en oro (ESTÁTICO)
 *   - Cúmulos de nubes blancas flotando por el cielo (ANIMACIÓN SUAVE)
 *   - Pareja de dos lapas rojas (Ara macao) volando en tándem con aleteo biomecánico generado por el cuerpo
 *   - Rama superior izquierda con follaje tupido en suave vaivén
 *   - Heliconias (platanillos) con brácteas rojo-amarillo fuego y hojas anchas
 *   - Tucán pico iris posado en su percha de madera (ESTÁTICO)
 *   - Montañas lejanas en azul profundo desvanecido (ESTÁTICAS)
 * ============================================================================
 */
export default function HeroScene({ isNight = false }) {
  return (
    <div
      aria-hidden="true"
      className="hero-scenic-viewport"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
        transition: 'background 0.8s ease-in-out'
      }}
    >
      <svg
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          inset: 0
        }}
      >
        <defs>
          {/* 1. Gradiente del Cielo (Día y Noche) */}
          <linearGradient id="skyGradDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B4BB8" />
            <stop offset="28%" stopColor="#1565C0" />
            <stop offset="58%" stopColor="#1E88E5" />
            <stop offset="82%" stopColor="#42A5F5" />
            <stop offset="100%" stopColor="#81D4FA" />
          </linearGradient>

          <linearGradient id="skyGradNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="40%" stopColor="#061536" />
            <stop offset="100%" stopColor="#0B2252" />
          </linearGradient>

          {/* 2. Gradiente del Sol Radiante */}
          <radialGradient id="sunCoreGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="35%" stopColor="#FFCA26" />
            <stop offset="80%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#F57C00" />
          </radialGradient>

          {/* 3. Gradiente de la Luna */}
          <radialGradient id="moonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>

          {/* 4. Gradientes del Volcán Arenal */}
          {/* Lado iluminado / selva en la ladera izquierda */}
          <linearGradient id="volcanoGreenSlope" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3FA662" />
            <stop offset="45%" stopColor="#24783F" />
            <stop offset="100%" stopColor="#154B26" />
          </linearGradient>

          {/* Lado en sombra volcánica profunda ladera derecha */}
          <linearGradient id="volcanoShadowSlope" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2C4E78" />
            <stop offset="45%" stopColor="#1A375E" />
            <stop offset="100%" stopColor="#10233D" />
          </linearGradient>

          {/* 5. Gradiente del Lago Arenal */}
          <linearGradient id="lakeGradDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#09559B" />
            <stop offset="45%" stopColor="#0F68BF" />
            <stop offset="100%" stopColor="#1976D2" />
          </linearGradient>
          <linearGradient id="lakeGradNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#031530" />
            <stop offset="50%" stopColor="#06224E" />
            <stop offset="100%" stopColor="#0A326E" />
          </linearGradient>

          {/* 6. Brácteas de Heliconia (Platanillo): Rojo Tomate en la Base a Amarillo Sol en la Punta (#D42518 a #FFCA26) */}
          <linearGradient id="heliconiaBractGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#D42518" />
            <stop offset="25%" stopColor="#E53935" />
            <stop offset="65%" stopColor="#F57C00" />
            <stop offset="100%" stopColor="#FFCA26" />
          </linearGradient>
          <linearGradient id="heliconiaBractGradRight" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#D42518" />
            <stop offset="25%" stopColor="#E53935" />
            <stop offset="65%" stopColor="#F57C00" />
            <stop offset="100%" stopColor="#FFCA26" />
          </linearGradient>
          <linearGradient id="heliconiaBractGradLeft" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#D42518" />
            <stop offset="25%" stopColor="#E53935" />
            <stop offset="65%" stopColor="#F57C00" />
            <stop offset="100%" stopColor="#FFCA26" />
          </linearGradient>

          {/* Gradientes de Madera y Corteza Orgánica para Árbol y Rama */}
          <linearGradient id="woodTrunkGradDay" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4A2B14" />
            <stop offset="40%" stopColor="#6B3E1F" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
          <linearGradient id="woodTrunkGradNight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E120D" />
            <stop offset="50%" stopColor="#2A1810" />
            <stop offset="100%" stopColor="#150C08" />
          </linearGradient>
          <linearGradient id="woodBranchGradDay" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#4A2B14" />
            <stop offset="60%" stopColor="#6B3E1F" />
            <stop offset="100%" stopColor="#8D5B4C" />
          </linearGradient>
          <linearGradient id="woodBranchGradNight" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#180E09" />
            <stop offset="60%" stopColor="#251610" />
            <stop offset="100%" stopColor="#341E15" />
          </linearGradient>

          {/* 7. Degradado de Hojas Tropicales */}
          <linearGradient id="tropicalLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E7D32" />
            <stop offset="70%" stopColor="#1B5E20" />
            <stop offset="100%" stopColor="#0D3813" />
          </linearGradient>
          <linearGradient id="tropicalLeafLightGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#43A047" />
            <stop offset="70%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>

          {/* 8. Pico del Tucán */}
          <linearGradient id="toucanBeakUpper" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7CB342" />
            <stop offset="50%" stopColor="#FFCA26" />
            <stop offset="85%" stopColor="#FB8C00" />
            <stop offset="100%" stopColor="#E53935" />
          </linearGradient>
        </defs>

        {/* ====================================================================
            1. CIELO DE FONDO
            ==================================================================== */}
        <rect
          width="1440"
          height="620"
          fill={isNight ? 'url(#skyGradNight)' : 'url(#skyGradDay)'}
          style={{ transition: 'fill 0.8s ease-in-out' }}
        />

        {/* ====================================================================
            2. SOL RADIANTE CON DOS ANILLOS CONCÉNTRICOS TRANSLÚCIDOS (ESTÁTICO)
            ==================================================================== */}
        {!isNight ? (
          <g transform="translate(1210, 135)">
            {/* Anillo exterior translúcido */}
            <circle
              cx="0"
              cy="0"
              r="128"
              fill="rgba(255, 202, 38, 0.10)"
              stroke="rgba(255, 202, 38, 0.20)"
              strokeWidth="1.5"
            />
            {/* Anillo medio translúcido */}
            <circle
              cx="0"
              cy="0"
              r="94"
              fill="rgba(255, 202, 38, 0.18)"
              stroke="rgba(255, 202, 38, 0.32)"
              strokeWidth="1.5"
            />
            {/* Núcleo solar dorado cálido (#FFCA26) */}
            <circle
              cx="0"
              cy="0"
              r="64"
              fill="url(#sunCoreGrad)"
              filter="drop-shadow(0 0 35px rgba(255, 202, 38, 0.75))"
            />
          </g>
        ) : (
          /* Luna plateada en Modo Noche (Estática) */
          <g transform="translate(1210, 135)">
            <circle cx="0" cy="0" r="110" fill="rgba(226, 232, 240, 0.06)" stroke="rgba(226, 232, 240, 0.15)" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="80" fill="rgba(226, 232, 240, 0.12)" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="54" fill="url(#moonGrad)" filter="drop-shadow(0 0 25px rgba(226, 232, 240, 0.8))" />
            <circle cx="-14" cy="-12" r="9" fill="#CBD5E1" opacity="0.45" />
            <circle cx="15" cy="10" r="12" fill="#CBD5E1" opacity="0.4" />
            <circle cx="4" cy="20" r="7" fill="#CBD5E1" opacity="0.35" />
          </g>
        )}

        {/* Estrellas en Modo Noche (Estacionarias: Cero desplazamiento, únicamente titileo desfasado) */}
        {isNight && (
          <g>
            {[
              { x: 180, y: 70, r: 2.2, cls: 'star-twinkle-1' },
              { x: 340, y: 110, r: 1.8, cls: 'star-twinkle-2' },
              { x: 520, y: 55, r: 2.5, cls: 'star-twinkle-3' },
              { x: 740, y: 95, r: 2.0, cls: 'star-twinkle-1' },
              { x: 910, y: 65, r: 2.2, cls: 'star-twinkle-2' },
              { x: 1040, y: 130, r: 1.8, cls: 'star-twinkle-3' },
              { x: 260, y: 140, r: 2.0, cls: 'star-twinkle-1' }
            ].map((st, i) => (
              <circle
                key={i}
                cx={st.x}
                cy={st.y}
                r={st.r}
                fill="#FFFFFF"
                className={st.cls}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            ))}
          </g>
        )}

        {/* ====================================================================
            3. DESPLAZAMIENTO DE NUBES BLANCAS CÚMULOS (ANIMACIÓN C)
            ==================================================================== */}
        {/* Nube 1: Cúmulo esponjoso izquierdo */}
        <g className="cloud-drift-1" style={{ opacity: isNight ? 0.28 : 0.78 }}>
          <path
            d="M 120 220 
               L 260 220 
               C 275 220 285 208 280 195 
               C 285 175 265 160 248 165 
               C 238 145 208 140 190 152 
               C 178 138 148 142 140 160 
               C 120 162 108 180 115 198 
               C 105 208 112 220 120 220 Z"
            fill="#FFFFFF"
            filter="drop-shadow(0 4px 8px rgba(0, 32, 96, 0.08))"
          />
          {/* Sombra suave inferior de la nube */}
          <path
            d="M 120 220 L 260 220 C 275 220 282 214 278 206 C 240 212 160 212 122 208 C 115 214 116 220 120 220 Z"
            fill="#E1F5FE"
            opacity="0.8"
          />
        </g>

        {/* Nube 2: Cúmulo medio derecho */}
        <g className="cloud-drift-2" style={{ opacity: isNight ? 0.25 : 0.72 }}>
          <path
            d="M 870 210 
               L 1010 210 
               C 1025 210 1035 198 1030 186 
               C 1032 168 1015 155 998 160 
               C 988 142 960 138 942 150 
               C 930 136 902 140 895 158 
               C 876 160 864 176 870 192 
               C 860 200 864 210 870 210 Z"
            fill="#FFFFFF"
            filter="drop-shadow(0 4px 8px rgba(0, 32, 96, 0.08))"
          />
          <path
            d="M 870 210 L 1010 210 C 1024 210 1030 205 1026 198 C 990 203 915 203 874 199 C 867 205 868 210 870 210 Z"
            fill="#E1F5FE"
            opacity="0.75"
          />
        </g>

        {/* Nube 3: Cúmulo alto suave */}
        <g className="cloud-drift-3" style={{ opacity: isNight ? 0.20 : 0.60 }}>
          <path
            d="M 480 150 
               L 590 150 
               C 602 150 610 140 605 130 
               C 606 116 592 105 578 110 
               C 570 95 548 92 532 102 
               C 522 90 500 94 494 108 
               C 478 110 468 124 474 136 
               C 468 142 472 150 480 150 Z"
            fill="#FFFFFF"
          />
        </g>

        {/* ====================================================================
            4. PAREJA DE DOS LAPAS ROJAS (ARA MACAO) — VUELO BIOMECÁNICO EN TÁNDEM
            Movimiento orgánico generado íntegramente por el cuerpo y las alas.
            ==================================================================== */}
        <g className="animate-macaw-pair-flight" style={{ pointerEvents: 'none' }}>
          {/* LAPA 1: Lapa Guía (Adelantada) */}
          <g transform="translate(60, 0)">
            <g className="macaw-body-lead">
              {/* Ala Lejana (Fondo - vista detrás del cuerpo) */}
              <g className="macaw-wing-far-lead">
                <path d="M 6 12 C 14 -2 30 -16 46 -14 C 38 0 26 12 8 18 Z" fill="#991B1B" />
                <path d="M 14 8 C 22 -3 32 -10 44 -9 C 37 1 28 9 16 13 Z" fill="#D97706" />
                <path d="M 22 2 C 28 -5 36 -9 44 -8 C 38 1 30 7 24 5 Z" fill="#1E3A8A" />
              </g>

              {/* Cola Larga y Esbelta (Follow-through aerodinámico) */}
              <g className="macaw-tail-lead">
                <path d="M -8 18 L -52 30 L -6 22 Z" fill="#1D4ED8" />
                <path d="M -8 18 L -38 27 L -6 21 Z" fill="#F59E0B" />
                <path d="M -6 17 L -70 26 L -6 21 Z" fill="#B91C1C" />
                <path d="M -5 18 L -74 25 L -5 20 Z" fill="#DC2626" />
              </g>

              {/* Torso aerodinámico de la lapa (Pecho prominente y silueta ahusada) */}
              <path
                d="M -6 18 C -2 14 8 13 18 14 C 26 15 32 11 36 7 C 38 11 36 17 30 20 C 22 23 8 24 -2 22 C -6 21 -7 19 -6 18 Z"
                fill="#DC2626"
              />

              {/* Cabeza y Garganta */}
              <circle cx="33" cy="11" r="5.5" fill="#DC2626" />

              {/* Parche facial blanco característico de la lapa (Ara macao) */}
              <path
                d="M 32 7.5 C 35.5 7.5 37.5 9.5 37.5 13 C 35 15 32 14 31 12 C 30.8 10 31 7.5 32 7.5 Z"
                fill="#FFFFFF"
              />
              <circle cx="34" cy="10.8" r="1.3" fill="#0F172A" />

              {/* Gran pico curvado bicolor */}
              <path
                d="M 36 8.5 C 43.5 10.5 41.5 20.5 37 18.5 C 36 15 35 12 36 8.5 Z"
                fill="#FFFBEB"
                stroke="#1E293B"
                strokeWidth="0.5"
              />
              <path d="M 35 16.5 L 38 17.5 L 36.5 19.5 Z" fill="#1E293B" />

              {/* Ala Cercana (Unida físicamente a la articulación del hombro) */}
              <g className="macaw-wing-near-lead">
                <path d="M 6 15 C 14 0 30 -18 48 -16 C 39 2 26 16 8 22 Z" fill="#EF4444" />
                <path d="M 14 10 C 22 -3 33 -13 46 -11 C 38 2 28 13 16 17 Z" fill="#FBBF24" />
                <path d="M 24 4 C 30 -6 38 -12 46 -10 C 39 2 31 10 26 7 Z" fill="#2563EB" />
              </g>
            </g>
          </g>

          {/* LAPA 2: Lapa Compañera (En formación tándem, ligeramente atrás y abajo) */}
          <g transform="translate(14, 20) scale(0.86)">
            <g className="macaw-body-companion">
              {/* Ala Lejana */}
              <g className="macaw-wing-far-companion">
                <path d="M 6 12 C 14 -2 30 -16 46 -14 C 38 0 26 12 8 18 Z" fill="#991B1B" />
                <path d="M 14 8 C 22 -3 32 -10 44 -9 C 37 1 28 9 16 13 Z" fill="#D97706" />
                <path d="M 22 2 C 28 -5 36 -9 44 -8 C 38 1 30 7 24 5 Z" fill="#1E3A8A" />
              </g>

              {/* Cola Larga */}
              <g className="macaw-tail-companion">
                <path d="M -8 18 L -52 30 L -6 22 Z" fill="#1D4ED8" />
                <path d="M -8 18 L -38 27 L -6 21 Z" fill="#F59E0B" />
                <path d="M -6 17 L -70 26 L -6 21 Z" fill="#B91C1C" />
                <path d="M -5 18 L -74 25 L -5 20 Z" fill="#DC2626" />
              </g>

              {/* Torso */}
              <path
                d="M -6 18 C -2 14 8 13 18 14 C 26 15 32 11 36 7 C 38 11 36 17 30 20 C 22 23 8 24 -2 22 C -6 21 -7 19 -6 18 Z"
                fill="#DC2626"
              />

              {/* Cabeza */}
              <circle cx="33" cy="11" r="5.5" fill="#DC2626" />
              <path
                d="M 32 7.5 C 35.5 7.5 37.5 9.5 37.5 13 C 35 15 32 14 31 12 C 30.8 10 31 7.5 32 7.5 Z"
                fill="#FFFFFF"
              />
              <circle cx="34" cy="10.8" r="1.3" fill="#0F172A" />

              {/* Pico */}
              <path
                d="M 36 8.5 C 43.5 10.5 41.5 20.5 37 18.5 C 36 15 35 12 36 8.5 Z"
                fill="#FFFBEB"
                stroke="#1E293B"
                strokeWidth="0.5"
              />
              <path d="M 35 16.5 L 38 17.5 L 36.5 19.5 Z" fill="#1E293B" />

              {/* Ala Cercana */}
              <g className="macaw-wing-near-companion">
                <path d="M 6 15 C 14 0 30 -18 48 -16 C 39 2 26 16 8 22 Z" fill="#EF4444" />
                <path d="M 14 10 C 22 -3 33 -13 46 -11 C 38 2 28 13 16 17 Z" fill="#FBBF24" />
                <path d="M 24 4 C 30 -6 38 -12 46 -10 C 39 2 31 10 26 7 Z" fill="#2563EB" />
              </g>
            </g>
          </g>
        </g>

        {/* ====================================================================
            5. CORDILLERA LEJANA DE FONDO (MONTAÑAS AZUL PROFUNDO - ESTÁTICAS)
            ==================================================================== */}
        {/* Cordillera de Fondo Izquierda */}
        <path
          d="M 0 340 L 140 260 L 290 310 L 460 230 L 630 330 L 630 450 L 0 450 Z"
          fill={isNight ? '#051838' : '#0E3A75'}
          opacity={isNight ? 0.95 : 0.88}
        />
        {/* Cordillera de Fondo Derecha */}
        <path
          d="M 720 340 L 880 250 L 1050 300 L 1240 220 L 1440 280 L 1440 450 L 720 450 Z"
          fill={isNight ? '#051838' : '#0E3A75'}
          opacity={isNight ? 0.95 : 0.88}
        />
        {/* Montañas Medias con Siluetas Naturales */}
        <path
          d="M 0 370 L 190 290 L 390 350 L 590 280 L 780 360 L 990 280 L 1220 345 L 1440 270 L 1440 460 L 0 460 Z"
          fill={isNight ? '#08214A' : '#145CB0'}
          opacity={isNight ? 0.98 : 0.92}
        />

        {/* ====================================================================
            6. VOLCÁN ARENAL (ESTRATOVOLCÁN CÓNICO CENTRAL CON CRESTAS - ESTÁTICO)
            ==================================================================== */}
        {/* Base Principal del Volcán Arenal */}
        <path
          d="M 280 445 C 410 405 530 300 668 178 L 684 179 C 810 300 930 405 1090 445 L 1090 495 L 280 495 Z"
          fill={isNight ? '#061324' : '#153052'}
        />

        {/* Ladera Izquierda: Bosque Iluminado y Cañadas Esmeralda */}
        <path
          d="M 668 178 C 615 255 525 340 410 445 L 490 445 C 580 350 648 265 671 179 Z"
          fill={isNight ? '#082115' : 'url(#volcanoGreenSlope)'}
        />
        <path
          d="M 671 179 C 646 265 600 350 545 445 L 625 445 C 658 355 671 270 674 179 Z"
          fill={isNight ? '#0B2618' : '#2F8A4B'}
        />
        <path
          d="M 674 179 C 665 258 645 340 618 445 L 664 445 C 672 350 674 260 675 179 Z"
          fill={isNight ? '#0E2E1D' : '#45B368'}
        />

        {/* Ladera Derecha: Sombras Volcánicas Profundas y Crestas Rocosas */}
        <path
          d="M 675 179 C 685 270 705 355 735 445 L 795 445 C 760 355 725 265 679 180 Z"
          fill={isNight ? '#050D18' : 'url(#volcanoShadowSlope)'}
        />
        <path
          d="M 679 180 C 735 280 800 370 895 445 L 965 445 C 880 365 800 280 682 180 Z"
          fill={isNight ? '#030810' : '#182F50'}
        />
        <path
          d="M 682 180 C 795 300 910 385 1090 445 L 1025 445 C 885 380 780 295 684 180 Z"
          fill={isNight ? '#02060C' : '#12233C'}
        />

        {/* Cráter Somital Indentado */}
        <path
          d="M 662 178 Q 675 183 688 179 L 685 186 Q 675 189 664 184 Z"
          fill={isNight ? '#010307' : '#0F1D30'}
        />


        {/* ====================================================================
            8. COLINAS Y DOSEL DE SELVA TROPICAL AL PIE DEL VOLCÁN (ESTÁTICAS)
            ==================================================================== */}
        {/* Nivel 1 de Colinas */}
        <path
          d="M 250 450 Q 330 405 410 425 Q 490 395 570 420 Q 660 390 760 420 Q 860 395 960 425 Q 1040 405 1140 450 L 1140 500 L 250 500 Z"
          fill={isNight ? '#061D0F' : '#1B6935'}
        />

        {/* Nivel 2 de Selva Ondulante */}
        <path
          d="M 200 465 Q 310 425 430 450 Q 550 420 670 455 Q 790 425 920 455 Q 1030 430 1180 470 L 1180 500 L 200 500 Z"
          fill={isNight ? '#04160B' : '#145A2C'}
        />

        {/* Ribera Verde Esmeralda */}
        <path
          d="M 180 480 Q 370 450 570 470 Q 770 450 970 475 Q 1100 460 1230 490 L 1230 500 L 180 500 Z"
          fill={isNight ? '#082413' : '#27AE60'}
        />

        {/* ====================================================================
            9. LAGO ARENAL (ESPEJO DE AGUA CON REFLEJOS HORIZONTALES - ESTÁTICO)
            ==================================================================== */}
        {/* Superficie del Lago */}
        <rect
          x="0"
          y="488"
          width="1440"
          height="62"
          fill={isNight ? 'url(#lakeGradNight)' : 'url(#lakeGradDay)'}
        />

        {/* Líneas horizontales de reflejo sutil (ESTÁTICAS) */}
        <g opacity={isNight ? 0.45 : 0.75}>
          <line x1="620" y1="500" x2="740" y2="500" stroke={isNight ? '#7DD3FC' : '#E0F2FE'} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="570" y1="508" x2="780" y2="508" stroke={isNight ? '#7DD3FC' : '#E0F2FE'} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="650" y1="516" x2="810" y2="516" stroke={isNight ? '#7DD3FC' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <line x1="930" y1="504" x2="1000" y2="504" stroke={isNight ? '#7DD3FC' : '#BAE6FD'} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <line x1="430" y1="510" x2="510" y2="510" stroke={isNight ? '#7DD3FC' : '#BAE6FD'} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <line x1="820" y1="524" x2="920" y2="524" stroke={isNight ? '#7DD3FC' : '#E0F2FE'} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        </g>

        {/* ====================================================================
            10. RAMA SUPERIOR IZQUIERDA CON FOLLAJE TUPIDO (ANIMACIÓN B - RAMA)
            ==================================================================== */}
        <g className="sway-top-branch">
          {/* Rama Principal de Madera */}
          <path
            d="M -20 0 Q 95 38 190 102 Q 150 112 -20 42 Z"
            fill={isNight ? '#221410' : '#4E342E'}
          />
          {/* Ramificación Secundaria */}
          <path
            d="M 75 48 Q 138 42 180 70 L 170 78 Q 132 54 70 60 Z"
            fill={isNight ? '#221410' : '#4E342E'}
          />

          {/* Hojas Verdes Tropicales con Nervaduras Detalladas */}
          {[
            { cx: 55, cy: 70, rx: 24, ry: 11, rot: -25, color: '#1B5E20' },
            { cx: 90, cy: 85, rx: 26, ry: 12, rot: -10, color: '#2E7D32' },
            { cx: 128, cy: 102, rx: 25, ry: 11, rot: 15, color: '#388E3C' },
            { cx: 170, cy: 118, rx: 28, ry: 12, rot: 30, color: '#43A047' },
            { cx: 198, cy: 108, rx: 24, ry: 10, rot: 45, color: '#66BB6A' },
            { cx: 118, cy: 65, rx: 22, ry: 10, rot: -35, color: '#1B5E20' },
            { cx: 155, cy: 80, rx: 24, ry: 11, rot: -5, color: '#2E7D32' },
            { cx: 75, cy: 102, rx: 22, ry: 10, rot: 20, color: '#43A047' },
            { cx: 215, cy: 125, rx: 20, ry: 9, rot: 35, color: '#4CAF50' },
            { cx: 140, cy: 125, rx: 22, ry: 10, rot: 10, color: '#2E7D32' }
          ].map((lf, idx) => (
            <g key={idx} transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}>
              <ellipse
                cx={lf.cx}
                cy={lf.cy}
                rx={lf.rx}
                ry={lf.ry}
                fill={isNight ? '#0D2614' : lf.color}
              />
              {/* Nervadura central de la hoja */}
              <line
                x1={lf.cx - lf.rx + 2}
                y1={lf.cy}
                x2={lf.cx + lf.rx - 2}
                y2={lf.cy}
                stroke={isNight ? '#1B5E20' : '#81C784'}
                strokeWidth="1.2"
                opacity="0.75"
              />
            </g>
          ))}
        </g>

        {/* ====================================================================
            11. PRIMER PLANO: HELICONIAS Y HOJAS ANCHAS LANCEOLADAS (ANIMACIÓN B)
            ==================================================================== */}
        {/* AGRUPACIÓN IZQUIERDA DE HOJAS TROPICALES Y HELICONIAS */}
        <g className="sway-flora-left">
          {/* Hojas Grandes en Abanico (Musa / Heliconia) en Verde Bosque (#19532B) */}
          <path
            d="M -30 620 Q 55 420 185 340 Q 145 470 35 620 Z"
            fill={isNight ? '#072010' : '#19532B'}
          />
          {/* Nervadura de hoja 1 */}
          <path d="M 0 600 Q 80 460 180 345" fill="none" stroke="#4CAF50" strokeWidth="2.5" opacity="0.6" />

          <path
            d="M -10 620 Q 85 440 235 390 Q 165 500 65 620 Z"
            fill={isNight ? '#0C2D18' : '#236B38'}
          />
          <path d="M 20 605 Q 110 480 230 395" fill="none" stroke="#81C784" strokeWidth="2" opacity="0.6" />

          <path
            d="M 15 620 Q 125 450 315 440 Q 215 530 105 620 Z"
            fill={isNight ? '#10391F' : '#2E7D32'}
          />
          <path d="M 50 610 Q 150 490 310 445" fill="none" stroke="#A5D6A7" strokeWidth="2" opacity="0.65" />

          <path
            d="M -15 620 Q 75 520 225 540 Q 135 580 45 620 Z"
            fill={isNight ? '#144627' : '#388E3C'}
          />
        </g>

        {/* INFLORESCENCIAS DE HELICONIAS (PLATANILLO DE FUEGO) - IZQUIERDA */}
        {/* Heliconia 1 (Alta imponente) — Raquis continuo y brácteas firmemente conectadas */}
        <g className="sway-heliconia-1" style={{ transformOrigin: '75px 620px' }}>
          {/* Tallo Robusto Verde Bosque continuo hasta el ápice */}
          <path d="M 60 620 Q 68 490 75 380 Q 79 300 81 228" fill="none" stroke="#19532B" strokeWidth="6" strokeLinecap="round" />
          {/* Brácteas cónicas alternadas insertadas directamente en el raquis (#D42518 a #FFCA26) */}
          <path d="M 67 476 L 67 450 Q 98 434 130 412 Q 106 458 67 476 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 74 446 L 74 420 Q 44 404 18 382 Q 42 428 74 446 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 72 414 L 72 388 Q 100 372 128 350 Q 104 396 72 414 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 78 382 L 78 356 Q 50 340 24 318 Q 48 364 78 382 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 76 350 L 76 326 Q 100 312 122 290 Q 102 334 76 350 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 81 320 L 81 296 Q 56 282 34 262 Q 54 304 81 320 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 78 290 L 78 268 Q 98 256 114 238 Q 98 276 78 290 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          {/* Ápice terminal floral */}
          <path d="M 79 248 Q 78 234 81 222 Q 84 234 83 248 Z" fill="#FFCA26" stroke="#19532B" strokeWidth="1" />
        </g>

        {/* Heliconia 2 (Media izquierda) */}
        <g className="sway-heliconia-2" style={{ transformOrigin: '160px 620px' }}>
          <path d="M 150 620 Q 158 520 166 430 Q 170 375 172 328" fill="none" stroke="#19532B" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 161 506 L 161 480 Q 188 466 214 446 Q 192 490 161 506 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 167 476 L 167 450 Q 138 436 114 416 Q 136 460 167 476 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 165 446 L 165 422 Q 188 408 210 390 Q 188 430 165 446 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 171 418 L 171 394 Q 144 380 122 362 Q 144 402 171 418 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 168 392 L 168 370 Q 188 358 204 342 Q 188 376 168 392 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 170 348 Q 169 336 172 324 Q 175 336 174 348 Z" fill="#FFCA26" stroke="#19532B" strokeWidth="0.8" />
        </g>

        {/* Heliconia 3 (Baja frontal izquierda) */}
        <g className="sway-heliconia-3" style={{ transformOrigin: '250px 620px' }}>
          <path d="M 240 620 Q 248 540 255 465 Q 259 430 262 398" fill="none" stroke="#19532B" strokeWidth="5" strokeLinecap="round" />
          <path d="M 250 538 L 250 514 Q 274 500 298 480 Q 278 522 250 538 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 256 512 L 256 488 Q 232 476 212 456 Q 232 498 256 512 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 254 488 L 254 466 Q 276 454 296 436 Q 278 474 254 488 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 260 464 L 260 442 Q 238 430 218 412 Q 236 450 260 464 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 260 416 Q 259 406 262 396 Q 265 406 264 416 Z" fill="#FFCA26" stroke="#19532B" strokeWidth="0.8" />
        </g>

        {/* Heliconia 4 (Centro inferior) */}
        <g className="sway-heliconia-1" style={{ transformOrigin: '380px 620px' }}>
          <path d="M 370 620 Q 378 555 385 495 Q 388 465 390 435" fill="none" stroke="#19532B" strokeWidth="4.8" strokeLinecap="round" />
          <path d="M 380 564 L 380 540 Q 404 528 426 510 Q 406 550 380 564 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 386 540 L 386 516 Q 364 504 344 488 Q 364 526 386 540 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 384 516 L 384 494 Q 406 482 422 470 Q 404 504 384 516 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 388 452 Q 387 442 390 432 Q 393 442 392 452 Z" fill="#FFCA26" stroke="#19532B" strokeWidth="0.8" />
        </g>

        {/* Hojas verdes arqueadas en el centro inferior */}
        <path
          d="M 320 620 Q 420 535 550 565 Q 450 600 360 620 Z"
          fill={isNight ? '#0E331B' : '#2E7D32'}
        />
        <path
          d="M 500 620 Q 600 550 720 570 Q 620 600 540 620 Z"
          fill={isNight ? '#144627' : '#388E3C'}
        />

        {/* ====================================================================
            12. VEGETACIÓN DERECHA, ÁRBOL PERIMETRAL, RAMA Y TUCÁN (ESTÁTICO)
            ==================================================================== */}
        {/* Follaje de Fondo del Margen Derecho */}
        <g className="sway-flora-right">
          <path
            d="M 1470 620 Q 1380 450 1250 380 Q 1320 490 1410 620 Z"
            fill={isNight ? '#072010' : '#19532B'}
          />
          <path
            d="M 1450 620 Q 1340 470 1180 430 Q 1270 525 1370 620 Z"
            fill={isNight ? '#0C2D18' : '#236B38'}
          />
          <path
            d="M 1430 620 Q 1310 500 1130 490 Q 1240 560 1330 620 Z"
            fill={isNight ? '#10391F' : '#2E7D32'}
          />
        </g>

        {/* TRONCO DE ÁRBOL PERIMETRAL EN EL BORDE DERECHO (ESTILIZADO, NO INVASIVO, ANCLAJE NATURAL) */}
        <g id="rightPerimeterTree">
          {/* Silueta del tronco perimetral que entra desde el borde derecho (right-0) */}
          <path
            d="M 1440 260 
               Q 1412 350 1392 430 
               Q 1372 490 1366 525 
               Q 1368 565 1382 620 
               L 1440 620 Z"
            fill={isNight ? 'url(#woodTrunkGradNight)' : 'url(#woodTrunkGradDay)'}
          />
          {/* Sombra de relieve en la corteza izquierda */}
          <path
            d="M 1440 260 
               Q 1412 350 1392 430 
               Q 1372 490 1366 525 
               Q 1368 565 1382 620 
               L 1392 620 
               Q 1378 565 1376 525 
               Q 1382 490 1402 430 
               Q 1422 350 1440 280 Z"
            fill={isNight ? '#120905' : '#3E2723'}
            opacity="0.5"
          />
          {/* Vetas y estrías longitudinales de corteza de árbol */}
          <path
            d="M 1440 310 Q 1420 380 1402 450 Q 1386 520 1396 620"
            fill="none"
            stroke={isNight ? '#150A07' : '#3E2723'}
            strokeWidth="1.8"
          />
          <path
            d="M 1440 370 Q 1426 430 1412 500 Q 1404 560 1416 620"
            fill="none"
            stroke={isNight ? '#22140E' : '#4A2B14'}
            strokeWidth="1.4"
          />
          <path
            d="M 1440 430 Q 1432 480 1424 535 Q 1422 580 1432 620"
            fill="none"
            stroke={isNight ? '#2E1A13' : '#6B3E1F'}
            strokeWidth="1.2"
            opacity="0.75"
          />
          {/* Nudo orgánico en la corteza del tronco */}
          <ellipse cx="1406" cy="445" rx="4.5" ry="9" fill={isNight ? '#140A07' : '#2E180D'} stroke={isNight ? '#22140E' : '#4A2B14'} strokeWidth="1.0" />
          <circle cx="1406" cy="445" r="2.2" fill={isNight ? '#0C0604' : '#1B0E07'} />
          <path d="M 1398 435 Q 1406 430 1414 435" fill="none" stroke={isNight ? '#251610' : '#6B3E1F'} strokeWidth="0.8" />
          <path d="M 1398 455 Q 1406 460 1414 455" fill="none" stroke={isNight ? '#251610' : '#6B3E1F'} strokeWidth="0.8" />

          {/* Pequeños brotes epífitos de hojas naciendo en la corteza superior e inferior */}
          <path
            d="M 1392 425 Q 1374 416 1364 422 Q 1376 434 1390 427 Z"
            fill={isNight ? '#0C2D18' : '#2E7D32'}
            stroke={isNight ? '#144627' : '#4CAF50'}
            strokeWidth="0.7"
          />
          <path
            d="M 1380 575 Q 1362 568 1354 576 Q 1366 586 1380 578 Z"
            fill={isNight ? '#10391F' : '#388E3C'}
            stroke={isNight ? '#1B5E20' : '#66BB6A'}
            strokeWidth="0.7"
          />
        </g>

        {/* Heliconia en el Margen Derecho (Raquis continuo y brácteas firmemente conectadas) */}
        <g className="sway-heliconia-right" style={{ transformOrigin: '1395px 620px' }}>
          <path d="M 1385 620 Q 1393 520 1398 430 Q 1401 380 1402 342" fill="none" stroke="#19532B" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 1394 518 L 1394 492 Q 1418 478 1442 460 Q 1422 504 1394 518 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 1400 492 L 1400 468 Q 1374 454 1352 434 Q 1374 476 1400 492 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 1396 466 L 1396 442 Q 1418 428 1438 412 Q 1420 452 1396 466 Z" fill="url(#heliconiaBractGradRight)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 1402 442 L 1402 420 Q 1380 406 1358 388 Q 1380 426 1402 442 Z" fill="url(#heliconiaBractGradLeft)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <path d="M 1400 360 Q 1399 348 1402 338 Q 1405 348 1404 360 Z" fill="#FFCA26" stroke="#19532B" strokeWidth="0.8" />
        </g>

        {/* RAMA DEL TUCÁN ANCLADA ORGÁNICAMENTE AL ÁRBOL PERIMETRAL DERECHO */}
        <g id="toucanPerchBranch">
          {/* Silueta principal de la rama con curvatura natural y collar de anclaje naciente del tronco */}
          <path
            d="M 1376 498 
               C 1358 514 1302 527 1238 534 
               C 1175 539 1105 541 1045 544 
               C 1032 544 1022 546 1028 548 
               C 1038 550 1105 548 1175 548 
               C 1238 548 1305 550 1354 558 
               C 1368 561 1374 564 1378 568 
               Z"
            fill={isNight ? 'url(#woodBranchGradNight)' : 'url(#woodBranchGradDay)'}
            filter="drop-shadow(0 3px 6px rgba(0, 0, 0, 0.28))"
          />

          {/* Veta profunda inferior de corteza en tono café #4A2B14 */}
          <path
            d="M 1042 547 C 1110 547 1190 547 1265 547 C 1325 549 1365 558 1376 564"
            fill="none"
            stroke={isNight ? '#150A07' : '#4A2B14'}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Veta central en tono café cálido #6B3E1F */}
          <path
            d="M 1058 545 C 1130 544 1215 542 1285 541 C 1335 539 1365 546 1374 550"
            fill="none"
            stroke={isNight ? '#22140E' : '#6B3E1F'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Veta superior de relieve y luz en #8D5B4C */}
          <path
            d="M 1072 544 C 1145 540 1230 536 1295 532 C 1340 527 1365 516 1374 508"
            fill="none"
            stroke={isNight ? '#2C1A12' : '#8D5B4C'}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Nudos de madera orgánicos (wood knots) */}
          {/* Nudo 1: cuello de inserción al tronco (x=1334) */}
          <ellipse cx="1334" cy="542" rx="5.5" ry="2.6" fill={isNight ? '#140A07' : '#3E2723'} stroke={isNight ? '#22140E' : '#4A2B14'} strokeWidth="1.0" />
          <ellipse cx="1334" cy="542" rx="2.5" ry="1.2" fill={isNight ? '#0C0604' : '#2A1810'} />
          <path d="M 1322 540 Q 1334 536 1346 540" fill="none" stroke={isNight ? '#22140E' : '#6B3E1F'} strokeWidth="0.8" />

          {/* Nudo 2: sector medio a la izquierda del tucán (x=1160) */}
          <ellipse cx="1160" cy="543" rx="4.5" ry="2.2" fill={isNight ? '#140A07' : '#3E2723'} stroke={isNight ? '#22140E' : '#4A2B14'} strokeWidth="0.8" />
          <ellipse cx="1160" cy="543" rx="2.0" ry="1.0" fill={isNight ? '#0C0604' : '#2A1810'} />
          <path d="M 1150 542 Q 1160 539 1170 542" fill="none" stroke={isNight ? '#22140E' : '#6B3E1F'} strokeWidth="0.8" />

          {/* Hojas y brotes verdes brotando en los extremos */}
          {/* Brote terminal bifurcado izquierdo */}
          <path d="M 1045 544 Q 1032 538 1022 532" fill="none" stroke={isNight ? '#1C110C' : '#5D4037'} strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 1045 546 Q 1035 550 1025 554" fill="none" stroke={isNight ? '#1C110C' : '#5D4037'} strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M 1022 532 Q 1010 524 1004 525 Q 1012 536 1022 532 Z"
            fill={isNight ? '#0D2D16' : '#2E7D32'}
            stroke={isNight ? '#144627' : '#4CAF50'}
            strokeWidth="0.8"
          />
          <line x1="1022" y1="532" x2="1006" y2="526" stroke={isNight ? '#1E5830' : '#81C784'} strokeWidth="0.6" />
          <path
            d="M 1032 538 Q 1028 526 1034 520 Q 1040 530 1032 538 Z"
            fill={isNight ? '#10391F' : '#388E3C'}
            stroke={isNight ? '#1B5E20' : '#66BB6A'}
            strokeWidth="0.8"
          />
          <line x1="1032" y1="538" x2="1033" y2="522" stroke={isNight ? '#1E5830' : '#A5D6A7'} strokeWidth="0.6" />
          <circle cx="1020" cy="531" r="1.5" fill={isNight ? '#1B5E20' : '#8BC34A'} />

          {/* Brote tierno a mitad de rama cerca del nudo (x=1152) */}
          <path d="M 1152 542 Q 1146 532 1138 528" fill="none" stroke={isNight ? '#1C110C' : '#5D4037'} strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M 1138 528 Q 1128 522 1124 526 Q 1132 533 1138 528 Z"
            fill={isNight ? '#10391F' : '#43A047'}
            stroke={isNight ? '#1B5E20' : '#81C784'}
            strokeWidth="0.7"
          />

          {/* Brote tierno en el collar de inserción (x=1356) */}
          <path d="M 1356 550 Q 1348 538 1342 534" fill="none" stroke={isNight ? '#1C110C' : '#5D4037'} strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M 1342 534 Q 1332 528 1328 532 Q 1336 539 1342 534 Z"
            fill={isNight ? '#10391F' : '#43A047'}
            stroke={isNight ? '#1B5E20' : '#81C784'}
            strokeWidth="0.7"
          />
        </g>

        {/* TUCÁN PICO IRIS (RAMPHASTOS SULFURATUS) POSADO EN SU PERCHA (100% ESTÁTICO) */}
        <g transform="translate(1230, 432)">
          {/* Cola Negra Larga con Rabadilla Roja Carmín */}
          <path d="M -6 74 L -15 122 L -2 118 Z" fill="#111827" />
          <circle cx="-5" cy="76" r="5.5" fill="#D32F2F" />

          {/* Cuerpo Negro y Alas Plegadas */}
          <ellipse cx="2" cy="58" rx="19" ry="28" fill="#111827" />
          {/* Ala Plegada con Sombra de Plumas */}
          <path d="M -8 44 Q 18 50 12 80 Q -4 74 -8 44 Z" fill="#1F2937" />

          {/* Patas Celestes Sujetando Fuertemente la Rama */}
          <line x1="-3" y1="84" x2="-2" y2="103" stroke="#38BDF8" strokeWidth="3.8" strokeLinecap="round" />
          <line x1="8" y1="84" x2="9" y2="103" stroke="#38BDF8" strokeWidth="3.8" strokeLinecap="round" />

          {/* Pecho / Babero Amarillo Brillante con Borde Escarlata */}
          <path
            d="M 4 35 C 21 39 21 69 4 75 C -3 75 -1 39 4 35 Z"
            fill="#FFEB3B"
            stroke="#D32F2F"
            strokeWidth="2.6"
          />

          {/* Cabeza Negra */}
          <circle cx="-2" cy="25" r="15" fill="#111827" />

          {/* Anillo Ocular Turquesa y Ojo */}
          <circle cx="5" cy="24" r="7.2" fill="#00BCD4" />
          <circle cx="6" cy="24" r="3.4" fill="#111827" />
          <circle cx="7.2" cy="23" r="1.2" fill="#FFFFFF" />

          {/* GRAN PICO ARCOÍRIS (PICO IRIS) DETALLADO */}
          {/* Base amarilla */}
          <path
            d="M 7 17 Q 38 14 62 30 Q 36 39 6 32 Z"
            fill="#FFCA26"
            stroke="#111827"
            strokeWidth="1.2"
          />
          {/* Culmen superior verde lima */}
          <path
            d="M 7 17 Q 38 14 49 23 Q 29 25 7 21 Z"
            fill="#8BC34A"
          />
          {/* Faja central naranja ardiente */}
          <path
            d="M 19 21 Q 40 18 51 25 Q 34 30 15 25 Z"
            fill="#FF9800"
          />
          {/* Punta roja carmín */}
          <path
            d="M 45 23 Q 62 30 51 34 Q 40 28 45 23 Z"
            fill="#E53935"
          />
          {/* Punta inferior celeste turquesa */}
          <path
            d="M 53 30 L 62 30 L 55 33 Z"
            fill="#00BCD4"
          />
          {/* Línea divisoria mandibular */}
          <line x1="7" y1="17" x2="6" y2="32" stroke="#111827" strokeWidth="2.8" />
        </g>

        {/* ====================================================================
            13. BORDE INFERIOR ORGÁNICO EN COLINAS SUAVES (CIERRE AL CONTENIDO)
            ==================================================================== */}
        <path
          d="M 0 580 Q 360 610 720 580 T 1440 580 L 1440 620 L 0 620 Z"
          fill={isNight ? '#020617' : '#F8FAFC'}
          style={{ transition: 'fill 0.8s ease-in-out' }}
        />
      </svg>
    </div>
  );
}
