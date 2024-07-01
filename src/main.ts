import "./style.css"
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import gsap from "gsap";

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
// const controls = new OrbitControls(camera, canvas!);
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
  wireframe: false,
};

const boxGeometry = new THREE.BoxGeometry(4, 4, 4, globalProperties.segment, globalProperties.segment, globalProperties.segment);
const material = new THREE.MeshBasicMaterial({ color: globalProperties.color });
const box = new THREE.Mesh(boxGeometry, material);

box.position.set(0, 2, 0);

camera.position.y = 4
camera.position.z = 10
camera.lookAt(new THREE.Vector3())

// controls.enableDamping = true;
// controls.update();

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
// scene.add(box);
// scene.add(gridHelper);
// scene.add(axesHelper);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const floorColorTexture = textureLoader.load("/materials/wood_01/basecolor.jpg");
const floorAmbientOcclusionTexture = textureLoader.load("/materials/wood_01/ambientOcclusion.jpg");
const floorNormalTexture = textureLoader.load("/materials/wood_01/normal.jpg");
const floorRoughnessTexture = textureLoader.load("/materials/wood_01/roughness.jpg");

floorColorTexture.colorSpace = THREE.SRGBColorSpace
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorColorTexture.repeat.x=3
floorColorTexture.repeat.y=3

const groundColorTexture = textureLoader.load("/materials/ground/basecolor.png")
const groundAmbientOcclusionTexture = textureLoader.load("/materials/ground/ambientOcclusion.png")
const groundNormalTexture = textureLoader.load("/materials/ground/normal.png")
const groundRoughnessTexture = textureLoader.load("/materials/ground/roughness.png")

groundColorTexture.colorSpace = THREE.SRGBColorSpace
groundColorTexture.wrapS = THREE.RepeatWrapping
groundColorTexture.wrapT = THREE.RepeatWrapping
groundColorTexture.repeat.x=3
groundColorTexture.repeat.y=3

/**
 * Floor
 */
const floorGeometry = new THREE.BoxGeometry(3, 0.05, 3);
const floorMaterial = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(floorGeometry, floorMaterial)

floorMaterial.map = floorColorTexture
floorMaterial.aoMap = floorAmbientOcclusionTexture
floorMaterial.aoMapIntensity = 1
floorMaterial.normalMap = floorNormalTexture
floorMaterial.normalScale.set(0.5, 0.5)
floorMaterial.roughnessMap = floorRoughnessTexture
floorMaterial.roughness = 1

/**
 * Base
 */
const baseGeometry = new THREE.BoxGeometry(3.05, 0.4, 3.05)
const baseMaterial = new THREE.MeshStandardMaterial()
const base = new THREE.Mesh(baseGeometry, baseMaterial)

base.position.y = -0.2-0.025
base.position.z = -0.05/2
base.position.x = -0.05/2

baseMaterial.map = groundColorTexture
baseMaterial.aoMap = groundAmbientOcclusionTexture
baseMaterial.aoMapIntensity = 1
baseMaterial.normalMap = groundNormalTexture
baseMaterial.normalScale.set(0.5, 0.5)
baseMaterial.roughnessMap = groundRoughnessTexture
baseMaterial.roughness = 1

/**
 * Wall
 */
const wallLeftGeometry = new THREE.BoxGeometry(0.05, 2, 3.05);
const wallBehindGeometry = new THREE.BoxGeometry(3, 2, 0.05);
const wallMaterial = new THREE.MeshStandardMaterial({ color: "#778979" })
const wallLeft = new THREE.Mesh(wallLeftGeometry, wallMaterial)
const wallBehind = new THREE.Mesh(wallBehindGeometry, wallMaterial)

wallLeft.position.x = -1.5 - 0.05/2
wallLeft.position.y = 1 - 0.05/2
wallLeft.position.z = -0.05/2
wallBehind.position.y = 1 - 0.05/2
wallBehind.position.z = -1.5 - 0.05/2

/**
 * House group
 */
const houseGroup = new THREE.Group();

houseGroup.add(base, floor, wallLeft, wallBehind);
houseGroup.rotation.y = -Math.PI / 4
scene.add(houseGroup)

/**
 * Animation
 */
const timeline = gsap.timeline({ defaults: { ease: "expo" }, delay: 2 });

timeline.from(base.position, { y: -4, duration: 0.4})
timeline.from(base.scale, { x: 0, y: 0, duration: 0.4 }, "<0")
timeline.from(floor.position, { y: 2, duration: 0.4})
timeline.from(floor.scale, { x: 0, y:0, duration: 0.4 }, "<0")
timeline.from(wallLeft.position, { x: -2, duration: 0.4})
timeline.from(wallLeft.scale, { y: 0, x: 0, duration: 0.4}, "<0")
timeline.from(wallBehind.position, { z: -2, duration: 0.4})
timeline.from(wallBehind.scale, { y: 0, x : 0, duration: 0.4}, "<0")

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
const pointLightHelper = new THREE.PointLightHelper(pointLight);
pointLight.position.x = 0
pointLight.position.y = 3
pointLight.position.z = 0
scene.add(pointLight)
// scene.add(pointLightHelper)

gui.add(globalProperties, "wireframe").onChange((value: boolean) => {
  floorMaterial.wireframe = value
  wallMaterial.wireframe = value
  baseMaterial.wireframe = value
})

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

window.addEventListener("mousemove", (event) => {
  houseGroup.rotation.y = ((((event.clientX - sizes.width / 2)/sizes.width / 2) * Math.PI / 2)) - Math.PI / 4
  houseGroup.rotation.x = -(((event.clientY - sizes.height / 2)/sizes.height / 2) * Math.PI / 2)
})

const draw = () => {
  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(draw);
};

draw();
