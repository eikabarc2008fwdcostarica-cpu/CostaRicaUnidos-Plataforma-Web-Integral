/**
 * ============================================================================
 * COSTA RICA UNIDOS — TELEMETRÍA PROVINCIAL Y ANALÍTICA TERRITORIAL
 * Design System: Sovereign Civic Glass v2.1
 * ============================================================================
 * 
 * Funcionalidades:
 * - 4 Tarjetas de KPIs clave:
 *   1. Tasa de Resolución de Incidencias (Total recibidas vs. Solucionadas con %).
 *   2. Tiempo Promedio de Respuesta (en horas con JetBrains Mono).
 *   3. Cantón con mayor carga de reportes activos.
 *   4. Albergues activos y personas refugiadas totales.
 * - Resumen cantonal: Gráfico de barras y tabla puramente CSS nativo sin librerías pesadas.
 * - Cálculos puros en JavaScript y diseño responsivo.
 */
import React, { useState, useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Home,
  TrendingUp,
  MapPin,
  Compass,
  ArrowUpRight,
  Filter,
  BarChart2,
  ShieldAlert,
  HardHat,
  Radio,
  FileCheck
} from 'lucide-react';
import { PROVINCIAS_COSTA_RICA } from '../../context/AuthContext';

// Datos cantones con métricas viales e incidencias (Provincia de Puntarenas)
const METRICAS_CANTONALES_PUNTARENAS = [
  { canton: 'Puntarenas (Central)', recibidas: 42, solucionadas: 35, activas: 7, tiempoMedioHoras: 3.8, cuadrillasActivas: 6 },
  { canton: 'Osa (Ciudad Cortés)', recibidas: 26, solucionadas: 19, activas: 7, tiempoMedioHoras: 5.2, cuadrillasActivas: 4 },
  { canton: 'Quepos', recibidas: 21, solucionadas: 18, activas: 3, tiempoMedioHoras: 3.1, cuadrillasActivas: 3 },
  { canton: 'Garabito (Jacó)', recibidas: 19, solucionadas: 16, activas: 3, tiempoMedioHoras: 2.9, cuadrillasActivas: 3 },
  { canton: 'Esparza', recibidas: 16, solucionadas: 14, activas: 2, tiempoMedioHoras: 2.4, cuadrillasActivas: 2 },
  { canton: 'Golfito', recibidas: 15, solucionadas: 11, activas: 4, tiempoMedioHoras: 6.0, cuadrillasActivas: 2 },
  { canton: 'Buenos Aires', recibidas: 14, solucionadas: 12, activas: 2, tiempoMedioHoras: 4.5, cuadrillasActivas: 2 },
  { canton: 'Coto Brus', recibidas: 11, solucionadas: 10, activas: 1, tiempoMedioHoras: 3.6, cuadrillasActivas: 2 },
  { canton: 'Parrita', recibidas: 9, solucionadas: 8, activas: 1, tiempoMedioHoras: 3.2, cuadrillasActivas: 1 },
  { canton: 'Corredores', recibidas: 8, solucionadas: 7, activas: 1, tiempoMedioHoras: 4.1, cuadrillasActivas: 2 },
  { canton: 'Monteverde', recibidas: 6, solucionadas: 6, activas: 0, tiempoMedioHoras: 2.1, cuadrillasActivas: 1 },
  { canton: 'Montes de Oro', recibidas: 5, solucionadas: 5, activas: 0, tiempoMedioHoras: 2.0, cuadrillasActivas: 1 },
  { canton: 'Puerto Jiménez', recibidas: 4, solucionadas: 3, activas: 1, tiempoMedioHoras: 4.8, cuadrillasActivas: 1 }
];

