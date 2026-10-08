/**
 * COSTA RICA UNIDOS — Servicio de Análisis Contextual y Escaneo Profundo del DOM
 * Modelo: Gemini 3.6 Flash / 2.0 Flash + Motor de Respaldo Local Determinista Jerárquico
 * 
 * Funcionalidad:
 * 1. Escaneo especializado para todas las vistas clave del sistema con cobertura top-to-bottom:
 *    - Hub Central, Hero y 7 Provincias (Captura 1) (/)
 *    - Centro de Operaciones de Emergencia COE - Ley 8488 (Captura 2) (/seguridad-emergencias)
 *    - Métricas Electorales y Presupuestos Participativos (Captura 3) (/participacion)
 *    - Formulario de Acceso Soberano / Registro y Login (Captura 4) (/login)
 *    - Averías Comunales con Stepper (/reportar-incidencia)
 *    - Zonificación y Croquis de la Feria del Agricultor (/feria)
 *    - Instalaciones Deportivas CCDR (/deportes)
 *    - Catálogo Turístico con Altitud msnm y GeoJSON (/turismo)
 *    - Directorio de Centros Educativos (/educacion)
 *    - Foro Tico Soberano (/foro)
 *    - Noticias Cantonales (/noticias)
 *    - Cartografía y Visor GIS 3D (/mapa-gis)
 * 2. Escáner Profundo Universal sin límites rígidos (recorrido completo de tantos pasos como componentes existan).
 * 3. Auditoría de Cobertura Total (auditAndCompleteTourSequence) sin truncamiento.
 * 4. Caché estricta por ruta (guia_cache_${pathname}) con invalidación inmediata al cambiar de página.
 */

import { getGeminiApiKey, GEMINI_MODELS, GEMINI_API_BASE } from './geminiService.js';

/**
 * Busca un elemento visible que contenga cierto texto
 */
export function queryByText(parent, selector, textPattern) {
  if (!parent || typeof parent.querySelectorAll !== 'function') return null;
  try {
    const els = Array.from(parent.querySelectorAll(selector));
    const regex = textPattern instanceof RegExp ? textPattern : new RegExp(textPattern, 'i');
    return els.find((el) => isElementVisible(el) && regex.test(el.innerText || '')) || null;
  } catch {
    return null;
  }
}

/**
 * Consulta de selectores DOM a prueba de fallos.
 * Soporta selectores CSS estándar, selectores compuestos separados por coma,
 * y pseudo-selectores :has-text("...") evaluados dinámicamente.
 * Prioriza elementos visibles en pantalla.
 */
export function safeQuerySelector(selector, root = typeof document !== 'undefined' ? document : null) {
  if (!selector || typeof selector !== 'string' || !root) return null;

  // Si incluye comas (ej. "[data-tour='nav-institucional'], header nav, header"), probar cada rama y preferir visibles
  if (selector.includes(',')) {
    const branches = selector.split(',').map((s) => s.trim()).filter(Boolean);
    let fallback = null;
    for (const b of branches) {
      const match = safeQuerySelector(b, root);
      if (match) {
        if (isElementVisible(match)) return match;
        if (!fallback) fallback = match;
      }
    }
    return fallback;
  }

  // Evaluar :has-text(...)
  const hasTextMatch = selector.match(/^(.*?):has-text\(["']?([^"')]+)["']?\)(.*)$/);
  if (hasTextMatch) {
    const baseSelector = hasTextMatch[1].trim() || '*';
    const searchText = hasTextMatch[2].trim();
    return queryByText(root, baseSelector, searchText);
  }

  try {
    const el = root.querySelector(selector);
    if (el) return el;
  } catch (err) {
    try {
      const sanitized = selector
        .replace(/:has-text\([^)]*\)/gi, '')
        .replace(/:contains\([^)]*\)/gi, '')
        .trim();
      if (sanitized) return root.querySelector(sanitized);
    } catch {}
  }
  return null;
}

/**
 * Verifica si un elemento es visible en pantalla y tiene dimensiones reales
 */
export function isElementVisible(el) {
  if (!el || typeof window === 'undefined') return false;
  try {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  } catch {
    return false;
  }
}

/**
 * Obtiene la posición relativa en el documento para ordenamiento top-to-bottom
 */
export function getElementPosition(el) {
  if (!el || typeof window === 'undefined') return { top: 0, left: 0, width: 0, height: 0 };
  try {
    const rect = el.getBoundingClientRect();
    return {
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left + window.scrollX),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  } catch {
    return { top: 0, left: 0, width: 0, height: 0 };
  }
}

/**
 * Gestión de Caché Estricta por Ruta
 */
const CACHE_PREFIX = 'guia_cache_';

export function getCachedTour(pathname) {
  try {
    if (typeof sessionStorage === 'undefined' || !pathname) return null;
    const cleanPath = pathname.split('?')[0].split('#')[0] || '/';
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${cleanPath}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.pathname === cleanPath && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
      return parsed;
    }
  } catch {}
  return null;
}

export function setCachedTour(pathname, tourData) {
  try {
    if (typeof sessionStorage === 'undefined' || !pathname || !tourData) return;
    const cleanPath = pathname.split('?')[0].split('#')[0] || '/';
    sessionStorage.setItem(
      `${CACHE_PREFIX}${cleanPath}`,
      JSON.stringify({
        pathname: cleanPath,
        pageTitle: tourData.pageTitle,
        steps: tourData.steps,
        fromAi: tourData.fromAi,
        timestamp: Date.now()
      })
    );
  } catch {}
}

