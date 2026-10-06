import React, { useState, useEffect } from 'react';
import {
  Search,
  Copy,
  Check,
  MapPin,
  Building2,
  Construction,
  Lightbulb,
  Droplets,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Circle
} from 'lucide-react';
import { getTickets, buscarTicketPorId, ESTADOS_TICKET } from './ticketService';
import { useCivicModal } from '../../context/CivicModalContext';

/**
 * Normalizador defensivo de tickets cívicos
 * Garantiza encadenamiento opcional, fallbacks de cadena y propiedades requeridas
 * para prevenir excepciones de tipo TypeError (reading 'split').
 */
export function normalizarTicketSeguro(t) {
  if (!t || typeof t !== 'object') {
    return null;
  }

  // ERROR COMÚN 3 (Código o IDs) — Corrección segura
  const rawId = t?.id || t?.reportId || t?.codigo || 'EXP-MUNI-2026-0001';
  const partesId = String(rawId || '').split('-');
  const numeroTicket = partesId.length > 1 ? partesId[1] : (rawId || 'S/N');

  // ERROR COMÚN 2 (Fechas ISO) — Corrección segura
  const rawFecha = t?.fecha || t?.fechaRegistro || t?.fechaRadicado || t?.fechaReporte || new Date().toISOString();
  const rawFechaStr = String(rawFecha || '');
  const fechaFormateada = rawFechaStr.includes('T')
    ? (rawFechaStr.split('T')[0] || 'Fecha N/D')
    : (rawFechaStr.split(' ')[0] || 'Fecha N/D');

  // ERROR COMÚN 1 (Coordenadas) — Corrección segura
  let coordStr = '9.9281,-84.0907';
  if (typeof t?.coordenadas === 'string') {
    coordStr = t.coordenadas;
  } else if (typeof t?.lat_lng === 'string') {
    coordStr = t.lat_lng;
  } else if (Array.isArray(t?.coordenadas) && t.coordenadas.length >= 2) {
    coordStr = `${t.coordenadas[0]},${t.coordenadas[1]}`;
  } else if (t?.coordenadas && typeof t.coordenadas === 'object') {
    coordStr = `${t.coordenadas.lat || 9.9281},${t.coordenadas.lng || -84.0907}`;
  } else if (t?.lat !== undefined && t?.lng !== undefined) {
    coordStr = `${t.lat},${t.lng}`;
  }
  const [lat, lng] = (coordStr || t?.lat_lng || '0,0').split(',');
  const latNum = parseFloat(lat) || 9.9281;
  const lngNum = parseFloat(lng) || -84.0907;

  // ERROR COMÚN 4 (Nombres o Categorías) — Corrección segura
  const rawCiudadano = t?.ciudadano || t?.nombre || t?.reportadoPor || 'Ciudadano';
  const primerNombre = String(rawCiudadano || 'Ciudadano').split(' ')[0];

  // Normalización de Estado
  let estadoKey = 'recibido';
  const rawEstado = String(t?.estado || '').toLowerCase();
  if (rawEstado.includes('subsanado') || rawEstado.includes('resuelto') || rawEstado.includes('solucionado')) {
    estadoKey = 'solucionado';
  } else if (rawEstado.includes('tramite') || rawEstado.includes('proceso') || rawEstado.includes('ejecucion')) {
    estadoKey = 'en_tramite';
  } else if (rawEstado.includes('inspeccion') || rawEstado.includes('revision')) {
    estadoKey = 'en_inspeccion';
  } else if (rawEstado.includes('recibido') || rawEstado.includes('radicado') || rawEstado.includes('reportado')) {
    estadoKey = 'recibido';
  } else if (ESTADOS_TICKET[rawEstado]) {
    estadoKey = rawEstado;
  }

  // Título y categoría defensivos
  const categoriaSegura = t?.categoria || 'INFRAESTRUCTURA_VIAL_HUECO';
  const categoriaTituloSegura = t?.categoriaTitulo || t?.titulo || 'Incidencia Vial Reportada';
  const direccionSegura = t?.direccionExacta || t?.direccion || t?.descripcion || 'Ubicación comunal registrada';

  // Historial seguro con fechas formateadas
  const historialSeguro = (Array.isArray(t?.historial) && t.historial.length > 0 ? t.historial : [
    {
      estado: 'recibido',
      fecha: fechaFormateada,
      nota: 'Reporte ingresado por ciudadano con georreferenciación GPS verificada.'
    },
    {
      estado: estadoKey !== 'recibido' ? estadoKey : 'en_inspeccion',
      fecha: fechaFormateada,
      nota: `Unidad municipal asignada: ${t?.cuadrillaAsignada || t?.entidadResponsable || 'Obras Públicas y Gestión Vial'}.`
    }
  ]).map((h) => {
    const hFechaRaw = h?.fecha || fechaFormateada;
    const hFechaFormateada = String(hFechaRaw || '').split('T')[0] || 'Fecha N/D';
    return {
      estado: h?.estado || 'recibido',
      fecha: hFechaFormateada,
      nota: h?.nota || h?.descripcion || 'Actualización de fiscalización técnica registrada.'
    };
  });

  return {
    ...t,
    id: rawId,
    reportId: rawId,
    numeroTicket,
    titulo: t?.titulo || categoriaTituloSegura,
    categoria: categoriaSegura,
    categoriaTitulo: categoriaTituloSegura,
    estado: estadoKey,
    provincia: t?.provincia || 'San José',
    canton: t?.canton || 'San José',
    distrito: t?.distrito || 'Central',
    direccionExacta: direccionSegura,
    fecha: rawFecha,
    fechaRegistro: rawFecha,
    fechaRadicado: t?.fechaRadicado || rawFecha,
    fechaReporte: t?.fechaReporte || rawFecha,
    fechaFormateada,
    coordenadas: { lat: latNum, lng: lngNum },
    coordenadasTexto: `${latNum.toFixed(5)}, ${lngNum.toFixed(5)}`,
    lat_lng: `${latNum},${lngNum}`,
    ciudadano: rawCiudadano,
    primerNombre,
    entidadResponsable: t?.entidadResponsable || 'Unidad Técnica de Gestión Vial',
    historial: historialSeguro
  };
}

