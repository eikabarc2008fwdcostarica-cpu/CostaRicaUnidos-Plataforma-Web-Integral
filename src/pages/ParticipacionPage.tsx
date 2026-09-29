import React, { useState } from 'react';
import { Vote, Users, ShieldCheck, Mail, Coins, CheckCircle, Award, Sparkles, AlertCircle } from 'lucide-react';
import { PROYECTOS_VECINALES_DATA, ProyectoVecinal, SolicitudAudienciaConcejo } from '../data/participacionData';
import { GraficoPresupuestoParticipativo } from '../components/participacion/GraficoPresupuestoParticipativo';
import { ModalVotacionAntifraude } from '../components/participacion/ModalVotacionAntifraude';
import { BuzonAudienciaModal } from '../components/participacion/BuzonAudienciaModal';
import { CivicCard } from '../components/common/CivicCard';
import { CivicButton } from '../components/common/CivicButton';

/**
 * ParticipacionPage — Módulo 11: Participación Ciudadana y Presupuesto Participativo
 * 
 * Centraliza la soberanía vecinal con:
 * - Banco de proyectos de presupuesto participativo.
 * - Sistema de votación con validación tributaria antifraude (1 voto por cédula legal).
 * - Gráficos reactivos en tiempo real para asignación presupuestaria y votos.
 * - Buzón formal de audiencias públicas ante el Concejo Municipal.
 */
