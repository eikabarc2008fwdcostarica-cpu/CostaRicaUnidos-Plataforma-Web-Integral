/**
 * ============================================================================
 * COSTA RICA UNIDOS — TRIAJE DE INCIDENCIAS CIUDADANAS Y VIALES (M07)
 * Design System: Sovereign Civic Glass v2.1
 * ============================================================================
 * 
 * Reglas de Negocio Implementadas:
 * - Frente M07: Gestión de daños viales (huecos, semáforos, alcantarillas, derrumbes).
 * - Máquina de Estados Estricta: Recibido -> En Revisión -> Programado -> Solucionado.
 * - Cumplimiento Ley N° 8968: Anonimización de datos sensibles del denunciante.
 * - Filtros: Cantón, Estado y Severidad.
 * - Modal de inspección con evidencia WebP (<1MB), coordenadas Lat/Lng y derivación.
 */
import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  HardHat,
  MapPin,
  Search,
  Shield,
  ShieldCheck,
  X,
  ArrowRight,
  Send,
  Building,
  Radio,
  FileCheck,
  Check,
  Copy,
  ChevronRight,
  Info,
  Car,
  AlertCircle
} from 'lucide-react';

// Máquina de Estados Estricta
export const ESTADOS_INCIDENCIA = ['Recibido', 'En Revisión', 'Programado', 'Solucionado'];

export const SIGUIENTE_ESTADO = {
  'Recibido': 'En Revisión',
  'En Revisión': 'Programado',
  'Programado': 'Solucionado',
  'Solucionado': null
};

// Entidades Oficiales de Derivación en Costa Rica
export const ENTIDADES_DERIVACION = [
  { id: 'MOPT_CONAVI', nombre: 'MOPT / CONAVI', descripcion: 'Red Vial Nacional y Puentes Mayores' },
  { id: 'MUNICIPALIDAD', nombre: 'Municipalidad Cantonal', descripcion: 'Red Vial Cantonal y Drenajes Urbanos' },
  { id: 'AYA', nombre: 'AyA (Acueductos y Alcantarillados)', descripcion: 'Tuberías matrices, hidrantes y alcantarillado sanitario' },
  { id: 'ICE', nombre: 'ICE (Instituto Costarricense de Electricidad)', descripcion: 'Alumbrado público, postes y cableado eléctrico' }
];

// Helper para anonimizar datos según Ley N° 8968
export function anonimizarNombre(nombre = '') {
  if (!nombre) return 'Ciudadano Anónimo';
  const partes = nombre.trim().split(/\s+/);
  return partes
    .map((p) => {
      if (p.length <= 2) return p.charAt(0) + '*';
      return p.charAt(0) + '*'.repeat(Math.max(2, p.length - 2)) + p.charAt(p.length - 1);
    })
    .join(' ');
}

export function anonimizarCedula(cedula = '') {
  if (!cedula) return '*-****-****';
  const clean = cedula.replace(/[^0-9]/g, '');
  if (clean.length >= 9) {
    return `${clean.charAt(0)}-****-${clean.slice(-4)}`;
  }
  return cedula.slice(0, 2) + '****' + cedula.slice(-2);
}

