console.log("ARCTIC RAMP SLING LOADED");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const STATE = {
    MENU: 0,
    AIMING: 1,
    SLIDING: 2,
    FLYING: 3
};

let gameState = STATE.MENU;

const world = {
    gravity: 0.45,
    friction: 0.995,
    groundY: canvas.height - 120
};

const ramp = {
    startX: 250,
    endX: 500,
    height: 160,
    angle: 0
};

ramp.angle = Math.atan2(ramp.height, ramp.endX - ramp.startX);

const penguin = {
    x: ramp.startX,
    y: world.groundY,
    radius: 25,
    vx: 0,
    vy: 0,
    fuel: 100,
    boosting: false,
    rotation: 0
};

let cameraX = 0;
let distance = 0;

let dragData = {
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
};

const particles = [];

document.getElementById("startBtn").onclick = () => {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("hud").classList.remove("hidden");
    gameState = STATE.AIMING;
};

canvas.addEventListener("mousedown", e => {
    if (gameState !== STATE.AIMING) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left + cameraX;
    const my = e.clientY - rect.top;

    const dx = mx - penguin.x;
    const dy = my - penguin.y;

    if (Math.sqrt(dx*dx + dy*dy) < penguin.radius) {
        dragData.active = true;
        dragData.startX = e.clientX;
        dragData.startY = e.clientY;
    }
});

canvas.addEventListener("mousemove", e => {
    if (dragData.active) {
        dragData.currentX = e.clientX;
        dragData.currentY = e.clientY;
    }
});

canvas.addEventListener("mouseup", () => {
    if (!dragData.active) return;

    const dx = dragData.startX - dragData.currentX;
    const dy = dragData.startY - dragData.currentY;

    const power = 0.35;

    penguin.vx = dx * power;
    penguin.vy = dy * power;

    gameState = STATE.SLIDING;
    dragData.active = false;
});

window.addEventListener("keydown", e => {
    if (e.code === "Space" && penguin.fuel > 0) {
        penguin.boosting = true;
    }
});

window.addEventListener("keyup", e => {
    if (e.code === "Space") {
        penguin.boosting = false;
    }
});

function spawnSnow(x, y) {
    particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * -2,
        life: 40
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) particles.splice(i, 1);
    }
}

function updatePenguin() {

    if (gameState === STATE.SLIDING) {
        penguin.x += penguin.vx;
        penguin.y = world.groundY - 
            ((penguin.x - ramp.startX) * Math.tan(ramp.angle));

        if (penguin.x >= ramp.endX) {
