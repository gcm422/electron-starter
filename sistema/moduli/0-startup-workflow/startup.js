const connect = require("../../connect");
const fs = require("fs");
const path = require("path");
const { BrowserWindow } = require("electron"); // ✅ aggiunta per inviare segnale errore

(async () => {
  let conn;

  try {
    conn = await connect();

    const moduliPath = path.join(__dirname, "..");
    const moduliAttivi = JSON.parse(fs.readFileSync(path.join(moduliPath, "moduli-attivi.json"), "utf-8"));
    const moduliGestiti = new Set();

    for (const { modulo, sottovoce } of moduliAttivi) {
      if (!modulo || modulo === "0-startup-workflow" || moduliGestiti.has(`${modulo}/${sottovoce || ''}`)) continue;

      const queryPath = sottovoce
        ? path.join(moduliPath, modulo, sottovoce, "query.js")
        : path.join(moduliPath, modulo, "query.js");

      if (fs.existsSync(queryPath)) {
        try {
          const queries = require(queryPath);
          const creaTabelle = Object.entries(queries).filter(([k]) => k.startsWith("creaTabella"));

          for (const [, sql] of creaTabelle) {
            try {
              await conn.execute(sql);
              console.log(`✔ Tabella OK per ${modulo}${sottovoce ? " > " + sottovoce : ""}`);
            } catch (err) {
              console.error(`❌ Errore query in ${modulo}${sottovoce ? " > " + sottovoce : ""}:`, err.message);
            }
          }
        } catch (err) {
          console.warn(`⚠ Errore nel require di ${queryPath}:`, err.message);
        }
      }

      moduliGestiti.add(`${modulo}/${sottovoce || ''}`);
    }

    await conn.end();
  } catch (err) {
    console.error("❌ Errore di connessione al DB:", err.message);

    // ✅ Invio segnale al renderer per mostrare l'overlay
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      win.webContents.send("errore-connessione-db");
    }
  }
})();
