import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, X } from 'lucide-react';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../data/costaRicaTerritorialData';

export default function TerritorialDrawer({
  isOpen,
  onClose,
  provinciaId
}) {
  const panelRef = useRef(null);

  const provData = PROVINCIAS_DATA.find((p) => p.id === Number(provinciaId)) || PROVINCIAS_DATA[0];
  const cantonesProvincia = CANTONES_OFICIALES.filter((c) => c.provinciaId === provData.id);

  // Cerrar al pulsar Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo desenfocado */}
      <div
        className={`civic-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel deslizante lateral */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Ficha Territorial de la Provincia de ${provData.nombre}`}
        className={`civic-drawer-panel ${isOpen ? 'open' : ''}`}
      >
        {/* Cabecera del Drawer */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(0, 4, 13, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: provData.color,
              boxShadow: `0 0 10px ${provData.color}`
            }} />
            <span className="telemetry-badge">
              DTA PROVINCIA 0{provData.id}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha territorial"
            className="btn-glass-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.9rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <X size={15} />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          {/* Título de la Provincia */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '0.25rem'
            }}>
              {provData.nombre}
            </h3>
            <p style={{ color: '#79a6ff', fontSize: '0.9rem', fontWeight: 600 }}>
              {provData.lema}
            </p>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              {provData.descripcion}
            </p>
          </div>

          {/* Insignia Deportiva / Cívica Emblemática */}
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${provData.color}55`,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                Identidad Emblemática
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                {provData.club}
              </div>
              <div style={{ fontSize: '0.8rem', color: provData.color }}>
                {provData.apodo}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-telemetry)',
              fontSize: '0.85rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: provData.color,
              color: provData.textColor
            }}>
              {provData.color}
            </div>
          </div>

          {/* Cuadrícula de Métricas Cívicas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{
              padding: '0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 15, 45, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>CANTONES</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                {provData.cantonesCount}
              </div>
            </div>

            <div style={{
              padding: '0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 15, 45, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>DISTRITOS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                {provData.distritosCount}
              </div>
            </div>

            <div style={{
              padding: '0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 15, 45, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>POBLACIÓN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#79a6ff' }}>
                {provData.poblacion}
              </div>
            </div>

            <div style={{
              padding: '0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 15, 45, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>SUPERFICIE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00D166' }}>
                {provData.superficie}
              </div>
            </div>
          </div>

          {/* Lista de Cantones de la Provincia */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Cantones Oficiales ({cantonesProvincia.length})</span>
              <span className="telemetry-badge" style={{ fontSize: '0.68rem' }}>DTA VIGENTE</span>
            </h4>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '220px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {cantonesProvincia.map((canton) => (
                <div
                  key={canton.id}
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', color: '#F8FAFC' }}>
                    {canton.id}. {canton.nombre}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-telemetry)',
                    fontSize: '0.75rem',
                    color: '#79a6ff'
                  }}>
                    DTA: {canton.codigoDta}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones de Auditoría */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/dashboard"
              className="btn-sovereign"
              style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <BarChart3 size={16} />
              <span>Auditar Proyectos en {provData.nombre}</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="btn-glass-secondary"
              style={{ width: '100%' }}
            >
              Volver al Portal
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
