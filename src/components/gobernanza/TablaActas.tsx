import React, { FC, useState, useMemo } from 'react';
import { Search, Filter, FileText, Download, Eye, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert, FileCheck } from 'lucide-react';
import { ActaMunicipal } from '../../data/gobernanzaData';
import { CivicBadge } from '../common/CivicBadge';
import { VisorActaModal } from './VisorActaModal';

export interface TablaActasProps {
  actas: ActaMunicipal[];
  isLoading?: boolean;
}

/**
 * TablaActas — Visor Avanzado de Actas y Acuerdos Municipales
 * Diseño formal de Gaceta Municipal • Columnas reglamentarias • Previsualizador Modal Oficial
 * WCAG 2.1 AA Compliant: Alto contraste, semántica de tabla accesible, etiquetas claras
 */
export const TablaActas: FC<TablaActasProps> = ({ actas, isLoading = false }) => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroAnno, setFiltroAnno] = useState<string>('todos');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [actaSeleccionada, setActaSeleccionada] = useState<ActaMunicipal | null>(null);

  const ITEMS_POR_PAGINA = 5;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <div style={{ height: '52px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }} />
        <div style={{ height: '320px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px' }} />
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
        acta.acuerdosDestacados.some((a) => a.descripcion.toLowerCase().includes(q) || a.numeroAcuerdo.toLowerCase().includes(q));

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
      {/* Barra de Filtros Rápidos Estilo Gaceta Municipal */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          backgroundColor: 'var(--cru-surface-card, #FFFFFF)',
          padding: '1.25rem 1.5rem',
          borderRadius: '18px',
          border: '1px solid var(--cru-border, #E2E8F0)',
          boxShadow: 'var(--cru-card-shadow)'
        }}
      >
        {/* Buscador por Número de Acta o Materia */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search
            size={18}
            color="var(--cru-accent-blue)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar por número de acta, materia, acuerdo o tema..."
            aria-label="Buscar actas y acuerdos del concejo municipal"
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              backgroundColor: 'var(--cru-surface-muted)',
              border: '1px solid var(--cru-border-strong)',
              borderRadius: '10px',
              color: 'var(--theme-text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'var(--transition-smooth)'
            }}
          />
        </div>

        {/* Filtros por Año y Tipo de Sesión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Selector de Tipo de Sesión */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--cru-text-muted)" />
            <select
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setPaginaActual(1);
              }}
              aria-label="Filtrar por tipo de sesión municipal"
              style={{
                backgroundColor: 'var(--cru-surface-muted)',
                color: 'var(--theme-text-primary)',
                border: '1px solid var(--cru-border-strong)',
                borderRadius: '10px',
                padding: '0.6rem 0.95rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="todos">Todos los Tipos de Sesión</option>
              <option value="ordinaria">Sesión Ordinaria</option>
              <option value="extraordinaria">Sesión Extraordinaria</option>
              <option value="solemne">Sesión Solemne</option>
            </select>
          </div>

          {/* Selector de Año */}
          <select
            value={filtroAnno}
            onChange={(e) => {
              setFiltroAnno(e.target.value);
              setPaginaActual(1);
            }}
            aria-label="Filtrar por año de la gaceta de actas"
            style={{
              backgroundColor: 'var(--cru-surface-muted)',
              color: 'var(--theme-text-primary)',
              border: '1px solid var(--cru-border-strong)',
              borderRadius: '10px',
              padding: '0.6rem 0.95rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 600
            }}
          >
            <option value="todos">Todos los Años</option>
            <option value="2026">Año 2026</option>
            <option value="2025">Año 2025</option>
            <option value="2024">Año 2024</option>
          </select>

          {/* Botón Restablecer Filtros */}
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
                color: 'var(--cru-accent-red)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla Oficial de la Gaceta Municipal */}
      {actasPaginadas.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--cru-surface-muted)',
            borderRadius: '18px',
            border: '1px dashed #CBD5E1',
            color: 'var(--cru-text-muted)'
          }}
        >
          <FileText size={44} color="var(--cru-accent-blue)" style={{ marginBottom: '0.85rem' }} />
          <h4 style={{ color: 'var(--cru-text, #062A77)', fontSize: '1.15rem', marginBottom: '0.4rem', fontWeight: 700 }}>
            No se encontraron actas con los criterios especificados
          </h4>
          <p style={{ fontSize: '0.88rem', margin: 0 }}>
            Verifique el número de acta o ajuste los selectores de año y tipo de sesión municipal.
          </p>
        </div>
      ) : (
        <div
          className="civic-table-container custom-civic-scrollbar"
          style={{
            overflowX: 'auto',
            borderRadius: '18px',
            border: '1px solid var(--cru-border, #E2E8F0)',
            backgroundColor: 'var(--cru-surface-card, #FFFFFF)',
            boxShadow: 'var(--cru-card-shadow)',
            width: '100%',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth: '760px',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.88rem',
              color: 'var(--theme-text-primary)'
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--cru-surface-muted)',
                  borderBottom: '1.5px solid var(--cru-border, #E2E8F0)'
                }}
              >
                <th style={{ padding: '1rem 1.25rem', color: 'var(--cru-text, #062A77)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Fecha Oficial
                </th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--cru-text, #062A77)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Sesión N°
                </th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--cru-text, #062A77)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Resumen de Acuerdos Tomados
                </th>
                <th style={{ padding: '1rem 1rem', color: 'var(--cru-text, #062A77)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Estado de Aprobación
                </th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--cru-text, #062A77)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {actasPaginadas.map((acta, idx) => (
                <tr
                  key={acta.id}
                  style={{
                    borderBottom: '1px solid var(--cru-border, #E2E8F0)',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EFF6FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF';
                  }}
                >
                  {/* Columna 1: Fecha Oficial */}
                  <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <strong style={{ color: 'var(--cru-text, #062A77)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                        {acta.fecha}
                      </strong>
                      <span style={{ fontSize: '0.76rem', color: 'var(--cru-text-muted)', fontWeight: 600 }}>
                        {acta.hora}
                      </span>
                    </div>
                  </td>

                  {/* Columna 2: Sesión N° */}
                  <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--cru-text, #062A77)', fontSize: '0.92rem' }}>
                        {acta.numeroActa}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '9999px',
                          display: 'inline-block',
                          width: 'fit-content',
                          textTransform: 'uppercase',
                          backgroundColor:
                            acta.tipo === 'Solemne'
                              ? '#FEF3C7'
                              : acta.tipo === 'Extraordinaria'
                              ? '#FEE2E2'
                              : '#E0F2FE',
                          color:
                            acta.tipo === 'Solemne'
                              ? '#B45309'
                              : acta.tipo === 'Extraordinaria'
                              ? '#B91C1C'
                              : '#0369A1',
                          border: `1px solid ${
                            acta.tipo === 'Solemne'
                              ? 'var(--cru-accent-amber-border)'
                              : acta.tipo === 'Extraordinaria'
                              ? '#FECACA'
                              : '#BAE6FD'
                          }`
                        }}
                      >
                        Sesión {acta.tipo}
                      </span>
                    </div>
                  </td>

                  {/* Columna 3: Resumen de Acuerdos Tomados */}
                  <td style={{ padding: '1.15rem 1.5rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--cru-text-secondary, #334155)', lineHeight: 1.55 }}>
                        {acta.resumenEjecutivo}
                      </p>

                      {/* Lista de Acuerdos Principales de la Sesión */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                        {acta.acuerdosDestacados.map((a) => (
                          <span
                            key={a.numeroAcuerdo}
                            style={{
                              fontSize: '0.72rem',
                              fontFamily: 'monospace',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              backgroundColor: 'var(--cru-accent-blue-bg)',
                              color: 'var(--cru-accent-blue)',
                              border: '1px solid var(--cru-accent-blue-border)',
                              fontWeight: 600
                            }}
                            title={a.descripcion}
                          >
                            {a.numeroAcuerdo} ({a.votacion})
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Columna 4: Estado de Aprobación */}
                  <td style={{ padding: '1.15rem 1rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={15} color="var(--cru-accent-green)" />
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(5, 150, 105, 0.1)',
                          color: 'var(--cru-accent-green)',
                          border: '1px solid rgba(5, 150, 105, 0.25)'
                        }}
                      >
                        {acta.estado}
                      </span>
                    </div>
                  </td>

                  {/* Columna 5: Acciones (Previsualizar + Descargar) */}
                  <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                      {/* Botón Principal: Previsualizar Documento Oficial */}
                      <button
                        type="button"
                        onClick={() => setActaSeleccionada(acta)}
                        aria-label={`Previsualizar Documento Oficial del ${acta.numeroActa}`}
                        style={{
                          backgroundColor: 'var(--cru-accent-blue)',
                          border: 'none',
                          color: '#FFFFFF',
                          padding: '0.48rem 0.95rem',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          transition: 'var(--transition-smooth)',
                          boxShadow: 'var(--shadow-card, 0 2px 6px -1px rgba(6, 42, 119, 0.08))'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#062A77';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#0053AF';
                        }}
                      >
                        <Eye size={15} color="#FFFFFF" />
                        <span>Previsualizar Documento Oficial</span>
                      </button>

                      {/* Botón Descarga Rápida */}
                      <a
                        href={acta.pdfUrl}
                        download={`${acta.numeroActa.replace(/\s+/g, '_')}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Descargar archivo PDF del ${acta.numeroActa}`}
                        style={{
                          backgroundColor: 'var(--cru-surface-muted)',
                          border: '1px solid var(--cru-border-strong)',
                          color: 'var(--cru-text)',
                          padding: '0.48rem 0.65rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'var(--transition-smooth)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E2E8F0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F1F5F9';
                        }}
                      >
                        <Download size={15} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Barra de Paginación de la Gaceta */}
          <div
            style={{
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              borderTop: '1px solid var(--cru-border, #E2E8F0)',
              backgroundColor: 'var(--cru-surface-muted)',
              fontSize: '0.82rem',
              color: 'var(--cru-text-muted)'
            }}
          >
            <div>
              Mostrando <strong style={{ color: 'var(--cru-text, #062A77)' }}>{actasPaginadas.length}</strong> de <strong style={{ color: 'var(--cru-text, #062A77)' }}>{actasFiltradas.length}</strong> actas oficiales registradas
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handlePaginaAnterior}
                disabled={paginaActual === 1}
                aria-label="Página anterior de actas"
                style={{
                  backgroundColor: 'var(--cru-surface-card)',
                  border: '1px solid var(--cru-border-strong)',
                  color: paginaActual === 1 ? '#94A3B8' : '#062A77',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'var(--transition-smooth)'
                }}
              >
                <ChevronLeft size={14} />
                <span>Anterior</span>
              </button>

              <span style={{ padding: '0 0.5rem', color: 'var(--cru-text-soft)', fontWeight: 600 }}>
                Página {paginaActual} de {totalPaginas}
              </span>

              <button
                type="button"
                onClick={handlePaginaSiguiente}
                disabled={paginaActual === totalPaginas}
                aria-label="Página siguiente de actas"
                style={{
                  backgroundColor: 'var(--cru-surface-card)',
                  border: '1px solid var(--cru-border-strong)',
                  color: paginaActual === totalPaginas ? '#94A3B8' : '#062A77',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'var(--transition-smooth)'
                }}
              >
                <span>Siguiente</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visor de Documento Oficial con Fe Pública */}
      <VisorActaModal
        acta={actaSeleccionada}
        isOpen={Boolean(actaSeleccionada)}
        onClose={() => setActaSeleccionada(null)}
      />
    </div>
  );
};

export default TablaActas;
