const startButton = document.getElementById("startButton");
const settingsButton = document.getElementById("settingsButton");
const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

startButton.addEventListener("click", startGame);
settingsButton.addEventListener("click", openSettings);

function startGame() {
    menu.style.display = "none";  // Menü ausblenden
    canvas.style.display = "block";  // Spiel sichtbar machen
    drawRoad(); // Straße zeichnen
}

function openSettings() {
    alert("Einstellungen sind noch nicht implementiert.");
}

function drawRoad() {
    // Hintergrund (Gras/Bürgersteig)
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Straße (graue Fahrbahn in der Mitte)
    ctx.fillStyle = "gray";
    ctx.fillRect(250, 0, 300, canvas.height);

    // Mittellinien (weiße Striche)
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 20]); // Strichelinie: 20px Linie, 20px Lücke
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, canvas.height);
    ctx.stroke();
}
