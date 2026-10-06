import React, { FC, useState, useEffect } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  CreditCard,
  Building,
  ThumbsUp,
  HeartHandshake,
  AlertTriangle,
  MessageSquare,
  Send,
  CheckCircle2
} from 'lucide-react';
import { ComercioPymePOI } from '../../data/comercioData';
import { CivicCard } from '../common/CivicCard';
import { CivicBadge } from '../common/CivicBadge';
import { CivicButton } from '../common/CivicButton';
import { useAuth } from '../../context/AuthContext';
import { obtenerNombrePublico } from '../../utils/privacyUtils';

export interface FichaComercioProps {
  comercio: ComercioPymePOI;
}

interface ComentarioComercio {
  id: string;
  autorNombre: string;
  contenido: string;
  fecha: string;
}

export const FichaComercio: FC<FichaComercioProps> = ({ comercio }) => {
  const { user } = useAuth();
  const wazeUrl = `https://waze.com/ul?ll=${comercio.lat},${comercio.lng}&navigate=yes`;
  const whatsappUrl = `https://wa.me/${comercio.whatsappNumero}?text=${encodeURIComponent(comercio.whatsappMensajePrellenado)}`;

  // Reacciones cívicas guardadas
  const [reacciones, setReacciones] = useState(() => {
    try {
      const stored = localStorage.getItem(`reacciones_comercio_${comercio.id}`);
      return stored ? JSON.parse(stored) : { apoyo: 12, recomiendo: 8, alerta: 0 };
    } catch {
      return { apoyo: 12, recomiendo: 8, alerta: 0 };
    }
  });

  const [miReaccion, setMiReaccion] = useState<string | null>(() => {
    try {
      const key = `mi_reaccion_comercio_${comercio.id}_${user?.cedula || 'anon'}`;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  });

  // Comentarios públicos del comercio
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentarios, setComentarios] = useState<ComentarioComercio[]>(() => {
    try {
      const stored = localStorage.getItem(`comentarios_comercio_${comercio.id}`);
      return stored ? JSON.parse(stored) : [
        {
          id: `c-init-${comercio.id}`,
          autorNombre: 'Valeria Solano',
          contenido: 'Excelente servicio y productos frescos. 100% recomendado para apoyar el comercio local.',
          fecha: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ];
    } catch {
      return [];
    }
  });
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleReaccionar = (tipo: 'apoyo' | 'recomiendo' | 'alerta') => {
    const yaReacciono = miReaccion === tipo;
    const nuevasReacciones = {
      ...reacciones,
      [tipo]: yaReacciono ? Math.max(0, reacciones[tipo] - 1) : reacciones[tipo] + 1
    };

    setReacciones(nuevasReacciones);
    const nuevaReaccionKey = yaReacciono ? null : tipo;
    setMiReaccion(nuevaReaccionKey);

    try {
      localStorage.setItem(`reacciones_comercio_${comercio.id}`, JSON.stringify(nuevasReacciones));
      const userKey = `mi_reaccion_comercio_${comercio.id}_${user?.cedula || 'anon'}`;
      if (nuevaReaccionKey) {
        localStorage.setItem(userKey, nuevaReaccionKey);
        setFeedback(`¡Has reaccionado con ${tipo === 'apoyo' ? 'Apoyo Cívico' : tipo === 'recomiendo' ? 'Recomendación' : 'Alerta'}!`);
      } else {
        localStorage.removeItem(userKey);
        setFeedback('Reacción cívica retirada');
      }
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      console.warn('Error al guardar reacción:', e);
    }
  };

  const handleEnviarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    const nombrePublico = user?.nombre
      ? obtenerNombrePublico(user.nombre)
      : 'Ciudadano Comunitario';

    const nuevo: ComentarioComercio = {
      id: `cc-${Date.now()}`,
      autorNombre: nombrePublico,
      contenido: nuevoComentario.trim(),
      fecha: new Date().toISOString()
    };

    const nuevosComentarios = [nuevo, ...comentarios];
    setComentarios(nuevosComentarios);
    setNuevoComentario('');
    setFeedback('¡Comentario publicado exitosamente en la ficha del comercio!');
    setTimeout(() => setFeedback(null), 3500);

    try {
      localStorage.setItem(`comentarios_comercio_${comercio.id}`, JSON.stringify(nuevosComentarios));
    } catch (e) {
      console.warn('Error al guardar comentario:', e);
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        borderTop: '3px solid #0053AF',
        padding: '1.25rem',
        boxShadow: '0 2px 10px rgba(6, 42, 119, 0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Imagen del Comercio / Local */}
        <div
          style={{
            position: 'relative',
            height: '160px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <img
            src={comercio.imagenUrl}
            alt={comercio.nombreComercial}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <CivicBadge variant="default" size="sm">
              {comercio.categoria}
            </CivicBadge>
          </div>

          {comercio.esVerificadoHacienda && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(5, 12, 28, 0.88)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                color: '#A7F3D0'
              }}
            >
              <ShieldCheck size={16} color="#10B981" />
              <span>
                <strong>Sello Hacienda: </strong> {comercio.regimenTributarioHacienda}
              </span>
            </div>
          )}
        </div>

        {/* Nombre y Razón Social */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#062A77', margin: 0 }}>
              {comercio.nombreComercial}
            </h3>
            {comercio.patenteMunicipal && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: "var(--font-telemetry, monospace)",
                  fontWeight: 700,
                  color: '#0053AF',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                {comercio.patenteMunicipal}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
            {comercio.razonSocial} &bull; Cédula: <strong style={{ color: '#0F172A', fontFamily: "var(--font-telemetry, monospace)" }}>{comercio.cedulaJuridicaOFisica}</strong>
          </span>
          {comercio.actividadCiiu && (
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem', fontFamily: "var(--font-telemetry, monospace)" }}>
              CIIU: {comercio.actividadCiiu}
            </div>
          )}
        </div>

        {/* Descripción */}
        <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
          {comercio.descripcion}
        </p>

        {/* Dirección y Horario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="#0053AF" />
            <span>{comercio.direccionExacta}, <strong>{comercio.distrito}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={15} color="#059669" />
            <span>{comercio.horario}</span>
          </div>
        </div>

        {/* Badges de Patente y Pago */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#065F46',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Building size={12} color="#059669" /> Patente Cantonal al Día
          </span>

          {comercio.aceptaSinpeMovil && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#0369A1',
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <CreditCard size={12} color="#0284C7" /> Acepta SINPE Móvil
            </span>
          )}
        </div>

        {/* BARRA DE REACCIONES CÍVICAS PARA EL CIUDADANO (SVG) */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Apoyo Cívico */}
            <button
              type="button"
              onClick={() => handleReaccionar('apoyo')}
              title="Apoyar este comercio local"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                border: `1px solid ${miReaccion === 'apoyo' ? '#0053AF' : '#CBD5E1'}`,
                background: miReaccion === 'apoyo' ? '#EFF6FF' : '#F8FAFC',
                color: miReaccion === 'apoyo' ? '#0053AF' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <ThumbsUp size={13} />
              <span>{reacciones.apoyo}</span>
            </button>

            {/* Recomiendo */}
            <button
              type="button"
              onClick={() => handleReaccionar('recomiendo')}
              title="Recomendar a la comunidad"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                border: `1px solid ${miReaccion === 'recomiendo' ? '#059669' : '#CBD5E1'}`,
                background: miReaccion === 'recomiendo' ? '#ECFDF5' : '#F8FAFC',
                color: miReaccion === 'recomiendo' ? '#059669' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <HeartHandshake size={13} />
              <span>{reacciones.recomiendo}</span>
            </button>

            {/* Alerta / Observación */}
            <button
              type="button"
              onClick={() => handleReaccionar('alerta')}
              title="Reportar novedad o consulta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                border: `1px solid ${miReaccion === 'alerta' ? '#D97706' : '#CBD5E1'}`,
                background: miReaccion === 'alerta' ? '#FFFBEB' : '#F8FAFC',
                color: miReaccion === 'alerta' ? '#D97706' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <AlertTriangle size={13} />
              <span>{reacciones.alerta}</span>
            </button>
          </div>

          {/* Botón para desplegar comentarios */}
          <button
            type="button"
            onClick={() => setMostrarComentarios(!mostrarComentarios)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid #BFDBFE',
              background: mostrarComentarios ? '#EFF6FF' : '#FFFFFF',
              color: '#0053AF',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={13} />
            <span>{comentarios.length} comentarios</span>
          </button>
        </div>

        {feedback && (
          <div
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600
            }}
          >
            <CheckCircle2 size={13} color="#059669" />
            <span>{feedback}</span>
          </div>
        )}

        {/* SECCIÓN DESPLEGABLE DE COMENTARIOS CÍVICOS */}
        {mostrarComentarios && (
          <div
            style={{
              marginTop: '0.4rem',
              padding: '0.75rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            {/* Formulario para agregar comentario */}
            <form onSubmit={handleEnviarComentario} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe una reseña o consulta cívica..."
                style={{
                  flex: 1,
                  padding: '0.4rem 0.65rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  color: '#0F172A',
                  fontSize: '0.78rem'
                }}
              />
              <button
                type="submit"
                disabled={!nuevoComentario.trim()}
                style={{
                  padding: '0.4rem 0.75rem',
                  backgroundColor: nuevoComentario.trim() ? '#0053AF' : '#E2E8F0',
                  color: nuevoComentario.trim() ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: nuevoComentario.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Send size={12} />
              </button>
            </form>

            {/* Lista de comentarios sanitizados (Ley N° 8968) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {comentarios.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '0.45rem 0.6rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    borderLeft: '3px solid #0053AF',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#062A77' }}>
                      {obtenerNombrePublico(c.autorNombre)}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      {new Date(c.fecha).toLocaleDateString('es-CR')}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#334155', lineHeight: 1.4 }}>
                    {c.contenido}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs Directos Obligatorios a WhatsApp y Waze */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '0.85rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem'
          }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <CivicButton
              variant="secondary"
              size="sm"
              fullWidth
              style={{
                background: '#ECFDF5',
                borderColor: '#10B981',
                color: '#065F46'
              }}
              leftIcon={<MessageCircle size={16} color="#059669" />}
            >
              WhatsApp
            </CivicButton>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <CivicButton
              variant="secondary"
              size="sm"
              fullWidth
              style={{
                background: '#EFF6FF',
                borderColor: '#0053AF',
                color: '#0053AF'
              }}
              leftIcon={<Navigation size={16} color="#0053AF" />}
            >
              Ruta Waze
            </CivicButton>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FichaComercio;
