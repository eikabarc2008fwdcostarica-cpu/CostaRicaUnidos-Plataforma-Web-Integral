import React from 'react';
import Navbar from '../components/Navbar';
import NoticiasSection from '../components/noticias/NoticiasSection';
import { Newspaper, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Página Principal del Módulo 01: Noticias y Comunicados Municipales
 * Ruta: /noticias
 */
export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg,#00040D)] text-[var(--theme-text-primary,#F1F5F9)] selection:bg-sky-500 selection:text-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full mx-auto py-6">
        <NoticiasSection mostrarEncabezadoCompleto={true} />
      </main>

      {/* Pie de página institucional */}
      <footer className="border-t border-[var(--cru-border,rgba(255,255,255,0.1))] bg-[var(--cru-surface,#070D1B)] mt-16 py-8 px-4 sm:px-6 lg:px-8 text-xs text-[var(--cru-text-muted,#94A3B8)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="font-semibold text-[var(--cru-text,#E2E8F0)]">
              M01 · Portal Nacional y Noticias Cantonales/Municipales
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              Control de Acceso RBAC (Editor Municipal) & Persistencia db.json
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/foro" className="hover:text-sky-300 transition-colors">
              Foro Tico
            </Link>
            <Link to="/gobernanza" className="hover:text-sky-300 transition-colors">
              Gobernanza
            </Link>
            <Link to="/participacion" className="hover:text-sky-300 transition-colors">
              Participación
            </Link>
            <Link to="/mapa-gis" className="hover:text-sky-300 transition-colors">
              Cartografía 3D
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
