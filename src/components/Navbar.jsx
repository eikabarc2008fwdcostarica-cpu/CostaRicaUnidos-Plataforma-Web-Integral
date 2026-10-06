import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Landmark,
  MapPin,
  Trophy,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import Logo, { Isotipo } from './common/Logo';
import MegaMenu, { CATEGORIAS_CIVICAS } from './navigation/MegaMenu';
import { useAuth, PROVINCIAS_COSTA_RICA, normalizarRolOficial } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from './accessibility/AccessibilityContext';
import DaltonismoSvgFilters from './accessibility/DaltonismoSvgFilters';
import CNEGlobalMarqueeAlert from './common/CNEGlobalMarqueeAlert';

// Coordenadas de referencia de cabeceras cantonales
const COORDENADAS_CANTONES = [
  { provincia: "Puntarenas", canton: "Puntarenas", lat: 9.9763, lng: -84.8384 },
  { provincia: "Puntarenas", canton: "Esparza", lat: 9.9937, lng: -84.6667 },
  { provincia: "Puntarenas", canton: "Garabito", lat: 9.6167, lng: -84.6333 },
  { provincia: "Puntarenas", canton: "Quepos", lat: 9.4319, lng: -84.1619 },
  { provincia: "Puntarenas", canton: "Golfito", lat: 8.6367, lng: -83.1678 },
  { provincia: "San José", canton: "San José", lat: 9.9281, lng: -84.0907 },
  { provincia: "San José", canton: "Escazú", lat: 9.9167, lng: -84.1333 },
  { provincia: "Alajuela", canton: "Alajuela", lat: 10.0163, lng: -84.2116 },
  { provincia: "Cartago", canton: "Cartago", lat: 9.8644, lng: -83.9194 },
  { provincia: "Heredia", canton: "Heredia", lat: 9.9986, lng: -84.1169 },
  { provincia: "Guanacaste", canton: "Liberia", lat: 10.6346, lng: -85.4406 },
  { provincia: "Limón", canton: "Limón", lat: 9.9907, lng: -83.0360 }
];

function obtenerCantonMasCercano(userLat, userLng) {
  let masCercano = COORDENADAS_CANTONES[0];
  let menorDistancia = Infinity;

  COORDENADAS_CANTONES.forEach((item) => {
    const d = Math.hypot(item.lat - userLat, item.lng - userLng);
    if (d < menorDistancia) {
      menorDistancia = d;
      masCercano = item;
    }
  });
  return masCercano;
}

