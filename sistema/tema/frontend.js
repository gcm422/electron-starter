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

  window.electron.ipcRenderer.on("errore-connessione-db", () => {
    if (overlay) overlay.style.display = "flex";
  });

  btnModifica.addEventListener('click', () => {
    window._overlayInSospeso = true;
    overlay.style.display = 'none';
    window.caricaModulo('impostazioni', 'database');
  });

  async function avviaMonitorDB() {
    let consecutiviFalliti = 0;

    const check = async () => {
      try {
        const ok = await window.electron.ipcRenderer.invoke("ping-db");

        if (ok) {
          consecutiviFalliti = 0;
          if (overlay && overlay.style.display !== "none") {
            overlay.style.display = "none";
          }
          window._overlayInSospeso = false;
        } else {
          consecutiviFalliti++;
          if (consecutiviFalliti >= 1) {
            if (overlay && overlay.style.display === "none") {
              overlay.style.display = "flex";
            }
            window._overlayInSospeso = false;
          }
        }
      } catch (err) {
        console.warn("Ping fallito:", err.message);
      }
    };

    await check();
    setInterval(check, 10000);
  }

  await avviaMonitorDB();
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

  // ✅ Caricamento della splash screen se esiste
  const splash = config.find(e => e.modulo === '0-startup-workflow');
  if (splash) {
    console.log('[Frontend] Carico splash screen iniziale');
    caricaModulo(splash.modulo, splash.sottovoce);
  } else {
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
