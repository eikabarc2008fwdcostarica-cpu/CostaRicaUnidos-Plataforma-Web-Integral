import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Archive, RefreshCw, CheckCircle2 } from 'lucide-react';
import {
  getOfflineQueue,
  syncOfflineQueue,
  subscribeNetworkStatus
} from '../../services/offlineSyncService';
import { useTheme } from '../../context/ThemeContext';

export default function OfflineResilienceManager() {
  const { isDark } = useTheme?.() || { isDark: true };
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [offlineReports, setOfflineReports] = useState([]);
  const [syncStatusMsg, setSyncStatusMsg] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Suscripción al estado de red del navegador
    const unsubscribe = subscribeNetworkStatus((online) => {
      setIsOnline(online);
      if (online) {
        ejecutarSincronizacionAutomatica();
      }
    });

    // Cargar cola inicial
    setOfflineReports(getOfflineQueue());

    return () => unsubscribe();
  }, []);

  const ejecutarSincronizacionAutomatica = async () => {
    setIsSyncing(true);
    const res = await syncOfflineQueue((syncedItem) => {
      console.log('[PWA Sync] Reporte transmitido:', syncedItem.reportId);
    });
    setOfflineReports(getOfflineQueue());
    setIsSyncing(false);

    if (res.count > 0) {
      setSyncStatusMsg(`Se sincronizaron exitosamente ${res.count} reporte(s) con la central nacional.`);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    }
  };

  const handleManualSync = () => {
    ejecutarSincronizacionAutomatica();
  };

  const estadoReal = isSimulatedOffline ? false : isOnline;

  return (
    <div
      className="civic-glass-card"
      style={{
        padding: '1.5rem',
        borderRadius: '20px',
        marginBottom: '2.5rem',
        border: estadoReal
          ? (isDark ? '1px solid rgba(0, 209, 102, 0.3)' : '1px solid #10B981')
          : (isDark ? '1px solid #F59E0B' : '1px solid #D97706'),
        backgroundColor: estadoReal
          ? (isDark ? 'rgba(0, 15, 45, 0.65)' : 'var(--cru-surface-card, #FFFFFF)')
          : (isDark ? 'rgba(245, 158, 11, 0.08)' : '#FFFBEB'),
        boxShadow: isDark
          ? (estadoReal ? '0 8px 30px rgba(0, 4, 13, 0.5)' : '0 0 25px rgba(245, 158, 11, 0.3)')
          : '0 4px 16px rgba(0, 43, 127, 0.08)'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: estadoReal ? (isDark ? '#00D166' : '#05853B') : '#D97706',
            boxShadow: `0 0 12px ${estadoReal ? (isDark ? '#00D166' : '#05853B') : '#D97706'}`
          }} />

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#FFFFFF' : 'var(--cru-text, #0F172A)' }}>
              {estadoReal ? 'Modo Alta Conectividad PWA' : 'Modo Resiliencia Offline Activo'}
            </h4>
            <span style={{ fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B', fontFamily: 'var(--font-telemetry)' }}>
              SERVICE WORKER CACHE-FIRST &bull; SIN ERRORES ANTE DESCONEXIÓN
            </span>
          </div>
        </div>

        {/* Simulador de Desconexión para Pruebas Rápidas */}
        <button
          type="button"
          onClick={() => {
            setIsSimulatedOffline(!isSimulatedOffline);
            if (isSimulatedOffline) ejecutarSincronizacionAutomatica();
          }}
          className="btn-glass-secondary"
          style={{
            fontSize: '0.82rem',
            padding: '0.45rem 0.9rem',
            color: isSimulatedOffline ? (isDark ? '#00D166' : '#047857') : (isDark ? '#F59E0B' : '#B45309'),
            borderColor: isSimulatedOffline ? (isDark ? 'rgba(0, 209, 102, 0.4)' : '#A7F3D0') : (isDark ? 'rgba(245, 158, 11, 0.4)' : '#FDE68A'),
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          aria-label="Simular desconexión de red"
        >
          {isSimulatedOffline ? (
            <>
              <Wifi size={14} />
              <span>Restaurar Conexión Simulada</span>
            </>
          ) : (
            <>
              <WifiOff size={14} />
              <span>Simular Desconexión de Red</span>
            </>
          )}
        </button>
      </div>

      <p style={{ color: isDark ? '#CBD5E1' : 'var(--cru-text-muted, #475569)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        {estadoReal
          ? 'La aplicación mantiene sincronización activa en segundo plano. Todos los activos críticos (Botonera SOS, números de auxilio y refugios CNE) se encuentran precacheados localmente mediante la estrategia Cache-First.'
          : 'Se ha detectado una interrupción en la señal celular o Wi-Fi. La plataforma continúa funcionando con total autonomía: los números telefónicos, botones SOS y mapas de albergues permanecen disponibles al 100% sin pantalla de error.'}
      </p>

      {/* Cola de Reportes Pendientes de Sincronización */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        backgroundColor: isDark ? 'rgba(0, 4, 13, 0.8)' : 'var(--cru-surface-muted, #F8FAFC)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--cru-border, #CBD5E1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Archive size={16} color={isDark ? "#79a6ff" : "#002B7F"} />
          <span style={{ fontSize: '0.85rem', color: isDark ? '#E2E8F0' : '#0F172A' }}>
            Reportes en Cola Offline Local: <strong>{offlineReports.length}</strong>
          </span>
        </div>

        {offlineReports.length > 0 && (
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing || !estadoReal}
            className="btn-sovereign-blue"
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
            <span>{isSyncing ? 'Transmitiendo...' : 'Sincronizar Cola Ahora'}</span>
          </button>
        )}
      </div>

      {syncStatusMsg && (
        <div style={{
          marginTop: '0.85rem',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          backgroundColor: isDark ? 'rgba(0, 209, 102, 0.15)' : '#ECFDF5',
          border: isDark ? '1px solid #00D166' : '1px solid #10B981',
          color: isDark ? '#00D166' : '#047857',
          fontSize: '0.82rem'
        }}>
          {syncStatusMsg}
        </div>
      )}
    </div>
  );
}
