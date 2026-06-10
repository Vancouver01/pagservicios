const db = require('../database/conexion');

// READ: Obtener todas las denuncias con coordenadas para el Mapa y Estadísticas
const obtenerTodas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM denuncias ORDER BY fecha_registro DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Fallo en la Capa de Persistencia al leer datos.' });
  }
};

// CREATE: Insertar el análisis estructurado por la IA
const registrarDenuncia = async (req, res) => {
  const { id_expediente, dni, delito, distrito, urgencia, latitud, longitud, hash } = req.body;
  try {
    await db.query(
      'INSERT INTO denuncias (id_expediente, dni_ciudadano, delito_clasificado, distrito, urgencia, latitud, longitud, firma_sha256) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id_expediente, dni, delito, distrito, urgencia, latitud, longitud, hash]
    );
    res.status(201).json({ mensaje: 'Expediente sincronizado con SIDPOL de manera exitosa.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar registro en la Base de Datos.' });
  }
};

// UPDATE: Modificación operativa por la PNP
const actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado_despacho, delito_clasificado, distrito } = req.body;
  try {
    await db.query(
      'UPDATE denuncias SET estado_despacho = ?, delito_clasificado = ?, distrito = ? WHERE id_expediente = ?',
      [estado_despacho, delito_clasificado, distrito, id]
    );
    res.json({ mensaje: 'Registro actualizado en la base de datos relacional.' });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al actualizar el expediente.' });
  }
};

// DELETE: Eliminación física / lógica
const eliminarDenuncia = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM denuncias WHERE id_expediente = ?', [id]);
    res.json({ mensaje: 'Expediente purgado de los repositorios del Estado.' });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al eliminar el registro.' });
  }
};

module.exports = { obtenerTodas, registrarDenuncia, actualizarEstado, eliminarDenuncia };