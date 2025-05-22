window.caricaModulo = async function (modulo, sottovoce = null) {
  const output = document.getElementById('output');
  const pathModulo = `./sistema/moduli/${modulo}${sottovoce ? '/' + sottovoce : ''}`;

  console.log(`[caricaModulo] Richiesto: modulo = "${modulo}", sottovoce = "${sottovoce}"`);
  console.log(`[caricaModulo] Carico JS: ${pathModulo}/frontend.js`);

  try {
    if (modulo !== 'menu') {
      console.log(`[caricaModulo] Carico HTML: ${pathModulo}/frontend.html`);
      const html = await fetch(`${pathModulo}/frontend.html`).then(r => r.text());
      output.innerHTML = html;
    }

    const script = document.createElement('script');
    script.src = `${pathModulo}/frontend.js`;
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
  const output = document.getElementById('output');
  if (!output) {
    console.error("[Frontend] Errore: #output non trovato nel DOM.");
    return;
  }

  let config = [];
  try {
    config = await fetch('./sistema/moduli/moduli-attivi.json').then(r => r.json());
    window.configModuli = config; // ✅ ora è accessibile da altri moduli
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
});

if (titlebar) {
  titlebar.addEventListener('dblclick', () => {
    window.windowAPI.maximize(); // ⬅️ alterna maximize/unmaximize
  });
}
