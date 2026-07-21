import React from "react";
import ChatBotIA from "./ChatBotIA";

function NuevaDenuncia({ datosIa, onDenunciaCompletada }) {
  return (
    <div className="nueva-denuncia-container">
      <header className="view-header">
        <div className="header-badge cyan">MODULO DE ATENCIÓN VIRTUAL</div>
        <h1>📋 Módulo de Registro y Triaje Digital</h1>
        <p>Reducción del tiempo de espera de 2 horas en comisarías a una interacción conversacional guiada por IA.</p>
      </header>

      <div className="denuncia-workspace">
        {/* Panel Izquierdo: Formulario Dinámico */}
        <div className="form-panel-borrador premium">
          <div className="panel-sub-header">
            <h3>Borrador Digital Automatizado</h3>
            <span className="status-form-badge">Interoperable SIDPOL</span>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()} className="static-form-premium">
            <div className="form-group-premium">
              <label>Tipo de Delito Preclasificado</label>
              <input type="text" value={datosIa.tipo} readOnly placeholder="Esperando análisis de lenguaje natural..." />
            </div>

            <div className="form-group-premium">
              <label>Zona / Jurisdicción Georreferenciada</label>
              <input type="text" value={datosIa.zona} readOnly placeholder="Esperando coordenadas contextuales..." />
            </div>

            <div className={`form-group-premium risk-border ${datosIa.urgencia.toLowerCase()}`}>
              <label>Prioridad Asignada por Riesgo</label>
              <input type="text" value={datosIa.urgencia} readOnly className="urgencia-text-input" placeholder="Pendiente de calificación..." />
            </div>

            <div className="form-info-note-premium">
              <div className="info-icon">💡</div>
              <p>Este borrador se genera mediante análisis predictivo y evita que la víctima sea sometida a interrogatorios repetitivos y burocráticos.</p>
            </div>
          </form>
        </div>

        {/* Panel Derecho: ChatBot */}
        <div className="chat-panel-workspace">
          <ChatBotIA onDenunciaCompletada={onDenunciaCompletada} />
        </div>
      </div>
    </div>
  );
}

export default NuevaDenuncia;