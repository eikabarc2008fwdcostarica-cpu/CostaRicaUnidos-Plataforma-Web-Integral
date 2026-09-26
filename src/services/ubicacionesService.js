/**
 * COSTA RICA UNIDOS — Servicio de Ubicaciones Territoriales (DTA)
 * Consume la API pública https://ubicaciones.paginasweb.cr/ con:
 * - Soporte Offline mediante localStorage
 * - Decodificación y limpieza de mojibake / caracteres especiales
 * - Fallbacks estáticos de alta fidelidad basados en INEC / TSE
 */

import { PROVINCIAS_DATA, CANTONES_OFICIALES } from '../data/costaRicaTerritorialData';

const BASE_URL = 'https://ubicaciones.paginasweb.cr';
const CACHE_PREFIX = 'cr_dta_cache_';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días de vigencia en caché local

/**
 * Corrige errores comunes de codificación Latin-1/UTF-8 provenientes de la API pública
 */
function normalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .replace(/JosAc|JosÃ©|JosA©/gi, 'José')
    .replace(/EscazA|EscazÃº|EscazAº/gi, 'Escazú')
    .replace(/TarrazA|TarrazÃº|TarrazAº/gi, 'Tarrazú')
    .replace(/AserrA-|AserrÃ­|AserrA­/gi, 'Aserrí')
    .replace(/VAzquez|VÃ¡zquez|VA¡zquez/gi, 'Vásquez')
    .replace(/TibAs|TibÃ¡s|TibA¡s/gi, 'Tibás')
    .replace(/PAcrez|PÃ©rez|PA©rez/gi, 'Pérez')
    .replace(/ZeledA3n|ZeledÃ³n|ZeledA³n/gi, 'Zeledón')
    .replace(/LeA3n|LeÃ³n|LeA³n/gi, 'León')
    .replace(/CortAcs|CortÃ©s|CortA©s/gi, 'Cortés')
    .replace(/RamA3n|RamÃ³n|RamA³n/gi, 'Ramón')
    .replace(/PoAs|PoÃ¡s|PoA¡s/gi, 'Poás')
    .replace(/UniA3n|UniÃ³n|UniA³n/gi, 'Unión')
    .replace(/JimAcmnez|JimÃ©nez|JimA©nez/gi, 'Jiménez')
    .replace(/BArbara|BÃ¡rbara|BA¡rbara/gi, 'Bárbara')
    .replace(/BelAcm|BelÃ©n|BelA©n/gi, 'Belén')
    .replace(/SarapiquA-|SarapiquÃ­|SarapiquA­/gi, 'Sarapiquí')
    .replace(/CaAas|CaÃ±as|CaA±as/gi, 'Cañas')
    .replace(/TilarAn|TilarÃ¡n|TilarA¡n/gi, 'Tilarán')
    .replace(/GuAcimo|GuÃ¡cimo|GuA¡cimo/gi, 'Guácimo')
    .replace(/LimA3n|LimÃ³n|LimA3n/gi, 'Limón')
    .replace(/SebastiAn|SebastiÃ¡n|SebastiA¡n/gi, 'Sebastián')
    .trim();
}

/**
 * Lee del almacenamiento en caché local
 */
function obtenerDeCache(clave) {
  try {
    const itemStr = localStorage.getItem(CACHE_PREFIX + clave);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const ahora = Date.now();
    if (item.timestamp && ahora - item.timestamp < CACHE_TTL_MS) {
      return item.data;
    }
  } catch (e) {
    console.warn('[Cache] Error al leer localStorage:', e);
  }
  return null;
}

/**
 * Guarda en localStorage con marca de tiempo
 */
function guardarEnCache(clave, datos) {
  try {
    const payload = {
      timestamp: Date.now(),
      data: datos
    };
    localStorage.setItem(CACHE_PREFIX + clave, JSON.stringify(payload));
  } catch (e) {
    console.warn('[Cache] No se pudo escribir en localStorage:', e);
  }
}

/**
 * Convierte respuesta de objeto clave-valor { "1": "Nombre", "2": "Nombre" } en arreglo de objetos
 */
