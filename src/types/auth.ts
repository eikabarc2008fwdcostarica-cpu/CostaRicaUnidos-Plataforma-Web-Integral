/**
 * ============================================================================
 * COSTA RICA UNIDOS — TIPOS DE AUTENTICACIÓN Y ROLES
 * Cobertura oficial de 3 Roles Exclusivos, Validación de Identidad y Perfiles
 * ============================================================================
 */

export type UserRole = 'CIUDADANO_TURISTA' | 'ADMIN_PROVINCIAL' | 'SUPER_ADMIN_NACIONAL';

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

export interface UserProfile {
  id: string;
  cedula: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombreCompleto: string;
  email: string;
  role: UserRole;
  citizenMode?: CitizenMode; // Sólo aplica si role === 'CIUDADANO_TURISTA'
  identityStatus: IdentityStatus;
  isComerciante: boolean; // Desacoplamiento: condición/perfil comercial sobre la persona física
  assignedMunicipality?: MunicipalityProfile; // Para ADMIN_PROVINCIAL
  fechaIngreso: string;
  token?: string;
}

export interface LoginCredentials {
  cedula: string;
  email: string;
  password: string;
  role: UserRole;
  citizenMode?: CitizenMode;
  // Campos específicos según rol
  municipalityId?: string;
  municipalCode?: string; // Para ADMIN_PROVINCIAL
  masterPassword?: string; // Para SUPER_ADMIN_NACIONAL
  // Nombres (autocompletados o ingresados en modo contingencia)
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
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

export interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  identityStatus: IdentityStatus | null;
  citizenMode: CitizenMode;
  assignedMunicipality: MunicipalityProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  switchCitizenMode: (mode: CitizenMode) => void;
  clearError: () => void;
}
