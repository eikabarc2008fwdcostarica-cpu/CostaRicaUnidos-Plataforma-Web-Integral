import React, { FC, useState, useRef, useEffect, ChangeEvent } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  FileMusic,
  Maximize2
} from 'lucide-react';
import { HimnoOficial, EstrofaHimno } from '../../data/culturaData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';
import { CivicButton } from '../common/CivicButton';
import { CivicModal } from '../common/CivicModal';
import { useCivicModal } from '../../context/CivicModalContext';

export interface HimnoPlayerProps {
  himno: HimnoOficial;
}

export const HimnoPlayer: FC<HimnoPlayerProps> = ({ himno }) => {
  const { mostrarAlerta } = useCivicModal();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(75);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPartituraModal, setShowPartituraModal] = useState<boolean>(false);

  // Formato MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Manejar restricciones de autoplay
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const jumpToEstrofa = (estrofa: EstrofaHimno) => {
    if (audioRef.current) {
      audioRef.current.currentTime = estrofa.inicioSegundos;
      setCurrentTime(estrofa.inicioSegundos);
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Identificar qué estrofa está activa según el timestamp actual
  const estrofaActivaId = himno.estrofas.find(
    (est) => currentTime >= est.inicioSegundos && currentTime <= est.finSegundos
  )?.id;

  return (
    <CivicCard level={2} provincialGlow>
      {/* Elemento de Audio HTML5 Oculto */}
      <audio
        ref={audioRef}
        src={himno.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Cabecera del Himno */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <CivicBadge variant="provincial" size="sm">
                HIMNO OFICIAL CANTONAL
              </CivicBadge>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Declaratoria: {himno.annoDeclaratoria}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-headline, serif)",
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0
              }}
            >
              {himno.titulo} &bull; Cantón de {himno.cantonNombre}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', margin: '0.35rem 0 0 0' }}>
              <strong>Letra: </strong> {himno.autorLetra} &bull; <strong>Música: </strong> {himno.autorMusica}
            </p>
          </div>

          <CivicButton
            variant="secondary"
            size="sm"
            leftIcon={<FileMusic size={16} color="#7DD3FC" />}
            onClick={() => setShowPartituraModal(true)}
            aria-label="Ver partitura oficial en alta resolución"
          >
            Ver Partitura Oficial
          </CivicButton>
        </div>

        {/* Consola Multimedia de Reproducción */}
        <div
          style={{
            background: 'rgba(0, 4, 13, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Barra de Progreso / Scrubber */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem', fontFamily: "var(--font-telemetry, monospace)" }}>
              <span style={{ color: '#FFFFFF' }}>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Progreso de reproducción del himno"
              style={{
                width: '100%',
                height: '6px',
                accentColor: 'var(--color-provincial-primary, #002B7F)',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Controles Principales */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Botón Play/Pause */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar himno' : 'Reproducir himno'}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--color-provincial-primary, #002B7F)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'var(--glow-provincial, 0 4px 14px rgba(0, 43, 127, 0.5))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '3px' }} />}
              </button>

              {/* Botón Reiniciar */}
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                aria-label="Reiniciar himno al principio"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={16} />
              </button>

              <span style={{ fontSize: '0.85rem', color: '#CBD5E1', marginLeft: '0.5rem' }}>
                {isPlaying ? 'Reproduciendo audio oficial...' : 'Listo para reproducir'}
              </span>
            </div>

            {/* Control de Volumen */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volumen del audio"
                style={{
                  width: '80px',
                  height: '4px',
                  accentColor: '#7DD3FC',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </div>

        {/* Letra Sincronizada en Tiempo Real (Teleprompter / Resaltador Cívico) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Music size={18} color="#7DD3FC" />
              Letra Sincronizada en Tiempo Real
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Haga clic en cualquier estrofa para saltar en el audio
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem'
            }}
          >
            {himno.estrofas.map((estrofa) => {
              const estaActiva = estrofa.id === estrofaActivaId;
              return (
                <div
                  key={estrofa.id}
                  onClick={() => jumpToEstrofa(estrofa)}
                  style={{
                    background: estaActiva
                      ? 'rgba(0, 43, 127, 0.35)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: estaActiva
                      ? '2px solid #7DD3FC'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: estaActiva ? '0 0 25px rgba(125, 211, 252, 0.35)' : 'none',
                    transform: estaActiva ? 'scale(1.02)' : 'scale(1)'
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      jumpToEstrofa(estrofa);
                    }
                  }}
                  aria-label={`Saltar a ${estrofa.tipo.toUpperCase()} (inicio en ${formatTime(estrofa.inicioSegundos)})`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <CivicBadge variant={estrofa.tipo === 'coro' ? 'warning' : 'default'} size="sm">
                      {estrofa.tipo.toUpperCase()}
                    </CivicBadge>
                    <span style={{ fontFamily: "var(--font-telemetry, monospace)", fontSize: '0.75rem', color: '#94A3B8' }}>
                      {formatTime(estrofa.inicioSegundos)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {estrofa.versos.map((verso, i) => (
                      <p
                        key={i}
                        style={{
                          margin: 0,
                          fontSize: estaActiva ? '0.98rem' : '0.9rem',
                          fontWeight: estaActiva ? 700 : 500,
                          color: estaActiva ? '#FFFFFF' : '#CBD5E1',
                          lineHeight: 1.5,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {verso}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Accesible de Partitura Oficial */}
      <CivicModal
        isOpen={showPartituraModal}
        onClose={() => setShowPartituraModal(false)}
        size="lg"
        title="Partitura Oficial del Himno Cantonal"
        description={`Registro Histórico Musical • Partitura de ${himno.autorMusica} (${himno.annoDeclaratoria})`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Ficha Técnica de la Partitura */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.85rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.825rem'
            }}
          >
            <div>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>Tonalidad:</span>
              <strong style={{ color: '#7DD3FC' }}>Sol Mayor (G Maj)</strong>
            </div>
            <div>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>Compás:</span>
              <strong style={{ color: '#FFFFFF' }}>4/4 (C)</strong>
            </div>
            <div>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>Tempo:</span>
              <strong style={{ color: '#A7F3D0' }}>Maestoso &bull; 108 BPM</strong>
            </div>
            <div>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>Instrumentación:</span>
              <strong style={{ color: '#FFFFFF' }}>Banda Municipal & Coro</strong>
            </div>
          </div>

          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1.5px solid rgba(255, 255, 255, 0.15)' }}>
            <img
              src={himno.partituraUrl}
              alt={`Partitura oficial del ${himno.titulo}`}
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Archivo Histórico Cantonal &bull; Custodia bajo la Ley N° 7210 de Archivo Nacional.
            </span>

            <CivicButton
              variant="provincial"
              size="sm"
              onClick={() => {
                mostrarAlerta({
                  titulo: 'Descarga de Partitura Oficial',
                  mensaje: `Descargando partitura oficial de "${himno.titulo}" certificada por el Gobierno Local y custodiada bajo la Ley N° 7210 de Archivo Nacional.`,
                  icono: 'exito'
                });
              }}
              leftIcon={<FileMusic size={16} />}
            >
              Descargar Partitura Oficial (PDF)
            </CivicButton>
          </div>
        </div>
      </CivicModal>
    </CivicCard>
  );
};

export default HimnoPlayer;
