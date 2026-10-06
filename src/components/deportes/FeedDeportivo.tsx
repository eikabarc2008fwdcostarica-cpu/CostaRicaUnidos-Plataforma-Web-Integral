import React, { FC, useState } from 'react';
import { MessageSquare, Heart, ShieldAlert, Send, CheckCircle2 } from 'lucide-react';
import { PostFeedComunitario } from '../../data/deportesData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';
import { CivicButton } from '../common/CivicButton';

export interface FeedDeportivoProps {
  postsIniciales: PostFeedComunitario[];
}

export const FeedDeportivo: FC<FeedDeportivoProps> = ({ postsIniciales }) => {
  const [posts, setPosts] = useState<PostFeedComunitario[]>(postsIniciales);
  const [nuevoMensaje, setNuevoMensaje] = useState<string>('');
  const [disciplina, setDisciplina] = useState<string>('Fútbol Comunitario');
  const [distrito, setDistrito] = useState<string>('San José Centro');
  const [enviadoExitoso, setEnviadoExitoso] = useState<boolean>(false);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const nuevoPost: PostFeedComunitario = {
      id: `post-${Date.now()}`,
      autor: 'Vecino Ciudadano',
      distrito,
      disciplina,
      fecha: 'Hace un momento',
      contenido: nuevoMensaje.trim(),
      likes: 1,
      moderado: true
    };

    setPosts([nuevoPost, ...posts]);
    setNuevoMensaje('');
    setEnviadoExitoso(true);
    setTimeout(() => setEnviadoExitoso(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Formulario de Publicación Comunitaria */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderTop: '4px solid #0053AF',
          borderRadius: '16px',
          padding: '1.35rem',
          boxShadow: 'var(--shadow-card, 0 4px 20px -2px rgba(6, 42, 119, 0.06))'
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#062A77', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={18} color="#0053AF" />
              Publicar Convocatoria Deportiva Vecinal
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <ShieldAlert size={14} color="#059669" />
              Feed con moderación ética comunitaria
            </span>
          </div>

          <textarea
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Comparta un torneo relámpago, trote comunitario o actividad deportiva en su distrito..."
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              color: '#0F172A',
              fontSize: '0.875rem',
              fontFamily: "inherit",
              outline: 'none',
              resize: 'vertical',
              fontWeight: 500
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                style={{
                  background: '#F8FAFC',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <option value="Fútbol Comunitario">Fútbol</option>
                <option value="Baloncesto">Baloncesto</option>
                <option value="Atletismo & Trote">Atletismo</option>
                <option value="Ciclismo Urbano">Ciclismo</option>
                <option value="Calistenia & Fitness">Calistenia</option>
              </select>

              <select
                value={distrito}
                onChange={(e) => setDistrito(e.target.value)}
                style={{
                  background: '#F8FAFC',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <option value="San José Centro">San José Centro</option>
                <option value="San Francisco de Dos Ríos">San Francisco</option>
                <option value="Pavas">Pavas</option>
                <option value="Hatillo">Hatillo</option>
                <option value="Zapote">Zapote</option>
              </select>
            </div>

            <CivicButton type="submit" variant="primary" size="sm" leftIcon={<Send size={14} />}>
              Publicar
            </CivicButton>
          </div>

          {enviadoExitoso && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.825rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Convocatoria publicada con éxito en el feed comunitario.</span>
            </div>
          )}
        </form>
      </div>

      {/* Lista de Publicaciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-card, 0 4px 20px -2px rgba(6, 42, 119, 0.06))'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CivicBadge variant="provincial" size="sm">
                    {post.disciplina}
                  </CivicBadge>
                  <strong style={{ fontSize: '0.9rem', color: '#062A77' }}>{post.autor}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>&bull; {post.distrito}</span>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{post.fecha}</span>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.55, margin: '0.25rem 0', fontWeight: 500 }}>
                {post.contenido}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#C22727',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  <Heart size={14} fill="#C22727" />
                  <span>{post.likes} apoyos</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedDeportivo;
