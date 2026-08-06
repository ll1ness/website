export const pages = [
  { title: 'll1ness', html: `<div class="about-hero"><span class="about-title">ll1ness.</span><div class="about-actions"><a href="https://github.com/ll1ness" target="_blank" rel="noopener" class="to-button" data-variant="primary">GitHub</a><a href="https://discord.gg/nEcnZKQuCf" target="_blank" rel="noopener" class="to-button">Discord</a></div></div>` },
  { title: 'Проекты', html: `<p class="overlay-label">ПОРТФОЛИО</p><h2>Проекты</h2><p class="overlay-desc">Мои открытые проекты на GitHub</p><div class="project-list" id="project-cards-page"></div>` },
  { title: 'ЧаВо', html: `<p class="overlay-label">ЧАВО</p><h2>Часто задаваемые вопросы</h2><p class="overlay-desc">Ответы на популярные вопросы</p><div class="faq-list"><div class="faq-item"><div class="faq-q">Кто ты такой?</div><div class="faq-a">Indy software engineer и web-разработчик. Создаю веб-приложения, десктопные программы и API. Кодинг — моё хобби.</div></div><div class="faq-item"><div class="faq-q">Какие проекты ты делаешь?</div><div class="faq-a">Работаю над TechOne UI (дизайн-фреймворк), Spark Studio (IDE на JavaFX/JPHP), Weather Seeker и другими открытыми проектами на GitHub.</div></div><div class="faq-item"><div class="faq-q">Как с тобой связаться?</div><div class="faq-a">Лучший способ — Discord (виджет на странице контактов). Также можешь написать на GitHub или в Steam.</div></div><div class="faq-item"><div class="faq-q">Ты используешь AI в разработке?</div><div class="faq-a">Да, использую профессиональные AI-инструменты для ускорения разработки, но это не vibecode — каждая строка осмысленна.</div></div><div class="faq-item"><div class="faq-q">Какие технологии ты знаешь?</div><div class="faq-a">Веб: HTML, CSS, JavaScript, Three.js. Бэкенд: PHP, Java, Node.js, Python. Инструменты: Git, Docker, AI-assisted coding.</div></div></div>` },
  { title: 'Контакты', html: `<p class="overlay-label">КОНТАКТЫ</p><h2>Связь</h2><p class="overlay-desc">Напишите мне</p><div style="margin-bottom:16px"><iframe src="https://discord.com/widget?id=1443358714315800711&theme=dark" width="100%" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe></div><div class="social-btns"><a href="https://github.com/ll1ness" target="_blank" rel="noopener" class="to-button">GitHub</a><a href="https://discord.gg/nEcnZKQuCf" target="_blank" rel="noopener" class="to-button">Discord</a><a href="https://steamcommunity.com/id/ll1ness/" target="_blank" rel="noopener" class="to-button">Steam</a><a href="https://orcid.org/0009-0001-2539-7302" target="_blank" rel="noopener" class="to-button">ORCID</a></div>` },
];

export function projectCardHtml(proj) {
  return `<div class="card-head"><span class="card-icon">${proj.icon || '📄'}</span><h3>${proj.name}</h3></div><p>${proj.tagline || ''}</p><div class="card-tags">${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}</div>`;
}

export function projectModalBody(proj) {
  const initials = proj.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const logo = proj.logo
    ? `<img src="${proj.logo}" alt="${proj.name}" style="width:48px;height:48px;border-radius:10px;object-fit:cover">`
    : initials;
  const gif = proj.gif
    ? `<div class="modal-gif"><img class="show" src="${proj.gif}" alt="" /></div>`
    : `<div class="modal-gif"><span class="modal-gif-empty">no gif found</span></div>`;
  const dls = (proj.downloads || []).map(d => `<a class="to-button" href="${d.url || '#'}" ${d.url && d.url !== '#' ? 'target="_blank" rel="noopener"' : ''}>${d.label || ''}</a>`).join('');
  return `
    <div class="modal-header">
      <div class="modal-logo">${logo}</div>
      <div><h2 class="modal-title">${proj.name}</h2><p class="modal-tagline">${proj.tagline || ''}</p></div>
    </div>
    ${gif}
    <p class="modal-desc">${proj.description || ''}</p>
    <div class="modal-downloads">${dls}</div>`;
}