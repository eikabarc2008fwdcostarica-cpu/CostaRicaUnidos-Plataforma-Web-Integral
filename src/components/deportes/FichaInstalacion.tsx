import React, { FC } from 'react';
import { MapPin, Users, Clock, Phone, DollarSign, CheckCircle2 } from 'lucide-react';
import { InstalacionDeportiva } from '../../data/deportesData';
import { CivicCard } from '../common/CivicCard';
import { StatusPill } from '../common/StatusPill';
import { CivicButton } from '../common/CivicButton';
import { AccessibilityBadge } from '../common/AccessibilityBadge';

export interface FichaInstalacionProps {
  instalacion: InstalacionDeportiva;
  onReservar?: (instalacion: InstalacionDeportiva) => void;
}

export const FichaInstalacion: FC<FichaInstalacionProps> = ({ instalacion, onReservar }) => {
  const tieneLey7600 = instalacion.servicios.some((s) => s.toLowerCase().includes('7600') || s.toLowerCase().includes('accesible'));

  return (
    <CivicCard level={1} interactive>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Cabecera de la Instalación con StatusPill Dinámico */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#7DD3FC', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              {instalacion.disciplinaPrincipal}
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              {instalacion.nombre}
            </h3>
          </div>

          <StatusPill status={instalacion.estado} size="sm" showPulse />
        </div>

        {/* Ubicación y Capacidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="#94A3B8" />
            <span>{instalacion.direccion}, <strong>{instalacion.distrito}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Users size={15} color="#94A3B8" />
            <span>Aforo: <strong style={{ color: '#FFFFFF' }}>{instalacion.capacidad}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={15} color="#94A3B8" />
            <span>{instalacion.horario}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <DollarSign size={15} color="#FBBF24" />
            <span style={{ color: '#FEF3C7', fontWeight: 600 }}>{instalacion.tarifaAlquiler}</span>
          </div>
        </div>

        {/* Badges de Servicios y Accesibilidad */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
          {tieneLey7600 && <AccessibilityBadge type="ley-7600" size="sm" />}
          {instalacion.servicios.map((servicio, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#E2E8F0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <CheckCircle2 size={12} color="#34D399" />
              {servicio}
            </span>
          ))}
        </div>

        {/* Footer con Acciones */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#94A3B8' }}>
            <Phone size={14} color="#7DD3FC" />
            <span style={{ fontFamily: "var(--font-telemetry, monospace)" }}>{instalacion.telefonoContacto}</span>
          </div>

          <CivicButton
            variant={instalacion.estado === 'abierto' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onReservar && onReservar(instalacion)}
          >
            {instalacion.estado === 'abierto' ? 'Reservar Espacio' : 'Consultar Disponibilidad'}
          </CivicButton>
        </div>
      </div>
    </CivicCard>
  );
};

export default FichaInstalacion;
