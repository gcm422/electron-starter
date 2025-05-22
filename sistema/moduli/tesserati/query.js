module.exports = {
  creaTabellaTesserati: `
    CREATE TABLE IF NOT EXISTS ej_Tesserati (
      ID_tesserato INT AUTO_INCREMENT PRIMARY KEY,
      ID_RIF_Squadra TINYINT(9) NULL,
      ID_RIF_Categoria TINYINT(9) NULL,
      ID_RIF_Serie TINYINT(9) NULL,
      Nome TEXT NULL,
      Cognome TEXT NULL,
      Data_di_nascita DATE NULL,
      Codice_tessera TEXT NULL
    );
  `
};
