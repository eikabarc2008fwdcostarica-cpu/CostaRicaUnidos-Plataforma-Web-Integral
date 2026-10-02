import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LogIn, UserPlus, Globe2, Sparkles, Sun, Moon } from 'lucide-react';
import { useAccessibility, TypographicScaleSelector } from './accessibility';
import { IDIOMAS_SOPORTADOS } from './accessibility/accessibilityData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './common/Logo';

/**
 * FullScreenMenu — Menú de Navegación a Pantalla Completa
 * Estilo Editorial Suizo • LPAS Full Screen Overlay
 * Sincronización estricta de rutas, internacionalización reactiva (8 idiomas) y cierre inmediato
 */
export default function FullScreenMenu({ isOpen, onClose }) {
  const location = useLocation();
  const { selectedLang, setSelectedLang, openOnboarding } = useAccessibility();
  const { idioma, cambiarIdioma, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Sincronizar selectedLang de accesibilidad cuando cambie el idioma del LanguageContext
  useEffect(() => {
    const item = IDIOMAS_SOPORTADOS.find((i) => i.bandera === idioma);
    if (item && item.codigo !== selectedLang) {
      setSelectedLang(item.codigo);
    }
  }, [idioma, selectedLang, setSelectedLang]);

  // Bloqueo de scroll y tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Los 11 Módulos Oficiales del Sistema Nacional
  const modulosSistema = [
    { number: '01', key: 'portal', label: 'Portal Nacional & Noticias', path: '/noticias' },
    { number: '02', key: 'territorio', label: 'Territorio 3D & Cartografía', path: '/mapa-gis' },
    { number: '03', key: 'reportes', label: 'Reportes de Infraestructura', path: '/reportar-incidencia' },
    { number: '04', key: 'seguridad', label: 'Seguridad y Emergencias 911', path: '/seguridad-emergencias' },
    { number: '05', key: 'gobernanza', label: 'Gobernanza y Transparencia', path: '/gobernanza' },
    { number: '06', key: 'cultura', label: 'Cultura y Patrimonio', path: '/cultura' },
    { number: '07', key: 'deportes', label: 'Deportes y Recreación', path: '/deportes' },
    { number: '08', key: 'educacion', label: 'Educación y Juventud', path: '/educacion' },
    { number: '09', key: 'comercio', label: 'Comercio y PYMEs', path: '/comercio' },
    { number: '10', key: 'turismo', label: 'Turismo y Naturaleza', path: '/turismo' },
    { number: '11', key: 'participacion', label: 'Participación Ciudadana', path: '/participacion' },
    { number: '12', key: 'itinerario', label: 'Itinerario Pura Vida (IA)', path: '/itinerario-ia' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación a pantalla completa"
      className="fullscreen-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 4, 13, 0.96)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem 2rem',
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      {/* Barra Superior del Overlay */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div onClick={onClose} style={{ cursor: 'pointer' }}>
          <Logo showText={true} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Botón Conmutador de Modo Claro / Oscuro */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a Modo Claro (Sede Electrónica)' : 'Cambiar a Modo Oscuro'}
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '0.5rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-300" />
                <span className="hidden sm:inline">Modo Oscuro</span>
              </>
            )}
          </button>

          {/* Botón CERRAR */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('cerrarBoton') || 'Cerrar menú de navegación'}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              padding: '0.5rem 1.4rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
          >
            <span>{t('cerrarBoton') || 'CERRAR'}</span>
            <X size={15} color="#FFFFFF" />
          </button>
        </div>
      </div>

      {/* Cuerpo Central del Overlay (Dos Columnas Editoriales) */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: 'auto',
          padding: '1.5rem 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 3.5rem)',
          alignItems: 'start'
        }}
      >
        {/* Columna Izquierda: Los 11 Módulos del Sistema */}
        <div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#79a6ff',
              display: 'block',
              marginBottom: '1.25rem'
            }}
          >
            {t('modulosTitulo') || 'Módulos del Sistema Nacional'}
          </span>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {modulosSistema.map((item) => {
              const isCurrent = location.pathname === item.path;
              return (
                <Link
                  key={item.number}
                  to={item.path}
                  onClick={onClose}
                  style={{
                    textDecoration: 'none',
                    color: isCurrent ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: 'clamp(1.1rem, 2vw, 1.55rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.015em',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isCurrent ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Viñeta de módulo activo */}
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#DA291C' : 'transparent',
                      border: isCurrent ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'inline-block',
                      flexShrink: 0
                    }}
                  />

                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: isCurrent ? '#DA291C' : '#79a6ff',
                      fontFamily: 'var(--font-telemetry, monospace)',
                      minWidth: '28px'
                    }}
                  >
                    {item.number}.
                  </span>

                  <span>{t(item.key) || item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Columna Derecha: Servicios Secundarios, Idiomas y Accesibilidad */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1.5rem',
            padding: '2rem 2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          {/* 1. Acceso y Registro Ciudadano */}
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.45)',
                display: 'block',
                marginBottom: '0.85rem'
              }}
            >
              {t('identidadTitulo') || 'Identidad y Trámites'}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Link
                to="/login"
                onClick={onClose}
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(0, 43, 127, 0.4)',
                  border: '1px solid rgba(121, 166, 255, 0.3)',
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 43, 127, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 43, 127, 0.4)';
                }}
              >
                <LogIn size={15} color="#79a6ff" />
                <span>{t('accesoCivico') || 'Acceso Cívico'}</span>
              </Link>

              <Link
                to="/login"
                onClick={onClose}
                style={{
                  textDecoration: 'none',
                  color: '#E2E8F0',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <UserPlus size={15} />
                <span>{t('registro') || 'Registro'}</span>
              </Link>
            </div>
          </div>

          {/* 2. Selector de los 8 Idiomas Oficiales */}
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#79a6ff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.75rem'
              }}
            >
              <Globe2 size={13} />
              <span>{t('idiomasTitulo') || 'IDIOMAS OFICIALES (8 IDIOMAS)'}</span>
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
              {IDIOMAS_SOPORTADOS.map((item) => {
                const isSelected = idioma === item.bandera;
                return (
                  <button
                    key={item.codigo}
                    type="button"
                    onClick={() => {
                      cambiarIdioma(item.bandera);
                      setSelectedLang(item.codigo);
                    }}
                    style={{
                      backgroundColor: isSelected ? 'rgba(0, 43, 127, 0.65)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#FFFFFF' : '#94A3B8',
                      padding: '0.45rem 0.25rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 12px rgba(121, 166, 255, 0.35)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-telemetry, monospace)' }}>
                      {item.bandera}
                    </span>
                    <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                      {item.nativo.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Escala Tipográfica (Ley 7600) y Guía de Voz */}
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.45)',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              {t('a11yTitulo') || 'ACCESIBILIDAD UNIVERSAL (LEY 7600)'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
              <TypographicScaleSelector />

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openOnboarding();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.95rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <Sparkles size={14} color="#79a6ff" />
                <span>{t('guiaVoz') || 'Guía Asistida por Voz'}</span>
              </button>
            </div>
          </div>

          {/* 4. Conmutador de Modo Visual (Sede Electrónica / Modo Oscuro) */}
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.45)',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              MODO VISUAL & ESTÉTICA
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 43, 127, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>Cambiar a Modo Claro (Sede Electrónica)</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-300" />
                  <span>Cambiar a Modo Oscuro (Sovereign Glass)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra Inferior del Overlay con Metadatos Cívicos */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          paddingTop: '1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}
      >
        <span>{t('repSoberania') || 'República de Costa Rica • Soberanía e Inclusión Digital'}</span>
        <span>
          {t('provinciasNum')} {t('provinciasTexto')} &bull; {t('cantonesNum')} {t('cantonesTexto')} &bull; {t('distritosNum')} {t('distritosTexto')}
        </span>
      </div>
    </div>
  );
}

