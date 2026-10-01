import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Calendar,
  MapPin,
  Tag,
  Share2,
  MessageSquare,
  Send,
  ThumbsUp,
  Lightbulb,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  reaccionarNoticia,
  agregarComentarioNoticia,
  obtenerNoticiaPorId
} from '../../services/noticiasService';

/**
 * Modal de Detalle Completo de Noticia / Comunicado Municipal (M01)
 * Permite a cualquier ciudadano leer el comunicado oficial, emitir reacciones cívicas
 * y agregar comentarios en el hilo público.
 */
export default function NoticiaDetalleModal({
  isOpen,
  onClose,
  noticia,
  onNoticiaActualizada
}) {
  const { user } = useAuth();

  const [noticiaActual, setNoticiaActual] = useState(noticia);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [reaccionando, setReaccionando] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState(null);
  const [misReacciones, setMisReacciones] = useState({});

  useEffect(() => {
    if (noticia) {
      setNoticiaActual(noticia);
    }
  }, [noticia]);

  // Cargar estado de reacciones guardadas localmente para este usuario
  useEffect(() => {
    if (noticia?.id && user?.cedula) {
      try {
        const stored = localStorage.getItem(`reacciones_noticia_${noticia.id}_${user.cedula}`);
        if (stored) {
          setMisReacciones(JSON.parse(stored));
        } else {
          setMisReacciones({});
        }
      } catch (e) {
        setMisReacciones({});
      }
    }
  }, [noticia?.id, user?.cedula]);

  // Manejo de tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !noticiaActual) return null;

  const reacciones = noticiaActual.reacciones || { apoyo: 0, interesante: 0, alerta: 0 };
  const comentarios = Array.isArray(noticiaActual.comentarios) ? noticiaActual.comentarios : [];

  // Formato de fecha oficial
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no especificada';
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-CR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaStr;
    }
  };

  // Reaccionar cívicamente
  const handleReaccionar = async (tipoReaccion) => {
    if (!user) {
      setMensajeFeedback({
        tipo: 'alerta',
        texto: 'Debes iniciar sesión con tu cédula de identidad para emitir reacciones cívicas.'
      });
      return;
    }

    if (reaccionando) return;
    setReaccionando(true);
    setMensajeFeedback(null);

    // Actualización optimista local
    const reaccionesPrevias = { ...reacciones };
    const yaReacciono = misReacciones[tipoReaccion];
    const delta = yaReacciono ? -1 : 1;
    const nuevasReacciones = {
      ...reaccionesPrevias,
      [tipoReaccion]: Math.max(0, (reaccionesPrevias[tipoReaccion] || 0) + delta)
    };

    setNoticiaActual((prev) => ({
      ...prev,
      reacciones: nuevasReacciones
    }));

    const nuevoEstadoMisReacciones = {
      ...misReacciones,
      [tipoReaccion]: !yaReacciono
    };
    setMisReacciones(nuevoEstadoMisReacciones);

    try {
      if (user?.cedula) {
        localStorage.setItem(
          `reacciones_noticia_${noticiaActual.id}_${user.cedula}`,
          JSON.stringify(nuevoEstadoMisReacciones)
        );
      }
      const noticiaActualizada = await reaccionarNoticia(noticiaActual.id, tipoReaccion, user);
      if (noticiaActualizada) {
        setNoticiaActual(noticiaActualizada);
        if (onNoticiaActualizada) onNoticiaActualizada(noticiaActualizada);
      }
    } catch (err) {
      console.error('[NoticiaDetalleModal] Error reaccionando:', err);
      // Revertir optimismo si falló
      setNoticiaActual((prev) => ({
        ...prev,
        reacciones: reaccionesPrevias
      }));
      setMensajeFeedback({
        tipo: 'error',
        texto: 'No se pudo registrar la reacción en el servidor municipal.'
      });
    } finally {
      setReaccionando(false);
    }
  };

  // Publicar comentario ciudadano
  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!user) {
      setMensajeFeedback({
        tipo: 'alerta',
        texto: 'Se requiere inicio de sesión con cédula oficial para formular comentarios públicos.'
      });
      return;
    }

    const textoLimpio = nuevoComentario.trim();
    if (textoLimpio.length < 5) {
      setMensajeFeedback({
        tipo: 'alerta',
        texto: 'El comentario debe contener al menos 5 caracteres para enriquecer el debate cívico.'
      });
      return;
    }

    setEnviandoComentario(true);
    setMensajeFeedback(null);

    try {
      const nuevoComentarioObj = {
        id: `c-${Date.now()}`,
        autorNombre: user.nombre || 'Ciudadano Verificado',
        autorCedula: user.cedula || 'No especificada',
        contenido: textoLimpio,
        fecha: new Date().toISOString()
      };

      // Optimismo en UI
      const noticiaConNuevoComentario = {
        ...noticiaActual,
        comentarios: [...comentarios, nuevoComentarioObj]
      };
      setNoticiaActual(noticiaConNuevoComentario);
      setNuevoComentario('');

      const res = await agregarComentarioNoticia(
        noticiaActual.id,
        {
          contenido: textoLimpio,
          autorNombre: user.nombre,
          autorCedula: user.cedula
        },
        user
      );

      if (res) {
        setNoticiaActual(res);
        if (onNoticiaActualizada) onNoticiaActualizada(res);
      }

      setMensajeFeedback({
        tipo: 'exito',
        texto: '¡Comentario cívico publicado con éxito en el comunicado oficial!'
      });
    } catch (err) {
      console.error('[NoticiaDetalleModal] Error al comentar:', err);
      setMensajeFeedback({
        tipo: 'error',
        texto: err.message || 'Error al guardar el comentario en db.json.'
      });
    } finally {
      setEnviandoComentario(false);
    }
  };

  // Compartir enlace
  const handleCompartir = () => {
    if (navigator.share) {
      navigator.share({
        title: noticiaActual.titulo,
        text: noticiaActual.resumen,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setMensajeFeedback({
        tipo: 'exito',
        texto: 'Enlace del comunicado municipal copiado al portapapeles.'
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-noticia-titulo"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 4, 13, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '92vh',
          backgroundColor: '#050B17',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Cabecera del Modal con Sello Oficial */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                flexShrink: 0
              }}
            >
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#38BDF8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(56, 189, 248, 0.25)'
                  }}
                >
                  M01 • COMUNICADO MUNICIPAL OFICIAL
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#94A3B8'
                  }}
                >
                  {noticiaActual.provincia} • Cantón de {noticiaActual.canton}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>
                Publicado por: <strong style={{ color: '#E2E8F0' }}>{noticiaActual.autorNombre}</strong> ({noticiaActual.autorRol || 'Editor Municipal'})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleCompartir}
              title="Compartir comunicado"
              aria-label="Compartir comunicado"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                padding: '0.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={onClose}
              title="Cerrar ventana"
              aria-label="Cerrar modal"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                padding: '0.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Feedback Alert si existe */}
        {mensajeFeedback && (
          <div
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor:
                mensajeFeedback.tipo === 'exito'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : mensajeFeedback.tipo === 'alerta'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              color:
                mensajeFeedback.tipo === 'exito'
                  ? '#34D399'
                  : mensajeFeedback.tipo === 'alerta'
                  ? '#FBBF24'
                  : '#F87171',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {mensajeFeedback.tipo === 'exito' && <CheckCircle2 size={16} />}
              {mensajeFeedback.tipo === 'alerta' && <AlertTriangle size={16} />}
              {mensajeFeedback.tipo === 'error' && <AlertCircle size={16} />}
              <span>{mensajeFeedback.texto}</span>
            </div>
            <button
              onClick={() => setMensajeFeedback(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: '0.2rem'
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Contenedor con Scroll de Lectura y Comentarios */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          {/* Metadata y Categoría */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <Tag size={13} />
              {noticiaActual.categoria || 'Comunicado Oficial'}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#94A3B8',
                fontSize: '0.8rem'
              }}
            >
              <Calendar size={14} />
              {formatearFecha(noticiaActual.fechaPublicacion)}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#94A3B8',
                fontSize: '0.8rem'
              }}
            >
              <MapPin size={14} />
              {noticiaActual.canton}, {noticiaActual.provincia}
            </span>
          </div>

          {/* Título Principal */}
          <h1
            id="modal-noticia-titulo"
            style={{
              fontSize: '1.65rem',
              lineHeight: 1.3,
              fontWeight: 800,
              color: '#F8FAFC',
              margin: 0
            }}
          >
            {noticiaActual.titulo}
          </h1>

          {/* Resumen Destacado tipo Lead */}
          {noticiaActual.resumen && (
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                borderLeft: '4px solid #38BDF8',
                borderRadius: '0 12px 12px 0',
                padding: '1rem 1.25rem',
                fontSize: '0.98rem',
                lineHeight: 1.6,
                color: '#CBD5E1',
                fontStyle: 'italic'
              }}
            >
              {noticiaActual.resumen}
            </div>
          )}

          {/* Imagen ilustrativa si existe */}
          {noticiaActual.imagenUrl && (
            <div
              style={{
                width: '100%',
                maxHeight: '340px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={noticiaActual.imagenUrl}
                alt={noticiaActual.titulo}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Contenido Completo del Comunicado */}
          <div
            style={{
              color: '#E2E8F0',
              fontSize: '1rem',
              lineHeight: 1.75,
              whiteSpace: 'pre-line'
            }}
          >
            {noticiaActual.contenido}
          </div>

          {/* Tarjeta de Validación Cívica del Editor */}
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={20} color="#10B981" />
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>
                  Documento Certificado por la Municipalidad de {noticiaActual.canton}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                  Autoridad: {noticiaActual.autorNombre} · Cédula: {noticiaActual.autorCedula || 'Institucional'}
                </p>
              </div>
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontWeight: 700,
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}
            >
              VERIFICACIÓN OFICIAL MUNICIPAL
            </div>
          </div>

          {/* ================================================================= */}
          {/* BARRA DE REACCIONES CÍVICAS INTERACTIVAS                         */}
          {/* ================================================================= */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#94A3B8'
                }}
              >
                Reacciones Ciudadanas Oficiales
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {user ? 'Haz clic para emitir tu criterio cívico' : 'Inicia sesión para reaccionar'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem'
              }}
            >
              {/* Botón 1: Apoyo */}
              <button
                type="button"
                onClick={() => handleReaccionar('apoyo')}
                disabled={reaccionando}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: misReacciones.apoyo
                    ? '1px solid rgba(16, 185, 129, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: misReacciones.apoyo
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: misReacciones.apoyo ? '#34D399' : '#CBD5E1',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <ThumbsUp size={16} />
                <span>Apoyo</span>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem'
                  }}
                >
                  {reacciones.apoyo || 0}
                </span>
              </button>

              {/* Botón 2: Interesante */}
              <button
                type="button"
                onClick={() => handleReaccionar('interesante')}
                disabled={reaccionando}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: misReacciones.interesante
                    ? '1px solid rgba(56, 189, 248, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: misReacciones.interesante
                    ? 'rgba(56, 189, 248, 0.2)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: misReacciones.interesante ? '#38BDF8' : '#CBD5E1',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Lightbulb size={16} />
                <span>Interesante</span>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem'
                  }}
                >
                  {reacciones.interesante || 0}
                </span>
              </button>

              {/* Botón 3: Alerta Cantonal */}
              <button
                type="button"
                onClick={() => handleReaccionar('alerta')}
                disabled={reaccionando}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: misReacciones.alerta
                    ? '1px solid rgba(245, 158, 11, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: misReacciones.alerta
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: misReacciones.alerta ? '#FBBF24' : '#CBD5E1',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <AlertTriangle size={16} />
                <span>Alerta Cantonal</span>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem'
                  }}
                >
                  {reacciones.alerta || 0}
                </span>
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SECCIÓN DE COMENTARIOS CIUDADANOS                                */}
          {/* ================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} color="#38BDF8" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Comentarios y Consultas Ciudadanas ({comentarios.length})
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Foro Municipal Abierto
              </span>
            </div>

            {/* Formulario para Nuevo Comentario */}
            {user ? (
              <form
                onSubmit={handleEnviarComentario}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={16} color="#34D399" />
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    Comentando como: <strong style={{ color: '#F1F5F9' }}>{user.nombre}</strong> (Cédula: {user.cedula})
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  placeholder="Formula una consulta de interés público o aporta información cívica sobre este comunicado..."
                  style={{
                    width: '100%',
                    backgroundColor: '#050B17',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#F8FAFC',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={enviandoComentario || nuevoComentario.trim().length < 5}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#38BDF8',
                      color: '#00040D',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor:
                        enviandoComentario || nuevoComentario.trim().length < 5
                          ? 'not-allowed'
                          : 'pointer',
                      opacity: enviandoComentario || nuevoComentario.trim().length < 5 ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Send size={15} />
                    <span>{enviandoComentario ? 'Publicando...' : 'Publicar Comentario'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <LogIn size={20} color="#38BDF8" />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#F1F5F9' }}>
                      ¿Deseas formular una consulta a la Municipalidad?
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>
                      Inicia sesión con tu cédula nacional o pasaporte para registrar tus comentarios en el acta cívica.
                    </p>
                  </div>
                </div>
                <a
                  href="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <LogIn size={15} />
                  <span>Iniciar Sesión</span>
                </a>
              </div>
            )}

            {/* Listado de Comentarios Existentes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {comentarios.length === 0 ? (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    color: '#64748B',
                    fontSize: '0.85rem'
                  }}
                >
                  No hay comentarios aún en este comunicado. ¡Sé el primer vecino en opinar!
                </div>
              ) : (
                comentarios.map((c, index) => (
                  <div
                    key={c.id || `c-${index}`}
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '0.9rem 1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#38BDF8'
                          }}
                        >
                          {(c.autorNombre || 'C').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F1F5F9' }}>
                          {c.autorNombre || 'Ciudadano'}
                        </span>
                        {c.autorCedula && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: '#94A3B8',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px'
                            }}
                          >
                            Cédula: {c.autorCedula}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {formatearFecha(c.fecha)}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        color: '#CBD5E1',
                        paddingLeft: '2.1rem'
                      }}
                    >
                      {c.contenido}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pie del Modal */}
        <div
          style={{
            padding: '1rem 1.75rem',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem' }}>
            <Sparkles size={14} color="#38BDF8" />
            <span>Sistema Nacional de Noticias Cantonales Costa Rica Unidos</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#F1F5F9',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cerrar Lectura
          </button>
        </div>
      </div>
    </div>
  );
}
