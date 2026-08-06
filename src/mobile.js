import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { pages, projectCardHtml, projectModalBody } from './content.js';

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

function easeOutBack(t) {
  t = Math.min(Math.max(t, 0), 1);
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function glowTexture() {
  const c = document.createElement('canvas'); c.width = 16; c.height = 16;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 16, 16);
  return new THREE.CanvasTexture(c);
}

function starfield(scene) {
  const n = 2400, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 80 + Math.pow(Math.random(), 0.6) * 220, ph = Math.acos(2 * Math.random() - 1), th = Math.random() * 6.28;
    p[i*3] = r * Math.sin(ph) * Math.cos(th);
    p[i*3+1] = r * Math.cos(ph);
    p[i*3+2] = r * Math.sin(ph) * Math.sin(th);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    size: 0.9, map: glowTexture(), transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false, color: 0xffffff,
  })));

  const bn = 3200, bp = new Float32Array(bn * 3), bc = new Float32Array(bn * 3);
  const D = 150, R = 230;
  for (let i = 0; i < bn; i++) {
    const dc = Math.pow(Math.random(), 0.6) * R;
    const a = Math.random() * 6.28;
    const bx = dc * Math.cos(a);
    const bz = -D + dc * Math.sin(a);
    const by = (Math.random() - 0.5) * 6;
    bp[i*3] = bx; bp[i*3+1] = by; bp[i*3+2] = bz;
    const b = 0.45 + Math.random() * 0.55;
    if (dc < 100) { bc[i*3]=b; bc[i*3+1]=b*0.82; bc[i*3+2]=b*0.6; }
    else { bc[i*3]=b; bc[i*3+1]=b; bc[i*3+2]=b; }
  }
  const bg = new THREE.BufferGeometry();
  bg.setAttribute('position', new THREE.BufferAttribute(bp, 3));
  bg.setAttribute('color', new THREE.BufferAttribute(bc, 3));
  const bpts = new THREE.Points(bg, new THREE.PointsMaterial({
    size: 1.0, map: glowTexture(), vertexColors: true, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false,
  }));
  bpts.rotation.x = 0.5;
  scene.add(bpts);
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

  const states = PLANETS.map((p, i) => {
    const group = new THREE.Group();
    group.visible = false;
    scene.add(group);
    const side = i === 0 ? 0 : (i % 2 ? 1 : -1);
    const tx = i === 0 ? 0 : side * (1.6 + (i % 3) * 0.2);
    const ty = i === 0 ? -1.1 : 0.4 + (i % 2 ? 0.6 : -0.7);
    const tz = i === 0 ? -0.2 : -0.7;
    return { p, group, tx, ty, tz, loaded: false, loading: false, failed: false, root: null, base: [] };
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

  const pageSlots = { about: 0, projects: 1, faq: 2, contacts: 3 };

  fetch('/projects.json').then(r => r.json()).then(d => {
    const projs = d.projects || [];
    const latest = projs.slice(-5);
    document.querySelectorAll('.m-planet').forEach(section => {
      const slot = section.dataset.slot;
      const box = section.querySelector('.m-proj');
      if (!box) return;
      if (slot && slot.indexOf('proj:') === 0) {
        const p = latest[Number(slot.split(':')[1])];
        if (p) box.innerHTML = projectModalBody(p);
      } else if (pageSlots[slot] !== undefined) {
        box.innerHTML = pages[pageSlots[slot]].html;
      }
    });
    document.querySelectorAll('.m-proj .project-list').forEach(list => {
      projs.slice(0, 3).forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = projectCardHtml(p);
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

      const enter = smoothstep(t / 0.42);
      const leave = 1 - smoothstep((t - 0.58) / 0.42);
      const vis = enter * leave;
      const g = s.group;
      g.visible = vis > 0.02;
      if (!g.visible) continue;

      const e = easeOutBack(enter);
      const out = 1 - leave;
      const dir = s.tx >= 0 ? 1 : -1;

      g.position.x = s.tx - dir * (1 - e) * 2.6 + dir * out * 2.2 + Math.sin(st * 0.6 + i * 2.1) * 0.03;
      g.position.y = s.ty - (1 - e) * 2.4 + out * 2.0 + Math.sin(st * 0.9 + i * 1.3) * 0.05;
      g.position.z = s.tz + (1 - e) * 1.4 - out * 0.4;

      g.scale.setScalar((0.2 + 0.8 * e) * (1 + out * 0.2));

      g.rotation.y = st * (0.2 + i * 0.05) + (1 - e) * 1.2;
      g.rotation.x = (1 - e) * 0.25;
      g.rotation.z = (1 - e) * 0.5 + out * 0.3;
    }

    camera.position.z = 6.5 + Math.sin(st * 0.25) * 0.12;
    camera.position.y = Math.sin(st * 0.18) * 0.08;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
}
