/**
 * ============================================================================
 * COSTA RICA UNIDOS — BITÁCORA CRIPTOGRÁFICA DE AUDITORÍA (AUDIT LOG)
 * Módulo de Transparencia, Trazabilidad e Integridad de Estado
 * Cumplimiento Ley N° 8968 (Protección de la Persona frente al Tratamiento de sus Datos)
 * Design System: Sovereign Civic Glass v2.1
 * ============================================================================
 */
import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Layers,
  Clock,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Catálogo de Categorías Normadas de Auditoría
export const CATEGORIAS_AUDITORIA = [
  { id: 'TODAS', label: 'Todas las Categorías' },
  { id: 'TRIAJE_M07', label: 'Triaje Vial (M07)' },
  { id: 'ALERTA_CNE', label: 'Comando CNE (M10)' },
  { id: 'ALBERGUES_CNE', label: 'Albergues Temporales' },
  { id: 'SEGURIDAD_RBAC', label: 'Seguridad y RBAC' },
  { id: 'TELEMETRIA', label: 'Telemetría de Red' }
];

// Registros cronológicos inmutables de la sesión administrativa provincial
const LOGS_INICIALES = [
  {
    id: 'LOG-CRU-2026-9901',
    timestampIso: '2026-10-01T13:35:12.482-06:00',
    adminId: 'USR-PROV-006',
    adminRol: 'ADMIN_PROVINCIAL',
    adminNombre: 'Dirección Regional de Puntarenas',
    accion: "Cambio de estado ticket CRU-8921 de 'Recibido' a 'En Revisión'",
    categoria: 'TRIAJE_M07',
    ticketId: 'CRU-8921',
    ipSimulada: '192.168.6.14 (Red Provincial Puntarenas)',
    hashIntegridad: 'SHA256:7f8a33c1d94b2e88a0f12bc44e5910a34b219e88',
    firmadoDigital: true
  },
  {
    id: 'LOG-CRU-2026-9902',
    timestampIso: '2026-10-01T13:22:04.119-06:00',
    adminId: 'USR-PROV-006',
    adminRol: 'ADMIN_PROVINCIAL',
    adminNombre: 'Dirección Regional de Puntarenas',
    accion: "Derivación oficial de ticket CRU-8923 a 'MOPT / CONAVI' con solicitud de retroexcavadora",
    categoria: 'TRIAJE_M07',
    ticketId: 'CRU-8923',
    ipSimulada: '192.168.6.14 (Red Provincial Puntarenas)',
    hashIntegridad: 'SHA256:c41ba992f814de0177bc9321e04812fbc94101e2',
    firmadoDigital: true
  },
  {
    id: 'LOG-CRU-2026-9903',
    timestampIso: '2026-10-01T13:05:48.892-06:00',
    adminId: 'USR-PROV-006',
    adminRol: 'ADMIN_PROVINCIAL',
    adminNombre: 'Dirección Regional de Puntarenas',
    accion: "Emisión de Alerta Amarilla provincial ratificada para los 13 cantones de Puntarenas por Onda Tropical 42",
    categoria: 'ALERTA_CNE',
    ticketId: null,
    ipSimulada: '10.200.4.5 (Puesto de Mando CNE Regional)',
    hashIntegridad: 'SHA256:12eaee81a03498bd7712cf51a4b90123e410f881',
    firmadoDigital: true
  },
  {
    id: 'LOG-CRU-2026-9904',
    timestampIso: '2026-10-01T12:45:00.034-06:00',
    adminId: 'USR-PROV-006',
    adminRol: 'ADMIN_PROVINCIAL',
    adminNombre: 'Dirección Regional de Puntarenas',
    accion: "Ajuste de ocupación albergue temporal ALB-OSA-02 a 215 personas (Nivel de ocupación crítica)",
    categoria: 'ALBERGUES_CNE',
    ticketId: null,
    ipSimulada: '192.168.6.22 (Enlace Municipal Osa)',
    hashIntegridad: 'SHA256:90bd71fabc1029384756e12903847561a0293847',
    firmadoDigital: true
  },
  {
    id: 'LOG-CRU-2026-9905',
    timestampIso: '2026-10-01T12:10:33.771-06:00',
    adminId: 'USR-PROV-006',
    adminRol: 'ADMIN_PROVINCIAL',
    adminNombre: 'Dirección Regional de Puntarenas',
    accion: "Validación criptográfica de sesión JWT de Estado contra Padrón Nacional del TSE y Hacienda",
    categoria: 'SEGURIDAD_RBAC',
    ticketId: null,
    ipSimulada: '192.168.6.14 (Gateway Provincial)',
    hashIntegridad: 'SHA256:8b71003d19283746501928374650192837465019',
    firmadoDigital: true
  },
  {
    id: 'LOG-CRU-2026-9906',
    timestampIso: '2026-10-01T11:42:19.208-06:00',
    adminId: 'USR-PROV-006',
    adminRol: 'ADMIN_PROVINCIAL',
    adminNombre: 'Dirección Regional de Puntarenas',
    accion: "Sincronización de telemetría de 14 estaciones pluviométricas del Instituto Meteorológico Nacional (IMN)",
    categoria: 'TELEMETRIA',
    ticketId: null,
    ipSimulada: '10.50.8.1 (Red Satelital IMN-MINAE)',
    hashIntegridad: 'SHA256:a120938475610293847561029384756102938475',
    firmadoDigital: true
  },
  {
    id: 'LOG-CRU-2026-9907',
    timestampIso: '2026-09-30T19:25:40.510-06:00',
    adminId: 'USR-PROV-006',
    adminRol: 'ADMIN_PROVINCIAL',
    adminNombre: 'Dirección Regional de Puntarenas',
    accion: "Cierre exitoso de ticket CRU-8926 (Poste ICE en Buenos Aires) tras validación técnica en campo",
    categoria: 'TRIAJE_M07',
    ticketId: 'CRU-8926',
    ipSimulada: '192.168.6.14 (Red Provincial Puntarenas)',
    hashIntegridad: 'SHA256:33c1d94b2e88a0f12bc44e5910a34b219e887f8a',
    firmadoDigital: true
  }
];

