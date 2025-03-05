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

        // Eine einfache Straße (graues Rechteck)
        const roadGeometry = new THREE.PlaneGeometry(10, 50);
        const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        scene.add(road);

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

// Weiße Mittelstreifen erstellen (dünne lange Rechtecke)
const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10); // Schmale und lange Streifen
const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Weiß

// Mehrere Streifen auf der Straße platzieren
for (let i = -50; i < 50; i += 20) { // Streifen alle 20 Einheiten setzen
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.set(0, 0.05, i); // In der Mitte der Straße
    scene.add(stripe);
}

