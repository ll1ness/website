(function () {
  'use strict';

  var DATA_URL = document.body.dataset.project ? '../projects.json' : 'projects.json';

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

  var state = { projects: [] };

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

  function renderProjects() {
    var grids = document.querySelectorAll('.projects-grid[data-line]');
    grids.forEach(function (grid) {
      var line = grid.dataset.line;
      grid.innerHTML = '';
      var list = state.projects.filter(function (p) { return p.line === line; });
      if (!list.length) {
        grid.appendChild(el('p', 'line-empty', 'Скоро'));
        return;
      }
      list.forEach(function (p) {
        var c = projectCard(p);
        c.classList.add('reveal');
        grid.appendChild(c);
      });
    });
    requestAnimationFrame(function () {
      document.querySelectorAll('.projects-grid .reveal').forEach(function (n) { n.classList.add('in'); });
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

    if (p.page) {
      var btn = el('a', 'project-btn', 'Подробнее <span aria-hidden="true">→</span>');
      btn.href = p.page;
      btn.addEventListener('click', function (e) { e.stopPropagation(); });
      body.appendChild(btn);
    }
    card.appendChild(body);

    card.addEventListener('click', function () {
      if (p.page) window.location.href = p.page;
    });
    return card;
  }

  /* ---------- Standalone project page (Steam-like) ---------- */

  function buildShots(p) {
    var slides = (p.screenshots || []).slice();
    if (!slides.length) return '';
    var html = '<div class="pp-shots">';
    html += '<img class="pp-shot-main" src="' + slides[0] + '" alt="' + p.name + ' — скриншот" data-src="' + slides[0] + '">';
    if (slides.length > 1) {
      html += '<div class="pp-shots-thumbs">';
      slides.forEach(function (s, i) {
        html += '<img class="pp-thumb' + (i === 0 ? ' active' : '') + '" src="' + s + '" alt="Скриншот ' + (i + 1) + '" data-index="' + i + '" loading="lazy">';
      });
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function bindShots(p) {
    var main = document.querySelector('.pp-shot-main');
    if (!main) return;
    main.addEventListener('click', function () { openLightbox(main.dataset.src); });
    document.querySelectorAll('.pp-thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        var src = p.screenshots[parseInt(t.dataset.index, 10)];
        if (!src) return;
        main.src = src;
        main.dataset.src = src;
        document.querySelectorAll('.pp-thumb').forEach(function (x) {
          x.classList.toggle('active', x === t);
        });
      });
    });
  }

  function readProjectData() {
    var node = document.getElementById('project-data');
    if (!node) return null;
    try {
      return JSON.parse(node.textContent);
    } catch (e) {
      return null;
    }
  }

  function renderProjectPage(p) {
    var root = document.getElementById('project-page');
    if (!root) return;
    if (!p) {
      root.innerHTML = '<p style="color:#666;">Проект не найден.</p>';
      return;
    }

    var dls = (p.downloads || []).filter(function (d) { return d.url && d.url !== '#'; });

    var html = '';

    html += '<nav class="pp-breadcrumb"><a href="/">ll1ness</a> <span>›</span> <a href="/#projects">Проекты</a> <span>›</span> <span>' + p.name + '</span></nav>';

    html += '<header class="pp-banner">';
    if (p.logo) {
      html += '<img class="pp-banner-logo" src="' + p.logo + '" alt="">';
    } else {
      html += '<div class="pp-banner-logo placeholder">' + (p.icon || '📄') + '</div>';
    }
    html += '<div class="pp-banner-main">';
    html += '<h1 class="pp-banner-title">' + p.name + '</h1>';
    html += '<p class="pp-banner-tagline">' + p.tagline + '</p>';
    html += '<span class="pp-banner-badge' + (p.warn ? '' : ' soon') + '">' + (p.warn ? '⚙ Ранний доступ' : 'Open Source') + '</span>';
    html += '</div>';
    html += '</header>';

    html += '<div class="pp-layout">';

    html += '<div class="pp-main">';
    html += '<section><h2 class="pp-block-title">О проекте</h2><div class="pp-about"><p>' + p.description + '</p></div></section>';
    if (p.warn) html += '<div class="pp-warn">' + p.warn + '</div>';
    if (p.screenshots && p.screenshots.length) {
      html += '<section><h2 class="pp-block-title">Медиа</h2>' + buildShots(p) + '</section>';
    }
    html += '</div>';

    html += '<aside class="pp-side">';

    html += '<div class="pp-side-box">';
    html += '<h3>Доступно</h3>';
    html += '<div class="pp-price">Бесплатно<small>Open Source · MIT</small></div>';
    dls.forEach(function (d, i) {
      html += '<a class="pp-dl' + (i > 0 ? ' sec' : '') + '" href="' + d.url + '" target="_blank" rel="noopener">' + d.label + ' →</a>';
    });
    html += '<div class="pp-meta-row"><span>Разработчик</span><b>ll1ness</b></div>';
    html += '<div class="pp-meta-row"><span>Лицензия</span><b>MIT</b></div>';
    html += '<div class="pp-meta-row"><span>Статус</span><b>Открытый</b></div>';
    html += '</div>';

    if (p.tags && p.tags.length) {
      html += '<div class="pp-side-box"><h3>Теги</h3><div class="pp-tags">' + p.tags.map(function (t) { return '<span class="pp-tag">' + t + '</span>'; }).join('') + '</div></div>';
    }

    if (dls.length) {
      html += '<div class="pp-side-box"><h3>Ссылки</h3><div class="pp-side-links">';
      dls.forEach(function (d) {
        html += '<a class="pp-side-link" href="' + d.url + '" target="_blank" rel="noopener"><span>' + d.label + '</span><span class="arr">→</span></a>';
      });
      html += '<a class="pp-side-link" href="/"><span>На главный сайт</span><span class="arr">→</span></a>';
      html += '</div></div>';
    }

    html += '</aside>';
    html += '</div>';

    root.innerHTML = html;
    if (p.screenshots && p.screenshots.length) bindShots(p);
  }

  /* ---------- Lightbox ---------- */

  function openLightbox(src) {
    var img = document.getElementById('lightbox-img');
    var box = document.getElementById('lightbox');
    if (!img || !box) return;
    img.src = src;
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    var box = document.getElementById('lightbox');
    if (!box) return;
    box.classList.remove('open');
    document.body.style.overflow = '';
  }

  function bindLightbox() {
    var bg = document.getElementById('lightbox-bg');
    var close = document.getElementById('lightbox-close');
    if (bg) bg.addEventListener('click', closeLightbox);
    if (close) close.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
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

  /* ---------- Support chat ---------- */

  var CHAT_CHANNELS = [
    { label: 'Discord · обращение в саппорт', hint: '🎲﹒ticket', href: 'https://discord.gg/nEcnZKQuCf' },
    { label: 'GitHub Issues', hint: 'репозитории', href: 'https://github.com/ll1ness' },
    { label: 'Steam', hint: 'личные сообщения', href: 'https://steamcommunity.com/id/ll1ness/' }
  ];

  function initSupportChat() {
    var widget = document.getElementById('chat-widget');
    var launcher = document.getElementById('chat-launcher');
    var panel = document.getElementById('chat-panel');
    var closeBtn = document.getElementById('chat-close');
    var body = document.getElementById('chat-body');
    var form = document.getElementById('chat-form');
    var input = document.getElementById('chat-input');
    if (!widget || !launcher || !panel || !closeBtn || !body || !form || !input) return;

    var booted = false;

    function msg(text, who) {
      var m = el('div', 'msg ' + who);
      m.textContent = text;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      return m;
    }

    function welcome() {
      if (booted) return;
      booted = true;
      msg('Привет! Живой оператор здесь не отвечает — быстрее всего создать обращение в Discord. Выбери способ связи:', 'bot');
      var wrap = el('div', 'chat-channels');
      CHAT_CHANNELS.forEach(function (c) {
        var a = el('a', 'chat-channel');
        a.href = c.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<span>' + c.label + '</span><span class="arr">' + c.hint + ' →</span>';
        wrap.appendChild(a);
      });
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }

    function setOpen(open) {
      widget.classList.toggle('open', open);
      launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
      launcher.setAttribute('aria-label', open ? 'Закрыть чат поддержки' : 'Открыть чат поддержки');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        welcome();
        setTimeout(function () { input.focus(); }, 250);
      }
    }

    launcher.addEventListener('click', function () {
      setOpen(!widget.classList.contains('open'));
    });
    closeBtn.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && widget.classList.contains('open')) setOpen(false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      msg(text, 'user');
      input.value = '';

      function fallback() {
        msg('Не удалось скопировать автоматически. Скопируй текст вручную и вставь его в обращение в Discord — ⁠﹕🎲﹒ticket﹒.', 'bot');
      }
      setTimeout(function () {
        try {
          navigator.clipboard.writeText(text).then(
            function () {
              msg('Сообщение скопировано в буфер обмена. Вставь его в обращение в Discord — ⁠﹕🎲﹒ticket﹒, и модераторы ответят.', 'bot');
            },
            fallback
          );
        } catch (err) {
          fallback();
        }
      }, 350);
    });
  }

  /* ---------- Boot ---------- */

  function boot() {
    var isProject = !!document.body.dataset.project;

    if (isProject) {
      bindLightbox();
      var embedded = readProjectData();
      if (embedded) {
        renderProjectPage(embedded);
        return;
      }
      var slug = document.body.dataset.project;
      fetch(DATA_URL)
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
        .then(function (d) {
          var p = (d.projects || []).find(function (x) { return x.id === slug; });
          renderProjectPage(p);
        })
        .catch(function () {
          var root = document.getElementById('project-page');
          if (root) root.innerHTML = '<p style="color:#666;">Не удалось загрузить проект.</p>';
        });
      return;
    }

    renderGhWidget();
    injectLangLogos();
    renderContrib();
    renderSocials();
    renderFaq();
    bindLightbox();
    initSpotlight();
    initReveal();
    initSupportChat();

    fetch(DATA_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
      .then(function (d) {
        state.projects = d.projects || [];
        renderProjects();
      })
      .catch(function () {
        document.querySelectorAll('.projects-grid[data-line]').forEach(function (grid) {
          grid.innerHTML = '<p class="line-empty">Не удалось загрузить проекты.</p>';
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
