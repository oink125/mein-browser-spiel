const scene = new THREE.Scene(); // Szene global definieren
let car; // Globale Variable für das Auto
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

    function startGame() {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        gameContainer.appendChild(renderer.domElement);

        // Straße erstellen
        const streetGeometry = new THREE.BoxGeometry(20, 0.1, 200);
        const streetMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const street = new THREE.Mesh(streetGeometry, streetMaterial);
        street.position.set(0, 0, 0);
        scene.add(street);

        // 🚗 **Auto erstellen**  
        const carBodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const carBodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        carBody.position.set(0, 0.6, 0);

        const carRoofGeometry = new THREE.BoxGeometry(1.5, 0.6, 2);
        const carRoofMaterial = new THREE.MeshBasicMaterial({ color: 0x990000 });
        const carRoof = new THREE.Mesh(carRoofGeometry, carRoofMaterial);
        carRoof.position.set(0, 1.2, 0);

        car = new THREE.Group();
        car.add(carBody);
        car.add(carRoof);
        scene.add(car);

        // Kamera-Position
        camera.position.set(0, 5, 10);
        camera.lookAt(car.position);

        function animate() {
            requestAnimationFrame(animate);

            // 🚗 **Auto bewegen**
            car.position.z -= carSpeed; // Vorwärts/Rückwärts bewegen
            car.rotation.y += carTurnSpeed; // Links/Rechts drehen

            renderer.render(scene, camera);
        }
        animate();
    }
});

// 🎮 **Tastensteuerung**
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") carSpeed = 0.2; // Vorwärts
    if (event.key === "ArrowDown") carSpeed = -0.2; // Rückwärts
    if (event.key === "ArrowLeft") carTurnSpeed = 0.05; // Links drehen
    if (event.key === "ArrowRight") carTurnSpeed = -0.05; // Rechts drehen
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") carSpeed = 0;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") carTurnSpeed = 0;
});

