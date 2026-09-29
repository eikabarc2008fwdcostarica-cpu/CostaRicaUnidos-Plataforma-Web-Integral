import React, { FC, useState } from 'react';
import {
  FileText,
  Users,
  Building2,
  Calendar,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { CivicCard } from '../components/common/CivicCard';
import { CivicButton } from '../components/common/CivicButton';
import { CivicBadge } from '../components/common/CivicBadge';
import { TablaActas } from '../components/gobernanza/TablaActas';
import { OrganigramaMunicipal } from '../components/gobernanza/OrganigramaMunicipal';
import {
  getAutoridadesCanton,
  getOrganigramaCanton,
  getActasCanton
} from '../data/gobernanzaData';

export const GobernanzaPage: FC = () => {
  const [cantonSeleccionado] = useState<number>(1); // San José por defecto
  const [tabActiva, setTabActiva] = useState<'actas' | 'organigrama'>('actas');

  const autoridades = getAutoridadesCanton(cantonSeleccionado);
  const organigrama = getOrganigramaCanton(cantonSeleccionado);
  const actas = getActasCanton(cantonSeleccionado);

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
        {/* Cabecera Institucional Cantonal */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <CivicBadge variant="provincial" size="md">
              MÓDULO 02 &bull; GOBERNANZA SOBERANA
            </CivicBadge>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Transparencia Institucional y Rendición de Cuentas
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
            Espacio Administrativo y Visor de Actas Municipales
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
            Consulte las actas oficiales del Concejo Municipal en PDF con firma digital, explore el organigrama administrativo del gobierno local y ejerza su derecho a la transparencia y la participación democrática.
          </p>
        </div>

        {/* Fichas de Autoridades Locales Principales */}
        <section aria-labelledby="seccion-autoridades" style={{ marginBottom: '2.5rem' }}>
          <h2
            id="seccion-autoridades"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#F8FAFC',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Users size={20} color="#7DD3FC" />
            Autoridades del Gobierno Local
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {autoridades.map((autoridad) => (
              <CivicCard key={autoridad.id} level={1} interactive>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <CivicBadge variant="provincial" size="sm">
                        {autoridad.cargo}
                      </CivicBadge>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: '0.4rem 0 0 0' }}>
                        {autoridad.nombre}
                      </h3>
                    </div>
                    <Building2 size={24} color="rgba(255,255,255,0.4)" />
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    <span>{autoridad.partido}</span> &bull; <span>Periodo {autoridad.periodo}</span>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      fontSize: '0.825rem',
                      color: '#CBD5E1'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} color="#34D399" />
                      <span style={{ fontFamily: "var(--font-telemetry, monospace)" }}>{autoridad.telefono}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="#7DD3FC" />
                      <a href={`mailto:${autoridad.correo}`} style={{ color: '#7DD3FC', textDecoration: 'none' }}>
                        {autoridad.correo}
                      </a>
                    </div>
                  </div>
                </div>
              </CivicCard>
            ))}
          </div>
        </section>

        {/* Barra de Acciones Cívicas Rápidas */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 43, 127, 0.3) 0%, rgba(0, 20, 137, 0.2) 100%)',
            border: '1px solid rgba(121, 166, 255, 0.25)',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              ¿Desea solicitar una audiencia ante el Concejo Municipal?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#CBD5E1', margin: '0.25rem 0 0 0' }}>
              Los ciudadanos debidamente verificados pueden someter peticiones cívicas formales al gobierno local.
            </p>
          </div>
          <a href="/gobernanza/audiencia" style={{ textDecoration: 'none' }}>
            <CivicButton variant="provincial" leftIcon={<ExternalLink size={16} />}>
              Solicitar Audiencia Municipal
            </CivicButton>
          </a>
        </div>

        {/* Conmutador de Pestañas (Actas vs Organigrama) */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '1.75rem'
          }}
          role="tablist"
          aria-label="Secciones de Gobernanza"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'actas'}
            onClick={() => setTabActiva('actas')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: tabActiva === 'actas' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: tabActiva === 'actas' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={18} />
            <span>Actas y Acuerdos Municipales</span>
            <CivicBadge variant="default" size="sm">
              {actas.length}
            </CivicBadge>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'organigrama'}
            onClick={() => setTabActiva('organigrama')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: tabActiva === 'organigrama' ? '2.5px solid var(--color-provincial-primary, #002B7F)' : '2.5px solid transparent',
              color: tabActiva === 'organigrama' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={18} />
            <span>Organigrama Institucional</span>
          </button>
        </div>

        {/* Contenido de la Pestaña Activa */}
        {tabActiva === 'actas' ? (
          <section aria-label="Tabla de Actas Municipales">
            <TablaActas actas={actas} />
          </section>
        ) : (
          <section aria-label="Organigrama Municipal">
            <OrganigramaMunicipal raiz={organigrama} />
          </section>
        )}
      </main>
    </div>
  );
};

export default GobernanzaPage;
