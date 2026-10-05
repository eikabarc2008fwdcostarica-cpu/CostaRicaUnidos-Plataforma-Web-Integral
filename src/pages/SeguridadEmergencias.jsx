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
      prioridad: 'Prioridad Máxima / Inmediata',
      icono: ShieldAlert,
      acentoColor: '#DA291C'
    },
    {
      id: 'fuerza_publica',
      numero: '1117 / 2586-4000',
      telHref: 'tel:1117',
      titulo: 'Fuerza Pública Cantonal',
      entidad: 'Ministerio de Seguridad Pública',
      descripcion: 'Seguridad ciudadana, patrullaje preventivo cantonal, asaltos y alteración del orden público.',
      prioridad: 'Seguridad Ciudadana',
      icono: Shield,
      acentoColor: '#002B7F'
    },
    {
      id: 'bomberos',
      numero: '1118 / 2547-3700',
      telHref: 'tel:1118',
      titulo: 'Benemérito Cuerpo de Bomberos',
      entidad: 'Cuerpo de Bomberos de Costa Rica',
      descripcion: 'Incendios estructurales y forestales, rescate en estructuras colapsadas y materiales peligrosos.',
      prioridad: 'Incendios & Rescate',
      icono: Flame,
      acentoColor: '#F36717'
    },
    {
      id: 'cruz_roja',
      numero: '1128 / 2528-0000',
      telHref: 'tel:1128',
      titulo: 'Cruz Roja Costarricense',
      entidad: 'Sociedad Nacional de la Cruz Roja',
      descripcion: 'Soporte vital básico y avanzado, despacho de ambulancias y rescate acuático y montañoso.',
      prioridad: 'Atención Prehospitalaria',
      icono: HeartPulse,
      acentoColor: '#DA291C'
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
      acentoColor: '#79a6ff'
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
        backgroundColor: 'var(--theme-bg, #00040D)',
        color: 'var(--theme-text-primary, #FFFFFF)',
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
            backgroundColor: 'rgba(218, 41, 28, 0.92)',
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            padding: '0.65rem 1.5rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
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
            backgroundColor: 'rgba(0, 15, 45, 0.72)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: 'clamp(1.25rem, 4vw, 2.5rem)',
            marginBottom: '3rem',
            boxShadow: '0 20px 60px rgba(0, 4, 13, 0.8), 0 0 35px rgba(0, 20, 137, 0.35)',
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
              background: 'linear-gradient(90deg, #001489 0%, #001489 20%, #FFFFFF 20%, #FFFFFF 30%, #DA291C 30%, #DA291C 70%, #FFFFFF 70%, #FFFFFF 80%, #001489 80%, #001489 100%)'
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
                    backgroundColor: 'rgba(218, 41, 28, 0.2)',
                    border: '1px solid rgba(218, 41, 28, 0.45)',
                    color: '#FF8C94',
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
                  <Radio size={13} color="#FF6B6B" />
                  <span>CENTRO DE OPERACIONES DE EMERGENCIA (COE)</span>
                </span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                  COMISIÓN NACIONAL DE EMERGENCIAS (CNE) · LEY N° 8488
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)',
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

              <p style={{ fontSize: '1rem', color: '#CBD5E1', lineHeight: 1.65, margin: 0 }}>
                Coordinación operativa en tiempo real con los Comités Municipales de Emergencia (CME), sistema de marcado directo de auxilio y catálogo georreferenciado de albergues temporales seguros bajo la Ley N° 8488.
              </p>
            </div>

            {/* Protocolo Formal de la CNE según la Alerta Activa */}
            <div
              style={{
                backgroundColor: 'rgba(0, 4, 13, 0.75)',
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
              <p style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.5, margin: 0 }}>
                {alertaActiva.protocolo}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
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
            <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF6B6B', display: 'block', marginBottom: '0.25rem' }}>
              CANALES DE AUXILIO INMEDIATO (24/7)
            </span>
            <h2
              id="seccion-auxilio"
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0,
                fontFamily: 'var(--font-headline, sans-serif)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <PhoneCall size={24} color="#FF6B6B" />
              <span>Botonera Táctil de Auxilio y Despacho Inmediato</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '0.4rem', margin: '0.4rem 0 0 0' }}>
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
                    backgroundColor: 'rgba(0, 15, 45, 0.65)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '18px',
                    padding: 'clamp(1rem, 3vw, 1.5rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 30px rgba(0, 4, 13, 0.75)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.45)';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 20, 60, 0.85)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 15, 45, 0.65)';
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
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icono size={20} color="#FFFFFF" />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#79a6ff', textTransform: 'uppercase', display: 'block' }}>
                            {ent.prioridad}
                          </span>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                            {ent.titulo}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>
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
                      backgroundColor: 'rgba(0, 20, 137, 0.35)',
                      border: '1px solid rgba(121, 166, 255, 0.4)',
                      color: '#FFFFFF',
                      minHeight: '58px',
                      padding: '0.75rem 1rem',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#002B7F';
                      e.currentTarget.style.borderColor = '#79a6ff';
                      e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 20, 137, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.35)';
                      e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.4)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#79a6ff', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Línea Directa Oficial:
                      </span>
                      <strong style={{ fontSize: '1.25rem', color: '#FFFFFF', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                        {ent.numero}
                      </strong>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#DA291C',
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
            <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#34D399', display: 'block', marginBottom: '0.25rem' }}>
              LOGÍSTICA DE RESIDENCIA Y EVACUACIÓN HUMANITARIA
            </span>
            <h2
              id="seccion-albergues"
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0,
                fontFamily: 'var(--font-headline, sans-serif)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <Home size={24} color="#34D399" />
              <span>Red de Albergues Temporales Municipales</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '0.4rem', margin: '0.4rem 0 0 0' }}>
              Catálogo oficial de refugios comunales habilitados por la CNE y los gobiernos locales con trazabilidad de capacidad y servicios sanitarios.
            </p>
          </div>

          {/* Filtros Rápidos de Albergues */}
          <div
            style={{
              backgroundColor: 'rgba(0, 15, 45, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '1.15rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
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
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <select
                value={filtroProvincia}
                onChange={(e) => setFiltroProvincia(e.target.value)}
                aria-label="Filtrar albergues por provincia"
                style={{
                  backgroundColor: '#000814',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.45rem 0.8rem',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
                className="focus:border-red-500 font-bold"
              >
                <option value="todas" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>Todas las Provincias</option>
                <option value="San José" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>San José</option>
                <option value="Alajuela" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>Alajuela</option>
                <option value="Cartago" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>Cartago</option>
                <option value="Heredia" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>Heredia</option>
                <option value="Guanacaste" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>Guanacaste</option>
                <option value="Puntarenas" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>Puntarenas</option>
                <option value="Limón" style={{ backgroundColor: '#000814', color: '#FFFFFF' }}>Limón</option>
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                aria-label="Filtrar albergues por estado"
                style={{
                  backgroundColor: '#000814',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.45rem 0.8rem',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
                className="focus:border-red-500 font-bold"
              >
                <option value="todos" style={{ backgroundColor: '#000814', color: '#FFFFFF', fontWeight: 'bold' }}>
                  ● Todos los Estados
                </option>
                <option value="activo" style={{ backgroundColor: '#000814', color: '#10B981', fontWeight: 'bold' }}>
                  ● Habilitado (Operativo y Activo)
                </option>
                <option value="preparado" style={{ backgroundColor: '#000814', color: '#F59E0B', fontWeight: 'bold' }}>
                  ● Ocupación Alta / Preparación
                </option>
                <option value="en_reserva" style={{ backgroundColor: '#000814', color: '#3B82F6', fontWeight: 'bold' }}>
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
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(0, 15, 45, 0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 40px rgba(0, 4, 13, 0.7)',
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
                color: '#FFFFFF'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'rgba(0, 20, 137, 0.35)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <th style={{ padding: '1rem 1.25rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Albergue & Tipología
                  </th>
                  <th style={{ padding: '1rem 1.25rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Cantón / Distrito
                  </th>
                  <th style={{ padding: '1rem 1rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Aforo & Ocupación
                  </th>
                  <th style={{ padding: '1rem 1.25rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Dotación Sanitaria y Servicios
                  </th>
                  <th style={{ padding: '1rem 1rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Disponibilidad
                  </th>
                  <th style={{ padding: '1rem 1.25rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', textAlign: 'right' }}>
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
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent';
                      }}
                    >
                      {/* Nombre y Tipo */}
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top' }}>
                        <div>
                          <strong style={{ color: '#FFFFFF', fontSize: '0.92rem', display: 'block' }}>
                            {alb.nombre}
                          </strong>
                          <span style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{alb.tipo}</span>
                        </div>
                      </td>

                      {/* Cantón y Distrito */}
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>
                            {alb.canton}, {alb.provincia}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: '#79a6ff' }}>
                            Distrito {alb.distrito}
                          </span>
                        </div>
                      </td>

                      {/* Aforo y Ocupación */}
                      <td style={{ padding: '1.15rem 1rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>
                            {alb.ocupacionActual} / {alb.aforoMaximo} personas
                          </span>
                          <div style={{ width: '110px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', marginTop: '0.4rem', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${porcentaje}%`,
                                height: '100%',
                                backgroundColor: porcentaje > 80 ? '#DA291C' : porcentaje > 50 ? '#FBBF24' : '#34D399',
                                borderRadius: '9999px'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.25rem', display: 'block' }}>
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
                                fontSize: '0.7rem',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#CBD5E1',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
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
                                ? 'rgba(52, 211, 153, 0.15)'
                                : alb.estado === 'preparado'
                                ? 'rgba(251, 191, 36, 0.15)'
                                : 'rgba(148, 163, 184, 0.15)',
                            color:
                              alb.estado === 'activo'
                                ? '#34D399'
                                : alb.estado === 'preparado'
                                ? '#FBBF24'
                                : '#CBD5E1',
                            border: `1px solid ${
                              alb.estado === 'activo'
                                ? 'rgba(52, 211, 153, 0.35)'
                                : alb.estado === 'preparado'
                                ? 'rgba(251, 191, 36, 0.35)'
                                : 'rgba(148, 163, 184, 0.35)'
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
                              backgroundColor: 'rgba(0, 20, 137, 0.35)',
                              border: '1px solid rgba(121, 166, 255, 0.35)',
                              color: '#FFFFFF',
                              padding: '0.42rem 0.8rem',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#002B7F';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.35)';
                            }}
                          >
                            <Navigation size={13} color="#79a6ff" />
                            <span>Waze</span>
                          </a>

                          <a
                            href={gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: 'none',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.14)',
                              color: '#CBD5E1',
                              padding: '0.42rem 0.8rem',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.color = '#CBD5E1';
                            }}
                          >
                            <MapPin size={13} color="#34D399" />
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
