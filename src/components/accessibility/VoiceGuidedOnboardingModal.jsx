import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Volume2, RotateCcw, Shield, Map, Siren, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';
import { ONBOARDING_STEPS_MULTILINGUE, IDIOMAS_SOPORTADOS } from './accessibilityData';
import { useTheme } from '../../context/ThemeContext';

function renderStepIcon(stepId, isDark = true) {
  switch (stepId) {
    case 1:
      return <Shield size={32} color={isDark ? "#00D166" : "#05853B"} />;
    case 2:
      return <Map size={32} color={isDark ? "#3B82F6" : "#002B7F"} />;
    case 3:
      return <Siren size={32} color="#EF4444" />;
    default:
      return <Sparkles size={32} color={isDark ? "#79a6ff" : "#002B7F"} />;
  }
}

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
  const { isDark } = useTheme?.() || { isDark: true };

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
        backgroundColor: isDark ? 'rgba(0, 4, 13, 0.88)' : 'rgba(15, 23, 42, 0.65)',
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
          backgroundColor: isDark ? 'rgba(0, 8, 30, 0.98)' : 'var(--cru-surface-card, #FFFFFF)',
          border: isDark ? '1px solid rgba(121, 166, 255, 0.45)' : '1px solid var(--cru-border, #CBD5E1)',
          borderRadius: '24px',
          boxShadow: isDark
            ? '0 25px 70px rgba(0, 4, 13, 0.95), 0 0 40px rgba(0, 43, 127, 0.5)'
            : '0 25px 70px rgba(0, 43, 127, 0.20), 0 4px 16px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: isDark ? '#FFFFFF' : '#0F172A'
        }}
      >
        {/* Barra Superior con Selector Rápido de Idioma y Botón de Salir */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: isDark ? 'rgba(0, 20, 80, 0.4)' : 'var(--cru-surface-muted, #F8FAFC)',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--cru-border, #CBD5E1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={16} color={isDark ? "#79a6ff" : "#002B7F"} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isDark ? '#79a6ff' : '#002B7F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
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
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(121, 166, 255, 0.3)' : '1px solid var(--cru-border, #CBD5E1)',
                borderRadius: '8px',
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '0.3rem 0.5rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {IDIOMAS_SOPORTADOS.map((item) => (
                <option
                  key={item.codigo}
                  value={item.codigo}
                  style={{
                    backgroundColor: isDark ? '#00081E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A'
                  }}
                >
                  [{item.bandera}] {item.nativo}
                </option>
              ))}
            </select>

            {/* Alternador de Género */}
            <button
              type="button"
              onClick={() => setVoiceGender(voiceGender === 'female' ? 'male' : 'female')}
              title={`Cambiar a voz ${voiceGender === 'female' ? 'masculina' : 'femenina'}`}
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--cru-border, #CBD5E1)',
                borderRadius: '8px',
                color: isDark ? '#FFFFFF' : '#0F172A',
                padding: '0.3rem 0.55rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {voiceGender === 'female' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Volume2 size={13} color={isDark ? "#79a6ff" : "#002B7F"} /> Voz Femenina</span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Volume2 size={13} color={isDark ? "#79a6ff" : "#002B7F"} /> Voz Masculina</span>
              )}
            </button>

            <button
              type="button"
              onClick={closeOnboarding}
              aria-label="Cerrar recorrido guiado"
              style={{
                background: 'transparent',
                border: 'none',
                color: isDark ? '#94A3B8' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Indicador de Progreso Visual */}
        <div style={{ display: 'flex', height: '4px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #E2E8F0)' }}>
          {stepsList.map((s, idx) => (
            <div
              key={s.id}
              style={{
                flex: 1,
                backgroundColor: idx <= currentStepIndex ? (isDark ? '#00D166' : '#05853B') : 'transparent',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Cuerpo del Paso Activo */}
        <div style={{ padding: '2rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            {/* Icono Monumental */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(0, 20, 137, 0.35)' : 'var(--cru-accent-sky-bg, #E0F2FE)',
                border: isDark ? '1px solid rgba(121, 166, 255, 0.4)' : '1px solid #BAE6FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDark ? '0 8px 25px rgba(0, 20, 137, 0.5)' : '0 4px 12px rgba(0, 43, 127, 0.12)',
                flexShrink: 0
              }}
            >
              {renderStepIcon(step.id, isDark)}
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: isDark ? '#79a6ff' : '#002B7F', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {step.subtitulo}
              </div>
              <h2
                id="onboarding-step-title"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  margin: '0.2rem 0 0.5rem',
                  letterSpacing: '-0.02em',
                  color: isDark ? '#FFFFFF' : '#0F172A'
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
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--cru-surface-muted, #F8FAFC)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--cru-border, #CBD5E1)',
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
                  backgroundColor: isDark ? 'rgba(0, 43, 127, 0.45)' : 'var(--cru-accent-sky-bg, #E0F2FE)',
                  border: isDark ? '1px solid rgba(121, 166, 255, 0.3)' : '1px solid #BAE6FD',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: isDark ? '#E2E8F0' : '#0369A1'
                }}
              >
                <Check size={12} strokeWidth={2.5} color={isDark ? "#79a6ff" : "#0284C7"} />
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
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'var(--cru-surface-muted, #F1F5F9)',
              borderLeft: isDark ? '4px solid #00D166' : '4px solid #05853B',
              padding: '1rem 1.25rem',
              borderRadius: '0 12px 12px 0',
              borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid var(--cru-border, #CBD5E1)',
              borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid var(--cru-border, #CBD5E1)',
              borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid var(--cru-border, #CBD5E1)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isDark ? '#00D166' : '#05853B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Volume2 size={13} color={isDark ? "#00D166" : "#05853B"} />
                <span>Subtítulo de Locución en Tiempo Real ({activeLangObj.nativo}):</span>
              </span>
              <button
                type="button"
                onClick={handleReplayVoice}
                title="Repetir locución en voz alta"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isDark ? '#79a6ff' : '#002B7F',
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <RotateCcw size={13} />
                <span>Repetir Voz</span>
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: isDark ? '#F1F5F9' : '#0F172A', lineHeight: 1.55, fontWeight: 500 }}>
              {step.narracion}
            </p>
          </div>
        </div>

        {/* Barra de Navegación y Acciones Inferiores */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: isDark ? 'rgba(0, 4, 13, 0.9)' : 'var(--cru-surface-muted, #F8FAFC)',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--cru-border, #CBD5E1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Checkbox No Volver a Mostrar */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B', cursor: 'pointer' }}>
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
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--cru-border, #CBD5E1)',
                borderRadius: '10px',
                padding: '0.55rem 1rem',
                color: isDark ? '#CBD5E1' : '#475569',
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
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--cru-border, #CBD5E1)',
                  borderRadius: '10px',
                  padding: '0.55rem 1.1rem',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} />
                  <span>Anterior</span>
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              style={{
                backgroundColor: currentStepIndex === stepsList.length - 1
                  ? (isDark ? '#00D166' : '#05853B')
                  : (isDark ? '#DA291C' : '#002B7F'),
                border: 'none',
                borderRadius: '10px',
                padding: '0.58rem 1.35rem',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: currentStepIndex === stepsList.length - 1
                  ? (isDark ? '0 4px 15px rgba(0, 209, 102, 0.4)' : '0 4px 15px rgba(5, 133, 59, 0.35)')
                  : (isDark ? '0 4px 15px rgba(218, 41, 28, 0.4)' : '0 4px 15px rgba(0, 43, 127, 0.3)'),
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {currentStepIndex === stepsList.length - 1 ? (
                <span>¡Comenzar Exploración!</span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Siguiente</span>
                  <ArrowRight size={14} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
