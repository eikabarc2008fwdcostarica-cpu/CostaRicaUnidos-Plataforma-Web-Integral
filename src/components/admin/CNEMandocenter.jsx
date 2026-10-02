/**
 * ============================================================================
 * COSTA RICA UNIDOS — PUESTO DE MANDO Y ALBERGUES CNE (M10)
 * Módulo de Resiliencia Territorial y Gestión de Alertas Tempranas
 * Design System: Sovereign Civic Glass v2.1
 * ============================================================================
 * 
 * Reglas de Negocio Implementadas:
 * - 4 Niveles Oficiales CNE: Verde (Informativa), Amarilla (Preparación), Naranja (Movilización), Roja (Evacuación).
 * - Boletín técnico provincial CNE editable.
 * - Doble confirmación de seguridad para evitar emisiones críticas accidentales.
 * - Vista previa del cintillo PWA en tiempo real (36px, vidrio oscuro, JetBrains Mono).
 * - Monitor de albergues temporales con cálculo porcentual dinámico.
 * - Ajuste reactivo de personas albergadas (+ / - / input) con transición automática a "Lleno" / "Activo" / "En Reserva".
 */
import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Users,
  Building,
  Home,
  ArrowRight,
  Flame,
  CloudRain,
  Eye,
  Send,
  RefreshCw,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  FileText,
  MapPin,
  Lock,
  Layers
} from 'lucide-react';

// 4 Niveles Oficiales de Alerta de la Comisión Nacional de Emergencias (CNE)
export const NIVELES_ALERTA_CNE = [
  {
    nivel: 'VERDE',
    nombre: 'Alerta Verde',
    fase: 'Informativa / Prevención',
    descripcion: 'Vigilancia continua sobre fenómenos meteorológicos o sísmicos sin impacto destructivo inminente.',
    color: '#10B981',
    bgBadge: 'rgba(16, 185, 129, 0.15)',
    borderBadge: 'rgba(16, 185, 129, 0.4)',
    glow: 'rgba(16, 185, 129, 0.4)'
  },
  {
    nivel: 'AMARILLA',
    nombre: 'Alerta Amarilla',
    fase: 'Preparación',
    descripcion: 'Alistamiento de Comités Municipales de Emergencia (CME) y monitoreo de cuencas y taludes propensos.',
    color: '#F59E0B',
    bgBadge: 'rgba(245, 158, 11, 0.15)',
    borderBadge: 'rgba(245, 158, 11, 0.4)',
    glow: 'rgba(245, 158, 11, 0.4)'
  },
  {
    nivel: 'NARANJA',
    nombre: 'Alerta Naranja',
    fase: 'Movilización / Peligro Inminente',
    descripcion: 'Activación de recursos operativos, movilización de suministros y apertura de albergues temporales.',
    color: '#EA580C',
    bgBadge: 'rgba(234, 88, 12, 0.18)',
    borderBadge: 'rgba(234, 88, 12, 0.45)',
    glow: 'rgba(234, 88, 12, 0.45)'
  },
  {
    nivel: 'ROJA',
    nombre: 'Alerta Roja',
    fase: 'Evacuación / Impacto',
    descripcion: 'Peligro extremo para la vida humana. Evacuación obligatoria inmediata y rescate activo.',
    color: '#EF4444',
    bgBadge: 'rgba(239, 68, 68, 0.22)',
    borderBadge: 'rgba(239, 68, 68, 0.55)',
    glow: 'rgba(239, 68, 68, 0.55)'
  }
];

