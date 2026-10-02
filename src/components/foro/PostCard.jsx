import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  MapPin,
  Globe,
  Tag,
  Clock,
  Sparkles,
  AlertTriangle,
  Heart,
  Lightbulb,
  CheckCircle2,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import ComentariosSection from './ComentariosSection';
import { votarPost, reaccionarPost, eliminarPost } from '../../services/foroService';
import { useAuth } from '../../context/AuthContext';
import { obtenerNombrePublico } from '../../utils/privacyUtils';
import PerfilPublicoModal from '../perfil/PerfilPublicoModal';

// Mapeo de estilos y colores por provincia
const PROVINCIA_COLORS = {
  'nacional': {
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.35)',
    text: '#60A5FA',
    label: 'Foro Nacional',
    icon: Globe
  },
  'san-jose': {
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.35)',
    text: '#C084FC',
    label: 'San José',
    icon: MapPin
  },
  'alajuela': {
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.35)',
    text: '#F87171',
    label: 'Alajuela',
    icon: MapPin
  },
  'cartago': {
    bg: 'rgba(14, 165, 233, 0.15)',
    border: 'rgba(14, 165, 233, 0.35)',
    text: '#38BDF8',
    label: 'Cartago',
    icon: MapPin
  },
  'heredia': {
    bg: 'rgba(234, 179, 8, 0.15)',
    border: 'rgba(234, 179, 8, 0.35)',
    text: '#FACC15',
    label: 'Heredia',
    icon: MapPin
  },
  'guanacaste': {
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.35)',
    text: '#FB923C',
    label: 'Guanacaste',
    icon: MapPin
  },
  'puntarenas': {
    bg: 'rgba(20, 184, 166, 0.15)',
    border: 'rgba(20, 184, 166, 0.35)',
    text: '#2DD4BF',
    label: 'Puntarenas',
    icon: MapPin
  },
  'limon': {
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    text: '#34D399',
    label: 'Limón',
    icon: MapPin
  }
};

function formatearFecha(fechaIso) {
  if (!fechaIso) return 'Reciente';
  try {
    const d = new Date(fechaIso);
    if (isNaN(d.getTime())) return String(fechaIso);

    const diffSeg = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSeg < 60) return 'Hace un momento';
    const diffMin = Math.floor(diffSeg / 60);
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `Hace ${diffHoras} horas`;
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 7) return `Hace ${diffDias} días`;

    return d.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Reciente';
  }
}

