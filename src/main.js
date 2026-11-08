/*
 * Точка входа. Решение «показывать всплывашку о повороте экрана» принимает инлайн-скрипт
 * в index.html — ещё до парсинга body. Здесь важно не запускать приложение: space.js
 * импортируется динамически, поэтому вместе с ним не тянутся Three.js и ~50 МБ моделей.
 */

const LOADER_LOGOS = [
  { src: '/assets/techone.png', alt: 'TechOne' },
  { src: '/assets/AlbaLogo.png', alt: 'AlbaSpace' },
];

// Картинки загрузчика (AlbaLogo.png весит ~775 КБ) подставляются только при реальном старте сайта.
function renderLoaderLogos() {
  const holder = document.getElementById('loader-logos');
  if (!holder) return;
  holder.innerHTML = LOADER_LOGOS
    .map((logo) => `<img src="${logo.src}" class="loader-logo" alt="${logo.alt}">`)
    .join('');
}

if (!window.rotateGate || !window.rotateGate.blocked) {
  renderLoaderLogos();
  import('./space.js');
}

