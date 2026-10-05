import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Users,
  Building2,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Activity,
  Droplets,
  Package,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PROVINCIAL_THEMES } from '../../config/provincialThemes';

// 4 Niveles Oficiales de Alerta de la Comisión Nacional de Emergencias (CNE) — Ley N° 8488
export const NIVELES_ALERTA_CNE = {
  verde: {
    id: 'verde',
    nivel: 'VERDE',
    nombre: 'Alerta Verde',
    fase: 'Informativa / Prevención',
    descripcion: 'Vigilancia continua sobre fenómenos meteorológicos o sísmicos sin impacto destructivo inminente.',
    color: '#10B981',
    bgBadge: 'rgba(16, 185, 129, 0.12)',
    borderBadge: 'rgba(16, 185, 129, 0.3)',
    protocolo: 'Monitoreo preventivo del Instituto Meteorológico Nacional (IMN) y Comités Municipales de Emergencia (CME).'
  },
  amarilla: {
    id: 'amarilla',
    nivel: 'AMARILLA',
    nombre: 'Alerta Amarilla',
    fase: 'Preparación y Vigilancia Reforzada',
    descripcion: 'Alistamiento de Comités Municipales de Emergencia (CME) y preparación de albergues ante incremento de lluvias.',
    color: '#F59E0B',
    bgBadge: 'rgba(245, 158, 11, 0.12)',
    borderBadge: 'rgba(245, 158, 11, 0.3)',
    protocolo: 'Alistamiento de Comités Municipales de Emergencia, verificación de albergues y monitoreo de cuencas críticas.'
  },
  naranja: {
    id: 'naranja',
    nivel: 'NARANJA',
    nombre: 'Alerta Naranja',
    fase: 'Movilización / Peligro Inminente',
    descripcion: 'Activación de recursos operativos, movilización de suministros y apertura de albergues temporales.',
    color: '#F36717',
    bgBadge: 'rgba(243, 103, 23, 0.12)',
    borderBadge: 'rgba(243, 103, 23, 0.3)',
    protocolo: 'Despliegue táctico de Fuerza Pública, Bomberos y Cruz Roja. Movilización preventiva de población en zonas de riesgo.'
  },
  roja: {
    id: 'roja',
    nivel: 'ROJA',
    nombre: 'Alerta Roja',
    fase: 'Evacuación / Máxima Prioridad',
    descripcion: 'Peligro extremo para la vida humana. Evacuación obligatoria inmediata a refugios CNE habilitados.',
    color: '#EF4444',
    bgBadge: 'rgba(239, 68, 68, 0.12)',
    borderBadge: 'rgba(239, 68, 68, 0.3)',
    protocolo: 'Evacuación obligatoria a refugios CNE habilitados. Máxima prioridad para el 9-1-1 y equipos de rescate.'
  }
};

// Coordenadas geográficas representativas de cantones para telemetría técnica
const COORDENADAS_CANTONES = {
  'Puntarenas': { lat: 9.9763, lng: -84.8384 },
  'Esparza': { lat: 9.9942, lng: -84.6647 },
  'Buenos Aires': { lat: 9.1714, lng: -83.3339 },
  'Montes de Oro': { lat: 10.0894, lng: -84.7214 },
  'Osa': { lat: 8.9614, lng: -83.5244 },
  'Quepos': { lat: 9.4316, lng: -84.1619 },
  'Golfito': { lat: 8.6361, lng: -83.1672 },
  'Coto Brus': { lat: 8.8953, lng: -82.9753 },
  'Parrita': { lat: 9.5194, lng: -84.3283 },
  'Corredores': { lat: 8.6436, lng: -82.9469 },
  'Garabito': { lat: 9.6158, lng: -84.6297 },
  'Monteverde': { lat: 10.3014, lng: -84.8256 },
  'Puerto Jiménez': { lat: 8.5358, lng: -83.3039 },
  'San José': { lat: 9.9333, lng: -84.0833 },
  'Alajuela': { lat: 10.0163, lng: -84.2116 },
  'Cartago': { lat: 9.8644, lng: -83.9194 },
  'Heredia': { lat: 9.9989, lng: -84.1169 },
  'Liberia': { lat: 10.6346, lng: -85.4407 },
  'Limón': { lat: 9.9912, lng: -83.0336 }
};

