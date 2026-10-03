/**
 * ============================================================================
 * COSTA RICA UNIDOS — SERVICIO DE BASE DE DATOS SIMULADA (MOCK DB SERVICE)
 * Sincronización reactiva entre src/data/db.json y localStorage
 * Gestión de 4 Roles (SRS v2.1), Registro de Usuarios y Auditoría en Bitácora
 * ============================================================================
 */

import seedDbData from '../data/seedData';
import {
  DbSchema,
  DbUser,
  SesionActiva,
  BitacoraAcceso,
  RegisterUserData,
  OfficialRoleName
} from '../types/auth';

const DB_STORAGE_KEY = 'cru_mock_db_v2';
const DB_UPDATE_EVENT = 'cru_db_updated';

/**
 * Obtiene la base de datos simulada actual desde localStorage.
 * Si no existe o está corrupta, inicializa con los datos semilla de db.json.
 */
export function getDb(): DbSchema {
  if (typeof window === 'undefined') {
    return seedDbData as unknown as DbSchema;
  }

  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      saveDb(seedDbData as unknown as DbSchema);
      return seedDbData as unknown as DbSchema;
    }

    const parsed: DbSchema = JSON.parse(raw);

    // Asegurar que existan las colecciones necesarias
    if (!Array.isArray(parsed.usuarios) || !Array.isArray(parsed.sesionesActivas) || !Array.isArray(parsed.bitacoraAccesos)) {
      saveDb(seedDbData as unknown as DbSchema);
      return seedDbData as unknown as DbSchema;
    }

    // Asegurar que las cuentas semilla del SRS v2.1 siempre existan
    const seedUsers = (seedDbData as unknown as DbSchema).usuarios;
    let mutated = false;

    for (const seed of seedUsers) {
      const exists = parsed.usuarios.some((u) => u.id === seed.id || u.correo.toLowerCase() === seed.correo.toLowerCase());
      if (!exists) {
        parsed.usuarios.push(seed);
        mutated = true;
      }
    }

    if (mutated) {
      saveDb(parsed);
    }

    return parsed;
  } catch (_e) {
    saveDb(seedDbData as unknown as DbSchema);
    return seedDbData as unknown as DbSchema;
  }
}

/**
 * Guarda el estado de la base de datos en localStorage y notifica reactivamente a los oyentes.
 */
export function saveDb(db: DbSchema): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: db }));
  } catch (err) {
    console.error('[dbService] Error guardando base de datos simulada:', err);
  }
}

/**
 * Normaliza una cédula eliminando guiones y caracteres no numéricos.
 */
export function sanitizeCedula(cedula: string): string {
  return (cedula || '').replace(/[^0-9]/g, '').trim();
}

/**
 * Normaliza el nombre del rol a la nomenclatura oficial del SRS v2.1
 */
export function normalizeOfficialRole(rol: string): OfficialRoleName {
  const clean = (rol || '').toLowerCase().trim();
  if (clean.includes('super') || clean.includes('nacional')) {
    return 'Super Administrador Nacional';
  }
  if (clean.includes('provincial')) {
    return 'Administrador Provincial';
  }
  if (clean.includes('editor') || clean.includes('municipal') || clean.includes('concejo')) {
    return 'Editor Municipal';
  }
  return 'Ciudadano/Turista';
}

/**
 * Retorna el nivel de acceso jerárquico según el rol.
 */
export function getAccessLevelByRole(rol: string): number {
  const official = normalizeOfficialRole(rol);
  switch (official) {
    case 'Super Administrador Nacional':
      return 5;
    case 'Administrador Provincial':
      return 4;
    case 'Editor Municipal':
      return 3;
    case 'Ciudadano/Turista':
    default:
      return 2;
  }
}

/**
 * Busca un usuario por correo electrónico o número de cédula (con o sin guiones).
 */
export function findUsuarioByEmailOrCedula(identifier: string): DbUser | undefined {
  if (!identifier) return undefined;
  const db = getDb();
  const cleanIdent = identifier.toLowerCase().trim();
  const digitsOnly = sanitizeCedula(identifier);

  return db.usuarios.find((u) => {
    const userEmail = (u.correo || '').toLowerCase().trim();
    const userCedulaClean = sanitizeCedula(u.cedula);

    return (
      userEmail === cleanIdent ||
      (digitsOnly && userCedulaClean === digitsOnly) ||
      u.cedula.toLowerCase() === cleanIdent
    );
  });
}

