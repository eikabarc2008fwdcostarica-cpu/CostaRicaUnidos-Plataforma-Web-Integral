import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
  Send,
  Bot,
  HelpCircle,
  CheckCircle2,
  MapPin,
  Eye
} from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  getTourStepsForLanguage,
  askGeminiAboutSection,
  getGeminiApiKey,
  setGeminiApiKey
} from '../../services/geminiService';

/**
 * RECORRIDO INTERACTIVO GUIADO EN VIVO CON SPOTLIGHT (GovTech AI Spotlight Tour)
 * Cumple con RNF-05 (Accesibilidad Universal), Ley 7600, WCAG 2.1 AAA y Gemini 3.6 Flash.
 *
 * Características:
 * 1. Marco luminoso y oscurecimiento dinámico sobre componentes reales sin modales bloqueantes.
 * 2. Desplazamiento suave (scrollIntoView smooth) hacia el elemento en foco.
 * 3. Narración por voz fluida (Web Speech API) en 8 idiomas sin fugas ni solapamientos de audio.
 * 4. Píldora HUD de control flotante no intrusiva con subtítulos en tiempo real.
 * 5. Módulo interactivo "Preguntar a la IA sobre esta sección" potenciado por Gemini 3.6 Flash.
 */
export default function SpotlightGuidedTour() {
  const {
    isOnboardingOpen,
    closeOnboarding,
    completeOnboarding,
    selectedLang,
    voiceGender
  } = useAccessibility();

  const { langCode, t } = useLanguage();
  const { isDark } = useTheme?.() || { isDark: true };

  // El idioma de la narración se sincroniza con el idioma activo de la plataforma
  const activeLanguage = langCode || selectedLang || 'es-CR';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [isSpeakingLive, setIsSpeakingLive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [liveSubtitle, setLiveSubtitle] = useState('');
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeCanton, setActiveCanton] = useState('San José');

  const utteranceRef = useRef(null);
  const timerRef = useRef(null);
  const aiInputRef = useRef(null);

  // Pasos del recorrido según el idioma activo
  const stepsList = getTourStepsForLanguage(activeLanguage);
  const step = stepsList[currentStepIndex] || stepsList[0];

  // Leer cantón activo
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cr_canton_activo');
      if (saved) setActiveCanton(saved);
    } catch {
      // ignore
    }

    const handleCanton = (e) => {
      if (e.detail?.nombre) setActiveCanton(e.detail.nombre);
    };
    window.addEventListener('cantonChanged', handleCanton);
    return () => window.removeEventListener('cantonChanged', handleCanton);
  }, []);

  // Función para cancelar cualquier audio en curso
  const stopVoiceImmediately = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingLive(false);
    setIsPaused(false);
    setLiveSubtitle('');
  }, []);

  // Función principal de locución con Web Speech API optimizada para entonación natural
  const narrateText = useCallback(
    (textToSpeak, onFinish = null) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (!textToSpeak || !textToSpeak.trim()) return;

      // Cancelar cualquier locución anterior inmediatamente para evitar solapamientos
      window.speechSynthesis.cancel();
      setIsPaused(false);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = activeLanguage === 'es-ES' ? 'es-ES' : activeLanguage === 'en-US' || activeLanguage === 'en' ? 'en-US' : activeLanguage === 'zh-CN' || activeLanguage === 'zh' ? 'zh-CN' : activeLanguage === 'pt-BR' || activeLanguage === 'pt' ? 'pt-BR' : activeLanguage === 'fr-FR' || activeLanguage === 'fr' ? 'fr-FR' : activeLanguage === 'ru-RU' || activeLanguage === 'ru' ? 'ru-RU' : activeLanguage === 'ja-JP' || activeLanguage === 'ja' ? 'ja-JP' : 'es-CR';
      utterance.rate = 0.96;
      utterance.pitch = voiceGender === 'female' ? 1.05 : 0.88;

      // Localizar voz nativa si está disponible en el navegador
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = utterance.lang.split('-')[0].toLowerCase();
        const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
        if (matching.length > 0) {
          const preferred =
            voiceGender === 'female'
              ? matching.find((v) =>
                  v.name.toLowerCase().includes('female') ||
                  v.name.toLowerCase().includes('mujer') ||
                  v.name.toLowerCase().includes('monica') ||
                  v.name.toLowerCase().includes('paulina') ||
                  v.name.toLowerCase().includes('sabina') ||
                  v.name.toLowerCase().includes('zira')
                )
              : matching.find((v) =>
                  v.name.toLowerCase().includes('male') ||
                  v.name.toLowerCase().includes('hombre') ||
                  v.name.toLowerCase().includes('jorge') ||
                  v.name.toLowerCase().includes('david') ||
                  v.name.toLowerCase().includes('pablo')
                );
          utterance.voice = preferred || matching[0];
        }
      }

      utterance.onstart = () => {
        setIsSpeakingLive(true);
        setLiveSubtitle(textToSpeak);
      };

      utterance.onend = () => {
        setIsSpeakingLive(false);
        if (onFinish) onFinish();
      };

      utterance.onerror = (err) => {
        console.warn('[SpotlightTour TTS Error]', err);
        setIsSpeakingLive(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [activeLanguage, voiceGender]
  );

  // Pausar / Reanudar la voz
  const handleTogglePause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeakingLive && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      // Si ya terminó de hablar, reanudar vuelve a hablar el paso actual
      if (step) narrateText(step.narracion);
    }
  };

  // Repetir locución del paso actual
  const handleReplayVoice = () => {
    if (step) {
      narrateText(step.narracion);
    }
  };

  // Localizar y encuadrar el elemento en el DOM
  const updateTargetPosition = useCallback(() => {
    if (!step) return;

    // Selector principal con selectores de respaldo
    let el = document.querySelector(step.selector);
    if (!el && step.id === 'nav-institucional') {
      el = document.querySelector('header nav') || document.querySelector('header');
    } else if (!el && step.id === 'ejes-municipales') {
      el = document.getElementById('ejes-municipales-section') || document.querySelector('section:has(.glass-card)');
    } else if (!el && step.id === 'buscador-civico') {
      el = document.querySelector('form input[type="text"]')?.closest('div') || document.querySelector('form');
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: Math.max(0, rect.top),
        left: Math.max(0, rect.left),
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right
      });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Manejo de foco, scroll suave y narración automática al cambiar de paso
  useEffect(() => {
    if (!isOnboardingOpen || !step) {
      stopVoiceImmediately();
      return;
    }

    // Cerrar el drawer de IA al cambiar de paso
    setShowAiDrawer(false);
    setAiResponse('');
    setAiQuestion('');

    // Cancelar cualquier timer pendiente
    if (timerRef.current) clearTimeout(timerRef.current);

    // 1. Encontrar el elemento y hacer scroll suave
    let el = document.querySelector(step.selector);
    if (!el && step.id === 'nav-institucional') {
      el = document.querySelector('header nav') || document.querySelector('header');
    } else if (!el && step.id === 'ejes-municipales') {
      el = document.getElementById('ejes-municipales-section');
    } else if (!el && step.id === 'buscador-civico') {
      el = document.querySelector('form input[type="text"]')?.closest('div');
    }

    if (el) {
      try {
        // En móviles y desktop, el scrollIntoView centrado da la mejor vista
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        // Fallback
        el.scrollIntoView();
      }
    }

    // 2. Actualizar posición del foco tras el scroll
    const posTimer = setTimeout(() => {
      updateTargetPosition();
    }, 280);

    // 3. Iniciar la locución por voz
    timerRef.current = setTimeout(() => {
      narrateText(step.narracion);
    }, 380);

    return () => {
      clearTimeout(posTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOnboardingOpen, currentStepIndex, activeLanguage, step, narrateText, stopVoiceImmediately, updateTargetPosition]);

  // Escuchar eventos de scroll y resize para recalcular el spotlight
  useEffect(() => {
    if (!isOnboardingOpen) return;

    const handleResizeOrScroll = () => {
      updateTargetPosition();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, [isOnboardingOpen, updateTargetPosition]);

  // Manejo accesible de teclado (Escape para salir, flechas para navegar)
  useEffect(() => {
    if (!isOnboardingOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        stopVoiceImmediately();
        closeOnboarding();
      } else if (e.key === 'ArrowRight' && currentStepIndex < stepsList.length - 1) {
        e.preventDefault();
        setCurrentStepIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        e.preventDefault();
        setCurrentStepIndex((prev) => prev - 1);
      } else if (e.key === ' ' && e.target === document.body) {
        // Barra espaciadora pausa o reanuda audio si no estamos en un input
        e.preventDefault();
        handleTogglePause();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOnboardingOpen, currentStepIndex, stepsList.length, closeOnboarding, stopVoiceImmediately]);

  // Controles de navegación
  const handleNext = () => {
    if (currentStepIndex < stepsList.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      stopVoiceImmediately();
      completeOnboarding(true);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    stopVoiceImmediately();
    closeOnboarding();
  };

  // Enviar pregunta a Gemini 3.6 Flash
  const handleAskGemini = async (e) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiResponse('');

    try {
      const res = await askGeminiAboutSection({
        question: aiQuestion.trim(),
        step,
        lang: activeLanguage,
        canton: activeCanton
      });

      if (res.success && res.text) {
        setAiResponse(res.text);
        // Narrar la respuesta generada por Gemini
        narrateText(res.text);
      } else {
        const errorMsg = 'No pudimos consultar a Gemini en este momento. Inténtelo nuevamente.';
        setAiResponse(errorMsg);
        narrateText(errorMsg);
      }
    } catch (err) {
      console.warn('[Gemini Tour Q&A Error]', err);
      const fallbackMsg = 'Hubo un error de conexión al consultar el asistente.';
      setAiResponse(fallbackMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isOnboardingOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recorrido Asistido por Voz con Spotlight"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        fontFamily: 'var(--font-body, system-ui, sans-serif)'
      }}
    >
      {/* ======================================================================
          1. SPOTLIGHT DINÁMICO & MARCO LUMINOSO (GLOWING FOCUS RING)
          ====================================================================== */}
      {targetRect && (
        <div
          data-testid="spotlight-active-ring"
          style={{
            position: 'fixed',
            top: `${Math.max(4, targetRect.top - 8)}px`,
            left: `${Math.max(4, targetRect.left - 8)}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
            borderRadius: '16px',
            border: isDark ? '3px solid #38BDF8' : '3px solid #002B7F',
            boxShadow: isDark
              ? '0 0 0 9999px rgba(0, 4, 13, 0.76), 0 0 30px rgba(56, 189, 248, 0.6)'
              : '0 0 0 9999px rgba(15, 23, 42, 0.50), 0 0 25px rgba(0, 43, 127, 0.35)',
            pointerEvents: 'none',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 100000
          }}
        >
          {/* Anillo de pulso animado para destacar interacción viva */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '22px',
              border: isDark ? '2px solid rgba(56, 189, 248, 0.4)' : '2px solid rgba(0, 43, 127, 0.4)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              pointerEvents: 'none'
            }}
          />

          {/* Insignia de elemento en foco */}
          <div
            style={{
              position: 'absolute',
              top: '-14px',
              left: '16px',
              backgroundColor: '#002B7F',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid #79A6FF',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 10px rgba(0, 4, 13, 0.6)'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isSpeakingLive ? '#34D399' : '#38BDF8',
                boxShadow: isSpeakingLive ? '0 0 8px #34D399' : 'none'
              }}
            />
            <span>{step.badge}</span>
          </div>
        </div>
      )}

      {/* Fallback si el elemento no está visible aún (pantalla limpia) */}
      {!targetRect && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: isDark ? 'rgba(0, 4, 13, 0.65)' : 'rgba(15, 23, 42, 0.45)',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* ======================================================================
          2. HUD DE CONTROL FLOTANTE (NON-INTRUSIVE FLOATING CONTROL PILL)
          Anclado en la parte inferior central con diseño Civic Glass Sovereign
          ====================================================================== */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '94%',
          maxWidth: '720px',
          zIndex: 100001,
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            backgroundColor: isDark ? 'rgba(5, 12, 28, 0.94)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.35)' : '1.5px solid var(--cru-border, #CBD5E1)',
            borderRadius: '24px',
            padding: '1.15rem 1.4rem',
            boxShadow: isDark
              ? '0 20px 60px rgba(0, 4, 13, 0.95), 0 0 35px rgba(0, 20, 137, 0.45)'
              : '0 20px 50px rgba(0, 43, 127, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08)',
            color: isDark ? '#FFFFFF' : '#0F172A'
          }}
        >
          {/* Fila 1: Cabecera con Progreso, Título y Salir */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={16} color="#38BDF8" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: isDark ? '#38BDF8' : '#002B7F',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {step.badge}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: isDark ? '#64748B' : '#94A3B8' }}>•</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: isDark ? '#94A3B8' : '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <MapPin size={11} color={isDark ? '#38BDF8' : '#002B7F'} />
                    <span>{activeCanton}</span>
                  </span>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.02rem',
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {step.title}
                </h3>
              </div>
            </div>

            {/* Botón Salir (X) */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Finalizar recorrido interactivo"
              title="Finalizar Recorrido (Esc)"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--cru-border, #CBD5E1)',
                color: isDark ? '#CBD5E1' : '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.35)';
                e.currentTarget.style.borderColor = '#DA291C';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)';
                e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'var(--cru-border, #CBD5E1)';
                e.currentTarget.style.color = isDark ? '#CBD5E1' : '#475569';
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Fila 2: Subtítulo Dinámico en Tiempo Real (Audiotranscripción Accesible) */}
          <div
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'var(--cru-surface-muted, #F1F5F9)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--cru-border, #CBD5E1)',
              borderRadius: '12px',
              padding: '0.65rem 0.85rem',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}
          >
            {/* Animación de Ecualizador / Micrófono activo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '2px',
                height: '14px',
                marginTop: '3px',
                flexShrink: 0
              }}
            >
              <span
                style={{
                  width: '3px',
                  height: isSpeakingLive && !isPaused ? '14px' : '4px',
                  backgroundColor: isDark ? '#38BDF8' : '#002B7F',
                  borderRadius: '2px',
                  transition: 'height 0.2s ease'
                }}
              />
              <span
                style={{
                  width: '3px',
                  height: isSpeakingLive && !isPaused ? '9px' : '6px',
                  backgroundColor: isDark ? '#34D399' : '#05853B',
                  borderRadius: '2px',
                  transition: 'height 0.2s ease'
                }}
              />
              <span
                style={{
                  width: '3px',
                  height: isSpeakingLive && !isPaused ? '12px' : '4px',
                  backgroundColor: isDark ? '#38BDF8' : '#002B7F',
                  borderRadius: '2px',
                  transition: 'height 0.2s ease'
                }}
              />
            </div>

            <p
              style={{
                margin: 0,
                fontSize: '0.86rem',
                color: isDark ? (isSpeakingLive ? '#F8FAFC' : '#CBD5E1') : '#0F172A',
                lineHeight: 1.45,
                fontWeight: 500,
                flex: 1
              }}
            >
              {liveSubtitle || step.narracion}
            </p>
          </div>

          {/* Fila 3: Cajón Plegable "Preguntar a Gemini sobre esta sección" */}
          {showAiDrawer && (
            <div
              style={{
                backgroundColor: isDark ? 'rgba(0, 20, 50, 0.85)' : '#F8FAFC',
                border: isDark ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--cru-border, #CBD5E1)',
                borderRadius: '16px',
                padding: '0.85rem',
                marginBottom: '0.85rem',
                animation: 'fadeIn 0.25s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: isDark ? '#38BDF8' : '#002B7F',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}
              >
                <Bot size={14} />
                <span>Asistente Cívico Gemini 3.6 Flash</span>
              </div>

              {/* Formulario de consulta rápida */}
              <form onSubmit={handleAskGemini} style={{ display: 'flex', gap: '0.45rem' }}>
                <input
                  ref={aiInputRef}
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder={`Ej: ¿Cómo uso esta sección en ${activeCanton}?`}
                  aria-label="Preguntar a Gemini sobre esta sección"
                  disabled={isAiLoading}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : '#FFFFFF',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--cru-border, #CBD5E1)',
                    borderRadius: '10px',
                    padding: '0.5rem 0.75rem',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiQuestion.trim()}
                  aria-label="Enviar pregunta a la IA"
                  style={{
                    backgroundColor: isAiLoading ? '#475569' : '#002B7F',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #002B7F',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: isAiLoading || !aiQuestion.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isAiLoading ? (
                    <span style={{ fontSize: '0.75rem' }}>Consultando...</span>
                  ) : (
                    <>
                      <span>Preguntar</span>
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>

              {/* Respuesta de Gemini */}
              {aiResponse && (
                <div
                  style={{
                    marginTop: '0.65rem',
                    padding: '0.65rem',
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.35)' : '#ECFDF5',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #A7F3D0',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    color: isDark ? '#E2E8F0' : '#064E3B'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isDark ? '#34D399' : '#05853B', fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.72rem' }}>
                    <CheckCircle2 size={12} />
                    <span>Respuesta de Gemini:</span>
                  </div>
                  {aiResponse}
                </div>
              )}
            </div>
          )}

          {/* Fila 4: Barra de Controles Interactivos */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Lado Izquierdo: Botones de Audio y Pregunta a Gemini */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {/* Botón Pausar / Reanudar Voz */}
              <button
                type="button"
                onClick={handleTogglePause}
                title={isPaused ? 'Reanudar narración' : 'Pausar narración'}
                aria-label={isPaused ? 'Reanudar voz' : 'Pausar voz'}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid var(--cru-border, #CBD5E1)',
                  color: isDark ? '#FFFFFF' : 'var(--cru-text, #0F172A)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'var(--cru-surface-alt, #E2E8F0)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)')}
              >
                {isPaused ? <Play size={13} color={isDark ? '#34D399' : '#05853B'} /> : <Pause size={13} color={isDark ? '#38BDF8' : '#002B7F'} />}
                <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
              </button>

              {/* Botón Repetir Voz */}
              <button
                type="button"
                onClick={handleReplayVoice}
                title="Repetir explicación por voz del paso actual"
                aria-label="Repetir voz"
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid var(--cru-border, #CBD5E1)',
                  color: isDark ? '#FFFFFF' : 'var(--cru-text, #0F172A)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'var(--cru-surface-alt, #E2E8F0)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)')}
              >
                <RotateCcw size={13} />
                <span>Repetir</span>
              </button>

              {/* Botón Consultar a Gemini */}
              <button
                type="button"
                onClick={() => {
                  setShowAiDrawer((prev) => !prev);
                  setTimeout(() => aiInputRef.current?.focus(), 150);
                }}
                title="Preguntar a la IA sobre esta sección"
                aria-label="Preguntar a la IA sobre esta sección"
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: isDark
                    ? (showAiDrawer ? 'rgba(0, 20, 137, 0.6)' : 'rgba(0, 20, 137, 0.3)')
                    : (showAiDrawer ? '#002B7F' : 'var(--cru-accent-sky-bg, #E0F2FE)'),
                  border: isDark ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid #002B7F',
                  color: isDark ? '#79A6FF' : (showAiDrawer ? '#FFFFFF' : '#002B7F'),
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#002B7F';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? (showAiDrawer ? 'rgba(0, 20, 137, 0.6)' : 'rgba(0, 20, 137, 0.3)')
                    : (showAiDrawer ? '#002B7F' : 'var(--cru-accent-sky-bg, #E0F2FE)');
                  e.currentTarget.style.color = isDark ? '#79A6FF' : (showAiDrawer ? '#FFFFFF' : '#002B7F');
                }}
              >
                <Sparkles size={13} />
                <span>Preguntar a la IA</span>
              </button>
            </div>

            {/* Lado Derecho: Navegación Anterior / Siguiente / Finalizar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {/* Botón Anterior */}
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Paso anterior"
                  style={{
                    padding: '0.48rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid var(--cru-border, #CBD5E1)',
                    color: isDark ? '#FFFFFF' : 'var(--cru-text, #0F172A)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.16)' : 'var(--cru-surface-alt, #E2E8F0)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--cru-surface-muted, #F1F5F9)')}
                >
                  <ArrowLeft size={14} />
                  <span>Anterior</span>
                </button>
              )}

              {/* Botón Siguiente / Finalizar */}
              <button
                type="button"
                onClick={handleNext}
                aria-label={currentStepIndex < stepsList.length - 1 ? 'Siguiente paso' : 'Finalizar recorrido'}
                style={{
                  padding: '0.48rem 1.15rem',
                  borderRadius: '10px',
                  backgroundColor: currentStepIndex < stepsList.length - 1 ? '#002B7F' : '#007A3D',
                  backgroundImage:
                    currentStepIndex < stepsList.length - 1
                      ? 'linear-gradient(135deg, #002B7F 0%, #001489 100%)'
                      : 'linear-gradient(135deg, #007A3D 0%, #004D25 100%)',
                  border: currentStepIndex < stepsList.length - 1 ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(52, 211, 153, 0.5)',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 15px rgba(0, 20, 137, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 20, 137, 0.4)';
                }}
              >
                <span>{currentStepIndex < stepsList.length - 1 ? 'Siguiente' : 'Finalizar'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