// 6 Tickets iniciales realistas para la provincia activa (Puntarenas)
const TICKETS_INICIALES = [
  {
    id: 'CRU-8921',
    codigo: 'CRU-8921',
    canton: 'Puntarenas (Central)',
    distrito: 'El Carmen',
    direccion: 'Costado norte de la Terminal de Cruceros, Calle 3 / Av 4',
    categoria: 'Hundimiento Mayor en Calzada',
    tipo: 'Hueco y Hundimiento en Asfalto',
    severidad: 'Crítica',
    estado: 'Recibido',
    tiempoSLA: '1h 22m',
    slaLimiteHoras: 6,
    entidadAsignada: 'MOPT / CONAVI',
    cuadrilla: 'Cuadrilla V-MOPT Pacífico Central',
    coordenadas: { lat: 9.9763, lng: -84.8384 },
    descripcion:
      'Hundimiento severo de aproximadamente 45 cm de profundidad en carril derecho. Riesgo crítico de colisión y daños a la suspensión de transporte público y turistas.',
    fotoUrl: '/evidence_pothole_puntarenas.webp',
    fotoTamanio: '388 KB (WebP)',
    denunciante: {
      nombreReal: 'Carlos Fonseca Zúñiga',
      cedulaReal: '6-0144-0891',
      telefonoReal: '+506 8812-4091'
    },
    fechaReporte: '2026-10-01 12:15 CST'
  },
  {
    id: 'CRU-8922',
    codigo: 'CRU-8922',
    canton: 'Esparza',
    distrito: 'Espíritu Santo',
    direccion: 'Intersección San Juan Chiquito con Ruta Nacional 131',
    categoria: 'Semáforo Caído e Inoperante',
    tipo: 'Semáforo y Señalización Vial',
    severidad: 'Alta',
    estado: 'En Revisión',
    tiempoSLA: '3h 45m',
    slaLimiteHoras: 12,
    entidadAsignada: 'MOPT / CONAVI',
    cuadrilla: 'Unidad de Semáforos e Ingeniería de Tránsito',
    coordenadas: { lat: 9.9942, lng: -84.6647 },
    descripcion:
      'Semáforo peatonal y vehicular derribado tras impacto vehicular nocturno. Intersección con alto flujo escolar sin control semafórico.',
    fotoUrl: '/evidence_pothole_puntarenas.webp',
    fotoTamanio: '412 KB (WebP)',
    denunciante: {
      nombreReal: 'Valeria Morales Cordero',
      cedulaReal: '6-0219-0332',
      telefonoReal: '+506 8744-1922'
    },
    fechaReporte: '2026-10-01 09:52 CST'
  },
  {
    id: 'CRU-8923',
    codigo: 'CRU-8923',
    canton: 'Osa (Ciudad Cortés)',
    distrito: 'Palmar',
    direccion: 'Ruta Nacional 34 (Costanera Sur) km 142, Sector Palmar Norte',
    categoria: 'Derrumbe y Desprendimiento de Talud',
    tipo: 'Derrumbe y Bloqueo de Vía',
    severidad: 'Crítica',
    estado: 'Programado',
    tiempoSLA: '5h 10m',
    slaLimiteHoras: 8,
    entidadAsignada: 'MOPT / CONAVI',
    cuadrilla: 'Frente de Maquinaria Pesada CONAVI Osa',
    coordenadas: { lat: 8.9614, lng: -83.5244 },
    descripcion:
      'Deslizamiento de tierra, lodo y rocas de gran tonelaje que invade carril y medio. Se requiere retroexcavadora y señalización preventiva inmediata.',
    fotoUrl: '/evidence_landslide_osa.webp',
    fotoTamanio: '445 KB (WebP)',
    denunciante: {
      nombreReal: 'Gerardo Monge Solís',
      cedulaReal: '6-0188-0955',
      telefonoReal: '+506 8301-7788'
    },
    fechaReporte: '2026-10-01 08:27 CST'
  },
  {
    id: 'CRU-8924',
    codigo: 'CRU-8924',
    canton: 'Quepos',
    distrito: 'Manuel Antonio',
    direccion: 'Camino a Playa Manuel Antonio, frente a Plaza Comercial',
    categoria: 'Alcantarilla Pluvial Colapsada',
    tipo: 'Alcantarillado y Drenaje Pluvial',
    severidad: 'Media',
    estado: 'En Revisión',
    tiempoSLA: '7h 30m',
    slaLimiteHoras: 24,
    entidadAsignada: 'Municipalidad Cantonal',
    cuadrilla: 'Brigada de Mantenimiento Municipal Quepos',
    coordenadas: { lat: 9.4125, lng: -84.1528 },
    descripcion:
      'Rejilla de captación de aguas pluviales colapsada por peso de camión recolector. El agua desborda hacia la acera peatonal.',
    fotoUrl: '/evidence_pothole_puntarenas.webp',
    fotoTamanio: '360 KB (WebP)',
    denunciante: {
      nombreReal: 'Mireya Castro Araya',
      cedulaReal: '6-0155-0211',
      telefonoReal: '+506 8922-3155'
    },
    fechaReporte: '2026-10-01 06:07 CST'
  },
  {
    id: 'CRU-8925',
    codigo: 'CRU-8925',
    canton: 'Golfito',
    distrito: 'Golfito Central',
    direccion: 'Barrio Bellavista, 200m este del Muelle Fiscal',
    categoria: 'Fuga de Tubería Matriz en Calzada',
    tipo: 'Acueducto y Daño de Pavimento',
    severidad: 'Alta',
    estado: 'Recibido',
    tiempoSLA: '45m',
    slaLimiteHoras: 6,
    entidadAsignada: 'AyA',
    cuadrilla: 'Cuadrilla de Fugas AyA Región Brunca',
    coordenadas: { lat: 8.6361, lng: -83.1633 },
    descripcion:
      'Ruptura de tubería de distribución principal de 4 pulgadas con socavamiento de la base asfáltica. Desperdicio continuo de agua potable.',
    fotoUrl: '/evidence_pothole_puntarenas.webp',
    fotoTamanio: '395 KB (WebP)',
    denunciante: {
      nombreReal: 'Jorge Vargas Barquero',
      cedulaReal: '6-0199-0412',
      telefonoReal: '+506 8455-9012'
    },
    fechaReporte: '2026-10-01 12:52 CST'
  },
  {
    id: 'CRU-8926',
    codigo: 'CRU-8926',
    canton: 'Buenos Aires',
    distrito: 'Buenos Aires',
    direccion: 'Avenida 2, frente al Liceo de Buenos Aires',
    categoria: 'Poste de Tendido e Iluminación Inclinado',
    tipo: 'Alumbrado y Seguridad Vial',
    severidad: 'Baja',
    estado: 'Solucionado',
    tiempoSLA: '18h 20m (Cerrado)',
    slaLimiteHoras: 24,
    entidadAsignada: 'ICE',
    cuadrilla: 'Cuadrilla Técnica de Redes ICE Buenos Aires',
    coordenadas: { lat: 9.1722, lng: -83.3341 },
    descripcion:
      'Poste de alumbrado con inclinación de 25 grados tras fuertes vientos. El ICE completó la sustitución del poste y el tensado de líneas.',
    fotoUrl: '/evidence_pothole_puntarenas.webp',
    fotoTamanio: '350 KB (WebP)',
    denunciante: {
      nombreReal: 'Tatiana Picado Quirós',
      cedulaReal: '6-0133-0887',
      telefonoReal: '+506 8633-1188'
    },
    fechaReporte: '2026-09-30 19:15 CST'
  }
];

