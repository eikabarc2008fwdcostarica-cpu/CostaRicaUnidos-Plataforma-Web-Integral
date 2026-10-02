import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Globe,
  MapPin,
  TrendingUp,
  Award,
  Vote,
  Users,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import PostCard from './PostCard';
import CrearPostModal from './CrearPostModal';
import { obtenerPosts, suscribirCambiosForo } from '../../services/foroService';

// Ámbitos territoriales oficiales
const AMBITOS_TERRITORIALES = [
  {
    id: 'nacional',
    nombre: 'Foro Nacional',
    subtitulo: 'Todo el Territorio (84 Cantones)',
    icono: Globe,
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.15)',
    border: 'rgba(56, 189, 248, 0.35)'
  },
  {
    id: 'san-jose',
    nombre: 'San José',
    subtitulo: '20 Cantones',
    icono: MapPin,
    color: '#C084FC',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.35)'
  },
  {
    id: 'alajuela',
    nombre: 'Alajuela',
    subtitulo: '16 Cantones',
    icono: MapPin,
    color: '#F87171',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.35)'
  },
  {
    id: 'cartago',
    nombre: 'Cartago',
    subtitulo: '8 Cantones',
    icono: MapPin,
    color: '#38BDF8',
    bg: 'rgba(14, 165, 233, 0.15)',
    border: 'rgba(14, 165, 233, 0.35)'
  },
  {
    id: 'heredia',
    nombre: 'Heredia',
    subtitulo: '10 Cantones',
    icono: MapPin,
    color: '#FACC15',
    bg: 'rgba(234, 179, 8, 0.15)',
    border: 'rgba(234, 179, 8, 0.35)'
  },
  {
    id: 'guanacaste',
    nombre: 'Guanacaste',
    subtitulo: '11 Cantones',
    icono: MapPin,
    color: '#FB923C',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.35)'
  },
  {
    id: 'puntarenas',
    nombre: 'Puntarenas',
    subtitulo: '13 Cantones',
    icono: MapPin,
    color: '#2DD4BF',
    bg: 'rgba(20, 184, 166, 0.15)',
    border: 'rgba(20, 184, 166, 0.35)'
  },
  {
    id: 'limon',
    nombre: 'Limón',
    subtitulo: '6 Cantones',
    icono: MapPin,
    color: '#34D399',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)'
  }
];

