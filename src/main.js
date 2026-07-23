import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const N = 8, D = 1000, ORBIT_R = 15, INTRO_D = 2500;

const DIAM = 12756;
const RATIO = (d) => Math.pow(d / DIAM, 0.4);
const AU_INCL = [
  [0.39, 335], [0.72, 215], [1.0, 85], [1.52, 130],
  [5.2, 310], [9.54, 250], [19.2, 350], [30.1, 170],
];
const AU = (au, i) => {
  const d = au * 80, a = AU_INCL[i][1] * Math.PI / 180;
  const y = [3, -5, 8, -12, 25, -40, 60, -90][i];
  return [d * Math.cos(a), y, d * Math.sin(a)];
};
const planetDefs = [
  { pos: AU(0.39,0), file: 'Mercury_1_4878.glb',   color: 0x9ea4ad, ratio: RATIO(4879) },
  { pos: AU(0.72,1), file: 'Venus_1_12103.glb',    color: 0xedd59e, ratio: RATIO(12104) },
  { pos: AU(1.0,2),  file: 'earth.glb',             color: 0x4a90d9, ratio: RATIO(12756) },
  { pos: AU(1.52,3), file: '24881_Mars_1_6792.glb', color: 0xd4684a, ratio: RATIO(6792) },
  { pos: AU(5.2,4),  file: 'jupiter.glb',           color: 0xd4a06a, ratio: RATIO(142984) },
  { pos: AU(9.54,5), file: 'Saturn_1_120536.glb',   color: 0xe8d5a0, ratio: RATIO(120536) },
  { pos: AU(19.2,6), file: 'Uranus_1_51118.glb',    color: 0x7ec8e3, ratio: RATIO(51118) },
  { pos: AU(30.1,7), file: 'Neptune_1_49528.glb',   color: 0x3b6ea0, ratio: RATIO(49528) },
];
const names = ['Меркурий', 'Венера', 'Земля', 'Марс', 'Юпитер', 'Сатурн', 'Уран', 'Нептун'];
const ROT_PERIOD = [58.6, 243, 1, 1.03, 0.41, 0.45, 0.72, 0.67];
const ROT_BASE = 0.00005;
const AXIAL_TILT = [0.03, 177.4, 23.44, 25.19, 3.13, 26.73, 97.77, 28.32];

let introActive = true;
let introStart = 0;
let skyMesh = null;
let earthRadius = 0;

const loaderEl = document.getElementById('loader');
const loaderBar = document.querySelector('.loader-bar');
const uiEl = document.getElementById('ui');
let loadCount = 0;
const LOAD_TOTAL = 11;

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
scene.fog = new THREE.Fog(0x03030a, 200, 4800);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 5000);
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
scene.add(new THREE.AmbientLight(0x222233, 0.12));

const sunLight = new THREE.PointLight(0xffeedd, 5, 0);
sunLight.decay = 0;
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const pivots = [];
let satPivot = null;
let moonPivot = null;
let sunGroup = null;
let sunState = null;
let planetRadii = [];

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
    const r = 500 + Math.random() * 4500, th = Math.random() * 6.28, ph = Math.acos(2 * Math.random() - 1);
    p[i*3] = r * Math.sin(ph) * Math.cos(th); p[i*3+1] = (Math.random() - 0.5) * 2000; p[i*3+2] = r * Math.sin(ph) * Math.sin(th);
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

