import React from 'react';
import { ItinerarioGeneradoResultado } from '../../services/itinerarioIAPlanner';
import { PerfilElevacion3D } from './PerfilElevacion3D';
import { CivicCard } from '../common/CivicCard';
import { CivicButton } from '../common/CivicButton';
import { AccessibilityBadge } from '../common/AccessibilityBadge';
import { MapPin, Navigation, ExternalLink, Clock, DollarSign, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface VisorItinerarioGeneradoProps {
  itinerario: ItinerarioGeneradoResultado;
  onReiniciar: () => void;
}

/**
 * VisorItinerarioGenerado — Módulo 12 (RF-12.2)
 * Renderiza el cronograma interactivo diario generado por IA,
 * botones de exportación a Waze / Google Maps y certificación topográfica 3D.
 */
export const VisorItinerarioGenerado: React.FC<VisorItinerarioGeneradoProps> = ({
  itinerario,
  onReiniciar
}) => {
  const abrirWaze = (url: string) => {
    window.open(url, '_blank');
  };

  const abrirGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  const abrirRutaCompleta = () => {
    window.open(itinerario.enlaceRutaCompletaGoogle, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner de Resultado Ejecutivo */}
      <CivicCard
        level={3}
        className="p-6 sm:p-8 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-[#001326] to-slate-950 relative overflow-hidden"
        style={{ borderRadius: '24px' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Itinerario Personalizado Generado por IA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {itinerario.tituloItinerario}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {itinerario.resumenEjecutivo}
            </p>
          </div>

          {/* Tarjeta de Presupuesto Consolidado */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 p-4 rounded-xl bg-slate-950/80 border border-white/10 shrink-0">
            <div className="flex justify-between items-center gap-4 text-xs">
              <span className="text-slate-400">Presupuesto:</span>
              <span className="font-mono text-white font-bold">
                ₡ {itinerario.presupuestoSolicitado.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4 text-xs">
              <span className="text-slate-400">Gasto Estimado:</span>
              <span className="font-mono text-cyan-300 font-bold">
                ₡ {itinerario.gastoTotalEstimado.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4 text-xs border-t border-white/10 pt-1.5">
              <span className="text-emerald-400 font-medium">Ahorro / Saldo:</span>
              <span className="font-mono text-emerald-300 font-bold">
                ₡ {itinerario.saldoRestante.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Acciones de Ruta */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <CivicButton
              variant="primary"
              size="sm"
              onClick={abrirRutaCompleta}
              leftIcon={<Navigation size={15} />}
            >
              Exportar Ruta Completa a Google Maps
            </CivicButton>
          </div>

          <CivicButton
            variant="ghost"
            size="sm"
            onClick={onReiniciar}
            leftIcon={<RotateCcw size={14} />}
          >
            Ajustar Variables y Replanificar
          </CivicButton>
        </div>
      </CivicCard>

      {/* Componente de Análisis Topográfico 3D y Certificación */}
      <PerfilElevacion3D
        puntos={itinerario.perfilElevacion}
        certificacion={itinerario.certificacionTopografica}
      />

      {/* Línea de Tiempo de Paradas */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="text-cyan-400" size={20} />
          Cronograma Diario de Paradas Recomendadas ({itinerario.paradas.length} paradas)
        </h3>

        <div className="space-y-4">
          {itinerario.paradas.map((parada, index) => (
            <CivicCard
              key={parada.id}
              level={2}
              className="p-5 border-white/10 hover:border-cyan-400/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{ borderRadius: '16px' }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-mono font-bold shrink-0">
                  {index + 1}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-cyan-400 font-bold">{parada.hora}</span>
                    <span className="text-slate-500">•</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 capitalize text-[11px]">
                      {parada.categoria}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-mono text-emerald-300 text-xs font-semibold">
                      ₡ {parada.costoEstimadoColones.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    {parada.actividad}
                  </h4>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin size={13} className="text-cyan-400 shrink-0" />
                    {parada.lugar}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {parada.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {parada.badges.map((b) => (
                      <AccessibilityBadge key={b} type={b} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones de Navegación por Parada */}
              <div className="flex md:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                <CivicButton
                  variant="outline"
                  size="sm"
                  onClick={() => abrirGoogleMaps(parada.enlaceGoogleMaps)}
                  leftIcon={<ExternalLink size={13} />}
                >
                  Google Maps
                </CivicButton>
                <CivicButton
                  variant="outline"
                  size="sm"
                  onClick={() => abrirWaze(parada.enlaceWaze)}
                  leftIcon={<Navigation size={13} />}
                >
                  Waze
                </CivicButton>
              </div>
            </CivicCard>
          ))}
        </div>
      </div>
    </div>
  );
};
