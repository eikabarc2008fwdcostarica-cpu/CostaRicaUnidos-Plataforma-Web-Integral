/**
 * COSTA RICA UNIDOS — Asistente de Recorrido Contextual Universal con Gemini 3.6 Flash
 * 
 * Funcionalidad:
 * 1. Se activa en CUALQUIER vista o sección de la aplicación (Home, Noticias, Foro, Mapa GIS, Perfil, Trámites, etc.).
 * 2. Feedback visual inmediato con estado de carga ("Analizando pantalla con Gemini 3.6 Flash...").
 * 3. Escaneo dinámico y universal del DOM activo (scanCurrentPageElements).
 * 4. Llamada resiliente con timeout de 3s a Gemini 3.6 Flash + Fallback local determinista garantizado.
 * 5. Guía por voz (Web Speech API) con marco luminoso (ring-4 ring-cyan-500) y spotlight.
 * 6. Controles accesibles completos: Siguiente, Anterior, Pausar, Repetir Voz y Cerrar (X).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
  X,
  Bot,
  HelpCircle,
  Send,
  Loader2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useVoiceTour } from '../../hooks/useVoiceTour';
import {
  analyzePageAndGenerateTour,
  getEmergencyTour,
  getCachedTour,
  setCachedTour,
  clearCachedTour
} from '../../services/pageAnalyzerService';
import { askGeminiAboutSection } from '../../services/geminiService';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useLanguage } from '../../context/LanguageContext';
import VoiceGuideWidget from './VoiceGuideWidget';

export default function UniversalVoiceGuide() {
  let location;
  try {
    location = useLocation();
  } catch {
    location = { pathname: typeof window !== 'undefined' ? window.location?.pathname || '/' : '/' };
  }

  const currentPath = location?.pathname || '/';

  const { isOnboardingOpen, closeOnboarding } = useAccessibility();
  const { langCode } = useLanguage();

  const {
    isTourActive,
    isAnalyzing,
    setIsAnalyzing,
    tourPath,
    steps,
    currentStepIndex,
    currentStep,
    pageTitle,
    fromAi,
    isSpeaking,
    isPaused,
    liveSubtitle,
    targetRect,
    startTour,
    stopTour,
    nextStep,
    prevStep,
    pauseVoice,
    resumeVoice,
    repeatStep,
    speakCustomText
  } = useVoiceTour();

  const [activeCanton, setActiveCanton] = useState(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  // Estados del drawer de preguntas a Gemini
  const [showAiAsk, setShowAiAsk] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sincronizar cantón activo desde eventos del sistema
  useEffect(() => {
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) setActiveCanton(e.detail.nombre);
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  // Requerimiento 1: Vinculación reactiva estricta a la ruta activa
  // Al cambiar de ruta o desmontar la pantalla, cancela de inmediato cualquier locución en curso y reinicia a cero el estado del tour
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    stopTour();
    if (typeof document !== 'undefined') {
      try {
        document.querySelectorAll('[data-tour-scanned]').forEach((el) => {
          el.removeAttribute('data-tour-scanned');
        });
      } catch {}
    }
  }, [currentPath, stopTour]);

  // Función principal para iniciar el análisis contextual de la pantalla actual
  const handleStartUniversalTour = useCallback(async () => {
    // Requerimiento 1: Desbloqueo inmediato del motor de voz en el gesto de usuario (Click)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const unlockUtterance = new SpeechSynthesisUtterance('');
        unlockUtterance.volume = 0;
        window.speechSynthesis.speak(unlockUtterance);
      } catch (err) {
        console.warn('[Guía Gemini] Desbloqueo preventivo de voz:', err);
      }
    }

    // Feedback visual inmediato
    setIsAnalyzing(true);
    setShowAiAsk(false);
    setAiAnswer('');
    setAiQuestion('');

    const activePath = (typeof window !== 'undefined' && window.location?.pathname) ? window.location.pathname : currentPath;
    console.log('[Guía Gemini] Analizando vista activa en ruta:', activePath);

    // Requerimiento 1: Comprobar caché estricta de ruta (guia_cache_${location.pathname})
    // Si la ruta activa coincide con un guion previamente analizado, reutilizarlo al instante
    const cached = getCachedTour(activePath);
    if (cached && cached.pathname === activePath && Array.isArray(cached.steps) && cached.steps.length > 0) {
      console.log(`[Guía Gemini] Cargando guion desde caché estricta para ruta (${activePath}):`, cached.steps.length, 'pasos.');
      startTour(cached.steps, cached.pageTitle, cached.fromAi, activePath);
      setIsAnalyzing(false);
      return;
    }

    // Si no hay caché para esta ruta, realizar análisis exhaustivo del DOM activo
    try {
      const tourResult = await analyzePageAndGenerateTour(activePath, activeCanton, langCode || 'es-CR');
      if (tourResult && tourResult.steps && tourResult.steps.length > 0) {
        setCachedTour(activePath, tourResult);
        startTour(tourResult.steps, tourResult.pageTitle, tourResult.fromAi, activePath);
      } else {
        console.warn('[Guía Gemini] Sin pasos devueltos, activando guion de respaldo...');
        const emergency = getEmergencyTour(activePath, activeCanton);
        setCachedTour(activePath, emergency);
        startTour(emergency.steps, emergency.pageTitle, false, activePath);
      }
    } catch (err) {
      console.error('[Guía Gemini] Error en análisis contextual (activando emergencia):', err);
      const emergency = getEmergencyTour(activePath, activeCanton);
      setCachedTour(activePath, emergency);
      startTour(emergency.steps, emergency.pageTitle, false, activePath);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentPath, activeCanton, langCode, setIsAnalyzing, startTour]);

  // Si se dispara el evento global o isOnboardingOpen desde la barra de accesibilidad
  useEffect(() => {
    if (isOnboardingOpen && !isTourActive) {
      handleStartUniversalTour();
      closeOnboarding();
    }
  }, [isOnboardingOpen, isTourActive, handleStartUniversalTour, closeOnboarding]);

  useEffect(() => {
    const handleVoiceTourEvent = () => {
      if (!isTourActive) {
        handleStartUniversalTour();
      }
    };
    window.addEventListener('startUniversalVoiceTour', handleVoiceTourEvent);
    return () => window.removeEventListener('startUniversalVoiceTour', handleVoiceTourEvent);
  }, [isTourActive, handleStartUniversalTour]);

  // Manejo de atajos de teclado accesibles (Escape, Flechas, Barra Espaciadora)
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopTour();
      } else if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (isPaused) resumeVoice();
        else pauseVoice();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, stopTour, nextStep, prevStep, isPaused, resumeVoice, pauseVoice]);

  // Enviar consulta interactiva a Gemini sobre la sección enfocada
  const handleAskGemini = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim() || !currentStep) return;

    setIsAiLoading(true);
    setAiAnswer('');

    try {
      const response = await askGeminiAboutSection({
        question: aiQuestion.trim(),
        step: {
          id: currentStep.targetSelector || currentStep.selector,
          title: currentStep.title || currentStep.titulo,
          resumen: currentStep.speechText || currentStep.locucion
        },
        lang: langCode || 'es-CR',
        canton: activeCanton
      });

      if (response && response.text) {
        setAiAnswer(response.text);
        speakCustomText(response.text);
      } else {
        setAiAnswer('No pudimos procesar la consulta en este instante. Intente nuevamente.');
      }
    } catch (err) {
      console.warn('[Guía Gemini AI Error]', err);
      setAiAnswer('Ocurrió un error al contactar el asistente inteligente.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <>
      {/* =====================================================================
          1. BOTÓN FLOTANTE UNIVERSAL DE GUÍA POR VOZ (HUD COMPACTO)
          Visible en cualquier ruta cuando el tour no está activo
          ===================================================================== */}
      {!isTourActive && (
        <VoiceGuideWidget
          selectedCanton={activeCanton}
          isAnalyzing={isAnalyzing}
          handleStartTour={handleStartUniversalTour}
        />
      )}

      {/* =====================================================================
          2. CAPA SPOTLIGHT (MÁSCARA OSCURA CON RECORTE Y AURA LUMINOSA)
          Enfoca el componente activo sin bloquear su visibilidad
          ===================================================================== */}
      {isTourActive && targetRect && (
        <div
          role="presentation"
          style={{
            position: 'fixed',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: '16px',
            border: '2px solid #38BDF8',
            boxShadow: '0 0 0 9999px rgba(0, 4, 13, 0.82), 0 0 35px rgba(56, 189, 248, 0.65)',
            pointerEvents: 'none',
            zIndex: 9998,
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Indicador animado de foco cívico */}
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              left: '14px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.15rem 0.6rem',
              borderRadius: '9999px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Compass size={11} />
            <span>EN FOCO CÍVICO</span>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. PÍLDORA HUD FLOTANTE DE CONTROL DEL RECORRIDO
          ===================================================================== */}
      {isTourActive && currentStep && (
        <aside
          role="region"
          aria-label="Panel de Control del Recorrido Guiado"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(720px, 94vw)',
            backgroundColor: 'rgba(7, 13, 27, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 4, 13, 0.95), 0 0 30px rgba(0, 43, 127, 0.45)',
            zIndex: 9999,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Barra Superior del HUD */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8'
                }}
              >
                <Sparkles size={15} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F1F5F9' }}>
                    {pageTitle || 'Recorrido Asistido'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: fromAi ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      color: fromAi ? '#34D399' : '#38BDF8',
                      border: `1px solid ${fromAi ? 'rgba(52, 211, 153, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`
                    }}
                  >
                    {fromAi ? '✦ Gemini 3.6 Flash' : '✦ Guía GovTech'}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={11} className="text-sky-400" />
                  <span>Cantón: <strong>{activeCanton}</strong></span>
                  <span>&bull;</span>
                  <span>Paso {currentStepIndex + 1} de {steps.length}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {/* Botón Consultar a la IA */}
              <button
                type="button"
                onClick={() => setShowAiAsk(!showAiAsk)}
                title="Hacer una pregunta a Gemini sobre esta sección"
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: showAiAsk ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: showAiAsk ? '#38BDF8' : '#E2E8F0',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Bot size={14} />
                <span className="hidden sm:inline">Preguntar a IA</span>
              </button>

              {/* Botón Salir / Cerrar (X) */}
              <button
                type="button"
                onClick={stopTour}
                title="Cerrar recorrido (Escape)"
                aria-label="Cerrar recorrido"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Subtítulo Dinámico y Contenido del Paso */}
          <div style={{ padding: '1rem 1.25rem' }}>
            {!targetRect && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginBottom: '0.45rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
              >
                <Compass size={11} />
                <span>Vista General de la Pantalla</span>
              </div>
            )}

            <div style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {currentStep.title || currentStep.titulo}
              </h3>
              {isSpeaking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Voz en reproducción">
                  <span className="w-1 h-3 bg-sky-400 rounded animate-pulse" />
                  <span className="w-1 h-4 bg-sky-400 rounded animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-sky-400 rounded animate-pulse delay-150" />
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#CBD5E1', margin: 0 }}>
              {liveSubtitle || currentStep.speechText || currentStep.locucion}
            </p>

            {currentStep.tips && (
              <div
                style={{
                  marginTop: '0.65rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  borderLeft: '3px solid #38BDF8',
                  fontSize: '0.75rem',
                  color: '#94A3B8'
                }}
              >
                <strong>Tip cívico:</strong> {currentStep.tips}
              </div>
            )}
          </div>

          {/* Cajón Desplegable para Preguntar a Gemini */}
          {showAiAsk && (
            <div
              style={{
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(0, 8, 24, 0.85)',
                borderTop: '1px solid rgba(56, 189, 248, 0.2)'
              }}
            >
              <form onSubmit={handleAskGemini} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder={`Pregunta a Gemini sobre ${currentStep.title || currentStep.titulo}...`}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.85rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiQuestion.trim()}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: '#0284C7',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: isAiLoading ? 'wait' : 'pointer'
                  }}
                >
                  {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>Consultar</span>
                </button>
              </form>

              {aiAnswer && (
                <div
                  style={{
                    marginTop: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    fontSize: '0.8rem',
                    color: '#E2E8F0',
                    lineHeight: 1.45
                  }}
                >
                  <strong style={{ color: '#38BDF8' }}>Respuesta de Gemini: </strong>
                  {aiAnswer}
                </div>
              )}
            </div>
          )}

          {/* Barra Inferior de Navegación del HUD */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Controles de Audio: Pausar / Reanudar y Repetir Voz */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={isPaused ? resumeVoice : pauseVoice}
                title={isPaused ? 'Reanudar locución' : 'Pausar locución'}
                aria-label={isPaused ? 'Reanudar locución' : 'Pausar locución'}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {isPaused ? <Play size={13} /> : <Pause size={13} />}
                <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
              </button>

              <button
                type="button"
                onClick={repeatStep}
                title="Repetir explicación por voz"
                aria-label="Repetir explicación por voz"
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#CBD5E1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <RotateCcw size={13} />
                <span>Repetir Voz</span>
              </button>
            </div>

            {/* Paginación de Pasos: Anterior y Siguiente */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                aria-label="Paso Anterior"
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: currentStepIndex === 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: currentStepIndex === 0 ? '#64748B' : '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <ArrowLeft size={14} />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                onClick={nextStep}
                aria-label={currentStepIndex === steps.length - 1 ? 'Finalizar Recorrido' : 'Siguiente Paso'}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: '10px',
                  backgroundColor: '#0284C7',
                  border: '1px solid #38BDF8',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)'
                }}
              >
                <span>{currentStepIndex === steps.length - 1 ? 'Finalizar Recorrido' : 'Siguiente'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
