import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  Scale,
  Send,
  CheckCircle2,
  X,
  FileQuestion,
  Info
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { solicitarRevisionIncidente } from '../../services/moderacionForoService';

export default function IncidenteModeracionModal({
  isOpen,
  onClose,
  resultadoModeracion,
  sancion,
  incidenteId,
  esPersonalExento,
  onVerReglas
}) {
  const { t } = useLanguage();
  const [justificacion, setJustificacion] = useState('');
  const [mostrandoSolicitud, setMostrandoSolicitud] = useState(false);
  const [enviandoRevision, setEnviandoRevision] = useState(false);
  const [revisionEnviada, setRevisionEnviada] = useState(false);

  if (!isOpen || !resultadoModeracion) return null;

  const palabras = resultadoModeracion.palabrasDetectadas || [];
  const gravedad = resultadoModeracion.gravedad || 'MEDIA';
  const esAdvertencia = sancion?.tipoSancion === 'ADVERTENCIA';

  const handleEnviarRevision = async (e) => {
    e.preventDefault();
    if (!justificacion.trim()) return;

    try {
      setEnviandoRevision(true);
      await solicitarRevisionIncidente(incidenteId, justificacion.trim());
      setRevisionEnviada(true);
    } catch (err) {
      console.error('Error enviando solicitud de revisión:', err);
    } finally {
      setEnviandoRevision(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-incidente-moderacion"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl border border-rose-500/30 bg-[#070D1B] text-slate-100 shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(244, 63, 94, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Borde tricolor decorativo oficial */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background:
              'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
          }}
        />

        {/* Cabecera */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 shrink-0 bg-rose-950/20">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0 text-rose-400 shadow-inner">
              <ShieldAlert className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                  {t('moderacion.supervisorIa', 'Supervisor IA · Convivencia Cívica')}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Gravedad: <strong className="text-white">{gravedad}</strong>
                </span>
              </div>
              <h2
                id="titulo-incidente-moderacion"
                className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
              >
                {t('moderacion.avisoPublicacion', 'Aviso sobre el contenido ingresado')}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Cerrar aviso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-sm leading-relaxed text-slate-300">
          {/* Motivo detectado */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('moderacion.motivoDeteccion', 'Motivo de la moderación')}</span>
            </div>
            <p className="text-slate-200 text-sm font-medium">
              {resultadoModeracion.razon ||
                'El texto contiene expresiones no compatibles con las reglas de respeto y convivencia cívica.'}
            </p>
          </div>

          {/* Términos o patrones identificados */}
          {palabras.length > 0 && (
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-2">
                {t('moderacion.terminosIdentificados', 'Términos o patrones observados:')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {palabras.map((p, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25"
                  >
                    "{p}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medida o Sanción Aplicada */}
          <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-400/25">
            <div className="text-xs uppercase tracking-wider font-bold text-sky-400 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('moderacion.medidaAplicada', 'Medida aplicada según el régimen de sanciones')}</span>
            </div>
            <p className="text-slate-200 font-semibold text-sm">
              {esPersonalExento
                ? 'Registro generado para supervisión administrativa (Rol Oficial exento de baneo automático).'
                : sancion?.mensaje || (esAdvertencia ? 'Bloqueo del texto y advertencia formativa.' : 'Suspensión temporal aplicada.')}
            </p>
            {sancion?.finIso && !esPersonalExento && (
              <p className="text-xs text-slate-400 mt-1">
                Vigencia de la suspensión hasta:{' '}
                <strong className="text-sky-300">
                  {new Date(sancion.finIso).toLocaleString('es-CR')}
                </strong>
              </p>
            )}
          </div>

          {/* Recordatorio de Crítica Política */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Tu derecho a opinar está garantizado:</strong> La crítica firme hacia instituciones, municipalidades o funcionarios públicos es totalmente legítima y bienvenida en esta sede cívica. Te invitamos a reescribir tu mensaje enfocándote en los hechos y propuestas, omitiendo ofensas personales o lenguaje soez.
            </div>
          </div>

          {/* Formulario de Solicitud de Revisión Humana */}
          {mostrandoSolicitud ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-sky-400/30">
              <div className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                <FileQuestion className="w-4 h-4" />
                <span>{t('moderacion.solicitarRevision', 'Solicitar revisión por el Super Administrador')}</span>
              </div>
              {revisionEnviada ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tu solicitud de revisión fue enviada y será evaluada por el equipo de administración cívica.</span>
                </div>
              ) : (
                <form onSubmit={handleEnviarRevision} className="space-y-3">
                  <textarea
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    placeholder="Explica brevemente por qué consideras que el contenido debe ser reconsiderado (ej. contexto cívico legítimo, error de interpretación)..."
                    rows={3}
                    className="w-full p-2.5 text-xs bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-sky-400"
                    required
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setMostrandoSolicitud(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={enviandoRevision || !justificacion.trim()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" />
                      <span>{enviandoRevision ? 'Enviando...' : 'Enviar a Revisión'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setMostrandoSolicitud(true)}
                className="text-xs text-slate-400 hover:text-sky-400 underline inline-flex items-center gap-1"
              >
                <FileQuestion className="w-3.5 h-3.5" />
                <span>¿Consideras que es un error? Solicitar revisión humana</span>
              </button>
              {onVerReglas && (
                <button
                  type="button"
                  onClick={onVerReglas}
                  className="text-xs text-sky-400 hover:text-sky-300 underline inline-flex items-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Ver Reglas de la Comunidad</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-end gap-3 shrink-0 bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-all"
          >
            {t('comun.entendido', 'Entendido')}
          </button>
        </div>
      </div>
    </div>
  );
}
