const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let gravity = 0.4;
let drag = 0.995;
let groundY = canvas.height - 120;

let penguin = {
    x: 200,
    y: groundY - 20,
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
    if (!gameStarted) return;
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

        penguin.vx = dx * 0.15;
        penguin.vy = dy * 0.15;

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

    penguin.vy += gravity;

    if (penguin.boosting && penguin.fuel > 0) {
        penguin.vy -= 0.6;
        penguin.fuel -= 0.5;
    }

    penguin.vx *= drag;
    penguin.vy *= drag;

    penguin.x += penguin.vx;
    penguin.y += penguin.vy;

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

function drawGround() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-cameraX, groundY, canvas.width * 10, canvas.height - groundY);
}

function drawRamp() {
    ctx.fillStyle = "#cccccc";
    ctx.beginPath();
    ctx.moveTo(-cameraX + 100, groundY);
    ctx.lineTo(-cameraX + 200, groundY - 100);
    ctx.lineTo(-cameraX + 300, groundY);
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
