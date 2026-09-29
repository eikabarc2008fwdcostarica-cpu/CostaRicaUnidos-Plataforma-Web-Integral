import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Map, ClipboardEdit, ShieldCheck, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

/**
 * Inicio — Minimalismo Editorial, Fotografía Inmersiva y Glassmorphism Refinado
 * Swiss Design • 0% Jerga Técnica • 100% Ciudadanía y Turismo
 */
export default function Inicio() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lista de destinos y trámites sugeridos
  const sugerencias = [
    { label: 'Visor Cartográfico 3D y Relieve', path: '/mapa-gis' },
    { label: 'Reportar avería o hueco en carretera', path: '/reportar-incidencia' },
    { label: 'Centro de Emergencias y Albergues 911', path: '/seguridad-emergencias' },
    { label: 'San Carlos • Volcán Arenal y Huetar Norte', path: '/mapa-gis' },
    { label: 'Escazú • Valle Central', path: '/mapa-gis' },
    { label: 'Puntarenas • Costa Pacífica y Golfito', path: '/mapa-gis' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const queryLower = searchQuery.toLowerCase();
    if (queryLower.includes('report') || queryLower.includes('aver') || queryLower.includes('hueco') || queryLower.includes('luz')) {
      navigate('/reportar-incidencia');
    } else if (queryLower.includes('emergen') || queryLower.includes('sos') || queryLower.includes('albergue') || queryLower.includes('911')) {
      navigate('/seguridad-emergencias');
    } else {
      navigate('/mapa-gis');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#00040D', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Cabecera Fija Minimalista */}
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* ==========================================================================
            1. HERO SECTION INMERSIVA
            Fotografía de alta resolución de Costa Rica con overlay oscuro de Obsidiana
            ========================================================================== */}
        <section
          style={{
            position: 'relative',
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '7rem 2rem 5rem',
            overflow: 'hidden'
          }}
        >
          {/* Fondo Fotorrealista Soberano de Costa Rica (Volcán Arenal y Selva Tropical) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: "linear-gradient(180deg, rgba(0, 4, 13, 0.75) 0%, rgba(0, 4, 13, 0.60) 50%, rgba(0, 4, 13, 0.95) 100%), url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=80') center/cover no-repeat",
              transform: 'scale(1.02)',
              filter: 'brightness(0.95)'
            }}
          />

          {/* Viñeta Suave en los Bordes para Enfoque Central */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0, 4, 13, 0.15) 0%, rgba(0, 4, 13, 0.75) 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* Gradiente Inferior de Transición Suave */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '180px',
              background: 'linear-gradient(to top, #00040D 0%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* Contenido Editorial del Hero */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '920px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Kicker Editorial */}
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#79a6ff',
                marginBottom: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <span style={{ width: '20px', height: '1px', backgroundColor: '#79a6ff' }} />
              República de Costa Rica
              <span style={{ width: '20px', height: '1px', backgroundColor: '#79a6ff' }} />
            </span>

            {/* Gran Titular Editorial */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                margin: '0 0 1rem',
                color: '#FFFFFF',
                textShadow: '0 4px 30px rgba(0, 4, 13, 0.7)'
              }}
            >
              {t('tituloHero') || 'COSTA RICA UNIDOS'}
            </h1>

            {/* Subtítulo con Respiro */}
            <p
              style={{
                fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
                fontWeight: 400,
                letterSpacing: '0.02em',
                color: '#E2E8F0',
                margin: '0 0 1.25rem',
                maxWidth: '680px'
              }}
            >
              {t('subtituloHero') || 'Plataforma Territorial Soberana'}
            </p>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                maxWidth: '620px',
                margin: '0 0 2.5rem'
              }}
            >
              {t('descHero') || 'Conectando las 7 provincias, 84 cantones y comunidades de nuestra nación en un espacio cívico digital transparente, inclusivo y accesible para todos.'}
            </p>

            {/* Barra de Búsqueda Flotante de Vidrio Esmerilado (Search Capsule) */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '640px' }}>
              <form
                onSubmit={handleSearchSubmit}
                className="search-capsule-form"
              >
                <Search size={18} color="#79a6ff" style={{ flexShrink: 0, marginRight: '0.75rem' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(e);
                    }
                  }}
                  placeholder={t('buscarPlaceholder') || 'Buscar cantón, hospital, CTP o albergue...'}
                  aria-label={t('buscarPlaceholder') || 'Buscar cantón, hospital, CTP o albergue en Costa Rica'}
                  className="search-capsule-input"
                />
                <button
                  type="submit"
                  aria-label="Ejecutar búsqueda"
                  style={{
                    backgroundColor: '#002B7F',
                    border: '1px solid rgba(121, 166, 255, 0.4)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0, 43, 127, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0036a1';
                    e.currentTarget.style.borderColor = '#79a6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#002B7F';
                    e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.4)';
                  }}
                >
                  <span>{t('botonExplorar') || 'Explorar →'}</span>
                </button>
              </form>

              {/* Menú de Sugerencias Flotante en Vidrio */}
              {showSuggestions && searchQuery.trim() && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 8, 25, 0.94)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '1.25rem',
                    padding: '0.75rem',
                    boxShadow: '0 20px 50px rgba(0, 4, 13, 0.85)',
                    zIndex: 50,
                    textAlign: 'left'
                  }}
                >
                  {sugerencias
                    .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
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
                          padding: '0.65rem 1rem',
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
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#E2E8F0';
                        }}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight size={14} color="#79a6ff" />
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. SECCIÓN DE MÉTRICAS CÍVICAS (MINIMALISMO PURO CON LÍNEAS FINAS DE 1PX)
            Grilla de 3 columnas con líneas divisorias delgadas estilo editorial
            ========================================================================== */}
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '5rem 2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '3rem'
            }}
          >
            {/* Columna 1: 07 Provincias */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 5vw, 4.8rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-main)'
                }}
              >
                {t('provinciasNum') || '07'}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#F1F5F9' }}>
                {t('provinciasTexto') || 'Provincias Soberanas'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón, unificadas con identidad histórica y proyección cívica.
              </p>
            </div>

            {/* Columna 2: 84 Cantones */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                paddingLeft: '2.5rem'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 5vw, 4.8rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-main)'
                }}
              >
                {t('cantonesNum') || '84'}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#F1F5F9' }}>
                {t('cantonesTexto') || 'Cantones y Gobiernos Locales'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Gestión municipal descentralizada, fiscalización comunitaria y servicios locales de proximidad directa con el ciudadano.
              </p>
            </div>

            {/* Columna 3: 492 Distritos */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                paddingLeft: '2.5rem'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 5vw, 4.8rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-main)'
                }}
              >
                {t('distritosNum') || '492'}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#F1F5F9' }}>
                {t('distritosTexto') || 'Distritos Conectados'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Cobertura territorial integral de costa a costa y frontera a frontera, sin dejar a ninguna comunidad atrás.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            3. SECCIÓN DE EXPERIENCIA TERRITORIAL (TARJETAS GLASS FLOTANTES)
            3 tarjetas amplias con esquinas redondeadas, fondo translúcido y fotografía editorial
            ========================================================================== */}
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '6rem 2rem'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#79a6ff',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              Servicios Esenciales de la República
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                margin: '0 0 1rem',
                color: '#FFFFFF'
              }}
            >
              Experiencia Territorial Integral
            </h2>
            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Herramientas de última generación diseñadas para la exploración espacial, la resolución comunitaria y la protección nacional.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* Tarjeta 1: Cartografía 3D Soberana */}
            <div
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
                  alt="Relieve tridimensional de Costa Rica"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 8, 25, 0.95) 0%, transparent 60%)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '1.25rem',
                    backgroundColor: 'rgba(0, 43, 127, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(121, 166, 255, 0.3)',
                    color: '#FFFFFF',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Map size={12} color="#79a6ff" />
                  <span>Cartografía 3D</span>
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>
                    Cartografía 3D Soberana
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    Explora el relieve nacional, cuencas hidrográficas y puntos cívicos de salud y educación en un visor cartográfico tridimensional inmersivo con límites soberanos estrictos.
                  </p>
                </div>

                <Link
                  to="/mapa-gis"
                  style={{
                    textDecoration: 'none',
                    color: '#79a6ff',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#79a6ff';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span>Explorar Mapa 3D</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Tarjeta 2: Reportes Ciudadanos */}
            <div
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                  alt="Infraestructura vial y comunitaria"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 8, 25, 0.95) 0%, transparent 60%)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '1.25rem',
                    backgroundColor: 'rgba(218, 41, 28, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 107, 107, 0.4)',
                    color: '#FFFFFF',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ClipboardEdit size={12} color="#FFFFFF" />
                  <span>Participación</span>
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>
                    Reportes Ciudadanos
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    Mejora la infraestructura de tu comunidad mediante reportes georreferenciados de averías viales, luminarias y fugas con trazabilidad pública paso a paso bajo la Ley 8968.
                  </p>
                </div>

                <Link
                  to="/reportar-incidencia"
                  style={{
                    textDecoration: 'none',
                    color: '#FF6B6B',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#FF6B6B';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span>Registrar Reporte</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Tarjeta 3: Red de Resiliencia */}
            <div
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80"
                  alt="Centro de atención y seguridad"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 8, 25, 0.95) 0%, transparent 60%)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '1.25rem',
                    backgroundColor: 'rgba(0, 122, 61, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(74, 222, 128, 0.4)',
                    color: '#FFFFFF',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ShieldCheck size={12} color="#4ADE80" />
                  <span>Seguridad 911</span>
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>
                    Red de Resiliencia
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    Seguridad nacional ante crisis climáticas, monitoreo de alertas de la Comisión Nacional de Emergencias (CNE) y catálogo de refugios con disponibilidad completa sin conexión.
                  </p>
                </div>

                <Link
                  to="/seguridad-emergencias"
                  style={{
                    textDecoration: 'none',
                    color: '#4ADE80',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#4ADE80';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span>Ver Centro de Seguridad</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================================================
          4. PIE DE PÁGINA (FOOTER) MINIMALISTA Y ESPACIOSO
          Padding generoso, líneas sutiles y enlaces cívicos institucionales
          ========================================================================== */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#00040D',
          padding: '5rem 2rem 4rem',
          color: '#64748B',
          fontSize: '0.85rem'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
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
            {/* Identidad Institucional */}
            <div style={{ maxWidth: '380px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DA291C' }} />
                <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF' }}>
                  Costa Rica Unidos
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                Plataforma Territorial Soberana de la República de Costa Rica. Preservando la transparencia cívica, la accesibilidad universal y la cohesión comunitaria.
              </p>
            </div>

            {/* Enlaces de Navegación Rápida */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CBD5E1', display: 'block', marginBottom: '1rem' }}>
                  Navegación Cívica
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <li><Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Portal Nacional</Link></li>
                  <li><Link to="/mapa-gis" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Visor Cartográfico 3D</Link></li>
                  <li><Link to="/reportar-incidencia" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Reportes Ciudadanos</Link></li>
                  <li><Link to="/seguridad-emergencias" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Seguridad y Emergencias</Link></li>
                </ul>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CBD5E1', display: 'block', marginBottom: '1rem' }}>
                  Institución
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <li><Link to="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Panel Cívico</Link></li>
                  <li><Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Acceso Autenticado</Link></li>
                  <li><a href="#ley-7600" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Accesibilidad Ley 7600</a></li>
                  <li><a href="#privacidad" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Protección de Datos Ley 8968</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Línea Divisoria y Derechos */}
          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.8rem'
            }}
          >
            <span>&copy; 2026 República de Costa Rica. Todos los derechos reservados.</span>
            <span>7 Provincias &bull; 84 Cantones &bull; 492 Distritos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
