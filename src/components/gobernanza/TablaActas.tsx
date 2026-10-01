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
          backgroundColor: 'rgba(0, 15, 45, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '1.25rem 1.5rem',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 30px rgba(0, 4, 13, 0.6)'
        }}
      >
        {/* Buscador por Número de Acta o Materia */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search
            size={18}
            color="#79a6ff"
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
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        {/* Filtros por Año y Tipo de Sesión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Selector de Tipo de Sesión */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="#94A3B8" />
            <select
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setPaginaActual(1);
              }}
              aria-label="Filtrar por tipo de sesión municipal"
              style={{
                backgroundColor: 'rgba(0, 8, 25, 0.9)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.18)',
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
              backgroundColor: 'rgba(0, 8, 25, 0.9)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.18)',
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
                color: '#FF6B6B',
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
            backgroundColor: 'rgba(0, 15, 45, 0.4)',
            borderRadius: '18px',
            border: '1px dashed rgba(255, 255, 255, 0.16)',
            color: '#94A3B8'
          }}
        >
          <FileText size={44} color="#64748B" style={{ marginBottom: '0.85rem' }} />
          <h4 style={{ color: '#FFFFFF', fontSize: '1.15rem', marginBottom: '0.4rem', fontWeight: 700 }}>
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
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(0, 15, 45, 0.65)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 12px 40px rgba(0, 4, 13, 0.7)',
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
              color: '#FFFFFF'
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'rgba(0, 20, 137, 0.35)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <th style={{ padding: '1rem 1.25rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Fecha Oficial
                </th>
                <th style={{ padding: '1rem 1.25rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Sesión N°
                </th>
                <th style={{ padding: '1rem 1.5rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Resumen de Acuerdos Tomados
                </th>
                <th style={{ padding: '1rem 1rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Estado de Aprobación
                </th>
                <th style={{ padding: '1rem 1.25rem', color: '#CBD5E1', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {actasPaginadas.map((acta, idx) => (
                <tr
                  key={acta.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent';
                  }}
                >
                  {/* Columna 1: Fecha Oficial */}
                  <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <strong style={{ color: '#FFFFFF', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                        {acta.fecha}
                      </strong>
                      <span style={{ fontSize: '0.76rem', color: '#79a6ff' }}>
                        {acta.hora}
                      </span>
                    </div>
                  </td>

                  {/* Columna 2: Sesión N° */}
                  <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>
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
                              ? 'rgba(251, 191, 36, 0.15)'
                              : acta.tipo === 'Extraordinaria'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(56, 189, 248, 0.15)',
                          color:
                            acta.tipo === 'Solemne'
                              ? '#FBBF24'
                              : acta.tipo === 'Extraordinaria'
                              ? '#F87171'
                              : '#38BDF8',
                          border: `1px solid ${
                            acta.tipo === 'Solemne'
                              ? 'rgba(251, 191, 36, 0.3)'
                              : acta.tipo === 'Extraordinaria'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(56, 189, 248, 0.3)'
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
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.55 }}>
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
                              backgroundColor: 'rgba(0, 20, 137, 0.4)',
                              color: '#79a6ff',
                              border: '1px solid rgba(121, 166, 255, 0.25)'
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
                      <CheckCircle2 size={15} color="#34D399" />
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(52, 211, 153, 0.12)',
                          color: '#34D399',
                          border: '1px solid rgba(52, 211, 153, 0.3)'
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
                          backgroundColor: 'rgba(0, 20, 137, 0.35)',
                          border: '1px solid rgba(121, 166, 255, 0.45)',
                          color: '#FFFFFF',
                          padding: '0.48rem 0.95rem',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#002B7F';
                          e.currentTarget.style.borderColor = '#79a6ff';
                          e.currentTarget.style.boxShadow = '0 0 14px rgba(0, 20, 137, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 20, 137, 0.35)';
                          e.currentTarget.style.borderColor = 'rgba(121, 166, 255, 0.45)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Eye size={15} color="#79a6ff" />
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
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          color: '#CBD5E1',
                          padding: '0.48rem 0.65rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = '#CBD5E1';
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
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(0, 4, 13, 0.4)',
              fontSize: '0.82rem',
              color: '#94A3B8'
            }}
          >
            <div>
              Mostrando <strong style={{ color: '#FFFFFF' }}>{actasPaginadas.length}</strong> de <strong style={{ color: '#FFFFFF' }}>{actasFiltradas.length}</strong> actas oficiales registradas
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handlePaginaAnterior}
                disabled={paginaActual === 1}
                aria-label="Página anterior de actas"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: paginaActual === 1 ? '#475569' : '#FFFFFF',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                <ChevronLeft size={14} />
                <span>Anterior</span>
              </button>

              <span style={{ padding: '0 0.5rem', color: '#CBD5E1', fontWeight: 600 }}>
                Página {paginaActual} de {totalPaginas}
              </span>

              <button
                type="button"
                onClick={handlePaginaSiguiente}
                disabled={paginaActual === totalPaginas}
                aria-label="Página siguiente de actas"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: paginaActual === totalPaginas ? '#475569' : '#FFFFFF',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
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
