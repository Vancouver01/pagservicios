import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
// Importamos la conexión optimizada desde conexion.js
import db from './conexion.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Inicialización de la API Core con soporte nativo de Google AI Studio
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ==========================================
// 📡 RUTA RAÍZ (HEALTH CHECK)
// ==========================================
app.get('/', (req, res) => {
  res.json({
    mensaje: '🚀 Backend de DenunciaSegura / SIDPOL está activo.',
    estado: 'Online'
  });
});

// ==========================================
// 📡 ENDPOINTS DEL CRUD TRANSACCIONAL
// ==========================================

// 1. GET: Retorna los expedientes
app.get('/api/denuncias', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id_expediente,
        dni_ciudadano,
        fecha_registro,
        delito_clasificado, 
        delito_clasificado AS tipo,
        distrito,
        distrito AS zona,
        urgencia,
        estado_despacho,
        coincidencia,
        recomendacion,
        latitud,
        longitud,
        firma_sha256
      FROM denuncias 
      ORDER BY fecha_registro DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al leer de MySQL:', error);
    res.status(500).json({ error: 'Fallo en la Capa de Persistencia al leer datos.' });
  }
});

// 2. POST: Inserción atómica relacional
app.post('/api/denuncias', async (req, res) => {
  const { id_expediente, dni, delito, distrito, urgencia, latitud, longitud, hash, coincidencia, recomendacion } = req.body;
  
  try {
    // 1. Asegurar usuario por defecto
    await db.query(
      'INSERT INTO usuarios (dni, nombre_completo, rol, clave_cifrada) VALUES (?, ?, "CIUDADANO", NULL) ON DUPLICATE KEY UPDATE dni=dni',
      [dni || '72145632', 'JEAN POOL JAMARILLO QUISPE']
    );

    // 2. Blindaje de variables obligatorias
    const delitoFinal = delito || 'Delito Genérico / Hurto';
    const distritoFinal = distrito || 'LIMA';
    const urgenciaFinal = urgencia || 'MEDIA';
    const coincidenciaFinal = coincidencia !== undefined && coincidencia !== null ? coincidencia : 50;
    const recomendacionFinal = recomendacion || 'Sin recomendación registrada.';
    const idExpedienteFinal = id_expediente || `EP-${Math.floor(100000 + Math.random() * 900000)}`;
    const dniFinal = dni || '72145632';
    const hashFinal = hash || 'sha256_default_' + Math.random().toString(36).substring(2, 7);

    // 3. Asignación automática de coordenadas
    let latFinal = latitud ? parseFloat(latitud) : null;
    let lonFinal = longitud ? parseFloat(longitud) : null;
    
    if (!latFinal || !lonFinal || isNaN(latFinal) || isNaN(lonFinal)) {
      const d = distritoFinal.toLowerCase();
      if (d.includes("san juan de lurigancho") || d.includes("sjl")) {
        latFinal = -11.9639; lonFinal = -76.9964;
      } else if (d.includes("miraflores")) {
        latFinal = -12.1214; lonFinal = -77.0298;
      } else if (d.includes("olivos")) {
        latFinal = -11.9922; lonFinal = -77.0675;
      } else if (d.includes("comas")) {
        latFinal = -11.9333; lonFinal = -77.0500;
      } else if (d.includes("surco")) {
        latFinal = -12.1450; lonFinal = -76.9950;
      } else {
        latFinal = -12.0464; lonFinal = -77.0428;
      }
    }

    // 4. Inserción en MySQL
    await db.query(
      `INSERT INTO denuncias 
       (id_expediente, dni_ciudadano, delito_clasificado, distrito, urgencia, coincidencia, recomendacion, latitud, longitud, firma_sha256) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idExpedienteFinal, 
        dniFinal, 
        delitoFinal, 
        distritoFinal, 
        urgenciaFinal, 
        coincidenciaFinal, 
        recomendacionFinal, 
        latFinal, 
        lonFinal, 
        hashFinal
      ]
    );

    res.status(201).json({ mensaje: 'Expediente sincronizado con SIDPOL de manera exitosa.' });
  } catch (error) {
    console.error('❌ Error crítico al insertar en MySQL:', error.message);
    res.status(500).json({ error: 'Error MySQL: ' + error.message });
  }
});

// 3. PUT: Actualización de estados PNP
app.put('/api/denuncias/:id', async (req, res) => {
  const { id } = req.params;
  const { estado_despacho, delito_clasificado, distrito } = req.body;
  try {
    await db.query(
      'UPDATE denuncias SET estado_despacho = ?, delito_clasificado = ?, distrito = ? WHERE id_expediente = ?',
      [estado_despacho, delito_clasificado, distrito, id]
    );
    res.json({ mensaje: 'Registro actualizado en la base de datos relacional.' });
  } catch (error) {
    console.error('Error al actualizar en MySQL:', error);
    res.status(500).json({ error: 'Fallo al actualizar el expediente.' });
  }
});

// 4. DELETE: Purgado de registro
app.delete('/api/denuncias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM denuncias WHERE id_expediente = ?', [id]);
    res.json({ mensaje: 'Expediente purgado de los repositorios de MySQL.' });
  } catch (error) {
    console.error('Error al eliminar de MySQL:', error);
    res.status(500).json({ error: 'Fallo al eliminar el registro.' });
  }
});

// ==========================================
// 🤖 ENDPOINT DE LA CAPA DE INTEGRACIÓN DE IA
// ==========================================
app.post('/api/ia/analizar', async (req, res) => {
  const { relato } = req.body;
  
  if (!relato) {
    return res.status(400).json({ error: 'El relato es obligatorio' });
  }

  try {
    const responseSchema = {
      type: "object",
      properties: {
        es_denuncia_valida: { 
          type: "boolean", 
          description: "true si contiene un relato de un hecho delictivo, sospechoso, fraude o emergencia. false si es solo un saludo o charla casual." 
        },
        tipo: { type: "string", description: "Tipo de delito según el código penal peruano. Si es_denuncia_valida es false, poner 'Ninguno'." },
        urgencia: { type: "string", description: "Gravedad (ALTA, MEDIA o BAJA). Si es_denuncia_valida es false, usar 'BAJA'." },
        zona: { type: "string", description: "Nombre del distrito de Lima detectado en MAYÚSCULAS. Si es false, usar 'No especificado'." },
        coincidencia: { type: "integer", description: "Porcentaje de confianza del 78 al 99. Si es false, usar 0." },
        recomendacion: { type: "string", description: "Si es_denuncia_valida es true, da la recomendación u orden policial táctica detallada y empática de qué hacer. Si es false, saluda amablemente y pide que describa su caso." }
      },
      required: ["es_denuncia_valida", "tipo", "urgencia", "zona", "coincidencia", "recomendacion"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analiza minuciosamente el siguiente texto del ciudadano peruano e infiere las variables estructurales: "${relato}"`,
      config: {
        systemInstruction: `Eres un clasificador criminalístico experto adjunto al MININTER y un asistente de la PNP. 
        Tu labor es analizar reportes en lenguaje natural. Si el usuario solo saluda (ej. 'hola', 'buenas', 'que tal'), pon es_denuncia_valida en false. 
        Si describe un robo, asalto o fraude, pon es_denuncia_valida en true y realiza el triaje semántico estricto conforme a los campos del responseSchema.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (response && response.text) {
      const resultadoIa = JSON.parse(response.text);
      return res.json(resultadoIa);
    } else {
      throw new Error("La respuesta del modelo de IA vino vacía.");
    }

  } catch (error) {
    console.error('⚠️ [Backend Fallback Activado]:', error.message);
    
    return res.json({
      es_denuncia_valida: false,
      tipo: 'Ninguno',
      urgencia: 'BAJA',
      zona: 'No especificado',
      coincidencia: 0,
      recomendacion: '¡Hola! Bienvenido a la Central Digital de Atención SIDPOL. Por favor, relátame a detalle los hechos de tu caso para iniciar tu triaje automatizado.'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de DenunciaSegura corriendo en el puerto ${PORT}`);
});