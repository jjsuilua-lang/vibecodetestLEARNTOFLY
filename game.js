const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let gravity = 0.5;
let airDrag = 0.999;

let groundY = canvas.height - 120;

let rampStartX = 200;
let rampEndX = 400;
let rampHeight = 140;

let launched = false;

let penguin = {
    x: rampStartX,
    y: groundY - 10,
    radius: 25,
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

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left + cameraX;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - penguin.x;
    const dy = mouseY - penguin.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < penguin.radius) {
        dragging = true;
        dragStart = {x: e.clientX, y: e.clientY};
    }
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

        penguin.vx = dx * 0.3;
        penguin.vy = dy * 0.3;

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
            penguin.vy -= 0.8;
            penguin.fuel -= 0.6;
        }

        penguin.vx *= airDrag;
        penguin.vy *= airDrag;

        penguin.x += penguin.vx;
        penguin.y += penguin.vy;

        if (penguin.y > groundY - penguin.radius) {
            penguin.y = groundY - penguin.radius;
            penguin.vy *= -0.3;
        }

        cameraX = penguin.x - 300;
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
    ctx.fillStyle = "#bbbbbb";
    ctx.beginPath();
    ctx.moveTo(rampStartX - cameraX, groundY);
    ctx.lineTo(rampEndX - cameraX, groundY - rampHeight);
    ctx.lineTo(rampEndX + 50 - cameraX, groundY - rampHeight);
    ctx.lineTo(rampStartX + 50 - cameraX, groundY);
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
    ctx.arc(penguin.x - cameraX - 7, penguin.y - 7, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawDragLine() {
    if (dragging) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(dragStart.x, dragStart.y);
        ctx.lineTo(dragCurrent.x, dragCurrent.y);
        ctx.stroke();
    }
}

function drawInstructions() {
    if (!launched) {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Click and drag the penguin backwards to launch!", 40, 60);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();
    drawRamp();
    drawPenguin();
    drawDragLine();
    drawInstructions();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
