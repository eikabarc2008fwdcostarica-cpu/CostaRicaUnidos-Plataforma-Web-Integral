import React, { useState } from 'react';
import { Home, MapPin, Navigation, Map, Circle, Check } from 'lucide-react';
import { generarEnlaceWaze, generarEnlaceGoogleMaps } from '../gis/gisLayersData';
import { useTheme } from '../../context/ThemeContext';

export const ALBERGUES_CNE_DATA = [
  {
    id: 'alb-turrialba',
    nombre: 'Gimnasio Municipal de Turrialba',
    tipo: 'Gimnasio Polideportivo Cantonal',
    provincia: 'Cartago',
    provinciaId: 3,
    canton: 'Turrialba',
    distrito: 'Turrialba',
    lat: 9.9040,
    lng: -83.6830,
    aforoMaximo: 250,
    ocupacionActual: 85,
    estado: 'activo', // activo | preparado | en_reserva
    coordinador: 'Comité Cantonal de Emergencias (CCE Turrialba)',
    telefono: '+506 2556-0230',
    suministros: ['Kits de higiene CNE', 'Cocina comunal equipada', 'Planta eléctrica diésel', 'Puesto médico Cruz Roja'],
    descripcion: 'Punto estratégico de concentración para evacuados de las márgenes del Río Reventazón y cuenca del Turrialba.'
  },
  {
    id: 'alb-matina',
    nombre: 'Salón Comunal de Matina',
    tipo: 'Salón Comunal Techado',
    provincia: 'Limón',
    provinciaId: 7,
    canton: 'Matina',
    distrito: 'Matina',
    lat: 10.0820,
    lng: -83.2840,
    aforoMaximo: 180,
    ocupacionActual: 110,
    estado: 'activo',
    coordinador: 'Comité Local de Emergencias Matina',
    telefono: '+506 2710-1122',
    suministros: ['Tanque de agua potable 5,000L', 'Catres plegables', 'Generador solar fotovoltaico', 'Alimentos no perecederos'],
    descripcion: 'Refugio humanitario activo para comunidades afectadas por anegamiento en el litoral Caribe.'
  },
  {
    id: 'alb-santacruz',
    nombre: 'Gimnasio Municipal de Santa Cruz',
    tipo: 'Complejo Deportivo Techado',
    provincia: 'Guanacaste',
    provinciaId: 5,
    canton: 'Santa Cruz',
    distrito: 'Santa Cruz',
    lat: 10.2620,
    lng: -85.5860,
    aforoMaximo: 300,
    ocupacionActual: 45,
    estado: 'activo',
    coordinador: 'CCE Santa Cruz / Cruz Roja',
    telefono: '+506 2680-0450',
    suministros: ['Batería sanitaria accesible Ley 7600', 'Raciones alimentarias CNE', 'Zona lúdica infantil'],
    descripcion: 'Espacio adaptado para contingencias por desbordamiento del Río Diriá y áreas bajas costeras.'
  },
  {
    id: 'alb-sancarlos',
    nombre: 'Polideportivo de San Carlos (Ciudad Quesada)',
    tipo: 'Gimnasio Multidisciplinario',
    provincia: 'Alajuela',
    provinciaId: 2,
    canton: 'San Carlos',
    distrito: 'Quesada',
    lat: 10.3235,
    lng: -84.4285,
    aforoMaximo: 400,
    ocupacionActual: 60,
    estado: 'preparado',
    coordinador: 'Municipalidad de San Carlos / CNE Zona Norte',
    telefono: '+506 2401-0900',
    suministros: ['Pabellón médico avanzado', 'Duchas con agua caliente', 'Generador eléctrico 50kVA', 'Conexión satelital Starlink'],
    descripcion: 'Centro neurálgico regional para recepción y triaje humanitario de la Zona Norte y Río Cuarto.'
  },
  {
    id: 'alb-puntarenas',
    nombre: 'Escuela Central de Puntarenas',
    tipo: 'Centro Educativo Adaptado',
    provincia: 'Puntarenas',
    provinciaId: 6,
    canton: 'Puntarenas',
    distrito: 'Puntarenas',
    lat: 9.9760,
    lng: -84.8320,
    aforoMaximo: 220,
    ocupacionActual: 0,
    estado: 'preparado',
    coordinador: 'Comité de Emergencias del Pacífico Central',
    telefono: '+506 2661-0020',
    suministros: ['Aulas acondicionadas con colchonetas', 'Agua potable embotellada', 'Seguridad Fuerza Pública 24/7'],
    descripcion: 'Punto de repliegue temporal ante marejadas extraordinarias o afectaciones en la punta arenosa.'
  },
  {
    id: 'alb-sarapiqui',
    nombre: 'Escuela Líder de Puerto Viejo de Sarapiquí',
    tipo: 'Instalación Educativa Primaria',
    provincia: 'Heredia',
    provinciaId: 4,
    canton: 'Sarapiquí',
    distrito: 'Puerto Viejo',
    lat: 10.4500,
    lng: -84.0150,
    aforoMaximo: 200,
    ocupacionActual: 92,
    estado: 'activo',
    coordinador: 'CCE Sarapiquí',
    telefono: '+506 2766-6010',
    suministros: ['Comedor escolar habilitado', 'Planta de purificación de agua', 'Atención pediátrica'],
    descripcion: 'Atención comunitaria prioritaria por crecidas de los ríos Sarapiquí y Puerto Viejo.'
  }
];

