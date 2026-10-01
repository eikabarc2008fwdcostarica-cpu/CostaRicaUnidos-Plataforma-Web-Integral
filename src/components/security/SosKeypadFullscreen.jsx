import React, { useState } from 'react';
import { Siren, Shield, Flame, HeartPulse, Scale, Maximize2, PhoneCall, Flashlight, Megaphone, MapPin, Check, X } from 'lucide-react';

export const SOS_NUMEROS = [
  {
    id: '911',
    numero: '9-1-1',
    telHref: 'tel:911',
    titulo: 'Emergencias Nacionales 9-1-1',
    entidad: 'Sistema Nacional de Emergencias',
    descripcion: 'Línea unificada para riesgo de vida, rescate, accidentes mayores y siniestros.',
    color: '#DA291C',
    icono: Siren,
    prioridad: 'Crítica / Inmediata',
    bg: 'linear-gradient(135deg, #DA291C 0%, #8A0A00 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'policia',
    numero: '1117 / 2586-4000',
    telHref: 'tel:1117',
    titulo: 'Fuerza Pública / Policía Nacional',
    entidad: 'Ministerio de Seguridad Pública',
    descripcion: 'Seguridad ciudadana, asaltos, alteración del orden público y patrullaje.',
    color: '#002B7F',
    icono: Shield,
    prioridad: 'Orden Público',
    bg: 'linear-gradient(135deg, #002B7F 0%, #001240 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'bomberos',
    numero: '1118 / 2547-3700',
    telHref: 'tel:1118',
    titulo: 'Benemérito Cuerpo de Bomberos',
    entidad: 'Cuerpo de Bomberos de Costa Rica',
    descripcion: 'Incendios estructurales, forestales, escapes de gas y rescate en estructuras colapsadas.',
    color: '#F36717',
    icono: Flame,
    prioridad: 'Incendios & Materiales Peligrosos',
    bg: 'linear-gradient(135deg, #F36717 0%, #9C3800 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'cruzroja',
    numero: '1128 / 2528-0000',
    telHref: 'tel:1128',
    titulo: 'Cruz Roja Costarricense',
    entidad: 'Sociedad Nacional Cruz Roja',
    descripcion: 'Atención prehospitalaria, soporte de ambulancias, rescate acuático y de montaña.',
    color: '#CE1126',
    icono: HeartPulse,
    prioridad: 'Urgencias Médicas',
    bg: 'linear-gradient(135deg, #CE1126 0%, #6E000B 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'oij',
    numero: '800-8000-645',
    telHref: 'tel:8008000645',
    titulo: 'Organismo de Investigación Judicial (OIJ)',
    entidad: 'Poder Judicial de Costa Rica',
    descripcion: 'Línea Confidencial para denuncias de delitos, personas desaparecidas y crimen organizado.',
    color: '#F59E0B',
    icono: Scale,
    prioridad: 'Línea Confidencial OIJ',
    bg: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)',
    textColor: '#FFFFFF'
  }
];