export function clearCachedTour(pathname = null) {
  try {
    if (typeof sessionStorage === 'undefined') return;
    if (pathname) {
      const cleanPath = pathname.split('?')[0].split('#')[0] || '/';
      sessionStorage.removeItem(`${CACHE_PREFIX}${cleanPath}`);
    } else {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch {}
}

/**
 * ESCÁNER ESPECIALIZADO Y PROFUNDO DEL DOM (Deep DOM Scanner)
 * Recorre y explica de arriba hacia abajo absolutamente todos los componentes de la vista activa.
 */
export function scanCurrentPageElements() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return {
      ruta: '/',
      tituloPagina: 'Costa Rica Unidos',
      bloques: [],
      elementosVisibles: []
    };
  }

  const currentPath = window.location.pathname || '/';
  const currentHash = window.location.hash || '';
  const rootScope = document.body;
  const mainScope = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
  const headerScope = document.querySelector('header') || document;

  // Limpiar marcas previas
  document.querySelectorAll('[data-tour-scanned]').forEach((el) => {
    el.removeAttribute('data-tour-scanned');
  });

  const bloques = [];
  const elementosVisibles = [];

  const addBlock = (id, selector, titulo, locucionSugerida, metadata = {}) => {
    // Evitar selectores duplicados en la misma secuencia
    if (bloques.some((b) => b.id === id || b.selector === selector)) return;

    const blockItem = {
      id,
      selector,
      titulo,
      locucionSugerida,
      ...metadata
    };
    bloques.push(blockItem);
    elementosVisibles.push({
      id,
      selector,
      etiqueta: titulo,
      tipo: metadata.tipo || 'bloque',
      posicion: metadata.posicion || { top: 0, left: 0, width: 0, height: 0 },
      ...metadata
    });
  };

  // =========================================================================
  // 1. RECONOCIMIENTO ESPECIALIZADO: PANTALLA PRINCIPAL (Captura 1)
  // Cobertura completa de Barra Superior, Cintillo, Hero Title, Buscador Cívico y Hub Provincial
  // =========================================================================
  const isHomePage = currentPath === '/' || currentPath === '/inicio' || safeQuerySelector('[data-tour="hero-title"]') || safeQuerySelector('h1:has-text("GOBIERNO LOCAL Y SERVICIOS CIUDADANOS")');
  if (isHomePage) {
    // Paso 1: Barra de Navegación Superior y Categorías Cívicas
    const navBar = safeQuerySelector('[data-tour="nav-institucional"]', headerScope) || safeQuerySelector('header nav', headerScope) || safeQuerySelector('header', rootScope);
    if (navBar && isElementVisible(navBar)) {
      navBar.setAttribute('data-tour-scanned', 'nav-institucional');
      addBlock(
        'nav-institucional',
        '[data-tour-scanned="nav-institucional"]',
        'Navegación Superior y Servicios Cívicos',
        'En la barra superior encontrará el acceso directo a los grandes ejes municipales: Gestión y Trámites, Gobierno y Concejo, Territorio y Obras, y Comunidad y CCDR, además del acceso directo al Panel Cívico.',
        { tipo: 'navegacion', posicion: getElementPosition(navBar) }
      );
    }

    // Paso 2: Panel Cívico y Centro de Accesibilidad
    const panelCivico = safeQuerySelector('[data-tour="panel-civico-btn"]', headerScope) || safeQuerySelector('button:has-text("Panel Cívico")', headerScope);
    if (panelCivico && isElementVisible(panelCivico)) {
      panelCivico.setAttribute('data-tour-scanned', 'panel-civico');
      addBlock(
        'panel-civico',
        '[data-tour-scanned="panel-civico"]',
        'Panel Cívico y Herramientas de Accesibilidad',
        'El Panel Cívico le permite personalizar la interfaz bajo la Ley 7600: regular el tamaño de letra, alternar entre modos claro y oscuro, y seleccionar entre los 8 idiomas oficiales del sistema.',
        { tipo: 'panel-civico', posicion: getElementPosition(panelCivico) }
      );
    }

    // Paso 3: Cintillo Nacional de Soberanía y Sede Electrónica
    const cintilloNacional = safeQuerySelector('header .h-7', headerScope) || safeQuerySelector('div:has(> span:has-text("REPÚBLICA DE COSTA RICA"))', rootScope) || safeQuerySelector('[data-tour="cintillo-nacional"]', rootScope);
    if (cintilloNacional && isElementVisible(cintilloNacional)) {
      cintilloNacional.setAttribute('data-tour-scanned', 'cintillo-nacional');
      addBlock(
        'cintillo-nacional',
        '[data-tour-scanned="cintillo-nacional"]',
        'Sede Electrónica Nacional de Costa Rica',
        'Este cintillo oficial certifica la Sede Electrónica Nacional de la República de Costa Rica y el Sistema de Gobiernos Locales, con indicador del cantón activo y acceso a los 84 cantones autónomos.',
        { tipo: 'cintillo-nacional', posicion: getElementPosition(cintilloNacional) }
      );
    }

    // Paso 4: Titular Hero Principal de la Plataforma
    const heroTitle = safeQuerySelector('main h1', mainScope) || safeQuerySelector('h1:has-text("GOBIERNO LOCAL")', mainScope) || mainScope.querySelector('h1');
    if (heroTitle && isElementVisible(heroTitle)) {
      heroTitle.setAttribute('data-tour-scanned', 'hero-title');
      addBlock(
        'hero-title',
        '[data-tour-scanned="hero-title"]',
        'Gobierno Local y Servicios Ciudadanos',
        'Bienvenido a la plataforma ciudadana de Costa Rica Unidos: Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 cantones del país bajo el Código Municipal y la Ley N° 8968.',
        { tipo: 'hero-title', posicion: getElementPosition(heroTitle) }
      );
    }

    // Paso 5: Buscador Cívico Universal
    const searchUniversal = safeQuerySelector('[data-tour="buscador-civico"]', mainScope) || safeQuerySelector('form:has(input[placeholder*="Buscar"])', mainScope) || mainScope.querySelector('input[type="text"]');
    if (searchUniversal && isElementVisible(searchUniversal)) {
      searchUniversal.setAttribute('data-tour-scanned', 'buscador-civico-universal');
      addBlock(
        'buscador-civico-universal',
        '[data-tour-scanned="buscador-civico-universal"]',
        'Buscador Cívico Universal',
        'Utilice este buscador universal para localizar trámites oficiales, actas del Concejo Municipal, validación de cédulas ante Hacienda, tasas de patentes y reportes de incidencias viales en tiempo real.',
        { tipo: 'buscador', posicion: getElementPosition(searchUniversal) }
      );
    }

    // Paso 6: Selector Emblemático de las 7 Provincias
    const provincialSection = safeQuerySelector('#exploracion-provincial', rootScope) || safeQuerySelector('section[aria-label*="Provincias"]', rootScope);
    const selectorProvincias = provincialSection?.querySelector('[role="tablist"], div[style*="grid"]') || safeQuerySelector('button:has-text("San José")')?.parentElement;
    if (selectorProvincias && isElementVisible(selectorProvincias)) {
      selectorProvincias.setAttribute('data-tour-scanned', 'selector-7-provincias');
      addBlock(
        'selector-7-provincias',
        '[data-tour-scanned="selector-7-provincias"]',
        'Selector Emblemático de las 7 Provincias',
        'En esta sección territorial puede alternar entre las 7 provincias soberanas: San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón, actualizando la identidad gráfica y los datos territoriales.',
        { tipo: 'selector-provincias', posicion: getElementPosition(selectorProvincias) }
      );
    }

    // Paso 7: Indicadores Provinciales (Población, Superficie, Obras)
    if (provincialSection) {
      const spanPob = queryByText(provincialSection, 'span', 'Población');
      const indicadoresCard = spanPob?.closest('div[style*="display: flex"]') || spanPob?.parentElement?.parentElement || provincialSection.querySelector('.civic-glass-card');
      if (indicadoresCard && isElementVisible(indicadoresCard)) {
        indicadoresCard.setAttribute('data-tour-scanned', 'indicadores-provinciales');
        let speechIndicadores = 'Esta tarjeta consolida los indicadores clave del territorio seleccionado: cifra de Población censada, Superficie total en kilómetros cuadrados y número de Obras y Proyectos Comunales activos en fiscalización pública.';
        if (spanPob) {
          const pobVal = spanPob.nextElementSibling?.innerText?.trim();
          const supVal = queryByText(provincialSection, 'span', 'Superficie')?.nextElementSibling?.innerText?.trim();
          const obrasVal = queryByText(provincialSection, 'span', 'Obras Activas')?.nextElementSibling?.innerText?.trim();
          if (pobVal || supVal || obrasVal) {
            speechIndicadores = `Esta tarjeta consolida los indicadores territoriales: Población censada de ${pobVal || 'la provincia'}, Superficie de ${supVal || 'kilómetros cuadrados'} y ${obrasVal || 'múltiples'} Obras Activas en fiscalización ciudadana.`;
          }
        }
        addBlock(
          'indicadores-provinciales',
          '[data-tour-scanned="indicadores-provinciales"]',
          'Indicadores Provinciales: Población, Superficie y Obras',
          speechIndicadores,
          { tipo: 'indicadores-provinciales', posicion: getElementPosition(indicadoresCard) }
        );
      }

      // Paso 8: Submódulos Territoriales de Gestión Cívica
      const btnNoticias = queryByText(provincialSection, 'button', 'Noticias');
      const tabsSubmodulos = btnNoticias?.closest('div[style*="overflow-x"]') || btnNoticias?.parentElement || provincialSection.querySelector('div:has(> button:has-text("Noticias"))') || provincialSection.querySelector('div[style*="overflow-x"]');
      if (tabsSubmodulos && isElementVisible(tabsSubmodulos)) {
        tabsSubmodulos.setAttribute('data-tour-scanned', 'tabs-submodulos-provinciales');
        addBlock(
          'tabs-submodulos-provinciales',
          '[data-tour-scanned="tabs-submodulos-provinciales"]',
          'Submódulos Territoriales de Gestión Cívica',
          'Navegue entre los 4 pilares cívicos provinciales: Noticias y Boletines oficiales (M01), Cabildo Digital y Foro Comunal (M04), Capas Cartográficas en Mapa & GIS (M05), y Directorio de PYMES y Ferias del Agricultor (M08 y M10).',
          { tipo: 'tabs-provinciales', posicion: getElementPosition(tabsSubmodulos) }
        );
      }

      // Paso 9: Feed Provincial y Búsqueda Comunitaria
      const searchProv = provincialSection.querySelector('input[type="text"][placeholder*="Buscar"]') || provincialSection.querySelector('input[type="text"]');
      const feedProvincial = searchProv?.closest('div[style*="display: flex"]') || provincialSection.querySelector('.tab-content, article') || searchProv?.parentElement;
      if (feedProvincial && isElementVisible(feedProvincial)) {
        feedProvincial.setAttribute('data-tour-scanned', 'feed-provincial');
        addBlock(
          'feed-provincial',
          '[data-tour-scanned="feed-provincial"]',
          'Feed Provincial de Noticias y Búsqueda Comunitaria',
          'Revise los comunicados oficiales emitidos en la provincia seleccionada y utilice el buscador interno para localizar actas, inauguraciones y avisos de servicios públicos cantonales.',
          { tipo: 'feed-provincial', posicion: getElementPosition(feedProvincial) }
        );
      }
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Portal Central de Servicios y Hub Provincial',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 2. RECONOCIMIENTO ESPECIALIZADO: CENTRO DE OPERACIONES DE EMERGENCIA COE (Captura 2)
  // Ley 8488 • Alerta Activa CNE • Botonera 24/7 (911/Bomberos/Cruz Roja/OIJ) • Albergues y GPS
  // =========================================================================
  const isCoePage = currentPath.includes('/seguridad') || currentPath.includes('/emergencias') || currentPath.includes('/sos') || safeQuerySelector('.botonera-911-grid') || safeQuerySelector('#seccion-albergues');
  if (isCoePage) {
    // Paso 1: Encabezado COE y Marco Ley N° 8488
    const headerCoe = safeQuerySelector('section:first-of-type', mainScope) || safeQuerySelector('div:has(> h1:has-text("Centro de Operaciones"))', mainScope) || mainScope.querySelector('h1');
    if (headerCoe && isElementVisible(headerCoe)) {
      headerCoe.setAttribute('data-tour-scanned', 'encabezado-coe');
      addBlock(
        'encabezado-coe',
        '[data-tour-scanned="encabezado-coe"]',
        'Centro de Operaciones de Emergencia Cantonal (COE - Ley 8488)',
        'Bienvenido al Centro de Operaciones de Emergencia Cantonal y Red de Auxilio. Este módulo coordina las acciones institucionales con los Comités Municipales de Emergencia bajo el marco rector de la Ley Nacional de Emergencias N° 8488.',
        { tipo: 'encabezado-coe', posicion: getElementPosition(headerCoe) }
      );
    }

    // Paso 2: Tarjeta de Alerta Activa CNE
    const alertaCard = safeQuerySelector('div:has(> span:has-text("ACTIVA"))', mainScope) || safeQuerySelector('div:has(> p:has-text("alerta"))', mainScope) || mainScope.querySelector('div[style*="border"]:has(span)');
    if (alertaCard && isElementVisible(alertaCard)) {
      alertaCard.setAttribute('data-tour-scanned', 'alerta-activa-cne');
      const alertaText = alertaCard.innerText || '';
      let speechAlerta = 'Monitoree la condición oficial de la Comisión Nacional de Emergencias: actualmente rige Alerta Amarilla Activa con vigilancia técnica reforzada para zonas bajo aviso como el Pacífico Central y Caribe.';
      if (alertaText.includes('AMARILLA') || alertaText.includes('Amarilla')) {
        speechAlerta = 'Actualmente rige Alerta Amarilla Activa de la CNE con protocolos de vigilancia reforzada y preparación en albergues para las zonas bajo aviso.';
      } else if (alertaText.includes('VERDE') || alertaText.includes('Verde')) {
        speechAlerta = 'Actualmente rige Alerta Verde Informativa de la CNE con monitoreo constante de condiciones hidrometeorológicas.';
      } else if (alertaText.includes('ROJA') || alertaText.includes('Roja')) {
        speechAlerta = 'Actualmente rige Alerta Roja Máxima de la CNE con evacuación y activación plena del Centro de Operaciones de Emergencia.';
      }
      addBlock(
        'alerta-activa-cne',
        '[data-tour-scanned="alerta-activa-cne"]',
        'Protocolo de Alerta Activa CNE',
        speechAlerta,
        { tipo: 'alerta-cne', posicion: getElementPosition(alertaCard) }
      );
    }

    // Paso 3: Botonera Táctil de Auxilio Inmediato (24/7)
    const botoneraAuxilio = safeQuerySelector('.botonera-911-grid', mainScope) || safeQuerySelector('section[aria-labelledby="seccion-auxilio"]', mainScope) || safeQuerySelector('div:has(> a[href*="tel:911"])', mainScope);
    if (botoneraAuxilio && isElementVisible(botoneraAuxilio)) {
      botoneraAuxilio.setAttribute('data-tour-scanned', 'botonera-auxilio-247');
      addBlock(
        'botonera-auxilio-247',
        '[data-tour-scanned="botonera-auxilio-247"]',
        'Botonera Táctil de Auxilio y Despacho Inmediato (24/7)',
        'Canales de auxilio inmediato disponibles las 24 horas: toque cualquier botón para establecer enlace telefónico instantáneo con los cuerpos de rescate del Estado: Central 9-1-1, Fuerza Pública, Bomberos de Costa Rica, Cruz Roja y línea confidencial del OIJ.',
        { tipo: 'botonera-auxilio', posicion: getElementPosition(botoneraAuxilio) }
      );
    }

    // Paso 4: Padrón y Encabezado de Albergues CNE
    const headerAlbergues = safeQuerySelector('#seccion-albergues', mainScope) || safeQuerySelector('h2:has-text("Albergues")', mainScope);
    if (headerAlbergues && isElementVisible(headerAlbergues)) {
      headerAlbergues.setAttribute('data-tour-scanned', 'header-albergues');
      addBlock(
        'header-albergues',
        '[data-tour-scanned="header-albergues"]',
        'Padrón Nacional de Albergues Temporales CNE',
        'Este módulo administra el padrón oficial de albergues y centros de resguardo humanitario habilitados ante inundaciones, deslizamientos o emergencias sísmicas.',
        { tipo: 'encabezado-albergues', posicion: getElementPosition(headerAlbergues) }
      );
    }

    // Paso 5: Tabla de Aforo y Ocupación en Tiempo Real
    const tablaAlbergues = safeQuerySelector('.civic-table-container', mainScope) || safeQuerySelector('table', mainScope);
    if (tablaAlbergues && isElementVisible(tablaAlbergues)) {
      tablaAlbergues.setAttribute('data-tour-scanned', 'tabla-albergues');
      const firstRow = tablaAlbergues.querySelector('tbody tr');
      let tableSpeech = 'En la tabla de monitoreo se desglosa cada refugio oficial, como el Gimnasio Municipal de Turrialba con 85 de 250 personas albergadas, el Salón Comunal de Matina y el Polideportivo de San Carlos, mostrando barras porcentuales de ocupación en tiempo real.';
      if (firstRow) {
        const albName = firstRow.querySelector('strong')?.innerText?.trim() || 'Gimnasio Municipal de Turrialba';
        const albAforo = firstRow.querySelector('td:nth-child(3)')?.innerText?.trim().replace(/\s+/g, ' ') || '85 / 250 personas';
        tableSpeech = `En la tabla de monitoreo se desglosa cada refugio oficial, como ${albName} con capacidad de ${albAforo}, mostrando barras porcentuales de ocupación en tiempo real.`;
      }
      addBlock(
        'tabla-albergues',
        '[data-tour-scanned="tabla-albergues"]',
        'Capacidad de Aforo y Ocupación en Tiempo Real',
        tableSpeech,
        { tipo: 'tabla-aforo', posicion: getElementPosition(tablaAlbergues) }
      );
    }

    // Paso 6: Dotación de Servicios Esenciales y Suministros Críticos
    const suministrosEl = safeQuerySelector('.civic-table-container tbody tr:first-child td:nth-child(4)', mainScope) || safeQuerySelector('td:has(span)', tablaAlbergues);
    if (suministrosEl && isElementVisible(suministrosEl)) {
      suministrosEl.setAttribute('data-tour-scanned', 'servicios-albergue');
      addBlock(
        'servicios-albergue',
        '[data-tour-scanned="servicios-albergue"]',
        'Dotación de Servicios y Suministros Críticos',
        'Cada albergue detalla su equipamiento logístico para la población: tanques de agua potable de 5,000 litros, plantas eléctricas diésel, catres plegables, puestos médicos de la Cruz Roja y raciones alimentarias de la CNE.',
        { tipo: 'suministros', posicion: getElementPosition(suministrosEl) }
      );
    }

    // Paso 7: Ruteo Satelital GPS Waze y Google Maps
    const botonesGps = safeQuerySelector('a[href*="waze"]', mainScope) || safeQuerySelector('button:has-text("Waze"), a:has-text("Waze")', mainScope) || Array.from(mainScope.querySelectorAll('button, a')).find((b) => isElementVisible(b) && /Waze|Google Maps|Maps/i.test(b.innerText || ''));
    if (botonesGps && isElementVisible(botonesGps)) {
      botonesGps.setAttribute('data-tour-scanned', 'acciones-gps-albergue');
      addBlock(
        'acciones-gps-albergue',
        '[data-tour-scanned="acciones-gps-albergue"]',
        'Navegación Satelital GPS (Waze y Google Maps)',
        'Verifique el estado del albergue y presione los botones de enlace directo a Waze o Google Maps para iniciar la navegación satelital inmediata hacia el punto de resguardo más cercano.',
        { tipo: 'ruteo-gps', posicion: getElementPosition(botonesGps) }
      );
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Centro de Operaciones de Emergencia Cantonal (COE / CNE)',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 3. RECONOCIMIENTO ESPECIALIZADO: PRESUPUESTOS PARTICIPATIVOS Y VOTACIÓN (Captura 3)
  // 4 Indicadores Superiores • Conteo en Tiempo Real • Gráfico Sectorial • Fiscalización POA
  // =========================================================================
  const isParticipacionPage = currentPath.includes('/participacion') || currentPath.includes('/votar') || safeQuerySelector('span:has-text("Fondo Presupuestario")') || safeQuerySelector('h2:has-text("Métricas Electorales")');
  if (isParticipacionPage) {
    // Paso 1: 4 Indicadores Métricos Superiores
    const metricasGrid = safeQuerySelector('.grid:has(.font-mono)', mainScope) || safeQuerySelector('div:has(> div:has-text("Fondo Presupuestario"))', mainScope) || mainScope.querySelector('.grid');
    if (metricasGrid && isElementVisible(metricasGrid)) {
      metricasGrid.setAttribute('data-tour-scanned', 'metricas-participacion');
      addBlock(
        'metricas-participacion',
        '[data-tour-scanned="metricas-participacion"]',
        'Indicadores Clave del Presupuesto Participativo 2026',
        'Observe los 4 indicadores clave en tiempo real: Fondo Presupuestario de ₡ 225 Millones de colones para proyectos comunales, 1,566 Votos Ciudadanos Emitidos 100% verificados con cédula ante Hacienda, 4 Proyectos Distritales en competencia, y fecha de Cierre del Sufragio el 15 de Noviembre de 2026 para ratificación en sesión municipal.',
        { tipo: 'metricas-electorales', posicion: getElementPosition(metricasGrid) }
      );
    }

    // Paso 2: Conteo de Votos en Tiempo Real y Escrutinio Distrital
    const conteoVotos = safeQuerySelector('div:has(> .text-cyan-400:has-text("Conteo de Votos"))', mainScope) || safeQuerySelector('.lg\\:col-span-7', mainScope) || safeQuerySelector('div:has(span:has-text("1° Lugar"))', mainScope);
    if (conteoVotos && isElementVisible(conteoVotos)) {
      conteoVotos.setAttribute('data-tour-scanned', 'grafico-conteo-votos');
      addBlock(
        'grafico-conteo-votos',
        '[data-tour-scanned="grafico-conteo-votos"]',
        'Conteo de Votos en Tiempo Real y Ranking Distrital',
        'En este gráfico reactivo puede fiscalizar el ranking de votación en tiempo real: en primer lugar lidera la Iluminación LED Solar en el distrito El Carmen con 642 votos, seguido por la Ciclovía Segura en Pavas con 489 votos y el Parque Infantil y Biosaludable en Hatillo 4 con 315 votos.',
        { tipo: 'conteo-votos', posicion: getElementPosition(conteoVotos) }
      );
    }

    // Paso 3: Presupuesto Participativo Cantonal y Distribución por Sectores
    const distribucionPresupuesto = safeQuerySelector('div:has(> .text-emerald-400:has-text("Presupuesto Participativo"))', mainScope) || safeQuerySelector('.lg\\:col-span-5', mainScope) || safeQuerySelector('div:has(span:has-text("Seguridad y Movilidad"))', mainScope);
    if (distribucionPresupuesto && isElementVisible(distribucionPresupuesto)) {
      distribucionPresupuesto.setAttribute('data-tour-scanned', 'grafico-distribucion-presupuesto');
      addBlock(
        'grafico-distribucion-presupuesto',
        '[data-tour-scanned="grafico-distribucion-presupuesto"]',
        'Distribución Presupuestaria Cantonal por Sectores',
        'Consulte la distribución porcentual del fondo de 225 millones asignado por sectores: Seguridad y Movilidad representa un 31.1%, Infraestructura y Aceras un 28.9%, Espacios Verdes y Parques un 24.4%, y Cultura y Juventud un 15.6%.',
        { tipo: 'distribucion-presupuesto', posicion: getElementPosition(distribucionPresupuesto) }
      );
    }

    // Paso 4: Fiscalización Ciudadana y Ratificación en el POA
    const fiscalizacionCard = safeQuerySelector('div:has(> span:has-text("Fiscalización Ciudadana"))', mainScope) || safeQuerySelector('div:has(> p:has-text("POA"))', mainScope) || queryByText(mainScope, 'div', 'Plan Operativo Anual');
    if (fiscalizacionCard && isElementVisible(fiscalizacionCard)) {
      fiscalizacionCard.setAttribute('data-tour-scanned', 'fiscalizacion-poa');
      addBlock(
        'fiscalizacion-poa',
        '[data-tour-scanned="fiscalizacion-poa"]',
        'Garantía de Fiscalización Ciudadana y Ejecución en el POA',
        'Bajo el marco de transparencia municipal, los proyectos que resulten ganadores por voto vecinal en cada distrito serán ratificados e incorporados obligatoriamente al Plan Operativo Anual (POA) y al presupuesto formal del Concejo Municipal.',
        { tipo: 'fiscalizacion-poa', posicion: getElementPosition(fiscalizacionCard) }
      );
    }

    // Paso 5: Banco de Proyectos Vecinales en Votación
    const bancoProyectos = safeQuerySelector('div:has(> h2:has-text("Banco de Proyectos"))', mainScope) || safeQuerySelector('section:has(button:has-text("Votar"))', mainScope) || queryByText(mainScope, 'h2', 'Banco de Proyectos');
    if (bancoProyectos && isElementVisible(bancoProyectos)) {
      bancoProyectos.setAttribute('data-tour-scanned', 'banco-proyectos-votacion');
      addBlock(
        'banco-proyectos-votacion',
        '[data-tour-scanned="banco-proyectos-votacion"]',
        'Banco de Proyectos Vecinales y Emisión del Voto',
        'Explore cada una de las fichas de proyectos vecinales presentados por las Asociaciones de Desarrollo Integral (ADIs), analice su presupuesto en colones y ejerza su voto directo como Ciudadano Verificado Nivel 2.',
        { tipo: 'banco-proyectos', posicion: getElementPosition(bancoProyectos) }
      );
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Métricas Electorales y Presupuestos Participativos',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 4. RECONOCIMIENTO ESPECIALIZADO: ACCESO SOBERANO / REGISTRO Y LOGIN (Captura 4)
  // Ley 8968 & 8292 • Selector Iniciar/Registrar • Cédula + Validar Hacienda • Datos • Credenciales
  // =========================================================================
  const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register') || currentPath.includes('/registro') || safeQuerySelector('#tab-btn-login') || safeQuerySelector('h1:has-text("Acceso Soberano")');
  if (isAuthPage) {
    // Paso 1: Cabecera y Marco Legal Soberano
    const cabeceraLogin = safeQuerySelector('div:has(> h1:has-text("Acceso Soberano"))', mainScope) || safeQuerySelector('div:has(span:has-text("LEY N° 8968"))', mainScope) || mainScope.querySelector('h1')?.parentElement;
    if (cabeceraLogin && isElementVisible(cabeceraLogin)) {
      cabeceraLogin.setAttribute('data-tour-scanned', 'login-cabecera');
      addBlock(
        'login-cabecera',
        '[data-tour-scanned="login-cabecera"]',
        'Acceso Soberano y Control RBAC',
        'Bienvenido a la ventanilla de Acceso Soberano de la República de Costa Rica. Este sistema implementa Control de Acceso Basado en Roles (RBAC) con protección integral de datos bajo la Ley N° 8968 y auditoría técnica bajo la Ley N° 8292.',
        { tipo: 'login-cabecera', posicion: getElementPosition(cabeceraLogin) }
      );
    }

    // Paso 2: Selector de Modalidad (Iniciar Sesión vs Crear Cuenta)
    const tabsAuth = safeQuerySelector('div:has(#tab-btn-login)', mainScope) || safeQuerySelector('div:has(button:has-text("Iniciar Sesión"))', mainScope);
    if (tabsAuth && isElementVisible(tabsAuth)) {
      tabsAuth.setAttribute('data-tour-scanned', 'selector-modalidad-auth');
      addBlock(
        'selector-modalidad-auth',
        '[data-tour-scanned="selector-modalidad-auth"]',
        'Selector de Modalidad: Iniciar Sesión o Crear Cuenta',
        'Utilice este selector superior para alternar entre Iniciar Sesión con credenciales existentes o presionar Crear Cuenta para el registro cívico de nuevos ciudadanos con validación oficial.',
        { tipo: 'selector-modalidad', posicion: getElementPosition(tabsAuth) }
      );
    }

    // Paso 3: Campo de Cédula y Validación con Hacienda
    const cedulaContainer = safeQuerySelector('div:has(#reg-cedula)', mainScope) || safeQuerySelector('div:has(#login-identificador)', mainScope) || safeQuerySelector('div:has(button#btn-validar-cedula)', mainScope);
    if (cedulaContainer && isElementVisible(cedulaContainer)) {
      cedulaContainer.setAttribute('data-tour-scanned', 'input-validacion-cedula');
      addBlock(
        'input-validacion-cedula',
        '[data-tour-scanned="input-validacion-cedula"]',
        'Validación de Cédula Costarricense o DIMEX ante Hacienda',
        'Ingrese su número de cédula física costarricense o DIMEX de 9 a 12 dígitos y presione el botón Validar para realizar la consulta oficial en tiempo real ante el padrón del Ministerio de Hacienda.',
        { tipo: 'input-cedula', posicion: getElementPosition(cedulaContainer) }
      );
    }

    // Paso 4: Campos de Datos Personales Oficiales (Nombre y Apellidos)
    const datosPersonales = safeQuerySelector('div:has(#reg-nombres)', mainScope) || safeQuerySelector('div:has(input#reg-primer-apellido)', mainScope) || queryByText(mainScope, 'label', 'Nombre');
    if (datosPersonales && isElementVisible(datosPersonales)) {
      const datosWrapper = datosPersonales.closest('div[style*="gap"], form > div') || datosPersonales;
      datosWrapper.setAttribute('data-tour-scanned', 'campos-datos-personales');
      addBlock(
        'campos-datos-personales',
        '[data-tour-scanned="campos-datos-personales"]',
        'Datos Personales Oficiales: Nombres y Apellidos',
        'El sistema autocompleta su nombre de pila oficial, primer apellido y segundo apellido certificados por el padrón de Hacienda, manteniéndolos editables para corregir tildes o caracteres especiales.',
        { tipo: 'datos-personales', posicion: getElementPosition(datosWrapper) }
      );
    }

    // Paso 5: Credenciales de Acceso (Correo y Contraseña)
    const credenciales = safeQuerySelector('div:has(#reg-email)', mainScope) || safeQuerySelector('div:has(#login-password)', mainScope) || safeQuerySelector('div:has(input[type="password"])', mainScope);
    if (credenciales && isElementVisible(credenciales)) {
      const credencialesWrapper = credenciales.closest('div[style*="gap"], form > div') || credenciales;
      credencialesWrapper.setAttribute('data-tour-scanned', 'campos-credenciales');
      addBlock(
        'campos-credenciales',
        '[data-tour-scanned="campos-credenciales"]',
        'Correo Ciudadano y Contraseña Segura',
        'Complete su correo electrónico ciudadano para recibir notificaciones de expedientes cívicos y defina su contraseña de acceso protegida mediante encriptación segura y visor de caracteres.',
        { tipo: 'credenciales-seguras', posicion: getElementPosition(credencialesWrapper) }
      );
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Acceso Soberano y Autenticación Cívica',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 5. RECONOCIMIENTO ESPECIALIZADO: VENTANILLA DE AVERÍAS COMUNALES
  // =========================================================================
  if (currentPath.includes('/reportar') || currentPath.includes('/reportes') || safeQuerySelector('.civic-stepper-grid')) {
    const stepperEl = safeQuerySelector('.civic-stepper-grid') || Array.from(mainScope.querySelectorAll('div')).find((d) => isElementVisible(d) && d.innerText.includes('Tipología Técnica') && d.innerText.includes('Evidencia WebP'));
    if (stepperEl && isElementVisible(stepperEl)) {
      stepperEl.setAttribute('data-tour-scanned', 'stepper-averias');
      addBlock(
        'stepper-averias',
        '[data-tour-scanned="stepper-averias"]',
        'Flujo Guiado de Radicación en 4 Fases',
        'Nos encontramos en la Ventanilla de Fiscalización Ciudadana y Averías Comunales bajo la Ley N° 8968. El trámite se organiza en un flujo guiado de 4 fases: Fase 1 Tipología Técnica, Fase 2 Evidencia WebP con compresión en cliente, Fase 3 Georreferenciación oficial en mapa y Fase 4 Declaración jurada y radicación del expediente administrativo.',
        { tipo: 'stepper', posicion: getElementPosition(stepperEl) }
      );
    }

    const cardsGrid = safeQuerySelector('div[style*="grid"]:has(.civic-glass-card)') || safeQuerySelector('.civic-glass-card')?.parentElement || safeQuerySelector('div:has(> .civic-glass-card)');
    if (cardsGrid && isElementVisible(cardsGrid)) {
      cardsGrid.setAttribute('data-tour-scanned', 'tipologias-dano');
      addBlock(
        'tipologias-dano',
        '[data-tour-scanned="tipologias-dano"]',
        'Selección de Tipología de Avería Comunal',
        'Dispone de 4 tipologías técnicas normadas para clasificar el incidente: Hueco vial o bache en asfalto, Luminaria pública dañada o apagada, Fuga de agua potable o alcantarilla colapsada, y Basurero clandestino o escombros. La selección precisa enruta el ticket a la entidad competente.',
        { tipo: 'tipologias', posicion: getElementPosition(cardsGrid) }
      );
    }

    const fichaTecnica = safeQuerySelector('.civic-glass-card[aria-pressed="true"]') || safeQuerySelector('.civic-glass-card') || safeQuerySelector('.telemetry-card');
    if (fichaTecnica && isElementVisible(fichaTecnica)) {
      fichaTecnica.setAttribute('data-tour-scanned', 'ficha-tecnica-sla');
      addBlock(
        'ficha-tecnica-sla',
        '[data-tour-scanned="ficha-tecnica-sla"]',
        'Competencia Institucional y Plazos Normados SLA',
        'Cada tipología especifica la entidad pública responsable (como el MOPT o la Municipalidad en vialidad, CNFL e ICE en alumbrado, y AyA en acueductos), junto con el plazo normado de atención de 3 a 5 días hábiles conforme al marco reglamentario.',
        { tipo: 'sla', posicion: getElementPosition(fichaTecnica) }
      );
    }

    const btnContinuar = safeQuerySelector('button:has-text("Siguiente Paso")') || safeQuerySelector('button:has-text("Siguiente")') || Array.from(mainScope.querySelectorAll('button')).find((b) => isElementVisible(b) && /Siguiente|Continuar/i.test(b.innerText || ''));
    if (btnContinuar && isElementVisible(btnContinuar)) {
      btnContinuar.setAttribute('data-tour-scanned', 'btn-avanzar-evidencia');
      addBlock(
        'btn-avanzar-evidencia',
        '[data-tour-scanned="btn-avanzar-evidencia"]',
        'Avance a Evidencia Fotográfica WebP',
        'Presione este botón de Siguiente Paso para avanzar a la fase 2 de evidencia fotográfica procesada con compresión WebP en el navegador y consentir el tratamiento cívico de datos bajo la Ley N° 8968.',
        { tipo: 'accion-avance', posicion: getElementPosition(btnContinuar) }
      );
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Ventanilla de Averías Comunales',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 6. RECONOCIMIENTO ESPECIALIZADO: FERIA DEL AGRICULTOR Y CROQUIS
  // =========================================================================
  if (currentPath.includes('/feria') || safeQuerySelector('h4:has-text("Plano")') || safeQuerySelector('#titulo-precios-cnp')) {
    const sectoresEl = safeQuerySelector('div:has(> button:has-text("Frutas")), div:has(> button:has-text("Verduras"))') || Array.from(mainScope.querySelectorAll('div')).find((d) => isElementVisible(d) && /Frutas.*Verduras/i.test(d.innerText || ''));
    if (sectoresEl && isElementVisible(sectoresEl)) {
      sectoresEl.setAttribute('data-tour-scanned', 'sectores-feria');
      addBlock(
        'sectores-feria',
        '[data-tour-scanned="sectores-feria"]',
        'Sectores Agrícolas de la Feria Cantonal',
        'Utilice los filtros superiores para explorar los sectores del predio ferial: Frutas Tropicales, Verduras y Hortalizas, Lácteos y Quesos, Carnes y Embutidos, y Sodas de comida típica costarricense.',
        { tipo: 'sectores', posicion: getElementPosition(sectoresEl) }
      );
    }

    const croquisEl = safeQuerySelector('div[style*="radial-gradient"]') || safeQuerySelector('div:has(> h4:has-text("Plano"))') || Array.from(mainScope.querySelectorAll('div')).find((d) => isElementVisible(d) && /Plano de Distribución/i.test(d.innerText || ''));
    if (croquisEl && isElementVisible(croquisEl)) {
      croquisEl.setAttribute('data-tour-scanned', 'croquis-plano');
      addBlock(
        'croquis-plano',
        '[data-tour-scanned="croquis-plano"]',
        'Plano Interactivo de Puestos (P-12 al P-50)',
        'Este croquis interactivo representa la distribución física de los puestos (desde el P-12 hasta el P-50). Al hacer clic sobre cualquier casilla de puesto, el sistema resalta su ubicación y despliega en tiempo real la ficha completa del productor asignado.',
        { tipo: 'croquis', posicion: getElementPosition(croquisEl) }
      );
    }

    const fichaProductor = safeQuerySelector('div:has(span:has-text("PRODUCTOR")), div:has(span:has-text("CAC"))') || Array.from(mainScope.querySelectorAll('div')).find((d) => isElementVisible(d) && /CAC.*MAG|Productor/i.test(d.innerText || '')) || croquisEl;
    if (fichaProductor && isElementVisible(fichaProductor)) {
      fichaProductor.setAttribute('data-tour-scanned', 'ficha-productor');
      addBlock(
        'ficha-productor',
        '[data-tour-scanned="ficha-productor"]',
        'Ficha de Trazabilidad y Acreditación del Productor',
        'La ficha del agricultor muestra el nombre del titular, su cantón y finca de origen, el número de carné del Centro Agrícola Cantonal (CAC) y los sellos de producción orgánica certificados por el Ministerio de Agricultura y Ganadería (MAG).',
        { tipo: 'productor', posicion: getElementPosition(fichaProductor) }
      );
    }

    const tablaPrecios = safeQuerySelector('#titulo-precios-cnp')?.closest('section') || safeQuerySelector('section[aria-labelledby="titulo-cosechas"]') || safeQuerySelector('.civic-table-container') || safeQuerySelector('table');
    if (tablaPrecios && isElementVisible(tablaPrecios)) {
      tablaPrecios.setAttribute('data-tour-scanned', 'precios-calendario');
      addBlock(
        'precios-calendario',
        '[data-tour-scanned="precios-calendario"]',
        'Precios Oficiales CNP-SIME y Calendario de Cosechas',
        'Consulte el catálogo oficial de precios de referencia del CNP y el calendario trimestral de cosechas, que evidencia ahorros directos para el consumidor de entre el 30% y el 50% en comparación con las cadenas de supermercados.',
        { tipo: 'precios-cnp', posicion: getElementPosition(tablaPrecios) }
      );
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Feria del Agricultor y Precios CNP',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 7. RECONOCIMIENTO ESPECIALIZADO: INSTALACIONES DEPORTIVAS CCDR
  // =========================================================================
  if (currentPath.includes('/deportes') || safeQuerySelector('button:has-text("Juegos Deportivos")')) {
    const tabsDeportes = safeQuerySelector('[role="tablist"]') || safeQuerySelector('div:has(> button:has-text("Instalaciones"))');
    if (tabsDeportes && isElementVisible(tabsDeportes)) {
      tabsDeportes.setAttribute('data-tour-scanned', 'tabs-deportes');
      addBlock(
        'tabs-deportes',
        '[data-tour-scanned="tabs-deportes"]',
        'Pestañas de Gestión Deportiva Cantonal (CCDR)',
        'Desde esta barra puede alternar entre los tres ejes del Comité Cantonal de Deportes y Recreación: la red de Instalaciones Públicas, las convocatorias de Juegos Deportivos Nacionales (JDN) y las Escuelas de Iniciación Deportiva.',
        { tipo: 'tabs', posicion: getElementPosition(tabsDeportes) }
      );
    }

    const semaforoEl = safeQuerySelector('button:has-text("Abierto al Público")')?.parentElement || safeQuerySelector('div:has(> button:has-text("Mantenimiento"))');
    if (semaforoEl && isElementVisible(semaforoEl)) {
      semaforoEl.setAttribute('data-tour-scanned', 'semaforo-deportes');
      addBlock(
        'semaforo-deportes',
        '[data-tour-scanned="semaforo-deportes"]',
        'Semáforo de Disponibilidad Operativa',
        'Filtre los espacios con el semáforo institucional: indicador Verde para instalaciones Abiertas al Público y disponibles, indicador Amarillo para canchas en Mantenimiento técnico, e indicador Azul para horarios Reservados para Escuelas.',
        { tipo: 'semaforo', posicion: getElementPosition(semaforoEl) }
      );
    }

    const fichasGrid = safeQuerySelector('section[aria-label*="Instalaciones"] div[style*="grid"]') || safeQuerySelector('div[style*="grid"]:has(.civic-card)') || mainScope.querySelector('.civic-card')?.parentElement;
    if (fichasGrid && isElementVisible(fichasGrid)) {
      fichasGrid.setAttribute('data-tour-scanned', 'fichas-instalaciones');
      addBlock(
        'fichas-instalaciones',
        '[data-tour-scanned="fichas-instalaciones"]',
        'Fichas Técnicas de Polideportivos y Complejos',
        'Cada complejo deportivo detalla su aforo máximo, horarios de atención diurna y nocturna, tarifa social municipal por hora y su certificación de accesibilidad total para personas con discapacidad bajo la Ley 7600.',
        { tipo: 'instalaciones', posicion: getElementPosition(fichasGrid) }
      );
    }

    const btnReservar = safeQuerySelector('button:has-text("Reservar Espacio")') || safeQuerySelector('button:has-text("Reservar")') || Array.from(mainScope.querySelectorAll('button')).find((b) => isElementVisible(b) && /Reservar|Consultar/i.test(b.innerText || ''));
    if (btnReservar && isElementVisible(btnReservar)) {
      btnReservar.setAttribute('data-tour-scanned', 'btn-reservar-espacio');
      addBlock(
        'btn-reservar-espacio',
        '[data-tour-scanned="btn-reservar-espacio"]',
        'Reserva Cívica y Solicitud de Espacio Deportivo',
        'Presione el botón "Reservar Espacio" para abrir el formulario digital de apartado de horario, donde podrá solicitar uso comunitario o competitivo y recibir su comprobante oficial emitido por el CCDR.',
        { tipo: 'accion-reserva', posicion: getElementPosition(btnReservar) }
      );
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Instalaciones Deportivas CCDR',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 8. RECONOCIMIENTO ESPECIALIZADO: CATÁLOGO DE DESTINOS TURÍSTICOS
  // =========================================================================
  if (currentPath.includes('/turismo') || safeQuerySelector('button:has-text("Exportar POI GeoJSON")')) {
    const headerTurismo = safeQuerySelector('button:has-text("Exportar POI GeoJSON")') || safeQuerySelector('div:has(> button:has-text("GeoJSON"))') || mainScope.querySelector('h1, h2');
    if (headerTurismo && isElementVisible(headerTurismo)) {
      headerTurismo.setAttribute('data-tour-scanned', 'header-turismo');
      addBlock(
        'header-turismo',
        '[data-tour-scanned="header-turismo"]',
        'Catálogo de Destinos y Exportación GeoJSON (GIS)',
        'Bienvenido a la Guía de Turismo Cantonal y Aventura Sostenible. En la cabecera dispone del botón "Exportar POI GeoJSON (GIS)" para descargar las coordenadas WGS84 de parques nacionales, miradores y reservas biológicas para visores cartográficos.',
        { tipo: 'encabezado-geojson', posicion: getElementPosition(headerTurismo) }
      );
    }

    const filtrosTurismo = safeQuerySelector('button:has-text("Ley 7600 Total")')?.parentElement || safeQuerySelector('div:has(> button:has-text("Tracción 4x4"))') || safeQuerySelector('button:has-text("4x4")')?.parentElement;
    if (filtrosTurismo && isElementVisible(filtrosTurismo)) {
      filtrosTurismo.setAttribute('data-tour-scanned', 'filtros-turismo');
      addBlock(
        'filtros-turismo',
        '[data-tour-scanned="filtros-turismo"]',
        'Filtros de Logística: Tracción y Ley 7600',
        'Filtre los destinos según el tipo de acceso vial requerido (vehículos 4x4 o automóviles bajos) y seleccione la insignia de la Ley 7600 para identificar senderos, miradores y centros de visitantes 100% accesibles.',
        { tipo: 'filtros-traccion', posicion: getElementPosition(filtrosTurismo) }
      );
    }

    const selectorCanton = safeQuerySelector('select[aria-label*="cantón"]') || safeQuerySelector('select') || safeQuerySelector('div:has(> button:has-text("Todos"))');
    if (selectorCanton && isElementVisible(selectorCanton)) {
      selectorCanton.setAttribute('data-tour-scanned', 'selector-canton-turismo');
      addBlock(
        'selector-canton-turismo',
        '[data-tour-scanned="selector-canton-turismo"]',
        'Selector Rápido de Cantones y Destinos',
        'Explore la oferta turística segmentando por cantones emblemáticos como Monteverde, Poás, Quepos, Osa o Talamanca, actualizando el listado en tiempo real.',
        { tipo: 'selector-canton', posicion: getElementPosition(selectorCanton) }
      );
    }

    const tarjetasTurismo = safeQuerySelector('div.grid:has(.civic-card)') || safeQuerySelector('div.grid:has(article)') || mainScope.querySelector('.grid');
    if (tarjetasTurismo && isElementVisible(tarjetasTurismo)) {
      tarjetasTurismo.setAttribute('data-tour-scanned', 'tarjetas-turismo');
      addBlock(
        'tarjetas-turismo',
        '[data-tour-scanned="tarjetas-turismo"]',
        'Fichas de Destinos con Altitud y Biodiversidad',
        'Cada tarjeta turística cuenta con fotografía en alta resolución, altitud oficial en metros sobre el nivel del mar (msnm), descripción de biodiversidad, servicios de parqueo y enlace para integrar al Planificador de Itinerarios con Inteligencia Artificial.',
        { tipo: 'tarjetas-turismo', posicion: getElementPosition(tarjetasTurismo) }
      );
    }

    auditAndCompleteTourSequence(bloques, mainScope, addBlock);

    if (bloques.length >= 2) {
      bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));
      return {
        ruta: currentPath,
        tituloPagina: 'Turismo Cantonal y Destinos',
        bloques,
        elementosVisibles
      };
    }
  }

  // =========================================================================
  // 9. ESCÁNER UNIVERSAL DINÁMICO (Para cualquier otra vista del sistema)
  // Sin límites rígidos: recorre de arriba hacia abajo todos los componentes
  // =========================================================================
  // Bloque 1: Encabezado y Descripción Principal
  const h1 = mainScope.querySelector('h1') || document.querySelector('h1') || mainScope.querySelector('h2');
  if (h1 && isElementVisible(h1)) {
    const headerContainer = h1.closest('header, section, div') || h1.parentElement || h1;
    const titleText = h1.innerText?.trim() || document.title || 'Módulo Activo';
    const pEl = headerContainer.querySelector('p') || mainScope.querySelector('p');
    const paragraphText = pEl?.innerText?.trim() || '';

    headerContainer.setAttribute('data-tour-scanned', 'header-principal');

    let speech = `Nos encontramos en ${titleText}.`;
    if (paragraphText) {
      speech += ` ${paragraphText}`;
    } else {
      speech += ` Esta sección oficial le permite explorar y gestionar los servicios ciudadanos correspondientes a este módulo.`;
    }

    addBlock(
      'header-principal',
      '[data-tour-scanned="header-principal"]',
      titleText,
      speech,
      {
        tipo: 'encabezado',
        titulo: titleText,
        descripcion: paragraphText,
        posicion: getElementPosition(headerContainer)
      }
    );
  }

  // Bloque 2: Acciones Globales / Banners Destacados
  const actionBanners = Array.from(mainScope.querySelectorAll('div, section')).filter((el) => {
    if (!isElementVisible(el) || el === mainScope) return false;
    const txt = el.innerText || '';
    const hasKeywords = /GeoJSON|Exportar|Descargar|Interoperabilidad|Dataset|GIS|Nueva|Crear|Reportar|Solicitar/i.test(txt);
    const hasActionControl = !!el.querySelector('button, a[download], [role="button"]');
    return hasKeywords && hasActionControl && el.children.length >= 1 && el.children.length <= 12;
  });

  if (actionBanners.length > 0) {
    const bannerEl = actionBanners[0];
    bannerEl.setAttribute('data-tour-scanned', 'banner-accion');

    const bannerTitle = bannerEl.querySelector('h2, h3, h4, strong')?.innerText?.trim() || 'Acción Cantonal Destacada';
    const bannerDesc = bannerEl.querySelector('p')?.innerText?.trim() || '';
    const actionBtn = bannerEl.querySelector('button, a[download]');
    const btnText = actionBtn?.innerText?.trim() || 'Ejecutar Acción';

    let speech = `En el bloque de ${bannerTitle}, dispone de la función para ${btnText}.`;
    if (bannerDesc) speech += ` ${bannerDesc}`;

    if (/GeoJSON/i.test(bannerTitle + btnText + bannerDesc)) {
      speech += ` Con este botón de Interoperabilidad GIS puede descargar el archivo oficial en formato GeoJSON para visualizar los puntos de interés e infraestructura cantonal en sistemas cartográficos como Leaflet o Google Maps.`;
    }

    addBlock(
      'banner-accion',
      '[data-tour-scanned="banner-accion"]',
      btnText || bannerTitle,
      speech,
      {
        tipo: 'accion-global',
        titulo: bannerTitle,
        botonTexto: btnText,
        descripcion: bannerDesc,
        posicion: getElementPosition(bannerEl)
      }
    );
  }

  // Bloque 3: Herramientas de Búsqueda y Filtrado
  const searchInput = mainScope.querySelector('input[type="text"], input[type="search"]');
  const allButtons = Array.from(mainScope.querySelectorAll('button')).filter(isElementVisible);
  const filterPills = allButtons.filter((b) => {
    const txt = b.innerText.trim();
    if (!txt || txt.includes('Guía por Voz') || txt.includes('SOS') || txt.includes('Exportar') || txt.includes('Descargar')) return false;
    return txt.length >= 2 && txt.length <= 30;
  });
  const filterSelects = Array.from(mainScope.querySelectorAll('select')).filter(isElementVisible);

  if (searchInput || filterPills.length > 0 || filterSelects.length > 0) {
    const filterContainer =
      searchInput?.closest('div[style*="border"], div[style*="background"], form') ||
      filterPills[0]?.closest('div[style*="border"], div[style*="background"], form') ||
      searchInput?.parentElement ||
      filterPills[0]?.parentElement;

    const targetEl = filterContainer || searchInput;
    targetEl.setAttribute('data-tour-scanned', 'barra-filtros');

    const placeholder = searchInput?.placeholder || 'Buscar por término clave...';
    const pillNames = filterPills.map((p) => p.innerText.trim());
    const selectInfo = filterSelects.map((s) => {
      const label = s.getAttribute('aria-label') || s.previousElementSibling?.innerText || 'Filtro';
      const opts = Array.from(s.options)
        .map((o) => o.text.trim())
        .filter((t) => !t.toLowerCase().includes('todas') && !t.toLowerCase().includes('todos'));
      return `${label}: ${opts.join(', ')}`;
    });

    let speech = `Utilice estos controles para acotar la búsqueda`;
    if (searchInput) speech += ` con el campo de búsqueda ("${placeholder}").`;
    if (pillNames.length > 0) speech += ` Puede alternar entre las categorías: ${pillNames.join(', ')}.`;
    if (selectInfo.length > 0) speech += ` Además, dispone de menús desplegables para filtrar con precisión: ${selectInfo.join('. ')}.`;

    addBlock(
      'barra-filtros',
      '[data-tour-scanned="barra-filtros"]',
      'Herramientas de Búsqueda y Filtrado',
      speech,
      {
        tipo: 'filtros',
        placeholder,
        categorias: pillNames,
        selects: selectInfo,
        posicion: getElementPosition(targetEl)
      }
    );
  }

  // Bloque 4: Catálogo y Cuadrícula de Resultados
  const resultsContainer =
    mainScope.querySelector('section[aria-label], div[style*="grid"], section > div[style*="display: grid"]') ||
    mainScope.querySelector('article')?.parentElement ||
    mainScope.querySelector('[data-tour*="feed"]');

  if (resultsContainer && isElementVisible(resultsContainer)) {
    const cardsGrid = resultsContainer.querySelector('div[style*="grid"]') || resultsContainer;
    cardsGrid.setAttribute('data-tour-scanned', 'grid-resultados');

    const cardElements = Array.from(cardsGrid.children).filter((c) => {
      const hasHeading = !!c.querySelector('h2, h3, h4');
      const isCardLike = c.tagName.toLowerCase() === 'article' || (c.innerText && c.innerText.length > 25 && hasHeading);
      return isElementVisible(c) && isCardLike;
    });

    const cardsData = cardElements.map((card) => {
      const cardTitle = card.querySelector('h2, h3, h4, strong')?.innerText?.trim() || 'Ficha Informativa';
      const mepMatch = card.innerText.match(/MEP-[\w-]+/);
      const codeOrBadge = mepMatch ? mepMatch[0] : (card.querySelector('span[style*="monospace"]')?.innerText?.trim() || '');
      const buttons = Array.from(card.querySelectorAll('button, a')).map((b) => b.innerText.trim()).filter(Boolean);
      return {
        titulo: cardTitle,
        codigo: codeOrBadge,
        acciones: buttons
      };
    });

    const pageH1 = mainScope.querySelector('h1')?.innerText?.trim();
    const dynamicTitle = currentPath.includes('educacion')
      ? 'Fichas de Centros Educativos'
      : (pageH1 ? `Fichas y Registros de ${pageH1}` : 'Catálogo de Resultados');

    let speech = `En esta sección se despliegan los resultados oficiales del módulo.`;
    if (cardsData.length > 0) {
      speech += ` Encontrará registros como ${cardsData[0].titulo}`;
      if (cardsData[0].codigo) speech += ` con código oficial ${cardsData[0].codigo}`;
      if (cardsData[1]) speech += `, y ${cardsData[1].titulo}`;
      speech += `. Cada ficha detalla su descripción, datos de contacto o ubicación y opciones interactivas para consultar detalles.`;
    }

    addBlock(
      'grid-resultados',
      '[data-tour-scanned="grid-resultados"]',
      dynamicTitle,
      speech,
      {
        tipo: 'resultados',
        tarjetas: cardsData,
        posicion: getElementPosition(cardsGrid)
      }
    );
  }

  // =========================================================================
  // 10. AUDITORÍA DE COBERTURA TOTAL (Requerimiento 2 y 3)
  // Revisa componentes interactivos no incluidos y los añade automáticamente
  // =========================================================================
  auditAndCompleteTourSequence(bloques, mainScope, addBlock);

  // Ordenamiento secuencial top-to-bottom riguroso
  bloques.sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));

  return {
    ruta: currentPath,
    tituloPagina: h1?.innerText?.trim() || document.title || 'Módulo Activo',
    bloques,
    elementosVisibles
  };
}

/**
 * Función de Auditoría de Cobertura Total
 * Asegura que ninguna tabla, botón de acción (Waze, GeoJSON, Reservar, Siguiente),
 * o formulario interactivo visible en pantalla quede sin explicar en el recorrido.
 */
function auditAndCompleteTourSequence(bloques, mainScope, addBlock) {
  if (!mainScope) return;

  const existingSelectors = new Set(bloques.map((b) => b.selector));

  // 1. Verificar Tablas interactivas no cubiertas
  const tables = Array.from(mainScope.querySelectorAll('table, .civic-table-container')).filter(isElementVisible);
  tables.forEach((tbl, idx) => {
    if (!tbl.getAttribute('data-tour-scanned') && !tbl.closest('[data-tour-scanned]') && !tbl.querySelector('[data-tour-scanned]')) {
      const dataId = `tabla-audit-${idx}`;
      tbl.setAttribute('data-tour-scanned', dataId);
      const selector = `[data-tour-scanned="${dataId}"]`;
      if (!existingSelectors.has(selector)) {
        existingSelectors.add(selector);
        const headers = Array.from(tbl.querySelectorAll('th')).map((th) => th.innerText.trim()).filter(Boolean);
        addBlock(
          dataId,
          selector,
          'Tabla de Monitoreo y Registros Oficiales',
          `Esta tabla presenta información estructurada con las columnas: ${headers.join(', ')}. Puede revisar cada fila para fiscalizar datos y disponibilidad en tiempo real.`,
          { tipo: 'tabla-audit', posicion: getElementPosition(tbl) }
        );
      }
    }
  });

  // 2. Verificar botones de navegación GPS (Waze / Google Maps) no cubiertos
  const gpsButtons = Array.from(mainScope.querySelectorAll('button, a')).filter((el) => {
    return isElementVisible(el) && !el.getAttribute('data-tour-scanned') && /Waze|Google Maps/i.test(el.innerText || el.getAttribute('href') || '');
  });
  if (gpsButtons.length > 0 && !bloques.some((b) => b.id.includes('gps') || (b.tipo && b.tipo.includes('gps')))) {
    const wazeBtn = gpsButtons[0];
    wazeBtn.setAttribute('data-tour-scanned', 'gps-audit-btn');
    const selector = '[data-tour-scanned="gps-audit-btn"]';
    if (!existingSelectors.has(selector)) {
      existingSelectors.add(selector);
      addBlock(
        'gps-audit-btn',
        selector,
        'Navegación GPS Inmediata (Waze y Google Maps)',
        'Presione los botones de enlace a Waze o Google Maps para iniciar el ruteo por satélite y recibir indicaciones giro a giro hasta las coordenadas oficiales del sitio.',
        { tipo: 'accion-gps', posicion: getElementPosition(wazeBtn) }
      );
    }
  }

  // 3. Verificar botones de acción clave no cubiertos
  const keyActionButtons = Array.from(mainScope.querySelectorAll('button, a')).filter((el) => {
    if (!isElementVisible(el) || el.getAttribute('data-tour-scanned')) return false;
    const txt = el.innerText || '';
    if (txt.includes('Guía por Voz') || txt.includes('SOS')) return false;
    return /Reservar Espacio|Exportar POI GeoJSON|Exportar GeoJSON|Siguiente Paso|Continuar|Nueva Publicación|Validar/i.test(txt);
  });

  keyActionButtons.forEach((actionBtn, idx) => {
    const txt = actionBtn.innerText.trim();
    const dataId = `action-audit-btn-${idx}`;
    actionBtn.setAttribute('data-tour-scanned', dataId);
    const selector = `[data-tour-scanned="${dataId}"]`;
    if (!existingSelectors.has(selector)) {
      existingSelectors.add(selector);
      addBlock(
        dataId,
        selector,
        `Acción Oficial: ${txt}`,
        `Este botón le permite ejecutar la acción "${txt}". Al presionarlo se despliega el flujo interactivo correspondiente para gestionar su trámite o descargar los datos oficiales.`,
        { tipo: 'accion-directa', posicion: getElementPosition(actionBtn) }
      );
    }
  });
}

/**
 * Base de conocimiento estática por ruta como fallback determinista garantizado.
 * Cubre exhaustivamente las 4 secciones críticas con todos sus pasos secuenciales.
 */
export const ROUTE_KNOWLEDGE_BASE = {
  '/': {
    nombre: 'Portal Central de Servicios y Hub Provincial',
    descripcion: 'Hub descentralizado de las 7 provincias soberanas, indicadores demográficos y servicios cantonales.',
    pasosDefault: [
      {
        targetSelector: '[data-tour="nav-institucional"], header nav, header',
        title: 'Navegación Superior y Servicios Cívicos',
        speechText: 'En la barra superior encontrará el acceso directo a los grandes ejes municipales: Gestión y Trámites, Gobierno y Concejo, Territorio y Obras, y Comunidad y CCDR, además del acceso directo al Panel Cívico.',
        tips: 'Pase el cursor sobre cualquier categoría para desplegar trámites directos.'
      },
      {
        targetSelector: '[data-tour="panel-civico-btn"], header button:has-text("Panel Cívico")',
        title: 'Panel Cívico y Herramientas de Accesibilidad',
        speechText: 'El Panel Cívico le permite personalizar la interfaz bajo la Ley 7600: regular el tamaño de letra, alternar entre modos claro y oscuro, y seleccionar entre los 8 idiomas oficiales del sistema.',
        tips: 'Haga clic para configurar accesibilidad y preferencias cívicas.'
      },
      {
        targetSelector: 'header .h-7, [data-tour="cintillo-nacional"], div:has(> span:has-text("REPÚBLICA DE COSTA RICA"))',
        title: 'Sede Electrónica Nacional de Costa Rica',
        speechText: 'Este cintillo oficial certifica la Sede Electrónica Nacional de la República de Costa Rica y el Sistema de Gobiernos Locales, con indicador del cantón activo y acceso a los 84 cantones autónomos.',
        tips: 'Haga clic en el cantón para cambiar la municipalidad activa.'
      },
      {
        targetSelector: 'main h1, [data-tour="hero-title"]',
        title: 'Gobierno Local y Servicios Ciudadanos',
        speechText: 'Bienvenido a la plataforma ciudadana de Costa Rica Unidos: Ventanilla Soberana de Fiscalización, Trámites y Gestión Comunal para los 84 cantones del país bajo el Código Municipal y la Ley N° 8968.',
        tips: 'Todos los servicios cumplen con el marco legal de interoperabilidad estatal.'
      },
      {
        targetSelector: '[data-tour="buscador-civico"], form:has(input[placeholder*="Buscar"])',
        title: 'Buscador Cívico Universal',
        speechText: 'Utilice este buscador universal para localizar trámites oficiales, actas del Concejo Municipal, validación de cédulas ante Hacienda, tasas de patentes y reportes de incidencias viales en tiempo real.',
        tips: 'Escriba palabras como "cédula", "hueco", "acta" o "patente".'
      },
      {
        targetSelector: '[data-tour-scanned="selector-7-provincias"], #exploracion-provincial [role="tablist"], button:has-text("San José")',
        title: 'Selector Emblemático de las 7 Provincias',
        speechText: 'En esta sección territorial puede alternar entre las 7 provincias soberanas: San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón, actualizando la identidad gráfica y los datos territoriales.',
        tips: 'Haga clic en cualquiera de las 7 provincias para actualizar los datos.'
      },
      {
        targetSelector: '[data-tour-scanned="indicadores-provinciales"], #exploracion-provincial .civic-glass-card',
        title: 'Indicadores Provinciales: Población, Superficie y Obras',
        speechText: 'Esta tarjeta consolida los indicadores clave del territorio seleccionado: cifra de Población censada, Superficie total en kilómetros cuadrados y número de Obras y Proyectos Comunales activos en fiscalización pública.',
        tips: 'Muestra estadísticas actualizadas de desarrollo y demografía.'
      },
      {
        targetSelector: '[data-tour-scanned="tabs-submodulos-provinciales"], #exploracion-provincial div:has(> button:has-text("Noticias"))',
        title: 'Submódulos Territoriales de Gestión Cívica',
        speechText: 'Navegue entre los 4 pilares cívicos provinciales: Noticias y Boletines oficiales (M01), Cabildo Digital y Foro Comunal (M04), Capas Cartográficas en Mapa & GIS (M05), y Directorio de PYMES y Ferias del Agricultor (M08 y M10).',
        tips: 'Explore los submódulos específicos para cada provincia.'
      },
      {
        targetSelector: '[data-tour-scanned="feed-provincial"], #exploracion-provincial article, #exploracion-provincial input',
        title: 'Feed Provincial de Noticias y Búsqueda Comunitaria',
        speechText: 'Revise los comunicados oficiales emitidos en la provincia seleccionada y utilice el buscador interno para localizar actas, inauguraciones y avisos de servicios públicos cantonales.',
        tips: 'Utilice el buscador para acotar comunicados y novedades cantonales.'
      }
    ]
  },
  '/seguridad-emergencias': {
    nombre: 'Centro de Operaciones de Emergencia Cantonal (COE / CNE)',
    descripcion: 'Coordinación operativa bajo Ley 8488, alertas CNE, botonera de auxilio 24/7 y red de albergues.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="encabezado-coe"], main section:first-of-type, h1',
        title: 'Centro de Operaciones de Emergencia Cantonal (COE - Ley 8488)',
        speechText: 'Bienvenido al Centro de Operaciones de Emergencia Cantonal y Red de Auxilio. Este módulo coordina las acciones institucionales con los Comités Municipales de Emergencia bajo el marco rector de la Ley Nacional de Emergencias N° 8488.',
        tips: 'En emergencias críticas comuníquese inmediatamente al 9-1-1.'
      },
      {
        targetSelector: '[data-tour-scanned="alerta-activa-cne"], div:has(> span:has-text("ACTIVA")), div:has(> p:has-text("alerta"))',
        title: 'Protocolo de Alerta Activa CNE',
        speechText: 'Monitoree la condición oficial de la Comisión Nacional de Emergencias: actualmente rige Alerta Amarilla Activa con vigilancia técnica reforzada para zonas bajo aviso como el Pacífico Central y Caribe.',
        tips: 'Consulte las zonas bajo aviso para tomar medidas preventivas.'
      },
      {
        targetSelector: '[data-tour-scanned="botonera-auxilio-247"], .botonera-911-grid, section[aria-labelledby="seccion-auxilio"]',
        title: 'Botonera Táctil de Auxilio y Despacho Inmediato (24/7)',
        speechText: 'Canales de auxilio inmediato disponibles las 24 horas: toque cualquier botón para establecer enlace telefónico instantáneo con los cuerpos de rescate del Estado: Central 9-1-1, Fuerza Pública, Bomberos de Costa Rica, Cruz Roja y línea confidencial del OIJ.',
        tips: 'Toque cualquier botón para llamar de forma directa desde su teléfono.'
      },
      {
        targetSelector: '[data-tour-scanned="header-albergues"], #seccion-albergues, h2:has-text("Albergues")',
        title: 'Padrón Nacional de Albergues Temporales CNE',
        speechText: 'Este módulo administra el padrón oficial de albergues y centros de resguardo humanitario habilitados ante inundaciones, deslizamientos o emergencias sísmicas.',
        tips: 'Verifique los centros habilitados en su cantón.'
      },
      {
        targetSelector: '[data-tour-scanned="tabla-albergues"], .civic-table-container, table',
        title: 'Capacidad de Aforo y Ocupación en Tiempo Real',
        speechText: 'En la tabla de monitoreo se desglosa cada refugio oficial, como el Gimnasio Municipal de Turrialba con 85 de 250 personas albergadas, el Salón Comunal de Matina y el Polideportivo de San Carlos, mostrando barras porcentuales de ocupación en tiempo real.',
        tips: 'Revise la disponibilidad de cupos antes de movilizarse.'
      },
      {
        targetSelector: '[data-tour-scanned="servicios-albergue"], .civic-table-container tbody tr:first-child td:nth-child(4), td:has(span)',
        title: 'Dotación de Servicios y Suministros Críticos',
        speechText: 'Cada albergue detalla su equipamiento logístico para la población: tanques de agua potable de 5,000 litros, plantas eléctricas diésel, catres plegables, puestos médicos de la Cruz Roja y raciones alimentarias de la CNE.',
        tips: 'Los centros cuentan con apoyo humanitario oficial.'
      },
      {
        targetSelector: '[data-tour-scanned="acciones-gps-albergue"], a[href*="waze"], button:has-text("Waze"), button:has-text("Google Maps")',
        title: 'Navegación Satelital GPS (Waze y Google Maps)',
        speechText: 'Verifique el estado del albergue y presione los botones de enlace directo a Waze o Google Maps para iniciar la navegación satelital inmediata hacia el punto de resguardo más cercano.',
        tips: 'Toque el botón de Waze o Maps para iniciar la ruta en su teléfono móvil.'
      }
    ]
  },
  '/participacion': {
    nombre: 'Métricas Electorales y Presupuestos Participativos',
    descripcion: 'Fiscalización de presupuestos participativos, conteo de votos en tiempo real y banco de proyectos.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="metricas-participacion"], .grid:has(.font-mono), div:has(> div:has-text("Fondo Presupuestario"))',
        title: 'Indicadores Clave del Presupuesto Participativo 2026',
        speechText: 'Observe los 4 indicadores clave en tiempo real: Fondo Presupuestario de ₡ 225 Millones de colones para proyectos comunales, 1,566 Votos Ciudadanos Emitidos 100% verificados con cédula ante Hacienda, 4 Proyectos Distritales en competencia, y fecha de Cierre del Sufragio el 15 de Noviembre de 2026 para ratificación en sesión municipal.',
        tips: 'Las cifras son inmutables y auditables con cédulas únicas.'
      },
      {
        targetSelector: '[data-tour-scanned="grafico-conteo-votos"], div:has(> .text-cyan-400:has-text("Conteo de Votos")), .lg\\:col-span-7',
        title: 'Conteo de Votos en Tiempo Real y Ranking Distrital',
        speechText: 'En este gráfico reactivo puede fiscalizar el ranking de votación en tiempo real: en primer lugar lidera la Iluminación LED Solar en el distrito El Carmen con 642 votos, seguido por la Ciclovía Segura en Pavas con 489 votos y el Parque Infantil y Biosaludable en Hatillo 4 con 315 votos.',
        tips: 'Las barras porcentuales reflejan el respaldo vecinal auditado.'
      },
      {
        targetSelector: '[data-tour-scanned="grafico-distribucion-presupuesto"], div:has(> .text-emerald-400:has-text("Presupuesto Participativo")), .lg\\:col-span-5',
        title: 'Distribución Presupuestaria Cantonal por Sectores',
        speechText: 'Consulte la distribución porcentual del fondo de 225 millones asignado por sectores: Seguridad y Movilidad representa un 31.1%, Infraestructura y Aceras un 28.9%, Espacios Verdes y Parques un 24.4%, y Cultura y Juventud un 15.6%.',
        tips: 'El desglose presupuestario asegura equilibrio territorial cantonal.'
      },
      {
        targetSelector: '[data-tour-scanned="fiscalizacion-poa"], div:has(> span:has-text("Fiscalización Ciudadana"))',
        title: 'Garantía de Fiscalización Ciudadana y Ejecución en el POA',
        speechText: 'Bajo el marco de transparencia municipal, los proyectos que resulten ganadores por voto vecinal en cada distrito serán ratificados e incorporados obligatoriamente al Plan Operativo Anual (POA) y al presupuesto formal del Concejo Municipal.',
        tips: 'Garantiza que la voluntad comunal sea ejecutada presupuestariamente.'
      },
      {
        targetSelector: '[data-tour-scanned="banco-proyectos-votacion"], div:has(> h2:has-text("Banco de Proyectos")), section:has(button:has-text("Votar"))',
        title: 'Banco de Proyectos Vecinales y Emisión del Voto',
        speechText: 'Explore cada una de las fichas de proyectos vecinales presentados por las Asociaciones de Desarrollo Integral (ADIs), analice su presupuesto en colones y ejerza su voto directo como Ciudadano Verificado Nivel 2.',
        tips: 'Emita su voto con respaldo oficial inmutable.'
      }
    ]
  },
  '/login': {
    nombre: 'Acceso Soberano y Autenticación Cívica',
    descripcion: 'Autenticación ciudadana RBAC, validación de cédula ante Hacienda y marco legal Ley 8968 / 8292.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="login-cabecera"], div:has(> h1:has-text("Acceso Soberano"))',
        title: 'Acceso Soberano y Control RBAC',
        speechText: 'Bienvenido a la ventanilla de Acceso Soberano de la República de Costa Rica. Este sistema implementa Control de Acceso Basado en Roles (RBAC) con protección integral de datos bajo la Ley N° 8968 y auditoría técnica bajo la Ley N° 8292.',
        tips: 'El acceso es individual y garantiza trazabilidad auditada.'
      },
      {
        targetSelector: '[data-tour-scanned="selector-modalidad-auth"], div:has(#tab-btn-login)',
        title: 'Selector de Modalidad: Iniciar Sesión o Crear Cuenta',
        speechText: 'Utilice este selector superior para alternar entre Iniciar Sesión con credenciales existentes o presionar Crear Cuenta para el registro cívico de nuevos ciudadanos con validación oficial.',
        tips: 'Si es su primera vez, seleccione Crear Cuenta.'
      },
      {
        targetSelector: '[data-tour-scanned="input-validacion-cedula"], div:has(#reg-cedula), div:has(#login-identificador)',
        title: 'Validación de Cédula Costarricense o DIMEX ante Hacienda',
        speechText: 'Ingrese su número de cédula física costarricense o DIMEX de 9 a 12 dígitos y presione el botón Validar para realizar la consulta oficial en tiempo real ante el padrón del Ministerio de Hacienda.',
        tips: 'El botón Validar certifica automáticamente sus nombres oficiales.'
      },
      {
        targetSelector: '[data-tour-scanned="campos-datos-personales"], div:has(#reg-nombres)',
        title: 'Datos Personales Oficiales: Nombres y Apellidos',
        speechText: 'El sistema autocompleta su nombre de pila oficial, primer apellido y segundo apellido certificados por el padrón de Hacienda, manteniéndolos editables para corregir tildes o caracteres especiales.',
        tips: 'Verifique que sus nombres coincidan exactamente con su documento de identidad.'
      },
      {
        targetSelector: '[data-tour-scanned="campos-credenciales"], div:has(#reg-email), div:has(#login-password)',
        title: 'Correo Ciudadano y Contraseña Segura',
        speechText: 'Complete su correo electrónico ciudadano para recibir notificaciones de expedientes cívicos y defina su contraseña de acceso protegida mediante encriptación segura y visor de caracteres.',
        tips: 'Utilice una contraseña robusta con letras, números y símbolos.'
      }
    ]
  },
  '/reportar-incidencia': {
    nombre: 'Ventanilla de Fiscalización Ciudadana y Averías Comunales',
    descripcion: 'Radicación de averías viales, luminarias y fugas con evidencia WebP y plazos normados SLA.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="stepper-averias"], .civic-stepper-grid',
        title: 'Flujo Guiado de Radicación en 4 Fases',
        speechText: 'Nos encontramos en la Ventanilla de Fiscalización Ciudadana y Averías Comunales bajo la Ley N° 8968. El trámite se organiza en un flujo guiado de 4 fases: Fase 1 Tipología Técnica, Fase 2 Evidencia WebP con compresión en cliente, Fase 3 Georreferenciación oficial en mapa y Fase 4 Declaración jurada y radicación del expediente administrativo.',
        tips: 'Complete cada fase en orden para formalizar su reporte.'
      },
      {
        targetSelector: '[data-tour-scanned="tipologias-dano"], div:has(> .civic-glass-card), .civic-glass-card',
        title: 'Selección de Tipología de Avería Comunal',
        speechText: 'Dispone de 4 tipologías técnicas normadas para clasificar el incidente: Hueco vial o bache en asfalto, Luminaria pública dañada o apagada, Fuga de agua potable o alcantarilla colapsada, y Basurero clandestino o escombros. La selección precisa enruta el ticket a la entidad competente.',
        tips: 'Haga clic en la tarjeta correspondiente al daño reportado.'
      },
      {
        targetSelector: '[data-tour-scanned="ficha-tecnica-sla"], .civic-glass-card[aria-pressed="true"], .civic-glass-card',
        title: 'Competencia Institucional y Plazos Normados SLA',
        speechText: 'Cada tipología especifica la entidad pública responsable (como el MOPT o la Municipalidad en vialidad, CNFL e ICE en alumbrado, y AyA en acueductos), junto con el plazo normado de atención de 3 a 5 días hábiles conforme al marco reglamentario.',
        tips: 'El ticket genera un número de expediente auditable.'
      },
      {
        targetSelector: '[data-tour-scanned="btn-avanzar-evidencia"], button:has-text("Siguiente Paso"), button:has-text("Siguiente"), button:has-text("Continuar")',
        title: 'Avance a Evidencia Fotográfica WebP',
        speechText: 'Presione este botón de Siguiente Paso para avanzar a la fase 2 de evidencia fotográfica procesada con compresión WebP en el navegador y consentir el tratamiento cívico de datos bajo la Ley N° 8968.',
        tips: 'Asegúrese de adjuntar una foto clara del daño.'
      }
    ]
  },
  '/feria': {
    nombre: 'Plataforma Oficial de la Feria del Agricultor Cantonal',
    descripcion: 'Zonificación de puestos P-12 a P-50, trazabilidad de agricultores CAC/MAG y precios CNP-SIME.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="sectores-feria"], div:has(> button:has-text("Frutas")), div:has(> button:has-text("Verduras"))',
        title: 'Sectores Agrícolas de la Feria Cantonal',
        speechText: 'Utilice los filtros superiores para explorar los sectores del predio ferial: Frutas Tropicales, Verduras y Hortalizas, Lácteos y Quesos, Carnes y Embutidos, y Sodas de comida típica costarricense.',
        tips: 'Filtre por tipo de alimento para ubicar los puestos deseados.'
      },
      {
        targetSelector: '[data-tour-scanned="croquis-plano"], div:has(> h4:has-text("Plano")), div[style*="radial-gradient"]',
        title: 'Plano Interactivo de Puestos (P-12 al P-50)',
        speechText: 'Este croquis interactivo representa la distribución física de los puestos (desde el P-12 hasta el P-50). Al hacer clic sobre cualquier casilla de puesto, el sistema resalta su ubicación y despliega en tiempo real la ficha completa del productor asignado.',
        tips: 'Toque cualquier casilla de puesto para consultar al agricultor.'
      },
      {
        targetSelector: '[data-tour-scanned="ficha-productor"], div:has(span:has-text("CAC")), div:has(span:has-text("PRODUCTOR"))',
        title: 'Ficha de Trazabilidad y Acreditación del Productor',
        speechText: 'La ficha del agricultor muestra el nombre del titular, su cantón y finca de origen, el número de carné del Centro Agrícola Cantonal (CAC) y los sellos de producción orgánica certificados por el Ministerio de Agricultura y Ganadería (MAG).',
        tips: 'Compre con garantía de trazabilidad y apoyo directo al productor local.'
      },
      {
        targetSelector: '[data-tour-scanned="precios-calendario"], #titulo-precios-cnp, .civic-table-container, table',
        title: 'Precios Oficiales CNP-SIME y Calendario de Cosechas',
        speechText: 'Consulte el catálogo oficial de precios de referencia del CNP y el calendario trimestral de cosechas, que evidencia ahorros directos para el consumidor de entre el 30% y el 50% en comparación con las cadenas de supermercados.',
        tips: 'Verifique precios mayoristas y minoristas oficiales.'
      }
    ]
  },
  '/deportes': {
    nombre: 'Comité Cantonal de Deportes y Recreación (CCDR)',
    descripcion: 'Padrón de polideportivos, semáforo de disponibilidad y reserva de espacios.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="tabs-deportes"], [role="tablist"][aria-label*="CCDR"], div:has(> button:has-text("Instalaciones"))',
        title: 'Pestañas de Gestión Deportiva Cantonal (CCDR)',
        speechText: 'Desde esta barra puede alternar entre los tres ejes del Comité Cantonal de Deportes y Recreación: la red de Instalaciones Públicas, las convocatorias de Juegos Deportivos Nacionales (JDN) y las Escuelas de Iniciación Deportiva.',
        tips: 'Navegue entre complejos comunales y convocatorias juveniles.'
      },
      {
        targetSelector: '[data-tour-scanned="semaforo-deportes"], button:has-text("Abierto al Público"), div:has(> button:has-text("Mantenimiento"))',
        title: 'Semáforo de Disponibilidad Operativa',
        speechText: 'Filtre los espacios con el semáforo institucional: indicador Verde para instalaciones Abiertas al Público y disponibles, indicador Amarillo para canchas en Mantenimiento técnico, e indicador Azul para horarios Reservados para Escuelas.',
        tips: 'Consulte el estado operativo antes de programar su encuentro deportivo.'
      },
      {
        targetSelector: '[data-tour-scanned="fichas-instalaciones"], div[style*="grid"]:has(.civic-card), section[aria-label*="Instalaciones"]',
        title: 'Fichas Técnicas de Polideportivos y Complejos',
        speechText: 'Cada complejo deportivo detalla su aforo máximo, horarios de atención diurna y nocturna, tarifa social municipal por hora y su certificación de accesibilidad total para personas con discapacidad bajo la Ley 7600.',
        tips: 'Revise requisitos de calzado y normativas de uso.'
      },
      {
        targetSelector: '[data-tour-scanned="btn-reservar-espacio"], button:has-text("Reservar Espacio"), button:has-text("Reservar")',
        title: 'Reserva Cívica y Solicitud de Espacio Deportivo',
        speechText: 'Presione el botón "Reservar Espacio" para abrir el formulario digital de apartado de horario, donde podrá solicitar uso comunitario o competitivo y recibir su comprobante oficial emitido por el CCDR.',
        tips: 'Complete el formulario para recibir su confirmación digital.'
      }
    ]
  },
  '/turismo': {
    nombre: 'Guía de Turismo Cantonal y Aventura Sostenible',
    descripcion: 'Catálogo de destinos con filtros de tracción 4x4, Ley 7600 y exportación GeoJSON.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="header-turismo"], button:has-text("Exportar POI GeoJSON"), button:has-text("GeoJSON")',
        title: 'Catálogo de Destinos y Exportación GeoJSON (GIS)',
        speechText: 'Bienvenido a la Guía de Turismo Cantonal y Aventura Sostenible. En la cabecera dispone del botón "Exportar POI GeoJSON (GIS)" para descargar las coordenadas WGS84 de parques nacionales, miradores y reservas biológicas para visores cartográficos.',
        tips: 'Descargue el dataset GeoJSON para usar en Leaflet o Google Maps.'
      },
      {
        targetSelector: '[data-tour-scanned="filtros-turismo"], button:has-text("Ley 7600 Total"), button:has-text("Tracción 4x4")',
        title: 'Filtros de Logística: Tracción y Ley 7600',
        speechText: 'Filtre los destinos según el tipo de acceso vial requerido (vehículos 4x4 o automóviles bajos) y seleccione la insignia de la Ley 7600 para identificar senderos, miradores y centros de visitantes 100% accesibles.',
        tips: 'Verifique si su vehículo es apto para la ruta de montaña.'
      },
      {
        targetSelector: '[data-tour-scanned="selector-canton-turismo"], select[aria-label*="cantón"], select',
        title: 'Selector Rápido de Cantones y Destinos',
        speechText: 'Explore la oferta turística segmentando por cantones emblemáticos como Monteverde, Poás, Quepos, Osa o Talamanca, actualizando el listado en tiempo real.',
        tips: 'Explore los 84 cantones con oferta ecoturística.'
      },
      {
        targetSelector: '[data-tour-scanned="tarjetas-turismo"], div.grid:has(article), div.grid:has(.civic-card), div.grid',
        title: 'Fichas de Destinos con Altitud y Biodiversidad',
        speechText: 'Cada tarjeta turística cuenta con fotografía en alta resolución, altitud oficial en metros sobre el nivel del mar (msnm), descripción de biodiversidad, servicios de parqueo y enlace para integrar al Planificador de Itinerarios con Inteligencia Artificial.',
        tips: 'Haga clic en una tarjeta para ver la ficha completa y recomendaciones.'
      }
    ]
  },
  '/educacion': {
    nombre: 'Directorio Cantonal de Centros Educativos y CTPs',
    descripcion: 'Oferta académica cantonal desde preescolar hasta universidades, especialidades CTP y capas GIS.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="header-principal"], h1',
        title: 'Directorio Cantonal de Centros Educativos',
        speechText: 'Nos encontramos en el Directorio Cantonal de Centros Educativos y Colegios Técnicos. Esta sección le permite explorar la oferta académica del cantón desde preescolar hasta universidades y descargar coordenadas oficiales.',
        tips: 'Consulte la oferta de centros oficiales del MEP en el cantón.'
      },
      {
        targetSelector: '[data-tour-scanned="banner-accion"], div:has(button)',
        title: 'Exportar Dataset GeoJSON POI',
        speechText: 'Con este botón de Interoperabilidad GIS puede descargar el archivo oficial en formato GeoJSON para visualizar los centros educativos y paradas escolares en sistemas cartográficos como Leaflet o Google Maps.',
        tips: 'Descarga un archivo GeoJSON WGS84 para capas cartográficas.'
      },
      {
        targetSelector: '[data-tour-scanned="barra-filtros"], div:has(input[type="text"])',
        title: 'Filtros por Nivel y Especialidad',
        speechText: 'Utilice estos controles para acotar la búsqueda por nombre, distrito o nivel educativo entre Preescolar, Primaria, Secundaria y CTP, así como el selector de especialidades técnicas de alta demanda.',
        tips: 'Filtre por especialidades técnicas como Ciberseguridad o Desarrollo Web.'
      },
      {
        targetSelector: '[data-tour-scanned="grid-resultados"], section[aria-label], div[style*="grid"]',
        title: 'Fichas de Centros Educativos',
        speechText: 'En esta cuadrícula se despliegan los colegios del cantón, como el CTP de San Sebastián y el CTP de Pavas, indicando su código oficial del MEP y opciones para consultar su ficha técnica o verlos en el mapa GIS.',
        tips: 'Haga clic en el botón de coordenadas POI para situar el colegio en el visor GIS.'
      }
    ]
  },
  '/foro': {
    nombre: 'Foro Tico Soberano — Módulo 04 Participación Ciudadana',
    descripcion: 'Espacio de deliberación cívica y comunitaria organizada a nivel nacional y provincial.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="header-principal"], h1',
        title: 'Foro Tico Soberano',
        speechText: 'Bienvenido al Foro Tico. Aquí los ciudadanos proponen soluciones comunitarias y participan en debates de alcance cantonal y nacional.',
        tips: 'Todas las iniciativas tienen persistencia real y respaldo cívico en el sistema.'
      },
      {
        targetSelector: '[data-tour="selector-ambito-territorial"], section > div:first-child, h2',
        title: 'Ámbito Territorial del Debate',
        speechText: 'Como ciudadano tiene acceso exclusivo al Foro Nacional y al foro de su propia provincia registrada bajo el sistema RBAC.',
        tips: 'Seleccione entre Foro Nacional o su provincia para segmentar las conversaciones cívicas.'
      },
      {
        targetSelector: '[data-tour="btn-crear-post"], button:has(svg), button',
        title: 'Publicar en Foro Tico',
        speechText: 'Presione este botón para presentar una nueva propuesta vecinal o abrir un debate cívico con sus vecinos.',
        tips: 'Su identidad está protegida bajo la Ley 8968, mostrando únicamente su primer nombre y apellido.'
      },
      {
        targetSelector: '[data-tour-scanned="barra-filtros"], [data-tour="buscador-foro"], input[type="text"]',
        title: 'Buscador y Filtros Cívicos',
        speechText: 'Filtre las iniciativas por eje temático como seguridad, agua, infraestructura o gobernanza, u ordene por votos y comentarios.',
        tips: 'Escriba palabras clave para encontrar propuestas vecinales de su comunidad.'
      },
      {
        targetSelector: '[data-tour-scanned="grid-resultados"], [data-tour="feed-publicaciones-foro"], article, section > div',
        title: 'Feed de Iniciativas y Votación',
        speechText: 'Revise las propuestas registradas, emita su voto cívico, reaccione con ideas o aporte comentarios constructivos.',
        tips: 'Su voto queda registrado de manera transparente y vinculado a su cuenta ciudadana.'
      }
    ]
  },
  '/noticias': {
    nombre: 'Portal de Noticias y Comunicados Municipales (M01)',
    descripcion: 'Feed social vertical con comunicados oficiales, obras públicas y eventos cantonales.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="header-principal"], h1',
        title: 'Muro Social Cantonal',
        speechText: 'Este es el muro oficial de comunicados y rendición de cuentas de los 84 gobiernos locales de Costa Rica.',
        tips: 'Los comunicados son emitidos por los alcaldes y concejos municipales verificados.'
      },
      {
        targetSelector: '[data-tour-scanned="barra-filtros"], input[type="text"]',
        title: 'Buscador de Comunicados',
        speechText: 'Localice avisos oficiales por tema, obra comunal, fecha o palabra clave de interés.',
        tips: 'Busque términos como "agua", "reciclaje", "presupuesto" o "obras".'
      },
      {
        targetSelector: '[data-tour-scanned="grid-resultados"], article, div[style*="grid"] > div',
        title: 'Publicaciones y Reacciones Cívicas',
        speechText: 'Cada noticia muestra información completa, galería de fotos, reacciones comunitarias y comentarios directamente integrados.',
        tips: 'Participe comentando constructivamente con su identidad protegida.'
      }
    ]
  },
  '/mapa-gis': {
    nombre: 'Cartografía 3D Soberana y Visor GIS',
    descripcion: 'Visualizador geoespacial cantonal con capas de obras, infraestructura y zonas de riesgo.',
    pasosDefault: [
      {
        targetSelector: 'h1, header',
        title: 'Visor Geoespacial Territorial',
        speechText: 'Explore la división territorial, distritos y obras públicas de Costa Rica en tres dimensiones.',
        tips: 'Puede rotar e inclinar el mapa utilizando el botón derecho del ratón o dos dedos en pantalla táctil.'
      },
      {
        targetSelector: 'aside, nav, div[style*="absolute"]',
        title: 'Selector de Capas y Temas',
        speechText: 'Active o desactive capas temáticas como centros de salud, escuelas, albergues de emergencia y rutas viales.',
        tips: 'Las capas se actualizan con datos abiertos del MOPT y de la CNE.'
      },
      {
        targetSelector: 'canvas, .maplibregl-canvas, .leaflet-container, div[id*="map"]',
        title: 'Lienzo Cartográfico Interactivo',
        speechText: 'Haga clic sobre cualquier polígono cantonal o marcador para consultar su ficha técnica y presupuestos asignados.',
        tips: 'Haga doble clic para acercar el visor a nivel distrital.'
      }
    ]
  }
};

