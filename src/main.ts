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
const axesHelper = new THREE.AxesHelper(5);
const controls = new OrbitControls(camera, canvas!);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "green" });
const box = new THREE.Mesh(boxGeometry, material);

camera.position.set(0, 2, 10);
controls.enableDamping = true;
controls.update();

box.position.y = 0.5;

scene.add(box);
scene.add(gridHelper);
scene.add(axesHelper);
renderer.setSize(sizes.width, sizes.height);

const draw = () => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(draw);
};

draw();
