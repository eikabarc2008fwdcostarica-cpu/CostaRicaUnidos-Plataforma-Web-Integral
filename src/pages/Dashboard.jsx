import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const modulosCivicos = [
    { id: 'M01', nombre: 'Portal Nacional', desc: 'Alertas cívicas y cabecera de noticias oficiales', icono: '📰', ruta: '/' },
    { id: 'M03', nombre: 'Sistema de Trámites', desc: 'Digitalización y consulta de solicitudes públicas', icono: '📝' },
    { id: 'M05', nombre: 'Visor Cartográfico GIS', desc: 'Capas GeoJSON y relieve 3D cantonal fotorrealista', icono: '🗺️', ruta: '/mapa-gis' },
    { id: 'M06', nombre: 'Gestión de Desastres', desc: 'Protocolos de emergencia y albergues en tiempo real', icono: '🚨', ruta: '/mapa-gis' },
    { id: 'M08', nombre: 'Feria del Agricultor', desc: 'Rutas de abastecimiento y comercio local cantonal', icono: '🌽' },
    { id: 'M10', nombre: 'Observatorio Económico', desc: 'Verificación tributaria mediante API Hacienda', icono: '📊' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="civic-container" style={{ flex: 1, padding: '3rem 1.5rem 5rem' }}>
        {/* Banner de confirmación de ruta protegida */}
        <div className="civic-glass-card" style={{
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          borderLeft: '4px solid #00D166',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#00D166',
                boxShadow: '0 0 10px #00D166'
              }}></span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                Ruta Protegida Verificada &bull; Panel Cívico Activo
              </h2>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
              Has ingresado satisfactoriamente a la zona privada custodiada por el componente guardián <code>PrivateRoutes</code>.
            </p>
          </div>

          <span className="telemetry-badge">
            SESIÓN PRIVILEGIADA: CIUDADANO AUTORIZADO
          </span>
        </div>

        {/* Encabezado del Tablero */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Consola de Servicios Cívicos y Territoriales
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Acceso centralizado a los módulos operativos de la República de Costa Rica.
          </p>
        </div>

        {/* Grilla de Módulos Operativos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {modulosCivicos.map((modulo) => (
            <div key={modulo.id} className="civic-glass-card" style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '2rem' }}>{modulo.icono}</span>
                  <span className="telemetry-badge">{modulo.id}</span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  {modulo.nombre}
                </h4>

                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.88rem' }}>
                  {modulo.desc}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                {modulo.ruta ? (
                  <Link
                    to={modulo.ruta}
                    className="btn-glass-secondary"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.55rem', textAlign: 'center', display: 'block' }}
                  >
                    Abrir Módulo →
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn-glass-secondary"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.55rem' }}
                  >
                    Abrir Módulo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
