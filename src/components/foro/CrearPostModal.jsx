import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Globe,
  MapPin,
  Tag,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { crearPost } from '../../services/foroService';

const PROVINCIAS_OPCIONES = [
  { id: 'nacional', nombre: 'Nacional (Todo el País)' },
  { id: 'san-jose', nombre: 'San José' },
  { id: 'alajuela', nombre: 'Alajuela' },
  { id: 'cartago', nombre: 'Cartago' },
  { id: 'heredia', nombre: 'Heredia' },
  { id: 'guanacaste', nombre: 'Guanacaste' },
  { id: 'puntarenas', nombre: 'Puntarenas' },
  { id: 'limon', nombre: 'Limón' }
];

const CATEGORIAS_OPCIONES = [
  'Infraestructura & Movilidad',
  'Seguridad Ciudadana',
  'Medio Ambiente & Recursos Hídricos',
  'Servicios Municipales',
  'Cultura, Deportes & Juventud',
  'Desarrollo Rural & Sostenibilidad',
  'Gobernanza & Presupuesto'
];

export default function CrearPostModal({
  isOpen,
  onClose,
  onPostCreado,
  provinciaInicial = 'nacional'
}) {
  const { user } = useAuth();

  const [provinciaId, setProvinciaId] = useState(provinciaInicial);
  const [categoria, setCategoria] = useState(CATEGORIAS_OPCIONES[0]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [autorNombre, setAutorNombre] = useState('');
  const [autorCedula, setAutorCedula] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [exito, setExito] = useState(false);

  // Inicializar datos al abrir modal
  useEffect(() => {
    if (isOpen) {
      setProvinciaId(provinciaInicial || 'nacional');
      setCategoria(CATEGORIAS_OPCIONES[0]);
      setTitulo('');
      setContenido('');
      setAutorNombre(user?.nombre || 'Ciudadano Activo');
      setAutorCedula(user?.cedula || '1-1823-0456');
      setErrorMsg('');
      setExito(false);
    }
  }, [isOpen, provinciaInicial, user]);

  // Manejar tecla Escape para cerrar
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      setErrorMsg('Por favor ingrese un título descriptivo para la publicación.');
      return;
    }
    if (!contenido.trim()) {
      setErrorMsg('Por favor detalle el contenido o propuesta de su iniciativa comunal.');
      return;
    }
    if (titulo.length < 5) {
      setErrorMsg('El título debe tener al menos 5 caracteres.');
      return;
    }

    try {
      setEnviando(true);
      setErrorMsg('');

      const provObj = PROVINCIAS_OPCIONES.find((p) => p.id === provinciaId);
      const provinciaNombre = provObj ? provObj.nombre : 'Nacional';

      const nuevoPost = {
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        provinciaId,
        provinciaNombre,
        categoria,
        autorNombre: autorNombre.trim() || 'Ciudadano',
        autorCedula: autorCedula.trim() || '1-1823-0456',
        fecha: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        reacciones: { apoyo: 0, urgente: 0, idea: 0 },
        usuariosVotaron: {},
        comentarios: []
      };

      const creado = await crearPost(nuevoPost);
      setExito(true);

      setTimeout(() => {
        if (onPostCreado) {
          onPostCreado(creado);
        }
        onClose();
      }, 900);
    } catch (err) {
      console.error('Error al crear post:', err);
      setErrorMsg(err.message || 'Error al persistir la publicación en db.json.');
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
        aria-labelledby="modal-titulo"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#070D1B',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.1)',
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
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="hover:bg-white/10 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del Modal */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.725rem',
                fontWeight: 700,
                color: '#38BDF8',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}
            >
              <Sparkles className="w-3 h-3" />
              M04 · PARTICIPACIÓN CIUDADANA
            </span>
          </div>

          <h2
            id="modal-titulo"
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0
            }}
          >
            Nueva Publicación en el Foro Tico
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>
            Propón soluciones comunitarias, inicia debates cívicos y consulta a los vecinos de tu provincia o país.
          </p>
        </div>

        {/* Mensaje de éxito */}
        {exito && (
          <div
            style={{
              padding: '1rem',
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
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              ¡Publicación registrada exitosamente y guardada en db.json!
            </span>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Fila 1: Selector de Ámbito Territorial y Categoría */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* Ámbito Territorial */}
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
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Ámbito Territorial</span>
              </label>

              <select
                value={provinciaId}
                onChange={(e) => setProvinciaId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {PROVINCIAS_OPCIONES.map((p) => (
                  <option key={p.id} value={p.id} style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoría Temática */}
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
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Eje Temático</span>
              </label>

              <select
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
                  cursor: 'pointer'
                }}
              >
                {CATEGORIAS_OPCIONES.map((cat) => (
                  <option key={cat} value={cat} style={{ backgroundColor: '#070D1B', color: '#FFFFFF' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Banner explicativo del alcance territorial */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#94A3B8'
            }}
          >
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>
              {provinciaId === 'nacional'
                ? 'Esta propuesta será visible en el Foro Nacional general para todo el país.'
                : `Esta propuesta será visible en el Foro Provincial de ${PROVINCIAS_OPCIONES.find((p) => p.id === provinciaId)?.nombre} y en el feed del Foro Nacional.`}
            </span>
          </div>

          {/* Campo: Título */}
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
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Título de la Iniciativa o Debate</span>
              </label>
              <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                {titulo.length}/120
              </span>
            </div>

            <input
              type="text"
              maxLength={120}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Propuesta de ciclovía cantonal en Cartago Centro"
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

          {/* Campo: Contenido */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}
              >
                Detalle y Argumentación Cívica
              </label>
              <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                {contenido.length}/1000
              </span>
            </div>

            <textarea
              maxLength={1000}
              rows={4}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Describe los antecedentes, la propuesta concreta para el Concejo Municipal o vecinos, y el impacto positivo esperado..."
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
                minHeight: '90px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Fila: Datos del Autor (Autocompletados con Cédula Oficial) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '0.25rem' }}>
                Autor / Proponente
              </label>
              <input
                type="text"
                value={autorNombre}
                onChange={(e) => setAutorNombre(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '0.25rem' }}>
                Cédula Oficial
              </label>
              <input
                type="text"
                value={autorCedula}
                onChange={(e) => setAutorCedula(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Botonera de Envío y Cancelación */}
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
              disabled={enviando || exito}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                borderRadius: '10px',
                backgroundColor: '#0284C7',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: enviando || exito ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-sky-500 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{enviando ? 'Publicando en db.json...' : 'Publicar Propuesta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
