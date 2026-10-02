/**
 * ============================================================================
 * COSTA RICA UNIDOS — UTILIDADES DE PRIVACIDAD Y PROTECCIÓN DE DATOS (LEY N° 8968)
 * Sanitización de nombres públicos y resguardo estricto de la cédula de identidad
 * ============================================================================
 */

/**
 * Convierte un texto a Title Case (Primera letra mayúscula, resto minúscula).
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .trim();
}

/**
 * Sanitiza el nombre completo de un ciudadano para mostrar ÚNICA Y EXCLUSIVAMENTE
 * su Primer Nombre y Primer Apellido en comentarios, foros, hilos y espacios públicos.
 *
 * Ejemplos:
 * - "Eiker Manuel Abarca Murillo" -> "Eiker Abarca"
 * - "EIKER MANUEL ABARCA MURILLO" -> "Eiker Abarca"
 * - "GUADALUPE RUIZ CHINCHILLA VALENTINA DE" -> "Guadalupe Ruiz"
 * - "Sofía Arguedas Castro" -> "Sofía Arguedas"
 * - "Carlos Monge" -> "Carlos Monge"
 * - "Valeria Chaves" -> "Valeria Chaves"
 *
 * Cumple estrictamente con la Ley de Protección de la Persona frente al
 * Tratamiento de sus Datos Personales (Ley N° 8968 de Costa Rica).
 */
export function obtenerNombrePublico(nombreCompleto?: string | null): string {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') {
    return 'Ciudadano';
  }

  const limpio = nombreCompleto.trim().replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  const palabras = limpio.split(/\s+/).filter(Boolean);

  if (palabras.length === 0) {
    return 'Ciudadano';
  }

  if (palabras.length === 1) {
    return toTitleCase(palabras[0]);
  }

  // Si tiene exactamente 2 palabras: "Carlos Monge" -> Primer Nombre + Primer Apellido
  if (palabras.length === 2) {
    return `${toTitleCase(palabras[0])} ${toTitleCase(palabras[1])}`;
  }

  // Si tiene 3 palabras: Formato habitual en Costa Rica (1 Nombre + 2 Apellidos)
  // Ej: "Sofía Arguedas Castro" -> Primer Nombre: "Sofía", Primer Apellido: "Arguedas"
  if (palabras.length === 3) {
    return `${toTitleCase(palabras[0])} ${toTitleCase(palabras[1])}`;
  }

  // Si tiene 4 o más palabras: Formato oficial habitual (2 Nombres + 2 Apellidos)
  // Ej: "Eiker Manuel Abarca Murillo" -> Primer Nombre: "Eiker", Primer Apellido: "Abarca"
  // palabras[0] = "Eiker", palabras[2] = "Abarca"
  return `${toTitleCase(palabras[0])} ${toTitleCase(palabras[2])}`;
}

/**
 * Formatea un número de cédula física costarricense (9 dígitos) al formato oficial X-XXXX-XXXX.
 * Se utiliza EXCLUSIVAMENTE en la vista privada del titular del perfil.
 */
export function formatearCedulaOficial(cedula?: string | null): string {
  if (!cedula) return '';
  const str = String(cedula).trim();
  const digits = str.replace(/[^0-9]/g, '');

  if (digits.length === 9) {
    return `${digits.charAt(0)}-${digits.substring(1, 5)}-${digits.substring(5, 9)}`;
  }
  if (digits.length === 10) {
    // Cédula jurídica o DIMEX
    return `${digits.charAt(0)}-${digits.substring(1, 4)}-${digits.substring(4, 10)}`;
  }

  return str;
}

/**
 * Determina si el rol pertenece a la esfera ciudadana/comunitaria (no administrativo).
 */
export function esRolCiudadano(rol?: string | null): boolean {
  if (!rol) return false;
  const r = String(rol).toLowerCase().trim();
  return (
    r.includes('ciudadan') ||
    r.includes('turista') ||
    r.includes('cr ciudadano') ||
    r.includes('residente') ||
    r.includes('vecin') ||
    r.includes('emprendedor') ||
    r === 'nivel_1' ||
    r === 'nivel_2' ||
    r === 'ciudadano/turista' ||
    r === 'ciudadano_turista'
  );
}
