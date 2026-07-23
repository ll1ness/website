import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const N = 8, D = 2500, ORBIT_R = 15, INTRO_D = 4000;

const DIAM = 12756; // Earth diameter km
const RATIO = (d) => Math.pow(d / DIAM, 0.4);
const AU = (au) => au * 45;

const planetDefs = [
  { pos: [AU(0.39), 0, 0],            file: 'Mercury_1_4878.glb',      color: 0x9ea4ad, ratio: RATIO(4879) },
  { pos: [AU(0.72)*Math.cos(50), 0.5, AU(0.72)*Math.sin(50)], file: 'Venus_1_12103.glb', color: 0xedd59e, ratio: RATIO(12104) },
  { pos: [AU(1.0)*Math.cos(120), -0.5, AU(1.0)*Math.sin(120)], file: 'earth.glb',       color: 0x4a90d9, ratio: RATIO(12756) },
  { pos: [AU(1.52)*Math.cos(200), 1, AU(1.52)*Math.sin(200)], file: '24881_Mars_1_6792.glb', color: 0xd4684a, ratio: RATIO(6792) },
  { pos: [AU(5.2)*Math.cos(280), -1, AU(5.2)*Math.sin(280)], file: 'jupiter.glb',       color: 0xd4a06a, ratio: RATIO(142984) },
  { pos: [AU(9.54)*Math.cos(340), 0.5, AU(9.54)*Math.sin(340)], file: 'Saturn_1_120536.glb', color: 0xe8d5a0, ratio: RATIO(120536) },
  { pos: [AU(19.2)*Math.cos(70), -0.5, AU(19.2)*Math.sin(70)], file: 'Uranus_1_51118.glb',  color: 0x7ec8e3, ratio: RATIO(51118) },
  { pos: [AU(30.1)*Math.cos(160), 1, AU(30.1)*Math.sin(160)], file: 'Neptune_1_49528.glb',  color: 0x3b6ea0, ratio: RATIO(49528) },
];
const names = ['Меркурий', 'Венера', 'Земля', 'Марс', 'Юпитер', 'Сатурн', 'Уран', 'Нептун'];

let introActive = true;
let introStart = 0;
let skyMesh = null;
let earthRadius = 0;

const loaderEl = document.getElementById('loader');
const loaderBar = document.querySelector('.loader-bar');
const uiEl = document.getElementById('ui');
let loadCount = 0;
const LOAD_TOTAL = 10;

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
scene.fog = new THREE.Fog(0x03030a, 200, 3000);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 4000);
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