function getCategoryIcon(categoria, size = 18) {
  const cat = String(categoria || '').toLowerCase();
  if (cat.includes('hueco') || cat.includes('vial') || cat.includes('calzada') || cat.includes('asfalto')) {
    return <Construction size={size} color="var(--cru-accent-red)" />;
  }
  if (cat.includes('luminaria') || cat.includes('luz') || cat.includes('alumbrado')) {
    return <Lightbulb size={size} color="var(--cru-accent-amber)" />;
  }
  if (cat.includes('agua') || cat.includes('fuga') || cat.includes('alcantarilla')) {
    return <Droplets size={size} color="#38BDF8" />;
  }
  if (cat.includes('basura') || cat.includes('residuo') || cat.includes('vertedero')) {
    return <Trash2 size={size} color="var(--cru-accent-green)" />;
  }
  return <AlertTriangle size={size} color="#F59E0B" />;
}

export default function TicketTraceabilityBoard({
  initialTicketId = null,
  onGoToNewReport
}) {
  const { mostrarAlerta } = useCivicModal();
  const [searchTerm, setSearchTerm] = useState(initialTicketId || '');
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketsList, setTicketsList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [copiedId, setCopiedId] = useState(false);

  // Cargar tickets de almacenamiento local al montar con normalización segura
  useEffect(() => {
    const rawTickets = getTickets() || [];

    // Normalización de Datos de Tickets garantizando valores por defecto
    const ticketsSeguros = (rawTickets || [])
      .map((t) => {
        const tBase = {
          id: t?.id || t?.reportId || 'CRU-000',
          titulo: t?.titulo || t?.categoriaTitulo || 'Incidencia sin título',
          categoria: t?.categoria || 'General',
          estado: t?.estado || 'Recibido',
          canton: t?.canton || 'San José',
          fecha: t?.fecha || t?.fechaRegistro || t?.fechaRadicado || new Date().toISOString(),
          coordenadas: t?.coordenadas || '9.9281,-84.0907',
          ...t
        };
        return normalizarTicketSeguro(tBase);
      })
      .filter(Boolean);

    setTicketsList(ticketsSeguros);

    if (initialTicketId) {
      const match = buscarTicketPorId(initialTicketId);
      if (match) {
        setActiveTicket(normalizarTicketSeguro(match));
      } else {
        const localMatch = ticketsSeguros.find(
          (t) => String(t.id).toUpperCase() === String(initialTicketId).trim().toUpperCase() ||
                 String(t.reportId).toUpperCase() === String(initialTicketId).trim().toUpperCase()
        );
        if (localMatch) {
          setActiveTicket(localMatch);
        } else if (ticketsSeguros.length > 0) {
          setActiveTicket(ticketsSeguros[0]);
        }
      }
    } else if (ticketsSeguros.length > 0) {
      setActiveTicket(ticketsSeguros[0]);
    }
  }, [initialTicketId]);

  // Manejar búsqueda por ID de ticket con blindaje defensivo
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    const found = buscarTicketPorId(query);
    if (found) {
      setActiveTicket(normalizarTicketSeguro(found));
    } else {
      const localMatch = ticketsList.find(
        (t) => String(t?.id || '').toUpperCase() === query.toUpperCase() ||
               String(t?.reportId || '').toUpperCase() === query.toUpperCase() ||
               String(t?.numeroTicket || '').toUpperCase() === query.toUpperCase()
      );
      if (localMatch) {
        setActiveTicket(localMatch);
      } else {
        mostrarAlerta({
          titulo: 'Reporte No Encontrado',
          mensaje: `No se encontró ningún reporte cívico registrado con el identificador: ${query}. Verifique el código ingresado e intente nuevamente.`,
          icono: 'advertencia'
        });
      }
    }
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(String(id));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtrado seguro de la lista pública
  const ticketsFiltrados = ticketsList.filter((t) => {
    if (filterStatus === 'todos') return true;
    return t.estado === filterStatus;
  });

  // Configuración de estado para el ticket activo
  const estadoActivoCfg = (activeTicket && ESTADOS_TICKET[activeTicket.estado]) || ESTADOS_TICKET.recibido;
  const currentStep = estadoActivoCfg?.step || 1;
  const progressPercent = Math.min(Math.max(((currentStep - 1) / 3) * 100, 0), 100);

  // Fecha blindada para visualización
  const fechaDisplay = (activeTicket?.fechaFormateada) ||
    ((activeTicket?.fecha || activeTicket?.fechaRegistro || '').split('T')[0]) ||
    'Fecha N/D';

  // Coordenadas blindadas para visualización
  const latCoord = typeof activeTicket?.coordenadas?.lat === 'number'
    ? activeTicket.coordenadas.lat.toFixed(5)
    : (parseFloat(activeTicket?.coordenadas?.lat) || 9.9281).toFixed(5);
  const lngCoord = typeof activeTicket?.coordenadas?.lng === 'number'
    ? activeTicket.coordenadas.lng.toFixed(5)
    : (parseFloat(activeTicket?.coordenadas?.lng) || -84.0907).toFixed(5);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Cabecera del Tablero de Trazabilidad */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <span
          className="telemetry-badge"
          style={{
            backgroundColor: 'var(--cru-accent-blue-bg)',
            color: 'var(--cru-accent-blue)',
            border: '1px solid var(--cru-accent-blue-border)',
            fontWeight: 700
          }}
        >
          TRANSPARENCIA CÍVICA &bull; AUDITORÍA CIUDADANA EN TIEMPO REAL
        </span>
        <h3 style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          color: 'var(--cru-text)',
          marginTop: '0.6rem',
          marginBottom: '0.35rem'
        }}>
          Tablero Público de Trazabilidad de Incidencias
        </h3>
        <p style={{ color: 'var(--cru-text-soft)', fontSize: '0.92rem', maxWidth: '680px', margin: '0 auto', fontWeight: 500 }}>
          Consulte el avance físico y administrativo de los tickets emitidos. La ciudadanía puede auditar el cumplimiento de los tiempos de respuesta municipal.
        </p>
      </div>

      {/* Buscador de Tickets por Identificador Estandarizado */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          backgroundColor: 'var(--cru-surface-card)',
          border: '1.5px solid var(--cru-accent-blue-border)',
          boxShadow: '0 4px 16px rgba(6, 42, 119, 0.04)'
        }}
      >
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
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cru-accent-blue)', display: 'flex', alignItems: 'center' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código de ticket: EXP-MUNI-2026-0042..."
              aria-label="Buscar reporte por código"
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 2.8rem',
                backgroundColor: 'var(--cru-surface-muted)',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                color: 'var(--theme-text-primary)',
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.95rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.9rem 1.6rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              backgroundColor: 'var(--cru-accent-blue)',
              color: '#FFFFFF',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 83, 175, 0.25)'
            }}
          >
            Rastrear Incidencia
          </button>

          {onGoToNewReport && (
            <button
              type="button"
              onClick={onGoToNewReport}
              style={{
                padding: '0.9rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                backgroundColor: '#C22727',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(194, 39, 39, 0.25)'
              }}
            >
              + Nuevo Reporte
            </button>
          )}
        </form>
      </div>

      {/* Detalle del Ticket Activo con Barra de Progreso de 4 Estados */}
      {activeTicket && (
        <div
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            borderRadius: '24px',
            marginBottom: '3rem',
            backgroundColor: 'var(--cru-surface-card)',
            border: '2px solid rgba(6, 42, 119, 0.15)',
            boxShadow: '0 10px 30px rgba(6, 42, 119, 0.08)'
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
            borderBottom: '1px solid var(--cru-border)',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--cru-accent-blue-bg)',
                  border: '1px solid var(--cru-accent-blue-border)',
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
                  color: 'var(--cru-text)',
                  letterSpacing: '0.02em'
                }}>
                  {activeTicket.reportId || activeTicket.id}
                </h4>

                <button
                  type="button"
                  onClick={() => handleCopyId(activeTicket.reportId || activeTicket.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--cru-surface-muted)',
                    border: '1px solid var(--cru-border-strong)',
                    color: 'var(--cru-text)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {copiedId ? <Check size={12} color="var(--cru-accent-green)" /> : <Copy size={12} />}
                  <span>{copiedId ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div style={{ color: 'var(--cru-text-soft)', fontSize: '0.92rem', marginTop: '0.45rem', fontWeight: 600 }}>
                <strong style={{ color: 'var(--cru-text)' }}>{activeTicket.categoriaTitulo}</strong> &bull; {activeTicket.provincia} › {activeTicket.canton} › {activeTicket.distrito}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                className="telemetry-badge"
                style={{
                  backgroundColor: 'var(--cru-accent-blue-bg)',
                  borderColor: '#0053AF',
                  color: 'var(--cru-accent-blue)',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}
              >
                ESTADO: {(estadoActivoCfg.label || activeTicket.estado || 'RECIBIDO').toUpperCase()}
              </span>
              <div style={{ fontSize: '0.78rem', color: 'var(--cru-text-muted)', marginTop: '0.4rem', fontFamily: 'var(--font-telemetry)', fontWeight: 600 }}>
                Registrado: {fechaDisplay}
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESO VISUAL: 4 ESTADOS
              1. Recibido -> 2. En Inspección -> 3. En Trámite -> 4. Solucionado */}
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
                  backgroundColor: 'var(--cru-track)',
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
                  width: `${progressPercent}%`,
                  height: '4px',
                  background: 'linear-gradient(90deg, #0053AF 0%, #059669 100%)',
                  boxShadow: '0 0 10px rgba(5, 150, 105, 0.4)',
                  zIndex: 2,
                  transition: 'width 0.5s ease'
                }}
              />

              {/* Los 4 Pasos de Trazabilidad */}
              {Object.values(ESTADOS_TICKET).map((st) => {
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
                        backgroundColor: isPassed ? st.color : '#F8FAFC',
                        border: `3px solid ${isCurrent ? '#062A77' : isPassed ? st.color : '#CBD5E1'}`,
                        boxShadow: isCurrent ? '0 0 14px rgba(6, 42, 119, 0.25)' : 'none',
                        color: isPassed ? '#FFFFFF' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1rem',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {isPassed && !isCurrent ? <Check size={16} strokeWidth={3} /> : st.step}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? '#062A77' : isPassed ? '#1E293B' : '#64748B'
                      }}>
                        {st.label}
                      </div>
                      <div style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: isCurrent ? st.color : '#64748B',
                        fontFamily: 'var(--font-telemetry)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}>
                        {isCurrent ? (
                          <>
                            <Circle size={6} fill="currentColor" />
                            <span>Fase Activa</span>
                          </>
                        ) : isPassed ? 'Completado' : 'Pendiente'}
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
            borderTop: '1px solid var(--cru-border)'
          }}>
            {/* Información Territorial y Evidencia */}
            <div>
              <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--cru-text)', marginBottom: '0.75rem' }}>
                Datos de Ubicación y Evidencia
              </h5>

              <p style={{ color: 'var(--cru-text-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--cru-text)' }}>Dirección exacta:</strong> {activeTicket.direccionExacta}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.82rem',
                color: 'var(--cru-accent-blue)',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} color="var(--cru-accent-blue)" /> COORDENADAS:</span>
                <span>{latCoord}, {lngCoord}</span>
              </div>

              {activeTicket.imagen?.url && (
                <div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--cru-text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
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
                      border: '1.5px solid #CBD5E1'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Línea de Tiempo del Historial de Inspección */}
            <div>
              <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--cru-text)', marginBottom: '0.75rem' }}>
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
                {(activeTicket.historial || []).map((h, i) => {
                  const hEstadoCfg = ESTADOS_TICKET[h?.estado] || ESTADOS_TICKET.recibido;
                  const hFechaRaw = h?.fecha || '';
                  const hFechaFormateada = String(hFechaRaw || '').split('T')[0] || 'Fecha N/D';

                  return (
                    <div
                      key={i}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        backgroundColor: 'var(--cru-surface-muted)',
                        border: '1px solid var(--cru-border)',
                        borderLeft: `4px solid ${hEstadoCfg.color || '#0053AF'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--cru-text-muted)', fontFamily: 'var(--font-telemetry)', marginBottom: '0.2rem' }}>
                        <span style={{ color: hEstadoCfg.color || '#0053AF', fontWeight: 800 }}>
                          {(hEstadoCfg.label || h?.estado || 'PROCESO').toUpperCase()}
                        </span>
                        <span style={{ fontWeight: 600 }}>{hFechaFormateada}</span>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--theme-text-primary)', lineHeight: 1.45, fontWeight: 500, margin: 0 }}>
                        {h?.nota || h?.descripcion || 'Actualización registrada en el expediente municipal.'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {activeTicket.entidadResponsable && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--cru-accent-blue-bg)',
                  border: '1px solid var(--cru-accent-blue-border)',
                  fontSize: '0.82rem',
                  color: 'var(--cru-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}>
                  <Building2 size={16} color="var(--cru-accent-blue)" /> <span><strong>Unidad Técnica Asignada:</strong> {activeTicket.entidadResponsable}</span>
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
          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cru-text)' }}>
            Incidencias Comunitarias Registradas ({ticketsFiltrados.length})
          </h4>

          {/* Filtros por Estado */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['todos', 'recibido', 'en_inspeccion', 'en_tramite', 'solucionado'].map((stKey) => (
              <button
                key={stKey}
                type="button"
                onClick={() => setFilterStatus(stKey)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: filterStatus === stKey ? '#0053AF' : '#FFFFFF',
                  borderColor: filterStatus === stKey ? '#0053AF' : '#CBD5E1',
                  color: filterStatus === stKey ? '#FFFFFF' : '#334155',
                  border: '1.5px solid',
                  fontSize: '0.8rem',
                  boxShadow: filterStatus === stKey ? '0 2px 8px rgba(0, 83, 175, 0.25)' : 'none'
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
            const dirTexto = ticket.direccionExacta || ticket.direccion || ticket.descripcion || 'Ubicación registrada';
            const dirCorta = dirTexto.length > 70 ? dirTexto.substring(0, 70) + '...' : dirTexto;

            return (
              <div
                key={ticket.reportId || ticket.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveTicket(ticket);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #0053AF' : '1.5px solid #CBD5E1',
                  backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                  boxShadow: isSelected ? '0 8px 24px rgba(0, 83, 175, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <span
                    className="telemetry-badge"
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: 'var(--cru-accent-blue-bg)',
                      color: 'var(--cru-accent-blue)',
                      border: '1px solid var(--cru-accent-blue-border)',
                      fontWeight: 700
                    }}
                  >
                    {ticket.reportId || ticket.id}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-telemetry)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: estadoCfg.color,
                      backgroundColor: estadoCfg.badgeBg,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px'
                    }}
                  >
                    {(estadoCfg.label || ticket.estado || 'RECIBIDO').toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>{getCategoryIcon(ticket.categoria, 18)}</span>
                  <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--cru-text)' }}>
                    {ticket.categoriaTitulo}
                  </h5>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--cru-text-soft)', marginBottom: '0.75rem', lineHeight: 1.45, fontWeight: 500 }}>
                  {dirCorta}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--cru-text-muted)',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--cru-border)',
                  fontWeight: 600
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} color="var(--cru-accent-blue)" /> {ticket.canton}, {ticket.provincia}</span>
                  <span style={{ color: 'var(--cru-accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    Ver Trazabilidad <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
