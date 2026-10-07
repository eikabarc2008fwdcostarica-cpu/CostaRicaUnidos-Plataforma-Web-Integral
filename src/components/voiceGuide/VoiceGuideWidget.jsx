import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VoiceGuideWidget.css';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { getCantonInstitutionalSummary } from './cantonSummaryHelper';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useTheme } from '../../context/ThemeContext';
import { generarRespuestaIA, getGeminiApiKey } from '../../services/geminiService';
import { obtenerPromptGuiaVoz, MAPA_RUTAS_PLATAFORMA } from '../../config/promptsIA';

/**
 * VoiceGuideWidget (Sovereign Civic Glass v2.1)
 * Componente flotante de voz con Web Speech API real, síntesis institucional cantonal,
 * cápsula unificada (Ajustes + Guía por Voz + Guía Interactiva + Minimizar).
 * Regla estricta: Cero emojis, toda la iconografía es SVG vectorial.
 */
export default function VoiceGuideWidget({
  selectedCanton: propCanton,
  handleToggleVoice: propHandleToggleVoice,
  onToggleVoice,
  handleStartTour,
  onStartTour,
  iniciarGuiaInteractiva,
  isMinimized: controlledMinimized,
  setIsMinimized: controlledSetIsMinimized,
  isSettingsOpen: controlledSettingsOpen,
  setIsSettingsOpen: controlledSetIsSettingsOpen,
  isAnalyzing = false,
  className = ''
}) {
  const { isDark } = useTheme?.() || { isDark: true };

  // Manejo de estado interno o controlado para el modo minimizado
  const [internalMinimized, setInternalMinimized] = useState(false);
  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;
  const setIsMinimized = controlledSetIsMinimized || setInternalMinimized;

  // Manejo de estado interno o controlado para el panel de ajustes
  const [internalSettingsOpen, setInternalSettingsOpen] = useState(false);
  const isSettingsOpen = controlledSettingsOpen !== undefined ? controlledSettingsOpen : internalSettingsOpen;
  const setIsSettingsOpen = controlledSetIsSettingsOpen || setInternalSettingsOpen;

  // Usuario autenticado para fallback de cantón oficial
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
  } catch {
    user = null;
  }

  // Sincronización reactiva del cantón territorial activo
  const [activeCanton, setActiveCanton] = useState(() => {
    if (propCanton) return propCanton;
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  useEffect(() => {
    if (propCanton) {
      setActiveCanton(propCanton);
      return;
    }
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) setActiveCanton(e.detail.nombre);
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, [propCanton]);

  const cantonActivo = activeCanton;
  const selectedCanton = propCanton || activeCanton || 'San José';

  const navigate = useNavigate();
  let location;
  try {
    location = useLocation();
  } catch {
    location = { pathname: '/' };
  }

  // Estados del Asistente de Voz Interactivo con Gemini
  const [asistenteAbierto, setAsistenteAbierto] = useState(false);
  const [estadoAsistente, setEstadoAsistente] = useState('inactivo'); // 'inactivo' | 'escuchando' | 'procesando' | 'hablando'
  const [consultaTexto, setConsultaTexto] = useState('');
  const [transcripcionEnVivo, setTranscripcionEnVivo] = useState('');
  const [respuestaVoz, setRespuestaVoz] = useState(null);
  const [silenciado, setSilenciado] = useState(false);
  const [errorAsistente, setErrorAsistente] = useState(null);

  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Hook nativo de síntesis de voz con Web Speech API
  const {
    isSpeaking,
    playbackRate,
    setPlaybackRate,
    showSubtitles,
    setShowSubtitles,
    currentSubtitle,
    speak,
    stop
  } = useSpeechSynthesis();

  const soportaVoz = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const procesarConsultaConGemini = async (textoPregunta) => {
    if (!textoPregunta || !textoPregunta.trim()) return;

    setEstadoAsistente('procesando');
    setErrorAsistente(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const rutaActual = location?.pathname || '/';
      const rolActual = user?.rol || user?.rolNombre || 'Ciudadano';
      const promptSistema = obtenerPromptGuiaVoz({
        rutaActual,
        cantonActivo: selectedCanton,
        rolUsuario: rolActual
      });

      const res = await generarRespuestaIA({
        sistema: promptSistema,
        mensaje: textoPregunta,
        opciones: { temperature: 0.5, maxOutputTokens: 500 }
      });

      const rawTexto = res.texto;

      // Detectar etiqueta [RUTA:/...]
      let rutaDestino = null;
      let nombreRuta = null;
      const matchRuta = rawTexto.match(/\[RUTA:([^\]]+)\]/);
      if (matchRuta && matchRuta[1]) {
        rutaDestino = matchRuta[1].trim();
        nombreRuta = MAPA_RUTAS_PLATAFORMA[rutaDestino]?.nombre || rutaDestino;
      }

      // Limpiar etiqueta para que el sintetizador de voz no la lea
      const textoLimpio = rawTexto.replace(/\[RUTA:[^\]]+\]/g, '').trim();

      setRespuestaVoz({
        texto: textoLimpio,
        modelo: res.modelo,
        latenciaMs: res.latenciaMs,
        rutaDestino,
        nombreRuta
      });

      setEstadoAsistente('hablando');

      if (!silenciado) {
        speak(textoLimpio, () => {
          setEstadoAsistente('inactivo');
        });
      } else {
        setEstadoAsistente('inactivo');
      }
    } catch (err) {
      console.error('[Guía por Voz Gemini Error]', err);
      setErrorAsistente('La IA no está disponible ahora, inténtalo de nuevo.');
      setEstadoAsistente('inactivo');
    }
  };

  const iniciarReconocimientoVoz = () => {
    if (!soportaVoz) {
      setErrorAsistente('Tu navegador no soporta reconocimiento de voz por micrófono. Puedes escribir tu consulta en el recuadro inferior.');
      return;
    }

    const hayKey = Boolean(getGeminiApiKey());
    if (!hayKey) {
      setErrorAsistente('Asistente por voz deshabilitado (Configure VITE_GEMINI_API_KEY).');
      return;
    }

    stop();
    setErrorAsistente(null);
    setTranscripcionEnVivo('');
    setEstadoAsistente('escuchando');

    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'es-CR';

      rec.onstart = () => {
        setEstadoAsistente('escuchando');
      };

      rec.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          setTranscripcionEnVivo(transcript.trim());
          procesarConsultaConGemini(transcript.trim());
        }
      };

      rec.onerror = (event) => {
        console.warn('[Guía por Voz] Error SpeechRecognition:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorAsistente('Permiso de micrófono no otorgado. Puedes escribir tu consulta a continuación.');
          setEstadoAsistente('inactivo');
        } else if (event.error === 'no-speech') {
          setErrorAsistente('No logramos escucharte. Inténtalo de nuevo o escribe tu consulta.');
          setEstadoAsistente('inactivo');
        } else if (event.error === 'language-not-supported' && rec.lang === 'es-CR') {
          rec.lang = 'es-419';
          try { rec.start(); return; } catch {}
          setEstadoAsistente('inactivo');
        } else {
          setErrorAsistente('Inconveniente al capturar audio. Puedes escribir tu consulta.');
          setEstadoAsistente('inactivo');
        }
      };

      rec.onend = () => {
        setEstadoAsistente((prev) => (prev === 'escuchando' ? 'inactivo' : prev));
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('[Guía por Voz] Excepción iniciando micrófono:', err);
      setErrorAsistente('No se pudo activar el micrófono. Puedes escribir tu consulta.');
      setEstadoAsistente('inactivo');
    }
  };

  const detenerReconocimientoVoz = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setEstadoAsistente('inactivo');
  };

  const cerrarAsistente = () => {
    detenerReconocimientoVoz();
    stop();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setAsistenteAbierto(false);
    setEstadoAsistente('inactivo');
    setErrorAsistente(null);
  };

  const handleConsultarPorTexto = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!consultaTexto.trim() || estadoAsistente === 'procesando') return;
    const query = consultaTexto.trim();
    setConsultaTexto('');
    setTranscripcionEnVivo(query);
    procesarConsultaConGemini(query);
  };

  // Detener locución si cambia el cantón territorial
  useEffect(() => {
    if (isSpeaking) {
      stop();
    }
  }, [selectedCanton]);

  // Acceso al Onboarding del AccessibilityContext si está disponible
  let openOnboarding = null;
  try {
    const a11y = useAccessibility();
    openOnboarding = a11y?.openOnboarding || null;
  } catch {
    openOnboarding = null;
  }

  // Manejador del clic en la pastilla principal de voz
  const handlePillClick = (e) => {
    if (propHandleToggleVoice) {
      propHandleToggleVoice(e);
      return;
    }
    if (onToggleVoice) {
      onToggleVoice(e);
      return;
    }

    // 1. Si está hablando: Pausa o detiene la reproducción de inmediato
    if (isSpeaking) {
      stop();
      return;
    }

    // 2. Si no está hablando: Inicia la locución del resumen institucional del cantón activo
    const resumenInstitucional = getCantonInstitutionalSummary(selectedCanton);
    speak(resumenInstitucional);
  };

  const handleToggleVoice = handlePillClick;

  // Función para ejecutar el tour interactivo de recuadros
  const ejecutarGuiaDeRecuadros = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    stop();
    setIsSettingsOpen(false);

    if (typeof handleStartTour === 'function') {
      handleStartTour();
      return;
    }
    if (typeof onStartTour === 'function') {
      onStartTour();
      return;
    }
    if (typeof iniciarGuiaInteractiva === 'function') {
      iniciarGuiaInteractiva();
      return;
    }
    if (typeof openOnboarding === 'function') {
      openOnboarding();
      return;
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('startUniversalVoiceTour'));
    }
  };

  // Cierre accesible del popover al hacer clic afuera o pulsar Escape
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsSettingsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSettingsOpen, setIsSettingsOpen]);

  // Prueba de voz del sistema con la velocidad configurada
  const handleTestVoice = () => {
    const testPhrase = `Prueba de síntesis de voz a velocidad ${playbackRate}x para el Cantón de ${selectedCanton}. Sistema de gobernanza y accesibilidad activo.`;
    speak(testPhrase);
  };

  if (isMinimized) {
    return (
      <button 
        type="button" 
        onClick={() => setIsMinimized(false)} 
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 900,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(5, 12, 28, 0.85)' : '#FFFFFF',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(56, 189, 248, 0.40)' : '1.5px solid var(--cru-border, #CBD5E1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isDark ? '#38BDF8' : '#002B7F',
          boxShadow: isDark ? '0 8px 32px rgba(0, 4, 13, 0.45)' : '0 8px 24px rgba(0, 43, 127, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08)'
        }}
        title={isSpeaking ? "Reproduciendo Guía... (Click para expandir)" : "Expandir Guía por Voz"}
        aria-label={isSpeaking ? "Reproduciendo Guía... (Click para expandir)" : "Expandir Guía por Voz"}
      >
        {isSpeaking ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isDark ? '#38BDF8' : '#002B7F'} className="voice-audio-bars">
            <rect className="sound-wave-bar bar-1" x="4" y="4" width="3.2" height="16" rx="1.6" />
            <rect className="sound-wave-bar bar-2" x="10.4" y="4" width="3.2" height="16" rx="1.6" />
            <rect className="sound-wave-bar bar-3" x="16.8" y="4" width="3.2" height="16" rx="1.6" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#38BDF8' : '#002B7F'} strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        )}
      </button>
    );
  }

  return (
    /* Contenedor Flotante Limpio en Esquina Inferior Derecha */
    <div
      ref={wrapperRef}
      className={`voice-floating-unified-container ${className}`}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px',
        backgroundColor: isDark ? 'rgba(5, 12, 28, 0.85)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid var(--cru-border, #CBD5E1)',
        borderRadius: '9999px',
        boxShadow: isDark ? '0 8px 32px rgba(0, 4, 13, 0.45)' : '0 8px 28px rgba(0, 43, 127, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Subtítulos Sincronizados en Pantalla (Ley N° 7600) */}
      {showSubtitles && isSpeaking && currentSubtitle && !isSettingsOpen && (
        <div
          role="status"
          aria-live="polite"
          className="voice-live-subtitles-card"
        >
          <div className="voice-live-subtitles-header">
            <div className="voice-live-dot" />
            <span className="voice-live-title">Locución en Vivo • {selectedCanton}</span>
          </div>
          <p className="voice-live-subtitles-body">
            {currentSubtitle}
          </p>
        </div>
      )}

      {/* Popover de Configuración de Accesibilidad (Al pulsar el engranaje) */}
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-label="Configuración de Accesibilidad y Guía por Voz"
          className="voice-settings-popover"
        >
          {/* Cabecera del popover */}
          <div className="voice-settings-header">
            <div className="voice-settings-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Ajustes de Accesibilidad</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="voice-settings-close-btn"
              aria-label="Cerrar ajustes"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Selector de Velocidad */}
          <div className="voice-settings-field">
            <span className="voice-settings-label">Velocidad de Locución:</span>
            <div className="voice-speed-selector">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackRate(rate)}
                  className={`voice-speed-chip ${playbackRate === rate ? 'is-active' : ''}`}
                  aria-pressed={playbackRate === rate}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Alternador de Subtítulos Sincronizados */}
          <div className="voice-settings-field">
            <div className="voice-toggle-row">
              <div className="voice-toggle-label-wrap">
                <span className="voice-settings-label">Subtítulos Sincronizados</span>
                <span className="voice-settings-sublabel">Mostrar subtítulos en pantalla</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={showSubtitles}
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`voice-toggle-switch ${showSubtitles ? 'is-active' : ''}`}
                aria-label="Alternar subtítulos en pantalla"
              >
                <span className="voice-toggle-thumb" />
                <span className="voice-toggle-status">{showSubtitles ? 'On' : 'Off'}</span>
              </button>
            </div>
          </div>

          {/* Probar voz */}
          <button
            type="button"
            onClick={handleTestVoice}
            className="voice-settings-action-btn secondary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Probar Voz del Sistema</span>
          </button>

          {/* Recorrido Asistido */}
          <button
            type="button"
            onClick={ejecutarGuiaDeRecuadros}
            className="voice-settings-action-btn primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <span>Recorrido Asistido por Pantalla</span>
          </button>
        </div>
      )}

      {/* 1. Botón de Ajustes (Engranaje) */}
      <button
        type="button"
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark
            ? (isSettingsOpen ? 'rgba(56, 189, 248, 0.20)' : 'rgba(255, 255, 255, 0.08)')
            : (isSettingsOpen ? 'var(--cru-accent-sky-bg)' : 'var(--cru-surface-muted)'),
          border: isDark
            ? (isSettingsOpen ? '1px solid rgba(56, 189, 248, 0.60)' : '1px solid rgba(255, 255, 255, 0.15)')
            : '1px solid var(--cru-border)',
          color: isDark
            ? (isSettingsOpen ? '#38BDF8' : '#94A3B8')
            : (isSettingsOpen ? 'var(--cru-accent-sky)' : 'var(--cru-text)'),
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        aria-label="Ajustes de accesibilidad y voz"
        title="Ajustes de accesibilidad y voz"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* 2. Botón de Asistente de Voz (Micrófono + Hablar con Gemini) */}
      <button
        type="button"
        onClick={() => {
          setAsistenteAbierto(true);
          setIsSettingsOpen(false);
          // Si está inactivo, iniciar escucha automáticamente
          if (estadoAsistente === 'inactivo') {
            iniciarReconocimientoVoz();
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '9999px',
          backgroundColor: isDark
            ? (estadoAsistente === 'escuchando'
                ? 'rgba(239, 68, 68, 0.35)'
                : estadoAsistente === 'hablando'
                ? 'rgba(56, 189, 248, 0.35)'
                : 'rgba(168, 85, 247, 0.22)')
            : (estadoAsistente === 'escuchando'
                ? '#DC2626'
                : estadoAsistente === 'hablando'
                ? '#0284C7'
                : '#7C3AED'),
          border: isDark
            ? (estadoAsistente === 'escuchando'
                ? '1px solid rgba(248, 113, 113, 0.85)'
                : estadoAsistente === 'hablando'
                ? '1px solid rgba(56, 189, 248, 0.85)'
                : '1px solid rgba(192, 132, 252, 0.45)')
            : '1px solid transparent',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: isDark
            ? (estadoAsistente === 'escuchando'
                ? '0 0 16px rgba(239, 68, 68, 0.45)'
                : estadoAsistente === 'hablando'
                ? '0 0 16px rgba(56, 189, 248, 0.45)'
                : 'none')
            : '0 4px 12px rgba(124, 58, 237, 0.25)',
          transition: 'all 0.22s ease'
        }}
        title="Hablar con la Guía por Voz (Gemini)"
        aria-label="Hablar con la Guía por Voz (Gemini)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        <span>Hablar</span>
      </button>

      {/* 3. Botón de Guía (Recorrido de Pantalla) */}
      <button
        type="button"
        onClick={ejecutarGuiaDeRecuadros}
        disabled={isAnalyzing}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 16px',
          borderRadius: '9999px',
          backgroundColor: isDark
            ? (isSpeaking ? 'rgba(14, 116, 144, 0.45)' : 'rgba(30, 136, 229, 0.22)')
            : (isSpeaking ? '#001489' : '#002B7F'),
          border: isDark
            ? (isSpeaking ? '1px solid rgba(56, 189, 248, 0.85)' : '1px solid rgba(56, 189, 248, 0.45)')
            : '1px solid #001489',
          color: '#FFFFFF',
          cursor: isAnalyzing ? 'wait' : 'pointer',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: isDark
            ? (isSpeaking ? '0 0 18px rgba(56, 189, 248, 0.45)' : 'none')
            : '0 4px 12px rgba(0, 43, 127, 0.25)',
          transition: 'all 0.22s ease'
        }}
        title="Iniciar recorrido guiado interactivo por voz"
        aria-label="Iniciar recorrido guiado interactivo por voz"
      >
        {isSpeaking ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isDark ? '#38BDF8' : '#FFFFFF'} className="voice-audio-bars" aria-label="Audio activo">
            <rect className="sound-wave-bar bar-1" x="4" y="4" width="3.2" height="16" rx="1.6" />
            <rect className="sound-wave-bar bar-2" x="10.4" y="4" width="3.2" height="16" rx="1.6" />
            <rect className="sound-wave-bar bar-3" x="16.8" y="4" width="3.2" height="16" rx="1.6" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#38BDF8' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
          </svg>
        )}
        <span>Guía</span>
      </button>

      {/* DIÁLOGO / MODAL INTERACTIVO DE GUÍA POR VOZ (GEMINI) */}
      {asistenteAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Guía por Voz Soberana con Gemini"
          style={{
            position: 'fixed',
            bottom: '4.8rem',
            right: '1.5rem',
            width: 'calc(100vw - 3rem)',
            maxWidth: '430px',
            maxHeight: '82vh',
            borderRadius: '20px',
            backgroundColor: isDark ? 'rgba(5, 12, 28, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: isDark ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid var(--cru-border, #CBD5E1)',
            boxShadow: isDark
              ? '0 16px 48px rgba(0, 4, 13, 0.85), 0 0 28px rgba(168, 85, 247, 0.2)'
              : '0 16px 40px rgba(0, 43, 127, 0.25)',
            zIndex: 9500,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Cabecera del Asistente */}
          <div
            style={{
              padding: '0.85rem 1.15rem',
              borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--cru-border, #CBD5E1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F8FAFC'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: estadoAsistente === 'escuchando' ? '#EF4444' : estadoAsistente === 'hablando' ? '#38BDF8' : '#A855F7'
                  }}
                />
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Guía por Voz • Gemini
                </h3>
              </div>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                {selectedCanton} • Rol: {user?.rol || 'Ciudadano'}
              </p>
            </div>

            <button
              type="button"
              onClick={cerrarAsistente}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: isDark ? '#CBD5E1' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Cerrar Asistente de Voz"
              title="Cerrar Asistente de Voz"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Cuerpo Central del Asistente */}
          <div
            style={{
              padding: '1.25rem 1.15rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflowY: 'auto',
              maxHeight: 'calc(82vh - 120px)'
            }}
          >
            {/* Botón Central de Micrófono con Estados */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.5rem 0 1rem' }}>
              <button
                type="button"
                onClick={() => {
                  if (estadoAsistente === 'escuchando') {
                    detenerReconocimientoVoz();
                  } else if (estadoAsistente === 'hablando') {
                    detenerLocucion();
                  } else {
                    iniciarReconocimientoVoz();
                  }
                }}
                disabled={estadoAsistente === 'procesando'}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: estadoAsistente === 'escuchando'
                    ? '#DC2626'
                    : estadoAsistente === 'hablando'
                    ? '#0284C7'
                    : '#7C3AED',
                  border: estadoAsistente === 'escuchando'
                    ? '3px solid rgba(254, 202, 202, 0.6)'
                    : estadoAsistente === 'hablando'
                    ? '3px solid rgba(186, 230, 253, 0.6)'
                    : '3px solid rgba(233, 213, 255, 0.4)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: estadoAsistente === 'procesando' ? 'wait' : 'pointer',
                  boxShadow: estadoAsistente === 'escuchando'
                    ? '0 0 24px rgba(239, 68, 68, 0.6)'
                    : estadoAsistente === 'hablando'
                    ? '0 0 24px rgba(56, 189, 248, 0.6)'
                    : '0 8px 24px rgba(124, 58, 237, 0.35)',
                  transition: 'all 0.25s ease'
                }}
                aria-label={
                  estadoAsistente === 'escuchando'
                    ? 'Detener micrófono'
                    : estadoAsistente === 'hablando'
                    ? 'Detener locución'
                    : 'Hablar con la Guía'
                }
              >
                {estadoAsistente === 'procesando' ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : estadoAsistente === 'hablando' ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="voice-audio-bars">
                    <rect className="sound-wave-bar bar-1" x="4" y="4" width="3.2" height="16" rx="1.6" />
                    <rect className="sound-wave-bar bar-2" x="10.4" y="4" width="3.2" height="16" rx="1.6" />
                    <rect className="sound-wave-bar bar-3" x="16.8" y="4" width="3.2" height="16" rx="1.6" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                )}
              </button>

              <span style={{ marginTop: '0.6rem', fontSize: '0.78rem', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155', textAlign: 'center' }}>
                {estadoAsistente === 'escuchando'
                  ? 'Te escuchamos... Di tu pregunta en voz alta'
                  : estadoAsistente === 'procesando'
                  ? 'Gemini pensando respuesta cívica...'
                  : estadoAsistente === 'hablando'
                  ? 'Guía leyendo respuesta en voz alta'
                  : 'Toca el micrófono para hablar'}
              </span>
            </div>

            {/* Controles de Voz: Detener Locución y Silenciar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={detenerLocucion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#FCA5A5',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                  <span>Detener Lectura</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!silenciado && isSpeaking) stop();
                  setSilenciado(!silenciado);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: silenciado ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  border: silenciado ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: silenciado ? '#FDE047' : (isDark ? '#CBD5E1' : '#475569'),
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
                title={silenciado ? 'Activar voz' : 'Silenciar locución de voz'}
              >
                {silenciado ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
                <span>{silenciado ? 'Voz Silenciada' : 'Silenciar'}</span>
              </button>
            </div>

            {/* Transcripción en vivo */}
            {transcripcionEnVivo && (
              <div
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  fontSize: '0.8rem',
                  color: '#BAE6FD',
                  marginBottom: '0.75rem',
                  boxSizing: 'border-box'
                }}
              >
                <strong>Tú dijiste:</strong> "{transcripcionEnVivo}"
              </div>
            )}

            {/* Aviso de error o soporte */}
            {errorAsistente && (
              <div
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: '0.78rem',
                  color: '#FCA5A5',
                  marginBottom: '0.75rem',
                  boxSizing: 'border-box'
                }}
              >
                {errorAsistente}
              </div>
            )}

            {/* Tarjeta de Respuesta de Gemini */}
            {respuestaVoz && (
              <div
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : '#F1F5F9',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  fontSize: '0.84rem',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  lineHeight: 1.5,
                  marginBottom: '0.85rem',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(168, 85, 247, 0.2)',
                      color: '#D8B4FE',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}
                  >
                    Generado por IA • {respuestaVoz.modelo}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    {respuestaVoz.latenciaMs} ms
                  </span>
                </div>

                <div style={{ margin: '0.35rem 0' }}>{respuestaVoz.texto}</div>

                {/* Botón de Navegación si se detectó una ruta de destino */}
                {respuestaVoz.rutaDestino && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(respuestaVoz.rutaDestino);
                        cerrarAsistente();
                      }}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: '#002B7F',
                        border: '1px solid #001489',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 12px rgba(0, 43, 127, 0.3)'
                      }}
                    >
                      <span>Ir a {respuestaVoz.nombreRuta || respuestaVoz.rutaDestino}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Entrada alternativa de texto (fallback para teclado / sin micrófono) */}
            <form onSubmit={handleConsultarPorTexto} style={{ width: '100%', display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
              <input
                type="text"
                value={consultaTexto}
                onChange={(e) => setConsultaTexto(e.target.value)}
                placeholder="O escribe tu duda cívica aquí..."
                disabled={estadoAsistente === 'procesando'}
                maxLength={250}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={estadoAsistente === 'procesando' || !consultaTexto.trim()}
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: '#7C3AED',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: (estadoAsistente === 'procesando' || !consultaTexto.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (!consultaTexto.trim()) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Enviar consulta escrita"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
