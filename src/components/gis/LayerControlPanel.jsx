import React, { useState } from 'react';
import { Layers, ChevronUp, ChevronDown, HeartPulse, GraduationCap, Bus, Trophy, Siren, MapPin, Check, X } from 'lucide-react';
import { GIS_LAYERS_CONFIG } from './gisLayersData';

function renderLayerIcon(layerId, color) {
  switch (layerId) {
    case 'salud':
      return <HeartPulse size={15} color={color} />;
    case 'educacion':
      return <GraduationCap size={15} color={color} />;
    case 'transporte':
      return <Bus size={15} color={color} />;
    case 'recreativa':
      return <Trophy size={15} color={color} />;
    case 'albergues':
      return <Siren size={15} color={color} />;
    default:
      return <MapPin size={15} color={color} />;
  }
}

export default function LayerControlPanel({
  activeLayers = {},
  onToggleLayer,
  onToggleAll,
  countsByLayer = {}
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 30,
        maxWidth: '320px',
        width: isExpanded ? '300px' : 'auto',
        backgroundColor: 'rgba(0, 8, 25, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '16px',
        boxShadow: '0 12px 35px rgba(0, 4, 13, 0.65)',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Barra de Título del Panel Multicapa */}
      <div
        style={{
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          backgroundColor: 'rgba(0, 15, 45, 0.5)',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Layers size={17} color="#79a6ff" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>
            Capas Cívicas ({activeCount}/5)
          </span>
        </div>

        <button
          type="button"
          aria-label={isExpanded ? 'Minimizar selector multicapa' : 'Expandir selector multicapa'}
          style={{
            background: 'none',
            border: 'none',
            color: '#79a6ff',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Lista de Capas */}
      {isExpanded && (
        <div style={{ padding: '0.85rem 1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {GIS_LAYERS_CONFIG.map((layer) => {
              const isActive = !!activeLayers[layer.id];
              const count = countsByLayer[layer.id] || 0;

              return (
                <label
                  key={layer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isActive ? layer.color + '55' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => onToggleLayer(layer.id)}
                      style={{
                        accentColor: layer.color,
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {renderLayerIcon(layer.id, layer.color)}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0' }}>
                      {layer.nombre.split(' (')[0]}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-telemetry)',
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                      backgroundColor: isActive ? layer.color : 'rgba(255, 255, 255, 0.1)',
                      color: isActive ? '#00040D' : '#94A3B8',
                      fontWeight: 700
                    }}
                  >
                    {count}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Botones de acción rápida */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              type="button"
              onClick={() => onToggleAll && onToggleAll(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#79a6ff',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-telemetry)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Check size={12} /> Todas
            </button>
            <button
              type="button"
              onClick={() => onToggleAll && onToggleAll(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-telemetry)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <X size={12} /> Ninguna
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
