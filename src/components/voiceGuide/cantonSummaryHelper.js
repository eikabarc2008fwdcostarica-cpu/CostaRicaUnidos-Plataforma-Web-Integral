/**
 * Helper para generar el resumen institucional del cantón activo (Alcaldía, Concejo y Gobierno Local)
 * Conecta los datos territoriales de Costa Rica con los gobiernos locales oficiales 2024-2028.
 */
import { CANTONES_OFICIALES, PROVINCIAS_DATA } from '../../data/costaRicaTerritorialData';
import { GOBIERNOS_LOCALES_DB, getGobiernoCantonalCompleto } from '../../data/gobiernosLocalesCR';
import { getAutoridadesCanton } from '../../data/gobernanzaData';

export function getCantonInstitutionalSummary(cantonName = 'San José') {
  const cleanSearch = String(cantonName || '').trim().toLowerCase();

  // 1. Localizar cantón en la división territorial oficial
  const cantonItem = CANTONES_OFICIALES.find(
    (c) => c.nombre.toLowerCase() === cleanSearch || cleanSearch.includes(c.nombre.toLowerCase())
  ) || CANTONES_OFICIALES[0];

  const provinciaObj = PROVINCIAS_DATA.find((p) => p.id === cantonItem.provinciaId) || PROVINCIAS_DATA[0];

  // 2. Extraer gobierno local
  const gobierno = getGobiernoCantonalCompleto(cantonItem, provinciaObj);
  const autoridades = getAutoridadesCanton(cantonItem.id);

  // 3. Atributos institucionales clave
  const alcalde = gobierno?.alcaldia?.alcalde || autoridades?.find(a => a.cargo?.includes('Alcalde'))?.nombre || 'Alcalde Municipal Titular';
  const partidoAlcaldia = gobierno?.alcaldia?.partido || 'Gobierno Cantonal';
  const periodo = gobierno?.alcaldia?.periodo || '2024 - 2028';
  const vicealcaldesa = gobierno?.alcaldia?.vicealcaldesa1 || 'Vicealcaldía Primera';

  const presidenteConcejo = gobierno?.directorioConcejo?.presidente || autoridades?.find(a => a.cargo?.includes('Presidente'))?.nombre || 'Presidente del Concejo Municipal';
  const partidoConcejo = gobierno?.directorioConcejo?.partidoPresidencia || 'Directorio Legislativo Comunal';

  const cabecera = gobierno?.cabecera || cantonItem.cabecera || cantonItem.nombre;
  const poblacion = gobierno?.poblacion || 'Población Cantonal';
  const presupuesto = gobierno?.presupuestoAprobado || 'Presupuesto Municipal Aprobado';
  const horarioSesion = gobierno?.horarioSesion || 'Martes a las 18:00 horas';
  const lugarSesion = gobierno?.lugarSesion || `Salón de Sesiones del Concejo Municipal de ${cantonItem.nombre}`;

  return `Resumen institucional del Cantón de ${cantonItem.nombre}, Provincia de ${provinciaObj.nombre}. ` +
    `Alcaldía Municipal para el período ${periodo} a cargo de ${alcalde}, del ${partidoAlcaldia}, junto a ${vicealcaldesa} en la primera vicealcaldía. ` +
    `El Concejo Municipal es presidido por ${presidenteConcejo}, en representación de ${partidoConcejo}. ` +
    `El gobierno local tiene su sede en ${cabecera}, con una población estimada de ${poblacion} y un presupuesto municipal de ${presupuesto}. ` +
    `Las sesiones ordinarias del Concejo Municipal se celebran los ${horarioSesion} en el ${lugarSesion}.`;
}
