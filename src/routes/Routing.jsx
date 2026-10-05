/**
 * ============================================================================
 * COSTA RICA UNIDOS — ENRUTADOR PRINCIPAL DEL SISTEMA (ROUTING v6 + RBAC)
 * Definición Oficial de Rutas Públicas, Protegidas y Gestión de Errores HTTP
 * ============================================================================
 * 
 * Matriz de Permisos por Rol:
 * 1. SUPER_ADMIN_NACIONAL: /admin/super, /admin/territorial, /dashboard, portales públicos.
 * 2. GESTOR_TERRITORIAL: /admin/territorial, /dashboard. Intento a /admin/super -> Error 403.
 * 3. CIUDADANO: /dashboard, /. Intento a /admin/territorial o /admin/super -> Error 403.
 * 4. No Autenticado: Intento a rutas privadas -> Redirección a /login.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoutes, { RoleRoute, ProtectedRoute, AdminRoutes } from './PrivateRoutes';
import Inicio from '../pages/Inicio';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MapaGIS from '../pages/MapaGIS';
import ReportarIncidencia from '../pages/ReportarIncidencia';
import SeguridadEmergencias from '../pages/SeguridadEmergencias';
import NotFound from '../pages/NotFound';
import AccessDenied from '../pages/AccessDenied';

// Módulos Funcionales
import GobernanzaPage from '../pages/GobernanzaPage';
import CulturaPage from '../pages/CulturaPage';
import DeportesPage from '../pages/DeportesPage';
import EducacionPage from '../pages/EducacionPage';
import ComercioPage from '../pages/ComercioPage';
import FeriaPage from '../pages/FeriaPage';
import TurismoPage from '../pages/TurismoPage';
import ParticipacionPage from '../pages/ParticipacionPage';
import ItinerarioIAPage from '../pages/ItinerarioIAPage';
import ProvincialAdminDashboard from '../pages/ProvincialAdminDashboard';
import ForoPage from '../pages/ForoPage';
import NoticiasPage from '../pages/NoticiasPage';
import PerfilPage from '../pages/PerfilPage';
import PortalCiudadanoPage from '../pages/PortalCiudadanoPage';
import UniversalVoiceGuide from '../components/voiceGuide/UniversalVoiceGuide';
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary';

import { useAuth } from '../context/AuthContext';
import { normalizarRolOficial, ROLES_SISTEMA } from '../config/roles';

// Alias para el Panel de Mando del Super Administrador Nacional
const SuperAdminDashboard = Dashboard;

function DashboardDispatcher() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const rol = (user.rol || "").toUpperCase();
  const nivel = user.nivelAcceso || 0;

  if (nivel === 5 || rol.includes("SUPER") || rol.includes("NACIONAL")) {
    return <Navigate to="/admin/super" replace />;
  }

  if (nivel === 4 || rol.includes("TERRITORIAL") || rol.includes("PROVINCIAL")) {
    return <Navigate to="/admin/territorial" replace />;
  }

  // Nivel 3 (Comerciante) y Nivel 2 (Ciudadano):
  return <Navigate to="/portal-ciudadano" replace />;
}

function AdminDispatcher() {
  const { user, isAuthenticated, usuarioActual } = useAuth();
  const activeUser = user || usuarioActual;

  if (!isAuthenticated || !activeUser) {
    return (
      <AccessDenied
        requiredRoles={["GESTOR_TERRITORIAL", "SUPER_ADMIN_NACIONAL"]}
        userRole="Visitante No Autenticado (Sin Sesión)"
      />
    );
  }

  const rolNormalizado = (activeUser.rol || "").toUpperCase();
  const nivel = Number(activeUser.nivelAcceso || 0);

  if (nivel === 5 || rolNormalizado.includes("SUPER") || rolNormalizado.includes("NACIONAL")) {
    return <Navigate to="/admin/super" replace />;
  }

  if (nivel === 4 || rolNormalizado.includes("TERRITORIAL") || rolNormalizado.includes("PROVINCIAL")) {
    return <Navigate to="/admin/territorial" replace />;
  }

  return (
    <AccessDenied
      requiredRoles={["GESTOR_TERRITORIAL", "SUPER_ADMIN_NACIONAL"]}
      userRole={activeUser.rol || `Nivel ${nivel}`}
    />
  );
}

/**
 * Enrutador principal de la aplicación Costa Rica Unidos
 */
