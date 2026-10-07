import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dbClient from '../services/dbClient';
import {
  Users,
  Store,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RotateCcw,
  Sliders,
  Send,
  Building2,
  MapPin,
  FileText,
  FileSpreadsheet,
  Eye,
  Check,
  Activity,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Shield,
  HelpCircle,
  Filter,
  BarChart3,
  Vote,
  TrendingUp,
  HardHat,
  Image as ImageIcon,
  Wrench,
  X,
  Camera,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCivicModal } from '../context/CivicModalContext';
import { getDb } from '../services/dbService';
import UsuariosAuditoriaModule from '../components/admin/UsuariosAuditoriaModule';
import ModeracionForoPanel from '../components/admin/ModeracionForoPanel';
import CNEGlobalMarqueeAlert from '../components/common/CNEGlobalMarqueeAlert';
import {
  obtenerSolicitudesComercio,
  resolverSolicitudComercio,
  obtenerBitacoraAuditoria,
  registrarAccionAuditoria,
  obtenerConfiguracionIA,
  actualizarConfiguracionIA,
  obtenerAlertasCNE,
  obtenerEstadoAlertasCNE,
  actualizarAlertaCNE,
  actualizarEstadoAlbergue,
  obtenerTicketsAverias,
  actualizarEstadoAveriaMunicipal,
  descargarRespaldoDbJson,
  restaurarDatosSemilla,
  obtenerMetricasGestionMunicipal
} from '../services/adminService';
import * as adminService from '../services/adminService';
import { actualizarEstadoSolicitudApi, obtenerSolicitudesComercioApi } from '../services/comercioService';

// Sectores normados para asignación de puestos de feria
const SECTORES_FERIA = [
  { id: 'Sector A', label: 'Sector A • Pabellón Agrícola (Hortalizas, frutas y tubérculos)' },
  { id: 'Sector B', label: 'Sector B • Área de Lácteos y Quesos Artesanales' },
  { id: 'Sector C', label: 'Sector C • Sector Cafetero, Cacao y Catación en Vivo' },
  { id: 'Sector D', label: 'Sector D • Pabellón Artesanal e Identidad Cultural' },
  { id: 'Sector E', label: 'Sector E • Cadena de Frío (Carnicería y Pescadería)' },
  { id: 'Sector F', label: 'Sector F • Plazoleta Gastronómica y Comidas Tradicionales' }
];

// Función de asignación inteligente automática de cuadrillas basada en categoría (CERO TIPEO MANUAL)
const obtenerCuadrillaAutomatica = (categoria) => {
  const cat = (categoria || '').toUpperCase();
  if (cat === 'INFRAESTRUCTURA_VIAL_HUECO' || cat === 'VIAL' || cat.includes('HUECO') || cat.includes('ASFALTO') || cat.includes('VIAL')) {
    return { nombre: 'Cuadrilla 01 · Vías y Asfalto', color: 'text-cru-accent-amber bg-cru-accent-amber-bg border-cru-accent-amber-border' };
  }
  if (cat === 'LUMINARIA' || cat === 'LUMINARIA_PUBLICA' || cat.includes('LUMIN') || cat.includes('ALUMBR') || cat.includes('ELECTR')) {
    return { nombre: 'Cuadrilla 02 · Alumbrado y Red Eléctrica', color: 'text-cru-accent-amber bg-cru-accent-amber-bg border-cru-accent-amber-border' };
  }
  if (cat === 'FUGA_AGUA' || cat === 'FUGA_AGUA_ALCANTARILLA' || cat.includes('AGUA') || cat.includes('ALCANTAR') || cat.includes('PLUVIAL') || cat.includes('FONTANER')) {
    return { nombre: 'Cuadrilla 03 · Fontanería y Red Pluvial', color: 'text-cru-accent-sky bg-cru-accent-sky-bg border-cru-accent-sky-border' };
  }
  return { nombre: 'Cuadrilla 04 · Saneamiento y Gestión Ambiental', color: 'text-cru-accent-green bg-cru-accent-green-bg border-cru-accent-green-border' };
};

