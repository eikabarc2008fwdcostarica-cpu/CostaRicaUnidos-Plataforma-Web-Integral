import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const THEME_STORAGE_KEY = 'cr_theme_preference';
const LEGACY_STORAGE_KEY = 'theme';

/**
 * Obtiene el tema inicial de forma unificada:
 * 1. Preferencia guardada en 'cr_theme_preference'
 * 2. Migración de llave legacy 'theme' (se migra y elimina)
 * 3. Preferencia del sistema operativo (prefers-color-scheme)
 * 4. Valor por defecto canónico: 'dark'
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Migración de llave antigua
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === 'light' || legacy === 'dark') {
      localStorage.setItem(THEME_STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return legacy;
    }
    // Preferencia del sistema operativo
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch (_e) {
    // Entorno sin acceso a localStorage (p. ej. iframe privado)
  }
  return 'dark';
}

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const isFirstMount = useRef(true);

  // Sincronización del tema en el elemento raíz (<html>) y persistencia
  useEffect(() => {
    const root = document.documentElement;

    if (!isFirstMount.current) {
      // Cambio interactivo: activar transición suave temporal (≈200 ms)
      root.classList.add('theme-transition');
      const timer = window.setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 200);

      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (_e) {}

      return () => {
        window.clearTimeout(timer);
        root.classList.remove('theme-transition');
      };
    } else {
      // Primer render: sincronización inmediata anti-flash (sin animación)
      isFirstMount.current = false;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (_e) {}
    }
  }, [theme]);

  // Escucha cambios del sistema operativo solo si el usuario no tiene preferencia explícita guardada
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      try {
        const hasSavedPref = localStorage.getItem(THEME_STORAGE_KEY);
        if (!hasSavedPref) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      } catch (_e) {}
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un <ThemeProvider>');
  }
  return context;
}

export default ThemeContext;
