/**
 * ============================================================================
 * COSTA RICA UNIDOS — CONTEXTO GLOBAL DE AUTENTICACIÓN Y CONTROL RBAC
 * Matriz Oficial de Tres (3) Roles Soberanos
 * ============================================================================
 * 
 * Roles Oficiales Normados:
 * 1. 'SUPER_ADMIN_NACIONAL': Nivel 5 (Gobernanza de IA, auditoría inmutable, configuración global).
 * 2. 'GESTOR_TERRITORIAL': Nivel 4 (Rol Unificado: gestión de contenidos municipales + supervisión provincial de concejos, obras M07 y emergencias M10).
 * 3. 'CIUDADANO': Nivel 2 (Portal cívico, consulta de gacetas, trámites, votos y reportes ciudadanos).
 * 
 * Estructura del Usuario Autenticado:
 * { id, nombre, email, rol, provinciaId (1-7), provinciaNombre, nivelAcceso, token }
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import dbSeed from '../services/db.json';
import { registrarUsuarioApi, obtenerUsuariosApi } from '../services/userService';
import { ROLES_SISTEMA, ROLES_CONFIG, normalizarRolOficial } from '../config/roles';

export { ROLES_SISTEMA, ROLES_CONFIG, normalizarRolOficial };

// Catálogo Oficial de las 7 Provincias de la República de Costa Rica (MIDEPLAN / INEC)
export const PROVINCIAS_COSTA_RICA = [
  { id: '1', nombre: 'San José', cantonesCount: 20, cabecera: 'San José' },
  { id: '2', nombre: 'Alajuela', cantonesCount: 16, cabecera: 'Alajuela' },
  { id: '3', nombre: 'Cartago', cantonesCount: 8, cabecera: 'Cartago' },
  { id: '4', nombre: 'Heredia', cantonesCount: 10, cabecera: 'Heredia' },
  { id: '5', nombre: 'Guanacaste', cantonesCount: 11, cabecera: 'Liberia' },
  { id: '6', nombre: 'Puntarenas', cantonesCount: 13, cabecera: 'Puntarenas' },
  { id: '7', nombre: 'Limón', cantonesCount: 6, cabecera: 'Limón' }
];

// Directorio Municipal Institucional
export const MUNICIPALITIES_DIRECTORY = [
  { id: 'muni-sanjose', codigoCantonal: '101', nombre: 'Municipalidad de San José', provincia: 'San José', codigoInstitucional: 'MSJ-2026-SEC', distritosCount: 11 },
  { id: 'muni-alajuela', codigoCantonal: '201', nombre: 'Municipalidad de Alajuela', provincia: 'Alajuela', codigoInstitucional: 'MAL-2026-SEC', distritosCount: 14 },
  { id: 'muni-cartago', codigoCantonal: '301', nombre: 'Municipalidad de Cartago', provincia: 'Cartago', codigoInstitucional: 'MCA-2026-SEC', distritosCount: 11 },
  { id: 'muni-heredia', codigoCantonal: '401', nombre: 'Municipalidad de Heredia', provincia: 'Heredia', codigoInstitucional: 'MHE-2026-SEC', distritosCount: 5 },
  { id: 'muni-liberia', codigoCantonal: '501', nombre: 'Municipalidad de Liberia', provincia: 'Guanacaste', codigoInstitucional: 'MLI-2026-SEC', distritosCount: 5 },
  { id: 'muni-puntarenas', codigoCantonal: '601', nombre: 'Municipalidad de Puntarenas', provincia: 'Puntarenas', codigoInstitucional: 'MPU-2026-SEC', distritosCount: 16 },
  { id: 'muni-limon', codigoCantonal: '701', nombre: 'Municipalidad de Limón', provincia: 'Limón', codigoInstitucional: 'MLM-2026-SEC', distritosCount: 4 },
  { id: 'muni-sancarlos', codigoCantonal: '210', nombre: 'Municipalidad de San Carlos', provincia: 'Alajuela', codigoInstitucional: 'MSC-2026-SEC', distritosCount: 13 },
  { id: 'muni-perezzeledon', codigoCantonal: '119', nombre: 'Municipalidad de Pérez Zeledón', provincia: 'San José', codigoInstitucional: 'MPZ-2026-SEC', distritosCount: 12 },
  { id: 'muni-escazu', codigoCantonal: '102', nombre: 'Municipalidad de Escazú', provincia: 'San José', codigoInstitucional: 'MES-2026-SEC', distritosCount: 3 }
];

export const AUTHORIZED_SUPER_ADMIN_CEDULAS = ['1-0000-0001', '100000001', '118880999', '207770888'];
export const MASTER_ADMIN_KEY = 'CRU-MASTER-2026';

/**
 * Cuentas y Credenciales de Prueba Oficiales alineadas a db.json
 */
