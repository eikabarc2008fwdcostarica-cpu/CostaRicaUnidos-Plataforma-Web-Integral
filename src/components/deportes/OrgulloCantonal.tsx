import React, { FC } from 'react';
import { Award, Trophy, Medal } from 'lucide-react';
import { AtletaOrgulloCantonal } from '../../data/deportesData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';

export interface OrgulloCantonalProps {
  atletas: AtletaOrgulloCantonal[];
}

export const OrgulloCantonal: FC<OrgulloCantonalProps> = ({ atletas }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <Trophy size={22} color="#D97706" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#062A77', margin: 0 }}>
          Orgullo Cantonal • Atletas Destacados del CCDR
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {atletas.map((atleta) => (
          <div
            key={atleta.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderTop: '4px solid #D97706',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-card, 0 4px 20px -2px rgba(6, 42, 119, 0.06))'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img
                src={atleta.fotoUrl}
                alt={atleta.nombre}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #D97706',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
                  flexShrink: 0
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                <CivicBadge variant="warning" size="sm">
                  {atleta.disciplina}
                </CivicBadge>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#062A77', margin: 0 }}>
                  {atleta.nombre}
                </h4>

                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
                  {atleta.edad} años &bull; Distrito {atleta.distritoOrigen}
                </span>

                {/* Medallero */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.75rem', fontFamily: "monospace", fontWeight: 700 }}>
                  <span style={{ color: '#B45309', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} color="#D97706" /> {atleta.juegosNacionalesMedallas.oro} Oro
                  </span>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} color="#64748B" /> {atleta.juegosNacionalesMedallas.plata} Plata
                  </span>
                  <span style={{ color: '#C2410C', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} color="#EA580C" /> {atleta.juegosNacionalesMedallas.bronce} Bronce
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '0.85rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid #E2E8F0',
                fontSize: '0.825rem',
                color: '#334155'
              }}
            >
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.5, fontWeight: 500 }}>
                {atleta.logros.map((logro, i) => (
                  <li key={i}>{logro}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgulloCantonal;
