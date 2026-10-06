/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO DE ORGANIGRAMA DE DEPENDENCIAS MUNICIPALES
 * Arquitectura: Sovereign Civic Glass v2.1
 * Estructura Jerárquica: MIDEPLAN y Código Municipal
 * ============================================================================
 */
import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  Building2,
  Users,
  ShieldCheck,
  Award,
  Shield,
  Building,
  User,
  Search,
  ChevronRight
} from 'lucide-react';
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../../../data/costaRicaTerritorialData';
import { getOrganigramaCanton } from '../../../data/gobernanzaData';
import { OrganigramaMunicipal } from '../../gobernanza/OrganigramaMunicipal';

export default function OrganigramaModule({
  provincia = 'Puntarenas',
  canton = null,
  onNavigateModule = null
}) {
  // Resolver provincia activa
  const provinciaObj = useMemo(() => {
    const raw = typeof provincia === 'object' && provincia !== null ? provincia.nombre || provincia.id : provincia;
    const str = String(raw || 'Puntarenas').toLowerCase().trim();
    return (
      PROVINCIAS_DATA.find(
        (p) => p.nombre.toLowerCase() === str || String(p.id) === str || p.codigo.toLowerCase() === str
      ) || PROVINCIAS_DATA[0]
    );
  }, [provincia]);

  // Cantones de la provincia
  const cantones = useMemo(() => {
    return CANTONES_OFICIALES.filter((c) => c.provinciaId === provinciaObj.id);
  }, [provinciaObj.id]);

  // Cantón seleccionado sincronizado con la sesión
  const resolveCantonId = () => {
    try {
      const target = canton || localStorage.getItem('cr_canton_activo');
      if (target) {
        const found = cantones.find((c) => c.nombre.toLowerCase() === String(target).toLowerCase());
        if (found) return found.id;
      }
    } catch {}
    return cantones.length > 0 ? cantones[0].id : 1;
  };

  const [selectedCantonId, setSelectedCantonId] = useState(resolveCantonId);

  useEffect(() => {
    setSelectedCantonId(resolveCantonId());
  }, [cantones, canton]);

  useEffect(() => {
    const handleCantonChange = (e) => {
      const nombre = e.detail?.nombre;
      if (nombre) {
        const match = cantones.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
        if (match && match.id !== selectedCantonId) {
          setSelectedCantonId(match.id);
        }
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, [cantones, selectedCantonId]);

  const handleSelectCanton = (cId) => {
    setSelectedCantonId(cId);
    const c = cantones.find((item) => item.id === cId);
    if (c) {
      try {
        localStorage.setItem('cr_canton_activo', c.nombre);
      } catch {}
      window.dispatchEvent(
        new CustomEvent('cantonChanged', {
          detail: {
            nombre: c.nombre,
            id: c.id,
            provinciaId: c.provinciaId,
            codigoDta: c.codigoDta,
            cabecera: c.cabecera
          }
        })
      );
    }
  };

  const cantonActual = useMemo(() => {
    return cantones.find((c) => c.id === selectedCantonId) || cantones[0] || {
      id: 1,
      nombre: provinciaObj.nombre,
      codigoDta: `${provinciaObj.id}01`,
      cabecera: provinciaObj.cabecera
    };
  }, [cantones, selectedCantonId, provinciaObj]);

  // Raíz del organigrama
  const organigrama = useMemo(() => {
    return getOrganigramaCanton(cantonActual.id);
  }, [cantonActual.id]);

  return (
    <div
      id="modulo-organigrama-dependencias"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        animation: 'fadeInModule 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <style>{`
        @keyframes fadeInModule {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* =================================================================== */}
      {/* 1. ENCABEZADO INSTITUCIONAL DE LA ESTRUCTURA ORGÁNICA              */}
      {/* =================================================================== */}
      <section
        style={{
          backgroundColor: 'rgba(5, 12, 28, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '2rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 4, 13, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #7C3AED 0%, #38BDF8 50%, #10B981 100%)'
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', maxWidth: '820px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                backgroundColor: 'rgba(124, 58, 237, 0.15)',
                border: '1.5px solid rgba(167, 139, 250, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
                flexShrink: 0
              }}
            >
              <Layers size={34} color="#A78BFA" />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '0.45rem',
                  flexWrap: 'wrap'
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(167, 139, 250, 0.15)',
                    color: '#A78BFA',
                    border: '1px solid rgba(167, 139, 250, 0.3)'
                  }}
                >
                  ESTRUCTURA ADMINISTRATIVA
                </span>
                <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>
                  PROVINCIA DE {provinciaObj.nombre.toUpperCase()} • CANTÓN {cantonActual.nombre.toUpperCase()}
                </span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ fontSize: '0.76rem', color: '#38BDF8', fontWeight: 700 }}>
                  CABECERA: {cantonActual.cabecera.toUpperCase()}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Mistical Spring', Georgia, serif",
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.2
                }}
              >
                Organigrama de Dependencias de {cantonActual.nombre}
              </h1>

              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#CBD5E1',
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: '720px'
                }}
              >
                Estructura orgánica, líneas jerárquicas y manual de puestos oficial. Desglose funcional desde el Concejo Municipal y Alcaldía hasta las dependencias operativas y sociales.
              </p>
            </div>
          </div>

          {/* Selector de Cantón */}
          <div
            style={{
              backgroundColor: 'rgba(0, 4, 13, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.1rem 1.35rem',
              minWidth: '260px'
            }}
          >
            <label
              htmlFor="canton-organigrama-select"
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: '#94A3B8',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}
            >
              Seleccionar Municipalidad:
            </label>
            <select
              id="canton-organigrama-select"
              value={selectedCantonId}
              onChange={(e) => handleSelectCanton(Number(e.target.value))}
              style={{
                width: '100%',
                backgroundColor: 'rgba(5, 12, 28, 0.95)',
                color: '#FFFFFF',
                border: '1px solid rgba(167, 139, 250, 0.4)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {cantones.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} (Cantón {c.codigoDta})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leyenda de Categorías de Nivel Jerárquico */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
            Niveles Jerárquicos:
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#CBD5E1' }}>
            <Award size={14} color="#FFC700" />
            <span>Deliberativo (Concejo)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#CBD5E1' }}>
            <Building size={14} color="#7DD3FC" />
            <span>Ejecutivo (Alcaldía)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#CBD5E1' }}>
            <Shield size={14} color="#F87171" />
            <span>Fiscalización (Auditoría)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#CBD5E1' }}>
            <Layers size={14} color="#34D399" />
            <span>Operativo (Obras y Catastro)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#CBD5E1' }}>
            <User size={14} color="#C084FC" />
            <span>Social y Comunal</span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. ÁRBOL JERÁRQUICO INTERACTIVO (OrganigramaMunicipal)              */}
      {/* =================================================================== */}
      <section aria-label="Estructura Orgánica Municipal">
        <OrganigramaMunicipal raiz={organigrama} />
      </section>
    </div>
  );
}
