import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const N = 4, D = 1200, ORBIT_R = 12, INTRO_D = 4000;

const planetDefs = [
  { pos: [0, 0, 0],        file: 'earth.glb',    color: 0x4a90d9 },
  { pos: [60, 8, 45],      file: 'jupiter.glb',  color: 0xd4a06a },
  { pos: [-55, -6, 65],    file: 'phobos.glb',   color: 0x8a7f6e },
  { pos: [50, -8, -55],    file: 'sedna.glb',    color: 0xd4684a },
];
const names = ['Земля', 'Юпитер', 'Фобос', 'Седна'];

let introActive = true;
let introStart = 0;
let skyMesh = null;
let earthRadius = 0;

const loaderEl = document.getElementById('loader');
const loaderBar = document.querySelector('.loader-bar');
const uiEl = document.getElementById('ui');
let loadCount = 0;
const LOAD_TOTAL = 5;

function updateLoader() {
  loadCount = Math.min(loadCount + 1, LOAD_TOTAL);
  if (loaderBar) loaderBar.style.width = (loadCount / LOAD_TOTAL * 100) + '%';
}

function completeLoading() {
  loaderEl.classList.add('done');
  introStart = performance.now();
  document.body.style.cursor = 'default';
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03030a, 0.0004);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1200);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('app').appendChild(renderer.domElement);

const comp = new EffectComposer(renderer);
comp.addPass(new RenderPass(scene, camera));
comp.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.12, 0.06, 0.05));

const clock = new THREE.Clock();
scene.add(new THREE.AmbientLight(0x111122, 0.4));
scene.add(new THREE.HemisphereLight(0x2233aa, 0x000011, 0.3));
const sun = new THREE.DirectionalLight(0xffeedd, 1.5);
sun.position.set(40, 50, 30);
scene.add(sun);
const sun2 = new THREE.DirectionalLight(0x3355cc, 0.6);
sun2.position.set(-40, -20, -50);
scene.add(sun2);

const pointLights = [];
planetDefs.forEach((def, i) => {
  const pl = new THREE.PointLight(def.color, 2, 80);
  pl.position.set(def.pos[0], def.pos[1] + 8, def.pos[2]);
  scene.add(pl);
  pointLights.push(pl);
});

const pivots = [];
let satPivot = null;

function circleTexture() {
  const c = document.createElement('canvas'); c.width = 32; c.height = 32;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

function starfield() {
  const n = 25000, p = new Float32Array(n * 3), cA = new Float32Array(n * 3), s = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = 100 + Math.random() * 500, th = Math.random() * 6.28, ph = Math.acos(2 * Math.random() - 1);
    p[i*3] = r * Math.sin(ph) * Math.cos(th); p[i*3+1] = (Math.random() - 0.5) * 350; p[i*3+2] = r * Math.sin(ph) * Math.sin(th);
    s[i] = 0.5 + Math.random() * 3;
    const b = 0.7 + Math.random() * 0.3;
    if (Math.random() < 0.1) { cA[i*3]=b*0.8; cA[i*3+1]=b*0.85; cA[i*3+2]=b; }
    else { cA[i*3]=b; cA[i*3+1]=b; cA[i*3+2]=b; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('size', new THREE.BufferAttribute(s, 1));
  g.setAttribute('color', new THREE.BufferAttribute(cA, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    size: 0.6, map: circleTexture(), vertexColors: true, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false,
  })));
}

starfield();

function createSkyDome(parent, r) {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#0a1e3d');
  g.addColorStop(0.3, '#1a4a8a');
  g.addColorStop(0.6, '#4a90d9');
  g.addColorStop(0.85, '#87ceeb');
  g.addColorStop(1, '#d0e8f5');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, side: THREE.BackSide, transparent: true, opacity: 1, depthWrite: false,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), mat);
  parent.add(m);
  return m;
}

function fallbackSphere(parent, color, size) {
  const g = new THREE.IcosahedronGeometry(size, 1);
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    color, roughness: 0.5, metalness: 0.3, emissive: color, emissiveIntensity: 0.15,
  }));
  parent.add(m);
  return m;
}

function createGasGiant(parent, size) {
  const geo = new THREE.SphereGeometry(size, 48, 64);
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const ctx = c.getContext('2d');
  const bands = ['#d4a06a','#c4955a','#e8c878','#b8844a','#d4a06a','#a07040','#c89860','#d4a06a','#e0b070','#c09050'];
  const bh = 128 / bands.length;
  bands.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(0, i * bh, 512, bh + 1); });
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const mat = new THREE.MeshStandardMaterial({
    map: tex, roughness: 0.7, metalness: 0.1,
    emissive: 0xd4a06a, emissiveIntensity: 0.05,
  });
  const m = new THREE.Mesh(geo, mat);
  parent.add(m);
  return m;
}

