const { ipcRenderer } = require("electron");

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

// Set initial canvas size
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();

// Variables
let drawing = false;
let penColor = "#ff0000";
let penSize = 2;
let clickThroughEnabled = false;
// let history = [];
// let redoStack = []

// 🖌️ Start & Stop Drawing
const startDraw = (e) => {
    drawing = true;
    draw(e);
};

const endDraw = () => {
    drawing = false;
    ctx.beginPath();
};

// 🎨 Drawing Function
const draw = (e) => {
    if (!drawing) return;

    const { clientX, clientY } = e.touches?.[0] || e;

    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = penColor;

    ctx.lineTo(clientX, clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
};

// 🧹 Clear Canvas
const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

// 🎨 Change Pen Color & Size
const changeColor = (newColor) => {
    penColor = newColor;
    document.getElementById("colorPicker").value = newColor;
};

const changeSize = (newSize) => (penSize = newSize);

const toggleClickThrough = () => {
    clickThroughEnabled = !clickThroughEnabled;
    ipcRenderer.send("toggle-click-through", clickThroughEnabled);

    // Debugging logs
    console.log("Sent click-through:", clickThroughEnabled);

    // Update button UI
    document.getElementById("clickThroughBtn").textContent = clickThroughEnabled
        ? "Disable Click-Through"
        : "Enable Click-Through";
};

// ❌ Close App
const closeApp = () => ipcRenderer.send("close-app");


// Undo/Redo

const undo = ()=>{
    console.log("undo")

}








// 🖱️ Attach Event Listeners
document.getElementById("clearBtn").addEventListener("click", clearCanvas);
document.getElementById("colorPicker").addEventListener("input", (e) => changeColor(e.target.value));
document.getElementById("sizePicker").addEventListener("input", (e) => changeSize(e.target.value));
document.getElementById("clickThroughBtn").addEventListener("click", toggleClickThrough);
document.getElementById("closeBtn").addEventListener("click", closeApp);

// Attach color change event to buttons
document.querySelectorAll(".color-btn").forEach((button) =>
    button.addEventListener("click", () => changeColor(button.dataset.color))
);

// 🖌️ Attach Drawing Events
["mousedown", "touchstart"].forEach((event) => canvas.addEventListener(event, startDraw));
["mouseup", "touchend"].forEach((event) => canvas.addEventListener(event, endDraw));
["mousemove", "touchmove"].forEach((event) => canvas.addEventListener(event, draw));

// 🔄 Resize Canvas Dynamically
window.addEventListener("resize", resizeCanvas);
