import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, BarChart3, Leaf, Play, Pause } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'SOBERANÍA TERRITORIAL & CIVIC GLASS v2.1',
    titulo: 'Costa Rica Unidos: La Plataforma Soberana de la República',
    bajada: 'Unificando la gestión territorial, la fiscalización de obra pública y la transparencia cívica de los 84 cantones y 492 distritos bajo un estándar digital transparente y auditable.',
    badgeIcon: Landmark,
    ctaPrimary: { text: 'Explorar Mapa Nacional', targetId: 'seccion-mapa-svg' },
    ctaSecondary: { text: 'Auditoría Cívica', href: '/dashboard' },
    statNumber: '84',
    statLabel: 'Cantones Oficiales DTA',
    accentColor: '#002B7F'
  },
  {
    id: 2,
    tag: 'FISCALIZACIÓN TRIBUTARIA & OBRAS MOPT',
    titulo: 'Vigilancia Presupuestaria y Control Ciudadano en Tiempo Real',
    bajada: 'Supervisión activa del avance físico y financiero de las obras de infraestructura vial, contratos estatales SICOP y situación tributaria de contribuyentes con datos abiertos.',
    badgeIcon: BarChart3,
    ctaPrimary: { text: 'Filtrar por Territorio', targetId: 'seccion-selector-territorial' },
    ctaSecondary: { text: 'Ver Módulo de Hacienda', href: '/dashboard' },
    statNumber: '₡ 617,450 M',
    statLabel: 'Fondo Cantonal Monitoreado',
    accentColor: '#CE1126'
  },
  {
    id: 3,
    tag: 'IDENTIDAD PROVINCIAL & RESILIENCIA',
    titulo: 'Identidad Territorial Viva: 7 Provincias, Un Solo Destino',
    bajada: 'Conectividad directa con el motor de temas provinciales dinámicos y la División Territorial Administrativa (DTA) para salvaguardar la autonomía cantonal y comunitaria.',
    badgeIcon: Leaf,
    ctaPrimary: { text: 'Conmutar Provincia Activa', targetId: 'seccion-theming-engine' },
    ctaSecondary: { text: 'Acceso Identidad Cívica', href: '/login' },
    statNumber: '492+',
    statLabel: 'Distritos Georreferenciados',
    accentColor: '#007A3D'
  }
];

export default function HeroCarousel({ onSelectSlideCta }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);
  const carouselContainerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Control de autoplay accesible (pausa si no está en modo play)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(nextSlide, 7000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide]);

  // Manejo de navegación por teclado accesible (WCAG 2.1 AA)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentSlide(SLIDES.length - 1);
    }
  };

  const handleCtaClick = (cta) => {
    if (cta.targetId) {
      const el = document.getElementById(cta.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (onSelectSlideCta) onSelectSlideCta(cta.targetId);
    }
  };

  const activeSlideData = SLIDES[currentSlide];

  return (
    <section
      ref={carouselContainerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carrusel Institucional Soberano de Costa Rica"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onFocus={() => setIsPlaying(false)}
      onBlur={() => setIsPlaying(true)}
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 15, 50, 0.7) 0%, rgba(0, 4, 13, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 20px 60px rgba(0, 4, 13, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        marginBottom: '2.5rem'
      }}
    >
      {/* Resplandor decorativo tricolor de fondo (#002B7F y #CE1126) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 43, 127, 0.35) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(206, 17, 38, 0.22) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      {/* Franja superior Tricolor Nacional (Azul, Blanco, Rojo) */}
      <div style={{ display: 'flex', height: '5px', width: '100%', opacity: 0.9 }}>
        <div style={{ flex: 1, backgroundColor: '#002B7F' }}></div>
        <div style={{ flex: 1, backgroundColor: '#F8FAFC' }}></div>
        <div style={{ flex: 2, backgroundColor: '#CE1126' }}></div>
        <div style={{ flex: 1, backgroundColor: '#F8FAFC' }}></div>
        <div style={{ flex: 1, backgroundColor: '#002B7F' }}></div>
      </div>

      {/* Contenido de la diapositiva */}
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`Diapositiva ${currentSlide + 1} de ${SLIDES.length}: ${activeSlideData.titulo}`}
        style={{
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3.5rem)',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div>
          {/* Header de telemetría y Tag del Slide */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.8rem',
            marginBottom: '1.25rem'
          }}>
            <span
              className="telemetry-badge"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.25)',
                backgroundColor: 'rgba(0, 43, 127, 0.35)',
                color: '#99BEFF',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              {React.createElement(activeSlideData.badgeIcon, { size: 14 })}
              <span>{activeSlideData.tag}</span>
            </span>

            {/* Contador de slides accesible */}
            <div
              style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.65)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '0.25rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <span>{currentSlide + 1}</span> / <span>{SLIDES.length}</span>
            </div>
          </div>

          {/* Título de alto impacto (WCAG 2.1 AA contraste verificado > 7:1) */}
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.8vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#F8FAFC',
              letterSpacing: '-0.025em',
              maxWidth: '850px',
              marginBottom: '1.2rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)'
            }}
          >
            {activeSlideData.titulo}
          </h2>

          {/* Bajada explicativa */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              color: '#E2E8F0',
              lineHeight: 1.65,
              maxWidth: '780px',
              marginBottom: '2rem'
            }}
          >
            {activeSlideData.bajada}
          </p>
        </div>

        {/* Acciones principales y Telemetría de la diapositiva */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => handleCtaClick(activeSlideData.ctaPrimary)}
              className="btn-sovereign"
              style={{
                fontSize: '0.95rem',
                padding: '0.85rem 1.65rem'
              }}
              aria-label={`${activeSlideData.ctaPrimary.text} - Ir a la sección`}
            >
              <span>{activeSlideData.ctaPrimary.text}</span>
              <span aria-hidden="true">↓</span>
            </button>

            {activeSlideData.ctaSecondary.href ? (
              <Link
                to={activeSlideData.ctaSecondary.href}
                className="btn-glass-secondary"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.5rem',
                  backgroundColor: 'rgba(0, 43, 127, 0.35)',
                  borderColor: 'rgba(121, 166, 255, 0.3)'
                }}
              >
                {activeSlideData.ctaSecondary.text} →
              </Link>
            ) : null}
          </div>

          {/* Métrica destacada */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.6rem 1.2rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 10, 30, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#79a6ff',
                lineHeight: 1
              }}>
                {activeSlideData.statNumber}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '0.2rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {activeSlideData.statLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de control inferior: Anterior / Siguiente / Pausa / Indicadores */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'rgba(0, 4, 13, 0.85)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 3
      }}>
        {/* Controles de Navegación Flechas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Diapositiva anterior"
            className="btn-glass-secondary"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            ← Ant.
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Diapositiva siguiente"
            className="btn-glass-secondary"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            Sig. →
          </button>
        </div>

        {/* Indicadores de Diapositiva (Dots) */}
        <div
          role="tablist"
          aria-label="Selector de diapositivas"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={idx === currentSlide}
              aria-label={`Ir a la diapositiva ${idx + 1}: ${slide.titulo}`}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: idx === currentSlide ? '#79a6ff' : 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: idx === currentSlide ? '0 0 8px #79a6ff' : 'none'
              }}
            />
          ))}
        </div>

        {/* Botón Accesible Play/Pausa de Rotación */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? 'Pausar avance automático del carrusel' : 'Iniciar avance automático del carrusel'}
          className="btn-glass-secondary"
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-telemetry)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            borderRadius: '8px'
          }}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span>{isPlaying ? 'PAUSAR' : 'REANUDAR'}</span>
        </button>
      </div>
    </section>
  );
}
