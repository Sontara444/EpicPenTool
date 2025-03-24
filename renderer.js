const { ipcRenderer } = require("electron");

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let penColor = "#ff0000";
let penSize = 2;

function startDraw(e) {
    drawing = true;
    draw(e);
}

function endDraw() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = penColor;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeColor(newColor) {
    penColor = newColor;
}

function changeSize(newSize) {
    penSize = newSize;
}

// ✅ Fix: Properly send event to close app
function closeApp() {
    console.log("Close button clicked! Sending close request.");
    ipcRenderer.send("close-app"); // Send event to main process
}

// ✅ Attach event listeners
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);
