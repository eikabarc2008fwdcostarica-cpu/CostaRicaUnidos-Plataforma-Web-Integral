/**
 * ============================================================================
 * COSTA RICA UNIDOS — BARRA DE PESTAÑAS ADMINISTRATIVAS (NIVEL 2 - PROVINCIAL)
 * Design System: Sovereign Civic Glass v2.1
 * ============================================================================
 * 
 * Pestañas Normadas:
 * 1. Triaje de Incidencias (M07)
 * 2. Comando CNE y Albergues (M10)
 * 3. Telemetría Territorial
 * 4. Bitácora de Auditoría
 */
import React from 'react';
import {
  ClipboardList,
  ShieldAlert,
  Activity,
  FileText,
  Radio,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const ADMIN_TABS = [
  {
    id: 'incidencias',
    label: 'Triaje de Incidencias (M07)',
    shortLabel: 'Incidencias (M07)',
    icon: ClipboardList,
    codigo: 'M07',
    badgeText: '8 Críticas',
    badgeType: 'warning'
  },
  {
    id: 'cne',
    label: 'Comando CNE y Albergues (M10)',
    shortLabel: 'Comando CNE (M10)',
    icon: ShieldAlert,
    codigo: 'M10',
    badgeText: 'Alerta Amarilla',
    badgeType: 'cne'
  },
  {
    id: 'telemetria',
    label: 'Telemetría Territorial',
    shortLabel: 'Telemetría',
    icon: Activity,
    codigo: 'GIS-LIVE',
    badgeText: 'En Vivo',
    badgeType: 'live'
  },
  {
    id: 'auditoria',
    label: 'Bitácora de Auditoría',
    shortLabel: 'Auditoría',
    icon: FileText,
    codigo: 'SEC-LOG',
    badgeText: 'Inmutable',
    badgeType: 'security'
  }
];

export default function AdminTabNavigation({
  activeTab = 'incidencias',
  onTabChange = () => {},
  provinciaTheme = {
    primary: '#F36717',
    glow: 'rgba(243, 103, 23, 0.4)',
    nombre: 'Puntarenas'
  },
  badgeCounts = {}
}) {
  const primaryColor = provinciaTheme?.primary || '#F36717';
  const glowEffect = provinciaTheme?.glow || 'rgba(243, 103, 23, 0.4)';

  return (
    <nav
      aria-label="Navegación de módulos provinciales"
      style={{
        backgroundColor: 'rgba(5, 12, 28, 0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '0.5rem',
        marginBottom: '1.75rem',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}
    >
      {ADMIN_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: '1 1 auto',
              minWidth: '220px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '0.75rem 1.15rem',
              borderRadius: '12px',
              border: isActive
                ? `1px solid ${primaryColor}`
                : '1px solid transparent',
              backgroundColor: isActive
                ? 'rgba(255, 255, 255, 0.06)'
                : 'transparent',
              color: isActive ? '#FFFFFF' : '#94A3B8',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              boxShadow: isActive
                ? `0 0 20px ${glowEffect}, inset 0 0 12px rgba(255, 255, 255, 0.03)`
                : 'none',
              fontFamily: "'Paloseco', 'Plus Jakarta Sans', system-ui, sans-serif"
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)';
                e.currentTarget.style.color = '#E2E8F0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94A3B8';
              }
            }}
          >
            {/* Indicador de Línea Activa */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  backgroundColor: primaryColor,
                  borderRadius: '2px',
                  boxShadow: `0 0 10px ${primaryColor}`
                }}
              />
            )}

            {/* Icono del Módulo */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: isActive
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? primaryColor : '#64748B',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <IconComponent size={18} strokeWidth={isActive ? 2.25 : 1.75} />
            </div>

            {/* Texto de la Pestaña */}
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div
                style={{
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: isActive ? primaryColor : '#64748B',
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontWeight: 600,
                  marginTop: '0.15rem'
                }}
              >
                {tab.codigo}
              </div>
            </div>

            {/* Badge de Telemetría */}
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.68rem',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                backgroundColor:
                  isActive
                    ? 'rgba(255, 255, 255, 0.1)'
                    : tab.badgeType === 'live'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'rgba(255, 255, 255, 0.04)',
                color:
                  isActive
                    ? '#FFFFFF'
                    : tab.badgeType === 'live'
                    ? '#34D399'
                    : '#94A3B8',
                border: `1px solid ${
                  isActive
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.06)'
                }`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                flexShrink: 0
              }}
            >
              {tab.badgeType === 'live' && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px #10B981',
                    animation: 'pulse 2s infinite'
                  }}
                />
              )}
              {badgeCounts[tab.id] ?? tab.badgeText}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
