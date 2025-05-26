window.caricaModulo = async function (modulo, sottovoce = null) {
  const output = document.getElementById('output');
  const pathModulo = `./sistema/moduli/${modulo}${sottovoce ? '/' + sottovoce : ''}`;
  const jsBase = `${pathModulo}/frontend.js`;

  console.log(`[caricaModulo] Richiesto: modulo = "${modulo}", sottovoce = "${sottovoce}"`);
  console.log(`[caricaModulo] Carico JS: ${jsBase}`);

  try {
    if (modulo !== 'menu') {
      console.log(`[caricaModulo] Carico HTML: ${pathModulo}/frontend.html`);
      const html = await fetch(`${pathModulo}/frontend.html`).then(r => r.text());
      output.innerHTML = html;
    }

    const scriptEsistente = document.querySelector(`script[src^="${jsBase}"]`);
    if (scriptEsistente) scriptEsistente.remove();

    const script = document.createElement('script');
    script.src = `${jsBase}?cb=${Date.now()}`;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    console.log(`[Frontend] Caricato modulo: ${modulo} ${sottovoce || ''}`);
  } catch (e) {
    if (modulo !== 'menu') {
      output.innerHTML = `<p style="color:red;">Errore nel caricamento del modulo <strong>${modulo}${sottovoce ? '/' + sottovoce : ''}</strong>.</p>`;
    }
    console.error('[Frontend] Errore:', e);
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  const overlay = document.getElementById('overlay-errore-db');
  const btnModifica = document.getElementById('modifica-db-btn');

  // 🔁 Mostra overlay se segnale da startup/main
  window.electron.ipcRenderer.on("errore-connessione-db", () => {
    if (overlay) overlay.style.display = "flex";
  });

btnModifica.addEventListener('click', () => {
  window._overlayInSospeso = true; // ✅ disattiva overlay temporaneamente
  overlay.style.display = 'none';  // ✅ nascondilo
  window.caricaModulo('impostazioni', 'database');
});


  // 🔁 PING PERIODICO (ogni 10s)
  async function avviaMonitorDB() {
    const check = async () => {
      try {
        const ok = await window.electron.ipcRenderer.invoke("ping-db");
if (ok) {
  // ✅ Connessione OK → chiudi overlay e resetta sospensione
  if (overlay && overlay.style.display !== "none") {
    overlay.style.display = "none";
  }
  window._overlayInSospeso = false;
} else {
  // ❌ Connessione NON OK
  if (!window._overlayInSospeso && overlay && overlay.style.display === "none") {
    overlay.style.display = "flex";
  }
}
  } catch (err) {
        console.warn("Ping fallito:", err.message);
      }
    };

    await check(); // subito all'avvio
    setInterval(check, 10000); // ogni 10 secondi
  }

  await avviaMonitorDB(); // avvia subito
});

window.addEventListener('DOMContentLoaded', async () => {
  const output = document.getElementById('output');
  if (!output) {
    console.error("[Frontend] Errore: #output non trovato nel DOM.");
    return;
  }

  let config = [];
  try {
    config = await fetch('./sistema/moduli/moduli-attivi.json').then(r => r.json());
    window.configModuli = config;
    console.log(`[Frontend] Caricato moduli-attivi.json con ${config.length} voci`);
  } catch (e) {
    output.innerHTML = `<p style="color:red;">Errore nel caricamento della configurazione moduli.</p>`;
    console.error('[Frontend] Errore nel caricamento moduli-attivi.json:', e);
    return;
  }

  const menuMod = config.find(e => e.modulo === 'menu' && (e.sottovoce === null || e.sottovoce === undefined));
  if (menuMod) {
    console.log('[Frontend] Carico modulo menu');
    caricaModulo(menuMod.modulo, menuMod.sottovoce);
  }

  const dashboard = config.find(e => e.modulo === 'dashboard' && (e.sottovoce === null || e.sottovoce === undefined));
  if (dashboard) {
    console.log('[Frontend] Carico dashboard iniziale');
    caricaModulo(dashboard.modulo, dashboard.sottovoce);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const minBtn = document.getElementById('min-btn');
  const maxBtn = document.getElementById('max-btn');
  const closeBtn = document.getElementById('close-btn');
  const titlebar = document.getElementById('custom-titlebar');

  if (minBtn) minBtn.addEventListener('click', () => window.windowAPI.minimize());
  if (maxBtn) maxBtn.addEventListener('click', () => window.windowAPI.maximize());
  if (closeBtn) closeBtn.addEventListener('click', () => window.windowAPI.close());

  if (titlebar) {
    titlebar.addEventListener('dblclick', () => {
      window.windowAPI.maximize();
    });
  }
});