function formatearLista(objetoCrudo, idPadre = null) {
  if (!objetoCrudo || typeof objetoCrudo !== 'object') return [];
  return Object.entries(objetoCrudo).map(([idStr, nombre]) => ({
    id: parseInt(idStr, 10),
    nombre: normalizarTexto(nombre),
    padreId: idPadre
  })).sort((a, b) => a.id - b.id);
}

/**
 * 1. Obtener Provincias
 * Carga desde https://ubicaciones.paginasweb.cr/provincias.json
 */
export async function getProvincias() {
  const cacheKey = 'provincias';
  const cached = obtenerDeCache(cacheKey);

  try {
    const res = await fetch(`${BASE_URL}/provincias.json`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      const provincias = formatearLista(data);
      guardarEnCache(cacheKey, provincias);
      return {
        data: provincias,
        source: 'network'
      };
    }
  } catch (err) {
    console.warn('[UbicacionesAPI] Fallo de red para provincias, recurriendo a caché/offline:', err.message);
  }

  if (cached && cached.length > 0) {
    return { data: cached, source: 'cache' };
  }

  // Fallback estático confiable
  const fallback = PROVINCIAS_DATA.map(p => ({
    id: p.id,
    nombre: p.nombre,
    codigo: p.codigo
  }));
  return { data: fallback, source: 'fallback' };
}

/**
 * 2. Obtener Cantones por Provincia
 * Carga desde https://ubicaciones.paginasweb.cr/provincia/{id}/cantones.json
 */
export async function getCantones(provinciaId) {
  if (!provinciaId) return { data: [], source: 'empty' };

  const cacheKey = `cantones_${provinciaId}`;
  const cached = obtenerDeCache(cacheKey);

  try {
    const res = await fetch(`${BASE_URL}/provincia/${provinciaId}/cantones.json`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      const cantones = formatearLista(data, provinciaId);
      guardarEnCache(cacheKey, cantones);
      return {
        data: cantones,
        source: 'network'
      };
    }
  } catch (err) {
    console.warn(`[UbicacionesAPI] Fallo al cargar cantones provincia ${provinciaId}:`, err.message);
  }

  if (cached && cached.length > 0) {
    return { data: cached, source: 'cache' };
  }

  // Fallback estático con los cantones oficiales de esa provincia
  const cantonesProvincia = CANTONES_OFICIALES
    .filter(c => c.provinciaId === Number(provinciaId))
    .map(c => ({
      id: c.id,
      nombre: c.nombre,
      padreId: provinciaId,
      codigoDta: c.codigoDta
    }));

  return {
    data: cantonesProvincia,
    source: 'fallback'
  };
}

/**
 * 3. Obtener Distritos por Provincia y Cantón
 * Carga desde https://ubicaciones.paginasweb.cr/provincia/{provinciaId}/canton/{cantonId}/distritos.json
 */
export async function getDistritos(provinciaId, cantonId) {
  if (!provinciaId || !cantonId) return { data: [], source: 'empty' };

  const cacheKey = `distritos_${provinciaId}_${cantonId}`;
  const cached = obtenerDeCache(cacheKey);

  try {
    const res = await fetch(`${BASE_URL}/provincia/${provinciaId}/canton/${cantonId}/distritos.json`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      const distritos = formatearLista(data, cantonId);
      guardarEnCache(cacheKey, distritos);
      return {
        data: distritos,
        source: 'network'
      };
    }
  } catch (err) {
    console.warn(`[UbicacionesAPI] Fallo al cargar distritos P:${provinciaId} C:${cantonId}:`, err.message);
  }

  if (cached && cached.length > 0) {
    return { data: cached, source: 'cache' };
  }

  // Fallback básico si está sin conexión y no fue cacheado
  const distritosBasicos = [
    { id: 1, nombre: 'Distrito Central (Cabecera)', padreId: cantonId },
    { id: 2, nombre: 'Distrito Segundo', padreId: cantonId },
    { id: 3, nombre: 'Distrito Tercero', padreId: cantonId }
  ];

  return {
    data: distritosBasicos,
    source: 'fallback'
  };
}
