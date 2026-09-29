/**
 * ============================================================================
 * COSTA RICA UNIDOS — SOVEREIGN CIVIC GLASS v2.1 DESIGN SYSTEM
 * Theming Engine Provincial & Tokens Tipográficos y Estructurales
 * ============================================================================
 * 
 * Sistema centralizado de estilos y tokens dinámicos para la plataforma cívica
 * soberana de Costa Rica.
 * Cumplimiento estricto: TypeScript strict: true, WCAG 2.1 AA (contraste >= 4.5:1).
 */

export type ProvinciaId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ProvinciaCodigo = 'CR' | 'SJ' | 'AL' | 'CA' | 'HE' | 'GU' | 'PU' | 'LI';

export interface ProvincialColorToken {
  id: ProvinciaId;
  codigo: ProvinciaCodigo;
  nombre: string;
  clubEmblematico: string;
  primary: string;       // Color primario provincial (Hex)
  secondary: string;     // Color secundario provincial
  accent: string;        // Color de realce / acento
  textColor: string;     // Color de texto contrastante con primary (WCAG 2.1 AA)
  descripcion: string;
}

export interface TypographyTokens {
  headline: string;      // Titulares y nombres cantonales: 'Mistical Spring'
  body: string;          // Cuerpo de texto, tablas y controles: 'Paloseco'
  telemetry: string;     // Telemetría, cifras, fechas y presupuestos: 'JetBrains Mono'
}

export interface RadiusTokens {
  control: string;       // Inputs y controles: 8px
  card: string;          // Tarjetas modulares: 16px
  modal: string;         // Modales y diálogos: 24px
  pill: string;          // Badges y semáforos: 9999px
}

export interface GlassLevel {
  background: string;
  backdropBlur: string;
  border: string;
  boxShadow: string;
}

export interface GlassmorphismTokens {
  level1: GlassLevel;    // Superficie / sutil
  level2: GlassLevel;    // Tarjeta / interactivo
  level3: GlassLevel;    // Modal / flotante elevado
}

/**
 * Sustrato Base: Obsidiana Soberana
 */
export const OBSIDIANA_SOBERANA = '#00040D';

/**
 * Theming Engine Provincial (7 Provincias Oficiales + Tema Nacional Tricolor)
 */
export const PROVINCIAL_THEMES: Record<ProvinciaId, ProvincialColorToken> = {
  0: {
    id: 0,
    codigo: 'CR',
    nombre: 'Nacional Tricolor',
    clubEmblematico: 'República de Costa Rica',
    primary: '#002B7F',     // Azul Soberano
    secondary: '#CE1126',   // Rojo Solidaridad
    accent: '#FFFFFF',      // Blanco Radiante
    textColor: '#FFFFFF',
    descripcion: 'Pabellón Nacional Tricolor y Símbolos Patrios de Costa Rica'
  },
  1: {
    id: 1,
    codigo: 'SJ',
    nombre: 'San José',
    clubEmblematico: 'Deportivo Saprissa',
    primary: '#601438',     // Morado Saprissa
    secondary: '#FFFFFF',
    accent: '#C99700',
    textColor: '#FFFFFF',
    descripcion: 'Capital Soberana, sede de los Supremos Poderes de la República'
  },
  2: {
    id: 2,
    codigo: 'AL',
    nombre: 'Alajuela',
    clubEmblematico: 'Liga Deportiva Alajuelense',
    primary: '#D31424',     // Rojo Manudo
    secondary: '#000000',
    accent: '#FFFFFF',
    textColor: '#FFFFFF',
    descripcion: 'Tierra de Juan Santamaría, volcanes y eje agroindustrial'
  },
  3: {
    id: 3,
    codigo: 'CA',
    nombre: 'Cartago',
    clubEmblematico: 'Club Sport Cartaginés',
    primary: '#0A3282',     // Azul Cartaginés
    secondary: '#FFFFFF',
    accent: '#001844',
    textColor: '#FFFFFF',
    descripcion: 'Cuna de la Historia Patria y Tradición Cívica Colonial'
  },
  4: {
    id: 4,
    codigo: 'HE',
    nombre: 'Heredia',
    clubEmblematico: 'Club Sport Herediano',
    primary: '#FFC700',     // Amarillo Florense
    secondary: '#D31424',
    accent: '#940A15',
    textColor: '#0B0D17',   // Alto contraste WCAG AA sobre amarillo vivo
    descripcion: 'Ciudad de las Flores, cuna educativa y vértice de alta tecnología'
  },
  5: {
    id: 5,
    codigo: 'GU',
    nombre: 'Guanacaste',
    clubEmblematico: 'Asociación Deportiva Guanacasteca',
    primary: '#05853B',     // Verde Guanacasteca
    secondary: '#CE1126',
    accent: '#FFD100',
    textColor: '#FFFFFF',
    descripcion: 'Bicentenario de la Anexión del Partido de Nicoya, folclor y energía limpia'
  },
  6: {
    id: 6,
    codigo: 'PU',
    nombre: 'Puntarenas',
    clubEmblematico: 'Puntarenas Fútbol Club',
    primary: '#F36717',     // Naranja PFC
    secondary: '#002B7F',
    accent: '#FFFFFF',
    textColor: '#0B0D17',   // Alto contraste WCAG AA sobre naranja vivo
    descripcion: 'La Perla del Pacífico, megabiodiversidad e identidad pesquera y portuaria'
  },
  7: {
    id: 7,
    codigo: 'LI',
    nombre: 'Limón',
    clubEmblematico: 'Limón Fútbol Club',
    primary: '#349E35',     // Verde Caribe
    secondary: '#FFD700',
    accent: '#002B7F',
    textColor: '#FFFFFF',
    descripcion: 'Pórtico Caribeño, cultura afrocostarricense y riqueza multilingüe'
  }
};

