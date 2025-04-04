import { setupDrawCanvas } from './draw.js';  // Drawing logic
import { setupEraseCanvas } from './eraser.js'; // Erasing logic

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 500;

    let elements = [];
    const { clearCanvas, redraw } = setupDrawCanvas(canvas, elements);
    
    setupEraseCanvas(canvas, elements, redraw);

    // Button Event Listeners
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    
    // Pencil Button (Drawing Mode)
    document.getElementById('pencilBtn').addEventListener('click', () => {
        const { clearCanvas: clearDraw, redraw: redrawDraw } = setupDrawCanvas(canvas, elements);
        elements = []; // Reset elements for new drawing
        clearDraw();
        redrawDraw();
    });
    
    // Eraser Button (Erasing Mode)
    document.getElementById('eraserBtn').addEventListener('click', () => {
        setupEraseCanvas(canvas, elements, redraw);
    });
});
