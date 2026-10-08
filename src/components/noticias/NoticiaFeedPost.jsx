import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Tag,
  ThumbsUp,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Share2,
  X,
  Maximize2,
  Check,
  LogIn,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCivicModal } from '../../context/CivicModalContext';
import {
  reaccionarNoticia,
  agregarComentarioNoticia,
  esEncargadoMunicipal
} from '../../services/noticiasService';
import { obtenerNombrePublico } from '../../utils/privacyUtils';
import PerfilPublicoModal from '../perfil/PerfilPublicoModal';

/**
 * Helper para calcular tiempo relativo amigable (Costa Rica / Español)
 */
function calcularTiempoRelativo(fechaStr) {
  if (!fechaStr) return 'Reciente';
  try {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffSeg = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

    if (diffSeg < 60) return 'Hace unos momentos';
    const diffMin = Math.floor(diffSeg / 60);
    if (diffMin < 60) return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 7) return `Hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`;

    return fecha.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return fechaStr;
  }
}

/**
 * Asignar color distintivo y armonioso según categoría temática
 */
function obtenerColorCategoria(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('obra') || c.includes('vial')) return { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' };
  if (c.includes('seguridad') || c.includes('emergencia')) return { text: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' };
  if (c.includes('gobernanza') || c.includes('trámite')) return { text: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)' };
  if (c.includes('ambiente') || c.includes('sostenib')) return { text: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)' };
  if (c.includes('participa') || c.includes('comunid')) return { text: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)' };
  if (c.includes('empleo') || c.includes('desarrollo')) return { text: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)' };
  if (c.includes('turismo') || c.includes('comercio')) return { text: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)' };
  return { text: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)' };
}

/**
 * Publicación del Feed Social Vertical (Estilo Muro Social / Facebook Timeline)
 * Presenta cada comunicado municipal completo con imagen destacada, reacciones en vivo,
 * lightbox multimedia y un hilo de comentarios interactivo inline sin necesidad de modales.
 */
export default function NoticiaFeedPost({
  noticia,
  onEditar,
  onEliminar,
  onActualizar
}) {
  const { user } = useAuth();
  const { mostrarToast } = useCivicModal();
  const tienePermisoEditor = esEncargadoMunicipal(user);

  // Validación de jurisdicción: el Encargado Municipal solo gestiona su cantón
  const puedeGestionarEstePost = (() => {
    if (!user || !tienePermisoEditor) return false;
    const rolNorm = (user.rol || "").toLowerCase();
    const nivel = Number(user.nivelAcceso || 0);
    if (nivel >= 4 || rolNorm.includes("super") || rolNorm.includes("territorial")) return true;
    if (user.isEncargadoMunicipal || rolNorm.includes("encargado")) {
      if (!user.canton) return false;
      return String(post?.canton || "").trim().toLowerCase() === String(user.canton || "").trim().toLowerCase();
    }
    return false;
  })();

  // Estados locales del post
  const [post, setPost] = useState(noticia);
  const [textoExpandido, setTextoExpandido] = useState(false);
  const [menuOpcionesAbierto, setMenuOpcionesAbierto] = useState(false);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Estados de Interacciones y Reacciones
  const [reaccionando, setReaccionando] = useState(false);
  const [misReacciones, setMisReacciones] = useState({});

  // Estados de Comentarios Inline
  const [mostrarComentarios, setMostrarComentarios] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [comentarioError, setComentarioError] = useState('');
  const [mostrarTodosComentarios, setMostrarTodosComentarios] = useState(false);
  const inputComentarioRef = useRef(null);

  // Lightbox de Imagen
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  // Compartir feedback
  const [compartidoFeedback, setCompartidoFeedback] = useState(false);

  // Modal de Perfil Cívico Protegido (Ley N° 8968)
  const [autorSeleccionado, setAutorSeleccionado] = useState(null);

  // Sincronizar cambios entrantes
  useEffect(() => {
    if (noticia) {
      setPost(noticia);
    }
  }, [noticia]);

  // Cargar reacciones guardadas en el navegador para este usuario
  useEffect(() => {
    if (post?.id && user?.cedula) {
      try {
        const stored = localStorage.getItem(`reacciones_noticia_${post.id}_${user.cedula}`);
        if (stored) {
          setMisReacciones(JSON.parse(stored));
        } else {
          setMisReacciones({});
        }
      } catch {
        setMisReacciones({});
      }
    }
  }, [post?.id, user?.cedula]);

  // Cerrar menú al hacer clic fuera
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickAfuera(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpcionesAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClickAfuera);
    return () => document.removeEventListener('mousedown', handleClickAfuera);
  }, []);

  if (!post) return null;

  const reacciones = post.reacciones || { apoyo: 0, interesante: 0, alerta: 0 };
  const comentarios = Array.isArray(post.comentarios) ? post.comentarios : [];
  const categoriaEstilo = obtenerColorCategoria(post.categoria);

  // Lógica de texto largo
  const contenidoTexto = post.contenido || post.resumen || '';
  const esTextoLargo = contenidoTexto.length > 280;

  // Manejar Reacción Cívica con actualización optimista
  const handleReaccionar = async (tipo) => {
    if (!user) {
      mostrarToast('Debes iniciar sesión con tu cédula para emitir reacciones cívicas oficiales.', 'advertencia');
      return;
    }
    if (reaccionando) return;

    setReaccionando(true);
    const yaReacciono = !!misReacciones[tipo];
    const prevReacciones = { ...reacciones };
    const nuevasReacciones = {
      ...prevReacciones,
      [tipo]: Math.max(0, (prevReacciones[tipo] || 0) + (yaReacciono ? -1 : 1))
    };

    const nuevasMisReacciones = {
      ...misReacciones,
      [tipo]: !yaReacciono
    };

    setPost((prev) => ({ ...prev, reacciones: nuevasReacciones }));
    setMisReacciones(nuevasMisReacciones);

    try {
      if (user?.cedula) {
        localStorage.setItem(
          `reacciones_noticia_${post.id}_${user.cedula}`,
          JSON.stringify(nuevasMisReacciones)
        );
      }
      const actualizada = await reaccionarNoticia(post.id, tipo, user);
      if (actualizada) {
        setPost(actualizada);
        if (onActualizar) onActualizar(actualizada);
      }
    } catch (err) {
      console.error('[NoticiaFeedPost] Error al reaccionar:', err);
      // Revertir
      setPost((prev) => ({ ...prev, reacciones: prevReacciones }));
    } finally {
      setReaccionando(false);
    }
  };

  // Manejar Envío de Comentario Inline
  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!user) {
      setComentarioError('Inicia sesión con tu cédula para comentar.');
      return;
    }

    const texto = nuevoComentario.trim();
    if (texto.length < 3) {
      setComentarioError('El comentario debe contener al menos 3 caracteres.');
      return;
    }

    setEnviandoComentario(true);
    setComentarioError('');

    // Sanitización bajo Ley N° 8968: Nombre y Apellido únicamente
    const nombrePublico = obtenerNombrePublico(user.nombre || 'Ciudadano Verificado');

    const nuevoComentarioObj = {
      id: `c-${Date.now()}`,
      autorNombre: nombrePublico,
      autorCedula: user.cedula || '',
      contenido: texto,
      fecha: new Date().toISOString()
    };

    // Actualización optimista inline
    const postOptimista = {
      ...post,
      comentarios: [...comentarios, nuevoComentarioObj]
    };
    setPost(postOptimista);
    setNuevoComentario('');

    try {
      const res = await agregarComentarioNoticia(
        post.id,
        {
          contenido: texto,
          autorNombre: nombrePublico,
          autorCedula: user.cedula
        },
        user
      );

      if (res) {
        setPost(res);
        if (onActualizar) onActualizar(res);
      }
    } catch (err) {
      console.error('[NoticiaFeedPost] Error comentando:', err);
      setComentarioError('No se pudo sincronizar el comentario con db.json.');
      // Revertir
      setPost(post);
    } finally {
      setEnviandoComentario(false);
    }
  };

  // Manejar Eliminación de Noticia
  const handleEliminar = async () => {
    if (!tienePermisoEditor) return;
    setEliminando(true);
    try {
      if (onEliminar) {
        await onEliminar(post.id);
      }
    } catch (err) {
      console.error('[NoticiaFeedPost] Error al dar de baja:', err);
    } finally {
      setEliminando(false);
      setConfirmandoEliminar(false);
      setMenuOpcionesAbierto(false);
    }
  };

  // Compartir post
  const handleCompartir = () => {
    if (navigator.share) {
      navigator.share({
        title: post.titulo,
        text: post.resumen || post.contenido,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCompartidoFeedback(true);
      setTimeout(() => setCompartidoFeedback(false), 2200);
    }
  };

  // Comentarios a mostrar (los últimos 3 o todos si se expande)
  const comentariosVisibles = mostrarTodosComentarios
    ? comentarios
    : comentarios.slice(-3);

  return (
    <article
      className="noticia-feed-post"
      style={{
        backgroundColor: '#0c1322',
        backgroundImage: 'radial-gradient(ellipse at top, rgba(30, 41, 59, 0.45) 0%, rgba(12, 19, 34, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* ===================================================================== */}
      {/* 1. CABECERA INSTITUCIONAL (HEADER DEL POST)                           */}
      {/* ===================================================================== */}
      <div
        style={{
          padding: '1.25rem 1.5rem 0.9rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Avatar / Escudo Municipal Cantonal */}
          <div
            style={{
              position: 'relative',
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(30, 58, 138, 0.4) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)',
              flexShrink: 0
            }}
          >
            <Building2 size={22} />
            <div
              style={{
                position: 'absolute',
                bottom: '-3px',
                right: '-3px',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                width: '13px',
                height: '13px',
                border: '2px solid #0c1322',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Emisor Oficial Verificado"
            />
          </div>

          {/* Datos del Emisor y Metadatos */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  color: '#F8FAFC',
                  letterSpacing: '-0.01em'
                }}
              >
                Municipalidad de {post.canton || 'Costa Rica'}
              </h4>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: '#34D399',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
                title="Cuenta Oficial Verificada"
              >
                <ShieldCheck size={13} />
                Cuenta oficial · Municipalidad de {post.canton || 'Costa Rica'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>
                {post.autorNombre || 'Encargado Municipal'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#475569' }}>•</span>
              <span
                style={{
                  fontSize: '0.74rem',
                  color: '#64748B',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                title={post.fechaPublicacion ? new Date(post.fechaPublicacion).toLocaleString('es-CR') : ''}
              >
                <Clock size={11} />
                {calcularTiempoRelativo(post.fechaPublicacion)}
              </span>
            </div>
          </div>
        </div>

        {/* Badges de Territorio & Menú de Opciones para Encargado Municipal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Badge Provincia / Cantón */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              padding: '0.25rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            <MapPin size={11} />
            {post.canton}, {post.provincia}
          </span>

          {/* Badge Categoría */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: categoriaEstilo.bg,
              color: categoriaEstilo.text,
              border: `1px solid ${categoriaEstilo.border}`,
              padding: '0.25rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            <Tag size={11} />
            {post.categoria || 'Comunicado'}
          </span>

          {/* Menú de Opciones (Solo Encargado Municipal de su cantón) */}
          {puedeGestionarEstePost && (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpcionesAbierto(!menuOpcionesAbierto)}
                style={{
                  backgroundColor: menuOpcionesAbierto ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  padding: '0.4rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.15s'
                }}
                title="Gestión de comunicado (Encargado Municipal)"
              >
                <MoreVertical size={18} />
              </button>

              {menuOpcionesAbierto && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.4rem',
                    width: '180px',
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
                    padding: '0.4rem',
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpcionesAbierto(false);
                      if (onEditar) onEditar(post);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#E2E8F0',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Edit size={14} color="#F59E0B" />
                    <span>Editar Noticia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpcionesAbierto(false);
                      setConfirmandoEliminar(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#F87171',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Trash2 size={14} color="#EF4444" />
                    <span>Dar de baja</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmación Inline de Borrado */}
      {confirmandoEliminar && (
        <div
          style={{
            margin: '0.75rem 1.5rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F87171', fontSize: '0.82rem', fontWeight: 600 }}>
            <ShieldAlert size={16} />
            <span>¿Confirmas dar de baja este comunicado municipal en db.json?</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setConfirmandoEliminar(false)}
              disabled={eliminando}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEliminar}
              disabled={eliminando}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: eliminando ? 'not-allowed' : 'pointer'
              }}
            >
              {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CUERPO DEL COMUNICADO (TÍTULO Y TEXTO EXPANDIBLE)                 */}
      {/* ===================================================================== */}
      <div style={{ padding: '1rem 1.5rem 0.75rem' }}>
        <h3
          style={{
            margin: '0 0 0.65rem',
            fontSize: '1.28rem',
            fontWeight: 800,
            lineHeight: 1.35,
            color: '#F8FAFC',
            letterSpacing: '-0.02em'
          }}
        >
          {post.titulo}
        </h3>

        <div style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#CBD5E1' }}>
          {esTextoLargo && !textoExpandido ? (
            <>
              <span>{contenidoTexto.slice(0, 260)}...</span>{' '}
              <button
                type="button"
                onClick={() => setTextoExpandido(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38BDF8',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                Ver más
                <ChevronDown size={14} />
              </button>
            </>
          ) : (
            <>
              <span>{contenidoTexto}</span>
              {esTextoLargo && (
                <>
                  {' '}
                  <button
                    type="button"
                    onClick={() => setTextoExpandido(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      marginLeft: '0.35rem'
                    }}
                  >
                    Ver menos
                    <ChevronUp size={13} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. ÁREA MULTIMEDIA (IMÁGENES DE ALTA RESOLUCIÓN / LIGHTBOX)          */}
      {/* ===================================================================== */}
      {post.imagenUrl ? (
        <div
          style={{
            position: 'relative',
            margin: '0.4rem 1.5rem 0.8rem',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#050B17',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            maxHeight: '460px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setLightboxAbierto(true)}
          title="Haz clic para ampliar la imagen oficial"
        >
          <img
            src={post.imagenUrl}
            alt={post.titulo}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '460px',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />

          {/* Botón flotante para ampliar imagen */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              color: '#F8FAFC',
              borderRadius: '10px',
              padding: '0.4rem 0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              pointerEvents: 'none'
            }}
          >
            <Maximize2 size={13} />
            <span>Ver HD</span>
          </div>
        </div>
      ) : (
        /* Tarjeta adaptativa sin imagen: Estilizado cívico con borde sutil */
        <div
          style={{
            margin: '0.2rem 1.5rem 0.6rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: 'rgba(56, 189, 248, 0.03)',
            borderLeft: '4px solid #38BDF8',
            borderRadius: '0 12px 12px 0',
            fontSize: '0.82rem',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <Building2 size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
          <span>Comunicado institucional oficial de transmisión directa a la comunidad.</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. BARRA DE INTERACCIÓN CÍVICA (REACCIONES & BOTÓN COMENTAR)         */}
      {/* ===================================================================== */}
      <div
        style={{
          padding: '0.75rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(5, 11, 23, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {/* Reacciones Cívicas (Apoyo, Interesante, Alerta) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          {/* Reacción: Apoyo */}
          <button
            type="button"
            onClick={() => handleReaccionar('apoyo')}
            disabled={reaccionando}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: misReacciones.apoyo ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: misReacciones.apoyo ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: misReacciones.apoyo ? '#34D399' : '#CBD5E1',
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Apoyo ciudadano a esta gestión"
          >
            <ThumbsUp size={15} />
            <span>Apoyo</span>
            <span
              style={{
                backgroundColor: misReacciones.apoyo ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                padding: '0.1rem 0.4rem',
                borderRadius: '6px',
                fontSize: '0.72rem'
              }}
            >
              {reacciones.apoyo || 0}
            </span>
          </button>

          {/* Reacción: Interesante */}
          <button
            type="button"
            onClick={() => handleReaccionar('interesante')}
            disabled={reaccionando}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: misReacciones.interesante ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: misReacciones.interesante ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: misReacciones.interesante ? '#38BDF8' : '#CBD5E1',
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="De alto interés cívico"
          >
            <Lightbulb size={15} />
            <span>Interesante</span>
            <span
              style={{
                backgroundColor: misReacciones.interesante ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                padding: '0.1rem 0.4rem',
                borderRadius: '6px',
                fontSize: '0.72rem'
              }}
            >
              {reacciones.interesante || 0}
            </span>
          </button>

          {/* Reacción: Alerta Cantonal */}
          <button
            type="button"
            onClick={() => handleReaccionar('alerta')}
            disabled={reaccionando}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: misReacciones.alerta ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: misReacciones.alerta ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: misReacciones.alerta ? '#FBBF24' : '#CBD5E1',
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Alerta o precaución comunitaria"
          >
            <AlertTriangle size={15} />
            <span>Alerta</span>
            <span
              style={{
                backgroundColor: misReacciones.alerta ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                padding: '0.1rem 0.4rem',
                borderRadius: '6px',
                fontSize: '0.72rem'
              }}
            >
              {reacciones.alerta || 0}
            </span>
          </button>
        </div>

        {/* Acciones de Comentarios y Compartir */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Botón Comentar */}
          <button
            type="button"
            onClick={() => {
              setMostrarComentarios(!mostrarComentarios);
              if (!mostrarComentarios) {
                setTimeout(() => inputComentarioRef.current?.focus(), 100);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            <MessageSquare size={16} />
            <span>
              {comentarios.length} {comentarios.length === 1 ? 'Comentario' : 'Comentarios'}
            </span>
          </button>

          {/* Botón Compartir */}
          <button
            type="button"
            onClick={handleCompartir}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: compartidoFeedback ? '#34D399' : '#94A3B8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              transition: 'color 0.15s'
            }}
            title="Compartir enlace al comunicado"
          >
            {compartidoFeedback ? <Check size={16} /> : <Share2 size={16} />}
            <span>{compartidoFeedback ? 'Copiado' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. HILO DE COMENTARIOS INLINE (EMBEBIDO DIRECTAMENTE EN EL POST)       */}
      {/* ===================================================================== */}
      {mostrarComentarios && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'rgba(5, 11, 23, 0.75)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Caja de Entrada de Comentario */}
          {user ? (
            <form onSubmit={handleEnviarComentario} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                {/* Avatar del Ciudadano Comentando */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38BDF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    flexShrink: 0
                  }}
                >
                  {(user.nombre || 'C').charAt(0).toUpperCase()}
                </div>

                {/* Input y Botón de Envío */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#0a0f1d',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '24px',
                      padding: '0.35rem 0.5rem 0.35rem 1rem',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <input
                      ref={inputComentarioRef}
                      type="text"
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                      placeholder="Escribe un comentario o consulta ciudadana..."
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#F8FAFC',
                        fontSize: '0.86rem',
                        outline: 'none'
                      }}
                    />

                    <button
                      type="submit"
                      disabled={enviandoComentario || nuevoComentario.trim().length < 3}
                      style={{
                        backgroundColor: nuevoComentario.trim().length >= 3 ? '#38BDF8' : 'rgba(255, 255, 255, 0.08)',
                        color: nuevoComentario.trim().length >= 3 ? '#00040D' : '#64748B',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: nuevoComentario.trim().length >= 3 ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      title="Publicar comentario oficial"
                    >
                      <Send size={14} />
                    </button>
                  </div>

                  {/* Aviso de Privacidad Ley N° 8968 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      color: '#64748B',
                      padding: '0 0.5rem'
                    }}
                  >
                    <span>
                      Comentando como:{' '}
                      <strong style={{ color: '#94A3B8' }}>{obtenerNombrePublico(user.nombre || 'Ciudadano')}</strong>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ShieldCheck size={11} color="#10B981" />
                      <span>Privacidad protegida (Ley N° 8968)</span>
                    </span>
                  </div>

                  {comentarioError && (
                    <div style={{ color: '#F87171', fontSize: '0.75rem', paddingLeft: '0.5rem' }}>
                      {comentarioError}
                    </div>
                  )}
                </div>
              </div>
            </form>
          ) : (
            /* Banner para Iniciar Sesión */
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                border: '1px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <LogIn size={18} color="#38BDF8" />
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Inicia sesión con tu cédula nacional para formular consultas u opiniones cívicas.
                </span>
              </div>
              <a
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Acceder</span>
              </a>
            </div>
          )}

          {/* Listado de Comentarios del Hilo */}
          {comentarios.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Botón para expandir comentarios si hay más de 3 */}
              {comentarios.length > 3 && (
                <button
                  type="button"
                  onClick={() => setMostrarTodosComentarios(!mostrarTodosComentarios)}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'none',
                    border: 'none',
                    color: '#38BDF8',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '0.2rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {mostrarTodosComentarios
                    ? 'Mostrar solo comentarios recientes'
                    : `Ver los ${comentarios.length} comentarios anteriores`}
                </button>
              )}

              {/* Items de Comentario */}
              {comentariosVisibles.map((c, idx) => {
                const nombrePublico = obtenerNombrePublico(c.autorNombre || 'Ciudadano');
                return (
                  <div
                    key={c.id || `c-${idx}`}
                    style={{
                      display: 'flex',
                      gap: '0.65rem',
                      alignItems: 'flex-start'
                    }}
                  >
                    {/* Avatar de autor del comentario */}
                    <div
                      onClick={() => setAutorSeleccionado(c.autorNombre || 'Ciudadano')}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38BDF8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      title="Ver perfil cívico público"
                    >
                      {nombrePublico.charAt(0).toUpperCase()}
                    </div>

                    {/* Burbuja de Comentario estilo Timeline */}
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '14px',
                        padding: '0.65rem 0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => setAutorSeleccionado(c.autorNombre || 'Ciudadano')}
                          title="Ver perfil cívico protegido (Ley N° 8968)"
                        >
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F1F5F9' }}>
                            {nombrePublico}
                          </span>
                          <span title="Ciudadano Verificado" style={{ display: 'inline-flex' }}>
                            <ShieldCheck size={12} color="#10B981" />
                          </span>
                        </div>

                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {calcularTiempoRelativo(c.fecha)}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.84rem',
                          lineHeight: 1.5,
                          color: '#CBD5E1',
                          wordBreak: 'break-word'
                        }}
                      >
                        {c.contenido}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '0.85rem 1rem',
                textAlign: 'center',
                color: '#64748B',
                fontSize: '0.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}
            >
              No hay comentarios todavía. ¡Sé el primer vecino en opinar o formular una consulta!
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. MODAL LIGHTBOX PARA IMÁGENES AMPLIADAS (HD)                       */}
      {/* ===================================================================== */}
      {lightboxAbierto && post.imagenUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(3, 7, 18, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setLightboxAbierto(false)}
        >
          {/* Barra superior del Lightbox */}
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#F8FAFC',
              zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{post.titulo}</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>
                Municipalidad de {post.canton} • Imagen Oficial de Obra / Comunicado
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLightboxAbierto(false)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8FAFC',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Imagen ampliada */}
          <img
            src={post.imagenUrl}
            alt={post.titulo}
            style={{
              maxWidth: '92vw',
              maxHeight: '82vh',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              objectFit: 'contain'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. MODAL DE PERFIL PÚBLICO (LEY N° 8968)                             */}
      {/* ===================================================================== */}
      {autorSeleccionado && (
        <PerfilPublicoModal
          isOpen={!!autorSeleccionado}
          onClose={() => setAutorSeleccionado(null)}
          autorNombre={autorSeleccionado}
          canton={post.canton}
          provincia={post.provincia}
          esVerificado={true}
        />
      )}
    </article>
  );
}
