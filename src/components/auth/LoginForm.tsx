/**
 * ============================================================================
 * COSTA RICA UNIDOS — SISTEMA DE ACCESO Y REGISTRO CÍVICO (SRS v2.1)
 * 4 Roles Oficiales: Ciudadano/Turista, Editor Municipal, Admin Provincial, Super Admin
 * Sincronización reactiva con db.json y localStorage (cru_mock_db_v2)
 * Validación en tiempo real con API del Ministerio de Hacienda (Ley N° 8968)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  OfficialRoleName,
  CitizenMode,
  IdentityStatus,
  RegisterUserData
} from '../../types/auth';
import {
  useAuth,
  MUNICIPALITIES_DIRECTORY,
  AUTHORIZED_SUPER_ADMIN_CEDULAS
} from '../../context/AuthContext';
import { validateCitizenIdentity } from '../../services/haciendaService';
import { getDb, resetDbToSeed, normalizeOfficialRole } from '../../services/dbService';
import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../../data/costaRicaTerritorialData';
import { getProvincias, getCantones, getDistritos } from '../../services/ubicacionesService';
import {
  ChevronDown,
  Loader2,
  MapPin,
  LogIn,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  User,
  FileText,
  Landmark,
  ShieldCheck,
  Globe,
  Zap,
  Lock
} from 'lucide-react';
import CivicButton from '../common/CivicButton';
import CivicCard from '../common/CivicCard';
import CivicBadge from '../common/CivicBadge';

type AuthMode = 'LOGIN' | 'REGISTER';

interface LoginFormProps {
  initialMode?: AuthMode;
}

export default function LoginForm({ initialMode = 'LOGIN' }: LoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || searchParams.get('mode');

  const resolveTarget = (defaultPath: string) => {
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
    return from || defaultPath;
  };

  // Modo activo: Iniciar Sesión ('LOGIN') es SIEMPRE el valor predeterminado en /login
  const resolvedInitialMode: AuthMode =
    location.pathname === '/login' || tabFromUrl === 'login'
      ? 'LOGIN'
      : location.pathname === '/registro' || tabFromUrl === 'register'
        ? 'REGISTER'
        : initialMode || 'LOGIN';

  const [authMode, setAuthMode] = useState<AuthMode>(resolvedInitialMode);

  useEffect(() => {
    if (location.pathname === '/login' || tabFromUrl === 'login') {
      setAuthMode('LOGIN');
    } else if (location.pathname === '/registro' || tabFromUrl === 'register') {
      setAuthMode('REGISTER');
    }
  }, [location.pathname, tabFromUrl]);

  const { login, registro, register, seleccionarCuentaDemo, cargando, isLoading, error: authError, clearError } = useAuth();

  // Rol activo seleccionado para el inicio de sesión
  const [selectedRole, setSelectedRole] = useState<OfficialRoleName>('Ciudadano/Turista');

  // Modalidad para el rol Ciudadano/Turista
  const [citizenMode, setCitizenMode] = useState<CitizenMode>('CIUDADANO');

  // Credenciales de Login
  const [loginIdentifier, setLoginIdentifier] = useState<string>(''); // Cédula o Correo
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Parámetros específicos de rol para Login
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>(MUNICIPALITIES_DIRECTORY[0].id);
  const [municipalSecurityCode, setMunicipalSecurityCode] = useState<string>('');

  // Formulario de Registro Ciudadano
  const [regCedula, setRegCedula] = useState<string>('');
  const [regNombre, setRegNombre] = useState<string>('');
  const [regPrimerApellido, setRegPrimerApellido] = useState<string>('');
  const [regSegundoApellido, setRegSegundoApellido] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  // Estados para Cascada Territorial Dinámica mediante API (Provincias, Cantones, Distritos)
  const [provinciasList, setProvinciasList] = useState<{ id: number; nombre: string }[]>([]);
  const [cantonesList, setCantonesList] = useState<{ id: number; nombre: string; codigoDta?: string }[]>([]);
  const [distritosList, setDistritosList] = useState<{ id: number; nombre: string }[]>([]);

  const [selectedProvinciaId, setSelectedProvinciaId] = useState<string>('');
  const [selectedCantonId, setSelectedCantonId] = useState<string>('');
  const [selectedDistritoId, setSelectedDistritoId] = useState<string>('');

  const [regProvincia, setRegProvincia] = useState<string>('');
  const [regCanton, setRegCanton] = useState<string>('');
  const [regDistrito, setRegDistrito] = useState<string>('');

  const [loadingProvincias, setLoadingProvincias] = useState<boolean>(false);
  const [loadingCantones, setLoadingCantones] = useState<boolean>(false);
  const [loadingDistritos, setLoadingDistritos] = useState<boolean>(false);
  const [regRole, setRegRole] = useState<OfficialRoleName>('Ciudadano/Turista');

  // Estados de Validación con Hacienda
  const [isValidatingHacienda, setIsValidatingHacienda] = useState<boolean>(false);
  const [haciendaVerified, setHaciendaVerified] = useState<boolean>(false);
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus | null>(null);
  const [haciendaMessage, setHaciendaMessage] = useState<string>('');

  // Mensajes de error y éxito
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState<boolean>(true);

  // Estadísticas reactivas de la base de datos simulada
  const [dbStats, setDbStats] = useState<{ totalUsuarios: number; sesionesActivas: number }>({
    totalUsuarios: 4,
    sesionesActivas: 0
  });

  // Actualizar telemetría de db.json
  const refreshDbStats = () => {
    try {
      const db = getDb();
      setDbStats({
        totalUsuarios: db.usuarios.length,
        sesionesActivas: db.sesionesActivas.length
      });
    } catch {
      // Ignorar
    }
  };

  useEffect(() => {
    refreshDbStats();
    const handleDbUpdate = () => refreshDbStats();
    window.addEventListener('cru_db_updated', handleDbUpdate);
    return () => window.removeEventListener('cru_db_updated', handleDbUpdate);
  }, []);

  // Limpiar errores cuando cambia de rol o de modo
  useEffect(() => {
    clearError();
    setFormError(null);
    setSuccessMessage(null);
  }, [selectedRole, authMode]);

  // 1. Cargar Provincias al inicio desde la API (o caché/fallback del servicio)
  useEffect(() => {
    let cancel = false;
    async function loadProvincias() {
      setLoadingProvincias(true);
      try {
        const res = await getProvincias();
        if (!cancel && res.data) {
          setProvinciasList(res.data);
        }
      } catch (err) {
        console.error('[TerritorialAPI] Error al cargar provincias:', err);
      } finally {
        if (!cancel) setLoadingProvincias(false);
      }
    }
    loadProvincias();
    return () => {
      cancel = true;
    };
  }, []);

  // 2. Cambio en Provincia: limpia cantón y distrito, habilita cantón y consulta /provincia/:id/cantones.json
  const handleProvinciaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provIdStr = e.target.value;
    setSelectedProvinciaId(provIdStr);

    // Limpia selecciones anteriores en cascada
    setSelectedCantonId('');
    setRegCanton('');
    setSelectedDistritoId('');
    setRegDistrito('');
    setCantonesList([]);
    setDistritosList([]);

    if (!provIdStr) {
      setRegProvincia('');
      return;
    }

    const provId = parseInt(provIdStr, 10);
    const foundProv = provinciasList.find((p) => p.id === provId);
    setRegProvincia(foundProv ? foundProv.nombre : '');

    setLoadingCantones(true);
    try {
      const res = await getCantones(provId);
      setCantonesList(res.data || []);
    } catch (err) {
      console.error(`[TerritorialAPI] Error al cargar cantones provincia ${provId}:`, err);
      setCantonesList([]);
    } finally {
      setLoadingCantones(false);
    }
  };

  // 3. Cambio en Cantón: limpia distrito, habilita distrito y consulta /provincia/:id/canton/:id/distritos.json
  const handleCantonChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cantonIdStr = e.target.value;
    setSelectedCantonId(cantonIdStr);

    // Limpia distrito anterior en cascada
    setSelectedDistritoId('');
    setRegDistrito('');
    setDistritosList([]);

    if (!cantonIdStr) {
      setRegCanton('');
      return;
    }

    const cantonId = parseInt(cantonIdStr, 10);
    const foundCanton = cantonesList.find((c) => c.id === cantonId);
    setRegCanton(foundCanton ? foundCanton.nombre : '');

    if (!selectedProvinciaId) return;

    setLoadingDistritos(true);
    try {
      const provId = parseInt(selectedProvinciaId, 10);
      const res = await getDistritos(provId, cantonId);
      setDistritosList(res.data || []);
    } catch (err) {
      console.error(`[TerritorialAPI] Error al cargar distritos P:${selectedProvinciaId} C:${cantonId}:`, err);
      setDistritosList([]);
    } finally {
      setLoadingDistritos(false);
    }
  };

  // 4. Cambio en Distrito
  const handleDistritoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distritoIdStr = e.target.value;
    setSelectedDistritoId(distritoIdStr);

    if (!distritoIdStr) {
      setRegDistrito('');
      return;
    }

    const distritoId = parseInt(distritoIdStr, 10);
    const foundDistrito = distritosList.find((d) => d.id === distritoId);
    setRegDistrito(foundDistrito ? foundDistrito.nombre : '');
  };

  // Manejar validación contra API de Hacienda
  const handleValidateCedula = async (cedulaInput: string) => {
    const clean = cedulaInput.replace(/[^0-9]/g, '').trim();
    if (!clean || clean.length < 9) {
      setFormError('Ingrese una cédula costarricense (9-10 dígitos) o DIMEX (11-12 dígitos) para consultar Hacienda.');
      return;
    }

    setIsValidatingHacienda(true);
    setFormError(null);

    try {
      const res = await validateCitizenIdentity(clean);

      if (res.success && !res.isFallback) {
        setRegNombre(res.nombre);
        setRegPrimerApellido(res.primerApellido);
        setRegSegundoApellido(res.segundoApellido);
        setHaciendaVerified(true);
        setIdentityStatus('VERIFICADO_HACIENDA');
        setHaciendaMessage('Identidad oficial verificada y certificada ante el Ministerio de Hacienda.');
      } else {
        setHaciendaVerified(false);
        setIdentityStatus('PENDIENTE_VERIFICACION');
        setHaciendaMessage('Cédula no registrada en consulta directa de Hacienda. Ingrese sus datos en contingencia.');
      }
    } catch {
      setHaciendaVerified(false);
      setIdentityStatus('PENDIENTE_VERIFICACION');
      setHaciendaMessage('Red con Hacienda inaccesible. Modo de contingencia habilitado.');
    } finally {
      setIsValidatingHacienda(false);
    }
  };

  // Enviar formulario de Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    clearError();

    const cleanIdent = loginIdentifier.trim();
    if (!cleanIdent) {
      setFormError('Por favor ingrese su cédula oficial costarricense o correo electrónico.');
      return;
    }

    if (!loginPassword) {
      setFormError('Por favor ingrese su contraseña de acceso.');
      return;
    }

    // Reglas adicionales por rol
    if (selectedRole === 'Administrador Provincial' && !municipalSecurityCode.trim()) {
      setFormError('Debe ingresar el código institucional o clave de seguridad municipal.');
      return;
    }

    if (selectedRole === 'Super Administrador Nacional') {
      const digitsOnly = cleanIdent.replace(/[^0-9]/g, '');
      const isAuthorizedCedula = AUTHORIZED_SUPER_ADMIN_CEDULAS.includes(cleanIdent) || AUTHORIZED_SUPER_ADMIN_CEDULAS.includes(digitsOnly) || cleanIdent.includes('admin.nacional');
      if (!isAuthorizedCedula) {
        setFormError('Acceso denegado: Esta cuenta no pertenece a los 2 Super Administradores Nacionales autorizados.');
        return;
      }
    }

    // Ejecutar login contra AuthContext y dbService
    const result = await login({
      cedula: cleanIdent,
      email: cleanIdent.includes('@') ? cleanIdent : undefined,
      password: loginPassword,
      role: selectedRole,
      citizenMode,
      municipalityId: selectedMunicipalityId,
      municipalCode: municipalSecurityCode
    });

    if (result.success) {
      refreshDbStats();
      // Redirección adaptativa según rol oficial respetando la ruta previa
      if (selectedRole === 'Administrador Provincial' || selectedRole === 'Editor Municipal') {
        navigate(resolveTarget('/gobernanza'), { replace: true });
      } else {
        navigate(resolveTarget('/dashboard'), { replace: true });
      }
    } else if (result.message) {
      setFormError(result.message);
    }
  };

  // Enviar formulario de Registro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    clearError();

    const cleanCedula = regCedula.trim();
    const digitsOnly = cleanCedula.replace(/[^0-9]/g, '');

    if (!digitsOnly || digitsOnly.length < 9) {
      setFormError('La cédula debe contener al menos 9 dígitos válidos.');
      return;
    }

    if (!regNombre.trim()) {
      setFormError('El nombre completo es requerido. Valide su cédula con Hacienda o ingréselo manualmente.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setFormError('Por favor ingrese un correo electrónico válido.');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setFormError('La contraseña debe contener al menos 4 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFormError('Las contraseñas ingresadas no coinciden. Verifique ambas casillas.');
      return;
    }

    if (!regProvincia || !regProvincia.trim()) {
      setFormError('Por favor seleccione una provincia de residencia.');
      return;
    }

    if (!regCanton || !regCanton.trim()) {
      setFormError('Por favor seleccione un cantón de residencia.');
      return;
    }

    if (!regDistrito || !regDistrito.trim()) {
      setFormError('Por favor seleccione un distrito de residencia.');
      return;
    }

    const regData: RegisterUserData = {
      cedula: cleanCedula,
      nombre: regNombre.trim(),
      primerApellido: regPrimerApellido.trim(),
      segundoApellido: regSegundoApellido.trim(),
      correo: regEmail.toLowerCase().trim(),
      password: regPassword,
      rol: regRole,
      provincia: regProvincia,
      canton: regCanton,
      distrito: regDistrito,
      verificadoHacienda: haciendaVerified
    };

    const result = await register(regData);

    if (result.success) {
      refreshDbStats();
      setSuccessMessage(result.message || '¡Cuenta cívica creada exitosamente! Redirigiendo...');
      setRegCedula('');
      setRegNombre('');
      setRegPrimerApellido('');
      setRegSegundoApellido('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setSelectedProvinciaId('');
      setSelectedCantonId('');
      setSelectedDistritoId('');
      setRegProvincia('');
      setRegCanton('');
      setRegDistrito('');
      setHaciendaVerified(false);
      setHaciendaMessage('');
      setTimeout(() => {
        navigate(resolveTarget('/dashboard'), { replace: true });
      }, 1200);
    } else {
      const err = (result as { message?: string; mensaje?: string }).message ||
        (result as { message?: string; mensaje?: string }).mensaje ||
        'Error al procesar el registro.';
      setFormError(err);
    }
  };

  // Carga instantánea de una de las 4 Cuentas Semilla Oficiales del SRS v2.1
  const loadSeedAccount = (
    role: OfficialRoleName,
    identifier: string,
    pass: string,
    mode: CitizenMode = 'CIUDADANO',
    muniId = 'muni-sanjose',
    muniCode = 'MSJ-2026-SEC'
  ) => {
    setAuthMode('LOGIN');
    setSelectedRole(role);
    setLoginIdentifier(identifier);
    setLoginPassword(pass);
    setCitizenMode(mode);
    setSelectedMunicipalityId(muniId);
    setMunicipalSecurityCode(muniCode);
    setFormError(null);
    setSuccessMessage(null);
    clearError();
  };

  const handleResetDb = () => {
    resetDbToSeed();
    refreshDbStats();
    setSuccessMessage('Configuración inicial de prueba restablecida correctamente.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <CivicCard
      level={2}
      provincialGlow={true}
      style={{
        width: '100%',
        maxWidth: '560px',
        padding: '2.2rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 24px 60px rgba(0, 4, 13, 0.9), 0 0 35px rgba(0, 43, 127, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.16)'
      }}
    >
      {/* Encabezado Institucional */}
      <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
        <CivicBadge variant="accent" style={{ marginBottom: '0.6rem' }}>
          SOBERANÍA E IDENTIDAD DIGITAL COSTA RICA
        </CivicBadge>

        <h1
          style={{
            fontFamily: 'var(--font-heading, "Mistical Spring", serif)',
            fontSize: '2rem',
            color: '#FFFFFF',
            margin: '0.2rem 0 0.4rem',
            letterSpacing: '0.5px'
          }}
        >
          {authMode === 'LOGIN' ? 'Acceso Soberano' : 'Registro Cívico Cantonal'}
        </h1>

        <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.88rem', margin: 0 }}>
          {authMode === 'LOGIN'
            ? 'Control de Acceso Basado en Roles (RBAC) para los Servicios Cívicos de la República'
            : 'Apertura de expediente cívico con validación directa del Ministerio de Hacienda'}
        </p>
      </div>

      {/* Selector de Modo: Iniciar Sesión vs Registro */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'rgba(0, 4, 13, 0.9)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '1.5rem'
        }}
      >
        <button
          type="button"
          onClick={() => {
            setAuthMode('LOGIN');
            setFormError(null);
            setSuccessMessage(null);
          }}
          style={{
            padding: '9px 12px',
            borderRadius: '7px',
            border: 'none',
            background:
              authMode === 'LOGIN'
                ? 'linear-gradient(135deg, #002B7F 0%, #0A3282 100%)'
                : 'transparent',
            color: authMode === 'LOGIN' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <LogIn className="w-4 h-4" />
          <span>Iniciar Sesión</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('REGISTER');
            setFormError(null);
            setSuccessMessage(null);
          }}
          style={{
            padding: '9px 12px',
            borderRadius: '7px',
            border: 'none',
            background:
              authMode === 'REGISTER'
                ? 'linear-gradient(135deg, #007A3D 0%, #005A2B 100%)'
                : 'transparent',
            color: authMode === 'REGISTER' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Cuenta</span>
        </button>
      </div>

      {/* Banner de Notificación de Éxito */}
      {successMessage && (
        <div
          style={{
            backgroundColor: 'rgba(0, 208, 132, 0.2)',
            border: '1px solid #00D084',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#B4FED9',
            fontSize: '0.85rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Banner de Mensajes de Error */}
      {(formError || authError) && (
        <div
          style={{
            backgroundColor: 'rgba(206, 17, 38, 0.25)',
            border: '1px solid #CE1126',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#FF8A8A',
            fontSize: '0.85rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{formError || authError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. VISTA DE INICIO DE SESIÓN (LOGIN) — 4 ROLES DEL SRS v2.1              */}
      {/* ========================================================================= */}
      {authMode === 'LOGIN' && (
        <>


          {/* Formulario de Login */}
          <form onSubmit={handleLoginSubmit}>
            {/* Campo 1: Cédula o Correo */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="login-ident-input"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '0.35rem'
                }}
              >
                Cédula Costarricense o Correo Institucional
              </label>
              <input
                id="login-ident-input"
                type="text"
                placeholder="Cédula o correo electrónico"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 4, 13, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            {/* Campo 2: Contraseña */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label
                  htmlFor="login-pass-input"
                  style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)' }}
                >
                  Contraseña de Acceso
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontSize: '0.74rem',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                id="login-pass-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 4, 13, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* CAMPOS ESPECÍFICOS SEGÚN ROL SELECCIONADO */}

            {/* A. Ciudadano: Modalidad */}
            {selectedRole === 'Ciudadano/Turista' && (
              <div
                style={{
                  padding: '0.9rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 20, 137, 0.25)',
                  border: '1px solid rgba(0, 43, 127, 0.5)',
                  marginBottom: '1.25rem'
                }}
              >
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#FFF', marginBottom: '0.5rem' }}>
                  Modalidad Cívica:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCitizenMode('CIUDADANO')}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: citizenMode === 'CIUDADANO' ? '#002B7F' : 'rgba(0, 4, 13, 0.6)',
                      color: '#FFFFFF',
                      fontWeight: citizenMode === 'CIUDADANO' ? 700 : 500,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <User className="w-3.5 h-3.5 text-sky-300" />
                    <span>Ciudadano Residente</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCitizenMode('TURISTA')}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: citizenMode === 'TURISTA' ? '#007A3D' : 'rgba(0, 4, 13, 0.6)',
                      color: '#FFFFFF',
                      fontWeight: citizenMode === 'TURISTA' ? 700 : 500,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Turista / Visitante</span>
                  </button>
                </div>
              </div>
            )}

            {/* B. Editor Municipal o Admin Provincial: Asignación Cantonal */}
            {(selectedRole === 'Editor Municipal' || selectedRole === 'Administrador Provincial') && (
              <div
                style={{
                  padding: '0.9rem',
                  borderRadius: '8px',
                  backgroundColor:
                    selectedRole === 'Editor Municipal'
                      ? 'rgba(2, 132, 199, 0.15)'
                      : 'rgba(255, 199, 0, 0.12)',
                  border:
                    selectedRole === 'Editor Municipal'
                      ? '1px solid rgba(2, 132, 199, 0.4)'
                      : '1px solid rgba(255, 199, 0, 0.4)',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <label
                    htmlFor="muni-login-select"
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: selectedRole === 'Editor Municipal' ? '#38BDF8' : '#FFC700',
                      marginBottom: '0.35rem'
                    }}
                  >
                    Municipalidad Asignada:
                  </label>
                  <select
                    id="muni-login-select"
                    value={selectedMunicipalityId}
                    onChange={(e) => setSelectedMunicipalityId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0, 4, 13, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    {MUNICIPALITIES_DIRECTORY.map((m) => (
                      <option key={m.id} value={m.id} style={{ background: '#00040D', color: '#FFF' }}>
                        {m.nombre} ({m.provincia})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="muni-sec-code"
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: selectedRole === 'Editor Municipal' ? '#38BDF8' : '#FFC700',
                      marginBottom: '0.35rem'
                    }}
                  >
                    Código Institucional / Privado de Secretaría:
                  </label>
                  <input
                    id="muni-sec-code"
                    type="password"
                    placeholder="Ej: MSJ-2026-SEC"
                    value={municipalSecurityCode}
                    onChange={(e) => setMunicipalSecurityCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0, 4, 13, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}



            {/* Botón Principal de Envío */}
            <CivicButton
              type="submit"
              variant={
                selectedRole === 'Super Administrador Nacional'
                  ? 'danger'
                  : selectedRole === 'Administrador Provincial'
                    ? 'warning'
                    : 'primary'
              }
              isLoading={isLoading}
              style={{ width: '100%', height: '48px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              Ingresar como {selectedRole}
            </CivicButton>
          </form>

          {/* ===================================================================== */}
          {/* BOTONES DE PRUEBA RÁPIDA: PERFILES OFICIALES PRECONFIGURADOS          */}
          {/* ===================================================================== */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Perfiles Oficiales de Acceso Rápido:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#79a6ff',
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                {showDemoCredentials ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showDemoCredentials && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                {/* 1. Super Admin Nacional */}
                <div
                  onClick={() =>
                    loadSeedAccount(
                      'Super Administrador Nacional',
                      'admin.nacional@gob.cr',
                      'Admin123*'
                    )
                  }
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(206, 17, 38, 0.2)',
                    border: '1px solid rgba(206, 17, 38, 0.4)',
                    color: '#FF8A8A',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                      <span>Super Admin Nacional</span>
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.68rem', fontFamily: 'monospace' }}>admin.nacional@gob.cr</div>
                    <div style={{ opacity: 0.65, fontSize: '0.66rem' }}>Pass: Admin123* (Nivel 5)</div>
                  </div>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await login({
                        id: 'USR-NAC-001',
                        cedula: '1-0000-0001',
                        nombre: 'Superintendencia Nacional de Gobierno Digital',
                        correo: 'admin.nacional@gob.cr',
                        email: 'admin.nacional@gob.cr',
                        rol: 'SUPER_ADMIN_NACIONAL',
                        nivelAcceso: 5,
                        provincia: 'Nacional',
                        password: 'Admin123*'
                      });
                      navigate(resolveTarget('/admin/super'), { replace: true });
                    }}
                    style={{
                      background: '#CE1126',
                      border: 'none',
                      color: '#FFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      marginTop: '4px',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Acceder <Zap className="w-3 h-3" />
                    </span>
                  </button>
                </div>

                {/* 2. Gestor Territorial y Municipal */}
                <div
                  onClick={() =>
                    loadSeedAccount(
                      'Gestor Territorial y Municipal',
                      'gobierno.territorial@gob.cr',
                      'Territorial2026*',
                      'CIUDADANO',
                      'muni-puntarenas',
                      'MPU-2026-SEC'
                    )
                  }
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(245, 158, 11, 0.18)',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    color: '#FCD34D',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Landmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gestor Territorial y Municipal</span>
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.68rem', fontFamily: 'monospace' }}>gobierno.territorial@gob.cr</div>
                    <div style={{ opacity: 0.65, fontSize: '0.66rem' }}>Pass: Territorial2026* (Nivel 4)</div>
                  </div>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await login({
                        id: 'USR-TER-006',
                        cedula: '6-0123-0456',
                        nombre: 'Coordinación Territorial Puntarenas',
                        correo: 'gobierno.territorial@gob.cr',
                        email: 'gobierno.territorial@gob.cr',
                        rol: 'GESTOR_TERRITORIAL',
                        provincia: 'Puntarenas',
                        provinciaId: 6,
                        nivelAcceso: 4,
                        password: 'Territorial2026*'
                      });
                      navigate(resolveTarget('/admin/territorial'), { replace: true });
                    }}
                    style={{
                      background: '#D97706',
                      border: 'none',
                      color: '#FFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      marginTop: '4px',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Acceder <Zap className="w-3 h-3" />
                    </span>
                  </button>
                </div>

                {/* 3. Editor Municipal */}
                <div
                  onClick={() =>
                    loadSeedAccount(
                      'Editor Municipal',
                      'editor.concejo@msj.go.cr',
                      'EditorMuni2026*',
                      'CIUDADANO',
                      'muni-sanjose',
                      'MSJ-2026-SEC'
                    )
                  }
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(2, 132, 199, 0.2)',
                    border: '1px solid rgba(2, 132, 199, 0.4)',
                    color: '#38BDF8',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      <span>Editor Municipal</span>
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.68rem', fontFamily: 'monospace' }}>editor.concejo@msj.go.cr</div>
                    <div style={{ opacity: 0.65, fontSize: '0.66rem' }}>Pass: EditorMuni2026* (Nivel 3)</div>
                  </div>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await login({
                        id: 'USR-MUNI-001',
                        cedula: '1-0101-0101',
                        nombre: 'Editor Municipal San José',
                        correo: 'editor.concejo@msj.go.cr',
                        email: 'editor.concejo@msj.go.cr',
                        rol: 'GESTOR_TERRITORIAL',
                        nivelAcceso: 3,
                        provincia: 'San José',
                        password: 'EditorMuni2026*'
                      });
                      navigate(resolveTarget('/gobernanza'), { replace: true });
                    }}
                    style={{
                      background: '#0284C7',
                      border: 'none',
                      color: '#FFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      marginTop: '4px',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Acceder <Zap className="w-3 h-3" />
                    </span>
                  </button>
                </div>

                {/* 4. Ciudadano Residente */}
                <div
                  onClick={() =>
                    loadSeedAccount(
                      'Ciudadano/Turista',
                      'eiker.abarca@gmail.com',
                      'Ciudadano2026*',
                      'CIUDADANO'
                    )
                  }
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 43, 127, 0.3)',
                    border: '1px solid rgba(121, 166, 255, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>Ciudadano Residente</span>
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.68rem', fontFamily: 'monospace' }}>eiker.abarca@gmail.com</div>
                    <div style={{ opacity: 0.65, fontSize: '0.66rem' }}>Pass: Ciudadano2026* (Nivel 2)</div>
                  </div>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await login({
                        id: 'USR-CIU-001',
                        cedula: '6-0509-0727',
                        nombre: 'Eiker Manuel Abarca Murillo',
                        correo: 'eiker.abarca@gmail.com',
                        email: 'eiker.abarca@gmail.com',
                        rol: 'CIUDADANO',
                        nivelAcceso: 2,
                        provincia: 'Puntarenas',
                        password: 'Ciudadano2026*'
                      });
                      navigate(resolveTarget('/dashboard'), { replace: true });
                    }}
                    style={{
                      background: '#002B7F',
                      border: '1px solid rgba(121, 166, 255, 0.4)',
                      color: '#FFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      marginTop: '4px',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Acceder <Zap className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

{/* ========================================================================= */ }
{/* 2. VISTA DE REGISTRO CIUDADANO (SINCRONIZA EN db.json / localStorage)    */ }
{/* ========================================================================= */ }
{
  authMode === 'REGISTER' && (
    <form onSubmit={handleRegisterSubmit}>
      {/* PASO 1: Cédula con Consulta Hacienda */}
      <div style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <label
            htmlFor="reg-cedula-input"
            style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)' }}
          >
            1. Cédula Costarricense o DIMEX Oficial
          </label>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', fontFamily: 'monospace' }}>
            9 a 12 dígitos
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            id="reg-cedula-input"
            type="text"
            placeholder="1-1823-0456 ó 118230456"
            value={regCedula}
            onChange={(e) => {
              setRegCedula(e.target.value);
              setHaciendaVerified(false);
              setIdentityStatus(null);
            }}
            onBlur={() => {
              if (regCedula.replace(/[^0-9]/g, '').length >= 9 && !haciendaVerified) {
                handleValidateCedula(regCedula);
              }
            }}
            style={{
              flex: 1,
              padding: '0.75rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 4, 13, 0.75)',
              border: haciendaVerified
                ? '1px solid #00D084'
                : identityStatus === 'PENDIENTE_VERIFICACION'
                  ? '1px solid #FFC700'
                  : '1px solid rgba(255, 255, 255, 0.22)',
              color: '#FFFFFF',
              fontSize: '0.92rem',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />

          <CivicButton
            type="button"
            variant="secondary"
            onClick={() => handleValidateCedula(regCedula)}
            disabled={isValidatingHacienda || !regCedula.trim()}
            isLoading={isValidatingHacienda}
            style={{ minWidth: '120px', height: '42px', fontSize: '0.78rem' }}
          >
            {isValidatingHacienda ? (
              'Consultando...'
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Search className="w-3.5 h-3.5" />
                <span>Validar</span>
              </span>
            )}
          </CivicButton>
        </div>

        {haciendaMessage && (
          <div
            style={{
              marginTop: '0.4rem',
              fontSize: '0.76rem',
              color: haciendaVerified ? '#00D084' : '#FFC700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {haciendaVerified ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span>{haciendaMessage}</span>
          </div>
        )}
      </div>

      {/* PASO 2: Nombres y Apellidos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.15rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              Nombre(s)
            </label>
            {haciendaVerified && (
              <span style={{ fontSize: '0.72rem', color: '#00D084', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verificado por Hacienda</span>
              </span>
            )}
          </div>
          <input
            type="text"
            placeholder="Nombre oficial"
            value={regNombre}
            onChange={(e) => setRegNombre(e.target.value)}
            readOnly={haciendaVerified}
            style={{
              width: '100%',
              padding: '0.7rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: haciendaVerified ? 'rgba(0, 43, 127, 0.25)' : 'rgba(0, 4, 13, 0.75)',
              border: haciendaVerified ? '1px solid rgba(0, 208, 132, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: haciendaVerified ? 'not-allowed' : 'text'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.3rem' }}>
            Primer Apellido
          </label>
          <input
            type="text"
            placeholder="Primer Apellido"
            value={regPrimerApellido}
            onChange={(e) => setRegPrimerApellido(e.target.value)}
            readOnly={haciendaVerified}
            style={{
              width: '100%',
              padding: '0.7rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: haciendaVerified ? 'rgba(0, 43, 127, 0.25)' : 'rgba(0, 4, 13, 0.75)',
              border: haciendaVerified ? '1px solid rgba(0, 208, 132, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: haciendaVerified ? 'not-allowed' : 'text'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.3rem' }}>
            Segundo Apellido
          </label>
          <input
            type="text"
            placeholder="Segundo Apellido"
            value={regSegundoApellido}
            onChange={(e) => setRegSegundoApellido(e.target.value)}
            readOnly={haciendaVerified}
            style={{
              width: '100%',
              padding: '0.7rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: haciendaVerified ? 'rgba(0, 43, 127, 0.25)' : 'rgba(0, 4, 13, 0.75)',
              border: haciendaVerified ? '1px solid rgba(0, 208, 132, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: haciendaVerified ? 'not-allowed' : 'text'
            }}
          />
        </div>
      </div>

      {/* PASO 3: Correo Electrónico */}
      <div style={{ marginBottom: '1.15rem' }}>
        <label
          htmlFor="reg-email-input"
          style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)', marginBottom: '0.35rem' }}
        >
          2. Correo Electrónico (Notificaciones Cívicas)
        </label>
        <input
          id="reg-email-input"
          type="email"
          placeholder="correo@ejemplo.com"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 0.9rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 4, 13, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            color: '#FFFFFF',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />
      </div>

      {/* PASO 4: Contraseña y Confirmación */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.15rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.3rem' }}>
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Mínimo 4 caracteres"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 4, 13, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.3rem' }}>
            Confirmar Contraseña
          </label>
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={regConfirmPassword}
            onChange={(e) => setRegConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 4, 13, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* PASO 5: Jurisdicción Territorial en Cascada Dinámica */}
      <div
        style={{
          padding: '1.1rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(14, 20, 36, 0.85)',
          border: '1px solid #1e293b',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 4, 13, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            3. Jurisdicción Territorial:
          </span>
          <span style={{ fontSize: '0.66rem', color: '#64748B', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
            DIVISIÓN TERRITORIAL DINÁMICA
          </span>
        </div>

        {/* Fila 1: Provincia y Cantón en Cascada */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.75rem' }}>
          {/* Selector de Provincia */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Provincia</span>
              {loadingProvincias && <span style={{ color: '#38bdf8', fontSize: '0.65rem' }}>Cargando...</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedProvinciaId}
                onChange={handleProvinciaChange}
                disabled={loadingProvincias}
                style={{
                  width: '100%',
                  padding: '0.62rem 2.2rem 0.62rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#0e1424',
                  border: '1px solid #1e293b',
                  color: selectedProvinciaId ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: loadingProvincias ? 'wait' : 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#38bdf8';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 189, 248, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="" style={{ backgroundColor: '#0e1424', color: '#64748B' }}>
                  {loadingProvincias ? 'Cargando provincias...' : 'Seleccione Provincia'}
                </option>
                {provinciasList.map((p) => (
                  <option key={p.id} value={p.id} style={{ backgroundColor: '#0e1424', color: '#FFFFFF' }}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#94A3B8'
                }}
              >
                {loadingProvincias ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>

          {/* Selector de Cantón (Habilitado solo tras elegir Provincia) */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Cantón</span>
              {loadingCantones && <span style={{ color: '#38bdf8', fontSize: '0.65rem' }}>Consultando API...</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCantonId}
                onChange={handleCantonChange}
                disabled={!selectedProvinciaId || loadingCantones}
                style={{
                  width: '100%',
                  padding: '0.62rem 2.2rem 0.62rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: (!selectedProvinciaId || loadingCantones) ? 'rgba(10, 15, 26, 0.6)' : '#0e1424',
                  border: (!selectedProvinciaId || loadingCantones) ? '1px solid rgba(30, 41, 59, 0.6)' : '1px solid #1e293b',
                  color: selectedCantonId ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: (!selectedProvinciaId || loadingCantones) ? 'not-allowed' : 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  if (selectedProvinciaId && !loadingCantones) {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 189, 248, 0.2)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = (!selectedProvinciaId || loadingCantones) ? 'rgba(30, 41, 59, 0.6)' : '#1e293b';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="" style={{ backgroundColor: '#0e1424', color: '#64748B' }}>
                  {loadingCantones
                    ? 'Cargando cantones...'
                    : !selectedProvinciaId
                      ? 'Primero elija provincia'
                      : 'Seleccione Cantón'}
                </option>
                {cantonesList.map((c) => (
                  <option key={c.id} value={c.id} style={{ backgroundColor: '#0e1424', color: '#FFFFFF' }}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  color: (!selectedProvinciaId || loadingCantones) ? '#475569' : '#94A3B8'
                }}
              >
                {loadingCantones ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fila 2: Selector de Distrito (Habilitado solo tras elegir Cantón) */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Distrito</span>
            {loadingDistritos && <span style={{ color: '#38bdf8', fontSize: '0.65rem' }}>Consultando API...</span>}
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedDistritoId}
              onChange={handleDistritoChange}
              disabled={!selectedCantonId || loadingDistritos}
              style={{
                width: '100%',
                padding: '0.62rem 2.2rem 0.62rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: (!selectedCantonId || loadingDistritos) ? 'rgba(10, 15, 26, 0.6)' : '#0e1424',
                border: (!selectedCantonId || loadingDistritos) ? '1px solid rgba(30, 41, 59, 0.6)' : '1px solid #1e293b',
                color: selectedDistritoId ? '#FFFFFF' : '#94A3B8',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: (!selectedCantonId || loadingDistritos) ? 'not-allowed' : 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                if (selectedCantonId && !loadingDistritos) {
                  e.currentTarget.style.borderColor = '#38bdf8';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 189, 248, 0.2)';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = (!selectedCantonId || loadingDistritos) ? 'rgba(30, 41, 59, 0.6)' : '#1e293b';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="" style={{ backgroundColor: '#0e1424', color: '#64748B' }}>
                {loadingDistritos
                  ? 'Cargando distritos...'
                  : !selectedCantonId
                    ? 'Primero elija cantón'
                    : 'Seleccione Distrito'}
              </option>
              {distritosList.map((d) => (
                <option key={d.id} value={d.id} style={{ backgroundColor: '#0e1424', color: '#FFFFFF' }}>
                  {d.nombre}
                </option>
              ))}
            </select>
            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                color: (!selectedCantonId || loadingDistritos) ? '#475569' : '#94A3B8'
              }}
            >
              {loadingDistritos ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PASO 6: Rol del Usuario Creado */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
          Rol Asignado:
        </label>
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 4, 13, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User className="w-4 h-4 text-sky-400" />
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem' }}>
              Ciudadano / Turista
            </span>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              backgroundColor: 'rgba(0, 43, 127, 0.4)',
              color: '#79a6ff',
              padding: '3px 8px',
              borderRadius: '999px',
              border: '1px solid rgba(121, 166, 255, 0.3)'
            }}
          >
            Nivel 2 de Acceso
          </span>
        </div>
      </div>

      {/* Botón de Enviar Registro */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 py-3 px-6 rounded-xl font-bold text-white text-base tracking-wide bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] border-2 border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.45)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#00040D]"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          border: '2px solid #34D399',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.45)',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.75 : 1
        }}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2 font-bold text-white">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span>Registrando...</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 font-bold text-white">
            <UserPlus className="w-5 h-5 text-white" />
            <span>Registrarme</span>
          </span>
        )}
      </button>
    </form>
  )
}

{/* Pie de Auditoría y Estado del Sistema */ }
<div
  style={{
    marginTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.85rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.72rem',
    color: 'rgba(255, 255, 255, 0.6)'
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span
      style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        backgroundColor: '#00D084',
        boxShadow: '0 0 8px rgba(0, 208, 132, 0.7)',
        display: 'inline-block'
      }}
    />
    <span style={{ fontWeight: 500 }}>Sistema en línea</span>
  </div>

  <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.7rem' }}>
    Sede Digital Verificada
  </span>
</div>
    </CivicCard >
  );
}
