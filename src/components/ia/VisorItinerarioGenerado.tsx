import React, { useState } from 'react';
import { ItinerarioGeneradoResultado, ParadaItinerarioGenerada } from '../../services/itinerarioIAPlanner';
import { PerfilElevacion3D } from './PerfilElevacion3D';
import { CivicCard } from '../common/CivicCard';
import { CivicButton } from '../common/CivicButton';
import { AccessibilityBadge } from '../common/AccessibilityBadge';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Clock,
  DollarSign,
  Sparkles,
  RotateCcw,
  Calendar,
  Car,
  CheckCircle2,
  Store,
  ShieldCheck
} from 'lucide-react';

interface VisorItinerarioGeneradoProps {
  itinerario: ItinerarioGeneradoResultado;
  onReiniciar: () => void;
}

/**
 * VisorItinerarioGenerado — Motor Generativo de Itinerarios
 * Despliega el itinerario generado paso a paso:
 * - Día 1: Mañana (Atractivo accesible), Almuerzo (Soda tradicional PYME local), Tarde (Visita a Feria del Agricultor)
 * - Tiempos de traslado estimados con iconos de navegación
 * - Botones directos "Ruta en Waze" y "Ruta en Google Maps"
 * - Certificación topográfica y perfil 3D
 */
export const VisorItinerarioGenerado: React.FC<VisorItinerarioGeneradoProps> = ({
  itinerario,
  onReiniciar
}) => {
  const [diaFiltroActivo, setDiaFiltroActivo] = useState<number>(1);

  const abrirWaze = (url: string) => {
    window.open(url, '_blank');
  };

  const abrirGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  const abrirRutaCompleta = () => {
    window.open(itinerario.enlaceRutaCompletaGoogle, '_blank');
  };

  // Agrupación por días
  const paradasPorDia = [1, 2, 3].map((diaNum) => ({
    dia: diaNum,
    paradas: itinerario.paradas.filter((p) => p.dia === diaNum)
  })).filter((grupo) => grupo.paradas.length > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner de Resultado Ejecutivo */}
      <CivicCard
        level={3}
        className="p-6 sm:p-8 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-[#001326] to-slate-950 relative overflow-hidden"
        style={{ borderRadius: '24px' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Itinerario Pura Vida Generado por IA • Cantón de {itinerario.canton}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {itinerario.tituloItinerario}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {itinerario.resumenEjecutivo}
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                <Car size={13} className="text-cyan-400" />
                Vehículo: <strong className="text-white">{itinerario.tipoVehiculo}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                <Calendar size={13} className="text-purple-400" />
                Duración: <strong className="text-white">{itinerario.duracionDias} {itinerario.duracionDias === 1 ? 'Día' : 'Días'}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                {itinerario.certificacionTopografica.esAccesibleLey7600
                  ? 'Certificación Ley 7600 Total'
                  : 'Ruta Estándar'}
              </span>
            </div>
          </div>

          {/* Tarjeta de Presupuesto Consolidado */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 p-4 rounded-xl bg-slate-950/85 border border-white/10 shrink-0 shadow-lg">
            <div className="flex justify-between items-center gap-4 text-xs">
              <span className="text-slate-400">Presupuesto Asignado:</span>
              <span className="font-mono text-white font-bold">
                ₡ {itinerario.presupuestoSolicitado.toLocaleString('es-CR')}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4 text-xs">
              <span className="text-slate-400">Gasto Estimado:</span>
              <span className="font-mono text-cyan-300 font-bold">
                ₡ {itinerario.gastoTotalEstimado.toLocaleString('es-CR')}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4 text-xs border-t border-white/10 pt-2">
              <span className="text-emerald-400 font-medium">Saldo Disponible:</span>
              <span className="font-mono text-emerald-300 font-bold">
                ₡ {itinerario.saldoRestante.toLocaleString('es-CR')}
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
              Ruta Completa en Google Maps
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

      {/* Navegación por Días (si tiene más de 1 día) */}
      {paradasPorDia.length > 1 && (
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="text-xs text-slate-400 font-semibold mr-1">Seleccionar Día:</span>
          {paradasPorDia.map((grupo) => (
            <button
              key={grupo.dia}
              onClick={() => setDiaFiltroActivo(grupo.dia)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                diaFiltroActivo === grupo.dia
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              Día {grupo.dia} ({grupo.paradas.length} paradas)
            </button>
          ))}
          <button
            onClick={() => setDiaFiltroActivo(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              diaFiltroActivo === 0
                ? 'bg-cyan-500 text-slate-950 font-extrabold'
                : 'bg-slate-900 text-slate-300 border border-white/10 hover:border-white/20'
            }`}
          >
            Ver Todos los Días
          </button>
        </div>
      )}

      {/* Tarjeta del Itinerario Generado Paso a Paso */}
      <div className="space-y-6">
        {paradasPorDia
          .filter((grupo) => diaFiltroActivo === 0 || diaFiltroActivo === grupo.dia)
          .map((grupo) => (
            <div key={grupo.dia} className="space-y-4">
              <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="text-cyan-400" size={20} />
                  <span>Día {grupo.dia}: {itinerario.canton}</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {grupo.paradas.length} Paradas Programadas
                </span>
              </div>

              <div className="space-y-4">
                {grupo.paradas.map((parada, index) => {
                  const esManana = parada.franjaHoraria === 'Mañana';
                  const esAlmuerzo = parada.franjaHoraria === 'Almuerzo';
                  const esTarde = parada.franjaHoraria === 'Tarde';

                  return (
                    <CivicCard
                      key={parada.id}
                      level={2}
                      className="p-5 sm:p-6 border-white/10 hover:border-cyan-400/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden"
                      style={{ borderRadius: '18px' }}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {/* Indicador de Franja / Secuencia */}
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex flex-col items-center justify-center text-cyan-300 font-mono font-bold shrink-0 shadow-inner">
                          <span className="text-[10px] uppercase font-semibold text-cyan-400">Paso</span>
                          <span className="text-base leading-none">{index + 1}</span>
                        </div>

                        <div className="space-y-2 flex-1">
                          {/* Tags de Franja Horaria y Hora */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {parada.franjaHoraria}
                            </span>
                            <span className="font-mono text-cyan-400 font-bold">{parada.hora}</span>
                            <span className="text-slate-600">•</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 capitalize text-[11px]">
                              {parada.categoria === 'comida'
                                ? 'Soda Tradicional PYME'
                                : parada.categoria === 'feria'
                                ? 'Feria del Agricultor'
                                : 'Atractivo Accesible'}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="font-mono text-emerald-300 text-xs font-semibold">
                              ₡ {parada.costoEstimadoColones.toLocaleString('es-CR')}
                            </span>
                          </div>

                          {/* Nombre de la Actividad */}
                          <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                            {parada.actividad}
                          </h4>

                          {/* Lugar Geográfico */}
                          <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                            <MapPin size={13} className="text-cyan-400 shrink-0" />
                            <span>{parada.lugar}</span>
                          </p>

                          {/* Descripción Detallada */}
                          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                            {parada.descripcion}
                          </p>

                          {/* Tiempo Estimado de Traslado */}
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 font-mono">
                            <Car size={14} className="text-cyan-400 shrink-0" />
                            <span>{parada.tiempoTrasladoEstimado}</span>
                          </div>

                          {/* Badges de Accesibilidad y Normativa */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {parada.badges.map((b) => (
                              <AccessibilityBadge key={b} type={b} size="sm" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Botones Directos de Ruta en Waze y Google Maps */}
                      <div className="flex flex-row lg:flex-col gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                        <CivicButton
                          variant="primary"
                          size="sm"
                          onClick={() => abrirWaze(parada.enlaceWaze)}
                          leftIcon={<Navigation size={13} />}
                        >
                          Ruta en Waze
                        </CivicButton>
                        <CivicButton
                          variant="outline"
                          size="sm"
                          onClick={() => abrirGoogleMaps(parada.enlaceGoogleMaps)}
                          leftIcon={<ExternalLink size={13} />}
                        >
                          Ruta en Google Maps
                        </CivicButton>
                      </div>
                    </CivicCard>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
