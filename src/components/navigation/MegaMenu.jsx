import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  FileCheck2,
  Store,
  Landmark,
  FileText,
  Vote,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  Trophy,
  GraduationCap,
  Sprout,
  Compass,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export const CATEGORIAS_CIVICAS = [
  {
    id: 'tramites',
    label: 'Gestión & Trámites',
    icon: Building2,
    modulos: [
      {
        titulo: 'Ventanilla Única de Trámites',
        desc: 'Certificaciones, tasas municipales y gestión cívica.',
        path: '/portal-ciudadano',
        icon: FileCheck2
      },
      {
        titulo: 'Directorio PyMES y Patentes',
        desc: 'Comercios cantonales validados con Hacienda.',
        path: '/comercio',
        icon: Store
      },
      {
        titulo: 'Validación de Cédula',
        desc: 'Consulta oficial ante el Ministerio de Hacienda.',
        path: '/login',
        icon: Building2
      }
    ]
  },
  {
    id: 'gobierno',
    label: 'Gobierno & Concejo',
    icon: Landmark,
    modulos: [
      {
        titulo: 'Espacio Administrativo Cantonal',
        desc: 'Autoridades electas y organigrama municipal.',
        path: '/gobernanza',
        icon: Landmark
      },
      {
        titulo: 'Gaceta y Visor de Actas PDF',
        desc: 'Actas oficiales del Concejo con firma digital.',
        path: '/gobernanza',
        icon: FileText
      },
      {
        titulo: 'Presupuestos Participativos',
        desc: 'Votación cívica vinculante de proyectos comunales.',
        path: '/participacion',
        icon: Vote
      },
      {
        titulo: 'Foro Tico (Debate Comunal)',
        desc: 'Participación ciudadana y cabildo digital nacional y provincial.',
        path: '/foro',
        icon: MessageSquare
      }
    ]
  },
  {
    id: 'territorio',
    label: 'Territorio & Obras',
    icon: MapPin,
    modulos: [
      {
        titulo: 'Cartografía 3D Soberana',
        desc: 'Visor geoespacial del relieve e infraestructura.',
        path: '/mapa-gis',
        icon: MapPin
      },
      {
        titulo: 'Ventanilla de Averías Viales',
        desc: 'Reporte de baches, luminarias y fugas con foto.',
        path: '/reportar-incidencia',
        icon: AlertTriangle
      },
      {
        titulo: 'Centro de Emergencias CNE',
        desc: 'Alertas oficiales en tiempo real y red de albergues.',
        path: '/seguridad-emergencias',
        icon: ShieldAlert
      }
    ]
  },
  {
    id: 'desarrollo',
    label: 'Comunidad & CCDR',
    icon: Trophy,
    modulos: [
      {
        titulo: 'Feria del Agricultor Cantonal',
        desc: 'Croquis de puestos y precios de referencia CNP.',
        path: '/feria',
        icon: Sprout
      },
      {
        titulo: 'Comité Cantonal de Deportes',
        desc: 'Instalaciones, canchas y escuelas formativas.',
        path: '/deportes',
        icon: Trophy
      },
      {
        titulo: 'Directorio Educativo y CTPs',
        desc: 'Colegios técnicos y oferta vocacional cantonal.',
        path: '/educacion',
        icon: GraduationCap
      },
      {
        titulo: 'Turismo e Itinerario Pura Vida',
        desc: 'Rutas con accesibilidad total Ley 7600.',
        path: '/turismo',
        icon: Compass
      }
    ]
  }
];

import { useTheme } from '../../context/ThemeContext';

export default function MegaMenu({ categoriaActiva, alCerrar }) {
  const menuRef = useRef(null);
  const { theme } = useTheme();

  // Cerrar al presionar tecla Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        alCerrar?.();
      }
    }
    if (categoriaActiva) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categoriaActiva, alCerrar]);

  if (!categoriaActiva) return null;
  const categoria = CATEGORIAS_CIVICAS.find((c) => c.id === categoriaActiva);
  if (!categoria) return null;

  const IconoCategoria = categoria.icon;
  const gridColsClass = categoria.modulos.length === 4
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-1 md:grid-cols-3';

  return (
    <div
      ref={menuRef}
      onMouseLeave={alCerrar}
      role="region"
      aria-label={`Mega menú: ${categoria.label}`}
      className={`absolute top-full left-0 w-full z-50 border-b shadow-2xl py-8 px-6 md:px-16 transition-all duration-300 animate-fadeIn ${
        theme === 'dark' ? 'bg-[#0A0F1D] border-slate-800' : 'bg-white border-slate-200'
      }`}
      style={{
        backgroundColor: theme === 'dark' ? '#0A0F1D' : '#FFFFFF',
        opacity: 1,
        boxShadow: theme === 'dark'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.85)'
          : '0 20px 40px -10px rgba(0, 20, 137, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado del eje municipal */}
        <div className={`flex items-center gap-2 mb-6 font-semibold text-xs tracking-widest uppercase ${
          theme === 'dark' ? 'text-red-500' : 'text-red-600'
        }`}>
          <IconoCategoria className="w-4 h-4" strokeWidth={1.75} />
          <span>Eje Municipal: {categoria.label}</span>
        </div>

        {/* Tarjetas de módulos cívicos */}
        <div className={`grid ${gridColsClass} gap-6`}>
          {categoria.modulos.map((m) => {
            const IconoModulo = m.icon;
            return (
              <Link
                key={m.titulo}
                to={m.path}
                onClick={alCerrar}
                className={`group p-5 rounded-2xl border shadow-lg transition-all duration-200 flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'bg-[#0F172A] border-slate-800 hover:border-red-500/50 hover:bg-[#1E293B]'
                    : 'bg-slate-50 border-slate-200 hover:border-red-500/50 hover:bg-white hover:shadow-md'
                }`}
                style={{
                  minHeight: '170px',
                  backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC'
                }}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    theme === 'dark'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    <IconoModulo className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <h4 className={`font-bold text-base mb-1.5 transition-colors ${
                    theme === 'dark'
                      ? 'text-white group-hover:text-red-400'
                      : 'text-slate-900 group-hover:text-red-600'
                  }`}>
                    {m.titulo}
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {m.desc}
                  </p>
                </div>
                <div className={`mt-4 flex items-center gap-1 text-xs font-medium group-hover:translate-x-1 transition-transform ${
                  theme === 'dark' ? 'text-sky-400' : 'text-blue-700'
                }`}>
                  <span>Acceder al módulo</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