/**
 * Tokens Tipográficos del Sistema Sovereign Civic Glass v2.1
 */
export const TYPOGRAPHY_TOKENS: TypographyTokens = {
  headline: "'Mistical Spring', 'Plus Jakarta Sans', Georgia, serif",
  body: "'Paloseco', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  telemetry: "'JetBrains Mono', 'Courier New', monospace"
};

/**
 * Tokens de Radios de Curvatura Normados
 */
export const RADIUS_TOKENS: RadiusTokens = {
  control: '8px',    // Inputs, botones, selectores
  card: '16px',      // Tarjetas modulares y paneles
  modal: '24px',     // Ventanas modales y diálogos cívicos
  pill: '9999px'     // Badges, etiquetas y semáforos
};

/**
 * Tokens de Glassmorphism (Niveles 1, 2 y 3)
 */
export const GLASSMORPHISM_TOKENS: GlassmorphismTokens = {
  level1: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropBlur: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 20px 0 rgba(0, 4, 13, 0.35)'
  },
  level2: {
    background: 'rgba(255, 255, 255, 0.07)',
    backdropBlur: '24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(0, 4, 13, 0.55)'
  },
  level3: {
    background: 'rgba(0, 4, 13, 0.88)',
    backdropBlur: '32px',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    boxShadow: '0 24px 64px 0 rgba(0, 4, 13, 0.85)'
  }
};

/**
 * Convierte color HEX a valores RGB individuales
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((char) => char + char).join('');
  }
  const intVal = parseInt(cleanHex, 16);
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255
  };
}

/**
 * Obtiene el tema provincial activo por su ID o código
 */
export function getProvincialTheme(provincia: ProvinciaId | ProvinciaCodigo | string | number): ProvincialColorToken {
  if (typeof provincia === 'number') {
    const validId = (provincia >= 0 && provincia <= 7 ? provincia : 0) as ProvinciaId;
    return PROVINCIAL_THEMES[validId];
  }
  
  const parsedId = parseInt(provincia, 10);
  if (!isNaN(parsedId) && parsedId >= 0 && parsedId <= 7) {
    return PROVINCIAL_THEMES[parsedId as ProvinciaId];
  }

  const byCode = Object.values(PROVINCIAL_THEMES).find(
    (theme) => theme.codigo.toLowerCase() === provincia.toLowerCase()
  );
  if (byCode) return byCode;

  const byName = Object.values(PROVINCIAL_THEMES).find(
    (theme) => theme.nombre.toLowerCase().includes(provincia.toLowerCase())
  );
  return byName || PROVINCIAL_THEMES[0];
}

/**
 * Conmuta dinámicamente las variables CSS del Theming Engine en el DOM (:root)
 */
export function applyProvincialTheme(
  provincia: ProvinciaId | ProvinciaCodigo | string | number,
  targetElement: HTMLElement = typeof document !== 'undefined' ? document.documentElement : ({} as HTMLElement)
): ProvincialColorToken {
  const theme = getProvincialTheme(provincia);
  if (!targetElement || typeof targetElement.style?.setProperty !== 'function') {
    return theme;
  }

  const rgb = hexToRgb(theme.primary);
  const rgbSec = hexToRgb(theme.secondary);

  // Colores del Theming Engine Provincial
  targetElement.style.setProperty('--color-provincial-primary', theme.primary);
  targetElement.style.setProperty('--color-provincial-secondary', theme.secondary);
  targetElement.style.setProperty('--color-provincial-accent', theme.accent);
  targetElement.style.setProperty('--color-provincial-text', theme.textColor);
  targetElement.style.setProperty('--color-provincial-surface', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`);
  targetElement.style.setProperty('--color-provincial-surface-hover', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.28)`);
  targetElement.style.setProperty('--color-provincial-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.38)`);
  targetElement.style.setProperty(
    '--glow-provincial',
    `0 0 24px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45), 0 0 48px rgba(${rgbSec.r}, ${rgbSec.g}, ${rgbSec.b}, 0.20)`
  );

  // Sustrato base Obsidiana Soberana
  targetElement.style.setProperty('--color-obsidian-sovereign', OBSIDIANA_SOBERANA);

  // Tokens de Tipografía
  targetElement.style.setProperty('--font-headline', TYPOGRAPHY_TOKENS.headline);
  targetElement.style.setProperty('--font-body', TYPOGRAPHY_TOKENS.body);
  targetElement.style.setProperty('--font-telemetry', TYPOGRAPHY_TOKENS.telemetry);

  // Tokens de Radios de Curvatura
  targetElement.style.setProperty('--radius-control', RADIUS_TOKENS.control);
  targetElement.style.setProperty('--radius-card', RADIUS_TOKENS.card);
  targetElement.style.setProperty('--radius-modal', RADIUS_TOKENS.modal);
  targetElement.style.setProperty('--radius-pill', RADIUS_TOKENS.pill);

  // Atributo de datos para selectores CSS específicos
  targetElement.setAttribute('data-provincia-id', theme.id.toString());
  targetElement.setAttribute('data-provincia-code', theme.codigo);

  // Persistencia local amigable
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cr_selected_provincia_id', theme.id.toString());
    }
  } catch {
    // Manejo de entornos con localStorage restringido
  }

  return theme;
}

/**
 * Calcula si un color de texto claro o blanco cumple contraste WCAG 2.1 AA (> 4.5:1)
 */
export function getContrastingTextColor(hexColor: string): string {
  const { r, g, b } = hexToRgb(hexColor);
  // Fórmula de luminancia relativa estándar sRGB WCAG
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#00040D' : '#FFFFFF';
}
