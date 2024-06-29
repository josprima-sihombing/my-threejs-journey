import "./style.css"
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector<HTMLElement>("canvas.three");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 1, 100);
const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
const gridHelper = new THREE.GridHelper(20, 40);
const axesHelper = new THREE.AxesHelper(10);
const controls = new OrbitControls(camera, canvas!);

const count = 5000;
const customGeometry = new THREE.BufferGeometry();
const positionsVertex = new Float32Array(count * 3 * 3);
const positionAttribute = new THREE.BufferAttribute(positionsVertex, 3);

for (let i=0;i<count * 3 * 3;i++) {
  positionsVertex[i] = (Math.random() - 0.5) * 5
}

customGeometry.setAttribute("position", positionAttribute);

const customMeshMaterial = new THREE.MeshBasicMaterial({ color: "green", wireframe: true });
const customMesh = new THREE.Mesh(customGeometry, customMeshMaterial);

customMesh.position.y = 2.5;

const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(boxGeometry, material);

box.position.set(-5, 2, 0);

camera.position.set(0, 10, 20);
controls.enableDamping = true;
controls.update();

scene.add(customMesh);
scene.add(box);
scene.add(gridHelper);
scene.add(axesHelper);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
});

window.addEventListener("dblclick", () => {
  const fullscreenElement = document.fullscreenElement;

  if (fullscreenElement) {
    document.exitFullscreen();
    return
  }

  canvas?.requestFullscreen()
})

const draw = () => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(draw);
};

draw();