export default function ParticipacionPage() {
  const [proyectos, setProyectos] = useState<ProyectoVecinal[]>(PROYECTOS_VECINALES_DATA);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<ProyectoVecinal | null>(null);
  const [modalVotacionAbierto, setModalVotacionAbierto] = useState(false);
  const [modalAudienciaAbierto, setModalAudienciaAbierto] = useState(false);
  const [notificacionVoto, setNotificacionVoto] = useState<string | null>(null);

  // Manejo de voto exitoso con actualización reactiva en vivo
  const handleVotoExitoso = (proyectoId: string) => {
    setProyectos((prev) =>
      prev.map((proj) =>
        proj.id === proyectoId
          ? { ...proj, votosAcumulados: proj.votosAcumulados + 1 }
          : proj
      )
    );

    const proy = proyectos.find((p) => p.id === proyectoId);
    setNotificacionVoto(
      `¡Su voto fue registrado con éxito para "${proy?.titulo || 'Proyecto'}"! Los gráficos se han actualizado.`
    );
    setTimeout(() => setNotificacionVoto(null), 6000);
  };

  const abrirVotacionParaProyecto = (proyecto: ProyectoVecinal) => {
    setProyectoSeleccionado(proyecto);
    setModalVotacionAbierto(true);
  };

  const totalPresupuesto = proyectos.reduce((acc, p) => acc + p.presupuestoEstimadoColones, 0);
  const totalVotos = proyectos.reduce((acc, p) => acc + p.votosAcumulados, 0);

  return (
    <div className="min-h-screen bg-[#00040D] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Banner Hero Cívico */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#021024] to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Vote size={14} />
                Módulo 11 • Participación Ciudadana y Presupuesto Participativo
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Decide el Futuro de tu Cantón con{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  Voto Blindado
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Prioriza las obras de tu barrio con certificación de identidad ante el Ministerio
                de Hacienda (1 voto por cédula legal) y solicita audiencias directas con el Concejo Municipal.
              </p>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <CivicButton
                variant="primary"
                size="md"
                onClick={() => setModalAudienciaAbierto(true)}
                leftIcon={<Mail size={16} />}
              >
                Solicitar Audiencia al Concejo
              </CivicButton>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>Auditoría: Padrón Nivel 2 y Hacienda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notificación Flotante de Voto Exitoso */}
        {notificacionVoto && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle size={20} className="text-emerald-400 shrink-0" />
            <span>{notificacionVoto}</span>
          </div>
        )}

        {/* Estadísticas Clave en Tiempo Real */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CivicCard level={1} className="p-5 border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Fondo Presupuestario</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              ₡ {(totalPresupuesto / 1000000).toFixed(0)} Millones
            </div>
            <p className="text-[11px] text-slate-400">Fondos públicos participativos 2026</p>
          </CivicCard>

          <CivicCard level={1} className="p-5 border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Votos Ciudadanos Emitidos</span>
            <div className="text-2xl font-bold font-mono text-white">
              {totalVotos.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold">100% Verificados por Cédula</p>
          </CivicCard>

          <CivicCard level={1} className="p-5 border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Proyectos en Competencia</span>
            <div className="text-2xl font-bold font-mono text-purple-400">
              {proyectos.length} Distritales
            </div>
            <p className="text-[11px] text-slate-400">Propuestos por ADIs y colectivos</p>
          </CivicCard>

          <CivicCard level={1} className="p-5 border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Cierre del Sufragio</span>
            <div className="text-2xl font-bold text-amber-400">
              15 Nov 2026
            </div>
            <p className="text-[11px] text-slate-400">Ratificación en sesión municipal</p>
          </CivicCard>
        </div>

        {/* Gráficos Reactivos Interactivos (Recharts SVG nativo de 60fps) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Coins className="text-cyan-400" size={24} />
                Métricas Electorales y Distribución Presupuestaria
              </h2>
              <p className="text-sm text-slate-300">
                Visualización reactiva en tiempo real del escrutinio vecinal y asignación cantonal.
              </p>
            </div>
          </div>

          <GraficoPresupuestoParticipativo proyectos={proyectos} />
        </div>

        {/* Banco de Proyectos Vecinales (Tarjetas Interactivas de Votación) */}
        <div className="space-y-6 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Vote className="text-cyan-400" size={24} />
                Banco de Proyectos Vecinales en Votación
              </h2>
              <p className="text-sm text-slate-300">
                Selecciona una iniciativa de tu interés y ejerce tu voto seguro con rol "Ciudadano Verificado Nivel 2".
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proyectos.map((proyecto, idx) => {
              const porcentaje = ((proyecto.votosAcumulados / totalVotos) * 100).toFixed(1);
              return (
                <CivicCard
                  key={proyecto.id}
                  level={2}
                  className="p-6 border-white/10 flex flex-col justify-between space-y-5 hover:border-cyan-400/40 transition-all duration-300"
                  style={{ borderRadius: '20px' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-cyan-300">
                        {proyecto.categoria}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Distrito: <strong className="text-white">{proyecto.distrito}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">
                      {proyecto.titulo}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {proyecto.descripcion}
                    </p>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
                      <div>
                        <strong>Proponente:</strong> {proyecto.proponenteComunal}
                      </div>
                      <div>
                        <strong>Beneficiarios:</strong> {proyecto.beneficiariosEstimados}
                      </div>
                    </div>
                  </div>

                  {/* Estado de Votación y Botón */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-400 font-bold text-base">
                        {proyecto.presupuestoFormateado}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-white text-sm">
                          {proyecto.votosAcumulados} votos
                        </span>{' '}
                        <span className="text-slate-400 text-xs">({porcentaje}%)</span>
                      </div>
                    </div>

                    <CivicButton
                      variant="primary"
                      fullWidth
                      size="md"
                      onClick={() => abrirVotacionParaProyecto(proyecto)}
                      leftIcon={<Vote size={16} />}
                    >
                      Votar por este Proyecto
                    </CivicButton>
                  </div>
                </CivicCard>
              );
            })}
          </div>
        </div>

        {/* Modal Antifraude */}
        <ModalVotacionAntifraude
          isOpen={modalVotacionAbierto}
          onClose={() => setModalVotacionAbierto(false)}
          proyecto={proyectoSeleccionado}
          onVotoExitoso={handleVotoExitoso}
        />

        {/* Modal de Buzón de Audiencias */}
        <BuzonAudienciaModal
          isOpen={modalAudienciaAbierto}
          onClose={() => setModalAudienciaAbierto(false)}
        />
      </div>
    </div>
  );
}
