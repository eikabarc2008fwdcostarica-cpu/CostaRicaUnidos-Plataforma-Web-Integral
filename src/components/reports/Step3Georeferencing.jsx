import React, { useState, useEffect, useRef } from 'react';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../../data/costaRicaTerritorialData';
import { getProvincias, getCantones, getDistritos } from '../../services/ubicacionesService';
import { GEOFENCING_COSTA_RICA } from '../gis/darkMapStyles';

// Coordenadas aproximadas de cabeceras cantonales para Georreferenciación Inversa Matemática en Cliente
const COORDENADAS_CANTONES = [
  { provinciaId: 1, cantonId: 1, nombre: 'San José', lat: 9.9333, lng: -84.0833 },
  { provinciaId: 1, cantonId: 2, nombre: 'Escazú', lat: 9.9190, lng: -84.1400 },
  { provinciaId: 1, cantonId: 3, nombre: 'Desamparados', lat: 9.8980, lng: -84.0680 },
  { provinciaId: 1, cantonId: 4, nombre: 'Puriscal', lat: 9.8450, lng: -84.3120 },
  { provinciaId: 1, cantonId: 9, nombre: 'Santa Ana', lat: 9.9324, lng: -84.1825 },
  { provinciaId: 1, cantonId: 13, nombre: 'Tibás', lat: 9.9570, lng: -84.0820 },
  { provinciaId: 1, cantonId: 19, nombre: 'Pérez Zeledón', lat: 9.3730, lng: -83.7050 },
  { provinciaId: 2, cantonId: 1, nombre: 'Alajuela', lat: 10.0160, lng: -84.2140 },
  { provinciaId: 2, cantonId: 2, nombre: 'San Ramón', lat: 10.0880, lng: -84.4700 },
  { provinciaId: 2, cantonId: 3, nombre: 'Grecia', lat: 10.0740, lng: -84.3120 },
  { provinciaId: 2, cantonId: 10, nombre: 'San Carlos', lat: 10.3238, lng: -84.4294 },
  { provinciaId: 2, cantonId: 16, nombre: 'Río Cuarto', lat: 10.3450, lng: -84.2180 },
  { provinciaId: 3, cantonId: 1, nombre: 'Cartago', lat: 9.8640, lng: -83.9190 },
  { provinciaId: 3, cantonId: 2, nombre: 'Paraíso', lat: 9.8390, lng: -83.8670 },
  { provinciaId: 3, cantonId: 3, nombre: 'La Unión', lat: 9.9050, lng: -83.9870 },
  { provinciaId: 3, cantonId: 5, nombre: 'Turrialba', lat: 9.9040, lng: -83.6830 },
  { provinciaId: 4, cantonId: 1, nombre: 'Heredia', lat: 9.9980, lng: -84.1170 },
  { provinciaId: 4, cantonId: 7, nombre: 'Belén', lat: 9.9810, lng: -84.1870 },
  { provinciaId: 4, cantonId: 10, nombre: 'Sarapiquí', lat: 10.4500, lng: -84.0150 },
  { provinciaId: 5, cantonId: 1, nombre: 'Liberia', lat: 10.6300, lng: -85.4380 },
  { provinciaId: 5, cantonId: 2, nombre: 'Nicoya', lat: 10.1440, lng: -85.4520 },
  { provinciaId: 5, cantonId: 3, nombre: 'Santa Cruz', lat: 10.2620, lng: -85.5860 },
  { provinciaId: 6, cantonId: 1, nombre: 'Puntarenas', lat: 9.9760, lng: -84.8320 },
  { provinciaId: 6, cantonId: 2, nombre: 'Esparza', lat: 9.9942, lng: -84.6685 },
  { provinciaId: 6, cantonId: 6, nombre: 'Quepos', lat: 9.4320, lng: -84.1610 },
  { provinciaId: 6, cantonId: 11, nombre: 'Garabito', lat: 9.6150, lng: -84.6290 },
  { provinciaId: 6, cantonId: 12, nombre: 'Monteverde', lat: 10.3160, lng: -84.8250 },
  { provinciaId: 6, cantonId: 13, nombre: 'Puerto Jiménez', lat: 8.5360, lng: -83.3080 },
  { provinciaId: 7, cantonId: 1, nombre: 'Limón', lat: 9.9930, lng: -83.0330 },
  { provinciaId: 7, cantonId: 2, nombre: 'Pococí', lat: 10.2160, lng: -83.7910 },
  { provinciaId: 7, cantonId: 3, nombre: 'Siquirres', lat: 10.0980, lng: -83.5080 },
  { provinciaId: 7, cantonId: 4, nombre: 'Talamanca', lat: 9.6280, lng: -82.8430 }
];

