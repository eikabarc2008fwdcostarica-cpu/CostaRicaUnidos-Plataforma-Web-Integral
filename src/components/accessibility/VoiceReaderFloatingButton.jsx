import React from 'react';
import { Volume2, Square } from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';
import { IDIOMAS_SOPORTADOS } from './accessibilityData';

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
            backgroundColor: 'rgba(0, 8, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid #79a6ff',
            borderRadius: '16px',
            padding: '0.85rem 1.25rem',
            boxShadow: '0 12px 40px rgba(0, 4, 13, 0.9), 0 0 25px rgba(0, 43, 127, 0.5)',
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
              backgroundColor: '#00D166',
              boxShadow: '0 0 10px #00D166',
              animation: 'pulse 1s infinite',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600, lineHeight: 1.45 }}>
            <span style={{ fontSize: '0.74rem', color: '#79a6ff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2px' }}>
              <Volume2 size={13} color="#79a6ff" />
              <span>Narración Asistida Activa ({activeLangObj.nativo} &bull; {voiceGender === 'female' ? 'Mujer' : 'Hombre'}):</span>
            </span>
            {currentSubtitle}
          </div>
          <button
            type="button"
            onClick={stopSpeaking}
            aria-label="Detener locución"
            style={{
              backgroundColor: 'rgba(218, 41, 28, 0.25)',
              border: '1px solid #DA291C',
              color: '#FF8080',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
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
