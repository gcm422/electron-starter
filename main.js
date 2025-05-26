/*const { app, BrowserWindow } = require('electron');
const path = require('path');

// Carica gli handler IPC delle macroaree
require('./sistema/carica-ipc');
require('./sistema/moduli/0-startup-workflow/startup.js'); //controlla la persistenza delle tabelle in database


function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 1024,
    autoHideMenuBar: true,
      frame: false,
transparent: true,
hasShadow: true,
    icon: path.join(__dirname, 'sistema/tema/favicon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'sistema/tema/renderer.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('main.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});



*/

const { app, BrowserWindow } = require('electron');
const path = require('path');

let win = null; // 🔓 rendiamo visibile globalmente

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 1024,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    hasShadow: true,
    icon: path.join(__dirname, 'sistema/tema/favicon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'sistema/tema/renderer.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('main.html');
}

// 📦 esporto la finestra per altri moduli (es: startup.js)
module.exports = { getWindow: () => win };

app.whenReady().then(() => {
  createWindow();

  // Carica gli handler IPC delle macroaree DOPO che la finestra è pronta
  require('./sistema/carica-ipc');

  // Carica il modulo che verifica tabelle e connessione
  require('./sistema/moduli/0-startup-workflow/startup.js');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
