/**
 * COSTA RICA UNIDOS — Hook de Recorrido Asistido por Voz y Spotlight
 * 
 * Gestiona el desplazamiento suave (scrollIntoView), cálculo de coordenadas del spotlight,
 * marco de enfoque luminoso (ring-4 ring-cyan-500), síntesis de voz sin solapamientos (Web Speech API)
 * y control de avance del recorrido con manejo resiliente ante selectores inexistentes.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '../components/accessibility/AccessibilityContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Consulta segura de selectores CSS en el DOM.
 * Si el selector tiene pseudo-selectores no estándar o sintaxis inválida,
 * intenta recuperar un selector base o devuelve null sin lanzar excepción.
 */
function safeQuery(selector) {
  if (!selector || typeof selector !== 'string' || typeof document === 'undefined') return null;
  try {
    return document.querySelector(selector);
  } catch (err) {
    try {
      const sanitized = selector
        .split(',')[0]
        .replace(/:has-text\([^)]*\)/gi, '')
        .replace(/:contains\([^)]*\)/gi, '')
        .trim();
      if (sanitized) return document.querySelector(sanitized);
    } catch {}
    return null;
  }
}

export function useVoiceTour() {
  const { selectedLang, voiceGender } = useAccessibility();
  const { langCode } = useLanguage();

  const activeLanguage = langCode || selectedLang || 'es-CR';

  const [isTourActive, setIsTourActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [fromAi, setFromAi] = useState(false);

  // Estados de voz y spotlight
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [liveSubtitle, setLiveSubtitle] = useState('');
  const [targetRect, setTargetRect] = useState(null);

  const utteranceRef = useRef(null);
  const timerRef = useRef(null);
  const activeElementRef = useRef(null);

  const currentStep = steps[currentStepIndex] || null;

  // Limpieza del marco de enfoque luminoso en el elemento DOM previo
  const cleanupActiveRing = useCallback(() => {
    if (activeElementRef.current) {
      try {
        activeElementRef.current.classList.remove('ring-4', 'ring-cyan-500', 'transition-all', 'duration-300');
      } catch {}
      activeElementRef.current = null;
    }
  }, []);

  // Detener la síntesis de voz de forma inmediata
  const stopVoice = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setLiveSubtitle('');
  }, []);

  // Sintetizar voz para un texto determinado con Web Speech API
  const speakText = useCallback(
    (textToSpeak, onComplete = null) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (!textToSpeak || !textToSpeak.trim()) return;

      stopVoice();

      try {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = activeLanguage === 'en-US' ? 'en-US' : 'es-CR';
        utterance.rate = 0.95;
        utterance.pitch = voiceGender === 'female' ? 1.05 : 0.88;

        // Selección de voz óptima instalada
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
                    v.name.toLowerCase().includes('paulina') ||
                    v.name.toLowerCase().includes('monica') ||
                    v.name.toLowerCase().includes('sabina') ||
                    v.name.toLowerCase().includes('zira')
                  )
                : matching.find((v) =>
                    v.name.toLowerCase().includes('male') ||
                    v.name.toLowerCase().includes('hombre') ||
                    v.name.toLowerCase().includes('jorge') ||
                    v.name.toLowerCase().includes('david')
                  );
            utterance.voice = preferred || matching[0];
          }
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
          setLiveSubtitle(textToSpeak);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setLiveSubtitle('');
          if (onComplete) onComplete();
        };

        utterance.onerror = (e) => {
          console.warn('[Guía Gemini TTS Warning]', e);
          setIsSpeaking(false);
          setIsPaused(false);
          setLiveSubtitle('');
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[Guía Gemini] Error al invocar speechSynthesis:', err);
      }
    },
    [activeLanguage, voiceGender, stopVoice]
  );

  // Pausar locución
  const pauseVoice = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {}
    }
    setIsPaused(true);
  }, []);

  // Reanudar locución
  const resumeVoice = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          const text = currentStep?.speechText || currentStep?.locucion;
          if (text) speakText(text);
        }
      } catch {}
    }
    setIsPaused(false);
  }, [currentStep, speakText]);

  // Medir y calcular el rectángulo del elemento enfocado
  const measureTargetElement = useCallback((selector) => {
    if (!selector || typeof document === 'undefined') {
      setTargetRect(null);
      return null;
    }

    const el = safeQuery(selector);
    if (!el) {
      setTargetRect(null);
      return null;
    }

    try {
      const rect = el.getBoundingClientRect();
      const computed = {
        top: Math.max(0, rect.top),
        left: Math.max(0, rect.left),
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right
      };

      setTargetRect(computed);
      return el;
    } catch {
      setTargetRect(null);
      return null;
    }
  }, []);

  // Escuchar cambios de tamaño y scroll para mantener alineado el spotlight
  useEffect(() => {
    if (!isTourActive || !currentStep) return;

    const selector = currentStep.targetSelector || currentStep.selector;
    const handleUpdate = () => {
      measureTargetElement(selector);
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { passive: true });

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, [isTourActive, currentStep, measureTargetElement]);

  // Al cambiar de paso: desplazar suavemente, aplicar marco luminoso y narrar
  useEffect(() => {
    if (!isTourActive || !currentStep) {
      stopVoice();
      cleanupActiveRing();
      setTargetRect(null);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    cleanupActiveRing();

    const selector = currentStep.targetSelector || currentStep.selector;
    const speech = currentStep.speechText || currentStep.locucion;
    const el = measureTargetElement(selector);

    if (el) {
      try {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        // Aplicar marco luminoso exigido
        el.classList.add('ring-4', 'ring-cyan-500', 'transition-all', 'duration-300');
        activeElementRef.current = el;
      } catch (e) {
        // En caso de que el elemento no admita scrollIntoView
      }
    } else {
      console.log(`[Guía Gemini] Selector no presente físicamente en DOM (${selector}). Presentando explicación en HUD sin bloquear flujo.`);
      setTargetRect(null);
    }

    // Retardo controlado para sincronizar desplazamiento con inicio de voz y spotlight
    timerRef.current = setTimeout(() => {
      if (selector) measureTargetElement(selector);
      if (speech) {
        speakText(speech);
      }
    }, 380);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTourActive, currentStepIndex, steps, cleanupActiveRing, measureTargetElement, speakText, stopVoice]);

  // Iniciar el tour con normalización estricta de pasos
  const startTour = useCallback((newSteps, title = '', isFromAi = false) => {
    if (!newSteps || !Array.isArray(newSteps) || newSteps.length === 0) return;

    // Normalizar propiedades para compatibilidad total con Gemini y diccionarios fallback
    const normalized = newSteps.map((st) => ({
      targetSelector: st.targetSelector || st.selector || '',
      selector: st.selector || st.targetSelector || '',
      title: st.title || st.titulo || 'Componente Cívico',
      titulo: st.titulo || st.title || 'Componente Cívico',
      speechText: st.speechText || st.locucion || '',
      locucion: st.locucion || st.speechText || '',
      tips: st.tips || ''
    }));

    setSteps(normalized);
    setPageTitle(title);
    setFromAi(isFromAi);
    setCurrentStepIndex(0);
    setIsTourActive(true);
  }, []);

  // Detener el tour
  const stopTour = useCallback(() => {
    stopVoice();
    cleanupActiveRing();
    if (typeof document !== 'undefined') {
      try {
        document.querySelectorAll('[data-tour-scanned]').forEach((el) => {
          el.removeAttribute('data-tour-scanned');
        });
      } catch {}
    }
    setIsTourActive(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setTargetRect(null);
  }, [stopVoice, cleanupActiveRing]);

  // Siguiente paso
  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      stopTour();
    }
  }, [currentStepIndex, steps.length, stopTour]);

  // Paso anterior
  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Repetir locución del paso actual
  const repeatStep = useCallback(() => {
    const text = currentStep?.speechText || currentStep?.locucion;
    if (text) {
      speakText(text);
    }
  }, [currentStep, speakText]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopVoice();
      cleanupActiveRing();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stopVoice, cleanupActiveRing]);

  return {
    isTourActive,
    isAnalyzing,
    setIsAnalyzing,
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
    speakCustomText: speakText
  };
}
