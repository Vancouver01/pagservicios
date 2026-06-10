import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapaCalor({ historial }) {
  const centroLima = [-12.046374, -77.042793];

  const coordenadasDistritos = {
    sjl: [-11.9639, -76.9964],
    olivos: [-11.9922, -77.0675],
    callao: [-12.0566, -77.1181],
    miraflores: [-12.1214, -77.0298]
  };

  // 🔄 Generamos una key dinámica única. 
  // Cada vez que el historial cambie o se edite, esta clave cambiará y forzará el re-render total del mapa.
  const mapKey = historial ? JSON.stringify(historial.map(c => `${c.id_expediente}-${c.distrito}`)) : 'mapa-vacio';

  return (
    <div className="card map-card premium">
      <div className="card-header-map" style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "17px" }}>📍 Georreferenciación Criminológica Real</h3>
        <span className="map-badge" style={{ fontSize: "10px", color: "#06b6d4", fontWeight: "bold" }}>LIMA HUB</span>
      </div>

      <div className="simulated-map-premium" style={{ height: "420px", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
        
        {/* 🔥 AQUÍ ESTÁ EL CAMBIO PRINCIPAL: Añadimos la prop 'key' */}
        <MapContainer 
          key={mapKey}
          center={centroLima} 
          zoom={11} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {historial && historial.map((caso, index) => {
            let posicionFinal = [...centroLima];
            const dist = (caso.distrito || "").toLowerCase();

            if (caso.latitud && caso.longitud) {
              posicionFinal = [parseFloat(caso.latitud), parseFloat(caso.longitud)];
            } 
            else if (dist.includes("olivos")) {
              posicionFinal = coordenadasDistritos.olivos;
            } else if (dist.includes("miraflores")) {
              posicionFinal = coordenadasDistritos.miraflores;
            } else if (dist.includes("juan") || dist.includes("sjl")) {
              posicionFinal = coordenadasDistritos.sjl;
            } else if (dist.includes("callao")) {
              posicionFinal = coordenadasDistritos.callao;
            }

            const urgenciaLimpia = (caso.urgencia || "alta").toLowerCase();
            const colorNodo = urgenciaLimpia === "alta" || urgenciaLimpia === "crítica" ? "#ef4444" : urgenciaLimpia === "media" ? "#f59e0b" : "#10b981";

            return (
              <React.Fragment key={caso.id_expediente || index}>
                <CircleMarker
                  center={posicionFinal}
                  pathOptions={{
                    color: colorNodo,
                    fillColor: colorNodo,
                    fillOpacity: 0.25,
                    weight: 1
                  }}
                  radius={25}
                />
                
                <Marker position={posicionFinal}>
                  <Popup>
                    <div style={{ color: "#000", fontFamily: "sans-serif", fontSize: "12px" }}>
                      <strong style={{ color: colorNodo }}>
                        🚨 {caso.distrito || "Distrito No Identificado"}
                      </strong>
                      <br />
                      <strong>Expediente:</strong> {caso.id_expediente} <br />
                      <strong>Delito:</strong> {caso.delito_clasificado || "Pendiente de Clasificación"} <br />
                      <strong>Urgencia:</strong> {urgenciaLimpia.toUpperCase()}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapaCalor;