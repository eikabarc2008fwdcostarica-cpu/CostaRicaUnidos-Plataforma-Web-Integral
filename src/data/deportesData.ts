/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 04: DATOS DEL ECOSISTEMA DEPORTIVO CANTONAL (CCDR)
 * Catálogo de escuelas, instalaciones deportivas y atletas de orgullo cantonal
 * ============================================================================
 */

import { StatusPillType } from '../components/common/StatusPill';

export interface InstalacionDeportiva {
  id: string;
  nombre: string;
  disciplinaPrincipal: string;
  distrito: string;
  direccion: string;
  capacidad: string;
  estado: StatusPillType;
  tarifaAlquiler: string;
  horario: string;
  esPublica: boolean;
  telefonoContacto: string;
  lat: number;
  lng: number;
  servicios: string[];
}

export interface EscuelaDeportivaCCDR {
  id: string;
  disciplina: string;
  icono: string;
  categoriaEdad: string; // ej: 'Sub-12', 'Sub-15', 'Juvenil', 'Adulto Mayor'
  profesorACargo: string;
  lugarEntrenamiento: string;
  diasHorario: string;
  cuposDisponibles: number;
  mensualidad: string; // 'Gratuito Municipal' o monto social
  requisitos: string[];
}

export interface AtletaOrgulloCantonal {
  id: string;
  nombre: string;
  disciplina: string;
  logros: string[];
  edad: number;
  distritoOrigen: string;
  juegosNacionalesMedallas: { oro: number; plata: number; bronce: number };
  fotoUrl: string;
}

export interface PostFeedComunitario {
  id: string;
  autor: string;
  distrito: string;
  disciplina: string;
  fecha: string;
  contenido: string;
  likes: number;
  moderado: boolean;
}

