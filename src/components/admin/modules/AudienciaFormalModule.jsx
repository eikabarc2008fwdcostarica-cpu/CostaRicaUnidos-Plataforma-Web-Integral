/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO DE SOLICITUD DE AUDIENCIA FORMAL
 * Arquitectura: Sovereign Civic Glass v2.1
 * Normativa: Artículo 13 inc. d del Código Municipal (Ley N° 7794)
 * Derecho de Petición: Artículo 27 de la Constitución Política
 * ============================================================================
 */
import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Printer,
  Copy,
  Check,
  X,
  Clock,
  Sparkles,
  Send,
  Building2,
  FileText
} from 'lucide-react';
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../../../data/costaRicaTerritorialData';

export default function AudienciaFormalModule({
  provincia = 'Puntarenas',
  onNavigateModule = null
}) {
  // Resolver provincia activa
  const provinciaObj = useMemo(() => {
    const raw = typeof provincia === 'object' && provincia !== null ? provincia.nombre || provincia.id : provincia;
    const str = String(raw || 'Puntarenas').toLowerCase().trim();
    return (
      PROVINCIAS_DATA.find(
        (p) => p.nombre.toLowerCase() === str || String(p.id) === str || p.codigo.toLowerCase() === str
      ) || PROVINCIAS_DATA[5]
    );
  }, [provincia]);

  // Cantones de la provincia
  const cantones = useMemo(() => {
    return CANTONES_OFICIALES.filter((c) => c.provinciaId === provinciaObj.id);
  }, [provinciaObj.id]);

  // Cantón seleccionado
  const [selectedCantonId, setSelectedCantonId] = useState(() => {
    return cantones.length > 0 ? cantones[0].id : 1;
  });

  const cantonActual = useMemo(() => {
    return cantones.find((c) => c.id === selectedCantonId) || cantones[0] || {
      id: 1,
      nombre: provinciaObj.nombre,
      codigoDta: `${provinciaObj.id}01`,
      cabecera: provinciaObj.cabecera
    };
  }, [cantones, selectedCantonId]);

  // Estado del formulario
  const [formulario, setFormulario] = useState({
    cedula: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    distrito: '',
    tipoSolicitud: 'concejo_pleno',
    fundamentacion: ''
  });

  const [errores, setErrores] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Radicado exitoso
  const [radicado, setRadicado] = useState(null);
  const [copiadoExp, setCopiadoExp] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validación Cédula
    const cedulaLimpia = formulario.cedula.replace(/[-\s]/g, '');
    if (!cedulaLimpia) {
      nuevosErrores.cedula = 'La cédula de identidad es obligatoria según la Ley Orgánica del TSE.';
    } else if (cedulaLimpia.length < 9) {
      nuevosErrores.cedula = 'Ingrese una cédula costarricense válida (9 a 12 dígitos sin guiones).';
    }

    // Nombre
    if (!formulario.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'Debe indicar su nombre y apellidos completos.';
    }

    // Correo
    if (!formulario.correo.trim() || !formulario.correo.includes('@')) {
      nuevosErrores.correo = 'Indique un correo electrónico válido para recibir notificaciones oficiales.';
    }

    // Teléfono
    if (!formulario.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono de contacto es obligatorio para coordinación del Concejo.';
    }

    // Fundamentación
    if (!formulario.fundamentacion.trim() || formulario.fundamentacion.trim().length < 30) {
      nuevosErrores.fundamentacion = 'Debe fundamentar detalladamente el asunto cívico de interés comunal (mínimo 30 caracteres).';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const aleatorio = Math.floor(10000 + Math.random() * 90000);
      const numeroExp = `EXP-CR-2026-${cantonActual.codigoDta}-${aleatorio}`;
      const ahora = new Date().toLocaleString('es-CR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const mapaTipos = {
        concejo_pleno: 'Audiencia formal ante el Concejo Municipal en Pleno (Art. 13 inc. d Código Municipal)',
        comision_obras: 'Audiencia ante la Comisión Permanente de Obras Públicas y Plan Regulador',
        peticion_civica: 'Petición Cívica y Rendición de Cuentas (Art. 27 de la Constitución Política)'
      };

      setRadicado({
        numeroExpediente: numeroExp,
        fechaHora: ahora,
        canton: cantonActual.nombre,
        ciudadano: formulario.nombreCompleto,
        cedula: formulario.cedula,
        tipoSolicitudTexto: mapaTipos[formulario.tipoSolicitud] || 'Audiencia Municipal'
      });

      setIsSubmitting(false);
      setErrores({});
    }, 600);
  };

  const handleCopiarExpediente = () => {
    if (radicado?.numeroExpediente) {
      navigator.clipboard.writeText(radicado.numeroExpediente);
      setCopiadoExp(true);
      setTimeout(() => setCopiadoExp(false), 2000);
    }
  };

  const handleNuevaSolicitud = () => {
    setRadicado(null);
    setFormulario({
      cedula: '',
      nombreCompleto: '',
      correo: '',
      telefono: '',
      distrito: '',
      tipoSolicitud: 'concejo_pleno',
      fundamentacion: ''
    });
  };

  return (
    <div
      id="modulo-audiencia-formal"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        animation: 'fadeInModule 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <style>{`
        @keyframes fadeInModule {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* =================================================================== */}
      {/* 1. ENCABEZADO DE SOLICITUD DE AUDIENCIA FORMAL                      */}
      {/* =================================================================== */}
      <section
        style={{
          backgroundColor: 'rgba(5, 12, 28, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '2rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 4, 13, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #F59E0B 0%, #38BDF8 50%, #10B981 100%)'
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', maxWidth: '820px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1.5px solid rgba(251, 191, 36, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
                flexShrink: 0
              }}
            >
              <Calendar size={34} color="#FBBF24" />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '0.45rem',
                  flexWrap: 'wrap'
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    color: '#FBBF24',
                    border: '1px solid rgba(251, 191, 36, 0.3)'
                  }}
                >
                  PARTICIPACIÓN CIUDADANA
                </span>
                <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>
                  PROVINCIA DE {provinciaObj.nombre.toUpperCase()} • DTA {cantonActual.codigoDta}
                </span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ fontSize: '0.76rem', color: '#38BDF8', fontWeight: 700 }}>
                  CABECERA: {cantonActual.cabecera.toUpperCase()}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Mistical Spring', Georgia, serif",
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.2
                }}
              >
                Solicitud de Audiencia Formal ante el Concejo Municipal
              </h1>

              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#CBD5E1',
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: '720px'
                }}
              >
                Mecanismo formal e institucional garantizado por el Artículo 13 inc. d del Código Municipal y el Artículo 27 de la Constitución Política. Toda solicitud genera un expediente oficial radicado con seguimiento normativo.
              </p>
            </div>
          </div>

          {/* Selector de Cantón para la Solicitud */}
          <div
            style={{
              backgroundColor: 'rgba(0, 4, 13, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.1rem 1.35rem',
              minWidth: '260px'
            }}
          >
            <label
              htmlFor="canton-audiencia-select"
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: '#94A3B8',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}
            >
              Municipalidad Destino:
            </label>
            <select
              id="canton-audiencia-select"
              value={selectedCantonId}
              onChange={(e) => setSelectedCantonId(Number(e.target.value))}
              style={{
                width: '100%',
                backgroundColor: 'rgba(5, 12, 28, 0.95)',
                color: '#FFFFFF',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {cantones.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} (DTA {c.codigoDta})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. FORMULARIO FORMAL DE AUDIENCIA O RESULTADO DE RADICADO           */}
      {/* =================================================================== */}
      {radicado ? (
        /* Vista de Radicado Oficial Exitoso */
        <div
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 4, 13, 0.9), 0 0 30px rgba(16, 185, 129, 0.15)',
            maxWidth: '820px',
            margin: '0 auto',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
              }}
            >
              <CheckCircle2 size={32} color="#10B981" />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', fontFamily: "'JetBrains Mono', monospace", color: '#10B981', fontWeight: 800, textTransform: 'uppercase' }}>
                EXPEDIENTE RADICADO ANTE EL CONCEJO MUNICIPAL
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0.2rem 0 0 0' }}>
                Solicitud de Audiencia Registrada con Éxito
              </h2>
            </div>
          </div>

          {/* Tarjeta de Radicado */}
          <div
            style={{
              backgroundColor: 'rgba(0, 4, 13, 0.65)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>NÚMERO DE EXPEDIENTE OFICIAL:</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38BDF8', fontFamily: "'JetBrains Mono', monospace" }}>
                  {radicado.numeroExpediente}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopiarExpediente}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copiadoExp ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiadoExp ? 'Copiado' : 'Copiar Expediente'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Ciudadano Solicitante:</span>
                <strong style={{ color: '#F8FAFC' }}>{radicado.ciudadano}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Cédula de Identidad:</span>
                <strong style={{ color: '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>{radicado.cedula}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Concejo Municipal:</span>
                <strong style={{ color: '#38BDF8' }}>{radicado.canton}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Fecha y Hora de Radicación:</span>
                <strong style={{ color: '#CBD5E1' }}>{radicado.fechaHora}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8rem', color: '#94A3B8' }}>
              <strong>Tipo de Asunto:</strong> {radicado.tipoSolicitudTexto}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Printer size={16} />
              <span>Imprimir Comprobante</span>
            </button>

            <button
              type="button"
              onClick={handleNuevaSolicitud}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38BDF8',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Presentar Nueva Solicitud
            </button>
          </div>
        </div>
      ) : (
        /* Formulario Oficial Validado */
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '2.25rem',
            boxShadow: '0 20px 50px rgba(0, 4, 13, 0.8)'
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.4rem 0' }}>
              Formulario de Inscripción en la Orden del Día
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', margin: 0 }}>
              Complete la información de identificación ciudadana y detalle con precisión el asunto o interés público a exponer ante el Concejo Municipal de {cantonActual.nombre}.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Cédula */}
            <div>
              <label
                htmlFor="campo-cedula"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '0.45rem'
                }}
              >
                Cédula de Identidad TSE *
              </label>
              <input
                id="campo-cedula"
                name="cedula"
                type="text"
                placeholder="Ej. 601230456 (sin guiones)"
                value={formulario.cedula}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 4, 13, 0.8)',
                  border: errores.cedula ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: 'none'
                }}
              />
              {errores.cedula && (
                <span style={{ fontSize: '0.72rem', color: '#F87171', marginTop: '0.3rem', display: 'block' }}>
                  {errores.cedula}
                </span>
              )}
            </div>

            {/* Nombre Completo */}
            <div>
              <label
                htmlFor="campo-nombre"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '0.45rem'
                }}
              >
                Nombre y Apellidos Completos *
              </label>
              <input
                id="campo-nombre"
                name="nombreCompleto"
                type="text"
                placeholder="Nombre conforme al Registro Civil"
                value={formulario.nombreCompleto}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 4, 13, 0.8)',
                  border: errores.nombreCompleto ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              {errores.nombreCompleto && (
                <span style={{ fontSize: '0.72rem', color: '#F87171', marginTop: '0.3rem', display: 'block' }}>
                  {errores.nombreCompleto}
                </span>
              )}
            </div>

            {/* Correo Electrónico */}
            <div>
              <label
                htmlFor="campo-correo"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '0.45rem'
                }}
              >
                Correo Electrónico Oficial *
              </label>
              <input
                id="campo-correo"
                name="correo"
                type="email"
                placeholder="Para notificación del orden del día"
                value={formulario.correo}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 4, 13, 0.8)',
                  border: errores.correo ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              {errores.correo && (
                <span style={{ fontSize: '0.72rem', color: '#F87171', marginTop: '0.3rem', display: 'block' }}>
                  {errores.correo}
                </span>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="campo-telefono"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '0.45rem'
                }}
              >
                Teléfono de Contacto *
              </label>
              <input
                id="campo-telefono"
                name="telefono"
                type="tel"
                placeholder="Ej. 8888-9999"
                value={formulario.telefono}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 4, 13, 0.8)',
                  border: errores.telefono ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: 'none'
                }}
              />
              {errores.telefono && (
                <span style={{ fontSize: '0.72rem', color: '#F87171', marginTop: '0.3rem', display: 'block' }}>
                  {errores.telefono}
                </span>
              )}
            </div>
          </div>

          {/* Tipo de Solicitud y Distrito */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label
                htmlFor="campo-tipo"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '0.45rem'
                }}
              >
                Instancia Destinataria de la Audiencia
              </label>
              <select
                id="campo-tipo"
                name="tipoSolicitud"
                value={formulario.tipoSolicitud}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 4, 13, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="concejo_pleno">Concejo Municipal en Pleno (Art. 13 inc. d)</option>
                <option value="comision_obras">Comisión Permanente de Obras Públicas</option>
                <option value="peticion_civica">Petición Cívica Comunal (Art. 27 Constitucional)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="campo-distrito"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '0.45rem'
                }}
              >
                Distrito de Residencia / Interés
              </label>
              <input
                id="campo-distrito"
                name="distrito"
                type="text"
                placeholder="Ej. Distrito Central, Jacó, Monteverde..."
                value={formulario.distrito}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 4, 13, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Fundamentación */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label
                htmlFor="campo-fundamentacion"
                style={{
                  fontSize: '0.76rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#CBD5E1'
                }}
              >
                Fundamentación del Interés Comunal o Proyecto *
              </label>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
                {formulario.fundamentacion.length} caracteres (mínimo 30)
              </span>
            </div>
            <textarea
              id="campo-fundamentacion"
              name="fundamentacion"
              rows={5}
              placeholder="Describa puntualmente la temática comunal, problema vial, necesidad de obra o proyecto a presentar ante las autoridades..."
              value={formulario.fundamentacion}
              onChange={handleInputChange}
              style={{
                width: '100%',
                backgroundColor: 'rgba(0, 4, 13, 0.8)',
                border: errores.fundamentacion ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.75rem 0.85rem',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical'
              }}
            />
            {errores.fundamentacion && (
              <span style={{ fontSize: '0.72rem', color: '#F87171', marginTop: '0.3rem', display: 'block' }}>
                {errores.fundamentacion}
              </span>
            )}
          </div>

          {/* Botón de Envío */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '12px',
                backgroundColor: '#1E88E5',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 15px rgba(30, 136, 229, 0.4)',
                transition: 'all 0.2s ease',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              <Send size={16} />
              <span>{isSubmitting ? 'Radicando en Secretaría...' : 'Radicar Solicitud Oficial'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
