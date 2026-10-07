import React, { useState } from 'react';
import { MessageSquare, Send, User, Clock, CheckCircle2, AlertCircle, ShieldCheck, Scale, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { agregarComentario } from '../../services/foroService';
import { obtenerNombrePublico } from '../../utils/privacyUtils';
import { VERSION_REGLAS_FORO, haAceptadoReglas, registrarAceptacionReglas } from '../../config/reglasForo';
import { inspeccionarContenidoForo } from '../../services/moderacionForoService';
import { enviarAModeracionN8n } from '../../services/n8nModeracionService';
import ReglasComunidadModal from './ReglasComunidadModal';
import IncidenteModeracionModal from './IncidenteModeracionModal';
import PerfilPublicoModal from '../perfil/PerfilPublicoModal';

/**
 * Formatea una fecha ISO o relativa de manera amigable
 */
function formatearFechaComentario(fechaIso) {
  if (!fechaIso) return 'Reciente';
  try {
    const fecha = new Date(fechaIso);
    if (isNaN(fecha.getTime())) return String(fechaIso);

    const diffSeg = Math.floor((Date.now() - fecha.getTime()) / 1000);
    if (diffSeg < 60) return 'Hace un momento';
    const diffMin = Math.floor(diffSeg / 60);
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 7) return `Hace ${diffDias} d`;

    return fecha.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Reciente';
  }
}