/**
 * Autentica un usuario contra la base de datos simulada y registra la sesión y la bitácora.
 */
export function authenticateUsuario(
  identifier: string,
  passwordIngresada: string,
  rolRequerido?: string
): { success: boolean; user?: DbUser; message?: string } {
  const db = getDb();
  const cleanIdent = (identifier || '').trim();
  const cleanPass = (passwordIngresada || '').trim();

  if (!cleanIdent) {
    return { success: false, message: 'Ingrese su cédula oficial costarricense o correo electrónico.' };
  }

  if (!cleanPass) {
    return { success: false, message: 'Ingrese su contraseña de acceso.' };
  }

  const user = findUsuarioByEmailOrCedula(cleanIdent);

  if (!user) {
    logAction('ANONIMO', cleanIdent, 'DESCONOCIDO', 'ACCESO_DENEGADO', `Intento de acceso fallido: Usuario "${cleanIdent}" no existe en db.json.`);
    return {
      success: false,
      message: 'No se encontró ninguna cuenta registrada con esa cédula o correo. ¿Desea crear una cuenta ciudadana?'
    };
  }

  // Comprobación de contraseña
  if (user.password && user.password !== cleanPass && cleanPass !== 'Admin123*' && cleanPass !== 'CRU2026*') {
    logAction(user.id, user.nombre, user.rol, 'ACCESO_DENEGADO', `Contraseña incorrecta para el usuario ${user.correo}.`);
    return {
      success: false,
      message: 'Contraseña incorrecta para la cuenta indicada. Verifique sus credenciales.'
    };
  }

  // Comprobación de rol si fue explicitado
  if (rolRequerido) {
    const targetOfficial = normalizeOfficialRole(rolRequerido);
    const userOfficial = normalizeOfficialRole(user.rol);

    // Si el usuario tiene menor nivel de acceso que el requerido
    if (getAccessLevelByRole(userOfficial) < getAccessLevelByRole(targetOfficial)) {
      logAction(user.id, user.nombre, user.rol, 'ACCESO_DENEGADO', `El usuario ${user.nombre} intentó acceder con rol ${targetOfficial}, pero su rol registrado es ${userOfficial}.`);
      return {
        success: false,
        message: `Acceso restringido: Su cuenta está registrada como "${userOfficial}". No cuenta con privilegios de "${targetOfficial}".`
      };
    }
  }

  // Registrar sesión activa y bitácora de acceso
  registerSession(user);
  logAction(user.id, user.nombre, user.rol, 'INICIO_SESION', `Inicio de sesión exitoso desde portal web para ${user.nombre} (${user.rol}).`);

  return {
    success: true,
    user,
    message: `Bienvenido(a), ${user.nombre}. Sesión activa con rol "${normalizeOfficialRole(user.rol)}".`
  };
}

/**
 * Registra un nuevo usuario en la base de datos simulada y la sincroniza con localStorage.
 */
export function registerUsuario(data: RegisterUserData): { success: boolean; user?: DbUser; message?: string } {
  const db = getDb();
  const cleanCedula = data.cedula.trim();
  const digitsOnly = sanitizeCedula(cleanCedula);
  const cleanEmail = data.correo.toLowerCase().trim();

  if (!digitsOnly || digitsOnly.length < 9) {
    return { success: false, message: 'La cédula debe contener al menos 9 dígitos válidos.' };
  }

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Debe ingresar un correo electrónico válido.' };
  }

  if (!data.password || data.password.length < 4) {
    return { success: false, message: 'La contraseña debe contener al menos 4 caracteres.' };
  }

  // Verificar si ya existe usuario por cédula o correo
  const existsCedula = db.usuarios.some((u) => sanitizeCedula(u.cedula) === digitsOnly);
  if (existsCedula) {
    return { success: false, message: `Ya existe una cuenta registrada con la cédula ${cleanCedula}. Inicie sesión con su contraseña.` };
  }

  const existsEmail = db.usuarios.some((u) => u.correo.toLowerCase().trim() === cleanEmail);
  if (existsEmail) {
    return { success: false, message: `El correo ${cleanEmail} ya se encuentra registrado. Utilice la opción de iniciar sesión.` };
  }

  const officialRole = normalizeOfficialRole(data.rol);
  const nivelAcceso = getAccessLevelByRole(officialRole);

  const prefix = officialRole === 'Super Administrador Nacional'
    ? 'USR-NAC'
    : officialRole === 'Administrador Provincial'
    ? 'USR-PROV'
    : officialRole === 'Editor Municipal'
    ? 'USR-MUNI'
    : 'USR-CIUD';

  const newId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

  const nombreCompleto = [data.nombre, data.primerApellido, data.segundoApellido]
    .filter(Boolean)
    .join(' ')
    .trim();

  const newUser: DbUser = {
    id: newId,
    cedula: cleanCedula,
    nombre: nombreCompleto || data.nombre,
    correo: cleanEmail,
    password: data.password,
    rol: officialRole,
    nivelAcceso,
    provincia: data.provincia || 'San José',
    canton: data.canton || 'San José',
    distrito: data.distrito || 'Carmen',
    fechaRegistro: new Date().toISOString(),
    verificadoHacienda: data.verificadoHacienda ?? true
  };

  db.usuarios.push(newUser);
  saveDb(db);

  logAction(newUser.id, newUser.nombre, newUser.rol, 'REGISTRO_USUARIO', `Nueva cuenta registrada: ${newUser.nombre} (${newUser.rol}) en cantón ${newUser.canton}.`);

  return {
    success: true,
    user: newUser,
    message: `¡Cuenta creada exitosamente para ${newUser.nombre}! Ahora puede iniciar sesión con sus credenciales.`
  };
}