export default function AuditLogView({
  provinciaTheme = {
    primary: '#F36717',
    glow: 'rgba(243, 103, 23, 0.4)',
    nombre: 'Puntarenas'
  }
}) {
  const { user } = useAuth();

  // Estados de filtrado
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  const [periodoFiltro, setPeriodoFiltro] = useState('HOY'); // 'HOY', '24H', '7D', 'TODOS'
  const [busqueda, setBusqueda] = useState('');

  // Verificación de integridad
  const [verificandoHash, setVerificandoHash] = useState(false);
  const [integridadVerificada, setIntegridadVerificada] = useState(false);
  const [hashCopiado, setHashCopiado] = useState(null);

  // Copiar hash al portapapeles
  const copiarHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setHashCopiado(hash);
    setTimeout(() => setHashCopiado(null), 1800);
  };

  // Simular verificación criptográfica de la cadena
  const ejecutarVerificacionIntegridad = () => {
    setVerificandoHash(true);
    setIntegridadVerificada(false);

    setTimeout(() => {
      setVerificandoHash(false);
      setIntegridadVerificada(true);
      setTimeout(() => setIntegridadVerificada(false), 5000);
    }, 1200);
  };

  // Filtrado de logs
  const logsFiltrados = useMemo(() => {
    return LOGS_INICIALES.filter((log) => {
      // Filtro por categoría
      const matchCat = categoriaFiltro === 'TODAS' || log.categoria === categoriaFiltro;

      // Filtro por período
      let matchPeriodo = true;
      const logFecha = new Date(log.timestampIso);
      const hoy = new Date('2026-10-01T23:59:59-06:00');

      if (periodoFiltro === 'HOY') {
        matchPeriodo = logFecha.toDateString() === hoy.toDateString();
      } else if (periodoFiltro === '7D') {
        const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchPeriodo = logFecha >= hace7Dias;
      }

      // Filtro por texto / ticket / hash
      const matchText =
        log.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
        log.adminId.toLowerCase().includes(busqueda.toLowerCase()) ||
        log.ipSimulada.toLowerCase().includes(busqueda.toLowerCase()) ||
        log.hashIntegridad.toLowerCase().includes(busqueda.toLowerCase()) ||
        (log.ticketId && log.ticketId.toLowerCase().includes(busqueda.toLowerCase()));

      return matchCat && matchPeriodo && matchText;
    });
  }, [categoriaFiltro, periodoFiltro, busqueda]);

  // Descarga del log en JSON certificado
  const descargarBitacoraJson = () => {
    const payload = {
      titulo: `Bitácora Oficial de Auditoría y Trazabilidad de Estado — Provincia de ${provinciaTheme.nombre}`,
      generadoPor: user?.nombre || 'Administrador Provincial',
      adminId: user?.id || 'USR-PROV-006',
      jurisdiccion: `Provincia ${user?.provinciaId || '6'} (${provinciaTheme.nombre})`,
      fechaEmisionIso: new Date().toISOString(),
      cumplimientoNormativo: 'Ley N° 8968 de Protección de Datos Personales de Costa Rica',
      totalRegistros: logsFiltrados.length,
      registros: logsFiltrados
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora_auditoria_provincial_${provinciaTheme.nombre.toLowerCase()}_2026.json`;
    a.click();
  };

  const badgeCategoriaColor = (cat) => {
    switch (cat) {
      case 'TRIAJE_M07':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.35)' };
      case 'ALERTA_CNE':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.35)' };
      case 'ALBERGUES_CNE':
        return { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.35)' };
      case 'SEGURIDAD_RBAC':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.35)' };
      case 'TELEMETRIA':
        return { bg: 'rgba(255, 255, 255, 0.08)', text: '#CBD5E1', border: 'rgba(255, 255, 255, 0.15)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.06)', text: '#94A3B8', border: 'rgba(255, 255, 255, 0.1)' };
    }
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
      {/* CABECERA DE AUDITORÍA Y TRAZABILIDAD                                 */}
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
            <FileText size={22} color={provinciaTheme.primary} />
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
              Bitácora Inmutable de Auditoría y Trazabilidad Forense
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Registro cronológico criptográfico de acciones de gobierno en {provinciaTheme.nombre}. Cumplimiento Ley N° 8968.
            </p>
          </div>
        </div>

        {/* Acciones de Verificación y Descarga */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={ejecutarVerificacionIntegridad}
            disabled={verificandoHash}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38BDF8',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: "'Paloseco', sans-serif"
            }}
          >
            <RefreshCw size={14} className={verificandoHash ? 'animate-spin' : ''} />
            <span>{verificandoHash ? 'Verificando Cadena...' : 'Verificar Integridad de Hash'}</span>
          </button>

          <button
            onClick={descargarBitacoraJson}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: "'Paloseco', sans-serif"
            }}
          >
            <Download size={14} />
            <span>Exportar Bitácora (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Banner de Verificación de Integridad */}
      {integridadVerificada && (
        <div
          style={{
            marginBottom: '1.25rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#34D399',
            fontSize: '0.82rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          <CheckCircle2 size={18} />
          <span>CADENA DE AUDITORÍA ÍNTEGRA: Todos los hashes SHA-256 coinciden con las firmas emitidas por la Dirección Regional.</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. BARRA DE FILTROS POR CATEGORÍA, PERÍODO Y BÚSQUEDA                */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem',
          alignItems: 'center'
        }}
      >
        {/* Búsqueda por Texto / Hash / Ticket */}
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
            placeholder="Buscar por acción, IP, hash o ticket..."
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

        {/* Filtro por Categoría */}
        <div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
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
            {CATEGORIAS_AUDITORIA.map((cat) => (
              <option key={cat.id} value={cat.id}>
                Categoría: {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Rango de Fechas / Período */}
        <div>
          <select
            value={periodoFiltro}
            onChange={(e) => setPeriodoFiltro(e.target.value)}
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
            <option value="HOY">Período: Sesión de Hoy (01 Octubre)</option>
            <option value="7D">Período: Últimos 7 Días</option>
            <option value="TODOS">Período: Todo el Histórico Inmutable</option>
          </select>
        </div>
      </div>

      {/* Indicador de Trazabilidad Legal */}
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
          <span style={{ color: '#CBD5E1', fontWeight: 600 }}>Principio de Transparencia Activa:</span>
          <span>Cada acción queda vinculada a la IP y token de firma del operador responsable.</span>
        </div>

        <div>
          Registros mostrados: <strong style={{ color: '#FFFFFF' }}>{logsFiltrados.length}</strong> de {LOGS_INICIALES.length}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. LISTA CRONOLÓGICA INMUTABLE DE AUDITORÍA                          */}
      {/* =================================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {logsFiltrados.map((log) => {
          const colCat = badgeCategoriaColor(log.categoria);

          return (
            <div
              key={log.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
            >
              {/* Línea Superior: Timestamp ISO + Categoría + Admin */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {/* Timestamp ISO exacto */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: '0.76rem',
                      color: '#38BDF8',
                      fontWeight: 700,
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.25)'
                    }}
                  >
                    {log.timestampIso}
                  </span>

                  {/* Badge de Categoría */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: colCat.bg,
                      color: colCat.text,
                      border: `1px solid ${colCat.border}`
                    }}
                  >
                    {log.categoria}
                  </span>

                  {log.ticketId && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#F8FAFC'
                      }}
                    >
                      Ticket: {log.ticketId}
                    </span>
                  )}
                </div>

                {/* Identificador del Administrador */}
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: '#94A3B8',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  Operador: <strong style={{ color: '#E2E8F0' }}>{log.adminId}</strong> ({log.adminRol})
                </div>
              </div>

              {/* Acción Realizada */}
              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  fontFamily: "'Paloseco', sans-serif",
                  lineHeight: 1.4
                }}
              >
                {log.accion}
              </div>

              {/* Línea Inferior: IP Simulada y Hash Criptográfico */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  fontSize: '0.72rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#64748B'
                }}
              >
                <div>
                  Origen: <span style={{ color: '#94A3B8' }}>{log.ipSimulada}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Firma:</span>
                  <span style={{ color: '#CBD5E1' }}>{log.hashIntegridad.slice(0, 24)}...</span>
                  <button
                    onClick={() => copiarHash(log.hashIntegridad)}
                    title="Copiar hash de integridad completo"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: hashCopiado === log.hashIntegridad ? '#10B981' : '#94A3B8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {hashCopiado === log.hashIntegridad ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {logsFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
            <AlertCircle size={32} color="#64748B" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0' }}>
              No se encontraron registros de auditoría con los filtros aplicados
            </div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Seleccione "Todas las Categorías" o amplíe el período de tiempo para consultar eventos anteriores.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
