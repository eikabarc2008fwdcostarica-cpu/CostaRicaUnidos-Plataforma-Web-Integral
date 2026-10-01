import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LOCALES } from '../i18n/locales';

export const DICCIONARIO = LOCALES;

const BANDERAS_MAP = {
  'es-CR': 'CR',
  'es-ES': 'ES',
  en: 'US',
  zh: 'CN',
  pt: 'BR',
  fr: 'FR',
  ru: 'RU',
  ja: 'JP'
};

const CODE_MAP = {
  CR: 'es-CR',
  ES: 'es-ES',
  US: 'en',
  CN: 'zh',
  BR: 'pt',
  FR: 'fr',
  RU: 'ru',
  JP: 'ja'
};

export function normalizeToBandera(input) {
  if (!input) return 'CR';
  const clean = input.trim();
  const upper = clean.toUpperCase();
  if (CODE_MAP[upper]) return upper;

  const lower = clean.toLowerCase();
  if (lower === 'cr' || lower === 'es-cr' || lower === 'es' || lower === 'es-419') return 'CR';
  if (lower === 'es-es') return 'ES';
  if (lower === 'us' || lower === 'en' || lower === 'en-us' || lower === 'en-gb') return 'US';
  if (lower === 'cn' || lower === 'zh' || lower === 'zh-cn' || lower === 'zh-tw') return 'CN';
  if (lower === 'br' || lower === 'pt' || lower === 'pt-br' || lower === 'pt-pt') return 'BR';
  if (lower === 'fr' || lower === 'fr-fr') return 'FR';
  if (lower === 'ru' || lower === 'ru-ru') return 'RU';
  if (lower === 'jp' || lower === 'ja' || lower === 'ja-jp') return 'JP';

  return 'CR';
}

export function normalizeToCode(input) {
  const bandera = normalizeToBandera(input);
  return CODE_MAP[bandera] || 'es-CR';
}

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [bandera, setBandera] = useState(() => {
    try {
      const saved =
        localStorage.getItem('app_language') ||
        localStorage.getItem('idioma_preferido') ||
        'CR';
      return normalizeToBandera(saved);
    } catch {
      return 'CR';
    }
  });

  const langCode = CODE_MAP[bandera] || 'es-CR';

  const cambiarIdioma = useCallback((nuevoIdioma) => {
    const b = normalizeToBandera(nuevoIdioma);
    const c = CODE_MAP[b] || 'es-CR';
    setBandera(b);
    try {
      localStorage.setItem('app_language', c);
      localStorage.setItem('idioma_preferido', b);
      document.documentElement.lang = c;
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { code: c, bandera: b } }));
    } catch (e) {
      console.warn('[LanguageContext] No se pudo guardar idioma:', e);
    }
  }, []);

  const setLanguage = cambiarIdioma;
  const changeLanguage = cambiarIdioma;

  // Sincronizar en montaje con document.documentElement y escuchar eventos
  useEffect(() => {
    try {
      document.documentElement.lang = langCode;
    } catch {
      // Ignorar en SSR
    }

    const handleLanguageChanged = (e) => {
      if (e.detail?.bandera) {
        setBandera(e.detail.bandera);
      } else if (e.detail?.code) {
        setBandera(normalizeToBandera(e.detail.code));
      }
    };

    const handleStorage = (e) => {
      if ((e.key === 'app_language' || e.key === 'idioma_preferido') && e.newValue) {
        setBandera(normalizeToBandera(e.newValue));
      }
    };

    window.addEventListener('languageChanged', handleLanguageChanged);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, [langCode]);

  const t = useCallback(
    (clave, fallback) => {
      const dict = LOCALES[bandera] || LOCALES[langCode] || LOCALES['es-CR'];
      if (dict && dict[clave] !== undefined) {
        return dict[clave];
      }
      const fallbackDict = LOCALES['es-CR'];
      if (fallbackDict && fallbackDict[clave] !== undefined) {
        return fallbackDict[clave];
      }
      return fallback !== undefined ? fallback : clave;
    },
    [bandera, langCode]
  );

  return (
    <LanguageContext.Provider
      value={{
        idioma: bandera,
        language: langCode,
        langCode,
        activeBandera: bandera,
        activeLangCode: langCode,
        cambiarIdioma,
        setLanguage,
        changeLanguage,
        t,
        DICCIONARIO: LOCALES,
        LOCALES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      idioma: 'CR',
      language: 'es-CR',
      langCode: 'es-CR',
      activeBandera: 'CR',
      activeLangCode: 'es-CR',
      cambiarIdioma: () => {},
      setLanguage: () => {},
      changeLanguage: () => {},
      t: (clave, fallback) => LOCALES['es-CR']?.[clave] || fallback || clave,
      DICCIONARIO: LOCALES,
      LOCALES
    };
  }
  return context;
}
