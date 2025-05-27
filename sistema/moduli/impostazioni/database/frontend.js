(() => {
  const ipc = window.electron.ipcRenderer;
  const form = document.getElementById("form-config-db");

  async function caricaConfig() {
    try {
      const config = await ipc.invoke("config-db:leggi");

      if (!config) {
        alert("❌ Impossibile leggere la configurazione");
        return;
      }

      form.database_host.value = config.database.host;
      form.database_user.value = config.database.user;
      form.database_password.value = config.database.password;
      form.database_database.value = config.database.database;

      form.mirror_host.value = config.mirror.host;
      form.mirror_user.value = config.mirror.user;
      form.mirror_password.value = config.mirror.password;
      form.mirror_database.value = config.mirror.database;
    } catch (err) {
      alert("❌ Errore caricamento configurazione: " + err.message);
      console.error("Errore in caricaConfig:", err);
    }
  }
form.addEventListener("submit", async e => {
  e.preventDefault();

  const nuovoConfig = {
    database: {
      host: form.database_host.value.trim(),
      user: form.database_user.value.trim(),
      password: form.database_password.value,
      database: form.database_database.value.trim()
    },
    mirror: {
      host: form.mirror_host.value.trim(),
      user: form.mirror_user.value.trim(),
      password: form.mirror_password.value,
      database: form.mirror_database.value.trim()
    }
  };

  try {
    const esito = await ipc.invoke("config-db:salva-e-allinea", nuovoConfig);
    alert(esito || "✅ Configurazione salvata.");

    const connesso = await ipc.invoke("config-db:test-connessione");
    const overlay = document.getElementById("overlay-errore-db");

    // 🔁 RESETTA SEMPRE IL FLAG DOPO IL SALVATAGGIO
    window._overlayInSospeso = false;

    if (connesso) {
      if (overlay) overlay.style.display = "none";
      window.caricaModulo("dashboard");
    } else {
      if (overlay) overlay.style.display = "flex";
    }

  } catch (err) {
    const overlay = document.getElementById("overlay-errore-db");

    // 🔁 RESETTA SEMPRE IL FLAG DOPO IL SALVATAGGIO FALLITO
    window._overlayInSospeso = false;

    if (overlay) overlay.style.display = "flex";
    alert("❌ Errore nel salvataggio o nella verifica: " + err.message);
  }
});


  caricaConfig();
})();
