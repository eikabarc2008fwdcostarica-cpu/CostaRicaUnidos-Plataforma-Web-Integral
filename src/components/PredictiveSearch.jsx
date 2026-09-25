import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CANTONES_OFICIALES, PROVINCIAS_DATA, SERVICIOS_CIVICOS } from '../data/costaRicaTerritorialData';

export default function PredictiveSearch({ onSelectResult }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [results, setResults] = useState([]);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // 1. Debounce exacto de 300 ms según especificación técnica
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // 2. Filtrar resultados predictivos cuando debouncedQuery cambia
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    const q = debouncedQuery.toLowerCase();

    // Buscar en Provincias
    const provHits = PROVINCIAS_DATA.filter(
      p => p.nombre.toLowerCase().includes(q) || p.cabecera.toLowerCase().includes(q)
    ).map(p => ({
      type: 'provincia',
      id: p.id,
      provinciaId: p.id,
      titulo: `Provincia de ${p.nombre}`,
      subtitulo: `${p.cantonesCount} cantones • Cabecera: ${p.cabecera}`,
      badge: 'PROVINCIA',
      color: p.color
    }));

    // Buscar en los 84 Cantones
    const cantonHits = CANTONES_OFICIALES.filter(
      c => c.nombre.toLowerCase().includes(q) || c.cabecera.toLowerCase().includes(q)
    ).map(c => {
      const prov = PROVINCIAS_DATA.find(p => p.id === c.provinciaId);
      return {
        type: 'canton',
        id: `${c.provinciaId}-${c.id}`,
        provinciaId: c.provinciaId,
        cantonId: c.id,
        titulo: `Cantón de ${c.nombre}`,
        subtitulo: `Provincia: ${prov ? prov.nombre : ''} • Código DTA: ${c.codigoDta}`,
        badge: 'CANTÓN',
        color: prov ? prov.color : '#002B7F'
      };
    });

    // Buscar en Servicios Cívicos y Trámites
    const serviceHits = SERVICIOS_CIVICOS.filter(
      s => s.titulo.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q) || s.badge.toLowerCase().includes(q)
    ).map(s => ({
      type: 'servicio',
      id: s.id,
      titulo: s.titulo,
      subtitulo: s.descripcion,
      badge: s.badge,
      ruta: s.ruta,
      color: '#00D166'
    }));

    const combined = [...provHits, ...cantonHits.slice(0, 7), ...serviceHits.slice(0, 4)];
    setResults(combined);
    setIsOpen(combined.length > 0);
    setHighlightedIndex(-1);
  }, [debouncedQuery]);

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejo de teclado accesible
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        selectItem(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const selectItem = (item) => {
    setIsOpen(false);
    setSearchTerm('');

    if (item.type === 'canton' || item.type === 'provincia') {
      if (onSelectResult) {
        onSelectResult(item);
      }
    } else if (item.type === 'servicio' && item.ruta) {
      navigate(item.ruta);
    }
  };

  // Función para resaltar el término buscado
  const renderHighlighted = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="search-highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto 2.5rem'
      }}
    >
      {/* Input de Búsqueda Predictiva */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-owns="lista-predicciones-civicas"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 10, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0, 4, 13, 0.6), 0 0 15px rgba(0, 43, 127, 0.25)',
          transition: 'all 0.25s ease'
        }}
      >
        <span
          style={{
            paddingLeft: '1.25rem',
            fontSize: '1.25rem',
            color: '#79a6ff',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-hidden="true"
        >
          🔍
        </span>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => debouncedQuery.length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Búsqueda predictiva: Escriba un cantón (ej. San Carlos, Escazú), provincia o servicio..."
          aria-label="Buscar en los 84 cantones, provincias y trámites cívicos"
          aria-autocomplete="list"
          aria-controls="lista-predicciones-civicas"
          style={{
            width: '100%',
            padding: '1.1rem 1rem',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontFamily: 'var(--font-main)',
            fontSize: '1rem',
            fontWeight: 500
          }}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label="Borrar búsqueda"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}

        <div style={{ paddingRight: '1.25rem' }}>
          <span
            className="telemetry-badge"
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.55rem',
              backgroundColor: 'rgba(0, 43, 127, 0.5)'
            }}
          >
            300ms DEBOUNCE
          </span>
        </div>
      </div>

      {/* Menú Desplegable Predictivo */}
      {isOpen && results.length > 0 && (
        <ul
          id="lista-predicciones-civicas"
          role="listbox"
          aria-label="Resultados de la búsqueda predictiva"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 8, 26, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 15px 40px rgba(0, 4, 13, 0.8), 0 0 20px rgba(0, 43, 127, 0.4)',
            listStyle: 'none',
            padding: '0.6rem',
            maxHeight: '380px',
            overflowY: 'auto'
          }}
        >
          {results.map((item, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <li
                key={item.id}
                role="option"
                aria-selected={isHighlighted}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => selectItem(item)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: isHighlighted ? 'rgba(0, 43, 127, 0.45)' : 'transparent',
                  border: isHighlighted ? '1px solid rgba(121, 166, 255, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {item.type === 'provincia' ? '🗺️' : item.type === 'canton' ? '🏛️' : '📋'}
                  </span>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem' }}>
                      {renderHighlighted(item.titulo, debouncedQuery)}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {item.subtitulo}
                    </div>
                  </div>
                </div>

                <span
                  className="telemetry-badge"
                  style={{
                    borderColor: item.color || '#79a6ff',
                    color: item.color || '#79a6ff',
                    fontSize: '0.68rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {item.badge}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
