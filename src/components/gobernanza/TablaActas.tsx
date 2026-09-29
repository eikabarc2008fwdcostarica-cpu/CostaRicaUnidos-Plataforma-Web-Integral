import React, { FC, useState, useMemo } from 'react';
import { Search, Filter, FileText, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { ActaMunicipal } from '../../data/gobernanzaData';
import { CivicButton } from '../common/CivicButton';
import { CivicBadge } from '../common/CivicBadge';
import { VisorActaModal } from './VisorActaModal';

export interface TablaActasProps {
  actas: ActaMunicipal[];
  isLoading?: boolean;
}

export const TablaActas: FC<TablaActasProps> = ({ actas, isLoading = false }) => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroAnno, setFiltroAnno] = useState<string>('todos');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [actaSeleccionada, setActaSeleccionada] = useState<ActaMunicipal | null>(null);

  const ITEMS_POR_PAGINA = 5;

  // Early return pattern para estado de carga asíncrona (Skeleton)
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <div style={{ height: '48px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', animation: 'civicPing 2s infinite' }} />
        <div style={{ height: '300px', background: 'rgba(255,255,255,0.04)', borderRadius: '16px' }} />
      </div>
    );
  }

  // Filtrado reactivo en memoria
  const actasFiltradas = useMemo(() => {
    return actas.filter((acta) => {
      const coincideTipo = filtroTipo === 'todos' || acta.tipo.toLowerCase() === filtroTipo.toLowerCase();
      const coincideAnno = filtroAnno === 'todos' || acta.anno.toString() === filtroAnno;
      const q = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !q ||
        acta.numeroActa.toLowerCase().includes(q) ||
        acta.resumenEjecutivo.toLowerCase().includes(q) ||
        acta.temasClave.some((t) => t.toLowerCase().includes(q)) ||
        acta.acuerdosDestacados.some((a) => a.descripcion.toLowerCase().includes(q));

      return coincideTipo && coincideAnno && coincideBusqueda;
    });
  }, [actas, filtroTipo, filtroAnno, busqueda]);

  // Paginación
  const totalPaginas = Math.ceil(actasFiltradas.length / ITEMS_POR_PAGINA) || 1;
  const indexInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const actasPaginadas = actasFiltradas.slice(indexInicio, indexInicio + ITEMS_POR_PAGINA);

  const handlePaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  const handlePaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Barra de Filtros y Búsqueda */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Input de Búsqueda */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search
            size={18}
            color="#94A3B8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar por número, tema, acuerdo o palabra clave..."
            aria-label="Buscar actas municipales"
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.4rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: "var(--font-body, sans-serif)"
            }}
          />
        </div>

        {/* Filtros Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={16} color="#94A3B8" />
            <select
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setPaginaActual(1);
              }}
              aria-label="Filtrar por tipo de sesión"
              style={{
                background: 'rgba(0, 4, 13, 0.85)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="todos">Todos los tipos de sesión</option>
              <option value="ordinaria">Sesión Ordinaria</option>
              <option value="extraordinaria">Sesión Extraordinaria</option>
              <option value="solemne">Sesión Solemne</option>
            </select>
          </div>

          <select
            value={filtroAnno}
            onChange={(e) => {
              setFiltroAnno(e.target.value);
              setPaginaActual(1);
            }}
            aria-label="Filtrar por año"
            style={{
              background: 'rgba(0, 4, 13, 0.85)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <option value="todos">Todos los Años</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          {(busqueda || filtroTipo !== 'todos' || filtroAnno !== 'todos') && (
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setFiltroTipo('todos');
                setFiltroAnno('todos');
                setPaginaActual(1);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F87171',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Resultados */}
      {actasPaginadas.length === 0 ? (
        <div
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            color: '#94A3B8'
          }}
        >
          <FileText size={40} color="#64748B" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.35rem' }}>
            No se encontraron actas con los filtros aplicados
          </h4>
          <p style={{ fontSize: '0.875rem' }}>
            Intente con otros términos de búsqueda o restablezca los filtros.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: '0.875rem'
            }}
          >
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <th style={{ padding: '0.9rem 1.25rem', color: '#CBD5E1', fontWeight: 600 }}>Número de Acta</th>
                <th style={{ padding: '0.9rem 1rem', color: '#CBD5E1', fontWeight: 600 }}>Tipo</th>
                <th style={{ padding: '0.9rem 1rem', color: '#CBD5E1', fontWeight: 600 }}>Fecha y Hora</th>
                <th style={{ padding: '0.9rem 1rem', color: '#CBD5E1', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '0.9rem 1.25rem', color: '#CBD5E1', fontWeight: 600, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {actasPaginadas.map((acta, idx) => (
                <tr
                  key={acta.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent')}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} color="#7DD3FC" />
                      <div>
                        <strong style={{ color: '#FFFFFF', display: 'block' }}>{acta.numeroActa}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{acta.presidenteSesion}</span>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <CivicBadge variant={acta.tipo === 'Ordinaria' ? 'default' : 'provincial'} size="sm">
                      {acta.tipo}
                    </CivicBadge>
                  </td>

                  <td style={{ padding: '1rem', fontFamily: "var(--font-telemetry, monospace)", color: '#E2E8F0' }}>
                    <div>{acta.fecha}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{acta.hora}</div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <CivicBadge variant="success" size="sm" dot>
                      {acta.estado}
                    </CivicBadge>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CivicButton
                        variant="secondary"
                        size="sm"
                        leftIcon={<Eye size={14} />}
                        onClick={() => setActaSeleccionada(acta)}
                        aria-label={`Ver acta oficial ${acta.numeroActa}`}
                      >
                        Ver Acta
                      </CivicButton>

                      <a
                        href={acta.pdfUrl}
                        download={`${acta.numeroActa.replace(/\s+/g, '_')}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                        aria-label={`Descargar PDF del acta ${acta.numeroActa}`}
                      >
                        <CivicButton variant="ghost" size="sm" style={{ padding: '0.45rem' }}>
                          <Download size={16} color="#7DD3FC" />
                        </CivicButton>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación Accesible */}
      {totalPaginas > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            padding: '0.5rem 0'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Mostrando {indexInicio + 1} - {Math.min(indexInicio + ITEMS_POR_PAGINA, actasFiltradas.length)} de{' '}
            {actasFiltradas.length} actas oficiales
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CivicButton
              variant="secondary"
              size="sm"
              onClick={handlePaginaAnterior}
              disabled={paginaActual === 1}
              aria-label="Página anterior"
              leftIcon={<ChevronLeft size={16} />}
            >
              Anterior
            </CivicButton>

            <span
              style={{
                fontFamily: "var(--font-telemetry, monospace)",
                fontSize: '0.85rem',
                padding: '0.35rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '6px',
                color: '#FFFFFF'
              }}
            >
              {paginaActual} / {totalPaginas}
            </span>

            <CivicButton
              variant="secondary"
              size="sm"
              onClick={handlePaginaSiguiente}
              disabled={paginaActual === totalPaginas}
              aria-label="Página siguiente"
              rightIcon={<ChevronRight size={16} />}
            >
              Siguiente
            </CivicButton>
          </div>
        </div>
      )}

      {/* Modal con Visor PDF Embebido */}
      <VisorActaModal
        acta={actaSeleccionada}
        isOpen={Boolean(actaSeleccionada)}
        onClose={() => setActaSeleccionada(null)}
      />
    </div>
  );
};

export default TablaActas;