function uniformScale(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  console.log(`${root.name}: bbox ${size.x.toFixed(4)}x${size.y.toFixed(4)}x${size.z.toFixed(4)} max=${maxDim.toFixed(4)}`);
  if (maxDim > 0.001 && maxDim < 1000000) {
    let s = ORBIT_R * 0.35 / maxDim;
    s = Math.max(0.0001, Math.min(s, 10));
    root.scale.set(s, s, s);
    console.log(`${root.name}: scaled x${s.toFixed(6)} → final ${(maxDim*s).toFixed(3)}`);
    if (root.name === 'Земля') earthRadius = maxDim * s / 2;
    return;
  }
  let mBox = null;
  root.traverse((c) => {
    if (c.isMesh && !mBox) {
      mBox = new THREE.Box3().setFromObject(c);
    }
  });
  if (mBox) {
    const mSize = mBox.getSize(new THREE.Vector3());
    const mMax = Math.max(mSize.x, mSize.y, mSize.z);
    console.log(`${root.name}: mesh-only bbox ${mSize.x.toFixed(4)}x${mSize.y.toFixed(4)}x${mSize.z.toFixed(4)} max=${mMax.toFixed(4)}`);
    if (mMax > 0.001 && mMax < 1000000) {
      let s = ORBIT_R * 0.35 / mMax;
      s = Math.max(0.0001, Math.min(s, 10));
      root.scale.set(s, s, s);
      console.log(`${root.name}: mesh-scaled x${s.toFixed(6)} → final ${(mMax*s).toFixed(3)}`);
      if (root.name === 'Земля') earthRadius = mMax * s / 2;
      return;
    }
  }
  const s = 1.5;
  root.scale.set(s, s, s);
  console.log(`${root.name}: fallback scale x${s} (fixed)`);
  if (root.name === 'Земля') earthRadius = 2;
}

const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('/draco/');
loader.setDRACOLoader(draco);

// Also keep a plain loader for fallback attempts
const plainLoader = new GLTFLoader();

async function init() {
  const groups = planetDefs.map((def, i) => {
    const g = new THREE.Group();
    g.position.set(def.pos[0], def.pos[1], def.pos[2]);
    scene.add(g);
    pivots.push(g);
    return g;
  });

  const sp = new THREE.Group();
  pivots[0].add(sp);
  satPivot = sp;

  for (let i = 0; i < N; i++) {
    const def = planetDefs[i];
    const group = groups[i];
    try {
      const ldr = (i === 1) ? [loader, plainLoader] : [loader];
      let m = null;
      let sceneRef = null;
      let errs = [];
      for (const l of ldr) {
        try {
          const gltf = await new Promise((resolve, reject) => {
            l.load(`/models/${def.file}`,
              (g) => resolve(g),
              (xhr) => { if (xhr.total) console.log(`${names[i]}: ${Math.round(xhr.loaded / xhr.total * 100)}%`); },
              (e) => reject(e)
            );
          });
          m = gltf.scene;
          sceneRef = gltf;
          console.log(`${names[i]}: loaded with ${l === loader ? 'Draco' : 'plain'} loader`);
          break;
        } catch (e) {
          errs.push(`${l === loader ? 'Draco' : 'plain'}: ${e?.message || e}`);
        }
      }
      if (!m) throw new Error(errs.join(' | '));
      m.name = names[i];
      if (m.children.length === 0 && sceneRef && sceneRef.scenes) {
        const alt = sceneRef.scenes.find(s => s.children.length > 0);
        if (alt) { m = alt; m.name = names[i]; }
      }
      m.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      // Check if there are any meshes
      let meshCount = 0;
      m.traverse((c) => { if (c.isMesh) meshCount++; });
      if (meshCount === 0) throw new Error('no meshes found');
      group.add(m);
      uniformScale(m);
      m.traverse((c) => { if (c.isMesh) console.log(`${names[i]} mesh:`, c.geometry.type, c.material.type, c.material.color?.getHex()); });
    } catch (err) {
      console.error(`${names[i]}: ${err}`);
      // Gas giant fallback for Jupiter
      if (i === 1) {
        const g = createGasGiant(group, 2);
        g.name = names[i] + '_fallback';
        if (i === 0) earthRadius = 2;
      } else {
        const fb = fallbackSphere(group, def.color, 2);
        fb.name = names[i] + '_fallback';
        if (i === 0) earthRadius = 2;
      }
    }
    updateLoader();
  }

  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load('/models/sattelite.glb',
        (g) => resolve(g),
        (xhr) => { if (xhr.total) console.log(`satellite: ${Math.round(xhr.loaded / xhr.total * 100)}%`); },
        (e) => reject(e)
      );
    });
    const m = gltf.scene;
    m.name = 'satellite';
    m.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    sp.add(m);
    m.position.set(3.5, 0.6, 0);
    m.scale.set(0.3, 0.3, 0.3);
    console.log('satellite: OK');
  } catch (err) {
    console.error(`satellite: ${err?.message || err}`);
  }
  updateLoader();

  const er = earthRadius > 0 ? earthRadius : 2;
  skyMesh = createSkyDome(pivots[0], er * 3.5);

  console.log('Ready');
  completeLoading();
  start();
}

