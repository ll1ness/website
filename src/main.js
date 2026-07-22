import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
let atmosUniforms = null;

// Loader
const loaderEl = document.getElementById('loader');
const loaderBar = document.querySelector('.loader-bar');
const uiEl = document.getElementById('ui');
let loadCount = 0;
const LOAD_TOTAL = 5;

function updateLoader() {
  loadCount = Math.min(loadCount + 1, LOAD_TOTAL);
  const pct = (loadCount / LOAD_TOTAL) * 100;
  if (loaderBar) loaderBar.style.width = pct + '%';
}

function completeLoading() {
  loaderEl.classList.add('done');
  introStart = performance.now();
  document.body.style.cursor = 'default';
}

// Scene
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
let atmosMesh = null;
let earthRadius = 0;

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

// ===== ATMOSPHERE SHADER =====
const atmosVert = `
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const atmosFrag = `
uniform vec3 glowColor;
uniform float intensity;
uniform vec3 sphereCenter;
uniform float sphereRadius;
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float rim = 1.0 - abs(dot(viewDir, vNormal));
  rim = pow(rim, 4.0);
  float camDist = distance(cameraPosition, sphereCenter);
  float insideAtmos = clamp((sphereRadius - camDist) / (sphereRadius * 0.25), 0.0, 1.0);
  float alpha = max(rim, insideAtmos) * intensity * 0.55;
  gl_FragColor = vec4(glowColor, alpha);
}
`;

function createAtmosphere(parent, radius, color) {
  const center = new THREE.Vector3();
  parent.getWorldPosition(center);
  const geo = new THREE.SphereGeometry(radius, 48, 48);
  atmosUniforms = {
    glowColor: { value: new THREE.Color(color) },
    intensity: { value: 1.0 },
    sphereCenter: { value: center },
    sphereRadius: { value: radius },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: atmosVert,
    fragmentShader: atmosFrag,
    uniforms: atmosUniforms,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  atmosMesh = new THREE.Mesh(geo, mat);
  parent.add(atmosMesh);
}

function fallbackSphere(parent, color, size) {
  const g = new THREE.IcosahedronGeometry(size, 1);
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    color, roughness: 0.5, metalness: 0.3, emissive: color, emissiveIntensity: 0.15,
  }));
  parent.add(m);
  return m;
}

function uniformScale(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0.001 && maxDim < 1000) {
    let s = ORBIT_R * 0.35 / maxDim;
    s = Math.max(0.02, Math.min(s, 10));
    root.scale.set(s, s, s);
    const finalSize = maxDim * s;
    if (root.name === 'Земля') earthRadius = finalSize / 2;
    return finalSize;
  }
  return 0;
}

const loader = new GLTFLoader();

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
      const gltf = await new Promise((resolve, reject) => {
        loader.load(`/models/${def.file}`,
          (g) => resolve(g),
          (xhr) => { if (xhr.total) console.log(`${names[i]}: ${Math.round(xhr.loaded / xhr.total * 100)}%`); },
          (e) => reject(e)
        );
      });
      const m = gltf.scene;
      m.name = names[i];
      m.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      group.add(m);
      uniformScale(m);
      console.log(`${names[i]}: OK`);
    } catch (err) {
      console.error(`${names[i]}: ${err?.message || err}`);
      const fb = fallbackSphere(group, def.color, 2);
      fb.name = names[i] + '_fallback';
      if (i === 0) earthRadius = 2;
    }
    updateLoader();
  }

  // Satellite
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

  // Atmosphere around Earth
  if (earthRadius > 0) {
    createAtmosphere(pivots[0], earthRadius * 1.15, 0x4a90d9);
  }

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

  // Camera starts on Earth surface looking away, flies out then turns to Earth
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

  // Navigation: header links, sidebar links, nav dots
  document.querySelectorAll('[data-room]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      go(parseInt(el.dataset.room));
      closeSidebar();
    });
  });

  // Sidebar
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

    if (introActive) {
      const elapsed = performance.now() - introStart;
      const _t = Math.min(elapsed / INTRO_D, 1);
      const s = smoothstep(_t);

      camera.position.lerpVectors(introStartPos, introEndPos, s);
      camera.lookAt(
        0,
        100 * (1 - s),
        0
      );

      if (atmosUniforms) {
        atmosUniforms.intensity.value = 1.0 - s * 0.65;
      }

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
