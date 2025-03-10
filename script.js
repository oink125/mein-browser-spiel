import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, car;
let carSpeed = 0; // Geschwindigkeit
let carTurnSpeed = 0; // Drehgeschwindigkeit

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const menu = document.getElementById("menu");
    const gameContainer = document.getElementById("gameContainer");

    startButton.addEventListener("click", function () {
        menu.style.display = "none"; // Menü ausblenden
        gameContainer.style.display = "block"; // Spiel anzeigen
        startGame();
    });
});

function startGame() {
    scene = new THREE.Scene();

    // Kamera setzen
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10); // Kamera leicht erhöht hinter dem Auto

    // Renderer erstellen
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("gameContainer").appendChild(renderer.domElement);

    // Licht hinzufügen
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    // Straße erstellen
    const streetGeometry = new THREE.BoxGeometry(20, 0.1, 200);
    const streetMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.position.set(0, 0, 0);
    scene.add(street);

    // Mittelstreifen hinzufügen
    const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -90; i < 100; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 0.06, i);
        scene.add(stripe);
    }

    // Gehwege hinzufügen
    const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200);
    const sidewalkMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

    const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    leftSidewalk.position.set(-12.5, 0.05, 0);
    scene.add(leftSidewalk);

    const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    rightSidewalk.position.set(12.5, 0.05, 0);
    scene.add(rightSidewalk);

    // Auto-Modell laden
    const loader = new GLTFLoader();
    loader.load('models/car.glb', function (gltf) {
        car = gltf.scene;
        car.scale.set(1, 1, 1);
        car.position.set(0, 0.15, 0); // Auto auf der Straße platzieren
        scene.add(car);
    }, undefined, function (error) {
        console.error('Fehler beim Laden des Autos:', error);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (car) {
        // Bewegung basierend auf der Rotation berechnen
        car.position.z += Math.cos(car.rotation.y) * carSpeed;
        car.position.x += Math.sin(car.rotation.y) * carSpeed;
        car.rotation.y += carTurnSpeed;

        // Kamera folgt dem Auto
        camera.position.set(
            car.position.x - Math.sin(car.rotation.y) * 8,
            car.position.y + 3,
            car.position.z - Math.cos(car.rotation.y) * 8
        );
        camera.lookAt(car.position);
    }

    renderer.render(scene, camera);
}

// Tastatursteuerung
document.addEventListener("keydown", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
    if (event.key === "ArrowUp") carSpeed = 0.2; // Auto vorwärts
    if (event.key === "ArrowDown") carSpeed = -0.1; // Auto rückwärts
    if (event.key === "ArrowLeft") carTurnSpeed = 0.05; // Auto nach links drehen
    if (event.key === "ArrowRight") carTurnSpeed = -0.05; // Auto nach rechts drehen
});

document.addEventListener("keyup", function (event) {
    if (["ArrowUp", "ArrowDown"].includes(event.key)) carSpeed = 0;
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) carTurnSpeed = 0;
});