/**
 * Normaliza la ruta actual para buscar coincidencias en la base de conocimiento
 */
export function normalizePath(path) {
  if (!path || path === '/' || path === '/inicio') return '/';
  const clean = path.split('?')[0].split('#')[0];
  if (clean.startsWith('/educacion')) return '/educacion';
  if (clean.startsWith('/noticias') || clean.startsWith('/comunicados')) return '/noticias';
  if (clean.startsWith('/foro')) return '/foro';
  if (clean.startsWith('/mapa') || clean.startsWith('/territorio') || clean.startsWith('/visor') || clean.startsWith('/gis')) return '/mapa-gis';
  if (clean.startsWith('/perfil')) return '/perfil';
  if (clean.startsWith('/portal')) return '/portal-ciudadano';
  if (clean.startsWith('/comercio') || clean.startsWith('/pymes')) return '/comercio';
  if (clean.startsWith('/reportar') || clean.startsWith('/reportes')) return '/reportar-incidencia';
  if (clean.startsWith('/seguridad') || clean.startsWith('/emergencias') || clean.startsWith('/sos')) return '/seguridad-emergencias';
  if (clean.startsWith('/feria')) return '/feria';
  if (clean.startsWith('/deportes')) return '/deportes';
  if (clean.startsWith('/turismo')) return '/turismo';
  if (clean.startsWith('/participacion') || clean.startsWith('/votar')) return '/participacion';
  if (clean.startsWith('/login') || clean.startsWith('/register') || clean.startsWith('/registro') || clean.startsWith('/registrarse')) return '/login';
  return clean;
}

