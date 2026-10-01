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

/**
 * Componente Provincial: Foro y Cabildo Comunal
 * Módulo 04 — Participación Ciudadana y Consultas Vecinales
 * Conectado en tiempo real con db.json vía foroService
 */
export default function ProvinciaForo({ provincia }) {
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C084FC'
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
                  color: '#C084FC',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#CBD5E1',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {provincia.cantonesCount} Cantones Conectados
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0 0' }}>
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
              backgroundColor: '#A855F7',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-purple-600 active:scale-95"
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
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#38BDF8',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
            className="hover:bg-white/10"
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
          backgroundColor: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={18} color="#C084FC" />
          <span style={{ fontSize: '0.825rem', color: '#E2E8F0' }}>
            Las publicaciones en este espacio pertenecen a <strong>{provincia.nombre}</strong> y se sincronizan automáticamente con el feed del <strong>Foro Nacional</strong>.
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#A855F7', fontWeight: 700 }}>
          {posts.length} {posts.length === 1 ? 'debate registrado' : 'debates registrados'}
        </span>
      </div>

      {/* Listado de Publicaciones Reales de la Provincia */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {cargando ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
            <p style={{ fontSize: '0.85rem' }}>Cargando propuestas de {provincia.nombre}...</p>
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '14px'
            }}
          >
            <MessageSquare size={36} color="#64748B" style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 700, margin: '0 0 0.35rem 0' }}>
              Sin debates abiertos en {provincia.nombre}
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#94A3B8', margin: '0 0 1rem 0' }}>
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
                backgroundColor: '#A855F7',
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
