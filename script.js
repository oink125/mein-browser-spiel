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
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        gameContainer.appendChild(renderer.domElement);

      // Straße erstellen (eine lange graue Fläche)
const streetGeometry = new THREE.BoxGeometry(20, 0.1, 200); // Breite 20, dünn, sehr lang
const streetMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 }); // Dunkelgrau

const street = new THREE.Mesh(streetGeometry, streetMaterial);
street.position.set(0, 0, 0); // In der Mitte der Szene platzieren
scene.add(street);


        // Eine einfache Kamera-Position
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
const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10); // Dünn und lang
const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Weiß

// Mehrere Streifen auf der Straße platzieren
for (let i = -90; i < 100; i += 20) { // Startet bei -90, geht bis 100
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.set(0, 0.06, i); // Leicht über der Straße (0.06)
    scene.add(stripe);
}

// Bürgersteige erstellen
const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200); // Breite 5, dünn, sehr lang
const sidewalkMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Grau

// Linker Bürgersteig
const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
leftSidewalk.position.set(-12.5, 0.05, 0); // Links der Straße
scene.add(leftSidewalk);

// Rechter Bürgersteig
const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
rightSidewalk.position.set(12.5, 0.05, 0); // Rechts der Straße
scene.add(rightSidewalk);