export default function AlberguesListMap() {
  const { isDark } = useTheme?.() || { isDark: true };
  const [selectedProvincia, setSelectedProvincia] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const alberguesFiltrados = ALBERGUES_CNE_DATA.filter((alb) => {
    const matchProv = selectedProvincia === 'todas' || alb.provinciaId === Number(selectedProvincia);
    const matchTxt = alb.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                     alb.canton.toLowerCase().includes(busqueda.toLowerCase()) ||
                     alb.distrito.toLowerCase().includes(busqueda.toLowerCase());
    return matchProv && matchTxt;
  });

  return (
    <section
      aria-label="Albergues y Refugios Temporales CNE"
      style={{ marginBottom: '3rem' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <Home size={22} color={isDark ? "#38BDF8" : "#002B7F"} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#FFFFFF' : 'var(--cru-text, #0F172A)' }}>
              Red Nacional de Albergues y Refugios Temporales CNE
            </h3>
          </div>
          <p style={{ color: isDark ? '#CBD5E1' : 'var(--cru-text-muted, #64748B)', fontSize: '0.88rem' }}>
            Salones comunales, gimnasios y centros escolares habilitados con capacidad de aforo y estado de ocupación.
          </p>
        </div>

        {/* Buscador de Albergues */}
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cantón o albergue..."
          style={{
            padding: '0.55rem 1rem',
            backgroundColor: isDark ? 'rgba(0, 10, 30, 0.8)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--cru-border, #CBD5E1)',
            borderRadius: '10px',
            color: isDark ? '#FFFFFF' : 'var(--cru-text, #0F172A)',
            fontSize: '0.85rem',
            outline: 'none',
            minWidth: '240px'
          }}
        />
      </div>

      {/* Filtros por Provincia */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        {[
          { id: 'todas', label: 'Todas las Provincias' },
          { id: '1', label: 'San José' },
          { id: '2', label: 'Alajuela' },
          { id: '3', label: 'Cartago' },
          { id: '4', label: 'Heredia' },
          { id: '5', label: 'Guanacaste' },
          { id: '6', label: 'Puntarenas' },
          { id: '7', label: 'Limón' }
        ].map((prov) => (
          <button
            key={prov.id}
            type="button"
            onClick={() => setSelectedProvincia(prov.id)}
            className="provincial-chip"
            style={{
              backgroundColor: isDark
                ? (selectedProvincia === prov.id ? 'rgba(0, 43, 127, 0.6)' : 'rgba(255, 255, 255, 0.04)')
                : (selectedProvincia === prov.id ? '#002B7F' : 'var(--cru-surface-muted, #F1F5F9)'),
              borderColor: isDark
                ? (selectedProvincia === prov.id ? '#79a6ff' : 'rgba(255, 255, 255, 0.12)')
                : (selectedProvincia === prov.id ? '#001489' : 'var(--cru-border, #CBD5E1)'),
              color: isDark
                ? (selectedProvincia === prov.id ? '#FFFFFF' : '#CBD5E1')
                : (selectedProvincia === prov.id ? '#FFFFFF' : 'var(--cru-text, #0F172A)'),
              fontSize: '0.8rem'
            }}
          >
            {prov.label}
          </button>
        ))}
      </div>

      {/* Cuadrícula de Tarjetas de Albergues */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {alberguesFiltrados.map((alb) => {
          const pctOcupacion = Math.round((alb.ocupacionActual / alb.aforoMaximo) * 100);
          const isFull = pctOcupacion >= 90;
          const wazeUrl = generarEnlaceWaze(alb.lat, alb.lng);
          const gmapsUrl = generarEnlaceGoogleMaps(alb.lat, alb.lng);

          return (
            <div
              key={alb.id}
              className="civic-glass-card"
              style={{
                padding: '1.5rem',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isDark
                  ? (alb.estado === 'activo' ? '1px solid rgba(0, 209, 102, 0.35)' : '1px solid rgba(255, 255, 255, 0.14)')
                  : (alb.estado === 'activo' ? '1.5px solid #05853B' : '1px solid var(--cru-border, #CBD5E1)'),
                backgroundColor: isDark ? 'rgba(0, 15, 45, 0.6)' : 'var(--cru-surface-card, #FFFFFF)',
                boxShadow: isDark ? 'none' : '0 4px 16px rgba(0, 43, 127, 0.08)'
              }}
            >
              <div>
                {/* Cabecera de Albergue */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="telemetry-badge" style={{
                    backgroundColor: alb.estado === 'activo'
                      ? (isDark ? 'rgba(0, 209, 102, 0.2)' : '#ECFDF5')
                      : (isDark ? 'rgba(245, 158, 11, 0.2)' : '#FFFBEB'),
                    color: alb.estado === 'activo'
                      ? (isDark ? '#00D166' : '#047857')
                      : (isDark ? '#F59E0B' : '#B45309'),
                    borderColor: alb.estado === 'activo'
                      ? (isDark ? '#00D166' : '#A7F3D0')
                      : (isDark ? '#F59E0B' : '#FDE68A'),
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Circle size={6} fill="currentColor" />
                    <span>{alb.estado === 'activo' ? 'ALBERGUE ACTIVO' : 'EN PREPARACIÓN'}</span>
                  </span>

                  <span style={{ fontSize: '0.78rem', color: isDark ? '#79a6ff' : '#002B7F', fontFamily: 'var(--font-telemetry)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <MapPin size={12} />
                    <span>{alb.canton}, {alb.provincia}</span>
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#FFFFFF' : 'var(--cru-text, #0F172A)', marginBottom: '0.35rem' }}>
                  {alb.nombre}
                </h4>
                <p style={{ fontSize: '0.84rem', color: isDark ? '#CBD5E1' : 'var(--cru-text-muted, #475569)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {alb.descripcion}
                </p>

                {/* Barra Visual de Capacidad y Ocupación */}
                <div style={{
                  backgroundColor: isDark ? 'rgba(0, 4, 13, 0.8)' : 'var(--cru-surface-muted, #F8FAFC)',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--cru-border, #CBD5E1)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#94A3B8' }}>OCUPACIÓN ACTUAL</span>
                    <strong style={{ color: isFull ? '#EF4444' : '#00D166' }}>
                      {alb.ocupacionActual} / {alb.aforoMaximo} personas ({pctOcupacion}%)
                    </strong>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pctOcupacion}%`,
                      height: '100%',
                      borderRadius: '4px',
                      backgroundColor: isFull ? '#EF4444' : pctOcupacion > 60 ? '#F59E0B' : '#00D166',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                {/* Suministros y Recursos Disponibles */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Recursos y Logística Disponible:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {alb.suministros.map((sum, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--cru-surface-muted, #F1F5F9)',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--cru-border, #CBD5E1)',
                          color: isDark ? '#E2E8F0' : 'var(--cru-text, #0F172A)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Check size={11} strokeWidth={2.5} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                        <span>{sum}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botonera de Contacto y Deep-Linking (Waze / Google Maps) */}
              <div style={{
                paddingTop: '1rem',
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--cru-border, #CBD5E1)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem'
              }}>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass-secondary"
                  style={{
                    padding: '0.55rem',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    backgroundColor: isDark ? 'rgba(0, 160, 255, 0.18)' : 'var(--cru-accent-sky-bg, #E0F2FE)',
                    borderColor: isDark ? 'rgba(0, 160, 255, 0.35)' : 'var(--cru-accent-sky, #0284C7)',
                    color: isDark ? '#FFFFFF' : 'var(--cru-accent-sky, #0369A1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontWeight: 700
                  }}
                >
                  <Navigation size={13} />
                  <span>Ruta en Waze</span>
                </a>

                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sovereign-blue"
                  style={{
                    padding: '0.55rem',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <Map size={13} />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
