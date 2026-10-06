import React from 'react';
import { X, ShieldCheck, User, Calendar, MapPin, Lock, Award, HeartHandshake } from 'lucide-react';
import { obtenerNombrePublico } from '../../utils/privacyUtils';

export interface PerfilPublicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  autorNombre?: string;
  fechaRegistro?: string;
  canton?: string;
  provincia?: string;
  esVerificado?: boolean;
}

export default function PerfilPublicoModal({
  isOpen,
  onClose,
  autorNombre = 'Ciudadano Activo',
  fechaRegistro = '2026-05-10T14:20:00Z',
  canton = 'San José',
  provincia = 'San José',
  esVerificado = true
}: PerfilPublicoModalProps) {
  if (!isOpen) return null;

  const nombrePublico = obtenerNombrePublico(autorNombre);

  const formatearFecha = (fechaStr: string) => {
    try {
      const d = new Date(fechaStr);
      if (isNaN(d.getTime())) return 'Ciudadano Registrado';
      return d.toLocaleDateString('es-CR', {
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Miembro Comunitario';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 4, 13, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '24px',
          backgroundColor: 'var(--cru-surface, #FFFFFF)',
          border: '1px solid var(--cru-border, #E2E8F0)',
          boxShadow: 'var(--cru-card-shadow-hover, 0 25px 50px rgba(6, 42, 119, 0.12))',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Encabezado Tricolor y Botón Cerrar */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, #001489 0%, #FFFFFF 33.3%, #DA291C 66.6%, #001489 100%)'
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.2rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.02em' }}>
                Perfil Cívico Comunitario
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Perfil Público */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Avatar e Identidad Pública */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '2px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                fontSize: '1.6rem',
                fontWeight: 800,
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)'
              }}
            >
              {nombrePublico.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {nombrePublico}
                </h3>
                {esVerificado && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.35)',
                      color: '#6EE7B7',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Verificado
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                Rol Cívico: <strong style={{ color: '#E2E8F0' }}>Ciudadano / Vecino</strong>
              </div>
            </div>
          </div>

          {/* Datos Cívicos Permitidos */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Fecha de Registro</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>
                {formatearFecha(fechaRegistro)}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ubicación Cantonal</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>
                {canton}, {provincia}
              </div>
            </div>
          </div>

          {/* Insignia de Protección de Datos (Ley N° 8968) */}
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 43, 127, 0.25)',
              border: '1px solid rgba(121, 166, 255, 0.35)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div style={{ fontSize: '0.76rem', color: '#CBD5E1', lineHeight: 1.45 }}>
              <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '0.2rem' }}>
                Privacidad Blindada · Ley N° 8968
              </strong>
              El número de cédula de identidad, correo electrónico y datos fiscales sensibles del ciudadano se encuentran encriptados y ocultos para terceros conforme al principio de autodeterminación informativa.
            </div>
          </div>
        </div>

        {/* Pie de modal */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 4, 13, 0.5)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
