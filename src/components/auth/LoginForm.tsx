/**
 * ============================================================================
 * COSTA RICA UNIDOS — FORMULARIO DE AUTENTICACIÓN CÍVICA (3 ROLES)
 * Sistema de Login con validación Hacienda, bloqueo de campos y Sovereign Glass
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, CitizenMode, IdentityStatus } from '../../types/auth';
import { useAuth, MUNICIPALITIES_DIRECTORY, AUTHORIZED_SUPER_ADMIN_CEDULAS, MASTER_ADMIN_KEY } from '../../context/AuthContext';
import { validateCitizenIdentity } from '../../services/haciendaService';
import CivicButton from '../common/CivicButton';
import CivicCard from '../common/CivicCard';
import CivicBadge from '../common/CivicBadge';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError, clearError } = useAuth();

  // Rol activo seleccionado en el formulario
  const [selectedRole, setSelectedRole] = useState<UserRole>('CIUDADANO_TURISTA');

  // Modalidad para el rol Ciudadano/Turista
  const [citizenMode, setCitizenMode] = useState<CitizenMode>('CIUDADANO');

  // Paso 1: Cédula e Identidad
  const [cedula, setCedula] = useState<string>('');
  const [isValidatingHacienda, setIsValidatingHacienda] = useState<boolean>(false);
  const [haciendaVerified, setHaciendaVerified] = useState<boolean>(false);
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus | null>(null);
  const [haciendaMessage, setHaciendaMessage] = useState<string>('');

  // Nombres (bloqueados si provienen de Hacienda)
  const [nombre, setNombre] = useState<string>('');
  const [primerApellido, setPrimerApellido] = useState<string>('');
  const [segundoApellido, setSegundoApellido] = useState<string>('');

  // Paso 2: Credenciales de Contacto y Seguridad
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Paso 4: Específico de Rol
  // Administrador Provincial
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>(MUNICIPALITIES_DIRECTORY[0].id);
  const [municipalCode, setMunicipalCode] = useState<string>('');

  // Super Administrador Nacional
  const [masterPassword, setMasterPassword] = useState<string>('');

  // Estados de validación visual del formulario
  const [formError, setFormError] = useState<string | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState<boolean>(false);

  // Limpiar errores cuando cambia de rol
  useEffect(() => {
    clearError();
    setFormError(null);
  }, [selectedRole]);

  // Manejar validación contra API de Hacienda
  const handleValidateCedula = async () => {
    const clean = cedula.replace(/[^0-9]/g, '').trim();
    if (!clean || clean.length < 9) {
      setFormError('Ingrese una cédula física (9-10 dígitos) o DIMEX (11-12 dígitos) para consultar Hacienda.');
      return;
    }

    setIsValidatingHacienda(true);
    setFormError(null);

    try {
      const res = await validateCitizenIdentity(clean);

      if (res.success && !res.isFallback) {
        // Validación exitosa con Hacienda -> Rellenar y Bloquear campos
        setNombre(res.nombre);
        setPrimerApellido(res.primerApellido);
        setSegundoApellido(res.segundoApellido);
        setHaciendaVerified(true);
        setIdentityStatus('VERIFICADO_HACIENDA');
        setHaciendaMessage('✓ Identidad oficial verificada y certificada ante el Ministerio de Hacienda');
      } else {
        // Fallback contingente -> Permitir edición manual pero marcar como pendiente
        setHaciendaVerified(false);
        setIdentityStatus('PENDIENTE_VERIFICACION');
        setHaciendaMessage('⚠️ Identificación no encontrada en Hacienda. Ingrese sus datos en modo contingencia.');
      }
    } catch (_err) {
      setHaciendaVerified(false);
      setIdentityStatus('PENDIENTE_VERIFICACION');
      setHaciendaMessage('⚠️ Error de red con Hacienda. Ingrese sus datos en modo contingencia.');
    } finally {
      setIsValidatingHacienda(false);
    }
  };

  const handleCedulaBlur = () => {
    const clean = cedula.replace(/[^0-9]/g, '').trim();
    if (clean.length >= 9 && !haciendaVerified) {
      handleValidateCedula();
    }
  };

  // Enviar formulario de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const cleanCedula = cedula.replace(/[^0-9]/g, '').trim();

    if (!cleanCedula || cleanCedula.length < 9) {
      setFormError('La cédula debe tener al menos 9 dígitos numéricos.');
      return;
    }

    if (!nombre.trim()) {
      setFormError('El nombre es obligatorio. Valide su cédula con Hacienda o ingréselo manualmente.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    if (!password || password.length < 4) {
      setFormError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Validaciones de rol
    if (selectedRole === 'ADMIN_PROVINCIAL') {
      if (!municipalCode.trim()) {
        setFormError('Debe ingresar el Código / Contraseña Privada Institucional de la Municipalidad.');
        return;
      }
    }

    if (selectedRole === 'SUPER_ADMIN_NACIONAL') {
      if (!AUTHORIZED_SUPER_ADMIN_CEDULAS.includes(cleanCedula)) {
        setFormError('Acceso denegado: Esta cédula no pertenece a las 2 personas autorizadas para control nacional.');
        return;
      }
      if (!masterPassword.trim()) {
        setFormError('Debe ingresar la Clave Maestra Institucional.');
        return;
      }
    }

    // Ejecutar login
    const result = await login({
      cedula: cleanCedula,
      nombre,
      primerApellido,
      segundoApellido,
      email,
      password,
      role: selectedRole,
      citizenMode,
      municipalityId: selectedMunicipalityId,
      municipalCode,
      masterPassword
    });

    if (result.success) {
      // Redirección condicional según rol
      if (selectedRole === 'ADMIN_PROVINCIAL') {
        navigate('/gobernanza');
      } else if (selectedRole === 'SUPER_ADMIN_NACIONAL') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else if (result.message) {
      setFormError(result.message);
    }
  };

  // Helper para rellenar credenciales demo instantáneas
  const loadDemoProfile = (
    demoRole: UserRole,
    demoCedula: string,
    demoMode: CitizenMode = 'CIUDADANO',
    demoMuniId = 'muni-sanjose',
    demoMuniCode = 'MSJ-2026-SEC',
    demoMasterKey = MASTER_ADMIN_KEY
  ) => {
    setSelectedRole(demoRole);
    setCitizenMode(demoMode);
    setCedula(demoCedula);
    setEmail(`${demoCedula}@costaricaunidos.cr`);
    setPassword('PuraVida2026*');
    setSelectedMunicipalityId(demoMuniId);
    setMunicipalCode(demoMuniCode);
    setMasterPassword(demoMasterKey);
    setFormError(null);
    clearError();

    // Trigger de validación con Hacienda para el demo
    setTimeout(async () => {
      const res = await validateCitizenIdentity(demoCedula);
      if (res.success) {
        setNombre(res.nombre);
        setPrimerApellido(res.primerApellido);
        setSegundoApellido(res.segundoApellido);
        setHaciendaVerified(true);
        setIdentityStatus('VERIFICADO_HACIENDA');
        setHaciendaMessage('✓ Identidad oficial verificada ante el Ministerio de Hacienda');
      }
    }, 50);
  };

  return (
    <CivicCard
      level={2}
      provincialGlow={true}
      style={{
        width: '100%',
        maxWidth: '540px',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 24px 60px rgba(0, 4, 13, 0.85), 0 0 30px rgba(0, 43, 127, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.16)'
      }}
    >
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <CivicBadge variant="accent" style={{ marginBottom: '0.8rem' }}>
          SOBERANÍA E IDENTIDAD DIGITAL COSTA RICA
        </CivicBadge>

        <h1
          style={{
            fontFamily: 'var(--font-heading, "Mistical Spring", serif)',
            fontSize: '2rem',
            color: '#FFFFFF',
            margin: '0.3rem 0 0.5rem',
            letterSpacing: '0.5px'
          }}
        >
          Acceso Soberano
        </h1>

        <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.9rem', margin: 0 }}>
          Autenticación oficial respaldada por la API del Ministerio de Hacienda
        </p>
      </div>

      {/* Selector de los 3 Roles Exclusivos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          background: 'rgba(0, 4, 13, 0.85)',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '1.8rem'
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedRole('CIUDADANO_TURISTA')}
          style={{
            padding: '10px 4px',
            borderRadius: '8px',
            border: 'none',
            background:
              selectedRole === 'CIUDADANO_TURISTA'
                ? 'linear-gradient(135deg, #002B7F 0%, #0A3282 100%)'
                : 'transparent',
            color: selectedRole === 'CIUDADANO_TURISTA' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🇨🇷</span>
          <span>Ciudadano / Turista</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('ADMIN_PROVINCIAL')}
          style={{
            padding: '10px 4px',
            borderRadius: '8px',
            border: 'none',
            background:
              selectedRole === 'ADMIN_PROVINCIAL'
                ? 'linear-gradient(135deg, #FFC700 0%, #D61B23 100%)'
                : 'transparent',
            color: selectedRole === 'ADMIN_PROVINCIAL' ? '#181818' : 'rgba(255, 255, 255, 0.65)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🏛️</span>
          <span>Admin Provincial</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('SUPER_ADMIN_NACIONAL')}
          style={{
            padding: '10px 4px',
            borderRadius: '8px',
            border: 'none',
            background:
              selectedRole === 'SUPER_ADMIN_NACIONAL'
                ? 'linear-gradient(135deg, #CE1126 0%, #850A18 100%)'
                : 'transparent',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🛡️</span>
          <span>Super Admin</span>
        </button>
      </div>

      {/* Banner de Rol Activo */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor:
            selectedRole === 'CIUDADANO_TURISTA'
              ? 'rgba(0, 43, 127, 0.25)'
              : selectedRole === 'ADMIN_PROVINCIAL'
              ? 'rgba(255, 199, 0, 0.15)'
              : 'rgba(206, 17, 38, 0.2)',
          borderLeft: `4px solid ${
            selectedRole === 'CIUDADANO_TURISTA'
              ? '#002B7F'
              : selectedRole === 'ADMIN_PROVINCIAL'
              ? '#FFC700'
              : '#CE1126'
          }`
        }}
      >
        <span>
          {selectedRole === 'CIUDADANO_TURISTA' && '👤 Perfil Ciudadano de Persona Física: Votaciones, trámites, mapas y consultas cívicas.'}
          {selectedRole === 'ADMIN_PROVINCIAL' && '🏛️ Gobierno Local: Publicaciones institucionales, moderación cantonal y gestión municipal.'}
          {selectedRole === 'SUPER_ADMIN_NACIONAL' && '🛡️ Control Total Nacional: Gestión exclusiva para las 2 identidades acreditadas de la plataforma.'}
        </span>
      </div>

      {/* Mensajes de Error */}
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
          <span>⛔</span>
          <span>{formError || authError}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* PASO 1: Cédula de Identidad con Validación de Hacienda */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label
              htmlFor="cedula-input"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              1. Cédula de Identidad / DIMEX
            </label>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', fontFamily: 'JetBrains Mono, monospace' }}>
              9 a 12 dígitos
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="cedula-input"
              type="text"
              placeholder="Ej: 1-1888-0999 ó 118880999"
              value={cedula}
              onChange={(e) => {
                setCedula(e.target.value);
                setHaciendaVerified(false);
                setIdentityStatus(null);
              }}
              onBlur={handleCedulaBlur}
              disabled={isValidatingHacienda}
              style={{
                flex: 1,
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 4, 13, 0.75)',
                border: haciendaVerified
                  ? '1px solid #00D084'
                  : identityStatus === 'PENDIENTE_VERIFICACION'
                  ? '1px solid #FFC700'
                  : '1px solid rgba(255, 255, 255, 0.22)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontFamily: 'JetBrains Mono, monospace',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />

            <CivicButton
              type="button"
              variant="secondary"
              onClick={handleValidateCedula}
              disabled={isValidatingHacienda || !cedula.trim()}
              isLoading={isValidatingHacienda}
              style={{ minWidth: '130px', height: '46px', fontSize: '0.82rem' }}
            >
              {isValidatingHacienda ? 'Consultando...' : '🔍 Validar Cédula'}
            </CivicButton>
          </div>

          {/* Estado de Verificación con Hacienda */}
          {haciendaMessage && (
            <div
              style={{
                marginTop: '0.5rem',
                fontSize: '0.78rem',
                color: haciendaVerified ? '#00D084' : '#FFC700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{haciendaMessage}</span>
            </div>
          )}
        </div>

        {/* Campos de Nombre Autocompletados y Bloqueados (UX Candado) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Nombre(s)
              </label>
              {haciendaVerified && (
                <span style={{ fontSize: '0.75rem', color: '#00D084', fontWeight: 600 }}>
                  🔒 Protegido por Hacienda
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Nombre oficial"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              readOnly={haciendaVerified}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: haciendaVerified ? 'rgba(0, 43, 127, 0.25)' : 'rgba(0, 4, 13, 0.75)',
                border: haciendaVerified ? '1px solid rgba(0, 208, 132, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: haciendaVerified ? 'not-allowed' : 'text'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.3rem' }}>
              Primer Apellido
            </label>
            <input
              type="text"
              placeholder="Primer Apellido"
              value={primerApellido}
              onChange={(e) => setPrimerApellido(e.target.value)}
              readOnly={haciendaVerified}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: haciendaVerified ? 'rgba(0, 43, 127, 0.25)' : 'rgba(0, 4, 13, 0.75)',
                border: haciendaVerified ? '1px solid rgba(0, 208, 132, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: haciendaVerified ? 'not-allowed' : 'text'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.3rem' }}>
              Segundo Apellido
            </label>
            <input
              type="text"
              placeholder="Segundo Apellido"
              value={segundoApellido}
              onChange={(e) => setSegundoApellido(e.target.value)}
              readOnly={haciendaVerified}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: haciendaVerified ? 'rgba(0, 43, 127, 0.25)' : 'rgba(0, 4, 13, 0.75)',
                border: haciendaVerified ? '1px solid rgba(0, 208, 132, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: haciendaVerified ? 'not-allowed' : 'text'
              }}
            />
          </div>
        </div>

        {/* PASO 2: Correo Electrónico */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="email-input"
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0.4rem'
            }}
          >
            2. Correo Electrónico
          </label>
          <input
            id="email-input"
            type="email"
            placeholder="usuario@costaricaunidos.cr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 4, 13, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* PASO 3: Contraseña */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label
              htmlFor="password-input"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              3. Contraseña
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 4, 13, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* PASO 4: CAMPOS ESPECÍFICOS SEGÚN EL ROL */}

        {/* ROL 1: CIUDADANO / TURISTA */}
        {selectedRole === 'CIUDADANO_TURISTA' && (
          <div
            style={{
              padding: '1.1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 20, 137, 0.35)',
              border: '1px solid rgba(0, 43, 127, 0.6)',
              marginBottom: '1.5rem'
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '0.6rem'
              }}
            >
              4. Modalidad de Ingreso:
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCitizenMode('CIUDADANO')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: citizenMode === 'CIUDADANO' ? '#002B7F' : 'rgba(0, 4, 13, 0.6)',
                  color: '#FFFFFF',
                  fontWeight: citizenMode === 'CIUDADANO' ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>🇨🇷</span>
                <span>Ciudadano Residente</span>
              </button>

              <button
                type="button"
                onClick={() => setCitizenMode('TURISTA')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: citizenMode === 'TURISTA' ? '#007A3D' : 'rgba(0, 4, 13, 0.6)',
                  color: '#FFFFFF',
                  fontWeight: citizenMode === 'TURISTA' ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>🌍</span>
                <span>Turista / Visitante</span>
              </button>
            </div>

            <p style={{ margin: '0.5rem 0 0', fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              {citizenMode === 'CIUDADANO'
                ? 'Habilita participación vecinal, presupuestos participativos (M11) y trámites cantonales.'
                : 'Habilita rutas de turismo cantonal accesible (M09), gastronomía e itinerarios IA (M12.2).'}
            </p>
          </div>
        )}

        {/* ROL 2: ADMINISTRADOR PROVINCIAL */}
        {selectedRole === 'ADMIN_PROVINCIAL' && (
          <div
            style={{
              padding: '1.1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 199, 0, 0.1)',
              border: '1px solid rgba(255, 199, 0, 0.4)',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="muni-select"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#FFC700',
                  marginBottom: '0.4rem'
                }}
              >
                4.1. Municipalidad Asignada
              </label>
              <select
                id="muni-select"
                value={selectedMunicipalityId}
                onChange={(e) => setSelectedMunicipalityId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 4, 13, 0.85)',
                  border: '1px solid rgba(255, 199, 0, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {MUNICIPALITIES_DIRECTORY.map((muni) => (
                  <option key={muni.id} value={muni.id} style={{ background: '#00040D', color: '#FFF' }}>
                    {muni.nombre} ({muni.provincia})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label
                  htmlFor="municipal-code-input"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#FFC700'
                  }}
                >
                  4.2. Código / Contraseña Privada Municipal
                </label>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Ej: MSJ-2026-SEC
                </span>
              </div>
              <input
                id="municipal-code-input"
                type="password"
                placeholder="Código Institucional de Seguridad"
                value={municipalCode}
                onChange={(e) => setMunicipalCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 4, 13, 0.85)',
                  border: '1px solid rgba(255, 199, 0, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  outline: 'none'
                }}
              />
            </div>

            <p style={{ margin: '0.6rem 0 0', fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              ℹ️ Redirección obligatoria: Al autenticarse, será dirigido directamente al panel de gestión de su municipalidad.
            </p>
          </div>
        )}

        {/* ROL 3: SUPER ADMINISTRADOR NACIONAL */}
        {selectedRole === 'SUPER_ADMIN_NACIONAL' && (
          <div
            style={{
              padding: '1.1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(206, 17, 38, 0.15)',
              border: '1px solid rgba(206, 17, 38, 0.5)',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.76rem', color: '#FF8A8A', fontWeight: 700, display: 'block' }}>
                ⚠️ ACREDITACIÓN RESTRINGIDA A 2 PERSONAS NACIONALES
              </span>
              <p style={{ margin: '0.2rem 0 0.6rem', fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Cédulas autorizadas: 118880999 (Alanie) ó 207770888 (Eiker).
              </p>
            </div>

            <div>
              <label
                htmlFor="master-password-input"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#FF8A8A',
                  marginBottom: '0.4rem'
                }}
              >
                4. Clave Maestra Institucional
              </label>
              <input
                id="master-password-input"
                type="password"
                placeholder="Clave de Control Maestro Nacional"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 4, 13, 0.85)',
                  border: '1px solid rgba(206, 17, 38, 0.5)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontFamily: 'JetBrains Mono, monospace',
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
            selectedRole === 'ADMIN_PROVINCIAL'
              ? 'warning'
              : selectedRole === 'SUPER_ADMIN_NACIONAL'
              ? 'danger'
              : 'primary'
          }
          isLoading={isLoading}
          style={{ width: '100%', height: '52px', fontSize: '1rem', fontWeight: 700 }}
        >
          {selectedRole === 'CIUDADANO_TURISTA' && `Ingresar como ${citizenMode === 'CIUDADANO' ? 'Ciudadano' : 'Turista'}`}
          {selectedRole === 'ADMIN_PROVINCIAL' && 'Ingresar a Panel Municipal'}
          {selectedRole === 'SUPER_ADMIN_NACIONAL' && 'Ingresar con Mando Nacional'}
        </CivicButton>
      </form>

      {/* Credenciales de Prueba para Evaluadores */}
      <div style={{ marginTop: '1.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
        <button
          type="button"
          onClick={() => setShowDemoCredentials(!showDemoCredentials)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%'
          }}
        >
          <span>{showDemoCredentials ? '▲ Ocultar Credenciales de Demostración' : '▼ Cargar Credenciales de Prueba Rápida'}</span>
        </button>

        {showDemoCredentials && (
          <div
            style={{
              marginTop: '0.8rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px'
            }}
          >
            <button
              type="button"
              onClick={() => loadDemoProfile('CIUDADANO_TURISTA', '118880999', 'CIUDADANO')}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 43, 127, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFF',
                fontSize: '0.72rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🇨🇷 Ciudadano: 118880999
            </button>

            <button
              type="button"
              onClick={() => loadDemoProfile('CIUDADANO_TURISTA', '123456789012', 'TURISTA')}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 122, 61, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFF',
                fontSize: '0.72rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🌍 Turista DIMEX: 123456789012
            </button>

            <button
              type="button"
              onClick={() => loadDemoProfile('ADMIN_PROVINCIAL', '101110222', 'CIUDADANO', 'muni-sanjose', 'MSJ-2026-SEC')}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 199, 0, 0.2)',
                border: '1px solid rgba(255, 199, 0, 0.4)',
                color: '#FFC700',
                fontSize: '0.72rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🏛️ Admin San José: 101110222
            </button>

            <button
              type="button"
              onClick={() => loadDemoProfile('SUPER_ADMIN_NACIONAL', '207770888', 'CIUDADANO', 'muni-sanjose', '', 'CRU-MASTER-2026')}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(206, 17, 38, 0.25)',
                border: '1px solid rgba(206, 17, 38, 0.4)',
                color: '#FF8A8A',
                fontSize: '0.72rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🛡️ Super Admin: 207770888
            </button>
          </div>
        )}
      </div>
    </CivicCard>
  );
}