// Albergues temporales representativos de la Provincia (Puntarenas)
const ALBERGUES_INICIALES = [
  {
    id: 'ALB-PUN-01',
    nombre: 'Gimnasio Municipal El Roble',
    canton: 'Puntarenas',
    distrito: 'El Roble',
    direccion: 'Costado norte de la Plaza de Deportes El Roble',
    capacidadTotal: 350,
    ocupacionActual: 180,
    estado: 'Activo',
    coordinador: 'Dra. Andrea Leitón (CNE Regional)',
    suministros: 'Raciones CCSS 100%, 300 camas de campaña, agua purificada',
    telefonoContacto: '+506 2663-1190'
  },
  {
    id: 'ALB-OSA-02',
    nombre: 'Salón Comunal Ciudad Cortés',
    canton: 'Osa',
    distrito: 'Ciudad Cortés',
    direccion: 'Avenida Central, 100m oeste de la Cruz Roja',
    capacidadTotal: 220,
    ocupacionActual: 215,
    estado: 'Lleno',
    coordinador: 'Oficial Gerardo Picado (Cruz Roja)',
    suministros: 'Kits de aseo para 200 personas, tanques cisterna AyA',
    telefonoContacto: '+506 2786-8844'
  },
  {
    id: 'ALB-GOL-03',
    nombre: 'Liceo Rural Río Claro',
    canton: 'Golfito',
    distrito: 'Guaycará',
    direccion: 'Río Claro, contiguo a la Estación de Bomberos',
    capacidadTotal: 180,
    ocupacionActual: 65,
    estado: 'Activo',
    coordinador: 'Lic. Marco Vinicio Prado (Municipalidad)',
    suministros: 'Colchonetas, botiquines CCSS, alimentos no perecederos',
    telefonoContacto: '+506 2775-0912'
  },
  {
    id: 'ALB-QUE-04',
    nombre: 'Gimnasio Municipal de Quepos',
    canton: 'Quepos',
    distrito: 'Quepos Central',
    direccion: 'Barrio La Inmaculada, 200m sur del Mercado Central',
    capacidadTotal: 280,
    ocupacionActual: 0,
    estado: 'En Reserva',
    coordinador: 'Ing. Tatiana Solano (Comité Local CME)',
    suministros: 'Instalaciones sanitarias listas, stock de insumos en bodega',
    telefonoContacto: '+506 2777-1044'
  },
  {
    id: 'ALB-ESP-05',
    nombre: 'Escuela Central de Esparza',
    canton: 'Esparza',
    distrito: 'Espíritu Santo',
    direccion: 'Frente al Parque Ignacio Pérez',
    capacidadTotal: 160,
    ocupacionActual: 30,
    estado: 'Activo',
    coordinador: 'MSc. Roberto Chacón (MEP / Enlace)',
    suministros: 'Comedor escolar habilitado, cocina de gas y botiquines',
    telefonoContacto: '+506 2636-4022'
  },
  {
    id: 'ALB-PAR-06',
    nombre: 'Salón Parroquial San José de Parrita',
    canton: 'Parrita',
    distrito: 'Parrita',
    direccion: 'Costado este del Templo Parroquial',
    capacidadTotal: 140,
    ocupacionActual: 0,
    estado: 'En Reserva',
    coordinador: 'Pbro. Francisco Gómez / Pastoral Social',
    suministros: 'Colchones de reserva, salón con ventilación forzada',
    telefonoContacto: '+506 2779-9133'
  }
];

