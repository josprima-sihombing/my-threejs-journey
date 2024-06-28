import "./style.css"
import * as THREE from "three";
import gsap from "gsap";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector("canvas.three");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height);
const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
const axesHelper = new THREE.AxesHelper(5);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "green" });
const box = new THREE.Mesh(boxGeometry, material);
const box2 = new THREE.Mesh(boxGeometry, material);

const boxGroup = new THREE.Group();

boxGroup.add(box, box2);

camera.position.z = 6;
camera.position.x = 1;
camera.position.y = 1;

box2.position.y = 1.5;

camera.lookAt(box.position);
scene.add(boxGroup);
scene.add(axesHelper);
renderer.setSize(sizes.width, sizes.height);

gsap.to(boxGroup.rotation, { y: Math.PI, duration: 2, repeat: -1, ease: "none" })

const draw = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
};

draw();
