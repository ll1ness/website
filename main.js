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
    { icon: '🎨', name: 'techone-ui', lang: 'CSS · TS', desc: 'Дизайн-фреймворк' },
    { icon: '⚡', name: 'spark-studio', lang: 'Java · JPHP', desc: 'IDE для десктопа' },
    { icon: '🌤️', name: 'weather-seeker', lang: 'JS · API', desc: 'Погода на 16 дней' }
  ];

  var LANG_DOTS = ['#f1e05a', '#b07219', '#3572A5'];

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

  function buildGhCells() {
    var cells = [];
    var seed = 42;
    var rand = function () {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (var i = 0; i < 144; i++) {
      var r = rand();
      cells.push(r > 0.72 ? 'on' : r > 0.45 ? 'soft' : '');
    }
    return cells;
  }

  function renderGhWidget() {
    var grid = document.getElementById('gh-grid');
    if (grid) {
      buildGhCells().forEach(function (c) {
        grid.appendChild(el('span', 'gh-cell ' + c));
      });
    }
    var repos = document.getElementById('gh-repos');
    if (repos) {
      REPOS.forEach(function (r, i) {
        var row = el('div', 'gh-repo');
        var left = el('div', '', r.icon + ' <div><div class="gh-repo-name">' + r.name + '</div><div class="gh-repo-desc">' + r.desc + '</div></div>');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '8px';
        var lang = el('div', 'gh-repo-lang');
        lang.innerHTML = '<span class="lang-dot" style="background:' + LANG_DOTS[i % LANG_DOTS.length] + ';"></span>' + r.lang;
        row.appendChild(left);
        row.appendChild(lang);
        repos.appendChild(row);
      });
    }
  }

  function renderMarquee() {
    var track = document.getElementById('marquee-track');
    if (!track) return;
    var items = ['Open-source.', 'Community-driven.', 'Indie-made.'];
    var seq = items.concat(items);
    seq.forEach(function (t) {
      var it = el('span', 'marquee-item', t + ' <i></i>');
      track.appendChild(it);
    });
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

  function projectCard(p) {
    var card = el('div', 'project-card');
    card.dataset.id = p.id;

    if (p.screenshots && p.screenshots.length) {
      var img = el('img', 'project-thumb');
      img.src = p.screenshots[0];
      img.alt = p.name;
      img.loading = 'lazy';
      img.onerror = function () { img.style.display = 'none'; };
      card.appendChild(img);
    } else {
      var ph = el('div', 'project-thumb-placeholder', p.icon || '📄');
      card.appendChild(ph);
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
    list.forEach(function (p) { grid.appendChild(projectCard(p)); });
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

    if (p.logo) {
      parts.push('<img class="pd-logo" src="' + p.logo + '" alt="' + p.name + '">');
    }

    if (p.gif) {
      parts.push('<img class="pd-gif" src="' + p.gif + '" alt="' + p.name + ' — анимация">');
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

    var title = el('h2', '', p.name);
    dialogBody.insertBefore(title, dialogBody.firstChild);
    dialogBody.insertBefore(el('p', 'to-dialog-tagline', p.tagline), dialogBody.firstChild.nextSibling);

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

  /* ---------- Boot ---------- */

  function boot() {
    renderGhWidget();
    renderMarquee();
    renderSocials();
    renderFaq();
    bindLightbox();

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
