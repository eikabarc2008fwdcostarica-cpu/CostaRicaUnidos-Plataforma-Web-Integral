import React, { useState, useEffect } from "react";

export default function CNEGlobalMarqueeAlert() {
  const [alerta, setAlerta] = useState(() => {
    try {
      const cache = localStorage.getItem("cru_alerta_cne_cache");
      return cache ? JSON.parse(cache) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // 1. Cargar alerta activa desde json-server
    const cargarAlerta = async () => {
      try {
        const res = await fetch("http://localhost:3001/alertaCNE");
        if (res.ok) {
          const data = await res.json();
          if (data && data.activa && data.mensaje) {
            setAlerta(data);
            try {
              localStorage.setItem("cru_alerta_cne_cache", JSON.stringify(data));
            } catch {
              // ignore
            }
          } else {
            setAlerta(null);
            try {
              localStorage.removeItem("cru_alerta_cne_cache");
            } catch {
              // ignore
            }
          }
        }
      } catch (e) {
        console.warn("json-server no disponible para alertas");
      }
    };

    cargarAlerta();

    // 2. Escuchar actualizaciones en tiempo real
    const handleUpdate = (e) => {
      const nuevaAlerta = e.detail;
      if (!nuevaAlerta || !nuevaAlerta.activa || !nuevaAlerta.mensaje) {
        setAlerta(null); // Desmonta la marquesina de inmediato
        try {
          localStorage.removeItem("cru_alerta_cne_cache");
        } catch {
          // ignore
        }
      } else {
        setAlerta(nuevaAlerta);
      }
    };
    window.addEventListener("cru_alerta_cne_actualizada", handleUpdate);
    return () => window.removeEventListener("cru_alerta_cne_actualizada", handleUpdate);
  }, []);

  if (!alerta || !alerta.activa || !alerta.mensaje) return null;

  // Configuración de colores oficiales según nivel CNE
  const estilosPorNivel = {
    verde: { border: "#10B981", bg: "rgba(16, 185, 129, 0.15)", text: "#6EE7B7", badge: "#10B981" },
    amarilla: { border: "#F59E0B", bg: "rgba(245, 158, 11, 0.18)", text: "#FDE68A", badge: "#F59E0B" },
    naranja: { border: "#EA580C", bg: "rgba(234, 88, 12, 0.20)", text: "#FED7AA", badge: "#EA580C" },
    roja: { border: "#EF4444", bg: "rgba(239, 68, 68, 0.25)", text: "#FCA5A5", badge: "#EF4444" }
  };

  const conf = estilosPorNivel[alerta.nivel] || estilosPorNivel.amarilla;

  return (
    <div 
      className="cne-marquee-wrapper"
      style={{
        width: "100%",
        height: "38px",
        minHeight: "38px",
        maxHeight: "38px",
        flexShrink: 0,
        overflow: "hidden",
        backgroundColor: conf.bg,
        borderTop: `1px solid ${conf.border}`,
        borderBottom: `1px solid ${conf.border}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 50,
        margin: 0
      }}
    >
      {/* Badge del Nivel de Alerta a la Izquierda (Nivel Roja, Amarilla, etc.) */}
      <div 
        className="cne-marquee-badge-fixed"
        style={{
          height: "100%",
          minHeight: "38px",
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 16px",
          backgroundColor: "rgba(5, 12, 28, 0.95)",
          borderRight: `1px solid ${conf.border}`,
          zIndex: 2,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: conf.badge,
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
          boxSizing: "border-box"
        }}
      >
        {/* Icono SVG Megáfono / Alerta */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <span>{alerta.tituloNivel}</span>
      </div>

      {/* Pista del Texto Desplazable */}
      <div className="cne-marquee-track">
        <div className="cne-marquee-text" style={{ color: conf.text }}>
          COMUNICADO OFICIAL PRESIDENCIA & CNE: {alerta.mensaje} — [EMISIÓN OFICIAL CNE: REPÚBLICA DE COSTA RICA]
        </div>
      </div>
    </div>
  );
}
