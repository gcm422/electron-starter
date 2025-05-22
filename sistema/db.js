const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: '192.168.1.55',
  user: 'acsi',
  password: '1',
  database: 'acsi'
});

connection.connect(err => {
  if (err) {
    console.error('Errore di connessione al DB:', err);
    return;
  }
  console.log('Connesso al database MySQL');
});

module.exports = connection;
