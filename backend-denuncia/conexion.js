const mysql = require('mysql2');

// Pool de conexiones orientado a alta disponibilidad
const pool = mysql.createPool(
  process.env.MYSQL_URL || process.env.DATABASE_URL || {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'lolcrackk007',
    database: process.env.MYSQLDATABASE || 'sidpol_ia_db',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

export default pool.promise();