export default function CNEMandocenter({
  provinciaTheme = {
    primary: '#F36717',
    glow: 'rgba(243, 103, 23, 0.4)',
    nombre: 'Puntarenas'
  }
}) {
  // Estado de la Alerta Provincial activa
  const [nivelSeleccionado, setNivelSeleccionado] = useState('AMARILLA');
  const [alertaVigente, setAlertaVigente] = useState('AMARILLA');

  // Boletín técnico editable
  const [boletinTexto, setBoletinTexto] = useState(
    `Se declara estado de ALERTA AMARILLA para los 13 cantones de la Provincia de ${provinciaTheme.nombre} debido al incremento sostenido en las precipitaciones por el paso de la Onda Tropical N° 42. Se instruye a los Comités Municipales de Emergencia (CME) mantener vigilancia sobre las cuencas de los ríos costeros y proceder al alistamiento de albergues temporales.`
  );

  // Estados de seguridad para la doble confirmación
  const [solicitandoConfirmacion, setSolicitandoConfirmacion] = useState(false);
  const [alertaTransmitidaExito, setAlertaTransmitidaExito] = useState(false);

  // Lista de albergues con ocupación reactiva
  const [albergues, setAlbergues] = useState(ALBERGUES_INICIALES);

  // Datos del nivel de alerta seleccionado y vigente
  const configNivelSeleccionado = useMemo(() => {
    return NIVELES_ALERTA_CNE.find((n) => n.nivel === nivelSeleccionado) || NIVELES_ALERTA_CNE[1];
  }, [nivelSeleccionado]);

  const configAlertaVigente = useMemo(() => {
    return NIVELES_ALERTA_CNE.find((n) => n.nivel === alertaVigente) || NIVELES_ALERTA_CNE[1];
  }, [alertaVigente]);

  // Manejo de la emisión de alerta con doble confirmación
  const iniciarEmisionAlerta = () => {
    setSolicitandoConfirmacion(true);
    setAlertaTransmitidaExito(false);
  };

  const confirmarEmisionAlerta = () => {
    setAlertaVigente(nivelSeleccionado);
    setSolicitandoConfirmacion(false);
    setAlertaTransmitidaExito(true);

    setTimeout(() => {
      setAlertaTransmitidaExito(false);
    }, 4500);
  };

  const cancelarEmision = () => {
    setSolicitandoConfirmacion(false);
  };

  // Ajuste de personas albergadas en tiempo real
  const ajustarPersonasAlbergadas = (idAlbergue, delta) => {
    setAlbergues((prev) =>
      prev.map((alb) => {
        if (alb.id !== idAlbergue) return alb;

        const nuevaOcupacion = Math.max(0, Math.min(alb.capacidadTotal, alb.ocupacionActual + delta));

        // Determinar estado según ocupación
        let nuevoEstado = alb.estado;
        if (nuevaOcupacion >= alb.capacidadTotal) {
          nuevoEstado = 'Lleno';
        } else if (nuevaOcupacion === 0) {
          nuevoEstado = 'En Reserva';
        } else {
          nuevoEstado = 'Activo';
        }

        return {
          ...alb,
          ocupacionActual: nuevaOcupacion,
          estado: nuevoEstado
        };
      })
    );
  };

  // Ajuste directo mediante input numérico
  const setOcupacionDirecta = (idAlbergue, valorString) => {
    const val = parseInt(valorString, 10);
    const num = isNaN(val) ? 0 : val;

    setAlbergues((prev) =>
      prev.map((alb) => {
        if (alb.id !== idAlbergue) return alb;

        const nuevaOcupacion = Math.max(0, Math.min(alb.capacidadTotal, num));
        let nuevoEstado = alb.estado;
        if (nuevaOcupacion >= alb.capacidadTotal) {
          nuevoEstado = 'Lleno';
        } else if (nuevaOcupacion === 0) {
          nuevoEstado = 'En Reserva';
        } else {
          nuevoEstado = 'Activo';
        }

        return {
          ...alb,
          ocupacionActual: nuevaOcupacion,
          estado: nuevoEstado
        };
      })
    );
  };

  // Métricas globales acumuladas
  const metricasAlbergues = useMemo(() => {
    const totalCapacidad = albergues.reduce((acc, a) => acc + a.capacidadTotal, 0);
    const totalOcupacion = albergues.reduce((acc, a) => acc + a.ocupacionActual, 0);
    const alberguesActivos = albergues.filter((a) => a.estado === 'Activo' || a.estado === 'Lleno').length;
    const porcentajeGlobal = totalCapacidad > 0 ? Math.round((totalOcupacion / totalCapacidad) * 100) : 0;

    return {
      totalCapacidad,
      totalOcupacion,
      alberguesActivos,
      porcentajeGlobal
    };
  }, [albergues]);

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
      {/* CABECERA PRINCIPAL DEL FRENTE M10                                    */}
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
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${configAlertaVigente.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${configAlertaVigente.glow}`
            }}
          >
            <ShieldAlert size={22} color={configAlertaVigente.color} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "'Mistical Spring', Georgia, serif",
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '0.02em'
              }}
            >
              Comando CNE y Albergues Temporales (M10)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Supervisión de emergencias, emisión de alertas soberanas y red de albergues en {provinciaTheme.nombre}.
            </p>
          </div>
        </div>

        {/* Alerta Vigente Actual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.45rem 0.95rem',
            borderRadius: '10px',
            backgroundColor: configAlertaVigente.bgBadge,
            border: `1px solid ${configAlertaVigente.borderBadge}`,
            boxShadow: `0 0 16px ${configAlertaVigente.glow}`
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: configAlertaVigente.color,
              boxShadow: `0 0 8px ${configAlertaVigente.color}`
            }}
          />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.68rem', color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              ALERTA VIGENTE PROVINCIAL:
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: configAlertaVigente.color, fontFamily: "'JetBrains Mono', monospace" }}>
              NIVEL {configAlertaVigente.nivel} ({configAlertaVigente.fase})
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. VISTA PREVIA EN TIEMPO REAL DEL CINTILLO CIUDADANO (PWA)         */}
      {/* =================================================================== */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.45rem',
            fontSize: '0.74rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#94A3B8'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontWeight: 700 }}>
            <Radio size={13} color="#38BDF8" />
            VISTA PREVIA EN TIEMPO REAL — CINTILLO CIUDADANO (PWA):
          </span>
          <span>Altura fija: 36px • Renderizado en móviles y portal web</span>
        </div>

        {/* Cintillo de 36px en Vidrio Oscuro */}
        <div
          role="alert"
          style={{
            height: '36px',
            backgroundColor: 'rgba(0, 4, 13, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${configNivelSeleccionado.borderBadge}`,
            borderRadius: '8px',
            padding: '0 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: `0 0 16px ${configNivelSeleccionado.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
            transition: 'all 0.3s ease',
            overflow: 'hidden'
          }}
        >
          {/* Lado Izquierdo: Pastilla de Nivel + Pulso */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.7rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 900,
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: configNivelSeleccionado.color,
                color: configNivelSeleccionado.nivel === 'AMARILLA' ? '#000000' : '#FFFFFF',
                boxShadow: `0 0 8px ${configNivelSeleccionado.color}`,
                flexShrink: 0
              }}
            >
              ALERTA {configNivelSeleccionado.nivel}
            </span>

            {/* Texto en JetBrains Mono */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: '0.76rem',
                color: '#F8FAFC',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {provinciaTheme.nombre.toUpperCase()}: {boletinTexto.slice(0, 95)}...
            </span>
          </div>

          {/* Lado Derecho: Sello CNE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.68rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#94A3B8',
              flexShrink: 0,
              marginLeft: '0.75rem'
            }}
          >
            <span>MONITOREO ACTIVO CNE COSTA RICA</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: configNivelSeleccionado.color,
                boxShadow: `0 0 6px ${configNivelSeleccionado.color}`
              }}
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. PANEL DE EMISIÓN DE ALERTA PROVINCIAL (MANDO CRÍTICO)           */}
      {/* =================================================================== */}
      <section
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.35rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Flame size={18} color={configNivelSeleccionado.color} />
          <h4
            style={{
              fontFamily: "'Mistical Spring', Georgia, serif",
              fontSize: '1.12rem',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0
            }}
          >
            Selector de Alerta Provincial y Redacción del Boletín
          </h4>
        </div>

        {/* 4 Botones de Niveles Oficiales CNE */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.25rem'
          }}
        >
          {NIVELES_ALERTA_CNE.map((lvl) => {
            const isSelected = nivelSeleccionado === lvl.nivel;

            return (
              <button
                key={lvl.nivel}
                onClick={() => setNivelSeleccionado(lvl.nivel)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: isSelected
                    ? `2px solid ${lvl.color}`
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isSelected ? lvl.bgBadge : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isSelected ? `0 0 16px ${lvl.glow}` : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: lvl.color
                    }}
                  >
                    {lvl.nombre}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: lvl.color,
                        boxShadow: `0 0 8px ${lvl.color}`
                      }}
                    />
                  )}
                </div>
                <div style={{ fontSize: '0.74rem', color: isSelected ? '#F8FAFC' : '#CBD5E1', fontWeight: 600 }}>
                  Fase: {lvl.fase}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '0.2rem', lineHeight: 1.3 }}>
                  {lvl.descripcion}
                </div>
              </button>
            );
          })}
        </div>

        {/* Campo de Texto para el Boletín Técnico */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="boletin-input"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#CBD5E1',
              marginBottom: '0.45rem',
              textTransform: 'uppercase',
              fontFamily: "'Paloseco', sans-serif"
            }}
          >
            Boletín Técnico Oficial de Emergencias (CNE / Despacho Provincial):
          </label>
          <textarea
            id="boletin-input"
            rows={3}
            value={boletinTexto}
            onChange={(e) => setBoletinTexto(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#00040D',
              border: `1px solid ${configNivelSeleccionado.borderBadge}`,
              color: '#FFFFFF',
              fontSize: '0.84rem',
              fontFamily: "'Paloseco', 'Plus Jakarta Sans', sans-serif",
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>

        {/* Doble Confirmación de Seguridad y Botón de Emisión */}
        <div>
          {!solicitandoConfirmacion ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} color="#64748B" />
                <span>Protocolo de Emisión Crítica: Requiere doble autorización para impactar a la población civil.</span>
              </div>

              <button
                onClick={iniciarEmisionAlerta}
                style={{
                  padding: '0.75rem 1.4rem',
                  borderRadius: '10px',
                  backgroundColor: configNivelSeleccionado.color,
                  color: configNivelSeleccionado.nivel === 'AMARILLA' ? '#000000' : '#FFFFFF',
                  border: `1px solid ${configNivelSeleccionado.color}`,
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: `0 0 16px ${configNivelSeleccionado.glow}`,
                  fontFamily: "'Paloseco', sans-serif"
                }}
              >
                <Send size={15} />
                <span>Emitir Alerta {configNivelSeleccionado.nivel} ({provinciaTheme.nombre})</span>
              </button>
            </div>
          ) : (
            /* Panel de Confirmación de Seguridad Armada */
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={24} color="#EF4444" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FCA5A5' }}>
                    ¿CONFIRMAR EMISIÓN PÚBLICA INMEDIATA DE ALERTA {configNivelSeleccionado.nivel}?
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                    Esta acción despachará notificaciones push en tiempo real a los habitantes de los cantones de {provinciaTheme.nombre}.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={confirmarEmisionAlerta}
                  style={{
                    padding: '0.5rem 1.15rem',
                    borderRadius: '8px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)'
                  }}
                >
                  Sí, Transmitir Alerta Oficial
                </button>
                <button
                  onClick={cancelarEmision}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Mensaje de Éxito de Transmisión */}
          {alertaTransmitidaExito && (
            <div
              style={{
                marginTop: '1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                color: '#34D399',
                fontSize: '0.82rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={16} />
              <span>ALERTA {alertaVigente} TRANSMITIDA Y CERTIFICADA POR LA DIRECCIÓN REGIONAL (CNE / CR-SEC).</span>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. MONITOR DE ALBERGUES TEMPORALES DE LA PROVINCIA                 */}
      {/* =================================================================== */}
      <section>
        {/* Cabecera y Métricas de Capacidad de Albergues */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem'
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
              <Home size={20} color={provinciaTheme.primary} />
              Red de Albergues Temporales Registrados ({provinciaTheme.nombre})
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Monitoreo y ajuste en tiempo real de capacidad, ocupación y suministros de emergencia.
            </p>
          </div>

          {/* Tarjetas de Resumen Global de Albergues */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                ALBERGUES ACTIVOS
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8', fontFamily: "'JetBrains Mono', monospace" }}>
                {metricasAlbergues.alberguesActivos} de {albergues.length}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                OCUPACIÓN GLOBAL
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FBBF24', fontFamily: "'JetBrains Mono', monospace" }}>
                {metricasAlbergues.totalOcupacion} / {metricasAlbergues.totalCapacidad}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                DISPONIBILIDAD
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34D399', fontFamily: "'JetBrains Mono', monospace" }}>
                {100 - metricasAlbergues.porcentajeGlobal}% Libre
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Albergues */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {albergues.map((alb) => {
            const porcentaje = Math.round((alb.ocupacionActual / alb.capacidadTotal) * 100);

            // Badge de Estado
            const badgeEstado =
              alb.estado === 'Lleno'
                ? { bg: 'rgba(239, 68, 68, 0.18)', text: '#FCA5A5', border: 'rgba(239, 68, 68, 0.4)' }
                : alb.estado === 'Activo'
                ? { bg: 'rgba(16, 185, 129, 0.18)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.4)' }
                : { bg: 'rgba(255, 255, 255, 0.06)', text: '#CBD5E1', border: 'rgba(255, 255, 255, 0.15)' };

            return (
              <div
                key={alb.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                  position: 'relative'
                }}
              >
                {/* Cabecera de la Tarjeta */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building size={15} color="#38BDF8" />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.72rem',
                        color: '#38BDF8',
                        fontWeight: 700
                      }}
                    >
                      {alb.id} • Cantón {alb.canton}
                    </span>
                  </div>

                  {/* Estado (Activo, En Reserva, Lleno) */}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: badgeEstado.bg,
                      color: badgeEstado.text,
                      border: `1px solid ${badgeEstado.border}`
                    }}
                  >
                    {alb.estado}
                  </span>
                </div>

                {/* Nombre y Ubicación */}
                <div>
                  <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {alb.nombre}
                  </h5>
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                    Distrito: {alb.distrito} • {alb.direccion}
                  </div>
                </div>

                {/* Barra de Progreso Porcentual */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#CBD5E1',
                      marginBottom: '0.35rem'
                    }}
                  >
                    <span>
                      Ocupación: <strong style={{ color: '#F8FAFC' }}>{alb.ocupacionActual}</strong> de {alb.capacidadTotal} hab.
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        color: porcentaje >= 100 ? '#EF4444' : porcentaje >= 75 ? '#F59E0B' : '#34D399'
                      }}
                    >
                      {porcentaje}%
                    </span>
                  </div>

                  <div
                    style={{
                      height: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${porcentaje}%`,
                        backgroundColor:
                          porcentaje >= 100
                            ? '#EF4444'
                            : porcentaje >= 75
                            ? '#F59E0B'
                            : '#10B981',
                        borderRadius: '4px',
                        transition: 'width 0.25s ease'
                      }}
                    />
                  </div>
                </div>

                {/* CONTROLES PARA AJUSTAR NÚMERO DE PERSONAS EN TIEMPO REAL */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
                    Ajustar Ocupación:
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => ajustarPersonasAlbergadas(alb.id, -5)}
                      title="Disminuir 5 personas"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#CBD5E1',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700
                      }}
                    >
                      -5
                    </button>

                    <button
                      onClick={() => ajustarPersonasAlbergadas(alb.id, -1)}
                      title="Disminuir 1 persona"
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#CBD5E1',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={13} />
                    </button>

                    {/* Input Numérico Reactivo */}
                    <input
                      type="number"
                      min={0}
                      max={alb.capacidadTotal}
                      value={alb.ocupacionActual}
                      onChange={(e) => setOcupacionDirecta(alb.id, e.target.value)}
                      style={{
                        width: '56px',
                        textAlign: 'center',
                        padding: '0.2rem',
                        borderRadius: '4px',
                        backgroundColor: '#00040D',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />

                    <button
                      onClick={() => ajustarPersonasAlbergadas(alb.id, 1)}
                      title="Incrementar 1 persona"
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#CBD5E1',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={13} />
                    </button>

                    <button
                      onClick={() => ajustarPersonasAlbergadas(alb.id, 5)}
                      title="Incrementar 5 personas"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#CBD5E1',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700
                      }}
                    >
                      +5
                    </button>
                  </div>
                </div>

                {/* Insumos y Responsable */}
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem' }}>
                  <div>
                    <strong style={{ color: '#E2E8F0' }}>Coordinador CNE:</strong> {alb.coordinador} ({alb.telefonoContacto})
                  </div>
                  <div style={{ marginTop: '0.2rem' }}>
                    <strong style={{ color: '#E2E8F0' }}>Suministros:</strong> {alb.suministros}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
