import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// 🗄️ CONFIGURACIÓN DE LA BASE DE DATOS (POOL)
// ==========================================
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'lolcrackk007', // Tu clave de MySQL local
  database: 'sidpol_ia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = pool.promise();


// ==========================================
// 📡 ENDPOINTS DEL CRUD TRANSACCIONAL (Para el Mapa y la Tabla)
// ==========================================

// 1. GET: Obtener todas las denuncias reales de MySQL
app.get('/api/denuncias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM denuncias ORDER BY fecha_registro DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al leer de MySQL:', error);
    res.status(500).json({ error: 'Fallo en la Capa de Persistencia al leer datos.' });
  }
});

// 2. POST: Insertar un expediente analizado en la Base de Datos Real
app.post('/api/denuncias', async (req, res) => {
  const { id_expediente, dni, delito, distrito, urgencia, latitud, longitud, hash } = req.body;
  
  try {
    // Inserción o validación rápida del usuario civil afectado
    await db.query(
      'INSERT INTO usuarios (dni, nombre_completo, rol, clave_cifrada) VALUES (?, ?, "CIUDADANO", NULL) ON DUPLICATE KEY UPDATE dni=dni',
      [dni || '72145632', 'JEAN POOL JAMARILLO QUISPE']
    );

    // Inserción real en la tabla denuncias
    await db.query(
      'INSERT INTO denuncias (id_expediente, dni_ciudadano, delito_clasificado, distrito, urgencia, latitud, longitud, firma_sha256) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id_expediente, dni || '72145632', delito, distrito, urgencia, latitud, longitud, hash]
    );

    res.status(201).json({ mensaje: 'Expediente sincronizado con SIDPOL de manera exitosa.' });
  } catch (error) {
    console.error('Error al insertar en MySQL:', error);
    res.status(500).json({ error: 'Error al insertar registro en la Base de Datos.' });
  }
});

// 3. PUT: Actualizar estado de despacho (Operación del operador PNP)
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

// 4. DELETE: Eliminar físicamente el registro de la BD
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
app.post('/api/ia/analizar', (req, res) => {
  const { relato } = req.body;
  
  if (!relato) {
    return res.status(400).json({ error: 'El relato es obligatorio' });
  }

  const texto = relato.toLowerCase();
  
  let tipo = 'Incidente General';
  let urgencia = 'BAJA';
  let zona = 'Cercado de Lima';
  let recomendacion = 'Se deriva al cuadrante local para patrullaje integrado preventivo.';

  if (texto.includes('robo') || texto.includes('celular') || texto.includes('arrebato')) {
    tipo = 'Robo al paso';
    urgencia = 'MEDIA';
    recomendacion = 'Notificar a serenazgo del sector y registrar pérdidas de propiedad.';
  }
  if (texto.includes('arma') || texto.includes('pistola') || texto.includes('cuchillo') || texto.includes('amenazo')) {
    tipo = 'Robo agravado';
    urgencia = 'ALTA';
    recomendacion = 'ALERTA CRÍTICA: Derivar de inmediato a la DIVPOL más cercana para despacho de unidades de emergencia.';
  }
  if (texto.includes('extorsion') || texto.includes('cupo') || texto.includes('amenazan')) {
    tipo = 'Extorsión / Coacción';
    urgencia = 'ALTA';
    recomendacion = 'Derivar de forma confidencial a la DIRINCRI (División de Secuestros y Extorsiones).';
  }

  if (texto.includes('miraflores')) zona = 'Miraflores';
  else if (texto.includes('olivos') || texto.includes('los olivos')) zona = 'Los Olivos';
  else if (texto.includes('surco') || texto.includes('santiago de surco')) zona = 'Santiago de Surco';
  else if (texto.includes('sjl') || texto.includes('san juan')) zona = 'San Juan de Lurigancho';

  const coincidencia = Math.floor(Math.random() * (96 - 78) + 78);

  res.json({
    tipo,
    urgencia,
    zona,
    coincidencia,
    recomendacion
  });
});


// Encender el servidor en el puerto 5000
app.listen(PORT, () => {
  console.log(`🚀 Servidor de DenunciaSegura corriendo en http://localhost:${PORT}`);
});

// Arranca el bot de WhatsApp junto al servidor Node
// import './whatsappBot.js';