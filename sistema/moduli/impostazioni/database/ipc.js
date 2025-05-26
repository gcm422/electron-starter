const { ipcMain } = require("electron");
const fs = require("fs");
const os = require("os");
const path = require("path");
const mysql = require("mysql2/promise");

const configPath = path.join(os.homedir(), ".config", "enjoy", "db.json");

function salvaConfigCompleto(config) {
  fs.writeFileSync(configPath, JSON.stringify({
    database: config.database,
    mirror: config.mirror
  }, null, 2));
}

function leggiConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error("❌ File di configurazione DB mancante.");
  }

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);

    if (!config.database || !config.database.host) {
      throw new Error("❌ Configurazione database non valida.");
    }

    return config;
  } catch (err) {
    throw new Error("❌ Errore lettura o parsing db.json: " + err.message);
  }
}

ipcMain.handle("config-db:leggi", () => {
  return leggiConfig();
});

ipcMain.handle("config-db:salva-e-allinea", async (event, nuovoConfig) => {
  salvaConfigCompleto(nuovoConfig);

  const db = nuovoConfig.database;
  const mirror = nuovoConfig.mirror;

  // Se mirror non valido o uguale a database → nessuna sincronizzazione
  if (!mirror.host || mirror.host === db.host) {
    return "💾 Configurazione salvata. Mirror non valido o coincidente: nessun allineamento eseguito.";
  }

  try {
    const connSource = await mysql.createConnection(db);
    const connMirror = await mysql.createConnection(mirror);

    const [righe] = await connSource.query(`SHOW TABLES`);
    const campoTabella = Object.keys(righe[0])[0];
    const nomiTabelle = righe.map(r => r[campoTabella]);

    const tabelleDaCopiare = nomiTabelle.filter(
      nome => !["ej_heartbeat", "ej_logs"].includes(nome)
    );

    for (const tabella of tabelleDaCopiare) {
      console.log(`[Mirror] Allineo tabella: ${tabella}`);

      await connMirror.query(`DROP TABLE IF EXISTS \`${tabella}\``);
      await connMirror.query(`CREATE TABLE \`${tabella}\` LIKE \`${tabella}\``);
      await connMirror.query(`INSERT INTO \`${tabella}\` SELECT * FROM \`${tabella}\``);
    }

    await connSource.end();
    await connMirror.end();

    return `✅ Configurazione salvata. Mirror allineato con ${tabelleDaCopiare.length} tabelle.`;

  } catch (err) {
    console.error("❌ Errore durante l'allineamento:", err);
    throw new Error("Errore durante la copia nel mirror: " + err.message);
  }
});
ipcMain.handle("config-db:test-connessione", async () => {
  try {
    const config = leggiConfig();
    const conn = await mysql.createConnection(config.database);
    await conn.end();
    return true;
  } catch {
    return false;
  }
});
