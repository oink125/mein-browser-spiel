const scene = new THREE.Scene(); // Scene global definieren

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
        // Erstelle eine 3D-Szene mit Three.js
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        gameContainer.appendChild(renderer.domElement);

        // Straße erstellen (eine lange graue Fläche)
        const streetGeometry = new THREE.BoxGeometry(20, 0.1, 200);
        const streetMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const street = new THREE.Mesh(streetGeometry, streetMaterial);
        street.position.set(0, 0, 0);
        scene.add(street);

        // Kamera-Position setzen
        camera.position.z = 10;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }
});

// Weiße Mittelstreifen erstellen
const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

for (let i = -90; i < 100; i += 20) {
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.set(0, 0.06, i);
    scene.add(stripe);
}

// Bürgersteige erstellen
const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200);
const sidewalkMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

// Linker Bürgersteig
const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
leftSidewalk.position.set(-12.5, 0.05, 0);
scene.add(leftSidewalk);

// Rechter Bürgersteig
const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
rightSidewalk.position.set(12.5, 0.05, 0);
scene.add(rightSidewalk);

