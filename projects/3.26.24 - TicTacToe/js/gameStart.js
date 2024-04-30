import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import * as HelvetikerRegular from "three/fonts/helvetiker_regular.typeface.json" assert { type: "json" };
import * as MAIN from "./game.js";

let scene;
let camera;
let nameText;
let rectLight;
let subTexts = [];

export function setup() {
    scene = MAIN.scene;
    camera = MAIN.camera;
    document.addEventListener("mousemove", updateMouseRotation, false);
    
    RectAreaLightUniformsLib.init();

    const nameTextGeometry = new TextGeometry( "Tic Tac Toe", {
        font: new FontLoader().parse(HelvetikerRegular.default),
        size: 25,
        height: 5,
        curveSegments: 50,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: -0.5,
        bevelSegments: 20
    });
    
    const simpleMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
    nameText = new THREE.Mesh(nameTextGeometry, simpleMaterial);
    nameTextGeometry.computeBoundingBox();
    const nameTextSize = nameTextGeometry.boundingBox.max;
    nameText.geometry.center();
    scene.add(nameText);

    const subTextAGeometry = new TextGeometry("Press space to play", {
        font: new FontLoader().parse(HelvetikerRegular.default),
        size: 10,
        height: 5,
        curveSegments: 50,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: -0.5,
        bevelSegments: 20
    });

    const subTextA = new THREE.Mesh(subTextAGeometry, simpleMaterial);
    subTextA.geometry.center();
    subTextA.position.y = -50;
    scene.add(subTextA);
    subTexts.push(subTextA);
    
    rectLight = new THREE.RectAreaLight(0xff0000, 10,  nameTextSize.x, nameTextSize.y);
    rectLight.position.set(0, 0, 200);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);
    
    const rectLightHelper = new RectAreaLightHelper(rectLight);
    rectLight.add(rectLightHelper);
    
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);
}

export function update(delta) {
    updateLight(delta);
    updateTexts();
    updateCamera(delta);
}

let cameraTransition = false;
let transitionDone = false;
let transitionDuration = 0;

export function start() {
    cameraTransition = true;
}

function updateCamera(delta) {
    const timeToReach = 20;
    console.log(transitionDone);
    if (!cameraTransition || transitionDone) return
    
    if (transitionDone) return;

    transitionDuration += delta;

    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    //const lerp = (start, end, t) => start * (1 - t) + end * t;

    const t = Math.min(transitionDuration / timeToReach, 1);
    if (t >= 1) {
        transitionDone = true;
    }

    const easedT = easeInOutQuad(t);

    camera.position.x += (nameText.position.x - camera.position.x) * easedT;
    camera.position.y += (nameText.position.y - camera.position.y) * easedT;
    camera.position.z += (nameText.position.z - camera.position.z) * easedT;
}

function updateTexts() {
    for (let text of subTexts) {
        text.lookAt(camera.position);
    }
}

const rainbowColors = generateRainbowColors(30);
let colorNum = 0;
function updateLight(delta) {
	rectLight.color = shiftColor(rectLight.color, delta, rainbowColors[colorNum], 30);
	if (Math.round(rectLight.color.r*100)/100 == Math.round(rainbowColors[colorNum].r*100)/100 &&
		Math.round(rectLight.color.g*100)/100 == Math.round(rainbowColors[colorNum].g*100)/100 &&
		Math.round(rectLight.color.b*100)/100 == Math.round(rainbowColors[colorNum].b*100)/100) {
		if (rainbowColors.length == ++colorNum) colorNum = 0;
	}
}

function updateMouseRotation(event) {
	const aspect = window.innerWidth / window.innerHeight;
    
    const mouseX = (-(event.clientX / window.innerWidth) * 2 + 1) * 0.15 / aspect;
    const mouseY = ((event.clientY / window.innerHeight) * 2 - 1) * 0.15 * aspect;

    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);

    const dir = vector.sub(camera.position).normalize().negate();

    nameText.lookAt(dir);
}

function shiftColor(currentColor, deltaTimeSeconds, shiftingToColor, speed) {
    const stepSize = deltaTimeSeconds * speed;

    const r = currentColor.r + (shiftingToColor.r - currentColor.r) * stepSize;
    const g = currentColor.g + (shiftingToColor.g - currentColor.g) * stepSize;
    const b = currentColor.b + (shiftingToColor.b - currentColor.b) * stepSize;

    return new THREE.Color(r, g, b);
}

function generateRainbowColors(numColors) {
    const colors = [];
    const hueStep = 360 / numColors;

    for (let i = 0; i < numColors; i++) {
        const hue = (i * hueStep) % 360;
        const color = new THREE.Color().setHSL(hue / 360, 1, 0.5);
        colors.push(color);
    }

    return colors;
}