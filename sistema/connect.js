// sistema/connect.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const os = require('os');
const path = require('path');

const configPath = path.join(os.homedir(), '.config', 'enjoy', 'db.json');

function leggiConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error(`⚠️ File di configurazione DB mancante: ${configPath}`);
  }

  try {
    const raw = fs.readFileSync(configPath);
    const config = JSON.parse(raw);

    const dbConfig = config.database;

    if (!dbConfig || !dbConfig.host) {
      throw new Error(`❌ Configurazione database non trovata o incompleta`);
    }

    return dbConfig;
  } catch (err) {
    throw new Error(`❌ Errore lettura o parsing db.json: ${err.message}`);
  }
}

async function connect() {
  const dbConfig = leggiConfig();

  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log(`✅ Connesso a ${dbConfig.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ Errore di connessione a ${dbConfig.host}:`, err.message);
    throw err;
  }
}

module.exports = connect;
