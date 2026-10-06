import React, { useState } from 'react';
import { Route, Clock, Mountain, ShieldCheck, MapPin, Compass, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { RutaPreconfigurada, RUTAS_PRECONFIGURADAS_DATA } from '../../data/turismoData';
import { CivicCard } from '../common/CivicCard';
import { CivicButton } from '../common/CivicButton';
import { AccessibilityBadge } from '../common/AccessibilityBadge';

interface RutasPreconfiguradasProps {
  onSeleccionarRutaParaIA?: (ruta: RutaPreconfigurada) => void;
}

/**
 * RutasPreconfiguradas — Módulo 09: Turismo Cantonal
 * Visualizador de itinerarios oficiales preconfigurados de 1 y 2 días,
 * con cronograma por paradas, topografía y badges de movilidad.
 */
export const RutasPreconfiguradas: React.FC<RutasPreconfiguradasProps> = ({
  onSeleccionarRutaParaIA
}) => {
  const [rutaExpandidaId, setRutaExpandidaId] = useState<string>('ruta-1dia-urbana');

  const toggleExpandir = (id: string) => {
    setRutaExpandidaId((prev) => (prev === id ? '' : id));
  };

  const abrirEnGoogleMapsRuta = (ruta: RutaPreconfigurada) => {
    const paradas = Array.isArray(ruta?.paradas) ? ruta.paradas : [];
    const coords = paradas.map((p) => `${p.lat},${p.lng}`).join('/');
    window.open(`https://www.google.com/maps/dir/${coords}`, '_blank');
  };

  const rutas = Array.isArray(RUTAS_PRECONFIGURADAS_DATA) ? RUTAS_PRECONFIGURADAS_DATA : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#062A77] flex items-center gap-2">
            <Route className="text-[#0053AF]" size={22} />
            Rutas e Itinerarios Oficiales Sugeridos
          </h3>
          <p className="text-sm text-slate-700 mt-1 font-medium">
            Circuitos probados con certificación de viabilidad vial, horarios y accesibilidad.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rutas.map((ruta) => {
          const estaExpandida = rutaExpandidaId === ruta.id;
          const esAltaDificultad = ruta.duracion === '2 Días';

          return (
            <div
              key={ruta.id}
              className={`transition-all duration-300 bg-white border ${
                estaExpandida ? 'border-[#0053AF] shadow-lg' : 'border-slate-200 shadow-sm'
              } rounded-2xl overflow-hidden`}
            >
              {/* Encabezado con Imagen */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={ruta.imagenPortada}
                  alt={ruta.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#062A77] text-white backdrop-blur-md shadow-sm">
                    {ruta.duracion}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                      esAltaDificultad
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {ruta.dificultad}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h4 className="text-lg font-bold text-white drop-shadow-md">
                    {ruta.titulo}
                  </h4>
                </div>
              </div>

              {/* Cuerpo de la Ruta */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {ruta.descripcion}
                </p>

                {/* Perfil Topográfico Resumen */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                  <Mountain size={15} className="text-amber-600 shrink-0" />
                  <span>
                    <strong className="text-slate-900">Topografía:</strong> {ruta.elevacionMaxima}
                  </span>
                </div>

                {/* Paradas del Itinerario (Desplegable) */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleExpandir(ruta.id)}
                    className="w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-[#0053AF] hover:text-[#062A77] transition-colors"
                  >
                    <span>
                      Ver Cronograma de Paradas ({(ruta?.paradas || []).length} paradas)
                    </span>
                    {estaExpandida ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {estaExpandida && (
                    <div className="mt-3 space-y-3 pl-2 border-l-2 border-[#0053AF]/40">
                      {(ruta?.paradas || []).map((parada, idx) => (
                        <div key={idx} className="relative pl-4 space-y-1">
                          <div className="absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0053AF] ring-4 ring-white" />
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-[#0053AF]">
                              {parada.horaSugerida}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize font-medium">
                              {parada.tipo}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#062A77]">
                            {parada.titulo}
                          </p>
                          <p className="text-xs text-slate-600 flex items-center gap-1">
                            <MapPin size={12} className="text-slate-500" />
                            {parada.lugar}
                          </p>
                          <p className="text-xs text-slate-700 leading-snug">
                            {parada.descripcion}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(parada?.badges || []).map((b) => (
                              <AccessibilityBadge key={b} type={b} size="sm" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <CivicButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => abrirEnGoogleMapsRuta(ruta)}
                    style={{ backgroundColor: '#0053AF', borderColor: '#0053AF', color: '#FFFFFF', fontWeight: 600 }}
                    leftIcon={<Navigation size={14} />}
                  >
                    Navegar Ruta Completa
                  </CivicButton>
                  {onSeleccionarRutaParaIA && (
                    <CivicButton
                      variant="outline"
                      size="sm"
                      onClick={() => onSeleccionarRutaParaIA(ruta)}
                      style={{ borderColor: '#062A77', color: '#062A77' }}
                    >
                      Adaptar con IA
                    </CivicButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
