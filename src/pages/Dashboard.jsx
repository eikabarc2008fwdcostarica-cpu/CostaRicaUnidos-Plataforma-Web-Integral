import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Newspaper,
  FileEdit,
  Map,
  AlertOctagon,
  Store,
  BarChart3,
  ShieldCheck,
  User,
  LogOut,
  Activity,
  History,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getBitacora, getSesionesActivas } from '../services/dbService';

export default function Dashboard() {
  const { usuarioActual, user, officialRoleName, nivelAcceso, logout } = useAuth();
  const navigate = useNavigate();

  const currentUser = usuarioActual || user || {
    id: 'USR-CIUD-001',
    cedula: '1-1823-0456',
    nombre: 'Eiker Manuel Abarca Murillo',
    correo: 'eiker.abarca@gmail.com',
    rol: 'Ciudadano/Turista',
    nivelAcceso: 2,
    provincia: 'San José',
    canton: 'San José'
  };

  const [activeTab, setActiveTab] = useState('MODULOS');
  const [sesiones, setSesiones] = useState(() => {
    try {
      return getSesionesActivas() || [];
    } catch {
      return [];
    }
  });

  const [bitacora, setBitacora] = useState(() => {
    try {
      return getBitacora(15) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setSesiones(getSesionesActivas() || []);
        setBitacora(getBitacora(15) || []);
      } catch {
        // Ignorar
      }
    };
    window.addEventListener('cru_db_updated', handleUpdate);
    return () => window.removeEventListener('cru_db_updated', handleUpdate);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const modulosCivicos = [
    { id: 'M01', nombre: 'Portal Nacional', desc: 'Alertas cívicas y cabecera de noticias oficiales', icono: Newspaper, color: '#38BDF8', ruta: '/' },
    { id: 'M02', nombre: 'Gobernanza y Actas', desc: 'Organigrama municipal, actas del Concejo y visor PDF', icono: FileEdit, color: '#60A5FA', ruta: '/gobernanza' },
    { id: 'M03', nombre: 'Cultura e Identidad', desc: 'Línea histórica, escudos, reproductor de himnos y patrimonio', icono: Store, color: '#F472B6', ruta: '/cultura' },
    { id: 'M04', nombre: 'Deportes y CCDR', desc: 'Escuelas deportivas, instalaciones con semáforo y orgullo cantonal', icono: BarChart3, color: '#34D399', ruta: '/deportes' },
    { id: 'M05', nombre: 'Visor Cartográfico GIS', desc: 'Capas GeoJSON y relieve 3D cantonal fotorrealista', icono: Map, color: '#2DD4BF', ruta: '/mapa-gis' },
    { id: 'M06', nombre: 'Educación y CTPs', desc: 'Directorio de escuelas con POI y especialidades técnicas CTP', icono: AlertOctagon, color: '#A78BFA', ruta: '/educacion' },
    { id: 'M08', nombre: 'Comercio & Feria Agrícola', desc: 'Directorio PyMEs verificado con Hacienda y croquis de feria', icono: Store, color: '#FBBF24', ruta: '/comercio' },
    { id: 'M09', nombre: 'Turismo Cantonal', desc: 'Destinos accesibles Ley 7600, rutas 4x4 y exportador GeoJSON', icono: Map, color: '#38BDF8', ruta: '/turismo' },
    { id: 'M11', nombre: 'Participación Ciudadana', desc: 'Presupuesto participativo, votación blindada y audiencias', icono: BarChart3, color: '#10B981', ruta: '/participacion' },
    { id: 'M12', nombre: 'Itinerario Pura Vida (IA)', desc: 'Planificador generativo multivariable y relieve topográfico 3D', icono: FileEdit, color: '#F59E0B', ruta: '/itinerario-ia' }
  ];

  const currentNivel = currentUser.nivelAcceso || nivelAcceso || 2;
  const currentRol = currentUser.rol || officialRoleName || 'Ciudadano / Turista';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#00040D', color: '#FFFFFF' }}>
      <Navbar />

      <main className="civic-container" style={{ flex: 1, padding: '2.5rem 1.5rem 5rem' }}>
        {/* ================================================================= */}
        {/* 1. TARJETA DE CREDENCIAL SOBERANA Y CONTROL DE SESIÓN RBAC         */}
        {/* ================================================================= */}
        <div
          className="civic-glass-card"
          style={{
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            borderLeft: `4px solid ${
              currentNivel >= 5
                ? '#CE1126'
                : currentNivel === 4
                ? '#FFC700'
                : currentNivel === 3
                ? '#38BDF8'
                : '#00D166'
            }`,
            borderRadius: '16px',
            backgroundColor: 'rgba(0, 10, 28, 0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 43, 127, 0.4)',
                border: '2px solid rgba(121, 166, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={28} color="#79a6ff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {currentUser.nombre || 'Ciudadano Soberano'}
                </h2>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    backgroundColor:
                      currentNivel >= 5
                        ? 'rgba(206, 17, 38, 0.25)'
                        : currentNivel === 4
                        ? 'rgba(255, 199, 0, 0.2)'
                        : currentNivel === 3
                        ? 'rgba(2, 132, 199, 0.25)'
                        : 'rgba(0, 209, 102, 0.2)',
                    color:
                      currentNivel >= 5
                        ? '#FF8A8A'
                        : currentNivel === 4
                        ? '#FFC700'
                        : currentNivel === 3
                        ? '#38BDF8'
                        : '#00D166',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {currentRol} • Nivel {currentNivel}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.84rem', flexWrap: 'wrap' }}>
                <span><strong>Cédula:</strong> {currentUser.cedula || '1-0000-0001'}</span>
                <span>•</span>
                <span><strong>Jurisdicción:</strong> {currentUser.canton || 'San José'}, {currentUser.provincia || 'San José'}</span>
                <span>•</span>
                <span style={{ color: '#00D166', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Verificado Hacienda
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(218, 41, 28, 0.18)',
                border: '1px solid rgba(218, 41, 28, 0.4)',
                color: '#FF8A8A',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.35)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(218, 41, 28, 0.18)';
                e.currentTarget.style.color = '#FF8A8A';
              }}
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. PESTAÑAS DEL DASHBOARD: MÓDULOS / SESIONES ACTIVAS / AUDITORÍA */}
        {/* ================================================================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '0.75rem'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('MODULOS')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'MODULOS' ? 'rgba(0, 43, 127, 0.5)' : 'transparent',
              color: activeTab === 'MODULOS' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTab === 'MODULOS' ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} color="#79a6ff" />
            <span>Módulos Operativos (10)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SESIONES')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'SESIONES' ? 'rgba(0, 43, 127, 0.5)' : 'transparent',
              color: activeTab === 'SESIONES' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTab === 'SESIONES' ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={16} color="#00D166" />
            <span>Sesiones Activas ({sesiones.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BITACORA')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'BITACORA' ? 'rgba(0, 43, 127, 0.5)' : 'transparent',
              color: activeTab === 'BITACORA' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTab === 'BITACORA' ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={16} color="#FBBF24" />
            <span>Bitácora de Accesos ({bitacora.length})</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* VISTA 1: MÓDULOS CÍVICOS                                           */}
        {/* ================================================================= */}
        {activeTab === 'MODULOS' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {modulosCivicos.map((modulo) => (
              <div
                key={modulo.id}
                className="civic-glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(0, 10, 28, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {React.createElement(modulo.icono, { size: 24, color: modulo.color || '#79a6ff' })}
                    </div>
                    <span className="telemetry-badge">{modulo.id}</span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#FFFFFF' }}>
                    {modulo.nombre}
                  </h4>

                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.88rem' }}>
                    {modulo.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <Link
                    to={modulo.ruta}
                    className="btn-glass-secondary"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem', textAlign: 'center', display: 'block', borderRadius: '8px' }}
                  >
                    Abrir Módulo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================================= */}
        {/* VISTA 2: SESIONES ACTIVAS (db.json)                               */}
        {/* ================================================================= */}
        {activeTab === 'SESIONES' && (
          <div
            className="civic-glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(0, 10, 28, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Sesiones Registradas en db.json y localStorage
            </h3>

            {sesiones.length === 0 ? (
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>No hay sesiones activas registradas en la base de datos simulada.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'left', color: '#94A3B8' }}>
                      <th style={{ padding: '0.75rem' }}>ID Sesión</th>
                      <th style={{ padding: '0.75rem' }}>Usuario</th>
                      <th style={{ padding: '0.75rem' }}>Rol</th>
                      <th style={{ padding: '0.75rem' }}>Nivel</th>
                      <th style={{ padding: '0.75rem' }}>IP Origen</th>
                      <th style={{ padding: '0.75rem' }}>Inicio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sesiones.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#79a6ff' }}>{s.id}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{s.nombre}</td>
                        <td style={{ padding: '0.75rem' }}>{s.rol}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(0, 43, 127, 0.4)', fontSize: '0.75rem' }}>
                            Nivel {s.nivelAcceso}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.65)' }}>{s.ipSimulada}</td>
                        <td style={{ padding: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                          {new Date(s.fechaInicio).toLocaleTimeString('es-CR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VISTA 3: BITÁCORA DE AUDITORÍA (db.json)                          */}
        {/* ================================================================= */}
        {activeTab === 'BITACORA' && (
          <div
            className="civic-glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(0, 10, 28, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Bitácora de Accesos y Transacciones Cívicas (SRS v2.1)
            </h3>

            {bitacora.length === 0 ? (
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>No hay eventos registrados en la bitácora.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {bitacora.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor:
                              b.accion === 'INICIO_SESION'
                                ? 'rgba(0, 209, 102, 0.2)'
                                : b.accion === 'REGISTRO_USUARIO'
                                ? 'rgba(0, 122, 61, 0.3)'
                                : b.accion === 'ACCESO_DENEGADO'
                                ? 'rgba(206, 17, 38, 0.25)'
                                : 'rgba(255, 255, 255, 0.1)',
                            color:
                              b.accion === 'INICIO_SESION'
                                ? '#00D166'
                                : b.accion === 'REGISTRO_USUARIO'
                                ? '#4ADE80'
                                : b.accion === 'ACCESO_DENEGADO'
                                ? '#FF8A8A'
                                : '#94A3B8'
                          }}
                        >
                          {b.accion}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{b.nombre}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>({b.rol})</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                        {b.descripcion}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.74rem', color: '#64748B', fontFamily: 'monospace' }}>
                      <div>{new Date(b.timestamp).toLocaleTimeString('es-CR')}</div>
                      <div>{b.ipSimulada}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
