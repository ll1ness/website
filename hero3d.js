import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

(function () {
  'use strict';

  var canvas = document.getElementById('hero-3d');
  if (!canvas) return;

  var mq = window.matchMedia && window.matchMedia('(min-width: 1025px)');
  if (mq && !mq.matches) {
    var preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
    return;
  }

  // куб в щели между раздвинутыми половинами ASCII-арта
  var SIZE = 280;

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(SIZE, SIZE, false);
  canvas.style.width = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  var ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
  var keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);
  var rimLight = new THREE.DirectionalLight(0x8888ff, 0.5);
  rimLight.position.set(-3, 2, -4);
  scene.add(rimLight);
  var fillLight = new THREE.PointLight(0xffffff, 0.3, 20);
  fillLight.position.set(-2, -1, 3);
  scene.add(fillLight);

  var texLoader = new THREE.TextureLoader();
  var diffMap = texLoader.load('assets/textures/CubeDiffMap.png');
  diffMap.colorSpace = THREE.SRGBColorSpace;
  var specMap = texLoader.load('assets/textures/CubeSpecMap.png');

  var material = new THREE.MeshStandardMaterial({
    map: diffMap,
    roughnessMap: specMap,
    metalnessMap: specMap,
    roughness: 0.6,
    metalness: 0.4,
    envMapIntensity: 0.4
  });

  var model = null;
  var raf = 0;

  function animate() {
    raf = requestAnimationFrame(animate);
    if (model) {
      model.rotation.y += 0.004;
      model.rotation.x += 0.0015;
    }
    renderer.render(scene, camera);
  }

  var loader = new OBJLoader();
  loader.load(
    'assets/cubeTestLow01.obj',
    function (obj) {
      model = obj;
      model.traverse(function (child) {
        if (child.isMesh) child.material = material;
      });

      var box = new THREE.Box3().setFromObject(model);
      var center = box.getCenter(new THREE.Vector3());
      var size = box.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z);
      var scale = 1.6 / maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));

      scene.add(model);
      canvas.classList.add('revealed');

      var preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('hidden');

      raf = requestAnimationFrame(animate);
    },
    undefined,
    function (err) {
      console.warn('[hero3d] Failed to load OBJ:', err);
      var preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('hidden');
    }
  );

  setTimeout(function () {
    var preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 4000);

  window.addEventListener('beforeunload', function () {
    if (raf) cancelAnimationFrame(raf);
    renderer.dispose();
    material.dispose();
    diffMap.dispose();
    specMap.dispose();
  });
})();