export default function ProvincialTelemetry({
  provinciaTheme = {
    primary: '#F36717',
    glow: 'rgba(243, 103, 23, 0.4)',
    nombre: 'Puntarenas'
  }
}) {
  const [ordenMetrica, setOrdenMetrica] = useState('recibidas'); // 'recibidas', 'activas', 'solucionadas'
  const [vistaGrafica, setVistaGrafica] = useState('ambas'); // 'barras', 'tabla', 'ambas'

  // Cálculos Puros en JavaScript de los KPIs Globales
  const metricasGlobales = useMemo(() => {
    const totalRecibidas = METRICAS_CANTONALES_PUNTARENAS.reduce((acc, c) => acc + c.recibidas, 0);
    const totalSolucionadas = METRICAS_CANTONALES_PUNTARENAS.reduce((acc, c) => acc + c.solucionadas, 0);
    const totalActivas = METRICAS_CANTONALES_PUNTARENAS.reduce((acc, c) => acc + c.activas, 0);

    const tasaResolucion = totalRecibidas > 0 ? ((totalSolucionadas / totalRecibidas) * 100).toFixed(1) : '0';

    // Tiempo promedio ponderado en horas
    const sumaTiempos = METRICAS_CANTONALES_PUNTARENAS.reduce((acc, c) => acc + c.tiempoMedioHoras * c.recibidas, 0);
    const tiempoPromedioGlobal = totalRecibidas > 0 ? (sumaTiempos / totalRecibidas).toFixed(1) : '0.0';

    // Cantón con mayor carga de reportes activos
    const cantonMayorCarga = [...METRICAS_CANTONALES_PUNTARENAS].sort((a, b) => b.activas - a.activas)[0];

    // Albergues activos y personas refugiadas (datos sincronizados)
    const alberguesActivosTotal = 4;
    const personasRefugiadasTotal = 490;
    const capacidadInstaladaTotal = 1330;

    return {
      totalRecibidas,
      totalSolucionadas,
      totalActivas,
      tasaResolucion,
      tiempoPromedioGlobal,
      cantonMayorCarga,
      alberguesActivosTotal,
      personasRefugiadasTotal,
      capacidadInstaladaTotal
    };
  }, []);

  // Ordenamiento cantonal para las barras CSS
  const cantonesOrdenados = useMemo(() => {
    return [...METRICAS_CANTONALES_PUNTARENAS].sort((a, b) => {
      if (ordenMetrica === 'activas') return b.activas - a.activas;
      if (ordenMetrica === 'solucionadas') return b.solucionadas - a.solucionadas;
      return b.recibidas - a.recibidas;
    });
  }, [ordenMetrica]);

  // Valor máximo para normalizar el ancho de las barras CSS (100%)
  const maxValor = useMemo(() => {
    return Math.max(...METRICAS_CANTONALES_PUNTARENAS.map((c) => c[ordenMetrica]), 1);
  }, [ordenMetrica]);

  return (
    <div
      style={{
        backgroundColor: 'rgba(5, 12, 28, 0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        position: 'relative'
      }}
    >
      {/* =================================================================== */}
      {/* CABECERA DE TELEMETRÍA PROVINCIAL                                   */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${provinciaTheme.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${provinciaTheme.glow}`
            }}
          >
            <Activity size={22} color={provinciaTheme.primary} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "'Mistical Spring', Georgia, serif",
                fontSize: '1.38rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '0.02em'
              }}
            >
              Telemetría y Rendimiento Territorial
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Supervisión de indicadores de respuesta, carga cantonal y capacidad instalada en {provinciaTheme.nombre}.
            </p>
          </div>
        </div>

        {/* Badge de telemetría viva */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 700
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }}
          />
          <span>MÉTRICAS CALCULADAS EN TIEMPO REAL</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. LAS 4 TARJETAS DE KPIS CLAVE OBLIGATORIAS                       */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* KPI 1: Tasa de Resolución de Incidencias */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              Tasa de Resolución
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={18} color="#10B981" />
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}
            >
              {metricasGlobales.tasaResolucion}%
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: '#CBD5E1',
                marginTop: '0.45rem',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              <strong style={{ color: '#10B981' }}>{metricasGlobales.totalSolucionadas}</strong> solucionadas de{' '}
              <strong style={{ color: '#F8FAFC' }}>{metricasGlobales.totalRecibidas}</strong> recibidas
            </div>
          </div>

          {/* Barra de progreso mini */}
          <div
            style={{
              marginTop: '0.75rem',
              height: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${metricasGlobales.tasaResolucion}%`,
                background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                borderRadius: '3px'
              }}
            />
          </div>
        </div>

        {/* KPI 2: Tiempo Promedio de Respuesta */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 8px #38BDF8'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              Tiempo Medio de Respuesta
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={18} color="#38BDF8" />
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#38BDF8',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}
            >
              {metricasGlobales.tiempoPromedioGlobal} <span style={{ fontSize: '1.15rem' }}>horas</span>
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: '#CBD5E1',
                marginTop: '0.45rem',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              Meta SLA Provincial: <strong style={{ color: '#F8FAFC' }}>6.0h</strong> (Cumplimiento óptimo)
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowUpRight size={13} />
            <span>-1.4h de mejora con respecto al mes anterior</span>
          </div>
        </div>

        {/* KPI 3: Cantón con Mayor Carga de Reportes Activos */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: '#F59E0B',
              boxShadow: '0 0 8px #F59E0B'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              Cantón de Mayor Demanda
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={18} color="#F59E0B" />
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2
              }}
            >
              {metricasGlobales.cantonMayorCarga.canton}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#FBBF24',
                marginTop: '0.45rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700
              }}
            >
              {metricasGlobales.cantonMayorCarga.activas} reportes activos ({metricasGlobales.cantonMayorCarga.recibidas} acumulados)
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#94A3B8' }}>
            Cuadrillas asignadas en cantón: <strong style={{ color: '#F8FAFC' }}>{metricasGlobales.cantonMayorCarga.cuadrillasActivas} equipos MOPT/AyA</strong>
          </div>
        </div>

        {/* KPI 4: Albergues Activos y Personas Refugiadas Totales */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: '#A855F7',
              boxShadow: '0 0 8px #A855F7'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              Albergues y Refugio CNE
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Home size={18} color="#A855F7" />
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}
            >
              {metricasGlobales.personasRefugiadasTotal}{' '}
              <span style={{ fontSize: '1rem', color: '#C084FC', fontWeight: 700 }}>personas</span>
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: '#CBD5E1',
                marginTop: '0.45rem',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              <strong style={{ color: '#A855F7' }}>{metricasGlobales.alberguesActivosTotal} albergues activos</strong> ({Math.round((metricasGlobales.personasRefugiadasTotal / metricasGlobales.capacidadInstaladaTotal) * 100)}% ocupación)
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#94A3B8' }}>
            Capacidad provincial libre: <strong style={{ color: '#10B981' }}>{metricasGlobales.capacidadInstaladaTotal - metricasGlobales.personasRefugiadasTotal} plazas disponibles</strong>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. RESUMEN CANTONAL: GRÁFICO DE BARRAS NATIVO EN CSS PURO           */}
      {/* =================================================================== */}
      <section
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.5rem'
        }}
      >
        {/* Controles de Vista y Orden */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h4
              style={{
                fontFamily: "'Mistical Spring', Georgia, serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <BarChart2 size={20} color={provinciaTheme.primary} />
              Distribución Territorial de Incidencias por Cantón ({provinciaTheme.nombre})
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Gráfico comparativo resuelto mediante flexbox y barras porcentuales CSS nativas.
            </p>
          </div>

          {/* Filtros de Orden y Modo de Vista */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Selector de Modo de Vista */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Vista:</span>
              <button
                onClick={() => setVistaGrafica('barras')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: vistaGrafica === 'barras' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: vistaGrafica === 'barras' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 700
                }}
              >
                Barras CSS
              </button>
              <button
                onClick={() => setVistaGrafica('tabla')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: vistaGrafica === 'tabla' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: vistaGrafica === 'tabla' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 700
                }}
              >
                Tabla
              </button>
              <button
                onClick={() => setVistaGrafica('ambas')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: vistaGrafica === 'ambas' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: vistaGrafica === 'ambas' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 700
                }}
              >
                Ambas
              </button>
            </div>

            {/* Ordenamiento */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Ordenar por:</span>
              <button
                onClick={() => setOrdenMetrica('recibidas')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: ordenMetrica === 'recibidas' ? provinciaTheme.primary : 'transparent',
                  color: ordenMetrica === 'recibidas' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 700
                }}
              >
                Total
              </button>
              <button
                onClick={() => setOrdenMetrica('activas')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: ordenMetrica === 'activas' ? '#F59E0B' : 'transparent',
                  color: ordenMetrica === 'activas' ? '#000000' : '#94A3B8',
                  fontWeight: 700
                }}
              >
                Activas
              </button>
              <button
                onClick={() => setOrdenMetrica('solucionadas')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: ordenMetrica === 'solucionadas' ? '#10B981' : 'transparent',
                  color: ordenMetrica === 'solucionadas' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 700
                }}
              >
                Solucionadas
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* VISTA 1: GRÁFICO DE BARRAS PORCENTUALES NATIVAS EN CSS              */}
        {/* =================================================================== */}
        {(vistaGrafica === 'barras' || vistaGrafica === 'ambas') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: vistaGrafica === 'ambas' ? '2rem' : 0 }}>
            {cantonesOrdenados.map((canton) => {
              const valorActual = canton[ordenMetrica];
              const porcentajeBarra = Math.max(4, Math.round((valorActual / maxValor) * 100));
              const tasaCanton = Math.round((canton.solucionadas / canton.recibidas) * 100);

              return (
                <div
                  key={canton.canton}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.015)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.015)')}
                >
                  {/* Nombre del Cantón */}
                  <div style={{ width: '180px', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#F8FAFC' }}>
                      {canton.canton}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                      Respuesta: {canton.tiempoMedioHoras}h promedio
                    </div>
                  </div>

                  {/* Contenedor de la Barra CSS */}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div
                      style={{
                        height: '18px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        display: 'flex'
                      }}
                    >
                      {/* Barra con Gradiente según la métrica */}
                      <div
                        style={{
                          height: '100%',
                          width: `${porcentajeBarra}%`,
                          background:
                            ordenMetrica === 'activas'
                              ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'
                              : ordenMetrica === 'solucionadas'
                              ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                              : `linear-gradient(90deg, ${provinciaTheme.primary} 0%, rgba(255, 255, 255, 0.4) 100%)`,
                          borderRadius: '6px',
                          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: `0 0 10px ${provinciaTheme.glow}`
                        }}
                      />
                    </div>
                  </div>

                  {/* Valores Numéricos al Costado */}
                  <div
                    style={{
                      width: '180px',
                      flexShrink: 0,
                      textAlign: 'right',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.75rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.78rem'
                    }}
                  >
                    <span style={{ color: '#FFFFFF', fontWeight: 800 }}>
                      {valorActual} <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{ordenMetrica}</span>
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        backgroundColor: tasaCanton >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: tasaCanton >= 80 ? '#34D399' : '#FBBF24',
                        border: `1px solid ${tasaCanton >= 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}
                    >
                      {tasaCanton}% resuelto
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================================== */}
        {/* VISTA 2: TABLA RESUMEN CANTONAL EN HTML SEMÁNTICO Y CSS             */}
        {/* =================================================================== */}
        {(vistaGrafica === 'tabla' || vistaGrafica === 'ambas') && (
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.82rem',
                textAlign: 'left'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94A3B8',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.72rem',
                    textTransform: 'uppercase'
                  }}
                >
                  <th style={{ padding: '0.75rem 1rem' }}>Cantón</th>
                  <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>Recibidas</th>
                  <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>Solucionadas</th>
                  <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>Activas</th>
                  <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>Tasa Res.</th>
                  <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>Tiempo Prom.</th>
                  <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>Cuadrillas</th>
                </tr>
              </thead>
              <tbody>
                {cantonesOrdenados.map((c, idx) => {
                  const tasa = Math.round((c.solucionadas / c.recibidas) * 100);
                  return (
                    <tr
                      key={c.canton}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)')}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#F8FAFC' }}>
                        {c.canton}
                      </td>
                      <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#E2E8F0' }}>
                        {c.recibidas}
                      </td>
                      <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#10B981', fontWeight: 700 }}>
                        {c.solucionadas}
                      </td>
                      <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: c.activas > 0 ? '#F59E0B' : '#94A3B8', fontWeight: 700 }}>
                        {c.activas}
                      </td>
                      <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: tasa >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: tasa >= 80 ? '#34D399' : '#FBBF24',
                            border: `1px solid ${tasa >= 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                          }}
                        >
                          {tasa}%
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#38BDF8' }}>
                        {c.tiempoMedioHoras}h
                      </td>
                      <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#CBD5E1' }}>
                        {c.cuadrillasActivas} eq.
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
