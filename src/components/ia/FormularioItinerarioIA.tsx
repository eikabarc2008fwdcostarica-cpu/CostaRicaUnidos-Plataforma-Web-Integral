import React, { useState } from 'react';
import {
  Sparkles,
  DollarSign,
  Car,
  Navigation,
  Bus,
  Accessibility,
  Calendar,
  MapPin,
  Check,
  Compass,
  Sliders,
  Store
} from 'lucide-react';
import { SolicitudItinerarioIA, TipoVehiculoItinerario } from '../../services/itinerarioIAPlanner';
import { CivicCard } from '../common/CivicCard';
import { CivicButton } from '../common/CivicButton';

interface FormularioItinerarioIAProps {
  onGenerar: (solicitud: SolicitudItinerarioIA) => void;
  estaGenerando?: boolean;
}

/**
 * FormularioItinerarioIA — Motor Generativo de Itinerarios
 * Controles de alta fidelidad:
 * - Slider estilizado para presupuesto (₡15,000 a ₡150,000)
 * - Selector segmentado de vehículo (Automóvil bajo / 4x4 / Transporte público)
 * - Switch de Accesibilidad Obligatoria Ley 7600
 * - Selectores de cantón destino y duración (1 a 3 días)
 */
export const FormularioItinerarioIA: React.FC<FormularioItinerarioIAProps> = ({
  onGenerar,
  estaGenerando = false
}) => {
  const [presupuesto, setPresupuesto] = useState<number>(45000);
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculoItinerario>('Automóvil bajo');
  const [requiereLey7600, setRequiereLey7600] = useState<boolean>(true);
  const [cantonDestino, setCantonDestino] = useState<string>('Quepos');
  const [duracionDias, setDuracionDias] = useState<1 | 2 | 3>(1);

  const cantonesOpciones = [
    { id: 'Quepos', nombre: 'Quepos (Manuel Antonio)', provincia: 'Puntarenas' },
    { id: 'Poás', nombre: 'Poás (Volcán Poás)', provincia: 'Alajuela' },
    { id: 'Monteverde', nombre: 'Monteverde (Bosque Nuboso)', provincia: 'Puntarenas' },
    { id: 'Talamanca', nombre: 'Talamanca (Cahuita Caribe)', provincia: 'Limón' },
    { id: 'San Carlos', nombre: 'San Carlos (La Fortuna)', provincia: 'Alajuela' },
    { id: 'San José', nombre: 'San José (Distrito Capital)', provincia: 'San José' }
  ];

  const handlePresetPresupuesto = (monto: number) => {
    setPresupuesto(monto);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerar({
      presupuestoColones: presupuesto,
      tipoVehiculo,
      requiereLey7600,
      cantonDestino,
      duracionDias
    });
  };

  return (
    <div
      className="p-6 sm:p-8 space-y-6"
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        borderTop: '4px solid #0053AF',
        boxShadow: '0 4px 20px rgba(6, 42, 119, 0.08)'
      }}
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#062A77' }}>
            <Sparkles size={22} style={{ color: '#0053AF' }} />
            Parámetros del Motor Generativo de IA
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Personaliza el algoritmo con tu presupuesto, movilidad, cantón y días de viaje.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold">
          Itinerario Pura Vida
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Variable 1: Slider Estilizado de Presupuesto en Colones (₡15,000 a ₡150,000) */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="presupuesto-slider"
              className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5"
            >
              <DollarSign size={16} style={{ color: '#0053AF' }} />
              <span>Presupuesto por Persona (₡ Colones):</span>
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-mono text-[#062A77] font-extrabold">
                ₡ {presupuesto.toLocaleString('es-CR')}
              </span>
              <span className="text-[11px] text-slate-600 font-mono font-bold">CRC</span>
            </div>
          </div>

          {/* Slider Stylized Range */}
          <div className="space-y-2">
            <input
              id="presupuesto-slider"
              type="range"
              min={15000}
              max={150000}
              step={5000}
              value={presupuesto}
              onChange={(e) => setPresupuesto(Number(e.target.value))}
              aria-label="Presupuesto por persona en colones"
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0053AF] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <div className="flex justify-between text-[11px] text-slate-600 font-mono font-medium">
              <span>Min: ₡ 15,000</span>
              <span>Medio: ₡ 80,000</span>
              <span>Max: ₡ 150,000</span>
            </div>
          </div>

          {/* Presets Rápidos */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <span className="text-slate-600 text-xs self-center mr-1 font-semibold">Preajustes:</span>
            {[15000, 35000, 75000, 150000].map((monto) => (
              <button
                key={monto}
                type="button"
                onClick={() => handlePresetPresupuesto(monto)}
                className={`px-3 py-1 rounded-full border text-xs font-mono transition-all ${
                  presupuesto === monto
                    ? 'bg-[#0053AF] text-white font-bold border-[#0053AF] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                ₡ {monto.toLocaleString('es-CR')}
              </button>
            ))}
          </div>
        </div>

        {/* Variable 2: Selector Segmentado de Vehículo */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Car size={15} style={{ color: '#0053AF' }} />
            <span>Tipo de Vehículo / Movilidad:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setTipoVehiculo('Automóvil bajo')}
              className={`p-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 transition-all ${
                tipoVehiculo === 'Automóvil bajo'
                  ? 'bg-blue-50 text-[#062A77] border-[#0053AF] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Car size={20} className={tipoVehiculo === 'Automóvil bajo' ? 'text-[#0053AF]' : 'text-slate-500'} />
              <span>Automóvil bajo</span>
              <span className="text-[10px] font-normal text-slate-500 text-center">Vías pavimentadas urbanas</span>
            </button>

            <button
              type="button"
              onClick={() => setTipoVehiculo('4x4')}
              className={`p-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 transition-all ${
                tipoVehiculo === '4x4'
                  ? 'bg-amber-50 text-amber-900 border-amber-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Navigation size={20} className={tipoVehiculo === '4x4' ? 'text-amber-700' : 'text-slate-500'} />
              <span>Tracción 4x4</span>
              <span className="text-[10px] font-normal text-slate-500 text-center">Lastre y senderos montañosos</span>
            </button>

            <button
              type="button"
              onClick={() => setTipoVehiculo('Transporte público')}
              className={`p-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 transition-all ${
                tipoVehiculo === 'Transporte público'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Bus size={20} className={tipoVehiculo === 'Transporte público' ? 'text-emerald-700' : 'text-slate-500'} />
              <span>Transporte público</span>
              <span className="text-[10px] font-normal text-slate-500 text-center">Buses cantonales con rampa</span>
            </button>
          </div>
        </div>

        {/* Variables 3 & 4: Switch Ley 7600 y Cantón / Duración */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Switch de Accesibilidad Obligatoria Ley 7600 */}
          <div className="md:col-span-12 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label
                htmlFor="switch-ley7600"
                className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                onClick={() => setRequiereLey7600(!requiereLey7600)}
              >
                <Accessibility size={18} className="text-emerald-700" />
                <span className="text-[#062A77] font-bold text-sm">Accesibilidad Obligatoria Ley 7600</span>
              </label>
              <p className="text-xs text-slate-600 max-w-xl">
                Garantiza que el 100% de los destinos, sodas PYME y ferias dispongan de rampas certificadas,
                pendientes peatonales menores al 8% y sanitarios adaptados.
              </p>
            </div>

            {/* Switch UI Button */}
            <button
              id="switch-ley7600"
              type="button"
              role="switch"
              aria-checked={requiereLey7600}
              onClick={() => setRequiereLey7600(!requiereLey7600)}
              className={`w-14 h-8 shrink-0 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                requiereLey7600 ? 'bg-emerald-600 shadow-sm' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out flex items-center justify-center ${
                  requiereLey7600 ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {requiereLey7600 && <Check size={14} className="text-emerald-700 stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* Selector de Cantón Destino */}
          <div className="md:col-span-6 space-y-2">
            <label
              htmlFor="canton-destino"
              className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5"
            >
              <MapPin size={15} style={{ color: '#0053AF' }} />
              <span>Cantón Destino:</span>
            </label>
            <select
              id="canton-destino"
              value={cantonDestino}
              onChange={(e) => setCantonDestino(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0053AF] font-medium shadow-sm"
            >
              {cantonesOpciones.map((opcion) => (
                <option key={opcion.id} value={opcion.id}>
                  {opcion.nombre} — {opcion.provincia}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-600">
              Se adaptarán las paradas a los atractivos y PyMEs del cantón seleccionado.
            </p>
          </div>

          {/* Selector de Duración (1 a 3 Días) */}
          <div className="md:col-span-6 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Calendar size={15} className="text-purple-700" />
              <span>Duración del Itinerario:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((dias) => (
                <button
                  key={dias}
                  type="button"
                  onClick={() => setDuracionDias(dias)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    duracionDias === dias
                      ? 'bg-purple-100 text-purple-900 border-purple-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {dias} {dias === 1 ? 'Día' : 'Días'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-600">
              {duracionDias === 1 && 'Día 1: Mañana (Atractivo), Almuerzo (Soda PYME), Tarde (Feria del Agricultor).'}
              {duracionDias === 2 && '2 Días: Recorrido completo de fin de semana con paradas gastronómicas y culturales.'}
              {duracionDias === 3 && '3 Días: Inmersión total con senderos de flora y fauna, trapiches y mirador del atardecer.'}
            </p>
          </div>
        </div>

        {/* Botón de Generación con IA */}
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
    </div>
  );
};
