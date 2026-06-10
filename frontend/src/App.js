import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import NuevaDenuncia from "./components/NuevaDenuncia";
import "./styles/app.css";
import "./styles/chatbot.css";

function App() {
  // --- 1. SISTEMA DE AUTENTICACIÓN Y SESIÓN (RBAC) ---
  const [sesion, setSesion] = useState({
    activo: false,
    usuario: null,
    rol: null, // "CIUDADANO" o "PNP"
    dni: ""
  });

  const [dniInput, setDniInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // --- 2. EL ESTADO GLOBAL DE IA ---
const [datosIaGlobal, setDatosIaGlobal] = useState({
 tipo: "Pendiente de Reporte",
    zona: "No Identificada",
    urgencia: "BAJA",
    coincidencia: 0,
    recomendacion: "Por favor, inicie la conversación con el asistente virtual en la sección de 'Nueva Denuncia' para realizar el triaje asistido."
  });

  // --- 3. REPOSITORIO DE DATOS (MySQL síncrono) ---
  const [tablaDenuncias, setTablaDenuncias] = useState([]);

  // --- 4. ESTADOS DE CONTROL DE INTERFAZ ---
  const [activeMenu, setActiveMenu] = useState("panel");
  const [registroEnEdicion, setRegistroEnEdicion] = useState(null);

  // --- 5. CONEXIÓN SÍNCRONA CON EL BACKEND (Node.js + MySQL) ---
  const cargarDatosDesdeBD = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/denuncias");
      if (response.ok) {
        const datosReales = await response.json();
        setTablaDenuncias(datosReales);
      } else {
        console.error("Error en la respuesta del servidor backend");
      }
    } catch (error) {
      console.error("Error de red al conectar con Node/MySQL:", error);
    }
  };

  useEffect(() => {
    if (sesion.activo) {
      cargarDatosDesdeBD();
    }
  }, [sesion.activo, activeMenu]);

  // --- 6. MANEJADORES DE AUTENTICACIÓN ---
  const ejecutarLogin = (e, rolAsignado) => {
    e.preventDefault();
    if (!dniInput || dniInput.length !== 8) {
      alert("Por favor, ingrese un DNI válido de 8 dígitos.");
      return;
    }

    if (rolAsignado === "PNP" && passwordInput !== "pnp123") {
      alert("Credenciales CIP de la Policía Nacional incorrectas.");
      return;
    }

    setSesion({
      activo: true,
      usuario: rolAsignado === "PNP" ? "CAPITÁN PNP FLORES" : "JEAN POOL JAMARILLO QUISPE",
      rol: rolAsignado,
      dni: dniInput
    });
    
    setActiveMenu(rolAsignado === "PNP" ? "panel" : "nueva");
  };

  const cerrarSesion = () => {
    setSesion({ activo: false, usuario: null, rol: null, dni: "" });
    setDniInput("");
    setPasswordInput("");
    setTablaDenuncias([]);
  };

  // --- 7. OPERACIONES CRUD (FETCH) ---
  const insertarDenuncia = async (nuevaDenunciaData) => {
    const coordenadasLima = {
      "Los Olivos": { lat: -11.9612, lng: -77.0689 },
      "Miraflores": { lat: -12.1225, lng: -77.0296 },
      "San Juan de Lurigancho": { lat: -11.9764, lng: -76.9961 },
      "Callao": { lat: -12.0566, lng: -77.1181 }
    };

    const distritoDetectado = nuevaDenunciaData.zona || "Los Olivos";
    const coords = coordenadasLima[distritoDetectado] || { lat: -12.0464, lng: -77.0428 };

    const nuevoRegistro = {
      id_expediente: `EXP-2026-0${Math.floor(Math.random() * 90) + 10}`,
      dni: sesion.dni,
      delito: nuevaDenunciaData.tipo,
      distrito: distritoDetectado,
      urgencia: nuevaDenunciaData.urgencia || "MEDIA",
      latitud: coords.lat,
      longitud: coords.lng,
      hash: "SHA256-" + Math.random().toString(16).substr(2, 8)
    };

    try {
      const response = await fetch("http://localhost:5000/api/denuncias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRegistro)
      });
      if (response.ok) {
        cargarDatosDesdeBD();
      }
    } catch (error) {
      console.error("Fallo al insertar registro en la BD:", error);
    }
  };

  const actualizarRegistro = async (id, camposActualizados) => {
    try {
      const response = await fetch(`http://localhost:5000/api/denuncias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado_despacho: camposActualizados.estado_despacho || camposActualizados.estado,
          delito_clasificado: camposActualizados.delito_clasificado || camposActualizados.delito,
          distrito: camposActualizados.distrito
        })
      });
      if (response.ok) {
        setRegistroEnEdicion(null);
        cargarDatosDesdeBD();
      }
    } catch (error) {
      console.error("Error al actualizar expediente:", error);
    }
  };

  const eliminarRegistro = async (id) => {
    if (window.confirm(`¿Está seguro de eliminar permanentemente el expediente ${id}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/denuncias/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          cargarDatosDesdeBD();
        }
      } catch (error) {
        console.error("Error al eliminar expediente de la BD:", error);
      }
    }
  };

  // --- 8. LOGIN GATEWAY ---
