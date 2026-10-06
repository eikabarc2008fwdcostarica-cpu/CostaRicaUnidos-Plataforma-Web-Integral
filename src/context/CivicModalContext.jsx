import React, { createContext, useContext, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const CivicModalContext = createContext(null);

export function CivicModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState({
    abierto: false,
    tipo: 'alerta', // 'alerta' | 'confirmacion' | 'motivo'
    icono: 'info',  // 'info' | 'exito' | 'error' | 'advertencia'
    titulo: '',
    mensaje: '',
    placeholder: '',
    textoBotonAceptar: 'Aceptar',
    textoBotonCancelar: 'Cancelar',
    onAceptar: null,
    onCancelar: null
  });

  const [valorInput, setValorInput] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [toastNotificacion, setToastNotificacion] = useState(null);

  // Método para disparar notificación toast en la esquina superior derecha
  const mostrarToast = (mensaje, icono = 'exito') => {
    setToastNotificacion({ mensaje, icono });
    setTimeout(() => setToastNotificacion(null), 3500);
  };

  // Métodos para invocar desde cualquier componente
  const mostrarAlerta = ({ titulo, mensaje, icono = 'info', textoBoton = 'Entendido', onAceptar = null }) => {
    setModalConfig({
      abierto: true,
      tipo: 'alerta',
      icono,
      titulo: titulo || 'Notificación Municipal Oficial',
      mensaje,
      placeholder: '',
      textoBotonAceptar: textoBoton,
      textoBotonCancelar: 'Cancelar',
      onAceptar,
      onCancelar: null
    });
  };

  const solicitarConfirmacion = ({
    titulo,
    mensaje,
    icono = 'advertencia',
    textoBotonAceptar = 'Confirmar',
    textoBotonCancelar = 'Cancelar',
    onAceptar,
    onCancelar = null
  }) => {
    setModalConfig({
      abierto: true,
      tipo: 'confirmacion',
      icono,
      titulo: titulo || 'Confirmación Oficial de Gobierno',
      mensaje,
      placeholder: '',
      textoBotonAceptar,
      textoBotonCancelar,
      onAceptar,
      onCancelar
    });
  };

  const solicitarMotivo = ({
    titulo,
    mensaje,
    placeholder = 'Escriba el motivo aquí...',
    textoBotonAceptar = 'Aceptar',
    textoBotonCancelar = 'Cancelar',
    onAceptar,
    onCancelar = null
  }) => {
    setValorInput('');
    setErrorInput('');
    setModalConfig({
      abierto: true,
      tipo: 'motivo',
      icono: 'advertencia',
      titulo: titulo || 'Justificación Requerida',
      mensaje,
      placeholder,
      textoBotonAceptar,
      textoBotonCancelar,
      onAceptar,
      onCancelar
    });
  };

  const cerrarModal = () => {
    if (modalConfig.onCancelar) modalConfig.onCancelar();
    setModalConfig((prev) => ({ ...prev, abierto: false }));
    setValorInput('');
    setErrorInput('');
  };

  React.useEffect(() => {
    if (!modalConfig.abierto) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') cerrarModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalConfig.abierto]);

  const confirmarAccion = () => {
    if (modalConfig.tipo === 'motivo') {
      if (!valorInput.trim()) {
        setErrorInput('Este campo es obligatorio. Por favor ingrese el motivo.');
        return;
      }
      if (modalConfig.onAceptar) modalConfig.onAceptar(valorInput.trim());
    } else {
      if (modalConfig.onAceptar) modalConfig.onAceptar();
    }
    setModalConfig((prev) => ({ ...prev, abierto: false }));
    setValorInput('');
    setErrorInput('');
  };

  return (
    <CivicModalContext.Provider value={{ mostrarAlerta, solicitarConfirmacion, solicitarMotivo, mostrarToast }}>
      {children}

      {/* Contenedor de Notificaciones Emergentes / Toasts en Esquina Superior Derecha */}
      {toastNotificacion && (
        <div 
          style={{
            position: 'fixed',
            top: '5.5rem',        // 88px, justo debajo del Navbar
            right: '1.5rem',       // 24px del borde derecho
            zIndex: 9999,          // Siempre por encima de cualquier contenido
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            pointerEvents: 'none'
          }}
          className="transition-all duration-300 ease-out"
        >
          {/* Notificación con diseño Sovereign Civic Glass */}
          <div 
            style={{ pointerEvents: 'auto' }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cru-surface-card text-cru-text border border-cru-border shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200"
          >
            {toastNotificacion.icono === 'exito' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" strokeWidth={2} />}
            {toastNotificacion.icono === 'advertencia' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" strokeWidth={2} />}
            {toastNotificacion.icono === 'error' && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" strokeWidth={2} />}
            {toastNotificacion.icono === 'info' && <Info className="w-5 h-5 text-sky-400 flex-shrink-0" strokeWidth={2} />}
            <span className="text-xs font-bold tracking-wide">{toastNotificacion.mensaje}</span>
          </div>
        </div>
      )}

      {/* Overlay y Modal Cívico con diseño Sovereign Civic Glass */}
      {modalConfig.abierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg p-6 rounded-3xl bg-cru-surface-card text-cru-text border border-cru-border shadow-2xl transition-all"
            style={{ boxShadow: 'var(--cru-card-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.7))' }}
          >
            {/* Botón cerrar X */}
            <button
              type="button"
              onClick={cerrarModal}
              aria-label="Cerrar ventana modal"
              className="absolute top-5 right-5 text-cru-text-soft hover:text-cru-text p-1.5 rounded-full hover:bg-cru-surface-muted transition-colors focus-visible:ring-2 focus-visible:ring-cru-accent-blue focus-visible:outline-none"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* Encabezado con Icono de Lucide */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  modalConfig.icono === 'exito'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : modalConfig.icono === 'error'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : modalConfig.icono === 'advertencia'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                {modalConfig.icono === 'exito' && <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />}
                {modalConfig.icono === 'error' && <XCircle className="w-6 h-6" strokeWidth={1.75} />}
                {modalConfig.icono === 'advertencia' && <AlertTriangle className="w-6 h-6" strokeWidth={1.75} />}
                {modalConfig.icono === 'info' && <Info className="w-6 h-6" strokeWidth={1.75} />}
              </div>
              <div className="pr-6">
                <h3 className="text-lg font-bold tracking-tight text-cru-text">
                  {modalConfig.titulo || 'Notificación Municipal Oficial'}
                </h3>
                <p className="text-sm text-cru-text-secondary mt-1 leading-relaxed">
                  {modalConfig.mensaje}
                </p>
              </div>
            </div>

            {/* Campo de texto en caso de ser tipo 'motivo' */}
            {modalConfig.tipo === 'motivo' && (
              <div className="my-4">
                <textarea
                  rows={3}
                  value={valorInput}
                  onChange={(e) => {
                    setValorInput(e.target.value);
                    if (errorInput) setErrorInput('');
                  }}
                  placeholder={modalConfig.placeholder}
                  className="w-full p-3.5 rounded-2xl bg-cru-surface-muted border border-cru-border text-cru-text text-sm outline-none focus:border-red-500 transition-colors resize-none placeholder-cru-text-soft"
                />
                {errorInput && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>{errorInput}</span>
                  </p>
                )}
              </div>
            )}

            {/* Botonera de Acción */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-cru-border">
              {modalConfig.tipo !== 'alerta' && (
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-cru-text hover:text-cru-text bg-cru-surface-muted hover:bg-cru-surface-hover border border-cru-border transition-colors"
                >
                  {modalConfig.textoBotonCancelar}
                </button>
              )}
              <button
                type="button"
                onClick={confirmarAccion}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
                  modalConfig.icono === 'error' || modalConfig.tipo === 'motivo'
                    ? 'bg-red-600 hover:bg-red-500'
                    : modalConfig.icono === 'exito'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-[#002B7F] hover:bg-[#001489]'
                }`}
              >
                {modalConfig.textoBotonAceptar}
              </button>
            </div>
          </div>
        </div>
      )}
    </CivicModalContext.Provider>
  );
}

export function useCivicModal() {
  const context = useContext(CivicModalContext);
  if (!context) {
    throw new Error('useCivicModal debe usarse dentro de CivicModalProvider');
  }
  return context;
}
