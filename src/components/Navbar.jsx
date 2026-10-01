import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, X, Check, FileText, Vote, AlertTriangle, Building2, MapPin, Sun, Moon } from 'lucide-react';
import FullScreenMenu from './FullScreenMenu';
import Logo from './common/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../data/costaRicaTerritorialData';

/**
 * HEADER Y NAVBAR MUNICIPAL SOBERANO — Sistema Sovereign Civic Glass v2.1
 * Cintillo de Estado · Barra Fija Obsidiana (68px) · Selector Dinámico de los 84 Cantones
 * Accesos Directos a Trámites, Concejo y Reportes · SOS 911 y Menú FullScreen
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estado del cantón activo (persiste en localStorage, por defecto San José)
  const [activeCanton, setActiveCanton] = useState(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  // Modal / Dropdown del Selector de Cantones
  const [isCantonModalOpen, setIsCantonModalOpen] = useState(false);
  const [cantonSearch, setCantonSearch] = useState('');
  const [selectedProvinciaFilter, setSelectedProvinciaFilter] = useState(0); // 0 = todas
  const modalRef = useRef(null);

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCantonModalOpen(false);
  }, [location.pathname]);

  // Manejar tecla Escape y bloqueo de scroll para el modal de cantones
  useEffect(() => {
    if (!isCantonModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCantonModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCantonModalOpen]);

  // Seleccionar un cantón
  const handleSelectCanton = (canton) => {
    setActiveCanton(canton.nombre);
    try {
      localStorage.setItem('cr_canton_activo', canton.nombre);
      localStorage.setItem('cr_canton_id', canton.id);
      localStorage.setItem('cr_provincia_id', canton.provinciaId);
      window.dispatchEvent(new CustomEvent('cantonChanged', { detail: canton }));
    } catch (e) {
      console.warn('Error guardando cantón en localStorage:', e);
    }
    setIsCantonModalOpen(false);
    setCantonSearch('');
  };

  // Filtrado de los 84 cantones
  const cantonesFiltrados = CANTONES_OFICIALES.filter((c) => {
    const coincideProvincia = selectedProvinciaFilter === 0 || c.provinciaId === selectedProvinciaFilter;
    const coincideBusqueda =
      c.nombre.toLowerCase().includes(cantonSearch.toLowerCase()) ||
      c.cabecera.toLowerCase().includes(cantonSearch.toLowerCase()) ||
      c.codigoDta.includes(cantonSearch);
    return coincideProvincia && coincideBusqueda;
  });

  const getProvinciaNombre = (provinciaId) => {
    const prov = PROVINCIAS_DATA.find((p) => p.id === provinciaId);
    return prov ? prov.nombre : '';
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          boxShadow: '0 10px 30px rgba(0, 4, 13, 0.75)'
        }}
      >
        {/* ==========================================================================
            1. CINTILLO SUPERIOR DE ESTADO (TOP BAR - 28px)
            Pabellón tricolor sutil y leyenda institucional del Sistema Nacional
            ========================================================================== */}
        <div
          style={{
            height: '28px',
            backgroundColor: '#000818',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            fontSize: '0.68rem',
            color: '#94A3B8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            overflow: 'hidden'
          }}
        >
          {/* Sub-cinta sutil con el pabellón tricolor patrio (Azul, Blanco, Rojo, Blanco, Azul: 1:1:2:1:1) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
            }}
          />

          {/* Leyenda Institucional Oficial */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#79a6ff',
                boxShadow: '0 0 8px #79a6ff'
              }}
            />
            <span style={{ color: '#E2E8F0', fontWeight: 700 }}>REPÚBLICA DE COSTA RICA</span>
            <span className="topbar-subtext" style={{ color: '#475569' }}>·</span>
            <span className="topbar-subtext" style={{ color: '#94A3B8' }}>SISTEMA NACIONAL DE GOBIERNOS LOCALES (DTA / CÓDIGO MUNICIPAL)</span>
          </div>

          {/* Badges de Transparencia y Accesibilidad (Visible en desktop) */}
          <div
            className="topbar-meta"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: '#64748B',
              fontSize: '0.65rem'
            }}
          >
            <span>TRANSPARENCIA LEY N° 8968</span>
            <span>•</span>
            <span>ACCESIBILIDAD LEY N° 7600</span>
            <span>•</span>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>84 GOBIERNOS LOCALES AUTÓNOMOS</span>
          </div>
        </div>

        {/* ==========================================================================
            2. BARRA PRINCIPAL FIJA (68px) EN VIDRIO OBSIDIANA CON DESENFOQUE
            Obsidiana Soberana (#00040D) · Blur 24px · Borde 1px translúcido
            ========================================================================== */}
        <div
          className="navbar-main-container"
          style={{
            height: '68px',
            backgroundColor: 'rgba(0, 4, 13, 0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'relative'
          }}
        >
          <div
            style={{
              maxWidth: '1440px',
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}
          >
            {/* LADO IZQUIERDO: LOGO OFICIAL + SELECTOR DINÁMICO DE GOBIERNO LOCAL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              <Logo showText={true} />

              {/* Divisor vertical sutil */}
              <div
                className="topbar-subtext"
                style={{
                  height: '28px',
                  width: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }}
              />

              {/* Botón Selector del Gobierno Local Activo [ Municipalidad: San José ] */}
              <button
                type="button"
                onClick={() => setIsCantonModalOpen(!isCantonModalOpen)}
                aria-label={`Seleccionar Gobierno Local. Actual: Municipalidad de ${activeCanton}`}
                className="canton-selector-btn"
                style={{
                  background: 'rgba(0, 20, 137, 0.28)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: isCantonModalOpen ? '1px solid #79a6ff' : '1px solid rgba(121, 166, 255, 0.35)',
                  color: '#FFFFFF',
                  padding: '0.45rem 0.85rem',
                  minHeight: '44px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.25s ease',
                  boxShadow: isCantonModalOpen ? '0 0 16px rgba(0, 20, 137, 0.6)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.45)';
                  e.currentTarget.style.borderColor = '#79a6ff';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 20, 137, 0.5)';
                }}
                onMouseLeave={(e) => {
                  if (!isCantonModalOpen) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.28)';
                    e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.35)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Building2 size={16} color="#79a6ff" />
                <span className="canton-selector-label" style={{ color: '#94A3B8', fontWeight: 500, fontSize: '0.78rem' }}>Municipalidad:</span>
                <span className="canton-selector-name" style={{ color: '#FFFFFF', fontWeight: 800 }}>{activeCanton}</span>
                <ChevronDown
                  size={14}
                  color="#79a6ff"
                  className="canton-selector-chevron"
                  style={{
                    transform: isCantonModalOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>
            </div>

            {/* CENTRO: ACCESOS DIRECTOS A LOS 3 SERVICIOS CRÍTICOS (Adaptable a 44px en móviles) */}
            <nav
              className="navbar-critical-services"
              aria-label="Servicios Municipales Críticos"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              {/* Servicio 1: Trámites & Cédula */}
              <Link
                to="/dashboard"
                className="navbar-btn-tactile"
                title="Trámites & Cédula"
                aria-label="Trámites & Cédula"
                style={{
                  textDecoration: 'none',
                  color: location.pathname === '/dashboard' ? '#FFFFFF' : '#CBD5E1',
                  backgroundColor: location.pathname === '/dashboard' ? 'rgba(0, 20, 137, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                  border: location.pathname === '/dashboard' ? '1px solid rgba(121, 166, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.5rem 0.95rem',
                  minHeight: '44px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.4)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/dashboard') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#CBD5E1';
                  }
                }}
              >
                <FileText size={16} color="#79a6ff" />
                <span className="nav-btn-text">Trámites & Cédula</span>
              </Link>

              {/* Servicio 2: Concejo & Actas */}
              <Link
                to="/gobernanza"
                className="navbar-btn-tactile"
                title="Concejo & Actas"
                aria-label="Concejo & Actas"
                style={{
                  textDecoration: 'none',
                  color: location.pathname === '/gobernanza' ? '#FFFFFF' : '#CBD5E1',
                  backgroundColor: location.pathname === '/gobernanza' ? 'rgba(0, 20, 137, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                  border: location.pathname === '/gobernanza' ? '1px solid rgba(121, 166, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.5rem 0.95rem',
                  minHeight: '44px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.4)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/gobernanza') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#CBD5E1';
                  }
                }}
              >
                <Vote size={16} color="#38BDF8" />
                <span className="nav-btn-text">Concejo & Actas</span>
              </Link>

              {/* Servicio 3: Reportar Avería */}
              <Link
                to="/reportar-incidencia"
                className="navbar-btn-tactile"
                title="Reportar Avería"
                aria-label="Reportar Avería"
                style={{
                  textDecoration: 'none',
                  color: location.pathname === '/reportar-incidencia' ? '#FFFFFF' : '#CBD5E1',
                  backgroundColor: location.pathname === '/reportar-incidencia' ? 'rgba(218, 41, 28, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: location.pathname === '/reportar-incidencia' ? '1px solid rgba(255, 107, 107, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.5rem 0.95rem',
                  minHeight: '44px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.4)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/reportar-incidencia') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#CBD5E1';
                  }
                }}
              >
                <AlertTriangle size={16} color="#FF6B6B" />
                <span className="nav-btn-text">Reportar Avería</span>
              </Link>
            </nav>

            {/* LADO DERECHO: CONMUTADOR TEMA + BOTÓN SOS 911 + BOTÓN MENÚ + */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
              {/* Botón Conmutador de Modo Claro / Modo Oscuro (Área táctil de 44px) */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Cambiar a Modo Claro (Sede Electrónica Oficial)' : 'Cambiar a Modo Oscuro (Sovereign Glass)'}
                title={theme === 'dark' ? 'Cambiar a Modo Claro (Sede Electrónica Oficial)' : 'Cambiar a Modo Oscuro (Sovereign Glass)'}
                className="navbar-btn-tactile"
                style={{
                  background: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 20, 137, 0.08)',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(0, 20, 137, 0.25)',
                  color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 20, 137, 0.15)';
                  e.currentTarget.style.borderColor = '#79a6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 20, 137, 0.08)';
                  e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 20, 137, 0.25)';
                }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-700" />
                )}
              </button>

              {/* Botón Rojo Sobrio SOS 911 (Min 44px para móviles) */}
              <Link
                to="/seguridad-emergencias"
                aria-label="Centro de Seguridad y Auxilio de Emergencias 911"
                className="navbar-btn-sos"
                style={{
                  textDecoration: 'none',
                  color: '#FF6B6B',
                  backgroundColor: 'rgba(218, 41, 28, 0.14)',
                  border: '1px solid rgba(218, 41, 28, 0.4)',
                  padding: '0.45rem 0.85rem',
                  minHeight: '44px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.28)';
                  e.currentTarget.style.borderColor = '#DA291C';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(218, 41, 28, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.14)';
                  e.currentTarget.style.borderColor = 'rgba(218, 41, 28, 0.4)';
                  e.currentTarget.style.color = '#FF6B6B';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#DA291C',
                    boxShadow: '0 0 8px #DA291C',
                    display: 'inline-block'
                  }}
                />
                <span>SOS 911</span>
              </Link>

              {/* Botón Soberano MENÚ + (Garantizado siempre visible sin desbordar) */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-expanded={isMenuOpen}
                aria-label="Abrir menú de navegación a pantalla completa"
                className="navbar-btn-menu"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: '#FFFFFF',
                  padding: '0.48rem 1.15rem',
                  minHeight: '44px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.25s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.35)';
                  e.currentTarget.style.borderColor = '#79a6ff';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 20, 137, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>{t('menuBoton') || 'MENÚ'}</span>
                <span style={{ fontSize: '1rem', fontWeight: 300, color: '#79a6ff' }}>+</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================================================
          3. MODAL DESPLEGABLE EN VIDRIO: SELECTOR DE LOS 84 CANTONES DE COSTA RICA
          Fondo translúcido · Filtro por Provincia · Búsqueda en tiempo real
          ========================================================================== */}
      {isCantonModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Seleccionar Gobierno Local Cantonal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            backgroundColor: 'rgba(0, 4, 13, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 'clamp(3.5rem, 8vw, 5.5rem) clamp(0.75rem, 3vw, 1.5rem) 2rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCantonModalOpen(false);
          }}
        >
          <div
            ref={modalRef}
            style={{
              width: '100%',
              maxWidth: '860px',
              backgroundColor: 'rgba(0, 10, 28, 0.94)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '24px',
              boxShadow: '0 30px 80px rgba(0, 4, 13, 0.95), 0 0 40px rgba(0, 20, 137, 0.35)',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              color: '#FFFFFF',
              maxHeight: '82vh',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxSizing: 'border-box'
            }}
          >
            {/* Cabecera del Modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#79a6ff',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}
                >
                  Sistema Nacional de Gobiernos Locales
                </span>
                <h2
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    margin: 0,
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-headline, sans-serif)'
                  }}
                >
                  Seleccionar Gobierno Local Cantonal
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCantonModalOpen(false)}
                aria-label="Cerrar selector de cantones"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.25)';
                  e.currentTarget.style.borderColor = '#DA291C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Barra de Búsqueda de Cantón */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '14px',
                padding: '0.65rem 1rem',
                gap: '0.75rem'
              }}
            >
              <Search size={18} color="#79a6ff" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={cantonSearch}
                onChange={(e) => setCantonSearch(e.target.value)}
                placeholder="Buscar entre los 84 cantones (ej: Escazú, San Carlos, Monteverde, Jiménez)..."
                aria-label="Buscar cantón oficial"
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  width: '100%',
                  outline: 'none'
                }}
              />
              {cantonSearch && (
                <button
                  type="button"
                  onClick={() => setCantonSearch('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Píldoras de Filtro por Provincia (7 Provincias) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                overflowX: 'auto',
                paddingBottom: '0.35rem',
                scrollbarWidth: 'none'
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedProvinciaFilter(0)}
                style={{
                  background: selectedProvinciaFilter === 0 ? 'rgba(0, 20, 137, 0.6)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedProvinciaFilter === 0 ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: selectedProvinciaFilter === 0 ? '#FFFFFF' : '#94A3B8',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                Todas (84)
              </button>
              {PROVINCIAS_DATA.map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setSelectedProvinciaFilter(prov.id)}
                  style={{
                    background: selectedProvinciaFilter === prov.id ? 'rgba(0, 20, 137, 0.6)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedProvinciaFilter === prov.id ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: selectedProvinciaFilter === prov.id ? '#FFFFFF' : '#CBD5E1',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {prov.nombre} ({prov.cantonesCount})
                </button>
              ))}
            </div>

            {/* Rejilla de Cantones con Scroll Suave */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '0.65rem',
                paddingRight: '0.35rem'
              }}
            >
              {cantonesFiltrados.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                  No se encontraron cantones con el término "{cantonSearch}".
                </div>
              ) : (
                cantonesFiltrados.map((canton) => {
                  const isSelected = activeCanton.toLowerCase() === canton.nombre.toLowerCase();
                  const provNombre = getProvinciaNombre(canton.provinciaId);
                  return (
                    <button
                      key={`${canton.provinciaId}-${canton.id}`}
                      type="button"
                      onClick={() => handleSelectCanton(canton)}
                      style={{
                        textAlign: 'left',
                        background: isSelected ? 'rgba(0, 20, 137, 0.45)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '0.75rem 0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.09)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}>
                            {canton.nombre}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <span style={{ color: '#79a6ff', fontSize: '0.72rem', fontWeight: 600 }}>
                            {provNombre}
                          </span>
                          <span style={{ color: '#475569', fontSize: '0.7rem' }}>•</span>
                          <span style={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                            DTA {canton.codigoDta}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#002B7F',
                            border: '1px solid #79a6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Check size={14} color="#FFFFFF" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Pie del Modal */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                color: '#64748B'
              }}
            >
              <span>Mostrando {cantonesFiltrados.length} de 84 Gobiernos Locales autónomos</span>
              <span style={{ color: '#38BDF8', fontWeight: 600 }}>DTA / INEC / TSE Oficial</span>
            </div>
          </div>
        </div>
      )}

      {/* Menú a Pantalla Completa (Full Screen Navigation Overlay) */}
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
