import React, { FC, useState } from 'react';
import { Sparkles, MapPin, BookOpen, Heart, Eye, Utensils, Palette } from 'lucide-react';
import { ElementoPatrimonio } from '../../data/culturaData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';
import { CivicModal } from '../common/CivicModal';
import { CivicButton } from '../common/CivicButton';

const renderPatrimonioIcon = (categoria?: string, iconoCat?: string) => {
  if (iconoCat === 'celebracion' || categoria?.includes('Celebraciones')) {
    return <Sparkles size={14} className="text-amber-400 mr-1 inline-block" />;
  }
  if (iconoCat === 'gastronomia' || categoria?.includes('Gastronomía')) {
    return <Utensils size={14} className="text-emerald-400 mr-1 inline-block" />;
  }
  if (iconoCat === 'artesania' || categoria?.includes('Artesanías')) {
    return <Palette size={14} className="text-purple-400 mr-1 inline-block" />;
  }
  return <BookOpen size={14} className="text-blue-400 mr-1 inline-block" />;
};

export interface PatrimonioLightboxProps {
  elementos: ElementoPatrimonio[];
}

export const PatrimonioLightbox: FC<PatrimonioLightboxProps> = ({ elementos }) => {
  const [elementoActivo, setElementoActivo] = useState<ElementoPatrimonio | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');

  const categorias = [
    'todas',
    'Celebraciones y Fiestas',
    'Tradición Oral & Leyendas',
    'Gastronomía Tradicional',
    'Artesanías'
  ];

  const filtrados = categoriaFiltro === 'todas'
    ? elementos
    : elementos.filter((e) => e.categoria === categoriaFiltro);

  return (
    <div>
      {/* Filtros de Categorías de Patrimonio */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.75rem',
          alignItems: 'center'
        }}
        role="group"
        aria-label="Filtrar patrimonio por categoría"
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--cru-text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
          Categoría:
        </span>
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoriaFiltro(cat)}
            style={{
              background: categoriaFiltro === cat ? 'var(--color-provincial-primary, #002B7F)' : 'rgba(255, 255, 255, 0.05)',
              color: categoriaFiltro === cat ? '#FFFFFF' : '#CBD5E1',
              border: categoriaFiltro === cat ? '1px solid var(--color-provincial-border, rgba(255, 255, 255, 0.3))' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.4rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            {cat === 'todas' ? 'Todo el Patrimonio' : cat}
          </button>
        ))}
      </div>

      {/* Muro Interactivo (Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {filtrados.map((item) => (
          <div
            key={item.id}
            onClick={() => setElementoActivo(item)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setElementoActivo(item);
              }
            }}
            aria-label={`Ver detalles en lightbox de ${item.nombre}`}
          >
            <CivicCard level={1} interactive style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Imagen del Patrimonio */}
                <div
                  style={{
                    position: 'relative',
                    height: '180px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}
                >
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px'
                    }}
                  >
                    <CivicBadge variant="default" size="sm">
                      {renderPatrimonioIcon(item.categoria, item.iconoCategoria)}
                      <span>{item.categoria}</span>
                    </CivicBadge>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,4,13,0.85) 0%, transparent 60%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--cru-border)', fontSize: '0.8rem' }}>
                      <MapPin size={14} color="#7DD3FC" />
                      <span>{item.canton}</span>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
                  {item.nombre}
                </h4>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--cru-text-muted)',
                    lineHeight: 1.5,
                    margin: '0 0 1rem 0',
                    flex: '1 1 auto',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {item.descripcion}
                </p>

                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: '#7DD3FC'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Eye size={14} />
                    Ver en Lightbox
                  </span>
                  <span style={{ color: 'var(--cru-text-muted)' }}>{item.provincia}</span>
                </div>
              </div>
            </CivicCard>
          </div>
        ))}
      </div>

      {/* Modal Lightbox Accesible */}
      <CivicModal
        isOpen={Boolean(elementoActivo)}
        onClose={() => setElementoActivo(null)}
        size="lg"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {renderPatrimonioIcon(elementoActivo?.categoria, elementoActivo?.iconoCategoria)}
            <span>{elementoActivo?.nombre}</span>
          </div>
        }
        description={`${elementoActivo?.categoria} • ${elementoActivo?.canton}, ${elementoActivo?.provincia}`}
        footer={
          <CivicButton variant="secondary" onClick={() => setElementoActivo(null)}>
            Cerrar Galería
          </CivicButton>
        }
      >
        {elementoActivo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                width: '100%',
                maxHeight: '340px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <img
                src={elementoActivo.imagenUrl}
                alt={elementoActivo.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '340px',
                  objectFit: 'cover'
                }}
              />
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                Manifestación y Descripción Cultural
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--cru-border-strong)', lineHeight: 1.6, margin: 0 }}>
                {elementoActivo.descripcion}
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div>
                <strong style={{ color: '#7DD3FC', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                  Origen Histórico:
                </strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--cru-border)' }}>
                  {elementoActivo.origenHistorico}
                </span>
              </div>

              <div>
                <strong style={{ color: '#FBBF24', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                  Importancia y Reconocimiento Nacional:
                </strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--cru-border)' }}>
                  {elementoActivo.importanciaCultural}
                </span>
              </div>

              <div>
                <strong style={{ color: '#34D399', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                  Comunidades y Portadores de Tradición:
                </strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--cru-border)' }}>
                  {elementoActivo.portadoresTradicion}
                </span>
              </div>
            </div>
          </div>
        )}
      </CivicModal>
    </div>
  );
};

export default PatrimonioLightbox;
