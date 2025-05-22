module.exports = {
  creaTabellaCategorie: `
    CREATE TABLE IF NOT EXISTS ej_Categorie (
      ID_categoria TINYINT(9) AUTO_INCREMENT PRIMARY KEY,
      Nome_categoria TEXT NULL,
      Sigla_categoria TEXT NULL
    );
  `,
  creaTabellaSerie: `
    CREATE TABLE IF NOT EXISTS ej_Serie (
      ID_serie TINYINT(9) AUTO_INCREMENT PRIMARY KEY,
      Nome_serie TEXT NULL,
      ID_RIF_categoria TINYINT(9)
    );
  `
};
