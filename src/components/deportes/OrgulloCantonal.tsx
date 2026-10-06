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
        <Trophy size={22} color="var(--cru-accent-amber)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cru-text)', margin: 0 }}>
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
              backgroundColor: 'var(--cru-surface-card)',
              border: '1px solid var(--cru-border)',
              borderTop: '4px solid #D97706',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: 'var(--cru-card-shadow)'
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

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--cru-text)', margin: 0 }}>
                  {atleta.nombre}
                </h4>

                <span style={{ fontSize: '0.8rem', color: 'var(--cru-text-muted)', fontWeight: 500 }}>
                  {atleta.edad} años &bull; Distrito {atleta.distritoOrigen}
                </span>

                {/* Medallero */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.75rem', fontFamily: "monospace", fontWeight: 700 }}>
                  <span style={{ color: 'var(--cru-accent-amber)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} color="var(--cru-accent-amber)" /> {atleta.juegosNacionalesMedallas.oro} Oro
                  </span>
                  <span style={{ color: 'var(--cru-text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} color="var(--cru-text-muted)" /> {atleta.juegosNacionalesMedallas.plata} Plata
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
                borderTop: '1px solid var(--cru-border)',
                fontSize: '0.825rem',
                color: 'var(--cru-text-soft)'
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
