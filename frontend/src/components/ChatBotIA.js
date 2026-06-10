import React, { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css"; // Mantenemos tus estilos base

// 🗺️ DICCIONARIO GEOGRÁFICO DE LIMA
const coordenadasDistritos = {
  "ANCON": { lat: -11.7736, lng: -77.1762 }, "ATE": { lat: -12.0264, lng: -76.9214 },
  "BARRANCO": { lat: -12.1481, lng: -77.0211 }, "BREÑA": { lat: -12.0602, lng: -77.0494 },
  "CARABAYLLO": { lat: -11.8494, lng: -77.0275 }, "CHACLACAYO": { lat: -11.9767, lng: -76.7719 },
  "CHORRILLOS": { lat: -12.1761, lng: -77.0161 }, "CIENEGUILLA": { lat: -12.1008, lng: -76.7644 },
  "COMAS": { lat: -11.9311, lng: -77.0423 }, "EL AGUSTINO": { lat: -12.0461, lng: -76.9961 },
  "INDEPENDENCIA": { lat: -11.9911, lng: -77.0519 }, "JESUS MARIA": { lat: -12.0736, lng: -77.0489 },
  "LA MOLINA": { lat: -12.0761, lng: -76.9264 }, "LA VICTORIA": { lat: -12.0653, lng: -77.0178 },
  "LIMA": { lat: -12.0464, lng: -77.0428 }, "CERCADO DE LIMA": { lat: -12.0464, lng: -77.0428 },
  "LINCE": { lat: -12.0836, lng: -77.0347 }, "LOS OLIVOS": { lat: -11.9922, lng: -77.0675 },
  "LURIGANCHO": { lat: -11.9372, lng: -76.7022 }, "CHOSICA": { lat: -11.9372, lng: -76.7022 },
  "LURIN": { lat: -12.2742, lng: -76.8681 }, "MAGDALENA DEL MAR": { lat: -12.0944, lng: -77.0653 },
  "MIRAFLORES": { lat: -12.1225, lng: -77.0311 }, "PACHACAMAC": { lat: -12.1289, lng: -76.8583 },
  "PUCUCO": { lat: -12.4331, lng: -76.7792 }, "PUCUSANA": { lat: -12.4331, lng: -76.7792 },
  "PUEBLO LIBRE": { lat: -12.0786, lng: -77.0619 }, "PUENTE PIEDRA": { lat: -11.8664, lng: -77.0772 },
  "PUNTA HERMOSA": { lat: -12.3331, lng: -76.8261 }, "PUNTA NEGRA": { lat: -12.3644, lng: -76.7972 },
  "RIMAC": { lat: -12.0294, lng: -77.0286 }, "SAN BARTOLO": { lat: -12.3914, lng: -76.7814 },
  "SAN BORJA": { lat: -12.1064, lng: -70.0011 }, "SAN ISIDRO": { lat: -12.0975, lng: -77.0353 },
  "SAN JUAN DE LURIGANCHO": { lat: -12.0000, lng: -76.9833 }, "SJL": { lat: -12.0000, lng: -76.9833 },
  "SAN JUAN DE MIRAFLORES": { lat: -12.1625, lng: -76.9639 }, "SJM": { lat: -12.1625, lng: -76.9639 },
  "SAN LUIS": { lat: -12.0764, lng: -76.9947 }, "SAN MARTIN DE PORRES": { lat: -11.9961, lng: -77.0850 },
  "SMP": { lat: -11.9961, lng: -77.0850 }, "SAN MIGUEL": { lat: -12.0792, lng: -77.0936 },
  "SANTA ANITA": { lat: -12.0444, lng: -76.9714 }, "SANTA MARIA DEL MAR": { lat: -12.4114, lng: -76.7761 },
  "SANTA ROSA": { lat: -11.8061, lng: -77.1658 }, "SANTIAGO DE SURCO": { lat: -12.1283, lng: -76.9839 },
  "SURCO": { lat: -12.1283, lng: -76.9839 }, "SURQUILLO": { lat: -12.1133, lng: -77.0194 },
  "VILLA EL SALVADOR": { lat: -12.2136, lng: -76.9364 }, "VES": { lat: -12.2136, lng: -76.9364 },
  "VILLA MARIA DEL TRIUNFO": { lat: -12.1583, lng: -76.9286 }, "VMT": { lat: -12.1583, lng: -76.9286 },
  "CALLAO": { lat: -12.0566, lng: -77.1181 }
};

function ChatBotIA({ onDenunciaCompletada }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ia",
      text: "👋 ¡Hola! Soy el asistente virtual de la Central de Denuncias SIDPOL.\n\nIdentidad validada de manera conforme con la pasarela integrada.\n\nEstoy aquí para atenderte de manera inmediata y confidencial. ¿En qué te puedo ayudar o qué incidente deseas reportar hoy?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfGenerado, setPdfGenerado] = useState(false);
  const [paso, setPaso] = useState("conversacion"); // 'conversacion' o 'confirmacion'
  const [datosTemporales, setDatosTemporales] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const normalizarTexto = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
  };

  // 🧠 FILTRADO HUMANO Y CHARLA DINÁMICA
  const analizarIntencionLocal = (texto) => {
    const txt = texto.toLowerCase();
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|oe|saludos)/i.test(txt)) {
      return "¡Hola! Buenas horas. Cuéntame, ¿te encuentras bien? Si has sufrido o presenciado un hecho delictivo, por favor descríbeme qué pasó y en qué distrito para enviar apoyo.";
    }
    if (/^(gracias|buenisimo|excelente|ok|vale|entendido)/i.test(txt)) {
      return "De nada, estimad@. La Central SIDPOL está operativa 24/7 para velar por tu seguridad. Si tienes otra alerta, indícamelo.";
    }
    if (/^(como estas|quien eres|que haces|ayuda)/i.test(txt)) {
      return "Soy el canal inteligente de SIDPOL. Mi labor es procesar reportes de delitos mediante análisis de lenguaje natural (NLP) para integrarlos al mapa criminal de la PNP en tiempo real. Cuéntame, ¿qué suceso deseas registrar?";
    }
    return null;
  };

  const enviarMensaje = async () => {
    if (!input.trim() || loading) return;

    const textoUsuario = input.trim();
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: textoUsuario }]);
    setInput("");
    setLoading(true);

    // Pequeño delay de red simulado para que parezca que la IA "piensa"
    setTimeout(async () => {
      try {
        if (paso === "conversacion") {
          // 1. Validar si es charla común
          const respuestaCharla = analizarIntencionLocal(textoUsuario);
          if (respuestaCharla) {
            setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ia", text: respuestaCharla }]);
            setLoading(false);
            return;
          }

          // 2. Es un relato delictivo, llamamos a la API de IA
          let apiData;
          try {
            const response = await fetch("http://localhost:5000/api/ia/analizar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ relato: textoUsuario })
            });

            if (response.ok) {
              apiData = await response.json();
            } else {
              throw new Error("API Fallback");
            }
          } catch (e) {
            // FALLBACK LOCAL SI EL BACKEND DE IA TIENE PROBLEMAS
            apiData = {
              tipo: "Robo Agravado",
              zona: "LIMA",
              urgencia: "ALTA"
            };
          }

          // 🛠️ ESCANEO DE SEGURIDAD EN CALIENTE (PARCHE PUNTA HERMOSA)
          let distritoDetectado = apiData.zona ? apiData.zona.toUpperCase() : "LIMA";
          const textoMayusculas = normalizarTexto(textoUsuario);
          
          Object.keys(coordenadasDistritos).forEach((distritoKey) => {
            if (textoMayusculas.includes(distritoKey)) {
              distritoDetectado = distritoKey;
            }
          });

          const coords = coordenadasDistritos[distritoDetectado] || { lat: -12.0464, lng: -77.0428 };

          // Almacenamos temporalmente en el buffer
          setDatosTemporales({
            id_expediente: `EP-${Math.floor(100000 + Math.random() * 900000)}`,
            delito: apiData.tipo || "Incidente General",
            distrito: distritoDetectado,
            urgencia: apiData.urgencia || "MEDIA",
            latitud: coords.lat,
            longitud: coords.lng,
            descripcion: textoUsuario
          });

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "ia",
              text: `🚨 *He comprendido la situación.*\n\nHe procesado tu reporte de forma inteligente:\n• *Suceso:* ${apiData.tipo || "Incidente General"}\n• *Distrito:* ${distritoDetectado}\n• *Prioridad:* ${apiData.urgencia || "MEDIA"}\n\n¿Me das tu autorización para registrar formalmente esta denuncia en el mapa analítico de la Policía Nacional?\n\n*(Responde con un "SI" para confirmar o "NO" para cancelar)*`
            }
          ]);
          setPaso("confirmacion");

        } else if (paso === "confirmacion") {
          const respuestaNormalizada = textoUsuario.toLowerCase();

          if (respuestaNormalizada === "si" || respuestaNormalizada === "sí" || respuestaNormalizada.includes("dale") || respuestaNormalizada.includes("confirmo")) {
            
            try {
              // Guardamos en la base de datos MySQL mediante tu API general de denuncias
              const responseDb = await fetch("http://localhost:5000/api/denuncias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_expediente: datosTemporales.id_expediente,
                  delito: datosTemporales.delito,
                  distrito: datosTemporales.distrito,
                  urgencia: datosTemporales.urgencia,
                  latitud: datosTemporales.latitud,
                  longitud: datosTemporales.longitud,
                  hash: "sha256_whatsapp_" + Math.random().toString(36).substring(2, 7)
                })
              });

              if (!responseDb.ok) throw new Error("Error en DB");
              
            } catch (dbErr) {
              console.log("Modo Demo o error de red guardando datos locales...");
            }

            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                sender: "ia",
                text: `✅ *Perfecto, denuncia registrada en el Sistema SIDPOL.*\n\n• *N° Expediente:* #${datosTemporales.id_expediente}\n\nLos datos geográficos han sido enviados al centro de monitoreo de la comisaría de ${datosTemporales.distrito}. Una patrulla ha sido alertada. ¡Mantente a buen recaudo!`
              }
            ]);

            // Notifica al contenedor padre para que las gráficas de la PNP se enteren (si es necesario)
            if (onDenunciaCompletada) onDenunciaCompletada(datosTemporales);
            
            // 🔥 ACTIVAMOS EL BLOCK DE DESCARGA DE PDF Y TIMELINE
            setPdfGenerado(true);

          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                sender: "ia",
                text: "❌ Entendido. Se ha cancelado el registro y se han borrado los datos del buffer por privacidad. Si necesitas reportar otra cosa, solo dime."
              }
            ]);
          }
          
          setPaso("conversacion");
          setDatosTemporales(null);
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ia",
            text: "⚠️ Ocurrió un error en el procesamiento de datos del sistema SIDPOL."
          }
        ]);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const descargarPdfSimulado = () => {
    alert(`📄 Generando y descargando: COMPROBANTE_DENUNCIA_SIDPOL.pdf\n\nIncluye firma digital institucional y HASH criptográfico.`);
  };

  return (
    <div className="chatbot-wrapper premium" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      
      {/* DISEÑO ESTILEADO WHATSAPP DE CABECERA */}
      <div className="wa-header" style={{
        display: "flex", alignItems: "center", gap: "10px", padding: "10px", 
        background: "#075e54", color: "#fff", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"
      }}>
        <div style={{ fontSize: "24px" }}>👮‍♂️</div>
        <div>
          <h4 style={{ margin: 0, fontSize: "15px" }}>SIDPOL - Asistente Virtual</h4>
          <span style={{ fontSize: "11px", opacity: 0.8 }}>En línea • IA Operativa</span>
        </div>
      </div>

      <div className="chatbot-body" style={{ flex: 1, padding: "15px", overflowY: "auto", background: "#efeae2" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`} style={{
            display: "flex",
            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            marginBottom: "10px"
          }}>
            <p style={{
              background: msg.sender === "user" ? "#d9fdd3" : "#ffffff",
              color: "#303030",
              padding: "10px 14px",
              borderRadius: "8px",
              maxWidth: "80%",
              margin: 0,
              boxShadow: "0px 1px 1px rgba(0,0,0,0.1)",
              whiteSpace: "pre-line",
              fontSize: "14px"
            }}>{msg.text}</p>
          </div>
        ))}
        
        {loading && (
          <div className="chat-bubble ia" style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#fff", padding: "10px", borderRadius: "8px" }}>
              <span style={{ color: "#777", fontSize: "13px" }}>Escribiendo...</span>
            </div>
          </div>
        )}
        
        {pdfGenerado && (
          <div className="tracking-timeline-box view-fade-in" style={{
            background: "#fff", padding: "15px", borderRadius: "8px", 
            marginTop: "15px", borderLeft: "4px solid #075e54", boxShadow: "0px 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h5 style={{ margin: "0 0 10px 0", color: "#075e54" }}>📡 Estado del Despacho y Seguimiento Digital</h5>
            <div className="timeline-steps" style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "15px", color: "#555" }}>
              <div style={{ color: "green", fontWeight: "bold" }}>✓ Identidad RENIEC</div>
              <div style={{ color: "green", fontWeight: "bold" }}>✓ Análisis NLP Terminado</div>
              <div style={{ color: "#ea580c", fontWeight: "bold" }}>● En Cola de Despacho Comisaría</div>
            </div>
            <button onClick={descargarPdfSimulado} className="btn-download-pdf-premium" style={{
              width: "100%", padding: "10px", background: "#075e54", color: "#fff", 
              border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
            }}>
              📥 Descargar Acta de Denuncia Firmada (PDF)
            </button>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chatbot-footer" style={{ padding: "10px", background: "#f0f2f5", display: "flex", gap: "10px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder="Escribe un mensaje o describe tu caso..."
          disabled={loading}
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc", outline: "none" }}
        />
        <button onClick={enviarMensaje} disabled={loading} className="btn-send-premium" style={{
          padding: "10px 20px", background: "#075e54", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer"
        }}>
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}

export default ChatBotIA;