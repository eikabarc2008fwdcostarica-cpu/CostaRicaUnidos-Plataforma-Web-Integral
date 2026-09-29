import React, { useState } from 'react';
import { Sparkles, DollarSign, Car, Accessibility, Store, Clock, Calendar, Check, Compass, Sliders } from 'lucide-react';
import { SolicitudItinerarioIA } from '../../services/itinerarioIAPlanner';
import { CivicCard } from '../common/CivicCard';
import { CivicButton } from '../common/CivicButton';

interface FormularioItinerarioIAProps {
  onGenerar: (solicitud: SolicitudItinerarioIA) => void;
  estaGenerando?: boolean;
}

/**
 * FormularioItinerarioIA — Módulo 12 (RF-12.2): Motor Generativo
 * Formulario multivariable con restricciones presupuestarias, tipo de tracción,
 * certificación Ley 7600 y fomento de ferias y PyMEs locales.
 */
export const FormularioItinerarioIA: React.FC<FormularioItinerarioIAProps> = ({
  onGenerar,
  estaGenerando = false
}) => {
  const [presupuesto, setPresupuesto] = useState<number>(35000);
  const [tipoVehiculo, setTipoVehiculo] = useState<'4x2' | '4x4'>('4x2');
  const [requiereLey7600, setRequiereLey7600] = useState<boolean>(false);
  const [incluirFeria, setIncluirFeria] = useState<boolean>(true);
  const [duracionDias, setDuracionDias] = useState<1 | 2>(1);
  const [ritmoViaje, setRitmoViaje] = useState<'relajado' | 'equilibrado' | 'intenso'>('equilibrado');
  const [intereses, setIntereses] = useState<('cultura' | 'naturaleza' | 'gastronomia' | 'aventura')[]>([
    'cultura',
    'gastronomia'
  ]);

  const toggleInteres = (item: 'cultura' | 'naturaleza' | 'gastronomia' | 'aventura') => {
    setIntereses((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handlePresetPresupuesto = (monto: number) => {
    setPresupuesto(monto);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerar({
      presupuestoColones: presupuesto,
      tipoVehiculo,
      requiereLey7600,
      incluirFeria,
      duracionDias,
      ritmoViaje,
      intereses
    });
  };

  return (
    <CivicCard
      level={2}
      className="p-6 sm:p-8 border-white/10 space-y-6"
      style={{ borderRadius: '24px' }}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-cyan-400" size={22} />
            Parámetros del Motor Generativo de IA
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Optimización algorítmica de rutas, paradas y viabilidad topográfica.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          RF-12.2
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Variable 1: Presupuesto del Usuario */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign size={14} className="text-cyan-400" />
              Presupuesto Disponible por Persona (₡ Colones):
            </span>
            <span className="text-sm font-mono text-cyan-300 font-bold">
              ₡ {presupuesto.toLocaleString()}
            </span>
          </label>

          <input
            type="range"
            min={10000}
            max={100000}
            step={2500}
            value={presupuesto}
            onChange={(e) => setPresupuesto(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          {/* Presets Rápidos */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => handlePresetPresupuesto(15000)}
              className={`px-3 py-1 rounded-full border transition-all ${
                presupuesto === 15000
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              ₡ 15,000 (Económico)
            </button>
            <button
              type="button"
              onClick={() => handlePresetPresupuesto(35000)}
              className={`px-3 py-1 rounded-full border transition-all ${
                presupuesto === 35000
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              ₡ 35,000 (Equilibrado)
            </button>
            <button
              type="button"
              onClick={() => handlePresetPresupuesto(75000)}
              className={`px-3 py-1 rounded-full border transition-all ${
                presupuesto === 75000
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              ₡ 75,000 (Todo Incluido)
            </button>
          </div>
        </div>

        {/* Variables 2 & 3: Tipo de Tracción & Ley 7600 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tracción Vehicular */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Car size={15} className="text-cyan-400" />
              Tipo de Tracción Vehicular:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoVehiculo('4x2')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  tipoVehiculo === '4x2'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                Vehículo 4x2 (Urbano)
              </button>
              <button
                type="button"
                onClick={() => setTipoVehiculo('4x4')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  tipoVehiculo === '4x4'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                Tracción 4x4 (Montaña)
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {tipoVehiculo === '4x2'
                ? 'Rutas pavimentadas con pendientes moderadas.'
                : 'Habilita accesos a lastre y miradores de alta montaña.'}
            </p>
          </div>

          {/* Accesibilidad Ley 7600 */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Accessibility size={15} className="text-sky-400" />
              Accesibilidad Universal (Ley 7600):
            </label>
            <button
              type="button"
              onClick={() => {
                const nuevo = !requiereLey7600;
                setRequiereLey7600(nuevo);
                if (nuevo) setTipoVehiculo('4x2'); // Ley 7600 prioriza rutas sin exigencia 4x4
              }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-between ${
                requiereLey7600
                  ? 'bg-sky-500/20 text-sky-200 border-sky-400'
                  : 'bg-slate-900 text-slate-400 border-white/10'
              }`}
            >
              <span>Exigir 100% Accesible Ley 7600</span>
              <span
                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                  requiereLey7600 ? 'bg-sky-400 text-slate-950' : 'border border-white/20'
                }`}
              >
                {requiereLey7600 && <Check size={12} />}
              </span>
            </button>
            <p className="text-[11px] text-slate-400">
              Garantiza pendientes peatonales ≤ 8%, rampas y baños adaptados.
            </p>
          </div>
        </div>

        {/* Variables 4 & 5: Inclusión de Ferias / Duración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incluir Feria del Agricultor & Comercios */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Store size={15} className="text-emerald-400" />
              Consumo Local & Ferias:
            </label>
            <button
              type="button"
              onClick={() => setIncluirFeria(!incluirFeria)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-between ${
                incluirFeria
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
                  : 'bg-slate-900 text-slate-400 border-white/10'
              }`}
            >
              <span>Incluir Parada en Feria del Agricultor</span>
              <span
                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                  incluirFeria ? 'bg-emerald-400 text-slate-950' : 'border border-white/20'
                }`}
              >
                {incluirFeria && <Check size={12} />}
              </span>
            </button>
            <p className="text-[11px] text-slate-400">
              Prioriza PyMEs locales y gastronomía tradicional campesina.
            </p>
          </div>

          {/* Duración */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar size={15} className="text-purple-400" />
              Duración del Itinerario:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuracionDias(1)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  duracionDias === 1
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                    : 'bg-slate-900 text-slate-400 border-white/10'
                }`}
              >
                1 Día Completo
              </button>
              <button
                type="button"
                onClick={() => setDuracionDias(2)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  duracionDias === 2
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                    : 'bg-slate-900 text-slate-400 border-white/10'
                }`}
              >
                2 Días (Fin de Semana)
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Distribuye las paradas estratégicamente según el tiempo disponible.
            </p>
          </div>
        </div>

        {/* Áreas de Interés */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Compass size={14} className="text-cyan-400" />
            Intereses Temáticos:
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            {(
              [
                { id: 'cultura', label: '🏛️ Cultura e Historia' },
                { id: 'naturaleza', label: '🌿 Naturaleza y Parques' },
                { id: 'gastronomia', label: '☕ Gastronomía y Café' },
                { id: 'aventura', label: '🚵 Aventura y Senderos' }
              ] as const
            ).map((item) => {
              const seleccionado = intereses.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInteres(item.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    seleccionado
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón de Generación */}
        <div className="pt-2">
          <CivicButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={estaGenerando}
            loadingText="Computando Itinerario Pura Vida..."
            leftIcon={<Sparkles size={18} />}
          >
            Generar Itinerario Pura Vida con IA
          </CivicButton>
        </div>
      </form>
    </CivicCard>
  );
};
