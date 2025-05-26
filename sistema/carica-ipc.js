const { ipcMain, BrowserWindow } = require('electron'); // ✅ Mancava
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'moduli', 'moduli-attivi.json');
const moduliRoot = path.join(__dirname, 'moduli');
const ipcCaricati = new Set();

try {
  const moduliAttivi = JSON.parse(fs.readFileSync(configPath));

  moduliAttivi.forEach(({ modulo, sottovoce }) => {
    const ipcPath = sottovoce
      ? path.join(moduliRoot, modulo, sottovoce, 'ipc.js')
      : path.join(moduliRoot, modulo, 'ipc.js');

    if (fs.existsSync(ipcPath) && !ipcCaricati.has(ipcPath)) {
      require(ipcPath);
      ipcCaricati.add(ipcPath);
      console.log(`[IPC] Caricato: ${ipcPath}`);
    }
  });
} catch (err) {
  console.error('[IPC] Errore nel caricamento dei moduli attivi:', err);
}

// ✅ Handler IPC globali per controlli finestra
ipcMain.on('window:minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.on('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  }
});

ipcMain.on('window:close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});
ipcMain.handle("ping-db", async () => {
  try {
    const connect = require("./connect"); // path corretto
    const conn = await connect();
    await conn.query("SELECT 1"); // test semplice
    await conn.end();
    return true;
  } catch (err) {
    console.error("Ping fallito:", err.message);
    return false;
  }
});