/**
 * Analiza la pantalla activa y genera la lista completa de pasos del recorrido
 * utilizando Gemini 3.6 Flash / 2.0 Flash o el motor de respaldo local determinista y profundo.
 */
export async function analyzePageAndGenerateTour(currentPath = '/', canton = 'San José', lang = 'es-CR') {
  const pathNormal = normalizePath(currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/'));
  const routeKnowledge = ROUTE_KNOWLEDGE_BASE[pathNormal] || {
    nombre: `Módulo Cívico (${currentPath})`,
    descripcion: 'Página de la plataforma Costa Rica Unidos',
    pasosDefault: []
  };

  const contextData = scanCurrentPageElements();
  const pageTitle = contextData.tituloPagina || routeKnowledge.nombre;

  console.log('[Guía Gemini] Ruta detectada:', contextData.ruta);
  console.log('[Guía Gemini] Bloques funcionales detectados:', contextData.bloques.length, contextData.bloques);

  // Intentar consulta a la API de Gemini 3.6 Flash con timeout resiliente de 4.5 segundos
  const apiKey = getGeminiApiKey();

  if (apiKey && contextData.bloques.length > 0) {
    console.log('[Guía Gemini] Consultando a Gemini con contexto profundo del DOM...');
    try {
      const aiPromise = requestGeminiTourSequence({
        path: contextData.ruta,
        pageTitle,
        bloques: contextData.bloques,
        canton,
        lang,
        apiKey
      });

      // Timeout de 4.5 segundos garantizado
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de 4.5s superado en llamada a Gemini')), 4500)
      );

      const aiSteps = await Promise.race([aiPromise, timeoutPromise]);

      if (aiSteps && Array.isArray(aiSteps) && aiSteps.length >= 2) {
        console.log(`[Guía Gemini] Guion exhaustivo (${aiSteps.length} pasos) generado exitosamente por Gemini:`, aiSteps);
        return {
          steps: aiSteps,
          fromAi: true,
          pageTitle
        };
      }
    } catch (err) {
      console.warn('[Guía Gemini] Excepción o timeout con Gemini (activando motor local determinista profundo):', err.message);
    }
  } else {
    if (!apiKey) {
      console.log('[Guía Gemini] Sin API Key de Gemini configurada. Activando motor de respaldo contextual profundo...');
    }
  }

  // Mecanismo de Doble Motor: Activación inmediata del guion local determinista profundo
  console.log('[Guía Gemini] Activando guion determinista profundo para:', pathNormal);
  const fallbackSteps = buildDeterministicSteps(pathNormal, contextData, routeKnowledge, canton);

  console.log('[Guía Gemini] Pasos finales preparados para el tour:', fallbackSteps.length);

  return {
    steps: fallbackSteps,
    fromAi: false,
    pageTitle
  };
}

