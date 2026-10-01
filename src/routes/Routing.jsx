import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes, { RoleRoute, AdminRoutes } from './PrivateRoutes';
import Inicio from '../pages/Inicio';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import MapaGIS from '../pages/MapaGIS';
import ReportarIncidencia from '../pages/ReportarIncidencia';
import SeguridadEmergencias from '../pages/SeguridadEmergencias';
import NotFound from '../pages/NotFound';
import Forbidden from '../pages/Forbidden';

// Módulos Funcionales — Alanie
import GobernanzaPage from '../pages/GobernanzaPage';
import CulturaPage from '../pages/CulturaPage';
import DeportesPage from '../pages/DeportesPage';
import EducacionPage from '../pages/EducacionPage';
import ComercioPage from '../pages/ComercioPage';
import FeriaPage from '../pages/FeriaPage';
import TurismoPage from '../pages/TurismoPage';
import ParticipacionPage from '../pages/ParticipacionPage';
import ItinerarioIAPage from '../pages/ItinerarioIAPage';

/**
 * Enrutador principal de la aplicación Costa Rica Unidos
 * Define las rutas públicas, las rutas privadas protegidas y la ruta comodín 404.
 */
export default function Routing() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas de Infraestructura Central */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<LoginPage initialMode="REGISTER" />} />
        <Route path="/registrarse" element={<LoginPage initialMode="REGISTER" />} />
        <Route path="/mapa-gis" element={<MapaGIS />} />
        <Route path="/territorio-3d" element={<MapaGIS />} />
        <Route path="/visor-3d" element={<MapaGIS />} />
        <Route path="/gis" element={<MapaGIS />} />
        <Route path="/reportar-incidencia" element={<ReportarIncidencia />} />
        <Route path="/reportes" element={<ReportarIncidencia />} />
        <Route path="/seguridad-emergencias" element={<SeguridadEmergencias />} />
        <Route path="/emergencias" element={<SeguridadEmergencias />} />
        <Route path="/sos" element={<SeguridadEmergencias />} />

        {/* Pantallas de Error Institucionales */}
        <Route path="/acceso-denegado" element={<Forbidden />} />
        <Route path="/403" element={<Forbidden />} />

        {/* Rutas Públicas Asignadas a Alanie */}
        <Route path="/gobernanza" element={<GobernanzaPage />} />
        <Route path="/cultura" element={<CulturaPage />} />
        <Route path="/deportes" element={<DeportesPage />} />
        <Route path="/educacion" element={<EducacionPage />} />
        <Route path="/comercio" element={<ComercioPage />} />
        <Route path="/feria-agricultor" element={<FeriaPage />} />
        <Route path="/feria" element={<FeriaPage />} />
        <Route path="/turismo" element={<TurismoPage />} />
        <Route path="/participacion" element={<ParticipacionPage />} />
        <Route path="/itinerario-ia" element={<ItinerarioIAPage />} />

        {/* Rutas Privadas Ciudadanas Protegidas (Nivel >= 2) */}
        <Route element={<RoleRoute minLevel={2} />}>
          <Route path="/participacion/votar" element={<ParticipacionPage />} />
          <Route path="/gobernanza/audiencia" element={<ParticipacionPage />} />
        </Route>

        {/* Rutas Privadas de Administración y Consola de Mando (Nivel >= 3) */}
        <Route element={<RoleRoute minLevel={3} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/gobernanza/municipalidad-dashboard" element={<GobernanzaPage />} />
        </Route>

        {/* Ruta Comodín 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

