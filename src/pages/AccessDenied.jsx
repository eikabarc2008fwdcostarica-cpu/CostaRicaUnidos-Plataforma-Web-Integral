/**
 * ============================================================================
 * COSTA RICA UNIDOS — PANTALLA OFICIAL ERROR 403 (ACCESO PROHIBIDO / RESTRINGIDO)
 * Arquitectura Sovereign Civic Glass v2.1 • Obsidiana Soberana (#00040D)
 * Control de Acceso Basado en Roles (RBAC) • Ley General de Control Interno N° 8292
 * ============================================================================
 * 
 * Jerarquía de Privilegios:
 * - Nivel 5: SUPER_ADMIN_NACIONAL (Gobernanza de IA, Auditoría Inmutable, Configuración Global)
 * - Nivel 4: GESTOR_TERRITORIAL (Gestión Municipal Unificada, Obras M07 y Emergencias M10)
 * - Nivel 2: CIUDADANO (Portal Cívico, Trámites, Consultas y Reportes)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  Lock,
  FileKey2,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { ROLES_SISTEMA, ROLES_CONFIG, normalizarRolOficial } from '../config/roles';

export default function AccessDenied({ requiredRoles = [], userRole }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Resolución del rol activo
  const rawRole = userRole || user?.rol || (isAuthenticated ? 'CIUDADANO' : 'NO_AUTENTICADO');
  const rolNormalizado = normalizarRolOficial(rawRole);
  const infoRol = ROLES_CONFIG[rolNormalizado] || {
    nombre: rawRole || 'Ciudadano',
    nivel: user?.nivelAcceso || 2,
    badge: `[ROL] ${rawRole || 'CIUDADANO'}`
  };

  // Cálculo de destino del botón "Volver a mi panel"
  const getPanelDestino = () => {
    if (!isAuthenticated && !user) return '/login';
    if (rolNormalizado === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL) return '/admin/super';
    if (rolNormalizado === ROLES_SISTEMA.GESTOR_TERRITORIAL) return '/admin/territorial';
    return '/portal-ciudadano';
  };

  const getPanelEtiqueta = () => {
    if (!isAuthenticated && !user) return 'Ir a Iniciar Sesión';
    if (rolNormalizado === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL) return 'Volver al Panel Nacional';
    if (rolNormalizado === ROLES_SISTEMA.GESTOR_TERRITORIAL) return 'Volver al Panel Territorial';
    return 'Volver a Mi Panel Ciudadano';
  };

  const handleVolverPanel = () => {
    navigate(getPanelDestino());
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  // Nombres legibles de roles requeridos si existen
  const nombresRequeridos = requiredRoles.map((r) => {
    const norm = normalizarRolOficial(r);
    return ROLES_CONFIG[norm]?.nombre || r;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#00040D',
        color: '#F8FAFC',
        fontFamily: "var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif)",
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Luz ambiental sutil (Aura carmesí / obsidiana) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '850px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(50px)'
        }}
      />

      <Navbar />

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.25rem',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            width: '100%',
            backgroundColor: 'rgba(0, 8, 20, 0.82)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '24px',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(239, 68, 68, 0.16)'
          }}
        >
          {/* Cinta superior tricolor soberana con acento de seguridad */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #DA291C 0%, #DA291C 35%, #FFFFFF 35%, #FFFFFF 50%, #001489 50%, #001489 100%)'
            }}
          />

          {/* Logotipo Oficial */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo showText={true} />
          </div>

          {/* Emblema Vectorial con Resplandor Carmesí */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              marginBottom: '1.5rem',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)'
            }}
          >
            <ShieldAlert
              style={{
                width: '46px',
                height: '46px',
                color: '#EF4444',
                filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))'
              }}
              strokeWidth={1.75}
            />
          </div>

          {/* Código de Estado en JetBrains Mono Gigante */}
          <div style={{ marginBottom: '0.85rem' }}>
            <span
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', 'Fira Code', monospace)",
                fontSize: 'clamp(1.1rem, 3.2vw, 1.45rem)',
                fontWeight: 800,
                letterSpacing: '0.18em',
                color: '#EF4444',
                textTransform: 'uppercase',
                textShadow: '0 0 18px rgba(239, 68, 68, 0.45)',
                display: 'inline-block'
              }}
            >
              403 • ACCESO PROHIBIDO
            </span>
          </div>

          {/* Título Institucional */}
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3.8vw, 2.1rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: '0 0 1rem 0'
            }}
          >
            Restricción de Jurisdicción y Privilegios
          </h1>

          {/* Mensaje Dinámico Explicativo */}
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.65,
              color: '#94A3B8',
              maxWidth: '580px',
              margin: '0 auto 1.5rem auto'
            }}
          >
            Su perfil actual con rol <strong style={{ color: '#F87171' }}>[{rawRole || user?.rol || 'NO AUTENTICADO'}]</strong> no
            cuenta con los permisos necesarios para acceder a este nodo del sistema.
          </p>

          {/* Pastilla de Código de Seguridad Normativa */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.15rem',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '9999px',
              marginBottom: '2rem',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <Lock size={14} color="#EF4444" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', 'Fira Code', monospace)",
                fontSize: 'clamp(0.72rem, 2vw, 0.82rem)',
                color: '#FCA5A5',
                letterSpacing: '0.04em',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              [SEGURIDAD] Intento registrado bajo Ley N° 8292 • Nivel requerido no alcanzado
            </span>
          </div>

          {/* Ficha de Contraste de Matriz de Acceso */}
          <div
            style={{
              backgroundColor: 'rgba(0, 15, 35, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2.25rem',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                marginBottom: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={16} color="#60A5FA" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#CBD5E1' }}>
                  Acreditación del Usuario
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '0.72rem',
                  color: '#60A5FA',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontWeight: 600
                }}
              >
                Nivel {infoRol.nivel}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '0.85rem',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                  Perfil Asignado
                </div>
                <div style={{ color: '#F1F5F9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>{infoRol.nombre}</span>
                  <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>({rawRole})</span>
                </div>
              </div>

              {nombresRequeridos.length > 0 && (
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                    Acreditación Requerida
                  </div>
                  <div style={{ color: '#FCA5A5', fontWeight: 600 }}>
                    {nombresRequeridos.join(' o ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Botón Principal: Volver a mi panel */}
            <button
              type="button"
              id="btn-access-denied-volver"
              onClick={handleVolverPanel}
              style={{
                minHeight: '48px',
                padding: '0.85rem 1.75rem',
                backgroundColor: '#EF4444',
                backgroundImage: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 18px rgba(239, 68, 68, 0.4)',
                flex: '1 1 230px',
                maxWidth: '300px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(239, 68, 68, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(239, 68, 68, 0.4)';
              }}
            >
              <LayoutDashboard size={18} />
              <span>{getPanelEtiqueta()}</span>
            </button>

            {/* Botón Secundario: Cerrar Sesión / Cambiar de Usuario */}
            <button
              type="button"
              id="btn-access-denied-logout"
              onClick={handleLogout}
              style={{
                minHeight: '48px',
                padding: '0.85rem 1.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: '1 1 230px',
                maxWidth: '300px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.color = '#E2E8F0';
              }}
            >
              <LogOut size={18} />
              <span>Cerrar Sesión / Cambiar de Usuario</span>
            </button>
          </div>

          {/* Pie Institucional con Respaldo Normativo */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.72rem',
              color: '#64748B',
              letterSpacing: '0.04em',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <span>SISTEMA NACIONAL DE SOBERANÍA DIGITAL • REPÚBLICA DE COSTA RICA</span>
            <span style={{ fontSize: '0.68rem', color: '#475569' }}>
              Fiscalización y Trazabilidad conforme a la Ley N° 8292 y Ley de Protección de Datos Personales N° 8968
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
