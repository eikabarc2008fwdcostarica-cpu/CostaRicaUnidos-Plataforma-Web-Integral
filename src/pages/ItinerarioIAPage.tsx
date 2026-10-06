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
 * ItinerarioIAPage — Planificador 'Itinerario Pura Vida'
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
    <div className="min-h-screen bg-[var(--theme-bg,#F8FAFC)] text-[var(--theme-text-primary,#0F172A)]">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner Hero Principal */}
        <div
          className="relative overflow-hidden rounded-3xl border border-blue-900 p-8 sm:p-12 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #062A77 0%, #01004E 100%)',
            borderLeft: '6px solid #C22727'
          }}
        >
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} className="text-[#93C5FD]" />
              Motor Generativo de IA y Topografía 3D
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Planificador{' '}
              <span className="text-[#93C5FD]">
                'Itinerario Pura Vida'
              </span>
            </h1>

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed">
              Diseña tu recorrido cantonal ideal mediante algoritmos de optimización multivariable.
              Calculamos perfiles de pendiente en 3D para certificar accesibilidad universal (Ley 7600)
              o advertir exigencia de vehículos 4x4, vinculando tu ruta con Waze y Google Maps.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-200 font-mono">
              <span className="flex items-center gap-1.5">
                <BrainCircuit size={15} className="text-[#93C5FD]" />
                Optimización Multivariable
              </span>
              <span className="flex items-center gap-1.5">
                <Mountain size={15} className="text-amber-300" />
                Relieve 3D de Eiker
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-300" />
                Certificación Ley 7600
              </span>
            </div>
          </div>
        </div>

        {/* Animación de Carga Cívica */}
        {cargando && (
          <div
            className="p-8 sm:p-12 text-center space-y-6 shadow-xl"
            style={{
              background: 'var(--cru-surface-card)',
              borderRadius: '24px',
              border: '1px solid var(--cru-border)',
              borderTop: '4px solid #0053AF'
            }}
          >
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-[#0053AF] animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-emerald-200 border-b-emerald-600 animate-spin-reverse" />
              <Sparkles size={32} className="text-[#0053AF] animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-[#062A77]">
                Ensamblando Itinerario Soberano 'Pura Vida'
              </h3>
              <p className="text-sm font-mono text-[#0053AF] font-bold h-6 transition-all duration-300">
                {fasesTexto[faseCarga]}
              </p>
            </div>

            {/* Barra de Progreso Cívica */}
            <div className="w-full max-w-md mx-auto bg-slate-200 rounded-full h-3 overflow-hidden border border-slate-300 p-0.5">
              <div
                className="bg-gradient-to-r from-[#0053AF] to-[#C22727] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((faseCarga + 1) / fasesTexto.length) * 100}%` }}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 font-mono pt-2 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Modelo Digital de Terreno 3D
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Validación Padrón y PyMEs
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Georutas Waze / Maps
              </span>
            </div>
          </div>
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
              <div
                className="p-5 space-y-2 shadow-sm"
                style={{
                  background: 'var(--cru-surface-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--cru-border)',
                  borderTop: '4px solid #0053AF'
                }}
              >
                <span className="font-bold text-[#062A77] flex items-center gap-1.5 text-sm">
                  <Accessibility className="w-4 h-4 text-[#0053AF]" />
                  <span>Ruta Accesible Ciudadana</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Limita pendientes a un máximo de 8%. Prioriza aceras continuas, sodas típicas con rampa y parques nacionales.
                </p>
              </div>

              <div
                className="p-5 space-y-2 shadow-sm"
                style={{
                  background: 'var(--cru-surface-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--cru-border)',
                  borderTop: '4px solid var(--cru-accent-red)'
                }}
              >
                <span className="font-bold text-[#C22727] flex items-center gap-1.5 text-sm">
                  <Car className="w-4 h-4 text-[#C22727]" />
                  <span>Travesía Cumbres 4x4</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Desbloquea senderos de lastre, miradores montañosos y pasos de quebradas con pendientes superiores al 16%.
                </p>
              </div>

              <div
                className="p-5 space-y-2 shadow-sm"
                style={{
                  background: 'var(--cru-surface-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--cru-border)',
                  borderTop: '4px solid #059669'
                }}
              >
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Circuito Feria & PyMEs</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Incentiva el consumo en puestos de agricultores locales y sodas registradas ante el Ministerio de Hacienda.
                </p>
              </div>
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
