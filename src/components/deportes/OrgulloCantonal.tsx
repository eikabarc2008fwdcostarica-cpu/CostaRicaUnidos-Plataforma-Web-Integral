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
        <Trophy size={22} color="#FBBF24" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
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
          <CivicCard key={atleta.id} level={1} interactive>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img
                src={atleta.fotoUrl}
                alt={atleta.nombre}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #FBBF24',
                  boxShadow: '0 0 12px rgba(251, 191, 36, 0.35)',
                  flexShrink: 0
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                <CivicBadge variant="warning" size="sm">
                  {atleta.disciplina}
                </CivicBadge>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {atleta.nombre}
                </h4>

                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  {atleta.edad} años &bull; Distrito {atleta.distritoOrigen}
                </span>

                {/* Medallero */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.75rem', fontFamily: "var(--font-telemetry, monospace)" }}>
                  <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} /> {atleta.juegosNacionalesMedallas.oro} Oro
                  </span>
                  <span style={{ color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} /> {atleta.juegosNacionalesMedallas.plata} Plata
                  </span>
                  <span style={{ color: '#F97316', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Medal size={13} /> {atleta.juegosNacionalesMedallas.bronce} Bronce
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '0.85rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.825rem',
                color: '#CBD5E1'
              }}
            >
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.5 }}>
                {atleta.logros.map((logro, i) => (
                  <li key={i}>{logro}</li>
                ))}
              </ul>
            </div>
          </CivicCard>
        ))}
      </div>
    </div>
  );
};

export default OrgulloCantonal;
