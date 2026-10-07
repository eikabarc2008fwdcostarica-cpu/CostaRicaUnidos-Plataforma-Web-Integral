import React, { useState } from 'react';
import {
  Zap,
  MapPin,
  Coffee,
  Coins,
  Building,
  Landmark,
  Shield,
  TreePine,
  Flame,
  Palette,
  ShieldAlert,
  Scissors,
  Milk,
  Plane,
  Crown,
  Compass,
  Footprints,
  Building2,
  Gavel,
  Flower2,
  Activity,
  Sparkles,
  GraduationCap,
  Drama,
  Droplets,
  Home,
  Cpu,
  TreeDeciduous,
  HeartPulse,
  Music,
  Sun,
  Flag,
  Globe,
  Disc,
  Waves,
  Utensils,
  Map,
  Anchor,
  Music2,
  Soup,
  Turtle,
  Trees,
  Ship,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ScrollText,
  HelpCircle
} from 'lucide-react';
import { PROVINCIAS_HISTORIA_DATA } from '../../data/provinciasHistoriaData';

const ICON_MAP = {
  Zap,
  MapPin,
  Coffee,
  Coins,
  Building,
  Landmark,
  Shield,
  TreePine,
  Flame,
  Palette,
  ShieldAlert,
  Scissors,
  Milk,
  Plane,
  Crown,
  Compass,
  Footprints,
  Building2,
  Gavel,
  Flower2,
  Activity,
  Sparkles,
  GraduationCap,
  Drama,
  Droplets,
  Home,
  Cpu,
  TreeDeciduous,
  HeartPulse,
  Music,
  Sun,
  Flag,
  Globe,
  Disc,
  Waves,
  Utensils,
  Map,
  Anchor,
  Music2,
  Soup,
  Turtle,
  Trees,
  Ship
};

export default function ProvinciaCuriosidades({ provincia }) {
  const [showAllSources, setShowAllSources] = useState(false);
  const [activeItemSources, setActiveItemSources] = useState(null);

  const historiaProvincia = PROVINCIAS_HISTORIA_DATA[provincia.id] || PROVINCIAS_HISTORIA_DATA[1];
  const { datosCuriosos = [] } = historiaProvincia;

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
            <Sparkles size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--cru-text)' }}>
              Particularidades, Récords y Patrimonio de {provincia.nombre}
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--cru-text-soft)' }}>
              Hechos comprobados y tradiciones históricas autenticadas por fuentes primarias e investigación académica.
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
          {datosCuriosos.length} Datos Documentados
        </span>
      </div>

      {/* Grid de Tarjetas de Datos Curiosos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {datosCuriosos.map((dato, idx) => {
          const IconComponent = ICON_MAP[dato.icono] || HelpCircle;
          const isItemOpen = activeItemSources === idx;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--cru-card-bg)',
                border: '1px solid var(--cru-border)',
                borderRadius: '14px',
                padding: '1.35rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
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
                {/* Cabecera de la tarjeta con icono y categoría */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.85rem'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: `${provincia.color}15`,
                      border: `1px solid ${provincia.color}35`,
                      color: provincia.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComponent size={20} />
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--cru-text-muted)',
                      backgroundColor: 'var(--cru-surface-muted)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--cru-border)'
                    }}
                  >
                    {dato.categoria}
                  </span>
                </div>

                <h4
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--cru-text)',
                    margin: '0 0 0.55rem 0',
                    lineHeight: 1.3
                  }}
                >
                  {dato.titulo}
                </h4>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--cru-text-soft)',
                    lineHeight: 1.6,
                    margin: 0
                  }}
                >
                  {dato.descripcion}
                </p>
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
                    Fuente
                    {isItemOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                {isItemOpen && dato.fuentes && dato.fuentes.length > 0 && (
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
                    {dato.fuentes.map((f, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--cru-text-soft)' }}>
                          <strong>{f.titulo}</strong> ({f.organizacion})
                        </span>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: provincia.color, display: 'inline-flex', alignItems: 'center', gap: '2px' }}
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
          {showAllSources ? 'Ocultar bibliografía de Datos Curiosos' : 'Ver todas las fuentes de Datos Curiosos'}
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
                Fuentes Consultadas de Curiosidades y Patrimonio — {provincia.nombre}
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {datosCuriosos.flatMap(d => d.fuentes || []).map((fuente, i) => (
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
