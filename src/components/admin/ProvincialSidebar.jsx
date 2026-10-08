/**
 * ============================================================================
 * COSTA RICA UNIDOS — PROVINCIAL SIDEBAR (NIVEL 2 TERRITORIAL)
 * Arquitectura: Sovereign Civic Glass v2.1
 * Menú Lateral Único Integrado (Desktop Expandible/Colapsable + Mobile Drawer)
 * ============================================================================
 */

import React from 'react';
import {
  Landmark,
  FileText,
  Network,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth, PROVINCIAS_COSTA_RICA } from '../../context/AuthContext';
import './ProvincialSidebar.css';

// 6 Módulos Territoriales Autorizados para la Jurisdicción Territorial y Municipal
export const NAV_ITEMS = [
  {
    id: 'concejos',
    label: 'Gobiernos Locales y Concejos',
    icon: Landmark,
    badge: null
  },
  {
    id: 'gaceta',
    label: 'Gaceta de Actas y Acuerdos',
    icon: FileText,
    badge: 6
  },
  {
    id: 'organigrama',
    label: 'Organigrama de Dependencias',
    icon: Network,
    badge: null
  },
  {
    id: 'audiencia',
    label: 'Solicitudes de Audiencia Formal',
    icon: Calendar,
    badge: null
  },
  {
    id: 'obras',
    label: 'Obras & Averías Viales (M07)',
    icon: AlertTriangle,
    badge: null
  },
  {
    id: 'cne',
    label: 'Emergencias CNE (M10)',
    icon: ShieldAlert,
    badge: null
  }
];

export default function ProvincialSidebar({
  activeModule = 'concejos',
  setActiveModule,
  isSidebarCollapsed = false,
  setIsSidebarCollapsed,
  isMobileOpen = false,
  setIsMobileOpen,
  setIsLogoutModalOpen,
  activeTheme = null
}) {
  const { user } = useAuth();

  // Nombre de la provincia activa
  const provinciaObj = PROVINCIAS_COSTA_RICA?.find(
    (p) => String(p.id) === String(user?.provinciaId)
  );
  const provinciaNombre =
    activeTheme?.nombre ||
    user?.provinciaNombre ||
    user?.provincia ||
    provinciaObj?.nombre ||
    'Puntarenas';

  return (
    <>
      {/* Backdrop para Drawer en Móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[999] md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="provincial-unified-sidebar"
        aria-label="Navegación Gestión Territorial y Municipal"
        className={`provincial-sidebar admin-sidebar admin-sidebar-fixed ${isSidebarCollapsed ? 'collapsed sidebar-collapsed' : 'sidebar-expanded'} ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: isSidebarCollapsed ? '72px' : '260px',
          minWidth: isSidebarCollapsed ? '72px' : '260px',
          maxWidth: isSidebarCollapsed ? '72px' : '260px',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* ===================================================================
            1. ENCABEZADO: Emblema, Título y Botón de Colapso [<] / [>]
            =================================================================== */}
        <div className="provincial-sidebar-header">
          <div className="provincial-sidebar-brand">
            <div className="provincial-sidebar-emblem" aria-hidden="true">
              <ShieldCheck size={20} color={activeTheme?.primary || '#F36717'} />
            </div>

            {!isSidebarCollapsed && (
              <div className="provincial-sidebar-title-group">
                <h2 className="provincial-sidebar-title">Gestión Territorial y Municipal</h2>
                <span className="provincial-sidebar-jurisdiction">
                  JURISDICCIÓN: {provinciaNombre.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Botón de Colapsar [<] / [>] en Desktop */}
            <button
              type="button"
              onClick={() => {
                if (setIsSidebarCollapsed) {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              className="sidebar-collapse-btn hidden md:flex"
              aria-label={isSidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
              title={isSidebarCollapsed ? 'Expandir menú [>]' : 'Colapsar menú [<]'}
            >
              {isSidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>

            {/* Botón para cerrar drawer en móvil */}
            {isMobileOpen && setIsMobileOpen && (
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="sidebar-collapse-btn md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Cerrar menú lateral"
                title="Cerrar menú"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

      {/* ===================================================================
          2. CUERPO: Lista Dinámica de los 6 Módulos Territoriales
          =================================================================== */}
      <div className="provincial-sidebar-body admin-sidebar-nav">
        {!isSidebarCollapsed && (
          <div className="provincial-sidebar-section-title">
            <span>Gobernanza Territorial (Nivel 4)</span>
          </div>
        )}

        <nav className="provincial-nav-list" role="navigation" aria-label="Módulos territoriales">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (setActiveModule) {
                    setActiveModule(item.id);
                  }
                  if (setIsMobileOpen) {
                    setIsMobileOpen(false);
                  }
                }}
                className={`nav-button provincial-nav-item ${isActive ? 'active is-active' : ''}`}
                title={item.label}
                aria-current={isActive ? 'page' : undefined}
                style={
                  isSidebarCollapsed
                    ? { justifyContent: 'center', padding: '0.65rem 0' }
                    : {}
                }
              >
                <div className="provincial-nav-item-left">
                  <span className="icon provincial-nav-icon-box">
                    <Icon size={18} />
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="label provincial-nav-label">{item.label}</span>
                  )}
                </div>

                {item.badge && (
                  <span
                    className="badge provincial-nav-badge"
                    aria-label={`${item.badge} notificaciones`}
                    style={
                      isSidebarCollapsed
                        ? {
                            position: 'absolute',
                            top: '4px',
                            right: '6px',
                            width: '18px',
                            height: '18px',
                            fontSize: '0.65rem'
                          }
                        : {}
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===================================================================
          3. PIE DEL MENÚ (STICKY FOOTER): Usuario y Cerrar Sesión
          =================================================================== */}
      <div className="provincial-sidebar-footer admin-sidebar-footer">
        {/* Identificador de Usuario */}
        <div
          className="provincial-user-pill"
          style={isSidebarCollapsed ? { justifyContent: 'center', padding: '0.4rem 0' } : {}}
          title={`${user?.nombre || 'Coordinación Territorial'} • ${provinciaNombre}`}
        >
          <div className="provincial-user-avatar">
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'G'}
          </div>

          {!isSidebarCollapsed && (
            <div className="provincial-user-info">
              <span className="provincial-user-name">
                {user?.nombre || `Coordinación ${provinciaNombre}`}
              </span>
              <span className="provincial-user-role">
                <span className="provincial-status-dot" />
                GESTOR TERRITORIAL • {provinciaNombre}
              </span>
            </div>
          )}
        </div>

        {/* Botón Cerrar Sesión: Dispara el Modal de Doble Verificación */}
        <button
          type="button"
          onClick={() => {
            if (setIsLogoutModalOpen) {
              setIsLogoutModalOpen(true);
            }
          }}
          className="logout-button provincial-logout-btn"
          title="Cerrar Sesión"
          style={isSidebarCollapsed ? { padding: '0.6rem 0', justifyContent: 'center' } : {}}
        >
          <LogOut size={16} />
          {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
