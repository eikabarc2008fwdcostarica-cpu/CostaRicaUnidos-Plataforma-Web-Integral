import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Layers,
  Compass,
  Maximize2,
  Navigation,
  Eye,
  Building2,
  HardHat,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { CANTONES_OFICIALES, getProvincialTextColor } from '../../data/costaRicaTerritorialData';
import { useTheme } from '../../context/ThemeContext';

/**
 * Componente Base (Scaffolding): Mapa y Visor GIS Cantonal
 * Módulo 05 — Infraestructura Cartográfica y Georreferenciación Territorial
 */
export default function ProvinciaMapa({ provincia }) {
  const { isLight } = useTheme?.() || { isLight: false };
  const provAccentColor = getProvincialTextColor(provincia, isLight);
  const [capaActiva, setCapaActiva] = useState('VIAS');
  const [cantonSeleccionado, setCantonSeleccionado] = useState(null);

  // Cantones pertenecientes a la provincia activa
  const cantonesProvincia = CANTONES_OFICIALES.filter(
    (c) => c.provinciaId === provincia.id
  );

  const capas = [
    { id: 'VIAS', label: 'Infraestructura Vial', icon: HardHat, count: '18 obras' },
    { id: 'MUNIS', label: 'Sedes Municipales', icon: Building2, count: `${provincia.cantonesCount} sedes` },
    { id: 'ALERTAS', label: 'Alertas CNE / SOS', icon: AlertTriangle, count: 'Normalidad' },
    { id: 'PATRIMONIO', label: 'Áreas Silvestres / Parques', icon: Compass, count: 'Activo' }
  ];

  const greenAccent = isLight ? '#047857' : '#34D399';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Encabezado del Módulo de Mapa */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--cru-border)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: greenAccent
            }}
          >
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: greenAccent,
                  fontFamily: 'monospace'
                }}
              >
                M05 • VISOR CARTOGRÁFICO & GIS
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--cru-chip-bg)',
                  color: 'var(--cru-chip-text)',
                  border: '1px solid var(--cru-chip-border)'
                }}
              >
                {provincia.superficie}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cru-text)', margin: '2px 0 0 0' }}>
              Cartografía y Capas Territoriales — {provincia.nombre}
            </h3>
          </div>
        </div>

        {/* Botón de acceso a GIS 3D Completo */}
        <Link
          to="/mapa-gis"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '8px',
            padding: '0.55rem 1.15rem',
            color: greenAccent,
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
          className="hover:opacity-90"
        >
          <Maximize2 size={15} />
          <span>Abrir Visor GIS 3D</span>
        </Link>
      </div>

      {/* Controles de Capas GIS */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {capas.map((capa) => {
          const Icono = capa.icon;
          const activa = capaActiva === capa.id;
          return (
            <button
              key={capa.id}
              type="button"
              onClick={() => setCapaActiva(capa.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: activa
                  ? (isLight ? '1px solid #059669' : '1px solid #34D399')
                  : '1px solid var(--cru-border)',
                backgroundColor: activa
                  ? (isLight ? 'rgba(16, 185, 129, 0.14)' : 'rgba(16, 185, 129, 0.18)')
                  : 'var(--cru-surface-muted)',
                color: activa ? greenAccent : 'var(--cru-text-soft)'
              }}
            >
              <Icono size={14} />
              <span>{capa.label}</span>
              <span
                style={{
                  fontSize: '0.66rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.3)',
                  color: isLight ? 'var(--cru-text)' : '#CBD5E1'
                }}
              >
                {capa.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Maqueta / Lienzo del Visor Cartográfico (Isla Oscura Intencional) */}
      <div
        className="surface-dark"
        style={{
          position: 'relative',
          height: '280px',
          width: '100%',
          borderRadius: '14px',
          overflow: 'hidden',
          backgroundColor: '#000814',
          border: '1px solid var(--cru-border)',
          boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          boxSizing: 'border-box',
          backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.12) 0%, rgba(0, 4, 13, 0.95) 80%), repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 24px)`
        }}
      >
        {/* Cabecera del Visor Radar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            style={{
              backgroundColor: 'rgba(0, 10, 28, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.74rem',
              color: '#CBD5E1',
              fontFamily: 'monospace'
            }}
          >
            <div style={{ color: '#34D399', fontWeight: 800 }}>COORDENADAS CRTM05</div>
            <div>Cabecera: {provincia.cabecera}</div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(0, 10, 28, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.74rem',
              color: '#34D399',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Navigation size={14} />
            <span>Sector Territorial {provincia.codigo}</span>
          </div>
        </div>

        {/* Punto central del radar y metadatos del cantón activo */}
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(0, 10, 28, 0.9)',
              border: `1px solid ${provincia.colorAcento || '#34D399'}`,
              borderRadius: '999px',
              padding: '6px 18px',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)'
            }}
          >
            <MapPin size={16} color={provincia.colorAcento || '#34D399'} />
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>
              {cantonSeleccionado ? `Cantón de ${cantonSeleccionado.nombre}` : `Provincia de ${provincia.nombre}`}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              ({provincia.distritosCount} distritos)
            </span>
          </div>
        </div>

        {/* Barra inferior de estado del GIS */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            color: '#94A3B8',
            fontFamily: 'monospace'
          }}
        >
          <span>SISTEMA NACIONAL DE INFORMACIÓN TERRITORIAL (SNIT)</span>
          <span>CAPA ACTIVA: {capaActiva}</span>
        </div>
      </div>

      {/* Selector Rápido de Cantones de la Provincia */}
      <div>
        <div style={{ fontSize: '0.78rem', color: 'var(--cru-text-soft)', fontWeight: 700, marginBottom: '0.65rem' }}>
          Cantones Autónomos de {provincia.nombre} ({cantonesProvincia.length}):
        </div>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {cantonesProvincia.map((canton) => {
            const esSeleccionado = cantonSeleccionado?.id === canton.id;
            return (
              <button
                key={canton.id}
                type="button"
                onClick={() => setCantonSeleccionado(canton)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: esSeleccionado
                    ? (isLight ? '1px solid #0284C7' : '1px solid #38BDF8')
                    : '1px solid var(--cru-border)',
                  backgroundColor: esSeleccionado
                    ? (isLight ? 'rgba(14, 165, 233, 0.14)' : 'rgba(56, 189, 248, 0.15)')
                    : 'var(--cru-chip-bg)',
                  color: esSeleccionado ? (isLight ? '#0369A1' : '#38BDF8') : 'var(--cru-chip-text)'
                }}
              >
                {canton.nombre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scaffolding de Enlace Directo */}
      <div
        style={{
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1px dashed var(--cru-border)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--cru-text-soft)' }}>
          Base técnica M05: Conexión con los servicios WMS/WFS del catastro nacional y reportes georreferenciados de incidencias viales.
        </span>
        <Link
          to="/reportar-incidencia"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: isLight ? '#0284C7' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid #0284C7' : '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
          className="hover:opacity-90"
        >
          <span>Reportar Avería en {provincia.nombre}</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
