import * as THREE from "three";
import { Timer } from 'three/addons/misc/Timer.js';
import * as START from "./gameStart.js";

const renderer = new THREE.WebGLRenderer();

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

START.setup(scene, camera);

const timer = new Timer();

function animate(timestamp) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
	requestAnimationFrame(animate);

	timer.update(timestamp);
	const delta = timer.getDelta();
    START.update(delta);
    
	renderer.render(scene, camera);
}

animate();
START.start();