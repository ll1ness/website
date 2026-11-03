const VERSION_KEY = 'll1ness-version';

function storedVersion() {
  try { return localStorage.getItem(VERSION_KEY); } catch (e) { return null; }
}

function isPhoneAuto() {
  if (window.innerWidth >= 768) return false;
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
  return true;
}

async function boot() {
  const loader = document.getElementById('loader');
    await import('./space.js');

    document.getElementById('full-toggle')?.querySelector('.js-mobile')?.addEventListener('click', () => {
      try { localStorage.setItem(VERSION_KEY, 'mobile'); } catch (e) {}
      location.reload();
    });
  }
boot();