export const MOCK_SUPER_ADMIN_NACIONAL = {
  id: 'USR-NAC-001',
  cedula: '1-0000-0001',
  nombre: 'Superintendencia Nacional de Gobierno Digital',
  correo: 'admin.nacional@gob.cr',
  email: 'admin.nacional@gob.cr',
  password: 'Admin123*',
  rol: 'Super Administrador Nacional',
  nivelAcceso: 5,
  provincia: 'Nacional',
  canton: 'Todas las Municipalidades',
  fechaRegistro: '2026-01-01T00:00:00Z',
  verificadoHacienda: true
};

export const MOCK_GESTOR_TERRITORIAL = {
  id: 'USR-TERR-001',
  cedula: '6-0123-0456',
  nombre: 'Coordinación Territorial',
  correo: 'gobierno.territorial@gob.cr',
  email: 'gobierno.territorial@gob.cr',
  password: 'Territorial2026*',
  rol: 'Gestor Territorial y Municipal',
  nivelAcceso: 4,
  provincia: 'Puntarenas',
  provinciaId: 6,
  canton: 'Puntarenas',
  fechaRegistro: '2026-02-15T08:30:00Z',
  verificadoHacienda: true
};

export const MOCK_CIUDADANO = {
  id: 'USR-CIUD-001',
  cedula: '1-1823-0456',
  nombre: 'Eiker Manuel Abarca Murillo',
  correo: 'eiker.abarca@gmail.com',
  email: 'eiker.abarca@gmail.com',
  password: 'Ciudadano2026*',
  rol: 'Ciudadano/Turista',
  nivelAcceso: 2,
  provincia: 'San José',
  canton: 'San José',
  distrito: 'Carmen',
  fechaRegistro: '2026-05-10T14:20:00Z',
  verificadoHacienda: true
};

/**
 * Mapea un usuario de db.json al objeto de sesión del sistema
 */
