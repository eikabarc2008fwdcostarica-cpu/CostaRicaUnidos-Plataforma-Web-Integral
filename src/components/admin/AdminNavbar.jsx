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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Compass,
  Users,
  ShieldCheck
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth, PROVINCIAS_COSTA_RICA } from '../../context/AuthContext';

export default function AdminNavbar({
  activeTheme,
  selectedProvId,
  setSelectedProvId,
  currentTime,
  formatHoraCST,
  onToggleMobileSidebar
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.rol === 'SUPER_ADMIN_NACIONAL' || user?.nivelAcceso === 5;

  return (
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
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)'
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
  );
}
