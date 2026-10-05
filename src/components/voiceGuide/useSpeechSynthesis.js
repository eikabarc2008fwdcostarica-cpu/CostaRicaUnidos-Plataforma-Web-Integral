import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook reactivo para síntesis de voz con Web Speech API
 * Control de reproducción, velocidad (rate), tono (pitch: 1.0),
 * voces en español (es-CR, es-419, es-ES) y subtítulos sincronizados.
 */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(() => {
    try {
      const saved = localStorage.getItem('cr_speech_rate');
      return saved ? parseFloat(saved) : 1.0;
    } catch {
      return 1.0;
    }
  });

  const [showSubtitles, setShowSubtitles] = useState(() => {
    try {
      const saved = localStorage.getItem('cr_show_subtitles');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const activeUtteranceRef = useRef(null);
  const sentencesRef = useRef([]);

  // Guardar preferencias en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cr_speech_rate', String(playbackRate));
    } catch {}
  }, [playbackRate]);

  useEffect(() => {
    try {
      localStorage.setItem('cr_show_subtitles', String(showSubtitles));
    } catch {}
  }, [showSubtitles]);

  // Cargar y seleccionar la mejor voz en español disponible
  const updateVoices = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const available = window.speechSynthesis.getVoices() || [];
      setVoices(available);

      // Priorizar voces en español (es-CR > es-419 > es-ES > es)
      const spanishVoice = available.find(v => v.lang === 'es-CR') ||
        available.find(v => v.lang === 'es-419') ||
        available.find(v => v.lang === 'es-US') ||
        available.find(v => v.lang.startsWith('es-')) ||
        available.find(v => v.lang.toLowerCase().includes('es')) ||
        available[0] || null;

      setSelectedVoice(spanishVoice);
    } catch (err) {
      console.warn('[useSpeechSynthesis] Error cargando voces:', err);
    }
  }, []);

  useEffect(() => {
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
        try {
          window.speechSynthesis.cancel();
        } catch {}
      };
    }
  }, [updateVoices]);

  // Detener la locución de inmediato
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSubtitle('');
    activeUtteranceRef.current = null;
  }, []);

  // Pausar
  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } catch {}
    }
  }, []);

  // Reanudar
  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } catch {}
    }
  }, []);

  // Iniciar locución con texto
  const speak = useCallback((text, onEnd) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('[useSpeechSynthesis] Web Speech API no está soportada en este entorno.');
      return;
    }

    if (!text || !text.trim()) return;

    // Detener cualquier locución previa
    try {
      window.speechSynthesis.cancel();
    } catch {}

    // Desglose en frases para subtítulos sincronizados
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    sentencesRef.current = sentences;

    // Crear la instancia de locución
    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance;

    // Configuración nativa estricta
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Asignar voz en español si está disponible
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'es-CR';
    }

    // Inicializar subtítulo con la primera frase
    if (sentences.length > 0) {
      setCurrentSubtitle(sentences[0].trim());
    }

    // Sincronización en tiempo real de subtítulos por límites de palabras/frases
    utterance.onboundary = (event) => {
      if (typeof event.charIndex === 'number') {
        const charIdx = event.charIndex;
        let runningLength = 0;
        for (const s of sentencesRef.current) {
          runningLength += s.length;
          if (charIdx < runningLength) {
            setCurrentSubtitle(s.trim());
            break;
          }
        }
      }
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSubtitle('');
      activeUtteranceRef.current = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      // Ignorar errores por cancelación voluntaria
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[useSpeechSynthesis] Error en locución:', e);
      }
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSubtitle('');
      activeUtteranceRef.current = null;
    };

    // Desbloqueo y ejecución
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[useSpeechSynthesis] Error al invocar speak:', err);
      setIsSpeaking(false);
    }
  }, [playbackRate, selectedVoice]);

  // Alternar entre hablar y detener
  const toggle = useCallback((text) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  }, [isSpeaking, stop, speak]);

  return {
    isSpeaking,
    isPaused,
    playbackRate,
    setPlaybackRate,
    showSubtitles,
    setShowSubtitles,
    currentSubtitle,
    voices,
    selectedVoice,
    speak,
    stop,
    pause,
    resume,
    toggle
  };
}
