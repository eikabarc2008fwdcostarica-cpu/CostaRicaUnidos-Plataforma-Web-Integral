import React, { FC, useState, useMemo, useEffect } from 'react';
import {
  Apple,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Minus,
  Scale,
  DollarSign,
  Info,
  Carrot,
  Filter,
  CheckCircle2,
  Award
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { CivicButton } from '../components/common/CivicButton';
import { CivicCard } from '../components/common/CivicCard';
import CroquisFeria from '../components/comercio/CroquisFeria';
import {
  PUESTOS_FERIA_MOCK,
  CALENDARIO_COSECHAS,
  PRECIOS_CNP_SIME_DATA,
  PrecioCnpSime
} from '../data/comercioData';

export const FeriaPage: FC = () => {
  // Cantón activo sincronizado con el Navbar
  const [cantonActivo, setCantonActivo] = useState<string>(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  useEffect(() => {
    const handleCantonChange = (e: any) => {
      if (e.detail?.nombre) setCantonActivo(e.detail.nombre);
      else {
        const saved = localStorage.getItem('cr_canton_activo');
        if (saved) setCantonActivo(saved);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    window.addEventListener('storage', handleCantonChange);
    return () => {
      window.removeEventListener('cantonChanged', handleCantonChange);
      window.removeEventListener('storage', handleCantonChange);
    };
  }, []);

  const [categoriaPrecio, setCategoriaPrecio] = useState<string>('todas');
  const [busquedaProducto, setBusquedaProducto] = useState<string>('');

  const categoriasPrecio = [
    'todas',
    'Hortalizas',
    'Frutas',
    'Tubérculos y Raíces',
    'Lácteos y Huevos',
    'Granos y Musáceas'
  ];

  const preciosFiltrados = useMemo(() => {
    return PRECIOS_CNP_SIME_DATA.filter((p) => {
      const matchCat = categoriaPrecio === 'todas' || p.categoria === categoriaPrecio;
      const q = busquedaProducto.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.producto.toLowerCase().includes(q) ||
        p.variedad.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [categoriaPrecio, busquedaProducto]);

  // Ahorro promedio calculado
  const ahorroPromedioPorcentaje = useMemo(() => {
    if (!PRECIOS_CNP_SIME_DATA.length) return 0;
    const sum = PRECIOS_CNP_SIME_DATA.reduce((acc, curr) => acc + curr.ahorroPorcentaje, 0);
    return Math.round(sum / PRECIOS_CNP_SIME_DATA.length);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--theme-bg, #F8FAFC)',
        color: 'var(--theme-text-primary, #131313)',
        position: 'relative'
      }}
    >
      <Navbar />

      <main className="civic-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Cabecera de la Feria del Agricultor */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <CivicBadge variant="provincial" size="md">
                CENTRO AGRÍCOLA CANTONAL (CAC) &bull; {cantonActivo.toUpperCase()}
              </CivicBadge>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                Monitoreo Oficial SIME &bull; Consejo Nacional de Producción (CNP)
              </span>
            </div>

            <a href="/comercio" style={{ textDecoration: 'none' }}>
              <CivicButton variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />}>
                Volver a Directorio de Comercios
              </CivicButton>
            </a>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline, 'Mistical Spring', serif)",
              fontSize: 'clamp(1.9rem, 4vw, 2.9rem)',
              fontWeight: 800,
              color: '#062A77',
              letterSpacing: '-0.02em',
              margin: '0 0 0.75rem 0'
            }}
          >
            Feria del Agricultor Cantonal de {cantonActivo}
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#334155', maxWidth: '880px', lineHeight: 1.6, margin: 0 }}>
            Espacio cívico de comercialización directa del productor a su mesa, libre de intermediación comercial. Consulte el boletín oficial de precios de referencia mayorista/minorista del Consejo Nacional de Producción (CNP) y explore la ubicación de cada puesto en el croquis formal.
          </p>
        </div>

        {/* Ficha Rápida Institucional de Operación */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            background: '#FFFFFF',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            borderTop: '3px solid #0053AF',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={24} color="#D97706" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Días Oficiales</span>
              <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>Sábados y Domingos</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={24} color="#059669" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Horario Reglamentario</span>
              <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>05:00 a 13:30 hrs</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={24} color="#0284C7" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Recinto Ferial</span>
              <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>Campo Ferial de {cantonActivo}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={24} color="#059669" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Garantía Institucional</span>
              <strong style={{ fontSize: '0.95rem', color: '#047857' }}>100% Carné CAC / MAG al Día</strong>
            </div>
          </div>
        </div>

        {/* MÓDULO 1: Catálogo de Precios de Referencia del Consejo Nacional de Producción (CNP) */}
        <section aria-labelledby="titulo-precios-cnp" style={{ marginBottom: '3.5rem' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              borderTop: '4px solid #0053AF',
              boxShadow: '0 4px 16px rgba(6, 42, 119, 0.06)',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Encabezado del Módulo de Precios CNP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Scale size={22} color="#0053AF" />
                  </div>
                  <div>
                    <h2 id="titulo-precios-cnp" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#062A77', margin: 0 }}>
                      Catálogo Oficial de Precios de Referencia • Consejo Nacional de Producción (CNP)
                    </h2>
                    <span style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 500 }}>
                      Sistema de Información de Mercados Mayoristas y Minoristas (SIME) &bull; Monitoreo CENADA/PIMA vs. Ferias
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: '10px',
                    padding: '0.5rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <TrendingDown size={20} color="#059669" />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#047857', display: 'block', fontWeight: 600 }}>Ahorro Familiar Promedio</span>
                    <strong style={{ fontSize: '1rem', color: '#065F46', fontFamily: "var(--font-telemetry, monospace)" }}>
                      {ahorroPromedioPorcentaje}% en Feria vs. Supermercado
                    </strong>
                  </div>
                </div>
              </div>

              {/* Filtros de Categoría y Búsqueda de Productos */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {categoriasPrecio.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoriaPrecio(cat)}
                      style={{
                        background: categoriaPrecio === cat ? '#0053AF' : '#F1F5F9',
                        color: categoriaPrecio === cat ? '#FFFFFF' : '#334155',
                        border: categoriaPrecio === cat ? '1px solid #0053AF' : '1px solid #CBD5E1',
                        borderRadius: '8px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cat === 'todas' ? 'Todos los Alimentos' : cat}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  placeholder="Buscar producto (ej: Tomate, Papa, Queso)..."
                  style={{
                    padding: '0.5rem 0.85rem',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    color: '#0F172A',
                    fontSize: '0.825rem',
                    minWidth: '240px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Tabla de Precios Comparativa CNP */}
              <div
                className="civic-table-container custom-civic-scrollbar"
                style={{
                  overflowX: 'auto',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  width: '100%',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#062A77' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Producto & Variedad</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Unidad</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Mayorista CENADA</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#059669' }}>Precio Sugerido Feria</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Supermercado Prom.</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Ahorro</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preciosFiltrados.map((item) => {
                      return (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <strong style={{ color: '#0F172A', display: 'block' }}>{item.producto}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.variedad}</span>
                          </td>

                          <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                            {item.unidadMedida}
                          </td>

                          <td style={{ padding: '0.85rem 1rem', fontFamily: "var(--font-telemetry, monospace)", color: '#475569', fontWeight: 600 }}>
                            ₡ {item.precioMayoristaCenada.toLocaleString()}
                          </td>

                          <td style={{ padding: '0.85rem 1rem', fontFamily: "var(--font-telemetry, monospace)" }}>
                            <span
                              style={{
                                background: '#DCFCE7',
                                border: '1px solid #86EFAC',
                                borderRadius: '6px',
                                padding: '0.25rem 0.55rem',
                                color: '#166534',
                                fontWeight: 700
                              }}
                            >
                              ₡ {item.precioSugeridoFeria.toLocaleString()}
                            </span>
                          </td>

                          <td style={{ padding: '0.85rem 1rem', fontFamily: "var(--font-telemetry, monospace)", color: '#991B1B', fontWeight: 600 }}>
                            ₡ {item.precioSupermercadoPromedio.toLocaleString()}
                          </td>

                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#991B1B',
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px'
                              }}
                            >
                              -{item.ahorroPorcentaje}%
                            </span>
                          </td>

                          <td style={{ padding: '0.85rem 1rem' }}>
                            {item.tendenciaSemanal === 'baja' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontSize: '0.78rem', fontWeight: 600 }}>
                                <TrendingDown size={14} /> Baja
                              </span>
                            )}
                            {item.tendenciaSemanal === 'alza' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                                <TrendingUp size={14} /> Alza
                              </span>
                            )}
                            {item.tendenciaSemanal === 'estable' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>
                                <Minus size={14} /> Estable
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Info size={14} />
                <span>
                  Fuente oficial: Sistema de Información de Mercados Mayoristas y Minoristas (SIME) del Consejo Nacional de Producción (CNP). Monitoreo actualizado semanalmente.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MÓDULO 2: Croquis Formal de Puestos Agrícolas y Productores */}
        <section aria-labelledby="titulo-croquis" style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 id="titulo-croquis" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#062A77', margin: '0 0 0.4rem 0' }}>
              Zonificación y Croquis Formal de Puestos Agrícolas
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
              Consulte la distribución sectorial del campo ferial (Sectores A al F), la procedencia de cada agricultor con carné del CAC y sus certificaciones orgánicas.
            </p>
          </div>

          <CroquisFeria
            puestos={PUESTOS_FERIA_MOCK}
            calendario={CALENDARIO_COSECHAS}
          />
        </section>
      </main>
    </div>
  );
};

export default FeriaPage;
