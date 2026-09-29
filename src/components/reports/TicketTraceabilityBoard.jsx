import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, MapPin, Building2, Construction, Lightbulb, Droplets, Trash2, AlertTriangle } from 'lucide-react';
import { getTickets, buscarTicketPorId, ESTADOS_TICKET } from './ticketService';

function getCategoryIcon(categoria, size = 18) {
  switch (categoria) {
    case 'hueco_vial':
      return <Construction size={size} color="#FF6B6B" />;
    case 'luminaria':
      return <Lightbulb size={size} color="#FBBF24" />;
    case 'fuga_agua':
      return <Droplets size={size} color="#38BDF8" />;
    case 'basurero':
      return <Trash2 size={size} color="#34D399" />;
    default:
      return <AlertTriangle size={size} color="#F59E0B" />;
  }
}

export default function TicketTraceabilityBoard({
  initialTicketId = null,
  onGoToNewReport
}) {
  const [searchTerm, setSearchTerm] = useState(initialTicketId || '');
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketsList, setTicketsList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [copiedId, setCopiedId] = useState(false);

  // Cargar tickets de almacenamiento local al montar
  useEffect(() => {
    const todos = getTickets();
    setTicketsList(todos);

    if (initialTicketId) {
      const match = buscarTicketPorId(initialTicketId);
      if (match) setActiveTicket(match);
    } else if (todos.length > 0) {
      setActiveTicket(todos[0]);
    }
  }, [initialTicketId]);

  // Manejar búsqueda por ID de ticket
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const found = buscarTicketPorId(searchTerm.trim());
    if (found) {
      setActiveTicket(found);
    } else {
      alert(`No se encontró ningún reporte con el identificador: ${searchTerm}`);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtrado de la lista pública
  const ticketsFiltrados = ticketsList.filter((t) => {
    if (filterStatus === 'todos') return true;
    return t.estado === filterStatus;
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Cabecera del Tablero de Trazabilidad */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.4)' }}>
          TRANSPARENCIA CÍVICA &bull; AUDITORÍA CIUDADANA EN TIEMPO REAL
        </span>
        <h3 style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginTop: '0.6rem',
          marginBottom: '0.35rem'
        }}>
          Tablero Público de Trazabilidad de Incidencias
        </h3>
        <p style={{ color: '#CBD5E1', fontSize: '0.92rem', maxWidth: '680px', margin: '0 auto' }}>
          Consulte el avance físico y administrativo de los tickets emitidos. La ciudadanía puede auditar el cumplimiento de los tiempos de respuesta municipal.
        </p>
      </div>

      {/* Buscador de Tickets por Identificador Estandarizado */}
      <div className="civic-glass-card" style={{ padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#79a6ff', display: 'flex', alignItems: 'center' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código de ticket: REP-PUN-ESP-2026-0042..."
              aria-label="Buscar reporte por código"
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 2.8rem',
                backgroundColor: 'rgba(0, 10, 30, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-sovereign-blue"
            style={{ padding: '0.9rem 1.6rem', fontSize: '0.92rem', fontWeight: 700 }}
          >
            Rastrear Incidencia
          </button>

          {onGoToNewReport && (
            <button
              type="button"
              onClick={onGoToNewReport}
              className="btn-sovereign"
              style={{ padding: '0.9rem 1.4rem', fontSize: '0.92rem' }}
            >
              + Nuevo Reporte
            </button>
          )}
        </form>
      </div>

      {/* Detalle del Ticket Activo con Barra de Progreso de 4 Estados */}
      {activeTicket && (
        <div
          className="civic-glass-card"
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            borderRadius: '24px',
            marginBottom: '3rem',
            border: '1px solid rgba(121, 166, 255, 0.3)',
            boxShadow: '0 15px 45px rgba(0, 4, 13, 0.8), 0 0 25px rgba(0, 43, 127, 0.35)'
          }}
        >
          {/* Header del Ticket */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCategoryIcon(activeTicket.categoria, 22)}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-telemetry)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em'
                }}>
                  {activeTicket.reportId}
                </h4>

                <button
                  type="button"
                  onClick={() => handleCopyId(activeTicket.reportId)}
                  className="btn-glass-secondary"
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {copiedId ? <Check size={12} color="#00D166" /> : <Copy size={12} />}
                  <span>{copiedId ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div style={{ color: '#CBD5E1', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                <strong>{activeTicket.categoriaTitulo}</strong> &bull; {activeTicket.provincia} › {activeTicket.canton} › {activeTicket.distrito}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                className="telemetry-badge"
                style={{
                  backgroundColor: ESTADOS_TICKET[activeTicket.estado]?.badgeBg || 'rgba(0, 43, 127, 0.5)',
                  borderColor: ESTADOS_TICKET[activeTicket.estado]?.color || '#79a6ff',
                  color: ESTADOS_TICKET[activeTicket.estado]?.color || '#79a6ff',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                ESTADO: {ESTADOS_TICKET[activeTicket.estado]?.label.toUpperCase()}
              </span>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.4rem', fontFamily: 'var(--font-telemetry)' }}>
                Registrado: {activeTicket.fechaRegistro.split('T')[0]}
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESO VISUAL: 4 ESTADOS
              1. Recibido ➔ 2. En Inspección ➔ 3. En Trámite ➔ 4. Solucionado */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              maxWidth: '850px',
              margin: '0 auto'
            }}>
              {/* Línea de fondo conectora */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '22px',
                  left: '40px',
                  right: '40px',
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1
                }}
              />

              {/* Línea activa con resplandor */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '22px',
                  left: '40px',
                  width: `${((ESTADOS_TICKET[activeTicket.estado]?.step - 1) / 3) * 100}%`,
                  height: '4px',
                  background: 'linear-gradient(90deg, #3B82F6 0%, #00D166 100%)',
                  boxShadow: '0 0 12px #00D166',
                  zIndex: 2,
                  transition: 'width 0.5s ease'
                }}
              />

              {/* Los 4 Pasos de Trazabilidad */}
              {Object.values(ESTADOS_TICKET).map((st) => {
                const currentStep = ESTADOS_TICKET[activeTicket.estado]?.step || 1;
                const isPassed = st.step <= currentStep;
                const isCurrent = st.step === currentStep;

                return (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 3,
                      flex: 1
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: isPassed ? st.color : 'rgba(0, 10, 30, 0.9)',
                        border: `3px solid ${isCurrent ? '#FFFFFF' : isPassed ? st.color : 'rgba(255, 255, 255, 0.2)'}`,
                        boxShadow: isCurrent ? `0 0 20px ${st.color}` : 'none',
                        color: isPassed ? '#00040D' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isPassed && !isCurrent ? '✓' : st.step}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? '#FFFFFF' : isPassed ? '#E2E8F0' : '#64748B'
                      }}>
                        {st.label}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: isCurrent ? st.color : '#64748B',
                        fontFamily: 'var(--font-telemetry)'
                      }}>
                        {isCurrent ? '● Fase Activa' : isPassed ? 'Completado' : 'Pendiente'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid de Datos Técnicos y Línea de Tiempo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Información Territorial y Evidencia */}
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                Datos de Ubicación y Evidencia
              </h5>

              <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                <strong>Dirección exacta:</strong> {activeTicket.direccionExacta}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.8rem',
                color: '#79a6ff',
                marginBottom: '1rem'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> COORDENADAS:</span>
                <span>{activeTicket.coordenadas?.lat.toFixed(5)}, {activeTicket.coordenadas?.lng.toFixed(5)}</span>
              </div>

              {activeTicket.imagen?.url && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                    Fotografía Comprimida WebP ({activeTicket.imagen.pesoComprimido || '< 1 MB'}):
                  </div>
                  <img
                    src={activeTicket.imagen.url}
                    alt="Evidencia del reporte"
                    style={{
                      width: '100%',
                      maxHeight: '180px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Línea de Tiempo del Historial de Inspección */}
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                Historial de Gestión y Fiscalización
              </h5>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '0.5rem'
              }}>
                {(activeTicket.historial || []).map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderLeft: `3px solid ${ESTADOS_TICKET[h.estado]?.color || '#79a6ff'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94A3B8', fontFamily: 'var(--font-telemetry)', marginBottom: '0.2rem' }}>
                      <span style={{ color: ESTADOS_TICKET[h.estado]?.color || '#79a6ff', fontWeight: 700 }}>
                        {ESTADOS_TICKET[h.estado]?.label.toUpperCase()}
                      </span>
                      <span>{h.fecha}</span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.4 }}>
                      {h.nota || h.descripcion}
                    </p>
                  </div>
                ))}
              </div>

              {activeTicket.entidadResponsable && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 43, 127, 0.25)',
                  border: '1px solid rgba(121, 166, 255, 0.2)',
                  fontSize: '0.8rem',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Building2 size={15} color="#79a6ff" /> <span><strong>Unidad Técnica Asignada:</strong> {activeTicket.entidadResponsable}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista Pública de Incidencias Comunitarias Recientes */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Incidencias Comunitarias Registradas ({ticketsFiltrados.length})
          </h4>

          {/* Filtros por Estado */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['todos', 'recibido', 'en_inspeccion', 'en_tramite', 'solucionado'].map((stKey) => (
              <button
                key={stKey}
                type="button"
                onClick={() => setFilterStatus(stKey)}
                className="provincial-chip"
                style={{
                  backgroundColor: filterStatus === stKey ? 'rgba(0, 43, 127, 0.6)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: filterStatus === stKey ? '#79a6ff' : 'rgba(255, 255, 255, 0.1)',
                  fontSize: '0.78rem'
                }}
              >
                {stKey === 'todos' ? 'Todos' : ESTADOS_TICKET[stKey]?.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {ticketsFiltrados.map((ticket) => {
            const estadoCfg = ESTADOS_TICKET[ticket.estado] || ESTADOS_TICKET.recibido;
            const isSelected = activeTicket?.reportId === ticket.reportId;

            return (
              <div
                key={ticket.reportId}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveTicket(ticket);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="civic-glass-card"
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: isSelected ? 'rgba(0, 43, 127, 0.3)' : 'rgba(0, 15, 45, 0.5)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <span className="telemetry-badge" style={{ fontSize: '0.75rem' }}>
                    {ticket.reportId}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-telemetry)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: estadoCfg.color,
                      backgroundColor: estadoCfg.badgeBg,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px'
                    }}
                  >
                    {estadoCfg.label.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>{getCategoryIcon(ticket.categoria, 18)}</span>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {ticket.categoriaTitulo}
                  </h5>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {ticket.direccionExacta.length > 70
                    ? ticket.direccionExacta.substring(0, 70) + '...'
                    : ticket.direccionExacta}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {ticket.canton}, {ticket.provincia}</span>
                  <span style={{ color: '#79a6ff' }}>Ver Trazabilidad →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
