console.log('[Menu] JS caricato compatibile con Pure.css');

const nav = document.getElementById('menu');
if (!nav) {
  console.warn('[Menu] #menu non trovato nel DOM');
} else {
  const config = window.configModuli || [];

  // Raggruppa per menu principale
  const mappaMenu = {};

  config.forEach(entry => {
    if (entry.modulo === 'menu') return;

    const [vocePrincipale, sottovoce] = entry.etichetta.split(' > ');
    if (!mappaMenu[vocePrincipale]) mappaMenu[vocePrincipale] = [];

    mappaMenu[vocePrincipale].push({
      modulo: entry.modulo,
      sottovoce: entry.sottovoce,
      etichetta: sottovoce || vocePrincipale
    });
  });

  // Contenitore .pure-menu
  const wrapper = document.createElement('div');
  wrapper.className = 'pure-menu pure-menu-horizontal';

  const ul = document.createElement('ul');
  ul.className = 'pure-menu-list';

  Object.entries(mappaMenu).forEach(([titolo, voci]) => {
    const hasSubmenu = voci.length > 1 || voci[0].sottovoce !== null;

    const li = document.createElement('li');
    li.className = 'pure-menu-item' + (hasSubmenu ? ' pure-menu-has-children pure-menu-allow-hover' : '');

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'pure-menu-link';
    a.innerText = titolo;

    if (hasSubmenu) {
      const subUl = document.createElement('ul');
      subUl.className = 'pure-menu-children';

      voci.forEach(entry => {
        const subLi = document.createElement('li');
        subLi.className = 'pure-menu-item';

        const subA = document.createElement('a');
        subA.href = '#';
        subA.className = 'pure-menu-link';
        subA.innerText = entry.etichetta;

        subA.onclick = (e) => {
          e.preventDefault();
          window.caricaModulo(entry.modulo, entry.sottovoce || null);
          document.activeElement.blur();
          closeAllMenus();
        };

        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });

      li.appendChild(a);
      li.appendChild(subUl);
    } else {
      a.onclick = (e) => {
        e.preventDefault();
        const voce = voci[0];
        window.caricaModulo(voce.modulo, voce.sottovoce || null);
        document.activeElement.blur();
        closeAllMenus();
      };
      li.appendChild(a);
    }

    ul.appendChild(li);
  });

  wrapper.appendChild(ul);
  nav.appendChild(wrapper);

  // Chiude menu al clic esterno
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      closeAllMenus();
    }
  });

  // Rimuove temporaneamente hover per chiudere
  function closeAllMenus() {
    document.querySelectorAll('.pure-menu-has-children').forEach(el => {
      el.classList.remove('pure-menu-allow-hover');
      setTimeout(() => el.classList.add('pure-menu-allow-hover'), 150);
    });
  }
}
