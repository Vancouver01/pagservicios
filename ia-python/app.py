from fastapi import FastAPI
from pydantic import BaseModel
import re

app = FastAPI(title="SIDPOL AI - Servicio de Procesamiento de Denuncias")

# Definimos la estructura del mensaje que enviará Node/WhatsApp
class MensajeUsuario(BaseModel):
    texto: str

# Diccionario de palabras clave extendido según el árbol de decisiones del informe
DICCIONARIO_DELITOS = {
    "Robo Agravado": ["pistola", "arma", "cuchillo", "fierro", "amenazo", "balazo", "asalto", "cuello"],
    "Robo al paso": ["celular", "cartera", "arrebato", "corriendo", "bolsillo", "mochila", "raqueteo"],
    "Extorsión / Coacción": ["cupo", "amenaza", "llamada", "mensaje", "plata", "dinero", "cobrar", "bomba", "granada"],
    "Hurto simple": ["descuidé", "perdí", "llevaron", "no estaba", "robaron mi carro", "tienda"]
}

DICCIONARIOS_DISTRITOS = ["los olivos", "san juan de lurigancho", "sjl", "callao", "miraflores", "surco", "comas", "chorrillos", "la victoria"]

@app.post("/analizar-denuncia")
def analizar_denuncia(data: MensajeUsuario):
    texto_limpio = data.texto.lower()
    
    # 1. Análisis de Delito Dinámico
    delito_detectado = "Pendiente de Clasificación"
    urgencia = "BAJA"
    
    for delito, palabras_clave in DICCIONARIO_DELITOS.items():
        if any(re.search(rf"\b{palabra}\b", texto_limpio) for palabra in palabras_clave):
            delito_detectado = delito
            break
            
    # 2. Análisis Dinámico de Severidad / Urgencia
    # Si incluye armas, violencia o extorsión, la IA eleva automáticamente el estado a ALTA
    if delito_detectado in ["Robo Agravado", "Extorsión / Coacción"] or any(w in texto_limpio for w in ["sangre", "herido", "golpe", "pego", "disparo"]):
        urgencia = "ALTA"
    elif any(w in texto_limpio for w in ["sospechoso", "merodeando", "discusión"]):
        urgencia = "MEDIA"

    # 3. Extracción Dinámica de la Jurisdicción (Distrito)
    distrito_detectado = "No Identificado"
    for distrito in DICCIONARIOS_DISTRITOS:
        if distrito in texto_limpio:
            distrito_detectado = distrito.upper() if distrito != "sjl" else "SAN JUAN DE LURIGANCHO"
            break

    # Responder los metadatos estructurados al backend transaccional
    return {
        "delito_clasificado": delito_detectado,
        "distrito": distrito_detectado,
        "urgencia": urgencia,
        "analisis_ia": f"NLP procesado con éxito. Delito: {delito_detectado} detectado en {distrito_detectado}."
    }

if __name__ == "__main__":
    import uvicorn
    # Correrá en el puerto 8000 para no chocar con tu Node (3000/5000)
    uvicorn.run(app, host="127.0.0.1", port=8000)