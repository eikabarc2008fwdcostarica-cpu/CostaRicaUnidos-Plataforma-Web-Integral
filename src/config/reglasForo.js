/**
 * ============================================================================
 * COSTA RICA UNIDOS — REGLAS Y SISTEMA DE SANCIONES DEL FORO TICO (M04)
 * Matriz oficial de convivencia cívica, reincidencia y moderación soberana.
 * ============================================================================
 */

export const VERSION_REGLAS_FORO = '1.0.0';
export const FECHA_VIGENCIA_REGLAS = '2026-10-01';

/**
 * Periodo de caducidad para reincidencias de nivel LEVE (en días).
 * Pasado este tiempo, un strike leve no computa para acumulación de reincidencia.
 */
export const DIAS_CADUCIDAD_STRIKES_LEVES = 90;

export const GRAVEDAD = {
  NINGUNA: 'NINGUNA',
  LEVE: 'LEVE',
  MEDIA: 'MEDIA',
  GRAVE: 'GRAVE'
};

export const TIPO_SANCION = {
  NINGUNA: 'NINGUNA',
  ADVERTENCIA: 'ADVERTENCIA',
  BAN_24H: 'BAN_24H',
  BAN_3D: 'BAN_3D',
  BAN_7D: 'BAN_7D',
  BAN_30D: 'BAN_30D',
  BAN_INDEFINIDO: 'BAN_INDEFINIDO'
};

export const DURACIONES_HORAS = {
  [TIPO_SANCION.ADVERTENCIA]: 0,
  [TIPO_SANCION.BAN_24H]: 24,
  [TIPO_SANCION.BAN_3D]: 72,
  [TIPO_SANCION.BAN_7D]: 168,
  [TIPO_SANCION.BAN_30D]: 720,
  [TIPO_SANCION.BAN_INDEFINIDO]: null
};

/**
 * Matriz Oficial de Sanciones Graduales:
 * [Gravedad][Número de Reincidencia (0 = 1ra vez, 1 = 2da vez, etc.)]
 */
export const MATRIZ_SANCIONES = {
  [GRAVEDAD.LEVE]: [
    TIPO_SANCION.ADVERTENCIA, // 1ª vez: Bloqueo + advertencia
    TIPO_SANCION.BAN_24H,     // 2ª vez: Baneo 24 h
    TIPO_SANCION.BAN_3D,      // 3ª vez: Baneo 3 días
    TIPO_SANCION.BAN_7D       // 4ª o más: Baneo 7 días
  ],
  [GRAVEDAD.MEDIA]: [
    TIPO_SANCION.BAN_24H,     // 1ª vez: Baneo 24 h
    TIPO_SANCION.BAN_3D,      // 2ª vez: Baneo 3 días
    TIPO_SANCION.BAN_7D,      // 3ª vez: Baneo 7 días
    TIPO_SANCION.BAN_30D      // 4ª o más: Baneo 30 días
  ],
  [GRAVEDAD.GRAVE]: [
    TIPO_SANCION.BAN_7D,          // 1ª vez: Baneo 7 días
    TIPO_SANCION.BAN_30D,         // 2ª vez: Baneo 30 días
    TIPO_SANCION.BAN_INDEFINIDO,  // 3ª vez: Baneo indefinido
    TIPO_SANCION.BAN_INDEFINIDO   // 4ª o más: Baneo indefinido
  ]
};

/**
 * Calcula la sanción correspondiente según gravedad y número de strikes vigentes del usuario.
/**
 * Calcula la sanción gradual oficial a aplicar según la gravedad de la infracción y los strikes acumulados.
 * Acepta de forma polimórfica (gravedad, strikesPrevios) o (strikesPrevios, gravedad).
 * 
 * @param {'LEVE'|'MEDIA'|'GRAVE'|'NINGUNA'|number} arg1 
 * @param {number|'LEVE'|'MEDIA'|'GRAVE'|'NINGUNA'} [arg2=0] 
 * @returns {object} Detalle de la sanción a aplicar
 */
