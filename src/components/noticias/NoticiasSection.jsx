import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Newspaper,
  Building2,
  Search,
  Filter,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  X,
  SlidersHorizontal,
  ArrowDownCircle,
  Compass,
  Send,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  obtenerNoticias,
  eliminarNoticia,
  esEncargadoMunicipal,
  suscribirCambiosNoticias
} from '../../services/noticiasService';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../../data/costaRicaTerritorialData';
import NoticiaFeedPost from './NoticiaFeedPost';
import NoticiaFormModal from './NoticiaFormModal';

const CATEGORIAS_FILTRO = [
  'Todas',
  'Obras Públicas',
  'Gobernanza & Trámites',
  'Participación Ciudadana',
  'Seguridad & Emergencias',
  'Medio Ambiente & Sostenibilidad',
  'Desarrollo Local & Empleo',
  'Cultura & Comunidad',
  'Comercio & Turismo'
];

const PROVINCIAS_CHIPS = [
  { id: 'todas', nombre: 'Todas' },
  { id: 'san-jose', nombre: 'San José' },
  { id: 'alajuela', nombre: 'Alajuela' },
  { id: 'cartago', nombre: 'Cartago' },
  { id: 'heredia', nombre: 'Heredia' },
  { id: 'guanacaste', nombre: 'Guanacaste' },
  { id: 'puntarenas', nombre: 'Puntarenas' },
  { id: 'limon', nombre: 'Limón' }
];

const PAGE_SIZE = 5;

/**
 * Módulo 01: Noticias y Comunicados Municipales
 * Rediseñado como un Feed Social Vertical Continuo (Timeline estilo Facebook/Social Wall).
 * Cada comunicado se presenta con su imagen destacada, reacciones cívicas y sección de
 * comentarios integrada de forma inline con persistencia en db.json.
 */
