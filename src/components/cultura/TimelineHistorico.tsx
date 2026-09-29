import React, { FC, useState } from 'react';
import { Calendar, Compass, Milestone, Flag, Sparkles } from 'lucide-react';
import { HitoHistorico } from '../../data/culturaData';
import { CivicBadge } from '../common/CivicBadge';
import { CivicCard } from '../common/CivicCard';

export interface TimelineHistoricoProps {
  hitos: HitoHistorico[];
}

export const TimelineHistorico: FC<TimelineHistoricoProps> = ({ hitos }) => {
  const [epocaSeleccionada, setEpocaSeleccionada] = useState<string>('todas');

  const epocas = ['todas', 'Precolombina', 'Colonial', 'Fundacional', 'Siglo XX', 'Contemporánea'];

  const hitosFiltrados = epocaSeleccionada === 'todas'
    ? hitos
    : hitos.filter((h) => h.epoca === epocaSeleccionada);

  const getEpocaBadgeVariant = (epoca: HitoHistorico['epoca']) => {
    switch (epoca) {
      case 'Precolombina':
        return 'success';
      case 'Colonial':
        return 'warning';
      case 'Fundacional':
        return 'provincial';
      case 'Siglo XX':
        return 'info';
      case 'Contemporánea':
        return 'ctp';
    }
  };

  return (
    <div>
      {/* Selector de Épocas */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          alignItems: 'center'
        }}
        role="group"
        aria-label="Filtrar por época histórica"
      >
        <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginRight: '0.25rem' }}>
          Filtrar época:
        </span>
        {epocas.map((ep) => (
          <button
            key={ep}
            type="button"
            onClick={() => setEpocaSeleccionada(ep)}
            style={{
              background: epocaSeleccionada === ep ? 'var(--color-provincial-primary, #002B7F)' : 'rgba(255, 255, 255, 0.05)',
              color: epocaSeleccionada === ep ? '#FFFFFF' : '#CBD5E1',
              border: epocaSeleccionada === ep ? '1px solid var(--color-provincial-border, rgba(255, 255, 255, 0.3))' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.4rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {ep === 'todas' ? 'Toda la Historia' : ep}
          </button>
        ))}
      </div>

      {/* Contenedor de la Línea de Tiempo */}
      <div
        style={{
          position: 'relative',
          paddingLeft: '2.5rem'
        }}
      >
        {/* Eje Vertical de la Línea de Tiempo */}
        <div
          style={{
            position: 'absolute',
            left: '15px',
            top: '10px',
            bottom: '20px',
            width: '3px',
            background: 'linear-gradient(to bottom, var(--color-provincial-primary, #002B7F), #CE1126, #FFFFFF)',
            borderRadius: '9999px',
            opacity: 0.65
          }}
          aria-hidden="true"
        />

        {/* Hitos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {hitosFiltrados.map((hito, idx) => (
            <div key={hito.id} style={{ position: 'relative' }}>
              {/* Nodo Circular en el Eje */}
              <div
                style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  top: '1.25rem',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--color-obsidian-sovereign, #00040D)',
                  border: '3px solid var(--color-provincial-primary, #7DD3FC)',
                  boxShadow: '0 0 12px rgba(125, 211, 252, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateX(3px)'
                }}
                aria-hidden="true"
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>

              {/* Tarjeta del Hito */}
              <CivicCard level={1} interactive>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontFamily: "var(--font-telemetry, monospace)",
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: 'rgba(255, 255, 255, 0.08)',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        {hito.anno}
                      </span>
                      <CivicBadge variant={getEpocaBadgeVariant(hito.epoca)} size="sm">
                        {hito.epoca}
                      </CivicBadge>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      Hito N° {idx + 1}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {hito.titulo}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
                    {hito.descripcion}
                  </p>

                  <div
                    style={{
                      marginTop: '0.4rem',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(0, 43, 127, 0.14)',
                      borderLeft: '3px solid var(--color-provincial-primary, #002B7F)',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '0.825rem',
                      color: '#E0F2FE'
                    }}
                  >
                    <strong>Legado Institucional: </strong> {hito.impacto}
                  </div>
                </div>
              </CivicCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineHistorico;
