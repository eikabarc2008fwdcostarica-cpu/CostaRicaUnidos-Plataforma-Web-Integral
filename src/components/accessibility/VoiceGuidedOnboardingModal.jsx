import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityContext';
import { ONBOARDING_STEPS_MULTILINGUE, IDIOMAS_SOPORTADOS } from './accessibilityData';

/**
 * Onboarding Interactivo Animado Asistido por Voz (3 Pasos)
 * Soporta narración automática por voz en los 8 idiomas oficiales, subtítulos y memoria en localStorage.
 */
export default function VoiceGuidedOnboardingModal() {
  const {
    isOnboardingOpen,
    closeOnboarding,
    completeOnboarding,
    selectedLang,
    setSelectedLang,
    voiceGender,
    setVoiceGender,
    speakText,
    stopSpeaking,
    isSpeaking
  } = useAccessibility();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [doNotShowAgain, setDoNotShowAgain] = useState(true);
  const modalRef = useRef(null);

  const stepsList = ONBOARDING_STEPS_MULTILINGUE[selectedLang] || ONBOARDING_STEPS_MULTILINGUE['es-419'];
  const step = stepsList[currentStepIndex] || stepsList[0];
  const activeLangObj = IDIOMAS_SOPORTADOS.find((i) => i.codigo === selectedLang) || IDIOMAS_SOPORTADOS[0];

  // Auto-narrar al abrir el onboarding o al cambiar de paso
  useEffect(() => {
    if (isOnboardingOpen && step) {
      // Breve retardo para dar tiempo a la animación de apertura del modal
      const timer = setTimeout(() => {
        speakText(step.narracion);
      }, 350);

      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [isOnboardingOpen, currentStepIndex, selectedLang, voiceGender]);

  // Manejo de teclado (Escape para salir, flechas para navegar)
  useEffect(() => {
    if (!isOnboardingOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeOnboarding();
      } else if (e.key === 'ArrowRight' && currentStepIndex < stepsList.length - 1) {
        e.preventDefault();
        setCurrentStepIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        e.preventDefault();
        setCurrentStepIndex((prev) => prev - 1);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOnboardingOpen, currentStepIndex, stepsList.length, closeOnboarding]);

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < stepsList.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeOnboarding(doNotShowAgain);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReplayVoice = () => {
    if (step) {
      speakText(step.narracion);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-step-title"
      aria-describedby="onboarding-step-desc"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 4, 13, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: 'rgba(0, 8, 30, 0.98)',
          border: '1px solid rgba(121, 166, 255, 0.45)',
          borderRadius: '24px',
          boxShadow: '0 25px 70px rgba(0, 4, 13, 0.95), 0 0 40px rgba(0, 43, 127, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#FFFFFF'
        }}
      >
        {/* Barra Superior con Selector Rápido de Idioma y Botón de Salir */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'rgba(0, 20, 80, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#79a6ff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Recorrido Asistido por Voz (Paso {currentStepIndex + 1} de {stepsList.length})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Selector de Idioma en Modal */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              aria-label="Seleccionar idioma de narración"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(121, 166, 255, 0.3)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '0.3rem 0.5rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {IDIOMAS_SOPORTADOS.map((item) => (
                <option key={item.codigo} value={item.codigo} style={{ backgroundColor: '#00081E', color: '#FFFFFF' }}>
                  {item.bandera} {item.nativo}
                </option>
              ))}
            </select>

            {/* Alternador de Género */}
            <button
              type="button"
              onClick={() => setVoiceGender(voiceGender === 'female' ? 'male' : 'female')}
              title={`Cambiar a voz ${voiceGender === 'female' ? 'masculina' : 'femenina'}`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0.3rem 0.55rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {voiceGender === 'female' ? '👩 Voz Mujer' : '👨 Voz Hombre'}
            </button>

            <button
              type="button"
              onClick={closeOnboarding}
              aria-label="Cerrar recorrido guiado"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0.2rem'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Indicador de Progreso Visual */}
        <div style={{ display: 'flex', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
          {stepsList.map((s, idx) => (
            <div
              key={s.id}
              style={{
                flex: 1,
                backgroundColor: idx <= currentStepIndex ? '#00D166' : 'transparent',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Cuerpo del Paso Activo */}
        <div style={{ padding: '2rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            {/* Icono Monumental Tricolor */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: 'rgba(0, 20, 137, 0.35)',
                border: '1px solid rgba(121, 166, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 8px 25px rgba(0, 20, 137, 0.5)',
                flexShrink: 0
              }}
            >
              {step.icono}
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#79a6ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {step.subtitulo}
              </div>
              <h2
                id="onboarding-step-title"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  margin: '0.2rem 0 0.5rem',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF'
                }}
              >
                {step.titulo}
              </h2>
            </div>
          </div>

          {/* Destacados del Módulo */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0.85rem 1rem'
            }}
          >
            {step.destacados.map((item, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(0, 43, 127, 0.45)',
                  border: '1px solid rgba(121, 166, 255, 0.3)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#E2E8F0'
                }}
              >
                <span>✓</span>
                <span>{item}</span>
              </span>
            ))}
          </div>

          {/* Subtítulo Sincronizado en la parte inferior del contenido */}
          <div
            id="onboarding-step-desc"
            role="status"
            aria-live="polite"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              borderLeft: '4px solid #00D166',
              padding: '1rem 1.25rem',
              borderRadius: '0 12px 12px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              borderRight: '1px solid rgba(255, 255, 255, 0.06)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00D166', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🔊 Subtítulo de Locución en Tiempo Real ({activeLangObj.nativo}):
              </span>
              <button
                type="button"
                onClick={handleReplayVoice}
                title="Repetir locución en voz alta"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#79a6ff',
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>🔁</span>
                <span>Repetir Voz</span>
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#F1F5F9', lineHeight: 1.55, fontWeight: 500 }}>
              {step.narracion}
            </p>
          </div>
        </div>

        {/* Barra de Navegación y Acciones Inferiores */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'rgba(0, 4, 13, 0.9)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Checkbox No Volver a Mostrar */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#94A3B8', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={doNotShowAgain}
              onChange={(e) => setDoNotShowAgain(e.target.checked)}
              style={{ accentColor: '#DA291C', cursor: 'pointer' }}
            />
            <span>Recordar preferencia en este navegador</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={closeOnboarding}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '0.55rem 1rem',
                color: '#CBD5E1',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Omitir
            </button>

            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.55rem 1.1rem',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ← Anterior
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              style={{
                backgroundColor: currentStepIndex === stepsList.length - 1 ? '#00D166' : '#DA291C',
                border: 'none',
                borderRadius: '10px',
                padding: '0.58rem 1.35rem',
                color: currentStepIndex === stepsList.length - 1 ? '#00040D' : '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: currentStepIndex === stepsList.length - 1
                  ? '0 4px 15px rgba(0, 209, 102, 0.4)'
                  : '0 4px 15px rgba(218, 41, 28, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{currentStepIndex === stepsList.length - 1 ? '¡Comenzar Exploración!' : 'Siguiente →'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
