import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  CneAlertRibbon,
  SosKeypadFullscreen,
  AlberguesListMap,
  OfflineResilienceManager
} from '../components/security';

/**
 * Módulo 10: Centro Nacional de Seguridad Ciudadana, Gestión del Riesgo y Modo Resiliencia Offline PWA
 * Costa Rica Unidos - Rol: Eiker (Senior PWA & Resilience Engineer)
 */
export default function SeguridadEmergencias() {
  const [activeSection, setActiveSection] = useState('sos'); // 'sos' | 'albergues' | 'resiliencia' | 'guias'
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#00040D',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* 1. Cintillo Superior Dinámico CNE (36px altura fija, telemetry monoespaciada) */}
      <CneAlertRibbon />

      {/* 2. Barra de Navegación Institucional */}
      <Navbar />

      {/* Alerta de Desconexión Flotante si el usuario está offline */}
      {isOffline && (
        <div
          role="status"
          aria-live="assertive"
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '0.65rem 1rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            borderBottom: '2px solid #EF4444',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
          }}
        >
          <span>⚡ MODO SIN CONEXIÓN ACTIVO:</span>
          <span>Botonera SOS, números de auxilio y refugios disponibles desde el caché local PWA.</span>
        </div>
      )}

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '1.5rem 0 3rem' }}>
        <div className="civic-container">
          {/* Encabezado del Módulo con badges de resiliencia */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '1.25rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(218, 41, 28, 0.15)',
                border: '1px solid rgba(218, 41, 28, 0.35)',
                borderRadius: '999px',
                padding: '0.25rem 0.85rem',
                fontSize: '0.76rem',
                color: '#FF6B6B',
                fontWeight: 700,
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF6B6B', animation: 'pulse 1.5s infinite' }} />
                MÓDULO 10 &bull; SEGURIDAD CIUDADANA Y RESILIENCIA PWA
              </div>
              <h1 style={{
                fontSize: '2.1rem',
                fontWeight: 900,
                lineHeight: 1.15,
                margin: '0.2rem 0 0.5rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #FFFFFF 60%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Centro de Emergencias y Auxilio Ciudadano
              </h1>
              <p style={{
                color: '#94A3B8',
                fontSize: '0.96rem',
                maxWidth: '720px',
                margin: 0,
                lineHeight: 1.5
              }}>
                Plataforma de alta resiliencia diseñada para operar aún bajo cero conectividad celular o desastres naturales. Marcado táctil directo al 9-1-1 y Cuerpos de Socorro de la República de Costa Rica.
              </p>
            </div>

            {/* Selector de Sección Rápida */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.35rem',
              borderRadius: '12px'
            }}>
              <button
                type="button"
                onClick={() => setActiveSection('sos')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeSection === 'sos' ? '#DA291C' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                🚨 Botonera SOS
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('albergues')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeSection === 'albergues' ? '#001489' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                🏕️ Albergues CNE
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('resiliencia')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeSection === 'resiliencia' ? '#047857' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                💾 Modo Offline PWA
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('guias')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeSection === 'guias' ? '#475569' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                📋 Protocolos CNE
              </button>
            </div>
          </div>

          {/* Vistas según pestaña seleccionada */}
          {activeSection === 'sos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <SosKeypadFullscreen />
              <div style={{ marginTop: '1rem' }}>
                <OfflineResilienceManager />
              </div>
            </div>
          )}

          {activeSection === 'albergues' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <AlberguesListMap />
            </div>
          )}

          {activeSection === 'resiliencia' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <OfflineResilienceManager />
              {/* Resumen de capacidades del Service Worker */}
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                backdropFilter: 'blur(16px)'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1rem', color: '#38BDF8' }}>
                  ⚙️ Especificación de Arquitectura de Resiliencia PWA & Service Worker
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem'
                }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #3B82F6' }}>
                    <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.92rem', color: '#93C5FD' }}>Estrategia Cache-First (Recursos Críticos)</h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                      Iconografía de auxilio, tipografías del sistema y estilos CSS se preservan en la caché del Service Worker (<code style={{ color: '#FCD34D' }}>cr-unidos-critical-v1</code>) con retorno instantáneo (&lt; 20ms) sin consultar el servidor remoto.
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #10B981' }}>
                    <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.92rem', color: '#6EE7B7' }}>Buzón Desconectado en Cola Local</h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                      Si el ciudadano remite una alerta de auxilio en zonas sin cobertura, se cifra y almacena en el motor local con UUID y timestamp. Al restaurar señal (evento <code style={{ color: '#FCD34D' }}>window.online</code>), se transmite al servidor central automáticamente.
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #F59E0B' }}>
                    <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.92rem', color: '#FDE68A' }}>Telefonía Directa Ininterrumpida</h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                      Los enlaces <code style={{ color: '#FCD34D' }}>tel:911</code> y números de emergencia operan a nivel del hardware del módem GSM celular, garantizando que el ciudadano pueda llamar aunque no disponga de paquete de datos o saldo de internet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'guias' && (
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(16px)'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem', color: '#FFFFFF' }}>
                📋 Protocolos de Actuación Ciudadana ante Desastres Oficiales CNE
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Guías oficiales de autoprotección para sismos, inundaciones, erupciones volcánicas y deslizamientos en Costa Rica.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem'
              }}>
                <div style={{
                  backgroundColor: 'rgba(0, 4, 13, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🌋</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#E2E8F0' }}>Caída de Ceniza Volcánica</h3>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <li>Proteja vías respiratorias con mascarilla N95 o pañuelo húmedo.</li>
                    <li>Cierre puertas y ventanas; selle rendijas con toallas mojadas.</li>
                    <li>No limpie techos con agua; barra la ceniza en seco para evitar colapso.</li>
                    <li>Proteja recipientes de agua potable y mascotas.</li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 4, 13, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🌊</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#E2E8F0' }}>Inundaciones y Cabezas de Agua</h3>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <li>Evite cruzar ríos crecidos, badenes o puentes anegados a pie o en vehículo.</li>
                    <li>Desconecte interruptores eléctricos principales y cierre llaves de gas.</li>
                    <li>Acuda de inmediato al Albergue Temporal CNE asignado en su cantón.</li>
                    <li>Mantenga a mano mochila de emergencia de 72 horas.</li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 4, 13, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>⚡</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#E2E8F0' }}>Terremoto / Falla Tectónica</h3>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <li>Agáchese, cúbrase bajo un mueble resistente y agárrese firmemente.</li>
                    <li>Aléjese de ventanales de vidrio, postes eléctricos y tendido de alta tensión.</li>
                    <li>No use elevadores; descienda ordenadamente por gradas de emergencia.</li>
                    <li>Verifique si hay fugas de gas antes de encender fósforos o linternas.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Cívico */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '2rem 0',
        backgroundColor: 'rgba(0, 4, 13, 0.95)',
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: '0.85rem'
      }}>
        <div className="civic-container">
          <p style={{ marginBottom: '0.4rem', color: '#E2E8F0', fontWeight: 600 }}>
            República de Costa Rica &bull; Costa Rica Unidos &bull; Módulo 10 Seguridad Ciudadana y Resiliencia PWA
          </p>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Comisión Nacional de Prevención de Riesgos y Atención de Emergencias (CNE) &bull; Sistema 9-1-1 &bull; Service Worker Cache-First
          </p>
        </div>
      </footer>
    </div>
  );
}
