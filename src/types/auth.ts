/**
 * ============================================================================
 * COSTA RICA UNIDOS — TIPOS DE AUTENTICACIÓN Y ROLES (SRS v2.1)
 * 4 Roles Oficiales, Base de Datos Simulada (db.json) y Control de Acceso RBAC
 * ============================================================================
 */

export type OfficialRoleName =
  | 'Super Administrador Nacional'
  | 'Administrador Provincial'
  | 'Editor Municipal'
  | 'Ciudadano/Turista';

export type UserRole =
  | OfficialRoleName
  | 'SUPER_ADMIN_NACIONAL'
  | 'ADMIN_PROVINCIAL'
  | 'EDITOR_MUNICIPAL'
  | 'CIUDADANO_TURISTA';

export type CitizenMode = 'CIUDADANO' | 'TURISTA';

export type IdentityStatus = 'VERIFICADO_HACIENDA' | 'PENDIENTE_VERIFICACION';

export interface MunicipalityProfile {
  id: string;
  codigoCantonal: string;
  nombre: string;
  provincia: string;
  codigoInstitucional: string; // Ej: "MSJ-2026", "MAL-2026"
  logoUrl?: string;
  escudoUrl?: string;
  distritosCount?: number;
}

export interface DbUser {
  id: string;
  cedula: string;
  nombre: string;
  correo: string;
  password?: string;
  rol: OfficialRoleName | string;
  nivelAcceso: number; // 5 = Super Admin, 4 = Admin Prov, 3 = Editor Muni, 2 = Ciudadano/Turista
  provincia: string;
  canton: string;
  distrito?: string;
  fechaRegistro: string;
  verificadoHacienda: boolean;
}

export interface SesionActiva {
  id: string;
  usuarioId: string;
  nombre: string;
  rol: string;
  nivelAcceso: number;
  ipSimulada: string;
  tokenSimulado: string;
  fechaInicio: string;
  ultimoAcceso: string;
}

export interface BitacoraAcceso {
  id: string;
  usuarioId: string;
  nombre: string;
  rol: string;
  accion: 'INICIO_SESION' | 'CIERRE_SESION' | 'REGISTRO_USUARIO' | 'ACCESO_DENEGADO' | 'CONSULTA_HACIENDA';
  descripcion: string;
  timestamp: string;
  ipSimulada: string;
}

import type {
  SolicitudComercio,
  ItemModeracion,
  RegistroAuditoria,
  ConfiguracionIA,
  EstadoAlertaCNE,
  TicketAveriaMunicipal
} from './admin';

export interface DbSchema {
  usuarios: DbUser[];
  sesionesActivas: SesionActiva[];
  bitacoraAccesos: BitacoraAcceso[];
  solicitudesComercio?: SolicitudComercio[];
  moderacionContenido?: ItemModeracion[];
  bitacoraAuditoria?: RegistroAuditoria[];
  configuracionIA?: ConfiguracionIA;
  alertasCNE?: EstadoAlertaCNE;
  ticketsAverias?: TicketAveriaMunicipal[];
  incidenciasViales?: any[];
  alberguesCNE?: any[];
  proyectosPresupuesto?: any[];
  votosEmitidos?: any[];
}

export interface UserProfile {
  id: string;
  cedula: string;
  nombre: string;
  primerApellido?: string;
  segundoApellido?: string;
  nombreCompleto: string;
  email: string;
  role: UserRole;
  officialRoleName: OfficialRoleName;
  nivelAcceso: number;
  citizenMode?: CitizenMode; // Sólo aplica si role === 'Ciudadano/Turista' o 'CIUDADANO_TURISTA'
  identityStatus: IdentityStatus;
  isComerciante: boolean;
  provincia?: string;
  canton?: string;
  distrito?: string;
  assignedMunicipality?: MunicipalityProfile;
  fechaIngreso: string;
  token?: string;
}

export interface LoginCredentials {
  cedula?: string;
  email?: string;
  password: string;
  role?: UserRole;
  citizenMode?: CitizenMode;
  municipalityId?: string;
  municipalCode?: string;
  masterPassword?: string;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
}

export interface RegisterUserData {
  cedula: string;
  nombre: string;
  primerApellido?: string;
  segundoApellido?: string;
  correo: string;
  password: string;
  rol: OfficialRoleName;
  provincia: string;
  canton: string;
  distrito?: string;
  verificadoHacienda?: boolean;
}

export interface HaciendaParsedIdentity {
  success: boolean;
  nombreOficial: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  isFallback: boolean;
  identityStatus: IdentityStatus;
  tipo?: string;
  mensaje?: string;
}

export type Usuario = DbUser;

export interface CredencialesLogin {
  identificacion: string;
  password: string;
}

export interface RegistroUsuarioDTO {
  cedula: string;
  nombre: string;
  correo: string;
  password: string;
  rol?: OfficialRoleName | string;
  provincia: string;
  canton: string;
  distrito?: string;
}

export interface AuthContextType {
  usuarioActual: Usuario | null;
  estaAutenticado: boolean;
  cargando: boolean;
  login: (credenciales: CredencialesLogin | LoginCredentials) => Promise<{ success: boolean; mensaje?: string; message?: string }>;
  registro: (datos: RegistroUsuarioDTO | RegisterUserData) => Promise<{ success: boolean; mensaje?: string; message?: string }>;
  logout: () => void;
  seleccionarCuentaDemo: (idUsuario: string) => void;

  // Propiedades de retrocompatibilidad
  user: UserProfile | Usuario | null;
  role: UserRole | null;
  officialRoleName: OfficialRoleName | null;
  nivelAcceso: number;
  identityStatus: IdentityStatus | null;
  citizenMode: CitizenMode;
  assignedMunicipality: MunicipalityProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterUserData) => Promise<{ success: boolean; message?: string }>;
  hasRole: (allowedRoles: (UserRole | OfficialRoleName)[]) => boolean;
  hasMinAccessLevel: (minLevel: number) => boolean;
  switchCitizenMode: (mode: CitizenMode) => void;
  clearError: () => void;
}

