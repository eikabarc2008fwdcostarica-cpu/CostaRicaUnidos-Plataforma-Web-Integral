import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import {
  Search,
  Locate,
  Layers,
  Plus,
  Minus,
  X,
  Compass,
  RotateCw,
  RotateCcw,
  Satellite,
  Map,
  Check
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyBA17iGTFLY5fK5FBcJ6-5JFIF3YAuTd3A';

// Base de Datos Cívica Nacional Expandida (35+ Ubicaciones Reales en las 7 Provincias)
const PUNTOS_CIVICOS = [
  // ==================== SALUD (CCSS / Ebais) ====================
  {
    id: 'salud-1',
    nombre: 'Hospital San Juan de Dios',
    categoria: 'salud',
    canton: 'San José',
    provincia: 'San José',
    coordenadas: { lat: 9.9358, lng: -84.0863 },
    descripcion: 'Hospital nacional de alta complejidad y centro histórico de referencia médica.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-2',
    nombre: 'Hospital México (CCSS / Ebais)',
    categoria: 'salud',
    canton: 'San José',
    provincia: 'San José',
    coordenadas: { lat: 9.9535, lng: -84.1082 },
    descripcion: 'Centro hospitalario nacional y atención de urgencias y cardiología cívica.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-3',
    nombre: 'Hospital Calderón Guardia',
    categoria: 'salud',
    canton: 'San José',
    provincia: 'San José',
    coordenadas: { lat: 9.9367, lng: -84.0705 },
    descripcion: 'Hospital metropolitano especializado en trauma y cuidados críticos nacionales.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-4',
    nombre: 'Hospital San Rafael de Alajuela',
    categoria: 'salud',
    canton: 'Alajuela',
    provincia: 'Alajuela',
    coordenadas: { lat: 10.0152, lng: -84.2144 },
    descripcion: 'Centro médico regional del Valle Central occidental con atención primaria y quirúrgica.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-5',
    nombre: 'Hospital Max Peralta',
    categoria: 'salud',
    canton: 'Cartago',
    provincia: 'Cartago',
    coordenadas: { lat: 9.8631, lng: -83.9214 },
    descripcion: 'Hospital regional cartaginés con servicios integrales de maternidad y emergencias.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-6',
    nombre: 'Hospital San Vicente de Paúl',
    categoria: 'salud',
    canton: 'Heredia',
    provincia: 'Heredia',
    coordenadas: { lat: 9.9981, lng: -84.1235 },
    descripcion: 'Hospital de referencia de Heredia con tecnología médica de punta y consulta ambulatoria.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-7',
    nombre: 'Hospital Enrique Baltodano Briceño',
    categoria: 'salud',
    canton: 'Liberia',
    provincia: 'Guanacaste',
    coordenadas: { lat: 10.6354, lng: -85.4442 },
    descripcion: 'Hospital regional del Pacífico Norte con helipuerto y unidad de cuidados intensivos.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-8',
    nombre: 'Hospital Monseñor Sanabria',
    categoria: 'salud',
    canton: 'Puntarenas',
    provincia: 'Puntarenas',
    coordenadas: { lat: 9.9792, lng: -84.7742 },
    descripcion: 'Hospital provincial del Pacífico Central con nuevo complejo de alta resiliencia sísmica.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-9',
    nombre: 'Hospital Dr. Tony Facio Castro',
    categoria: 'salud',
    canton: 'Limón',
    provincia: 'Limón',
    coordenadas: { lat: 9.9953, lng: -83.0336 },
    descripcion: 'Hospital regional caribeño para atención portuaria y comunidades de la provincia.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-10',
    nombre: 'Ebais Santa Cruz',
    categoria: 'salud',
    canton: 'Santa Cruz',
    provincia: 'Guanacaste',
    coordenadas: { lat: 10.2612, lng: -85.5843 },
    descripcion: 'Centro de atención médica primaria comunitaria para la zona de la bajura guanacasteca.',
    estado: 'ACTIVO'
  },
  {
    id: 'salud-11',
    nombre: 'Ebais Cahuita',
    categoria: 'salud',
    canton: 'Talamanca',
    provincia: 'Limón',
    coordenadas: { lat: 9.7364, lng: -82.8441 },
    descripcion: 'Puesto de salud comunitario en la costa sur caribeña con atención intercultural.',
    estado: 'ACTIVO'
  },

  // ==================== EDUCACIÓN (CTPs y MEP) ====================
  {
    id: 'edu-1',
    nombre: 'Colegio Técnico Profesional de San Carlos',
    categoria: 'educacion',
    canton: 'San Carlos',
    provincia: 'Alajuela',
    coordenadas: { lat: 10.3241, lng: -84.4285 },
    descripcion: 'Sede de formación técnica agropecuaria, informática y electromecánica en la Zona Norte.',
    estado: 'ACTIVO'
  },
  {
    id: 'edu-2',
    nombre: 'CTP de Calle Blancos',
    categoria: 'educacion',
    canton: 'Goicoechea',
    provincia: 'San José',
    coordenadas: { lat: 9.9482, lng: -84.0621 },
    descripcion: 'Institución técnica vocacional con especialidades en electrónica industrial y software.',
    estado: 'ACTIVO'
  },
  {
    id: 'edu-3',
    nombre: 'COVAO / CTP Vocacional de Cartago',
    categoria: 'educacion',
    canton: 'Cartago',
    provincia: 'Cartago',
    coordenadas: { lat: 9.8512, lng: -83.9142 },
    descripcion: 'Centro educativo vocacional histórico pionero en diseño mecánico y telecomunicaciones.',
    estado: 'ACTIVO'
  },
  {
    id: 'edu-4',
    nombre: 'CTP de Heredia',
    categoria: 'educacion',
    canton: 'Heredia',
    provincia: 'Heredia',
    coordenadas: { lat: 10.0024, lng: -84.1189 },
    descripcion: 'Formación técnica superior en contabilidad, ciberseguridad y soporte de TI.',
    estado: 'ACTIVO'
  },
  {
    id: 'edu-5',
    nombre: 'CTP de Liberia',
    categoria: 'educacion',
    canton: 'Liberia',
    provincia: 'Guanacaste',
    coordenadas: { lat: 10.6289, lng: -85.4382 },
    descripcion: 'Colegio técnico con programas de turismo sustentable, bilingüismo y mecatrónica.',
    estado: 'ACTIVO'
  },
  {
    id: 'edu-6',
    nombre: 'CTP de Puntarenas (El Roble)',
    categoria: 'educacion',
    canton: 'Puntarenas',
    provincia: 'Puntarenas',
    coordenadas: { lat: 9.9812, lng: -84.7521 },
    descripcion: 'Especialidades técnicas marítimo-pesqueras, mecánica naval y logística portuaria.',
    estado: 'ACTIVO'
  },
  {
    id: 'edu-7',
    nombre: 'CTP de Limón',
    categoria: 'educacion',
    canton: 'Limón',
    provincia: 'Limón',
    coordenadas: { lat: 9.9823, lng: -83.0412 },
    descripcion: 'Formación vocacional en administración aduanera, logística de contenedores y refrigeración.',
    estado: 'ACTIVO'
  },

  // ==================== TRANSPORTE E INTERURBANO ====================
  {
    id: 'trans-1',
    nombre: 'Terminal de Autobuses 7-10',
    categoria: 'transporte',
    canton: 'San José',
    provincia: 'San José',
    coordenadas: { lat: 9.9385, lng: -84.0841 },
    descripcion: 'Hub interurbano nacional con conexiones directas hacia Guanacaste y el Pacífico.',
    estado: 'ACTIVO'
  },
  {
    id: 'trans-2',
    nombre: 'Terminal TUASA Alajuela',
    categoria: 'transporte',
    canton: 'Alajuela',
    provincia: 'Alajuela',
    coordenadas: { lat: 10.0174, lng: -84.2132 },
    descripcion: 'Terminal troncal de conexión rápida entre el Valle Central y el Aeropuerto SJO.',
    estado: 'ACTIVO'
  },
  {
    id: 'trans-3',
    nombre: 'Terminal Lumaca Cartago',
    categoria: 'transporte',
    canton: 'Cartago',
    provincia: 'Cartago',
    coordenadas: { lat: 9.8643, lng: -83.9189 },
    descripcion: 'Flujo interurbano de alta frecuencia conectando Cartago colonial con San José.',
    estado: 'ACTIVO'
  },
  {
    id: 'trans-4',
    nombre: 'Terminal Empresarios Unidos Puntarenas',
    categoria: 'transporte',
    canton: 'Puntarenas',
    provincia: 'Puntarenas',
    coordenadas: { lat: 9.9765, lng: -84.8312 },
    descripcion: 'Centro neurálgico de trasbordo hacia las islas del Golfo y rutas costeras.',
    estado: 'ACTIVO'
  },
  {
    id: 'trans-5',
    nombre: 'Terminal Grupo Caribeños Limón',
    categoria: 'transporte',
    canton: 'Limón',
    provincia: 'Limón',
    coordenadas: { lat: 9.9941, lng: -83.0315 },
    descripcion: 'Conexión por la Ruta 32 entre el Puerto caribeño y la capital.',
    estado: 'ACTIVO'
  },
  {
    id: 'trans-6',
    nombre: 'Estación Ferrocarril al Atlántico INCOFER',
    categoria: 'transporte',
    canton: 'San José',
    provincia: 'San José',
    coordenadas: { lat: 9.9342, lng: -84.0694 },
    descripcion: 'Estación histórica patrimonial del tren interurbano metropolitano (GAM).',
    estado: 'ACTIVO'
  },

  // ==================== DEPORTES Y RECREACIÓN CCDR ====================
  {
    id: 'dep-1',
    nombre: 'Estadio Nacional / Parque La Sabana',
    categoria: 'recreativa',
    canton: 'San José',
    provincia: 'San José',
    coordenadas: { lat: 9.9372, lng: -84.1023 },
    descripcion: 'Principal recinto deportivo y pulmón verde de la capital con pista olímpica.',
    estado: 'ACTIVO'
  },
  {
    id: 'dep-2',
    nombre: 'Polideportivo Monserrat',
    categoria: 'recreativa',
    canton: 'Alajuela',
    provincia: 'Alajuela',
    coordenadas: { lat: 10.0084, lng: -84.2185 },
    descripcion: 'Complejo acuático, canchas de baloncesto y pista atlética cantonal alajuelense.',
    estado: 'ACTIVO'
  },
  {
    id: 'dep-3',
    nombre: 'Polideportivo de Cartago (CCDR)',
    categoria: 'recreativa',
    canton: 'Cartago',
    provincia: 'Cartago',
    coordenadas: { lat: 9.8645, lng: -83.9192 },
    descripcion: 'Instalaciones deportivas cantonales, pista de patinaje y canchas multiuso.',
    estado: 'ACTIVO'
  },
  {
    id: 'dep-4',
    nombre: 'Palacio de los Deportes de Heredia',
    categoria: 'recreativa',
    canton: 'Heredia',
    provincia: 'Heredia',
    coordenadas: { lat: 10.0012, lng: -84.1241 },
    descripcion: 'Coliseo deportivo techado, gimnasio de voleibol y piscina temperada.',
    estado: 'ACTIVO'
  },
  {
    id: 'dep-5',
    nombre: 'Polideportivo El Roble',
    categoria: 'recreativa',
    canton: 'Puntarenas',
    provincia: 'Puntarenas',
    coordenadas: { lat: 9.9794, lng: -84.7612 },
    descripcion: 'Área recreativa comunal y canchas de fútbol playa para la juventud porteña.',
    estado: 'ACTIVO'
  },
  {
    id: 'dep-6',
    nombre: 'Estadio Nuevo de Limón Juan Gobán',
    categoria: 'recreativa',
    canton: 'Limón',
    provincia: 'Limón',
    coordenadas: { lat: 9.9921, lng: -83.0284 },
    descripcion: 'Emblemático estadio comunal y campo de atletismo en el corazón caribeño.',
    estado: 'ACTIVO'
  },

  // ==================== ALBERGUES DE EMERGENCIA CNE ====================
  {
    id: 'alb-1',
    nombre: 'Albergue Temporal CNE - Salón Comunal Matina',
    categoria: 'albergues',
    canton: 'Matina',
    provincia: 'Limón',
    coordenadas: { lat: 10.0812, lng: -83.2841 },
    descripcion: 'Refugio oficial habilitado para contingencias de crecidas fluviales e inundaciones.',
    estado: 'HABILITADO'
  },
  {
    id: 'alb-2',
    nombre: 'Albergue Temporal CNE - Gimnasio Municipal Santa Cruz',
    categoria: 'albergues',
    canton: 'Santa Cruz',
    provincia: 'Guanacaste',
    coordenadas: { lat: 10.2625, lng: -85.5854 },
    descripcion: 'Refugio de alta capacidad equipado con suministros humanitarios para eventos sísmicos.',
    estado: 'HABILITADO'
  },
  {
    id: 'alb-3',
    nombre: 'Albergue Temporal CNE - Escuela Central de Puntarenas',
    categoria: 'albergues',
    canton: 'Puntarenas',
    provincia: 'Puntarenas',
    coordenadas: { lat: 9.9761, lng: -84.8291 },
    descripcion: 'Punto de evacuación costera y resguardo ante oleajes extraordinarios o tsunamis.',
    estado: 'HABILITADO'
  },
  {
    id: 'alb-4',
    nombre: 'Albergue Temporal CNE - Polideportivo Ciudad Quesada',
    categoria: 'albergues',
    canton: 'San Carlos',
    provincia: 'Alajuela',
    coordenadas: { lat: 10.3214, lng: -84.4312 },
    descripcion: 'Centro cantonal de respuesta rápida y albergue masivo ante emergencias volcánicas.',
    estado: 'HABILITADO'
  },
  {
    id: 'alb-5',
    nombre: 'Albergue Temporal CNE - Salón Parroquial Turrialba',
    categoria: 'albergues',
    canton: 'Turrialba',
    provincia: 'Cartago',
    coordenadas: { lat: 9.9042, lng: -83.6821 },
    descripcion: 'Espacio de refugio comunal equipado por el Comité Municipal de Emergencias de Cartago.',
    estado: 'HABILITADO'
  }
];

const CATEGORIAS_CONFIG = {
  salud: { nombre: 'Salud (CCSS / Ebais)', color: '#10B981' },
  educacion: { nombre: 'Educación (CTPs y MEP)', color: '#3B82F6' },
  transporte: { nombre: 'Transporte e Interurbano', color: '#F59E0B' },
  recreativa: { nombre: 'Deportes y Recreación CCDR', color: '#8B5CF6' },
  albergues: { nombre: 'Albergues de Emergencia CNE', color: '#DA291C' }
};

export default function MapaGIS() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersMapRef = useRef({});
  const infoWindowRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [is3D, setIs3D] = useState(true);
  const [mapType, setMapType] = useState('hybrid'); // 'hybrid' o 'roadmap'
  const [capasVisibles, setCapasVisibles] = useState({
    salud: true,
    educacion: true,
    transporte: true,
    recreativa: true,
    albergues: true
  });
  const [menuCapasAbierto, setMenuCapasAbierto] = useState(false);

  // 1. Carga Dinámica de la Google Maps JavaScript API v3 sin controles blancos por defecto
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      try {
        const google = window.google;

        const mapOptions = {
          center: { lat: 9.7489, lng: -83.7534 }, // Centro geográfico de Costa Rica
          zoom: 8.5,
          mapTypeId: 'hybrid', // Satélite real fotorrealista con toponimia
          tilt: 45, // Inclinación 3D nativa WebGL
          disableDefaultUI: true, // ELIMINA TODOS LOS CONTROLES BLANCOS POR DEFECTO
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          restriction: {
            latLngBounds: {
              north: 11.25,
              south: 8.00,
              west: -86.10,
              east: -82.50
            },
            strictBounds: false
          }
        };

        const map = new google.maps.Map(mapContainerRef.current, mapOptions);
        mapInstanceRef.current = map;

        // InfoWindow con contenedor oscuro
        infoWindowRef.current = new google.maps.InfoWindow();

        // Marcadores vectoriales 3D para cada uno de los 35+ puntos cívicos
        PUNTOS_CIVICOS.forEach((p) => {
          const colorPin = CATEGORIAS_CONFIG[p.categoria]?.color || '#3B82F6';

          const marker = new google.maps.Marker({
            position: p.coordenadas,
            map: map,
            title: p.nombre,
            icon: {
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: colorPin,
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 1.6,
              scale: 1.4,
              anchor: new google.maps.Point(12, 22)
            }
          });

          marker.addListener('click', () => {
            abrirInfoWindow(p, marker);
          });

          markersMapRef.current[p.id] = marker;
        });

        // Sincronizar estado de inclinación si el usuario usa gestos de teclado/mouse
        map.addListener('tilt_changed', () => {
          const currentTilt = map.getTilt();
          setIs3D(currentTilt !== 0);
        });

        setIsMapLoaded(true);
      } catch (err) {
        console.error('Error inicializando Google Maps:', err);
        setMapError('No se pudo inicializar la API de Google Maps.');
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const existingScript = document.getElementById('google-maps-api-script');
      if (existingScript) {
        existingScript.addEventListener('load', initMap);
      } else {
        const script = document.createElement('script');
        script.id = 'google-maps-api-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
          if (isMounted) setMapError('Error de red al cargar el script de Google Maps.');
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Control reactivo de visibilidad de marcadores según capas y búsqueda
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    PUNTOS_CIVICOS.forEach((p) => {
      const marker = markersMapRef.current[p.id];
      if (!marker) return;

      const pasaCapa = capasVisibles[p.categoria];
      const pasaBusqueda =
        !busqueda.trim() ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.canton.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.provincia.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase());

      if (pasaCapa && pasaBusqueda) {
        marker.setMap(mapInstanceRef.current);
      } else {
        marker.setMap(null);
      }
    });
  }, [capasVisibles, busqueda]);

  // InfoWindow con diseño Sovereign Glass
  const abrirInfoWindow = (p, marker) => {
    if (!infoWindowRef.current || !mapInstanceRef.current) return;
    const colorPin = CATEGORIAS_CONFIG[p.categoria]?.color || '#3B82F6';

    const contentString = `
      <div style="background-color: #00040D; color: #FFFFFF; padding: 14px; border-radius: 14px; min-width: 240px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-size: 10px; background: ${colorPin}25; border: 1px solid ${colorPin}50; padding: 2px 8px; border-radius: 9999px; text-transform: uppercase; color: ${colorPin}; font-weight: 800; letter-spacing: 0.05em;">
            ${p.categoria} &bull; ${p.estado}
          </span>
        </div>
        <h4 style="margin: 6px 0 3px 0; font-size: 14px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">${p.nombre}</h4>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #94A3B8;">${p.canton}, ${p.provincia}</p>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #CBD5E1; line-height: 1.45; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">${p.descripcion}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <a href="https://waze.com/ul?ll=${p.coordenadas.lat},${p.coordenadas.lng}&navigate=yes" target="_blank" rel="noopener noreferrer" style="text-align: center; background: #002B7F; border: 1px solid rgba(121, 166, 255, 0.4); color: white; padding: 7px 10px; border-radius: 8px; font-size: 11px; text-decoration: none; font-weight: 700;">
            Waze
          </a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${p.coordenadas.lat},${p.coordenadas.lng}" target="_blank" rel="noopener noreferrer" style="text-align: center; background: rgba(255,255,255,0.08); border: 1px solid rgba(255, 255, 255, 0.16); color: white; padding: 7px 10px; border-radius: 8px; font-size: 11px; text-decoration: none; font-weight: 600;">
            Google Maps
          </a>
        </div>
      </div>
    `;

    infoWindowRef.current.setContent(contentString);
    infoWindowRef.current.open(mapInstanceRef.current, marker);
  };

  // 3. Acciones conectadas de los 5 botones circulares flotantes
  // Botón 1: Reset de Costa Rica
  const handleReset = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter({ lat: 9.7489, lng: -83.7534 });
    mapInstanceRef.current.setZoom(8.5);
    mapInstanceRef.current.setTilt(45);
    mapInstanceRef.current.setHeading(0);
    setIs3D(true);
  };

  // Botón 2: Brújula / Rotar 3D 45°
  const handleRotar3D = () => {
    if (!mapInstanceRef.current) return;
    const currentHeading = mapInstanceRef.current.getHeading() || 0;
    mapInstanceRef.current.setHeading((currentHeading + 45) % 360);
    mapInstanceRef.current.setTilt(45);
    setIs3D(true);
  };

  // Botón 3: GPS Mi Ubicación
  const handleGPS = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      alert('La geolocalización no está disponible en su navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        mapInstanceRef.current.panTo(coords);
        mapInstanceRef.current.setZoom(15);
        mapInstanceRef.current.setTilt(45);
        setIs3D(true);

        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(coords);
        } else if (window.google?.maps) {
          userMarkerRef.current = new window.google.maps.Marker({
            position: coords,
            map: mapInstanceRef.current,
            title: 'Tu ubicación actual',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#00D166',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3
            }
          });
        }
      },
      () => alert('No se pudo obtener la geolocalización.')
    );
  };

  // Botón 4: Zoom In (+)
  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 8.5) + 1);
  };

  // Botón 5: Zoom Out (-)
  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 8.5) - 1);
  };

  // Alternar Inclinación 3D (45°) / 2D Plano
  const handleAlternar3D = () => {
    if (!mapInstanceRef.current) return;
    const currentTilt = mapInstanceRef.current.getTilt() || 0;
    const nuevoTilt = currentTilt === 0 ? 45 : 0;
    mapInstanceRef.current.setTilt(nuevoTilt);
    setIs3D(nuevoTilt === 45);
  };

  // Alternar Tipo de Mapa: Satélite Híbrido / Vectorial Callejero
  const handleToggleMapType = () => {
    if (!mapInstanceRef.current) return;
    const nextType = mapType === 'hybrid' ? 'roadmap' : 'hybrid';
    mapInstanceRef.current.setMapTypeId(nextType);
    if (nextType === 'hybrid') {
      mapInstanceRef.current.setTilt(45);
      setIs3D(true);
    }
    setMapType(nextType);
  };

  // Búsqueda interactiva y panTo
  const ejecutarBusqueda = (e) => {
    if (e) e.preventDefault();
    if (!busqueda.trim() || !mapInstanceRef.current) return;

    const query = busqueda.toLowerCase().trim();
    const match = PUNTOS_CIVICOS.find(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.canton.toLowerCase().includes(query) ||
        p.provincia.toLowerCase().includes(query) ||
        p.categoria.toLowerCase().includes(query)
    );

    if (match) {
      setCapasVisibles((prev) => ({ ...prev, [match.categoria]: true }));
      mapInstanceRef.current.panTo(match.coordenadas);
      mapInstanceRef.current.setZoom(15);
      mapInstanceRef.current.setTilt(45);
      setIs3D(true);
      const marker = markersMapRef.current[match.id];
      if (marker) {
        abrirInfoWindow(match, marker);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#00040D', minHeight: '100vh', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ padding: '2rem 1.5rem 4rem', maxWidth: '1320px', margin: '0 auto', width: '100%', flex: 1, boxSizing: 'border-box' }}>
        {/* Cabecera Editorial Limpia */}
        <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '300', letterSpacing: '-0.02em', margin: 0 }}>
            Territorio &amp; Cartografía Soberana 3D
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Exploración geoespacial satelital interactiva con perspectiva tridimensional y 35+ infraestructuras cívicas
          </p>
        </header>

        {/* Visor 3D Oficial de Google Maps con Enfoque Soberano y Vidrio Oscuro */}
        <div style={{
          position: 'relative',
          height: '70vh',
          minHeight: '540px',
          width: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          backgroundColor: '#00040D'
        }}>
          {/* Contenedor del Mapa Canvas de Google Maps (100% nítido y despejado) */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

          {/* Estado de Carga o Error */}
          {!isMapLoaded && !mapError && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#00040D',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              zIndex: 15
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                border: '3px solid rgba(121, 166, 255, 0.2)',
                borderTopColor: '#79a6ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
                Iniciando Visor Satelital 3D Soberano...
              </p>
            </div>
          )}

          {mapError && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 4, 13, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              zIndex: 15,
              padding: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#F87171', fontSize: '1rem', fontWeight: 600 }}>{mapError}</p>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Verifique la conexión y clave de API autorizada de Google Maps Platform.</p>
            </div>
          )}

          {/* 1. Buscador Flotante Arriba al Centro (zIndex: 20) */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            width: '90%',
            maxWidth: '460px'
          }}>
            <form onSubmit={ejecutarBusqueda} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 4, 13, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '9999px',
              padding: '0.4rem 0.6rem 0.4rem 1.1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
            }}>
              <Search size={16} color="#79a6ff" style={{ flexShrink: 0, marginRight: '0.5rem' }} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cantón, hospital, CTP o albergue..."
                aria-label="Buscar en Google Maps 3D"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  flex: 1,
                  fontSize: '0.88rem'
                }}
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar búsqueda"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '0 0.3rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                style={{
                  backgroundColor: '#002B7F',
                  border: '1px solid rgba(121, 166, 255, 0.4)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                Buscar
              </button>
            </form>
          </div>

          {/* 2. Grupo Superior Derecho: Modo Satélite/Vectorial, Alternar 3D y Capas Cívicas (zIndex: 20) */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {/* Alternar Tipo de Mapa: Satélite Híbrido / Vectorial */}
            <button
              type="button"
              onClick={handleToggleMapType}
              aria-label={`Cambiar a vista ${mapType === 'hybrid' ? 'Vectorial' : 'Satélite Híbrido'}`}
              style={{
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease'
              }}
            >
              {mapType === 'hybrid' ? (
                <>
                  <Satellite size={15} color="#79a6ff" />
                  <span>Satélite Híbrido</span>
                </>
              ) : (
                <>
                  <Map size={15} color="#79a6ff" />
                  <span>Vectorial</span>
                </>
              )}
            </button>

            {/* Alternar 3D (45°) / 2D Plano */}
            <button
              type="button"
              onClick={handleAlternar3D}
              aria-label={is3D ? "Cambiar a Vista 2D plana" : "Cambiar a Vista 3D (45°)"}
              style={{
                backgroundColor: is3D ? 'rgba(0, 43, 127, 0.95)' : 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: is3D ? '1px solid #79a6ff' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease'
              }}
            >
              <Compass size={15} color="#79a6ff" />
              <span>{is3D ? '3D (45°)' : '2D Plano'}</span>
            </button>

            {/* Selector de Capas Cívicas */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setMenuCapasAbierto(!menuCapasAbierto)}
                aria-label="Abrir capas cívicas"
                style={{
                  backgroundColor: menuCapasAbierto ? 'rgba(0, 43, 127, 0.95)' : 'rgba(0, 4, 13, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
                }}
              >
                <Layers size={14} color="#79a6ff" />
                <span>Capas ({Object.values(capasVisibles).filter(Boolean).length})</span>
              </button>

              {menuCapasAbierto && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '230px',
                  backgroundColor: 'rgba(0, 4, 13, 0.96)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.85)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#79a6ff', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    Capas Cívicas Activas
                  </div>
                  {Object.entries(CATEGORIAS_CONFIG).map(([key, info]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', cursor: 'pointer', color: capasVisibles[key] ? '#FFFFFF' : '#94A3B8' }}>
                      <input
                        type="checkbox"
                        checked={capasVisibles[key]}
                        onChange={() => setCapasVisibles({ ...capasVisibles, [key]: !capasVisibles[key] })}
                        style={{ accentColor: '#002B7F', cursor: 'pointer' }}
                      />
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: info.color
                      }} />
                      <span>{info.nombre}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Controles Circulares Flotantes a la Izquierda (zIndex: 20) */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            {/* 1. Botón Reset Costa Rica */}
            <button
              type="button"
              onClick={handleReset}
              aria-label="Restablecer vista a Costa Rica"
              title="Restablecer vista nacional completa"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCcw size={17} color="#79a6ff" />
            </button>

            {/* 2. Botón Brújula / Rotar 3D 45° */}
            <button
              type="button"
              onClick={handleRotar3D}
              aria-label="Rotar cámara 3D 45 grados"
              title="Rotar cámara 3D 45°"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCw size={17} color="#79a6ff" />
            </button>

            {/* 3. Botón GPS Mi Ubicación */}
            <button
              type="button"
              onClick={handleGPS}
              aria-label="Mi ubicación en Costa Rica"
              title="Localizar mi ubicación GPS"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.15s ease'
              }}
            >
              <Locate size={17} color="#00D166" />
            </button>

            {/* 4. Botón Zoom In (+) */}
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Acercar mapa"
              title="Acercar mapa"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={17} />
            </button>

            {/* 5. Botón Zoom Out (-) */}
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Alejar mapa"
              title="Alejar mapa"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(0, 4, 13, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.15s ease'
              }}
            >
              <Minus size={17} />
            </button>
          </div>
        </div>

        {/* 3 Tarjetas Editoriales de Información Cívica (Sin textos truncados) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '2.5rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            overflow: 'visible'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#60A5FA' }}>
              01 &bull; Geofencing Soberano
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0, lineHeight: 1.6, whiteSpace: 'normal', wordBreak: 'normal', overflow: 'visible' }}>
              Límites precisos circunscritos a las 7 provincias de Costa Rica, resguardando la soberanía territorial y la geolocalización segura.
            </p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            overflow: 'visible'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#34D399' }}>
              02 &bull; Capas Cívicas Activas
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0, lineHeight: 1.6, whiteSpace: 'normal', wordBreak: 'normal', overflow: 'visible' }}>
              Puntos críticos de atención médica (CCSS), albergues temporales (CNE), educación y conectividad vial en tiempo real.
            </p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            overflow: 'visible'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#FBBF24' }}>
              03 &bull; Navegación Directa
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0, lineHeight: 1.6, whiteSpace: 'normal', wordBreak: 'normal', overflow: 'visible' }}>
              Interoperabilidad inmediata con Waze y Google Maps para trazado de rutas de emergencia y transporte comunitario.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
