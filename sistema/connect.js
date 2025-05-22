// sistema/connect.js
const mysql = require('mysql2/promise');

async function connect() {
  try {
    const conn = await mysql.createConnection({
      host: '192.168.1.55',
      user: 'acsi',
      password: '1',
      database: 'acsi'
    });
    console.log("✅ Connesso al database MySQL");
    return conn;
  } catch (err) {
    console.error("❌ Errore di connessione al DB:", err.message);
    throw err; // o return null se vuoi gestire così
  }
}

module.exports = connect;
