import React from 'react';
import { Construction, Lightbulb, Droplets, Trash2, Clock } from 'lucide-react';

export const TIPOLOGIAS_DANO = [
  {
    id: 'hueco_vial',
    titulo: 'Hueco vial / bache en asfalto',
    icono: Construction,
    entidad: 'MOPT / Municipalidad',
    plazoEstimado: '3 a 5 días hábiles',
    descripcion: 'Deterioro de la carpeta asfáltica, baches profundos, hundimientos o grietas que comprometen la seguridad vehicular y peatonal.',
    ejemplos: 'Baches en calzada, deformación por lluvias, zanjas sin recarpeteo.'
  },
  {
    id: 'luminaria',
    titulo: 'Luminaria pública dañada o apagada',
    icono: Lightbulb,
    entidad: 'CNFL / ICE / JASEC / ESPH',
    plazoEstimado: '48 a 72 horas',
    descripcion: 'Postes sin iluminación, lámparas intermitentes, fotoceldas sulfatadas o cableado aéreo expuesto en calles públicas.',
    ejemplos: 'Luz apagada de noche, parpadeo constante, bombillo quebrado.'
  },
  {
    id: 'fuga_agua',
    titulo: 'Fuga de agua potable / alcantarilla colapsada',
    icono: Droplets,
    entidad: 'AyA / ASADA Cantonal',
    plazoEstimado: '24 a 48 horas (Prioritaria)',
    descripcion: 'Rotura de tubería de agua potable en vía pública, tapas de alcantarilla faltantes o desbordamiento de aguas pluviales.',
    ejemplos: 'Fuga visible en acera/calle, tapa de pozo robada, alcantarilla tapada.'
  },
  {
    id: 'basurero',
    titulo: 'Basurero clandestino / escombros',
    icono: Trash2,
    entidad: 'Gestión Ambiental Municipal',
    plazoEstimado: '3 a 7 días hábiles',
    descripcion: 'Disposición ilícita de residuos sólidos, acumulación de escombros de construcción o chatarra en zonas públicas protegidas.',
    ejemplos: 'Lote baldío con basura, llantas abandonadas, restos de demolición en acera.'
  }
];

export default function Step1DamageType({ selectedType, onSelectType }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.4)' }}>
          PASO 1 DE 4 &bull; TIPOLOGÍA DEL DAÑO
        </span>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginTop: '0.6rem',
          marginBottom: '0.35rem'
        }}>
          Seleccione la Naturaleza de la Avería o Incidencia
        </h3>
        <p style={{ color: '#CBD5E1', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto' }}>
          La categorización precisa permite al sistema dirigir el ticket de forma inmediata a la cuadrilla técnica municipal o entidad estatal correspondiente.
        </p>
      </div>

      {/* Cuadrícula de Tarjetas Interactivas de Tipología */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {TIPOLOGIAS_DANO.map((tipo) => {
          const isSelected = selectedType === tipo.id;

          return (
            <div
              key={tipo.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => onSelectType(tipo.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectType(tipo.id);
                }
              }}
              className="civic-glass-card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                borderRadius: '16px',
                border: isSelected
                  ? '2px solid #DA291C'
                  : '1px solid rgba(255, 255, 255, 0.16)',
                backgroundColor: isSelected
                  ? 'rgba(218, 41, 28, 0.12)'
                  : 'rgba(0, 15, 45, 0.55)',
                boxShadow: isSelected
                  ? '0 0 25px rgba(218, 41, 28, 0.45)'
                  : '0 8px 25px rgba(0, 4, 13, 0.5)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Badge de Selección */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#DA291C',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  boxShadow: '0 0 10px rgba(218, 41, 28, 0.8)'
                }}>
                  ✓
                </div>
              )}

              <div>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? 'rgba(218, 41, 28, 0.25)' : 'rgba(0, 20, 137, 0.35)',
                  border: `1px solid ${isSelected ? 'rgba(218, 41, 28, 0.5)' : 'rgba(255, 255, 255, 0.18)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  {React.createElement(tipo.icono, { size: 28, color: isSelected ? '#FFFFFF' : '#79a6ff' })}
                </div>

                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: isSelected ? '#FFFFFF' : '#F8FAFC',
                  marginBottom: '0.5rem',
                  lineHeight: 1.25
                }}>
                  {tipo.titulo}
                </h4>

                <p style={{
                  color: '#CBD5E1',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  marginBottom: '1rem'
                }}>
                  {tipo.descripcion}
                </p>
              </div>

              {/* Pie con Entidad y Plazo */}
              <div style={{
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-telemetry)'
              }}>
                <span style={{ color: '#79a6ff' }}>{tipo.entidad}</span>
                <span style={{ color: '#00D166', backgroundColor: 'rgba(0, 209, 102, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  <span>{tipo.plazoEstimado}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
