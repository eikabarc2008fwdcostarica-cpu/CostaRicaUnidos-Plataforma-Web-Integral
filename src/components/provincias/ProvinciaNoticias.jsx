import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowUpRight,
  Tag,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Share2,
  ExternalLink
} from 'lucide-react';

/**
 * Componente Base (Scaffolding): Noticias Provinciales
 * Módulo 01 — Portal Informativo Provincial & Comunal
 */
export default function ProvinciaNoticias({ provincia }) {
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');

  // Generación temática de noticias contextuales según la provincia seleccionada
  const noticiasMock = [
    {
      id: `${provincia.codigo}-NOT-01`,
      titulo: `Concejos Cantonales de ${provincia.nombre} aprueban cartera de proyectos comunales 2026`,
      resumen: `Las municipalidades de la provincia de ${provincia.nombre} publicaron la asignación del presupuesto participativo para obras viales, iluminación LED y parques comunitarios.`,
      categoria: 'GOBERNANZA',
      categoriaLabel: 'Gobernanza Local',
      fecha: '01 Octubre, 2026',
      lectura: '3 min',
      autor: `Secretaría Técnica • ${provincia.cabecera}`,
      destacada: true,
      colorTag: '#38BDF8'
    },
    {
      id: `${provincia.codigo}-NOT-02`,
      titulo: `Inspección de obras viales e infraestructura prioritaria en los ${provincia.cantonesCount} cantones`,
      resumen: `Cuadrillas de mantenimiento cantonal y comités vecinales supervisan el avance de recarpeteo y mejoras en la red vial cantonal de ${provincia.nombre}.`,
      categoria: 'OBRAS',
      categoriaLabel: 'Obras Públicas',
      fecha: '30 Septiembre, 2026',
      lectura: '4 min',
      autor: 'Unidad Técnica de Gestión Vial',
      destacada: false,
      colorTag: '#F59E0B'
    },
    {
      id: `${provincia.codigo}-NOT-03`,
      titulo: `Feria del Agricultor y Emprendimientos Locales de ${provincia.nombre} amplían horarios de atención`,
      resumen: `Productores de ${provincia.cabecera} y zonas aledañas habilitan venta directa de cosechas y productos artesanales con pago digital y verificación cívica.`,
      categoria: 'COMERCIO',
      categoriaLabel: 'Economía & Ferias',
      fecha: '28 Septiembre, 2026',
      lectura: '2 min',
      autor: 'Comité de Ferias Provinciales',
      destacada: false,
      colorTag: '#10B981'
    }
  ];

  const categorias = [
    { id: 'TODAS', label: 'Todas' },
    { id: 'GOBERNANZA', label: 'Gobernanza' },
    { id: 'OBRAS', label: 'Obras Públicas' },
    { id: 'COMERCIO', label: 'Economía & Ferias' }
  ];

  const noticiasFiltradas = noticiasMock.filter((n) => {
    const matchCat = categoriaFiltro === 'TODAS' || n.categoria === categoriaFiltro;
    const matchText =
      !busqueda ||
      n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.resumen.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Encabezado del Módulo de Noticias */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8'
            }}
          >
            <Newspaper size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#38BDF8',
                  fontFamily: 'monospace'
                }}
              >
                M01 • PORTAL INFORMATIVO OFICIAL
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                En Vivo
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0 0' }}>
              Noticias y Boletines Comunales — {provincia.nombre}
            </h3>
          </div>
        </div>

        {/* Buscador de noticias */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }}
          />
          <input
            type="text"
            placeholder={`Buscar en ${provincia.nombre}...`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 10, 28, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.5rem 0.85rem 0.5rem 2.2rem',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Píldoras de Filtro por Categoría */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600, marginRight: '0.25rem' }}>
          Filtrar por:
        </span>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoriaFiltro(cat.id)}
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: categoriaFiltro === cat.id
                ? `1px solid ${provincia.colorAcento || '#38BDF8'}`
                : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: categoriaFiltro === cat.id
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.03)',
              color: categoriaFiltro === cat.id ? '#FFFFFF' : '#94A3B8'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cuadrícula de Tarjetas de Noticias */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
          gap: '1.25rem'
        }}
      >
        {noticiasFiltradas.map((noticia) => (
          <article
            key={noticia.id}
            style={{
              backgroundColor: 'rgba(0, 10, 28, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              {/* Metadatos superiores */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}
              >
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: noticia.colorTag,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${noticia.colorTag}40`
                  }}
                >
                  {noticia.categoriaLabel}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.7rem',
                    color: '#94A3B8'
                  }}
                >
                  <Clock size={12} />
                  <span>{noticia.lectura}</span>
                </div>
              </div>

              {/* Titular */}
              <h4
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: '#FFFFFF',
                  margin: '0 0 0.6rem 0'
                }}
              >
                {noticia.titulo}
              </h4>

              {/* Resumen */}
              <p
                style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: '#94A3B8',
                  margin: 0
                }}
              >
                {noticia.resumen}
              </p>
            </div>

            {/* Pie de la tarjeta */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.72rem',
                color: '#64748B'
              }}
            >
              <span>{noticia.fecha}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#38BDF8',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Leer noticia <ArrowUpRight size={13} />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Contenedor Esqueleto / Scaffolding Informativo de Expansión Futura */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 8px #38BDF8'
            }}
          />
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Base técnica M01: Conexión preparada para feeds RSS de los <strong>{provincia.cantonesCount} cantones</strong> de {provincia.nombre} vía API territorial.
          </span>
        </div>

        <Link
          to="/participacion"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background-color 0.15s ease'
          }}
        >
          <span>Ir a Portal Cívico</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
