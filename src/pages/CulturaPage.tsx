import React, { FC, useState, useEffect } from 'react';
import {
  Music,
  Clock,
  Shield,
  Sparkles,
  BookOpen,
  Calendar,
  Landmark,
  MapPin,
  Flag,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { CivicButton } from '../components/common/CivicButton';
import { CivicCard } from '../components/common/CivicCard';
import { HimnoPlayer } from '../components/cultura/HimnoPlayer';
import { TimelineHistorico } from '../components/cultura/TimelineHistorico';
import { GaleriaSimbolos } from '../components/cultura/GaleriaSimbolos';
import { PatrimonioLightbox } from '../components/cultura/PatrimonioLightbox';
import {
  getHitosCanton,
  getSimbolosCanton,
  getHimnoCanton,
  getPatrimonioInmaterial,
  getResennaFundacional
} from '../data/culturaData';

export const CulturaPage: FC = () => {
  // Cantón activo sincronizado con el Navbar y Theming Engine
  const [cantonActivo, setCantonActivo] = useState<string>(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'San José';
    } catch {
      return 'San José';
    }
  });

  useEffect(() => {
    const handleCantonChange = (e: any) => {
      if (e.detail?.nombre) setCantonActivo(e.detail.nombre);
      else {
        const saved = localStorage.getItem('cr_canton_activo');
        if (saved) setCantonActivo(saved);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    window.addEventListener('storage', handleCantonChange);
    return () => {
      window.removeEventListener('cantonChanged', handleCantonChange);
      window.removeEventListener('storage', handleCantonChange);
    };
  }, []);

  const [seccionActiva, setSeccionActiva] = useState<'heraldica' | 'himno' | 'historia' | 'simbolos' | 'patrimonio'>('heraldica');

  const himno = getHimnoCanton(1);
  const hitos = getHitosCanton(1);
  const simbolos = getSimbolosCanton(1);
  const patrimonio = getPatrimonioInmaterial();
  const resenna = getResennaFundacional(cantonActivo);

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
        {/* Cabecera Cultural e Identidad Soberana */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
            <CivicBadge variant="provincial" size="md">
              MUNICIPALIDAD DE {cantonActivo.toUpperCase()} &bull; PATRIMONIO CULTURAL E HISTORIA
            </CivicBadge>
            <span style={{ fontSize: '0.825rem', color: 'var(--cru-text-muted)' }}>
              Memoria Cívica, Símbolos Heráldicos Oficiales y Leyes Fundacionales de Costa Rica
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline, 'Mistical Spring', serif)",
              fontSize: 'clamp(1.9rem, 4vw, 2.9rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              margin: '0 0 0.85rem 0'
            }}
          >
            Patrimonio Cantonal, Heráldica y Memoria Histórica
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--cru-border-strong)', maxWidth: '900px', lineHeight: 1.6, margin: 0 }}>
            Custodia institucional de las raíces democráticas de {cantonActivo}. Conozca el blasón oficial y la bandera del cantón, la ley de creación del gobierno local, el himno cantonal con partitura y letra oficial, y la línea de tiempo de los distritos que forjaron la República.
          </p>
        </div>

        {/* Resumen Heráldico Superior de Alta Solemnidad */}
        <div style={{ marginBottom: '2.5rem' }}>
          <CivicCard level={2} provincialGlow>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              {/* Representación Visual Escudo y Bandera */}
              <div
                style={{
                  background: 'radial-gradient(circle at center, rgba(0, 43, 127, 0.4) 0%, rgba(0, 4, 13, 0.95) 75%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Escudo Cantonal Renderizado */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '100px',
                        height: '120px',
                        background: 'linear-gradient(180deg, #002B7F 0%, #001489 60%, #000D4D 100%)',
                        border: '3px solid #FFC700',
                        borderRadius: '0 0 50px 50px',
                        boxShadow: '0 8px 24px rgba(0, 43, 127, 0.6), 0 0 15px rgba(255, 199, 0, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        padding: '0.5rem'
                      }}
                    >
                      <Shield size={36} color="#FFC700" />
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: "var(--font-headline, serif)",
                          fontWeight: 800,
                          color: '#FFFFFF',
                          textAlign: 'center',
                          marginTop: '0.35rem',
                          lineHeight: 1.1
                        }}
                      >
                        {cantonActivo.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFC700' }}>
                      Escudo Oficial
                    </span>
                  </div>

                  {/* Bandera Cantonal Bicolor */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '120px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1.5px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ flex: 1, background: resenna.banderaColores[0]?.hex || '#002B7F' }} />
                      <div style={{ flex: 1, background: resenna.banderaColores[1]?.hex || '#FFFFFF' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7DD3FC' }}>
                      Pabellón Cantonal
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: "var(--font-headline, 'Mistical Spring', serif)",
                      fontSize: '1rem',
                      fontStyle: 'italic',
                      color: 'var(--cru-border)',
                      display: 'block'
                    }}
                  >
                    «{resenna.lemaOficial}»
                  </span>
                </div>
              </div>

              {/* Ficha Técnica de Fundación del Cantón */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <Landmark size={18} color="#7DD3FC" />
                    <span style={{ fontSize: '0.8rem', color: '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      Génesis Jurídica e Institucional
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Cantón de {cantonActivo} &bull; Datos Fundacionales
                  </h3>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', display: 'block' }}>Ley de Creación:</span>
                    <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{resenna.leyCreacion}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', display: 'block' }}>Fecha de Erección:</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--cru-accent-green-border)' }}>{resenna.fechaFundacion}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', display: 'block' }}>Título de Ciudad:</span>
                    <strong style={{ fontSize: '0.85rem', color: '#FCD34D' }}>{resenna.tituloCiudadFecha}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', display: 'block' }}>Administración Ejecutiva:</span>
                    <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{resenna.presidenteAdministracion}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', display: 'block' }}>Cabecera Municipal:</span>
                    <strong style={{ fontSize: '0.85rem', color: '#7DD3FC' }}>{resenna.cabecera}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', display: 'block' }}>Superficie & Población:</span>
                    <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{resenna.superficieKm2} km² &bull; {resenna.poblacionHabitantes}</strong>
                  </div>
                </div>

                {/* Distritos Oficiales */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Distritos Oficiales ({resenna.distritosOficiales.length}):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {resenna.distritosOficiales.map((dist, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(0, 43, 127, 0.3)',
                          border: '1px solid rgba(125, 211, 252, 0.25)',
                          borderRadius: '6px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          color: 'var(--cru-border)'
                        }}
                      >
                        {dist}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CivicCard>
        </div>

        {/* Barra de Pestañas Culturales */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '2.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
          role="tablist"
          aria-label="Secciones Culturales"
        >
          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'heraldica'}
            onClick={() => setSeccionActiva('heraldica')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'heraldica' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'heraldica' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Shield size={18} />
            <span>Heráldica y Ley Fundacional</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'himno'}
            onClick={() => setSeccionActiva('himno')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'himno' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'himno' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Music size={18} />
            <span>Himno Cantonal y Partitura</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'historia'}
            onClick={() => setSeccionActiva('historia')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'historia' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'historia' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Clock size={18} />
            <span>Línea de Tiempo de los Distritos</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'simbolos'}
            onClick={() => setSeccionActiva('simbolos')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'simbolos' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'simbolos' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Flag size={18} />
            <span>Evolución de Emblemas</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={seccionActiva === 'patrimonio'}
            onClick={() => setSeccionActiva('patrimonio')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: seccionActiva === 'patrimonio' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: seccionActiva === 'patrimonio' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Sparkles size={18} />
            <span>Patrimonio Inmaterial (Ley N° 7555)</span>
            <CivicBadge variant="default" size="sm">
              {patrimonio.length}
            </CivicBadge>
          </button>
        </div>

        {/* PESTAÑA 1: Heráldica y Ley Fundacional Detallada */}
        {seccionActiva === 'heraldica' && (
          <section aria-label="Heráldica Oficial y Ley de Creación">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <CivicCard level={1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={20} color="#FFC700" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      Blasón Heráldico Oficial de {cantonActivo}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--cru-border-strong)', lineHeight: 1.6, margin: 0 }}>
                    {resenna.escudoDescripcionBlason}
                  </p>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      fontSize: '0.8rem',
                      color: 'var(--cru-text-muted)'
                    }}
                  >
                    <strong>Normativa: </strong> Registro Oficial Heráldico Municipal &bull; Declaratoria cívica por acuerdo del Concejo Municipal.
                  </div>
                </div>
              </CivicCard>

              <CivicCard level={1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Flag size={20} color="#7DD3FC" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      Vexilología y Pabellón Cantonal
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--cru-border-strong)', lineHeight: 1.6, margin: 0 }}>
                    {resenna.banderaDescripcion}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {resenna.banderaColores.map((col, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: col.hex,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            flexShrink: 0
                          }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.825rem', color: '#FFFFFF', display: 'block' }}>{col.nombre}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)' }}>{col.significado}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CivicCard>
            </div>
          </section>
        )}

        {/* PESTAÑA 2: Himno Cantonal y Partitura */}
        {seccionActiva === 'himno' && (
          <section aria-label="Reproductor Oficial de Himno Cantonal">
            <HimnoPlayer himno={himno} />
          </section>
        )}

        {/* PESTAÑA 3: Línea de Tiempo de los Distritos */}
        {seccionActiva === 'historia' && (
          <section aria-label="Línea de Tiempo Histórica">
            <TimelineHistorico hitos={hitos} />
          </section>
        )}

        {/* PESTAÑA 4: Evolución de Emblemas */}
        {seccionActiva === 'simbolos' && (
          <section aria-label="Evolución Heráldica y Banderas">
            <GaleriaSimbolos simbolos={simbolos} />
          </section>
        )}

        {/* PESTAÑA 5: Patrimonio Inmaterial (Ley N° 7555) */}
        {seccionActiva === 'patrimonio' && (
          <section aria-label="Patrimonio Inmaterial de la Humanidad y Tradiciones">
            <PatrimonioLightbox elementos={patrimonio} />
          </section>
        )}
      </main>
    </div>
  );
};

export default CulturaPage;
