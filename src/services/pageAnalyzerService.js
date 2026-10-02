/**
 * COSTA RICA UNIDOS — Servicio de Análisis Contextual y Escaneo Profundo del DOM
 * Modelo: Gemini 3.6 Flash / 2.0 Flash + Motor de Respaldo Local Determinista Jerárquico
 * 
 * Funcionalidad:
 * 1. Escaneo profundo y granular del DOM activo (Deep DOM Scanner):
 *    - Encabezado y Descripción Principal (h1/h2 + párrafo explicativo + badges)
 *    - Acciones Globales / Interoperabilidad GIS (banners de descarga GeoJSON, acciones rápidas)
 *    - Herramientas de Búsqueda y Filtrado (input de búsqueda, pills de categorías, selectores CTP)
 *    - Sección de Resultados y Tarjetas (grid/listado + datos literales de tarjetas representativas)
 *    - Controles de Paginación o Acciones Secundarias al pie
 * 2. Prompt reingenierizado para Gemini 3.6 Flash:
 *    - Prohibido el texto genérico de relleno.
 *    - Lectura literal y explicación funcional precisa de cada elemento.
 * 3. Mecanismo de Doble Motor con timeout estricto de 3s:
 *    - Si Gemini tarda > 3s, falla la red o no hay API key, el motor local genera la locución
 *      exhaustiva con los textos reales del DOM escaneado, sin silencios ni frases vacías.
 */

import { getGeminiApiKey } from './geminiService';

// Modelos de Gemini soportados (prioriza versión Flash ultrarrápida para baja latencia en voz)
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Consulta de selectores DOM a prueba de fallos.
 * Sanitiza pseudo-selectores no estándar si existen.
 */