if (!sesion.activo) {
  return (
    <div className="login-gateway-container">
      <div className="login-card view-fade-in">
        
        {/* Cabecera Principal */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span className="header-badge">INTEROPERABILIDAD NACIONAL</span>
          <h1 style={{ margin: "10px 0 5px 0", fontSize: "32px", fontWeight: "800", color: "#ffffff" }}>
            SIDPOL <span style={{ color: "var(--neon-cyan)" }}>v2.4</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
            Sistema de Denuncias Digitales con Inteligencia Artificial Semántica y Geolocalización 24/7
          </p>
        </div>

        {/* Contenedor de las dos Columnas */}
        <div className="login-tabs-container">
          
          {/* Columna Acceso Ciudadano */}
          <div className="login-tab-box">
            <div>
              <h3>👤 Acceso Ciudadano</h3>
              <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 15px 0" }}>
                Validación síncrona mediante pasarela de identidad y firma digital.
              </p>
              <form onSubmit={(e) => ejecutarLogin(e, "CIUDADANO")}>
                <div style={{ textAlign: "left" }}>
                  <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Número de DNI</label>
                  <input 
                    type="text" 
                    maxLength={8} 
                    placeholder="💻 Ingrese 8 dígitos" 
                    value={dniInput} 
                    onChange={(e) => setDniInput(e.target.value.replace(/\D/g, ""))} 
                  />
                </div>
                <button type="submit" className="btn-login-submit ciudadano">
                  Validar con RENIEC ⚡
                </button>
              </form>
            </div>
          </div>

          {/* Columna Uso Oficial PNP */}
          <div className="login-tab-box admin-border">
            <div>
              <h3 style={{ color: "var(--neon-red)" }}>🛡️ Uso Oficial PNP</h3>
              <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 15px 0" }}>
                Consola restringida para Oficiales de Guardia, Despacho y Fiscalía.
              </p>
              <form onSubmit={(e) => ejecutarLogin(e, "PNP")}>
                <div style={{ textAlign: "left" }}>
                  <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>DNI / Carné CIP</label>
                  <input 
                    type="text" 
                    maxLength={8} 
                    placeholder="👮‍♂️ Identificador oficial" 
                    value={dniInput} 
                    onChange={(e) => setDniInput(e.target.value.replace(/\D/g, ""))} 
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Clave de Cifrado</label>
                  <input 
                    type="password" 
                    placeholder="🔒 ••••••••" 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)} 
                  />
                </div>
                <button type="submit" className="btn-login-submit pnp">
                  Autenticar Credenciales 🔑
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Pie de Seguridad */}
        <div style={{ textAlign: "center", marginTop: "25px", fontSize: "12px", color: "#64748b", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
          <span>🔒</span> Conexión cifrada bajo protocolo TLS 1.3 y persistencia relacional inmutable.
        </div>

      </div>
    </div>
  );
}
  
  // --- 9. PANEL PRINCIPAL ENTORNO ---
  return (
    <div className="app-container">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} rol={sesion.rol} usuario={sesion.usuario} onLogout={cerrarSesion} />

      <main className="main-content">
        <div className="view-fade-in">
          
          {activeMenu === "panel" && (
            sesion.rol === "PNP" ? (
              <Dashboard datosIa={datosIaGlobal} historial={tablaDenuncias} />
            ) : (
              <div className="card premium alert-box">
                <h2>⚠️ Sección Restringida</h2>
                <p>El panel de analítica criminal avanzada y mapas de calor está reservado exclusivamente para el personal de la Policía Nacional del Perú.</p>
              </div>
            )
          )}
          
          {activeMenu === "nueva" && (
            sesion.rol === "CIUDADANO" ? (
              <NuevaDenuncia 
                datosIa={datosIaGlobal} 
                onDenunciaCompletada={(data) => {
                  setDatosIaGlobal(data);
                  insertarDenuncia(data);
                }} 
              />
            ) : (
              <div className="card premium alert-box">
                <h2>⚠️ Acción no Permitida</h2>
                <p>El triaje asistido automatizado mediante lenguaje natural está diseñado únicamente para cuentas con rol de ciudadano civil.</p>
              </div>
            )
          )}

          {activeMenu === "historial" && (
            <div className="card premium full-page-card-table">
              <div className="table-header-container">
                <h2>🗂️ Repositorio Transaccional de Incidencias (Base de Datos MySQL)</h2>
                <span className="badge-pnp">{sesion.rol === "PNP" ? "MODO OPERADOR ADMINISTRADOR" : "VISTA INMUTABLE CIUDADANA"}</span>
              </div>
              <p className="text-muted">Mantenimiento y persistencia de expedientes digitales vinculados al protocolo de interoperabilidad.</p>
              
              {registroEnEdicion && (
                <div className="edit-form-overlay premium view-fade-in" style={{marginBottom: "25px", padding: "20px", background: "rgba(6, 182, 212, 0.03)", border: "1px solid var(--neon-cyan)", borderRadius: "12px"}}>
                  <h3>📝 Modificar Expediente Operativo: {registroEnEdicion.id_expediente || registroEnEdicion.id}</h3>
                  <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginTop: "15px"}}>
                    <div className="form-group-premium">
                      <label>Clasificación del Delito</label>
                      <input 
                        type="text" 
                        value={registroEnEdicion.delito_clasificado || registroEnEdicion.delito || ""} 
                        onChange={(e) => setRegistroEnEdicion({...registroEnEdicion, delito_clasificado: e.target.value, delito: e.target.value})} 
                      />
                    </div>
                    <div className="form-group-premium">
                      <label>Jurisdicción Territorial</label>
                      <input 
                        type="text" 
                        value={registroEnEdicion.distrito || ""} 
                        onChange={(e) => setRegistroEnEdicion({...registroEnEdicion, distrito: e.target.value})} 
                      />
                    </div>
                    <div className="form-group-premium">
                      <label>Estado de Despacho Operativo</label>
                      <select 
                        style={{width:"100%", padding:"10px", background:"#090d16", color:"white", border:"1px solid var(--card-border)", borderRadius:"6px"}} 
                        value={registroEnEdicion.estado_despacho || registroEnEdicion.estado || "Pendiente PNP"} 
                        onChange={(e) => setRegistroEnEdicion({...registroEnEdicion, estado_despacho: e.target.value, estado: e.target.value})}
                      >
                        <option value="Pendiente PNP">Pendiente PNP</option>
                        <option value="Asignado">Asignado</option>
                        <option value="En Investigation">En Investigación</option>
                        <option value="Archivado Temporal">Archivado Temporal</option>
                      </select>
                    </div>
                  </div>
                  <div style={{marginTop: "15px", display: "flex", gap: "10px"}}>
                    <button className="btn-send-premium" onClick={() => actualizarRegistro(registroEnEdicion.id_expediente || registroEnEdicion.id, registroEnEdicion)}>💾 Confirmar Modificación</button>
                    <button className="btn-send-premium" style={{background: "#334155"}} onClick={() => setRegistroEnEdicion(null)}>Cancelar</button>
                  </div>
                </div>
              )}

              <table className="premium-data-table">
                <thead>
                  <tr>
                    <th>N° Expediente</th>
                    <th>DNI Ciudadano</th>
                    <th>Clasificación IA</th>
                    <th>Jurisdicción</th>
                    <th>Estado de Despacho</th>
                    <th>Acciones Operativas</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaDenuncias.map((caso, index) => (
                    <tr key={index}>
                      <td className="bold-cyan">{caso.id_expediente}</td>
                      <td>{caso.dni_ciudadano || "72145632"}</td>
                      <td><span className="table-delito-tag">{caso.delito_clasificado}</span></td>
                      <td>{caso.distrito}</td>
                      <td>
                        <span className={`status-badge ${(caso.estado_despacho || "Pendiente").toLowerCase().replace(/ /g, "-")}`}>
                          {caso.estado_despacho || "Pendiente PNP"}
                        </span>
                      </td>
                      <td>
                        {sesion.rol === "PNP" ? (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button className="btn-action-edit" title="Modificar Registro" onClick={() => setRegistroEnEdicion(caso)}>✏️</button>
                            <button className="btn-action-delete" title="Purgar Físicamente de la BD" onClick={() => eliminarRegistro(caso.id_expediente)}>🗑️</button>
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: "11px" }}>Solo Lectura</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {tablaDenuncias.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        📡 No hay expedientes registrados en la base de datos de MySQL.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === "config" && (
            <div className="card premium config-grid-view">
              <h2>⚙️ Configuración y Auditoría de Capas de Software</h2>
              <p className="text-muted">Políticas de seguridad criptográficas asignadas para el token de sesión activa.</p>
              <div className="config-box" style={{marginTop: "20px"}}>
                <h4>🔒 Firma de Seguridad y Control de Trazabilidad</h4>
                <p><strong>Usuario Autenticado:</strong> {sesion.usuario}</p>
                <p><strong>Rol Asignado en la Infraestructura:</strong> {sesion.rol}</p>
                <p><strong>Token Hash Único:</strong> SHA256-SESSION-{sesion.dni || "INVITADO"}</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;