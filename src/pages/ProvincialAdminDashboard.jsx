/**
 * ============================================================================
 * COSTA RICA UNIDOS — CONSOLA DE MANDO PROVINCIAL (NIVEL 2)
 * Arquitectura: Sovereign Civic Glass v2.1
 * Enrutamiento y Modularización: Single Active View Architecture
 * Layout: Menú Lateral Único Integrado (Desktop Expandible/Colapsable + Mobile)
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Anchor } from 'lucide-react';
import { useAuth, PROVINCIAS_COSTA_RICA } from '../context/AuthContext';
import { PROVINCIAL_THEMES } from '../config/provincialThemes';

// 1. Menú Lateral Unificado y Encabezado Superior Administrativo
import ProvincialSidebar from '../components/admin/ProvincialSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

// 2. Módulos Territoriales Nivel 2
import ConcejosMunicipalesModule from '../components/admin/ConcejosMunicipalesModule';
import GacetaActasModule from '../components/admin/GacetaActasModule';
import OrganigramaModule from '../components/admin/OrganigramaModule';
import AudienciaFormalModule from '../components/admin/AudienciaFormalModule';
import ObrasAveriasModule from '../components/admin/ObrasAveriasModule';
import EmergenciasCNEModule from '../components/admin/EmergenciasCNEModule';

export default function ProvincialAdminDashboard() {
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.rol === 'SUPER_ADMIN_NACIONAL' || user?.nivelAcceso === 5;

  // Estados de navegación, colapso de sidebar y modal de logout
  const [activeModule, setActiveModule] = useState(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('modulo');
      const valid = ['concejos', 'gaceta', 'organigrama', 'audiencia', 'obras', 'cne'];
      if (param && valid.includes(param)) return param;
    } catch {
      // safe fallback
    }
    return 'concejos';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 1. Resolver jurisdicción provincial oficial del usuario (RBAC Nivel 4)
  const officialProvId = useMemo(() => {
    const raw =
      user?.provinciaId ||
      user?.provincia ||
      user?.provinciaNombre ||
      '1'; // Default soberano: San José (id: 1)
    const str = String(raw).toLowerCase().trim();

    const matched = PROVINCIAS_COSTA_RICA.find(
      (p) =>
        p.nombre.toLowerCase() === str ||
        String(p.id) === str ||
        (p.id === '1' && str.includes('san jos')) ||
        (p.id === '2' && str.includes('alajuel')) ||
        (p.id === '3' && str.includes('cartag')) ||
        (p.id === '4' && str.includes('heredi')) ||
        (p.id === '5' && str.includes('guanacas')) ||
        (p.id === '6' && str.includes('puntaren')) ||
        (p.id === '7' && str.includes('lim'))
    );
    return matched ? String(matched.id) : '1';
  }, [user]);

  // Si es Gestor Territorial, selectedProvId SIEMPRE queda estrictamente restringido a su jurisdicción
  const [selectedProvId, setSelectedProvId] = useState(officialProvId);

  useEffect(() => {
    if (!isSuperAdmin) {
      setSelectedProvId(officialProvId);
    }
  }, [isSuperAdmin, officialProvId]);

  // Sincronización del cantón territorial activo en toda la consola
  const [activeCanton, setActiveCanton] = useState(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  useEffect(() => {
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) {
        setActiveCanton(e.detail.nombre);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  // Tema provincial dinámico activo
  const activeTheme = useMemo(() => {
    return PROVINCIAL_THEMES[selectedProvId] || PROVINCIAL_THEMES['1'];
  }, [selectedProvId]);

  // Manejador reactivo de selección de módulo con sincronización de URL
  const handleSelectModule = (modId) => {
    const valid = ['concejos', 'gaceta', 'organigrama', 'audiencia', 'obras', 'cne'];
    const safeMod = valid.includes(modId) ? modId : 'concejos';
    setActiveModule(safeMod);

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('modulo', safeMod);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // safe fallback
    }
  };

  // Manejo de salida segura
  const handleLogoutConfirm = () => {
    if (logout) {
      logout();
    }
    window.location.href = '/login';
  };

  // Reloj local en tiempo real CST
  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatHoraCST = (date) => {
    return date.toLocaleTimeString('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const provinciaNombre =
    activeTheme?.nombre ||
    user?.provinciaNombre ||
    user?.provincia ||
    'Puntarenas';

  return (
    <div
      id="provincial-admin-layout-root"
      className="provincial-admin-layout admin-layout-container admin-viewport-wrapper"
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#00040D', // Obsidiana Soberana
        color: '#E2E8F0',
        fontFamily: "'Paloseco', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        position: 'relative',
        // Inyección dinámica de tokens CSS según la provincia activa
        '--province-primary': activeTheme.primary,
        '--prov-primary': activeTheme.primary,
        '--prov-glow': activeTheme.glow,
        '--prov-secondary': activeTheme.secondary
      }}
    >
      {/* ===================================================================== */}
      {/* CAPA DE AMBIENTE LUMINOSO Y RESPLANDOR TERRITORIAL DINÁMICO           */}
      {/* ===================================================================== */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '420px',
          background: `radial-gradient(ellipse 65% 55% at 50% -10%, ${activeTheme.glow} 0%, rgba(0, 4, 13, 0) 80%)`,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 0.5s ease'
        }}
      />

      {/* ===================================================================== */}
      {/* 1. ÚNICO MENÚ LATERAL PROVINCIAL (REACTIVO Y COLAPSABLE [<])          */}
      {/* ===================================================================== */}
      <ProvincialSidebar
        activeModule={activeModule}
        setActiveModule={(mod) => {
          handleSelectModule(mod);
          setIsMobileDrawerOpen(false);
        }}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileDrawerOpen}
        setIsMobileOpen={setIsMobileDrawerOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
        activeTheme={activeTheme}
      />

      {/* ===================================================================== */}
      {/* 2. ÁREA DE TRABAJO PRINCIPAL (MAIN VIEWPORT CONTAINER)                */}
      {/* ===================================================================== */}
      <div
        className="main-viewport-container admin-main-viewport admin-main-scrollable"
        style={{
          flex: 1,
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Encabezado Superior Administrativo */}
        <AdminNavbar
          activeTheme={activeTheme}
          selectedProvId={selectedProvId}
          setSelectedProvId={setSelectedProvId}
          currentTime={currentTime}
          formatHoraCST={formatHoraCST}
          onToggleMobileSidebar={() => setIsMobileDrawerOpen((prev) => !prev)}
        />

        {/* Barra Territorial Institucional de Identidad */}
        <div
          className="provincial-banner-bar"
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.45)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '0.85rem 1.5rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <div
            style={{
              maxWidth: '1520px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}
          >
            {/* Identidad y Escudo Provincial */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(5, 12, 28, 0.8)',
                  border: `1px solid ${activeTheme.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 16px ${activeTheme.glow}`,
                  transition: 'all 0.3s ease'
                }}
              >
                <Anchor size={22} color={activeTheme.primary} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    fontWeight: 700
                  }}
                >
                  Gobierno de Costa Rica • Gobernanza Nivel 2
                </div>
                <h1
                  style={{
                    fontFamily: "'Paloseco', 'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: '1.32rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                  }}
                >
                  Consola Provincial
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: activeTheme.primary,
                      border: `1px solid ${activeTheme.primary}`,
                      boxShadow: `0 0 10px ${activeTheme.glow}`
                    }}
                  >
                    Provincia {activeTheme.id}: {activeTheme.nombre}
                  </span>
                </h1>
              </div>
            </div>

            {/* Lema y Cantones de la Provincia */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.8rem',
                  color: '#94A3B8'
                }}
                className="hidden md:block"
              >
                «{activeTheme.lema}»
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.72rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#38BDF8'
                }}
              >
                <span>{activeTheme.cantonesCount} Cantones</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. VISTA ÚNICA ACTIVA (RENDERIZADO EXCLUSIVO DEL MÓDULO SELECCIONADO)*/}
        {/* =================================================================== */}
        <main
          className="content-viewport admin-content-viewport page-content-wrapper"
          style={{
            maxWidth: '1520px',
            width: '100%',
            margin: '0 auto',
            padding: '1.75rem 1.5rem 4rem',
            position: 'relative',
            zIndex: 1,
            boxSizing: 'border-box',
            overflowX: 'hidden'
          }}
        >
          {activeModule === 'concejos' && (
            <ConcejosMunicipalesModule
              provincia={provinciaNombre}
              activeCanton={activeCanton}
              onNavigateModule={handleSelectModule}
            />
          )}

          {activeModule === 'gaceta' && (
            <GacetaActasModule
              provincia={provinciaNombre}
              canton={activeCanton}
              onNavigateModule={handleSelectModule}
            />
          )}

          {activeModule === 'organigrama' && (
            <OrganigramaModule
              provincia={provinciaNombre}
              canton={activeCanton}
              onNavigateModule={handleSelectModule}
            />
          )}

          {activeModule === 'audiencia' && (
            <AudienciaFormalModule
              provincia={provinciaNombre}
              canton={activeCanton}
              onNavigateModule={handleSelectModule}
            />
          )}

          {activeModule === 'obras' && (
            <ObrasAveriasModule
              provincia={provinciaNombre}
              provinciaTheme={activeTheme}
              canton={activeCanton}
            />
          )}

          {activeModule === 'cne' && (
            <EmergenciasCNEModule
              provincia={provinciaNombre}
              provinciaTheme={activeTheme}
              canton={activeCanton}
            />
          )}
        </main>
      </div>

      {/* =================================================================== */}
      {/* 4. MODAL DE DOBLE VERIFICACIÓN DE CIERRE DE SESIÓN                  */}
      {/* =================================================================== */}
      {isLogoutModalOpen && (
        <div
          className="modal-backdrop-glass"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="modal-card-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>¿Confirmar Cierre de Sesión?</h3>
            <p>
              Se finalizará su sesión en el panel territorial de{' '}
              <strong>{provinciaNombre}</strong>.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-confirm-danger"
                onClick={handleLogoutConfirm}
              >
                Confirmar Salida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
