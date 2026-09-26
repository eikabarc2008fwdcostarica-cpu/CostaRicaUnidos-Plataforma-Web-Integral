import React, { useState, useEffect } from 'react';
import { MAPA_PROVINCIAS_SVG, PROVINCIAS_DATA } from '../data/costaRicaTerritorialData';

export default function InteractiveSvgMap({
  selectedProvinciaId,
  onSelectProvincia,
  onOpenDrawer
}) {
  const [hoveredProvincia, setHoveredProvincia] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, data: null });

  // Manejo de tecla Escape para salir de pantalla completa
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleMouseEnter = (e, provId) => {
    const provInfo = PROVINCIAS_DATA.find((p) => p.id === provId);
    setHoveredProvincia(provId);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      visible: true,
      data: provInfo
    });
  };

  const handleMouseLeave = () => {
    setHoveredProvincia(null);
    setTooltipPos(prev => ({ ...prev, visible: false }));
  };

  const handleProvinceClick = (provId) => {
    if (onSelectProvincia) {
      onSelectProvincia(provId);
    }
    if (onOpenDrawer) {
      onOpenDrawer(provId);
    }
  };

  const renderSvgContent = (inFullscreen = false) => {
    return (
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 740 580"
          style={{
            width: '100%',
            maxHeight: inFullscreen ? '78vh' : '520px',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.25s ease'
          }}
          aria-label="Mapa cartográfico vectorial interactivo de Costa Rica"
          role="img"
        >
          <defs>
            {/* Filtros de Resplandor y Relieve */}
            <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000d26" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00040D" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Océano y Fondos geográficos indicativos */}
          <rect width="740" height="580" fill="url(#ocean-gradient)" rx="16" />

          {/* Rótulos de Aguas Soberanas */}
          <text x="40" y="490" fill="rgba(121, 166, 255, 0.4)" fontSize="13" fontFamily="var(--font-telemetry)" letterSpacing="0.1em">
            OCÉANO PACÍFICO
          </text>
          <text x="540" y="100" fill="rgba(121, 166, 255, 0.4)" fontSize="13" fontFamily="var(--font-telemetry)" letterSpacing="0.1em">
            MAR CARIBE
          </text>

          {/* Inset Isla del Coco (Soberanía Nacional) */}
          <g transform="translate(40, 510)">
            <rect width="110" height="45" rx="8" fill="rgba(0, 20, 60, 0.6)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx="20" cy="22" r="5" fill="#F36717" />
            <text x="32" y="20" fill="#FFFFFF" fontSize="9" fontWeight="700">Isla del Coco</text>
            <text x="32" y="32" fill="#79a6ff" fontSize="7" fontFamily="var(--font-telemetry)">Cantón Central Puntarenas</text>
          </g>

          {/* Polígonos de las 7 Provincias */}
          {MAPA_PROVINCIAS_SVG.map((item) => {
            const provInfo = PROVINCIAS_DATA.find((p) => p.id === item.provinciaId);
            const isSelected = selectedProvinciaId === item.provinciaId;
            const isHovered = hoveredProvincia === item.provinciaId;

            // Relleno dinámico según tema provincial
            let fillColor = provInfo ? provInfo.color : '#002B7F';
            let fillOpacity = isSelected ? 0.9 : isHovered ? 0.75 : 0.45;
            let strokeColor = isSelected ? '#FFFFFF' : isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)';
            let strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;

            return (
              <g
                key={item.provinciaId}
                tabIndex={0}
                role="button"
                aria-label={`Provincia ${item.nombre}, presione Enter para seleccionar e inspeccionar`}
                onClick={() => handleProvinceClick(item.provinciaId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleProvinceClick(item.provinciaId);
                  }
                }}
                onMouseEnter={(e) => handleMouseEnter(e, item.provinciaId)}
                onMouseLeave={handleMouseLeave}
                style={{ outline: 'none', cursor: 'pointer' }}
              >
                <path
                  d={item.path}
                  fill={fillColor}
                  fillOpacity={fillOpacity}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className={`svg-provincia-path ${isSelected ? 'active' : ''}`}
                  style={{
                    '--hover-glow': provInfo ? provInfo.color : '#002B7F'
                  }}
                />

                {/* Marcador de Cabecera y Nombre */}
                <circle
                  cx={item.centro.x}
                  cy={item.centro.y}
                  r={isSelected ? 6 : 4.5}
                  fill={isSelected ? '#FFFFFF' : '#F8FAFC'}
                  stroke="#00040D"
                  strokeWidth="1.5"
                />

                <text
                  x={item.labelPos.x}
                  y={item.labelPos.y - 10}
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  fontFamily="var(--font-main)"
                  style={{
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
                    letterSpacing: '0.02em'
                  }}
                >
                  {item.nombre}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <section
      id="seccion-mapa-svg"
      aria-label="Mapa Territorial Soberano de Costa Rica"
      className="civic-glass-card provincial-glow-card"
      style={{
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        marginBottom: '3rem',
        borderTop: '3px solid var(--color-provincial-primary)',
        position: 'relative'
      }}
    >
      {/* Cabecera del Mapa con Controles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🗺️</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC' }}>
              Mapa Cartográfico SVG Interactivo
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
            Exploración territorial vectorial: seleccione una provincia para sincronizar el Theming Engine y abrir el Drawer cívico.
          </p>
        </div>

        {/* Acciones del Mapa: Fullscreen y Drawer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onOpenDrawer && onOpenDrawer(selectedProvinciaId || 1)}
            className="btn-glass-secondary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
            aria-label="Abrir panel drawer lateral"
          >
            📑 Ficha Territorial (Drawer)
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFullscreen(true);
              setZoomLevel(1);
            }}
            className="btn-sovereign-blue"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
            aria-label="Expandir mapa a pantalla completa"
          >
            ⛶ Pantalla Completa
          </button>
        </div>
      </div>

      {/* Renderizado del Mapa Incrustado */}
      {renderSvgContent(false)}

      {/* Barra de Leyenda de las 7 Provincias */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {PROVINCIAS_DATA.map((prov) => {
          const isSelected = selectedProvinciaId === prov.id;
          return (
            <button
              key={prov.id}
              type="button"
              onClick={() => handleProvinceClick(prov.id)}
              className="provincial-chip"
              style={{
                backgroundColor: isSelected ? `${prov.color}55` : 'rgba(255, 255, 255, 0.04)',
                borderColor: isSelected ? prov.color : 'rgba(255, 255, 255, 0.12)',
                boxShadow: isSelected ? `0 0 12px ${prov.color}` : 'none'
              }}
            >
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: prov.color,
                display: 'inline-block'
              }} />
              <span>{prov.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Modal de Pantalla Completa Accesible */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor Cartográfico de Costa Rica en Pantalla Completa"
          className="civic-modal-fullscreen"
        >
          {/* Barra superior de herramientas en Pantalla Completa */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.6)' }}>
                MODO CARTOGRÁFICO DE ALTA PRECISIÓN &bull; PANTALLA COMPLETA
              </span>
              <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>
                Presione <kbd style={{ padding: '0.15rem 0.4rem', background: '#334155', borderRadius: '4px' }}>ESC</kbd> para salir
              </span>
            </div>

            {/* Controles de Zoom y Cerrar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.0))}
                className="btn-glass-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '1rem' }}
                aria-label="Acercar zoom"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                className="btn-glass-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '1rem' }}
                aria-label="Alejar zoom"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="btn-glass-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                aria-label="Restablecer escala original"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="btn-sovereign"
                style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}
                aria-label="Cerrar pantalla completa"
              >
                ✕ Salir
              </button>
            </div>
          </div>

          {/* Área de Visualización */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {renderSvgContent(true)}
          </div>
        </div>
      )}
    </section>
  );
}
