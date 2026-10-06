import React, { useState } from 'react';
import NewsCard from './NewsCard';

/**
 * NewsSection — "La Muni informa"
 * Sección institucional con pestañas Avisos / Noticias / Eventos
 * y carrusel/cuadrícula de 4 tarjetas informativas.
 */
export default function NewsSection() {
  const [activeTab, setActiveTab] = useState('avisos');

  const cardsData = [
    {
      id: 'patentes',
      tab: 'avisos',
      color: 'var(--navy, #062A77)',
      badge: 'Aviso',
      title: 'Vence plazo de patentes',
      excerpt: 'Revise fechas y requisitos de su cantón.',
      path: '/portal-ciudadano'
    },
    {
      id: 'obras',
      tab: 'noticias',
      color: 'var(--red, #C22727)',
      badge: 'Obras',
      title: 'Avanza asfaltado en ruta nacional',
      excerpt: 'Nuevas aceras y pasos peatonales seguros.',
      path: '/reportar-incidencia'
    },
    {
      id: 'ambiente',
      tab: 'noticias',
      color: 'var(--green, #19532B)',
      badge: 'Ambiente',
      title: 'Campaña de compostaje comunal',
      excerpt: 'Capacitación y equipos para hogares.',
      path: '/noticias'
    },
    {
      id: 'evento',
      tab: 'eventos',
      color: 'var(--sun, #FFCA26)',
      badge: 'Evento',
      title: 'Concurso folclórico cantonal',
      excerpt: 'Cultura y tradición de nuestros pueblos.',
      path: '/cultura'
    }
  ];

  // Si hay una pestaña activa, podemos filtrar o mostrar todas con la seleccionada destacada
  const filteredCards = activeTab === 'todos' 
    ? cardsData 
    : cardsData.filter(c => activeTab === 'avisos' ? true : c.tab === activeTab);

  return (
    <section
      id="la-muni-informa"
      aria-label="La Muni informa"
      style={{
        maxWidth: '1240px',
        margin: '0 auto 4.5rem',
        padding: '0 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Cabecera de Sección: Título con subrayado rojo y Pestañas a la derecha */}
      <div
        className="reveal-on-scroll"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Título Principal */}
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
            La Muni informa
          </h2>
        </div>

        {/* Pestañas: Avisos / Noticias / Eventos */}
        <div
          role="tablist"
          aria-label="Filtro de novedades municipales"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--cru-surface-muted)',
            border: '1px solid var(--cru-border)',
            padding: '0.35rem',
            borderRadius: '999px',
            gap: '0.35rem'
          }}
        >
          {[
            { id: 'avisos', label: 'Avisos' },
            { id: 'noticias', label: 'Noticias' },
            { id: 'eventos', label: 'Eventos' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--cru-accent-blue)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--cru-text-muted)',
                  padding: '0.45rem 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuadrícula de 4 Tarjetas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {filteredCards.map((card) => (
          <NewsCard
            key={card.id}
            color={card.color}
            badge={card.badge}
            title={card.title}
            excerpt={card.excerpt}
            path={card.path}
          />
        ))}
      </div>
    </section>
  );
}
