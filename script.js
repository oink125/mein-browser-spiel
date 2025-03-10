import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
let car, carSpeed = 0, carTurnSpeed = 0;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startButton").addEventListener("click", startGame);
});

function startGame() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    initScene();
    loadCar();
    animate();
}

function initScene() {
    scene = new THREE.Scene();
    
    // Kamera höher setzen
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("gameContainer").appendChild(renderer.domElement);

    // Licht
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    // Straße
    const streetGeometry = new THREE.BoxGeometry(20, 0.1, 200);
    const streetMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    scene.add(street);

    // Mittelstreifen
    const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -90; i < 100; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 0.06, i);
        scene.add(stripe);
    }

    // Gehwege
    const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    
    const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    leftSidewalk.position.set(-12.5, 0.05, 0);
    scene.add(leftSidewalk);
    
    const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    rightSidewalk.position.set(12.5, 0.05, 0);
    scene.add(rightSidewalk);
}

function loadCar() {
    const loader = new GLTFLoader();
    loader.load('models/car.glb', function (gltf) {
        car = gltf.scene;
        car.scale.set(0.5, 0.5, 0.5);
        car.position.set(0, 0.2, 0);
        scene.add(car);
    }, undefined, function (error) {
        console.error('Fehler beim Laden des Autos:', error);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (car) {
        car.position.z += Math.cos(car.rotation.y) * carSpeed;
        car.position.x += Math.sin(car.rotation.y) * carSpeed;
        car.rotation.y += carTurnSpeed;

        // Kamera folgt dem Auto
        camera.position.set(
            car.position.x - Math.sin(car.rotation.y) * 8,
            car.position.y + 5,
            car.position.z - Math.cos(car.rotation.y) * 8
        );
        camera.lookAt(car.position);
    }

    renderer.render(scene, camera);
}

// Steuerung
document.addEventListener("keydown", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
    if (event.key === "ArrowUp") carSpeed = 0.2;
    if (event.key === "ArrowDown") carSpeed = -0.2;
    if (event.key === "ArrowLeft") carTurnSpeed = 0.05;
    if (event.key === "ArrowRight") carTurnSpeed = -0.05;
});

document.addEventListener("keyup", function (event) {
    if (["ArrowUp", "ArrowDown"].includes(event.key)) carSpeed = 0;
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) carTurnSpeed = 0;
});
