import React, { FC, useState, useMemo, useEffect } from 'react';
import {
  Trophy,
  Dumbbell,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  MapPin,
  DollarSign,
  Medal,
  Award,
  Search,
  Filter,
  FileCheck2,
  Printer,
  X,
  Phone,
  Send,
  Building,
  Sparkles,
  ExternalLink,
  Circle,
  Activity,
  Waves,
  Accessibility
} from 'lucide-react';

const renderDeporteIcon = (icono?: string) => {
  switch (icono) {
    case 'atletismo':
      return <Activity className="w-7 h-7 text-cyan-400" />;
    case 'natacion':
      return <Waves className="w-7 h-7 text-blue-400" />;
    case 'baloncesto':
      return <Trophy className="w-7 h-7 text-amber-400" />;
    case 'futbol':
      return <Trophy className="w-7 h-7 text-emerald-400" />;
    case 'taekwondo':
      return <Shield className="w-7 h-7 text-red-400" />;
    case 'adaptado':
      return <Accessibility className="w-7 h-7 text-purple-400" />;
    default:
      return <Activity className="w-7 h-7 text-cyan-400" />;
  }
};
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { CivicButton } from '../components/common/CivicButton';
import { CivicCard } from '../components/common/CivicCard';
import { FichaInstalacion } from '../components/deportes/FichaInstalacion';
import { OrgulloCantonal } from '../components/deportes/OrgulloCantonal';
import { FeedDeportivo } from '../components/deportes/FeedDeportivo';
import {
  DEPORTES_MOCK_DATA,
  InstalacionDeportiva,
  ConvocatoriaJDN,
  DisciplinaOficial
} from '../data/deportesData';
import { useCivicModal } from '../context/CivicModalContext';

