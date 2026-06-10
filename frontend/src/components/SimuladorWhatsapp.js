import React, { useState, useEffect, useRef } from "react";
import "../styles/SimuladorWhatsapp.css"; 

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
  "SAN BORJA": { lat: -12.1064, lng: -77.0011 }, "SAN ISIDRO": { lat: -12.0975, lng: -77.0353 },
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

function SimuladorWhatsapp({ onDenunciaCreada }) {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      texto: "👋 ¡Hola! Soy el asistente virtual de la Central de Denuncias SIDPOL.\n\nEstoy aquí para atenderte de manera inmediata y confidencial. ¿En qué te puedo ayudar o qué incidente deseas reportar hoy?",
      sender: "bot",
      tiempo: "18:00"
    }
  ]);
  const [input, setInput] = useState("");
  const [paso, setPaso] = useState("conversacion"); 
  const [datosTemporales, setDatosTemporales] = useState(null);
  const [escribiendo, setEscribiendo] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo]);

  const obtenerHoraActual = () => {
    const ahora = new Date();
    return `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
  };

  const normalizarTexto = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
  };

  const analizarIntencionLocal = (texto) => {
    const txt = texto.toLowerCase();
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|oe|saludos)/i.test(txt)) {
      return { tipo: "saludo", respuesta: "¡Hola! Buenas horas. Cuéntame, ¿te encuentras bien? Si has sufrido o presenciado un hecho delictivo, por favor descríbeme brevemente qué pasó y en qué distrito para enviar apoyo." };
    }
    if (/^(gracias|buenisimo|excelente|ok|vale|entendido)/i.test(txt)) {
      return { tipo: "agradecimiento", respuesta: "De nada, estimad@. La Central SIDPOL está operativa 24/7 para velar por tu seguridad. Si tienes otra alerta, indícamelo." };
    }
    if (/^(como estas|quien eres|que haces|ayuda)/i.test(txt)) {
      return { tipo: "charla", respuesta: "Soy el canal inteligente de SIDPOL. Mi labor es procesar reportes de delitos mediante análisis de lenguaje natural para integrarlos al mapa criminal de la PNP en tiempo real. Cuéntame, ¿qué suceso deseas registrar?" };
    }
    return null;
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const textoUsuario = input.trim();
    const horaUsuario = obtenerHoraActual();

    setMensajes((prev) => [...prev, { id: Date.now(), texto: textoUsuario, sender: "user", tiempo: horaUsuario }]);
    setInput("");
    setEscribiendo(true);

    setTimeout(async () => {
      try {
        if (paso === "conversacion") {
          const intencionChat = analizarIntencionLocal(textoUsuario);
          
          if (intencionChat) {
            setMensajes((prev) => [
              ...prev,
              { id: Date.now(), texto: intencionChat.respuesta, sender: "bot", tiempo: obtenerHoraActual() }
            ]);
            setEscribiendo(false);
            return;
          }

          const response = await fetch("http://localhost:5000/api/ia/analizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ relato: textoUsuario })
          });
          
          if (!response.ok) throw new Error("Error en servidor de IA");
          const data = await response.json();

          let { tipo, zona, urgencia } = data;
          
          // Escaneo de seguridad en caliente para los distritos de Lima
          const textoMayusculas = normalizarTexto(textoUsuario);
          let zonaDetectada = zona ? zona.toUpperCase() : "LIMA";

          Object.keys(coordenadasDistritos).forEach((distritoKey) => {
            if (textoMayusculas.includes(distritoKey)) {
              zonaDetectada = distritoKey;
            }
          });

          const coords = coordenadasDistritos[zonaDetectada] || { lat: -12.0464, lng: -77.0428 };

          setDatosTemporales({
            id_expediente: `EP-${Math.floor(100000 + Math.random() * 900000)}`,
            delito: tipo || "Incidente General",
            distrito: zonaDetectada,
            urgencia: urgencia || "MEDIA",
            latitud: coords.lat,
            longitud: coords.lng,
            descripcion: textoUsuario
          });

          setMensajes((prev) => [
            ...prev,
            {
              id: Date.now(),
              texto: `🚨 *He comprendido la situación.*\n\nHe procesado tu reporte de forma inteligente:\n• *Suceso:* ${tipo || "Incidente General"}\n• *Distrito:* ${zonaDetectada}\n• *Prioridad:* ${urgencia || "MEDIA"}\n\n¿Me das tu autorización para registrar formalmente esta denuncia en el mapa analítico de la Policía Nacional?\n\n*(Responde con un "SI" para confirmar o "NO" para cancelar)*`,
              sender: "bot",
              tiempo: obtenerHoraActual()
            }
          ]);
          setPaso("confirmacion");
        } 
        
        else if (paso === "confirmacion") {
          const respuestaNormalizada = textoUsuario.toLowerCase();

          if (respuestaNormalizada === "si" || respuestaNormalizada === "sí" || respuestaNormalizada.includes("dale") || respuestaNormalizada.includes("confirmo")) {
            
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
                hash: "sha256_mockup_whatsapp_" + Math.random().toString(36).substring(2, 7)
              })
            });

            if (!responseDb.ok) throw new Error("Error al insertar en base de datos");

            setMensajes((prev) => [
              ...prev,
              {
                id: Date.now(),
                texto: `✅ *Perfecto, denuncia registrada en el Sistema SIDPOL.*\n\n• *N° Expediente:* #${datosTemporales.id_expediente}\n\nLos datos geográficos han sido enviados al centro de monitoreo de la comisaría de ${datosTemporales.distrito}. Una patrulla ha sido alertada. ¡Mantente a buen recaudo!`,
                sender: "bot",
                tiempo: obtenerHoraActual()
              }
            ]);

            // Disparar el refresco dinámico que definimos en el Dashboard
            if (onDenunciaCreada) onDenunciaCreada();

          } else {
            setMensajes((prev) => [
              ...prev,
              {
                id: Date.now(),
                texto: "❌ Entendido. Se ha cancelado el registro y se han borrado los datos del buffer de sesión por privacidad. Si necesitas reportar otra cosa, solo dime.",
                sender: "bot",
                tiempo: obtenerHoraActual()
              }
            ]);
          }
          setPaso("conversacion");
          setDatosTemporales(null);
        }
      } catch (err) {
        setMensajes((prev) => [
          ...prev,
          {
            id: Date.now(),
            texto: "⚠️ Hubo un inconveniente técnico al conectar con la base de datos de SIDPOL. Por favor, verifica que tus servicios backend estén activos.",
            sender: "bot",
            tiempo: obtenerHoraActual()
          }
        ]);
      } finally {
        setEscribiendo(false);
      }
    }, 1200);
  };

  return (
    <div className="whatsapp-mock-container">
      <div className="wa-header">
        <div className="wa-avatar">👮‍♂️</div>
        <div className="wa-status-info">
          <h4>SIDPOL - Central de Denuncias</h4>
          <span>En línea (IA Operativa)</span>
        </div>
      </div>
      
      <div className="wa-chat-body">
        {mensajes.map((m) => (
          <div key={m.id} className={`wa-msg-row ${m.sender}`}>
            <div className="wa-msg-bubble">
              <p style={{ whiteSpace: "pre-line" }}>{m.texto}</p>
              <span className="wa-time">{m.tiempo}</span>
            </div>
          </div>
        ))}
        {escribiendo && (
          <div className="wa-msg-row bot">
            <div className="wa-msg-bubble writing">
              <span>Escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form className="wa-footer" onSubmit={enviarMensaje}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">🕊️</button>
      </form>
    </div>
  );
}

export default SimuladorWhatsapp;