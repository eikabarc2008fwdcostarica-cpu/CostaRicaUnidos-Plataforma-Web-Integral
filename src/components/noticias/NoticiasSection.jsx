import React, { useState, useEffect, useMemo } from 'react';
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
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  obtenerNoticias,
  eliminarNoticia,
  reaccionarNoticia,
  esEditorMunicipal,
  suscribirCambiosNoticias
} from '../../services/noticiasService';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../../data/costaRicaTerritorialData';
import NoticiaCard from './NoticiaCard';
import NoticiaFormModal from './NoticiaFormModal';
import NoticiaDetalleModal from './NoticiaDetalleModal';

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

/**
 * Sección Principal del Módulo 01: Noticias y Comunicados Municipales
 * Proporciona el explorador territorial nacional de comunicados, filtrado por cantón,
 * y activa las herramientas de publicación para el rol "Editor Municipal" (RBAC).
 */
export default function NoticiasSection({
  provinciaInicial = 'todas',
  cantonInicial = 'todos',
  mostrarEncabezadoCompleto = true,
  tituloPersonalizado = null
}) {
  const { user } = useAuth();
  const tienePermisoEditor = esEditorMunicipal(user);

  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [alertaGlobal, setAlertaGlobal] = useState(null);

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState('');
  const [provinciaFiltro, setProvinciaFiltro] = useState(provinciaInicial);
  const [cantonFiltro, setCantonFiltro] = useState(cantonInicial);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');

  // Estados de Modales
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [noticiaParaEditar, setNoticiaParaEditar] = useState(null);

  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  // Cargar noticias desde el servicio
  const cargarNoticias = async () => {
    setCargando(true);
    setErrorMsg('');
    try {
      const data = await obtenerNoticias({
        provincia: provinciaFiltro,
        canton: cantonFiltro,
        categoria: categoriaFiltro !== 'Todas' ? categoriaFiltro : undefined
      });
      setNoticias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[NoticiasSection] Error al cargar noticias:', err);
      setErrorMsg('No se pudieron sincronizar los comunicados municipales desde el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, [provinciaFiltro, cantonFiltro, categoriaFiltro]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const desuscribir = suscribirCambiosNoticias((nuevasNoticias) => {
      if (Array.isArray(nuevasNoticias)) {
        setNoticias(nuevasNoticias);
      }
    });
    return desuscribir;
  }, []);

  // Lista de cantones disponibles según la provincia seleccionada
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

  // Manejar cambio de provincia: reiniciar cantón si no pertenece
  const handleCambiarProvincia = (e) => {
    const nuevaProv = e.target.value;
    setProvinciaFiltro(nuevaProv);
    setCantonFiltro('todos');
  };

  // Filtrado reactivo en memoria para búsqueda de texto
  const noticiasVisibles = useMemo(() => {
    return noticias.filter((noticia) => {
      // Filtro de búsqueda textual
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const coincideTitulo = (noticia.titulo || '').toLowerCase().includes(query);
        const coincideResumen = (noticia.resumen || '').toLowerCase().includes(query);
        const coincideContenido = (noticia.contenido || '').toLowerCase().includes(query);
        const coincideCanton = (noticia.canton || '').toLowerCase().includes(query);
        const coincideProvincia = (noticia.provincia || '').toLowerCase().includes(query);
        if (!coincideTitulo && !coincideResumen && !coincideContenido && !coincideCanton && !coincideProvincia) {
          return false;
        }
      }

      // Filtro de cantón
      if (cantonFiltro && cantonFiltro.toLowerCase() !== 'todos') {
        if ((noticia.canton || '').toLowerCase() !== cantonFiltro.toLowerCase()) {
          return false;
        }
      }

      // Filtro de provincia
      if (provinciaFiltro && provinciaFiltro.toLowerCase() !== 'todas') {
        if ((noticia.provincia || '').toLowerCase() !== provinciaFiltro.toLowerCase()) {
          return false;
        }
      }

      // Filtro de categoría
      if (categoriaFiltro && categoriaFiltro.toLowerCase() !== 'todas') {
        if ((noticia.categoria || '').toLowerCase() !== categoriaFiltro.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [noticias, busqueda, cantonFiltro, provinciaFiltro, categoriaFiltro]);

  // Manejador: Abrir detalle de una noticia
  const handleVerDetalle = (noticia) => {
    setNoticiaSeleccionada(noticia);
    setModalDetalleAbierto(true);
  };

  // Manejador: Abrir formulario para editar (Exclusivo Editor Municipal)
  const handleEditarNoticia = (noticia) => {
    if (!tienePermisoEditor) {
      setAlertaGlobal({
        tipo: 'error',
        texto: 'Acceso Denegado (RBAC): Sólo un Editor Municipal puede modificar comunicados oficiales.'
      });
      return;
    }
    setNoticiaParaEditar(noticia);
    setModalFormAbierto(true);
  };

  // Manejador: Abrir formulario para crear (Exclusivo Editor Municipal)
  const handleNuevaNoticia = () => {
    if (!tienePermisoEditor) {
      setAlertaGlobal({
        tipo: 'error',
        texto: 'Acceso Denegado (RBAC): Se requiere rol de "Editor Municipal" para publicar.'
      });
      return;
    }
    setNoticiaParaEditar(null);
    setModalFormAbierto(true);
  };

  // Manejador: Eliminar noticia (Exclusivo Editor Municipal)
  const handleEliminarNoticia = async (id) => {
    if (!tienePermisoEditor) {
      setAlertaGlobal({
        tipo: 'error',
        texto: 'Acceso Denegado (RBAC): Se requiere rol de "Editor Municipal" para dar de baja comunicados.'
      });
      return;
    }

    try {
      await eliminarNoticia(id, user);
      setAlertaGlobal({
        tipo: 'exito',
        texto: 'El comunicado municipal ha sido dado de baja correctamente de db.json.'
      });
      cargarNoticias();
    } catch (err) {
      console.error('[NoticiasSection] Error al dar de baja:', err);
      setAlertaGlobal({
        tipo: 'error',
        texto: err.message || 'Error al eliminar el comunicado oficial.'
      });
    }
  };

  // Manejador: Reacción rápida desde la tarjeta
  const handleReaccionRapida = async (id, tipo) => {
    if (!user) {
      setAlertaGlobal({
        tipo: 'info',
        texto: 'Debes iniciar sesión con tu cédula de identidad para reaccionar a comunicados oficiales.'
      });
      return;
    }

    try {
      const actualizada = await reaccionarNoticia(id, tipo, user);
      if (actualizada) {
        setNoticias((prev) => prev.map((n) => (n.id === id ? actualizada : n)));
      }
    } catch (err) {
      console.error('[NoticiasSection] Error al reaccionar:', err);
    }
  };

  // Callback cuando se guarda exitosamente desde el modal
  const handleGuardadoExitoso = (noticiaGuardada) => {
    setAlertaGlobal({
      tipo: 'exito',
      texto: noticiaParaEditar
        ? '¡Comunicado municipal actualizado con éxito en db.json!'
        : '¡Nuevo comunicado oficial publicado satisfactoriamente!'
    });
    cargarNoticias();
  };

  return (
    <section
      id="modulo-noticias"
      aria-label="Portal de Noticias y Comunicados Municipales"
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      {/* ===================================================================== */}
      {/* ENCABEZADO INSTITUCIONAL                                              */}
      {/* ===================================================================== */}
      {mostrarEncabezadoCompleto && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
              }}
            >
              <Newspaper size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#38BDF8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(56, 189, 248, 0.25)'
                  }}
                >
                  M01 • SRS v2.1
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  Portal Territorial Descentralizado
                </span>
              </div>
              <h2
                style={{
                  margin: '0.35rem 0 0',
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#F8FAFC',
                  letterSpacing: '-0.02em'
                }}
              >
                {tituloPersonalizado || 'Noticias y Comunicados Municipales'}
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#94A3B8' }}>
                Boletines oficiales emitidos por los 84 gobiernos locales de Costa Rica y participación cívica ciudadana.
              </p>
            </div>
          </div>

          {/* ================================================================= */}
          {/* ACCIÓN PRINCIPAL DE PUBLICACIÓN (RBAC: Solo Editor Municipal)    */}
          {/* ================================================================= */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {tienePermisoEditor ? (
              <button
                type="button"
                onClick={handleNuevaNoticia}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#38BDF8',
                  color: '#00040D',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(56, 189, 248, 0.35)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(56, 189, 248, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(56, 189, 248, 0.35)';
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>Publicar Comunicado Oficial</span>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 4, 13, 0.25)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  Editor Municipal
                </span>
              </button>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '10px',
                  color: '#64748B',
                  fontSize: '0.78rem'
                }}
              >
                <ShieldCheck size={16} color="#10B981" />
                <span>Canal Oficial de Transparencia Ciudadana</span>
              </div>
            )}

            {/* Botón de Refresco */}
            <button
              type="button"
              onClick={cargarNoticias}
              disabled={cargando}
              title="Sincronizar comunicados"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                padding: '0.7rem',
                borderRadius: '10px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={17} className={cargando ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}

      {/* Alerta de Feedback Global */}
      {alertaGlobal && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
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
            fontSize: '0.88rem',
            fontWeight: 500
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
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* BARRA DE FILTROS TERRITORIALES Y BUSCADOR                             */}
      {/* ===================================================================== */}
      <div
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        {/* Buscador de Texto */}
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748B'
            }}
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por palabra clave, obra o tema..."
            style={{
              width: '100%',
              backgroundColor: '#050B17',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem 0.65rem 2.4rem',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filtro Provincia */}
        <div style={{ position: 'relative' }}>
          <select
            value={provinciaFiltro}
            onChange={handleCambiarProvincia}
            style={{
              width: '100%',
              backgroundColor: '#050B17',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            <option value="todas">Costa Rica • Todas las Provincias</option>
            {PROVINCIAS_DATA.map((p) => (
              <option key={p.id} value={p.nombre}>
                Provincia de {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Cantón */}
        <div style={{ position: 'relative' }}>
          <select
            value={cantonFiltro}
            onChange={(e) => setCantonFiltro(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#050B17',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box'
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

        {/* Filtro Categoría */}
        <div style={{ position: 'relative' }}>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#050B17',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            {CATEGORIAS_FILTRO.map((cat) => (
              <option key={cat} value={cat}>
                Categoría: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CUADRÍCULA DE NOTICIAS                                                */}
      {/* ===================================================================== */}
      {cargando ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            padding: '2rem 0'
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                height: '280px',
                animation: 'pulse 1.5s infinite',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ width: '40%', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px' }} />
              <div style={{ width: '80%', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }} />
              <div style={{ width: '100%', height: '60px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px' }} />
              <div style={{ marginTop: 'auto', width: '100%', height: '36px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px' }} />
            </div>
          ))}
        </div>
      ) : errorMsg ? (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '16px',
            color: '#F87171'
          }}
        >
          <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>No se pudieron cargar los comunicados</h3>
          <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.88rem', color: '#94A3B8' }}>{errorMsg}</p>
          <button
            onClick={cargarNoticias}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      ) : noticiasVisibles.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            color: '#94A3B8'
          }}
        >
          <Building2 size={42} color="#38BDF8" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9' }}>
            No se encontraron comunicados con los filtros seleccionados
          </h3>
          <p style={{ margin: '0.5rem auto 1.5rem', fontSize: '0.9rem', maxWidth: '480px', color: '#64748B' }}>
            {busqueda
              ? `No hay resultados para "${busqueda}". Prueba ajustando tus criterios de búsqueda o limpiando los filtros.`
              : 'Esta municipalidad aún no ha publicado anuncios oficiales en este periodo.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {noticiasVisibles.map((noticia) => (
            <NoticiaCard
              key={noticia.id}
              noticia={noticia}
              onVerDetalle={handleVerDetalle}
              onEditar={handleEditarNoticia}
              onEliminar={handleEliminarNoticia}
              onReaccionar={handleReaccionRapida}
            />
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL DE PUBLICACIÓN / EDICIÓN (RBAC: Solo Editor Municipal)          */}
      {/* ===================================================================== */}
      {tienePermisoEditor && (
        <NoticiaFormModal
          isOpen={modalFormAbierto}
          onClose={() => setModalFormAbierto(false)}
          onGuardado={handleGuardadoExitoso}
          noticiaParaEditar={noticiaParaEditar}
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL DE DETALLE Y COMENTARIOS CIUDADANOS                             */}
      {/* ===================================================================== */}
      <NoticiaDetalleModal
        isOpen={modalDetalleAbierto}
        onClose={() => setModalDetalleAbierto(false)}
        noticia={noticiaSeleccionada}
        onNoticiaActualizada={(actualizada) => {
          setNoticias((prev) => prev.map((n) => (n.id === actualizada.id ? actualizada : n)));
          setNoticiaSeleccionada(actualizada);
        }}
      />
    </section>
  );
}