export default function IncidentTriageTable({
  provinciaTheme = {
    primary: '#F36717',
    glow: 'rgba(243, 103, 23, 0.4)',
    nombre: 'Puntarenas'
  }
}) {
  // Lista de tickets en memoria reactiva
  const [tickets, setTickets] = useState(TICKETS_INICIALES);

  // Filtros interactivos
  const [filtroCanton, setFiltroCanton] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroSeveridad, setFiltroSeveridad] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  // Ticket seleccionado para el Modal de Inspección
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  // Estados temporales del modal (entidad elegida y confirmación de avance)
  const [entidadModal, setEntidadModal] = useState('');
  const [confirmandoAvance, setConfirmandoAvance] = useState(false);
  const [ticketCopiadoId, setTicketCopiadoId] = useState(null);

  // Colores y badges según estado y severidad
  const colorEstado = (estado) => {
    switch (estado) {
      case 'Recibido':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.35)' };
      case 'En Revisión':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.35)' };
      case 'Programado':
        return { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.35)' };
      case 'Solucionado':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.35)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', text: '#E2E8F0', border: 'rgba(255, 255, 255, 0.15)' };
    }
  };

  const colorSeveridad = (sev) => {
    switch (sev) {
      case 'Crítica':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#FCA5A5', border: 'rgba(239, 68, 68, 0.45)' };
      case 'Alta':
        return { bg: 'rgba(249, 115, 22, 0.2)', text: '#FDBA74', border: 'rgba(249, 115, 22, 0.45)' };
      case 'Media':
        return { bg: 'rgba(234, 179, 8, 0.2)', text: '#FDE047', border: 'rgba(234, 179, 8, 0.45)' };
      case 'Baja':
        return { bg: 'rgba(16, 185, 129, 0.2)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.45)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', text: '#CBD5E1', border: 'rgba(255, 255, 255, 0.15)' };
    }
  };

  // Cantones disponibles para el filtro
  const cantonesUnicos = useMemo(() => {
    const list = Array.from(new Set(tickets.map((t) => t.canton)));
    return list;
  }, [tickets]);

  // Filtrado reactivo de tickets
  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((t) => {
      const matchCanton = filtroCanton === 'TODOS' || t.canton === filtroCanton;
      const matchEstado = filtroEstado === 'TODOS' || t.estado === filtroEstado;
      const matchSev = filtroSeveridad === 'TODOS' || t.severidad === filtroSeveridad;
      const matchText =
        t.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.canton.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.distrito.toLowerCase().includes(busqueda.toLowerCase());
      return matchCanton && matchEstado && matchSev && matchText;
    });
  }, [tickets, filtroCanton, filtroEstado, filtroSeveridad, busqueda]);

  // Transición de máquina de estados para un ticket específico
  const avanzarEstadoTicket = (ticketId, entidadDestino = null) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const proximo = SIGUIENTE_ESTADO[t.estado];
          if (!proximo) return t;
          return {
            ...t,
            estado: proximo,
            entidadAsignada: entidadDestino || t.entidadAsignada
          };
        }
        return t;
      })
    );

    // Actualizar también el ticket actualmente abierto en el modal
    if (ticketSeleccionado && ticketSeleccionado.id === ticketId) {
      setTicketSeleccionado((curr) => {
        if (!curr) return null;
        const proximo = SIGUIENTE_ESTADO[curr.estado];
        if (!proximo) return curr;
        return {
          ...curr,
          estado: proximo,
          entidadAsignada: entidadDestino || curr.entidadAsignada
        };
      });
      setConfirmandoAvance(false);
    }
  };

  const abrirModalInspeccion = (ticket) => {
    setTicketSeleccionado(ticket);
    setEntidadModal(ticket.entidadAsignada || 'MOPT / CONAVI');
    setConfirmandoAvance(false);
  };

  const copiarCodigoTicket = (id) => {
    navigator.clipboard.writeText(id);
    setTicketCopiadoId(id);
    setTimeout(() => setTicketCopiadoId(null), 1800);
  };

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
      {/* 1. CABECERA Y METRICAS DEL FRENTE M07                                */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${provinciaTheme.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 12px ${provinciaTheme.glow}`
              }}
            >
              <Car size={18} color={provinciaTheme.primary} />
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
                Ventanilla de Triaje y Despacho Vial (M07)
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
                Gestión estricta de reportes de daños viales en la Provincia de {provinciaTheme.nombre}. Cumplimiento Ley N° 8968.
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de Estados en Pastillas Rápidas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {ESTADOS_INCIDENCIA.map((st) => {
            const count = tickets.filter((t) => t.estado === st).length;
            const colors = colorEstado(st);
            return (
              <div
                key={st}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  fontSize: '0.74rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: colors.text
                }}
              >
                <span>{st}:</span>
                <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. BARRA DE FILTROS SUPERIORES                                      */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem',
          alignItems: 'center'
        }}
      >
        {/* Búsqueda */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '0.55rem 0.85rem'
          }}
        >
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            placeholder="Buscar por código, daño o cantón..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#F8FAFC',
              fontSize: '0.82rem',
              width: '100%',
              fontFamily: "'Paloseco', sans-serif"
            }}
          />
        </div>

        {/* Filtro por Cantón */}
        <div>
          <select
            value={filtroCanton}
            onChange={(e) => setFiltroCanton(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: '#00040D',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TODOS">Todos los Cantones ({provinciaTheme.nombre})</option>
            {cantonesUnicos.map((canton) => (
              <option key={canton} value={canton}>
                Cantón: {canton}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: '#00040D',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TODOS">Todos los Estados (Flujo M07)</option>
            {ESTADOS_INCIDENCIA.map((st) => (
              <option key={st} value={st}>
                Estado: {st}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Severidad */}
        <div>
          <select
            value={filtroSeveridad}
            onChange={(e) => setFiltroSeveridad(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: '#00040D',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TODOS">Todas las Severidades</option>
            <option value="Crítica">Severidad: Crítica</option>
            <option value="Alta">Severidad: Alta</option>
            <option value="Media">Severidad: Media</option>
            <option value="Baja">Severidad: Baja</option>
          </select>
        </div>
      </div>

      {/* Indicador de Ley N° 8968 y Contador de Resultados */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.76rem',
          color: '#94A3B8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <ShieldCheck size={15} color="#10B981" />
          <span style={{ color: '#CBD5E1', fontWeight: 600 }}>
            Protección de Identidad Ciudadana Activa:
          </span>
          <span style={{ color: '#94A3B8' }}>
            Los nombres y cédulas se presentan anonimizados según la Ley N° 8968 (CR).
          </span>
        </div>
        <div>
          Mostrando <strong style={{ color: '#FFFFFF' }}>{ticketsFiltrados.length}</strong> de {tickets.length} tickets registrados
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. TABLA DE TICKETS VIALES EN VIDRIO TRANSLÚCIDO                    */}
      {/* =================================================================== */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
              <th style={{ padding: '0.85rem 1rem', fontFamily: "'JetBrains Mono', monospace" }}>Código Ticket</th>
              <th style={{ padding: '0.85rem 1rem' }}>Cantón / Distrito</th>
              <th style={{ padding: '0.85rem 1rem' }}>Categoría de Daño</th>
              <th style={{ padding: '0.85rem 1rem' }}>Severidad</th>
              <th style={{ padding: '0.85rem 1rem' }}>Estado Actual</th>
              <th style={{ padding: '0.85rem 1rem', fontFamily: "'JetBrains Mono', monospace" }}>Tiempo SLA</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ticketsFiltrados.map((ticket, idx) => {
              const estCol = colorEstado(ticket.estado);
              const sevCol = colorSeveridad(ticket.severidad);
              const proximo = SIGUIENTE_ESTADO[ticket.estado];

              return (
                <tr
                  key={ticket.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)')
                  }
                >
                  {/* Código Ticket */}
                  <td style={{ padding: '0.95rem 1rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#38BDF8', fontWeight: 800 }}>{ticket.codigo}</span>
                      <button
                        onClick={() => copiarCodigoTicket(ticket.codigo)}
                        title="Copiar código de ticket"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: ticketCopiadoId === ticket.codigo ? '#10B981' : '#64748B',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {ticketCopiadoId === ticket.codigo ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>

                  {/* Cantón / Distrito */}
                  <td style={{ padding: '0.95rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{ticket.canton}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{ticket.distrito}</div>
                  </td>

                  {/* Categoría */}
                  <td style={{ padding: '0.95rem 1rem' }}>
                    <div style={{ color: '#E2E8F0', fontWeight: 600 }}>{ticket.categoria}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.1rem' }}>
                      Derivado a: <strong style={{ color: '#CBD5E1' }}>{ticket.entidadAsignada}</strong>
                    </div>
                  </td>

                  {/* Severidad */}
                  <td style={{ padding: '0.95rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.72rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: sevCol.bg,
                        color: sevCol.text,
                        border: `1px solid ${sevCol.border}`
                      }}
                    >
                      {ticket.severidad === 'Crítica' && <AlertTriangle size={12} />}
                      {ticket.severidad}
                    </span>
                  </td>

                  {/* Estado Actual */}
                  <td style={{ padding: '0.95rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.72rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 800,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        backgroundColor: estCol.bg,
                        color: estCol.text,
                        border: `1px solid ${estCol.border}`
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: estCol.text
                        }}
                      />
                      {ticket.estado}
                    </span>
                  </td>

                  {/* Tiempo de SLA */}
                  <td style={{ padding: '0.95rem 1rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    <div style={{ color: '#CBD5E1', fontSize: '0.78rem', fontWeight: 600 }}>
                      {ticket.tiempoSLA}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      Límite: {ticket.slaLimiteHoras}h
                    </div>
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: '0.95rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Despacho rápido si hay estado siguiente */}
                      {proximo && (
                        <button
                          onClick={() => avanzarEstadoTicket(ticket.id)}
                          title={`Despachar a: ${proximo}`}
                          style={{
                            padding: '0.35rem 0.7rem',
                            fontSize: '0.74rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${provinciaTheme.primary}`,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontFamily: "'Paloseco', sans-serif",
                            fontWeight: 600,
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = provinciaTheme.primary;
                            e.currentTarget.style.boxShadow = `0 0 10px ${provinciaTheme.glow}`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Send size={12} />
                          <span>Avanzar</span>
                        </button>
                      )}

                      {/* Botón de Inspección */}
                      <button
                        onClick={() => abrirModalInspeccion(ticket)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.74rem',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: '#38BDF8',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontWeight: 700
                        }}
                      >
                        <Eye size={13} />
                        <span>Inspeccionar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {ticketsFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
            <AlertCircle size={36} color="#64748B" style={{ margin: '0 auto 0.75rem auto' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E2E8F0' }}>
              No se encontraron tickets con los filtros seleccionados
            </div>
            <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
              Modifique los filtros superiores para explorar otros cantones o severidades.
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 4. MODAL DE INSPECCIÓN DE INCIDENCIA (SOVEREIGN GLASS NIVEL 3)      */}
      {/* =================================================================== */}
      {ticketSeleccionado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-incident-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setTicketSeleccionado(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(5, 12, 28, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '20px',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}
          >
            {/* Cabecera del Modal */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#38BDF8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}
                >
                  {ticketSeleccionado.codigo}
                </span>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    backgroundColor: colorEstado(ticketSeleccionado.estado).bg,
                    color: colorEstado(ticketSeleccionado.estado).text,
                    border: `1px solid ${colorEstado(ticketSeleccionado.estado).border}`
                  }}
                >
                  {ticketSeleccionado.estado}
                </span>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    backgroundColor: colorSeveridad(ticketSeleccionado.severidad).bg,
                    color: colorSeveridad(ticketSeleccionado.severidad).text,
                    border: `1px solid ${colorSeveridad(ticketSeleccionado.severidad).border}`
                  }}
                >
                  Severidad: {ticketSeleccionado.severidad}
                </span>
              </div>

              <button
                onClick={() => setTicketSeleccionado(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Contenido en 2 Columnas */}
            <div
              style={{
                padding: '1.75rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {/* Columna Izquierda: Evidencia Fotográfica y Georreferencia */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Contenedor de Imagen WebP (<1MB) */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={ticketSeleccionado.fotoUrl}
                    alt={`Evidencia daño vial ${ticketSeleccionado.codigo}`}
                    style={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      // Fallback elegante en caso de ruta inexistente
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Badge de optimización WebP */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0, 4, 13, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.4rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#CBD5E1'
                    }}
                  >
                    <span>Formato: WebP optimizado</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>
                      {ticketSeleccionado.fotoTamanio}
                    </span>
                  </div>
                </div>

                {/* Coordenadas y Ubicación Exacta */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} color="#38BDF8" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC' }}>
                      Georreferenciación Soberana
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '0.5rem' }}>
                    <strong>Dirección:</strong> {ticketSeleccionado.direccion}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#94A3B8'
                    }}
                  >
                    <span>
                      Lat: <strong style={{ color: '#F8FAFC' }}>{ticketSeleccionado.coordenadas.lat}° N</strong>
                    </span>
                    <span>
                      Lng: <strong style={{ color: '#F8FAFC' }}>{ticketSeleccionado.coordenadas.lng}° W</strong>
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${ticketSeleccionado.coordenadas.lat},${ticketSeleccionado.coordenadas.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#38BDF8',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Mapa</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Descripción, Ley 8968 y Derivación */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Descripción del Daño */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 0.4rem 0' }}>
                    Descripción Ciudadana del Daño
                  </h4>
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: '#F8FAFC'
                    }}
                  >
                    {ticketSeleccionado.descripcion}
                  </div>
                </div>

                {/* Cumplimiento Ley N° 8968 (Datos Personales Protegidos) */}
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '12px',
                    padding: '0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                    <ShieldCheck size={16} color="#10B981" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399' }}>
                      Datos del Denunciante — Protegidos por Ley N° 8968
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4 }}>
                    <div>
                      Nombre Anonimizado:{' '}
                      <strong style={{ color: '#E2E8F0', fontFamily: "'JetBrains Mono', monospace" }}>
                        {anonimizarNombre(ticketSeleccionado.denunciante?.nombreReal)}
                      </strong>
                    </div>
                    <div>
                      Cédula Anonimizada:{' '}
                      <strong style={{ color: '#E2E8F0', fontFamily: "'JetBrains Mono', monospace" }}>
                        {anonimizarCedula(ticketSeleccionado.denunciante?.cedulaReal)}
                      </strong>
                    </div>
                    <div>
                      Fecha y Hora del Reporte:{' '}
                      <span style={{ color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>
                        {ticketSeleccionado.fechaReporte}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selector de Derivación a Entidad Competente */}
                <div>
                  <label
                    htmlFor="select-entidad"
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#94A3B8',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    Derivar Ticket a Entidad Competente:
                  </label>
                  <select
                    id="select-entidad"
                    value={entidadModal}
                    onChange={(e) => setEntidadModal(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#00040D',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {ENTIDADES_DERIVACION.map((ent) => (
                      <option key={ent.id} value={ent.nombre}>
                        {ent.nombre} — {ent.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Máquina de Estados: Indicador de Fases */}
                <div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#94A3B8',
                      marginBottom: '0.45rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    Máquina de Estados (Flujo Estricto M07):
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {ESTADOS_INCIDENCIA.map((fase, i) => {
                      const esActual = ticketSeleccionado.estado === fase;
                      const pasada =
                        ESTADOS_INCIDENCIA.indexOf(ticketSeleccionado.estado) >= i;

                      return (
                        <div
                          key={fase}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '0.4rem 0.2rem',
                            borderRadius: '6px',
                            backgroundColor: esActual
                              ? provinciaTheme.primary
                              : pasada
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(255, 255, 255, 0.03)',
                            color: esActual ? '#FFFFFF' : pasada ? '#CBD5E1' : '#64748B',
                            fontSize: '0.7rem',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: esActual ? 800 : 600,
                            border: esActual
                              ? `1px solid ${provinciaTheme.primary}`
                              : '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                        >
                          {i + 1}. {fase}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Transición con Confirmación */}
                <div style={{ marginTop: '0.5rem' }}>
                  {SIGUIENTE_ESTADO[ticketSeleccionado.estado] ? (
                    !confirmandoAvance ? (
                      <button
                        onClick={() => setConfirmandoAvance(true)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1.25rem',
                          borderRadius: '10px',
                          backgroundColor: provinciaTheme.primary,
                          border: `1px solid ${provinciaTheme.primary}`,
                          boxShadow: `0 0 16px ${provinciaTheme.glow}`,
                          color: '#FFFFFF',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>Avanzar Estado a: {SIGUIENTE_ESTADO[ticketSeleccionado.estado]}</span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <div
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          borderRadius: '10px',
                          padding: '0.85rem',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', color: '#FDE68A', fontWeight: 700, marginBottom: '0.65rem' }}>
                          ¿Confirmar transición de estado a "{SIGUIENTE_ESTADO[ticketSeleccionado.estado]}" con derivación a "{entidadModal}"?
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem' }}>
                          <button
                            onClick={() => avanzarEstadoTicket(ticketSeleccionado.id, entidadModal)}
                            style={{
                              padding: '0.45rem 1rem',
                              borderRadius: '6px',
                              backgroundColor: '#10B981',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Sí, Confirmar Avance
                          </button>
                          <button
                            onClick={() => setConfirmandoAvance(false)}
                            style={{
                              padding: '0.45rem 1rem',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#CBD5E1',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        color: '#6EE7B7',
                        textAlign: 'center',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem'
                      }}
                    >
                      <CheckCircle2 size={16} />
                      Ticket Solucionado y Cerrado en Memoria
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
