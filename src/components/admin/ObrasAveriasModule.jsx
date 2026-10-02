import React from 'react';
import IncidentTriageTable from './IncidentTriageTable';
import { PROVINCIAL_THEMES } from '../../config/provincialThemes';

export default function ObrasAveriasModule({ provincia = 'Puntarenas', provinciaTheme = null }) {
  // Resolver tema si no se pasó explícitamente
  const resolvedTheme = provinciaTheme || Object.values(PROVINCIAL_THEMES).find(
    (t) => t.nombre.toLowerCase() === String(provincia).toLowerCase()
  ) || PROVINCIAL_THEMES['6'];

  return <IncidentTriageTable provinciaTheme={resolvedTheme} />;
}
