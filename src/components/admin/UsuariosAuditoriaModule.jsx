/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO SOBERANO DE USUARIOS & AUDITORÍA CÍVICA
 * Arquitectura: Sovereign Civic Glass v2.1
 * Estándar Institucional: CERO EMOJIS | 100% SVG Vectorial Nativo
 * Marco Jurídico: Control RBAC y Ley General de Control Interno N° 8292
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { logAction, getDb, saveDb } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { eliminarUsuarioApi, registrarUsuarioApi, actualizarUsuarioApi } from '../../services/userService';
import { validateCedula } from '../../services/haciendaService';

// ============================================================================
// CATÁLOGO TERRITORIAL OFICIAL (7 PROVINCIAS | 84 CANTONES DE COSTA RICA)
// ============================================================================
const PROVINCIAS_OFICIALES = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón'
];

const CANTONES_POR_PROVINCIA = {
  'San José': [
    'San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú',
    'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita',
    'Vásquez de Coronado', 'Acosta', 'Tibás', 'Moravia', 'Montes de Oca',
    'Turrubares', 'Dota', 'Curridabat', 'Pérez Zeledón', 'León Cortés Castro'
  ],
  'Alajuela': [
    'Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas',
    'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos',
    'Zarcero', 'Sarchí', 'Upala', 'Los Chiles', 'Guatuso', 'Río Cuarto'
  ],
  'Cartago': [
    'Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba',
    'Alvarado', 'Oreamuno', 'El Guarco'
  ],
  'Heredia': [
    'Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael',
    'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'
  ],
  'Guanacaste': [
    'Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo',
    'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz', 'Hojancha'
  ],
  'Puntarenas': [
    'Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa',
    'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores',
    'Garabito', 'Monteverde', 'Puerto Jiménez'
  ],
  'Limón': [
    'Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo'
  ]
};

// ============================================================================
// ICONOGRAFÍA VECTORIAL TÉCNICA Y SOBERANA (CERO EMOJIS · 100% SVG)
// Atributos normalizados: width 16/18px, viewBox 0 0 24 24, stroke 1.75
// ============================================================================

const UsersNetworkIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <line x1="9" y1="11" x2="16" y2="7" />
  </svg>
);

const ShieldStarIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polygon points="12 8 13.2 10.5 16 10.9 14 12.8 14.5 15.5 12 14.2 9.5 15.5 10 12.8 8 10.9 10.8 10.5 12 8" />
  </svg>
);

const CheckCircleIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11.5 14.5 15.5 9.5" />
  </svg>
);

const AlertTriangleIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const DownloadTrayIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SearchLensIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PenEditIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const LockSecurityIcon = ({ className = 'w-4 h-4', width = 16, height = 16, locked = true }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    {locked ? (
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    ) : (
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    )}
  </svg>
);

const TrashBinIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const DiskSaveIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const OctagonAlertIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const XCloseIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FilterResetIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const UserPlusIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const EyeIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = 'w-4 h-4', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

// ============================================================================
// AUXILIARES DE NORMALIZACIÓN DE ROLES Y PERSISTENCIA
// ============================================================================

/**
 * Normaliza y clasifica cualquier rol en la tríada oficial
 * @returns {{ codigo: string, nombre: string, nivel: number, badgeClass: string, dotClass: string }}
 */
function normalizarRolInfo(rolRaw) {
  const r = (rolRaw || '').toUpperCase();
  if (r.includes('SUPER') || r.includes('NACIONAL')) {
    return {
      codigo: 'SUPER_ADMIN_NACIONAL',
      nombre: 'Super Administrador Nacional',
      nivel: 5,
      badgeClass: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
      dotClass: 'bg-rose-400'
    };
  }
  if (r.includes('GESTOR') || r.includes('TERRITORIAL') || r.includes('MUNICIPAL') || r.includes('PROVINCIAL')) {
    return {
      codigo: 'GESTOR_TERRITORIAL',
      nombre: 'Gestor Territorial',
      nivel: 4,
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      dotClass: 'bg-amber-400'
    };
  }
  return {
    codigo: 'CIUDADANO',
    nombre: 'Ciudadano Residente',
    nivel: 2,
    badgeClass: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    dotClass: 'bg-sky-400'
  };
}

const SEED_USUARIOS_FALLBACK = [
  {
    id: 'USR-NAC-001',
    cedula: '1-0000-0001',
    nombre: 'Superintendencia Nacional de Gobierno Digital',
    correo: 'admin.nacional@gob.cr',
    password: 'Admin123*',
    rol: 'Super Administrador Nacional',
    nivelAcceso: 5,
    provincia: 'Nacional',
    canton: 'Todas las Municipalidades',
    fechaRegistro: '2026-01-01T00:00:00Z',
    verificadoHacienda: true,
    estado: 'ACTIVO'
  }
];

/**
 * Carga la lista inicial de usuarios desde localStorage o semilla desacoplada
 */
function cargarUsuariosIniciales() {
  if (typeof window === 'undefined') {
    return SEED_USUARIOS_FALLBACK;
  }
  try {
    const rawCr = localStorage.getItem('cr_db_usuarios');
    if (rawCr) {
      const parsed = JSON.parse(rawCr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u) => ({
          ...u,
          estado: u.estado || 'ACTIVO',
          verificadoHacienda: u.verificadoHacienda ?? true
        }));
      }
    }

    const rawMock = localStorage.getItem('cru_mock_db_v2');
    if (rawMock) {
      const parsedMock = JSON.parse(rawMock);
      if (Array.isArray(parsedMock.usuarios) && parsedMock.usuarios.length > 0) {
        return parsedMock.usuarios.map((u) => ({
          ...u,
          estado: u.estado || 'ACTIVO',
          verificadoHacienda: u.verificadoHacienda ?? true
        }));
      }
    }

    localStorage.setItem('cr_db_usuarios', JSON.stringify(SEED_USUARIOS_FALLBACK));
    return SEED_USUARIOS_FALLBACK;
  } catch (err) {
    console.error('[UsuariosAuditoriaModule] Error leyendo padrón:', err);
    return SEED_USUARIOS_FALLBACK;
  }
}

/**
 * Persiste los cambios en localStorage, sincroniza cru_mock_db_v2 y emite eventos globales
 */
function persistirPadronUsuarios(listaActualizada) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('cr_db_usuarios', JSON.stringify(listaActualizada));

    try {
      const db = getDb();
      db.usuarios = listaActualizada;
      saveDb(db);
    } catch (_e) {
      // safe fallback
    }

    window.dispatchEvent(
      new CustomEvent('cr_db_usuarios_updated', { detail: listaActualizada })
    );

    // Si la sesión activa fue afectada, actualizar su perfil en cru_user_session
    try {
      const sesionRaw = localStorage.getItem('cru_user_session');
      if (sesionRaw) {
        const sesionObj = JSON.parse(sesionRaw);
        const match = listaActualizada.find(
          (u) => u.id === sesionObj.id || (u.cedula && u.cedula === sesionObj.cedula)
        );
        if (match) {
          const sesionActualizada = {
            ...sesionObj,
            rol: match.rol,
            nivelAcceso: match.nivelAcceso,
            provincia: match.provincia,
            canton: match.canton,
            estado: match.estado,
            verificadoHacienda: match.verificadoHacienda
          };
          localStorage.setItem('cru_user_session', JSON.stringify(sesionActualizada));
        }
      }
    } catch (_e) {
      // safe fallback
    }
  } catch (err) {
    console.error('[UsuariosAuditoriaModule] Error al persistir mutación:', err);
  }
}

