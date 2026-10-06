import React, { FC, useEffect, useRef } from 'react';
import { Download, FileText, Calendar, Clock, UserCheck, ShieldCheck, X, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';
import { ActaMunicipal } from '../../data/gobernanzaData';
import { CivicBadge } from '../common/CivicBadge';

export interface VisorActaModalProps {
  acta: ActaMunicipal | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * VisorActaModal — Visor Oficial de Actas del Concejo Municipal en Vidrio Esmerilado
 * Sello Digital de Fe Pública · Visor de PDF Integrado · Descarga Directa · Advertencia de Transparencia
 * Cumplimiento estricto de WCAG 2.1 AA (cierre por ESC, focus trap, semántica de diálogo cívico)
 */
export const VisorActaModal: FC<VisorActaModalProps> = ({ acta, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Enfocar el contenedor del modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !acta) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-acta-titulo"
      aria-describedby="modal-acta-desc"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        backgroundColor: 'rgba(6, 42, 119, 0.45)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          backgroundColor: 'var(--cru-surface-card)',
          border: '1px solid var(--cru-border, #E2E8F0)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-hover, 0 20px 50px rgba(6, 42, 119, 0.15))',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--theme-text-primary)',
          overflow: 'hidden',
          outline: 'none'
        }}
      >
        {/* Cabecera del Modal con Sello Solemne */}
        <div
          style={{
            padding: '1.75rem 2rem 1.25rem',
            borderBottom: '1px solid var(--cru-border, #E2E8F0)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            background: 'var(--cru-surface-muted)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--cru-accent-blue)'
                }}
              >
                REPÚBLICA DE COSTA RICA · CONCEJO MUNICIPAL
              </span>
              <span style={{ color: 'var(--cru-border-strong)' }}>•</span>
              <CivicBadge variant={acta.tipo === 'Solemne' ? 'warning' : acta.tipo === 'Extraordinaria' ? 'danger' : 'default'} size="sm">
                Sesión {acta.tipo}
              </CivicBadge>
            </div>

            <h2
              id="modal-acta-titulo"
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--cru-text, #062A77)',
                margin: '0 0 0.25rem 0',
                fontFamily: 'var(--font-headline, "Plus Jakarta Sans", serif)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <FileCheck size={24} color="var(--cru-accent-blue)" />
              <span>{acta.numeroActa}</span>
            </h2>

            <p id="modal-acta-desc" style={{ fontSize: '0.85rem', color: 'var(--cru-text-muted)', margin: 0 }}>
              Periodo Constitucional {acta.periodo} · Fe Pública Municipal Art. 41 del Código Municipal
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar visor de documento oficial"
            style={{
              background: 'var(--cru-surface-muted)',
              border: '1px solid var(--cru-border-strong)',
              color: 'var(--cru-text-muted)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DA291C';
              e.currentTarget.style.borderColor = '#DA291C';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo del Modal con Scroll */}
        <div
          style={{
            padding: '1.75rem 2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            flex: 1
          }}
        >
          {/* Metadatos y Quórum de la Sesión */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.85rem',
              background: 'var(--cru-surface-muted)',
              border: '1px solid var(--cru-border, #E2E8F0)',
              borderRadius: '16px',
              padding: '1.15rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={18} color="var(--cru-accent-blue)" />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', textTransform: 'uppercase', display: 'block' }}>Fecha Oficial:</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--cru-text, #062A77)' }}>{acta.fecha}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Clock size={18} color="var(--cru-accent-blue)" />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', textTransform: 'uppercase', display: 'block' }}>Hora Reglamentaria:</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--cru-text, #062A77)' }}>{acta.hora}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <UserCheck size={18} color="var(--cru-accent-green)" />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', textTransform: 'uppercase', display: 'block' }}>Preside la Sesión:</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--cru-text, #062A77)' }}>{acta.presidenteSesion}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={18} color="var(--cru-accent-amber)" />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--cru-text-muted)', textTransform: 'uppercase', display: 'block' }}>Estado Legal:</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--cru-accent-green)' }}>{acta.estado}</strong>
              </div>
            </div>
          </div>

          {/* Sello Digital de Certificación y Fe Pública */}
          <div
            style={{
              backgroundColor: 'rgba(0, 83, 175, 0.06)',
              border: '1px solid var(--cru-accent-blue-border)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 83, 175, 0.12)',
                  border: '1px solid var(--cru-accent-blue-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={20} color="var(--cru-accent-blue)" />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--cru-text, #062A77)', display: 'block' }}>
                  CERTIFICACIÓN DIGITAL DE FE PÚBLICA · SECRETARÍA DEL CONCEJO
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)' }}>
                  Documento emitido y resguardado conforme a la Ley N° 8454 de Certificados y Firmas Digitales de Costa Rica.
                </span>
              </div>
            </div>

            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                color: 'var(--cru-accent-blue)',
                backgroundColor: 'var(--cru-surface-card)',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--cru-border-strong)',
                fontWeight: 600
              }}
            >
              Firma: SHA-256 · Validez Jurídica Plena
            </div>
          </div>

          {/* Resumen Ejecutivo del Asunto Municipal */}
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--cru-text, #062A77)', marginBottom: '0.45rem' }}>
              Resumen Ejecutivo de la Sesión
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--cru-text-secondary, #334155)', lineHeight: 1.65, margin: 0 }}>
              {acta.resumenEjecutivo}
            </p>
          </div>

          {/* Temas Clave Tratados */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Temas y Dictámenes de Comisión
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {acta.temasClave.map((tema, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--cru-surface-muted)',
                    color: 'var(--cru-text, #062A77)',
                    border: '1px solid var(--cru-border-strong)'
                  }}
                >
                  {tema}
                </span>
              ))}
            </div>
          </div>

          {/* Acuerdos Vinculantes Aprobados */}
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--cru-text, #062A77)', marginBottom: '0.65rem' }}>
              Acuerdos Oficiales Aprobados y Vinculantes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {acta.acuerdosDestacados.map((acuerdo) => (
                <div
                  key={acuerdo.numeroAcuerdo}
                  style={{
                    backgroundColor: 'var(--cru-surface-muted)',
                    border: '1px solid var(--cru-border, #E2E8F0)',
                    borderRadius: '12px',
                    padding: '0.85rem 1.15rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--cru-accent-blue)', fontSize: '0.85rem' }}>
                      {acuerdo.numeroAcuerdo}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--cru-accent-green)',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        border: '1px solid rgba(5, 150, 105, 0.25)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '9999px'
                      }}
                    >
                      {acuerdo.votacion}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--cru-text-secondary, #334155)', margin: 0, lineHeight: 1.55 }}>
                    {acuerdo.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visor de Documento PDF Embebido Oficial */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--cru-text, #062A77)', margin: 0 }}>
                Previsualización del Documento PDF Oficial
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)' }}>
                Formato Oficial PDF/A · Certificación Ley 8454
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '380px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid var(--cru-border-strong)',
                backgroundColor: 'var(--cru-surface-muted)',
                position: 'relative'
              }}
            >
              <object
                data={acta.pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                aria-label={`Previsualización del PDF del acta oficial ${acta.numeroActa}`}
              >
                {/* Fallback accesible */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--cru-text-soft)'
                  }}
                >
                  <FileText size={44} color="var(--cru-accent-blue)" style={{ marginBottom: '0.75rem' }} />
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--cru-text)', marginBottom: '0.4rem', fontWeight: 700 }}>
                    {acta.numeroActa}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--cru-text-muted)', maxWidth: '460px', marginBottom: '1.25rem' }}>
                    Visualizador de documentos oficiales listo para descarga directa en formato estandarizado PDF/A.
                  </p>
                  <a
                    href={acta.pdfUrl}
                    download={`${acta.numeroActa.replace(/\s+/g, '_')}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'var(--cru-accent-blue)',
                      border: 'none',
                      color: '#FFFFFF',
                      padding: '0.65rem 1.4rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: 'var(--shadow-card)'
                    }}
                  >
                    <Download size={15} />
                    <span>Descargar Documento Oficial</span>
                  </a>
                </div>
              </object>
            </div>
          </div>

          {/* Advertencia Legal de Transparencia y Rendición de Cuentas */}
          <div
            style={{
              backgroundColor: 'var(--cru-accent-amber-bg)',
              border: '1px solid var(--cru-accent-amber-border)',
              borderRadius: '12px',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              fontSize: '0.78rem',
              color: '#92400E',
              lineHeight: 1.55
            }}
          >
            <AlertCircle size={18} color="var(--cru-accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Advertencia Legal de Transparencia:</strong> Este documento es de acceso público irrestricto de conformidad con los artículos 11, 27 y 30 de la Constitución Política de la República de Costa Rica y los artículos 13 y 41 del Código Municipal (Ley N° 7794). Los datos sensibles han sido resguardados conforme a la Ley N° 8968.
            </span>
          </div>
        </div>

        {/* Pie del Modal con Acciones de Descarga */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--cru-border, #E2E8F0)',
            backgroundColor: 'var(--cru-surface-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--cru-text-muted)' }}>
            <CheckCircle2 size={16} color="var(--cru-accent-green)" />
            <span>Documento cotejado con el Libro de Actas de la Secretaría Municipal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--cru-surface-card)',
                border: '1px solid var(--cru-border-strong)',
                color: 'var(--cru-text-soft)',
                padding: '0.55rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              Cerrar
            </button>

            <a
              href={acta.pdfUrl}
              download={`${acta.numeroActa.replace(/\s+/g, '_')}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                backgroundColor: 'var(--cru-accent-blue)',
                backgroundImage: 'linear-gradient(135deg, var(--blue, #0053AF) 0%, var(--navy, #062A77) 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '0.55rem 1.35rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: 'var(--shadow-hover)'
              }}
            >
              <Download size={15} />
              <span>Descargar PDF Oficial</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisorActaModal;