export default function ForoTico({ initialScope = 'nacional', showHeader = true }) {
  // Estado del ámbito activo: 'nacional' o provincia específica
  const [ambitoActivo, setAmbitoActivo] = useState(initialScope);
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);

  // Filtros de búsqueda y orden
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  const [orden, setOrden] = useState('RECIENTES'); // 'RECIENTES' | 'VOTOS' | 'COMENTARIOS'

  // Sincronizar ámbito inicial si cambia desde props
  useEffect(() => {
    if (initialScope) {
      setAmbitoActivo(initialScope);
    }
  }, [initialScope]);

  // Cargar publicaciones desde el servidor API (db.json)
  const cargarPosts = async (scope) => {
    try {
      setCargando(true);
      const data = await obtenerPosts(scope);
      setPosts(data);
    } catch (err) {
      console.error('Error cargando posts del foro:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPosts(ambitoActivo);

    // Suscripción reactiva para cambios en tiempo real
    const unsubscribe = suscribirCambiosForo((updatedList) => {
      if (ambitoActivo === 'nacional') {
        setPosts(updatedList);
      } else {
        setPosts(
          updatedList.filter(
            (p) => String(p.provinciaId || '').toLowerCase() === ambitoActivo.toLowerCase()
          )
        );
      }
    });

    return () => unsubscribe();
  }, [ambitoActivo]);

  // Conteo de publicaciones por ámbito
  const conteoPorAmbito = useMemo(() => {
    const mapa = { nacional: 0 };
    AMBITOS_TERRITORIALES.forEach((a) => {
      mapa[a.id] = 0;
    });

    posts.forEach((p) => {
      mapa.nacional = (mapa.nacional || 0) + 1;
      const pid = String(p.provinciaId || '').toLowerCase();
      if (mapa[pid] !== undefined) {
        mapa[pid] += 1;
      }
    });

    return mapa;
  }, [posts]);

  // Manejo de actualización de un post individual (voto, reacción, comentario)
  const handlePostActualizado = (postActualizado) => {
    setPosts((prev) =>
      prev.map((p) => (String(p.id) === String(postActualizado.id) ? postActualizado : p))
    );
  };

  // Manejo de eliminación de un post
  const handlePostEliminado = (postId) => {
    setPosts((prev) => prev.filter((p) => String(p.id) !== String(postId)));
  };

  // Manejo de post nuevo creado
  const handlePostCreado = (nuevoPost) => {
    // Si estamos en nacional o en la provincia del nuevo post, lo agregamos al inicio
    const postProv = String(nuevoPost.provinciaId || '').toLowerCase();
    if (ambitoActivo === 'nacional' || ambitoActivo === postProv) {
      setPosts((prev) => [nuevoPost, ...prev]);
    }
  };

  // Filtrado y Ordenamiento
  const postsFiltrados = useMemo(() => {
    return posts
      .filter((post) => {
        // Filtro por búsqueda textual
        if (busqueda.trim()) {
          const q = busqueda.toLowerCase().trim();
          const matchTitulo = (post.titulo || '').toLowerCase().includes(q);
          const matchContenido = (post.contenido || '').toLowerCase().includes(q);
          const matchAutor = (post.autorNombre || '').toLowerCase().includes(q);
          const matchProv = (post.provinciaNombre || '').toLowerCase().includes(q);
          if (!matchTitulo && !matchContenido && !matchAutor && !matchProv) return false;
        }

        // Filtro por categoría temática
        if (categoriaFiltro !== 'TODAS') {
          if (post.categoria !== categoriaFiltro) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (orden === 'VOTOS') {
          return (b.likes || 0) - (a.likes || 0);
        }
        if (orden === 'COMENTARIOS') {
          const comA = Array.isArray(a.comentarios) ? a.comentarios.length : 0;
          const comB = Array.isArray(b.comentarios) ? b.comentarios.length : 0;
          return comB - comA;
        }
        // Por defecto: 'RECIENTES'
        return new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime();
      });
  }, [posts, busqueda, categoriaFiltro, orden]);

  // Métricas globales del foro
  const metricas = useMemo(() => {
    const totalPosts = posts.length;
    let totalLikes = 0;
    let totalComentarios = 0;

    posts.forEach((p) => {
      totalLikes += p.likes || 0;
      if (Array.isArray(p.comentarios)) {
        totalComentarios += p.comentarios.length;
      }
    });

    return { totalPosts, totalLikes, totalComentarios };
  }, [posts]);

  // Ámbito actual
  const ambitoActualObj =
    AMBITOS_TERRITORIALES.find((a) => a.id === ambitoActivo) || AMBITOS_TERRITORIALES[0];

  return (
    <section
      aria-label="Módulo 04: Foro Tico y Participación Ciudadana"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* 1. ENCABEZADO PRINCIPAL (SI showHeader ES VERDADERO) */}
      {showHeader && (
        <div
          style={{
            backgroundColor: '#070D1B',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '2.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Resplandor decorativo cívico */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    color: '#38BDF8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  M04 · PARTICIPACIÓN CIUDADANA Y DEBATE CÍVICO
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Persistencia Real en db.json
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  margin: '0 0 0.5rem 0',
                  letterSpacing: '-0.02em'
                }}
              >
                Foro Tico Soberano
              </h1>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  color: '#94A3B8',
                  maxWidth: '720px',
                  margin: 0
                }}
              >
                Plataforma de deliberación cívica y comunitaria organizada a nivel nacional y provincial.
                Expresa propuestas vecinales, participa en votaciones vinculantes y debate con vecinos de todo el país.
              </p>
            </div>

            {/* Botón Principal: Nueva Publicación */}
            <button
              type="button"
              onClick={() => setModalCrearAbierto(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '14px',
                backgroundColor: '#0284C7',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.5)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              className="hover:bg-sky-500 hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Publicar en Foro Tico</span>
            </button>
          </div>

          {/* Tarjetas de Métricas Rápidas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                Iniciativas Activas
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38BDF8', marginTop: '0.25rem' }}>
                {metricas.totalPosts}
              </div>
            </div>

            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                Votos Ciudadanos
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34D399', marginTop: '0.25rem' }}>
                {metricas.totalLikes}
              </div>
            </div>

            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                Comentarios & Debates
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C084FC', marginTop: '0.25rem' }}>
                {metricas.totalComentarios}
              </div>
            </div>

            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                Cobertura Territorial
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FACC15', marginTop: '0.25rem' }}>
                7 Provincias + Nacional
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SELECTOR DE ÁMBITO TERRITORIAL (NACIONAL + 7 PROVINCIAS) */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin className="w-4 h-4 text-sky-400" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
              Ámbito Territorial del Debate
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Selecciona para segmentar la conversación cívica
          </span>
        </div>

        {/* Barra deslizante / botones de ámbito */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
            gap: '0.65rem'
          }}
        >
          {AMBITOS_TERRITORIALES.map((amb) => {
            const esActivo = ambitoActivo === amb.id;
            const IconoAmb = amb.icono;

            return (
              <button
                key={amb.id}
                type="button"
                onClick={() => setAmbitoActivo(amb.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  backgroundColor: esActivo ? amb.bg : 'rgba(15, 23, 42, 0.7)',
                  border: esActivo ? `1.5px solid ${amb.border}` : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  boxShadow: esActivo ? `0 4px 15px ${amb.bg}` : 'none'
                }}
                className={esActivo ? '' : 'hover:border-white/20 hover:bg-white/[0.04]'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', marginBottom: '0.35rem' }}>
                  <IconoAmb className="w-4 h-4" style={{ color: esActivo ? amb.color : '#94A3B8' }} />
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: esActivo ? '#FFFFFF' : '#CBD5E1'
                    }}
                  >
                    {amb.nombre}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: esActivo ? amb.color : '#64748B',
                    fontWeight: 500
                  }}
                >
                  {amb.subtitulo}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BARRA DE HERRAMIENTAS: BÚSQUEDA, CATEGORÍA Y ORDEN */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          backgroundColor: '#070D1B',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Buscador de texto */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search
            className="w-4 h-4 text-slate-400"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={`Buscar en ${ambitoActualObj.nombre}...`}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.4rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filtro por Categoría Temática */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              fontSize: '0.825rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TODAS" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Todas las Categorías
            </option>
            <option value="Infraestructura & Movilidad" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Infraestructura & Movilidad
            </option>
            <option value="Seguridad Ciudadana" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Seguridad Ciudadana
            </option>
            <option value="Medio Ambiente & Recursos Hídricos" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Medio Ambiente & Agua
            </option>
            <option value="Servicios Municipales" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Servicios Municipales
            </option>
            <option value="Cultura, Deportes & Juventud" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Cultura & Deportes
            </option>
            <option value="Desarrollo Rural & Sostenibilidad" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Desarrollo Rural
            </option>
            <option value="Gobernanza & Presupuesto" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
              Gobernanza & Presupuesto
            </option>
          </select>

          {/* Selector de Orden */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#CBD5E1',
                fontSize: '0.825rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="RECIENTES" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                Más Recientes
              </option>
              <option value="VOTOS" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                Más Votados
              </option>
              <option value="COMENTARIOS" style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                Más Comentados
              </option>
            </select>
          </div>

          {/* Botón Refrescar */}
          <button
            type="button"
            onClick={() => cargarPosts(ambitoActivo)}
            title="Refrescar publicaciones"
            style={{
              padding: '0.65rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. FEED DE PUBLICACIONES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {cargando && posts.length === 0 ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: '#070D1B',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-3" />
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Cargando debates cívicos desde db.json...
            </p>
          </div>
        ) : postsFiltrados.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              backgroundColor: '#070D1B',
              borderRadius: '16px',
              border: '1px dashed rgba(255, 255, 255, 0.15)'
            }}
          >
            <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              No se encontraron publicaciones en {ambitoActualObj.nombre}
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              {busqueda || categoriaFiltro !== 'TODAS'
                ? 'Prueba modificando tus términos de búsqueda o filtros temáticos.'
                : `Aún no hay propuestas registradas para ${ambitoActualObj.nombre}. ¡Sé el primero en iniciar un debate vecinal!`}
            </p>

            <button
              type="button"
              onClick={() => setModalCrearAbierto(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: '#0284C7',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              className="hover:bg-sky-500"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Propuesta en {ambitoActualObj.nombre}</span>
            </button>
          </div>
        ) : (
          postsFiltrados.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onActualizado={handlePostActualizado}
              onEliminado={handlePostEliminado}
            />
          ))
        )}
      </div>

      {/* Modal para Crear Publicación */}
      <CrearPostModal
        isOpen={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        onPostCreado={handlePostCreado}
        provinciaInicial={ambitoActivo === 'nacional' ? 'nacional' : ambitoActivo}
      />
    </section>
  );
}
