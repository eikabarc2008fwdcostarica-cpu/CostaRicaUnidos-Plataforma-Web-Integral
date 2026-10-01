import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Landmark,
  MapPin,
  Trophy,
  ChevronDown,
  ShieldAlert,
  User,
  UserPlus,
  LogOut,
  LogIn,
  Menu
} from 'lucide-react';
import Logo from './common/Logo';
import MegaMenu, { CATEGORIAS_CIVICAS } from './navigation/MegaMenu';
import CivicDrawer from './navigation/CivicDrawer';
import { useAuth } from '../context/AuthContext';
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

  const confirmarSalida = () => {
    solicitarConfirmacion({
      titulo: 'Confirmación de Cierre de Sesión',
      mensaje: '¿Está seguro de que desea cerrar su sesión institucional en Costa Rica Unidos? Deberá autenticar sus credenciales nuevamente para acceder al sistema.',
      icono: 'advertencia',
      textoBotonAceptar: 'Cerrar Sesión',
      textoBotonCancelar: 'Permanecer Conectado',
      onAceptar: () => {
        logout();
        navigate('/');
      }
    });
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
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
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

          {/* LADO DERECHO: SOS 911 + ACCIONES (REGISTRARSE / CERRAR SESIÓN) + PANEL CÍVICO (DESKTOP) / MENÚ (MÓVIL) */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 xl:gap-2.5 flex-shrink-0">
            {/* Botón SOS 911 en Rojo Sobrio */}
            <Link
              to="/seguridad-emergencias"
              aria-label="Centro de Seguridad y Auxilio de Emergencias 911"
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 xl:px-3 xl:py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 hover:border-red-500 text-red-400 hover:text-white text-[11px] xl:text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1 xl:gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" strokeWidth={1.75} />
              <span className="hidden sm:inline">{t('navSos', 'SOS 911')}</span>
              <span className="sm:hidden">911</span>
            </Link>

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

            {/* BLOQUE DE IDENTIFICACIÓN Y REGISTRO CIUDADANO (REGISTRARSE / INICIAR SESIÓN) */}
            <div className="flex items-center gap-1 sm:gap-1.5" data-tour="registro-login-btn">
              {/* BOTÓN REGISTRARSE EN LA BARRA DEL MENÚ PRINCIPAL */}
              <Link
                to="/registro"
                aria-label="Registrarse en la plataforma cívica institucional"
                title="Registrarse"
                className="inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 hover:border-sky-400 text-sky-300 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.75} />
                <span className="hidden sm:inline lg:hidden xl:inline">{t('navRegistrarse', 'Registrarse')}</span>
              </Link>

              {/* BOTÓN CERRAR SESIÓN (CUANDO HAY SESIÓN ACTIVA) / INICIAR SESIÓN (SI ESTÁ LOGUEADO COMO ANÓNIMO) */}
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión activa"
                  title="Cerrar Sesión"
                  className="inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" strokeWidth={1.75} />
                  <span className="hidden sm:inline lg:hidden xl:inline">{t('navCerrarSesion', 'Cerrar Sesión')}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  aria-label="Iniciar sesión en la plataforma cívica"
                  title="Iniciar Sesión"
                  className="inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/35 text-slate-200 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.75} />
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
