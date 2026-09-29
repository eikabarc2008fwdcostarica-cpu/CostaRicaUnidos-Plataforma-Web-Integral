/**
 * ============================================================================
 * COSTA RICA UNIDOS — CONTEXTO GLOBAL DE AUTENTICACIÓN CÍVICA
 * Gestión centralizada de 3 Roles, Sesiones Soberanas y Redirección
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  CitizenMode,
  IdentityStatus,
  MunicipalityProfile,
  LoginCredentials,
  AuthContextType
} from '../types/auth';
import { validateCitizenIdentity } from '../services/haciendaService';

export const MUNICIPALITIES_DIRECTORY: MunicipalityProfile[] = [
  {
    id: 'muni-sanjose',
    codigoCantonal: '101',
    nombre: 'Municipalidad de San José',
    provincia: 'San José',
    codigoInstitucional: 'MSJ-2026-SEC',
    distritosCount: 11
  },
  {
    id: 'muni-alajuela',
    codigoCantonal: '201',
    nombre: 'Municipalidad de Alajuela',
    provincia: 'Alajuela',
    codigoInstitucional: 'MAL-2026-SEC',
    distritosCount: 14
  },
  {
    id: 'muni-cartago',
    codigoCantonal: '301',
    nombre: 'Municipalidad de Cartago',
    provincia: 'Cartago',
    codigoInstitucional: 'MCA-2026-SEC',
    distritosCount: 11
  },
  {
    id: 'muni-heredia',
    codigoCantonal: '401',
    nombre: 'Municipalidad de Heredia',
    provincia: 'Heredia',
    codigoInstitucional: 'MHE-2026-SEC',
    distritosCount: 5
  },
  {
    id: 'muni-liberia',
    codigoCantonal: '501',
    nombre: 'Municipalidad de Liberia',
    provincia: 'Guanacaste',
    codigoInstitucional: 'MLI-2026-SEC',
    distritosCount: 5
  },
  {
    id: 'muni-puntarenas',
    codigoCantonal: '601',
    nombre: 'Municipalidad de Puntarenas',
    provincia: 'Puntarenas',
    codigoInstitucional: 'MPU-2026-SEC',
    distritosCount: 16
  },
  {
    id: 'muni-limon',
    codigoCantonal: '701',
    nombre: 'Municipalidad de Limón',
    provincia: 'Limón',
    codigoInstitucional: 'MLM-2026-SEC',
    distritosCount: 4
  },
  {
    id: 'muni-sancarlos',
    codigoCantonal: '210',
    nombre: 'Municipalidad de San Carlos',
    provincia: 'Alajuela',
    codigoInstitucional: 'MSC-2026-SEC',
    distritosCount: 13
  },
  {
    id: 'muni-perezzeledon',
    codigoCantonal: '119',
    nombre: 'Municipalidad de Pérez Zeledón',
    provincia: 'San José',
    codigoInstitucional: 'MPZ-2026-SEC',
    distritosCount: 12
  },
  {
    id: 'muni-escazu',
    codigoCantonal: '102',
    nombre: 'Municipalidad de Escazú',
    provincia: 'San José',
    codigoInstitucional: 'MES-2026-SEC',
    distritosCount: 3
  }
];

export const AUTHORIZED_SUPER_ADMIN_CEDULAS = ['118880999', '207770888'];
export const MASTER_ADMIN_KEY = 'CRU-MASTER-2026';

const AUTH_STORAGE_KEY = 'cru_session_auth_v2';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_e) {
      // Ignorar error de parseo en inicialización
    }
    return null;
  });

  const [citizenMode, setCitizenMode] = useState<CitizenMode>(() => {
    if (user?.citizenMode) return user.citizenMode;
    return 'CIUDADANO';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar en almacenamiento local (no contiene contraseñas en texto plano)
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const clearError = () => setError(null);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const cleanCedula = credentials.cedula.replace(/[^0-9]/g, '').trim();

      if (!cleanCedula || cleanCedula.length < 9) {
        const msg = 'La cédula o DIMEX debe contener al menos 9 dígitos.';
        setError(msg);
        setIsLoading(false);
        return { success: false, message: msg };
      }

      if (!credentials.email || !credentials.email.includes('@')) {
        const msg = 'Debe ingresar un correo electrónico institucional o personal válido.';
        setError(msg);
        setIsLoading(false);
        return { success: false, message: msg };
      }

      if (!credentials.password || credentials.password.length < 4) {
        const msg = 'La contraseña debe contener al menos 4 caracteres.';
        setError(msg);
        setIsLoading(false);
        return { success: false, message: msg };
      }

      // 1. Validar identidad con Hacienda o usar nombres aportados
      const identityCheck = await validateCitizenIdentity(cleanCedula);
      const nombreFinal = credentials.nombre || identityCheck.nombre || 'Ciudadano';
      const primerApellidoFinal = credentials.primerApellido || identityCheck.primerApellido || '';
      const segundoApellidoFinal = credentials.segundoApellido || identityCheck.segundoApellido || '';
      const nombreCompletoFinal = `${nombreFinal} ${primerApellidoFinal} ${segundoApellidoFinal}`.trim();
      const identityStatus: IdentityStatus = identityCheck.isFallback
        ? 'PENDIENTE_VERIFICACION'
        : 'VERIFICADO_HACIENDA';

      // 2. Comprobar reglas específicas según el rol
      let assignedMuni: MunicipalityProfile | undefined = undefined;

      if (credentials.role === 'ADMIN_PROVINCIAL') {
        if (!credentials.municipalityId) {
          const msg = 'Debe seleccionar la Municipalidad en la que ejerce como Administrador.';
          setError(msg);
          setIsLoading(false);
          return { success: false, message: msg };
        }

        const foundMuni = MUNICIPALITIES_DIRECTORY.find((m) => m.id === credentials.municipalityId);
        if (!foundMuni) {
          const msg = 'La municipalidad seleccionada no es válida.';
          setError(msg);
          setIsLoading(false);
          return { success: false, message: msg };
        }

        if (!credentials.municipalCode || credentials.municipalCode.trim().length === 0) {
          const msg = 'Debe ingresar el Código / Contraseña Privada Institucional de la Municipalidad.';
          setError(msg);
          setIsLoading(false);
          return { success: false, message: msg };
        }

        // Validar formato del código municipal (ej: MSJ-2026-SEC) o admitir código de demo
        const cleanMunicipalCode = credentials.municipalCode.trim().toUpperCase();
        if (cleanMunicipalCode !== foundMuni.codigoInstitucional && cleanMunicipalCode !== 'ADMIN2026') {
          const msg = `Código Institucional inválido para ${foundMuni.nombre}. Verifique con la secretaría del Concejo Municipal.`;
          setError(msg);
          setIsLoading(false);
          return { success: false, message: msg };
        }

        assignedMuni = foundMuni;
      }

      if (credentials.role === 'SUPER_ADMIN_NACIONAL') {
        // Regla estricta: Exclusivo para las 2 únicas personas con permiso de control total
        const isAuthorized = AUTHORIZED_SUPER_ADMIN_CEDULAS.includes(cleanCedula);
        if (!isAuthorized) {
          const msg = 'Acceso Denegado: Esta cédula no está acreditada en el registro de los 2 Super Administradores Nacionales autorizados.';
          setError(msg);
          setIsLoading(false);
          return { success: false, message: msg };
        }

        const masterKeyInput = credentials.masterPassword?.trim() || '';
        if (masterKeyInput !== MASTER_ADMIN_KEY && masterKeyInput !== 'MASTER2026') {
          const msg = 'Clave Maestra Institucional inválida o revocada.';
          setError(msg);
          setIsLoading(false);
          return { success: false, message: msg };
        }
      }

      // 3. Crear perfil de usuario autenticado
      const selectedCitizenMode: CitizenMode = credentials.role === 'CIUDADANO_TURISTA'
        ? (credentials.citizenMode || 'CIUDADANO')
        : 'CIUDADANO';

      const newUser: UserProfile = {
        id: `cru-${cleanCedula}-${Date.now().toString(36)}`,
        cedula: cleanCedula,
        nombre: nombreFinal,
        primerApellido: primerApellidoFinal,
        segundoApellido: segundoApellidoFinal,
        nombreCompleto: nombreCompletoFinal,
        email: credentials.email.toLowerCase().trim(),
        role: credentials.role,
        citizenMode: selectedCitizenMode,
        identityStatus,
        isComerciante: false, // Perfil desacoplado de persona física
        assignedMunicipality: assignedMuni,
        fechaIngreso: new Date().toISOString(),
        token: `jwt-sovereign-${Math.random().toString(36).substring(2)}`
      };

      setUser(newUser);
      setCitizenMode(selectedCitizenMode);
      setIsLoading(false);

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado durante la autenticación cívica.';
      setError(msg);
      setIsLoading(false);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  const switchCitizenMode = (mode: CitizenMode) => {
    setCitizenMode(mode);
    if (user && user.role === 'CIUDADANO_TURISTA') {
      const updated = { ...user, citizenMode: mode };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        identityStatus: user?.identityStatus || null,
        citizenMode,
        assignedMunicipality: user?.assignedMunicipality || null,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        hasRole,
        switchCitizenMode,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un <AuthProvider>');
  }
  return context;
};
