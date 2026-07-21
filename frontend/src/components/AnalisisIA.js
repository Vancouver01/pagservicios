import React from "react";

function AnalisisIA({ datosIa }) {
  if (!datosIa) {
    return (
      <div className="card ia-analysis-card premium">
        <div className="ia-body" style={{ padding: "20px", textAlign: "center", color: "#888" }}>
          Seleccione un expediente de la central para inicializar la inferencia semántica.
        </div>
      </div>
    );
  }

  // 🧠 SOPORTE HÍBRIDO POLIMÓRFICO: Evaluamos tanto las claves de la base de datos como las del chatbot
  const tipo = datosIa.delito_clasificado || datosIa.delito || datosIa.tipo || "No tipificado";
  const zona = datosIa.distrito || datosIa.zona || "No especificado";
  const urgencia = datosIa.urgencia || "BAJA";
  const coincidencia = datosIa.coincidencia !== undefined ? datosIa.coincidencia : 0;
  const recomendacion = datosIa.recomendacion || "Central de despacho en espera de asignación técnica.";

  return (
    <div className="card ia-analysis-card premium">
      <div className="card-header-ia">
        <div className="header-title-container">
          <span className="pulse-neon-dot"></span>
          <h3>Motor de Inferencia Semántica</h3>
        </div>
        <span className="badge-tecnologico">CAPA DE NEGOCIO</span>
      </div>
      
      <div className="ia-body">
        {/* Banner de Urgencia */}
        <div className={`urgency-banner-premium ${urgencia.toLowerCase()}`}>
          <div className="banner-glow"></div>
          <span className="label">NIVEL DE RIESGO DE SUCESO:</span>
          <strong className="value">{urgencia}</strong>
        </div>

        {/* Desglose de Datos */}
        <div className="data-extract-grid">
          <div className="data-box-premium">
            <span className="data-title">Clasificación de Delito</span>
            <p className="data-value">{tipo}</p>
          </div>
          
          <div className="data-box-premium">
            <span className="data-title">Distrito Focalizado</span>
            <p className="data-value" style={{ textTransform: "uppercase" }}>{zona}</p>
          </div>

          <div className="data-box-premium">
            <span className="data-title">Confianza de Coincidencia</span>
            <div className="progress-radial-container">
              <p className="data-value">{coincidencia}%</p>
              <div className="progress-bar-glow-bg">
                <div 
                  className="progress-bar-glow-fill"
                  style={{ width: `${coincidencia}%`, transition: "width 0.5s ease-out" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recomendación Automatizada */}
        <div className="recommendation-area-premium">
          <div className="rec-header">
            <span className="icon">📌</span>
            <h5>Directiva Operativa de Despacho Sugerida:</h5>
          </div>
          <p>{recomendacion}</p> 
        </div>
      </div>
    </div>
  );
}

export default AnalisisIA;