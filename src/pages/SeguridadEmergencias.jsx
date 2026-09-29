import React, { useState, useEffect } from 'react';
import { ZapOff, Flame, Home, HardDrive, FileCheck, FileText, Mountain, Waves, Zap, Shield, PhoneCall } from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  CneAlertRibbon,
  SosKeypadFullscreen,
  AlberguesListMap,
  OfflineResilienceManager
} from '../components/security';

/**
 * SeguridadEmergencias — Centro Nacional de Auxilio y Resiliencia
 * Swiss Minimalist Glass • Cero Jerga Técnica • 100% Asistencia Ciudadana
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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#00040D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* 1. Cintillo Dinámico de Alertas CNE */}
      <CneAlertRibbon />

      {/* 2. Barra de Navegación Minimalista */}
      <Navbar />

      {/* Banner de Aviso Sin Conexión */}
      {isOffline && (
        <div
          role="status"
          aria-live="assertive"
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '0.75rem 1.5rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 25px rgba(220, 38, 38, 0.5)'
          }}
        >
          <ZapOff size={16} />
          <span>Modo Sin Conexión Activo: La botonera 911, números de rescate y lista de albergues están disponibles en tu dispositivo.</span>
        </div>
      )}

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '3rem 2rem 6rem', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
        {/* Encabezado Editorial */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '2rem',
            marginBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '2.5rem'
          }}
        >
          <div style={{ maxWidth: '780px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FF6B6B',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.85rem'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DA291C' }} />
              Centro Nacional de Seguridad Ciudadana
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                margin: '0 0 1rem',
                color: '#FFFFFF'
              }}
            >
              Emergencias y Auxilio Ciudadano
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              Acceso inmediato a la botonera táctil del 9-1-1, catálogo de albergues temporales y protocolos oficiales de la Comisión Nacional de Emergencias (CNE) con soporte ininterrumpido sin conexión celular.
            </p>
          </div>

          {/* Selector de Pestañas en Vidrio Esmerilado */}
          <div
            style={{
              display: 'flex',
              gap: '0.45rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.35rem',
              borderRadius: '9999px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveSection('sos')}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeSection === 'sos' ? '#DA291C' : 'transparent',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
                boxShadow: activeSection === 'sos' ? '0 4px 15px rgba(218, 41, 28, 0.4)' : 'none'
              }}
            >
              <Flame size={14} />
              <span>Botonera SOS 911</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('albergues')}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeSection === 'albergues' ? '#002B7F' : 'transparent',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
                boxShadow: activeSection === 'albergues' ? '0 4px 15px rgba(0, 43, 127, 0.5)' : 'none'
              }}
            >
              <Home size={14} />
              <span>Albergues Temporales</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('resiliencia')}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeSection === 'resiliencia' ? '#047857' : 'transparent',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
                boxShadow: activeSection === 'resiliencia' ? '0 4px 15px rgba(4, 120, 87, 0.4)' : 'none'
              }}
            >
              <HardDrive size={14} />
              <span>Modo Sin Conexión</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('guias')}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeSection === 'guias' ? '#334155' : 'transparent',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease'
              }}
            >
              <FileCheck size={14} />
              <span>Guías CNE</span>
            </button>
          </div>
        </div>

        {/* Sección Activa */}
        {activeSection === 'sos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <SosKeypadFullscreen />
            <OfflineResilienceManager />
          </div>
        )}

        {activeSection === 'albergues' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AlberguesListMap />
          </div>
        )}

        {activeSection === 'resiliencia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <OfflineResilienceManager />

            {/* Guía Ciudadana de Continuidad Operativa (Limpia, Sin Jerga) */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#79a6ff', display: 'block', marginBottom: '0.5rem' }}>
                  Garantía de Funcionamiento
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  Cómo Funciona la Protección Sin Internet
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }}
              >
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #3B82F6' }}>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
                    Memoria Local Automática
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    Los números telefónicos de auxilio y la red de albergues se conservan guardados en tu navegador para que puedas consultarlos de inmediato ante tormentas, cortes eléctricos o pérdida de señal.
                  </p>
                </div>

                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #10B981' }}>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
                    Llamada Telefónica Directa
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    Los botones de llamada al 9-1-1 y Cuerpos de Socorro se conectan directamente con la línea de voz de tu teléfono celular, permitiéndote pedir auxilio aunque no cuentes con saldo de datos.
                  </p>
                </div>

                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #F59E0B' }}>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
                    Sincronización Transparente
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    Cualquier reporte o solicitud que registres mientras estés en una zona sin cobertura se guardará de forma segura y se enviará automáticamente en cuanto recuperes conexión.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'guias' && (
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#79a6ff', display: 'block', marginBottom: '0.5rem' }}>
                Prevención y Autoprotección
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#FFFFFF' }}>
                Protocolos Oficiales ante Desastres
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: 0 }}>
                Recomendaciones oficiales para salvaguardar tu vida y la de tu familia ante eventos naturales frecuentes en Costa Rica.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {/* Sismo */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1.25rem',
                  padding: '1.75rem'
                }}
              >
                <div style={{ marginBottom: '0.75rem', color: '#FBBF24' }}>
                  <Zap size={26} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#FFFFFF' }}>Terremotos y Sismos</h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  <li>Agáchate, cúbrete bajo un mueble resistente y sujétate con firmeza.</li>
                  <li>Aléjate de ventanales, espejos y cables de alta tensión.</li>
                  <li>No utilices elevadores; baja ordenadamente por escaleras.</li>
                  <li>Verifica posibles fugas de gas antes de encender interruptores o linternas.</li>
                </ul>
              </div>

              {/* Inundación */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1.25rem',
                  padding: '1.75rem'
                }}
              >
                <div style={{ marginBottom: '0.75rem', color: '#38BDF8' }}>
                  <Waves size={26} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#FFFFFF' }}>Inundaciones y Ríos Crecidos</h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  <li>No intentes cruzar ríos crecidos, badenes ni puentes anegados a pie o en vehículo.</li>
                  <li>Corta la electricidad desde la caja de frenos principal y cierra llaves de paso.</li>
                  <li>Trasládate de inmediato al albergue temporal habilitado en tu cantón.</li>
                  <li>Mantén siempre preparada una mochila de emergencia para 72 horas.</li>
                </ul>
              </div>

              {/* Ceniza Volcánica */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1.25rem',
                  padding: '1.75rem'
                }}
              >
                <div style={{ marginBottom: '0.75rem', color: '#FB923C' }}>
                  <Mountain size={26} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#FFFFFF' }}>Caída de Ceniza Volcánica</h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  <li>Protege ojos, nariz y boca con mascarilla o paño humedecido.</li>
                  <li>Cierra puertas y ventanas; coloca toallas húmedas en rendijas.</li>
                  <li>Barre la ceniza de los techos en seco para evitar acumulación de peso y colapso.</li>
                  <li>Cubre recipientes de agua potable y mantén a las mascotas bajo techo.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Minimalista */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4rem 2rem 3rem',
          backgroundColor: '#00040D',
          textAlign: 'center',
          color: '#64748B',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ marginBottom: '0.4rem', color: '#E2E8F0', fontWeight: 600 }}>
            República de Costa Rica &bull; Costa Rica Unidos &bull; Centro Nacional de Emergencias
          </p>
          <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
            Comisión Nacional de Prevención de Riesgos y Atención de Emergencias (CNE) &bull; Sistema 9-1-1
          </p>
        </div>
      </footer>
    </div>
  );
}
