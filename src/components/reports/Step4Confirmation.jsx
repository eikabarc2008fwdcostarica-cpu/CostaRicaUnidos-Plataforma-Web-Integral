import React from 'react';
import { Building2, Camera, Send, Loader2, AlertTriangle, Check } from 'lucide-react';
import { TIPOLOGIAS_DANO } from './Step1DamageType';
import { getEntidadResponsable } from './ticketService';

export default function Step4Confirmation({
  reportData,
  onObservacionesChange,
  onSubmitReport,
  isSubmitting = false
}) {
  const {
    selectedType,
    photoData,
    coordenadas,
    provinciaNombre,
    cantonNombre,
    distritoNombre,
    observaciones
  } = reportData;

  const tipologiaObj = TIPOLOGIAS_DANO.find((t) => t.id === selectedType) || TIPOLOGIAS_DANO[0];
  const entidadAsignada = getEntidadResponsable(selectedType);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <span
          className="telemetry-badge"
          style={{
            backgroundColor: 'var(--cru-accent-blue-bg)',
            color: 'var(--cru-accent-blue)',
            border: '1px solid var(--cru-accent-blue-border)',
            fontWeight: 700
          }}
        >
          PASO 4 DE 4 &bull; DESCRIPCIÓN Y CONFIRMACIÓN
        </span>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--cru-text)',
          marginTop: '0.6rem',
          marginBottom: '0.35rem'
        }}>
          Revisión General y Emisión del Ticket Cívico
        </h3>
        <p style={{ color: 'var(--cru-text-soft)', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto', fontWeight: 500 }}>
          Verifique el resumen de los datos recopilados antes de emitir el reporte oficial. Se asignará un código único estandarizado con trazabilidad pública.
        </p>
      </div>

      {/* Resumen de Datos en Tarjetas Cívicas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        {/* 1. Tipología y Entidad */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '16px',
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1.5px solid rgba(6, 42, 119, 0.14)',
          boxShadow: '0 4px 12px rgba(6, 42, 119, 0.04)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Tipología & Entidad Competente
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--cru-accent-blue-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {typeof tipologiaObj.icono === 'function'
                ? React.createElement(tipologiaObj.icono, { size: 24, color: 'var(--cru-accent-blue)' })
                : <Building2 size={24} color="var(--cru-accent-blue)" />}
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cru-text)', lineHeight: 1.2 }}>
                {tipologiaObj.titulo}
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--cru-accent-green)', fontWeight: 600 }}>
                Plazo: {tipologiaObj.plazoEstimado}
              </span>
            </div>
          </div>
          <div style={{
            fontSize: '0.78rem',
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            backgroundColor: 'var(--cru-accent-blue-bg)',
            border: '1px solid var(--cru-accent-blue-border)',
            color: 'var(--cru-accent-blue)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Building2 size={13} />
            <span>Asignado a: {entidadAsignada}</span>
          </div>
        </div>

        {/* 2. Ubicación Territorial Oficial */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '16px',
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1.5px solid rgba(6, 42, 119, 0.14)',
          boxShadow: '0 4px 12px rgba(6, 42, 119, 0.04)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Ubicación Territorial Oficial
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--cru-text)' }}>
              {provinciaNombre || 'San José'} › {cantonNombre || 'Cantón Central'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--cru-accent-blue)', fontWeight: 600 }}>
              Distrito: {distritoNombre || 'Cabecera'}
            </div>
          </div>
          <div style={{
            fontSize: '0.78rem',
            fontFamily: 'var(--font-telemetry)',
            color: 'var(--cru-text-soft)',
            backgroundColor: 'var(--cru-surface-muted)',
            border: '1px solid var(--cru-border)',
            fontWeight: 600,
            padding: '0.4rem 0.6rem',
            borderRadius: '6px'
          }}>
            GPS: {coordenadas.lat.toFixed(5)}° N, {coordenadas.lng.toFixed(5)}° W
          </div>
        </div>

        {/* 3. Evidencia Fotográfica y Normativa */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '16px',
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1.5px solid rgba(6, 42, 119, 0.14)',
          boxShadow: '0 4px 12px rgba(6, 42, 119, 0.04)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Evidencia Multimedia Comprimida
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {photoData ? (
              <img
                src={photoData.dataUrl}
                alt="Miniatura evidencia"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '1.5px solid #CBD5E1'
                }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '10px',
                backgroundColor: 'var(--cru-surface-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Camera size={26} color="var(--cru-text-muted)" />
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--cru-text)' }}>
                {photoData ? `Peso: ${photoData.compressedSizeFormatted}` : 'Foto procesada'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--cru-accent-green)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Check size={14} strokeWidth={2.5} />
                <span>Ley N° 8968 Verificada</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cru-text-muted)', fontFamily: 'var(--font-telemetry)', fontWeight: 600 }}>
                {photoData ? photoData.dimensiones : '1920x1080'} &bull; WebP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campo de Observaciones Breves y Dirección Exacta */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          backgroundColor: 'var(--cru-surface-muted)',
          border: '1.5px solid rgba(6, 42, 119, 0.14)',
          boxShadow: '0 4px 16px rgba(6, 42, 119, 0.04)'
        }}
      >
        <label
          htmlFor="reporte-observaciones"
          style={{
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: 800,
            color: 'var(--cru-text)',
            marginBottom: '0.4rem'
          }}
        >
          Dirección Exacta y Puntos de Referencia de la Incidencia *
        </label>
        <p style={{ color: 'var(--cru-text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 500 }}>
          Describa señas particulares para la cuadrilla técnica (ej: frente al abastecedor, poste número, color de casa, etc.).
        </p>

        <textarea
          id="reporte-observaciones"
          value={observaciones}
          onChange={(e) => onObservacionesChange(e.target.value)}
          placeholder="Ejemplo: Frente a la soda Doña María, 100 metros al este del puente peatonal. El hueco está en el carril derecho con riesgo para motociclistas..."
          rows={4}
          maxLength={400}
          style={{
            width: '100%',
            backgroundColor: 'var(--cru-surface-card)',
            border: '1.5px solid #CBD5E1',
            borderRadius: '12px',
            color: 'var(--theme-text-primary)',
            padding: '1rem',
            fontFamily: 'var(--font-main)',
            fontSize: '0.92rem',
            outline: 'none',
            resize: 'vertical'
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--cru-text-muted)',
          fontWeight: 600
        }}>
          <span>Mínimo 15 caracteres para orientar a la cuadrilla</span>
          <span>{observaciones.length} / 400 caracteres</span>
        </div>
      </div>

      {/* Botón Soberano de Envío */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={onSubmitReport}
          disabled={isSubmitting || observaciones.trim().length < 10}
          className="btn-sovereign"
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.05rem',
            fontWeight: 800,
            backgroundColor: '#C22727',
            color: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(194, 39, 39, 0.45)',
            cursor: isSubmitting || observaciones.trim().length < 10 ? 'not-allowed' : 'pointer',
            opacity: isSubmitting || observaciones.trim().length < 10 ? 0.5 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generando Ticket y Notificando...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Emitir Reporte y Generar Ticket Soberano</span>
            </>
          )}
        </button>

        {observaciones.trim().length < 10 && (
          <p style={{ color: 'var(--cru-accent-amber)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
            <AlertTriangle size={15} color="var(--cru-accent-amber)" />
            <span>Ingrese una dirección exacta o descripción mínima antes de continuar.</span>
          </p>
        )}
      </div>
    </div>
  );
}
