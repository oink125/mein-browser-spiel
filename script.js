let scene, camera, renderer;
let car, velocity = 0, acceleration = 0.002, maxSpeed = 1.5, turnSpeed = 0.02;
let turning = false;

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
    camera.position.set(0, 20, -10);
    camera.lookAt(0, 1.5, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("gameContainer").appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(10, 20, 10);
    scene.add(light);

    // Straße und Kreuzung
    const roadGeometry = new THREE.BoxGeometry(10, 0.1, 200);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    scene.add(road);

    // Kreuzung (nach rechts)
    const crossroadGeometry = new THREE.BoxGeometry(50, 0.1, 10);
    const crossroad = new THREE.Mesh(crossroadGeometry, roadMaterial);
    crossroad.position.set(20, 0, 90);
    scene.add(crossroad);

    // Straßenmarkierungen
    const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 10);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -90; i < 100; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 0.06, i);
        scene.add(stripe);
    }

    // Markierung auf der Kreuzung
    for (let i = -20; i <= 20; i += 20) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(20 + i, 0.06, 90);
        stripe.rotation.y = Math.PI / 2;
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

    // Gehweg an der Kreuzung
    const crosswalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    crosswalk.scale.set(2, 1, 1);
    crosswalk.position.set(20, 0.05, 90);
    scene.add(crosswalk);

    // Gebäude
    function createBuilding(x, z) {
        const buildingGeometry = new THREE.BoxGeometry(5, 10, 5);
        const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x5555ff });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, 5, z);
        scene.add(building);
    }

    for (let i = -20; i <= 20; i += 10) {
        createBuilding(7, i * 10); // Rechts
    }

    // Auto laden
    const loader = new THREE.GLTFLoader();
    loader.load('models/car.glb', function (gltf) {
        car = gltf.scene;
        car.scale.set(0.5, 0.5, 0.5);
        car.position.set(0, 1, 0);
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
        if (!turning) {
            velocity = Math.min(velocity + acceleration, maxSpeed);
        }

        car.position.z += Math.cos(car.rotation.y) * velocity;
        car.position.x += Math.sin(car.rotation.y) * velocity;

        camera.position.set(
            car.position.x - Math.sin(car.rotation.y) * 4,
            car.position.y + 3,
            car.position.z - Math.cos(car.rotation.y) * 6
        );
        camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);
    }

    renderer.render(scene, camera);
}

// Steuerung
document.addEventListener("keydown", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s", "a", "d"].includes(event.key)) {
        event.preventDefault();
    }
    if (event.key === "ArrowUp" || event.key === "w") velocity = maxSpeed;
    if (event.key === "ArrowDown" || event.key === "s") velocity = -maxSpeed / 2;
    if (event.key === "ArrowLeft" || event.key === "a") {
        car.rotation.y += turnSpeed;
        turning = true;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        car.rotation.y -= turnSpeed;
        turning = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (["ArrowUp", "ArrowDown", "w", "s"].includes(event.key)) velocity = 0;
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key)) turning = false;
});
