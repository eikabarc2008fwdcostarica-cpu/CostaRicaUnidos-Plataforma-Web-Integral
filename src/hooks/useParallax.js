import { useState, useEffect } from 'react';

/**
 * useParallax — Desplaza elementos del hero a distintas velocidades
 * relativas al scroll (sol: 0.25, montañas: 0.12, tucán: 0.08)
 * utilizando la propiedad CSS 'translate'.
 */
export function useParallax() {
  const [offsets, setOffsets] = useState({
    sun: 0,
    mountains: 0,
    toucan: 0,
    scrollY: 0,
  });

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, no aplicar parallax
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset || 0;
          // Limitar rango al hero (~900px)
          if (scrollY < 1200) {
            setOffsets({
              sun: Math.round(scrollY * 0.25),
              mountains: Math.round(scrollY * 0.12),
              toucan: Math.round(scrollY * 0.08),
              scrollY,
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return offsets;
}

export default useParallax;
