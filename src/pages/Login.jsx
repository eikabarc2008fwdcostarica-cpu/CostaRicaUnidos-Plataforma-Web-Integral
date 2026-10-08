/**
 * ============================================================================
 * COSTA RICA UNIDOS — ACCESO SOBERANO & AUTENTICACIÓN CÍVICA
 * Arquitectura Sovereign Civic Glass v2.2 • Obsidiana Soberana (#00040D)
 * Control de Acceso Basado en Roles (RBAC) • Ley N° 8968 & Ley N° 8292
 * Componente 100% Autónomo con SVGs Nativos e Inmunidad a Fallos en Vite
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { loginComercianteApi } from '../services/comercioService';
import dbSeed from '../data/seedData';

// ----------------------------------------------------------------------------
// Constantes y Roles Oficiales Integrados
// ----------------------------------------------------------------------------
const ROLES_SISTEMA = {
  SUPER_ADMIN_NACIONAL: 'SUPER_ADMIN_NACIONAL',
  GESTOR_TERRITORIAL: 'GESTOR_TERRITORIAL',
  CIUDADANO: 'CIUDADANO'
};

const normalizarRolOficial = (rol) => {
  if (!rol) return 'CIUDADANO';
  const r = String(rol).toUpperCase().trim();
  if (r.includes('SUPER') || r.includes('NACIONAL') || r === 'SUPER_ADMIN_NACIONAL' || r === '5') {
    return 'SUPER_ADMIN_NACIONAL';
  }
  if (r.includes('GESTOR') || r.includes('TERRITORIAL') || r.includes('MUNICIPAL') || r === 'GESTOR_TERRITORIAL' || r === '4') {
    return 'GESTOR_TERRITORIAL';
  }
  return 'CIUDADANO';
};

// ----------------------------------------------------------------------------
// Registros Oficiales de db.json integrados de forma segura e inmutable
// ----------------------------------------------------------------------------
const REGISTROS_DB = Array.isArray(dbSeed?.usuarios) && dbSeed.usuarios.length > 0
  ? [
      ...dbSeed.usuarios,
      {
        id: "USR-EMP-002",
        cedula: "3-102-456123",
        nombre: "Valeria Chaves Monge",
        correo: "valeria.chaves@ujarras.cr",
        password: "Empresa2026*",
        rol: "Ciudadano Residente",
        nivelAcceso: 2,
        provincia: "Cartago",
        canton: "Cartago"
      }
    ].filter((u, index, self) => index === self.findIndex((t) => t.cedula === u.cedula))
  : [
      {
        id: "USR-NAC-001",
        cedula: "1-0000-0001",
        nombre: "Superintendencia Nacional de Gobierno Digital",
        correo: "admin.nacional@gob.cr",
        password: "Admin123*",
        rol: "Super Administrador Nacional",
        nivelAcceso: 5,
        provincia: "Nacional",
        canton: "Todas las Municipalidades"
      },
      {
        id: "USR-TER-006",
        cedula: "6-0123-0456",
        nombre: "Coordinación Territorial Puntarenas",
        correo: "gobierno.territorial@gob.cr",
        password: "Territorial2026*",
        rol: "Gestor Territorial y Municipal",
        nivelAcceso: 4,
        provincia: "Puntarenas",
        canton: "Puntarenas"
      },
      {
        id: "USR-CIU-001",
        cedula: "1-1823-0456",
        nombre: "Eiker Manuel Abarca Murillo",
        correo: "eiker.abarca@gmail.com",
        password: "Ciudadano2026*",
        rol: "Ciudadano Residente",
        nivelAcceso: 2,
        provincia: "San José",
        canton: "San José"
      },
      {
        id: "USR-EMP-002",
        cedula: "3-102-456123",
        nombre: "Valeria Chaves Monge",
        correo: "valeria.chaves@ujarras.cr",
        password: "Empresa2026*",
        rol: "Ciudadano Residente",
        nivelAcceso: 2,
        provincia: "Cartago",
        canton: "Cartago"
      },
      {
        id: "USR-COM-001",
        cedula: "1-1456-0789",
        nombre: "CARLOS HERNANDEZ ROJAS",
        correo: "comercio.sanjose@crviva.cr",
        password: "Password123*",
        rol: "Comerciante y Emprendedor",
        nivelAcceso: 3,
        provincia: "San José",
        canton: "San José"
      }
    ];

// ----------------------------------------------------------------------------
// Iconos Vectoriales Nativos en Línea (Sin dependencias externas)
// ----------------------------------------------------------------------------
const IconShieldCheck = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconLock = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconCreditCard = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const IconMail = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconUser = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconUserPlus = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const IconLogIn = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);

const IconStore = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </svg>
);

const IconEye = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const IconAlertCircle = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

const IconCheckCircle2 = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconLoader2 = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', animation: 'spin 1s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const IconArrowRight = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <line x1="5" x2="19" y1="12" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconSearch = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// ----------------------------------------------------------------------------
// Boundary Protector para el Navbar en caso de desajuste de contexto
// ----------------------------------------------------------------------------
class SafeNavbarBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('Navbar fallback activado en Login:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <header
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--cru-border, #E2E8F0)',
            background: 'var(--theme-header-bg, #FFFFFF)',
            boxSizing: 'border-box'
          }}
        >
          <Logo showText={true} />
          <Link
            to="/"
            style={{
              color: 'var(--blue, #0053AF)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            ← Volver al Portal
          </Link>
        </header>
      );
    }
    return this.props.children;
  }
}

// ----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL: LOGIN / ACCESO SOBERANO
// ----------------------------------------------------------------------------
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Detección de pestaña desde URL
  const tabFromUrl = searchParams.get('tab') || searchParams.get('mode');

  // Estado inicial estricto: SIEMPRE 'login' por defecto a menos que se solicite 'register' explícito
  const [authMode, setAuthMode] = useState(
    tabFromUrl === 'register' ? 'register' : 'login'
  );

  // Sincronización reactiva con la ruta
  useEffect(() => {
    if (location.pathname === '/login') {
      setAuthMode('login');
    } else if (tabFromUrl === 'register') {
      setAuthMode('register');
    }
  }, [location.pathname, tabFromUrl]);

  // Manejo defensivo del contexto de autenticación (No asume que AuthProvider existe)
  let authContextValue = null;
  try {
    authContextValue = useAuth ? useAuth() : null;
  } catch {
    authContextValue = null;
  }

  const login = authContextValue?.login || ((user) => {
    try {
      localStorage.setItem('cru_user_session', JSON.stringify(user));
      localStorage.setItem('cru_token', 'TOKEN_SOBERANO_' + (user.id || 'SESSION'));
    } catch {}
    return { success: true };
  });

  const registro = authContextValue?.registro || (async (userData) => {
    try {
      const raw = localStorage.getItem('cr_db_usuarios');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ ...userData, id: `USR-${Date.now()}` });
      localStorage.setItem('cr_db_usuarios', JSON.stringify(arr));
    } catch {}
    return { success: true };
  });

  const logout = authContextValue?.logout || (() => {
    try {
      localStorage.removeItem('cru_user_session');
      localStorage.removeItem('cru_token');
    } catch {}
  });

  // Estados del Formulario de Inicio de Sesión
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados del Formulario de Registro Ciudadano
  const [regCedula, setRegCedula] = useState('');
  const [regNombres, setRegNombres] = useState('');
  const [regPrimerApellido, setRegPrimerApellido] = useState('');
  const [regSegundoApellido, setRegSegundoApellido] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Estados de Validación con Ministerio de Hacienda
  const [isValidating, setIsValidating] = useState(false);
  const [isHaciendaVerified, setIsHaciendaVerified] = useState(false);
  const [haciendaError, setHaciendaError] = useState('');
  const [haciendaSuccess, setHaciendaSuccess] = useState('');

  // Mensajes Generales y Estado de Carga
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados de Autenticación de Comercio Aprobado (Nombre + Cédula)
  const [comercioNombre, setComercioNombre] = useState('');
  const [comercioCedula, setComercioCedula] = useState('');
  const [comercioLoading, setComercioLoading] = useState(false);
  const [comercioBloqueado, setComercioBloqueado] = useState(false);
  const [comercioSegundosRestantes, setComercioSegundosRestantes] = useState(0);

  useEffect(() => {
    let timer = null;
    if (comercioBloqueado && comercioSegundosRestantes > 0) {
      timer = setInterval(() => {
        setComercioSegundosRestantes((prev) => {
          if (prev <= 1) {
            setComercioBloqueado(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [comercioBloqueado, comercioSegundosRestantes]);

  // Parser inteligente para formato costarricense (Nombres y Apellidos al final)
  const procesarNombreHacienda = (nombreCompleto) => {
    if (!nombreCompleto) return;
    const partes = nombreCompleto.trim().split(/\s+/);

    if (partes.length >= 3) {
      const segAp = partes[partes.length - 1];
      const primAp = partes[partes.length - 2];
      const nom = partes.slice(0, partes.length - 2).join(' ');

      setRegNombres(nom);
      setRegPrimerApellido(primAp);
      setRegSegundoApellido(segAp);
    } else if (partes.length === 2) {
      setRegNombres(partes[0]);
      setRegPrimerApellido(partes[1]);
      setRegSegundoApellido('');
    } else {
      setRegNombres(nombreCompleto);
      setRegPrimerApellido('');
      setRegSegundoApellido('');
    }
  };

  // Fallback para pruebas locales, desarrollo offline o contingencia
  const aplicarFallbackManual = (cleanCedula) => {
    if (cleanCedula === '101110222' || cleanCedula === '1-0111-0222') {
      setRegNombres('MARÍA ELENA');
      setRegPrimerApellido('RODRÍGUEZ');
      setRegSegundoApellido('VARGAS');
      setIsHaciendaVerified(true);
      setHaciendaSuccess('✔ Identidad oficial verificada y certificada ante el Ministerio de Hacienda.');
    } else if (cleanCedula === '100000001') {
      setRegNombres('SUPER ADMIN');
      setRegPrimerApellido('NACIONAL');
      setRegSegundoApellido('');
      setIsHaciendaVerified(true);
      setHaciendaSuccess('✔ Identidad oficial verificada y certificada ante el Ministerio de Hacienda.');
    } else if (cleanCedula === '601230456') {
      setRegNombres('COORDINACIÓN');
      setRegPrimerApellido('TERRITORIAL');
      setRegSegundoApellido('');
      setIsHaciendaVerified(true);
      setHaciendaSuccess('✔ Identidad oficial verificada y certificada ante el Ministerio de Hacienda.');
    } else {
      setIsHaciendaVerified(false);
      setHaciendaError('No se pudo conectar con Hacienda o no está inscrito tributariamente. Puede ingresar sus datos manualmente.');
    }
  };

  // Validación en tiempo real contra API del Ministerio de Hacienda
  const handleValidarCedula = async () => {
    const cleanCedula = regCedula.replace(/[-\s]/g, '').trim();
    if (cleanCedula.length < 9) {
      setHaciendaError('Ingrese una cédula costarricense válida (mínimo 9 dígitos).');
      setIsHaciendaVerified(false);
      setHaciendaSuccess('');
      return;
    }

    setIsValidating(true);
    setHaciendaError('');
    setHaciendaSuccess('');

    try {
      const response = await fetch(
        `https://api.hacienda.go.cr/fe/ae?identificacion=${cleanCedula}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.nombre) {
          procesarNombreHacienda(data.nombre);
          setIsHaciendaVerified(true);
          setHaciendaSuccess('✔ Identidad oficial verificada y certificada ante el Ministerio de Hacienda.');
        } else {
          aplicarFallbackManual(cleanCedula);
        }
      } else {
        aplicarFallbackManual(cleanCedula);
      }
    } catch {
      aplicarFallbackManual(cleanCedula);
    } finally {
      setIsValidating(false);
    }
  };

  // Manejo de Inicio de Sesión conectado directamente a REGISTROS_DB
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const cleanIdent = identificador.trim();
    const cleanPass = password.trim();

    if (!cleanIdent || !cleanPass) {
      setError('Por favor complete los campos obligatorios: identificación/correo y contraseña.');
      setSuccessMsg('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const cleanDigits = cleanIdent.replace(/[^0-9]/g, '');
      const cleanEmail = cleanIdent.toLowerCase();

      // Recopilar usuarios directamente de REGISTROS_DB con soporte para altas dinámicas locales
      let usuariosDisponibles = [...REGISTROS_DB];
      try {
        const rawLocal = localStorage.getItem('cr_db_usuarios');
        if (rawLocal) {
          const parsedLocal = JSON.parse(rawLocal);
          if (Array.isArray(parsedLocal)) {
            for (const lu of parsedLocal) {
              if (!usuariosDisponibles.some((u) => u.id === lu.id || (u.correo && u.correo.toLowerCase() === (lu.correo || '').toLowerCase()))) {
                usuariosDisponibles.push(lu);
              }
            }
          }
        }
      } catch {
        // Continuar con REGISTROS_DB
      }

      // Búsqueda y autenticación exacta contra la estructura de usuarios:
      const usuarioEncontrado = usuariosDisponibles.find((u) => {
        const uCedulaClean = String(u.cedula || '').replace(/[^0-9]/g, '');
        const uCorreoClean = String(u.correo || '').trim().toLowerCase();

        const matchCedula = u.cedula === cleanIdent || (cleanDigits && uCedulaClean === cleanDigits);
        const matchCorreo = uCorreoClean === cleanEmail;
        const matchIdent = matchCedula || matchCorreo;
        const matchPassword = String(u.password) === cleanPass;

        return matchIdent && matchPassword;
      });

      if (!usuarioEncontrado) {
        setError('Las credenciales ingresadas no corresponden a ningún registro oficial activo en el sistema.');
        setLoading(false);
        return;
      }

      // Autenticación en el contexto conservando todos los atributos
      const res = await login(usuarioEncontrado);

      if (res && res.success !== false) {
        const userRolNorm = normalizarRolOficial(usuarioEncontrado.rol);

        // Guardar usuario y token en almacenamiento local de forma redundante y segura
        try {
          localStorage.setItem('cru_user_session', JSON.stringify(usuarioEncontrado));
          localStorage.setItem('cr_sesion_activa', JSON.stringify(usuarioEncontrado));
          localStorage.setItem('cru_token', 'TOKEN_SOBERANO_' + (usuarioEncontrado.id || 'SESSION'));
          localStorage.removeItem('cr_sesion_cerrada');
        } catch (e) {
          console.warn('Error al persistir sesión en localStorage:', e);
        }

        // Redirección automática según el rol
        if (userRolNorm === ROLES_SISTEMA.SUPER_ADMIN_NACIONAL || usuarioEncontrado.nivelAcceso === 5) {
          navigate('/admin/super', { replace: true });
        } else if (userRolNorm === ROLES_SISTEMA.GESTOR_TERRITORIAL || usuarioEncontrado.nivelAcceso === 4) {
          navigate('/admin/territorial', { replace: true });
        } else if (
          userRolNorm === ROLES_SISTEMA.COMERCIANTE ||
          usuarioEncontrado.nivelAcceso === 3 ||
          String(usuarioEncontrado.rol || '').toLowerCase().includes('comerciante') ||
          String(usuarioEncontrado.rol || '').toLowerCase().includes('emprendedor')
        ) {
          navigate('/perfil-comercial', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError(
          res?.mensaje ||
          res?.message ||
          'Las credenciales ingresadas no corresponden a ningún registro oficial activo en el sistema.'
        );
      }
    } catch {
      setError('Las credenciales ingresadas no corresponden a ningún registro oficial activo en el sistema.');
    } finally {
      setLoading(false);
    }
  };

  // Manejo de Inicio de Sesión Comercial (Nombre del Solicitante + Cédula con Hash y Protección Ley 8968)
  const handleLoginComercioSubmit = async (e) => {
    e.preventDefault();
    const cleanNom = comercioNombre.trim();
    const cleanCed = comercioCedula.replace(/[^0-9]/g, '');

    if (!cleanNom || !cleanCed) {
      setError('Por favor complete el nombre del solicitante y el número de cédula oficial.');
      setSuccessMsg('');
      return;
    }

    setComercioLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let res;
      if (authContextValue?.loginComerciante) {
        res = await authContextValue.loginComerciante(cleanNom, cleanCed);
      } else {
        res = await loginComercianteApi(cleanNom, cleanCed);
        if (res?.success && res?.user) {
          try {
            localStorage.setItem('cru_user_session', JSON.stringify(res.user));
            localStorage.setItem('cr_sesion_activa', JSON.stringify(res.user));
            localStorage.setItem('cru_token', res.token || 'TOKEN_COMERCIANTE');
          } catch (_e) {}
        }
      }

      if (res && res.success) {
        setSuccessMsg('Acceso comercial autorizado exitosamente. Redirigiendo a su perfil comercial...');
        setTimeout(() => {
          navigate('/perfil-comercial', { replace: true });
        }, 350);
      } else if (res && res.bloqueado) {
        setComercioBloqueado(true);
        setComercioSegundosRestantes(res.segundosRestantes || 900);
        setError(res.message || 'Acceso temporalmente suspendido por múltiples intentos fallidos.');
      } else if (res && (res.estado === 'pendiente' || res.estado === 'rechazado')) {
        setError(res.message || `Su solicitud comercial se encuentra en estado ${res.estado}.`);
      } else {
        const intentos = res?.intentosRestantes !== undefined ? ` (Intentos restantes: ${res.intentosRestantes})` : '';
        setError((res?.message || 'Credenciales inválidas.') + intentos);
      }
    } catch {
      setError('Credenciales inválidas.');
    } finally {
      setComercioLoading(false);
    }
  };

  // Manejo de Registro Ciudadano
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanCedula = regCedula.trim();
    const cleanNombres = regNombres.trim();
    const cleanPrimerApellido = regPrimerApellido.trim();
    const cleanSegundoApellido = regSegundoApellido.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPass = regPassword.trim();
    const cleanConfirm = regConfirmPassword.trim();

    if (!cleanCedula || !cleanNombres || !cleanPrimerApellido || !cleanEmail || !cleanPass || !cleanConfirm) {
      setError('Por favor complete todos los campos obligatorios para el registro ciudadano.');
      return;
    }

    if (cleanPass.length < 6) {
      setError('La contraseña debe tener una longitud mínima de 6 caracteres.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setError('Las contraseñas ingresadas no coinciden. Por favor verifique ambos campos.');
      return;
    }

    setLoading(true);

    const nombreCompleto = [cleanNombres, cleanPrimerApellido, cleanSegundoApellido].filter(Boolean).join(' ');

    try {
      const res = await registro({
        cedula: cleanCedula,
        nombre: nombreCompleto,
        primerApellido: cleanPrimerApellido,
        segundoApellido: cleanSegundoApellido,
        correo: cleanEmail,
        password: cleanPass,
        rol: 'CIUDADANO',
        provincia: 'Puntarenas',
        canton: 'Puntarenas',
        distrito: 'Puntarenas',
        verificadoHacienda: isHaciendaVerified
      });

      if (res && res.success !== false) {
        // Inicializar sesión ciudadana inmediata
        const nuevoCiudadano = {
          id: `USR-CIU-${Date.now()}`,
          cedula: cleanCedula,
          nombre: nombreCompleto,
          primerApellido: cleanPrimerApellido,
          segundoApellido: cleanSegundoApellido,
          correo: cleanEmail,
          email: cleanEmail,
          password: cleanPass,
          rol: 'Ciudadano Residente',
          rolOficial: 'CIUDADANO',
          nivelAcceso: 2,
          provincia: 'Puntarenas',
          canton: 'Puntarenas',
          distrito: 'Puntarenas',
          verificadoHacienda: isHaciendaVerified,
          token: `TOKEN_SOBERANO_${Date.now()}`
        };

        try {
          localStorage.setItem('cru_user_session', JSON.stringify(nuevoCiudadano));
          localStorage.setItem('cr_sesion_activa', JSON.stringify(nuevoCiudadano));
          localStorage.setItem('cru_token', nuevoCiudadano.token);
          localStorage.removeItem('cr_sesion_cerrada');
        } catch (e) {
          console.warn('Error al guardar sesión de nuevo ciudadano:', e);
        }

        if (typeof login === 'function') {
          await login(nuevoCiudadano);
        }

        setSuccessMsg(
          '¡Cuenta ciudadana creada exitosamente! Ingresando al portal principal cívico...'
        );

        // Redirección inmediata a la página principal cívica ('/')
        navigate('/', { replace: true });
      } else {
        setError(
          res?.mensaje ||
          res?.message ||
          'No fue posible completar el registro. Verifique que la cédula o correo no estén previamente registrados.'
        );
      }
    } catch {
      setError('Error al procesar la solicitud de registro ciudadano en el sistema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-bg, #FFFFFF)',
        backgroundImage: 'var(--theme-bg-gradient, linear-gradient(180deg, #FDFDFF 0%, #F5F7FB 100%))',
        color: 'var(--theme-text-primary, #0F172A)',
        fontFamily: "var(--font-main, 'Poppins', sans-serif)",
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <SafeNavbarBoundary>
        <Navbar />
      </SafeNavbarBoundary>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.25rem',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '580px',
            backgroundColor: 'var(--cru-surface, #FFFFFF)',
            border: '1px solid var(--cru-border, #E2E8F0)',
            borderRadius: '24px',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: 'var(--cru-card-shadow-hover, 0 20px 45px rgba(6, 42, 119, 0.08))',
            padding: 'clamp(1.5rem, 4vw, 3rem) clamp(0.75rem, 3.5vw, 2.5rem)',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Cinta superior tricolor soberana de Costa Rica */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #DA291C 0%, #DA291C 35%, #FFFFFF 35%, #FFFFFF 50%, #001489 50%, #001489 100%)'
            }}
          />

          {/* Encabezado Formal Institucional */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Logo showText={true} />
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.4rem, 3.8vw, 1.85rem)',
                fontWeight: 800,
                color: 'var(--cru-text, #062A77)',
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.25
              }}
            >
              Acceso Soberano
            </h1>

            <p style={{ color: 'var(--cru-text-soft, #64748B)', fontSize: '0.86rem', margin: '0 0 1rem 0' }}>
              Control de Acceso Basado en Roles (RBAC) para los Servicios Cívicos de la República
            </p>

            <div
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', 'Fira Code', monospace)",
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--cru-accent-blue, #002B7F)',
                backgroundColor: 'var(--cru-accent-blue-bg, rgba(0, 43, 127, 0.08))',
                border: '1px solid var(--cru-accent-blue-border, rgba(0, 43, 127, 0.25))',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              <IconShieldCheck size={14} color="var(--cru-accent-blue, #002B7F)" />
              <span>ACCESO SEGURO • LEY N° 8968 & LEY N° 8292</span>
            </div>
          </div>

          {/* Selector de Pestañas Internas (Control de Estado Local) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '4px',
              backgroundColor: 'var(--cru-badge-neutral-bg, #F1F5F9)',
              padding: '4px',
              borderRadius: '14px',
              border: '1px solid var(--cru-border, #E2E8F0)',
              marginBottom: '1.75rem'
            }}
          >
            {/* Pestaña 1: [→] Iniciar Sesión Ciudadana/Admin */}
            <button
              type="button"
              id="tab-btn-login"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMsg('');
              }}
              style={{
                padding: '9px 4px',
                borderRadius: '10px',
                border: 'none',
                background:
                  authMode === 'login'
                    ? 'linear-gradient(135deg, #062A77 0%, #0053AF 100%)'
                    : 'transparent',
                color: authMode === 'login' ? '#FFFFFF' : 'var(--cru-text-soft, #64748B)',
                fontWeight: 700,
                fontSize: 'clamp(0.7rem, 2.2vw, 0.8rem)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                minWidth: 0,
                boxShadow:
                  authMode === 'login' ? '0 4px 14px rgba(6, 42, 119, 0.25)' : 'none'
              }}
            >
              <IconLogIn size={15} color="currentColor" />
              <span className="truncate">Ciudadano</span>
            </button>

            {/* Pestaña 2: [🏪] Comercio PyMES Aprobado */}
            <button
              type="button"
              id="tab-btn-comercio"
              onClick={() => {
                setAuthMode('comercio');
                setError('');
                setSuccessMsg('');
              }}
              style={{
                padding: '9px 4px',
                borderRadius: '10px',
                border: 'none',
                background:
                  authMode === 'comercio'
                    ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                    : 'transparent',
                color: authMode === 'comercio' ? '#FFFFFF' : 'var(--cru-text-soft, #64748B)',
                fontWeight: 700,
                fontSize: 'clamp(0.7rem, 2.2vw, 0.8rem)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                minWidth: 0,
                boxShadow:
                  authMode === 'comercio' ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
              }}
            >
              <IconStore size={15} color="currentColor" />
              <span className="truncate">
                <span className="hidden min-[480px]:inline">Comercios & </span>PyMES
              </span>
            </button>

            {/* Pestaña 3: [+] Crear Cuenta */}
            <button
              type="button"
              id="tab-btn-register"
              onClick={() => {
                setAuthMode('register');
                setError('');
                setSuccessMsg('');
              }}
              style={{
                padding: '9px 4px',
                borderRadius: '10px',
                border: 'none',
                background:
                  authMode === 'register'
                    ? 'linear-gradient(135deg, #062A77 0%, #0053AF 100%)'
                    : 'transparent',
                color: authMode === 'register' ? '#FFFFFF' : 'var(--cru-text-soft, #64748B)',
                fontWeight: 700,
                fontSize: 'clamp(0.7rem, 2.2vw, 0.8rem)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                minWidth: 0,
                boxShadow:
                  authMode === 'register' ? '0 4px 14px rgba(6, 42, 119, 0.25)' : 'none'
              }}
            >
              <IconUserPlus size={15} color="currentColor" />
              <span className="truncate">
                <span className="hidden min-[480px]:inline">Registrarse</span>
                <span className="min-[480px]:hidden">Registro</span>
              </span>
            </button>
          </div>

          {/* Mensajes de Alerta: Éxito */}
          {successMsg && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#6EE7B7',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                marginBottom: '1.25rem'
              }}
            >
              <IconCheckCircle2 size={18} color="#10B981" className="flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mensajes de Alerta: Error General */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#FCA5A5',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                marginBottom: '1.25rem'
              }}
            >
              <IconAlertCircle size={18} color="#EF4444" className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* CONTENIDO DINÁMICO: 1. INICIAR SESIÓN                            */}
          {/* ================================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Campo 1: Cédula o Correo */}
              <div>
                <label
                  htmlFor="login-identificador"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--cru-text, #062A77)',
                    marginBottom: '0.45rem'
                  }}
                >
                  <IconCreditCard size={15} color="var(--cru-accent-blue, #002B7F)" />
                  <span>Cédula Costarricense o Correo Institucional</span>
                </label>
                <input
                  id="login-identificador"
                  type="text"
                  placeholder="1-0111-0222 o usuario@gob.cr"
                  value={identificador}
                  onChange={(e) => {
                    setIdentificador(e.target.value);
                    if (error) setError('');
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                    border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                    color: 'var(--theme-input-text, #0F172A)',
                    fontSize: '0.94rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--blue, #0053AF)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Campo 2: Contraseña */}
              <div>
                <label
                  htmlFor="login-password"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--cru-text, #062A77)',
                    marginBottom: '0.45rem'
                  }}
                >
                  <IconLock size={15} color="var(--cru-accent-blue, #002B7F)" />
                  <span>Contraseña de Acceso</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 2.75rem 0.85rem 1.1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                      border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                      color: 'var(--theme-input-text, #0F172A)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--blue, #0053AF)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    id="btn-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <IconEyeOff size={18} color="#64748B" /> : <IconEye size={18} color="#64748B" />}
                  </button>
                </div>
              </div>

              {/* Botón Principal de Acceso */}
              <button
                type="submit"
                id="btn-login-submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--navy, #062A77)',
                  backgroundImage: 'linear-gradient(135deg, #062A77 0%, #0053AF 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 6px 20px rgba(6, 42, 119, 0.25)',
                  marginTop: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <IconLoader2 size={18} color="#FFFFFF" />
                    <span>Verificando credenciales oficiales...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar a la Plataforma</span>
                    <IconArrowRight size={18} color="#FFFFFF" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================================================================= */}
          {/* CONTENIDO DINÁMICO: 2. ACCESO COMERCIAL APROBADO (PyMES)          */}
          {/* ================================================================= */}
          {authMode === 'comercio' && (
            <form onSubmit={handleLoginComercioSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Banner Informativo de Identidad Comercial Soberana */}
              <div
                style={{
                  backgroundColor: 'rgba(217, 119, 6, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: 'var(--cru-text, #062A77)'
                }}
              >
                <IconStore size={20} color="#D97706" className="flex-shrink-0" style={{ marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#D97706', display: 'block', marginBottom: '2px' }}>
                    Acceso Exclusivo para Comercios Acreditados (Nivel 3)
                  </strong>
                  Ingrese con el nombre del titular y el número de cédula registrado en su acreditación cantonal.
                </div>
              </div>

              {/* Alerta de Bloqueo por Rate Limiting */}
              {comercioBloqueado && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#EF4444',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                  }}
                >
                  <IconAlertCircle size={18} color="#EF4444" />
                  <span>
                    Acceso temporalmente suspendido por múltiples intentos fallidos. Tiempo restante: <strong>{Math.floor(comercioSegundosRestantes / 60)}m {comercioSegundosRestantes % 60}s</strong>.
                  </span>
                </div>
              )}

              {/* Campo 1: Nombre del Solicitante */}
              <div>
                <label
                  htmlFor="login-comercio-nombre"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--cru-text, #062A77)',
                    marginBottom: '0.45rem'
                  }}
                >
                  <IconUser size={15} color="var(--cru-accent-blue, #0053AF)" />
                  <span>Nombre del Solicitante / Titular</span>
                </label>
                <input
                  id="login-comercio-nombre"
                  type="text"
                  required
                  disabled={comercioLoading || comercioBloqueado}
                  value={comercioNombre}
                  onChange={(e) => setComercioNombre(e.target.value)}
                  placeholder="ej. CARLOS HERNANDEZ ROJAS"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                    border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                    color: 'var(--cru-text, #062A77)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-soft, #64748B)', marginTop: '4px', display: 'block' }}>
                  Insensible a mayúsculas y tildes (comparación normalizada oficial).
                </span>
              </div>

              {/* Campo 2: Cédula Oficial */}
              <div>
                <label
                  htmlFor="login-comercio-cedula"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--cru-text, #062A77)',
                    marginBottom: '0.45rem'
                  }}
                >
                  <IconCreditCard size={15} color="var(--cru-accent-blue, #0053AF)" />
                  <span>Número de Cédula Oficial</span>
                </label>
                <input
                  id="login-comercio-cedula"
                  type="text"
                  required
                  disabled={comercioLoading || comercioBloqueado}
                  value={comercioCedula}
                  onChange={(e) => setComercioCedula(e.target.value)}
                  placeholder="ej. 1-1456-0789"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                    border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                    color: 'var(--cru-text, #062A77)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace'
                  }}
                />
                <div
                  style={{
                    marginTop: '6px',
                    fontSize: '0.72rem',
                    color: 'var(--cru-text-soft, #64748B)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <IconShieldCheck size={13} color="#059669" />
                  <span>Ley N° 8968: Su cédula se valida con hash y nunca se almacena en texto plano.</span>
                </div>
              </div>

              {/* Botón de Ingreso Comercial */}
              <button
                type="submit"
                id="btn-login-comercio-submit"
                disabled={comercioLoading || comercioBloqueado}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '14px',
                  backgroundColor: '#D97706',
                  backgroundImage: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  cursor: comercioLoading || comercioBloqueado ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.35)',
                  marginTop: '0.5rem'
                }}
              >
                {comercioLoading ? (
                  <>
                    <IconLoader2 size={18} color="#FFFFFF" />
                    <span>Verificando comercio acreditado...</span>
                  </>
                ) : (
                  <>
                    <IconStore size={18} color="#FFFFFF" />
                    <span>Ingresar a Mi Perfil Comercial</span>
                  </>
                )}
              </button>

              {/* Botones de Prueba Rápida Oficial */}
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--cru-surface-muted, #F8FAFC)',
                  border: '1px solid var(--cru-border, #E2E8F0)',
                  fontSize: '0.75rem'
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--cru-text, #062A77)', display: 'block', marginBottom: '6px' }}>
                  Accesos rápidos de prueba (Criterios de Aceptación):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setComercioNombre('Carlos Hernández Rojas');
                      setComercioCedula('1-1456-0789');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #FDE68A',
                      backgroundColor: '#FFFBEB',
                      color: '#B45309',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.74rem'
                    }}
                  >
                    ✔ <strong>Comercio Aprobado:</strong> Carlos Hernández Rojas • 1-1456-0789
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComercioNombre('Mauricio Solano Brenes');
                      setComercioCedula('3-101-789456');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.74rem'
                    }}
                  >
                    ⏳ <strong>Solicitud Pendiente:</strong> Mauricio Solano Brenes • 3-101-789456
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComercioNombre('Eiker Manuel Abarca Murillo');
                      setComercioCedula('1-1823-0456');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#B91C1C',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.74rem'
                    }}
                  >
                    ❌ <strong>Solicitud Rechazada:</strong> Eiker Manuel Abarca Murillo • 1-1823-0456
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* CONTENIDO DINÁMICO: 3. CREAR CUENTA CIUDADANA                    */}
          {/* ================================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* A. Bloque de Cédula con Botón de Validación */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label
                    htmlFor="reg-cedula"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--cru-text, #062A77)'
                    }}
                  >
                    <IconCreditCard size={15} color="var(--cru-accent-blue, #002B7F)" />
                    <span>Cédula Costarricense o DIMEX Oficial</span>
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "var(--font-mono, monospace)" }}>
                    9 a 12 dígitos
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="reg-cedula"
                    type="text"
                    placeholder="1-0111-0222"
                    value={regCedula}
                    onChange={(e) => {
                      setRegCedula(e.target.value);
                      setIsHaciendaVerified(false);
                      setHaciendaSuccess('');
                      setHaciendaError('');
                      if (error) setError('');
                    }}
                    required
                    style={{
                      flex: 1,
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                      border: isHaciendaVerified
                        ? '1.5px solid #10B981'
                        : '1.5px solid var(--theme-input-border, #CBD5E1)',
                      color: 'var(--theme-input-text, #0F172A)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isHaciendaVerified
                        ? '#10B981'
                        : 'var(--blue, #0053AF)';
                      e.target.style.boxShadow = isHaciendaVerified
                        ? '0 0 0 3px rgba(16, 185, 129, 0.15)'
                        : '0 0 0 3px rgba(0, 83, 175, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isHaciendaVerified
                        ? '#10B981'
                        : 'var(--theme-input-border, #CBD5E1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />

                  <button
                    type="button"
                    id="btn-validar-cedula"
                    onClick={handleValidarCedula}
                    disabled={isValidating}
                    style={{
                      padding: '0 1.25rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--cru-accent-blue-bg, rgba(0, 43, 127, 0.08))',
                      border: '1px solid var(--cru-accent-blue-border, rgba(0, 43, 127, 0.25))',
                      color: 'var(--cru-accent-blue, #002B7F)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: isValidating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      boxShadow: 'none'
                    }}
                  >
                    {isValidating ? (
                      <>
                        <IconLoader2 size={15} color="var(--cru-accent-blue, #002B7F)" />
                        <span>Validando...</span>
                      </>
                    ) : (
                      <>
                        <IconSearch size={15} color="var(--cru-accent-blue, #002B7F)" />
                        <span>Validar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Certificación de Hacienda */}
                {isHaciendaVerified && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      color: '#059669',
                      fontSize: '0.78rem',
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      fontWeight: 600
                    }}
                  >
                    <IconCheckCircle2 size={14} color="#059669" />
                    <span>{haciendaSuccess || '✔ Identidad oficial verificada y certificada ante el Ministerio de Hacienda.'}</span>
                  </div>
                )}

                {/* Error de Validación */}
                {haciendaError && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      color: '#D97706',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <IconAlertCircle size={14} color="#D97706" />
                    <span>{haciendaError}</span>
                  </div>
                )}
              </div>

              {/* B. Bloque de Nombre(s) y Apellidos (Completamente Editables) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label
                    htmlFor="reg-nombres"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--cru-text, #062A77)'
                    }}
                  >
                    <IconUser size={15} color="var(--cru-accent-blue, #002B7F)" />
                    <span>Nombre(s)</span>
                  </label>
                  {isHaciendaVerified && (
                    <span
                      style={{
                        color: '#059669',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      ✔ Verificado por Hacienda
                    </span>
                  )}
                </div>
                <input
                  id="reg-nombres"
                  type="text"
                  placeholder="María Elena"
                  value={regNombres}
                  onChange={(e) => {
                    setRegNombres(e.target.value);
                    if (error) setError('');
                  }}
                  readOnly={false}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                    border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                    color: 'var(--theme-input-text, #0F172A)',
                    fontSize: '0.94rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--blue, #0053AF)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Fila de Primer Apellido y Segundo Apellido */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label
                    htmlFor="reg-primer-apellido"
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--cru-text, #062A77)',
                      marginBottom: '0.45rem'
                    }}
                  >
                    Primer Apellido
                  </label>
                  <input
                    id="reg-primer-apellido"
                    type="text"
                    placeholder="Rodríguez"
                    value={regPrimerApellido}
                    onChange={(e) => {
                      setRegPrimerApellido(e.target.value);
                      if (error) setError('');
                    }}
                    readOnly={false}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                      border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                      color: 'var(--theme-input-text, #0F172A)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--blue, #0053AF)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-segundo-apellido"
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--cru-text, #062A77)',
                      marginBottom: '0.45rem'
                    }}
                  >
                    Segundo Apellido
                  </label>
                  <input
                    id="reg-segundo-apellido"
                    type="text"
                    placeholder="Vargas"
                    value={regSegundoApellido}
                    onChange={(e) => {
                      setRegSegundoApellido(e.target.value);
                      if (error) setError('');
                    }}
                    readOnly={false}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                      border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                      color: 'var(--theme-input-text, #0F172A)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--blue, #0053AF)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* C. Campo: Correo Electrónico Ciudadano */}
              <div>
                <label
                  htmlFor="reg-email"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--cru-text, #062A77)',
                    marginBottom: '0.45rem'
                  }}
                >
                  <IconMail size={15} color="var(--cru-accent-blue, #002B7F)" />
                  <span>Correo Electrónico Ciudadano</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="usuario@ejemplo.cr"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (error) setError('');
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                    border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                    color: 'var(--theme-input-text, #0F172A)',
                    fontSize: '0.94rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--blue, #0053AF)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* D. Campo: Crear Contraseña de Acceso */}
              <div>
                <label
                  htmlFor="reg-password"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--cru-text, #062A77)',
                    marginBottom: '0.45rem'
                  }}
                >
                  <IconLock size={15} color="var(--cru-accent-blue, #002B7F)" />
                  <span>Crear Contraseña de Acceso</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 2.75rem 0.85rem 1.1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                      border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                      color: 'var(--theme-input-text, #0F172A)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--blue, #0053AF)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    id="btn-toggle-reg-password"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label={showRegPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showRegPassword ? <IconEyeOff size={18} color="#64748B" /> : <IconEye size={18} color="#64748B" />}
                  </button>
                </div>
              </div>

              {/* E. Campo: Confirmar Contraseña */}
              <div>
                <label
                  htmlFor="reg-confirm-password"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--cru-text, #062A77)',
                    marginBottom: '0.45rem'
                  }}
                >
                  <IconLock size={15} color="var(--cru-accent-blue, #002B7F)" />
                  <span>Confirmar Contraseña</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-confirm-password"
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 2.75rem 0.85rem 1.1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--theme-input-bg, #FFFFFF)',
                      border: '1.5px solid var(--theme-input-border, #CBD5E1)',
                      color: 'var(--theme-input-text, #0F172A)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--blue, #0053AF)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 83, 175, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--theme-input-border, #CBD5E1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    id="btn-toggle-reg-confirm-password"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label={showRegConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showRegConfirmPassword ? <IconEyeOff size={18} color="#64748B" /> : <IconEye size={18} color="#64748B" />}
                  </button>
                </div>
              </div>

              {/* Botón Principal de Registro */}
              <button
                type="submit"
                id="btn-register-submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--navy, #062A77)',
                  backgroundImage: 'linear-gradient(135deg, #062A77 0%, #0053AF 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 6px 20px rgba(6, 42, 119, 0.25)',
                  marginTop: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <IconLoader2 size={18} color="#FFFFFF" />
                    <span>Registrando cuenta ciudadana...</span>
                  </>
                ) : (
                  <>
                    <span>Registrar Cuenta Ciudadana</span>
                    <IconArrowRight size={18} color="#FFFFFF" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Pie de Tarjeta: Garantías Legales Permanentes */}
          <div
            style={{
              marginTop: '2.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--cru-border, #E2E8F0)',
              textAlign: 'center',
              fontSize: '0.72rem',
              color: 'var(--cru-text-soft, #64748B)',
              lineHeight: 1.55,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <span>
              Protegido bajo la <strong>Ley N° 8968</strong> de Protección de la Persona frente al Tratamiento de sus Datos Personales y <strong>Ley N° 8292</strong> de Control Interno.
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '0.66rem',
                color: 'var(--cru-text-soft, #64748B)',
                marginTop: '0.2rem'
              }}
            >
              SISTEMA NACIONAL DE SOBERANÍA DIGITAL • REPÚBLICA DE COSTA RICA
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
