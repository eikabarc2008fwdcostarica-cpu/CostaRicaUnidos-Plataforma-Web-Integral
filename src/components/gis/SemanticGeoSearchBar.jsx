import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Radio, Mic, Loader2, Zap, AlertTriangle, Lightbulb, Search } from 'lucide-react';
import {
  procesarConsultaSemantica,
  obtenerSugerenciasPopulares,
  SpeechRecognitionService
} from '../../services/geoSemanticNlpService';
import { useCivicModal } from '../../context/CivicModalContext';

/**
 * Componente: Barra de Búsqueda Semántica Inteligente en Lenguaje Natural
 * Soporta entrada de texto, sugerencias rápidas costarricenses y dictado por voz (SpeechRecognition).
 */
export default function SemanticGeoSearchBar({
  onQueryResult,
  initialQuery = '',
  placeholder = 'Consulte en lenguaje natural: ej. "Clínicas cerca de colegios técnicos en San Carlos"...',
  variant = 'map' // 'map' | 'hero'
}) {
  const { mostrarAlerta } = useCivicModal();
  const [query, setQuery] = useState(initialQuery);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const speechServiceRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar Speech Recognition
  useEffect(() => {
    const service = new SpeechRecognitionService({
      onStart: () => {
        setIsListening(true);
        setSpeechError(null);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onResult: (transcript) => {
        setQuery(transcript);
        handleExecuteSearch(transcript);
      },
      onError: (err) => {
        setIsListening(false);
        setSpeechError(`Error de micrófono: ${err}`);
      }
    });

    speechServiceRef.current = service;
    setSpeechSupported(service.isSupported());
  }, []);

  // Procesar búsqueda
  const handleExecuteSearch = (textToSearch) => {
    const targetText = textToSearch !== undefined ? textToSearch : query;
    if (!targetText || targetText.trim().length === 0) return;

    setIsProcessing(true);

    // Procesamiento fluido y no bloqueante
    setTimeout(() => {
      const result = procesarConsultaSemantica(targetText);
      setIsProcessing(false);
      if (onQueryResult) {
        onQueryResult(result);
      }
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecuteSearch();
    }
  };

  const handleToggleVoice = () => {
    if (!speechSupported) {
      mostrarAlerta({
        titulo: 'Dictado No Compatible',
        mensaje: 'El reconocimiento de voz por micrófono no es compatible con este navegador. Por favor utilice la entrada de texto.',
        icono: 'advertencia'
      });
      return;
    }

    if (isListening) {
      speechServiceRef.current?.stop();
    } else {
      const started = speechServiceRef.current?.start();
      if (!started) {
        setSpeechError('No se pudo acceder al micrófono.');
      }
    }
  };

  const handleSelectSuggestion = (sugerencia) => {
    setQuery(sugerencia);
    handleExecuteSearch(sugerencia);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSpeechError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const sugerencias = obtenerSugerenciasPopulares();

  return (
    <div
      role="search"
      aria-label="Buscador Semántico Geoespacial con IA"
      style={{
        width: '100%',
        maxWidth: variant === 'hero' ? '920px' : '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 40
      }}
    >
      {/* Caja de Búsqueda Principal */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 8, 30, 0.85)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '16px',
          border: isListening
            ? '2px solid #EF4444'
            : isProcessing
            ? '2px solid #79a6ff'
            : '1px solid rgba(121, 166, 255, 0.35)',
          padding: '0.4rem 0.6rem 0.4rem 1.1rem',
          boxShadow: isListening
            ? '0 0 25px rgba(239, 68, 68, 0.5)'
            : '0 12px 35px rgba(0, 4, 13, 0.8), 0 0 20px rgba(0, 43, 127, 0.25)',
          transition: 'var(--transition-smooth)',
          gap: '0.75rem'
        }}
      >
        {/* Distintivo de Inteligencia Artificial Cívica */}
        <div
          title="Motor de Lenguaje Natural Costa Rica Unidos AI"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(0, 20, 137, 0.5)',
            border: '1px solid rgba(121, 166, 255, 0.4)',
            padding: '0.3rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#79a6ff',
            letterSpacing: '0.04em',
            flexShrink: 0
          }}
        >
          <Sparkles size={14} color="#79a6ff" />
          <span>IA NLP</span>
        </div>

        {/* Input de Texto */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Consulta en lenguaje natural sobre servicios y lugares de Costa Rica"
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '0.98rem',
            fontWeight: 500,
            fontFamily: 'inherit',
            minWidth: '180px'
          }}
        />

        {/* Botón de Limpiar */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Borrar texto de búsqueda"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cru-text-muted)',
              cursor: 'pointer',
              padding: '0.3rem 0.5rem',
              fontSize: '1rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}

        {/* Botón de Dictado por Voz (Micrófono) */}
        <button
          type="button"
          onClick={handleToggleVoice}
          aria-label={isListening ? 'Detener dictado por voz' : 'Iniciar dictado por voz en español costarricense'}
          title={speechSupported ? 'Dictar consulta por voz (es-CR)' : 'Dictado por voz no disponible'}
          style={{
            backgroundColor: isListening ? '#DC2626' : 'rgba(255, 255, 255, 0.08)',
            border: isListening ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            borderRadius: '10px',
            padding: '0.55rem 0.85rem',
            cursor: speechSupported ? 'pointer' : 'not-allowed',
            opacity: speechSupported ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            transition: 'var(--transition-smooth)',
            boxShadow: isListening ? '0 0 14px rgba(220, 38, 38, 0.8)' : 'none',
            animation: isListening ? 'pulse 1.2s infinite' : 'none',
            flexShrink: 0
          }}
        >
          {isListening ? <Radio size={15} color="#FFFFFF" /> : <Mic size={15} />}
          <span style={{ display: isListening ? 'inline' : 'none' }}>Escuchando...</span>
        </button>

        {/* Botón de Acción Principal de Búsqueda */}
        <button
          type="button"
          onClick={() => handleExecuteSearch()}
          disabled={isProcessing}
          aria-label="Ejecutar consulta semántica con IA"
          style={{
            backgroundColor: '#DA291C',
            border: 'none',
            borderRadius: '10px',
            padding: '0.58rem 1.25rem',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: isProcessing ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'var(--transition-smooth)',
            boxShadow: '0 4px 14px rgba(218, 41, 28, 0.45)',
            flexShrink: 0
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Interpretando...</span>
            </>
          ) : (
            <>
              <Zap size={16} />
              <span>Explorar con IA</span>
            </>
          )}
        </button>
      </div>

      {/* Alerta de Error de Reconocimiento de Voz */}
      {speechError && (
        <div
          role="alert"
          style={{
            marginTop: '0.5rem',
            padding: '0.4rem 0.85rem',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #DC2626',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <AlertTriangle size={14} color="#FCA5A5" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Sugerencias Rápidas Costarricenses (Pills Horizontales) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.35rem',
          scrollbarWidth: 'none'
        }}
      >
        <span
          style={{
            fontSize: '0.74rem',
            color: 'var(--cru-text-muted)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Lightbulb size={13} color="var(--cru-accent-amber)" />
          <span>Sugerencias:</span>
        </span>

        {sugerencias.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSuggestion(sug)}
            style={{
              backgroundColor: 'rgba(0, 20, 137, 0.25)',
              border: '1px solid rgba(121, 166, 255, 0.25)',
              borderRadius: '999px',
              color: 'var(--cru-border-strong)',
              padding: '0.28rem 0.75rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.6)';
              e.currentTarget.style.borderColor = '#79a6ff';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.25)';
              e.currentTarget.style.color = '#CBD5E1';
            }}
          >
            <Search size={12} color="#79a6ff" />
            <span>{sug}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
