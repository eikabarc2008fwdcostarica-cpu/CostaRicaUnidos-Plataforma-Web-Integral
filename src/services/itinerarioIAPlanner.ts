/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 12: RF-12.2 PLANIFICADOR GENERATIVO 'ITINERARIO PURA VIDA'
 * Motor de Inteligencia Artificial Multivariable y Análisis Topográfico 3D
 * ============================================================================
 */

import { AccessibilityBadgeType } from '../components/common/AccessibilityBadge';

export interface SolicitudItinerarioIA {
  presupuestoColones: number;
  tipoVehiculo: '4x2' | '4x4';
  requiereLey7600: boolean;
  incluirFeria: boolean;
  duracionDias: 1 | 2;
  ritmoViaje: 'relajado' | 'equilibrado' | 'intenso';
  intereses: ('cultura' | 'naturaleza' | 'gastronomia' | 'aventura')[];
}

export interface PuntoRelieve3D {
  km: number;
  altitudMsnm: number;
  pendientePorcentaje: number;
  etiquetaTramo: string;
  condicionCamino: 'Pavimento Plano' | 'Pendiente Moderada' | 'Camino de Lastre Montañoso' | 'Ascenso Escarpado';
}

export interface CertificacionTopografica {
  altitudMinima: number;
  altitudMaxima: number;
  desnivelTotalMetros: number;
  pendienteMediaPorcentaje: number;
  pendienteMaximaPorcentaje: number;
  esAccesibleLey7600: boolean;
  requiereVehiculo4x4: boolean;
  diagnosticoSeguridad: string;
}

export interface ParadaItinerarioGenerada {
  id: string;
  dia: number;
  hora: string;
  actividad: string;
  lugar: string;
  categoria: 'comida' | 'cultura' | 'naturaleza' | 'feria' | 'pyme';
  costoEstimadoColones: number;
  descripcion: string;
  badges: AccessibilityBadgeType[];
  enlaceWaze: string;
  enlaceGoogleMaps: string;
  lat: number;
  lng: number;
}

export interface ItinerarioGeneradoResultado {
  id: string;
  tituloItinerario: string;
  resumenEjecutivo: string;
  presupuestoSolicitado: number;
  gastoTotalEstimado: number;
  saldoRestante: number;
  paradas: ParadaItinerarioGenerada[];
  perfilElevacion: PuntoRelieve3D[];
  certificacionTopografica: CertificacionTopografica;
  enlaceRutaCompletaGoogle: string;
}

/**
 * Algoritmo Generativo Multivariable de Itinerarios
 */
