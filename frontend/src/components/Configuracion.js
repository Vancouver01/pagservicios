import React from "react";

function Configuracion() {

  return (

    <div>

      <h1 className="page-title">
        ⚙️ Configuración
      </h1>

      <div className="config-grid">

        <div className="config-card">
          <h3>👤 Perfil</h3>

          <p>Nombre: Luis Mendoza</p>
          <p>DNI: 74839211</p>
          <p>Correo: luis@gmail.com</p>

          <button>
            Editar perfil
          </button>
        </div>

        <div className="config-card">
          <h3>🔒 Seguridad</h3>

          <p>✔ Cuenta verificada RENIEC</p>
          <p>✔ Autenticación activa</p>

          <button>
            Cambiar contraseña
          </button>
        </div>

        <div className="config-card">
          <h3>🔔 Notificaciones</h3>

          <label>
            <input type="checkbox" defaultChecked />
            WhatsApp
          </label>

          <label>
            <input type="checkbox" defaultChecked />
            Correo electrónico
          </label>
        </div>

      </div>

    </div>

  );
}

export default Configuracion;