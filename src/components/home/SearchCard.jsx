import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, CreditCard, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CANTONES_OFICIALES } from '../../data/costaRicaTerritorialData';

/**
 * SearchCard — Tarjeta Flotante sobre el Hero
 * Buscador omnicanal (trámites, actas de concejo, cantones, averías viales)
 * con botones directos "Pagos en línea" y "Consulta o queja".
 */
export default function SearchCard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sugerencias categorizadas oficiales
  const sugerenciasOficiales = [
    {
      categoria: t('sugTramites', 'Trámites & Pagos'),
      items: [
        { label: 'Validación de Cédula y Situación Tributaria (ATV)', path: '/portal-ciudadano' },
        { label: 'Consulta de Patentes Comerciales y Pago Municipal', path: '/portal-ciudadano' },
        { label: 'Declaración de Bienes Inmuebles y Tasas', path: '/portal-ciudadano' }
      ]
    },
    {
      categoria: t('sugGobierno', 'Concejo & Actas'),
      items: [
        { label: 'Visor Oficial de Actas Municipales en PDF', path: '/gobernanza' },
        { label: 'Directorio de Alcaldía, Regidores y Síndicos', path: '/gobernanza' },
        { label: 'Presupuesto Participativo y Votación Ciudadana', path: '/participacion' }
      ]
    },
    {
      categoria: t('sugInfra', 'Obras & Reportes Viales'),
      items: [
        { label: 'Reportar hueco vial o bacheo prioritario', path: '/reportar-incidencia' },
        { label: 'Reporte de alumbrado público o luminaria dañada', path: '/reportar-incidencia' },
        { label: 'Fiscalización comunal de contratos MOPT/SICOP', path: '/portal-ciudadano' }
      ]
    },
    {
      categoria: t('sugCultura', 'Territorio & Comercios'),
      items: [
        { label: 'Visor Cartográfico 3D y Geoportal GIS', path: '/mapa-gis' },
        { label: 'Directorio de Comercios y PYMES Locales', path: '/comercio' },
        { label: 'Red de Auxilio Inmediato 911 / CNE', path: '/seguridad-emergencias' }
      ]
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const queryLower = searchQuery.toLowerCase();
    if (queryLower.includes('tramit') || queryLower.includes('cedula') || queryLower.includes('hacienda') || queryLower.includes('patente') || queryLower.includes('pago')) {
      navigate('/portal-ciudadano');
    } else if (queryLower.includes('acta') || queryLower.includes('concejo') || queryLower.includes('alcald') || queryLower.includes('regidor')) {
      navigate('/gobernanza');
    } else if (queryLower.includes('report') || queryLower.includes('hueco') || queryLower.includes('averia') || queryLower.includes('calle') || queryLower.includes('queja')) {
      navigate('/reportar-incidencia');
    } else if (queryLower.includes('comercio') || queryLower.includes('feria') || queryLower.includes('pyme')) {
      navigate('/comercio');
    } else if (queryLower.includes('mapa') || queryLower.includes('gis') || queryLower.includes('3d')) {
      navigate('/mapa-gis');
    } else if (queryLower.includes('emergen') || queryLower.includes('911') || queryLower.includes('cne')) {
      navigate('/seguridad-emergencias');
    } else {
      // Búsqueda por coincidencia de cantón
      const cantonMatch = CANTONES_OFICIALES.find((c) => c.nombre.toLowerCase().includes(queryLower));
      if (cantonMatch) {
        try {
          localStorage.setItem('cr_canton_activo', cantonMatch.nombre);
          window.dispatchEvent(new CustomEvent('cantonChanged', { detail: cantonMatch }));
        } catch {
          // ignore
        }
        navigate('/gobernanza');
      } else {
        navigate('/portal-ciudadano');
      }
    }
  };

  return (
    <div
      className="reveal-on-scroll"
      style={{
        position: 'relative',
        zIndex: 20,
        maxWidth: '1180px',
        margin: '-52px auto 3rem',
        padding: '0 1.25rem',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--cru-card-bg)',
          borderRadius: 'var(--radius-card, 24px)',
          boxShadow: 'var(--cru-card-shadow, 0 16px 45px rgba(6, 42, 119, 0.12))',
          border: '1px solid var(--cru-border)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          position: 'relative'
        }}
      >
        {/* Formulario Buscador Omnicanal */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: '1 1 380px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--cru-surface-muted)',
            borderRadius: '999px',
            padding: '0.4rem 0.5rem 0.4rem 1.25rem',
            border: '1.5px solid var(--cru-border)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onFocus={() => setShowSuggestions(true)}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Buscar trámite, acta de concejo, cantón o reporte vial..."
            aria-label="Buscar trámite, acta de concejo, cantón o reporte vial"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.94rem',
              color: 'var(--cru-text)',
              fontFamily: 'inherit',
              minWidth: 0
            }}
          />
          <button
            type="submit"
            aria-label="Ejecutar búsqueda"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--red, #C22727)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(194, 39, 39, 0.35)',
              transition: 'transform 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Search size={18} strokeWidth={2.2} />
          </button>
        </form>

        {/* Botones Rápidos "Pagos en línea" y "Consulta o queja" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            flexShrink: 0
          }}
        >
          {/* Botón Rojo: Pagos en línea */}
          <button
            type="button"
            onClick={() => navigate('/portal-ciudadano')}
            style={{
              backgroundColor: 'var(--red, #C22727)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 6px 18px rgba(194, 39, 39, 0.28)',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.backgroundColor = '#AA1D1D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundColor = 'var(--red, #C22727)';
            }}
          >
            <CreditCard size={17} />
            <span>Pagos en línea</span>
          </button>

          {/* Botón Amarillo: Consulta o queja */}
          <button
            type="button"
            onClick={() => navigate('/reportar-incidencia')}
            style={{
              backgroundColor: 'var(--sun, #FFCA26)',
              color: 'var(--ink, #131313)',
              border: 'none',
              borderRadius: '999px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 6px 18px rgba(255, 202, 38, 0.35)',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.backgroundColor = '#F5BE1D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundColor = 'var(--sun, #FFCA26)';
            }}
          >
            <HelpCircle size={17} />
            <span>Consulta o queja</span>
          </button>
        </div>

        {/* Menú de Sugerencias Flotante Adaptativo */}
        {showSuggestions && searchQuery.trim() && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: 0,
              right: 0,
              backgroundColor: 'var(--cru-card-bg)',
              borderRadius: '18px',
              padding: '1.25rem',
              boxShadow: 'var(--cru-card-shadow, 0 20px 50px rgba(0, 0, 0, 0.18))',
              border: '1px solid var(--cru-border)',
              zIndex: 50,
              maxHeight: '340px',
              overflowY: 'auto'
            }}
          >
            {sugerenciasOficiales.map((grupo, gIdx) => {
              const matches = grupo.items.filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (matches.length === 0) return null;

              return (
                <div key={gIdx} style={{ marginBottom: '0.85rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--cru-accent-blue)',
                      display: 'block',
                      padding: '0.2rem 0.5rem',
                      marginBottom: '0.35rem'
                    }}
                  >
                    {grupo.categoria}
                  </span>
                  {matches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setShowSuggestions(false);
                        navigate(item.path);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '10px',
                        color: 'var(--cru-text)',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--cru-surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={15} color="var(--cru-accent-blue)" />
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
