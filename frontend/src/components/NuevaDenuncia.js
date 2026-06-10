import React from "react";
import ChatBotIA from "./ChatBotIA";

function NuevaDenuncia({ datosIa, onDenunciaCompletada }) {
  const fechaActual = new Date().toLocaleDateString('es-PE', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="view-wrapper view-fade-in">
      <div className="view-header">
        <span className="header-badge">MÓDULO DE ATENCIÓN DE EMERGENCIAS</span>
        <h1>Portal Digital de Denuncias Asistidas</h1>
        <p>📅 Conexión establecida para el día: {fechaActual}</p>
      </div>

      {/* Usamos tu Grid nativo original de 2 columnas (.denuncia-workspace) */}
      <div className="denuncia-workspace">
        
        {/* Columna Izquierda: El Chatbot de WhatsApp */}
        <div className="card premium">
          <div className="panel-sub-header">
            <h3>💬 Asistente IA Semántico</h3>
            <span className="status-form-badge">CANAL SEGURO TLS 1.3</span>
          </div>
          <div style={{ background: "#0b0f19", borderRadius: "12px", padding: "10px" }}>
            <ChatBotIA onDenunciaCompletada={onDenunciaCompletada} />
          </div>
        </div>

        {/* Columna Derecha: Panel de Control del Ciudadano */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Ficha del Usuario Autenticado */}
          <div className="card premium" style={{ background: "rgba(15, 23, 42, 0.4)" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--neon-cyan)" }}>👤 Información de Firma Digital</h4>
            <p style={{ margin: "4px 0", fontSize: "13px" }}><strong>Usuario:</strong> JEAN POOL JARAMILLO QUISPE</p>
            <p style={{ margin: "4px 0", fontSize: "13px" }}><strong>Origen de Validación:</strong> INTEROPERABILIDAD RENIEC</p>
            <p style={{ margin: "4px 0", fontSize: "13px", fontFamily: "monospace", color: "var(--text-muted)" }}>Token: RENIEC-SYNC-2026-OK</p>
          </div>

          {/* Central de Monitoreo */}
          <div className="card premium">
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>🚨 Números de Emergencia Nacional</h4>
            <div className="emergency-grid-layout">
              <div className="em-card red">👮‍♂️ Central PNP: 105</div>
              <div className="em-card yellow">🚑 SAMU: 106</div>
            </div>
          </div>

          {/* Guías Rápidas */}
          <div className="citizen-info-box">
            <h4>💡 Guía de Redacción del Suceso</h4>
            <p>Describe el hecho con lenguaje natural en el chat. Indica detalles clave como el <strong>distrito</strong> (ej. Los Olivos, Miraflores), calles principales y si viste armas u objetos de peligro.</p>
          </div>

          <div className="citizen-info-box">
            <h4>⚖️ Marco Legal Vigente</h4>
            <p>Los datos procesados por este núcleo de inteligencia artificial se registran automáticamente en el repositorio relacional de la PNP y tienen carácter de <strong>Declaración Jurada</strong> (Art. 438 Código Penal).</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default NuevaDenuncia;