import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Send,
  ThumbsUp,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Plus,
  RefreshCw
} from 'lucide-react';
import PostCard from '../foro/PostCard';
import CrearPostModal from '../foro/CrearPostModal';
import { obtenerPosts, suscribirCambiosForo } from '../../services/foroService';
import { useTheme } from '../../context/ThemeContext';
import { getProvincialTextColor } from '../../data/costaRicaTerritorialData';

/**
 * Componente Provincial: Foro y Cabildo Comunal
 * Módulo 04 — Participación Ciudadana y Consultas Vecinales
 * Conectado en tiempo real con db.json vía foroService
 */
export default function ProvinciaForo({ provincia }) {
  const { isLight } = useTheme?.() || { isLight: false };
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Mapeo del ID de provincia para la API
  const provId = (provincia.id || provincia.codigo || '').toLowerCase();

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerPosts(provId);
      setPosts(data);
    } catch (e) {
      console.error('[ProvinciaForo] Error cargando posts:', e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();

    // Sincronización en vivo
    const unsub = suscribirCambiosForo((todos) => {
      const filtrados = todos.filter(
        (p) => String(p.provinciaId || '').toLowerCase() === provId
      );
      setPosts(filtrados);
    });

    return () => unsub();
  }, [provId]);

  const handlePostActualizado = (actualizado) => {
    setPosts((prev) =>
      prev.map((p) => (String(p.id) === String(actualizado.id) ? actualizado : p))
    );
  };

  const handlePostEliminado = (id) => {
    setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const handlePostCreado = (nuevo) => {
    setPosts((prev) => [nuevo, ...prev]);
  };

  const purpleAccent = isLight ? '#7E22CE' : '#C084FC';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Encabezado del Módulo de Foro Provincial */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--cru-border)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: purpleAccent
            }}
          >
            <MessageSquare size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: purpleAccent,
                  fontFamily: 'monospace'
                }}
              >
                M04 • CABILDO DIGITAL & PARTICIPACIÓN
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--cru-chip-bg)',
                  color: 'var(--cru-chip-text)',
                  border: '1px solid var(--cru-chip-border)'
                }}
              >
                {provincia.cantonesCount} Cantones Conectados
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cru-text)', margin: '2px 0 0 0' }}>
              Foro Ciudadano y Consultas Comunitarias — {provincia.nombre}
            </h3>
          </div>
        </div>

        {/* Acciones y Métricas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              backgroundColor: isLight ? '#9333EA' : '#A855F7',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="hover:opacity-90 active:scale-95"
          >
            <Plus size={15} />
            <span>Publicar en {provincia.nombre}</span>
          </button>

          <Link
            to="/foro"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'var(--cru-surface-muted)',
              border: '1px solid var(--cru-border)',
              color: 'var(--cru-accent-sky)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
            className="hover:opacity-90"
          >
            <span>Ver Foro Nacional</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Banner Informativo del Alcance Provincial */}
      <div
        style={{
          padding: '0.85rem 1.15rem',
          borderRadius: '12px',
          backgroundColor: isLight ? 'rgba(168, 85, 247, 0.08)' : 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={18} color={purpleAccent} />
          <span style={{ fontSize: '0.825rem', color: 'var(--cru-text)' }}>
            Las publicaciones en este espacio pertenecen a <strong>{provincia.nombre}</strong> y se sincronizan automáticamente con el feed del <strong>Foro Nacional</strong>.
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: purpleAccent, fontWeight: 700 }}>
          {posts.length} {posts.length === 1 ? 'debate registrado' : 'debates registrados'}
        </span>
      </div>

      {/* Listado de Publicaciones Reales de la Provincia */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {cargando ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--cru-text-soft)' }}>
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
            <p style={{ fontSize: '0.85rem' }}>Cargando propuestas de {provincia.nombre}...</p>
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--cru-surface-muted)',
              border: '1px dashed var(--cru-border)',
              borderRadius: '14px'
            }}
          >
            <MessageSquare size={36} color={isLight ? '#64748B' : '#94A3B8'} style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontSize: '1rem', color: 'var(--cru-text)', fontWeight: 700, margin: '0 0 0.35rem 0' }}>
              Sin debates abiertos en {provincia.nombre}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--cru-text-soft)', margin: '0 0 1rem 0' }}>
              Sé el primero en plantear una iniciativa vecinal ante el Concejo Municipal y la comunidad.
            </p>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                backgroundColor: isLight ? '#9333EA' : '#A855F7',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Iniciar Propuesta</span>
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onActualizado={handlePostActualizado}
              onEliminado={handlePostEliminado}
            />
          ))
        )}
      </div>

      {/* Modal de Creación */}
      <CrearPostModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onPostCreado={handlePostCreado}
        provinciaInicial={provId}
      />
    </div>
  );
}
