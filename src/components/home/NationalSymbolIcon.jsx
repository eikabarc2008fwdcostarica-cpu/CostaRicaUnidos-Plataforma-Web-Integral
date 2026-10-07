import React from 'react';

/**
 * NationalSymbolIcon — 8 Símbolos y Emblemas Patrios de Costa Rica
 * 
 * 1. ventanilla: Guaria Morada (Flor Nacional - Guarianthe skinneri)
 * 2. concejo:    Rueda de Carreta Típica (Mandala multicolor Sarchí)
 * 3. averias:    Yigüirro (Ave Nacional - Turdus grayi)
 * 4. ccdr:       Colibrí Costarricense en vuelo (Símbolo de Biodiversidad)
 * 5. gis:        Manatí (Fauna Marina - Trichechus manatus)
 * 6. cne:        Granos de Café (Grano de Oro - Ramita con frutos rojos)
 * 7. comercio:   Venado Cola Blanca (Fauna Silvestre - Odocoileus virginianus)
 * 8. firma:      Mariposa Morpho Azul (Símbolo de la Biodiversidad)
 */
export default function NationalSymbolIcon({ symbolId, size = 34, className = '' }) {
  const s = size;

  switch (symbolId) {
    // 1. Guaria Morada (Flor Nacional)
    case 'ventanilla':
    case 'guaria':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Flor Nacional: Guaria Morada"
        >
          {/* Pétalos exteriores lila/orquídea */}
          <path
            d="M18 4C14 8 13 14 18 17C23 14 22 8 18 4Z"
            fill="#BA68C8"
            stroke="#9C27B0"
            strokeWidth="0.8"
          />
          <path
            d="M4 14C8 12 14 14 16 19C12 21 6 19 4 14Z"
            fill="#AB47BC"
            stroke="#8E24AA"
            strokeWidth="0.8"
          />
          <path
            d="M32 14C28 12 22 14 20 19C24 21 30 19 32 14Z"
            fill="#AB47BC"
            stroke="#8E24AA"
            strokeWidth="0.8"
          />
          <path
            d="M8 29C11 25 15 24 17 20C13 18 8 22 8 29Z"
            fill="#9C27B0"
            stroke="#7B1FA2"
            strokeWidth="0.8"
          />
          <path
            d="M28 29C25 25 21 24 19 20C23 18 28 22 28 29Z"
            fill="#9C27B0"
            stroke="#7B1FA2"
            strokeWidth="0.8"
          />
          {/* Labelo tubular central morado profundo */}
          <ellipse cx="18" cy="21" rx="5.5" ry="7" fill="#6A1B9A" stroke="#4A148C" strokeWidth="0.8" />
          {/* Garganta amarilla/oro brillante */}
          <ellipse cx="18" cy="19.5" rx="2.8" ry="3.5" fill="#FFCA26" />
          <circle cx="18" cy="19" r="1.3" fill="#FFF59D" />
        </svg>
      );

    // 2. Rueda de Carreta Típica (Mandala tradicional)
    case 'concejo':
    case 'carreta':
      return (
        <svg
          width={s}
          height={s}
          viewBox="-155 -155 310 310"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Símbolo Nacional: Rueda de Carreta Típica"
        >
          <use href="#mandala-carreta-wheel" />
        </svg>
      );

    // 3. Yigüirro (Ave Nacional - Turdus grayi)
    case 'averias':
    case 'yiguirro':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Ave Nacional: Yigüirro"
        >
          {/* Rama de soporte */}
          <path d="M4 30C12 28 24 28 32 31" stroke="#6B3E1F" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M8 29C10 27 12 28 14 30" stroke="#19532B" strokeWidth="1.4" strokeLinecap="round" />

          {/* Cola café oscura */}
          <path d="M9 25L3 29L7 32L12 27Z" fill="#5D4037" />

          {/* Cuerpo y lomo café tierra */}
          <ellipse cx="17" cy="21" rx="8" ry="6" fill="#795548" />

          {/* Pecho café arcilla más claro */}
          <path d="M16 16C21 17 24 22 22 26C18 27 14 26 15 20Z" fill="#A1887F" />

          {/* Ala con plumas superpuestas */}
          <path d="M11 19C13 17 19 19 18 25C14 26 11 23 11 19Z" fill="#5D4037" />
          <path d="M12 21C14 19 17 20 16 24" stroke="#4E342E" strokeWidth="0.8" />

          {/* Cabeza del yigüirro */}
          <circle cx="23" cy="14" r="5" fill="#795548" />

          {/* Ojo expresivo con brillo */}
          <circle cx="24.5" cy="13" r="1.5" fill="#2E1C0C" />
          <circle cx="24.8" cy="12.7" r="0.5" fill="#FFFFFF" />

          {/* Pico cónico amarillo claro */}
          <path d="M27.5 13.5L33 15.5L27.5 17Z" fill="#FFCA26" stroke="#E0A800" strokeWidth="0.5" />

          {/* Patas aferradas a la rama */}
          <line x1="16" y1="26" x2="15" y2="29" stroke="#3E2723" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="19" y1="26" x2="19" y2="29" stroke="#3E2723" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    // 4. Colibrí Costarricense en vuelo (Trochilidae) — Sustituye al Escudo en CCDR
    case 'ccdr':
    case 'colibri':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`colibri-symbol transition-transform duration-200 ${className}`}
          aria-label="Símbolo de Biodiversidad: Colibrí Costarricense en vuelo"
          style={{
            transition: 'transform 200ms ease',
            transformOrigin: 'center'
          }}
        >
          <defs>
            {/* Degradado Verde Esmeralda Radiante */}
            <linearGradient id="colibriEmerald" x1="10" y1="8" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="35%" stopColor="#00A86B" />
              <stop offset="100%" stopColor="#19532B" />
            </linearGradient>

            {/* Degradado Azul Turquesa / Zafiro para el pecho */}
            <linearGradient id="colibriSapphireChest" x1="14" y1="14" x2="22" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="40%" stopColor="#06B6D4" />
              <stop offset="80%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            {/* Degradado Violeta / Amatista Iridiscente para la garganta */}
            <linearGradient id="colibriVioletGorget" x1="14" y1="13" x2="19" y2="18" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>

            {/* Degradado del Ala Arqueada */}
            <linearGradient id="colibriWingGrad" x1="20" y1="3" x2="33" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#00A86B" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>

          {/* Ala Lejana (en el fondo, ángulo de aleteo superior) */}
          <path
            d="M 17 12 C 17 6 22 1.5 27 2 C 25 6 21 10 18 14 Z"
            fill="#047857"
            opacity="0.85"
          />
          <path
            d="M 19 8 C 22 4 25.5 2.5 26.5 2.5 C 24.5 5 21.5 8 19 9 Z"
            fill="#065F46"
            opacity="0.9"
          />

          {/* Cola Ahorquillada (Forked tail) con dos timoneras divergentes */}
          <path
            d="M 23 23 L 30 31.5 C 29 32 27 30.5 22 25 Z"
            fill="#0F766E"
          />
          <path
            d="M 24 23 L 34 29 C 33.5 30 30.5 28.5 23.5 24 Z"
            fill="#065F46"
          />
          {/* Hendidura central de la horquilla */}
          <polygon points="23,23 28,27 24,24" fill="#042F2E" opacity="0.6" />

          {/* Lomo y Cuerpo Verde Esmeralda */}
          <path
            d="M 16 11 C 21 11 25 15 25 21 C 25 25 20.5 25.5 17.5 23 C 15.5 20 15 14 16 11 Z"
            fill="url(#colibriEmerald)"
          />

          {/* Pecho con Destellos Azul Turquesa / Zafiro */}
          <path
            d="M 16 15 C 15 19 17.5 23.5 21 24 C 22 22 22 18.5 18.5 16 Z"
            fill="url(#colibriSapphireChest)"
          />

          {/* Destello sutil Violeta en la Garganta (Gorget iridiscente) */}
          <path
            d="M 14.8 14.2 C 16.2 16.8 18.5 17.2 19 15 C 17.5 14.5 16 13.8 14.8 14.2 Z"
            fill="url(#colibriVioletGorget)"
          />

          {/* Cabeza aerodinámica y corona esmeralda */}
          <circle cx="16.5" cy="12.5" r="3.6" fill="#00A86B" />
          <path d="M 14.5 10 C 16.5 9 19 10 19.5 11.5 C 18 10.8 15.8 10.5 14.5 10 Z" fill="#6EE7B7" opacity="0.75" />

          {/* Ojo vivaz oscuro con microbrillo */}
          <circle cx="15.8" cy="11.8" r="0.9" fill="#0F172A" />
          <circle cx="15.5" cy="11.5" r="0.3" fill="#FFFFFF" />

          {/* Pico Fino y Alargado (Pico nectarívoro estilizado) */}
          <path
            d="M 14.5 13.2 L 2.5 15.6 L 14.2 14.2 Z"
            fill="#0F172A"
          />

          {/* Ala Cercana Arqueada en Pleno Aleteo Dinámico */}
          <path
            d="M 18.5 14 C 21 5 28 0.5 33 1.5 C 31 6.5 26 13 20 17.5 Z"
            fill="url(#colibriWingGrad)"
          />
          {/* Plumas primarias y secundarias con gradación esmeralda brillante */}
          <path
            d="M 20 13.5 C 22.5 6.5 28 3 31.5 3 C 28.5 7 24.5 12 21 16 Z"
            fill="#34D399"
            opacity="0.65"
          />
          <path
            d="M 21.5 14 C 23.5 9.5 27 6.5 29.5 6 C 27.5 9 24.5 13 22 15.5 Z"
            fill="#A7F3D0"
            opacity="0.45"
          />

          {/* Resplandor y reflejo dorsal tornasol */}
          <ellipse cx="20" cy="18" rx="1.6" ry="3.2" fill="#6EE7B7" opacity="0.35" transform="rotate(-20 20 18)" />
        </svg>
      );

    // Escudo Nacional de Costa Rica (disponible para referencias específicas)
    case 'escudo':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Símbolo Patrio: Escudo Nacional"
        >
          {/* Silueta del blasón dorado */}
          <path
            d="M6 7C6 7 18 4 18 4C18 4 30 7 30 7C30 20 23 29 18 32C13 29 6 20 6 7Z"
            fill="#0284C7"
            stroke="#FFCA26"
            strokeWidth="1.6"
          />

          {/* Cielo superior y sol naciente */}
          <path d="M7 8C11 6 25 6 29 8V16H7V8Z" fill="#38BDF8" />
          <circle cx="18" cy="16" r="3.5" fill="#FFCA26" />
          {/* Rayos del sol */}
          <line x1="18" y1="11" x2="18" y2="13" stroke="#FFCA26" strokeWidth="0.8" />
          <line x1="14" y1="13" x2="15.5" y2="14.5" stroke="#FFCA26" strokeWidth="0.8" />
          <line x1="22" y1="13" x2="20.5" y2="14.5" stroke="#FFCA26" strokeWidth="0.8" />

          {/* 3 Volcanes verdes centrales */}
          <polygon points="10,21 14,14 18,21" fill="#15803D" stroke="#0F381C" strokeWidth="0.5" />
          <polygon points="14,21 18,13 22,21" fill="#16A34A" stroke="#0F381C" strokeWidth="0.5" />
          <polygon points="18,21 22,14 26,21" fill="#15803D" stroke="#0F381C" strokeWidth="0.5" />

          {/* Mar inferior y velero */}
          <path d="M7 21C11 20 25 20 29 21C27 26 23 29 18 31C13 29 9 26 7 21Z" fill="#003B7A" />
          {/* Barquito mercante blanco */}
          <path d="M16 24L18 22L18 24Z" fill="#FFFFFF" />
          <path d="M15 24L21 24L19.5 25.5L16.5 25.5Z" fill="#FFFFFF" />

          {/* Corona de estrellas patrias en arco */}
          {[12, 15, 18, 21, 24].map((x, i) => (
            <circle key={i} cx={x} cy={7.8} r={0.8} fill="#FFCA26" />
          ))}
        </svg>
      );

    // 5. Manatí (Fauna Marina - Trichechus manatus)
    case 'gis':
    case 'manati':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Símbolo Nacional: Manatí del Caribe"
        >
          {/* Ondas marinas suaves de fondo */}
          <path d="M2 12C6 10 10 14 14 12" stroke="#38BDF8" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
          <path d="M22 28C26 26 30 30 34 28" stroke="#38BDF8" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />

          {/* Cuerpo hidrodinámico del manatí */}
          {/* Cola ancha en pala redondeada */}
          <path d="M4 17C2 14 3 23 5 21C7 20 10 19 12 19Z" fill="#64748B" />

          {/* Torso robusto */}
          <path
            d="M10 19C12 16 18 15 24 16C28 17 31 19 32 22C31 24 28 25 23 24C16 24 12 21 10 19Z"
            fill="#94A3B8"
            stroke="#475569"
            strokeWidth="0.7"
          />

          {/* Cabeza y hocico característico */}
          <circle cx="28" cy="20.5" r="4.2" fill="#94A3B8" />
          <path d="M29.5 20C32.5 20.5 33 23 30 23.5Z" fill="#CBD5E1" />
          {/* Narina y ojo pequeño */}
          <circle cx="31" cy="21.5" r="0.6" fill="#334155" />
          <circle cx="27" cy="19.2" r="0.7" fill="#1E293B" />

          {/* Aleta pectoral */}
          <path d="M20 22C21 25 18 27 17 25C17 23 18 22 20 22Z" fill="#64748B" stroke="#475569" strokeWidth="0.6" />

          {/* Textura sutil del lomo */}
          <path d="M14 18C17 17 22 17 25 18" stroke="#CBD5E1" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        </svg>
      );

    // 6. Granos de Café (Grano de Oro)
    case 'cne':
    case 'cafe':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Símbolo Nacional: Granos de Café"
        >
          {/* Ramita de madera */}
          <path d="M6 31C12 25 20 15 28 5" stroke="#6B3E1F" strokeWidth="2" strokeLinecap="round" />

          {/* Hoja superior verde brillante */}
          <path
            d="M20 12C21 6 28 4 32 6C32 11 27 14 20 12Z"
            fill="#16A34A"
            stroke="#14532D"
            strokeWidth="0.7"
          />
          <path d="M22 10C26 8 29 7 31 6" stroke="#86EFAC" strokeWidth="0.7" />

          {/* Hoja inferior verde bosque */}
          <path
            d="M14 22C8 21 4 26 5 30C10 30 14 26 14 22Z"
            fill="#15803D"
            stroke="#14532D"
            strokeWidth="0.7"
          />
          <path d="M12 24C8 25 6 27 5 29" stroke="#86EFAC" strokeWidth="0.7" />

          {/* Racimo de granos maduros rojos (cerezas de café) */}
          {/* Grano 1 (Fondo) */}
          <circle cx="16" cy="14" r="3.6" fill="#991B1B" stroke="#7F1D1D" strokeWidth="0.6" />
          <circle cx="15.2" cy="13.2" r="1" fill="#F87171" opacity="0.8" />

          {/* Grano 2 (Principal) */}
          <circle cx="21" cy="17" r="4.2" fill="#DC2626" stroke="#991B1B" strokeWidth="0.7" />
          <circle cx="20" cy="15.8" r="1.2" fill="#FCA5A5" opacity="0.9" />
          <circle cx="23.2" cy="18" r="0.7" fill="#450A0A" />

          {/* Grano 3 */}
          <circle cx="16" cy="20" r="3.8" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="0.6" />
          <circle cx="15.2" cy="19" r="1" fill="#F87171" opacity="0.8" />
          <circle cx="17.8" cy="21.2" r="0.6" fill="#450A0A" />

          {/* Grano 4 (Verde/amarillo pintón) */}
          <circle cx="22" cy="23" r="3.2" fill="#EAB308" stroke="#CA8A04" strokeWidth="0.6" />
          <circle cx="21.2" cy="22.2" r="0.8" fill="#FEF08A" opacity="0.8" />
        </svg>
      );

    // 7. Venado Cola Blanca (Fauna Silvestre - Odocoileus virginianus)
    case 'comercio':
    case 'venado':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Símbolo Nacional: Venado Cola Blanca"
        >
          {/* Cuello y cabeza en castaño/canela */}
          <path
            d="M10 32C10 26 14 22 16 19L16 14C16 12 18 10 21 11L25 14C27 16 27 18 25 20L21 21C20 23 20 28 20 32Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="0.7"
          />

          {/* Pecho y garganta blanca */}
          <path d="M13 27C15 24 17 23 18 26C18 30 14 32 12 32Z" fill="#FEF3C7" />

          {/* Hocico blanco con trufa negra */}
          <path d="M24 15L27 17C27 18.5 25.5 19 24 18.5Z" fill="#FDE68A" />
          <circle cx="26.8" cy="17.2" r="0.8" fill="#1C1917" />

          {/* Ojo vivaz oscuro */}
          <ellipse cx="20.5" cy="14" rx="1.2" ry="1.6" fill="#1C1917" />
          <circle cx="20.8" cy="13.6" r="0.5" fill="#FFFFFF" />

          {/* Oreja erguida */}
          <path d="M16 12C13 8 13 4 15 4C17 6 18 10 18 12Z" fill="#B45309" stroke="#78350F" strokeWidth="0.6" />
          <path d="M15 10C14 7 14 5 15 5C16 6 16.5 8 16.5 10Z" fill="#FEF3C7" />

          {/* Cornamenta elegante ramificada */}
          {/* Asta izquierda */}
          <path d="M19 10C19 6 17 4 14 3" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M18 7C16 6 15 6 14 6" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" />
          <path d="M16 4C15 2 13 2 12 3" stroke="#FDE68A" strokeWidth="0.9" strokeLinecap="round" />

          {/* Asta derecha */}
          <path d="M21 10C22 6 25 4 28 3" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M22 7C24 6 26 6 27 6" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" />
          <path d="M25 4C27 2 29 2 30 3" stroke="#FDE68A" strokeWidth="0.9" strokeLinecap="round" />
        </svg>
      );

    // 8. Mariposa Morpho Azul (Símbolo de la Biodiversidad)
    case 'firma':
    case 'morpho':
    default:
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Símbolo Nacional: Mariposa Morpho Azul"
        >
          {/* Antenas delicadas */}
          <path d="M18 13C16 9 13 8 10 9" stroke="#131313" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M18 13C20 9 23 8 26 9" stroke="#131313" strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="9.8" cy="9.2" r="0.6" fill="#131313" />
          <circle cx="26.2" cy="9.2" r="0.6" fill="#131313" />

          {/* Ala anterior izquierda (Cobalto / Cian iridiscente) */}
          <path
            d="M17 14C12 6 4 9 4 16C4 20 10 22 17 19Z"
            fill="url(#morpho-blue-l)"
            stroke="#0B132B"
            strokeWidth="1"
          />
          {/* Puntos blancos en el borde alar */}
          <circle cx="5.5" cy="14" r="0.6" fill="#FFFFFF" opacity="0.9" />
          <circle cx="7" cy="11.5" r="0.6" fill="#FFFFFF" opacity="0.9" />

          {/* Ala posterior izquierda */}
          <path
            d="M17 19C12 21 7 24 9 29C12 31 16 28 17 22Z"
            fill="url(#morpho-blue-l)"
            stroke="#0B132B"
            strokeWidth="1"
          />

          {/* Ala anterior derecha */}
          <path
            d="M19 14C24 6 32 9 32 16C32 20 26 22 19 19Z"
            fill="url(#morpho-blue-r)"
            stroke="#0B132B"
            strokeWidth="1"
          />
          {/* Puntos blancos en el borde alar */}
          <circle cx="30.5" cy="14" r="0.6" fill="#FFFFFF" opacity="0.9" />
          <circle cx="29" cy="11.5" r="0.6" fill="#FFFFFF" opacity="0.9" />

          {/* Ala posterior derecha */}
          <path
            d="M19 19C24 21 29 24 27 29C24 31 20 28 19 22Z"
            fill="url(#morpho-blue-r)"
            stroke="#0B132B"
            strokeWidth="1"
          />

          {/* Nervaduras iridiscentes celestes */}
          <path d="M17 15C13 13 8 15 6 17" stroke="#BAE6FD" strokeWidth="0.6" opacity="0.75" />
          <path d="M19 15C23 13 28 15 30 17" stroke="#BAE6FD" strokeWidth="0.6" opacity="0.75" />

          {/* Cuerpo y tórax negro */}
          <ellipse cx="18" cy="18" rx="1.4" ry="7" fill="#0A0F1D" stroke="#1E293B" strokeWidth="0.4" />
          <circle cx="18" cy="12.5" r="1.3" fill="#0A0F1D" />

          <defs>
            <linearGradient id="morpho-blue-l" x1="4" y1="10" x2="17" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="25%" stopColor="#0284C7" />
              <stop offset="65%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="morpho-blue-r" x1="32" y1="10" x2="19" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="25%" stopColor="#0284C7" />
              <stop offset="65%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
