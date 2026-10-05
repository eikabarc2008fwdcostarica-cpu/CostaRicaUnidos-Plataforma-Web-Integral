import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  ShieldCheck,
  AlertTriangle,
  Lock,
  Scale,
  BookOpen
} from 'lucide-react';
import PostCard from './PostCard';
import CrearPostModal from './CrearPostModal';
import ReglasComunidadModal from './ReglasComunidadModal';
import { obtenerPosts, suscribirCambiosForo } from '../../services/foroService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

// Ámbitos territoriales oficiales
export const AMBITOS_TERRITORIALES = [
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

/**
 * Normaliza nombres de provincia a los IDs oficiales del sistema
 */
export function normalizarProvinciaId(provStr) {
  if (!provStr) return '';
  const limpia = String(provStr)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

  if (limpia.includes('nacional') || limpia === 'pais' || limpia === 'todas') return 'nacional';
  if (limpia.includes('jose')) return 'san-jose';
  if (limpia.includes('alajuela')) return 'alajuela';
  if (limpia.includes('cartago')) return 'cartago';
  if (limpia.includes('heredia')) return 'heredia';
  if (limpia.includes('guanacaste')) return 'guanacaste';
  if (limpia.includes('puntarenas')) return 'puntarenas';
  if (limpia.includes('limon')) return 'limon';
  return limpia;
}

/**
 * Verifica si el usuario tiene privilegios de Super Administrador Nacional o auditoría
 */
export function esSuperAdmin(user) {
  if (!user) return false;
  const rol = String(user.rol || '').toLowerCase().trim();
  const nivel = Number(user.nivelAcceso || 0);
  return (
    nivel >= 5 ||
    rol.includes('super admin') ||
    rol.includes('superadministrador') ||
    rol.includes('auditor')
  );
}

export default function ForoTico({ initialScope = 'nacional', showHeader = true }) {
  const { user, usuarioActual } = useAuth();

  // Resolver usuario activo desde contexto o sesión persistida
  const activeUser = user || usuarioActual || (() => {
    try {
      const s = localStorage.getItem('cr_sesion_activa');
      if (s) return JSON.parse(s);
    } catch {}
    return null;
  })();

  const esAdmin = esSuperAdmin(activeUser);

  // Extraer provincia de residencia/registro del ciudadano
  const provinciaUsuarioRaw =
    activeUser?.provincia ||
    activeUser?.provinciaNombre ||
    activeUser?.provinciaId ||
    (() => {
      try {
        const c = localStorage.getItem('cr_active_canton');
        if (c) return c;
      } catch {}
      return 'San José';
    })();

  const provinciaUsuarioId = normalizarProvinciaId(provinciaUsuarioRaw) || 'san-jose';
  const provinciaUsuarioObj =
    AMBITOS_TERRITORIALES.find((a) => a.id === provinciaUsuarioId) || AMBITOS_TERRITORIALES[1];

  // =========================================================================
  // REQUERIMIENTO 1: FILTRADO DINÁMICO SEGÚN PERFIL CIUDADANO (RBAC TERRITORIAL)
  // - Rol Ciudadano: Única y estrictamente dos pestañas (Foro Nacional + Su Provincia)
  // - Super Administrador: Conserva las 8 opciones completas (Nacional + 7 Provincias)
  // =========================================================================
  const ambitosVisibles = useMemo(() => {
    if (esAdmin) {
      return AMBITOS_TERRITORIALES;
    }
    // Para ciudadanos, las restantes 6 provincias no existen en el DOM
    return [AMBITOS_TERRITORIALES[0], provinciaUsuarioObj];
  }, [esAdmin, provinciaUsuarioObj]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [alertaAccesoDenegado, setAlertaAccesoDenegado] = useState(null);

  // Determinar ámbito inicial válido respetando RBAC
  const getInitialAmbito = () => {
    const rawParam = searchParams.get('provincia') || searchParams.get('ambito');
    if (rawParam) {
      const norm = normalizarProvinciaId(rawParam);
      const permitidos = esAdmin
        ? AMBITOS_TERRITORIALES.map((a) => a.id)
        : ['nacional', provinciaUsuarioId];
      if (permitidos.includes(norm)) return norm;
    }
    if (initialScope) {
      const norm = normalizarProvinciaId(initialScope);
      const permitidos = esAdmin
        ? AMBITOS_TERRITORIALES.map((a) => a.id)
        : ['nacional', provinciaUsuarioId];
      if (permitidos.includes(norm)) return norm;
    }
    // Por defecto: Foro Nacional o su provincia autorizada
    return 'nacional';
  };

  const [ambitoActivo, setAmbitoActivo] = useState(getInitialAmbito);
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalReglasAbierto, setModalReglasAbierto] = useState(false);
  const { t } = useLanguage();

  // Filtros de búsqueda y orden
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  const [orden, setOrden] = useState('RECIENTES'); // 'RECIENTES' | 'VOTOS' | 'COMENTARIOS'

  // =========================================================================
  // REQUERIMIENTO 2: BLINDAJE CONTRA MANIPULACIÓN DE URL Y PARÁMETROS
  // Si el ciudadano intenta forzar la vista de otra provincia (?provincia=...),
  // se valida contra user.provincia y se redirige de inmediato a su ámbito autorizado.
  // =========================================================================
  useEffect(() => {
    const rawParam = searchParams.get('provincia') || searchParams.get('ambito');
    if (rawParam) {
      const norm = normalizarProvinciaId(rawParam);
      const permitidos = ambitosVisibles.map((a) => a.id);

      if (!permitidos.includes(norm)) {
        // Manipulación o acceso no autorizado interceptado
        const provUsuarioNombre = provinciaUsuarioObj?.nombre || 'su provincia asignada';
        setAlertaAccesoDenegado({
          solicitado: rawParam,
          mensaje: `Acceso restringido: Según la Ley N° 8968 y el principio de soberanía territorial, su cuenta ciudadana no tiene autorización para acceder a los foros de "${rawParam}". Se ha restablecido su navegación al ámbito autorizado (${provUsuarioNombre} y Foro Nacional).`
        });
        setAmbitoActivo(provinciaUsuarioId);
        setSearchParams({ provincia: provinciaUsuarioId }, { replace: true });
        return;
      }

      if (norm !== ambitoActivo) {
        setAmbitoActivo(norm);
      }
    }
  }, [searchParams, ambitosVisibles, provinciaUsuarioId, provinciaUsuarioObj]);

  // Si el ámbito activo no es permitido (por cambio de usuario o sesión), restablecerlo
  useEffect(() => {
    const permitidos = ambitosVisibles.map((a) => a.id);
    if (!permitidos.includes(ambitoActivo)) {
      const fallback = provinciaUsuarioId || 'nacional';
      setAmbitoActivo(fallback);
      setSearchParams({ provincia: fallback }, { replace: true });
    }
  }, [ambitosVisibles, ambitoActivo, provinciaUsuarioId]);

  // Manejador al hacer clic en una pestaña autorizada
  const handleSeleccionarAmbito = (nuevoId) => {
    setAlertaAccesoDenegado(null);
    setAmbitoActivo(nuevoId);
    setSearchParams({ provincia: nuevoId }, { replace: true });
  };

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
      setPosts(
        updatedList.filter(
          (p) => String(p.provinciaId || '').toLowerCase() === ambitoActivo.toLowerCase()
        )
      );
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
    const postProv = String(nuevoPost.provinciaId || '').toLowerCase();
    if (ambitoActivo === postProv) {
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
    ambitosVisibles.find((a) => a.id === ambitoActivo) || ambitosVisibles[0] || AMBITOS_TERRITORIALES[0];

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

            {/* Acciones Principales del Foro */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                data-tour="btn-reglas-comunidad"
                onClick={() => setModalReglasAbierto(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.35rem',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38BDF8',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                className="hover:bg-sky-500/20 hover:border-sky-400 active:scale-95"
                title="Conoce las reglas de convivencia cívica y sanciones graduales"
              >
                <Scale className="w-4 h-4 text-sky-400" />
                <span>{t('foro.reglasComunidad', 'Reglas de la Comunidad')}</span>
              </button>

              {/* Botón Principal: Nueva Publicación */}
              <button
                type="button"
                data-tour="btn-crear-post"
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
                <span>{t('foro.publicarEnForo', 'Publicar en Foro Tico')}</span>
              </button>
            </div>
          </div>

          {/* Tarjetas de Métricas Rápidas */}
          <div
            data-tour="foro-metricas"
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
                {esAdmin ? 'Cobertura Territorial' : 'Ámbito Autorizado'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FACC15', marginTop: '0.25rem' }}>
                {esAdmin ? '7 Provincias + Nacional' : `${provinciaUsuarioObj?.nombre || 'Provincia'} + Nacional`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALERTA DE ACCESO TERRITORIAL RESTRINGIDO / CORREGIDO POR RBAC */}
      {alertaAccesoDenegado && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.1rem 1.35rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 8px 25px -5px rgba(245, 158, 11, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FCD34D', marginBottom: '0.25rem' }}>
                Segmentación Territorial RBAC (Ley N° 8968)
              </div>
              <div style={{ fontSize: '0.84rem', color: '#FEF3C7', lineHeight: 1.5 }}>
                {alertaAccesoDenegado.mensaje}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAlertaAccesoDenegado(null)}
            style={{
              background: 'rgba(245, 158, 11, 0.18)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#FDE68A',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
              borderRadius: '8px',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
            className="hover:bg-amber-400/30 active:scale-95"
          >
            Entendido
          </button>
        </div>
      )}

      {/* 2. SELECTOR DE ÁMBITO TERRITORIAL (SEGMENTACIÓN DINÁMICA POR ROL) */}
      <div data-tour="selector-ambito-territorial">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <MapPin className="w-4 h-4 text-sky-400" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
              Ámbito Territorial del Debate
            </h2>
            {!esAdmin && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#38BDF8',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '2px 9px',
                  borderRadius: '9999px'
                }}
              >
                <Lock className="w-3 h-3" />
                Segregación RBAC: 2 Foros ({provinciaUsuarioObj?.nombre} & Nacional)
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            {esAdmin
              ? 'Supervisión completa: 7 Provincias + Nacional'
              : `Espacios cívicos exclusivos para residentes de ${provinciaUsuarioObj?.nombre || 'Costa Rica'}`}
          </span>
        </div>

        {/* Barra deslizante / botones de ámbito con adaptación visual para 2 opciones */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              ambitosVisibles.length <= 2
                ? 'repeat(auto-fit, minmax(260px, 1fr))'
                : 'repeat(auto-fill, minmax(135px, 1fr))',
            maxWidth: ambitosVisibles.length <= 2 ? '680px' : '100%',
            gap: ambitosVisibles.length <= 2 ? '0.85rem' : '0.65rem'
          }}
        >
          {ambitosVisibles.map((amb) => {
            const esActivo = ambitoActivo === amb.id;
            const IconoAmb = amb.icono;

            return (
              <button
                key={amb.id}
                type="button"
                onClick={() => handleSeleccionarAmbito(amb.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: ambitosVisibles.length <= 2 ? '1.1rem 1.35rem' : '0.85rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: esActivo ? amb.bg : 'rgba(15, 23, 42, 0.75)',
                  border: esActivo ? `2px solid ${amb.border}` : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'left',
                  boxShadow: esActivo ? `0 8px 24px -4px ${amb.bg}` : 'none',
                  position: 'relative'
                }}
                className={esActivo ? 'scale-[1.01]' : 'hover:border-white/20 hover:bg-white/[0.04]'}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconoAmb className="w-4 h-4" style={{ color: esActivo ? amb.color : '#94A3B8' }} />
                    <span
                      style={{
                        fontSize: ambitosVisibles.length <= 2 ? '0.98rem' : '0.85rem',
                        fontWeight: 700,
                        color: esActivo ? '#FFFFFF' : '#CBD5E1'
                      }}
                    >
                      {amb.nombre}
                    </span>
                  </div>

                  {esActivo && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        color: amb.color,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${amb.border}`,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Activo
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: ambitosVisibles.length <= 2 ? '0.78rem' : '0.7rem',
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
        <div data-tour="buscador-foro" style={{ position: 'relative', flex: '1 1 260px' }}>
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

          {/* Botón Acceso Rápido Reglas */}
          <button
            type="button"
            onClick={() => setModalReglasAbierto(true)}
            title="Ver Reglas de la Comunidad"
            style={{
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38BDF8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-sky-500/20 hover:text-white"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reglas</span>
          </button>

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
      <div data-tour="feed-publicaciones-foro" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

      {/* Modal Público de Reglas de la Comunidad y Sanciones */}
      <ReglasComunidadModal
        isOpen={modalReglasAbierto}
        onClose={() => setModalReglasAbierto(false)}
      />
    </section>
  );
}
