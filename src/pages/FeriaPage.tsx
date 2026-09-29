import React, { FC } from 'react';
import {
  Apple,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicBadge } from '../components/common/CivicBadge';
import { CivicButton } from '../components/common/CivicButton';
import { CroquisFeria } from '../components/comercio/CroquisFeria';
import { PUESTOS_FERIA_MOCK, CALENDARIO_COSECHAS } from '../data/comercioData';

export const FeriaPage: FC = () => {
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
        {/* Cabecera de la Feria */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <CivicBadge variant="provincial" size="md">
                FERIA DEL AGRICULTOR CANTONAL
              </CivicBadge>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Del Productor a su Mesa sin Intermediarios
              </span>
            </div>

            <a href="/comercio" style={{ textDecoration: 'none' }}>
              <CivicButton variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />}>
                Volver a Directorio Comercial
              </CivicButton>
            </a>
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
            Feria del Agricultor • Plaza González Víquez
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
            Conozca la ubicación de cada puesto en el croquis interactivo, consulte el origen verificado de los productores agropecuarios y planifique sus compras con el calendario oficial de temporadas de cosecha.
          </p>
        </div>

        {/* Ficha Rápida de Información y Horario */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={24} color="#FBBF24" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block' }}>Días de Apertura</span>
              <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>Sábados y Domingos</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={24} color="#34D399" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block' }}>Horario Oficial</span>
              <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>05:30 a 13:30 hrs</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={24} color="#7DD3FC" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block' }}>Ubicación</span>
              <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>Plaza González Víquez, San José</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={24} color="#10B981" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block' }}>Garantía</span>
              <strong style={{ fontSize: '0.95rem', color: '#A7F3D0' }}>100% Productores Certificados</strong>
            </div>
          </div>
        </div>

        {/* Componente del Croquis Interactivo y Calendario */}
        <CroquisFeria
          puestos={PUESTOS_FERIA_MOCK}
          calendario={CALENDARIO_COSECHAS}
        />
      </main>
    </div>
  );
};

export default FeriaPage;