export default function NoticiasSection({
  provinciaInicial = 'todas',
  cantonInicial = 'todos',
  mostrarEncabezadoCompleto = true,
  tituloPersonalizado = null
}) {
  const { user } = useAuth();
  const tienePermisoEditor = esEncargadoMunicipal(user);

  // Estados de Datos del Feed
  const [noticias, setNoticias] = useState([]);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalNoticias, setTotalNoticias] = useState(0);
  const [hayMas, setHayMas] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [alertaGlobal, setAlertaGlobal] = useState(null);

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState('');
  const [busquedaDebounced, setBusquedaDebounced] = useState('');
  const [provinciaFiltro, setProvinciaFiltro] = useState(provinciaInicial);
  const [cantonFiltro, setCantonFiltro] = useState(cantonInicial);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Estados de Modal de Publicación/Edición
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [noticiaParaEditar, setNoticiaParaEditar] = useState(null);

  // Ref para IntersectionObserver de scroll infinito
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Debounce para la búsqueda de texto
  useEffect(() => {
    const timer = setTimeout(() => {
      setBusquedaDebounced(busqueda);
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  // Cantones disponibles según la provincia seleccionada
  const cantonesDisponibles = useMemo(() => {
    if (!provinciaFiltro || provinciaFiltro.toLowerCase() === 'todas') {
      return CANTONES_OFICIALES;
    }
    const provObj = PROVINCIAS_DATA.find(
      (p) => p.nombre.toLowerCase() === provinciaFiltro.toLowerCase()
    );
    if (!provObj) return CANTONES_OFICIALES;
    return CANTONES_OFICIALES.filter((c) => c.provinciaId === provObj.id);
  }, [provinciaFiltro]);

  // Cargar noticias iniciales o tras cambiar filtros
  const cargarNoticiasInicial = useCallback(async () => {
    setCargandoInicial(true);
    setErrorMsg('');
    try {
      const data = await obtenerNoticias({
        provincia: provinciaFiltro !== 'todas' ? provinciaFiltro : undefined,
        canton: cantonFiltro !== 'todos' ? cantonFiltro : undefined,
        categoria: categoriaFiltro !== 'Todas' ? categoriaFiltro : undefined,
        busqueda: busquedaDebounced.trim() || undefined,
        _page: 1,
        _limit: PAGE_SIZE
      });

      const items = Array.isArray(data) ? data : [];
      setNoticias(items);
      setPaginaActual(1);

      const total = typeof data.total === 'number' ? data.total : items.length;
      setTotalNoticias(total);
      setHayMas(items.length < total);
    } catch (err) {
      console.error('[NoticiasSection] Error al cargar el feed de noticias:', err);
      setErrorMsg('No se pudieron sincronizar los comunicados municipales desde el servidor.');
    } finally {
      setCargandoInicial(false);
    }
  }, [provinciaFiltro, cantonFiltro, categoriaFiltro, busquedaDebounced]);

  // Cargar siguiente página del feed (Scroll infinito / Carga continua)
  const cargarMasNoticias = useCallback(async () => {
    if (cargandoMas || !hayMas) return;
    setCargandoMas(true);
    const siguientePagina = paginaActual + 1;

    try {
      const data = await obtenerNoticias({
        provincia: provinciaFiltro !== 'todas' ? provinciaFiltro : undefined,
        canton: cantonFiltro !== 'todos' ? cantonFiltro : undefined,
        categoria: categoriaFiltro !== 'Todas' ? categoriaFiltro : undefined,
        busqueda: busquedaDebounced.trim() || undefined,
        _page: siguientePagina,
        _limit: PAGE_SIZE
      });

      const nuevosItems = Array.isArray(data) ? data : [];
      if (nuevosItems.length > 0) {
        setNoticias((prev) => {
          // Evitar duplicados por id
          const idsExistentes = new Set(prev.map((n) => n.id));
          const filtrados = nuevosItems.filter((n) => !idsExistentes.has(n.id));
          return [...prev, ...filtrados];
        });
        setPaginaActual(siguientePagina);

        const total = typeof data.total === 'number' ? data.total : totalNoticias;
        setTotalNoticias(total);
        setHayMas(siguientePagina * PAGE_SIZE < total);
      } else {
        setHayMas(false);
      }
    } catch (err) {
      console.error('[NoticiasSection] Error al cargar más noticias:', err);
    } finally {
      setCargandoMas(false);
    }
  }, [cargandoMas, hayMas, paginaActual, provinciaFiltro, cantonFiltro, categoriaFiltro, busquedaDebounced, totalNoticias]);

  // Recargar al cambiar filtros
  useEffect(() => {
    cargarNoticiasInicial();
  }, [cargarNoticiasInicial]);

  // Suscribirse a cambios en tiempo real desde el servicio
  useEffect(() => {
    const desuscribir = suscribirCambiosNoticias((nuevas) => {
      if (Array.isArray(nuevas)) {
        setNoticias((prev) => {
          // Si estamos en la página inicial, actualizar
          const mapaNuevas = new Map(nuevas.map((n) => [n.id, n]));
          return prev.map((item) => mapaNuevas.get(item.id) || item);
        });
      }
    });
    return desuscribir;
  }, []);

  // IntersectionObserver para carga continua automática
  useEffect(() => {
    if (cargandoInicial || !hayMas) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hayMas && !cargandoMas) {
          cargarMasNoticias();
        }
      },
      { rootMargin: '300px' }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [cargandoInicial, hayMas, cargandoMas, cargarMasNoticias]);

  // Manejar cambio de provincia desde chip o select
  const handleSeleccionarProvincia = (prov) => {
    setProvinciaFiltro(prov);
    setCantonFiltro('todos');
  };

  // Manejador: Editar Noticia (Exclusivo Encargado Municipal)
  const handleEditarNoticia = (noticia) => {
    if (!tienePermisoEditor) {
      setAlertaGlobal({
        tipo: 'error',
        texto: 'Acceso Denegado (RBAC): Sólo un Encargado Municipal puede modificar comunicados oficiales.'
      });
      return;
    }
    setNoticiaParaEditar(noticia);
    setModalFormAbierto(true);
  };

  // Manejador: Crear Noticia (Exclusivo Encargado Municipal)
  const handleNuevaNoticia = () => {
    if (!tienePermisoEditor) {
      setAlertaGlobal({
        tipo: 'error',
        texto: 'Acceso Denegado (RBAC): Se requiere rol de "Encargado Municipal" para publicar.'
      });
      return;
    }
    setNoticiaParaEditar(null);
    setModalFormAbierto(true);
  };

  // Manejador: Dar de baja noticia
  const handleEliminarNoticia = async (id) => {
    if (!tienePermisoEditor) {
      setAlertaGlobal({
        tipo: 'error',
        texto: 'Acceso Denegado (RBAC): Se requiere rol de "Encargado Municipal" para dar de baja comunicados.'
      });
      return;
    }

    try {
      await eliminarNoticia(id, user);
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      setTotalNoticias((prev) => Math.max(0, prev - 1));
      setAlertaGlobal({
        tipo: 'exito',
        texto: 'El comunicado municipal ha sido dado de baja correctamente de db.json.'
      });
    } catch (err) {
      console.error('[NoticiasSection] Error al eliminar:', err);
      setAlertaGlobal({
        tipo: 'error',
        texto: err.message || 'Error al eliminar el comunicado oficial.'
      });
    }
  };

  // Callback tras guardar con éxito en NoticiaFormModal
  const handleGuardadoExitoso = (noticiaGuardada) => {
    setAlertaGlobal({
      tipo: 'exito',
      texto: noticiaParaEditar
        ? '¡Comunicado municipal actualizado con éxito en db.json!'
        : '¡Nuevo comunicado oficial publicado satisfactoriamente en el muro cantonal!'
    });
    cargarNoticiasInicial();
  };

  // Callback cuando se actualiza un post en el feed (comentarios / reacciones)
  const handlePostActualizado = (postActualizado) => {
    setNoticias((prev) =>
      prev.map((n) => (n.id === postActualizado.id ? postActualizado : n))
    );
  };

  return (
    <section
      id="modulo-noticias"
      aria-label="Feed Social de Noticias y Comunicados Municipales"
      style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 1rem 3rem'
      }}
    >
      {/* ===================================================================== */}
      {/* 1. ENCABEZADO INSTITUCIONAL                                           */}
      {/* ===================================================================== */}
      {mostrarEncabezadoCompleto && (
        <div
          style={{
            maxWidth: '48rem', // max-w-3xl centrado
            margin: '0 auto 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
              }}
            >
              <Newspaper size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#38BDF8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(56, 189, 248, 0.25)'
                  }}
                >
                  M01 • Muro Social Cantonal
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                  84 Gobiernos Locales
                </span>
              </div>
              <h1
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  color: '#F8FAFC',
                  letterSpacing: '-0.02em'
                }}
              >
                {tituloPersonalizado || 'Noticias y Comunicados Municipales'}
              </h1>
            </div>
          </div>

          {/* Botón de Refresco & Conexión Oficial */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={cargarNoticiasInicial}
              disabled={cargandoInicial}
              title="Sincronizar feed con db.json"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                padding: '0.6rem',
                borderRadius: '10px',
                cursor: cargandoInicial ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={16} className={cargandoInicial ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}

      {/* Alerta de Feedback Global */}
      {alertaGlobal && (
        <div
          style={{
            maxWidth: '48rem',
            margin: '0 auto 1.5rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '14px',
            backgroundColor:
              alertaGlobal.tipo === 'exito'
                ? 'rgba(16, 185, 129, 0.15)'
                : alertaGlobal.tipo === 'info'
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${
              alertaGlobal.tipo === 'exito'
                ? 'rgba(16, 185, 129, 0.3)'
                : alertaGlobal.tipo === 'info'
                ? 'rgba(56, 189, 248, 0.3)'
                : 'rgba(239, 68, 68, 0.3)'
            }`,
            color:
              alertaGlobal.tipo === 'exito'
                ? '#34D399'
                : alertaGlobal.tipo === 'info'
                ? '#38BDF8'
                : '#F87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.86rem',
            fontWeight: 500,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {alertaGlobal.tipo === 'exito' && <CheckCircle2 size={18} />}
            {alertaGlobal.tipo === 'info' && <Sparkles size={18} />}
            {alertaGlobal.tipo === 'error' && <AlertCircle size={18} />}
            <span>{alertaGlobal.texto}</span>
          </div>
          <button
            onClick={() => setAlertaGlobal(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. BARRA DE FILTROS RÁPIDOS Y CHIPS DE PROVINCIA (HORIZONTAL)         */}
      {/* ===================================================================== */}
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        {/* Buscador de Texto y Botón de Filtros Avanzados */}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B'
              }}
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar comunicados por tema, cantón, obra o palabra clave..."
              style={{
                width: '100%',
                backgroundColor: '#0c1322',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0.7rem 0.85rem 0.7rem 2.5rem',
                color: '#F8FAFC',
                fontSize: '0.86rem',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25)'
              }}
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Toggle de Filtros Avanzados (Cantón y Categoría) */}
          <button
            type="button"
            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: mostrarFiltrosAvanzados ? 'rgba(56, 189, 248, 0.18)' : '#0c1322',
              border: mostrarFiltrosAvanzados ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
              color: mostrarFiltrosAvanzados ? '#38BDF8' : '#CBD5E1',
              padding: '0.7rem 1rem',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <SlidersHorizontal size={15} />
            <span>Filtros</span>
          </button>
        </div>

        {/* Barra Horizontal Deslizable de Chips de Provincias */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.35rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {PROVINCIAS_CHIPS.map((p) => {
            const activo =
              provinciaFiltro.toLowerCase() === p.nombre.toLowerCase() ||
              (p.id === 'todas' && (provinciaFiltro === 'todas' || provinciaFiltro === 'TODAS'));

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSeleccionarProvincia(p.id === 'todas' ? 'todas' : p.nombre)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: activo
                    ? '1px solid #38BDF8'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: activo
                    ? 'rgba(56, 189, 248, 0.18)'
                    : 'rgba(15, 23, 42, 0.7)',
                  color: activo ? '#38BDF8' : '#94A3B8',
                  boxShadow: activo ? '0 0 14px rgba(56, 189, 248, 0.25)' : 'none',
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Compass size={12} />
                <span>{p.nombre}</span>
              </button>
            );
          })}
        </div>

        {/* Panel Desplegable de Filtros Avanzados (Cantón y Categoría) */}
        {mostrarFiltrosAvanzados && (
          <div
            style={{
              backgroundColor: '#0c1322',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
              animation: 'fadeIn 0.2s ease-in'
            }}
          >
            {/* Selector de Cantón */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.3rem', fontWeight: 600 }}>
                Cantón Específico:
              </label>
              <select
                value={cantonFiltro}
                onChange={(e) => setCantonFiltro(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#050B17',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem',
                  color: '#F8FAFC',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="todos">Todos los Cantones</option>
                {cantonesDisponibles.map((c, idx) => (
                  <option key={`${c.provinciaId || ''}-${c.id || idx}-${c.nombre}`} value={c.nombre}>
                    Cantón de {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Categoría */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.3rem', fontWeight: 600 }}>
                Categoría Temática:
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#050B17',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem',
                  color: '#F8FAFC',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {CATEGORIAS_FILTRO.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'Todas' ? 'Todas las Categorías' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. CONTENEDOR CENTRAL DEL FEED VERTICAL (MAX-W-3XL MX-AUTO SPACE-Y-6) */}
      {/* ===================================================================== */}
      <div
        style={{
          maxWidth: '48rem', // max-w-3xl
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem' // space-y-6
        }}
      >
        {/* =================================================================== */}
        {/* BARRA SUPERIOR DE PUBLICACIÓN PARA EL ENCARGADO MUNICIPAL (FACEBOOK)  */}
        {/* =================================================================== */}
        {tienePermisoEditor && (
          <div
            style={{
              backgroundColor: '#0c1322',
              backgroundImage: 'radial-gradient(ellipse at top, rgba(56, 189, 248, 0.08) 0%, rgba(12, 19, 34, 0.95) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Avatar del Encargado Municipal */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
                  border: '1.5px solid #38BDF8',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}
              >
                {(user?.nombre || 'E').charAt(0).toUpperCase()}
              </div>

              {/* Input trigger simulado que abre el formulario */}
              <button
                type="button"
                onClick={handleNuevaNoticia}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '0.75rem 1.25rem',
                  color: '#94A3B8',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.currentTarget.style.color = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#94A3B8';
                }}
              >
                <span>¿Qué comunicado oficial deseas emitir hoy para tu cantón?</span>
                <span
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px'
                  }}
                >
                  Encargado Municipal
                </span>
              </button>
            </div>

            {/* Accesos Rápidos del Editor */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleNuevaNoticia}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <ImageIcon size={16} color="#10B981" />
                  <span>Adjuntar Foto de Obra</span>
                </button>

                <button
                  type="button"
                  onClick={handleNuevaNoticia}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Tag size={16} color="#F59E0B" />
                  <span>Elegir Categoría</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleNuevaNoticia}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#38BDF8',
                  color: '#00040D',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)'
                }}
              >
                <Plus size={14} strokeWidth={3} />
                <span>Publicar</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* LISTADO DE PUBLICACIONES EN EL FEED                                 */}
        {/* =================================================================== */}
        {cargandoInicial ? (
          /* Skeletons de Carga Inicial */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[1, 2].map((n) => (
              <div
                key={n}
                style={{
                  backgroundColor: '#0c1322',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  animation: 'pulse 1.5s infinite'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                    <div style={{ width: '40%', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }} />
                    <div style={{ width: '25%', height: '11px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px' }} />
                  </div>
                </div>
                <div style={{ width: '80%', height: '22px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }} />
                <div style={{ width: '100%', height: '220px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px' }} />
                <div style={{ width: '100%', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          /* Mensaje de Error */
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '20px',
              color: '#F87171'
            }}
          >
            <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>No se pudo cargar el feed de noticias</h3>
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.88rem', color: '#94A3B8' }}>{errorMsg}</p>
            <button
              onClick={cargarNoticiasInicial}
              style={{
                padding: '0.55rem 1.4rem',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reintentar Sincronización
            </button>
          </div>
        ) : noticias.length === 0 ? (
          /* Estado Vacío */
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(12, 19, 34, 0.7)',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              color: '#94A3B8'
            }}
          >
            <Building2 size={46} color="#38BDF8" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#F1F5F9' }}>
              No se encontraron publicaciones con los criterios seleccionados
            </h3>
            <p style={{ margin: '0.5rem auto 1.5rem', fontSize: '0.9rem', maxWidth: '440px', color: '#64748B' }}>
              {busqueda
                ? `No hay comunicados que coincidan con "${busqueda}". Prueba ajustando tu búsqueda o limpiando los filtros.`
                : 'Esta municipalidad o categoría aún no tiene comunicados emitidos.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  setProvinciaFiltro('todas');
                  setCantonFiltro('todos');
                  setCategoriaFiltro('Todas');
                }}
                style={{
                  padding: '0.55rem 1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#F1F5F9',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Restablecer Filtros
              </button>

              {tienePermisoEditor && (
                <button
                  type="button"
                  onClick={handleNuevaNoticia}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 1.25rem',
                    backgroundColor: '#38BDF8',
                    color: '#00040D',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  <span>Publicar Primer Comunicado</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Renderizado de Publicaciones del Feed Social */
          noticias.map((item) => (
            <NoticiaFeedPost
              key={item.id}
              noticia={item}
              onEditar={handleEditarNoticia}
              onEliminar={handleEliminarNoticia}
              onActualizar={handlePostActualizado}
            />
          ))
        )}

        {/* =================================================================== */}
        {/* 4. SENTINEL DE SCROLL INFINITO & BOTÓN CARGAR MÁS NOTICIAS          */}
        {/* =================================================================== */}
        {!cargandoInicial && noticias.length > 0 && (
          <div
            ref={sentinelRef}
            style={{
              padding: '1.5rem 0 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            {hayMas ? (
              <button
                type="button"
                onClick={cargarMasNoticias}
                disabled={cargandoMas}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '14px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: cargandoMas ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 14px rgba(56, 189, 248, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.22)';
                  e.currentTarget.style.borderColor = '#38BDF8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                }}
              >
                {cargandoMas ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Cargando más comunicados oficiales...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownCircle size={17} />
                    <span>Cargar más publicaciones</span>
                  </>
                )}
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#64748B',
                  fontSize: '0.82rem'
                }}
              >
                <ShieldCheck size={16} color="#10B981" />
                <span>Has llegado al final de los comunicados oficiales emitidos.</span>
              </div>
            )}

            {/* Contador de Comunicados Cargados */}
            <span style={{ fontSize: '0.75rem', color: '#475569' }}>
              Mostrando {noticias.length} de {totalNoticias} comunicados oficiales
            </span>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 5. MODAL DE PUBLICACIÓN / EDICIÓN (RBAC: Solo Encargado Municipal)     */}
      {/* ===================================================================== */}
      {tienePermisoEditor && (
        <NoticiaFormModal
          isOpen={modalFormAbierto}
          onClose={() => setModalFormAbierto(false)}
          onGuardado={handleGuardadoExitoso}
          noticiaParaEditar={noticiaParaEditar}
        />
      )}
    </section>
  );
}