export default function Routing() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas de Infraestructura Central */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/registro" element={<Login />} />
        <Route path="/registrarse" element={<Login />} />
        <Route path="/mapa-gis" element={<MapaGIS />} />
        <Route path="/territorio-3d" element={<MapaGIS />} />
        <Route path="/visor-3d" element={<MapaGIS />} />
        <Route path="/gis" element={<MapaGIS />} />
        <Route path="/reportar-incidencia" element={<ReportarIncidencia />} />
        <Route path="/reportes" element={<ReportarIncidencia />} />
        <Route path="/seguridad-emergencias" element={<SeguridadEmergencias />} />
        <Route path="/emergencias" element={<SeguridadEmergencias />} />
        <Route path="/sos" element={<SeguridadEmergencias />} />

        {/* Pantallas de Error Institucionales (Acceso Denegado / Prohibido) */}
        <Route path="/acceso-denegado" element={<AccessDenied />} />
        <Route path="/403" element={<AccessDenied />} />

        {/* Rutas Públicas de Servicios Ciudadanos */}
        <Route path="/gobernanza" element={<GobernanzaPage />} />
        <Route path="/cultura" element={<CulturaPage />} />
        <Route path="/deportes" element={<DeportesPage />} />
        <Route path="/educacion" element={<EducacionPage />} />
        <Route path="/feria-agricultor" element={<FeriaPage />} />
        <Route path="/feria" element={<FeriaPage />} />
        <Route path="/turismo" element={<GlobalErrorBoundary><TurismoPage /></GlobalErrorBoundary>} />
        <Route path="/participacion" element={<ParticipacionPage />} />
        <Route path="/participacion/foro" element={<ForoPage />} />
        <Route path="/foro" element={<ForoPage />} />
        <Route path="/foro-tico" element={<ForoPage />} />
        <Route path="/itinerario-ia" element={<ItinerarioIAPage />} />
        <Route path="/noticias" element={<NoticiasPage />} />
        <Route path="/comunicados" element={<NoticiasPage />} />
        <Route path="/noticias-municipales" element={<NoticiasPage />} />

        {/* Perfil Público (Ley N° 8968) */}
        <Route path="/perfil/:usuarioId" element={<PerfilPage />} />

        {/* Rutas Privadas Ciudadanas y de Comercio (Nivel 2 y Nivel 3) */}
        <Route element={<PrivateRoutes allowedRoles={[
          "CIUDADANO", 
          "COMERCIANTE", 
          "Comerciante y Emprendedor",
          "GESTOR_TERRITORIAL", 
          "SUPER_ADMIN_NACIONAL"
        ]} />}>
          <Route path="/portal-ciudadano" element={<PortalCiudadanoPage />} />
          <Route path="/portal" element={<Navigate to="/portal-ciudadano" replace />} />
          <Route path="/comercio" element={<ComercioPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/participacion/votar" element={<ParticipacionPage />} />
          <Route path="/gobernanza/audiencia" element={<ParticipacionPage />} />
        </Route>

        {/* Despachador de Consola Administrativa Central */}
        <Route element={<RoleRoute minLevel={4} rolesPermitidos={["GESTOR_TERRITORIAL", "SUPER_ADMIN_NACIONAL"]} />}>
          <Route path="/admin" element={<AdminDispatcher />} />
        </Route>
        <Route element={<RoleRoute minLevel={3} />}>
          <Route path="/gobernanza/municipalidad-dashboard" element={<GobernanzaPage />} />
        </Route>

        {/* 1. Ruta exclusiva Super Admin Nacional */}
        <Route element={<PrivateRoutes allowedRoles={["SUPER_ADMIN_NACIONAL"]} />}>
          <Route path="/admin/super" element={<SuperAdminDashboard />} />
        </Route>

        {/* 2. Ruta Gestor Territorial (accesible por Gestor y por Super Admin) */}
        <Route element={<PrivateRoutes allowedRoles={["GESTOR_TERRITORIAL", "SUPER_ADMIN_NACIONAL"]} />}>
          <Route path="/admin/territorial" element={<ProvincialAdminDashboard />} />
          <Route path="/admin/provincial" element={<ProvincialAdminDashboard />} />
        </Route>

        {/* 3. Despachador Inteligente de Dashboard segregado por rol */}
        <Route element={<PrivateRoutes allowedRoles={[
          "SUPER_ADMIN_NACIONAL",
          "GESTOR_TERRITORIAL",
          "COMERCIANTE",
          "Comerciante y Emprendedor",
          "CIUDADANO"
        ]} />}>
          <Route path="/dashboard" element={<DashboardDispatcher />} />
        </Route>

        {/* Ruta Comodín 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Asistente de Recorrido Contextual Universal con Gemini 3.6 Flash */}
      <UniversalVoiceGuide />
    </Router>
  );
}
