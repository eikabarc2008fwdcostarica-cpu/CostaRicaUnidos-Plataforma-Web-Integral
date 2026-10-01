import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search,
  Sparkles,
  Layers,
  Locate,
  Plus,
  Minus,
  RotateCcw,
  Check,
  Navigation,
  ExternalLink,
  MapPin,
  X
} from 'lucide-react';
import { GIS_LAYERS_CONFIG, GIS_POI_DATA } from './gisLayersData';
import { CENTRO_COSTA_RICA } from './darkMapStyles';
import { procesarConsultaSemantica } from '../../services/geoSemanticNlpService';
import { useCivicModal } from '../../context/CivicModalContext';

/**
 * MapaCartografico3D — Visor Cartográfico Real de Costa Rica (Leaflet + CartoDB Dark Matter)
 * Minimalismo Editorial Suizo • Sovereign Civic Glass
 * 100% Funcional • Sin rejillas falsas • Sin colisión con el lector de voz
 */
export default function MapaCartografico3D({
  onSelectLocation,
  initialQuery = '',
  height = '72vh'
}) {
  const { mostrarAlerta } = useCivicModal();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Estados de capas activas
  const [activeLayers, setActiveLayers] = useState({
    salud: true,
    educacion: true,
    transporte: true,
    recreativa: true,
    albergues: true
  });

  // Estados de interfaz y búsqueda
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchFeedback, setSearchFeedback] = useState(null);
  const [highlightedPoiId, setHighlightedPoiId] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Conteo de elementos activos por capa
  const layerCounts = useMemo(() => {
    return GIS_LAYERS_CONFIG.reduce((acc, layer) => {
      acc[layer.id] = GIS_POI_DATA.filter((p) => p.layer === layer.id).length;
      return acc;
    }, {});
  }, []);

  const activeLayersCount = useMemo(() => {
    return Object.values(activeLayers).filter(Boolean).length;
  }, [activeLayers]);

  // 1. Inicialización del Mapa de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Coordenadas de Costa Rica: 9.7489, -83.7534
      const map = L.map(mapContainerRef.current, {
        center: [CENTRO_COSTA_RICA.lat, CENTRO_COSTA_RICA.lng],
        zoom: 8,
        minZoom: 6,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Tiles Esri World Dark Gray Base (Gratuito, sin marcas de agua, Obsidian Canvas)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
      }).addTo(map);

      // Etiquetas y referencias cívicas de Esri
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);

      // Grupo de marcadores para control dinámico de capas
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersLayer;

      // Evento de clic en el mapa para capturar coordenadas
      map.on('click', (e) => {
        if (onSelectLocation) {
          onSelectLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Renderizado reactivo de marcadores según capas activas
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const poisToRender = GIS_POI_DATA.filter((poi) => activeLayers[poi.layer]);

    poisToRender.forEach((poi) => {
      const layerConfig = GIS_LAYERS_CONFIG.find((l) => l.id === poi.layer);
      const color = layerConfig ? layerConfig.color : '#00D166';
      const isHighlighted = poi.id === highlightedPoiId;

      const markerIcon = L.divIcon({
        className: 'custom-gis-pin',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="
              position: absolute;
              width: ${isHighlighted ? '18px' : '13px'};
              height: ${isHighlighted ? '18px' : '13px'};
              border-radius: 50%;
              background-color: ${color};
              border: 2px solid #FFFFFF;
              box-shadow: 0 0 ${isHighlighted ? '18px' : '8px'} ${color}, 0 2px 8px rgba(0,0,0,0.6);
              transition: all 0.25s ease;
            "></div>
            <div style="
              position: absolute;
              width: ${isHighlighted ? '32px' : '24px'};
              height: ${isHighlighted ? '32px' : '24px'};
              border-radius: 50%;
              background-color: ${color};
              opacity: ${isHighlighted ? '0.45' : '0.2'};
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: markerIcon });

      const wazeUrl = `https://waze.com/ul?ll=${poi.lat},${poi.lng}&navigate=yes`;
      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}`;
      const layerName = layerConfig ? layerConfig.nombre.split('(')[0].trim() : 'Punto Cívico';

      const popupContent = `
        <div style="padding: 1.25rem 1.4rem; min-width: 260px; max-width: 310px; color: #FFFFFF; font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.6rem;">
            <span style="
              font-size: 0.7rem;
              font-weight: 800;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: ${color};
              background-color: ${color}20;
              border: 1px solid ${color}45;
              padding: 0.15rem 0.6rem;
              border-radius: 9999px;
            ">
              ${layerName}
            </span>
            <span style="display: flex; align-items: center; gap: 4px; font-size: 0.68rem; color: #00D166; font-weight: 700;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #00D166; display: inline-block;"></span>
              ACTIVO
            </span>
          </div>

          <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0 0 0.35rem; color: #FFFFFF; line-height: 1.3;">
            ${poi.nombre}
          </h4>

          <p style="font-size: 0.8rem; color: #94A3B8; margin: 0 0 0.75rem;">
            ${poi.canton}, ${poi.provincia}
          </p>

          ${poi.descripcion ? `
            <p style="font-size: 0.78rem; color: #CBD5E1; line-height: 1.45; margin: 0 0 0.9rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.6rem;">
              ${poi.descripcion}
            </p>
          ` : ''}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem;">
            <a href="${wazeUrl}" target="_blank" rel="noopener noreferrer" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.35rem;
              padding: 0.45rem 0.6rem;
              border-radius: 8px;
              background: rgba(0, 43, 127, 0.75);
              border: 1px solid rgba(121, 166, 255, 0.4);
              color: #FFFFFF;
              text-decoration: none;
              font-size: 0.75rem;
              font-weight: 700;
              transition: background 0.2s;
            ">
              Waze <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
            <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.35rem;
              padding: 0.45rem 0.6rem;
              border-radius: 8px;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.16);
              color: #FFFFFF;
              text-decoration: none;
              font-size: 0.75rem;
              font-weight: 700;
              transition: background 0.2s;
            ">
              Google Maps <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'sovereign-glass-popup',
        closeButton: true
      });

      marker.on('click', () => {
        if (onSelectLocation) {
          onSelectLocation({ lat: poi.lat, lng: poi.lng, poi });
        }
      });

      marker.addTo(layerGroup);

      if (isHighlighted) {
        marker.openPopup();
      }
    });
  }, [activeLayers, highlightedPoiId, onSelectLocation]);

  // 3. Ejecución de Búsqueda Inteligente Semántica
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const queryLower = searchQuery.toLowerCase().trim();

    // Primero intentar con el motor semántico de lenguaje natural
    try {
      const nlp = procesarConsultaSemantica(queryLower);
      if (nlp && nlp.coordenadas) {
        map.flyTo([nlp.coordenadas.lat, nlp.coordenadas.lng], nlp.coordenadas.zoom || 12, {
          duration: 1.5
        });

        if (nlp.entidadesTematicas && nlp.entidadesTematicas.length > 0) {
          const newLayers = { ...activeLayers };
          nlp.entidadesTematicas.forEach((layerKey) => {
            if (newLayers[layerKey] !== undefined) newLayers[layerKey] = true;
          });
          setActiveLayers(newLayers);
        }

        if (nlp.poisFiltrados && nlp.poisFiltrados.length > 0) {
          setHighlightedPoiId(nlp.poisFiltrados[0].id);
        }

        setSearchFeedback(nlp.mensajeAsistente || `Ubicación encontrada en ${nlp.entidadGeografica || 'Costa Rica'}`);
        return;
      }
    } catch {
      // Continuar con búsqueda directa
    }

    // Búsqueda directa por coincidencia textual en puntos cívicos
    const match = GIS_POI_DATA.find(
      (p) =>
        p.nombre.toLowerCase().includes(queryLower) ||
        p.canton.toLowerCase().includes(queryLower) ||
        p.provincia.toLowerCase().includes(queryLower) ||
        p.categoria.toLowerCase().includes(queryLower)
    );

    if (match) {
      // Asegurar que la capa de ese punto esté activa
      setActiveLayers((prev) => ({ ...prev, [match.layer]: true }));
      setHighlightedPoiId(match.id);
      map.flyTo([match.lat, match.lng], 14, { duration: 1.5 });
      setSearchFeedback(`Punto localizado: ${match.nombre} (${match.canton})`);
      if (onSelectLocation) {
        onSelectLocation({ lat: match.lat, lng: match.lng, poi: match });
      }
    } else {
      setSearchFeedback('No se encontraron puntos exactos con ese término. Intente con cantón o servicio.');
    }
  };

  // 4. Ubicación actual del usuario (GPS)
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      mostrarAlerta({
        titulo: 'Geolocalización No Disponible',
        mensaje: 'La geolocalización satelital no se encuentra habilitada en este navegador o dispositivo.',
        icono: 'advertencia'
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;

        map.flyTo([latitude, longitude], 14, { duration: 1.6 });

        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        const userIcon = L.divIcon({
          className: 'custom-gis-pin',
          html: `
            <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
              <div style="width: 16px; height: 16px; border-radius: 50%; background-color: #00D166; border: 3px solid #FFFFFF; box-shadow: 0 0 16px #00D166;"></div>
              <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: #00D166; opacity: 0.3; animation: pulse 1.5s infinite;"></div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([latitude, longitude], { icon: userIcon })
          .bindPopup('<div style="padding: 0.6rem; color: #FFF; font-weight: 700;">Tu ubicación actual</div>')
          .addTo(map);

        userMarkerRef.current = marker;
        setIsLocating(false);

        if (onSelectLocation) {
          onSelectLocation({ lat: latitude, lng: longitude });
        }
      },
      () => {
        setIsLocating(false);
        mostrarAlerta({
          titulo: 'Error de Posicionamiento',
          mensaje: 'No fue posible obtener su ubicación satelital GPS. Verifique los permisos en su navegador.',
          icono: 'error'
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Zoom manual
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([CENTRO_COSTA_RICA.lat, CENTRO_COSTA_RICA.lng], 8, { duration: 1.2 });
    setHighlightedPoiId(null);
    setSearchFeedback(null);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        minHeight: '520px',
        borderRadius: '1.75rem',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backgroundColor: '#00040D',
        boxShadow: '0 25px 60px rgba(0, 4, 13, 0.85)'
      }}
    >
      {/* Contenedor del Mapa Real de Leaflet */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor: '#00040D'
        }}
      />

      {/* =========================================================================
          CONTROLES FLOTANTES SUPERIORES (GLASS CONTROLS)
          ========================================================================= */}

      {/* 1. Barra de Búsqueda Flotante Centrada Arriba */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          width: '92%',
          maxWidth: '560px'
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 4, 13, 0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            borderRadius: '9999px',
            padding: '0.4rem 0.55rem 0.4rem 1.15rem',
            boxShadow: '0 16px 40px rgba(0, 4, 13, 0.75)'
          }}
        >
          <Sparkles size={16} color="#79a6ff" style={{ flexShrink: 0, marginRight: '0.65rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Consultar en lenguaje natural (ej. 'albergues en Puntarenas')..."
            aria-label="Buscar en el mapa cartográfico de Costa Rica"
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              fontWeight: 500,
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchFeedback(null);
                setHighlightedPoiId(null);
              }}
              aria-label="Limpiar búsqueda"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.2rem',
                marginRight: '0.35rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          )}
          <button
            type="submit"
            aria-label="Ejecutar búsqueda"
            style={{
              backgroundColor: '#002B7F',
              border: '1px solid rgba(121, 166, 255, 0.4)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <span>Buscar</span>
          </button>
        </form>

        {/* Feedback sutil de búsqueda */}
        {searchFeedback && (
          <div
            style={{
              marginTop: '0.45rem',
              backgroundColor: 'rgba(0, 8, 25, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(121, 166, 255, 0.3)',
              borderRadius: '12px',
              padding: '0.45rem 0.9rem',
              fontSize: '0.78rem',
              color: '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(0, 4, 13, 0.7)'
            }}
          >
            <span>{searchFeedback}</span>
            <button
              type="button"
              onClick={() => setSearchFeedback(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.1rem'
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* 2. Control Compacto de Capas (Top Right: top-4 right-4 z-20) */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 20
        }}
      >
        <button
          type="button"
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          aria-expanded={isLayerMenuOpen}
          aria-label="Abrir selector de capas cívicas"
          style={{
            backgroundColor: isLayerMenuOpen ? 'rgba(0, 43, 127, 0.95)' : 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isLayerMenuOpen ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.20)',
            borderRadius: '9999px',
            padding: '0.55rem 1.05rem',
            color: '#FFFFFF',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 10px 30px rgba(0, 4, 13, 0.65)',
            transition: 'all 0.2s ease'
          }}
        >
          <Layers size={15} color="#79a6ff" />
          <span>Capas ({activeLayersCount})</span>
        </button>

        {/* Panel Desplegable de Capas */}
        {isLayerMenuOpen && (
          <div
            role="dialog"
            aria-label="Capas cartográficas cívicas"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '260px',
              backgroundColor: 'rgba(0, 4, 13, 0.96)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '16px',
              padding: '0.85rem',
              boxShadow: '0 20px 45px rgba(0, 4, 13, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#79a6ff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.2rem',
                paddingBottom: '0.35rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              Capas Cívicas de Costa Rica
            </div>

            {GIS_LAYERS_CONFIG.map((layer) => {
              const isActive = activeLayers[layer.id];
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() =>
                    setActiveLayers((prev) => ({
                      ...prev,
                      [layer.id]: !prev[layer.id]
                    }))
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                    border: 'none',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: layer.color,
                        boxShadow: isActive ? `0 0 8px ${layer.color}` : 'none'
                      }}
                    />
                    <span>{layer.nombre.split('(')[0].trim()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {layerCounts[layer.id] || 0}
                    </span>
                    {isActive && <Check size={13} color="#79a6ff" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          CONTROLES FLOTANTES INFERIORES IZQUIERDOS (Bottom Left: bottom-4 left-4 z-20)
          ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          left: '1.25rem',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}
      >
        {/* Botón Mi Ubicación GPS */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          title="Centrar en mi ubicación actual"
          aria-label="Localizar mi ubicación GPS"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            color: isLocating ? '#00D166' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLocating ? 'wait' : 'pointer',
            boxShadow: '0 8px 25px rgba(0, 4, 13, 0.7)',
            transition: 'all 0.2s ease'
          }}
        >
          <Locate size={18} />
        </button>

        {/* Botón Zoom In (+) */}
        <button
          type="button"
          onClick={handleZoomIn}
          title="Acercar mapa"
          aria-label="Acercar mapa"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px 12px 0 0',
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            borderBottom: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 4, 13, 0.7)',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={18} />
        </button>

        {/* Botón Zoom Out (-) */}
        <button
          type="button"
          onClick={handleZoomOut}
          title="Alejar mapa"
          aria-label="Alejar mapa"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '0 0 12px 12px',
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 4, 13, 0.7)',
            transition: 'all 0.2s ease'
          }}
        >
          <Minus size={18} />
        </button>

        {/* Botón Re-centrar Costa Rica */}
        <button
          type="button"
          onClick={handleResetView}
          title="Vista general de Costa Rica"
          aria-label="Restablecer vista a Costa Rica"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            color: '#79a6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 4, 13, 0.7)',
            marginTop: '0.2rem',
            transition: 'all 0.2s ease'
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
