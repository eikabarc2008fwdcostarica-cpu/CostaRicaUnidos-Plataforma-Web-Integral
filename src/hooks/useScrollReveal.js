import { useEffect } from 'react';

/**
 * useScrollReveal — Animación suave de entrada institucional (0.9s, blur 14px a 0, translateY 34px a 0)
 * con retraso escalonado (i % 4) * 0.1s e IntersectionObserver (threshold 0.12).
 * Se activa una sola vez.
 */
export function useScrollReveal(selector = '.reveal-on-scroll', threshold = 0.12) {
  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, mostrar todo inmediatamente
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    // Asignar clases de desfase escalonado si no tienen
    elements.forEach((el, index) => {
      const delayIndex = index % 4;
      el.classList.add(`reveal-delay-${delayIndex}`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [selector, threshold]);
}

export default useScrollReveal;