// Padrón Oficial de Albergues Temporales CNE
const ALBERGUES_BASE = [
  {
    id: 'ALB-PUN-01',
    nombre: 'Gimnasio Municipal El Roble',
    provincia: 'Puntarenas',
    canton: 'Puntarenas',
    distrito: 'El Roble',
    direccion: 'Costado norte de la Plaza de Deportes El Roble',
    capacidadTotal: 350,
    ocupacionActual: 180,
    estado: 'Habilitado',
    coordinador: 'Dra. Andrea Leitón (CNE Regional)',
    suministros: 'Raciones CCSS 100%, 300 camas de campaña, agua purificada en cisterna, generador eléctrico.',
    telefonoContacto: '2663-1190'
  },
  {
    id: 'ALB-PUN-02',
    nombre: 'Polideportivo de Puntarenas (CNE)',
    provincia: 'Puntarenas',
    canton: 'Puntarenas',
    distrito: 'Chacarita',
    direccion: 'Costado este del Complejo Deportivo Chacarita',
    capacidadTotal: 180,
    ocupacionActual: 45,
    estado: 'Habilitado',
    coordinador: 'Comité Municipal de Emergencias Puntarenas',
    suministros: '10 duchas, 12 servicios sanitarios, cocina comunal, dotación médica Cruz Roja.',
    telefonoContacto: '2661-0000'
  },
  {
    id: 'ALB-ESP-03',
    nombre: 'Escuela Central de Esparza',
    provincia: 'Puntarenas',
    canton: 'Esparza',
    distrito: 'Espíritu Santo',
    direccion: 'Frente al Parque Ignacio Pérez',
    capacidadTotal: 160,
    ocupacionActual: 30,
    estado: 'Habilitado',
    coordinador: 'MSc. Roberto Chacón (MEP / Enlace)',
    suministros: 'Comedor escolar habilitado, cocina de gas, 120 colchonetas, botiquines básicos.',
    telefonoContacto: '2636-9022'
  },
  {
    id: 'ALB-OSA-04',
    nombre: 'Salón Comunal Ciudad Cortés',
    provincia: 'Puntarenas',
    canton: 'Osa',
    distrito: 'Ciudad Cortés',
    direccion: 'Avenida Central, 100m oeste de la Cruz Roja',
    capacidadTotal: 220,
    ocupacionActual: 195,
    estado: 'Ocupación Alta',
    coordinador: 'Oficial Gerardo Picado (Cruz Roja Osa)',
    suministros: 'Kits de aseo para 200 personas, tanques cisterna AyA, raciones alimentarias calientes.',
    telefonoContacto: '2786-8844'
  },
  {
    id: 'ALB-QUE-05',
    nombre: 'Gimnasio Municipal de Quepos',
    provincia: 'Puntarenas',
    canton: 'Quepos',
    distrito: 'Quepos Central',
    direccion: 'Barrio La Inmaculada, 200m sur del Mercado',
    capacidadTotal: 280,
    ocupacionActual: 0,
    estado: 'En Reserva',
    coordinador: 'Ing. Tatiana Solano (CME Quepos)',
    suministros: 'Instalaciones sanitarias listas, stock de insumos en bodega, planta de respaldo.',
    telefonoContacto: '2777-1044'
  },
  {
    id: 'ALB-GOL-06',
    nombre: 'Liceo Rural Río Claro',
    provincia: 'Puntarenas',
    canton: 'Golfito',
    distrito: 'Guaycará',
    direccion: 'Río Claro, contiguo a la Estación de Bomberos',
    capacidadTotal: 180,
    ocupacionActual: 65,
    estado: 'Habilitado',
    coordinador: 'Lic. Marco Vinicio Prado (Municipalidad)',
    suministros: 'Colchonetas térmicas, botiquines CCSS, alimentos no perecederos, radioenlace VHF.',
    telefonoContacto: '2775-0912'
  },
  {
    id: 'ALB-GAR-07',
    nombre: 'Salón Multiuso Jacó Centro',
    provincia: 'Puntarenas',
    canton: 'Garabito',
    distrito: 'Jacó',
    direccion: 'Costado norte de la Municipalidad de Garabito',
    capacidadTotal: 150,
    ocupacionActual: 20,
    estado: 'Habilitado',
    coordinador: 'CME Garabito / Bomberos Jacó',
    suministros: 'Raciones frías de emergencia, agua purificada en bidones, camillas de resguardo.',
    telefonoContacto: '2643-3000'
  }
];

