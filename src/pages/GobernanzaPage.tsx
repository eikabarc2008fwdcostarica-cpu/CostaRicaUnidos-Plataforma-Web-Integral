import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Building2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Landmark,
  Clock,
  Printer,
  Sparkles,
  MapPin
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { TablaActas } from '../components/gobernanza/TablaActas';
import { OrganigramaMunicipal } from '../components/gobernanza/OrganigramaMunicipal';
import {
  getAutoridadesCanton,
  getOrganigramaCanton,
  getActasCanton,
  AutoridadLocal
} from '../data/gobernanzaData';
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../data/costaRicaTerritorialData';

/**
 * GobernanzaPage — Portal Oficial del Gobierno Local y Concejo Municipal
 * Sistema Sovereign Civic Glass v2.1 • Transparencia Activa y Rendición de Cuentas
 * Artículos 13 y 17 del Código Municipal (Ley N° 7794) · Validez Jurídica y Participación Cívica
 */
export const GobernanzaPage: FC = () => {
  // Cantón activo sincronizado con el Navbar
  const [activeCantonName, setActiveCantonName] = useState<string>(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  const [tabActiva, setTabActiva] = useState<'actas' | 'organigrama' | 'audiencia'>('actas');

  // Modal para ver agenda pública de la autoridad
  const [autoridadAgenda, setAutoridadAgenda] = useState<AutoridadLocal | null>(null);

  // Formulario de Audiencia Formal ante el Concejo Municipal
  const [formularioAudiencia, setFormularioAudiencia] = useState({
    cedula: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    distrito: '',
    tipoSolicitud: 'concejo_pleno',
    fundamentacion: ''
  });

  const [erroresFormulario, setErroresFormulario] = useState<Record<string, string>>({});
  const [radicadoExitoso, setRadicadoExitoso] = useState<{
    numeroExpediente: string;
    fechaHora: string;
    canton: string;
    ciudadano: string;
    tipoSolicitudTexto: string;
  } | null>(null);

  // Escuchar cambios de cantón desde el Navbar
  useEffect(() => {
    const handleCantonChange = (e: any) => {
      if (e.detail?.nombre) {
        setActiveCantonName(e.detail.nombre);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  // Buscar datos territoriales del cantón activo
  const cantonActual = CANTONES_OFICIALES.find(
    (c) => c.nombre.toLowerCase() === activeCantonName.toLowerCase()
  ) || CANTONES_OFICIALES[0];

  const provinciaActual = PROVINCIAS_DATA.find(
    (p) => p.id === cantonActual.provinciaId
  ) || PROVINCIAS_DATA[0];

  const cantonId = cantonActual.id || 1;
  const autoridades = getAutoridadesCanton(cantonId);
  const organigrama = getOrganigramaCanton(cantonId);
  const actas = getActasCanton(cantonId);

  // Validación y envío del formulario de audiencia
  const handleAudienciaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errores: Record<string, string> = {};

    if (!formularioAudiencia.cedula.trim()) {
      errores.cedula = 'La cédula de identidad es obligatoria según la Ley Orgánica del TSE.';
    } else if (formularioAudiencia.cedula.trim().length < 9) {
      errores.cedula = 'Ingrese una cédula costarricense válida (9 a 12 dígitos sin guiones).';
    }

    if (!formularioAudiencia.nombreCompleto.trim()) {
      errores.nombreCompleto = 'Debe indicar su nombre y apellidos completos.';
    }

    if (!formularioAudiencia.correo.trim() || !formularioAudiencia.correo.includes('@')) {
      errores.correo = 'Indique un correo electrónico oficial válido para recibir notificaciones.';
    }

    if (!formularioAudiencia.telefono.trim()) {
      errores.telefono = 'El teléfono de contacto es obligatorio para coordinación del Concejo.';
    }

    if (!formularioAudiencia.fundamentacion.trim() || formularioAudiencia.fundamentacion.trim().length < 30) {
      errores.fundamentacion = 'Debe fundamentar detalladamente el asunto cívico de interés comunal (mínimo 30 caracteres).';
    }

    if (Object.keys(errores).length > 0) {
      setErroresFormulario(errores);
      return;
    }

    setErroresFormulario({});

    // Generar radicado oficial soberano
    const aleatorio = Math.floor(10000 + Math.random() * 90000);
    const numeroExp = `EXP-CR-2026-${cantonActual.codigoDta}-${aleatorio}`;
    const ahora = new Date().toLocaleString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mapaTipos: Record<string, string> = {
      concejo_pleno: 'Audiencia formal ante el Concejo Municipal en Pleno (Art. 13 inc. d Código Municipal)',
      comision_obras: 'Audiencia ante la Comisión Permanente de Obras Públicas y Plan Regulador',
      peticion_civica: 'Petición Cívica y Rendición de Cuentas (Art. 27 de la Constitución Política)'
    };

    setRadicadoExitoso({
      numeroExpediente: numeroExp,
      fechaHora: ahora,
      canton: cantonActual.nombre,
      ciudadano: formularioAudiencia.nombreCompleto,
      tipoSolicitudTexto: mapaTipos[formularioAudiencia.tipoSolicitud] || 'Audiencia Municipal'
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#00040D',
        color: '#FFFFFF',
        position: 'relative',
        fontFamily: 'var(--font-body, system-ui, sans-serif)'
      }}
    >
      <Navbar />

      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        {/* ==========================================================================
            1. CABECERA INSTITUCIONAL DEL GOBIERNO LOCAL
            Membrete Solemne · Escudo / Insignia Cantonal · Código Municipal Arts. 13 y 17
            ========================================================================== */}
        <section
          style={{
            backgroundColor: 'rgba(0, 15, 45, 0.72)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '2.5rem 2.5rem 2.25rem',
            marginBottom: '3rem',
            boxShadow: '0 20px 60px rgba(0, 4, 13, 0.8), 0 0 35px rgba(0, 20, 137, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Cinta Tricolor Superior de Estado */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #001489 0%, #001489 20%, #FFFFFF 20%, #FFFFFF 30%, #DA291C 30%, #DA291C 70%, #FFFFFF 70%, #FFFFFF 80%, #001489 80%, #001489 100%)'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem'
            }}
          >
            {/* Lado Izquierdo: Membrete con Escudo Heráldico Cantonal */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', maxWidth: '880px' }}>
              {/* Emblema Heráldico Municipal de Alta Distinción */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(0, 20, 137, 0.55)',
                  border: '2px solid rgba(121, 166, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0, 20, 137, 0.5)',
                  flexShrink: 0
                }}
              >
                <Landmark size={36} color="#79a6ff" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <CivicBadge variant="provincial" size="md">
                    GOBIERNO LOCAL AUTÓNOMO
                  </CivicBadge>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                    PROVINCIA DE {provinciaActual.nombre.toUpperCase()} · DTA {cantonActual.codigoDta}
                  </span>
                  <span style={{ color: '#475569' }}>•</span>
                  <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700 }}>
                    CABECERA: {cantonActual.cabecera.toUpperCase()}
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)',
                    fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    margin: '0 0 0.75rem 0'
                  }}
                >
                  Gobierno Local y Concejo Municipal de {cantonActual.nombre}
                </h1>

                <p
                  style={{
                    fontSize: '1.05rem',
                    color: '#CBD5E1',
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 500
                  }}
                >
                  Espacio Administrativo, Transparencia Activa y Rendición de Cuentas (Artículos 13 y 17 del Código Municipal)
                </p>
              </div>
            </div>

            {/* Lado Derecho: Metadatos Normativos y Sellos de Transparencia */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                backgroundColor: 'rgba(0, 4, 13, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                fontSize: '0.8rem',
                minWidth: '260px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <ShieldCheck size={16} color="#34D399" />
                <span>Régimen Municipal Ley N° 7794</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <CheckCircle2 size={16} color="#79a6ff" />
                <span>Fiscalización Contraloría (CGR)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <FileCheck size={16} color="#FBBF24" />
                <span>Fe Pública y Firma Digital Ley N° 8454</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. MÓDULO DE AUTORIDADES ELECTAS (DISEÑO SOLEMNE CON MARCO PLATEADO)
            Fotografía oficial con marco de distinción · Alcalde, Vicealcaldesa, Presidente
            Periodo 2024 - 2028 · Canales oficiales de fiscalización y Agenda Pública
            ========================================================================== */}
        <section aria-labelledby="seccion-autoridades" style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#79a6ff', display: 'block', marginBottom: '0.25rem' }}>
                JERARQUÍA DEL GOBIERNO MUNICIPAL
              </span>
              <h2
                id="seccion-autoridades"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: 0,
                  fontFamily: 'var(--font-headline, sans-serif)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                <Users size={24} color="#79a6ff" />
                <span>Autoridades Electas del Cantón</span>
              </h2>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
              Periodo Constitucional Oficial: <strong style={{ color: '#FFFFFF' }}>2024 - 2028</strong>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {autoridades.map((autoridad) => (
              <div
                key={autoridad.id}
                style={{
                  backgroundColor: 'rgba(0, 15, 45, 0.65)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)', // Borde plateado institucional normado
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 12px 35px rgba(0, 4, 13, 0.75)',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.45)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 20, 60, 0.82)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 20, 137, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 15, 45, 0.65)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 4, 13, 0.75)';
                }}
              >
                <div>
                  {/* Encabezado de la Ficha: Fotografía con Marco Distinguido y Cargo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {/* Marco de Alta Distinción Plateado Institucional */}
                    <div
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '2px solid rgba(255, 255, 255, 0.35)',
                        boxShadow: '0 8px 20px rgba(0, 4, 13, 0.8), 0 0 15px rgba(121, 166, 255, 0.3)',
                        flexShrink: 0,
                        backgroundColor: 'rgba(0, 4, 13, 0.8)'
                      }}
                    >
                      <img
                        src={autoridad.fotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                        alt={`Fotografía oficial de ${autoridad.nombre}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    <div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(0, 20, 137, 0.4)',
                          color: '#79a6ff',
                          border: '1px solid rgba(121, 166, 255, 0.3)',
                          textTransform: 'uppercase',
                          display: 'inline-block',
                          marginBottom: '0.35rem'
                        }}
                      >
                        {autoridad.cargo}
                      </span>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          margin: 0,
                          lineHeight: 1.2
                        }}
                      >
                        {autoridad.nombre}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', display: 'block' }}>
                        Periodo Constitucional {autoridad.periodo}
                      </span>
                    </div>
                  </div>

                  {/* Vías Oficiales de Fiscalización */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem',
                      fontSize: '0.84rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Mail size={15} color="#79a6ff" />
                      <span style={{ color: '#94A3B8' }}>Correo Despacho:</span>
                      <a
                        href={`mailto:${autoridad.correo}`}
                        style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}
                      >
                        {autoridad.correo}
                      </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Phone size={15} color="#34D399" />
                      <span style={{ color: '#94A3B8' }}>Teléfono Central:</span>
                      <span style={{ color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 600 }}>
                        {autoridad.telefono}
                      </span>
                    </div>

                    {autoridad.despacho && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Building2 size={15} color="#FBBF24" />
                        <span style={{ color: '#94A3B8' }}>Sede:</span>
                        <span style={{ color: '#E2E8F0' }}>{autoridad.despacho}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón de Agenda Pública y Rendición de Cuentas */}
                <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setAutoridadAgenda(autoridad)}
                    aria-label={`Ver agenda pública y rendición de cuentas de ${autoridad.nombre}`}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      color: '#E2E8F0',
                      padding: '0.6rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.4)';
                      e.currentTarget.style.borderColor = '#79a6ff';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                      e.currentTarget.style.color = '#E2E8F0';
                    }}
                  >
                    <Calendar size={14} color="#79a6ff" />
                    <span>Ver Agenda Pública y Despacho</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal de Agenda Pública de la Autoridad */}
        {autoridadAgenda && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Agenda de despacho de ${autoridadAgenda.nombre}`}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              backgroundColor: 'rgba(0, 4, 13, 0.82)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setAutoridadAgenda(null);
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                backgroundColor: 'rgba(0, 10, 28, 0.96)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '20px',
                padding: '2rem',
                color: '#FFFFFF',
                boxShadow: '0 25px 60px rgba(0, 4, 13, 0.95)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#79a6ff', textTransform: 'uppercase' }}>
                    AGENDA PÚBLICA DE FISCALIZACIÓN
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.2rem 0 0 0' }}>
                    {autoridadAgenda.nombre}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{autoridadAgenda.cargo}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoridadAgenda(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#FFFFFF',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#79a6ff', fontWeight: 700, fontSize: '0.88rem' }}>
                  <Clock size={16} />
                  <span>Horarios Oficiales de Despacho Comunal:</span>
                </div>
                <p style={{ margin: '0 0 0.85rem 0', color: '#E2E8F0', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {autoridadAgenda.agendaPublica || 'Lunes a Viernes de 08:00 a 16:00 hrs mediante cita formal.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34D399', fontWeight: 700, fontSize: '0.88rem' }}>
                  <ShieldCheck size={16} />
                  <span>Transparencia y Declaración Jurada:</span>
                </div>
                <p style={{ margin: '0.25rem 0 0 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                  Declaración de bienes y patrimonio al día ante la Contraloría General de la República (Ley N° 8422 contra la Corrupción y el Enriquecimiento Ilícito).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAutoridadAgenda(null)}
                style={{
                  width: '100%',
                  backgroundColor: '#002B7F',
                  color: '#FFFFFF',
                  border: '1px solid rgba(121, 166, 255, 0.4)',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cerrar Consulta
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================================
            3. SELECTOR DE PESTAÑAS PRINCIPALES DEL CONCEJO
            Actas Oficiales vs Organigrama Municipal vs Solicitar Audiencia Cívica
            ========================================================================== */}
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '2rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
          role="tablist"
          aria-label="Secciones de Gobernanza y Concejo Municipal"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'actas'}
            onClick={() => setTabActiva('actas')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: tabActiva === 'actas' ? '3px solid #79a6ff' : '3px solid transparent',
              color: tabActiva === 'actas' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '0.85rem 1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <FileText size={18} color={tabActiva === 'actas' ? '#79a6ff' : '#94A3B8'} />
            <span>Gaceta de Actas y Acuerdos</span>
            <span
              style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(0, 20, 137, 0.5)',
                color: '#79a6ff',
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
                border: '1px solid rgba(121, 166, 255, 0.3)'
              }}
            >
              {actas.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'organigrama'}
            onClick={() => setTabActiva('organigrama')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: tabActiva === 'organigrama' ? '3px solid #79a6ff' : '3px solid transparent',
              color: tabActiva === 'organigrama' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '0.85rem 1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Building2 size={18} color={tabActiva === 'organigrama' ? '#79a6ff' : '#94A3B8'} />
            <span>Organigrama de Dependencias</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'audiencia'}
            onClick={() => setTabActiva('audiencia')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: tabActiva === 'audiencia' ? '3px solid #79a6ff' : '3px solid transparent',
              color: tabActiva === 'audiencia' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '0.85rem 1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Calendar size={18} color={tabActiva === 'audiencia' ? '#79a6ff' : '#94A3B8'} />
            <span>Solicitar Audiencia Formal</span>
          </button>
        </div>

        {/* ==========================================================================
            4. CONTENIDO DE LAS PESTAÑAS
            Pestaña 1: TablaActas (Gaceta Municipal y Acuerdos)
            Pestaña 2: Organigrama Institucional
            Pestaña 3: Formulario Validado de Audiencia Ciudadana
            ========================================================================== */}
        {tabActiva === 'actas' && (
          <section aria-label="Visor Oficial de Actas y Acuerdos Municipales">
            <TablaActas actas={actas} />
          </section>
        )}

        {tabActiva === 'organigrama' && (
          <section aria-label="Organigrama Institucional del Gobierno Local">
            <OrganigramaMunicipal raiz={organigrama} />
          </section>
        )}

        {tabActiva === 'audiencia' && (
          <section aria-label="Formulario de Solicitud de Audiencia Formal ante el Concejo">
            <div
              style={{
                backgroundColor: 'rgba(0, 15, 45, 0.65)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '24px',
                padding: '2.5rem',
                boxShadow: '0 15px 45px rgba(0, 4, 13, 0.8)'
              }}
            >
              {radicadoExitoso ? (
                /* Comprobante Oficial de Radicación */
                <div
                  style={{
                    textAlign: 'center',
                    maxWidth: '680px',
                    margin: '0 auto',
                    padding: '2rem 1rem'
                  }}
                >
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(52, 211, 153, 0.18)',
                      border: '2px solid #34D399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem'
                    }}
                  >
                    <CheckCircle2 size={36} color="#34D399" />
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34D399', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    PETICIÓN CÍVICA RADICADA SATISFACTORIAMENTE
                  </span>
                  <h3
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      margin: '0.5rem 0 1rem 0',
                      fontFamily: 'var(--font-headline, sans-serif)'
                    }}
                  >
                    Expediente Oficial N° {radicadoExitoso.numeroExpediente}
                  </h3>

                  <p style={{ color: '#CBD5E1', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '2rem' }}>
                    Su solicitud de audiencia ante el <strong>Concejo Municipal de {radicadoExitoso.canton}</strong> ha sido radicada con fe pública conforme al Artículo 13 inciso d) del Código Municipal y el Artículo 27 de la Constitución Política.
                  </p>

                  <div
                    style={{
                      backgroundColor: 'rgba(0, 4, 13, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      textAlign: 'left',
                      marginBottom: '2rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem'
                    }}
                  >
                    <div><span style={{ color: '#94A3B8' }}>Ciudadano Peticionario:</span> <strong style={{ color: '#FFFFFF' }}>{radicadoExitoso.ciudadano}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Tipo de Diligencia:</span> <strong style={{ color: '#79a6ff' }}>{radicadoExitoso.tipoSolicitudTexto}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Fecha y Hora de Radicación:</span> <strong style={{ color: '#FFFFFF' }}>{radicadoExitoso.fechaHora}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Estado Administrativo:</span> <strong style={{ color: '#34D399' }}>Radicado para Sesión Ordinaria</strong></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem'
                      }}
                    >
                      <Printer size={16} />
                      <span>Imprimir Comprobante</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRadicadoExitoso(null);
                        setFormularioAudiencia({
                          cedula: '',
                          nombreCompleto: '',
                          correo: '',
                          telefono: '',
                          distrito: '',
                          tipoSolicitud: 'concejo_pleno',
                          fundamentacion: ''
                        });
                      }}
                      style={{
                        backgroundColor: '#002B7F',
                        border: '1px solid rgba(121, 166, 255, 0.5)',
                        color: '#FFFFFF',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Radicar Nueva Petición
                    </button>
                  </div>
                </div>
              ) : (
                /* Formulario Formal de Audiencia */
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#79a6ff', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      MECANISMO FORMAL DE PARTICIPACIÓN CIUDADANA
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', margin: '0.35rem 0 0.5rem 0', fontFamily: 'var(--font-headline, sans-serif)' }}>
                      Solicitud Formal de Audiencia ante el Concejo Municipal
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                      Los ciudadanos debidamente identificados tienen derecho a exponer asuntos de interés público comunal ante el cuerpo deliberativo del Gobierno Local de {cantonActual.nombre}.
                    </p>
                  </div>

                  <form onSubmit={handleAudienciaSubmit} noValidate>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1.5rem'
                      }}
                    >
                      {/* Campo Cédula de Identidad */}
                      <div>
                        <label
                          htmlFor="campo-cedula"
                          style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.45rem' }}
                        >
                          Cédula de Identidad o DIMEX <span style={{ color: '#FF6B6B' }}>*</span>
                        </label>
                        <input
                          id="campo-cedula"
                          type="text"
                          value={formularioAudiencia.cedula}
                          onChange={(e) => setFormularioAudiencia({ ...formularioAudiencia, cedula: e.target.value })}
                          placeholder="Ej: 101110222"
                          aria-describedby={erroresFormulario.cedula ? 'error-cedula' : undefined}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem',
                            backgroundColor: 'rgba(0, 4, 13, 0.75)',
                            border: erroresFormulario.cedula ? '1px solid #FF6B6B' : '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                        {erroresFormulario.cedula && (
                          <span id="error-cedula" style={{ color: '#FF6B6B', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
                            {erroresFormulario.cedula}
                          </span>
                        )}
                      </div>

                      {/* Campo Nombre Completo */}
                      <div>
                        <label
                          htmlFor="campo-nombre"
                          style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.45rem' }}
                        >
                          Nombre y Apellidos Completos <span style={{ color: '#FF6B6B' }}>*</span>
                        </label>
                        <input
                          id="campo-nombre"
                          type="text"
                          value={formularioAudiencia.nombreCompleto}
                          onChange={(e) => setFormularioAudiencia({ ...formularioAudiencia, nombreCompleto: e.target.value })}
                          placeholder="Ej: María Elena Valverde Castro"
                          aria-describedby={erroresFormulario.nombreCompleto ? 'error-nombre' : undefined}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem',
                            backgroundColor: 'rgba(0, 4, 13, 0.75)',
                            border: erroresFormulario.nombreCompleto ? '1px solid #FF6B6B' : '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                        {erroresFormulario.nombreCompleto && (
                          <span id="error-nombre" style={{ color: '#FF6B6B', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
                            {erroresFormulario.nombreCompleto}
                          </span>
                        )}
                      </div>

                      {/* Campo Correo Electrónico */}
                      <div>
                        <label
                          htmlFor="campo-correo"
                          style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.45rem' }}
                        >
                          Correo Electrónico de Notificaciones <span style={{ color: '#FF6B6B' }}>*</span>
                        </label>
                        <input
                          id="campo-correo"
                          type="email"
                          value={formularioAudiencia.correo}
                          onChange={(e) => setFormularioAudiencia({ ...formularioAudiencia, correo: e.target.value })}
                          placeholder="Ej: maria.valverde@correo.cr"
                          aria-describedby={erroresFormulario.correo ? 'error-correo' : undefined}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem',
                            backgroundColor: 'rgba(0, 4, 13, 0.75)',
                            border: erroresFormulario.correo ? '1px solid #FF6B6B' : '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                        {erroresFormulario.correo && (
                          <span id="error-correo" style={{ color: '#FF6B6B', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
                            {erroresFormulario.correo}
                          </span>
                        )}
                      </div>

                      {/* Campo Teléfono */}
                      <div>
                        <label
                          htmlFor="campo-telefono"
                          style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.45rem' }}
                        >
                          Teléfono de Contacto <span style={{ color: '#FF6B6B' }}>*</span>
                        </label>
                        <input
                          id="campo-telefono"
                          type="tel"
                          value={formularioAudiencia.telefono}
                          onChange={(e) => setFormularioAudiencia({ ...formularioAudiencia, telefono: e.target.value })}
                          placeholder="Ej: 8888-2222"
                          aria-describedby={erroresFormulario.telefono ? 'error-telefono' : undefined}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem',
                            backgroundColor: 'rgba(0, 4, 13, 0.75)',
                            border: erroresFormulario.telefono ? '1px solid #FF6B6B' : '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                        {erroresFormulario.telefono && (
                          <span id="error-telefono" style={{ color: '#FF6B6B', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
                            {erroresFormulario.telefono}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selector de Tipo de Solicitud */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label
                        htmlFor="campo-tipo"
                        style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.45rem' }}
                      >
                        Naturaleza de la Audiencia o Petición
                      </label>
                      <select
                        id="campo-tipo"
                        value={formularioAudiencia.tipoSolicitud}
                        onChange={(e) => setFormularioAudiencia({ ...formularioAudiencia, tipoSolicitud: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem',
                          backgroundColor: 'rgba(0, 4, 13, 0.85)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      >
                        <option value="concejo_pleno">Audiencia formal ante el Concejo Municipal en Pleno (Sesión Ordinaria)</option>
                        <option value="comision_obras">Audiencia ante Comisión Permanente de Obras Públicas y Plan Regulador</option>
                        <option value="peticion_civica">Petición Cívica y Rendición de Cuentas (Artículo 27 de la Constitución Política)</option>
                      </select>
                    </div>

                    {/* Fundamentación / Justificación del Asunto */}
                    <div style={{ marginBottom: '2rem' }}>
                      <label
                        htmlFor="campo-fundamentacion"
                        style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.45rem' }}
                      >
                        Fundamentación del Asunto Comunitario de Interés Público <span style={{ color: '#FF6B6B' }}>*</span>
                      </label>
                      <textarea
                        id="campo-fundamentacion"
                        rows={4}
                        value={formularioAudiencia.fundamentacion}
                        onChange={(e) => setFormularioAudiencia({ ...formularioAudiencia, fundamentacion: e.target.value })}
                        placeholder="Exponga con claridad los motivos, fundamentos fácticos o legales y la propuesta o petición que somete a consideración del Concejo Municipal..."
                        aria-describedby={erroresFormulario.fundamentacion ? 'error-fundamentacion' : undefined}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: 'rgba(0, 4, 13, 0.75)',
                          border: erroresFormulario.fundamentacion ? '1px solid #FF6B6B' : '1px solid rgba(255, 255, 255, 0.18)',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none',
                          lineHeight: 1.6
                        }}
                      />
                      {erroresFormulario.fundamentacion && (
                        <span id="error-fundamentacion" style={{ color: '#FF6B6B', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
                          {erroresFormulario.fundamentacion}
                        </span>
                      )}
                    </div>

                    {/* Botón de Envío y Respaldo Legal */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', maxWidth: '520px' }}>
                        Al enviar, se generará un número de expediente oficial con trazabilidad pública bajo la Ley N° 8968 de Protección de Datos Personales.
                      </span>

                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#002B7F',
                          backgroundImage: 'linear-gradient(135deg, #002B7F 0%, #001489 100%)',
                          border: '1px solid rgba(121, 166, 255, 0.5)',
                          color: '#FFFFFF',
                          padding: '0.75rem 2rem',
                          borderRadius: '9999px',
                          fontSize: '0.92rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 16px rgba(0, 20, 137, 0.6)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0036a1';
                          e.currentTarget.style.borderColor = '#79a6ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#002B7F';
                          e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.5)';
                        }}
                      >
                        <span>Radicar Petición Oficial</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ==========================================================================
            5. ENLACE DESTACADO A PRESUPUESTOS PARTICIPATIVOS (/participacion)
            Conexión Ciudadana con la Votación Directa y Fiscalización Presupuestaria
            ========================================================================== */}
        <section
          style={{
            marginTop: '3.5rem',
            backgroundColor: 'rgba(0, 20, 137, 0.28)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(121, 166, 255, 0.35)',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 15px 45px rgba(0, 4, 13, 0.7)'
          }}
        >
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#34D399',
                  boxShadow: '0 0 8px #34D399'
                }}
              />
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#34D399'
                }}
              >
                DEMOCRACIA DIRECTA Y FISCALIZACIÓN DEL GASTO PÚBLICO
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '0 0 0.65rem 0',
                fontFamily: 'var(--font-headline, sans-serif)'
              }}
            >
              Presupuestos Participativos del Cantón de {cantonActual.nombre}
            </h3>

            <p style={{ fontSize: '0.96rem', color: '#CBD5E1', lineHeight: 1.65, margin: 0 }}>
              Ejerza su derecho al voto blindado y decida el destino de los recursos municipales asignados a obras distritales, canchas multiuso y aceras accesibles en su comunidad (1 voto por cédula legal verificada).
            </p>
          </div>

          <Link
            to="/participacion"
            style={{
              textDecoration: 'none',
              backgroundColor: '#002B7F',
              backgroundImage: 'linear-gradient(135deg, #002B7F 0%, #001489 100%)',
              border: '1px solid rgba(121, 166, 255, 0.5)',
              color: '#FFFFFF',
              padding: '0.85rem 1.75rem',
              borderRadius: '9999px',
              fontSize: '0.92rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              boxShadow: '0 6px 20px rgba(0, 20, 137, 0.6)',
              transition: 'all 0.25s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0036a1';
              e.currentTarget.style.borderColor = '#79a6ff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#002B7F';
              e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Participar y Votar Proyectos</span>
            <ExternalLink size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default GobernanzaPage;