export default function PostCard({ post, onActualizado, onEliminado }) {
  const { user } = useAuth();
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [mostrarPerfilModal, setMostrarPerfilModal] = useState(false);
  const [votando, setVotando] = useState(false);
  const [reaccionando, setReaccionando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const cleanCedula = user?.cedula || '1-1823-0456';
  const votoActual = post.usuariosVotaron?.[cleanCedula] || null;

  const provKey = String(post.provinciaId || 'nacional').toLowerCase();
  const provMeta = PROVINCIA_COLORS[provKey] || PROVINCIA_COLORS.nacional;
  const ProvIcon = provMeta.icon;

  const totalComentarios = Array.isArray(post.comentarios) ? post.comentarios.length : 0;
  const reacciones = post.reacciones || { apoyo: 0, urgente: 0, idea: 0 };

  // Manejo de Votos con actualización optimista y persistencia en db.json
  const handleVotar = async (tipo) => {
    if (votando) return;
    try {
      setVotando(true);
      const updated = await votarPost(post.id, tipo, cleanCedula);
      if (onActualizado) onActualizado(updated);
    } catch (err) {
      console.error('Error al votar:', err);
    } finally {
      setVotando(false);
    }
  };

  // Manejo de Reacciones
  const handleReaccionar = async (tipo) => {
    if (reaccionando) return;
    try {
      setReaccionando(true);
      const updated = await reaccionarPost(post.id, tipo, cleanCedula);
      if (onActualizado) onActualizado(updated);
    } catch (err) {
      console.error('Error al reaccionar:', err);
    } finally {
      setReaccionando(false);
    }
  };

  // Copiar enlace al debate
  const handleCompartir = () => {
    try {
      const url = `${window.location.origin}/foro?id=${post.id}`;
      navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Eliminar post si es autor o administrador
  const handleEliminar = async () => {
    if (window.confirm('¿Está seguro de eliminar esta publicación del Foro Tico?')) {
      try {
        await eliminarPost(post.id);
        if (onEliminado) onEliminado(post.id);
      } catch (e) {
        console.error('Error eliminando:', e);
      }
    }
  };

  const esAutorOAdmin =
    user?.cedula === post.autorCedula ||
    user?.rol === 'Super Administrador Nacional' ||
    user?.rol === 'Administrador Provincial';

  return (
    <article
      style={{
        backgroundColor: '#070D1B',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        padding: '1.5rem',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      className="hover:border-sky-500/30"
    >
      {/* 1. ENCABEZADO DE LA PUBLICACIÓN */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Autor y datos de publicación (Ley N° 8968: Sanitizado y cédula protegida) */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => setMostrarPerfilModal(true)}
          title="Ver perfil cívico público protegido (Ley N° 8968)"
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.2)'
            }}
          >
            {obtenerNombrePublico(post.autorNombre).charAt(0)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>
                {obtenerNombrePublico(post.autorNombre)}
              </span>
              <span title="Ciudadano Verificado" style={{ display: 'flex', alignItems: 'center' }}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#64748B',
                marginTop: '1px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock className="w-3 h-3" />
                {formatearFecha(post.fecha)}
              </span>
              <span>•</span>
              <span style={{ color: '#38BDF8', fontSize: '0.7rem' }}>Identidad Protegida (Ley 8968)</span>
            </div>
          </div>
        </div>

        {/* Insignias de Territorio y Categoría */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Badge Provincial / Nacional */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: provMeta.bg,
              border: `1px solid ${provMeta.border}`,
              color: provMeta.text,
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.02em'
            }}
          >
            <ProvIcon className="w-3.5 h-3.5" />
            <span>{post.provinciaNombre || provMeta.label}</span>
          </span>

          {/* Badge de Categoría */}
          {post.categoria && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              <Tag className="w-3 h-3 text-sky-400" />
              <span>{post.categoria}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. CUERPO DE LA PUBLICACIÓN */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#FFFFFF',
            marginBottom: '0.65rem'
          }}
        >
          {post.titulo}
        </h3>

        <p
          style={{
            fontSize: '0.925rem',
            lineHeight: 1.6,
            color: '#CBD5E1',
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}
        >
          {post.contenido}
        </p>
      </div>

      {/* 3. BARRA DE REACCIONES TEMÁTICAS (Apoyo, Urgente, Idea) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingBottom: '0.85rem',
          marginBottom: '0.85rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#64748B', marginRight: '0.25rem' }}>
          Reacciones cívicas:
        </span>

        {/* Reacción: Apoyo */}
        <button
          type="button"
          onClick={() => handleReaccionar('apoyo')}
          title="Manifestar apoyo a esta propuesta"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: '#38BDF8',
            fontSize: '0.775rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="hover:bg-sky-500/20 active:scale-95"
        >
          <span>🤝 Apoyo</span>
          <span style={{ opacity: 0.9 }}>{reacciones.apoyo || 0}</span>
        </button>

        {/* Reacción: Urgente */}
        <button
          type="button"
          onClick={() => handleReaccionar('urgente')}
          title="Señalar como asunto prioritario / urgente"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#F87171',
            fontSize: '0.775rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="hover:bg-rose-500/20 active:scale-95"
        >
          <span>🚨 Urgente</span>
          <span style={{ opacity: 0.9 }}>{reacciones.urgente || 0}</span>
        </button>

        {/* Reacción: Idea */}
        <button
          type="button"
          onClick={() => handleReaccionar('idea')}
          title="Excelente idea vecinal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.2)',
            color: '#FACC15',
            fontSize: '0.775rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="hover:bg-amber-500/20 active:scale-95"
        >
          <span>💡 Buena Idea</span>
          <span style={{ opacity: 0.9 }}>{reacciones.idea || 0}</span>
        </button>
      </div>

      {/* 4. BARRA INFERIOR DE ACCIONES (VOTOS LIKE/DISLIKE + COMENTARIOS + COMPARTIR) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {/* Grupo de Votos (Like / Dislike) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Botón Me Gusta */}
          <button
            type="button"
            onClick={() => handleVotar('like')}
            disabled={votando}
            aria-label="Votar Me Gusta"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              backgroundColor:
                votoActual === 'like' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border:
                votoActual === 'like'
                  ? '1px solid rgba(16, 185, 129, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              color: votoActual === 'like' ? '#34D399' : '#CBD5E1',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: votando ? 'wait' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-emerald-500/15"
          >
            <ThumbsUp className={`w-4 h-4 ${votoActual === 'like' ? 'fill-emerald-400/30' : ''}`} />
            <span>{post.likes || 0}</span>
          </button>

          {/* Botón No Me Gusta */}
          <button
            type="button"
            onClick={() => handleVotar('dislike')}
            disabled={votando}
            aria-label="Votar No Me Gusta"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              backgroundColor:
                votoActual === 'dislike' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border:
                votoActual === 'dislike'
                  ? '1px solid rgba(244, 63, 94, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              color: votoActual === 'dislike' ? '#FB7185' : '#CBD5E1',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: votando ? 'wait' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-rose-500/15"
          >
            <ThumbsDown className={`w-4 h-4 ${votoActual === 'dislike' ? 'fill-rose-400/30' : ''}`} />
            <span>{post.dislikes || 0}</span>
          </button>
        </div>

        {/* Grupo Secundario: Comentarios + Compartir + Eliminar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Botón Desplegar Comentarios */}
          <button
            type="button"
            onClick={() => setMostrarComentarios(!mostrarComentarios)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: mostrarComentarios
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              border: mostrarComentarios
                ? '1px solid rgba(56, 189, 248, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              color: mostrarComentarios ? '#38BDF8' : '#CBD5E1',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-sky-500/10"
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {totalComentarios === 0
                ? 'Comentar'
                : `${totalComentarios} ${totalComentarios === 1 ? 'comentario' : 'comentarios'}`}
            </span>
          </button>

          {/* Botón Compartir */}
          <button
            type="button"
            onClick={handleCompartir}
            title="Copiar enlace al debate"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: copiado ? '#34D399' : '#94A3B8',
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-white/10"
          >
            {copiado ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiado ? '¡Copiado!' : 'Compartir'}</span>
          </button>

          {/* Botón Eliminar (solo visible para autor o moderador) */}
          {esAutorOAdmin && (
            <button
              type="button"
              onClick={handleEliminar}
              title="Eliminar publicación"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                color: '#FB7185',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-rose-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 5. SECCIÓN DESPLEGABLE DE COMENTARIOS */}
      {mostrarComentarios && (
        <ComentariosSection post={post} onPostActualizado={onActualizado} />
      )}

      {/* Modal de Perfil Público Protegido */}
      {mostrarPerfilModal && (
        <PerfilPublicoModal
          isOpen={mostrarPerfilModal}
          onClose={() => setMostrarPerfilModal(false)}
          autorNombre={post.autorNombre}
          canton={post.provinciaNombre || 'Costa Rica'}
        />
      )}
    </article>
  );
}