// Red de Auxilio y Despacho Rápido 24/7
const CANALES_AUXILIO = [
  { id: '911', nombre: '9-1-1 Emergencias', numero: '911', detalle: 'Despacho Unificado Nacional', prioridad: true },
  { id: 'bomberos', nombre: 'Cuerpo de Bomberos', numero: '118', detalle: 'Rescate e Incendios', prioridad: false },
  { id: 'cruzroja', nombre: 'Cruz Roja Costarricense', numero: '1128', detalle: 'Atención Prehospitalaria', prioridad: false },
  { id: 'fuerzapublica', nombre: 'Fuerza Pública', numero: '2661-0222', detalle: 'Seguridad y Evacuación', prioridad: false },
  { id: 'cne', nombre: 'CNE Central Operativa', numero: '2299-4700', detalle: 'Comando Nacional de Operaciones', prioridad: false }
];

export default function EmergenciasCNEModule({
  provincia = 'Puntarenas',
  provinciaTheme = null,
  canton = null
}) {
  // Resolver tema si no se pasó explícitamente
  const resolvedTheme = provinciaTheme || Object.values(PROVINCIAL_THEMES).find(
    (t) => t.nombre.toLowerCase() === String(provincia).toLowerCase()
  ) || PROVINCIAL_THEMES['6'];

  const provinciaNombre = resolvedTheme?.nombre || String(provincia || 'Puntarenas');

  // Cantón activo: puede venir como objeto { nombre } o string, fallback Puntarenas
  const cantonInicial = (typeof canton === 'object' && canton?.nombre)
    ? canton.nombre
    : (typeof canton === 'string' && canton.trim())
    ? canton.trim()
    : 'Puntarenas';

  const [filtroCanton, setFiltroCanton] = useState(cantonInicial);
  const [alertaActiva, setAlertaActiva] = useState('amarilla');
  const [albergues, setAlbergues] = useState(ALBERGUES_BASE);
  const [horaCST, setHoraCST] = useState('12:00:00');

  // Reloj institucional CST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHoraCST(
        now.toLocaleTimeString('es-CR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Coordenadas del cantón activo
  const coords = COORDENADAS_CANTONES[filtroCanton] || COORDENADAS_CANTONES[cantonInicial] || { lat: 9.9763, lng: -84.8384 };
  const alertaCfg = NIVELES_ALERTA_CNE[alertaActiva] || NIVELES_ALERTA_CNE.amarilla;

  // Filtrado de albergues
  const alberguesFiltrados = useMemo(() => {
    if (!filtroCanton || filtroCanton === 'TODOS') return albergues;
    return albergues.filter((a) => a.canton.toLowerCase() === filtroCanton.toLowerCase());
  }, [albergues, filtroCanton]);

  // Métricas agregadas
  const metricas = useMemo(() => {
    const totalCapacidad = alberguesFiltrados.reduce((acc, a) => acc + (a.capacidadTotal || 0), 0);
    const totalOcupacion = alberguesFiltrados.reduce((acc, a) => acc + (a.ocupacionActual || 0), 0);
    const porcentaje = totalCapacidad > 0 ? Math.round((totalOcupacion / totalCapacidad) * 100) : 0;
    const activos = alberguesFiltrados.filter((a) => a.estado === 'Habilitado' || a.estado === 'Ocupación Alta').length;
    return { totalCapacidad, totalOcupacion, porcentaje, activos };
  }, [alberguesFiltrados]);

  // Modificar ocupación de un albergue (+ / -)
  const modificarOcupacion = (id, delta) => {
    setAlbergues((prev) =>
      prev.map((alb) => {
        if (alb.id !== id) return alb;
        const nuevaOcupacion = Math.max(0, Math.min(alb.capacidadTotal, (alb.ocupacionActual || 0) + delta));
        let nuevoEstado = alb.estado;
        if (nuevaOcupacion >= alb.capacidadTotal) {
          nuevoEstado = 'Lleno';
        } else if (nuevaOcupacion >= alb.capacidadTotal * 0.8) {
          nuevoEstado = 'Ocupación Alta';
        } else if (nuevaOcupacion === 0) {
          nuevoEstado = 'En Reserva';
        } else {
          nuevoEstado = 'Habilitado';
        }
        return {
          ...alb,
          ocupacionActual: nuevaOcupacion,
          estado: nuevoEstado
        };
      })
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {/* =================================================================== */}
      {/* 1. CABECERA INSTITUCIONAL SOBRIA                                    */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(0, 43, 127, 0.4)',
                border: '1px solid rgba(121, 166, 255, 0.3)',
                color: '#79A6FF',
                fontSize: '0.72rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Radio size={12} />
              <span>CENTRO DE OPERACIONES DE EMERGENCIA (COE) &bull; LEY N° 8488</span>
            </span>
          </div>

          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              margin: '0 0 0.35rem 0'
            }}
          >
            Centro de Operaciones de Emergencia Cantonal y Red de Auxilio
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0, maxWidth: '780px' }}>
            Coordinación operativa con los Comités Municipales de Emergencia (CME) y administración oficial del padrón cantonal de albergues temporales bajo la directriz de la Comisión Nacional de Prevención de Riesgos y Atención de Emergencias.
          </p>
        </div>

        {/* Selector de Cantón Activo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>
            Cantón:
          </span>
          <select
            value={filtroCanton}
            onChange={(e) => setFiltroCanton(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: 'rgba(0, 10, 30, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontFamily: "'JetBrains Mono', monospace",
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TODOS">Todos los Cantones ({provinciaNombre})</option>
            <option value="Puntarenas">Puntarenas (Central)</option>
            <option value="Esparza">Esparza</option>
            <option value="Osa">Osa (Ciudad Cortés)</option>
            <option value="Quepos">Quepos</option>
            <option value="Golfito">Golfito</option>
            <option value="Garabito">Garabito (Jacó)</option>
            <option value="Montes de Oro">Montes de Oro</option>
          </select>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. TARJETA INSTITUCIONAL LIMPIA DE ALERTA CNE (SOBERANA Y SIN RESPLANDOR) */}
      {/* =================================================================== */}
      <div
        style={{
          backgroundColor: 'rgba(5, 12, 28, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Telemetría Oficial en JetBrains Mono */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.76rem',
            color: '#94A3B8',
            paddingBottom: '0.9rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#79A6FF', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={12} /> COORDENADAS: {coords.lat.toFixed(4)}° N &bull; {coords.lng.toFixed(4)}° W
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ color: '#E2E8F0' }}>
              JURISDICCIÓN: {filtroCanton.toUpperCase()} &bull; {provinciaNombre.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ color: '#00D166', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Activity size={12} /> SISTEMAS: 99.98% OPERATIVOS
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ color: '#CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={12} /> CST: {horaCST}
            </span>
          </div>
        </div>

        {/* Nivel de Alerta Activo con Pastilla Discreta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', maxWidth: '820px' }}>
            {/* Pastilla Discreta de Nivel de Alerta */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: alertaCfg.bgBadge,
                border: `1px solid ${alertaCfg.borderBadge}`,
                color: alertaCfg.color,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                flexShrink: 0
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: alertaCfg.color,
                  display: 'inline-block'
                }}
              />
              <span>{alertaCfg.nombre.toUpperCase()}</span>
            </div>

            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                {alertaCfg.fase} &bull; Protocolo Territorial COE
              </div>
              <p style={{ fontSize: '0.84rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                {alertaCfg.protocolo}
              </p>
            </div>
          </div>

          {/* Conmutador Sobrio de Nivel para el Centro de Mando */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'JetBrains Mono', monospace", marginRight: '0.25rem' }}>
              Nivel:
            </span>
            {Object.values(NIVELES_ALERTA_CNE).map((lvl) => {
              const isSelected = alertaActiva === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setAlertaActiva(lvl.id)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: isSelected ? 800 : 600,
                    border: isSelected ? `1px solid ${lvl.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: isSelected ? lvl.bgBadge : 'rgba(0, 0, 0, 0.25)',
                    color: isSelected ? lvl.color : '#94A3B8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {lvl.id.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. RESUMEN DE CAPACIDAD Y MÉTRICAS DE ALBERGUES                     */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.3rem' }}>
            ALBERGUES MONITOREADOS
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
            {alberguesFiltrados.length} <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>({metricas.activos} activos)</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.3rem' }}>
            CAPACIDAD TOTAL INSTALADA
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
            {metricas.totalCapacidad} <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>plazas</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.3rem' }}>
            OCUPACIÓN EFECTIVA ACTUAL
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
            {metricas.totalOcupacion} <span style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 600 }}>personas</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(5, 12, 28, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.3rem' }}>
            TASA GLOBAL DE OCUPACIÓN
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: metricas.porcentaje > 80 ? '#EF4444' : metricas.porcentaje > 50 ? '#F59E0B' : '#10B981' }}>
            {metricas.porcentaje}%
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. RED DE AUXILIO Y PADRÓN LIMPIO DE ALBERGUES                     */}
      {/* =================================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Red de Albergues Humanitarios Temporales ({alberguesFiltrados.length})
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Centros autorizados con suministros básicos, camas de campaña y enlace directo con el Comité Municipal de Emergencias.
            </p>
          </div>
        </div>

        {alberguesFiltrados.length === 0 ? (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'rgba(5, 12, 28, 0.5)',
              borderRadius: '14px',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              color: '#94A3B8'
            }}
          >
            No se registran albergues activos bajo el filtro territorial seleccionado.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {alberguesFiltrados.map((alb) => {
              const porcentajeOcupacion = alb.capacidadTotal > 0 ? Math.round((alb.ocupacionActual / alb.capacidadTotal) * 100) : 0;
              const colorBarra = porcentajeOcupacion >= 90 ? '#EF4444' : porcentajeOcupacion >= 60 ? '#F59E0B' : '#10B981';

              return (
                <div
                  key={alb.id}
                  style={{
                    backgroundColor: 'rgba(5, 12, 28, 0.6)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <div>
                    {/* Encabezado del Albergue */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.6rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#79A6FF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                          {alb.id} &bull; {alb.canton}, {alb.distrito}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0.2rem 0 0 0' }}>
                          {alb.nombre}
                        </h4>
                      </div>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: alb.estado === 'Lleno' ? 'rgba(239, 68, 68, 0.15)' : alb.estado === 'Ocupación Alta' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: alb.estado === 'Lleno' ? '#EF4444' : alb.estado === 'Ocupación Alta' ? '#F59E0B' : '#10B981',
                          border: `1px solid ${alb.estado === 'Lleno' ? 'rgba(239, 68, 68, 0.3)' : alb.estado === 'Ocupación Alta' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {alb.estado.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                      {alb.direccion}
                    </p>

                    {/* Barra de Ocupación */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.35rem' }}>
                        <span style={{ color: '#CBD5E1' }}>
                          Ocupación: <strong style={{ color: '#FFFFFF' }}>{alb.ocupacionActual}</strong> de {alb.capacidadTotal} personas
                        </span>
                        <span style={{ color: colorBarra, fontWeight: 700 }}>
                          {porcentajeOcupacion}%
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(100, porcentajeOcupacion)}%`,
                            height: '100%',
                            backgroundColor: colorBarra,
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                    </div>

                    {/* Insumos de Emergencia */}
                    <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#79A6FF', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Package size={12} /> INSUMOS Y DOTACIÓN DISPONIBLE:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#E2E8F0', lineHeight: 1.4 }}>
                        {alb.suministros}
                      </div>
                    </div>
                  </div>

                  {/* Pie de Ficha: Enlace CME y Controles de Operación */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                      <span>Enlace: {alb.coordinador}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => modificarOcupacion(alb.id, -5)}
                        title="Reducir 5 personas"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        <Minus size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => modificarOcupacion(alb.id, 5)}
                        title="Aumentar 5 personas"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        <Plus size={12} />
                      </button>

                      <a
                        href={`tel:${alb.telefonoContacto}`}
                        style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(0, 43, 127, 0.4)',
                          border: '1px solid rgba(121, 166, 255, 0.3)',
                          color: '#79A6FF',
                          fontSize: '0.74rem',
                          fontFamily: "'JetBrains Mono', monospace",
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <PhoneCall size={11} />
                        <span>Llamar</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 5. RED DE AUXILIO Y DESPACHO RÁPIDO 24/7 (BOTONERA LIMPIA)          */}
      {/* =================================================================== */}
      <div
        style={{
          backgroundColor: 'rgba(5, 12, 28, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <PhoneCall size={16} color="#79A6FF" /> Canales de Auxilio Inmediato y Despacho Operativo
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Líneas prioritarias de enlace directo con los cuerpos de rescate y seguridad nacional.
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {CANALES_AUXILIO.map((c) => (
            <a
              key={c.id}
              href={`tel:${c.numero}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: c.prioridad ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 15, 45, 0.5)',
                border: c.prioridad ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {c.nombre}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {c.detalle}
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.95rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 900,
                  color: c.prioridad ? '#EF4444' : '#79A6FF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>{c.numero}</span>
                <ArrowUpRight size={13} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
