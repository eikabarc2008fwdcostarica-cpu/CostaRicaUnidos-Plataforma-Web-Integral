import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { IDIOMAS_SOPORTADOS, FASES_TIPOGRAFICAS, MODOS_DALTONISMO } from './accessibilityData';

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  // 0. Estado de Adaptación para Daltonismo (WCAG 2.1 AA / Ley N° 7600)
  const [daltonismoMode, setDaltonismoModeState] = useState(() => {
    try {
      return localStorage.getItem('cr_daltonismo') || 'normal';
    } catch {
      return 'normal';
    }
  });

  const applyDaltonismo = useCallback((mode) => {
    if (typeof document === 'undefined') return;
    try {
      if (mode && mode !== 'normal') {
        document.documentElement.setAttribute('data-colorblind', mode);
        document.documentElement.style.filter = `url(#${mode})`;
        document.body.setAttribute('data-colorblind', mode);
        document.body.style.filter = `url(#${mode})`;
      } else {
        document.documentElement.removeAttribute('data-colorblind');
        document.documentElement.style.filter = '';
        document.body.removeAttribute('data-colorblind');
        document.body.style.filter = '';
      }
    } catch (e) {
      console.warn('[Accesibilidad] Error al aplicar filtro de daltonismo:', e);
    }
  }, []);

  const setDaltonismoMode = useCallback((mode) => {
    const validMode = mode || 'normal';
    setDaltonismoModeState(validMode);
    try {
      localStorage.setItem('cr_daltonismo', validMode);
    } catch (e) {
      console.warn('[Accesibilidad] No se pudo guardar modo de daltonismo:', e);
    }
    applyDaltonismo(validMode);
    try {
      window.dispatchEvent(new CustomEvent('daltonismoChanged', { detail: { mode: validMode } }));
    } catch {
      // ignore
    }
  }, [applyDaltonismo]);

  // Sincronizar filtro de daltonismo en montaje inicial
  useEffect(() => {
    applyDaltonismo(daltonismoMode);
  }, [daltonismoMode, applyDaltonismo]);
  // 1. Estado de Escala Tipográfica (4 Fases: 100%, 125%, 150%, 200%)
  const [textPhase, setTextPhaseState] = useState(() => {
    try {
      const saved = localStorage.getItem('cr_text_phase');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const currentScaleConfig = FASES_TIPOGRAFICAS.find((f) => f.fase === textPhase) || FASES_TIPOGRAFICAS[0];
  const textScale = currentScaleConfig.escala;

  // Inyectar variable CSS global (--text-scale) y atributo data-text-phase en <html>
  const setTextPhase = useCallback((phase) => {
    const validPhase = Math.max(1, Math.min(4, phase));
    setTextPhaseState(validPhase);
    try {
      localStorage.setItem('cr_text_phase', validPhase.toString());
    } catch (e) {
      console.warn('[Accesibilidad] No se pudo guardar fase tipográfica:', e);
    }

    const conf = FASES_TIPOGRAFICAS.find((f) => f.fase === validPhase) || FASES_TIPOGRAFICAS[0];
    document.documentElement.style.setProperty('--text-scale', conf.escala.toString());
    document.documentElement.setAttribute('data-text-phase', validPhase.toString());
  }, []);

  // Sincronizar en montaje inicial
  useEffect(() => {
    setTextPhase(textPhase);
  }, [textPhase, setTextPhase]);

  // 2. Estado del Motor de Lectura en Voz Alta (TTS Web Speech API)
  const [selectedLang, setSelectedLangState] = useState(() => {
    try {
      return localStorage.getItem('cr_tts_lang') || 'es-419';
    } catch {
      return 'es-419';
    }
  });

  const [voiceGender, setVoiceGenderState] = useState(() => {
    try {
      return localStorage.getItem('cr_tts_gender') || 'female';
    } catch {
      return 'female';
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [availableVoices, setAvailableVoices] = useState([]);
  const utteranceRef = useRef(null);

  // Cargar catálogo de voces del sistema
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const setSelectedLang = useCallback((langCode) => {
    setSelectedLangState(langCode);
    try {
      localStorage.setItem('cr_tts_lang', langCode);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const setVoiceGender = useCallback((gender) => {
    setVoiceGenderState(gender);
    try {
      localStorage.setItem('cr_tts_gender', gender);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Detener locución
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSubtitle('');
  }, []);

  // Función principal de locución asistida
  const speakText = useCallback(
    (textToSpeak, options = {}) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('[TTS] Web Speech API no soportada en este entorno.');
        return false;
      }

      if (!textToSpeak || !textToSpeak.trim()) return false;

      stopSpeaking();

      const langInfo = IDIOMAS_SOPORTADOS.find((i) => i.codigo === (options.lang || selectedLang)) || IDIOMAS_SOPORTADOS[0];
      const targetGender = options.gender || voiceGender;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langInfo.synthLang || 'es-CR';
      utterance.rate = options.rate || 0.95;
      utterance.pitch = targetGender === 'female' ? 1.1 : 0.85;

      // Buscar voz coincidente por idioma y género
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = langInfo.bcp47.split('-')[0].toLowerCase();
        const matchingVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));

        let pickedVoice = null;
        if (targetGender === 'female') {
          pickedVoice = matchingVoices.find((v) =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('mujer') ||
            v.name.toLowerCase().includes('monica') ||
            v.name.toLowerCase().includes('paulina') ||
            v.name.toLowerCase().includes('helena') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('sabina')
          );
        } else {
          pickedVoice = matchingVoices.find((v) =>
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('hombre') ||
            v.name.toLowerCase().includes('jorge') ||
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('pablo')
          );
        }

        utterance.voice = pickedVoice || matchingVoices[0] || voices[0];
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSubtitle(textToSpeak);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentSubtitle('');
        if (options.onComplete) options.onComplete();
      };

      utterance.onerror = (e) => {
        console.warn('[TTS Error]', e);
        setIsSpeaking(false);
        setCurrentSubtitle('');
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    },
    [selectedLang, voiceGender, stopSpeaking]
  );

  // Leer en voz alta la página actual (encabezados, alertas principales, telemetría)
  const readCurrentPage = useCallback(() => {
    // 1. Extraer título principal h1
    const h1 = document.querySelector('h1')?.innerText || 'Costa Rica Unidos';

    // 2. Extraer alerta o telemetría activa
    const alertBanner = document.querySelector('[role="status"]')?.innerText || '';

    // 3. Extraer primer párrafo relevante
    const firstP = document.querySelector('main p')?.innerText || '';

    const textToRead = `Página actual: ${h1}. ${alertBanner ? 'Estado prioritario: ' + alertBanner + '.' : ''} ${firstP ? 'Resumen: ' + firstP : ''}`;
    speakText(textToRead);
  }, [speakText]);

  // 3. Estado del Onboarding Asistido por Voz
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const openOnboarding = useCallback(() => {
    stopSpeaking();
    setIsOnboardingOpen(true);
  }, [stopSpeaking]);

  const closeOnboarding = useCallback(() => {
    stopSpeaking();
    setIsOnboardingOpen(false);
  }, [stopSpeaking]);

  const completeOnboarding = useCallback(
    (doNotShowAgain = true) => {
      stopSpeaking();
      setIsOnboardingOpen(false);
      if (doNotShowAgain) {
        try {
          localStorage.setItem('cr_onboarding_completed', 'true');
        } catch (e) {
          console.warn(e);
        }
      }
    },
    [stopSpeaking]
  );

  return (
    <AccessibilityContext.Provider
      value={{
        // Adaptación para Daltonismo (WCAG 2.1 AA / Ley N° 7600)
        daltonismoMode,
        setDaltonismoMode,
        MODOS_DALTONISMO,

        // Escala Tipográfica
        textPhase,
        textScale,
        setTextPhase,
        currentScaleConfig,

        // Síntesis de Voz Multilingüe
        selectedLang,
        setSelectedLang,
        voiceGender,
        setVoiceGender,
        isSpeaking,
        currentSubtitle,
        speakText,
        stopSpeaking,
        readCurrentPage,
        availableVoices,

        // Onboarding
        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,
        completeOnboarding
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe ser utilizado dentro de un AccessibilityProvider');
  }
  return context;
}
