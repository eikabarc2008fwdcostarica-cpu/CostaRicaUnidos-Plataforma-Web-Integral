import React, { FC, useState } from 'react';
import { Shield, Flag, Calendar, Info, Layers } from 'lucide-react';
import { SimboloHistorico } from '../../data/culturaData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';

export interface GaleriaSimbolosProps {
  simbolos: SimboloHistorico[];
}

export const GaleriaSimbolos: FC<GaleriaSimbolosProps> = ({ simbolos }) => {
  const [simboloSeleccionado, setSimboloSeleccionado] = useState<SimboloHistorico>(simbolos[0] || {} as SimboloHistorico);

  if (!simbolos || simbolos.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Selector de Símbolos en Vista Comparativa */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}
        role="tablist"
        aria-label="Selector de Símbolos Cantonales"
      >
        {simbolos.map((simbolo) => {
          const isSelected = simboloSeleccionado.id === simbolo.id;
          return (
            <button
              key={simbolo.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSimboloSeleccionado(simbolo)}
              style={{
                background: isSelected ? 'rgba(0, 43, 127, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? '2px solid #7DD3FC' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: isSelected ? '0 0 20px rgba(125, 211, 252, 0.3)' : 'none',
                outline: 'none'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: isSelected ? 'var(--color-provincial-primary, #002B7F)' : 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {simbolo.tipo === 'escudo' ? (
                  <Shield size={24} color={isSelected ? '#FFFFFF' : '#94A3B8'} />
                ) : (
                  <Flag size={24} color={isSelected ? '#FFFFFF' : '#94A3B8'} />
                )}
              </div>

              <div>
                <CivicBadge variant={isSelected ? 'provincial' : 'default'} size="sm">
                  {simbolo.epoca}
                </CivicBadge>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: '0.35rem 0 0 0' }}>
                  {simbolo.nombre}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalle Comparativo y Heráldica Expandida */}
      <CivicCard level={2} provincialGlow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {/* Visualizador Central del Símbolo Vectorial */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              background: 'radial-gradient(circle at center, rgba(0, 43, 127, 0.35) 0%, rgba(0, 4, 13, 0.9) 75%)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            {/* Gráficos vectoriales representativos */}
            {simboloSeleccionado.tipo === 'escudo' ? (
              <svg width="180" height="200" viewBox="0 0 100 110" aria-label={simboloSeleccionado.nombre}>
                <defs>
                  <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#002B7F" />
                    <stop offset="100%" stopColor="#001489" />
                  </linearGradient>
                </defs>
                {/* Contorno del Escudo Tradicional Suizo-Español */}
                <path
                  d="M10 10 H90 V65 C90 85 50 105 50 105 C50 105 10 85 10 65 Z"
                  fill="url(#shieldGrad)"
                  stroke="#FFC700"
                  strokeWidth="3"
                />
                <circle cx="50" cy="45" r="16" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Cinco Estrellas */}
                <polygon points="50,33 53,40 60,40 54,44 57,51 50,47 43,51 46,44 40,40 47,40" fill="#FFFFFF" />
                <rect x="25" y="68" width="50" height="6" rx="3" fill="#CE1126" />
                <text x="50" y="85" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  SAN JOSÉ
                </text>
              </svg>
            ) : (
              <svg width="220" height="150" viewBox="0 0 100 65" aria-label={simboloSeleccionado.nombre}>
                {/* Bandera Bicolor */}
                <rect x="5" y="5" width="90" height="27.5" fill="#002B7F" stroke="rgba(255,255,255,0.2)" />
                <rect x="5" y="32.5" width="90" height="27.5" fill="#FFFFFF" stroke="rgba(255,255,255,0.2)" />
                <circle cx="50" cy="32.5" r="9" fill="#FFC700" opacity="0.9" />
              </svg>
            )}

            <span
              style={{
                fontFamily: "var(--font-telemetry, monospace)",
                fontSize: '0.8rem',
                color: '#7DD3FC',
                marginTop: '1.25rem',
                fontWeight: 600
              }}
            >
              {simboloSeleccionado.fechaAdopcion}
            </span>
          </div>

          {/* Ficha Explicativa y Heráldica */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CivicBadge variant="provincial" size="sm">
                {simboloSeleccionado.epoca}
              </CivicBadge>
              <span style={{ fontSize: '0.8rem', color: 'var(--cru-text-muted)' }}>Análisis Heráldico e Histórico</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.65rem 0' }}>
              {simboloSeleccionado.nombre}
            </h3>

            <p style={{ fontSize: '0.95rem', color: 'var(--cru-border-strong)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {simboloSeleccionado.descripcion}
            </p>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="#7DD3FC" />
              Significado de los Esmaltes y Elementos
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {simboloSeleccionado.significadoColores.map((elem, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      background: elem.color,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      flexShrink: 0
                    }}
                    aria-hidden="true"
                  />
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: '#FFFFFF' }}>{elem.elemento}: </strong>
                    <span style={{ color: 'var(--cru-border-strong)' }}>{elem.significado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CivicCard>
    </div>
  );
};

export default GaleriaSimbolos;
