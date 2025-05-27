module.exports = {
  creaTabellaHeartbeat: `
    CREATE TABLE IF NOT EXISTS ej_heartbeat (
      id VARCHAR(64) PRIMARY KEY,
      nome_postazione TEXT,
      last_ping DATETIME
    );
  `,

  creaTabellaLogs: `
    CREATE TABLE IF NOT EXISTS ej_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      modulo TEXT,
      azione TEXT,
      descrizione TEXT
    );
  `
};
