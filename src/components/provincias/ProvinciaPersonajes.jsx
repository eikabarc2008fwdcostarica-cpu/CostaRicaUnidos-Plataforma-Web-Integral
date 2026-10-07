import React, { useState } from 'react';
import {
  Users,
  Award,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ScrollText,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { PROVINCIAS_HISTORIA_DATA } from '../../data/provinciasHistoriaData';

export default function ProvinciaPersonajes({ provincia }) {
  const [showAllSources, setShowAllSources] = useState(false);
  const [activeItemSources, setActiveItemSources] = useState(null);

  const historiaProvincia = PROVINCIAS_HISTORIA_DATA[provincia.id] || PROVINCIAS_HISTORIA_DATA[1];
  const { personajes = [] } = historiaProvincia;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner de Introducción */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.15rem 1.4rem',
          borderRadius: '12px',
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1px solid var(--cru-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: `${provincia.color}20`,
              color: provincia.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--cru-text)' }}>
              Personajes Ilustres y Forjadores de {provincia.nombre}
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--cru-text-soft)' }}>
              Figuras representativas de la ciencia, las artes, la educación, la soberanía cívica y las luchas sociales.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            color: 'var(--cru-text-muted)',
            backgroundColor: 'var(--cru-chip-bg)',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid var(--cru-chip-border)'
          }}
        >
          {personajes.length} Biografías Verificadas
        </span>
      </div>

      {/* Grid de Tarjetas de Personajes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.35rem'
        }}
      >
        {personajes.map((p, idx) => {
          const isItemOpen = activeItemSources === idx;
          const lifespanText = p.fallecimiento === 'Vive'
            ? `${p.nacimiento} – Presente`
            : `${p.nacimiento} – ${p.fallecimiento}`;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--cru-card-bg)',
                border: '1px solid var(--cru-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.15rem',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: 'var(--cru-card-shadow)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${provincia.color}70`;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${provincia.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--cru-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--cru-card-shadow)';
              }}
            >
              <div>
                {/* Cabecera con Avatar de Iniciales y Rol */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  {/* Avatar con iniciales y color provincial */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      backgroundColor: `${provincia.color}25`,
                      border: `2px solid ${provincia.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: provincia.color,
                      flexShrink: 0,
                      boxShadow: `0 0 12px ${provincia.color}30`
                    }}
                  >
                    {p.iniciales || p.nombre.substring(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--cru-text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Calendar size={11} />
                        {lifespanText}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: '1.12rem',
                        fontWeight: 900,
                        color: 'var(--cru-text)',
                        margin: '2px 0 4px 0',
                        lineHeight: 1.25,
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {p.nombre}
                    </h4>

                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        color: provincia.color,
                        backgroundColor: `${provincia.color}15`,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${provincia.color}30`,
                        display: 'inline-block'
                      }}
                    >
                      {p.rol}
                    </span>
                  </div>
                </div>

                {/* Vínculo provincial */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--cru-text-muted)',
                    backgroundColor: 'var(--cru-surface-muted)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    marginBottom: '0.85rem'
                  }}
                >
                  <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px', color: provincia.color }} />
                  <span>
                    <strong>Vínculo:</strong> {p.relacionConLaProvincia}
                  </span>
                </div>

                {/* Biografía breve */}
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--cru-text-soft)',
                    lineHeight: 1.6,
                    margin: '0 0 1rem 0'
                  }}
                >
                  {p.biografia}
                </p>

                {/* Sección destacada obligatoria: Por qué es importante */}
                <div
                  style={{
                    backgroundColor: 'var(--cru-surface-muted)',
                    borderLeft: `3px solid ${provincia.color}`,
                    borderRadius: '0 10px 10px 0',
                    padding: '0.75rem 0.95rem'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: provincia.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '3px'
                    }}
                  >
                    <Award size={13} />
                    Por qué es importante:
                  </span>
                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--cru-text)',
                      fontWeight: 600,
                      lineHeight: 1.5,
                      margin: 0
                    }}
                  >
                    {p.porQueEsImportante}
                  </p>
                </div>
              </div>

              {/* Botón discreto de fuentes */}
              <div style={{ borderTop: '1px solid var(--cru-border)', paddingTop: '0.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.74rem'
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 700 }}>
                    <ShieldCheck size={13} /> Verificado
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveItemSources(isItemOpen ? null : idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--cru-text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = provincia.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--cru-text-muted)';
                    }}
                  >
                    <ScrollText size={12} />
                    Fuentes ({p.fuentes?.length || 0})
                    {isItemOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                {isItemOpen && p.fuentes && p.fuentes.length > 0 && (
                  <div
                    style={{
                      marginTop: '0.65rem',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--cru-surface-muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '0.76rem'
                    }}
                  >
                    {p.fuentes.map((f, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ color: 'var(--cru-text-soft)' }}>
                          <strong>{f.titulo}</strong> ({f.organizacion})
                        </span>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: provincia.color, display: 'inline-flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}
                          >
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Repositorio Consolidado de Fuentes al Pie */}
      <div
        style={{
          borderTop: '1px solid var(--cru-border)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <button
          type="button"
          onClick={() => setShowAllSources(!showAllSources)}
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--cru-surface-muted)',
            border: '1px solid var(--cru-border)',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--cru-text-soft)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--cru-text)';
            e.currentTarget.style.borderColor = 'var(--cru-border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--cru-text-soft)';
            e.currentTarget.style.borderColor = 'var(--cru-border)';
          }}
        >
          <ScrollText size={15} color={provincia.color} />
          {showAllSources ? 'Ocultar bibliografía biográfica' : 'Ver todas las fuentes biográficas consultadas'}
          {showAllSources ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAllSources && (
          <div
            style={{
              backgroundColor: 'var(--cru-card-bg)',
              border: '1px solid var(--cru-border)',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--cru-text)' }}>
                Bibliografía Oficial de Personajes Ilustres — {provincia.nombre}
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {personajes.flatMap(p => p.fuentes || []).map((fuente, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: 'var(--cru-text-soft)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--cru-text)' }}>{fuente.titulo}</strong> — {fuente.organizacion}.{' '}
                  {fuente.url && (
                    <a
                      href={fuente.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: provincia.color, textDecoration: 'underline' }}
                    >
                      Enlace oficial
                    </a>
                  )}
                  {fuente.fechaConsulta && <span style={{ color: 'var(--cru-text-muted)' }}> (Consulta: {fuente.fechaConsulta})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