function uniformScale(root, ratio = 1) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  console.log(`${root.name}: bbox ${size.x.toFixed(4)}x${size.y.toFixed(4)}x${size.z.toFixed(4)} max=${maxDim.toFixed(4)}`);
  if (maxDim > 0.001 && maxDim < 1000000) {
    let s = (ORBIT_R * 0.35 / maxDim) * ratio;
    s = Math.max(0.0001, Math.min(s, 20));
    root.scale.set(s, s, s);
    console.log(`${root.name}: scaled x${s.toFixed(6)} (ratio ${ratio}) → final ${(maxDim*s).toFixed(3)}`);
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
      let s = (ORBIT_R * 0.35 / mMax) * ratio;
      s = Math.max(0.0001, Math.min(s, 20));
      root.scale.set(s, s, s);
      console.log(`${root.name}: mesh-scaled x${s.toFixed(6)} (ratio ${ratio}) → final ${(mMax*s).toFixed(3)}`);
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
  const mp = new THREE.Group();
  pivots[2].add(sp);
  pivots[2].add(mp);
  satPivot = sp;
  moonPivot = mp;

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
      uniformScale(m, def.ratio);
      m.rotation.x = AXIAL_TILT[i] * Math.PI / 180;
      m.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; c.material.side = THREE.DoubleSide; } });
      const rb = new THREE.Box3().setFromObject(m);
      const rsz = rb.getSize(new THREE.Vector3());
      planetRadii[i] = Math.max(rsz.x, rsz.y, rsz.z) / 2;
    } catch (err) {
      console.error(`${names[i]}: ${err}`);
      planetRadii[i] = 2;
      if (i === 4) {
        const g = createGasGiant(group, 2);
        g.name = names[i] + '_fallback';
      } else {
        const fb = fallbackSphere(group, def.color, 2);
        fb.name = names[i] + '_fallback';
      }
      if (i === 2) earthRadius = 2;
    }
    updateLoader();
  }

  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load('/models/International_Space_Station_.glb',
        (g) => resolve(g),
        (xhr) => { if (xhr.total) console.log(`ISS: ${Math.round(xhr.loaded / xhr.total * 100)}%`); },
        (e) => reject(e)
      );
    });
    const m = gltf.scene;
    m.name = 'ISS';
    m.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    sp.add(m);
    m.position.set(4.5, 0.4, 0);
    m.scale.set(0.015, 0.015, 0.015);
    console.log('ISS: OK');
  } catch (err) {
    console.error(`ISS: ${err?.message || err}`);
  }
  updateLoader();

  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load('/models/moon.glb',
        (g) => resolve(g),
        (xhr) => { if (xhr.total) console.log(`moon: ${Math.round(xhr.loaded / xhr.total * 100)}%`); },
        (e) => reject(e)
      );
    });
    const m = gltf.scene;
    m.name = 'moon';
    m.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    mp.add(m);
    m.position.set(8, 0, 0);
    const moonBox = new THREE.Box3().setFromObject(m);
    const moonSz = moonBox.getSize(new THREE.Vector3());
    const moonMax = Math.max(moonSz.x, moonSz.y, moonSz.z);
    if (moonMax > 0.001) {
      const s = 0.5 / moonMax;
      m.scale.set(s, s, s);
    }
    console.log('moon: OK');
  } catch (err) {
    console.error(`moon: ${err?.message || err}`);
  }
  updateLoader();

  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load('/models/sun.glb',
        (g) => resolve(g),
        (xhr) => { if (xhr.total) console.log(`sun: ${Math.round(xhr.loaded / xhr.total * 100)}%`); },
        (e) => reject(e)
      );
    });
    const m = gltf.scene;
    m.name = 'Sun';
    const sg = new THREE.Group();
    sg.add(m);
    scene.add(sg);
    uniformScale(m, 2.5);
    const sunBox = new THREE.Box3().setFromObject(m);
    const sunSz = sunBox.getSize(new THREE.Vector3());
    const sunR = Math.max(sunSz.x, sunSz.y, sunSz.z) / 2;

    // Sun surface shader
    const sunVS = `
      varying vec3 vNormal;
      varying vec3 vPos;
      varying vec3 vViewDir;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vPos = position;
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`;
    const sunFS = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying vec3 vViewDir;
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      float snoise(vec3 p) {
        vec3 i = floor(p); vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i), b = hash(i+vec3(1,0,0)), c = hash(i+vec3(0,1,0)), d = hash(i+vec3(1,1,0));
        float e = hash(i+vec3(0,0,1)), fg = hash(i+vec3(1,0,1)), g = hash(i+vec3(0,1,1)), h = hash(i+vec3(1,1,1));
        return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,fg,f.x),mix(g,h,f.x),f.y),f.z);
      }
      float fbm(vec3 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) { v += a * snoise(p); p = p * 2.0 + 100.0; a *= 0.5; }
        return v;
      }
      void main() {
        vec3 p = vPos * 0.8 + uTime * 0.015;
        float n = fbm(p);
        vec3 dark = vec3(1.0, 0.45, 0.05);
        vec3 bright = vec3(1.0, 0.85, 0.25);
        vec3 col = mix(dark, bright, n);
        float hot = fbm(p * 2.0 - uTime * 0.02);
        hot = smoothstep(0.6, 0.9, hot);
        col += vec3(1.0, 0.7, 0.2) * hot * 0.6;
        vec3 norm = normalize(vNormal);
        float rim = 1.0 - max(0.0, dot(norm, vViewDir));
        rim = pow(rim, 0.3);
        col += vec3(1.0, 0.3, 0.0) * rim * 0.4;
        gl_FragColor = vec4(col, 1.0);
      }`;
    const sunMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: sunVS,
      fragmentShader: sunFS,
    });
    m.traverse(c => { if (c.isMesh) c.material = sunMat; });

    sunGroup = sg;
    sunState = {
      shader: sunMat, sr: sunR,
    };
    console.log('sun: OK');
  } catch (err) {
    console.error(`sun: ${err?.message || err}`);
  }
  updateLoader();

  const er = earthRadius > 0 ? earthRadius : 2;
  skyMesh = createSkyDome(pivots[2], er * 3.5);

  console.log('Ready');
  completeLoading();
  start();
}

function start() {
  let cr = 2, tr = 2;
  let trans = false, ts = 0;
  let as = 0;
  let theta = 0, phi = Math.PI / 4;
  let isDragging = false, px = 0, py = 0;
  let thetaVel = 0, phiVel = 0;
  const MOUSE_SENS = 0.005, DAMP = 0.92, VEL_THRESH = 0.00005;
  const fromPos = new THREE.Vector3();
  const toPos = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const ep = planetDefs[2].pos;
  const earthPos = new THREE.Vector3(ep[0], ep[1], ep[2]);
  const toSun = new THREE.Vector3().copy(earthPos).negate().normalize();
  let orbitR = ORBIT_R;
  let targetOrbitR = ORBIT_R;

  function getCamPos(idx, t, p) {
    const def = planetDefs[idx].pos;
    return new THREE.Vector3(
      def[0] + Math.sin(t) * Math.cos(p) * orbitR,
      def[1] + Math.sin(p) * orbitR,
      def[2] + Math.cos(t) * Math.cos(p) * orbitR
    );
  }

  const endPhi = -0.1;
  const endTheta = Math.atan2(toSun.x, toSun.z);
  const introEndPos = getCamPos(2, endTheta, endPhi);
  const introStartPos = new THREE.Vector3(
    ep[0] + toSun.x * (ORBIT_R * 0.4),
    ep[1] + toSun.y * (ORBIT_R * 0.4),
    ep[2] + toSun.z * (ORBIT_R * 0.4)
  );
  camera.position.copy(introStartPos);
  camera.lookAt(ep[0], ep[1], ep[2]);

  function go(r) {
    if (introActive || trans) return;
    r = Math.max(0, Math.min(N - 1, r));
    if (r === tr) return;
    fromPos.copy(camera.position);
    toPos.copy(getCamPos(r, 0, Math.PI / 4));
    ts = performance.now(); trans = true; tr = r;
  }

  addEventListener('wheel', e => {
    if (introActive) return;
    if (e.ctrlKey) {
      e.preventDefault();
      const minR = planetRadii[tr] ? planetRadii[tr] * 1.3 : 2;
      targetOrbitR = Math.max(minR, Math.min(80, targetOrbitR + e.deltaY * 0.01));
      return;
    }
    as += e.deltaY;
    if (Math.abs(as) >= 60) { go(tr + (as > 0 ? 1 : -1)); as = 0; }
    document.getElementById('scroll-hint')?.classList.toggle('hidden', tr !== 2);
  }, { passive: false });

  const cv = renderer.domElement;
  cv.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || introActive || trans) return;
    isDragging = true; px = e.clientX; py = e.clientY;
    thetaVel = 0; phiVel = 0;
  });
  addEventListener('mousemove', (e) => {
    if (!isDragging || introActive || trans) return;
    const dx = e.clientX - px, dy = e.clientY - py;
    thetaVel = -dx * MOUSE_SENS;
    phiVel = dy * MOUSE_SENS;
    theta += thetaVel;
    phi += phiVel;
    phi = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, phi));
    px = e.clientX; py = e.clientY;
  });
  addEventListener('mouseup', () => { isDragging = false; });

  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); comp.setSize(innerWidth, innerHeight); });

  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const b = e.target.querySelector('.to-button'), o = b.textContent;
    b.textContent = 'Отправлено'; b.style.pointerEvents = 'none';
    setTimeout(() => { b.textContent = o; b.style.pointerEvents = 'auto'; e.target.reset(); }, 2000);
  });

  document.querySelectorAll('[data-room]').forEach(el => {
    el.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') return;
      e.preventDefault();
      go(parseInt(el.dataset.room));
    });
  });

  // Modal + Products dropdown
  const modalEl = document.getElementById('modal');
  const modalBg = modalEl?.querySelector('.modal-bg');
  const modalClose = modalEl?.querySelector('.modal-close');
  const menuEl = document.getElementById('product-menu');
  const ssTrack = document.getElementById('ss-track');
  const ssPrev = document.getElementById('ss-prev');
  const ssNext = document.getElementById('ss-next');
  const ssDots = document.getElementById('ss-dots');
  const ssEmpty = document.getElementById('ss-empty');
  let ssIndex = 0, ssCount = 0;

  let projectsData = [];

  fetch('/projects.json').then(r => r.json()).then(d => {
    projectsData = d.projects;
    if (!menuEl) return;
    const cats = d.categories || [];
    cats.forEach(cat => {
      const items = projectsData.filter(p => p.cat === cat.id);
      if (!items.length) return;
      const col = document.createElement('div');
      col.className = 'drop-col';
      const label = document.createElement('span');
      label.className = 'drop-label';
      label.textContent = cat.label;
      col.appendChild(label);
      items.forEach(p => {
        const a = document.createElement('a');
        a.href = '#';
        a.dataset.project = p.id;
        a.textContent = p.name;
        a.addEventListener('click', (e) => { e.preventDefault(); openModal(p.id); });
        col.appendChild(a);
      });
      menuEl.appendChild(col);
    });
    // Portfolio cards
    const cardsEl = document.getElementById('project-cards');
    if (cardsEl) {
      projectsData.slice(0, 5).forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.cursor = 'pointer';
        card.innerHTML =
          '<div class="card-head"><span class="card-icon">' + (p.icon || '📄') +
          '</span><h3>' + p.name + '</h3></div><p>' + (p.tagline || '') +
          '</p><div class="card-tags">' + (p.tags || []).map(t => '<span>' + t + '</span>').join('') + '</div>';
        card.addEventListener('click', () => openModal(p.id));
        cardsEl.appendChild(card);
      });
    }
  }).catch(() => {});

  function openModal(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj || !modalEl) return;
    document.getElementById('modal-title').textContent = proj.name;
    document.getElementById('modal-tagline').textContent = proj.tagline;
    document.getElementById('modal-desc').textContent = proj.description;
    const logoEl = document.getElementById('modal-logo');
    if (proj.logo) { logoEl.innerHTML = `<img src="${proj.logo}" alt="${proj.name}" style="width:48px;height:48px;border-radius:10px;object-fit:cover">`; }
    else { logoEl.textContent = proj.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
    ssTrack.innerHTML = '';
    ssDots.innerHTML = '';
    ssIndex = 0;
    ssCount = (proj.screenshots && proj.screenshots.length) || 0;
    if (ssCount) {
      proj.screenshots.forEach(s => { const img = document.createElement('img'); img.src = s; img.alt = ''; ssTrack.appendChild(img); });
      for (let i = 0; i < ssCount; i++) { const d = document.createElement('span'); d.className = 'ss-dot' + (i === 0 ? ' active' : ''); d.dataset.i = i; ssDots.appendChild(d); }
      ssPrev.classList.toggle('hidden', ssCount <= 1);
      ssNext.classList.toggle('hidden', ssCount <= 1);
      ssEmpty.classList.remove('show');
    } else {
      ssEmpty.classList.add('show');
      ssPrev.classList.add('hidden');
      ssNext.classList.add('hidden');
    }
    const dl = document.getElementById('modal-downloads');
    dl.innerHTML = '';
    if (proj.downloads && proj.downloads.length) {
      proj.downloads.forEach(d => {
        const a = document.createElement('a');
        a.href = d.url; a.className = 'to-button'; a.textContent = d.label;
        if (d.url && d.url !== '#') a.target = '_blank'; a.rel = 'noopener';
        dl.appendChild(a);
      });
    }
    modalEl.classList.add('open');
  }
  function closeModal() { modalEl?.classList.remove('open'); }

  modalClose?.addEventListener('click', closeModal);
  modalBg?.addEventListener('click', closeModal);

  document.querySelectorAll('.faq-q').forEach(el => {
    el.addEventListener('click', () => {
      el.parentElement.classList.toggle('open');
    });
  });

  const pageModal = document.getElementById('page-modal');
  const pageModalContent = document.getElementById('page-modal-content');
  const pageModalClose = pageModal?.querySelector('.page-modal-close');
  const pageModalBg = pageModal?.querySelector('.modal-bg');
  const pages = [
    { title: 'll1ness', html: `<p class="overlay-label">ПРИВЕТ, Я</p><h2>ll1ness</h2><p class="overlay-desc">Indy software engineer ✨ Web-developer 📐 Crafting web apps, desktop apps and API 💎 Like to code as hobby 🧬🛡️</p><div class="overlay-stats"><div class="stat-item"><span class="stat-n">16</span><span class="stat-l">Проектов</span></div><div class="stat-item"><span class="stat-n">3</span><span class="stat-l">Пинов</span></div><div class="stat-item"><span class="stat-n">✦</span><span class="stat-l">SparkStudio</span></div></div><div class="overlay-actions"><a href="https://github.com/ll1ness" target="_blank" rel="noopener" class="to-button" data-variant="primary">GitHub</a><a href="https://discord.gg/nEcnZKQuCf" target="_blank" rel="noopener" class="to-button">Discord</a></div>` },
    { title: 'Проекты', html: `<p class="overlay-label">ПОРТФОЛИО</p><h2>Проекты</h2><p class="overlay-desc">Мои открытые проекты на GitHub</p><div class="project-list" id="project-cards-page"></div>` },
    { title: 'ЧаВо', html: `<p class="overlay-label">ЧАВО</p><h2>Часто задаваемые вопросы</h2><p class="overlay-desc">Ответы на популярные вопросы</p><div class="faq-list"><div class="faq-item"><div class="faq-q">Кто ты такой?</div><div class="faq-a">Indy software engineer и web-разработчик. Создаю веб-приложения, десктопные программы и API. Кодинг — моё хобби.</div></div><div class="faq-item"><div class="faq-q">Какие проекты ты делаешь?</div><div class="faq-a">Работаю над TechOne UI (дизайн-фреймворк), Spark Studio (IDE на JavaFX/JPHP), Weather Seeker и другими открытыми проектами на GitHub.</div></div><div class="faq-item"><div class="faq-q">Как с тобой связаться?</div><div class="faq-a">Лучший способ — Discord (виджет на странице контактов). Также можешь написать на GitHub или в Steam.</div></div><div class="faq-item"><div class="faq-q">Ты используешь AI в разработке?</div><div class="faq-a">Да, использую профессиональные AI-инструменты для ускорения разработки, но это не vibecode — каждая строка осмысленна.</div></div><div class="faq-item"><div class="faq-q">Какие технологии ты знаешь?</div><div class="faq-a">Веб: HTML, CSS, JavaScript, Three.js. Бэкенд: PHP, Java, Node.js, Python. Инструменты: Git, Docker, AI-assisted coding.</div></div></div>` },
    { title: 'Контакты', html: `<p class="overlay-label">КОНТАКТЫ</p><h2>Связь</h2><p class="overlay-desc">Напишите мне</p><div style="margin-bottom:16px"><iframe src="https://discord.com/widget?id=1443358714315800711&theme=dark" width="100%" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe></div><div class="social-btns"><a href="https://github.com/ll1ness" target="_blank" rel="noopener" class="to-button">GitHub</a><a href="https://discord.gg/nEcnZKQuCf" target="_blank" rel="noopener" class="to-button">Discord</a><a href="https://steamcommunity.com/id/ll1ness/" target="_blank" rel="noopener" class="to-button">Steam</a><a href="https://orcid.org/0009-0001-2539-7302" target="_blank" rel="noopener" class="to-button">ORCID</a></div>` },
  ];

  function openPage(idx) {
    if (!pageModal || !pageModalContent) return;
    const p = pages[idx];
    if (!p) return;
    pageModalContent.innerHTML = p.html;
    pageModal.classList.add('open');
    if (idx === 1) {
      const cardsEl = document.getElementById('project-cards-page');
      if (cardsEl && projectsData.length) {
        projectsData.slice(0, 5).forEach(proj => {
          const card = document.createElement('div');
          card.className = 'project-card';
          card.style.cursor = 'pointer';
          card.innerHTML = '<div class="card-head"><span class="card-icon">' + (proj.icon || '📄') + '</span><h3>' + proj.name + '</h3></div><p>' + (proj.tagline || '') + '</p><div class="card-tags">' + (proj.tags || []).map(t => '<span>' + t + '</span>').join('') + '</div>';
          card.addEventListener('click', () => { pageModal.classList.remove('open'); openModal(proj.id); });
          cardsEl.appendChild(card);
        });
      }
    }
    if (idx === 2) {
      pageModalContent.querySelectorAll('.faq-q').forEach(el => {
        el.addEventListener('click', () => el.parentElement.classList.toggle('open'));
      });
    }
  }
  function closePage() { pageModal?.classList.remove('open'); }
  pageModalClose?.addEventListener('click', closePage);
  pageModalBg?.addEventListener('click', closePage);

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openPage(parseInt(el.dataset.page));
    });
  });

  function ssGo(i) {
    if (i < 0) i = ssCount - 1;
    if (i >= ssCount) i = 0;
    ssIndex = i;
    ssTrack.style.transform = 'translateX(-' + (i * 100) + '%)';
    ssDots.querySelectorAll('.ss-dot').forEach((d, j) => d.classList.toggle('active', j === i));
  }
  ssPrev?.addEventListener('click', () => ssGo(ssIndex - 1));
  ssNext?.addEventListener('click', () => ssGo(ssIndex + 1));
  ssDots?.addEventListener('click', (e) => { if (e.target.dataset.i) ssGo(parseInt(e.target.dataset.i)); });

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
      l.querySelector('.room-author').innerHTML = 'by <img src="/assets/AlbaLogo.png"> AlbaSpace';
    }
  }

  function smoothstep(t) { return t * t * (3 - 2 * t); }

  animate();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (satPivot) satPivot.rotation.y += 0.0015;
    if (moonPivot) moonPivot.rotation.y += 0.0003;
    orbitR += (targetOrbitR - orbitR) * 0.08;
    if (sunGroup) sunGroup.rotation.y += 0.00015;
    if (sunState) {
      sunState.shader.uniforms.uTime.value += 0.016;
    }
    pivots.forEach((p, i) => p.rotation.y += ROT_BASE / ROT_PERIOD[i]);

    if (skyMesh && earthRadius > 0) {
      const epp = planetDefs[2].pos;
      const dx = camera.position.x - epp[0], dy = camera.position.y - epp[1], dz = camera.position.z - epp[2];
      const camDist = Math.sqrt(dx*dx + dy*dy + dz*dz);
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
      camera.lookAt(ep[0], ep[1], ep[2]);
      if (_t >= 1) {
        introActive = false;
        theta = endTheta; phi = endPhi;
        cr = 2; tr = 2;
        camera.position.copy(introEndPos);
        camera.lookAt(ep[0], ep[1], ep[2]);
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
      if (_t >= 1) {
        trans = false; cr = tr;
        theta = 0; phi = Math.PI / 4;
        camera.position.copy(toPos);
        camera.lookAt(tp[0], tp[1], tp[2]);
        ui();
      }
    } else {
      theta += thetaVel;
      phi += phiVel;
      phi = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, phi));
      thetaVel *= DAMP;
      phiVel *= DAMP;
      if (Math.abs(thetaVel) < VEL_THRESH) thetaVel = 0;
      if (Math.abs(phiVel) < VEL_THRESH) phiVel = 0;
      const p = planetDefs[cr].pos;
      camera.position.set(
        p[0] + Math.sin(theta) * Math.cos(phi) * orbitR,
        p[1] + Math.sin(phi) * orbitR,
        p[2] + Math.cos(theta) * Math.cos(phi) * orbitR
      );
      camera.lookAt(p[0], p[1], p[2]);
    }

    comp.render();
  }
}

init();
