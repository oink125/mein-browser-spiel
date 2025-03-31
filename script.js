let scene, camera, renderer;
let car, speed = 0, acceleration = 0.02, maxSpeed = 2, friction = 0.98;
let turnSpeed = 0.03, currentTurnSpeed = 0;

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

    const roadGeometry = new THREE.BoxGeometry(10, 0.1, 200);
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
    leftSidewalk.position.set(-7.5, 0.05, 0);
    scene.add(leftSidewalk);

    const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    rightSidewalk.position.set(7.5, 0.05, 0);
    scene.add(rightSidewalk);

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
        speed *= friction; // Langsame Reduzierung der Geschwindigkeit
        if (speed > maxSpeed) speed = maxSpeed;
        if (speed < -maxSpeed / 2) speed = -maxSpeed / 2; // Rückwärts langsamer

        car.position.z += Math.cos(car.rotation.y) * speed;
        car.position.x += Math.sin(car.rotation.y) * speed;
        car.rotation.y += currentTurnSpeed;

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
    if (event.key === "ArrowUp" || event.key === "w") speed += acceleration;
    if (event.key === "ArrowDown" || event.key === "s") speed -= acceleration;
    if (event.key === "ArrowLeft" || event.key === "a") currentTurnSpeed = turnSpeed;
    if (event.key === "ArrowRight" || event.key === "d") currentTurnSpeed = -turnSpeed;
});

document.addEventListener("keyup", function (event) {
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key)) currentTurnSpeed = 0;
});
