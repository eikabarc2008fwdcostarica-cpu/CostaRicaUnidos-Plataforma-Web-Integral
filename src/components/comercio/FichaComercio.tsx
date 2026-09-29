import React, { FC } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  CreditCard,
  Building
} from 'lucide-react';
import { ComercioPymePOI } from '../../data/comercioData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';
import { CivicButton } from '../common/CivicButton';

export interface FichaComercioProps {
  comercio: ComercioPymePOI;
}

export const FichaComercio: FC<FichaComercioProps> = ({ comercio }) => {
  const wazeUrl = `https://waze.com/ul?ll=${comercio.lat},${comercio.lng}&navigate=yes`;
  const whatsappUrl = `https://wa.me/${comercio.whatsappNumero}?text=${encodeURIComponent(comercio.whatsappMensajePrellenado)}`;

  return (
    <CivicCard level={1} interactive>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Imagen del Comercio / Local */}
        <div
          style={{
            position: 'relative',
            height: '160px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <img
            src={comercio.imagenUrl}
            alt={comercio.nombreComercial}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <CivicBadge variant="default" size="sm">
              {comercio.categoria}
            </CivicBadge>
          </div>

          {comercio.esVerificadoHacienda && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(5, 12, 28, 0.88)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                color: '#A7F3D0'
              }}
            >
              <ShieldCheck size={16} color="#10B981" />
              <span>
                <strong>Sello Hacienda: </strong> {comercio.regimenTributarioHacienda}
              </span>
            </div>
          )}
        </div>

        {/* Nombre y Razón Social */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            {comercio.nombreComercial}
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            {comercio.razonSocial} &bull; Cédula: <strong style={{ color: '#E2E8F0', fontFamily: "var(--font-telemetry, monospace)" }}>{comercio.cedulaJuridicaOFisica}</strong>
          </span>
        </div>

        {/* Descripción */}
        <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
          {comercio.descripcion}
        </p>

        {/* Dirección y Horario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem', color: '#CBD5E1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="#94A3B8" />
            <span>{comercio.direccionExacta}, <strong>{comercio.distrito}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={15} color="#94A3B8" />
            <span>{comercio.horario}</span>
          </div>
        </div>

        {/* Badges de Pago */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {comercio.aceptaSinpeMovil && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#34D399',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <CreditCard size={12} /> Acepta SINPE Móvil
            </span>
          )}
        </div>

        {/* CTAs Directos Obligatorios a WhatsApp y Waze */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.85rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem'
          }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <CivicButton
              variant="secondary"
              size="sm"
              fullWidth
              style={{
                background: 'rgba(37, 211, 102, 0.18)',
                borderColor: 'rgba(37, 211, 102, 0.4)',
                color: '#A7F3D0'
              }}
              leftIcon={<MessageCircle size={16} color="#25D366" />}
            >
              WhatsApp
            </CivicButton>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <CivicButton
              variant="secondary"
              size="sm"
              fullWidth
              style={{
                background: 'rgba(51, 204, 255, 0.18)',
                borderColor: 'rgba(51, 204, 255, 0.4)',
                color: '#BAE6FD'
              }}
              leftIcon={<Navigation size={16} color="#33CCFF" />}
            >
              Ruta Waze
            </CivicButton>
          </a>
        </div>
      </div>
    </CivicCard>
  );
};

export default FichaComercio;
