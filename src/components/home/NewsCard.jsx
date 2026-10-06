import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NewsCard — Tarjeta informativa municipal estilo portal limpio
 * Cabecera con bloque de color identificador + pastilla de categoría,
 * cuerpo blanco con título, extracto y enlace "Leer más →".
 */
export default function NewsCard({ color, badge, title, excerpt, path = '/noticias' }) {
  return (
    <div
      className="news-card-container reveal-on-scroll"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(6, 42, 119, 0.07)',
        border: '1px solid rgba(6, 42, 119, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.28s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 36px rgba(6, 42, 119, 0.13)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(6, 42, 119, 0.07)';
      }}
    >
      {/* Cabecera de Color con Pastilla de Categoría */}
      <div
        style={{
          height: '110px',
          backgroundColor: color,
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          position: 'relative'
        }}
      >
        <span
          style={{
            backgroundColor: '#FFFFFF',
            color: 'var(--ink, #131313)',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.74rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {badge}
        </span>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div
        style={{
          padding: '1.4rem 1.25rem 1.6rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.12rem',
              fontWeight: 800,
              color: 'var(--navy, #062A77)',
              margin: '0 0 0.65rem',
              lineHeight: 1.35
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: '0.88rem',
              color: '#64748B',
              lineHeight: 1.55,
              margin: '0 0 1.25rem'
            }}
          >
            {excerpt}
          </p>
        </div>

        <Link
          to={path}
          style={{
            textDecoration: 'none',
            color: 'var(--red, #C22727)',
            fontSize: '0.88rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'gap 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.gap = '0.5rem';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.gap = '0.25rem';
          }}
        >
          <span>Leer más</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
