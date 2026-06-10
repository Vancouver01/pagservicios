import React from "react";

function AnalisisIA({ datosIa }) {

  const {
    tipo = "Sin clasificar",
    zona = "No identificada",
    urgencia = "BAJA",
    coincidencia = 0,
    recomendacion = "Sin recomendaciones"
  } = datosIa || {};

  return (

    <div className="card ia-analysis-card premium">

      <div className="card-header-ia">

        <div className="header-title-container">

          <span className="pulse-neon-dot"></span>

          <h3>
            Motor de Inferencia Semántica
          </h3>

        </div>

        <span className="badge-tecnologico">
          CAPA DE NEGOCIO
        </span>

      </div>

      <div className="ia-body">

        {/* ========================= */}
        {/* RIESGO */}
        {/* ========================= */}

        <div
          className={`urgency-banner-premium ${urgencia.toLowerCase()}`}
        >

          <div className="banner-glow"></div>

          <span className="label">
            NIVEL DE RIESGO DE SUCESO:
          </span>

          <strong className="value">
            {urgencia}
          </strong>

        </div>

        {/* ========================= */}
        {/* DATOS */}
        {/* ========================= */}

        <div className="data-extract-grid">

          <div className="data-box-premium">

            <span className="data-title">
              Clasificación de Delito
            </span>

            <p className="data-value">
              {tipo}
            </p>

          </div>

          <div className="data-box-premium">

            <span className="data-title">
              Distrito Focalizado
            </span>

            <p className="data-value">
              {zona}
            </p>

          </div>

          <div className="data-box-premium">

            <span className="data-title">
              Confianza de Coincidencia
            </span>

            <div className="progress-radial-container">

              <p className="data-value">
                {coincidencia}%
              </p>

              <div className="progress-bar-glow-bg">

                <div
                  className="progress-bar-glow-fill"
                  style={{
                    width: `${coincidencia}%`,
                    transition: "width 0.5s ease-out"
                  }}
                />

              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* RECOMENDACIÓN */}
        {/* ========================= */}

        <div className="recommendation-area-premium">

          <div className="rec-header">

            <span className="icon">
              📌
            </span>

            <h5>
              Directiva Operativa de Despacho Sugerida:
            </h5>

          </div>

          <p>
            {recomendacion}
          </p>

        </div>

      </div>
    </div>
  );
}

export default AnalisisIA;