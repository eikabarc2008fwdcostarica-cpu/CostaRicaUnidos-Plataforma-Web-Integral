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
  ShieldCheck,
  Bot,
  FileText,
  Loader2,
  Send,
  RotateCcw,
  X
} from 'lucide-react';
import ComentariosSection from './ComentariosSection';
import { votarPost, reaccionarPost, eliminarPost } from '../../services/foroService';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../hooks/useConfirm';
import { obtenerNombrePublico } from '../../utils/privacyUtils';
import PerfilPublicoModal from '../perfil/PerfilPublicoModal';
import { generarRespuestaIA, getGeminiApiKey } from '../../services/geminiService';
import {
  PROMPT_SISTEMA_FORO_CONSULTA,
  PROMPT_SISTEMA_FORO_RESUMEN,
  enmascararDatosPersonales
} from '../../config/promptsIA';

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
  const confirm = useConfirm();
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [mostrarPerfilModal, setMostrarPerfilModal] = useState(false);
  const [votando, setVotando] = useState(false);
  const [reaccionando, setReaccionando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Estados de Asistencia IA (Gemini) en el hilo
  const [panelIaAbierto, setPanelIaAbierto] = useState(false);
  const [modoIa, setModoIa] = useState(null); // 'resumen' | 'pregunta'
  const [preguntaIa, setPreguntaIa] = useState('');
  const [cargandoIa, setCargandoIa] = useState(false);
  const [respuestaIa, setRespuestaIa] = useState(null);
  const [errorIa, setErrorIa] = useState(null);

  const hayApiKey = Boolean(getGeminiApiKey());

  const handleAbrirResumenIa = async () => {
    if (panelIaAbierto && modoIa === 'resumen') {
      setPanelIaAbierto(false);
      return;
    }
    setPanelIaAbierto(true);
    setModoIa('resumen');
    setErrorIa(null);

    if (!hayApiKey) {
      setErrorIa('Asistencia de IA no disponible. Se requiere configurar VITE_GEMINI_API_KEY en el entorno.');
      return;
    }

    if (respuestaIa?.tipo === 'resumen') return;

    setCargandoIa(true);
    try {
      const comentariosTexto = (post.comentarios || [])
        .slice(-6)
        .map((c) => `- ${c.autorNombre || 'Vecino'}: ${c.contenido}`)
        .join('\n');

      const textoHilo = `Título del debate: ${post.titulo || 'Sin título'}
Categoría: ${post.categoria || 'General'}
Detalle de la propuesta:
${post.contenido || ''}
${comentariosTexto ? `\nComentarios recientes de la comunidad:\n${comentariosTexto}` : ''}`;

      const res = await generarRespuestaIA({
        sistema: PROMPT_SISTEMA_FORO_RESUMEN,
        mensaje: textoHilo,
        opciones: { temperature: 0.4 }
      });

      setRespuestaIa({
        texto: res.texto,
        modelo: res.modelo,
        latenciaMs: res.latenciaMs,
        tipo: 'resumen'
      });
    } catch (err) {
      console.error('[PostCard IA Error]', err);
      setErrorIa('La IA no está disponible ahora, inténtalo de nuevo.');
    } finally {
      setCargandoIa(false);
    }
  };

  const handleAbrirPreguntaIa = () => {
    if (panelIaAbierto && modoIa === 'pregunta') {
      setPanelIaAbierto(false);
      return;
    }
    setPanelIaAbierto(true);
    setModoIa('pregunta');
    setErrorIa(null);
  };

  const handleEnviarPreguntaIa = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!preguntaIa.trim() || cargandoIa) return;

    if (!hayApiKey) {
      setErrorIa('Asistencia de IA no disponible. Se requiere configurar VITE_GEMINI_API_KEY en el entorno.');
      return;
    }

    setCargandoIa(true);
    setErrorIa(null);
    try {
      const comentariosTexto = (post.comentarios || [])
        .slice(-5)
        .map((c) => `- ${c.autorNombre || 'Vecino'}: ${c.contenido}`)
        .join('\n');

      const contextoHilo = `Contexto del debate cívico:
Título: ${post.titulo || 'Sin título'}
Provincia: ${provMeta.label}
Detalle: ${post.contenido || ''}
${comentariosTexto ? `Comentarios recientes:\n${comentariosTexto}` : ''}

Pregunta del ciudadano:
"${preguntaIa.trim()}"`;

      const res = await generarRespuestaIA({
        sistema: PROMPT_SISTEMA_FORO_CONSULTA,
        mensaje: contextoHilo,
        opciones: { temperature: 0.5 }
      });

      setRespuestaIa({
        texto: res.texto,
        modelo: res.modelo,
        latenciaMs: res.latenciaMs,
        tipo: 'pregunta',
        preguntaOriginal: preguntaIa.trim()
      });
      setPreguntaIa('');
    } catch (err) {
      console.error('[PostCard IA Error]', err);
      setErrorIa('La IA no está disponible ahora, inténtalo de nuevo.');
    } finally {
      setCargandoIa(false);
    }
  };

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
    const ok = await confirm({
      title: 'Eliminar publicación',
      message: '¿Está seguro de eliminar esta publicación del Foro Tico? Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      variant: 'danger'
    });
    if (!ok) return;

    try {
      await eliminarPost(post.id, user);
      if (onEliminado) onEliminado(post.id);
    } catch (e) {
      console.error('Error eliminando:', e);
    }
  };

  const esAutorOAdmin = (() => {
    if (!user) return false;
    if (user.rol === 'Super Administrador Nacional') return true;
    if (user.rol === 'Administrador Provincial') return true;
    if (user.cedula && user.cedula === post.autorCedula) return true;
    // Si es Encargado Municipal: solo si el post es de SU cantón Y emitido como publicación oficial de su municipalidad
    if (user.isEncargadoMunicipal || user.rol === 'Encargado Municipal') {
      const mismoCanton = user.canton && String(post.canton || '').toLowerCase() === String(user.canton || '').toLowerCase();
      const esOficialMuni = post.esOficial || post.autorRol === 'Encargado Municipal';
      return Boolean(mismoCanton && esOficialMuni);
    }
    return false;
  })();

  return (
    <article
      style={{
        backgroundColor: 'var(--cru-surface-card, #FFFFFF)',
        borderRadius: '20px',
        border: '1px solid var(--cru-border, #E2E8F0)',
        boxShadow: 'var(--cru-card-shadow, 0 10px 30px rgba(6, 42, 119, 0.06))',
        padding: '1.5rem',
        transition: 'var(--transition-smooth)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cru-text, #062A77)' }}>
                {post.esOficial || post.distintivo ? (post.autorNombre || 'Encargado Municipal') : obtenerNombrePublico(post.autorNombre)}
              </span>
              {post.esOficial || post.distintivo || post.autorRol === 'Encargado Municipal' ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                  title="Publicación Oficial Municipal Verificada"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {post.distintivo || `Cuenta oficial · Municipalidad de ${post.canton || ''}`}
                </span>
              ) : (
                <span title="Ciudadano Verificado" style={{ display: 'flex', alignItems: 'center' }}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--cru-text-muted)',
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
                color: 'var(--cru-text-muted)',
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
            color: 'var(--cru-text, #062A77)',
            marginBottom: '0.65rem'
          }}
        >
          {post.titulo}
        </h3>

        <p
          style={{
            fontSize: '0.925rem',
            lineHeight: 1.6,
            color: 'var(--cru-text-secondary, #334155)',
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
          borderBottom: '1px solid var(--cru-border, #E2E8F0)',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)', marginRight: '0.25rem' }}>
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
            transition: 'var(--transition-smooth)'
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
            transition: 'var(--transition-smooth)'
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
            transition: 'var(--transition-smooth)'
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
              transition: 'var(--transition-smooth)'
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
              transition: 'var(--transition-smooth)'
            }}
            className="hover:bg-rose-500/15"
          >
            <ThumbsDown className={`w-4 h-4 ${votoActual === 'dislike' ? 'fill-rose-400/30' : ''}`} />
            <span>{post.dislikes || 0}</span>
          </button>
        </div>

        {/* Grupo Secundario: Comentarios + Compartir + Eliminar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Botón Resumir Hilo */}
          <button
            type="button"
            onClick={handleAbrirResumenIa}
            title="Resumir este debate con IA en viñetas"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '10px',
              backgroundColor: panelIaAbierto && modoIa === 'resumen'
                ? 'rgba(56, 189, 248, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              border: panelIaAbierto && modoIa === 'resumen'
                ? '1px solid rgba(56, 189, 248, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              color: panelIaAbierto && modoIa === 'resumen' ? '#38BDF8' : '#CBD5E1',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            className="hover:bg-sky-500/10"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Resumir hilo</span>
          </button>

          {/* Botón Preguntar a la IA */}
          <button
            type="button"
            onClick={handleAbrirPreguntaIa}
            title="Preguntar a la IA cívica de Gemini sobre este debate"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '10px',
              backgroundColor: panelIaAbierto && modoIa === 'pregunta'
                ? 'rgba(168, 85, 247, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              border: panelIaAbierto && modoIa === 'pregunta'
                ? '1px solid rgba(168, 85, 247, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              color: panelIaAbierto && modoIa === 'pregunta' ? '#C084FC' : '#CBD5E1',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            className="hover:bg-purple-500/10"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Preguntar a la IA</span>
          </button>

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
              transition: 'var(--transition-smooth)'
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
              transition: 'var(--transition-smooth)'
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
                transition: 'var(--transition-smooth)'
              }}
              className="hover:bg-rose-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* PANEL DE ASISTENCIA IA DEL FORO TICO */}
      {panelIaAbierto && (
        <div
          style={{
            marginTop: '0.85rem',
            marginBottom: '0.5rem',
            padding: '1rem 1.15rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(10, 18, 38, 0.92)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            position: 'relative'
          }}
        >
          {/* Cabecera del panel de IA con distintivo visible */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.45)',
                  color: '#D8B4FE',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em'
                }}
              >
                <Sparkles className="w-3 h-3 text-purple-300" />
                Generado por IA
              </span>
              <span style={{ fontSize: '0.775rem', color: '#94A3B8' }}>
                {modoIa === 'resumen' ? 'Resumen Cívico del Debate' : 'Orientación Cívica con Gemini'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPanelIaAbierto(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Cerrar panel de IA"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Formulario de Pregunta si modo === 'pregunta' */}
          {modoIa === 'pregunta' && (
            <form onSubmit={handleEnviarPreguntaIa} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={preguntaIa}
                onChange={(e) => setPreguntaIa(e.target.value)}
                placeholder="Pregunta a la IA sobre este debate (ej: ¿Cómo presentar esto al Concejo?)..."
                maxLength={300}
                disabled={cargandoIa || !hayApiKey}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.825rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={cargandoIa || !preguntaIa.trim() || !hayApiKey}
                style={{
                  padding: '0.55rem 0.95rem',
                  borderRadius: '8px',
                  backgroundColor: '#7C3AED',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: (cargandoIa || !preguntaIa.trim() || !hayApiKey) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  opacity: (!preguntaIa.trim() || !hayApiKey) ? 0.6 : 1
                }}
              >
                {cargandoIa ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Consultar</span>
              </button>
            </form>
          )}

          {/* Estado sin API Key */}
          {!hayApiKey && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                color: '#FDE047',
                fontSize: '0.78rem'
              }}
            >
              Asistencia de IA deshabilitada temporalmente (Configure VITE_GEMINI_API_KEY en el entorno).
            </div>
          )}

          {/* Estado de carga */}
          {cargandoIa && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', color: '#C084FC', fontSize: '0.825rem' }}>
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analizando el hilo de debate cívico con Gemini...</span>
            </div>
          )}

          {/* Estado de error */}
          {errorIa && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#FCA5A5',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <span>{errorIa}</span>
              {hayApiKey && (
                <button
                  type="button"
                  onClick={modoIa === 'resumen' ? handleAbrirResumenIa : handleEnviarPreguntaIa}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'none',
                    border: 'none',
                    color: '#F87171',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reintentar
                </button>
              )}
            </div>
          )}

          {/* Resultado de la IA */}
          {respuestaIa && !cargandoIa && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#E2E8F0',
                fontSize: '0.84rem',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap'
              }}
            >
              {respuestaIa.tipo === 'pregunta' && respuestaIa.preguntaOriginal && (
                <div style={{ fontSize: '0.75rem', color: '#A78BFA', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Consulta cívica: "{respuestaIa.preguntaOriginal}"
                </div>
              )}
              <div>{respuestaIa.texto}</div>
              <div
                style={{
                  marginTop: '0.65rem',
                  paddingTop: '0.45rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.7rem',
                  color: '#94A3B8',
                  flexWrap: 'wrap',
                  gap: '0.35rem'
                }}
              >
                <span>Modelo: {respuestaIa.modelo} • {respuestaIa.latenciaMs} ms</span>
                <span style={{ fontStyle: 'italic' }}>Información orientativa cívica • Datos protegidos Ley N° 8968</span>
              </div>
            </div>
          )}
        </div>
      )}

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