function start() {
  let cr = 0, tr = 0, orbitAngle = 0;
  let trans = false, ts = 0;
  let as = 0;
  const fromPos = new THREE.Vector3();
  const toPos = new THREE.Vector3();
  const camTarget = new THREE.Vector3();

  function getCamPos(idx, angle) {
    const p = planetDefs[idx].pos;
    return new THREE.Vector3(
      p[0] + Math.sin(angle) * ORBIT_R,
      p[1] + 0.8 + Math.sin(angle * 0.5) * 1.5,
      p[2] + Math.cos(angle) * ORBIT_R
    );
  }

  const introEndPos = getCamPos(0, 0);
  const introStartPos = new THREE.Vector3(0, 0.5, earthRadius > 0 ? earthRadius : 1.5);
  camera.position.copy(introStartPos);
  camera.lookAt(0, 100, 0);

  function go(r) {
    if (introActive || trans) return;
    r = Math.max(0, Math.min(N - 1, r));
    if (r === tr) return;
    fromPos.copy(camera.position);
    toPos.copy(getCamPos(r, orbitAngle));
    ts = performance.now(); trans = true; tr = r;
  }

  addEventListener('wheel', e => {
    if (introActive) return;
    as += e.deltaY;
    if (Math.abs(as) >= 60) { go(tr + (as > 0 ? 1 : -1)); as = 0; }
    document.getElementById('scroll-hint')?.classList.toggle('hidden', tr > 0);
  }, { passive: true });

  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); comp.setSize(innerWidth, innerHeight); });

  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const b = e.target.querySelector('.to-button'), o = b.textContent;
    b.textContent = 'Отправлено'; b.style.pointerEvents = 'none';
    setTimeout(() => { b.textContent = o; b.style.pointerEvents = 'auto'; e.target.reset(); }, 2000);
  });

  document.querySelectorAll('[data-room]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      go(parseInt(el.dataset.room));
      closeSidebar();
    });
  });

  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  const sidebarClose = document.getElementById('sidebar-close');
  const overlayBg = document.getElementById('overlay-bg');

  function openSidebar() { sidebar.classList.add('open'); overlayBg.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function closeSidebar() { sidebar.classList.remove('open'); overlayBg.classList.remove('show'); document.body.style.overflow = ''; }
  menuBtn?.addEventListener('click', openSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  overlayBg?.addEventListener('click', closeSidebar);

  function ui() {
    document.querySelectorAll('[data-room]').forEach(el => {
      const r = parseInt(el.dataset.room);
      el.classList.toggle('active', r === tr);
    });
    document.querySelectorAll('.room-overlay').forEach((o, i) => o.classList.toggle('active', i === tr));
    const l = document.getElementById('room-label');
    if (l) {
      l.querySelector('.room-idx').textContent = (tr + 1).toString().padStart(2, '0');
      l.querySelector('.room-name').textContent = names[tr];
    }
  }

  function smoothstep(t) { return t * t * (3 - 2 * t); }

  animate();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (satPivot) satPivot.rotation.y += 0.0006;
    pivots.forEach((p, i) => p.rotation.y += 0.0003 * (i + 1));

    pointLights.forEach((l, i) => {
      const p = planetDefs[i].pos;
      l.position.x = p[0] + Math.sin(t * 0.02 + i) * 0.5;
      l.position.z = p[2] + Math.cos(t * 0.02 + i) * 0.5;
    });

    // Sky dome: fades as camera moves away from Earth
    if (skyMesh && earthRadius > 0) {
      const camDist = camera.position.length();
      const fadeStart = earthRadius;
      const fadeEnd = earthRadius * 3;
      const d = (camDist - fadeStart) / (fadeEnd - fadeStart);
      skyMesh.material.opacity = 1 - Math.max(0, Math.min(d, 1));
    }

    if (introActive) {
      const elapsed = performance.now() - introStart;
      const _t = Math.min(elapsed / INTRO_D, 1);
      const s = smoothstep(_t);

      camera.position.lerpVectors(introStartPos, introEndPos, s);
      camera.lookAt(0, 100 * (1 - s), 0);

      if (_t >= 1) {
        introActive = false;
        orbitAngle = 0;
        camera.position.copy(introEndPos);
        camera.lookAt(0, 0, 0);
        uiEl.classList.remove('hidden');
        ui();
        document.getElementById('scroll-hint')?.classList.remove('hidden');
      }
    } else if (trans) {
      const el = performance.now() - ts, _t = Math.min(el / D, 1), s = smoothstep(_t);
      camera.position.lerpVectors(fromPos, toPos, s);
      const cp = planetDefs[cr].pos, tp = planetDefs[tr].pos;
      camTarget.set(
        cp[0] + (tp[0] - cp[0]) * s,
        cp[1] + (tp[1] - cp[1]) * s,
        cp[2] + (tp[2] - cp[2]) * s
      );
      camera.lookAt(camTarget);
      if (_t >= 1) { trans = false; cr = tr; orbitAngle = 0; camera.position.copy(toPos); camera.lookAt(tp[0], tp[1], tp[2]); ui(); }
    } else {
      orbitAngle += 0.0006;
      camera.position.copy(getCamPos(cr, orbitAngle));
      camera.lookAt(planetDefs[cr].pos[0], planetDefs[cr].pos[1], planetDefs[cr].pos[2]);
    }

    comp.render();
  }
}

init();