/**
 * NAVBAR SOBERANO — ARQUITECTURA HÍBRIDA GOVTECH
 * Utilidades esenciales integradas directamente en el Topbar:
 * 1. Botón Minimalista de Modo Oscuro / Claro (Sol / Luna SVG).
 * 2. Menú Compacto de Accesibilidad Universal (Ley N° 7600):
 *    - Escala Tipográfica (A- 90%, A 100%, A+ 115%, A++ 130%).
 *    - Adaptación para Daltonismo (Normal, Protanopía, Deuteranopía, Tritanopía, Alto Contraste).
 *    - Idiomas Oficiales de la República (ES, EN, Bribri).
 * 3. Mega Menú en Desktop (>= 1024px) con 4 categorías y paneles translúcidos.
 * 4. Navegación móvil compacta desplegable (sin cajones laterales ni overlays oscuros).
 * 5. Cero emojis — Exclusivamente SVG vectorial en línea con trazo fino.
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, cambiarIdioma, currentLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const {
    textPhase,
    setTextPhase,
    daltonismoMode,
    setDaltonismoMode,
    MODOS_DALTONISMO
  } = useAccessibility();

  // Detección estricta de vista administrativa:
  const esRutaAdmin = location.pathname.startsWith('/admin');
  const userNivel = Number(user?.nivelAcceso || 0);
  const userRoleStr = (user?.rol || '').toUpperCase();
  const esRolAdmin = userNivel >= 4 || userRoleStr.includes('SUPER') || userRoleStr.includes('TERRITORIAL');

  // CONDICIÓN ESTRICTA: Debe haber sesión real Y usuario en memoria Y ruta administrativa Y rol admin
  const esAdminAutenticado = Boolean(
    isAuthenticated && 
    user !== null && 
    esRutaAdmin && 
    esRolAdmin
  );
  const isVistaAdministrativa = esAdminAutenticado;

  // Estado del Modal de Doble Verificación en el Navbar:
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmarLogout = () => {
    setIsLogoutModalOpen(false);
    if (typeof logout === 'function') {
      logout();
    }
    navigate('/login');
  };

  // Cierre accesible del modal con tecla Escape
  useEffect(() => {
    if (!isLogoutModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLogoutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutModalOpen]);

  // Información del Rol y Enrutamiento Dinámico para "Volver a mi Interfaz" (Nivel 2, 3, 4 y 5)
  const getRoleInterfaceInfo = () => {
    const rolNorm = normalizarRolOficial(user?.rol) || '';
    const nivel = Number(user?.nivelAcceso || 0);

    // 1. Super Administrador Nacional (Nivel 5)
    if (nivel === 5 || rolNorm === 'SUPER_ADMIN_NACIONAL' || rolNorm.includes('SUPER') || rolNorm.includes('NACIONAL')) {
      return {
        path: '/admin/super',
        label: 'Volver a mi Interfaz',
        roleShort: 'Super Admin',
        roleFull: 'Super Administrador Nacional (Nivel 5)',
        themeClass: 'bg-red-500/15 hover:bg-red-500/25 border-red-500/40 hover:border-red-400 text-red-300 hover:text-white',
        badgeColor: '#EF4444',
        title: 'Super Administrador Nacional — Retornar al Centro de Mando Nacional'
      };
    }

    // 2. Gestor Territorial y Municipal (Nivel 4)
    if (nivel === 4 || rolNorm === 'GESTOR_TERRITORIAL' || rolNorm.includes('TERRITORIAL') || rolNorm.includes('PROVINCIAL')) {
      return {
        path: '/admin/territorial',
        label: 'Volver a mi Interfaz',
        roleShort: 'Gestor Territorial',
        roleFull: 'Gestor Territorial y Municipal (Nivel 4)',
        themeClass: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white',
        badgeColor: '#F59E0B',
        title: 'Gestor Territorial y Municipal — Retornar a la Consola de Mando Territorial'
      };
    }

    // 3. Comerciante y Emprendedor Local (Nivel 3)
    if (nivel === 3 || rolNorm === 'COMERCIANTE' || rolNorm.includes('COMERCIANTE') || rolNorm.includes('EMPRENDEDOR')) {
      return {
        path: '/portal-ciudadano',
        label: 'Volver a mi Interfaz',
        roleShort: 'Comerciante',
        roleFull: 'Comerciante y Emprendedor Local (Nivel 3)',
        themeClass: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white',
        badgeColor: '#10B981',
        title: 'Comerciante y Emprendedor — Retornar a la Sede Cívica y Comercial'
      };
    }

    // 4. Ciudadano Residente (Nivel 2 / Predeterminado)
    return {
      path: '/portal-ciudadano',
      label: 'Volver a mi Interfaz',
      roleShort: 'Ciudadano',
      roleFull: 'Ciudadano Residente (Nivel 2)',
      themeClass: 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/40 hover:border-sky-400 text-sky-300 hover:text-white',
      badgeColor: '#38BDF8',
      title: 'Ciudadano Residente — Retornar a mi Portal Cívico'
    };
  };

  const interfaceInfo = getRoleInterfaceInfo();

  // Estado del Mega Menú en Desktop
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const hoverTimeoutRef = useRef(null);

  // Estado del Popover de Accesibilidad
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const a11yPopoverRef = useRef(null);
  const a11yButtonRef = useRef(null);

  // Estado del Menú Móvil Desplegable
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Escala Tipográfica Actual
  const [currentScalePercent, setCurrentScalePercent] = useState(() => {
    try {
      return localStorage.getItem('cr_font_scale') || '100%';
    } catch {
      return '100%';
    }
  });

  // Idioma Activo Oficial (BCP-47 / ISO-639-1)
  const [activeLangCode, setActiveLangCode] = useState(() => {
    try {
      return localStorage.getItem('cru_bcp47_lang') || 'es-419';
    } catch {
      return 'es-419';
    }
  });

  // Estado del territorio y cantón activo (Geolocalización real o usuario autenticado)
  const [territorio, setTerritorio] = useState({ provincia: "Puntarenas", canton: "Puntarenas" });
  const activeCanton = territorio.canton;

  useEffect(() => {
    // Si el usuario está autenticado, priorizar su cantón registrado
    if (isAuthenticated && user?.canton && user?.provincia) {
      setTerritorio({ provincia: user.provincia, canton: user.canton });
      try {
        localStorage.setItem('cr_canton_activo', user.canton);
        localStorage.setItem('cr_provincia_activa', user.provincia);
      } catch {
        // ignore
      }
      return;
    }

    // Si no, solicitar geolocalización al navegador
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const detectado = obtenerCantonMasCercano(pos.coords.latitude, pos.coords.longitude);
          if (detectado) {
            setTerritorio({ provincia: detectado.provincia, canton: detectado.canton });
            try {
              localStorage.setItem('cr_canton_activo', detectado.canton);
              localStorage.setItem('cr_provincia_activa', detectado.provincia);
            } catch {
              // ignore
            }
            try {
              window.dispatchEvent(new CustomEvent('cantonChanged', { detail: { nombre: detectado.canton, provincia: detectado.provincia } }));
            } catch {
              // ignore
            }
          }
        },
        (err) => console.warn("Ubicación por defecto aplicada:", err.message),
        { timeout: 7000, enableHighAccuracy: true }
      );
    }
  }, [isAuthenticated, user]);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setCategoriaActiva(null);
    setIsA11yOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Escuchar cambios de cantón emitidos desde el resto de la aplicación
  useEffect(() => {
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) {
        setTerritorio(prev => ({
          provincia: e.detail.provincia || prev.provincia,
          canton: e.detail.nombre
        }));
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  // Cierre accesible del popover al hacer clic afuera o pulsar Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        a11yPopoverRef.current &&
        !a11yPopoverRef.current.contains(e.target) &&
        !a11yButtonRef.current?.contains(e.target)
      ) {
        setIsA11yOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isA11yOpen) {
        setIsA11yOpen(false);
      }
    }
    if (isA11yOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isA11yOpen]);

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

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  // Manejador de Escala de Tipografía
  const handleApplyScale = (percent, scale) => {
    setCurrentScalePercent(percent);
    document.documentElement.style.fontSize = percent;
    document.documentElement.style.setProperty('--font-scale', scale);
    document.documentElement.style.setProperty('--text-scale', scale);
    try {
      localStorage.setItem('cr_font_scale', percent);
    } catch {}
  };

  // Manejador de Daltonismo
  const handleDaltonismoChange = (mode) => {
    if (setDaltonismoMode) {
      setDaltonismoMode(mode);
    }
    if (typeof document !== 'undefined') {
      if (mode && mode !== 'normal') {
        document.documentElement.setAttribute('data-colorblind', mode);
        document.body.setAttribute('data-colorblind', mode);
        if (mode === 'achromatopsia') {
          document.body.style.filter = 'contrast(1.5) grayscale(1)';
          document.documentElement.style.filter = 'contrast(1.5) grayscale(1)';
        } else {
          document.body.style.filter = `url(#${mode})`;
          document.documentElement.style.filter = `url(#${mode})`;
        }
      } else {
        document.documentElement.removeAttribute('data-colorblind');
        document.body.removeAttribute('data-colorblind');
        document.body.style.filter = '';
        document.documentElement.style.filter = '';
      }
    }
  };

  // Manejador Oficial de Idioma (Estándar BCP-47 / ISO-639-1)
  const handleLanguageSelect = (code) => {
    setActiveLangCode(code);
    cambiarIdioma(code);
  };

  const currentDaltonismoLabel =
    MODOS_DALTONISMO?.find((m) => m.id === daltonismoMode)?.nombre ||
    (daltonismoMode === 'achromatopsia' ? 'Alto Contraste' : 'Normal');

  // ==========================================================================
  // MODAL DE DOBLE VERIFICACIÓN DE CIERRE DE SESIÓN OFICIAL
  // ==========================================================================
  const renderLogoutModal = () => {
    if (!isLogoutModalOpen) return null;

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-logout-titulo"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200"
        onClick={() => setIsLogoutModalOpen(false)}
      >
        <div
          className="w-full max-w-md rounded-2xl border border-[var(--cru-border,#E2E8F0)] bg-[var(--cru-surface,#FFFFFF)] p-6 shadow-2xl relative text-[var(--cru-text,#062A77)] overflow-hidden"
          style={{
            boxShadow: 'var(--cru-card-shadow-hover, 0 20px 45px rgba(6, 42, 119, 0.12))'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cinta tricolor decorativa superior oficial */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background:
                'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
            }}
          />

          {/* Cabecera con Icono Vectorial */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-500 mt-0.5">
              <LogOut className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                id="modal-logout-titulo"
                className="text-base font-bold text-[var(--cru-text,#062A77)] tracking-tight"
              >
                ¿Confirmar Cierre de Sesión?
              </h3>
              <p className="text-xs text-[var(--cru-text-soft,#64748B)] mt-0.5">
                Seguridad Cívica • Costa Rica Unidos
              </p>
            </div>
          </div>

          {/* Pastilla Informativa de la Cuenta Activa */}
          {user && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--cru-surface-muted,#F1F5F9)] border border-[var(--cru-border,#E2E8F0)] flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                <div className="truncate">
                  <span className="font-semibold text-[var(--cru-text,#062A77)] block truncate">{user.nombre}</span>
                  <span className="text-[11px] text-[var(--cru-text-soft,#64748B)] font-mono block truncate">
                    {user.correoPersonal || user.correo || user.email || 'Usuario Activo'}
                  </span>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider shrink-0"
                style={{
                  backgroundColor: `${interfaceInfo.badgeColor}20`,
                  color: interfaceInfo.badgeColor,
                  border: `1px solid ${interfaceInfo.badgeColor}40`
                }}
              >
                {interfaceInfo.roleShort}
              </span>
            </div>
          )}

          {/* Advertencia de Cierre de Sesión */}
          <p className="text-xs text-[var(--cru-text-soft,#64748B)] leading-relaxed mb-6">
            Está a punto de finalizar su sesión institucional. Sus credenciales y permisos temporales en este dispositivo serán revocados de forma segura. Para acceder nuevamente a los servicios y consolas, deberá iniciar sesión con sus credenciales oficiales.
          </p>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--cru-text-soft,#64748B)] hover:text-[var(--cru-text,#062A77)] bg-[var(--cru-surface-muted,#F1F5F9)] hover:bg-[var(--cru-border,#E2E8F0)] border border-[var(--cru-border,#CBD5E1)] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarLogout}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500 transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Confirmar Salida</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDERIZADO EXCLUSIVO: HEADER ADMINISTRATIVO MINIMALISTA
  // ==========================================================================
  if (isVistaAdministrativa) {
    return (
      <>
        <header
          className="sticky top-0 left-0 right-0 z-50 transition-all"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(5, 12, 28, 0.85)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)'
          }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-3">
            {/* 1. EXTREMO IZQUIERDO: Isotipo y Texto Oficial */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2.5 cursor-pointer select-none group no-underline"
                aria-label="Ir a la página principal de Costa Rica Unidos"
              >
                <Isotipo size="32px" />
                <div className="flex flex-col">
                  <span className={`font-bold text-[13px] sm:text-sm tracking-wider uppercase leading-none ${theme === 'dark' ? 'text-white' : 'text-[#062A77]'}`}>
                    COSTA RICA UNIDOS
                  </span>
                  <span className={`text-[10px] font-mono tracking-widest uppercase mt-0.5 ${theme === 'dark' ? 'text-[#38BDF8]' : 'text-[#C22727]'}`}>
                    PLATAFORMA CÍVICA
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. CENTRO: Pastilla Institucional Dinámica según Rol y Nivel */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-2">
              {(() => {
                const esSuperAdmin = user?.nivelAcceso === 5 || 
                  (user?.rol && (user.rol.toUpperCase().includes("SUPER") || user.rol.toUpperCase().includes("NACIONAL")));
                const esGestor = user?.nivelAcceso === 4 ||
                  (user?.rol && (user.rol.toUpperCase().includes("TERRITORIAL") || user.rol.toUpperCase().includes("PROVINCIAL") || user.rol.toUpperCase().includes("MUNICIPAL")));
                
                if (esSuperAdmin) {
                  return (
                    <div
                      className="badge-admin-nacional px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-2"
                      style={{
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        boxShadow: '0 0 14px rgba(220, 38, 38, 0.15)'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DA291C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span style={{ color: "#EF4444", fontWeight: 600 }}>
                        [NIVEL 5] SUPER ADMIN NACIONAL | COSTA RICA UNIDOS
                      </span>
                    </div>
                  );
                }

                if (esGestor) {
                  return (
                    <div
                      className="badge-gestor-territorial px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-2"
                      style={{
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        boxShadow: '0 0 14px rgba(245, 158, 11, 0.12)'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                        [NIVEL 4] GESTOR TERRITORIAL Y MUNICIPAL | COSTA RICA UNIDOS
                      </span>
                    </div>
                  );
                }

                return null;
              })()}
            </div>

            {/* 3. EXTREMO DERECHO: Controles de Tema, Accesibilidad e Identificación */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              {/* Botón Minimalista de Modo Oscuro / Claro */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn-theme-toggle"
                title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {theme === 'dark' ? (
                  /* SVG Sol */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  /* SVG Luna */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#002B7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* Enlace al Portal Público */}
              <Link
                to="/"
                aria-label="Ir al portal público"
                title="Ir al Portal Público Ciudadano"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-sky-400' : 'text-blue-700'}`} strokeWidth={1.75} />
                <span className="hidden sm:inline">Portal Público</span>
              </Link>

              {/* Botón Cerrar Sesión con Doble Verificación */}
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </header>
        <CNEGlobalMarqueeAlert />
        {renderLogoutModal()}
        <DaltonismoSvgFilters />
      </>
    );
  }

  // ==========================================================================
  // RENDERIZADO PRINCIPAL (CIUDADANÍA Y VISITANTES PÚBLICOS)
  // ==========================================================================
  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-50 transition-colors"
        onMouseLeave={handleMouseLeaveNav}
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(6, 42, 119, 0.08)',
          boxShadow: '0 4px 20px rgba(6, 42, 119, 0.05)'
        }}
      >
        {/* ======================================================================
            1. BARRA SUPERIOR (TOP BAR): IDIOMAS, ALTO CONTRASTE Y REDES SOCIALES
            ====================================================================== */}
        <div
          className="cintillo-superior-container h-8 relative flex items-center justify-between px-3 sm:px-6 md:px-10 text-[11px] font-semibold tracking-wider overflow-hidden whitespace-nowrap"
          style={{
            backgroundColor: '#01004E',
            color: '#FFFFFF',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          {/* LADO IZQUIERDO: IDIOMAS OFICIALES (Español, Bribri, Cabécar, English) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { code: 'es', label: 'Español' },
              { code: 'bribri', label: 'Bribri' },
              { code: 'cabecar', label: 'Cabécar' },
              { code: 'en', label: 'English' }
            ].map((lang, idx, arr) => (
              <React.Fragment key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    cambiarIdioma(lang.code);
                    setActiveLangCode(lang.code);
                  }}
                  className={`hover:text-yellow-300 transition-colors cursor-pointer text-[11px] ${
                    currentLang === lang.code ? 'text-yellow-400 font-bold underline' : 'text-slate-200'
                  }`}
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  {lang.label}
                </button>
                {idx < arr.length - 1 && <span className="opacity-40 text-slate-400">·</span>}
              </React.Fragment>
            ))}
          </div>

          {/* LADO DERECHO: ALTO CONTRASTE Y REDES SOCIALES */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setDaltonismoMode(daltonismoMode === 'alto-contraste' ? 'normal' : 'alto-contraste');
              }}
              className={`hover:text-yellow-300 transition-colors cursor-pointer text-[11px] ${
                daltonismoMode === 'alto-contraste' ? 'text-yellow-400 font-bold underline' : 'text-slate-200'
              }`}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              Alto contraste
            </button>
            <span className="opacity-40 text-slate-400">·</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-yellow-300 transition-colors no-underline hidden sm:inline">
              Facebook
            </a>
            <span className="opacity-40 text-slate-400 hidden sm:inline">·</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-yellow-300 transition-colors no-underline hidden sm:inline">
              Instagram
            </a>
            <span className="opacity-40 text-slate-400 hidden sm:inline">·</span>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-yellow-300 transition-colors no-underline hidden sm:inline">
              YouTube
            </a>
          </div>
        </div>

        {/* ======================================================================
            2. HEADER INSTITUCIONAL CON LOGO 100% ESTÁTICO, MENÚ Y BOTÓN INICIAR SESIÓN
            ====================================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between gap-3">
          {/* LADO IZQUIERDO: LOGOTIPO OFICIAL (100% Estático - Redirige a /) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Logo showText={true} size="40px" variant="light" spin={false} />
          </div>

          {/* CENTRO: MENÚ HORIZONTAL INSTITUCIONAL */}
          <nav
            aria-label="Navegación Cívica Principal"
            data-tour="nav-institucional"
            className="hidden lg:flex items-center gap-1 xl:gap-3"
          >
            {/* 1. La Muni (Activo con subrayado rojo) */}
            <Link
              to="/"
              className="px-3 py-2 text-sm font-bold text-slate-900 transition-all rounded-none relative"
              style={{
                textDecoration: 'none',
                borderBottom: '3px solid var(--red, #C22727)',
                color: 'var(--navy, #062A77)'
              }}
            >
              La Muni
            </Link>

            {/* 2. Trámites y servicios (Abre MegaMenú tramites) */}
            <button
              type="button"
              onMouseEnter={() => handleMouseEnterCategoria('tramites')}
              onClick={() => handleToggleCategoria('tramites')}
              aria-expanded={categoriaActiva === 'tramites'}
              className="px-3 py-2 text-sm font-semibold transition-colors hover:text-[#062A77] rounded-lg flex items-center gap-1 cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                color: categoriaActiva === 'tramites' ? 'var(--navy, #062A77)' : '#334155'
              }}
            >
              <span>Trámites y servicios</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriaActiva === 'tramites' ? 'rotate-180 text-red-600' : 'text-slate-400'}`} />
            </button>

            {/* 3. Concejo y Actas (Abre MegaMenú gobierno) */}
            <button
              type="button"
              onMouseEnter={() => handleMouseEnterCategoria('gobierno')}
              onClick={() => handleToggleCategoria('gobierno')}
              aria-expanded={categoriaActiva === 'gobierno'}
              className="px-3 py-2 text-sm font-semibold transition-colors hover:text-[#062A77] rounded-lg flex items-center gap-1 cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                color: categoriaActiva === 'gobierno' ? 'var(--navy, #062A77)' : '#334155'
              }}
            >
              <span>Concejo y Actas</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriaActiva === 'gobierno' ? 'rotate-180 text-red-600' : 'text-slate-400'}`} />
            </button>

            {/* 4. Obras y Reportes (Abre MegaMenú territorio) */}
            <button
              type="button"
              onMouseEnter={() => handleMouseEnterCategoria('territorio')}
              onClick={() => handleToggleCategoria('territorio')}
              aria-expanded={categoriaActiva === 'territorio'}
              className="px-3 py-2 text-sm font-semibold transition-colors hover:text-[#062A77] rounded-lg flex items-center gap-1 cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                color: categoriaActiva === 'territorio' ? 'var(--navy, #062A77)' : '#334155'
              }}
            >
              <span>Obras y Reportes</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriaActiva === 'territorio' ? 'rotate-180 text-red-600' : 'text-slate-400'}`} />
            </button>

            {/* 5. Transparencia */}
            <Link
              to="/gobernanza"
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#062A77] transition-colors rounded-lg"
              style={{ textDecoration: 'none' }}
            >
              Transparencia
            </Link>
          </nav>

          {/* LADO DERECHO: UTILIDADES ESENCIALES (TEMA + ACCESIBILIDAD) + ACCESO CÍVICO */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">
            {/* 1. Botón Minimalista de Modo Oscuro / Claro */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-theme-toggle"
              title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {theme === 'dark' ? (
                /* SVG Sol */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                /* SVG Luna */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#002B7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* 2. Menú Flotante de Accesibilidad Universal en el Topbar (Ley N° 7600) */}
            <div className="relative" data-tour="panel-civico-btn">
              <button
                type="button"
                ref={a11yButtonRef}
                onClick={() => setIsA11yOpen(!isA11yOpen)}
                className="btn-a11y-toggle"
                aria-label="Opciones de accesibilidad universal"
                aria-expanded={isA11yOpen}
                title="Accesibilidad Universal (Ley N° 7600)"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isA11yOpen
                    ? (theme === 'dark' ? 'rgba(56, 189, 248, 0.20)' : 'rgba(0, 43, 127, 0.12)')
                    : (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'),
                  border: isA11yOpen
                    ? (theme === 'dark' ? '1px solid rgba(56, 189, 248, 0.50)' : '1px solid #002B7F')
                    : (theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1'),
                  color: theme === 'dark' ? '#38BDF8' : '#002B7F',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Icono universal de accesibilidad (persona/figura humana dentro de un círculo) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? "#38BDF8" : "#002B7F"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="7" r="1.5" />
                  <path d="M7 11.5h10" />
                  <path d="M12 9v6" />
                  <path d="m9.5 19 2.5-4 2.5 4" />
                </svg>
              </button>

              {/* Popover Desplegable de Accesibilidad */}
              {isA11yOpen && (
                <div
                  ref={a11yPopoverRef}
                  role="dialog"
                  aria-label="Ajustes de accesibilidad universal"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    zIndex: 100,
                    width: '320px',
                    backgroundColor: theme === 'dark' ? 'rgba(5, 12, 28, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 16px 40px rgba(0, 4, 13, 0.65)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Cabecera del Popover */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="7" r="1.5" />
                        <path d="M7 11.5h10" />
                        <path d="M12 9v6" />
                        <path d="m9.5 19 2.5-4 2.5 4" />
                      </svg>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                        Accesibilidad (Ley N° 7600)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsA11yOpen(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      aria-label="Cerrar opciones de accesibilidad"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* A. Escala de Tipografía: [ A- ] [ 100% ] [ A+ ] */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
                        Escala de Tipografía
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8' }}>
                        {currentScalePercent}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {[
                        { label: 'A-', percent: '90%', scale: '0.90', desc: 'Reducir' },
                        { label: '100%', percent: '100%', scale: '1.0', desc: 'Estándar' },
                        { label: 'A+', percent: '115%', scale: '1.15', desc: 'Ampliar' }
                      ].map((btn) => {
                        const isSelected = currentScalePercent === btn.percent;
                        return (
                          <button
                            key={btn.percent}
                            type="button"
                            onClick={() => handleApplyScale(btn.percent, btn.scale)}
                            style={{
                              padding: '7px 4px',
                              borderRadius: '8px',
                              border: isSelected
                                ? '1px solid #38BDF8'
                                : theme === 'dark'
                                ? '1px solid rgba(255, 255, 255, 0.10)'
                                : '1px solid rgba(0, 0, 0, 0.12)',
                              backgroundColor: isSelected
                                ? 'rgba(56, 189, 248, 0.18)'
                                : theme === 'dark'
                                ? 'rgba(255, 255, 255, 0.04)'
                                : 'rgba(0, 0, 0, 0.04)',
                              color: isSelected
                                ? '#38BDF8'
                                : theme === 'dark'
                                ? '#F8FAFC'
                                : '#0F172A',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '2px',
                              transition: 'all 0.15s ease'
                            }}
                            title={`Escala tipográfica: ${btn.percent}`}
                          >
                            <span>[ {btn.label} ]</span>
                            <span style={{ fontSize: '0.62rem', fontWeight: 500, opacity: 0.75 }}>{btn.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* B. Adaptación de Daltonismo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
                        Adaptación de Daltonismo
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#34D399' }}>
                        {currentDaltonismoLabel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {[
                        { id: 'normal', label: 'Estándar' },
                        { id: 'protanopia', label: 'Protanopía' },
                        { id: 'deuteranopia', label: 'Deuteranopía' },
                        { id: 'tritanopia', label: 'Tritanopía' },
                        { id: 'achromatopsia', label: 'Alto Contraste' }
                      ].map((opt) => {
                        const isSelected = (daltonismoMode || 'normal') === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleDaltonismoChange(opt.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              border: isSelected
                                ? '1px solid #10B981'
                                : theme === 'dark'
                                ? '1px solid rgba(255, 255, 255, 0.10)'
                                : '1px solid rgba(0, 0, 0, 0.12)',
                              backgroundColor: isSelected
                                ? 'rgba(16, 185, 129, 0.20)'
                                : theme === 'dark'
                                ? 'rgba(255, 255, 255, 0.04)'
                                : 'rgba(0, 0, 0, 0.04)',
                              color: isSelected ? '#34D399' : theme === 'dark' ? '#E2E8F0' : '#334155',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* C. Idiomas Oficiales (Estándar BCP-47 / ISO-639-1) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
                      {t('Idiomas Oficiales', 'Idiomas Oficiales')}
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {[
                        { code: 'es-419', label: 'Español', desc: 'Latinoamérica' },
                        { code: 'es-ES', label: 'Español', desc: 'España' },
                        { code: 'en', label: 'English', desc: 'Global' },
                        { code: 'ja', label: '日本語', desc: 'Japonés' },
                        { code: 'pt', label: 'Português', desc: 'Brasil / PT' },
                        { code: 'cho', label: 'Chorotega', desc: 'Patrimonial CR' }
                      ].map((lang) => {
                        const langActivo = currentLang || activeLangCode || 'es-latam';
                        const isSelected =
                          langActivo === lang.code ||
                          ((langActivo === 'es-latam' || langActivo === 'es' || langActivo === 'es-CR') &&
                            (lang.code === 'es-419' || lang.code === 'es-latam')) ||
                          (langActivo === 'es-419' && (lang.code === 'es-419' || lang.code === 'es-latam'));
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageSelect(lang.code)}
                            style={{
                              padding: '6px 4px',
                              borderRadius: '8px',
                              border: isSelected
                                ? '1px solid #38BDF8'
                                : theme === 'dark'
                                ? '1px solid rgba(255, 255, 255, 0.10)'
                                : '1px solid rgba(0, 0, 0, 0.12)',
                              backgroundColor: isSelected
                                ? 'rgba(56, 189, 248, 0.18)'
                                : theme === 'dark'
                                ? 'rgba(255, 255, 255, 0.04)'
                                : 'rgba(0, 0, 0, 0.04)',
                              color: isSelected
                                ? '#38BDF8'
                                : theme === 'dark'
                                ? '#F8FAFC'
                                : '#0F172A',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '2px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{lang.label}</span>
                            <span style={{ fontSize: '0.6rem', fontWeight: 500, opacity: 0.75 }}>{lang.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Bloque de Identificación y Acceso Cívico */}
            <div className="flex items-center gap-1 sm:gap-1.5" data-tour="registro-login-btn">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Botón Dinámico de Retorno al Panel ("Volver a mi Interfaz") para TODOS los roles */}
                  <Link
                    to={interfaceInfo.path}
                    aria-label={`Volver a la interfaz de ${interfaceInfo.roleShort}`}
                    title={interfaceInfo.title}
                    className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-full border text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 shadow-sm ${interfaceInfo.themeClass}`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                    <span className="hidden sm:inline">{t('Volver a mi Interfaz')}</span>
                    <span className="sm:hidden">{t('Mi Interfaz')}</span>
                  </Link>

                  {/* Pastilla de Identificación y Expediente Cívico */}
                  <Link
                    to="/perfil"
                    aria-label={`Expediente cívico de ${user.nombre || 'Usuario'}`}
                    title={`Usuario autenticado: ${user.nombre || 'Usuario'} • ${interfaceInfo.roleShort}`}
                    className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" strokeWidth={1.75} />
                    <span className="max-w-[100px] sm:max-w-[140px] truncate">
                      {user.nombre?.split(' ')[0]} {user.nombre?.split(' ')[1] || (user.nombre?.includes('Abarca') ? 'Abarca' : '')}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: interfaceInfo.badgeColor,
                        boxShadow: `0 0 6px ${interfaceInfo.badgeColor}`
                      }}
                    />
                  </Link>

                  {/* Botón Cerrar Sesión con Doble Verificación */}
                  <button
                    type="button"
                    onClick={() => setIsLogoutModalOpen(true)}
                    aria-label="Cerrar sesión activa"
                    title="Cerrar Sesión"
                    className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white text-[11px] xl:text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" strokeWidth={1.75} />
                    <span className="hidden sm:inline lg:hidden xl:inline">{t('Cerrar Sesión')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  aria-label="Iniciar sesión en la plataforma cívica institucional"
                  title="Iniciar Sesión"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#062A77] text-[#062A77] hover:bg-[#062A77] hover:text-white text-xs font-bold tracking-wide transition-all duration-200 shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{t('Iniciar sesión')}</span>
                </Link>
              )}
            </div>

            {/* EN MÓVILES (< 1024px): BOTÓN HAMBURGUESA QUE DESPLIEGA MENÚ LATERAL */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#062A77]"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" strokeWidth={2} />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN MÓVIL DESPLEGABLE COMPACTA EN BLANCO INSTITUCIONAL */}
        {isMobileMenuOpen && (
          <nav
            aria-label="Navegación Móvil Municipal"
            className="lg:hidden border-t px-4 py-4 space-y-4 bg-white border-slate-200 shadow-xl"
          >
            {/* Enlaces principales */}
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-bold text-[#062A77] rounded-lg bg-blue-50"
              >
                La Muni
              </Link>
              <Link
                to="/portal-ciudadano"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Trámites y servicios
              </Link>
              <Link
                to="/gobernanza"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Concejo y Actas
              </Link>
              <Link
                to="/reportar-incidencia"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Obras y Reportes
              </Link>
              <Link
                to="/gobernanza"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Transparencia
              </Link>
            </div>
            {isAuthenticated && user && (
              <div className="pb-3 border-b border-white/10 flex flex-col gap-2">
                <Link
                  to={interfaceInfo.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold ${interfaceInfo.themeClass}`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span>{t('Volver a mi Interfaz')} ({interfaceInfo.roleShort})</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-75" />
                </Link>

                <div className="flex items-center justify-between px-1 pt-1">
                  <Link
                    to="/perfil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white"
                  >
                    <ShieldCheck className="w-4 h-4 text-sky-400" strokeWidth={1.75} />
                    <span className="truncate max-w-[180px]">{user.nombre}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" strokeWidth={1.75} />
                    <span>{t('Cerrar Sesión')}</span>
                  </button>
                </div>
              </div>
            )}
            {CATEGORIAS_CIVICAS.map((cat) => {
              const IconoCat = cat.icon;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    <IconoCat className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>{t(cat.label)}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pl-5">
                    {cat.modulos.map((mod) => (
                      <Link
                        key={mod.path}
                        to={mod.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`py-1 text-xs transition-colors block ${
                          theme === 'dark'
                            ? 'text-slate-300 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t(mod.titulo)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        )}

        {/* ======================================================================
            3. MEGA MENÚ DESPLEGABLE EN DESKTOP (SUB-PANEL TRANSLÚCIDO)
            ====================================================================== */}
        <MegaMenu
          categoriaActiva={categoriaActiva}
          alCerrar={() => setCategoriaActiva(null)}
        />
      </header>
      <CNEGlobalMarqueeAlert />

      {/* Inyección de Filtros SVG para Daltonismo (Ley N° 7600) */}
      <DaltonismoSvgFilters />

      {/* Modal de Doble Verificación de Cierre de Sesión Oficial */}
      {renderLogoutModal()}
    </>
  );
}