export default function SosKeypadFullscreen() {
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [beaconFlash, setBeaconFlash] = useState(false);
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Sintetizador Web Audio API para simulación sonora de baliza SOS
  const toggleSirenSound = () => {
    if (isSirenOn) {
      setIsSirenOn(false);
      return;
    }

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
      setIsSirenOn(true);
      setTimeout(() => setIsSirenOn(false), 1200);
    } catch {
      setIsSirenOn(false);
    }
  };

  const handleShareGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const text = `EMERGENCIA COSTA RICA: Solicito auxilio en coordenadas GPS: Lat ${pos.coords.latitude.toFixed(5)}, Lng ${pos.coords.longitude.toFixed(5)} (Google Maps: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude})`;
        navigator.clipboard.writeText(text);
        setCopiedCoords(true);
        setTimeout(() => setCopiedCoords(false), 2500);
      });
    }
  };

  return (
    <section
      aria-label="Botonera Táctil de Emergencia SOS"
      style={{ marginBottom: '3rem' }}
    >
      {/* Cabecera con selector a Pantalla Completa */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <Siren size={24} color="#EF4444" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
              Botonera Táctil de Emergencia SOS
            </h3>
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
            Marcado telefónico directo con un solo toque y soporte para lectores de pantalla (WCAG 2.1 AA).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreenMode(true)}
          className="btn-sovereign"
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.92rem',
            fontWeight: 800,
            gap: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center'
          }}
          aria-label="Abrir botonera SOS en modo táctil a pantalla completa"
        >
          <Maximize2 size={16} />
          <span>Modo Pantalla Completa SOS</span>
        </button>
      </div>

      {/* Cuadrícula de Botones Táctiles de Gran Formato (Alto >= 64px) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {SOS_NUMEROS.map((sos) => (
          <a
            key={sos.id}
            href={sos.telHref}
            role="button"
            aria-label={`Llamar de emergencia a ${sos.titulo} al número ${sos.numero}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '68px', // Cumple ampliamente requisito >= 54px
              padding: '1.1rem 1.5rem',
              borderRadius: '18px',
              background: sos.bg,
              color: sos.textColor,
              textDecoration: 'none',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: `0 8px 25px ${sos.color}45`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 12px 35px ${sos.color}88`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = `0 8px 25px ${sos.color}45`;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {React.createElement(sos.icono, { size: 26, color: '#FFFFFF' })}
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  {sos.titulo}
                </h4>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.15rem' }}>
                  {sos.entidad} &bull; <span style={{ fontWeight: 700 }}>{sos.prioridad}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <PhoneCall size={16} />
                <span>{sos.numero.split(' /')[0]}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* MODAL / PANTALLA COMPLETA TÁCTIL DE EMERGENCIA SOS */}
      {isFullscreenMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Botonera SOS de Emergencia a Pantalla Completa"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            backgroundColor: beaconFlash ? '#FFFFFF' : '#00040D',
            color: beaconFlash ? '#000000' : '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            overflowY: 'auto',
            transition: 'background 0.15s ease'
          }}
        >
          {/* Barra Superior en Pantalla Completa */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Siren size={32} color="#EF4444" />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: beaconFlash ? '#000000' : '#FFFFFF' }}>
                  CENTRAL SOS DE EMERGENCIA A PANTALLA COMPLETA
                </h3>
                <span className="telemetry-badge" style={{ backgroundColor: 'rgba(218, 41, 28, 0.4)', color: '#FFFFFF' }}>
                  REPÚBLICA DE COSTA RICA &bull; MARCACIÓN DIRECTA
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsFullscreenMode(false);
                setBeaconFlash(false);
              }}
              className="btn-sovereign"
              style={{ padding: '0.65rem 1.4rem', fontSize: '1rem', fontWeight: 800 }}
              aria-label="Salir de la pantalla completa SOS"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <X size={16} />
                <span>Cerrar Pantalla Completa</span>
              </span>
            </button>
          </div>

          {/* Botones de Apoyo Táctico (Baliza visual, Sirena y Compartir GPS) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              type="button"
              onClick={() => setBeaconFlash(!beaconFlash)}
              className="btn-glass-secondary"
              style={{
                minHeight: '56px',
                fontSize: '0.95rem',
                backgroundColor: beaconFlash ? '#FFC700' : 'rgba(255, 255, 255, 0.12)',
                color: beaconFlash ? '#000000' : '#FFFFFF',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Flashlight size={18} />
              <span>{beaconFlash ? 'Apagar Baliza Visual' : 'Baliza Visual de Destello'}</span>
            </button>

            <button
              type="button"
              onClick={toggleSirenSound}
              className="btn-glass-secondary"
              style={{
                minHeight: '56px',
                fontSize: '0.95rem',
                backgroundColor: isSirenOn ? '#DA291C' : 'rgba(255, 255, 255, 0.12)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Megaphone size={18} />
              <span>{isSirenOn ? 'Sonando Alerta...' : 'Emitir Tono Sonoro de Auxilio'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareGps}
              className="btn-glass-secondary"
              style={{
                minHeight: '56px',
                fontSize: '0.95rem',
                color: '#00D166',
                borderColor: 'rgba(0, 209, 102, 0.4)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {copiedCoords ? <Check size={18} /> : <MapPin size={18} />}
              <span>{copiedCoords ? '¡Coordenadas Copiadas!' : 'Copiar Coordenadas GPS'}</span>
            </button>
          </div>

          {/* Botonera de Gran Formato en Pantalla Completa */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%'
          }}>
            {SOS_NUMEROS.map((sos) => (
              <a
                key={sos.id}
                href={sos.telHref}
                role="button"
                aria-label={`Llamar de emergencia a ${sos.titulo}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '80px',
                  padding: '1.25rem 2rem',
                  borderRadius: '20px',
                  background: sos.bg,
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: `0 8px 30px ${sos.color}77`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {React.createElement(sos.icono, { size: 34, color: '#FFFFFF' })}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{sos.titulo}</h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{sos.descripcion}</p>
                  </div>
                </div>

                <div style={{
                  fontFamily: 'var(--font-telemetry)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <PhoneCall size={22} />
                  <span>{sos.numero.split(' /')[0]}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
