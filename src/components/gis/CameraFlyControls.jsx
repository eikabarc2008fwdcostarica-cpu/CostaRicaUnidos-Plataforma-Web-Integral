import React, { useState } from 'react';
import { VUELOS_3D_DESTINOS } from './gisLayersData';

export default function CameraFlyControls({
  currentTilt = 0,
  currentHeading = 0,
  onSetTilt,
  onRotateHeading,
  onResetOrientation,
  onFlyTo,
  onGetLocation,
  isLocating = false
}) {
  const [flyMenuOpen, setFlyMenuOpen] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}
    >
      {/* Botones de Control de Cámara 3D */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(0, 8, 25, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '14px',
          padding: '0.4rem',
          boxShadow: '0 8px 30px rgba(0, 4, 13, 0.65)'
        }}
      >
        {/* Reset Norte / Brújula */}
        <button
          type="button"
          onClick={onResetOrientation}
          title="Restablecer vista cenital 2D y Norte"
          aria-label="Restablecer orientación al Norte"
          className="btn-glass-secondary"
          style={{
            padding: '0.45rem 0.65rem',
            fontSize: '0.85rem',
            minWidth: '38px',
            borderRadius: '8px'
          }}
        >
          <span style={{ transform: `rotate(${-currentHeading}deg)`, display: 'inline-block', transition: 'transform 0.3s' }}>
            🧭
          </span>
        </button>

        {/* Toggle Inclinación 3D (0° vs 45° vs 60°) */}
        <button
          type="button"
          onClick={() => {
            const nextTilt = currentTilt >= 45 ? 0 : 55;
            onSetTilt(nextTilt);
          }}
          title="Alternar perspectiva tridimensional (Tilt 45°-60°)"
          aria-label="Alternar relieve en 3D"
          className={currentTilt > 0 ? 'btn-sovereign' : 'btn-glass-secondary'}
          style={{
            padding: '0.45rem 0.85rem',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-telemetry)',
            fontWeight: 700,
            borderRadius: '8px',
            gap: '0.4rem'
          }}
        >
          <span>🏔️</span>
          <span>{currentTilt > 0 ? `3D (${currentTilt}°)` : '2D PLANO'}</span>
        </button>

        {/* Rotar +45° */}
        <button
          type="button"
          onClick={() => onRotateHeading(45)}
          title="Girar vista 45° en sentido horario"
          aria-label="Girar cámara 45 grados a la derecha"
          className="btn-glass-secondary"
          style={{
            padding: '0.45rem 0.65rem',
            fontSize: '0.85rem',
            borderRadius: '8px'
          }}
        >
          ↻ 45°
        </button>

        {/* Botón Mi Ubicación (navigator.geolocation) */}
        <button
          type="button"
          onClick={onGetLocation}
          disabled={isLocating}
          title="Centrar en mi ubicación actual"
          aria-label="Centrar en mi ubicación actual mediante GPS"
          className="btn-glass-secondary"
          style={{
            padding: '0.45rem 0.75rem',
            fontSize: '0.82rem',
            borderRadius: '8px',
            color: isLocating ? '#F59E0B' : '#00D166',
            borderColor: isLocating ? '#F59E0B' : 'rgba(0, 209, 102, 0.4)',
            backgroundColor: 'rgba(0, 209, 102, 0.12)'
          }}
        >
          <span>{isLocating ? '⏳' : '📍'}</span>
          <span>{isLocating ? 'LOCALIZANDO...' : 'MI UBICACIÓN'}</span>
        </button>
      </div>

      {/* Selector de Vuelos 3D Panorámicos (Fly-To) */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setFlyMenuOpen(!flyMenuOpen)}
          className="btn-sovereign-blue"
          style={{
            padding: '0.55rem 1rem',
            fontSize: '0.82rem',
            borderRadius: '12px',
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🛫</span>
            <span style={{ fontWeight: 700 }}>Vuelos 3D Fly-To</span>
          </span>
          <span style={{ fontSize: '0.75rem' }}>{flyMenuOpen ? '▲' : '▼'}</span>
        </button>

        {flyMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              width: '280px',
              backgroundColor: 'rgba(0, 8, 25, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              boxShadow: '0 15px 40px rgba(0, 4, 13, 0.8)',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              zIndex: 35
            }}
          >
            <div style={{
              fontSize: '0.72rem',
              color: '#94A3B8',
              padding: '0.25rem 0.5rem',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-telemetry)'
            }}>
              Relieve Topográfico y Valles
            </div>

            {VUELOS_3D_DESTINOS.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => {
                  onFlyTo(dest);
                  setFlyMenuOpen(false);
                }}
                className="btn-glass-secondary"
                style={{
                  justifyContent: 'flex-start',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.82rem',
                  textAlign: 'left',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{dest.nombre}</div>
                  <div style={{ fontSize: '0.72rem', color: '#79a6ff' }}>{dest.tipo} • Tilt {dest.tilt}°</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
