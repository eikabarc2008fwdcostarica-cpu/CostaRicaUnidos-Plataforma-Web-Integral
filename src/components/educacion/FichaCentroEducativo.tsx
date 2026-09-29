import React, { FC } from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Utensils,
  Laptop,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { CentroEducativoPOI } from '../../data/educacionData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';
import { AccessibilityBadge } from '../common/AccessibilityBadge';

export interface FichaCentroEducativoProps {
  centro: CentroEducativoPOI;
  onVerEnMapa?: (centro: CentroEducativoPOI) => void;
}

export const FichaCentroEducativo: FC<FichaCentroEducativoProps> = ({ centro, onVerEnMapa }) => {
  const getNivelBadgeVariant = () => {
    switch (centro.nivel) {
      case 'CTP':
        return 'ctp';
      case 'Universidad':
        return 'provincial';
      case 'Secundaria':
        return 'info';
      case 'Primaria':
        return 'success';
      case 'Preescolar':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <CivicCard level={1} interactive>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Cabecera del Centro Educativo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <CivicBadge variant={getNivelBadgeVariant()} size="sm">
                {centro.nivel}
              </CivicBadge>
              <span style={{ fontFamily: "var(--font-telemetry, monospace)", fontSize: '0.75rem', color: '#94A3B8' }}>
                {centro.codigoMep}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              {centro.nombre}
            </h3>
          </div>

          {centro.esAccesibleLey7600 && <AccessibilityBadge type="ley-7600" size="sm" />}
        </div>

        {/* Información y Ubicación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="#94A3B8" />
            <span>{centro.direccion}, <strong>{centro.distrito}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <UserCheck size={15} color="#94A3B8" />
            <span>Dirección: <strong style={{ color: '#FFFFFF' }}>{centro.director}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <GraduationCap size={15} color="#7DD3FC" />
            <span>{centro.circuito} &bull; Matrícula: <strong style={{ color: '#FFFFFF' }}>~{centro.matriculaAproximada.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Badges Temáticos Obligatorios para Especialidades CTP */}
        {centro.nivel === 'CTP' && centro.especialidadesCTP && centro.especialidadesCTP.length > 0 && (
          <div
            style={{
              background: 'rgba(79, 70, 229, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C7D2FE', letterSpacing: '0.03em' }}>
              ESPECIALIDADES TÉCNICAS PROFESIONALES OFICIALES (CTP):
            </span>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {centro.especialidadesCTP.map((esp) => (
                <span
                  key={esp.id}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    background: `${esp.colorTema}22`,
                    border: `1px solid ${esp.colorTema}66`,
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: `0 0 8px ${esp.colorTema}33`
                  }}
                  title={esp.descripcion}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: esp.colorTema }} />
                  {esp.nombre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Servicios del Centro */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem', color: '#94A3B8' }}>
          {centro.comedorEstudiantil && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#6EE7B7' }}>
              <Utensils size={13} /> Comedor Estudiantil Activo
            </span>
          )}
          {centro.laboratorioInformatica && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#7DD3FC' }}>
              <Laptop size={13} /> Laboratorio de Cómputo
            </span>
          )}
        </div>

        {/* Footer y Enlace para Eiker GIS */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem' }}>
            <a href={`tel:${centro.telefono}`} style={{ color: '#7DD3FC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Phone size={13} /> {centro.telefono}
            </a>
            <a href={`mailto:${centro.correo}`} style={{ color: '#CBD5E1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Mail size={13} /> Correo MEP
            </a>
          </div>

          <button
            type="button"
            onClick={() => onVerEnMapa && onVerEnMapa(centro)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38BDF8',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Navigation size={13} />
            POI GIS: {centro.lat.toFixed(4)}, {centro.lng.toFixed(4)}
          </button>
        </div>
      </div>
    </CivicCard>
  );
};

export default FichaCentroEducativo;
