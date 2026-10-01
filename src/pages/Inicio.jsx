import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  FileText,
  Vote,
  ClipboardEdit,
  Trophy,
  ShieldCheck,
  Building2,
  MapPin,
  Compass,
  GraduationCap,
  Store,
  Music,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { CANTONES_OFICIALES } from '../data/costaRicaTerritorialData';

/**
 * INICIO — Portal Oficial de Gobierno Local y Servicios Ciudadanos
 * Sistema Sovereign Civic Glass v2.1 • Sede Digital Oficial de la República de Costa Rica
 * Fondo: Cordillera Soberana Costarricense • Sin elementos de videojuegos ni castillos medievales
 */
export default function Inicio() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCantonName, setActiveCantonName] = useState(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  // Escuchar cambios de cantón desde el Navbar
  useEffect(() => {
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) {
        setActiveCantonName(e.detail.nombre);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  // Sugerencias de trámites, actas y servicios municipales oficiales
  const sugerenciasOficiales = [
    {
      categoria: 'Trámites & Hacienda',
      items: [
        { label: 'Validación de Cédula y Situación Tributaria (ATV)', path: '/dashboard' },
        { label: 'Consulta de Patentes Comerciales y Pago Municipal', path: '/dashboard' },
        { label: 'Declaración de Bienes Inmuebles y Tasas', path: '/dashboard' }
      ]
    },
    {
      categoria: 'Concejo & Actas',
      items: [
        { label: 'Visor Oficial de Actas Municipales en PDF', path: '/gobernanza' },
        { label: 'Directorio de Alcaldía, Regidores y Síndicos', path: '/gobernanza' },
        { label: 'Presupuesto Participativo y Votación Ciudadana', path: '/participacion' }
      ]
    },
    {
      categoria: 'Obras & Fiscalización',
      items: [
        { label: 'Reportar hueco vial o bacheo prioritario', path: '/reportar-incidencia' },
        { label: 'Reporte de alumbrado público o luminaria dañada', path: '/reportar-incidencia' },
        { label: 'Fiscalización comunal de contratos MOPT/SICOP', path: '/dashboard' }
      ]
    },
    {
      categoria: 'Desarrollo & CCDR',
      items: [
        { label: 'Comité Cantonal de Deportes (CCDR) e Instalaciones', path: '/deportes' },
        { label: 'Calendario y Rutas de la Feria del Agricultor', path: '/comercio' },
        { label: 'Directorio de PYMES Locales Verificadas', path: '/comercio' }
      ]
    },
    {
      categoria: 'Territorio & Seguridad',
      items: [
        { label: 'Visor Cartográfico 3D y Relieve Nacional', path: '/mapa-gis' },
        { label: 'Centro de Auxilio 911 y Albergues CNE', path: '/seguridad-emergencias' }
      ]
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const queryLower = searchQuery.toLowerCase();
    if (queryLower.includes('tramit') || queryLower.includes('cedula') || queryLower.includes('hacienda') || queryLower.includes('patente') || queryLower.includes('tributo')) {
      navigate('/dashboard');
    } else if (queryLower.includes('acta') || queryLower.includes('concejo') || queryLower.includes('alcald') || queryLower.includes('regidor') || queryLower.includes('gobernan')) {
      navigate('/gobernanza');
    } else if (queryLower.includes('voto') || queryLower.includes('presupuesto') || queryLower.includes('participa')) {
      navigate('/participacion');
    } else if (queryLower.includes('report') || queryLower.includes('hueco') || queryLower.includes('averia') || queryLower.includes('calle') || queryLower.includes('luminaria')) {
      navigate('/reportar-incidencia');
    } else if (queryLower.includes('deport') || queryLower.includes('ccdr') || queryLower.includes('cancha')) {
      navigate('/deportes');
    } else if (queryLower.includes('comercio') || queryLower.includes('feria') || queryLower.includes('agricultor') || queryLower.includes('pyme')) {
      navigate('/comercio');
    } else if (queryLower.includes('mapa') || queryLower.includes('gis') || queryLower.includes('relieve') || queryLower.includes('cartograf')) {
      navigate('/mapa-gis');
    } else if (queryLower.includes('emergen') || queryLower.includes('sos') || queryLower.includes('911') || queryLower.includes('albergue')) {
      navigate('/seguridad-emergencias');
    } else if (queryLower.includes('cultur') || queryLower.includes('himno') || queryLower.includes('patrimonio')) {
      navigate('/cultura');
    } else if (queryLower.includes('educa') || queryLower.includes('ctp') || queryLower.includes('colegio')) {
      navigate('/educacion');
    } else if (queryLower.includes('turism') || queryLower.includes('ruta') || queryLower.includes('7600')) {
      navigate('/turismo');
    } else {
      // Buscar si coincide con alguno de los 84 cantones
      const cantonMatch = CANTONES_OFICIALES.find((c) => c.nombre.toLowerCase().includes(queryLower));
      if (cantonMatch) {
        try {
          localStorage.setItem('cr_canton_activo', cantonMatch.nombre);
          window.dispatchEvent(new CustomEvent('cantonChanged', { detail: cantonMatch }));
        } catch {
          // ignore
        }
        navigate('/gobernanza');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#00040D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-body, system-ui, sans-serif)'
      }}
    >
      {/* Header Municipal Soberano Fijo */}
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* ==========================================================================
            1. HERO CÍVICO FORMAL Y MODERNO
            Fondo: Cordillera Soberana de Costa Rica tratada con degradado de Obsidiana
            Emblema Solemne · Titular de Estado · Barra de Búsqueda Cívica Flotante
            ========================================================================== */}
        <section
          style={{
            position: 'relative',
            minHeight: '88vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '7.5rem 2rem 5rem',
            overflow: 'hidden'
          }}
        >
          {/* Fondo Fotorrealista de la Cordillera Costarricense con Gradiente Soberano */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(180deg, rgba(0, 4, 13, 0.80) 0%, rgba(0, 4, 13, 0.65) 50%, #00040D 100%), url('/costa-rica-hero.jpg')`,
              backgroundPosition: 'center 35%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.92)'
            }}
          />

          {/* Viñeta Radial Cívica para Concentrar Foco en el Centro */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0, 20, 137, 0.12) 0%, rgba(0, 4, 13, 0.85) 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* Gradiente Inferior de Fusión Suave con el Resto de la Página */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '140px',
              background: 'linear-gradient(to top, #00040D 0%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* Bloque Central de Alto Impacto */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '980px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Emblema Heráldico y Kicker Institucional */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'rgba(0, 20, 137, 0.45)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(121, 166, 255, 0.35)',
                padding: '0.4rem 1.15rem',
                borderRadius: '9999px',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 20, 137, 0.4)'
              }}
            >
              {/* Pabellón mini patrio */}
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#DA291C',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 0 8px #DA291C'
                }}
              />
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF'
                }}
              >
                REPÚBLICA DE COSTA RICA · SEDE ELECTRÓNICA NACIONAL
              </span>
            </div>

            {/* Titular Solemne de Estado */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.85rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.08,
                margin: '0 0 1.25rem',
                color: '#FFFFFF',
                fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)',
                textShadow: '0 4px 35px rgba(0, 4, 13, 0.85)'
              }}
            >
              GOBIERNO LOCAL Y SERVICIOS CIUDADANOS
            </h1>

            {/* Subtítulo con Autoridad */}
            <p
              style={{
                fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)',
                fontWeight: 500,
                letterSpacing: '0.01em',
                color: '#E2E8F0',
                margin: '0 0 1.25rem',
                maxWidth: '820px',
                lineHeight: 1.35,
                textShadow: '0 2px 15px rgba(0, 4, 13, 0.8)'
              }}
            >
              Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 Cantones de Costa Rica
            </p>

            {/* Párrafo Descriptivo de Respaldo */}
            <p
              style={{
                fontSize: '0.96rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 0 2.5rem'
              }}
            >
              Consulte actas oficiales del Concejo Municipal, valide cédulas con Hacienda, tramite patentes y reporte incidencias viales en tiempo real con trazabilidad bajo el Código Municipal y la Ley N° 8968.
            </p>

            {/* Barra de Búsqueda Cívica (Cápsula Glass Flotante) */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '720px' }}>
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 15, 45, 0.78)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '9999px',
                  padding: '0.5rem 0.6rem 0.5rem 1.4rem',
                  boxShadow: '0 20px 60px rgba(0, 4, 13, 0.8), 0 0 30px rgba(0, 20, 137, 0.35)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Search size={20} color="#79a6ff" style={{ flexShrink: 0, marginRight: '0.75rem' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Buscar trámite municipal, acta de concejo, cantón o reporte vial..."
                  aria-label="Buscar trámite municipal, acta de concejo, cantón o reporte vial"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.98rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="submit"
                  aria-label="Consultar trámite o servicio"
                  style={{
                    backgroundColor: '#002B7F',
                    backgroundImage: 'linear-gradient(135deg, #002B7F 0%, #001489 100%)',
                    border: '1px solid rgba(121, 166, 255, 0.5)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '0.68rem 1.6rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 16px rgba(0, 20, 137, 0.6)',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0036a1';
                    e.currentTarget.style.borderColor = '#79a6ff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#002B7F';
                    e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Consultar</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Menú de Sugerencias Flotante en Vidrio Esmerilado */}
              {showSuggestions && searchQuery.trim() && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 10, 28, 0.96)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '20px',
                    padding: '1rem',
                    boxShadow: '0 25px 60px rgba(0, 4, 13, 0.92), 0 0 35px rgba(0, 20, 137, 0.3)',
                    zIndex: 50,
                    textAlign: 'left',
                    maxHeight: '380px',
                    overflowY: 'auto'
                  }}
                >
                  {sugerenciasOficiales.map((grupo, gIdx) => {
                    const matches = grupo.items.filter((item) =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    if (matches.length === 0) return null;

                    return (
                      <div key={gIdx} style={{ marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: '#79a6ff',
                            display: 'block',
                            padding: '0.25rem 0.75rem'
                          }}
                        >
                          {grupo.categoria}
                        </span>
                        {matches.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setShowSuggestions(false);
                              navigate(item.path);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              background: 'transparent',
                              border: 'none',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '10px',
                              color: '#E2E8F0',
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.35)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#E2E8F0';
                            }}
                          >
                            <span>{item.label}</span>
                            <ChevronRight size={14} color="#79a6ff" />
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Indicador del Cantón Actualmente Activo en el Hero */}
            <div
              style={{
                marginTop: '1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#94A3B8',
                fontSize: '0.82rem'
              }}
            >
              <Building2 size={15} color="#38BDF8" />
              <span>Gobierno Local activo en consulta:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Municipalidad de {activeCantonName}</span>
              <span style={{ color: '#475569' }}>•</span>
              <Link
                to="/gobernanza"
                style={{
                  color: '#79a6ff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>Ver Concejo</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. LOS 4 PILARES MUNICIPALES (SECCIÓN EDITORIAL DE SERVICIOS PÚBLICOS)
            Tarjetas de vidrio esmerilado de gran respiro · Números 01, 02, 03, 04
            Ventanilla Única · Concejo y Actas · Obras y Reportes · Desarrollo y CCDR
            ========================================================================== */}
        <section
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '5rem 2rem 6rem'
          }}
        >
          {/* Encabezado Editorial Solemne */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#79a6ff',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              ADMINISTRACIÓN PÚBLICA CANTONAL · DTA & CÓDIGO MUNICIPAL
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 1rem',
                color: '#FFFFFF',
                fontFamily: 'var(--font-headline, sans-serif)'
              }}
            >
              Los 4 Ejes Rectores de la Gestión Municipal
            </h2>
            <p style={{ fontSize: '1.02rem', color: '#94A3B8', lineHeight: 1.65 }}>
              Servicios cívicos soberanos organizados para garantizar la transparencia institucional, la resolución comunal de averías y el desarrollo participativo en cada uno de los 84 cantones.
            </p>
          </div>

          {/* Grilla de los 4 Pilares Municipales */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* EJE 01: Ventanilla Única & Trámites */}
            <div
              className="glass-card"
              style={{
                backgroundColor: 'rgba(0, 15, 45, 0.65)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 20, 60, 0.85)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 20, 137, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 15, 45, 0.65)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                {/* Cabecera de Tarjeta: Número Arquitectónico e Icono */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                  <span
                    style={{
                      fontSize: '3rem',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      color: 'rgba(121, 166, 255, 0.4)',
                      fontFamily: 'var(--font-headline, sans-serif)'
                    }}
                  >
                    01
                  </span>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 20, 137, 0.35)',
                      border: '1px solid rgba(121, 166, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText size={22} color="#79a6ff" />
                  </div>
                </div>

                {/* Badges de Verificación */}
                <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(0, 20, 137, 0.35)',
                      color: '#79a6ff',
                      border: '1px solid rgba(121, 166, 255, 0.25)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Hacienda ATV
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#CBD5E1',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Patentes & Tributos
                  </span>
                </div>

                {/* Título y Descripción Formal */}
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.85rem', color: '#FFFFFF' }}>
                  Ventanilla Única & Trámites
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 2rem' }}>
                  Validación de cédula física y jurídica sincronizada con el Ministerio de Hacienda (ATV). Consulta y pago seguro de patentes comerciales, tasas de recolección y certificaciones tributarias.
                </p>
              </div>

              {/* Enlace Directo al Módulo */}
              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(0, 20, 137, 0.35)',
                  border: '1px solid rgba(121, 166, 255, 0.35)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#002B7F';
                  e.currentTarget.style.borderColor = '#79a6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.35)';
                  e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.35)';
                }}
              >
                <span>Acceder a Ventanilla</span>
                <ArrowRight size={16} color="#79a6ff" />
              </Link>
            </div>

            {/* EJE 02: Gobernanza & Concejo Municipal */}
            <div
              className="glass-card"
              style={{
                backgroundColor: 'rgba(0, 15, 45, 0.65)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 20, 60, 0.85)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(56, 189, 248, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 15, 45, 0.65)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                  <span
                    style={{
                      fontSize: '3rem',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      color: 'rgba(56, 189, 248, 0.4)',
                      fontFamily: 'var(--font-headline, sans-serif)'
                    }}
                  >
                    02
                  </span>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Vote size={22} color="#38BDF8" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: '#38BDF8',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Actas Oficiales PDF
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#CBD5E1',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Regidores & Alcaldía
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.85rem', color: '#FFFFFF' }}>
                  Gobernanza & Concejo Municipal
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 2rem' }}>
                  Fiscalización activa de la Alcaldía, regidores y síndicos. Visor de actas de sesiones ordinarias y extraordinarias en formato PDF, acuerdos vinculantes y presupuestos participativos.
                </p>
              </div>

              <Link
                to="/gobernanza"
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.3)';
                  e.currentTarget.style.borderColor = '#38BDF8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                }}
              >
                <span>Consultar Actas y Concejo</span>
                <ArrowRight size={16} color="#38BDF8" />
              </Link>
            </div>

            {/* EJE 03: Obras Públicas & Fiscalización Comunal */}
            <div
              className="glass-card"
              style={{
                backgroundColor: 'rgba(0, 15, 45, 0.65)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(218, 41, 28, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(40, 10, 15, 0.85)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(218, 41, 28, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 15, 45, 0.65)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                  <span
                    style={{
                      fontSize: '3rem',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      color: 'rgba(218, 41, 28, 0.4)',
                      fontFamily: 'var(--font-headline, sans-serif)'
                    }}
                  >
                    03
                  </span>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(218, 41, 28, 0.18)',
                      border: '1px solid rgba(218, 41, 28, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ClipboardEdit size={22} color="#FF6B6B" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(218, 41, 28, 0.18)',
                      color: '#FF6B6B',
                      border: '1px solid rgba(218, 41, 28, 0.35)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Huecos & Vías
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#CBD5E1',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Evidencia WebP
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.85rem', color: '#FFFFFF' }}>
                  Obras Públicas & Fiscalización
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 2rem' }}>
                  Reporte georreferenciado de bacheo vial, fallas de alumbrado público y fugas de agua. Adjunte evidencia fotográfica WebP y fiscalice el avance y plazos de solución con la Municipalidad.
                </p>
              </div>

              <Link
                to="/reportar-incidencia"
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(218, 41, 28, 0.2)',
                  border: '1px solid rgba(218, 41, 28, 0.45)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.35)';
                  e.currentTarget.style.borderColor = '#DA291C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(218, 41, 28, 0.45)';
                }}
              >
                <span>Reportar Avería Vial</span>
                <ArrowRight size={16} color="#FF6B6B" />
              </Link>
            </div>

            {/* EJE 04: Desarrollo Cantonal & CCDR */}
            <div
              className="glass-card"
              style={{
                backgroundColor: 'rgba(0, 15, 45, 0.65)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(10, 35, 25, 0.85)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(52, 211, 153, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 15, 45, 0.65)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                  <span
                    style={{
                      fontSize: '3rem',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      color: 'rgba(52, 211, 153, 0.4)',
                      fontFamily: 'var(--font-headline, sans-serif)'
                    }}
                  >
                    04
                  </span>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trophy size={22} color="#34D399" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      textTransform: 'uppercase'
                    }}
                  >
                    CCDR Deportes
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#CBD5E1',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Ferias & PYMES
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.85rem', color: '#FFFFFF' }}>
                  Desarrollo Cantonal & CCDR
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 2rem' }}>
                  Comités Cantonales de Deportes y Recreación (CCDR), rutas de las Ferias del Agricultor comunitarias, escuelas deportivas infantiles y directorio comercial de PYMES cantonales certificadas.
                </p>
              </div>

              <Link
                to="/deportes"
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 211, 153, 0.28)';
                  e.currentTarget.style.borderColor = '#34D399';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 211, 153, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.35)';
                }}
              >
                <span>Explorar CCDR y Ferias</span>
                <ArrowRight size={16} color="#34D399" />
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            3. SECCIÓN DE TRANSPARENCIA Y CIFRAS OFICIALES
            Panel sobrio con divisores de 1px · 7 Provincias · 84 Gobiernos · 492 Distritos · Ley 8968
            ========================================================================== */}
        <section
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '4.5rem 2rem'
          }}
        >
          <div
            style={{
              maxWidth: '1360px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {/* Métrica 1: 7 Provincias */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 4.5vw, 4.5rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-headline, sans-serif)'
                }}
              >
                07
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#F1F5F9' }}>
                Provincias Soberanas
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón unificadas en un único estándar digital.
              </p>
            </div>

            {/* Métrica 2: 84 Gobiernos Locales */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '2rem'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 4.5vw, 4.5rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#38BDF8',
                  fontFamily: 'var(--font-headline, sans-serif)'
                }}
              >
                84
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#F1F5F9' }}>
                Gobiernos Locales Autónomos
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Municipalidades cantonales con autonomía constitucional, Concejos deliberantes y competencias tributarias propias.
              </p>
            </div>

            {/* Métrica 3: 492 Distritos */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '2rem'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 4.5vw, 4.5rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-headline, sans-serif)'
                }}
              >
                492
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#F1F5F9' }}>
                Distritos Fiscalizados
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Descentralización comunal de costa a costa y frontera a frontera, cubriendo zonas rurales y metropolitana.
              </p>
            </div>

            {/* Métrica 4: Transparencia Ley 8968 & 7600 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '2rem'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 4.5vw, 4.5rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#34D399',
                  fontFamily: 'var(--font-headline, sans-serif)'
                }}
              >
                100%
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#F1F5F9' }}>
                Transparencia Ley N° 8968
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Protección estricta de datos personales de los ciudadanos y accesibilidad universal conforme a la Ley N° 7600.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            4. SERVICIOS TERRITORIALES COMPLEMENTARIOS DEL SISTEMA NACIONAL
            Visor Cartográfico 3D · Centro de Emergencias 911 · Educación, Cultura y Turismo
            ========================================================================== */}
        <section
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '6rem 2rem'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#38BDF8',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              INFRAESTRUCTURA Y SERVICIOS INTEGRADOS
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 1rem',
                color: '#FFFFFF',
                fontFamily: 'var(--font-headline, sans-serif)'
              }}
            >
              Módulos Complementarios de Soberanía Cívica
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Herramientas geoespaciales, educativas y de auxilio inmediato sincronizadas en la plataforma.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {[
              {
                id: 'modulo-gis',
                titulo: 'Visor Cartográfico 3D GIS',
                desc: 'Análisis topográfico, cuencas hidrográficas y puntos de interés cívicos.',
                icono: Compass,
                color: '#60A5FA',
                ruta: '/mapa-gis',
                badge: 'Relieve Soberano'
              },
              {
                id: 'modulo-seguridad',
                titulo: 'Seguridad Nacional 911 & CNE',
                desc: 'Alertas en tiempo real, catálogo de albergues y centros de auxilio.',
                icono: ShieldCheck,
                color: '#EF4444',
                ruta: '/seguridad-emergencias',
                badge: 'Emergencias'
              },
              {
                id: 'modulo-educacion',
                titulo: 'Educación Técnica (CTP)',
                desc: 'Directorio nacional de colegios técnicos, POIs y carreras técnicas.',
                icono: GraduationCap,
                color: '#A78BFA',
                ruta: '/educacion',
                badge: 'Juventud'
              },
              {
                id: 'modulo-cultura',
                titulo: 'Patrimonio & Cultura',
                desc: 'Línea de tiempo histórica, heráldica y reproductor de himnos cantonales.',
                icono: Music,
                color: '#F472B6',
                ruta: '/cultura',
                badge: 'Identidad'
              },
              {
                id: 'modulo-turismo',
                titulo: 'Turismo Accesible Ley 7600',
                desc: 'Rutas cantonales certificadas, destinos inclusivos y exportador GeoJSON.',
                icono: MapPin,
                color: '#38BDF8',
                ruta: '/turismo',
                badge: 'Inclusión'
              },
              {
                id: 'modulo-ia',
                titulo: 'Planificador IA Itinerario Pura Vida',
                desc: 'Motor predictivo de rutas cantonales con análisis de orografía y clima.',
                icono: Sparkles,
                color: '#F59E0B',
                ruta: '/itinerario-ia',
                badge: 'Inteligencia Cívica'
              }
            ].map((mod) => (
              <Link
                key={mod.id}
                to={mod.ruta}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '18px',
                    padding: '1.75rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = mod.color;
                    e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: `${mod.color}18`,
                          border: `1px solid ${mod.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {React.createElement(mod.icono, { size: 20, color: mod.color })}
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '9999px',
                          backgroundColor: `${mod.color}15`,
                          color: mod.color,
                          border: `1px solid ${mod.color}35`,
                          textTransform: 'uppercase'
                        }}
                      >
                        {mod.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#FFFFFF' }}>
                      {mod.titulo}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                      {mod.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: mod.color
                    }}
                  >
                    <span>Ingresar al servicio</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ==========================================================================
          5. PIE DE PÁGINA (FOOTER) INSTITUCIONAL SOBERANO
          Obsidiana (#00040D) · Líneas sutiles de 1px · Respaldo normativo y cívico
          ========================================================================== */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#00040D',
          padding: '4.5rem 2rem 3.5rem',
          color: '#64748B',
          fontSize: '0.85rem'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2.5rem'
            }}
          >
            {/* Bloque Identidad Oficial */}
            <div style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#DA291C',
                    boxShadow: '0 0 8px #DA291C'
                  }}
                />
                <span
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF'
                  }}
                >
                  Costa Rica Unidos
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
                Sede electrónica oficial de los Gobiernos Locales de la República de Costa Rica. Plataforma de soberanía tecnológica diseñada para la fiscalización ciudadana, trámites municipales y cohesión territorial cantonal.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Código Municipal Ley N° 7794
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Ley N° 8968 Protección de Datos
                </span>
              </div>
            </div>

            {/* Columnas de Navegación Institucional */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3.5rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#CBD5E1',
                    display: 'block',
                    marginBottom: '1rem'
                  }}
                >
                  Servicios Cantonales
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <li><Link to="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Ventanilla Única & Cédula</Link></li>
                  <li><Link to="/gobernanza" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Concejo Municipal & Actas</Link></li>
                  <li><Link to="/reportar-incidencia" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Reporte de Averías Viales</Link></li>
                  <li><Link to="/participacion" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Presupuestos Participativos</Link></li>
                  <li><Link to="/deportes" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Comités Cantonales CCDR</Link></li>
                </ul>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#CBD5E1',
                    display: 'block',
                    marginBottom: '1rem'
                  }}
                >
                  Nación & Marco Legal
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <li><Link to="/mapa-gis" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Visor Cartográfico 3D</Link></li>
                  <li><Link to="/seguridad-emergencias" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Red Nacional 911 / CNE</Link></li>
                  <li><Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Acceso Funcionario / Firma Digital</Link></li>
                  <li><a href="#ley-7600" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Accesibilidad Universal Ley N° 7600</a></li>
                  <li><a href="#ley-8968" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Privacidad Ciudadana Ley N° 8968</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divisor Inferior y Sellos de Estado */}
          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.8rem'
            }}
          >
            <span>&copy; 2026 República de Costa Rica. Sistema Nacional de Gobiernos Locales.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ color: '#CBD5E1', fontWeight: 700 }}>7 Provincias</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }}>84 Cantones</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#CBD5E1', fontWeight: 700 }}>492 Distritos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
