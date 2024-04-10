import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import * as HelvetikerRegular from "three/fonts/helvetiker_regular.typeface.json" assert { type: "json" };
import * as MAIN from "./game.js";

let scene;
let camera;
let text;
let rectLight;

export function setup() {
    scene = MAIN.scene;
    camera = MAIN.camera;
    document.addEventListener("mousemove", updateMouseRotation, false);
    
    RectAreaLightUniformsLib.init();

    const textGeometry = new TextGeometry( 'Tic Tac Toe', {
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
    
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    text = new THREE.Mesh(textGeometry, material);
    textGeometry.computeBoundingBox();
    const textSize = textGeometry.boundingBox.max;
    text.geometry.center();
    scene.add(text);
    
    rectLight = new THREE.RectAreaLight(0xff0000, 10,  textSize.x, textSize.y);
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
	console.log(aspect);
    const mouseX = (-(event.clientX / window.innerWidth) * 2 + 1) * 0.15 / aspect;
    const mouseY = ((event.clientY / window.innerHeight) * 2 - 1) * 0.15 * aspect;

    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);

    const dir = vector.sub(camera.position).normalize().negate();

    text.lookAt(dir);
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