import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Radio, Loader2, AlertTriangle, Crosshair, Zap, Navigation } from 'lucide-react';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../../data/costaRicaTerritorialData';
import { getProvincias, getCantones, getDistritos } from '../../services/ubicacionesService';
import { GEOFENCING_COSTA_RICA } from '../gis/darkMapStyles';
import { useCivicModal } from '../../context/CivicModalContext';

// Coordenadas aproximadas de cabeceras cantonales para Georreferenciación Inversa
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
  const { mostrarAlerta } = useCivicModal();
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [reverseGeocodingNotice, setReverseGeocodingNotice] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

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

  // 4. Georreferenciación Inversa basada en Coordenadas
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

  // 5. Inicialización del Mini-Mapa Real de Costa Rica (Leaflet + Esri Dark Gray)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = coordenadas?.lat || 9.9333;
    const initialLng = coordenadas?.lng || -84.0833;

    // Crear mapa real
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      minZoom: 7,
      maxZoom: 18,
      maxBounds: [
        [7.5, -86.5],
        [11.5, -82.0]
      ],
      zoomControl: true,
      attributionControl: false
    });

    // Tiles Esri Dark Gray Base de alta precisión
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18 }
    ).addTo(map);

    // Capa de nombres de calles, cantones y referencias viales
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18 }
    ).addTo(map);

    // Icono de Pin Cívico Soberano Arrastrable
    const pinIcon = L.divIcon({
      className: 'custom-report-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%); cursor: grab;">
          <div style="position: absolute; width: 26px; height: 26px; background-color: #DA291C; border: 2.5px solid #FFFFFF; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 0 16px rgba(218, 41, 28, 0.9), 0 4px 10px rgba(0,0,0,0.6);"></div>
          <div style="position: absolute; width: 9px; height: 9px; background-color: #FFFFFF; border-radius: 50%; top: 7px;"></div>
          <div style="position: absolute; bottom: -4px; width: 10px; height: 5px; background: rgba(0,0,0,0.5); border-radius: 50%; filter: blur(1px);"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: pinIcon,
      draggable: true
    }).addTo(map);

    // Clic en el mapa para colocar el pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      const nuevasCoords = {
        lat: parseFloat(lat.toFixed(5)),
        lng: parseFloat(lng.toFixed(5))
      };
      onCoordenadasChange(nuevasCoords);
      ejecutarGeorreferenciacionInversa(lat, lng);
    });

    // Evento de fin de arrastre del pin
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      const nuevasCoords = {
        lat: parseFloat(pos.lat.toFixed(5)),
        lng: parseFloat(pos.lng.toFixed(5))
      };
      onCoordenadasChange(nuevasCoords);
      ejecutarGeorreferenciacionInversa(pos.lat, pos.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // 6. Sincronizar el mapa cuando el usuario selecciona cantón en el dropdown
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    if (provinciaId && cantonId) {
      const match = COORDENADAS_CANTONES.find(
        (c) => c.provinciaId === Number(provinciaId) && c.cantonId === Number(cantonId)
      );
      if (match) {
        mapInstanceRef.current.flyTo([match.lat, match.lng], 13, { duration: 1.2 });
        markerRef.current.setLatLng([match.lat, match.lng]);
        onCoordenadasChange({ lat: match.lat, lng: match.lng });
      }
    }
  }, [provinciaId, cantonId]);

  // 7. Botón GPS "Mi Ubicación Actual"
  const handleUsarGps = () => {
    if (!navigator.geolocation) {
      mostrarAlerta({
        titulo: 'GPS No Compatible',
        mensaje: 'La geolocalización satelital no es compatible o no está habilitada en su dispositivo.',
        icono: 'advertencia'
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));

        // Validar límites de Costa Rica
        if (
          lat < GEOFENCING_COSTA_RICA.south ||
          lat > GEOFENCING_COSTA_RICA.north ||
          lng < GEOFENCING_COSTA_RICA.west ||
          lng > GEOFENCING_COSTA_RICA.east
        ) {
          mostrarAlerta({
            titulo: 'Ubicación Fuera de Jurisdicción',
            mensaje: 'Su señal GPS indica una ubicación fuera del territorio nacional de Costa Rica.',
            icono: 'advertencia'
          });
          return;
        }

        const nuevasCoords = { lat, lng };
        onCoordenadasChange(nuevasCoords);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.2 });
          markerRef.current.setLatLng([lat, lng]);
        }

        ejecutarGeorreferenciacionInversa(lat, lng);
      },
      (err) => {
        setIsLocating(false);
        console.warn('[GPS]', err);
        mostrarAlerta({
          titulo: 'Fallo de Geolocalización',
          mensaje: 'No se pudo obtener la posición satelital GPS: ' + err.message,
          icono: 'error'
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const cantonActualObj = cantones.find((c) => c.id === Number(cantonId));
  const provinciaActualObj = provincias.find((p) => p.id === Number(provinciaId));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <span
          className="telemetry-badge"
          style={{
            backgroundColor: 'var(--cru-accent-blue-bg)',
            color: 'var(--cru-accent-blue)',
            border: '1px solid var(--cru-accent-blue-border)',
            fontWeight: 700
          }}
        >
          PASO 3 DE 4 &bull; GEORREFERENCIACIÓN Y TERRITORIO
        </span>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--cru-text)',
          marginTop: '0.6rem',
          marginBottom: '0.35rem'
        }}>
          Ubique la Avería en el Territorio Nacional
        </h3>
        <p style={{ color: 'var(--cru-text-soft)', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto', fontWeight: 500 }}>
          Toque cualquier calle o cantón real en el mapa para colocar o arrastrar el pin, o active su GPS para fijar la posición automáticamente.
        </p>
      </div>

      {/* Mini-Mapa Cartográfico Real de Costa Rica */}
      <div
        style={{
          padding: '1.25rem',
          marginBottom: '1.75rem',
          borderRadius: '24px',
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1.5px solid rgba(6, 42, 119, 0.14)',
          boxShadow: '0 4px 16px rgba(6, 42, 119, 0.04)'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--cru-accent-blue)" />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--cru-text)' }}>
              Mapa Cartográfico Real de Costa Rica
            </span>
            <span
              className="telemetry-badge"
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--cru-accent-blue-bg)',
                color: 'var(--cru-accent-blue)',
                border: '1px solid var(--cru-accent-blue-border)',
                fontWeight: 600
              }}
            >
              LAT: {coordenadas.lat.toFixed(4)} &bull; LNG: {coordenadas.lng.toFixed(4)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleUsarGps}
            disabled={isLocating}
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--cru-accent-blue)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 700,
              cursor: isLocating ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(0, 83, 175, 0.25)'
            }}
          >
            {isLocating ? <Loader2 size={15} className="animate-spin" /> : <Radio size={15} />}
            <span>{isLocating ? 'Capturando GPS...' : 'Usar Mi Ubicación GPS'}</span>
          </button>
        </div>

        {/* Contenedor del Mapa Leaflet Real */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '350px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid #CBD5E1',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

          {/* Ayuda flotante inferior */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(6, 42, 119, 0.92)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            <Crosshair size={13} color="#93C5FD" />
            <span>Haga clic o arrastre el pin para fijar la avería</span>
          </div>
        </div>

        {/* Notificación de Georreferenciación Inversa */}
        {reverseGeocodingNotice && (
          <div style={{
            marginTop: '0.85rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            backgroundColor: 'var(--cru-accent-green-bg)',
            border: '1px solid var(--cru-accent-green-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.86rem',
            color: '#065F46',
            fontWeight: 600
          }}>
            <Zap size={15} color="var(--cru-accent-green)" />
            <span><strong>Ubicación Detectada Automáticamente:</strong> {reverseGeocodingNotice}</span>
          </div>
        )}
      </div>

      {/* Cascada de Confirmación y Ajuste Fino */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1.5px solid rgba(6, 42, 119, 0.14)',
          boxShadow: '0 4px 16px rgba(6, 42, 119, 0.04)'
        }}
      >
        <h4 style={{
          fontSize: '1.05rem',
          fontWeight: 800,
          color: 'var(--cru-text)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <span>División Territorial Administrativa Oficial</span>
          {provinciaActualObj && cantonActualObj && (
            <span
              className="telemetry-badge"
              style={{
                backgroundColor: 'var(--cru-accent-blue-bg)',
                color: 'var(--cru-accent-blue)',
                border: '1px solid var(--cru-accent-blue-border)',
                fontWeight: 700
              }}
            >
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
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}
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
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                backgroundColor: 'var(--cru-surface-card)',
                border: '1.5px solid #CBD5E1',
                borderRadius: '10px',
                color: 'var(--theme-text-primary)',
                fontSize: '0.9rem',
                fontWeight: 600
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
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}
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
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                backgroundColor: 'var(--cru-surface-card)',
                border: '1.5px solid #CBD5E1',
                borderRadius: '10px',
                color: 'var(--theme-text-primary)',
                fontSize: '0.9rem',
                fontWeight: 600
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
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}
            >
              3. Distrito
            </label>
            <select
              id="step3-distrito"
              className="civic-select"
              value={distritoId || ''}
              disabled={!cantonId}
              onChange={(e) => onDistritoChange(parseInt(e.target.value, 10) || '')}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                backgroundColor: 'var(--cru-surface-card)',
                border: '1.5px solid #CBD5E1',
                borderRadius: '10px',
                color: 'var(--theme-text-primary)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
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