const sunLight = new THREE.PointLight(0xffeedd, 60, 600);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const pivots = [];
let satPivot = null;
let sunGroup = null;
let sunState = null;

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
  pivots[2].add(sp);
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
      uniformScale(m, def.ratio);
      m.traverse((c) => { if (c.isMesh) console.log(`${names[i]} mesh:`, c.geometry.type, c.material.type, c.material.color?.getHex()); });
    } catch (err) {
      console.error(`${names[i]}: ${err}`);
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
    uniformScale(m, 0.4);

    // Sun surface shader — animated plasma/boiling
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

    // Corona — animated noise-driven outer glow
    const coronaFS = `
      uniform float uTime;
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
      void main() {
        float d = length(vPos);
        float fade = 1.0 - smoothstep(0.85, 1.5, d);
        vec3 np = vPos * 2.0 + uTime * 0.03;
        float n = snoise(np);
        float streamer = smoothstep(0.3, 0.7, n) * (1.0 - fade);
        float alpha = (fade * 0.25 + streamer * 0.4) * (0.8 + 0.2 * sin(uTime * 0.4 + d * 3.0));
        vec3 col = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.9, 0.4), n);
        gl_FragColor = vec4(col, alpha * 0.6);
      }`;
    const coronaMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vPos;
        varying vec3 vViewDir;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vPos = position;
          vViewDir = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: coronaFS,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
    const corona = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 48), coronaMat);
    sg.add(corona);

    // Flare particles
    const FLARE_N = 400;
    const fPos = new Float32Array(FLARE_N * 3);
    const fSiz = new Float32Array(FLARE_N);
    const fFlareData = [];
    for (let i = 0; i < FLARE_N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dir = new THREE.Vector3(Math.sin(phi)*Math.cos(theta), Math.sin(phi)*Math.sin(theta), Math.cos(phi));
      const dist = 1 + Math.random() * 0.15;
      fPos[i*3] = dir.x * dist;
      fPos[i*3+1] = dir.y * dist;
      fPos[i*3+2] = dir.z * dist;
      fSiz[i] = 0.02 + Math.random() * 0.04;
      fFlareData.push({ dir, speed: 0.003 + Math.random() * 0.012, life: Math.random() * 6, maxLife: 3 + Math.random() * 6 });
    }
    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    fGeo.setAttribute('size', new THREE.BufferAttribute(fSiz, 1));
    const fTex = (() => {
      const c = document.createElement('canvas'); c.width = 32; c.height = 32;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(16,16,0,16,16,16);
      g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.15,'rgba(255,200,100,0.8)');
      g.addColorStop(0.5,'rgba(255,100,30,0.3)'); g.addColorStop(1,'rgba(255,0,0,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,32,32);
      return new THREE.CanvasTexture(c);
    })();
    const flares = new THREE.Points(fGeo, new THREE.PointsMaterial({
      map: fTex, size: 0.5, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, sizeAttenuation: true, color: 0xffaa44, opacity: 0.7,
    }));
    sg.add(flares);

    sunGroup = sg;
    sunState = {
      shader: sunMat, corona: corona, flares,
      fData: fFlareData, fPos, fN: FLARE_N, sr: 1,
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

  function getCamPos(idx, t, p) {
    const def = planetDefs[idx].pos;
    const r = ORBIT_R;
    return new THREE.Vector3(
      def[0] + Math.sin(t) * Math.cos(p) * r,
      def[1] + Math.sin(p) * r,
      def[2] + Math.cos(t) * Math.cos(p) * r
    );
  }

  const introEndPos = getCamPos(2, 0, Math.PI / 4);
  const introStartPos = new THREE.Vector3(ep[0], ep[1] + 0.5, ep[2] + earthRadius);
  camera.position.copy(introStartPos);
  camera.lookAt(ep[0], 100, ep[2]);

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
    as += e.deltaY;
    if (Math.abs(as) >= 60) { go(tr + (as > 0 ? 1 : -1)); as = 0; }
    document.getElementById('scroll-hint')?.classList.toggle('hidden', tr !== 2);
  }, { passive: true });

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
    }
  }

  function smoothstep(t) { return t * t * (3 - 2 * t); }

  animate();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (satPivot) satPivot.rotation.y += 0.0006;
    if (sunGroup) sunGroup.rotation.y += 0.00015;
    if (sunState) {
      const dt = 0.016;
      sunState.shader.uniforms.uTime.value += dt;
      sunState.corona.material.uniforms.uTime.value += dt;
      const pos = sunState.flares.geometry.attributes.position.array;
      for (let i = 0; i < sunState.fN; i++) {
        const f = sunState.fData[i];
        f.life += dt;
        if (f.life >= f.maxLife) {
          f.life = 0; f.maxLife = 3 + Math.random() * 6; f.speed = 0.003 + Math.random() * 0.012;
          const th = Math.random() * 6.2832, ph = Math.acos(2 * Math.random() - 1);
          f.dir.set(Math.sin(ph)*Math.cos(th), Math.sin(ph)*Math.sin(th), Math.cos(ph));
          pos[i*3] = f.dir.x * 1; pos[i*3+1] = f.dir.y * 1; pos[i*3+2] = f.dir.z * 1;
        } else {
          const spd = f.speed * (1 - f.life / f.maxLife * 0.3);
          pos[i*3] += f.dir.x * spd; pos[i*3+1] += f.dir.y * spd; pos[i*3+2] += f.dir.z * spd;
        }
      }
      sunState.flares.geometry.attributes.position.needsUpdate = true;
      const pulse = 1 + Math.sin(t * 0.4) * 0.02;
      sunState.corona.scale.set(pulse, pulse, pulse);
    }
    pivots.forEach((p, i) => p.rotation.y += 0.0003 * (i + 1));

    pointLights.forEach((l, i) => {
      const p = planetDefs[i].pos;
      l.position.x = p[0] + Math.sin(t * 0.02 + i) * 0.5;
      l.position.z = p[2] + Math.cos(t * 0.02 + i) * 0.5;
    });

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
      camera.lookAt(ep[0], 100 * (1 - s), ep[2]);
      if (_t >= 1) {
        introActive = false;
        theta = 0; phi = Math.PI / 4;
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
        p[0] + Math.sin(theta) * Math.cos(phi) * ORBIT_R,
        p[1] + Math.sin(phi) * ORBIT_R,
        p[2] + Math.cos(theta) * Math.cos(phi) * ORBIT_R
      );
      camera.lookAt(p[0], p[1], p[2]);
    }

    comp.render();
  }
}

init();
