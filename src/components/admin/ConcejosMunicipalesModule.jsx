/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO DE GOBIERNOS LOCALES Y CONCEJOS MUNICIPALES
 * Arquitectura: Sovereign Civic Glass v2.1
 * Normativa: Artículos 169-175 Constitución Política · Código Municipal (Ley N° 7794)
 * Elecciones Municipales 2024-2028 · Datos Abiertos Territoriales
 * ============================================================================
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Landmark,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Calendar,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  ChevronRight,
  MapPin,
  Building2,
  Award,
  Copy,
  Check,
  Search,
  Scale,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../../data/costaRicaTerritorialData';
import { GOBIERNOS_LOCALES_DB, getGobiernoCantonalCompleto } from '../../data/gobiernosLocalesCR';

export default function ConcejosMunicipalesModule({
  provincia = null,
  activeCanton = null,
  canton = null,
  onNavigateModule = null
}) {
  const { user } = useAuth();

  // 1. Resolver provincia asignada en sesión o por prop con defensa ante undefined
  const provinciaObj = useMemo(() => {
    const raw =
      provincia ||
      user?.provincia ||
      user?.provinciaNombre ||
      user?.provinciaId ||
      'Puntarenas';
    const rawVal = typeof raw === 'object' && raw !== null ? raw.nombre || raw.id : raw;
    const str = String(rawVal || 'Puntarenas').toLowerCase().trim();

    return (
      PROVINCIAS_DATA.find(
        (p) =>
          p.nombre.toLowerCase() === str ||
          String(p.id) === str ||
          p.codigo.toLowerCase() === str
      ) || PROVINCIAS_DATA[0] // Default: San José (id: 1)
    );
  }, [provincia, user]);

  // 2. Cantones oficiales de la provincia en sesión
  const cantones = useMemo(() => {
    const lista = CANTONES_OFICIALES.filter((c) => c.provinciaId === provinciaObj.id);
    if (lista.length > 0) return lista;
    return CANTONES_OFICIALES.filter((c) => c.provinciaId === 1); // Fallback garantizado San José
  }, [provinciaObj.id]);

  // 3. Selección reactiva con persistencia en sesión y detección del cantón activo
  const [selectedCanton, setSelectedCanton] = useState(() => {
    try {
      const target = activeCanton || canton || localStorage.getItem('cr_canton_activo');
      if (target && cantones.some((c) => c.nombre.toLowerCase() === target.toLowerCase())) {
        return target;
      }
    } catch {
      // ignore
    }
    return cantones[0]?.nombre || 'Puntarenas';
  });

  // Reajustar cantón si viene por prop activo
  useEffect(() => {
    const target = activeCanton || canton;
    if (target && cantones.some((c) => c.nombre.toLowerCase() === target.toLowerCase()) && selectedCanton.toLowerCase() !== target.toLowerCase()) {
      setSelectedCanton(target);
    }
  }, [activeCanton, canton, cantones, selectedCanton]);

  // Reajustar cantón seleccionado si cambia la lista de cantones
  useEffect(() => {
    if (cantones.length > 0 && !cantones.some((c) => c.nombre.toLowerCase() === (selectedCanton || '').toLowerCase())) {
      setSelectedCanton(cantones[0]?.nombre || 'Puntarenas');
    }
  }, [cantones, selectedCanton]);

  // Sincronización reactiva bidireccional con eventos cantonChanged externos
  useEffect(() => {
    const handleCantonChange = (e) => {
      const nombre = e.detail?.nombre;
      if (nombre && cantones.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        setSelectedCanton(nombre);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, [cantones]);

  // 4. Cantón activo resuelto
  const cantonItem = useMemo(() => {
    return (
      cantones.find((c) => c.nombre.toLowerCase() === (selectedCanton || '').toLowerCase()) ||
      cantones[0] || {
        id: 1,
        provinciaId: provinciaObj.id,
        nombre: 'Puntarenas',
        codigoDta: '601',
        cabecera: 'Puntarenas'
      }
    );
  }, [cantones, selectedCanton, provinciaObj]);

  // 5. Ficha técnica institucional estructurada del cantón (inmediata en el DOM)
  const fichaTecnica = useMemo(() => {
    return (
      getGobiernoCantonalCompleto(cantonItem, provinciaObj) ||
      GOBIERNOS_LOCALES_DB['601']
    );
  }, [cantonItem, provinciaObj]);

  // Estado para copiar la cédula jurídica en el portapapeles
  const [copiadoCedula, setCopiadoCedula] = useState(false);
  const handleCopiarCedula = () => {
    if (fichaTecnica?.cedulaJuridica) {
      navigator.clipboard.writeText(fichaTecnica.cedulaJuridica);
      setCopiadoCedula(true);
      setTimeout(() => setCopiadoCedula(false), 2000);
    }
  };

  // Filtro de búsqueda rápida en el selector de cantones
  const [busquedaCanton, setBusquedaCanton] = useState('');
  const cantonesFiltrados = useMemo(() => {
    if (!busquedaCanton.trim()) return cantones;
    const q = busquedaCanton.toLowerCase();
    return cantones.filter((c) => c.nombre.toLowerCase().includes(q) || c.codigoDta.includes(q));
  }, [cantones, busquedaCanton]);

  // Ref y controlador de navegación suave horizontal del carrusel de cantones
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Sincronización inmediata del cantón seleccionado
  const handleSelectCanton = (c) => {
    setSelectedCanton(c.nombre);
    try {
      localStorage.setItem('cr_canton_activo', c.nombre);
    } catch {
      // ignore
    }
    // Notificar en tiempo real a la consola territorial y al widget de voz (Gemini 3.8 Flash)
    window.dispatchEvent(
      new CustomEvent('cantonChanged', {
        detail: {
          nombre: c.nombre,
          id: c.id,
          provinciaId: c.provinciaId,
          codigoDta: c.codigoDta,
          cabecera: c.cabecera
        }
      })
    );
  };

  return (
    <div
      id="modulo-concejos-municipales"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        animation: 'fadeInModule 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <style>{`
        @keyframes fadeInModule {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cantones-carousel-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          gap: 8px;
        }
        .cantones-carousel-track {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
          flex: 1;
          min-width: 0;
          padding: 4px 2px;
        }
        .cantones-carousel-track::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .cantones-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 50%;
          background: rgba(5, 12, 28, 0.70);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #CBD5E1;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          flex-shrink: 0;
          padding: 0;
        }
        .cantones-nav-btn:hover {
          background: rgba(56, 189, 248, 0.16);
          border-color: rgba(56, 189, 248, 0.45);
          color: #38BDF8;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
          transform: scale(1.06);
        }
        .cantones-nav-btn:active {
          transform: scale(0.96);
        }
      `}</style>

      {/* =================================================================== */}
      {/* 1. SELECTOR DINÁMICO DE CANTONES SEGÚN LA PROVINCIA EN SESIÓN       */}
      {/* =================================================================== */}
      <section
        style={{
          backgroundColor: 'rgba(5, 12, 28, 0.70)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 4, 13, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Iluminación sutil de borde basada en el color de la provincia */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, transparent 0%, var(--province-primary, var(--prov-primary, #1E88E5)) 50%, transparent 100%)`,
            boxShadow: `0 0 12px var(--province-primary, var(--prov-primary, #1E88E5))`
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}
              >
                PROVINCIA DE {provinciaObj.nombre.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                {cantones.length} Cantones Oficiales
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Mistical Spring', Georgia, serif",
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0
              }}
            >
              Selector Territorial Cantonal
            </h2>
          </div>

          {/* Campo de búsqueda rápida */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(0, 4, 13, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0.4rem 0.85rem',
              minWidth: '240px'
            }}
          >
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Buscar cantón o código..."
              value={busquedaCanton}
              onChange={(e) => setBusquedaCanton(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                width: '100%',
                fontFamily: "'Paloseco', 'Plus Jakarta Sans', system-ui, sans-serif"
              }}
            />
          </div>
        </div>

        {/* Carrusel interactivo de cantones con navegación suave en vidrio */}
        <div className="cantones-carousel-wrapper">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="cantones-nav-btn cantones-nav-prev"
            aria-label="Desplazar cantones hacia la izquierda"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div ref={scrollRef} className="cantones-carousel-track">
            {cantonesFiltrados.map((c) => {
              const isSelected = c.nombre.toLowerCase() === (selectedCanton || '').toLowerCase();
              return (
                <button
                  key={`${c.provinciaId}-${c.id}-${c.codigoDta}`}
                  type="button"
                  onClick={() => handleSelectCanton(c)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    border: isSelected
                      ? `1px solid var(--province-primary, var(--prov-primary, #38BDF8))`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected
                      ? 'rgba(56, 189, 248, 0.18)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#FFFFFF' : '#CBD5E1',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected
                      ? `0 0 16px var(--province-primary, var(--prov-primary, rgba(56, 189, 248, 0.3)))`
                      : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    flexShrink: 0
                  }}
                >
                  <Compass size={14} color={isSelected ? '#38BDF8' : '#94A3B8'} />
                  <span>{c.nombre}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      color: isSelected ? '#38BDF8' : '#64748B'
                    }}
                  >
                    {c.codigoDta}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            className="cantones-nav-btn cantones-nav-next"
            aria-label="Desplazar cantones hacia la derecha"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. FICHA TÉCNICA INSTITUCIONAL DEL CANTÓN SELECCIONADO              */}
      {/* =================================================================== */}
      <section
        style={{
          backgroundColor: 'rgba(5, 12, 28, 0.70)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 4, 13, 0.8)'
        }}
      >
        {/* Encabezado Cantonal: Escudo Oficial, Nombre, Cabecera, Población y Superficie */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.75rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.35rem', maxWidth: '880px' }}>
            {/* Escudo / Emblema oficial */}
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '18px',
                backgroundColor: 'rgba(5, 12, 28, 0.9)',
                border: `1.5px solid var(--province-primary, var(--prov-primary, #38BDF8))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px var(--province-primary, var(--prov-primary, rgba(56, 189, 248, 0.35)))`,
                flexShrink: 0
              }}
            >
              <Landmark size={36} color="var(--province-primary, var(--prov-primary, #38BDF8))" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#10B981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  GOBIERNO LOCAL AUTÓNOMO
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                  CANTÓN OFICIAL • CÓDIGO MUNICIPAL LEY N° 7794
                </span>
              </div>

              {/* Nombre del Cantón en Mistical Spring */}
              <h1
                style={{
                  fontFamily: "'Mistical Spring', Georgia, serif",
                  fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: '0 0 0.55rem 0',
                  lineHeight: 1.15
                }}
              >
                Gobierno Local y Concejo Municipal de {fichaTecnica.canton}
              </h1>

              {/* Metadatos demográficos en JetBrains Mono y Paloseco */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  fontSize: '0.86rem',
                  color: '#CBD5E1'
                }}
              >
                <div>
                  <span style={{ color: '#64748B' }}>Cabecera: </span>
                  <strong style={{ color: '#F8FAFC' }}>{fichaTecnica.cabecera}</strong>
                </div>
                <span style={{ color: '#475569' }}>•</span>
                <div>
                  <span style={{ color: '#64748B' }}>Población estimada: </span>
                  <strong style={{ color: '#38BDF8', fontFamily: "'JetBrains Mono', monospace" }}>
                    {fichaTecnica.poblacion}
                  </strong>
                </div>
                <span style={{ color: '#475569' }}>•</span>
                <div>
                  <span style={{ color: '#64748B' }}>Superficie territorial: </span>
                  <strong style={{ color: '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                    {fichaTecnica.superficie}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sello Normativo Constitucional */}
          <div
            style={{
              backgroundColor: 'rgba(0, 4, 13, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.1rem 1.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem',
              fontSize: '0.78rem',
              minWidth: '250px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#E2E8F0' }}>
              <ShieldCheck size={16} color="#34D399" />
              <span>Autonomía Municipal (Art. 170 Const.)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#E2E8F0' }}>
              <CheckCircle2 size={16} color="#38BDF8" />
              <span>Fiscalización Periódica CGR</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#E2E8F0' }}>
              <FileCheck size={16} color="#FBBF24" />
              <span>Firma Digital Oficial Ley N° 8454</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BLOQUE A — ALCALDÍA MUNICIPAL (PERIODO 2024 - 2028)               */}
        {/* ================================================================= */}
        <div style={{ marginTop: '2.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Award size={18} color="#38BDF8" />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: '#38BDF8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'block'
                  }}
                >
                  PODER EJECUTIVO MUNICIPAL
                </span>
                <h3
                  style={{
                    fontFamily: "'Mistical Spring', Georgia, serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: 0
                  }}
                >
                  Bloque A — Alcaldía Municipal
                </h3>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#94A3B8',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              Periodo Constitucional: 2024 - 2028
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(5, 12, 28, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem',
              boxShadow: '0 10px 30px rgba(0, 4, 13, 0.6)'
            }}
          >
            {/* Titular de Alcaldía */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 4, 13, 0.8), 0 0 16px rgba(56, 189, 248, 0.25)',
                  flexShrink: 0,
                  backgroundColor: 'rgba(0, 4, 13, 0.8)'
                }}
              >
                <img
                  src={fichaTecnica.alcaldia.foto}
                  alt={fichaTecnica.alcaldia.alcalde}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: '#38BDF8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    display: 'inline-block',
                    marginBottom: '0.35rem'
                  }}
                >
                  ALCALDE / ALCALDESA TITULAR
                </span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {fichaTecnica.alcaldia.alcalde}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                  {fichaTecnica.alcaldia.partido}
                </div>

                <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                    <Mail size={14} color="#38BDF8" />
                    <span>{fichaTecnica.alcaldia.correo}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                    <Building2 size={14} color="#FBBF24" />
                    <span>{fichaTecnica.alcaldia.despacho}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vicealcaldías Constitucionales */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: "'JetBrains Mono', monospace", color: '#94A3B8', textTransform: 'uppercase' }}>
                  Vicealcaldía Primera (2024-2028):
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.15rem' }}>
                  {fichaTecnica.alcaldia.vicealcaldesa1}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Gestión Territorial y Servicios Comunales</div>
              </div>

              {fichaTecnica.alcaldia.vicealcalde2 && (
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: "'JetBrains Mono', monospace", color: '#94A3B8', textTransform: 'uppercase' }}>
                    Vicealcaldía Segunda (2024-2028):
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.15rem' }}>
                    {fichaTecnica.alcaldia.vicealcalde2}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Desarrollo Social y Programas Comunitarios</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BLOQUE B — DIRECTORIO Y CONCEJO MUNICIPAL                         */}
        {/* ================================================================= */}
        <div style={{ marginTop: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(251, 191, 36, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users size={18} color="#FBBF24" />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: '#FBBF24',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'block'
                  }}
                >
                  CUERPO DELIBERATIVO Y REPRESENTACIÓN CANTONAL
                </span>
                <h3
                  style={{
                    fontFamily: "'Mistical Spring', Georgia, serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: 0
                  }}
                >
                  Bloque B — Directorio y Concejo Municipal
                </h3>
              </div>
            </div>

            {/* Horario y días de Sesión Ordinaria */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                padding: '0.35rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                color: '#FDE68A'
              }}
            >
              <Clock size={14} color="#FBBF24" />
              <span>
                Sesión Ordinaria: <strong>{fichaTecnica.horarioSesion}</strong>
              </span>
            </div>
          </div>

          {/* Directorio del Concejo */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem'
            }}
          >
            {/* Presidencia */}
            <div
              style={{
                backgroundColor: 'rgba(5, 12, 28, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: '0 8px 24px rgba(0, 4, 13, 0.5)'
              }}
            >
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#FBBF24',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.3rem'
                }}
              >
                PRESIDENCIA DEL CONCEJO (2024-2026)
              </span>
              <h5 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {fichaTecnica.directorioConcejo.presidente}
              </h5>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                Fracción Política: <strong style={{ color: '#CBD5E1' }}>{fichaTecnica.directorioConcejo.partidoPresidencia}</strong>
              </div>
            </div>

            {/* Vicepresidencia */}
            <div
              style={{
                backgroundColor: 'rgba(5, 12, 28, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: '0 8px 24px rgba(0, 4, 13, 0.5)'
              }}
            >
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#38BDF8',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.3rem'
                }}
              >
                VICEPRESIDENCIA DEL CONCEJO (2024-2026)
              </span>
              <h5 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {fichaTecnica.directorioConcejo.vicepresidenta}
              </h5>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                Fracción Política: <strong style={{ color: '#CBD5E1' }}>{fichaTecnica.directorioConcejo.partidoVicepresidencia}</strong>
              </div>
            </div>
          </div>

          {/* Cuadrícula de Regidurías (Propietarios y Suplentes con Fracción) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.74rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: '#94A3B8',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}
            >
              Lista de Regidores Propietarios y Suplentes ({fichaTecnica.regidurias.length} Curules):
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}
            >
              {fichaTecnica.regidurias.map((reg, idx) => (
                <div
                  key={`${reg.propietario}-${idx}`}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.65rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
                        Curul N° {idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(56, 189, 248, 0.1)',
                          color: '#38BDF8',
                          border: '1px solid rgba(56, 189, 248, 0.25)'
                        }}
                      >
                        {reg.fraccion}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {reg.propietario}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Regidor(a) Propietario(a)</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem', fontSize: '0.76rem', color: '#CBD5E1' }}>
                    <span style={{ color: '#64748B' }}>Suplente: </span>
                    <span>{reg.suplente}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Síndicos Propietarios por Distrito */}
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: '#94A3B8',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}
            >
              Síndicos Propietarios por cada Distrito ({fichaTecnica.sindicos.length} Distritos Oficiales):
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.75rem'
              }}
            >
              {fichaTecnica.sindicos.map((sind, idx) => (
                <div
                  key={`${sind.distrito}-${idx}`}
                  style={{
                    backgroundColor: 'rgba(0, 4, 13, 0.55)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    <MapPin size={13} />
                    <span>{sind.distrito}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#F8FAFC', fontWeight: 600 }}>
                    {sind.sindico}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Síndico(a) Distrital Propietario</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BLOQUE C — DATOS DE CONTACTO Y TRANSPARENCIA LOCAL                 */}
        {/* ================================================================= */}
        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Scale size={18} color="#10B981" />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: '#10B981',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'block'
                  }}
                >
                  FISCALIZACIÓN CIUDADANA Y RENDICIÓN DE CUENTAS
                </span>
                <h3
                  style={{
                    fontFamily: "'Mistical Spring', Georgia, serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: 0
                  }}
                >
                  Bloque C — Datos de Contacto y Transparencia Local
                </h3>
              </div>
            </div>

            {/* Enlace oficial al portal de transparencia / presupuesto */}
            <a
              href={fichaTecnica.transparenciaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34D399',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Portal de Transparencia y Presupuesto Liquidado</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* Cédula Jurídica del Gobierno Local */}
            <div
              style={{
                backgroundColor: 'rgba(5, 12, 28, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  CÉDULA JURÍDICA MUNICIPAL:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38BDF8', fontFamily: "'JetBrains Mono', monospace" }}>
                    {fichaTecnica.cedulaJuridica}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopiarCedula}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiadoCedula ? '#10B981' : '#94A3B8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Copiar cédula jurídica"
                  >
                    {copiadoCedula ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.4rem' }}>
                Personería jurídica estatal autónoma
              </span>
            </div>

            {/* Teléfono Central del Palacio Municipal */}
            <div
              style={{
                backgroundColor: 'rgba(5, 12, 28, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  CENTRAL TELEFÓNICA PALACIO MUNICIPAL:
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  {fichaTecnica.telefonoCentral}
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.4rem' }}>
                Lunes a Viernes de 07:30 a 16:00 hrs
              </span>
            </div>

            {/* Presupuesto Municipal Aprobado */}
            <div
              style={{
                backgroundColor: 'rgba(5, 12, 28, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  PRESUPUESTO APROBADO 2026:
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  {fichaTecnica.presupuestoAprobado}
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.4rem' }}>
                Aprobado por Contraloría General (CGR)
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ACCESOS DIRECTOS A MÓDULOS DE GOBERNANZA                          */}
        {/* ================================================================= */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem'
          }}
        >
          <div
            onClick={() => onNavigateModule && onNavigateModule('gaceta')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                GACETA MUNICIPAL
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.15rem' }}>
                Ver Actas y Acuerdos
              </div>
            </div>
            <ChevronRight size={18} color="#38BDF8" />
          </div>

          <div
            onClick={() => onNavigateModule && onNavigateModule('organigrama')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                ESTRUCTURA ORGÁNICA
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.15rem' }}>
                Ver Organigrama
              </div>
            </div>
            <ChevronRight size={18} color="#38BDF8" />
          </div>

          <div
            onClick={() => onNavigateModule && onNavigateModule('audiencia')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                PARTICIPACIÓN CÍVICA
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.15rem' }}>
                Solicitar Audiencia Formal
              </div>
            </div>
            <ChevronRight size={18} color="#38BDF8" />
          </div>
        </div>
      </section>
    </div>
  );
}