export default function ComentariosSection({ post, onPostActualizado }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [contenido, setContenido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [exitoMsg, setExitoMsg] = useState(false);
  const [perfilModalAutor, setPerfilModalAutor] = useState(null);
  const [modalReglasAbierto, setModalReglasAbierto] = useState(false);
  const [aceptoReglas, setAceptoReglas] = useState(() => haAceptadoReglas(user));
  const [modalIncidenteAbierto, setModalIncidenteAbierto] = useState(false);
  const [incidenteData, setIncidenteData] = useState(null);

  // Datos del autor (Ley N° 8968: Se sanitiza el nombre público a Primer Nombre y Primer Apellido)
  const autorNombre = user?.nombre || 'Ciudadano Activo';
  const nombrePublicoAutor = obtenerNombrePublico(autorNombre);
  const autorCedula = user?.cedula || '1-1823-0456';

  const comentarios = Array.isArray(post.comentarios) ? post.comentarios : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) {
      setErrorMsg('Por favor escribe tu comentario o propuesta.');
      return;
    }

    if (!aceptoReglas) {
      setErrorMsg(t('foro.errorAceptarReglasComentario', 'Debe leer y aceptar las Reglas de la Comunidad antes de participar en los comentarios.'));
      return;
    }

    try {
      setEnviando(true);
      setErrorMsg('');

      // Registrar aceptación formal en el usuario si aún no estaba persistida
      if (!haAceptadoReglas(user)) {
        await registrarAceptacionReglas(user);
      }

      // =====================================================================
      // SUPERVISOR IA DEL FORO TICO: INSPECCIÓN PRE-PUBLICACIÓN (M04)
      // =====================================================================
      const resultadoInsp = await inspeccionarContenidoForo({
        titulo: '',
        contenido: contenido.trim(),
        autor: user,
        tipo: 'comentario'
      });

      if (resultadoInsp.bloqueado) {
        setIncidenteData(resultadoInsp);
        setModalIncidenteAbierto(true);
        setEnviando(false);
        return;
      }

      const comentarioData = {
        autorNombre: nombrePublicoAutor,
        autorCedula,
        contenido: contenido.trim()
      };

      const updatedPost = await agregarComentario(post.id, comentarioData);
      setContenido('');
      setExitoMsg(true);
      setTimeout(() => setExitoMsg(false), 2500);

      // =====================================================================
      // CAPA COMPLEMENTARIA N8N: BLINDAJE LEY N.º 8968 Y AUDITORÍA CÍVICA
      // No bloqueante para el comentario en la interfaz
      // =====================================================================
      const nuevoComentario = (updatedPost?.comentarios || []).slice(-1)[0] || {};
      enviarAModeracionN8n({
        tipo: 'comentario',
        id: nuevoComentario.id || `com-${Date.now()}`,
        postId: post.id,
        texto: contenido.trim(),
        autorId: user?.id || 'USR-ANON',
        rolAutor: user?.rol || 'Ciudadano',
        ambito: post.provinciaId === 'nacional' ? 'nacional' : 'provincial',
        provincia: post.provinciaNombre || 'San José',
        canton: user?.canton || 'San José',
        momento: 'post'
      }).then((resN8n) => {
        if (!resN8n || resN8n.omitido) return;
        if (resN8n.estado === 'oculto') {
          console.warn('[n8n] Comentario ocultado preventivamente por auditoría n8n.');
          const comentariosFiltrados = (updatedPost.comentarios || []).filter(
            (c) => c.id !== nuevoComentario.id
          );
          if (onPostActualizado) {
            onPostActualizado({ ...updatedPost, comentarios: comentariosFiltrados });
          }
        } else if (resN8n.avisoPrivacidad && resN8n.textoFinal) {
          console.info('[n8n] Datos personales en comentario protegidos bajo Ley N.º 8968.');
          const comentariosModificados = (updatedPost.comentarios || []).map((c) =>
            c.id === nuevoComentario.id ? { ...c, contenido: resN8n.textoFinal } : c
          );
          if (onPostActualizado) {
            onPostActualizado({ ...updatedPost, comentarios: comentariosModificados });
          }
        }
      }).catch((err) => {
        console.error('[n8n] Error no bloqueante en auditoría de comentario:', err);
      });

      if (onPostActualizado) {
        onPostActualizado(updatedPost);
      }
    } catch (err) {
      console.error('Error al comentar:', err);
      setErrorMsg('No se pudo guardar el comentario en el servidor. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      style={{
        marginTop: '1.25rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Título de la sección de comentarios */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cru-border)' }}>
            Aportes y Respuestas Ciudadanas ({comentarios.length})
          </span>
        </div>
      </div>

      {/* Listado de comentarios existentes */}
      {comentarios.length === 0 ? (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}
        >
          <p style={{ fontSize: '0.85rem', color: 'var(--cru-text-muted)', margin: 0 }}>
            Aún no hay comentarios en este debate. Sé el primero en aportar una propuesta u opinión comunal.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {comentarios.map((c, idx) => (
            <div
              key={c.id || idx}
              style={{
                padding: '0.9rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                  onClick={() => setPerfilModalAutor(c.autorNombre || 'Ciudadano')}
                  title="Ver perfil cívico público protegido (Ley N° 8968)"
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38BDF8',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {obtenerNombrePublico(c.autorNombre).charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F1F5F9' }}>
                    {obtenerNombrePublico(c.autorNombre)}
                  </span>
                  <span title="Ciudadano Verificado" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--cru-text-muted)', fontSize: '0.75rem' }}>
                  <Clock className="w-3 h-3" />
                  <span>{formatearFechaComentario(c.fecha)}</span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: 'var(--cru-border-strong)',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {c.contenido}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar nuevo comentario */}
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={contenido}
            onChange={(e) => {
              setContenido(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder={`Aporta a este debate cívico como ${nombrePublicoAutor}...`}
            rows={2}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              resize: 'vertical',
              minHeight: '64px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Aceptación y enlace a Reglas de la Comunidad */}
        <div style={{ marginTop: '0.45rem' }}>
          {!haAceptadoReglas(user) ? (
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                color: 'var(--cru-border-strong)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}
            >
              <input
                type="checkbox"
                id="chk-acepto-reglas-comentario"
                checked={aceptoReglas}
                onChange={(e) => setAceptoReglas(e.target.checked)}
                style={{
                  width: '15px',
                  height: '15px',
                  marginTop: '1px',
                  accentColor: '#0284C7',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                required
              />
              <span>
                He leído y acepto las{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalReglasAbierto(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#38BDF8',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                  className="hover:text-sky-300"
                >
                  Reglas de la Comunidad
                </button>{' '}
                (crítica constructiva permitida, cero insultos o acoso).
              </span>
            </label>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setModalReglasAbierto(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--cru-text-muted)',
                  fontSize: '0.72rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                className="hover:text-sky-400"
              >
                <BookOpen className="w-3 h-3" />
                <span>Ver Reglas de la Comunidad</span>
              </button>
            </div>
          )}
        </div>

        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.4rem',
              color: '#F43F5E',
              fontSize: '0.75rem'
            }}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {exitoMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.4rem',
              color: '#10B981',
              fontSize: '0.75rem'
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Comentario publicado en db.json correctamente.</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.6rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)' }}>
            Comentando como: <strong style={{ color: '#38BDF8' }}>{nombrePublicoAutor}</strong> <span style={{ opacity: 0.7 }}>(Identidad protegida · Ley N° 8968)</span>
          </span>

          <button
            type="submit"
            disabled={enviando || !contenido.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              borderRadius: '10px',
              backgroundColor: !contenido.trim() ? 'rgba(56, 189, 248, 0.2)' : '#0284C7',
              color: '#FFFFFF',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: enviando || !contenido.trim() ? 'not-allowed' : 'pointer',
              transition: 'var(--transition-smooth)',
              opacity: enviando ? 0.7 : 1
            }}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{enviando ? 'Publicando...' : 'Comentar'}</span>
          </button>
        </div>
      </form>

      {/* Modal de Perfil Público Protegido */}
      {perfilModalAutor && (
        <PerfilPublicoModal
          isOpen={Boolean(perfilModalAutor)}
          onClose={() => setPerfilModalAutor(null)}
          autorNombre={perfilModalAutor}
        />
      )}

      {/* Modal de Reglas de la Comunidad */}
      <ReglasComunidadModal
        isOpen={modalReglasAbierto}
        onClose={() => setModalReglasAbierto(false)}
        onAceptar={() => {
          setAceptoReglas(true);
          setModalReglasAbierto(false);
        }}
      />

      {/* Modal Informativo de Incidente de Moderación */}
      <IncidenteModeracionModal
        isOpen={modalIncidenteAbierto}
        onClose={() => {
          setModalIncidenteAbierto(false);
          setIncidenteData(null);
        }}
        resultadoModeracion={incidenteData?.resultadoModeracion}
        sancion={incidenteData?.sancion}
        incidenteId={incidenteData?.incidenteId}
        esPersonalExento={incidenteData?.esPersonalExento}
        onVerReglas={() => {
          setModalIncidenteAbierto(false);
          setModalReglasAbierto(true);
        }}
      />
    </div>
  );
}
