module.exports = {
  creaTabellaImpostaGara: `
    CREATE TABLE IF NOT EXISTS ej_IscrittiGara (
      ID_iscritto TINYINT(9) AUTO_INCREMENT PRIMARY KEY,
      ID_RIF_Tesserato TINYINT(9) NULL,
      ID_RIF_Gara TINYINT(9) NULL,
      Numero_maglia TINYINT(3) NULL
    );
  `
};
