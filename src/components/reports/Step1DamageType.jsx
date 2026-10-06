import React from 'react';
import { Construction, Lightbulb, Droplets, Trash2, Clock, Check } from 'lucide-react';

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
        <span
          className="telemetry-badge"
          style={{
            backgroundColor: 'rgba(6, 42, 119, 0.08)',
            border: '1px solid rgba(6, 42, 119, 0.22)',
            color: '#062A77',
            fontWeight: 800
          }}
        >
          PASO 1 DE 4 &bull; TIPOLOGÍA DEL DAÑO
        </span>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#062A77',
          marginTop: '0.6rem',
          marginBottom: '0.35rem',
          fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)'
        }}>
          Seleccione la Naturaleza de la Avería o Incidencia
        </h3>
        <p style={{ color: '#334155', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.55 }}>
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
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                borderRadius: '16px',
                border: isSelected
                  ? '2px solid #C22727'
                  : '1.5px solid rgba(6, 42, 119, 0.14)',
                backgroundColor: isSelected
                  ? 'rgba(194, 39, 39, 0.04)'
                  : '#FFFFFF',
                boxShadow: isSelected
                  ? '0 8px 24px rgba(194, 39, 39, 0.18)'
                  : '0 4px 18px rgba(6, 42, 119, 0.05)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Badge de Selección en Rojo Costarricense */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#C22727',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  boxShadow: '0 0 10px rgba(194, 39, 39, 0.6)'
                }}>
                  <Check size={14} strokeWidth={2.5} />
                </div>
              )}

              <div>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? '#C22727' : 'rgba(0, 83, 175, 0.08)',
                  border: `1px solid ${isSelected ? '#990001' : 'rgba(0, 83, 175, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  transition: 'all 0.2s ease'
                }}>
                  {React.createElement(tipo.icono, { size: 28, color: isSelected ? '#FFFFFF' : '#0053AF' })}
                </div>

                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: isSelected ? '#C22727' : '#062A77',
                  marginBottom: '0.5rem',
                  lineHeight: 1.25
                }}>
                  {tipo.titulo}
                </h4>

                <p style={{
                  color: '#334155',
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
                borderTop: '1px solid rgba(6, 42, 119, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-telemetry)'
              }}>
                <span style={{ color: '#0053AF', fontWeight: 700 }}>{tipo.entidad}</span>
                <span style={{
                  color: '#047857',
                  backgroundColor: 'rgba(4, 120, 87, 0.1)',
                  border: '1px solid rgba(4, 120, 87, 0.25)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700
                }}>
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
