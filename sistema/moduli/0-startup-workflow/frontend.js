window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const messaggio = document.getElementById('splash-status');

  const frasi = [
    "Avvio delle strutture applicative",
    "Avvio del database",
    "Allineamento dei dati",
    "Calcolo delle metriche fondamentali",
    "Connessione al database ACSI",
    "Preparazione delle interfacce",
    "Caricamento dell'interfaccia"
  ];

  let indice = 0;

  function mostraProssimoMessaggio() {
    if (indice < frasi.length) {
      messaggio.textContent = frasi[indice];
      indice++;
      setTimeout(mostraProssimoMessaggio, 1000); // 1 secondo tra i messaggi
    }
  }

  mostraProssimoMessaggio();

  setTimeout(() => {
    splash.style.display = 'none';

    const menu = window.configModuli?.find(e => e.modulo === 'menu');
    const dash = window.configModuli?.find(e => e.modulo === 'dashboard');

    if (menu) window.caricaModulo(menu.modulo, menu.sottovoce);
    if (dash) window.caricaModulo(dash.modulo, dash.sottovoce);
  }, 7000); // 7 secondi totali
});
