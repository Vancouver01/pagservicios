const mysql = require('mysql2');

// Pool de conexiones orientado a alta disponibilidad
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'lolcrackk007',
  database: 'sidpol_ia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();