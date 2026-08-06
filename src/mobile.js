import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const VERSION_KEY = 'll1ness-version';

const PLANETS = [
  { file: 'sun.glb',            name: 'Солнце',   idx: '✦', r: 2.0 },
  { file: 'Mercury_1_4878.glb', name: 'Меркурий', idx: '01', r: 2.4 },
  { file: 'Venus_1_12103.glb',  name: 'Венера',   idx: '02', r: 2.4 },
  { file: 'earth.glb',          name: 'Земля',    idx: '03', r: 2.4 },
  { file: '24881_Mars_1_6792.glb', name: 'Марс',  idx: '04', r: 2.4 },
  { file: 'jupiter.glb',        name: 'Юпитер',   idx: '05', r: 2.4 },
  { file: 'Saturn_1_120536.glb',name: 'Сатурн',   idx: '06', r: 2.4 },
  { file: 'Uranus_1_51118.glb', name: 'Уран',     idx: '07', r: 2.4 },
  { file: 'Neptune_1_49528.glb',name: 'Нептун',   idx: '08', r: 2.4 },
];

function smoothstep(t) {
  t = Math.min(Math.max(t, 0), 1);
  return t * t * (3 - 2 * t);
}

function starfield(scene) {
  const n = 4000, p = new Float32Array(n * 3), s = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = 30 + Math.random() * 120, th = Math.random() * 6.28, ph = Math.acos(2 * Math.random() - 1);
    p[i * 3] = r * Math.sin(ph) * Math.cos(th);
    p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    p[i * 3 + 2] = r * Math.cos(ph);
    s[i] = 0.3 + Math.random() * 1.6;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('size', new THREE.BufferAttribute(s, 1));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    size: 0.35, transparent: true, opacity: 0.7, sizeAttenuation: true,
    depthWrite: false, color: 0xffffff,
  })));
}

function applySunMaterial(root) {
  root.traverse(c => {
    if (!c.isMesh) return;
    c.material = new THREE.MeshStandardMaterial({
      color: 0xffc87a, emissive: 0xff7a00, emissiveIntensity: 1.8, roughness: 0.6,
    });
  });
}

function normalize(root, targetR) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const max = Math.max(size.x, size.y, size.z) || 1;
  root.scale.setScalar(targetR / max);
}

function collectOpacities(root) {
  const base = [];
  root.traverse(c => {
    if (!c.isMesh) return;
    const mats = Array.isArray(c.material) ? c.material : [c.material];
    mats.forEach(m => base.push(m.opacity !== undefined ? m.opacity : 1));
  });
  return base;
}

function setGroupOpacity(root, o, base) {
  let k = 0;
  root.traverse(c => {
    if (!c.isMesh) return;
    const mats = Array.isArray(c.material) ? c.material : [c.material];
    mats.forEach(m => {
      const b = base[k] !== undefined ? base[k] : (m.opacity !== undefined ? m.opacity : 1);
      k++;
      if (m.opacity !== undefined) {
        m.transparent = true;
        m.opacity = b * o;
      }
    });
  });
}

