import React, { FC } from 'react';
import { Download, FileText, Calendar, Clock, UserCheck, ShieldCheck } from 'lucide-react';
import { ActaMunicipal } from '../../data/gobernanzaData';
import { CivicModal } from '../common/CivicModal';
import { CivicButton } from '../common/CivicButton';
import { CivicBadge } from '../common/CivicBadge';

export interface VisorActaModalProps {
  acta: ActaMunicipal | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * VisorActaModal — Modal con Visor de Documentos Oficiales en PDF (Módulo 02)
 * 
 * Cumplimiento:
 * - WCAG 2.1 AA (accesible para lectores de pantalla, focus trap, cierre con ESC).
 * - Visor embebido de PDF con fallback accesible.
 * - Botón de descarga directa del documento oficial con firma digital.
 */
export const VisorActaModal: FC<VisorActaModalProps> = ({ acta, isOpen, onClose }) => {
  if (!acta) return null;

  return (
    <CivicModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <FileText size={22} color="#7DD3FC" />
          <span>{acta.numeroActa}</span>
          <CivicBadge variant="provincial" size="sm">
            {acta.tipo}
          </CivicBadge>
        </div>
      }
      description={`Sesión del Concejo Municipal • Periodo ${acta.periodo}`}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#94A3B8' }}>
            <ShieldCheck size={16} color="#10B981" />
            <span>Documento Oficial Certificado con Validez Jurídica</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <CivicButton variant="secondary" size="sm" onClick={onClose}>
              Cerrar
            </CivicButton>
            <a
              href={acta.pdfUrl}
              download={`${acta.numeroActa.replace(/\s+/g, '_')}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <CivicButton variant="primary" size="sm" leftIcon={<Download size={15} />}>
                Descargar PDF Oficial
              </CivicButton>
            </a>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Metadatos Rápidos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Calendar size={16} color="#94A3B8" />
            <span style={{ color: '#94A3B8' }}>Fecha:</span>
            <strong style={{ color: '#FFFFFF', fontFamily: "var(--font-telemetry, monospace)" }}>
              {acta.fecha}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Clock size={16} color="#94A3B8" />
            <span style={{ color: '#94A3B8' }}>Hora:</span>
            <strong style={{ color: '#FFFFFF', fontFamily: "var(--font-telemetry, monospace)" }}>
              {acta.hora}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <UserCheck size={16} color="#94A3B8" />
            <span style={{ color: '#94A3B8' }}>Preside:</span>
            <span style={{ color: '#E2E8F0' }}>{acta.presidenteSesion}</span>
          </div>
        </div>

        {/* Resumen Ejecutivo */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.4rem' }}>
            Resumen de la Sesión
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
            {acta.resumenEjecutivo}
          </p>
        </div>

        {/* Temas Clave */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>Temas:</span>
          {acta.temasClave.map((tema) => (
            <CivicBadge key={tema} variant="default" size="sm">
              {tema}
            </CivicBadge>
          ))}
        </div>

        {/* Acuerdos Tomados */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.6rem' }}>
            Acuerdos Destacados del Concejo Municipal
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {acta.acuerdosDestacados.map((acuerdo) => (
              <div
                key={acuerdo.numeroAcuerdo}
                style={{
                  background: 'rgba(0, 43, 127, 0.12)',
                  border: '1px solid rgba(0, 43, 127, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: "var(--font-telemetry, monospace)", fontSize: '0.8rem', fontWeight: 700, color: '#7DD3FC' }}>
                    {acuerdo.numeroAcuerdo}
                  </span>
                  <CivicBadge variant="success" size="sm">
                    {acuerdo.votacion}
                  </CivicBadge>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#E2E8F0', margin: 0 }}>
                  {acuerdo.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Visor PDF Embebido Oficial */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
              Visor del Documento Original
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Formato PDF/A • Certificado Digital
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '380px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0, 4, 13, 0.95)',
              position: 'relative'
            }}
          >
            <object
              data={acta.pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              aria-label={`Visor del documento PDF oficial ${acta.numeroActa}`}
            >
              {/* Fallback si el navegador no soporta PDF embebido */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#CBD5E1'
                }}
              >
                <FileText size={48} color="#7DD3FC" style={{ marginBottom: '1rem' }} />
                <h5 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {acta.numeroActa}
                </h5>
                <p style={{ fontSize: '0.875rem', maxWidth: '450px', marginBottom: '1.25rem', color: '#94A3B8' }}>
                  Su navegador no admite la previsualización directa de archivos PDF en este visor. Puede descargar el documento oficial íntegro a continuación.
                </p>
                <a
                  href={acta.pdfUrl}
                  download={`${acta.numeroActa.replace(/\s+/g, '_')}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <CivicButton variant="primary" leftIcon={<Download size={16} />}>
                    Descargar Documento Oficial PDF
                  </CivicButton>
                </a>
              </div>
            </object>
          </div>
        </div>
      </div>
    </CivicModal>
  );
};

export default VisorActaModal;
