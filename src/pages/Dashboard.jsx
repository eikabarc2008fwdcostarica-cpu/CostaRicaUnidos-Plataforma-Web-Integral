import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, FileEdit, Map, AlertOctagon, Store, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
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
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.createElement(modulo.icono, { size: 24, color: modulo.color || '#79a6ff' })}
                  </div>
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
