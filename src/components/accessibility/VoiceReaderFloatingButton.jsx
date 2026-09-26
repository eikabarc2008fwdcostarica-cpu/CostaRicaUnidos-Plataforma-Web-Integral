import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from './AccessibilityContext';
import { IDIOMAS_SOPORTADOS } from './accessibilityData';

/**
 * Botón Accesible Flotante de Lectura en Voz Alta (TTS Web Speech API)
 * Incluye selector de los 8 idiomas oficiales, género (masculino/femenino) y narración accesible.
 */
export default function VoiceReaderFloatingButton() {
  const {
    isSpeaking,
    currentSubtitle,
    stopSpeaking,
    readCurrentPage,
    speakText,
    selectedLang,
    setSelectedLang,
    voiceGender,
    setVoiceGender,
    openOnboarding
  } = useAccessibility();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const configRef = useRef(null);

  // Cerrar panel de configuración con Escape o clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (configRef.current && !configRef.current.contains(e.target)) {
        setIsConfigOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape' && isConfigOpen) {
        setIsConfigOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isConfigOpen]);

  const activeLangObj = IDIOMAS_SOPORTADOS.find((i) => i.codigo === selectedLang) || IDIOMAS_SOPORTADOS[0];

  const handleTestVoice = () => {
    const testPhrases = {
      'es-419': 'Saludos. Esta es la voz asistida oficial de Costa Rica Unidos.',
      'es-ES': 'Saludos. Esta es la voz asistida oficial de Costa Rica Unidos.',
      'en-US': 'Greetings. This is the official assisted voice of Costa Rica Unidos.',
      'zh-CN': '您好。这是哥斯达黎加联合官方语音助手。',
      'pt-BR': 'Olá. Esta é a voz assistida oficial de Costa Rica Unidos.',
      'fr-FR': 'Bonjour. Ceci est la voix d’assistance officielle de Costa Rica Unidos.',
      'ru-RU': 'Здравствуйте. Это официальный голосовой ассистент Costa Rica Unidos.',
      'ja-JP': 'こんにちは。コスタリカ連合の公式音声アシスタントです。'
    };

    speakText(testPhrases[selectedLang] || testPhrases['es-419']);
  };

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
            <span style={{ fontSize: '0.74rem', color: '#79a6ff', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              🔊 Narración Asistida Activa ({activeLangObj.nativo} &bull; {voiceGender === 'female' ? 'Mujer' : 'Hombre'}):
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
              fontSize: '0.78rem'
            }}
          >
            ⏹️ Detener
          </button>
        </aside>
      )}

      {/* Controles Flotantes en la Esquina Inferior Derecha */}
      <div
        ref={configRef}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {/* Panel de Configuración de Voz e Idioma */}
        {isConfigOpen && (
          <div
            role="dialog"
            aria-label="Configuración de Voz y Lenguaje Universal"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              right: 0,
              width: '320px',
              backgroundColor: 'rgba(0, 8, 30, 0.96)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(121, 166, 255, 0.35)',
              borderRadius: '18px',
              padding: '1.25rem',
              boxShadow: '0 20px 50px rgba(0, 4, 13, 0.95), 0 0 25px rgba(0, 43, 127, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              color: '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#79a6ff', textTransform: 'uppercase' }}>
                🌐 Voz e Idiomas (8 Oficiales)
              </span>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                aria-label="Cerrar ajustes de voz"
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            {/* Selector de los 8 Idiomas Oficiales */}
            <div>
              <label htmlFor="select-tts-lang" style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '0.35rem', fontWeight: 700 }}>
                Seleccionar Idioma de Lectura:
              </label>
              <select
                id="select-tts-lang"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(121, 166, 255, 0.3)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {IDIOMAS_SOPORTADOS.map((item) => (
                  <option key={item.codigo} value={item.codigo} style={{ backgroundColor: '#00081E', color: '#FFFFFF' }}>
                    {item.bandera} {item.nombre} ({item.nativo})
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Género de Voz: Femenina / Masculina */}
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '0.4rem', fontWeight: 700 }}>
                Género de la Voz Asistida:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setVoiceGender('female')}
                  aria-pressed={voiceGender === 'female'}
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    backgroundColor: voiceGender === 'female' ? '#001489' : 'rgba(255, 255, 255, 0.05)',
                    border: voiceGender === 'female' ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>👩</span>
                  <span>Femenina</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceGender('male')}
                  aria-pressed={voiceGender === 'male'}
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    backgroundColor: voiceGender === 'male' ? '#001489' : 'rgba(255, 255, 255, 0.05)',
                    border: voiceGender === 'male' ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>👨</span>
                  <span>Masculina</span>
                </button>
              </div>
            </div>

            {/* Acciones del Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.25rem' }}>
              <button
                type="button"
                onClick={handleTestVoice}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.55rem',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>🧪</span>
                <span>Probar Muestra de Voz</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsConfigOpen(false);
                  openOnboarding();
                }}
                style={{
                  backgroundColor: '#DA291C',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(218, 41, 28, 0.4)'
                }}
              >
                <span>✨</span>
                <span>Iniciar Recorrido Guiado por Voz</span>
              </button>
            </div>
          </div>
        )}

        {/* Botón de Engranaje de Ajustes */}
        <button
          type="button"
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          aria-expanded={isConfigOpen}
          aria-haspopup="dialog"
          aria-label="Configurar idioma y género de voz asistida"
          title="Configurar voz e idioma (8 disponibles)"
          style={{
            backgroundColor: 'rgba(0, 8, 30, 0.9)',
            border: '1px solid rgba(121, 166, 255, 0.4)',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '1.15rem',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 4, 13, 0.8)',
            transition: 'all 0.2s ease'
          }}
        >
          ⚙️
        </button>

        {/* Botón Principal Flotante con Icono de Altavoz */}
        <button
          type="button"
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
            } else {
              readCurrentPage();
            }
          }}
          aria-label={isSpeaking ? 'Detener lectura en voz alta' : 'Leer contenido textual de la página en voz alta'}
          title={isSpeaking ? 'Detener lectura en voz alta' : 'Leer página en voz alta con Web Speech API'}
          style={{
            backgroundColor: isSpeaking ? '#DC2626' : '#001489',
            border: isSpeaking ? '2px solid #EF4444' : '2px solid #79a6ff',
            borderRadius: '999px',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            boxShadow: isSpeaking
              ? '0 0 25px rgba(220, 38, 38, 0.7)'
              : '0 10px 30px rgba(0, 20, 137, 0.6), 0 0 15px rgba(121, 166, 255, 0.4)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: isSpeaking ? 'pulse 1.2s infinite' : 'none'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{isSpeaking ? '⏹️' : '🔊'}</span>
          <span>{isSpeaking ? 'Detener' : 'Leer en Voz Alta'}</span>
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-telemetry, monospace)'
            }}
          >
            {activeLangObj.bandera}
          </span>
        </button>
      </div>
    </>
  );
}
