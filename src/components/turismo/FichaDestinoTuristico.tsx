import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Mountain, ExternalLink, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { DestinoTuristicoPOI } from '../../data/turismoData';
import { CivicCard } from '../common/CivicCard';
import { CivicButton } from '../common/CivicButton';
import { AccessibilityBadge } from '../common/AccessibilityBadge';

interface FichaDestinoTuristicoProps {
  destino: DestinoTuristicoPOI;
  onVerEnMapa?: (destino: DestinoTuristicoPOI) => void;
  onAgregarAItinerario?: (destino: DestinoTuristicoPOI) => void;
}

/**
 * FichaDestinoTuristico — Módulo 09: Turismo Cantonal
 * Visualizador optimizado de destinos turísticos con galería de alto rendimiento,
 * badges normalizados (Ley 7600, 4x4, Pet-friendly) y enlaces a mapas.
 */
export const FichaDestinoTuristico: React.FC<FichaDestinoTuristicoProps> = ({
  destino,
  onVerEnMapa,
  onAgregarAItinerario
}) => {
  const [fotoActivaIndex, setFotoActivaIndex] = useState(0);
  const [modalLightboxAbierto, setModalLightboxAbierto] = useState(false);

  const totalFotos = destino.imagenes.length;

  const anteriorFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFotoActivaIndex((prev) => (prev === 0 ? totalFotos - 1 : prev - 1));
  };

  const siguienteFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFotoActivaIndex((prev) => (prev === totalFotos - 1 ? 0 : prev + 1));
  };

  const abrirWaze = () => {
    window.open(`https://waze.com/ul?ll=${destino.lat},${destino.lng}&navigate=yes`, '_blank');
  };

  const abrirGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${destino.lat},${destino.lng}`, '_blank');
  };

  return (
    <>
      <CivicCard
        level={2}
        interactive
        className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-cyan-400/40"
        style={{ borderRadius: '16px' }}
      >
        {/* Galería de Alto Rendimiento Visual */}
        <div className="relative w-full h-56 bg-slate-900 overflow-hidden group select-none">
          <img
            src={destino.imagenes[fotoActivaIndex]}
            alt={`${destino.nombre} - Foto ${fotoActivaIndex + 1}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Categoría Pill */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-900/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
              {destino.categoria}
            </span>
          </div>

          {/* Botón Ver en Grande */}
          <button
            onClick={() => setModalLightboxAbierto(true)}
            aria-label="Abrir imagen en pantalla completa"
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
          >
            <Eye size={16} />
          </button>

          {/* Controles de Carrusel */}
          {totalFotos > 1 && (
            <>
              <button
                onClick={anteriorFoto}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white/90 hover:bg-black/90 transition-opacity opacity-80 hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={siguienteFoto}
                aria-label="Siguiente foto"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white/90 hover:bg-black/90 transition-opacity opacity-80 hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {destino.imagenes.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === fotoActivaIndex ? 'bg-cyan-400 w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Elevación y Topografía */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/75 text-xs text-amber-300 font-mono border border-amber-500/30 backdrop-blur-sm">
            <Mountain size={13} />
            <span>{destino.elevacionMsnm} msnm</span>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <MapPin size={13} className="text-cyan-400" />
              <span>{destino.distrito}, {destino.canton}, {destino.provincia}</span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors">
              {destino.nombre}
            </h3>

            <p className="mt-2 text-sm text-slate-300 line-clamp-3 leading-relaxed">
              {destino.descripcion}
            </p>
          </div>

          {/* Badges de Accesibilidad y Logística */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {destino.badgesAccesibilidad.map((badgeType) => (
              <AccessibilityBadge key={badgeType} type={badgeType} size="sm" />
            ))}
          </div>

          {/* Metadatos Logísticos */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-white/[0.02] p-3 rounded-lg border border-white/5 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" />
              <span>{destino.tiempoVisitaRecomendado}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign size={13} className="text-slate-400" />
              <span className="truncate">{destino.tarifaEntrada}</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex gap-1.5">
              <CivicButton
                variant="outline"
                size="sm"
                fullWidth
                onClick={abrirGoogleMaps}
                leftIcon={<ExternalLink size={13} />}
              >
                Maps
              </CivicButton>
              <CivicButton
                variant="outline"
                size="sm"
                fullWidth
                onClick={abrirWaze}
                leftIcon={<ExternalLink size={13} />}
              >
                Waze
              </CivicButton>
            </div>
            {onAgregarAItinerario && (
              <CivicButton
                variant="primary"
                size="sm"
                onClick={() => onAgregarAItinerario(destino)}
              >
                + Planear
              </CivicButton>
            )}
          </div>
        </div>
      </CivicCard>

      {/* Lightbox Modal de Foto Completa */}
      {modalLightboxAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalLightboxAbierto(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={destino.imagenes[fotoActivaIndex]}
              alt={destino.nombre}
              className="max-w-full max-h-[80vh] rounded-xl object-contain border border-white/10 shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h4 className="text-lg font-bold text-white">{destino.nombre}</h4>
              <p className="text-sm text-slate-400">
                {destino.distrito}, {destino.canton} — {destino.elevacionMsnm} msnm
              </p>
            </div>
            <button
              onClick={() => setModalLightboxAbierto(false)}
              className="absolute -top-3 -right-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-full border border-white/20 hover:bg-slate-700"
            >
              Cerrar (Esc)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
