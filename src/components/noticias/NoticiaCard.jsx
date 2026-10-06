import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Tag,
  ChevronRight,
  ThumbsUp,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { esEditorMunicipal } from '../../services/noticiasService';

/**
 * Tarjeta de Noticia / Comunicado Municipal (M01)
 * Aplica RBAC estricto: Sólo usuarios con rol de Editor Municipal
 * pueden visualizar y ejecutar las acciones de Edición y Eliminación.
 */
export default function NoticiaCard({
  noticia,
  onVerDetalle,
  onEditar,
  onEliminar,
  onReaccionar
}) {
  const { user } = useAuth();
  const tienePermisoEditor = esEditorMunicipal(user);

  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  if (!noticia) return null;

  const reacciones = noticia.reacciones || { apoyo: 0, interesante: 0, alerta: 0 };
  const totalComentarios = Array.isArray(noticia.comentarios) ? noticia.comentarios.length : 0;

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return fechaStr;
    }
  };

  const handleConfirmarEliminar = async (e) => {
    e.stopPropagation();
    if (!tienePermisoEditor) return;

    setEliminando(true);
    try {
      if (onEliminar) {
        await onEliminar(noticia.id);
      }
    } catch (err) {
      console.error('[NoticiaCard] Error al eliminar:', err);
    } finally {
      setEliminando(false);
      setConfirmandoEliminar(false);
    }
  };

  // Color temático según categoría
  const obtenerColorCategoria = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('obra') || c.includes('vial')) return '#F59E0B'; // Ámbar
    if (c.includes('seguridad') || c.includes('emergencia')) return '#EF4444'; // Rojo
    if (c.includes('gobernanza') || c.includes('trámite')) return '#38BDF8'; // Cyan
    if (c.includes('ambiente') || c.includes('sostenib')) return '#10B981'; // Verde Esmeralda
    if (c.includes('participa') || c.includes('comunid')) return '#A855F7'; // Púrpura
    return '#38BDF8';
  };

  const categoriaColor = obtenerColorCategoria(noticia.categoria);

  return (
    <article
      style={{
        backgroundColor: 'var(--cru-surface-card, #FFFFFF)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--cru-border, #E2E8F0)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: 'var(--cru-card-shadow, 0 10px 30px rgba(6, 42, 119, 0.06))'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'var(--cru-border-hover, #CBD5E1)';
        e.currentTarget.style.boxShadow = 'var(--cru-card-shadow-hover, 0 16px 36px rgba(6, 42, 119, 0.12))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--cru-border, #E2E8F0)';
        e.currentTarget.style.boxShadow = 'var(--cru-card-shadow, 0 10px 30px rgba(6, 42, 119, 0.06))';
      }}
    >
      {/* Contenido Superior */}
      <div style={{ padding: '1.25rem 1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Cabecera con Sello Territorial y Categoría */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Building2 size={12} />
              {noticia.canton}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <MapPin size={11} />
              {noticia.provincia}
            </span>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: `${categoriaColor}15`,
              color: categoriaColor,
              border: `1px solid ${categoriaColor}40`,
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            <Tag size={11} />
            {noticia.categoria || 'Comunicado'}
          </span>
        </div>

        {/* Título de la Noticia */}
        <h3
          onClick={() => onVerDetalle && onVerDetalle(noticia)}
          style={{
            margin: 0,
            fontSize: '1.15rem',
            lineHeight: 1.4,
            fontWeight: 700,
            color: 'var(--cru-text, #062A77)',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--blue, #0053AF)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--cru-text, #062A77)';
          }}
        >
          {noticia.titulo}
        </h3>

        {/* Resumen */}
        <p
          style={{
            margin: 0,
            fontSize: '0.86rem',
            lineHeight: 1.55,
            color: 'var(--cru-text-secondary, #475569)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {noticia.resumen || noticia.contenido}
        </p>

        {/* Autor y Fecha */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--cru-text-soft, #64748B)',
            paddingTop: '0.35rem',
            borderTop: '1px solid var(--cru-border, #E2E8F0)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--cru-text-soft, #64748B)' }}>
            <ShieldCheck size={13} color="#10B981" />
            {noticia.autorNombre || 'Municipalidad'}
          </span>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} />
            {formatearFecha(noticia.fechaPublicacion)}
          </span>
        </div>
      </div>

      {/* Controles y Acciones Inferiores */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--cru-surface-hover, #F8FAFC)',
          borderTop: '1px solid var(--cru-border, #E2E8F0)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {/* Reacciones Rápidas & Comentarios */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Pill Apoyo */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onReaccionar) onReaccionar(noticia.id, 'apoyo');
                else if (onVerDetalle) onVerDetalle(noticia);
              }}
              title="Apoyo ciudadano"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.74rem',
                color: '#CBD5E1',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#34D399';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#CBD5E1';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <ThumbsUp size={12} />
              <span>{reacciones.apoyo || 0}</span>
            </button>

            {/* Pill Interesante */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onReaccionar) onReaccionar(noticia.id, 'interesante');
                else if (onVerDetalle) onVerDetalle(noticia);
              }}
              title="De interés cívico"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.74rem',
                color: '#CBD5E1',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#38BDF8';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#CBD5E1';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <Lightbulb size={12} />
              <span>{reacciones.interesante || 0}</span>
            </button>

            {/* Pill Alerta */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onReaccionar) onReaccionar(noticia.id, 'alerta');
                else if (onVerDetalle) onVerDetalle(noticia);
              }}
              title="Alerta comunal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.74rem',
                color: '#CBD5E1',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FBBF24';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#CBD5E1';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <AlertTriangle size={12} />
              <span>{reacciones.alerta || 0}</span>
            </button>
          </div>

          {/* Contador Comentarios */}
          <div
            onClick={() => onVerDetalle && onVerDetalle(noticia)}
            title="Ver comentarios ciudadanos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#94A3B8',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={13} />
            <span>{totalComentarios} {totalComentarios === 1 ? 'comentario' : 'comentarios'}</span>
          </div>
        </div>

        {/* Confirmación de Borrado Inline para Editor Municipal */}
        {confirmandoEliminar && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F87171', fontSize: '0.78rem', fontWeight: 600 }}>
              <ShieldAlert size={15} />
              <span>¿Dar de baja este comunicado en db.json?</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmandoEliminar(false);
                }}
                disabled={eliminando}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'transparent',
                  color: '#CBD5E1',
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarEliminar}
                disabled={eliminando}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: eliminando ? 'not-allowed' : 'pointer'
                }}
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        )}

        {/* Fila Principal de Botones */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          {/* Botón de Lectura Completa (Visible para todos: Ciudadano, Editor, Visitante) */}
          <button
            type="button"
            onClick={() => onVerDetalle && onVerDetalle(noticia)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38BDF8',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.2)';
              e.currentTarget.style.borderColor = '#38BDF8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
            }}
          >
            <Eye size={14} />
            <span>Leer Comunicado</span>
            <ChevronRight size={14} />
          </button>

          {/* =============================================================== */}
          {/* ACCIONES EXCLUSIVAS DE GESTIÓN (RBAC: Solo Editor Municipal)    */}
          {/* =============================================================== */}
          {tienePermisoEditor && !confirmandoEliminar && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {/* Botón Editar */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEditar) onEditar(noticia);
                }}
                title="Editar comunicado oficial (Editor Municipal)"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94A3B8',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F59E0B';
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <Edit size={14} />
              </button>

              {/* Botón Eliminar */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmandoEliminar(true);
                }}
                title="Dar de baja comunicado oficial (Editor Municipal)"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94A3B8',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
