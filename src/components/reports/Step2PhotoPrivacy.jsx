import React, { useState, useRef } from 'react';
import { compressImage } from './imageCompressor';

export default function Step2PhotoPrivacy({
  photoData,
  onPhotoProcessed,
  onClearPhoto,
  consentLaw8968,
  onToggleConsent
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const result = await compressImage(file);
      onPhotoProcessed(result);
    } catch (err) {
      console.error('[Compresor]', err);
      setErrorMsg(err.message || 'Error al comprimir la imagen en el cliente.');
    } finally {
      setIsProcessing(false);
      // Resetear inputs para permitir seleccionar el mismo archivo si es necesario
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.4)' }}>
          PASO 2 DE 4 &bull; EVIDENCIA FOTOGRÁFICA Y PRIVACIDAD
        </span>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginTop: '0.6rem',
          marginBottom: '0.35rem'
        }}>
          Evidencia Digital y Cumplimiento Normativo Ley N° 8968
        </h3>
        <p style={{ color: '#CBD5E1', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto' }}>
          La imagen se optimiza automáticamente en el navegador a formato WebP de alta definición con un peso garantizado menor a 1 MB.
        </p>
      </div>

      {/* Zona de Carga / Previsualización */}
      <div
        className="civic-glass-card"
        style={{
          padding: '2rem',
          marginBottom: '1.75rem',
          border: photoData ? '1px solid rgba(0, 209, 102, 0.4)' : '2px dashed rgba(255, 255, 255, 0.25)',
          backgroundColor: photoData ? 'rgba(0, 15, 45, 0.65)' : 'rgba(0, 8, 25, 0.45)',
          textAlign: 'center',
          borderRadius: '20px'
        }}
      >
        {/* Inputs ocultos de carga */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="archivo-galeria-input"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="camara-movil-input"
        />

        {isProcessing && (
          <div style={{ padding: '2.5rem 1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              border: '4px solid rgba(121, 166, 255, 0.2)',
              borderTopColor: '#79a6ff',
              borderRadius: '50%',
              margin: '0 auto 1.25rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700 }}>
              Procesando y Comprimiendo Imagen en Cliente...
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.4rem', fontFamily: 'var(--font-telemetry)' }}>
              HTML5 Canvas API &bull; WebP/JPEG &bull; Máx 1920x1080 &bull; &lt; 1 MB
            </p>
          </div>
        )}

        {!isProcessing && !photoData && (
          <div style={{ padding: '1.5rem 1rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 43, 127, 0.35)',
              border: '1px solid rgba(121, 166, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              margin: '0 auto 1.25rem'
            }}>
              📸
            </div>

            <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '0.5rem' }}>
              Adjuntar Fotografía de la Avería
            </h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Capture la incidencia en el sitio o seleccione una imagen de su galería. La compresión automática preserva la nitidez del daño.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                className="btn-sovereign"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                📷 Usar Cámara del Móvil
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="btn-glass-secondary"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                📁 Seleccionar de Galería
              </button>
            </div>
          </div>
        )}

        {/* Previsualización y Telemetría de Compresión */}
        {!isProcessing && photoData && (
          <div>
            <div style={{
              maxWidth: '480px',
              margin: '0 auto 1.5rem',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0, 4, 13, 0.7)'
            }}>
              <img
                src={photoData.dataUrl}
                alt="Evidencia fotográfica comprimida"
                style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', display: 'block' }}
              />

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0.6rem 1rem',
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 209, 102, 0.2)', color: '#00D166', borderColor: '#00D166' }}>
                  ✓ MENOR A 1 MB ({photoData.compressedSizeFormatted})
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-telemetry)' }}>
                  {photoData.dimensiones}
                </span>
              </div>
            </div>

            {/* Ficha de Telemetría Técnica */}
            <div style={{
              maxWidth: '540px',
              margin: '0 auto 1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>PESO ORIGINAL</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--font-telemetry)' }}>
                  {photoData.originalSizeFormatted}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 209, 102, 0.1)',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(0, 209, 102, 0.25)'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#00D166' }}>PESO FINAL</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#00D166', fontFamily: 'var(--font-telemetry)' }}>
                  {photoData.compressedSizeFormatted}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>COMPRESIÓN</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#79a6ff', fontFamily: 'var(--font-telemetry)' }}>
                  {photoData.compressionRatio}
                </div>
              </div>
            </div>

            {/* Botón para cambiar foto */}
            <button
              type="button"
              onClick={onClearPhoto}
              className="btn-glass-secondary"
              style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
            >
              🔄 Tomar o Seleccionar Otra Fotografía
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(218, 41, 28, 0.15)',
            border: '1px solid #DA291C',
            borderRadius: '8px',
            color: '#FF6B6B',
            fontSize: '0.85rem'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* Advertencia de Privacidad y Consentimiento Informado (Ley N° 8968) */}
      <div
        className="civic-glass-card"
        style={{
          padding: '1.5rem',
          borderLeft: '4px solid #F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🛡️</span>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem' }}>
              Aviso Normativo y Protección de Datos Personales (Ley N° 8968)
            </h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.6 }}>
              De conformidad con la <strong>Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley N° 8968)</strong> de la República de Costa Rica,
              le solicitamos verificar que la evidencia fotográfica <strong>NO exponga rostros reconocibles de personas (especialmente menores de edad) ni placas de vehículos legibles</strong>.
            </p>
          </div>
        </div>

        {/* Checkbox de Consentimiento Informado Obligatorio */}
        <label
          htmlFor="consentimiento-ley8968"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            backgroundColor: consentLaw8968 ? 'rgba(0, 209, 102, 0.12)' : 'rgba(0, 0, 0, 0.35)',
            border: consentLaw8968 ? '1px solid rgba(0, 209, 102, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="checkbox"
            id="consentimiento-ley8968"
            checked={consentLaw8968}
            onChange={onToggleConsent}
            style={{
              width: '18px',
              height: '18px',
              accentColor: '#00D166',
              marginTop: '0.2rem',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.84rem', color: consentLaw8968 ? '#FFFFFF' : '#E2E8F0', lineHeight: 1.5 }}>
            <strong>Declaro bajo fe de juramento</strong> que la evidencia fotográfica adjunta no expone rostros de menores de edad, datos sensibles de terceros ni placas vehiculares legibles, autorizando su procesamiento exclusivamente para la fiscalización ciudadana y atención técnica de esta avería.
          </span>
        </label>
      </div>
    </div>
  );
}
