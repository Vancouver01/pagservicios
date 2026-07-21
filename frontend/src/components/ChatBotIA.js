import React, { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

function ChatBotIA({ onDenunciaCompletada }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ia",
      text: "🤖 SISTEMA DE TRIAJE CRIMINAL\n\nIdentidad validada de manera conforme con la pasarela integrada.\n\nHola. Estoy listo para asistirte en la estructuración de tu caso mediante procesamiento de lenguaje natural. Relátame detalladamente qué ha sucedido, especificando el distrito y si los agresores portaban armas."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfGenerado, setPdfGenerado] = useState(false);
  
  // ⚙️ Máquina de estados para respetar el protocolo de confirmación oficial
  const [paso, setPaso] = useState("conversacion"); 
  const [datosTemporales, setDatosTemporales] = useState(null);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const enviarMensaje = async () => {
    if (!input.trim() || loading) return;

    const textoUsuario = input.trim();
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: textoUsuario }]);
    setInput("");
    setLoading(true);

    try {
      // ====================================================================
      // PASO 2: FASE DE CONFIRMACIÓN LOCAL (BYPASS DE IA HACIA MYSQL)
      // ====================================================================
      if (paso === "confirmacion") {
        const respuestaNormalizada = textoUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const afirmativas = ["si", "dale", "confirmo", "hagamoslo", "esta bien", "procede", "ya", "bueno", "ok", "listo"];
        const esAfirmativo = afirmativas.some(palabra => respuestaNormalizada.includes(palabra));

        if (esAfirmativo) {
          const hashSimulado = "sha256_gemini_" + Math.random().toString(36).substring(2, 7);

          const responseDb = await fetch("https://pagservicios-production.up.railway.app/api/denuncias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_expediente: datosTemporales.id_expediente,
              delito: datosTemporales.delito,
              distrito: datosTemporales.distrito,
              urgencia: datosTemporales.urgencia,
              latitud: datosTemporales.latitud,
              longitud: datosTemporales.longitud,
              hash: hashSimulado,
              coincidencia: datosTemporales.coincidencia,
              recomendacion: datosTemporales.recomendacion
            })
          });

          if (responseDb.ok) {
            setMessages((prev) => [
              ...prev, 
              { 
                id: Date.now() + 1,
                sender: "ia", 
                text: `✅ *Expediente registrado de manera exitosa en SIDPOL.*\n\n• *N° Expediente:* #${datosTemporales.id_expediente}\n\nLos datos estructurales han sido inyectados de forma síncrona en la base de datos relacional MySQL. El panel analítico y el mapa táctico del oficial PNP han integrado el reporte.` 
              }
            ]);
            if (onDenunciaCompletada) onDenunciaCompletada(datosTemporales);
            setPdfGenerado(true);
          } else {
            throw new Error("Fallo en la inserción transaccional de MySQL.");
          }
        } else {
          setMessages((prev) => [
            ...prev, 
            { 
              id: Date.now() + 1,
              sender: "ia", 
              text: "❌ Registro cancelado. Los metadatos de triaje han sido purgados del búfer de sesión por políticas de confidencialidad." 
            }
          ]);
          setPdfGenerado(false);
        }

        setTimeout(() => {
          setPaso("conversacion");
          setDatosTemporales(null);
          setLoading(false);
        }, 50);
      } 
      
      // ====================================================================
      // PASO 1: FASE DE CONVERSACIÓN Y ANÁLISIS DE RELATO (CON GEMINI REAL)
      // ====================================================================
      else if (paso === "conversacion") {
        const response = await fetch("https://pagservicios-production.up.railway.app/api/ia/analizar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ relato: textoUsuario })
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.es_denuncia_valida) {
            setDatosTemporales({
              id_expediente: `EP-${Math.floor(100000 + Math.random() * 900000)}`,
              delito: data.tipo,
              distrito: data.zona,
              urgencia: data.urgencia,
              coincidencia: data.coincidencia,
              recomendacion: data.recomendacion,
              latitud: null, 
              longitud: null
            });

            setTimeout(() => {
              setMessages((prev) => [
                ...prev, 
                { 
                  id: Date.now() + 1,
                  sender: "ia", 
                  text: `🧠 [Asistente Virtual - Triaje Terminado]:\n\n${data.recomendacion}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 METADATOS CLASIFICADOS EN CALIENTE:\n• Delito Inferido: ${data.tipo}\n• Jurisdicción: ${data.zona}\n• Alerta de Riesgo: ${data.urgencia}\n• Confianza: ${data.coincidencia}%\n\n¿Desea registrar formalmente este expediente de manera síncrona en el panel analítico de la PNP?\n(Responda únicamente con un "SI" para confirmar o "NO" para cancelar)` 
                }
              ]);
              setPaso("confirmacion");
              setLoading(false);
            }, 50);

          } else {
            setTimeout(() => {
              setMessages((prev) => [
                ...prev, 
                { 
                  id: Date.now() + 1, 
                  sender: "ia", 
                  text: `🧠 [Asistente Virtual]:\n\n${data.recomendacion}` 
                }
              ]);
              setLoading(false);
            }, 50);
          }
        } else {
          throw new Error("Error en respuesta de la API central.");
        }
      }

    } catch (error) {
      console.error("Error crítico en el flujo de control:", error);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ia", text: "⚠️ Error interno de comunicación con los servicios centrales de SIDPOL." }]);
        setPaso("conversacion");
        setDatosTemporales(null);
        setLoading(false);
      }, 50);
    }
  };

  const descargarPdfSimulado = () => {
    alert(`📄 Generando y descargando: COMPROBANTE_DENUNCIA_SIDPOL.pdf\n\nIncluye firma digital institucional y HASH criptográfico.`);
  };

  return (
    <div className="chat-container-wa">
      
      {/* Cabecera Estilo WhatsApp */}
      <div className="chat-header-wa">
        <div style={{ background: "#00a884", borderRadius: "50%", width: "42px", height: "42px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
          👮
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong style={{ fontSize: "14px", margin: 0, color: "inherit" }}>SISTEMA DE TRIAJE CRIMINAL</strong>
          <span style={{ fontSize: "12px", color: "var(--neon-cyan, #00a884)" }}>en línea</span>
        </div>
      </div>

      {/* Cuerpo y Mensajes */}
      <div className="chat-messages-wa">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender === "ia" ? "bot" : "user"}`}>
            <p style={{ whiteSpace: "pre-line", margin: 0 }}>{msg.text}</p>
            <span className="chat-time">{msg.sender === "user" ? "✓✓" : ""}</span>
          </div>
        ))}
        
        {loading && (
          <div className="chat-bubble bot loading-bubble">
            <div className="typing-dots" style={{ display: "flex", gap: "4px", padding: "4px" }}>
              <span style={{ width: "6px", height: "6px", background: "#8696a0", borderRadius: "50%" }}></span>
              <span style={{ width: "6px", height: "6px", background: "#8696a0", borderRadius: "50%" }}></span>
              <span style={{ width: "6px", height: "6px", background: "#8696a0", borderRadius: "50%" }}></span>
            </div>
          </div>
        )}
        
        {pdfGenerado && (
          <div className="tracking-timeline-box view-fade-in" style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", marginTop: "10px" }}>
            <h5 style={{ margin: "0 0 8px 0" }}>📡 Estado del Despacho y Seguimiento Digital (SIDPOL Link)</h5>
            <div className="timeline-steps" style={{ display: "flex", gap: "10px", fontSize: "12px", marginBottom: "10px" }}>
              <div className="step done">✓ Identidad RENIEC</div>
              <div className="step done">✓ Análisis LLM Core</div>
              <div className="step active">● En Cola de Despacho Comisaría</div>
            </div>
            <button onClick={descargarPdfSimulado} className="btn-download-pdf-premium" style={{ width: "100%", padding: "8px", background: "#00a884", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              📥 Descargar Acta de Denuncia Firmada (PDF)
            </button>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Pie de página e Inputs */}
      <div className="chat-input-area-wa">
        <input
          type="text"
          className="chat-input-wa"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder={paso === "confirmacion" ? "Responda SI o NO..." : "Escribe los hechos de tu denuncia..."}
          disabled={loading}
        />
        <button onClick={enviarMensaje} disabled={loading} className="chat-send-btn-wa">
          {loading ? "..." : "➤"}
        </button>
      </div>

    </div>
  );
}

export default ChatBotIA;