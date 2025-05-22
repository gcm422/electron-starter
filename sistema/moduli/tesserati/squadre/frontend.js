setTimeout(() => {
const ipc = window.electron.ipcRenderer;
  const tabella = document.querySelector("#tabella-squadre tbody");
  const dialog = document.querySelector("#modale-squadra");
  const form = document.querySelector("#form-squadra");
  const btnAggiungi = document.querySelector("#aggiungi-squadra");

  if (!tabella || !dialog || !form || !btnAggiungi) {
    console.warn("⚠️ Elementi non trovati: modulo non ancora iniettato nel DOM.");
    return;
  }

  async function caricaSquadre() {
    const squadre = await ipc.invoke("squadre:getAll");
    tabella.innerHTML = "";
    for (const sq of squadre) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${sq.Nome_squadra || ""}</td>
        <td>${sq.Sigla_squadra || ""}</td>
        <td>${sq.Codice_squadra || ""}</td>
        <td>
          <button data-id="${sq.ID_squadra}" class="modifica">✏️</button>
          <button data-id="${sq.ID_squadra}" class="elimina">🗑️</button>
        </td>`;
      tabella.appendChild(tr);
    }
  }

  btnAggiungi.addEventListener("click", () => {
    form.reset();
    form.ID_squadra.value = "";
    dialog.querySelector("h3").textContent = "Nuova squadra";
    dialog.showModal();
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const dati = Object.fromEntries(new FormData(form).entries());

    if (dati.ID_squadra) {
      dati.ID_squadra = parseInt(dati.ID_squadra);
      await ipc.invoke("squadre:update", dati);
    } else {
      await ipc.invoke("squadre:insert", dati);
    }

    dialog.close();
    caricaSquadre();
  });

  form.addEventListener("reset", () => dialog.close());

  tabella.addEventListener("click", async e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    if (btn.classList.contains("elimina")) {
      if (confirm("Eliminare la squadra?")) {
        await ipc.invoke("squadre:delete", id);
        caricaSquadre();
      }
    }

    if (btn.classList.contains("modifica")) {
      const squadre = await ipc.invoke("squadre:getAll");
      const dati = squadre.find(sq => sq.ID_squadra === id);
      if (dati) {
        form.Nome_squadra.value = dati.Nome_squadra || "";
        form.Sigla_squadra.value = dati.Sigla_squadra || "";
        form.Codice_squadra.value = dati.Codice_squadra || "";
        form.ID_squadra.value = dati.ID_squadra;
        dialog.querySelector("h3").textContent = "Modifica squadra";
        dialog.showModal();
      }
    }
  });

  caricaSquadre();
}, 200); // ← delay per assicurarsi che l’HTML sia nel DOM
