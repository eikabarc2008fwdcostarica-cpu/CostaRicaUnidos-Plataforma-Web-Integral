/**
 * ============================================================================
 * COSTA RICA UNIDOS — ADMIN NAVBAR (HEADER SUPERIOR TERRITORIAL)
 * Arquitectura: Sovereign Civic Glass v2.1
 * ============================================================================
 * 
 * Reglas de Diseño:
 * - Botón hamburguesa visible exclusivamente en pantallas móviles/tablets (<1024px).
 * - Identificador de Nivel 2 en tipografía JetBrains Mono.
 * - Telemetría de red, criptografía AES-256-GCM y reloj CST en vivo.
 * - Selector interactivo de provincia (Theming).
 * - CERO botones redundantes de "Cerrar Sesión" (el único reside en el Sidebar).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Compass,
  Users,
  ShieldCheck,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth, PROVINCIAS_COSTA_RICA } from '../../context/AuthContext';
import CNEGlobalMarqueeAlert from '../common/CNEGlobalMarqueeAlert';

export default function AdminNavbar({
  activeTheme,
  selectedProvId,
  setSelectedProvId,
  currentTime,
  formatHoraCST,
  onToggleMobileSidebar
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const isSuperAdmin = user?.rol === 'SUPER_ADMIN_NACIONAL' || user?.nivelAcceso === 5;

  const handleConfirmarLogout = () => {
    setIsLogoutModalOpen(false);
    if (typeof logout === 'function') {
      logout();
    }
    navigate('/login');
  };

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

  return (
    <>
    <header
      className="admin-top-navbar"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 35,
        backgroundColor: 'rgba(5, 12, 28, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
        flexShrink: 0
      }}
    >
      {/* 1. FRANJA PRINCIPAL DE CONTROL */}
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* LADO IZQUIERDO: Marca Institucional */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Botón Hamburguesa Móvil (< 768px) */}
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="admin-mobile-menu-btn md:hidden p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Abrir menú de navegación"
              aria-label="Abrir menú de navegación"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}

          {/* Logotipo Oficial */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Logo showText={false} size="32px" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: 1.1
                }}
              >
                Costa Rica Unidos
              </span>
              <span
                style={{
                  color: '#94A3B8',
                  fontSize: '0.62rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}
              >
                Gobernanza Territorial
              </span>
            </div>
          </div>
        </div>

        {/* CENTRO: Identificador Nivel 4 en JetBrains Mono */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: isSuperAdmin ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: isSuperAdmin ? '#EF4444' : '#F59E0B',
              border: `1px solid ${isSuperAdmin ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <ShieldCheck size={14} color={isSuperAdmin ? '#EF4444' : '#F59E0B'} />
            <span>
              {isSuperAdmin
                ? '[NIVEL 5] SUPER ADMIN NACIONAL | COSTA RICA UNIDOS'
                : '[NIVEL 4] GESTOR TERRITORIAL Y MUNICIPAL | COSTA RICA UNIDOS'}
            </span>
          </span>
        </div>

        {/* LADO DERECHO: Selector de Provincia (Theming) + Accesos Directos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Control de Jurisdicción Territorial (Bloqueado para Gestor con Pastilla Fija) */}
          {!isSuperAdmin ? (
            <div
              className="jurisdiccion-asignada-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(56, 189, 248, 0.10)',
                border: `1px solid ${activeTheme?.primary || '#38BDF8'}`,
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontWeight: 800,
                color: activeTheme?.primary || '#38BDF8',
                letterSpacing: '0.04em',
                boxShadow: `0 0 14px ${activeTheme?.glow || 'rgba(56, 189, 248, 0.22)'}`
              }}
            >
              <Compass size={14} color={activeTheme?.primary || '#38BDF8'} />
              <span>
                JURISDICCIÓN ASIGNADA: {(activeTheme?.nombre || user?.provinciaNombre || user?.provincia || 'SAN JOSÉ').toUpperCase()} • {activeTheme?.cantonesCount || 20} CANTONES
              </span>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.3rem 0.55rem',
                borderRadius: '8px'
              }}
            >
              <label
                htmlFor="provincia-theming-select"
                style={{
                  fontSize: '0.68rem',
                  color: '#94A3B8',
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                Theming:
              </label>
              <select
                id="provincia-theming-select"
                value={selectedProvId}
                onChange={(e) => setSelectedProvId(e.target.value)}
                style={{
                  backgroundColor: '#00040D',
                  color: '#F8FAFC',
                  border: `1px solid ${activeTheme?.primary || '#F36717'}`,
                  borderRadius: '6px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {PROVINCIAS_COSTA_RICA.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id}. {p.nombre} ({p.cantonesCount} cantones)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botón hacia Portal Ciudadano */}
          <button
            type="button"
            onClick={() => navigate('/portal-ciudadano')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
            title="Ir al Portal Ciudadano"
          >
            <Users size={14} color="#94A3B8" />
            <span>Portal</span>
          </button>

          {/* Botón hacia Visor GIS 3D */}
          <button
            type="button"
            onClick={() => navigate('/mapa-gis')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 43, 127, 0.35)',
              border: '1px solid rgba(121, 166, 255, 0.25)',
              color: '#79A6FF',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 43, 127, 0.55)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 43, 127, 0.35)')}
            title="Abrir Visor Territorial GIS 3D"
          >
            <Compass size={14} color="#79A6FF" />
            <span>GIS 3D</span>
          </button>

          {/* Botón Dinámico de Retorno al Panel Central (Super Admin) */}
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin/super')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#EF4444',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.22)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
              title="Volver a mi Interfaz (Mando Central Super Admin)"
            >
              <LayoutDashboard size={14} color="#EF4444" />
              <span>Volver a Mando Nacional</span>
            </button>
          )}

          {/* Botón Cerrar Sesión con Doble Verificación */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#F87171',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
            title="Cerrar sesión activa"
          >
            <LogOut size={14} color="#F87171" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* 2. SUBFRANJA DE TELEMETRÍA Y RELOJ CST */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: 'rgba(0, 4, 13, 0.45)',
          padding: '0.35rem 1.25rem',
          fontSize: '0.7rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Clock size={13} color="#38BDF8" />
          <span>Hora Oficial (CST):</span>
          <strong style={{ color: '#FFFFFF' }}>{currentTime ? formatHoraCST(currentTime) : '--:--:--'}</strong>
          <span
            style={{
              fontSize: '0.62rem',
              padding: '0.1rem 0.35rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#38BDF8'
            }}
          >
            UTC-6
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10B981', fontWeight: 600 }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 6px #10B981',
                display: 'inline-block'
              }}
            />
            <span>ENLACE CR-SEC SOBERANO EN LÍNEA</span>
          </div>
          <span style={{ color: '#334155' }}>|</span>
          <div>
            Latencia: <strong style={{ color: '#F8FAFC' }}>12 ms</strong>
          </div>
          <span style={{ color: '#334155' }}>|</span>
          <div>
            Cripto: <strong style={{ color: '#38BDF8' }}>AES-256-GCM</strong>
          </div>
        </div>
      </div>
    </header>

    {/* Marquesina Global de Alertas CNE */}
    <CNEGlobalMarqueeAlert />

    {/* Modal de Doble Verificación de Cierre de Sesión */}
    {isLogoutModalOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-logout-titulo"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
        onClick={() => setIsLogoutModalOpen(false)}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            borderRadius: '16px',
            backgroundColor: '#070D1B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '1.5rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(220, 38, 38, 0.15)',
            position: 'relative',
            color: '#F8FAFC',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sub-cinta tricolor */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0
              }}
            >
              <LogOut size={20} />
            </div>
            <div>
              <h3 id="admin-modal-logout-titulo" style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                ¿Confirmar Cierre de Sesión?
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>
                Consola Administrativa • Costa Rica Unidos
              </p>
            </div>
          </div>

          {user && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <ShieldCheck size={16} color="#10B981" />
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span style={{ fontWeight: 600, display: 'block', color: '#E2E8F0' }}>{user.nombre}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                    {user.correoPersonal || user.correo || user.email || 'Administrador'}
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: isSuperAdmin ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: isSuperAdmin ? '#EF4444' : '#F59E0B',
                  border: `1px solid ${isSuperAdmin ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                }}
              >
                {isSuperAdmin ? 'SUPER ADMIN' : 'GESTOR'}
              </span>
            </div>
          )}

          <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Se finalizará su sesión en la consola territorial de mando. Sus credenciales de operador cívico y tokens de seguridad serán revocados inmediatamente.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#CBD5E1',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: '#DC2626',
                border: '1px solid #EF4444',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
              <span>Confirmar Salida</span>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
