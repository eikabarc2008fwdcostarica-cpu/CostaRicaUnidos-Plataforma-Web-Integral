import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  Compass,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Tag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

/**
 * Componente Base (Scaffolding): Comercio y Ferias Provinciales
 * Módulo 08/M10 — Ferias del Agricultor, PYMES y Fomento Turístico Local
 */
export default function ProvinciaComercio({ provincia }) {
  // Módulos temáticos del ecosistema económico provincial
  const pilaresComerciales = [
    {
      id: 'feria',
      titulo: `Feria del Agricultor — ${provincia.nombre}`,
      descripcion: `Venta directa de frutas, hortalizas y lácteos frescos cosechados por productores y familias campesinas de ${provincia.nombre}.`,
      etiqueta: 'FERIA CANTONAL',
      colorBadge: '#10B981',
      enlace: '/feria',
      textoBoton: 'Ver Puestos y Horarios',
      icono: Store
    },
    {
      id: 'pymes',
      titulo: `Directorio de PYMES y Patentes`,
      descripcion: `Comercios comunales, talleres artesanales y servicios profesionales verificados ante los gobiernos locales de la provincia.`,
      etiqueta: 'EMPRENDIMIENTO',
      colorBadge: '#38BDF8',
      enlace: '/comercio',
      textoBoton: 'Directorio Comercial',
      icono: ShoppingBag
    },
    {
      id: 'turismo',
      titulo: `Rutas Ecoturísticas & Patrimonio`,
      descripcion: `Atracciones naturales, reservas biológicas, volcanes y patrimonio cultural representativo de ${provincia.nombre}.`,
      etiqueta: 'TURISMO SOSTENIBLE',
      colorBadge: '#F59E0B',
      enlace: '/turismo',
      textoBoton: 'Explorar Rutas',
      icono: Compass
    }
  ];

  // Comercios y productores representativos en scaffolding
  const comerciosMock = [
    {
      id: 1,
      nombre: `Cooperativa de Productores de ${provincia.cabecera}`,
      categoria: 'Agroindustria & Café',
      canton: provincia.cabecera,
      sello: 'Sello Cantonal Verificado'
    },
    {
      id: 2,
      nombre: `Asociación de Artesanos Tradicionales de ${provincia.nombre}`,
      categoria: 'Artesanía & Cultura',
      canton: `${provincia.nombre} Central`,
      sello: 'Comercio Justo'
    },
    {
      id: 3,
      nombre: `Red de Turismo Rural y Comunitario`,
      categoria: 'Ecoturismo Sostenible',
      canton: `Cantones Rurales`,
      sello: 'Certificado de Sostenibilidad'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Encabezado del Módulo de Comercio */}
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
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F59E0B'
            }}
          >
            <ShoppingBag size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#F59E0B',
                  fontFamily: 'monospace'
                }}
              >
                M08/M10 • ECONOMÍA, FERIAS & PYMES
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: '#FBBF24',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                Producción Local 100%
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0 0' }}>
              Comercio Comunal, Ferias del Agricultor y PYMES — {provincia.nombre}
            </h3>
          </div>
        </div>

        {/* Botón de Registro de Negocio */}
        <Link
          to="/comercio"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            padding: '0.55rem 1.15rem',
            color: '#FBBF24',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <span>Registrar Comercio Local</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 3 Pilares Principales de la Economía Provincial */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.25rem'
        }}
      >
        {pilaresComerciales.map((pilar) => {
          const Icono = pilar.icono;
          return (
            <div
              key={pilar.id}
              style={{
                backgroundColor: 'rgba(0, 10, 28, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${pilar.colorBadge}50`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: `${pilar.colorBadge}15`,
                      border: `1px solid ${pilar.colorBadge}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: pilar.colorBadge
                    }}
                  >
                    <Icono size={18} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: pilar.colorBadge,
                      backgroundColor: `${pilar.colorBadge}10`,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${pilar.colorBadge}30`
                    }}
                  >
                    {pilar.etiqueta}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
                  {pilar.titulo}
                </h4>
                <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: '#94A3B8', margin: 0 }}>
                  {pilar.descripcion}
                </p>
              </div>

              <Link
                to={pilar.enlace}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <span>{pilar.textoBoton}</span>
                <ArrowRight size={13} color={pilar.colorBadge} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Muestra de Productores y Comercios Locales */}
      <div>
        <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.75rem' }}>
          Emprendimientos y Cooperativas Destacadas en {provincia.nombre}:
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '0.85rem'
          }}
        >
          {comerciosMock.map((comercio) => (
            <div
              key={comercio.id}
              style={{
                backgroundColor: 'rgba(0, 10, 28, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
                  {comercio.nombre}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {comercio.categoria} • {comercio.canton}
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  color: '#34D399',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                {comercio.sello}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scaffolding de Conexión de Datos */}
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
        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
          Base técnica M08/M10: Sincronización en tiempo real con las colecciones de ferias y solicitudes de patente comercial de <strong>db.json</strong>.
        </span>
        <Link
          to="/feria"
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
            textDecoration: 'none'
          }}
        >
          <span>Ver Ferias del Agricultor</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
