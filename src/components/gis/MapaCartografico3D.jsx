import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  OBSIDIANA_CARTOGRAFICA_STYLES,
  GEOFENCING_COSTA_RICA,
  CENTRO_COSTA_RICA
} from './darkMapStyles';
import {
  GIS_LAYERS_CONFIG,
  GIS_POI_DATA,
  VUELOS_3D_DESTINOS
} from './gisLayersData';
import LayerControlPanel from './LayerControlPanel';
import CameraFlyControls from './CameraFlyControls';
import PointDetailCard from './PointDetailCard';

export default function MapaCartografico3D({
  onSelectLocation,
  customMarkers = [],
  routeWaypoints = [],
  initialCenter = CENTRO_COSTA_RICA,
  initialZoom = 8.5,
  initialTilt = 45,
  height = '740px',
  showLayerSelector = true,
  showCameraControls = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  // Estados de Capas y POIs
  const [activeLayers, setActiveLayers] = useState({
    salud: true,
    educacion: true,
    transporte: true,
    recreativa: true,
    albergues: true
  });
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Estados de Cámara 3D
  const [tilt, setTilt] = useState(initialTilt);
  const [heading, setHeading] = useState(0);
  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState(initialCenter);
  const [isLocating, setIsLocating] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Conteo de elementos por capa
  const countsByLayer = GIS_LAYERS_CONFIG.reduce((acc, layer) => {
    acc[layer.id] = GIS_POI_DATA.filter((p) => p.layer === layer.id).length;
    return acc;
  }, {});

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 1. Carga segura de Google Maps JavaScript API
  useEffect(() => {
    if (!apiKey) {
      // Modo seguro sin clave de API (Simulador Cartográfico Soberano v2.1)
      setApiLoaded(false);
      return;
    }

    const scriptId = 'google-maps-js-api-script';
    let script = document.getElementById(scriptId);

    const onScriptLoaded = () => {
      if (window.google && window.google.maps) {
        setApiLoaded(true);
        initGoogleMap();
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = onScriptLoaded;
      script.onerror = () => {
        console.warn('[MapaGIS] No se pudo cargar Google Maps API, activando modo seguro cartográfico.');
        setApiError(true);
      };
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      onScriptLoaded();
    }
  }, [apiKey]);

  // 2. Inicialización de Google Maps con Geofencing Soberano Estricto
  const initGoogleMap = useCallback(() => {
    if (!mapContainerRef.current || !window.google || !window.google.maps) return;

    try {
      const mapOptions = {
        center: initialCenter,
        zoom: initialZoom,
        tilt: initialTilt,
        heading: 0,
        mapTypeId: 'roadmap',
        styles: OBSIDIANA_CARTOGRAFICA_STYLES,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: true,
        backgroundColor: '#00040D',
        // GEOFENCING SOBERANO ESTRICTO (Incluyendo Isla del Coco)
        restriction: {
          latLngBounds: {
            north: GEOFENCING_COSTA_RICA.north,
            south: GEOFENCING_COSTA_RICA.south,
            west: GEOFENCING_COSTA_RICA.west,
            east: GEOFENCING_COSTA_RICA.east
          },
          strictBounds: true
        }
      };

      const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Evento de clic en mapa para Alanie (planificador de rutas)
      map.addListener('click', (e) => {
        if (onSelectLocation && e.latLng) {
          onSelectLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          });
        }
      });

      // Sincronizar tilt y heading cuando el usuario los cambie con controles de mapa
      map.addListener('tilt_changed', () => {
        setTilt(map.getTilt() || 0);
      });
      map.addListener('heading_changed', () => {
        setHeading(map.getHeading() || 0);
      });

      // Crear marcadores iniciales
      renderGoogleMarkers(map);
    } catch (err) {
      console.error('[MapaGIS] Error al instanciar Google Maps:', err);
      setApiError(true);
    }
  }, [initialCenter, initialZoom, initialTilt, onSelectLocation]);

  // 3. Renderizar marcadores de Google Maps
  const renderGoogleMarkers = (map) => {
    if (!map || !window.google) return;

    // Limpiar marcadores previos
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Marcadores de las 5 Capas Cívicas
    GIS_POI_DATA.forEach((poi) => {
      const isVisible = activeLayers[poi.layer];
      if (!isVisible) return;

      const layerConfig = GIS_LAYERS_CONFIG.find((l) => l.id === poi.layer);
      const pinColor = layerConfig ? layerConfig.color : '#002B7F';

      const svgIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: pinColor,
        fillOpacity: 0.95,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 8
      };

      const marker = new window.google.maps.Marker({
        position: { lat: poi.lat, lng: poi.lng },
        map: map,
        title: poi.nombre,
        icon: svgIcon,
        animation: window.google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        setSelectedPoint(poi);
        map.panTo({ lat: poi.lat, lng: poi.lng });
      });

      markersRef.current.push(marker);
    });

    // Marcadores personalizados pasados como prop (reutilización de Alanie)
    customMarkers.forEach((cm) => {
      const marker = new window.google.maps.Marker({
        position: { lat: cm.lat, lng: cm.lng },
        map: map,
        title: cm.title || 'Punto de Ruta',
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          fillColor: cm.color || '#DA291C',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 6
        }
      });
      markersRef.current.push(marker);
    });

    // Trazar polilíneas si Alanie envía waypoints
    if (routeWaypoints && routeWaypoints.length > 1) {
      if (routePolylineRef.current) {
        routePolylineRef.current.setMap(null);
      }
      routePolylineRef.current = new window.google.maps.Polyline({
        path: routeWaypoints,
        geodesic: true,
        strokeColor: '#79a6ff',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map: map
      });
    }
  };

  // Actualizar marcadores cuando cambien las capas
  useEffect(() => {
    if (mapInstanceRef.current && window.google) {
      renderGoogleMarkers(mapInstanceRef.current);
    }
  }, [activeLayers, customMarkers, routeWaypoints]);

  // 4. Funciones de Cámara 3D e Inclinación
  const handleSetTilt = (newTilt) => {
    setTilt(newTilt);
    if (mapInstanceRef.current && mapInstanceRef.current.setTilt) {
      mapInstanceRef.current.setTilt(newTilt);
    }
  };

  const handleRotateHeading = (deltaDeg) => {
    const nextHeading = (heading + deltaDeg + 360) % 360;
    setHeading(nextHeading);
    if (mapInstanceRef.current && mapInstanceRef.current.setHeading) {
      mapInstanceRef.current.setHeading(nextHeading);
    }
  };

  const handleResetOrientation = () => {
    setTilt(0);
    setHeading(0);
    if (mapInstanceRef.current) {
      if (mapInstanceRef.current.setTilt) mapInstanceRef.current.setTilt(0);
      if (mapInstanceRef.current.setHeading) mapInstanceRef.current.setHeading(0);
      mapInstanceRef.current.panTo(initialCenter);
    }
  };

  // 5. Vuelo 3D Fly-To a Destinos
  const handleFlyTo = (destino) => {
    setCenter({ lat: destino.lat, lng: destino.lng });
    setTilt(destino.tilt);
    setHeading(destino.heading);
    setZoom(destino.zoom);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: destino.lat, lng: destino.lng });
      mapInstanceRef.current.setZoom(destino.zoom);
      if (mapInstanceRef.current.setTilt) mapInstanceRef.current.setTilt(destino.tilt);
      if (mapInstanceRef.current.setHeading) mapInstanceRef.current.setHeading(destino.heading);
    }
  };

  // 6. Botón "Mi Ubicación" (navigator.geolocation con Geofencing)
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no es compatible con su navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        // Validar si está dentro de las coordenadas soberanas de Costa Rica
        const dentroDeCR =
          userLat >= GEOFENCING_COSTA_RICA.south &&
          userLat <= GEOFENCING_COSTA_RICA.north &&
          userLng >= GEOFENCING_COSTA_RICA.west &&
          userLng <= GEOFENCING_COSTA_RICA.east;

        if (!dentroDeCR) {
          alert('Tu ubicación GPS actual se encuentra fuera de los límites soberanos de Costa Rica.');
          return;
        }

        setCenter({ lat: userLat, lng: userLng });
        setZoom(15);
        setTilt(45);

        if (mapInstanceRef.current && window.google) {
          mapInstanceRef.current.panTo({ lat: userLat, lng: userLng });
          mapInstanceRef.current.setZoom(15);
          if (mapInstanceRef.current.setTilt) mapInstanceRef.current.setTilt(45);

          // Marcador de Usuario
          if (userMarkerRef.current) userMarkerRef.current.setMap(null);
          userMarkerRef.current = new window.google.maps.Marker({
            position: { lat: userLat, lng: userLng },
            map: mapInstanceRef.current,
            title: 'Mi Ubicación Ciudadana',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#00D166',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
              scale: 9
            }
          });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('[Geolocalización]', err.message);
        alert('No se pudo obtener la ubicación GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Manejadores de Capas
  const handleToggleLayer = (layerId) => {
    setActiveLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const handleToggleAllLayers = (enable) => {
    setActiveLayers({
      salud: enable,
      educacion: enable,
      transporte: enable,
      recreativa: enable,
      albergues: enable
    });
  };

  // Puntos visibles para el renderizado
  const visiblePois = GIS_POI_DATA.filter((p) => activeLayers[p.layer]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        backgroundColor: '#00040D',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 20px 60px rgba(0, 4, 13, 0.9), 0 0 30px rgba(0, 43, 127, 0.3)'
      }}
    >
      {/* Contenedor del Mapa de Google (o Canvas 3D) */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#00040D'
        }}
      />

      {/* Renderizado Cartográfico Soberano 3D (Fallback de Alta Fidelidad si no hay API Key o falla de red) */}
      {(!apiKey || apiError) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00040D',
            perspective: '1000px'
          }}
        >
          {/* Superficie cartográfica 3D inclinada con CSS Transforms */}
          <div
            style={{
              width: '90%',
              maxWidth: '900px',
              height: '80%',
              position: 'relative',
              borderRadius: '20px',
              background: 'radial-gradient(ellipse at center, rgba(0, 20, 60, 0.6) 0%, rgba(0, 4, 13, 0.95) 100%)',
              border: '1px solid rgba(121, 166, 255, 0.25)',
              boxShadow: '0 0 40px rgba(0, 43, 127, 0.5), inset 0 0 60px rgba(0, 4, 13, 0.8)',
              transform: `rotateX(${tilt}deg) rotateZ(${heading}deg) scale(${zoom / 9})`,
              transformOrigin: 'center center',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Grid y meridianos de relieve */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(121, 166, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(121, 166, 255, 0.08) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            {/* Marcadores Cívicos Proyectados */}
            {visiblePois.map((poi) => {
              // Proyección cartesiana simple para Costa Rica (Longitud -87 a -82.5, Latitud 8 a 11)
              const xPercent = ((poi.lng - GEOFENCING_COSTA_RICA.west) / (GEOFENCING_COSTA_RICA.east - GEOFENCING_COSTA_RICA.west)) * 100;
              const yPercent = 100 - ((poi.lat - GEOFENCING_COSTA_RICA.south) / (GEOFENCING_COSTA_RICA.north - GEOFENCING_COSTA_RICA.south)) * 100;
              const layerConfig = GIS_LAYERS_CONFIG.find((l) => l.id === poi.layer);
              const color = layerConfig ? layerConfig.color : '#00D166';

              return (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => setSelectedPoint(poi)}
                  aria-label={`${poi.nombre} - ${poi.categoria}`}
                  style={{
                    position: 'absolute',
                    top: `${yPercent}%`,
                    left: `${xPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 20
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '2px solid #FFFFFF',
                      boxShadow: `0 0 14px ${color}`,
                      transition: 'transform 0.2s'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(0, 4, 13, 0.85)',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      marginTop: '3px',
                      whiteSpace: 'nowrap',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {poi.nombre}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Banner de Telemetría Soberana y Estado de API Key */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}
      >
        <span
          className="telemetry-badge"
          style={{
            backgroundColor: 'rgba(0, 4, 13, 0.85)',
            borderColor: apiKey ? '#00D166' : '#79a6ff'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: apiKey ? '#00D166' : '#79a6ff',
              boxShadow: `0 0 8px ${apiKey ? '#00D166' : '#79a6ff'}`,
              display: 'inline-block'
            }}
          />
          {apiKey
            ? 'GOOGLE MAPS 3D PLATFORM & RELIEVE ACTIVO'
            : 'VISOR SOBERANO 3D (CONFIGURAR VITE_GOOGLE_MAPS_API_KEY)'}
        </span>
      </div>

      {/* Controles de Cámara 3D y Vuelos Fly-To */}
      {showCameraControls && (
        <CameraFlyControls
          currentTilt={tilt}
          currentHeading={heading}
          onSetTilt={handleSetTilt}
          onRotateHeading={handleRotateHeading}
          onResetOrientation={handleResetOrientation}
          onFlyTo={handleFlyTo}
          onGetLocation={handleGetLocation}
          isLocating={isLocating}
        />
      )}

      {/* Selector Multicapa Flotante */}
      {showLayerSelector && (
        <LayerControlPanel
          activeLayers={activeLayers}
          onToggleLayer={handleToggleLayer}
          onToggleAll={handleToggleAllLayers}
          countsByLayer={countsByLayer}
        />
      )}

      {/* Tarjeta de Detalle del POI Seleccionado con Deep Links a Waze y Google Maps */}
      <PointDetailCard point={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </div>
  );
}
