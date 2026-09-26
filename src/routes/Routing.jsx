import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import Inicio from '../pages/Inicio';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MapaGIS from '../pages/MapaGIS';
import NotFound from '../pages/NotFound';

/**
 * Enrutador principal de la aplicación Costa Rica Unidos
 * Define las rutas públicas, las rutas privadas protegidas y la ruta comodín 404.
 */
export default function Routing() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mapa-gis" element={<MapaGIS />} />
        <Route path="/gis" element={<MapaGIS />} />

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
