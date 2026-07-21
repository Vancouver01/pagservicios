import React from "react";
import MapaCalor from "./MapaCalor";
import AnalisisIA from "./AnalisisIA";

function Dashboard({ datosIa, historial }) {
  const totalCasos = historial ? historial.length : 0;

  // =========================================================
  // ⚙️ LÓGICA DINÁMICA: Procesa CUALQUIER distrito de la BD
  // =========================================================
  const getEstadisticasDinamicas = () => {
    if (!historial || totalCasos === 0) return [];
    const conteo = {};
    historial.forEach(caso => {
      const dist = caso.distrito ? caso.distrito.trim() : "No Identificado";
      conteo[dist] = (conteo[dist] || 0) + 1;
    });
    return Object.keys(conteo).map(nombre => ({
      nombre,
      cantidad: conteo[nombre],
      porcentaje: Math.round((conteo[nombre] / totalCasos) * 100)
    })).sort((a, b) => b.cantidad - a.cantidad);
  };

  const distritosAnalizados = getEstadisticasDinamicas();

  return (
    <div className="dashboard-view">
      <header className="view-header">
        <div className="header-badge">SISTEMA INTEGRADO SIDPOL</div>
        <h1>🚨 Panel PNP: Centro de Despacho y Analítica Criminal</h1>
        <p>Consola de control orientada a erradicar la revictimización mediante procesamiento distribuido.</p>
      </header>

      {/* Grid de KPIs Superiores (Restaurado) */}
      <section className="metrics-grid">
        <div className="metric-card premium">
          <div className="metric-icon">🔥</div>
          <div>
            <h4>Zonas Calientes (Lima Hub)</h4>
            <h2>{distritosAnalizados.length} Críticas</h2>
            <span className="trend negative">Focalización activa</span>
          </div>
        </div>
        <div className="metric-card premium">
          <div className="metric-icon">🧠</div>
          <div>
            <h4>IA Entrenada Visual (NLP)</h4>
            <h2>94.2% Efic.</h2>
            <span className="trend stable">Modelo Redes Neuronales</span>
          </div>
        </div>
        <div className="metric-card premium">
          <div className="metric-icon">⏱️</div>
          <div>
            <h4>Reducción de Espera</h4>
            <h2>-85%</h2>
            <span className="trend positive">Trámite digital inmediato</span>
          </div>
        </div>
        <div className="metric-card premium">
          <div className="metric-icon">📋</div>
          <div>
            <h4>Expedientes en Cola</h4>
            <h2>{totalCasos} Activos</h2>
            <span className="trend stable">Sincronización síncrona</span>
          </div>
        </div>
      </section>

      {/* Layout Principal de Datos */}
      <div className="dashboard-content-layout">
        <div className="layout-left">
          <MapaCalor historial={historial} />
          
          <div className="card premium statistics-box-extra view-fade-in" style={{marginTop: "20px"}}>
            <h3>📊 Gráfico Analítico de Incidencias Mensuales</h3>
            <div className="mock-chart-container" style={{ display: "flex", gap: "10px", alignItems: "flex-end", height: "180px" }}>
              
              {/* Renderizado dinámico de distritos */}
              {distritosAnalizados.map((d, index) => (
                <div 
                  key={index}
                  className="chart-bar" 
                  style={{
                    height: `${d.porcentaje > 0 ? d.porcentaje : 5}%`, 
                    transition: "height 0.5s ease",
                    background: `linear-gradient(180deg, hsl(${index * 60 + 180}, 70%, 50%) 0%, #090d16 100%)`
                  }}
                >
                  <span className="bar-lbl" style={{ whiteSpace: "nowrap" }}>
                    {d.nombre} ({d.porcentaje}%)
                  </span>
                </div>
              ))}

            </div>
          </div>
        </div>
        
        <div className="layout-right">
          <AnalisisIA datosIa={datosIa} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;