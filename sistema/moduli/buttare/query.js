const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: '192.168.1.55',
  user: 'acsi',
  password: '1',
  database: 'acsi'
});

conn.connect(err => {
  if (err) {
    console.error('[MySQL] Connessione fallita:', err);
  } else {
    console.log('[MySQL] Connessione riuscita.');
  }
});

async function getIscritti() {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM iscritti', (err, results) => {
      if (err) {
        console.error('[Query] Errore MySQL:', err);
        reject(err);
      } else {
        console.log('[Query] Risultati ottenuti:', results);
        resolve(results);
      }
    });
  });
}

module.exports = { getIscritti };
