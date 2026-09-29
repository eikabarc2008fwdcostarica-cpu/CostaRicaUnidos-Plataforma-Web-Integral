import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronRight,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Crosshair,
  Phone,
  Navigation,
  Map,
  HeartPulse,
  GraduationCap,
  Bus,
  Trophy,
  Siren,
  MapPin
} from 'lucide-react';
import { GIS_LAYERS_CONFIG, generarEnlaceWaze, generarEnlaceGoogleMaps } from './gisLayersData';

function renderLayerIcon(layerId, color, size = 14) {
  switch (layerId) {
    case 'salud':
      return <HeartPulse size={size} color={color || '#00D166'} />;
    case 'educacion':
      return <GraduationCap size={size} color={color || '#3B82F6'} />;
    case 'transporte':
      return <Bus size={size} color={color || '#F59E0B'} />;
    case 'recreativa':
      return <Trophy size={size} color={color || '#EC4899'} />;
    case 'albergues':
      return <Siren size={size} color={color || '#EF4444'} />;
    default:
      return <MapPin size={size} color={color || '#79a6ff'} />;
  }
}

/**
 * Componente: Cajón Flotante de Resultados de IA y Feedback Semántico (RF-12.1)
 * Muestra el resumen de la interpretación NLP, capas activadas, telemetría y lista de POIs.
 */
