module.exports = {
  creaTabellaClassifiche: `
    CREATE TABLE IF NOT EXISTS ej_Classifiche (
      ID_classifica TYNYINT(9) AUTO_INCREMENT PRIMARY KEY,
      ID_RIF_Iscritto TINYINT(9) NULL,
      Ordine_arrivo TINYINT(3) NULL
    );
  `
};
