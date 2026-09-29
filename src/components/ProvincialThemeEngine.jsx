import React, { useEffect } from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { PROVINCIAS_DATA, TEMA_NACIONAL } from '../data/costaRicaTerritorialData';

/**
 * Función auxiliar para convertir HEX a RGB para variables translúcidas
 */
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Escudos vectoriales emblemáticos estilizados para cada una de las 7 provincias
 */
function EscudoEmblematico({ id, size = 26 }) {
  switch (id) {
    case 1: // San José - Saprissa #601438
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#601438" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M12 11 C12 9.5 13.5 8.5 16 8.5 C18.5 8.5 20 9.5 20 11 C20 12.8 14 13.5 14 16 C14 18 16 19 18 18.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 2: // Alajuela - LDA #D31424
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#D31424" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M10 7 V23 M16 7 V27 M22 7 V23" stroke="#000000" strokeWidth="2" />
          <text x="16" y="19" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">LDA</text>
        </svg>
      );
    case 3: // Cartago - C.S. Cartaginés #0A3282
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#0A3282" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="16" y1="6" x2="16" y2="26" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="8" y1="14" x2="24" y2="14" stroke="#FFFFFF" strokeWidth="2" />
          <text x="16" y="21" fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">CSC</text>
        </svg>
      );
    case 4: // Heredia - CSH #FFC700
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#FFC700" stroke="#D31424" strokeWidth="1.5" />
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 Z" fill="#D31424" opacity="0.35" />
          <text x="16" y="18" fill="#D31424" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">CSH</text>
        </svg>
      );
    case 5: // Guanacaste - ADG #05853B
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#05853B" stroke="#CE1126" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="6" fill="#FFD100" />
          <text x="16" y="19" fill="#05853B" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">ADG</text>
        </svg>
      );
    case 6: // Puntarenas - PFC #F36717
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#F36717" stroke="#002B7F" strokeWidth="1.5" />
          <path d="M9 16 C12 13 16 13 23 16 C19 19 14 19 9 16 Z" fill="#002B7F" />
          <text x="16" y="24" fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">PFC</text>
        </svg>
      );
    case 7: // Limón - Limón FC #349E35
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#349E35" stroke="#FFD700" strokeWidth="1.5" />
          <circle cx="16" cy="14" r="5" fill="#FFD700" />
          <text x="16" y="23" fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">LFC</text>
        </svg>
      );
    default: // Nacional Tricolor
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 L28 7 V18 C28 24.5 16 30 16 30 C16 30 4 24.5 4 18 V7 Z" fill="#002B7F" stroke="#F8FAFC" strokeWidth="1.5" />
          <rect x="8" y="12" width="16" height="8" fill="#CE1126" />
          <text x="16" y="18" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">CR</text>
        </svg>
      );
  }
}

