/* ll1ness i18n — офлайн-переключатель языков (ru/en), мгновенно, без внешних сервисов */
(function () {
  'use strict';

  var STORAGE_KEY = 'll1ness_lang';

  var TR = {
    ru: {
      'nav.projects': 'Проекты',
      'nav.faq': 'FAQ',
      'nav.contacts': 'Контакты',
      'nav.github': 'GitHub →',
      'nav.aria': 'Язык сайта',
      'lang.ru': 'Русский',
      'lang.en': 'English',

      'marquee.aria': 'Бренды и сервисы, с которыми мы работаем',
      'hero.cta': 'Смотреть проекты',
      'hero.telegram': 'Telegram →',

      'widget.aria': 'Профиль GitHub',
      'widget.role': 'инди-разработчик',
      'widget.bio': 'Создаю веб и десктоп приложения с открытым исходным кодом. Кодинг — хобби.',
      'widget.activity': 'Публичная активность',
      'contrib.loading': 'Загрузка…',
      'contrib.alt': 'Вклад за последний год',
      'contrib.commits': '{n} коммитов',
      'repo.techone': 'Дизайн-фреймворк',
      'repo.spark': 'IDE для десктопа',
      'repo.weather': 'Погода на 16 дней',

      'cat.project': 'ПРОДЖЕКТ',
      'cat.arcade': 'АРКЕЙД',
      'cat.prev': 'Предыдущая категория',
      'cat.next': 'Следующая категория',
      'projects.eyebrow': 'проекты',
      'projects.carouselAria': 'Карусель проектов',
      'projects.dotsAria': 'Навигация по проектам',
      'projects.loading': 'Загрузка…',
      'projects.empty': 'Пока пусто.',
      'projects.loadFailed': 'Не удалось загрузить проекты.',
      'projects.dot': 'Проект {i} из {n}',
      'card.more': 'Подробнее',
      'card.shot': 'скриншот {n}',
      'card.anim': 'анимация',

      'faq.title': 'Частые вопросы.',
      'faq.1.title': 'Кто ты такой?',
      'faq.1.content': 'Начинающий software engineer и web-разработчик. Создаю веб-приложения, десктопные программы и API. Кодинг — моё хобби.',
      'faq.2.title': 'Какие проекты ты делаешь?',
      'faq.2.content': 'Работаю над TechOne UI (дизайн-фреймворк), Spark Studio (IDE на JavaFX/JPHP), Weather Seeker и другими открытыми проектами на GitHub.',
      'faq.3.title': 'Как с тобой связаться?',
      'faq.3.content': 'Лучший способ — Discord (виджет на странице контактов). Также можно написать на GitHub или в Steam.',
      'faq.4.title': 'Ты используешь AI в разработке?',
      'faq.4.content': 'Да, использую профессиональные AI-инструменты для ускорения разработки, но это не vibecode — каждая строка осмысленна.',
      'faq.5.title': 'Какие технологии ты знаешь?',
      'faq.5.content': 'Веб: HTML, CSS, JavaScript, Three.js. Бэкенд: PHP, Java, Node.js, Python. Инструменты: Git, Docker, AI-assisted coding.',

      'contacts.eyebrow': 'контакты',
      'contacts.title': 'Связаться со мной.',
      'contacts.sub': 'Быстрее всего отвечаю в Discord.',
      'contacts.discord.title': 'Discord',
      'contacts.discord.sub': 'Сообщество и личные сообщения',
      'contacts.social.title': 'Соцсети',
      'contacts.social.sub': 'Профили и репозитории',

      'foot.dev': 'Для разработчиков',
      'foot.home': '← На главную',
      'foot.top': '↑ Top',
      'top.aria': 'Наверх',

      'chat.aria.panel': 'Чат с поддержкой',
      'chat.title': 'Поддержка',
      'chat.sub': 'отвечаем в Discord',
      'chat.closeAria': 'Закрыть чат',
      'chat.inputPh': 'Написать сообщение…',
      'chat.openAria': 'Открыть чат поддержки',
      'chat.closeAriaFull': 'Закрыть чат поддержки',
      'chat.welcome': 'Привет! Живой оператор здесь не отвечает — быстрее всего создать обращение в Discord. Выбери способ связи:',
      'chat.copied': 'Сообщение скопировано в буфер обмена. Вставь его в обращение в Discord — ⁠﹕🎲﹒ticket﹒, и модераторы ответят.',
      'chat.fallback': 'Не удалось скопировать автоматически. Скопируй текст вручную и вставь его в обращение в Discord — ⁠﹕🎲﹒ticket﹒.',
      'chat.ch1.label': 'Discord · обращение в саппорт',
      'chat.ch1.hint': '🎲﹒ticket',
      'chat.ch2.hint': 'репозитории',
      'chat.ch3.hint': 'личные сообщения',

      'dev.eyebrow': 'инструменты',
      'dev.title': 'Софт для разработчиков.',
      'dev.sub': 'Инструменты, плагины и библиотеки с открытым исходным кодом.',
      'dev.note': 'Раздел пополняется по мере выхода новых инструментов.',
      'dev.spark.tagline': 'Магазин расширений для Spark Studio 18',
      'dev.spark.desc': 'Spark Store — репозиторий и магазин расширений для Spark Studio. Позволяет устанавливать, обновлять и управлять плагинами прямо из IDE. Все расширения с открытым исходным кодом.',

      'project.crumb': '← Все проекты',
      'project.desktopBtn': 'Установить',
      'project.modalTitle': 'Варианты установки · {name}',
      'project.modalSub': 'Выберите свою платформу',
      'project.modalClose': 'Закрыть',
      'project.license': 'Под защитой лицензии {L}',
      'project.about': 'О проекте',
      'project.req': 'Системные требования',
      'project.noId': 'Не указан проект.',
      'project.notFound': 'Проект не найден.',
      'project.loadFailed': 'Не удалось загрузить проект.',

      'dl.Демо': 'Демо',
      'dl.Сайт': 'Сайт',
      'dl.GitHub': 'GitHub',

      'title.index': 'll1ness — инди-разработчик | Веб, десктоп и открытые проекты',
      'title.dev': 'll1ness — Для разработчиков | Инструменты и софт',
      'title.project': 'll1ness — проект'
    },

    en: {
      'nav.projects': 'Projects',
      'nav.faq': 'FAQ',
      'nav.contacts': 'Contacts',
      'nav.github': 'GitHub →',
      'nav.aria': 'Site language',
      'lang.ru': 'Русский',
      'lang.en': 'English',

      'marquee.aria': 'Brands and services we work with',
      'hero.cta': 'View projects',
      'hero.telegram': 'Telegram →',

      'widget.aria': 'GitHub profile',
      'widget.role': 'indie developer',
      'widget.bio': 'I build open-source web and desktop apps. Coding is my hobby.',
      'widget.activity': 'Public activity',
      'contrib.loading': 'Loading…',
      'contrib.alt': 'Last year contribution',
      'contrib.commits': '{n} commits',
      'repo.techone': 'Design framework',
      'repo.spark': 'Desktop IDE',
      'repo.weather': '16-day weather',

      'cat.project': 'PROJECT',
      'cat.arcade': 'ARCADE',
      'cat.prev': 'Previous category',
      'cat.next': 'Next category',
      'projects.eyebrow': 'projects',
      'projects.carouselAria': 'Projects carousel',
      'projects.dotsAria': 'Project navigation',
      'projects.loading': 'Loading…',
      'projects.empty': 'Nothing here yet.',
      'projects.loadFailed': 'Failed to load projects.',
      'projects.dot': 'Project {i} of {n}',
      'card.more': 'Details',
      'card.shot': 'screenshot {n}',
      'card.anim': 'animation',

      'faq.title': 'Frequently asked questions.',
      'faq.1.title': 'Who are you?',
      'faq.1.content': 'A junior software engineer and web developer. I build web apps, desktop programs and APIs. Coding is my hobby.',
      'faq.2.title': 'What projects do you work on?',
      'faq.2.content': 'I work on TechOne UI (design framework), Spark Studio (JavaFX/JPHP IDE), Weather Seeker and other open-source projects on GitHub.',
      'faq.3.title': 'How do I contact you?',
      'faq.3.content': 'The best way is Discord (the widget on the contacts page). You can also reach me on GitHub or Steam.',
      'faq.4.title': 'Do you use AI in development?',
      'faq.4.content': 'Yes, I use professional AI tools to speed up development, but it is not vibecoding — every line is intentional.',
      'faq.5.title': 'Which technologies do you know?',
      'faq.5.content': 'Web: HTML, CSS, JavaScript, Three.js. Backend: PHP, Java, Node.js, Python. Tools: Git, Docker, AI-assisted coding.',

      'contacts.eyebrow': 'contacts',
      'contacts.title': 'Get in touch.',
      'contacts.sub': 'Fastest to reach me on Discord.',
      'contacts.discord.title': 'Discord',
      'contacts.discord.sub': 'Community & direct messages',
      'contacts.social.title': 'Socials',
      'contacts.social.sub': 'Profiles and repositories',

      'foot.dev': 'For developers',
      'foot.home': '← Back home',
      'foot.top': '↑ Top',
      'top.aria': 'Back to top',

      'chat.aria.panel': 'Support chat',
      'chat.title': 'Support',
      'chat.sub': 'we reply on Discord',
      'chat.closeAria': 'Close chat',
      'chat.inputPh': 'Type a message…',
      'chat.openAria': 'Open support chat',
      'chat.closeAriaFull': 'Close support chat',
      'chat.welcome': 'Hi! There is no live operator here — the fastest way is to open a ticket on Discord. Choose a channel:',
      'chat.copied': 'Message copied to the clipboard. Paste it into your Discord ticket — ⁠﹕🎲﹒ticket﹒, and moderators will reply.',
      'chat.fallback': 'Could not copy automatically. Copy the text manually and paste it into your Discord ticket — ⁠﹕🎲﹒ticket﹒.',
      'chat.ch1.label': 'Discord · support ticket',
      'chat.ch1.hint': '🎲﹒ticket',
      'chat.ch2.hint': 'repositories',
      'chat.ch3.hint': 'direct messages',

      'dev.eyebrow': 'tools',
      'dev.title': 'Software for developers.',
      'dev.sub': 'Open-source tools, plugins and libraries.',
      'dev.note': 'This section grows as new tools ship.',
      'dev.spark.tagline': 'Extension store for Spark Studio 18',
      'dev.spark.desc': 'Spark Store is a repository and extension marketplace for Spark Studio. Install, update and manage plugins right from the IDE. All extensions are open source.',

      'project.crumb': '← All projects',
      'project.desktopBtn': 'Install',
      'project.modalTitle': 'Install options · {name}',
      'project.modalSub': 'Choose your platform',
      'project.modalClose': 'Close',
      'project.license': 'Protected under the {L} license',
      'project.about': 'About',
      'project.req': 'System requirements',
      'project.noId': 'No project specified.',
      'project.notFound': 'Project not found.',
      'project.loadFailed': 'Failed to load the project.',

      'dl.Демо': 'Demo',
      'dl.Сайт': 'Website',
      'dl.GitHub': 'GitHub',

      'title.index': 'll1ness — indie developer | Web, desktop & open-source projects',
      'title.dev': 'll1ness — For developers | Tools & software',
      'title.project': 'll1ness — project'
    }
  };

  var lang = null;

  function getSaved() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return (v === 'ru' || v === 'en') ? v : null;
    } catch (e) { return null; }
  }

  function detect() {
    try {
      var l = (navigator.language || 'ru').toLowerCase();
      return l.indexOf('ru') === 0 ? 'ru' : 'en';
    } catch (e) { return 'ru'; }
  }

  function current() { return lang || 'ru'; }

  function t(key, params) {
    var s = (TR[lang] && TR[lang][key] !== undefined) ? TR[lang][key]
          : (TR.ru[key] !== undefined ? TR.ru[key] : key);
    if (params) {
      Object.keys(params).forEach(function (k) {
        s = s.split('{' + k + '}').join(params[k]);
      });
    }
    return s;
  }

  /* ---- статический DOM: [data-i18n], [data-i18n-aria], [data-i18n-ph], [data-i18n-title] ---- */
  function applyStatic() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      var key = e.getAttribute('data-i18n');
      if (key) e.textContent = t(key);
    }
    var aria = document.querySelectorAll('[data-i18n-aria]');
    for (var a = 0; a < aria.length; a++) {
      aria[a].setAttribute('aria-label', t(aria[a].getAttribute('data-i18n-aria')));
    }
    var ph = document.querySelectorAll('[data-i18n-ph]');
    for (var p = 0; p < ph.length; p++) {
      ph[p].placeholder = t(ph[p].getAttribute('data-i18n-ph'));
    }
    var ti = document.querySelectorAll('[data-i18n-title]');
    for (var tt = 0; tt < ti.length; tt++) {
      ti[tt].setAttribute('title', t(ti[tt].getAttribute('data-i18n-title')));
    }
  }

  function updateFlags() {
    var btns = document.querySelectorAll('.lang-btn[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  function setLang(next) {
    if (next !== 'ru' && next !== 'en') return;
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    document.documentElement.setAttribute('lang', lang);
    applyStatic();
    updateFlags();
    try {
      document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
    } catch (e) { /* ignore */ }
  }

  function bind() {
    var btns = document.querySelectorAll('.lang-btn[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      (function (b) {
        b.addEventListener('click', function () {
          setLang(b.getAttribute('data-lang'));
        });
      })(btns[i]);
    }
  }

  function init() {
    lang = getSaved() || detect();
    document.documentElement.setAttribute('lang', lang);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        bind();
        applyStatic();
        updateFlags();
      });
    } else {
      bind();
      applyStatic();
      updateFlags();
    }
  }

  window.I18N = { t: t, current: current, setLang: setLang };
  init();
})();