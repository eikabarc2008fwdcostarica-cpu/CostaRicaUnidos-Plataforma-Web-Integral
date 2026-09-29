import React, { FC, useState } from 'react';
import {
  Music,
  Clock,
  Shield,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { HimnoPlayer } from '../components/cultura/HimnoPlayer';
import { TimelineHistorico } from '../components/cultura/TimelineHistorico';
import { GaleriaSimbolos } from '../components/cultura/GaleriaSimbolos';
import { PatrimonioLightbox } from '../components/cultura/PatrimonioLightbox';
import {
  getHitosCanton,
  getSimbolosCanton,
  getHimnoCanton,
  getPatrimonioInmaterial
} from '../data/culturaData';

export const CulturaPage: FC = () => {
  const [cantonSeleccionado] = useState<number>(1); // San José por defecto
  const [seccionActiva, setSeccionActiva] = useState<'himno' | 'historia' | 'simbolos' | 'patrimonio'>('himno');

  const himno = getHimnoCanton(cantonSeleccionado);
  const hitos = getHitosCanton(cantonSeleccionado);
  const simbolos = getSimbolosCanton(cantonSeleccionado);
  const patrimonio = getPatrimonioInmaterial();

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
        {/* Cabecera Cultural */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <CivicBadge variant="provincial" size="md">
              MÓDULO 03 &bull; IDENTIDAD CULTURAL Y TRADICIONES
            </CivicBadge>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Memoria Viva, Símbolos Heráldicos y Música Soberana
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
            Patrimonio Cantonal, Himnos y Memoria Histórica
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
            Descubra las raíces identitarias de Costa Rica a través de la música cívica oficial con letra sincronizada, la evolución heráldica de nuestros emblemas cantonales y las expresiones vivas de nuestro patrimonio inmaterial.
          </p>
        </div>

        {/* Barra de Pestañas Culturales */}
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
          aria-label="Secciones Culturales"
        >
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
              transition: 'all 0.2s ease'
            }}
          >
            <Music size={18} />
            <span>Himno Cantonal Sincronizado</span>
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
              transition: 'all 0.2s ease'
            }}
          >
            <Clock size={18} />
            <span>Línea de Tiempo Histórica</span>
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
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={18} />
            <span>Evolución de Escudos y Banderas</span>
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
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={18} />
            <span>Muro de Patrimonio Inmaterial</span>
            <CivicBadge variant="default" size="sm">
              {patrimonio.length}
            </CivicBadge>
          </button>
        </div>

        {/* Vistas de Sección */}
        {seccionActiva === 'himno' && (
          <section aria-label="Reproductor Oficial de Himno Cantonal">
            <HimnoPlayer himno={himno} />
          </section>
        )}

        {seccionActiva === 'historia' && (
          <section aria-label="Línea de Tiempo Histórica">
            <TimelineHistorico hitos={hitos} />
          </section>
        )}

        {seccionActiva === 'simbolos' && (
          <section aria-label="Evolución Heráldica y Banderas">
            <GaleriaSimbolos simbolos={simbolos} />
          </section>
        )}

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
