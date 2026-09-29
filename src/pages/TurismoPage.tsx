import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Search, Filter, Sparkles, MapPin, Database, Check, Copy, Share2, Mountain, ShieldCheck, HeartHandshake } from 'lucide-react';
import { DESTINOS_TURISTICOS_DATA, DestinoTuristicoPOI, getGeoJsonTurismoPOI } from '../data/turismoData';
import { FichaDestinoTuristico } from '../components/turismo/FichaDestinoTuristico';
import { RutasPreconfiguradas } from '../components/turismo/RutasPreconfiguradas';
import { CivicCard } from '../components/common/CivicCard';
import { CivicButton } from '../components/common/CivicButton';
import { AccessibilityBadge } from '../components/common/AccessibilityBadge';

type CategoriaFiltro = 'todas' | 'Naturaleza y Parques' | 'Cultura e Historia' | 'Aventura y Senderismo';
type LogisticaFiltro = 'todos' | 'ley-7600' | 'acceso-4x4' | 'pet-friendly';

/**
 * TurismoPage — Módulo 09: Guía de Turismo Cantonal y Aventura Sostenible
 * 
 * Implementa:
 * - Galerías visuales optimizadas para alto rendimiento.
 * - Filtros rápidos por accesibilidad universal (Ley 7600), tracción 4x4 y pet-friendly.
 * - Rutas e itinerarios preconfigurados de 1 y 2 días.
 * - Exportador de dataset GeoJSON de POIs turísticos para el módulo GIS de Eiker.
 * - Conexión directa con el motor de IA 'Itinerario Pura Vida'.
 */
export default function TurismoPage() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaFiltro>('todas');
  const [logisticaFiltro, setLogisticaFiltro] = useState<LogisticaFiltro>('todos');
  const [geojsonCopiado, setGeojsonCopiado] = useState(false);
  const [mostrarGeoJsonModal, setMostrarGeoJsonModal] = useState(false);

  // Filtrado reactivo de destinos
  const destinosFiltrados = useMemo(() => {
    return DESTINOS_TURISTICOS_DATA.filter((dest) => {
      const matchTexto =
        dest.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        dest.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        dest.distrito.toLowerCase().includes(busqueda.toLowerCase()) ||
        dest.canton.toLowerCase().includes(busqueda.toLowerCase());

      const matchCategoria =
        categoriaActiva === 'todas' || dest.categoria === categoriaActiva;

      const matchLogistica =
        logisticaFiltro === 'todos' || dest.badgesAccesibilidad.includes(logisticaFiltro);

      return matchTexto && matchCategoria && matchLogistica;
    });
  }, [busqueda, categoriaActiva, logisticaFiltro]);

  const copiarGeoJson = () => {
    const geojson = JSON.stringify(getGeoJsonTurismoPOI(), null, 2);
    navigator.clipboard.writeText(geojson);
    setGeojsonCopiado(true);
    setTimeout(() => setGeojsonCopiado(false), 2500);
  };

  const irAPlanificadorIA = () => {
    navigate('/itinerario-ia');
  };

  return (
    <div className="min-h-screen bg-[#00040D] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-12">
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
                Descubre el Cantón con{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  Accesibilidad Total
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Destinos con certificación de movilidad Ley 7600, alertas de tracción 4x4
                para alta montaña, itinerarios sugeridos y conexión directa con el motor de IA.
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
                  Crea tu ruta personalizada por presupuesto, tracción (4x2/4x4) y ferias activas con análisis de relieve 3D.
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

        {/* Barra de Búsqueda y Filtros de Destinos */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="text-cyan-400" size={24} />
                Catálogo de Destinos Verificados
              </h2>
              <p className="text-sm text-slate-300">
                Puntos de interés con especificaciones topográficas y logísticas.
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Input de Búsqueda */}
            <div className="md:col-span-6 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, distrito o palabra clave..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Filtro por Categoría */}
            <div className="md:col-span-3">
              <select
                value={categoriaActiva}
                onChange={(e) => setCategoriaActiva(e.target.value as CategoriaFiltro)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="todas">Todas las categorías</option>
                <option value="Naturaleza y Parques">Naturaleza y Parques</option>
                <option value="Cultura e Historia">Cultura e Historia</option>
                <option value="Aventura y Senderismo">Aventura y Senderismo</option>
              </select>
            </div>

            {/* Filtro por Accesibilidad / Logística */}
            <div className="md:col-span-3">
              <select
                value={logisticaFiltro}
                onChange={(e) => setLogisticaFiltro(e.target.value as LogisticaFiltro)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="todos">Toda accesibilidad y tracción</option>
                <option value="ley-7600">♿ Solo Ley 7600 Accesible</option>
                <option value="acceso-4x4">🚙 Solo Exige Tracción 4x4</option>
                <option value="pet-friendly">🐾 Solo Pet-Friendly</option>
              </select>
            </div>
          </div>

          {/* Badges de Filtro Rápido */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Filtro rápido:</span>
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
              className={`px-3 py-1 rounded-full border transition-all ${
                logisticaFiltro === 'ley-7600'
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Ley 7600 Universal
            </button>
            <button
              onClick={() => setLogisticaFiltro('acceso-4x4')}
              className={`px-3 py-1 rounded-full border transition-all ${
                logisticaFiltro === 'acceso-4x4'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Tracción 4x4 Requerida
            </button>
            <button
              onClick={() => setLogisticaFiltro('pet-friendly')}
              className={`px-3 py-1 rounded-full border transition-all ${
                logisticaFiltro === 'pet-friendly'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Pet-Friendly
            </button>
          </div>
        </div>

        {/* Grilla de Destinos */}
        {destinosFiltrados.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <Compass size={40} className="mx-auto text-slate-500" />
            <p className="text-slate-400 text-base">
              No se encontraron destinos que coincidan con los filtros seleccionados.
            </p>
            <CivicButton
              variant="outline"
              size="sm"
              onClick={() => {
                setBusqueda('');
                setCategoriaActiva('todas');
                setLogisticaFiltro('todos');
              }}
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
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Este GeoJSON estandarizado contiene los puntos de interés con coordenadas WGS84,
                categoría, cotas de elevación y atributos de accesibilidad para su renderizado en MapLibre / Deck.gl.
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
