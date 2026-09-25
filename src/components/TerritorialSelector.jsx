import React, { useState, useEffect } from 'react';
import { getProvincias, getCantones, getDistritos } from '../services/ubicacionesService';

export default function TerritorialSelector({
  selectedProvinciaId,
  onProvinciaChange,
  selectedCantonId,
  onCantonChange,
  selectedDistritoId,
  onDistritoChange,
  onOpenDrawer
}) {
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingCantones, setLoadingCantones] = useState(false);
  const [loadingDistritos, setLoadingDistritos] = useState(false);

  const [dataSource, setDataSource] = useState('network'); // 'network' | 'cache' | 'fallback'

  // 1. Cargar Provincias al inicio
  useEffect(() => {
    let cancel = false;
    async function cargarProvincias() {
      setLoadingProvincias(true);
      const res = await getProvincias();
      if (!cancel) {
        setProvincias(res.data);
        if (res.source) setDataSource(res.source);
        setLoadingProvincias(false);
      }
    }
    cargarProvincias();
    return () => { cancel = true; };
  }, []);

  // 2. Cargar Cantones cuando cambie selectedProvinciaId
  useEffect(() => {
    let cancel = false;
    async function cargarCantones() {
      if (!selectedProvinciaId || selectedProvinciaId === 0) {
        setCantones([]);
        setDistritos([]);
        return;
      }
      setLoadingCantones(true);
      const res = await getCantones(selectedProvinciaId);
      if (!cancel) {
        setCantones(res.data);
        if (res.source) setDataSource(res.source);
        setLoadingCantones(false);
      }
    }
    cargarCantones();
    return () => { cancel = true; };
  }, [selectedProvinciaId]);

  // 3. Cargar Distritos cuando cambie selectedCantonId
  useEffect(() => {
    let cancel = false;
    async function cargarDistritos() {
      if (!selectedProvinciaId || !selectedCantonId) {
        setDistritos([]);
        return;
      }
      setLoadingDistritos(true);
      const res = await getDistritos(selectedProvinciaId, selectedCantonId);
      if (!cancel) {
        setDistritos(res.data);
        if (res.source) setDataSource(res.source);
        setLoadingDistritos(false);
      }
    }
    cargarDistritos();
    return () => { cancel = true; };
  }, [selectedProvinciaId, selectedCantonId]);

  const handleProvinciaSelect = (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    if (onProvinciaChange) onProvinciaChange(val);
    if (onCantonChange) onCantonChange('');
    if (onDistritoChange) onDistritoChange('');
  };

  const handleCantonSelect = (e) => {
    const val = parseInt(e.target.value, 10) || '';
    if (onCantonChange) onCantonChange(val);
    if (onDistritoChange) onDistritoChange('');
  };

  const handleDistritoSelect = (e) => {
    const val = parseInt(e.target.value, 10) || '';
    if (onDistritoChange) onDistritoChange(val);
  };

  // Encontrar nombres seleccionados para la ficha
  const provinciaObj = provincias.find(p => p.id === Number(selectedProvinciaId));
  const cantonObj = cantones.find(c => c.id === Number(selectedCantonId));
  const distritoObj = distritos.find(d => d.id === Number(selectedDistritoId));

  // Generar código DTA estimado
  const codigoDta = provinciaObj && cantonObj
    ? `${provinciaObj.id}${String(cantonObj.id).padStart(2, '0')}${distritoObj ? String(distritoObj.id).padStart(2, '0') : '00'}`
    : null;

  return (
    <section
      id="seccion-selector-territorial"
      aria-label="Selector Territorial en Cascada de Costa Rica"
      className="civic-glass-card provincial-glow-card"
      style={{
        padding: 'clamp(1.5rem, 3vw, 2.25rem)',
        marginBottom: '2.5rem',
        borderTop: '3px solid var(--color-provincial-primary)'
      }}
    >
      {/* Cabecera del Selector con Telemetría de Fuente de Datos */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📍</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>
              División Territorial en Cascada (DTA / INEC)
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
            Consumo en tiempo real de la API oficial con almacenamiento en caché offline y sincronización temática.
          </p>
        </div>

        {/* Indicador de Estado de Conectividad y Fuente de Datos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {dataSource === 'network' && (
            <span className="telemetry-badge" style={{ borderColor: '#00D166', color: '#00D166', backgroundColor: 'rgba(0, 209, 102, 0.15)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#00D166', display: 'inline-block' }}></span>
              API EN VIVO: ubicaciones.paginasweb.cr
            </span>
          )}
          {dataSource === 'cache' && (
            <span className="telemetry-badge" style={{ borderColor: '#FFC700', color: '#FFC700', backgroundColor: 'rgba(255, 199, 0, 0.15)' }}>
              ⚡ CACHÉ OFFLINE LOCAL
            </span>
          )}
          {dataSource === 'fallback' && (
            <span className="telemetry-badge" style={{ borderColor: '#79a6ff', color: '#79a6ff', backgroundColor: 'rgba(121, 166, 255, 0.15)' }}>
              📦 DATASET OFICIAL DE RESPALDO
            </span>
          )}
        </div>
      </div>

      {/* Cascada de 3 Selectores: Provincia -> Cantón -> Distrito */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* 1. Selector de Provincias */}
        <div>
          <label
            htmlFor="selector-provincia"
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#F8FAFC',
              marginBottom: '0.5rem'
            }}
          >
            1. Provincia ({provincias.length || 7} Provincias)
          </label>
          <select
            id="selector-provincia"
            className="civic-select"
            value={selectedProvinciaId || 0}
            onChange={handleProvinciaSelect}
            disabled={loadingProvincias}
            aria-busy={loadingProvincias}
          >
            <option value="0">-- Seleccione una Provincia --</option>
            {provincias.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.id}. {prov.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Selector de Cantones */}
        <div>
          <label
            htmlFor="selector-canton"
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#F8FAFC',
              marginBottom: '0.5rem'
            }}
          >
            2. Cantón {selectedProvinciaId ? `(${cantones.length} disponibles)` : ''}
          </label>
          <select
            id="selector-canton"
            className="civic-select"
            value={selectedCantonId || ''}
            onChange={handleCantonSelect}
            disabled={!selectedProvinciaId || selectedProvinciaId === 0 || loadingCantones}
            aria-busy={loadingCantones}
          >
            <option value="">
              {!selectedProvinciaId || selectedProvinciaId === 0
                ? 'Primero elija una provincia'
                : loadingCantones
                  ? 'Cargando cantones oficiales...'
                  : '-- Seleccione un Cantón --'}
            </option>
            {cantones.map((canton) => (
              <option key={canton.id} value={canton.id}>
                Cantón {canton.id}: {canton.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Selector de Distritos */}
        <div>
          <label
            htmlFor="selector-distrito"
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#F8FAFC',
              marginBottom: '0.5rem'
            }}
          >
            3. Distrito {selectedCantonId ? `(${distritos.length} disponibles)` : ''}
          </label>
          <select
            id="selector-distrito"
            className="civic-select"
            value={selectedDistritoId || ''}
            onChange={handleDistritoSelect}
            disabled={!selectedCantonId || loadingDistritos}
            aria-busy={loadingDistritos}
          >
            <option value="">
              {!selectedCantonId
                ? 'Primero elija un cantón'
                : loadingDistritos
                  ? 'Cargando distritos...'
                  : '-- Seleccione un Distrito --'}
            </option>
            {distritos.map((distrito) => (
              <option key={distrito.id} value={distrito.id}>
                Distrito {distrito.id}: {distrito.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ficha Territorial del Territorio Seleccionado */}
      {provinciaObj && (
        <div style={{
          backgroundColor: 'rgba(0, 10, 30, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>UBICACIÓN SELECCIONADA:</span>
              <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>
                {provinciaObj.nombre}
                {cantonObj ? ` › Cantón de ${cantonObj.nombre}` : ''}
                {distritoObj ? ` › Distrito ${distritoObj.nombre}` : ''}
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {codigoDta && (
                <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.4)' }}>
                  CÓDIGO DTA: {codigoDta}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                {cantonObj ? `Cantones totales en provincia: ${cantones.length}` : 'Seleccione cantón para profundizar'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                const mapEl = document.getElementById('seccion-mapa-svg');
                if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="btn-glass-secondary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
            >
              🗺️ Ver en Mapa SVG
            </button>

            <button
              type="button"
              onClick={() => onOpenDrawer && onOpenDrawer(provinciaObj.id)}
              className="btn-sovereign"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
            >
              📑 Abrir Ficha Cívica (Drawer)
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
