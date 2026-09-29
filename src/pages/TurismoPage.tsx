import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Database,
  Check,
  Copy,
  Accessibility,
  Car,
  Navigation,
  Footprints,
  Heart,
  SquareParking,
  X
} from 'lucide-react';
import { DESTINOS_TURISTICOS_DATA, DestinoTuristicoPOI, getGeoJsonTurismoPOI } from '../data/turismoData';
import { FichaDestinoTuristico } from '../components/turismo/FichaDestinoTuristico';
import { RutasPreconfiguradas } from '../components/turismo/RutasPreconfiguradas';
import { CivicCard } from '../components/common/CivicCard';
import { CivicButton } from '../components/common/CivicButton';
import Navbar from '../components/Navbar';
import { AccessibilityBadgeType } from '../components/common/AccessibilityBadge';

type CategoriaFiltro = 'todas' | 'Naturaleza y Parques' | 'Cultura e Historia' | 'Aventura y Senderismo' | 'Miradores y Paisajismo';
type LogisticaFiltro = 'todos' | AccessibilityBadgeType;

/**
 * TurismoPage — Módulo 09: Guía de Turismo Cantonal y Aventura Sostenible
 * 
 * Implementa:
 * - Fotografías auténticas costarricenses en alta resolución.
 * - Filtros instantáneos funcionales por cantón y por nivel de accesibilidad normado.
 * - Sistema de badges profesionales Lucide (Ley 7600, Automóvil bajo, 4x4, Senderismo, Pet-friendly, Parqueo).
 * - Rutas e itinerarios sugeridos y conexión con el Planificador de Itinerarios IA.
 */
