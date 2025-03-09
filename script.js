import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene(); // Szene global definieren
let car; // Globale Variable für das Auto
let carSpeed = 0; // Geschwindigkeit
let carTurnSpeed = 0; // Drehgeschwindigkeit
let camera; // Kamera global definieren
let renderer; // Renderer global definieren

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const menu = document.getElementById("menu");
    const gameContainer = document.getElementById("gameContainer");

    startButton.addEventListener("click", function () {
        menu.style.display = "none"; // Menü ausblenden
        gameContainer.style.display = "block"; // Spiel anzeigen
        startGame();
    });

    function startGame() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        gameContainer.appendChild(renderer.domElement);

        // Straße erstellen
        const streetGeometry = new THREE.BoxGeometry(20, 0.1, 200);
        const streetMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const street = new THREE.Mesh(streetGeometry, streetMaterial);
        street.position.set(0, 0, 0);
        scene.add(street);

        // 3D Auto-Modell laden
        const loader = new GLTFLoader();
        loader.load('models/car.glb', function (gltf) {
            car = gltf.scene;
            car.scale.set(1, 1, 1);
            car.position.set(0, 0.2, 0);
            scene.add(car);
        }, undefined, function (error) {
            console.error('Fehler beim Laden des Autos:', error);
        });

        // Kamera hinter das Auto setzen
        camera.position.set(0, 3, 8);
        camera.lookAt(0, 0, 0);

        function animate() {
            requestAnimationFrame(animate);

            if (car) {
                car.position.z -= Math.cos(car.rotation.y) * carSpeed;
                car.position.x -= Math.sin(car.rotation.y) * carSpeed;
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
        animate();
    }
});

// Tastensteuerung (Scroll verhindern!)
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


 const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
        const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = -90; i < 100; i += 20) {
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.set(0, 0.06, i);
            scene.add(stripe);
        }

const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200);
const sidewalkMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
leftSidewalk.position.set(-12.5, 0.05, 0);
scene.add(leftSidewalk);

const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
rightSidewalk.position.set(12.5, 0.05, 0);
scene.add(rightSidewalk);
