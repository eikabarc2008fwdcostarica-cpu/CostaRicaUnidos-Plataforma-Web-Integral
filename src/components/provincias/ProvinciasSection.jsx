import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  MapPin,
  Compass,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PROVINCIAS_DATA, getProvincialTextColor } from '../../data/costaRicaTerritorialData';
import { useTheme } from '../../context/ThemeContext';
import { EscudoEmblematico } from '../ProvincialThemeEngine';
import ProvinciaHistoria from './ProvinciaHistoria';
import ProvinciaCuriosidades from './ProvinciaCuriosidades';
import ProvinciaPersonajes from './ProvinciaPersonajes';

/**
 * PROVINCIAS SECTION — MÓDULO HISTÓRICO Y CULTURAL PROVINCIAL (v3.0)
 * División Territorial de las 7 Provincias de Costa Rica
 * Pestañas verificadas: Historia, Datos Curiosos y Personajes Ilustres
 */
export default function ProvinciasSection({ initialProvinciaId = 1 }) {
  const { theme, isDark } = useTheme();
  const isLight = theme === 'light' && !isDark;

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

  // Estado de la pestaña activa dentro del hub provincial (por defecto Historia)
  // 'historia' | 'datosCuriosos' | 'personajes'
  const [activeTab, setActiveTab] = useState('historia');

  // Obtener el objeto completo de la provincia activa
  const provinciaActual = useMemo(() => {
    return PROVINCIAS_DATA.find((p) => p.id === selectedId) || PROVINCIAS_DATA[0];
  }, [selectedId]);

  const provColorText = getProvincialTextColor(provinciaActual, isLight);

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
    { id: 'historia', label: 'Historia', modulo: 'Cronología', icon: BookOpen, desc: 'Hitos & Formación Territorial' },
    { id: 'datosCuriosos', label: 'Datos Curiosos', modulo: 'Identidad', icon: Sparkles, desc: 'Particularidades & Récords' },
    { id: 'personajes', label: 'Personajes Ilustres', modulo: 'Biografías', icon: Award, desc: 'Forjadores de la Patria' }
  ];

  return (
    <section
      id="exploracion-provincial"
      aria-label="Exploración Territorial de las 7 Provincias de Costa Rica"
      style={{
        borderTop: '1px solid var(--cru-border)',
        backgroundColor: 'var(--cru-page-bg, var(--theme-bg))',
        padding: '5rem 1.5rem 5.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Resplandor ambiental de fondo acorde al color provincial activo (casi imperceptible en modo claro) */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: `radial-gradient(ellipse at 50% 50%, ${provinciaActual.color}25 0%, transparent 70%)`,
          opacity: isLight ? 0.03 : 0.25,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'all 0.5s ease'
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
                backgroundColor: 'var(--cru-accent-blue-bg)',
                color: 'var(--cru-accent-blue)',
                border: '1px solid var(--cru-accent-blue-border)',
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
              color: 'var(--cru-text)',
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
              color: 'var(--cru-text-soft)',
              margin: 0
            }}
          >
            Plataforma cívica soberana: explora la historia verificada, particularidades culturales, patrimonio y forjadores ilustres de las 7 provincias de la República de Costa Rica.
          </p>
        </div>

        {/* ======================================================================
            2. SELECTOR INTERACTIVO DE LAS 7 PROVINCIAS (GRID RESPONSIVA SIN LIMÓN HUÉRFANO)
            ====================================================================== */}
        <div
          role="tablist"
          aria-label="Selector de Provincias de Costa Rica"
          className="provincias-selector-grid"
        >
          {PROVINCIAS_DATA.map((prov) => {
            const esActiva = prov.id === selectedId;
            const provBtnColor = getProvincialTextColor(prov, isLight);
            const activeBorderColor = isLight ? provBtnColor : (prov.colorAcento || prov.color);

            return (
              <button
                key={prov.id}
                role="tab"
                aria-selected={esActiva}
                aria-label={`Provincia de ${prov.nombre}: ${prov.cantonesCount} cantones`}
                type="button"
                onClick={() => handleSelectProvincia(prov.id)}
                style={{
                  position: 'relative',
                  backgroundColor: esActiva
                    ? 'var(--cru-card-bg)'
                    : 'var(--cru-surface-muted)',
                  border: esActiva
                    ? `2px solid ${activeBorderColor}`
                    : '1px solid var(--cru-border)',
                  borderRadius: '16px',
                  padding: '1.35rem 0.85rem',
                  minHeight: '105px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: esActiva
                    ? (isLight
                        ? `0 8px 24px rgba(0, 42, 119, 0.12), 0 0 12px ${prov.color}25`
                        : `0 10px 30px ${prov.color}45, 0 0 15px ${prov.color}30`)
                    : 'none',
                  transform: esActiva ? 'translateY(-3px)' : 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  if (!esActiva) {
                    e.currentTarget.style.borderColor = 'var(--cru-border-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.backgroundColor = 'var(--cru-surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!esActiva) {
                    e.currentTarget.style.borderColor = 'var(--cru-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'var(--cru-surface-muted)';
                  }
                }}
              >
                {/* Micro cinta cromática de la provincia en el borde superior */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '12%',
                    right: '12%',
                    height: '4px',
                    borderRadius: '0 0 4px 4px',
                    backgroundColor: prov.color,
                    boxShadow: esActiva ? `0 0 8px ${prov.color}` : 'none'
                  }}
                />

                {/* Nombre de la Provincia (Protagonista y equilibrado) */}
                <div
                  style={{
                    fontSize: '1.08rem',
                    fontWeight: 800,
                    color: esActiva ? 'var(--cru-text)' : 'var(--cru-text-soft)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2
                  }}
                >
                  {prov.nombre}
                </div>

                {/* Chip informativo de cantones */}
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--cru-chip-bg)',
                    color: esActiva ? activeBorderColor : 'var(--cru-chip-text)',
                    border: esActiva
                      ? `1px solid ${activeBorderColor}`
                      : '1px solid var(--cru-chip-border)',
                    transition: 'all 0.2s ease'
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
            backgroundColor: 'var(--cru-card-bg)',
            border: `1px solid ${isLight ? 'var(--cru-border)' : provinciaActual.color + '50'}`,
            borderRadius: '1.25rem',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            boxShadow: 'var(--cru-card-shadow-hover)',
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
              borderBottom: '1px solid var(--cru-border)',
              paddingBottom: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--cru-surface-muted)',
                  border: `2px solid ${provinciaActual.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${provinciaActual.color}35`
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
                      color: provColorText,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    PROVINCIA 0{provinciaActual.id} • {provinciaActual.codigo}
                  </span>
                  <span style={{ color: 'var(--cru-text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--cru-text-soft)' }}>
                    Cabecera: <strong>{provinciaActual.cabecera}</strong>
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 'clamp(1.4rem, 2.8vw, 1.85rem)',
                    fontWeight: 900,
                    color: 'var(--cru-text)',
                    margin: '3px 0 6px 0',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {provinciaActual.nombre}
                </h3>

                <p style={{ color: 'var(--cru-text-soft)', fontSize: '0.88rem', margin: 0, maxWidth: '620px', lineHeight: 1.5 }}>
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
                  backgroundColor: 'var(--cru-surface-muted)',
                  border: '1px solid var(--cru-border)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', color: 'var(--cru-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                  Población
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--cru-text)' }}>
                  {provinciaActual.poblacion}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--cru-surface-muted)',
                  border: '1px solid var(--cru-border)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', color: 'var(--cru-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                  Superficie
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--cru-text)' }}>
                  {provinciaActual.superficie}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--cru-surface-muted)',
                  border: '1px solid var(--cru-border)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', color: 'var(--cru-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                  Distritos Oficiales
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: provColorText }}>
                  {provinciaActual.distritosCount} distritos
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================================
              4. BARRA DE NAVEGACIÓN INTERNA (TABS PROVINCIALES: HISTORIA, DATOS CURIOSOS, PERSONAJES)
              ====================================================================== */}
          <div
            role="tablist"
            aria-label="Pestañas de Exploración Histórica y Cultural Provincial"
            style={{
              display: 'flex',
              gap: '0.65rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--cru-border)'
            }}
          >
            {tabsConfig.map((tab) => {
              const Icono = tab.icon;
              const activo = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={activo}
                  aria-controls={`panel-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '10px',
                    border: activo
                      ? '1px solid var(--cru-tab-active-border)'
                      : '1px solid var(--cru-border)',
                    backgroundColor: activo
                      ? 'var(--cru-tab-active-bg)'
                      : 'var(--cru-tab-inactive-bg)',
                    color: activo ? 'var(--cru-text)' : 'var(--cru-text-soft)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    position: 'relative'
                  }}
                >
                  <Icono size={17} color={activo ? provColorText : 'var(--cru-text-muted)'} />
                  <div>
                    <span style={{ display: 'block', lineHeight: 1.2 }}>{tab.label}</span>
                    <span style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--cru-text-muted)', display: 'block' }}>
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
                        backgroundColor: provColorText
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ======================================================================
              5. CONTENIDO MODULAR SEGÚN LA PESTAÑA ACTIVA (HISTORIA, CURIOSIDADES, PERSONAJES)
              ====================================================================== */}
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            style={{ minHeight: '340px' }}
          >
            {activeTab === 'historia' && <ProvinciaHistoria provincia={provinciaActual} />}
            {activeTab === 'datosCuriosos' && <ProvinciaCuriosidades provincia={provinciaActual} />}
            {activeTab === 'personajes' && <ProvinciaPersonajes provincia={provinciaActual} />}
          </div>
        </div>
      </div>
    </section>
  );
}
