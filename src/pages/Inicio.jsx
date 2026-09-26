import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import ProvincialThemeEngine from '../components/ProvincialThemeEngine';
import TerritorialSelector from '../components/TerritorialSelector';
import PredictiveSearch from '../components/PredictiveSearch';
import InteractiveSvgMap from '../components/InteractiveSvgMap';
import TerritorialDrawer from '../components/TerritorialDrawer';

export default function Inicio() {
  // Estado coordinado centralizado para sincronización territorial bidireccional
  const [selectedProvinciaId, setSelectedProvinciaId] = useState(() => {
    try {
      const saved = localStorage.getItem('cr_selected_provincia_id');
      return saved ? parseInt(saved, 10) : 0; // 0 = Estándar Tricolor Nacional
    } catch {
      return 0;
    }
  });

  const [selectedCantonId, setSelectedCantonId] = useState('');
  const [selectedDistritoId, setSelectedDistritoId] = useState('');

  // Control del Drawer lateral deslizable
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerProvinciaId, setDrawerProvinciaId] = useState(1);

  // Sincronizar selección de provincia
  const handleProvinciaChange = (provId) => {
    setSelectedProvinciaId(provId);
    setSelectedCantonId('');
    setSelectedDistritoId('');
  };

  // Manejar selección desde la búsqueda predictiva
  const handleSearchResult = (item) => {
    if (item.type === 'provincia') {
      setSelectedProvinciaId(item.provinciaId);
      setSelectedCantonId('');
      setSelectedDistritoId('');
      setDrawerProvinciaId(item.provinciaId);
    } else if (item.type === 'canton') {
      setSelectedProvinciaId(item.provinciaId);
      setSelectedCantonId(item.cantonId);
      setSelectedDistritoId('');
      setDrawerProvinciaId(item.provinciaId);
    }

    // Scroll suave hacia el selector territorial
    const selectorEl = document.getElementById('seccion-selector-territorial');
    if (selectorEl) {
      selectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Abrir Drawer de inspección territorial
  const handleOpenDrawer = (provId) => {
    const targetId = provId && provId !== 0 ? provId : selectedProvinciaId !== 0 ? selectedProvinciaId : 1;
    setDrawerProvinciaId(targetId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navegación Soberana */}
      <Navbar />

      <main className="civic-container" style={{ flex: 1, padding: '2.5rem 1.5rem 5rem' }}>
        {/* Telemetría cívica de cabecera */}
        <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'center' }}>
          <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 20, 80, 0.5)' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00D166',
              boxShadow: '0 0 10px #00D166',
              display: 'inline-block'
            }}></span>
            REPÚBLICA DE COSTA RICA &bull; PORTAL NACIONAL SOBERANO v2.1 &bull; DTA ACTIVA
          </span>
        </div>

        {/* 1. Barra de Búsqueda Predictiva con Debouncing de 300 ms */}
        <PredictiveSearch onSelectResult={handleSearchResult} />

        {/* 2. Hero Institucional con Carrusel Dinámico Accesible Tricolor */}
        <HeroCarousel
          onSelectSlideCta={(targetId) => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* 3. Theming Engine Provincial Dinámico con Escudos Emblemáticos */}
        <ProvincialThemeEngine
          selectedProvinciaId={selectedProvinciaId}
          onSelectProvincia={handleProvinciaChange}
        />

        {/* 4. Selector Territorial en Cascada (Provincia -> Cantón -> Distrito) con API y Caché Offline */}
        <TerritorialSelector
          selectedProvinciaId={selectedProvinciaId}
          onProvinciaChange={handleProvinciaChange}
          selectedCantonId={selectedCantonId}
          onCantonChange={setSelectedCantonId}
          selectedDistritoId={selectedDistritoId}
          onDistritoChange={setSelectedDistritoId}
          onOpenDrawer={handleOpenDrawer}
        />

        {/* Módulos Cívicos Fundacionales */}
        <section
          aria-label="Pilares del Sistema Soberano"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Card 1: Cobertura Territorial */}
          <div className="civic-glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 43, 127, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              marginBottom: '1rem',
              border: '1px solid rgba(121, 166, 255, 0.3)'
            }}>
              🗺️
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#F8FAFC' }}>
              División Territorial Completa
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Integración nativa con la División Territorial Administrativa (DTA) para las <strong>7 provincias</strong>, desde los cantones históricos hasta los de reciente fundación como Río Cuarto, Monteverde y Puerto Jiménez.
            </p>
          </div>

          {/* Card 2: Soberanía de Datos y Hacienda */}
          <div className="civic-glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(206, 17, 38, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              marginBottom: '1rem',
              border: '1px solid rgba(206, 17, 38, 0.4)'
            }}>
              🏛️
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#F8FAFC' }}>
              Fiscalización y Trámites Cívicos
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Conectividad con servicios tributarios del Ministerio de Hacienda para validación comercial y seguimiento presupuestario de compras públicas en SICOP.
            </p>
          </div>

          {/* Card 3: Cartografía 3D Fotorrealista */}
          <div className="civic-glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 122, 61, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              marginBottom: '1rem',
              border: '1px solid rgba(0, 122, 61, 0.4)'
            }}>
              🌐
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#F8FAFC' }}>
              Visualizador GIS & Relieve
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Topografía fotorrealista del relieve costarricense y capas vectoriales GeoJSON para la gestión de infraestructura, cuencas hidrográficas y prevención de riesgos.
            </p>
          </div>
        </section>

        {/* 5. Mapa Resumen SVG Interactivo en el tercio inferior (pre-footer) */}
        <InteractiveSvgMap
          selectedProvinciaId={selectedProvinciaId}
          onSelectProvincia={handleProvinciaChange}
          onOpenDrawer={handleOpenDrawer}
        />
      </main>

      {/* Drawer Lateral Deslizable de Inspección Territorial */}
      <TerritorialDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        provinciaId={drawerProvinciaId}
      />

      {/* Footer cívico institucional */}
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
            República de Costa Rica &bull; Costa Rica Unidos &bull; Sistema Sovereign Civic Glass v2.1
          </p>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Conformidad estricta WCAG 2.1 AA &bull; Integración DTA Oficial INEC / TSE &bull; Cobertura 84 Cantones y 492 Distritos
          </p>
        </div>
      </footer>
    </div>
  );
}
