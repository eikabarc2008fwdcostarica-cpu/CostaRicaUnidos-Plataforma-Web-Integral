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
    <div className="space-y-6 animate-fadeIn text-cru-text">
      {/* 1. ENCABEZADO Y ESTADO DEL SUPERVISOR IA */}
      <div className="rounded-3xl p-6 bg-cru-surface border border-cru-border shadow-sm relative overflow-hidden">
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
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-cru-accent-sky bg-cru-accent-sky-bg px-2.5 py-0.5 rounded-full border border-cru-accent-sky-border flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cru-accent-sky" />
                M04 · SUPERVISOR IA DEL FORO TICO
              </span>
              <span className="text-[11px] font-semibold text-cru-text-muted">
                Nivel 5 · Super Administrador Nacional
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-cru-text tracking-tight">
              {t('moderacion.panelTitulo', 'Consola de Moderación Soberana y Sanciones')}
            </h2>
            <p className="text-xs text-cru-text-muted max-w-2xl mt-1 leading-relaxed">
              Supervisión de convivencia ciudadana, resolución de apelaciones, gestión de suspensiones graduales y auditoría inmutable de intervenciones administrativas.
            </p>
          </div>

          {/* Badge del Estado de Gobernanza de IA */}
          <div className="flex items-center gap-3 bg-cru-surface-muted p-3 rounded-2xl border border-cru-border shrink-0">
            <div className="w-9 h-9 rounded-xl bg-cru-accent-sky-bg border border-cru-accent-sky-border flex items-center justify-center text-cru-accent-sky">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="text-cru-text-muted">Supervisor IA:</span>
                <span
                  className={`font-black uppercase text-[10px] px-2 py-0.5 rounded ${
                    configIA.killSwitchActivo
                      ? 'bg-cru-accent-red text-white'
                      : 'bg-cru-accent-green-bg text-cru-accent-green border border-cru-accent-green-border'
                  }`}
                >
                  {configIA.killSwitchActivo ? 'KILL-SWITCH ACTIVO' : 'OPERATIVO'}
                </span>
              </div>
              <div className="text-cru-text-soft font-semibold mt-0.5">
                Sensibilidad:{' '}
                <strong className="text-cru-accent-sky font-bold">
                  {configIA.sensibilidadModeracion || 'MODERADA'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {mensajeExito && (
          <div className="mt-4 p-3 rounded-xl bg-cru-accent-green-bg border border-cru-accent-green-border text-cru-accent-green text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}
      </div>

      {/* 2. TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bloqueados Hoy */}
        <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-cru-text-muted font-bold uppercase tracking-wider">
            <span>Bloqueados Hoy</span>
            <ShieldAlert className="w-4 h-4 text-cru-accent-red" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cru-accent-red mt-2 font-mono">
            {metricas.bloqueadosHoy}
          </div>
          <p className="text-[11px] text-cru-text-muted mt-1">Intentos infractores interceptados hoy</p>
        </div>

        {/* Baneos Activos */}
        <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-cru-text-muted font-bold uppercase tracking-wider">
            <span>Baneos Activos</span>
            <UserX className="w-4 h-4 text-cru-accent-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cru-accent-amber mt-2 font-mono">
            {metricas.baneosActivos}
          </div>
          <p className="text-[11px] text-cru-text-muted mt-1">Cuentas con suspensión temporal o indefinida</p>
        </div>

        {/* Reincidentes */}
        <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-cru-text-muted font-bold uppercase tracking-wider">
            <span>Reincidentes</span>
            <AlertTriangle className="w-4 h-4 text-cru-accent-sky" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cru-accent-sky mt-2 font-mono">
            {metricas.reincidentes}
          </div>
          <p className="text-[11px] text-cru-text-muted mt-1">Usuarios con 2 o más strikes acumulados</p>
        </div>

        {/* Falsos Positivos */}
        <div className="p-5 rounded-2xl bg-cru-surface border border-cru-border shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-cru-text-muted font-bold uppercase tracking-wider">
            <span>Falsos Positivos</span>
            <Scale className="w-4 h-4 text-cru-accent-green" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cru-accent-green mt-2 font-mono">
            {metricas.falsosPositivos}
          </div>
          <p className="text-[11px] text-cru-text-muted mt-1">Casos rectificados por la administración</p>
        </div>
      </div>

      {/* 3. SELECTOR DE VISTA: INCIDENTES / BANEOS / AUDITORÍA */}
      <div className="flex items-center justify-between border-b border-cru-border pb-2 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('incidentes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'incidentes'
                ? 'bg-cru-accent-sky-bg text-cru-accent-sky border border-cru-accent-sky-border shadow-sm'
                : 'text-cru-text-muted hover:text-cru-text hover:bg-cru-surface-muted'
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
                ? 'bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border shadow-sm'
                : 'text-cru-text-muted hover:text-cru-text hover:bg-cru-surface-muted'
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
                ? 'bg-cru-accent-purple-bg text-cru-accent-purple border border-cru-accent-purple-border shadow-sm'
                : 'text-cru-text-muted hover:text-cru-text hover:bg-cru-surface-muted'
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
          className="p-2 rounded-xl bg-cru-surface-muted hover:bg-cru-surface border border-cru-border text-cru-text-muted hover:text-cru-text text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
          <span>Refrescar</span>
        </button>
      </div>

      {/* 4. SUB-TAB 1: COLA DE INCIDENTES */}
      {subTab === 'incidentes' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="p-4 rounded-2xl bg-cru-surface border border-cru-border flex items-center justify-between gap-4 flex-wrap text-xs">
            {/* Buscador */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-cru-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por autor, cédula o contenido..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-cru-surface-muted border border-cru-border text-cru-text placeholder:text-cru-text-muted outline-none focus:border-cru-accent-sky"
              />
            </div>

            {/* Filtro Gravedad */}
            <div className="flex items-center gap-2">
              <span className="text-cru-text-muted font-semibold">Gravedad:</span>
              <select
                value={filtroGravedad}
                onChange={(e) => setFiltroGravedad(e.target.value)}
                className="bg-theme-input-bg border border-theme-input-border rounded-xl px-3 py-2 text-theme-input-text outline-none focus:border-cru-accent-sky font-semibold cursor-pointer"
              >
                <option value="TODAS">Todas</option>
                <option value="LEVE">Leve</option>
                <option value="MEDIA">Media</option>
                <option value="GRAVE">Grave</option>
              </select>
            </div>

            {/* Filtro Estado */}
            <div className="flex items-center gap-2">
              <span className="text-cru-text-muted font-semibold">Estado:</span>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="bg-theme-input-bg border border-theme-input-border rounded-xl px-3 py-2 text-theme-input-text outline-none focus:border-cru-accent-sky font-semibold cursor-pointer"
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
            <div className="p-8 text-center rounded-2xl bg-cru-surface border border-dashed border-cru-border text-cru-text-muted text-xs">
              <ShieldCheck className="w-8 h-8 text-cru-accent-green mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-cru-text">No hay incidentes con los filtros seleccionados.</p>
              <p className="mt-1 text-cru-text-muted">El foro se encuentra en óptima convivencia cívica.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incidentesFiltrados.map((inc) => {
                const gravedadColor =
                  inc.gravedad === 'GRAVE'
                    ? 'bg-cru-accent-red-bg text-cru-accent-red border-cru-accent-red-border'
                    : inc.gravedad === 'MEDIA'
                    ? 'bg-cru-accent-amber-bg text-cru-accent-amber border-cru-accent-amber-border'
                    : 'bg-cru-accent-sky-bg text-cru-accent-sky border-cru-accent-sky-border';

                return (
                  <div
                    key={inc.id}
                    className="p-5 rounded-2xl bg-cru-surface border border-cru-border hover:border-cru-border-hover transition-all space-y-3"
                  >
                    {/* Cabecera del Incidente */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-cru-accent-sky">{inc.id}</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${gravedadColor}`}
                        >
                          Gravedad {inc.gravedad || 'MEDIA'}
                        </span>
                        <span className="text-[10px] font-bold text-cru-text-muted bg-cru-surface-muted px-2 py-0.5 rounded-md border border-cru-border">
                          {inc.tipoContenido === 'COMENTARIO' ? 'Comentario' : 'Publicación'}
                        </span>

                        {/* Badge de Capa Ejecutada y Modelo */}
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                            inc.capaEjecutada === 'GEMINI_CAPA_2'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : inc.capaEjecutada === 'FALLBACK_CAPA_1'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {inc.capaEjecutada === 'GEMINI_CAPA_2' ? (
                            <>
                              <Cpu className="w-3 h-3 text-purple-400" />
                              <span>Capa 2 · {inc.modeloIA || 'Gemini'}</span>
                            </>
                          ) : inc.capaEjecutada === 'FALLBACK_CAPA_1' ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              <span>Fallback Capa 1</span>
                            </>
                          ) : (
                            <span>Capa 1 · Determinista</span>
                          )}
                        </span>

                        {/* Reglas infringidas */}
                        {Array.isArray(inc.reglasInfringidas) && inc.reglasInfringidas.length > 0 && (
                          <div className="flex items-center gap-1">
                            {inc.reglasInfringidas.map((rNum) => (
                              <span
                                key={rNum}
                                className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30"
                              >
                                R{rNum}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="text-xs text-cru-text-muted">
                          {new Date(inc.fechaReporte || Date.now()).toLocaleString('es-CR')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                            inc.estado === 'FALSO_POSITIVO'
                              ? 'bg-cru-accent-green-bg text-cru-accent-green border-cru-accent-green-border'
                              : inc.estado === 'SANCIONADO'
                              ? 'bg-cru-accent-red-bg text-cru-accent-red border-cru-accent-red-border'
                              : 'bg-cru-accent-amber-bg text-cru-accent-amber border-cru-accent-amber-border'
                          }`}
                        >
                          {inc.estado || 'PENDIENTE'}
                        </span>
                      </div>
                    </div>

                    {/* Alerta de Error en IA si hubo Fallback */}
                    {inc.errorIA && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                        <div>
                          <strong>Alerta de Servicio IA:</strong> {inc.errorIA}. Se aplicó moderación preventiva determinista en Capa 1.
                        </div>
                      </div>
                    )}

                    {/* Autor e Info (Cédula protegida por Ley N.º 8968) */}
                    <div className="text-xs text-cru-text-soft flex items-center gap-3 flex-wrap">
                      <span>
                        Autor: <strong className="text-cru-text">{inc.autorNombre}</strong>
                      </span>
                      <span>
                        Cédula:{' '}
                        <span className="font-mono text-cru-accent-sky font-semibold">
                          {inc.autorCedula && inc.autorCedula.includes('CÉDULA')
                            ? inc.autorCedula
                            : '[CÉDULA PROTEGIDA / LEY 8968]'}
                        </span>
                      </span>
                      {inc.autorRol && (
                        <span>
                          Rol: <strong className="text-cru-accent-sky">{inc.autorRol}</strong>
                        </span>
                      )}
                      <span>
                        Sanción:{' '}
                        <strong className="text-cru-accent-amber">{inc.sancionAplicada || 'ADVERTENCIA'}</strong>
                      </span>
                    </div>

                    {/* Texto infractor analizado */}
                    <div className="p-3.5 rounded-xl bg-cru-surface-muted border border-cru-border space-y-1.5">
                      <div className="text-[11px] font-bold text-cru-text-muted uppercase tracking-wider flex items-center justify-between">
                        <span>Texto Interceptado:</span>
                        {inc.scoreToxicidadIA !== undefined && (
                          <span className="text-cru-text-muted">
                            Toxicidad:{' '}
                            <strong className="text-cru-accent-red">{inc.scoreToxicidadIA}/100</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-cru-text font-mono bg-cru-surface p-2.5 rounded-lg border border-cru-border whitespace-pre-wrap">
                        {inc.textoOriginal}
                      </p>
                      <div className="text-xs text-cru-accent-red pt-1">
                        <strong>Razón del Supervisor IA:</strong> {inc.razonIA}
                      </div>
                    </div>

                    {/* Términos detectados */}
                    {Array.isArray(inc.palabrasDetectadas) && inc.palabrasDetectadas.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="text-cru-text-muted text-[11px]">Términos:</span>
                        {inc.palabrasDetectadas.map((pal, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cru-accent-red-bg text-cru-accent-red border border-cru-accent-red-border"
                          >
                            "{pal}"
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nota de Solicitud de Revisión por el Ciudadano si existe */}
                    {inc.solicitudRevisionCiudadano && (
                      <div className="p-3 rounded-xl bg-cru-accent-sky-bg border border-cru-accent-sky-border text-xs text-cru-accent-sky space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-cru-accent-sky">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Solicitud de Revisión del Ciudadano:</span>
                        </div>
                        <p className="italic">"{inc.solicitudRevisionCiudadano.justificacion}"</p>
                      </div>
                    )}

                    {/* Botonera de Acciones Administrativas */}
                    <div className="pt-2 border-t border-cru-border flex items-center justify-end gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setModalAccion({ tipo: 'FALSO_POSITIVO', target: inc });
                          setJustificacionTexto('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-cru-accent-green-bg hover:opacity-90 border border-cru-accent-green-border text-cru-accent-green text-xs font-bold flex items-center gap-1.5 transition-colors"
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
                        className="px-3.5 py-1.5 rounded-xl bg-cru-accent-sky-bg hover:opacity-90 border border-cru-accent-sky-border text-cru-accent-sky text-xs font-bold flex items-center gap-1.5 transition-colors"
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
                        className="px-3.5 py-1.5 rounded-xl bg-cru-accent-red-bg hover:opacity-90 border border-cru-accent-red-border text-cru-accent-red text-xs font-bold flex items-center gap-1.5 transition-colors"
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
          <div className="p-4 rounded-2xl bg-cru-surface border border-cru-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-cru-text flex items-center gap-2">
              <UserX className="w-4 h-4 text-cru-accent-amber" />
              <span>Lista de Cuentas Ciudadanas con Suspensión Activa</span>
            </h3>
            <span className="text-xs text-cru-text-muted">Total activos: {usuariosBaneados.length}</span>
          </div>

          {usuariosBaneados.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-cru-surface border border-dashed border-cru-border text-cru-text-muted text-xs">
              <CheckCircle2 className="w-8 h-8 text-cru-accent-green mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-cru-text">No existen baneos activos en este momento.</p>
              <p className="mt-1 text-cru-text-muted">Todas las cuentas ciudadanas tienen acceso habilitado.</p>
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
                    className="p-5 rounded-2xl bg-cru-surface border border-cru-accent-amber-border shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-cru-text text-base leading-snug">{u.nombre}</h4>
                          <div className="text-xs text-cru-text-muted">
                            Cédula: <span className="font-mono text-cru-text-soft">{u.cedula}</span> • Rol: {u.rol}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-cru-accent-amber-bg text-cru-accent-amber border border-cru-accent-amber-border shrink-0">
                          {sancion.nivel || 'Baneo'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-cru-surface-muted border border-cru-border space-y-1.5 text-xs mt-3">
                        <div className="text-cru-text-soft">
                          <span className="text-cru-text-muted font-semibold">Motivo: </span>
                          <span>{sancion.motivo || 'Infracción a las Reglas de Convivencia Cívica'}</span>
                        </div>
                        <div className="text-cru-text-soft">
                          <span className="text-cru-text-muted font-semibold">Strikes acumulados: </span>
                          <span className="font-bold text-cru-accent-amber">{sancion.strikes || 1}</span>
                        </div>
                        <div className="text-cru-text-soft">
                          <span className="text-cru-text-muted font-semibold">Tiempo restante: </span>
                          <span className="font-bold text-cru-text">
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
                      className="w-full py-2 px-4 rounded-xl bg-cru-accent-green-bg hover:opacity-90 border border-cru-accent-green-border text-cru-accent-green text-xs font-bold flex items-center justify-center gap-2 transition-colors"
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
          <div className="p-4 rounded-2xl bg-cru-surface border border-cru-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-cru-text flex items-center gap-2">
              <History className="w-4 h-4 text-cru-accent-purple" />
              <span>Registro Legal Inmutable de Acciones de Moderación</span>
            </h3>
            <span className="text-xs text-cru-text-muted">Total registros: {bitacora.length}</span>
          </div>

          <div className="rounded-2xl bg-cru-surface border border-cru-border overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-cru-surface-muted text-cru-text-muted border-b border-cru-border font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Fecha CST</th>
                    <th className="p-3">Acción</th>
                    <th className="p-3">Entidad Afectada</th>
                    <th className="p-3">Justificación / Motivo</th>
                    <th className="p-3">Administrador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cru-border text-cru-text-soft">
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
                      <tr key={log.id} className="hover:bg-cru-surface-muted transition-colors">
                        <td className="p-3 font-mono text-cru-text-muted whitespace-nowrap">
                          {log.fechaHoraCst || new Date(log.fecha || log.timestamp).toLocaleString('es-CR')}
                        </td>
                        <td className="p-3 font-bold text-cru-accent-sky">{log.accion}</td>
                        <td className="p-3 font-mono text-cru-text">{log.entidadAfectada}</td>
                        <td className="p-3 text-cru-text-soft max-w-xs truncate">{log.justificacion || log.justificante}</td>
                        <td className="p-3 text-cru-text-muted">{log.adminNombre || log.adminCedula}</td>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-lg w-full rounded-3xl bg-cru-surface-card border border-cru-border p-6 space-y-4 shadow-2xl text-cru-text">
            <div className="flex items-center justify-between border-b border-cru-border pb-3">
              <h4 className="font-bold text-cru-text text-base flex items-center gap-2">
                <Scale className="w-5 h-5 text-cru-accent-sky" />
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
                className="text-cru-text-muted hover:text-cru-text p-1 transition-colors"
                title="Cerrar modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-cru-text-soft leading-relaxed">
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
                <label className="text-xs font-bold text-cru-text">Nueva duración en horas:</label>
                <select
                  value={duracionExtraHoras}
                  onChange={(e) => setDuracionExtraHoras(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-theme-input-bg border border-theme-input-border text-theme-input-text text-xs outline-none focus:border-cru-accent-sky font-semibold cursor-pointer"
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
              <label className="text-xs font-bold text-cru-text">
                Justificación administrativa obligatoria (Ley N° 8968 / Auditoría):
              </label>
              <textarea
                rows={3}
                value={justificacionTexto}
                onChange={(e) => setJustificacionTexto(e.target.value)}
                placeholder="Detalla el fundamento de la decisión administrativa..."
                className="w-full p-3 text-xs rounded-xl bg-theme-input-bg border border-theme-input-border text-theme-input-text placeholder:text-cru-text-muted outline-none focus:border-cru-accent-sky"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-cru-border">
              <button
                type="button"
                onClick={() => setModalAccion(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cru-surface-muted hover:bg-cru-surface text-cru-text border border-cru-border transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={procesandoAccion || !justificacionTexto.trim()}
                onClick={ejecutarAccion}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cru-accent-sky hover:opacity-90 text-white disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
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
