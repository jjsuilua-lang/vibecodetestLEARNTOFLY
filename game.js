console.log("GAME RUNNING");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;
const friction = 0.995;

const groundY = canvas.height - 150;

const ramp = {
    startX: 200,
    endX: 450,
    height: 180
};

const rampAngle = Math.atan2(ramp.height, ramp.endX - ramp.startX);

const penguin = {
    x: ramp.startX,
    y: groundY,
    radius: 25,
    vx: 0,
    vy: 0
};

let dragging = false;
let dragStart = { x: 0, y: 0 };
let dragCurrent = { x: 0, y: 0 };

let launched = false;
let cameraX = 0;

canvas.addEventListener("mousedown", (e) => {

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left + cameraX;
    const my = e.clientY - rect.top;

    const dx = mx - penguin.x;
    const dy = my - penguin.y;

    if (Math.sqrt(dx * dx + dy * dy) < penguin.radius) {
        dragging = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    dragCurrent.x = e.clientX;
    dragCurrent.y = e.clientY;
});

canvas.addEventListener("mouseup", () => {
    if (!dragging) return;

    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;

    penguin.vx = dx * 0.35;
    penguin.vy = dy * 0.35;

    launched = true;
    dragging = false;
});

function update() {

    if (launched) {

        // Sliding on ramp
        if (penguin.x < ramp.endX) {
            penguin.x += penguin.vx;
            penguin.y = groundY - 
                ((penguin.x - ramp.startX) * Math.tan(rampAngle));
        } 
        else {
            // Flying
            penguin.vy += gravity;

            penguin.vx *= friction;
            penguin.vy *= friction;

            penguin.x += penguin.vx;
            penguin.y += penguin.vy;

            if (penguin.y > groundY) {
                penguin.y = groundY;
                penguin.vy *= -0.4;
            }
        }

        cameraX = penguin.x - 300;
    }
}

function drawGround() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-cameraX, groundY, canvas.width * 5, 300);
}

function drawRamp() {
    ctx.fillStyle = "#cccccc";
    ctx.beginPath();
    ctx.moveTo(ramp.startX - cameraX, groundY);
    ctx.lineTo(ramp.endX - cameraX, groundY - ramp.height);
    ctx.lineTo(ramp.endX + 40 - cameraX, groundY - ramp.height);
    ctx.lineTo(ramp.startX + 40 - cameraX, groundY);
    ctx.fill();
}

function drawPenguin() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(penguin.x - cameraX, penguin.y, penguin.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(penguin.x - cameraX - 8, penguin.y - 8, 10, 0, Math.PI * 2);
    ctx.fill();
}

function drawDragLine() {
    if (!dragging) return;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(dragStart.x, dragStart.y);
    ctx.lineTo(dragCurrent.x, dragCurrent.y);
    ctx.stroke();
}

function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    drawGround();
    drawRamp();
    drawPenguin();
    drawDragLine();

    requestAnimationFrame(loop);
}

loop();
