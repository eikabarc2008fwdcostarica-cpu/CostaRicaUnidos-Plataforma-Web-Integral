import React, { useState, useEffect, useCallback } from 'react';
import {
  Vote,
  Users,
  ShieldCheck,
  Mail,
  Coins,
  CheckCircle,
  Award,
  Sparkles,
  AlertCircle,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { ProyectoVecinal, SolicitudAudienciaConcejo } from '../data/participacionData';
import { dbClient } from '../services/dbClient';
import { GraficoPresupuestoParticipativo } from '../components/participacion/GraficoPresupuestoParticipativo';
import { ModalVotacionAntifraude } from '../components/participacion/ModalVotacionAntifraude';
import { BuzonAudienciaModal } from '../components/participacion/BuzonAudienciaModal';
import { CivicCard } from '../components/common/CivicCard';
import { CivicButton } from '../components/common/CivicButton';
import Navbar from '../components/Navbar';

/**
 * Normaliza los proyectos del catálogo maestro en dbClient para renderizado uniforme.
 */
function normalizarProyectos(): ProyectoVecinal[] {
  const raw = dbClient.getCollection<any>('proyectosPresupuesto');
  return raw.map((p) => {
    const monto = p.presupuestoEstimadoColones || p.montoEstimado || 45000000;
    return {
      id: p.id,
      titulo: p.titulo,
      distrito: p.distrito || 'Cantonal',
      categoria: p.categoria || 'Infraestructura & Aceras',
      descripcion: p.descripcion || 'Iniciativa ciudadana para mejora del espacio comunal y calidad de vida.',
      presupuestoEstimadoColones: monto,
      presupuestoFormateado: p.presupuestoFormateado || `₡ ${monto.toLocaleString('es-CR')}`,
      votosAcumulados: p.votosAcumulados || 0,
      estadoVotacion: (p.estadoVotacion || (p.estado === 'EN_VOTACION' ? 'Votación Abierta' : 'Aprobado')) as any,
      proponenteComunal: p.proponenteComunal || 'Asociación de Desarrollo Integral (ADI)',
      beneficiariosEstimados: p.beneficiariosEstimados || '15,000 vecinos',
      fechaCierre: p.fechaCierre || '15 de Noviembre, 2026'
    };
  });
}

/**
 * ParticipacionPage — Módulo 11: Participación Ciudadana y Presupuesto Participativo
 * 
 * Centraliza la soberanía vecinal con:
 * - Banco de proyectos de presupuesto participativo con barra reactiva porcentual cargado de dbClient.
 * - Sistema de votación con validación tributaria y de padrón (1 voto por cédula legal).
 * - Gráficos y métricas reactivas en tiempo real.
 * - Buzón formal de audiencias públicas ante el Concejo Municipal.
 */
export default function ParticipacionPage() {
  const [proyectos, setProyectos] = useState<ProyectoVecinal[]>(normalizarProyectos);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<ProyectoVecinal | null>(null);
  const [modalVotacionAbierto, setModalVotacionAbierto] = useState(false);
  const [modalAudienciaAbierto, setModalAudienciaAbierto] = useState(false);
  const [notificacionVoto, setNotificacionVoto] = useState<{
    mensaje: string;
    comprobante: string;
  } | null>(null);

  // Sincronización reactiva con dbClient
  useEffect(() => {
    setProyectos(normalizarProyectos());

    const unsubscribe = dbClient.subscribe(() => {
      setProyectos(normalizarProyectos());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Manejo de voto exitoso con actualización reactiva en vivo, persistencia en dbClient y comprobante oficial
  const handleVotoExitoso = (proyectoId: string, comprobante: string, cedula?: string) => {
    const proy = proyectos.find((p) => p.id === proyectoId);
    const votosActuales = proy ? proy.votosAcumulados : 0;

    // 1. Incrementar votosAcumulados del proyecto en dbClient
    dbClient.update('proyectosPresupuesto', proyectoId, {
      votosAcumulados: votosActuales + 1
    });

    // 2. Registrar el voto blindado en la colección votosEmitidos de dbClient
    const anio = new Date().getFullYear();
    const votoId = `VOT-${anio}-${Math.floor(1000 + Math.random() * 9000)}`;
    dbClient.insert('votosEmitidos', {
      id: votoId,
      proyectoId,
      usuarioCedula: cedula || '1-1823-0456',
      fechaVoto: new Date().toISOString(),
      hashFirma: comprobante
    });

    // 3. Recargar estado local desde dbClient
    setProyectos(normalizarProyectos());

    setNotificacionVoto({
      mensaje: `¡Su voto soberano fue registrado con éxito para "${proy?.titulo || 'Iniciativa Comunal'}"!`,
      comprobante
    });
    setTimeout(() => setNotificacionVoto(null), 8000);
  };

  const abrirVotacionParaProyecto = (proyecto: ProyectoVecinal) => {
    setProyectoSeleccionado(proyecto);
    setModalVotacionAbierto(true);
  };

  const totalPresupuesto = proyectos.reduce((acc, p) => acc + p.presupuestoEstimadoColones, 0);
  const totalVotos = proyectos.reduce((acc, p) => acc + p.votosAcumulados, 0);

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#00040D)] text-[var(--theme-text-primary,#F1F5F9)] selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner Hero Cívico */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#021024] to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Vote size={14} />
                Participación Ciudadana y Presupuesto Participativo
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Decide el Futuro de tu Cantón con{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  Voto Blindado
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Prioriza las obras de tu barrio con certificación de identidad en tiempo real ante el Ministerio
                de Hacienda (1 voto por cédula legal activa) y emisión inmutable de comprobantes digitales de sufragio.
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

        {/* Notificación Flotante de Voto Exitoso con Comprobante */}
        {notificacionVoto && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle size={22} className="text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold block">{notificacionVoto.mensaje}</span>
                <span className="text-xs text-emerald-300 font-mono">
                  Comprobante Oficial: <strong>{notificacionVoto.comprobante}</strong> (La barra de progreso se ha actualizado)
                </span>
              </div>
            </div>
            <span className="self-end sm:self-center px-2.5 py-1 rounded bg-emerald-500/30 text-emerald-200 text-xs font-mono font-bold border border-emerald-500/40">
              INMUTABLE
            </span>
          </div>
        )}

        {/* Estadísticas Clave en Tiempo Real */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-1">
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Fondo Presupuestario</span>
            <div className="text-2xl font-bold font-mono text-[#062A77]">
              ₡ {(totalPresupuesto / 1000000).toFixed(0)} Millones
            </div>
            <p className="text-[12px] text-slate-600">Fondos públicos participativos 2026</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-1">
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Votos Ciudadanos Emitidos</span>
            <div className="text-2xl font-bold font-mono text-[#062A77] flex items-center gap-2">
              <span>{totalVotos.toLocaleString()}</span>
              <TrendingUp size={18} className="text-[#059669]" />
            </div>
            <p className="text-[12px] text-[#059669] font-bold">100% Verificados por Cédula</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-1">
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Proyectos en Competencia</span>
            <div className="text-2xl font-bold font-mono text-[#0053AF]">
              {proyectos.length} Distritales
            </div>
            <p className="text-[12px] text-slate-600">Propuestos por ADIs y colectivos</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-1">
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Cierre del Sufragio</span>
            <div className="text-2xl font-bold text-[#C22727]">
              15 Nov 2026
            </div>
            <p className="text-[12px] text-slate-600">Ratificación en sesión municipal</p>
          </div>
        </div>

        {/* Gráficos Reactivos Interactivos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#062A77] flex items-center gap-2">
                <Coins className="text-[#0053AF]" size={24} />
                Métricas Electorales y Distribución Presupuestaria
              </h2>
              <p className="text-sm text-slate-700 font-medium mt-1">
                Visualización reactiva en tiempo real del escrutinio vecinal y asignación cantonal.
              </p>
            </div>
          </div>

          <GraficoPresupuestoParticipativo proyectos={proyectos} />
        </div>

        {/* Banco de Proyectos Vecinales (Tarjetas Interactivas de Votación) */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#062A77] flex items-center gap-2">
                <Vote className="text-[#0053AF]" size={24} />
                Banco de Proyectos Vecinales en Votación
              </h2>
              <p className="text-sm text-slate-700 font-medium mt-1">
                Selecciona una iniciativa de tu interés y ejerce tu voto seguro con rol "Ciudadano Verificado Nivel 2".
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proyectos.map((proyecto) => {
              const porcentajeNumerico = totalVotos > 0 ? (proyecto.votosAcumulados / totalVotos) * 100 : 0;
              const porcentaje = porcentajeNumerico.toFixed(1);

              return (
                <div
                  key={proyecto.id}
                  className="p-6 bg-white border-2 border-slate-200/90 rounded-2xl flex flex-col justify-between space-y-5 hover:border-[#0053AF]/40 hover:shadow-lg shadow-sm transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-[#0053AF]">
                        {proyecto.categoria}
                      </span>
                      <span className="text-xs font-mono text-slate-700 font-semibold">
                        Distrito: <strong className="text-[#062A77]">{proyecto.distrito}</strong>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#062A77] leading-snug">
                      {proyecto.titulo}
                    </h3>

                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                      {proyecto.descripcion}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
                      <div>
                        <strong className="text-[#062A77]">Proponente:</strong> {proyecto.proponenteComunal}
                      </div>
                      <div>
                        <strong className="text-[#062A77]">Beneficiarios:</strong> {proyecto.beneficiariosEstimados}
                      </div>
                    </div>
                  </div>

                  {/* Estado de Votación, Barra de Progreso Reactiva y Botón */}
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    {/* Barra de Progreso Porcentual Reactiva */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[#062A77] font-extrabold text-lg">
                          {proyecto.presupuestoFormateado}
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-slate-800 text-sm">
                            {proyecto.votosAcumulados} votos
                          </span>{' '}
                          <span className="text-[#0053AF] font-mono text-xs font-bold">
                            ({porcentaje}%)
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden border border-slate-300/60 p-0.5">
                        <div
                          className="bg-gradient-to-r from-[#0053AF] via-[#062A77] to-[#C22727] h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,83,175,0.3)]"
                          style={{
                            width: `${Math.min(100, Math.max(3, porcentajeNumerico))}%`
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => abrirVotacionParaProyecto(proyecto)}
                      className="w-full py-3 px-5 rounded-xl font-bold text-white bg-[#0053AF] hover:bg-[#062A77] active:scale-[0.99] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Vote size={18} />
                      <span>Votar por este Proyecto</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Solemne de Votación Antifraude */}
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
