/**
 * COSTA RICA UNIDOS — Bridge de Autenticación Cívica y Control RBAC (TypeScript)
 * Unifica el contexto con AuthContext.jsx para garantizar una única instancia de React Context.
 */
export * from './AuthContext.jsx';
export { default } from './AuthContext.jsx';
export type {
  Usuario,
  CredencialesLogin,
  RegistroUsuarioDTO,
  OfficialRoleName,
  UserRole,
  CitizenMode,
  MunicipalityProfile,
  LoginCredentials,
  RegisterUserData,
  AuthContextType
} from '../types/auth';
