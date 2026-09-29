import React, { FC, useState } from 'react';
import {
  Trophy,
  Dumbbell,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { CivicButton } from '../components/common/CivicButton';
import { CivicCard } from '../components/common/CivicCard';
import { FichaInstalacion } from '../components/deportes/FichaInstalacion';
import { OrgulloCantonal } from '../components/deportes/OrgulloCantonal';
import { FeedDeportivo } from '../components/deportes/FeedDeportivo';
import { DEPORTES_MOCK_DATA, InstalacionDeportiva } from '../data/deportesData';

export const DeportesPage: FC = () => {
  const [seccionActiva, setSeccionActiva] = useState<'instalaciones' | 'escuelas' | 'orgullo' | 'feed'>('instalaciones');
  const [mensajeReserva, setMensajeReserva] = useState<string | null>(null);

  const handleReservar = (inst: InstalacionDeportiva) => {
    setMensajeReserva(`Solicitud iniciada para ${inst.nombre}. Un gestor deportivo del CCDR se comunicará al teléfono oficial registrado.`);
    setTimeout(() => setMensajeReserva(null), 5000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-obsidian-sovereign, #00040D)',
        color: '#FFFFFF',
        position: 'relative'
      }}
    >
      <Navbar />

      <main className="civic-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Cabecera Deportiva */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <CivicBadge variant="provincial" size="md">
              MÓDULO 04 &bull; ECOSISTEMA DEPORTIVO CANTONAL
            </CivicBadge>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Comité Cantonal de Deportes y Recreación (CCDR)
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline, 'Mistical Spring', serif)",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              margin: '0 0 0.75rem 0'
            }}
          >
            Infraestructura Deportiva y Escuelas Formativas
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
            Verifique la disponibilidad en tiempo real de polideportivos, canchas y piscinas mediante el semáforo cívico, inscríbase en escuelas gratuitas del CCDR y celebre los logros de nuestros atletas.
          </p>
        </div>

        {mensajeReserva && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(52, 211, 153, 0.45)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.75rem',
              color: '#D1FAE5',
              fontSize: '0.9rem'
            }}
          >
            <CheckCircle2 size={20} color="#10B981" />
            <span>{mensajeReserva}</span>
          </div>
        )}

        {/* Barra de Pestañas Deportivas */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '2rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
          role="tablist"
          aria-label="Secciones Deportivas"
        >
          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'instalaciones'}
            onClick={() => setSeccionActiva('instalaciones')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'instalaciones' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'instalaciones' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Dumbbell size={18} />
            <span>Instalaciones y Semáforo</span>
            <CivicBadge variant="default" size="sm">
              {DEPORTES_MOCK_DATA.instalaciones.length}
            </CivicBadge>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'escuelas'}
            onClick={() => setSeccionActiva('escuelas')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'escuelas' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'escuelas' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={18} />
            <span>Escuelas Deportivas CCDR</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'orgullo'}
            onClick={() => setSeccionActiva('orgullo')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'orgullo' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'orgullo' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Trophy size={18} />
            <span>Orgullo Cantonal</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'feed'}
            onClick={() => setSeccionActiva('feed')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'feed' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'feed' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Calendar size={18} />
            <span>Convocatorias y Feed</span>
          </button>
        </div>

        {/* Sección 1: Instalaciones */}
        {seccionActiva === 'instalaciones' && (
          <section aria-label="Instalaciones deportivas con semáforo de disponibilidad">
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#94A3B8' }}>Semáforo Oficial:</span>
                <span style={{ color: '#A7F3D0' }}>&bull; Verde: Abierto</span>
                <span style={{ color: '#FDE68A' }}>&bull; Amarillo: Mantenimiento</span>
                <span style={{ color: '#FECACA' }}>&bull; Rojo: Alquiler</span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {DEPORTES_MOCK_DATA.instalaciones.map((inst) => (
                <FichaInstalacion
                  key={inst.id}
                  instalacion={inst}
                  onReservar={handleReservar}
                />
              ))}
            </div>
          </section>
        )}

        {/* Sección 2: Escuelas CCDR */}
        {seccionActiva === 'escuelas' && (
          <section aria-label="Catálogo de Escuelas Deportivas Formatívas">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {DEPORTES_MOCK_DATA.escuelas.map((esc) => (
                <CivicCard key={esc.id} level={1} interactive>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>{esc.icono}</span>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                            {esc.disciplina}
                          </h3>
                          <span style={{ fontSize: '0.8rem', color: '#7DD3FC' }}>
                            {esc.categoriaEdad}
                          </span>
                        </div>
                      </div>

                      <CivicBadge variant="success" size="sm">
                        {esc.cuposDisponibles} cupos
                      </CivicBadge>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div><strong>Entrenador: </strong>{esc.profesorACargo}</div>
                      <div><strong>Sede: </strong>{esc.lugarEntrenamiento}</div>
                      <div><strong>Horarios: </strong>{esc.diasHorario}</div>
                      <div><strong>Inversión: </strong><span style={{ color: '#34D399', fontWeight: 600 }}>{esc.mensualidad}</span></div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.78rem',
                        color: '#94A3B8'
                      }}
                    >
                      <strong style={{ color: '#E2E8F0', display: 'block', marginBottom: '0.2rem' }}>Requisitos:</strong>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                        {esc.requisitos.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <CivicButton variant="provincial" size="sm" fullWidth>
                      Inscribir Atleta
                    </CivicButton>
                  </div>
                </CivicCard>
              ))}
            </div>
          </section>
        )}

        {/* Sección 3: Orgullo Cantonal */}
        {seccionActiva === 'orgullo' && (
          <section aria-label="Atletas de Orgullo Cantonal">
            <OrgulloCantonal atletas={DEPORTES_MOCK_DATA.atletas} />
          </section>
        )}

        {/* Sección 4: Feed Comunitario */}
        {seccionActiva === 'feed' && (
          <section aria-label="Feed Comunitario y Convocatorias">
            <FeedDeportivo postsIniciales={DEPORTES_MOCK_DATA.feed} />
          </section>
        )}
      </main>
    </div>
  );
};

export default DeportesPage;
