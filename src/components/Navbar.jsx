import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Landmark,
  MapPin,
  Trophy,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  User,
  UserPlus,
  LogOut,
  LogIn,
  Menu
} from 'lucide-react';
import Logo from './common/Logo';
import MegaMenu, { CATEGORIAS_CIVICAS } from './navigation/MegaMenu';
import CivicDrawer from './navigation/CivicDrawer';
import { useAuth, PROVINCIAS_COSTA_RICA, normalizarRolOficial } from '../context/AuthContext';
import { useCivicModal } from '../context/CivicModalContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * NAVBAR SOBERANO — ARQUITECTURA HÍBRIDA GOVTECH (MEGA MENÚ + CIVIC DRAWER)
 * Cumple con estándares de diseño institucional cívico:
 * 1. Mega Menú en Desktop (>= 1024px) con 4 categorías y paneles translúcidos.
 * 2. Cajón Lateral Deslizante (Civic Drawer): navegación en móvil y Centro de Utilidades en Desktop.
 * 3. Acciones de sesión y registro directo en el menú principal.
 * 4. Cero emojis — Exclusivamente iconos vectoriales de lucide-react (strokeWidth={1.75}).
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  // Detección estricta de vista administrativa:
  const isAdminPath = location.pathname.startsWith('/admin');
  const userRoleNorm = normalizarRolOficial(user?.rol);
  const isAdminRole =
    userRoleNorm === 'GESTOR_TERRITORIAL' ||
    userRoleNorm === 'SUPER_ADMIN_NACIONAL' ||
    user?.rol === 'Super Administrador Nacional' ||
    user?.rol === 'Gestor Territorial y Municipal';
  const isPublicVisitor = (!isAuthenticated || !user) && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/registro');
  const isVistaAdministrativa = isAdminPath || (isAuthenticated && isAdminRole && !isPublicVisitor);

  // Nombre de la jurisdicción institucional para la pastilla central
  const provinciaObj = PROVINCIAS_COSTA_RICA?.find((p) => String(p.id) === String(user?.provinciaId));
  const jurisdiccionLabel = (user?.provincia || user?.provinciaNombre || provinciaObj?.nombre || 'Puntarenas').toUpperCase();

  const confirmarSalida = () => {
    logout();
    navigate('/');
  };

  // Estado del Mega Menú en Desktop
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const hoverTimeoutRef = useRef(null);

  // Estado del Cajón Lateral (Civic Drawer)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('utilidades');

  // Estado del cantón activo para el indicador institucional
  const [activeCanton, setActiveCanton] = useState(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setCategoriaActiva(null);
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Escuchar cambios de cantón
  useEffect(() => {
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) {
        setActiveCanton(e.detail.nombre);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  // Manejo de Hover seguro con debounce para el Mega Menú
  const handleMouseEnterCategoria = (catId) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setCategoriaActiva(catId);
  };

  const handleMouseLeaveNav = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setCategoriaActiva(null);
    }, 150);
  };

  const handleToggleCategoria = (catId) => {
    setCategoriaActiva((prev) => (prev === catId ? null : catId));
  };

  const handleOpenDrawer = (tab = 'utilidades') => {
    setCategoriaActiva(null);
    setDrawerTab(tab);
    setIsDrawerOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ==========================================================================
  // RENDERIZADO EXCLUSIVO: HEADER ADMINISTRATIVO MINIMALISTA
  // Estética Sovereign Civic Glass v2.1
  // ==========================================================================
  if (isVistaAdministrativa) {
    return (
      <>
        <header
          className="sticky top-0 left-0 right-0 z-50 transition-all"
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)'
          }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-3">
            {/* 1. EXTREMO IZQUIERDO: Isotipo y Texto Oficial (Sin Botón Hamburguesa) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Logo showText={false} size="32px" />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[13px] sm:text-sm tracking-wider uppercase leading-none">
                    COSTA RICA UNIDOS
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">
                    PLATAFORMA CÍVICA
                  </span>
                </div>
              </div>
            </div>

            {/* 2. CENTRO: Pastilla Institucional Translúcida en JetBrains Mono */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-2">
              <div
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  color: '#F59E0B',
                  boxShadow: '0 0 14px rgba(245, 158, 11, 0.12)'
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-2"
              >
                <ShieldCheck size={14} className="text-amber-400" />
                <span>[NIVEL 4] GESTOR TERRITORIAL Y MUNICIPAL | COSTA RICA UNIDOS</span>
              </div>
            </div>

            {/* 3. EXTREMO DERECHO: Badge Estado En Línea + Identificador del Usuario Activo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Badge de estado del sistema (punto verde con pulso luminoso "EN LÍNEA") */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#34D399'
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#34d399]" />
                </span>
                <span className="hidden sm:inline">EN LÍNEA</span>
              </div>

              {/* Identificador del usuario: avatar o inicial con nombre del administrador activo */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-[10px] border border-amber-500/30">
                  {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-white leading-tight">
                    {user?.nombre || 'Coordinación Territorial'}
                  </span>
                  <span className="text-[9px] text-amber-400 font-mono">
                    {user?.id || 'USR-TERR-001'} • GESTOR_TERRITORIAL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-50 bg-[#070D1B] border-b border-slate-800 transition-colors"
        onMouseLeave={handleMouseLeaveNav}
        style={{
          backgroundColor: '#070D1B',
          opacity: 1,
          boxShadow: '0 10px 30px rgba(0, 4, 13, 0.95)'
        }}
      >
        {/* ======================================================================
            1. CINTILLO SUPERIOR DE ESTADO (TOP BAR - 28px)
            Pabellón tricolor patrio sutil y leyenda de soberanía republicana
            ====================================================================== */}
        <div className="h-7 bg-[#000818] border-b border-white/[0.08] relative flex items-center justify-between px-4 md:px-8 text-[11px] text-slate-400 font-semibold tracking-wider uppercase overflow-hidden">
          {/* Sub-cinta tricolor oficial (Azul, Blanco, Rojo, Blanco, Azul) */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
            }}
          />

          {/* Leyenda institucional */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="text-slate-200 font-bold">{t('republicaCostaRica', 'REPÚBLICA DE COSTA RICA')}</span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:inline">
              {t('sistemaGobiernosLocales', 'SISTEMA NACIONAL DE GOBIERNOS LOCALES')}
            </span>
          </div>

          {/* Indicador de Transparencia & Cantón Activo */}
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <button
              type="button"
              onClick={() => handleOpenDrawer('utilidades')}
              data-tour="selector-canton"
              className="hover:text-sky-300 transition-colors flex items-center gap-1 focus:outline-none ring-offset-2 focus:ring-1 focus:ring-sky-400 rounded-md px-1"
              title="Abrir selector de los 84 cantones"
            >
              <MapPin className="w-3 h-3 text-sky-400" strokeWidth={1.75} />
              <span>{t('cantonLabel', 'Cantón:')} <strong className="text-white">{activeCanton}</strong></span>
            </button>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-sky-400 font-bold hidden md:inline">{t('cantonesAutonomos', '84 CANTONES AUTÓNOMOS')}</span>
          </div>
        </div>

        {/* ======================================================================
            2. BARRA PRINCIPAL DEL NAVBAR (68px)
            ====================================================================== */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-3 xl:px-6 h-[68px] flex items-center justify-between gap-1.5 xl:gap-3">
          {/* LADO IZQUIERDO: LOGOTIPO OFICIAL */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Logo showText={true} size="36px" />
          </div>

          {/* CENTRO: 4 CATEGORÍAS CÍVICAS HORIZONTALES (DESKTOP >= 1024px) */}
          <nav
            aria-label="Navegación Cívica Principal"
            data-tour="nav-institucional"
            className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 p-1 rounded-2xl"
          >
            {CATEGORIAS_CIVICAS.map((cat) => {
              const IconoCat = cat.icon;
              const isActivo = categoriaActiva === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => handleMouseEnterCategoria(cat.id)}
                  onClick={() => handleToggleCategoria(cat.id)}
                  aria-expanded={isActivo}
                  aria-haspopup="true"
                  className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold transition-all duration-200 flex items-center gap-1 xl:gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isActivo
                      ? 'bg-red-500/15 text-white border border-red-500/40 shadow-lg shadow-red-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <IconoCat
                    className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-colors ${
                      isActivo ? 'text-red-500' : 'text-slate-400'
                    }`}
                    strokeWidth={1.75}
                  />
                  <span>
                    {cat.id === 'tramites'
                      ? t('navTramites', cat.label)
                      : cat.id === 'gobierno'
                      ? t('navGobierno', cat.label)
                      : cat.id === 'territorio'
                      ? t('navTerritorio', cat.label)
                      : t('navComunidad', cat.label)}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-200 ${
                      isActivo ? 'rotate-180 text-red-500' : 'text-slate-500'
                    }`}
                    strokeWidth={1.75}
                  />
                </button>
              );
            })}
          </nav>

          {/* LADO DERECHO: ACCIONES CÍVICAS (PANEL CÍVICO + MI PERFIL / CERRAR SESIÓN / REGISTRARSE / INICIAR SESIÓN) */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">

            {/* EN DESKTOP (>= 1024px): BOTÓN VIDRIO ESMERILADO [ Panel Cívico ] */}
            <button
              type="button"
              onClick={() => handleOpenDrawer('utilidades')}
              data-tour="panel-civico-btn"
              aria-label="Abrir centro de utilidades y panel cívico"
              className="hidden lg:inline-flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full bg-white/[0.05] hover:bg-sky-500/20 border border-white/15 hover:border-sky-500/50 text-slate-200 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <User className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-sky-400" strokeWidth={1.75} />
              <span>{t('navPanelCivico', 'Panel Cívico')}</span>
              {isAuthenticated && user && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              )}
            </button>

            {/* BLOQUE DE IDENTIFICACIÓN Y ACCESO CÍVICO (INICIAR SESIÓN / CERRAR SESIÓN) */}
            <div className="flex items-center gap-1 sm:gap-1.5" data-tour="registro-login-btn">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Pastilla Ciudadana con Nombre Oficial */}
                  <Link
                    to="/portal-ciudadano"
                    aria-label={`Perfil cívico de ${user.nombre || 'Ciudadano'}`}
                    title={`Ciudadano autenticado: ${user.nombre || 'Eiker Abarca'}`}
                    className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={1.75} />
                    <span className="max-w-[120px] sm:max-w-[160px] truncate">
                      {user.nombre?.split(' ')[0]} {user.nombre?.split(' ')[1] || (user.nombre?.includes('Abarca') ? 'Abarca' : '')}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  </Link>

                  {/* Botón Cerrar Sesión */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Cerrar sesión activa"
                    title="Cerrar Sesión"
                    className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" strokeWidth={1.75} />
                    <span className="hidden sm:inline lg:hidden xl:inline">{t('navCerrarSesion', 'Cerrar Sesión')}</span>
                  </button>
                </div>
              ) : (
                /* ÚNICO BOTÓN DE ACCESO: APUNTA DIRECTAMENTE A /login */
                <Link
                  to="/login"
                  aria-label="Iniciar sesión en la plataforma cívica institucional"
                  title="Iniciar Sesión"
                  className="inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 hover:border-sky-400 text-sky-300 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.75} />
                  <span className="hidden sm:inline lg:hidden xl:inline">{t('navIniciarSesion', 'Iniciar Sesión')}</span>
                </Link>
              )}
            </div>

            {/* EN MÓVILES (< 1024px): BOTÓN HAMBURGUESA QUE ABRE EL CIVIC DRAWER */}
            <button
              type="button"
              onClick={() => handleOpenDrawer('navegacion')}
              aria-label="Abrir menú de navegación y panel cívico"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-200" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* ======================================================================
            3. MEGA MENÚ DESPLEGABLE EN DESKTOP (SUB-PANEL TRANSLÚCIDO)
            ====================================================================== */}
        <MegaMenu
          categoriaActiva={categoriaActiva}
          alCerrar={() => setCategoriaActiva(null)}
        />
      </header>

      {/* ======================================================================
          4. CAJÓN LATERAL DESLIZANTE (CIVIC DRAWER)
          ====================================================================== */}
      <CivicDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialTab={drawerTab}
      />
    </>
  );
}
