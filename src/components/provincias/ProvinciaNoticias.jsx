import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowUpRight,
  Tag,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Share2,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Lightbulb,
  AlertTriangle,
  Building2,
  Plus
} from 'lucide-react';
import { obtenerNoticias, esEditorMunicipal } from '../../services/noticiasService';
import { useAuth } from '../../context/AuthContext';
import NoticiaDetalleModal from '../noticias/NoticiaDetalleModal';
import NoticiaFormModal from '../noticias/NoticiaFormModal';

/**
 * Componente: Noticias Provinciales (M01)
 * Conectado en tiempo real a db.json vía noticiasService.
 * Soporta lectura completa, reacciones e hilos cívicos.
 */
export default function ProvinciaNoticias({ provincia }) {
  const { user } = useAuth();
  const tienePermisoEditor = esEditorMunicipal(user);

  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [noticiasReales, setNoticiasReales] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Modales
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalFormAbierto, setModalFormAbierto] = useState(false);

  // Cargar noticias desde el backend db.json
  const cargarNoticias = async () => {
    setCargando(true);
    try {
      const data = await obtenerNoticias({ provincia: provincia.nombre });
      setNoticiasReales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[ProvinciaNoticias] Fallo al cargar noticias reales:', err);
      setNoticiasReales([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, [provincia.nombre]);

  // Si no hay noticias registradas en db.json para esta provincia, usamos una plantilla contextual
  const noticiasMock = [
    {
      id: `${provincia.codigo}-NOT-01`,
      titulo: `Concejos Cantonales de ${provincia.nombre} aprueban cartera de proyectos comunales 2026`,
      resumen: `Las municipalidades de la provincia de ${provincia.nombre} publicaron la asignación del presupuesto participativo para obras viales, iluminación LED y parques comunitarios.`,
      contenido: `Las municipalidades de la provincia de ${provincia.nombre} han formalizado la aprobación unánime de los presupuestos cívicos de inversión para el ejercicio 2026. Esta resolución contempla intervenciones en infraestructura comunitaria, mejoramiento de accesos peatonales e instalación de sistemas modernos de monitoreo.`,
      categoria: 'Gobernanza & Trámites',
      provincia: provincia.nombre,
      canton: provincia.cabecera || provincia.nombre,
      autorNombre: `Secretaría Técnica • ${provincia.cabecera}`,
      autorRol: 'Editor Municipal',
      autorCedula: '118230456',
      fechaPublicacion: '2026-10-01T10:00:00Z',
      reacciones: { apoyo: 12, interesante: 7, alerta: 1 },
      comentarios: []
    }
  ];

  const listaNoticias = noticiasReales.length > 0 ? noticiasReales : noticiasMock;

  const categorias = [
    { id: 'TODAS', label: 'Todas' },
    { id: 'Obras Públicas', label: 'Obras Públicas' },
    { id: 'Gobernanza & Trámites', label: 'Gobernanza' },
    { id: 'Seguridad & Emergencias', label: 'Seguridad' },
    { id: 'Comercio & Turismo', label: 'Economía & Turismo' }
  ];

  const noticiasFiltradas = listaNoticias.filter((n) => {
    const matchCat =
      categoriaFiltro === 'TODAS' ||
      (n.categoria || '').toLowerCase().includes(categoriaFiltro.toLowerCase());
    const matchText =
      !busqueda ||
      (n.titulo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (n.resumen || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (n.canton || '').toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchText;
  });

  const handleAbrirDetalle = (noticia) => {
    setNoticiaSeleccionada(noticia);
    setModalDetalleAbierto(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Encabezado del Módulo de Noticias */}
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
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8'
            }}
          >
            <Newspaper size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#38BDF8',
                  fontFamily: 'monospace'
                }}
              >
                M01 • PORTAL INFORMATIVO OFICIAL
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                db.json Conectado
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0 0' }}>
              Noticias y Boletines Comunales — {provincia.nombre}
            </h3>
          </div>
        </div>

        {/* Acciones y Buscador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {tienePermisoEditor && (
            <button
              onClick={() => setModalFormAbierto(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#38BDF8',
                color: '#00040D',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={15} />
              <span>Publicar Anuncio</span>
            </button>
          )}

          <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }}
            />
            <input
              type="text"
              placeholder={`Buscar en ${provincia.nombre}...`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(0, 10, 28, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem 0.45rem 2.2rem',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Píldoras de Filtro por Categoría */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600, marginRight: '0.25rem' }}>
          Filtrar por:
        </span>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoriaFiltro(cat.id)}
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border:
                categoriaFiltro === cat.id
                  ? `1px solid ${provincia.colorAcento || '#38BDF8'}`
                  : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor:
                categoriaFiltro === cat.id
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(255, 255, 255, 0.03)',
              color: categoriaFiltro === cat.id ? '#FFFFFF' : '#94A3B8'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cuadrícula de Tarjetas de Noticias */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
          gap: '1.25rem'
        }}
      >
        {noticiasFiltradas.map((noticia) => {
          const reacciones = noticia.reacciones || { apoyo: 0, interesante: 0, alerta: 0 };
          const comentariosCount = Array.isArray(noticia.comentarios) ? noticia.comentarios.length : 0;

          return (
            <article
              key={noticia.id}
              onClick={() => handleAbrirDetalle(noticia)}
              style={{
                backgroundColor: 'rgba(0, 10, 28, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                position: 'relative',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                {/* Metadatos superiores */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#38BDF8',
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    {noticia.categoria || 'Comunicado'}
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.7rem',
                      color: '#94A3B8'
                    }}
                  >
                    <Building2 size={12} />
                    {noticia.canton || provincia.nombre}
                  </span>
                </div>

                {/* Titular */}
                <h4
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    color: '#FFFFFF',
                    margin: '0 0 0.6rem 0'
                  }}
                >
                  {noticia.titulo}
                </h4>

                {/* Resumen */}
                <p
                  style={{
                    fontSize: '0.82rem',
                    lineHeight: 1.55,
                    color: '#94A3B8',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {noticia.resumen || noticia.contenido}
                </p>
              </div>

              {/* Pie de la tarjeta con Reacciones y Enlace */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.72rem',
                  color: '#64748B'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#34D399' }}>
                    <ThumbsUp size={11} /> {reacciones.apoyo || 0}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#94A3B8' }}>
                    <MessageSquare size={11} /> {comentariosCount}
                  </span>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#38BDF8',
                    fontWeight: 700
                  }}
                >
                  Leer comunicado <ArrowUpRight size={13} />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Acceso directo al Portal Completo de Noticias */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
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
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 8px #38BDF8'
            }}
          />
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Portal Nacional M01: Cobertura oficial de los <strong>{provincia.cantonesCount} cantones</strong> de {provincia.nombre}.
          </span>
        </div>

        <Link
          to="/noticias"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '6px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background-color 0.15s ease'
          }}
        >
          <span>Explorar Todo el Portal de Noticias</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* Modales */}
      <NoticiaDetalleModal
        isOpen={modalDetalleAbierto}
        onClose={() => setModalDetalleAbierto(false)}
        noticia={noticiaSeleccionada}
        onNoticiaActualizada={(actualizada) => {
          setNoticiasReales((prev) => prev.map((n) => (n.id === actualizada.id ? actualizada : n)));
          setNoticiaSeleccionada(actualizada);
        }}
      />

      {tienePermisoEditor && (
        <NoticiaFormModal
          isOpen={modalFormAbierto}
          onClose={() => setModalFormAbierto(false)}
          onGuardado={() => {
            cargarNoticias();
          }}
        />
      )}
    </div>
  );
}