export default function NlpResultsDrawer({
  nlpResult,
  onClose,
  onFocusPoi,
  onSelectSuggestion
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!nlpResult) return null;

  // Si la consulta falló o no hubo coincidencia
  if (!nlpResult.exito) {
    return (
      <aside
        aria-label="Panel de Ayuda y Sugerencias de Búsqueda Semántica"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          zIndex: 45,
          maxWidth: '480px',
          width: 'calc(100% - 48px)',
          backgroundColor: 'rgba(0, 8, 30, 0.92)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '20px',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 4, 13, 0.85), 0 0 25px rgba(220, 38, 38, 0.3)',
          padding: '1.25rem 1.5rem',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <HelpCircle size={20} color="#FCA5A5" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#FCA5A5' }}>
              No se reconoció la entidad o capa
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de sugerencias"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#CBD5E1', margin: '0 0 1rem', lineHeight: 1.5 }}>
          {nlpResult.mensaje}
        </p>

        {nlpResult.sugerencias && nlpResult.sugerencias.length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Pruebe alguna de estas consultas cívicas:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {nlpResult.sugerencias.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSuggestion && onSelectSuggestion(sug)}
                  style={{
                    textAlign: 'left',
                    padding: '0.55rem 0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#79a6ff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.4)';
                    e.currentTarget.style.borderColor = '#79a6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  }}
                >
                  <ChevronRight size={14} color="#79a6ff" />
                  <span>"{sug}"</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    );
  }

  // Si la consulta fue exitosa
  const { entidadGeografica, capasDetectadas, poisEncontrados, resumenAccion, telemetria } = nlpResult;

  return (
    <aside
      aria-label="Resultados de la Búsqueda Semántica con IA"
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 45,
        width: isMinimized ? 'auto' : 'clamp(320px, 40vw, 480px)',
        maxHeight: isMinimized ? 'auto' : 'calc(100% - 140px)',
        backgroundColor: 'rgba(0, 8, 30, 0.92)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderRadius: '20px',
        border: '1px solid rgba(121, 166, 255, 0.4)',
        boxShadow: '0 24px 60px rgba(0, 4, 13, 0.95), 0 0 30px rgba(0, 43, 127, 0.4)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Cabecera del Cajón */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(0, 20, 80, 0.4)',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#00D166',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0, 209, 102, 0.5)'
            }}
          >
            <Sparkles size={16} color="#00040D" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#79a6ff', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Motor Semántico NLP (RF-12.1)
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
              {entidadGeografica ? entidadGeografica.nombre : 'Costa Rica'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expandir panel de resultados' : 'Minimizar panel'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.25rem 0.55rem',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {isMinimized ? (
              <>
                <ChevronUp size={13} />
                <span>Expandir</span>
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                <span>Minimizar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de resultados"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem 0.4rem'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Resumen en Lenguaje Natural */}
          <div
            style={{
              backgroundColor: 'rgba(0, 20, 137, 0.3)',
              borderLeft: '4px solid #00D166',
              padding: '0.85rem 1rem',
              borderRadius: '0 12px 12px 0',
              fontSize: '0.88rem',
              color: '#E2E8F0',
              lineHeight: 1.5,
              fontWeight: 500
            }}
          >
            {resumenAccion}
          </div>

          {/* Telemetría Técnica Monoespaciada */}
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              fontFamily: 'var(--font-telemetry, monospace)',
              fontSize: '0.74rem',
              color: '#94A3B8',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <span>LAT: <strong style={{ color: '#FFFFFF' }}>{telemetria?.lat}° N</strong></span>
            <span>LNG: <strong style={{ color: '#FFFFFF' }}>{telemetria?.lng}° O</strong></span>
            <span>INCLINACIÓN: <strong style={{ color: '#79a6ff' }}>{telemetria?.tilt}</strong></span>
            <span>ZOOM: <strong style={{ color: '#00D166' }}>{telemetria?.zoom}x</strong></span>
          </div>

          {/* Pastillas de Capas Activadas */}
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Capas Conmutadas Automáticamente:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {capasDetectadas.map((layerId) => {
                const conf = GIS_LAYERS_CONFIG.find((l) => l.id === layerId);
                return (
                  <span
                    key={layerId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${conf?.color || '#79a6ff'}`,
                      borderRadius: '999px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: conf?.color || '#FFFFFF'
                    }}
                  >
                    <span>{renderLayerIcon(layerId, conf?.color, 13)}</span>
                    <span>{conf?.nombre.split(' (')[0] || layerId}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Lista de Puntos de Interés Encontrados */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                Puntos Identificados ({poisEncontrados.length}):
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {poisEncontrados.map((poi) => {
                const conf = GIS_LAYERS_CONFIG.find((l) => l.id === poi.layer);
                return (
                  <div
                    key={poi.id}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '0.75rem 0.9rem',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Borde indicador de capa */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: conf?.color || '#00D166'
                    }} />

                    <div style={{ marginLeft: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {renderLayerIcon(poi.layer, conf?.color, 14)}
                            <span>{poi.nombre}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {poi.categoria} &bull; {poi.canton}, {poi.provincia}
                          </div>
                        </div>

                        {/* Botón Enfocar */}
                        <button
                          type="button"
                          onClick={() => onFocusPoi && onFocusPoi(poi)}
                          title="Volar y centrar cámara en este punto"
                          style={{
                            backgroundColor: 'rgba(0, 20, 137, 0.5)',
                            border: '1px solid rgba(121, 166, 255, 0.4)',
                            borderRadius: '6px',
                            color: '#79a6ff',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.55rem',
                            cursor: 'pointer',
                            flexShrink: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Crosshair size={12} />
                          <span>Centrar</span>
                        </button>
                      </div>

                      {poi.telefono && (
                        <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={12} color="#94A3B8" />
                          <span>{poi.telefono}</span>
                        </div>
                      )}

                      {/* Enlaces Waze & Google Maps */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <a
                          href={generarEnlaceWaze(poi.lat, poi.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.72rem',
                            color: '#38BDF8',
                            textDecoration: 'none',
                            backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Navigation size={12} />
                          <span>Waze</span>
                        </a>

                        <a
                          href={generarEnlaceGoogleMaps(poi.lat, poi.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.72rem',
                            color: '#4ADE80',
                            textDecoration: 'none',
                            backgroundColor: 'rgba(74, 222, 128, 0.1)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Map size={12} />
                          <span>Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
