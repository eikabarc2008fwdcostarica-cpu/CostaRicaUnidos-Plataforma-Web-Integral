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
          backgroundColor: 'rgba(220, 38, 38, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          boxShadow: '0 4px 20px rgba(220, 38, 38, 0.18)',
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
              backgroundColor: 'rgba(239, 68, 68, 0.22)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              flexShrink: 0
            }}
          >
            <ShieldAlert size={20} strokeWidth={2} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FEE2E2', letterSpacing: '0.02em' }}>
                SOS 911
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#FECACA',
                  border: '1px solid rgba(239, 68, 68, 0.5)'
                }}
              >
                SIN AUTENTICACIÓN
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#FCA5A5', lineHeight: 1.3 }}>
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
              backgroundColor: '#DC2626',
              border: '1px solid #EF4444',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.5)',
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
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FEE2E2',
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
            backgroundColor: 'rgba(0, 4, 13, 0.88)',
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
              backgroundColor: '#0A0F1D',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(220, 38, 38, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Cabecera del Modal */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
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
                    backgroundColor: '#DC2626',
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
                    style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}
                  >
                    Directorio de Auxilio Inmediato
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#FCA5A5' }}>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#CBD5E1',
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
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
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
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F1F5F9' }}>
                            {item.servicio}
                          </span>
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: '#94A3B8'
                            }}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.3 }}>
                          {item.descripcion}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${item.telefono.replace(/[^0-9]/g, '')}`}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#F87171',
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
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                fontSize: '0.75rem',
                color: '#94A3B8'
              }}
            >
              <span>Centro de Mando CNE &bull; República de Costa Rica</span>
              <Link
                to="/seguridad-emergencias"
                onClick={() => setModalAbierto(false)}
                style={{
                  color: '#38BDF8',
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
