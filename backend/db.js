const { Pool } = require('pg');

const PORT = process.env.DB_PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('DB connection failed, retrying...', err.message);
    setTimeout(testConnection, 5000);
  }
}

testConnection();

module.exports = pool;