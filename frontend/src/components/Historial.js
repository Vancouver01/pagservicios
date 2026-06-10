import React from "react";

function Historial() {

  const casos = [
    {
      codigo: "PNP-2026-00457",
      delito: "Robo agravado",
      fecha: "12/03/2026",
      estado: "En investigación"
    },
    {
      codigo: "PNP-2026-00112",
      delito: "Extorsión",
      fecha: "01/03/2026",
      estado: "Derivado a Fiscalía"
    },
    {
      codigo: "PNP-2025-88921",
      delito: "Violencia familiar",
      fecha: "20/12/2025",
      estado: "Resuelto"
    }
  ];

  return (

    <div>

      <h1 className="page-title">
        📜 Historial de Denuncias
      </h1>

      <div className="historial-grid">

        {casos.map((caso, index) => (

          <div className="historial-card" key={index}>

            <div className="historial-header">

              <h3>{caso.codigo}</h3>

              <span className="estado">
                {caso.estado}
              </span>

            </div>

            <p>
              <strong>Delito:</strong> {caso.delito}
            </p>

            <p>
              <strong>Fecha:</strong> {caso.fecha}
            </p>

            <button className="btn-ver">
              Ver expediente
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default Historial;