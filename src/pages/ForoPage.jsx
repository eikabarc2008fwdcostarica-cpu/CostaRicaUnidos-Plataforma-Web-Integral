import React from 'react';
import Navbar from '../components/Navbar';
import ForoTico from '../components/foro/ForoTico';
import { MessageSquare, Users, ShieldCheck, Sparkles, Landmark, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForoPage() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg,#00040D)] text-[var(--theme-text-primary,#F1F5F9)] selection:bg-sky-500 selection:text-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <ForoTico showHeader={true} />
      </main>

      {/* Pie de página institucional */}
      <footer className="border-t border-[var(--cru-border,rgba(255,255,255,0.1))] bg-[var(--cru-surface,#070D1B)] mt-16 py-8 px-4 sm:px-6 lg:px-8 text-xs text-[var(--cru-text-muted,#94A3B8)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-semibold text-[var(--cru-text,#E2E8F0)]">
              Foro Tico Soberano · Módulo M04 Participación Ciudadana
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              Persistencia en tiempo real contra db.json
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/gobernanza" className="hover:text-sky-300 transition-colors">
              Gobernanza
            </Link>
            <Link to="/participacion" className="hover:text-sky-300 transition-colors">
              Presupuestos Participativos
            </Link>
            <Link to="/seguridad-emergencias" className="hover:text-sky-300 transition-colors">
              Emergencias CNE
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
