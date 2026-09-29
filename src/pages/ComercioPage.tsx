import React, { FC, useState, useMemo } from 'react';
import {
  Store,
  Search,
  Filter,
  ShieldCheck,
  Download,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { CivicButton } from '../components/common/CivicButton';
import { CivicCard } from '../components/common/CivicCard';
import { FichaComercio } from '../components/comercio/FichaComercio';
import {
  PYMES_CANTONALES_DATA,
  ComercioPymePOI,
  getGeoJsonComerciosPOI
} from '../data/comercioData';
import { useHaciendaValidation } from '../hooks/useHaciendaValidation';

export const ComercioPage: FC = () => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  const [descargadoGeoJson, setDescargadoGeoJson] = useState<boolean>(false);

  // Hook interactivo de validación con Hacienda para verificar comercios al instante
  const {
    cedula: cedulaConsulta,
    setCedula: setCedulaConsulta,
    validation: validacionHacienda,
    isValidating: validandoHacienda,
    error: errorHacienda
  } = useHaciendaValidation('', { autoValidate: true, includeTaxStatus: true });

  const categorias = [
    'todas',
    'Alimentos y Gastronomía',
    'Artesanías y Textiles',
    'Tecnología y Servicios'
  ];

  const comerciosFiltrados = useMemo(() => {
    return PYMES_CANTONALES_DATA.filter((c) => {
      const coincideCat = categoriaSeleccionada === 'todas' || c.categoria === categoriaSeleccionada;
      const q = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !q ||
        c.nombreComercial.toLowerCase().includes(q) ||
        c.distrito.toLowerCase().includes(q) ||
        c.cedulaJuridicaOFisica.includes(q) ||
        c.descripcion.toLowerCase().includes(q);

      return coincideCat && coincideBusqueda;
    });
  }, [busqueda, categoriaSeleccionada]);

  const handleDescargarGeoJson = () => {
    const geoJsonData = getGeoJsonComerciosPOI();
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'costarica_comercios_pymes_eiker_gis.geojson';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDescargadoGeoJson(true);
    setTimeout(() => setDescargadoGeoJson(false), 4000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-obsidian-sovereign, #00040D)',
        color: '#FFFFFF',
        position: 'relative'
      }}
    >
      <Navbar />

      <main className="civic-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Cabecera Comercial */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <CivicBadge variant="provincial" size="md">
              MÓDULO 08 &bull; COMERCIO LOCAL Y PYMES CANTONALES
            </CivicBadge>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Validación Tributaria Oficial con Ministerio de Hacienda
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline, 'Mistical Spring', serif)",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              margin: '0 0 0.75rem 0'
            }}
          >
            Directorio PYMES y Comercios Verificados
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
            Apoye la economía local de su cantón conectando directamente con productores y emprendedores mediante WhatsApp y Waze, con el respaldo del sello oficial de cumplimiento tributario ante Hacienda.
          </p>
        </div>

        {/* Verificador Tributario en Tiempo Real */}
        <div style={{ marginBottom: '2rem' }}>
          <CivicCard level={1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#10B981" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Verificador de Condición Tributaria de Comercios (API Hacienda)
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
                Ingrese el número de cédula física (9-10 dígitos) o jurídica (10 dígitos) de cualquier comercio cantonal para consultar en tiempo real su nombre oficial y situación tributaria.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  value={cedulaConsulta}
                  onChange={(e) => setCedulaConsulta(e.target.value)}
                  placeholder="Ej: 3101894521 o 104820931..."
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontFamily: "var(--font-telemetry, monospace)",
                    fontSize: '0.9rem',
                    minWidth: '260px'
                  }}
                />

                {validandoHacienda && (
                  <span style={{ fontSize: '0.825rem', color: '#7DD3FC' }}>
                    Consultando Ministerio de Hacienda...
                  </span>
                )}
              </div>

              {validacionHacienda?.isValid && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#D1FAE5',
                    fontSize: '0.85rem'
                  }}
                >
                  <strong>Contribuyente Verificado: </strong> {validacionHacienda.nombreOficial} ({validacionHacienda.tipo})
                </div>
              )}

              {errorHacienda && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(248, 113, 113, 0.35)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#FECACA',
                    fontSize: '0.825rem'
                  }}
                >
                  {errorHacienda}
                </div>
              )}
            </div>
          </CivicCard>
        </div>

        {/* Tarjeta de Coordinación GIS de Comercios con Eiker */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 43, 127, 0.25) 0%, rgba(0, 20, 137, 0.2) 100%)',
            border: '1px solid rgba(121, 166, 255, 0.25)',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Layers size={18} color="#7DD3FC" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Interoperabilidad GIS: Dataset POI de Comercios para Eiker
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#CBD5E1', margin: 0 }}>
              Exportación en formato GeoJSON para la visualización de tiendas, sodas y servicios en el mapa interactivo central.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <CivicButton
              variant="secondary"
              size="sm"
              onClick={handleDescargarGeoJson}
              leftIcon={<Download size={15} />}
            >
              {descargadoGeoJson ? '¡GeoJSON Descargado!' : 'Exportar Dataset GeoJSON'}
            </CivicButton>

            <a href="/feria-agricultor" style={{ textDecoration: 'none' }}>
              <CivicButton variant="provincial" size="sm">
                Ir a la Feria del Agricultor →
              </CivicButton>
            </a>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por comercio, distrito, cédula o producto..."
              aria-label="Buscar comercios PYMES"
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.4rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaSeleccionada(cat)}
                style={{
                  background: categoriaSeleccionada === cat ? 'var(--color-provincial-primary, #002B7F)' : 'rgba(255, 255, 255, 0.05)',
                  color: categoriaSeleccionada === cat ? '#FFFFFF' : '#CBD5E1',
                  border: categoriaSeleccionada === cat ? '1px solid var(--color-provincial-border, rgba(255, 255, 255, 0.3))' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat === 'todas' ? 'Todas las Categorías' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listado de Comercios */}
        <section aria-label="Directorio de Comercios PYMES">
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>
            Se muestran <strong style={{ color: '#FFFFFF' }}>{comerciosFiltrados.length}</strong> comercios locales verificados
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {comerciosFiltrados.map((comercio) => (
              <FichaComercio key={comercio.id} comercio={comercio} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ComercioPage;
