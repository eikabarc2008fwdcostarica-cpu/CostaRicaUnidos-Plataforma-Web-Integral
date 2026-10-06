import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Newspaper,
  MessageSquare,
  Store,
  Map,
  User,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Heart,
  ThumbsUp,
  Award,
  Lock,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { obtenerNombrePublico } from '../utils/privacyUtils';

export default function PortalCiudadanoPage() {
  const { user, usuarioActual } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const currentUser = usuarioActual || user;
  const nombreCompleto = currentUser?.nombre || 'Eiker Manuel Abarca Murillo';
  const nombrePublico = obtenerNombrePublico(nombreCompleto);
  const canton = currentUser?.canton || 'San José';
  const provincia = currentUser?.provincia || 'San José';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#030712' : '#F8FAFC',
        color: isDark ? '#F8FAFC' : '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '2.5rem 1.25rem 4rem'
        }}
      >
        {/* Banner de Bienvenida Soberana (Luminoso, institucional y sin recuadro oscuro) */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            backgroundColor: isDark ? 'rgba(7, 13, 27, 0.9)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(6, 42, 119, 0.12)',
            padding: '2.25rem 2rem',
            overflow: 'hidden',
            boxShadow: isDark
              ? '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 43, 127, 0.25)'
              : '0 10px 30px -5px rgba(6, 42, 119, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Cinta Tricolor Oficial de Costa Rica */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #001489 0%, #FFFFFF 33.3%, #DA291C 66.6%, #001489 100%)'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#EFF6FF',
                    color: isDark ? '#38BDF8' : '#0053AF',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid #BFDBFE',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-[#0053AF]'}`} />
                  Plataforma Cívica Soberana
                </span>
                <span style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Cantón de {canton}, {provincia}
                </span>
              </div>

              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#062A77', letterSpacing: '-0.02em' }}>
                Bienvenido(a), <span style={{ color: isDark ? '#38BDF8' : '#0053AF' }}>{nombrePublico}</span>
              </h1>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: isDark ? '#94A3B8' : '#475569', maxWidth: '650px', lineHeight: 1.5 }}>
                Tu portal cívico costarricense para consultar noticias oficiales de tu municipalidad, debatir en el Foro Tico, apoyar el comercio local y solicitar tu acreditación como emprendedor.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/perfil"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#EFF6FF',
                  border: isDark ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #BAE6FD',
                  color: isDark ? '#38BDF8' : '#0053AF',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease'
                }}
                className="hover:opacity-90 hover:scale-[1.02]"
              >
                <User className="w-4 h-4" />
                <span>Mi Perfil & Trámites</span>
              </Link>

              <Link
                to="/comercio"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  backgroundColor: '#D97706',
                  border: '1px solid #F59E0B',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                  transition: 'all 0.2s ease'
                }}
                className="hover:bg-amber-600 hover:scale-[1.02]"
              >
                <Store className="w-4 h-4" />
                <span>Comercios & PyMES</span>
              </Link>
            </div>
          </div>

          {/* Garantía de Privacidad Ley 8968 */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(0, 43, 127, 0.25)' : '#F1F5F9',
              border: isDark ? '1px solid rgba(121, 166, 255, 0.25)' : '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: isDark ? '#CBD5E1' : '#334155',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-sky-400' : 'text-[#0053AF]'}`} />
              <span>
                <strong style={{ color: isDark ? '#FFFFFF' : '#062A77' }}>Privacidad Ciudadana (Ley N° 8968):</strong> Tu cédula oficial permanece protegida y nunca se expone en tus comentarios públicos ni participaciones en la plataforma.
              </span>
            </div>
            <Link to="/perfil" style={{ color: isDark ? '#38BDF8' : '#0053AF', fontWeight: 600, textDecoration: 'none' }}>
              Ver mi expediente &rarr;
            </Link>
          </div>
        </div>

        {/* ====================================================================
            MÓDULOS CÍVICOS HABILITADOS PARA EL CIUDADANO
            Tarjetas luminosas y claras, 100% integradas a la paleta institucional
            ==================================================================== */}
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: isDark ? '#FFFFFF' : '#062A77',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>Servicios e Interacciones Disponibles</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Card 1: Noticias Municipales */}
          <Link
            to="/noticias"
            style={{
              textDecoration: 'none',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderRadius: '20px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px -2px rgba(6, 42, 119, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-sky-500/50 hover:shadow-lg hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#EFF6FF',
                  border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#38BDF8' : '#0284C7',
                  marginBottom: '1rem'
                }}
              >
                <Newspaper className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#062A77' }}>
                Noticias & Comunicados Municipales
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.86rem', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.55 }}>
                Visualiza los comunicados oficiales del Concejo Municipal de {canton}, opina cívicamente y reacciona con sellos de apoyo o alerta.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#38BDF8' : '#0284C7', fontSize: '0.84rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Explorar noticias</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Foro Tico & Debates */}
          <Link
            to="/foro"
            style={{
              textDecoration: 'none',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderRadius: '20px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px -2px rgba(6, 42, 119, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-purple-500/50 hover:shadow-lg hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(168, 85, 247, 0.15)' : '#FAF5FF',
                  border: isDark ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid #E9D5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#C084FC' : '#7E22CE',
                  marginBottom: '1rem'
                }}
              >
                <MessageSquare className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#062A77' }}>
                Foro Tico & Debate Comunal
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.86rem', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.55 }}>
                Participa en hilos cívicos, responde propuestas vecinales y vota iniciativas cantonales con identidad protegida (Primer Nombre y Apellido).
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#C084FC' : '#7E22CE', fontSize: '0.84rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Entrar al foro</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Comercio Local y Emprendedores */}
          <Link
            to="/comercio"
            style={{
              textDecoration: 'none',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderRadius: '20px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px -2px rgba(6, 42, 119, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-amber-500/50 hover:shadow-lg hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
                  border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#FBBF24' : '#B45309',
                  marginBottom: '1rem'
                }}
              >
                <Store className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#062A77' }}>
                Comercios Locales & PyMES
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.86rem', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.55 }}>
                Descubre emprendimientos con patente cantonal, consulta productos de la feria del agricultor y contacta por WhatsApp o Waze.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#FBBF24' : '#B45309', fontSize: '0.84rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Ver comercios</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Visor Cartográfico GIS */}
          <Link
            to="/mapa-gis"
            style={{
              textDecoration: 'none',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderRadius: '20px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px -2px rgba(6, 42, 119, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
                  border: isDark ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#34D399' : '#047857',
                  marginBottom: '1rem'
                }}
              >
                <Map className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#062A77' }}>
                Visor Cartográfico & GIS Cantonal
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.86rem', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.55 }}>
                Explora el territorio en 3D, puntos de interés, rutas de servicio, albergues de la CNE y delimitación de los 84 cantones.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#34D399' : '#047857', fontSize: '0.84rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Abrir mapa GIS</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