// ============================================================================
// COMPONENTE PRINCIPAL: UsuariosAuditoriaModule
// ============================================================================
export default function UsuariosAuditoriaModule({
  usuariosProp = null,
  onUsuariosChange = null,
  currentUser = null
}) {
  // Contexto de autenticación para verificación de privilegios
  let authContext = null;
  try {
    authContext = useAuth ? useAuth() : null;
  } catch (_e) {
    authContext = null;
  }
  const user = authContext?.user || currentUser;

  // --------------------------------------------------------------------------
  // SEGREGACIÓN ESTRICTA RBAC (Principio de Menor Privilegio - Ley N° 8292)
  // El módulo de Padrón y Auditoría es de uso EXCLUSIVO de Nivel 5 (Super Administrador Nacional).
  // Los Gestores Territoriales (Nivel 4) y Ciudadanos (Nivel 2) tienen denegado el acceso de raíz.
  // --------------------------------------------------------------------------
  const rolNormalizado = String(user?.rol || '').toUpperCase().trim();
  const nivelUsuario = Number(user?.nivelAcceso ?? 0);
  const esSuperAdminNacional =
    nivelUsuario >= 5 ||
    rolNormalizado.includes('SUPER') ||
    rolNormalizado === 'SUPER_ADMIN_NACIONAL' ||
    rolNormalizado === 'SUPER_ADMIN';

  if (!esSuperAdminNacional) {
    return (
      <div className="p-8 rounded-3xl bg-[#050C1C] border border-rose-500/30 text-center space-y-4 max-w-2xl mx-auto my-8 shadow-2xl animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <AlertTriangleIcon width={28} height={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Módulo Reservado Exclusivamente a Nivel 5</h3>
          <p className="text-xs text-rose-300 font-mono">
            [SEGURIDAD RBAC] ACCESO DENEGADO • SUPERINTENDENCIA NACIONAL
          </p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
          El módulo de <strong>Usuarios & Auditoría Inmutable</strong> del Padrón Nacional contiene datos protegidos bajo la Ley N° 8968 y Ley N° 8292. Los Gestores Territoriales (Nivel 4) tienen jurisdicción limitada a Gobiernos Locales, Obras Cantonales, Gaceta y Emergencias CNE.
        </p>
      </div>
    );
  }

  // 1. Estado reactivo del padrón cívico
  const [usuarios, setUsuarios] = useState(() => {
    if (Array.isArray(usuariosProp) && usuariosProp.length > 0) {
      return usuariosProp.map((u) => ({
        ...u,
        estado: u.estado || 'ACTIVO',
        verificadoHacienda: u.verificadoHacienda ?? true
      }));
    }
    return cargarUsuariosIniciales();
  });

  // Notificación toast flotante
  const [toastMensaje, setToastMensaje] = useState(null);

  const mostrarToast = useCallback((msg) => {
    setToastMensaje(msg);
    setTimeout(() => {
      setToastMensaje((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // 2. Estados de Búsqueda y Filtros Multicriterio
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroProvincia, setFiltroProvincia] = useState('TODAS');
  const [filtroHacienda, setFiltroHacienda] = useState('TODOS');

  // 3. Estados para Modales de Doble Verificación
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [isSavingEdicion, setIsSavingEdicion] = useState(false);
  const [formularioEdicion, setFormularioEdicion] = useState({
    rol: 'CIUDADANO',
    provincia: 'San José',
    canton: 'San José',
    forzarCambioPassword: false,
    verificadoHacienda: true
  });

  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [confirmacionBaja, setConfirmacionBaja] = useState(false);

  // Estados para Modal de Registro de Usuario Oficial
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formularioCrear, setFormularioCrear] = useState({
    cedula: '',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    password: '',
    nuevoRol: 'CIUDADANO',
    nuevaProvincia: 'San José',
    nuevoCanton: 'San José',
    nuevoEstado: 'ACTIVO',
    isHaciendaVerified: false
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [validandoHacienda, setValidandoHacienda] = useState(false);
  const [haciendaMensaje, setHaciendaMensaje] = useState(null);
  const [haciendaError, setHaciendaError] = useState(null);
  const [isSubmittingCrear, setIsSubmittingCrear] = useState(false);

  const resetFormularioCrear = () => {
    setFormularioCrear({
      cedula: '',
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      correo: '',
      password: '',
      nuevoRol: 'CIUDADANO',
      nuevaProvincia: 'San José',
      nuevoCanton: 'San José',
      nuevoEstado: 'ACTIVO',
      isHaciendaVerified: false
    });
    setMostrarPassword(false);
    setHaciendaMensaje(null);
    setHaciendaError(null);
    setIsSubmittingCrear(false);
  };

  // Sincronización si cambian las props
  useEffect(() => {
    if (Array.isArray(usuariosProp)) {
      setUsuarios(
        usuariosProp.map((u) => ({
          ...u,
          estado: u.estado || 'ACTIVO',
          verificadoHacienda: u.verificadoHacienda ?? true
        }))
      );
    }
  }, [usuariosProp]);

  // Sincronización ante eventos de actualización externa
  useEffect(() => {
    const handleUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        setUsuarios(
          e.detail.map((u) => ({
            ...u,
            estado: u.estado || 'ACTIVO',
            verificadoHacienda: u.verificadoHacienda ?? true
          }))
        );
      }
    };
    window.addEventListener('cr_db_usuarios_updated', handleUpdate);
    return () => window.removeEventListener('cr_db_usuarios_updated', handleUpdate);
  }, []);

  // Carga reactiva inicial desde json-server (puerto 3001) con fallback a localStorage
  useEffect(() => {
    const cargarUsuariosServidor = async () => {
      try {
        const res = await fetch('http://localhost:3001/usuarios');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setUsuarios(
              data.map((u) => ({
                ...u,
                estado: u.estado || 'ACTIVO',
                verificadoHacienda: u.verificadoHacienda ?? true
              }))
            );
            localStorage.setItem('cr_db_usuarios', JSON.stringify(data));
          }
        }
      } catch (_error) {
        console.warn('json-server no disponible, cargando de localStorage');
      }
    };
    cargarUsuariosServidor();
  }, []);

  // 4. Métricas de Telemetría (Sovereign Civic Glass v2.1)
  const metricas = useMemo(() => {
    const total = usuarios.length;
    const gestoresActivos = usuarios.filter((u) => {
      const info = normalizarRolInfo(u.rol);
      return info.codigo === 'GESTOR_TERRITORIAL' && (u.estado || 'ACTIVO') === 'ACTIVO';
    }).length;
    const verificadosHacienda = usuarios.filter((u) => Boolean(u.verificadoHacienda)).length;
    const suspendidosORevision = usuarios.filter((u) => (u.estado || 'ACTIVO') === 'SUSPENDIDO').length;

    return {
      total,
      gestoresActivos,
      verificadosHacienda,
      suspendidosORevision
    };
  }, [usuarios]);

  // 5. Filtrado Multicriterio Reactivo
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      // A. Búsqueda por texto (cédula, nombre o correo)
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const cedulaLimpia = (u.cedula || '').replace(/[^0-9]/g, '');
        const qLimpia = q.replace(/[^0-9]/g, '');

        const matchCedula =
          (u.cedula || '').toLowerCase().includes(q) ||
          (qLimpia.length >= 3 && cedulaLimpia.includes(qLimpia));
        const matchNombre = (u.nombre || '').toLowerCase().includes(q);
        const matchCorreo = (u.correo || u.email || '').toLowerCase().includes(q);

        if (!matchCedula && !matchNombre && !matchCorreo) {
          return false;
        }
      }

      // B. Filtro por Rol
      if (filtroRol !== 'TODOS') {
        const info = normalizarRolInfo(u.rol);
        if (info.codigo !== filtroRol) {
          return false;
        }
      }

      // C. Filtro por Estado
      if (filtroEstado !== 'TODOS') {
        const est = (u.estado || 'ACTIVO').toUpperCase();
        if (est !== filtroEstado) {
          return false;
        }
      }

      // D. Filtro por Provincia
      if (filtroProvincia !== 'TODAS') {
        const prov = (u.provincia || '').toLowerCase();
        const provFiltro = filtroProvincia.toLowerCase();
        if (!prov.includes(provFiltro)) {
          return false;
        }
      }

      // E. Filtro de Hacienda
      if (filtroHacienda !== 'TODOS') {
        const esVerificado = Boolean(u.verificadoHacienda);
        if (filtroHacienda === 'VERIFICADOS' && !esVerificado) return false;
        if (filtroHacienda === 'NO_VERIFICADOS' && esVerificado) return false;
      }

      return true;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado, filtroProvincia, filtroHacienda]);

  // 6. Restablecer Filtros
  const hayFiltrosActivos =
    busqueda.trim() !== '' ||
    filtroRol !== 'TODOS' ||
    filtroEstado !== 'TODOS' ||
    filtroProvincia !== 'TODAS' ||
    filtroHacienda !== 'TODOS';

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroRol('TODOS');
    setFiltroEstado('TODOS');
    setFiltroProvincia('TODAS');
    setFiltroHacienda('TODOS');
  };

  // 7. Exportación del Padrón Cívico en Formato CSV
  const exportarPadronCSV = () => {
    const encabezados = [
      'ID Expediente',
      'Cédula Oficial',
      'Nombre Completo',
      'Correo Electrónico',
      'Rol Institucional',
      'Nivel Acceso',
      'Provincia',
      'Cantón',
      'Estado',
      'Cotejo Hacienda ATV',
      'Fecha Registro'
    ];

    const filas = usuariosFiltrados.map((u) => {
      const info = normalizarRolInfo(u.rol);
      return [
        `"${u.id || ''}"`,
        `"${u.cedula || ''}"`,
        `"${(u.nombre || '').replace(/"/g, '""')}"`,
        `"${u.correo || u.email || ''}"`,
        `"${info.nombre}"`,
        `"Nivel ${info.nivel}"`,
        `"${u.provincia || 'Nacional'}"`,
        `"${u.canton || 'Central'}"`,
        `"${u.estado || 'ACTIVO'}"`,
        `"${u.verificadoHacienda ? 'Verificado ATV' : 'Pendiente'}"`,
        `"${u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleString('es-CR') : 'Oficial'}"`
      ].join(',');
    });

    const csvData = '\uFEFF' + [encabezados.join(','), ...filas].join('\r\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `padron_civico_costa_rica_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    mostrarToast('Padrón cívico oficial exportado exitosamente en formato CSV.');
  };

  // 8. Control de Acciones: Suspender / Reactivar
  const toggleSuspension = (usuario) => {
    const nuevoEstado = (usuario.estado || 'ACTIVO') === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO';
    const listaActualizada = usuarios.map((u) => {
      if (u.id === usuario.id || u.cedula === usuario.cedula) {
        return { ...u, estado: nuevoEstado };
      }
      return u;
    });

    setUsuarios(listaActualizada);
    persistirPadronUsuarios(listaActualizada);
    if (onUsuariosChange) onUsuariosChange(listaActualizada);

    // Registro inmutable en bitácora de auditoría
    const adminEjecutor = currentUser?.nombre || 'Super Administrador Nacional';
    const adminCedula = currentUser?.cedula || '1-0000-0001';
    logAction(
      adminCedula,
      adminEjecutor,
      'Super Administrador Nacional',
      nuevoEstado === 'SUSPENDIDO' ? 'SUSPENSION_CUENTA' : 'REACTIVACION_CUENTA',
      `Cambio de estado cívico a ${nuevoEstado} para expediente ${usuario.nombre} (${usuario.cedula}) bajo Ley N° 8292.`
    );

    mostrarToast(
      nuevoEstado === 'SUSPENDIDO'
        ? `Cuenta de ${usuario.nombre} suspendida preventivamente.`
        : `Cuenta de ${usuario.nombre} reactivada con plenos derechos cívicos.`
    );
  };

  // 9. Control de Acciones: Iniciar Modal de Edición
  const iniciarEdicion = (usuario) => {
    const rolInfo = normalizarRolInfo(usuario.rol);
    const provValida = PROVINCIAS_OFICIALES.includes(usuario.provincia)
      ? usuario.provincia
      : 'San José';
    const cantonesDisponibles = CANTONES_POR_PROVINCIA[provValida] || CANTONES_POR_PROVINCIA['San José'];
    const cantonValido = cantonesDisponibles.includes(usuario.canton)
      ? usuario.canton
      : cantonesDisponibles[0];

    setFormularioEdicion({
      rol: rolInfo.codigo,
      provincia: provValida,
      canton: cantonValido,
      forzarCambioPassword: Boolean(usuario.forzarCambioPassword),
      verificadoHacienda: usuario.verificadoHacienda ?? true
    });
    setUsuarioAEditar(usuario);
  };

  // Guardar Cambios Oficiales de Edición (Conectado a json-server vía HTTP PATCH)
  const guardarCambiosEdicion = async (e) => {
    e.preventDefault();
    if (!usuarioAEditar) return;

    setIsSavingEdicion(true);

    // 1. Determinar el nivel de acceso exacto según el rol asignado
    const rolSeleccionado = formularioEdicion.rol;
    const nuevoNivelAcceso =
      rolSeleccionado === 'Super Administrador Nacional' || rolSeleccionado === 'SUPER_ADMIN_NACIONAL'
        ? 5
        : rolSeleccionado === 'Gestor Territorial' || rolSeleccionado === 'GESTOR_TERRITORIAL'
        ? 4
        : 2;

    const nombreRolOficial =
      nuevoNivelAcceso === 5
        ? 'Super Administrador Nacional'
        : nuevoNivelAcceso === 4
        ? 'Gestor Territorial'
        : 'Ciudadano Residente';

    const provinciaFinal =
      nuevoNivelAcceso === 5 ? 'Nacional' : formularioEdicion.provincia;
    const cantonFinal =
      nuevoNivelAcceso === 5
        ? 'Todas las Municipalidades'
        : formularioEdicion.canton;

    const payloadCambios = {
      rol: nombreRolOficial,
      nivelAcceso: nuevoNivelAcceso,
      provincia: provinciaFinal,
      canton: cantonFinal,
      forzarCambioPassword: Boolean(formularioEdicion.forzarCambioPassword),
      verificadoHacienda: Boolean(formularioEdicion.verificadoHacienda)
    };

    // 2. Enviar actualización física a db.json vía json-server / API
    const exitoApi = await actualizarUsuarioApi(usuarioAEditar.id, payloadCambios);

    if (exitoApi) {
      // 3. Si json-server confirmó el guardado, actualizar el estado visual de la tabla
      const listaActualizada = usuarios.map((u) => {
        if (u.id === usuarioAEditar.id || u.cedula === usuarioAEditar.cedula) {
          return {
            ...u,
            ...payloadCambios
          };
        }
        return u;
      });

      setUsuarios(listaActualizada);
      persistirPadronUsuarios(listaActualizada);
      if (onUsuariosChange) onUsuariosChange(listaActualizada);

      // 4. Sincronizar localStorage si se usa como respaldo
      const cacheLocal = localStorage.getItem('cr_db_usuarios');
      if (cacheLocal) {
        try {
          const parsed = JSON.parse(cacheLocal);
          const actualizados = parsed.map((u) =>
            u.id === usuarioAEditar.id || u.cedula === usuarioAEditar.cedula
              ? { ...u, ...payloadCambios }
              : u
          );
          localStorage.setItem('cr_db_usuarios', JSON.stringify(actualizados));
        } catch (_err) {
          // ignore
        }
      }

      // Registro inmutable en bitácora de auditoría
      const adminEjecutor = currentUser?.nombre || 'Super Administrador Nacional';
      const adminCedula = currentUser?.cedula || '1-0000-0001';
      logAction(
        adminCedula,
        adminEjecutor,
        'Super Administrador Nacional',
        'ACTUALIZACION_EXPEDIENTE',
        `Actualización de credenciales para ${usuarioAEditar.nombre}: Rol ${nombreRolOficial}, Jurisdicción ${cantonFinal}, ${provinciaFinal}.`
      );

      setUsuarioAEditar(null);
      mostrarToast(`Expediente cívico de ${usuarioAEditar.nombre} actualizado satisfactoriamente en db.json.`);
    } else {
      mostrarToast('No se pudo guardar el cambio en db.json. Verifique que json-server esté corriendo.');
    }

    setIsSavingEdicion(false);
  };

  // 10. Control de Acciones: Iniciar Modal de Eliminación Definitiva
  const iniciarBajaDefinitiva = (usuario) => {
    // Permiso exclusivo del Super Administrador Nacional
    const rolActual = user?.rol || '';
    const nivelActual = Number(user?.nivelAcceso || 0);
    const esSuperAdmin =
      rolActual === 'SUPER_ADMIN_NACIONAL' ||
      nivelActual === 5 ||
      (typeof rolActual === 'string' && (rolActual.includes('Super') || rolActual.includes('Nacional')));

    if (!esSuperAdmin) {
      alert('Acción denegada: Solo el Super Administrador Nacional puede dar de baja registros en la base de datos.');
      return;
    }

    setUsuarioAEliminar(usuario);
    setConfirmacionBaja(false);
  };

  // Confirmar y Ejecutar Eliminación Física en db.json (API / json-server)
  const handleConfirmarEliminacion = async () => {
    if (!usuarioAEliminar) return;

    // Permiso exclusivo del Super Administrador Nacional
    const rolActual = user?.rol || '';
    const nivelActual = Number(user?.nivelAcceso || 0);
    const esSuperAdmin =
      rolActual === 'SUPER_ADMIN_NACIONAL' ||
      nivelActual === 5 ||
      (typeof rolActual === 'string' && (rolActual.includes('Super') || rolActual.includes('Nacional')));

    if (!esSuperAdmin) {
      alert('Acción denegada: Solo el Super Administrador Nacional puede dar de baja registros en la base de datos.');
      return;
    }

    try {
      // 1. Eliminar físicamente en db.json mediante json-server (con fallback a API local)
      let eliminacionExitosa = false;
      try {
        const res = await fetch(`http://localhost:3001/usuarios/${usuarioAEliminar.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          eliminacionExitosa = true;
        }
      } catch (_jsonErr) {
        eliminacionExitosa = false;
      }

      if (!eliminacionExitosa) {
        eliminacionExitosa = await eliminarUsuarioApi(usuarioAEliminar.id);
      }

      if (eliminacionExitosa) {
        // 2. Actualizar el estado de React en memoria (sin recargar la página)
        setUsuarios((prev) =>
          prev.filter((u) => u.id !== usuarioAEliminar.id && u.cedula !== usuarioAEliminar.cedula)
        );

        // 3. Sincronizar localStorage
        const cache = localStorage.getItem('cr_db_usuarios');
        if (cache) {
          try {
            const lista = JSON.parse(cache).filter(
              (u) => u.id !== usuarioAEliminar.id && u.cedula !== usuarioAEliminar.cedula
            );
            localStorage.setItem('cr_db_usuarios', JSON.stringify(lista));
          } catch (_e) {
            // safe fallback
          }
        }

        // Sincronizar cru_mock_db_v2
        try {
          const db = getDb();
          db.usuarios = (db.usuarios || []).filter(
            (u) => u.id !== usuarioAEliminar.id && u.cedula !== usuarioAEliminar.cedula
          );
          saveDb(db);
        } catch (_e) {}

        window.dispatchEvent(
          new CustomEvent('cr_db_usuarios_updated', {
            detail: usuarios.filter((u) => u.id !== usuarioAEliminar.id && u.cedula !== usuarioAEliminar.cedula)
          })
        );

        if (onUsuariosChange) {
          onUsuariosChange(
            usuarios.filter((u) => u.id !== usuarioAEliminar.id && u.cedula !== usuarioAEliminar.cedula)
          );
        }

        // Registro inmutable en bitácora de auditoría
        const adminEjecutor = user?.nombre || 'Super Administrador Nacional';
        const adminCedula = user?.cedula || '1-0000-0001';
        logAction(
          adminCedula,
          adminEjecutor,
          'Super Administrador Nacional',
          'BAJA_DEFINITIVA_EXPEDIENTE',
          `Revocación permanente y baja inmutable de identidad digital para ${usuarioAEliminar.nombre} (${usuarioAEliminar.cedula}) bajo Ley N° 8292. Persistencia física en db.json: Éxito.`
        );

        const nombreEliminado = usuarioAEliminar.nombre;
        setUsuarioAEliminar(null);
        setConfirmacionBaja(false);
        mostrarToast(`Expediente de ${nombreEliminado} revocado y eliminado físicamente de db.json.`);
      } else {
        alert('No se pudo eliminar de la base de datos.');
      }
    } catch (err) {
      console.error('Error al conectar con json-server:', err);
    }
  };

  const ejecutarBajaDefinitiva = handleConfirmarEliminacion;

  // Función para procesar y asignar correctamente Nombres y Apellidos desde Hacienda
  const procesarNombreHaciendaModal = (nombreCompleto) => {
    if (!nombreCompleto) return;
    const partes = nombreCompleto.trim().split(/\s+/);

    if (partes.length >= 3) {
      // 1. La última palabra SIEMPRE es el Segundo Apellido (ej. "LEIVA" o "MURILLO")
      const segAp = partes[partes.length - 1];

      // 2. La penúltima palabra SIEMPRE es el Primer Apellido (ej. "PEREZ" o "ABARCA")
      const primAp = partes[partes.length - 2];

      // 3. Todas las palabras anteriores SIEMPRE son los Nombre(s) de Pila (ej. "ANDRES" o "EIKER MANUEL")
      const nom = partes.slice(0, partes.length - 2).join(' ');

      setFormularioCrear((prev) => ({
        ...prev,
        nombres: nom,
        primerApellido: primAp,
        segundoApellido: segAp,
        isHaciendaVerified: true
      }));
    } else if (partes.length === 2) {
      // Caso con un solo apellido: "ANDRES PEREZ"
      setFormularioCrear((prev) => ({
        ...prev,
        nombres: partes[0],
        primerApellido: partes[1],
        segundoApellido: '',
        isHaciendaVerified: true
      }));
    } else {
      setFormularioCrear((prev) => ({
        ...prev,
        nombres: nombreCompleto.trim(),
        primerApellido: '',
        segundoApellido: '',
        isHaciendaVerified: true
      }));
    }
  };

  // Validación de Cédula ante Ministerio de Hacienda (API Oficial)
  const handleValidarHacienda = async () => {
    const cedulaLimpia = (formularioCrear.cedula || '').replace(/[^0-9]/g, '');
    if (!cedulaLimpia || cedulaLimpia.length < 9) {
      setHaciendaError('Ingrese una identificación válida de al menos 9 dígitos para consultar.');
      setHaciendaMensaje(null);
      return;
    }

    setValidandoHacienda(true);
    setHaciendaError(null);
    setHaciendaMensaje(null);

    try {
      const res = await validateCedula(cedulaLimpia);
      if (res.isValid && res.nombreOficial) {
        procesarNombreHaciendaModal(res.nombreOficial);
        setHaciendaMensaje(`Identidad verificada ante Hacienda: ${res.nombreOficial}`);
      } else {
        setHaciendaError(
          res.mensajeError ||
            'La cédula no fue encontrada en la base tributaria. Puede ingresar los datos manualmente.'
        );
        setFormularioCrear((prev) => ({ ...prev, isHaciendaVerified: false }));
      }
    } catch (_err) {
      setHaciendaError('No se pudo conectar con la API de Hacienda. Puede ingresar los datos manualmente.');
    } finally {
      setValidandoHacienda(false);
    }
  };

  // Creación y Alta Oficial de Usuario en db.json mediante json-server
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setIsSubmittingCrear(true);

    const {
      cedula,
      nombres,
      primerApellido,
      segundoApellido,
      correo,
      password,
      nuevoRol,
      nuevaProvincia,
      nuevoCanton,
      nuevoEstado,
      isHaciendaVerified
    } = formularioCrear;

    const cedulaLimpia = cedula.trim();
    const nombresLimpios = nombres.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const passLimpio = password.trim();

    if (!cedulaLimpia || !nombresLimpios || !correoLimpio || !passLimpio) {
      alert('Por favor complete los campos obligatorios: Cédula, Nombres, Correo y Contraseña.');
      setIsSubmittingCrear(false);
      return;
    }

    // 1. Generar ID y formatear estructura exacta de db.json
    const prefijoId =
      nuevoRol === 'SUPER_ADMIN_NACIONAL'
        ? 'USR-NAC'
        : nuevoRol === 'GESTOR_TERRITORIAL'
        ? 'USR-TER'
        : 'USR-CIUD';
    const nuevoId = `${prefijoId}-${Math.floor(1000 + Math.random() * 9000)}`;

    const nombreCompleto =
      [nombresLimpios, primerApellido.trim(), segundoApellido.trim()]
        .filter(Boolean)
        .join(' ') || nombresLimpios;

    const rolTexto =
      nuevoRol === 'SUPER_ADMIN_NACIONAL'
        ? 'Super Administrador Nacional'
        : nuevoRol === 'GESTOR_TERRITORIAL'
        ? 'Gestor Territorial'
        : 'Ciudadano Residente';

    const nivelAcceso =
      nuevoRol === 'SUPER_ADMIN_NACIONAL' ? 5 : nuevoRol === 'GESTOR_TERRITORIAL' ? 4 : 2;

    const provFinal = nuevoRol === 'SUPER_ADMIN_NACIONAL' ? 'Nacional' : nuevaProvincia;
    const cantonFinal =
      nuevoRol === 'SUPER_ADMIN_NACIONAL' ? 'Todas las Municipalidades' : nuevoCanton;

    const nuevoUsuario = {
      id: nuevoId,
      cedula: cedulaLimpia,
      nombre: nombreCompleto,
      correo: correoLimpio,
      email: correoLimpio,
      password: passLimpio,
      rol: rolTexto,
      nivelAcceso,
      provincia: provFinal,
      canton: cantonFinal,
      fechaRegistro: new Date().toISOString(),
      verificadoHacienda: Boolean(isHaciendaVerified),
      estado: nuevoEstado || 'ACTIVO'
    };

    try {
      // 2. Guardar físicamente en db.json mediante json-server (con fallback a API local)
      let usuarioGuardado = null;
      try {
        const response = await fetch('http://localhost:3001/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoUsuario)
        });

        if (response.ok) {
          usuarioGuardado = await response.json();
          usuarioGuardado = {
            ...nuevoUsuario,
            ...usuarioGuardado,
            id: usuarioGuardado.id || nuevoId
          };
        }
      } catch (_jsonErr) {
        console.warn('json-server no disponible directo, intentando fallback de API local');
      }

      // Si json-server no respondió o falló, recurrir al middleware de desarrollo
      if (!usuarioGuardado) {
        const fallbackRes = await registrarUsuarioApi({
          cedula: nuevoUsuario.cedula,
          nombre: nombresLimpios,
          primerApellido: primerApellido.trim(),
          segundoApellido: segundoApellido.trim(),
          correo: nuevoUsuario.correo,
          password: nuevoUsuario.password,
          rol: nuevoUsuario.rol,
          provincia: nuevoUsuario.provincia,
          canton: nuevoUsuario.canton,
          verificadoHacienda: nuevoUsuario.verificadoHacienda
        });

        if (fallbackRes.success && fallbackRes.user) {
          usuarioGuardado = {
            ...nuevoUsuario,
            ...fallbackRes.user,
            id: fallbackRes.user.id || nuevoId
          };
        } else {
          usuarioGuardado = nuevoUsuario;
        }
      }

      // 3. Actualizar la tabla visual en React en tiempo real
      setUsuarios((prev) => [usuarioGuardado, ...prev]);

      // 4. Sincronizar localStorage si se usa
      const cache = localStorage.getItem('cr_db_usuarios');
      if (cache) {
        try {
          const parsed = JSON.parse(cache);
          localStorage.setItem('cr_db_usuarios', JSON.stringify([usuarioGuardado, ...parsed]));
        } catch (_e) {
          localStorage.setItem('cr_db_usuarios', JSON.stringify([usuarioGuardado]));
        }
      } else {
        localStorage.setItem('cr_db_usuarios', JSON.stringify([usuarioGuardado]));
      }

      // Sincronizar cru_mock_db_v2
      try {
        const db = getDb();
        db.usuarios = [usuarioGuardado, ...(db.usuarios || [])];
        saveDb(db);
      } catch (_e) {}

      window.dispatchEvent(
        new CustomEvent('cr_db_usuarios_updated', {
          detail: [usuarioGuardado, ...usuarios]
        })
      );

      if (onUsuariosChange) {
        onUsuariosChange([usuarioGuardado, ...usuarios]);
      }

      // Registro inmutable en bitácora de auditoría
      const adminEjecutor = user?.nombre || 'Super Administrador Nacional';
      const adminCedula = user?.cedula || '1-0000-0001';
      logAction(
        adminCedula,
        adminEjecutor,
        'Super Administrador Nacional',
        'ALTA_USUARIO_PADRON',
        `Alta oficial de expediente cívico digital para ${usuarioGuardado.nombre} (${usuarioGuardado.cedula}) con rol ${rolTexto} bajo Ley N° 8292.`
      );

      // Cerrar modal y limpiar formulario
      setIsCreateModalOpen(false);
      resetFormularioCrear();
      mostrarToast(`Expediente oficial creado exitosamente para ${usuarioGuardado.nombre} y persistido en db.json.`);
    } catch (error) {
      console.error('Error al conectar con json-server:', error);
      alert('Ocurrió un error al procesar el registro del nuevo usuario.');
    } finally {
      setIsSubmittingCrear(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Toast Flotante Soberano */}
      {toastMensaje && (
        <div className="fixed top-6 right-6 z-[100] max-w-md p-4 rounded-2xl bg-[#050C1C]/95 border border-sky-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-slideDown">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <CheckCircleIcon width={18} height={18} />
          </div>
          <p className="text-xs font-medium text-slate-200">{toastMensaje}</p>
        </div>
      )}

      {/* ====================================================================
          1. CABECERA Y TARJETAS DE TELEMETRÍA (SOVEREIGN CIVIC GLASS v2.1)
          ==================================================================== */}
      <div className="space-y-6">
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-sky-500/10 border border-sky-400/20 text-sky-300 mb-2">
              <UsersNetworkIcon width={14} height={14} className="text-sky-400" />
              <span>SISTEMA NACIONAL DE CONTROL DE PADRÓN CÍVICO</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Padrón & Auditoría Cívica Institucional
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Consola soberana de fiscalización de identidades digitales, asignación jerárquica
              RBAC y verificación tributaria directa ante el Ministerio de Hacienda (Ley N° 8292).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1E88E5]/25 hover:bg-[#1E88E5]/35 active:scale-[0.98] border border-sky-400/50 text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30 cursor-pointer"
              title="Registrar una nueva cuenta oficial en el padrón soberano"
            >
              <UserPlusIcon width={16} height={16} className="text-sky-300" />
              <span>Nuevo Usuario Oficial</span>
            </button>
            <button
              type="button"
              onClick={exportarPadronCSV}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-[0.98] border border-white/10 text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-lg hover:border-white/20"
              title="Descargar padrón filtrado en formato CSV compatible con hojas de cálculo"
            >
              <DownloadTrayIcon width={16} height={16} className="text-sky-400" />
              <span>Exportar Padrón (CSV)</span>
            </button>
          </div>
        </div>

        {/* 4 Tarjetas Métricas en Vidrio Translúcido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Métrica 1: Total Cuentas Registradas */}
          <div className="rounded-2xl p-5 bg-[#050C1C]/70 backdrop-blur-[24px] border border-white/10 hover:border-sky-500/30 transition-all shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Cuentas
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <UsersNetworkIcon width={16} height={16} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-mono font-bold text-white">
              {metricas.total.toLocaleString('es-CR')}
            </div>
            <p className="text-[11px] text-slate-400">Padrón cívico y administrativo consolidado</p>
          </div>

          {/* Métrica 2: Gestores Territoriales Activos */}
          <div className="rounded-2xl p-5 bg-[#050C1C]/70 backdrop-blur-[24px] border border-white/10 hover:border-amber-500/30 transition-all shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Gestores Activos
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldStarIcon width={16} height={16} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-mono font-bold text-amber-300">
              {metricas.gestoresActivos.toLocaleString('es-CR')}
            </div>
            <p className="text-[11px] text-slate-400">Gobernanza cantonal y provincial</p>
          </div>

          {/* Métrica 3: Ciudadanos Verificados por Hacienda */}
          <div className="rounded-2xl p-5 bg-[#050C1C]/70 backdrop-blur-[24px] border border-white/10 hover:border-emerald-500/30 transition-all shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Verificados Hacienda
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircleIcon width={16} height={16} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-mono font-bold text-emerald-400">
              {metricas.verificadosHacienda.toLocaleString('es-CR')}
            </div>
            <p className="text-[11px] text-slate-400">Certificación fiscal y tributaria ATV</p>
          </div>

          {/* Métrica 4: Cuentas en Revisión / Suspendidas */}
          <div className="rounded-2xl p-5 bg-[#050C1C]/70 backdrop-blur-[24px] border border-white/10 hover:border-rose-500/30 transition-all shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Cuentas Suspendidas
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangleIcon width={16} height={16} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-mono font-bold text-rose-400">
              {metricas.suspendidosORevision.toLocaleString('es-CR')}
            </div>
            <p className="text-[11px] text-slate-400">Acceso preventivo restringido</p>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. BARRA DE BÚSQUEDA Y FILTROS MULTICRITERIO
          ==================================================================== */}
      <div className="rounded-3xl p-5 bg-[#050C1C]/70 backdrop-blur-[24px] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Campo de Búsqueda Reactivo */}
          <div className="relative flex-1 max-w-md">
            <SearchLensIcon
              width={16}
              height={16}
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cédula, nombre o correo..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-colors"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                title="Limpiar búsqueda"
              >
                <XCloseIcon width={14} height={14} />
              </button>
            )}
          </div>

          {/* Selectores Desplegables Estilizados en Vidrio Oscuro */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filtro por Rol */}
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-200 focus:border-sky-500 focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Rol: Todos</option>
              <option value="SUPER_ADMIN_NACIONAL">Super Administrador Nacional</option>
              <option value="GESTOR_TERRITORIAL">Gestor Territorial</option>
              <option value="CIUDADANO">Ciudadano Residente</option>
            </select>

            {/* Filtro por Estado */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-200 focus:border-sky-500 focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Estado: Todos</option>
              <option value="ACTIVO">Activos</option>
              <option value="SUSPENDIDO">Suspendidos</option>
            </select>

            {/* Filtro por Provincia */}
            <select
              value={filtroProvincia}
              onChange={(e) => setFiltroProvincia(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-200 focus:border-sky-500 focus:outline-none cursor-pointer"
            >
              <option value="TODAS">Provincia: Todas</option>
              {PROVINCIAS_OFICIALES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>

            {/* Filtro de Hacienda */}
            <select
              value={filtroHacienda}
              onChange={(e) => setFiltroHacienda(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-200 focus:border-sky-500 focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Hacienda: Todos</option>
              <option value="VERIFICADOS">Verificados Oficiales</option>
              <option value="NO_VERIFICADOS">No Verificados</option>
            </select>

            {/* Botón Restablecer si hay filtros aplicados */}
            {hayFiltrosActivos && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
                title="Restablecer todos los filtros"
              >
                <FilterResetIcon width={14} height={14} />
                <span>Restablecer</span>
              </button>
            )}
          </div>
        </div>

        {/* Resumen de Registros Filtrados */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2">
          <span>
            Mostrando <strong className="font-mono text-sky-300">{usuariosFiltrados.length}</strong> de{' '}
            <strong className="font-mono text-slate-200">{usuarios.length}</strong> expedientes registrados.
          </span>
          {hayFiltrosActivos && (
            <span className="text-amber-400/90 font-mono text-[10px]">
              Filtro multicriterio activo
            </span>
          )}
        </div>
      </div>

      {/* ====================================================================
          3. TABLA DE PADRÓN Y AUDITORÍA CÍVICA
          ==================================================================== */}
      <div className="rounded-3xl bg-[#050C1C]/70 backdrop-blur-[24px] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#09152C]/80 text-slate-300 uppercase tracking-wider font-semibold border-b border-white/10 text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">IDENTIFICACIÓN Y CIUDADANO</th>
                <th className="py-3.5 px-4 font-semibold">CORREO ELECTRÓNICO</th>
                <th className="py-3.5 px-4 font-semibold">ROL Y JERARQUÍA</th>
                <th className="py-3.5 px-4 font-semibold">JURISDICCIÓN</th>
                <th className="py-3.5 px-4 font-semibold">ESTADO</th>
                <th className="py-3.5 px-4 text-right font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 mx-auto flex items-center justify-center text-slate-500">
                      <SearchLensIcon width={20} height={20} />
                    </div>
                    <div className="text-sm font-semibold text-slate-300">
                      No se encontraron coincidencias en el padrón
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Modifique los parámetros de búsqueda o restablezca los filtros para visualizar más expedientes.
                    </p>
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u) => {
                  const rolInfo = normalizarRolInfo(u.rol);
                  const estaActivo = (u.estado || 'ACTIVO') === 'ACTIVO';

                  return (
                    <tr
                      key={u.id || u.cedula}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* IDENTIFICACIÓN Y CIUDADANO */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sky-300 text-xs">
                              {u.cedula}
                            </span>
                            {u.verificadoHacienda && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                                title="Identidad certificada oficialmente ante el Ministerio de Hacienda (ATV)"
                              >
                                <CheckCircleIcon width={12} height={12} />
                                <span>ATV Verificado</span>
                              </span>
                            )}
                          </div>
                          <div className="text-white font-semibold text-sm">
                            {u.nombre}
                          </div>
                        </div>
                      </td>

                      {/* CORREO ELECTRÓNICO */}
                      <td className="py-3.5 px-4 font-sans text-slate-300">
                        {u.correo || u.email || 'Sin correo registrado'}
                      </td>

                      {/* ROL Y JERARQUÍA */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow-sm tracking-wide">
                          <span className={`w-1.5 h-1.5 rounded-full ${rolInfo.dotClass}`} />
                          <span className={rolInfo.badgeClass.split(' ')[2] || 'text-slate-200'}>
                            {rolInfo.nombre}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 pl-0.5">
                            · Nivel {rolInfo.nivel}
                          </span>
                        </div>
                      </td>

                      {/* JURISDICCIÓN */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>
                          <span className="font-medium text-white">{u.canton || 'Central'}</span>
                          <span className="text-slate-400 text-[11px] block">
                            {u.provincia || 'Nacional'}
                          </span>
                        </div>
                      </td>

                      {/* ESTADO */}
                      <td className="py-3.5 px-4">
                        {estaActivo ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>ACTIVO</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            <span>SUSPENDIDO</span>
                          </span>
                        )}
                      </td>

                      {/* ACCIONES */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Editar */}
                          <button
                            type="button"
                            onClick={() => iniciarEdicion(u)}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-white/10 hover:border-sky-500/30 transition-colors"
                            title="Editar Expediente Oficial"
                            aria-label={`Editar expediente de ${u.nombre}`}
                          >
                            <PenEditIcon width={16} height={16} />
                          </button>

                          {/* Botón Suspender / Reactivar */}
                          <button
                            type="button"
                            onClick={() => toggleSuspension(u)}
                            className={`p-2 rounded-xl border transition-colors ${
                              estaActivo
                                ? 'bg-white/[0.04] hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border-white/10 hover:border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border-emerald-500/30'
                            }`}
                            title={estaActivo ? 'Suspender Acceso Cívico' : 'Reactivar Acceso Cívico'}
                            aria-label={estaActivo ? 'Suspender acceso' : 'Reactivar acceso'}
                          >
                            <LockSecurityIcon width={16} height={16} locked={estaActivo} />
                          </button>

                          {/* Botón Eliminar */}
                          <button
                            type="button"
                            onClick={() => iniciarBajaDefinitiva(u)}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors"
                            title="Baja Definitiva de Expediente"
                            aria-label={`Baja definitiva de expediente ${u.nombre}`}
                          >
                            <TrashBinIcon width={16} height={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================
          4. MODAL A: EDICIÓN DE USUARIO
          ==================================================================== */}
      {usuarioAEditar && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[24px] flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-lg w-full rounded-3xl bg-[#050C1C] border border-white/15 p-6 space-y-5 shadow-2xl text-slate-100 relative">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <PenEditIcon width={18} height={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Actualización de Expediente Cívico
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modificación de rol jerárquico, jurisdicción territorial y seguridad.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUsuarioAEditar(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Cerrar modal"
              >
                <XCloseIcon width={16} height={16} />
              </button>
            </div>

            {/* Identificación del Ciudadano (Solo Lectura) */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Expediente Oficial:</span>
                <span className="font-mono text-sky-300 font-bold">{usuarioAEditar.cedula}</span>
              </div>
              <div className="text-sm font-bold text-white">{usuarioAEditar.nombre}</div>
              <div className="text-xs text-slate-400">{usuarioAEditar.correo || usuarioAEditar.email}</div>
            </div>

            {/* Formulario de Modificación */}
            <form onSubmit={guardarCambiosEdicion} className="space-y-4 text-xs">
              {/* Selector de Rol Jerárquico */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">
                  Rol Institucional y Jerarquía RBAC:
                </label>
                <select
                  value={formularioEdicion.rol}
                  onChange={(e) => {
                    const nuevoRol = e.target.value;
                    setFormularioEdicion((prev) => ({
                      ...prev,
                      rol: nuevoRol,
                      // Si no es gestor, restablecer provincia por defecto
                      provincia: nuevoRol === 'GESTOR_TERRITORIAL' ? prev.provincia : 'San José',
                      canton: nuevoRol === 'GESTOR_TERRITORIAL' ? prev.canton : 'San José'
                    }));
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-200 focus:border-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="CIUDADANO">Ciudadano Residente (Nivel 2)</option>
                  <option value="GESTOR_TERRITORIAL">
                    Gestor Territorial y Municipal (Nivel 4)
                  </option>
                  <option value="SUPER_ADMIN_NACIONAL">
                    Super Administrador Nacional (Nivel 5)
                  </option>
                </select>
              </div>

              {/* Selector Condicional para Gestor Territorial: Provincia y Cantón */}
              {formularioEdicion.rol === 'GESTOR_TERRITORIAL' && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <ShieldStarIcon width={14} height={14} />
                    <span>Asignación de Jurisdicción Territorial Oficial</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Provincia */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-semibold block">
                        Provincia Asignada:
                      </label>
                      <select
                        value={formularioEdicion.provincia}
                        onChange={(e) => {
                          const nuevaProv = e.target.value;
                          const cantones = CANTONES_POR_PROVINCIA[nuevaProv] || [];
                          setFormularioEdicion((prev) => ({
                            ...prev,
                            provincia: nuevaProv,
                            canton: cantones[0] || ''
                          }));
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        {PROVINCIAS_OFICIALES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cantón */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-semibold block">
                        Cantón Asignado:
                      </label>
                      <select
                        value={formularioEdicion.canton}
                        onChange={(e) =>
                          setFormularioEdicion((prev) => ({ ...prev, canton: e.target.value }))
                        }
                        className="w-full py-2 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        {(CANTONES_POR_PROVINCIA[formularioEdicion.provincia] || []).map((can) => (
                          <option key={can} value={can}>
                            {can}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Opciones de Seguridad y Hacienda */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                  <input
                    type="checkbox"
                    checked={formularioEdicion.forzarCambioPassword}
                    onChange={(e) =>
                      setFormularioEdicion((prev) => ({
                        ...prev,
                        forzarCambioPassword: e.target.checked
                      }))
                    }
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-sky-500 focus:ring-sky-500/40 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    Forzar cambio de contraseña en el próximo inicio de sesión
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                  <input
                    type="checkbox"
                    checked={formularioEdicion.verificadoHacienda}
                    onChange={(e) =>
                      setFormularioEdicion((prev) => ({
                        ...prev,
                        verificadoHacienda: e.target.checked
                      }))
                    }
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-emerald-500/40 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    Certificación de cotejo tributario ante Ministerio de Hacienda (ATV)
                  </span>
                </label>
              </div>

              {/* Botonera de Acción */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={isSavingEdicion}
                  onClick={() => setUsuarioAEditar(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar Operación
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdicion}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSavingEdicion ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                      </svg>
                      <span>Guardando en db.json...</span>
                    </>
                  ) : (
                    <>
                      <DiskSaveIcon width={16} height={16} />
                      <span>Guardar Cambios Oficiales</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          5. MODAL B: ELIMINACIÓN DEFINITIVA (NIVEL 3 SOVEREIGN CIVIC GLASS)
          ==================================================================== */}
      {usuarioAEliminar && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-[32px] flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-md w-full rounded-3xl bg-[#050C1C] border-2 border-rose-500/50 p-6 space-y-5 shadow-[0_0_50px_rgba(225,29,72,0.25)] text-slate-100 relative">
            {/* Cabecera Crítica */}
            <div className="flex items-start gap-3 border-b border-rose-500/20 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <OctagonAlertIcon width={22} height={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirmación de Baja Definitiva de Expediente
                </h3>
                <p className="text-[11px] text-rose-300/80 font-mono mt-0.5">
                  OPERACIÓN CRÍTICA DE AUTORIDAD · LEY N° 8292
                </p>
              </div>
            </div>

            {/* Ficha del Expediente Afectado */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cédula Oficial:</span>
                <span className="font-mono font-bold text-sky-300">{usuarioAEliminar.cedula}</span>
              </div>
              <div className="text-sm font-bold text-white">{usuarioAEliminar.nombre}</div>
              <div className="text-slate-400">{usuarioAEliminar.correo || usuarioAEliminar.email}</div>
              <div className="text-[11px] text-amber-300 font-mono pt-1">
                Rol actual: {normalizarRolInfo(usuarioAEliminar.rol).nombre}
              </div>
            </div>

            {/* Advertencia Legal Inmutable */}
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-rose-300">
                Esta acción revocará de manera permanente el acceso cívico y eliminará el registro del
                usuario bajo el marco de la Ley N° 8292.
              </p>
              <p className="text-[11px] text-rose-200/80">
                La revocación inmutable no podrá ser revertida. Los registros previos de auditoría
                preservarán la trazabilidad histórica de los actos de autoridad ejecutados por este usuario.
              </p>
            </div>

            {/* Checkbox de Doble Verificación Obligatoria */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:bg-white/[0.04] transition-colors">
              <input
                type="checkbox"
                checked={confirmacionBaja}
                onChange={(e) => setConfirmacionBaja(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-rose-500/40 bg-black/60 text-rose-500 focus:ring-rose-500/40 cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium">
                Entiendo las implicaciones legales y confirmo la revocación inmutable de esta identidad digital.
              </span>
            </label>

            {/* Botones de Confirmación Crítica */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setUsuarioAEliminar(null);
                  setConfirmacionBaja(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Cancelar Operación
              </button>
              <button
                type="button"
                disabled={!confirmacionBaja}
                onClick={ejecutarBajaDefinitiva}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
                  confirmacionBaja
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 cursor-pointer active:scale-[0.98]'
                    : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                <TrashBinIcon width={16} height={16} />
                <span>Confirmar Eliminación Definitiva</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ====================================================================
          MODAL C: REGISTRO Y ALTA DE CUENTA EN PADRÓN SOBERANO (NIVEL 3 SOVEREIGN CIVIC GLASS)
          ==================================================================== */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-[32px] flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-2xl w-full rounded-3xl bg-[#050C1C]/95 border border-white/[0.12] p-6 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(30,136,229,0.25)] text-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
            {/* Encabezado del Modal */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                  <UserPlusIcon width={20} height={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Registro y Alta de Cuenta en Padrón Soberano
                  </h3>
                  <p className="text-[11px] font-mono text-sky-400 font-medium mt-0.5">
                    NIVEL 5 AUTORIZADO • LEY N° 8292 & LEY N° 8968
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetFormularioCrear();
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <XCloseIcon width={16} height={16} />
              </button>
            </div>

            {/* Formulario de Creación */}
            <form onSubmit={handleCrearUsuario} className="space-y-4 text-xs">
              {/* Sección A: Identificación y Consulta a Hacienda */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                <label className="font-bold text-slate-300 block">
                  Cédula de Identidad Costarricense:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={formularioCrear.cedula}
                    onChange={(e) => {
                      setFormularioCrear((prev) => ({
                        ...prev,
                        cedula: e.target.value
                      }));
                      setHaciendaMensaje(null);
                      setHaciendaError(null);
                    }}
                    placeholder="Ej: 1-1823-0456 o 118230456"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleValidarHacienda}
                    disabled={validandoHacienda}
                    className="px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 active:scale-[0.98] border border-sky-400/40 text-sky-300 font-bold inline-flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <SearchLensIcon width={14} height={14} />
                    <span>{validandoHacienda ? 'Consultando...' : 'Validar Hacienda'}</span>
                  </button>
                </div>

                {/* Mensajes de Validación ante Hacienda */}
                {haciendaMensaje && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2 animate-fadeIn">
                    <CheckCircleIcon width={14} height={14} className="shrink-0 text-emerald-400" />
                    <span>{haciendaMensaje}</span>
                  </div>
                )}
                {haciendaError && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2 animate-fadeIn">
                    <AlertTriangleIcon width={14} height={14} className="shrink-0 text-amber-400" />
                    <span>{haciendaError}</span>
                  </div>
                )}
              </div>

              {/* Sección B: Datos Personales */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">
                    Nombre(s) de Pila:
                  </label>
                  <input
                    type="text"
                    required
                    value={formularioCrear.nombres}
                    onChange={(e) =>
                      setFormularioCrear((prev) => ({ ...prev, nombres: e.target.value }))
                    }
                    placeholder="Ej: Juan Carlos"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 block">
                      Primer Apellido:
                    </label>
                    <input
                      type="text"
                      value={formularioCrear.primerApellido}
                      onChange={(e) =>
                        setFormularioCrear((prev) => ({
                          ...prev,
                          primerApellido: e.target.value
                        }))
                      }
                      placeholder="Ej: Rodríguez"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 block">
                      Segundo Apellido:
                    </label>
                    <input
                      type="text"
                      value={formularioCrear.segundoApellido}
                      onChange={(e) =>
                        setFormularioCrear((prev) => ({
                          ...prev,
                          segundoApellido: e.target.value
                        }))
                      }
                      placeholder="Ej: Vargas"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 block">
                      Correo Electrónico Institucional o Ciudadano:
                    </label>
                    <input
                      type="email"
                      required
                      value={formularioCrear.correo}
                      onChange={(e) =>
                        setFormularioCrear((prev) => ({ ...prev, correo: e.target.value }))
                      }
                      placeholder="usuario@gob.cr o ciudadano@dominio.cr"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 block">
                      Contraseña Inicial de Acceso:
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarPassword ? 'text' : 'password'}
                        required
                        value={formularioCrear.password}
                        onChange={(e) =>
                          setFormularioCrear((prev) => ({ ...prev, password: e.target.value }))
                        }
                        placeholder="Mínimo 8 caracteres"
                        className="w-full py-2.5 pl-3 pr-10 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                        title={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {mostrarPassword ? (
                          <EyeOffIcon width={16} height={16} />
                        ) : (
                          <EyeIcon width={16} height={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección C: Nivel Jerárquico y Rol (RBAC) */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">
                  Nivel Jerárquico y Rol (RBAC):
                </label>
                <select
                  value={formularioCrear.nuevoRol}
                  onChange={(e) => {
                    const r = e.target.value;
                    setFormularioCrear((prev) => ({
                      ...prev,
                      nuevoRol: r,
                      nuevaProvincia: r === 'SUPER_ADMIN_NACIONAL' ? 'Nacional' : 'San José',
                      nuevoCanton:
                        r === 'SUPER_ADMIN_NACIONAL'
                          ? 'Todas las Municipalidades'
                          : CANTONES_POR_PROVINCIA['San José'][0]
                    }));
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-slate-200 focus:border-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="CIUDADANO">Ciudadano Residente (Nivel de Acceso: 2)</option>
                  <option value="GESTOR_TERRITORIAL">
                    Gestor Territorial y Municipal (Nivel de Acceso: 4)
                  </option>
                  <option value="SUPER_ADMIN_NACIONAL">
                    Super Administrador Nacional (Nivel de Acceso: 5)
                  </option>
                </select>
              </div>

              {/* Sección D: Jurisdicción Territorial (Condicional) */}
              {formularioCrear.nuevoRol === 'SUPER_ADMIN_NACIONAL' ? (
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Provincia:</span>
                    <span className="font-bold text-sky-300">Nacional (Jurisdicción Soberana)</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Cantón:</span>
                    <span className="font-bold text-sky-300">Todas las Municipalidades</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="font-bold text-sky-300 text-xs flex items-center gap-1.5">
                    <ShieldStarIcon width={14} height={14} />
                    <span>Jurisdicción Territorial Asignada</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-semibold block">
                        Provincia:
                      </label>
                      <select
                        value={formularioCrear.nuevaProvincia}
                        onChange={(e) => {
                          const prov = e.target.value;
                          const cantones = CANTONES_POR_PROVINCIA[prov] || [];
                          setFormularioCrear((prev) => ({
                            ...prev,
                            nuevaProvincia: prov,
                            nuevoCanton: cantones[0] || 'San José'
                          }));
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                      >
                        {PROVINCIAS_OFICIALES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-semibold block">
                        Cantón:
                      </label>
                      <select
                        value={formularioCrear.nuevoCanton}
                        onChange={(e) =>
                          setFormularioCrear((prev) => ({ ...prev, nuevoCanton: e.target.value }))
                        }
                        className="w-full py-2 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                      >
                        {(CANTONES_POR_PROVINCIA[formularioCrear.nuevaProvincia] || []).map((can) => (
                          <option key={can} value={can}>
                            {can}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección E: Estado Inicial y Hacienda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">
                    Estado Inicial de la Cuenta:
                  </label>
                  <select
                    value={formularioCrear.nuevoEstado}
                    onChange={(e) =>
                      setFormularioCrear((prev) => ({ ...prev, nuevoEstado: e.target.value }))
                    }
                    className="w-full py-2 px-3 rounded-xl bg-[#09152C] border border-white/10 text-xs text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                  >
                    <option value="ACTIVO">ACTIVO (Plenos Derechos Cívicos)</option>
                    <option value="SUSPENDIDO">SUSPENDIDO (Bloqueo Preventivo)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formularioCrear.isHaciendaVerified}
                      onChange={(e) =>
                        setFormularioCrear((prev) => ({
                          ...prev,
                          isHaciendaVerified: e.target.checked
                        }))
                      }
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-sky-500 focus:ring-sky-500/40 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-medium">
                      Verificado ante Hacienda (Ley N° 8968)
                    </span>
                  </label>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetFormularioCrear();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Cancelar Operación
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCrear}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 cursor-pointer"
                >
                  <UserPlusIcon width={16} height={16} />
                  <span>
                    {isSubmittingCrear
                      ? 'Registrando en db.json...'
                      : 'Guardar y Registrar Usuario'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