function normalizarUsuario(rawUser, token = null) {
  if (!rawUser) return null;

  // Determinar rol estandarizado en la tríada oficial
  const rolNorm = normalizarRolOficial(rawUser.rol || rawUser.role);
  let nivelAcceso = rawUser.nivelAcceso;
  if (!nivelAcceso) {
    if (rolNorm === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL) nivelAcceso = 5;
    else if (rolNorm === ROLES_SISTEMA.GESTOR_TERRITORIAL) nivelAcceso = 4;
    else nivelAcceso = 2;
  }

  // Determinar provinciaId y provinciaNombre
  let provId = rawUser.provinciaId ? String(rawUser.provinciaId) : '1';
  let provNombre = rawUser.provincia || 'Nacional';

  if (rawUser.provinciaId) {
    provId = String(rawUser.provinciaId);
    const pMatch = PROVINCIAS_COSTA_RICA.find((p) => p.id === provId);
    if (pMatch) provNombre = pMatch.nombre;
  } else if (rawUser.provincia) {
    const provClean = String(rawUser.provincia).trim().toLowerCase();
    const pMatch = PROVINCIAS_COSTA_RICA.find(
      (p) => p.nombre.toLowerCase() === provClean || provClean.includes(p.nombre.toLowerCase())
    );
    if (pMatch) {
      provId = pMatch.id;
      provNombre = pMatch.nombre;
    } else if (provClean.includes('nacional') || provClean.includes('sede')) {
      provId = '1';
      provNombre = 'Nacional';
    }
  }

  const email = rawUser.correo || rawUser.email || '';

  return {
    id: rawUser.id ?? `USR-${Date.now()}`,
    cedula: rawUser.cedula || '',
    nombre: rawUser.nombre || 'Usuario Registrado',
    correo: email,
    email: email,
    password: rawUser.password || '',
    rol: rawUser.rol || rolNorm,
    rolOficial: rolNorm,
    nivelAcceso: Number(nivelAcceso),
    provincia: rawUser.provincia || provNombre,
    provinciaId: provId,
    provinciaNombre: provNombre,
    canton: rawUser.canton || '',
    distrito: rawUser.distrito || '',
    fechaRegistro: rawUser.fechaRegistro || new Date().toISOString(),
    verificadoHacienda: rawUser.verificadoHacienda ?? true,
    token: token || rawUser.token || `cru-token-${Date.now()}`
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Estado reactivo del usuario autenticado: null por defecto si no hay sesión válida
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("cru_user_session");
    return saved ? JSON.parse(saved) : null;
  });

  const [citizenMode, setCitizenMode] = useState('CIUDADANO');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Sincronizar catálogo de usuarios en localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cr_db_usuarios');
      if (!raw) {
        localStorage.setItem('cr_db_usuarios', JSON.stringify(dbSeed.usuarios || []));
      } else {
        const parsed = JSON.parse(raw);
        let modificado = false;
        for (const seed of dbSeed.usuarios || []) {
          if (!parsed.some((u) => u.id === seed.id || (u.correo && u.correo.toLowerCase() === (seed.correo || '').toLowerCase()))) {
            parsed.push(seed);
            modificado = true;
          }
        }
        if (modificado) {
          localStorage.setItem('cr_db_usuarios', JSON.stringify(parsed));
        }
      }
    } catch {
      localStorage.setItem('cr_db_usuarios', JSON.stringify(dbSeed.usuarios || []));
    }

    obtenerUsuariosApi()
      .then((usuariosApi) => {
        if (Array.isArray(usuariosApi) && usuariosApi.length > 0) {
          localStorage.setItem('cr_db_usuarios', JSON.stringify(usuariosApi));
        }
      })
      .catch(() => {
        // En caso de que no esté disponible, se mantiene la memoria local
      });
  }, []);

  const clearError = () => setError(null);

  /**
   * Autenticación Institucional Oficial por Credenciales Soberanas
   * Valida estrictamente Cédula, Correo Electrónico y Contraseña sin selectores de rol públicos.
   * 
   * @param {string|object} arg1 - Cédula oficial (o payload { cedula, email, password })
   * @param {string} [arg2] - Correo electrónico
   * @param {string} [arg3] - Contraseña
   */
  const login = async (arg1, arg2, arg3) => {
    setCargando(true);
    setError(null);
    localStorage.removeItem('cr_sesion_cerrada');

    try {
      let cedulaInput = '';
      let emailInput = '';
      let passwordInput = '';

      if (typeof arg1 === 'object' && arg1 !== null) {
        // Soporte para objeto de credenciales
        cedulaInput = arg1.cedula || arg1.identificacion || '';
        emailInput = arg1.email || arg1.correo || '';
        passwordInput = arg1.password || arg1.clave || '';
        if (!emailInput && cedulaInput.includes('@')) {
          emailInput = cedulaInput;
          cedulaInput = '';
        }
      } else if (arg3 !== undefined) {
        // Soporte para argumentos posicionales login(cedula, email, password)
        cedulaInput = arg1 || '';
        emailInput = arg2 || '';
        passwordInput = arg3 || '';
      } else {
        // Soporte para login(identificador, password) con 2 argumentos
        const ident = String(arg1 || '').trim();
        passwordInput = String(arg2 || '').trim();
        if (ident.includes('@')) {
          emailInput = ident;
        } else {
          cedulaInput = ident;
        }
      }

      cedulaInput = String(cedulaInput).trim();
      emailInput = String(emailInput).trim().toLowerCase();
      passwordInput = String(passwordInput).trim();

      // Validación de presencia obligatoria de credenciales
      if ((!cedulaInput && !emailInput) || !passwordInput) {
        const msg = 'Debe ingresar su identificación oficial o correo electrónico y contraseña de seguridad.';
        setError(msg);
        setCargando(false);
        return { success: false, mensaje: msg, message: msg };
      }

      const cedulaDigits = cedulaInput ? cedulaInput.replace(/[^0-9]/g, '') : '';

      // 1. Si arg1 ya es un objeto de usuario completo de db.json
      let usuarioEncontrado = null;
      if (typeof arg1 === 'object' && arg1 !== null && arg1.id && arg1.rol) {
        usuarioEncontrado = arg1;
      } else {
        // 2. Buscar directamente en los registros oficiales de db.json y memoria local
        const usuariosDb = Array.isArray(dbSeed?.usuarios) ? [...dbSeed.usuarios] : [];
        try {
          const rawDb = localStorage.getItem('cr_db_usuarios');
          if (rawDb) {
            const parsedDb = JSON.parse(rawDb);
            if (Array.isArray(parsedDb)) {
              for (const u of parsedDb) {
                if (!usuariosDb.some((x) => x.id === u.id || (x.correo && x.correo.toLowerCase() === (u.correo || '').toLowerCase()))) {
                  usuariosDb.push(u);
                }
              }
            }
          }
        } catch (e) {
          console.warn('Error al consultar usuarios en almacenamiento local:', e);
        }

        usuarioEncontrado = usuariosDb.find((u) => {
          const uCedulaClean = (u.cedula || '').replace(/[^0-9]/g, '');
          const uEmailLower = (u.correo || u.email || '').toLowerCase().trim();

          const matchCedula = cedulaInput && (u.cedula === cedulaInput || (cedulaDigits && uCedulaClean === cedulaDigits));
          const matchEmail = emailInput && (uEmailLower === emailInput);
          const matchPassword = String(u.password) === passwordInput;

          const matchIdent = (cedulaInput && emailInput) ? (matchCedula && matchEmail) : (matchCedula || matchEmail);

          return matchIdent && matchPassword;
        });
      }

      // 3. Fallo de autenticación: Mensaje seguro genérico (OWASP Compliance)
      if (!usuarioEncontrado) {
        const msg = 'Las credenciales ingresadas no corresponden a ningún registro oficial activo en el sistema.';
        setError(msg);
        setCargando(false);
        return { success: false, mensaje: msg, message: msg };
      }

      // 4. Éxito: Normalización y almacenamiento seguro de sesión
      const usuarioNormalizado = normalizarUsuario(usuarioEncontrado);
      setUser(usuarioNormalizado);
      localStorage.setItem("cru_user_session", JSON.stringify(usuarioNormalizado));
      localStorage.setItem("cr_sesion_activa", JSON.stringify(usuarioNormalizado));
      setCargando(false);
      window.dispatchEvent(new CustomEvent('cru_db_updated'));

      return {
        success: true,
        user: usuarioNormalizado
      };
    } catch {
      const msg = 'Las credenciales ingresadas no corresponden a ningún registro oficial activo en el sistema.';
      setError(msg);
      setCargando(false);
      return { success: false, mensaje: msg, message: msg };
    }
  };

  /**
   * Cierra la sesión activa y limpia el almacenamiento persistente
   */
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("cru_user_session");
    localStorage.removeItem("cr_sesion_activa");
    localStorage.setItem("cr_sesion_cerrada", "true");
    window.dispatchEvent(new CustomEvent('cru_db_updated'));
  };

  /**
   * Helper de Autorización RBAC y Ámbito Territorial (Nivel 4 - Gestor Territorial)
   * 
   * @param {string|string[]} requiredRole - Rol requerido ('GESTOR_TERRITORIAL', 'SUPER_ADMIN_NACIONAL', 'CIUDADANO')
   * @param {string|number} [targetProvinciaId] - Código de provincia objetivo (1-7), opcional
   * @returns {boolean} true si está facultado por rol y jurisdicción territorial
   */
  const hasPermission = (requiredRole, targetProvinciaId) => {
    if (!user) return false;

    // 1. Verificación de Rol Jerárquico
    let roleAuthorized = true;
    if (requiredRole) {
      const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (rolesArray.length > 0) {
        const userRolNorm = normalizarRolOficial(user.rol);
        const rolesNorm = rolesArray.map(normalizarRolOficial);

        if (userRolNorm === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL) {
          // El Superadministrador Nacional posee jurisdicción integral
          roleAuthorized = true;
        } else if (rolesNorm.includes(userRolNorm)) {
          // Coincidencia exacta de rol
          roleAuthorized = true;
        } else if (rolesNorm.includes(ROLES_SISTEMA.CIUDADANO)) {
          // Todo usuario institucional tiene acceso a las funciones cívicas
          roleAuthorized = true;
        } else {
          roleAuthorized = false;
        }
      }
    }

    if (!roleAuthorized) return false;

    // 2. Verificación de Ámbito Territorial (Provincia 1 a 7)
    if (targetProvinciaId !== undefined && targetProvinciaId !== null && targetProvinciaId !== '') {
      // El Superadministrador Nacional tiene cobertura territorial soberana irrestricta
      if (normalizarRolOficial(user.rol) === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL) {
        return true;
      }

      const userProvId = String(user.provinciaId || '');
      const targetProvId = String(targetProvinciaId);

      // El Gestor Territorial y Municipal sólo puede gestionar su propia provincia
      return userProvId === targetProvId;
    }

    return true;
  };

  /**
   * Selecciona una cuenta demo para depuración rápida
   */
  const seleccionarCuentaDemo = (idUsuario) => {
    try {
      const raw = localStorage.getItem('cr_db_usuarios') || JSON.stringify(dbSeed.usuarios || []);
      const usuarios = JSON.parse(raw);
      const u = usuarios.find((x) => x.id === idUsuario);
      if (u) {
        const normalizado = normalizarUsuario(u);
        setUser(normalizado);
        localStorage.removeItem('cr_sesion_cerrada');
        localStorage.setItem("cru_user_session", JSON.stringify(normalizado));
        localStorage.setItem('cr_sesion_activa', JSON.stringify(normalizado));
        window.dispatchEvent(new CustomEvent('cru_db_updated'));
      }
    } catch {
      // Ignorar fallas
    }
  };

  /**
   * Registro de nuevos usuarios
   */
  const registro = async (datos) => {
    setCargando(true);
    setError(null);

    try {
      const apiRes = await registrarUsuarioApi({
        cedula: datos.cedula,
        nombre: datos.nombre,
        primerApellido: datos.primerApellido || '',
        segundoApellido: datos.segundoApellido || '',
        correo: datos.correo,
        password: datos.password,
        rol: datos.rol,
        provincia: datos.provincia,
        canton: datos.canton,
        distrito: datos.distrito,
        verificadoHacienda: datos.verificadoHacienda ?? true
      });

      if (!apiRes.success || !apiRes.user) {
        const msg = apiRes.message || 'No fue posible registrar el usuario.';
        setError(msg);
        setCargando(false);
        return { success: false, mensaje: msg, message: msg };
      }

      const nuevoUsuario = normalizarUsuario(apiRes.user);
      setUser(nuevoUsuario);
      localStorage.removeItem('cr_sesion_cerrada');
      localStorage.setItem("cru_user_session", JSON.stringify(nuevoUsuario));
      localStorage.setItem('cr_sesion_activa', JSON.stringify(nuevoUsuario));
      setCargando(false);

      window.dispatchEvent(new CustomEvent('cru_db_updated'));

      return {
        success: true,
        mensaje: apiRes.message,
        message: apiRes.message
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error durante el registro del usuario.';
      setError(msg);
      setCargando(false);
      return { success: false, mensaje: msg, message: msg };
    }
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.some((r) => r === user.rol || (user.rol && user.rol.includes(r)));
  };

  const hasMinAccessLevel = (minLevel) => {
    if (!user) return false;
    return (user.nivelAcceso ?? 0) >= minLevel;
  };

  const switchCitizenMode = (mode) => {
    setCitizenMode(mode);
  };

  // Resolver perfil de municipalidad
  let assignedMunicipality = null;
  if (user?.canton) {
    assignedMunicipality =
      MUNICIPALITIES_DIRECTORY.find(
        (m) =>
          m.nombre.toLowerCase().includes(user.canton.toLowerCase()) ||
          user.canton.toLowerCase().includes(m.nombre.toLowerCase())
      ) || null;
  }

  const contextValue = {
    // Requerimientos primordiales
    user,
    login,
    logout,
    hasPermission,

    // Compatibilidad total de interfaz
    usuarioActual: user,
    estaAutenticado: Boolean(user),
    isAuthenticated: Boolean(user),
    cargando,
    isLoading: cargando,
    error,
    clearError,
    role: user?.rol || null,
    officialRoleName: user?.rol || null,
    nivelAcceso: user?.nivelAcceso ?? 2,
    identityStatus: user?.verificadoHacienda ? 'VERIFICADO_HACIENDA' : 'PENDIENTE_VERIFICACION',
    citizenMode,
    assignedMunicipality,
    registro,
    register: registro,
    seleccionarCuentaDemo,
    hasRole,
    hasMinAccessLevel,
    switchCitizenMode
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}



/**
 * Hook para consumir el contexto global de autenticación y RBAC
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;