export const DeportesPage: FC = () => {
  const { mostrarAlerta } = useCivicModal();
  // Cantón activo sincronizado con el Navbar y Theming Engine
  const [cantonActivo, setCantonActivo] = useState<string>(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  useEffect(() => {
    const handleCantonChange = (e: any) => {
      if (e.detail?.nombre) setCantonActivo(e.detail.nombre);
      else {
        const saved = localStorage.getItem('cr_canton_activo');
        if (saved) setCantonActivo(saved);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    window.addEventListener('storage', handleCantonChange);
    return () => {
      window.removeEventListener('cantonChanged', handleCantonChange);
      window.removeEventListener('storage', handleCantonChange);
    };
  }, []);

  const [seccionActiva, setSeccionActiva] = useState<'instalaciones' | 'jdn' | 'escuelas' | 'orgullo' | 'feed'>('instalaciones');
  const [filtroSemaforo, setFiltroSemaforo] = useState<string>('todos');
  const [busquedaInstalacion, setBusquedaInstalacion] = useState<string>('');

  // Modales de Reserva e Inscripción JDN
  const [instalacionParaReservar, setInstalacionParaReservar] = useState<InstalacionDeportiva | null>(null);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<ConvocatoriaJDN | null>(null);
  const [comprobanteGenerado, setComprobanteGenerado] = useState<{ tipo: string; id: string; titulo: string; detalle: string } | null>(null);

  // Formulario de Reserva de Instalación
  const [formReserva, setFormReserva] = useState({
    nombreCompleto: '',
    cedula: '',
    telefono: '',
    correo: '',
    fechaRequerida: '',
    horaInicio: '08:00',
    horaFin: '10:00',
    motivoUso: 'practica_comunitaria'
  });

  // Formulario de Preinscripción a Visoría JDN
  const [formJdn, setFormJdn] = useState({
    nombreAtleta: '',
    cedulaAtleta: '',
    fechaNacimiento: '',
    distritoResidencia: '',
    nombreTutor: '',
    telefonoTutor: '',
    polizaIns: 'SI',
    aceptaDeclaracion: false
  });

  const instalacionesFiltradas = useMemo(() => {
    return DEPORTES_MOCK_DATA.instalaciones.filter((inst) => {
      const matchEstado =
        filtroSemaforo === 'todos' ||
        (filtroSemaforo === 'abierto' && inst.estado === 'abierto') ||
        (filtroSemaforo === 'mantenimiento' && inst.estado === 'mantenimiento') ||
        (filtroSemaforo === 'reservado_escuelas' && inst.estado === 'reservado_escuelas');

      const q = busquedaInstalacion.toLowerCase().trim();
      const matchQuery =
        !q ||
        inst.nombre.toLowerCase().includes(q) ||
        inst.distrito.toLowerCase().includes(q) ||
        inst.disciplinaPrincipal.toLowerCase().includes(q);

      return matchEstado && matchQuery;
    });
  }, [filtroSemaforo, busquedaInstalacion]);

  const handleAbrirReserva = (inst: InstalacionDeportiva) => {
    setInstalacionParaReservar(inst);
  };

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReserva.nombreCompleto || !formReserva.cedula) {
      mostrarAlerta({
        titulo: 'Campos Obligatorios Incompletos',
        mensaje: 'Por favor complete su nombre completo y número de cédula para procesar la reserva del espacio deportivo.',
        icono: 'advertencia'
      });
      return;
    }

    const expId = `RES-CCDR-${cantonActivo.substring(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setComprobanteGenerado({
      tipo: 'Reserva de Instalación Deportiva',
      id: expId,
      titulo: instalacionParaReservar?.nombre || 'Instalación Municipal',
      detalle: `Fecha: ${formReserva.fechaRequerida || 'Próximo sábado'} de ${formReserva.horaInicio} a ${formReserva.horaFin} hrs. Solicitante: ${formReserva.nombreCompleto} (Cédula: ${formReserva.cedula}).`
    });
    setInstalacionParaReservar(null);
  };

  const handleConfirmarJdn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJdn.nombreAtleta || !formJdn.cedulaAtleta || !formJdn.aceptaDeclaracion) {
      mostrarAlerta({
        titulo: 'Declaración Incompleta',
        mensaje: 'Por favor complete todos los datos requeridos del atleta y confirme la declaración jurada reglamentaria.',
        icono: 'advertencia'
      });
      return;
    }

    const jdnId = `JDN-VIS-${cantonActivo.substring(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setComprobanteGenerado({
      tipo: 'Pase Técnico de Visoría JDN',
      id: jdnId,
      titulo: `Convocatoria: ${convocatoriaSeleccionada?.disciplina} (${convocatoriaSeleccionada?.categoriaEdad})`,
      detalle: `Atleta: ${formJdn.nombreAtleta} (Cédula: ${formJdn.cedulaAtleta}). Sede: ${convocatoriaSeleccionada?.lugarVisorias}. Tutor legal: ${formJdn.nombreTutor}.`
    });
    setConvocatoriaSeleccionada(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--theme-bg, #F8FAFC)',
        color: 'var(--theme-text-primary, #131313)',
        position: 'relative'
      }}
    >
      <Navbar />

      <main className="civic-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Membrete Institucional del CCDR Cantonal */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
            <CivicBadge variant="provincial" size="md">
              COMITÉ CANTONAL DE DEPORTES Y RECREACIÓN &bull; {cantonActivo.toUpperCase()}
            </CivicBadge>
            <span style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
              Personería Jurídica Instrumental y Autonomía Administrativa (Artículos 164 al 172 del Código Municipal - Ley N° 7794)
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline, 'Poppins', sans-serif)",
              fontSize: 'clamp(1.9rem, 4vw, 2.9rem)',
              fontWeight: 800,
              color: 'var(--cru-text, #062A77)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.85rem 0'
            }}
          >
            Comité Cantonal de Deportes y Recreación de {cantonActivo} (CCDR)
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--cru-text-secondary, #334155)', maxWidth: '900px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Órgano municipal autónomo responsable de democratizar el acceso a la infraestructura deportiva pública, fomentar las escuelas formativas gratuitas para la niñez y juventud, y preparar a las delegaciones cantonales para los Juegos Deportivos Nacionales (JDN) del ICODER.
          </p>
        </div>

        {/* Panel de Indicadores de Gestión y Membrete Legal */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderTop: '4px solid #0053AF',
              borderRadius: '18px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-card, 0 4px 20px -2px rgba(6, 42, 119, 0.06))'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(0, 83, 175, 0.08)',
                      border: '1px solid rgba(0, 83, 175, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Shield size={22} color="#0053AF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#062A77', margin: 0 }}>
                      Gobernanza y Autonomía Deportiva Municipal (Ley N° 7794)
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
                      Junta Directiva conformada por 5 miembros ad honorem con representación cantonal plural
                    </span>
                  </div>
                </div>

                <CivicBadge variant="provincial" size="sm">
                  Presupuesto Ley: Mínimo 3% Ingresos Ordinarios
                </CivicBadge>
              </div>

              {/* Métricas de Infraestructura y Atletas */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '1rem',
                  background: '#F8FAFC',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Instalaciones Administradas:</span>
                  <strong style={{ fontSize: '1.4rem', color: '#062A77', fontFamily: "monospace" }}>
                    {DEPORTES_MOCK_DATA.instalaciones.length} recintos
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#059669', display: 'block', fontWeight: 700 }}>100% con Ley 7600</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Atletas en Selecciones JDN:</span>
                  <strong style={{ fontSize: '1.4rem', color: '#0F172A', fontFamily: "monospace" }}>
                    284 atletas
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#475569', display: 'block', fontWeight: 600 }}>Fase Eliminatoria 2026</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Escuelas Formativas Comunitarias:</span>
                  <strong style={{ fontSize: '1.4rem', color: '#0053AF', fontFamily: "monospace" }}>
                    {DEPORTES_MOCK_DATA.escuelas.length} gratuitas
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#475569', display: 'block', fontWeight: 600 }}>Cobertura en los distritos</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Medallero Histórico JDN:</span>
                  <strong style={{ fontSize: '1.4rem', color: '#B45309', fontFamily: "monospace" }}>
                    9 Medallas Oro
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#92400E', display: 'block', fontWeight: 700 }}>Última edición nacional</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Pestañas Deportivas */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid #E2E8F0',
            marginBottom: '2.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
          role="tablist"
          aria-label="Secciones Deportivas del CCDR"
        >
          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'instalaciones'}
            onClick={() => setSeccionActiva('instalaciones')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'instalaciones' ? '3px solid #0053AF' : '3px solid transparent',
              color: seccionActiva === 'instalaciones' ? '#062A77' : '#64748B',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Dumbbell size={18} color={seccionActiva === 'instalaciones' ? '#0053AF' : '#64748B'} />
            <span>Instalaciones Públicas y Semáforo</span>
            <CivicBadge variant="default" size="sm">
              {DEPORTES_MOCK_DATA.instalaciones.length}
            </CivicBadge>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'jdn'}
            onClick={() => setSeccionActiva('jdn')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'jdn' ? '3px solid #0053AF' : '3px solid transparent',
              color: seccionActiva === 'jdn' ? '#062A77' : '#64748B',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Medal size={18} color={seccionActiva === 'jdn' ? '#0053AF' : '#64748B'} />
            <span>Juegos Deportivos Nacionales (JDN)</span>
            <CivicBadge variant="provincial" size="sm">
              {DEPORTES_MOCK_DATA.convocatorias.length} Convocatorias
            </CivicBadge>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'escuelas'}
            onClick={() => setSeccionActiva('escuelas')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'escuelas' ? '3px solid #0053AF' : '3px solid transparent',
              color: seccionActiva === 'escuelas' ? '#062A77' : '#64748B',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={18} color={seccionActiva === 'escuelas' ? '#0053AF' : '#64748B'} />
            <span>Escuelas Deportivas CCDR</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'orgullo'}
            onClick={() => setSeccionActiva('orgullo')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'orgullo' ? '3px solid #0053AF' : '3px solid transparent',
              color: seccionActiva === 'orgullo' ? '#062A77' : '#64748B',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Trophy size={18} color={seccionActiva === 'orgullo' ? '#0053AF' : '#64748B'} />
            <span>Salón de Honor y Medallas</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'feed'}
            onClick={() => setSeccionActiva('feed')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'feed' ? '3px solid #0053AF' : '3px solid transparent',
              color: seccionActiva === 'feed' ? '#062A77' : '#64748B',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Calendar size={18} color={seccionActiva === 'feed' ? '#0053AF' : '#64748B'} />
            <span>Feed Comunitario</span>
          </button>
        </div>

        {/* PESTAÑA 1: Instalaciones Públicas con Semáforo Formal */}
        {seccionActiva === 'instalaciones' && (
          <section aria-label="Directorio de Instalaciones con Semáforo Cívico">
            {/* Barra de Filtros del Semáforo */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FFFFFF',
                padding: '1.25rem',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-card, 0 4px 20px -2px rgba(6, 42, 119, 0.06))',
                marginBottom: '2rem'
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 280px' }}>
                <Search size={18} color="#0053AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={busquedaInstalacion}
                  onChange={(e) => setBusquedaInstalacion(e.target.value)}
                  placeholder="Buscar instalación por nombre, disciplina o distrito..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.4rem',
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    color: '#0F172A',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontWeight: 500
                  }}
                />
              </div>

              {/* Botonera de Semáforo Formal */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Semáforo:</span>
                <button
                  type="button"
                  onClick={() => setFiltroSemaforo('todos')}
                  style={{
                    background: filtroSemaforo === 'todos' ? '#0053AF' : '#F1F5F9',
                    color: filtroSemaforo === 'todos' ? '#FFFFFF' : '#334155',
                    border: filtroSemaforo === 'todos' ? '1px solid #0053AF' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Todas ({DEPORTES_MOCK_DATA.instalaciones.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroSemaforo('abierto')}
                  style={{
                    background: filtroSemaforo === 'abierto' ? '#ECFDF5' : '#F1F5F9',
                    color: filtroSemaforo === 'abierto' ? '#047857' : '#334155',
                    border: filtroSemaforo === 'abierto' ? '1.5px solid #059669' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Circle className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                  <span>Abierto al Público</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroSemaforo('mantenimiento')}
                  style={{
                    background: filtroSemaforo === 'mantenimiento' ? '#FFFBEB' : '#F1F5F9',
                    color: filtroSemaforo === 'mantenimiento' ? '#B45309' : '#334155',
                    border: filtroSemaforo === 'mantenimiento' ? '1.5px solid #D97706' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Circle className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  <span>Mantenimiento</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroSemaforo('reservado_escuelas')}
                  style={{
                    background: filtroSemaforo === 'reservado_escuelas' ? '#EFF6FF' : '#F1F5F9',
                    color: filtroSemaforo === 'reservado_escuelas' ? '#1E40AF' : '#334155',
                    border: filtroSemaforo === 'reservado_escuelas' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Circle className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />
                  <span>Reservado para Escuelas</span>
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {instalacionesFiltradas.map((inst) => (
                <FichaInstalacion
                  key={inst.id}
                  instalacion={inst}
                  onReservar={() => handleAbrirReserva(inst)}
                />
              ))}
            </div>
          </section>
        )}

        {/* PESTAÑA 2: Juegos Deportivos Nacionales (JDN) y Disciplinas */}
        {seccionActiva === 'jdn' && (
          <section aria-label="Convocatorias y Disciplinas para Juegos Deportivos Nacionales">
            {/* Banner ICODER */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(0, 43, 127, 0.35) 0%, rgba(206, 17, 38, 0.2) 100%)',
                border: '1px solid rgba(125, 211, 252, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem 1.75rem',
                marginBottom: '2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Medal size={20} color="#FCD34D" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Programa Oficial Juegos Deportivos Nacionales (ICODER &bull; Ciclo 2026)
                  </h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#CBD5E1', maxWidth: '750px', margin: 0, lineHeight: 1.5 }}>
                  Proceso de captación, visorías técnicas y conformación de las selecciones cantonales que representarán a {cantonActivo} en las etapas eliminatorias y finales nacionales.
                </p>
              </div>

              <CivicBadge variant="provincial" size="md">
                Avalado por el ICODER
              </CivicBadge>
            </div>

            {/* Listado de Convocatorias Abiertas */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Convocatorias Abiertas a Pruebas Técnicas y Visorías
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {DEPORTES_MOCK_DATA.convocatorias.map((conv) => (
                  <CivicCard key={conv.id} level={1} interactive>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <CivicBadge variant="provincial" size="sm">
                            {conv.etapaActual}
                          </CivicBadge>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0.4rem 0 0 0' }}>
                            {conv.disciplina}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#7DD3FC', fontWeight: 600 }}>
                            Rama: {conv.rama} &bull; {conv.categoriaEdad}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Calendar size={15} color="#FBBF24" />
                          <span>{conv.fechasVisorias}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <MapPin size={15} color="#7DD3FC" />
                          <span>{conv.lugarVisorias} (<strong>{conv.distrito}</strong>)</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Users size={15} color="#34D399" />
                          <span>Entrenador: <strong style={{ color: '#FFFFFF' }}>{conv.entrenadorFederado}</strong></span>
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '0.78rem',
                          color: '#94A3B8'
                        }}
                      >
                        <strong style={{ color: '#E2E8F0', display: 'block', marginBottom: '0.25rem' }}>Requisitos Obligatorios:</strong>
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                          {conv.requisitosObligatorios.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                          Cierre: <strong style={{ color: '#F87171' }}>{conv.fechaCierreInscripcion}</strong>
                        </span>

                        <CivicButton
                          variant="primary"
                          size="sm"
                          onClick={() => setConvocatoriaSeleccionada(conv)}
                        >
                          Preinscribirse a Visoría
                        </CivicButton>
                      </div>
                    </div>
                  </CivicCard>
                ))}
              </div>
            </div>

            {/* Catálogo de Disciplinas Deportivas Oficiales */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Disciplinas Deportivas Federadas del Cantón
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {DEPORTES_MOCK_DATA.disciplinas.map((disc) => (
                  <CivicCard key={disc.id} level={1}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {renderDeporteIcon(disc.icono)}
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                            {disc.nombre}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#7DD3FC' }}>
                            Modalidad: {disc.categoria}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div><strong>Sede: </strong>{disc.sedeEntrenamiento}</div>
                        <div><strong>Entrenador Principal: </strong>{disc.entrenadorPrincipal}</div>
                        <div><strong>Licencia: </strong><code style={{ color: '#A7F3D0' }}>{disc.licenciaFederativa}</code></div>
                        <div><strong>Atletas Activos: </strong>{disc.atletasActivos} atletas</div>
                      </div>
                    </div>
                  </CivicCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA 3: Escuelas Formativas CCDR */}
        {seccionActiva === 'escuelas' && (
          <section aria-label="Catálogo de Escuelas Deportivas Formativas">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {DEPORTES_MOCK_DATA.escuelas.map((esc) => (
                <CivicCard key={esc.id} level={1} interactive>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {renderDeporteIcon(esc.icono)}
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                            {esc.disciplina}
                          </h3>
                          <span style={{ fontSize: '0.8rem', color: '#7DD3FC' }}>
                            {esc.categoriaEdad}
                          </span>
                        </div>
                      </div>

                      <CivicBadge variant="success" size="sm">
                        {esc.cuposDisponibles} cupos
                      </CivicBadge>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div><strong>Entrenador: </strong>{esc.profesorACargo}</div>
                      <div><strong>Sede: </strong>{esc.lugarEntrenamiento}</div>
                      <div><strong>Horarios: </strong>{esc.diasHorario}</div>
                      <div><strong>Inversión: </strong><span style={{ color: '#34D399', fontWeight: 600 }}>{esc.mensualidad}</span></div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.78rem',
                        color: '#94A3B8'
                      }}
                    >
                      <strong style={{ color: '#E2E8F0', display: 'block', marginBottom: '0.2rem' }}>Requisitos:</strong>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                        {esc.requisitos.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <CivicButton
                      variant="provincial"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        mostrarAlerta({
                          titulo: 'Inscripción a Escuela Deportiva',
                          mensaje: `Iniciando postulación a la escuela de ${esc.disciplina}. Se solicitarán los documentos y atestados en la ventanilla digital municipal.`,
                          icono: 'info'
                        });
                      }}
                    >
                      Inscribir Atleta (Gratuito CCDR)
                    </CivicButton>
                  </div>
                </CivicCard>
              ))}
            </div>
          </section>
        )}

        {/* PESTAÑA 4: Salón de Honor y Medallas JDN */}
        {seccionActiva === 'orgullo' && (
          <section aria-label="Atletas de Orgullo Cantonal y Medallero">
            <OrgulloCantonal atletas={DEPORTES_MOCK_DATA.atletas} />
          </section>
        )}

        {/* PESTAÑA 5: Feed Comunitario */}
        {seccionActiva === 'feed' && (
          <section aria-label="Feed Comunitario y Convocatorias">
            <FeedDeportivo postsIniciales={DEPORTES_MOCK_DATA.feed} />
          </section>
        )}

        {/* MODAL 1: Reserva de Espacio Deportivo */}
        {instalacionParaReservar && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 4, 13, 0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem'
            }}
          >
            <div
              style={{
                background: '#040B1A',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '18px',
                maxWidth: '580px',
                width: '100%',
                padding: '2rem',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <button
                type="button"
                onClick={() => setInstalacionParaReservar(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Solicitud Oficial de Espacio Público &bull; CCDR {cantonActivo.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0.35rem 0' }}>
                  {instalacionParaReservar.nombre}
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                  Distrito: <strong>{instalacionParaReservar.distrito}</strong> &bull; {instalacionParaReservar.disciplinaPrincipal}
                </span>
              </div>

              <form onSubmit={handleConfirmarReserva} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                    Nombre del Solicitante / Organización Comunal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formReserva.nombreCompleto}
                    onChange={(e) => setFormReserva({ ...formReserva, nombreCompleto: e.target.value })}
                    placeholder="Ej: Asociación de Vecinos de Hatillo o Juan Pérez..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Cédula de Identidad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formReserva.cedula}
                      onChange={(e) => setFormReserva({ ...formReserva, cedula: e.target.value })}
                      placeholder="1-0000-0000"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontFamily: "var(--font-telemetry, monospace)"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formReserva.telefono}
                      onChange={(e) => setFormReserva({ ...formReserva, telefono: e.target.value })}
                      placeholder="(506) 8888-8888"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Fecha Requerida
                    </label>
                    <input
                      type="date"
                      value={formReserva.fechaRequerida}
                      onChange={(e) => setFormReserva({ ...formReserva, fechaRequerida: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Horario
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="time"
                        value={formReserva.horaInicio}
                        onChange={(e) => setFormReserva({ ...formReserva, horaInicio: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.5rem',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }}
                      />
                      <span style={{ color: '#94A3B8' }}>a</span>
                      <input
                        type="time"
                        value={formReserva.horaFin}
                        onChange={(e) => setFormReserva({ ...formReserva, horaFin: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.5rem',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.78rem',
                    color: '#94A3B8'
                  }}
                >
                  Tarifa reglamentaria: <strong>{instalacionParaReservar.tarifaAlquiler}</strong>. El CCDR garantiza el cumplimiento de los Artículos 164-172 del Código Municipal.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <CivicButton
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setInstalacionParaReservar(null)}
                  >
                    Cancelar
                  </CivicButton>
                  <CivicButton
                    variant="primary"
                    size="sm"
                    type="submit"
                    leftIcon={<FileCheck2 size={16} />}
                  >
                    Radicar Solicitud de Reserva
                  </CivicButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Preinscripción a Visoría JDN */}
        {convocatoriaSeleccionada && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 4, 13, 0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem'
            }}
          >
            <div
              style={{
                background: '#040B1A',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '18px',
                maxWidth: '580px',
                width: '100%',
                padding: '2rem',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <button
                type="button"
                onClick={() => setConvocatoriaSeleccionada(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Preinscripción Oficial a Visoría &bull; Juegos Deportivos Nacionales
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0.35rem 0' }}>
                  {convocatoriaSeleccionada.disciplina}
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#7DD3FC' }}>
                  Categoría: {convocatoriaSeleccionada.categoriaEdad} &bull; Sede: {convocatoriaSeleccionada.lugarVisorias}
                </span>
              </div>

              <form onSubmit={handleConfirmarJdn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                    Nombre Completo del Atleta *
                  </label>
                  <input
                    type="text"
                    required
                    value={formJdn.nombreAtleta}
                    onChange={(e) => setFormJdn({ ...formJdn, nombreAtleta: e.target.value })}
                    placeholder="Nombre y apellidos del menor o atleta..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Cédula / TIM del Atleta *
                    </label>
                    <input
                      type="text"
                      required
                      value={formJdn.cedulaAtleta}
                      onChange={(e) => setFormJdn({ ...formJdn, cedulaAtleta: e.target.value })}
                      placeholder="1-0000-0000"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontFamily: "var(--font-telemetry, monospace)"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Distrito de Residencia *
                    </label>
                    <input
                      type="text"
                      required
                      value={formJdn.distritoResidencia}
                      onChange={(e) => setFormJdn({ ...formJdn, distritoResidencia: e.target.value })}
                      placeholder="Ej: Pavas, Hatillo, San Francisco..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Nombre del Padre, Madre o Tutor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formJdn.nombreTutor}
                      onChange={(e) => setFormJdn({ ...formJdn, nombreTutor: e.target.value })}
                      placeholder="Tutor responsable..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '0.3rem' }}>
                      Teléfono de Emergencia / Tutor *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formJdn.telefonoTutor}
                      onChange={(e) => setFormJdn({ ...formJdn, telefonoTutor: e.target.value })}
                      placeholder="(506) 8888-8888"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginTop: '0.25rem' }}>
                  <input
                    type="checkbox"
                    id="declaracionJdn"
                    required
                    checked={formJdn.aceptaDeclaracion}
                    onChange={(e) => setFormJdn({ ...formJdn, aceptaDeclaracion: e.target.checked })}
                    style={{ marginTop: '0.25rem', accentColor: '#002B7F' }}
                  />
                  <label htmlFor="declaracionJdn" style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                    Declaro bajo juramento que los datos suministrados son fidedignos, el atleta reside en el cantón de {cantonActivo} y cuenta con póliza de accidentes activa para la visoría oficial.
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <CivicButton
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setConvocatoriaSeleccionada(null)}
                  >
                    Cancelar
                  </CivicButton>
                  <CivicButton
                    variant="primary"
                    size="sm"
                    type="submit"
                    leftIcon={<Award size={16} />}
                  >
                    Generar Pase de Visoría JDN
                  </CivicButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: Comprobante Formal Descargable / Imprimible */}
        {comprobanteGenerado && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 4, 13, 0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem'
            }}
          >
            <div
              style={{
                background: '#040B1A',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '18px',
                maxWidth: '600px',
                width: '100%',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
              }}
            >
              <button
                type="button"
                onClick={() => setComprobanteGenerado(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  COMITÉ CANTONAL DE DEPORTES Y RECREACIÓN &bull; {cantonActivo.toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
                  {comprobanteGenerado.tipo}
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#7DD3FC', fontWeight: 700, fontFamily: "var(--font-telemetry, monospace)" }}>
                  {comprobanteGenerado.id}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  fontSize: '0.875rem',
                  color: '#E2E8F0',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {comprobanteGenerado.titulo}
                </div>
                <p style={{ margin: '0 0 0.75rem 0' }}>
                  {comprobanteGenerado.detalle}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem' }}>
                  Trámite oficial registrado bajo los Artículos 164-172 del Código Municipal (Ley N° 7794). Presente este comprobante digital o impreso ante el administrador de la instalación o cuerpo técnico en la sede.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Sello Cívico Digital &bull; CCDR {cantonActivo}
                </span>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <CivicButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setComprobanteGenerado(null)}
                  >
                    Cerrar
                  </CivicButton>
                  <CivicButton
                    variant="primary"
                    size="sm"
                    onClick={() => window.print()}
                    leftIcon={<Printer size={15} />}
                  >
                    Imprimir Comprobante
                  </CivicButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeportesPage;
