import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  FileText,
  Vote,
  MapPin,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/common/Logo';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

/**
 * PANTALLA OFICIAL ERROR 403 — ACCESO RESTRINGIDO RBAC
 * Arquitectura Sovereign Civic Glass v2.1 • República de Costa Rica
 * Adaptación total a Modo Claro (Sede Electrónica) y Modo Oscuro (Obsidiana)
 * Estructura y proporciones idénticas a NotFound.jsx (Error 404)
 */
export default function AccessDenied({ requiredRoles = [], userRole }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const isLight = theme === 'light';

  // Catálogo cívico de rutas y trámites frecuentes
  const catalogoCivico = [
    { titulo: 'Trámites y Sede Electrónica', ruta: '/portal-ciudadano', icon: FileText },
    { titulo: 'Gobernanza y Actas del Concejo', ruta: '/gobernanza', icon: Vote },
    { titulo: 'Territorio 3D & Cartografía GIS', ruta: '/mapa-gis', icon: MapPin },
    { titulo: 'Emergencias 911 y Albergues CNE', ruta: '/seguridad-emergencias', icon: PhoneCall }
  ];

  // Redirección inteligente al panel correspondiente según rol y nivel RBAC
  const handleVolverPanel = () => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }
    const rolNorm = (user.rol || '').toUpperCase();
    const nivel = Number(user.nivelAcceso || 0);

    if (nivel === 5 || rolNorm.includes('SUPER') || rolNorm.includes('NACIONAL')) {
      navigate('/admin/super');
    } else if (nivel === 4 || rolNorm.includes('TERRITORIAL') || rolNorm.includes('PROVINCIAL')) {
      navigate('/admin/territorial');
    } else {
      navigate('/portal-ciudadano');
    }
  };

  // Cierre de sesión y navegación al login
  const handleCambiarCuenta = () => {
    if (typeof logout === 'function') {
      logout();
    }
    navigate('/login');
  };

  const perfilMostrado = userRole || user?.rol || (isAuthenticated ? 'Ciudadano' : 'Visitante');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-bg, #00040D)',
        color: 'var(--theme-text-primary, #FFFFFF)',
        fontFamily: 'var(--font-main, system-ui, sans-serif)',
        overflowX: 'hidden'
      }}
    >
      <Navbar />

      <main
        className="civic-container"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="civic-glass-card"
          style={{
            maxWidth: '680px',
            width: '100%',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.75rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            borderRadius: '24px',
            backgroundColor: isLight ? '#FFFFFF' : 'rgba(5, 12, 28, 0.85)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: isLight
              ? '0 12px 40px rgba(0, 20, 137, 0.08), 0 2px 8px rgba(0,0,0,0.04)'
              : '0 25px 60px rgba(0, 4, 13, 0.85), 0 0 40px rgba(220, 38, 38, 0.15)'
          }}
        >
          {/* 1. Sub-cinta tricolor oficial institucional superior */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, #001489 0%, #001489 20%, #FFFFFF 20%, #FFFFFF 30%, #DA291C 30%, #DA291C 70%, #FFFFFF 70%, #FFFFFF 80%, #001489 80%, #001489 100%)'
            }}
          />

          {/* 2. Logotipo Oficial Centrado */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo showText={true} />
          </div>

          {/* 3. Pastilla Superior en JetBrains Mono */}
          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span
              className="telemetry-badge"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                backgroundColor: isLight ? 'rgba(0, 43, 127, 0.08)' : 'rgba(0, 16, 102, 0.55)',
                color: isLight ? '#002B7F' : '#79A6FF',
                border: isLight ? '1px solid rgba(0, 43, 127, 0.25)' : '1px solid rgba(121, 166, 255, 0.35)',
                fontWeight: 700,
                fontSize: '0.74rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              CÓDIGO DE RESPUESTA HTTP 403 • ACCESO RESTRINGIDO RBAC
            </span>
          </div>

          {/* 4. Número Arquitectónico Gigante "403" con brillo tenue */}
          <div
            style={{
              fontSize: 'clamp(4.5rem, 14vw, 7.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)',
              color: isLight ? '#DA291C' : '#FFFFFF',
              textShadow: isLight
                ? '0 4px 20px rgba(218, 41, 28, 0.2)'
                : '0 0 35px rgba(239, 68, 68, 0.35), 0 0 70px rgba(220, 38, 38, 0.25)',
              marginBottom: '0.75rem',
              userSelect: 'none'
            }}
          >
            403
          </div>

          {/* 5. Titular Formal */}
          <h1
            style={{
              fontSize: 'clamp(1.35rem, 3.6vw, 1.85rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: 'var(--theme-text-primary, #FFFFFF)',
              marginBottom: '0.85rem',
              letterSpacing: '-0.01em'
            }}
          >
            Acceso Prohibido o Nivel No Autorizado
          </h1>

          {/* 6. Mensaje Cívico Institucional */}
          <p
            style={{
              color: 'var(--theme-text-secondary, #94A3B8)',
              fontSize: '0.98rem',
              lineHeight: 1.65,
              maxWidth: '520px',
              margin: '0 auto 2rem auto'
            }}
          >
            El nodo, consola o expediente que intenta consultar requiere credenciales de mayor jerarquía. Su perfil actual ({perfilMostrado}) no tiene autorización para operar esta sección conforme a la Ley N° 8292.
          </p>

          {/* 7. Botones de Acción Oficiales (Fila de 2 botones) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Botón Primario: Regresar a Mi Panel Autorizado */}
            <button
              type="button"
              onClick={handleVolverPanel}
              className="btn-sovereign-blue"
              style={{
                minHeight: '48px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                flex: '1 1 220px',
                maxWidth: '280px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '12px'
              }}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" strokeWidth={1.75} />
              <span>Regresar a Mi Panel Autorizado</span>
            </button>

            {/* Botón Secundario: Iniciar Sesión con Otra Cuenta */}
            <button
              type="button"
              onClick={handleCambiarCuenta}
              className="btn-glass-secondary"
              style={{
                minHeight: '48px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                flex: '1 1 220px',
                maxWidth: '280px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '12px',
                color: isLight ? '#0F172A' : '#FFFFFF',
                backgroundColor: isLight ? 'rgba(0, 20, 137, 0.06)' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1px solid rgba(0, 20, 137, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <LogOut className="w-4 h-4 mr-2" strokeWidth={1.75} />
              <span>Iniciar Sesión con Otra Cuenta</span>
            </button>
          </div>

          {/* 8. Cuadrícula 2x2 de Rutas y Trámites Frecuentes */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.75rem',
              borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'left'
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isLight ? '#64748B' : '#94A3B8',
                display: 'block',
                marginBottom: '0.85rem',
                textAlign: 'center'
              }}
            >
              Rutas y Trámites Frecuentes
            </span>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '0.65rem'
              }}
            >
              {catalogoCivico.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.ruta}
                    to={item.ruta}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.95rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      backgroundColor: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.04)',
                      border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isLight ? '#0F172A' : '#FFFFFF',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      minHeight: '44px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isLight
                        ? 'rgba(0, 20, 137, 0.08)'
                        : 'rgba(0, 20, 137, 0.35)';
                      e.currentTarget.style.borderColor = '#79A6FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isLight
                        ? '#F8FAFC'
                        : 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ItemIcon size={16} strokeWidth={1.75} color={isLight ? '#002B7F' : '#79A6FF'} />
                      <span>{item.titulo}</span>
                    </div>
                    <ArrowRight size={14} strokeWidth={1.75} color={isLight ? '#64748B' : '#94A3B8'} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 9. Pie de Página Institucional */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1rem',
              borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.06)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.68rem',
              color: isLight ? '#64748B' : '#64748B',
              letterSpacing: '0.04em',
              lineHeight: 1.6
            }}
          >
            <div>SISTEMA NACIONAL DE SOBERANÍA DIGITAL • REPÚBLICA DE COSTA RICA</div>
            <div>Fiscalización y Trazabilidad bajo Ley N° 8292 y Ley N° 8968</div>
          </div>
        </div>
      </main>
    </div>
  );
}
