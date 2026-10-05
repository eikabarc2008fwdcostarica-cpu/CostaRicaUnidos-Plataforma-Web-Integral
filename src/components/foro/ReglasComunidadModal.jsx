import React, { useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Clock,
  Info,
  BookOpen
} from 'lucide-react';
import { CONTENIDO_REGLAS_COMUNIDAD } from '../../config/reglasForo';
import { useLanguage } from '../../context/LanguageContext';

export default function ReglasComunidadModal({ isOpen, onClose, onAceptar }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-reglas-comunidad"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-sky-400/25 bg-[#070D1B] text-slate-100 shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.12)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Borde superior tricolor decorativo oficial */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background:
              'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
          }}
        />

        {/* Cabecera del Modal */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 shrink-0 bg-white/[0.02]">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center shrink-0 text-sky-400 mt-0.5 shadow-inner">
              <Scale className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {t('reglasVersion', `Versión ${CONTENIDO_REGLAS_COMUNIDAD.version}`)}
                </span>
                <span className="text-xs text-slate-400">• {t('reglasVigencia', `Vigente desde: ${CONTENIDO_REGLAS_COMUNIDAD.fechaVigencia}`)}</span>
              </div>
              <h2 id="titulo-reglas-comunidad" className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {t('reglasTitulo', CONTENIDO_REGLAS_COMUNIDAD.titulo)}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {t('reglasSubtitulo', CONTENIDO_REGLAS_COMUNIDAD.subtitulo)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('cerrar', 'Cerrar ventana de reglas')}
            className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Cuerpo del Modal con scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm leading-relaxed text-slate-300">
          {/* 1. Sección de Principios: Qué está permitido vs Qué está prohibido */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{t('normasConvivencia', 'Normas de Convivencia y Expresión')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CONTENIDO_REGLAS_COMUNIDAD.principios.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    p.permitido
                      ? 'bg-emerald-500/[0.04] border-emerald-500/25 hover:border-emerald-500/40'
                      : 'bg-red-500/[0.04] border-red-500/25 hover:border-red-500/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-1.5">
                    {p.permitido ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <h4 className={`text-xs font-bold ${p.permitido ? 'text-emerald-300' : 'text-red-300'}`}>
                      {p.titulo}
                    </h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-normal pl-6.5">
                    {p.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tabla de Sanciones Graduales */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{t('tablaSancionesTitulo', 'Matriz de Sanciones por Reincidencia')}</span>
              </h3>
              <span className="text-[11px] text-amber-300/80 font-medium">
                {t('supervisorAutomated', 'Supervisión en Tiempo Real')}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    <th className="py-2.5 px-3">{t('gravedad', 'Gravedad')}</th>
                    <th className="py-2.5 px-3 min-w-[150px]">{t('ejemplos', 'Infracciones Típicas')}</th>
                    <th className="py-2.5 px-3">{t('vez1', '1ª Vez')}</th>
                    <th className="py-2.5 px-3">{t('vez2', '2ª Vez')}</th>
                    <th className="py-2.5 px-3">{t('vez3', '3ª Vez')}</th>
                    <th className="py-2.5 px-3">{t('vez4', '4ª o más')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {CONTENIDO_REGLAS_COMUNIDAD.tablaSanciones.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 align-top font-bold">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wide"
                          style={{
                            backgroundColor: `${row.colorBadge}20`,
                            color: row.colorBadge,
                            border: `1px solid ${row.colorBadge}50`
                          }}
                        >
                          {row.gravedad}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top text-slate-400 text-[11px] leading-relaxed">
                        {row.ejemplos}
                      </td>
                      <td className="py-3 px-3 align-top text-slate-300 font-semibold">{row.vez1}</td>
                      <td className="py-3 px-3 align-top text-slate-300 font-semibold">{row.vez2}</td>
                      <td className="py-3 px-3 align-top text-slate-300 font-semibold">{row.vez3}</td>
                      <td className="py-3 px-3 align-top text-slate-300 font-semibold">{row.vez4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 italic">
              {CONTENIDO_REGLAS_COMUNIDAD.notaIndefinida}
            </p>
          </div>

          {/* 3. Condiciones adicionales y caducidad de strikes */}
          <div className="p-4 rounded-2xl bg-sky-500/[0.05] border border-sky-400/20 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-bold">
              <Clock className="w-4 h-4 shrink-0 text-sky-400" />
              <span>{t('caducidadTitulo', 'Caducidad de Reincidencias y Alcance')}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              • {CONTENIDO_REGLAS_COMUNIDAD.notaCaducidad}
            </p>
            <p className="text-[11px] text-slate-300">
              • {CONTENIDO_REGLAS_COMUNIDAD.alcanceBaneo}
            </p>
          </div>
        </div>

        {/* Pie del Modal con acciones */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('soberaniaDigital', 'Garantía de moderación transparente Ley N° 8292 y Ley N° 8968')}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all cursor-pointer"
            >
              {t('cerrar', 'Cerrar')}
            </button>
            {onAceptar && (
              <button
                type="button"
                onClick={() => {
                  onAceptar();
                  onClose();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 border border-sky-400/40 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              >
                {t('entendidoYAcepto', 'Entendido y Acepto')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
