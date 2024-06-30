import "./style.css"
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

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
const gui = new GUI();

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

customMesh.geometry.dispose();
customMesh.visible = false;

const globalProperties = {
  color: "#ff0000",
  segment: 1,
};

const boxGeometry = new THREE.BoxGeometry(4, 4, 4, globalProperties.segment, globalProperties.segment, globalProperties.segment);
const material = new THREE.MeshBasicMaterial({ color: globalProperties.color });
const box = new THREE.Mesh(boxGeometry, material);

box.position.set(0, 2, 0);

camera.position.set(0, 10, 20);
controls.enableDamping = true;
controls.update();

gui.title("Box controls");

const positionGUI = gui.addFolder("Positions");
const helperGUI = gui.addFolder("Helpers");

positionGUI.close()
helperGUI.close();

positionGUI.add(box.position, "y").min(-10).max(10).step(0.01).name("elevation");
positionGUI.add(box.position, "x").min(-10).max(10).step(0.01).name("x axis");
positionGUI.add(box.position, "z").min(-10).max(10).step(0.01).name("z axis");

gui.addColor(globalProperties, "color").onChange((value: THREE.Color) => {
  box.material.color.set(value)
})

gui.add(material, "wireframe")
gui.add(globalProperties, "segment")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange((value: number) => {
    box.geometry.dispose();
    box.geometry = new THREE.BoxGeometry(4, 4, 4, value, value, value)
  });

helperGUI.add(axesHelper, "visible").name("axes helper")
helperGUI.add(gridHelper, "visible").name("grid helper")

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
