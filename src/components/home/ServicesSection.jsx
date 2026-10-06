import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';

/**
 * ServicesSection — "Trámites y servicios"
 * Cuadrícula de 8 tarjetas de colores muy redondeadas
 * para los módulos de gobierno local y servicios ciudadanos.
 */
export default function ServicesSection() {
  const modulos = [
    {
      id: 'ventanilla',
      title: 'Ventanilla Única & Cédula',
      subtitle: 'Hacienda ATV · Patentes',
      path: '/portal-ciudadano',
      bg: 'var(--navy, #062A77)',
      textColor: '#FFFFFF',
      subTextColor: 'rgba(255, 255, 255, 0.85)',
      arrowBg: '#FFFFFF',
      arrowColor: '#062A77'
    },
    {
      id: 'concejo',
      title: 'Concejo Municipal & Actas',
      subtitle: 'Actas oficiales PDF',
      path: '/gobernanza',
      bg: 'var(--red, #C22727)',
      textColor: '#FFFFFF',
      subTextColor: 'rgba(255, 255, 255, 0.85)',
      arrowBg: '#FFFFFF',
      arrowColor: '#C22727'
    },
    {
      id: 'averias',
      title: 'Reporte de averías viales',
      subtitle: 'Huecos y vías · evidencia',
      path: '/reportar-incidencia',
      bg: 'var(--blue, #0053AF)',
      textColor: '#FFFFFF',
      subTextColor: 'rgba(255, 255, 255, 0.85)',
      arrowBg: '#FFFFFF',
      arrowColor: '#0053AF'
    },
    {
      id: 'ccdr',
      title: 'Comités Cantonales CCDR',
      subtitle: 'Deportes · ferias · PYMES',
      path: '/deportes',
      bg: 'var(--green, #19532B)',
      textColor: '#FFFFFF',
      subTextColor: 'rgba(255, 255, 255, 0.85)',
      arrowBg: '#FFFFFF',
      arrowColor: '#19532B'
    },
    {
      id: 'gis',
      title: 'Visor cartográfico 3D',
      subtitle: 'Geoportal GIS',
      path: '/mapa-gis',
      bg: 'var(--night, #01004E)',
      textColor: '#FFFFFF',
      subTextColor: 'rgba(255, 255, 255, 0.85)',
      arrowBg: '#FFFFFF',
      arrowColor: '#01004E'
    },
    {
      id: 'cne',
      title: 'Red nacional 911 / CNE',
      subtitle: 'Auxilio inmediato',
      path: '/seguridad-emergencias',
      bg: 'var(--red-dark, #990001)',
      textColor: '#FFFFFF',
      subTextColor: 'rgba(255, 255, 255, 0.85)',
      arrowBg: '#FFFFFF',
      arrowColor: '#990001'
    },
    {
      id: 'comercio',
      title: 'Directorio comercial',
      subtitle: 'Descubra comercios locales',
      path: '/comercio',
      bg: 'var(--sun, #FFCA26)',
      textColor: '#131313',
      subTextColor: '#334155',
      arrowBg: '#FFFFFF',
      arrowColor: '#131313'
    },
    {
      id: 'firma',
      title: 'Acceso funcionario',
      subtitle: 'Firma digital',
      path: '/login',
      bg: 'var(--kiwi, #9ABC04)',
      textColor: '#131313',
      subTextColor: '#1F2937',
      arrowBg: '#FFFFFF',
      arrowColor: '#131313'
    }
  ];

  return (
    <section
      id="tramites-servicios"
      aria-label="Trámites y servicios municipales"
      style={{
        maxWidth: '1240px',
        margin: '0 auto 5rem',
        padding: '0 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Cabecera: Título con subrayado animado y botón "Ver todos" */}
      <div
        className="reveal-on-scroll"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2.25rem'
        }}
      >
        <div>
          <h2
            className="title-underline-draw"
            style={{
              fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
              fontWeight: 900,
              color: 'var(--cru-text)',
              margin: 0,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-main, "Poppins", sans-serif)'
            }}
          >
            Trámites y servicios
          </h2>
        </div>

        {/* Botón "Ver todos" */}
        <Link
          to="/portal-ciudadano"
          style={{
            textDecoration: 'none',
            color: 'var(--cru-text)',
            border: '1.5px solid var(--cru-border)',
            padding: '0.55rem 1.4rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--cru-accent-blue)';
            e.currentTarget.style.borderColor = 'var(--cru-accent-blue)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--cru-border)';
            e.currentTarget.style.color = 'var(--cru-text)';
          }}
        >
          Ver todos
        </Link>
      </div>

      {/* Cuadrícula de 8 Tarjetas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {modulos.map((mod) => (
          <ServiceCard
            key={mod.id}
            symbolId={mod.id}
            title={mod.title}
            subtitle={mod.subtitle}
            path={mod.path}
            bg={mod.bg}
            textColor={mod.textColor}
            subTextColor={mod.subTextColor}
            arrowBg={mod.arrowBg}
            arrowColor={mod.arrowColor}
          />
        ))}
      </div>
    </section>
  );
}
