import React, { useState } from 'react';
import { Mail, Send, CheckCircle, FileText, Upload, AlertCircle, Building2, User } from 'lucide-react';
import { SolicitudAudienciaConcejo } from '../../data/participacionData';
import { validateCedula, sanitizeCedula } from '../../services/haciendaService';
import { CivicModal } from '../common/CivicModal';
import { CivicButton } from '../common/CivicButton';

interface BuzonAudienciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolicitudEnviada?: (solicitud: SolicitudAudienciaConcejo) => void;
}

/**
 * BuzonAudienciaModal — Módulo 11: Participación Ciudadana
 * Permite a cualquier ciudadano o colectivo vecinal radicar una solicitud
 * formal de audiencia ante el Concejo Municipal con validación de identidad.
 */
export const BuzonAudienciaModal: React.FC<BuzonAudienciaModalProps> = ({
  isOpen,
  onClose,
  onSolicitudEnviada
}) => {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [validandoHacienda, setValidandoHacienda] = useState(false);
  const [distrito, setDistrito] = useState('Carmen');
  const [tipoAsunto, setTipoAsunto] = useState<'Obra Pública' | 'Seguridad Comunal' | 'Patentes y Comercio' | 'Medio Ambiente'>('Obra Pública');
  const [motivo, setMotivo] = useState('');
  const [archivosCount, setArchivosCount] = useState(1);
  const [enviadoExitosamente, setEnviadoExitosamente] = useState(false);
  const [radicadoId, setRadicadoId] = useState('');

  const resetForm = () => {
    setCedula('');
    setNombre('');
    setMotivo('');
    setEnviadoExitosamente(false);
    setRadicadoId('');
  };

  const handleCerrar = () => {
    resetForm();
    onClose();
  };

  const handleAutoValidarCedula = async () => {
    const limpia = sanitizeCedula(cedula);
    if (!limpia || limpia.length < 9) return;

    setValidandoHacienda(true);
    try {
      const res = await validateCedula(limpia);
      if (res.isValid && res.nombreOficial) {
        setNombre(res.nombreOficial);
      }
    } catch {
      // Ignorar error y permitir ingreso si estuviera offline
    } finally {
      setValidandoHacienda(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedula || !nombre || !motivo) return;

    const idGenerado = `AUD-CONCEJO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevaSolicitud: SolicitudAudienciaConcejo = {
      id: idGenerado,
      cedulaCiudadano: cedula,
      nombreCompleto: nombre,
      distrito,
      motivoAudiencia: motivo,
      tipoAsunto,
      documentosAdjuntosCount: archivosCount,
      fechaSolicitud: new Date().toLocaleDateString('es-CR'),
      estado: 'Pendiente de Revisión'
    };

    setRadicadoId(idGenerado);
    setEnviadoExitosamente(true);

    if (onSolicitudEnviada) {
      onSolicitudEnviada(nuevaSolicitud);
    }
  };

  return (
    <CivicModal
      isOpen={isOpen}
      onClose={handleCerrar}
      title={
        <div className="flex items-center gap-2 text-[#062A77] font-bold">
          <Mail size={22} className="text-[#0053AF]" />
          <span>Buzón de Audiencias del Concejo Municipal</span>
        </div>
      }
      description="Canal formal de audiencia pública según el Código Municipal de Costa Rica"
      size="lg"
    >
      {enviadoExitosamente ? (
        <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400">
            <CheckCircle size={36} />
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">
              ¡Solicitud Radicada con Éxito!
            </h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Su petición de audiencia fue remitida a la Secretaría del Concejo Municipal para su inclusión en el orden del día.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-left font-mono text-xs space-y-1.5 max-w-md mx-auto">
            <div className="text-slate-400">NÚMERO DE EXPEDIENTE MUNICIPAL:</div>
            <div className="text-cyan-300 font-bold text-base">{radicadoId}</div>
            <div className="text-slate-400 pt-1">
              Titular: {nombre} ({cedula}) • Distrito: {distrito}
            </div>
            <div className="text-amber-300 text-[11px] pt-1">
              Plazo de respuesta administrativa: 10 días hábiles (Ley N° 9097).
            </div>
          </div>

          <div className="pt-2 max-w-xs mx-auto">
            <CivicButton variant="primary" fullWidth onClick={handleCerrar}>
              Aceptar y Cerrar
            </CivicButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cédula con Validación */}
            <div className="space-y-1.5">
              <label htmlFor="aud-cedula" className="block text-xs font-semibold text-slate-200">
                Cédula del Solicitante:
              </label>
              <div className="flex gap-2">
                <input
                  id="aud-cedula"
                  type="text"
                  required
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  onBlur={handleAutoValidarCedula}
                  placeholder="Ej: 1-0111-0222"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleAutoValidarCedula}
                  disabled={validandoHacienda}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-cyan-300 hover:bg-white/10"
                >
                  {validandoHacienda ? '...' : 'Validar'}
                </button>
              </div>
            </div>

            {/* Nombre Completo */}
            <div className="space-y-1.5">
              <label htmlFor="aud-nombre" className="block text-xs font-semibold text-slate-200">
                Nombre Completo (Legal):
              </label>
              <input
                id="aud-nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre y Apellidos"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Distrito */}
            <div className="space-y-1.5">
              <label htmlFor="aud-distrito" className="block text-xs font-semibold text-slate-200">
                Distrito de Representación:
              </label>
              <select
                id="aud-distrito"
                value={distrito}
                onChange={(e) => setDistrito(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value="Carmen">Carmen</option>
                <option value="Merced">Merced</option>
                <option value="Hospital">Hospital</option>
                <option value="Catedral">Catedral</option>
                <option value="Zapote">Zapote</option>
                <option value="San Francisco de Dos Ríos">San Francisco de Dos Ríos</option>
                <option value="Uruca">Uruca</option>
                <option value="Mata Redonda">Mata Redonda</option>
                <option value="Pavas">Pavas</option>
                <option value="Hatillo">Hatillo</option>
                <option value="San Sebastián">San Sebastián</option>
              </select>
            </div>

            {/* Tipo de Asunto */}
            <div className="space-y-1.5">
              <label htmlFor="aud-tipo" className="block text-xs font-semibold text-slate-200">
                Tipo de Asunto Municipal:
              </label>
              <select
                id="aud-tipo"
                value={tipoAsunto}
                onChange={(e) => setTipoAsunto(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value="Obra Pública">Obra Pública & Aceras</option>
                <option value="Seguridad Comunal">Seguridad Comunal y Policía</option>
                <option value="Patentes y Comercio">Patentes y Comercio</option>
                <option value="Medio Ambiente">Medio Ambiente y Parques</option>
              </select>
            </div>
          </div>

          {/* Motivo de la Audiencia */}
          <div className="space-y-1.5">
            <label htmlFor="aud-motivo" className="block text-xs font-semibold text-slate-200">
              Exposición de Motivos y Puntos a Tratar:
            </label>
            <textarea
              id="aud-motivo"
              required
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describa con claridad la problemática comunal o propuesta para los regidores del Concejo Municipal..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          {/* Documentación de Apoyo */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Upload size={16} className="text-cyan-400" />
              <span>Adjuntar firmas comunales / cartas de apoyo (PDF):</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-300">{archivosCount} archivo(s) listo(s)</span>
              <button
                type="button"
                onClick={() => setArchivosCount((c) => c + 1)}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-slate-200"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* Botones de Envío */}
          <div className="pt-2 flex justify-end gap-2">
            <CivicButton type="button" variant="ghost" size="sm" onClick={handleCerrar}>
              Cancelar
            </CivicButton>
            <CivicButton type="submit" variant="primary" size="sm" leftIcon={<Send size={14} />}>
              Radicar Solicitud Oficial
            </CivicButton>
          </div>
        </form>
      )}
    </CivicModal>
  );
};
