import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  X,
  HeartPulse,
  Flame,
  Shield,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Acceso Rápido de Emergencia SOS 911 para la Pantalla de Login
 * Permite solicitar auxilio de forma prioritaria sin necesidad de iniciar sesión.
 * Cumple con estándares de ciberseguridad, accesibilidad y diseño cívico.
 */
export default function EmergencyQuickAccess() {
  const [modalAbierto, setModalAbierto] = useState(false);

  const DIRECTORIO_EMERGENCIAS = [
    {
      servicio: 'Sistema Nacional de Emergencias 9-1-1',
      descripcion: 'Atención unificada inmediata: rescate, accidentes y situaciones de peligro.',
      telefono: '911',
      icono: ShieldAlert,
      color: '#EF4444',
      badge: 'Prioridad 1'
    },
    {
      servicio: 'Cruz Roja Costarricense',
      descripcion: 'Ambulancias, paramédicos y atención prehospitalaria cantonal.',
      telefono: '1128',
      icono: HeartPulse,
      color: '#F87171',
      badge: 'Salud / Rescate'
    },
    {
      servicio: 'Cuerpo de Bomberos de Costa Rica',
      descripcion: 'Incendios estructurales y forestales, rescate vehicular y fugas de gas.',
      telefono: '1118',
      icono: Flame,
      color: '#FB923C',
      badge: 'Incendios'
    },
    {
      servicio: 'Fuerza Pública (Policía Nacional)',
      descripcion: 'Auxilio policial, seguridad ciudadana y orden público en los 84 cantones.',
      telefono: '911',
      icono: Shield,
      color: '#38BDF8',
      badge: 'Seguridad'
    },
    {
      servicio: 'Comisión Nacional de Emergencias (CNE)',
      descripcion: 'Alertas tempranas, desastres naturales, sismos e inundaciones.',
      telefono: '2210-2828',
      icono: Radio,
      color: '#FBBF24',
      badge: 'Comité COE'
    }
  ];

  return (
    <>
      {/* =====================================================================
          1. BANNER / BOTÓN DE EMERGENCIA EN LA TARJETA DE LOGIN
          ===================================================================== */}
      <div
        role="region"
        aria-label="Acceso Directo a Línea de Emergencia 911"
        style={{
          width: '100%',
          marginBottom: '1.4rem',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          backgroundColor: 'var(--cru-accent-red-bg)',
          border: '1px solid var(--cru-accent-red-border)',
          boxShadow: 'var(--cru-card-shadow, 0 4px 20px rgba(220, 38, 38, 0.18))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Identidad SOS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--cru-accent-red-bg)',
              border: '1px solid var(--cru-accent-red-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cru-accent-red)',
              flexShrink: 0
            }}
          >
            <ShieldAlert size={20} strokeWidth={2} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--cru-text)', letterSpacing: '0.02em' }}>
                SOS 911
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--cru-accent-red-bg)',
                  color: 'var(--cru-accent-red)',
                  border: '1px solid var(--cru-accent-red-border)'
                }}
              >
                SIN AUTENTICACIÓN
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--cru-text-secondary)', lineHeight: 1.3 }}>
              ¿En una emergencia? Solicite auxilio antes de ingresar al sistema.
            </p>
          </div>
        </div>

        {/* Acciones de Llamada y Directorio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href="tel:911"
            title="Llamada telefónica inmediata al 911"
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              backgroundColor: 'var(--cru-accent-red)',
              border: '1px solid var(--cru-accent-red)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            <PhoneCall size={14} />
            <span>Llamar 911</span>
          </a>

          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            title="Abrir directorio rápido de cuerpos de rescate"
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'var(--cru-surface-muted)',
              border: '1px solid var(--cru-border)',
              color: 'var(--cru-text)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Directorio</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. MODAL RÁPIDO DE CUERPOS DE EMERGENCIA Y RESCATE
          ===================================================================== */}
      {modalAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-emergencia-titulo"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setModalAbierto(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--cru-surface-card)',
              border: '1px solid var(--cru-accent-red-border)',
              borderRadius: '20px',
              boxShadow: 'var(--cru-card-shadow, 0 25px 60px rgba(0, 0, 0, 0.7))',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Cabecera del Modal */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--cru-accent-red-bg)',
                borderBottom: '1px solid var(--cru-accent-red-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--cru-accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h2
                    id="modal-emergencia-titulo"
                    style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--cru-text)', margin: 0 }}
                  >
                    Directorio de Auxilio Inmediato
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--cru-text-secondary)' }}>
                    Disponible las 24 horas sin requerir inicio de sesión
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                aria-label="Cerrar ventana de auxilio"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--cru-surface-muted)',
                  border: '1px solid var(--cru-border)',
                  color: 'var(--cru-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Listado de Números de Emergencia */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '65vh',
                overflowY: 'auto'
              }}
            >
              {DIRECTORIO_EMERGENCIAS.map((item, index) => {
                const Icono = item.icono;
                return (
                  <div
                    key={index}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--cru-surface-muted)',
                      border: '1px solid var(--cru-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          backgroundColor: `${item.color}20`,
                          border: `1px solid ${item.color}45`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.color,
                          flexShrink: 0
                        }}
                      >
                        <Icono size={18} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cru-text)' }}>
                            {item.servicio}
                          </span>
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              backgroundColor: 'var(--cru-badge-neutral-bg)',
                              color: 'var(--cru-text-soft)'
                            }}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--cru-text-soft)', lineHeight: 1.3 }}>
                          {item.descripcion}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${item.telefono.replace(/[^0-9]/g, '')}`}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--cru-accent-red-bg)',
                        border: '1px solid var(--cru-accent-red-border)',
                        color: 'var(--cru-accent-red)',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <PhoneCall size={13} />
                      <span>{item.telefono}</span>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Pie del Modal */}
            <div
              style={{
                padding: '0.85rem 1.5rem',
                backgroundColor: 'var(--cru-surface-muted)',
                borderTop: '1px solid var(--cru-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                fontSize: '0.75rem',
                color: 'var(--cru-text-soft)'
              }}
            >
              <span>Centro de Mando CNE &bull; República de Costa Rica</span>
              <Link
                to="/seguridad-emergencias"
                onClick={() => setModalAbierto(false)}
                style={{
                  color: 'var(--cru-accent-sky)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>Ver módulo completo</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
