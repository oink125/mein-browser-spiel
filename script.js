// Three.js aus CDN laden (KEIN import nötig!)
const scene = new THREE.Scene();
let car;
let carSpeed = 0;
let carTurnSpeed = 0;
let camera;
let renderer;

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const menu = document.getElementById("menu");
    const gameContainer = document.getElementById("gameContainer");

    startButton.addEventListener("click", function () {
        menu.style.display = "none";
        gameContainer.style.display = "block";
        startGame();
    });

    function startGame() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        gameContainer.appendChild(renderer.domElement);

        // Szene, Straße, Mittellinien & Bürgersteige hinzufügen
        createEnvironment();

        // 3D Auto-Modell laden
        const loader = new THREE.GLTFLoader();
        loader.load("models/car.glb", function (gltf) {
            car = gltf.scene;
            car.scale.set(1, 1, 1);
            car.position.set(0, 0.2, 0);
            scene.add(car);
        }, undefined, function (error) {
            console.error("Fehler beim Laden des Autos:", error);
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

function createEnvironment() {
    // Straße erstellen
    const streetGeometry = new THREE.BoxGeometry(20, 0.1, 200);
    const streetMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.position.set(0, 0, 0);
    scene.add(street);

    // Mittellinien
    const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -90; i < 100; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 0.06, i);
        scene.add(stripe);
    }

    // Bürgersteige
    const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200);
    const sidewalkMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

    const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    leftSidewalk.position.set(-12.5, 0.05, 0);
    scene.add(leftSidewalk);

    const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    rightSidewalk.position.set(12.5, 0.05, 0);
    scene.add(rightSidewalk);
}

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
