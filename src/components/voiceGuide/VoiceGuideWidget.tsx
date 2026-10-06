import React, { useState, useEffect, useRef } from 'react';
import './VoiceGuideWidget.css';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { getCantonInstitutionalSummary } from './cantonSummaryHelper';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useTheme } from '../../context/ThemeContext';

export interface VoiceGuideWidgetProps {
  selectedCanton?: string;
  handleToggleVoice?: (e?: React.MouseEvent) => void;
  onToggleVoice?: (e?: React.MouseEvent) => void;
  handleStartTour?: () => void;
  onStartTour?: () => void;
  iniciarGuiaInteractiva?: () => void;
  isMinimized?: boolean;
  setIsMinimized?: (minimized: boolean) => void;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (open: boolean) => void;
  isAnalyzing?: boolean;
  className?: string;
}

/**
 * VoiceGuideWidget (Sovereign Civic Glass v2.1)
 * Componente flotante de voz con Web Speech API real, síntesis institucional cantonal,
 * cápsula unificada (Ajustes + Guía por Voz + Guía Interactiva + Minimizar).
 * Regla estricta: Cero emojis, toda la iconografía es SVG vectorial.
 */
export const VoiceGuideWidget: React.FC<VoiceGuideWidgetProps> = ({
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
}) => {
  const { isDark } = useTheme?.() || { isDark: true };

  // Manejo de estado interno o controlado para el modo minimizado
  const [internalMinimized, setInternalMinimized] = useState<boolean>(false);
  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;
  const setIsMinimized = controlledSetIsMinimized || setInternalMinimized;

  // Manejo de estado interno o controlado para el panel de ajustes
  const [internalSettingsOpen, setInternalSettingsOpen] = useState<boolean>(false);
  const isSettingsOpen = controlledSettingsOpen !== undefined ? controlledSettingsOpen : internalSettingsOpen;
  const setIsSettingsOpen = controlledSetIsSettingsOpen || setInternalSettingsOpen;

  // Usuario autenticado para fallback de cantón oficial
  let user: any = null;
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
  } catch {
    user = null;
  }

  // Sincronización reactiva del cantón territorial activo
  const [activeCanton, setActiveCanton] = useState<string>(() => {
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
    const handleCantonChange = (e: any) => {
      if (e.detail?.nombre) setActiveCanton(e.detail.nombre);
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, [propCanton]);

  const cantonActivo = activeCanton;
  const selectedCanton = propCanton || activeCanton || 'San José';

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

  // Detener locución si cambia el cantón territorial
  useEffect(() => {
    if (isSpeaking) {
      stop();
    }
  }, [selectedCanton]);

  // Acceso al Onboarding del AccessibilityContext si está disponible
  let openOnboarding: (() => void) | null = null;
  try {
    const a11y = useAccessibility();
    openOnboarding = a11y?.openOnboarding || null;
  } catch {
    openOnboarding = null;
  }

  // Manejador del clic en la pastilla principal de voz
  const handlePillClick = (e?: React.MouseEvent) => {
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
  const ejecutarGuiaDeRecuadros = (e?: React.MouseEvent) => {
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
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
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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

          {/* Botón para probar voz del sistema */}
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

          {/* Botón para iniciar recorrido interactivo con IA */}
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

      {/* 2. Botón de Guía (Destello + "Guía") */}
      <button
        type="button"
        onClick={ejecutarGuiaDeRecuadros}
        disabled={isAnalyzing}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 18px',
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
    </div>
  );
};

export default VoiceGuideWidget;