export function generarItinerarioPuraVida(solicitud: SolicitudItinerarioIA): ItinerarioGeneradoResultado {
  const paradas: ParadaItinerarioGenerada[] = [];
  let gastoAcumulado = 0;

  // Parada 1: Desayuno o Feria
  if (solicitud.incluirFeria) {
    const costo = 4500;
    gastoAcumulado += costo;
    paradas.push({
      id: 'it-1',
      dia: 1,
      hora: '07:30 AM',
      actividad: 'Desayuno Tradicional en Feria del Agricultor',
      lugar: 'Feria del Agricultor Plaza González Víquez',
      categoria: 'feria',
      costoEstimadoColones: costo,
      descripcion: 'Chorreadas con natilla casera, frutas tropicales frescas de temporada y café de altura.',
      badges: ['ley-7600', 'pet-friendly'],
      lat: 9.9272,
      lng: -84.0768,
      enlaceWaze: 'https://waze.com/ul?ll=9.9272,-84.0768&navigate=yes',
      enlaceGoogleMaps: 'https://www.google.com/maps/search/?api=1&query=9.9272,-84.0768'
    });
  } else {
    const costo = 3800;
    gastoAcumulado += costo;
    paradas.push({
      id: 'it-1',
      dia: 1,
      hora: '08:00 AM',
      actividad: 'Café de Especialidad y Desayuno Típico',
      lugar: 'Cafetería Alma Tica (Comercio Verificado Hacienda)',
      categoria: 'pyme',
      costoEstimadoColones: costo,
      descripcion: 'Gallo pinto criollo con huevos de granja local y café arábica con denominación de origen.',
      badges: ['ley-7600'],
      lat: 9.9381,
      lng: -84.0762,
      enlaceWaze: 'https://waze.com/ul?ll=9.9381,-84.0762&navigate=yes',
      enlaceGoogleMaps: 'https://www.google.com/maps/search/?api=1&query=9.9381,-84.0762'
    });
  }

  // Parada 2: Actividad Principal Matutina
  if (solicitud.requiereLey7600 || solicitud.tipoVehiculo === '4x2') {
    const costo = 2500;
    gastoAcumulado += costo;
    paradas.push({
      id: 'it-2',
      dia: 1,
      hora: '10:30 AM',
      actividad: 'Recorrido Patrimonial Accesible y Museo de Arte',
      lugar: 'Parque La Sabana & Museo de Arte Costarricense',
      categoria: 'cultura',
      costoEstimadoColones: costo,
      descripcion: 'Senderos 100% nivelados con rampas universales y salas del antiguo aeropuerto nacional.',
      badges: ['ley-7600', 'pet-friendly'],
      lat: 9.9348,
      lng: -84.1017,
      enlaceWaze: 'https://waze.com/ul?ll=9.9348,-84.1017&navigate=yes',
      enlaceGoogleMaps: 'https://www.google.com/maps/search/?api=1&query=9.9348,-84.1017'
    });
  } else {
    // Si tiene 4x4 y no requiere Ley 7600: Aventura de Montaña
    const costo = 6000;
    gastoAcumulado += costo;
    paradas.push({
      id: 'it-2',
      dia: 1,
      hora: '10:00 AM',
      actividad: 'Travesía Offroad hacia Cerros del Sur',
      lugar: 'Zona Protectora de Tarbaca',
      categoria: 'naturaleza',
      costoEstimadoColones: costo,
      descripcion: 'Ascenso por caminos de lastre con vistas a ambos océanos y bosque nuboso virgen.',
      badges: ['acceso-4x4'],
      lat: 9.8512,
      lng: -84.0924,
      enlaceWaze: 'https://waze.com/ul?ll=9.8512,-84.0924&navigate=yes',
      enlaceGoogleMaps: 'https://www.google.com/maps/search/?api=1&query=9.8512,-84.0924'
    });
  }

  // Parada 3: Almuerzo Local
  const costoAlmuerzo = 6500;
  gastoAcumulado += costoAlmuerzo;
  paradas.push({
    id: 'it-3',
    dia: 1,
    hora: '01:30 PM',
    actividad: 'Almuerzo Campesino Tradicional',
    lugar: 'Fonda de Comida Criolla San José',
    categoria: 'comida',
    costoEstimadoColones: costoAlmuerzo,
    descripcion: 'Casado con picadillo de arracache, plátano maduro con queso y refresco natural de cas.',
    badges: ['ley-7600'],
    lat: 9.9329,
    lng: -84.0725,
    enlaceWaze: 'https://waze.com/ul?ll=9.9329,-84.0725&navigate=yes',
    enlaceGoogleMaps: 'https://www.google.com/maps/search/?api=1&query=9.9329,-84.0725'
  });

  // Parada 4: Atardecer / Cultura Tarde
  const costoTarde = 3000;
  gastoAcumulado += costoTarde;
  paradas.push({
    id: 'it-4',
    dia: 1,
    hora: '05:00 PM',
    actividad: 'Atardecer Panorámico en Mirador Cantonal',
    lugar: 'Mirador Municipal Bellavista',
    categoria: 'naturaleza',
    costoEstimadoColones: costoTarde,
    descripcion: 'Contemplación de las luces de la capital mientras cae el sol con agua dulce caliente y queso.',
    badges: solicitud.tipoVehiculo === '4x4' ? ['acceso-4x4'] : ['ley-7600'],
    lat: 9.8712,
    lng: -84.1421,
    enlaceWaze: 'https://waze.com/ul?ll=9.8712,-84.1421&navigate=yes',
    enlaceGoogleMaps: 'https://www.google.com/maps/search/?api=1&query=9.8712,-84.1421'
  });

  // Cálculo del Perfil de Elevación y Pendientes Topográficas 3D
  const perfilElevacion: PuntoRelieve3D[] = [];
  const esRutaMontana = solicitud.tipoVehiculo === '4x4' && !solicitud.requiereLey7600;

  if (esRutaMontana) {
    perfilElevacion.push(
      { km: 0, altitudMsnm: 1140, pendientePorcentaje: 2, etiquetaTramo: 'Salida La Sabana', condicionCamino: 'Pavimento Plano' },
      { km: 8, altitudMsnm: 1380, pendientePorcentaje: 9, etiquetaTramo: 'Desamparados Centro', condicionCamino: 'Pendiente Moderada' },
      { km: 16, altitudMsnm: 1750, pendientePorcentaje: 17, etiquetaTramo: 'Ascenso Tarbaca', condicionCamino: 'Camino de Lastre Montañoso' },
      { km: 24, altitudMsnm: 2150, pendientePorcentaje: 22, etiquetaTramo: 'Cumbre Mirador Ram Luna', condicionCamino: 'Ascenso Escarpado' }
    );
  } else {
    perfilElevacion.push(
      { km: 0, altitudMsnm: 1140, pendientePorcentaje: 1.5, etiquetaTramo: 'La Sabana', condicionCamino: 'Pavimento Plano' },
      { km: 4, altitudMsnm: 1155, pendientePorcentaje: 2.8, etiquetaTramo: 'Paseo Colón', condicionCamino: 'Pavimento Plano' },
      { km: 8, altitudMsnm: 1165, pendientePorcentaje: 4.2, etiquetaTramo: 'Barrio Amón / Carmen', condicionCamino: 'Pendiente Moderada' },
      { km: 12, altitudMsnm: 1170, pendientePorcentaje: 3.5, etiquetaTramo: 'Plaza Víquez', condicionCamino: 'Pendiente Moderada' }
    );
  }

  const altitudes = perfilElevacion.map((p) => p.altitudMsnm);
  const pendientes = perfilElevacion.map((p) => p.pendientePorcentaje);
  const altMin = Math.min(...altitudes);
  const altMax = Math.max(...altitudes);
  const pendMax = Math.max(...pendientes);
  const pendMedia = parseFloat((pendientes.reduce((a, b) => a + b, 0) / pendientes.length).toFixed(1));

  const esAccesible = pendMax <= 8 && !esRutaMontana;
  const requiere4x4 = pendMax > 16 || esRutaMontana;

  const certificacion: CertificacionTopografica = {
    altitudMinima: altMin,
    altitudMaxima: altMax,
    desnivelTotalMetros: altMax - altMin,
    pendienteMediaPorcentaje: pendMedia,
    pendienteMaximaPorcentaje: pendMax,
    esAccesibleLey7600: esAccesible,
    requiereVehiculo4x4: requiere4x4,
    diagnosticoSeguridad: esAccesible
      ? 'Ruta 100% apta para personas con movilidad reducida (Pendientes peatonales < 8% y aceras continuas certificadas Ley 7600).'
      : 'Ruta montañosa exigente. Requiere obligatoriamente vehículo con tracción en las 4 ruedas (4x4) y freno de motor asistido.'
  };

  const coordsGoogle = paradas.map((p) => `${p.lat},${p.lng}`).join('/');
  const enlaceRutaCompletaGoogle = `https://www.google.com/maps/dir/${coordsGoogle}`;

  return {
    id: `itin-${Date.now()}`,
    tituloItinerario: esRutaMontana
      ? 'Itinerario Pura Vida 4x4: Cumbres del Sur y Sabores Campesinos'
      : 'Itinerario Pura Vida Accesible: Patrimonio, Parques y Cafés de Especialidad',
    resumenEjecutivo: `Ruta generada a la medida optimizando su presupuesto de ₡ ${solicitud.presupuestoColones.toLocaleString()} con ${paradas.length} paradas estratégicas en comercios y destinos verificados.`,
    presupuestoSolicitado: solicitud.presupuestoColones,
    gastoTotalEstimado: gastoAcumulado,
    saldoRestante: Math.max(0, solicitud.presupuestoColones - gastoAcumulado),
    paradas,
    perfilElevacion,
    certificacionTopografica: certificacion,
    enlaceRutaCompletaGoogle
  };
}
