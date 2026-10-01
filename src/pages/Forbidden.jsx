import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowLeft, Lock, FileCheck2, ShieldCheck, KeyRound } from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/common/Logo';
import { useTheme } from '../context/ThemeContext';

/**
 * PANTALLA OFICIAL ERROR 403 — ACCESO RESTRINGIDO (NIVEL 2)
 * Arquitectura Sovereign Civic Glass • República de Costa Rica
 * Marco de Autenticación de Cédula y Firma Digital Gaudi (Art. 13 Código Municipal)
 * Adaptación total a Modo Claro (Sede Electrónica) y Modo Oscuro (Obsidiana)
 * Optimizado para pantallas móviles (360px - 480px)
 */
export default function Forbidden() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

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
            backgroundColor: isLight ? '#FFFFFF' : 'rgba(0, 10, 28, 0.88)',
            border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(218, 41, 28, 0.35)',
            boxShadow: isLight
              ? '0 12px 40px rgba(218, 41, 28, 0.08), 0 2px 8px rgba(0,0,0,0.04)'
              : '0 25px 60px rgba(0, 4, 13, 0.85), 0 0 40px rgba(218, 41, 28, 0.25)'
          }}
        >
          {/* Sub-cinta superior de protección tricolor con acento rojo de seguridad */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #DA291C 0%, #DA291C 35%, #FFFFFF 35%, #FFFFFF 50%, #001489 50%, #001489 100%)'
            }}
          />

          {/* Logotipo Oficial */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo showText={true} />
          </div>

          {/* Icono Grande de Protección Institucional */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ShieldAlert
              className="w-16 h-16 text-red-500 mb-4"
              style={{
                width: '4.25rem',
                height: '4.25rem',
                color: '#DA291C',
                filter: 'drop-shadow(0 0 16px rgba(218, 41, 28, 0.45))'
              }}
            />
          </div>

          {/* Código Formal */}
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <span
              className="telemetry-badge"
              style={{
                backgroundColor: isLight ? 'rgba(218, 41, 28, 0.08)' : 'rgba(218, 41, 28, 0.16)',
                color: isLight ? '#C51C1A' : '#FF8C94',
                borderColor: isLight ? 'rgba(218, 41, 28, 0.3)' : 'rgba(218, 41, 28, 0.45)',
                fontWeight: 800,
                fontSize: '0.76rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              403 &bull; ACCESO RESTRINGIDO
            </span>
          </div>

          {/* Titular */}
          <h1
            style={{
              fontSize: 'clamp(1.35rem, 3.6vw, 1.85rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: 'var(--theme-text-primary, #FFFFFF)',
              marginBottom: '1rem',
              letterSpacing: '-0.01em'
            }}
          >
            Se Requiere Verificación Ciudadana Nivel 2
          </h1>

          {/* Explicación Legal & Cívica */}
          <p
            style={{
              color: 'var(--theme-text-secondary, #94A3B8)',
              fontSize: '0.96rem',
              lineHeight: 1.65,
              maxWidth: '540px',
              margin: '0 auto 2rem auto'
            }}
          >
            Para ejercer el voto vinculante de presupuestos participativos o radicar audiencias ante el Concejo Municipal, se requiere autenticación con Cédula verificada o Firma Digital Gaudi (Art. 13 del Código Municipal).
          </p>

          {/* Panel Informativo de Requisitos de Seguridad Cívica */}
          <div
            style={{
              backgroundColor: isLight ? '#F8FAFC' : 'rgba(0, 15, 45, 0.55)',
              border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Lock size={16} color={isLight ? '#002B7F' : '#79A6FF'} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Protocolo de Autenticación Requerido
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: '0.75rem',
                fontSize: '0.82rem',
                color: isLight ? '#475569' : '#CBD5E1'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <KeyRound size={15} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Cédula de Identidad TSE:</strong> Validación biométrica y registro activo en el padrón cantonal.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <ShieldCheck size={15} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Firma Digital Gaudi:</strong> Certificado digital calificado según Ley N° 8454.
                </span>
              </div>
            </div>
          </div>

          {/* Botones de Acción Oficiales */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Botón 1: Iniciar Sesión con Cédula */}
            <Link
              to="/login"
              className="btn-sovereign"
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
                textDecoration: 'none'
              }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span>Iniciar Sesión con Cédula</span>
            </Link>

            {/* Botón 2: Volver a la Página Anterior */}
            <button
              type="button"
              onClick={() => navigate(-1)}
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
                color: isLight ? '#0F172A' : '#FFFFFF',
                backgroundColor: isLight ? 'rgba(0, 20, 137, 0.06)' : 'rgba(255, 255, 255, 0.08)',
                borderColor: isLight ? 'rgba(0, 20, 137, 0.2)' : 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Volver a la Página Anterior</span>
            </button>
          </div>

          {/* Pie Institucional con Respaldo Normativo */}
          <div
            style={{
              marginTop: '2.25rem',
              paddingTop: '1.25rem',
              borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.72rem',
              color: isLight ? '#94A3B8' : '#64748B',
              letterSpacing: '0.04em'
            }}
          >
            SISTEMA NACIONAL DE SOBERANÍA DIGITAL &bull; MARCO DE TRANSPARENCIA Y LEY N° 8968
          </div>
        </div>
      </main>
    </div>
  );
}
