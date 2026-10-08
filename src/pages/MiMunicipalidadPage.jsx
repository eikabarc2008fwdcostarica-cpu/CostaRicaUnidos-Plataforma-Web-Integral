/**
 * ============================================================================
 * COSTA RICA UNIDOS — PANEL DEL ENCARGADO MUNICIPAL ("MI MUNICIPALIDAD")
 * Gestión Territorial Exclusiva de Noticias, Comunicados y Foro Cantonal
 * ============================================================================
 *
 * Cumplimiento Estricto de Reglas del Rol:
 * 1. Cada encargado pertenece a UNA sola municipalidad (cantón).
 * 2. Solo ve y gestiona publicaciones oficiales de su cantón.
 * 3. Distintivo obligatorio: "Cuenta oficial · Municipalidad de [cantón]".
 * 4. Si el usuario no tiene cantón asignado, se inhabilita el acceso y la gestión.
 * 5. Cero exposición de cédulas o datos personales de ciudadanos (Ley N.º 8968).
 * 6. Diálogos modales institucionales soberanos (cero diálogos nativos window.confirm).
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import {
  obtenerNoticias,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia
} from '../services/noticiasService';
import {
  obtenerPosts,
  crearPost,
  actualizarPost,
  eliminarPost
} from '../services/foroService';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  RefreshCw,
  FileText,
  MessageSquare,
  CheckCircle2,
  Lock,
  MapPin,
  Sparkles,
  Clock,
  Send,
  X,
  Tag
} from 'lucide-react';

const CATEGORIAS_NOTICIA = [
  'Obras Públicas',
  'Gobernanza & Trámites',
  'Participación Ciudadana',
  'Seguridad & Emergencias',
  'Medio Ambiente & Sostenibilidad',
  'Desarrollo Local & Empleo',
  'Cultura & Comunidad',
  'Comercio & Turismo'
];

const CATEGORIAS_FORO = [
  'Propuestas Comunales',
  'Infraestructura Cantonal',
  'Gestión Ambiental',
  'Seguridad y Convivencia',
  'Cultura y Tradición',
  'Transparencia Municipal'
];

export default function MiMunicipalidadPage() {
  const { user } = useAuth();

  const cantonUsuario = user?.canton || '';
  const provinciaUsuario = user?.provincia || 'Nacional';
  const tieneCantonAsignado = Boolean(cantonUsuario && cantonUsuario.trim() !== '' && cantonUsuario.toLowerCase() !== 'todas las municipalidades');
  const distintivoOficial = `Cuenta oficial · Municipalidad de ${cantonUsuario || 'Costa Rica'}`;

  // Pestaña de publicación: 'noticia' | 'comunicado' | 'foro'
  const [tabPublicacion, setTabPublicacion] = useState('noticia');

  // Estados del Formulario de Creación
  const [titulo, setTitulo] = useState('');
  const [resumen, setResumen] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS_NOTICIA[0]);
  const [imagenUrl, setImagenUrl] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Estados de la Lista de Publicaciones
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [errorLista, setErrorLista] = useState('');

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos' | 'noticia' | 'comunicado' | 'foro'
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos' | 'publicado' | 'oculto' | 'archivado'
  const [busqueda, setBusqueda] = useState('');

  // Modal de Edición
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editResumen, setEditResumen] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [editEstado, setEditEstado] = useState('publicado');
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  // Modal de Eliminación (ConfirmDialog)
  const [itemParaEliminar, setItemParaEliminar] = useState(null);
  const [eliminandoItem, setEliminandoItem] = useState(false);

  // Cargar publicaciones exclusivas de la municipalidad
  const cargarPublicaciones = useCallback(async () => {
    if (!tieneCantonAsignado) {
      setCargandoLista(false);
      return;
    }

    setCargandoLista(true);
    setErrorLista('');
    try {
      // 1. Obtener noticias de este cantón
      const noticiasRes = await obtenerNoticias({ canton: cantonUsuario, _limit: 100 });
      const noticiasList = Array.isArray(noticiasRes) ? noticiasRes : [];
      const noticiasMapeadas = noticiasList
        .filter((n) => String(n.canton || '').toLowerCase() === cantonUsuario.toLowerCase())
        .map((n) => ({
          ...n,
          tipoPublicacion: n.categoria === 'Comunicados Oficiales' ? 'comunicado' : 'noticia',
          tipoBadge: n.categoria === 'Comunicados Oficiales' ? 'Comunicado Oficial' : 'Noticia Municipal',
          fechaVisual: n.fechaPublicacion || n.fecha || new Date().toISOString()
        }));

      // 2. Obtener temas del foro de este cantón
      let postsList = [];
      try {
        const postsRes = await obtenerPosts(provinciaUsuario?.toLowerCase() || 'nacional');
        postsList = Array.isArray(postsRes) ? postsRes : [];
      } catch (errForo) {
        console.warn('[MiMunicipalidad] No se pudieron cargar posts del foro:', errForo);
      }

      const postsMapeados = postsList
        .filter((p) => {
          const mismoCanton = String(p.canton || '').toLowerCase() === cantonUsuario.toLowerCase();
          const esOficial = p.esOficial || p.autorRol === 'Encargado Municipal' || (p.distintivo && p.distintivo.includes(cantonUsuario));
          return mismoCanton && esOficial;
        })
        .map((p) => ({
          ...p,
          tipoPublicacion: 'foro',
          tipoBadge: 'Foro Tico Oficial',
          resumen: p.resumen || (p.contenido ? p.contenido.slice(0, 140) + '...' : ''),
          fechaVisual: p.fecha || p.fechaCreacion || new Date().toISOString()
        }));

      const combinadas = [...noticiasMapeadas, ...postsMapeados].sort(
        (a, b) => new Date(b.fechaVisual).getTime() - new Date(a.fechaVisual).getTime()
      );

      setPublicaciones(combinadas);
    } catch (err) {
      console.error('[MiMunicipalidad] Error al cargar publicaciones:', err);
      setErrorLista('No se pudieron sincronizar las publicaciones oficiales con el servidor.');
    } finally {
      setCargandoLista(false);
    }
  }, [cantonUsuario, provinciaUsuario, tieneCantonAsignado]);

  useEffect(() => {
    cargarPublicaciones();
  }, [cargarPublicaciones]);

  // Manejador de Publicación
  const handlePublicar = async (e) => {
    e.preventDefault();
    if (!tieneCantonAsignado) return;

    if (!titulo.trim() || !contenido.trim()) {
      setMensajeError('Por favor complete el título y el contenido de la publicación.');
      return;
    }

    try {
      setEnviando(true);
      setMensajeError('');
      setMensajeExito('');

      if (tabPublicacion === 'noticia' || tabPublicacion === 'comunicado') {
        const categoriaFinal = tabPublicacion === 'comunicado' ? 'Comunicados Oficiales' : categoria;
        await crearNoticia(
          {
            titulo: titulo.trim(),
            resumen: resumen.trim() || titulo.trim(),
            contenido: contenido.trim(),
            categoria: categoriaFinal,
            provincia: provinciaUsuario,
            canton: cantonUsuario,
            imagenUrl: imagenUrl.trim(),
            estado: 'publicado'
          },
          user
        );
        setMensajeExito(`¡${tabPublicacion === 'comunicado' ? 'Comunicado oficial' : 'Noticia municipal'} publicada exitosamente con distinción oficial!`);
      } else {
        // Publicar tema en Foro Tico en nombre de la municipalidad
        await crearPost(
          {
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            categoria,
            provinciaId: provinciaUsuario.toLowerCase().replace(/\s+/g, '-'),
            provinciaNombre: provinciaUsuario,
            canton: cantonUsuario,
            autorNombre: `Municipalidad de ${cantonUsuario}`,
            autorCedula: user?.cedula || '1-1155-0892',
            autorRol: 'Encargado Municipal',
            esOficial: true,
            distintivo: distintivoOficial,
            estado: 'publicado',
            fecha: new Date().toISOString()
          },
          user
        );
        setMensajeExito(`¡Tema oficial publicado en el Foro Tico con distinción de la Municipalidad de ${cantonUsuario}!`);
      }

      // Limpiar campos
      setTitulo('');
      setResumen('');
      setContenido('');
      setImagenUrl('');
      cargarPublicaciones();
    } catch (err) {
      console.error('[MiMunicipalidad] Error al publicar:', err);
      setMensajeError(err.message || 'Error al emitir la publicación oficial.');
    } finally {
      setEnviando(false);
    }
  };

  // Abrir modal de edición
  const abrirEdicion = (item) => {
    setItemParaEditar(item);
    setEditTitulo(item.titulo || '');
    setEditResumen(item.resumen || '');
    setEditContenido(item.contenido || '');
    setEditEstado(item.estado || 'publicado');
  };

  // Guardar edición
  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    if (!itemParaEditar) return;

    try {
      setGuardandoEdicion(true);
      const payload = {
        titulo: editTitulo.trim(),
        resumen: editResumen.trim(),
        contenido: editContenido.trim(),
        estado: editEstado
      };

      if (itemParaEditar.tipoPublicacion === 'foro') {
        await actualizarPost(itemParaEditar.id, payload, user);
      } else {
        await actualizarNoticia(itemParaEditar.id, payload, user);
      }

      setItemParaEditar(null);
      cargarPublicaciones();
    } catch (err) {
      console.error('[MiMunicipalidad] Error editando publicación:', err);
      alert(err.message || 'Error al guardar la edición.');
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // Cambiar estado rápido (Ocultar / Archivar / Publicar)
  const handleCambiarEstadoRapido = async (item, nuevoEstado) => {
    try {
      const payload = { estado: nuevoEstado };
      if (item.tipoPublicacion === 'foro') {
        await actualizarPost(item.id, payload, user);
      } else {
        await actualizarNoticia(item.id, payload, user);
      }
      cargarPublicaciones();
    } catch (err) {
      console.error('[MiMunicipalidad] Error cambiando estado:', err);
      alert(err.message || 'Error al modificar estado de la publicación.');
    }
  };

  // Confirmar eliminación
  const handleConfirmarEliminar = async () => {
    if (!itemParaEliminar) return;

    try {
      setEliminandoItem(true);
      if (itemParaEliminar.tipoPublicacion === 'foro') {
        await eliminarPost(itemParaEliminar.id, user);
      } else {
        await eliminarNoticia(itemParaEliminar.id, user);
      }
      setItemParaEliminar(null);
      cargarPublicaciones();
    } catch (err) {
      console.error('[MiMunicipalidad] Error al eliminar:', err);
      alert(err.message || 'Error al eliminar la publicación.');
    } finally {
      setEliminandoItem(false);
    }
  };

  // Filtrado de la lista
  const publicacionesFiltradas = useMemo(() => {
    return publicaciones.filter((item) => {
      // Filtro tipo
      if (filtroTipo !== 'todos' && item.tipoPublicacion !== filtroTipo) return false;
      // Filtro estado
      const estadoActual = item.estado || 'publicado';
      if (filtroEstado !== 'todos' && estadoActual !== filtroEstado) return false;
      // Búsqueda
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const enTitulo = (item.titulo || '').toLowerCase().includes(q);
        const enContenido = (item.contenido || '').toLowerCase().includes(q);
        const enResumen = (item.resumen || '').toLowerCase().includes(q);
        if (!enTitulo && !enContenido && !enResumen) return false;
      }
      return true;
    });
  }, [publicaciones, filtroTipo, filtroEstado, busqueda]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ================================================================= */}
        {/* ENCABEZADO OFICIAL DE LA MUNICIPALIDAD                            */}
        {/* ================================================================= */}
        <header className="bg-theme-card border border-theme-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck size={14} />
                  Cuenta Oficial Municipal
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <MapPin size={12} />
                  {cantonUsuario ? `Cantón de ${cantonUsuario}, ${provinciaUsuario}` : 'Sin Cantón Asignado'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Mi Municipalidad: {cantonUsuario || 'Jurisdicción No Asignada'}
              </h1>
              <p className="text-sm text-cru-text-muted max-w-3xl leading-relaxed">
                Consola oficial para el <strong>Encargado Municipal</strong>. Emita y administre noticias comunales, comunicados de interés público y publicaciones oficiales en el Foro Tico. Sus publicaciones llevan el sello verificado de la corporación municipal.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 size={24} />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-cru-text-muted font-medium">Encargado Acreditado</div>
                <div className="font-bold text-white">{user?.nombre || 'Funcionario Municipal'}</div>
                <div className="text-emerald-400 font-semibold">{cantonUsuario ? `Municipalidad de ${cantonUsuario}` : 'Pendiente de Asignación'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ================================================================= */}
        {/* BLOQUEO POR REGLA f: USUARIO SIN MUNICIPALIDAD ASIGNADA           */}
        {/* ================================================================= */}
        {!tieneCantonAsignado ? (
          <div className="bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold text-rose-400">
              Acceso Suspendido: Cuenta Sin Cantón Asignado
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              De acuerdo con las reglas soberanas de gobernanza, cada Encargado Municipal debe estar vinculado formalmente a un cantón específico. Su usuario tiene el rol asignado pero <strong>no tiene municipalidad activa</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Comuníquese con el <strong>Super Administrador Nacional</strong> para que asigne su cantón desde la consola de administración. Mientras tanto, las funciones de emisión y gestión están deshabilitadas.
            </p>
          </div>
        ) : (
          <>
            {/* ============================================================= */}
            {/* SECCIÓN 1: FORMULARIOS DE EMISIÓN OFICIAL                     */}
            {/* ============================================================= */}
            <section className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus size={18} className="text-emerald-400" />
                    Nueva Emisión Oficial Municipal
                  </h2>
                  <p className="text-xs text-cru-text-muted">
                    Seleccione el tipo de publicación para su cantón. Todas las publicaciones se firman como <em>"{distintivoOficial}"</em>.
                  </p>
                </div>

                {/* Selector de Pestaña */}
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setTabPublicacion('noticia');
                      setCategoria(CATEGORIAS_NOTICIA[0]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      tabPublicacion === 'noticia'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText size={14} />
                    Noticia
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTabPublicacion('comunicado');
                      setCategoria('Comunicados Oficiales');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      tabPublicacion === 'comunicado'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlertCircle size={14} />
                    Comunicado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTabPublicacion('foro');
                      setCategoria(CATEGORIAS_FORO[0]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      tabPublicacion === 'foro'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare size={14} />
                    Foro Tico
                  </button>
                </div>
              </div>

              {/* Mensajes de Alerta */}
              {mensajeExito && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  <span>{mensajeExito}</span>
                </div>
              )}
              {mensajeError && (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{mensajeError}</span>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handlePublicar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-cru-text block">
                      Título Oficial: <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder={
                        tabPublicacion === 'comunicado'
                          ? 'Ej: Alerta por trabajos en tubería matriz del cantón...'
                          : tabPublicacion === 'foro'
                          ? 'Ej: Propuesta municipal: Nueva ciclovía y arborización comunal...'
                          : 'Ej: Inauguración del nuevo parque infantil municipal...'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-cru-text block">
                      Categoría Institucional:
                    </label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      disabled={tabPublicacion === 'comunicado'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {tabPublicacion === 'foro'
                        ? CATEGORIAS_FORO.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))
                        : CATEGORIAS_NOTICIA.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                {tabPublicacion !== 'foro' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-cru-text block">
                      Resumen Ejecutivo (Bajada):
                    </label>
                    <input
                      type="text"
                      value={resumen}
                      onChange={(e) => setResumen(e.target.value)}
                      placeholder="Breve sinopsis que aparecerá en los listados y notificaciones..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-cru-text block">
                    Contenido Oficial Detallado: <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escriba el texto completo de la publicación oficial..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none transition-colors"
                    required
                  />
                  {tabPublicacion === 'foro' && (
                    <p className="text-[11px] text-slate-400">
                      * Nota de moderación cívica: Esta publicación en el Foro Tico se emitirá con la firma municipal y pasará por las reglas de convivencia comunitaria.
                    </p>
                  )}
                </div>

                {tabPublicacion !== 'foro' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-cru-text block">
                      URL de Imagen Destacada (Opcional):
                    </label>
                    <input
                      type="url"
                      value={imagenUrl}
                      onChange={(e) => setImagenUrl(e.target.value)}
                      placeholder="https://ejemplo.go.cr/fotos/obra-parque.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {/* Pie del formulario con sello y botón */}
                <div className="pt-3 border-t border-theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Emisión atada a: <strong className="text-white">Municipalidad de {cantonUsuario}</strong></span>
                  </div>

                  <button
                    type="submit"
                    disabled={enviando || !titulo.trim() || !contenido.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    {enviando ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>{enviando ? 'Emitiendo en Servidor...' : 'Publicar Oficialmente'}</span>
                  </button>
                </div>
              </form>
            </section>

            {/* ============================================================= */}
            {/* SECCIÓN 2: LISTA DE GESTIÓN DE PUBLICACIONES DE SU CANTÓN     */}
            {/* ============================================================= */}
            <section className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building2 size={18} className="text-sky-400" />
                    Publicaciones de la Municipalidad de {cantonUsuario}
                  </h2>
                  <p className="text-xs text-cru-text-muted">
                    Gestione las publicaciones emitidas en su jurisdicción. Puede editar, ocultar, archivar o eliminar con confirmación institucional.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cargarPublicaciones}
                  disabled={cargandoLista}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
                >
                  <RefreshCw size={13} className={cargandoLista ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
              </div>

              {/* Barra de Filtros y Búsqueda */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por título o texto..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none cursor-pointer"
                  >
                    <option value="todos">Tipo: Todos</option>
                    <option value="noticia">Solo Noticias</option>
                    <option value="comunicado">Solo Comunicados Oficiales</option>
                    <option value="foro">Solo Foro Tico</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-input-bg border border-theme-input-border text-xs text-theme-input-text focus:border-emerald-400 focus:outline-none cursor-pointer"
                  >
                    <option value="todos">Estado: Todos</option>
                    <option value="publicado">Publicado</option>
                    <option value="oculto">Oculto</option>
                    <option value="archivado">Archivado</option>
                  </select>
                </div>
              </div>

              {/* Estados de Carga y Error */}
              {cargandoLista ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <RefreshCw size={24} className="animate-spin mx-auto text-emerald-400" />
                  <p className="text-xs">Sincronizando publicaciones de la Municipalidad de {cantonUsuario}...</p>
                </div>
              ) : errorLista ? (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs text-center">
                  {errorLista}
                </div>
              ) : publicacionesFiltradas.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2 bg-white/2 rounded-2xl border border-dashed border-white/10">
                  <Building2 size={32} className="mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">
                    No se encontraron publicaciones con los filtros aplicados.
                  </p>
                  <p className="text-xs text-slate-500">
                    Use el formulario superior para emitir la primera noticia o comunicado de {cantonUsuario}.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-cru-text-muted">
                    Mostrando <strong>{publicacionesFiltradas.length}</strong> publicaciones de <strong>{cantonUsuario}</strong>
                  </div>

                  <div className="divide-y divide-theme-border border border-theme-border rounded-xl overflow-hidden bg-theme-bg">
                    {publicacionesFiltradas.map((item) => {
                      const estado = item.estado || 'publicado';
                      return (
                        <div
                          key={item.id}
                          className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/2 transition-colors"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Badge Tipo */}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  item.tipoPublicacion === 'comunicado'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : item.tipoPublicacion === 'foro'
                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {item.tipoBadge}
                              </span>

                              {/* Badge Estado */}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  estado === 'publicado'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : estado === 'oculto'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                }`}
                              >
                                {estado}
                              </span>

                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Clock size={11} />
                                {new Date(item.fechaVisual).toLocaleDateString('es-CR')}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-white truncate">
                              {item.titulo}
                            </h3>

                            {item.resumen && (
                              <p className="text-xs text-cru-text-muted line-clamp-2">
                                {item.resumen}
                              </p>
                            )}
                          </div>

                          {/* Acciones de Gestión */}
                          <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                            {/* Botón Editar */}
                            <button
                              type="button"
                              onClick={() => abrirEdicion(item)}
                              title="Editar publicación"
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors cursor-pointer"
                            >
                              <Edit size={14} />
                            </button>

                            {/* Botón Alternar Estado (Ocultar / Publicar) */}
                            {estado === 'publicado' ? (
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoRapido(item, 'oculto')}
                                title="Ocultar publicación"
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                              >
                                <EyeOff size={14} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoRapido(item, 'publicado')}
                                title="Hacer pública de nuevo"
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>
                            )}

                            {/* Botón Archivar */}
                            {estado !== 'archivado' && (
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoRapido(item, 'archivado')}
                                title="Archivar publicación"
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/30 transition-colors cursor-pointer"
                              >
                                <Archive size={14} />
                              </button>
                            )}

                            {/* Botón Eliminar */}
                            <button
                              type="button"
                              onClick={() => setItemParaEliminar(item)}
                              title="Eliminar publicación"
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* =================================================================== */}
      {/* MODAL DE EDICIÓN PROPIO ACORDE AL DISEÑO                            */}
      {/* =================================================================== */}
      {itemParaEditar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div className="flex items-center gap-2">
                <Edit size={18} className="text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Editar {itemParaEditar.tipoBadge}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setItemParaEditar(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-cru-text block">Título:</label>
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-input-bg border border-theme-input-border text-theme-input-text focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              {itemParaEditar.tipoPublicacion !== 'foro' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-cru-text block">Resumen Ejecutivo:</label>
                  <input
                    type="text"
                    value={editResumen}
                    onChange={(e) => setEditResumen(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-input-bg border border-theme-input-border text-theme-input-text focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-cru-text block">Contenido:</label>
                <textarea
                  rows={5}
                  value={editContenido}
                  onChange={(e) => setEditContenido(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-input-bg border border-theme-input-border text-theme-input-text focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-cru-text block">Estado de Publicación:</label>
                <select
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-input-bg border border-theme-input-border text-theme-input-text focus:border-amber-400 focus:outline-none cursor-pointer"
                >
                  <option value="publicado">Publicado (Visible en el cantón)</option>
                  <option value="oculto">Oculto (Preventivo)</option>
                  <option value="archivado">Archivado (Histórico)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-theme-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setItemParaEditar(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoEdicion}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold flex items-center gap-2 cursor-pointer"
                >
                  {guardandoEdicion ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>{guardandoEdicion ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL DE CONFIRMACIÓN PROPIO PARA ELIMINACIÓN                       */}
      {/* =================================================================== */}
      <ConfirmDialog
        isOpen={Boolean(itemParaEliminar)}
        title="¿Eliminar Publicación Oficial?"
        message={
          itemParaEliminar
            ? `¿Está seguro de eliminar definitivamente "${itemParaEliminar.titulo}" de la Municipalidad de ${cantonUsuario}? Esta acción no se puede deshacer y quedará registrada en la bitácora de auditoría.`
            : 'Esta acción no se puede deshacer.'
        }
        confirmText="Sí, Eliminar Publicación"
        cancelText="Cancelar"
        variant="danger"
        isLoading={eliminandoItem}
        onConfirm={handleConfirmarEliminar}
        onCancel={() => setItemParaEliminar(null)}
      />
    </div>
  );
}
