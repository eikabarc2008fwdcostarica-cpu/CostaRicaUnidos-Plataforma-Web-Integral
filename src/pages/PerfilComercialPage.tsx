import React, { FC, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Calendar,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Tag,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  RefreshCw,
  X,
  Share2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  obtenerPerfilComercialApi,
  actualizarPerfilComercialApi,
  obtenerPublicacionesComercioApi,
  crearPublicacionComercioApi,
  actualizarPublicacionComercioApi,
  eliminarPublicacionComercioApi,
  obtenerMetricasActividadApi,
  PublicacionComercioItem,
  MetricasComercioResponse
} from '../services/comercioService';

export const PerfilComercialPage: FC = () => {
  const { user, usuarioActual } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const currentUser = usuarioActual || user;
  const comercioId = currentUser?.comercioId || 'SOL-COM-003';

  // Estados de datos
  const [perfil, setPerfil] = useState<any>(null);
  const [misPublicaciones, setMisPublicaciones] = useState<PublicacionComercioItem[]>([]);
  const [publicacionesOtros, setPublicacionesOtros] = useState<PublicacionComercioItem[]>([]);
  const [metricas, setMetricas] = useState<MetricasComercioResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtros y pestañas
  const [tabActiva, setTabActiva] = useState<'crecimiento' | 'mis_publicaciones' | 'vitrina_otros'>('crecimiento');
  const [periodoFiltro, setPeriodoFiltro] = useState<'30d' | '6m' | '12m'>('30d');
  const [busquedaOtros, setBusquedaOtros] = useState<string>('');
  const [categoriaOtros, setCategoriaOtros] = useState<string>('todas');
  const [paginaOtros, setPaginaOtros] = useState<number>(1);
  const itemsPorPagina = 4;

  // Tooltip interactivo para gráficos
  const [tooltipGrafico1, setTooltipGrafico1] = useState<{ x: number; y: number; mes: string; cantidad: number; visible: boolean }>({
    x: 0,
    y: 0,
    mes: '',
    cantidad: 0,
    visible: false
  });
  const [tooltipGrafico2, setTooltipGrafico2] = useState<{ x: number; y: number; titulo: string; metricas: any; visible: boolean }>({
    x: 0,
    y: 0,
    titulo: '',
    metricas: null,
    visible: false
  });

  // Modales
  const [modalEditarPerfil, setModalEditarPerfil] = useState<boolean>(false);
  const [formPerfil, setFormPerfil] = useState({
    nombreComercio: '',
    categoria: '',
    descripcion: '',
    contacto: '',
    logoUrl: ''
  });

  const [modalPublicacion, setModalPublicacion] = useState<boolean>(false);
  const [publicacionEditando, setPublicacionEditando] = useState<PublicacionComercioItem | null>(null);
  const [formPublicacion, setFormPublicacion] = useState({
    titulo: '',
    categoria: 'Panadería y Pastelería',
    descripcion: '',
    precio: '',
    contacto: '',
    imagenUrl: ''
  });

  const [modalEliminar, setModalEliminar] = useState<{ abierto: boolean; id: string | null; titulo: string }>({
    abierto: false,
    id: null,
    titulo: ''
  });

  const [guardando, setGuardando] = useState<boolean>(false);
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  const mostrarToast = (msg: string) => {
    setMensajeToast(msg);
    setTimeout(() => setMensajeToast(null), 3500);
  };

  // Carga inicial y por cambio de período
  const cargarDatos = async () => {
    setLoading(true);
    try {
      // 1. Perfil
      const resPerfil = await obtenerPerfilComercialApi(comercioId);
      if (resPerfil.success && resPerfil.data) {
        setPerfil(resPerfil.data);
        setFormPerfil({
          nombreComercio: resPerfil.data.nombreComercio || '',
          categoria: resPerfil.data.categoria || '',
          descripcion: resPerfil.data.descripcion || '',
          contacto: resPerfil.data.contacto || '',
          logoUrl: resPerfil.data.logoUrl || ''
        });
      }

      // 2. Mis publicaciones
      const misPubs = await obtenerPublicacionesComercioApi({ comercioId });
      setMisPublicaciones(misPubs);

      // 3. Publicaciones de otros comercios (excluyendo las propias)
      const otrasPubs = await obtenerPublicacionesComercioApi({ excluirComercioId: comercioId });
      setPublicacionesOtros(otrasPubs);

      // 4. Métricas y analítica de crecimiento
      const resMetricas = await obtenerMetricasActividadApi(comercioId, periodoFiltro);
      setMetricas(resMetricas);
      setErrorMsg(null);
    } catch (err) {
      console.error('[PerfilComercialPage] Error cargando datos:', err);
      setErrorMsg('No se pudieron sincronizar todos los datos comerciales con el servidor municipal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [comercioId]);

  // Actualizar solo métricas si cambia el selector de período
  useEffect(() => {
    const actualizarMetricas = async () => {
      const resMetricas = await obtenerMetricasActividadApi(comercioId, periodoFiltro);
      setMetricas(resMetricas);
    };
    if (!loading) {
      actualizarMetricas();
    }
  }, [periodoFiltro]);

  // Filtrado de publicaciones de otros comercios
  const otrasPublicacionesFiltradas = useMemo(() => {
    return publicacionesOtros.filter((pub) => {
      const coincideBusqueda =
        pub.titulo.toLowerCase().includes(busquedaOtros.toLowerCase()) ||
        pub.descripcion.toLowerCase().includes(busquedaOtros.toLowerCase()) ||
        pub.nombreComercio.toLowerCase().includes(busquedaOtros.toLowerCase());
      const coincideCat = categoriaOtros === 'todas' || pub.categoria === categoriaOtros;
      return coincideBusqueda && coincideCat;
    });
  }, [publicacionesOtros, busquedaOtros, categoriaOtros]);

  const categoriasDisponibles = useMemo(() => {
    const set = new Set<string>();
    publicacionesOtros.forEach((p) => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set);
  }, [publicacionesOtros]);

  const otrasPaginadas = useMemo(() => {
    const inicio = (paginaOtros - 1) * itemsPorPagina;
    return otrasPublicacionesFiltradas.slice(0, inicio + itemsPorPagina);
  }, [otrasPublicacionesFiltradas, paginaOtros]);

  // Guardar Edición de Perfil
  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await actualizarPerfilComercialApi(comercioId, formPerfil);
      if (res.success && res.data) {
        setPerfil(res.data);
        setModalEditarPerfil(false);
        mostrarToast('Perfil comercial actualizado satisfactoriamente.');
      } else {
        mostrarToast('Error al actualizar datos comerciales.');
      }
    } catch (err) {
      mostrarToast('Fallo de conexión al guardar perfil.');
    } finally {
      setGuardando(false);
    }
  };

  // Guardar Crear / Editar Publicación
  const handleAbrirCrearPublicacion = () => {
    setPublicacionEditando(null);
    setFormPublicacion({
      titulo: '',
      categoria: perfil?.categoria || 'Panadería y Pastelería',
      descripcion: '',
      precio: '',
      contacto: perfil?.contacto || '+506 8899-7711',
      imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    });
    setModalPublicacion(true);
  };

  const handleAbrirEditarPublicacion = (pub: PublicacionComercioItem) => {
    setPublicacionEditando(pub);
    setFormPublicacion({
      titulo: pub.titulo,
      categoria: pub.categoria,
      descripcion: pub.descripcion,
      precio: pub.precio || '',
      contacto: pub.contacto || '',
      imagenUrl: pub.imagenUrl || ''
    });
    setModalPublicacion(true);
  };

  const handleGuardarPublicacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPublicacion.titulo.trim() || !formPublicacion.descripcion.trim()) {
      mostrarToast('Por favor complete el título y la descripción.');
      return;
    }
    setGuardando(true);
    try {
      if (publicacionEditando) {
        // Actualizar
        const act = await actualizarPublicacionComercioApi(publicacionEditando.id, formPublicacion);
        if (act) {
          setMisPublicaciones((prev) => prev.map((p) => (p.id === act.id ? act : p)));
          setModalPublicacion(false);
          mostrarToast('Publicación actualizada correctamente.');
        }
      } else {
        // Crear
        const nueva = await crearPublicacionComercioApi({
          comercioId,
          usuarioId: currentUser?.id,
          nombreComercio: perfil?.nombreComercio || 'Panadería y Repostería El Buen Sabor',
          titulo: formPublicacion.titulo,
          descripcion: formPublicacion.descripcion,
          categoria: formPublicacion.categoria,
          precio: formPublicacion.precio,
          contacto: formPublicacion.contacto,
          imagenUrl: formPublicacion.imagenUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          canton: perfil?.canton || 'San José',
          provincia: perfil?.provincia || 'San José'
        });
        if (nueva) {
          setMisPublicaciones((prev) => [nueva, ...prev]);
          setModalPublicacion(false);
          mostrarToast('¡Nueva publicación creada con éxito!');
        }
      }
      // Refrescar analítica
      const resMetricas = await obtenerMetricasActividadApi(comercioId, periodoFiltro);
      setMetricas(resMetricas);
    } catch (err) {
      mostrarToast('Error al registrar la publicación.');
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar Publicación
  const handleConfirmarEliminar = async () => {
    if (!modalEliminar.id) return;
    setGuardando(true);
    try {
      const ok = await eliminarPublicacionComercioApi(modalEliminar.id);
      if (ok) {
        setMisPublicaciones((prev) => prev.filter((p) => p.id !== modalEliminar.id));
        setModalEliminar({ abierto: false, id: null, titulo: '' });
        mostrarToast('Publicación eliminada correctamente.');
        const resMetricas = await obtenerMetricasActividadApi(comercioId, periodoFiltro);
        setMetricas(resMetricas);
      } else {
        mostrarToast('No se pudo eliminar la publicación.');
      }
    } catch (err) {
      mostrarToast('Error al conectar con el servidor para eliminar.');
    } finally {
      setGuardando(false);
    }
  };

  // Renderizadores de Gráficos SVG reactivos con estética Sovereign Civic Glass
  const renderGrafico1 = () => {
    const datos = metricas?.publicacionesPorMes || [];
    const maxCantidad = Math.max(...datos.map((d) => d.cantidad), 5);
    const anchoSvg = 700;
    const altoSvg = 240;
    const paddingLeft = 50;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 45;

    const anchoUtil = anchoSvg - paddingLeft - paddingRight;
    const altoUtil = altoSvg - paddingTop - paddingBottom;

    if (datos.length === 0 || datos.every((d) => d.cantidad === 0)) {
      return (
        <div
          style={{
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#94A3B8' : '#64748B',
            textAlign: 'center',
            padding: '1.5rem'
          }}
        >
          <Calendar className="w-10 h-10 mb-2 opacity-50 text-amber-500" />
          <p style={{ fontWeight: 600, margin: 0 }}>Aún no hay actividad de publicaciones en este período</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', maxWidth: '380px' }}>
            Al crear tus publicaciones mensuales en la plataforma cívica, aquí se proyectará tu curva de actividad.
          </p>
        </div>
      );
    }

    // Coordenadas para puntos
    const puntos = datos.map((d, i) => {
      const x = paddingLeft + (i / Math.max(datos.length - 1, 1)) * anchoUtil;
      const y = paddingTop + altoUtil - (d.cantidad / maxCantidad) * altoUtil;
      return { x, y, ...d };
    });

    const pathD = puntos.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaD = `${pathD} L ${puntos[puntos.length - 1].x} ${paddingTop + altoUtil} L ${puntos[0].x} ${
      paddingTop + altoUtil
    } Z`;

    return (
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${anchoSvg} ${altoSvg}`}
          style={{ width: '100%', height: 'auto', minWidth: '550px', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="gradienteAreaPubs" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D97706" stopOpacity={isDark ? '0.45' : '0.35'} />
              <stop offset="100%" stopColor="#0053AF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradienteLineaPubs" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Líneas de cuadrícula horizontales */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const yLine = paddingTop + altoUtil * (1 - pct);
            const val = Math.round(maxCantidad * pct);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={yLine}
                  x2={anchoSvg - paddingRight}
                  y2={yLine}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={yLine + 4}
                  fill={isDark ? '#94A3B8' : '#64748B'}
                  fontSize="11"
                  textAnchor="end"
                  fontWeight="600"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Área sombreada */}
          <path d={areaD} fill="url(#gradienteAreaPubs)" />

          {/* Línea principal */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#gradienteLineaPubs)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos y etiquetas del eje X */}
          {puntos.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill={isDark ? '#0F172A' : '#FFFFFF'}
                stroke="#D97706"
                strokeWidth="2.5"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() =>
                  setTooltipGrafico1({
                    x: p.x,
                    y: p.y,
                    mes: `${p.mesNombre} ${p.anio}`,
                    cantidad: p.cantidad,
                    visible: true
                  })
                }
                onMouseLeave={() => setTooltipGrafico1((prev) => ({ ...prev, visible: false }))}
              />
              <text
                x={p.x}
                y={paddingTop + altoUtil + 22}
                fill={isDark ? '#CBD5E1' : '#475569'}
                fontSize="11"
                textAnchor="middle"
                fontWeight="600"
              >
                {p.mesNombre.substring(0, 3)}
              </text>
            </g>
          ))}
        </svg>

        {/* Tooltip HTML reactivo */}
        {tooltipGrafico1.visible && (
          <div
            style={{
              position: 'absolute',
              left: `${(tooltipGrafico1.x / anchoSvg) * 100}%`,
              top: `${(tooltipGrafico1.y / altoSvg) * 100}%`,
              transform: 'translate(-50%, -120%)',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              border: '1px solid #D97706',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              padding: '6px 12px',
              borderRadius: '8px',
              pointerEvents: 'none',
              zIndex: 10,
              fontSize: '0.8rem',
              color: isDark ? '#FFFFFF' : '#0F172A',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            <div>{tooltipGrafico1.mes}</div>
            <div style={{ color: '#D97706' }}>{tooltipGrafico1.cantidad} publicaciones</div>
          </div>
        )}
      </div>
    );
  };

  const renderGrafico2 = () => {
    const pubs = metricas?.interaccionesPorPublicacion || [];
    const anchoSvg = 700;
    const altoSvg = 260;

    if (pubs.length === 0) {
      return (
        <div
          style={{
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#94A3B8' : '#64748B',
            textAlign: 'center',
            padding: '1.5rem'
          }}
        >
          <BarChart3 className="w-10 h-10 mb-2 opacity-50 text-sky-500" />
          <p style={{ fontWeight: 600, margin: 0 }}>Aún no hay interacciones registradas en tus publicaciones</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', maxWidth: '380px' }}>
            Las vistas vecinales, me gusta, comentarios y contactos por WhatsApp generarán el desglose comparativo de tus productos.
          </p>
        </div>
      );
    }

    const maxTotal = Math.max(...pubs.map((p) => p.totalInteracciones), 50);

    return (
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        {/* Leyenda interactiva */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#38BDF8' }}></span>
            Vistas
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#F43F5E' }}></span>
            Me Gusta
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#A855F7' }}></span>
            Comentarios
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10B981' }}></span>
            Contactos
          </span>
        </div>

        <svg
          viewBox={`0 0 ${anchoSvg} ${altoSvg}`}
          style={{ width: '100%', height: 'auto', minWidth: '550px', overflow: 'visible' }}
        >
          {pubs.map((pub, idx) => {
            const yBarra = 20 + idx * 46;
            const altoBarra = 22;
            const anchoMaximoBarra = 420;
            const xInicio = 200;

            const anchoVistas = (pub.vistas / maxTotal) * anchoMaximoBarra;
            const anchoLikes = (pub.likes / maxTotal) * anchoMaximoBarra;
            const anchoComentarios = (pub.comentarios / maxTotal) * anchoMaximoBarra;
            const anchoContactos = (pub.contactos / maxTotal) * anchoMaximoBarra;

            return (
              <g
                key={pub.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() =>
                  setTooltipGrafico2({
                    x: xInicio + anchoVistas,
                    y: yBarra,
                    titulo: pub.titulo,
                    metricas: pub,
                    visible: true
                  })
                }
                onMouseLeave={() => setTooltipGrafico2((prev) => ({ ...prev, visible: false }))}
              >
                {/* Título de la publicación a la izquierda */}
                <text
                  x={xInicio - 12}
                  y={yBarra + 15}
                  fill={isDark ? '#E2E8F0' : '#1E293B'}
                  fontSize="12"
                  textAnchor="end"
                  fontWeight="600"
                >
                  {pub.titulo.length > 22 ? `${pub.titulo.substring(0, 22)}...` : pub.titulo}
                </text>

                {/* Fondo de barra */}
                <rect
                  x={xInicio}
                  y={yBarra}
                  width={anchoMaximoBarra}
                  height={altoBarra}
                  rx="6"
                  fill={isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}
                />

                {/* Segmentos apilados */}
                <rect x={xInicio} y={yBarra} width={anchoVistas} height={altoBarra} rx="4" fill="#38BDF8" />
                <rect x={xInicio + anchoVistas} y={yBarra} width={anchoLikes} height={altoBarra} fill="#F43F5E" />
                <rect
                  x={xInicio + anchoVistas + anchoLikes}
                  y={yBarra}
                  width={anchoComentarios}
                  height={altoBarra}
                  fill="#A855F7"
                />
                <rect
                  x={xInicio + anchoVistas + anchoLikes + anchoComentarios}
                  y={yBarra}
                  width={anchoContactos}
                  height={altoBarra}
                  rx="4"
                  fill="#10B981"
                />

                {/* Valor total a la derecha */}
                <text
                  x={xInicio + anchoMaximoBarra + 12}
                  y={yBarra + 15}
                  fill={isDark ? '#94A3B8' : '#64748B'}
                  fontSize="12"
                  fontWeight="700"
                >
                  {pub.totalInteracciones} int.
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip del gráfico 2 */}
        {tooltipGrafico2.visible && tooltipGrafico2.metricas && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(75, (tooltipGrafico2.x / anchoSvg) * 100)}%`,
              top: `${(tooltipGrafico2.y / altoSvg) * 100}%`,
              transform: 'translate(-50%, -110%)',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              border: '1px solid #38BDF8',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              padding: '8px 14px',
              borderRadius: '10px',
              pointerEvents: 'none',
              zIndex: 10,
              fontSize: '0.8rem',
              color: isDark ? '#FFFFFF' : '#0F172A',
              minWidth: '200px'
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: '4px', borderBottom: '1px solid #CBD5E1', paddingBottom: '3px' }}>
              {tooltipGrafico2.titulo}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
              <div>
                <span style={{ color: '#38BDF8' }}>● Vistas:</span> {tooltipGrafico2.metricas.vistas}
              </div>
              <div>
                <span style={{ color: '#F43F5E' }}>● Likes:</span> {tooltipGrafico2.metricas.likes}
              </div>
              <div>
                <span style={{ color: '#A855F7' }}>● Comentarios:</span> {tooltipGrafico2.metricas.comentarios}
              </div>
              <div>
                <span style={{ color: '#10B981' }}>● Contactos:</span> {tooltipGrafico2.metricas.contactos}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizador de flecha de tendencia
  const renderTendencia = (tendencia: 'up' | 'down' | 'neutral', variacion: number, sinDatos: boolean) => {
    if (sinDatos) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            color: isDark ? '#94A3B8' : '#64748B',
            fontWeight: 600
          }}
        >
          <Minus className="w-3.5 h-3.5 text-slate-400" />
          Sin datos previos
        </span>
      );
    }

    if (tendencia === 'up') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.82rem',
            color: '#10B981',
            fontWeight: 700
          }}
        >
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          +{variacion}% vs. período anterior
        </span>
      );
    }

    if (tendencia === 'down') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.82rem',
            color: '#EF4444',
            fontWeight: 700
          }}
        >
          <TrendingDown className="w-4 h-4 text-rose-500" />
          {variacion}% vs. período anterior
        </span>
      );
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.82rem',
          color: isDark ? '#94A3B8' : '#64748B',
          fontWeight: 700
        }}
      >
        <Minus className="w-4 h-4 text-slate-400" />
        0.0% (Estable)
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#030712' : '#F8FAFC',
        color: isDark ? '#F8FAFC' : '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      <Navbar />

      {/* Toast Notificación */}
      {mensajeToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#0F172A',
            border: '2px solid #D97706',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            padding: '12px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 700
          }}
        >
          <CheckCircle2 className="w-5 h-5 text-amber-500" />
          <span>{mensajeToast}</span>
        </div>
      )}

      <main
        style={{
          flex: 1,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.25rem 4rem'
        }}
      >
        {/* Navegación Miga de Pan */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: isDark ? '#94A3B8' : '#64748B',
            marginBottom: '1.5rem'
          }}
        >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/portal-ciudadano" style={{ color: 'inherit', textDecoration: 'none' }}>
            Portal Ciudadano
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span style={{ color: isDark ? '#38BDF8' : '#0053AF', fontWeight: 700 }}>Mi Perfil Comercial</span>
        </div>

        {/* ====================================================================
            CABECERA DEL PERFIL COMERCIAL (Sin exposición de Cédula - Ley 8968)
            ==================================================================== */}
        <section
          style={{
            position: 'relative',
            borderRadius: '24px',
            backgroundColor: isDark ? 'rgba(7, 13, 27, 0.95)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(6, 42, 119, 0.12)',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: isDark ? '0 12px 30px rgba(0, 0, 0, 0.5)' : '0 12px 30px rgba(6, 42, 119, 0.05)',
            overflow: 'hidden'
          }}
        >
          {/* Acento tricolor costarricense */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #001489 0%, #FFFFFF 33.3%, #DA291C 66.6%, #001489 100%)'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Logo / Emblema Comercial */}
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '20px',
                  backgroundColor: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(217, 119, 6, 0.35)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {perfil?.logoUrl ? (
                  <img
                    src={perfil.logoUrl}
                    alt={perfil?.nombreComercio}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Store className="w-10 h-10 text-white" />
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Comercio Acreditado & Activo
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#EFF6FF',
                      color: isDark ? '#38BDF8' : '#0053AF',
                      border: isDark ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid #BFDBFE',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Building className="w-3.5 h-3.5" />
                    Patente: {perfil?.patenteCantonal || 'PAT-SJ-2026-4412'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    Cantón de {perfil?.canton || 'San José'}, {perfil?.provincia || 'San José'}
                  </span>
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: '1.9rem',
                    fontWeight: 800,
                    color: isDark ? '#FFFFFF' : '#062A77',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {perfil?.nombreComercio || 'Panadería y Repostería El Buen Sabor'}
                </h1>
                <p
                  style={{
                    margin: '0.4rem 0 0',
                    fontSize: '0.9rem',
                    color: isDark ? '#CBD5E1' : '#475569',
                    maxWidth: '680px',
                    lineHeight: 1.5
                  }}
                >
                  {perfil?.descripcion ||
                    'Elaboración artesanal de pan campesino, repostería tradicional tica y productos libres de preservantes con patente cantonal activa.'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    marginTop: '0.6rem',
                    fontSize: '0.82rem',
                    color: isDark ? '#94A3B8' : '#64748B',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>
                    <strong>Categoría:</strong> {perfil?.categoria || 'Alimentos y Panadería Artesanal'}
                  </span>
                  <span>
                    <strong>Contacto:</strong> {perfil?.contacto || '+506 8899-7711'}
                  </span>
                  <span>
                    <strong>Titular:</strong> {currentUser?.nombre || 'Carlos Hernández Rojas'}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones principales */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setModalEditarPerfil(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.3rem',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#EFF6FF',
                  border: isDark ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #BAE6FD',
                  color: isDark ? '#38BDF8' : '#0053AF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar Información</span>
              </button>

              <button
                onClick={handleAbrirCrearPublicacion}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  backgroundColor: '#D97706',
                  border: '1px solid #F59E0B',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Publicación</span>
              </button>
            </div>
          </div>

          {/* Garantía Ley 8968 */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(0, 43, 127, 0.25)' : '#F1F5F9',
              border: isDark ? '1px solid rgba(121, 166, 255, 0.25)' : '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              color: isDark ? '#CBD5E1' : '#334155'
            }}
          >
            <Lock className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-sky-400' : 'text-[#0053AF]'}`} />
            <span>
              <strong>Protección de Datos Soberana (Ley N° 8968):</strong> Tu cédula oficial no es pública ni se expone
              en el perfil comercial ni en las vitrinas vecinales. Solo tu patente cantonal y nombre comercial son
              visibles ante la ciudadanía.
            </span>
          </div>
        </section>

        {/* ====================================================================
            BARRA DE PESTAÑAS (TABS)
            ==================================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}
        >
          <button
            onClick={() => setTabActiva('crecimiento')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'transparent',
              color: tabActiva === 'crecimiento' ? (isDark ? '#38BDF8' : '#0053AF') : isDark ? '#94A3B8' : '#64748B',
              borderBottom: tabActiva === 'crecimiento' ? '3px solid #D97706' : '3px solid transparent',
              fontSize: '0.92rem',
              fontWeight: tabActiva === 'crecimiento' ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Crecimiento & Actividad</span>
          </button>

          <button
            onClick={() => setTabActiva('mis_publicaciones')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'transparent',
              color:
                tabActiva === 'mis_publicaciones' ? (isDark ? '#38BDF8' : '#0053AF') : isDark ? '#94A3B8' : '#64748B',
              borderBottom: tabActiva === 'mis_publicaciones' ? '3px solid #D97706' : '3px solid transparent',
              fontSize: '0.92rem',
              fontWeight: tabActiva === 'mis_publicaciones' ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Layers className="w-4 h-4" />
            <span>Mis Publicaciones ({misPublicaciones.length})</span>
          </button>

          <button
            onClick={() => setTabActiva('vitrina_otros')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'transparent',
              color:
                tabActiva === 'vitrina_otros' ? (isDark ? '#38BDF8' : '#0053AF') : isDark ? '#94A3B8' : '#64748B',
              borderBottom: tabActiva === 'vitrina_otros' ? '3px solid #D97706' : '3px solid transparent',
              fontSize: '0.92rem',
              fontWeight: tabActiva === 'vitrina_otros' ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Store className="w-4 h-4" />
            <span>Vitrina de Otros Comercios ({publicacionesOtros.length})</span>
          </button>
        </div>

        {/* ====================================================================
            PESTAÑA 1: CRECIMIENTO & ACTIVIDAD (Requisitos 5 y 6)
            ==================================================================== */}
        {tabActiva === 'crecimiento' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header del apartado de Crecimiento */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: isDark ? '#FFFFFF' : '#062A77',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <span>Crecimiento de mi comercio</span>
                </h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Comparativa de rendimiento respecto al ciclo anterior e impacto en la comunidad local.
                </p>
              </div>

              {/* Selector de Período (30 días / 6 meses / 12 meses) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#E2E8F0',
                  padding: '4px',
                  borderRadius: '12px'
                }}
              >
                {(['30d', '6m', '12m'] as const).map((p) => {
                  const esActivo = periodoFiltro === p;
                  const label = p === '30d' ? '30 Días' : p === '6m' ? '6 Meses' : '12 Meses';
                  return (
                    <button
                      key={p}
                      onClick={() => setPeriodoFiltro(p)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: esActivo ? (isDark ? '#D97706' : '#0053AF') : 'transparent',
                        color: esActivo ? '#FFFFFF' : isDark ? '#CBD5E1' : '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Texto Resumen Automático */}
            <div
              style={{
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                backgroundColor: isDark ? 'rgba(217, 119, 6, 0.12)' : '#FEF3C7',
                border: isDark ? '1px solid rgba(217, 119, 6, 0.35)' : '1px solid #FDE68A',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                color: isDark ? '#FDE68A' : '#92400E'
              }}
            >
              <Sparkles className="w-6 h-6 shrink-0 text-amber-500" />
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {metricas?.crecimiento?.textoResumen || 'Tu comercio mantiene un impacto positivo en tu comunidad.'}
              </div>
            </div>

            {/* 3 Tarjetas de Resumen Comparativo */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {/* Tarjeta 1: Publicaciones */}
              <div
                style={{
                  borderRadius: '18px',
                  backgroundColor: isDark ? 'rgba(7, 13, 27, 0.85)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  padding: '1.5rem',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#94A3B8' : '#64748B' }}>
                    Publicaciones Creadas
                  </span>
                  <Layers className="w-4 h-4 text-amber-500" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '0.4rem' }}>
                  {metricas?.crecimiento?.publicaciones?.actual ?? 0}
                </div>
                <div>
                  {metricas?.crecimiento?.publicaciones &&
                    renderTendencia(
                      metricas.crecimiento.publicaciones.tendencia,
                      metricas.crecimiento.publicaciones.variacion,
                      metricas.crecimiento.publicaciones.sinDatosPrevios
                    )}
                </div>
              </div>

              {/* Tarjeta 2: Vistas / Interacciones */}
              <div
                style={{
                  borderRadius: '18px',
                  backgroundColor: isDark ? 'rgba(7, 13, 27, 0.85)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  padding: '1.5rem',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#94A3B8' : '#64748B' }}>
                    Interacciones y Vistas
                  </span>
                  <Eye className="w-4 h-4 text-sky-400" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '0.4rem' }}>
                  {metricas?.crecimiento?.interacciones?.actual ?? 0}
                </div>
                <div>
                  {metricas?.crecimiento?.interacciones &&
                    renderTendencia(
                      metricas.crecimiento.interacciones.tendencia,
                      metricas.crecimiento.interacciones.variacion,
                      metricas.crecimiento.interacciones.sinDatosPrevios
                    )}
                </div>
              </div>

              {/* Tarjeta 3: Contactos / Clientes */}
              <div
                style={{
                  borderRadius: '18px',
                  backgroundColor: isDark ? 'rgba(7, 13, 27, 0.85)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  padding: '1.5rem',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#94A3B8' : '#64748B' }}>
                    Contactos Directos
                  </span>
                  <PhoneCall className="w-4 h-4 text-emerald-500" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '0.4rem' }}>
                  {metricas?.crecimiento?.contactos?.actual ?? 0}
                </div>
                <div>
                  {metricas?.crecimiento?.contactos &&
                    renderTendencia(
                      metricas.crecimiento.contactos.tendencia,
                      metricas.crecimiento.contactos.variacion,
                      metricas.crecimiento.contactos.sinDatosPrevios
                    )}
                </div>
              </div>
            </div>

            {/* ================================================================
                DOS GRÁFICOS DE ACTIVIDAD COMERCIAL
                ================================================================ */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {/* Gráfico 1: Publicaciones Creadas por Mes */}
              <div
                style={{
                  borderRadius: '20px',
                  backgroundColor: isDark ? 'rgba(7, 13, 27, 0.9)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  padding: '1.75rem',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: isDark ? '#FFFFFF' : '#062A77',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Publicaciones Creadas por Mes</span>
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    Historial de ofertas y productos registrados en los últimos 12 meses
                  </p>
                </div>

                {renderGrafico1()}
              </div>

              {/* Gráfico 2: Interacciones por Publicación */}
              <div
                style={{
                  borderRadius: '20px',
                  backgroundColor: isDark ? 'rgba(7, 13, 27, 0.9)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  padding: '1.75rem',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: isDark ? '#FFFFFF' : '#062A77',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <BarChart3 className="w-4 h-4 text-sky-400" />
                    <span>Interacciones por Publicación</span>
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    Desglose de vistas, me gusta, comentarios y contactos para tus publicaciones principales
                  </p>
                </div>

                {renderGrafico2()}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PESTAÑA 2: MIS PUBLICACIONES (CRUD) (Requisito 3)
            ==================================================================== */}
        {tabActiva === 'mis_publicaciones' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: isDark ? '#FFFFFF' : '#062A77',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Layers className="w-5 h-5 text-amber-500" />
                  <span>Mis Publicaciones Comerciales</span>
                </h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Gestiona el catálogo de productos y promociones visibles para los vecinos de tu cantón.
                </p>
              </div>

              <button
                onClick={handleAbrirCrearPublicacion}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.3rem',
                  borderRadius: '12px',
                  backgroundColor: '#D97706',
                  border: '1px solid #F59E0B',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Nueva Publicación</span>
              </button>
            </div>

            {misPublicaciones.length === 0 ? (
              <div
                style={{
                  borderRadius: '20px',
                  backgroundColor: isDark ? 'rgba(7, 13, 27, 0.7)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  color: isDark ? '#94A3B8' : '#64748B'
                }}
              >
                <Store className="w-12 h-12 mx-auto mb-3 text-amber-500 opacity-60" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Aún no tienes publicaciones activas
                </h3>
                <p style={{ maxWidth: '420px', margin: '0.5rem auto 1.5rem', fontSize: '0.88rem' }}>
                  Publica tus productos, servicios o promociones para que los vecinos de tu cantón puedan conocerte y contactarte.
                </p>
                <button
                  onClick={handleAbrirCrearPublicacion}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    backgroundColor: '#D97706',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Crear mi primera publicación
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {misPublicaciones.map((pub) => (
                  <div
                    key={pub.id}
                    style={{
                      borderRadius: '18px',
                      backgroundColor: isDark ? 'rgba(7, 13, 27, 0.9)' : '#FFFFFF',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.35)' : '0 8px 24px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Imagen de la publicación */}
                    <div style={{ position: 'relative', height: '180px', backgroundColor: '#0F172A', overflow: 'hidden' }}>
                      <img
                        src={pub.imagenUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'}
                        alt={pub.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {pub.categoria}
                      </span>
                      {pub.precio && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            backgroundColor: '#D97706',
                            color: '#FFFFFF',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                          }}
                        >
                          {pub.precio}
                        </span>
                      )}
                    </div>

                    {/* Contenido */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: isDark ? '#FFFFFF' : '#0F172A',
                          lineHeight: 1.3
                        }}
                      >
                        {pub.titulo}
                      </h3>
                      <p
                        style={{
                          margin: '0.5rem 0 1rem',
                          fontSize: '0.85rem',
                          color: isDark ? '#CBD5E1' : '#475569',
                          lineHeight: 1.45,
                          flex: 1
                        }}
                      >
                        {pub.descripcion}
                      </p>

                      {/* Métricas por publicación */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '10px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                          fontSize: '0.78rem',
                          color: isDark ? '#94A3B8' : '#64748B',
                          marginBottom: '1rem'
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          {pub.metricas?.vistas ?? 0}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          {pub.metricas?.likes ?? 0}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
                          {pub.metricas?.comentarios ?? 0}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                          {pub.metricas?.contactos ?? 0}
                        </span>
                      </div>

                      {/* Botones de acción */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAbrirEditarPublicacion(pub)}
                          style={{
                            flex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            padding: '0.55rem',
                            borderRadius: '10px',
                            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#EFF6FF',
                            border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #BAE6FD',
                            color: isDark ? '#38BDF8' : '#0053AF',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Editar
                        </button>
                        <button
                          onClick={() => setModalEliminar({ abierto: true, id: pub.id, titulo: pub.titulo })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.55rem 0.8rem',
                            borderRadius: '10px',
                            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FECACA',
                            color: '#EF4444',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            PESTAÑA 3: VITRINA DE OTROS COMERCIOS (Excluyendo las propias)
            ==================================================================== */}
        {tabActiva === 'vitrina_otros' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: isDark ? '#FFFFFF' : '#062A77',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Store className="w-5 h-5 text-amber-500" />
                  <span>Vitrina de Otros Comercios Cantonales</span>
                </h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Conoce y colabora con otros emprendedores y negocios locales de Costa Rica.
                </p>
              </div>

              {/* Filtros de búsqueda */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busquedaOtros}
                    onChange={(e) => {
                      setBusquedaOtros(e.target.value);
                      setPaginaOtros(1);
                    }}
                    placeholder="Buscar producto o comercio..."
                    style={{
                      padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '0.82rem',
                      outline: 'none',
                      minWidth: '220px'
                    }}
                  />
                </div>

                <select
                  value={categoriaOtros}
                  onChange={(e) => {
                    setCategoriaOtros(e.target.value);
                    setPaginaOtros(1);
                  }}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="todas">Todas las Categorías</option>
                  {categoriasDisponibles.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {otrasPaginadas.length === 0 ? (
              <div
                style={{
                  borderRadius: '20px',
                  backgroundColor: isDark ? 'rgba(7, 13, 27, 0.7)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  padding: '3rem',
                  textAlign: 'center',
                  color: isDark ? '#94A3B8' : '#64748B'
                }}
              >
                <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p style={{ fontWeight: 600 }}>No se encontraron publicaciones con los filtros aplicados</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {otrasPaginadas.map((pub) => (
                  <div
                    key={pub.id}
                    style={{
                      borderRadius: '16px',
                      backgroundColor: isDark ? 'rgba(7, 13, 27, 0.85)' : '#FFFFFF',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.3)' : '0 6px 20px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ position: 'relative', height: '160px', backgroundColor: '#0F172A' }}>
                      <img
                        src={pub.imagenUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'}
                        alt={pub.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}
                      >
                        {pub.categoria}
                      </span>
                      {pub.precio && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            backgroundColor: '#0053AF',
                            color: '#FFFFFF',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: 800
                          }}
                        >
                          {pub.precio}
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#D97706',
                          fontWeight: 700,
                          marginBottom: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Store className="w-3.5 h-3.5" />
                        {pub.nombreComercio}
                      </div>

                      <h4
                        style={{
                          margin: '0 0 0.4rem',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: isDark ? '#FFFFFF' : '#0F172A',
                          lineHeight: 1.3
                        }}
                      >
                        {pub.titulo}
                      </h4>

                      <p
                        style={{
                          margin: '0 0 0.8rem',
                          fontSize: '0.82rem',
                          color: isDark ? '#CBD5E1' : '#475569',
                          lineHeight: 1.4,
                          flex: 1
                        }}
                      >
                        {pub.descripcion}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.75rem',
                          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                          {pub.canton || 'Cantón Local'}
                        </span>
                        {pub.contacto && (
                          <a
                            href={`https://wa.me/${pub.contacto.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#10B981',
                              textDecoration: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            Contactar
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {otrasPublicacionesFiltradas.length > itemsPorPagina * paginaOtros && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={() => setPaginaOtros((p) => p + 1)}
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#EFF6FF',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid #BFDBFE',
                    color: isDark ? '#38BDF8' : '#0053AF',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cargar más publicaciones ({otrasPublicacionesFiltradas.length - itemsPorPagina * paginaOtros} restantes)
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ====================================================================
          MODAL: EDITAR INFORMACIÓN COMERCIAL
          ==================================================================== */}
      {modalEditarPerfil && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? '#0B132B' : '#FFFFFF',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #CBD5E1',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#062A77' }}>
                Editar Información Comercial
              </h3>
              <button
                onClick={() => setModalEditarPerfil(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isDark ? '#94A3B8' : '#64748B' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Nombre Comercial / Fantasía
                </label>
                <input
                  type="text"
                  required
                  value={formPerfil.nombreComercio}
                  onChange={(e) => setFormPerfil({ ...formPerfil, nombreComercio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Categoría
                </label>
                <input
                  type="text"
                  required
                  value={formPerfil.categoria}
                  onChange={(e) => setFormPerfil({ ...formPerfil, categoria: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Descripción del Negocio
                </label>
                <textarea
                  rows={3}
                  required
                  value={formPerfil.descripcion}
                  onChange={(e) => setFormPerfil({ ...formPerfil, descripcion: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Teléfono / WhatsApp de Contacto
                </label>
                <input
                  type="text"
                  required
                  value={formPerfil.contacto}
                  onChange={(e) => setFormPerfil({ ...formPerfil, contacto: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  URL de Logo (Opcional)
                </label>
                <input
                  type="text"
                  value={formPerfil.logoUrl}
                  onChange={(e) => setFormPerfil({ ...formPerfil, logoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setModalEditarPerfil(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isDark ? '#CBD5E1' : '#64748B',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CREAR / EDITAR PUBLICACIÓN
          ==================================================================== */}
      {modalPublicacion && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? '#0B132B' : '#FFFFFF',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #CBD5E1',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#062A77' }}>
                {publicacionEditando ? 'Editar Publicación' : 'Nueva Publicación Comercial'}
              </h3>
              <button
                onClick={() => setModalPublicacion(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isDark ? '#94A3B8' : '#64748B' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarPublicacion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Título de la Publicación / Producto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pan Dulce Casero Recién Horneado"
                  value={formPublicacion.titulo}
                  onChange={(e) => setFormPublicacion({ ...formPublicacion, titulo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Categoría
                  </label>
                  <input
                    type="text"
                    required
                    value={formPublicacion.categoria}
                    onChange={(e) => setFormPublicacion({ ...formPublicacion, categoria: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Precio o Promoción
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: ₡2.500 / bolsa o 2x1"
                    value={formPublicacion.precio}
                    onChange={(e) => setFormPublicacion({ ...formPublicacion, precio: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Descripción detallada
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalles sobre ingredientes, disponibilidad, horario de entrega..."
                  value={formPublicacion.descripcion}
                  onChange={(e) => setFormPublicacion({ ...formPublicacion, descripcion: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    WhatsApp o Teléfono
                  </label>
                  <input
                    type="text"
                    value={formPublicacion.contacto}
                    onChange={(e) => setFormPublicacion({ ...formPublicacion, contacto: e.target.value })}
                    placeholder="+506 8899-7711"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    URL Imagen (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formPublicacion.imagenUrl}
                    onChange={(e) => setFormPublicacion({ ...formPublicacion, imagenUrl: e.target.value })}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setModalPublicacion(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isDark ? '#CBD5E1' : '#64748B',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {guardando ? 'Guardando...' : publicacionEditando ? 'Actualizar' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CONFIRMACIÓN DE ELIMINACIÓN
          ==================================================================== */}
      {modalEliminar.abierto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? '#0B132B' : '#FFFFFF',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              textAlign: 'center'
            }}
          >
            <Trash2 className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              ¿Eliminar esta publicación?
            </h3>
            <p style={{ margin: '0.6rem 0 1.5rem', fontSize: '0.88rem', color: isDark ? '#CBD5E1' : '#475569' }}>
              Se eliminará <strong>"{modalEliminar.titulo}"</strong> de forma permanente del catálogo comercial vecinal.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setModalEliminar({ abierto: false, id: null, titulo: '' })}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: isDark ? '#CBD5E1' : '#64748B',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminar}
                disabled={guardando}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {guardando ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilComercialPage;
