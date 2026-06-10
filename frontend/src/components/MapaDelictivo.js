import React from "react";

function MapaDelictivo() {
  return (
    <div
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "20px",
        border: "1px solid #1e293b"
      }}
    >
      <h2>📍 Mapa Delictivo Inteligente</h2>

      <p style={{ color: "#94a3b8" }}>
        Visualización de zonas críticas detectadas por IA.
      </p>

      <div
        style={{
          height: "300px",
          borderRadius: "10px",
          marginTop: "15px",
          background:
            "linear-gradient(135deg, #1e3a8a, #0f172a)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px"
        }}
      >
        🗺️ MAPA INTERACTIVO
      </div>
    </div>
  );
}

export default MapaDelictivo;