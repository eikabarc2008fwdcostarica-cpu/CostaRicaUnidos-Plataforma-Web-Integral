import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="civic-container" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="civic-glass-card" style={{
          maxWidth: '520px',
          padding: '3.5rem 2rem'
        }}>
          <span className="telemetry-badge" style={{ marginBottom: '1.5rem', color: '#FF6B6B' }}>
            ERROR 404 &bull; COORDENADA INEXISTENTE
          </span>

          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: '1rem',
            color: 'var(--color-national-red)'
          }}>
            404
          </h1>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.8rem' }}>
            Territorio Digital No Encontrado
          </h2>

          <p style={{
            color: 'rgba(255, 255, 255, 0.72)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            La ruta o cantón digital al que intentas acceder no forma parte de la cartografía registrada en la plataforma Costa Rica Unidos.
          </p>

          <Link to="/" className="btn-sovereign">
            Regresar al Portal de Inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
