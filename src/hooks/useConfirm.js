/**
 * ============================================================================
 * COSTA RICA UNIDOS — HOOK USECONFIRM (SOVEREIGN CIVIC CONFIRMATION)
 * Promesa asíncrona para diálogos de confirmación sin romper la estética
 * ============================================================================
 * 
 * Uso:
 *   import { useConfirm } from '../hooks/useConfirm';
 *   // o import useConfirm from '../hooks/useConfirm';
 * 
 *   const confirm = useConfirm();
 *   const ok = await confirm({
 *     title: 'Eliminar publicación',
 *     message: '¿Está seguro de eliminar esta publicación del Foro Tico? Esta acción no se puede deshacer.',
 *     confirmText: 'Sí, eliminar',
 *     cancelText: 'Cancelar',
 *     variant: 'danger' // 'danger' | 'warning' | 'info' | 'success'
 *   });
 *   if (!ok) return;
 */

import { useConfirm as useConfirmFromContext } from '../context/CivicModalContext';

export function useConfirm() {
  return useConfirmFromContext();
}

export default useConfirm;
