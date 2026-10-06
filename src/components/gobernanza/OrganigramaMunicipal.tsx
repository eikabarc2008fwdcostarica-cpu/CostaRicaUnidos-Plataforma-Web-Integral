import React, { FC, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Building,
  User,
  Phone,
  Mail,
  Shield,
  Layers,
  Award,
  Search
} from 'lucide-react';
import { NodoOrganigrama } from '../../data/gobernanzaData';
import { CivicBadge } from '../common/CivicBadge';
import { CivicCard } from '../common/CivicCard';

export interface OrganigramaMunicipalProps {
  raiz: NodoOrganigrama;
}

interface NodoItemProps {
  nodo: NodoOrganigrama;
  nivel?: number;
  filtroBusqueda?: string;
}

const NodoItem: FC<NodoItemProps> = ({ nodo, nivel = 0, filtroBusqueda = '' }) => {
  const tieneHijos = Boolean(nodo.hijos && nodo.hijos.length > 0);
  const [expandido, setExpandido] = useState<boolean>(true);

  // Icono según categoría funcional
  const getCategoriaIcon = () => {
    switch (nodo.categoria) {
      case 'deliberativo':
        return <Award size={18} color="#FFC700" />;
      case 'control':
        return <Shield size={18} color="#F87171" />;
      case 'ejecutivo':
        return <Building size={18} color="#7DD3FC" />;
      case 'operativo':
        return <Layers size={18} color="var(--cru-accent-green)" />;
      case 'social':
        return <User size={18} color="#C084FC" />;
      default:
        return <Building size={18} color="#94A3B8" />;
    }
  };

  const getCategoriaBadge = () => {
    switch (nodo.categoria) {
      case 'deliberativo':
        return <CivicBadge variant="warning" size="sm">Deliberativo</CivicBadge>;
      case 'control':
        return <CivicBadge variant="danger" size="sm">Fiscalización</CivicBadge>;
      case 'ejecutivo':
        return <CivicBadge variant="provincial" size="sm">Ejecutivo</CivicBadge>;
      case 'operativo':
        return <CivicBadge variant="success" size="sm">Operativo</CivicBadge>;
      case 'social':
        return <CivicBadge variant="ctp" size="sm">Comunitario</CivicBadge>;
    }
  };

  // Resaltado si coincide con búsqueda
  const coincide =
    !filtroBusqueda ||
    nodo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    nodo.titular.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    nodo.cargo.toLowerCase().includes(filtroBusqueda.toLowerCase());

  return (
    <div
      style={{
        marginLeft: nivel > 0 ? '1.5rem' : '0',
        marginTop: '0.85rem',
        position: 'relative'
      }}
    >
      {/* Línea conectora visual para niveles jerárquicos */}
      {nivel > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '-1rem',
            top: '1.25rem',
            width: '1rem',
            height: '2px',
            background: 'var(--cru-border, #CBD5E1)'
          }}
          aria-hidden="true"
        />
      )}

      {/* Tarjeta del Nodo */}
      <div
        style={{
          background: 'var(--cru-surface-card)',
          border: coincide
            ? '1.5px solid #93C5FD'
            : '1px solid var(--cru-border, #E2E8F0)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          boxShadow: coincide && filtroBusqueda ? 'var(--cru-card-shadow-hover)' : 'var(--shadow-card, 0 2px 6px -1px rgba(6, 42, 119, 0.04))',
          transition: 'var(--transition-smooth)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: '1 1 300px' }}>
            {tieneHijos && (
              <button
                type="button"
                onClick={() => setExpandido(!expandido)}
                aria-label={expandido ? `Colapsar rama de ${nodo.nombre}` : `Expandir rama de ${nodo.nombre}`}
                aria-expanded={expandido}
                style={{
                  background: 'var(--cru-surface-muted)',
                  border: '1px solid var(--cru-border-strong)',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cru-text)',
                  cursor: 'pointer',
                  marginTop: '2px',
                  flexShrink: 0
                }}
              >
                {expandido ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            )}

            {!tieneHijos && (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94A3B8' }} />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {getCategoriaIcon()}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--cru-text, #062A77)', margin: 0 }}>
                  {nodo.nombre}
                </h4>
                {getCategoriaBadge()}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--cru-accent-blue)', marginTop: '0.25rem', fontWeight: 600 }}>
                {nodo.titular} &bull; <span style={{ color: 'var(--cru-text-muted)' }}>{nodo.cargo}</span>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--cru-text-secondary, #334155)', margin: '0.35rem 0 0 0', lineHeight: 1.5 }}>
                {nodo.descripcion}
              </p>
            </div>
          </div>

          {/* Canales de Contacto Directo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              fontSize: '0.8rem',
              color: 'var(--cru-text-muted)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={14} color="var(--cru-accent-green)" />
              <span style={{ fontFamily: "var(--font-telemetry, monospace)", fontWeight: 600, color: 'var(--cru-text)' }}>{nodo.extension}</span>
            </div>
            <a
              href={`mailto:${nodo.correo}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--cru-accent-blue)',
                textDecoration: 'none',
                fontFamily: "var(--font-telemetry, monospace)",
                fontWeight: 600
              }}
              title={`Escribir a ${nodo.correo}`}
            >
              <Mail size={14} />
              <span>{nodo.correo}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Renderizado Recursivo de Hijos */}
      {tieneHijos && expandido && (
        <div
          role="group"
          aria-label={`Dependencias de ${nodo.nombre}`}
          style={{
            borderLeft: '2px solid var(--cru-border, #CBD5E1)',
            marginLeft: '0.85rem',
            paddingLeft: '0.5rem'
          }}
        >
          {nodo.hijos!.map((hijo) => (
            <NodoItem
              key={hijo.id}
              nodo={hijo}
              nivel={nivel + 1}
              filtroBusqueda={filtroBusqueda}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrganigramaMunicipal: FC<OrganigramaMunicipalProps> = ({ raiz }) => {
  const [busqueda, setBusqueda] = useState<string>('');

  return (
    <CivicCard
      level={2}
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--cru-text, #062A77)', margin: 0 }}>
              Estructura Orgánica y Dependencias Cantonales
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--cru-text-secondary, #334155)', margin: '0.25rem 0 0 0' }}>
              Organigrama jerárquico interactivo del Gobierno Local. Haga clic en los controles para colapsar o expandir áreas.
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--cru-accent-blue)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar dirección, jefatura o titular..."
              aria-label="Buscar en el organigrama"
              style={{
                width: '100%',
                padding: '0.5rem 0.8rem 0.5rem 2rem',
                background: 'var(--cru-surface-muted)',
                border: '1px solid var(--cru-border-strong)',
                borderRadius: '8px',
                color: 'var(--theme-text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      }
    >
      <div role="tree" aria-label="Organigrama Municipal">
        <NodoItem nodo={raiz} nivel={0} filtroBusqueda={busqueda} />
      </div>
    </CivicCard>
  );
};

export default OrganigramaMunicipal;
