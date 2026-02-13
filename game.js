const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let gravity = 0.4;
let airDrag = 0.998;

let groundY = canvas.height - 120;

// Ramp setup
let rampStartX = 150;
let rampEndX = 350;
let rampHeight = 120;

let launched = false;

let penguin = {
    x: rampStartX,
    y: groundY - 5,
    radius: 20,
    vx: 0,
    vy: 0,
    fuel: 100,
    boosting: false
};

let cameraX = 0;
let distanceTravelled = 0;

let dragging = false;
let dragStart = {x: 0, y: 0};
let dragCurrent = {x: 0, y: 0};

document.getElementById("startBtn").onclick = () => {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("hud").classList.remove("hidden");
    gameStarted = true;
};

canvas.addEventListener("mousedown", (e) => {
    if (!gameStarted || launched) return;

    dragging = true;
    dragStart = {x: e.clientX, y: e.clientY};
});

canvas.addEventListener("mousemove", (e) => {
    if (dragging) {
        dragCurrent = {x: e.clientX, y: e.clientY};
    }
});

canvas.addEventListener("mouseup", () => {
    if (dragging) {
        let dx = dragStart.x - dragCurrent.x;
        let dy = dragStart.y - dragCurrent.y;

        penguin.vx = dx * 0.2;
        penguin.vy = dy * 0.2;

        launched = true;
        dragging = false;
    }
});

window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && penguin.fuel > 0) {
        penguin.boosting = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        penguin.boosting = false;
    }
});

function update() {
    if (!gameStarted) return;

    if (launched) {
        penguin.vy += gravity;

        if (penguin.boosting && penguin.fuel > 0) {
            penguin.vy -= 0.6;
            penguin.fuel -= 0.5;
        }

        penguin.vx *= airDrag;
        penguin.vy *= airDrag;

        penguin.x += penguin.vx;
        penguin.y += penguin.vy;

        // Ground collision
        if (penguin.y > groundY - penguin.radius) {
            penguin.y = groundY - penguin.radius;
            penguin.vy *= -0.4;
        }

        cameraX = penguin.x - 200;
        distanceTravelled = Math.max(distanceTravelled, Math.floor(penguin.x / 10));

        document.getElementById("distance").innerText = distanceTravelled;
        document.getElementById("speed").innerText = Math.floor(Math.abs(penguin.vx));
        document.getElementById("fuel").innerText = Math.floor(penguin.fuel);
    }
}

function drawGround() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-cameraX, groundY, canvas.width * 10, canvas.height - groundY);
}

function drawRamp() {
    ctx.fillStyle = "#cccccc";
    ctx.beginPath();
    ctx.moveTo(rampStartX - cameraX, groundY);
    ctx.lineTo(rampEndX - cameraX, groundY - rampHeight);
    ctx.lineTo(rampEndX + 40 - cameraX, groundY - rampHeight);
    ctx.lineTo(rampStartX + 40 - cameraX, groundY);
    ctx.closePath();
    ctx.fill();
}

function drawPenguin() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(penguin.x - cameraX, penguin.y, penguin.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(penguin.x - cameraX - 5, penguin.y - 5, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawDragLine() {
    if (dragging) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(dragStart.x, dragStart.y);
        ctx.lineTo(dragCurrent.x, dragCurrent.y);
        ctx.stroke();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();
    drawRamp();
    drawPenguin();
    drawDragLine();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
