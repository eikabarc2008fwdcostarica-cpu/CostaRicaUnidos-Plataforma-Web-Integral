import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroMunicipal from '../components/home/HeroMunicipal';
import SearchCard from '../components/home/SearchCard';
import NewsSection from '../components/home/NewsSection';
import ServicesSection from '../components/home/ServicesSection';
import StatsBar from '../components/home/StatsBar';
import FaqAccordion from '../components/home/FaqAccordion';
import CartRoad from '../components/decorative/CartRoad';
import TransparencyBlock from '../components/home/TransparencyBlock';
import MunicipalFooter from '../components/navigation/MunicipalFooter';
import VineFrame from '../components/decorative/VineFrame';
import ProvinciasSection from '../components/provincias/ProvinciasSection';
import useScrollReveal from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

/**
 * INICIO — Portal Oficial de Gobierno Local y Servicios Ciudadanos
 * Identidad institucional limpia (inspirada en escazu.go.cr)
 * fusionada con la riqueza natural y cívica de Costa Rica.
 */
export default function Inicio() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Activar Scroll Reveal (Fade-In & Blur, 0.9s, threshold 0.12, retraso escalonado)
  useScrollReveal('.reveal-on-scroll', 0.12);

  // Escuchar cambios de cantón emitidos globalmente
  const [activeCantonName, setActiveCantonName] = useState(() => {
    try {
      return localStorage.getItem('cr_canton_activo') || 'Puntarenas';
    } catch {
      return 'Puntarenas';
    }
  });

  useEffect(() => {
    const handleCantonChange = (e) => {
      if (e.detail?.nombre) {
        setActiveCantonName(e.detail.nombre);
      }
    };
    window.addEventListener('cantonChanged', handleCantonChange);
    return () => window.removeEventListener('cantonChanged', handleCantonChange);
  }, []);

  return (
    <div
      className="costa-rica-unidos-portal"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--white, #FDFDFF)',
        color: 'var(--ink, #131313)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: 'var(--font-main, "Poppins", sans-serif)'
      }}
    >
      {/* Marco de Enredaderas y Guarias Moradas en los bordes */}
      <VineFrame />

      {/* 1. Header Blanco con Topbar Institucional y Menús */}
      <Navbar />

      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {/* 2. Hero a Ancho Completo (Escena SVG con Sol, Montañas, Pinos, Nubes, Hojas, Tucán y Lapa) */}
        <HeroMunicipal />

        {/* 3. Tarjeta Flotante sobre el Hero: Buscador Grande + "Pagos en línea" y "Consulta o queja" */}
        <SearchCard />

        {/* 4. "La Muni informa": Pestañas Avisos / Noticias / Eventos y Carrusel de Tarjetas */}
        <NewsSection />

        {/* 5. "Trámites y servicios": Cuadrícula de 8 Tarjetas de Colores Redondeadas con Brote */}
        <ServicesSection />

        {/* 6. Franja de Cifras (7 Provincias, 84 Cantones, 492 Distritos sobre fondo crema con plantas) */}
        <StatsBar />

        {/* 7. Preguntas Frecuentes en Acordeón con Rueda de Carreta Faint Giratoria en el Fondo */}
        <FaqAccordion />

        {/* 8. Módulo Territorial Modular de las 7 Provincias de Costa Rica */}
        <div className="reveal-on-scroll" style={{ maxWidth: '1240px', margin: '0 auto 4rem', padding: '0 1.5rem', width: '100%', boxSizing: 'border-box' }}>
          <ProvinciasSection />
        </div>

        {/* 9. Franja del Camino: Carreta Típica Costarricense Cruzando en Bucle con Rueda Mandala */}
        <CartRoad />

        {/* 10. Bloque de Transparencia (Leyes N° 8968 y N° 7600) */}
        <TransparencyBlock />
      </main>

      {/* 11. Footer Azul Noche con Silueta de Pinos en Borde Superior, 4 Columnas y Línea Tricolor */}
      <MunicipalFooter />
    </div>
  );
}