export default function Step3Georeferencing({
  coordenadas = { lat: 9.9333, lng: -84.0833 },
  onCoordenadasChange,
  provinciaId,
  onProvinciaChange,
  cantonId,
  onCantonChange,
  distritoId,
  onDistritoChange
}) {
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [reverseGeocodingNotice, setReverseGeocodingNotice] = useState(null);
  const mapContainerRef = useRef(null);

  // 1. Cargar Provincias
  useEffect(() => {
    async function loadProv() {
      const res = await getProvincias();
      setProvincias(res.data);
    }
    loadProv();
  }, []);

  // 2. Cargar Cantones cuando cambia la provincia
  useEffect(() => {
    async function loadCant() {
      if (provinciaId) {
        const res = await getCantones(provinciaId);
        setCantones(res.data);
      } else {
        setCantones([]);
      }
    }
    loadCant();
  }, [provinciaId]);

  // 3. Cargar Distritos cuando cambia el cantón
  useEffect(() => {
    async function loadDist() {
      if (provinciaId && cantonId) {
        const res = await getDistritos(provinciaId, cantonId);
        setDistritos(res.data);
      } else {
        setDistritos([]);
      }
    }
    loadDist();
  }, [provinciaId, cantonId]);

  // 4. Georreferenciación Inversa Automática basada en Coordenadas
  const ejecutarGeorreferenciacionInversa = async (lat, lng) => {
    let cantonCercano = null;
    let menorDistancia = Infinity;

    COORDENADAS_CANTONES.forEach((c) => {
      const dLat = c.lat - lat;
      const dLng = c.lng - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        cantonCercano = c;
      }
    });

    if (cantonCercano) {
      onProvinciaChange(cantonCercano.provinciaId);
      onCantonChange(cantonCercano.cantonId);
      onDistritoChange(1); // Primer distrito (Cabecera) por defecto

      const provObj = PROVINCIAS_DATA.find((p) => p.id === cantonCercano.provinciaId);
      setReverseGeocodingNotice(
        `Ubicación detectada: ${cantonCercano.nombre}, ${provObj ? provObj.nombre : ''}`
      );
    }
  };

  // 5. Botón GPS "Mi Ubicación Actual"
  const handleUsarGps = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no es compatible con su dispositivo.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Validar que esté dentro de Costa Rica
        if (
          lat < GEOFENCING_COSTA_RICA.south ||
          lat > GEOFENCING_COSTA_RICA.north ||
          lng < GEOFENCING_COSTA_RICA.west ||
          lng > GEOFENCING_COSTA_RICA.east
        ) {
          alert('Su señal GPS indica una ubicación fuera del territorio nacional de Costa Rica.');
          return;
        }

        const nuevasCoords = { lat, lng };
        onCoordenadasChange(nuevasCoords);
        ejecutarGeorreferenciacionInversa(lat, lng);
      },
      (err) => {
        setIsLocating(false);
        console.warn('[GPS]', err);
        alert('No se pudo obtener la posición GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // 6. Clic interactivo en el Mini-Mapa para fijar el Pin
  const handleMapClick = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convertir x, y porcentual a Lat/Lng aproximado sobre el cuadrante de Costa Rica
    const pctX = Math.min(Math.max(x / rect.width, 0), 1);
    const pctY = Math.min(Math.max(y / rect.height, 0), 1);

    const minLat = 8.03;
    const maxLat = 11.22;
    const minLng = -85.95;
    const maxLng = -82.55;

    const lng = minLng + pctX * (maxLng - minLng);
    const lat = maxLat - pctY * (maxLat - minLat);

    const nuevasCoords = {
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5))
    };

    onCoordenadasChange(nuevasCoords);
    ejecutarGeorreferenciacionInversa(lat, lng);
  };

  // Posición en porcentaje para el Pin del Mini-Mapa
  const pinX = ((coordenadas.lng - -85.95) / (-82.55 - -85.95)) * 100;
  const pinY = (1 - (coordenadas.lat - 8.03) / (11.22 - 8.03)) * 100;

  const cantonActualObj = cantones.find((c) => c.id === Number(cantonId));
  const provinciaActualObj = provincias.find((p) => p.id === Number(provinciaId));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.4)' }}>
          PASO 3 DE 4 &bull; GEORREFERENCIACIÓN Y TERRITORIO
        </span>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginTop: '0.6rem',
          marginBottom: '0.35rem'
        }}>
          Ubique la Avería en el Territorio Nacional
        </h3>
        <p style={{ color: '#CBD5E1', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto' }}>
          Toque el mapa para colocar el pin o active su GPS. El sistema determina automáticamente la provincia, cantón y distrito oficial DTA.
        </p>
      </div>

      {/* Mini-Mapa Interactivo con Pin Soberano */}
      <div className="civic-glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem', borderRadius: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
              Mini-Mapa Cartográfico de Ubicación
            </span>
            <span className="telemetry-badge" style={{ fontSize: '0.72rem' }}>
              COORDS: {coordenadas.lat.toFixed(4)}, {coordenadas.lng.toFixed(4)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleUsarGps}
            disabled={isLocating}
            className="btn-sovereign"
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            <span>{isLocating ? '⏳' : '📡'}</span>
            <span>{isLocating ? 'Capturando GPS...' : 'Usar Mi Ubicación GPS'}</span>
          </button>
        </div>

        {/* Lienzo del Mini-Mapa Interactivo */}
        <div
          ref={mapContainerRef}
          onClick={handleMapClick}
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            backgroundColor: '#000714',
            borderRadius: '14px',
            border: '1px solid rgba(121, 166, 255, 0.25)',
            overflow: 'hidden',
            cursor: 'crosshair',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 20, 80, 0.5) 0%, rgba(0, 4, 13, 0.95) 100%)',
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Cuadrícula de coordenadas */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(121, 166, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(121, 166, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          {/* Rótulos geográficos indicativos */}
          <div style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '0.75rem', color: '#5588DD', fontFamily: 'var(--font-telemetry)' }}>
            OCÉANO PACÍFICO
          </div>
          <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '0.75rem', color: '#5588DD', fontFamily: 'var(--font-telemetry)' }}>
            MAR CARIBE
          </div>

          {/* Pin interactivo soberano con resplandor */}
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(Math.max(pinX, 5), 95)}%`,
              top: `${Math.min(Math.max(pinY, 5), 95)}%`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 30
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#DA291C',
              transform: 'rotate(-45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px #DA291C, 0 4px 10px rgba(0,0,0,0.5)',
              border: '2px solid #FFFFFF'
            }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: '0.9rem' }}>⚠️</span>
            </div>
            <div style={{
              width: '10px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              marginTop: '2px',
              filter: 'blur(1px)'
            }} />
          </div>

          {/* Mensaje de ayuda sobre el mapa */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            backgroundColor: 'rgba(0, 4, 13, 0.8)',
            padding: '0.25rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.72rem',
            color: '#CBD5E1',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            👆 Toque cualquier punto para fijar la avería
          </div>
        </div>

        {/* Notificación de Georreferenciación Inversa */}
        {reverseGeocodingNotice && (
          <div style={{
            marginTop: '0.85rem',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 209, 102, 0.12)',
            border: '1px solid rgba(0, 209, 102, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: '#00D166'
          }}>
            <span>⚡</span>
            <span><strong>Georreferenciación inversa aplicada:</strong> {reverseGeocodingNotice}</span>
          </div>
        )}
      </div>

      {/* Cascada de Confirmación y Ajuste Fino DTA */}
      <div
        className="civic-glass-card"
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          backgroundColor: 'rgba(0, 15, 45, 0.6)'
        }}
      >
        <h4 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>División Territorial Administrativa (DTA Oficial)</span>
          {provinciaActualObj && cantonActualObj && (
            <span className="telemetry-badge" style={{ backgroundColor: 'rgba(0, 43, 127, 0.5)' }}>
              CÓDIGO: {provinciaActualObj.id}{String(cantonActualObj.id).padStart(2, '0')}{String(distritoId || '01').padStart(2, '0')}
            </span>
          )}
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          {/* Selector Provincia */}
          <div>
            <label
              htmlFor="step3-provincia"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}
            >
              1. Provincia
            </label>
            <select
              id="step3-provincia"
              className="civic-select"
              value={provinciaId || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || '';
                onProvinciaChange(val);
                onCantonChange('');
                onDistritoChange('');
              }}
            >
              <option value="">-- Seleccionar Provincia --</option>
              {provincias.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}. {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector Cantón */}
          <div>
            <label
              htmlFor="step3-canton"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}
            >
              2. Cantón
            </label>
            <select
              id="step3-canton"
              className="civic-select"
              value={cantonId || ''}
              disabled={!provinciaId}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || '';
                onCantonChange(val);
                onDistritoChange('');
              }}
            >
              <option value="">{provinciaId ? '-- Seleccionar Cantón --' : 'Primero elija provincia'}</option>
              {cantones.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector Distrito */}
          <div>
            <label
              htmlFor="step3-distrito"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}
            >
              3. Distrito
            </label>
            <select
              id="step3-distrito"
              className="civic-select"
              value={distritoId || ''}
              disabled={!cantonId}
              onChange={(e) => onDistritoChange(parseInt(e.target.value, 10) || '')}
            >
              <option value="">{cantonId ? '-- Seleccionar Distrito --' : 'Primero elija cantón'}</option>
              {distritos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
