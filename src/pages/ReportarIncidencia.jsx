import React, { useState } from 'react';
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
  TIPOLOGIAS_DANO
} from '../components/reports';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../data/costaRicaTerritorialData';

export default function ReportarIncidencia() {
  const [activeTab, setActiveTab] = useState('stepper'); // 'stepper' | 'tablero'
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3, 4

  // Estado del Asistente en 4 Pasos
  const [selectedType, setSelectedType] = useState('hueco_vial');
  const [photoData, setPhotoData] = useState(null);
  const [consentLaw8968, setConsentLaw8968] = useState(false);
  const [coordenadas, setCoordenadas] = useState({ lat: 9.9333, lng: -84.0833 });
  const [provinciaId, setProvinciaId] = useState(1);
  const [cantonId, setCantonId] = useState(1);
  const [distritoId, setDistritoId] = useState(1);
  const [observaciones, setObservaciones] = useState('');

  // Estado de Envío y Ticket Exitoso
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Obtener nombres para resumen
  const provObj = PROVINCIAS_DATA.find((p) => p.id === Number(provinciaId));
  const cantonObj = CANTONES_OFICIALES.find((c) => c.provinciaId === Number(provinciaId) && c.id === Number(cantonId));
  const provinciaNombre = provObj ? provObj.nombre : 'San José';
  const cantonNombre = cantonObj ? cantonObj.nombre : 'Central';
  const distritoNombre = `Distrito ${distritoId || '01'}`;

  // Validación síncrona en cada paso del Stepper
  const validateStep = (step) => {
    setValidationError(null);

    if (step === 1) {
      if (!selectedType) {
        setValidationError('Por favor seleccione una tipología de daño antes de continuar.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!photoData) {
        setValidationError('Debe adjuntar una evidencia fotográfica de la avería.');
        return false;
      }
      if (!consentLaw8968) {
        setValidationError('Debe marcar la declaración de consentimiento informado según la Ley N° 8968.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!provinciaId || !cantonId) {
        setValidationError('Verifique la provincia y cantón de la incidencia.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // 2. Generación y Contrato del Ticket (Estructura JSON Oficial)
  const handleSubmitReport = () => {
    if (!observaciones.trim() || observaciones.trim().length < 10) {
      setValidationError('Ingrese una descripción y puntos de referencia de al menos 10 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    const tipologiaObj = TIPOLOGIAS_DANO.find((t) => t.id === selectedType);
    const reportId = generarIdTicket(provinciaId, cantonNombre);
    const fechaActual = new Date().toISOString();
    const entidadResponsable = getEntidadResponsable(selectedType);

    // Contrato estandarizado del Ticket
    const nuevoTicket = {
      reportId: reportId,
      categoria: selectedType,
      categoriaTitulo: tipologiaObj ? tipologiaObj.titulo : 'Incidencia Vial',
      categoriaIcono: tipologiaObj ? tipologiaObj.icono : '⚠️',
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
      fechaRegistro: fechaActual,
      estado: 'recibido', // recibido -> en_inspeccion -> en_tramite -> solucionado
      entidadResponsable: entidadResponsable,
      diasEstimados: tipologiaObj ? tipologiaObj.plazoEstimado : '3 a 5 días hábiles',
      historial: [
        {
          estado: 'recibido',
          fecha: new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }) + ' CST',
          nota: 'Reporte ingresado por el ciudadano con georreferenciación GPS y fotografía WebP verificada.'
        }
      ]
    };

    // Guardado local sin dependencias externas
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
    setObservaciones('');
    setValidationError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#00040D' }}>
      <Navbar />

      <main className="civic-container" style={{ flex: 1, padding: '2.5rem 1.5rem 5rem' }}>
        {/* Telemetría cívica superior */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 20, 80, 0.5)' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00D166',
              boxShadow: '0 0 10px #00D166',
              display: 'inline-block'
            }} />
            MÓDULO 07 &bull; SISTEMA DE REPORTES CIUDADANOS E INCIDENCIAS VIALES &bull; LEY N° 8968
          </span>
        </div>

        {/* Encabezado del Módulo */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: '1rem',
            background: 'linear-gradient(180deg, #FFFFFF 30%, #FF8C94 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Fiscalización y Reporte de Incidencias Públicas
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: '#CBD5E1',
            lineHeight: 1.65,
            marginBottom: '2rem'
          }}>
            Canal soberano para reportar baches viales, luminarias apagadas, fugas de agua y botaderos clandestinos
            con <strong>compresión WebP en cliente</strong>, georreferenciación DTA y trazabilidad pública en los 84 cantones.
          </p>

          {/* Selector de Pestaña Principal: Asistente vs Tablero */}
          <div style={{
            display: 'inline-flex',
            padding: '0.4rem',
            backgroundColor: 'rgba(0, 10, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 4, 13, 0.6)'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('stepper')}
              className={activeTab === 'stepper' ? 'btn-sovereign' : 'btn-glass-secondary'}
              style={{
                padding: '0.65rem 1.6rem',
                fontSize: '0.9rem',
                border: 'none',
                borderRadius: '12px'
              }}
            >
              📝 Asistente de Reporte (4 Pasos)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tablero')}
              className={activeTab === 'tablero' ? 'btn-sovereign-blue' : 'btn-glass-secondary'}
              style={{
                padding: '0.65rem 1.6rem',
                fontSize: '0.9rem',
                border: 'none',
                borderRadius: '12px'
              }}
            >
              📊 Tablero de Trazabilidad de Tickets
            </button>
          </div>
        </div>

        {/* Modal de Éxito al Generar Ticket */}
        {createdTicket && (
          <div
            role="dialog"
            aria-modal="true"
            className="civic-glass-card"
            style={{
              padding: '2.5rem 2rem',
              maxWidth: '680px',
              margin: '0 auto 3rem',
              textAlign: 'center',
              borderRadius: '24px',
              border: '2px solid #00D166',
              boxShadow: '0 0 50px rgba(0, 209, 102, 0.35)',
              backgroundColor: 'rgba(0, 15, 30, 0.95)'
            }}
          >
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 209, 102, 0.2)',
              border: '2px solid #00D166',
              color: '#00D166',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 25px rgba(0, 209, 102, 0.5)'
            }}>
              ✓
            </div>

            <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 209, 102, 0.2)', color: '#00D166', borderColor: '#00D166' }}>
              REPORTE REGISTRADO CON ÉXITO
            </span>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              Ticket Soberano Generado
            </h3>

            <div style={{
              backgroundColor: 'rgba(0, 4, 13, 0.85)',
              padding: '1.25rem',
              borderRadius: '14px',
              border: '1px solid rgba(121, 166, 255, 0.3)',
              margin: '1.5rem auto',
              maxWidth: '480px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                Código Único Estandarizado
              </div>
              <div style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#79a6ff',
                letterSpacing: '0.04em',
                marginTop: '0.2rem'
              }}>
                {createdTicket.reportId}
              </div>
            </div>

            <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Su incidencia ha sido remitida a <strong>{createdTicket.entidadResponsable}</strong> para la programación de la inspección técnica en el cantón de <strong>{createdTicket.canton}</strong>.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('tablero');
                  setCreatedTicket(null);
                }}
                className="btn-sovereign-blue"
                style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}
              >
                📊 Rastrear en Tablero de Trazabilidad
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="btn-glass-secondary"
                style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem' }}
              >
                + Registrar Otra Avería
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 1: Asistente Guiado en 4 Pasos (Stepper) */}
        {activeTab === 'stepper' && !createdTicket && (
          <div>
            {/* Barra de Progreso del Stepper (1 a 4) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              maxWidth: '740px',
              margin: '0 auto 3rem'
            }}>
              {/* Línea conectora */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '30px',
                  right: '30px',
                  height: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  zIndex: 1
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '30px',
                  width: `${((currentStep - 1) / 3) * 100}%`,
                  height: '3px',
                  backgroundColor: '#DA291C',
                  boxShadow: '0 0 10px #DA291C',
                  zIndex: 2,
                  transition: 'width 0.4s ease'
                }}
              />

              {[
                { step: 1, label: 'Tipología' },
                { step: 2, label: 'Evidencia & Ley 8968' },
                { step: 3, label: 'Georreferenciación' },
                { step: 4, label: 'Confirmación' }
              ].map((s) => {
                const isPassed = s.step < currentStep;
                const isCurrent = s.step === currentStep;

                return (
                  <div
                    key={s.step}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 3
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: isPassed
                          ? '#00D166'
                          : isCurrent
                            ? '#DA291C'
                            : 'rgba(0, 10, 30, 0.95)',
                        border: `2px solid ${isCurrent ? '#FFFFFF' : isPassed ? '#00D166' : 'rgba(255, 255, 255, 0.2)'}`,
                        boxShadow: isCurrent ? '0 0 16px rgba(218, 41, 28, 0.8)' : 'none',
                        color: isPassed || isCurrent ? '#FFFFFF' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isPassed ? '✓' : s.step}
                    </div>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? '#FFFFFF' : '#94A3B8',
                      marginTop: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mensaje de Validación Síncrona si ocurre error */}
            {validationError && (
              <div style={{
                maxWidth: '640px',
                margin: '0 auto 1.5rem',
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(218, 41, 28, 0.18)',
                border: '1px solid #DA291C',
                borderRadius: '12px',
                color: '#FF6B6B',
                fontSize: '0.9rem',
                textAlign: 'center',
                animation: 'shake 0.3s ease'
              }}>
                ⚠️ {validationError}
              </div>
            )}

            {/* Contenedor del Paso Activo */}
            <div className="civic-glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', borderRadius: '24px', marginBottom: '2.5rem' }}>
              {currentStep === 1 && (
                <Step1DamageType
                  selectedType={selectedType}
                  onSelectType={(type) => {
                    setSelectedType(type);
                    setValidationError(null);
                  }}
                />
              )}

              {currentStep === 2 && (
                <Step2PhotoPrivacy
                  photoData={photoData}
                  onPhotoProcessed={(data) => {
                    setPhotoData(data);
                    setValidationError(null);
                  }}
                  onClearPhoto={() => setPhotoData(null)}
                  consentLaw8968={consentLaw8968}
                  onToggleConsent={() => {
                    setConsentLaw8968(!consentLaw8968);
                    setValidationError(null);
                  }}
                />
              )}

              {currentStep === 3 && (
                <Step3Georeferencing
                  coordenadas={coordenadas}
                  onCoordenadasChange={setCoordenadas}
                  provinciaId={provinciaId}
                  onProvinciaChange={setProvinciaId}
                  cantonId={cantonId}
                  onCantonChange={setCantonId}
                  distritoId={distritoId}
                  onDistritoChange={setDistritoId}
                />
              )}

              {currentStep === 4 && (
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
                  onObservacionesChange={(text) => {
                    setObservaciones(text);
                    setValidationError(null);
                  }}
                  onSubmitReport={handleSubmitReport}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {/* Botonería de Navegación del Stepper */}
            {currentStep < 4 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '740px', margin: '0 auto' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="btn-glass-secondary"
                  style={{
                    padding: '0.8rem 1.6rem',
                    opacity: currentStep === 1 ? 0.3 : 1,
                    cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Paso Anterior
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-sovereign"
                  style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}
                >
                  Continuar al Paso {currentStep + 1} →
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn-glass-secondary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}
                >
                  ← Volver a Modificar Ubicación o Datos
                </button>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: Tablero Público de Trazabilidad */}
        {activeTab === 'tablero' && (
          <TicketTraceabilityBoard
            onGoToNewReport={() => {
              setActiveTab('stepper');
              handleResetForm();
            }}
          />
        )}
      </main>

      {/* Footer cívico */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '2rem 0',
        backgroundColor: 'rgba(0, 4, 13, 0.9)',
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: '0.85rem'
      }}>
        <div className="civic-container">
          <p style={{ marginBottom: '0.4rem', color: '#E2E8F0', fontWeight: 600 }}>
            República de Costa Rica &bull; Costa Rica Unidos &bull; Módulo 07 Reportes Ciudadanos
          </p>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Protección de Datos Ley N° 8968 &bull; Compresión WebP &lt; 1 MB &bull; Trazabilidad Estandarizada en 84 Cantones
          </p>
        </div>
      </footer>
    </div>
  );
}
