import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(1, 1, 1);
directionalLight.rotation.set(1, 1, 1);
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const neptuneTexture = textureLoader.load("/textures/neptune.jpeg");

neptuneTexture.colorSpace = THREE.SRGBColorSpace;
neptuneTexture.repeat.x = 2;
neptuneTexture.repeat.y = -1.2;

neptuneTexture.wrapT = THREE.RepeatWrapping;
neptuneTexture.wrapS = THREE.RepeatWrapping;
neptuneTexture.offset.x = -3;

/**
 * Floor
 */

// Moon
const sphereGeometry = new THREE.SphereGeometry(3.5, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial();
sphereMaterial.map = neptuneTexture;
sphereMaterial.metalness = 0.3;

const neptune = new THREE.Mesh(sphereGeometry, sphereMaterial);
neptune.castShadow = true;
neptune.position.set(0.8, 0.1, 1);
neptune.rotation.z = -0.3;
scene.add(neptune);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2.87, 0.99, 8.771);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2));

// Render toneMapping
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.4;
// Render shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, canvas);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  neptune.rotation.y = elapsedTime * 0.2;
  //   directionalLight.position.z = Math.cos(elapsedTime * 0.4);

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
