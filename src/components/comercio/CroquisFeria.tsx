import React, { FC, useState } from 'react';
import {
  Apple,
  Carrot,
  Milk,
  Beef,
  Flower2,
  UtensilsCrossed,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import {
  PuestoFeriaSector,
  TemporadaCosecha,
  PUESTOS_FERIA_MOCK,
  CALENDARIO_COSECHAS
} from '../../data/comercioData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';
import { CivicButton } from '../common/CivicButton';

export interface CroquisFeriaProps {
  puestos?: PuestoFeriaSector[];
  calendario?: TemporadaCosecha[];
}

export const CroquisFeria: FC<CroquisFeriaProps> = ({
  puestos = PUESTOS_FERIA_MOCK,
  calendario = CALENDARIO_COSECHAS
}) => {
  const [sectorActivo, setSectorActivo] = useState<string>('todos');
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<PuestoFeriaSector | null>(puestos[0] || null);

  const sectores = [
    { nombre: 'todos', etiqueta: 'Todos los Sectores', icono: null },
    { nombre: 'Frutas Tropicales', etiqueta: 'Frutas', color: '#F97316' },
    { nombre: 'Verduras y Hortalizas', etiqueta: 'Verduras', color: '#10B981' },
    { nombre: 'Lácteos y Quesos', etiqueta: 'Lácteos', color: '#FBBF24' },
    { nombre: 'Carnes y Embutidos', etiqueta: 'Carnes', color: '#EF4444' },
    { nombre: 'Sodas y Comidas', etiqueta: 'Sodas Típicas', color: '#8B5CF6' }
  ];

  const puestosFiltrados = sectorActivo === 'todos'
    ? puestos
    : puestos.filter((p) => p.sector === sectorActivo);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Selector de Sectores */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Sectores de la Feria:</span>
        {sectores.map((sec) => (
          <button
            key={sec.nombre}
            type="button"
            onClick={() => setSectorActivo(sec.nombre)}
            style={{
              background: sectorActivo === sec.nombre ? 'var(--color-provincial-primary, #002B7F)' : 'rgba(255, 255, 255, 0.05)',
              color: sectorActivo === sec.nombre ? '#FFFFFF' : '#CBD5E1',
              border: sectorActivo === sec.nombre ? '1px solid var(--color-provincial-border, rgba(255, 255, 255, 0.3))' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {sec.etiqueta}
          </button>
        ))}
      </div>

      {/* Croquis Interactivo en 2D Vectorial */}
      <CivicCard level={2} provincialGlow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
          {/* Mapa Visual del Predio Ferial */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Plano de Distribución de Puestos
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Haga clic en un puesto para ver al productor</span>
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                background: 'radial-gradient(circle at center, rgba(0, 43, 127, 0.25) 0%, rgba(0, 4, 13, 0.95) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              {/* Pasillos y Guías Visuales */}
              <div style={{ position: 'absolute', inset: '10%', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '12px' }} />
              <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div style={{ position: 'absolute', left: '50%', top: '10%', bottom: '10%', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

              <span style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8' }}>
                ACCESO NORTE (PARQUEO)
              </span>

              <span style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#F472B6' }}>
                ZONA DE SODAS & COMIDAS
              </span>

              {/* Nodos de Puestos en el Croquis */}
              {puestosFiltrados.map((puesto) => {
                const isSelected = puestoSeleccionado?.id === puesto.id;
                return (
                  <button
                    key={puesto.id}
                    type="button"
                    onClick={() => setPuestoSeleccionado(puesto)}
                    style={{
                      position: 'absolute',
                      left: `${puesto.coordenadaCroquis.x}%`,
                      top: `${puesto.coordenadaCroquis.y}%`,
                      transform: 'translate(-50%, -50%)',
                      background: isSelected ? '#FFFFFF' : 'rgba(0, 43, 127, 0.85)',
                      color: isSelected ? '#00040D' : '#FFFFFF',
                      border: isSelected ? '2px solid #7DD3FC' : '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      padding: '0.35rem 0.65rem',
                      fontFamily: "var(--font-telemetry, monospace)",
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 16px rgba(125, 211, 252, 0.7)' : '0 2px 8px rgba(0,0,0,0.5)',
                      transition: 'all 0.2s ease',
                      zIndex: isSelected ? 10 : 2
                    }}
                    aria-label={`Puesto ${puesto.numeroPuesto}: ${puesto.productorNombre}`}
                  >
                    {puesto.numeroPuesto}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha del Productor Seleccionado */}
          {puestoSeleccionado && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: "var(--font-telemetry, monospace)",
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#7DD3FC'
                  }}
                >
                  Puesto {puestoSeleccionado.numeroPuesto}
                </span>

                <CivicBadge variant="provincial" size="sm">
                  {puestoSeleccionado.sector}
                </CivicBadge>
              </div>

              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {puestoSeleccionado.productorNombre}
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                  <span>Cédula: <strong style={{ color: '#E2E8F0', fontFamily: "var(--font-telemetry, monospace)" }}>{puestoSeleccionado.cedulaProductor}</strong></span>
                  {puestoSeleccionado.carneCacNumero && (
                    <span>Carné CAC: <strong style={{ color: '#7DD3FC', fontFamily: "var(--font-telemetry, monospace)" }}>{puestoSeleccionado.carneCacNumero}</strong></span>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div><strong>Finca de Origen: </strong>{puestoSeleccionado.fincaOrigen}</div>
                <div><strong>Procedencia: </strong>{puestoSeleccionado.cantonOrigen}</div>
              </div>

              {puestoSeleccionado.esOrganicoCertificado && puestoSeleccionado.enteCertificador && (
                <div
                  style={{
                    background: 'rgba(0, 122, 61, 0.2)',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.75rem',
                    color: '#6EE7B7',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Sparkles size={15} color="#34D399" />
                  <span><strong>Producción Orgánica: </strong>{puestoSeleccionado.enteCertificador}</span>
                </div>
              )}

              {puestoSeleccionado.verificadoHacienda && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#A7F3D0',
                    fontSize: '0.8rem'
                  }}
                >
                  <ShieldCheck size={16} color="#10B981" />
                  <span>Productor al Día &bull; {puestoSeleccionado.regimenTributario || 'Régimen Simplificado Agropecuario'}</span>
                </div>
              )}

              <div>
                <strong style={{ fontSize: '0.825rem', color: '#F8FAFC', display: 'block', marginBottom: '0.35rem' }}>
                  Productos que ofrece hoy en feria:
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {puestoSeleccionado.productosPrincipales.map((prod, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.78rem',
                        color: '#E2E8F0'
                      }}
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CivicCard>

      {/* Calendario Estacional de Cosechas */}
      <section aria-labelledby="titulo-cosechas">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <Calendar size={22} color="#FBBF24" />
          <h3 id="titulo-cosechas" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Calendario Cantonal de Temporadas de Cosecha
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {calendario.map((temp, idx) => (
            <CivicCard key={idx} level={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <span
                  style={{
                    fontFamily: "var(--font-headline, serif)",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#7DD3FC'
                  }}
                >
                  {temp.mes}
                </span>

                <div>
                  <strong style={{ fontSize: '0.8rem', color: '#34D399', display: 'block', marginBottom: '0.25rem' }}>
                    Abundancia y Mejor Precio:
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {temp.productosTemporadaAlta.map((p, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(52, 211, 153, 0.3)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          color: '#A7F3D0'
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '0.825rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0.35rem 0 0 0' }}>
                  {temp.consejoConsumidor}
                </p>
              </div>
            </CivicCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CroquisFeria;
