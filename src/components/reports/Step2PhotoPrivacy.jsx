import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Check,
  Trash2,
  Eye,
  X,
  Video,
  FlipHorizontal,
  Sparkles
} from 'lucide-react';
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
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' o 'user'
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Detener la cámara al desmontar el componente
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Iniciar la transmisión de video cuando se activa la cámara
  const startCamera = async (mode = facingMode) => {
    setErrorMsg(null);

    // Detener cualquier stream anterior
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Su navegador no soporta el acceso a la cámara web.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setCameraStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn('Video play error:', err));
      }
    } catch (err) {
      console.error('[Webcam Error]:', err);
      let mensaje = 'No se pudo acceder a la cámara.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        mensaje = 'Permiso denegado para usar la cámara. Puede seleccionar una imagen desde su galería o archivos.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        mensaje = 'No se detectó ninguna cámara disponible en este dispositivo.';
      }
      setErrorMsg(mensaje);
      setIsCameraActive(false);
    }
  };

  // Alternar entre cámara frontal y trasera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Cerrar cámara
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Disparar y capturar el fotograma del video
  const capturePhoto = async () => {
    if (!videoRef.current) return;

    try {
      setIsProcessing(true);
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext('2d');
      // Si está en modo selfie, voltear horizontalmente
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir canvas a blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setErrorMsg('Error al capturar el fotograma de la cámara.');
            setIsProcessing(false);
            return;
          }

          stopCamera();

          try {
            const result = await compressImage(blob);
            onPhotoProcessed(result);
          } catch (err) {
            console.error('[Compresor]', err);
            setErrorMsg(err.message || 'Error al comprimir la fotografía.');
          } finally {
            setIsProcessing(false);
          }
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('[Capture Error]:', err);
      setErrorMsg('Ocurrió un error al disparar la cámara.');
      setIsProcessing(false);
    }
  };

  // Manejar selección de archivo desde disco/galería
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
      if (fileInputRef.current) fileInputRef.current.value = '';
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
          Capture en vivo con su cámara o cargue una fotografía de su galería. La compresión es 100% segura en el navegador a formato WebP optimizado (&lt; 1 MB).
        </p>
      </div>

      {/* Zona de Carga / Previsualización / Cámara en Vivo */}
      <div
        className="civic-glass-card"
        style={{
          padding: '2rem',
          marginBottom: '1.75rem',
          border: photoData ? '1px solid rgba(0, 209, 102, 0.4)' : isCameraActive ? '1px solid #79a6ff' : '2px dashed rgba(255, 255, 255, 0.22)',
          backgroundColor: photoData ? 'rgba(0, 15, 45, 0.65)' : 'rgba(0, 8, 25, 0.5)',
          textAlign: 'center',
          borderRadius: '24px',
          position: 'relative'
        }}
      >
        {/* Input oculto de selección de archivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="archivo-galeria-input"
        />

        {/* 1. ESTADO: Procesando compresión */}
        {isProcessing && (
          <div style={{ padding: '2.5rem 1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              border: '4px solid rgba(121, 166, 255, 0.2)',
              borderTopColor: '#79a6ff',
              borderRadius: '50%',
              margin: '0 auto 1.25rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800 }}>
              Optimizando y Comprimiendo Evidencia en el Navegador...
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.4rem', fontFamily: 'var(--font-telemetry)' }}>
              HTML5 Canvas API &bull; Formato WebP/JPEG &bull; Resolución Máx 1920x1080 &bull; &lt; 1 MB
            </p>
          </div>
        )}

        {/* 2. ESTADO: Visor de Cámara en Vivo con Disparador */}
        {isCameraActive && !isProcessing && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#000000',
              border: '1px solid rgba(121, 166, 255, 0.35)',
              boxShadow: '0 16px 40px rgba(0, 4, 13, 0.8)',
              aspectRatio: '16/9',
              minHeight: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                }}
              />

              {/* Guías de Encuadre de Cámara (Retícula) */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '20px',
                  border: '1px dashed rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  pointerEvents: 'none'
                }}
              />

              {/* Badge EN VIVO */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '14px',
                backgroundColor: 'rgba(218, 41, 28, 0.85)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', animation: 'pulse 1s infinite' }} />
                <span>CÁMARA EN VIVO</span>
              </div>

              {/* Alternar Cámara Frontal / Trasera */}
              <button
                type="button"
                onClick={toggleFacingMode}
                title="Cambiar orientación de cámara"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '14px',
                  backgroundColor: 'rgba(0, 4, 13, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <FlipHorizontal size={16} />
              </button>
            </div>

            {/* Barra de Controles de Disparo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <button
                type="button"
                onClick={stopCamera}
                className="btn-glass-secondary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}
              >
                Cancelar
              </button>

              {/* Botón Circular Disparador */}
              <button
                type="button"
                onClick={capturePhoto}
                aria-label="Disparar fotografía"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DA291C',
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 0 20px rgba(218, 41, 28, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF'
                }} />
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  fileInputRef.current?.click();
                }}
                className="btn-glass-secondary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ImageIcon size={15} />
                <span>Galería</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. ESTADO INICIAL: Botones para Activar Cámara o Galería */}
        {!isProcessing && !isCameraActive && !photoData && (
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
              margin: '0 auto 1.25rem'
            }}>
              <Camera size={34} color="#79a6ff" />
            </div>

            <h4 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.5rem' }}>
              Adjuntar Fotografía de la Avería
            </h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.5 }}>
              Active la cámara para capturar la incidencia en el sitio o seleccione una imagen de sus archivos. La compresión automática preserva la nitidez del daño.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => startCamera('environment')}
                className="btn-sovereign-blue"
                style={{
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#002B7F',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(121, 166, 255, 0.4)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Camera size={18} />
                <span>Usar Cámara Web / Dispositivo</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="btn-glass-secondary"
                style={{
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ImageIcon size={18} />
                <span>Seleccionar de Galería / Archivos</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. ESTADO: Visor de Previsualización de Imagen Capturada con Telemetría */}
        {!isProcessing && !isCameraActive && photoData && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Check size={18} color="#00D166" />
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#00D166' }}>
                Evidencia Fotográfica Verificada y Optimizada
              </span>
            </div>

            {/* Contenedor del Visor de Previsualización */}
            <div style={{
              maxWidth: '520px',
              margin: '0 auto 1.5rem',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              boxShadow: '0 20px 45px rgba(0, 4, 13, 0.85)'
            }}>
              <img
                src={photoData.dataUrl}
                alt="Evidencia fotográfica capturada"
                style={{
                  width: '100%',
                  maxHeight: '340px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Botón de Inspección Pantalla Completa */}
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                title="Ampliar previsualización"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0, 4, 13, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Eye size={16} />
              </button>

              {/* Barra inferior del visor */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(0, 4, 13, 0.88)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 209, 102, 0.2)', color: '#00D166', borderColor: '#00D166', fontSize: '0.75rem', fontWeight: 800 }}>
                  ✓ &lt; 1 MB ({photoData.compressedSizeFormatted})
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-telemetry)' }}>
                  {photoData.dimensiones} &bull; {photoData.formato?.split('/')[1]?.toUpperCase() || 'WEBP'}
                </span>
              </div>
            </div>

            {/* Ficha de Telemetría Técnica de Compresión */}
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
                padding: '0.65rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PESO ORIGINAL</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--font-telemetry)', marginTop: '2px' }}>
                  {photoData.originalSizeFormatted}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 209, 102, 0.1)',
                padding: '0.65rem',
                borderRadius: '10px',
                border: '1px solid rgba(0, 209, 102, 0.3)'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#00D166', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PESO FINAL</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#00D166', fontFamily: 'var(--font-telemetry)', marginTop: '2px' }}>
                  {photoData.compressedSizeFormatted}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '0.65rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>COMPRESIÓN</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#79a6ff', fontFamily: 'var(--font-telemetry)', marginTop: '2px' }}>
                  {photoData.compressionRatio}
                </div>
              </div>
            </div>

            {/* Acciones de Edición de Foto */}
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => startCamera('environment')}
                className="btn-glass-secondary"
                style={{
                  fontSize: '0.84rem',
                  padding: '0.5rem 1.1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  cursor: 'pointer'
                }}
              >
                <Camera size={14} />
                <span>Tomar Otra con Cámara</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-glass-secondary"
                style={{
                  fontSize: '0.84rem',
                  padding: '0.5rem 1.1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  cursor: 'pointer'
                }}
              >
                <ImageIcon size={14} />
                <span>Elegir de Galería</span>
              </button>

              <button
                type="button"
                onClick={onClearPhoto}
                style={{
                  fontSize: '0.84rem',
                  padding: '0.5rem 1.1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(218, 41, 28, 0.15)',
                  color: '#FF6B6B',
                  borderRadius: '10px',
                  border: '1px solid rgba(218, 41, 28, 0.4)',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={14} />
                <span>Eliminar Foto</span>
              </button>
            </div>
          </div>
        )}

        {/* Mensaje de Error en Carga */}
        {errorMsg && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1.2rem',
            backgroundColor: 'rgba(218, 41, 28, 0.18)',
            border: '1px solid #DA291C',
            borderRadius: '12px',
            color: '#FF6B6B',
            fontSize: '0.86rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Modal Lightbox de Previsualización Ampliada */}
      {showPreviewModal && photoData && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowPreviewModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 4, 13, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              backgroundColor: '#00040D',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
            }}
          >
            <div style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                Previsualización de Evidencia ({photoData.dimensiones})
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={photoData.dataUrl}
              alt="Evidencia ampliada"
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block', backgroundColor: '#000000' }}
            />
          </div>
        </div>
      )}

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
          <ShieldCheck size={26} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
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
            borderRadius: '12px',
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