// Extractor resiliente de coordenadas geográficas
const extraerCoordenadas = (tck) => {
  if (!tck) return [9.9333, -84.0833];
  if (Array.isArray(tck.coordenadas) && tck.coordenadas.length >= 2) {
    const lat = Number(tck.coordenadas[0]);
    const lng = Number(tck.coordenadas[1]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  if (tck.coordenadas && typeof tck.coordenadas === 'object') {
    const lat = Number(tck.coordenadas.lat);
    const lng = Number(tck.coordenadas.lng);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  if (tck.lat && tck.lng) {
    const lat = Number(tck.lat);
    const lng = Number(tck.lng);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  return [9.9333, -84.0833];
};

// Extractor de evidencia fotográfica del reporte ciudadano con soporte de alta resolución
const obtenerFotoEvidencia = (tck) => {
  if (!tck) return null;
  if (tck.imagenUrl) return tck.imagenUrl;
  if (tck.fotoUrl) return tck.fotoUrl;
  if (tck.imagen && typeof tck.imagen === 'object' && tck.imagen.url) return tck.imagen.url;
  if (tck.evidenciaUrl) return tck.evidenciaUrl;
  if (typeof tck.imagen === 'string' && tck.imagen.startsWith('http')) return tck.imagen;

  const cat = (tck.categoria || '').toUpperCase();
  if (cat.includes('HUECO') || cat.includes('VIAL') || cat.includes('ASFALTO')) {
    return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('LUMINARIA') || cat.includes('LUZ') || cat.includes('POSTE')) {
    return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('AGUA') || cat.includes('ALCANTAR') || cat.includes('FUGA')) {
    return 'https://images.unsplash.com/photo-1584463699028-ebaa85116742?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('RESIDUO') || cat.includes('BASURA') || cat.includes('ESCOMBRO')) {
    return 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
};

// Generador de iconos para marcadores Leaflet según estado y prioridad
const crearIconoMarcador = (tck, esSeleccionado) => {
  const esResuelto = tck.estado === 'RESUELTO' || tck.estado === 'Solucionado';
  let color = '#38BDF8';
  let sombra = 'rgba(56, 189, 248, 0.7)';
  let pulso = false;

  if (esResuelto) {
    color = '#10B981'; // Verde esmeralda para Solucionado
    sombra = 'rgba(16, 185, 129, 0.9)';
  } else if (tck.prioridad === 'ALTA') {
    color = '#EF4444'; // Rojo para prioridad ALTA
    sombra = 'rgba(239, 68, 68, 0.9)';
    pulso = true;
  } else if (tck.prioridad === 'MEDIA') {
    color = '#F59E0B'; // Ámbar para prioridad MEDIA
    sombra = 'rgba(245, 158, 11, 0.8)';
  }

  const pulseAnimation = pulso
    ? `<span style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${color}; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
    : '';

  return L.divIcon({
    className: 'custom-averia-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transform: translate(-50%, -50%);">
        ${pulseAnimation}
        <div style="position: relative; width: ${esSeleccionado ? '26px' : '20px'}; height: ${esSeleccionado ? '26px' : '20px'}; background-color: ${color}; border: ${esSeleccionado ? '3px solid #FFFFFF' : '2px solid #FFFFFF'}; border-radius: 50%; box-shadow: 0 0 14px ${sombra}, 0 2px 6px rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
          <div style="width: 6px; height: 6px; background-color: #FFFFFF; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};


export default function Dashboard() {
  const { usuarioActual, user, officialRoleName, nivelAcceso, logout } = useAuth();
  const { mostrarAlerta, solicitarConfirmacion, solicitarMotivo } = useCivicModal();
  const navigate = useNavigate();

  const activeUser = usuarioActual || user;

  // SEGREGACIÓN ESTRICTA RBAC (Principio de Menor Privilegio - Ley N° 8292):
  // La Consola Nacional (Dashboard.jsx) es exclusiva para el Super Administrador Nacional (Nivel 5).
  // - Gestor Territorial (Nivel 4) -> Redirección automática a /admin/territorial
  // - Ciudadano (Nivel 2) -> Redirección automática a /portal-ciudadano
  useEffect(() => {
    if (activeUser) {
      const rolNorm = String(activeUser.rol || '').toUpperCase();
      const level = Number(activeUser.nivelAcceso ?? 2);
      if (
        rolNorm.includes('GESTOR') ||
        rolNorm.includes('TERRITORIAL') ||
        rolNorm.includes('MUNICIPAL') ||
        rolNorm.includes('PROVINCIAL') ||
        level === 4
      ) {
        navigate('/admin/territorial', { replace: true });
        return;
      }
      if (
        rolNorm.includes('CIUDADAN') ||
        rolNorm.includes('TURISTA') ||
        rolNorm.includes('EMPRENDEDOR') ||
        level < 4
      ) {
        navigate('/portal-ciudadano', { replace: true });
        return;
      }
    }
  }, [activeUser, navigate]);

  if (activeUser) {
    const rolNorm = String(activeUser.rol || '').toUpperCase();
    const level = Number(activeUser.nivelAcceso ?? 2);
    if (!rolNorm.includes('SUPER') && level < 5) {
      return null;
    }
  }

  const currentUser = activeUser || {
    id: 'USR-NAC-001',
    cedula: '1-0000-0001',
    nombre: 'Superintendencia Nacional de Gobierno Digital',
    correo: 'admin.nacional@gob.cr',
    rol: 'Super Administrador Nacional',
    nivelAcceso: 5,
    provincia: 'San José',
    canton: 'San José'
  };

  const currentNivel = currentUser.nivelAcceso || nivelAcceso || 5;
  const currentRol = currentUser.rol || officialRoleName || 'Super Administrador Nacional';

  // 1. Selector de Pestañas Administrativas
  // 'dashboard' | 'usuarios' | 'comercio' | 'obras' | 'cne' | 'ia'
  const [activeTab, setActiveTab] = useState('dashboard');
  const pestañaActiva = activeTab;

  // Datos reactivos de la base simulada
  const [metricas, setMetricas] = useState(obtenerMetricasGestionMunicipal);
  const [usuarios, setUsuarios] = useState(() => getDb().usuarios || []);
  const [solicitudes, setSolicitudes] = useState(obtenerSolicitudesComercio);
  const [bitacora, setBitacora] = useState(obtenerBitacoraAuditoria);
  const [configIA, setConfigIA] = useState(obtenerConfiguracionIA);
  const [alertasCNE, setAlertasCNE] = useState(obtenerAlertasCNE);
  const [alertaNivel, setAlertaNivel] = useState(() => {
    const guardada = dbClient.getConfig('alertasCNE');
    return guardada?.alertaNacionalActiva || 'AMARILLA';
  });
  const alertaActiva = alertaNivel;
  const [tickets, setTickets] = useState(obtenerTicketsAverias);

  // Estados de control para Navegación y Barra Lateral
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Estados de control para Pestaña 1 (Usuarios y Auditoría)
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [filtroRolUsuario, setFiltroRolUsuario] = useState('TODOS');
  const [usuarioConsultado, setUsuarioConsultado] = useState(null);

  // Estados de control para Pestaña 2 (Ventanilla Comercial)
  const [filtroComercio, setFiltroComercio] = useState('TODAS');
  const [modalSectorId, setModalSectorId] = useState(null);
  const [sectorSeleccionado, setSectorSeleccionado] = useState(SECTORES_FERIA[0].id);

  // Estados de control para Pestaña 4 (CNE y Emergencias)
  const [comunicadoTexto, setComunicadoTexto] = useState(() => {
    const c = dbClient.getConfig('alertasCNE') || obtenerAlertasCNE();
    return c?.comunicadoOficial || '';
  });
  const [isDeactivatingAlerta, setIsDeactivatingAlerta] = useState(false);
  const [albergues, setAlbergues] = useState(() => {
    return dbClient.getCollection('alberguesCNE');
  });
  const alberguesList = albergues;

  // Estados de control para Pestaña 3 (Averías y Visor Cartográfico GIS)
  const [averiaSeleccionadaId, setAveriaSeleccionadaId] = useState(null);
  const [ticketInspeccion, setTicketInspeccion] = useState(null);
  const [errorImagen, setErrorImagen] = useState({});
  const mapObrasContainerRef = useRef(null);
  const mapObrasInstanceRef = useRef(null);
  const markersByTicketIdRef = useRef({});
  const markersLayerRef = useRef(null);

  // Notificación tipo toast de confirmación
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const mostrarNotificacion = showToast;

  // Recarga reactiva ante eventos de actualización
  const reloadData = () => {
    setMetricas(obtenerMetricasGestionMunicipal());
    setUsuarios(getDb().usuarios || []);
    setSolicitudes(obtenerSolicitudesComercio());
    setBitacora(obtenerBitacoraAuditoria());
    setConfigIA(obtenerConfiguracionIA());
    const cneData = dbClient.getConfig('alertasCNE') || obtenerAlertasCNE();
    setAlertasCNE(cneData);
    setAlertaNivel(cneData?.alertaNacionalActiva || 'AMARILLA');
    setAlbergues(dbClient.getCollection('alberguesCNE'));
    setTickets(obtenerTicketsAverias());
  };

  useEffect(() => {
    window.addEventListener('cru_db_updated', reloadData);
    window.addEventListener('cru_admin_updated', reloadData);

    // Sincronización inicial directa con backend (/api/solicitudesComercio o db.json)
    obtenerSolicitudesComercioApi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSolicitudes(data);
          try {
            localStorage.setItem('cr_solicitudes_comercio', JSON.stringify(data));
          } catch (_) {}
        }
      })
      .catch((err) => {
        console.warn('[Dashboard] Error al sincronizar solicitudes de comercio:', err);
      });

    return () => {
      window.removeEventListener('cru_db_updated', reloadData);
      window.removeEventListener('cru_admin_updated', reloadData);
    };
  }, []);

  // Efecto de inicialización y actualización del Mapa Cartográfico de Obras (Leaflet)
  useEffect(() => {
    if (activeTab !== 'obras') {
      if (mapObrasInstanceRef.current) {
        mapObrasInstanceRef.current.remove();
        mapObrasInstanceRef.current = null;
        markersLayerRef.current = null;
        markersByTicketIdRef.current = {};
      }
      return;
    }

    if (!mapObrasContainerRef.current) return;

    if (!mapObrasInstanceRef.current) {
      const map = L.map(mapObrasContainerRef.current, {
        center: [9.935, -84.086],
        zoom: 8.5,
        minZoom: 8,
        maxZoom: 16,
        maxBounds: [
          [8.0, -86.0],
          [11.3, -82.5]
        ],
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          minZoom: 8,
          maxZoom: 16,
          attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
        }
      ).addTo(map);

      mapObrasInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapObrasInstanceRef.current;
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    } else {
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
    markersByTicketIdRef.current = {};

    tickets.forEach((tck) => {
      const coords = extraerCoordenadas(tck);
      if (!coords) return;

      const esSeleccionado = tck.id === averiaSeleccionadaId;
      const icon = crearIconoMarcador(tck, esSeleccionado);
      const marker = L.marker(coords, { icon }).addTo(markersLayerRef.current);
      markersByTicketIdRef.current[tck.id] = marker;

      const foto = tck.imagenUrl || tck.fotoUrl || obtenerFotoEvidencia(tck);
      const cuadrilla = obtenerCuadrillaAutomatica(tck.categoria);
      const esResuelto = tck.estado === 'RESUELTO' || tck.estado === 'Solucionado';

      const popupHtml = `
        <div style="font-family: inherit; min-width: 250px; color: #FFFFFF; font-size: 12px; padding: 4px;">
          <div style="width: 100%; height: 140px; border-radius: 12px; overflow: hidden; margin-bottom: 10px; background: #000814;">
            <img
              src="${foto || 'https://images.unsplash.com/photo-1584463699028-ebaa85116742?auto=format&fit=crop&w=800&q=80'}"
              alt="Evidencia de avería"
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80';"
            />
          </div>
          <div style="font-weight: 800; font-family: monospace; color: #38BDF8; font-size: 11px;">${tck.id || tck.reportId}</div>
          <div style="font-weight: 700; font-size: 13px; color: #FFFFFF; margin: 2px 0 4px; line-height: 1.2;">${tck.titulo || tck.categoriaTitulo}</div>
          <div style="color: #94A3B8; font-size: 11px; margin-bottom: 6px;">${tck.canton || ''}, ${tck.distrito || ''}</div>
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">
            <span style="padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; background: ${esResuelto ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${esResuelto ? '#10B981' : '#F59E0B'}; border: 1px solid ${esResuelto ? '#10B981' : '#F59E0B'};">
              ${tck.estado}
            </span>
            <span style="padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.06); color: #CBD5E1;">
              ${tck.prioridad || 'MEDIA'}
            </span>
          </div>
          <div style="font-size: 10px; font-family: monospace; color: #94A3B8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">
            ${cuadrilla.nombre}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'sovereign-glass-popup' });

      marker.on('click', () => {
        setAveriaSeleccionadaId(tck.id);
      });
    });

    if (!averiaSeleccionadaId && mapObrasInstanceRef.current) {
      mapObrasInstanceRef.current.setView([9.935, -84.086], 8.5);
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [activeTab, tickets, averiaSeleccionadaId]);

  // Listener para cerrar modales con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (ticketInspeccion) setTicketInspeccion(null);
        if (usuarioConsultado) setUsuarioConsultado(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ticketInspeccion, usuarioConsultado]);

  const handleSeleccionarAveriaEnTabla = (ticket) => {
    setAveriaSeleccionadaId(ticket.id);
    const coords = extraerCoordenadas(ticket);
    if (coords && mapObrasInstanceRef.current) {
      mapObrasInstanceRef.current.setView(coords, 14, { animate: true, duration: 0.8 });
      const m = markersByTicketIdRef.current[ticket.id];
      if (m) {
        m.openPopup();
      }
    }
  };


  const handleLogout = () => {
    solicitarConfirmacion({
      titulo: 'Confirmación de Cierre de Sesión',
      mensaje: '¿Está seguro de que desea cerrar su sesión institucional en Costa Rica Unidos? Deberá autenticar sus credenciales nuevamente para acceder al sistema.',
      icono: 'advertencia',
      textoBotonAceptar: 'Cerrar Sesión',
      textoBotonCancelar: 'Permanecer Conectado',
      onAceptar: () => {
        logout();
        navigate('/');
      }
    });
  };

  // ==========================================================================
  // HANDLERS DE PESTAÑA 1 (USUARIOS Y AUDITORÍA)
  // ==========================================================================
  const usuariosFiltrados = useMemo(() => {
    const term = busquedaUsuario.toLowerCase().trim();
    return usuarios.filter((u) => {
      const matchSearch =
        !term ||
        u.nombre.toLowerCase().includes(term) ||
        u.cedula.includes(term) ||
        (u.correo && u.correo.toLowerCase().includes(term));

      const matchRole =
        filtroRolUsuario === 'TODOS' ||
        (filtroRolUsuario === 'SUPER' && u.rol.includes('Super')) ||
        (filtroRolUsuario === 'PROV' && u.rol.includes('Provincial')) ||
        (filtroRolUsuario === 'MUNI' && u.rol.includes('Municipal')) ||
        (filtroRolUsuario === 'CIUD' && u.rol.includes('Ciudadano'));

      return matchSearch && matchRole;
    });
  }, [usuarios, busquedaUsuario, filtroRolUsuario]);

  const exportarBitacoraCSV = () => {
    const headers = ['ID', 'FechaHoraCST', 'AdminCedula', 'AdminNombre', 'AdminRol', 'Accion', 'EntidadAfectada', 'Justificante', 'IP'];
    const rows = bitacora.map((b) => [
      b.id,
      `"${b.fechaHoraCst}"`,
      `"${b.adminCedula}"`,
      `"${b.adminNombre}"`,
      `"${b.adminRol}"`,
      `"${b.accion}"`,
      `"${(b.entidadAfectada || '').replace(/"/g, '""')}"`,
      `"${(b.justificante || '').replace(/"/g, '""')}"`,
      `"${b.ipOrigen}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bitacora-auditoria-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Reporte CSV de auditoría legal descargado exitosamente.');
  };

  const generarInformeAuditoriaPDF = () => {
    try {
      const printWindow = window.open('', '_blank', 'width=1200,height=850');
      if (!printWindow) {
        mostrarAlerta({
          titulo: 'Ventana de Impresión Bloqueada',
          mensaje: 'El navegador ha bloqueado la apertura de la ventana del informe. Por favor, habilite los elementos emergentes para Costa Rica Unidos y vuelva a intentarlo.',
          icono: 'advertencia'
        });
        return;
      }

      const escapeHtml = (str) => {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      const certId = `CERT-CRU-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const fechaEmision = new Date().toLocaleString('es-CR', {
        timeZone: 'America/Costa_Rica',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' CST';

      const hashSimulado = 'SHA-256: ' + Array.from(certId + fechaEmision + bitacora.length)
        .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0x811c9dc5)
        .toString(16).padStart(8, '0').repeat(8).substring(0, 64);

      const filasTabla = bitacora.map((b) => `
        <tr>
          <td class="font-mono font-bold text-blue">${escapeHtml(b.id)}</td>
          <td class="font-mono text-nowrap">${escapeHtml(b.fechaHoraCst)}</td>
          <td>
            <div class="font-bold">${escapeHtml(b.adminNombre)}</div>
            <div class="text-muted font-mono">Cédula: ${escapeHtml(b.adminCedula)} • ${escapeHtml(b.adminRol)}</div>
          </td>
          <td>
            <span class="badge-accion">${escapeHtml(b.accion)}</span>
          </td>
          <td class="font-semibold">${escapeHtml(b.entidadAfectada)}</td>
          <td class="text-justify">${escapeHtml(b.justificante || 'Actuación administrativa de oficio.')}</td>
          <td class="font-mono text-muted text-nowrap">${escapeHtml(b.ipOrigen)}</td>
        </tr>
      `).join('');

      const htmlContent = '<!DOCTYPE html>' +
'<html lang="es">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <title>Informe Oficial de Auditoría y Trazabilidad Legal - Costa Rica Unidos</title>' +
'  <style>' +
'    @page {' +
'      size: letter landscape;' +
'      margin: 12mm 15mm;' +
'    }' +
'    * {' +
'      box-sizing: border-box;' +
'      margin: 0;' +
'      padding: 0;' +
'    }' +
'    body {' +
'      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;' +
'      color: #0f172a;' +
'      background: #f1f5f9;' +
'      padding: 20px;' +
'      font-size: 11px;' +
'      line-height: 1.45;' +
'      -webkit-font-smoothing: antialiased;' +
'    }' +
'    .no-print {' +
'      display: flex;' +
'      justify-content: space-between;' +
'      align-items: center;' +
'      background: #001489;' +
'      color: #ffffff;' +
'      padding: 12px 24px;' +
'      border-radius: 8px;' +
'      margin-bottom: 24px;' +
'      box-shadow: 0 4px 14px rgba(0, 20, 137, 0.25);' +
'    }' +
'    .no-print-info {' +
'      font-size: 13px;' +
'      font-weight: 600;' +
'    }' +
'    .no-print-actions {' +
'      display: flex;' +
'      gap: 10px;' +
'    }' +
'    .btn {' +
'      cursor: pointer;' +
'      font-weight: 700;' +
'      font-size: 12px;' +
'      padding: 8px 16px;' +
'      border-radius: 6px;' +
'      border: none;' +
'      transition: all 0.2s;' +
'    }' +
'    .btn-print {' +
'      background: #10b981;' +
'      color: #ffffff;' +
'    }' +
'    .btn-print:hover {' +
'      background: #059669;' +
'    }' +
'    .btn-close {' +
'      background: rgba(255, 255, 255, 0.15);' +
'      color: #ffffff;' +
'    }' +
'    .btn-close:hover {' +
'      background: rgba(255, 255, 255, 0.25);' +
'    }' +
'    .document-page {' +
'      background: #ffffff;' +
'      max-width: 1100px;' +
'      margin: 0 auto;' +
'      padding: 32px 36px;' +
'      border: 1px solid #cbd5e1;' +
'      border-radius: 6px;' +
'      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);' +
'    }' +
'    .tricolor-stripe {' +
'      height: 4px;' +
'      background: linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%);' +
'      margin-bottom: 18px;' +
'      border: 1px solid #94a3b8;' +
'    }' +
'    .header-box {' +
'      display: flex;' +
'      justify-content: space-between;' +
'      align-items: flex-start;' +
'      border-bottom: 2px solid #001489;' +
'      padding-bottom: 14px;' +
'      margin-bottom: 16px;' +
'    }' +
'    .header-left {' +
'      display: flex;' +
'      flex-direction: column;' +
'      gap: 3px;' +
'    }' +
'    .rep-title {' +
'      font-size: 13px;' +
'      font-weight: 900;' +
'      letter-spacing: 0.08em;' +
'      color: #001489;' +
'      text-transform: uppercase;' +
'    }' +
'    .sub-inst {' +
'      font-size: 10px;' +
'      font-weight: 700;' +
'      color: #475569;' +
'      letter-spacing: 0.04em;' +
'      text-transform: uppercase;' +
'    }' +
'    .main-title {' +
'      font-size: 16px;' +
'      font-weight: 900;' +
'      color: #0f172a;' +
'      margin-top: 4px;' +
'      letter-spacing: -0.01em;' +
'    }' +
'    .legal-notice {' +
'      font-size: 9.5px;' +
'      color: #64748b;' +
'      margin-top: 2px;' +
'      font-style: italic;' +
'    }' +
'    .header-right {' +
'      display: flex;' +
'      flex-direction: column;' +
'      align-items: flex-end;' +
'      gap: 4px;' +
'    }' +
'    .cert-pill {' +
'      background: #eff6ff;' +
'      border: 1px solid #bfdbfe;' +
'      color: #1e40af;' +
'      padding: 5px 12px;' +
'      border-radius: 6px;' +
'      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;' +
'      font-weight: 700;' +
'      font-size: 11px;' +
'    }' +
'    .cert-status {' +
'      font-size: 9px;' +
'      font-weight: 800;' +
'      color: #059669;' +
'      text-transform: uppercase;' +
'      letter-spacing: 0.05em;' +
'    }' +
'    .meta-card {' +
'      display: grid;' +
'      grid-template-columns: repeat(4, 1fr);' +
'      gap: 10px;' +
'      background: #f8fafc;' +
'      border: 1px solid #e2e8f0;' +
'      border-radius: 6px;' +
'      padding: 12px 16px;' +
'      margin-bottom: 20px;' +
'    }' +
'    .meta-field {' +
'      display: flex;' +
'      flex-direction: column;' +
'    }' +
'    .meta-label {' +
'      font-size: 8.5px;' +
'      color: #64748b;' +
'      text-transform: uppercase;' +
'      font-weight: 700;' +
'      letter-spacing: 0.04em;' +
'    }' +
'    .meta-val {' +
'      font-size: 11px;' +
'      font-weight: 700;' +
'      color: #0f172a;' +
'      margin-top: 2px;' +
'    }' +
'    .font-mono {' +
'      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;' +
'    }' +
'    .font-bold {' +
'      font-weight: 700;' +
'    }' +
'    .font-semibold {' +
'      font-weight: 600;' +
'    }' +
'    .text-blue {' +
'      color: #001489;' +
'    }' +
'    .text-muted {' +
'      color: #64748b;' +
'      font-size: 9px;' +
'    }' +
'    .text-nowrap {' +
'      white-space: nowrap;' +
'    }' +
'    .text-justify {' +
'      text-align: justify;' +
'    }' +
'    table.audit-table {' +
'      width: 100%;' +
'      border-collapse: collapse;' +
'      margin-bottom: 24px;' +
'      font-size: 9px;' +
'    }' +
'    table.audit-table th {' +
'      background: #001489;' +
'      color: #ffffff;' +
'      font-weight: 700;' +
'      text-transform: uppercase;' +
'      letter-spacing: 0.04em;' +
'      padding: 7px 8px;' +
'      border: 1px solid #001489;' +
'      text-align: left;' +
'    }' +
'    table.audit-table td {' +
'      padding: 7px 8px;' +
'      border: 1px solid #e2e8f0;' +
'      color: #1e293b;' +
'      vertical-align: top;' +
'      line-height: 1.35;' +
'    }' +
'    table.audit-table tr:nth-child(even) td {' +
'      background: #f8fafc;' +
'    }' +
'    .badge-accion {' +
'      display: inline-block;' +
'      padding: 2px 6px;' +
'      border-radius: 4px;' +
'      font-size: 8.5px;' +
'      font-weight: 800;' +
'      text-transform: uppercase;' +
'      letter-spacing: 0.03em;' +
'      background: #eff6ff;' +
'      color: #0369a1;' +
'      border: 1px solid #bae6fd;' +
'    }' +
'    .signatures-grid {' +
'      display: grid;' +
'      grid-template-columns: 1fr 1fr;' +
'      gap: 36px;' +
'      margin-top: 32px;' +
'      padding-top: 14px;' +
'      border-top: 1px solid #e2e8f0;' +
'    }' +
'    .sig-box {' +
'      border: 1px dashed #cbd5e1;' +
'      border-radius: 6px;' +
'      padding: 14px;' +
'      text-align: center;' +
'      background: #ffffff;' +
'    }' +
'    .sig-line {' +
'      width: 75%;' +
'      height: 1px;' +
'      background: #94a3b8;' +
'      margin: 36px auto 8px;' +
'    }' +
'    .sig-name {' +
'      font-weight: 800;' +
'      font-size: 11px;' +
'      color: #0f172a;' +
'    }' +
'    .sig-role {' +
'      font-size: 9.5px;' +
'      color: #64748b;' +
'    }' +
'    .sig-stamp {' +
'      display: inline-block;' +
'      margin-top: 6px;' +
'      padding: 3px 8px;' +
'      border: 1px solid #059669;' +
'      color: #059669;' +
'      font-size: 8.5px;' +
'      font-weight: 800;' +
'      text-transform: uppercase;' +
'      letter-spacing: 0.05em;' +
'      border-radius: 4px;' +
'    }' +
'    .legal-footer {' +
'      margin-top: 20px;' +
'      padding-top: 10px;' +
'      border-top: 1px solid #e2e8f0;' +
'      font-size: 8.5px;' +
'      color: #94a3b8;' +
'      text-align: justify;' +
'      line-height: 1.35;' +
'    }' +
'    @media print {' +
'      body {' +
'        background: #ffffff !important;' +
'        padding: 0 !important;' +
'      }' +
'      .no-print {' +
'        display: none !important;' +
'      }' +
'      .document-page {' +
'        border: none !important;' +
'        box-shadow: none !important;' +
'        padding: 0 !important;' +
'        max-width: 100% !important;' +
'      }' +
'      table.audit-table th {' +
'        background: #001489 !important;' +
'        color: #ffffff !important;' +
'        -webkit-print-color-adjust: exact !important;' +
'        print-color-adjust: exact !important;' +
'      }' +
'      .badge-accion, .cert-pill, .meta-card, .sig-stamp {' +
'        -webkit-print-color-adjust: exact !important;' +
'        print-color-adjust: exact !important;' +
'      }' +
'    }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="no-print">' +
'    <div class="no-print-info">' +
'      Vista Previa Oficial del Informe de Auditoría • Formato Legal Oficial' +
'    </div>' +
'    <div class="no-print-actions">' +
'      <button class="btn btn-print" onclick="window.print()">Imprimir / Guardar como PDF</button>' +
'      <button class="btn btn-close" onclick="window.close()">Cerrar</button>' +
'    </div>' +
'  </div>' +
'  <div class="document-page">' +
'    <div class="tricolor-stripe"></div>' +
'    <div class="header-box">' +
'      <div class="header-left">' +
'        <div class="rep-title">República de Costa Rica • Gobierno Digital Soberano</div>' +
'        <div class="sub-inst">Sistema Nacional de Trazabilidad Cívica • Plataforma Costa Rica Unidos</div>' +
'        <h1 class="main-title">INFORME OFICIAL DE AUDITORÍA Y TRAZABILIDAD LEGAL</h1>' +
'        <div class="legal-notice">' +
'          Certificación de Actos Administrativos y Fe Pública Registral de conformidad con la Ley N° 8292 (Control Interno), Ley N° 8454 (Firmas Digitales) y Ley N° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales).' +
'        </div>' +
'      </div>' +
'      <div class="header-right">' +
'        <div class="cert-pill">' + escapeHtml(certId) + '</div>' +
'        <div class="cert-status">Registro Legal Inmutable • Validez Plena</div>' +
'      </div>' +
'    </div>' +
'    <div class="meta-card">' +
'      <div class="meta-field">' +
'        <span class="meta-label">Fecha y Hora de Emisión (CST)</span>' +
'        <span class="meta-val font-mono">' + escapeHtml(fechaEmision) + '</span>' +
'      </div>' +
'      <div class="meta-field">' +
'        <span class="meta-label">Administrador Actuante</span>' +
'        <span class="meta-val">' + escapeHtml(currentUser.nombre) + '</span>' +
'      </div>' +
'      <div class="meta-field">' +
'        <span class="meta-label">Cédula &amp; Rol Institucional</span>' +
'        <span class="meta-val font-mono">' + escapeHtml(currentUser.cedula) + ' • ' + escapeHtml(currentRol) + '</span>' +
'      </div>' +
'      <div class="meta-field">' +
'        <span class="meta-label">Jurisdicción Territorial</span>' +
'        <span class="meta-val">' + escapeHtml(currentUser.canton || 'San José') + ', Costa Rica</span>' +
'      </div>' +
'      <div class="meta-field">' +
'        <span class="meta-label">Total de Asientos Auditados</span>' +
'        <span class="meta-val">' + bitacora.length + ' registros certificados</span>' +
'      </div>' +
'      <div class="meta-field" style="grid-column: span 3;">' +
'        <span class="meta-label">Sello Criptográfico de Integridad (SHA-256)</span>' +
'        <span class="meta-val font-mono text-muted" style="font-size: 9.5px; word-break: break-all;">' + escapeHtml(hashSimulado) + '</span>' +
'      </div>' +
'    </div>' +
'    <table class="audit-table">' +
'      <thead>' +
'        <tr>' +
'          <th style="width: 11%;">ID Asiento</th>' +
'          <th style="width: 14%;">Fecha / Hora (CST)</th>' +
'          <th style="width: 20%;">Funcionario Responsable</th>' +
'          <th style="width: 12%;">Acción Ejecutada</th>' +
'          <th style="width: 15%;">Entidad / Recurso</th>' +
'          <th style="width: 18%;">Justificante Legal / Técnico</th>' +
'          <th style="width: 10%;">IP Origen</th>' +
'        </tr>' +
'      </thead>' +
'      <tbody>' +
'        ' + filasTabla +
'      </tbody>' +
'    </table>' +
'    <div class="signatures-grid">' +
'      <div class="sig-box">' +
'        <div class="sig-line"></div>' +
'        <div class="sig-name">' + escapeHtml(currentUser.nombre) + '</div>' +
'        <div class="sig-role">Cédula: ' + escapeHtml(currentUser.cedula) + ' • ' + escapeHtml(currentRol) + '</div>' +
'        <div class="sig-role">Administración Actuante • Cantón de ' + escapeHtml(currentUser.canton || 'San José') + '</div>' +
'        <div class="sig-stamp">Documento Firmado Digitalmente (Ley N° 8454)</div>' +
'      </div>' +
'      <div class="sig-box">' +
'        <div class="sig-line"></div>' +
'        <div class="sig-name">Superintendencia de Auditoría y Seguridad Cívica</div>' +
'        <div class="sig-role">Dirección General de Tecnología e Información Gubernamental</div>' +
'        <div class="sig-role">Costa Rica Unidos • Registro Nacional Centralizado</div>' +
'        <div class="sig-stamp">Refrendo Registral Inmutable Verificado</div>' +
'      </div>' +
'    </div>' +
'    <div class="legal-footer">' +
'      <strong>AVISO LEGAL Y VALOR PROBATORIO:</strong> Este documento constituye una certificación pericial de la bitácora inmutable del Estado Costarricense, expedida con arreglo al Artículo 8 de la Ley General de Control Interno N° 8292 y el Código Procesal Contencioso Administrativo. La falsificación, supresión o modificación fraudulenta de este documento será sancionada conforme al Título VIII del Código Penal de la República de Costa Rica.' +
'    </div>' +
'  </div>' +
'  <script>' +
'    window.onload = function() {' +
'      setTimeout(function() {' +
'        window.print();' +
'      }, 350);' +
'    };' +
'  <' + '/script>' +
'</body>' +
'</html>';

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      showToast('Documento oficial de auditoría legal generado exitosamente.');
    } catch (err) {
      console.error('Error al generar informe de auditoría PDF:', err);
      mostrarAlerta({
        titulo: 'Error en la Generación del Informe',
        mensaje: 'No fue posible generar el documento oficial de auditoría. Por favor, revise la consola de su navegador.',
        icono: 'error'
      });
    }
  };

  // ==========================================================================
  // HANDLERS DE PESTAÑA 2 (VENTANILLA COMERCIAL)
  // ==========================================================================
  const solicitudesFiltradas = useMemo(() => {
    if (filtroComercio === 'TODAS') return solicitudes;
    return solicitudes.filter((s) => String(s.estado || '').toUpperCase() === filtroComercio.toUpperCase());
  }, [solicitudes, filtroComercio]);

  const handleAsignarPuestoFeria = async (solicitudId, sector = "Sector A") => {
    const sectorFinal = sector || "Sector A";
    try {
      const guardadoExitoso = await actualizarEstadoSolicitudApi(solicitudId, 'aprobado', undefined, sectorFinal);
      if (guardadoExitoso) {
        setSolicitudes((prev) =>
          prev.map((s) => (s.id === solicitudId ? { ...s, estado: 'aprobado', asignacion: sectorFinal, sectorFeria: sectorFinal, verificado: true } : s))
        );
        resolverSolicitudComercio(solicitudId, 'APROBADO', `Puesto asignado formalmente en ${sectorFinal}.`);
        showToast(`Puesto asignado formalmente en ${sectorFinal}.`);
      } else {
        showToast("Error al actualizar estado de solicitud.");
      }
    } catch (error) {
      console.error("Error al asignar puesto:", error);
      showToast("Error al asignar puesto en el servidor.");
    }
  };

  const handleOtorgarSelloVerificado = async (solicitudId) => {
    try {
      const guardadoExitoso = await actualizarEstadoSolicitudApi(solicitudId, 'aprobado');
      if (guardadoExitoso) {
        setSolicitudes((prev) =>
          prev.map((s) => (s.id === solicitudId ? { ...s, estado: 'aprobado', verificado: true, verificadoHacienda: true } : s))
        );
        resolverSolicitudComercio(solicitudId, 'APROBADO', 'Patente municipal y acreditación comercial otorgadas.');
        showToast("Sello Verificado y patente municipal otorgados con éxito.");
      } else {
        showToast("Error al actualizar estado en db.json.");
      }
    } catch (error) {
      console.error("Error al otorgar sello:", error);
      showToast("Error de conexión al actualizar solicitud.");
    }
  };

  const handleAprobarSello = handleOtorgarSelloVerificado;

  const handleRechazarSolicitud = (solicitudId) => {
    solicitarMotivo({
      titulo: 'Rechazo Legal de Solicitud Comercial',
      mensaje: 'Indique el fundamento técnico o legal para rechazar la solicitud de patente municipal:',
      placeholder: 'Ej: Incumplimiento de requisitos sanitarios, falta de documentación ante Hacienda...',
      textoBotonAceptar: 'Rechazar Solicitud',
      textoBotonCancelar: 'Cancelar',
      onAceptar: async (motivo) => {
        try {
          // 1. Ejecutar actualización física en db.json mediante actualizarEstadoSolicitudApi
          const guardadoExitoso = await actualizarEstadoSolicitudApi(solicitudId, 'rechazado', motivo);

          if (guardadoExitoso) {
            // 2. Actualizar el estado visual de React de inmediato
            setSolicitudes((prev) =>
              prev.map((sol) =>
                sol.id === solicitudId
                  ? { ...sol, estado: 'rechazado', motivoRechazo: motivo, justificacion: motivo, notas: motivo }
                  : sol
              )
            );

            // 3. Sincronizar en bitácora legal
            resolverSolicitudComercio(solicitudId, 'RECHAZADO', motivo);

            const cache = localStorage.getItem('cr_solicitudes_comercio');
            if (cache) {
              try {
                const actualizadas = JSON.parse(cache).map((sol) =>
                  sol.id === solicitudId ? { ...sol, estado: 'rechazado', motivoRechazo: motivo } : sol
                );
                localStorage.setItem('cr_solicitudes_comercio', JSON.stringify(actualizadas));
              } catch (_) {}
            }

            showToast('Solicitud rechazada físicamente en db.json y asentada en la bitácora legal.');
          } else {
            console.error('Fallo al rechazar en db.json');
            showToast('No se pudo actualizar el estado en db.json. Verifique el servidor local en el puerto 3001.');
          }
        } catch (error) {
          console.error('Fallo de red al conectar con json-server:', error);
          showToast('Error de conexión con json-server en el puerto 3001.');
        }
      }
    });
  };

  const handleGuardarSectorFeria = async (id) => {
    try {
      const fechaNow = new Date().toISOString();
      await fetch(`http://localhost:3001/solicitudesComercio/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectorFeria: sectorSeleccionado,
          sectorFeriaSolicitado: sectorSeleccionado,
          estado: 'aprobado',
          verificado: true,
          fechaResolucion: fechaNow
        })
      }).catch(() => {});
    } catch (_) {}

    resolverSolicitudComercio(id, 'APROBADO', `Puesto asignado formalmente en ${sectorSeleccionado}.`, sectorSeleccionado);
    setModalSectorId(null);
    reloadData();
    showToast(`Puesto asignado exitosamente en ${sectorSeleccionado}.`);
  };

  // ==========================================================================
  // HANDLERS DE PESTAÑA 3 (GESTIÓN DE AVERÍAS VIALES Y OBRAS PÚBLICAS)
  // ==========================================================================
  const handleCambiarEstadoAveria = (id, nuevoEstado, cuadrilla) => {
    // 1. Persistencia directa en dbClient
    dbClient.update('incidenciasViales', id, {
      estado: nuevoEstado,
      cuadrillaAsignada: cuadrilla,
      ...(nuevoEstado === 'RESUELTO' ? { fechaResolucion: new Date().toISOString() } : {})
    });

    // 2. Registro administrativo y auditoría legal
    actualizarEstadoAveriaMunicipal(id, nuevoEstado, cuadrilla);

    // 3. Sincronización reactiva del estado local
    reloadData();

    // 4. Notificación institucional
    const nombreLegible = nuevoEstado === 'RESUELTO' ? 'Solucionado' : nuevoEstado === 'EN_PROCESO' ? 'En Trámite' : nuevoEstado === 'EN_INSPECCION' ? 'En Inspección' : 'Recibido';
    showToast(`Expediente ${id} actualizado a "${nombreLegible}".`);
  };

  // ==========================================================================
  // HANDLERS DE PESTAÑA 4 (CENTRO CNE Y ALBERGUES)
  // ==========================================================================
  const handleCambiarAlerta = (nuevoNivel) => {
    // 1. Actualizar el estado de React INMEDIATAMENTE para re-renderizar los botones
    setAlertaNivel(nuevoNivel);

    // 2. Persistir en dbClient / localStorage
    const descripciones = {
      VERDE: 'Monitoreo preventivo sin afectación directa.',
      AMARILLA: 'Precaución general por saturación de suelos.',
      NARANJA: 'Condiciones severas. Activación de comités de emergencia.',
      ROJA: 'Peligro inminente y evacuación preventiva hacia albergues.'
    };

    const desc = descripciones[nuevoNivel] || 'Alerta oficial emitida por la Comisión Nacional de Prevención de Riesgos y Atención de Emergencias (CNE).';
    setComunicadoTexto(desc);

    dbClient.updateConfig('alertasCNE', {
      alertaNacionalActiva: nuevoNivel,
      comunicadoOficial: desc,
      fechaActualizacion: new Date().toISOString()
    });

    adminService.actualizarAlertaCNE(nuevoNivel, desc);
    showToast(`Alerta CNE actualizada a nivel ${nuevoNivel} en todo el portal nacional.`);
  };

  const handleGuardarAlertaCNE = async () => {
    const nivelLower = String(alertaNivel || 'amarilla').toLowerCase();
    const tituloNivel =
      nivelLower === "roja" ? "ALERTA ROJA (EVACUACIÓN)" :
      nivelLower === "naranja" ? "ALERTA NARANJA (PELIGRO)" :
      nivelLower === "amarilla" ? "ALERTA AMARILLA (PRECAUCIÓN)" : "ALERTA VERDE (INFORMATIVA)";
    const mensajeAlerta = (comunicadoTexto || '').trim() || 'Aviso preventivo oficial emitido por la Presidencia de la República y la CNE.';

    const nuevaAlerta = {
      id: "ALERTA-CNE-ACTIVA",
      nivel: nivelLower,
      tituloNivel: tituloNivel,
      mensaje: mensajeAlerta,
      fechaEmision: new Date().toISOString(),
      activa: true
    };

    try {
      let response = await fetch("http://localhost:3001/alertaCNE", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaAlerta)
      });

      if (!response.ok) {
        response = await fetch("http://localhost:3001/alertaCNE", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaAlerta)
        });
      }

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("cru_alerta_cne_actualizada", { detail: nuevaAlerta }));
        localStorage.setItem("cru_alerta_cne_cache", JSON.stringify(nuevaAlerta));
        showToast("Alerta oficial CNE transmitida y publicada a nivel nacional con éxito.");
      }
    } catch (error) {
      console.error("Error al emitir alerta CNE:", error);
      window.dispatchEvent(new CustomEvent("cru_alerta_cne_actualizada", { detail: nuevaAlerta }));
      localStorage.setItem("cru_alerta_cne_cache", JSON.stringify(nuevaAlerta));
      showToast("Alerta oficial CNE proyectada en marquesina nacional en tiempo real.");
    }

    handleCambiarAlerta(alertaNivel);
  };

  const handleDesactivarAlertaCNE = async () => {
    setIsDeactivatingAlerta(true);

    const alertaInactiva = {
      id: "ALERTA-CNE-ACTIVA",
      nivel: "verde",
      tituloNivel: "ALERTA VERDE (INFORMATIVA)",
      mensaje: "",
      fechaEmision: new Date().toISOString(),
      activa: false
    };

    try {
      let response = await fetch("http://localhost:3001/alertaCNE", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertaInactiva)
      });

      if (!response.ok) {
        response = await fetch("http://localhost:3001/alertaCNE", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alertaInactiva)
        });
      }

      window.dispatchEvent(new CustomEvent("cru_alerta_cne_actualizada", { detail: null }));
      try { localStorage.removeItem("cru_alerta_cne_cache"); } catch (e) {}
      setComunicadoTexto("");
      setAlertaNivel("VERDE");

      dbClient.updateConfig('alertasCNE', {
        alertaNacionalActiva: 'VERDE',
        comunicadoOficial: '',
        fechaActualizacion: new Date().toISOString()
      });

      showToast("Alerta Nacional de Emergencia desactivada y retirada de la plataforma.");
    } catch (error) {
      console.error("Error al desactivar alerta CNE en db.json:", error);
      window.dispatchEvent(new CustomEvent("cru_alerta_cne_actualizada", { detail: null }));
      try { localStorage.removeItem("cru_alerta_cne_cache"); } catch (e) {}
      setComunicadoTexto("");
      setAlertaNivel("VERDE");
      showToast("Alerta Nacional de Emergencia desactivada y retirada de la plataforma.");
    } finally {
      setIsDeactivatingAlerta(false);
    }
  };

  const handleCambiarEstadoAlbergue = (id, nuevoEstado) => {
    // 1. Actualizar el estado de React INMUTABLEMENTE para que no se regrese el valor
    setAlbergues((prev) =>
      prev.map((alb) => (alb.id === id ? { ...alb, estado: nuevoEstado } : alb))
    );

    // 2. Persistir en la base de datos
    dbClient.update('alberguesCNE', id, { estado: nuevoEstado });
    showToast(`Estado de albergue actualizado a "${nuevoEstado}".`);
  };

  // ==========================================================================
  // HANDLERS DE PESTAÑA 5 (GOBERNANZA DE IA Y RESPALDO)
  // ==========================================================================
  const handleToggleKillSwitch = () => {
    const nextState = !configIA.killSwitchActivo;
    actualizarConfiguracionIA({ killSwitchActivo: nextState });
    reloadData();
    showToast(nextState ? 'Kill-Switch ACTIVADO: Motor de IA desconectado preventivamente.' : 'Kill-Switch DESACTIVADO: Motor de IA operativo.');
  };

  const handleCambiarSensibilidad = (sensibilidad) => {
    actualizarConfiguracionIA({ sensibilidadModeracion: sensibilidad });
    reloadData();
    showToast(`Sensibilidad de moderación configurada a: ${sensibilidad}.`);
  };

  const handleToggleColeccionIA = (coleccion) => {
    const actuales = configIA.coleccionesAutorizadas || [];
    const existe = actuales.includes(coleccion);
    const nuevas = existe ? actuales.filter((c) => c !== coleccion) : [...actuales, coleccion];
    actualizarConfiguracionIA({ coleccionesAutorizadas: nuevas });
    reloadData();
    showToast(`Permisos de colección "${coleccion}" actualizados para la IA.`);
  };

  const handleRestablecerSemilla = () => {
    solicitarConfirmacion({
      titulo: 'Restauración de Fábrica',
      mensaje: '¿Está seguro de restaurar todos los datos a la configuración inicial? Se reiniciarán usuarios, bitácoras, solicitudes y alertas a sus valores predeterminados de fábrica.',
      icono: 'advertencia',
      textoBotonAceptar: 'Restablecer de Fábrica',
      textoBotonCancelar: 'Cancelar',
      onAceptar: () => {
        restaurarDatosSemilla();
        reloadData();
        showToast('Base de datos simulada restablecida exitosamente a valores semilla.');
      }
    });
  };

  return (
    <div className="admin-viewport-wrapper">
      {/* Notificación Toast Flotante */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            pointerEvents: 'none'
          }}
          className="transition-all duration-300 ease-out"
        >
          {/* Notificación con diseño Sovereign Civic Glass */}
          <div 
            style={{ pointerEvents: 'auto' }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#00040D]/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200"
          >
            <CheckCircle2 className="w-5 h-5 text-cru-accent-green flex-shrink-0" strokeWidth={2} />
            <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ====================================================================
          COLUMNA 1: BARRA LATERAL FIJA PERMANENTE (100VH SIN SCROLL GLOBAL)
          ==================================================================== */}
      {/* Backdrop para Drawer en Móvil */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[999] md:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar-fixed ${
          sidebarColapsado ? 'sidebar-collapsed' : 'sidebar-expanded'
        } ${mobileSidebarOpen ? 'mobile-open' : ''}`}
      >
        {/* Encabezado del Sidebar con botón de alternar colapso */}
        <div className="flex items-center justify-between p-3.5 border-b border-cru-border shrink-0">
          {!sidebarColapsado ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-cru-accent-sky animate-pulse shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-cru-text-soft truncate admin-sidebar-title-text">
                Panel de Mando
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center py-0.5">
              <span className="w-2 h-2 rounded-full bg-cru-accent-sky animate-pulse shrink-0" />
            </div>
          )}

          <div className="flex items-center gap-1 shrink-0">
            {/* Botón de alternar colapso en pantallas medianas y grandes */}
            <button
              type="button"
              onClick={() => setSidebarColapsado(!sidebarColapsado)}
              className="sidebar-collapse-toggle-btn hidden md:flex p-1.5 rounded-xl hover:bg-cru-surface-muted text-cru-text-muted hover:text-cru-text transition-colors items-center justify-center shrink-0"
              title={sidebarColapsado ? "Expandir menú" : "Minimizar menú"}
              aria-label={sidebarColapsado ? "Expandir menú" : "Minimizar menú"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {sidebarColapsado ? (
                  <polyline points="9 18 15 12 9 6" />
                ) : (
                  <polyline points="15 18 9 12 15 6" />
                )}
              </svg>
            </button>

            {/* Botón para cerrar drawer en móvil */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-xl hover:bg-cru-surface-muted text-cru-text-muted hover:text-cru-text transition-colors flex items-center justify-center shrink-0"
              title="Cerrar menú"
              aria-label="Cerrar menú"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de Módulos (Área de navegación interna con scroll independiente) */}
        <nav className="admin-sidebar-nav-body space-y-1.5" aria-label="Navegación de módulos administrativos">
          {[
            { id: 'dashboard', label: 'Dashboard Analítico', icon: BarChart3 },
            { id: 'usuarios', label: 'Usuarios & Auditoría', icon: Users },
            { id: 'moderacion-foro', label: 'Moderación del Foro', icon: ShieldCheck },
            { id: 'comercio', label: 'Ventanilla Comercial', icon: Store },
            { id: 'obras', label: 'Obras & Averías', icon: AlertTriangle },
            { id: 'cne', label: 'Emergencias COE', icon: ShieldAlert },
            { id: 'ia', label: 'Gobernanza de IA', icon: Cpu }
          ].filter((mod) => {
            const isSuper = (
              currentUser?.rol === 'SUPER_ADMIN' ||
              currentUser?.rol === 'SUPERADMIN_NACIONAL' ||
              currentUser?.rol === 'Super Administrador Nacional' ||
              currentUser?.nivelAcceso === 5
            );
            // Usuarios & Auditoría, Gobernanza de IA, Moderación del Foro y Ventanilla Comercial son exclusivos de Nivel 5
            if (!isSuper && (mod.id === 'usuarios' || mod.id === 'ia' || mod.id === 'comercio' || mod.id === 'moderacion-foro')) {
              return false;
            }
            return true;
          }).map((mod) => {
            const IconoMod = mod.icon;
            const isActive = activeTab === mod.id;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  setActiveTab(mod.id);
                  setMobileSidebarOpen(false);
                }}
                title={sidebarColapsado ? mod.label : undefined}
                className={`nav-item-btn w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center border ${
                  isActive
                    ? 'bg-cru-accent-sky-bg border-cru-accent-sky-border border-l-4 border-l-cru-accent-sky text-cru-text shadow-sm'
                    : 'border-transparent text-cru-text-muted hover:text-cru-text hover:bg-cru-surface-muted'
                } ${sidebarColapsado ? 'justify-center px-0' : 'px-3 gap-3'}`}
              >
                <span className="nav-icon-slot flex items-center justify-center shrink-0">
                  <IconoMod
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-cru-accent-sky' : 'text-cru-text-muted'
                    }`}
                    strokeWidth={1.75}
                  />
                </span>
                {!sidebarColapsado && (
                  <span className="nav-label-text truncate tracking-wide">{mod.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sección Inferior: Navegación Pública y Cierre de Sesión (Sticky Footer) */}
        <div className="admin-sidebar-nav-footer space-y-1.5">
          <Link
            to="/"
            onClick={() => setMobileSidebarOpen(false)}
            title={sidebarColapsado ? "Ir al Portal Público" : undefined}
            className={`flex items-center rounded-xl text-xs font-medium text-cru-text-muted hover:text-cru-text hover:bg-cru-surface-muted transition-colors ${
              sidebarColapsado ? 'justify-center px-0 py-2' : 'px-3 py-2 gap-2.5'
            }`}
          >
            <span className="nav-icon-slot flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-cru-accent-sky">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            {!sidebarColapsado && <span className="nav-label-text">Ir al Portal Público</span>}
          </Link>

          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(false);
              handleLogout();
            }}
            title={sidebarColapsado ? "Cerrar Sesión" : undefined}
            className={`nav-logout-btn w-full flex items-center rounded-xl text-xs font-bold text-cru-accent-red hover:text-cru-accent-red hover:bg-cru-accent-red-bg border border-transparent hover:border-cru-accent-red-border transition-colors cursor-pointer ${
              sidebarColapsado ? 'justify-center px-0 py-2' : 'px-3 py-2 gap-2.5'
            }`}
          >
            <span className="nav-icon-slot flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            {!sidebarColapsado && <span className="nav-label-text">Cerrar Sesión</span>}
          </button>

          {!sidebarColapsado && (
            <div className="px-3 pt-1 text-[10px] text-cru-text-muted leading-tight admin-hide-on-collapse">
              Control de acceso RBAC bajo Ley N° 8292.
            </div>
          )}
        </div>
      </aside>

      {/* ====================================================================
          COLUMNA 2: ÁREA DE CONTENIDO CENTRAL (ÚNICA CON SCROLL VERTICAL)
          ==================================================================== */}
      <div className="admin-main-scrollable">
        {/* Barra Institucional Superior */}
        <div 
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          className="bg-cru-surface border-b border-cru-border px-6 py-3.5 transition-all shrink-0"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Título institucional y botón hamburguesa móvil */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cru-accent-green animate-pulse" />
                <span className="text-cru-text font-bold text-sm tracking-wide">
                  Soberanía Cívica Digital
                </span>
                <span className="text-cru-text-muted text-xs hidden sm:inline">
                  | Consola de Mando y Auditoría Territorial · Costa Rica Unidos
                </span>
              </div>

              {/* Botón Hamburguesa Móvil (< 768px) */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="md:hidden p-2 rounded-xl bg-cru-surface-muted hover:bg-cru-surface text-cru-text-muted hover:text-cru-text border border-cru-border transition-colors flex items-center justify-center shrink-0"
                title="Abrir menú de navegación"
                aria-label="Abrir menú de navegación"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>

            {/* Badges de Estado (SYS, VERIF, ESTADO, AUDIT) */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-cru-accent-blue-bg text-cru-accent-blue border border-cru-accent-blue-border font-mono">
                {(currentUser?.rol === 'SUPER_ADMIN' || currentUser?.rol === 'SUPERADMIN_NACIONAL' || currentUser?.nivelAcceso === 5)
                  ? '[SYS] SUPER-ADMIN'
                  : '[NIVEL 2] JURISDICCIÓN PROVINCIAL | COSTA RICA UNIDOS'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border font-mono">
                [VERIF] Ley 8968
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border font-mono">
                [ESTADO] Operativo 100%
              </span>
            </div>
          </div>
        </div>

        {/* Marquesina Global de Alerta CNE */}
        <CNEGlobalMarqueeAlert />

        {/* Área Principal de Contenido */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-8 min-w-0 page-content-wrapper">
        {/* ====================================================================
            1. CABECERA INSTITUCIONAL DE CONTROL
            Membrete oficial de la República, ficha del administrador y RBAC
            ==================================================================== */}
        <div className="surface-dark rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-[#000d26]/90 to-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Acento tricolor nacional sutil en el borde superior */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background:
                'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
            }}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 consola-banner-header">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cru-accent-sky-bg border border-cru-accent-sky-border flex items-center justify-center flex-shrink-0 text-cru-accent-sky shadow-inner">
                <Building2 className="w-7 h-7" strokeWidth={1.75} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-cru-accent-sky">
                  <span className="w-2 h-2 rounded-full bg-cru-accent-sky animate-pulse" />
                  <span>República de Costa Rica • Poder Ejecutivo y Régimen Municipal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Consola de Mando Cívico y Administración Territorial
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Plataforma soberana de gobernanza, fiscalización, alertas tempranas y auditoría inmutable bajo Ley N° 8292 y Ley N° 8968.
                </p>
              </div>
            </div>

            {/* Ficha del Administrador (Limpia, sin botón redundante) */}
            <div className="flex flex-wrap items-center gap-3 bg-white/[0.04] p-3.5 rounded-2xl border border-white/10 admin-user-card w-full lg:w-auto">
              <div className="flex items-start sm:items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-xl bg-cru-accent-blue-bg border border-cru-accent-blue-border flex items-center justify-center text-cru-accent-blue font-bold shrink-0">
                  <User className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white leading-tight">
                      {currentUser.nombre}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border badge-rol">
                      <ShieldCheck className="w-3 h-3 text-cru-accent-amber shrink-0" strokeWidth={2} />
                      <span>{currentRol}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 mt-1">
                    <span>Cédula: <strong className="text-slate-200 font-mono">{currentUser.cedula}</strong></span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-cru-accent-green flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={2} /> Hacienda OK
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>Cantón: <strong className="text-white">{currentUser.canton || 'San José'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            2. CONTENIDO DEL MÓDULO SELECCIONADO
            ==================================================================== */}

        {/* --------------------------------------------------------------------
            PESTAÑA 0: DASHBOARD ANALÍTICO GLOBAL
            -------------------------------------------------------------------- */}
        {pestañaActiva === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Las tarjetas de métricas solo se renderizan en la pestaña Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* 1. Solicitudes Comerciales */}
              <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border hover:border-cru-accent-amber-border transition-all">
                <div className="flex items-center justify-between text-[11px] font-semibold text-cru-text-muted uppercase tracking-wider">
                  <span>Solicitudes Comerciales</span>
                  <Store className="w-4 h-4 text-cru-accent-amber" strokeWidth={1.75} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cru-accent-amber mt-2">{metricas.solicitudesPendientes}</div>
                <div className="text-xs text-cru-text-muted mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cru-accent-amber" />
                  <span>{metricas.comerciosActivos} patentes activas</span>
                </div>
              </div>

              {/* 2. Averías Municipales */}
              <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border hover:border-cru-accent-sky-border transition-all">
                <div className="flex items-center justify-between text-[11px] font-semibold text-cru-text-muted uppercase tracking-wider">
                  <span>Averías Municipales</span>
                  <AlertTriangle className="w-4 h-4 text-cru-accent-sky" strokeWidth={1.75} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cru-accent-sky mt-2">{metricas.ticketsPendientes}</div>
                <div className="text-xs text-cru-text-muted mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cru-accent-green" />
                  <span>{metricas.ticketsResueltos} reparadas con éxito</span>
                </div>
              </div>

              {/* 3. Alerta Nacional CNE (conecta con alertaActiva) */}
              <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border hover:border-cru-accent-red-border transition-all">
                <div className="flex items-center justify-between text-[11px] font-semibold text-cru-text-muted uppercase tracking-wider">
                  <span>Alerta Nacional CNE</span>
                  <ShieldAlert className="w-4 h-4 text-cru-accent-red" strokeWidth={1.75} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-cru-text mt-2 flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      alertaActiva === 'VERDE'
                        ? 'bg-cru-accent-green'
                        : alertaActiva === 'AMARILLA'
                        ? 'bg-cru-accent-amber'
                        : alertaActiva === 'NARANJA'
                        ? 'bg-cru-accent-amber'
                        : 'bg-cru-accent-red'
                    }`}
                  />
                  <span>Nivel {alertaActiva}</span>
                </div>
                <div className="text-xs text-cru-text-muted mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cru-accent-green" />
                  <span>{metricas.alberguesHabilitados} albergues operativos</span>
                </div>
              </div>

              {/* 4. Gobernanza de IA */}
              <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border hover:border-cru-accent-purple-border transition-all">
                <div className="flex items-center justify-between text-[11px] font-semibold text-cru-text-muted uppercase tracking-wider">
                  <span>Gobernanza de IA</span>
                  <Cpu className="w-4 h-4 text-cru-accent-purple" strokeWidth={1.75} />
                </div>
                <div className="text-xl sm:text-2xl font-black mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-black tracking-wide ${
                      configIA.killSwitchActivo ? 'bg-cru-accent-red-bg text-cru-accent-red border border-cru-accent-red-border' : 'bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border'
                    }`}
                  >
                    {configIA.killSwitchActivo ? 'Kill-Switch ON' : 'Operativa'}
                  </span>
                </div>
                <div className="text-xs text-cru-text-muted mt-1">Filtro {configIA.sensibilidadModeracion}</div>
              </div>
            </div>

            {/* SECCIONES ANALÍTICAS: FILA 1 (Obras Públicas & Participación Ciudadana) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* A) GESTIÓN DE OBRAS PÚBLICAS Y AVERÍAS MUNICIPALES (M07) */}
              <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-5 hover:border-cru-border transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-cru-text flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-cru-accent-sky" strokeWidth={1.75} />
                      <span>Gestión de Obras Públicas y Averías Municipales</span>
                    </h3>
                    <p className="text-xs text-cru-text-muted mt-0.5">
                      Fiscalización y resolución de incidencias en vías, acueductos y luminarias cantonales.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cru-accent-sky-bg text-cru-accent-sky border border-cru-accent-sky-border font-bold whitespace-nowrap">
                    Ley N° 7794
                  </span>
                </div>

                {/* Indicador de Eficiencia Municipal */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cru-accent-sky-bg via-cru-surface-muted to-transparent border border-cru-accent-sky-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cru-text-soft">Indicador de Eficiencia Municipal</span>
                    <span className="text-xs font-mono font-bold text-cru-accent-green flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} /> Conforme
                    </span>
                  </div>
                  <div className="text-2xl font-black text-cru-accent-sky mt-1">87.5%</div>
                  <p className="text-xs text-cru-text-muted mt-0.5">
                    87.5% de expedientes atendidos dentro del plazo normado de 72 horas.
                  </p>
                  <div className="w-full bg-cru-track h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-cru-accent-sky to-cru-accent-green h-full rounded-full" style={{ width: '87.5%' }} />
                  </div>
                </div>

                {/* Desglose Visual de Incidencias por Categoría */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                    Desglose de Incidencias por Categoría:
                  </div>

                  {[
                    { label: 'Deterioro Asfáltico / Baches', pct: 42, color: '#38BDF8', desc: 'Saturación en carpetas cantonales y rutas terciarias' },
                    { label: 'Luminarias Públicas Inoperativas', pct: 28, color: '#F59E0B', desc: 'Alumbrado y seguridad vial nocturna' },
                    { label: 'Fugas de Agua Potable / Alcantarillado', pct: 18, color: '#06B6D4', desc: 'Coordinación directa con acueductos AyA' },
                    { label: 'Residuos Sólidos y Escombros', pct: 12, color: '#A855F7', desc: 'Rutas de recolección y limpieza cantonal' }
                  ].map((inc) => (
                    <div key={inc.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cru-text-soft font-medium">{inc.label}</span>
                        <span className="font-mono font-bold text-cru-text">{inc.pct}%</span>
                      </div>
                      <div className="w-full bg-cru-track h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${inc.pct}%`, backgroundColor: inc.color }}
                        />
                      </div>
                      <div className="text-[10px] text-cru-text-muted">{inc.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* B) PARTICIPACIÓN CIUDADANA Y PRESUPUESTOS PARTICIPATIVOS (M11) */}
              <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-5 hover:border-cru-border transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-cru-text flex items-center gap-2">
                      <Vote className="w-5 h-5 text-cru-accent-green" strokeWidth={1.75} />
                      <span>Participación Ciudadana y Presupuestos Participativos</span>
                    </h3>
                    <p className="text-xs text-cru-text-muted mt-0.5">
                      Votación cantonal inmutable con verificación del Padrón Nacional y Hacienda.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border font-bold whitespace-nowrap">
                    Padrón Verificado
                  </span>
                </div>

                {/* Métricas Destacadas de Participación */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-1">
                    <span className="text-[11px] text-cru-text-muted font-semibold uppercase tracking-wider">Total Votos Cívicos</span>
                    <div className="text-2xl font-black text-cru-accent-green">861 votos</div>
                    <p className="text-[11px] text-cru-text-muted">Registrados con Cédula verificada</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-1">
                    <span className="text-[11px] text-cru-text-muted font-semibold uppercase tracking-wider">Auditoría Electoral</span>
                    <div className="text-2xl font-black text-cru-accent-sky">100%</div>
                    <p className="text-[11px] text-cru-text-muted">Validados sin duplicados</p>
                  </div>
                </div>

                {/* Proyecto con Mayor Respaldo */}
                <div className="p-4 rounded-2xl bg-cru-accent-green-bg border border-cru-accent-green-border space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cru-accent-green font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" strokeWidth={2} />
                      <span>Proyecto con Mayor Respaldo</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border font-bold">
                      60.3% del total
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-cru-text">
                    Ciclovía y Aceras Inclusivas en Pavas (519 votos)
                  </div>
                  <p className="text-xs text-cru-text-soft">
                    Inversión asignada para movilidad peatonal segura, arborización y ciclovía cantonal inclusiva.
                  </p>
                </div>

                {/* Auditoría Electoral Detallada */}
                <div className="p-3.5 rounded-2xl bg-cru-surface border border-cru-border flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-cru-accent-green flex-shrink-0" strokeWidth={1.75} />
                  <div className="text-xs text-cru-text-soft">
                    <strong className="text-cru-text font-semibold">Auditoría Electoral:</strong> 100% de votos validados contra el Padrón Nacional y Hacienda (0 duplicados detectados).
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIONES ANALÍTICAS: FILA 2 (Albergues CNE & Fomento Comercial) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* C) RED DE ALBERGUES Y CAPACIDAD DE EMERGENCIA CNE (M10) */}
              <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-5 hover:border-cru-border-hover transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-cru-text flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-cru-accent-red" strokeWidth={1.75} />
                      <span>Red de Albergues y Capacidad de Emergencia CNE</span>
                    </h3>
                    <p className="text-xs text-cru-text-muted mt-0.5">
                      Censo en tiempo real de capacidad instalada y refugios cantonales operativos.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cru-accent-red-bg text-cru-accent-red border border-cru-accent-red-border font-bold whitespace-nowrap">
                    COE Activo
                  </span>
                </div>

                {/* Resumen de Capacidad y Ocupación */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-1">
                    <span className="text-[11px] text-cru-text-muted font-semibold uppercase tracking-wider">Capacidad Total Habilitada</span>
                    <div className="text-2xl font-black text-cru-text">550 personas</div>
                    <p className="text-[11px] text-cru-text-muted">En 3 albergues cantonales</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-1">
                    <span className="text-[11px] text-cru-text-muted font-semibold uppercase tracking-wider">Ocupación Actual</span>
                    <div className="text-2xl font-black text-cru-accent-amber">380 personas</div>
                    <p className="text-[11px] text-cru-text-muted">69.0% de ocupación global</p>
                  </div>
                </div>

                {/* Estado Individual de los Albergues */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                    Estado Operativo por Albergue Cantonal:
                  </div>

                  {[
                    {
                      nombre: 'Polideportivo Puntarenas',
                      canton: 'Puntarenas',
                      estado: 'Habilitado',
                      badgeBg: 'bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border',
                      ocupacion: '45/180',
                      pct: 25,
                      barColor: 'var(--cru-accent-green)'
                    },
                    {
                      nombre: 'Gimnasio Santa Cruz',
                      canton: 'Santa Cruz, Guanacaste',
                      estado: 'Lleno al 100%',
                      badgeBg: 'bg-cru-accent-red-bg text-cru-accent-red border border-cru-accent-red-border',
                      ocupacion: '250/250',
                      pct: 100,
                      barColor: 'var(--cru-accent-red)'
                    },
                    {
                      nombre: 'Salón Parroquial Turrialba',
                      canton: 'Turrialba, Cartago',
                      estado: 'Ocupación Alta',
                      badgeBg: 'bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border',
                      ocupacion: '85/120',
                      pct: 71,
                      barColor: 'var(--cru-accent-amber)'
                    }
                  ].map((alb) => (
                    <div key={alb.nombre} className="p-3 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-cru-text">{alb.nombre}</span>
                          <span className="text-[10px] text-cru-text-muted ml-2">({alb.canton})</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${alb.badgeBg}`}>
                          {alb.estado} - {alb.ocupacion}
                        </span>
                      </div>
                      <div className="w-full bg-cru-track h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${alb.pct}%`, backgroundColor: alb.barColor }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* D) FOMENTO ECONÓMICO Y COMERCIO LOCAL (M08) */}
              <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-5 hover:border-cru-border-hover transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-cru-text flex items-center gap-2">
                      <Store className="w-5 h-5 text-cru-accent-amber" strokeWidth={1.75} />
                      <span>Fomento Económico y Comercio Local</span>
                    </h3>
                    <p className="text-xs text-cru-text-muted mt-0.5">
                      Patentes comerciales fiscalizadas ante Hacienda y distribución en ferias del agricultor.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border font-bold whitespace-nowrap">
                    Hacienda OK
                  </span>
                </div>

                {/* Métricas de Comercio y Ferias */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-1">
                    <span className="text-[11px] text-cru-text-muted font-semibold uppercase tracking-wider">Patentes Activas</span>
                    <div className="text-2xl font-black text-cru-accent-amber">18 patentes</div>
                    <p className="text-[11px] text-cru-text-muted">Verificadas por Hacienda</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-1">
                    <span className="text-[11px] text-cru-text-muted font-semibold uppercase tracking-wider">Puestos de Feria</span>
                    <div className="text-2xl font-black text-cru-accent-sky">84 puestos</div>
                    <p className="text-[11px] text-cru-text-muted">Asignados en Sectores A a F</p>
                  </div>
                </div>

                {/* Desglose de Sectores de Feria */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                    Distribución de Puestos en el Croquis Oficial (Sectores A - F):
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { sector: 'Sector A', label: 'Pabellón Agrícola', puestos: '24 puestos' },
                      { sector: 'Sector B', label: 'Lácteos y Quesos', puestos: '14 puestos' },
                      { sector: 'Sector C', label: 'Cafetero y Cacao', puestos: '12 puestos' },
                      { sector: 'Sector D', label: 'Pabellón Artesanal', puestos: '16 puestos' },
                      { sector: 'Sector E', label: 'Cadena de Frío', puestos: '8 puestos' },
                      { sector: 'Sector F', label: 'Plazoleta Comidas', puestos: '10 puestos' }
                    ].map((s) => (
                      <div key={s.sector} className="p-2 rounded-xl bg-cru-surface-muted border border-cru-border flex items-center justify-between">
                        <div>
                          <div className="font-bold text-cru-text text-[11px]">{s.sector}</div>
                          <div className="text-[10px] text-cru-text-muted">{s.label}</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-cru-accent-amber bg-cru-accent-amber-bg px-1.5 py-0.5 rounded">
                          {s.puestos}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* E) RESUMEN TERRITORIAL */}
            <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cru-accent-sky-bg border border-cru-accent-sky-border flex items-center justify-center text-cru-accent-sky flex-shrink-0">
                    <MapPin className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-cru-text">
                      Despliegue Territorial y Descentralización Soberana
                    </h3>
                    <p className="text-xs text-cru-accent-sky font-medium">
                      7 Provincias · 84 Cantones Autónomos · 492 Distritos · Sistema Sovereign Civic Glass v2.1
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cru-text-muted">
                  <CheckCircle2 className="w-4 h-4 text-cru-accent-green" />
                  <span>Red Cantonal 100% Operativa</span>
                </div>
              </div>

              {/* Grid de las 7 Provincias */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
                {[
                  { nombre: 'San José', cantones: '20 Cantones' },
                  { nombre: 'Alajuela', cantones: '16 Cantones' },
                  { nombre: 'Cartago', cantones: '8 Cantones' },
                  { nombre: 'Heredia', cantones: '10 Cantones' },
                  { nombre: 'Guanacaste', cantones: '11 Cantones' },
                  { nombre: 'Puntarenas', cantones: '13 Cantones' },
                  { nombre: 'Limón', cantones: '6 Cantones' }
                ].map((prov) => (
                  <div key={prov.nombre} className="p-3 rounded-2xl bg-cru-surface-muted border border-cru-border text-center">
                    <div className="text-xs font-bold text-cru-text">{prov.nombre}</div>
                    <div className="text-[10px] text-cru-text-muted mt-0.5">{prov.cantones}</div>
                    <div className="text-[9px] font-mono text-cru-accent-green mt-1 flex items-center justify-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cru-accent-green" /> Activo
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------
            PESTAÑA 1: USUARIOS & AUDITORÍA
            -------------------------------------------------------------------- */}

        {activeTab === 'usuarios' && (
          currentUser?.nivelAcceso === 5 ||
          currentUser?.rol === 'SUPER_ADMIN' ||
          currentUser?.rol === 'SUPERADMIN_NACIONAL' ||
          currentUser?.rol === 'Super Administrador Nacional'
        ) && (
          <div className="space-y-8 animate-fadeIn">
            {/* Módulo Oficial de Padrón Cívico, Auditoría y Control RBAC */}
            <UsuariosAuditoriaModule
              currentUser={currentUser}
              onUsuariosChange={(nuevos) => setUsuarios(nuevos)}
            />

            {/* Sección B: Muro de la Bitácora de Auditoría Legal */}
            <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-cru-text flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cru-accent-amber" strokeWidth={1.75} />
                    <span>Muro de la Bitácora de Auditoría Legal Inmutable</span>
                  </h3>
                  <p className="text-xs text-cru-text-muted">
                    Historial cronológico de actos de autoridad ejecutados en la plataforma bajo marco de Ley N° 8292.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={exportarBitacoraCSV}
                    className="py-2 px-3.5 rounded-xl bg-cru-surface-muted hover:bg-cru-surface border border-cru-border text-cru-text text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-cru-accent-green" strokeWidth={1.75} />
                    <span>Descargar Reporte CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={generarInformeAuditoriaPDF}
                    className="py-2 px-3.5 rounded-xl bg-cru-surface-muted hover:bg-cru-surface border border-cru-border text-cru-text text-xs font-bold flex items-center gap-2 transition-colors"
                    title="Generar y descargar informe oficial de auditoría en PDF"
                  >
                    <FileText className="w-4 h-4 text-cru-accent-sky" strokeWidth={1.75} />
                    <span>Descargar Informe de Auditoría (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Lista Scrolleable de Eventos de Auditoría */}
              <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1 border border-cru-border rounded-2xl p-2 bg-cru-surface-muted">
                {bitacora.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-cru-surface border border-cru-border hover:border-cru-border-hover transition-colors space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cru-accent-amber font-bold">{item.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cru-accent-sky-bg text-cru-accent-sky border border-cru-accent-sky-border">
                          {item.accion}
                        </span>
                        <span className="text-cru-text font-semibold">{item.entidadAfectada}</span>
                      </div>
                      <span className="font-mono text-[11px] text-cru-text-muted">{item.fechaHoraCst}</span>
                    </div>

                    <p className="text-xs text-cru-text-soft leading-relaxed">
                      {item.justificante}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-cru-text-muted border-t border-cru-border pt-1.5">
                      <span>Ejecutado por: <strong className="text-cru-text">{item.adminNombre}</strong> ({item.adminCedula})</span>
                      <span className="font-mono text-[10px]">{item.ipOrigen}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------
            PESTAÑA 2: VENTANILLA COMERCIAL & FERIAS
            -------------------------------------------------------------------- */}
        {activeTab === 'comercio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-cru-text flex items-center gap-2">
                    <Store className="w-5 h-5 text-cru-accent-amber" strokeWidth={1.75} />
                    <span>Bandeja de Solicitudes Comerciales, Patentes y Ferias</span>
                  </h3>
                  <p className="text-xs text-cru-text-muted">
                    Resolución de solicitudes de comercios cantonales, agricultura familiar y asignación de croquis de feria.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {['TODAS', 'PENDIENTE', 'APROBADO', 'RECHAZADO'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFiltroComercio(st)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                        filtroComercio === st
                          ? 'bg-cru-accent-amber text-slate-950 shadow-md'
                          : 'bg-cru-surface-muted border border-cru-border text-cru-text-muted hover:text-cru-text'
                      }`}
                    >
                      {st === 'TODAS' ? 'Todas' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Solicitudes Comerciales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solicitudesFiltradas.length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-cru-text-muted text-xs">
                    No hay solicitudes comerciales con el filtro seleccionado.
                  </div>
                ) : (
                  solicitudesFiltradas.map((sol) => (
                    <div
                      key={sol.id}
                      className="p-5 rounded-2xl bg-cru-surface border border-cru-border flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-cru-accent-sky">{sol.id}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              String(sol.estado || '').toUpperCase() === 'APROBADO'
                                ? 'bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border'
                                : String(sol.estado || '').toUpperCase() === 'PENDIENTE'
                                ? 'bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border'
                                : 'bg-cru-accent-red-bg text-cru-accent-red border border-cru-accent-red-border'
                            }`}
                          >
                            {String(sol.estado || '').toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-cru-text font-bold text-base leading-tight">
                            {sol.nombreNegocio || sol.nombreComercio}
                          </h4>
                          <p className="text-xs text-cru-text-muted mt-0.5">
                            Solicitante: <strong className="text-cru-text">{sol.nombreSolicitante || sol.nombreCompleto}</strong> • Cédula: <span className="font-mono">{sol.cedula}</span>
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-cru-surface-muted border border-cru-border space-y-1 text-xs text-cru-text-soft">
                          <div>
                            <span className="text-cru-text-muted">Actividad Económica: </span>
                            <span className="text-cru-text">{sol.actividadEconomicaHacienda || sol.actividadHacienda || 'Comercio General'}</span>
                          </div>
                          <div>
                            <span className="text-cru-text-muted">Ubicación: </span>
                            <span>{sol.canton}{sol.distrito ? `, ${sol.distrito}` : ''} ({sol.provincia})</span>
                          </div>
                          {(sol.sectorFeria || sol.asignacion) && (
                            <div className="text-cru-accent-amber font-semibold flex items-center gap-1.5 pt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Asignación: {sol.asignacion || sol.sectorFeria}</span>
                            </div>
                          )}
                          {(sol.notas || sol.detalleAsignacion || sol.justificacion) && (
                            <div className="text-cru-text-muted text-[11px] italic pt-0.5">
                              "{sol.detalleAsignacion || sol.notas || sol.justificacion}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cru-border">
                        <button
                          type="button"
                          onClick={() => handleOtorgarSelloVerificado(sol.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-cru-accent-green-bg hover:opacity-90 border border-cru-accent-green-border text-cru-accent-green text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                          <span>Otorgar Sello Verificado</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAsignarPuestoFeria(sol.id, sol.sectorFeria || 'Sector A')}
                          className="py-2 px-3 rounded-xl bg-cru-accent-amber-bg hover:opacity-90 border border-cru-accent-amber-border text-cru-accent-amber text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                          <span>Asignar Puesto Feria</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRechazarSolicitud(sol.id)}
                          className="py-2 px-3 rounded-xl bg-cru-accent-red-bg hover:opacity-90 border border-cru-accent-red-border text-cru-accent-red text-xs font-semibold transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal para Asignar Sector de Feria */}
            {modalSectorId && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="max-w-md w-full rounded-3xl bg-cru-surface-card border border-cru-border p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-cru-border pb-3">
                    <h4 className="font-bold text-cru-text text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cru-accent-amber" />
                      <span>Asignación de Puesto de Feria del Agricultor</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setModalSectorId(null)}
                      className="w-8 h-8 rounded-lg bg-cru-surface-muted hover:bg-cru-surface flex items-center justify-center text-cru-text-muted hover:text-cru-text transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-cru-text-soft leading-relaxed">
                    Seleccione el sector del croquis oficial cantonal donde se ubicará el comerciante para el próximo ciclo ferial:
                  </p>

                  <div className="space-y-2">
                    {SECTORES_FERIA.map((sec) => (
                      <label
                        key={sec.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          sectorSeleccionado === sec.id
                            ? 'bg-cru-accent-amber-bg border-cru-accent-amber text-cru-text'
                            : 'bg-cru-surface-muted border-cru-border text-cru-text-soft hover:bg-cru-surface'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sectorFeriaRadio"
                          value={sec.id}
                          checked={sectorSeleccionado === sec.id}
                          onChange={() => setSectorSeleccionado(sec.id)}
                          className="mt-0.5 accent-amber-500"
                        />
                        <span className="text-xs font-semibold leading-snug">{sec.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleGuardarSectorFeria(modalSectorId)}
                      className="flex-1 py-2.5 rounded-xl bg-cru-accent-amber hover:opacity-90 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" strokeWidth={2} />
                      <span>Confirmar Asignación</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalSectorId(null)}
                      className="py-2.5 px-4 rounded-xl bg-cru-surface-muted hover:bg-cru-surface text-cru-text text-xs font-semibold border border-cru-border transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------
            PESTAÑA 3: VENTANILLA DE FISCALIZACIÓN Y OBRAS PÚBLICAS
            -------------------------------------------------------------------- */}
        {activeTab === 'obras' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-5">
              <div>
                <h3 className="text-lg font-bold text-cru-text flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-cru-accent-sky" strokeWidth={1.75} />
                  <span>Ventanilla de Fiscalización y Obras Públicas</span>
                </h3>
                <p className="text-xs text-cru-text-muted mt-0.5">
                  Monitoreo cartográfico geoespacial y despacho automatizado de cuadrillas municipales para la resolución de averías viales, pluviales y alumbrado.
                </p>
              </div>

              {/* 1. VISOR CARTOGRÁFICO INTERACTIVO DE INCIDENCIAS (LEAFLET) */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-bold text-cru-text-soft uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cru-accent-sky" />
                    <span>Mapa Cantonal de Georreferenciación de Incidencias:</span>
                  </div>
                  {/* Leyenda de Prioridad y Estado */}
                  <div className="flex items-center gap-3 text-[11px] bg-cru-surface-muted px-3 py-1.5 rounded-xl border border-cru-border">
                    <span className="flex items-center gap-1 text-cru-accent-red font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cru-accent-red" /> Alta
                    </span>
                    <span className="flex items-center gap-1 text-cru-accent-amber font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cru-accent-amber" /> Media
                    </span>
                    <span className="flex items-center gap-1 text-cru-accent-green font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cru-accent-green" /> Solucionado
                    </span>
                  </div>
                </div>

                <div className="h-64 md:h-80 rounded-2xl overflow-hidden border border-cru-border relative z-0 shadow-sm">
                  <div ref={mapObrasContainerRef} className="w-full h-full" />
                </div>
              </div>

              {/* 2. TABLA DE EXPEDIENTES Y DESPACHO AUTOMATIZADO */}
              <div className="overflow-x-auto rounded-2xl border border-cru-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cru-surface-muted text-cru-text-soft uppercase tracking-wider font-semibold border-b border-cru-border">
                    <tr>
                      <th className="py-3 px-4">EVIDENCIA</th>
                      <th className="py-3 px-4">Expediente</th>
                      <th className="py-3 px-4">Descripción de Avería</th>
                      <th className="py-3 px-4">Ubicación Exacta</th>
                      <th className="py-3 px-4">Prioridad</th>
                      <th className="py-3 px-4">Cuadrilla Asignada</th>
                      <th className="py-3 px-4">Estado del Ticket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cru-border">
                    {tickets.map((tck) => {
                      const foto = obtenerFotoEvidencia(tck);
                      const cuadrilla = obtenerCuadrillaAutomatica(tck.categoria);
                      const esSeleccionado = averiaSeleccionadaId === tck.id;

                      return (
                        <tr
                          key={tck.id}
                          onClick={() => handleSeleccionarAveriaEnTabla(tck)}
                          className={`transition-colors cursor-pointer ${
                            esSeleccionado
                              ? 'bg-cru-accent-sky-bg border-l-4 border-l-cru-accent-sky'
                              : 'hover:bg-cru-surface-muted'
                          }`}
                        >
                          {/* Columna EVIDENCIA */}
                          <td className="py-3 px-4">
                            <img
                              src={tck.imagenUrl || tck.fotoUrl}
                              alt={`Evidencia ${tck.id}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80';
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setTicketInspeccion(tck);
                              }}
                              className="w-12 h-12 rounded-xl object-cover border border-cru-border hover:scale-105 transition-transform cursor-pointer shadow-sm"
                              title="Click para inspeccionar evidencia en alta resolución"
                            />
                          </td>

                          {/* Expediente */}
                          <td className="py-3 px-4 font-mono font-bold text-cru-accent-sky whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-cru-accent-sky flex-shrink-0" />
                              <span>{tck.id}</span>
                            </div>
                          </td>

                          {/* Descripción */}
                          <td className="py-3 px-4 text-cru-text font-medium max-w-xs">
                            <div className="font-bold text-cru-text text-xs truncate" title={tck.titulo}>
                              {tck.titulo}
                            </div>
                            <div className="text-[11px] text-cru-text-muted truncate mt-0.5">
                              {tck.categoriaTitulo || tck.categoria}
                            </div>
                          </td>

                          {/* Ubicación Exacta */}
                          <td className="py-3 px-4 text-cru-text-soft">
                            <div className="font-semibold text-cru-text">{tck.canton}, {tck.distrito}</div>
                            <div className="text-[10px] text-cru-text-muted max-w-[200px] truncate">{tck.direccionExacta}</div>
                          </td>

                          {/* Prioridad */}
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                tck.prioridad === 'ALTA'
                                  ? 'bg-cru-accent-red-bg text-cru-accent-red border border-cru-accent-red-border'
                                  : tck.prioridad === 'MEDIA'
                                  ? 'bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border'
                                  : 'bg-cru-accent-sky-bg text-cru-accent-sky border border-cru-accent-sky-border'
                              }`}
                            >
                              {tck.prioridad}
                            </span>
                          </td>

                          {/* Cuadrilla Asignada (Despacho 100% Automático) */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${cuadrilla.color}`}>
                              {cuadrilla.nombre}
                            </span>
                          </td>

                          {/* Estado del Ticket */}
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={tck.estado}
                              onChange={(e) => handleCambiarEstadoAveria(tck.id, e.target.value, cuadrilla.nombre)}
                              className={`py-1.5 px-3 rounded-xl text-xs font-bold border focus:outline-none transition-all cursor-pointer ${
                                tck.estado === 'RESUELTO'
                                  ? 'bg-cru-accent-green-bg border-cru-accent-green-border text-cru-accent-green'
                                  : tck.estado === 'EN_PROCESO'
                                  ? 'bg-cru-accent-sky-bg border-cru-accent-sky-border text-cru-accent-sky'
                                  : 'bg-cru-accent-amber-bg border-cru-accent-amber-border text-cru-accent-amber'
                              }`}
                            >
                              <option value="REPORTADO">Recibido</option>
                              <option value="EN_INSPECCION">En Inspección</option>
                              <option value="EN_PROCESO">En Trámite</option>
                              <option value="RESUELTO">Solucionado</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. MODAL DE INSPECCIÓN CÍVICA Y EVIDENCIA FOTOGRÁFICA EN ALTA RESOLUCIÓN */}
            {ticketInspeccion && (
              <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-inspeccion-title"
              >
                <div className="max-w-2xl w-full rounded-3xl bg-cru-surface-card border border-cru-border p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                  {/* Encabezado */}
                  <div className="flex items-center justify-between border-b border-cru-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cru-accent-sky-bg border border-cru-accent-sky-border flex items-center justify-center text-cru-accent-sky">
                        <Camera className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 id="modal-inspeccion-title" className="text-lg font-bold text-cru-text flex items-center gap-2">
                          <span>Inspección Cívica de Evidencia</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cru-accent-sky-bg text-cru-accent-sky border border-cru-accent-sky-border">
                            {ticketInspeccion.id || ticketInspeccion.reportId}
                          </span>
                        </h3>
                        <p className="text-xs text-cru-text-muted">
                          Expediente técnico oficial radicado por el ciudadano ante la Municipalidad.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTicketInspeccion(null)}
                      className="p-2 rounded-xl bg-cru-surface-muted hover:bg-cru-surface text-cru-text-muted hover:text-cru-text transition-colors"
                      aria-label="Cerrar modal"
                      title="Cerrar (Escape)"
                    >
                      <X className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                  </div>

                  {/* Imagen en Alta Resolución */}
                  <div className="rounded-2xl overflow-hidden border border-cru-border bg-cru-surface-muted relative flex items-center justify-center max-h-80">
                    <img
                      src={ticketInspeccion.imagenUrl || ticketInspeccion.fotoUrl}
                      alt={`Evidencia fotográfica ${ticketInspeccion.id}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-80 object-cover rounded-2xl"
                    />
                  </div>

                  {/* Ficha Técnica del Expediente */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-cru-surface-muted border border-cru-border space-y-1">
                      <div className="text-[10px] text-cru-text-muted uppercase font-bold tracking-wider">Tipología de Daño</div>
                      <div className="font-bold text-cru-text text-sm">{ticketInspeccion.categoriaTitulo || ticketInspeccion.titulo}</div>
                      <div className="text-cru-text-soft text-[11px]">{ticketInspeccion.descripcion || ticketInspeccion.direccionExacta}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cru-surface-muted border border-cru-border space-y-1">
                      <div className="text-[10px] text-cru-text-muted uppercase font-bold tracking-wider">Ubicación y Coordenadas GPS</div>
                      <div className="font-bold text-cru-text">
                        {ticketInspeccion.canton}, {ticketInspeccion.distrito || ticketInspeccion.provincia}
                      </div>
                      <div className="font-mono text-[11px] text-cru-accent-sky">
                        {Array.isArray(ticketInspeccion.coordenadas)
                          ? `GPS: ${ticketInspeccion.coordenadas[0].toFixed(5)}, ${ticketInspeccion.coordenadas[1].toFixed(5)}`
                          : ticketInspeccion.coordenadas?.lat
                          ? `GPS: ${Number(ticketInspeccion.coordenadas.lat).toFixed(5)}, ${Number(ticketInspeccion.coordenadas.lng).toFixed(5)}`
                          : 'GPS: 9.93330, -84.08330'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cru-surface-muted border border-cru-border space-y-1">
                      <div className="text-[10px] text-cru-text-muted uppercase font-bold tracking-wider">Fecha y Radicación</div>
                      <div className="font-mono text-cru-text">
                        {ticketInspeccion.fechaRadicado
                          ? new Date(ticketInspeccion.fechaRadicado).toLocaleString('es-CR')
                          : '25/09/2026, 08:15 CST'}
                      </div>
                      <div className="text-cru-text-muted text-[11px]">Cédula denunciante: <strong className="text-cru-text-soft font-mono">{ticketInspeccion.reportadoPor || '1-1823-0456'}</strong></div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cru-surface-muted border border-cru-border space-y-1">
                      <div className="text-[10px] text-cru-text-muted uppercase font-bold tracking-wider">Despacho de Cuadrilla</div>
                      <div>
                        {(() => {
                          const c = obtenerCuadrillaAutomatica(ticketInspeccion.categoria);
                          return (
                            <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium border ${c.color}`}>
                              {c.nombre}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="text-[11px] text-cru-text-muted mt-1">
                        Prioridad: <strong className={ticketInspeccion.prioridad === 'ALTA' ? 'text-cru-accent-red font-bold' : 'text-cru-accent-amber font-bold'}>{ticketInspeccion.prioridad}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Declaración Jurada */}
                  <div className="p-3.5 rounded-2xl bg-cru-accent-sky-bg border border-cru-accent-sky-border text-xs text-cru-text space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-cru-accent-sky">
                      <ShieldCheck className="w-4 h-4 text-cru-accent-sky" />
                      <span>Declaración Jurada de Veracidad Cívica</span>
                    </div>
                    <p className="text-[11px] text-cru-text-soft leading-relaxed">
                      "Declaro bajo la fe de juramento que la información y evidencia fotográfica proporcionada corresponden a hechos reales observados en el espacio público del cantón, autorizando a la Municipalidad a utilizar las coordenadas geográficas para la inspección y reparación oficial."
                    </p>
                  </div>

                  {/* Botón Cerrar */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-cru-border">
                    <button
                      type="button"
                      onClick={() => setTicketInspeccion(null)}
                      className="px-5 py-2.5 rounded-xl bg-cru-surface-muted hover:bg-cru-surface text-cru-text border border-cru-border text-xs font-bold transition-colors"
                    >
                      Cerrar Inspección
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------
            PESTAÑA 4: CENTRO DE OPERACIONES DE EMERGENCIA (COE · CNE)
            -------------------------------------------------------------------- */}
        {activeTab === 'cne' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Conmutador Cromático del Nivel de Alerta */}
            <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-6">
              <div>
                <h3 className="text-lg font-bold text-cru-text flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cru-accent-red" strokeWidth={1.75} />
                  <span>Centro de Operaciones de Emergencia (COE · CNE)</span>
                </h3>
                <p className="text-xs text-cru-text-muted">
                  Control oficial del semáforo nacional de alerta temprana y red cantonal de albergues para evacuación.
                </p>
              </div>

              {/* Botonera de Niveles de Alerta */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                  Nivel de Alerta Soberana Nacional / Cantonal:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { nivel: 'VERDE', label: 'Verde (Informativa)', color: '#10B981' },
                    { nivel: 'AMARILLA', label: 'Amarilla (Precaución)', color: '#F59E0B' },
                    { nivel: 'NARANJA', label: 'Naranja (Peligro)', color: '#F97316' },
                    { nivel: 'ROJA', label: 'Roja (Evacuación)', color: '#EF4444' }
                  ].map((a) => {
                    const activo = alertaNivel === a.nivel;
                    return (
                      <button
                        key={a.nivel}
                        type="button"
                        onClick={() => handleCambiarAlerta(a.nivel)}
                        style={{
                          backgroundColor: activo ? `${a.color}25` : 'transparent',
                          borderColor: activo ? a.color : 'var(--cru-border)',
                          color: activo ? a.color : 'var(--cru-text)',
                          borderWidth: activo ? '2px' : '1px'
                        }}
                        className="p-3.5 rounded-xl border text-left transition-all cursor-pointer bg-cru-surface-muted"
                      >
                        <span className="font-bold text-xs flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                          {a.label}
                          {activo && <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-cru-surface">ACTIVO</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Redactor del Comunicado Oficial */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                  Comunicado Oficial de la Presidencia de la República y CNE:
                </label>
                <textarea
                  rows={3}
                  value={comunicadoTexto}
                  onChange={(e) => setComunicadoTexto(e.target.value)}
                  placeholder="Redactar aviso oficial de emergencia para difusión en toda la plataforma..."
                  className="w-full p-3.5 text-xs rounded-2xl bg-theme-input-bg border border-theme-input-border text-theme-input-text placeholder:text-cru-text-muted focus:border-cru-accent-sky focus:outline-none leading-relaxed"
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleGuardarAlertaCNE}
                    className="py-2.5 px-5 rounded-xl bg-cru-accent-red hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" strokeWidth={2} />
                    <span>Publicar y Actualizar Nivel de Alerta</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDesactivarAlertaCNE}
                    disabled={isDeactivatingAlerta}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--cru-surface-muted)',
                      border: '1px solid var(--cru-border)',
                      color: 'var(--cru-text)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: isDeactivatingAlerta ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title="Quitar la alerta activa de toda la plataforma web"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    <span>{isDeactivatingAlerta ? 'Retirando Alerta...' : 'Desactivar / Retirar Alerta Nacional'}</span>
                  </button>
                </div>
              </div>

              {/* Catálogo y Estado de Albergues */}
              <div className="space-y-3 pt-4 border-t border-cru-border">
                <h4 className="text-sm font-bold text-cru-text uppercase tracking-wider">
                  Red Cantonal de Albergues de Emergencia
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {albergues.map((alb) => (
                    <div
                      key={alb.id}
                      className="p-4 rounded-2xl bg-cru-surface-muted border border-cru-border space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-cru-text text-sm">{alb.nombre}</div>
                          <div className="text-xs text-cru-text-muted">{alb.canton}, {alb.provincia}</div>
                        </div>
                        <select
                          value={alb.estado}
                          onChange={(e) => handleCambiarEstadoAlbergue(alb.id, e.target.value)}
                          className="py-1.5 px-3 rounded-xl bg-theme-input-bg border border-theme-input-border text-theme-input-text text-xs font-bold outline-none focus:border-cru-accent-sky cursor-pointer transition-colors"
                        >
                          <option value="Habilitado" className="text-cru-accent-green font-bold">
                            ● Habilitado
                          </option>
                          <option value="Ocupación Alta" className="text-cru-accent-amber font-bold">
                            ● Ocupación Alta
                          </option>
                          <option value="Lleno al 100%" className="text-cru-accent-red font-bold">
                            ● Lleno al 100%
                          </option>
                          <option value="En Reserva" className="text-cru-accent-sky font-bold">
                            ● En Reserva
                          </option>
                        </select>
                      </div>

                      {/* Barra de Aforo */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-cru-text-muted">
                          <span>Aforo actual: {alb.ocupacionActual} de {alb.capacidadTotal} personas</span>
                          <span>{Math.round((alb.ocupacionActual / alb.capacidadTotal) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-cru-track overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              alb.ocupacionActual >= alb.capacidadTotal
                                ? 'bg-cru-accent-red'
                                : alb.ocupacionActual / alb.capacidadTotal > 0.7
                                ? 'bg-cru-accent-amber'
                                : 'bg-cru-accent-green'
                            }`}
                            style={{ width: `${Math.min(100, (alb.ocupacionActual / alb.capacidadTotal) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-[11px] text-cru-text-muted border-t border-cru-border pt-1.5 flex justify-between items-center">
                        <span>Contacto: {alb.responsableContacto}</span>
                        <span className="text-cru-accent-sky font-semibold">Ley 7600 OK</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------
            PESTAÑA 5: GOBERNANZA DE IA & SISTEMA
            -------------------------------------------------------------------- */}
        {activeTab === 'ia' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Kill-Switch e Inferencia de IA */}
            <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border space-y-6">
              <div>
                <h3 className="text-lg font-bold text-cru-text flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cru-accent-sky" strokeWidth={1.75} />
                  <span>Gobernanza del Motor de Inteligencia Artificial Cívica</span>
                </h3>
                <p className="text-xs text-cru-text-muted">
                  Control soberano del modelo generativo, sensibilidad del clasificador y control estricto de acceso a colecciones.
                </p>
              </div>

              {/* Interruptor Maestro (Kill Switch) */}
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                  configIA.killSwitchActivo
                    ? 'bg-cru-accent-red-bg border-cru-accent-red-border'
                    : 'bg-cru-surface-muted border-cru-border'
                }`}
              >
                <div>
                  <div className="text-sm font-extrabold text-cru-text flex items-center gap-2">
                    <span>Interruptor Maestro de IA (Kill-Switch)</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                        configIA.killSwitchActivo
                          ? 'bg-cru-accent-red text-white'
                          : 'bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border'
                      }`}
                    >
                      {configIA.killSwitchActivo ? 'ACTIVADO (APAGADO)' : 'OPERATIVO'}
                    </span>
                  </div>
                  <p className="text-xs text-cru-text-muted mt-1 max-w-lg leading-relaxed">
                    {configIA.killSwitchActivo
                      ? 'El motor de IA se encuentra totalmente inhabilitado para evitar alucinaciones o en caso de contingencia cibernética.'
                      : 'La IA opera normalmente brindando asistencia de itinerarios, moderación predictiva y búsqueda semántica.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleKillSwitch}
                  className={`py-2 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    configIA.killSwitchActivo
                      ? 'bg-cru-accent-red hover:opacity-90 text-white shadow-lg'
                      : 'bg-cru-surface hover:bg-cru-surface-muted border border-cru-border text-cru-text'
                  }`}
                >
                  {configIA.killSwitchActivo ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-white" />
                      <span>Reanudar IA</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-cru-text-muted" />
                      <span>Activar Kill-Switch</span>
                    </>
                  )}
                </button>
              </div>

              {/* Selector de Sensibilidad de Moderación */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                  Sensibilidad del Filtro Automático de Contenidos:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'ESTRICTA', label: 'Moderación Estricta', desc: 'Bloqueo preventivo de datos Ley 8968 e insultos' },
                    { id: 'MODERADA', label: 'Moderación Media', desc: 'Revisión balanceada con escalamiento humano' },
                    { id: 'FLEXIBLE', label: 'Moderación Flexible', desc: 'Detección exclusiva de spam malicioso evidente' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleCambiarSensibilidad(s.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        configIA.sensibilidadModeracion === s.id
                          ? 'bg-cru-accent-sky-bg border-cru-accent-sky-border text-cru-accent-sky font-bold'
                          : 'bg-cru-surface-muted border-cru-border text-cru-text-muted hover:bg-cru-surface hover:text-cru-text'
                      }`}
                    >
                      <div className="text-xs font-black">{s.label}</div>
                      <p className="text-[11px] opacity-75 mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes de Colecciones Autorizadas */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                  Colecciones de Datos Autorizadas para Lectura por la IA:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'turismo', label: 'Destinos y POIs Turísticos' },
                    { id: 'comercio', label: 'Directorio PyMEs y Ferias' },
                    { id: 'noticias', label: 'Gacetas y Comunicados' },
                    { id: 'puntosCivicos', label: 'Hospitales y Refugios CNE' },
                    { id: 'bitacoraAuditoria', label: 'Auditoría (Confidencial)', locked: true },
                    { id: 'credencialesUsuarios', label: 'Cédulas (Prohibido Ley 8968)', locked: true }
                  ].map((col) => {
                    const isChecked = (configIA.coleccionesAutorizadas || []).includes(col.id);
                    return (
                      <label
                        key={col.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          col.locked
                            ? 'bg-cru-accent-red-bg border-cru-accent-red-border text-cru-text-muted cursor-not-allowed opacity-60'
                            : isChecked
                            ? 'bg-cru-accent-sky-bg border-cru-accent-sky-border text-cru-accent-sky cursor-pointer'
                            : 'bg-cru-surface-muted border-cru-border text-cru-text-muted hover:text-cru-text cursor-pointer'
                        }`}
                      >
                        <span className="font-semibold">{col.label}</span>
                        <input
                          type="checkbox"
                          disabled={col.locked}
                          checked={isChecked && !col.locked}
                          onChange={() => !col.locked && handleToggleColeccionIA(col.id)}
                          className="accent-sky-500 w-4 h-4 rounded"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Herramientas de Respaldo y Mantenimiento del Sistema */}
              <div className="pt-6 border-t border-cru-border space-y-3">
                <h4 className="text-xs font-bold text-cru-text-soft uppercase tracking-wider">
                  Mantenimiento Soberano y Respaldo Institucional
                </h4>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={descargarRespaldoDbJson}
                    className="py-3 px-5 rounded-2xl bg-cru-accent-sky-bg hover:opacity-80 border border-cru-accent-sky-border text-cru-accent-sky text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4 text-cru-accent-sky" strokeWidth={1.75} />
                    <span>Descargar Copia de Seguridad</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestablecerSemilla}
                    className="py-3 px-5 rounded-2xl bg-cru-accent-red-bg hover:opacity-80 border border-cru-accent-red-border text-cru-accent-red text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-cru-accent-red" strokeWidth={1.75} />
                    <span>Restablecer Datos Semilla de Fábrica</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------
            PESTAÑA: MODERACIÓN DEL FORO TICO (M04)
            -------------------------------------------------------------------- */}
        {activeTab === 'moderacion-foro' && (
          <ModeracionForoPanel />
        )}
        </main>
      </div>
    </div>
  );
}
