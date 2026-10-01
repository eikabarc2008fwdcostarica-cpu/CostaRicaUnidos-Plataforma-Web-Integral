import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const CNE_ALERT_LEVELS = {
  verde: {
    id: 'verde',
    titulo: 'Alerta Verde (Informativa / Prevención)',
    color: '#00D166',
    bgColor: 'rgba(0, 209, 102, 0.22)',
    borderColor: '#00D166',
    textColor: '#002914',
    badgeText: 'ALERTA VERDE',
    protocolo: 'Monitoreo preventivo del Instituto Meteorológico Nacional (IMN) y comités locales de emergencia.',
    zonas: 'Territorio Nacional / Vigilancia Rutinaria'
  },
  amarilla: {
    id: 'amarilla',
    titulo: 'Alerta Amarilla (Precaución)',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.22)',
    borderColor: '#F59E0B',
    textColor: '#331B00',
    badgeText: 'ALERTA AMARILLA',
    protocolo: 'Preparación de albergues y activación de comités cantonales ante incremento de lluvias o sismicidad.',
    zonas: 'Pacífico Central, Caribe Sur y Valle Central'
  },
  naranja: {
    id: 'naranja',
    titulo: 'Alerta Naranja (Peligro / Severo)',
    color: '#F36717',
    bgColor: 'rgba(243, 103, 23, 0.25)',
    borderColor: '#F36717',
    textColor: '#FFFFFF',
    badgeText: 'ALERTA NARANJA',
    protocolo: 'Despliegue táctico de Fuerza Pública, Bomberos y Cruz Roja. Movilización voluntaria de población en riesgo.',
    zonas: 'Zona Norte, Guanacaste y Cuencas del Río Sarapiquí'
  },
  roja: {
    id: 'roja',
    titulo: 'Alerta Roja (Evacuación / Desastre)',
    color: '#DA291C',
    bgColor: 'rgba(218, 41, 28, 0.35)',
    borderColor: '#DA291C',
    textColor: '#FFFFFF',
    badgeText: 'ALERTA ROJA',
    protocolo: 'Evacuación obligatoria inmediata a refugios CNE habilitados. Máxima prioridad para el 9-1-1 y rescatistas.',
    zonas: 'Litoral Pacífico Sur y Cuencas Desbordadas'
  }
};

export default function CneAlertRibbon({ currentAlert = 'amarilla', onAlertChange }) {
  const [timeStr, setTimeStr] = useState('14:32 CST');
  const [showSelector, setShowSelector] = useState(false);

  // Reloj de telemetría CST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes} CST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const alertConfig = CNE_ALERT_LEVELS[currentAlert] || CNE_ALERT_LEVELS.amarilla;

  return (
    <div
      role="banner"
      aria-label="Cintillo Superior Oficial de Alertas CNE"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 150,
        minHeight: '36px',
        backgroundColor: 'rgba(0, 4, 13, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1.5px solid ${alertConfig.borderColor}`,
        boxShadow: `0 4px 20px ${alertConfig.color}33`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.25rem 1.5rem',
        flexWrap: 'wrap',
        gap: '0.6rem',
        fontSize: '0.78rem',
        transition: 'all 0.35s ease'
      }}
    >
      {/* Telemetría Técnica Monoespaciada */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        fontFamily: 'var(--font-telemetry)',
        color: '#CBD5E1',
        letterSpacing: '0.04em'
      }}>
        <span style={{ color: '#79a6ff', fontWeight: 600 }}>
          LAT: 9.7489° N &bull; LNG: -83.7534° W
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ color: '#E2E8F0' }}>
          ACTUALIZADO: {timeStr}
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ color: '#00D166', fontWeight: 700 }}>
          SISTEMAS: 99.98% OPERATIVOS
        </span>
      </div>

      {/* Pastilla Dinámica de Alerta CNE Oficial */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.2rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: alertConfig.bgColor,
            border: `1px solid ${alertConfig.borderColor}`,
            boxShadow: `0 0 12px ${alertConfig.color}66`,
            color: alertConfig.color === '#DA291C' || alertConfig.color === '#F36717' ? '#FFFFFF' : '#00040D',
            fontWeight: 800,
            fontSize: '0.72rem',
            fontFamily: 'var(--font-telemetry)',
            letterSpacing: '0.05em'
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: alertConfig.color,
            boxShadow: `0 0 8px ${alertConfig.color}`,
            display: 'inline-block'
          }} />
          <span>CNE &bull; {alertConfig.badgeText}</span>
        </div>

        {/* Botón para Simular / Conmutar Nivel de Alerta CNE */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowSelector(!showSelector)}
            aria-expanded={showSelector}
            aria-label="Conmutar nivel de alerta CNE para simulación"
            className="btn-glass-secondary"
            style={{
              padding: '0.2rem 0.55rem',
              fontSize: '0.7rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-telemetry)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>Simular Alerta</span>
            <ChevronDown size={11} />
          </button>

          {showSelector && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '260px',
                backgroundColor: 'rgba(0, 8, 25, 0.96)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '0.5rem',
                boxShadow: '0 12px 35px rgba(0, 4, 13, 0.8)',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', padding: '0.2rem 0.4rem', fontFamily: 'var(--font-telemetry)' }}>
                NIVELES OFICIALES CNE
              </div>

              {Object.values(CNE_ALERT_LEVELS).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    if (onAlertChange) onAlertChange(lvl.id);
                    setShowSelector(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '8px',
                    backgroundColor: currentAlert === lvl.id ? lvl.bgColor : 'transparent',
                    border: currentAlert === lvl.id ? `1px solid ${lvl.borderColor}` : '1px solid transparent',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: lvl.color,
                    boxShadow: `0 0 8px ${lvl.color}`,
                    display: 'inline-block',
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{lvl.badgeText}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{lvl.titulo.split(' (')[1]?.replace(')', '')}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