export const DEPORTES_MOCK_DATA: {
  instalaciones: InstalacionDeportiva[];
  escuelas: EscuelaDeportivaCCDR[];
  atletas: AtletaOrgulloCantonal[];
  feed: PostFeedComunitario[];
} = {
  instalaciones: [
    {
      id: 'inst-1',
      nombre: 'Polideportivo San Francisco de Dos Ríos',
      disciplinaPrincipal: 'Fútbol, Natación y Pista Atlética',
      distrito: 'San Francisco de Dos Ríos',
      direccion: 'Costado sur del Parque Comunal',
      capacidad: '1,500 personas',
      estado: 'abierto',
      tarifaAlquiler: 'Uso libre comunitario / Pistas federadas',
      horario: 'Lunes a Domingo: 06:00 - 21:00 hrs',
      esPublica: true,
      telefonoContacto: '(506) 2226-5544',
      lat: 9.9125,
      lng: -84.0538,
      servicios: ['Iluminación Nocturna', 'Piscina Semiolímpica', 'Gimnasio Techado', 'Rampas Ley 7600']
    },
    {
      id: 'inst-2',
      nombre: 'Pabellón Deportivo La Sabana (Gimnasio Nacional)',
      disciplinaPrincipal: 'Baloncesto, Voleibol y Balonmano',
      distrito: 'Mata Redonda',
      direccion: 'Costado sureste del Parque Metropolitano La Sabana',
      capacidad: '4,000 personas',
      estado: 'alquiler',
      tarifaAlquiler: '₡ 35,000 / hora para eventos privados',
      horario: 'Martes a Domingo: 07:00 - 22:00 hrs',
      esPublica: true,
      telefonoContacto: '(506) 2256-1122',
      lat: 9.9333,
      lng: -84.1011,
      servicios: ['Duela de Madera Internacional', 'Tableros Electrónicos', 'Vestidores Accesibles', 'Camerinos']
    },
    {
      id: 'inst-3',
      nombre: 'Centro Acuático y Tenis Zapote',
      disciplinaPrincipal: 'Natación Adaptada y Tenis de Campo',
      distrito: 'Zapote',
      direccion: '300 metros este del Redondel de Zapote',
      capacidad: '800 personas',
      estado: 'mantenimiento',
      tarifaAlquiler: 'Tarifa social municipal ₡ 2,000 / sesión',
      horario: 'Cerrado temporalmente por pintura y filtración',
      esPublica: true,
      telefonoContacto: '(506) 2283-4411',
      lat: 9.9234,
      lng: -84.0612,
      servicios: ['Elevador Hidráulico en Piscina', 'Canchas de Arcilla', 'Parqueo Accesible']
    },
    {
      id: 'inst-4',
      nombre: 'Cancha Sintética y Parque Pavas Norte',
      disciplinaPrincipal: 'Fútbol 7 y Calistenia',
      distrito: 'Pavas',
      direccion: 'Frente a la Delegación Policial de Pavas',
      capacidad: '450 personas',
      estado: 'abierto',
      tarifaAlquiler: 'Gratuito para escuelas formativas CCDR',
      horario: 'Todos los días: 06:00 - 20:00 hrs',
      esPublica: true,
      telefonoContacto: '(506) 2231-7788',
      lat: 9.9467,
      lng: -84.1356,
      servicios: ['Césped Sintético Monofilamento', 'Malla Perimetral', 'Bebederos Inclusivos']
    }
  ],

  escuelas: [
    {
      id: 'esc-1',
      disciplina: 'Fútbol Formativo Comunitario',
      icono: '⚽',
      categoriaEdad: 'Sub-9, Sub-12 y Sub-15',
      profesorACargo: 'Prof. Carlos Santana Mora (Licencia B Conmebol)',
      lugarEntrenamiento: 'Polideportivo San Francisco de Dos Ríos',
      diasHorario: 'Martes y Jueves de 15:30 a 17:30 hrs',
      cuposDisponibles: 14,
      mensualidad: 'Gratuito Municipal (CCDR)',
      requisitos: ['Cédula de menor o física', 'Certificado médico básico', 'Residencia cantonal comprobada']
    },
    {
      id: 'esc-2',
      disciplina: 'Natación y Salvamento Acuático',
      icono: '🏊',
      categoriaEdad: 'Infantil y Juvenil (8 a 17 años)',
      profesorACargo: 'Entrenadora Mariana Brenes Fallas',
      lugarEntrenamiento: 'Piscina del Polideportivo San Francisco',
      diasHorario: 'Lunes, Miércoles y Viernes de 16:00 a 18:00 hrs',
      cuposDisponibles: 6,
      mensualidad: 'Gratuito Municipal (CCDR)',
      requisitos: ['Saber flotar básico', 'Gorro y gafas de natación', 'Póliza estudiantil al día']
    },
    {
      id: 'esc-3',
      disciplina: 'Baloncesto Femenino y Masculino',
      icono: '🏀',
      categoriaEdad: 'Sub-13 y Sub-17',
      profesorACargo: 'Coach Javier Ureña Castro',
      lugarEntrenamiento: 'Gimnasio Nacional La Sabana',
      diasHorario: 'Sábados y Domingos de 09:00 a 12:00 hrs',
      cuposDisponibles: 18,
      mensualidad: 'Gratuito Municipal (CCDR)',
      requisitos: ['Calzado deportivo para duela', 'Consentimiento firmado de padres o tutores']
    },
    {
      id: 'esc-4',
      disciplina: 'Para-Atletismo y Atletismo Adaptado (Ley 7600)',
      icono: '♿',
      categoriaEdad: 'Todas las edades (Inclusivo Universal)',
      profesorACargo: 'Licda. Katherine Solano (Especialista en Deporte Adaptado)',
      lugarEntrenamiento: 'Pista Atlética La Sabana',
      diasHorario: 'Lunes a Jueves de 08:00 a 10:30 hrs',
      cuposDisponibles: 22,
      mensualidad: 'Gratuito Municipal (CCDR)',
      requisitos: ['Dictamen médico para actividad física adaptada', 'Asistencia de acompañante si lo requiere']
    }
  ],

  atletas: [
    {
      id: 'atl-1',
      nombre: 'Valeria Cárdenas Mora',
      disciplina: 'Natación (100m y 200m Libre)',
      logros: ['Medallista de Oro en Juegos Deportivos Nacionales 2025', 'Seleccionada Mayor'],
      edad: 17,
      distritoOrigen: 'San Sebastián',
      juegosNacionalesMedallas: { oro: 3, plata: 1, bronce: 0 },
      fotoUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'atl-2',
      nombre: 'Esteban Cordero Vindas',
      disciplina: 'Para-Atletismo T54 (Silla de Carreras)',
      logros: ['Récord Nacional Juvenil en 400m', 'Premio Colibrí de Oro Municipal'],
      edad: 19,
      distritoOrigen: 'Hatillo',
      juegosNacionalesMedallas: { oro: 2, plata: 0, bronce: 1 },
      fotoUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'atl-3',
      nombre: 'Lucía Zúñiga Chaves',
      disciplina: 'Gimnasia Artística y Rítmica',
      logros: ['Campeona Centroamericana Infantil', 'Capitana Equipo Cantonal San José'],
      edad: 15,
      distritoOrigen: 'Pavas',
      juegosNacionalesMedallas: { oro: 4, plata: 2, bronce: 0 },
      fotoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80'
    }
  ],

  feed: [
    {
      id: 'post-1',
      autor: 'Comunidad Barrio Cuba Deportiva',
      distrito: 'Hospital',
      disciplina: 'Torneo Relámpago de Barrio',
      fecha: 'Hace 2 horas',
      contenido: '¡Gran final del torneo de fútbol sala este sábado en la plaza de Barrio Cuba! Ven con tu familia a apoyar el deporte sano y la convivencia vecinal.',
      likes: 42,
      moderado: true
    },
    {
      id: 'post-2',
      autor: 'Club de Senderismo Cerros del Sur',
      distrito: 'San Francisco',
      disciplina: 'Senderismo Ecológico',
      fecha: 'Ayer',
      contenido: 'Convocatoria abierta para el trote matutino alrededor de La Sabana. Nivel principiante y familiar, punto de encuentro en la estatua de León Cortés a las 06:30.',
      likes: 29,
      moderado: true
    }
  ]
};
