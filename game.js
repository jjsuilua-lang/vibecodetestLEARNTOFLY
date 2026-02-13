console.log("GAME FILE RUNNING");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;

document.getElementById("startBtn").onclick = () => {
    console.log("BUTTON CLICKED");
    document.getElementById("menu").style.display = "none";
    gameStarted = true;
};

function loop() {
    if (gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect(200, 200, 100, 100);
    }
    requestAnimationFrame(loop);
}

loop();
