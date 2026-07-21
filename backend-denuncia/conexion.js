import mysql from 'mysql2';

// Detectar cualquier variable de conexión de Railway
const connectionString = 
  process.env.MYSQLURL || 
  process.env.MYSQL_URL || 
  process.env.DATABASE_URL;

// Pool de conexiones adaptado a producción / local
const pool = mysql.createPool(
  connectionString ? connectionString : {
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

// Prueba silenciosa de conexión para depuración
const db = pool.promise();

db.getConnection()
  .then((conn) => {
    console.log('✅ Conexión exitosa a la base de datos MySQL.');
    conn.release();
  })
  .catch((err) => {
    console.error('⚠️ Error al conectar con MySQL:', err.message);
  });

export default db;