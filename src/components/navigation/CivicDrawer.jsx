import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Shield,
  ShieldAlert,
  LogOut,
  LogIn,
  Search,
  Check,
  Sun,
  Moon,
  Globe,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  ChevronRight,
  MapPin,
  Building2,
  Sliders,
  FileCheck2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import Logo from '../common/Logo';
import { CATEGORIAS_CIVICAS } from './MegaMenu';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../accessibility';
import { IDIOMAS_SOPORTADOS } from '../accessibility/accessibilityData';
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../../data/costaRicaTerritorialData';

export default function CivicDrawer({ isOpen, onClose, initialTab }) {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, officialRoleName } = useAuth();
  const { idioma, cambiarIdioma, t } = useLanguage();
  const {
    textPhase,
    setTextPhase,
    selectedLang,
    setSelectedLang,
    speakText,
    stopSpeaking,
    isSpeaking,
    readCurrentPage,
    openOnboarding
  } = useAccessibility();

  // Control de pestaña interna (en desktop o móvil)
  // 'utilidades' | 'navegacion'
  const [activeTab, setActiveTab] = useState('utilidades');

  // Si cambia initialTab desde el padre, sincronizar
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Acordeón de navegación móvil: ID de categoría expandida
  const [acordeonAbierto, setAcordeonAbierto] = useState('tramites');

  // Estado del cantón activo
  const [activeCanton, setActiveCanton] = useState(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  // Buscador de cantones
  const [cantonSearch, setCantonSearch] = useState('');
  const [provinciaFilter, setProvinciaFilter] = useState(0); // 0 = todas

  // Tema Claro / Oscuro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('cr_theme');
      if (savedTheme) return savedTheme === 'dark';
      return document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');
    } catch {
      return true;
    }
  });

  // Sincronizar tema con <html>
  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    try {
      if (nextMode) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('cr_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('cr_theme', 'light');
      }
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: nextMode } }));
    } catch (e) {
      console.warn('Error al cambiar tema:', e);
    }
  };

  // Manejar tecla Escape y bloqueo de scroll
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

  // Escuchar cambios de cantón desde otros componentes
  useEffect(() => {
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) {
        setActiveCanton(e.detail.nombre);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  // Seleccionar un cantón
  const handleSelectCanton = (canton) => {
    setActiveCanton(canton.nombre);
    try {
      localStorage.setItem('cr_canton_activo', canton.nombre);
      localStorage.setItem('cr_canton_id', canton.id.toString());
      localStorage.setItem('cr_provincia_id', canton.provinciaId.toString());
      window.dispatchEvent(new CustomEvent('cantonChanged', { detail: canton }));
    } catch (e) {
      console.warn('Error al guardar cantón en localStorage:', e);
    }
  };

  // Seleccionar idioma sincronizando LanguageContext y AccessibilityContext
  const handleSelectLanguage = (langItem) => {
    cambiarIdioma(langItem.bandera);
    setSelectedLang(langItem.codigo);
  };

  // Filtrado reactivo de los 84 cantones
  const cantonesFiltrados = CANTONES_OFICIALES.filter((c) => {
    const coincideProv = provinciaFilter === 0 || c.provinciaId === provinciaFilter;
    const searchLower = cantonSearch.toLowerCase().trim();
    const coincideBusqueda =
      !searchLower ||
      c.nombre.toLowerCase().includes(searchLower) ||
      c.cabecera.toLowerCase().includes(searchLower) ||
      c.codigoDta.includes(searchLower);
    return coincideProv && coincideBusqueda;
  });

  const getNombreProvincia = (provId) => {
    const p = PROVINCIAS_DATA.find((item) => item.id === provId);
    return p ? p.nombre : '';
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel Cívico y Navegación Institucional"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Fondo oscuro difuminado (Backdrop) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Contenedor del Cajón Lateral (420px max) */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#00040D]/95 dark:bg-[#00040D]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-300 ease-out animate-slideLeft"
        style={{
          boxShadow: '-10px 0 40px rgba(0, 4, 13, 0.85)'
        }}
      >
        {/* ======================================================================
            CABECERA DEL CAJÓN
            ====================================================================== */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div onClick={onClose} className="cursor-pointer">
            <Logo size="36px" showText={true} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel lateral"
            className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Conmutador de Pestañas: Móvil muestra ambas, Desktop prioriza Utilidades */}
        <div className="flex border-b border-white/10 bg-white/[0.01]">
          <button
            type="button"
            onClick={() => setActiveTab('utilidades')}
            className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'utilidades'
                ? 'border-sky-500 text-sky-400 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <Sliders className="w-4 h-4" strokeWidth={1.75} />
            <span>Panel Cívico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('navegacion')}
            className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'navegacion'
                ? 'border-red-500 text-red-400 bg-red-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <Building2 className="w-4 h-4" strokeWidth={1.75} />
            <span>Navegación</span>
          </button>
        </div>

        {/* ======================================================================
            CONTENIDO SCROLLEABLE
            ====================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-slate-200">
          {activeTab === 'utilidades' ? (
            /* ==================================================================
               MODO CENTRO DE UTILIDADES CÍVICAS (DESKTOP & MÓVIL)
               ================================================================== */
            <div className="space-y-6">
              {/* 1. FICHA DE USUARIO / SESIÓN ACTIVA */}
              <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                    <User className="w-4 h-4" strokeWidth={1.75} />
                    <span>Identidad & Cédula</span>
                  </div>
                  {isAuthenticated && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                      <FileCheck2 className="w-3 h-3" strokeWidth={1.75} />
                      Hacienda OK
                    </span>
                  )}
                </div>

                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-bold text-sm">
                          {user.nombre}
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Cédula: <span className="text-slate-200 font-mono">{user.cedula}</span>
                        </p>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                        Nivel {user.nivelAcceso || 2}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                      <Shield className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" strokeWidth={1.75} />
                      <span className="truncate">
                        Rol: <strong className="text-slate-200">{officialRoleName || user.rol || 'Ciudadano'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to="/dashboard"
                        onClick={onClose}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>Mi Ventanilla</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                        }}
                        className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>Salir</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Accede con tu cédula oficial para consultar trámites, estado tributario y certificados validados ante Hacienda.
                    </p>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/login"
                        onClick={onClose}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>Iniciar Sesión</span>
                      </Link>
                      <Link
                        to="/registro"
                        onClick={onClose}
                        className="py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-xs transition-colors"
                      >
                        Registrarse
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. SELECTOR DEL GOBIERNO LOCAL ACTIVO (84 CANTONES) */}
              <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                    <MapPin className="w-4 h-4" strokeWidth={1.75} />
                    <span>Gobierno Local Activo</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    84 Cantones
                  </span>
                </div>

                <div className="bg-white/[0.03] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Cantón Seleccionado:</span>
                    <h4 className="text-white font-black text-sm">
                      Municipalidad de {activeCanton}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Building2 className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                </div>

                {/* Input de Búsqueda */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
                  <input
                    type="text"
                    value={cantonSearch}
                    onChange={(e) => setCantonSearch(e.target.value)}
                    placeholder="Buscar cantón o código DTA..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-sky-500 transition-colors"
                  />
                  {cantonSearch && (
                    <button
                      type="button"
                      onClick={() => setCantonSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  )}
                </div>

                {/* Filtro rápido por Provincias */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setProvinciaFilter(0)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      provinciaFilter === 0
                        ? 'bg-sky-500 text-white'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    Todas
                  </button>
                  {PROVINCIAS_DATA.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setProvinciaFilter(prov.id)}
                      className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                        provinciaFilter === prov.id
                          ? 'bg-sky-500 text-white'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white'
                      }`}
                    >
                      {prov.nombre}
                    </button>
                  ))}
                </div>

                {/* Lista Scrolleable de Cantones (Altura fija) */}
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 border border-white/5 rounded-xl p-1 bg-black/30">
                  {cantonesFiltrados.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-4">
                      No se encontraron cantones con '{cantonSearch}'
                    </p>
                  ) : (
                    cantonesFiltrados.map((canton) => {
                      const isSelected = canton.nombre === activeCanton;
                      const provNombre = getNombreProvincia(canton.provinciaId);
                      return (
                        <button
                          key={`${canton.provinciaId}-${canton.id}`}
                          type="button"
                          onClick={() => handleSelectCanton(canton)}
                          className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                            isSelected
                              ? 'bg-sky-500/20 border border-sky-500/40 text-white font-bold'
                              : 'hover:bg-white/[0.06] text-slate-300'
                          }`}
                        >
                          <div>
                            <span className="font-semibold">{canton.nombre}</span>
                            <span className="text-[10px] text-slate-400 ml-2">
                              {provNombre} • DTA {canton.codigoDta}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" strokeWidth={2} />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 3. CONMUTADOR DE TEMA CLARO / OSCURO */}
              <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-0.5">
                    Modo Visual
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isDarkMode ? 'Tema Oscuro Obsidiana' : 'Tema Claro Institucional'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
                  className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white flex items-center gap-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
                      <span>Modo Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-sky-400" strokeWidth={1.75} />
                      <span>Modo Oscuro</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4. SELECTOR DE ESCALA DE TEXTO (4 FASES) */}
              <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Escala Tipográfica (Ley 7600)
                  </div>
                  <span className="text-[11px] text-sky-400 font-bold">
                    Fase {textPhase} de 4
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { fase: 1, label: '100%', tag: 'Base' },
                    { fase: 2, label: '125%', tag: 'Media' },
                    { fase: 3, label: '150%', tag: 'Alta' },
                    { fase: 4, label: '200%', tag: 'Máxima' }
                  ].map((f) => (
                    <button
                      key={f.fase}
                      type="button"
                      onClick={() => setTextPhase(f.fase)}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        textPhase === f.fase
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold shadow-lg shadow-sky-500/20'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="text-xs font-bold">{f.label}</div>
                      <div className="text-[10px] opacity-75">{f.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. SELECTOR DE LOS 8 IDIOMAS OFICIALES */}
              <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Globe className="w-4 h-4 text-sky-400" strokeWidth={1.75} />
                    <span>Idiomas Oficiales</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    8 Idiomas
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {IDIOMAS_SOPORTADOS.map((item) => {
                    const isSelected = idioma === item.bandera;
                    return (
                      <button
                        key={item.codigo}
                        type="button"
                        onClick={() => handleSelectLanguage(item)}
                        className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-500 text-white font-bold'
                            : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-6 h-5 rounded bg-white/10 text-slate-200 text-[10px] font-mono font-bold flex items-center justify-center border border-white/10 flex-shrink-0">
                            {item.bandera}
                          </span>
                          <span className="text-xs truncate">{item.nombre}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 ml-1" strokeWidth={2} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. BOTÓN DE ASISTENCIA POR VOZ */}
              <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Volume2 className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                    <span>Asistencia por Voz (TTS)</span>
                  </div>
                  {isSpeaking && (
                    <span className="text-[11px] text-emerald-400 animate-pulse font-semibold">
                      Reproduciendo...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        readCurrentPage();
                      }
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                      isSpeaking
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4" strokeWidth={1.75} />
                        <span>Detener Lectura</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" strokeWidth={1.75} />
                        <span>Leer Pantalla Actual</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openOnboarding();
                    }}
                    title="Abrir guía asistida por voz interactiva"
                    className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.75} />
                    <span>Guía</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ==================================================================
               MODO NAVEGACIÓN MÓVIL (ACORDEONES TÁCTILES CÍVICOS)
               ================================================================== */
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Módulos del Sistema Nacional
              </div>

              {CATEGORIAS_CIVICAS.map((cat) => {
                const IconoCat = cat.icon;
                const estaAbierto = acordeonAbierto === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setAcordeonAbierto(estaAbierto ? null : cat.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                          <IconoCat className="w-4 h-4" strokeWidth={1.75} />
                        </div>
                        <span className="font-bold text-white text-sm">
                          {cat.label}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          estaAbierto ? 'rotate-180' : ''
                        }`}
                        strokeWidth={1.75}
                      />
                    </button>

                    {estaAbierto && (
                      <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3 animate-fadeIn">
                        {cat.modulos.map((mod) => {
                          const IconoMod = mod.icon;
                          return (
                            <Link
                              key={mod.titulo}
                              to={mod.path}
                              onClick={onClose}
                              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-red-500/40 flex items-start gap-3 transition-all group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                <IconoMod className="w-4 h-4" strokeWidth={1.75} />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-white font-semibold text-xs group-hover:text-red-400 transition-colors">
                                  {mod.titulo}
                                </h5>
                                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                                  {mod.desc}
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 flex-shrink-0 mt-1 transition-colors" strokeWidth={1.75} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Acceso Rápido a Centro SOS 911 en Móvil */}
              <Link
                to="/seguridad-emergencias"
                onClick={onClose}
                className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-between hover:bg-red-500/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" strokeWidth={1.75} />
                  <span>Centro de Auxilio & SOS 911</span>
                </div>
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            </div>
          )}
        </div>

        {/* ======================================================================
            PIE INSTITUCIONAL DEL CAJÓN
            ====================================================================== */}
        <div className="p-4 border-t border-white/10 bg-black/40 text-[11px] text-slate-500 flex items-center justify-between">
          <span>República de Costa Rica</span>
          <span className="text-sky-400 font-mono font-semibold">DTA Ley 8968</span>
        </div>
      </div>
    </div>
  );
}
