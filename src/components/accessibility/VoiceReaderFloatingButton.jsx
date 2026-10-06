import React from 'react';
import { Volume2, Square } from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';
import { IDIOMAS_SOPORTADOS } from './accessibilityData';
import { useTheme } from '../../context/ThemeContext';

/**
 * Banner Accesible Flotante de Subtítulos de Lectura en Voz Alta (TTS Web Speech API)
 * Sincronizado en tiempo real cuando la voz asistida o lectura activa está en curso.
 */
export default function VoiceReaderFloatingButton() {
  const {
    isSpeaking,
    currentSubtitle,
    stopSpeaking,
    selectedLang,
    voiceGender
  } = useAccessibility();
  const { isDark } = useTheme?.() || { isDark: true };

  const activeLangObj = IDIOMAS_SOPORTADOS.find((i) => i.codigo === selectedLang) || IDIOMAS_SOPORTADOS[0];

  return (
    <>
      {/* Subtítulo flotante sincronizado en tiempo real cuando la voz está activa */}
      {isSpeaking && currentSubtitle && (
        <aside
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '86px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '92vw',
            width: '640px',
            backgroundColor: isDark ? 'rgba(0, 8, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark ? '2px solid #79a6ff' : '2px solid #002B7F',
            borderRadius: '16px',
            padding: '0.85rem 1.25rem',
            boxShadow: isDark
              ? '0 12px 40px rgba(0, 4, 13, 0.9), 0 0 25px rgba(0, 43, 127, 0.5)'
              : '0 12px 36px rgba(0, 43, 127, 0.22), 0 2px 10px rgba(0, 0, 0, 0.08)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: isDark ? '#00D166' : '#15803D',
              boxShadow: isDark ? '0 0 10px #00D166' : '0 0 8px rgba(21, 128, 61, 0.5)',
              animation: 'pulse 1s infinite',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, fontSize: '0.9rem', color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: 600, lineHeight: 1.45 }}>
            <span style={{ fontSize: '0.74rem', color: isDark ? '#79a6ff' : '#002B7F', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2px', fontWeight: 700 }}>
              <Volume2 size={13} color={isDark ? '#79a6ff' : '#002B7F'} />
              <span>Narración Asistida Activa ({activeLangObj.nativo} &bull; {voiceGender === 'female' ? 'Mujer' : 'Hombre'}):</span>
            </span>
            {currentSubtitle}
          </div>
          <button
            type="button"
            onClick={stopSpeaking}
            aria-label="Detener locución"
            style={{
              backgroundColor: isDark ? 'rgba(218, 41, 28, 0.25)' : '#FEF2F2',
              border: isDark ? '1px solid #DA291C' : '1px solid #DC2626',
              color: isDark ? '#FF8080' : '#B91C1C',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Square size={12} />
            <span>Detener</span>
          </button>
        </aside>
      )}
    </>
  );
}
