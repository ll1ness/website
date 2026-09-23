(function () {
  'use strict';

  var DATA_URL = 'projects.json';

  var SOCIALS = [
    {
      label: 'GitHub',
      href: 'https://github.com/ll1ness',
      icon: 'gh',
      path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
    },
    {
      label: 'Discord',
      href: 'https://discord.gg/nEcnZKQuCf',
      icon: 'dc',
      path: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z'
    },
    {
      label: 'Steam',
      href: 'https://steamcommunity.com/id/ll1ness/',
      icon: 'st',
      path: 'M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949-.255-.63-.736-1.13-1.338-1.417-.596-.284-1.244-.35-1.876-.19l1.512.626c1.054.438 1.561 1.668 1.129 2.724-.438 1.051-1.663 1.561-2.717 1.126-.356-.148-.644-.382-.882-.655l-.006.001zm9.491-5.813c-1.609 0-2.917-1.308-2.917-2.917 0-1.609 1.312-2.917 2.92-2.917 1.608 0 2.916 1.308 2.916 2.917 0 1.609-1.311 2.917-2.919 2.917zm-.005-1.584c.735 0 1.333-.598 1.333-1.333 0-.736-.598-1.333-1.333-1.333-.737 0-1.334.599-1.334 1.333 0 .735.6 1.333 1.334 1.333z'
    },
    {
      label: 'ORCID',
      href: 'https://orcid.org/0009-0001-2539-7302',
      icon: 'or',
      path: 'M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947-.947-.431-.947-.947.422-.947.947-.947zm-.948 3.11h1.888v10.454H6.421V7.488zm3.175 0h2.078c2.401 0 3.945 1.661 3.945 3.918 0 2.257-1.544 3.919-3.945 3.919h-.978v2.617h-1.1V7.488zm1.1 1.178v5.481h.87c1.944 0 2.868-1.142 2.868-2.741 0-1.598-.924-2.74-2.868-2.74h-.87z'
    },
  ];

  var REPOS = [
    { logo: '/assets/techone.png', name: 'techone-ui', lang: 'CSS · TS', key: 'repo.techone' },
    { logo: '/assets/sparkstudio.png', name: 'spark-studio', lang: 'Java · JPHP', key: 'repo.spark' },
    { logo: '/assets/weatherseeker.png', name: 'weather-seeker', lang: 'JS · API', key: 'repo.weather' }
  ];

  var LANG_SVGS = {
    html: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z',
    css: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z',
    js: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z',
    php: 'M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z',
    java: 'M11.915 0 11.7.215C9.515 2.4 7.47 6.39 6.046 10.483c-1.064 1.024-3.633 2.81-3.711 3.551-.093.87 1.746 2.611 1.55 3.235-.198.625-1.304 1.408-1.014 1.939.1.188.823.011 1.277-.491a13.389 13.389 0 0 0-.017 2.14c.076.906.27 1.668.643 2.232.372.563.956.911 1.667.911.397 0 .727-.114 1.024-.264.298-.149.571-.33.91-.5.68-.34 1.634-.666 3.53-.604 1.903.062 2.872.39 3.559.704.687.314 1.15.664 1.925.664.767 0 1.395-.336 1.807-.9.412-.563.631-1.33.72-2.24.06-.623.055-1.32 0-2.066.454.45 1.117.604 1.213.424.29-.53-.816-1.314-1.013-1.937-.198-.624 1.642-2.366 1.549-3.236-.08-.748-2.707-2.568-3.748-3.586C16.428 6.374 14.308 2.394 12.13.215zm.175 6.038a2.95 2.95 0 0 1 2.943 2.942 2.95 2.95 0 0 1-2.943 2.943A2.95 2.95 0 0 1 9.148 8.98a2.95 2.95 0 0 1 2.942-2.942zM8.685 7.983a3.515 3.515 0 0 0-.145.997c0 1.951 1.6 3.55 3.55 3.55 1.95 0 3.55-1.598 3.55-3.55 0-.329-.046-.648-.132-.951.334.095.64.208.915.336a42.699 42.699 0 0 1 2.042 5.829c.678 2.545 1.01 4.92.846 6.607-.082.844-.29 1.51-.606 1.94-.315.431-.713.651-1.315.651-.593 0-.932-.27-1.673-.61-.741-.338-1.825-.694-3.792-.758-1.974-.064-3.073.293-3.821.669-.375.188-.659.373-.911.5s-.466.2-.752.2c-.53 0-.876-.209-1.16-.64-.285-.43-.474-1.101-.545-1.948-.141-1.693.176-4.069.823-6.614a43.155 43.155 0 0 1 1.934-5.783c.348-.167.749-.31 1.192-.425zm-3.382 4.362a.216.216 0 0 1 .13.031c-.166.56-.323 1.116-.463 1.665a33.849 33.849 0 0 0-.547 2.555 3.9 3.9 0 0 0-.2-.39c-.58-1.012-.914-1.642-1.16-2.08.315-.24 1.679-1.755 2.24-1.781zm13.394.01c.562.027 1.926 1.543 2.24 1.783-.246.438-.58 1.068-1.16 2.08a4.428 4.428 0 0 0-.163.309 32.354 32.354 0 0 0-.562-2.49 40.579 40.579 0 0 0-.482-1.652.216.216 0 0 1 .127-.03z',
    python: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.36.12-.39.2-.38.24-.4.26-.42.3-.4.32-.42.34-.39.35-.4.36-.36.37-.36.36-.34.35-.34.32-.32.3-.3.26-.27.22-.24.18-.21.13-.18.09-.15.05-.12.02-.09.01-.06v-1.25l.08-.4.15-.34.23-.3.3-.28.36-.26.43-.24.48-.22.55-.2.6-.18.66-.16.72-.13.78-.1.84-.07.9-.04zM9.66 5.34l-1.04-.02.05 1.08h.99l.01-1.06z'
  };

  var FAQ = [
    { key: '1' },
    { key: '2' },
    { key: '3' },
    { key: '4' },
    { key: '5' }
  ];

  var state = { projects: [], cats: [], activeCat: null };

  function T(key, params) {
    if (window.I18N && window.I18N.t) return window.I18N.t(key, params);
    return key;
  }

  function catLabel(cat) { return T('cat.' + cat.id); }

  function enField(p, name) {
    return (window.I18N && window.I18N.current() === 'en' && p[name]) ? p[name] : null;
  }

  function dlLabel(label) {
    var v = T('dl.' + label);
    return (v === 'dl.' + label) ? label : v;
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function injectLangLogos() {
    document.querySelectorAll('.ltag').forEach(function (t) {
      var lang = t.dataset.l;
      var path = LANG_SVGS[lang];
      if (!path) return;
      t.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="' + path + '"/></svg>';
    });
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function renderContrib() {
    var box = document.getElementById('gh-contrib');
    if (!box) return;
    box.innerHTML = '<span class="contrib-loading">' + T('contrib.loading') + '</span>';
    fetch('https://github-contributions-api.jogruber.de/v4/ll1ness?y=last')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
      .then(function (d) {
        var map = {};
        (d.contributions || []).forEach(function (c) {
          map[c.date] = c.count || 0;
        });

        var end = new Date();
        end.setHours(0, 0, 0, 0);
        var start = new Date(end);
        start.setDate(start.getDate() - 370);
        while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

        var grid = el('div', 'contrib-grid');
        var cur = new Date(start);
        var week = null;
        while (cur <= end) {
          if (cur.getDay() === 0) {
            week = el('div', 'contrib-week');
            grid.appendChild(week);
          }
          var key = cur.getFullYear() + '-' + pad2(cur.getMonth() + 1) + '-' + pad2(cur.getDate());
          var n = map[key] || 0;
          var lvl = n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 9 ? 3 : 4;
          var cell = el('div', 'contrib-cell lvl' + lvl);
          cell.title = key + ': ' + T('contrib.commits', { n: n });
          week.appendChild(cell);
          cur.setDate(cur.getDate() + 1);
        }
        box.innerHTML = '';
        box.appendChild(grid);
      })
      .catch(function () {
        box.innerHTML = '<img class="contrib-fallback" src="https://ghchart.rshah.org/ll1ness" alt="' + T('contrib.alt') + '">';
      });
  }

  function renderGhWidget() {
    var repos = document.getElementById('gh-repos');
    if (repos) {
      REPOS.forEach(function (r) {
        var row = el('div', 'gh-repo');
        var left = el('div', '');
        var logo = el('img', 'gh-repo-logo');
        logo.src = r.logo;
        logo.alt = r.name;
        var meta = el('div', '');
        meta.appendChild(el('div', 'gh-repo-name', r.name));
        meta.appendChild(el('div', 'gh-repo-desc', T(r.key)));
        left.appendChild(logo);
        left.appendChild(meta);
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';
        var lang = el('div', 'gh-repo-lang');
        lang.innerHTML = '<span class="lang-dot"></span>' + r.lang;
        row.appendChild(left);
        row.appendChild(lang);
        repos.appendChild(row);
      });
    }
  }

  function currentCatIndex() {
    for (var i = 0; i < state.cats.length; i++) {
      if (state.cats[i].id === state.activeCat) return i;
    }
    return 0;
  }

  function updateCatWord(label) {
    var word = document.getElementById('cat-word');
    if (!word) return;
    var old = word.textContent;
    if (old === label && !word.classList.contains('hide')) return;
    var oldW = catWidths[old];
    var newW = catWidths[label];
    word.classList.add('hide');
    clearTimeout(word._t);
    var ver = (word._v = (word._v || 0) + 1);
    word._t = setTimeout(function () {
      if (word._v !== ver) return;
      word.style.width = oldW ? oldW + 'px' : '';
      word.textContent = label;
      if (oldW && newW) {
        void word.offsetWidth;
        word.style.width = newW + 'px';
      }
      word.classList.remove('hide');
      var v2 = ver;
      setTimeout(function () {
        if (word._v === v2) word.style.width = '';
      }, 360);
    }, 200);
  }

  function setCategory(id) {
    if (!state.cats.length) return;
    var cat = null;
    for (var i = 0; i < state.cats.length; i++) {
      if (state.cats[i].id === id) { cat = state.cats[i]; break; }
    }
    if (!cat) return;
    state.activeCat = cat.id;
    updateCatWord(catLabel(cat));
    renderProjects();
  }

  function stepCategory(delta) {
    if (state.cats.length < 2) return;
    var n = state.cats.length;
    var i = (currentCatIndex() + delta + n) % n;
    setCategory(state.cats[i].id);
  }

  function bindCatNav() {
    var prev = document.getElementById('cat-prev');
    var next = document.getElementById('cat-next');
    if (prev) prev.addEventListener('click', function () { stepCategory(-1); });
    if (next) next.addEventListener('click', function () { stepCategory(1); });
  }

  var carouselEl = null;
  var carouselTrack = null;
  var dotsEl = null;
  var carouselState = { index: 0, count: 0, dragPx: 0 };
  var catWidths = {};

  function computeSpacing() {
    return carouselEl ? carouselEl.clientWidth / 2 : 0;
  }

  function cardProps(ds, spacing) {
    var d = Math.abs(ds);
    var s = 1 - 0.45 * Math.min(d, 1);
    // непрерывная непрозрачность: без скачка на краю соседней карточки (был разрыв 0.35 → 0.08)
    var o = d < 0.001 ? 1 : Math.max(0.05, 1 - 0.65 * Math.min(d, 1) - 0.25 * Math.max(0, d - 1));
    // z-index по целым слотам, чтобы стопка не "щёлкала" каждые 0.1 при перелистывании
    var z = 100 - Math.min(3, Math.round(d));
    return { x: ds * spacing, s: s, o: o, z: z };
  }

  function applyTransforms() {
    if (!carouselTrack || !carouselState.count) return;
    var spacing = computeSpacing() || 340;
    var cards = carouselTrack.querySelectorAll('.project-card');
    for (var i = 0; i < cards.length; i++) {
      var ds = (i - carouselState.index) + carouselState.dragPx / spacing;
      var p = cardProps(ds, spacing);
      var card = cards[i];
      card.style.transform = 'translate(-50%,-50%) translate3d(' + p.x.toFixed(1) + 'px,0,0) scale(' + p.s.toFixed(3) + ')';
      card.style.opacity = p.o >= 1 ? '' : p.o.toFixed(3);
      card.style.zIndex = p.z;
      card.classList.toggle('selected', Math.abs(ds) < 0.001);
    }
    updateDots();
  }

  function renderDots(n) {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    dotsEl.style.setProperty('--count', n);
    for (var i = 0; i < n; i++) {
      var d = el('button', 'carousel-dot');
      d.type = 'button';
      d.style.setProperty('--i', i);
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', T('projects.dot', { i: i + 1, n: n }));
      (function (idx) {
        d.addEventListener('click', function () { goTo(idx); });
      })(i);
      dotsEl.appendChild(d);
    }
  }

  function updateDots() {
    if (!dotsEl || !carouselState.count) return;
    var spacing = computeSpacing() || 1;
    var frac = carouselState.index - carouselState.dragPx / spacing;
    var dots = dotsEl.children;
    for (var i = 0; i < dots.length; i++) {
      var p = Math.max(0, 1 - Math.abs(frac - i));
      dots[i].style.setProperty('--p', p.toFixed(3));
      dots[i].setAttribute('aria-selected', p > 0.5 ? 'true' : 'false');
    }
  }

  // схлопывание точек карусели в одну при смене категории и разжатие обратно
  function collapseDots(on) {
    if (!dotsEl) return;
    if (on) {
      dotsEl.classList.remove('expanding');
      dotsEl.classList.add('collapsing');
      var dots = dotsEl.children;
      var best = -1, bi = -1;
      for (var i = 0; i < dots.length; i++) {
        var p = parseFloat(dots[i].style.getPropertyValue('--p')) || 0;
        if (p > best) { best = p; bi = i; }
      }
      if (bi >= 0) dots[bi].classList.add('active');
    } else {
      var act = dotsEl.querySelectorAll('.active');
      for (var j = 0; j < act.length; j++) act[j].classList.remove('active');
      dotsEl.classList.remove('collapsing');
      dotsEl.classList.add('expanding');
      void dotsEl.offsetWidth;
      clearTimeout(collapseDots._t);
      collapseDots._t = setTimeout(function () {
        if (dotsEl) dotsEl.classList.remove('expanding');
      }, 520);
    }
  }

  function goTo(index) {
    if (!carouselState.count) return;
    carouselState.index = Math.max(0, Math.min(carouselState.count - 1, index));
    carouselState.dragPx = 0;
    applyTransforms();
  }

  function fitCatWord() {
    var word = document.getElementById('cat-word');
    if (!word || !state.cats.length) return;
    var cur = word.textContent;
    state.cats.forEach(function (c) {
      var lab = catLabel(c);
      word.textContent = lab;
      catWidths[lab] = word.offsetWidth;
    });
    word.textContent = cur;
  }

  // мгновенная синхронизация слова активной категории с текущим языком (при загрузке/инициализации)
  function syncCatWord() {
    var word = document.getElementById('cat-word');
    if (!word || !state.cats.length) return;
    for (var i = 0; i < state.cats.length; i++) {
      if (state.cats[i].id === state.activeCat) {
        var lab = catLabel(state.cats[i]);
        if (word.textContent !== lab) word.textContent = lab;
        break;
      }
    }
  }

  function initCarouselDrag() {
    carouselEl = document.getElementById('projects-carousel');
    carouselTrack = document.getElementById('projects-grid');
    dotsEl = document.getElementById('carousel-dots');
    if (!carouselEl) return;
    var down = false, pointerId = null, startX = 0, moved = 0;

    carouselEl.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (!carouselState.count) return;
      down = true;
      moved = 0;
      pointerId = e.pointerId;
      startX = e.clientX;
      carouselEl.classList.add('dragging');
    });
    document.addEventListener('pointermove', function (e) {
      if (!down || e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > moved) moved = Math.abs(dx);
      carouselState.dragPx = dx;
      applyTransforms();
    });
    function end(e) {
      if (!down || e.pointerId !== pointerId) return;
      down = false;
      pointerId = null;
      carouselEl.classList.remove('dragging');
      var spacing = computeSpacing() || 1;
      var target = carouselState.index + Math.round(-carouselState.dragPx / spacing);
      carouselState.dragPx = 0;
      goTo(target);
    }
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
    carouselEl.addEventListener('click', function (e) {
      if (moved > 6) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
    carouselEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(carouselState.index - 1); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { goTo(carouselState.index + 1); e.preventDefault(); }
    });

    var rT = null;
    window.addEventListener('resize', function () {
      if (rT) return;
      rT = setTimeout(function () {
        rT = null;
        carouselEl.classList.add('init');
        applyTransforms();
        fitCatWord();
        requestAnimationFrame(function () { carouselEl.classList.remove('init'); });
      }, 150);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { fitCatWord(); });
    }
  }

  function buildCarousel(p, slides) {
    slides = slides || (p.screenshots || []).slice();
    if (!slides.length && p.gif) slides.push(p.gif);
    if (!slides.length) return null;

    var wrap = el('div', 'project-carousel' + (slides.length < 2 ? ' single' : ''));
    var track = el('div', 'project-carousel-track');
    slides.forEach(function (src, i) {
      var img = el('img', 'project-carousel-slide');
      img.src = src;
      img.alt = p.name + ' — ' + (i === 0 && slides[0] === p.gif ? T('card.anim') : T('card.shot', { n: i + 1 }));
      img.loading = 'eager';
      img.decoding = 'async';
      img.draggable = false;
      track.appendChild(img);
    });
    wrap.appendChild(track);

    var dots = el('div', 'project-carousel-dots');
    slides.forEach(function (_, i) {
      var d = el('button', 'project-carousel-dot' + (i === 0 ? ' active' : ''));
      d.type = 'button';
      d.dataset.index = i;
      d.addEventListener('click', function (e) { e.stopPropagation(); go(i); });
      dots.appendChild(d);
    });
    wrap.appendChild(dots);

    var idx = 0;
    var timer = null;
    var visible = false;
    var hover = false;

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.querySelectorAll('.project-carousel-dot').forEach(function (d, j) {
        d.classList.toggle('active', j === idx);
      });
    }

    function next() { go(idx + 1); }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    function start() {
      if (timer || slides.length < 2) return;
      timer = setInterval(next, 3000);
    }

    wrap.addEventListener('mouseenter', function () { hover = true; stop(); });
    wrap.addEventListener('mouseleave', function () { hover = false; if (visible && slides.length > 1) start(); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible && !hover) start();
          else if (!visible) stop();
        });
      }, { threshold: 0.25 });
      io.observe(wrap);
    } else {
      visible = true;
      start();
    }

    return wrap;
  }

  function generateCardBg() {
    var S = 22 + Math.floor(Math.random() * 22);
    var a1 = (0.018 + Math.random() * 0.028).toFixed(3);
    var a2 = (a1 * 0.6).toFixed(3);
    var stroke = 'rgba(255,255,255,' + a1 + ')';
    var stroke2 = 'rgba(255,255,255,' + a2 + ')';
    var S2 = Math.round(S / 2);
    var q = Math.round(S / 4);
    var kind = Math.floor(Math.random() * 5);
    var shapes = '';
    if (kind === 0) {
      shapes =
        '<circle cx="' + q + '" cy="' + q + '" r="1.4" fill="' + stroke + '"/>' +
        '<circle cx="' + (S - q) + '" cy="' + (S - q) + '" r="1.4" fill="' + stroke + '"/>' +
        '<circle cx="' + S2 + '" cy="' + S2 + '" r="2.6" fill="' + stroke2 + '"/>';
    } else if (kind === 1) {
      shapes =
        '<path d="M0 0 L' + S + ' ' + S + ' M' + S + ' 0 L0 ' + S + '" stroke="' + stroke + '" stroke-width="1" fill="none"/>' +
        '<path d="M' + S2 + ' 0 L' + S2 + ' ' + S + ' M0 ' + S2 + ' L' + S + ' ' + S2 + '" stroke="' + stroke2 + '" stroke-width="1" fill="none"/>';
    } else if (kind === 2) {
      var r = Math.round(S * 0.45);
      shapes =
        '<circle cx="0" cy="0" r="' + r + '" stroke="' + stroke + '" stroke-width="1" fill="none"/>' +
        '<circle cx="' + S + '" cy="0" r="' + r + '" stroke="' + stroke2 + '" stroke-width="1" fill="none"/>' +
        '<circle cx="0" cy="' + S + '" r="' + r + '" stroke="' + stroke2 + '" stroke-width="1" fill="none"/>' +
        '<circle cx="' + S + '" cy="' + S + '" r="' + r + '" stroke="' + stroke + '" stroke-width="1" fill="none"/>';
    } else if (kind === 3) {
      shapes =
        '<path d="M0 0 L' + S + ' 0 L' + S2 + ' ' + S2 + ' Z" fill="' + stroke + '"/>' +
        '<path d="M0 ' + S + ' L0 0 L' + S2 + ' ' + S2 + ' Z" fill="' + stroke2 + '"/>' +
        '<path d="M' + S + ' ' + S + ' L' + S + ' 0 L' + S2 + ' ' + S2 + ' Z" fill="' + stroke2 + '"/>' +
        '<path d="M' + S + ' ' + S + ' L0 ' + S + ' L' + S2 + ' ' + S2 + ' Z" fill="' + stroke + '"/>';
    } else {
      shapes =
        '<path d="M' + S2 + ' 0 L' + S2 + ' ' + S + ' M0 ' + S2 + ' L' + S + ' ' + S2 + '" stroke="' + stroke + '" stroke-width="1.4" fill="none"/>' +
        '<circle cx="' + S2 + '" cy="' + S2 + '" r="' + q + '" stroke="' + stroke2 + '" stroke-width="1" fill="none"/>';
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '" viewBox="0 0 ' + S + ' ' + S + '">' + shapes + '</svg>';
    var gx = Math.round(10 + Math.random() * 80);
    var gy = Math.round(10 + Math.random() * 70);
    return {
      image: 'radial-gradient(circle at ' + gx + '% ' + gy + '%, rgba(255,255,255,.04) 0%, rgba(255,255,255,0) 46%), ' +
             'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")',
      size: '100% 100%, ' + S + 'px ' + S + 'px'
    };
  }

  function projectCard(p) {
    var card = el('div', 'project-card');
    card.dataset.id = p.id;
    var bg = generateCardBg();
    if (bg) {
      card.style.backgroundImage = bg.image;
      card.style.backgroundSize = bg.size;
    }

    var shot = el('div', 'card-shot');
    var slides = [];
    if (p.gif) slides.push(p.gif);
    else slides = (p.screenshots || []).slice();
    var carousel = buildCarousel(p, slides);
    if (carousel) {
      shot.appendChild(carousel);
    } else if (p.logo) {
      var ph = el('div', 'project-thumb-placeholder');
      var plg = document.createElement('img');
      plg.className = 'project-logo';
      plg.src = p.logo;
      plg.alt = p.name;
      ph.appendChild(plg);
      shot.appendChild(ph);
    } else {
      shot.appendChild(el('div', 'project-thumb-placeholder', p.icon || '📄'));
    }
    card.appendChild(shot);

    var body = el('div', 'card-body');
    var title = el('div', 'project-title');
    if (p.logo) {
      var tlg = document.createElement('img');
      tlg.className = 'project-logo';
      tlg.src = p.logo;
      tlg.alt = '';
      title.appendChild(tlg);
    } else if (p.icon) {
      title.appendChild(document.createTextNode(p.icon + ' '));
    }
    title.appendChild(document.createTextNode(p.name));
    body.appendChild(title);
    body.appendChild(el('div', 'project-tagline', enField(p, 'taglineEn') || p.tagline));

    if (p.tags && p.tags.length) {
      var tags = el('div', 'project-tags');
      p.tags.forEach(function (t) {
        tags.appendChild(el('span', 'to-tag', t));
      });
      body.appendChild(tags);
    }

    var more = el('button', 'card-more', T('card.more'));
    more.type = 'button';
    more.addEventListener('click', function (e) {
      e.stopPropagation();
      window.location.href = 'project?id=' + encodeURIComponent(p.id);
    });
    body.appendChild(more);
    card.appendChild(body);

    return card;
  }

  function renderProjects() {
    carouselTrack = document.getElementById('projects-grid');
    if (!carouselTrack) return;
    var list = state.projects.filter(function (p) { return p.cat === state.activeCat; });
    var had = !!carouselTrack.querySelector('.project-card');

    function build() {
      carouselTrack.innerHTML = '';
      carouselState.count = list.length;
      carouselState.dragPx = 0;
      renderDots(list.length);

      if (!list.length) {
        carouselState.index = 0;
        carouselTrack.appendChild(el('p', 'projects-empty', T('projects.empty')));
        return;
      }
      carouselState.index = list.length >= 3 ? 1 : 0;
      list.forEach(function (p) {
        carouselTrack.appendChild(projectCard(p));
      });
      if (carouselEl) {
        carouselEl.classList.add('init');
        applyTransforms();
        requestAnimationFrame(function () { carouselEl.classList.remove('init'); });
      }
    }

    clearTimeout(renderProjects._t);
    if (had) {
      carouselTrack.classList.remove('switching');
      carouselTrack.classList.add('out');
      collapseDots(true);
      renderProjects._t = setTimeout(function () {
        build();
        carouselTrack.classList.remove('out');
        void carouselTrack.offsetWidth;
        carouselTrack.classList.add('switching');
        collapseDots(false);
      }, 250);
    } else {
      build();
      carouselTrack.classList.remove('out');
      carouselTrack.classList.remove('switching');
      void carouselTrack.offsetWidth;
      carouselTrack.classList.add('switching');
    }
  }

  /* ---------- Страница проекта (project.html) ---------- */

  var lastProject = null;

  function projectIdFromUrl() {
    var m = /[?&]id=([^&#]+)/.exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function initProjectPage() {
    var root = document.getElementById('project-root');
    if (!root) return;
    var id = projectIdFromUrl();
    if (!id) {
      root.innerHTML = '<p class="projects-empty">' + T('project.noId') + '</p>';
      return;
    }
    root.innerHTML = '<p class="projects-empty">' + T('projects.loading') + '</p>';
    fetch(DATA_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
      .then(function (d) {
        var p = (d.projects || []).find(function (x) { return x.id === id; });
        if (!p) {
          root.innerHTML = '<p class="projects-empty">' + T('project.notFound') + '</p>';
          return;
        }
        lastProject = p;
        renderProjectPage(root, p);
      })
      .catch(function () {
        root.innerHTML = '<p class="projects-empty">' + T('project.loadFailed') + '</p>';
      });
  }

  /* Модал «Варианты установки» для десктоп-сборок */
  function openDesktopModal(p, trigger) {
    var old = document.querySelector('.steam-modal');
    if (old) old.remove();

    var modal = el('div', 'steam-modal');
    var back = el('div', 'steam-modal-backdrop');
    var box = el('div', 'steam-modal-box');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', T('project.modalTitle', { name: p.name }));

    var close = el('button', 'steam-modal-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', T('project.modalClose'));

    var title = el('div', 'steam-modal-title', T('project.modalTitle', { name: p.name }));
    var sub = el('div', 'steam-modal-sub', T('project.modalSub'));

    var list = el('div', 'steam-modal-list');
    p.desktopDownloads.forEach(function (o) {
      if (!o.url || o.url === '#') return;
      var a = el('a', 'steam-modal-opt');
      a.href = o.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.appendChild(el('span', 'steam-modal-os', o.os));
      a.appendChild(el('span', 'steam-modal-arch', o.arch));
      a.appendChild(el('span', 'steam-modal-arrow', '→'));
      list.appendChild(a);
    });

    box.appendChild(close);
    box.appendChild(title);
    box.appendChild(sub);
    box.appendChild(list);
    modal.appendChild(back);
    modal.appendChild(box);
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey, true);
      setTimeout(function () { modal.remove(); }, 180);
      if (trigger && trigger.focus) trigger.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { closeModal(); e.preventDefault(); }
    }
    back.addEventListener('click', closeModal);
    close.addEventListener('click', closeModal);
    document.addEventListener('keydown', onKey, true);

    requestAnimationFrame(function () { modal.classList.add('open'); });
    setTimeout(function () {
      var f = box.querySelector('.steam-modal-close') || list.firstChild;
      if (f && f.focus) f.focus();
    }, 30);
  }

  function renderProjectPage(root, p) {
    document.title = p.name + ' — ll1ness';
    var old = document.querySelector('.steam-modal');
    if (old) { old.remove(); document.body.classList.remove('modal-open'); }
    var box = el('div', 'steam');

    // хлебные крошки
    var crumb = el('a', 'steam-crumb', T('project.crumb'));
    crumb.href = '/#projects';
    box.appendChild(crumb);

    // шапка страницы в стиле Steam
    var head = el('div', 'steam-head');
    head.appendChild(el('h1', null, p.name));
    if (p.tagline) head.appendChild(el('div', 'steam-tagline', enField(p, 'taglineEn') || p.tagline));
    if (p.tags && p.tags.length) {
      var tags = el('div', 'steam-tags');
      p.tags.forEach(function (t) { tags.appendChild(el('span', 'steam-tag', t)); });
      head.appendChild(tags);
    }
    box.appendChild(head);

    var slides = [];
    if (p.screenshots && p.screenshots.length) slides = p.screenshots.slice();
    else if (p.gif) slides.push(p.gif);

    // верхняя зона: большое медиа + панель действий
    var mainRow = el('div', 'steam-main');

    var media = el('div', 'steam-media');
    var frame = el('div', 'steam-frame');
    var big = document.createElement('img');
    big.className = 'steam-shot';
    big.src = slides.length ? slides[0] : '';
    big.alt = p.name;
    frame.appendChild(big);

    var shotIndex = 0;
    var strip = null;
    function setShot(i) {
      if (!slides.length) return;
      shotIndex = (i + slides.length) % slides.length;
      big.src = slides[shotIndex];
      if (strip) {
        var thumbs = strip.querySelectorAll('.steam-thumb');
        for (var t = 0; t < thumbs.length; t++) {
          thumbs[t].classList.toggle('active', t === shotIndex);
        }
      }
    }

    if (slides.length > 1) {
      var prev = el('button', 'steam-arrow prev', '‹');
      prev.type = 'button';
      prev.addEventListener('click', function () { setShot(shotIndex - 1); });
      var next = el('button', 'steam-arrow next', '›');
      next.type = 'button';
      next.addEventListener('click', function () { setShot(shotIndex + 1); });
      frame.appendChild(prev);
      frame.appendChild(next);

      strip = el('div', 'steam-strip');
      slides.forEach(function (src, i) {
        var th = el('button', 'steam-thumb' + (i === 0 ? ' active' : ''));
        th.type = 'button';
        var im = document.createElement('img');
        im.src = src;
        im.alt = p.name + ' — ' + T('card.shot', { n: i + 1 });
        im.decoding = 'async';
        im.draggable = false;
        th.appendChild(im);
        th.addEventListener('click', (function (idx) {
          return function () { setShot(idx); };
        })(i));
        strip.appendChild(th);
      });
    }

    media.appendChild(frame);
    if (strip) media.appendChild(strip);
    mainRow.appendChild(media);

    // панель действий — как блок покупки в Steam
    var side = el('div', 'steam-side');
    side.appendChild(el('div', 'steam-side-title', p.name));
    var sideBox = el('div', 'steam-side-box');
    var warn = enField(p, 'warnEn') || p.warn;
    if (warn) sideBox.appendChild(el('div', 'steam-warn', warn));
    var hasDownloads = p.desktopDownloads && p.desktopDownloads.length;
    if (hasDownloads) {
      var dlDisabled = !!p.downloadDisabled;
      var db = el('button', 'steam-btn primary' + (dlDisabled ? ' disabled' : ''), T('project.downloadBtn') + ' →');
      db.type = 'button';
      db.disabled = dlDisabled;
      if (!dlDisabled) db.addEventListener('click', function () { openDesktopModal(p, db); });
      sideBox.appendChild(db);
    }
    if (p.downloads && p.downloads.length) {
      p.downloads.forEach(function (d, i) {
        if (!d.url || d.url === '#') return;
        var a = el('a', 'steam-btn' + ((!hasDownloads && i === 0) ? ' primary' : ''), dlLabel(d.label) + ' →');
        a.href = d.url;
        a.target = '_blank';
        a.rel = 'noopener';
        sideBox.appendChild(a);
      });
    }
    sideBox.appendChild(el('div', 'steam-open', T('project.license', { L: p.license || 'MIT' })));
    side.appendChild(sideBox);
    mainRow.appendChild(side);
    box.appendChild(mainRow);

    // «О проекте»
    var secAbout = el('div', 'steam-section');
    secAbout.appendChild(el('h2', 'steam-h2', T('project.about')));
    secAbout.appendChild(el('div', 'steam-text', enField(p, 'descriptionEn') || p.description));
    box.appendChild(secAbout);

    // «Системные требования» (как summary-блок в Steam)
    var reqs = (window.I18N && window.I18N.current() === 'en' && p.requirementsEn) ? p.requirementsEn : p.requirements;
    if (reqs && reqs.length) {
      var secReq = el('div', 'steam-section');
      secReq.appendChild(el('h2', 'steam-h2', T('project.req')));
      var req = el('div', 'steam-req');
      reqs.forEach(function (r) {
        var row = el('div', 'steam-req-row');
        row.appendChild(el('span', 'steam-req-label', r.label));
        row.appendChild(el('span', 'steam-req-val', r.value));
        req.appendChild(row);
      });
      secReq.appendChild(req);
      box.appendChild(secReq);
    }

    box.appendChild(el('div', 'steam-foot', '© ' + new Date().getFullYear() + ' ll1ness'));

    root.innerHTML = '';
    root.appendChild(box);
  }

  /* ---------- Socials ---------- */

  function renderSocials() {
    var list = document.getElementById('social-list');
    if (!list) return;
    SOCIALS.forEach(function (s) {
      var a = el('a', 'social-item');
      a.href = s.href;
      a.target = '_blank';
      a.rel = 'noopener';
      var left = el('div', 'social-item-left');
      left.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="' + s.path + '"/></svg>' + s.label;
      a.appendChild(left);
      a.appendChild(el('span', 'social-item-arrow', '→'));
      list.appendChild(a);
    });
  }

  /* ---------- FAQ ---------- */

  function renderFaq() {
    var list = document.getElementById('faq-list');
    if (!list) return;
    FAQ.forEach(function (item) {
      var acc = el('div', 'to-accordion');
      var trigger = el('button', 'to-accordion-trigger', T('faq.' + item.key + '.title') + ' <span class="to-accordion-icon">▼</span>');
      var content = el('div', 'to-accordion-content');
      content.appendChild(el('div', 'to-accordion-content-inner', T('faq.' + item.key + '.content')));
      acc.appendChild(trigger);
      acc.appendChild(content);
      list.appendChild(acc);
    });
    if (window.toui && window.toui.init) window.toui.init();
  }

  /* ---------- Decor (Once UI style) ---------- */

  function initSpotlight() {
    ['pointermove', 'pointerleave'].forEach(function (evt) {
      document.addEventListener(evt, function (e) {
        var card = e.target.closest ? e.target.closest('.project-card, .contact-card') : null;
        if (!card) return;
        var r = card.getBoundingClientRect();
        if (evt === 'pointerleave' || (e.clientX === 0 && e.clientY === 0)) {
          card.style.setProperty('--mx', '50%');
          card.style.setProperty('--my', '50%');
          return;
        }
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
  }

  /* ---------- Support chat ---------- */

  function initSupportChat() {
    var widget = document.getElementById('chat-widget');
    var launcher = document.getElementById('chat-launcher');
    var panel = document.getElementById('chat-panel');
    var closeBtn = document.getElementById('chat-close');
    var body = document.getElementById('chat-body');
    var form = document.getElementById('chat-form');
    var input = document.getElementById('chat-input');
    if (!widget || !launcher || !panel || !closeBtn || !body || !form || !input) return;

    input.placeholder = T('chat.inputPh');

    // кнопка чата занимает место стрелки «наверх», пока та скрыта
    var toTop = document.querySelector('.to-scroll-top');
    function syncChatLift() {
      var lifted = !!(toTop && toTop.classList.contains('visible'));
      widget.classList.toggle('chat-lifted', lifted);
    }
    window.addEventListener('scroll', syncChatLift, { passive: true });
    window.addEventListener('resize', syncChatLift, { passive: true });
    syncChatLift();

    var sid = null;
    var lastMsgId = 0;
    var pollTimer = null;
    try {
      sid = localStorage.getItem('ll1chat.sid') || null;
      if (sid) lastMsgId = parseInt(localStorage.getItem('ll1chat.last.' + sid) || '0', 10) || 0;
    } catch (err) {}
    var booted = false;

    function msg(text, who) {
      var m = el('div', 'msg ' + who);
      m.textContent = text;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      return m;
    }

    // Сессия гостя — UUID в localStorage; по ней в Telegram создаётся тема «Гость #N».
    function sessionId() {
      if (sid) return sid;
      try {
        sid = localStorage.getItem('ll1chat.sid');
        if (!sid) {
          sid = (window.crypto && window.crypto.randomUUID)
            ? window.crypto.randomUUID()
            : 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
          localStorage.setItem('ll1chat.sid', sid);
        }
      } catch (err) {
        sid = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
      }
      return sid;
    }

    function welcome() {
      if (booted) return;
      booted = true;
      msg(T('chat.greeting'), 'bot');
      body.scrollTop = body.scrollHeight;
    }

    function renderIncoming(list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (!m || m.id <= lastMsgId) continue;
        lastMsgId = m.id;
        if (m.kind === 'closed') {
          msg(T('chat.closed'), 'bot');
          openRating();
          continue;
        }
        if (!m.text) continue;
        msg(m.text, 'bot');
      }
      try {
        if (lastMsgId) localStorage.setItem('ll1chat.last.' + sessionId(), String(lastMsgId));
      } catch (err) {}
    }

    function poll() {
      fetch('/api/chat/poll?sid=' + encodeURIComponent(sessionId()) + '&lastId=' + lastMsgId, { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (d && d.messages) renderIncoming(d.messages); })
        .catch(function () {});
    }

    function startPolling() {
      stopPolling();
      poll();
      pollTimer = setInterval(poll, 3000);
    }

    function stopPolling() {
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    }

    // ── окно оценки поддержки (после закрытия темы) ──
    var ratingModal = null;

    function openRating() {
      if (ratingModal && ratingModal.parentNode) return;
      input.disabled = true;
      ratingModal = el('div', 'rating-modal');
      var box = el('div', 'rating-box');
      var title = el('div', 'rating-title');
      title.textContent = T('chat.ratingTitle');
      box.appendChild(title);
      var stars = el('div', 'rating-stars');
      for (var s = 1; s <= 5; s++) {
        (function (score) {
          var b = el('button', 'rating-star');
          b.type = 'button';
          b.textContent = '★';
          b.setAttribute('aria-label', score + '/5');
          b.addEventListener('click', function () { submitRating(score); });
          stars.appendChild(b);
        })(s);
      }
      box.appendChild(stars);
      var skip = el('button', 'rating-skip');
      skip.type = 'button';
      skip.textContent = T('chat.ratingSkip');
      skip.addEventListener('click', function () { closeRating(); });
      box.appendChild(skip);
      ratingModal.appendChild(box);
      ratingModal.addEventListener('click', function (ev) {
        if (ev.target === ratingModal) closeRating();
      });
      document.body.appendChild(ratingModal);
    }

    function closeRating() {
      if (ratingModal && ratingModal.parentNode) ratingModal.parentNode.removeChild(ratingModal);
      ratingModal = null;
      input.disabled = false;
      if (widget.classList.contains('open')) input.focus();
    }

    function submitRating(score) {
      fetch('/api/chat/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid: sessionId(), score: score })
      }).then(function () {
        msg(T('chat.rateThanks'), 'bot');
        closeRating();
      }).catch(function () {
        msg(T('chat.rateErr'), 'bot');
        closeRating();
      });
    }

    function send(text) {
      return fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid: sessionId(), text: text })
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
    }

    function setOpen(open) {
      widget.classList.toggle('open', open);
      launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
      launcher.setAttribute('aria-label', open ? T('chat.closeAriaFull') : T('chat.openAria'));
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        welcome();
        startPolling();
        setTimeout(function () { input.focus(); }, 250);
      } else {
        stopPolling();
      }
    }

    // глобальная функция — чтобы hero-кнопка «Telegram» открывала чат
    window.openChat = function () { setOpen(true); };

    launcher.addEventListener('click', function () {
      setOpen(!widget.classList.contains('open'));
    });
    closeBtn.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && widget.classList.contains('open')) setOpen(false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.disabled) return;
      var text = input.value.trim();
      if (!text) return;
      msg(text, 'user');
      input.value = '';
      send(text).catch(function () {
        msg(T('chat.sendErr'), 'bot');
        input.value = text;
      });
    });
  }

  /* ---------- Boot ---------- */

  // ─── HERO: интерактивный ASCII-арт «ЛИНЕСС» ────────────────────
  var ASCII_RAMP = ' .:-=+*#%@';

  function initHeroAscii() {
    var canvas = document.getElementById('hero-ascii');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var CELL_W = 4, CELL_H = 7, COLS = 268, ROWS = 64;
    var DPR = Math.min(2, window.devicePixelRatio || 1); // плотность пикселей экрана (макс 2 — запас памяти)
    var grid = [], energy = [], pointer = null, raf = 0, animT0 = 0;
    var loadedImg = null, started = false;
    canvas.width = COLS * CELL_W * DPR;
    canvas.height = ROWS * CELL_H * DPR;
    var F_GLOW = 11, SPR = null;

    // спрайты глифов: рисуем символ один раз в маленький канвас (в пикселях экрана,
    // чтобы глифы были чёткими на любом DPI) и дальше клеим drawImage —
    // быстрее fillText, и символ не может "съехать" за ячейку
    function makeSprite(fontPx, w, h, color, k) {
      var dw = Math.max(1, Math.round(w * DPR));
      var dh = Math.max(1, Math.round(h * DPR));
      var sc = document.createElement('canvas');
      sc.width = dw;
      sc.height = dh;
      var s2 = sc.getContext('2d');
      s2.font = (fontPx * DPR) + 'px Consolas, "Courier New", monospace';
      s2.textAlign = 'center';
      s2.textBaseline = 'middle';
      s2.fillStyle = color;
      s2.fillText(ASCII_RAMP[k], dw / 2, dh / 2 + 0.5 * DPR);
      return sc;
    }
    // спрайты собираем заново при каждой пересборке (размер ячейки может меняться)
    function initSprites() {
      F_GLOW = Math.round(CELL_H * 1.5);
      var gray = [], white = [], glow = [];
      var gw = CELL_W + 8, gh = CELL_H + 8;
      for (var k = 0; k < ASCII_RAMP.length; k++) {
        gray.push(makeSprite(CELL_H, CELL_W, CELL_H, '#cdcdcd', k));
        white.push(makeSprite(CELL_H, CELL_W, CELL_H, '#ffffff', k));
        glow.push(makeSprite(F_GLOW, gw, gh, '#ffffff', k));
      }
      SPR = { gray: gray, white: white, glow: glow };
    }

    function sample(fn) {
      var tmp = document.createElement('canvas');
      tmp.width = COLS; tmp.height = ROWS;
      var t = tmp.getContext('2d');
      fn(t);
      var data = t.getImageData(0, 0, COLS, ROWS).data;
      grid.length = 0;
      for (var i = 0; i < COLS * ROWS; i++) {
        grid.push((0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255);
        if (energy.length < COLS * ROWS) energy.push(0);
      }
    }

    // очень тёмные картинки растягиваем: нормируем на ~95-й перцентиль яркости
    function normalizeDark() {
      var vals = grid.slice().sort(function (a, b) { return a - b; });
      var p95 = vals[Math.floor(vals.length * 0.95)];
      if (p95 > 0.01) {
        for (var i = 0; i < grid.length; i++) grid[i] = Math.min(1, grid[i] / p95);
      }
    }

    // арт на всю hero-секцию: канвас растягиваем под весь блок .hero
    function heroBox() {
      var host = document.querySelector('.hero');
      return {
        w: (host && host.clientWidth) || 1120,
        h: (host && host.clientHeight) || 640
      };
    }
    // плотность: ограничиваем число ячеек, чтобы на большом экране не проседал FPS —
    // укрупняем ячейку (кратно базовой 4×7), пока ячеек не станет ~16 тыс.
    function pickCells() {
      var box = heroBox();
      var MAX = 16000;
      var sc = Math.max(1, Math.ceil(Math.sqrt(Math.max(1, box.w * box.h) / (4 * 7 * MAX))));
      var cw = 4 * sc, ch = 7 * sc;
      return {
        cols: Math.max(30, Math.round(box.w / cw)),
        rows: Math.max(12, Math.round(box.h / ch)),
        cellW: cw, cellH: ch
      };
    }
    var fadeX = [], fadeY = [];
    // края арта плавно растворяются в прозрачность — узкая полоса затухания,
    // чтобы не было резкого среза, но и без захвата большой площади:
    // ~3.5% ширины и ~4.5% высоты
    function makeFade() {
      var fw = Math.max(3, Math.round(COLS * 0.035));
      var fh = Math.max(3, Math.round(ROWS * 0.045));
      fadeX.length = 0; fadeY.length = 0;
      for (var c = 0; c < COLS; c++) {
        var dc = Math.min(c, COLS - 1 - c);
        fadeX.push(dc >= fw ? 1 : Math.pow(Math.max(0, dc) / fw, 1.3));
      }
      for (var r = 0; r < ROWS; r++) {
        var dr = Math.min(r, ROWS - 1 - r);
        fadeY.push(dr >= fh ? 1 : Math.pow(Math.max(0, dr) / fh, 1.3));
      }
    }
    // на телефонах/планшетах (шире 1024px арт не показываем) движок не запускаем
    var HERO_MQ = window.matchMedia && window.matchMedia('(min-width: 1025px)');
    function isWide() { return !HERO_MQ || HERO_MQ.matches; }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      started = false;
    }

    function buildFromImage(img) {
      var d = pickCells();
      COLS = d.cols; ROWS = d.rows;
      CELL_W = d.cellW; CELL_H = d.cellH;
      initSprites();
      makeFade();
      canvas.width = COLS * CELL_W * DPR;
      canvas.height = ROWS * CELL_H * DPR;
      canvas.style.width = (COLS * CELL_W) + 'px';
      canvas.style.height = (ROWS * CELL_H) + 'px';
      var gridAspect = (COLS * CELL_W) / (ROWS * CELL_H);
      // полный кадр в сетку (cover-fit): картинка заполняет весь hero
      var srcAspect = img.width / img.height;
      var sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (srcAspect > gridAspect) { sh = img.height; sw = sh * gridAspect; sx = (img.width - sw) / 2; }
      else { sw = img.width; sh = sw / gridAspect; sy = (img.height - sh) / 2; }
      sample(function (t) { t.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, ROWS); });
      normalizeDark();
      loadedImg = img;
      start();
    }

    function buildFromText() {
      var SRC_W = 720, SRC_H = 260;
      var src = document.createElement('canvas');
      src.width = SRC_W; src.height = SRC_H;
      var s = src.getContext('2d');
      s.clearRect(0, 0, SRC_W, SRC_H);
      s.fillStyle = '#fff';
      s.textAlign = 'center';
      s.textBaseline = 'middle';
      var fam = '"TechOnNotes","Courier New",monospace';
      var size = 150;
      s.font = '900 ' + size + 'px ' + fam;
      var w = s.measureText('ЛИНЕСС').width;
      if (w > SRC_W - 40) size = Math.floor(size * (SRC_W - 40) / w);
      s.font = '900 ' + size + 'px ' + fam;
      s.fillText('ЛИНЕСС', SRC_W / 2, SRC_H / 2 + 6);
      var d = pickCells();
      COLS = d.cols; ROWS = d.rows;
      CELL_W = d.cellW; CELL_H = d.cellH;
      initSprites();
      makeFade();
      canvas.width = COLS * CELL_W * DPR;
      canvas.height = ROWS * CELL_H * DPR;
      canvas.style.width = (COLS * CELL_W) + 'px';
      canvas.style.height = (ROWS * CELL_H) + 'px';
      sample(function (t) { t.drawImage(src, 0, 0, COLS, ROWS); });
      start();
    }

    function start() {
      if (started) return;
      started = true;
      animT0 = performance.now();
      render(!reduced);
    }

    function render(loop) {
      var W = COLS * CELL_W, H = ROWS * CELL_H; // логические CSS-пиксели
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);    // бэкинг-буфер в пикселях экрана — чёткие glyph'ы
      ctx.clearRect(0, 0, W, H);

      // полоса света 30°: бежит слева направо, но светит ТОЛЬКО сквозь символы
      var A = 30 * Math.PI / 180;
      var cosA = Math.cos(A), sinA = Math.sin(A);
      var nx = sinA, ny = -cosA;      // нормаль (движение — вправо-вверх)
      var nMin = Math.min(0, W * nx, H * ny, W * nx + H * ny);
      var nMax = Math.max(0, W * nx, H * ny, W * nx + H * ny);
      var halfW = Math.max(36, Math.round(W * 0.055));
      var sMin = nMin - halfW - 80, sMax = nMax + halfW + 80;
      var s = sMin + (((performance.now() - animT0) / 1000 * 240) % (sMax - sMin));

      var R = 4.5 * (9 / CELL_W); // радиус hover в ячейках — сохраняем физический размер ~40px
      var px = pointer ? pointer.x : -99, py = pointer ? pointer.y : -99;

      // проход 1: мягкий ореол — светящиеся символы рисуются чуть крупнее и аддитивно
      ctx.globalCompositeOperation = 'lighter';
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var i = r * COLS + c;
          var lum = grid[i];
          if (lum < 0.05) continue;
          var x = c * CELL_W + CELL_W / 2, y = r * CELL_H + CELL_H / 2;
          var beam = Math.max(0, 1 - Math.abs((x * nx + y * ny) - s) / halfW);
          var fa1 = fadeX[c] * fadeY[r];
          if (beam > 0.25 && fa1 > 0.04) {
            var gi = SPR.glow[Math.round(lum * (ASCII_RAMP.length - 1))];
            ctx.globalAlpha = beam * 0.35 * fa1;
            ctx.drawImage(gi, x - (CELL_W + 8) / 2, y - (CELL_H + 8) / 2);
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // проход 2: чёткие символы — в луче загораются белым
      for (var r2 = 0; r2 < ROWS; r2++) {
        for (var c2 = 0; c2 < COLS; c2++) {
          var i2 = r2 * COLS + c2;
          var lum2 = grid[i2];
          var e = energy[i2];
          var dc = c2 - px, dr = r2 - py;
          var d = Math.sqrt(dc * dc + dr * dr);
          var target = pointer ? Math.max(0, 1 - d / R) : 0;
          e += (target - e) * 0.13;
          energy[i2] = e;
          var x2 = c2 * CELL_W + CELL_W / 2, y2 = r2 * CELL_H + CELL_H / 2;
          var beam2 = Math.max(0, 1 - Math.abs((x2 * nx + y2 * ny) - s) / halfW);
          var a = (lum2 * 0.6 + beam2 * 0.95 + e * 0.6) * (fadeX[c2] * fadeY[r2]);
          if (a > 0.04) {
            var hot = (e > 0.16 || beam2 > 0.55);
            var s2 = hot ? SPR.white[Math.round(lum2 * (ASCII_RAMP.length - 1))]
                         : SPR.gray[Math.round(lum2 * (ASCII_RAMP.length - 1))];
            ctx.globalAlpha = hot ? Math.min(1, a) : Math.min(0.95, a);
            ctx.drawImage(s2, x2 - CELL_W / 2, y2 - CELL_H / 2);
          }
        }
      }
      ctx.globalAlpha = 1;
      if (loop) raf = requestAnimationFrame(function () { render(true); });
    }

    function onMove(e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX, y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        if (pointer) pointer = null;
        return;
      }
      pointer = {
        x: (x - rect.left) / rect.width * COLS,
        y: (y - rect.top) / rect.height * ROWS
      };
    }

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var imgFailed = false;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', function () {
      if (!isWide()) { stop(); return; }
      if (loadedImg) buildFromImage(loadedImg);
      else if (imgFailed) buildFromText();
    });

    var img = new Image();
    img.onload = function () {
      loadedImg = img;
      if (!isWide()) return; // на телефонах/планшетах арт скрыт — движок не запускаем
      buildFromImage(img);
    };
    img.onerror = function () {
      imgFailed = true;
      if (!isWide()) return;
      buildFromText();
    };
    img.src = 'assets/hero-ascii.webp';
  }

  function initScrollHint() {
    var hint = document.querySelector('.scroll-hint');
    if (!hint) return;
    function update() {
      hint.classList.toggle('hidden', (window.scrollY || 0) > 24);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initNavVar() {
    function update() {
      var nav = document.querySelector('.nav');
      document.documentElement.style.setProperty('--nav-h', (nav ? nav.offsetHeight : 70) + 'px');
    }
    update();
    window.addEventListener('resize', update, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  }

  function boot() {
    if (document.body && document.body.dataset.page === 'project') {
      initProjectPage();
      return;
    }
    initNavVar();
    initScrollHint();
    renderGhWidget();
    injectLangLogos();
    renderContrib();
    renderSocials();
    renderFaq();
    initSpotlight();
    initReveal();
    initSupportChat();
    bindCatNav();
    initCarouselDrag();
    initHeroAscii();

    fetch(DATA_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
      .then(function (d) {
        state.cats = d.categories || [];
        state.projects = d.projects || [];
        state.activeCat = state.cats.length ? state.cats[0].id : null;
        fitCatWord();
        renderProjects();
        syncCatWord();
      })
      .catch(function () {
        var track = document.getElementById('projects-grid');
        if (track) track.innerHTML = '<p class="projects-empty">' + T('projects.loadFailed') + '</p>';
      });
  }

  function refreshLanguage() {
    if (!window.I18N) return;
    if (document.body && document.body.dataset.page === 'project') {
      var root = document.getElementById('project-root');
      if (root && lastProject) renderProjectPage(root, lastProject);
      return;
    }
    var repos = document.getElementById('gh-repos');
    if (repos && repos.children.length) {
      repos.innerHTML = '';
      renderGhWidget();
    }
    var fl = document.getElementById('faq-list');
    if (fl) {
      fl.innerHTML = '';
      renderFaq();
    }
    renderContrib();
    if (state.cats.length) {
      var cat = null;
      for (var i = 0; i < state.cats.length; i++) {
        if (state.cats[i].id === state.activeCat) { cat = state.cats[i]; break; }
      }
      fitCatWord();
      updateCatWord(cat ? catLabel(cat) : '');
      renderProjects();
    }
    var inp = document.getElementById('chat-input');
    if (inp) inp.placeholder = T('chat.inputPh');
  }
  document.addEventListener('i18n:change', refreshLanguage);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
