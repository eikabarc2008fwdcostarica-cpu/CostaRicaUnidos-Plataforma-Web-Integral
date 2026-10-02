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
import { obtenerNombrePublico } from '../utils/privacyUtils';

export default function PortalCiudadanoPage() {
  const { user, usuarioActual } = useAuth();
  const currentUser = usuarioActual || user;

  const nombreCompleto = currentUser?.nombre || 'Eiker Manuel Abarca Murillo';
  const nombrePublico = obtenerNombrePublico(nombreCompleto);
  const canton = currentUser?.canton || 'San José';
  const provincia = currentUser?.provincia || 'San José';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#00040D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column'
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
        {/* Banner de Bienvenida Soberana */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            backgroundColor: 'rgba(7, 13, 27, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '2.25rem 2rem',
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 43, 127, 0.25)',
            marginBottom: '2.5rem'
          }}
        >
          {/* Cinta Tricolor */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  Plataforma Cívica Soberana
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Cantón de {canton}, {provincia}
                </span>
              </div>

              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Bienvenido(a), <span style={{ color: '#38BDF8' }}>{nombrePublico}</span>
              </h1>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: '#94A3B8', maxWidth: '650px', lineHeight: 1.5 }}>
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
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease'
                }}
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
              backgroundColor: 'rgba(0, 43, 127, 0.25)',
              border: '1px solid rgba(121, 166, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: '#CBD5E1',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>
                <strong>Privacidad Ciudadana (Ley N° 8968):</strong> Tu cédula oficial permanece protegida y nunca se expone en tus comentarios públicos ni participaciones en la plataforma.
              </span>
            </div>
            <Link to="/perfil" style={{ color: '#38BDF8', fontWeight: 600, textDecoration: 'none' }}>
              Ver mi expediente &rarr;
            </Link>
          </div>
        </div>

        {/* ====================================================================
            MÓDULOS CÍVICOS HABILITADOS PARA EL CIUDADANO (REQUERIMIENTO 5)
            ==================================================================== */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Servicios e Interacciones Disponibles</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Card 1: Noticias Municipales */}
          <Link
            to="/noticias"
            style={{
              textDecoration: 'none',
              backgroundColor: '#070D1B',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-sky-500/40 hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  marginBottom: '1rem'
                }}
              >
                <Newspaper className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                Noticias & Comunicados Municipales
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
                Visualiza los comunicados oficiales del Concejo Municipal de {canton}, opina cívicamente y reacciona con sellos de apoyo o alerta.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontSize: '0.82rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Explorar noticias</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Foro Tico & Debates */}
          <Link
            to="/foro"
            style={{
              textDecoration: 'none',
              backgroundColor: '#070D1B',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-sky-500/40 hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C084FC',
                  marginBottom: '1rem'
                }}
              >
                <MessageSquare className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                Foro Tico & Debate Comunal
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
                Participa en hilos cívicos, responde propuestas vecinales y vota iniciativas cantonales con identidad protegida (Primer Nombre y Apellido).
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#C084FC', fontSize: '0.82rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Entrar al foro</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Comercio Local y Emprendedores */}
          <Link
            to="/comercio"
            style={{
              textDecoration: 'none',
              backgroundColor: '#070D1B',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-amber-500/40 hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FBBF24',
                  marginBottom: '1rem'
                }}
              >
                <Store className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                Comercios Locales & PyMES
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
                Descubre emprendimientos con patente cantonal, consulta productos de la feria del agricultor y contacta por WhatsApp o Waze.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FBBF24', fontSize: '0.82rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Ver comercios</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Visor Cartográfico GIS */}
          <Link
            to="/mapa-gis"
            style={{
              textDecoration: 'none',
              backgroundColor: '#070D1B',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease'
            }}
            className="hover:border-emerald-500/40 hover:-translate-y-1"
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  marginBottom: '1rem'
                }}
              >
                <Map className="w-5 h-5" />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                Visor Cartográfico & GIS Cantonal
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
                Explora el territorio en 3D, puntos de interés, rutas de servicio, albergues de la CNE y delimitación de los 84 cantones.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34D399', fontSize: '0.82rem', fontWeight: 600, marginTop: '1.25rem' }}>
              <span>Abrir mapa GIS</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
