import React, { useState, useEffect, useMemo } from 'react';
import {
  Newspaper,
  MessageSquare,
  MapPin,
  ShoppingBag,
  Compass,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PROVINCIAS_DATA } from '../../data/costaRicaTerritorialData';
import { EscudoEmblematico } from '../ProvincialThemeEngine';
import ProvinciaNoticias from './ProvinciaNoticias';
import ProvinciaForo from './ProvinciaForo';
import ProvinciaMapa from './ProvinciaMapa';
import ProvinciaComercio from './ProvinciaComercio';

/**
 * PROVINCIAS SECTION — MÓDULO TERRITORIAL MODULAR PRE-FOOTER (SRS v2.1)
 * División Territorial de las 7 Provincias de Costa Rica
 * Scaffolding escalable para submódulos: Noticias, Foro, Mapa y Comercio.
 */
export default function ProvinciasSection({ initialProvinciaId = 1 }) {
  // Estado de la provincia seleccionada (por defecto San José o preferencia guardada)
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const guardada = localStorage.getItem('cr_selected_provincia_id');
      const parsed = guardada ? parseInt(guardada, 10) : initialProvinciaId;
      return parsed >= 1 && parsed <= 7 ? parsed : initialProvinciaId;
    } catch {
      return initialProvinciaId;
    }
  });

  // Estado de la pestaña activa dentro del hub provincial
  // 'noticias' | 'foro' | 'mapa' | 'comercio'
  const [activeTab, setActiveTab] = useState('noticias');

  // Obtener el objeto completo de la provincia activa
  const provinciaActual = useMemo(() => {
    return PROVINCIAS_DATA.find((p) => p.id === selectedId) || PROVINCIAS_DATA[0];
  }, [selectedId]);

  // Manejar selección de provincia y persistir preferencia
  const handleSelectProvincia = (id) => {
    setSelectedId(id);
    try {
      localStorage.setItem('cr_selected_provincia_id', id.toString());
      // Notificar al Theming Engine si está activo
      window.dispatchEvent(new CustomEvent('cr_provincia_changed', { detail: { id } }));
    } catch {
      // Ignorar si storage restringido
    }
  };

  const tabsConfig = [
    { id: 'noticias', label: 'Noticias', modulo: 'M01', icon: Newspaper, desc: 'Boletín y Comunicados' },
    { id: 'foro', label: 'Foro Comunal', modulo: 'M04', icon: MessageSquare, desc: 'Cabildo Digital' },
    { id: 'mapa', label: 'Mapa & GIS', modulo: 'M05', icon: MapPin, desc: 'Capas Cantonales' },
    { id: 'comercio', label: 'Comercio & Ferias', modulo: 'M08/10', icon: ShoppingBag, desc: 'PYMES y Ferias' }
  ];

  return (
    <section
      id="exploracion-provincial"
      aria-label="Exploración Territorial de las 7 Provincias de Costa Rica"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: '#000814',
        padding: '5rem 1.5rem 5.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Resplandor ambiental de fondo acorde al color provincial activo */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: `radial-gradient(ellipse at 50% 50%, ${provinciaActual.color}25 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 0.5s ease'
        }}
      />

      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}
      >
        {/* ======================================================================
            1. ENCABEZADO INSTITUCIONAL DE LA SECCIÓN
            ====================================================================== */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
            <span
              className="telemetry-badge"
              style={{
                backgroundColor: 'rgba(0, 43, 127, 0.35)',
                color: '#79A6FF',
                borderColor: 'rgba(121, 166, 255, 0.35)',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              SOBERANÍA TERRITORIAL • 7 PROVINCIAS OFICIALES
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.8vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              color: '#FFFFFF',
              marginBottom: '0.85rem',
              letterSpacing: '-0.02em'
            }}
          >
            Exploración Territorial — Las 7 Provincias de Costa Rica
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.92rem, 1.8vw, 1.05rem)',
              lineHeight: 1.65,
              color: '#94A3B8',
              margin: 0
            }}
          >
            Plataforma descentralizada de gestión cívica: navega entre las regiones históricas de la República, accede a noticias oficiales, foros comunales, cartografía satelital y ferias locales.
          </p>
        </div>

        {/* ======================================================================
            2. SELECTOR INTERACTIVO DE LAS 7 PROVINCIAS (GRID RESPONSIVA)
            ====================================================================== */}
        <div
          role="tablist"
          aria-label="Selector de Provincias de Costa Rica"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
            gap: '0.85rem',
            width: '100%'
          }}
        >
          {PROVINCIAS_DATA.map((prov) => {
            const esActiva = prov.id === selectedId;
            return (
              <button
                key={prov.id}
                role="tab"
                aria-selected={esActiva}
                type="button"
                onClick={() => handleSelectProvincia(prov.id)}
                style={{
                  position: 'relative',
                  backgroundColor: esActiva
                    ? 'rgba(0, 15, 45, 0.95)'
                    : 'rgba(0, 10, 28, 0.65)',
                  border: esActiva
                    ? `2px solid ${prov.colorAcento || prov.color}`
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '1.15rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: esActiva
                    ? `0 10px 30px ${prov.color}45, 0 0 15px ${prov.color}30`
                    : 'none',
                  transform: esActiva ? 'translateY(-3px)' : 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  if (!esActiva) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!esActiva) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 10, 28, 0.65)';
                  }
                }}
              >
                {/* Micro cinta cromática de la provincia en el borde superior */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '15%',
                    right: '15%',
                    height: '3px',
                    borderRadius: '0 0 4px 4px',
                    backgroundColor: prov.color
                  }}
                />

                {/* Escudo Emblemático Vectorial */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    border: `1px solid ${esActiva ? prov.color : 'rgba(255, 255, 255, 0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: esActiva ? `0 0 12px ${prov.color}60` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <EscudoEmblematico id={prov.id} size={28} />
                </div>

                {/* Nombre de la Provincia y Código */}
                <div>
                  <div
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      color: esActiva ? '#38BDF8' : '#64748B',
                      letterSpacing: '0.08em',
                      fontFamily: 'monospace'
                    }}
                  >
                    0{prov.id} • {prov.codigo}
                  </div>
                  <div
                    style={{
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      color: esActiva ? '#FFFFFF' : '#CBD5E1',
                      marginTop: '2px'
                    }}
                  >
                    {prov.nombre}
                  </div>
                </div>

                {/* Chip informativo de cantones */}
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: esActiva
                      ? 'rgba(56, 189, 248, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: esActiva ? '#7DD3FC' : '#94A3B8',
                    border: esActiva
                      ? '1px solid rgba(56, 189, 248, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {prov.cantonesCount} Cantones
                </span>
              </button>
            );
          })}
        </div>

        {/* ======================================================================
            3. VISUALIZADOR DEL ESPACIO PROVINCIAL (HUB ACTIVO DE LA PROVINCIA)
            ====================================================================== */}
        <div
          className="civic-glass-card"
          style={{
            backgroundColor: 'rgba(0, 10, 28, 0.88)',
            border: `1px solid ${provinciaActual.color}50`,
            borderRadius: '1.25rem',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            boxShadow: `0 20px 50px rgba(0, 4, 13, 0.75), 0 0 35px ${provinciaActual.color}25`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Sub-cinta superior con el color de la provincia seleccionada */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: provinciaActual.color,
              boxShadow: `0 0 15px ${provinciaActual.color}`
            }}
          />

          {/* Encabezado del Hub Provincial */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  border: `2px solid ${provinciaActual.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${provinciaActual.color}45`
                }}
              >
                <EscudoEmblematico id={provinciaActual.id} size={42} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: provinciaActual.colorAcento || '#38BDF8',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    PROVINCIA 0{provinciaActual.id} • {provinciaActual.codigo}
                  </span>
                  <span style={{ color: '#475569' }}>•</span>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                    Cabecera: <strong>{provinciaActual.cabecera}</strong>
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 'clamp(1.4rem, 2.8vw, 1.85rem)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    margin: '3px 0 6px 0',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {provinciaActual.nombre}
                </h3>

                <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0, maxWidth: '620px', lineHeight: 1.5 }}>
                  {provinciaActual.lema} — {provinciaActual.descripcion}
                </p>
              </div>
            </div>

            {/* Ficha rápida de telemetría territorial */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
                  Población
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {provinciaActual.poblacion}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
                  Superficie
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {provinciaActual.superficie}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
                  Obras Activas
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#38BDF8' }}>
                  {provinciaActual.obrasActivas}
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================================
              4. BARRA DE NAVEGACIÓN INTERNA (TABS PROVINCIALES: NOTICIAS, FORO, MAPA, COMERCIO)
              ====================================================================== */}
          <div
            style={{
              display: 'flex',
              gap: '0.65rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {tabsConfig.map((tab) => {
              const Icono = tab.icon;
              const activo = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '10px',
                    border: activo
                      ? `1px solid ${provinciaActual.colorAcento || '#38BDF8'}`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: activo
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: activo ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    position: 'relative'
                  }}
                >
                  <Icono size={17} color={activo ? (provinciaActual.colorAcento || '#38BDF8') : '#94A3B8'} />
                  <div>
                    <span style={{ display: 'block', lineHeight: 1.2 }}>{tab.label}</span>
                    <span style={{ fontSize: '0.66rem', fontWeight: 600, color: '#64748B', display: 'block' }}>
                      {tab.modulo} • {tab.desc}
                    </span>
                  </div>

                  {activo && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-9px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '24px',
                        height: '3px',
                        borderRadius: '2px',
                        backgroundColor: provinciaActual.colorAcento || '#38BDF8'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ======================================================================
              5. CONTENIDO MODULAR SEGÚN LA PESTAÑA ACTIVA (SCAFFOLDING EXPANDIBLE)
              ====================================================================== */}
          <div style={{ minHeight: '340px' }}>
            {activeTab === 'noticias' && <ProvinciaNoticias provincia={provinciaActual} />}
            {activeTab === 'foro' && <ProvinciaForo provincia={provinciaActual} />}
            {activeTab === 'mapa' && <ProvinciaMapa provincia={provinciaActual} />}
            {activeTab === 'comercio' && <ProvinciaComercio provincia={provinciaActual} />}
          </div>
        </div>
      </div>
    </section>
  );
}
