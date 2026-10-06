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
  const [isLoading, setIsLoading] = useState(false);

  // Manejo defensivo de dataset base de destinos
  const destinosBase = useMemo(() => {
    return Array.isArray(DESTINOS_TURISTICOS_DATA) ? DESTINOS_TURISTICOS_DATA : [];
  }, []);

  // Lista dinámica de cantones disponibles en el dataset
  const cantonesDisponibles = useMemo(() => {
    if (!Array.isArray(destinosBase)) return [];
    return Array.from(new Set(destinosBase.map((d) => d?.canton).filter(Boolean))).sort();
  }, [destinosBase]);

  // Filtrado reactivo de destinos por texto, categoría, cantón y accesibilidad con protección defensiva
  const destinosFiltrados = useMemo(() => {
    if (!Array.isArray(destinosBase)) return [];
    return destinosBase.filter((dest) => {
      if (!dest) return false;
      const nom = (dest.nombre || '').toLowerCase();
      const desc = (dest.descripcion || '').toLowerCase();
      const dist = (dest.distrito || '').toLowerCase();
      const cant = (dest.canton || '').toLowerCase();
      const prov = (dest.provincia || '').toLowerCase();
      const query = (busqueda || '').toLowerCase().trim();

      const matchTexto =
        !query ||
        nom.includes(query) ||
        desc.includes(query) ||
        dist.includes(query) ||
        cant.includes(query) ||
        prov.includes(query);

      const matchCategoria =
        categoriaActiva === 'todas' || dest.categoria === categoriaActiva;

      const matchCanton =
        cantonFiltro === 'todos' || cant === cantonFiltro.toLowerCase();

      const badges = Array.isArray(dest.badgesAccesibilidad) ? dest.badgesAccesibilidad : [];
      const matchLogistica =
        logisticaFiltro === 'todos' || badges.includes(logisticaFiltro as AccessibilityBadgeType);

      return matchTexto && matchCategoria && matchCanton && matchLogistica;
    });
  }, [destinosBase, busqueda, categoriaActiva, cantonFiltro, logisticaFiltro]);

  const copiarGeoJson = () => {
    try {
      const data = typeof getGeoJsonTurismoPOI === 'function' ? getGeoJsonTurismoPOI() : { type: 'FeatureCollection', features: [] };
      const geojson = JSON.stringify(data, null, 2);
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(geojson);
      }
      setGeojsonCopiado(true);
      setTimeout(() => setGeojsonCopiado(false), 2500);
    } catch (err) {
      console.warn('Error al copiar GeoJSON:', err);
    }
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
    <div className="min-h-screen bg-[var(--theme-bg,#F8FAFC)] text-[var(--theme-text-primary,#131313)] selection:bg-[#0053AF] selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner Hero Principal */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/20"
          style={{
            background: 'linear-gradient(135deg, #062A77 0%, #01004E 100%)',
            color: '#FFFFFF'
          }}
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-xs font-semibold uppercase tracking-wider">
                <Compass size={14} className="animate-spin-slow" />
                Turismo Cantonal y Aventura Sostenible
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Descubre Costa Rica con{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
                  Accesibilidad Universal
                </span>
              </h1>
              <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
                Fotografías auténticas de nuestros parques y volcanes, destinos certificados con accesibilidad
                según Ley 7600, especificaciones de tracción (automóvil bajo / 4x4 / senderismo) y conexión directa con el planificador de itinerarios.
              </p>
            </div>

            {/* Tarjeta de Acceso Rápido al Planificador de IA */}
            <div className="lg:max-w-xs w-full">
              <div
                className="p-5 bg-white text-slate-800 relative overflow-hidden shadow-2xl border-2 border-white/90"
                style={{ borderRadius: '20px' }}
              >
                <div className="flex items-center gap-2 text-[#0053AF] font-bold text-sm">
                  <Sparkles size={16} color="#0053AF" />
                  <span>Motor Generativo de Itinerarios</span>
                </div>
                <h3 className="text-lg font-bold text-[#062A77] mt-1">
                  Planificador 'Itinerario Pura Vida'
                </h3>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed font-normal">
                  Crea tu ruta personalizada por presupuesto, tracción (automóvil bajo / 4x4 / autobús), cantón y ferias locales.
                </p>
                <CivicButton
                  variant="primary"
                  fullWidth
                  size="sm"
                  onClick={irAPlanificadorIA}
                  style={{
                    backgroundColor: '#C22727',
                    borderColor: '#C22727',
                    color: '#FFFFFF',
                    fontWeight: 700
                  }}
                  leftIcon={<Sparkles size={14} />}
                >
                  Generar Itinerario IA
                </CivicButton>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Rutas Preconfiguradas (1 y 2 Días) */}
        <RutasPreconfiguradas onSeleccionarRutaParaIA={() => navigate('/itinerario-ia')} />

        {/* Barra de Búsqueda y Filtros Instantáneos de Destinos */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#062A77] flex items-center gap-2">
                <MapPin className="text-[#0053AF]" size={24} />
                Catálogo de Destinos Verificados de Costa Rica
              </h2>
              <p className="text-sm text-slate-700 font-medium">
                Filtra instantáneamente por cantón y nivel de accesibilidad o tracción vehicular.
              </p>
            </div>

            {/* Botón de Integración GIS para Eiker */}
            <CivicButton
              variant="outline"
              size="sm"
              onClick={() => setMostrarGeoJsonModal(true)}
              style={{
                borderColor: '#0053AF',
                color: '#0053AF',
                backgroundColor: '#EFF6FF',
                fontWeight: 600
              }}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#0053AF] focus:ring-1 focus:ring-[#0053AF] shadow-sm transition-all"
              />
            </div>

            {/* Filtro Instantáneo por Cantón */}
            <div className="lg:col-span-3">
              <select
                value={cantonFiltro}
                onChange={(e) => setCantonFiltro(e.target.value)}
                aria-label="Filtrar por cantón"
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0053AF] shadow-sm"
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
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0053AF] shadow-sm"
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
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0053AF] shadow-sm"
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
              <span className="text-slate-700 font-bold flex items-center gap-1 mr-1">
                <Filter size={13} className="text-[#0053AF]" />
                Accesibilidad y Tracción:
              </span>
              <button
                onClick={() => setLogisticaFiltro('todos')}
                className={`px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'todos'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Todos ({DESTINOS_TURISTICOS_DATA.length})
              </button>
              <button
                onClick={() => setLogisticaFiltro('ley-7600')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'ley-7600'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold shadow-sm'
                    : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Accessibility size={13} />
                Ley 7600 Total
              </button>
              <button
                onClick={() => setLogisticaFiltro('automovil-bajo')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'automovil-bajo'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold shadow-sm'
                    : 'bg-white text-sky-800 border-sky-300 hover:bg-sky-50'
                }`}
              >
                <Car size={13} />
                Automóvil Bajo
              </button>
              <button
                onClick={() => setLogisticaFiltro('acceso-4x4')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'acceso-4x4'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold shadow-sm'
                    : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
                }`}
              >
                <Navigation size={13} />
                Tracción 4x4
              </button>
              <button
                onClick={() => setLogisticaFiltro('senderismo')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'senderismo'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold shadow-sm'
                    : 'bg-white text-teal-800 border-teal-300 hover:bg-teal-50'
                }`}
              >
                <Footprints size={13} />
                Senderismo
              </button>
              <button
                onClick={() => setLogisticaFiltro('pet-friendly')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'pet-friendly'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold shadow-sm'
                    : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-50'
                }`}
              >
                <Heart size={13} />
                Pet-Friendly
              </button>
              <button
                onClick={() => setLogisticaFiltro('parqueo-disponible')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  logisticaFiltro === 'parqueo-disponible'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold shadow-sm'
                    : 'bg-white text-indigo-800 border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <SquareParking size={13} />
                Parqueo Disponible
              </button>
            </div>

            {/* Badges de Filtro Instantáneo por Cantón */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs pt-2 border-t border-slate-200">
              <span className="text-slate-700 font-bold mr-1 flex items-center gap-1">
                <MapPin size={13} className="text-[#0053AF]" />
                Cantón:
              </span>
              <button
                onClick={() => setCantonFiltro('todos')}
                className={`px-2.5 py-0.5 rounded-full text-xs transition-all border ${
                  cantonFiltro === 'todos'
                    ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Todos
              </button>
              {cantonesDisponibles.map((canton) => (
                <button
                  key={canton}
                  onClick={() => setCantonFiltro(canton)}
                  className={`px-2.5 py-0.5 rounded-full text-xs transition-all border ${
                    cantonFiltro === canton
                      ? 'bg-[#0053AF] text-white border-[#0053AF] font-bold'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {canton}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grilla de Destinos con Soporte de Esqueleto de Carga */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse p-4 flex flex-col justify-between shadow-sm"
              >
                <div className="h-48 rounded-xl bg-slate-200" />
                <div className="space-y-3 mt-4">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                </div>
                <div className="h-8 rounded-lg bg-slate-200 mt-4" />
              </div>
            ))}
          </div>
        ) : destinosFiltrados.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <Compass size={40} className="mx-auto text-slate-400" />
            <p className="text-slate-700 text-base font-medium">
              No se encontraron destinos turísticos que coincidan con los filtros seleccionados.
            </p>
            <CivicButton
              variant="outline"
              size="sm"
              onClick={restablecerFiltros}
              style={{ borderColor: '#0053AF', color: '#0053AF' }}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          >
            <div className="relative max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-[#062A77] font-bold">
                  <Database size={18} color="#0053AF" />
                  <span>Dataset GeoJSON de Destinos Turísticos (Para Eiker)</span>
                </div>
                <button
                  onClick={() => setMostrarGeoJsonModal(false)}
                  className="text-slate-500 hover:text-slate-900 transition-colors p-1"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Este GeoJSON estandarizado contiene los puntos de interés con coordenadas WGS84,
                categoría, cantón, cotas de elevación y badges de accesibilidad para su renderizado en MapLibre / Deck.gl.
              </p>

              <pre className="max-h-64 overflow-y-auto p-3 rounded-lg bg-slate-950 text-[11px] font-mono text-cyan-300 border border-slate-800 select-all">
                {JSON.stringify(getGeoJsonTurismoPOI(), null, 2)}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-medium">
                  {DESTINOS_TURISTICOS_DATA.length} entidades cartográficas disponibles
                </span>
                <div className="flex gap-2">
                  <CivicButton
                    variant="outline"
                    size="sm"
                    onClick={copiarGeoJson}
                    style={{ borderColor: '#0053AF', color: '#0053AF' }}
                    leftIcon={geojsonCopiado ? <Check size={14} /> : <Copy size={14} />}
                  >
                    {geojsonCopiado ? '¡Copiado!' : 'Copiar GeoJSON'}
                  </CivicButton>
                  <CivicButton
                    variant="primary"
                    size="sm"
                    style={{ backgroundColor: '#062A77', borderColor: '#062A77', color: '#FFFFFF' }}
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
