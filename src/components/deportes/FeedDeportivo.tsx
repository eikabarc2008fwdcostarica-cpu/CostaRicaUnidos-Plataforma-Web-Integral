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
      <CivicCard level={1}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={18} color="#7DD3FC" />
              Publicar Convocatoria Deportiva Vecinal
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={14} color="#34D399" />
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
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontFamily: "var(--font-body, sans-serif)",
              outline: 'none',
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                style={{
                  background: 'rgba(0, 4, 13, 0.85)',
                  color: '#CBD5E1',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.8rem'
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
                  background: 'rgba(0, 4, 13, 0.85)',
                  color: '#CBD5E1',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.8rem'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6EE7B7', fontSize: '0.825rem' }}>
              <CheckCircle2 size={16} />
              <span>Convocatoria publicada con éxito en el feed comunitario.</span>
            </div>
          )}
        </form>
      </CivicCard>

      {/* Lista de Publicaciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map((post) => (
          <CivicCard key={post.id} level={1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CivicBadge variant="provincial" size="sm">
                    {post.disciplina}
                  </CivicBadge>
                  <strong style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>{post.autor}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>&bull; {post.distrito}</span>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{post.fecha}</span>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0.25rem 0' }}>
                {post.contenido}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#F472B6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    fontFamily: "var(--font-telemetry, monospace)"
                  }}
                >
                  <Heart size={14} fill="#F472B6" />
                  <span>{post.likes} apoyos</span>
                </button>
              </div>
            </div>
          </CivicCard>
        ))}
      </div>
    </div>
  );
};

export default FeedDeportivo;
