
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  database: process.env.DB_NAME || 'vet_punto_venta',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkConnection() {
  try {
    const conn = await pool.getConnection();
    console.log(' Conexión a MySQL exitosa.');
    conn.release();
  } catch (err) {
    console.error(' Error conectando MySQL:', err.message);
  }
}

checkConnection();

module.exports = pool;
