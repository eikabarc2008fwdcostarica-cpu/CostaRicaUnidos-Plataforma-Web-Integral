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
      className="absolute top-full left-0 w-full z-50 border-b shadow-2xl py-8 px-6 md:px-16 transition-all duration-300 animate-fadeIn bg-theme-header-bg border-theme-header-border text-cru-text"
      style={{
        backgroundColor: 'var(--theme-header-bg)',
        borderBottom: '2px solid var(--theme-header-border)',
        boxShadow: 'var(--cru-card-shadow, 0 20px 45px -10px rgba(0, 0, 0, 0.10))',
        opacity: 1
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado del eje municipal */}
        <div
          className="flex items-center gap-2 mb-6 font-bold text-xs tracking-widest uppercase"
          style={{ color: 'var(--cru-accent-red, #C22727)' }}
        >
          <IconoCategoria className="w-4 h-4" strokeWidth={2} />
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
                className="group p-5 rounded-2xl border shadow-sm transition-all duration-200 flex flex-col justify-between"
                style={{
                  minHeight: '170px',
                  backgroundColor: 'var(--cru-surface-muted)',
                  borderColor: 'var(--cru-border)',
                  borderRadius: '20px',
                  boxShadow: 'var(--cru-card-shadow, 0 4px 14px rgba(0, 0, 0, 0.04))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--cru-card-bg)';
                  e.currentTarget.style.borderColor = 'var(--cru-accent-blue-border, rgba(0, 83, 175, 0.35))';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--cru-surface-muted)';
                  e.currentTarget.style.borderColor = 'var(--cru-border)';
                  e.currentTarget.style.boxShadow = 'var(--cru-card-shadow, 0 4px 14px rgba(0, 0, 0, 0.04))';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: 'var(--cru-accent-red-bg)',
                      color: 'var(--cru-accent-red, #C22727)',
                      border: '1px solid var(--cru-accent-red-border)'
                    }}
                  >
                    <IconoModulo className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <h4
                    className="font-bold text-base mb-1.5 transition-colors"
                    style={{
                      color: 'var(--cru-text)',
                      fontFamily: 'var(--font-main, "Poppins", sans-serif)'
                    }}
                  >
                    {m.titulo}
                  </h4>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--cru-text-soft)', fontWeight: 500 }}
                  >
                    {m.desc}
                  </p>
                </div>
                <div
                  className="mt-4 flex items-center gap-1 text-xs font-semibold group-hover:translate-x-1 transition-transform"
                  style={{ color: 'var(--cru-accent-blue)' }}
                >
                  <span>Acceder al módulo</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