export default function ProvincialThemeEngine({
  selectedProvinciaId = 0,
  onSelectProvincia
}) {
  // Conmuta dinámicamente las variables CSS en :root
  useEffect(() => {
    const temaActivo = selectedProvinciaId === 0
      ? TEMA_NACIONAL
      : PROVINCIAS_DATA.find((p) => p.id === selectedProvinciaId) || TEMA_NACIONAL;

    const rgb = hexToRgb(temaActivo.color);
    const root = document.documentElement;

    root.style.setProperty('--color-provincial-primary', temaActivo.color);
    root.style.setProperty('--color-provincial-secondary', temaActivo.colorSecundario);
    root.style.setProperty('--color-provincial-accent', temaActivo.colorAcento);
    root.style.setProperty('--color-provincial-surface', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`);
    root.style.setProperty('--color-provincial-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`);
    root.style.setProperty(
      '--glow-provincial',
      `0 0 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55), 0 0 55px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`
    );

    // Persistir preferencia del ciudadano en localStorage
    try {
      localStorage.setItem('cr_selected_provincia_id', selectedProvinciaId.toString());
    } catch (e) {
      // Ignorar si storage restringido
    }
  }, [selectedProvinciaId]);

  const temaActual = selectedProvinciaId === 0
    ? TEMA_NACIONAL
    : PROVINCIAS_DATA.find((p) => p.id === selectedProvinciaId) || TEMA_NACIONAL;

  return (
    <div
      id="seccion-theming-engine"
      style={{
        marginBottom: '2.5rem'
      }}
    >
      {/* Barra superior de descripción del Theming Engine */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        marginBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="#FBBF24" />
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: '-0.01em'
          }}>
            Theming Engine Provincial Dinámico
          </h3>
          <span className="telemetry-badge" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
            CSS VARIABLES &bull; RESPLANDOR
          </span>
        </div>

        {selectedProvinciaId !== 0 && (
          <button
            type="button"
            onClick={() => onSelectProvincia && onSelectProvincia(0)}
            className="btn-glass-secondary"
            style={{
              fontSize: '0.78rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px'
            }}
            aria-label="Restablecer tema al estándar Tricolor Nacional"
            style={{
              fontSize: '0.78rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <RotateCcw size={12} />
            <span>Restablecer Tricolor Nacional</span>
          </button>
        )}
      </div>

      {/* Dock Selector de Provincias con Escudos Emblemáticos */}
      <div
        className="provincial-bar-container"
        role="toolbar"
        aria-label="Selector de escudos emblemáticos y temas provinciales"
        style={{
          borderColor: selectedProvinciaId !== 0 ? 'var(--color-provincial-border)' : 'rgba(255, 255, 255, 0.14)',
          boxShadow: selectedProvinciaId !== 0 ? 'var(--glow-provincial)' : '0 8px 30px rgba(0, 4, 13, 0.5)'
        }}
      >
        {/* Opción 0: Soberanía Nacional Tricolor */}
        <button
          type="button"
          onClick={() => onSelectProvincia && onSelectProvincia(0)}
          className={`provincial-chip ${selectedProvinciaId === 0 ? 'active' : ''}`}
          aria-pressed={selectedProvinciaId === 0}
          style={{
            '--chip-active-bg': 'rgba(0, 43, 127, 0.55)',
            '--chip-active-border': '#79a6ff',
            '--chip-active-glow': 'rgba(0, 43, 127, 0.6)'
          }}
          title="Tricolor Nacional: Estándar unificado de la República"
        >
          <EscudoEmblematico id={0} size={22} />
          <span>Tricolor Nacional</span>
        </button>

        {/* 7 Provincias Oficiales con Escudos Emblemáticos */}
        {PROVINCIAS_DATA.map((prov) => {
          const isActive = selectedProvinciaId === prov.id;
          const rgb = hexToRgb(prov.color);
          return (
            <button
              key={prov.id}
              type="button"
              onClick={() => onSelectProvincia && onSelectProvincia(prov.id)}
              className={`provincial-chip ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
              style={{
                '--chip-active-bg': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
                '--chip-active-border': prov.color,
                '--chip-active-glow': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`
              }}
              title={`${prov.nombre}: ${prov.club} (${prov.apodo})`}
            >
              <EscudoEmblematico id={prov.id} size={22} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                <span style={{ fontWeight: 700 }}>{prov.nombre}</span>
                <span style={{
                  fontSize: '0.68rem',
                  opacity: 0.8,
                  fontFamily: 'var(--font-telemetry)'
                }}>
                  {prov.club.split(' ')[0]} {prov.color}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tarjeta Informativa de la Identidad Provincial Activa con Resplandor */}
      <div
        className="civic-glass-card"
        style={{
          marginTop: '1rem',
          padding: '1.25rem 1.5rem',
          borderLeft: `4px solid ${temaActual.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--glow-provincial)',
          borderColor: 'var(--color-provincial-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: `1px solid ${temaActual.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px ${temaActual.color}55`
          }}>
            <EscudoEmblematico id={temaActual.id} size={30} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                {temaActual.nombre}
              </h4>
              <span
                className="telemetry-badge"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: temaActual.color,
                  color: '#FFFFFF',
                  fontSize: '0.72rem'
                }}
              >
                {temaActual.club} &bull; {temaActual.color}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
              {temaActual.lema} &bull; <strong style={{ color: '#FFFFFF' }}>{temaActual.cantonesCount} cantones</strong> / <strong style={{ color: '#FFFFFF' }}>{temaActual.distritosCount} distritos</strong>
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontFamily: 'var(--font-telemetry)',
          fontSize: '0.8rem',
          color: '#94A3B8'
        }}>
          <div>
            <span>OBRAS ACTIVAS: </span>
            <strong style={{ color: '#79a6ff' }}>{temaActual.obrasActivas}</strong>
          </div>
          <div>
            <span>PRESUPUESTO: </span>
            <strong style={{ color: '#00D166' }}>{temaActual.presupuestoAsignado}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