export function initMobile() {
  document.documentElement.classList.add('mode-landing');
  document.body.classList.add('mode-landing');

  const site = document.getElementById('mobile-site');
  const loader = document.getElementById('loader');
  if (site) site.classList.remove('hidden');
  if (loader) loader.classList.add('done');

  document.getElementById('mobile-toggle')?.querySelector('.js-full')?.addEventListener('click', () => {
    try { localStorage.setItem(VERSION_KEY, 'full'); } catch (e) {}
    location.reload();
  });

  const canvas = document.getElementById('m-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x03030a, 60, 300);

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 500);
  camera.position.set(0, 0, 6.5);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0x334466, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 1.8);
  dir.position.set(3, 5, 4);
  scene.add(dir);
  const rim = new THREE.PointLight(0xffffff, 0.5);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  starfield(scene);

  const states = PLANETS.map(p => {
    const group = new THREE.Group();
    group.visible = false;
    scene.add(group);
    return { p, group, loaded: false, loading: false, failed: false, root: null, base: [] };
  });

  const loader3d = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath('/draco/');
  loader3d.setDRACOLoader(draco);
  const plainLoader = new GLTFLoader();

  function loadPlanet(i) {
    const st = states[i];
    if (st.loaded || st.loading || st.failed) return;
    st.loading = true;
    const attempt = (ldr) => new Promise((resolve, reject) => {
      ldr.load('/models/' + st.p.file, resolve, undefined, reject);
    });
    Promise.resolve()
      .then(() => attempt(loader3d))
      .catch(() => attempt(plainLoader))
      .then((gltf) => {
        const root = gltf.scene;
        if (i === 0) applySunMaterial(root);
        root.traverse(c => {
          if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; c.material.side = THREE.DoubleSide; }
        });
        normalize(root, st.p.r);
        st.group.add(root);
        st.base = collectOpacities(root);
        st.root = root;
        st.loaded = true;
        st.loading = false;
      })
      .catch(() => { st.loading = false; st.failed = true; });
  }

  const sections = Array.from(document.querySelectorAll('.m-planet'));
  let tops = sections.map(s => s.offsetTop);

  const headerEl = site.querySelector('.m-header');
  const roomLabel = document.getElementById('m-room-label');
  const roomIdx = roomLabel?.querySelector('.m-room-idx');
  const roomName = roomLabel?.querySelector('.m-room-name');

  function activePlanet() {
    const pos = window.scrollY + innerHeight * 0.5;
    for (let i = 0; i < sections.length; i++) {
      const top = tops[i];
      const end = i < sections.length - 1 ? tops[i + 1] : top + innerHeight;
      if (pos >= top && pos < end) return i;
    }
    return -1;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.m-reveal').forEach(el => io.observe(el));

  const renderers = {
    about: () => `
      <p class="overlay-label">ПРИВЕТ, Я</p>
      <h3 class="m-title">ll1ness</h3>
      <p class="overlay-desc">Indy software engineer ✨ Web-developer 📐 Crafting web apps, desktop apps and API 💎</p>
      <div class="overlay-stats">
        <div class="stat-item"><span class="stat-n">16</span><span class="stat-l">Проектов</span></div>
        <div class="stat-item"><span class="stat-n">3</span><span class="stat-l">Пинов</span></div>
        <div class="stat-item"><span class="stat-n">✦</span><span class="stat-l">SparkStudio</span></div>
      </div>
      <div class="m-proj-links">
        <a class="to-button" href="https://github.com/ll1ness" target="_blank" rel="noopener">GitHub</a>
        <a class="to-button" href="https://discord.gg/nEcnZKQuCf" target="_blank" rel="noopener">Discord</a>
      </div>`,
    projects: () => `
      <h3 class="m-title">Проекты</h3>
      <p class="overlay-desc">Мои открытые проекты на GitHub</p>
      <div class="project-list" data-cards></div>`,
    faq: () => `
      <h3 class="m-title">ЧаВо</h3>
      <p class="overlay-desc">Часто задаваемые вопросы</p>
      <div class="faq-list">
        <div class="faq-item"><div class="faq-q">Кто ты такой?</div><div class="faq-a">Инди-разработчик и web-девелопер. Создаю веб-приложения, десктопные программы и API.</div></div>
        <div class="faq-item"><div class="faq-q">Какие проекты ты делаешь?</div><div class="faq-a">TechOne UI, Spark Studio (IDE на JavaFX/JPHP), Weather Seeker и другие открытые проекты.</div></div>
        <div class="faq-item"><div class="faq-q">Как с тобой связаться?</div><div class="faq-a">Discord, GitHub, Telegram или Steam — ссылки на странице контактов.</div></div>
      </div>`,
    contacts: () => `
      <h3 class="m-title">Контакты</h3>
      <p class="overlay-desc">Напишите мне</p>
      <div class="social-btns">
        <a class="to-button" href="https://github.com/ll1ness" target="_blank" rel="noopener">GitHub</a>
        <a class="to-button" href="https://discord.gg/nEcnZKQuCf" target="_blank" rel="noopener">Discord</a>
        <a class="to-button" href="https://steamcommunity.com/id/ll1ness/" target="_blank" rel="noopener">Steam</a>
        <a class="to-button" href="https://orcid.org/0009-0001-2539-7302" target="_blank" rel="noopener">ORCID</a>
      </div>`,
    proj: (p) => `
      <div class="m-proj-head">
        <span class="m-proj-icon">${p.icon || ''}</span>
        <div><h3>${p.name}</h3><p>${p.tagline || ''}</p></div>
      </div>
      <p class="m-proj-desc">${p.description || ''}</p>
      <div class="m-proj-links">
        ${(p.downloads || []).map(d => `<a class="to-button" href="${d.url || '#'}" ${d.url && d.url !== '#' ? 'target="_blank" rel="noopener"' : ''}>${d.label || ''}</a>`).join('')}
      </div>`,
  };

  function fillCard(p) {
    const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `<div class="card-head"><span class="card-icon">${p.icon || initials}</span><h3>${p.name}</h3></div><p>${p.tagline || ''}</p>`;
  }

  fetch('/projects.json').then(r => r.json()).then(d => {
    const projs = d.projects || [];
    document.querySelectorAll('.m-planet').forEach(section => {
      const slot = section.dataset.slot;
      const box = section.querySelector('.m-proj');
      if (!box) return;
      if (slot && slot.indexOf('proj:') === 0) {
        const p = projs[Number(slot.split(':')[1])];
        if (p) box.innerHTML = renderers.proj(p);
      } else if (renderers[slot]) {
        box.innerHTML = renderers[slot]();
      }
    });
    document.querySelectorAll('.m-proj .project-list[data-cards]').forEach(list => {
      projs.slice(0, 3).forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = fillCard(p);
        list.appendChild(card);
      });
    });
  }).catch(() => {});

  document.addEventListener('click', (e) => {
    const q = e.target.closest('.faq-q');
    if (q) q.parentElement.classList.toggle('open');
  });

  addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    tops = sections.map(s => s.offsetTop);
  });

  function animate() {
    requestAnimationFrame(animate);
    const st = performance.now() * 0.001;
    const y = window.scrollY;
    const vh = innerHeight;
    const pos = y + vh * 0.55;

    const pi = activePlanet();
    if (pi >= 0) {
      headerEl?.classList.add('m-visible');
      roomLabel?.classList.add('m-visible');
      if (roomIdx) roomIdx.textContent = PLANETS[pi].idx;
      if (roomName) roomName.textContent = PLANETS[pi].name;
    } else {
      headerEl?.classList.remove('m-visible');
      roomLabel?.classList.remove('m-visible');
    }

    for (let i = 0; i < states.length; i++) {
      const s = states[i];
      const top = tops[i] || 0;
      const t = Math.min(Math.max((pos - top) / vh, 0), 1);
      if (!s.loaded && !s.loading && pos > top - vh && pos < top + vh * 1.6) loadPlanet(i);
      if (!s.loaded) continue;

      const tin = smoothstep(t / 0.35);
      const tout = 1 - smoothstep((t - 0.65) / 0.35);
      const v = tin * tout;
      const g = s.group;
      g.visible = v > 0.005;
      if (!g.visible) continue;

      g.rotation.y = st * (0.15 + i * 0.04);
      g.scale.setScalar(0.15 + 0.85 * tin);
      g.position.y = (1 - tin) * 1.6 + (1 - tout) * -0.5;
      setGroupOpacity(s.root, v, s.base);
    }

    camera.position.z = 6.5 + Math.sin(st * 0.25) * 0.12;
    camera.position.y = Math.sin(st * 0.18) * 0.08;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
}
