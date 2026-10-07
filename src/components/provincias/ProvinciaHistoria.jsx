import React, { useState } from 'react';
import {
  Calendar,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Landmark,
  ScrollText,
  Clock
} from 'lucide-react';
import { PROVINCIAS_HISTORIA_DATA } from '../../data/provinciasHistoriaData';

export default function ProvinciaHistoria({ provincia }) {
  const [showAllSources, setShowAllSources] = useState(false);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const historiaProvincia = PROVINCIAS_HISTORIA_DATA[provincia.id] || PROVINCIAS_HISTORIA_DATA[1];
  const { ereccionProvincial, historia = [] } = historiaProvincia;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Tarjeta Institucional de Erección Provincial */}
      {ereccionProvincial && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            backgroundColor: 'var(--cru-surface-muted)',
            border: `1px solid ${provincia.color}40`,
            boxShadow: `0 4px 16px ${provincia.color}15`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: `${provincia.color}20`,
                border: `1px solid ${provincia.color}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: provincia.color
              }}
            >
              <Landmark size={22} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--cru-text-muted)',
                  display: 'block'
                }}
              >
                Erección y Base Jurídica Territorial
              </span>
              <h4
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--cru-text)',
                  margin: '2px 0 0 0'
                }}
              >
                {ereccionProvincial.norma} • {ereccionProvincial.fecha}
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--cru-text-soft)',
                backgroundColor: 'var(--cru-chip-bg)',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid var(--cru-border)'
              }}
            >
              Administración: <strong>{ereccionProvincial.gobierno}</strong>
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <ShieldCheck size={13} />
              Registro SCIJ
            </span>
          </div>
        </div>
      )}

      {/* 2. Línea de Tiempo Histórica Vertical */}
      <div style={{ position: 'relative', paddingLeft: '1.5rem', paddingRight: '0.5rem' }}>
        {/* Línea vertical guía */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            bottom: '10px',
            left: '1.25rem',
            width: '2px',
            backgroundColor: `${provincia.color}40`,
            borderRadius: '2px'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {historia.map((hito, idx) => {
            const isItemSourcesOpen = expandedMilestone === idx;

            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  paddingLeft: '2.25rem'
                }}
              >
                {/* Nodo en la línea */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--cru-card-bg)',
                    border: `3px solid ${provincia.color}`,
                    boxShadow: `0 0 10px ${provincia.color}60`,
                    zIndex: 2
                  }}
                />

                {/* Tarjeta del hito */}
                <div
                  style={{
                    backgroundColor: 'var(--cru-card-bg)',
                    border: '1px solid var(--cru-border)',
                    borderRadius: '14px',
                    padding: '1.4rem 1.6rem',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--cru-card-shadow)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${provincia.color}60`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cru-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginBottom: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: `${provincia.color}20`,
                          color: provincia.color,
                          border: `1px solid ${provincia.color}40`,
                          letterSpacing: '0.04em'
                        }}
                      >
                        {hito.periodo}
                      </span>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--cru-text-muted)'
                        }}
                      >
                        <Calendar size={13} />
                        {hito.anio}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedMilestone(isItemSourcesOpen ? null : idx)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--cru-text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = provincia.color;
                        e.currentTarget.style.backgroundColor = 'var(--cru-surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--cru-text-muted)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      aria-label="Ver fuentes verificadas de este hito"
                    >
                      <ScrollText size={13} />
                      Fuentes ({hito.fuentes?.length || 0})
                      {isItemSourcesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  <h4
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: 'var(--cru-text)',
                      margin: '0 0 0.65rem 0',
                      lineHeight: 1.3
                    }}
                  >
                    {hito.titulo}
                  </h4>

                  <p
                    style={{
                      color: 'var(--cru-text-soft)',
                      fontSize: '0.92rem',
                      lineHeight: 1.65,
                      margin: 0
                    }}
                  >
                    {hito.descripcion}
                  </p>

                  {/* Desplegable de fuentes específicas */}
                  {isItemSourcesOpen && hito.fuentes && hito.fuentes.length > 0 && (
                    <div
                      style={{
                        marginTop: '1.15rem',
                        paddingTop: '0.95rem',
                        borderTop: '1px solid var(--cru-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--cru-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ShieldCheck size={13} color="#10B981" />
                        Fuentes verificadas:
                      </span>
                      {hito.fuentes.map((f, fIdx) => (
                        <div
                          key={fIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            fontSize: '0.8rem',
                            backgroundColor: 'var(--cru-surface-muted)',
                            padding: '6px 10px',
                            borderRadius: '6px'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--cru-text)' }}>{f.titulo}</span>
                            <span style={{ color: 'var(--cru-text-muted)', marginLeft: '6px' }}>— {f.organizacion}</span>
                          </div>
                          {f.url && (
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: provincia.color,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.75rem'
                              }}
                            >
                              Consultar <ExternalLink size={11} />
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
      </div>

      {/* 3. Panel Consolidado de Fuentes al Pie */}
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
          {showAllSources ? 'Ocultar bibliografía completa de Historia' : 'Ver todas las fuentes históricas consultadas'}
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
                Repositorio de Fuentes Institucionales Verificadas — {provincia.nombre}
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {historia.flatMap(h => h.fuentes || []).map((fuente, i) => (
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
