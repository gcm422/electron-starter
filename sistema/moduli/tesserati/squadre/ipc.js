const { ipcMain } = require('electron');
const connect = require('../../../connect'); // adattalo se usi altro percorso

// Recupera tutte le squadre
ipcMain.handle('squadre:getAll', async () => {
  const conn = await connect();
  const [rows] = await conn.execute('SELECT * FROM ej_Squadre ORDER BY Nome_squadra ASC');
  await conn.end();
  return rows;
});

// Inserisce una nuova squadra
ipcMain.handle('squadre:insert', async (event, squadra) => {
  const conn = await connect();
  const { Nome_squadra, Sigla_squadra, Codice_squadra } = squadra;
  const [result] = await conn.execute(
    `INSERT INTO ej_Squadre (Nome_squadra, Sigla_squadra, Codice_squadra)
     VALUES (?, ?, ?)`,
    [Nome_squadra, Sigla_squadra, Codice_squadra]
  );
  await conn.end();
  return result.insertId;
});

// Aggiorna una squadra esistente
ipcMain.handle('squadre:update', async (event, squadra) => {
  const conn = await connect();
  const { ID_squadra, Nome_squadra, Sigla_squadra, Codice_squadra } = squadra;
  await conn.execute(
    `UPDATE ej_Squadre
     SET Nome_squadra = ?, Sigla_squadra = ?, Codice_squadra = ?
     WHERE ID_squadra = ?`,
    [Nome_squadra, Sigla_squadra, Codice_squadra, ID_squadra]
  );
  await conn.end();
  return true;
});

// Elimina una squadra
ipcMain.handle('squadre:delete', async (event, ID_squadra) => {
  const conn = await connect();
  await conn.execute('DELETE FROM ej_Squadre WHERE ID_squadra = ?', [ID_squadra]);
  await conn.end();
  return true;
});
