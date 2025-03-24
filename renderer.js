const { ipcRenderer } = require("electron");

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

// Set initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables
let drawing = false;
let penColor = "#ff0000";
let penSize = 2;
let clickThroughEnabled = false;

// 🖌️ Start Drawing
function startDraw(e) {
    drawing = true;
    draw(e);
}

// 🛑 Stop Drawing
function endDraw() {
    drawing = false;
    ctx.beginPath();
}

// 🎨 Drawing Function
function draw(e) {
    if (!drawing) return;

    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;

    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = penColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 🧹 Clear Canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 🎨 Change Pen Color
function changeColor(newColor) {
    penColor = newColor;
    document.getElementById("colorPicker").value = newColor;
}

// 🔧 Change Pen Size
function changeSize(newSize) {
    penSize = newSize;
}

function toggleClickThrough() {
    clickThroughEnabled = !clickThroughEnabled;
    ipcRenderer.send("toggle-click-through", clickThroughEnabled);
    
    // Debugging logs
    console.log("Sent click-through:", clickThroughEnabled);

    // Update button UI (Optional)
    const button = document.getElementById("clickThroughBtn");
    button.textContent = clickThroughEnabled ? "Disable Click-Through" : "Enable Click-Through";
}

// ❌ Close App
function closeApp() {
    ipcRenderer.send("close-app");
}

// 🖱️ Attach Event Listeners
document.getElementById("clearBtn").addEventListener("click", clearCanvas);
document.getElementById("colorPicker").addEventListener("input", (e) => changeColor(e.target.value));
document.getElementById("sizePicker").addEventListener("input", (e) => changeSize(e.target.value));
document.getElementById("clickThroughBtn").addEventListener("click", toggleClickThrough);
document.getElementById("closeBtn").addEventListener("click", closeApp);


// Attach color change event to buttons
document.querySelectorAll(".color-btn").forEach((button) => {
    button.addEventListener("click", () => changeColor(button.dataset.color));
});

// 🖌️ Attach Drawing Events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchend", endDraw);
canvas.addEventListener("touchmove", draw);

// 🔄 Resize Canvas Dynamically
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