export default function TurismoPage() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaFiltro>('todas');
  const [cantonFiltro, setCantonFiltro] = useState<string>('todos');
  const [logisticaFiltro, setLogisticaFiltro] = useState<LogisticaFiltro>('todos');
  const [geojsonCopiado, setGeojsonCopiado] = useState(false);
  const [mostrarGeoJsonModal, setMostrarGeoJsonModal] = useState(false);

  // Lista dinámica de cantones disponibles en el dataset
  const cantonesDisponibles = useMemo(() => {
    return Array.from(new Set(DESTINOS_TURISTICOS_DATA.map((d) => d.canton))).sort();
  }, []);

  // Filtrado reactivo de destinos por texto, categoría, cantón y accesibilidad
  const destinosFiltrados = useMemo(() => {
    return DESTINOS_TURISTICOS_DATA.filter((dest) => {
      const matchTexto =
        dest.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        dest.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        dest.distrito.toLowerCase().includes(busqueda.toLowerCase()) ||
        dest.canton.toLowerCase().includes(busqueda.toLowerCase()) ||
        dest.provincia.toLowerCase().includes(busqueda.toLowerCase());

      const matchCategoria =
        categoriaActiva === 'todas' || dest.categoria === categoriaActiva;

      const matchCanton =
        cantonFiltro === 'todos' || dest.canton.toLowerCase() === cantonFiltro.toLowerCase();

      const matchLogistica =
        logisticaFiltro === 'todos' || dest.badgesAccesibilidad.includes(logisticaFiltro as AccessibilityBadgeType);

      return matchTexto && matchCategoria && matchCanton && matchLogistica;
    });
  }, [busqueda, categoriaActiva, cantonFiltro, logisticaFiltro]);

  const copiarGeoJson = () => {
    const geojson = JSON.stringify(getGeoJsonTurismoPOI(), null, 2);
    navigator.clipboard.writeText(geojson);
    setGeojsonCopiado(true);
    setTimeout(() => setGeojsonCopiado(false), 2500);
  };

  const irAPlanificadorIA = () => {
    navigate('/itinerario-ia');
  };

  const restablecerFiltros = () => {
    setBusqueda('');
    setCategoriaActiva('todas');
    setCantonFiltro('todos');
    setLogisticaFiltro('todos');
  };

  return (
    <div className="min-h-screen bg-[#00040D] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner Hero Principal */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#000b1a] to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Compass size={14} className="animate-spin-slow" />
                Módulo 09 • Turismo Cantonal y Aventura Sostenible
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Descubre Costa Rica con{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  Accesibilidad Universal
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Fotografías auténticas de nuestros parques y volcanes, destinos certificados con accesibilidad
                según Ley 7600, especificaciones de tracción (automóvil bajo / 4x4 / senderismo) y conexión directa con el planificador de itinerarios.
              </p>
            </div>

            {/* Tarjeta de Acceso Rápido al Planificador de IA */}
            <div className="lg:max-w-xs w-full">
              <CivicCard
                level={3}
                className="p-5 border-cyan-400/40 bg-slate-900/80 backdrop-blur-xl relative overflow-hidden"
                style={{ borderRadius: '20px' }}
              >
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Sparkles size={16} />
                  <span>Motor Generativo RF-12.2</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Planificador 'Itinerario Pura Vida'
                </h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  Crea tu ruta personalizada por presupuesto, tracción (automóvil bajo / 4x4 / autobús), cantón y ferias locales.
                </p>
                <CivicButton
                  variant="primary"
                  fullWidth
                  size="sm"
                  onClick={irAPlanificadorIA}
                  leftIcon={<Sparkles size={14} />}
                >
                  Generar Itinerario IA
                </CivicButton>
              </CivicCard>
            </div>
          </div>
        </div>

        {/* Sección de Rutas Preconfiguradas (1 y 2 Días) */}
        <RutasPreconfiguradas onSeleccionarRutaParaIA={() => navigate('/itinerario-ia')} />

        {/* Barra de Búsqueda y Filtros Instantáneos de Destinos */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="text-cyan-400" size={24} />
                Catálogo de Destinos Verificados de Costa Rica
              </h2>
              <p className="text-sm text-slate-300">
                Filtra instantáneamente por cantón y nivel de accesibilidad o tracción vehicular.
              </p>
            </div>

            {/* Botón de Integración GIS para Eiker */}
            <CivicButton
              variant="outline"
              size="sm"
              onClick={() => setMostrarGeoJsonModal(true)}
              leftIcon={<Database size={15} />}
            >
              Exportar POI GeoJSON (GIS Eiker)
            </CivicButton>
          </div>

          {/* Fila de Controles de Filtrado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Input de Búsqueda */}
            <div className="lg:col-span-5 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, cantón, provincia o atractivo..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Filtro Instantáneo por Cantón */}
            <div className="lg:col-span-3">
              <select
                value={cantonFiltro}
                onChange={(e) => setCantonFiltro(e.target.value)}
                aria-label="Filtrar por cantón"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="todos">Todos los cantones ({cantonesDisponibles.length})</option>
                {cantonesDisponibles.map((canton) => (
                  <option key={canton} value={canton}>
                    Cantón: {canton}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Categoría */}
            <div className="lg:col-span-2">
              <select
                value={categoriaActiva}
                onChange={(e) => setCategoriaActiva(e.target.value as CategoriaFiltro)}
                aria-label="Filtrar por categoría"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="todas">Todas las categorías</option>
                <option value="Naturaleza y Parques">Naturaleza y Parques</option>
                <option value="Miradores y Paisajismo">Miradores y Paisajismo</option>
                <option value="Aventura y Senderismo">Aventura y Senderismo</option>
                <option value="Cultura e Historia">Cultura e Historia</option>
              </select>
            </div>

            {/* Filtro por Accesibilidad / Nivel de Tracción */}
            <div className="lg:col-span-2">
              <select
                value={logisticaFiltro}
                onChange={(e) => setLogisticaFiltro(e.target.value as LogisticaFiltro)}
                aria-label="Filtrar por accesibilidad"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="todos">Toda accesibilidad</option>
                <option value="ley-7600">Ley 7600 Universal</option>
                <option value="automovil-bajo">Automóvil Bajo</option>
                <option value="acceso-4x4">Exige Tracción 4x4</option>
                <option value="senderismo">Senderismo</option>
                <option value="pet-friendly">Pet-Friendly</option>
                <option value="parqueo-disponible">Parqueo Disponible</option>
              </select>
            </div>
          </div>

          {/* Badges de Filtro Rápido Instantáneo por Nivel de Accesibilidad */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
                <Filter size={13} className="text-cyan-400" />
                Accesibilidad y Tracción:
              </span>
              <button
                onClick={() => setLogisticaFiltro('todos')}
                className={`px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'todos'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                Todos ({DESTINOS_TURISTICOS_DATA.length})
              </button>
              <button
                onClick={() => setLogisticaFiltro('ley-7600')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'ley-7600'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-white/5 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/15'
                }`}
              >
                <Accessibility size={13} />
                Ley 7600 Total
              </button>
              <button
                onClick={() => setLogisticaFiltro('automovil-bajo')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'automovil-bajo'
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                    : 'bg-white/5 text-sky-300 border-sky-500/40 hover:bg-sky-500/15'
                }`}
              >
                <Car size={13} />
                Automóvil Bajo
              </button>
              <button
                onClick={() => setLogisticaFiltro('acceso-4x4')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'acceso-4x4'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-white/5 text-amber-300 border-amber-500/40 hover:bg-amber-500/15'
                }`}
              >
                <Navigation size={13} />
                Tracción 4x4
              </button>
              <button
                onClick={() => setLogisticaFiltro('senderismo')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'senderismo'
                    ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                    : 'bg-white/5 text-teal-300 border-teal-500/40 hover:bg-teal-500/15'
                }`}
              >
                <Footprints size={13} />
                Senderismo
              </button>
              <button
                onClick={() => setLogisticaFiltro('pet-friendly')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'pet-friendly'
                    ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold'
                    : 'bg-white/5 text-rose-300 border-rose-500/40 hover:bg-rose-500/15'
                }`}
              >
                <Heart size={13} />
                Pet-Friendly
              </button>
              <button
                onClick={() => setLogisticaFiltro('parqueo-disponible')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'parqueo-disponible'
                    ? 'bg-indigo-500 text-slate-950 border-indigo-400 font-bold'
                    : 'bg-white/5 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/15'
                }`}
              >
                <SquareParking size={13} />
                Parqueo Disponible
              </button>
            </div>

            {/* Badges de Filtro Instantáneo por Cantón */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1 border-t border-white/5">
              <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <MapPin size={13} className="text-cyan-400" />
                Cantón:
              </span>
              <button
                onClick={() => setCantonFiltro('todos')}
                className={`px-2.5 py-0.5 rounded-full text-xs transition-all ${
                  cantonFiltro === 'todos'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Todos
              </button>
              {cantonesDisponibles.map((canton) => (
                <button
                  key={canton}
                  onClick={() => setCantonFiltro(canton)}
                  className={`px-2.5 py-0.5 rounded-full text-xs transition-all ${
                    cantonFiltro === canton
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {canton}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grilla de Destinos */}
        {destinosFiltrados.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <Compass size={40} className="mx-auto text-slate-500" />
            <p className="text-slate-400 text-base">
              No se encontraron destinos turísticos que coincidan con los filtros seleccionados.
            </p>
            <CivicButton
              variant="outline"
              size="sm"
              onClick={restablecerFiltros}
            >
              Restablecer filtros
            </CivicButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinosFiltrados.map((destino) => (
              <FichaDestinoTuristico
                key={destino.id}
                destino={destino}
                onAgregarAItinerario={() => navigate('/itinerario-ia')}
              />
            ))}
          </div>
        )}

        {/* Modal de Exportación GeoJSON para Eiker */}
        {mostrarGeoJsonModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in"
          >
            <div className="relative max-w-2xl w-full bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Database size={18} />
                  <span>Dataset GeoJSON de Destinos Turísticos (Para Eiker)</span>
                </div>
                <button
                  onClick={() => setMostrarGeoJsonModal(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Este GeoJSON estandarizado contiene los puntos de interés con coordenadas WGS84,
                categoría, cantón, cotas de elevación y badges de accesibilidad para su renderizado en MapLibre / Deck.gl.
              </p>

              <pre className="max-h-64 overflow-y-auto p-3 rounded-lg bg-black/80 text-[11px] font-mono text-cyan-300 border border-white/10 select-all">
                {JSON.stringify(getGeoJsonTurismoPOI(), null, 2)}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {DESTINOS_TURISTICOS_DATA.length} entidades cartográficas disponibles
                </span>
                <div className="flex gap-2">
                  <CivicButton
                    variant="outline"
                    size="sm"
                    onClick={copiarGeoJson}
                    leftIcon={geojsonCopiado ? <Check size={14} /> : <Copy size={14} />}
                  >
                    {geojsonCopiado ? '¡Copiado!' : 'Copiar GeoJSON'}
                  </CivicButton>
                  <CivicButton
                    variant="primary"
                    size="sm"
                    onClick={() => setMostrarGeoJsonModal(false)}
                  >
                    Cerrar
                  </CivicButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
