import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import Inicio from '../pages/Inicio';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MapaGIS from '../pages/MapaGIS';
import ReportarIncidencia from '../pages/ReportarIncidencia';
import SeguridadEmergencias from '../pages/SeguridadEmergencias';
import NotFound from '../pages/NotFound';

// Módulos Funcionales — Alanie
import GobernanzaPage from '../pages/GobernanzaPage';
import CulturaPage from '../pages/CulturaPage';

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
        <Route path="/login" element={<Login />} />
        <Route path="/mapa-gis" element={<MapaGIS />} />
        <Route path="/territorio-3d" element={<MapaGIS />} />
        <Route path="/visor-3d" element={<MapaGIS />} />
        <Route path="/gis" element={<MapaGIS />} />
        <Route path="/reportar-incidencia" element={<ReportarIncidencia />} />
        <Route path="/reportes" element={<ReportarIncidencia />} />
        <Route path="/seguridad-emergencias" element={<SeguridadEmergencias />} />
        <Route path="/emergencias" element={<SeguridadEmergencias />} />
        <Route path="/sos" element={<SeguridadEmergencias />} />

        {/* Rutas Públicas Asignadas a Alanie */}
        <Route path="/gobernanza" element={<GobernanzaPage />} />
        <Route path="/cultura" element={<CulturaPage />} />

        {/* Rutas Privadas Protegidas */}
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Ruta Comodín 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

