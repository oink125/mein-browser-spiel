let scene, camera, renderer;
let car, carSpeed = 0, carAcceleration = 0.005, carMaxSpeed = 1, carTurnSpeed = 0;
let friction = 0.98; // Verlangsamt das Auto allmählich

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
    camera.position.set(0, 5, -10);
    camera.lookAt(0, 1.5, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("gameContainer").appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(10, 20, 10);
    scene.add(light);

    // Hauptstraße
    const roadGeometry = new THREE.BoxGeometry(10, 0.1, 200);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.set(0, 0, 0);
    scene.add(road);

    // Straßenmarkierungen
    const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -90; i < 100; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 0.06, i);
        scene.add(stripe);
    }

    // Bürgersteige
    const sidewalkGeometry = new THREE.BoxGeometry(5, 0.1, 200);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    
    const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    leftSidewalk.position.set(-7.5, 0.05, 0);
    scene.add(leftSidewalk);
    
    const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    rightSidewalk.position.set(7.5, 0.05, 0);
    scene.add(rightSidewalk);

    // Abbiegung nach rechts (zusätzliche Straße)
    const turnRoadGeometry = new THREE.BoxGeometry(100, 0.1, 10);
    const turnRoad = new THREE.Mesh(turnRoadGeometry, roadMaterial);
    turnRoad.position.set(50, 0, 100);
    turnRoad.rotation.y = -Math.PI / 2;
    scene.add(turnRoad);

    // Markierungen für die Abbiegung
    for (let i = 0; i < 100; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(50 + i, 0.06, 100);
        stripe.rotation.y = -Math.PI / 2;
        scene.add(stripe);
    }

    // Bürgersteige für die Abbiegung
    const turnSidewalkLeft = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    turnSidewalkLeft.position.set(50, 0.05, 107.5);
    turnSidewalkLeft.rotation.y = -Math.PI / 2;
    scene.add(turnSidewalkLeft);

    const turnSidewalkRight = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    turnSidewalkRight.position.set(50, 0.05, 92.5);
    turnSidewalkRight.rotation.y = -Math.PI / 2;
    scene.add(turnSidewalkRight);

    // Auto laden
    const loader = new THREE.GLTFLoader();
    loader.load('models/car.glb', function (gltf) {
        car = gltf.scene;
        car.scale.set(0.5, 0.5, 0.5);
        car.position.set(0, 1, 0);
        scene.add(car);
    }, undefined, function (error) {
        console.error('Fehler beim Laden des Autos:', error);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (car) {
        // Geschwindigkeit aktualisieren mit Beschleunigung & Verzögerung
        carSpeed *= friction;
        car.position.z += Math.cos(car.rotation.y) * carSpeed;
        car.position.x += Math.sin(car.rotation.y) * carSpeed;
        car.rotation.y += carTurnSpeed;

        camera.position.set(
            car.position.x - Math.sin(car.rotation.y) * 4,
            car.position.y + 3,
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
    if (event.key === "ArrowUp" || event.key === "w") {
        if (carSpeed < carMaxSpeed) carSpeed += carAcceleration;
    }
    if (event.key === "ArrowDown" || event.key === "s") {
        if (carSpeed > -carMaxSpeed / 2) carSpeed -= carAcceleration;
    }
    if (event.key === "ArrowLeft" || event.key === "a") carTurnSpeed = 0.02;
    if (event.key === "ArrowRight" || event.key === "d") carTurnSpeed = -0.02;
});

document.addEventListener("keyup", function (event) {
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key)) carTurnSpeed = 0;
});
