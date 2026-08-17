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
    }
  ];

  var REPOS = [
    { logo: '/assets/techone.png', name: 'techone-ui', lang: 'CSS · TS', desc: 'Дизайн-фреймворк' },
    { logo: '/assets/sparkstudio.png', name: 'spark-studio', lang: 'Java · JPHP', desc: 'IDE для десктопа' },
    { logo: '/assets/weatherseeker.png', name: 'weather-seeker', lang: 'JS · API', desc: 'Погода на 16 дней' }
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
    {
      title: 'Кто ты такой?',
      content: 'Начинающий software engineer и web-разработчик. Создаю веб-приложения, десктопные программы и API. Кодинг — моё хобби.'
    },
    {
      title: 'Какие проекты ты делаешь?',
      content: 'Работаю над TechOne UI (дизайн-фреймворк), Spark Studio (IDE на JavaFX/JPHP), Weather Seeker и другими открытыми проектами на GitHub.'
    },
    {
      title: 'Как с тобой связаться?',
      content: 'Лучший способ — Discord (виджет на странице контактов). Также можно написать на GitHub или в Steam.'
    },
    {
      title: 'Ты используешь AI в разработке?',
      content: 'Да, использую профессиональные AI-инструменты для ускорения разработки, но это не vibecode — каждая строка осмысленна.'
    },
    {
      title: 'Какие технологии ты знаешь?',
      content: 'Веб: HTML, CSS, JavaScript, Three.js. Бэкенд: PHP, Java, Node.js, Python. Инструменты: Git, Docker, AI-assisted coding.'
    }
  ];

  var state = { projects: [], cats: [], activeCat: 'all' };

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
    box.innerHTML = '<span class="contrib-loading">Загрузка…</span>';
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
          cell.title = key + ': ' + n + ' коммитов';
          week.appendChild(cell);
          cur.setDate(cur.getDate() + 1);
        }
        box.innerHTML = '';
        box.appendChild(grid);
      })
      .catch(function () {
        box.innerHTML = '<img src="https://ghchart.rshah.org/ll1ness" alt="Вклад за последний год">';
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
        meta.appendChild(el('div', 'gh-repo-desc', r.desc));
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

  function renderFilters() {
    var row = document.getElementById('filter-row');
    if (!row) return;
    var chips = [{ id: 'all', label: 'Все' }].concat(state.cats);
    chips.forEach(function (c) {
      var chip = el('button', 'filter-chip' + (c.id === state.activeCat ? ' active' : ''), c.label);
      chip.type = 'button';
      chip.dataset.cat = c.id;
      chip.addEventListener('click', function () {
        state.activeCat = c.id;
        row.querySelectorAll('.filter-chip').forEach(function (b) {
          b.classList.toggle('active', b.dataset.cat === state.activeCat);
        });
        renderProjects();
      });
      row.appendChild(chip);
    });
  }

  function buildCarousel(p) {
    var slides = (p.screenshots || []).slice();
    if (!slides.length && p.gif) slides.push(p.gif);
    if (!slides.length) return null;

    var wrap = el('div', 'project-carousel' + (slides.length < 2 ? ' single' : ''));
    var track = el('div', 'project-carousel-track');
    slides.forEach(function (src, i) {
      var img = el('img', 'project-carousel-slide');
      img.src = src;
      img.alt = p.name + ' — ' + (i === 0 && p.gif && !p.screenshots.length ? 'анимация' : 'скриншот ' + (i + 1));
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

  function projectCard(p) {
    var card = el('div', 'project-card');
    card.dataset.id = p.id;

    var carousel = buildCarousel(p);
    if (carousel) {
      card.appendChild(carousel);
    } else {
      card.appendChild(el('div', 'project-thumb-placeholder', p.icon || '📄'));
    }

    var body = el('div', 'to-card-body');
    body.appendChild(el('div', 'project-title', (p.icon || '📄') + ' ' + p.name));
    body.appendChild(el('div', 'project-tagline', p.tagline));

    if (p.tags && p.tags.length) {
      var tags = el('div', 'project-tags');
      p.tags.forEach(function (t) {
        tags.appendChild(el('span', 'to-tag', t));
      });
      body.appendChild(tags);
    }
    card.appendChild(body);

    card.addEventListener('click', function () { openProjectDialog(p.id); });
    return card;
  }

  function renderProjects() {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    var list = state.activeCat === 'all'
      ? state.projects
      : state.projects.filter(function (p) { return p.cat === state.activeCat; });

    if (!list.length) {
      grid.appendChild(el('p', '', 'Пока пусто.'));
      return;
    }
    list.forEach(function (p) {
      var c = projectCard(p);
      c.classList.add('reveal');
      grid.appendChild(c);
    });
    requestAnimationFrame(function () {
      grid.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
    });
  }

  /* ---------- Dialog ---------- */

  var dialog = null;
  var dialogBody = null;
  var dialogActions = null;
  var lightboxEl = null;

  function getDialog() {
    if (dialog) return;
    dialog = document.getElementById('project-dialog');
    dialogBody = document.getElementById('project-dialog-body');
    dialogActions = document.getElementById('project-dialog-actions');
    lightboxEl = document.getElementById('lightbox');
  }

  function closeDialog() {
    if (!dialog) return;
    dialog.style.display = 'none';
    document.body.style.overflow = '';
  }

  function openProjectDialog(id) {
    getDialog();
    var p = state.projects.find(function (x) { return x.id === id; });
    if (!p || !dialogBody) return;

    var parts = [];

    var head = '<div class="pd-head">';
    head += '<div class="pd-head-main">';
    if (p.logo) {
      head += '<img class="pd-logo" src="' + p.logo + '" alt="' + p.name + '">';
    }
    head += '<div class="pd-head-text"><h2>' + p.name + '</h2>';
    head += '<p class="to-dialog-tagline">' + p.tagline + '</p></div>';
    head += '</div>';
    if (p.gif) {
      head += '<img class="pd-gif" src="' + p.gif + '" alt="' + p.name + ' — анимация">';
    }
    head += '</div>';
    parts.push(head);

    if (p.warn) {
      parts.push('<div class="pd-warn">' + p.warn + '</div>');
    }

    parts.push('<div class="pd-desc">' + p.description + '</div>');

    if (p.screenshots && p.screenshots.length) {
      parts.push(renderShots(p));
    }

    if (p.tags && p.tags.length) {
      var tags = '<div class="pd-tags">' + p.tags.map(function (t) { return '<span>#' + t + '</span>'; }).join('') + '</div>';
      parts.push(tags);
    }

    dialogBody.innerHTML = parts.join('');

    dialogActions.innerHTML = '';
    if (p.downloads && p.downloads.length) {
      p.downloads.forEach(function (d) {
        if (!d.url || d.url === '#') return;
        var a = document.createElement('a');
        a.className = 'to-button';
        a.href = d.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = d.label + ' →';
        dialogActions.appendChild(a);
      });
    }

    bindShotsNav();
    dialog.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function renderShots(p) {
    var shots = p.screenshots;
    var html = '<div class="pd-shots">';
    html += '<div class="ss-track" id="ss-track">';
    shots.forEach(function (src, i) {
      html += '<img src="' + src + '" alt="' + p.name + ' — скриншот ' + (i + 1) + '" data-src="' + src + '">';
    });
    html += '</div>';
    if (shots.length > 1) {
      html += '<button class="ss-nav prev" id="ss-prev" aria-label="Назад">‹</button>';
      html += '<button class="ss-nav next" id="ss-next" aria-label="Вперёд">›</button>';
    }
    html += '</div>';
    html += '<div class="ss-dots" id="ss-dots">';
    shots.forEach(function (_, i) {
      html += '<button class="ss-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" aria-label="Скриншот ' + (i + 1) + '"></button>';
    });
    html += '</div>';
    return html;
  }

  var ssIndex = 0;
  function bindShotsNav() {
    var track = document.getElementById('ss-track');
    if (!track) return;
    var imgs = track.querySelectorAll('img');
    var count = imgs.length;
    ssIndex = 0;

    var setIndex = function (i) {
      ssIndex = (i + count) % count;
      track.style.transform = 'translateX(-' + ssIndex * 100 + '%)';
      var dots = document.getElementById('ss-dots');
      if (dots) {
        dots.querySelectorAll('.ss-dot').forEach(function (d, j) {
          d.classList.toggle('active', j === ssIndex);
        });
      }
    };

    var prev = document.getElementById('ss-prev');
    var next = document.getElementById('ss-next');
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); setIndex(ssIndex - 1); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); setIndex(ssIndex + 1); });

    var dots = document.getElementById('ss-dots');
    if (dots) {
      dots.querySelectorAll('.ss-dot').forEach(function (d) {
        d.addEventListener('click', function () { setIndex(parseInt(d.dataset.index, 10)); });
      });
    }

    imgs.forEach(function (img) {
      img.addEventListener('click', function () {
        openLightbox(img.dataset.src);
      });
    });
  }

  /* ---------- Lightbox ---------- */

  function openLightbox(src) {
    getDialog();
    if (!lightboxEl) return;
    var img = document.getElementById('lightbox-img');
    img.src = src;
    lightboxEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  function bindLightbox() {
    var bg = document.getElementById('lightbox-bg');
    var close = document.getElementById('lightbox-close');
    if (bg) bg.addEventListener('click', closeLightbox);
    if (close) close.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeLightbox();
        closeDialog();
      }
    });
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
      var trigger = el('button', 'to-accordion-trigger', item.title + ' <span class="to-accordion-icon">▼</span>');
      var content = el('div', 'to-accordion-content');
      content.appendChild(el('div', 'to-accordion-content-inner', item.content));
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

  /* ---------- Boot ---------- */

  function boot() {
    renderGhWidget();
    injectLangLogos();
    renderContrib();
    renderSocials();
    renderFaq();
    bindLightbox();
    initSpotlight();
    initReveal();

    fetch(DATA_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
      .then(function (d) {
        state.cats = d.categories || [];
        state.projects = d.projects || [];
        renderFilters();
        renderProjects();
      })
      .catch(function () {
        var grid = document.getElementById('projects-grid');
        if (grid) grid.innerHTML = '<p style="text-align:center;color:#555;grid-column:1/-1;">Не удалось загрузить проекты.</p>';
      });

    var dialogEl = document.getElementById('project-dialog');
    if (dialogEl) {
      dialogEl.querySelectorAll('.to-dialog-close').forEach(function (b) {
        b.addEventListener('click', closeDialog);
      });
      var overlay = dialogEl.querySelector('.to-dialog-overlay');
      if (overlay) overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeDialog();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
