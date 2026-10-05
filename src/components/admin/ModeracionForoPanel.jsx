import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Scale,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  FileText,
  UserX,
  History,
  Info,
  Check,
  Send,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  obtenerColaModeracion,
  obtenerBitacoraAuditoria,
  registrarAccionAuditoria,
  obtenerConfiguracionIA
} from '../../services/adminService';
import { GRAVEDAD, TIPO_SANCION } from '../../config/reglasForo';

export default function ModeracionForoPanel() {
  const { t } = useLanguage();

  // Estados de datos
  const [incidentes, setIncidentes] = useState([]);
  const [usuariosBaneados, setUsuariosBaneados] = useState([]);
  const [bitacora, setBitacora] = useState([]);
  const [configIA, setConfigIA] = useState(obtenerConfiguracionIA);
  const [cargando, setCargando] = useState(true);

  // Filtros de la cola de incidentes
  const [subTab, setSubTab] = useState('incidentes'); // 'incidentes' | 'baneos' | 'auditoria'
  const [filtroGravedad, setFiltroGravedad] = useState('TODAS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  // Modales de acción con justificación obligatoria
  const [modalAccion, setModalAccion] = useState(null);
  // { tipo: 'FALSO_POSITIVO' | 'CONFIRMAR' | 'LEVANTAR_BANEO' | 'MODIFICAR_DURACION', target: item | usuario, justificacion: '' }
  const [justificacionTexto, setJustificacionTexto] = useState('');
  const [duracionExtraHoras, setDuracionExtraHoras] = useState(24);
  const [procesandoAccion, setProcesandoAccion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Carga inicial y refresco de datos
  const cargarDatosModeracion = async () => {
    try {
      setCargando(true);

      // 1. Obtener incidentes de moderación (de API o storage)
      let itemsCola = [];
      try {
        const res = await fetch('/api/moderacionContenido');
        if (res.ok) {
          itemsCola = await res.json();
        }
      } catch (_e) {}

      if (!Array.isArray(itemsCola) || itemsCola.length === 0) {
        itemsCola = obtenerColaModeracion();
      }
      setIncidentes(Array.isArray(itemsCola) ? itemsCola : []);

      // 2. Obtener usuarios para detectar baneos activos
      let listaUsuarios = [];
      try {
        const resU = await fetch('/api/usuarios');
        if (resU.ok) {
          listaUsuarios = await resU.json();
        }
      } catch (_e) {}

      if (!Array.isArray(listaUsuarios) || listaUsuarios.length === 0) {
        try {
          const raw = localStorage.getItem('cr_db_usuarios');
          if (raw) listaUsuarios = JSON.parse(raw);
        } catch (_e) {}
      }

      // Filtrar usuarios con sanción activa y no vencida
      const baneados = listaUsuarios.filter((u) => {
        if (!u.sancion || !u.sancion.activa) return false;
        if (!u.sancion.indefinida && u.sancion.fin) {
          const finTime = new Date(u.sancion.fin).getTime();
          if (!isNaN(finTime) && finTime <= Date.now()) {
            return false; // ya venció
          }
        }
        return true;
      });
      setUsuariosBaneados(baneados);

      // 3. Bitácora de auditoría
      const logs = obtenerBitacoraAuditoria();
      setBitacora(Array.isArray(logs) ? logs : []);

      // 4. Configuración actual de IA
      setConfigIA(obtenerConfiguracionIA());
    } catch (err) {
      console.error('Error cargando datos de moderación del foro:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosModeracion();
  }, []);

  // Métricas calculadas en tiempo real
  const metricas = useMemo(() => {
    const hoyStr = new Date().toISOString().slice(0, 10);
    const bloqueadosHoy = incidentes.filter(
      (i) => i.fechaReporte && i.fechaReporte.slice(0, 10) === hoyStr
    ).length;

    const baneosActivos = usuariosBaneados.length;

    // Reincidentes: usuarios con strikes acumulados >= 2
    let reincidentes = 0;
    try {
      const raw = localStorage.getItem('cr_db_usuarios');
      if (raw) {
        const users = JSON.parse(raw);
        if (Array.isArray(users)) {
          reincidentes = users.filter((u) => (u.sancion?.strikes || 0) >= 2).length;
        }
      }
    } catch (_e) {}

    const falsosPositivos = incidentes.filter((i) => i.esFalsoPositivo || i.estado === 'FALSO_POSITIVO').length;

    return {
      bloqueadosHoy,
      baneosActivos,
      reincidentes,
      falsosPositivos
    };
  }, [incidentes, usuariosBaneados]);

  // Filtrado de la cola de incidentes
  const incidentesFiltrados = useMemo(() => {
    return incidentes.filter((item) => {
      // Filtro gravedad
      if (filtroGravedad !== 'TODAS') {
        const itemGrav = String(item.gravedad || 'MEDIA').toUpperCase();
        if (itemGrav !== filtroGravedad) return false;
      }

      // Filtro estado
      if (filtroEstado !== 'TODOS') {
        if (item.estado !== filtroEstado) return false;
      }

      // Búsqueda por texto o autor
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const texto = (item.textoOriginal || '').toLowerCase();
        const autor = (item.autorNombre || '').toLowerCase();
        const cedula = (item.autorCedula || '').toLowerCase();
        const razon = (item.razonIA || '').toLowerCase();
        if (!texto.includes(q) && !autor.includes(q) && !cedula.includes(q) && !razon.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [incidentes, filtroGravedad, filtroEstado, busqueda]);

  // Ejecución de acciones administrativas con justificación auditada
  const ejecutarAccion = async () => {
    if (!modalAccion || !justificacionTexto.trim()) return;

    try {
      setProcesandoAccion(true);
      const { tipo, target } = modalAccion;

      if (tipo === 'CONFIRMAR') {
        // Confirmar sanción
        const itemActualizado = {
          ...target,
          estado: 'SANCIONADO',
          justificacionResolucion: justificacionTexto.trim(),
          fechaResolucion: new Date().toISOString()
        };

        // Guardar en cola
        await fetch(`/api/moderacionContenido/${target.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemActualizado)
        }).catch(() => {});

        // Auditar
        registrarAccionAuditoria(
          'SANCIONAR_USUARIO',
          `Incidente ${target.id} (${target.autorCedula})`,
          `Sanción confirmada: "${justificacionTexto.trim()}"`
        );

        setMensajeExito(`Sanción confirmada para el incidente ${target.id}.`);
      } else if (tipo === 'FALSO_POSITIVO') {
        // Marcar como falso positivo: Levanta la sanción y reduce el strike del usuario
        const itemActualizado = {
          ...target,
          estado: 'FALSO_POSITIVO',
          esFalsoPositivo: true,
          justificacionResolucion: justificacionTexto.trim(),
          fechaResolucion: new Date().toISOString()
        };

        await fetch(`/api/moderacionContenido/${target.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemActualizado)
        }).catch(() => {});

        // Restablecer sanción en usuario
        try {
          const raw = localStorage.getItem('cr_db_usuarios');
          if (raw) {
            const users = JSON.parse(raw);
            const uIdx = users.findIndex(
              (u) => u.id === target.autorId || (target.autorCedula && u.cedula === target.autorCedula)
            );
            if (uIdx !== -1) {
              const u = users[uIdx];
              const prevStrikes = u.sancion?.strikes || 1;
              u.sancion = {
                activa: false,
                nivel: null,
                motivo: null,
                inicio: null,
                fin: null,
                strikes: Math.max(0, prevStrikes - 1),
                indefinida: false
              };
              localStorage.setItem('cr_db_usuarios', JSON.stringify(users));

              if (u.id) {
                await fetch(`/api/usuarios/${encodeURIComponent(u.id)}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sancion: u.sancion })
                }).catch(() => {});
              }
            }
          }
        } catch (_e) {}

        // Auditar
        registrarAccionAuditoria(
          'MARCAR_FALSO_POSITIVO',
          `Incidente ${target.id} · Usuario ${target.autorCedula}`,
          `Marcado como falso positivo. Sanción revocada y strike retirado. Justificación: "${justificacionTexto.trim()}"`
        );

        setMensajeExito(`Incidente marcado como falso positivo. Cuenta de ${target.autorNombre} restablecida.`);
      } else if (tipo === 'LEVANTAR_BANEO') {
        // Levantar baneo inmediato de un usuario
        const usuarioTarget = target;
        try {
          const raw = localStorage.getItem('cr_db_usuarios');
          if (raw) {
            const users = JSON.parse(raw);
            const uIdx = users.findIndex(
              (u) => u.id === usuarioTarget.id || u.cedula === usuarioTarget.cedula
            );
            if (uIdx !== -1) {
              users[uIdx].sancion = {
                ...users[uIdx].sancion,
                activa: false,
                motivoLevantamiento: justificacionTexto.trim(),
                fechaLevantamiento: new Date().toISOString()
              };
              localStorage.setItem('cr_db_usuarios', JSON.stringify(users));

              if (usuarioTarget.id) {
                await fetch(`/api/usuarios/${encodeURIComponent(usuarioTarget.id)}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sancion: users[uIdx].sancion })
                }).catch(() => {});
              }
            }
          }
        } catch (_e) {}

        // Auditar
        registrarAccionAuditoria(
          'LEVANTAR_SANCION',
          `Usuario ${usuarioTarget.nombre} (${usuarioTarget.cedula})`,
          `Suspensión levantada manualmente por el Super Administrador Nacional. Justificación: "${justificacionTexto.trim()}"`
        );

        setMensajeExito(`Suspensión levantada exitosamente para ${usuarioTarget.nombre}.`);
      } else if (tipo === 'MODIFICAR_DURACION') {
        // Ampliar o reducir el baneo
        const itemTarget = target;
        const nuevaFechaFin = new Date(Date.now() + duracionExtraHoras * 3600 * 1000).toISOString();

        // Modificar en usuario
        try {
          const raw = localStorage.getItem('cr_db_usuarios');
          if (raw) {
            const users = JSON.parse(raw);
            const uIdx = users.findIndex(
              (u) => u.id === itemTarget.autorId || u.cedula === itemTarget.autorCedula
            );
            if (uIdx !== -1) {
              users[uIdx].sancion = {
                ...users[uIdx].sancion,
                activa: true,
                fin: nuevaFechaFin,
                indefinida: false
              };
              localStorage.setItem('cr_db_usuarios', JSON.stringify(users));

              if (users[uIdx].id) {
                await fetch(`/api/usuarios/${encodeURIComponent(users[uIdx].id)}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sancion: users[uIdx].sancion })
                }).catch(() => {});
              }
            }
          }
        } catch (_e) {}

        // Auditar
        registrarAccionAuditoria(
          'MODIFICAR_SANCION_FORO',
          `Usuario ${itemTarget.autorCedula} (Incidente ${itemTarget.id})`,
          `Duración ajustada a ${duracionExtraHoras} horas (nueva fecha: ${new Date(nuevaFechaFin).toLocaleString('es-CR')}). Justificación: "${justificacionTexto.trim()}"`
        );

        setMensajeExito(`Duración de sanción actualizada a ${duracionExtraHoras} horas.`);
      }

      setModalAccion(null);
      setJustificacionTexto('');
      await cargarDatosModeracion();
      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      console.error('Error ejecutando acción administrativa:', err);
    } finally {
      setProcesandoAccion(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      {/* 1. ENCABEZADO Y ESTADO DEL SUPERVISOR IA */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#070D1B] via-[#0A1226] to-[#070D1B] border border-sky-400/20 shadow-xl relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              'linear-gradient(90deg, #001489 0%, #001489 16.6%, #FFFFFF 16.6%, #FFFFFF 33.3%, #DA291C 33.3%, #DA291C 66.6%, #FFFFFF 66.6%, #FFFFFF 83.3%, #001489 83.3%, #001489 100%)'
          }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                M04 · SUPERVISOR IA DEL FORO TICO
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Nivel 5 · Super Administrador Nacional
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('moderacion.panelTitulo', 'Consola de Moderación Soberana y Sanciones')}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Supervisión de convivencia ciudadana, resolución de apelaciones, gestión de suspensiones graduales y auditoría inmutable de intervenciones administrativas.
            </p>
          </div>

          {/* Badge del Estado de Gobernanza de IA */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-white/10 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Supervisor IA:</span>
                <span
                  className={`font-black uppercase text-[10px] px-2 py-0.5 rounded ${
                    configIA.killSwitchActivo
                      ? 'bg-red-500 text-white'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {configIA.killSwitchActivo ? 'KILL-SWITCH ACTIVO' : 'OPERATIVO'}
                </span>
              </div>
              <div className="text-slate-300 font-semibold mt-0.5">
                Sensibilidad:{' '}
                <strong className="text-sky-300 font-bold">
                  {configIA.sensibilidadModeracion || 'MODERADA'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {mensajeExito && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}
      </div>

      {/* 2. TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bloqueados Hoy */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Bloqueados Hoy</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-2 font-mono">
            {metricas.bloqueadosHoy}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Intentos infractores interceptados hoy</p>
        </div>

        {/* Baneos Activos */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Baneos Activos</span>
            <UserX className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2 font-mono">
            {metricas.baneosActivos}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Cuentas con suspensión temporal o indefinida</p>
        </div>

        {/* Reincidentes */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Reincidentes</span>
            <AlertTriangle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-400 mt-2 font-mono">
            {metricas.reincidentes}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Usuarios con 2 o más strikes acumulados</p>
        </div>

        {/* Falsos Positivos */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Falsos Positivos</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
            {metricas.falsosPositivos}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Casos rectificados por la administración</p>
        </div>
      </div>

      {/* 3. SELECTOR DE VISTA: INCIDENTES / BANEOS / AUDITORÍA */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('incidentes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'incidentes'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Cola de Incidentes ({incidentes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('baneos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'baneos'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <UserX className="w-4 h-4" />
            <span>Baneos Activos ({usuariosBaneados.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('auditoria')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'auditoria'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Bitácora de Auditoría</span>
          </button>
        </div>

        <button
          type="button"
          onClick={cargarDatosModeracion}
          title="Refrescar datos"
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
          <span>Refrescar</span>
        </button>
      </div>

      {/* 4. SUB-TAB 1: COLA DE INCIDENTES */}
      {subTab === 'incidentes' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4 flex-wrap text-xs">
            {/* Buscador */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por autor, cédula o contenido..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-sky-400"
              />
            </div>

            {/* Filtro Gravedad */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Gravedad:</span>
              <select
                value={filtroGravedad}
                onChange={(e) => setFiltroGravedad(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-sky-400 font-semibold"
              >
                <option value="TODAS">Todas</option>
                <option value="LEVE">Leve</option>
                <option value="MEDIA">Media</option>
                <option value="GRAVE">Grave</option>
              </select>
            </div>

            {/* Filtro Estado */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Estado:</span>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-sky-400 font-semibold"
              >
                <option value="TODOS">Todos</option>
                <option value="PENDIENTE_REVISION">Pendiente Revisión</option>
                <option value="SANCIONADO">Sancionado</option>
                <option value="FALSO_POSITIVO">Falso Positivo</option>
                <option value="APROBADO">Aprobado</option>
              </select>
            </div>
          </div>

          {/* Listado de Incidentes */}
          {incidentesFiltrados.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/15 text-slate-400 text-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-white">No hay incidentes con los filtros seleccionados.</p>
              <p className="mt-1 text-slate-500">El foro se encuentra en óptima convivencia cívica.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incidentesFiltrados.map((inc) => {
                const gravedadColor =
                  inc.gravedad === 'GRAVE'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : inc.gravedad === 'MEDIA'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-300 border-sky-400/40';

                return (
                  <div
                    key={inc.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3"
                  >
                    {/* Cabecera del Incidente */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-sky-400">{inc.id}</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${gravedadColor}`}
                        >
                          Gravedad {inc.gravedad || 'MEDIA'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-white/10">
                          {inc.tipoContenido === 'COMENTARIO' ? 'Comentario' : 'Publicación'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(inc.fechaReporte || Date.now()).toLocaleString('es-CR')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            inc.estado === 'FALSO_POSITIVO'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : inc.estado === 'SANCIONADO'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {inc.estado || 'PENDIENTE'}
                        </span>
                      </div>
                    </div>

                    {/* Autor e Info */}
                    <div className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                      <span>
                        Autor: <strong className="text-white">{inc.autorNombre}</strong>
                      </span>
                      <span>
                        Cédula: <span className="font-mono text-slate-400">{inc.autorCedula}</span>
                      </span>
                      {inc.autorRol && (
                        <span>
                          Rol: <strong className="text-sky-300">{inc.autorRol}</strong>
                        </span>
                      )}
                      <span>
                        Sanción:{' '}
                        <strong className="text-amber-300">{inc.sancionAplicada || 'ADVERTENCIA'}</strong>
                      </span>
                    </div>

                    {/* Texto infractor analizado */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Texto Interceptado:</span>
                        {inc.scoreToxicidadIA !== undefined && (
                          <span className="text-slate-400">
                            Toxicidad:{' '}
                            <strong className="text-rose-400">{inc.scoreToxicidadIA}/100</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 font-mono bg-black/40 p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap">
                        {inc.textoOriginal}
                      </p>
                      <div className="text-xs text-rose-300 pt-1">
                        <strong>Razón del Supervisor IA:</strong> {inc.razonIA}
                      </div>
                    </div>

                    {/* Términos detectados */}
                    {Array.isArray(inc.palabrasDetectadas) && inc.palabrasDetectadas.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="text-slate-400 text-[11px]">Términos:</span>
                        {inc.palabrasDetectadas.map((pal, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          >
                            "{pal}"
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nota de Solicitud de Revisión por el Ciudadano si existe */}
                    {inc.solicitudRevisionCiudadano && (
                      <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-400/30 text-xs text-sky-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-sky-300">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Solicitud de Revisión del Ciudadano:</span>
                        </div>
                        <p className="italic">"{inc.solicitudRevisionCiudadano.justificacion}"</p>
                      </div>
                    )}

                    {/* Botonera de Acciones Administrativas */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setModalAccion({ tipo: 'FALSO_POSITIVO', target: inc });
                          setJustificacionTexto('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Marcar como Falso Positivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setModalAccion({ tipo: 'MODIFICAR_DURACION', target: inc });
                          setJustificacionTexto('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/35 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Modificar Duración</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setModalAccion({ tipo: 'CONFIRMAR', target: inc });
                          setJustificacionTexto('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar Sanción</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. SUB-TAB 2: BANEOS ACTIVOS */}
      {subTab === 'baneos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserX className="w-4 h-4 text-amber-400" />
              <span>Lista de Cuentas Ciudadanas con Suspensión Activa</span>
            </h3>
            <span className="text-xs text-slate-400">Total activos: {usuariosBaneados.length}</span>
          </div>

          {usuariosBaneados.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/15 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-white">No existen baneos activos en este momento.</p>
              <p className="mt-1 text-slate-500">Todas las cuentas ciudadanas tienen acceso habilitado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {usuariosBaneados.map((u) => {
                const sancion = u.sancion || {};
                const esIndefinida = Boolean(sancion.indefinida);
                const finFecha = sancion.fin ? new Date(sancion.fin) : null;
                const horasRestantes = finFecha
                  ? Math.max(0, Math.ceil((finFecha.getTime() - Date.now()) / (3600 * 1000)))
                  : null;

                return (
                  <div
                    key={u.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/25 shadow-lg flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white text-base leading-snug">{u.nombre}</h4>
                          <div className="text-xs text-slate-400">
                            Cédula: <span className="font-mono text-slate-200">{u.cedula}</span> • Rol: {u.rol}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                          {sancion.nivel || 'Baneo'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs mt-3">
                        <div className="text-slate-300">
                          <span className="text-slate-400 font-semibold">Motivo: </span>
                          <span>{sancion.motivo || 'Infracción a las Reglas de Convivencia Cívica'}</span>
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-400 font-semibold">Strikes acumulados: </span>
                          <span className="font-bold text-amber-300">{sancion.strikes || 1}</span>
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-400 font-semibold">Tiempo restante: </span>
                          <span className="font-bold text-white">
                            {esIndefinida
                              ? 'Indefinido (espera resolución del Super Admin)'
                              : `${horasRestantes} horas restantes (${finFecha.toLocaleString('es-CR')})`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setModalAccion({ tipo: 'LEVANTAR_BANEO', target: u });
                        setJustificacionTexto('');
                      }}
                      className="w-full py-2 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Levantar Baneo Inmediato</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. SUB-TAB 3: BITÁCORA DE AUDITORÍA */}
      {subTab === 'auditoria' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              <span>Registro Legal Inmutable de Acciones de Moderación</span>
            </h3>
            <span className="text-xs text-slate-400">Total registros: {bitacora.length}</span>
          </div>

          <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-white/10 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Fecha CST</th>
                    <th className="p-3">Acción</th>
                    <th className="p-3">Entidad Afectada</th>
                    <th className="p-3">Justificación / Motivo</th>
                    <th className="p-3">Administrador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {bitacora
                    .filter((reg) =>
                      [
                        'SANCIONAR_USUARIO',
                        'LEVANTAR_SANCION',
                        'MARCAR_FALSO_POSITIVO',
                        'MODIFICAR_SANCION_FORO',
                        'ELIMINAR_COMENTARIO',
                        'CONFIGURAR_IA'
                      ].includes(reg.accion)
                    )
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                          {log.fechaHoraCst || new Date(log.fecha || log.timestamp).toLocaleString('es-CR')}
                        </td>
                        <td className="p-3 font-bold text-sky-300">{log.accion}</td>
                        <td className="p-3 font-mono text-white">{log.entidadAfectada}</td>
                        <td className="p-3 text-slate-300 max-w-xs truncate">{log.justificacion || log.justificante}</td>
                        <td className="p-3 text-slate-400">{log.adminNombre || log.adminCedula}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL DE ACCIÓN ADMINISTRATIVA CON JUSTIFICACIÓN OBLIGATORIA */}
      {modalAccion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-lg w-full rounded-3xl bg-[#070D1B] border border-sky-400/40 p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Scale className="w-5 h-5 text-sky-400" />
                <span>
                  {modalAccion.tipo === 'FALSO_POSITIVO' && 'Confirmar Falso Positivo'}
                  {modalAccion.tipo === 'LEVANTAR_BANEO' && 'Levantar Suspensión de Cuenta'}
                  {modalAccion.tipo === 'MODIFICAR_DURACION' && 'Modificar Duración del Baneo'}
                  {modalAccion.tipo === 'CONFIRMAR' && 'Confirmar Sanción Disciplinaria'}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setModalAccion(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {modalAccion.tipo === 'FALSO_POSITIVO' &&
                'Al marcar como falso positivo, el strike será retirado de la cuenta y el usuario podrá volver a participar en el foro inmediatamente. Esta acción quedará registrada en la bitácora legal.'}
              {modalAccion.tipo === 'LEVANTAR_BANEO' &&
                'Se restablecerán todos los privilegios cívicos del ciudadano (iniciar sesión, comentar, publicar y votar).'}
              {modalAccion.tipo === 'MODIFICAR_DURACION' &&
                'Define la nueva vigencia en horas para la suspensión de esta cuenta.'}
              {modalAccion.tipo === 'CONFIRMAR' &&
                'Ratifica la decisión del Supervisor IA e inscribe el strike en el expediente del usuario.'}
            </p>

            {modalAccion.tipo === 'MODIFICAR_DURACION' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Nueva duración en horas:</label>
                <select
                  value={duracionExtraHoras}
                  onChange={(e) => setDuracionExtraHoras(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-sky-400 font-semibold"
                >
                  <option value={12}>12 horas</option>
                  <option value={24}>24 horas (1 día)</option>
                  <option value={72}>72 horas (3 días)</option>
                  <option value={168}>168 horas (7 días)</option>
                  <option value={720}>720 horas (30 días)</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Justificación administrativa obligatoria (Ley N° 8968 / Auditoría):
              </label>
              <textarea
                rows={3}
                value={justificacionTexto}
                onChange={(e) => setJustificacionTexto(e.target.value)}
                placeholder="Detalla el fundamento de la decisión administrativa..."
                className="w-full p-3 text-xs rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-sky-400"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setModalAccion(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={procesandoAccion || !justificacionTexto.trim()}
                onClick={ejecutarAccion}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{procesandoAccion ? 'Procesando...' : 'Aplicar Decisión'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
