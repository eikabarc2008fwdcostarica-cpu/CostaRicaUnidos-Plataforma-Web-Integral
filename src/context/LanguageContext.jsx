import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  DICCIONARIO_MAESTRO,
  PALABRAS_CLAVE_ATOMICAS,
  DICCIONARIO_COMPLETO
} from "../i18n/diccionarioCompleto";

export { DICCIONARIO_MAESTRO, PALABRAS_CLAVE_ATOMICAS, DICCIONARIO_COMPLETO };
export const DICCIONARIO_CIVICO = DICCIONARIO_COMPLETO;
export const DICCIONARIO = DICCIONARIO_COMPLETO;

// ============================================================================
// HELPER OFICIAL: IDENTIFICACIÓN DE VARIANTES DEL ESPAÑOL BASE
// Devuelve true para es-latam, es-419, es, es-CR, es-ES, es-es, CR y ES
// ============================================================================
export const esEspanolBase = (code) => {
  if (!code) return false;
  const c = String(code).trim();
  const lower = c.toLowerCase();
  return (
    c === "es-latam" ||
    c === "es-419" ||
    c === "es" ||
    c === "es-CR" ||
    c === "es-ES" ||
    c === "es-es" ||
    c === "CR" ||
    c === "ES" ||
    lower === "es-latam" ||
    lower === "es-419" ||
    lower === "es" ||
    lower === "es-cr" ||
    lower === "es-es" ||
    lower === "cr"
  );
};

