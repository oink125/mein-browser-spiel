let scene, camera, renderer;
let car, carSpeed = 0, carTurnSpeed = 0;

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const settingsButton = document.getElementById("settingsButton");
    const menu = document.getElementById("menu");
    const gameContainer = document.getElementById("gameContainer");

    startButton.addEventListener("click", function () {
        menu.style.display = "none";
        gameContainer.style.display = "block";
        startGame();
    });

    settingsButton.addEventListener("click", function () {
        alert("Einstellungen sind noch nicht verfügbar!");
    });
});

function startGame() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, -10)
    camera.lookAt(0, 1.5, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("gameContainer").appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2); // Licht verdoppeln
light.position.set(10, 20, 10); // Lichtquelle höher setzen
scene.add(light);

    const roadGeometry = new THREE.BoxGeometry(10, 0.1, 200); // Länge von 100 auf 200 erhöhen
const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
scene.add(road);

    const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -90; i < 100; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 0.06, i);
        scene.add(stripe);
    }

    const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    
    const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    leftSidewalk.position.set(-12.5, 0.05, 0);
    scene.add(leftSidewalk);
    
    const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    rightSidewalk.position.set(12.5, 0.05, 0);
    scene.add(rightSidewalk);

    function createBuilding(x, z) {
    const buildingGeometry = new THREE.BoxGeometry(5, 10, 5); // Größe des Gebäudes
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x5555ff });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, 5, z); // Position setzen
    scene.add(building);
}

// Mehrere Gebäude an der Straße platzieren
for (let i = -20; i <= 20; i += 10) {
    createBuilding(7, i * 10); // Rechts
}

    const loader = new THREE.GLTFLoader();
    loader.load('models/car.glb', function (gltf) {
        car = gltf.scene;
        car.scale.set(0.5, 0.5, 0.5);
        car.position.set(0, 1, 0);
        car.material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Testweise rot einfärben
        scene.add(car);
        console.log("Auto erfolgreich geladen:", car.position);
    }, undefined, function (error) {
        console.error('Fehler beim Laden des Autos:', error);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (car) {
        car.position.z += Math.cos(car.rotation.y) * carSpeed;
        car.position.x += Math.sin(car.rotation.y) * carSpeed;
        car.rotation.y += carTurnSpeed;

        camera.position.set(
            car.position.x - Math.sin(car.rotation.y) * 4,
            car.position.y + 3, // Kamera höher setzen
            car.position.z - Math.cos(car.rotation.y) * 6
        );
        camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);
    }
    
    renderer.render(scene, camera);
}

document.addEventListener("keydown", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s", "a", "d"].includes(event.key)) {
        event.preventDefault();
    }
    if (event.key === "ArrowUp" || event.key === "w") carSpeed = 0.2;
    if (event.key === "ArrowDown" || event.key === "s") carSpeed = -0.2;
    if (event.key === "ArrowLeft" || event.key === "a") carTurnSpeed = 0.02; // Reduzierte Drehgeschwindigkeit
    if (event.key === "ArrowRight" || event.key === "d") carTurnSpeed = -0.02; // Reduzierte Drehgeschwindigkeit
});

document.addEventListener("keyup", function (event) {
    if (["ArrowUp", "ArrowDown", "w", "s"].includes(event.key)) carSpeed = 0;
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key)) carTurnSpeed = 0;
});

