import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Mountain,
  Map,
  Compass,
  ShieldCheck,
  ArrowRight,
  Accessibility,
  Car,
  Sprout,
  Loader2,
  Navigation,
  Store,
  CheckCircle2
} from 'lucide-react';
import { SolicitudItinerarioIA, ItinerarioGeneradoResultado, generarItinerarioPuraVida } from '../services/itinerarioIAPlanner';
import { FormularioItinerarioIA } from '../components/ia/FormularioItinerarioIA';
import { VisorItinerarioGenerado } from '../components/ia/VisorItinerarioGenerado';
import { CivicCard } from '../components/common/CivicCard';
import Navbar from '../components/Navbar';

/**
 * ItinerarioIAPage — Módulo 12 (RF-12.2): Planificador 'Itinerario Pura Vida'
 * 
 * Motor generativo de Inteligencia Artificial que ensambla itinerarios personalizados
 * contemplando topografía 3D, leyes de accesibilidad (Ley 7600), requerimientos de tracción,
 * presupuesto en colones y fomento al comercio local y ferias del agricultor.
 */
export default function ItinerarioIAPage() {
  const [itinerarioGenerado, setItinerarioGenerado] = useState<ItinerarioGeneradoResultado | null>(null);
  const [cargando, setCargando] = useState(false);
  const [faseCarga, setFaseCarga] = useState(0);

  const fasesTexto = [
    'Consultando perfiles de elevación 3D y pendientes cantonales...',
    'Certificando accesibilidad universal según Ley N° 7600...',
    'Geolocalizando Sodas tradicionales PYME y Ferias del Agricultor...',
    'Trazando rutas optimizadas y puntos de enlace con Waze y Google Maps...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cargando) {
      setFaseCarga(0);
      interval = setInterval(() => {
        setFaseCarga((prev) => (prev < fasesTexto.length - 1 ? prev + 1 : prev));
      }, 350);
    }
    return () => clearInterval(interval);
  }, [cargando]);

  const handleGenerar = (solicitud: SolicitudItinerarioIA) => {
    setCargando(true);
    // Simulación del procesamiento algorítmico multivariable con animación cívica
    setTimeout(() => {
      const resultado = generarItinerarioPuraVida(solicitud);
      setItinerarioGenerado(resultado);
      setCargando(false);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 1500);
  };

  const handleReiniciar = () => {
    setItinerarioGenerado(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#00040D] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner Hero Principal */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#00172e] to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} className="animate-spin-slow" />
              Módulo 12 (RF-12.2) • Motor Generativo de IA y Topografía 3D
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Planificador{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                'Itinerario Pura Vida'
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Diseña tu recorrido cantonal ideal mediante algoritmos de optimización multivariable.
              Calculamos perfiles de pendiente en 3D para certificar accesibilidad universal (Ley 7600)
              o advertir exigencia de vehículos 4x4, vinculando tu ruta con Waze y Google Maps.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <BrainCircuit size={15} className="text-cyan-400" />
                Optimización Multivariable
              </span>
              <span className="flex items-center gap-1.5">
                <Mountain size={15} className="text-amber-400" />
                Relieve 3D de Eiker
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                Certificación Ley 7600
              </span>
            </div>
          </div>
        </div>

        {/* Animación de Carga Cívica */}
        {cargando && (
          <CivicCard
            level={3}
            className="p-8 sm:p-12 border-cyan-500/40 bg-slate-900/90 backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300"
            style={{ borderRadius: '24px' }}
          >
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-emerald-500/20 border-b-emerald-400 animate-spin-reverse" />
              <Sparkles size={32} className="text-cyan-300 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-white">
                Ensamblando Itinerario Soberano 'Pura Vida'
              </h3>
              <p className="text-sm font-mono text-cyan-300 h-6 transition-all duration-300">
                {fasesTexto[faseCarga]}
              </p>
            </div>

            {/* Barra de Progreso Cívica */}
            <div className="w-full max-w-md mx-auto bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((faseCarga + 1) / fasesTexto.length) * 100}%` }}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-400 font-mono pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Modelo Digital de Terreno 3D
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Validación Padrón y PyMEs
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Georutas Waze / Maps
              </span>
            </div>
          </CivicCard>
        )}

        {/* Formulario Generativo o Resultado del Itinerario */}
        {!cargando && !itinerarioGenerado && (
          <div className="space-y-6">
            <FormularioItinerarioIA
              onGenerar={handleGenerar}
              estaGenerando={cargando}
            />

            {/* Presets Informativos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <CivicCard level={1} className="p-4 border-white/5 space-y-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Accessibility className="w-4 h-4 text-cyan-400" />
                  <span>Ruta Accesible Ciudadana</span>
                </span>
                <p className="text-slate-400">
                  Limita pendientes a un máximo de 8%. Prioriza aceras continuas, sodas típicas con rampa y parques nacionales.
                </p>
              </CivicCard>

              <CivicCard level={1} className="p-4 border-white/5 space-y-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Travesía Cumbres 4x4</span>
                </span>
                <p className="text-slate-400">
                  Desbloquea senderos de lastre, miradores montañosos y pasos de quebradas con pendientes superiores al 16%.
                </p>
              </CivicCard>

              <CivicCard level={1} className="p-4 border-white/5 space-y-2">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Circuito Feria & PyMEs</span>
                </span>
                <p className="text-slate-400">
                  Incentiva el consumo en puestos de agricultores locales y sodas registradas ante el Ministerio de Hacienda.
                </p>
              </CivicCard>
            </div>
          </div>
        )}

        {/* Visualizador del Itinerario Generado */}
        {!cargando && itinerarioGenerado && (
          <VisorItinerarioGenerado
            itinerario={itinerarioGenerado}
            onReiniciar={handleReiniciar}
          />
        )}
      </div>
    </div>
  );
}
