/**
 * ============================================================================
 * COSTA RICA UNIDOS — REGLAS OFICIALES DE LA COMUNIDAD (FUENTE DE VERDAD)
 * ============================================================================
 * 
 * Marco normativo unificado para convivencia cívica digital, moderación local
 * (Capa 1), supervisión por IA (Capa 2 / Gemini) y auditoría de la plataforma.
 */

export const REGLAS_COMUNIDAD = {
  1: {
    id: 1,
    codigo: 'CRITICA_POLITICA_LEGITIMA',
    tipo: 'PERMITIDO',
    nombre: 'Crítica Política y Fiscalización Ciudadana',
    resumen: 'Se permite y promueve la fiscalización y crítica ciudadana, incluso enérgica o vehemente, hacia municipalidades, ministerios, regidores, alcaldes o instituciones públicas, siempre que no contenga insultos personales denigrantes, vulgaridad obscena ni amenazas.',
    ejemplosPermitidos: [
      'El alcalde de San José ha manejado de forma pésima e incompetente los fondos de recolección de basura.',
      'Exigimos explicaciones al concejo municipal por el despilfarro en festejos mientras las calles están destruidas.',
      'La burocracia del ministerio es negligente y retrasa las obras de acueductos en Limón.'
    ]
  },
  2: {
    id: 2,
    codigo: 'PROPUESTAS_VECINALES',
    tipo: 'PERMITIDO',
    nombre: 'Propuestas Vecinales y Mejoras Comunales',
    resumen: 'Se permite toda propuesta cívica constructiva para la mejora de los 84 cantones (reparación de huecos viales, alumbrado, seguridad ciudadana, ferias del agricultor, espacios deportivos y ambientales).',
    ejemplosPermitidos: [
      'Proponemos organizar un comité vecinal para reportar los huecos en la radial de Heredia.',
      'Urge que la municipalidad instale luminarias solares en el parque infantil de Santa Cruz.',
      'Apoyemos la feria del agricultor local este domingo en Coronado.'
    ]
  },
  3: {
    id: 3,
    codigo: 'VULGARIDAD_OBSCENIDAD',
    tipo: 'PROHIBIDO',
    gravedadDefault: 'LEVE',
    nombre: 'Vulgaridad y Expresiones Obscenas',
    resumen: 'Queda estrictamente prohibido el uso de vocabulario soez, obsceno o expresiones grotescas/sexuales, incluso si no van dirigidas a un usuario o funcionario en específico.',
    motivoAmable: 'Tu mensaje contiene lenguaje soez o expresiones vulgares que no corresponden al tono de diálogo respetuoso del foro cívico (Regla 3).'
  },
  4: {
    id: 4,
    codigo: 'INSULTOS_ACOSOS',
    tipo: 'PROHIBIDO',
    gravedadDefault: 'MEDIA',
    nombre: 'Insultos Personales y Acoso',
    resumen: 'Queda terminantemente prohibida la descalificación personal, mofa denigrante, acoso o ataque directo contra ciudadanos, comerciantes, líderes comunitarios o funcionarios.',
    motivoAmable: 'Tu mensaje fue retenido por contener ataques o descalificaciones personales directas contra otros miembros de la comunidad o funcionarios (Regla 4).'
  },
  5: {
    id: 5,
    codigo: 'AMENAZAS_DISCURSO_ODIO',
    tipo: 'PROHIBIDO',
    gravedadDefault: 'GRAVE',
    nombre: 'Amenazas y Discurso de Odio',
    resumen: 'Máxima gravedad: Prohibición absoluta de intimidación de violencia (directa o velada), apología al delito y cualquier forma de discriminación por etnia, género, nacionalidad (incluida xenofobia), orientación sexual, discapacidad o credo.',
    motivoAmable: 'Tu publicación ha sido bloqueada de manera inmediata por vulnerar la seguridad de la comunidad mediante amenazas o expresiones discriminatorias de odio (Regla 5).'
  },
  6: {
    id: 6,
    codigo: 'DATOS_PERSONALES_PRIVACIDAD',
    tipo: 'PROHIBIDO',
    gravedadDefault: 'GRAVE',
    nombre: 'Blindaje de Datos Personales (Ley N.º 8968)',
    resumen: 'Prohibición absoluta de publicar números de teléfono personales, direcciones exactas de residencias privadas, números de cédula, DIMEX o información sensible de terceros sin consentimiento formal.',
    motivoAmable: 'Por resguardo a la privacidad y en cumplimiento de la Ley N.º 8968, no está permitida la divulgación de números telefónicos, cédulas o direcciones privadas de personas en el foro (Regla 6).'
  }
};

/**
 * Obtiene el mensaje pedagógico y amable según las reglas infringidas
 * @param {number[]} reglasInfringidas
 * @returns {string}
 */
export function obtenerMotivoAmableRegla(reglasInfringidas = []) {
  if (!Array.isArray(reglasInfringidas) || reglasInfringidas.length === 0) {
    return 'Tu publicación fue retenida temporalmente por no cumplir con las normas de convivencia cívica del Foro Tico.';
  }

  // Priorizar reglas más graves: 5 > 6 > 4 > 3
  if (reglasInfringidas.includes(5)) return REGLAS_COMUNIDAD[5].motivoAmable;
  if (reglasInfringidas.includes(6)) return REGLAS_COMUNIDAD[6].motivoAmable;
  if (reglasInfringidas.includes(4)) return REGLAS_COMUNIDAD[4].motivoAmable;
  if (reglasInfringidas.includes(3)) return REGLAS_COMUNIDAD[3].motivoAmable;

  return REGLAS_COMUNIDAD[reglasInfringidas[0]]?.motivoAmable ||
    'Tu publicación ha sido retenida preventivamente de acuerdo con las reglas de la comunidad.';
}
