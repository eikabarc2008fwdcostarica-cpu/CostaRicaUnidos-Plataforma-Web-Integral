import React, { useState } from 'react';
import { BarChart3, PieChart, Coins, Vote, TrendingUp, Info } from 'lucide-react';
import { ProyectoVecinal } from '../../data/participacionData';
import { CivicCard } from '../common/CivicCard';

interface GraficoPresupuestoParticipativoProps {
  proyectos: ProyectoVecinal[];
}

/**
 * GraficoPresupuestoParticipativo — Módulo 11: Participación Ciudadana
 * Visualizador interactivo reactivo de métricas electorales y distribución
 * presupuestaria cantonal con SVG responsivo de alta tasa de refresco (60fps).
 */
export const GraficoPresupuestoParticipativo: React.FC<GraficoPresupuestoParticipativoProps> = ({
  proyectos
}) => {
  const [hoveredProyectoId, setHoveredProyectoId] = useState<string | null>(null);

  // Cálculos estadísticos reactivos
  const totalVotos = proyectos.reduce((acc, p) => acc + p.votosAcumulados, 0);
  const maxVotos = Math.max(...proyectos.map((p) => p.votosAcumulados), 1);
  const presupuestoTotal = proyectos.reduce((acc, p) => acc + p.presupuestoEstimadoColones, 0);

  // Agrupación por categoría
  const categoriasMap = proyectos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + p.presupuestoEstimadoColones;
    return acc;
  }, {} as Record<string, number>);

  const categoriasData = Object.entries(categoriasMap).map(([nombre, monto]) => ({
    nombre,
    monto,
    porcentaje: ((monto / presupuestoTotal) * 100).toFixed(1)
  }));

  const colorPorCategoria: Record<string, string> = {
    'Infraestructura & Aceras': '#38BDF8', // Cyan
    'Espacios Verdes y Parques': '#34D399', // Emerald
    'Seguridad y Movilidad': '#F59E0B',    // Amber
    'Cultura e Juventud': '#A855F7',       // Purple
    'Cultura y Juventud': '#A855F7'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Gráfico 1: Conteo de Votos Ciudadanos en Tiempo Real (Barras Reactivas) */}
      <CivicCard
        level={2}
        className="lg:col-span-7 p-6 border-white/10 space-y-6"
        style={{ borderRadius: '20px' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <Vote size={20} />
            <span>Conteo de Votos en Tiempo Real</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/30">
            Total Votos: {totalVotos.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Resultados auditables vinculados a cédulas únicas verificadas ante el Ministerio de Hacienda.
        </p>

        {/* Barras de Votación */}
        <div className="space-y-4">
          {proyectos.map((proyecto, index) => {
            const porcentaje = ((proyecto.votosAcumulados / totalVotos) * 100).toFixed(1);
            const anchoBarra = `${(proyecto.votosAcumulados / maxVotos) * 100}%`;
            const isHovered = hoveredProyectoId === proyecto.id;
            const esLider = index === 0;

            return (
              <div
                key={proyecto.id}
                onMouseEnter={() => setHoveredProyectoId(proyecto.id)}
                onMouseLeave={() => setHoveredProyectoId(null)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isHovered ? 'bg-white/[0.05] border border-cyan-500/30' : 'bg-white/[0.02] border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    {esLider && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        1° Lugar
                      </span>
                    )}
                    <span className="font-semibold text-white truncate">
                      {proyecto.titulo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-cyan-300 font-bold">
                      {proyecto.votosAcumulados} votos
                    </span>
                    <span className="text-slate-400 text-[11px]">({porcentaje}%)</span>
                  </div>
                </div>

                {/* Barra de Progreso SVG / CSS */}
                <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: anchoBarra,
                      background: esLider
                        ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)'
                        : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                      boxShadow: isHovered ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none'
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                  <span>{proyecto.distrito}</span>
                  <span>{proyecto.presupuestoFormateado}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CivicCard>

      {/* Gráfico 2: Asignación Presupuestaria Comunal por Categoría */}
      <CivicCard
        level={2}
        className="lg:col-span-5 p-6 border-white/10 space-y-6 flex flex-col justify-between"
        style={{ borderRadius: '20px' }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <Coins size={20} />
              <span>Presupuesto Participativo Cantonal</span>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Distribución del fondo de ₡ {presupuestoTotal.toLocaleString()} asignado a votación vecinal.
          </p>
        </div>

        {/* Desglose de Categorías */}
        <div className="space-y-3.5 my-auto">
          {categoriasData.map((cat) => {
            const barColor = colorPorCategoria[cat.nombre] || '#38BDF8';
            return (
              <div key={cat.nombre} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className="text-slate-200 font-medium">{cat.nombre}</span>
                  </div>
                  <span className="font-mono text-slate-300 font-bold">
                    ₡ {cat.monto.toLocaleString()} ({cat.porcentaje}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.porcentaje}%`,
                      backgroundColor: barColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Leyenda y Nota de Blindaje */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Info size={14} />
            <span>Fiscalización Ciudadana</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Los proyectos más votados por distrito serán ratificados e incorporados al Plan Operativo Anual (POA) del Concejo Municipal.
          </p>
        </div>
      </CivicCard>
    </div>
  );
};
