module.exports = {
  creaTabellaEventi: `
    CREATE TABLE IF NOT EXISTS ej_Eventi (
      ID_evento TINYINT(9) AUTO_INCREMENT PRIMARY KEY,
      Data_evento DATE NULL,
      Luogo_evento TEXT NULL
    );
  `,
  creaTabellaGare: `
    CREATE TABLE IF NOT EXISTS ej_Gare (
      ID_gara TINYINT(9) AUTO_INCREMENT PRIMARY KEY,
      ID_RIF_evento TINYINT(9),
      Nome_gara TEXT NULL,
      Orario_gara TIME NULL
    );
  `
};
