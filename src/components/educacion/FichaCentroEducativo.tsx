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
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderTop: centro.nivel === 'CTP' ? '4px solid #C22727' : '4px solid #0053AF',
        borderRadius: '16px',
        padding: '1.35rem',
        boxShadow: 'var(--shadow-card, 0 4px 20px -2px rgba(6, 42, 119, 0.06))',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(6, 42, 119, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(6, 42, 119, 0.06)';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Cabecera del Centro Educativo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <CivicBadge variant={getNivelBadgeVariant()} size="sm">
                {centro.nivel}
              </CivicBadge>
              <span style={{ fontFamily: "monospace", fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                {centro.codigoMep}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#062A77', margin: 0 }}>
              {centro.nombre}
            </h3>
          </div>

          {centro.esAccesibleLey7600 && <AccessibilityBadge type="ley-7600" size="sm" />}
        </div>

        {/* Información y Ubicación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="#0053AF" />
            <span>{centro.direccion}, <strong style={{ color: '#0F172A' }}>{centro.distrito}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <UserCheck size={15} color="#64748B" />
            <span>Dirección: <strong style={{ color: '#0F172A' }}>{centro.director}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <GraduationCap size={15} color="#0053AF" />
            <span>{centro.circuito} &bull; Matrícula: <strong style={{ color: '#062A77' }}>~{centro.matriculaAproximada.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Badges Temáticos Obligatorios para Especialidades CTP */}
        {centro.nivel === 'CTP' && centro.especialidadesCTP && centro.especialidadesCTP.length > 0 && (
          <div
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF', letterSpacing: '0.03em' }}>
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
                    background: '#FFFFFF',
                    border: '1px solid #93C5FD',
                    color: '#1E3A8A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  title={esp.descripcion}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0053AF' }} />
                  {esp.nombre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Servicios del Centro */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem' }}>
          {centro.comedorEstudiantil && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#047857', fontWeight: 600 }}>
              <Utensils size={13} /> Comedor Estudiantil Activo
            </span>
          )}
          {centro.laboratorioInformatica && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0284C7', fontWeight: 600 }}>
              <Laptop size={13} /> Laboratorio de Cómputo
            </span>
          )}
        </div>

        {/* Footer y Enlace para Eiker GIS */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem' }}>
            <a href={`tel:${centro.telefono}`} style={{ color: '#0053AF', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Phone size={13} /> {centro.telefono}
            </a>
            <a href={`mailto:${centro.correo}`} style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Mail size={13} /> Correo MEP
            </a>
          </div>

          <button
            type="button"
            onClick={() => onVerEnMapa && onVerEnMapa(centro)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#C22727',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Navigation size={13} color="#C22727" />
            POI GIS: {centro.lat.toFixed(4)}, {centro.lng.toFixed(4)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FichaCentroEducativo;
