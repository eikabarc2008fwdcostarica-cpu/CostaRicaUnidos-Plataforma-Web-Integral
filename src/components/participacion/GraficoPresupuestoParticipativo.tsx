import React, { useState } from 'react';
import { BarChart3, PieChart, Coins, Vote, TrendingUp, Info } from 'lucide-react';
import { ProyectoVecinal } from '../../data/participacionData';

interface GraficoPresupuestoParticipativoProps {
  proyectos: ProyectoVecinal[];
}

/**
 * GraficoPresupuestoParticipativo — Módulo 11: Participación Ciudadana
 * Visualizador interactivo reactivo de métricas electorales y distribución
 * presupuestaria cantonal con paleta oficial Azul Marino, Azul Real y Rojo Costarricense.
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
    'Infraestructura & Aceras': '#0053AF',    // Azul Real
    'Espacios Verdes y Parques': '#059669',   // Verde Esmeralda
    'Seguridad y Movilidad': '#D97706',       // Ámbar
    'Cultura e Juventud': '#C22727',          // Rojo Costarricense
    'Cultura y Juventud': '#C22727'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Gráfico 1: Conteo de Votos Ciudadanos en Tiempo Real (Barras Reactivas) */}
      <div
        className="lg:col-span-7 p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#062A77] font-bold text-lg">
            <Vote size={22} className="text-[#0053AF]" />
            <span>Conteo de Votos en Tiempo Real</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#0053AF] font-mono font-bold border border-blue-200">
            Total Votos: {totalVotos.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-slate-600 font-medium">
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
                  isHovered ? 'bg-blue-50/50 border border-blue-200' : 'bg-slate-50/70 border border-slate-200/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2 gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    {esLider && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        1° Lugar
                      </span>
                    )}
                    <span className="font-bold text-slate-800 truncate text-sm">
                      {proyecto.titulo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-[#0053AF] font-bold text-sm">
                      {proyecto.votosAcumulados} votos
                    </span>
                    <span className="text-slate-600 text-xs font-semibold">({porcentaje}%)</span>
                  </div>
                </div>

                {/* Barra de Progreso Limpia sin riel negro */}
                <div className="w-full h-3.5 rounded-full bg-slate-200 overflow-hidden relative border border-slate-300/60 p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: anchoBarra,
                      background: esLider
                        ? 'linear-gradient(90deg, #062A77 0%, #0053AF 65%, #C22727 100%)'
                        : 'linear-gradient(90deg, #0053AF 0%, #0284c7 100%)',
                      boxShadow: isHovered ? '0 0 10px rgba(0, 83, 175, 0.4)' : 'none'
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-xs text-slate-700 font-medium">
                  <span>{proyecto.distrito}</span>
                  <span className="font-mono font-bold text-[#062A77]">{proyecto.presupuestoFormateado}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráfico 2: Asignación Presupuestaria Comunal por Categoría */}
      <div
        className="lg:col-span-5 p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#062A77] font-bold text-lg">
              <Coins size={22} className="text-[#0053AF]" />
              <span>Presupuesto Participativo Cantonal</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Distribución del fondo de ₡ {presupuestoTotal.toLocaleString()} asignado a votación vecinal.
          </p>
        </div>

        {/* Desglose de Categorías */}
        <div className="space-y-4 my-auto">
          {categoriasData.map((cat) => {
            const barColor = colorPorCategoria[cat.nombre] || '#0053AF';
            return (
              <div key={cat.nombre} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className="text-slate-800 font-bold text-xs">{cat.nombre}</span>
                  </div>
                  <span className="font-mono text-[#062A77] font-bold">
                    ₡ {cat.monto.toLocaleString()} ({cat.porcentaje}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300/50">
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

        {/* Leyenda y Nota de Fiscalización Ciudadana */}
        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/90 text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 text-[#062A77] font-bold">
            <Info size={15} className="text-[#0053AF]" />
            <span>Fiscalización Ciudadana</span>
          </div>
          <p className="text-[12px] leading-relaxed text-slate-700">
            Los proyectos más votados por distrito serán ratificados e incorporados al Plan Operativo Anual (POA) del Concejo Municipal.
          </p>
        </div>
      </div>
    </div>
  );
};
