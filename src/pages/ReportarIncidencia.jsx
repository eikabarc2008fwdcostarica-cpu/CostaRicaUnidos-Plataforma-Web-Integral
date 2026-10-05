import React, { useState, useEffect } from 'react';
import {
  ClipboardEdit,
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building2,
  Clock,
  Printer,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Camera,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  Step1DamageType,
  Step2PhotoPrivacy,
  Step3Georeferencing,
  Step4Confirmation,
  TicketTraceabilityBoard,
  generarIdTicket,
  guardarTicket,
  getEntidadResponsable,
  TIPOLOGIAS_DANO,
  ESTADOS_TICKET
} from '../components/reports';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../data/costaRicaTerritorialData';

/**
 * ReportarIncidencia — Ventanilla Única de Incidencias Municipales y Obras Públicas
 * Sistema Sovereign Civic Glass v2.1 • Ley N° 8968 de Protección de Datos Personales
 * Stepper Guiado de Alta Seriedad · Georreferenciación Inversa · Trazabilidad Oficial
 */
export default function ReportarIncidencia() {
  const [activeTab, setActiveTab] = useState('stepper'); // 'stepper' | 'tablero'
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3, 4

  // Estado del Asistente en 4 Pasos
  const [selectedType, setSelectedType] = useState('hueco_vial');
  const [photoData, setPhotoData] = useState(null);
  const [consentLaw8968, setConsentLaw8968] = useState(false);
  const [declaracionJurada, setDeclaracionJurada] = useState(false);
  const [coordenadas, setCoordenadas] = useState({ lat: 9.9333, lng: -84.0833 });
  const [provinciaId, setProvinciaId] = useState(1);
  const [cantonId, setCantonId] = useState(1);
  const [distritoId, setDistritoId] = useState(1);
  const [observaciones, setObservaciones] = useState('');

  // Estado de Envío y Expediente Creado
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Cantón activo recuperado de localStorage
  useEffect(() => {
    try {
      const cantonGuardado = localStorage.getItem('cr_canton_activo');
      if (cantonGuardado) {
        const match = CANTONES_OFICIALES.find(
          (c) => c.nombre.toLowerCase() === cantonGuardado.toLowerCase()
        );
        if (match) {
          setProvinciaId(match.provinciaId);
          setCantonId(match.id);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Metadatos territoriales descriptivos
  const provObj = PROVINCIAS_DATA.find((p) => p.id === Number(provinciaId));
  const cantonObj = CANTONES_OFICIALES.find(
    (c) => c.provinciaId === Number(provinciaId) && c.id === Number(cantonId)
  );
  const provinciaNombre = provObj ? provObj.nombre : 'San José';
  const cantonNombre = cantonObj ? cantonObj.nombre : 'Central';
  const distritoNombre = `Distrito ${distritoId || '01'}`;

  // Validación reglamentaria en cada paso del Stepper
  const validateStep = (step) => {
    setValidationError(null);

    if (step === 1) {
      if (!selectedType) {
        setValidationError('Debe seleccionar formalmente la tipología técnica de la avería para continuar.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!photoData) {
        setValidationError('Debe adjuntar la evidencia fotográfica de la avería comunal.');
        return false;
      }
      if (!consentLaw8968) {
        setValidationError('Debe aceptar la cláusula de consentimiento informado conforme a la Ley N° 8968.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!provinciaId || !cantonId) {
        setValidationError('Indique con precisión la provincia, cantón y distrito de la avería.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 160, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  // Radicación Oficial del Expediente Cívico
  const handleSubmitReport = () => {
    if (!observaciones.trim() || observaciones.trim().length < 10) {
      setValidationError('La descripción y puntos de referencia deben tener al menos 10 caracteres explicativos.');
      return;
    }

    if (!declaracionJurada) {
      setValidationError('Debe confirmar la declaración jurada de veracidad de los hechos reportados.');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    const tipologiaObj = TIPOLOGIAS_DANO.find((t) => t.id === selectedType);
    const reportId = generarIdTicket(provinciaId, cantonNombre);
    const fechaActual = new Date().toISOString();
    const entidadResponsable = getEntidadResponsable(selectedType);

    const nuevoTicket = {
      reportId: reportId,
      categoria: selectedType,
      categoriaTitulo: tipologiaObj ? tipologiaObj.titulo : 'Deterioro de Infraestructura',
      categoriaIcono: '',
      provincia: provinciaNombre,
      provinciaId: provinciaId,
      canton: cantonNombre,
      cantonId: cantonId,
      distrito: distritoNombre,
      distritoId: distritoId,
      direccionExacta: observaciones.trim(),
      coordenadas: {
        lat: coordenadas.lat,
        lng: coordenadas.lng
      },
      imagen: {
        url: photoData ? photoData.dataUrl : '',
        pesoOriginal: photoData ? photoData.originalSizeFormatted : '0 KB',
        pesoComprimido: photoData ? photoData.compressedSizeFormatted : '0 KB',
        dimensiones: photoData ? photoData.dimensiones : '1920x1080',
        formato: photoData ? photoData.formato : 'image/webp'
      },
      consentimientoLey8968: true,
      declaracionJurada: true,
      fechaRegistro: fechaActual,
      estado: 'recibido', // recibido (Radicado) -> en_inspeccion -> en_tramite -> solucionado
      entidadResponsable: entidadResponsable,
      diasEstimados: tipologiaObj ? tipologiaObj.plazoEstimado : '3 a 5 días hábiles',
      historial: [
        {
          estado: 'recibido',
          fecha: new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }) + ' CST',
          nota: 'Expediente radicado oficialmente en la Ventanilla Municipal con georreferenciación y evidencia WebP.'
        }
      ]
    };

    setTimeout(() => {
      guardarTicket(nuevoTicket);
      setCreatedTicket(nuevoTicket);
      setIsSubmitting(false);
    }, 600);
  };

  const handleResetForm = () => {
    setCreatedTicket(null);
    setCurrentStep(1);
    setSelectedType('hueco_vial');
    setPhotoData(null);
    setConsentLaw8968(false);
    setDeclaracionJurada(false);
    setObservaciones('');
    setValidationError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-bg, #00040D)',
        color: 'var(--theme-text-primary, #FFFFFF)',
        fontFamily: 'var(--font-body, system-ui, sans-serif)'
      }}
    >
      <Navbar />

      <main
        className="civic-container"
        style={{
          flex: 1,
          padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(0.75rem, 3vw, 2rem) 5rem',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* ==========================================================================
            1. CABECERA INSTITUCIONAL FORMAL
            Ventanilla de Fiscalización Ciudadana y Averías Comunales - Ley N° 8968
            ========================================================================== */}
        <section
          style={{
            backgroundColor: 'rgba(0, 15, 45, 0.72)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: 'clamp(1.25rem, 4vw, 2.5rem)',
            marginBottom: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 4, 13, 0.8), 0 0 35px rgba(0, 20, 137, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Sub-cinta tricolor */}
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
              gap: '1.5rem'
            }}
          >
            <div style={{ maxWidth: '850px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 20, 137, 0.45)',
                    border: '1px solid rgba(121, 166, 255, 0.35)',
                    color: '#79a6ff',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Building2 size={13} />
                  <span>GESTIÓN DE OBRAS PÚBLICAS Y VIALIDAD</span>
                </span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                  CANTON DE {cantonNombre.toUpperCase()} · DTA {cantonObj ? cantonObj.codigoDta : '101'}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)',
                  fontSize: 'clamp(1.85rem, 3.6vw, 2.75rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  margin: '0 0 0.85rem 0'
                }}
              >
                Ventanilla de Fiscalización Ciudadana y Averías Comunales - Ley N° 8968
              </h1>

              <p style={{ fontSize: '0.98rem', color: '#CBD5E1', lineHeight: 1.65, margin: 0 }}>
                Canal soberano para radicar averías viales, fallas de luminarias, fugas de acueducto y botaderos clandestinos con <strong>compresión WebP en cliente</strong>, georreferenciación oficial y trazabilidad pública vinculante ante la Unidad Técnica de Gestión Vial (UTGV) o entidad estatal competente.
              </p>
            </div>

            {/* Selector de Pestaña: Radicación vs Trazabilidad */}
            <div
              style={{
                display: 'inline-flex',
                padding: '0.35rem',
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '14px',
                gap: '0.35rem'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('stepper')}
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === 'stepper' ? '#002B7F' : 'transparent',
                  color: activeTab === 'stepper' ? '#FFFFFF' : '#94A3B8'
                }}
              >
                <ClipboardEdit size={16} />
                <span>Radicar Reporte (4 Pasos)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tablero')}
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === 'tablero' ? '#002B7F' : 'transparent',
                  color: activeTab === 'tablero' ? '#FFFFFF' : '#94A3B8'
                }}
              >
                <BarChart3 size={16} />
                <span>Tablero de Trazabilidad</span>
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. VISTA STEPPER: RADICACIÓN GUIADA EN 4 PASOS
            ========================================================================== */}
        {activeTab === 'stepper' && (
          <div>
            {/* Si el ticket ya fue creado con éxito, mostrar el Comprobante Oficial */}
            {createdTicket ? (
              <div
                style={{
                  backgroundColor: 'rgba(0, 15, 45, 0.72)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '24px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  maxWidth: '780px',
                  margin: '0 auto',
                  boxShadow: '0 25px 70px rgba(0, 4, 13, 0.9)'
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(52, 211, 153, 0.18)',
                    border: '2px solid #34D399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 25px rgba(52, 211, 153, 0.35)'
                  }}
                >
                  <CheckCircle2 size={38} color="#34D399" />
                </div>

                <span
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#34D399',
                    display: 'block',
                    marginBottom: '0.4rem'
                  }}
                >
                  EXPEDIENTE ADMINISTRATIVO RADICADO CON ÉXITO
                </span>

                <h2
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    margin: '0 0 0.75rem 0'
                  }}
                >
                  {createdTicket.reportId}
                </h2>

                <p style={{ color: '#CBD5E1', fontSize: '0.96rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2rem' }}>
                  Su reporte ha sido recibido por la Ventanilla Municipal y asignado a <strong>{createdTicket.entidadResponsable}</strong> para la programación de la inspección técnica de campo.
                </p>

                {/* Ficha Resumen del Comprobante */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 4, 13, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'left',
                    marginBottom: '2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.84rem'
                  }}
                >
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.74rem' }}>Tipología:</span>
                    <strong style={{ color: '#FFFFFF' }}>{createdTicket.categoriaTitulo}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.74rem' }}>Ubicación:</span>
                    <strong style={{ color: '#FFFFFF' }}>{createdTicket.canton}, {createdTicket.distrito}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.74rem' }}>Plazo Legal de Atención:</span>
                    <strong style={{ color: '#38BDF8' }}>{createdTicket.diasEstimados}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.74rem' }}>Evidencia WebP:</span>
                    <strong style={{ color: '#34D399' }}>{createdTicket.imagen.pesoComprimido} (Optimizada)</strong>
                  </div>
                </div>

                {/* Acciones: Imprimir / Descargar Comprobante o Ver en Tablero */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      padding: '0.75rem 1.6rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Printer size={16} />
                    <span>Descargar / Imprimir Comprobante</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('tablero')}
                    style={{
                      backgroundColor: '#002B7F',
                      border: '1px solid rgba(121, 166, 255, 0.5)',
                      color: '#FFFFFF',
                      padding: '0.75rem 1.6rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <BarChart3 size={16} />
                    <span>Ver en Tablero de Trazabilidad</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#94A3B8',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '10px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Nuevo Reporte
                  </button>
                </div>
              </div>
            ) : (
              /* Asistente Guiado de 4 Pasos */
              <div
                style={{
                  backgroundColor: 'rgba(0, 15, 45, 0.65)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '24px',
                  padding: 'clamp(1.25rem, 4vw, 2.5rem)',
                  boxShadow: '0 20px 60px rgba(0, 4, 13, 0.75)'
                }}
              >
                {/* Barra de Progreso del Stepper */}
                <div
                  className="civic-stepper-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
                    gap: '0.75rem',
                    marginBottom: '2.5rem'
                  }}
                >
                  {[
                    { num: 1, label: 'Tipología Técnica' },
                    { num: 2, label: 'Evidencia WebP' },
                    { num: 3, label: 'Georreferenciación' },
                    { num: 4, label: 'Declaración & Radicación' }
                  ].map((p) => {
                    const isActive = currentStep === p.num;
                    const isCompleted = currentStep > p.num;
                    return (
                      <div
                        key={p.num}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem',
                          borderTop: `3px solid ${
                            isCompleted ? '#34D399' : isActive ? '#79a6ff' : 'rgba(255, 255, 255, 0.12)'
                          }`,
                          paddingTop: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              color: isCompleted ? '#34D399' : isActive ? '#79a6ff' : '#64748B'
                            }}
                          >
                            0{p.num}
                          </span>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? '#FFFFFF' : '#94A3B8'
                            }}
                          >
                            {p.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mensaje de Error de Validación */}
                {validationError && (
                  <div
                    role="alert"
                    style={{
                      backgroundColor: 'rgba(218, 41, 28, 0.18)',
                      border: '1px solid rgba(218, 41, 28, 0.45)',
                      borderRadius: '12px',
                      padding: '0.85rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      color: '#FF8C94',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      marginBottom: '1.75rem'
                    }}
                  >
                    <AlertCircle size={18} color="#FF6B6B" style={{ flexShrink: 0 }} />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Contenido del Paso Activo */}
                <div>
                  {currentStep === 1 && (
                    <Step1DamageType
                      selectedType={selectedType}
                      onSelectType={(id) => {
                        setSelectedType(id);
                        setValidationError(null);
                      }}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step2PhotoPrivacy
                      photoData={photoData}
                      onPhotoCaptured={(data) => {
                        setPhotoData(data);
                        setValidationError(null);
                      }}
                      consentLaw8968={consentLaw8968}
                      onConsentChange={(val) => {
                        setConsentLaw8968(val);
                        setValidationError(null);
                      }}
                    />
                  )}

                  {currentStep === 3 && (
                    <Step3Georeferencing
                      coordenadas={coordenadas}
                      onCoordenadasChange={setCoordenadas}
                      provinciaId={provinciaId}
                      onProvinciaChange={(pId) => {
                        setProvinciaId(pId);
                        const primerCanton = CANTONES_OFICIALES.find((c) => c.provinciaId === Number(pId));
                        if (primerCanton) setCantonId(primerCanton.id);
                      }}
                      cantonId={cantonId}
                      onCantonChange={setCantonId}
                      distritoId={distritoId}
                      onDistritoChange={setDistritoId}
                    />
                  )}

                  {currentStep === 4 && (
                    <div>
                      <Step4Confirmation
                        reportData={{
                          selectedType,
                          photoData,
                          coordenadas,
                          provinciaNombre,
                          cantonNombre,
                          distritoNombre,
                          observaciones
                        }}
                        onObservacionesChange={(val) => {
                          setObservaciones(val);
                          setValidationError(null);
                        }}
                        onSubmitReport={handleSubmitReport}
                        isSubmitting={isSubmitting}
                      />

                      {/* Cláusula de Declaración Jurada */}
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 4, 13, 0.65)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '14px',
                          padding: '1.25rem 1.5rem',
                          marginTop: '1.5rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem'
                        }}
                      >
                        <input
                          id="check-declaracion-jurada"
                          type="checkbox"
                          checked={declaracionJurada}
                          onChange={(e) => {
                            setDeclaracionJurada(e.target.checked);
                            setValidationError(null);
                          }}
                          style={{
                            marginTop: '0.25rem',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        <label
                          htmlFor="check-declaracion-jurada"
                          style={{ fontSize: '0.84rem', color: '#E2E8F0', cursor: 'pointer', lineHeight: 1.55 }}
                        >
                          <strong>Declaración Jurada de Veracidad Cívica:</strong> Declaro bajo la fe de juramento que la información y evidencia fotográfica proporcionada corresponden a hechos reales observados en el espacio público del cantón de {cantonNombre}, y autorizo a la Municipalidad y entidades técnicas a utilizar las coordenadas geográficas para la inspección oficial.
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de Navegación del Stepper */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '2.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      color: currentStep === 1 ? '#475569' : '#CBD5E1',
                      padding: '0.65rem 1.4rem',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Paso Anterior</span>
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={{
                        backgroundColor: '#002B7F',
                        backgroundImage: 'linear-gradient(135deg, #002B7F 0%, #001489 100%)',
                        border: '1px solid rgba(121, 166, 255, 0.5)',
                        color: '#FFFFFF',
                        padding: '0.65rem 1.6rem',
                        borderRadius: '10px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 4px 14px rgba(0, 20, 137, 0.5)'
                      }}
                    >
                      <span>Siguiente Paso</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitReport}
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: '#002B7F',
                        backgroundImage: 'linear-gradient(135deg, #002B7F 0%, #001489 100%)',
                        border: '1px solid rgba(121, 166, 255, 0.5)',
                        color: '#FFFFFF',
                        padding: '0.75rem 2rem',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: isSubmitting ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        boxShadow: '0 6px 20px rgba(0, 20, 137, 0.6)'
                      }}
                    >
                      {isSubmitting ? (
                        <span>Radicando Expediente...</span>
                      ) : (
                        <>
                          <FileCheck size={18} />
                          <span>Radicar Expediente Oficial</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================================================
            3. VISTA TABLERO: TRAZABILIDAD OFICIAL EN 4 ETAPAS
            Radicado -> Inspección de Campo -> En Ejecución Presupuestaria -> Subsanado
            ========================================================================== */}
        {activeTab === 'tablero' && (
          <div>
            {/* Barra de Trazabilidad Explicativa */}
            <div
              style={{
                backgroundColor: 'rgba(0, 15, 45, 0.65)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '1.5rem 2rem',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#79a6ff', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  FLUJO OFICIAL DE ATENCIÓN DE OBRAS PÚBLICAS Y AVERÍAS
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Cumplimiento del Código Municipal y Ley de Control Interno
                </span>
              </div>

              {/* Las 4 Etapas Oficiales */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}
              >
                {[
                  { paso: '01', estado: 'Radicado', desc: 'Asignación de expediente EXP-MUNI y georreferenciación.', color: '#3B82F6' },
                  { paso: '02', estado: 'Inspección de Campo', desc: 'Peritaje in situ por la Unidad Técnica de Gestión Vial.', color: '#F59E0B' },
                  { paso: '03', estado: 'En Ejecución Presupuestaria', desc: 'Cuadrilla operativa desplegada con partida SICOP / Ley 8114.', color: '#8B5CF6' },
                  { paso: '04', estado: 'Subsanado', desc: 'Obra concluida satisfactoriamente con acta de fiscalización.', color: '#00D166' }
                ].map((e) => (
                  <div
                    key={e.paso}
                    style={{
                      backgroundColor: 'rgba(0, 4, 13, 0.55)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: e.color }}>ETAPA {e.paso}</span>
                    </div>
                    <strong style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>{e.estado}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.45 }}>{e.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Componente del Tablero de Trazabilidad */}
            <TicketTraceabilityBoard onGoToNewReport={() => setActiveTab('stepper')} />
          </div>
        )}
      </main>
    </div>
  );
}
