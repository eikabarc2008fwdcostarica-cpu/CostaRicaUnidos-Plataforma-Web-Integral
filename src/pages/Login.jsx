import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCedula = cedula.trim();

    if (!cleanCedula) {
      setError('Por favor, ingresa tu número de cédula o identificación cívica.');
      return;
    }

    if (cleanCedula.length < 9) {
      setError('El número de identificación debe contener al menos 9 dígitos.');
      return;
    }

    setError('');
    // Redirección programática al dashboard tras validar el acceso
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="civic-container" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem'
      }}>
        <div className="civic-glass-card" style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          position: 'relative'
        }}>
          {/* Encabezado del Formulario */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="telemetry-badge" style={{ marginBottom: '1rem' }}>
              AUTENTICACIÓN CÍVICA CIUDADANA
            </span>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              Acceso Soberano
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
              Ingresa tu identificación para interactuar con los servicios digitales de la República.
            </p>
          </div>

          {/* Formulario React */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="cedula-input" style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0.5rem'
              }}>
                Cédula de Identidad / DIMEX
              </label>

              <input
                id="cedula-input"
                type="text"
                placeholder="Ejemplo: 1-1188-0888"
                value={cedula}
                onChange={(e) => {
                  setCedula(e.target.value);
                  if (error) setError('');
                }}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 4, 13, 0.7)',
                  border: error ? '1px solid #DA291C' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-main)',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
              />

              {error && (
                <div style={{
                  color: '#FF6B6B',
                  fontSize: '0.82rem',
                  marginTop: '0.5rem',
                  fontWeight: 500
                }}>
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-sovereign"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Ingresar al Dashboard
            </button>
          </form>

          {/* Nota de Seguridad */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            Protegido con cifrado TLS 1.3 y compatibilidad con API Ministerio de Hacienda.
          </div>
        </div>
      </main>
    </div>
  );
}
