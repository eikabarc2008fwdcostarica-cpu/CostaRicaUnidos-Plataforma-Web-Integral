import React from 'react';
import { generarEnlaceWaze, generarEnlaceGoogleMaps } from './gisLayersData';

export default function PointDetailCard({ point, onClose }) {
  if (!point) return null;

  const wazeUrl = generarEnlaceWaze(point.lat, point.lng);
  const gmapsUrl = generarEnlaceGoogleMaps(point.lat, point.lng);

  return (
    <div
      role="dialog"
      aria-label={`Detalle de ${point.nombre}`}
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        zIndex: 40,
        backgroundColor: 'rgba(0, 8, 25, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0, 4, 13, 0.8), 0 0 25px rgba(0, 43, 127, 0.35)',
        overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Imagen representativa */}
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
        <img
          src={point.foto}
          alt={point.nombre}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,4,13,0.2) 0%, rgba(0,8,25,0.95) 100%)'
        }} />

        {/* Badge de Categoría */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 20, 80, 0.8)' }}>
            {point.categoria}
          </span>
        </div>

        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle de punto"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            transition: 'background 0.2s ease'
          }}
        >
          ✕
        </button>
      </div>

      {/* Cuerpo de Información */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <h4 style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.25,
            marginBottom: '0.25rem'
          }}>
            {point.nombre}
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#79a6ff', fontWeight: 600 }}>
            📍 {point.provincia} › {point.canton} › {point.distrito}
          </p>
        </div>

        <p style={{
          fontSize: '0.85rem',
          color: '#CBD5E1',
          lineHeight: 1.5,
          marginBottom: '1rem'
        }}>
          {point.descripcion}
        </p>

        {/* Datos técnicos */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          fontSize: '0.8rem',
          color: '#94A3B8',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          padding: '0.75rem',
          borderRadius: '10px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🕒</span>
            <span style={{ color: '#E2E8F0' }}>{point.horario}</span>
          </div>

          {point.telefono && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📞</span>
              <a href={`tel:${point.telefono}`} style={{ color: '#79a6ff', textDecoration: 'none' }}>
                {point.telefono}
              </a>
            </div>
          )}

          {point.capacidad && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🛡️</span>
              <span style={{ color: '#EF4444', fontWeight: 600 }}>Capacidad: {point.capacidad}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-telemetry)', fontSize: '0.74rem' }}>
            <span>🌐</span>
            <span>COORDS: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}</span>
          </div>
        </div>

        {/* Botones de Navegación Deep-Linking: Waze y Google Maps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass-secondary"
            style={{
              padding: '0.65rem 0.5rem',
              fontSize: '0.82rem',
              backgroundColor: 'rgba(0, 160, 255, 0.2)',
              borderColor: 'rgba(0, 160, 255, 0.4)',
              textAlign: 'center'
            }}
          >
            🚗 Ir con Waze
          </a>

          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sovereign-blue"
            style={{
              padding: '0.65rem 0.5rem',
              fontSize: '0.82rem',
              textAlign: 'center'
            }}
          >
            🗺️ Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
