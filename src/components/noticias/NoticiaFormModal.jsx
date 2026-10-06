import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Building2,
  FileText,
  Tag,
  MapPin,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { crearNoticia, actualizarNoticia, esEditorMunicipal } from '../../services/noticiasService';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../../data/costaRicaTerritorialData';

const CATEGORIAS_NOTICIAS = [
  'Obras Públicas',
  'Gobernanza & Trámites',
  'Participación Ciudadana',
  'Seguridad & Emergencias',
  'Medio Ambiente & Sostenibilidad',
  'Desarrollo Local & Empleo',
  'Cultura & Comunidad',
  'Comercio & Turismo'
];

export default function NoticiaFormModal({
  isOpen,
  onClose,
  onGuardado,
  noticiaParaEditar = null
}) {
  const { user } = useAuth();
  const tienePermisoEditor = esEditorMunicipal(user);

  const [titulo, setTitulo] = useState('');
  const [resumen, setResumen] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS_NOTICIAS[0]);
  const [provincia, setProvincia] = useState('San José');
  const [canton, setCanton] = useState('San José');
  const [imagenUrl, setImagenUrl] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');

  // Sincronizar cantones según la provincia seleccionada
  const provinciaObj =
    PROVINCIAS_DATA.find((p) => p.nombre.toLowerCase() === provincia.toLowerCase()) ||
    PROVINCIAS_DATA[0];
  const cantonesDisponibles = provinciaObj
    ? CANTONES_OFICIALES.filter((c) => c.provinciaId === provinciaObj.id).map((c) => c.nombre)
    : ['San José'];

  // Mantener cantón coherente con la provincia
  useEffect(() => {
    if (cantonesDisponibles && cantonesDisponibles.length > 0 && !cantonesDisponibles.includes(canton)) {
      setCanton(cantonesDisponibles[0]);
    }
  }, [provincia]);

  // Cargar datos si se está editando o crear desde cero
  useEffect(() => {
    if (isOpen) {
      if (noticiaParaEditar) {
        setTitulo(noticiaParaEditar.titulo || '');
        setResumen(noticiaParaEditar.resumen || '');
        setContenido(noticiaParaEditar.contenido || '');
        setCategoria(noticiaParaEditar.categoria || CATEGORIAS_NOTICIAS[0]);
        setProvincia(noticiaParaEditar.provincia || 'San José');
        setCanton(noticiaParaEditar.canton || 'San José');
        setImagenUrl(noticiaParaEditar.imagenUrl || '');
      } else {
        setTitulo('');
        setResumen('');
        setContenido('');
        setCategoria(CATEGORIAS_NOTICIAS[0]);
        setProvincia(user?.provincia || 'San José');
        setCanton(user?.canton || 'San José');
        setImagenUrl('');
      }
      setErrorMsg('');
      setExitoMsg('');
    }
  }, [isOpen, noticiaParaEditar, user]);

  // Manejar Escape para cerrar
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tienePermisoEditor) {
      setErrorMsg('Acceso Denegado (RBAC): Única y exclusivamente usuarios con rol de "Editor Municipal" pueden publicar o editar comunicados oficiales.');
      return;
    }

    if (!titulo.trim() || !contenido.trim() || !canton.trim()) {
      setErrorMsg('El título, el contenido y el cantón son campos requeridos.');
      return;
    }

    try {
      setEnviando(true);
      setErrorMsg('');

      const noticiaPayload = {
        titulo: titulo.trim(),
        resumen: resumen.trim() || titulo.trim(),
        contenido: contenido.trim(),
        categoria,
        provincia,
        canton,
        imagenUrl: imagenUrl.trim(),
        autorNombre: user?.nombre || 'Gestión Municipal',
        autorRol: 'Editor Municipal',
        autorCedula: user?.cedula || '1-1155-0892'
      };

      let resultado;
      if (noticiaParaEditar) {
        resultado = await actualizarNoticia(noticiaParaEditar.id, noticiaPayload, user);
        setExitoMsg('¡Comunicado oficial actualizado exitosamente!');
      } else {
        resultado = await crearNoticia(noticiaPayload, user);
        setExitoMsg('¡Comunicado oficial publicado y persistido en db.json!');
      }

      setTimeout(() => {
        if (onGuardado) onGuardado(resultado);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Error guardando noticia:', err);
      setErrorMsg(err.message || 'Error al guardar el comunicado en el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 4, 13, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-noticia-titulo"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: 'var(--cru-surface, #FFFFFF)',
          borderRadius: '24px',
          border: '1px solid var(--cru-border, #E2E8F0)',
          boxShadow: 'var(--cru-card-shadow-hover, 0 25px 50px rgba(6, 42, 119, 0.12))',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Botón Cerrar (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--cru-surface-muted, #F1F5F9)',
            border: '1px solid var(--cru-border, #E2E8F0)',
            color: 'var(--cru-text-soft, #64748B)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del Modal con Sello Institucional */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.725rem',
                fontWeight: 800,
                color: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                padding: '3px 9px',
                borderRadius: '9999px',
                border: '1px solid rgba(245, 158, 11, 0.35)'
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              M01 · GESTIÓN OFICIAL DE NOTICIAS & COMUNICADOS
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.725rem',
                fontWeight: 700,
                color: tienePermisoEditor ? '#34D399' : '#FB7185',
                backgroundColor: tienePermisoEditor ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                padding: '3px 8px',
                borderRadius: '9999px',
                border: tienePermisoEditor ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)'
              }}
            >
              {tienePermisoEditor ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              RBAC: {tienePermisoEditor ? 'Editor Municipal Autorizado' : 'Rol No Autorizado'}
            </span>
          </div>

          <h2
            id="modal-noticia-titulo"
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--cru-text, #062A77)',
              margin: '0.25rem 0'
            }}
          >
            {noticiaParaEditar ? 'Editar Comunicado Oficial' : 'Nuevo Comunicado Municipal'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            Emisión de anuncios de obras, decretos cantonales, alertas viales y convocatorias públicas.
          </p>
        </div>

        {/* Alerta de bloqueo RBAC si el usuario no es Editor Municipal */}
        {!tienePermisoEditor && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#FB7185',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                Control de Acceso Basado en Roles (RBAC)
              </div>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
                Única y exclusivamente los usuarios con rol de <strong>"Editor Municipal"</strong> tienen permisos para publicar, modificar o dar de baja comunicados. Tu rol actual es: <em>{user?.rol || 'Visitante no autenticado'}</em>.
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {errorMsg && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#FB7185',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem'
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span style={{ fontSize: '0.85rem' }}>{errorMsg}</span>
          </div>
        )}

        {/* Mensaje de éxito */}
        {exitoMsg && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem'
            }}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{exitoMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Fila 1: Provincia y Cantón */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#CBD5E1',
                  marginBottom: '0.4rem'
                }}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Provincia</span>
              </label>

              <select
                disabled={!tienePermisoEditor}
                value={provincia}
                onChange={(e) => {
                  setProvincia(e.target.value);
                  const pObj = PROVINCIAS_DATA.find((p) => p.nombre.toLowerCase() === e.target.value.toLowerCase());
                  if (pObj && pObj.cantones.length > 0) {
                    setCanton(pObj.cantones[0]);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: tienePermisoEditor ? 'pointer' : 'not-allowed'
                }}
              >
                {PROVINCIAS_DATA.map((p) => (
                  <option key={p.id} value={p.nombre} style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#CBD5E1',
                  marginBottom: '0.4rem'
                }}
              >
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Municipalidad / Cantón</span>
              </label>

              <select
                disabled={!tienePermisoEditor}
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: tienePermisoEditor ? 'pointer' : 'not-allowed'
                }}
              >
                {cantonesDisponibles.map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Categoría */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#CBD5E1',
                marginBottom: '0.4rem'
              }}
            >
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              <span>Categoría del Comunicado</span>
            </label>

            <select
              disabled={!tienePermisoEditor}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: tienePermisoEditor ? 'pointer' : 'not-allowed'
              }}
            >
              {CATEGORIAS_NOTICIAS.map((cat) => (
                <option key={cat} value={cat} style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Fila 3: Título */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Título del Comunicado Oficial</span>
              </label>
              <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                {titulo.length}/140
              </span>
            </div>

            <input
              type="text"
              disabled={!tienePermisoEditor}
              maxLength={140}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Inicio de obras de recarpeteo en el distrito central"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Fila 4: Resumen Ejecutivo */}
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#CBD5E1',
                display: 'block',
                marginBottom: '0.4rem'
              }}
            >
              Resumen o Bajada Informativa
            </label>

            <input
              type="text"
              disabled={!tienePermisoEditor}
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Ej: Intervención vial programada del 5 al 12 de octubre."
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Fila 5: Contenido Completo */}
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#CBD5E1',
                display: 'block',
                marginBottom: '0.4rem'
              }}
            >
              Texto Completo del Comunicado Oficial
            </label>

            <textarea
              disabled={!tienePermisoEditor}
              rows={5}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Redacta el contenido formal del comunicado, rutas de evacuación o desvíos, horarios de atención, teléfonos de contacto institucional..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
                minHeight: '110px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Fila 6: URL de Imagen Opcional */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#CBD5E1',
                marginBottom: '0.4rem'
              }}
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>URL de Imagen o Fotografía de la Obra (Opcional)</span>
            </label>

            <input
              type="url"
              disabled={!tienePermisoEditor}
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://ejemplo.gob.cr/imagenes/comunicado-obras.jpg"
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Sello de Acreditación de Autor */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#94A3B8'
            }}
          >
            <span>
              Emitiendo como: <strong style={{ color: '#F1F5F9' }}>{user?.nombre || 'Editor Municipal'}</strong>
            </span>
            <span>
              Rol Acreditado: <strong style={{ color: '#F59E0B' }}>{user?.rol || 'Editor Municipal'}</strong>
            </span>
          </div>

          {/* Botonera de Acción */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#CBD5E1',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-white/10"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando || !tienePermisoEditor}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                borderRadius: '10px',
                backgroundColor: tienePermisoEditor ? '#D97706' : 'rgba(255, 255, 255, 0.1)',
                border: tienePermisoEditor ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: enviando || !tienePermisoEditor ? 'not-allowed' : 'pointer',
                boxShadow: tienePermisoEditor ? '0 4px 15px rgba(217, 119, 6, 0.4)' : 'none',
                transition: 'all 0.2s ease',
                opacity: enviando || !tienePermisoEditor ? 0.6 : 1
              }}
              className={tienePermisoEditor ? 'hover:bg-amber-600 active:scale-95' : ''}
            >
              <Send className="w-4 h-4" />
              <span>{enviando ? 'Guardando en db.json...' : noticiaParaEditar ? 'Actualizar Comunicado' : 'Publicar Comunicado'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
