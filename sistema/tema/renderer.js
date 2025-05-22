const { contextBridge, ipcRenderer } = require('electron');
// sistema/tema/preload.js
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer
});


contextBridge.exposeInMainWorld('windowAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close')
});
