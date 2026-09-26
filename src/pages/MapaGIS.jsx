import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MapaCartografico3D from '../components/gis/MapaCartografico3D';
import { GIS_LAYERS_CONFIG, VUELOS_3D_DESTINOS } from '../components/gis/gisLayersData';

export default function MapaGIS() {
  const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const handleSelectLocation = (latLng) => {
    setSelectedLocationInfo(latLng);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#00040D' }}>
      <Navbar />

      <main className="civic-container" style={{ flex: 1, padding: '2.5rem 1.5rem 5rem' }}>
        {/* Telemetría cívica superior */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 20, 80, 0.5)' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00D166',
              boxShadow: '0 0 10px #00D166',
              display: 'inline-block'
            }} />
            MÓDULO 05 &bull; SISTEMA DE INFORMACIÓN GEOGRÁFICA (GIS) &bull; MÓDULO 12 &bull; IA NLP GEOCONTEXTUAL (RF-12.1)
          </span>
        </div>

        {/* Encabezado Institucional */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: '1rem',
            background: 'linear-gradient(180deg, #FFFFFF 30%, #79a6ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Visor Cartográfico 3D de Costa Rica
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: '#CBD5E1',
            lineHeight: 1.65,
            marginBottom: '1.5rem'
          }}>
            Plataforma geoespacial soberana con <strong>Geofencing Estricto Nacional</strong>, motor de <strong>Búsqueda Semántica en Lenguaje Natural con Dictado por Voz (RF-12.1)</strong>, controles 3D con relieve (45°-60°) y navegación multicapa.
          </p>

          {/* Badges de Cobertura */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="telemetry-badge">
              📍 GEOFENCING: 5.45° N - 11.25° N
            </span>
            <span className="telemetry-badge">
              ✨ BÚSQUEDA SEMÁNTICA NLP ACTIVA
            </span>
            <span className="telemetry-badge">
              🏔️ RELIEVE TOPOGRÁFICO 3D ACTIVO
            </span>
            <span className="telemetry-badge">
              🛡️ ISLA DEL COCO INCLUIDA
            </span>
          </div>
        </div>

        {/* Visor Cartográfico 3D Central */}
        <div style={{ marginBottom: '3rem' }}>
          <MapaCartografico3D
            height="760px"
            onSelectLocation={handleSelectLocation}
            initialTilt={50}
            initialSemanticQuery={initialQuery}
          />
        </div>

        {/* Información de Ubicación Seleccionada en Modo Interactivo */}
        {selectedLocationInfo && (
          <div
            className="civic-glass-card"
            style={{
              padding: '1.25rem 1.75rem',
              marginBottom: '2.5rem',
              borderLeft: '4px solid #79a6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                Coordenadas Seleccionadas en Mapa
              </div>
              <div style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '1.1rem',
                color: '#FFFFFF',
                fontWeight: 700,
                marginTop: '0.2rem'
              }}>
                LAT: {selectedLocationInfo.lat.toFixed(5)} &bull; LNG: {selectedLocationInfo.lng.toFixed(5)}
              </div>
            </div>

            <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.4)' }}>
              DISPONIBLE PARA PLANIFICADOR DE RUTAS (ALANIE)
            </span>
          </div>
        )}

        {/* Fichas Técnicas del Visor GIS */}
        <section
          aria-label="Capacidades Técnicas del Módulo GIS"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Card 1: Geofencing Soberano */}
          <div className="civic-glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 43, 127, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              border: '1px solid rgba(121, 166, 255, 0.3)'
            }}>
              🛡️
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#F8FAFC' }}>
              Geofencing Soberano Estricto
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Restricción estricta de navegación con <code>latLngBounds</code> que protege la soberanía digital, impidiendo desplazamientos fuera de las fronteras de Costa Rica y su zona insular oceánica (Isla del Coco).
            </p>
          </div>

          {/* Card 2: Relieve y Vuelos 3D */}
          <div className="civic-glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(206, 17, 38, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              border: '1px solid rgba(206, 17, 38, 0.4)'
            }}>
              🏔️
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#F8FAFC' }}>
              Cámara 3D y Vuelos Fly-To
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Inclinación de 45° a 60° con rotación 360° para inspeccionar fallas geológicas, valles cantonales, conos volcánicos (Arenal, Poás) y cuencas hidrográficas prioritarias.
            </p>
          </div>

          {/* Card 3: Multicapa Cívica y Deep-Linking */}
          <div className="civic-glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 122, 61, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              border: '1px solid rgba(0, 122, 61, 0.4)'
            }}>
              🚗
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#F8FAFC' }}>
              Multicapa y Conectividad Waze
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6 }}>
              5 capas de servicios esenciales (Salud CCSS, Educación MEP, Transporte, Deporte CCDR y Albergues CNE) con botones de navegación directa hacia Waze y Google Maps.
            </p>
          </div>
        </section>
      </main>

      {/* Footer Institucional */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '2rem 0',
        backgroundColor: 'rgba(0, 4, 13, 0.9)',
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: '0.85rem'
      }}>
        <div className="civic-container">
          <p style={{ marginBottom: '0.4rem', color: '#E2E8F0', fontWeight: 600 }}>
            República de Costa Rica &bull; Costa Rica Unidos &bull; Módulo 05 Sistema GIS Soberano
          </p>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Sovereign Civic Glass v2.1 &bull; Google Maps Platform 3D &bull; Geofencing DTA Oficial INEC / TSE
          </p>
        </div>
      </footer>
    </div>
  );
}