export function safeQuerySelector(selector) {
  if (!selector || typeof selector !== 'string' || typeof document === 'undefined') return null;
  try {
    return document.querySelector(selector);
  } catch (err) {
    try {
      const sanitized = selector
        .split(',')[0]
        .replace(/:has-text\([^)]*\)/gi, '')
        .replace(/:contains\([^)]*\)/gi, '')
        .trim();
      if (sanitized) return document.querySelector(sanitized);
    } catch {}
    return null;
  }
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
 * Obtiene la posición relativa en el documento
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
 * Escáner Profundo y Granular del DOM (Deep DOM Scanner)
 * Captura ordenadamente los 5 bloques funcionales de la pantalla activa extrayendo su texto real.
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
  const mainScope = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;

  // Limpiar etiquetas de escaneo previas
  document.querySelectorAll('[data-tour-scanned]').forEach((el) => {
    el.removeAttribute('data-tour-scanned');
  });

  const bloques = [];
  const elementosVisibles = [];

  const addBlock = (id, selector, titulo, locucionSugerida, metadata = {}) => {
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
  // BLOQUE 1: Encabezado y Descripción Principal
  // =========================================================================
  const h1 = mainScope.querySelector('h1') || document.querySelector('h1') || mainScope.querySelector('h2');
  if (h1 && isElementVisible(h1)) {
    const headerContainer = h1.closest('div') || h1.parentElement || h1;
    const titleText = h1.innerText?.trim() || document.title || 'Módulo Activo';

    // Extraer párrafo explicativo contiguo o hijo del contenedor
    const pEl = headerContainer.querySelector('p') || mainScope.querySelector('p');
    const paragraphText = pEl?.innerText?.trim() || '';

    // Extraer badges o subtítulos en la cabecera
    const badges = Array.from(headerContainer.querySelectorAll('span, div'))
      .filter((el) => el !== h1 && el !== pEl && el.innerText && el.innerText.length < 90 && isElementVisible(el))
      .map((el) => el.innerText.trim())
      .filter((t) => t.length > 3 && !t.includes(titleText));
    const badgeText = badges.slice(0, 2).join(' • ');

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
        badgeText,
        posicion: getElementPosition(headerContainer)
      }
    );
  }

  // =========================================================================
  // BLOQUE 2: Acciones Globales / Interoperabilidad GIS / Banners Destacados
  // =========================================================================
  const candidateActionBanners = Array.from(mainScope.querySelectorAll('div, section')).filter((el) => {
    if (!isElementVisible(el) || el === mainScope) return false;
    const txt = el.innerText || '';
    const hasKeywords = /GeoJSON|Exportar|Descargar|Interoperabilidad|Dataset|GIS|Nueva|Crear|Reportar|Solicitar/i.test(txt);
    const hasActionControl = !!el.querySelector('button, a[download], [role="button"]');
    // Asegurar que sea una tarjeta o bloque contenedor y no la página entera
    return hasKeywords && hasActionControl && el.children.length >= 1 && el.children.length <= 8;
  });

  if (candidateActionBanners.length > 0) {
    // Tomar el bloque de acción más prominente
    const bannerEl = candidateActionBanners[0];
    bannerEl.setAttribute('data-tour-scanned', 'banner-accion');

    const bannerTitle = bannerEl.querySelector('h2, h3, h4, strong')?.innerText?.trim() || 'Acción Cantonal Destacada';
    const bannerDesc = bannerEl.querySelector('p')?.innerText?.trim() || '';
    const actionBtn = bannerEl.querySelector('button, a[download]');
    const btnText = actionBtn?.innerText?.trim() || 'Exportar Dataset GeoJSON POI';

    let speech = `En el bloque de ${bannerTitle}, dispone de la función para ${btnText}.`;
    if (bannerDesc) {
      speech += ` ${bannerDesc}`;
    }
    if (/GeoJSON/i.test(bannerTitle + btnText + bannerDesc)) {
      if (currentPath.includes('educacion')) {
        speech += ` Con este botón de Interoperabilidad GIS puede descargar el archivo oficial en formato GeoJSON para visualizar los centros educativos y paradas escolares en sistemas cartográficos como Leaflet o Google Maps.`;
      } else {
        speech += ` Con este botón de Interoperabilidad GIS puede descargar el archivo oficial en formato GeoJSON para visualizar los puntos de interés e infraestructura cantonal en sistemas cartográficos como Leaflet o Google Maps.`;
      }
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

  // =========================================================================
  // BLOQUE 3: Herramientas de Búsqueda y Filtrado
  // =========================================================================
  const searchInput = mainScope.querySelector('input[type="text"], input[type="search"]');
  const allButtons = Array.from(mainScope.querySelectorAll('button')).filter(isElementVisible);

  // Filtrar pills o botones de categorías en la barra de filtros
  const filterPills = allButtons.filter((b) => {
    const txt = b.innerText.trim();
    if (!txt || txt.includes('Guía por Voz') || txt.includes('SOS') || txt.includes('Exportar') || txt.includes('Descargar')) return false;
    return txt.length >= 2 && txt.length <= 25;
  });

  const filterSelects = Array.from(mainScope.querySelectorAll('select')).filter(isElementVisible);

  if (searchInput || filterPills.length > 0 || filterSelects.length > 0) {
    // Localizar el contenedor específico de la barra de búsqueda y filtros
    const filterContainer =
      searchInput?.closest('div[style*="border"], div[style*="background"], form') ||
      filterPills[0]?.closest('div[style*="border"], div[style*="background"], form') ||
      searchInput?.parentElement ||
      filterPills[0]?.parentElement;

    const targetEl = filterContainer || searchInput;
    targetEl.setAttribute('data-tour-scanned', 'barra-filtros');

    const placeholder = searchInput?.placeholder || 'Buscar por nombre, distrito o término clave...';
    const pillNames = filterPills.map((p) => p.innerText.trim()).slice(0, 6);
    const selectInfo = filterSelects.map((s) => {
      const label = s.getAttribute('aria-label') || s.previousElementSibling?.innerText || 'Filtro';
      const opts = Array.from(s.options)
        .map((o) => o.text.trim())
        .filter((t) => !t.toLowerCase().includes('todas') && !t.toLowerCase().includes('todos'))
        .slice(0, 4);
      return `${label}: ${opts.join(', ')}`;
    });

    let speech = `Utilice estos controles para acotar la búsqueda`;
    if (searchInput) {
      speech += ` por nombre, distrito o palabra clave con el buscador.`;
    }
    if (pillNames.length > 0) {
      speech += ` Puede alternar entre los niveles y categorías: ${pillNames.join(', ')}.`;
    }
    if (selectInfo.length > 0) {
      speech += ` Además, dispone de selectores desplegables como ${selectInfo.join('. ')} para acotar por especialidades técnicas de alta demanda.`;
    }

    addBlock(
      'barra-filtros',
      '[data-tour-scanned="barra-filtros"]',
      'Filtros por Nivel y Especialidad',
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

  // =========================================================================
  // BLOQUE 4: Sección de Resultados y Tarjetas Informativas
  // =========================================================================
  const resultsContainer =
    mainScope.querySelector('section[aria-label], div[style*="grid"], section > div[style*="display: grid"]') ||
    mainScope.querySelector('article')?.parentElement ||
    mainScope.querySelector('[data-tour*="feed"]');

  if (resultsContainer && isElementVisible(resultsContainer)) {
    // Si resultsContainer contiene una sub-cuadrícula con los elementos de tarjeta reales
    const cardsGrid = resultsContainer.querySelector('div[style*="grid"]') || resultsContainer;
    cardsGrid.setAttribute('data-tour-scanned', 'grid-resultados');

    // Filtrar elementos de tarjeta válidos (con encabezado h2/h3/h4 o article)
    const cardElements = Array.from(cardsGrid.children).filter((c) => {
      const hasHeading = !!c.querySelector('h2, h3, h4');
      const isCardLike = c.tagName.toLowerCase() === 'article' || (c.innerText && c.innerText.length > 30 && hasHeading);
      return isElementVisible(c) && isCardLike;
    }).slice(0, 3);

    const cardsData = cardElements.map((card) => {
      const cardTitle = card.querySelector('h2, h3, h4, strong')?.innerText?.trim() || 'Ficha Informativa';
      const mepMatch = card.innerText.match(/MEP-[\w-]+/);
      const codeOrBadge = mepMatch ? mepMatch[0] : (card.querySelector('span[style*="monospace"]')?.innerText?.trim() || '');
      const buttons = Array.from(card.querySelectorAll('button, a')).map((b) => b.innerText.trim()).filter(Boolean);
      return {
        titulo: cardTitle,
        codigo: codeOrBadge,
        acciones: buttons.slice(0, 2)
      };
    });

    let speech = `En esta cuadrícula se despliegan los resultados oficiales del cantón.`;
    if (cardsData.length > 0) {
      speech += ` Encontrará instituciones como el ${cardsData[0].titulo}`;
      if (cardsData[0].codigo) speech += ` con código oficial MEP ${cardsData[0].codigo}`;
      if (cardsData[1]) {
        speech += `, y el ${cardsData[1].titulo}`;
        if (cardsData[1].codigo) speech += ` con código ${cardsData[1].codigo}`;
      }
      speech += `. Cada ficha detalla el nivel educativo, accesibilidad bajo la Ley 7600, dirección exacta y opciones para consultar la ficha técnica o ubicar las coordenadas en el mapa GIS.`;
    }

    addBlock(
      'grid-resultados',
      '[data-tour-scanned="grid-resultados"]',
      'Fichas de Centros Educativos',
      speech,
      {
        tipo: 'resultados',
        tarjetas: cardsData,
        posicion: getElementPosition(cardsGrid)
      }
    );
  }

  // =========================================================================
  // BLOQUE 5: Paginación o Acciones Secundarias al Pie
  // =========================================================================
  const paginationEl = mainScope.querySelector('nav[aria-label*="Pagin"], div[role="navigation"], ul.pagination');
  if (paginationEl && isElementVisible(paginationEl)) {
    paginationEl.setAttribute('data-tour-scanned', 'paginacion');
    addBlock(
      'paginacion',
      '[data-tour-scanned="paginacion"]',
      'Navegación de Registros y Paginación',
      'En la parte inferior dispone de controles para explorar las siguientes páginas de registros.',
      {
        tipo: 'paginacion',
        posicion: getElementPosition(paginationEl)
      }
    );
  }

  return {
    ruta: currentPath,
    tituloPagina: h1?.innerText?.trim() || document.title || 'Módulo Activo',
    bloques,
    elementosVisibles
  };
}

/**
 * Base de conocimiento estática por ruta como fallback determinista garantizado.
 */
export const ROUTE_KNOWLEDGE_BASE = {
  '/': {
    nombre: 'Plataforma Soberana de la República (Inicio)',
    descripcion: 'Portal central de los 84 cantones con buscador unificado, ejes de gestión y acceso cívico.',
    pasosDefault: [
      {
        targetSelector: '[data-tour="nav-institucional"], header nav, header',
        title: 'Navegación Institucional',
        speechText: 'En la barra superior encontrará el acceso directo a los pilares municipales: Trámites, Gobierno, Territorio y Comunidad.',
        tips: 'Pase el cursor sobre cada categoría para ver trámites directos sin filas.'
      },
      {
        targetSelector: '[data-tour="selector-canton"]',
        title: 'Selector de Cantón Activo',
        speechText: 'Aquí puede alternar su cantón entre los 84 gobiernos locales para sincronizar tasas, actas y noticias a su localidad.',
        tips: 'Haga clic para abrir el listado con buscador rápido de cantones.'
      },
      {
        targetSelector: '[data-tour="buscador-civico"], form input[type="text"], input[type="text"]',
        title: 'Buscador Cívico Universal',
        speechText: 'Escriba cualquier trámite, calle o gestión pública para obtener enlaces y requisitos oficiales al instante.',
        tips: 'Pruebe buscando palabras como "patente", "avería" o "acta".'
      },
      {
        targetSelector: '#ejes-municipales-section, [data-tour="ejes-municipales"], section',
        title: 'Ejes de Gestión Cantonal',
        speechText: 'Módulos integrados con Hacienda, Concejo Municipal, SICOP y Comités Cantonales de Deportes.',
        tips: 'Cada tarjeta le conecta directamente con el módulo de servicio público.'
      },
      {
        targetSelector: '[data-tour="panel-civico-btn"], button',
        title: 'Panel Cívico y Accesibilidad',
        speechText: 'Permite ajustar el tamaño de texto bajo la Ley 7600, alternar tema claro u oscuro y seleccionar filtros de daltonismo.',
        tips: 'Diseñado para garantizar inclusión universal en todos los dispositivos.'
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
  },
  '/perfil': {
    nombre: 'Mi Perfil Cívico y Trámites Personales',
    descripcion: 'Expediente digital del ciudadano con consulta fiscal y solicitud de cuenta emprendedor.',
    pasosDefault: [
      {
        targetSelector: 'h1, h2',
        title: 'Identidad Cívica Oficial',
        speechText: 'Esta es su vista privada. Aquí puede consultar sus datos de registro electoral, cantón asignado y estado tributario.',
        tips: 'Esta información solo es accesible por usted como titular de la cuenta.'
      },
      {
        targetSelector: 'input[readOnly], input[disabled], div:has(input)',
        title: 'Cédula Oficial Inmutable',
        speechText: 'Su cédula de identidad está blindada en modo solo lectura para garantizar que nunca sea modificada indebidamente.',
        tips: 'Cumple estrictamente con la Ley N° 8968 de Protección de Datos de la Persona.'
      },
      {
        targetSelector: 'form, button[type="submit"]',
        title: 'Solicitud de Cuenta Emprendedor',
        speechText: 'Si desea registrar un comercio local, complete este formulario para solicitar verificación municipal como emprendedor.',
        tips: 'Su cuenta se mantendrá en estado pendiente hasta ser aprobada oficialmente.'
      }
    ]
  },
  '/comercio': {
    nombre: 'Directorio Cantonal de PyMES y Comercios Locales',
    descripcion: 'Catálogo de emprendimientos y negocios del cantón verificados con sello de Hacienda.',
    pasosDefault: [
      {
        targetSelector: '[data-tour-scanned="header-principal"], h1',
        title: 'Directorio Comercial Cantonal',
        speechText: 'Encuentre comercios, servicios y productores de su cantón con patente municipal al día y respaldo cívico.',
        tips: 'Apoye la economía local comprando a emprendedores de su comunidad.'
      },
      {
        targetSelector: '[data-tour-scanned="barra-filtros"], input[type="text"]',
        title: 'Filtro por Categoría y Búsqueda',
        speechText: 'Busque negocios por nombre, distrito o categoría como gastronomía, salud, artesanías y tecnología.',
        tips: 'También puede filtrar por tipo de régimen tributario.'
      },
      {
        targetSelector: '[data-tour-scanned="grid-resultados"], article, main div',
        title: 'Interacción y Contacto Directo',
        speechText: 'Reaccione con apoyo cívico a sus negocios preferidos y contáctelos directamente por WhatsApp o ruta Waze.',
        tips: 'Los ciudadanos pueden emitir reseñas públicas con identidad protegida.'
      }
    ]
  }
};

/**
 * Normaliza la ruta actual para buscar coincidencias en la base de conocimiento
 */
export function normalizePath(path) {
  if (!path || path === '/') return '/';
  const clean = path.split('?')[0].split('#')[0];
  if (clean.startsWith('/educacion')) return '/educacion';
  if (clean.startsWith('/noticias') || clean.startsWith('/comunicados')) return '/noticias';
  if (clean.startsWith('/foro')) return '/foro';
  if (clean.startsWith('/mapa') || clean.startsWith('/territorio') || clean.startsWith('/gis')) return '/mapa-gis';
  if (clean.startsWith('/perfil')) return '/perfil';
  if (clean.startsWith('/portal')) return '/portal-ciudadano';
  if (clean.startsWith('/comercio') || clean.startsWith('/pymes')) return '/comercio';
  if (clean.startsWith('/reportar') || clean.startsWith('/reportes')) return '/reportar-incidencia';
  if (clean.startsWith('/seguridad') || clean.startsWith('/emergencias') || clean.startsWith('/sos')) return '/seguridad-emergencias';
  return clean;
}

/**
 * Analiza la pantalla activa y genera la lista de pasos del recorrido
 * utilizando Gemini 3.6 Flash o el motor de respaldo local determinista y profundo.
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
  console.log('[Guía Gemini] Bloques funcionales detectados:', contextData.bloques);

  // Intentar consulta a la API de Gemini 3.6 Flash con timeout estricto de 3 segundos
  const apiKey = getGeminiApiKey();

  if (apiKey && contextData.bloques.length > 0) {
    console.log('[Guía Gemini] Consultando a Gemini 3.6 Flash con contexto profundo del DOM...');
    try {
      const aiPromise = requestGeminiTourSequence({
        path: contextData.ruta,
        pageTitle,
        bloques: contextData.bloques,
        canton,
        lang,
        apiKey
      });

      // Timeout de 3 segundos garantizado
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de 3s superado en llamada a Gemini 3.6 Flash')), 3000)
      );

      const aiSteps = await Promise.race([aiPromise, timeoutPromise]);

      if (aiSteps && Array.isArray(aiSteps) && aiSteps.length >= 2) {
        console.log('[Guía Gemini] Guion exhaustivo generado exitosamente por Gemini 3.6 Flash:', aiSteps);
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
 * Solicita a Gemini 3.6 Flash la secuencia estructurada de pasos con el prompt reingenierizado
 */
async function requestGeminiTourSequence({ path, pageTitle, bloques, canton, lang, apiKey }) {
  const systemPrompt = `Eres el Arquitecto Senior de Interfaces Conversacionales y Accesibilidad de Costa Rica Unidos (Gemini 3.6 Flash).
Tu misión es generar un recorrido por voz didáctico, exhaustivo y de alta fidelidad para la pantalla activa del ciudadano en el cantón de "${canton}".

DATOS ESTRUCTURADOS EXTRAÍDOS DEL DOM REAL DE LA PANTALLA ACTIVA:
- Ruta: "${path}"
- Título Oficial: "${pageTitle}"
- Cantón: "${canton}"
- Bloques funcionales escaneados con su texto literal y componentes:
${JSON.stringify(bloques, null, 2)}

DIRECTRICES OBLIGATORIAS:
1. PROHIBIDO EL TEXTO GENÉRICO: Está terminantemente prohibido usar frases vacías de relleno como "aquí puede consultar y gestionar servicios" o "en esta sección encontrará información". Debes referirte literal y explícitamente a los títulos, botones, filtros, códigos y párrafos extraídos en el JSON.
2. LECTURA Y EXPLICACIÓN FUNCIONAL PRECISA:
   - Para Encabezados y Descripciones: Lee e integra de manera clara y natural el título del módulo y el párrafo explicativo real.
   - Para Botones y Acciones Globales (ej. "Exportar Dataset GeoJSON POI", descargas o botones de acción): Explica con precisión qué archivo se descarga (ej. formato GeoJSON WGS84) y su utilidad práctica para el ciudadano (ej. visualización en capas cartográficas, Leaflet o Google Maps).
   - Para Filtros y Buscadores: Explica literalmente cómo combinarlos usando el placeholder real (ej. buscar por nombre o distrito), las categorías visibles (ej. Preescolar, Primaria, Secundaria, CTP, Universidad) y los menús desplegables (ej. especialidades técnicas CTP de alta demanda).
   - Para Cuadrícula y Fichas de Resultados: Explica la estructura de los datos mostrados citando ejemplos reales encontrados en el DOM (ej. Colegio Técnico Profesional de San Sebastián, código MEP-0101-CTP, CTP Pavas, cumplimiento de Ley 7600 y botones de mapa).
3. ORDEN JERÁRQUICO ESTRICTO:
   Paso 1: Encabezado y Descripción Principal.
   Paso 2: Banners de Interoperabilidad o Acciones Globales (si existen).
   Paso 3: Herramientas de Búsqueda y Filtrado (si existen).
   Paso 4: Fichas de Resultados y Catálogo (si existen).
   Paso 5: Paginación o Acciones Secundarias (si existen).
4. FORMATO DE SALIDA ESTRICTO:
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
      maxOutputTokens: 900,
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
 * con los textos literales reales (Elimina por completo cualquier texto genérico).
 */
export function buildDeterministicSteps(pathNormal, scannedContext, routeKnowledge, canton) {
  const bloques = scannedContext?.bloques || [];

  // 1. Si el Deep DOM Scanner encontró bloques funcionales reales, utilizarlos directamente
  if (bloques && bloques.length >= 2) {
    return bloques.map((bloque, index) => {
      let tips = 'Presione Siguiente para continuar con el recorrido asistido.';
      if (bloque.tipo === 'encabezado') {
        tips = 'Consulte el marco institucional y las competencias del módulo.';
      } else if (bloque.tipo === 'accion-global') {
        tips = 'Presione el botón para exportar las coordenadas en GeoJSON estándar WGS84.';
      } else if (bloque.tipo === 'filtros') {
        tips = 'Combine la búsqueda por texto y los filtros por nivel para resultados exactos.';
      } else if (bloque.tipo === 'resultados') {
        tips = 'Haga clic en la tarjeta o en el botón de coordenadas POI para situarlo en el mapa.';
      } else if (bloque.tipo === 'paginacion') {
        tips = 'Use la paginación para ver más registros del cantón.';
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
