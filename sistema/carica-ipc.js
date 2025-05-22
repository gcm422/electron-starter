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
