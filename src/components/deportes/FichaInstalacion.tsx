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
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderTop: '4px solid #0053AF',
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
        e.currentTarget.style.boxShadow = 'var(--shadow-card, 0 4px 20px -2px rgba(6, 42, 119, 0.06))';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Cabecera de la Instalación con StatusPill Dinámico */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#0053AF', fontWeight: 700, display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
              {instalacion.disciplinaPrincipal}
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#062A77', margin: 0 }}>
              {instalacion.nombre}
            </h3>
          </div>

          <StatusPill status={instalacion.estado} size="sm" showPulse />
        </div>

        {/* Ubicación y Capacidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="#0053AF" />
            <span>{instalacion.direccion}, <strong style={{ color: '#0F172A' }}>{instalacion.distrito}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Users size={15} color="#64748B" />
            <span>Aforo: <strong style={{ color: '#0F172A' }}>{instalacion.capacidad}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={15} color="#64748B" />
            <span>{instalacion.horario}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <DollarSign size={15} color="#D97706" />
            <span style={{ color: '#92400E', fontWeight: 700 }}>{instalacion.tarifaAlquiler}</span>
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
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#1E293B',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 600
              }}
            >
              <CheckCircle2 size={12} color="#059669" />
              {servicio}
            </span>
          ))}
        </div>

        {/* Footer con Acciones */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
            <Phone size={14} color="#0053AF" />
            <span style={{ fontFamily: "monospace" }}>{instalacion.telefonoContacto}</span>
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
    </div>
  );
};

export default FichaInstalacion;
