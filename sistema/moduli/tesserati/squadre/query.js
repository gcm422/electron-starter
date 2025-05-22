module.exports = {
  creaTabellaSquadre: `
    CREATE TABLE IF NOT EXISTS ej_Squadre (
      ID_squadra TINYINT(9) AUTO_INCREMENT PRIMARY KEY,
      Nome_squadra TEXT NULL,
      Sigla_squadra TEXT NULL,
      Codice_squadra TEXT NULL
    );
  `
};
