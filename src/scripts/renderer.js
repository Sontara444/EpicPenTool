import { setupDrawCanvas } from './draw.js';  // Drawing logic
import { setupEraseCanvas } from './eraser.js'; // Erasing logic

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 500;

    const { clearCanvas, redraw } = setupDrawCanvas(canvas);
    let elements = [];

    document.getElementById('clearBtn').addEventListener('click', () => {
        clearCanvas();
    });

    document.getElementById('pencilBtn').addEventListener('click', () => {
        // Setup drawing logic
        const { clearCanvas: clearDraw, redraw: redrawDraw } = setupDrawCanvas(canvas);
        elements = [];
        clearDraw();
        redrawDraw();
    });

    document.getElementById('eraserBtn').addEventListener('click', () => {
        // Setup erasing logic
        setupEraseCanvas(canvas, elements);
    });
});
