const { ipcMain } = require('electron');
const { getIscritti } = require('./query');

ipcMain.handle('tesserati:get-iscritti', async () => {
  try {
    const data = await getIscritti();
    console.log('[IPC] getIscritti ha restituito:', data);
    return data;
  } catch (err) {
    console.error('[IPC] Errore getIscritti:', err);
    return []; // evita crash nel renderer
  }
});
