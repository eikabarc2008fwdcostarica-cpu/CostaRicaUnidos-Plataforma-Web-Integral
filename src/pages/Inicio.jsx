import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Inicio() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="civic-container" style={{ flex: 1, padding: '4rem 1.5rem 6rem' }}>
        {/* Telemetría cívica */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <span className="telemetry-badge">
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00D166',
              display: 'inline-block'
            }}></span>
            REPÚBLICA DE COSTA RICA &bull; PLATAFORMA SOBERANA v2.1
          </span>
        </div>

        {/* Hero Institucional */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(180deg, #FFFFFF 30%, #B0C7FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Costa Rica Unidos
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.82)',
            fontWeight: 400,
            lineHeight: 1.7,
            marginBottom: '2.5rem'
          }}>
            Plataforma digital soberana e integral para la transparencia comunitaria,
            la fiscalización de obras públicas y la articulación cívica de los <strong>84 cantones</strong> y <strong>492 distritos</strong> de la República.
          </p>

          {/* Acciones principales */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-sovereign">
              Acceder con Identidad Cívica
            </Link>
            <Link to="/dashboard" className="btn-glass-secondary">
              Explorar Panel Territorial
            </Link>
          </div>
        </div>

        {/* Módulos Cívicos Fundacionales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {/* Card 1: Cobertura Territorial */}
          <div className="civic-glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 20, 137, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1rem'
            }}>
              🗺️
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              División Territorial Completa
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.92rem' }}>
              Integración nativa con la División Territorial Administrativa (DTA) para las 7 provincias, desde los cantones históricos hasta los de reciente fundación.
            </p>
          </div>

          {/* Card 2: Soberanía de Datos y Hacienda */}
          <div className="civic-glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(218, 41, 28, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1rem'
            }}>
              🏛️
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Fiscalización y Trámites
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.92rem' }}>
              Conectividad con servicios tributarios del Ministerio de Hacienda para validación comercial y seguimiento presupuestario de compras públicas.
            </p>
          </div>

          {/* Card 3: Cartografía 3D Fotorrealista */}
          <div className="civic-glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 122, 61, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1rem'
            }}>
              🌐
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Visualizador GIS 3D
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.92rem' }}>
              Topografía fotorrealista del relieve costarricense mediante Google Maps 3D y capas vectoriales GeoJSON para la gestión de infraestructura y riesgos.
            </p>
          </div>
        </div>
      </main>

      {/* Footer cívico */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.75rem 0',
        backgroundColor: 'rgba(0, 4, 13, 0.85)',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.55)',
        fontSize: '0.85rem'
      }}>
        <div className="civic-container">
          República de Costa Rica &bull; Costa Rica Unidos &bull; Sistema Sovereign Civic Glass v2.1
        </div>
      </footer>
    </div>
  );
}
