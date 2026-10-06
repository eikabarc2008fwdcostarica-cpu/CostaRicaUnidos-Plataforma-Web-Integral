import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Home,
  MapPin,
  ExternalLink,
  ZapOff,
  Flame,
  Shield,
  HeartPulse,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Clock,
  Radio,
  Building2,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CneAlertRibbon, { CNE_ALERT_LEVELS } from '../components/security/CneAlertRibbon';
import { ALBERGUES_CNE_DATA } from '../components/security/AlberguesListMap';
import { generarEnlaceWaze, generarEnlaceGoogleMaps } from '../components/gis/gisLayersData';

/**
 * SeguridadEmergencias — Centro de Operaciones de Emergencia Cantonal (COE / CNE)
 * Sistema Sovereign Civic Glass v2.1 • Cero saturación de colores no reglamentarios
 * Botonera Táctil de Auxilio Inmediato en Vidrio Oscuro · Red de Albergues Temporales Oficiales
 * Fase 4D: Tokenización completa CRU — soporte dark/light mode
 */
export default function SeguridadEmergencias() {
  const [currentAlertKey, setCurrentAlertKey] = useState('amarilla');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [filtroProvincia, setFiltroProvincia] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [searchAlbergue, setSearchAlbergue] = useState('');

  // Detección de conectividad
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

  const alertaActiva = CNE_ALERT_LEVELS[currentAlertKey] || CNE_ALERT_LEVELS.amarilla;

  // Botonera de auxilio de gran formato con marco en vidrio oscuro sobrio
  const ENTIDADES_AUXILIO = [
    {
      id: '911',
      numero: '9-1-1',
      telHref: 'tel:911',
      titulo: 'Central Nacional de Emergencias 9-1-1',
      entidad: 'Sistema Nacional de Emergencias de Costa Rica',
      descripcion: 'Atención unificada para riesgo de vida, siniestros mayores, rescate y emergencias graves.',
      prioridad: 'Emergencia Máxima',
      icono: ShieldAlert,
      acentoColor: 'var(--cru-accent-red)'
    },
    {
      id: 'fp',
      numero: '2295-3272',
      telHref: 'tel:+50622953272',
      titulo: 'Fuerza Pública y Seguridad Cantonal',
      entidad: 'Ministerio de Seguridad Pública de Costa Rica',
      descripcion: 'Patrullaje preventivo, control de disturbios, flagrancias penales y custodia de persona.',
      prioridad: 'Orden Público',
      icono: Shield,
      acentoColor: 'var(--cru-accent-blue)'
    },
    {
      id: 'bomberos',
      numero: '1118',
      telHref: 'tel:1118',
      titulo: 'Cuerpo de Bomberos de Costa Rica',
      entidad: 'Benemérito Cuerpo de Bomberos — Ley N° 8228',
      descripcion: 'Incendios estructurales y forestales, rescate vehicular, materiales peligrosos y derrumbes.',
      prioridad: 'Siniestro Crítico',
      icono: Flame,
      acentoColor: 'var(--carrot, #FB6015)'
    },
    {
      id: 'cruzroja',
      numero: '128',
      telHref: 'tel:128',
      titulo: 'Cruz Roja Costarricense',
      entidad: 'Cruz Roja Costarricense — Ley N° 6532',
      descripcion: 'Urgencias médicas prehospitalarias, traslados de pacientes en estado crítico y asistencia humanitaria.',
      prioridad: 'Asistencia Médica',
      icono: HeartPulse,
      acentoColor: 'var(--cru-accent-red)'
    },
    {
      id: 'oij',
      numero: '800-8000-645',
      telHref: 'tel:8008000645',
      titulo: 'Organismo de Investigación Judicial (OIJ)',
      entidad: 'Poder Judicial de Costa Rica',
      descripcion: 'Línea confidencial gratuita de denuncias penales, delitos graves y crimen organizado.',
      prioridad: 'Denuncia Confidencial',
      icono: Scale,
      acentoColor: 'var(--cru-accent-blue)'
    }
  ];

  // Filtrado de albergues temporales
  const alberguesFiltrados = ALBERGUES_CNE_DATA.filter((alb) => {
    const coincideProv = filtroProvincia === 'todas' || alb.provincia.toLowerCase() === filtroProvincia.toLowerCase();
    const coincideEstado = filtroEstado === 'todos' || alb.estado.toLowerCase() === filtroEstado.toLowerCase();
    const q = searchAlbergue.toLowerCase().trim();
    const coincideBusqueda =
      !q ||
      alb.nombre.toLowerCase().includes(q) ||
      alb.canton.toLowerCase().includes(q) ||
      alb.distrito.toLowerCase().includes(q);

    return coincideProv && coincideEstado && coincideBusqueda;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--theme-bg)',
        color: 'var(--theme-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-body, system-ui, sans-serif)'
      }}
    >
      <Navbar />

      {/* Banner de Aviso de Modo Sin Conexión */}
      {isOffline && (
        <div
          role="status"
          aria-live="assertive"
          style={{
            backgroundColor: 'var(--cru-accent-red-bg)',
            backdropFilter: 'blur(10px)',
            color: 'var(--cru-accent-red)',
            padding: '0.65rem 1.5rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            borderBottom: '1px solid var(--cru-accent-red-border)'
          }}
        >
          <ZapOff size={16} />
          <span>Modo Sin Conexión Activo: La botonera 9-1-1 y la base de datos de albergues están disponibles en su dispositivo.</span>
        </div>
      )}

      <main
        className="civic-container"
        style={{
          flex: 1,
          padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(0.75rem, 3vw, 2rem) 5rem',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* ==========================================================================
            1. CABECERA INSTITUCIONAL: CENTRO DE MANDO MUNICIPAL (COE / CNE)
            ========================================================================== */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--color-sovereign-blue, #002B7F) 0%, var(--color-obsidian, #00040D) 100%)',
            border: '2px solid var(--glass-level-2-border)',
            borderRadius: '24px',
            padding: 'clamp(1.25rem, 4vw, 2.5rem)',
            marginBottom: '3rem',
            boxShadow: 'var(--glow-provincial)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Cinta tricolor de Estado */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, var(--color-institutional-blue, #001489) 0%, var(--color-institutional-blue) 20%, #FFFFFF 20%, #FFFFFF 30%, var(--color-solidarity-red, #CE1126) 30%, var(--color-solidarity-red) 70%, #FFFFFF 70%, #FFFFFF 80%, var(--color-institutional-blue) 80%, var(--color-institutional-blue) 100%)'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem'
            }}
          >
            <div style={{ maxWidth: '850px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: 'var(--cru-accent-red-bg)',
                    border: '1px solid var(--cru-accent-red-border)',
                    color: 'var(--cru-accent-red)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Radio size={13} />
                  <span>CENTRO DE OPERACIONES DE EMERGENCIA (COE)</span>
                </span>
                <span style={{ color: 'var(--cru-text-muted)' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--glass-level-2-border)', fontWeight: 600 }}>
                  COMISIÓN NACIONAL DE EMERGENCIAS (CNE) · LEY N° 8488
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(1.9rem, 3.8vw, 2.85rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  margin: '0 0 0.85rem 0'
                }}
              >
                Centro de Operaciones de Emergencia Cantonal y Red de Auxilio
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--glass-level-2-border)', lineHeight: 1.65, margin: 0 }}>
                Coordinación operativa en tiempo real con los Comités Municipales de Emergencia (CME), sistema de marcado directo de auxilio y catálogo georreferenciado de albergues temporales seguros bajo la Ley N° 8488.
              </p>
            </div>

            {/* Protocolo Formal de la CNE según la Alerta Activa */}
            <div
              style={{
                backgroundColor: 'var(--glass-level-3-bg)',
                border: `1px solid ${alertaActiva.color}50`,
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                maxWidth: '380px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: alertaActiva.color,
                    boxShadow: `0 0 10px ${alertaActiva.color}`
                  }}
                />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: alertaActiva.color, textTransform: 'uppercase' }}>
                  {alertaActiva.badgeText} ACTIVA
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--glass-level-3-border)', lineHeight: 1.5, margin: 0 }}>
                {alertaActiva.protocolo}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)' }}>
                Zonas bajo aviso: {alertaActiva.zonas}
              </span>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. BOTONERA TÁCTIL DE AUXILIO INMEDIATO (DISEÑO SOBRIO EN VIDRIO OSCURO)
            Botones de gran formato (80px+ de alto) · 9-1-1, Fuerza Pública, Bomberos, Cruz Roja, OIJ
            ========================================================================== */}
        <section aria-labelledby="seccion-auxilio" style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cru-accent-red)', display: 'block', marginBottom: '0.25rem' }}>
              CANALES DE AUXILIO INMEDIATO (24/7)
            </span>
            <h2
              id="seccion-auxilio"
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: 'var(--cru-text)',
                margin: 0,
                fontFamily: 'var(--font-headline)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <PhoneCall size={24} color="var(--cru-accent-red)" />
              <span>Botonera Táctil de Auxilio y Despacho Inmediato</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--cru-text-soft)', marginTop: '0.4rem', margin: '0.4rem 0 0 0', fontWeight: 500 }}>
              Toque cualquier botón de la lista para establecer enlace telefónico instantáneo con los cuerpos de rescate del Estado.
            </p>
          </div>

          <div
            className="botonera-911-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '1.25rem'
            }}
          >
            {ENTIDADES_AUXILIO.map((ent) => {
              const Icono = ent.icono;
              return (
                <div
                  key={ent.id}
                  style={{
                    backgroundColor: 'var(--cru-surface-card)',
                    border: '1px solid var(--cru-border)',
                    borderTop: '4px solid var(--cru-accent-red)',
                    borderRadius: '18px',
                    padding: 'clamp(1rem, 3vw, 1.5rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--cru-card-shadow)',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cru-border-hover)';
                    e.currentTarget.style.borderTopColor = 'var(--cru-accent-red)';
                    e.currentTarget.style.boxShadow = 'var(--cru-card-shadow-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cru-border)';
                    e.currentTarget.style.borderTopColor = 'var(--cru-accent-red)';
                    e.currentTarget.style.boxShadow = 'var(--cru-card-shadow)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--cru-accent-blue-bg)',
                            border: '1.5px solid var(--cru-accent-blue-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icono size={20} color="var(--cru-accent-blue)" />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cru-accent-red)', textTransform: 'uppercase', display: 'block' }}>
                            {ent.prioridad}
                          </span>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--cru-text)', margin: 0 }}>
                            {ent.titulo}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--cru-text-soft)', lineHeight: 1.55, margin: '0 0 1.25rem 0', fontWeight: 500 }}>
                      {ent.descripcion}
                    </p>
                  </div>

                  {/* Botón Táctil de Marcado de Gran Formato (Min 54px de alto para celulares y accesibilidad) */}
                  <a
                    href={ent.telHref}
                    aria-label={`Llamar inmediatamente a ${ent.titulo} al número ${ent.numero}`}
                    className="boton-tactil-auxilio"
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'var(--cru-accent-blue)',
                      border: 'none',
                      color: '#FFFFFF',
                      minHeight: '58px',
                      padding: '0.75rem 1rem',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'var(--transition-smooth)',
                      boxSizing: 'border-box',
                      boxShadow: '0 4px 14px var(--cru-accent-blue-border)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--navy, #062A77)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--cru-accent-blue)';
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--cru-accent-blue-border)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Línea Directa Oficial:
                      </span>
                      <strong style={{ fontSize: '1.25rem', color: '#FFFFFF', fontFamily: 'var(--font-telemetry, monospace)', letterSpacing: '0.04em' }}>
                        {ent.numero}
                      </strong>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'var(--cru-accent-red)',
                        color: '#FFFFFF',
                        padding: '0.5rem 0.95rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        flexShrink: 0
                      }}
                    >
                      <PhoneCall size={14} />
                      <span>Llamar</span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================================================
            3. RED DE ALBERGUES TEMPORALES MUNICIPALES (TABLA GEORREFERENCIADA)
            Salón comunal / gimnasio · Aforo oficial · Dotación sanitaria · Disponibilidad
            ========================================================================== */}
        <section aria-labelledby="seccion-albergues">
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cru-accent-green)', display: 'block', marginBottom: '0.25rem' }}>
              LOGÍSTICA DE RESIDENCIA Y EVACUACIÓN HUMANITARIA
            </span>
            <h2
              id="seccion-albergues"
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: 'var(--cru-text)',
                margin: 0,
                fontFamily: 'var(--font-headline)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <Home size={24} color="var(--cru-accent-blue)" />
              <span>Red de Albergues Temporales Municipales</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--cru-text-soft)', marginTop: '0.4rem', margin: '0.4rem 0 0 0', fontWeight: 500 }}>
              Catálogo oficial de refugios comunales habilitados por la CNE y los gobiernos locales con trazabilidad de capacidad y servicios sanitarios.
            </p>
          </div>

          {/* Filtros Rápidos de Albergues */}
          <div
            style={{
              backgroundColor: 'var(--cru-surface-card)',
              border: '1px solid var(--cru-border)',
              borderRadius: '16px',
              padding: '1.15rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: 'var(--cru-card-shadow)'
            }}
          >
            <input
              type="text"
              value={searchAlbergue}
              onChange={(e) => setSearchAlbergue(e.target.value)}
              placeholder="Buscar por nombre de gimnasio, salón comunal o cantón..."
              aria-label="Buscar albergue temporal por nombre o ubicación"
              style={{
                flex: '1 1 280px',
                padding: '0.65rem 1rem',
                backgroundColor: 'var(--theme-input-bg)',
                border: '1px solid var(--theme-input-border)',
                borderRadius: '10px',
                color: 'var(--theme-input-text)',
                fontSize: '0.88rem',
                outline: 'none',
                fontWeight: 500
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <select
                value={filtroProvincia}
                onChange={(e) => setFiltroProvincia(e.target.value)}
                aria-label="Filtrar albergues por provincia"
                style={{
                  backgroundColor: 'var(--cru-select-bg)',
                  color: 'var(--cru-select-text)',
                  border: '1px solid var(--cru-border-strong)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <option value="todas">Todas las Provincias</option>
                <option value="San José">San José</option>
                <option value="Alajuela">Alajuela</option>
                <option value="Cartago">Cartago</option>
                <option value="Heredia">Heredia</option>
                <option value="Guanacaste">Guanacaste</option>
                <option value="Puntarenas">Puntarenas</option>
                <option value="Limón">Limón</option>
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                aria-label="Filtrar albergues por estado"
                style={{
                  backgroundColor: 'var(--cru-select-bg)',
                  color: 'var(--cru-select-text)',
                  border: '1px solid var(--cru-border-strong)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <option value="todos">
                  ● Todos los Estados
                </option>
                <option value="activo">
                  ● Habilitado (Operativo y Activo)
                </option>
                <option value="preparado">
                  ● Ocupación Alta / Preparación
                </option>
                <option value="en_reserva">
                  ● En Reserva
                </option>
              </select>
            </div>
          </div>

          {/* Tabla Georreferenciada de Albergues */}
          <div
            className="civic-table-container custom-civic-scrollbar"
            style={{
              overflowX: 'auto',
              borderRadius: '18px',
              border: '1px solid var(--cru-border)',
              backgroundColor: 'var(--cru-surface-card)',
              boxShadow: 'var(--cru-card-shadow)',
              width: '100%',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: '760px',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.88rem',
                color: 'var(--theme-text-primary)'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--cru-surface-muted)',
                    borderBottom: '1.5px solid var(--cru-border)'
                  }}
                >
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--cru-text)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Albergue &amp; Tipología
                  </th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--cru-text)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Cantón / Distrito
                  </th>
                  <th style={{ padding: '1rem 1rem', color: 'var(--cru-text)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Aforo &amp; Ocupación
                  </th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--cru-text)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Dotación Sanitaria y Servicios
                  </th>
                  <th style={{ padding: '1rem 1rem', color: 'var(--cru-text)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Disponibilidad
                  </th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--cru-text)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', textAlign: 'right' }}>
                    Navegación GPS
                  </th>
                </tr>
              </thead>
              <tbody>
                {alberguesFiltrados.map((alb, idx) => {
                  const porcentaje = Math.round((alb.ocupacionActual / alb.aforoMaximo) * 100);
                  const wazeUrl = generarEnlaceWaze(alb.lat, alb.lng);
                  const gmapsUrl = generarEnlaceGoogleMaps(alb.lat, alb.lng);

                  return (
                    <tr
                      key={alb.id}
                      style={{
                        borderBottom: '1px solid var(--cru-border)',
                        backgroundColor: idx % 2 === 0 ? 'var(--cru-surface-card)' : 'var(--cru-surface-hover)',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--cru-accent-blue-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--cru-surface-card)' : 'var(--cru-surface-hover)';
                      }}
                    >
                      {/* Nombre y Tipo */}
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top' }}>
                        <div>
                          <strong style={{ color: 'var(--cru-text)', fontSize: '0.92rem', display: 'block', fontWeight: 800 }}>
                            {alb.nombre}
                          </strong>
                          <span style={{ fontSize: '0.76rem', color: 'var(--cru-text-muted)', fontWeight: 600 }}>{alb.tipo}</span>
                        </div>
                      </td>

                      {/* Cantón y Distrito */}
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ color: 'var(--theme-text-primary)', fontWeight: 700 }}>
                            {alb.canton}, {alb.provincia}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--cru-accent-blue)', fontWeight: 600 }}>
                            Distrito {alb.distrito}
                          </span>
                        </div>
                      </td>

                      {/* Aforo y Ocupación */}
                      <td style={{ padding: '1.15rem 1rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                            {alb.ocupacionActual} / {alb.aforoMaximo} personas
                          </span>
                          <div style={{ width: '110px', height: '7px', backgroundColor: 'var(--cru-track)', borderRadius: '9999px', marginTop: '0.4rem', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${porcentaje}%`,
                                height: '100%',
                                backgroundColor: porcentaje > 80 ? 'var(--cru-accent-red)' : porcentaje > 50 ? 'var(--cru-accent-amber)' : 'var(--cru-accent-blue)',
                                borderRadius: '9999px'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                            {porcentaje}% ocupado
                          </span>
                        </div>
                      </td>

                      {/* Dotación Sanitaria y Servicios */}
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {alb.suministros.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '6px',
                                backgroundColor: 'var(--cru-badge-neutral-bg)',
                                color: 'var(--cru-badge-neutral-text)',
                                border: '1px solid var(--cru-badge-neutral-border)',
                                fontWeight: 500
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Disponibilidad */}
                      <td style={{ padding: '1.15rem 1rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            textTransform: 'uppercase',
                            backgroundColor:
                              alb.estado === 'activo'
                                ? 'var(--cru-accent-green-bg)'
                                : alb.estado === 'preparado'
                                ? 'var(--cru-accent-amber-bg)'
                                : 'var(--cru-badge-neutral-bg)',
                            color:
                              alb.estado === 'activo'
                                ? 'var(--cru-accent-green)'
                                : alb.estado === 'preparado'
                                ? 'var(--cru-accent-amber)'
                                : 'var(--cru-badge-neutral-text)',
                            border: `1px solid ${
                              alb.estado === 'activo'
                                ? 'var(--cru-accent-green-border)'
                                : alb.estado === 'preparado'
                                ? 'var(--cru-accent-amber-border)'
                                : 'var(--cru-badge-neutral-border)'
                            }`
                          }}
                        >
                          {alb.estado === 'activo' ? 'Operativo y Activo' : alb.estado === 'preparado' ? 'En Preparación' : 'En Reserva'}
                        </span>
                      </td>

                      {/* Navegación Waze y Google Maps */}
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <a
                            href={wazeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: 'none',
                              backgroundColor: 'var(--cru-accent-blue-bg)',
                              border: '1px solid var(--cru-accent-blue-border)',
                              color: 'var(--cru-accent-blue)',
                              padding: '0.45rem 0.85rem',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'var(--transition-smooth)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--cru-accent-sky-bg)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--cru-accent-blue-bg)';
                            }}
                          >
                            <Navigation size={13} />
                            <span>Waze</span>
                          </a>

                          <a
                            href={gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: 'none',
                              backgroundColor: 'var(--cru-accent-red-bg)',
                              border: '1px solid var(--cru-accent-red-border)',
                              color: 'var(--cru-accent-red)',
                              padding: '0.45rem 0.85rem',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'var(--transition-smooth)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.85';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                          >
                            <MapPin size={13} />
                            <span>Maps</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