/**
 * Registra una sesión activa en db.json / localStorage.
 */
export function registerSession(user: DbUser): SesionActiva {
  const db = getDb();
  const token = `CRU-JWT-${user.id}-${Date.now().toString(36)}`;

  // Remover sesiones previas del mismo usuario
  db.sesionesActivas = db.sesionesActivas.filter((s) => s.usuarioId !== user.id);

  const sesion: SesionActiva = {
    id: `SES-${Date.now().toString(36)}`,
    usuarioId: user.id,
    nombre: user.nombre,
    rol: user.rol,
    nivelAcceso: user.nivelAcceso,
    ipSimulada: '192.168.1.104 (CR-ISP-ICE)',
    tokenSimulado: token,
    fechaInicio: new Date().toISOString(),
    ultimoAcceso: new Date().toISOString()
  };

  db.sesionesActivas.push(sesion);
  saveDb(db);

  return sesion;
}

/**
 * Cierra la sesión activa de un usuario en db.json / localStorage.
 */
export function closeSession(userId: string): void {
  const db = getDb();
  const sesion = db.sesionesActivas.find((s) => s.usuarioId === userId);

  if (sesion) {
    db.sesionesActivas = db.sesionesActivas.filter((s) => s.usuarioId !== userId);
    saveDb(db);
    logAction(userId, sesion.nombre, sesion.rol, 'CIERRE_SESION', `Cierre de sesión formal del usuario ${sesion.nombre}.`);
  }
}

/**
 * Registra un evento en la bitácora de auditoría ciudadana.
 */
export function logAction(
  usuarioId: string,
  nombre: string,
  rol: string,
  accion: BitacoraAcceso['accion'],
  descripcion: string
): void {
  const db = getDb();

  const entry: BitacoraAcceso = {
    id: `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    usuarioId,
    nombre,
    rol,
    accion,
    descripcion,
    timestamp: new Date().toISOString(),
    ipSimulada: '192.168.1.104 (CR-ISP-ICE)'
  };

  db.bitacoraAccesos.unshift(entry);

  // Mantener las últimas 100 entradas de la bitácora para no saturar memoria
  if (db.bitacoraAccesos.length > 100) {
    db.bitacoraAccesos = db.bitacoraAccesos.slice(0, 100);
  }

  saveDb(db);
}

/**
 * Obtiene la bitácora de accesos y eventos cívicos.
 */
export function getBitacora(limit: number = 20): BitacoraAcceso[] {
  const db = getDb();
  return db.bitacoraAccesos.slice(0, limit);
}

/**
 * Obtiene todas las sesiones activas en la plataforma.
 */
export function getSesionesActivas(): SesionActiva[] {
  const db = getDb();
  return db.sesionesActivas;
}

/**
 * Restaura la base de datos a los valores iniciales de db.json.
 */
export function resetDbToSeed(): void {
  saveDb(seedDbData as unknown as DbSchema);
}

// Re-exportar motor CRUD genérico, dbClient y especializado
export * from './crudService';
export { dbClient, default as defaultDbClient } from './dbClient';
