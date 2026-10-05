import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Store,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { obtenerNombrePublico, formatearCedulaOficial } from '../utils/privacyUtils';
import { enviarSolicitudEmprendedorApi, consultarSolicitudCiudadano, SolicitudEmprendedor } from '../services/emprendedorService';
import { CANTONES_OFICIALES } from '../data/costaRicaTerritorialData';

export default function PerfilPage() {
  const { usuarioId } = useParams<{ usuarioId?: string }>();
  const { user, usuarioActual, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const currentUser = usuarioActual || user;

  // Determinar si es vista privada del titular o vista de un tercero
  const esMiPerfil = !usuarioId || (currentUser && (currentUser.id === usuarioId || currentUser.cedula === usuarioId));

  // Estados del Formulario de Solicitud de Emprendedor
  const [solicitudExistente, setSolicitudExistente] = useState<SolicitudEmprendedor | null>(null);
  const [cargandoSolicitud, setCargandoSolicitud] = useState<boolean>(true);

  const [nombreEmprendimiento, setNombreEmprendimiento] = useState<string>('');
  const [correoComercial, setCorreoComercial] = useState<string>(
    currentUser?.correo || (currentUser as any)?.email || ''
  );
  const [categoriaComercial, setCategoriaComercial] = useState<string>('Gastronomía y Alimentos');
  const [cantonComercial, setCantonComercial] = useState<string>(currentUser?.canton || 'San José');
  const [justificacion, setJustificacion] = useState<string>('');

  const [enviando, setEnviando] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const cedulaOficial = currentUser?.cedula || '';
  const nombreTitular = currentUser?.nombre || 'Ciudadano Residente';
  const correoPersonal = currentUser?.correo || (currentUser as any)?.email || '';
  const cantonTitular = currentUser?.canton || 'San José';
  const provinciaTitular = currentUser?.provincia || 'San José';
  const verificadoHacienda = currentUser?.verificadoHacienda ?? true;
  const fechaRegistro = (currentUser as any)?.fechaRegistro || '2026-05-10T14:20:00Z';
  const rolActual = currentUser?.rol || 'Ciudadano Residente';

  // Sincronizar correo comercial pre-rellenado cuando cargue el usuario
  useEffect(() => {
    const userEmail = currentUser?.correo || (currentUser as any)?.email;
    if (userEmail && !correoComercial) {
      setCorreoComercial(userEmail);
    }
  }, [currentUser?.correo, (currentUser as any)?.email]);

  // Nombre público sanitizado según Ley N° 8968 (Primer Nombre y Primer Apellido)
  const nombrePublico = obtenerNombrePublico(nombreTitular);

  // Cargar solicitud existente si la hubiera, filtrando estrictamente por el usuario autenticado
  useEffect(() => {
    if (!currentUser) {
      setCargandoSolicitud(false);
      setSolicitudExistente(null);
      return;
    }

    setCargandoSolicitud(true);
    consultarSolicitudCiudadano({
      id: currentUser.id,
      cedula: currentUser.cedula,
      correo: currentUser.correo || (currentUser as any)?.email
    })
      .then((sol) => {
        setSolicitudExistente(sol || null);
      })
      .catch((err) => {
        console.error('Error al consultar solicitud del usuario:', err);
        setSolicitudExistente(null);
      })
      .finally(() => setCargandoSolicitud(false));
  }, [currentUser?.id, currentUser?.cedula, currentUser?.correo, (currentUser as any)?.email]);

  const handleSubmitSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeExito(null);
    setMensajeError(null);

    if (!currentUser) {
      setMensajeError('Debe iniciar sesión para enviar una solicitud formal.');
      return;
    }

    if (!nombreEmprendimiento.trim()) {
      setMensajeError('Por favor ingrese el nombre del emprendimiento o comercio local.');
      return;
    }

    const emailAUsar = correoComercial.trim() || correoPersonal;
    if (!emailAUsar || !emailAUsar.includes('@')) {
      setMensajeError('Por favor ingrese un correo comercial válido para contacto comercial.');
      return;
    }

    if (!justificacion.trim()) {
      setMensajeError('Por favor detalle la actividad económica o justificación de su comercio.');
      return;
    }

    try {
      setEnviando(true);
      const res = await enviarSolicitudEmprendedorApi({
        usuarioId: currentUser.id, // Vínculo inequívoco
        cedula: cedulaOficial, // Inmutable, readOnly
        nombreCompleto: nombreTitular,
        correoPersonal,
        correoComercial: emailAUsar,
        nombreEmprendimiento: nombreEmprendimiento.trim(),
        categoriaComercial,
        canton: cantonComercial || cantonTitular,
        provincia: provinciaTitular,
        justificacion: justificacion.trim()
      });

      if (res.success && res.data) {
        setSolicitudExistente(res.data);
        setMensajeExito(
          '¡Solicitud enviada exitosamente al Gobierno Local! Se ha registrado en estado pendiente en db.json. Su rol permanecerá como Ciudadano hasta que sea aprobada por la administración.'
        );
      } else {
        setMensajeError(res.message || 'Error al enviar la solicitud.');
      }
    } catch (err: any) {
      setMensajeError(err?.message || 'Error inesperado al procesar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--theme-bg, #00040D)',
        color: 'var(--theme-text-primary, #FFFFFF)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          padding: '2.5rem 1.25rem 4rem'
        }}
      >
        {/* Banner Superior de Autodeterminación Informativa */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1rem 1.25rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(0, 43, 127, 0.25)',
            border: '1px solid rgba(121, 166, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8'
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                Protección de Datos Garantizada · Ley N° 8968
              </div>
              <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                {esMiPerfil
                  ? 'Usted se encuentra en su expediente privado protegido. Solo usted puede ver sus datos fiscales y cédula.'
                  : 'Vista de perfil público sanitizada. Cédula y datos sensibles protegidos.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94A3B8' }}>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encriptación TLS 1.3 · Ministerio de Hacienda</span>
          </div>
        </div>

        {/* ====================================================================
            VISTA PRIVADA DEL TITULAR (MI PERFIL)
            ==================================================================== */}
        {esMiPerfil ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Tarjeta Principal de Identidad Cívica */}
            <div
              style={{
                backgroundColor: '#070D1B',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '2px solid rgba(56, 189, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: '#38BDF8',
                      boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
                    }}
                  >
                    {nombreTitular.charAt(0)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {nombreTitular}
                      </h1>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(52, 211, 153, 0.35)',
                          color: '#6EE7B7',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {verificadoHacienda ? 'Verificado ante Hacienda' : 'Validación Pendiente'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.82rem', color: '#94A3B8' }}>
                      <span>Rol: <strong style={{ color: '#E2E8F0' }}>{rolActual}</strong></span>
                      <span>•</span>
                      <span>Nombre Público: <strong style={{ color: '#38BDF8' }}>{nombrePublico}</strong></span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/portal-ciudadano"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38BDF8',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  <span>Ir al Portal Ciudadano</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Rejilla de Datos Privados del Titular */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Cédula de Identidad Oficial</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9', fontFamily: 'monospace' }}>
                    {formatearCedulaOficial(cedulaOficial)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <Mail className="w-3 h-3 text-sky-400" />
                    <span>Correo Electrónico Personal</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F1F5F9' }}>
                    {correoPersonal}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>Cantón y Provincia</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F1F5F9' }}>
                    {cantonTitular}, {provinciaTitular}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span>Fecha de Registro</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F1F5F9' }}>
                    {new Date(fechaRegistro).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SECCIÓN: SOLICITAR CUENTA DE EMPRENDEDOR / COMERCIO LOCAL */}
            <div
              style={{
                backgroundColor: '#070D1B',
                borderRadius: '24px',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                padding: '2rem',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FBBF24'
                  }}
                >
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Solicitar Cuenta de Emprendedor / Comercio Local
                  </h2>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94A3B8' }}>
                    Trámite formal regulado para elevar su rol cívico y publicar comercios y ofertas en el directorio cantonal.
                  </p>
                </div>
              </div>

              {/* Si ya existe una solicitud registrada */}
              {solicitudExistente ? (
                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor:
                      solicitudExistente.estado?.toLowerCase() === 'aprobado'
                        ? 'rgba(16, 185, 129, 0.12)'
                        : solicitudExistente.estado?.toLowerCase() === 'rechazado'
                        ? 'rgba(239, 68, 68, 0.12)'
                        : 'rgba(251, 191, 36, 0.12)',
                    border: `1px solid ${
                      solicitudExistente.estado?.toLowerCase() === 'aprobado'
                        ? 'rgba(52, 211, 153, 0.35)'
                        : solicitudExistente.estado?.toLowerCase() === 'rechazado'
                        ? 'rgba(248, 113, 113, 0.35)'
                        : 'rgba(251, 191, 36, 0.35)'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {solicitudExistente.estado?.toLowerCase() === 'aprobado' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-400" />
                      )}
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
                        Estado de Solicitud:{' '}
                        <strong
                          style={{
                            textTransform: 'uppercase',
                            color:
                              solicitudExistente.estado?.toLowerCase() === 'aprobado'
                                ? '#34D399'
                                : solicitudExistente.estado?.toLowerCase() === 'rechazado'
                                ? '#F87171'
                                : '#FBBF24'
                          }}
                        >
                          {solicitudExistente.estado}
                        </strong>
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      Radicado: {new Date(solicitudExistente.fechaSolicitud).toLocaleDateString('es-CR')}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Emprendimiento:</span>{' '}
                      <strong style={{ color: '#F1F5F9' }}>{solicitudExistente.nombreEmprendimiento}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Correo Comercial:</span>{' '}
                      <strong style={{ color: '#38BDF8' }}>{solicitudExistente.correoComercial}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Categoría:</span>{' '}
                      <strong style={{ color: '#F1F5F9' }}>{solicitudExistente.categoriaComercial}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Cantón:</span>{' '}
                      <strong style={{ color: '#F1F5F9' }}>{solicitudExistente.canton}</strong>
                    </div>
                  </div>

                  {solicitudExistente.estado?.toLowerCase() === 'aprobado' && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(52, 211, 153, 0.35)',
                        fontSize: '0.82rem',
                        color: '#6EE7B7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        ¡Acreditación Oficial Concedida! Su emprendimiento <strong>{solicitudExistente.nombreEmprendimiento}</strong> ha sido <strong>APROBADO</strong> por la administración territorial y certificado para operar y participar en el directorio comercial y feria cantonal.
                      </span>
                    </div>
                  )}

                  {solicitudExistente.estado?.toLowerCase() === 'pendiente' && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        fontSize: '0.78rem',
                        color: '#CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Su solicitud está registrada en <strong>db.json</strong> y pendiente de revisión por el Administrador. Su rol cívico actual se mantiene como <strong>Ciudadano/Turista</strong> hasta que el funcionario apruebe formalmente la elevación de privilegios.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Formulario de Nueva Solicitud */
                <form onSubmit={handleSubmitSolicitud} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* REGLA INMUTABLE DE CÉDULA */}
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(0, 20, 137, 0.2)',
                      border: '1px solid rgba(0, 43, 127, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                      <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '0.2rem' }}>
                        Regla Inmutable de Cédula de Identidad (Identidad Civil & Fiscal)
                      </strong>
                      El número de cédula está bloqueado en solo lectura. Bajo ninguna circunstancia se permite transferir o cambiar la cédula asignada, ya que vincula legalmente la personería física ante el Ministerio de Hacienda y el TSE.
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {/* Campo 1: Cédula (Solo Lectura) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                        Cédula de Identidad (Bloqueada)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          value={formatearCedulaOficial(cedulaOficial)}
                          readOnly
                          disabled
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.2rem',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(15, 23, 42, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#94A3B8',
                            fontSize: '0.9rem',
                            fontFamily: 'monospace',
                            cursor: 'not-allowed',
                            boxSizing: 'border-box'
                          }}
                        />
                        <Lock className="w-4 h-4 text-amber-400" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>

                    {/* Campo 2: Nuevo Correo Comercial */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                        Nuevo Correo Electrónico Comercial <span style={{ color: '#38BDF8' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ej: contacto@mimiempresa.cr"
                        value={correoComercial}
                        onChange={(e) => setCorreoComercial(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 4, 13, 0.75)',
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Campo 3: Nombre del Emprendimiento */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                        Nombre del Emprendimiento / Comercio <span style={{ color: '#38BDF8' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej: Café y Tostaduría Don Manuel"
                        value={nombreEmprendimiento}
                        onChange={(e) => setNombreEmprendimiento(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 4, 13, 0.75)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Campo 4: Categoría Comercial */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                        Categoría Comercial <span style={{ color: '#38BDF8' }}>*</span>
                      </label>
                      <select
                        value={categoriaComercial}
                        onChange={(e) => setCategoriaComercial(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 4, 13, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Gastronomía y Alimentos">Gastronomía y Alimentos</option>
                        <option value="Agricultura y Feria del Agricultor">Agricultura y Feria del Agricultor</option>
                        <option value="Artesanías y Textiles">Artesanías y Textiles</option>
                        <option value="Tecnología y Servicios">Tecnología y Servicios</option>
                        <option value="Turismo y Hospedaje">Turismo y Hospedaje</option>
                        <option value="Comercio General">Comercio General</option>
                      </select>
                    </div>

                    {/* Campo 5: Cantón */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                        Cantón donde opera <span style={{ color: '#38BDF8' }}>*</span>
                      </label>
                      <select
                        value={cantonComercial}
                        onChange={(e) => setCantonComercial(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 4, 13, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      >
                        {CANTONES_OFICIALES.slice(0, 30).map((c) => (
                          <option key={c.id} value={c.nombre}>
                            {c.nombre} ({c.provincia})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Campo 6: Justificación / Descripción */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                      Justificación y Descripción de la Actividad Económica <span style={{ color: '#38BDF8' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describa los productos o servicios que ofrece, si cuenta con régimen simplificado o tradicional, y el motivo de su solicitud..."
                      value={justificacion}
                      onChange={(e) => setJustificacion(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0, 4, 13, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {mensajeError && (
                    <div style={{ color: '#F87171', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle className="w-4 h-4" />
                      <span>{mensajeError}</span>
                    </div>
                  )}

                  {mensajeExito && (
                    <div style={{ color: '#34D399', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{mensajeExito}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    style={{
                      alignSelf: 'flex-start',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.75rem 1.6rem',
                      borderRadius: '10px',
                      backgroundColor: '#D97706',
                      border: '1px solid #F59E0B',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: enviando ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                      opacity: enviando ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>{enviando ? 'Enviando al Gobierno Local...' : 'Enviar Solicitud al Gobierno Local'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* ====================================================================
             PERFIL PÚBLICO (VISTO POR OTROS CIUDADANOS)
             ==================================================================== */
          <div
            style={{
              backgroundColor: '#070D1B',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '2.5rem',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '2px solid rgba(56, 189, 248, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#38BDF8'
                }}
              >
                {nombrePublico.charAt(0)}
              </div>

              <div>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {nombrePublico}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.35)',
                      color: '#6EE7B7',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Ciudadano Verificado
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{cantonTitular}, {provinciaTitular}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                padding: '1.25rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem' }}>Fecha de Registro</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F1F5F9' }}>
                  {new Date(fechaRegistro).toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem' }}>Participación Cívica</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#38BDF8' }}>
                  Aportes Comunitarios Activos
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(0, 43, 127, 0.25)',
                border: '1px solid rgba(121, 166, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Lock className="w-4 h-4 text-sky-400 shrink-0" />
              <span style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                <strong>Privacidad de Datos Personales (Ley N° 8968):</strong> La cédula de identidad, el correo electrónico y la información tributaria de este ciudadano se encuentran estrictamente ocultos para terceros y protegidos por la ley.
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
