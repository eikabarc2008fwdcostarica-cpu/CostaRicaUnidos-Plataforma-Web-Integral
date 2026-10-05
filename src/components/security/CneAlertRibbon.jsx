import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const CNE_ALERT_LEVELS = {
  verde: {
    id: 'verde',
    titulo: 'Alerta Verde (Informativa / Prevención)',
    color: '#00D166',
    bgColor: 'rgba(0, 209, 102, 0.22)',
    borderColor: '#00D166',
    textColor: '#002914',
    badgeText: 'ALERTA VERDE',
    protocolo: 'Monitoreo preventivo del Instituto Meteorológico Nacional (IMN) y comités locales de emergencia.',
    zonas: 'Territorio Nacional / Vigilancia Rutinaria'
  },
  amarilla: {
    id: 'amarilla',
    titulo: 'Alerta Amarilla (Precaución)',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.22)',
    borderColor: '#F59E0B',
    textColor: '#331B00',
    badgeText: 'ALERTA AMARILLA',
    protocolo: 'Preparación de albergues y activación de comités cantonales ante incremento de lluvias o sismicidad.',
    zonas: 'Pacífico Central, Caribe Sur y Valle Central'
  },
  naranja: {
    id: 'naranja',
    titulo: 'Alerta Naranja (Peligro / Severo)',
    color: '#F36717',
    bgColor: 'rgba(243, 103, 23, 0.25)',
    borderColor: '#F36717',
    textColor: '#FFFFFF',
    badgeText: 'ALERTA NARANJA',
    protocolo: 'Despliegue táctico de Fuerza Pública, Bomberos y Cruz Roja. Movilización voluntaria de población en riesgo.',
    zonas: 'Zona Norte, Guanacaste y Cuencas del Río Sarapiquí'
  },
  roja: {
    id: 'roja',
    titulo: 'Alerta Roja (Evacuación / Desastre)',
    color: '#DA291C',
    bgColor: 'rgba(218, 41, 28, 0.35)',
    borderColor: '#DA291C',
    textColor: '#FFFFFF',
    badgeText: 'ALERTA ROJA',
    protocolo: 'Evacuación obligatoria inmediata a refugios CNE habilitados. Máxima prioridad para el 9-1-1 y rescatistas.',
    zonas: 'Litoral Pacífico Sur y Cuencas Desbordadas'
  }
};

export default function CneAlertRibbon() {
  // Cintillo superior invasivo de 36px y botón Simular Alerta removidos según directriz de diseño sobrio
  return null;
}
