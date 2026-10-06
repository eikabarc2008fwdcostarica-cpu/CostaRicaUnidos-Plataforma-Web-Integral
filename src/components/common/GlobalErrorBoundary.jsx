import React from 'react';
import { AlertTriangle, Home, RefreshCw, ShieldCheck } from 'lucide-react';
import Navbar from '../Navbar';

/**
 * GlobalErrorBoundary — Guardián Global de Excepciones en Runtime de React
 * 
 * Captura cualquier error no controlado en componentes hijos (como Turismo, Mapas o Trámites),
 * previene la pantalla en negro/blanco y ofrece al ciudadano una interfaz digna con acción
 * inmediata de retorno seguro a la Página Principal ('/').
 */
export default class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CRU Global Error Boundary] Excepción capturada en renderizado:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            backgroundColor: 'var(--cru-page-bg, #00040D)',
            color: 'var(--cru-text, #FFFFFF)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {/* Cabecera Segura */}
          <header
            style={{
              padding: '1rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--cru-border, rgba(255, 255, 255, 0.08))',
              background: 'var(--theme-header-bg, rgba(5, 12, 28, 0.95))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #001489, #DA291C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  color: '#FFFFFF'
                }}
              >
                CR
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--cru-text)' }}>
                COSTA RICA UNIDOS
              </span>
            </div>
            <button
              onClick={this.handleGoHome}
              style={{
                backgroundColor: 'var(--cru-accent-sky-bg)',
                border: '1px solid var(--cru-accent-sky-border)',
                color: 'var(--cru-accent-sky)',
                borderRadius: '9999px',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Ir a Inicio
            </button>
          </header>

          {/* Cuerpo del Error */}
          <main
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <div
              style={{
                maxWidth: '560px',
                width: '100%',
                backgroundColor: 'var(--cru-surface-card)',
                border: '1px solid var(--cru-accent-red-border, rgba(239, 68, 68, 0.35))',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: 'var(--cru-card-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.5))'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 1.5rem',
                  borderRadius: '20px',
                  backgroundColor: 'var(--cru-accent-red-bg)',
                  border: '1px solid var(--cru-accent-red-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cru-accent-red)'
                }}
              >
                <AlertTriangle size={32} />
              </div>

              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--cru-accent-red)',
                  backgroundColor: 'var(--cru-accent-red-bg)',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '9999px',
                  marginBottom: '0.75rem'
                }}
              >
                Protocolo de Contingencia Cívica
              </span>

              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--cru-text)',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em'
                }}
              >
                Interrupción de Módulo Cívico
              </h2>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--cru-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '2rem'
                }}
              >
                El sistema detectó una excepción no prevista al renderizar esta sección. Para proteger la integridad de sus datos y de su sesión ciudadana, el fallo fue aislado y contenido de manera segura.
              </p>

              {this.state.error?.message && (
                <div
                  style={{
                    backgroundColor: 'var(--cru-surface-muted)',
                    border: '1px solid var(--cru-border)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    marginBottom: '2rem',
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: 'var(--cru-accent-red)',
                    overflowX: 'auto'
                  }}
                >
                  {this.state.error.message}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  justifyContent: 'center'
                }}
              >
                <button
                  type="button"
                  onClick={this.handleGoHome}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--cru-accent-sky)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '0.85rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Home size={18} />
                  Volver a la Página Principal
                </button>

                <button
                  type="button"
                  onClick={this.handleReset}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--cru-surface-muted)',
                    color: 'var(--cru-text)',
                    border: '1px solid var(--cru-border)',
                    borderRadius: '14px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={16} />
                  Reintentar Renderizado
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