export const esEspanolEspana = (code) => {
  if (!code) return false;
  const c = String(code).trim();
  return c === "es-ES" || c === "es-es" || c === "ES" || c.toLowerCase() === "es-es";
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [idioma, setIdioma] = useState(() => {
    try {
      return (
        localStorage.getItem("cru_idioma_activo") ||
        localStorage.getItem("cru_bcp47_lang") ||
        localStorage.getItem("app_language") ||
        "es-latam"
      );
    } catch {
      return "es-latam";
    }
  });

  const cambiarIdioma = (codigoIdioma) => {
    setIdioma(codigoIdioma);
    try {
      localStorage.setItem("cru_idioma_activo", codigoIdioma);
      localStorage.setItem("cru_bcp47_lang", codigoIdioma);
      localStorage.setItem("app_language", codigoIdioma);
      document.documentElement.lang = codigoIdioma;
      window.dispatchEvent(
        new CustomEvent("cru_idioma_cambiado", { detail: { code: codigoIdioma } })
      );
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: { code: codigoIdioma, lang: codigoIdioma } })
      );
    } catch (e) {
      console.warn("No se pudo persistir idioma en localStorage");
    }
  };

  // Función síncrona en memoria pura (0ms)
  const t = (textoOriginal, fallback) => {
    if (!textoOriginal && !fallback) return "";
    if (esEspanolBase(idioma)) {
      return fallback !== undefined ? fallback : textoOriginal;
    }
    const dict =
      DICCIONARIO_COMPLETO[idioma] ||
      DICCIONARIO_MAESTRO[idioma] ||
      DICCIONARIO_COMPLETO[idioma?.toLowerCase()] ||
      {};

    if (dict[textoOriginal] !== undefined) {
      return dict[textoOriginal];
    }
    if (fallback && dict[fallback] !== undefined) {
      return dict[fallback];
    }
    return fallback !== undefined ? fallback : textoOriginal;
  };

  // ==========================================================================
  // MOTOR UNIVERSAL DE TRADUCCIÓN POR NODOS DOM (Dos Capas: Frases + Léxico)
  // Recorre el 100% de los nodos de texto en el árbol DOM y atributos clave
  // ==========================================================================
  useEffect(() => {
    // Función central de restauración segura al español base
    const restaurarEspanol = () => {
      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;
              const tag = node.parentElement.tagName.toLowerCase();
              if (
                tag === "script" ||
                tag === "style" ||
                tag === "noscript" ||
                tag === "svg" ||
                tag === "path"
              ) {
                return NodeFilter.FILTER_REJECT;
              }
              const val = node.nodeValue;
              if (!val || !val.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          },
          false
        );

        let n = walker.nextNode();
        while (n) {
          const val = n.nodeValue;

          // Requisito 4: Solo restaurar los nodos que el motor modificó (__cru_written).
          // Si React escribió un nuevo valor (val !== __cru_written && val !== __cru_original),
          // no lo pisamos y sincronizamos el original.
          if (n.__cru_written !== undefined && val === n.__cru_written) {
            if (n.__cru_original !== undefined) {
              n.nodeValue = n.__cru_original;
            }
            n.__cru_written = undefined;
          } else if (
            n.__cru_original !== undefined &&
            val !== n.__cru_original &&
            val !== n.__cru_written
          ) {
            // React escribió un nuevo valor en español; actualizamos __cru_original y __cru_trimmed
            n.__cru_original = val;
            n.__cru_trimmed = val.trim();
            n.__cru_written = undefined;
          } else if (n.__cru_original === undefined) {
            n.__cru_original = val;
            n.__cru_trimmed = val.trim();
            n.__cru_written = undefined;
          } else {
            n.__cru_written = undefined;
          }

          n = walker.nextNode();
        }

        // Requisito 5: Restaurar placeholders sin pisar los que escribió React
        const inputs = document.querySelectorAll(
          "input[placeholder], textarea[placeholder], [data-original-ph]"
        );
        inputs.forEach((el) => {
          const currentPh = el.getAttribute("placeholder");
          const writtenPh = el.getAttribute("data-cru-written-ph");
          const origPh = el.getAttribute("data-original-ph");

          if (writtenPh && currentPh === writtenPh) {
            if (origPh) {
              el.setAttribute("placeholder", origPh);
            }
            el.removeAttribute("data-cru-written-ph");
          } else if (origPh && currentPh !== origPh && currentPh !== writtenPh) {
            el.setAttribute("data-original-ph", currentPh);
            el.removeAttribute("data-cru-written-ph");
          } else if (!origPh && currentPh) {
            el.setAttribute("data-original-ph", currentPh);
            el.removeAttribute("data-cru-written-ph");
          } else {
            el.removeAttribute("data-cru-written-ph");
          }
        });
      } catch (e) {
        console.warn("[i18n] Error al restaurar español:", e);
      }
    };

    // Caso A: Variantes del español estándar (es-latam, es-419, es, es-CR, CR)
    if (esEspanolBase(idioma) && !esEspanolEspana(idioma)) {
      // 1. Ejecución inmediata (0ms)
      restaurarEspanol();

      // 2. Requisito 6: Pasadas extra de sincronización para evitar carrera entre t() y motor DOM
      const timers = [
        setTimeout(restaurarEspanol, 50),
        setTimeout(restaurarEspanol, 150),
        setTimeout(restaurarEspanol, 350),
        setTimeout(restaurarEspanol, 700)
      ];

      const handleNav = () => {
        setTimeout(restaurarEspanol, 60);
        setTimeout(restaurarEspanol, 250);
      };

      window.addEventListener("popstate", handleNav);
      window.addEventListener("hashchange", handleNav);

      return () => {
        timers.forEach((t) => clearTimeout(t));
        window.removeEventListener("popstate", handleNav);
        window.removeEventListener("hashchange", handleNav);
      };
    }

    // Caso B: Idiomas extranjeros (ja, en, pt, cho) o Español de España (es-ES)
    // Requisito 2: Para es-ES, primero restaurar todos los originales en español
    if (esEspanolEspana(idioma)) {
      restaurarEspanol();
    }

    const maestro =
      DICCIONARIO_MAESTRO[idioma] ||
      DICCIONARIO_MAESTRO[idioma?.toLowerCase()] ||
      {};
    const atomico =
      PALABRAS_CLAVE_ATOMICAS[idioma] ||
      PALABRAS_CLAVE_ATOMICAS[idioma?.toLowerCase()] ||
      {};
    const completo =
      DICCIONARIO_COMPLETO[idioma] ||
      DICCIONARIO_COMPLETO[idioma?.toLowerCase()] ||
      {};

    let isScanning = false;

    const aplicarTraduccionUniversal = () => {
      if (isScanning) return;
      isScanning = true;

      try {
        // En es-ES siempre aseguramos que la base sea el español original
        if (esEspanolEspana(idioma)) {
          restaurarEspanol();
        }

        // 1. Recorrer absolutamente TODOS los nodos de texto visibles con TreeWalker
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;
              const tag = node.parentElement.tagName.toLowerCase();
              if (
                tag === "script" ||
                tag === "style" ||
                tag === "noscript" ||
                tag === "svg" ||
                tag === "path"
              ) {
                return NodeFilter.FILTER_REJECT;
              }
              const val = node.nodeValue;
              if (!val || !val.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          },
          false
        );

        let node = walker.nextNode();
        while (node) {
          const raw = node.nodeValue;
          const trimmed = raw.trim();

          // Requisito 3: Detección y sincronización del texto original
          // Si nodeValue no coincide ni con __cru_written ni con __cru_original,
          // React cambió el nodo -> actualizar __cru_original y __cru_trimmed
          if (node.__cru_original === undefined) {
            node.__cru_original = raw;
            node.__cru_trimmed = trimmed;
          } else if (
            node.nodeValue !== node.__cru_written &&
            node.nodeValue !== node.__cru_original
          ) {
            node.__cru_original = raw;
            node.__cru_trimmed = trimmed;
          }

          const originalTrimmed = node.__cru_trimmed;
          const originalBase = node.__cru_original || raw;
          let traducido = null;

          // CAPA 1: Búsqueda exacta de frase completa
          if (maestro[originalTrimmed]) {
            traducido = maestro[originalTrimmed];
          } else if (completo[originalTrimmed]) {
            traducido = completo[originalTrimmed];
          } else {
            // Coincidencia exacta insensible a mayúsculas
            const upper = originalTrimmed.toUpperCase();
            if (maestro[upper]) {
              traducido = maestro[upper];
            } else if (completo[upper]) {
              traducido = completo[upper];
            }
          }

          // CAPA 2: Búsqueda atómica léxica para botones, estados y etiquetas sueltas
          if (!traducido) {
            if (atomico[originalTrimmed]) {
              traducido = atomico[originalTrimmed];
            } else {
              const upper = originalTrimmed.toUpperCase();
              if (atomico[upper]) {
                traducido = atomico[upper];
              }
            }
          }

          // CAPA 3: Reemplazo de sufijos y patrones numéricos dinámicos
          if (traducido) {
            const nextVal = originalBase.replace(originalTrimmed, traducido);
            if (node.nodeValue !== nextVal) {
              node.nodeValue = nextVal;
            }
            node.__cru_written = nextVal;
          } else {
            // Si el motor había modificado el nodo pero el idioma actual no lo traduce, restaurar
            if (node.__cru_written !== undefined && node.nodeValue === node.__cru_written) {
              if (node.__cru_original !== undefined) {
                node.nodeValue = node.__cru_original;
              }
              node.__cru_written = undefined;
            }

            // Manejar sufijos comunes ("personas", "albergues cantonales", "votos", etc.)
            if (originalTrimmed.endsWith(" personas")) {
              const num = originalTrimmed.split(" ")[0];
              if (!isNaN(num)) {
                let suf = "personas";
                if (idioma === "ja") suf = "名";
                else if (idioma === "en") suf = "people";
                else if (idioma === "pt") suf = "pessoas";
                const nextVal = originalBase.replace(originalTrimmed, `${num} ${suf}`);
                if (node.nodeValue !== nextVal) node.nodeValue = nextVal;
                node.__cru_written = nextVal;
              }
            } else if (originalTrimmed.startsWith("Sector ")) {
              const sec = originalTrimmed.split(" ")[1];
              if (sec && atomico[`Sector ${sec}`]) {
                const nextVal = originalBase.replace(originalTrimmed, atomico[`Sector ${sec}`]);
                if (node.nodeValue !== nextVal) node.nodeValue = nextVal;
                node.__cru_written = nextVal;
              }
            }
          }

          node = walker.nextNode();
        }

        // 2. Requisito 5: Traducir atributos de formularios (placeholder)
        const inputs = document.querySelectorAll("input[placeholder], textarea[placeholder]");
        inputs.forEach((el) => {
          const ph = el.getAttribute("placeholder");
          if (ph) {
            const writtenPh = el.getAttribute("data-cru-written-ph");
            const origPh = el.getAttribute("data-original-ph");

            if (!origPh) {
              el.setAttribute("data-original-ph", ph);
            } else if (ph !== writtenPh && ph !== origPh) {
              el.setAttribute("data-original-ph", ph);
            }

            const basePh = el.getAttribute("data-original-ph") || ph;
            const trPh = maestro[basePh] || completo[basePh] || atomico[basePh];
            if (trPh) {
              if (el.getAttribute("placeholder") !== trPh) {
                el.setAttribute("placeholder", trPh);
              }
              el.setAttribute("data-cru-written-ph", trPh);
            } else if (writtenPh && ph === writtenPh) {
              if (origPh) {
                el.setAttribute("placeholder", origPh);
              }
              el.removeAttribute("data-cru-written-ph");
            }
          }
        });
      } catch (err) {
        console.warn("[i18n Universal] Error en escaneo:", err);
      } finally {
        isScanning = false;
      }
    };

    // 1. Ejecución inmediata
    aplicarTraduccionUniversal();

    // 2. Refrescos programados para transiciones React
    const timers = [
      setTimeout(aplicarTraduccionUniversal, 50),
      setTimeout(aplicarTraduccionUniversal, 150),
      setTimeout(aplicarTraduccionUniversal, 350),
      setTimeout(aplicarTraduccionUniversal, 700),
      setTimeout(aplicarTraduccionUniversal, 1200)
    ];

    // 3. Intervalo suave para capturar pestañas y vistas en la Consola Administrativa
    const intervalId = setInterval(aplicarTraduccionUniversal, 400);

    // 4. MutationObserver protegido sin riesgo de bucles
    const observer = new MutationObserver(() => {
      aplicarTraduccionUniversal();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const handleNav = () => {
      setTimeout(aplicarTraduccionUniversal, 60);
      setTimeout(aplicarTraduccionUniversal, 250);
    };

    window.addEventListener("popstate", handleNav);
    window.addEventListener("hashchange", handleNav);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearInterval(intervalId);
      observer.disconnect();
      window.removeEventListener("popstate", handleNav);
      window.removeEventListener("hashchange", handleNav);
    };
  }, [idioma]);

  return (
    <LanguageContext.Provider
      value={{
        idioma,
        currentLang: idioma,
        langCode: idioma,
        activeLangCode: idioma,
        language: idioma,
        cambiarIdioma,
        setLanguage: cambiarIdioma,
        changeLanguage: cambiarIdioma,
        t,
        DICCIONARIO: DICCIONARIO_COMPLETO,
        DICCIONARIO_MAESTRO,
        PALABRAS_CLAVE_ATOMICAS,
        DICCIONARIO_COMPLETO,
        DICCIONARIO_CIVICO: DICCIONARIO_COMPLETO,
        LOCALES: DICCIONARIO_COMPLETO
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      idioma: "es-latam",
      currentLang: "es-latam",
      langCode: "es-latam",
      activeLangCode: "es-latam",
      language: "es-latam",
      cambiarIdioma: () => {},
      setLanguage: () => {},
      changeLanguage: () => {},
      t: (textoOriginal, fallback) => (fallback !== undefined ? fallback : textoOriginal),
      DICCIONARIO: DICCIONARIO_COMPLETO,
      DICCIONARIO_MAESTRO,
      PALABRAS_CLAVE_ATOMICAS,
      DICCIONARIO_COMPLETO,
      DICCIONARIO_CIVICO: DICCIONARIO_COMPLETO,
      LOCALES: DICCIONARIO_COMPLETO
    };
  }
  return context;
};

export default LanguageContext;
