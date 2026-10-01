/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 11: PARTICIPACIÓN CIUDADANA Y PRESUPUESTO PARTICIPATIVO
 * Esquema de datos y tipos conectado a dbClient (Única fuente de verdad).
 * ============================================================================
 */

import { dbClient } from '../services/dbClient';

export interface ProyectoVecinal {
  id: string;
  titulo: string;
  distrito: string;
  categoria: 'Infraestructura & Aceras' | 'Espacios Verdes y Parques' | 'Seguridad y Movilidad' | 'Cultura y Juventud';
  descripcion: string;
  presupuestoEstimadoColones: number;
  presupuestoFormateado: string;
  votosAcumulados: number;
  estadoVotacion: 'Votación Abierta' | 'En Ejecución' | 'Aprobado';
  proponenteComunal: string;
  beneficiariosEstimados: string;
  fechaCierre: string;
}

export interface SolicitudAudienciaConcejo {
  id: string;
  cedulaCiudadano: string;
  nombreCompleto: string;
  distrito: string;
  motivoAudiencia: string;
  tipoAsunto: 'Obra Pública' | 'Seguridad Comunal' | 'Patentes y Comercio' | 'Medio Ambiente';
  documentosAdjuntosCount: number;
  fechaSolicitud: string;
  estado: 'Pendiente de Revisión' | 'En Agenda del Concejo' | 'Audiencia Concedida';
}

/**
 * Obtiene los proyectos de presupuesto participativo directamente de dbClient.
 */
export function obtenerProyectosPresupuesto(): ProyectoVecinal[] {
  const raw = dbClient.getCollection<any>('proyectosPresupuesto');
  return raw.map((p) => {
    const monto = p.presupuestoEstimadoColones || p.montoEstimado || 45000000;
    return {
      id: p.id,
      titulo: p.titulo,
      distrito: p.distrito || 'Cantonal',
      categoria: p.categoria || 'Infraestructura & Aceras',
      descripcion: p.descripcion || 'Iniciativa ciudadana para mejora de infraestructura cantonal.',
      presupuestoEstimadoColones: monto,
      presupuestoFormateado: p.presupuestoFormateado || `₡ ${monto.toLocaleString('es-CR')}`,
      votosAcumulados: p.votosAcumulados || 0,
      estadoVotacion: (p.estadoVotacion || (p.estado === 'EN_VOTACION' ? 'Votación Abierta' : 'Aprobado')) as any,
      proponenteComunal: p.proponenteComunal || 'Asociación de Desarrollo Integral (ADI)',
      beneficiariosEstimados: p.beneficiariosEstimados || '15,000 vecinos',
      fechaCierre: p.fechaCierre || '15 de Noviembre, 2026'
    };
  });
}

// Compatibilidad retroactiva
export const PROYECTOS_VECINALES_DATA: ProyectoVecinal[] = [];

// Registro auxiliar en memoria
export const VOTOS_REGISTRADOS_CEDULAS = new Set<string>();
