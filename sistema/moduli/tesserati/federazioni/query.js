module.exports = {
  creaTabellaFederazioni: `
    CREATE TABLE IF NOT EXISTS ej_Federazioni (
      ID_Federazione TINYINT(9) AUTO_INCREMENT PRIMARY KEY,
      Nome_federazione TEXT NULL,
      Sigla_federazione TEXT NULL
    );
  `
};
