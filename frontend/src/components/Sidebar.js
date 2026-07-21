

function Sidebar({ activeMenu, setActiveMenu, rol, usuario, onLogout, temaGlobal, setTemaGlobal, tamanoLetra, setTamanoLetra }) {
  // Estado local para simular el cambio de nodos/temas en la interfaz

  return (
    <aside className="sidebar-premium">
      {/* Cabecera del Sistema */}
      <div className="sidebar-brand">
        <div className="brand-logo">👮</div>
        <div>
          <h3>SISTEMA IA</h3>
          <span>MININTER v2.5</span>
        </div>
      </div>

      {/* Tarjeta de Información de Usuario Potenciada */}
      <div className="user-session-card">
        <span className={`role-tag ${rol?.toLowerCase()}`}>{rol}</span>
        <p className="user-name">{usuario}</p>
        <p className="user-meta-info">Firma: SIDPOL-2026-OK</p>
        <p className="user-meta-info">Terminal: Lima_Metropolitana</p>
      </div>

      {/* Menú de Navegación del Sistema (Corregido sin fondo blanco) */}
      <nav className="sidebar-menu">
        {rol === "PNP" && (
          <button className={`menu-item ${activeMenu === "panel" ? "active" : ""}`} onClick={() => setActiveMenu("panel")}>
            <span className="icon">📊</span> Panel PNP Analítico
          </button>
        )}

        {rol === "CIUDADANO" && (
          <button className={`menu-item ${activeMenu === "nueva" ? "active" : ""}`} onClick={() => setActiveMenu("nueva")}>
            <span className="icon">📋</span> Nueva Denuncia IA
          </button>
        )}

        <button className={`menu-item ${activeMenu === "historial" ? "active" : ""}`} onClick={() => setActiveMenu("historial")}>
          <span className="icon">🗂️</span> Mantenimiento CRUD
        </button>

        <button className={`menu-item ${activeMenu === "config" ? "active" : ""}`} onClick={() => setActiveMenu("config")}>
          <span className="icon">⚙️</span> Auditoría Capas
        </button>
      </nav>

   {/* NUEVA SECCIÓN REEMPLAZADA: Control de Accesibilidad (UI/UX) */}
      <div className="sidebar-theme-selector">
        <label>👁️ Accesibilidad</label>
        
        {/* Toggle de Tema Claro/Oscuro */}
        <div className="theme-options-grid" style={{ marginBottom: "10px" }}>
          <button 
            className={`btn-theme-toggle ${temaGlobal === "theme-dark" ? "active" : ""}`} 
            onClick={() => setTemaGlobal("theme-dark")}
          >
            🌙 Oscuro
          </button>
          <button 
            className={`btn-theme-toggle ${temaGlobal === "theme-light" ? "active" : ""}`} 
            onClick={() => setTemaGlobal("theme-light")}
          >
            ☀️ Claro
          </button>
        </div>

        {/* Toggle de Tamaño de Fuente */}
        <div className="theme-options-grid">
          <button 
            className={`btn-theme-toggle ${tamanoLetra === "font-sm" ? "active" : ""}`} 
            onClick={() => setTamanoLetra("font-sm")}
          >
            A-
          </button>
          <button 
            className={`btn-theme-toggle ${tamanoLetra === "font-md" ? "active" : ""}`} 
            onClick={() => setTamanoLetra("font-md")}
          >
            A 
          </button>
          <button 
            className={`btn-theme-toggle ${tamanoLetra === "font-lg" ? "active" : ""}`} 
            onClick={() => setTamanoLetra("font-lg")}
          >
            A+ 
          </button>
        </div>
      </div>

      {/* Botón de Cierre de Sesión */}
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={onLogout}>
          🚪 Cerrar Sistema
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;