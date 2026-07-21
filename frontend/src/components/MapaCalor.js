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
    // Cono Norte
    "san martin de porres": [-12.0195, -77.0519],
    "smp": [-12.0195, -77.0519],
    "los olivos": [-11.9922, -77.0675],
    "olivos": [-11.9922, -77.0675],
    "comas": [-11.9333, -77.0500],
    "independencia": [-11.9900, -77.0530],
    "puente piedra": [-11.8764, -77.0742],
    "carabayllo": [-11.8517, -77.0231],
    "santa rosa": [-11.8211, -77.1472],
    "ancón": [-11.7764, -77.1681],

    // Cono Este
    "san juan de lurigancho": [-11.9639, -76.9964],
    "sjl": [-11.9639, -76.9964],
    "ate": [-12.0264, -76.9181],
    "santa anita": [-12.0422, -76.9722],
    "el agustino": [-12.0392, -77.0033],
    "san luis": [-12.0764, -76.9983],
    "la molina": [-12.0833, -76.9500],
    "lurigancho": [-11.9644, -76.7719], // Chosica
    "chaclacayo": [-11.9750, -76.7778],

    // Cono Sur
    "villa el salvador": [-12.2150, -76.9422],
    "ves": [-12.2150, -76.9422],
    "villa maria del triunfo": [-12.1558, -76.9364],
    "vmt": [-12.1558, -76.9364],
    "san juan de miraflores": [-12.1622, -76.9694],
    "sjm": [-12.1622, -76.9694],
    "chorrillos": [-12.1792, -77.0181],
    "lurin": [-12.2744, -76.8617],
    "pachacamac": [-12.2333, -76.8667],
    "punta hermosa": [-12.3333, -76.5167],
    "punta negra": [-12.3667, -76.4333],
    "san bartolo": [-12.3917, -76.7833],
    "santa maria del mar": [-12.4333, -76.7500],
    "pucusana": [-12.4833, -76.7667],

    // Lima Centro y Moderna
    "cercado de lima": [-12.0464, -77.0428],
    "lima": [-12.0464, -77.0428],
    "miraflores": [-12.1214, -77.0298],
    "san isidro": [-12.1092, -77.0322],
    "surco": [-12.1450, -76.9950],
    "santiago de surco": [-12.1450, -76.9950],
    "san borja": [-12.1092, -76.9969],
    "barranco": [-12.1458, -77.0208],
    "surquillo": [-12.1153, -77.0153],
    "lince": [-12.0850, -77.0333],
    "jesus maria": [-12.0733, -77.0489],
    "brena": [-12.0622, -77.0458],
    "pueblo libre": [-12.0772, -77.0633],
    "magdalena del mar": [-12.0936, -77.0697],
    "san miguel": [-12.0781, -77.0914],
    "rimac": [-12.0292, -77.0278],

    // Provincia Constitucional
    "callao": [-12.0566, -77.1181],
    "bellavista": [-12.0617, -77.1083],
    "la perla": [-12.0675, -77.0983],
    "la punta": [-12.0725, -77.1614],
    "carmen de la legua": [-12.0483, -77.0861],
    "ventanilla": [-11.8694, -77.1350],
    "mi peru": [-11.8483, -77.1083]
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