export function calcularSancion(arg1, arg2 = 0) {
  let gravedad = GRAVEDAD.LEVE;
  let strikesPrevios = 0;

  if (typeof arg1 === 'number') {
    strikesPrevios = arg1;
    gravedad = arg2 || GRAVEDAD.LEVE;
  } else {
    gravedad = arg1 || GRAVEDAD.LEVE;
    strikesPrevios = typeof arg2 === 'number' ? arg2 : 0;
  }

  if (!gravedad || gravedad === GRAVEDAD.NINGUNA) {
    return {
      tipoSancion: TIPO_SANCION.NINGUNA,
      esBaneo: false,
      duracionHoras: 0,
      indefinida: false,
      inicio: null,
      inicioIso: null,
      fin: null,
      finIso: null,
      descripcion: 'Sin sanción.',
      mensaje: 'Sin sanción.'
    };
  }

  const fila = MATRIZ_SANCIONES[gravedad] || MATRIZ_SANCIONES[GRAVEDAD.LEVE];
  const indice = Math.min(Math.max(0, strikesPrevios), fila.length - 1);
  const tipoSancion = fila[indice];

  const ahora = new Date();
  const duracionHoras = DURACIONES_HORAS[tipoSancion];
  const esIndefinido = tipoSancion === TIPO_SANCION.BAN_INDEFINIDO;

  let fin = null;
  if (duracionHoras && duracionHoras > 0) {
    fin = new Date(ahora.getTime() + duracionHoras * 3600 * 1000).toISOString();
  }

  const descripciones = {
    [TIPO_SANCION.ADVERTENCIA]: 'Bloqueo del contenido y advertencia formativa.',
    [TIPO_SANCION.BAN_24H]: 'Bloqueo del contenido y suspensión temporal por 24 horas.',
    [TIPO_SANCION.BAN_3D]: 'Bloqueo del contenido y suspensión temporal por 3 días (72 horas).',
    [TIPO_SANCION.BAN_7D]: 'Bloqueo del contenido y suspensión temporal por 7 días.',
    [TIPO_SANCION.BAN_30D]: 'Bloqueo del contenido y suspensión severa por 30 días.',
    [TIPO_SANCION.BAN_INDEFINIDO]: 'Bloqueo del contenido y suspensión indefinida sujeta a revisión del Super Administrador.'
  };

  const textoDesc = descripciones[tipoSancion] || 'Suspensión de cuenta.';

  return {
    tipoSancion,
    esBaneo: tipoSancion !== TIPO_SANCION.ADVERTENCIA && tipoSancion !== TIPO_SANCION.NINGUNA,
    duracionHoras,
    indefinida: esIndefinido,
    inicio: ahora.toISOString(),
    inicioIso: ahora.toISOString(),
    fin,
    finIso: fin,
    descripcion: textoDesc,
    mensaje: textoDesc,
    strikesResultantes: strikesPrevios + 1
  };
}

/**
 * Textos oficiales de las Reglas de la Comunidad (fuente única de verdad).
 */
export const CONTENIDO_REGLAS_COMUNIDAD = {
  titulo: 'Reglas de la Comunidad — Foro Tico',
  subtitulo: 'Compromiso cívico de convivencia democrática, respeto mutuo y debate constructivo.',
  version: VERSION_REGLAS_FORO,
  fechaVigencia: FECHA_VIGENCIA_REGLAS,
  principios: [
    {
      titulo: 'Crítica Política y Fiscalización Respetuosa (Permitido)',
      descripcion: 'En Costa Rica Unidos defendemos la libertad de expresión y la fiscalización ciudadana. Criticar fuertemente la gestión de municipalidades, ministerios, regidores o alcaldes es totalmente legítimo y bienvenido siempre que se exprese sin insultos personales, vulgaridad obscena ni amenazas.',
      permitido: true
    },
    {
      titulo: 'Propuestas Vecinales y Soluciones Cantonales (Permitido)',
      descripcion: 'Compartir ideas para solucionar huecos viales, alumbrado, seguridad, espacios recreativos, ferias agrícolas y mejoras comunales en los 84 cantones del país.',
      permitido: true
    },
    {
      titulo: 'Prohibición de Vulgaridad y Obscenidad',
      descripcion: 'No se permite el uso de vocabulario soez, lenguaje soez no dirigido ni expresiones de índole sexual o grotesca en publicaciones ni comentarios.',
      permitido: false
    },
    {
      titulo: 'Cero Tolerancia a Insultos Personales y Acoso',
      descripcion: 'Cualquier descalificación, mofa o ataque denigrante hacia otros ciudadanos, comerciantes o funcionarios públicos está estrictamente vetado.',
      permitido: false
    },
    {
      titulo: 'Prohibición de Amenazas y Discurso de Odio',
      descripcion: 'Las intimidaciones de violencia, la discriminación por origen étnico, género, nacionalidad, orientación, discapacidad o credo conllevan sanciones de máxima gravedad.',
      permitido: false
    },
    {
      titulo: 'Protección de Datos Personales (Ley N° 8968)',
      descripcion: 'Queda prohibido publicar números de teléfono personales, direcciones exactas de viviendas particulares, copias de cédulas o información sensible de terceros sin su consentimiento.',
      permitido: false
    }
  ],
  tablaSanciones: [
    {
      gravedad: 'Leve',
      colorBadge: '#38BDF8',
      ejemplos: 'Vulgaridad suave, modismos soeces no dirigidos a personas, lenguaje informal excesivamente grosero.',
      vez1: 'Bloqueo del texto + Advertencia formativa',
      vez2: 'Suspensión por 24 horas',
      vez3: 'Suspensión por 3 días',
      vez4: 'Suspensión por 7 días'
    },
    {
      gravedad: 'Media',
      colorBadge: '#F59E0B',
      ejemplos: 'Insultos directos a otros usuarios, obscenidad dirigida, acoso reiterado o provocación hostil.',
      vez1: 'Suspensión por 24 horas',
      vez2: 'Suspensión por 3 días',
      vez3: 'Suspensión por 7 días',
      vez4: 'Suspensión por 30 días'
    },
    {
      gravedad: 'Grave',
      colorBadge: '#EF4444',
      ejemplos: 'Amenazas de daño físico, incitación al odio, contenido sexual explícito o filtración de datos privados (Ley N° 8968).',
      vez1: 'Suspensión por 7 días',
      vez2: 'Suspensión por 30 días',
      vez3: 'Suspensión Indefinida (*)',
      vez4: 'Suspensión Indefinida (*)'
    }
  ],
  notaIndefinida: '(*) La suspensión indefinida solo puede ser reconsiderada o levantada manualmente por el Super Administrador Nacional mediante justificación auditada.',
  notaCaducidad: `Los strikes de nivel leve caducan automáticamente a los ${DIAS_CADUCIDAD_STRIKES_LEVES} días si no se registran nuevas infracciones.`,
  alcanceBaneo: 'El baneo de cuenta impide iniciar sesión, publicar nuevas propuestas, comentar en debates y emitir votos o reacciones. La consulta de información cívica pública (alertas de emergencia CNE, números de socorro 911 y mapas territoriales) continúa accesible de forma universal sin necesidad de autenticación.'
};

/**
 * Verifica si un usuario ya aceptó formalmente la versión actual de las reglas del foro.
 * @param {object} usuario
 * @returns {boolean}
 */
export function haAceptadoReglas(usuario) {
  if (!usuario) return false;
  return Boolean(
    usuario.reglasAceptadas &&
    usuario.reglasAceptadas.version === VERSION_REGLAS_FORO
  );
}

/**
 * Registra la aceptación formal de las reglas por parte del usuario, sincronizando
 * tanto el estado local de sesión como el almacenamiento persistente.
 * @param {object} usuario
 * @returns {Promise<object>} Registro de aceptación
 */
export async function registrarAceptacionReglas(usuario) {
  if (!usuario) return null;
  const registro = {
    fecha: new Date().toISOString(),
    version: VERSION_REGLAS_FORO
  };

  try {
    // 1. Sesión activa en localStorage
    const s1 = localStorage.getItem('cru_user_session');
    if (s1) {
      const u = JSON.parse(s1);
      u.reglasAceptadas = registro;
      localStorage.setItem('cru_user_session', JSON.stringify(u));
    }
    const s2 = localStorage.getItem('cr_sesion_activa');
    if (s2) {
      const u = JSON.parse(s2);
      u.reglasAceptadas = registro;
      localStorage.setItem('cr_sesion_activa', JSON.stringify(u));
    }
    // 2. Base local de usuarios
    const dbRaw = localStorage.getItem('cr_db_usuarios');
    if (dbRaw) {
      const dbUsers = JSON.parse(dbRaw);
      if (Array.isArray(dbUsers)) {
        const idx = dbUsers.findIndex(
          (x) => x.id === usuario.id || (usuario.cedula && x.cedula === usuario.cedula)
        );
        if (idx !== -1) {
          dbUsers[idx].reglasAceptadas = registro;
          localStorage.setItem('cr_db_usuarios', JSON.stringify(dbUsers));
        }
      }
    }
  } catch (err) {
    console.warn('[reglasForo] Error guardando aceptación de reglas:', err);
  }

  // 3. Notificar a la API de usuarios en db.json si hay ID disponible
  try {
    if (usuario.id) {
      fetch(`/api/usuarios/${encodeURIComponent(usuario.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reglasAceptadas: registro })
      }).catch(() => {});
    }
  } catch (_e) {}

  return registro;
}