/**
 * Solicita a Gemini la secuencia estructurada de pasos con el prompt reingenierizado.
 * Exige cobertura total paso por paso sin límites artificiales ni truncamientos.
 */
async function requestGeminiTourSequence({ path, pageTitle, bloques, canton, lang, apiKey }) {
  const systemPrompt = `Eres el Arquitecto Senior de Interfaces Conversacionales y Accesibilidad de Costa Rica Unidos (Gemini 3.6 Flash).
Tu misión es generar un recorrido por voz didáctico, exhaustivo y de alta fidelidad para la pantalla activa del ciudadano en el cantón de "${canton}".

DATOS ESTRUCTURADOS EXTRAÍDOS DEL DOM REAL DE LA PANTALLA ACTIVA:
- Ruta: "${path}"
- Título Oficial: "${pageTitle}"
- Cantón: "${canton}"
- Total de componentes funcionales escaneados: ${bloques.length}
- Bloques funcionales escaneados con su texto literal y componentes:
${JSON.stringify(bloques, null, 2)}

DIRECTRICES OBLIGATORIAS:
1. COBERTURA TOTAL DE TODOS LOS COMPONENTES (PROHIBIDO LIMITAR A 4 PASOS):
   Debes generar exactamente UN paso por CADA uno de los ${bloques.length} bloques proporcionados en el JSON de entrada, sin omitir ni truncar ninguno.
2. PROHIBIDO EL TEXTO GENÉRICO:
   Debes referirte literal y explícitamente a los títulos, botones, cifras numéricas (como presupuestos en colones o votos), filtros y párrafos extraídos en el JSON.
3. LECTURA Y EXPLICACIÓN FUNCIONAL PRECISA:
   - Para Encabezados y Descripciones: Lee e integra el título del módulo y el texto descriptivo real.
   - Para Cifras y Métricas: Lee los valores literales (por ejemplo: "₡ 225 Millones", "1,566 Votos Ciudadanos Emitidos", "Nivel Amarillo Activo").
   - Para Banners, Tablas y Botoneras: Explica con precisión la función (por ejemplo: marcado telefónico 911/Bomberos/Cruz Roja, aforos de albergues CNE, o ruteo Waze/Google Maps).
   - Para Formularios: Explica los campos de cédula, validación ante Hacienda, datos personales y contraseñas.
4. ORDEN SECUENCIAL STRICT TOP-TO-BOTTOM:
   Ordena los pasos de arriba hacia abajo respetando la posición visual de lectura natural del ciudadano en la pantalla.
5. FORMATO DE SALIDA ESTRICTO:
   Responde ÚNICA Y EXCLUSIVAMENTE con un JSON array válido sin bloques markdown (\`\`\`json) ni texto previo o posterior.
   Cada elemento del array debe tener exactamente:
   {
     "selector": "<selector CSS exacto provisto en el bloque>",
     "titulo": "<título breve y descriptivo del paso>",
     "locucion": "<explicación exhaustiva, natural y fluida en español costarricense, lista para síntesis de voz TTS>",
     "tips": "<consejo práctico para el ciudadano>"
   }`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: systemPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 3500,
      topP: 0.85
    }
  };

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(`${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) continue;

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
              .map((p) => ({
                targetSelector: p.selector || p.targetSelector,
                selector: p.selector || p.targetSelector,
                title: p.titulo || p.title || 'Componente Cívico',
                titulo: p.titulo || p.title || 'Componente Cívico',
                speechText: p.locucion || p.speechText || 'Componente de interacción ciudadana.',
                locucion: p.locucion || p.speechText || 'Componente de interacción ciudadana.',
                tips: p.tips || 'Presione Siguiente para continuar.'
              }))
              .filter((p) => p.targetSelector && safeQuerySelector(p.targetSelector));
          }
        }
      }
    } catch (e) {
      console.warn(`[Gemini API] Error con modelo ${model}:`, e);
    }
  }

  return null;
}

/**
 * Construye pasos deterministas profundos fusionando el escaneo jerárquico del DOM
 * con los textos literales reales sin ningún límite artificial de pasos.
 */
export function buildDeterministicSteps(pathNormal, scannedContext, routeKnowledge, canton) {
  const bloques = scannedContext?.bloques || [];

  // 1. Si el Deep DOM Scanner encontró bloques funcionales reales, utilizarlos directamente todos
  if (bloques && bloques.length >= 2) {
    // Asegurar orden top-to-bottom
    const sortedBloques = [...bloques].sort((a, b) => (a.posicion?.top || 0) - (b.posicion?.top || 0));

    return sortedBloques.map((bloque, index) => {
      let tips = 'Presione Siguiente para continuar con el recorrido asistido.';
      if (bloque.tipo === 'navegacion') {
        tips = 'Explore las categorías principales de trámites y gobierno local.';
      } else if (bloque.tipo === 'panel-civico') {
        tips = 'Configure el tamaño de texto, contraste e idiomas bajo la Ley 7600.';
      } else if (bloque.tipo === 'cintillo-nacional') {
        tips = 'Haga clic en el nombre del cantón para cambiar de municipalidad.';
      } else if (bloque.tipo === 'hero-title') {
        tips = 'Servicios sincronizados bajo el Código Municipal y la Ley N° 8968.';
      } else if (bloque.tipo === 'buscador') {
        tips = 'Escriba palabras como "cédula", "hueco" o "patente" para resultados inmediatos.';
      } else if (bloque.tipo === 'encabezado-coe') {
        tips = 'Marco normativo formal de la Comisión Nacional de Emergencias (CNE).';
      } else if (bloque.tipo === 'alerta-cne') {
        tips = 'Consulte el mapa de zonas bajo aviso para actuar oportunamente.';
      } else if (bloque.tipo === 'botonera-auxilio') {
        tips = 'Toque cualquier botón para llamar de forma directa desde su teléfono.';
      } else if (bloque.tipo === 'encabezado-albergues') {
        tips = 'Red oficial de refugios temporales coordinados con el Comité Cantonal.';
      } else if (bloque.tipo === 'tabla-aforo') {
        tips = 'Revise la ocupación porcentual en tiempo real del albergue antes de dirigirse.';
      } else if (bloque.tipo === 'suministros') {
        tips = 'Los albergues cuentan con tanques de agua, generadores y atención médica de la Cruz Roja.';
      } else if (bloque.tipo === 'ruteo-gps') {
        tips = 'Toque el botón de Waze o Google Maps para iniciar la ruta en su teléfono móvil.';
      } else if (bloque.tipo === 'metricas-electorales') {
        tips = 'Fondos públicos auditables con votos verificados ante Hacienda.';
      } else if (bloque.tipo === 'conteo-votos') {
        tips = 'El escrutinio distrital se actualiza en tiempo real de forma inmutable.';
      } else if (bloque.tipo === 'distribucion-presupuesto') {
        tips = 'Conozca la inversión proyectada por eje sectorial cantonal.';
      } else if (bloque.tipo === 'fiscalizacion-poa') {
        tips = 'Los proyectos ganadores se incorporan al POA municipal obligatorio.';
      } else if (bloque.tipo === 'banco-proyectos') {
        tips = 'Participe ejerciendo su voto como Ciudadano Verificado Nivel 2.';
      } else if (bloque.tipo === 'login-cabecera') {
        tips = 'Acceso seguro con cifrado y auditoría bajo la Ley 8968 y 8292.';
      } else if (bloque.tipo === 'selector-modalidad') {
        tips = 'Alterne entre Iniciar Sesión o Crear Cuenta según su condición.';
      } else if (bloque.tipo === 'input-cedula') {
        tips = 'El botón Validar consulta el padrón del Ministerio de Hacienda.';
      } else if (bloque.tipo === 'datos-personales') {
        tips = 'Verifique sus nombres oficiales certificados por el padrón de Hacienda.';
      } else if (bloque.tipo === 'credenciales-seguras') {
        tips = 'Defina una contraseña segura para proteger su expediente cívico personal.';
      } else if (bloque.tipo === 'stepper') {
        tips = 'Complete las 4 fases en orden para radicar su expediente administrativo.';
      } else if (bloque.tipo === 'tipologias') {
        tips = 'Seleccione la tipología que mejor describa la avería comunal.';
      } else if (bloque.tipo === 'sla') {
        tips = 'Los plazos SLA están normados por ley para inspección y reparación.';
      } else if (bloque.tipo === 'accion-avance') {
        tips = 'Presione para continuar al paso de adjuntar evidencia fotográfica WebP.';
      } else if (bloque.tipo === 'sectores') {
        tips = 'Filtre por Frutas, Verduras, Lácteos, Carnes o Sodas Típicas.';
      } else if (bloque.tipo === 'croquis') {
        tips = 'Toque cualquier casilla de puesto (P-12 a P-50) para ver al agricultor en tiempo real.';
      } else if (bloque.tipo === 'productor') {
        tips = 'Verifique el carné CAC y los sellos de producción orgánica MAG.';
      } else if (bloque.tipo === 'precios-cnp') {
        tips = 'Compruebe el ahorro del 30% al 50% respecto a los precios de supermercado.';
      } else if (bloque.tipo === 'tabs') {
        tips = 'Alterne entre Instalaciones, Juegos Deportivos Nacionales y Escuelas CCDR.';
      } else if (bloque.tipo === 'semaforo') {
        tips = 'Verde: Abierto, Amarillo: Mantenimiento, Azul: Reservado.';
      } else if (bloque.tipo === 'accion-reserva') {
        tips = 'Presione para solicitar el apartado horario del polideportivo.';
      } else if (bloque.tipo === 'encabezado-geojson') {
        tips = 'Descargue el dataset GeoJSON WGS84 para capas cartográficas en Leaflet o Google Maps.';
      } else if (bloque.tipo === 'filtros-traccion') {
        tips = 'Verifique si el destino requiere vehículo 4x4 o cuenta con acceso Ley 7600.';
      } else if (bloque.tipo === 'selector-provincias') {
        tips = 'Alterne entre las 7 provincias para actualizar la información y los indicadores.';
      } else if (bloque.tipo === 'indicadores-provinciales') {
        tips = 'Consulte los datos oficiales de Población, Superficie y Obras en fiscalización.';
      } else if (bloque.tipo === 'tabs-provinciales') {
        tips = 'Explore Noticias M01, Foro M04, Mapa M05 y Comercio M08/10.';
      } else if (bloque.tipo === 'accion-global') {
        tips = 'Presione el botón para exportar las coordenadas en GeoJSON estándar WGS84.';
      } else if (bloque.tipo === 'filtros') {
        tips = 'Combine la búsqueda por texto y los filtros por nivel para resultados exactos.';
      } else if (bloque.tipo === 'resultados') {
        tips = 'Haga clic en la tarjeta o en el botón de coordenadas POI para situarlo en el mapa.';
      }

      return {
        targetSelector: bloque.selector,
        selector: bloque.selector,
        title: bloque.titulo || `Paso ${index + 1}`,
        titulo: bloque.titulo || `Paso ${index + 1}`,
        speechText: bloque.locucionSugerida,
        locucion: bloque.locucionSugerida,
        tips
      };
    });
  }

  // 2. Si hay pasos en la base de conocimiento por ruta y sus elementos existen en el DOM
  const defaultSteps = routeKnowledge?.pasosDefault || [];
  const validDefaultSteps = defaultSteps.filter((st) => !!safeQuerySelector(st.targetSelector));
  if (validDefaultSteps.length >= 2) {
    return validDefaultSteps.map((st) => ({
      targetSelector: st.targetSelector || st.selector,
      selector: st.selector || st.targetSelector,
      title: st.title || st.titulo,
      titulo: st.titulo || st.title,
      speechText: st.speechText || st.locucion,
      locucion: st.locucion || st.speechText,
      tips: st.tips || 'Presione Siguiente para continuar.'
    }));
  }

  // Si hay pasos predefinidos en la base de conocimiento, utilizarlos aunque algún selector requiera fallback
  if (defaultSteps.length > 0) {
    return defaultSteps.map((st) => ({
      targetSelector: st.targetSelector || st.selector,
      selector: st.selector || st.targetSelector,
      title: st.title || st.titulo,
      titulo: st.titulo || st.title,
      speechText: st.speechText || st.locucion,
      locucion: st.locucion || st.speechText,
      tips: st.tips || 'Presione Siguiente para continuar.'
    }));
  }

  // 3. Fallback de emergencia garantizado
  return [
    {
      targetSelector: 'main h1, h1, header',
      selector: 'main h1, h1, header',
      title: 'Módulo Activo de la Plataforma',
      titulo: 'Módulo Activo de la Plataforma',
      speechText: `Nos encontramos en la vista oficial de Costa Rica Unidos para el cantón de ${canton}. Todos los servicios se encuentran sincronizados en tiempo real.`,
      locucion: `Nos encontramos en la vista oficial de Costa Rica Unidos para el cantón de ${canton}. Todos los servicios se encuentran sincronizados en tiempo real.`,
      tips: 'Utilice el menú superior o los botones principales para interactuar.'
    },
    {
      targetSelector: 'header nav, header, [data-tour="nav-institucional"]',
      selector: 'header nav, header, [data-tour="nav-institucional"]',
      title: 'Barra de Servicios Cívicos',
      titulo: 'Barra de Servicios Cívicos',
      speechText: 'Desde la barra superior puede acceder a trámites, noticias, participación y gobierno local.',
      locucion: 'Desde la barra superior puede acceder a trámites, noticias, participación y gobierno local.',
      tips: 'Haga clic en cualquiera de las opciones para explorar.'
    }
  ];
}

/**
 * Genera un recorrido de emergencia garantizado
 */
export function getEmergencyTour(path = '/', canton = 'San José') {
  const norm = normalizePath(path);
  const routeKb = ROUTE_KNOWLEDGE_BASE[norm] || ROUTE_KNOWLEDGE_BASE['/'];
  return {
    pageTitle: routeKb.nombre,
    steps: buildDeterministicSteps(norm, null, routeKb, canton),
    fromAi: false
  };
}
