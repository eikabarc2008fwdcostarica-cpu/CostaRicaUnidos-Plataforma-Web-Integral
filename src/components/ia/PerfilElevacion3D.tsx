import React from 'react';
import { Mountain, AlertTriangle, ShieldCheck, TrendingUp, Navigation2 } from 'lucide-react';
import { PuntoRelieve3D, CertificacionTopografica } from '../../services/itinerarioIAPlanner';
import { CivicCard } from '../common/CivicCard';

interface PerfilElevacion3DProps {
  puntos: PuntoRelieve3D[];
  certificacion: CertificacionTopografica;
}

/**
 * PerfilElevacion3D — Módulo 12 (RF-12.2): Motor de IA Topográfico
 * Visualizador interactivo del perfil altimétrico y gradientes de pendiente,
 * aprovechando el modelo digital de elevación 3D provisto por Eiker en la cartografía base.
 */
export const PerfilElevacion3D: React.FC<PerfilElevacion3DProps> = ({
  puntos,
  certificacion
}) => {
  if (!puntos || puntos.length === 0) return null;

  const maxAlt = Math.max(...puntos.map((p) => p.altitudMsnm));
  const minAlt = Math.min(...puntos.map((p) => p.altitudMsnm));
  const totalKm = puntos[puntos.length - 1].km || 1;

  // Parámetros del SVG
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const rangoAlt = maxAlt - minAlt === 0 ? 100 : maxAlt - minAlt;

  const calcularCoords = (km: number, alt: number) => {
    const x = paddingX + (km / totalKm) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((alt - minAlt) / rangoAlt) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  // Generar path del gráfico de elevación
  const pathD = puntos.reduce((acc, p, i) => {
    const { x, y } = calcularCoords(p.km, p.altitudMsnm);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Área con gradiente debajo de la curva
  const firstPoint = calcularCoords(puntos[0].km, puntos[0].altitudMsnm);
  const lastPoint = calcularCoords(puntos[puntos.length - 1].km, puntos[puntos.length - 1].altitudMsnm);
  const areaD = `${pathD} L ${lastPoint.x} ${svgHeight - paddingY} L ${firstPoint.x} ${svgHeight - paddingY} Z`;

  return (
    <CivicCard
      level={2}
      className="p-6 border-white/10 space-y-6"
      style={{ borderRadius: '20px' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Mountain className="text-amber-400" size={18} />
            Perfil de Elevación y Pendientes Topográficas 3D
          </h4>
          <p className="text-xs text-slate-300">
            Datos derivados del modelo de relieve 3D de Costa Rica (Cartografía de Eiker).
          </p>
        </div>

        {/* Badge Certificación */}
        <div>
          {certificacion.esAccesibleLey7600 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              <ShieldCheck size={14} />
              Certificado Ley 7600 (Pendiente ≤ 8%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <AlertTriangle size={14} />
              Exige Tracción 4x4 (Pendiente &gt; 16%)
            </span>
          )}
        </div>
      </div>

      {/* Gráfico SVG Reactivo de Elevación */}
      <div className="w-full bg-slate-950/70 p-4 rounded-xl border border-white/5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px] select-none"
        >
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas de Grilla */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={svgWidth - paddingX}
            y2={paddingY}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4"
          />
          <line
            x1={paddingX}
            y1={svgHeight - paddingY}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY}
            stroke="rgba(255,255,255,0.15)"
          />

          {/* Área de fondo con gradiente */}
          <path d={areaD} fill="url(#elevationGrad)" />

          {/* Curva de relieve */}
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos y Etiquetas */}
          {puntos.map((punto, i) => {
            const { x, y } = calcularCoords(punto.km, punto.altitudMsnm);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  className="fill-cyan-400 stroke-slate-950 stroke-2"
                />
                {/* Altitud arriba del punto */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-[11px] fill-cyan-200 font-mono font-bold"
                >
                  {punto.altitudMsnm}m
                </text>
                {/* Etiqueta del tramo */}
                <text
                  x={x}
                  y={svgHeight - paddingY + 18}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-medium"
                >
                  {punto.etiquetaTramo}
                </text>
                <text
                  x={x}
                  y={svgHeight - paddingY + 28}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {punto.km} km
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tarjetas de Métricas Topográficas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-0.5">
          <span className="text-slate-400">Altitud Máxima</span>
          <div className="text-base font-bold font-mono text-white">
            {certificacion.altitudMaxima} msnm
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-0.5">
          <span className="text-slate-400">Desnivel Acumulado</span>
          <div className="text-base font-bold font-mono text-cyan-400">
            +{certificacion.desnivelTotalMetros} m
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-0.5">
          <span className="text-slate-400">Pendiente Máxima</span>
          <div className={`text-base font-bold font-mono ${certificacion.pendienteMaximaPorcentaje > 16 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {certificacion.pendienteMaximaPorcentaje}%
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-0.5">
          <span className="text-slate-400">Pendiente Media</span>
          <div className="text-base font-bold font-mono text-slate-200">
            {certificacion.pendienteMediaPorcentaje}%
          </div>
        </div>
      </div>

      {/* Dictamen Oficial de Seguridad y Viabilidad Vial */}
      <div
        className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
          certificacion.esAccesibleLey7600
            ? 'bg-sky-500/10 border-sky-500/30 text-sky-200'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}
      >
        <Navigation2 size={18} className="shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-1 text-sm font-bold">
            Dictamen de Seguridad Vial y Topográfica:
          </strong>
          {certificacion.diagnosticoSeguridad}
        </div>
      </div>
    </CivicCard>
  );
};
