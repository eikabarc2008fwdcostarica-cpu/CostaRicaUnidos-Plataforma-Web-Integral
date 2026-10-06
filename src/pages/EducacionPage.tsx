import React, { FC, useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  BookOpen,
  MapPin,
  CheckCircle2,
  Layers
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { CivicButton } from '../components/common/CivicButton';
import { FichaCentroEducativo } from '../components/educacion/FichaCentroEducativo';
import {
  CENTROS_EDUCATIVOS_DATA,
  NivelEducativo,
  CentroEducativoPOI,
  getGeoJsonEscuelasPOI
} from '../data/educacionData';

export const EducacionPage: FC = () => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [nivelSeleccionado, setNivelSeleccionado] = useState<string>('todos');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState<string>('todas');
  const [descargadoGeoJson, setDescargadoGeoJson] = useState<boolean>(false);

  const niveles: ('todos' | NivelEducativo)[] = ['todos', 'Preescolar', 'Primaria', 'Secundaria', 'CTP', 'Universidad'];

  const especialidades = [
    'todas',
    'Desarrollo de Software & Web',
    'Ciberseguridad y Redes CISCO',
    'Contabilidad y Finanzas Tributarias',
    'Electromecánica y Robótica Industrial',
    'Turismo en Sostenibilidad y Hotelería',
    'Secretariado Ejecutivo Bilingüe'
  ];

  const centrosFiltrados = useMemo(() => {
    return CENTROS_EDUCATIVOS_DATA.filter((centro) => {
      const coincideNivel = nivelSeleccionado === 'todos' || centro.nivel === nivelSeleccionado;
      const coincideEsp =
        filtroEspecialidad === 'todas' ||
        centro.especialidadesCTP?.some((esp) => esp.nombre.toLowerCase() === filtroEspecialidad.toLowerCase());

      const q = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !q ||
        centro.nombre.toLowerCase().includes(q) ||
        centro.distrito.toLowerCase().includes(q) ||
        centro.codigoMep.toLowerCase().includes(q) ||
        centro.especialidadesCTP?.some((esp) => esp.nombre.toLowerCase().includes(q));

      return coincideNivel && coincideEsp && coincideBusqueda;
    });
  }, [busqueda, nivelSeleccionado, filtroEspecialidad]);

  const handleDescargarGeoJson = () => {
    const geoJsonData = getGeoJsonEscuelasPOI();
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'costarica_escuelas_poi_eiker_gis.geojson';
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
        background: 'var(--theme-bg, #F8FAFC)',
        color: 'var(--theme-text-primary, #131313)',
        position: 'relative'
      }}
    >
      <Navbar />

      <main className="civic-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Cabecera Educativa */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <CivicBadge variant="provincial" size="md">
              INFRAESTRUCTURA EDUCATIVA &bull; COLEGIOS TÉCNICOS (CTP)
            </CivicBadge>
            <span style={{ fontSize: '0.8rem', color: 'var(--cru-text-muted)', fontWeight: 600 }}>
              Ministerio de Educación Pública (MEP) &bull; Formación Técnica Vocacional
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline, 'Poppins', sans-serif)",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: 'var(--cru-text, #062A77)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.75rem 0'
            }}
          >
            Directorio Cantonal de Centros Educativos y CTPs
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--cru-text-secondary, #334155)', maxWidth: '850px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Explore los centros educativos del cantón desde preescolar hasta universidades, descubra las especialidades técnicas de alta demanda laboral de los Colegios Técnicos Profesionales (CTP) y descargue las coordenadas POI para las capas GIS.
          </p>
        </div>

        {/* Tarjeta de Coordinación GIS con Eiker */}
        <div
          style={{
            background: 'var(--cru-surface-card)',
            border: '2px solid rgba(6, 42, 119, 0.15)',
            borderLeft: '5px solid #0053AF',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            boxShadow: 'var(--cru-card-shadow)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Layers size={18} color="var(--cru-accent-blue)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--cru-text)', margin: 0 }}>
                Interoperabilidad GIS: Dataset POI de Escuelas para Eiker
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--cru-text-soft)', margin: 0 }}>
              Exportación en formato estándar GeoJSON (WGS84) para el renderizado geoespacial de centros y paradas escolares en Leaflet.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDescargarGeoJson}
            style={{
              backgroundColor: 'var(--cru-accent-blue)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 12px rgba(0, 83, 175, 0.25)'
            }}
          >
            <Download size={15} />
            <span>{descargadoGeoJson ? '¡GeoJSON Descargado!' : 'Exportar Dataset GeoJSON POI'}</span>
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--cru-surface-card)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid var(--cru-border)',
            boxShadow: 'var(--cru-card-shadow)',
            marginBottom: '2rem'
          }}
        >
          {/* Fila 1: Búsqueda y Selector de Nivel */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size={18} color="var(--cru-accent-blue)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, distrito, código MEP o especialidad..."
                aria-label="Buscar centros educativos"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  background: 'var(--cru-surface-muted)',
                  border: '1px solid var(--cru-border-strong)',
                  borderRadius: '10px',
                  color: 'var(--theme-text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontWeight: 500
                }}
              />
            </div>

            {/* Selector por Nivel */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {niveles.map((niv) => (
                <button
                  key={niv}
                  type="button"
                  onClick={() => setNivelSeleccionado(niv)}
                  style={{
                    background: nivelSeleccionado === niv ? '#0053AF' : '#F1F5F9',
                    color: nivelSeleccionado === niv ? '#FFFFFF' : '#334155',
                    border: nivelSeleccionado === niv ? '1px solid #0053AF' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {niv === 'todos' ? 'Todos los Niveles' : niv}
                </button>
              ))}
            </div>
          </div>

          {/* Fila 2: Filtro específico por Especialidad CTP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--cru-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Filter size={14} color="var(--cru-accent-blue)" /> Especialidad CTP:
            </span>
            <select
              value={filtroEspecialidad}
              onChange={(e) => setFiltroEspecialidad(e.target.value)}
              aria-label="Filtrar por especialidad técnica CTP"
              style={{
                background: 'var(--cru-surface-muted)',
                color: 'var(--theme-text-primary)',
                border: '1px solid var(--cru-border-strong)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="todas">Todas las Especialidades Técnicas</option>
              {especialidades.filter((e) => e !== 'todas').map((esp) => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Listado de Centros Educativos */}
        <section aria-label="Directorio de Instituciones Educativas">
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--cru-text-muted)', fontWeight: 600 }}>
            Se muestran <strong style={{ color: 'var(--cru-text)' }}>{centrosFiltrados.length}</strong> centros educativos cantonales
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {centrosFiltrados.map((centro) => (
              <FichaCentroEducativo
                key={centro.id}
                centro={centro}
                onVerEnMapa={(c) => {
                  window.location.href = `/mapa-gis?poi=${c.id}&lat=${c.lat}&lng=${c.lng}`;
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EducacionPage;
