export function setupDrawCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let elements = [];  // Array to store drawn elements (lines or text)

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    function startDrawing(event) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }

    function stopDrawing() {
        drawing = false;
        elements.push({ type: 'line', points: ctx.__currentPath });  // Save the drawn line
    }

    function draw(event) {
        if (!drawing) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();

        ctx.__currentPath = ctx.__currentPath || [];
        ctx.__currentPath.push({
            x: event.clientX - canvas.offsetLeft,
            y: event.clientY - canvas.offsetTop
        });
    }

    return {
        clearCanvas: () => {
            elements = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
        redraw: () => {
            // Redraw the elements on the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            elements.forEach(element => {
                if (element.type === 'line') {
                    ctx.beginPath();
                    element.points.forEach((point, index) => {
                        if (index === 0) {
                            ctx.moveTo(point.x, point.y);
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    });
                    ctx.stroke();
                }
            });
        }
    };
}
