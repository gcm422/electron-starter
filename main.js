const { app, BrowserWindow } = require('electron');
const path = require('path');

// Carica gli handler IPC delle macroaree
require('./sistema/carica-ipc');


function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 1024,
    autoHideMenuBar: true,
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

